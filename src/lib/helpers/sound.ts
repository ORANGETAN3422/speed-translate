import { browser } from '$app/environment';
import { asset } from '$app/paths';

const audioCtx = browser ? new AudioContext({ latencyHint: 'interactive' }) : null;
const bufferCache = new Map<string, Promise<AudioBuffer>>();

if (browser && audioCtx) {
	const resume = () => {
		audioCtx.resume();
		window.removeEventListener('pointerdown', resume);
		window.removeEventListener('keydown', resume);
	};
	window.addEventListener('pointerdown', resume);
	window.addEventListener('keydown', resume);
}

export const getSfxURL = (file: string): string => asset(`/sfx/${file}.wav`);

function loadAudio(url: string): Promise<AudioBuffer> {
	let p = bufferCache.get(url);
	if (!p) {
		p = fetch(url)
			.then((res) => res.arrayBuffer())
			.then((arrayBuffer) => audioCtx!.decodeAudioData(arrayBuffer));
		bufferCache.set(url, p);
	}
	return p;
}

export async function playSound(url: string) {
	if (!audioCtx) return;
	try {
		const buffer = await loadAudio(url);
		const source = audioCtx.createBufferSource();
		source.buffer = buffer;
		source.connect(audioCtx.destination);
		source.start();
	} catch {
		// igtnore this
	}
}

// Keyboard Sound Functions
export const keyAliases: Record<string, string> = {
	backspace: 'backspace',
	delete: 'backspace',
	enter: 'enter',
	' ': 'space',
	tab: 'tab',
	shift: 'shift'
};

export function getKeyboardSoundUrl(keyboard: string, key: string): string {
	let normalised = keyAliases[key.toLowerCase()] ?? key.toLowerCase();
	if (normalised === '') normalised = 'a'; // default to a for unknown keys
	return asset(`/sfx/keyboard/${keyboard}/${normalised}.wav`);
}
