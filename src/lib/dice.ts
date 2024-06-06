export type DieType = 'Assault' | 'Skirmish' | 'Raid';

export type Icon = 'hit' | 'selfhit' | 'intercept' | 'buildinghit' | 'key' | 'miss';

export type DieFace = {
	face: Icon[];
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
		{ face: ['miss'] },
		{ face: ['miss'] },
		{ face: ['miss'] },
		{ face: ['hit'] },
		{ face: ['hit'] },
		{ face: ['hit'] },
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
		{ face: ['hit', 'hit'] },
		{ face: ['hit', 'hit', 'selfhit'] },
		{ face: ['hit', 'intercept'] },
		{ face: ['hit', 'selfhit'] },
		{ face: ['hit', 'selfhit'] },
		{ face: ['miss'] },
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
		{ face: ['key', 'key', 'intercept'] },
		{ face: ['key', 'selfhit'] },
		{ face: ['key', 'buildinghit'] },
		{ face: ['selfhit', 'buildinghit'] },
		{ face: ['selfhit', 'buildinghit'] },
		{ face: ['intercept'] },
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
