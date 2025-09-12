export enum Locale {
    EN = 'en',
    JA = 'ja',
}

export const i18n = {
    defaultLocale: Locale.EN,
    locales: Object.values(Locale),
} as const;

export const getLocale = (locale: string): Locale => {
    // First check if the locale is null or undefined
    if (!locale) {
        return i18n.defaultLocale;
    }

    // Then normalize the locale string (lowercase, trim)
    const normalizedLocale = locale.toLowerCase().trim();

    // Check if the normalized locale is in our supported locales
    if (Object.values(Locale).includes(normalizedLocale as Locale)) {
        return normalizedLocale as Locale;
    }

    for (const supportedLocale of Object.values(Locale)) {
        if (normalizedLocale.startsWith(`${supportedLocale}-`)) {
            return supportedLocale;
        }
    }

    // Return default locale if no match found
    return i18n.defaultLocale;
};
