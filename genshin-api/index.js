const locales = require('./locales.json')
const costumes = require('./costumes.json')
const characters = require('./characters.json')
const namecards = require('./namecards.json')
const apiURL = 'https://enka.network'

module.exports = {
	locales,
	costumes,
	/**	@type {import('./characters').Characters} */
	characters,
	namecards,
	apiURL
}