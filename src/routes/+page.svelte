<script lang="ts">
	import QuizSession from '$lib/components/Quiz/QuizSession.svelte';

	import StatCard from '$lib/components/Home/MainRowButtons/StatCard.svelte';
	import ImportButton from '$lib/components/Home/MainRowButtons/ImportButton.svelte';
	import StartButton from '$lib/components/Home/MainRowButtons/StartButton.svelte';

	import SettingsButton from '$lib/components/Home/BottomRowButtons/SettingsButton.svelte';
	import AboutButton from '$lib/components/Home/BottomRowButtons/AboutButton.svelte';
	import GitButton from '$lib/components/Home/BottomRowButtons/GitButton.svelte';
	import OrangeButton from '$lib/components/Home/BottomRowButtons/OrangeButton.svelte';

	import Settings from '$lib/components/Home/SettingsMenu.svelte';
	import AboutMenu from '$lib/components/Home/AboutMenu.svelte';
	import JlptCard from '$lib/components/Home/JlptCard.svelte';
	import ImportMenu from '$lib/components/Home/ImportSection/ImportMenu.svelte';
	import ImportedSetCard from '$lib/components/Home/ImportSection/ImportedSetCard.svelte';
	import EditMenu from '$lib/components/Editor/EditMenu.svelte';

	import { osuDeath, flyRotate } from '$lib/helpers/transitions';
	import { saveConfig } from '$lib/helpers/config.svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut, cubicIn, sineIn } from 'svelte/easing';
	import { getRecentCustomSets, markSetPlayed, type customSet } from '$lib/helpers/saving';

	let active = $state(false);
	let closing = $state(false);
	let currentLevel = $state(0);
	let currentGoal = $state(10);
	let currentSet = $state<customSet | undefined>(undefined);
	let editingSet = $state<customSet | undefined>(undefined);
	let savedSets = $state<customSet[]>([]);
	let mounted = $state(false);

	let showingCreation = $state(false);
	let showingSettings = $state(false);
	let showingAbout = $state(false);
	let showingImport = $state(false);
	let showingEdit = $state(true);

	const things = [5, 4, 3, 2, 1];

	function startCreation() {
		showingCreation = true;
	}

	function createSession(jlpt: number, goal: number, set?: customSet) {
		console.log('create session', { jlpt, goal, set });
		showingCreation = false;
		showingImport = false;
		active = true;
		currentLevel = jlpt;
		currentGoal = goal;
		currentSet = set;
		if (set) markSetPlayed(set.name);
	}

	function closeSession() {
		closing = true;
		active = false; // triggers QuizSession's out:fade (300ms)
		setTimeout(() => {
			closing = false;
			savedSets = getRecentCustomSets(2);
		}, 300);
	}

	onMount(() => {
		mounted = true;
		savedSets = getRecentCustomSets(2);
	});
</script>

<!-- <div class="flex flex-col gap-2">
	{#each things as n (n)}
		<button onclick={() => createSession(n)}>{n}</button>
	{/each}
</div> -->

<div class="fixed inset-0">
	{#if mounted && !active && !closing && !showingCreation && !showingSettings && !showingAbout && !showingImport && !showingEdit}
		<div class="absolute inset-0 flex flex-col items-center justify-center gap-12">
			<h1
				class="pb-4 text-center text-6xl tracking-wider uppercase"
				in:osuDeath|global={{ duration: 700, y: 100, delay: 50, easing: cubicOut }}
				out:fly|global={{ duration: 350, y: -50, easing: sineIn }}
			>
				Temporary Name
			</h1>
			<div class="relative">
				<!-- middle -->
				<div class="absolute top-1/2 right-full mr-14 -translate-y-1/2">
					<StatCard />
				</div>
				<StartButton onclick={startCreation} />
				<div class="absolute top-1/2 left-full ml-14 flex -translate-y-1/2 flex-col gap-3">
					<ImportButton onclick={() => (showingImport = true)} />
					{#each savedSets as set, i (set.name ?? i)}
						<div
							in:osuDeath|global={{
								duration: 700,
								y: 80,
								easing: cubicOut,
								delay: 320 + i * 60
							}}
							out:osuDeath|global={{
								duration: 350,
								y: 50,
								rotate: 10,
								easing: cubicIn,
								delay: i * 30
							}}
						>
							<ImportedSetCard
								{set}
								onclick={(s) => createSession(0, parseInt(s.count), s)}
								onDeleteClick={() => {}}
								canDelete={false}
							/>
						</div>
					{/each}
				</div>
				<!-- bottom -->
				<div class="absolute top-full left-1/2 mt-18 flex -translate-x-1/2 flex-row gap-12">
					<OrangeButton />
					<AboutButton onclick={() => (showingAbout = true)} />
					<SettingsButton onclick={() => (showingSettings = true)} />
					<GitButton />
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
				class="hover-sfx click-sfx border-fancy bg-fancy interactive text-sm tracking-wider"
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
		<div class="absolute inset-0 overflow-y-auto">
			<div class="flex min-h-full flex-col items-center justify-center gap-12 px-4 py-12">
				<Settings
					onclose={() => {
						showingSettings = false;
						saveConfig();
					}}
				/>
			</div>
		</div>
	{/if}

	{#if mounted && !active && !closing && showingAbout}
		<div class="absolute inset-0 overflow-y-auto">
			<div class="flex min-h-full flex-col items-center justify-center gap-12 px-4 py-12">
				<AboutMenu
					onclose={() => {
						showingAbout = false;
					}}
				/>
			</div>
		</div>
	{/if}

	{#if mounted && !active && !closing && showingImport}
		<div class="absolute inset-0 overflow-y-auto">
			<div class="flex min-h-full flex-col items-center justify-center gap-12 px-4 py-12">
				<ImportMenu
					onclose={() => {
						showingImport = false;
						savedSets = getRecentCustomSets(2);
					}}
					onstart={(set) => createSession(0, parseInt(set.count), set)}
					onedit={(set) => {
						editingSet = set;
						showingImport = false;
						showingEdit = true;
					}}
				/>
			</div>
		</div>
	{/if}

	{#if mounted && !active && !closing && showingEdit}
		<div class="absolute inset-0 overflow-y-auto">
			<div class="flex min-h-full flex-col items-center justify-center gap-12 px-4 py-12">
				<EditMenu
					set={editingSet}
					onclose={() => {
						showingEdit = false;
						showingImport = true;
						editingSet = undefined;
					}}
				/>
			</div>
		</div>
	{/if}
</div>

{#if active}
	<div class="overlay">
		<QuizSession level={currentLevel} goal={currentGoal} set={currentSet} onclose={closeSession} />
	</div>
{/if}
