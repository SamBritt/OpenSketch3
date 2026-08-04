# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # Start Vite dev server (port 5173)
yarn build      # Production build
yarn preview    # Preview production build
```

No test runner is configured beyond the placeholder `App.test.js`. `@testing-library/react` and `@testing-library/jest-dom` are installed but there is no Jest/Vitest config yet.

## Architecture

React 18 + TypeScript SPA built with Vite. Routing via React Router v6, global state via Zustand, HTTP via Axios, styling via Tailwind CSS with a dark stone/zinc palette.

**Path alias:** `@/` maps to `src/` (configured in `vite.config.js`).

**API layer:** `src/lib/api.ts` creates a single Axios instance with `baseURL = VITE_API_URL/api`. All store actions import this instance — never call `axios` directly. `VITE_API_URL` is set in `.env`.

**Routing (App.tsx):**
```
/                    → Landing
/create              → Create
/:userName           → Profile
/:userName/:id       → ImageDetail
```

**State (Zustand stores in `src/store/`):**
- `useImageStore` — owns `images` (global feed), `userImages` (profile feed), and `currentImage` (detail view). All three arrays are updated by the same `updateImage` helper so a like/unlike is reflected everywhere simultaneously. Fetches are guarded by simple cache checks (`images.length > 0`, `loadedUserName === userName`, `currentImage.id === id`) — clear these guards if you need a forced refetch.
- `useCommentStore` — owns `comments` for the currently viewed image; replaces the array on each `fetchComments` call (not merged).

**`userId` is hardcoded to `1` everywhere** — auth is not yet implemented. All API calls that need a `userId` pass `1` directly from the stores.

**Create flow (`/create`):**
`Create` owns a shared `canvasRef` passed to both `Canvas` and `SketchForm`. `Canvas` handles all drawing state locally (undo/redo stacks via `useRef`, brush, opacity, eyedropper, palette). When the user clicks Done, `Canvas` calls `onDone(bgColor)` which reveals `SketchForm`. `SketchForm` composites the canvas drawing onto a background-colored offscreen canvas, converts to JPEG data URL, and POSTs to `/api/images`.

**Image response shape:** The backend's `flattenImage` means API responses always have `userName: string` and `liked: boolean` at the top level — never a nested `user` object. The `Image` type in `src/types.ts` reflects this.

**Component barrel exports:** `src/components/index.ts` and `src/pages/index.ts` re-export everything — always import from `@/components` or `@/pages`, not from the file directly.
