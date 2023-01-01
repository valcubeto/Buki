const { escapeMarkdown } = require('discord.js')
const { apiURL, characters } = require('../genshin-api/index')

/** @typedef {import('../genshin-api/genshin-impact-account').GenshinImpactAccount} GenshinImpactAccount */

module.exports = {
	name: 'genshin',
	description: 'Gets a Genshin Impact account using its UID',
	args: '<uid>',
	command: async ({ message, args: [uid], Embed }) => {
		if (!/^[0-9]+$/.test(uid)) {
			message.channel.send('Invalid UID')
			return
		}
		const embed = new Embed({
			message,
			title: 'Genshin Impact account',
			description: 'Loading...'
		})
		const sent = await message.channel.send({ embeds: [embed] })
		try {
			const data = await fetch(`${apiURL}/u/${uid}/__data.json`)
			/** @type {GenshinImpactAccount} */
			const { playerInfo, avatarInfoList } = await data.json()
			embed.setTitle(`Cuenta de ${playerInfo.nickname}`)
			const { iconName } = characters[playerInfo.profilePicture.avatarId]
			embed.setThumbnail(`${apiURL}/ui/${iconName}.png`)
			embed.setDescription(
				`**Firma**: ${escapeMarkdown(playerInfo.signature ?? '_No establecida_')}`
			)
			sent.edit({ embeds: [embed] })
		} catch (error) {
			console.log({ error })
		}
	}
}