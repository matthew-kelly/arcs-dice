<script lang="ts">
	import type { DieType } from '$lib/dice';
	import { fade } from 'svelte/transition';

	let { onclick, type, style }: { onclick: () => void; type: DieType; style?: string } = $props();
</script>

<button transition:fade={{ duration: 100 }} {style} class="die {type}" {onclick}>
	<span>{type.charAt(0)}</span>
</button>

<style lang="postcss">
	.die {
		aspect-ratio: 1 / 1;
		width: 100%;
		height: 100%;
		padding: 0;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		opacity: 1;

		&:hover {
			scale: 1.1;
		}

		span {
			color: var(--white);
		}

		/* TODO: fix focusing bug once clicked on mobile */
		/* &:focus {
			scale: 1;
		} */
	}
</style>
