use std::sync::Arc;
use hashbrown::HashMap;
use crate::json::JsonValue;

#[derive(Clone)]
pub struct ClientCache {
  // pub guilds: HashMap<SharedString, Guild>,
  pub guilds: HashMap<Arc<str>, JsonValue>,
}

impl ClientCache {
  pub fn new() -> Self {
    ClientCache {
      guilds: HashMap::new()
    }
  }
}
