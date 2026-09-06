# Qin Chen — Personal Website

An Astro-based personal portfolio for Embodied AI, Vision-Language-Action (VLA), and Robot Learning work.

## Requirements

- Node.js 22 or newer
- npm

## Local development

Install dependencies:

```bash
npm.cmd install
```

Start the local development server:

```bash
npm.cmd run dev
```

Astro will print the local URL, normally `http://localhost:4321`.

## Production build

Create the static production build:

```bash
npm.cmd run build
```

The generated site is written to `dist/`. To preview that build locally, run:

```bash
npm.cmd run preview
```

## Project structure

- `src/pages/` — site routes
- `src/layouts/` — shared page layout
- `src/components/` — reusable UI components
- `src/styles/` — global styles and design tokens
- `public/` — static assets

## Learning notes and media

Each learning note lives in `public/learning/<project>/<YYYY-MM-DD>/content.json`, next to its `images/` and `videos/` folders. Existing notes have been migrated there.

The file contains shared `goal`, `dateTime`, and media paths, plus localized text:

```json
{
  "goal": "GR00T N1.7 for G1",
  "dateTime": "2026-09-06",
  "zh": {
    "category": "GR00T N1.7 for G1",
    "title": "本次学习主题",
    "summary": "本次完成了什么，遇到了什么问题，下一步准备做什么。"
  },
  "en": {
    "category": "GR00T N1.7 for G1",
    "title": "Topic of this learning note",
    "summary": "Describe progress, challenges, and next steps."
  },
  "media": [
    {
      "type": "image",
      "src": "images/example.jpg",
      "alt": {
        "zh": "图片说明",
        "en": "Image description"
      }
    },
    {
      "type": "video",
      "src": "videos/demo.mp4",
      "alt": {
        "zh": "视频说明",
        "en": "Video description"
      }
    },
    {
      "type": "image",
      "src": "images/result.jpg",
      "alt": {
        "zh": "测试结果",
        "en": "Test result"
      }
    }
  ]
}
```

The ordered `media` array accepts `image` and `video` items in any sequence, so an image can follow a video. Paths are relative to the date folder. Video items may include a `poster` path. Provide both languages for media descriptions. JSON does not allow comments or trailing commas.

`src/data/learning.ts` reads notes on each page render, validates required text, dates and media paths, and sorts the learning timeline oldest first. The homepage independently selects the two newest notes. Edit each tab's introduction in `learning.goals[].description` in both dictionaries; `learning.allGoalsDescription` describes the All tab. One date folder currently represents one note. The development server reloads the page when a date-level `content.json` is added, changed, or removed. Published pages still require a new build and deployment.

Legacy `images`, `video`, and `videos` fields remain supported and are normalized as images first and videos second. Use `media` for new notes whenever exact mixed ordering is needed; when present, it controls the rendered order.

`src/i18n/en.ts` and `src/i18n/zh.ts` retain section labels and `learning.goals`, and call `getLearningItems(lang)` for notes. Add a tab in both dictionaries only when introducing a new goal, and use its exact ID in `content.json`.

Images and videos share a responsive two-column grid (one column on narrow screens) and follow the `media` array order. Descriptions appear on hover or keyboard focus; touch devices show captions below the media. Original image alt text and video accessible labels are preserved.

All files under `public/`, including note JSON, are published with the site. Keep only public-facing content there.

## Project showcase media

Showcase content still lives in `projects.items` in both language dictionaries. Current RoboShelf assets are in `public/project/RoboShelf/images/` and `videos/`. Future dated assets may use `public/project/<project>/<YYYY-MM-DD>/images/` and `videos/`. This content loader only handles learning notes.
