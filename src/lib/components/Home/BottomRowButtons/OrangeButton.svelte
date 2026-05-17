<script lang="ts">
	import { osuDeath } from '$lib/helpers/transitions';
	import { cubicOut, cubicIn } from 'svelte/easing';

	import cubePng from '$lib/assets/cube_bw.png';
</script>

<div
	class="h-15 w-15 mt-2.5"
	in:osuDeath|global={{ duration: 600, y: 60, easing: cubicOut, delay: 350 }}
	out:osuDeath|global={{ duration: 300, y: 30, rotate: 10, easing: cubicIn }}
>
	<button
		type="button"
        onclick={() => window.open('https://orangetan3422.github.io/projects', '_blank')}
		class="hover-sfx click-sfx border-fancy bg-fancy flex h-15 w-15 rotate-45 items-center justify-center px-4 py-2 text-xs tracking-[0.25em] uppercase transition-all duration-500 ease-in-out hover:-translate-y-1 hover:brightness-110"
	>
		<div
			class="bg-fancy bg-primary flex min-h-10 min-w-10 items-center justify-center"
			style:--bc="color-mix(in oklch, var(--primary), black 5%)"
		>
			<img src={cubePng} alt="Cube" class="icon h-8 w-8 rotate-45" />
		</div>
	</button>
</div>
