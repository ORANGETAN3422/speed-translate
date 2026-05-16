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

type KeyboardConfig = {
	id?: string;
	name?: string;
	defines: Record<string, string | null>;
};

const configCache = new Map<string, KeyboardConfig>();
const configPromises = new Map<string, Promise<KeyboardConfig>>();

export function preloadKeyboard(keyboard: string): Promise<KeyboardConfig> {
	const cached = configCache.get(keyboard);
	if (cached) return Promise.resolve(cached);

	let p = configPromises.get(keyboard);
	if (!p) {
		p = fetch(asset(`/sfx/keyboard/${keyboard}/config.json`))
			.then((r) => r.json())
			.then((cfg: KeyboardConfig) => {
				configCache.set(keyboard, cfg);
				return cfg;
			});
		configPromises.set(keyboard, p);
	}
	return p;
}

// Mechvibes has a system
const codeToScanCode: Record<string, number> = {
	Escape: 1,
	Digit1: 2,
	Digit2: 3,
	Digit3: 4,
	Digit4: 5,
	Digit5: 6,
	Digit6: 7,
	Digit7: 8,
	Digit8: 9,
	Digit9: 10,
	Digit0: 11,
	Minus: 12,
	Equal: 13,
	Backspace: 14,
	Tab: 15,
	KeyQ: 16,
	KeyW: 17,
	KeyE: 18,
	KeyR: 19,
	KeyT: 20,
	KeyY: 21,
	KeyU: 22,
	KeyI: 23,
	KeyO: 24,
	KeyP: 25,
	BracketLeft: 26,
	BracketRight: 27,
	Enter: 28,
	ControlLeft: 29,
	KeyA: 30,
	KeyS: 31,
	KeyD: 32,
	KeyF: 33,
	KeyG: 34,
	KeyH: 35,
	KeyJ: 36,
	KeyK: 37,
	KeyL: 38,
	Semicolon: 39,
	Quote: 40,
	Backquote: 41,
	ShiftLeft: 42,
	Backslash: 43,
	KeyZ: 44,
	KeyX: 45,
	KeyC: 46,
	KeyV: 47,
	KeyB: 48,
	KeyN: 49,
	KeyM: 50,
	Comma: 51,
	Period: 52,
	Slash: 53,
	ShiftRight: 54,
	AltLeft: 56,
	Space: 57,
	CapsLock: 58,
	ControlRight: 3613,
	ShiftRight2: 3612,
	AltRight: 3640
};

export function getKeyboardSoundUrl(keyboard: string, code: string): string | null {
	const cfg = configCache.get(keyboard);
	if (!cfg) return null;
	const scanCode = codeToScanCode[code];
	if (!scanCode) return null;
	const wav = cfg.defines[String(scanCode)];
	if (!wav) return null;
	return asset(`/sfx/keyboard/${keyboard}/${wav}`);
}
