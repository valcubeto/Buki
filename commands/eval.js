const discord = require('discord.js')

module.exports = {
	name: 'eval',
	args: [
		{
			name: 'code',
			rest: true,
			required: true
		}
	],
	command: (data) => {
		const code = args.join(' ')
		try {
			data.message.channel.send('```json\n' + JSON.stringify(eval(code), null, 2) + '```')
		} catch (error) {
			// yo
			const content = JSON.stringify(
				error && error instanceof Error
					? { name: error.name, message: error.message }
					: error,
				null,
				2
			)
			data.message.channel.send('```json\n' + `${error == null ? error : error.constructor.name} ${content}` + '```')
		}
	}
}