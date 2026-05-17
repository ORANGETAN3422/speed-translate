export const currentKeyboard = 'nk-cream';
export const currentTheme = 'dark';

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
    { fileName: 'Mettaton', displayName: 'Mettaton' },
];

export const themes: ThemeInfo[] = [
    { themeName: 'dark', displayName: 'Dark' },
    { themeName: 'light', displayName: 'Light' },
];