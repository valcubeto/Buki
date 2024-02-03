use hashbrown::HashMap;
use std::{
  fs::read_to_string,
  rc::Rc
};

pub type StringPtr = Rc<str>;

fn main() {
  let mut env: HashMap<StringPtr, StringPtr> = HashMap::new();
  for line in read_to_string("./.env").unwrap().lines() {
    let pair = line.splitn(2, '=').collect::<Vec<_>>();
    let (key, value) = (pair[0].trim(), pair[1].trim());
    env.insert(key.into(), value.into());
  };

  //
}
