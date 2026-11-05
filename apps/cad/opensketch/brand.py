"""BIZOMAT CAD Automation: the names, links and shared page parts (head, header, footer, logo) every page uses, so the
site reads as one product of the BIZOMAT platform. The look itself is in static/ui/bizomat-tokens.css (the platform's
design tokens, generated from shared/brand/) and static/ui/cados.css (this app's components, mapped to those tokens).

The product was called CADOS by KEVOS until November 2026. Internal names stay as they were for compatibility (the
Python package, OPENSKETCH_* settings, cookies, the add-in's COM ids and file names, the MCP tool names, cados.css):
only what people read changed.

Links to the platform are settings, because its domains go live separately: BIZOMAT_SITE_URL (default
https://bizomat.ai) and BIZOMAT_WORK_URL (default https://work.bizomat.ai).
"""

from __future__ import annotations

import os
from html import escape

from . import bizomat_brand as bz

PLATFORM = "BIZOMAT"
PRODUCT = "CAD Automation"
FULL = "BIZOMAT CAD Automation"
TAGLINE = "AI-powered CAD automation"
HEADLINE = "Turn engineering intent into CAD."
DESCRIPTION = ("BIZOMAT CAD Automation connects your AI assistant to SOLIDWORKS on your own computer. Create, change and "
               "check native parts, assemblies and drawings in plain language.")
WORK_NAME = "Project Management"
REPO_URL = "https://github.com/jogkev-creator/CADOS"
RELEASES_URL = REPO_URL + "/releases"
SUPPORT_URL = REPO_URL + "/issues"


def _url(name: str, default: str) -> str:
    """An https (or http, for a local test) address from a setting; anything else falls back to the default."""
    v = (os.environ.get(name) or "").strip().rstrip("/")
    return v if v.startswith(("https://", "http://")) and " " not in v else default


def site_url() -> str:
    """The BIZOMAT platform website (BIZOMAT_SITE_URL)."""
    return _url("BIZOMAT_SITE_URL", "https://bizomat.ai")


def work_url() -> str:
    """BIZOMAT Project Management (BIZOMAT_WORK_URL)."""
    return _url("BIZOMAT_WORK_URL", "https://work.bizomat.ai")


def site_page(path: str) -> str:
    """A page of the platform website, e.g. site_page("terms") -> https://bizomat.ai/terms/."""
    return site_url() + "/" + (path.strip("/") + "/" if path.strip("/") else "")


def bizomat_svg(cls: str = "bz-wordmark", label: str = "BIZOMAT") -> str:
    """The BIZOMAT wordmark drawn inline (no font needed): navy word, teal connector bar in the B (full colour, for
    light backgrounds). CSS can recolour both parts (.bz-word, .bz-bar)."""
    aria = f'role="img" aria-label="{label}"' if label else 'aria-hidden="true"'
    return (f'<svg class="{cls}" viewBox="{bz.WORDMARK_VIEWBOX}" {aria} focusable="false">'
            f'<path class="bz-word" fill="{bz.NAVY}" fill-rule="evenodd" d="{bz.WORDMARK_PATH}"/>'
            f'<path class="bz-bar" fill="{bz.TEAL}" d="{bz.BAR_PATH}"/></svg>')


def wordmark(href: str = "/") -> str:
    """The BIZOMAT wordmark with the product label "CAD Automation". One link: the product home."""
    return (f'<a class="wordmark" href="{href}" aria-label="{FULL}, home">{bizomat_svg(label="")}'
            f'<span class="product" aria-hidden="true">{PRODUCT}</span></a>')


