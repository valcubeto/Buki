mod commands;

use std::{ collections::HashSet, env, sync::Arc };

pub use serenity::{
  async_trait,
  client::bridge::gateway::ShardManager,
  framework::{ standard::macros::group, StandardFramework },
  http::Http,
  model::{ event::ResumedEvent, gateway::Ready, prelude::Message },
  prelude::*,
};
use tracing::{ error, info };

use crate::commands::ping::PING_COMMAND;

pub struct ShardManagerContainer;

impl TypeMapKey for ShardManagerContainer {
  type Value = Arc<Mutex<ShardManager>>;
}

struct Handler;

#[async_trait]
impl EventHandler for Handler {
  async fn ready(&self, _: Context, ready: Ready) {
    info!("Connected as {}", ready.user.name);
  }

  async fn resume(&self, _: Context, _: ResumedEvent) {
    info!("Resumed");
  }

  // async fn message(&self, ctx: Context, msg: Message) {
  //   let _ = msg.reply(&ctx.http, "puaj negros").await;
  // }
}

#[group]
#[commands(ping)]
struct General;

#[tokio::main]
async fn main() {
  dotenv::dotenv()
    .expect("Failed to load .env file");

  tracing_subscriber::fmt::init();

  let token = env::var("BUKI_TOKEN")
    .expect("Expected a token in the environment");

  let http = Http::new(&token);

  let (owners, _bot_id) = match http.get_current_application_info().await {
    Ok(info) => {
      let mut owners = HashSet::new();
      owners.insert(info.owner.id);

      (owners, info.id)
    },
    Err(why) => panic!("Could not access application info: {:?}", why),
  };

  let framework = StandardFramework::new()
    .configure(|c| c.owners(owners).prefix("!"))
    .group(&GENERAL_GROUP);

  let intents = GatewayIntents::GUILD_MESSAGES
    | GatewayIntents::DIRECT_MESSAGES
    | GatewayIntents::MESSAGE_CONTENT;
  let mut client = Client::builder(&token, intents)
    .framework(framework)
    .event_handler(Handler)
    .await
    .expect("Err creating client");

  client.data.write().await
    .insert::<ShardManagerContainer>(client.shard_manager.clone());

  let shard_manager = client.shard_manager.clone();

  tokio::spawn(async move {
    tokio::signal::ctrl_c().await.expect("Could not register Ctrl+C handler");
    shard_manager
      .lock().await
      .shutdown_all().await;
  });

  if let Err(why) = client.start().await {
    error!("Client error: {:?}", why);
  }
}