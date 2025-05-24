use std::sync::Arc;

use serde_json::json;
use tokio::sync::Mutex;
use crate::{
  json::JsonValue,
  client::DiscordClient,
  patterns::PREFIX_AND_COMMAND,
  commands,
  env::get_env
};

// GET /{hash}.png{?size={128~2048}}
pub const AVATARS_URL: &str = "https://cdn.discordapp.com/avatars";
// GET /{discriminator % 5}.png
// pub const DEFAULT_AVATARS_URL: &str = "https://cdn.discordapp.com/embed/avatars";

pub async fn on_message(client: Arc<Mutex<DiscordClient>>, msg: JsonValue) {
  let author = &msg["author"];
  let author_id = author["id"].as_str().unwrap();

  if author_id == get_env("BOT_USER_ID") {
    return;
  }

  let content = msg["content"].as_str().expect("Message with no content");

  let Some(channel_id) = msg["channel_id"].as_str() else { return; };

  let (command, content) = match PREFIX_AND_COMMAND.captures(content) {
    Some(caps) => {
      let command = match caps.get(1) {
        Some(command) => command.as_str(),
        None => return
      };
      let content = match caps.get(2) {
        Some(content) => content.as_str(),
        None => ""
      };
      (command, content)
    },
    None => return
  };

  let message_id = msg["id"].as_str().unwrap();
  let member = &msg["member"];
  let member_name = member["nick"].as_str().unwrap_or_else(|| {
    author["global_name"].as_str().unwrap_or_else(|| {
      author["username"].as_str().unwrap_or("(unnamed)")
    })
  });
  let icon_id = member["avatar"].as_str()
    .unwrap_or_else(|| author["avatar"].as_str().expect("User with no avatar"));
  let icon_url = format!("{AVATARS_URL}/{author_id}/{icon_id}.png");
  let author_name = format!("\u{203a}\u{203a}\u{203a}  {member_name}");
  let author_obj = json!({
    "name": author_name,
    "icon_url": icon_url
  });

  match command {
    "ping" => commands::ping(client, author_obj, channel_id).await,
    "sendjson" => commands::sendjson(client, content, author_id, channel_id).await,
    "react" => commands::react(client, content, channel_id, message_id, author_obj).await,
    _ => ()
  }
}
