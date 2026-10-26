---
book: cad-automation-that-pays
chapterSlug: testing-upgrading-and-keeping-tools-alive
order: 10
title: "Testing, upgrading and keeping tools alive"
description: "Build a test set that exercises every path, compare outputs with known-good results, test every CAD upgrade before it reaches users, keep a rollback, and count a tool's real cost over its life."
draft: false
---

A CAD tool's first release is the beginning of its cost, not the end. Every CAD upgrade, change to the office's templates, new supplier format or new kind of drawing is a chance for the tool to break, and the tool will usually break quietly: an export setting that changed its default, a call that now returns something slightly different, a template whose property moved. The difference between a tool that lasts for years and one that is abandoned after the first upgrade is a test set and a routine for using it.

This chapter sets out that routine. It covers building a test set that exercises every path through the tool, comparing outputs with known-good results, testing each CAD upgrade before users get it, keeping a rollback, recording changes, and counting the tool's real cost over its life. The running case takes the release pack through three annual upgrades, one of which changed a STEP export default that only the test set noticed.

## A test set that covers the paths

A test set is a collection of real files, copies, never originals, chosen so that every branch of the tool's logic is exercised at least once. The release pack's test set has 50 drawings with their models, chosen from the office's archive and a few made deliberately awkward:

```figure
type: compare
title: The release pack's 50-drawing test set
cols: Drawings | Path exercised
caption: This is an illustration. Each group exists because a branch of the tool depends on it, or because a fault was once found there.
- Single-sheet part drawings | 12 | The routine case
- Multi-sheet drawings | 8 | All-sheets PDF and page count check, after the one-sheet fault
- Sheet metal parts | 8 | DXF of the flat pattern
- Assembly drawings | 6 | Model matching across views, after the STEP-of-a-bolt fault
- Multi-configuration parts | 4 | Properties read from the view's configuration
- *Deliberately faulty drawings | 8 | Blank revision, missing model, locked file, property at both levels, unusual characters in names
- Already released at this revision | 4 | Refusal to overwrite
```

The faulty drawings matter most. A test set of perfect files tests only the happy path, and the happy path is rarely where tools fail. Each fault the release pack has ever had in service has a drawing in the test set that reproduces it, so that it can never come back unnoticed.

## Compare with known-good results

For each test drawing, the office keeps the expected result: the files the tool should write, their names, their page counts, the STEP header's part number, the register line, or, for the faulty drawings, the exact message the tool should report. The test harness, a third thin layer over the engine as Chapter 9 described, runs the engine on all 50 drawings into a scratch folder and compares each result with its expectation.

At about 72 seconds a drawing, the full run takes about **60 minutes** of machine time. It produces a single pass or fail line per drawing and a summary. A test run is "green" only if every line passes. The comparison is mechanical on purpose: a person looking at fifty PDFs will miss the one with a missing page, and a page count comparison will not.

## Testing an upgrade

The CAD program is upgraded once a year, with service packs between. The office's routine for each:

1. Install the new version on one test seat, not on users' seats.
2. Rebuild the add-in against the new version's libraries, as Chapter 3 required.
3. Run the full test set and compare.
4. Investigate every failure, fix the tool or update an expectation, with a note of which and why.
5. Re-run until green.
6. Upgrade users' seats and deploy the rebuilt tool together, so that nobody runs the old tool on the new CAD version or the reverse.

Steps 1 to 5 happen before any user is upgraded. The test seat's licence is the office's spare seat, which is also where the overnight batch runs.

## The error: a STEP default that changed

This is an illustration. In the release pack's second upgrade, the test run came back with 40 of 50 drawings green and 10 failing on one check: the STEP file's header named a different application protocol from the expected one. Nothing else differed; the files opened and looked right.

The release pack's settings file set most export options explicitly, but not the STEP protocol, which had been left at the CAD program's default because the default had suited the office's suppliers. The new version had changed that default. Had the upgrade reached users' seats untested, every STEP file released afterwards would have used the new protocol, and the one supplier whose system needed the old one would have received files it could not fully read, probably weeks later.

The fix took ten minutes: set the protocol explicitly in the settings file, with a comment naming the supplier who depends on it, and re-run the test set, which came back green. The rule that came out of it is that every export option the office relies on is set explicitly, even when it matches the current default, because defaults are the vendor's to change.

```figure
type: bars
title: Hours spent maintaining the release pack in each of its first three years
unit: hours
max: 25
caption: This is an illustration. The second year included an obsolete export call that had to be replaced and the STEP protocol fix. The average, 14 hours, is close to Chapter 1's estimate of 15.
- Year 1 | 11
- *Year 2, with an API change | 22
- Year 3 | 9
```

## Quick tests for small changes

A full test run takes an hour, which is fine for an upgrade and too slow for every small change to the code. The office keeps a quick subset of ten drawings, one from each group plus the three faulty drawings most likely to be affected by everyday changes, which runs in about twelve minutes. Every change runs the quick subset before it is committed; every deployment runs the full set. A change that passes the quick set and fails the full set is rare, and when it happens it points straight at an interaction the quick set did not cover, which usually earns a new drawing in the quick set.

## Tests that run themselves

Some breakages come from outside the tool: a template edited on the server, a supplier's requested format change applied to the settings file by someone else, a network folder renamed. None of these is an upgrade, so none triggers the upgrade routine. The office therefore runs the full test set automatically every Sunday night on the spare seat and emails the summary to the tool's owner and second. A red result on Monday morning means something in the environment changed during the week, and the failing drawing usually says what. In its first year, the Sunday run caught two template changes and one renamed folder before any drafter met them.

