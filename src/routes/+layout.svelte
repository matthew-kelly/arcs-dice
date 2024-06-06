<script lang="ts">
	import '../app.pcss';

	let { children } = $props();

	function noDoubleClick(event: MouseEvent) {
		event.preventDefault();
	}

	$effect(() => {
		// prevent doubletap zoom on ios
		document.addEventListener('dblclick', noDoubleClick, { passive: false });

		return () => {
			document.removeEventListener('dblclick', noDoubleClick);
		};
	});
</script>

<div class="app-container">
	<h1>Arcs Dice</h1>
	{@render children()}
</div>

<style lang="postcss">
	.app-container {
		background-image: url('../space-bg.svg');
		background-position: center;
		background-repeat: repeat;
		background-size: 275px;
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	h1 {
		color: var(--white);
		margin: 12px 0;
		font-size: 32px;
	}
</style>
