<script lang="ts">
	import { AssaultDie, RaidDie, SkirmishDie, type Die, type DieType, type Icon } from '$lib/dice';
	import DieIcon from './DieIcon.svelte';
	import hitImg from '$lib/images/hit.png';
	import selfhitImg from '$lib/images/selfhit.png';
	import interceptImg from '$lib/images/intercept.png';
	import buildinghitImg from '$lib/images/buildinghit.png';
	import keyImg from '$lib/images/key.png';

	let selectedDice: { [key in DieType]: number } = $state({
		Skirmish: 0,
		Assault: 0,
		Raid: 0,
	});
	let skirmishDice = $derived(selectedDice['Skirmish']);
	let assaultDice = $derived(selectedDice['Assault']);
	let raidDice = $derived(selectedDice['Raid']);
	let base: { [key in Icon]: number } = {
		hit: 0,
		selfhit: 0,
		intercept: 0,
		key: 0,
		buildinghit: 0,
		miss: 0,
	};
	let totalOdds: { [key in 'total' | 'atLeastOne']: { [key in Icon]: number } } = $state({
		total: { ...base },
		atLeastOne: { ...base },
	});

	function addDie(type: DieType) {
		if (selectedDice[type] < 6) {
			selectedDice[type] += 1;
		}
		calculateOdds();
	}
	function removeDie(type: DieType, all = false) {
		if (all) {
			selectedDice[type] = 0;
		} else if (selectedDice[type] > 0) {
			selectedDice[type] -= 1;
		}
		calculateOdds();
	}

	function calculateOdds() {
		let odds = {
			total: {
				...base,
			},
			atLeastOne: {
				...base,
			},
		};

		for (const [die, val] of Object.entries(selectedDice)) {
			if (val === 0) continue;
			if (die === 'Skirmish') {
				let { totals } = SkirmishDie;
				odds.total.hit += calcVal(totals.hit, val);
			} else if (die === 'Assault') {
				let { totals } = AssaultDie;
				odds.total.hit += calcVal(totals.hit, val);
				odds.total.selfhit += calcVal(totals.selfhit, val);
				odds.total.intercept += calcVal(totals.intercept, val);
			} else if (die === 'Raid') {
				let { totals } = RaidDie;
				odds.total.key += calcVal(totals.key, val);
				odds.total.selfhit += calcVal(totals.selfhit, val);
				odds.total.intercept += calcVal(totals.intercept, val);
				odds.total.buildinghit += calcVal(totals.buildinghit, val);
			}
		}

		for (const [k, v] of Object.entries(odds.total)) {
			if (v === 0 || k === 'miss') continue;
			const key = k as Icon;
			let a = calcAtLeastOne(SkirmishDie, key, selectedDice.Skirmish);
			let b = calcAtLeastOne(AssaultDie, key, selectedDice.Assault);
			let c = calcAtLeastOne(RaidDie, key, selectedDice.Raid);
			// P(A∪B∪C) = P(A) + P(B) + P(C) − P(A∩B) − P(A∩C) − P(B∩C) + P(A∩B∩C)
			odds.atLeastOne[key] = a + b + c - a * b - a * c - b * c + a * b * c;
		}

		totalOdds = { total: odds.total, atLeastOne: odds.atLeastOne };
	}

	// expected number of icon occurrences
	function calcVal(total: number, numberOfDice: number) {
		return (total * numberOfDice) / 6;
	}

	function calcAtLeastOne(die: Die, icon: Icon, count: number) {
		return 1 - ((6 - die.faceCounts[icon]) / 6) ** count;
	}

	function round(num: number, toPercent = false) {
		const formatter = new Intl.NumberFormat('en-US', {
			style: 'decimal',
			maximumFractionDigits: 2,
			minimumFractionDigits: 0,
		});
		if (toPercent) {
			num = num * 100;
		}
		return formatter.format(num);
	}
</script>

