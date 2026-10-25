---
book: cad-data-you-can-trust
chapterSlug: why-shared-folders-fail
order: 1
title: "Why shared folders fail for engineering data"
description: "See how CAD files depend on each other, why shared network folders break those dependencies, how to measure the damage with a file scan and what a vault does and does not fix."
draft: false
---

Shared network folders are the default home for CAD files in small businesses, and for a while they work well enough. Everyone can reach the files, the backup system copies them each night and nothing needs to be bought or configured. The problems appear gradually, as the number of files, people and products grows, and they appear in a particular way: not as one failure but as a background of small confusions, each cheap on its own, that occasionally line up into an expensive one.

This chapter explains why CAD data in particular strains a shared folder, measures the running case team's folder with a simple scan, and follows one of those expensive alignments from the workshop floor back to its cause. It ends by setting out what a product data management vault changes and, just as important, what it does not.

## CAD files depend on each other

A word-processing document is mostly self-contained. A CAD file usually is not. An assembly stores a list of the parts and subassemblies it contains, and for each one it records where the file was found. A drawing records which model its views come from. A part may record references to other parts it was designed against. These records are, in most systems, stored as file names and paths.

The consequence is that the meaning of a file depends on other files being where it expects them, with the names it expects, in the state it expects. Change any of those and the dependent file changes meaning, sometimes visibly with an error message and sometimes silently by loading a different file with the same name.

```figure
type: tree
title: What one pump skid assembly depends on
caption: This is an illustration from the running case. Each line is a stored reference to another file; a skid assembly in the team's folder typically holds several hundred.
- Skid general arrangement drawing | references the top assembly
  - Skid top assembly | references subassemblies and parts by path
    - Baseframe weldment | references its plates, channels and gussets
      - Pump mounting plate | used in other skids as well
    - Pump and motor set | purchased models, references a coupling guard
    - Pipework subassembly | references pipes, flanges, valves and supports
      - Valve models | library parts, shared with every skid
```

A shared folder knows none of this. It stores files and their names. It cannot tell anyone that the pump mounting plate is used in fourteen assemblies, that renaming a valve model will break every skid, or that two people have the same baseframe open for editing. Every one of those facts has to live in people's heads.

## Five ways shared folders fail

The failures follow from the dependency problem. In the running case team, all five had happened in the previous two years.

```figure
type: compare
title: Five failures of CAD data on shared folders
cols: What happens | How it is usually noticed
caption: This is an illustration. Each failure arises because the folder stores files but not the relationships between them.
- Overwrite | two people edit the same file; the last save wins | someone's work disappears
- Broken references | a file is moved or renamed outside the CAD system | assemblies open with missing components
- *Wrong copy | a copy of a part is edited instead of the one the assembly uses | the workshop makes the unchanged part
- No where-used | nobody can see which assemblies use a part before changing it | an unexpected change appears in another product
- No release state | released files can be edited like any other | a printed drawing no longer matches the file
```

The third failure, the wrong copy, deserves attention because it is the hardest to see. Copies accumulate on shared drives for sensible reasons: someone saves a backup before a risky change, or copies a project folder to start a similar job. Each copy is a complete, valid file with the same name as the original. Nothing marks one as current.

## Measure the folder

Before deciding anything, the team measured its shared folder. The measurement needed no special software: a listing of every file with its name, folder, size and dates, exported to a spreadsheet, plus a report from the CAD system's own tools of which assemblies had references it could not resolve.

```figure
type: stats
title: Scan of the team's shared CAD folder
caption: This is an illustration. Duplicate names are files whose name appears in more than one folder; missing references are counted per assembly.
- 41,600 | CAD files | 186 GB in total
- 6,350 | files sharing a name with another file | about 15.3% of all files
- *212 | assemblies with at least one missing reference | about 5.3% of 3,980 assemblies
- 1,870 | files with "copy", "old", "backup" or a date in the name | informal versioning
```

