pub trait StringUtil: AsRef<str> {
  fn capitalize(&self) -> String {
    let string = self.as_ref();
    if string.is_empty() {
      return String::new();
    }
    let mut chars = string.chars();
    let mut result = String::with_capacity(string.len());
    for c in chars.next().unwrap().to_uppercase() {
      result.push(c);
    }
    for c in chars {
      result.push(c);
    }
    result
  }
  fn title_case(&self) -> String {
    let string = self.as_ref();
    let mut result = String::with_capacity(string.len());
    let mut capitalize_next = false;
    for c in string.chars() {
      if c.is_whitespace() {
        capitalize_next = true;
        continue;
      }
      if capitalize_next {
        capitalize_next = false;
        for ch in c.to_uppercase() {
          result.push(ch);
        }
        continue;
      }
      result.push(c);
    }
    result
  }
}
impl StringUtil for String {}
impl StringUtil for &str {}
