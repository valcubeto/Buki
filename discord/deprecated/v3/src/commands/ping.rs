use std::time::Instant;
use crate::{ json::JsonValue, client::DiscordClient, RefMut };

pub async fn ping(client: RefMut<DiscordClient>, _author_obj: JsonValue, channel_id: &str) {
  let client = client.lock().await;
  let start = Instant::now();
  let sent = client.send_message(channel_id, "Calculando...").await;
  let end = Instant::now() - start;
  let sent_id = sent["id"].as_str().unwrap();
  client.edit_message(channel_id, sent_id, format!("**Ping**: {} ms", end.as_millis())).await;
}
