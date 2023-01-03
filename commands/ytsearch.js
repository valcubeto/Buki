const { youtubeSearch } = require('@bochilteam/scraper')
const { ButtonBuilder, ButtonComponent, ActionRowBuilder } = require('discord.js')

module.exports = {
	name: 'ytsearch',
	description: 'Busca en YouTube',
	args: [
		{
			name: 'search',
			rest: true,
			required: true
		}
	],
	/** @param {{ message: import('discord.js').Message }} param0 */
	command: async ({ message, args, utility: { Embed, Button, Row } }) => {
		const search = args.join(' ')
		const embed = new Embed({
			title: 'Búsqueda en YouTube',
			description: 'Cargando...'
		})

		const sent = await message.channel.send({ embeds: [embed] })

		const previous = new Button('previous', 'Anterior')
		const index = new Button('index', '...')
		const next = new Button('next', 'Siguiente')

		const [row, rowIds] = Row(previous, index, next)

		try {
			const { video: videos } = await youtubeSearch(search)
			let i = 0
			function filter(...args) {
				const result = videos.at(i)
				embed.setImage(result.thumbnail)
				embed.setDescription(
					`**Título**: ${result.title}`,
					`**Descripción**: ${result.description}`
				)
				sent.edit({ embeds: [embed], components: [row] })
				console.log({ args })
			}

			const collector = sent.createMessageComponentCollector({ filter, time: 20_000 })
			setTimeout(collector.stop, 20_000)
		} catch (error) {
			embed.setDescription('Algo salió mal')
			console.error({ command: 'ytsearch' }, error)
			sent.edit({ embeds: [embed] })
		}	
	}
}