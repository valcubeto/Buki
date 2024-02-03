use regex::Regex;
use once_cell::sync::Lazy;

pub static PREFIX_AND_COMMAND: Lazy<Regex> = Lazy::new(|| {
  Regex::new(r"^\.(\w+)(?:\s+([\S\s]+$))?").unwrap()
});

pub static SPACES: Lazy<Regex> = Lazy::new(|| {
  Regex::new(r"\s+").unwrap()
});

pub static UNICODE_OR_DISCORD_EMOJI: Lazy<Regex> = Lazy::new(|| {
  Regex::new(r"(?<unicode>\p{Emoji})|[^\\]?(?<discord><(?<animated>a?):(?<name>\w+):(?<id>[0-9]+)>)").unwrap()
});

pub static MARKDOWN_CODE: Lazy<Regex> = Lazy::new(|| {
  Regex::new(r"^(?:`{3}\w+\s+)?([\S\s]+?)(?:\s+`{3})?$").unwrap()
});
