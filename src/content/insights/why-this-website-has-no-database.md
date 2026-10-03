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

The website you are reading has no database. Every page is generated in advance as a plain file and served from Cloudflare's network. The only server-side code is a small function that handles the few jobs that genuinely need one.

That was a deliberate choice, and it says something about how GoCore prefers to build things in general. This article explains how the site works, why it was built this way, what was gained and what was given up, how it is updated, and the broader principle behind it: start with the simplest system that does the job, and add complexity only when the problem demands it.

## How most websites work

Many websites, including most built on popular content management systems, are **dynamic**. When a visitor requests a page, a server runs an application, which queries a database for the content, assembles the page from templates and sends it back. Every visit repeats the process, although caching often reduces the work.

Dynamic sites are flexible. Editors can log in to a browser-based dashboard, write articles and publish them instantly. Plugins add features. For many organisations, they are the right choice.

But they also carry ongoing responsibilities. The application, the database, the server and every plugin need updates, security patches and monitoring. The admin login is a permanent target for automated attacks. The database must be backed up. As traffic grows, the server must keep up.

## How this site works

This site takes a different approach. It is **static**: the pages are built in advance, not on each visit.

In outline:

1. **Content is written as text files.** Each article is a Markdown file containing the text and a few structured details: title, description, date, category and tags.
2. **A build step turns the files into pages.** The site is built with Astro, a web framework that reads the content files, checks that their details are valid, and generates finished HTML pages, a site map, an RSS feed and a search index.
3. **The finished files are deployed to Cloudflare's network.** They are served from locations close to each reader, so pages arrive quickly.
4. **A small function handles the exceptions.** A Cloudflare Worker adds security headers to every response and runs the GoCore Assistant, the chat window in the corner of each page.

Between the build and the reader, nothing is assembled on the fly. The page you are reading existed, complete, before you asked for it.

## The simplest system that does the job

A business website needs to publish pages, show articles, accept enquiries and be easy to update. It does not need to create pages on the fly for every visitor.

A static site does that job with far fewer moving parts. There is nothing running in between that has to be patched, monitored or scaled.

Fewer moving parts brings practical benefits:

- **Security.** There is no database to leak and no admin panel on the website to break into.
- **Speed.** Pages are ready before anyone asks for them, and they are served from close to the reader.
- **Cost.** Static hosting is inexpensive, and often free at this scale.
- **Durability.** The content is a folder of text files under version control. It can be moved, backed up or rebuilt elsewhere without a migration project.
- **Transparency.** Every change to every article is recorded in the version history, with who made it and when.

## How the site is updated

A common objection to static sites is that they are hard to update without technical skills. That used to be largely true. It is less true now.

GoCore's content lives in a Git repository, a standard system for tracking changes to files. Articles can be edited in two ways:

- **Directly, as files.** Anyone comfortable with text files can edit the Markdown and commit the change.
- **Through an online editor.** Pages CMS, a browser-based content editor, presents the articles as forms: title, description, category, tags, text and images. Saving an article in the editor commits the change to the repository.

Sign-in to the editor is handled by GitHub, the service that hosts the repository, rather than by the website itself. The website has no login of its own.

Once a change is committed, the site is rebuilt and redeployed. The build step also checks the content: required details must be present, descriptions must be a sensible length, tags must come from an approved list, and every page must have exactly one main heading and valid links. If a check fails, the problem is caught before it reaches readers.

## Why plain text files

Storing articles as Markdown files may seem old-fashioned, but it has lasting advantages. Markdown is plain text with a few simple conventions: a hash mark for a heading, asterisks for emphasis, a dash for a list item. It can be opened in any text editor on any computer, and it will still be readable in decades.

Content stored in a database, by contrast, is only as accessible as the software that reads it. Moving it to another system usually requires an export, a conversion and careful checking. Content stored as files can simply be copied.

Plain text also suits version control. Every change to an article, down to a single word, can be seen, compared and reversed. And because the files are just text, they are easy for other tools to read, including the build step that generates the assistant's knowledge file.

## Search without a search server

Search is often one of the reasons sites need a server. This site uses **Pagefind**, a tool that builds a compact search index as part of the build. When a reader searches, their browser downloads only the small parts of the index it needs and finds the results itself. There is no search server to run.

## The contact form

The contact form is one of the few parts of the site that has to send information somewhere. Enquiries are delivered to GoCore's inbox through Web3Forms, a form-to-email service. The form includes spam protection, and it works even if the reader's browser has JavaScript turned off. The site's [privacy policy](/privacy/) explains how enquiry details are handled.

## The assistant

The GoCore Assistant answers questions about GoCore using only information published on this website. It is a small example of the same philosophy applied to artificial intelligence.

