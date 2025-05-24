/// This includes:
/// - GUILD_CREATE
/// - GUILD_UPDATE
/// - GUILD_DELETE
/// - GUILD_ROLE_CREATE
/// - GUILD_ROLE_UPDATE
/// - GUILD_ROLE_DELETE
/// - CHANNEL_CREATE
/// - CHANNEL_UPDATE
/// - CHANNEL_DELETE
/// - CHANNEL_PINS_UPDATE
/// - THREAD_CREATE
/// - THREAD_UPDATE
/// - THREAD_DELETE
/// - THREAD_LIST_SYNC
/// - THREAD_MEMBER_UPDATE
/// - THREAD_MEMBERS_UPDATE
/// - STAGE_INSTANCE_CREATE
/// - STAGE_INSTANCE_UPDATE
/// - STAGE_INSTANCE_DELETE
pub const GUILDS: u64 = 1;

/// This includes:
/// - GUILD_MEMBER_ADD
/// - GUILD_MEMBER_UPDATE
/// - GUILD_MEMBER_REMOVE
/// - THREAD_MEMBERS_UPDATE
pub const GUILD_MEMBERS: u64 = 1 << 1;

/// This includes:
/// - GUILD_AUDIT_LOG_ENTRY_CREATE
/// - GUILD_BAN_ADD
/// - GUILD_BAN_REMOVE
pub const GUILD_MODERATION: u64 = 1 << 2;

/// This includes:
/// - GUILD_EMOJIS_UPDATE
/// - GUILD_STICKERS_UPDATE
pub const GUILD_EMOJIS_AND_STICKERS: u64 = 1 << 3;

/// This includes:
/// - GUILD_INTEGRATIONS_UPDATE
/// - INTEGRATION_CREATE
/// - INTEGRATION_UPDATE
/// - INTEGRATION_DELETE
pub const GUILD_INTEGRATIONS: u64 = 1 << 4;

/// This includes:
/// - WEBHOOKS_UPDATE
pub const GUILD_WEBHOOKS: u64 = 1 << 5;

/// This includes:
/// - INVITE_CREATE
/// - INVITE_DELETE
pub const GUILD_INVITES: u64 = 1 << 6;

/// This includes:
/// - VOICE_STATE_UPDATE
pub const GUILD_VOICE_STATES: u64 = 1 << 7;

/// This includes:
/// - PRESENCE_UPDATE
pub const GUILD_PRESENCES: u64 = 1 << 8;

/// This includes:
/// - MESSAGE_DELETE_BULK
pub const GUILD_MESSAGES: u64 = 1 << 9;

/// This includes:
/// - MESSAGE_REACTION_REMOVE_EMOJI
pub const GUILD_MESSAGE_REACTIONS: u64 = 1 << 10;

/// This includes:
/// - TYPING_START
pub const GUILD_MESSAGE_TYPING: u64 = 1 << 11;

/// This includes:
/// - CHANNEL_PINS_UPDATE
pub const DIRECT_MESSAGES: u64 = 1 << 12;

/// This includes:
/// - MESSAGE_REACTION_REMOVE_EMOJI
pub const DIRECT_MESSAGE_REACTIONS: u64 = 1 << 13;

/// This includes:
/// - TYPING_START
pub const DIRECT_MESSAGE_TYPING: u64 = 1 << 14;

/// If not included, you will receive message events,
/// but the content of those messages will be empty
pub const MESSAGE_CONTENT: u64 = 1 << 15;

/// This includes:
/// - GUILD_SCHEDULED_EVENT_USER_REMOVE
pub const GUILD_SCHEDULED_EVENTS: u64 = 1 << 16;

/// This includes:
/// - AUTO_MODERATION_RULE_DELETE
pub const AUTO_MODERATION_CONFIGURATION: u64 = 1 << 20;

/// This includes:
/// - AUTO_MODERATION_ACTION_EXECUTION
pub const AUTO_MODERATION_EXECUTION: u64 = 1 << 21;
