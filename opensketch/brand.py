"""CADOS by KEVOS: the names, links and shared page parts (head, header, footer, logos) every page uses, so the site
reads as one product. The look itself is in static/ui/cados.css (design tokens and components).

Internal names stay as they were for compatibility (the Python package, OPENSKETCH_* settings, cookies, the add-in's
COM ids and file names, the MCP tool names): only what people read changed.
"""

from __future__ import annotations

from html import escape

PRODUCT = "CADOS"
PARENT = "KEVOS"
FULL = "CADOS by KEVOS"
TAGLINE = "AI-powered CAD automation"
HEADLINE = "Turn engineering intent into CAD."
DESCRIPTION = ("CADOS connects your AI assistant to SOLIDWORKS on your own computer. Create, change and check native "
               "parts, assemblies and drawings in plain language.")
KEVOS_URL = "https://kevos.com/"
REPO_URL = "https://github.com/jogkev-creator/CADOS"
RELEASES_URL = REPO_URL + "/releases"
SUPPORT_URL = REPO_URL + "/issues"

# The two wordmarks as paths (no font needed). KEVOS: traced from the KEVOS logo. CADOS: built from the same
# letterforms (its C is the KEVOS E without the bar; O and S are the KEVOS O and S).
KEVOS_PATH = ("M10 7L62 7L63 207L266 6L331 6L82 255L73 255L10 194ZM244 156L328 238L266 238L214 186ZM410 4L722 4L723 49L481 49"
              "L453 40L440 33L425 21ZM469 98L699 97L700 142L469 142ZM377 48L427 48L428 192L723 193L723 237L431 237L377 183Z"
              "M768 4L824 5L966 257L909 256ZM1073 7L1135 5L1036 148L1018 167L997 180L962 186L949 185L1058 28ZM1187 4L1428 4"
              "L1485 58L1485 236L1209 236L1153 183L1153 48L1202 48L1205 193L1434 193L1434 50L1258 49L1218 34ZM1546 5L1878 5"
              "L1858 27L1830 43L1808 49L1597 49L1597 94L1812 94L1871 148L1872 236L1546 236L1568 212L1590 196L1610 191L1821 191"
              "L1822 142L1603 141L1546 88Z")
CADOS_PATH = ("M33 4L345 4L346 49L104 49L76 40L63 33L48 21ZM0 48L50 48L51 192L346 193L346 237L54 237L0 183ZM396 237L452 237"
              "L582 4L526 4ZM594 4L650 4L780 237L724 237ZM488 142L688 142L688 186L488 186ZM834 4L1110 4L1166 58L1166 183"
              "L1112 237L834 237ZM883 49L883 192L1117 192L1117 49ZM1250 4L1491 4L1548 58L1548 236L1272 236L1216 183L1216 48"
              "L1265 48L1268 193L1497 193L1497 50L1321 49L1281 34ZM1598 5L1930 5L1910 27L1882 43L1860 49L1649 49L1649 94"
              "L1864 94L1923 148L1924 236L1598 236L1620 212L1642 196L1662 191L1873 191L1874 142L1655 141L1598 88Z")


def kevos_svg(cls: str = "", label: str = "KEVOS") -> str:
    aria = f'role="img" aria-label="{label}"' if label else 'aria-hidden="true"'
    return (f'<svg class="{cls}" viewBox="0 0 1880 260" fill-rule="evenodd" {aria} focusable="false">'
            f'<path d="{KEVOS_PATH}"/></svg>')


def cados_svg(cls: str = "cados", label: str = "CADOS") -> str:
    aria = f'role="img" aria-label="{label}"' if label else 'aria-hidden="true"'
    return (f'<svg class="{cls}" viewBox="0 0 1930 241" fill-rule="evenodd" {aria} focusable="false">'
            f'<path d="{CADOS_PATH}"/></svg>')


def wordmark(href: str = "/") -> str:
    """The CADOS wordmark with its "by KEVOS" endorsement. One link: the product home."""
    return (f'<a class="wordmark" href="{href}" aria-label="CADOS by KEVOS, home">{cados_svg(label="")}'
            f'<span class="by" aria-hidden="true">by {kevos_svg(label="")}</span></a>')


