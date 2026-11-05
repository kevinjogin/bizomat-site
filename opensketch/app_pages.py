"""The signed-in CADOS app: Home, CAD Assistant, SOLIDWORKS, Tools, History and Settings (brand.APP_NAV).

Server-rendered shells on the shared design system (brand.py, static/ui/cados.css); one script, static/ui/app.js,
fills them from the same API the earlier single dashboard used (/api/solidworks, /api/devices, /api/sw/key,
/api/connect/new_address, /api/account/apps/<id>) plus /api/commands for History. Only real features are shown:
there is no Automation section because CADOS keeps no stored automations (the assistant runs multi-step changes as
one checked step with sw_batch, listed under Tools).
"""

from __future__ import annotations

from html import escape

from . import brand, catalog
from .brand import icon

TITLES = {"home": "Home", "assistant": "CAD Assistant", "solidworks": "SOLIDWORKS", "tools": "Tools", "history": "History",
          "settings": "Settings", "admin": "Admin"}
PATHS = {"home": "/dashboard", "assistant": "/assistant", "solidworks": "/solidworks", "tools": "/tools", "history": "/history",
         "settings": "/settings", "admin": "/admin"}


def _shell(page: str, body: str, base: str = "", admin: bool = False) -> bytes:
    title = "Dashboard" if page == "home" else TITLES[page]
    return (brand.head(title, path=PATHS[page], base=base) + f'<body data-page="{page}">' + brand.header(page, app=True, admin=admin)
            + f'<main class="app-page" id="main"><div class="container">{body}'
            + '<div class="callout callout-err" id="err" role="alert" hidden style="margin-top:var(--s-5)"></div></div></main>'
            + brand.app_footer() + '<script src="/ui/app.js" defer></script>' + brand.MENU_SCRIPT + "</body></html>").encode()


def _status_pill() -> str:
    return ('<div class="status" id="state" data-state="checking" role="status" aria-live="polite"><span class="dot"></span>'
            '<span id="state-t">Checking connection</span></div>')


def _copy_field(id_: str, label: str, secret: bool = False, hint: str = "") -> str:
    kind = ' type="password" autocomplete="off"' if secret else ""
    show = (f'<button class="btn" type="button" data-toggle="{id_}" aria-controls="{id_}" aria-pressed="false">Show</button>'
            if secret else "")
    return (f'<div class="field"><label class="field-label" for="{id_}">{label}</label><div class="input-group">'
            f'<input class="input" id="{id_}" readonly{kind}>{show}<button class="btn" type="button" data-copy="{id_}">Copy</button>'
            f'</div>{f"<span class=field-hint>{hint}</span>" if hint else ""}</div>')


# ----------------------------------------------------------------------------- Home

