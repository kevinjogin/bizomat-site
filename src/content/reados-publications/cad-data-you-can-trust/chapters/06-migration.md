---
book: cad-data-you-can-trust
chapterSlug: migrating-legacy-files-into-a-vault
order: 6
title: "Migrating legacy files into a vault"
description: "Choose which legacy CAD files to import, resolve duplicate names by reference rather than by date, map old properties, pilot the import, validate assemblies by mass and cut over cleanly."
draft: false
---

Migration is where a vault project succeeds or fails. The software can be installed in a day; the data takes weeks. Every fault in the old shared drive, the duplicate names, the broken references, the inconsistent properties, is waiting to be imported along with the good files. A migration that simply copies everything into the vault produces a well-organised version of the old mess, with version control applied to its mistakes.

This chapter plans the running case team's migration: deciding what to import, resolving duplicates, mapping properties, running a pilot, validating the result and cutting over. It estimates the effort. Its error case is a duplicate-resolution rule that looked sensible and connected an assembly to the wrong part.

## Decide what to import

Not every file deserves a place in the vault. The team's 41,600 files included years of work on products no longer made, abandoned concepts and the backup copies discussed in Chapter 1. Importing all of them would multiply the clean-up effort and fill the vault's search results with noise.

The team defined an **active set**: any file modified in the last six years, plus every file referenced by an assembly in that group, however old. The second condition matters. An old library valve last modified eight years ago may be used in every current skid; excluding it would break every current assembly.

```figure
type: funnel
title: From the shared drive to the vault
caption: This is an illustration. The active set is about 43% of the files; the rest stay on a read-only archive share.
- Files on the shared drive | 41600
- *Active set to import | 17900
- Name clashes to resolve within the active set | 2140
```

The active set contained **17,900** files, about **17,900 ÷ 41,600 ≈ 43%** of the total. The remaining **23,700** files were left on the old share, which was made read-only on the day of cutover. They remain searchable and can be opened for reference, and any one of them can be imported later if it is needed for new work.

Leaving files out feels risky to people who have spent years making them. Two arguments helped. First, nothing was deleted: the archive share is backed up and kept. Second, every file left out is one fewer file to clean, map and validate, which made the migration achievable in weeks rather than months.

## Resolve duplicate names

Chapter 2 made file names equal to part numbers, so the vault cannot hold two files with the same name. The active set contained **2,140** files whose names clashed with at least one other file. Each clash had to be resolved before import.

The clashes fell into three kinds, the same three found in any library clean-up:

- **Exact duplicates**, identical in content, usually backup copies. These collapse to one file, and every reference to any copy is pointed at the survivor.
- **Different versions of the same item**, such as an old and a newer plate with the same name. One is current; the others are history. The current one is imported; the others go to the archive.
- **Different items with the same name**, such as two unrelated parts both called "bracket". Both are imported, each receives its own number, and references are pointed at the right one.

Deciding which kind a clash belongs to, and which file is current, is the hard part. The obvious rule is to pick the newest file. The error case shows why that rule is not good enough.

## The error case: newest is not always current

The team ran a pilot migration on one complete project, 1,240 files including 186 assemblies. For the pilot, clashes were resolved by a simple rule: where two files had the same name, the one with the latest modification date was treated as current, and references to the other were pointed at it.

Among the clashes were two files called "baseplate". One was the baseplate of a pump-and-motor set used in the project's main skid. The other was a different, smaller baseplate for an instrument stand, created later in another project folder and copied into the pilot project's folder as a reference. The instrument stand's file was newer. The rule treated it as the current version of the pump baseplate, and the import pointed the main skid's assembly at it.

The error was caught by the validation step the team had built into the pilot. Before import, the administrator recorded the mass and bounding box of every assembly in the project. After import, the same values were recorded from the vault. Of the **186** assemblies, **4** showed a change in mass. In the main skid the mass had fallen by the difference between the two baseplates, and its bounding box had shrunk. The other three were subassemblies containing the same baseplate.

