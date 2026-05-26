<script lang="ts">
	let { text, sendData }: { text: string; sendData: (value: string) => void } = $props();
</script>

<td class="px-3 py-2 align-top">
	<textarea
		rows="1"
		value={text}
		oninput={(e) => sendData((e.target as HTMLTextAreaElement).value)}
		placeholder="..."
		class="border-primary focus:border-primary field-sizing-content w-full resize-none border-b border-transparent bg-transparent px-2 py-1 outline-none"
	></textarea>
</td>
