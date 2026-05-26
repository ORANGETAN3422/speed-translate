<script lang="ts">
	const { onclick }: { onclick: () => void } = $props();
</script>

<tr>
	<td colspan="2" class="px-3 py-2 text-center">
		<button
			{onclick}
			class="bg-fancy hover-sfx click-sfx w-full cursor-pointer hover:brightness-110">+</button
		>
	</td>
</tr>
