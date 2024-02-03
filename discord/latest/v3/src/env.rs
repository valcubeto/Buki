use std::{
  ffi::OsStr,
  fmt::Debug,
  env::var as try_get_var,
};

#[inline]
pub fn get_env<K>(key: &K) -> String
where
  K: AsRef<OsStr> + ?Sized + Debug
{
  try_get_var(key)
    .unwrap_or_else(|err| panic!("Failed to load env var {key:?}: {err}"))
}
