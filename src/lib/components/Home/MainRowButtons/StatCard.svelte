<script lang="ts">
	import { type record } from '$lib/helpers/saving';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import { osuDeath } from '$lib/helpers/transitions';
	import { cubicOut, cubicIn } from 'svelte/easing';

	let lastRecord = $state<record | null>(null);

	function findLastRecord(): record | null {
		if (!browser) return null;
		const item = window.localStorage.getItem('last_record');
		if (item) {
			try {
				return JSON.parse(item) as record;
			} catch {
				/* ignore */
			}
		}
		return null;
	}

	function formatTime(ms: number) {
		const s = Math.floor(ms / 1000);
		const m = Math.floor(s / 60);
		return `${m}:${(s % 60).toString().padStart(2, '0')}`;
	}

	onMount(() => {
		lastRecord = findLastRecord();
	});
</script>

<div
	class="border-fancy bg-fancy flex min-w-64 flex-col gap-4 px-6 py-4 transition-all duration-500 ease-in-out hover:-translate-y-1 hover:brightness-110"
	in:osuDeath|global={{ duration: 800, y: 100, easing: cubicOut, delay: 150 }}
	out:osuDeath|global={{ duration: 350, y: 50, rotate: 10, easing: cubicIn }}
>
	<p class="text-muted text-xs tracking-[0.25em] uppercase">Last Session</p>

	{#if lastRecord}
		<div class="flex items-baseline gap-3">
			<span class="glow-num text-4xl uppercase">{lastRecord.set}</span>
			<span class="text-muted text-sm">- {lastRecord.words} words</span>
		</div>

		<div class="border-primary/20 grid grid-cols-2 gap-4 border-t pt-3">
			<div>
				<p class="text-muted text-[0.65rem] tracking-widest uppercase">Time</p>
				<p class="glow-num text-2xl tabular-nums">{formatTime(lastRecord.time)}</p>
			</div>
			<div>
				<p class="text-muted text-[0.65rem] tracking-widest uppercase">Correct</p>
				<p class="text-2xl tabular-nums">
					<span class="glow-num">{lastRecord.score}</span><span class="text-muted text-base"
						>/{lastRecord.words}</span
					>
				</p>
			</div>
		</div>
	{:else}
		<p class="text-muted text-sm italic">No sessions yet</p>
	{/if}
</div>
