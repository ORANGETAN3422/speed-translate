<script lang="ts">
	import { osuDeath } from '$lib/helpers/transitions';
	import { cubicOut, sineIn } from 'svelte/easing';
	import { flyRotate } from '$lib/helpers/transitions';
	import {
		csvToJson,
		tsvToJson,
		saveCustomSet,
		getCustomSets,
		type customSet
	} from '$lib/helpers/saving';
	import type { Sentence } from '$lib/helpers/sentence';
	import ImportedSetCard from './ImportedSetCard.svelte';
	import { onMount } from 'svelte';

	let {
		onclose,
		onstart
	}: {
		onclose: () => void;
		onstart: (set: customSet) => void;
	} = $props();

	let fileInput = $state<HTMLInputElement>();
	let selectedFile = $state<File | null>(null);
	let parsed = $state<Sentence[] | null>(null);
	let wordCount = $state(10);
	let savedSets = $state<customSet[]>([]);

	onMount(() => {
		savedSets = getCustomSets() ?? [];
	});

	const MIN = 5;
	const MAX = 20;

	function adjust(delta: number) {
		wordCount = Math.max(MIN, Math.min(MAX, wordCount + delta));
	}

	function pickFile() {
		fileInput?.click();
	}

	async function handleFile(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;
		selectedFile = file;

		const ext = file.name.split('.').pop()?.toLowerCase();
		const text = await file.text();
		parsed = ext === 'csv' ? csvToJson(text) : tsvToJson(text);

		if (parsed) wordCount = Math.min(Math.max(wordCount, MIN), parsed.length);
	}

	function start() {
		if (!parsed || parsed.length === 0 || !selectedFile) return;
		const name = selectedFile.name.replace(/\.(csv|tsv)$/i, '');
		const set = {
			name,
			count: wordCount.toString(),
			sentences: parsed
		} as customSet;
		
		const saved = saveCustomSet(set);
		savedSets = getCustomSets() ?? [];
		onstart(saved);
	}
</script>
<!-- todo -->
<!-- export button on browser saves -->
<!-- rename saves -->


<div class="flex w-full max-w-3xl flex-col gap-6">
	<h2
		class="text-center text-3xl tracking-wider uppercase"
		in:flyRotate|global={{ duration: 600, y: 60, rotate: 25, easing: cubicOut }}
		out:flyRotate|global={{ duration: 500, y: 50, rotate: 15, delay: 15, easing: sineIn }}
	>
		Import
	</h2>

	<div class="grid grid-cols-1 items-start gap-6 md:grid-cols-[18rem_28rem] md:justify-center">

	{#if savedSets.length > 0}
		<div
			class="border-fancy bg-fancy flex flex-col gap-3 px-6 py-4"
			in:osuDeath|global={{ duration: 500, y: 60, rotate: 10, easing: cubicOut, delay: 130 }}
			out:osuDeath|global={{ duration: 350, y: 50, rotate: 10, delay: 75, easing: sineIn }}
		>
			<p class="text-muted text-xs tracking-[0.25em] uppercase">Saved Sets</p>
			<div class="flex flex-col gap-2">
				{#each savedSets as set (set.name)}
					<ImportedSetCard {set} onclick={(s) => onstart(s)} />
				{/each}
			</div>
		</div>
	{/if}

	<!-- file picker -->
	<div
		class="border-fancy bg-fancy flex flex-col gap-3 px-6 py-4"
		in:osuDeath|global={{ duration: 500, y: 60, rotate: 10, easing: cubicOut, delay: 70 }}
		out:osuDeath|global={{ duration: 350, y: 50, rotate: 10, delay: 50, easing: sineIn }}
	>
		<p class="text-muted text-xs tracking-[0.25em] uppercase">From File</p>

		<input
			bind:this={fileInput}
			type="file"
			accept=".csv,.tsv,text/csv,text/tab-separated-values"
			onchange={handleFile}
			class="hidden"
		/>

		<button
			type="button"
			onclick={pickFile}
			class="hover-sfx click-sfx border-fancy shadow-fancy interactive px-4 py-2 text-sm tracking-wider uppercase"
		>
			Choose CSV or TSV
		</button>

		{#if parsed}
			<div class="flex items-center justify-between gap-3">
				<p class="text-muted text-xs tracking-[0.25em] uppercase">Words</p>
				<div class="flex items-center gap-3">
					<button
						type="button"
						onclick={() => adjust(-5)}
						disabled={wordCount <= MIN}
						class="hover-sfx click-sfx border-fancy shadow-fancy interactive flex h-8 w-8 items-center justify-center text-lg disabled:opacity-40"
					>
						−c
					</button>
					<span class="glow-num w-12 text-center text-2xl tabular-nums">
						{wordCount}
					</span>
					<button
						type="button"
						onclick={() => adjust(5)}
						disabled={wordCount >= MAX}
						class="hover-sfx click-sfx border-fancy shadow-fancy interactive flex h-8 w-8 items-center justify-center text-lg disabled:opacity-40"
					>
						+
					</button>
				</div>
			</div>
		{/if}

		<button
			type="button"
			onclick={start}
			disabled={!parsed || parsed.length === 0}
			class="hover-sfx click-sfx border-fancy shadow-fancy interactive px-4 py-2 text-sm tracking-wider uppercase disabled:opacity-40"
		>
			Start
		</button>

		{#if selectedFile}
			<p class="text-muted truncate text-xs">{selectedFile.name}</p>
		{/if}
	</div>

	</div>

	<button
		class="hover-sfx click-sfx border-fancy bg-fancy interactive self-center text-sm tracking-wider"
		onclick={onclose}
		in:osuDeath|global={{ duration: 400, y: 60, rotate: 15, easing: cubicOut, delay: 150 }}
		out:osuDeath|global={{ duration: 350, y: 50, rotate: 10, delay: 50, easing: sineIn }}
	>
		<p class="p-2">Back</p>
	</button>
</div>