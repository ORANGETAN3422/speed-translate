<script lang="ts">
	import { onMount } from 'svelte';
	import { type Sentence } from '$lib/helpers/sentence';
	import { flyRotate, osuDeath } from '$lib/helpers/transitions';
	import { setRecord, compareRecord } from '$lib/helpers/saving';
	import SummaryCard from './SummaryCard.svelte';

	let {
		answeredSentences,
		englishAnswers,
		time,
		set,
		closing = false,
		onclosed
	}: {
		answeredSentences: Sentence[];
		englishAnswers: string[];
		time: number;
		set: string;
		closing?: boolean;
		onclosed?: () => void;
	} = $props();

	// svelte-ignore state_referenced_locally
	let marks = $state<(boolean | null)[]>(answeredSentences.map(() => null));

	let mounted = $state(false);
	let containerEl = $state<HTMLDivElement>();
	let timeEl = $state<HTMLDivElement>();
	let lockedHeight = $state<number | null>(null);
	let lockedTimeHeight = $state<number | null>(null);
	let slotEls = $state<(HTMLDivElement | undefined)[]>([]);
	let lockedSlotHeights = $state<number[]>([]);
	let allOutroed = $state(false);

	const CARD_STAGGER = 25;
	const CARD_DURATION = 1000;

	$effect.pre(() => {
		if (closing && containerEl && lockedHeight === null) {
			lockedHeight = containerEl.offsetHeight;
			lockedTimeHeight = timeEl?.offsetHeight ?? 0;
			lockedSlotHeights = slotEls.map((el) => el?.offsetHeight ?? 0);
			saveSession();
		}
	});

	function saveSession() {
		const score = marks.filter((m) => m === true).length;
		const record = {
			set,
			time,
			words: answeredSentences.length,
			score
		};

		// Always save as last session
		setRecord(record, true);

		// Only save as a personal best if at least 5 correct AND faster than existing
		if (score >= 5 && compareRecord(record)) {
			setRecord(record, false);
		}
	}

	$effect(() => {
		if (closing && !allOutroed) {
			const totalMs = (answeredSentences.length - 1) * CARD_STAGGER + CARD_DURATION;
			const id = setTimeout(() => {
				allOutroed = true;
				onclosed?.();
			}, totalMs);
			return () => clearTimeout(id);
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

<div bind:this={timeEl} style:min-height={lockedTimeHeight ? `${lockedTimeHeight}px` : undefined}>
	{#if !closing}
		<p out:osuDeath|global={{ duration: 1000, y: 250 }} class="glow-num text-3xl">
			{formatTime(time)}
			|
			{answeredSentences.length} Words
		</p>
	{/if}
</div>

<div
	bind:this={containerEl}
	class="relative w-full max-w-3xl"
	style:height={lockedHeight !== null ? `${lockedHeight}px` : undefined}
>
	<div class="flex flex-col gap-2">
		{#if mounted && !allOutroed}
			{#each answeredSentences as sentence, i (i)}
				<div
					bind:this={slotEls[i]}
					style:min-height={lockedSlotHeights[i] ? `${lockedSlotHeights[i]}px` : undefined}
				>
					{#if !closing}
						<div
							in:flyRotate|global={{ duration: 700, y: 150, rotate: 15, delay: i * CARD_STAGGER }}
							out:osuDeath|global={{ duration: CARD_DURATION, y: 250, delay: i * CARD_STAGGER }}
							class="group/card border-fancy bg-fancy flex items-center gap-6 px-5 py-3 transition-all duration-300 hover:translate-x-3"
						>
							<SummaryCard
								{sentence}
								answer={englishAnswers[i]}
								mark={marks[i]}
								onmark={(value) => mark(i, value)}
							/>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</div>
