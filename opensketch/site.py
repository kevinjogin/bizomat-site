"""The public pages of CADOS by KEVOS: the product page (/ for visitors, /overview for everyone) and the
documentation (/docs). Plain server-rendered HTML on the shared design system (brand.py, static/ui/cados.css).

Every claim here is checked against the code: the tools in sw_tools.py, the feature registry, the sign-in in
auth.py and mcpauth.py, the computer link in devicebridge.py. Keep it that way when either changes.
"""

from __future__ import annotations

from . import brand
from .brand import icon

# An illustration of one request (real tool names, a plate drawn in isometric): not a screenshot.
PART_SVG = """<svg class="part-svg" viewBox="0 0 352 206" role="img" aria-label="Isometric view of a rectangular plate with four holes">
<g stroke="#16181D" stroke-width="1.2" stroke-linejoin="round">
<path d="M46.1 76 202 166 202 190 46.1 100Z" fill="#ECE8E2"/><path d="M202 166 305.9 106 305.9 130 202 190Z" fill="#F3F0EB"/>
<path d="M150 16 305.9 106 202 166 46.1 76Z" fill="#FFFFFF"/></g>
<g fill="#FEF3EA" stroke="#F47B20" stroke-width="1.4"><ellipse cx="150" cy="34" rx="10" ry="5.8"/><ellipse cx="274.7" cy="106" rx="10" ry="5.8"/>
<ellipse cx="202" cy="148" rx="10" ry="5.8"/><ellipse cx="77.3" cy="76" rx="10" ry="5.8"/></g>
<g stroke="#8A909A" stroke-width=".9" fill="none"><path d="M210 194 313.9 134M206 192 214 196.5M309.9 132 317.9 136.5"/>
<path d="M38.1 104 194 194M42.1 102 34.1 106.5M198 192 190 196.5"/></g>
<g font-family="ui-monospace,Menlo,Consolas,monospace" font-size="11" fill="#4A4F59"><text x="268" y="174">60</text><text x="98" y="164">40</text></g></svg>"""

PREVIEW = f"""<figure class="preview" aria-label="Example: an AI assistant building a part in SOLIDWORKS through CADOS">
<div class="preview-bar"><span>AI assistant &rarr; CADOS &rarr; SOLIDWORKS</span><span>Example session</span></div>
<div class="preview-body"><div class="preview-pane"><div class="pane-label">Your AI assistant</div>
<div class="msg">Make a 60 x 40 x 8 mm mounting plate with four M5 clearance holes, 6 mm in from each corner.</div>
<ol class="calls" aria-label="CADOS tools used"><li>sw_status <span>connected</span></li><li>sw_create_document <span>Plate.SLDPRT</span></li>
<li>sw_add_features <span>4 features checked</span></li><li>sw_preview <span>isometric</span></li></ol></div>
<div class="preview-pane"><div class="pane-label">SOLIDWORKS on your computer</div>
<ul class="tree" aria-label="Feature tree"><li><i></i>Plate.SLDPRT</li><li style="--d:1"><i></i>Front Plane</li><li style="--d:1"><i></i>Top Plane</li>
<li class="new" style="--d:1"><i></i>Boss-Extrude1</li><li class="new" style="--d:1"><i></i>Cut-Extrude1</li></ul>{PART_SVG}</div></div>
<figcaption class="sr-only">An illustration of one request. The tool names are the real CADOS tools.</figcaption></figure>"""

VALUE = [
    ("spark", "AI-assisted CAD operations",
     "Your assistant creates sketches, features, assemblies and drawings through the SOLIDWORKS API. The results are "
     "native features you can edit like any other."),
    ("chat", "Engineering in plain language",
     "Describe the part, the change or the check. CADOS turns it into dimensioned operations and reports what it did."),
    ("folder", "Works with your existing files",
     "Open your own parts and assemblies, read their features and dimensions, and change parameters, equations and "
     "drawings."),
    ("monitor", "Runs in your own CAD environment",
     "SOLIDWORKS runs on your computer, with your licence and your templates. Your model files are saved there."),
    ("bolt", "Less repetitive work",
     "Batches of features, standard fasteners, drawings with standard views and exports, in one request instead of "
     "many clicks."),
    ("link", "One connected workflow",
     "One account links your AI assistant, your computers and their CAD sessions, with live status you can see."),
]