When the site is built, a knowledge file is generated from the site's own pages, articles and frequently asked questions. When a reader asks a question, the Worker finds the most relevant passages in that file and asks a language model, running on Cloudflare Workers AI, to answer using only those passages. If the answer is not in the site's content, the assistant says so and suggests the contact page, rather than guessing.

There is still no database. The knowledge comes from the published content and is regenerated with every build, so the assistant is always as current as the site itself. Conversations are kept in the reader's browser for the session and are not stored by GoCore, as the privacy policy describes.

## Images

Images are often the heaviest part of a web page. The build step processes each image in an article into modern, compressed formats and several sizes, and the page offers the browser a choice. A reader on a phone receives a smaller file than a reader on a large screen, and neither has to wait for an image larger than they need. Because this happens once, at build time, there is no image server doing the work on every visit.

## Security headers

Even a static site benefits from careful security settings. Every response from the site carries headers that tell the browser how to behave: only load scripts the site itself has approved, always use an encrypted connection, refuse to display the site inside another site's frame, and limit what information is passed on when a reader follows a link elsewhere.

The list of approved scripts is calculated automatically during the build, from the exact scripts the site uses. If anything unexpected tried to run on a page, the browser would block it. The Worker attaches these headers to every response, including error pages.

## What it costs to run

At GoCore's current scale, running the site costs very little. Cloudflare's free plan covers static hosting, and the Worker and the assistant run within the free daily allowances that Cloudflare provides for small projects. The repository is hosted privately on GitHub, and the online editor is free for this kind of use.

That matters for a young business. Every dollar not spent on hosting, maintenance contracts and plugin licences is a dollar available for the work that actually creates value. It also means the site's running costs are unlikely to become a reason to compromise on it later.

## Accessibility and reading

A static site does not make a website accessible by itself, but it removes some obstacles. Pages arrive complete, so they are readable even on slow connections and without JavaScript. The site uses a clear heading structure, readable type, light and dark themes that follow the reader's own device setting, and controls that can be reached by keyboard. Articles show an estimated reading time, and long articles include a table of contents.

## What we gave up

Every design decision trades something away. A static site has real limitations.

**Changes are not instant.** Publishing means committing a change and waiting for the site to rebuild, which takes a short time rather than happening the moment an editor clicks save.

**Some features need workarounds.** Anything that genuinely needs a server, such as the contact form and the assistant, has to be handled by a separate service or a small function.

**No user accounts or comments.** The site does not support reader logins, comments or personalised content. For a business website at this stage, that is acceptable; for a community site, it would not be.

**The publishing process is more technical.** Even with an online editor, the system involves a repository, a build and a deployment. When something goes wrong, fixing it requires some technical understanding.

For GoCore today, those trade-offs are worth it. The publishing process is a little more technical, and in return the whole system is easier to understand and much harder to break.

## When we would add a database

A static site is not a permanent commitment. A database would make sense if GoCore needed features such as:

- user accounts and personalised content
- transactions, orders or bookings stored by the site
- content that changes with every visit or must update in real time
- large volumes of structured data that readers search and filter

If those needs arise, the right response is to add the simplest system that meets them, ideally alongside the static site rather than replacing it. The articles would remain plain files, and only the parts that genuinely need a database would use one.

## A pattern, not just a website

The same thinking applies well beyond websites. When a problem can be solved by a simple, well-understood system, that is usually the right place to start. Complexity is easy to add and difficult to remove, so it should arrive only when the problem demands it.

A few principles follow, for websites and for systems in general:

- **Start with what the problem actually requires,** not with what a typical solution includes.
- **Prefer systems that are easy to understand.** If something breaks, someone has to be able to fix it.
- **Keep data in open, portable formats.** Plain text files can be read by any tool, now and in decades to come.
- **Make changes visible and reversible.** Version control records every change and allows any mistake to be undone.
- **Check automatically.** Validation in the build catches errors before they reach anyone.
- **Add complexity deliberately.** Each new component should solve a specific, real problem.

These principles echo themes elsewhere in GoCore's Insights: the cost of standing still, the value of systems that belong to the organisation rather than to individuals, and the advantage of choices that remain useful for a long time.

## Bringing it together

The GoCore website is static by design. Pages are built in advance from plain text files, checked automatically, and served quickly from Cloudflare's network. A small function adds security headers and runs an assistant that answers only from the site's own content. Editors can work through files or an online editor, and every change is recorded.

What was given up, instant publishing, reader accounts and some flexibility, matters little for a business website at this stage. What was gained, security, speed, low cost, durability and transparency, matters a great deal.

If GoCore outgrows this approach, the content can move with it. That flexibility is part of why it was chosen.
