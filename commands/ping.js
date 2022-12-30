module.exports = {
	name: 'ping',
	description: 'Sends the current ping in milliseconds',
	command: ({ message, client, Embed }) => {
		const startTime = Date.now()
		const embed = new Embed({
			message,
			title: 'Pong!',
			description: 'Calculating speed...'
		})
		message.channel.send({ embeds: [embed] })
			.then(sent => {
				embed.setDescription(
					`**WebSocket**: ${client.ws.ping} ms`,
					`**Discord API**: ${Date.now() - startTime} ms`
				)
				sent.edit({ embeds: [embed] })
			})
			.catch(console.error)
	}
}