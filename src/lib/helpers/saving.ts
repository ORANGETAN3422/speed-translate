import type { Sentence } from "./sentence";

export interface record {
	set: string;
	time: number;
	words: number;
	score: number;
}

export interface customSet {
	name: string;
	count: string;
	sentences: Sentence[];
	lastPlayed?: number;
}

// CSV Parsing
const customSetKey = "custom";

export function csvToJson(csv: string): Sentence[] {
	const lines = csv.split('\n');
	const rows = lines.map(line => line.split(','));

	const sentences: Sentence[] = []
	for (let i = 1; i < rows.length; i++) {
		const s = rows[i];
		sentences.push({
			"question": s[0].replace(/[\n\r]/g, ''), 
			"answer": s[1].replace(/[\n\r]/g, '')  
		} as Sentence)
	}

	return sentences;
}

export function tsvToJson(tsv: string): Sentence[] {
	const lines = tsv.split('\n');
	const rows = lines.map(line => line.split('\t'));

	const sentences: Sentence[] = []
	for (let i = 1; i < rows.length; i++) {
		const s = rows[i];
		sentences.push({"question": s[0], "answer": s[1]} as Sentence)
	}

	return sentences;
}

export function getCustomSets(): customSet[] | null {
	const cursSets = window.localStorage.getItem(customSetKey)
	if (!cursSets) return null;
	return JSON.parse(cursSets) as customSet[];
}

export function saveCustomSet(set: customSet) {
	const existing = getCustomSets() ?? [];
	const idx = existing.findIndex((s) => s.name === set.name);
	const updated =
		idx >= 0
			? existing.map((s, i) => (i === idx ? set : s)) // replace
			: [...existing, set]; // append

	window.localStorage.setItem(customSetKey, JSON.stringify(updated));
}

/**
 * Stamps the named set with the current timestamp so it sorts to the top of recents.
 */
export function markSetPlayed(name: string) {
	const existing = getCustomSets();
	if (!existing) return;
	const updated = existing.map((s) =>
		s.name === name ? { ...s, lastPlayed: Date.now() } : s
	);
	window.localStorage.setItem(customSetKey, JSON.stringify(updated));
}

/**
 * Returns saved custom sets sorted by most-recently-played first.
 */
export function getRecentCustomSets(limit?: number): customSet[] {
	const all = getCustomSets() ?? [];
	const sorted = [...all].sort((a, b) => (b.lastPlayed ?? 0) - (a.lastPlayed ?? 0));
	return limit !== undefined ? sorted.slice(0, limit) : sorted;
}

// Local Storage Record Interaction

/**
 * Compares a given record with the existing record in localStorage
 * @param {record} record - the record which will be checked against localStorage
 * @returns {boolean} - true if given record's time is less than existing record's time, or if there is no record in localStorage
 */
export function compareRecord(record: record): boolean {
	const existingRecord = getRecord(record.set, record.words);
	return existingRecord ? record.time < existingRecord.time : true;
}

/**
 * Overwrites the existing record in localStorage with the given record
 * @param record the record to be set in localStorage
 * @param isLastRecord a flag indicating if this was just completed
 */
export function setRecord(record: record, isLastRecord: boolean): void {
	const key = isLastRecord ? 'last_record' : `record_${record.set}_${record.words}`;
	window.localStorage.setItem(key, JSON.stringify(record));
	console.log(record);
}

/**
 * Retrieves a record from localStorage based on its set and word count
 * @param {string} set - the name of the set to retrieve
 * @param {number} words - the number of words in the record to retrieve
 * @returns {record | null} - the retrieved record or null if not found
 */
export function getRecord(set: string, words?: number): record | null {
	const key = words !== undefined ? `record_${set}_${words}` : 'last_record';
	const record = window.localStorage.getItem(key);
	console.log(record);
	return record ? (JSON.parse(record) as record) : null;
}
