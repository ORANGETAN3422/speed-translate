<script lang="ts">
	import { deleteSet, jsonToCsv, type customSet } from '$lib/helpers/saving';

	let {
		set,
		onclick,
		onDeleteClick,
		onEditClick,
		canDelete,
		nameOnly = false
	}: {
		set: customSet;
		onclick: (set: customSet, count: number) => void;
		onDeleteClick: () => void;
		onEditClick?: (set: customSet) => void;
		canDelete: boolean;
		nameOnly?: boolean;
	} = $props();

	const total = set.sentences.length;
	const minCount = Math.min(5, total);
	const maxCount = total;
	const initialCount = Math.min(Math.max(parseInt(set.count) || 10, minCount), maxCount);
	let count = $state(initialCount);
	const showAdjuster = minCount < maxCount;

	function adjust(delta: number) {
		const next = delta > 0 ? Math.floor(count / 5) * 5 + 5 : Math.ceil(count / 5) * 5 - 5;
		count = Math.max(minCount, Math.min(maxCount, next));
	}

	function handleDelete() {
		deleteSet(set.name);
		onDeleteClick();
	}

	function handleDownload() {
		const csv = jsonToCsv(set);
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${set.name}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div
	role="button"
	tabindex="0"
	onclick={() => onclick(set, count)}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick(set, count);
		}
	}}
	class="hover-sfx click-sfx border-fancy bg-fancy shadow-fancy interactive flex w-full min-w-48 cursor-pointer px-3 py-2 text-left"
	class:flex-col={canDelete}
	class:items-stretch={canDelete}
	class:gap-1.5={canDelete}
	class:items-center={!canDelete}
	class:gap-3={!canDelete}
>
	{#if nameOnly}
		<span class="text-md flex-1 truncate tracking-wider uppercase">{set.name}</span>
	{:else if canDelete}
		<div class="flex items-center gap-2">
			<span class="text-md flex-1 truncate tracking-wider uppercase">{set.name}</span>
			<button
				type="button"
				onclick={(e) => {
					e.stopPropagation();
					handleDownload();
				}}
				class="hover-sfx click-sfx border-fancy interactive flex h-6 w-6 shrink-0 items-center justify-center text-xs"
				aria-label="Download set as CSV"
			>
				↓
			</button>
		</div>

		<div class="flex items-center justify-between gap-2">
			{#if showAdjuster}
				<div class="flex items-center gap-1.5">
					<button
						type="button"
						onclick={(e) => {
							e.stopPropagation();
							adjust(-5);
						}}
						disabled={count <= minCount}
						class="hover-sfx click-sfx border-fancy interactive flex h-5 w-5 shrink-0 items-center justify-center text-xs disabled:opacity-40"
						aria-label="Decrease question count"
					>
						−
					</button>
					<span class="w-6 text-center text-xs tabular-nums">{count}</span>
					<button
						type="button"
						onclick={(e) => {
							e.stopPropagation();
							adjust(5);
						}}
						disabled={count >= maxCount}
						class="hover-sfx click-sfx border-fancy interactive flex h-5 w-5 shrink-0 items-center justify-center text-xs disabled:opacity-40"
						aria-label="Increase question count"
					>
						+
					</button>
				</div>
			{:else}
				<span class="text-muted shrink-0 text-xs tabular-nums">{total} questions</span>
			{/if}
			<div class="flex items-center gap-1">
				{#if onEditClick}
					<button
						type="button"
						onclick={(e) => {
							e.stopPropagation();
							onEditClick(set);
						}}
						class="hover-sfx click-sfx border-fancy interactive flex h-6 w-6 shrink-0 items-center justify-center text-xs"
						aria-label="Edit set"
					>
						✎
					</button>
				{/if}
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
			</div>
		</div>
	{:else}
		<span class="text-md flex-1 truncate tracking-wider uppercase">{set.name}</span>
		{#if showAdjuster}
			<div class="flex shrink-0 items-center gap-1.5">
				<button
					type="button"
					onclick={(e) => {
						e.stopPropagation();
						adjust(-5);
					}}
					disabled={count <= minCount}
					class="hover-sfx click-sfx border-fancy interactive flex h-5 w-5 shrink-0 items-center justify-center text-xs disabled:opacity-40"
					aria-label="Decrease question count"
				>
					−
				</button>
				<span class="w-6 text-center text-xs tabular-nums">{count}</span>
				<button
					type="button"
					onclick={(e) => {
						e.stopPropagation();
						adjust(5);
					}}
					disabled={count >= maxCount}
					class="hover-sfx click-sfx border-fancy interactive flex h-5 w-5 shrink-0 items-center justify-center text-xs disabled:opacity-40"
					aria-label="Increase question count"
				>
					+
				</button>
			</div>
		{:else}
			<span class="text-muted shrink-0 text-xs tabular-nums">{total} questions</span>
		{/if}
		<button
			type="button"
			onclick={(e) => {
				e.stopPropagation();
				handleDownload();
			}}
			class="hover-sfx click-sfx border-fancy interactive flex h-6 w-6 shrink-0 items-center justify-center text-xs"
			aria-label="Download set as CSV"
		>
			↓
		</button>
	{/if}
</div>
