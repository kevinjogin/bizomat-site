---
book: engineering-tools-people-use
chapterSlug: fit-the-tool-into-the-work
order: 5
title: "Fit the tool into the work"
description: "Put an engineering tool where the work happens: launch it from the model, store results with the design, link them to the dimensions they use and re-check them automatically when a drawing changes."
draft: false
---

A tool can have perfect inputs, clear results and helpful messages and still go unused, because using it means leaving the work. A designer in the middle of a gearbox assembly who has to open a separate program, find the dimensions again, type them in, save the result somewhere and remember to redo it when the design changes will do it once, under instruction, and skip it the next time the deadline is close. Tools that fit into the way people already work get used. Tools that sit beside it get forgotten.

This chapter fits the stack-up tool into the office's design process. It maps where stacks are needed, launches the tool from the CAD assembly with the parts already known, stores each stack with the design it checks, links every input to its source dimension, re-checks stacks automatically when a drawing changes and brings stacks into design review. The failure case is a housing depth revised to save material, whose stack nobody re-ran, found at the first assembly.

## Map where the work happens

The design manager mapped when, in the office's process, tolerance stacks are needed:

- **Concept**, when the arrangement of parts is chosen: rough stacks to set nominal gaps.
- **Detail design**, when drawings are being dimensioned and toleranced: full stacks for every critical gap.
- **Design review**, before drawings are released: stacks reviewed with the drawings.
- **Change**, when a released drawing is revised: stacks that use any changed dimension must be re-checked.
- **Problem investigation**, when a field or assembly problem arises: stacks reopened to see whether the tolerances explain it.

The old tool served only the second step, and poorly, because every stack started from a blank screen and ended as a file nobody else could find. Nothing connected it to review, change or investigation. The observation study in Chapter 1 had looked at detail design. A short review of the office's change records showed the bigger gap was at change.

## Start from the model

The new tool is launched from within the CAD assembly. A designer selects the faces that form the gap, and the tool proposes the chain of dimensions between them from the assembly's mates and the parts' drawings. The designer confirms or edits the chain, and the tool imports each dimension with its tolerance, as Chapter 2 described. A stack that took about 18 minutes to set up by hand, and about 9 with importing, takes about 5 when the chain is proposed from the model.

Not every chain can be proposed automatically. Some gaps depend on bought parts whose models carry no tolerances, or on assembly processes such as shimming that the model does not represent. The tool proposes what it can and leaves the rest to the designer, marking each input's source.

## Store the stack with the design

The old tool saved stacks as files in a folder of the designer's choosing, named however they liked. Finding the stack for a particular gap a year later depended on memory. The new tool stores each stack in the vault as a document attached to the assembly it checks, with a name built from the assembly number and the gap: "GBX-210 hub to housing face". Anyone looking at the assembly in the vault sees its stacks, with their status: passing, failing, provisional or out of date.

## Link every input to its source

Each imported input keeps a link to the dimension it came from, on a specific drawing revision. That link is what makes the rest of this chapter possible. The tool can tell, for any dimension on any drawing, which stacks use it.

```figure
type: tree
title: What depends on one housing dimension
caption: This is an illustration from the office's vault. The housing depth appears in two stacks and on the inspection plan; a revision to it should prompt a re-check of all three.
- Housing GBX-210-01, bore depth 45.50 ± 0.10 | drawing revision C
  - Stack: hub to housing face | uses the depth as dimension A
  - Stack: bearing preload shim range | uses the depth in a five-dimension chain
  - Inspection plan for the housing | depth listed as a critical dimension
```

## Re-check when the design changes

When a drawing is revised in the vault, the tool finds every stack that uses a changed dimension, re-runs it with the new values and reports the result to the designer making the revision and to the stack's owner. A stack that still passes is updated quietly, with a note in its history. A stack that now fails, or whose margin has fallen below a set level, raises a warning on the drawing's change record, which must be resolved before the revision is released.

This is an illustration. In the first year, about **220** stacks were stored with their assemblies, and about **60** drawing revisions touched a dimension used in a stack. The automatic re-check found **5** stacks that would have failed after the revision. In each case the designer adjusted the change before release, usually within the same day.

## Margins that shrink quietly

Not every revision makes a stack fail outright. Some reduce its margin a little at a time: a tolerance relaxed here to save machining cost, a nominal adjusted there to suit a supplier. Each change is acceptable on its own, and together they leave a stack with almost nothing to spare. The re-check therefore reports a falling margin as well as a fail, and the stack's history shows its margin at every revision. In the first year, two stacks were flagged for review after their margins had fallen from about 0.2 mm to under 0.05 mm over three revisions each, without any single revision looking significant. Both were restored by small nominal changes before the next build.

## Bring stacks into review

The office's design review checklist gained one line: every critical gap on the assembly has a stack, current against the drawings being released, with its review record signed. The tool's list of stacks per assembly, with their status, made that check take a minute. A reviewer sees at a glance a stack marked out of date, provisional or failing.

```figure
type: steps
title: Where the stack-up tool now sits in the design process
caption: This is an illustration of the office's process after the changes. The tool is used at five points, not just one.
- Concept | rough stacks set nominal gaps from the arrangement
- Detail design | full stacks launched from the assembly, inputs imported and linked
- *Design review | every critical gap has a current, signed stack record
- Change | revised dimensions trigger automatic re-checks; failures block release
- Investigation | stacks reopened with measured values from the problem parts
```

## Use measured values in investigations

