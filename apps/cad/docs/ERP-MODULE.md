# CAD Automation inside BIZOMAT ERP: the engine's side

Owner's brief and approved audit of 19 Nov 2026. The website's `docs/cad/README.md` (kevinjogin/bizomat-site) has the
whole design, the permission matrix, the migration and the rollback; this page is what this repository does.

**What moves and what stays.** The screens, accounts, computers, history and exports move into the ERP, at
`https://bizomat.ai/erp/c/<company>/cad`. The engine stays here: the AI connector (`/mcp`), the computers' gateway
(`/v2/device/*`), the geometry checks and the CAD workers, in the Fly app `cados` (Amsterdam). SOLIDWORKS stays on the
person's own computer, and it is the master copy. There is no CAD editor in the browser.

**Off by default.** Nothing changes until the ERP's flag `cad_in_erp` is on for a company. While it is off (or after a
rollback), every page, the connector and the gateway work as before, by person.

## Trust

- **ERP to engine**: `POST|GET /api/erp/v1/*` with `Authorization: BIZOMAT-ERP <jws>`. ES256, header
  `typ: bizomat-erp+jwt` and `kid`; payload `iss: bizomat-erp`, `aud: cad`, `iat`, `exp` (one minute), `jti` (used once),
  `htm`, `htu` (the path), `bh` (base64url SHA-256 of the body), `sub` (the BIZOMAT user id), `email`, `ev` (email
  confirmed), `name`, `co` (`id`, `name`, `kind`), `perm` (`view`, `operate` = `all`, `own` or false, `export`, `manage`,
  `delete`, `scope` = `all`, `team` or `own`, `team`), `lim` (the company's fair-use limits). The public key is read from
  `<provider>/api/id/jwks` (cached 10 minutes, read again for an unknown `kid`). `erplink.verify` checks all of it; the
  sign-in gate lets these paths through (`auth._machine_path`), as it does the computers' signed paths.
- **Engine to ERP**: once a minute, the thread `erp-sync` posts to `<provider>/api/id/cad-sync` with this server's
  BIZOMAT client credentials (HTTP Basic, client `cad`; no new secret). No secret, token, path or file content is sent.
- The person's account here is found by their BIZOMAT id, else made from the ERP's word (`accounts.erp_user`: the same
  rules as Sign in with BIZOMAT; an existing account whose email BIZOMAT has not confirmed is never taken over).

## Company context

`tenancy.py` holds the company of a request (a context variable). It is set by `erplink`'s API from the assertion, and by
the AI connector's gates (`mcp_server._company_refused`) from the AI connection's company. While it is set:

- `devicebridge.devices_for` lists only that company's computers; pairing from the ERP records the company; every
  command records it.
- Commands are refused past the company's concurrent limit (`LIMIT_CONCURRENT`) and wait no longer than its
  `commandSeconds`; upload links take at most `uploadMb` (kept with the link); exports belong to the company and its
  `storageMb` is kept by dropping its oldest export.

The columns `company` on `devices`, `pairings` and `commands` (bridge.sqlite) and the key `company` in AI connections
(`mcp_oauth.json`), upload links and exports are added in place; `NULL` means from before, or outside the ERP.

## AI connections

Inside the ERP each AI connection works in one company. The consent page asks which (one company: said, not asked) and
`oauth_decide` refuses a company the person cannot use. A connection made before works on in the person's only company
(or the default the ERP named), and is bound to it on its next use; with several companies it is refused with
`COMPANY_REQUIRED` and the person reconnects and chooses. A connection whose company the person can no longer use is
refused with `COMPANY_ACCESS`.

## The ERP's API (`erplink.router`)

| Path | What |
| --- | --- |
| `POST state` | The company's computers, AI connections, last 100 commands, live exports, usage, the connector and installer addresses, the tools, the example requests (`catalog.EXAMPLES`), the service address and whether there is an add-in package |
| `POST computers/default`, `computers/remove` | Default among one's own computers; remove (one's own, or others' with `delete`) |
| `POST pair/lookup`, `pair/approve` | The Companion's code, approved into the company |
| `POST assistants/remove`, `assistants/assign` | Disconnect; bind one's unbound connection to this company |
| `POST commands/get`, `commands/cancel` | One command with its history and result; cancel |
| `GET exports/{id}/file` | The export's bytes with `X-Sha256` (needs `export`) |
| `GET installer/file` | The installer in this server's data folder, with `X-Sha256`, for the ERP to hand out (its size, SHA-256 and, from the release record, version are in `state`) |
| `POST access` | The person's own private connector address and add-in key (Settings), the service address and whether there is an add-in package; never another person's (needs `operate`) |
| `POST access/private/new`, `access/addin-key/new` | A new private address or add-in key for the person; the old one stops at once |
| `GET addin/package` | The add-in package for a manual installation (`server.SW_DOWNLOAD`), for the ERP to hand out |
| `POST assembly/read` | Reads the open assembly on the person's computer in the background; answers at once with the command id |

What a person sees follows `perm.scope` (`Ctx.owners`): everyone's, their team's or their own. Someone else's computer
never shows the file open in SOLIDWORKS or the installation folders, and a Windows path in someone else's error message
reads "a file" (`erplink._scrub`, also applied to the runs sent to the ERP).

## The sync

`erplink.build` sends `contract: 2`, each account (id, email, confirmed, BIZOMAT id, counts, how many have no company
yet), usage by company (commands waiting for a computer and running apart), finished commands since the last answer
(only those made after the link started: the earlier ones are history, not new runs), the downloads made through AI
assistants' links since the last answer, and checksums. `erplink.apply` keeps the answer in `erp_link.json`: each account's companies and default,
each company's limits, and whether the old pages open in the ERP (`cad_redirect`). It then moves the account's computers,
commands and AI connections with no company into its default company. An answer older than 15 minutes counts for nothing
(`erplink.fresh`): the server then works as before.

## Contract 2 (owner's approval of 20 Nov 2026)

The owner approved the audit's fixes (website repository, `docs/cad/AUDIT-2026-11-20.md`, G2 to G7). The sync says
`contract: 2`, and the ERP answers each account's companies as `{id, name, operate, export}`, plus `passwordRetired`. An
ERP from before sends neither key: a company then means "may work, may download", as before. The ERP names read-only
companies only to an engine that says `contract: 2`, so the order of the two deploys never widens anyone's access.

| What | Where | How |
| --- | --- | --- |
| Read-only roles are refused inside the company, never worked by person | `erplink.company_for_connection`, `working_companies`, the consent page (`server.oauth_authorize`) | A connection in a company where the role is read only (`operate: false`) is refused with `READ_ONLY`; so is one with no company when every company the person is in is read only. The consent page offers only the companies where they may work, and refuses with 403 when there is none. Earlier work never moves into a company where the person is refused |
| The company's download setting reaches the AI connector | `sw_tools.sw_export`, `server.api_artifact`, `erplink.may_export`, `download_refused`, `record_download` | Where the role may not download, `sw_export` keeps the export for the company (the ERP's Exports, one hour) without a `download_url`, and says so. A link is checked again when it is used (the role may have changed within the hour: 403). Every download of a company's export through its link is kept in `erp_link.json` (`downloads`, at most 500) and sent once to the ERP, which writes it into the company's history; a download is removed only after the ERP's 200. Previews (PNG) are pictures, not CAD files, and are not counted |
| Waiting and running commands apart | `erplink.build` | `queued` is the company's commands not yet given to a computer; `running` the others not finished |
| Password sign-in retired | `erplink.password_retired`, `auth._password_retired`, `devicebridge.pair_password` | While the ERP says so (flag `cad_password_retired`, which acts only once every account here is linked to a BIZOMAT account) and its answer is fresh: `/login` (also `?password=1`) goes to Sign in with BIZOMAT, a password sign-in answers 403 with a way on, `/signup` and `/join/<invite>` go to Sign in with BIZOMAT (with the invite), early access is closed, and the Companion's password pairing answers 403 `PASSWORD_RETIRED` with how to pair with the code. A stale answer counts for nothing, so password sign-in comes back when the ERP cannot be reached; `python -m opensketch --reset-password` still sets a password for that case |

