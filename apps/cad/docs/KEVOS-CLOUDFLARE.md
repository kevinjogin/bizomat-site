# CAD Automation and Cloudflare (written for KEVOS Bridge)

## What was inspected

- This repository has no Cloudflare configuration: no tunnel `config.yml`, no credentials, no Workers, D1, Durable
  Objects or Access settings. The only Cloudflare material is `windows/README.md` section 7b (a quick tunnel or a
  dashboard-made tunnel to `http://127.0.0.1:8000`).
- The Cloudflare account itself could not be inspected from the build session (no access to the Cloudflare API).
  Before changing anything there, list what exists: Zero Trust > Networks > Tunnels, Workers and Pages, D1, Access >
  Applications, and the DNS records of your domain. Nothing in this guide deletes or replaces existing services.

## The design, and where Cloudflare fits

The CAD Automation gateway (this server) holds the MCP endpoint, sign-in, the device registry, routing, acknowledgments and
results. Each computer's Companion connects out to it over HTTPS; nothing connects in to a computer, and SOLIDWORKS
always runs on the computer itself. So Cloudflare is not in the command path as a service: no Worker, D1 table or
Durable Object is needed, and none is used. Cloudflare's job is the front door of the gateway.

Use one of these.

### A. Gateway hosted on Fly (or any host) with a domain on Cloudflare (recommended)

The hosted service uses `cados.kevos.com` (a CNAME to `cados.fly.dev`; the BIZOMAT platform adds `cad.bizomat.ai`). Run the Domain workflow with that host name
(its default) once `kevos.com` is in the Cloudflare account; `deploy.yml` sets `OPENSKETCH_PUBLIC_URL` to it unless the
repository variable `PUBLIC_URL` says otherwise. If `kevos.com` is managed elsewhere, add the same two records there by
hand (step 1 below: the CNAME and the check record Fly asks for after `fly certs add cados.kevos.com -a cados`).

**One click:** the workflow `.github/workflows/domain.yml` does steps 1, 2 and 3 below. Add two repository secrets
(GitHub > the repository > Settings > Secrets and variables > Actions): `CLOUDFLARE_API_TOKEN` (Cloudflare > My
Profile > API Tokens > Create Token > template "Edit zone DNS", zone resources: only your domain) and
`FLY_API_TOKEN` (Fly dashboard > app `cados` > Tokens, or `fly tokens create deploy -a cados`). Then Actions > Domain >
Run workflow, host name `bridge.<your-domain>`. It adds the DNS record (DNS only), asks Fly for the certificate, adds
the validation record Fly asks for, sets the app's `OPENSKETCH_PUBLIC_URL`, and waits until `https://bridge.<your-domain>`
answers. It never replaces another record unless you tick replace_existing. Afterwards set the repository variable
`PUBLIC_URL` to the same address, so later deploys keep it. By hand:

1. DNS: a CNAME `bridge.<your-domain>` to the gateway host (for Fly: `cados.fly.dev`, then `fly certs add
   bridge.<your-domain>` and the DNS check record Fly asks for).
2. Proxy on (orange cloud) or off. With the proxy on:
   - SSL/TLS mode **Full (strict)**.
   - A Cache Rule: **Bypass cache** for the whole hostname (the gateway sends `no-store`; this makes it certain).
   - Do not turn on Bot Fight Mode or JavaScript challenges for `/mcp*`, `/solidworks/mcp*`, `/oauth/*`,
     `/.well-known/*` or `/v2/*`: AI apps' servers and the Companions are programs and cannot solve challenges.
   - Rate limiting (optional, the gateway has its own): `/v2/devices/pair/start` 20 per IP per hour; `/oauth/register`
     30 per IP per hour; `/login` 20 per IP per 10 minutes.
   - Limits that matter and are respected: request bodies (100 MB on Free and Pro plans: the Companion uploads in
     32 MiB chunks) and the 100 s response timeout (long polls are held 25 s).
3. Set `OPENSKETCH_PUBLIC_URL=https://bridge.<your-domain>` on the gateway, so OAuth metadata and pairing links use it.
4. In the MSI, `GATEWAY_URL=https://bridge.<your-domain>`.

### B. Gateway on a company server, published with a named Cloudflare Tunnel

For a company that keeps the gateway inside its network. The gateway runs on one server (as a service is fine: it
does no SOLIDWORKS work); the computers still connect out to it, through the tunnel's public name or directly inside
the network.

1. Zero Trust > Networks > Tunnels > Create a tunnel (cloudflared). Install it on the gateway server as a service:

   ```bash
   cloudflared service install <tunnel-token>
   ```

   Or with a local configuration file (`C:\ProgramData\cloudflared\config.yml` or `/etc/cloudflared/config.yml`):

   ```yaml
   tunnel: <tunnel-id>
   credentials-file: /etc/cloudflared/<tunnel-id>.json
   ingress:
     - hostname: bridge.example.com
       service: http://localhost:8000
       originRequest:
         connectTimeout: 30s
         keepAliveTimeout: 90s
     - service: http_status:404
   ```

2. Public hostname `bridge.example.com` to `http://localhost:8000`. Start the gateway with
   `OPENSKETCH_PUBLIC_URL=https://bridge.example.com` and a server password (`OPENSKETCH_PASSWORD`, or accounts made).
3. Cloudflare Access (optional, for the website): make an Access application for `bridge.example.com` with your
   identity provider for people, and a second application on the same hostname with a **Bypass** policy for the
   paths `/mcp`, `/mcp/*`, `/solidworks/mcp*`, `/oauth/*`, `/.well-known/*`, `/v2/*`. Those paths have their own
   authentication (OAuth for AI apps, signed device proofs for computers) and are called by programs that cannot sign
   in to Access. Everything else (home page, pairing page) then needs Access and the CAD Automation sign-in.
4. Do not use quick tunnels (`trycloudflare.com`): the address changes at every start and breaks every AI connector
   and every paired computer.

### The earlier setup (server on the SOLIDWORKS computer behind a tunnel)

Still works for one computer, but it needs a server running on that PC and a tunnel per PC. With CAD Automation for SOLIDWORKS, keep
one gateway (A or B) for all computers and retire per-PC tunnels.

## Never

- Never publish the gateway without sign-in: set `OPENSKETCH_PASSWORD` (or make accounts) first. A gateway without
  sign-in takes pairing only from its own machine, so no computer can be added to it over the network, but its MCP
  endpoint would still be open.
- Never put a Companion or add-in endpoint on the internet: they have none. The only listener on a computer is the
  local pipe for that Windows user.
