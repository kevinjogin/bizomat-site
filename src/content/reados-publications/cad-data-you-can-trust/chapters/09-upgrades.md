---
book: cad-data-you-can-trust
chapterSlug: upgrades-and-service-packs
order: 9
title: "Upgrades and service packs without stopping work"
description: "Decide when to take a CAD or vault upgrade, test it against a regression set of the team's own files, pilot it, cut over everyone together and keep a tested way back."
draft: false
---

CAD software changes every year. Major releases add features, change file formats and sometimes alter how existing features calculate. Service packs between them fix faults and occasionally introduce new ones. A vault adds its own upgrade cycle, which must stay compatible with the CAD software it serves. Each upgrade is an opportunity and a risk, and in a team where everyone shares the same files, it is a risk that affects everyone at once.

This chapter plans an upgrade for the running case team: deciding when, testing against the team's own files, piloting, cutting over and keeping a way back. Its error case is one designer who upgraded early and, without meaning to, made shared files unreadable to everyone else.

## The compatibility rule that drives everything

Most parametric CAD systems can open files saved by older releases but cannot open files saved by newer ones. Once a file has been opened and saved in a new major release, it is converted, and colleagues still on the old release may be unable to open it at all. Vendors publish their own compatibility statements, and some offer limited ways to work across adjacent releases, but the safe assumption is that saving in a new release is a one-way door.

That rule is why a team sharing files must upgrade together. It is also why the decision about when to upgrade is not a personal one. A single person on a newer release can convert shared files, one save at a time, without any warning to the rest of the team.

Service packs within a release usually do not change the file format, so files move freely between service packs of the same release. They can still change behaviour, which is why they need testing too, but they do not carry the one-way risk.

## Decide when to upgrade

A new major release is usually most attractive and least reliable when it first appears. The team's policy is to wait for the release to mature through its first service packs before planning an upgrade, unless a specific new feature is needed sooner. That policy trades early access to features for the benefit of other customers having found the worst faults first.

Other factors set the timing:

- **Customers and suppliers.** If a customer requires native files in a particular release, the team cannot move beyond it for that customer's work without an agreement.
- **Add-ins and the vault.** Every add-in and the vault client must support the new release. The vault server may need upgrading first.
- **Project milestones.** An upgrade should not land in the week before a major release of drawings for a new skid.
- **Support.** Vendors support older releases for a limited period. Staying too far behind eventually means running software that no longer receives fixes.

The Australian Signals Directorate's Essential Eight includes patching applications among its baseline strategies, because unpatched software is a common route for attackers. For CAD software, that is an argument for keeping service packs reasonably current within the team's chosen release, through the tested process below, rather than for rushing to each new major release.

## Build a regression set

A regression set is a collection of the team's own files used to check that a new release behaves like the old one. The team's set has **50** files, chosen to cover what matters:

- the three largest skid assemblies, for performance and stability;
- ten configured parts and assemblies, including the baseframe family, for rebuild behaviour;
- ten drawings of different kinds, for annotation and view behaviour;
- ten library and purchased parts, including imported neutral-format models;
- ten parts with complex features, such as sheet metal and weldments;
- seven files that have caused trouble before, kept because they are good at finding faults.

For each file, the team records reference values from the current release: whether it rebuilds without errors or warnings, its mass, its bounding box and, for the large assemblies, the time to open and rebuild. For drawings, it keeps a PDF from the current release for side-by-side comparison.

## Test before anyone upgrades

The test runs on a separate machine with the new release and a test copy of the vault, never on the live vault. Each file in the regression set is opened, rebuilt and compared with its reference values.

```figure
type: stats
title: Regression test of the new release on 50 files
caption: This is an illustration. Three differences needed investigation before the upgrade could go ahead.
- 50 | files tested | from the team's own regression set
- 47 | matched the reference values | rebuild, mass, size and drawing appearance
- *3 | differed | one mass change, one drawing dimension moved, one slow rebuild
```

The three differences were investigated one by one.

- A sheet metal part's mass changed by about 0.2%. The new release calculated a bend region slightly differently. The engineer judged the change negligible for the part's purpose but noted that drawings showing mass would update on their next revision.
- A drawing dimension attached to a hole edge moved to a different edge after rebuild. The dimension had been attached to a model edge rather than to a stable reference. The fix was to reattach it in the current release before upgrading, which removed the problem.
- A large assembly rebuilt about 30% more slowly. The cause was a changed default for a display option in the new release. Setting it to match the team's existing value restored the original speed, and the setting was added to the controlled settings for the new release.

None of these would have stopped the upgrade, but each would have caused confusion if discovered on the first morning by a designer under deadline pressure.

## Upgrade the environment, not just the software

The CAD software sits inside an environment the team has built: controlled settings, templates, a standard-part library, scripts and the vault's own configuration. A new release can affect each of them, and the regression set tests only some.

Before the pilot, the administrator worked through the environment item by item. The controlled settings file was exported from the new release, because new releases add options and occasionally rename old ones; the new options were classified and the file was saved as a new revision. Each template was opened in the new release, checked and saved as a new revision, so that new files would not start life in the old format and convert on first save. Every script the team relies on, including the property checks run before release, was run against files with known faults to confirm it still reported them. The library's fastener generator data was checked for any change in how sizes were defined.

Each of these steps took minutes. Skipping them would have meant discovering, one at a time over the following weeks, that a script silently passed files it should have rejected or that new drawings carried an old template's settings.

## Pilot with real work

