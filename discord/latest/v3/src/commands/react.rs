use crate::client::DiscordClient;
use crate::patterns::UNICODE_OR_DISCORD_EMOJI;
use crate::json::JsonValue;
use crate::RefMut;

pub async fn react(client: RefMut<DiscordClient>, content: &str, channel_id: &str, message_id: &str, _author_obj: JsonValue) {
  let client = client.lock().await;

  let args: Vec<&str> = content.split_whitespace().collect();
  if args.is_empty() {
    client.send_message(channel_id, "**Usage**: `.react <emoji>`").await;
    return;
  }

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