Each number points to one of the five failures. The **6,350** files sharing a name with another file are candidates for the wrong-copy failure: whenever an assembly searches for a part by name, it may find the wrong one. The **212** assemblies with missing references, **212 ÷ 3,980 ≈ 5.3%**, are the visible scars of broken references. The **1,870** files with "copy", "old" or dates in their names show people inventing their own version control because the folder offered none.

Not every duplicate name is a problem. Two unrelated projects may each have a file called "bracket", and if neither is ever referenced from the other's assemblies, no harm follows. The scan cannot tell harmless duplicates from dangerous ones; it shows the size of the space in which the dangerous ones hide.

## The error case: the plate that was not changed

The incident that settled the team's decision began with a design change. A customer's specification required a larger pump on an existing skid design. The designer updated the pump mounting plate, moving its four holes outward and increasing its thickness, and updated the drawing. The drawing was checked, approved and sent to the fabricator, who cut six plates.

At fit-up, the new pump would not sit on the plates. The holes were in the old positions. The fabricator had cut what the drawing showed, and the drawing showed the old plate.

The investigation took most of a day. The designer had opened the plate from a folder called "Skid 40 - old" that had been copied as a backup during an earlier project. That copy carried the same file name as the current plate in the main project folder. The designer edited the copy, saved it and opened its drawing, which also lived in the old folder. Everything looked correct on screen. The approved drawing was made from the copy. The skid assembly, meanwhile, still referenced the original plate in the main folder, so the assembly and its bill of materials showed the old geometry, and nobody compared them.

The direct cost was six plates scrapped, about **A$1,840**, and about seven hours of rework across the designer, checker and fabricator's liaison, **7 × 95 = A$665**, for **A$2,505** in all, plus two days of delay to the customer. Nobody had been careless in an unusual way. The designer had opened a file with the right name, from a folder they could reach, and the folder offered no signal that it was the wrong one.

```figure
type: steps
title: How the wrong plate reached the fabricator
caption: This is an illustration. Each step was reasonable on its own; the shared folder gave no signal at any of them.
- Copy | an earlier project copied the skid folder as a backup, duplicating every file name
- Open | the designer opened the plate by name from the old folder
- Edit and detail | the copy and its drawing were updated and looked correct
- Approve | the checker checked the drawing, not its relationship to the assembly
- *Fabricate | the fabricator cut six plates from a drawing of the wrong file
- Detect | the pump did not fit at assembly
```

The immediate correction was to delete the old backup folder after confirming nothing current referenced it, update the real plate and reissue the drawing. The lasting correction was the decision this book follows: to move the team's data into a system that knows which file is which.

## The people who never open the CAD system

The nine CAD users are not the only people who depend on the folder. Fourteen others in production, purchasing and quality use drawings every day. Most of them open PDF files or print drawings from a folder of exported PDFs that the drafters maintain by hand. That folder has its own version of every failure above. A PDF exported before a revision may sit beside the one exported after it. A drafter may forget to export at all, so the PDF lags the drawing. A printed copy taped to a workbench may outlive both.

For these people, the question is not how references work but which drawing to trust. They cannot open the model to check. They rely on the revision letter, the date and the folder, and on someone having removed the superseded print. In the running case team, the quality inspector kept a private list of drawings they had found out of date, because there was no other way to know. The list was careful and useful, and it existed only on one person's computer, which made it another single point of failure in a system already full of them.

Any solution must serve these people as well as the designers. A vault that keeps CAD files in order but leaves the PDF folder as it was has fixed half the problem. Chapter 4 returns to this when it defines release, and Chapter 10 when it deals with copies that leave the building.

## Interim measures while deciding

Choosing and implementing a vault takes months. The team's losses continue in the meantime, and some cheap measures reduce them without waiting:

- **Stop making backup copies inside project folders.** The nightly backup already keeps history. Copies made "just in case" are the raw material of the wrong-copy failure, and the team agreed to stop making them and to move existing ones out of the project tree.
- **Rename and move files only from within the CAD system**, or with its own file-management utility, which can update references. Renaming in the operating system's file manager breaks them.
- **Check the assembly, not just the drawing**, when approving a change to a shared part. Opening the assembly and confirming that it shows the change would have caught the plate error before fabrication.

