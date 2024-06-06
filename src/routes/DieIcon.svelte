<script lang="ts">
	import type { DieType } from '$lib/dice';
	import { fade } from 'svelte/transition';

	let { onclick, type, style }: { onclick: () => void; type: DieType; style?: string } = $props();
</script>

<!-- TODO: transition bug, can't add params -->
<button {style} class="die {type} {onclick ? 'has-click' : ''}" {onclick} />

<style>
	.die {
		/* width: var(--width); */
		/* height: var(--width); */
		aspect-ratio: 1 / 1;
		width: 100%;
		padding: 0;
		border: none;
		border-radius: 4px;
		opacity: 1;
		transition: all 0.25s cubic-bezier(0.19, 1, 0.22, 1);
	}

	.die:hover {
		scale: 1.1;
	}
	/* TODO: fix focusing bug once clicked on mobile */
	/* .die:active,
	.die:focus {
		scale: 1;
	} */

	.has-click {
		cursor: pointer;
	}
</style>
