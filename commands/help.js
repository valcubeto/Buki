module.exports = {
	name: 'help',
	description: 'Sends help about a command or the list of commands if no arguments provided',
	args: [
		{
			name: 'command'
		}
	],
	command: ({ message, commandList, configuration: { guild = {} }, args: [commandName], prefix, Embed, utility: { join } }) => {
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
		const result = arg.value
			? `${arg.name}:${
					arg.value instanceof RegExp
						? arg.value.toString()
						: arg.value.join('|')
				}`
			: arg.name
		return arg.required ? `<${result}>` : `[${result}]`
	}).join(' ')
}