# SEO rollback

## Fastest

Cloudflare dashboard → Workers & Pages → `throbbing-block-6c61` → Deployments → roll back to the previous version. This restores the previous pages, sitemap and robots.txt immediately. Then fix the source as below.

## By change

| To undo | Do this |
|---|---|
| Tool pages | `git revert c1d0509`. The cards go back to `/tools/?tool=<id>`; tool pages return 404. Search engines drop them over time. If they have earned traffic, consider 301 redirects from `/tools/<id>/` to `/tools/?tool=<id>` instead of 404s. |
| Sitemap filter or volume descriptions | `git revert 33bcc7e` |
| Gate, connectors, engine, schedules | `git revert fcfd8bd`, or disable a single workflow under Actions → the workflow → ⋯ → Disable workflow |
| IndexNow only | Disable the `SEO validate` workflow's `indexnow` job, or delete the key file in `public/`. Submissions already made cannot be withdrawn, but they don't change rankings by themselves. |
| A future title or description experiment | Revert its commit; its previous state is recorded in `seo/SEO-CHANGE-LOG.md` |

After any revert: run `npm run verify` and `npm run seo:validate`, push to `main`, and check `https://kevos.com/robots.txt`, `/sitemap-index.xml` and the affected pages live.

## Never

Do not block crawlers in `robots.txt` to "pause" SEO, and do not add `noindex` to key pages to undo a change. Both cause far more lasting damage than the change being undone.
