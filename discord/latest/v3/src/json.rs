use serde_json::Value;
pub type JsonValue = Value;

pub trait ParseJson: AsRef<str> {
  #[inline]
  fn parse_json(&self) -> JsonValue {
    serde_json::from_str(self.as_ref())
      .unwrap_or_else(|err| panic!("Failed to load the data as JSON: {err}"))
  }
}
impl ParseJson for &str {}
impl ParseJson for String {}

pub trait DisplayJson: serde::ser::Serialize {
  fn display(&self) -> String {
    serde_json::to_string(self)
      .unwrap_or_else(|err| panic!("Failed to display the JSON Value as a string: {err}"))
  }
  #[allow(unused)]
  fn display_pretty(&self) -> String {
    serde_json::to_string_pretty(self)
      .unwrap_or_else(|err| panic!("Failed to display the JSON Value as a pretty string: {err}"))
  }
}
impl DisplayJson for JsonValue {}