CAPS = [
    ("Parts", "Sketches with relations and dimensions, solved before they reach SOLIDWORKS; over-defined sketches are "
              "refused. Extrude, revolve, sweep, loft, hole, fillet, chamfer, shell, draft, mirror, linear and circular "
              "patterns, reference planes."),
    ("Assemblies", "Insert components, add mates, find mate candidates and check interference. ISO screws, nuts, "
                   "washers and ball bearings made to size."),
    ("Drawings", "Native .SLDDRW drawings with standard or named views, preferred scales, model dimensions and title "
                 "block fields. Add section, detail and projected views, notes and a bill of materials."),
    ("Inspection", "Read the feature tree, sketches and dimensions. Measure faces, edges and points, inspect the "
                   "design and take preview images."),
    ("Parameters", "Set global variables and equations, so a design stays driven by the values that matter."),
    ("Files", "Import STEP, IGES and Parasolid files. Export STEP, STL, Parasolid, IGES, PDF, DWG and DXF. Save and "
              "save as."),
    ("Control", "Undo, delete, follow a long command's progress and cancel it. A guided self test checks each "
                "computer."),
    ("Several computers", "Pair more than one computer, set a default, and tell the assistant which one to use."),
]

SECURITY = [
    ("arrow-up", "Outbound connections only",
     "Your computer connects out to the CADOS service over HTTPS. It opens no ports and accepts no incoming "
     "connections."),
    ("key", "Signed-in AI assistants",
     "Assistants sign in with OAuth 2.1 and PKCE. You approve each one on a consent page and can disconnect it at any "
     "time."),
    ("shield", "A key for each computer",
     "Pairing makes a key in the Windows key store, on the TPM where there is one. It cannot be exported. Every "
     "request from the computer is signed with it."),
    ("check-circle", "Signed commands",
     "The CADOS service signs every command. The computer checks the signature before SOLIDWORKS sees anything."),
    ("hand", "You confirm destructive changes",
     "Deleting features, undoing, overwriting a file or replacing a drawing asks you in SOLIDWORKS first. No answer "
     "means no."),
    ("eye", "Clear about what passes through",
     "Commands, results and short-lived geometry copies used for checks pass through the CADOS service. Your model "
     "files stay on your computer."),
]


def _section_head(eyebrow: str, title: str, text: str = "", id_: str = "") -> str:
    return (f'<div class="section-head"><span class="eyebrow">{eyebrow}</span><h2 id="{id_}-title">{title}</h2>'
            + (f"<p>{text}</p>" if text else "") + "</div>")


