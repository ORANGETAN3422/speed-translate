<script lang="ts">
	import type { customSet } from '$lib/helpers/saving';

	let { set, onclick }: { set: customSet; onclick: (set: customSet) => void } = $props();
</script>

<button
	type="button"
	onclick={() => onclick(set)}
	class="hover-sfx click-sfx border-fancy bg-fancy shadow-fancy interactive flex w-full min-w-48 items-center justify-between gap-3 px-3 py-2 text-left"
>
	<span class="truncate text-sm tracking-wider uppercase">{set.name}</span>
	<span class="text-muted shrink-0 text-xs tabular-nums">{set.count} questions</span>
</button>
