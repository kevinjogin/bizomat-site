---
title: "Version control for business leaders: what Git, branches and pull requests do and why they protect your software"
description: "How version control records every change to software, how commits, branches, pull requests and tags work, and what business owners should ask about code ownership, access and history."
publishDate: 2026-10-16
category: "Technology"
tags:
  - systems
  - quality
  - process-improvement
author: "KEVOS"
featured: false
draft: false
---

Every business that owns software, whether a website, a custom application, a set of spreadsheet macros or scripts that move data between systems, owns a body of code that changes over time. Each change fixes something, adds something or occasionally breaks something. The question of what changed, when, why and by whom becomes important the moment something goes wrong: a calculation produces different results from last month, a feature stops working after an update or a developer leaves and nobody knows which copy of the code is current.

**Version control** is the discipline, and the set of tools, that answers those questions. It records every change to a set of files, keeps the full history, allows several people to work on the same code without overwriting each other, supports review before changes are accepted and makes it possible to return to any earlier state. For professional software teams, it is as basic as accounting records are to a finance team. Yet in small businesses, code is still often kept in folders named "final", "final2" and "final-really", on one developer's laptop or only on the live server.

This article explains what version control does, the main concepts of the most widely used tool, Git, including repositories, commits, branches, merges, pull requests and tags, how teams use it to control change, what it means for code ownership and security, and what business owners should ask of developers and suppliers. It is part of a series on software and cloud foundations for business leaders and does not require any programming knowledge.

## The problem version control solves

Without version control, managing changing files relies on habits that break down quickly:

- **Copies with different names**, such as "quote-tool-v3-fixed", leave nobody sure which is current or what differs between them.
- **Overwriting**: when two people edit the same file, one person's changes can silently replace the other's.
- **Lost history**: when something stops working, there is no reliable record of what changed.
- **No accountability**: changes cannot be traced to a person or a reason.
- **Single copies**: code that exists only on one computer or server can be lost with it.

Version control replaces these habits with a systematic record. The idea is familiar from other fields: engineering drawings carry revision letters and change notes, contracts have tracked changes and accounting systems keep journals rather than overwriting balances. Version control applies the same discipline to code.

## Git and the platforms around it

Several version control systems have been used over the years. Today, the dominant one is **Git**, created by Linus Torvalds in 2005 to manage development of the Linux operating system. Git is free, open-source software that runs on developers' computers.

Teams usually store a shared copy of their code on a hosting **platform**, such as GitHub, GitLab, Bitbucket or Azure DevOps. These platforms add features around Git: web access to the code and its history, access control, review workflows, issue tracking and automated building and testing. Git and the platforms are different things: Git records history, and the platform hosts a shared copy and supports collaboration.

## Repositories

A **repository**, often shortened to "repo", is a project's collection of files together with their complete history. Each developer has a full copy of the repository on their computer, and a shared copy is kept on the hosting platform. Because every copy contains the full history, the loss of one computer does not lose the project, although the shared platform copy remains the reference point.

A repository usually contains source code, configuration files, tests, documentation and scripts for building and deploying the software. It should not contain passwords, keys or other secrets, which belong in separate, secured storage.

## Commits: recorded changes

A **commit** is a recorded set of changes, saved together with:

- the **author** and the **date**;
- a **message** describing what was changed and why; and
- a unique identifier, a long string of letters and numbers often shown in shortened form.

Commits form a chain, each one pointing back to the previous one, so the history shows exactly how the code reached its current state. Any earlier commit can be inspected or restored. Good commit messages explain the reason for a change, such as "Round GST to the nearest cent per line to match the accounting system", rather than just "fixed bug". Months later, that message may be the only record of why the code behaves the way it does.

Teams can see, for any line of code, which commit last changed it and why. When a calculation changes unexpectedly, the history usually shows the commit responsible within minutes.

## Branches: working in parallel

A **branch** is a separate line of development. The main branch, usually called "main", represents the accepted, working state of the code. When developers start a new feature or fix, they create a branch from main and make their changes there. Work on the branch does not affect main until it is deliberately combined.

Branches allow:

- several developers to work on different changes at the same time;
- experiments that can be abandoned without affecting the main code; and
- urgent fixes to be made while longer pieces of work continue separately.

Branches should usually be short-lived. A branch that stays separate for weeks or months drifts away from main, and combining it later becomes difficult and risky.

## Merging and conflicts

**Merging** combines the changes from one branch into another, usually a feature branch into main. Git combines changes automatically when they affect different parts of the code. When two branches change the same lines in different ways, Git reports a **conflict**, and a developer must decide how to combine them. Conflicts are a normal part of team development; they are much easier to resolve when branches are small and merged frequently.

