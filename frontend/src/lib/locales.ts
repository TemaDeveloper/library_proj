import { Locale } from '@/i18n.config';
import 'server-only';


export type LocaleDict = typeof import('../../locales/en.json');

const localeMap = {
    en: () => import('../../locales/en.json').then((module) => module.default),
    ja: () => import('../../locales/ja.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => localeMap[locale]();
