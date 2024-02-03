#[allow(unused)]
mod _terminal {
  use std::fmt::Display;

  pub const BOLD_START:   &str = "\u{1b}[1m";
  pub const ULINE_START:  &str = "\u{1b}[4m";
  pub const BOLD_END:     &str = "\u{1b}[22m";
  pub const ULINE_END:    &str = "\u{1b}[24m";
  pub const RED_START:    &str = "\u{1b}[31m";
  pub const GREEN_START:  &str = "\u{1b}[32m";
  pub const YELLOW_START: &str = "\u{1b}[33m";
  pub const COLOR_END:    &str = "\u{1b}[39m";

  #[inline]
  pub fn bold<T: Display>(value: T) -> String {
    format!("{BOLD_START}{value}{BOLD_END}")
  }
  #[inline]
  pub fn underline<T: Display>(value: T) -> String {
    format!("{ULINE_START}{value}{ULINE_END}")
  }
  #[inline]
  pub fn red<T: Display>(value: T) -> String {
    format!("{RED_START}{value}{COLOR_END}")
  }
  #[inline]
  pub fn green<T: Display>(value: T) -> String {
    format!("{GREEN_START}{value}{COLOR_END}")
  }
  #[inline]
  pub fn yellow<T: Display>(value: T) -> String {
    format!("{YELLOW_START}{value}{COLOR_END}")
  }
}

pub use _terminal::*;

#[macro_export]
macro_rules! debug {
  ($arg: expr) => {{
    $crate::debug_msg!("{} = {}", $crate::terminal::bold(stringify!($arg)), format!("{:#?}", $arg).lines().collect::<Vec<_>>().join("\n    "));
  }};
}

#[macro_export]
macro_rules! debug_display {
  ($arg: expr) => {{
    $crate::debug_msg!("{} = {}", $crate::terminal::bold(stringify!($arg)), format!("{}", $arg).lines().collect::<Vec<_>>().join("\n    "));
  }};
}

#[macro_export]
macro_rules! debug_msg {
  ($( $arg: expr ),*) => {{
    println!("{} at {} on {}",
             $crate::terminal::bold($crate::terminal::green("Debugging")),
             $crate::terminal::bold(format!("{}:{}:{}", file!(), line!(), column!())),
             $crate::terminal::bold(chrono::Local::now().format("%d/%m/%Y %H:%M:%S")));
    println!("    {}", format!($( $arg ),*).lines().collect::<Vec<_>>().join("\n    "));
  }};
}
