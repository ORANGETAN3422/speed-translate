<script lang="ts">
	import { type Sentence } from '$lib/helpers/sentence';

	let {
		sentence,
		answer,
		mark,
		onmark
	}: {
		sentence: Sentence;
		answer: string;
		mark: boolean | null;
		onmark: (value: boolean) => void;
	} = $props();

	function handleMark(value: boolean) {
		if (mark !== null) return;
		onmark(value);
	}
</script>

<div class="flex flex-1 flex-col gap-1">
	<p class="jp text-base">{sentence.question}</p>
	<p class="text-sm text-muted">
		{sentence.answer}
	</p>
	<p class="text-sm">
		<span class="text-muted">A:</span>
		<span
			class="transition-all duration-300 group-hover/card:text-text group-hover/card:[text-shadow:0_0_8px_var(--primary)]"
			>{answer === '' ? 'No answer' : answer}</span
		>
	</p>
</div>

<div
	class="relative isolate -my-3 -mr-5 flex shrink-0 items-center gap-3 self-stretch py-3 pr-5 pl-24"
>
	<div
		class="absolute inset-0 -z-10 opacity-60"
		style="background: color-mix(in oklch, var(--bc, var(--primary)), black 52%); clip-path: polygon(40px 0, 100% 0, 100% 100%, 0 100%);"
	></div>

	<div
		class="absolute inset-0 -z-10 opacity-60 transition-opacity duration-300 group-hover/card:opacity-100"
		style="background: color-mix(in oklch, var(--bc, var(--primary)), black 52%); clip-path: polygon(50px 0, 100% 0, 100% 100%, 0 100%);"
	></div>

	<button
		type="button"
		onclick={() => handleMark(true)}
		disabled={mark !== null}
		class="border-fancy shadow-fancy interactive flex h-10 w-10 items-center justify-center text-lg disabled:opacity-50"
		class:bg-success={mark === true}
		class:text-bg={mark === true}
		style:--bc={mark === true ? 'var(--success)' : undefined}
	>
		✓
	</button>
	<button
		type="button"
		onclick={() => handleMark(false)}
		disabled={mark !== null}
		class="border-fancy shadow-fancy interactive flex h-10 w-10 items-center justify-center text-lg disabled:opacity-50"
		class:bg-error={mark === false}
		class:text-bg={mark === false}
		style:--bc={mark === false ? 'var(--error)' : undefined}
	>
		✗
	</button>
</div>
