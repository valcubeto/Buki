const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const { formatDate } = require('../utility')

module.exports = {
	name: 'test',
	args: [
		{
			name: 'required',
			required: true,
			value: ['idk', 'elpepe']
		},
		{
			name: 'optional',
			value: /some regex/i,
			rest: true
		}
	],
	/**
	 * @param {{ message: import('discord.js').Message }} param0
	 */
	command: ({ message, uptime }) => {
		const avatar = message.author.displayAvatarURL({ size: 256 })
		message.channel.send({
			tts: true,
			content: 'message.content',
			nonce: 5,
			embeds: [
				new EmbedBuilder({
					author: {
						icon_url: avatar,
						name: 'message.embeds[0].author.name'
					},
					description: 'message.embeds[0].description',
					fields: [
						{
							name: 'message.embeds[0].fields[0].name',
							value: 'message.embeds[0].fields[0].value'
						}
					],
					footer: {
						text: 'message.embeds[0].footer.text',
						icon_url: avatar
					},
					title: 'message.embeds[0].title',
					color: 0xFFFFFF,
					image: {
						url: avatar
					},
					thumbnail: {
						url: avatar
					},
					timestamp: formatDate(uptime)
				})
			],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('message.components[0].components[0].customId')
						.setLabel('message.components[0].components[0].label')
						.setStyle(ButtonStyle.Success)
				)
			]
		})
	}
}