```figure
type: svg
title: Branch, review, merge
alt: A main line of commits. A branch splits off for a change, gains two commits, then returns to the main line through a pull request where tests run and a second developer reviews it. A tag marks the released version.
caption: Work happens on a branch; it reaches the main line only after tests pass and someone reviews it.
viewbox: 0 0 640 180
body:
<path class="ln" d="M20 120H620"/>
<circle class="fi" cx="60" cy="120" r="9"/>
<circle class="fi" cx="160" cy="120" r="9"/>
<circle class="fi" cx="520" cy="120" r="9"/>
<path class="la flow" d="M160 120C200 50 240 50 260 50H380C420 50 460 60 520 120"/>
<circle class="fa" cx="280" cy="50" r="8"/>
<circle class="fa" cx="370" cy="50" r="8"/>
<text class="tx txs" x="325" y="30" text-anchor="middle">branch: new freight rates</text>
<rect class="bxa" x="400" y="62" width="110" height="30" rx="6"/>
<text class="txb" x="455" y="82" text-anchor="middle">tests + review</text>
<text class="tx txs" x="20" y="150">main</text>
<text class="txb" x="520" y="150" text-anchor="middle">tag v2.4.0</text>
```

## Pull requests: reviewing before accepting

A **pull request**, called a merge request on some platforms, is a proposal to merge a branch into main. It shows exactly which lines have changed, allows reviewers to comment, ask questions and request changes, and records the discussion and the approval. Platforms can also run automated tests on every pull request and block merging if tests fail.

Pull requests turn code review into a routine, recorded control. They catch defects, share knowledge so that more than one person understands each part of the system, keep code consistent and create an audit trail showing who approved each change. For businesses with regulatory or contractual obligations, that trail can be valuable evidence of change control.

Common rules, often enforced by the platform, include:

- changes to main must go through a pull request;
- at least one other person must approve each pull request;
- automated tests must pass before merging; and
- nobody, including senior developers, can change main directly.

## Tags and releases

A **tag** marks a particular commit as significant, typically a released version, such as "v2.4.0". Tags make it easy to see exactly which code is running in production, to compare one release with another and to rebuild or return to an earlier release if a new one causes problems. Many teams use **semantic versioning**, in which version numbers take the form major.minor.patch: a change in the major number signals changes that may break compatibility, minor numbers signal new features and patch numbers signal fixes.

## Undoing changes

Because version control keeps every commit, changes can be reversed. A faulty commit can be **reverted**, which creates a new commit undoing its effect while keeping the history intact. This is generally preferable to rewriting history, which can cause confusion when others already have copies. Being able to return quickly to the last known good version is one of the most practical benefits of version control during an incident.

## Beyond code

Version control works best with text files, such as source code, configuration, scripts and documentation written in plain text formats. It can store binary files, such as images, spreadsheets and CAD models, but cannot show meaningful line-by-line differences for them, and large binary files can make repositories slow. Specialised systems, such as product data management for CAD, serve those needs better, although the underlying principles of recorded revisions, approvals and history are the same.

Some teams also keep infrastructure definitions, database change scripts and documentation in version control, so that the whole system, not just the application code, can be reviewed, traced and rebuilt.

## Ownership, access and security

Version control has direct business implications:

- **Ownership**: the business should know where its code is stored, and ideally the repository should sit in an account the business controls, with suppliers given access, rather than in a supplier's personal account. Contracts should confirm ownership of the code and the obligation to hand over repositories with their full history.
- **Access control**: access should be granted to individuals, with appropriate permissions, and removed promptly when people leave or contracts end. Multi-factor authentication should be required.
- **Secrets**: passwords, API keys and other credentials must not be stored in repositories. If one is committed by mistake, it should be treated as exposed and changed, because it remains in the history even after deletion from current files.
- **Backups**: hosting platforms are generally reliable, but the business should still keep independent copies of important repositories, consistent with its wider backup arrangements.
- **Dependencies**: repositories record which external libraries the software uses. Platforms can alert teams when those libraries have known security vulnerabilities.

The [owning your website and digital presence](/reados/collections/business-systems-security-and-it-decisions/owning-your-website-and-digital-presence/) article explains the same principles of control for domains, hosting and email.

## Version control and testing

Version control and automated testing reinforce each other. When every change is a commit and every merge passes through a pull request, automated tests can run on each proposed change, so problems are caught before they reach main. If a defect does reach production, the history shows which change introduced it, and the tests can be extended to catch similar problems in future. The [testing business software that holds important data](/reados/collections/business-systems-security-and-it-decisions/testing-business-software-that-holds-important-data/) article describes what such tests should cover.

