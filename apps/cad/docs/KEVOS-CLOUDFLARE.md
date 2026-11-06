# KEVOS Bridge and Cloudflare

## What was inspected

- This repository has no Cloudflare configuration: no tunnel `config.yml`, no credentials, no Workers, D1, Durable
  Objects or Access settings. The only Cloudflare material is `windows/README.md` section 7b (a quick tunnel or a
  dashboard-made tunnel to `http://127.0.0.1:8000`).
- The Cloudflare account itself could not be inspected from the build session (no access to the Cloudflare API).
  Before changing anything there, list what exists: Zero Trust > Networks > Tunnels, Workers and Pages, D1, Access >
  Applications, and the DNS records of your domain. Nothing in this guide deletes or replaces existing services.

## The design, and where Cloudflare fits

The KEVOS gateway (this server) holds the MCP endpoint, sign-in, the device registry, routing, acknowledgments and
results. Each computer's Companion connects out to it over HTTPS; nothing connects in to a computer, and SOLIDWORKS
always runs on the computer itself. So Cloudflare is not in the command path as a service: no Worker, D1 table or
Durable Object is needed, and none is used. Cloudflare's job is the front door of the gateway.

Use one of these.

### A. Gateway hosted on Fly (or any host) with a domain on Cloudflare (recommended)

CAD Automation lives under the BIZOMAT website's address, at `https://bizomat.ai/cad` (fly.toml
`OPENSKETCH_PUBLIC_URL`; `opensketch/canonical.py` serves the prefix). bizomat.ai is in the owner's Cloudflare account.
Until the website's Worker serves the root of bizomat.ai, its records point (DNS only) at this Fly app, which sends
`bizomat.ai/<page>` into `/cad`. Afterwards the record is proxied and the Worker passes `/cad/*` and the root OAuth
metadata of `/cad` (`/.well-known/oauth-protected-resource/cad/...`, `/.well-known/oauth-authorization-server/cad`,
`/.well-known/openid-configuration/cad`) on to this app. `cados.kevos.com`, `cados.fly.dev` and `cad.bizomat.ai` are old
hosts: pages 301 to `bizomat.ai/cad`, programs keep working there. Keep their records.

`cados.kevos.com` itself is a CNAME to `cados.fly.dev`. Run the Domain workflow with that host name
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
2. Proxy on (orange cloud) or off. With the proxy on (bizomat.ai is proxied, so its Worker can serve the website):
   - SSL/TLS mode **Full (strict)**.
   - A Cache Rule: **Bypass cache** for the gateway's paths (the gateway sends `no-store`; this makes it certain). On
     its own hostname, the whole hostname; on bizomat.ai, `/cad*` and the root paths below, so the website's files
     keep their caching.
   - Do not turn on Bot Fight Mode or JavaScript challenges for `/mcp*`, `/solidworks/mcp*`, `/oauth/*`,
     `/.well-known/*` or `/v2/*`, nor (on bizomat.ai) for the same paths under `/cad`: AI apps' servers and the
     Companions are programs and cannot solve challenges.
   - Rate limiting (optional, the gateway has its own): `/v2/devices/pair/start` 20 per IP per hour; `/oauth/register`
     30 per IP per hour; `/login` 20 per IP per 10 minutes (each also under `/cad` on bizomat.ai).
   - The proxy connects to Fly over HTTPS with the hostname's Fly certificate, which Fly renews by itself only while the
     record points straight at Fly. Add the `_acme-challenge` CNAME that `fly certs show <hostname> -a cados` lists
     (validation by DNS), or renewal fails behind the proxy and Cloudflare then refuses the expired certificate (526).
   - Limits that matter and are respected: request bodies (100 MB on Free and Pro plans: the Companion uploads in
     32 MiB chunks) and the 100 s response timeout: long polls are held 25 s, and MCP answers are event streams that
     send a comment every 15 s while a tool waits for SOLIDWORKS (up to 900 s).
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
   `OPENSKETCH_PUBLIC_URL=https://bridge.example.com`, then create the owner account on its website at once.
3. Cloudflare Access (optional, for the website): make an Access application for `bridge.example.com` with your
   identity provider for people, and a second application on the same hostname with a **Bypass** policy for the
   paths `/mcp`, `/mcp/*`, `/solidworks/mcp*`, `/oauth/*`, `/.well-known/*`, `/v2/*`. Those paths have their own
   authentication (OAuth for AI apps, signed device proofs for computers) and are called by programs that cannot sign
   in to Access. Everything else (home page, pairing page) then needs Access and the KEVOS sign-in.
4. Do not use quick tunnels (`trycloudflare.com`): the address changes at every start and breaks every AI connector
   and every paired computer.

### The earlier setup (server on the SOLIDWORKS computer behind a tunnel)

Still works for one computer, but it needs a server running on that PC and a tunnel per PC. With KEVOS Bridge, keep
one gateway (A or B) for all computers and retire per-PC tunnels.

## Never

- Never leave a published gateway without its owner account. Until it exists, the gateway answers only its setup
  page to anyone not on its own machine (no MCP, no pairing, no data), and the first person to fill that page in
  becomes the owner.
- Never put a Companion or add-in endpoint on the internet: they have none. The only listener on a computer is the
  local pipe for that Windows user.
