module.exports = {
	name: 'help',
	description: 'Sends help about a command or the list of commands if no arguments provided',
	args: [
		{
			name: 'command'
		}
	],
	command: ({ message, commandList, configuration: { guild = {} }, args: [commandName], prefix, utility: { Embed, join } }) => {
		if (!commandName) {
			//
		} else {	
			if (!commandList.has(commandName)) {
				message.channel.send(`El comando ${commandName} no existe qwq`)
				return
			}

			const { name, args = [] } = commandList.get(commandName)

			options.title = join(
				prefix,
				commandName,
				argsToString(args),
				guild.aliases && commandName in guild.aliases && ` (alias de ${name})` || null
			)
		}

		const embed = new Embed(options)
		message.channel.send({ embeds: [embed] })
	}
}

function argsToString(args) {
	return args.map(arg => {
		let result = arg.name
		if (args.rest) {
			result = `...${result}`
		}
		if (arg.value) {
			if (arg.value instanceof RegExp) {
				result += `:${arg.value.toString()}`
			} else {
				result += `:${arg.value.join('|')}`
			}
		}
		return arg.required ? `<${result}>` : `[${result}]`
	}).join(' ')
}