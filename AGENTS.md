# Renew404 project rules

These rules apply to every future change in this repository.

- Preserve existing IndexedDB records and version-1 JSON backup compatibility. Never solve an upgrade by clearing browser data.
- Keep the product local-first: no account system, cloud sync, analytics, online logo API, or unrelated feature expansion unless the user explicitly requests it.
- After implementation, run `pnpm lint`, `pnpm test`, `pnpm build`, and `pnpm e2e`.
- Build 1Panel deployment archives with `pnpm release:1panel`. Never use PowerShell `Compress-Archive` for Linux deployment packages.
- A deployment archive must use `/` path separators, contain real `assets/` and `icons/` directories, write hashed resources first, and place `index.html` and `sw.js` last.
- During deployment, overwrite the complete build without deleting the old hashed assets first. An interrupted or partial deployment must not expose a new `index.html` or `sw.js` before their referenced resources exist.
- Keep `index.html`, `sw.js`, and `manifest.webmanifest` on `no-store, no-cache, must-revalidate`; hashed assets may use immutable caching.