def landing(signed_in: bool = False, base: str = "") -> bytes:
    value = "".join(f'<article class="card feature"><div class="icon">{icon(i)}</div><h3>{t}</h3><p>{d}</p></article>'
                    for i, t, d in VALUE)
    caps = "".join(f'<div class="cap"><h3>{t}</h3><p>{d}</p></div>' for t, d in CAPS)
    sec = "".join(f'<div class="sec">{icon(i)}<div><h3>{t}</h3><p>{d}</p></div></div>' for i, t, d in SECURITY)
    start = "/dashboard"
    html = f"""{brand.head("CADOS by KEVOS | AI-powered CAD automation", path="/", index=True, base=base)}<body>
{brand.header("product", signed_in)}
<main id="main">
<section class="hero"><div class="container hero-grid">
<div><span class="eyebrow">{brand.TAGLINE}</span><h1>{brand.HEADLINE}</h1>
<p class="lead">Connect your AI assistant to your CAD environment. Create, modify and automate engineering models in
natural language, while your design files stay in your own workflow.</p>
<div class="hero-cta"><a class="btn btn-primary btn-lg" href="{start}">Get started {icon("arrow-right")}</a>
<a class="btn btn-secondary btn-lg" href="#how">How it works</a></div>
<div class="hero-meta"><span>{icon("check")}Native SOLIDWORKS features</span><span>{icon("check")}Standard MCP connector</span>
<span>{icon("check")}Your files stay on your computer</span></div></div>
<div>{PREVIEW}</div></div></section>

<section class="section" id="product" aria-labelledby="product-title"><div class="container">
{_section_head("Why CADOS", "Engineering intent in, native CAD out.",
               "AI assistants are good at understanding what you mean. CADOS gives them a safe, checked way to act on it "
               "in the CAD software your team already uses.", "product")}
<div class="grid grid-3">{value}</div></div></section>

<section class="section section-warm" id="how" aria-labelledby="how-title"><div class="container">
{_section_head("How it works", "Three parts, one connection.",
               "Your assistant talks to the CADOS service. A small Windows app on your CAD computer holds a secure link "
               "to it and hands each command to SOLIDWORKS.", "how")}
<div class="flow" role="img" aria-label="Your AI assistant connects to the CADOS service over HTTPS with OAuth. Your computer connects out to the CADOS service with signed requests. The KEVOS Companion passes commands to the CADOS add-in in SOLIDWORKS.">
<div class="node"><div class="where">Cloud</div><h3>Your AI assistant</h3><p>Claude, ChatGPT or another app that supports MCP connectors.</p></div>
<div class="link" aria-hidden="true"><span>HTTPS<br>OAuth 2.1</span></div>
<div class="node node-brand"><div class="where">CADOS service</div><h3>CADOS gateway</h3><p>Sign-in, your computers, command routing and checks.
Every sketch is solved and every feature checked before it is sent.</p></div>
<div class="link" aria-hidden="true"><span>Outbound HTTPS<br>signed</span></div>
<div class="node"><div class="where">Your computer</div><h3>CADOS on Windows</h3>
<ul><li>KEVOS Companion: secure link, pairing, status</li><li>CADOS add-in: runs each command</li><li>SOLIDWORKS: your files, your licence</li></ul></div></div>
<ol class="grid grid-3 steps" style="margin-top:var(--s-7)">
<li><h3>Install CADOS</h3><p>Install it on the Windows computer that runs SOLIDWORKS, and pair that computer with your account.</p></li>
<li><h3>Connect your AI assistant</h3><p>Add the CADOS connector address to your assistant and sign in once.</p></li>
<li><h3>Work in your CAD environment</h3><p>Ask for parts, changes, drawings and checks. Watch them appear in SOLIDWORKS.</p></li></ol>
</div></section>

<section class="section" id="integrations" aria-labelledby="integrations-title"><div class="container">
{_section_head("Integrations", "Built on open standards, connected to the tools you use.",
               "CADOS uses the Model Context Protocol, the open standard AI assistants use to reach tools.", "integrations")}
<div class="grid grid-4">
<article class="card integration"><header><span class="kind">CAD</span><span class="badge badge-ok">Supported</span></header>
<h3>SOLIDWORKS</h3><p>Parts, assemblies and drawings through the SOLIDWORKS API, in your own installation.</p>
<div class="meta">Windows, 64-bit. Built for SOLIDWORKS 2022 and later.</div></article>
<article class="card integration"><header><span class="kind">AI assistant</span><span class="badge">MCP connector</span></header>
<h3>Claude</h3><p>Add CADOS as a custom connector and sign in. Claude Desktop can also use a private address.</p>
<div class="meta">Uses OAuth sign-in.</div></article>
<article class="card integration"><header><span class="kind">AI assistant</span><span class="badge">MCP connector</span></header>
<h3>ChatGPT</h3><p>Add CADOS as a custom connector where your ChatGPT plan allows custom connectors.</p>
<div class="meta">Uses OAuth sign-in.</div></article>
<article class="card integration"><header><span class="kind">AI assistant</span><span class="badge">MCP</span></header>
<h3>Other MCP clients</h3><p>Any client that supports remote MCP servers over Streamable HTTP, with OAuth or a private address.</p>
<div class="meta">Standard protocol, no plug-in needed.</div></article></div>
<p class="small muted" style="margin-top:var(--s-5)">SOLIDWORKS is the CAD integration available today. CADOS is in early
access: the integration is being validated on more SOLIDWORKS installations.</p></div></section>

<section class="section section-warm" id="features" aria-labelledby="features-title"><div class="container">
{_section_head("Capabilities", "What your assistant can do in SOLIDWORKS.",
               "Each capability is a CADOS tool your assistant calls. Sketches are solved and features checked before "
               "SOLIDWORKS builds them.", "features")}
<div class="caps">{caps}</div></div></section>

<section class="section" id="security" aria-labelledby="security-title"><div class="container">
{_section_head("Security and architecture", "Clear about what runs where.",
               "SOLIDWORKS and your files stay on your computer. The CADOS gateway is a hosted service that signs you "
               "in, routes commands and checks them. CADOS is not a local-only product, and it does not pretend to be.",
               "security")}
<div class="grid grid-3">{sec}</div>
<p style="margin-top:var(--s-6)"><a href="/privacy">Read the privacy notice</a> &middot; <a href="/docs#security">Security details</a></p>
</div></section>

<section class="section section-warm" id="start" aria-labelledby="start-title"><div class="container">
{_section_head("Getting started", "Up and running in five steps.", "", "start")}
<ol class="grid grid-2 steps">
<li><h3>Install CADOS on your CAD computer</h3><p>Run the Windows installer on the computer that runs SOLIDWORKS.</p></li>
<li><h3>Open SOLIDWORKS and activate CADOS</h3><p>Pair the computer with your account. The KEVOS tab appears in SOLIDWORKS.</p></li>
<li><h3>Connect your AI assistant</h3><p>Copy the connector address from your dashboard into your assistant and sign in.</p></li>
<li><h3>Verify the connection</h3><p>Your dashboard shows each part of the connection live.</p></li>
<li><h3>Run the guided self test</h3><p>One prompt checks sketches, features, an assembly and a drawing on that computer.</p></li></ol>
<div class="cta-band" style="margin-top:var(--s-7)"><div><h2>Bring your AI assistant into SOLIDWORKS.</h2>
<p>Sign in to your dashboard for the installer, your connector address and live status.</p></div>
<div class="actions"><a class="btn btn-primary btn-lg" href="{start}">Get started</a><a class="btn btn-secondary btn-lg" href="/docs">Read the documentation</a></div></div>
</div></section>
</main>
{brand.footer()}{brand.MENU_SCRIPT}</body></html>"""
    return html.encode()


