const { ButtonStyle } = require('discord.js')
const { Embed, Row, Button } = require('../utility')

module.exports = {
	name: 'waifu',
	command: async ({ message }) => {
		const embed = new Embed({
			message,
			title: 'Cargando...'
		})
		const row = new Row(
			new Button('https://www.google.com', 'Source', { style: ButtonStyle.Link }),
			new Button('https://www.google.com', 'Download', { style: ButtonStyle.Link }),
			new Button('other', 'Try other')
		)
		const buttons = row.components
		const options = {
			embeds: [embed],
			components: [row]
		}
		const sent = await message.channel.send(options)
		async function update() {
			const response = await fetch('https://nekos.best/api/v2/waifu')
			const { results } = await response.json()
			const { artist_name, artist_href, source_url, url } = results.at(0)
			embed.setTitle('Here is your waifu')
			embed.setDescription('Esto de ser bilingüe me está matando', `Made by [${artist_name}](${artist_href})`)
			embed.setImage(url)
			buttons[0].setURL(source_url)
			buttons[1].setURL(url)
			sent.edit(options)
		}
		await update()
		const filter = ({ customId, user }) => user.id === message.author.id && customId === 'other'
		const collector = sent.createMessageComponentCollector({ filter, time: 30_000 })
		collector.on('collect', interaction => {
			embed.setTitle('Cargando...')
			interaction.update(options)
			update()
		})
		collector.on('end', () => {
			buttons[2].setDisabled(true)
			sent.edit(options)
		})
	}
}