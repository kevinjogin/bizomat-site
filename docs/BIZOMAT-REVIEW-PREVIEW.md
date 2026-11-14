# Review preview of a pull request

Owner's request, 14 Nov 2026: see and test the website and BIZOMAT ERP in a browser before approving a release, without
touching production.

## What it is

`.github/workflows/review-preview.yml`, on a GitHub-hosted runner:
1. It builds the production image from the pull request.
2. It starts the local stack (`infrastructure/local/compose.yml`: proxy, website, ERP, CAD Automation) with its own
   empty database.
   In that database only, the founder's sign-up policy allows `example.com`. That is the reserved domain the demo
   accounts use, and it has no mail server. Every other check stays as in production.
3. It loads invented demo data (`infrastructure/preview/seed-demo.mjs`).
4. It puts the gate in front (`infrastructure/preview/gate.mjs`).
5. It opens a Cloudflare quick tunnel: an address like `https://<random words>.trycloudflare.com`.
6. Before sharing the address, it checks it in a browser (`infrastructure/preview/walk.mjs`), then posts it on the
   pull request.

The preview stays up for the time chosen (3 hours by default, at most 330 minutes). Then the stack and its data are
deleted.

- **Start:** add the label `preview` to the pull request. Remove the label and add it again for a fresh preview. Once
  the workflow is on main, it can also be run by hand from Actions.
- **Stop early:** cancel the run.
- **Sign in:** `demo@example.com`, with the demo password in `apps/work/scripts/seed-local.mjs`.
- **Protect it (optional):** set the repository secret `PREVIEW_PASSWORD`. Every request then needs HTTP Basic sign-in
  (user `review`). Without it, the address is random and noindex but open while it runs. The demo data is invented.
- **Cost:** GitHub Actions minutes only, about 15 to start plus the time it stays up. Nothing is created in Fly.io or
  Cloudflare, and quick tunnels need no Cloudflare account.

## What the gate does

The stack is the production image and believes it is `bizomat.ai`. The gate lets it answer at the preview's address
without any production code changing:
- **Requests:** they reach the proxy with Host, Origin and Referer set to `bizomat.ai`, so routing, sign-in and
  origin checks run as in production.
- **Responses:**
  - In redirects, cookies, the Content-Security-Policy and text bodies, `https://bizomat.ai` becomes the preview's
    address, so no link leaves the preview.
  - Strict-Transport-Security is dropped, and `X-Robots-Tag: noindex` is added.
- **Tests:** `tests/preview-gate.test.ts`.

## Not in a preview

- **Needs production keys:** emails, AI search and the contact form.
- **Needs a real Windows computer:** CAD Automation's link to SOLIDWORKS.
- **Lifetime:** while the run lasts. The address changes with each run.