def home(base: str = "", admin: bool = False) -> bytes:
    chips = "".join(f'<button class="chip" type="button" data-example="{escape(examples[0], quote=True)}">{escape(group)}</button>'
                    for group, examples in catalog.EXAMPLES)
    body = f"""<div class="app-title home-hero"><div><span class="eyebrow">CADOS by KEVOS</span><h1>Engineering, made intelligent.</h1>
<p>CAD automation and AI-powered engineering workflows, connected to SOLIDWORKS.</p></div>{_status_pill()}</div>
<div class="callout callout-warn" id="update" hidden style="margin-bottom:var(--s-5)"></div>
<section class="panel" id="newpw" hidden aria-labelledby="newpw-h" style="margin-bottom:var(--s-5)"><div class="panel-head"><h2 id="newpw-h">Your CADOS password</h2>
<p>The password CADOS made for you. Save it now: it is shown only this once. Use it to sign in and in the KEVOS Companion's pairing window.</p></div>
<div class="panel-body">{_copy_field("newpw-v", "Password", secret=True)}
<div class="actions"><button class="btn btn-primary btn-sm" type="button" id="newpw-ok">I saved it</button>
<a class="small" href="/settings#password">Change it in Settings</a></div></div></section>
<div class="callout callout-warn" id="ownerpw" hidden style="margin-bottom:var(--s-5)">Your administrator set your password.
<a href="/settings#password">Choose your own in Settings</a>.</div>
<div class="two-col"><div class="stack">
<section class="panel task" aria-labelledby="task-h"><div class="panel-head"><h2 id="task-h">Start an engineering task</h2>
<p>Describe what you need. CADOS works through your AI assistant: copy the task, paste it into an assistant connected to CADOS,
and follow the work in SOLIDWORKS.</p></div>
<div class="panel-body"><label class="sr-only" for="task">Your task</label>
<textarea id="task" placeholder="For example: Make a 60 x 40 x 8 mm mounting plate with four M5 clearance holes, 6 mm in from each corner."></textarea>
<div class="chips" aria-label="Examples">{chips}</div>
<div class="actions"><button class="btn btn-primary" type="button" id="task-copy">{icon("check")}Copy task</button>
<a class="btn btn-secondary" href="https://claude.ai/new" rel="noopener" target="_blank" data-copy-first>Open Claude</a>
<a class="btn btn-secondary" href="https://chatgpt.com/" rel="noopener" target="_blank" data-copy-first>Open ChatGPT</a></div>
<p class="small muted" id="task-note">Your task is copied before the assistant opens. Paste it there.</p>
<div class="callout callout-info" id="no-assistant" hidden><div>No AI assistant is connected yet. <a href="/assistant">Connect one first</a>.</div></div>
</div></section>
<section class="panel" aria-labelledby="recent-h"><div class="panel-head"><h2 id="recent-h">Recent activity</h2><a class="small" href="/history">View history</a></div>
<div class="panel-body"><ul class="list" id="recent" aria-label="Recent commands"></ul>
<p class="empty" id="recent-empty" hidden>No commands yet. Work your assistant does on a paired computer appears here.</p></div></section>
</div>
<div class="stack">
<section class="panel" aria-labelledby="status-h"><div class="panel-head"><h2 id="status-h">Connection</h2></div><div class="panel-body kv-list">
<div class="kv-row"><span class="k">SOLIDWORKS</span><span class="v" id="t-sw">Checking</span></div>
<div class="kv-row"><span class="k">Computers</span><span class="v" id="t-pc">Checking</span></div>
<div class="kv-row"><span class="k">AI assistants</span><span class="v" id="t-ai">Checking</span></div>
<div class="kv-row"><span class="k">Activity</span><span class="v" id="t-work">Idle</span></div></div></section>
<section class="panel" id="setup" aria-labelledby="setup-h"><div class="panel-head"><h2 id="setup-h">Get set up</h2><span class="small muted" id="setup-n"></span></div>
<div class="panel-body"><ol class="checklist">
<li id="ck-install"><span class="tick">1</span><span class="lbl">Install CADOS for SOLIDWORKS</span><a href="/solidworks#install">Install</a></li>
<li id="ck-connect"><span class="tick">2</span><span class="lbl">Open SOLIDWORKS on a paired computer</span><a href="/solidworks#computers">Computers</a></li>
<li id="ck-ai"><span class="tick">3</span><span class="lbl">Connect your AI assistant</span><a href="/assistant#connect">Connect</a></li>
<li id="ck-test"><span class="tick">4</span><span class="lbl">Run the guided self test</span><button class="link-btn small" type="button" id="tried">Mark done</button></li>
</ol></div></section>
</div></div>
<div class="tiles" style="margin-top:var(--s-5)">
<a class="tile" href="/assistant"><span class="tile-k">CAD Assistant</span><strong>Ask for engineering work</strong><span>Connect your assistant and see what you can ask.</span><span class="go">Open</span></a>
<a class="tile" href="/solidworks"><span class="tile-k">SOLIDWORKS</span><strong>Your computers and the add-in</strong><span>Install, pair and check the link.</span><span class="go">Open</span></a>
<a class="tile" href="/tools"><span class="tile-k">Tools</span><strong>Everything CADOS can do</strong><span>Parts, assemblies, drawings, checks and files.</span><span class="go">Open</span></a></div>"""
    return _shell("home", body, base, admin)


# ----------------------------------------------------------------------------- CAD Assistant

