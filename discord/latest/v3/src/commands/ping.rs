use std::time::Instant;
use serde_json::json;
use crate::{ json::JsonValue, client::DiscordClient, RefMut };

pub async fn ping(client: RefMut<DiscordClient>, author_obj: JsonValue, channel_id: &str) {
  let client = client.lock().await;
  let content = "Calculando...";
  let mut data = json!({
    "embeds": [{
      "author": author_obj,
      "title": "Ping",
      "description": content,
      "color": 0x5050ff
    }]
  });
  let start = Instant::now();
  let sent = client.send_message_with_json(channel_id, &data).await;
  let end = Instant::now() - start;

  let sent_id = sent["id"].as_str().unwrap();
  let new_content = format!("{} ms", end.as_millis());
  *data["embeds"][0].get_mut("description").unwrap() = JsonValue::String(new_content);

  client.edit_message_with_json(channel_id, sent_id, &data).await;
}
