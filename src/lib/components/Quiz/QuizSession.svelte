<script lang="ts">
	import { onMount } from 'svelte';
	import { loadSentence, type Sentence } from '$lib/helpers/sentence';
	import { getKeyboardSoundUrl, playSound, preloadKeyboard } from '../../helpers/sound';
	import { flyRotate } from '$lib/helpers/transitions';
	import { cubicIn } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	import Summary from './Summary.svelte';
	//import ShaderBackground from '../Graphics/ShaderBackground.svelte';

	// add a settings creation thing later for this
	// add reveal answer support
	const REVEAL_ANSWER = false;
	const KEYBOARD = 'nk-cream';

	// session vars
	let {
		level,
		goal = 10,
		onclose
	}: { level: number; goal?: number; onclose: () => void } = $props();

	let mounted = $state(false);
	let leaving = $state(false);

	let originalSentences: Sentence[] = $state<Sentence[]>([]);
	let currentSentence = $state<Sentence | undefined>(undefined);
	let answer = $state('');
	let revealed = $state(false);

	let inputEl = $state<HTMLInputElement | undefined>();
	let inputFocused = $state(false);

	function playKeySound(e: KeyboardEvent) {
		if (!inputFocused) return;
		const url = getKeyboardSoundUrl(KEYBOARD, e.code);
		if (url) playSound(url);
	}

	$effect(() => {
		if (!revealed) inputEl?.focus();
	});

	let unansweredSentences = $state<Sentence[]>([]);
	let answeredSentences = $state<Sentence[]>([]);
	let englishAnswers = $state<string[]>([]);
	let progress = $state(0);
	let finished = $state(false);
	let startTime = 0;
	let elapsedMs = $state(0);
	let liveMs = $state(0);

	const liveTime = $derived(formatLiveTime(liveMs));

	function formatLiveTime(ms: number) {
		const totalSeconds = Math.floor(ms / 1000);
		//const minutes = Math.floor(totalSeconds / 60);
		//const seconds = totalSeconds % 60;
		return `${totalSeconds}`;
	}

	onMount(async () => {
		preloadKeyboard(KEYBOARD);
		originalSentences = await loadSentence(level);
		unansweredSentences = [...originalSentences];
		startTime = Date.now();
		nextSentence();

		mounted = true;
	});

	$effect(() => {
		if (finished) return;
		const id = setInterval(() => {
			liveMs = Date.now() - startTime;
		}, 250);
		return () => clearInterval(id);
	});

	$effect(() => {
		window.addEventListener('keydown', playKeySound);
		return () => window.removeEventListener('keydown', playKeySound);
	});

	function submitAnswer() {
		if (!currentSentence || revealed) return;

		answeredSentences.push(currentSentence);
		englishAnswers.push(answer);
		unansweredSentences = unansweredSentences.filter((s) => s !== currentSentence);

		if (REVEAL_ANSWER) {
			revealed = true;
		} else {
			nextSentence();
		}
	}

	function nextSentence() {
		if (progress >= goal || unansweredSentences.length === 0) {
			elapsedMs = Date.now() - startTime;
			finished = true;
			return;
		}

		let sentenceIndex = Math.floor(Math.random() * unansweredSentences.length);
		currentSentence = unansweredSentences[sentenceIndex];
		progress++;
		answer = '';
		revealed = false;
	}

	function retry() {
		unansweredSentences = [...originalSentences];
		answeredSentences = [];
		englishAnswers = [];
		progress = 0;
		finished = false;
		startTime = Date.now();
		nextSentence();
	}
</script>

<div
	class="bg-textured fixed inset-0 isolate flex flex-col text-text"
	out:fade|global={{ duration: 300, easing: cubicIn }}
>
	<!-- <ShaderBackground /> dead -->
	<header class="p-4">
		<button class="interactive text-sm tracking-wider text-muted uppercase" onclick={onclose}
			>← Back</button
		>
	</header>

	{#if finished}
		<main class="flex flex-1 flex-col items-center gap-6 overflow-y-auto px-4 py-8">
			<Summary
				{answeredSentences}
				{englishAnswers}
				time={elapsedMs}
				closing={leaving}
				onclosed={onclose}
			/>

			{#if !leaving}
				<button
					class="border-fancy bg-fancy interactive px-4 py-2"
					transition:fade|global={{ duration: 750, easing: cubicIn }}
					onclick={() => (leaving = true)}
				>
					Return to menu
				</button>
				<button
					class="border-fancy bg-fancy interactive px-4 py-2"
					transition:fade|global={{ duration: 750, easing: cubicIn }}
					onclick={retry}
				>
					Retry
				</button>
			{/if}
		</main>
	{:else}
		<main class="flex flex-1 flex-col items-center justify-center gap-8 px-4">
			{#if mounted}
				<!-- progress -->
				<div
					class="flex w-full max-w-md items-center gap-4"
					in:flyRotate={{ duration: 500, y: 100, rotate: 25, delay: 0 }}
				>
					<div class="h-2 flex-1 bg-surface">
						<div
							class="h-full bg-primary transition-all"
							style="width: {(progress / goal) * 100}%"
						></div>
					</div>
					<span class="glow-num text-sm">{liveTime}</span>
				</div>

				<!-- jp sentene -->
				<div class="text-center" in:flyRotate={{ duration: 500, y: 100, rotate: 25, delay: 20 }}>
					<p class="jp text-3xl leading-relaxed">{currentSentence?.question}</p>
					{#if revealed}
						<p class="mt-2 text-muted">{currentSentence?.answer}</p>
					{/if}
				</div>

				<!-- answer input -->
				{#if revealed}
					<!-- svelte-ignore a11y_autofocus -->
					<button
						class="border-fancy bg-fancy interactive px-4 py-2"
						onclick={nextSentence}
						autofocus
					>
						Next
					</button>
				{/if}
				{#if !revealed}
					<form
						in:flyRotate|global={{ duration: 500, y: 100, rotate: 25, delay: 40 }}
						onsubmit={(e) => {
							e.preventDefault();
							submitAnswer();
						}}
					>
						<input
							bind:this={inputEl}
							type="text"
							bind:value={answer}
							placeholder="..."
							class="glow w-72 border-b-2 border-primary bg-transparent px-3 py-2 text-center outline-none"
							onfocus={() => {
								inputFocused = true;
							}}
							onblur={() => {
								inputFocused = false;
							}}
						/>
					</form>
				{/if}
			{/if}
		</main>
	{/if}
</div>
