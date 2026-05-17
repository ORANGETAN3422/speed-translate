import { browser } from '$app/environment';
import { asset } from '$app/paths';

import { config } from './config.svelte';

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

	document.addEventListener('mouseover', (e) => addHoverButtonEvent(e));
	document.addEventListener('click', (e) => addClickButtonEvent(e));
}

export const getSfxURL = (file: string, mp3: boolean = false): string =>
	asset(`/sfx/${file}${mp3 ? '.mp3' : '.wav'}`);

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

export async function playSound(
	url: string,
	opts?: {
		volume?: number;
		detune?: number;
		rate?: number;
		offsetSec?: number;
		durationSec?: number;
	}
) {
	if (!audioCtx) return;
	try {
		const buffer = await loadAudio(url);
		const source = audioCtx.createBufferSource();
		source.buffer = buffer;

		if (opts?.detune) source.detune.value = opts.detune; // cents
		if (opts?.rate) source.playbackRate.value = opts.rate;

		if (opts?.volume !== undefined && opts.volume !== 1) {
			const gain = audioCtx.createGain();
			gain.gain.value = opts.volume;
			source.connect(gain);
			gain.connect(audioCtx.destination);
		} else {
			source.connect(audioCtx.destination);
		}

		if (opts?.offsetSec !== undefined || opts?.durationSec !== undefined) {
			source.start(0, opts.offsetSec ?? 0, opts.durationSec);
		} else {
			source.start();
		}
	} catch {
		// ignore
	}
}

// Ui Sfx

function addHoverButtonEvent(e: MouseEvent) {
	const el = (e.target as HTMLElement | null)?.closest('.hover-sfx') as HTMLElement | null;
	if (!el || (el as HTMLButtonElement).disabled) return;
	const from = e.relatedTarget as HTMLElement | null;
	if (from && el.contains(from)) return;
	playSound(getSfxURL('hover'), {
		volume: config.uiVolume,
		detune: -350
	});
}

function addClickButtonEvent(e: MouseEvent) {
	const el = (e.target as HTMLElement | null)?.closest('.click-sfx') as HTMLElement | null;
	if (!el || (el as HTMLButtonElement).disabled) return;
	const from = e.relatedTarget as HTMLElement | null;
	if (from && el.contains(from)) return;
	playKeyboardSelectSound('eg-oreo', true);
}

export async function playKeyboardSelectSound(keyboard: string, isUi = false) {
	await preloadKeyboard(keyboard);
	playKeyboardKey(keyboard, 'Enter', isUi);
}

// Keyboard Sound Functions

type KeyboardConfig = {
	id?: string;
	name?: string;
	key_define_type?: 'single' | 'multi';
	sound?: string; // filename for single-sprite packs (e.g. "sound.ogg")
	defines: Record<string, string | [number, number] | null>;
};

const configCache = new Map<string, KeyboardConfig>();
const configPromises = new Map<string, Promise<KeyboardConfig>>();

export function playKeyboardKey(keyboard: string, code: string, isUi?: boolean) {
	const cfg = configCache.get(keyboard);
	if (!cfg) return;
	const scanCode = codeToScanCode[code];
	if (!scanCode) return;
	const define = cfg.defines[String(scanCode)];
	if (!define) return;

	const isSingle = cfg.key_define_type === 'single';
	const opts = { volume: isUi ? config.uiVolume : config.keyboardVolume };

	if (isSingle && Array.isArray(define) && cfg.sound) {
		const [startMs, durationMs] = define;
		const url = asset(`/sfx/keyboard/${keyboard}/${cfg.sound}`);
		playSound(url, { ...opts, offsetSec: startMs / 1000, durationSec: durationMs / 1000 });
	} else if (typeof define === 'string') {
		const url = asset(`/sfx/keyboard/${keyboard}/${define}`);
		playSound(url, opts);
	}
}

export function preloadKeyboard(keyboard: string): Promise<KeyboardConfig> {
	const cached = configCache.get(keyboard);
	if (cached) return Promise.resolve(cached);

	let p = configPromises.get(keyboard);
	if (!p) {
		p = fetch(asset(`/sfx/keyboard/${keyboard}/config.json`))
			.then((r) => r.json())
			.then((cfg: KeyboardConfig) => {
				configCache.set(keyboard, cfg);
				// For sprite-style packs, fetch + decode the single audio file now
				if (cfg.key_define_type === 'single' && cfg.sound) {
					loadAudio(asset(`/sfx/keyboard/${keyboard}/${cfg.sound}`));
				}
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
