const { escapeMarkdown } = require("discord.js")

module.exports = {
	name: 'genshin',
	description: 'Gets a Genshin Impact account using its UID',
	args: '<uid>',
	command: ({ message, args: [uid], utility: { join } }) => {
		if (!/^[0-9]+$/.test(uid)) {
			message.channel.send('Invalid UID')
		}
		fetch(`https://enka.network/u/${uid}/__data.json`)
			.then(data => data.json())
			.then(({ playerInfo: player, avatarInfoList: characters, uid }) => {
				message.channel.send([
					`${escapeMarkdown(player.nickname)}, AR ${player.level} (mundo nivel ${player.worldLevel})`,
					`\t_"${player.signature}"_`,
					`${player.finishAchievementNum} logros, abismo ${player.towerFloorIndex} - ${player.towerLevelIndex}`,
					`UID: ${uid}`
				].join('\n'))
			})
			.catch(error => {
				console.error({ command: this.name, error })
			})
	}
}