def assistant(base: str = "", admin: bool = False) -> bytes:
    groups = "".join(
        f'<div class="example-group"><h3>{escape(g)}</h3>'
        + "".join(f'<div class="example"><span id="ex-{i}-{j}">{escape(t)}</span>'
                  f'<button class="btn btn-secondary btn-sm" type="button" data-copy-text="ex-{i}-{j}">Copy</button></div>'
                  for j, t in enumerate(items))
        + "</div>" for i, (g, items) in enumerate(catalog.EXAMPLES))
    body = f"""<div class="app-title"><div><span class="eyebrow">CAD Assistant</span><h1>Work in SOLIDWORKS by asking.</h1>
<p>Use Claude, ChatGPT or another AI assistant. CADOS gives it the SOLIDWORKS tools, checks every sketch and feature, and runs
the work on your computer. CADOS runs no AI of its own.</p></div></div>
<div class="stack">
<section class="panel" id="connect" aria-labelledby="connect-h"><div class="panel-head"><h2 id="connect-h">Connect your assistant</h2>
<p>Add this address to your assistant once, then sign in to CADOS when it asks.</p></div><div class="panel-body">
{_copy_field("url", "Connector address")}
<div><div class="tabs" role="tablist" aria-label="Instructions for your assistant">
<button type="button" role="tab" id="t-claude" aria-selected="true" aria-controls="p-claude">Claude</button>
<button type="button" role="tab" id="t-chatgpt" aria-selected="false" aria-controls="p-chatgpt" tabindex="-1">ChatGPT</button>
<button type="button" role="tab" id="t-other" aria-selected="false" aria-controls="p-other" tabindex="-1">Other assistants</button></div>
<div class="tab-panel small" role="tabpanel" id="p-claude" aria-labelledby="t-claude" style="margin-top:var(--s-3)"><ol>
<li>Open Settings &gt; Connectors and choose <b>Add custom connector</b>.</li><li>Name it CADOS and paste the connector address.</li>
<li>Choose Connect, sign in to CADOS and choose <b>Allow</b>.</li></ol></div>
<div class="tab-panel small" role="tabpanel" id="p-chatgpt" aria-labelledby="t-chatgpt" hidden style="margin-top:var(--s-3)"><ol>
<li>Where your plan allows custom connectors, add a new connector.</li><li>Paste the connector address.</li>
<li>Sign in to CADOS when asked and choose <b>Allow</b>. Your workspace administrator may need to allow custom connectors first.</li></ol></div>
<div class="tab-panel small" role="tabpanel" id="p-other" aria-labelledby="t-other" hidden style="margin-top:var(--s-3)">
<p>Any app that supports remote MCP servers over Streamable HTTP can use the connector address. If it cannot sign in, use the
private address in <a href="/settings#private">Settings</a>.</p></div></div>
<div><div class="field-label" style="margin-bottom:var(--s-2)">Connected assistants</div><ul class="rows" id="apps" aria-label="Connected AI assistants"></ul>
<p class="empty" id="no-apps" hidden>None yet. An assistant appears here after you choose Allow.</p></div></div></section>
<section class="panel" aria-labelledby="ask-h"><div class="panel-head"><h2 id="ask-h">What you can ask</h2>
<p>Plain requests work. Copy one to try it, or describe your own task on <a href="/dashboard">Home</a>. The full list is under <a href="/tools">Tools</a>.</p></div>
<div class="panel-body"><div class="examples">{groups}</div></div></section>
<section class="panel" aria-labelledby="first-h"><div class="panel-head"><h2 id="first-h">Check it works</h2></div><div class="panel-body">
<div class="prompt"><span id="verify-prompt">Check the CADOS connection to SOLIDWORKS.</span><button class="btn btn-secondary btn-sm" type="button" data-copy-text="verify-prompt">Copy</button></div>
<div class="prompt"><span id="selftest-prompt">Run the SOLIDWORKS self test, all three stages.</span><button class="btn btn-secondary btn-sm" type="button" data-copy-text="selftest-prompt">Copy</button></div>
<ul class="small" style="margin:0"><li>The assistant builds in small checked steps and reads your file before it changes it.</li>
<li>Deleting, undoing and overwriting ask you in SOLIDWORKS first (on by default).</li>
<li>Your model files stay on your computer.</li></ul></div></section>
</div>"""
    return _shell("assistant", body, base, admin)


# ----------------------------------------------------------------------------- SOLIDWORKS

