<script lang="ts">
	import { osuDeath, flyRotate } from '$lib/helpers/transitions';
	import { cubicOut, sineIn } from 'svelte/easing';

	let { onclose }: { onclose: () => void } = $props();
</script>

<div class="flex w-full max-w-md flex-col gap-6">
		<table class="border-fancy w-full text-left text-sm tabular-nums">
			<thead>
				<tr class="border-b border-primary/30">
					<th class="text-text px-3 py-2 text-xs tracking-[0.25em] uppercase">Question</th>
					<th class="text-text px-3 py-2 text-xs tracking-[0.25em] uppercase">Answer</th>
				</tr>
			</thead>
			<tbody class="text-muted">
				<tr class="border-b border-primary/15">
					<td class="jp px-3 py-2">彼はいないだろう。</td>
					<td class="px-3 py-2">He must be out.</td>
				</tr>
				<tr class="border-b border-primary/15">
					<td class="jp px-3 py-2">けど、いらない。</td>
					<td class="px-3 py-2">But I don't need it.</td>
				</tr>
				<tr>
					<td class="jp px-3 py-2">本を読みます。</td>
					<td class="px-3 py-2">I read a book.</td>
				</tr>
			</tbody>
		</table>
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
