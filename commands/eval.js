const discord = require('discord.js')
const utility = require('../utility')

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
		if (data.message.author.id !== '826610017490305028') return

		function sendResult(result) {
			const final = '```js\n' + utility.represent(result) + '\n```'
			data.message.channel.send(final)
		}

		try {
			const code = `
				try {
					(async function () {
						${data.content}
					})()
				} catch (error) {
					error
				}
			`
			const result = eval(code)
			sendResult(result)
		} catch (error) {
			sendResult(error)
		}
	}
}