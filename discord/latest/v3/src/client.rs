use serde_json::json;
use futures_util::{ SinkExt as _, StreamExt as _ };
use reqwest::Client as ReqwestClient;
use websocket_lite::{ ClientBuilder as WebSocketClient, Message, Opcode };
use rand::Rng;
use tokio::time::sleep;
use tokio::sync::Mutex;
use std::time::{ Duration, Instant };
use std::sync::Arc;
use crate::cache::ClientCache;
use crate::env::get_env;
// discapi::Guild
use crate::json::{ JsonValue, ParseJson as _, DisplayJson as _ };
#[allow(unused_imports)]
use crate::{ debug_msg, debug, debug_display, intents, gateway_opcodes };

pub const API_URL: &str = "https://discord.com/api/v10";
pub const GATEWAY_URL: &str = "wss://gateway.discord.gg/?v=10&encoding=json";

#[derive(Clone)]
pub struct DiscordClient {
  pub token: String,
  pub channels: Vec<String>,
  pub http_client: ReqwestClient,
  /// Number of identify requests allowed per 5 seconds
  pub max_concurrency: i64,
  pub heartbeat_interval: Arc<Mutex<Instant>>,
  pub intents: u64,
  pub session_id: Option<String>,
  pub resume_gateway_url: Option<String>,
  pub sequence_number: Arc<Mutex<Option<i64>>>,
  pub cache: ClientCache
}

impl DiscordClient {
  pub fn new(token: String) -> Self {
    DiscordClient {
      token,
      channels: Vec::new(),
      http_client: ReqwestClient::builder()
        .user_agent("Buki/v0.1")
        .build()
        .unwrap_or_else(|err| panic!("Failed to build the reqwest client: {err}")),
      max_concurrency: 0,
      heartbeat_interval: Arc::new(Mutex::new(Instant::now())),
      intents:
          intents::GUILDS
        | intents::GUILD_MESSAGES
        | intents::MESSAGE_CONTENT,
      resume_gateway_url: None,
      session_id: None,
      sequence_number: Arc::new(Mutex::new(None)),
      cache: ClientCache::new()
    }
  }

  pub async fn add_reaction(&self, channel_id: &str, message_id: &str, emoji: &str) {
    let url = format!("{API_URL}/channels/{channel_id}/messages/{message_id}/reactions/{emoji}/@me");
    self.http_client
      .put(url)
      .header("Authorization", format!("Bot {}", self.token))
      .header("Content-Length", "0")
      .send().await
      .unwrap_or_else(|err| panic!("Failed to react with {emoji:?}: {err}"));
  }

