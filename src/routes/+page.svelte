<script lang="ts">
	import QuizSession from '$lib/components/Quiz/QuizSession.svelte';
	import JlptCard from '$lib/components/Home/JlptCard.svelte';
	import { osuDeath, flyRotate } from '$lib/helpers/transitions';
	import { onMount } from 'svelte';
	import { sineOut } from 'svelte/easing';

	let active = $state(false);
	let currentLevel = $state(0);
	let currentGoal = $state(10);
	let mounted = $state(false);
	let showingCreation = $state(false);

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
	{#if mounted && !active && !showingCreation}
		<div class="absolute inset-0 flex flex-col items-center justify-center gap-12">
			<h1
				class="pb-4 text-center text-6xl tracking-wider uppercase"
				transition:osuDeath|global={{ duration: 700, y: 100, delay: 25, easing: sineOut }}
			>
				Speed Translate
			</h1>
			<button
				class="h-50 w-50 rounded-full bg-primary"
				transition:osuDeath|global={{ duration: 700, y: 100, easing: sineOut }}
				onclick={() => startCreation()}>Start</button
			>
		</div>
	{/if}

	{#if mounted && !active && showingCreation}
		<div class="absolute inset-0 flex flex-col items-center justify-center gap-12">
			<h2
				class="text-center text-3xl tracking-wider uppercase"
				transition:flyRotate|global={{ duration: 500, y: 60, rotate: 25, easing: sineOut }}
			>
				Select Level
			</h2>
			<div class="flex w-full max-w-md flex-col gap-3">
				{#each things as n, i (n)}
					<div
						transition:osuDeath|global={{ duration: 500, y: 80, delay: i * 40, easing: sineOut }}
					>
						<JlptCard level={n} onclick={(count) => createSession(n, count)} />
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

{#if active}
	<div class="overlay">
		<QuizSession level={currentLevel} goal={currentGoal} onclose={() => (active = false)} />
	</div>
{/if}
