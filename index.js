const { Client, IntentsBitField: { Flags }, EmbedBuilder } = require('discord.js')

const client = new Client({
	intents: [
		Flags.MessageContent,
		Flags.Guilds,
		Flags.GuildMessages,
		Flags.DirectMessages,
	],
	partials: ['CHANNEL']
})

client.on('ready', () => {
	console.log(`Client ready! Logged in as ${client.user.tag}`)
})

client.on('messageCreate', message => {
	// Ignore bot messages
	if (client.user.id === message.author.id) return

	const configuration = new Configuration(message)
	const prefix = configuration.guild.prefix ?? '.'

	// Ignore messages that doesn't starts with the guild's prefix or the messages that starts with it but there is no command (e.g. '!')
	const prefixAtStart = new RegExp(`^${utility.escapeRegExp(prefix)}\\s*(?=[^\\s])`, 'i')
	if (!prefixAtStart.test(message.content)) return

	// Split the message by words
	const args = message.content.replace(prefixAtStart, '').trim().split(/\s+/)

	// Removes the first element from the argument list and returns it. If there is only the command, the list will be empty
	const usedCommand = args.shift().toLowerCase()

	const commandList = new CommandList(configuration.guild)

	// Handle unknown commands
	if (!commandList.has(usedCommand)) {
		message.channel.send(`Unknown command: ${usedCommand}`)
		return
	}

	// Execute the command
	commandList.execute(usedCommand, {
		message,
		prefix,
		usedCommand,
		args,
		client,
		configuration,
		commandList,
		Embed,
		utility,
		saveFile
	})
})

const utility = require('./utility.js')

const GUILD_CONFIGS_PATH = './data/guild-configs.json'
const USER_CONFIGS_PATH = './data/user-configs.json'

const guildConfigurations = require(GUILD_CONFIGS_PATH)
const userConfigurations  = require(USER_CONFIGS_PATH)


const { readdirSync: readDir, writeFileSync, watch } = require('node:fs')

// will look like { ping: { name: 'ping', command: (...) => ... } }
const globalCommandList = {}

/** @type {Object<string, number>} */
const commandLoadTimes = {}

for (const fileName of readDir('./commands')) {
	const command = require(`./commands/${fileName}`)

	// Prevent 'undefined'
	if (!command.name) continue

	commandLoadTimes[command.name] = Date.now()
	globalCommandList[command.name] = command
}

watch('./commands', (type, file) => {
	const path = `./commands/${file}`
	if (type === 'change') {
		// Remove the file path from the cache
		delete require.cache[require.resolve(path)]

		// Reload the file
		const command = require(path)

		// Ignore if was saved less than 2 seconds ago
		if (Date.now() - commandLoadTimes[command.name] < 2000) return

		const equals = utility.equals(globalCommandList[command.name], command)
		// Ignore if there are no changes
		if (equals) return

		commandLoadTimes[command.name] = Date.now()
		globalCommandList[command.name] = command
	}
})

function saveFile(path, data) {
	writeFileSync(path, JSON.stringify(data, null, 2))
}

class Configuration {
	constructor(message) {
		this.guild = guildConfigurations[message.guild.id] ?? {}
		this.user = userConfigurations[message.guild.id] ?? {}
	}
	guildConfigurationsPath() {
		return GUILD_CONFIGS_PATH
	}
	userConfigurationsPath() {
		return USER_CONFIGS_PATH
	}
}

class CommandList {
	constructor(guildConfiguration) {
		this.aliases = guildConfiguration.aliases ?? {}
	}
	has(command) {
		return command in this.aliases || command in globalCommandList
	}
	get(command) {
		return globalCommandList[this.aliases[command] ?? command]
	}
	execute(commandName, data) {
		const { command } = this.get(commandName)
		command(data)
	}
}

class Embed extends EmbedBuilder {
	constructor(options) {
		super({
			color: 0x5050FF,
			description: 'Something went wrong',
			...options,
			author: options.message
				? {
						name: `${options.message.inGuild ? options.message.member.displayName : options.message.author.name}`,
						icon_url: options.message.author.displayAvatarURL()
					}
				: null
		})
	}
	setDescription(...lines) {
		EmbedBuilder.prototype.setDescription.call(this, lines.join('\n'))
	}
}

const { token } = require('./secrets.json')

client.login(token)