---
book: cad-data-you-can-trust
chapterSlug: references-where-used-and-safe-copying
order: 3
title: "References, where-used and safe copying"
description: "Understand how assemblies and drawings find the files they reference, check where a part is used before changing it, and copy, rename and reuse designs without breaking anything."
draft: false
---

Every CAD assembly is a web of references, and every reference is a small act of faith that a file will be found where it was last seen. Most of the time that faith is rewarded. When it is not, the result ranges from an irritating error message to a silent substitution that nobody notices until a part is made wrong. Understanding how references work, and how to change files without breaking them, is the most practical knowledge a CAD team can have about its data.

This chapter explains how CAD systems store and resolve references, introduces the where-used check that should precede any change to a shared part, and describes safe ways to copy, rename and reuse designs. It costs the running case team's 212 broken assemblies. Its error case is a design change that reached fourteen assemblies when only one was intended.

## How a reference is stored and found

When an assembly is saved, most CAD systems record, for each component, the name of the component's file and the path where it was found. When the assembly is opened again, the system tries to find each component. The exact search order varies by product and by settings, but it typically includes some combination of:

- files already open in the session;
- the stored path;
- the folder containing the assembly;
- folders listed in the system's search settings.

If the file is found at the stored path, all is well. If not, the system looks elsewhere, and may load a file with the same name from a different folder. If nothing is found, the component is reported missing.

```figure
type: decision
title: What happens when an assembly opens a component
question: Is the component's file at its stored path?
caption: This is an illustration of the general pattern. Search orders differ between products and settings, which is why the team controls them centrally.
- Yes | Loaded as saved | the normal case
- *No, but a file with the same name exists elsewhere in the search path | Loaded from the other location | may be a different version, or a different part with the same name
- No, and nothing with that name is found | Reported missing | the assembly opens with a gap that must be repaired
```

The middle branch is the dangerous one. It succeeds silently. The assembly opens, the component appears, and nothing tells the user that it came from a different place than before. On a shared drive full of duplicate names, it is how the wrong copy gets into a bill of materials.

Drawings follow the same pattern for the models their views show. A drawing opened when its model has moved may show a different model with the same name, or show nothing.

## Paths that mean different things on different seats

A stored path is only as reliable as the way it was written. On a Windows network, the same shared folder can be reached through a mapped drive letter, such as P:, or through its full network name, which begins with two backslashes and the server's name. If one seat maps the share as P: and another as S:, an assembly saved on the first seat stores paths beginning with P:, and the second seat will not find them there.

The running case team found this in its scan. About a third of the 212 broken assemblies opened correctly on some seats and not on others, because their stored paths used a drive letter that only some seats had. Nobody had noticed, because each person usually opened their own work on their own seat.

Two habits prevent the problem on a shared drive. Map every share to the same letter on every seat, set centrally rather than by each user, or use full network names throughout. And point the CAD system's library and template locations at the same form of path on every seat. In a vault, the problem largely disappears, because files are retrieved to a local working folder whose path the vault controls, but the library and template locations still need the same care.

## References inside the design

Not every reference is a component in an assembly. Many CAD systems allow a part's geometry to be defined from another part, for example sizing a cover from the opening it covers. These in-context or external references are stored alongside the component references, and they break in the same ways when files are moved or renamed. They also create a dependency that the where-used view may not make obvious: the cover changes when the opening changes, even if nobody opens the cover.

The team treats these references as a design decision rather than a data problem. Its modelling rules allow them during concept work and require them to be removed or locked before release, so that a released part's geometry depends only on its own features. From a data point of view, the important thing is to know they exist. The pre-release check described below includes a report of external references for that reason.

## Rename and move only through tools that understand references

Renaming or moving a file in the operating system's file manager changes its name or path but leaves every reference to it unchanged. Every assembly and drawing that used it will look in the old place, fail, and then either find something else or report a missing file.

CAD systems and vaults provide their own tools for renaming and moving files. These tools find the files that reference the one being changed and update their stored references at the same time. On a shared drive, such a tool can only update references in the files it is told to search; in a vault, it can use the vault's record of every reference and update all of them.

The running case team's 212 broken assemblies were mostly the result of renaming and moving in the file manager. Over several years, people had tidied folders, corrected spelling in file names and moved projects to archive folders. Each action was reasonable and each broke references that nobody saw until the next time the assembly was opened.

## Cost the broken references

Each broken assembly needs a person to open it, identify the missing components, find the right files and repoint the references. The team timed a sample of repairs and found they averaged about **12 minutes**, with a wide spread: a single missing fastener takes a minute, while an assembly whose whole subassembly folder had moved could take an hour.

```figure
type: formula
title: Effort to repair the broken assemblies
formula: Repair hours = assemblies × average minutes ÷ 60
caption: This is an illustration. The average hides a wide spread; the largest repairs need care because a wrong file can be chosen.
- Assemblies with missing references | 212
- Average repair time | 12 minutes
- Internal cost rate | A$95 an hour
step: Repair hours = 212 × 12 ÷ 60 = 42.4 hours
step: Cost = 42.4 × 95 ≈ A$4,028
```

The repair work is not urgent for assemblies that nobody will open again. It becomes urgent when the assembly is needed, which tends to be at a busy moment: a customer orders a spare part for an old skid, or a new design reuses an old subassembly. Chapter 6 deals with the repairs that are worth doing during migration and the ones better left in the archive.

## Check where-used before changing a shared part

A part used in one assembly can be changed with attention to one assembly. A part used in many needs attention to all of them. On a shared drive, finding every assembly that uses a part means opening assemblies one by one or running a search tool across the whole drive, which is slow enough that people rarely do it.

