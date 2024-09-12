import { AssaultDie, RaidDie, SkirmishDie, type Die, type DieType, type DieFace, type Icon } from './dice';

type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];

// for each die given, randomly select an index from 0 to 5 for the die.sides array
// return the rolled DieFace (.face and .count)

function rollDie(die: Die) {
	const i = Math.floor(Math.random() * 6);
	return die.sides[i];
}

export function rollAllDice(selectedDice: { [key in DieType]: number }) {
	const resultsCondensed = [];
	const resultsArr: { [key in DieType]: DieFace[] } = {
		Skirmish: [],
		Assault: [],
		Raid: [],
	};
	const totals: { [key in Icon]: number } = {
		hit: 0,
		miss: 0,
		selfhit: 0,
		intercept: 0,
		key: 0,
		buildinghit: 0,
	};

	// roll each kind of die the required number of times
	for (const [die, val] of Object.entries(selectedDice) as Entries<typeof selectedDice>) {
		if (val === 0) continue;
		let dieType = SkirmishDie;
		if (die === 'Assault') {
			dieType = AssaultDie;
		} else if (die === 'Raid') {
			dieType = RaidDie;
		}
		for (let i = 0; i < val; i++) {
			const roll = rollDie(dieType);
			resultsArr[die].push(roll);
			resultsCondensed.push(roll.count);
		}
	}

	// tally icon totals
	resultsCondensed.forEach((count) => {
		for (const [icon, val] of Object.entries(count) as Entries<typeof count>) {
			totals[icon] += val;
		}
	});

	return { results: resultsArr, totals };
}
