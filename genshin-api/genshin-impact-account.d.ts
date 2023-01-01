interface ShowAvatarInfo {
	avatarId: number
	level: number
}

interface ReliquaryStat {
	appendPropId: string
	statValue: number
}

interface Equipment {
	flat: {
		equipType: string
		icon: string
		itemType: string
		nameTextMapHash: string
		setNameTextMapHash: string
		rankLevel: number
		reliquaryMainStat: ReliquaryStat
		reliquarySubstats: ReliquaryStat[]
	}
	itemId: number
	reliquary: {
		appendPropIdList: number[]
		level: number
		mainPropId: number
	}
}

interface AvatarInfo {
	avatarId: number
	equipList: Equipment[]
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
		skillLevelMap: {
			[number]: number
		}
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