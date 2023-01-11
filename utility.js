const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')
const { writeFileSync } = require('node:fs')

class Embed extends EmbedBuilder {
	constructor(options) {
		super({
			color: 0x5050FF,
			description: 'description placeholder',
			...options,
			footer: options.message
				? {
						text: `» ${options.message.inGuild() ? options.message.member.displayName : options.message.author.name}`,
						icon_url: options.message.author.displayAvatarURL()
					}
				: options.footer
		})
	}
	setDescription(...lines) {
		EmbedBuilder.prototype.setDescription.call(this, lines.join('\n'))
	}
}

class Button extends ButtonBuilder {
	/**
	 * @param {string} unique the customId or url
	 * @param {string} label the label
	 * @param {Partial<import('discord.js').ButtonComponentData> | Partial<import('discord.js').APIButtonComponent> | undefined | null} options the options passed to the ButtonBuilder constructor
	 */
	constructor(unique, label, options = {}) {
		if (typeof unique !== 'string' || typeof label !== 'string') throw new TypeError('[class Button] param unique and label must be strings')
		if (typeof options !== 'object') throw new TypeError('[class Button] param options must be an object or undefined/null')
		super({
			[options.style === ButtonStyle.Link ? 'url' : 'customId']: unique,
			label,
			style: ButtonStyle.Primary,
			...options // can spread null?
		})
	}
}

/**
 * @typedef {import('discord.js').APIButtonComponent} APIButtonComponent
 * @typedef {import('discord.js').APIActionRowComponent<APIButtonComponent>} APIActionRowComponent
 */

class Row extends ActionRowBuilder {
	/** @type {string[]} */
	componentIds = []
	/**
	 * ActionRowBuilder<ButtonBuilder>
	 * @param {...APIActionRowComponent} components
	 */
	constructor(...components) {
		super({ components })
		this.componentIds.concat(components.map(component => component.customId))
	}
	/** @param {...Component} components */
	addComponents(...components) {
		ActionRowBuilder.prototype.addComponents.call(this, ...components)
		this.componentIds.concat(components.map(component => component.customId))
	}
	/** @param {...Component} components */
	setComponents(...components) {
		ActionRowBuilder.prototype.setComponents.call(this, ...components)
		this.componentIds = components.map(component => component.customId)
	}
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
 * Formats the date using the YYYY-MM-DD hh:mm:ss.SSS format
 * @param {Date | number} time
 * @returns {string}
 */
function formatDate(time) {
	const date = time == null
		? new Date()
		: typeof time === 'number'
			? new Date(time)
			: time

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

/**
 * Returns a string representation of the value
 * @param {any} value
 * @returns {string}
 */
function represent(value, fullStack) {
	if (value == null || typeof value === 'number' || typeof value === 'boolean') return `${value}`
	if (typeof value === 'bigint') return `${value}n`
	if (typeof value === 'symbol') return `Symbol ${JSON.stringify({ description: value.description })}`
	if (typeof value === 'string') return (value.includes(`'`) ? `"${value.replace(/'/g, `\\'`)}"` : `'${value}'`).replace(/\n/g, '\\n')
	if (typeof value === 'function') return `[Function ${value.name}]`
	if (typeof value === 'object') {
		const realObject = {}
		for (const key of [].concat(Object.keys(value), Object.getOwnPropertyNames(value))) {
			if (key === 'constructor') continue
			try {
				realObject[key] = realObject === value[key] ? 'this' : value[key]
			} catch (error) {
				continue
			}
		}
		return fullStack ? value.constructor.name : `${value.constructor.name} ${JSON.stringify(realObject, (k, v) => k === '' ? v : represent(v, true), 2)}`
	}
	return `unknown ${value}`
}

/**
 * Creates a table representation of the object
 * @param {{ [key: string]: any }} object
 * @returns {string}
 */
function table(object) {
	const keys = Object.keys(object)
	const values = Object.values(object).map(value => `${value}`)
	const maxKeyLength = Math.max(...keys.map(key => key.length))
	const maxValueLength = Math.max(...values.map(value => value.length))
	return [
		`┌─${''.padEnd(maxKeyLength, '─')}─┬─${''.padEnd(maxValueLength, '─')}─┐`,
		...keys.map((key, i) => `│ ${key.padEnd(maxKeyLength, ' ')} │ ${values[i].padEnd(maxValueLength, ' ')} │`),
		`└─${''.padEnd(maxKeyLength, '─')}─┴─${''.padEnd(maxValueLength, '─')}─┘`
	].join('\n')
}

/*
  ┌ ─ ┬ ┐
  │     │
  ├   ┼ ┤
  └ ─ ┴ ┘
*/

function saveFile(data, path) {
	writeFileSync(path, JSON.stringify(data, null, 2))
}

module.exports = {
	Embed,
	Button,
	Row,
	join,
	escapeRegExp,
	equals,
	formatDate,
	represent,
	table,
	saveFile
}