<script lang="ts">
	import type { Sentence } from '$lib/helpers/sentence';
	import { osuDeath, flyRotate } from '$lib/helpers/transitions';
	import { cubicOut, sineIn } from 'svelte/easing';
	import { saveCustomSet, jsonToCsv, getCustomSets, type customSet } from '$lib/helpers/saving';
	import { onMount } from 'svelte';

	import PlaceholderRow from './PlaceholderRow.svelte';
	import InputRow from './InputRow.svelte';
	import ImportedSetCard from '../Home/ImportSection/ImportedSetCard.svelte';

	let { onclose, set }: { onclose: () => void; set?: customSet } = $props();

	// svelte-ignore state_referenced_locally
	let sentences: Sentence[] = $state(set?.sentences ? [...set.sentences] : []);
	// svelte-ignore state_referenced_locally
	let title: string = $state(set?.name ?? 'New Set');

	let savedSets = $state<customSet[]>([]);

	onMount(() => {
		savedSets = getCustomSets() ?? [];
	});

	function loadSet(s: customSet) {
		title = s.name;
		sentences = [...s.sentences];
	}

	function buildSet(): customSet {
		return {
			name: title,
			count: sentences.length.toString(),
			sentences
		};
	}

	function saveToBrowser() {
		if (sentences.length === 0) return;
		saveCustomSet(buildSet());
	}

	function emptySet() {
		title = 'New Set';
		sentences = [];
	}

	function wipeSet() {
		sentences = [];
	}

	function downloadCsv() {
		if (sentences.length === 0) return;
		const set = buildSet();
		const csv = jsonToCsv(set);
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${set.name}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function addRow() {
		if (
			sentences.length > 0 &&
			sentences[sentences.length - 1].question === '' &&
			sentences[sentences.length - 1].question === ''
		)
			return;
		const placeholder = {
			question: '',
			answer: ''
		} as Sentence;
		sentences.push(placeholder);
	}

	function editQuestion(index: number, question: string) {
		if (!sentences[index]) addRow();
		sentences[index].question = question;
	}

	function editAnswer(index: number, answer: string) {
		if (!sentences[index]) addRow();
		sentences[index].answer = answer;
	}
</script>

<div class="flex w-full max-w-xl flex-col gap-6">
	<h2
		class="text-center text-3xl tracking-wider uppercase"
		in:flyRotate|global={{ duration: 600, y: 60, rotate: 15, easing: cubicOut }}
		out:flyRotate|global={{ duration: 500, y: 50, rotate: 10, delay: 15, easing: sineIn }}
	>
		Question Set Editor
	</h2>

	<div class="relative">
		<!-- hi -->
		<div
			class="border-fancy bg-fancy flex flex-col gap-3 px-6 py-4"
			in:osuDeath|global={{ duration: 500, y: 60, rotate: 10, easing: cubicOut, delay: 70 }}
			out:osuDeath|global={{ duration: 350, y: 50, rotate: 10, delay: 50, easing: sineIn }}
		>
			<input
				type="text"
				value={title}
				oninput={(e) => {
					title = (e.target as HTMLInputElement).value;
				}}
				class="border-primary focus:border-primary w-full border-b border-transparent bg-transparent px-2 py-1 text-center outline-none"
			/>

			<table class="border-fancy w-full text-left text-sm tabular-nums">
				<thead>
					<tr class="border-primary/30 border-b">
						<th class="text-text px-3 py-2 text-xs tracking-[0.25em] uppercase">Question</th>
						<th class="text-text px-3 py-2 text-xs tracking-[0.25em] uppercase">Answer</th>
					</tr>
				</thead>
				<tbody class="text-muted">
					{#each sentences as s, i (i)}
						<tr>
							<InputRow
								text={s.question}
								sendData={(v) => {
									editQuestion(i, v);
								}}
							/>
							<InputRow
								text={s.answer}
								sendData={(v) => {
									editAnswer(i, v);
								}}
							/>
						</tr>
					{/each}
					<PlaceholderRow onclick={addRow} />
					<!-- <td class="px-3 py-2">+</td> -->
				</tbody>
			</table>
		</div>

		{#if savedSets.length > 0}
			<div
				class="border-fancy bg-fancy absolute top-0 right-full mr-6 flex w-64 flex-col gap-3 px-4 py-3"
				in:osuDeath|global={{ duration: 500, y: 60, rotate: 10, easing: cubicOut, delay: 100 }}
				out:osuDeath|global={{ duration: 350, y: 50, rotate: 10, delay: 50, easing: sineIn }}
			>
				<div class="flex flex-col gap-2">
					<button
						class="hover-sfx click-sfx border-fancy bg-fancy interactive px-3 py-1.5 text-xs tracking-wider uppercase"
						onclick={emptySet}
					>
						Empty Set
					</button>
					<button
						class="hover-sfx click-sfx border-fancy bg-fancy interactive px-3 py-1.5 text-xs tracking-wider uppercase disabled:opacity-40"
						onclick={wipeSet}
						disabled={sentences.length < 1}
					>
						Wipe Set
					</button>
				</div>

				<p class="text-muted text-xs tracking-[0.25em] uppercase">Load Saved Set</p>
				<div class="flex flex-col gap-2">
					{#each savedSets as s, i (s.name ?? i)}
						<ImportedSetCard
							set={s}
							onclick={loadSet}
							onDeleteClick={() => (savedSets = getCustomSets() ?? [])}
							canDelete={false}
							nameOnly={true}
						/>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<div class="flex flex-wrap justify-center gap-3">
		<button
			in:osuDeath|global={{ duration: 400, y: 60, rotate: 15, easing: cubicOut, delay: 120 }}
			out:osuDeath|global={{ duration: 350, y: 50, rotate: 10, delay: 50, easing: sineIn }}
			class="hover-sfx click-sfx border-fancy bg-fancy interactive text-sm tracking-wider disabled:opacity-40"
			onclick={saveToBrowser}
			disabled={sentences.length < 1}
		>
			<p class="p-2">Save to Browser</p>
		</button>
		<button
			in:osuDeath|global={{ duration: 400, y: 60, rotate: 15, easing: cubicOut, delay: 120 }}
			out:osuDeath|global={{ duration: 350, y: 50, rotate: 10, delay: 50, easing: sineIn }}
			class="hover-sfx click-sfx border-fancy bg-fancy interactive text-sm tracking-wider disabled:opacity-40"
			onclick={downloadCsv}
			disabled={sentences.length < 1}
		>
			<p class="p-2">Download CSV</p>
		</button>
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
