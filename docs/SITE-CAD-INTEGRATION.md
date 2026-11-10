# How BIZOMAT Site and BIZOMAT CAD work together

The same file is kept in both repositories: `kevinjogin/bizomat-site` and `kevinjogin/bizomat-cad`
(`docs/SITE-CAD-INTEGRATION.md`). Change it in both, in the same week, when a contract below changes.

Written 9 Nov 2026, when the source moved to these two repositories. It describes production as it runs: two Fly.io
apps in the same Fly organization, in different regions. The figures below were read from Fly on 9 Nov 2026
(`fly scale show`, `fly volumes list`), and each repository's Fly configuration matches them.

| | BIZOMAT Site | BIZOMAT CAD |
| --- | --- | --- |
| Repository | `kevinjogin/bizomat-site` | `kevinjogin/bizomat-cad` |
| Fly app | `bizomat` | `cados` |
| Config deployed | `fly.website.toml` | `fly.toml` |
| Serves | `bizomat.ai` (website, sign-in page, Project Management at `/tasks`), and the router in front of everything | CAD MCP: the MCP endpoint, OAuth, the SOLIDWORKS device bridge, CAD pages at `/cad`, installer and update endpoints |
| Fly origin | `https://bizomat.fly.dev` (health only; pages 301 to bizomat.ai) | `https://cados.fly.dev` (all CAD paths, as connectors and computers use it) |
| Region | Sydney (`syd`) | **Amsterdam (`ams`)** |
| Machines | one Machine, `work` (shared-cpu-1x, 1 GB), running the router, the website and Project Management (`bizomat-entrypoint all`, from 10 Nov 2026; before: proxy 256 MB, web and work 512 MB each) | one Machine, `app` (shared CPU, 2 vCPUs, 2048 MB) |
| Volumes | `work_data` (3 GB, on work) | `opensketch_data` (1 GB) |
| Deploy workflow | `bizomat-deploy.yml`, secret `FLY_BIZOMAT_TOKEN` | `deploy.yml`, secret `FLY_CADOS_TOKEN` |

**The two apps are on opposite sides of the world.** Every request for `bizomat.ai/cad` goes from the router in Sydney
to `cados` in Amsterdam and back, which adds roughly a quarter of a second, and AI apps and SOLIDWORKS computers in
Australia reach `cados.fly.dev` in Amsterdam. Moving `cados` to Sydney means a new volume in `syd` made from a snapshot
and the Machine moved onto it: a production change of its own, planned and done outside a code deploy (the deploy
preflight stops any deploy that would change the region).

## 1. Network: the router reaches CAD over Fly's private network

```
visitor --https--> bizomat.ai (DNS) --> Fly app bizomat, the router (:8080, the only public port)
                                          |-- /tasks/...            --> work  :8002  (same Machine, 127.0.0.1)
                                          |-- CAD_PATHS (below)     --> http://cados.internal:8080  (Fly app cados)
                                          '-- everything else       --> web   :8003  (same Machine, 127.0.0.1)

AI apps, SOLIDWORKS computers --https--> cados.fly.dev (or bizomat.ai/cad, or the old cados.kevos.com) --> Fly app cados :8080
```

- `UPSTREAM_CAD = "http://cados.internal:8080"` in the site's `fly.website.toml`. `cados.internal` is Fly's private DNS
  name for the app `cados`; it resolves only inside the same Fly organization. **Both apps must stay in the same Fly
  organization**, and `cados` must keep listening on `::` port 8080 (`python -m opensketch --host :: --port 8080`,
  the CAD Dockerfile's CMD).
- The `cados` Machine must be running for `bizomat.ai/cad` to answer. The CAD `fly.toml` has
  `auto_stop_machines = 'suspend'`, `min_machines_running = 0`: Fly's proxy wakes it for public requests, and the
  add-ins' long polls keep it awake. Requests over the private network do not wake a suspended Machine, so
  `bizomat.ai/cad` can fail while `cados` is suspended. The CAD branch `claude/practical-lovelace-hi2nio` (commit
  `c4a60c7`, "cados always on", not merged) proposes `auto_stop_machines = "off"` for this reason: a production
  change for the owner to decide.
- Seen live on 10 Nov 2026 (probes of `https://bizomat.ai/cad/healthz` every 5 s and of the router's `/__proxy/ready`
  every minute, from outside, 10:20 to 11:50 UTC): five times (10:33, 10:45, 11:05, 11:18, 11:35) `/cad/healthz`
  answered 502 and the router reported `cad: ENOTFOUND`, so `cados.internal` had no address (the name lists started
  Machines only) while `cados` was suspended. The router cannot wake it: with no address it sends nothing. Each time
  `cados` answered again about 12 s later, woken by other traffic through Fly's proxy (`cados.fly.dev`,
  `cados.kevos.com`). With no such traffic (at night, for example), bizomat.ai/cad stays down until some. The two ways to make the router wake it are changes to `cados`, for the owner: keep it
  running (`auto_stop_machines = "off"`, or `min_machines_running = 1`), or give it a private Flycast address
  (`fly ips allocate-v6 --private -a cados`) and point `UPSTREAM_CAD` at `http://cados.flycast`, so that the router's
  requests go through Fly's proxy, which starts a suspended Machine (check first how cados's `force_https` treats
  those plain-HTTP requests).
