import type { Sentence } from './sentence';

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
const customSetKey = 'custom';

export function csvToJson(csv: string): Sentence[] {
	const lines = csv.split('\n');
	const rows = lines.map((line) => line.split(','));

	const sentences: Sentence[] = [];
	for (let i = 1; i < rows.length; i++) {
		const s = rows[i];
		sentences.push({
			question: s[0].replace(/[\n\r]/g, ''),
			answer: s[1].replace(/[\n\r]/g, '')
		} as Sentence);
	}

	return sentences;
}

export function tsvToJson(tsv: string): Sentence[] {
	const lines = tsv.split('\n');
	const rows = lines.map((line) => line.split('\t'));

	const sentences: Sentence[] = [];
	for (let i = 1; i < rows.length; i++) {
		const s = rows[i];
		sentences.push({ question: s[0], answer: s[1] } as Sentence);
	}

	return sentences;
}

// set saving

export function getCustomSets(): customSet[] | null {
	const cursSets = window.localStorage.getItem(customSetKey);
	if (!cursSets) return null;
	return JSON.parse(cursSets) as customSet[];
}

function sentencesEqual(a: Sentence[], b: Sentence[]): boolean {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (a[i].question !== b[i].question || a[i].answer !== b[i].answer) return false;
	}
	return true;
}

/**
 * Saves a set to localStorage. If a set with the same name AND same content exists,
 * updates it in place (preserving metadata like lastPlayed). If the name collides but
 * the content differs, auto-renames to "name (2)", "name (3)", etc.
 * Returns the customSet.
 */
export function saveCustomSet(set: customSet): customSet {
	const existing = getCustomSets() ?? [];
	const sameName = existing.find((s) => s.name === set.name);

	let toSave = set;
	let updated: customSet[];

	if (sameName) {
		if (sentencesEqual(sameName.sentences, set.sentences)) {
			// dedupe
			updated = existing.map((s) =>
				s.name === set.name ? { ...s, ...set, lastPlayed: s.lastPlayed } : s
			);
		} else {
			// suffix name
			let suffix = 2;
			while (existing.some((s) => s.name === `${set.name} (${suffix})`)) suffix++;
			toSave = { ...set, name: `${set.name} (${suffix})` };
			updated = [...existing, toSave];
		}
	} else {
		updated = [...existing, set];
	}

	window.localStorage.setItem(customSetKey, JSON.stringify(updated));
	return toSave;
}

/**
 * sets the named set with the current timestamp so it sorts to the top of recents.
 */
export function markSetPlayed(name: string) {
	const existing = getCustomSets();
	if (!existing) return;
	const updated = existing.map((s) => (s.name === name ? { ...s, lastPlayed: Date.now() } : s));
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

export function deleteSet(name: string) {
	const existing = getCustomSets();
	if (!existing) return;

	const updated = existing.filter((s) => s.name !== name);
	window.localStorage.setItem(customSetKey, JSON.stringify(updated));
	return updated;
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
