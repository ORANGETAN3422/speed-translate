export interface record {
	set: string;
	time: number;
	words: number;
	score: number;
}

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