A vault records every reference, so it can answer the question "where is this part used?" instantly. The answer is the most important input to any change. It tells the designer which assemblies will see the change, which drawings may need revision and which products may be affected in service.

The running case team's pump mounting plate, now part 210417, illustrates the scale. The where-used view shows it in **14** assemblies across **6** projects. A change to the plate's thickness from 10 mm to 12 mm will raise the pump by 2 mm in every one of those assemblies, lengthen the bolt stack and may affect pipe alignment at the pump flanges.

```figure
type: tree
title: Where-used for pump mounting plate 210417
caption: This is an illustration. Each project's skid uses the plate in one or more baseframe variants; the vault calculates this list from stored references.
- Pump mounting plate 210417 | used in 14 assemblies
  - Project A | 3 baseframe variants
  - Project B | 2 baseframe variants
  - Project C | 4 baseframe and guard assemblies
  - Project D | 2 baseframe variants
  - Project E | 2 baseframe variants
  - *Project F | 1 baseframe, the one the change is for
```

## The error case: a change meant for one, delivered to fourteen

Before the vault, a designer working on Project F needed a thicker pump mounting plate to suit a heavier pump. They opened the plate, changed its thickness from 10 mm to 12 mm, updated its drawing and released it at the next revision. The Project F skid was correct.

Six weeks later, a skid for Project C was being assembled from an existing design. The pump sat 2 mm higher than the pipework expected, and the suction pipe would not align without strain at the pump flange. The fitter stopped and raised the problem. Investigation found that the Project C assembly referenced the same plate file, and when it was last opened for a minor change, it had loaded the new 12 mm plate. Its bill of materials and its fabrication drawings had been regenerated with the thicker plate, and the pipework, designed for the old height, no longer fitted.

The designer had not been careless. The plate's file gave no indication that it was used anywhere else, and on the shared drive there was no practical way to find out. The change itself was correct for Project F. It was wrong to make it to a part shared by thirteen other assemblies.

The detection came from the fitter's attention to a strained flange, which is not a control anyone should rely on. The correction had three steps. First, the Project C pipework was checked and a 2 mm packer was fitted under the pump feet as a temporary measure, with the engineer's approval, while a revised drawing was prepared. Second, the plate was split: the original 10 mm design was restored under its existing number for the thirteen assemblies that used it, and the 12 mm plate was given a new number for Project F, following the interchangeability rule from Chapter 2, because the thicker plate cannot replace the thinner one without other changes. Third, the team adopted a rule, later enforced by the vault's workflow, that any change to a part used in more than one assembly requires a where-used review recorded with the change.

```figure
type: checklist
title: Where-used review before changing a shared part
caption: This is an illustration of the team's rule. The review takes minutes in a vault and prevents changes reaching assemblies that were not meant to see them.
- List every assembly using the part | from the vault's where-used view
- Decide for each | should this assembly see the change?
- Apply the interchangeability rule | if any assembly should not see it, or the new part cannot replace the old everywhere, give the changed part a new number
- Identify affected drawings | assemblies and drawings that need revision as a result
- Record the review | attached to the change record
- ? Products in service | spares or maintenance documents that refer to the part
```

## Copy designs safely

Engineering teams reuse designs constantly, and copying is how most reuse starts. A new skid often begins as a copy of a similar one. The danger in copying is that the copy and the original share references in ways nobody intends.

There are two safe patterns, and the right one depends on what should be shared.

**Copy the assembly and the parts that will change, and reference the parts that will not.** The new skid assembly gets a new number. Parts that will be modified for the new skid, such as the baseframe, get copies with new numbers. Parts that stay the same, such as library valves and the pump mounting plate, are referenced, not copied. The new assembly then shares the unchanged parts with the old one, which is correct: a change to a shared library valve should reach both.

**Copy everything and break all links.** Occasionally a design is copied as a starting point for something that will diverge completely. Then every file gets a copy with a new number, and the copy shares nothing with the original. This is safe but wasteful when used routinely, because it multiplies files that are in fact identical, which is how the shared drive collected its 6,350 duplicate names.

Most CAD systems and vaults provide a copy tool that copies an assembly with its components, lets the user choose which components to copy and which to reference, and renames the copies while updating the references. Using that tool, rather than copying folders in the file manager, is the single most effective habit for preventing reference problems.

## Check references before release

A final check before any assembly or drawing is released catches most reference problems that slip through. The team's check asks three questions: does the assembly open with no missing components; does every component come from the project's own location or the controlled library; and does the vault's where-used view for any changed shared part match the review recorded with the change?

In a vault, the first two questions can be answered by a report rather than by opening the assembly. On the shared drive, they needed the assembly opened on a seat with controlled search settings, which is one reason the settings themselves must be controlled.

## Exercise: decide copy or reference

A designer is starting a new skid, Project G, from the Project F design. The new skid will use the same pump and motor, a modified baseframe 150 mm longer, the same 12 mm pump mounting plate, new pipework and the same library valves. For each item, should the new assembly copy it or reference it? What happens to the pump mounting plate if Project G later needs a different hole pattern?

**Answer.** The **pump and motor** are purchased library items: reference them. The **baseframe** will change: copy it, with a new number. The **12 mm pump mounting plate** is unchanged: reference it, so that Projects F and G share it. The **pipework** is new: create it, or copy the Project F pipework with new numbers if it is a useful starting point. The **library valves** are shared: reference them.

If Project G later needs a different hole pattern on the plate, the where-used review will show that the 12 mm plate is used by Projects F and G. The modified plate cannot replace the existing one in Project F, so under the interchangeability rule it receives a new number for Project G. Project F keeps its plate unchanged, and the Project G assembly is repointed to the new one.
