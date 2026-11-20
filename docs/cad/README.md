# CAD Automation inside BIZOMAT ERP

Owner's brief and approved audit of 19 Nov 2026, with the owner's decisions: the screens, accounts, computers, history
and exports move into the ERP, and the engine and SOLIDWORKS stay where they are (no CAD editor in the browser; a 3D
viewer for exports would be a separate feature); each AI connection is bound to one company; configure-to-order (5.5)
is deferred; `cados` stays in Amsterdam; Members and Permissions came first. The engine's side is
kevinjogin/bizomat-cad `docs/ERP-MODULE.md`.

**Status:** built behind flags that ship off. Nothing changes for anyone until a platform admin switches `cad_in_erp` on
for a company, which needs the owner's approval. The brief's pilot (one company first) is that switch.

## What moves and what stays

| In the ERP (`/erp/c/<company>/cad`) | Where it stays |
| --- | --- |
| Overview, computers, AI assistants, history, exports, tools, access, people, setup, pairing a computer | The AI connector `https://bizomat.ai/cad/mcp` and its sign-in |
| Who may see and do what (the ERP's central permissions) | The computers' gateway (`/cad/v2/device/*`) and the Companion |
| Saved exports as engineering documents, bill of materials proposals, drawings on orders, NCRs and inspection plans, review tasks in Projects | The geometry checks and CAD workers (Fly app `cados`, Amsterdam) |
| The company's history of CAD work, notices of failed work | SOLIDWORKS on the person's own computer, the master copy of every model |

## Setting it up, in place (owner, 20 Nov 2026)

Nobody leaves the ERP to set CAD Automation up. The module's Overview (until every step is done) and its Setup tab show
four steps, each done in a small popup on the same page, and ticked from what CAD Automation reports:

1. **Install**: the installer is downloaded through the ERP (`GET /erp/c/<company>/cad/installer`, which reads it from the
   engine with the signed assertion), with its size and SHA-256; no separate CAD Automation sign-in.
2. **Pair**: type the code the Companion shows, check the computer, add it. The Companion's own link
   (`/erp/cad/pair?code=`) opens the same popup over the Computers tab.
3. **Connect your AI assistant**: the connector address with Copy, short steps for Claude or another app, and a live
   wait that turns green when the assistant signs in.
4. **Check it works**: each of the person's computers, online or not, and SOLIDWORKS ready or not, updating by itself.

The ERP's side menu has no link out to CAD Automation's own application any more; where the module is on, the Products
and Engineering tab "CAD Automation" opens it.

## Every page of CAD Automation, in the ERP (owner, 20 Nov 2026)

The owner asked for "all CAD Automation data and details in ERP, not at bizomat.ai/cad", so people manage and watch their
CAD assistance from the ERP, and for every link to bizomat.ai/cad and its pages to go there instead. Where each page went:

| CAD Automation's page | In the ERP (`/erp/c/<company>/cad`) |
| --- | --- |
| Home (`/cad/`, `/cad/dashboard`) | Overview: the set-up steps, the counts, **Start an engineering task** (the task box, example requests to fill it, Copy task, Open Claude, Open ChatGPT, the task copied first) and **Your connection** (SOLIDWORKS, computers, AI assistants, activity), recent work |
| CAD Assistant (`/cad/assistant`) | AI assistants: the connector address, the steps for Claude, ChatGPT and other apps, the connected assistants with Disconnect, prompts to check it works, and **What you can ask** |
| SOLIDWORKS (`/cad/solidworks`) | Computers: the installer (through the ERP), the computers with default and remove, **How CAD Automation connects** (add-in, Companion, cloud MCP, self-hosted, direct link, launcher macro), and **Direct link and manual installation** (the service address, the add-in package through the ERP where the server has one) |
| Tools (`/cad/tools`) | Tools |
| History (`/cad/history`) | History, with each command's steps and result |
| Settings (`/cad/settings`) | Access: the account (the BIZOMAT account; profile and security in the ERP), the person's own private connector address and add-in key, hidden until **Show my keys**, with Show, Copy and Make new (renewals in the company's history, never the key) |
| Admin (`/cad/admin`) | People (computers, AI assistants and commands by person, for owners and administrators) and the console's CAD Automation panel (`/erp/admin/cad`); people and roles are the company's own |
| Documentation (`/cad/docs`), product page (`/cad/overview`) | Setup, and the Knowledge Centre (`/learn/#cad-automation`) |

The private address and add-in key are each person's own: the ERP asks the engine with the signed assertion
(`GET /erp/c/<company>/cad/access`, `POST .../access/private/new`, `.../access/addin-key/new`; needs `operate`, rate
limited, `Cache-Control: no-store`) and keeps neither. The add-in package comes through `GET .../cad/addin-package`.

