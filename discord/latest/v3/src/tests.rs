#[test]
fn load_env() {
  let _ = dotenv::dotenv().ok();
  crate::debug!(crate::env::get_env("APP_ID"));
}
