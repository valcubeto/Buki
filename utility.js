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
	
module.exports = {
	join,
	escapeRegExp,
	equals
}