import { browser } from '$app/environment';

export type KeyboardInfo = {
	fileName: string;
	displayName: string;
};

export type ThemeInfo = {
	themeName: string;
	displayName: string;
};

export const keyboards: KeyboardInfo[] = [
	{ fileName: 'nk-cream', displayName: 'NK Creams' },
	{ fileName: 'cherrymx-brown-abs', displayName: 'CherryMX Brown ABS' },
	{ fileName: 'kalih-box-white', displayName: 'Kalih Box White' },
	{ fileName: 'eg-oreo', displayName: 'EG Oreo' },
	{ fileName: 'Lincoln Typewriter', displayName: 'Lincoln Typewriter' },
	{ fileName: 'Mettaton', displayName: 'Mettaton' },
	{ fileName: 'Sans Undertale', displayName: 'Sans Undertale' },
	{ fileName: 'undertale-papyrus', displayName: 'Papyrus Undertale' }
];

export const themes: ThemeInfo[] = [
	{ themeName: 'dark-default', displayName: 'Dark Default' },
	{ themeName: 'light-default', displayName: 'Light Default' },
	{ themeName: 'dark-grey', displayName: 'Nullscapes' },
	{ themeName: 'dark-green', displayName: 'The Golden' },
	{ themeName: 'purple', displayName: 'Amethyst' },
	{ themeName: 'light-grey', displayName: 'Thinking Space' },
	{ themeName: 'orange-red', displayName: 'Flamewall' },
	{ themeName: 'black-blue', displayName: 'Cold Sweat' }
];

export const config = $state({
	currentKeyboard: 'nk-cream',
	keyboardVolume: 1,
	currentTheme: 'dark-default',
	uiVolume: 0.25,
	disableAnimations: true
});

if (browser) {
	const saved = localStorage.getItem('config');
	if (saved) {
		try {
			Object.assign(config, JSON.parse(saved));
		} catch {
			// ignore
		}
	}
}

export function saveConfig() {
	if (browser) {
		localStorage.setItem('config', JSON.stringify(config));
	}
}

export function ms(time: number): number {
	return config.disableAnimations ? 0 : time;
}
