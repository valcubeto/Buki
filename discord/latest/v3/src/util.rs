pub trait StringUtil: AsRef<str> {
  /// Capitalizes the first letter of the string
  fn capitalize(&self) -> String {
    let string = self.as_ref();
    if string.is_empty() {
      return String::new();
    }
    let mut chars = string.chars();
    // in some rare cases it will alloc more memory
    let mut result = String::with_capacity(string.len());
    for c in chars.next().unwrap().to_uppercase() {
      result.push(c);
    }
    for c in chars {
      result.push(c);
    }
    result
  }
  // /// Capitalizes the first letter of each word
  // fn title_case(&self) -> String {
  //   let string = self.as_ref();
  //   let mut result = String::with_capacity(string.len());
  //   let mut words = string.();
  //   for word in words {
  //     result.push_str(word.capitalize().as_str());
  //   }
  //   result
  // }
}
impl StringUtil for String {}
impl StringUtil for &str {}
