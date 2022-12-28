const { Client, IntentsBitField: { Flags } } = require('discord.js')

const client = new Client({
	intents: [
		Flags.Guilds,
		Flags.GuildMessages,
		Flags.DirectMessages
	],
	partials: ['CHANNEL']
})

const { readdirSync: readDir } = require('node:fs')

for (const path of readDir('./commands')) {
	const file = require(`./commands/${path}`)
	
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`)
})

client.on('messageCreate', message => {
	if (client.user.id === message.author.id) return
})

const { token } = require('./secrets.json')

client.login(token)