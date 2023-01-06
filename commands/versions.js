const { version: discordVersion } = require('discord.js')
const { table, Embed } = require('../utility')

module.exports = {
	name: 'versions',
	command: ({ message }) => {
		const object = {}
		object['Discord.js'] = discordVersion
		for (const version in process.versions) {
			const versionName = version in versionNameMap ? versionNameMap[version] : version
			object[versionName] = process.versions[version]
		}
		const embed = new Embed({
			message,
			title: 'Versions',
			description: `\`\`\`\n${table(object)}\`\`\``
		})
		message.channel.send({ embeds: [embed] })
	}
}

const versionNameMap = {
	node: 'Node',
	unicode: 'Unicode',
	uv: 'UV',
	brotli: 'Brotli',
	ares: 'Ares',
	modules: 'Modules',
	nghttp2: 'Nghttp2',
	napi: 'Napi',
	openssl: 'OpenSSL',
	cldr: 'CLDR',
	icu: 'ICU',
	tz: 'TZ'
}