When an assembly problem arises, the most useful stack is often one with the measured sizes of the actual parts rather than their drawing limits. The new tool lets a designer save an investigation variant of a stack, replacing each nominal and tolerance with a measured value and its measurement uncertainty. The variant shows whether the parts as made explain the problem: one part out of tolerance, several parts within tolerance but all near the unfavourable limit, or a stack that fails even with conforming parts, which points to the design. The investigation variant is kept with the stack, so the next designer to revise the assembly sees what happened.

## A failure case: 0.10 mm saved, 0.15 mm lost

This is an illustration. Before the dependency links existed, a designer revised the gearbox housing to reduce its weight. Among other changes, the bore depth was reduced from **45.50 mm** to **45.40 mm**, which looked harmless on its own. The drawing went through review and release. Nobody re-ran the hub-to-housing stack, because nobody remembered that the depth appeared in it.

At the first assembly of the revised design, the gear hub rubbed the housing face. The stack, re-run during the investigation, showed why: the nominal gap had fallen from **0.50 mm** to **0.40 mm**, and the worst-case minimum from **0.21 mm** to **0.11 mm**, well below the **0.25 mm** requirement. (The original stack was already marginal, as Chapter 3 showed. The revision made it clearly fail.)

The detection came at first assembly, after the housings had been machined, which is about the most expensive point at which a drawing error can surface short of the customer. Twelve housings were reworked. The correction was the dependency link and automatic re-check described above. When the office tested the new feature by replaying the past year's revisions, it would have flagged this change, and four others, before release.

```figure
type: stats
title: The cost of the unchecked revision
caption: This is an illustration. Rework costs exclude GST; the dependency check that would have caught it took about two days of development once importing existed.
- 0.10 mm | Depth removed | 45.50 to 45.40 mm
- 0.11 mm | New worst-case minimum gap | against 0.25 mm required
- 12 | Housings reworked | after first assembly
- *5 | Other revisions flagged | when past changes were replayed through the new check
```

## Tell the supplier why a tolerance matters

A tolerance on a drawing tells a machinist what to achieve. It does not say which tolerances matter most, and suppliers, sensibly, spend their care where they think it counts. The stack's contribution chart from Chapter 3 shows which dimensions dominate each critical gap. The office now marks those dimensions as critical on the drawing, with a note referring to the inspection plan, and sends a short extract of the stack record with the first order of a new part. For the gearbox housing, that meant the bore depth was marked critical, measured on every part rather than by sample, and held near the middle of its tolerance by the machining supplier once they understood why. Suppliers welcomed it. Several said they were rarely told which of dozens of tolerances actually mattered.

## Keep it fast

Tools that fit into the work also have to keep pace with it. A tool that takes thirty seconds to open inside a large assembly will be avoided, however well designed. The office set simple speed targets: the tool opens in under three seconds, proposes a chain within five seconds of the faces being selected, and recalculates instantly when an input changes. The first version of the chain proposal took over twenty seconds on the largest assemblies, because it examined every mate in the assembly. Limiting the search to the components between the selected faces brought it under four. Speed was measured during the user tests in Chapter 6, on the office's ordinary workstations rather than the author's.

## Learning through the work

New designers learn tolerance analysis faster when the tool is part of the daily process. The office pairs each new designer with an experienced one for their first five stack reviews, as the reviewer's second. The new designer reads the stack record, checks inputs against drawings, and discusses any confirmed warning or statistical choice with the experienced reviewer. Within a few weeks, they understand not just how to use the tool but why stacks are set up the way they are. The review record turned out to be a better teaching document than any training course, because every one is a real decision on a real product.

## Fit, not force

The office could have made stacks mandatory by rule alone, with a checklist line and a manager's signature. Rules without fit produce paperwork: stacks done after the fact to satisfy a reviewer, with the inputs copied from the drawing being reviewed rather than the one that will be made. Fitting the tool into the work, starting from the model, storing with the design and re-checking on change, made the right thing the easy thing. The rule then became a formality that recorded what designers were already doing. The office's measure of fit was simple: the share of critical gaps on released assemblies with a current stack attached. Before the changes, nobody knew. Twelve months after, it was over nine in ten, and the remaining gaps were mostly on old assemblies not yet revised, which would gain stacks the next time they were.

## How this applies to a small Australian business

Small offices often run engineering calculations in separate spreadsheets, disconnected from the drawings they check. The single most valuable connection is from each calculation to the drawing dimensions it depends on, so that a revision prompts a re-check. Even without software integration, a simple register of which calculations use which drawings, reviewed at every drawing revision, catches most of the problems. Many Australian manufacturers revise designs to reduce weight or cost late in a project, which is exactly when unchecked dependencies cause trouble. Start by listing the five or ten calculations that would hurt most if they went stale, record which drawings each one uses, and add a line to your drawing-revision checklist asking whether any of them is affected. That costs nothing and catches the worst cases while better integration is built.

## Exercise: a revision to the spacer

A designer proposes changing the spacer C from **8.00 ± 0.05** to **8.10 ± 0.03** to suit a different supplier. With the original housing depth of 45.50 ± 0.10, bearing 12.00 ± 0.06 and hub 25.00 ± 0.08, and a requirement of at least 0.25 mm, does the hub-to-housing stack still pass? What would the automatic re-check report?

**Worked answer.** The nominal gap becomes **45.50 − 12.00 − 8.10 − 25.00 = 0.40 mm**. The worst-case effect becomes **0.10 + 0.06 + 0.03 + 0.08 = 0.27 mm**, so the minimum gap is **0.40 − 0.27 = 0.13 mm**, failing the 0.25 mm requirement by 0.12 mm. The re-check would report that the revision to the spacer makes the hub-to-housing stack fail, block the release until resolved, and show the contribution chart, in which the housing depth still contributes the largest share. The tighter spacer tolerance helps a little, but the longer spacer costs more than it saves.
