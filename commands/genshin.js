const { escapeMarkdown } = require('discord.js')
const { apiURL, characters, locales } = require('../genshin-api/index')

/** @typedef {import('../genshin-api/genshin-impact-account').GenshinImpactAccount} GenshinImpactAccount */

module.exports = {
	name: 'genshin',
	description: 'Busca una cuenta de Genshin Impact usando su UID',
	args: [
		{
			name: 'uid',
			required: true,
			value: /^[0-9]+$/,
			error: 'UID inválida'
		}
	],
	command: async ({ message, args: [uid], Embed }) => {
		const embed = new Embed({
			message,
			title: 'API de Genshin Impact',
			description: `Cargando...`
		})
		const sent = await message.channel.send({ embeds: [embed] })
		try {
			const data = await fetch(`${apiURL}/u/${uid}/__data.json`)
			/** @type {GenshinImpactAccount} */
			const { playerInfo, avatarInfoList = [] } = await data.json()
			if (!playerInfo) {
				embed.setColor(0xFF5050)
				embed.setDescription('No se encontró el usuario!')
				sent.edit({ embeds: [embed] })
				return
			}
			embed.setTitle(`Cuenta de ${playerInfo.nickname}`)
			const { iconName } = characters[playerInfo.profilePicture.avatarId]
			embed.setThumbnail(`${apiURL}/ui/${iconName}.png`)
			embed.setDescription(
				`**Rango de aventura**: ${playerInfo.level}`,
				`**Nivel de mundo**: ${playerInfo.worldLevel}`,
				`**Firma**: ${escapeMarkdown(playerInfo.signature ?? '_No establecida_')}`,
				`**Abismo**: ${playerInfo.towerFloorIndex ?? 0}-${playerInfo.towerLevelIndex ?? 0}`,
				`**Logros**: ${playerInfo.finishAchievementNum ?? 0}`,
				`**Personajes mostrados**: ${avatarInfoList.map(avatarInfo => locales.es[characters[avatarInfo.avatarId].nameTextHashMap]).join(', ')}`
			)
			sent.edit({ embeds: [embed] })
		} catch (error) {
			embed.setColor(0xFF5050)
			embed.setDescription('Algo salió mal!')
			sent.edit({ embeds: [embed] })
			console.log({ error })
		}
	}
}