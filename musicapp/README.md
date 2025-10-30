# Tune Weaver — Music Player

Tune Weaver is a modular music player web app built with React, TypeScript, Vite and Tailwind CSS. It demonstrates playback controls, a song queue, and component-driven UI patterns.

## Quick start

Using npm:

```powershell
cd musicapp
npm install
npm run dev
```

Using bun:

```powershell
cd musicapp
bun install
bun run dev
```

Open the app at http://localhost:5173 (default Vite port).

## Available scripts

- `dev` — start Vite dev server
- `build` — build production assets
- `build:dev` — build in development mode
- `preview` — preview production build
- `lint` — run ESLint

These match the scripts in `package.json`.

## Tech stack

- React 18 + TypeScript
- Vite (dev server + build)
- Tailwind CSS + shadcn/ui components
- Radix UI primitives and various utility libraries

## Project layout (important folders)

- `src/` — source code
	- `components/` — UI components (player, music, shared UI)
	- `contexts/` — React contexts (e.g., `MusicPlayerContext`)
	- `services/` — player services and music sources
	- `pages/` — top-level pages

## Notes

- Default dev server port is 5173. If you run multiple apps, set a custom port with `--port` or in `vite.config.ts`.
- Use `npm run build` to create a production bundle and `npm run preview` to inspect it locally.

If you'd like, I can add more developer notes, environment variables, or a small CONTRIBUTING.md.