def head(title: str, description: str = DESCRIPTION, *, path: str = "/", index: bool = False, extra: str = "", base: str = "") -> str:
    """<head> for every page: title ("<Page> | BIZOMAT CAD Automation"), description, sharing cards (absolute when the
    site address is known), icon, fonts and the design system. The canonical address is OPENSKETCH_PUBLIC_URL when it is
    set, so a page served on two host names (OPENSKETCH_ALIAS_HOSTS) names one of them to search engines."""
    base = (os.environ.get("OPENSKETCH_PUBLIC_URL", "").strip() or base or "").rstrip("/")
    img = escape(base + "/ui/og.png")
    full = title if title == FULL or title.endswith("| " + FULL) else f"{title} | {FULL}"
    t, d = escape(full), escape(description)
    robots = "index, follow" if index else "noindex"
    canon = f'<link rel="canonical" href="{escape(base + path)}">' if base and index else ""
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>{t}</title>
<meta name="description" content="{d}"><meta name="robots" content="{robots}"><meta name="theme-color" content="#f7f9fb">
<meta name="application-name" content="{FULL}"><meta name="author" content="{PLATFORM}">
<meta property="og:type" content="website"><meta property="og:site_name" content="{FULL}"><meta property="og:title" content="{t}">
<meta property="og:description" content="{d}"><meta property="og:url" content="{escape(base + path)}"><meta property="og:image" content="{img}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="{FULL}: {escape(HEADLINE)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{t}"><meta name="twitter:description" content="{d}">
<meta name="twitter:image" content="{img}">
<link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/ui/icon-32.png" type="image/png" sizes="32x32"><link rel="apple-touch-icon" href="/ui/icon-180.png">
<link rel="preload" href="/fonts/inter-tight-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/oxanium-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/fonts/fonts.css"><link rel="stylesheet" href="/ui/bizomat-tokens.css"><link rel="stylesheet" href="/ui/cados.css">{canon}{extra}</head>"""


_MENU_ICON = ('<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" '
              'stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>')


# The app's sections: only sections backed by real features (no stored automations: the assistant runs multi-step
# changes with sw_batch).
APP_NAV = [("/dashboard", "Home", "home"), ("/assistant", "CAD Assistant", "assistant"), ("/solidworks", "SOLIDWORKS", "solidworks"),
           ("/tools", "Tools", "tools"), ("/history", "History", "history"), ("/settings", "Settings", "settings")]


def _ecosystem(here: str) -> list[tuple[str, str, bool]]:
    """The BIZOMAT products: (address, name, is this one)."""
    return [(site_url() + "/", "BIZOMAT platform", False), (work_url() + "/", WORK_NAME, False), (here, PRODUCT, True)]


def _eco_menu(here: str) -> str:
    items = "".join(f'<a href="{escape(h)}"' + (' aria-current="true"' if cur else ' rel="noopener"') + f">{name}</a>"
                    for h, name, cur in _ecosystem(here))
    return (f'<details class="menu-eco hide-sm"><summary>{PLATFORM}</summary><div class="menu-panel" role="group" '
            f'aria-label="{PLATFORM} products">{items}</div></details>')


def header(active: str = "", signed_in: bool = False, *, app: bool = False, user: str = "", sign_out: bool = True,
           admin: bool = False) -> str:
    """The site header. Product pages: product links, the BIZOMAT menu, Sign in or Dashboard. App pages: the sections,
    the BIZOMAT menu (the platform, Project Management, CAD Automation), the person and Sign out."""
    def a(href, label, key=""):
        cur = ' aria-current="page"' if key and key == active else ""
        return f'<a href="{href}"{cur}>{label}</a>'

    others = "".join(f'<a href="{escape(h)}" rel="noopener">{name}</a>' for h, name, cur in _ecosystem("/") if not cur)
    if app:
        links = [a(h, label, key) for h, label, key in APP_NAV] + ([a("/admin", "Admin", "admin")] if admin else [])
        end = (_eco_menu("/dashboard") + f'<span class="nav-user hide-sm" id="who">{escape(user)}</span>'
               + ('<a class="btn btn-secondary btn-sm hide-sm" href="/logout" id="signout">Sign out</a>' if sign_out else ""))
        menu_end = others + ('<a class="btn btn-secondary btn-block" href="/logout">Sign out</a>' if sign_out else "")
    else:
        links = [a("/overview#product", "Product", "product"), a("/overview#how", "How it works"), a("/overview#integrations", "Integrations"),
                 a("/overview#download", "Download"), a("/docs", "Documentation", "docs")]
        end = _eco_menu("/") + ('<a class="btn btn-primary btn-sm" href="/dashboard">Dashboard</a>' if signed_in else
                                '<a class="btn btn-ghost btn-sm hide-sm" href="/login">Sign in</a>'
                                '<a class="btn btn-primary btn-sm" href="/dashboard">Get started</a>')
        menu_end = others + ("" if signed_in else '<a class="btn btn-secondary btn-block" href="/login">Sign in</a>')
    menu = (f'<details class="menu"><summary aria-label="Menu">{_MENU_ICON}</summary><nav class="menu-panel" aria-label="Menu">'
            + "".join(links) + menu_end + "</nav></details>")
    return (f'<a class="skip" href="#main">Skip to content</a><header class="site-header{" app-header" if app else ""}"><div class="container">'
            f'{wordmark("/dashboard" if app else "/")}<nav class="nav" aria-label="{PRODUCT if app else "Main"}">{"".join(links)}</nav>'
            f'<div class="nav-end">{end}{menu}</div></div></header>')


def legal_links() -> str:
    """This app's own privacy notice and the platform's privacy, terms and disclaimer."""
    return (f'<a href="/privacy">Privacy</a><a href="{escape(site_page("privacy"))}" rel="noopener">Platform privacy</a>'
            f'<a href="{escape(site_page("terms"))}" rel="noopener">Terms</a>'
            f'<a href="{escape(site_page("disclaimer"))}" rel="noopener">Disclaimer</a>')


def app_footer() -> str:
    """The app's short footer: CAD Automation within the BIZOMAT platform, and the legal pages."""
    return (f'<footer class="app-footer"><div class="container"><span>{FULL}</span>'
            f'<nav aria-label="{PLATFORM}"><a href="{escape(site_url())}/" rel="noopener">bizomat.ai</a>'
            f'<a href="{escape(work_url())}/" rel="noopener">{WORK_NAME}</a><a href="/docs">Documentation</a>'
            f'{legal_links()}<a href="{SUPPORT_URL}" rel="noopener">Support</a></nav></div></footer>')


def footer() -> str:
    site = escape(site_url())
    return f"""<footer class="site-footer"><div class="container"><div class="footer-grid">
<div class="footer-brand">{wordmark()}<p>{escape(DESCRIPTION)} Part of the {PLATFORM} platform.</p></div>
<div><h4>Product</h4><ul><li><a href="/overview#product">Overview</a></li><li><a href="/overview#how">How it works</a></li>
<li><a href="/overview#integrations">Integrations</a></li><li><a href="/overview#security">Security</a></li></ul></div>
<div><h4>Resources</h4><ul><li><a href="/docs">Documentation</a></li><li><a href="/docs#troubleshooting">Troubleshooting</a></li>
<li><a href="/download/solidworks">Download for SOLIDWORKS</a></li><li><a href="{RELEASES_URL}" rel="noopener">All releases</a></li><li><a href="{SUPPORT_URL}" rel="noopener">Support</a></li></ul></div>
<div><h4>{PLATFORM}</h4><ul><li><a href="{site}/" rel="noopener">bizomat.ai</a></li><li><a href="{escape(work_url())}/" rel="noopener">{WORK_NAME}</a></li>
<li><a href="{escape(site_page("proof-of-work"))}" rel="noopener">Proof of work</a></li><li><a href="{REPO_URL}" rel="noopener">Source code</a></li></ul></div></div>
<div class="footer-base"><span>{FULL}. Part of the {PLATFORM} platform.</span>
<nav class="footer-legal" aria-label="Legal">{legal_links()}</nav></div></div></footer>"""


MENU_SCRIPT = """<script>
document.addEventListener('click', (e) => { document.querySelectorAll('details.menu[open], details.menu-eco[open]').forEach((d) => { if (!d.contains(e.target)) d.removeAttribute('open'); }); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('details.menu[open], details.menu-eco[open]').forEach((d) => d.removeAttribute('open')); });
</script>"""


def icon(name: str) -> str:
    """Small line icons (24 x 24, stroke): no icon font, no emoji."""
    p = {
        "spark": '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
        "chat": '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
        "folder": '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/>',
        "monitor": '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>',
        "bolt": '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
        "link": '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
        "shield": '<path d="M12 3 5 6v5.5c0 4.2 2.9 7.9 7 9.5 4.1-1.6 7-5.3 7-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
        "key": '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l2 2M15 8l2 2"/>',
        "arrow-up": '<path d="M12 19V5M6 11l6-6 6 6"/>',
        "check-circle": '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.5 2.5L16 9.5"/>',
        "hand": '<path d="M8 11V5.5a1.5 1.5 0 0 1 3 0V11M11 10V4.5a1.5 1.5 0 0 1 3 0V11M14 10.5V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6.5 7S5 17.5 4 15l-1.5-3.5a1.5 1.5 0 0 1 2.6-1.4L8 13"/>',
        "eye": '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
        "download": '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
        "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
        "check": '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    }[name]
    return (f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" '
            f'stroke-linejoin="round" aria-hidden="true">{p}</svg>')
