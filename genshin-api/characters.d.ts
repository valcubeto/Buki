type Element = 'Anemo' | 'Geo' | 'Electro' | 'Dendro' | 'Hydro' | 'Pyro' | 'Cryo'

type Identifier = `${number}`

interface Costume {
	sideIconName: string
	iconName: string
	art: string
	avatarId: Identifier
}

interface Character {
	element: Element
	constellations: string[]
	skillOrder: Identifier[]
	skills: {
		[id: Identifier]: string
	}
	proudMap: {
		[id: Identifier]: Identifier
	}
	nameTextHashMap: Identifier
	iconName: string
	sideIconName: string
	qualityType: string
	costumes?: {
		[id: Identifier]: Costume
	}
}

export interface Characters {
	[id: Identifier]: Character
}