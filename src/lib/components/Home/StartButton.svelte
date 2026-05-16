<script lang="ts">
	import { osuDeath } from '$lib/helpers/transitions';
	import { sineIn, cubicOut } from 'svelte/easing';

    let { onclick }: { onclick: () => void;} =$props();
</script>

<button
	class="bg-fancy border-fancy flex h-55 w-55 items-center justify-center bg-primary transition-all duration-300 hover:brightness-125 hover:scale-105 hover:translate-y-[-2px]"
	style:--bc="color-mix(in oklch, var(--primary), black 20%)"
	in:osuDeath|global={{ duration: 800, y: 100, easing: cubicOut }}
	out:osuDeath|global={{ duration: 350, y: 50, rotate: 10, easing: sineIn }}
    onclick={onclick}
>
	<div
		class="bg-fancy flex h-50 w-50 items-center justify-center bg-primary"
		style:--bc="color-mix(in oklch, var(--primary), black 5%)"
	>
		<div
			style:--bc="var(--primary)"
			class="bg-fancy border-fancy flex h-50 w-50 rotate-45 items-center justify-center bg-primary"
		>
			<div
				style:--bc="color-mix(in oklch, var(--primary), black 20%)"
				class="bg-fancy flex h-40 w-40 items-center justify-center bg-primary"
			>
				<div
					style:--bc="color-mix(in oklch, var(--primary), black 10%)"
					class="bg-fancy flex h-30 w-30 items-center justify-center bg-primary"
				>
					<p class="glow-num -rotate-45 text-4xl select-none">START</p>
				</div>
			</div>
		</div>
	</div>
</button>
