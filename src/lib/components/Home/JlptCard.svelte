<script lang="ts">
	let { level, onclick, bg }: { level: number; onclick: (count: number) => void; bg?: string } =
		$props();

	const levelColors: Record<number, string> = {
		5: '#9F2D8B',
		4: '#2569B2',
		3: '#21992F',
		2: '#E87D1E',
		1: '#C9282D'
	};

	const color = $derived(bg ?? levelColors[level] ?? 'var(--primary)');

	const MIN = 5;
	const MAX = 20;
	let wordCount = $state(10);

	function adjust(delta: number) {
		wordCount = Math.max(MIN, Math.min(MAX, wordCount + delta));
	}
</script>

<div
	style:--bc={color}
	class="border-fancy bg-fancy shadow-fancy flex w-full items-center px-5 py-3 transition-all duration-300 hover:translate-x-3 hover:brightness-110"
>
	<button
		type="button"
		onclick={() => onclick(wordCount)}
		class="flex flex-1 cursor-pointer items-center gap-6 text-left active:brightness-90"
	>
		<span class="glow-num text-4xl">N{level}</span>
	</button>

	<div class="relative isolate -my-3 -mr-5 flex shrink-0 items-center self-stretch py-3 pr-5 pl-10">
		<div
			class="absolute inset-0 -z-10"
			style="background: color-mix(in oklch, var(--bc, var(--primary)), black 52%); clip-path: polygon(40px 0, 100% 0, 100% 100%, 0 100%);"
		></div>

		<p class="pr-3">Words:</p>
		<div class="flex items-center gap-3">
			<button
				type="button"
				onclick={() => adjust(-1)}
				disabled={wordCount <= MIN}
				class="border-fancy shadow-fancy interactive flex h-8 w-8 items-center justify-center text-lg disabled:opacity-40"
			>
				−
			</button>
			<span class="glow-num w-8 text-center text-2xl tabular-nums">{wordCount}</span>
			<button
				type="button"
				onclick={() => adjust(1)}
				disabled={wordCount >= MAX}
				class="border-fancy shadow-fancy interactive flex h-8 w-8 items-center justify-center text-lg disabled:opacity-40"
			>
				+
			</button>
		</div>
	</div>
</div>
