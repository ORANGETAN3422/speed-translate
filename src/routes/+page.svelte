<script lang="ts">
	import QuizSession from '$lib/components/Quiz/QuizSession.svelte';

	let active = $state(false);
	let currentLevel = $state(0);

	function createSession(jlpt: number) {
		console.log('create session');
		active = true;
		currentLevel = jlpt;
	}

	let things = [5, 4];
</script>

<div class="flex flex-col gap-2">
	{#each things as n (n)}
		<button onclick={() => createSession(n)}>{n}</button>
	{/each}
</div>

{#if active}
	<div class="overlay">
		<QuizSession level={currentLevel} onclose={() => (active = false)} />
	</div>
{/if}