After the regression test, two designers use the new release for about three weeks on real work, in a separate project area of the test vault or on a project that will not be shared with old-release users during the pilot. The pilot's purpose is to find what the regression set missed: everyday behaviour, add-in quirks, training needs.

The pilot users keep a log of anything different, however small. In the team's pilot, the log recorded fifteen items. Most were cosmetic. Two led to changes in the controlled settings, and one led to a short note in the written standard about a renamed command.

## Cut over everyone together

Because of the one-way compatibility rule, the team upgrades all nine CAD seats on one day. A plan for that day looks like the vault cutover in Chapter 6, on a smaller scale.

```figure
type: timeline
title: Upgrade cutover for nine CAD seats
caption: This is an illustration. The vault and add-ins are upgraded before any CAD seat, and nobody saves in the new release until everyone has it.
- Thursday | Check in | everyone checks in all work; nothing left checked out
- Thursday evening | Vault server | upgraded and tested by the administrator; backup taken first
- Friday morning | CAD seats | new release deployed to all nine seats from the tested installation image
- Friday midday | Verify | each seat opens the regression assemblies; settings comparison run
- *Friday afternoon | Release to users | short briefing on the differences found in testing and the pilot
```

The installation image is the same one tested in the regression and pilot stages, with the team's controlled settings, so that every seat starts identical. Deploying from one tested image is the main defence against the drift that individual installations create.

Files are not mass-converted to the new release. They convert as they are opened and saved in the course of normal work. Released files that nobody changes stay in the old format, which is harmless, because the new release can open them.

## The error case: one seat ahead

During the previous upgrade cycle, before the team had this process, one designer received the new release with a new laptop. IT installed the latest version by default. The designer worked as usual, opening and saving files from the shared drive.

Over two days, the designer saved **23** shared files in the new release, including the library model of a common valve used in every skid. On the third morning, three colleagues found that assemblies containing that valve would not open, and other files failed one by one as they were reached. The old release could not read files the new one had saved.

The cause was found quickly, because the failing files all had recent save dates by the same person. The fix was not quick. On the shared drive, the only earlier copies were in the previous night's backup, which predated some of the designer's legitimate changes. The team restored the 23 files from backup, and the designer redid two days of changes on an old-release seat. About a day and a half of work was lost in all, and the valve's library file was briefly missing from every assembly in the business.

In the vault, the same mistake has a smaller cost and a quicker fix. Every check-in creates a version, so the version before the conversion is still there and can be restored without touching anyone's other work. The team also added two controls. The vault's client checks the CAD release on each seat and refuses check-in from a release other than the team's current one, and new machines are built only from the team's tested installation image, as Chapter 8 required.

## Count what an upgrade costs

An upgrade is not free even when the licence includes it. The team estimated the internal effort for a major release so that the engineering manager could plan for it and compare it with the benefit of the new features.

```figure
type: stack
title: Internal effort for one major upgrade
unit: hours
caption: This is an illustration. The pilot figure assumes the two pilot users lose about a tenth of their time over three weeks of 38 hours.
- Regression test and investigation | 8
- Pilot overhead, 2 users × 3 weeks × 38 h × 10% | 22.8
- Cutover, nine seats at about 1 hour each | 9
- Administrator preparation and vault upgrade | 6
- Briefing, nine people for half an hour | 4.5
```

The total is **8 + 22.8 + 9 + 6 + 4.5 = 50.3 hours**, about **A$4,779** at the internal rate. That is a modest cost for a team of nine, but it is large enough that upgrading every year for its own sake deserves a question. The team upgrades major releases roughly every second year, unless a new feature or a customer requirement justifies sooner, and keeps service packs current within the release in between.

## The vault has its own upgrades

The vault server and its clients follow their own release cycle, and they must stay compatible with the CAD release. Usually the vault must be upgraded first, because a newer vault can serve older CAD clients, but an older vault may not understand files from a newer CAD release. The vendor's compatibility table decides the order.

A vault upgrade often changes the database structure, which makes the backup before it essential. The team takes a full, consistent backup immediately before any vault upgrade, verifies it by checking its version records as Chapter 7 describes, and keeps it beyond the normal retention period until the upgraded vault has run cleanly for a month.

## Keep a tested way back

Every upgrade plan needs a way back. For a service pack, most vendors provide a way to roll back an individual installation to the previous service pack, which the team tests during the regression stage. For a major release, there is no rollback for files saved in the new format, so the way back is the vault's versions and the backup taken before the upgrade.

The team writes the rollback steps into the upgrade plan before starting and sets a decision point: if a serious problem appears in the first two days, before many files have been saved in the new release, the team can return to the old release and restore any converted files from their previous vault versions. After that point, rolling back costs more than fixing forward, and the plan says so.

## Exercise: plan around a deadline

The new release has passed its regression test with no unresolved differences. The pilot ends on the 14th of the month. A major drawing release for a new skid is due on the 22nd, and the team is busy until then. The next quiet period starts on the 28th. A customer has asked for native files in the new release by the 5th of the following month. When would you cut over, and why?

**Answer.** Cut over in the quiet period starting on the **28th**. Upgrading between the 14th and the 22nd would put the change in the busiest week, before an important release, when any surprise costs most. Upgrading on the 28th leaves about a week before the customer's date to resolve problems and send the native files.

If the customer's date were earlier, the alternative would be to prepare the customer's files on a single new-release seat isolated from shared work, with the vault check-in control preventing those files from being saved back into the shared project in the new format, and to cut over the rest of the team later. That is more complicated and is worth doing only if the customer's date cannot move.
