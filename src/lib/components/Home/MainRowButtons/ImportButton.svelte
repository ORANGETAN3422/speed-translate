<script lang="ts">
	import { osuDeath } from '$lib/helpers/transitions';
	import { cubicOut, cubicIn } from 'svelte/easing';

	let { onclick }: { onclick: () => void } = $props();
</script>

<button
	class="hover-sfx click-sfx border-fancy bg-fancy flex min-h-37 min-w-64 items-center justify-center gap-4 px-6 py-4 text-center transition-all duration-500 ease-in-out hover:-translate-y-1 hover:brightness-110"
	in:osuDeath|global={{ duration: 800, y: 100, easing: cubicOut, delay: 250 }}
	out:osuDeath|global={{ duration: 350, y: 50, rotate: 10, easing: cubicIn }}
	{onclick}
>
	<p class="text-2xl tracking-[0.25em] uppercase">Import</p>
</button>
