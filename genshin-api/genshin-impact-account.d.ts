type Identifier = `${number}`

interface ShowAvatarInfo {
	avatarId: Identifier
	level: number
}

interface Stat {
	appendPropId: Identifier
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
	weapon?: {
		affixMap: {
			[id: Identifier]: number
		}
		level: number
		promoteLevel?: number
	}
}

interface AvatarInfo {
	avatarId: Identifier
	equipList: (Artifact | Weapon)[]
	talentIdList: number[],
	fetterInfo: {
		expLevel: number
	}
	fightPropMap: {
		[number]: number
	}
	propMap: {
		[id: Identifier]: {
			type: number
			/** @deprecated ignore */ ival: number
			val?: number
		}
		skillDepotId: number
		skillLevelMap: {
			[id: Identifier]: number
		}
	}
	inherentProudSkillList: number[]
}

export interface GenshinImpactAccount {
	/** if there is no uid means that the user hasn't unlocked the co-op mode */
	uid?: string
	ttl: number
	playerInfo: {
		nickname: string
		signature?: string
		level: number
		profilePicture: {
			avatarId: Identifier
		},
		nameCardId: Identifier
		worldLevel?: number
		showAvatarInfoList?: ShowAvatarInfo[]
		showNameCardIdList?: number[]
		finishAchievementNum?: number
		towerFloorIndex?: number
		towerLevelIndex?: number
	},
	avatarInfoList?: AvatarInfo[]
}