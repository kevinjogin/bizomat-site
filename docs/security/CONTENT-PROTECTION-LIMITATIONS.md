# Content protection: what it does and what it cannot do

## The deterrent in place

`src/scripts/content-guard.ts`, loaded on every page by `BaseLayout`:

- suppresses the browser's right-click menu on article content (`main`, `article`) and on images, SVG figures, canvases and videos;
- stops images and figures being dragged out of the page;
- ignores Ctrl/Cmd+S (save page), Ctrl/Cmd+U (view source), F12 and Ctrl/Cmd+Shift+I/J/C (developer tools).

It deliberately leaves alone:

- text selection, copy, cut and paste, so readers can quote and take notes;
- printing (Ctrl/Cmd+P and the print menu), because readers print chapters and checklists;
- links, so "open in new tab" and "copy link" keep working;
- every form, input, select, textarea, editable region, code sample, dialog and live result;
- the whole WORKOS `/tools/` area, where users need to work with their own results;
- keyboard navigation, screen readers, browser zoom, touch scrolling and reader modes.

There are no alerts, overlays, redirects, console clearing or debugger traps. Any region can opt out with `data-allow-copy`, and any page with `<html data-content-guard="off">`.

## Why it is not a security control

Everything a browser displays has already been delivered to the visitor's device. Anyone can:

- open developer tools from the browser menu instead of the keyboard;
- disable JavaScript, use reader mode or view the page through a feed reader;
- save the page from the browser menu, print it to PDF or take a screenshot;
- fetch the HTML directly with any HTTP client, as search engines do.

The deterrent only discourages casual copying of imagery and makes the intent clear. It must never be described as protecting content.

## Practical protection that does work

| Measure | Status |
|---|---|
| Copyright notice in the footer of every page ("© year KEVOS®. All rights reserved.") and terms of use covering the site's content | In place |
| Publish only material intended to be public; nothing confidential in `src/`, `public/` or the build | In place; the post-build check blocks keys, `.env` files, SQL dumps, source maps and credential-shaped strings |
| Original diagrams drawn as inline SVG with KEVOS styling, so copies remain recognisable | In place |
| Server-side logic (assistant rules, form handling, Stripe verification) runs in the Worker, not the browser | In place |
| Monitoring for copies (search for distinctive phrases, reverse image search) and takedown notices | Owner process |
| Cloudflare AI crawler controls | Owner decision; see `CLOUDFLARE-SECURITY-CONFIGURATION.md` |

`robots.txt` is a request to well-behaved crawlers, not an access control.

## Content classes

| Class | Examples | Delivery |
|---|---|---|
| Public | Website pages, READOS books, WORKOS tools, published diagrams | Static, indexed, deterrent applied |
| Registered-user | None today | Would need real authentication on the server, not hidden URLs |
| Internal-only | `docs/` handoffs and inventories, audit notes, brand sources | Repository only; never copied into `dist/` |
| Never published | Worker secrets, API tokens, contact submissions, customer data, private working files | Worker secrets or owner systems only; enquiries are emailed and not stored by the site |

Valuable downloads that should not be freely redistributed would need authenticated or time-limited delivery from the Worker, with the file kept out of `public/`. No such downloads exist today.
