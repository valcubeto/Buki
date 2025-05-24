use std::process::Command;
use serde_json::json;

use crate::{
  client::DiscordClient, debug_msg, env::get_env, json::JsonValue, patterns::MARKDOWN_CODE, util::StringUtil as _, RefMut
};


pub async fn sendjson(client: RefMut<DiscordClient>, content: &str, author_id: &str, channel_id: &str) {
  let client = client.lock().await;
  if author_id != get_env("OWNER_ID") { return }

  let mut content = MARKDOWN_CODE.replace(content, "$1").to_string();
  if !content.contains("return") {
    content = format!("return {content}");
  }
  let output = Command::new("node")
    .arg("-p")
    .arg(format!("JSON.stringify((()=>{{{content}}})())"))
    .output();
  let output = match output {
    Ok(data) => data,
    Err(err) => {
      client.send_message(channel_id, format!("Failed to execute the command: {err}")).await;
      return;
    }
  };
  let error = std::str::from_utf8(&output.stderr).unwrap();
  if !error.is_empty() {
    client.send_message(channel_id, format!("```log\n{}\n```", error/* .replace('`', r"\`") */)).await;
    return;
  }
  let json = std::str::from_utf8(&output.stdout).unwrap();

  let data: JsonValue = match serde_json::from_str::<JsonValue>(json) {
    Ok(data) => data,
    Err(err) => {
      let err = err.to_string().capitalize();
      let embed = json!({
        "embeds": [{
          "color": 0xff5050,
          "title": err,
          "description": json
        }]
      });
      client.send_message_with_json(channel_id, &embed).await;
      return;
    }
  };

  if let Err(err) = client.try_send_message_with_json(channel_id, &data).await {
    client.send_message(channel_id, err).await;
  };
}
