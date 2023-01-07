const { escapeMarkdown } = require('discord.js')
const {
	apiURL,
	/**	@type {import('../genshin-api/characters.d.ts').Characters} */
	characters,
	locales
} = require('../genshin-api/index')
const { Embed, Row, Button } = require('../utility')
const { createCanvas, loadImage } = require('canvas')

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
			/** @type {import('../genshin-api/genshin-impact-account').GenshinImpactAccount} */
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
				const firstRow = new Row()
				const secondRow = new Row()
				for (let i = 0; i < avatarInfoList.length; i++) {
					(i < 4 ? firstRow : secondRow).addComponents(
						new Button(
							`${i}`,
							locales.es[characters[avatarInfoList.at(i).avatarId].nameTextHashMap]
						)
					)
				}
				if (firstRow.components.length) {
					rows.push(firstRow)
					if (secondRow.components.length) {
						rows.push(secondRow)
					}
				}
			}
			sent.edit({ embeds: [embed], components: rows.length ? rows : undefined })
			if (rows.length) {
				const collector = sent.createMessageComponentCollector({ filter: interaction => interaction.user.id === message.author.id, time: 30_000 })
				collector.on('collect', interaction => {
					rows.forEach(row => row.components.forEach(component => {
						component.setDisabled(component.data.custom_id === interaction.component.customId)
					}))
					const avatarInfo = avatarInfoList[interaction.component.customId]
					const character = characters[avatarInfo.avatarId]
					const artifacts = avatarInfo.equipList ?? []
					const weapon = artifacts.pop() ?? {}
					embed.setDescription(
						`**Personaje**: ${locales.es[character.nameTextHashMap]} C${avatarInfo.talentIdList?.length ?? 0}`,
						`**Arma**: ${locales.es[weapon.flat.nameTextMapHash]} R${(weapon.weapon?.promoteLevel ?? 2) - 1} al ${weapon.weapon?.level}`
					)
					embed.setThumbnail(`${apiURL}/ui/${character.iconName}.png`)
					embed.setImage(`${apiURL}/ui/${character.art}.png`)
					interaction.update({ embeds: [embed], components: rows })
				})
				collector.on('end', () => {
					rows.forEach(row => row.components.forEach(component => component.setDisabled(true)))
					sent.edit({ embeds: [embed], components: rows })
				})
			}
		} catch (error) {
			embed.setColor(0xFF5050)
			embed.setDescription('Algo salió mal!')
			sent.edit({ embeds: [embed] })
			console.log({ error })
		}
	}
}

function makeButton(avatarInfo, i) {
	const customId = `${i}`
	const label = locales.es[characters[avatarInfo.avatarId].nameTextHashMap]
	console.log({ customId, label })
	return new Button(customId, label)
}