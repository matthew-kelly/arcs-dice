<script lang="ts">
	export let showModal: boolean;

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:close={() => (showModal = false)} on:click|self={() => dialog.close()}>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<slot name="header" />
		<div class="divider"></div>
		<slot />
		<!-- svelte-ignore a11y-autofocus -->
		<button autofocus on:click={() => dialog.close()}>x</button>
	</div>
</dialog>

<style>
	dialog {
		max-width: 32rem;
		min-width: 12rem;
		border-radius: 0.2rem;
		border: none;
		padding: 0;
		position: relative;
		background: var(--tan);
		border: 4px solid var(--yellow);
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
		cursor: pointer;
	}
	dialog > div {
		padding: 8px;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.divider {
		display: block;
		width: 100%;
		height: 1px;
		background-color: var(--grey);
		margin: 4px 0 8px;
	}
	button {
		display: block;
		border: none;
		background: none;
		position: absolute;
		top: 0;
		right: 0;
		padding: 8px 8px;
	}
</style>
