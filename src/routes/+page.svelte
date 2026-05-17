<script lang="ts">
	import QuizSession from '$lib/components/Quiz/QuizSession.svelte';
	import JlptCard from '$lib/components/Home/JlptCard.svelte';
	import StatCard from '$lib/components/Home/StatCard.svelte';
	import ImportButton from '$lib/components/Home/ImportButton.svelte';
	import StartButton from '$lib/components/Home/StartButton.svelte';
	import SettingsButton from '$lib/components/Home/SettingsButton.svelte';
	import Settings from '$lib/components/Home/Settings.svelte';

	import { osuDeath, flyRotate } from '$lib/helpers/transitions';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut, sineIn } from 'svelte/easing';

	let active = $state(false);
	let closing = $state(false);
	let currentLevel = $state(0);
	let currentGoal = $state(10);
	let mounted = $state(false);
	let showingCreation = $state(false);
	let showingSettings = $state(false);

	const things = [5, 4, 3, 2, 1];

	function startCreation() {
		showingCreation = true;
	}

	function createSession(jlpt: number, goal: number) {
		console.log('create session', { jlpt, goal });
		showingCreation = false;
		active = true;
		currentLevel = jlpt;
		currentGoal = goal;
	}

	function closeSession() {
		closing = true;
		active = false; // triggers QuizSession's out:fade (300ms)
		// Hold the menu off until the outro finishes
		setTimeout(() => (closing = false), 300);
	}

	onMount(() => {
		mounted = true;
	});
</script>

<!-- <div class="flex flex-col gap-2">
	{#each things as n (n)}
		<button onclick={() => createSession(n)}>{n}</button>
	{/each}
</div> -->

<div class="fixed inset-0">
	{#if mounted && !active && !closing && !showingCreation && !showingSettings}
		<div class="absolute inset-0 flex flex-col items-center justify-center gap-12">
			<h1
				class="pb-4 text-center text-6xl tracking-wider uppercase"
				in:osuDeath|global={{ duration: 700, y: 100, delay: 50, easing: cubicOut }}
				out:fly|global={{ duration: 350, y: -50, easing: sineIn }}
			>
				Temporary Name
			</h1>
			<div class="relative">
				<div class="absolute top-1/2 right-full mr-14 -translate-y-1/2">
					<StatCard />
				</div>
				<StartButton onclick={startCreation} />
				<div class="absolute top-1/2 left-full ml-14 -translate-y-1/2">
					<ImportButton />
				</div>
				<div class="absolute top-full left-1/2 mt-18 -translate-x-1/2">
					<SettingsButton onclick={() => (showingSettings = true)} />
				</div>
			</div>
		</div>
	{/if}

	{#if mounted && !active && !closing && showingCreation}
		<div class="absolute inset-0 flex flex-col items-center justify-center gap-12">
			<h2
				class="text-center text-3xl tracking-wider uppercase"
				transition:flyRotate|global={{ duration: 600, y: 60, rotate: 25, easing: cubicOut }}
			>
				Select Level
			</h2>
			<div class="flex w-full max-w-md flex-col gap-3">
				{#each things as n, i (n)}
					<div
						transition:osuDeath|global={{
							duration: 400,
							y: 60,
							delay: i * 40,
							rotate: 15,
							easing: cubicOut
						}}
					>
						<JlptCard level={n} onclick={(count) => createSession(n, count)} />
					</div>
				{/each}
			</div>
			<button
				class="border-fancy bg-fancy shadow-fancy interactive text-sm tracking-wider"
				onclick={() => (showingCreation = false)}
				transition:osuDeath|global={{
					duration: 400,
					y: 60,
					rotate: 15,
					easing: cubicOut
				}}
			>
				<p class="p-2 text-white">Back</p>
			</button>
		</div>
	{/if}

	{#if mounted && !active && !closing && showingSettings}
		<div class="absolute inset-0 flex flex-col items-center justify-center gap-12">
			<Settings onclose={() => (showingSettings = false)} />
		</div>
	{/if}
</div>

{#if active}
	<div class="overlay">
		<QuizSession level={currentLevel} goal={currentGoal} onclose={closeSession} />
	</div>
{/if}
