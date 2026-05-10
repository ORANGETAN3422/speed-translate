<script lang="ts">
	import { onMount } from 'svelte';
	import { loadSentence } from '$lib/sentence';

	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	onMount(async () => {
		const n5 = await loadSentence(5);
		console.log(n5);
	});

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
