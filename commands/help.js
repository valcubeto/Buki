module.exports = {
	name: 'help',
	command: ({ message, commandList, configuration, args: [commandName], Embed }) => {
		const embed = new Embed()

		embed.setColor(0x5050FF)

		embed.setAuthor({
			name: message.inGuild ? message.member.displayName : message.author.name,
			iconURL: message.author.displayAvatarURL()
		})

		embed.setTitle(commandName)

		if (commandName in aliases) {
			embed.setDescription(`_Alias for ${commandList.get(commandName).name}_`)
		}

		message.channel.send({ embeds: [embed] })
	}
}