def solidworks(base: str = "", admin: bool = False) -> bytes:
    body = f"""<div class="app-title"><div><span class="eyebrow">SOLIDWORKS</span><h1>Your SOLIDWORKS connection.</h1>
<p>CADOS runs your assistant's work in your own SOLIDWORKS, through a native add-in. Nothing connects in to your computer.</p></div>{_status_pill()}</div>
<div class="callout callout-warn" id="update" hidden style="margin-bottom:var(--s-5)"></div>
<div class="stack">
<section class="panel" id="install" aria-labelledby="install-h"><div class="panel-head"><h2 id="install-h">Install CADOS for SOLIDWORKS</h2>
<p>One Windows installer adds the CADOS add-in to SOLIDWORKS and the KEVOS Companion, which keeps the secure link.</p></div><div class="panel-body">
<div class="actions"><a class="btn btn-primary" href="/download/solidworks">{icon("download")}Download CADOS for SOLIDWORKS</a>
<a class="small" href="/docs#install">Installation guide</a><a class="small" href="/docs#requirements">System requirements</a><a class="small" href="/docs#versions">Supported versions</a></div>
<p class="small muted">Windows 10 or 11, 64-bit. SOLIDWORKS 2022 or later. Early access: the installer is not code-signed yet, so Windows may ask you to confirm it.</p></div></section>
<section class="panel" id="computers" aria-labelledby="pcs-h"><div class="panel-head"><h2 id="pcs-h">Your computers</h2>
<p>After installing, the KEVOS Companion opens a pairing window. Confirm its code here when the browser opens. Then open SOLIDWORKS.</p></div>
<div class="panel-body"><ul class="rows" id="pcs" aria-label="Your computers"></ul><p class="empty" id="no-pcs" hidden>No computer paired yet.</p></div></section>
<section class="panel" aria-labelledby="how-h"><div class="panel-head"><h2 id="how-h">How CADOS connects</h2></div><div class="panel-body">
<div class="table-wrap"><table class="connect-table"><thead><tr><th>Part</th><th>What it is</th></tr></thead><tbody>
<tr><td>CADOS add-in</td><td>A native SOLIDWORKS add-in, listed in Tools &gt; Add-Ins as CADOS, with a CADOS tab, menu and task pane. It runs each command and asks you before destructive changes.</td></tr>
<tr><td>KEVOS Companion</td><td>A small Windows tray app. It pairs the computer with your account and keeps an outbound, signed link to CADOS.</td></tr>
<tr><td>Cloud connection (MCP)</td><td>Your assistant connects to CADOS at the connector address on the <a href="/assistant#connect">CAD Assistant</a> page.</td></tr>
<tr><td>Self-hosted (local MCP)</td><td>Advanced: run the CADOS server on your own Windows computer and connect your assistant to it there. See the <code>windows/</code> folder in the source code.</td></tr>
<tr><td>Direct link</td><td>Without the Companion: one SOLIDWORKS session linked with the service address and your add-in key (below).</td></tr>
<tr><td>Launcher macro</td><td>Not an add-in. It only starts the installed CADOS add-in where SOLIDWORKS does not list add-ins installed without administrator rights.</td></tr>
</tbody></table></div></div></section>
<section class="panel" aria-labelledby="direct-h"><div class="panel-head"><h2 id="direct-h">Direct link and manual installation</h2>
<p>For development or locked-down computers. Most people use the installer above.</p></div><div class="panel-body">
{_copy_field("server", "Service address")}
<p class="small">Your add-in key is in <a href="/settings#addin-key">Settings</a>. In SOLIDWORKS, open <b>CADOS &gt; Status</b> and paste both.</p>
<div class="actions"><a class="btn btn-secondary btn-sm" id="download" href="/api/sw/download">Download the add-in package (.zip)</a>
<span class="small" id="no-download" hidden style="color:var(--err)">The add-in package is not on this server yet.</span></div></div></section>
<p class="small muted">Problems? See <a href="/docs#troubleshooting">Troubleshooting</a>.</p>
</div>"""
    return _shell("solidworks", body, base, admin)


# ----------------------------------------------------------------------------- Tools

