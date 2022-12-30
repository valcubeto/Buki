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

module.exports = {
	join,
	escapeRegExp
}