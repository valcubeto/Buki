module.exports = {
	name: 'help',
	description: 'Sends help about a command or the list of commands if no arguments provided',
	args: '[command]',
	command: ({ message, commandList, configuration: { guild }, args: [commandName], prefix, Embed, utility: { join } }) => {
		if (!commandName) {
			//
		} else {			
			if (!commandList.has(commandName)) {
				message.channel.send(`Unknown command: _${commandName}_`)
				return
			}

			const { name, args } = commandList.get(commandName)

			options.title = join(
				prefix,
				commandName,
				args,
				guild.aliases && commandName in guild.aliases && ` (alias for ${name})`
			)
		}

		const embed = new Embed(options)
		message.channel.send({ embeds: [embed] })
	}
}