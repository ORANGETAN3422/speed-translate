<script lang="ts">
	import { onMount } from 'svelte';
	import { loadSentence, type Sentence } from '$lib/sentence';

	import Summary from './Summary.svelte';
	//import ShaderBackground from '../Graphics/ShaderBackground.svelte';

	const soundModules = import.meta.glob('../nk-cream/*.wav', {
		eager: true,
		query: '?url',
		import: 'default'
	}) as Record<string, string>;

	const soundMap: Record<string, string> = {};
	for (const [path, url] of Object.entries(soundModules)) {
		const name = path.split('/').pop()!.replace('.wav', '').toLowerCase();
		soundMap[name] = url;
	}

	const keyAliases: Record<string, string> = {
		backspace: 'backspace',
		delete: 'backspace',
		enter: 'enter',
		' ': 'space',
		tab: 'tab',
		shift: 'shift'
	};

	function playKeySound(e: KeyboardEvent) {
		if (!inputFocused) return;

		const key = e.key.toLowerCase();
		const name = keyAliases[key] ?? key;
		const url = soundMap[name];
		if (!url) return;
		new Audio(url).play().catch(() => {});
	}

	let { level, onclose }: { level: number; onclose: () => void } = $props();

	// add a settings creation thing later for this
	// reveal answer functonailty support later
	const REVEAL_ANSWER = false;
	const GOAL = 10;

	let originalSentences: Sentence[] = $state<Sentence[]>([]);
	let currentSentence = $state<Sentence | undefined>(undefined);
	let answer = $state('');
	let revealed = $state(false);

	let inputEl = $state<HTMLInputElement | undefined>();
	let inputFocused = $state(false);

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

	onMount(async () => {
		originalSentences = await loadSentence(level);
		unansweredSentences = [...originalSentences];
		startTime = Date.now();
		nextSentence();
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
		if (progress >= GOAL || unansweredSentences.length === 0) {
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
</script>

<div class="fixed inset-0 isolate flex flex-col text-text bg-bg">
	<!-- <ShaderBackground /> -->
	<header class="p-4">
		<button onclick={onclose}>Back</button>
	</header>

	{#if finished}
		<main class="flex flex-1 flex-col items-center gap-6 overflow-y-auto px-4 py-8">
			<Summary {answeredSentences} {englishAnswers} time={elapsedMs} />

			<button class="rounded border px-4 py-2" onclick={onclose}> Return to menu </button>
		</main>
	{:else}
		<main class="flex flex-1 flex-col items-center justify-center gap-6 px-4">
			<div
				class="flex flex-col items-center gap-6 bg-bg/50 p-15"
				style="
					mask-image:
						linear-gradient(to right, transparent, black 15%, black 85%, transparent),
						linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
					mask-composite: intersect;
					-webkit-mask-image:
						linear-gradient(to right, transparent, black 15%, black 85%, transparent),
						linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
					-webkit-mask-composite: source-in;
				"
			>
				<div class="flex w-full max-w-md items-center gap-3">
					<div class="h-2 flex-1 overflow-hidden rounded-full bg-surface">
						<div
							class="h-full bg-primary transition-all"
							style="width: {(progress / GOAL) * 100}%"
						></div>
					</div>
					<span class="text-sm text-muted tabular-nums">{progress} / {GOAL}</span>
				</div>

				<div class="text-center">
					<p class="jp text-2xl">{currentSentence?.jp}</p>
					{#if revealed}
						<p class="mt-2 text-muted">{currentSentence?.en}</p>
					{/if}
				</div>

				{#if revealed}
					<!-- svelte-ignore a11y_autofocus -->
					<button class="rounded border px-4 py-2" onclick={nextSentence} autofocus> Next </button>
				{:else}
					<form
						onsubmit={(e) => {
							e.preventDefault();
							submitAnswer();
						}}
					>
						<input
							bind:this={inputEl}
							type="text"
							bind:value={answer}
							placeholder="Your Answer"
							class="border-b-2 border-primary px-3 py-2 outline-none"
							onfocus={() => {
								inputFocused = true;
							}}
							onblur={() => {
								inputFocused = false;
							}}
						/>
					</form>
				{/if}
			</div>
		</main>
	{/if}
</div>
