const { Client } = require('discord.js')

const client = new Client({
	intents: ['DIRECT_MESSAGES', 'GUILDS', 'GUILD_MESSAGES'],
	partials: ['CHANNEL']
})

const { readdirSync: readDir } = require('node:fs')

const dir = readDir('./commands').forEach(console.log)