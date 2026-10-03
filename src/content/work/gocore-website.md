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

There is no database and no login on the website itself. Articles can be edited as files or through an online editor whose sign-in is handled by GitHub; every change is recorded in version history and the site is rebuilt from it. The contact form delivers enquiries through a form-to-email service with spam protection. A small Cloudflare Worker adds security headers and runs the GoCore Assistant, which answers questions using only the site's own published content.

## Status

In development. The site is live at gocore.com.au with the contact form, the assistant and more than forty Insights articles. Next steps are automatic deployment from the repository and publishing regularly.
