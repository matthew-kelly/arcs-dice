<script lang="ts">
	import type { DieType } from '$lib/dice';
	import { fade } from 'svelte/transition';

	let { onclick, type, style }: { onclick: () => void; type: DieType; style?: string } = $props();
</script>

<button transition:fade={{ duration: 100 }} {style} class="die {type}" {onclick}></button>

<style lang="postcss">
	.die {
		/* width: var(--width); */
		/* height: var(--width); */
		aspect-ratio: 1 / 1;
		width: 100%;
		height: 100%;
		padding: 0;
		border: none;
		border-radius: 4px;
		cursor: pointer;

		opacity: 1;
		transition: all 0.25s cubic-bezier(0.19, 1, 0.22, 1);

		&:hover {
			scale: 1.1;
		}

		/* TODO: fix focusing bug once clicked on mobile */
		/* &:focus {
			scale: 1;
		} */
	}
</style>
