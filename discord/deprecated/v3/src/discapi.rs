use crate::{
  types::SharedString,
  json::JsonValue
};
use core::ops::Index;

pub struct Guild {
  pub id: SharedString,
  pub name: SharedString,
  pub icon_id: Option<SharedString>,
  pub afk_channel_id: Option<SharedString>,
  pub afk_timeout: u64,
  // application_command_counts: HashMap<SharedString, _>,
  // application_id: Option<SharedString>,
  pub banner: Option<SharedString>,
  pub channels: Vec<Channel>,
  // default_message_notifications: u64,
  pub description: Option<SharedString>,
  // discovery_splash: Option<_>,
  // embedded_activities: Vec<_>,
  pub emojis: Vec<Emoji>,
  pub explicit_content_filter: u64,
  // features: Vec<SharedString>,
  // guild_scheduled_events: Vec<_>,
  // home_header,
  // hub_type,
  // incidents_data,
  // inventory_settings,
  // joined_at: Date,
  // large,
  // latest_onboarding_question_id: Option<SharedString>,
  // lazy: bool,
  pub max_members: u64,
  pub max_stage_video_channel_users: u64,
  pub max_video_channel_users: u64,
  pub member_count: u64,
  pub members: Vec<Member>,
  // mfa_level: MfaLevel,
  pub is_nsfw: bool,
  pub nsfw_level: u64,
  pub owner_id: SharedString,
  pub preferred_locale: SharedString,
  pub premium_progress_bar_enabled: bool,
  pub premium_subscription_count: u64,
  pub premium_tier: u64,
  // presences: Vec<Presence>,
  pub public_updates_channel_id: Option<SharedString>,
  pub roles: Vec<Role>,

  pub rules_channel_id: Option<SharedString>,
  pub safety_alerts_channel_id: Option<SharedString>,
  // soundboard_sounds: [],
  // splash: null,
  // stage_instances: [],
  // stickers: [],
  // system_channel_flags: Flags,
  pub system_channel_id: Option<SharedString>,
  // threads: [Thread],
  pub unavailable: bool,
  // vanity_url_code: null,
  pub verification_level: u64,
  pub version: SharedString,
  // voice_states: [VoiceState]
}

impl<T: Index<&'static str, Output = JsonValue>> From<&T> for Guild {
  fn from(data: &T) -> Self {
    Guild {
      afk_channel_id: data["afk_channel_id"]
        .as_str()
        .map(|s| s.into()),
      afk_timeout: data["afk_timeout"]
        .as_u64()
        .unwrap(),
      banner: data["banner"]
        .as_str()
        .map(|s| s.into()),
      channels: data["channels"]
        .as_array()
        .unwrap()
        .iter()
        .map(Channel::from)
        .collect(),
      description: data["description"].as_str().map(|s| s.into()),
      emojis: data["emojis"].as_array().unwrap().iter().map(Emoji::from).collect(),
      explicit_content_filter: data["explicit_content_filter"].as_u64().unwrap(),
      icon_id: data["icon"].as_str().map(|s| s.into()),
      id: data["id"].as_str().unwrap().into(),
      is_nsfw: data["nsfw"].as_bool().unwrap(),
      max_members: data["max_members"].as_u64().unwrap(),
      max_stage_video_channel_users: data["max_stage_video_channel_users"].as_u64().unwrap(),
      max_video_channel_users: data["max_video_channel_users"].as_u64().unwrap(),
      member_count: data["member_count"].as_u64().unwrap(),
      members: data["members"].as_array().unwrap()
        .iter().map(Member::from).collect(),
      name: data["name"].as_str().unwrap().into(),
      nsfw_level: data["nsfw_level"].as_u64().unwrap(),
      owner_id: data["owner_id"].as_str().unwrap().into(),
      preferred_locale: data["preferred_locale"].as_str().unwrap().into(),
      premium_progress_bar_enabled: data["premium_progress_bar_enabled"].as_bool().unwrap(),
      premium_subscription_count: data["premium_subscription_count"].as_u64().unwrap(),
      premium_tier: data["premium_tier"].as_u64().unwrap(),
      public_updates_channel_id: data["public_updates_channel_id"].as_str().map(|s| s.into()),
      roles: data["roles"].as_array().unwrap().iter().map(Role::from).collect(),
      rules_channel_id: data["rules_channel_id"].as_str().map(|s| s.into()),
      safety_alerts_channel_id: data["safety_alerts_channel_id"].as_str().map(|s| s.into()),
      system_channel_id: data["system_channel_id"].as_str().map(|s| s.into()),
      unavailable: data["unavailable"].as_bool().unwrap(),
      verification_level: data["verification_level"].as_u64().unwrap(),
      version: data["version"].as_u64().unwrap().to_string().into()
    }
  }
}

