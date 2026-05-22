<script lang="ts">
	import { osuDeath, flyRotate } from '$lib/helpers/transitions';
	import { cubicOut, sineIn } from 'svelte/easing';

	let { onclose }: { onclose: () => void } = $props();
</script>

<div class="flex w-full max-w-md flex-col gap-6">
	<h2
		class="text-center text-3xl tracking-wider uppercase"
		in:flyRotate|global={{ duration: 600, y: 60, rotate: 25, easing: cubicOut }}
		out:flyRotate|global={{ duration: 500, y: 50, rotate: 15, delay: 15, easing: sineIn }}
	>
		About
	</h2>

	<!-- hi -->
	<div
		class="border-fancy bg-fancy flex flex-col gap-3 px-6 py-4"
		in:osuDeath|global={{ duration: 500, y: 60, rotate: 10, easing: cubicOut, delay: 70 }}
		out:osuDeath|global={{ duration: 350, y: 50, rotate: 10, delay: 50, easing: sineIn }}
	>
		<p class=" text-xs tracking-[0.25em] uppercase">What is This?</p>
		<p class="text-muted text-sm">
			This is a simple quiz app for practicing Japanese language skills (or other things if you
			import them). The goal is to complete a set number of translations in as little time as
			possible, with as much accuracy as possible. Developed with the intention of making it a bit
			more fun to practice.
		</p>

		<p class=" text-xs tracking-[0.25em] uppercase">How To Use This Site</p>
		<p class="text-muted text-sm">
			Pressing play in the middle will open the default selection menu of sentences by JLPT level.
			You can change how many words you have to complete on this menu as well. From here, it's
			simply just translating as fast as you can. When you finish translating all sentences, you
			will be taken to a summary page where you can self mark your answers based on the provided
			english answers. You can view your stats for your last session and best session on the start
			menu.
		</p>

		<p class=" text-xs tracking-[0.25em] uppercase">Loading Your Own Sentences</p>
		<p class="text-muted text-sm">
			The import button on the main menu lets you import your own sentence pairs that you can use.
			You can import a CSV or TSV of the following format, with as many sentences as you want:
			<br />
			After this, it will take you straight to the translation minigame. Imported sets will be saved to
			your browser to make it a quicker to repeat custom sets.
		</p>
	</div>

	<!-- hi 2 -->
	<div
		class="border-fancy bg-fancy flex flex-col gap-3 px-6 py-4"
		in:osuDeath|global={{ duration: 500, y: 60, rotate: 10, easing: cubicOut, delay: 70 }}
		out:osuDeath|global={{ duration: 350, y: 50, rotate: 10, delay: 50, easing: sineIn }}
	>
		<p class="text-xs tracking-[0.25em] uppercase">This Site</p>
		<p class="text-muted text-sm">
			This site is built with SvelteKit and Tailwind CSS. The project is open source and available <a
				href="https://github.com/ORANGETAN3422/speed-translate"
				target="_blank"
				class="text-accent underline">here</a
			>. Made by
			<a
				href="https://github.com/ORANGETAN3422/speed-translate"
				target="_blank"
				class="text-accent underline">Orangetan</a
			>.
		</p>

		<p class="text-xs tracking-[0.25em] uppercase">Sources</p>
		<p class="text-muted text-sm">
			Sentences are sourced from the <a
				href="https://tatoeba.org/en/"
				target="_blank"
				class="text-accent underline">Tatoeba project</a
			>. Keyboard sound effects are from
			<a href="https://mechvibes.com/" target="_blank" class="text-accent underline">Mechvibes</a>.
		</p>
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
