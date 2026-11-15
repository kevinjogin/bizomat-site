# BIZOMAT running costs and how to lower them

Owner's request, 14 Nov 2026: "start optimizing servers so its more efficient and don't take too much resources and
reduce my bills."

## What is billed today

These were checked on 14 Nov 2026 from the configuration in both repositories and the Fly organisation:
- There are no managed Postgres clusters and no Sprites.
- The bills are the two Fly apps. GitHub Actions is free since both repositories became public (14 Nov 2026); before that,
  the private repositories' included minutes ran out on 14 Nov and stopped the CAD repository's CI.

| Item | Size | Runs | Notes |
| --- | --- | --- | --- |
| `bizomat` proxy (syd) | shared-cpu-1x, 256 MB | always | The public entry; `auto_stop_machines = "off"` |
| `bizomat` web (syd) | shared-cpu-1x, 512 MB | always | The website, a static Node server |
| `bizomat` work (syd) | shared-cpu-1x, 512 MB | always | The ERP and every tool, SQLite on the volume |
| `work_data` volume | 3 GB | always | Daily snapshots, kept 30 days |
| `cados` (ams) | shared-cpu-2x, 2 GB | always on (since 14 Nov 2026) | CAD Automation. It used to suspend when idle, but bizomat.ai reaches it over Fly's private network, which cannot wake it: it slept at 22:33 UTC on 14 Nov and bizomat.ai/cad answered 502 (kevinjogin/bizomat-cad#6) |
| `opensketch_data` volume | 1 GB | always | |
| GitHub Actions | runner minutes | per push | Free for public repositories (both are public since 14 Nov 2026) |

**Approximate cost.** On Fly's list prices, memory is the main driver. Expect roughly US$9 a month for `bizomat`'s
three Machines and its volume, and up to about US$11 a month for `cados` while it is awake. The Fly billing page is
the authority.

## Done (14 Nov 2026)

- **CI runs once per commit.** A push to a branch with an open pull request used to run every CI job twice, which
  cost about 24 extra runner-minutes per push (`.github/workflows/bizomat-ci.yml`).
- **The design preview is no longer built or shipped.** That is one fewer build stage and a smaller image, so deploys
  are faster.
- **Already efficient:**
  - pages and files are served compressed (Brotli);
  - hashed assets are cached for a year (`immutable`);
  - HTML is revalidated on each visit.

## Options, by saving (each needs the owner's go-ahead: CLAUDE.md forbids Machine changes without it)

1. **Let CAD Automation sleep safely when nobody uses it.**
   - **Today:** always on, because bizomat.ai/cad reaches it over Fly's private network (`cados.internal`), which
     neither counts as traffic nor wakes a suspended Machine.
   - **Change:**
     1. The owner allocates a private Flycast address for cados (`fly ips allocate-v6 --private -a cados`).
     2. `UPSTREAM_CAD` on bizomat points at it.
     3. cados goes back to `suspend`. Traffic through Flycast passes Fly's proxy, so it counts and wakes the Machine.
     4. Then the Companion holds its link only while SOLIDWORKS runs, so the Machine can sleep the rest of the time.
   - **Saving:** in proportion to the hours nobody uses CAD Automation.
   - **Where:** an address the owner allocates once, a setting in `fly.website.toml`, cados's `fly.toml`, and later
     the Companion in kevinjogin/bizomat-cad.
2. **`cados` from 2 GB to 1 GB.**
   - **Saving:** about half of its running cost.
   - **Risk:** each CAD geometry worker may use up to 800 MB, and large models could run out of memory.
   - **Before deciding:** read its memory graph in the Fly dashboard (cados, Metrics) over a week of real use.
3. **The website served by the proxy Machine.**
   - **Change:** the website is static. Serving it from the proxy process removes the `web` Machine, so 3 Machines
     become 2.
   - **Work and risk:** an engineering change of its own, deployed with `allow_machine_change = YES`.
4. **`web` from 512 MB to 256 MB.**
   - **Saving:** small.
   - **Before deciding:** its memory graph (bizomat, Metrics, the web Machine). Do it only if use stays well under
     200 MB.
5. **Shorter snapshot retention for `work_data`.**
   - **Change:** 14 days instead of 30. Fly bills snapshot storage beyond its free allowance.
   - **Cost to recovery:** it shortens how far back a restore can go.
6. **Cloudflare in front of bizomat.ai** (records proxied).
   - **Saving:** Cloudflare caches the static pages and assets at its edge, which lowers the Fly bandwidth and the
     web Machine's work.
   - **How:** a DNS change the owner makes by hand (CLAUDE.md, Deployment). The planned Cloudflare migration
     (`docs/BIZOMAT-CLOUDFLARE-MIGRATION.md`) goes further.

**Recommended order:**
1. Read a week of memory graphs for `cados` and `web`.
2. Then options 1 and 2 for CAD Automation, the largest item.
3. Then option 4 or option 3 for the website.
