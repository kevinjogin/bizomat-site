---
book: engineering-software-you-can-sell
chapterSlug: turn-a-tool-into-a-product
order: 3
title: "Turn a tool into a product"
description: "List the assumptions an in-house tool makes, estimate the work to remove them, make customer-specific rules configurable, write documentation strangers can use and test across customers' set-ups."
draft: false
---

An in-house tool is built on assumptions nobody writes down, because everyone in the office shares them: one CAD version, one drafting standard, users who can walk over and ask the author, administrator rights on every machine, the office's network and file paths. A product cannot assume any of that. Every assumption that holds at home and fails at a customer becomes a support call, a refund request or a quiet uninstall.

This chapter turns the drawing-checking add-in from a tool into a product. It lists the in-house assumptions, estimates the work to remove each, moves customer-specific rules into configuration, writes documentation for people who have never met the author and tests across the combinations customers actually run. The failure case is a pilot firm whose title blocks used different property names, so that every drawing failed every check.

## Write down the assumptions

The office listed every assumption it could find by reading the code, the installer and the support emails from the pilot. This is an illustration of the main ones:

```figure
type: compare
title: What the in-house tool assumed and what a product must handle
cols: In-house assumption | A product must handle
caption: This is an illustration from the office's review. Each line became a work item in the productising estimate.
- CAD version | one version, the office's | at least the current and previous major releases
- Drafting standard | the office's own, written into the code | each customer's standard, as configuration
- Property names | the office's title-block property names | whatever names each customer uses, mapped
- Rights | users have administrator rights | install by IT, run as an ordinary user
- Support | walk over and ask the author | documentation, messages and a support channel
- *Failure | the author notices and fixes it | the customer can diagnose or report it with useful evidence
- Licensing | none | each seat licensed and checked (Chapters 5 and 6)
```

The list is long because a tool that works in one place is shaped by that place in hundreds of small ways. The pilot firms in Chapter 1 had already found several of them.

## Estimate the work honestly

The office estimated the work to remove each assumption, then added the work that a product needs and a tool does not: licensing, documentation, a trial process and a way to take payment.

```figure
type: bars
title: Estimated hours to productise the add-in
unit: hours
max: 160
caption: This is an illustration. The total of 600 hours is the figure used in Chapter 1's market test; the in-house tool had taken about 450 hours over three years.
- Configuration for customers' standards and property names | 140
- Support for two major CAD releases | 80
- Documentation for users, administrators and configuration | 80
- Testing across customer set-ups | 80
- Installer for customers' IT | 60
- Licensing integration | 60
- Messages, diagnostics and support bundle | 60
- Website, trial and payment | 40
```

The total is **600 hours**, more than the roughly 450 hours that had gone into the in-house tool over three years. That ratio surprises most engineers, but it is typical of the difference between something that works for its author and something that works for strangers. The office checked its estimate against the pilot: the changes made for four pilot firms had already taken about 90 hours, and those firms had only exercised part of the list.

## Make customers' rules configuration, not code

The single largest piece of work was configuration. The in-house add-in checked drawings against the office's drafting standard, with the rules written in code. Every customer has its own standard: different title-block fields, different revision table formats, different tolerancing conventions, different layer and style names.

The product separates the checking engine from the rules. Each customer writes, or has written for them, a configuration file that states:

- which title-block properties must be present and what they are called in that customer's templates;
- the format of the revision table and the rules for revision letters;
- which dimensions must carry a tolerance, and the general tolerance note that covers the rest;
- the allowed layers, line styles and text styles.

The product ships with two sample configurations: a generic one based on common practice and a fully commented example. A **configuration checker** validates a customer's file before it is used, reporting misspelt property names, impossible rules and missing sections in plain language. The office offers configuration as a paid service for customers who prefer not to write their own, at its normal engineering rate. That turned out to be a useful second source of revenue, and a good way to learn what customers' standards look like. Patterns across customers' configurations later showed which checks were universal and which were specific to one firm, and that guided which checks to build next.

## Support the CAD versions customers run

Customers do not all upgrade their CAD system at the same time. Some upgrade every year, some every few years, and a firm in the middle of a large project may delay an upgrade for months. The office looked at the CAD versions the pilot and trial firms ran and set a support policy: **the current major release and the one before it**. Each product release is tested on both. When the CAD vendor releases a new major version, the product adds it after testing, and the oldest supported version drops off, with notice to customers.

Supporting two releases roughly doubles the testing work. Supporting three would have tripled it. The policy is a trade-off between reach and cost, written down so that customers know in advance what to expect.

## Write for people who have never met you

The in-house tool's documentation was the author. A product needs three kinds of written help, for three readers:

- **a user guide** for designers: what the add-in checks, how to run it, what each result means and what to do about it, in about 12 pages;
- **an administrator guide** for the customer's IT staff or CAD administrator: how to install, deploy to many seats, configure licences, where logs are kept and what the add-in needs from the network, in about 10 pages;
- **a configuration reference** for whoever writes the customer's configuration: every setting, with examples, in about 20 pages.

Each guide was tested by someone outside the office. A pilot firm's CAD administrator installed the product using only the administrator guide, and the office watched over a video call without helping. They stopped four times. Each stop became a correction to the guide or, twice, a change to the installer so the question did not arise.

## Make failures reportable

At home, when the tool misbehaved, the author looked at it. At a customer, the office sees nothing unless the product reports it. The product therefore includes a **support bundle**: one menu command that collects the add-in's log, its version, the CAD version, the configuration file and the licence state into a single file the user can attach to a support request. It collects nothing from the customer's drawings except the names of any drawings involved in an error, and the user can see what it contains before sending it.

