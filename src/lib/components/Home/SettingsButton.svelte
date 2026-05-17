<script lang="ts">
	import { osuDeath } from '$lib/helpers/transitions';
	import { cubicOut, cubicIn } from 'svelte/easing';

	import settingsPng from '$lib/assets/settings.png';

	let { onclick }: { onclick?: () => void } = $props();
</script>

<div
	class="h-20 w-20"
	in:osuDeath|global={{ duration: 600, y: 60, easing: cubicOut, delay: 300 }}
	out:osuDeath|global={{ duration: 300, y: 30, rotate: 10, easing: cubicIn }}
>
	<button
		type="button"
		{onclick}
		class="border-fancy bg-fancy flex h-20 w-20 rotate-45 items-center justify-center px-4 py-2 text-xs tracking-[0.25em] uppercase transition-all duration-500 ease-in-out hover:-translate-y-1 hover:brightness-110"
	>
		<div
			class="bg-fancy bg-primary flex min-h-15 min-w-15 items-center justify-center"
			style:--bc="color-mix(in oklch, var(--primary), black 5%)"
		>
			<img src={settingsPng} alt="Settings" class="icon h-10 w-10 -rotate-45" />
		</div>
	</button>
</div>