def docs(signed_in: bool = False, base: str = "") -> bytes:
    toc = [("overview", "Overview"), ("requirements", "Requirements"), ("install", "Install"), ("pair", "Pair a computer"),
           ("activate", "Activate in SOLIDWORKS"), ("connect", "Connect your AI assistant"), ("auth", "Authentication"),
           ("verify", "Verify the connection"), ("selftest", "Run the self test"), ("computers", "Several computers"),
           ("troubleshooting", "Troubleshooting"), ("security", "Security"), ("manual", "Install without the installer")]
    toc_html = "".join(f'<li><a href="#{k}">{v}</a></li>' for k, v in toc)
    trouble = [
        ("No KEVOS icon in the taskbar after signing in to Windows", "Start the KEVOS Companion from the Start menu. In its tray menu, tick Start with Windows."),
        ("The Companion says Not registered", "The computer is not paired. Open the tray menu and choose Pair this computer."),
        ("The Companion says the computer was removed", "It was removed from your account. Pair it again; it gets a new key."),
        ("The Companion says Offline, retrying", "It cannot reach the CADOS service. Check that the service address opens in a browser. Behind a company proxy, allow that address. The Companion retries by itself."),
        ("A signed request is refused with TOKEN_EXPIRED", "The computer's clock is wrong. Turn on automatic time in Windows Settings."),
        ("Connected, SOLIDWORKS closed", "This is normal. Open SOLIDWORKS."),
        ("Waiting for the KEVOS add-in", "In SOLIDWORKS, open Tools > Add-Ins and tick KEVOS under Active and Start Up. Do not run SOLIDWORKS as administrator."),
        ("No KEVOS tab or menu in SOLIDWORKS", "As above. If it is still missing, repair the installation from Windows Settings > Apps."),
        ("The assistant says several computers are connected", "Name the computer in your request, or set a default computer on your dashboard."),
        ("The assistant says SOLIDWORKS has a dialog box open", "Close the dialog box in SOLIDWORKS, then ask again."),
        ("The assistant says a sketch is open for editing", "Exit the sketch in SOLIDWORKS, then ask again."),
        ("The assistant says the person at this computer declined", "A destructive change was declined, or nobody answered within two minutes. Ask again and choose Allow once."),
        ("The assistant says it is still working", "Long operations finish by themselves. The assistant can follow them with sw_command_status."),
        ("The assistant cannot sign in to CADOS", "Remove the connector in your assistant and add it again. If it still fails, use the private address from your dashboard."),
    ]
    rows = "".join(f"<tr><td>{a}</td><td>{b}</td></tr>" for a, b in trouble)
    html = f"""{brand.head("Documentation", "Install CADOS, connect your AI assistant to SOLIDWORKS, verify the connection and fix common problems.", path="/docs", index=True, base=base)}<body>
{brand.header("docs", signed_in)}
<main id="main"><div class="doc-hero"><div class="container"><span class="eyebrow">Documentation</span><h1>Set up CADOS</h1>
<p>Install CADOS on your CAD computer, connect your AI assistant and check that everything works. Most people are done in
about fifteen minutes.</p></div></div>
<div class="container doc-layout"><nav class="toc" aria-label="On this page"><h4>On this page</h4><ol>{toc_html}</ol></nav>
<article class="prose">

<section id="overview"><h2>Overview</h2>
<p>CADOS connects an AI assistant to SOLIDWORKS on your own computer. There are three parts:</p>
<ul><li><b>Your AI assistant</b>, such as Claude or ChatGPT. It calls the CADOS tools.</li>
<li><b>The CADOS gateway</b>, a hosted service. It signs you in, knows your computers, checks each command and routes it.</li>
<li><b>CADOS on your Windows computer</b>: the KEVOS Companion (a small tray app) and the CADOS add-in in SOLIDWORKS. The
Companion holds a secure outbound link to the gateway and hands each command to the add-in, which runs it in SOLIDWORKS.</li></ul>
<p>Nothing connects in to your computer, and SOLIDWORKS always runs there, with your licence and your files.</p></section>

<section id="requirements"><h2>Requirements</h2>
<ul><li>Windows 10 (version 1903 or later) or Windows 11, 64-bit, with .NET Framework 4.8 (included in Windows).</li>
<li>SOLIDWORKS 2022 or later, 64-bit.</li>
<li>A CADOS account. Ask your administrator for an invite, or use an early access code if you were given one.</li>
<li>Administrator approval on the computer once, for the installation.</li>
<li>An AI assistant that supports MCP connectors.</li></ul>
<div class="callout callout-info"><div><b>Early access.</b> The SOLIDWORKS integration is built against the SOLIDWORKS 2022
API and is being validated on more installations. Run the self test on each new computer.</div></div></section>

<section id="install"><h2>Install</h2>
<ol class="steps">
<li><h4>Download the installer</h4><p>Get the Windows installer (<code>KEVOS-Bridge-&lt;version&gt;-x64.msi</code>) from your
<a href="/dashboard">dashboard</a> or the <a href="{brand.RELEASES_URL}" rel="noopener">releases page</a>.</p></li>
<li><h4>Close SOLIDWORKS</h4><p>Save your work and close SOLIDWORKS before you install.</p></li>
<li><h4>Run the installer</h4><p>Open the file and follow the steps. Windows asks for administrator approval once. The
installer adds the CADOS add-in and the KEVOS Companion, registers the add-in with SOLIDWORKS and starts the Companion when
you sign in to Windows. It does not change your CAD files.</p></li></ol>
<p>IT teams can install silently and set the service address for everyone:</p>
<pre class="code">msiexec /i KEVOS-Bridge-&lt;version&gt;-x64.msi /qn GATEWAY_URL=https://cados.kevos.com</pre></section>

<section id="pair"><h2>Pair a computer</h2>
<p>Pairing adds the computer to your account. After an interactive install the KEVOS Companion opens its pairing window
by itself. You can also open it from the tray icon: Pair this computer.</p>
<ol class="steps"><li><h4>Check the address and the name</h4><p>Check the CADOS service address (<code>https://cados.kevos.com</code> unless your organisation runs its own) and the name for this computer, then choose Pair.</p></li>
<li><h4>Sign in</h4><p>Your browser opens CADOS. Sign in with your CADOS account.</p></li>
<li><h4>Confirm the code</h4><p>Check that the page shows the same code as the Companion, then choose Add this computer.</p></li></ol>
<p>The Companion makes a key for this computer in the Windows key store. The key cannot be copied to another computer,
and no password is stored on the computer.</p></section>

<section id="activate"><h2>Activate in SOLIDWORKS</h2>
<p>Open SOLIDWORKS. The CADOS add-in loads by itself and connects to the Companion. You see a <b>KEVOS</b> tab on the
CommandManager and a <b>KEVOS</b> menu. Choose <b>KEVOS status</b> to see the connection and recent activity.</p>
<div class="callout"><div>No KEVOS tab? Open <b>Tools &gt; Add-Ins</b>, tick <b>KEVOS</b> under Active and Start Up, and make
sure SOLIDWORKS is not running as administrator.</div></div></section>

<section id="connect"><h2>Connect your AI assistant</h2>
<p>Your dashboard shows your connector address. It ends in <code>/mcp</code>. Add it to your assistant once.</p>
<h3>Claude</h3><ol><li>Open Settings &gt; Connectors and choose Add custom connector.</li><li>Give it a name, such as CADOS, and paste the connector address.</li>
<li>Choose Connect. CADOS opens: sign in and choose Allow.</li></ol>
<h3>ChatGPT</h3><p>Where your plan allows custom connectors, add a connector with the same address and sign in when CADOS
asks. Your workspace administrator may need to allow custom connectors first.</p>
<h3>Other assistants and Claude Desktop</h3><p>Any client that supports remote MCP servers over Streamable HTTP can use
the connector address. If a client cannot sign in, use the private address on your dashboard (under "Assistant cannot
sign in?"). Treat the private address like a password.</p></section>

<section id="auth"><h2>Authentication</h2>
<div class="table-wrap"><table><thead><tr><th>Who</th><th>How it signs in</th><th>How to revoke</th></tr></thead><tbody>
<tr><td>You</td><td>Email and password, or Google where your administrator turned it on.</td><td>Sign out. An administrator can remove an account.</td></tr>
<tr><td>AI assistants</td><td>OAuth 2.1 with PKCE. You approve each assistant on a CADOS consent page.</td><td>Disconnect it on your dashboard.</td></tr>
<tr><td>Private address</td><td>A secret key in the address itself, for clients without sign-in.</td><td>Make a new address on your dashboard. The old one stops at once.</td></tr>
<tr><td>Your computers</td><td>A pairing code you confirm, then a key held in the Windows key store. Every request is signed.</td><td>Remove the computer on your dashboard.</td></tr>
<tr><td>Direct add-in link</td><td>An add-in key you paste into SOLIDWORKS (only without the installer).</td><td>Make a new key on your dashboard.</td></tr>
</tbody></table></div></section>

<section id="verify"><h2>Verify the connection</h2>
<p>Your dashboard shows the state of each part: <b>Connected</b>, <b>Disconnected</b>, <b>Checking connection</b>,
<b>Installation required</b> or <b>Connection error</b>. It updates every few seconds while the page is open.</p>
<p>Then ask your assistant:</p><div class="prompt"><span>Check the CADOS connection to SOLIDWORKS.</span></div>
<p>It calls <code>sw_status</code> and tells you which computer and which SOLIDWORKS version it reached.</p></section>

<section id="selftest"><h2>Run the self test</h2>
<p>Run the self test once on each new computer. Ask your assistant:</p>
<div class="prompt"><span>Run the SOLIDWORKS self test, all three stages.</span></div>
<p>It makes test parts, an assembly and a drawing in a <code>selftest</code> folder under your Documents, one step at a
time, and reports each step as ok, check or failed with the reason. Close or delete the test files when it is done.</p></section>

<section id="computers"><h2>Several computers</h2>
<p>Install and pair each computer the same way. Each one gets its own key. Your dashboard lists them: set a default or
remove one. When more than one is online, tell your assistant which to use, for example "on DESK-02".</p>
<p><b>New or lost computer:</b> remove the old one on your dashboard. It stops working at once. Then install and pair
the new one. Nothing needs to be copied.</p></section>

<section id="troubleshooting"><h2>Troubleshooting</h2>
<p>Start with the tray icon: right-click it, choose Status, then Copy diagnostics. The diagnostics hold no passwords or keys.</p>
<div class="table-wrap"><table><thead><tr><th>What you see</th><th>What to do</th></tr></thead><tbody>{rows}</tbody></table></div>
<p>Still stuck? <a href="{brand.SUPPORT_URL}" rel="noopener">Contact support</a> with the diagnostics.</p></section>

<section id="security"><h2>Security</h2>
<ul><li><b>Outbound only.</b> The computer connects out over HTTPS. It opens no ports.</li>
<li><b>Signed both ways.</b> The computer signs each request with its own key. The gateway signs each command, and the
computer checks it before SOLIDWORKS sees anything.</li>
<li><b>Local pipe.</b> The Companion and the add-in talk over a named pipe that only your Windows user can open. Remote
connections are refused.</li>
<li><b>Confirmation.</b> Deleting features, undoing, overwriting a file, replacing a drawing or removing a variable asks
you in SOLIDWORKS first. No answer within two minutes means no.</li>
<li><b>Updates.</b> The Companion installs an update only after checking its hash, signature and publisher, and only
when you agree.</li>
<li><b>What passes through the gateway.</b> Commands, results and short-lived geometry copies used to check and measure
your model. Your model files are saved on your computer. See the <a href="/privacy">privacy notice</a>.</li></ul></section>

<section id="manual"><h2>Install without the installer</h2>
<p>For development, or a computer where you cannot run the installer: download the add-in package from your dashboard
(Manual installation), unzip it, run the setup program in the folder and choose Install for me. Then, in SOLIDWORKS,
open KEVOS status and paste the address and the add-in key from your dashboard. This route links one SOLIDWORKS session
directly, without the Companion.</p></section>
</article></div></main>
{brand.footer()}{brand.MENU_SCRIPT}</body></html>"""
    return html.encode()
