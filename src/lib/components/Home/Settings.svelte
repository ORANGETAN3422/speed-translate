<script lang="ts">
	import { keyboards, themes, currentKeyboard, currentTheme } from '$lib/helpers/config';
	import { osuDeath, flyRotate } from '$lib/helpers/transitions';
	import { cubicOut } from 'svelte/easing';

	let { onclose }: { onclose: () => void } = $props();

	let selectedKeyboard = $state(currentKeyboard);
	let selectedTheme = $state(currentTheme);

	function pickTheme(name: string) {
		selectedTheme = name;
		if (typeof document !== 'undefined') {
			document.documentElement.dataset.theme = name === 'light' ? '' : name;
		}
	}
</script>

<div class="flex w-full max-w-md flex-col gap-6">
	<h2
		class="text-center text-3xl tracking-wider uppercase"
		transition:flyRotate|global={{ duration: 600, y: 60, rotate: 25, easing: cubicOut }}
	>
		Settings
	</h2>

	<div
		class="border-fancy bg-fancy flex flex-col gap-3 px-6 py-4"
		transition:osuDeath|global={{ duration: 500, y: 60, rotate: 10, easing: cubicOut, delay: 50 }}
	>
		<p class="text-xs tracking-[0.25em] text-muted uppercase">Theme</p>
		<div class="flex gap-2">
			{#each themes as t (t.themeName)}
				<button
					type="button"
					onclick={() => pickTheme(t.themeName)}
					class="border-fancy interactive flex-1 px-4 py-2 text-sm tracking-wider uppercase"
					class:bg-primary={selectedTheme === t.themeName}
					class:text-bg={selectedTheme === t.themeName}
				>
					{t.displayName}
				</button>
			{/each}
		</div>
	</div>

	<div
		class="border-fancy bg-fancy flex flex-col gap-3 px-6 py-4"
		transition:osuDeath|global={{ duration: 500, y: 60, rotate: 10, easing: cubicOut, delay: 100 }}
	>
		<p class="text-xs tracking-[0.25em] text-muted uppercase">Keyboard Sound</p>
		<div class="flex flex-col gap-2">
			{#each keyboards as kb (kb.fileName)}
				<button
					type="button"
					onclick={() => (selectedKeyboard = kb.fileName)}
					class="border-fancy interactive flex items-center justify-between px-4 py-2 text-sm tracking-wider uppercase"
					class:bg-primary={selectedKeyboard === kb.fileName}
					class:text-bg={selectedKeyboard === kb.fileName}
				>
					<span>{kb.displayName}</span>
					{#if selectedKeyboard === kb.fileName}
						<span class="text-xs opacity-70">selected</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<button
		class="border-fancy bg-fancy shadow-fancy interactive self-center text-sm tracking-wider"
		onclick={onclose}
		transition:osuDeath|global={{ duration: 400, y: 60, rotate: 15, easing: cubicOut, delay: 150 }}
	>
		<p class="p-2">Back</p>
	</button>
</div>
