<script lang="ts">
	import { onMount } from 'svelte';
	import { config } from '$lib/helpers/config.svelte';

	import './layout.css';
	import './themes.css';
	import favicon from '$lib/assets/cube_23.png';

	let { children } = $props();

	onMount(() => {
		document.documentElement.dataset.theme = config.currentTheme;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Quiz Thing</title>
</svelte:head>
{@render children()}
