module.exports = {
	description: 'Sends the current ping in milliseconds',
	command: ({ message, client }) => {
		message.channel.send(`${client.ws.ping} ms`)
	}
}