pub struct Channel {
  // flags: i64,
  pub id: SharedString,
  pub name: SharedString,
  // permission_overwrites: Vec<_>,
  pub position: u64,
  // kind: ChannelType,
  pub icon_emoji: Option<Emoji>,
  pub last_message_id: Option<SharedString>,
  pub is_nsfw: Option<bool>,
  pub parent_id: Option<SharedString>,
  pub rate_limit_per_user: Option<u64>,
  // theme_color: Option<_>,
  pub topic: Option<SharedString>,
  pub version: Option<SharedString>,
}

impl From<&JsonValue> for Channel {
  fn from(data: &JsonValue) -> Self {
    Channel {
      icon_emoji: data["icon_emoji"].as_object().map(Emoji::from),
      id: data["id"].as_str().unwrap().into(),
      is_nsfw: data["nsfw"].as_bool(),
      last_message_id: data["last_message_id"].as_str().map(|s| s.into()),
      name: data["name"].as_str().unwrap().into(),
      parent_id: data["parent_id"].as_str().map(|s| s.into()),
      position: data["position"].as_u64().unwrap(),
      rate_limit_per_user: data["rate_limit_per_user"].as_u64(),
      topic: data["topic"].as_str().map(|s| s.into()),
      version: data["version"].as_str().map(|s| s.into()),
    }
  }
}

pub enum ChannelType {
  /// A direct message between users
  Dm = 1,

  /// A direct message chat between multiple users
  DmGroup = 3,

  /// A text channel within a server
  GuildText = 0,

  /// A voice channel within a server
  GuildVoice = 2,

  /// An organizational category that contains up to 50 channels
  GuildCategory = 4,

  /// A channel that users can follow and crosspost into their own server
  GuildAnnouncements = 5,

  /// A temporary sub-channel within an GuildAnnouncements channel
  GuildAnnouncementThread = 10,

  /// A temporary sub-channel within a GUILD_TEXT or GUILD_FORUM channel
  PublicThread = 11,

  /// A temporary sub-channel within a GUILD_TEXT channel that is only
  /// viewable by those invited and those with the MANAGE_THREADS permission
  PrivateThread = 12,

  /// A voice channel for hosting events with an audience
  VoiceEvent = 13,

  /// The channel in a hub containing the listed servers
  GuildDirectory = 14,

  /// Channel that can only contain threads
  GuildForum = 15,

  /// Channel that can only contain threads, similar to GUILD_FORUM channels
  GuildMedia = 16,
}

pub struct Emoji {
  pub id: Option<SharedString>,
  pub name: SharedString,
  pub animated: Option<bool>,
  pub available: Option<bool>,
  pub managed: Option<bool>,
  // require_colons: Option<bool>,
  pub roles: Option<Vec<Role>>,
  pub version: Option<SharedString>
}

impl<T> From<&T> for Emoji
where
  T: Index<&'static str, Output = JsonValue>
{
  fn from(data: &T) -> Self {
    Emoji {
      animated: data["animated"].as_bool(),
      available: data["available"].as_bool(),
      id: data["id"].as_str().map(|s| s.into()),
      name: SharedString::from(data["name"].as_str().unwrap()),
      managed: data["managed"].as_bool(),
      roles: data["roles"].as_array().map(|a| a.iter().map(Role::from).collect()),
      version: data["version"].as_str().map(|s| s.into())
    }
  }
}

