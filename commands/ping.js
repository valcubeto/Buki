module.exports = {
	name: 'ping',
	description: 'Sends the current ping in milliseconds',
	command: async ({ message, client, Embed }) => {
		const embed = new Embed({
			message,
			title: 'Pong!',
			description: 'Calculando la velocidad...'
		})

		const startTime = Date.now()

		const sent = await message.channel.send({ embeds: [embed] })

		embed.setDescription(
			`**WebSocket**: ${client.ws.ping} ms`,
			`**Discord API**: ${Date.now() - startTime} ms`
		)

		sent.edit({ embeds: [embed] })
	}
}