def tools(base: str = "", admin: bool = False) -> bytes:
    groups = "".join(
        f'<section class="tool-group" aria-labelledby="tg-{i}"><h2 id="tg-{i}">{escape(g)}</h2><div class="tool-grid">'
        + "".join(f'<div class="tool-card" data-text="{escape((t + " " + n + " " + d).lower(), quote=True)}"><strong>{escape(t)}</strong>'
                  f'<code>{escape(n)}</code><p>{escape(d)}</p></div>' for n, t, d in items)
        + "</div></section>" for i, (g, items) in enumerate(catalog.GROUPS))
    count = sum(len(items) for _, items in catalog.GROUPS)
    body = f"""<div class="app-title"><div><span class="eyebrow">Tools</span><h1>Everything CADOS can do.</h1>
<p>These are the {count} tools your assistant can use in SOLIDWORKS. You do not call them yourself: describe the work, and the
assistant picks the tools.</p></div></div>
<div class="field" style="max-width:420px;margin-bottom:var(--s-6)"><label class="field-label" for="tool-q">Find a tool</label>
<input class="input" id="tool-q" type="search" placeholder="For example: drawing, mate, export" autocomplete="off"></div>
<p class="empty" id="tool-none" hidden>No tool matches. Try a simpler word.</p>
<div class="tool-groups" id="tool-groups">{groups}</div>"""
    return _shell("tools", body, base, admin)


# ----------------------------------------------------------------------------- History

def history(base: str = "", admin: bool = False) -> bytes:
    body = """<div class="app-title"><div><span class="eyebrow">History</span><h1>What your assistant has done.</h1>
<p>Commands sent to your paired computers, newest first: which tool, which computer, which assistant and how it ended.</p></div>
<button class="btn btn-secondary btn-sm" type="button" id="h-refresh">Refresh</button></div>
<section class="panel"><div class="panel-body">
<p class="small muted" id="h-loading">Loading</p>
<div class="table-wrap" id="h-wrap" hidden><table class="history-table"><thead><tr><th>When</th><th>What</th><th>Computer</th><th>Assistant</th><th>Result</th></tr></thead>
<tbody id="h-rows"></tbody></table></div>
<p class="empty" id="h-empty" hidden>No commands yet. When your assistant works on a paired computer, each command appears here.
Commands over the direct link (without the KEVOS Companion) are not recorded.</p></div></section>"""
    return _shell("history", body, base, admin)


# ----------------------------------------------------------------------------- Settings

def settings(base: str = "", admin: bool = False) -> bytes:
    body = f"""<div class="app-title"><div><span class="eyebrow">Settings</span><h1>Account and access.</h1>
<p>Your account, and the two private keys that give access to your CAD connection. Keep both to yourself.</p></div></div>
<div class="stack">
<section class="panel" aria-labelledby="acc-h"><div class="panel-head"><h2 id="acc-h">Account</h2></div><div class="panel-body kv-list">
<div class="kv-row"><span class="k">Name</span><span class="v" id="acc-name">-</span></div>
<div class="kv-row"><span class="k">Email</span><span class="v" id="acc-email">-</span></div>
<div class="actions"><a class="btn btn-secondary btn-sm" href="/logout" id="acc-signout">Sign out</a></div></div></section>
<section class="panel" id="password" aria-labelledby="pw-h"><div class="panel-head"><h2 id="pw-h">Change password</h2>
<p>If your administrator set your password, change it to one only you know. You are signed out everywhere afterwards.</p></div>
<form class="panel-body" id="pw-form" autocomplete="on"><div class="field"><label class="field-label" for="pw-current">Current password</label>
<input class="input" id="pw-current" type="password" autocomplete="current-password" required></div>
<div class="field"><label class="field-label" for="pw-new">New password</label>
<input class="input" id="pw-new" type="password" autocomplete="new-password" minlength="8" required><span class="field-hint">At least 8 characters.</span></div>
<div class="actions"><button class="btn btn-primary btn-sm" type="submit">Change password</button><span class="small" id="pw-msg" role="status"></span></div></form></section>
<section class="panel" id="private" aria-labelledby="priv-h"><div class="panel-head"><h2 id="priv-h">Private connector address</h2>
<p>For assistants that cannot sign in. It works without sign-in, so anyone who has it can use your CAD connection.</p></div><div class="panel-body">
{_copy_field("purl", "Private address", secret=True)}
<div class="actions"><button class="link-btn danger small" type="button" id="newaddr">Make a new private address</button></div></div></section>
<section class="panel" id="addin-key" aria-labelledby="key-h"><div class="panel-head"><h2 id="key-h">Add-in key</h2>
<p>Used only by the direct link (SOLIDWORKS without the KEVOS Companion).</p></div><div class="panel-body">
{_copy_field("key", "Add-in key", secret=True, hint="Making a new key disconnects the direct link until you paste the new one.")}
<div class="actions"><button class="link-btn danger small" type="button" id="newkey">Make a new key</button></div></div></section>
<p class="small muted">Connected assistants are on the <a href="/assistant#connect">CAD Assistant</a> page, your computers on the
<a href="/solidworks#computers">SOLIDWORKS</a> page. How CADOS handles your data: <a href="/privacy">Privacy</a>.</p>
</div>"""
    return _shell("settings", body, base, admin)