```figure
type: compare
title: Pilot validation by mass and bounding box
cols: Before import | After import with newest-wins rule | After correction
caption: This is an illustration. A change in mass or size after import means a different file has been loaded; it should be zero for every assembly.
- Assemblies checked | 186 | 186 | 186
- *Assemblies with a mass change | | 4 | 0
- Assemblies with a size change | | 2 | 0
- Assemblies with missing components | 9 | 0, all repointed | 0
```

The correction was to change the rule. Clashes are now resolved by following references: for each file name, the migration tool lists which assemblies reference which physical file, and each assembly keeps the file it actually referenced on the shared drive. Only where an assembly's reference was already broken does a person decide, using the mass, size and description to choose. Dates are used as a hint, never as the rule. With the corrected rule, the pilot was repeated and all 186 assemblies matched.

The validation by mass and bounding box became a permanent part of the migration. It is cheap, because the CAD system can report both for a batch of assemblies, and it detects exactly the failure that matters: an assembly that silently loads a different file.

## Map the old properties

The shared drive's files carried properties under many names, accumulated over years from different templates. The team found **23** distinct property names in the active set that held information the vault needed. They mapped them to the vault's **12** controlled properties, recording each mapping in a table.

Most mappings were straightforward: "Desc", "Description" and "DESCRIPTION" all map to the vault's description. Some needed rules. The old intelligent part number, such as SK-BF-31, maps to the vault's legacy number property, as Chapter 2 described, and the file name for old items becomes the normalised legacy number. Properties with no equivalent were left on the files but not mapped, so they remain readable without cluttering the vault's searches.

The mapping table was tested on the pilot project before the full import. The test found two problems: a date property stored in two different formats, and a material property holding free text that did not match the vault's list. Both were corrected by the mapping rules rather than by editing files by hand.

## Repair the references that matter

Chapter 3 counted 212 assemblies with missing references across the whole shared drive. **131** of them were in the active set. Each needed repair before import, because an assembly imported with a missing reference is imported broken. At the Chapter 3 average of 12 minutes each, the repairs needed about **131 × 12 ÷ 60 = 26.2 hours**.

The other 81 broken assemblies were in the archive and were not repaired. If any of them is needed later, it will be repaired when it is imported, by someone who knows why they need it.

## Estimate the effort

The team estimated the whole migration before starting, then tracked actual time. The estimate, by task, was:

```figure
type: stack
title: Estimated people-hours for the migration
unit: hours
caption: This is an illustration. The import itself, about 12 hours of machine time, is excluded because it runs unattended.
- Identifying the active set and resolving clashes | 60
- Property mapping and testing | 12
- Pilot migration and corrected rerun | 24
- Repairing 131 broken assemblies | 26.2
- Validation of mass and bounding box | 16
```

The total is **60 + 12 + 24 + 26.2 + 16 = 138.2 people-hours**, about **A$13,129** at the internal rate. The import tool processed about 1,500 files an hour, so importing 17,900 files took about **17,900 ÷ 1,500 ≈ 11.9 hours** of machine time, run over a weekend.

Clash resolution was the largest item and the hardest to estimate, because each of the 2,140 clashes takes anywhere from seconds, for an exact duplicate, to many minutes, for two different items that need investigation. The team tracked actual time weekly and adjusted. The final figure was about 15% over the estimate, almost all in clash resolution.

## Prepare people as well as data

A vault changes daily habits. Designers who have always opened files by browsing folders must learn to search, check out and check in. Drafters who exported PDFs by hand must learn that release does it for them. Viewers who printed from a folder of PDFs must learn where the current folder now lives. If these changes are first met on go-live morning, the first week is spent on frustration rather than work.

The team set up a small training vault three weeks before cutover, loaded with a copy of the pilot project. Every CAD user spent two hours in it, working through a short script: find a part by description, check it out, change it, check it in, submit it for review, and copy an assembly using the vault's copy tool rather than the file manager. The approvers practised reviewing, rejecting and releasing. Viewers were shown, in a fifteen-minute session, where released PDFs would appear and how to tell they were current.

