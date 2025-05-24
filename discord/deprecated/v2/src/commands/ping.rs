use std::time::Instant;
use serenity::{
  framework::standard::{ macros::command, Args, CommandResult },
  prelude::Context,
  model::prelude::Message
};

#[command]
pub async fn ping(ctx: &Context, msg: &Message, _args: Args) -> CommandResult {
  let start = Instant::now();

  let mut sent = msg.channel_id.say(&ctx.http, "Calculating time...").await?;

  let elapsed = Instant::now() - start;

  sent.edit(&ctx, |sent| {
    sent.content(format!("Pong! {} ms", elapsed.as_millis()))
  }).await?;

  Ok(())
}