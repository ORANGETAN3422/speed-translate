<script lang="ts">
	import { deleteSet, type customSet } from '$lib/helpers/saving';

	let {
		set,
		onclick,
		onDeleteClick,
		canDelete
	}: {
		set: customSet;
		onclick: (set: customSet) => void;
		onDeleteClick: () => void;
		canDelete: boolean;
	} = $props();

	function handleDelete() {
		deleteSet(set.name);
		onDeleteClick();
	}
</script>

<div
	role="button"
	tabindex="0"
	onclick={() => onclick(set)}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick(set);
		}
	}}
	class="hover-sfx click-sfx border-fancy bg-fancy shadow-fancy interactive flex w-full min-w-48 cursor-pointer px-3 py-2 text-left"
	class:flex-col={canDelete}
	class:items-stretch={canDelete}
	class:gap-1.5={canDelete}
	class:items-center={!canDelete}
	class:gap-3={!canDelete}
>
	<span class="flex-1 truncate text-md tracking-wider uppercase">{set.name}</span>

	<div class="flex items-center justify-between gap-2">
		<span class="text-muted shrink-0 text-xs tabular-nums">{set.count} questions</span>
		{#if canDelete}
			<button
				type="button"
				onclick={(e) => {
					e.stopPropagation();
					handleDelete();
				}}
				class="hover-sfx click-sfx border-fancy interactive flex h-6 w-6 shrink-0 items-center justify-center text-xs"
				aria-label="Delete set"
			>
				✕
			</button>
		{/if}
	</div>
</div>