None of these is a substitute for a vault. Together they cost nothing and reduce the rate of new damage while the real solution is prepared.

## What a vault changes

A product data management system, often shortened to PDM, stores CAD files in a managed repository, usually called a vault, alongside a database that records facts about them. The details vary between products, but most offer the same core functions.

- **One copy, many versions.** Each file exists once in the vault. Saving a change creates a new version of that file rather than a new file, and earlier versions can be retrieved.
- **Check-out and check-in.** A person checks a file out to edit it, and others can see that it is checked out. This prevents the overwrite failure.
- **Managed references.** The vault records which files reference which. It can show where a part is used before anyone changes it, and it can rename or move files while updating every reference.
- **States and permissions.** Files move through states such as work in progress, in review and released, and permissions change with the state. A released file cannot be edited without a controlled change.
- **Search by properties.** Files can be found by part number, description or any other property, not only by name and folder.

Each of these addresses one or more of the five failures. The plate incident would have been prevented twice over: there would have been no second copy with the same name, and the where-used view would have shown that the plate the designer was editing was not the one the skid used.

## What a vault does not fix

A vault is not a cure for poor data. It stores whatever it is given. If part numbers are inconsistent, properties are blank or models are fragile, the vault will hold inconsistent, blank and fragile files, now with version history. If the team migrates its 6,350 duplicate names without resolving them, the vault will contain the same ambiguity under a new roof.

A vault also brings its own costs. It must be bought or subscribed to, installed, configured, backed up and upgraded. People must learn to check files in and out. Someone must administer it. For a team of nine, these costs are real, and they should be weighed against the losses the team actually measures rather than against a vendor's description of the benefits.

The following chapters deal with the work that makes a vault worth having: settling numbering and naming, understanding references, defining revisions and release, designing states and permissions, migrating carefully, backing up properly and keeping the system working through licences and upgrades. READOS's chapter on [product data management for small teams](/reados/collections/engineering-design-practice/product-data-management-for-small-teams/) gives a shorter overview of the same ground.

## Count the losses before deciding

The plate incident was the most visible failure, but not the only one. The engineering manager asked the team to list every data-related incident they could remember from the past twelve months and estimate its cost. The list was imperfect, as memory always is, but it gave an order of magnitude.

There were five incidents in which the wrong file reached a supplier or the workshop, including the plate, at an average cost close to the plate's. There were frequent smaller losses: time spent repairing assemblies with missing references, waiting for a colleague to close a file and searching for the current version of a part. The team did not try to put a precise figure on those, but noted that the 212 assemblies with missing references would each need repair whenever they were next opened.

That list is the starting point for any decision. It does not need to be precise to be useful. It needs to be honest, and it needs to be kept, so that the effect of the vault can later be compared with something better than a general impression.

## Exercise: estimate the annual cost

The team estimates that, in a typical year, five wrong-file incidents occur at about A$2,500 each. In addition, each of the nine CAD users loses about 30 minutes a week to searching for current files, repairing references or waiting for others to close files. Over 46 working weeks, at A$95 an hour, what is the estimated annual cost? What would you want to know before comparing it with the cost of a vault?

**Answer.** Wrong-file incidents cost about **5 × 2,500 = A$12,500**. Lost time is **9 × 0.5 × 46 = 207 hours**, worth **207 × 95 = A$19,665**. The total is about **A$32,165 a year**.

Before comparing, ask how much of that loss a vault would actually remove. It should prevent most overwrites and wrong-copy incidents, but searching time falls only if numbering and properties are good enough to search on, which is the subject of the next chapter. Ask also what the vault will cost in licences, server, administration time and migration effort, including the effort of cleaning data before it goes in. A vault that removes two-thirds of the loss is valuable; one that removes a third may still be, but the case is closer and depends on the cost side.
