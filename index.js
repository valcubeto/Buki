const { Client, IntentsBitField: { Flags }, Embed } = require('discord.js')

const client = new Client({
	intents: [
		Flags.MessageContent, // bro esto es ridículo
		Flags.Guilds,
		Flags.GuildMessages,
		Flags.DirectMessages,
	],
	partials: ['CHANNEL']
})

const { readdirSync: readDir } = require('node:fs')

const globalCommandList = {}

for (const fileName of readDir('./commands')) {
	const command = require(`./commands/${fileName}`)
	globalCommandList[command.name] = command
}

client.on('ready', () => {
	console.log(`Client ready! Logged in as ${client.user.tag}`)
})

client.on('messageCreate', message => {
	// Ignore bot messages
	if (client.user.id === message.author.id) return

	const configuration = new Configuration(message)
	const prefix = configuration.guild.prefix ?? '.'

	// Ignore messages that doesn't starts with the guild's prefix or the messages that starts with it but there is no command (e.g. '!')
	const prefixAtStart = new RegExp(`^${escapeRegExp(prefix)}\\s*(?=[^\\s])`, 'i')
	if (!prefixAtStart.test(message.content)) return

	// Split the message by words
	const args = message.content.replace(prefixAtStart, '').trim().split(/\s+/)

	// Removes the first element from the argument list and returns it. If there is only the command, the list will be empty
	const usedCommand = args.shift().toLowerCase()

	const commandList = new CommandList(configuration.guild)

	// Handle unknown commands
	if (!commandList.has(usedCommand)) {
		message.channel.send(`'${usedCommand}' is not a command!`)
		return
	}

	console.log({ prefix, usedCommand, args })
	// Execute the command
	commandList.execute(usedCommand, {
		message,
		prefix,
		client,
		configuration,
		commandList,
		Embed
	})
})

const guildConfigurations = require('./data/guild-configs.json')
const userConfigurations  = require('./data/user-configs.json' )

class Configuration {
	constructor(message) {
		this.guild = guildConfigurations[message.guild.id] ?? {}
		this.user = userConfigurations[message.guild.id] ?? {}
	}
}

function escapeRegExp(string) {
	return string.replace(/[\[\](){}?*+.^$|\\]/g, '\\$&')
}

class CommandList {
	constructor(guildConfiguration) {
		this.aliases = guildConfiguration.aliases ?? {}
	}
	has(command) {
		return command in this.aliases || command in globalCommandList
	}
	execute(commandName, data) {
		const { command } = globalCommandList[this.aliases[commandName] ?? commandName]
		command(data)
	}
}

const { token } = require('./secrets.json')

client.login(token)