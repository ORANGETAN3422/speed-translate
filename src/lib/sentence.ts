import { asset } from "$app/paths";

export interface Sentence {
    jp: string;
    en: string;
    jlpt: string;
}

export async function loadSentence(jlpt: number): Promise<Sentence[]> {
    const res = await fetch(asset(`sentences/n${jlpt}.json`));
    if (!res.ok) throw new Error(`Failed to load sentences for n${jlpt}: ${res.status}`)

    return (await res.json()) as Sentence[];
}