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
| `POST state` | The company's computers, AI connections, last 100 commands, live exports, usage, the connector and installer addresses, the tools |
| `POST computers/default`, `computers/remove` | Default among one's own computers; remove (one's own, or others' with `delete`) |
| `POST pair/lookup`, `pair/approve` | The Companion's code, approved into the company |
| `POST assistants/remove`, `assistants/assign` | Disconnect; bind one's unbound connection to this company |
| `POST commands/get`, `commands/cancel` | One command with its history and result; cancel |
| `GET exports/{id}/file` | The export's bytes with `X-Sha256` (needs `export`) |
| `POST assembly/read` | Reads the open assembly on the person's computer in the background; answers at once with the command id |

What a person sees follows `perm.scope` (`Ctx.owners`): everyone's, their team's or their own. Someone else's computer
never shows the file open in SOLIDWORKS or the installation folders, and a Windows path in someone else's error message
reads "a file" (`erplink._scrub`, also applied to the runs sent to the ERP).

## The sync

`erplink.build` sends each account (id, email, confirmed, BIZOMAT id, counts, how many have no company yet), usage by
company, finished commands since the last answer (only those made after the link started: the earlier ones are history,
not new runs) and checksums. `erplink.apply` keeps the answer in `erp_link.json`: each account's companies and default,
each company's limits, and whether the old pages open in the ERP (`cad_redirect`). It then moves the account's computers,
commands and AI connections with no company into its default company. An answer older than 15 minutes counts for nothing
(`erplink.fresh`): the server then works as before.

## The old pages

While the ERP says `cad_redirect` is on, a signed-in person who works with CAD Automation inside the ERP is sent from
`/dashboard`, `/assistant`, `/solidworks`, `/tools`, `/history` (with `?command=`), `/settings`, `/` and
`/devices/pair?code=` to the same page in the ERP, and `/login` goes to Sign in with BIZOMAT (`/login?password=1` keeps
the password page). Admin stays here. With the flag off, every page is served here again.

## Not in this change

- Uploads sent to SOLIDWORKS are not scanned for malware: they go only to the person's own SOLIDWORKS. Exports saved to a
  product are checked by the ERP as every engineering upload is.
- The add-in reads only an assembly's top-level components, without materials, so the ERP's bill of materials proposal
  groups them by part file and says materials are not read.
- `cados` stays in Amsterdam (owner, 19 Nov 2026).

Tests: `tests/test_erplink.py` (a stand-in ERP with its own key and JWKS).
