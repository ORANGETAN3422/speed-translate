<script lang="ts">
	import { keyboards, themes, config, saveConfig } from '$lib/helpers/config.svelte';
	import { playKeyboardSelectSound } from '$lib/helpers/sound';
	import { osuDeath, flyRotate } from '$lib/helpers/transitions';
	import { cubicOut, sineIn } from 'svelte/easing';

	let { onclose }: { onclose: () => void } = $props();

	function pickTheme(name: string) {
		config.currentTheme = name;
		saveConfig();
		if (typeof document !== 'undefined') {
			document.documentElement.dataset.theme = name;
		}
	}

	function pickKeyboard(name: string) {
		config.currentKeyboard = name;
		saveConfig();
		playKeyboardSelectSound(name);
	}
</script>

<div class="flex w-full max-w-md flex-col gap-6">
	<h2
		class="text-center text-3xl tracking-wider uppercase"
		in:flyRotate|global={{ duration: 600, y: 60, rotate: 25, easing: cubicOut }}
		out:flyRotate|global={{ duration: 500, y: 50, rotate: 15, delay: 15, easing: sineIn }}
	>
		Settings
	</h2>

	<!-- theme selection -->
	<div
		class="border-fancy bg-fancy flex flex-col gap-3 px-6 py-4"
		in:osuDeath|global={{ duration: 500, y: 60, rotate: 10, easing: cubicOut, delay: 70 }}
		out:osuDeath|global={{ duration: 350, y: 50, rotate: 10, delay: 50, easing: sineIn }}
	>
		<p class="text-muted text-xs tracking-[0.25em] uppercase">Theme</p>
		<div
			class={`@container grid ${themes.length > 2 ? 'grid-cols-4' : `grid-cols-${themes.length}`} gap-2`}
		>
			{#each themes as t (t.themeName)}
				<button
					type="button"
					onclick={() => pickTheme(t.themeName)}
					class="hover-sfx click-sfx border-fancy shadow-fancy interactive flex-1 px-2 py-2 text-center text-[clamp(0.65rem,3.2cqw,1rem)] leading-tight tracking-wider"
					class:bg-primary={config.currentTheme === t.themeName}
					class:text-bg={config.currentTheme === t.themeName}
				>
					{t.displayName}
				</button>
			{/each}
		</div>
	</div>

	<!-- sound config -->
	<div
		class="border-fancy bg-fancy flex flex-col gap-3 px-6 py-4"
		in:osuDeath|global={{ duration: 500, y: 60, rotate: 10, easing: cubicOut, delay: 140 }}
		out:osuDeath|global={{ duration: 350, y: 50, rotate: 10, delay: 100, easing: sineIn }}
	>
		<div class="flex items-baseline justify-between">
			<p class="text-muted text-xs tracking-[0.25em] uppercase">Menu Sfx Volume</p>
			<span class="glow-num text-sm tabular-nums">
				{Math.round(config.uiVolume * 100)}%
			</span>
		</div>
		<input
			type="range"
			min="0"
			max="1"
			step="0.05"
			bind:value={config.uiVolume}
			oninput={saveConfig}
			class="slider-fancy click-sfx hover-sfx w-full"
			style:--val="{config.uiVolume * 100}%"
		/>
	</div>

	<!-- keyboard selection -->
	<div
		class="border-fancy bg-fancy flex flex-col gap-3 px-6 py-4"
		in:osuDeath|global={{ duration: 500, y: 60, rotate: 10, easing: cubicOut, delay: 140 }}
		out:osuDeath|global={{ duration: 350, y: 50, rotate: 10, delay: 100, easing: sineIn }}
	>
		<!-- volume -->
		<div class="flex items-baseline justify-between">
			<p class="text-muted text-xs tracking-[0.25em] uppercase">Keyboard Volume</p>
			<span class="glow-num text-sm tabular-nums">
				{Math.round(config.keyboardVolume * 100)}%
			</span>
		</div>
		<input
			type="range"
			min="0"
			max="1"
			step="0.05"
			bind:value={config.keyboardVolume}
			oninput={saveConfig}
			class="slider-fancy click-sfx hover-sfx w-full"
			style:--val="{config.keyboardVolume * 100}%"
		/>

		<!-- type -->
		<p class="text-muted text-xs tracking-[0.25em] uppercase">Keyboard Sound</p>
		<div class="flex flex-col gap-2">
			{#each keyboards as kb (kb.fileName)}
				<button
					type="button"
					onclick={() => pickKeyboard(kb.fileName)}
					class="hover-sfx border-fancy shadow-fancy interactive flex items-center justify-between px-4 py-2 text-sm tracking-wider"
					class:bg-primary={config.currentKeyboard === kb.fileName}
					class:text-bg={config.currentKeyboard === kb.fileName}
				>
					<span>{kb.displayName}</span>
					{#if config.currentKeyboard === kb.fileName}
						<span class="text-xs opacity-70">selected</span>
					{/if}
				</button>
			{/each}
		</div>
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