def head(title: str, description: str = DESCRIPTION, *, path: str = "/", index: bool = False, extra: str = "", base: str = "") -> str:
    """<head> for every page: title, description, sharing cards (absolute when the site address is known), icon,
    fonts and the design system."""
    base = (base or "").rstrip("/")
    img = escape(base + "/ui/og.png")
    full = title if title.startswith(PRODUCT) else f"{title} | {FULL}"
    t, d = escape(full), escape(description)
    robots = "index, follow" if index else "noindex"
    canon = f'<link rel="canonical" href="{escape(base + path)}">' if base and index else ""
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>{t}</title>
<meta name="description" content="{d}"><meta name="robots" content="{robots}"><meta name="theme-color" content="#FFFFFF">
<meta name="application-name" content="{FULL}"><meta name="author" content="{PARENT}">
<meta property="og:type" content="website"><meta property="og:site_name" content="{FULL}"><meta property="og:title" content="{t}">
<meta property="og:description" content="{d}"><meta property="og:url" content="{escape(base + path)}"><meta property="og:image" content="{img}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="CADOS by KEVOS: {escape(HEADLINE)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{t}"><meta name="twitter:description" content="{d}">
<meta name="twitter:image" content="{img}">
<link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/ui/icon-32.png" type="image/png" sizes="32x32"><link rel="apple-touch-icon" href="/ui/icon-180.png">
<link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/fonts/fonts.css"><link rel="stylesheet" href="/ui/cados.css">{canon}{extra}</head>"""


_MENU_ICON = ('<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" '
              'stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>')


def header(active: str = "", signed_in: bool = False, *, app: bool = False, user: str = "", sign_out: bool = True) -> str:
    """The site header. Marketing pages: product links, KEVOS, Sign in or Dashboard. App pages: Dashboard,
    Documentation, KEVOS, the person and Sign out."""
    def a(href, label, key="", ext=False):
        cur = ' aria-current="page"' if key and key == active else ""
        extra = ' class="ext" rel="noopener" target="_blank"' if ext else ""
        return f'<a href="{href}"{cur}{extra}>{label}</a>'

    if app:
        links = [a("/dashboard", "Dashboard", "dashboard"), a("/docs", "Documentation", "docs"), a("/overview", "Product", "product"),
                 a(KEVOS_URL, "KEVOS", ext=True)]
        end = (f'<span class="nav-user hide-sm" id="who">{escape(user)}</span>'
               + ('<a class="btn btn-secondary btn-sm hide-sm" href="/logout" id="signout">Sign out</a>' if sign_out else ""))
        menu_end = '<a class="btn btn-secondary btn-block" href="/logout">Sign out</a>' if sign_out else ""
    else:
        links = [a("/overview#product", "Product", "product"), a("/overview#how", "How it works"), a("/overview#integrations", "Integrations"),
                 a("/overview#download", "Download"), a("/docs", "Documentation", "docs"), a(KEVOS_URL, "KEVOS", ext=True)]
        end = ('<a class="btn btn-primary btn-sm" href="/dashboard">Dashboard</a>' if signed_in else
               '<a class="btn btn-ghost btn-sm hide-sm" href="/login">Sign in</a>'
               '<a class="btn btn-primary btn-sm" href="/dashboard">Get started</a>')
        menu_end = ("" if signed_in else '<a class="btn btn-secondary btn-block" href="/login">Sign in</a>')
    menu = (f'<details class="menu"><summary aria-label="Menu">{_MENU_ICON}</summary><nav class="menu-panel" aria-label="Menu">'
            + "".join(links) + menu_end + "</nav></details>")
    return (f'<a class="skip" href="#main">Skip to content</a><header class="site-header"><div class="container">'
            f'{wordmark("/dashboard" if app else "/")}<nav class="nav" aria-label="Main">{"".join(links)}</nav>'
            f'<div class="nav-end">{end}{menu}</div></div></header>')


def footer() -> str:
    return f"""<footer class="site-footer"><div class="container"><div class="footer-grid">
<div class="footer-brand">{wordmark()}<p>{escape(DESCRIPTION)} A product from KEVOS.</p></div>
<div><h4>Product</h4><ul><li><a href="/overview#product">Overview</a></li><li><a href="/overview#how">How it works</a></li>
<li><a href="/overview#integrations">Integrations</a></li><li><a href="/overview#security">Security</a></li></ul></div>
<div><h4>Resources</h4><ul><li><a href="/docs">Documentation</a></li><li><a href="/docs#troubleshooting">Troubleshooting</a></li>
<li><a href="/download/solidworks">Download for SOLIDWORKS</a></li><li><a href="{RELEASES_URL}" rel="noopener">All releases</a></li><li><a href="{SUPPORT_URL}" rel="noopener">Support</a></li></ul></div>
<div><h4>Company</h4><ul><li><a href="{KEVOS_URL}" rel="noopener">KEVOS</a></li><li><a href="/privacy">Privacy</a></li>
<li><a href="{REPO_URL}" rel="noopener">Source code</a></li></ul></div></div>
<div class="footer-base"><span>CADOS by KEVOS. A product from KEVOS.</span>
<a href="{KEVOS_URL}" rel="noopener" aria-label="KEVOS website">{kevos_svg("", label="")}<span>kevos.com</span></a></div></div></footer>"""


MENU_SCRIPT = """<script>
document.addEventListener('click', (e) => { document.querySelectorAll('details.menu[open]').forEach((d) => { if (!d.contains(e.target)) d.removeAttribute('open'); }); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('details.menu[open]').forEach((d) => d.removeAttribute('open')); });
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
