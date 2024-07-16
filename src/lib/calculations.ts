import { SkirmishDie, AssaultDie, RaidDie, type Icon } from '$lib/dice';

// expected number of icon occurrences
export function calcVal(total: number, numberOfDice: number) {
	return (total * numberOfDice) / 6;
}

type NumTable = { [key: number]: number };
// computes only results below desired sum and subtracts from 1 (calcs inverse) (faster and more performant)
export function computeProbabilityAtLeastN(
	icon: Icon,
	assaultDiceCount: number,
	skirmishDiceCount: number,
	raidDiceCount: number,
	desiredSum: number
) {
	// die options
	const assault = AssaultDie.sides.map((side) => side.count[icon]);
	const skirmish = SkirmishDie.sides.map((side) => side.count[icon]);
	const raid = RaidDie.sides.map((side) => side.count[icon]);

	// choose the two dice for given icon
	const dice1Sides = assault;
	const countDice1 = assaultDiceCount;
	let dice2Sides: number[];
	let countDice2: number;
	if (icon === 'hit') {
		dice2Sides = skirmish;
		countDice2 = skirmishDiceCount;
	} else {
		dice2Sides = raid;
		countDice2 = raidDiceCount;
	}

	// Maximum possible sum
	// we are only using desiredSum-1 since we are subtracting calculated sums from 1 in the end
	const maxSum = desiredSum - 1;

	// Probability Mass Function (PMF) => table of probabilities for each side count
	const pmf = (sides: number[]): NumTable => {
		const counts: NumTable = {};
		const probabilities: NumTable = {};
		const totalSides = sides.length;
		sides.forEach((side) => (counts[side] = (counts[side] || 0) + 1));
		for (const [side, count] of Object.entries(counts)) {
			probabilities[parseInt(side)] = count / totalSides;
		}
		return probabilities;
	};

	// set up probability tables for each selected die type and sum
	const P1 = Array(maxSum + 1).fill(0);
	const P2 = Array(maxSum + 1).fill(0);
	// probability of sum=0 with 0 dice is 100%
	P1[0] = 1;
	P2[0] = 1;

	// PMF for each selected die type
	const pmf1 = pmf(dice1Sides);
	const pmf2 = pmf(dice2Sides);

	// update probability table using dynamic programming approach
	const updateProbabilities = (P: number[], pmf: NumTable, diceCount: number) => {
		for (let i = 1; i <= diceCount; i++) {
			const newP = Array(maxSum + 1).fill(0);
			for (let s = 0; s <= maxSum; s++) {
				for (const [side, prob] of Object.entries(pmf)) {
					const sideNum = parseInt(side);
					if (s >= sideNum) {
						newP[s] += prob * P[s - sideNum];
					}
				}
			}
			for (let s = 0; s <= maxSum; s++) {
				P[s] = newP[s];
			}
		}
	};

	updateProbabilities(P1, pmf1, countDice1);
	updateProbabilities(P2, pmf2, countDice2);

	// combine the two probability distributions
	const PCombined = Array(maxSum + 1).fill(0);
	for (let s = 0; s <= maxSum; s++) {
		for (let x = 0; x <= s; x++) {
			PCombined[s] += P1[x] * P2[s - x];
		}
	}

	// inverse sum probabilities from 1 (get probability of LESS THAN desired sum)
	let probability = 1;
	for (let s = 0; s <= maxSum; s++) {
		probability -= PCombined[s];
	}

	if (probability < 0.0000009) {
		probability = 0;
	}

	return probability;
}

// // computes all results then sums desired (this is slow and not performant)
// export function OLDcomputeProbabilityAtLeastN(
// 	icon: Icon,
// 	assaultDiceCount: number,
// 	skirmishDiceCount: number,
// 	raidDiceCount: number,
// 	desiredSum: number
// ) {
// 	// die options
// 	const assault = AssaultDie.sides.map((side) => side.count[icon]);
// 	const skirmish = SkirmishDie.sides.map((side) => side.count[icon]);
// 	const raid = RaidDie.sides.map((side) => side.count[icon]);

// 	// choose the two dice for given icon
// 	let dice1Sides = assault;
// 	let countDice1 = assaultDiceCount;
// 	let dice2Sides: number[];
// 	let countDice2: number;
// 	if (icon === 'hit') {
// 		dice2Sides = skirmish;
// 		countDice2 = skirmishDiceCount;
// 	} else {
// 		dice2Sides = raid;
// 		countDice2 = raidDiceCount;
// 	}

// 	// Maximum possible sum
// 	const maxSum = countDice1 * Math.max(...dice1Sides) + countDice2 * Math.max(...dice2Sides);

// 	// Probability Mass Function (PMF) => table of probabilities for each side count
// 	const pmf = (sides: number[]): NumTable => {
// 		const counts: NumTable = {};
// 		const probabilities: NumTable = {};
// 		const totalSides = sides.length;
// 		sides.forEach((side) => (counts[side] = (counts[side] || 0) + 1));
// 		for (const [side, count] of Object.entries(counts)) {
// 			probabilities[parseInt(side)] = count / totalSides;
// 		}
// 		console.log(probabilities);
// 		return probabilities;
// 	};

// 	// set up probability tables for each selected die type and sum
// 	const P1 = Array(maxSum + 1).fill(0);
// 	const P2 = Array(maxSum + 1).fill(0);
// 	// probability of sum=0 with 0 dice is 100%
// 	P1[0] = 1;
// 	P2[0] = 1;

// 	// PMF for each selected die type
// 	const pmf1 = pmf(dice1Sides);
// 	const pmf2 = pmf(dice2Sides);

// 	// update probability table using dynamic programming approach
// 	const updateProbabilities = (P: number[], pmf: NumTable, diceCount: number) => {
// 		for (let i = 1; i <= diceCount; i++) {
// 			const newP = Array(maxSum + 1).fill(0);
// 			for (let s = 0; s <= maxSum; s++) {
// 				for (const [side, prob] of Object.entries(pmf)) {
// 					const sideNum = parseInt(side);
// 					if (s >= sideNum) {
// 						newP[s] += prob * P[s - sideNum];
// 					}
// 				}
// 			}
// 			for (let s = 0; s <= maxSum; s++) {
// 				P[s] = newP[s];
// 			}
// 		}
// 	};

// 	updateProbabilities(P1, pmf1, countDice1);
// 	updateProbabilities(P2, pmf2, countDice2);

// 	// combine the two probability distributions
// 	const PCombined = Array(maxSum + 1).fill(0);
// 	for (let s = 0; s <= maxSum; s++) {
// 		for (let x = 0; x <= s; x++) {
// 			PCombined[s] += P1[x] * P2[s - x];
// 		}
// 	}
// 	console.log({ PCombined });

// 	// sum probabilities >= desiredSum
// 	let probability = 0;
// 	for (let s = desiredSum; s <= maxSum; s++) {
// 		probability += PCombined[s];
// 	}
// 	return probability;
// }
