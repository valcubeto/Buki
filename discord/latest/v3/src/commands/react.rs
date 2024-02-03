use serde_json::json;

use crate::{
  client::DiscordClient,
  patterns::{ SPACES, UNICODE_OR_DISCORD_EMOJI },
  json::JsonValue, RefMut
};

pub async fn react(client: RefMut<DiscordClient>, content: &str, channel_id: &str, message_id: &str, author_obj: JsonValue) {
  let client = client.lock().await;
  if content.is_empty() {
    let embed = json!({
      "embeds": [{
        "author": author_obj,
        "color": 0xff5050,
        "title": "Usage",
        "description": "`.react <emoji>`"
      }]
    });
    client.send_message_with_json(channel_id, &embed).await;
    return;
  }
  let args: Vec<&str> = SPACES.split(content).collect();

  let emoji: &str = match UNICODE_OR_DISCORD_EMOJI.captures(args[0]) {
    None => {
      client.send_message(channel_id, "Invalid emoji").await;
      return
    }
    Some(caps) => {
      if let Some(emoji) = caps.name("unicode") {
        emoji.as_str()
      } else {
        // include the 'a:' prefix if present
        let animated = caps.name("animated").unwrap();
        let name = caps.name("name").unwrap();
        let id = caps.name("id").unwrap();
        if animated.is_empty() {
          &args[0][name.start()..id.end()]
        } else {
          &args[0][animated.start()..id.end()]
        }
      }
    }
  };
  client.add_reaction(channel_id, message_id, emoji).await;
}