  /// Sends the content to the specified channel and
  /// returns the parsed message object
  pub async fn send_message<T: ToString>(&self, channel_id: &str, content: T) -> JsonValue {
    let request = self.http_client
      .post(format!("{API_URL}/channels/{channel_id}/messages"))
      .header("Authorization", format!("Bot {}", self.token))
      .header("Content-Type", "application/json")
      // this looks a bit strange but its actually
      // something like `{"content":"Hello"}`
      .body(format!(r#"{{"content":{:?}}}"#, content.to_string()));

    let response = request
      .send().await
      .unwrap_or_else(|err| panic!("Failed to make the request to send a message to channel #{channel_id}: {err}"))
      .error_for_status()
      .unwrap_or_else(|err| panic!("Failed to send a message to channel #{channel_id}: {err}"));

    let text = response.text().await.unwrap();

    text.parse_json()
  }
  pub async fn send_message_with_json(&self, channel_id: &str, content: &JsonValue) -> JsonValue {
    // TODO: I should return after send() so there is a possibility to
    // send multiple messages at a time
    // maybe return 'impl Future' returning 'SendMessageTask'
    // so you can await it later

    let request = self.http_client
      .post(format!("{API_URL}/channels/{channel_id}/messages"))
      .header("Authorization", format!("Bot {}", self.token))
      .header("Content-Type", "application/json")
      // this looks a bit strange but its actually
      // something like {"content":"Hello"}
      .body(content.display());

    let response = request
      .send().await
      .unwrap_or_else(|err| panic!("Failed to make the request to send a message to channel #{channel_id}: {err}"))
      .error_for_status()
      .unwrap_or_else(|err| panic!("Failed to send a message to channel #{channel_id}: {err}"));

    let text = response.text().await.unwrap();
    text.parse_json()
  }
  pub async fn try_send_message_with_json(&self, channel_id: &str, content: &JsonValue) -> Result<JsonValue, reqwest::Error> {
    let request = self.http_client
      .post(format!("{API_URL}/channels/{channel_id}/messages"))
      .header("Authorization", format!("Bot {}", self.token))
      .header("Content-Type", "application/json")
      .body(content.display());

    let response = request
      .send().await?
      .error_for_status()?;

    let text = response.text().await.unwrap();
    Ok(text.parse_json())
  }

  pub async fn edit_message<T: ToString>(&self, channel_id: &str, message_id: &str, new_content: T) {
    self.edit_message_with_json(channel_id, message_id, &json!({ "content": new_content.to_string() })).await;
  }
  pub async fn edit_message_with_json(&self, channel_id: &str, message_id: &str, new_content: &JsonValue) {
    let request = self.http_client
      .patch(format!("{API_URL}/channels/{}/messages/{}", channel_id, message_id))
      .header("Authorization", format!("Bot {}", self.token))
      .header("Content-Type", "application/json")
      .body(new_content.display());
    request
      .send().await
      .unwrap_or_else(|err| panic!("Failed to edit a message: {err}"));
    // let text = response
    //   .text()
    //   .await
    //   .expect("Not-text response when editing a message");
    // just use the message_id you had
    // text.parse_json()
  }

  /// Adds a channel to be listened at
  pub fn listen(&mut self, channel_id: &str) -> &mut Self {
    self.channels.push(channel_id.to_string());
    self
  }

  pub async fn login(&mut self) {
    loop {
      // If there is an error, it just panics. 
      self.connect().await;
      debug_msg!("Reconnecting...");
    }
  }

  /// Connects with the Discord gateway creating a WebSocket
  pub async fn connect(&mut self) {
    let request = self.http_client
      .get(format!("{API_URL}/gateway/bot"))
      .header("Authorization", format!("Bot {}", self.token));

    let response = request
      .send().await
      .unwrap_or_else(|err| panic!("Failed to GET /gateway/bot: {err}"));

    let status = response.status();
    if !status.is_success() {
      println!("response.body = {}", response.text().await.unwrap());
      panic!("GET /gateway/bot: {status}");
    }
    self.max_concurrency = response
      .text().await
      .unwrap()
      .parse_json()
      ["session_start_limit"]
      ["max_concurrency"]
      .as_i64()
      .expect("max_concurrency was not a valid i64");

    let mut ws = WebSocketClient::new(GATEWAY_URL)
      .unwrap_or_else(|err| panic!("Failed to parse the URL: {err}"))
      .async_connect().await
      .unwrap_or_else(|err| panic!("Failed to connect with the WebSocket server: {err}"));

    let heartbeat_interval = ws
      .next().await
      .expect("No 'hello' message")
      .unwrap_or_else(|err| panic!("{err}"))
      .as_text()
      .expect("Failed to convert the 'hello' message into text")
      .parse_json()
      ["d"]
      ["heartbeat_interval"]
      .as_u64()
      .expect("hello.d.heartbeat_interval was not a valid u64");
    *self.heartbeat_interval.lock().await = Instant::now() + Duration::from_millis(heartbeat_interval);
    debug_msg!("Heartbeat interval: {heartbeat_interval}");

    let identify_payload = json!({
      "op": gateway_opcodes::IDENTIFY,
      "d": {
        "token": self.token,
        "intents": self.intents,
        "properties": {
          "os": "windows",
          "browser": "none",
          "device": "none",
        }
      }
    }).to_string();

    ws.send(Message::text(identify_payload)).await
      .unwrap_or_else(|err| panic!("Failed to send Identify payload: {err}"));

    let sequence_number2 = Arc::clone(&self.sequence_number);
    let heartbeat_interval2 = Arc::clone(&self.heartbeat_interval);
    let ws = Arc::new(Mutex::new(ws));
    let ws2 = Arc::clone(&ws);

    let heartbeat_loop = tokio::spawn(async move {
      // Sender loop
      loop {
        let interval = *heartbeat_interval2.lock().await;
        let duration = interval - Instant::now() + Duration::from_millis(jitter());
        sleep(duration).await;
        *heartbeat_interval2.lock().await = Instant::now() + Duration::from_millis(heartbeat_interval);
        let sequence_number = (*sequence_number2.lock().await)
          .map(|n| n.to_string()).unwrap_or("null".to_string());
        let payload = format!(r#"{{"op":{},"d":{}}}"#, gateway_opcodes::HEARTBEAT, sequence_number);

        ws2.lock().await
          .send(Message::text(payload)).await
          .unwrap_or_else(|err| panic!("Failed to send heartbeat: {err}"));
      }
    });

    // Receiver loop
    loop {
      // Sleep 2 seconds before trying to receive a message
      sleep(Duration::from_secs(2)).await;
      let mut ws_lock = ws.lock().await;
      let timeout = *self.heartbeat_interval.lock().await - Instant::now();
      let timeout_future = tokio::time::timeout(timeout, ws_lock.next());

      let msg = match timeout_future.await {
        Ok(msg) => msg,
        Err(_elapsed) => {
          *self.heartbeat_interval.lock().await = Instant::now() + Duration::from_millis(heartbeat_interval);
          drop(ws_lock);
          continue;
        }
      };
      let msg = match msg {
        None => break,
        Some(msg) => msg
      };
      let msg = match msg {
        Ok(msg) => msg,
        Err(err) => {
          eprintln!("Connection closed: {err}");
          break;
        }
      };

      match msg.opcode() {
        Opcode::Ping => {
          ws.lock().await
            .send(Message::pong(msg.into_data())).await
            .unwrap_or_else(|err| panic!("Failed to send a pong: {err}"));
        }
        Opcode::Pong => {}
        Opcode::Close => {
          debug_msg!("Connection closed by the gateway");
          break;
        }
        Opcode::Binary => debug_msg!("Binary message received (ignored)"),
        Opcode::Text => {
          let data = msg.as_text().unwrap().parse_json();
          if self.handle_text(data).await.is_none() {
            return;
          };
        } // Text
      } // match opcode
    } // loop
    let _ = ws.lock().await.send(Message::close(None)).await;
    heartbeat_loop.abort();
  }
  async fn handle_text(&mut self, data: JsonValue) -> Option<()> {
    if let Some(n) = data["s"].as_i64() {
      *self.sequence_number.lock().await = Some(n);
    }
    let op_code = data["op"].as_u64().expect("No op code");
    use gateway_opcodes as oc;
    match op_code {
      oc::HEARTBEAT_ACK => {}
      oc::RECONNECT | oc::INVALID_SESSION => {
        // Skip to reconnect
        return None;
      }
      oc::DISPATCH => {
        let event_name = data["t"].as_str().expect("No event name at event dispatch");
        let data = data["d"].clone();
        match event_name {
          "READY" => {
            debug_msg!("Bot ready");
            self.session_id = Some(data["session_id"].as_str().unwrap().to_string());
            self.resume_gateway_url = Some(data["resume_gateway_url"].as_str().unwrap().to_string());
          },
          "MESSAGE_CREATE" => {
            // Una paja cambiar toda la implementacion para que self sea directamente un Arc
            tokio::spawn(crate::message_handler::on_message(Arc::new(Mutex::new(self.clone())), data));
          },
          "GUILD_CREATE" => {
            // let guild_obj = Guild::from(data);
            // self.cache.guilds.insert(guild_obj.id.clone(), guild_obj);
            let p = data["id"].clone();
            let id = p.as_str().unwrap();
            self.cache.guilds.insert(Arc::from(id), data);
          }
          "MESSAGE_UPDATE" => {
            let author_id = data["author"]["id"].as_str().unwrap();
            if author_id == get_env("BOT_USER_ID") {
              return Some(());
            }
            // TODO: handle
          }
          _ => debug_msg!("Received an event: {event_name:?}")
        }
      },
      _ => unimplemented!("op_code = {op_code}")
    }
    Some(())
  }
}

pub fn jitter() -> u64 {
  rand::thread_rng().gen_range(1..=1000)
}
