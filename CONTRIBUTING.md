# Contributing to Renew404

Thank you for helping make Renew404 clearer, safer, and more useful.

## Product boundaries

Renew404 is intentionally local-first and focused on renewal tracking. Please open an issue before proposing an account system, cloud sync, analytics, advertising, online logo API, payment integration, or another feature that materially changes that promise.

Compatibility is non-negotiable:

- never clear IndexedDB to solve an upgrade;
- preserve existing service and payment records;
- keep version-1 JSON backups importable;
- treat template and logo entries as optional helpers, never runtime dependencies for saved records;
- preserve unknown `iconKey` values through import and use the normal fallback UI.

## Development

Requirements: Node.js 24 and pnpm 11 or later.

```bash
pnpm install
pnpm dev
```

Before submitting a pull request, run:

```bash
pnpm lint
pnpm test
pnpm build
pnpm e2e
```

Install Playwright Chromium once if needed:

```bash
pnpm exec playwright install chromium
```

## Pull requests

Keep changes focused, describe any data-model impact, and add tests for migrations, backup compatibility, or mobile flows when relevant. UI changes should be checked in all four supported languages, both themes, and a narrow mobile viewport.

Brand logos must be accurate, locally bundled, limited to the required whitelist, and sourced under a clear license. Do not add external logo requests or approximate hand-drawn marks. Brand names and logos remain the property of their respective owners.
