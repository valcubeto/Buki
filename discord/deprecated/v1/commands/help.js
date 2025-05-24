const { Embed, join } = require('../utility')

module.exports = {
	name: 'help',
	description: 'Sends help about a command or the list of commands if no arguments provided',
	args: [
		{
			name: 'command'
		}
	],
	command: ({ message, commandList, configuration: { guild = {} }, args: [commandName], prefix }) => {
		if (commandName) {
			if (!commandList.has(commandName)) {
				message.channel.send(`El comando ${commandName} no existe qwq`)
				return
			}

			const { name, args = [], description = '_(Sin descripción)_' } = commandList.get(commandName)

			const embed = new Embed({
				message,
				title: join(
					prefix,
					commandName,
					' ',
					argsToString(args),
					guild.aliases && commandName in guild.aliases ? ` (alias de ${name})` : null
				),
				description
			})

			message.channel.send({ embeds: [embed] })
			return
		}
		message.channel.send('que')
	}
}

function argsToString(args) {
	return args.map(arg => {
		let result = arg.name
		if (arg.rest) {
			result = `... ${result}`
		}
		if (arg.value) {
			if (arg.value instanceof RegExp) {
				result += `: ${arg.value.toString()}`
			} else {
				result += `: ${arg.value.join(' | ')}`
			}
		}
		return arg.required ? `<${result}>` : `[${result}]`
	}).join(' ')
}