# ----------------------------------------------------------------------------- Admin (the owner only)

def admin(base: str = "", admin: bool = True) -> bytes:
    body = f"""<div class="app-title"><div><span class="eyebrow">Admin</span><h1>People on this CADOS server.</h1>
<p>Add people, reset passwords, and see who chose their own password and who has computers and AI assistants
connected. Only you see this page.</p></div></div>
<div class="stack">
<section class="panel" aria-labelledby="add-h"><div class="panel-head"><h2 id="add-h">Add a person</h2>
<p>CADOS fills in a strong password. Keep it or type one, then give it to them with this address. They sign in when
the installer's pairing step opens the browser, and can choose their own password in Settings. Or send an invite link
below, so they choose it from the start.</p></div>
<form class="panel-body" id="add-form" autocomplete="off">
<div class="two-col" style="gap:var(--s-4)"><div class="field"><label class="field-label" for="add-name">Name</label><input class="input" id="add-name"></div>
<div class="field"><label class="field-label" for="add-email">Email</label><input class="input" id="add-email" type="email" required></div></div>
<div class="field"><label class="field-label" for="add-pw">Password</label><div class="input-group">
<input class="input" id="add-pw" type="password" minlength="8" required autocomplete="new-password" spellcheck="false">
<button class="btn" type="button" data-toggle="add-pw" aria-controls="add-pw" aria-pressed="false">Show</button>
<button class="btn" type="button" id="add-gen">New</button><button class="btn" type="button" data-copy="add-pw">Copy</button></div>
<span class="field-hint">At least 8 characters. New makes another strong one.</span></div>
<div class="actions"><button class="btn btn-primary" type="submit">Add person</button><span class="small" id="add-msg" role="status"></span></div>
<div class="callout callout-ok" id="add-done" hidden></div></form></section>
<section class="panel" aria-labelledby="people-h"><div class="panel-head"><h2 id="people-h">People</h2><span class="small muted" id="people-n"></span></div>
<div class="panel-body"><div class="table-wrap"><table class="history-table"><thead><tr><th>Person</th><th>Role</th><th>Password</th><th>Computers</th><th>AI assistants</th><th></th></tr></thead>
<tbody id="people"></tbody></table></div></div></section>
<section class="panel" aria-labelledby="inv-h"><div class="panel-head"><h2 id="inv-h">Invite links</h2>
<p>Or send a link: the person chooses their own password. A link works once, for 7 days.</p></div><div class="panel-body">
<div class="actions"><input class="input" id="inv-note" placeholder="Who it is for (optional)" style="max-width:320px">
<button class="btn btn-secondary btn-sm" type="button" id="inv-new">Make an invite link</button></div>
<div class="field" id="inv-out" hidden><label class="field-label" for="inv-url">Invite link</label><div class="input-group">
<input class="input" id="inv-url" readonly><button class="btn" type="button" data-copy="inv-url">Copy</button></div></div>
<ul class="list" id="invites" aria-label="Unused invite links"></ul></div></section>
<section class="panel" id="server-pw" aria-labelledby="spw-h"><div class="panel-head"><h2 id="spw-h">Server password</h2>
<p>Only you see this. People never need it: they create an account or sign in with their own email and password.
You need it only for the Reset page (a new password for any account).</p></div><div class="panel-body">
{_copy_field("spw", "Server password", secret=True)}<p class="small muted" id="spw-none" hidden>No server password is set on this server.</p></div></section>
<section class="panel" aria-labelledby="signup-h"><div class="panel-head"><h2 id="signup-h">Sign-up</h2></div><div class="panel-body">
<label class="small" style="display:flex;gap:10px;align-items:center"><input type="checkbox" id="open-signup">
Anyone with the address can create an account (off: only people you add or invite)</label></div></section>
</div>"""
    return _shell("admin", body, base, True)


PAGES = {"home": home, "assistant": assistant, "solidworks": solidworks, "tools": tools, "history": history, "settings": settings,
         "admin": admin}
