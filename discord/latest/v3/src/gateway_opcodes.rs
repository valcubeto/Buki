/// (Action: Receive) An event was dispatched.
pub const DISPATCH: u64 = 0;

/// (Action: Sent/Receive) Fired periodically by the client to keep the connection alive.
pub const HEARTBEAT: u64 = 1;

/// (Action: Send) Starts a new session during the initial handshake.
pub const IDENTIFY: u64 = 2;

/// (Action: Send) Update the client's presence.
pub const PRESENCE_UPDATE: u64 = 3;

/// (Action: Send) Used to join/leave or move between voice channels.
pub const VOICE_STATE_UPDATE: u64 = 4;

/// (Action: Send) Resume a previous session that was disconnected.
pub const RESUME: u64 = 6;

/// (Action: Receive) You should attempt to reconnect and resume immediately.
pub const RECONNECT: u64 = 7;

/// (Action: Send) Request information about offline guild members in a large guild.
pub const REQUEST_GUILD_MEMBERS: u64 = 8;

/// (Action: Receive) The session has been invalidated. You should reconnect and identify/resume accordingly.
pub const INVALID_SESSION: u64 = 9;

/// (Action: Receive) Sent immediately after connecting, contains the heartbeat_interval to use.
pub const HELLO: u64 = 10;

/// (Action: Receive) Sent in response to receiving a heartbeat to acknowledge that it has been received.
pub const HEARTBEAT_ACK: u64 = 11;
