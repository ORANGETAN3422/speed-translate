import { asset } from '$app/paths';

export function playSound(soundUrl: string) {
	new Audio(soundUrl).play().catch(() => {});
}
export const getSfxURL = (file: string): string => asset(`/sfx/${file}.wav`);

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
	const normalized = keyAliases[key.toLowerCase()] ?? key.toLowerCase();
	return asset(`/sfx/keyboard/${keyboard}/${normalized}.wav`);
}
