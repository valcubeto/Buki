const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')

class Embed extends EmbedBuilder {
	constructor(options) {
		super({
			color: 0x5050FF,
			description: 'Something went wrong',
			...options,
			author: options.message
				? {
						name: `${options.message.inGuild() ? options.message.member.displayName : options.message.author.name}`,
						icon_url: options.message.author.displayAvatarURL()
					}
				: null
		})
	}
	setDescription(...lines) {
		EmbedBuilder.prototype.setDescription.call(this, lines.join('\n'))
	}
}

class Button extends ButtonBuilder {
	constructor(unique, label, options = {}) {
		super({
			[options.style === ButtonStyle.Link ? 'url' : 'customId']: unique,
			label,
			...options
		})
	}
}

function Row(...components) {
	return [new ActionRowBuilder({ components }), components.map(component => component.customId)]
}

const latinWord = /^[a-záéíóúýäëïöüÿñ]+$/i

/**
 * Joins the items ignoring null or undefined values and putting spaces between words
 * @param  {...any} items
 * @returns {string}
 */
function join(...strings) {
	let result = ''
	for (const item of strings) {
		if (item === undefined || item === null) {
			continue
		}
		const itemAsString = `${item}`
		if (latinWord.test(result.at(-1)) && latinWord.test(itemAsString)) {
			result += ` ${itemAsString}`
		} else {
			result += itemAsString
		}
	}
	return result
}

function escapeRegExp(string) {
	return string.replace(/[\[\](){}?*+.^$|\\]/g, '\\$&')
}

/**
 * @param {any} value
 * @param {any} other
 * @returns {boolean}
 */
function equals(value, other) {
	if (typeof value !== typeof other) return false

	if (value === null && value === undefined) return value === other

	if (['string', 'number', 'bigint'].includes(typeof value)) return value === other

	if (['function', 'symbol'].includes(typeof value)) return value.toString() === other.toString()

	const objectKeys = Object.keys(value)
	const otherKeys = Object.keys(other)
	if (objectKeys.length !== otherKeys.length) return false
	for (const key of objectKeys) {
		if (!equals(value[key], other[key])) return false
	}
	return true
}

/**
 * Formats the date using the YYYY-MM-DD HH:MM:ss.mmm format
 * @param {Date | number} time
 */
function formatDate(time) {
	const date = typeof time === 'number' ? new Date(time) : time

	return [
		date.getFullYear(),
		'-',
		`${date.getMonth() + 1}`.padStart(2, '0'),
		'-',
		`${date.getDate()}`.padStart(2, '0'),
		' ',
		`${date.getHours()}`.padStart(2, '0'),
		':',
		`${date.getMinutes()}`.padStart(2, '0'),
		':',
		`${date.getSeconds()}`.padStart(2, '0'),
		'.',
		`${date.getMilliseconds()}`.padStart(3, '0'),
	].join('')
}

module.exports = {
	Embed,
	Button,
	Row,
	join,
	escapeRegExp,
	equals,
	formatDate
}