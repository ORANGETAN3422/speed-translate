<script lang="ts">
    import { type Sentence } from "$lib/sentence";

    let { answeredSentences, englishAnswers, time }: { answeredSentences: Sentence[]; englishAnswers: string[]; time: number } = $props();
    let marks = $state<(boolean | null)[]>(answeredSentences.map(() => null));

    function mark(i: number, value: boolean) {
        if (marks[i] !== null) return;
        marks[i] = value;
    }

    function formatTime(ms: number) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
</script>

<p class="tabular-nums">{formatTime(time)}</p>

<div class="flex flex-col gap-4">
    {#each answeredSentences as sentence, i (sentence.jp)}
        <div class="flex flex-col gap-1 rounded border p-4">
            <p class="text-sm text-gray-500">{sentence.jp}</p>
            <p>{sentence.en}</p>
            <hr>
            <p>{englishAnswers[i] === "" ? "No answer" : englishAnswers[i]}</p>

            <div class="mt-2 flex gap-2">
                <button
                    type="button"
                    onclick={() => mark(i, true)}
                    disabled={marks[i] !== null}
                    class="rounded border px-3 py-1 disabled:opacity-40"
                    class:bg-green-500={marks[i] === true}
                    class:text-white={marks[i] === true}
                >
                    ✓
                </button>
                <button
                    type="button"
                    onclick={() => mark(i, false)}
                    disabled={marks[i] !== null}
                    class="rounded border px-3 py-1 disabled:opacity-40"
                    class:bg-red-500={marks[i] === false}
                    class:text-white={marks[i] === false}
                >
                    ✗
                </button>
            </div>
        </div>
    {/each}
</div>
