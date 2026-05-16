<script lang="ts">
	import { onMount } from 'svelte';
	import { type Sentence } from '$lib/helpers/sentence';
	import { flyRotate, osuDeath } from '$lib/helpers/transitions';
	import SummaryCard from './SummaryCard.svelte';

	let {
		answeredSentences,
		englishAnswers,
		time,
		closing = false,
		onclosed
	}: {
		answeredSentences: Sentence[];
		englishAnswers: string[];
		time: number;
		closing?: boolean;
		onclosed?: () => void;
	} = $props();

	// svelte-ignore state_referenced_locally
	let marks = $state<(boolean | null)[]>(answeredSentences.map(() => null));

	let mounted = $state(false);
	let containerEl = $state<HTMLDivElement>();
	let lockedHeight = $state<number | null>(null);

	$effect.pre(() => {
		if (closing && containerEl && lockedHeight === null) {
			lockedHeight = containerEl.offsetHeight;
		}
	});

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

	onMount(() => {
		setTimeout(() => (mounted = true), 0);
	});
</script>

{#if !closing}
	<p out:osuDeath|global={{ duration: 1000, y: 250 }} class="glow-num text-3xl">
		{formatTime(time)}
		|
		{answeredSentences.length} Words
	</p>
{/if}

<div
	bind:this={containerEl}
	class="relative w-full max-w-3xl"
	style:height={lockedHeight !== null ? `${lockedHeight}px` : undefined}
>
	<div class="flex flex-col gap-2">
		{#if mounted && !closing}
			{#each answeredSentences as sentence, i (sentence.question)}
				<div
					in:flyRotate|global={{ duration: 700, y: 150, rotate: 15, delay: i * 25 }}
					out:osuDeath|global={{ duration: 1000, y: 250, delay: i * 25 }}
					onoutroend={i === answeredSentences.length - 1 ? onclosed : undefined}
					class="group/card border-fancy bg-fancy flex items-center gap-6 px-5 py-3 transition-all duration-300 hover:translate-x-3"
				>
					<SummaryCard
						{sentence}
						answer={englishAnswers[i]}
						mark={marks[i]}
						onmark={(value) => mark(i, value)}
					/>
				</div>
			{/each}
		{/if}
	</div>
</div>
