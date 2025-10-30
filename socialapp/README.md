# Social Media Feed App

This is a Twitter-style social feed built with React + TypeScript and Vite. The app implements an MVVM-inspired structure with a small reactive observable system.

## Quick start

Using npm:

```powershell
cd socialapp
npm install
npm run dev
```

Using bun:

```powershell
cd socialapp
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

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui

## Project layout (important folders)

- `src/components/` — UI components (feed, posts, plugins)
- `src/viewmodels/` — view model hooks and reactive logic
- `src/services/` — feed service, plugin service, observable service
- `src/pages/` — top-level pages

## Notes

- Default dev server port is 5173. The previous note referencing port 8082 may reflect a custom configuration — if you need that port, I can add a script or update the Vite config.
- Use `npm run build` then `npm run preview` to inspect production output.

If you'd like I can add a demo dataset, screenshots, or expand the developer guide.







