const { youtubeSearch } = require('@bochilteam/scraper')

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
	command: async ({ message, args, Embed }) => {
		const search = args.join(' ')
		const embed = new Embed({
			title: 'Búsqueda en YouTube',
			description: 'Cargando...'
		})

		const sent = await message.channel.send({ embeds: [embed] })

		try {
			const { video: [result] } = await youtubeSearch(search)
			embed.setImage(result.thumbnail)
			embed.setTitle(result.title)
			embed.setDescription(
				`**Descripción**: ${result.description}`,
				`**URL**: ${result.url}`
			)
		} catch (error) {
			embed.setDescription('Algo salió mal')
			console.error({ command: 'ytsearch', error })
		}	
		sent.edit({ embeds: [embed] })
	}
}