## Common workflows

Teams organise their use of branches in different ways:

- **Trunk-based development**: developers make small branches and merge them into main frequently, often several times a day, relying on automated tests to keep main working. This suits teams that release often.
- **Feature branches**: each feature is developed on its own branch and merged by pull request when complete. This is the most common approach in small teams.
- **Release branches**: a branch is created for each release, allowing fixes to be applied to it while new development continues on main. This suits software with several supported versions.

The specific workflow matters less than its consistency: everybody should know how changes move from idea to production.

## Warning signs

Business owners can watch for signs that change control is weak:

- nobody can say exactly which version is running in production;
- code exists only on a developer's computer or on the live server;
- changes are made directly on live systems;
- there are no reviews, or one person reviews and approves their own changes;
- the business does not have access to its own repositories; and
- developers cannot say what changed between one release and the next.

## A worked example

This is an illustrative example. The business and details are hypothetical.

A wholesale distributor has an online ordering portal built by a contractor over several years. The contractor keeps the code on a personal laptop and uploads changes directly to the web server. One Monday, customers report that freight charges for some regional postcodes are wrong. The contractor is overseas, and nobody else can tell what changed or when.

Once contacted, the contractor finds that a change made the previous Friday, intended to update metropolitan rates, also altered a regional lookup table. Fixing it takes most of a day, during which orders are manually corrected.

The distributor's manager then sets new arrangements with the contractor. The code is moved into a repository in an account owned by the distributor, with the contractor and a second, part-time developer given access. Changes are made on branches and merged through pull requests, which the second developer reviews. Automated tests check freight calculations for a list of representative postcodes. Each release is tagged, and deployment to the server is done by a script from the tagged version.

Some months later, a new pricing change causes a test for a regional postcode to fail before the pull request is merged. The error is fixed in minutes, and customers never see it.

```figure
type: compare
title: A freight error, before and after version control
cols: Code on a laptop | Repository the business owns
best: 2
caption: The second error was caught by a failing test before the change was merged; customers never saw it.
- Where the code lives | The contractor's laptop | The distributor's own account
- How changes ship | Uploaded straight to the server | Branches, pull requests, review
- Checks | None | Automated tests, including regional postcodes
- *A bad freight change | Most of a day fixing live orders | Fixed in minutes, before release
```

## How this applies to a small Australian business

- **Insist that all code is in version control**, including scripts and configuration.
- **Keep repositories in accounts the business owns**, with suppliers given access.
- **Require reviews** through pull requests for changes to main.
- **Run automated tests** on proposed changes before merging.
- **Tag releases** so it is always clear what is running.
- **Keep secrets out of repositories** and change any that leak.
- **Remove access promptly** when people leave or contracts end.
- **Confirm code ownership and handover** in contracts.

## Common mistakes

- **Treating version control as optional** for small projects.
- **Leaving repositories in a contractor's personal account.**
- **Committing passwords and keys.**
- **Long-lived branches** that become hard to merge.
- **Vague commit messages** that explain nothing.
- **Allowing direct changes to main** or to live servers.

## Frequently asked questions

**Is version control only for large software teams?** No. A single developer benefits from history, the ability to undo changes and an off-site copy. For a business, version control is the basis of knowing what its software is and how it has changed.

**Is Git the same as GitHub?** No. Git is the version control tool; GitHub is one of several platforms that host Git repositories and add collaboration features.

**Can version control be used for documents?** It can, especially for documents written in plain text formats. For word-processing documents, spreadsheets and CAD files, document management or product data management systems usually suit better.

**Does a business need to read its own repositories?** Not routinely, but it should be able to access them, know who has access and be able to hand them to another developer.

**What should happen when a developer leaves?** Their access should be removed, any credentials they knew should be changed and the business should confirm that all their work has been committed and merged into the shared repository.

## Questions to ask

- Where is our code stored, and do we control the account?
- Who can change the main branch, and is every change reviewed?
- Can we tell exactly which version is running in production?
- How quickly could we return to the previous release?
- Are any passwords or keys stored in our repositories?

## Bringing it together

Version control records every change to software, with its author, date and reason, and allows teams to work in parallel, review changes before accepting them, mark releases and return to earlier versions. Git and the platforms that host it make this routine. For business owners, version control is a matter of control and continuity: knowing where the business's code is, who can change it, how changes are checked and how quickly a bad change can be reversed. A few direct questions are usually enough to tell whether those controls are in place.

---

*Source: KEVOS editorial notes. Examples in this article are illustrations.*
