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
	{ fileName: 'Mettaton', displayName: 'Mettaton' }
];

export const themes: ThemeInfo[] = [
	{ themeName: 'default-dark', displayName: 'Default Dark' },
	{ themeName: 'dark-green', displayName: 'Dark Green' },
	{ themeName: 'default-light', displayName: 'Default Light' }
];

export const config = $state({
	currentKeyboard: 'nk-cream',
	keyboardVolume: 1,
	currentTheme: 'default-dark',
	uiVolume: 1
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