The training vault found problems as well as teaching people. Two designers' seats had CAD add-ins that conflicted with the vault's own add-in, which IT fixed before cutover. The search was configured to show the description and legacy number in its results, after several people tried to find parts by the names they remembered. And the check-in step was found to be slow on one seat with an unusually large local cache, which was resolved by changing the local working folder.

Spending about **9 × 2 = 18** person-hours on training before cutover was not in the original estimate, and it was the best use of time in the project. The questions on Monday morning were about details, not about how the vault worked.

## Cut over cleanly

Cutover is the moment when the shared drive stops being the place where work happens and the vault starts. A clean cutover has a defined freeze, a defined start and no period when both places are live.

```figure
type: timeline
title: The team's cutover weekend
caption: This is an illustration. The freeze stops changes to the shared drive; the read-only switch makes the freeze impossible to ignore.
- Friday 3 pm | Freeze | all files closed; shared drive set read-only for CAD users
- Friday 4 pm | Final backup | full backup of the shared drive, verified
- Saturday | Import | 17,900 files imported; about 12 hours of machine time
- Sunday | Validate | mass and bounding box checked for every active assembly; spot checks of drawings
- *Monday 8 am | Go live | users work from the vault; administrator and backup available all day
```

Two details made the cutover work. First, the shared drive was set to read-only rather than merely being declared frozen. A declaration is ignored by the one person who needs to save one last change. Second, the administrator and the backup engineer kept Monday free of other work. The first morning in a new system raises dozens of small questions, and answering them quickly sets the tone for the weeks that follow.

Validation found three assemblies in the full import with unexpected mass changes. All three were traced to clashes that a person had resolved incorrectly, and all three were corrected on Sunday afternoon before anyone started work.

## After cutover

The weeks after cutover always produce surprises: a file that should have been in the active set, a property mapping that was wrong for an unusual case, a designer who kept a local copy and edited it. The team logged each one and resolved it, and the log's length fell from about a dozen items a day in the first week to one or two a week after a month.

The archive share stays read-only. Anyone who needs a file from it imports it through the administrator, who checks it for clashes and references like any migrated file. In the first six months, 46 archived files were imported this way, a small fraction of the 23,700 left behind, which confirmed that the active-set rule had been about right.

A month after cutover, the administrator repeated the measurements from Chapter 1 against the vault. Duplicate file names were impossible by design and numbered zero. Assemblies with missing references in the active set numbered zero. Files with "copy", "old" or a date in their names numbered a handful, all legacy files imported under their normalised old numbers, and none had been created since. Those three numbers, set against the 6,350, 212 and 1,870 of the original scan, became the team's simplest evidence that the migration had done what it was meant to do.

## Exercise: estimate a second migration

The team acquires a small competitor's product line. Its data arrive on a hard drive: 9,600 CAD files, of which an initial scan suggests about 3,800 belong to products the team will continue to make. Assume the same rates as the main migration: clash resolution and active-set work in proportion to the active files, 12 minutes per broken assembly, and an import rate of 1,500 files an hour. The scan finds 40 broken assemblies in the active portion. Estimate the clash resolution, repair and import effort.

**Answer.** In the main migration, active-set work and clash resolution took about **60 hours** for **17,900** files, about **0.00335 hours per file**. For **3,800** files that suggests about **3,800 × 60 ÷ 17,900 ≈ 12.7 hours**, though the true figure may be higher because the competitor's naming conventions are unfamiliar and may clash more often with the team's existing files. Repairs take **40 × 12 ÷ 60 = 8 hours**. The import takes about **3,800 ÷ 1,500 ≈ 2.5 hours** of machine time.

Add a pilot and validation, which are not optional, and a property mapping exercise, since the competitor's properties will differ from both the team's old and new schemes. A cautious plan would allow about 40 people-hours in total and would treat the 3,800 estimate as uncertain until the active set is properly defined.