**Links.** Nothing on the website or in the ERP links CAD Automation's pages any more (`tests/cad-links.test.ts`): the
website's Engineering section, the founder's letter, the AI Search catalogue and the Knowledge Centre's links open
`https://bizomat.ai/erp/cad` (Products and Engineering, then CAD Automation: the person's company, or a choice of
companies); the platform links in every tool and engineering documents open it in the ERP. Only while the module is off
for a company does its Products and Engineering tab still offer CAD Automation's own sign-in (`/cad/login`, never the
root, which a visitor is sent from), its computers and assistant pages; the example company has no CAD Automation and
points to the person's own company.

**Old links and search results** (with `cad_redirect` on; the engine's `docs/ERP-MODULE.md`, "The old pages"): `/cad/`,
`/cad/overview` and `/cad/docs` answer 302 to `/erp/cad` and `/erp/cad/setup` for everyone; `/cad/dashboard`,
`/cad/assistant`, `/cad/solidworks`, `/cad/tools`, `/cad/history` and `/cad/settings` answer 302 to the same section
for a visitor (the ERP signs them in and opens it) and for a signed-in person who works in the ERP; `/cad/admin` sends
the owner to the console's panel; `/cad/login` goes to Sign in with BIZOMAT. The programs keep their addresses (the
connector, its sign-in and consent, the computers' link, the installer, `/cad/healthz`), and `/cad/privacy` stays. The
answers are 302, not 301, because a flag decides them: switching it off is the rollback.

## Flags (Control Centre)

| Flag | Scopes | What it does |
| --- | --- | --- |
| `cad_in_erp` | everyone, stage, company | The module for the company. Off: CAD Automation works as before at `/cad`, by person |
| `cad_redirect` | everyone | The old `/cad` pages answer 302 to the same screen in the ERP: visitors (old links, search results) on every page, signed-in people whose company has the module; `/cad/login` goes to Sign in with BIZOMAT. Off: the old pages again |
| `cad_products` | everyone, stage, company | Save an export to a product revision as a draft engineering document, with where it came from |
| `cad_bom` | everyone, stage, company | Read the open assembly into a bill of materials proposal for a draft revision |
| `cad_manufacturing` | everyone, stage, company | Approved drawings of the revision on manufacturing orders and the shop floor |
| `cad_quality` | everyone, stage, company | Approved drawings on NCRs and inspection plans |
| `cad_projects` | everyone, stage, company | Ask for a review of an engineering document as a task on a Projects and Tasks board |

Each sub-flag acts only where `cad_in_erp` is on too. The module switch for "CAD Automation" (Company settings) and, with
`company_members_v2`, each member's module access and scope for it apply as for every other module.

## How the ERP and CAD Automation trust each other

No new secret. CAD Automation already proves itself to the ERP with its BIZOMAT client secret (`company/id-provider.ts`).

- **ERP to CAD** (`src/worker/cad/client.ts`, `keys.ts`): `Authorization: BIZOMAT-ERP <jws>` on
  `<CAD_URL>/api/erp/v1/<op>`. ES256 with a P-256 key made on first use, its private half encrypted in `system_kv` with
  the settings key (`SETTINGS_ENCRYPTION_KEY`; without it the module answers 503 `CAD_NO_SETTINGS_KEY`), its public half
  at `/company/api/id/jwks`. One minute, a one-time id, bound to the method, path and body, naming the person (BIZOMAT
  id, email, confirmed or not, name), the company, the permissions below and the company's limits. Production's
  `CAD_URL` is `http://cados.internal:8080` (`WORK_CAD_URL` in `fly.website.toml`, Fly's private network). Staging has no
  CAD machine, so the module shows "not reachable" there.
- **CAD to ERP** (`src/worker/cad/sync.ts`): `POST /company/api/id/cad-sync`, client `cad`, once a minute: accounts
  (id, email, confirmed, BIZOMAT id, counts), usage by company, finished runs since the last sync and checksums. The
  answer gives each account its BIZOMAT account, the companies where it may work with CAD Automation, its default
  company, each company's limits and `cad_redirect`.

## Permissions

The company role comes from the ERP; with `company_members_v2` the member's module access and scope for `cad` apply
too, and both must pass (`src/worker/cad/access.ts`).

| Capability | Owner | Admin | Manager | Employee | Read-only |
| --- | --- | --- | --- | --- | --- |
| See computers, history, exports | all | all | all (or team) | own | all |
| Pair computers, run and cancel work | yes | yes | yes | own computers | no |
| Download or save exports (each download recorded) | yes | yes | company setting, default yes | company setting, default no | no |
| Remove other people's computers, disconnect their AI assistants | yes | yes | no | no | no |
| Change who may download | yes | yes | no | no | no |
| Release a revision | the ERP's engineering approver, segregation of duties unchanged | | | | |

Someone else's computer never shows the file open in SOLIDWORKS or its installation folders, and Windows paths in
someone else's error messages read "a file". The example company has no CAD Automation (`CAD_EXAMPLE`).

## AI connections

Each connection works in one company, chosen when the person approves it (the consent page lists the companies where
they may work with CAD Automation). A connection made before keeps working in the person's only company, or their
default, and is bound to it on its next use; with several companies it is refused until the person reconnects and
chooses. The AI assistants screen binds an unbound connection to the current company in one click.

## Fair use (free)

CAD Automation is free. Per company: commands at the same time (5), longest command (600 s), largest file sent to
SOLIDWORKS (32 MB), exports kept (128 MB, one hour each). A platform admin changes the defaults or a company's own in the
console's CAD Automation panel (`/erp/admin/cad`), within fixed bounds; every change is audited.

## ERP connections

- **Products and Engineering (5.1):** an export saved to a product becomes a draft engineering document (or a new
  version of one), checked as every engineering upload is, with its source recorded (`cad_document_sources`: export,
  command, format, SHA-256). It is approved in Documents like any other.
- **Bill of materials (5.2):** "Read the open assembly" asks the person's default computer to read the assembly in
  SOLIDWORKS; the top-level components become a proposal grouped by part file and matched to products by number, then by
  name. Applying adds or sets lines of a draft or in-change revision only (`assertEditable`, no cycles); unmatched lines
  are left out and said so; a released bill of materials is never touched. Materials and sub-assemblies are not read.
- **Manufacturing (5.3) and Quality (5.4):** the approved drawings (files, not CAD references) of the exact revision an
  order builds, an NCR is about or a plan inspects, served through that record so its readers need no access to
  Products.
- **Configure-to-order (5.5):** deferred (owner).
- **Projects (5.6):** a document's "Ask for a review" adds a task, linked back to it, on a board of the company's
  Projects and Tasks workspace that the person may add to.

## Migration (existing CAD accounts)

Nothing is copied and nothing is deleted. At each sync the ERP matches every CAD account to a BIZOMAT account (its
BIZOMAT id, else an email both sides confirmed) and places it: the person's one registered company, else their own
company; several registered companies, or no match, go to the review list (`cad_accounts`). Once the module is on for
that company, CAD Automation moves the account's computers, commands and AI connections without a company into it.
The console's CAD Automation panel shows the migration report (accounts placed and to review, computers, commands and
connections not yet in a company) and lets a platform admin place a reviewed account with a reason (audited).

## Platform admin guide

1. Check `SETTINGS_ENCRYPTION_KEY` and `WORK_CAD_URL` are set in production (they are: the console's panel says
   "Connection from the ERP: Set").
2. With the owner's approval, switch `cad_in_erp` on for the pilot company in the Control Centre, and the sub-flags
   wanted for it.
3. Open the console's CAD Automation panel: the company appears under usage once CAD Automation's next sync arrives;
   place any account in the review list.
4. With the pilot working, switch `cad_in_erp` on for everyone, then `cad_redirect` on (everyone): the old pages then
   open in the ERP for visitors and for people whose company has the module. A signed-in person whose company does not
   have it keeps the old pages.

## Rollback

Switch `cad_redirect` off: the old pages work again at once (CAD Automation follows the ERP's answer within a minute;
an answer older than 15 minutes counts for nothing). Switch `cad_in_erp` off for the company: the module shows the
earlier CAD Automation page, AI connections and computers work as before by person, and nothing is lost: the company
recorded on computers, commands and connections stays, ready for the next time. To go back further, the code is
additive: migration 0037 has a reverse script, and the engine's new columns are ignored by the code before it.

## Tests

- ERP: `apps/work/test/cad.test.ts` (10 tests, a stand-in CAD engine that checks every assertion against the published
  key): flags and isolation between companies, the role matrix and the download setting, members' module access and
  scope, saving an export, bill of materials proposals, the sync and the review list, drawings, the companies list.
- Engine: kevinjogin/bizomat-cad `tests/test_erplink.py` (18 tests, a stand-in ERP with its own key), including the
  person's own keys and the old pages' answers to visitors and signed-in people.
- Website: `tests/cad-links.test.ts` (no link to CAD Automation's pages; the links open the ERP).
