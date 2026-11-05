# Contributing

## Workflow

1. Branch from `main`: `feature/<short-name>` or `fix/<short-name>`.
2. Commit small, meaningful changes with descriptive messages.
3. Push — CI runs and a preview version with a branch URL is deployed automatically (once Cloudflare is configured).
4. Open a pull request. Required: green CI, preview validated, one approval.
5. Merge to `main` → gated production deployment with smoke tests and automatic rollback.

Never push directly to `main`, never commit secrets (`.dev.vars`, `.env*` are ignored), and never point a non-production environment at production resources.

## Before you push

```bash
npm run check
```

```bash
npm run test:e2e
```

## Conventions

- **TypeScript strict** everywhere; shared logic goes in `src/shared` so the API and UI cannot drift.
- **Every new route** must call a permission helper from `src/worker/services/permissions.ts`, validate input with zod, and get an isolation test in `test/isolation.test.ts`.
- **Every data change** goes through a domain service (e.g. `services/item-ops.ts`) so activity, notifications, realtime and automations stay consistent.
- **Migrations** are append-only and backward compatible with the previous release.
- **UI:** use the shared UI kit (`components/ui`), provide loading/empty/error states, keyboard access and labels, and check light/dark and phone width.
- **Tests:** add integration tests in `test/` (they run inside workerd with real D1/R2/DO) and e2e coverage for user-visible workflows.
