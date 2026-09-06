import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Language = 'en' | 'zh';
type LocalizedText = Record<Language, string>;
interface Media {
  src: string;
  alt: LocalizedText;
}
type Video = Media & { poster?: string };
type OrderedMedia =
  | (Media & { type: 'image' })
  | (Video & { type: 'video' });
interface LearningContent {
  goal: string;
  dateTime: string;
  zh: { category: string; title: string; summary: string };
  en: { category: string; title: string; summary: string };
  images?: Media[];
  video?: Video | Video[];
  videos?: Video[];
  media?: OrderedMedia[];
}

// Each date folder owns its bilingual note and media. No browser-side fetch is needed.
function readSources(): [string, LearningContent][] {
  const root = resolve('public/learning');
  return readdirSync(root, { withFileTypes: true }).filter((project) => project.isDirectory())
    .flatMap((project) => readdirSync(resolve(root, project.name), { withFileTypes: true })
      .filter((date) => date.isDirectory())
      .flatMap((date): [string, LearningContent][] => {
        const path = `public/learning/${project.name}/${date.name}/content.json`;
        if (!existsSync(resolve(path))) return [];
        try {
          return [[path, JSON.parse(readFileSync(resolve(path), 'utf8'))]];
        } catch (error) {
          throw new Error(`${path}: invalid JSON`, { cause: error });
        }
      }));
}

export function getLearningItems(lang: Language) {
  return readSources().map(([path, content]) => {
    const fail = (message: string): never => { throw new Error(`${path}: ${message}`); };
    if (!content.goal || !/^\d{4}-\d{2}-\d{2}$/.test(content.dateTime)) {
      fail('goal and an ISO dateTime (YYYY-MM-DD) are required');
    }
    const date = new Date(`${content.dateTime}T00:00:00Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== content.dateTime) {
      fail('dateTime must be a valid calendar date');
    }
    if (path.split('/').at(-2) !== content.dateTime) fail('date folder must match dateTime');
    for (const language of ['zh', 'en'] as const) {
      const copy = content[language];
      if (!copy?.title || !copy?.category || !copy?.summary) fail(`${language} requires title, category, and summary`);
    }
    const base = path.slice(0, path.lastIndexOf('/') + 1);
    const mediaUrl = (src: string) => {
      if (typeof src !== 'string' || !src || src.startsWith('/') || src.includes('..') || src.includes('\\')) {
        return fail('media src must be relative to its date folder, e.g. images/photo.jpg');
      }
      const url = (base + src).replace(/^public/, '');
      if (!existsSync(resolve('public', url.slice(1)))) fail(`missing media file: ${src}`);
      return url;
    };
    const mediaAlt = (media: Media) => {
      if (!media.alt?.zh || !media.alt?.en) fail('media alt requires both zh and en');
      return media.alt[lang];
    };
    const videos = content.videos ?? (Array.isArray(content.video) ? content.video : content.video ? [content.video] : []);
    if (!Array.isArray(videos)) fail('videos must be an array');
    const orderedMedia: OrderedMedia[] = content.media ?? [
      ...(content.images ?? []).map((media) => ({ ...media, type: 'image' as const })),
      ...videos.map((media) => ({ ...media, type: 'video' as const })),
    ];
    if (!Array.isArray(orderedMedia)) fail('media must be an array');
    return {
      ...content[lang],
      goal: content.goal,
      dateTime: content.dateTime,
      date: new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric', month: lang === 'zh' ? 'long' : 'short', day: 'numeric', timeZone: 'UTC',
      }).format(date),
      images: (content.images ?? []).map((media) => ({ src: mediaUrl(media.src), alt: mediaAlt(media) })),
      videos: videos.map((media) => ({
        src: mediaUrl(media.src),
        alt: mediaAlt(media),
        poster: media.poster ? mediaUrl(media.poster) : undefined,
      })),
      media: orderedMedia.map((media) => {
        if (media.type !== 'image' && media.type !== 'video') fail('each media item requires type "image" or "video"');
        return {
          type: media.type,
          src: mediaUrl(media.src),
          alt: mediaAlt(media),
          poster: media.type === 'video' && media.poster ? mediaUrl(media.poster) : undefined,
        };
      }),
    };
  }).sort((a, b) => a.dateTime.localeCompare(b.dateTime) || a.goal.localeCompare(b.goal));
}
