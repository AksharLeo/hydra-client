# PROJECT_CONTEXT.md — hydra-client

## Project

Fork of the official [Hydra Launcher](https://github.com/hydralauncher/hydra) modified to work with a self-hosted backend instead of the official Hydra cloud services. The goal is to run a personal Hydra instance where all cloud features (authentication, cloud saves, achievements, library sync) are served by a self-hosted backend.

**Backend Repository**: [https://github.com/AksharLeo/hydra-selfhosted-backend](https://github.com/AksharLeo/hydra-selfhosted-backend)

## Repository

- **Current branch**: `develop`
- **Local branches**: `develop` (only)
- **Remotes**:
  - `upstream` → `https://github.com/hydralauncher/hydra.git` (fetch and push)
- **No `origin` remote** — this repository does not have its own remote fork. Only the official upstream is configured.
- **HEAD**: `develop` tracks `upstream/main` (same commit: `ebfe3bd14`)

### Branch Strategy

- `develop` is the working branch for self-hosted modifications.
- `main` exists locally and points to the same commit as `upstream/main`.
- Upstream updates can be pulled via `git fetch upstream` and merged into `develop`.

## Hydra Upstream

- **Upstream repo**: `https://github.com/hydralauncher/hydra`
- **Upstream version at fork point**: v4.0.6 (latest as of fork, commit `ebfe3bd14`)
- **Relationship**: `develop` was branched from `upstream/main` at the same commit. No divergent local commits have been made yet — only uncommitted working tree changes exist.

## Custom Modifications

### 1. Subscription Bypass

- **What**: The subscription check in `validateOptions()` is commented out so all cloud features work without a paid Hydra subscription.
- **Where**: `src/main/services/hydra-api.ts` (lines ~350-361)
- **Why**: Self-hosted backend provides these features for free. The official client gates cloud saves, achievements sync, and other features behind a subscription.
- **Status**: Uncommitted working tree change (the only modification to tracked files).
- **Backend relation**: Required — the self-hosted backend always returns `hasActiveSubscription: true` and a fake subscription object.

### 2. Environment Configuration

- **What**: `.env` file points API/auth URLs to the self-hosted backend (`localhost:3001`), while keeping catalogue/assets URLs pointing to official Hydra CDN (`assets.hydralauncher.gg`).
- **Where**: `.env` (untracked file, not committed)
- **Why**: The backend handles auth, profiles, library sync, cloud saves. Game catalogue data, static assets, and download sources still come from the official Hydra infrastructure.
- **Key variables**:
  - `MAIN_VITE_API_URL=http://localhost:3001` — all HydraApi calls go here
  - `MAIN_VITE_AUTH_URL=http://localhost:3001/auth/page` — auth window opens here
  - `MAIN_VITE_CHECKOUT_URL=http://localhost:3001` — checkout (no-op, subscriptions bypassed)
  - `MAIN_VITE_EXTERNAL_RESOURCES_URL=https://assets.hydralauncher.gg` — game assets CDN
  - `RENDERER_VITE_EXTERNAL_RESOURCES_URL=https://assets.hydralauncher.gg` — renderer assets CDN

## Backend Integration

### What Works

- **Environment pointing**: Client `.env` correctly routes API calls to `localhost:3001`.
- **Auth page opening**: Client opens the backend's login HTML page in a BrowserWindow.
- **Account creation**: Users can register via the backend's auth page.

### What Partially Works

- **Authentication flow**: Account creation and login work. Deep link redirect (`hydralauncher://auth?payload=...`) successfully passes credentials to the client.
- **Game detail pages**: Some pages may crash on malformed upstream API responses, though catalogue proxying generally works.
- **Download sources**: Routes are proxied to upstream API.

### Not Implemented / Disabled

- **Friends system**: Backend returns empty arrays for friends lists and requests (`/profile/friends`, `/profile/friend-requests`) so the client gracefully disables the feature instead of logging out.
- **Game reviews**: Proxied to upstream, which requires upstream auth — will likely fail.
- **Notifications (SSE)**: Backend stubs `/profile/notifications/count` to return `0`.
- **Cloud saves end-to-end**: Backend has upload/download routes, but full flow with client is untested.
- **Achievement sync end-to-end**: Backend has routes, but full flow with client is untested.
- **Game artwork cloud sync**: Backend has no artwork storage endpoints.

### Known Issues

- The auth URL construction adds the `AuthPage` enum value as a path segment and `?lng=<language>` as a query param. The backend must handle wildcard paths under `/auth/page/*`.
- The client expects `GET /profile/me` (not `/auth/me`) for user data, returning the full `UserDetails` type.
- Many client API calls go to `/profile/games/*` routes for library management.
- The client uses the `hydralauncher://` protocol scheme (not `hydra://`) for deep links.

## Architecture

- **Framework**: Electron + electron-vite
- **UI**: React (renderer process) + SCSS
- **State**: Redux Toolkit
- **API client**: Axios (wrapped in `HydraApi` static class at `src/main/services/hydra-api.ts`)
- **Local storage**: LevelDB (via `level` package)
- **Build**: electron-builder
- **Env vars**: Vite `import.meta.env` — prefixed `MAIN_VITE_*` for main process, `RENDERER_VITE_*` for renderer
- **Env type declarations**: `src/main/vite-env.d.ts`, `src/renderer/src/vite-env.d.ts`
- **Native addon**: C++ native addon built via `node-gyp` (game process watching)
- **Python RPC**: Python subprocess for torrent/download management

### Key Files for Backend Integration

- `src/main/services/hydra-api.ts` — all HTTP communication with the backend
- `src/main/services/user/get-user-data.ts` — fetches `/profile/me`, stores in LevelDB
- `src/main/events/auth/open-auth-window.ts` — constructs auth URL with language params
- `src/shared/constants.ts` — `AuthPage` enum, `CatalogueCategory` enum
- `src/types/index.ts` — TypeScript types for `UserProfile`, `UserDetails`, `UserStats`, `Badge`, etc.
- `.env` — environment variable configuration

## Current State

### Working

- Client builds and runs (`npm run dev`)
- Game catalogue display and live search suggestions (via upstream proxy)
- UI rendering, navigation, settings
- Account registration and login on self-hosted backend
- Library batch sync (verified end-to-end)
- WebSocket connection (verified end-to-end, realtime auth works)

### Partially Working

- Authentication (account creation works, full auth flow unverified)
- Game detail pages (some crash on missing/malformed API responses)
- Download source sync (routes exist, behavior untested)

### Not Implemented / Disabled

- Cloud save operations
- Achievement synchronization
- Friends/social features (gracefully disabled via backend stubs)
- Game artwork cloud sync

### Known Issues

- Subscription bypass is an uncommitted change — could be lost on reset
- No `origin` remote — cannot push changes to a personal fork
- Some upstream-proxied endpoints may fail if they require upstream auth

## Important Decisions

1. **Subscription bypass via commenting out** — simplest approach, minimal diff, easy to maintain across upstream merges.
2. **Split URL strategy** — API/auth to self-hosted backend, catalogue/assets to official Hydra CDN. This avoids needing to replicate the entire game catalogue.
3. **No origin remote** — repository only has `upstream`. An `origin` should be added when the user sets up their own Git remote.
4. **Strict Upstream Compatibility** — The client payloads (e.g., library sync missing game titles) were explicitly left unmodified to maintain 100% adherence to the official Hydra API schema. The backend fetches missing data (like game titles) directly from the official CDN in the background instead.
5. **Smart Asset Merging** — The `merge-with-remote-games.ts` handles missing metadata (like `"Unknown Game"`) by falling back to locally cached upstream metadata to repair broken backend responses seamlessly.

## Constraints

- The `.env` file must not be committed (contains local URLs).
- The subscription bypass in `hydra-api.ts` must be preserved across upstream merges.
- Environment variables must match the names declared in `vite-env.d.ts` files.
- The `MAIN_VITE_AUTH_URL` must point to the backend's auth page base path (e.g., `http://localhost:3001/auth/page`), because the client appends `AuthPage` enum values and `?lng=` params.

## Development

**Package manager**: Yarn v1 classic (`yarn.lock` is the lockfile).

```bash
# Install dependencies
yarn

# Development (starts Electron app with hot reload)
yarn dev

# Type checking
yarn typecheck          # Both node and web
yarn typecheck:node     # Main process only
yarn typecheck:web      # Renderer only

# Linting
yarn lint

# Formatting
yarn format-check       # Check only
yarn format             # Auto-fix

# Tests
yarn test

# Build
yarn build              # Production build (includes typecheck)
yarn build:linux        # Linux distributable
yarn build:win          # Windows distributable
```
