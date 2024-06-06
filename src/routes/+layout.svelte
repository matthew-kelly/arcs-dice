<script lang="ts">
	import '../app.css';
</script>

<div class="app-container">
	<h1>Arcs Dice</h1>
	<slot />
</div>

<style>
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