Error messages were rewritten for strangers, on the same principle as the companion book's chapter on failing safely: what happened, whether anything changed and what the user can do. Every message carries a short code that appears in the user guide and in the log.

## Test across customers' set-ups

The combinations multiply quickly. Two CAD releases, two versions of the operating system in common use among customers and three representative configurations make **2 × 2 × 3 = 12** combinations. The office tests all 12 for every minor release and the most common four for patches. Each test runs a fixed set of sample drawings, some correct and some with known faults, and compares the results with the expected findings.

The sample drawings are the office's own, prepared for the purpose. Customers' drawings are never used for testing unless a customer provides them explicitly for a support case and agrees to how they are kept.

## Keep the first version small

Every conversation with a prospect produces feature requests: checks for welding symbols, a batch mode for whole projects, a report for managers, support for another CAD system. Each is reasonable, and together they would double the 600 hours. The office drew a line around version one using the evidence from Chapter 1. It included the checks that the pilot firms used most, configuration for their standards, the two CAD releases they ran and the licensing needed to sell it. Everything else went onto a public list of planned features with no promised dates.

The line was tested against one question: would a firm like the pilot firms pay for version one as it stands? Three of the four had renewed for less than version one would offer, so the answer was yes. A batch mode was the most requested item outside the line. It went into the second release, six months after launch, paid for by the first customers' subscriptions rather than by more forgone fees.

## Productising is not a one-off cost

The 600 hours make the product sellable. Keeping it sellable costs time every year: testing on each new CAD release, updating the guides, answering configuration questions, fixing faults customers find and dealing with operating system updates that change how add-ins load. The office estimated this at about **150 hours** a year for the first two years, roughly A$16,500 at the internal rate, separate from customer support, which Chapter 10 measures.

That figure changed the business case from Chapter 1. Revenue of about A$59,400 a year by year three must now cover ongoing product work of about A$16,500, support, sales and the cost of licensing and payment services before it repays the 600 hours. The office went ahead because the pilot evidence was strong and because the configuration service added revenue. It did so with a clearer view of how long repayment would take, and of the stopping rules from Chapter 1.

## A failure case: every drawing failed

This is an illustration. One pilot firm installed the add-in, ran it on its first drawing and saw 31 failures. The second drawing had 29. Within a day, the firm's designers had stopped running it.

The office learned about it only because the pilot agreement asked for monthly usage figures, and that firm's count was close to zero. A call found the cause. The firm's title-block properties had different names from the office's: "Drawn" instead of "DrawnBy", "Rev" instead of "Revision" and so on. The in-house add-in looked for the office's names, found none, and reported every property as missing. Each missing property also triggered dependent checks, multiplying the failures.

At that stage the add-in had a configuration file for rules, but the property names were still fixed in code, because it had never occurred to anyone that they could differ. The correction was the property-name mapping described above, plus a change to the configuration checker. It now opens a sample drawing from the customer and lists the properties it finds, so the administrator can map them before the first real check. Dependent checks were also changed so that one missing property produces one clear message, not a cascade.

The firm came back to the add-in after the fix. The lesson recorded was that false failures are worse than missed ones for a checking tool: a tool that reports problems that are not there is switched off, and then it catches nothing.

```figure
type: checklist
title: Ready to sell, not just ready to use
caption: This is an illustration of the office's release checklist for the first product version.
- Every in-house assumption on the list removed or documented as a requirement | reviewed against the code
- Customer rules and property names in validated configuration | configuration checker included
- Tested on all 12 supported combinations with sample drawings | results recorded
- User, administrator and configuration guides tested by outsiders | corrections made
- Support bundle and coded error messages | user can see what is sent
- ? Licensing and trial process working end to end | Chapters 5 and 6
- x Customers' drawings used as test data without explicit agreement | never
```

## How this applies to a small Australian business

The productising estimate is where many engineering firms decide not to proceed, and that can be the right decision. If the work looks larger than the market in Chapter 1 can repay, a middle path exists: keep the tool in-house, offer it to clients as part of engineering services, configured by the firm, and avoid supporting strangers altogether. If you do proceed, budget the documentation and testing as real work. They are what customers experience when the author is not in the room.

Think too about who does the work. In a busy engineering firm, productising hours compete with paid client work, and client work usually wins. The office ring-fenced three days a week of the lead designer's time for six months, about **3 × 7.6 × 26 ≈ 593** hours, and protected it from project deadlines. Other project staff covered the lead designer's client work, and the principal agreed in advance which deadlines could move if the two collided. Without that, the 600 hours would have stretched over two years, by which time the pilot firms' interest and the CAD releases they ran would both have moved on.

## Exercise: one more CAD release

Three potential customers say they run a CAD release two versions behind the current one. Supporting it would add one CAD release to the matrix and an estimated **50 hours** of compatibility work. The three firms have about **12** seats between them, at the planned price of A$495 per seat a year excluding GST. How many combinations would the test matrix then have, and how long would it take the extra seats to repay the compatibility work at the internal rate of A$110 an hour, ignoring the extra testing time?

**Worked answer.** With three CAD releases, two operating system versions and three configurations, the matrix grows to **3 × 2 × 3 = 18** combinations, 50% more testing for every minor release. The compatibility work costs about **50 × 110 = A$5,500**. Twelve seats bring about **12 × 495 = A$5,940** a year, so the work would be repaid in a little under a year, before counting the extra testing on every release for as long as the old version is supported. A reasonable answer is to decline, explain the support policy and offer to welcome the firms when they upgrade, unless they are strategically important customers.
