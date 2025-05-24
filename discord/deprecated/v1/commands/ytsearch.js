const { youtubeSearch } = require('@bochilteam/scraper')
const { ButtonStyle, escapeMarkdown } = require('discord.js')
const { Embed, Button, Row } = require('../utility')

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
	command: async ({ message, args }) => {
		const search = args.join(' ')
		const embed = new Embed({
			message,
			title: `Búsqueda en YouTube: ${search}`,
			description: 'Cargando...'
		})

		const sent = await message.channel.send({ embeds: [embed] })

		try {
			const { video: videos = [] } = await youtubeSearch(search)

			if (!videos.length) {
				embed.setDescription('No hay resultados')
				sent.edit({ embeds: [embed] })
				return
			}

			const previous = new Button('previous', 'Anterior', { disabled: true })
			const index = new Button('index', `1/${videos.length}`, { style: ButtonStyle.Secondary, disabled: true })
			const next = new Button('next', 'Siguiente')
			const row = new Row(previous, index, next)

			function update(result) {
				embed.setImage(result.thumbnail)
				embed.setDescription(
					`**Título**: ${escapeMarkdown(result.title)}`,
					`**Descripción**: ${escapeMarkdown(result.description) || '_Sin descripción_'}`,
					`**Publicado por**: ${escapeMarkdown(result.authorName)}`,
					`**Duración**: ${result.duration}`,
					...(result.publishedTime !== 'Unknown' ? [`**Fecha de publicación**: ${result.publishedTime}`] : []) // prevent empty lines
				)
			}

			update(videos.at(0))
			await sent.edit({ embeds: [embed], components: [row] })

			let i = 0
			const collector = sent.createMessageComponentCollector({ filter: interaction => interaction.user.id === message.author.id, time: 60_000 })
			collector.on('collect', interaction => {
				if (interaction.customId === 'previous') i--
				else if (interaction.customId === 'next') i++

				previous.setDisabled(i === 0)
				index.setLabel(`${i + 1}/${videos.length}`)
				next.setDisabled(i === videos.length)

				update(videos.at(i))
				interaction.update({ embeds: [embed], components: [row] })
			})
			collector.on('end', () => {
				embed.setTitle(`(expired) ${embed.data.title}`)
				previous.setDisabled(true)
				next.setDisabled(true)
				sent.edit({ embeds: [embed], components: [row] })
			})
		} catch (error) {
			embed.setDescription('Algo salió mal. Inténtalo de nuevo más tarde.')
			sent.edit({ embeds: [embed] })
			console.error({ command: 'ytsearch' }, error)
		}	
	}
}