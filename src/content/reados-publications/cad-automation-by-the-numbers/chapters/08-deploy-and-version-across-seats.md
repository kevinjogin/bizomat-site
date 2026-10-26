---
book: cad-automation-by-the-numbers
chapterSlug: deploy-and-version-across-seats
order: 8
title: "Deploy and version across seats"
description: "Install a CAD automation tool the same way on every seat, number its versions so they mean something, roll changes out in stages, control the rule table centrally and keep old seats from drifting."
draft: false
---

A tool that works on its developer's computer is a prototype. A tool that works identically on every designer's workstation, can be updated without a morning of disruption and can be rolled back when an update goes wrong is a product, even if it never leaves the office. The step between the two is deployment, and it is where many in-house tools quietly fail: one seat runs last month's version, another has a different rule table, and nobody can say which produced a given drawing.

This chapter deploys the trestle configurator to the office's four design seats and its build machine. It compares ways of installing, sets a version numbering scheme, controls the rule table from one place, stages each rollout and keeps a way back. The failure case is a seat that missed an update and produced nine trestles with the old cut-list format.

## What installing a CAD tool involves

Copying files to a folder is rarely enough. Installing the trestle configurator on a workstation involves:

- placing the program files, the add-in and the rules library in a fixed location;
- registering the add-in with the CAD system so that it appears in the add-in list and loads when the CAD system starts;
- installing or confirming any runtime libraries the code depends on, at the right versions;
- pointing the tool to the central rule table, master models and log location;
- creating a shortcut for the batch program on the build machine;
- setting permissions so that users can run the tool without administrator rights.

Each step can go wrong on one machine and not another. The source for this book spent several chapters on installation, from manual copying through self-extracting archives to a full installer that registered the add-in and created shortcuts. The underlying lesson still holds: the more steps a person performs by hand, the more seats will end up different from each other.

## Choose an installation method

```figure
type: compare
title: Ways to install the configurator on a seat
cols: Effort per seat | Consistency | Update and removal
caption: This is an illustration for five machines. Installer and managed-deployment details depend on the office's operating system and IT arrangements.
- Manual copy and registration from written steps | about 25 minutes, needs administrator access | depends on the person; steps get missed | manual; old files often left behind
- Self-extracting archive with a setup script | about 5 minutes | good if the script is maintained | partial; removal often manual
- *Installer package | about 3 minutes, or automatic | identical on every seat | upgrade and uninstall built in
- Managed deployment by the office's IT tools | none at the seat | identical and enforced | pushed centrally; needs an IT arrangement
```

The office chose an installer package, built as part of the tool's release process, which its outside IT provider deploys to the five machines through their existing management tools. The installer performs every step above, records the installed version and removes the previous version cleanly when upgrading. Uninstalling leaves nothing behind except the logs, which are kept centrally.

The installer took about 20 of the 320 build hours in Chapter 5's estimate. At about 25 minutes per seat for a manual installation, five seats and perhaps eight releases a year would cost about **5 × 8 × 25 ÷ 60 ≈ 17 hours** a year, before counting the errors. The installer paid for itself in the first year on time alone.

## Number the versions so they mean something

Every release of the tool gets a version number, and the number should tell people something. The office adopted Semantic Versioning, a widely used public convention with three numbers, **major.minor.patch**:

- the **patch** number rises for a fix that changes no behaviour a user relies on, such as a corrected message;
- the **minor** number rises for new capability that does not change existing outputs, such as a new foot style;
- the **major** number rises when existing outputs change, such as a new cut-list format or a changed file naming scheme, because anything downstream may need to adapt.

The tool's version is separate from the rule table's revision. A rule change raises the table's revision without touching the code, and a code change raises the tool's version without touching the rules. Both are stamped on every generated drawing and recorded in every generation log line, so any drawing can be traced to the exact code and rules that produced it.

The office also keeps a compatibility record: which tool versions are approved for which CAD release. After the upgrade test in Chapter 7, for example, version 2.1.0 was approved for both the current release and the next one, and the older 2.0.x versions only for the current release.

## Control the rule table centrally

The rule table is not installed on each seat. It lives in one controlled location, readable by every seat and writable only by the rule owner's change process. When the tool starts, it reads the table, checks its revision and signature, and shows the revision in the panel.

If the table cannot be read, for example because the network is down, the tool refuses to generate. An earlier design kept a cached copy on each seat for working offline. It was removed after a discussion about what would happen if a seat worked from a cached table for a week after a rule changed. Refusing for an hour during a network outage is a nuisance. Generating with a superseded rule is a fault.

## Put shared resources in one place

Besides the program and the rule table, the tool depends on several shared resources: the master part, assembly and drawing; the standard-part library; the drawing templates; the log; and the approved-version file. If any of these exists in more than one copy, the copies will eventually differ.

The office keeps each in exactly one controlled place. The master models and library live in the vault, in released state, and the generator reads them through the vault so that it always uses the released revision. A master model change goes through the vault's normal change and release process, followed by the reference tests in Chapter 7, before the generator can see it. The log and the approved-version file sit in a protected shared folder that every seat can write log lines to and read the version from, but that only the maintainer can change.

The installer installs code, nothing else. Everything that represents engineering content, rules, masters, templates and library parts, is controlled where engineering content is normally controlled. That keeps deployment simple. A new tool version does not have to carry new rules, and a new rule revision does not need a new installation.

## Time releases around the work

A release on the morning of a busy week's deadline is asking for trouble. The office's rhythm is to release only at the start of a week, never in the last week of a month when most orders are due, and never in the two weeks before the annual CAD upgrade, when the build machine is busy with upgrade testing. The rollout timeline below shows how a release fits into that rhythm.