Admin's people API reports `password_retired` and `downloads_waiting` under `erp_link`.

Tests: `tests/test_erplink.py` (7 more): an answer from before contract 2, read-only refusal, the consent page, an export
without a link, a link checked again and recorded once, waiting and running counts, and password retirement with its
rollback.

## The old pages

Owner, 20 Nov 2026: "all CAD Automation data and details in ERP, not at bizomat.ai/cad". Every page's content is in the
ERP's CAD Automation module (`/erp/c/<company>/cad`): Home is Overview (the task box with the example requests, the
connection, the set-up steps, recent activity), CAD Assistant is AI assistants, SOLIDWORKS is Computers (with how it
connects, the service address and the add-in package), Tools and History, Settings is Access (the person's own private
address and add-in key, through `access`), Admin is People in the ERP and the console's CAD Automation panel, and the
documentation is Setup and the Knowledge Centre.

While the ERP says `cad_redirect` is on (answers 302, `Cache-Control: no-store`):

| From | To |
| --- | --- |
| `/`, `/overview` | `/erp/cad` (a visitor, or a person who works in the ERP) |
| `/docs` | `/erp/cad/setup` (the same) |
| `/dashboard`, `/assistant`, `/solidworks`, `/tools`, `/history` (with `?command=`), `/settings` | `/erp/cad`, `/assistants`, `/computers`, `/tools`, `/history`, `/access`: a visitor straight from the sign-in gate (`auth.ERP_PAGES`), never through this server's own sign-in; a signed-in person who works in the ERP from the page (`server.ERP_SECTIONS`) |
| `/admin` | `/erp/admin/cad`, for the server's owner |
| `/devices/pair?code=` | `/erp/cad/pair?code=` |
| `/login` | Sign in with BIZOMAT (`/login?password=1` keeps the password page) |

