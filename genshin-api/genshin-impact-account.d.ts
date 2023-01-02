interface ShowAvatarInfo {
	avatarId: number
	level: number
}

interface Stat {
	appendPropId: string
	statValue: number
}

interface Artifact {
	flat: {
		equipType: string
		icon: string
		itemType: string
		nameTextMapHash: string
		setNameTextMapHash: string
		rankLevel: number
		reliquaryMainStat: Stat
		reliquarySubstats: Stat[]
	}
	itemId: number
	reliquary: {
		appendPropIdList: number[]
		level: number
		mainPropId: number
	}
}

interface Weapon {
	flat: {
		icon: string
		itemType: string
		nameTextMapHash: string
		rankLevel: number
		weaponStats: Stat[]
	}
	itemId: number
	weapon: {
		affixMap: Object<number, number>
		level: number
		promoteLevel: number
	}
}

interface AvatarInfo {
	avatarId: number
	equipList: (Artifact | Weapon)[]
	fetterInfo: {
		expLevel: number
	}
	fightPropMap: {
		[number]: number
	}
	propMap: {
		[number]: {
			type: number
			ival: number
			val?: number
		}
		skillDepotId: number
		skillLevelMap: Object<number, number>
	}
	inherentProudSkillList: number[]
}

export interface GenshinImpactAccount {
	uid?: string
	ttl: number
	playerInfo: {
		nickname: string
		signature?: string
		level: number
		profilePicture: {
			avatarId: number
		},
		nameCardId: number
		worldLevel?: number
		showAvatarInfoList?: ShowAvatarInfo[]
		showNameCardIdList?: number[]
		finishAchievementNum?: number
		towerFloorIndex?: number
		towerLevelIndex?: number
	},
	avatarInfoList?: AvatarInfo[]
}