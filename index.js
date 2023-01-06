const { Client, IntentsBitField: { Flags } } = require('discord.js')

const client = new Client({
	intents: [
		Flags.MessageContent,
		Flags.Guilds,
		Flags.GuildMessages,
		Flags.DirectMessages,
	],
	partials: ['CHANNEL']
})

const uptime = Date.now()

client.on('ready', () => {
	const seconds = (Date.now() - uptime) / 1000
	console.log(`Client ready! Logged in as ${client.user.tag} after ${seconds} seconds`)
})

client.on('messageCreate', async message => {
	// Ignore bot messages
	if (client.user.id === message.author.id) return

	const configuration = new Configuration(message)
	const prefix = configuration.guild.prefix ?? '.'

	// Ignore messages that doesn't starts with the guild's prefix or the messages that starts with it but there is no command (e.g. '!')
	const prefixAtStart = new RegExp(`^${escapeRegExp(prefix)}\\s*(?=[^\\s])`, 'i')
	// Ignore messages with the prefix repeated (e.g. '!!!')
	const repeatedPrefix = new RegExp(`^(?:${escapeRegExp(prefix)}){2,}`)
	if (!prefixAtStart.test(message.content) || repeatedPrefix.test(message.content)) return

	// Split the message by words
	const args = message.content.replace(prefixAtStart, '').trim().split(/\s+/)

	// Removes the first element from the argument list and returns it. If there is only the command, the list will be empty
	const usedCommand = args.shift().toLowerCase()

	const prefixAndCommand = new RegExp(`^${prefix}\s*${usedCommand}\s*`, 'i')

	const content = message.content.replace(prefixAndCommand, '')

	const commandList = new CommandList(message.inGuild() ? configuration.guild : null)

	// Handle unknown commands
	if (!commandList.has(usedCommand)) {
		message.channel.send(`El comando ${usedCommand} no existe qwq`)
		return
	}

	const command = commandList.get(usedCommand)

	if (command.inGuild && !message.inGuild()) {
		message.channel.send('Este comando solo está disponible para servidores')
	}

	const botInGuild = await message.guild.members.fetch(client.user.id)
	const channelPermissions = message.channel.permissionsFor(botInGuild)
	if (!channelPermissions.has('SendMessages')) {
		message.author.dmChannel.send(`No puedo mandar mensajes en ${message.channel.toString()}!`).catch(avoid)
		return
	}

	if (command.botPermissions) {
		const missingPermissions = command.botPermissions.filter(permission => !channelPermissions.has(permission))

		if (missingPermissions.length !== 0) {
			message.reply(`Me faltan permisos: ${missingPermissions.join(', ')}`)
			return
		}
	}

	if (command.permissions) {
		const channelPermissions = message.channel.permissionsFor(message.author.id)
		const missingPermissions = command.permissions.filter(permission => !channelPermissions.has(permission))

		if (missingPermissions.length !== 0) {
			message.reply(`Te faltan permisos: ${missingPermissions.join(', ')}`)
			return
		}
	}

	if (command.args) {
		if (command.args[0].rest && !args.length) {
			message.reply(`Falta un argumento!`)
			return
		}
		for (const i in command.args) {
			const arg = command.args[i]
			if (arg.required && !args[i]) {
				message.reply(`Faltan ${command.args.length - args.length} argumentos!`)
				return
			}
			if (arg.value) {
				if (arg.value instanceof RegExp) {
					if (!arg.value.test(args[i])) {
						message.reply(arg.error ?? `El argumento nro ${i + 1} debe seguir el siguiente patrón: ${arg.value.toString()}`)
						return
					}
				} else if (![undefined].concat(arg.value).includes(args[i])) {
					message.reply(arg.error ?? `El argumento nro ${i + 1} debe ser uno de los siguientes valores: ${arg.value.join(', ')}`)
					return
				}
			}
		}
	}

	// Execute the command
	commandList.execute(usedCommand, {
		message,
		prefix,
		usedCommand,
		args,
		content,
		client,
		configuration,
		commandList,
		saveFile,
		uptime
	})
})

const { equals, escapeRegExp, formatDate } = require('./utility.js')

const GUILD_CONFIGS_PATH = './data/guild-configs.json'
const USER_CONFIGS_PATH = './data/user-configs.json'

const guildConfigurations = require(GUILD_CONFIGS_PATH)
const userConfigurations  = require(USER_CONFIGS_PATH)


const { readdirSync: readDir, writeFileSync, watch } = require('node:fs')

// will look like { ping: { name: 'ping', command: (...) => ... } }
/** @type {{ [key: string]: Command }} */
const globalCommandList = {}

/** @type {Object<string, number>} */
const commandLoadTimes = {}

for (const file of readDir('./commands')) {
	const command = require(`./commands/${file}`)

	// Prevent 'undefined'
	if (!command.name) continue

	commandLoadTimes[file] = Date.now()
	globalCommandList[command.name] = command
}

watch('./commands', (type, file) => {
	const path = `./commands/${file}`
	if (type === 'change') {
		const now = Date.now()

		// Ignore if was saved less than 2 seconds ago
		if (now - commandLoadTimes[file] < 2000) return
		commandLoadTimes[file] = now

		try {
			// Remove the file path from the cache
			delete require.cache[require.resolve(path)]

			// Reload the file
			const command = require(path)

			const eq = equals(globalCommandList[command.name], command)
			// Ignore if there are no changes
			if (eq) return

			globalCommandList[command.name] = command

			console.log(`Updated ${file} (.${command.name}) at ${formatDate(now)}`)
		} catch (error) {
			// Prevent load files with errors
			console.log(`Error while importing ${file}: ${error.message}`)
		}
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
		this.aliases = guildConfiguration?.aliases ?? {}
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

function avoid() {}

const { token } = require('./secrets.json')
client.login(token)