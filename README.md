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
