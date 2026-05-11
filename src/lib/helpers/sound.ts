import { asset } from "$app/paths"

export const keyAliases: Record<string, string> = {
		backspace: 'backspace',
		delete: 'backspace',
		enter: 'enter',
		' ': 'space',
		tab: 'tab',
		shift: 'shift'
	};

export function getKeyboardSounds(keyboardSound: string): Record<string, string> {
    return import.meta.glob(asset(`sfx/keyboard/${keyboardSound}/*.wav`), {
        eager: true,
        query: '?url',
        import: 'default',
    }) as Record<string, string>
}

export function mapSounds(soundModules: Record<string, string>): Record<string, string> {
    const soundMap: Record<string, string> = {};
    for (const [path, url] of Object.entries(soundModules)) {
		const name = path.split('/').pop()!.replace('.wav', '').toLowerCase();
		soundMap[name] = url;
	}

    return soundMap;
}