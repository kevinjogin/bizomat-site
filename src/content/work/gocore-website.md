---
title: "gocore.com.au"
summary: "The GoCore website and Insights publishing system. A static, Git-based platform designed to grow from ten articles to a thousand without being reorganised."
type: "Project"
status: "Developing"
date: 2026-10-03
featured: true
order: 10
relatedInsights:
  - why-this-website-has-no-database
---

## The problem

A new business needs a credible home online, a way to publish its thinking, and a way for people to get in touch. It also needs to stay cheap, secure and easy to change while the business itself is still taking shape.

## The approach

The site is built with Astro and published as static files on Cloudflare's network. Articles are plain Markdown files with structured, validated details: one category, a small set of controlled tags, and publication dates. Categories and tag pages appear automatically once enough articles exist, so the structure grows with the content instead of being designed in advance.

There is no database and no admin login. Publishing is a reviewed change to a file, which rebuilds the site automatically. The contact form is handled by a small, separate function with spam protection.

## Status

In development. The foundation, publishing system and first articles are in place. Next steps are connecting the domain, enabling the contact form and publishing regularly.
