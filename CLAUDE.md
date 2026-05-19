# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install                  # install dependencies
npm run build:dev            # build for development (uses .env.development)
npm run build:dev:watch      # build in watch mode
npm run build:prod           # build for production (uses .env.production)
```

There is no test suite and no linter configured.

After building, load the generated `dist/` folder as an unpacked extension in `chrome://extensions/`.

## Architecture

This is a Chrome Extension (Manifest V3) that lets users add records to their Discogs wantlist. It bundles two entry points via Vite + `@crxjs/vite-plugin`:

**Background service worker** (`src/background/index.js`)
Listens for `chrome.runtime.sendMessage` calls from the popup. Dispatches to one of six named actions (`getRequestToken`, `completeAuthFlow`, `getUser`, `searchDatabase`, `addToWantlist`, `removeFromWantlist`). All Discogs API communication happens here, never directly in the popup.

- `src/background/discogs/oauth.js` — OAuth 1.0a token exchange and storage
- `src/background/discogs/user.js` — get user profile, add/remove wantlist entries
- `src/background/discogs/search.js` — search the Discogs database
- `src/background/discogs/utils.js` — `authenticatedFetch` (handles JWT + refresh token flow), AES encrypt/decrypt for tokens, `parseReleaseId` (accepts raw IDs, Discogs URLs, or YouTube redirect URLs containing a Discogs URL)

**Popup UI** (`src/popup/popup.js`, `src/popup/popup.html`)
Uses the Alpine.js CSP build. `popup.js` registers all Alpine data components and starts Alpine. Each component in `src/components/` is a factory function returning an Alpine data object:

| Component | Role |
|---|---|
| `oauth` | Initiates `chrome.identity.launchWebAuthFlow` OAuth dance |
| `user` | Fetches and displays user profile, sets `authorized` state |
| `tabs` | Tab switching (search / add), persists last active tab |
| `search` | Text search with pagination, caches results in `chrome.storage.local` |
| `result_item` | Per-result add/remove toggle |
| `add` | Direct-add by release ID or URL |

The root `popup` Alpine component holds shared state (`authorized`, `loading`, `fetching`, `user`, `release`, `releaseId`, `message`, `error`) that child components read and write via Alpine's `$root` / shared scope.

## Backend dependency

All API calls go through a companion backend (`discogs-wantlist-helper-server`). The base URL is set in env files:
- Development: `http://localhost:3000/discogs/api/v1` (run the server locally first)
- Production: `https://discogs-wantlist-helper-server.onrender.com/discogs/api/v1`

The backend handles Discogs OAuth 1.0a signing and issues JWT + refresh tokens to the extension. The extension stores OAuth access tokens encrypted with AES (`crypto-js`) in `chrome.storage.local`. `authenticatedFetch` in `utils.js` transparently refreshes the JWT on 401 responses.
