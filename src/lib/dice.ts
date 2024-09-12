export type DieType = 'Assault' | 'Skirmish' | 'Raid';

export type Icon = 'hit' | 'selfhit' | 'intercept' | 'buildinghit' | 'key' | 'miss';

type IconTotals = { [key in Icon]: number };

export type DieFace = {
	face: Icon[];
	count: IconTotals;
};

export type Die = {
	type: DieType;
	sides: DieFace[];
	totals: { [key in Icon]: number }; // total # of icons
	faceCounts: { [key in Icon]: number }; // total faces icon is present on
};

export const SkirmishDie: Die = {
	type: 'Skirmish',
	sides: [
		{ face: ['miss'], count: { hit: 0, miss: 1, key: 0, selfhit: 0, intercept: 0, buildinghit: 0 } },
		{ face: ['miss'], count: { hit: 0, miss: 1, key: 0, selfhit: 0, intercept: 0, buildinghit: 0 } },
		{ face: ['miss'], count: { hit: 0, miss: 1, key: 0, selfhit: 0, intercept: 0, buildinghit: 0 } },
		{ face: ['hit'], count: { hit: 1, miss: 0, key: 0, selfhit: 0, intercept: 0, buildinghit: 0 } },
		{ face: ['hit'], count: { hit: 1, miss: 0, key: 0, selfhit: 0, intercept: 0, buildinghit: 0 } },
		{ face: ['hit'], count: { hit: 1, miss: 0, key: 0, selfhit: 0, intercept: 0, buildinghit: 0 } },
	],
	totals: {
		hit: 3,
		miss: 3,
		key: 0,
		selfhit: 0,
		intercept: 0,
		buildinghit: 0,
	},
	faceCounts: {
		hit: 3,
		miss: 3,
		key: 0,
		selfhit: 0,
		intercept: 0,
		buildinghit: 0,
	},
};

export const AssaultDie: Die = {
	type: 'Assault',
	sides: [
		{ face: ['hit', 'hit'], count: { hit: 2, miss: 0, key: 0, selfhit: 0, intercept: 0, buildinghit: 0 } },
		{ face: ['hit', 'hit', 'selfhit'], count: { hit: 2, miss: 0, key: 0, selfhit: 1, intercept: 0, buildinghit: 0 } },
		{ face: ['hit', 'intercept'], count: { hit: 1, miss: 0, key: 0, selfhit: 0, intercept: 1, buildinghit: 0 } },
		{ face: ['hit', 'selfhit'], count: { hit: 1, miss: 0, key: 0, selfhit: 1, intercept: 0, buildinghit: 0 } },
		{ face: ['hit', 'selfhit'], count: { hit: 1, miss: 0, key: 0, selfhit: 1, intercept: 0, buildinghit: 0 } },
		{ face: ['miss'], count: { hit: 0, miss: 1, key: 0, selfhit: 0, intercept: 0, buildinghit: 0 } },
	],
	totals: {
		hit: 7,
		miss: 1,
		selfhit: 3,
		intercept: 1,
		key: 0,
		buildinghit: 0,
	},
	faceCounts: {
		hit: 5,
		miss: 1,
		selfhit: 3,
		intercept: 1,
		key: 0,
		buildinghit: 0,
	},
};

export const RaidDie: Die = {
	type: 'Raid',
	sides: [
		{ face: ['key', 'key', 'intercept'], count: { hit: 0, miss: 0, key: 2, selfhit: 0, intercept: 1, buildinghit: 0 } },
		{ face: ['key', 'selfhit'], count: { hit: 0, miss: 0, key: 1, selfhit: 1, intercept: 0, buildinghit: 0 } },
		{ face: ['key', 'buildinghit'], count: { hit: 0, miss: 0, key: 1, selfhit: 0, intercept: 0, buildinghit: 1 } },
		{ face: ['selfhit', 'buildinghit'], count: { hit: 0, miss: 0, key: 0, selfhit: 1, intercept: 0, buildinghit: 1 } },
		{ face: ['selfhit', 'buildinghit'], count: { hit: 0, miss: 0, key: 0, selfhit: 1, intercept: 0, buildinghit: 1 } },
		{ face: ['intercept'], count: { hit: 0, miss: 0, key: 0, selfhit: 0, intercept: 1, buildinghit: 0 } },
	],
	totals: {
		key: 4,
		selfhit: 3,
		intercept: 2,
		buildinghit: 3,
		hit: 0,
		miss: 0,
	},
	faceCounts: {
		key: 3,
		selfhit: 3,
		intercept: 2,
		buildinghit: 3,
		hit: 0,
		miss: 0,
	},
};