<div class="container">
	<div class="dice-overview">
		<div class="dice-buttons">
			<button class="Skirmish" onclick={() => addDie('Skirmish')} disabled={skirmishDice === 6}>
				<span>Skirmish</span>
			</button>
			<button class="Assault" onclick={() => addDie('Assault')} disabled={assaultDice === 6}>
				<span>Assault</span>
			</button>
			<button class="Raid" onclick={() => addDie('Raid')} disabled={raidDice === 6}>
				<span>Raid</span>
			</button>
		</div>

		<div class="die-section">
			<div class="die-col">
				{#each Array(skirmishDice) as _, i (i)}
					<DieIcon type="Skirmish" onclick={() => removeDie('Skirmish')} />
				{/each}
			</div>
			<div class="die-col">
				{#each Array(assaultDice) as _, i (i)}
					<DieIcon type="Assault" onclick={() => removeDie('Assault')} />
				{/each}
			</div>
			<div class="die-col">
				{#each Array(raidDice) as _, i (i)}
					<DieIcon type="Raid" onclick={() => removeDie('Raid')} />
				{/each}
			</div>
		</div>
		<div class="remove-buttons">
			<button class="remove" onclick={() => removeDie('Skirmish', true)} disabled={skirmishDice === 0}>X</button>
			<button class="remove" onclick={() => removeDie('Assault', true)} disabled={assaultDice === 0}>X</button>
			<button class="remove" onclick={() => removeDie('Raid', true)} disabled={raidDice === 0}>X</button>
		</div>
	</div>

	<div class="odds-table">
		<div class="title-row">
			<span class="title">Expected Number</span>
			<span class="title">Chance of at least 1</span>
		</div>

		<p class="heading">Hits</p>
		<span>{round(totalOdds.total.hit)}</span>
		<img src={hitImg} alt="hit icon" />
		<span>{round(totalOdds.atLeastOne.hit, true) + '%'}</span>
		<div class="divider"></div>

		<p class="heading">Self Hits</p>
		<span>{round(totalOdds.total.selfhit)}</span>
		<img src={selfhitImg} alt="self-hit icon" />
		<span>{round(totalOdds.atLeastOne.selfhit, true) + '%'}</span>
		<div class="divider"></div>

		<p class="heading">Intercepts</p>
		<span>{round(totalOdds.total.intercept)}</span>
		<img src={interceptImg} alt="intercept icon" />
		<span>{round(totalOdds.atLeastOne.intercept, true) + '%'}</span>
		<div class="divider"></div>

		<p class="heading">Keys</p>
		<span>{round(totalOdds.total.key)}</span>
		<img src={keyImg} alt="key icon" />
		<span>{round(totalOdds.atLeastOne.key, true) + '%'}</span>
		<div class="divider"></div>

		<p class="heading">Building Hits</p>
		<span>{round(totalOdds.total.buildinghit)}</span>
		<img src={buildinghitImg} alt="building-hit icon" />
		<span>{round(totalOdds.atLeastOne.buildinghit, true) + '%'}</span>
		<div class="divider"></div>
	</div>

	<div class="credit">
		<a href="https://ledergames.com/products/arcs" target="_blank">
			Arcs by <span>Leder Games</span>
		</a>
		<a href="https://matthewkelly.ca" target="_blank">
			Site by <span>Matty Kelly</span>
		</a>
	</div>
</div>

<style lang="postcss">
	.container {
		--padding: 8px;
		--max-height: 150px;
		--gap: 4px;
		--height-calc: calc((var(--max-height) - var(--gap) * 2) / 3);

		display: flex;
		flex-direction: column;
		width: calc(100% - var(--padding) * 6);
		height: 100%;
		max-width: 500px;
		max-height: 800px;
		padding: var(--padding);
		margin: 0 var(--padding) var(--padding);
		background: var(--tan-fade);
		border: var(--padding) solid var(--yellow);
		overflow-x: hidden;
		overflow-y: auto;
	}
	.dice-overview {
		position: relative;
		display: flex;
		align-items: center;
		gap: 8px;
		height: var(--max-height);
		margin-bottom: 16px;
	}
	.dice-buttons {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: var(--gap);

		button {
			font-size: 16px;
			padding: 12px 24px;
			height: var(--height-calc);
		}
	}
	.die-section {
		--width: var(--height-calc);

		flex-grow: 1;
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--gap);
	}
	.die-col {
		position: relative;
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		grid-template-rows: repeat(1, 1fr);
		gap: var(--gap);
		/* width: 100%; */
		height: var(--height-calc);
		max-width: fit-content;
	}
	.remove-buttons {
		display: flex;
		flex-direction: column;
		position: absolute;
		right: 0;
		transform: translateX(25%);
		height: 100%;
		justify-content: space-around;

		button {
			background: inherit;
			border: none;
			padding: 8px;
			font-size: 12px;
			color: var(--grey);
			opacity: 1;
			transition: all 0.1s cubic-bezier(0.19, 1, 0.22, 1);

			&:disabled {
				opacity: 0;
			}
		}
	}

	.odds-table {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		text-align: center;
		width: 100%;
		max-width: 386px;
		margin: 0 auto;

		.title-row {
			grid-column: 1 / span 3;
			display: flex;
			justify-content: space-between;

			.title {
				font-size: 16px;
				padding: 4px;
				border-top: 2px solid var(--grey);
				border-bottom: 2px solid var(--grey);
				text-wrap: balance;
			}
		}
		.heading {
			grid-column: 1 / span 3;
			margin: 8px 0 4px;
		}
		img {
			width: 24px;
			margin: 0 auto;
		}
		.divider {
			/* height: 1px; */
			display: block;
			border-bottom: 1px solid var(--grey);
			/* color: var(--grey); */
			width: 100%;
			grid-column: 1 / span 3;
			margin-top: 2px;
		}
	}

	.credit {
		flex-grow: 1;
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: 16px;
		margin-top: 8px;

		a {
			font-size: 10px;
			text-decoration: none;
			text-wrap: balance;
			max-width: 120px;
			color: var(--grey);

			&:hover {
				text-decoration: initial;
			}

			&:last-of-type {
				text-align: end;
			}

			span {
				font-size: inherit;
				color: inherit;
				white-space: nowrap;
			}
		}
	}

	@media (max-width: 512px) {
		.container {
			--max-height: 308px;
		}
		.dice-overview {
			margin-bottom: 8px;
		}
		.dice-buttons {
			button {
				font-size: 14px;
				padding: 8px 16px;
				rotate: 180deg;
				height: 100px;
				width: 52px;

				span {
					writing-mode: vertical-rl;
				}
			}
		}
		.die-section {
			--width: 48px;

			grid-template-columns: 1fr;
			max-width: 150px;
		}
		.die-col {
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: repeat(2, 1fr);
			height: 100px;
			min-width: 100%;
		}
	}
</style>
