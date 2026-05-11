<script lang="ts">
	import { type Sentence } from '$lib/helpers/sentence';

	let {
		answeredSentences,
		englishAnswers,
		time
	}: { answeredSentences: Sentence[]; englishAnswers: string[]; time: number } = $props();
	let marks = $state<(boolean | null)[]>(answeredSentences.map(() => null));

	function mark(i: number, value: boolean) {
		if (marks[i] !== null) return;
		marks[i] = value;
	}

	function formatTime(ms: number) {
		const totalSeconds = Math.floor(ms / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}
</script>

<p class="tabular-nums">{formatTime(time)}</p>

<div class="flex w-full max-w-3xl flex-col gap-2">
	{#each answeredSentences as sentence, i (sentence.jp)}
		<div class="flex items-center gap-4 rounded border px-4 py-2">
			<div class="flex flex-1 flex-col">
				<p class="jp text-sm text-muted">{sentence.jp}</p>
				<p>{sentence.en}</p>
				<p class="text-sm text-muted">
					{englishAnswers[i] === '' ? 'No answer' : englishAnswers[i]}
				</p>
			</div>

			<div class="flex shrink-0 gap-2">
				<button
					type="button"
					onclick={() => mark(i, true)}
					disabled={marks[i] !== null}
					class="rounded border px-3 py-1 disabled:opacity-40"
					class:bg-success={marks[i] === true}
					class:text-bg={marks[i] === true}
				>
					✓
				</button>
				<button
					type="button"
					onclick={() => mark(i, false)}
					disabled={marks[i] !== null}
					class="rounded border px-3 py-1 disabled:opacity-40"
					class:bg-error={marks[i] === false}
					class:text-bg={marks[i] === false}
				>
					✗
				</button>
			</div>
		</div>
	{/each}
</div>
