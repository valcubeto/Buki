const { escapeMarkdown } = require('discord.js')
const { apiURL, characters, locales } = require('../genshin-api/index')
const { Embed, Row } = require('../utility')

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
	/** @param {{ message: import('discord.js').Message, args: string[] }} param0 */
	command: async ({ message, args: [uid] }) => {
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
			const shownCharacters = avatarInfoList.length
				? avatarInfoList.map(avatarInfo => locales.es[characters[avatarInfo.avatarId].nameTextHashMap]).join(', ')
				: '_ninguno_'
			embed.setDescription(
				`**Rango de aventura**: ${playerInfo.level}`,
				`**Nivel de mundo**: ${playerInfo.worldLevel}`,
				`**Firma**: ${escapeMarkdown(playerInfo.signature ?? '_No establecida_')}`,
				`**Abismo**: ${playerInfo.towerFloorIndex ?? 1}-${playerInfo.towerLevelIndex ?? 1}`,
				`**Logros**: ${playerInfo.finishAchievementNum ?? 0}`,
				`**Personajes mostrados**: ${shownCharacters}`
			)
			/** @type {import('discord.js').ActionRowBuilder[]} */
			const rows = []
			if (avatarInfoList.length) {
				for (let i = 0; i < avatarInfoList.length; i++) {
					const avatarInfo = avatarInfoList[i]
					if (i === 4) { }
				}
			}
			sent.edit({ embeds: [embed], components: rows.length ? rows : undefined })
		} catch (error) {
			embed.setColor(0xFF5050)
			embed.setDescription('Algo salió mal!')
			sent.edit({ embeds: [embed] })
			console.log({ error })
		}
	}
}