- There is no shared database, queue or secret between the two apps. Each keeps its own data on its own volume:
  `bizomat` has `work_data` (Project Management); `cados` has `opensketch_data` (CAD accounts, OAuth grants, the
  bridge signing key, `bridge.sqlite`).

## 2. Paths: which requests on bizomat.ai belong to CAD

One regular expression, `CAD_PATHS`, decides it. It exists twice in the site repository and the site's tests check
that both copies are equal:

- `infrastructure/proxy/routes.mjs` (the Fly router)
- `src/server/platform-paths.ts` (the website's Cloudflare Worker, not deployed)

It matches `/cad` and `/cad/...`, and CAD's root program paths: `/mcp`, `/solidworks/mcp`, `/oauth/...`, `/v2/...`,
`/healthz`, and `/.well-known/oauth-protected-resource...`, `/.well-known/oauth-authorization-server...`,
`/.well-known/openid-configuration...`. The CAD app's own list of the paths it keeps at the root is
`opensketch/canonical.py` (`KEEP_PREFIXES`) in the CAD repository.

**Never change these paths, the MCP endpoints, the OAuth paths or the device API without changing both repositories
together:** AI app connectors and paired SOLIDWORKS computers depend on them. No page of the website may take one of
these paths (the site's `tests/worker.test.ts`).

## 3. Addresses: CAD lives under bizomat.ai/cad

- The CAD app's public address is `OPENSKETCH_PUBLIC_URL = https://bizomat.ai/cad` (CAD `fly.toml` and the deploy
  workflow). `opensketch/canonical.py` takes the `/cad` prefix off incoming paths and writes it back into every link,
  redirect and cookie it makes. The router never rewrites paths or the Host header.
- Its OAuth issuer is `https://bizomat.ai/cad`; the OAuth metadata is served at the root of bizomat.ai
  (`/.well-known/oauth-protected-resource/cad/mcp`, `/.well-known/oauth-authorization-server/cad`), which is why those
  paths are in `CAD_PATHS`.
- Old hosts keep working for programs: `OPENSKETCH_REDIRECT_HOSTS = cados.fly.dev,cados.kevos.com,cad.bizomat.ai`.
  Pages there answer 301 to `https://bizomat.ai/cad`; MCP, OAuth, `/v2/` (computers) and `/api/` keep answering at
  their root with that host's own address.
- Google sign-in for CAD returns to `https://bizomat.ai/cad/auth/google/callback` (registered in the Google client).

## 4. Brand and shared files

- The website's `shared/brand/` is the source of the brand (logo geometry, tokens, fonts). `npm run brand` copies it
  into each product; `npm run brand:check` (site CI) checks the copies.
- The corporate footer text (slogan, short description, copyright line) comes from the website's
  `src/config/platform.ts`; the CAD app repeats it in `opensketch/brand.py`. Change both together.
- CAD pages link to the website's contact page for support (`brand.support_url()`), never to GitHub.

## 5. The CAD copy inside the site repository (`apps/cad`)

The site repository carries `apps/cad`, a byte-for-byte copy of one CAD commit, pinned in `apps/cad-source.json`
(commit `e669cc6`, tree `e97f6f4`: CADOS `main` on 9 Nov 2026, the branch Fly built `cados` from). It came with the
earlier plan to run CAD inside the `bizomat` app. That plan's `cad` process group never ran and was removed from
`fly.website.toml` on 9 Nov 2026, but the site's image (`infrastructure/fly/Dockerfile`) still builds its CAD stages
from `apps/cad`, so the copy stays until those stages go. Nothing there is edited by hand:

- `node scripts/sync-cad.mjs check` proves `apps/cad` is exactly the pinned tree (site CI runs it).
- `node scripts/sync-cad.mjs to <commit> --cados <path to a bizomat-cad clone>` replaces it with another CAD commit,
  in a pull request of its own.

CAD is changed only in `kevinjogin/bizomat-cad`. Removing the CAD stages from the site's Dockerfile (and the
`cad` role from `infrastructure/fly/entrypoint.sh`) lets `apps/cad` and its pin go too, in one pull request of the site
repository with its image and entrypoint tests.

## 6. Installer downloads and updates

- The Windows installer (MSI) is built by the CAD repository (`solidworks.yml`, `installer/`), published as GitHub
  releases there (private: for the owner) and copied for the public to bizomat.ai downloads with
  `tools/laptop/cloudflare.ps1 publish installer` (R2 bucket `bizomat-downloads`).
- `/cad/download/solidworks` (signed in) is served by the CAD app: `OPENSKETCH_INSTALLER_URL`, else a file on the
  `cados` volume (`/data/downloads/`), else the published release record.
- The Companion's update manifest is `/v2/bridge/update.json` on the CAD app, signed by the gateway.

## 7. Checklist when one side changes

| Change | Site | CAD |
| --- | --- | --- |
| A new CAD root path | `CAD_PATHS` in both files, tests | `canonical.py` `KEEP_PREFIXES`, tests |
| CAD's public address | `UPSTREAM_CAD`, docs | `OPENSKETCH_PUBLIC_URL`, OAuth client callbacks |
| Fly app name, organization or private port | `UPSTREAM_CAD` | `fly.toml`, Dockerfile CMD |
| Brand or footer text | `shared/brand/`, `src/config/platform.ts` | `opensketch/brand.py`, the brand copies |
| A deploy | `bizomat-deploy.yml` (bizomat only) | `deploy.yml` (cados only) |