pub struct Member {
  pub avatar_here: Option<SharedString>,
  // communication_disabled_until: Option<Date>,
  pub deaf: bool,
  // flags: u64,
  // joined_at: Date,
  pub is_muted: bool,
  pub nick: Option<SharedString>,
  pub is_pending: bool,
  // premium_since: Option<Date>,
  pub role_ids: Vec<SharedString>,
  pub user: User
}

impl<T: Index<&'static str, Output = JsonValue>> From<&T> for Member {
  fn from(data: &T) -> Self {
    Member {
      avatar_here: data["avatar"].as_str().map(|s| s.into()),
      deaf: data["deaf"].as_bool().unwrap(),
      is_muted: data["muted"].as_bool().unwrap(),
      is_pending: data["pending"].as_bool().unwrap(),
      nick: data["nick"].as_str().map(|s| s.into()),
      role_ids: data["roles"].as_array().unwrap()
        .iter().map(|s| s.as_str().unwrap().into()).collect(),
      user: User::from(data["user"].as_object().unwrap())
    }
  }
}

pub struct Role {
  pub color: u64,
  // flags: Flags,
  pub hoist: bool,
  pub icon_id: Option<SharedString>,
  pub id: SharedString,
  pub managed: bool,
  pub mentionable: bool,
  pub name: SharedString,
  // permissions: Permissions,
  pub position: u64,
  // tags: HashMap<_, _>,
  // unicode_emoji: Option<SharedString>,
  pub version: SharedString
}

impl From<&JsonValue> for Role {
  fn from(data: &JsonValue) -> Self {
    Role {
      color: data["color"].as_u64().unwrap(),
      hoist: data["hoist"].as_bool().unwrap(),
      icon_id: data["icon"].as_str().map(|s| s.into()),
      id: SharedString::from(data["id"].as_str().unwrap()),
      managed: data["managed"].as_bool().unwrap(),
      mentionable: data["mentionable"].as_bool().unwrap(),
      name: SharedString::from(data["name"].as_str().unwrap()),
      position: data["position"].as_u64().unwrap(),
      version: SharedString::from(data["position"].as_str().unwrap()),
    }
  }
}

pub struct User {
  pub id: SharedString,
  pub name: SharedString,
  pub avatar_id: Option<SharedString>,
  // avatar_decoration_data,
  pub is_bot: bool,
  pub discriminator: Option<SharedString>,
  pub display_name: Option<SharedString>,
  pub global_name: Option<SharedString>,
  // public_flags: u64,
}

impl<T: Index<&'static str, Output = JsonValue>> From<&T> for User {
  fn from(data: &T) -> Self {
    User {
      avatar_id: data["avatar"].as_str().map(|s| s.into()),
      discriminator: data["discriminator"].as_str().map(|s| s.into()),
      display_name: data["display_name"].as_str().map(|s| s.into()),
      global_name: data["global_name"].as_str().map(|s| s.into()),
      id: data["id"].as_str().unwrap().into(),
      is_bot: data["bot"].as_bool().unwrap(),
      name: data["name"].as_str().unwrap().into(),
    }
  }
}

pub enum MessageComponent {
  Button(Button),
  SelectMenu(Box<SelectMenu>)
}

pub struct ActionRow {
  components: [MessageComponent; 5]
}

pub struct Button {
  label: String,
  emoji: Option<ButtonEmoji>,
  disabled: bool
}

pub enum ButtonEmoji {
  Unicode(String),
  GuildEmoji(GuildEmoji)
}
pub struct GuildEmoji {
  id: String,
  name: String,
  animated: bool
}

pub enum ButtonStyle {
  Primary { custom_id: String },
  Secondary { custom_id: String },
  Success { custom_id: String },
  Danger { custom_id: String },
  Link { url: String }
}

pub struct SelectMenu {
  custom_id: String,
  options: [SelectMenuOption; 25]
}

pub struct SelectMenuOption {
  label: String,
  value: String
}