## Watching the tool in service

Tests tell the office whether the tool works on known files. Service tells it how the tool behaves on real ones. The release pack's logs are summarised weekly: drawings released, failures by cause, and the failure rate. The office set a simple threshold: a weekly failure rate above 2%, double the first six months' 0.9%, triggers a look at the causes. It has been crossed twice, once by a run of locked files during a busy fortnight, which needed nothing but patience, and once by a cluster of missing models after a project folder was moved, which needed the references fixed.

## Obsolete calls

Vendors replace calls with newer versions and mark the old ones obsolete, as Chapter 3 noted. Obsolete calls usually keep working for several releases, then stop. In the second year, one of the release pack's export calls, marked obsolete two versions earlier, stopped accepting one of its options, and the test set found it. Replacing it with the current call took most of that year's extra hours.

A cheaper habit, adopted afterwards, is to search the tool's code for obsolete calls at each upgrade, using the vendor's list of changes, and replace them before they fail, when the work can be scheduled rather than forced.

## Rollback

However good the tests, an update can fail in service in a way the test set did not foresee. The release pack's shared folder keeps the previous version alongside the current one, and the version file that every seat checks, from Chapter 9, names which to use. Rolling back is a matter of editing one line in that file, about five minutes, after which every seat uses the previous version at its next command. The office has rolled back once, for a day, when a template change had not been rolled out to all seats in step with the tool.

## Change records

Every change to the tool, its settings file or its test set is recorded: what changed, why, who changed it, which test run confirmed it. The record is the version control system's history plus a short change log in plain words at the top of the code. When a supplier asks why their DXF files changed in March, the change log answers in a sentence. When a new owner takes over the tool, it is the first thing they read.

## What the tool really cost

This is an illustration. Over its first three years, the release pack cost:

- **build**: 90 hours;
- **maintenance**: 11 + 22 + 9 = **42 hours**;
- **deployment**: about 1 hour a year with the shared copy, 3 hours in all;

a total of about **135 hours**, or **A$12,825** at A$95 an hour, excluding GST. Over the same three years, at Chapter 1's 263 hours a year, it saved about **789 hours**, or about **A$74,955**. The return was about 5.8 hours saved for every hour spent.

```figure
type: balance
title: The release pack over three years
left: Cost, about 135 hours
right: Saving, about 789 hours
tilt: right
caption: This is an illustration at A$95 an hour, excluding GST. The faults it prevented, a release a week at the start, are counted only as rework hours.
- Build, 90 hours | Release time, 690 hours
- Maintenance, 42 hours | Release faults avoided, about 99 hours
- Deployment, 3 hours | Consistent names and formats, not priced
```

The figures also check Chapter 1's estimate. Maintenance averaged 14 hours a year against 15 estimated; savings matched because the drawing count stayed near 40 a week. Had the office's release volume halved, the tool would still have paid, as Chapter 1's sensitivity check predicted.

## Handing over

A tool outlives its first owner's interest in it, and sometimes their employment. The handover the office uses has four parts: the code and its change log, the settings file with its comments, the test set with its expected results, and an hour with the new owner running an upgrade test together. The last is the one that matters. A new owner who has run the test set, read a failure and fixed it once can maintain the tool; one who has only been given a folder of code cannot. The release pack's second owner, the engineer named in Chapter 1, did exactly that before the administrator's first long leave, and handled a service pack alone while the administrator was away.

## When to retire or replace a tool

Tools reach an end. The process they automate changes, a product data management system takes over part of the job, or the CAD platform changes. The decision to retire or rewrite should use the same arithmetic as the decision to build: the remaining saving against the cost of keeping the tool alive or replacing it.

This is an illustration. In its third year the office adopted a product data management system whose release workflow could export PDFs and write the register entry, about half of the release pack's job. The administrator recalculated: with the workflow doing the PDF and register steps, the release pack's remaining saving, the DXF, STEP, property checks and model matching, was about 140 hours a year, still far above its 14 hours of maintenance. The office kept the release pack for those steps, removed its PDF and register code so that the two systems did not do the same job twice, and updated the test set's expectations accordingly. Retiring part of a tool is often better than retiring all of it, and the test set is what makes cutting it down safe.

## Exercise: a new CAD platform

The office plans to move to a different CAD platform in a year's time. The release pack's engine would need rewriting for the new API, estimated at 70 hours, because the export, property and traversal calls all differ, though the logic, the checks and the test set carry over. The office expects to keep releasing about 40 drawings a week for at least three years after the move. Should it rewrite the tool?

**Worked answer.** Since the product data management workflow took over the PDF and register steps, the release pack saves about 140 hours a year, worth about 140 × A$95 = A$13,300. Allowing 15 hours a year of maintenance on the new platform, A$1,425, the net saving is about A$11,875 a year.

The rewrite costs 70 × A$95 = **A$6,650**, which pays back in 6,650 ÷ (11,875 ÷ 12) = about **6.7 months**. Over three years the net saving is about 3 × 11,875 − 6,650 = **A$28,975**.

The office should also check whether the new platform's own data management can do the remaining steps, which would make the rewrite unnecessary, before committing the 70 hours. If it cannot, the rewrite still pays well within the three-year horizon.

Rewrite it, and reuse what transfers: the schema, the settings file, the naming rules, the checks and, above all, the 50-drawing test set and its expected results, which define what "correct" means independently of either CAD platform. The test set is the most valuable part of the tool to carry across, because it turns "does the new version work?" into a one-hour run with a pass or fail answer.
