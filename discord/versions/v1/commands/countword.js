const { PermissionFlagsBits: { ManageMessages } } = require('discord.js')
const { saveFile } = require('../utility')

module.exports = {
	name: 'countword',
	args: [
		{
			name: 'word',
			required: true,
			value: /^[a-zA-Z_-]+$/
		}
	],
	permissions: [ManageMessages],
	command: ({ message, args: [word], configuration: { guild } }) => {
		if (guild.words?.[word] === undefined) {
			message.channel.send(`Se contará la cantidad de veces que se dice la palabra **${word}**`)
			guild.words ??= {}
			guild.words[word] = 0
			guild.save()
			return
		}
		message.channel.send(`"${word}" se ha dicho ${guild.words[word]} veces`)
	}
}