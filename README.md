# Flam Assignment — Projects

This repository contains two frontend projects created for the Flam assignment:

- `musicapp/` — Tune Weaver (a modular music player built with React + TypeScript + Vite)
- `socialapp/` — Social Media Feed App (a Twitter-style feed built with React + TypeScript + Vite)

Each project is a self-contained Vite app. This README summarizes how to run them locally.

## Prerequisites

- Node.js 18+ (recommended) and npm, or
- Bun (optional) — repository includes `bun.lockb` files in project folders

## Quick start (per-project)

Open a terminal and run the following for the project you want to run.

Using npm (works with Node):

```powershell
cd musicapp
npm install
npm run dev
```

Or for the social app:

```powershell
cd socialapp
npm install
npm run dev
```

Using bun (if installed):

```powershell
cd musicapp
bun install
bun run dev
```

Ports: Vite normally serves on `http://localhost:5173`. If you have multiple projects running change the port with `--port` or via `vite.config`.

## Common scripts (each project)

- `dev` — start development server
- `build` — build production assets
- `preview` — preview a production build locally
- `lint` — run ESLint

## Structure (top-level)

- `musicapp/` — music player project
- `socialapp/` — social feed project

## Notes

- Both projects use Vite + React + TypeScript and Tailwind CSS. See each project's README for more details.

---

If you want, I can also add workspace-level scripts (root package.json) or CI steps to build both apps.
