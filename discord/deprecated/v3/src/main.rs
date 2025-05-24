extern crate dotenv;
extern crate serde_json;
extern crate reqwest;
extern crate tokio;
extern crate rand;
extern crate websocket_lite;
extern crate futures_util;
extern crate hashbrown;
extern crate regex;
extern crate chrono;
extern crate ngrok;
extern crate rocket;

mod patterns;
mod env;
mod terminal;
/// These intent bitflags are used to specify what events and data you want to receive. <br />
/// For example: `513` is the result of performing the 'bit or' operation `GUILDS | GUILD_MESSAGES`
#[allow(unused)]
mod intents;
#[allow(unused)]
mod gateway_opcodes;
mod json;
mod types;
// mod discapi;
mod cache;
mod client;
mod message_handler;
mod commands;

#[cfg(test)]
mod tests;
mod util;

use std::sync::Arc;

use env::get_env;
use client::DiscordClient;
use tokio::sync::Mutex;

pub type RefMut<T> = Arc<Mutex<T>>;

#[tokio::main]
async fn main() {
  // Git kept uploading my .env file so I moved it to another place
  // dotenv::dotenv().expect("Failed to load .env file");
  dotenv::from_filename("secret/.env").expect("Failed to load .env file");

  let channel_id = "1184915569602986127";

  let mut client = DiscordClient::new(get_env("BOT_TOKEN"));
  client.listen(channel_id);

  client.login().await;
}