Release frequency also matters. Too few releases and every one carries many changes, which makes problems hard to trace. Too many and designers are constantly adapting. The office settled on about eight a year: a planned minor release each quarter, with patches as needed in between. Rule-table revisions follow their own process and can happen at any time, because they need no installation.

## Roll out in stages

A new version reaches all five machines in stages, so that a problem missed by the tests affects one person for a day rather than everyone at once.

```figure
type: timeline
title: Rolling out configurator version 2.1.0
caption: This is an illustration. The previous version's installer is kept until the new version has run for a month, so any seat can be rolled back in minutes.
- Day 0 | Build machine | full test set from Chapter 7 passes; release notes written
- Day 1 | One designer | real work for a week; generation log reviewed daily
- Day 8 | Remaining designers | pushed by managed deployment; versions confirmed from the log
- *Day 8 onwards | Version check | the tool refuses to run if it is not the approved version
- Day 38 | Retire the old installer | unless a rollback has been needed
```

The release notes are short and written for designers, not developers: what changed, what to look out for and who to call. A designer who knows that the cut list now groups pieces by stock length will notice if it does not. One who was not told will assume a strange-looking file is their mistake.

## Keep a way back

Every release can be undone. The office keeps the previous version's installer and its approval record, and rolling a seat back is the same push-and-confirm process as rolling it forward. Because generated files carry the tool version that made them, any variants produced by a faulty version can be found in the log and regenerated with the restored one.

## Trust: signing and security settings

Offices increasingly restrict which programs and macros may run, because macros and add-ins are a known route for malicious code. A tool that relies on everyone lowering their security settings is a tool that IT will, rightly, eventually block.

The configurator's installer and program files are digitally signed with a code-signing certificate held by the office. The office's IT provider configured the workstations to trust that signer, so the tool runs under normal security settings, and an altered copy of the tool would fail the signature check. The tool runs with the user's own permissions, and writes to the vault only through the vault's own interface. That means its actions are bound by the same permissions as the user's own, as Chapter 5's specification required.

## A failure case: the seat that missed an update

This is an illustration. Before the office moved to managed deployment, releases were installed by each designer from a shared folder, following a short instruction email. Version 1.4.0 added a column to the cut list, the total quantity of each piece across the whole order, which purchasing had asked for after three months of use. Their import was changed to expect the new column. Because it changed an output, it should have been a major release, but it was numbered at the time as a minor one.

Three weeks later, purchasing reported that some cut lists were arriving in the old format and had to be reformatted by hand. The generation log, which recorded the tool version for every variant, showed **nine** variants generated by version **1.3.0** after 1.4.0 had been released, all from one seat. The designer at that seat had been on leave when the email went out and had not installed the update on their return.

Two faults combined: the version number did not signal a change in output, and nothing stopped an old version from running. The corrections were:

1. Version numbering moved to the convention described above. Any change to an output's format is a major version, and the release notes say so prominently.
2. The tool now checks, at start-up, the approved version recorded in a small file beside the rule table. A seat running any other version refuses to generate and tells the user to update.
3. Installation moved to managed deployment, so no seat depends on someone reading an email.
4. The nine variants were found from the log and their cut lists regenerated in the new format. Purchasing confirmed none had been ordered wrongly.

The log made the repair a matter of minutes. Without version stamping, the office would have had to compare every cut list from the previous three weeks by eye.

```figure
type: checklist
title: Release checklist for a new configurator version
caption: This is an illustration of the office's checklist, run by the maintainer and signed by the rule owner.
- Version number chosen by the rules above; major if any output changes | release notes say what changed and what to watch
- Full test set passes on every approved CAD release | results attached to the release record
- Installer built, signed and tested on a clean machine | upgrade and uninstall both tested
- Approved-version file updated only when rollout reaches all seats | the version check enforces it
- Previous installer kept for a month | rollback rehearsed once a year
- x Installing from a shared folder by email instruction | seats drift apart
```

## How this applies to a small Australian business

Many small offices manage their computers with help from an outside IT provider. Involve them early, because they can deploy and sign the tool far more reliably than designers installing it by hand, and they will need to approve it under their security policies anyway. Keep the deployment arrangements in the specification and the support agreement, so that the tool is not stranded if the IT provider changes. A tool used on five seats deserves the same version control and rollback as one used on five hundred. The scale is smaller, but so is the tolerance for a lost day. If the office uses contract designers who work on their own computers, decide early whether they may run the tool at all. A seat outside the office's deployment and version check is exactly the seat that will drift, so the office in the running case gave contractors remote access to an office workstation instead.

## Exercise: choosing version numbers

The configurator is at version 2.1.0. For each change below, give the next version number and say whether the change needs a rule-table revision instead of, or as well as, a new tool version.

1. A message is reworded to name the rule more clearly.
2. A new customer-specific foot style is added, with its own rule and library part.
3. Generated files are renamed to a new scheme to suit a new vault.
4. The cross-member deflection limit in rule R3 is tightened.

**Worked answer.** (1) **2.1.1**, a patch: no output changes. (2) **2.2.0**, a minor version for the new capability, plus a rule-table revision for the new rule. Existing outputs are unchanged. (3) **3.0.0**, a major version, because generated file names are an output that the vault, drawings and references depend on. Plan its rollout and the handling of existing files carefully. (4) A **rule-table revision only**, with no new tool version, because the code applies whatever the table says. The boundary tests must be updated first, and the generation log will identify variants made under the old rule.
