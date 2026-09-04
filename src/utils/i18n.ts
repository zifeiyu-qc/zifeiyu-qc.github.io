import { en } from '../i18n/en';
import { zh } from '../i18n/zh';

export const languages = ['en', 'zh'] as const;
export type Lang = (typeof languages)[number];
export type PageKey = 'home' | 'projects' | 'learning' | 'publications' | 'about';

export const pageSlugs: Record<PageKey, string> = {
  home: '',
  projects: 'projects',
  learning: 'learning',
  publications: 'publications',
  about: 'about',
};

export const dictionaries = { en, zh };

export function getTranslations(lang: Lang) {
  return dictionaries[lang];
}

export function getLocalizedPath(lang: Lang, page: PageKey) {
  const slug = pageSlugs[page];
  if (lang === 'zh') return slug ? `/zh/${slug}` : '/zh/';
  return slug ? `/${slug}` : '/';
}

export function getAlternatePath(lang: Lang, page: PageKey) {
  return getLocalizedPath(lang === 'en' ? 'zh' : 'en', page);
}
