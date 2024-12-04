#![allow(unused)]

use std::fmt::Display;

macro_rules! def_const {
  ($name:ident = $value:expr) => {
    pub const $name: &str = $value;
  };
}
macro_rules! fmt_func {
  ($fn_name:ident, $start:ident, $end:ident) => {
    #[inline]
    fn $fn_name(&self) -> String {
      format!("{}{}{}", $start, self, $end)
    }
  };
}

def_const!(BOLD = "\u{1b}[1m");
def_const!(BOLD_END = "\u{1b}[22m");
def_const!(ITALIC = "\u{1b}[3m");
def_const!(ITALIC_END = "\u{1b}[23m");
def_const!(UNDERLINE = "\u{1b}[4m");
def_const!(UNDERLINE_END = "\u{1b}[24m");
def_const!(RED = "\u{1b}[31m");
def_const!(GREEN = "\u{1b}[32m");
def_const!(YELLOW = "\u{1b}[33m");
def_const!(BLUE = "\u{1b}[34m");
def_const!(MAGENTA = "\u{1b}[35m");
def_const!(CYAN = "\u{1b}[36m");
def_const!(BRIGHT_RED = "\u{1b}[91m");
def_const!(BRIGHT_GREEN = "\u{1b}[92m");
def_const!(BRIGHT_YELLOW = "\u{1b}[93m");
def_const!(BRIGHT_BLUE = "\u{1b}[94m");
def_const!(BRIGHT_MAGENTA = "\u{1b}[95m");
def_const!(BRIGHT_CYAN = "\u{1b}[96m");
def_const!(FOREGROUND_END = "\u{1b}[39m");
def_const!(BG_RED = "\u{1b}[41m");
def_const!(BG_GREEN = "\u{1b}[42m");
def_const!(BG_YELLOW = "\u{1b}[43m");
def_const!(BG_BLUE = "\u{1b}[44m");
def_const!(BG_MAGENTA = "\u{1b}[45m");
def_const!(BG_CYAN = "\u{1b}[46m");
def_const!(BG_BRIGHT_RED = "\u{1b}[101m");
def_const!(BG_BRIGHT_GREEN = "\u{1b}[102m");
def_const!(BG_BRIGHT_YELLOW = "\u{1b}[103m");
def_const!(BG_BRIGHT_BLUE = "\u{1b}[104m");
def_const!(BG_BRIGHT_MAGENTA = "\u{1b}[105m");
def_const!(BG_BRIGHT_CYAN = "\u{1b}[106m");
def_const!(BG_END = "\u{1b}[49m");

pub trait Stylize: Display {
  fmt_func!(bold, BOLD, BOLD_END);
  fmt_func!(underline, UNDERLINE, UNDERLINE_END);
  fmt_func!(red, RED, FOREGROUND_END);
  fmt_func!(green, GREEN, FOREGROUND_END);
  fmt_func!(yellow, YELLOW, FOREGROUND_END);
  fmt_func!(blue, BLUE, FOREGROUND_END);
  fmt_func!(magenta, MAGENTA, FOREGROUND_END);
  fmt_func!(cyan, CYAN, FOREGROUND_END);
  fmt_func!(bright_red, BRIGHT_RED, FOREGROUND_END);
  fmt_func!(bright_green, BRIGHT_GREEN, FOREGROUND_END);
  fmt_func!(bright_yellow, BRIGHT_YELLOW, FOREGROUND_END);
  fmt_func!(bright_blue, BRIGHT_BLUE, FOREGROUND_END);
  fmt_func!(bright_magenta, BRIGHT_MAGENTA, FOREGROUND_END);
  fmt_func!(bright_cyan, BRIGHT_CYAN, FOREGROUND_END);
  fmt_func!(bg_red, BG_RED, BG_END);
  fmt_func!(bg_green, BG_GREEN, BG_END);
  fmt_func!(bg_yellow, BG_YELLOW, BG_END);
  fmt_func!(bg_blue, BG_BLUE, BG_END);
  fmt_func!(bg_magenta, BG_MAGENTA, BG_END);
  fmt_func!(bg_cyan, BG_CYAN, BG_END);
  fmt_func!(bg_bright_red, BG_BRIGHT_RED, BG_END);
  fmt_func!(bg_bright_green, BG_BRIGHT_GREEN, BG_END);
  fmt_func!(bg_bright_yellow, BG_BRIGHT_YELLOW, BG_END);
  fmt_func!(bg_bright_blue, BG_BRIGHT_BLUE, BG_END);
  fmt_func!(bg_bright_magenta, BG_BRIGHT_MAGENTA, BG_END);
  fmt_func!(bg_bright_cyan, BG_BRIGHT_CYAN, BG_END);
}
impl<T> Stylize for T  where T: Display {}

#[macro_export]
macro_rules! debug {
  ($arg:expr) => {{
    #[allow(unused_imports)]
    use $crate::terminal::Stylize;
    use $crate::debug_msg;
    debug_msg!("{} = {:#?}", stringify!($arg).bold(), $arg);
    println!();
  }};
}

#[macro_export]
macro_rules! debug_display {
  ($arg:expr) => {{
    use $crate::terminal::Stylize;
    use $crate::debug_msg;
    debug_msg!("{} = {}", stringify!($arg).bold(), $arg);
    println!();
  }};
}

#[macro_export]
macro_rules! debug_msg {
  ($($arg:expr),*) => {{
    use $crate::terminal::Stylize;
    use chrono::Local;
    let path = format!("{}:{:03}:{:03}", file!(), line!(), column!());
    let date = Local::now().format("%d-%m %H:%M:%S");
    let out = format!($( $arg ),*);
    println!("[{} at {}, {}] {}", "Debug".cyan().bold(), path.bold(), date.bold(), out);
  }};
}
