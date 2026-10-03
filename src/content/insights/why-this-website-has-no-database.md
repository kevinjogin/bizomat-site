---
title: "Why this website has no database"
description: "The GoCore website is static: plain files, generated in advance and served from the edge. Why we chose that, and what we gave up in return."
publishDate: 2026-10-01
category: "Technology"
tags:
  - systems
  - design
  - strategy
author: "GoCore"
featured: false
draft: false
---

The website you are reading has no database, no server-side application and no admin login. Every page is generated in advance as a plain file and served from Cloudflare's network.

That was a deliberate choice, and it says something about how GoCore prefers to build things in general.

## The simplest system that does the job

A business website needs to publish pages, show articles, accept enquiries and be easy to update. It does not need to create pages on the fly for every visitor.

A static site does that job with far fewer moving parts. Articles are written as text files. A build step turns them into finished pages. Those pages are copied to a hosting network that serves them close to the reader. There is nothing running in between that has to be patched, monitored or scaled.

Fewer moving parts brings practical benefits:

- **Security.** There is no admin panel to break into and no database to leak.
- **Speed.** Pages are ready before anyone asks for them.
- **Cost.** Static hosting is inexpensive, and often free at this scale.
- **Durability.** The content is a folder of text files under version control. It can be moved, backed up or rebuilt elsewhere without a migration project.

## What we gave up

Every design decision trades something away. A static site has no visual editor in the browser, so publishing means editing a file and letting the site rebuild. Anything that genuinely needs a server, such as the contact form, has to be handled by a small, separate function.

For GoCore today, those trade-offs are worth it. The publishing process is a little more technical, and in return the whole system is easier to understand and much harder to break.

## A pattern, not just a website

The same thinking applies well beyond websites. When a problem can be solved by a simple, well-understood system, that is usually the right place to start. Complexity is easy to add and difficult to remove, so it should arrive only when the problem demands it.

If GoCore outgrows this approach, the content can move with it. That flexibility is part of why it was chosen.
