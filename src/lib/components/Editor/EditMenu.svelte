<script lang="ts">
	import type { Sentence } from '$lib/helpers/sentence';
	import { osuDeath, flyRotate } from '$lib/helpers/transitions';
	import { cubicOut, sineIn } from 'svelte/easing';
	import { saveCustomSet, jsonToCsv, type customSet } from '$lib/helpers/saving';

	import PlaceholderRow from './PlaceholderRow.svelte';
	import InputRow from './InputRow.svelte';

	let {
		onclose,
		set
	}: { onclose: () => void; set?: customSet } = $props();

	// svelte-ignore state_referenced_locally
	let sentences: Sentence[] = $state(set?.sentences ? [...set.sentences] : []);
	// svelte-ignore state_referenced_locally
	let title: string = $state(set?.name ?? 'New Set');

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

    function importSet(name: string) {
        
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

	<div class="flex justify-center gap-3">
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
