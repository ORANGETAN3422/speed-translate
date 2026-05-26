import { asset } from '$app/paths';

export interface Sentence {
	question: string;
	answer: string;
}

type RawSentence = { question: string; answer: string; jlpt: string };

export async function loadSentence(jlpt: number): Promise<Sentence[]> {
	const res = await fetch(asset(`/sentences/n${jlpt}.json`));
	if (!res.ok) throw new Error(`Failed to load sentences for n${jlpt}: ${res.status}`);

	const raw = (await res.json()) as RawSentence[];
	return raw.map(({ question, answer }) => ({ question, answer }));
}