`?here=1` keeps a page here, for support. `/privacy` stays (its notice says what CAD Automation itself keeps). The
programs keep their addresses: the AI connector (`/mcp`), its sign-in and consent, the computers' link (`/v2/`), the
installer (`/download/solidworks`) and `/healthz`. A signed-in person whose companies do not have the module keeps the
pages here. With the flag off, every page is served here again.

## Not in this change

- Uploads sent to SOLIDWORKS are not scanned for malware: they go only to the person's own SOLIDWORKS (the audit's G12,
  a later brief).
- When the ERP's answer is older than 15 minutes, the server works by person: company limits, team views and the
  read-only refusal do not apply to new work until it answers again (nothing moves between companies). The ERP's
  console and module say so after 5 minutes. Exports saved to a
  product are checked by the ERP as every engineering upload is.
- The add-in reads only an assembly's top-level components, without materials, so the ERP's bill of materials proposal
  groups them by part file and says materials are not read.
- `cados` stays in Amsterdam (owner, 19 Nov 2026).

Tests: `tests/test_erplink.py` (a stand-in ERP with its own key and JWKS), and `tests/test_erp_e2e.py` (slow, by hand
before a release, in place of the retired staging walk): the real BIZOMAT work app built and run on Node
(`BIZOMAT_WORK_APP=<bizomat-site>/apps/work`, after `npm run build` there), this engine over HTTP and the stand-in
Companion paired through the ERP; `BIZOMAT_E2E_REPORT=<file>` writes each check's result. It covers one sign-in, the
module for permitted people only, company isolation, downloads by role in the ERP and through links, the migration of
earlier work, old pages into the ERP, fair-use limits, read-only refusal, password retirement and the rollback.
