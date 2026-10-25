---
book: performance-solutions-by-the-numbers
chapterSlug: finding-every-relevant-requirement
order: 2
title: "Finding every Performance Requirement a solution touches"
description: "Use the NCC's three-step method and a factor sweep to list every Performance Requirement a departure affects, including the ones in other Parts that are easy to miss."
draft: false
---

A Performance Solution that answers the obvious requirement and misses a less obvious one is not a Performance Solution. It is a partial argument with a gap where a certifier, or a coroner, will later look. The NCC knows this, and since BCA 2004 it has prescribed a method for finding the relevant requirements, including those in other Parts of the code that the solution affects.

This chapter applies that method to the running case's mezzanine stair. It adds a simple technique, the factor sweep, that catches connections between Parts. And it shows how the first draft list missed two requirements and how the omission was found.

## The method in the code

A2G2(3) of NCC 2022 Volume One requires that, for a Performance Solution, the relevant Performance Requirements be identified from the Section or Part that applies, plus any Performance Requirements in other Sections or Parts that are affected by the solution.

Where a Performance Solution is combined with a Deemed-to-Satisfy Solution, which describes most real buildings, A2G4(3) sets out the steps:

```figure
type: steps
title: Identifying relevant Performance Requirements, NCC 2022 A2G4(3)
caption: Summarised from NCC 2022 Volume One. BCA 2004 clause A0.10 set out the same three steps for Alternative Solutions.
- Identify the DTS Provisions | that are the subject of the Performance Solution
- *Identify the related Performance Requirements | from the same Sections or Parts as those DTS Provisions
- Identify affected Performance Requirements | from other Sections or Parts that the solution affects
```

The method is deliberately conservative. The first step ties the solution to the specific DTS Provisions it replaces, so that everything else in the building stays on the DTS route. The second step finds the requirements those provisions were meeting. The third step asks a harder question: what else does the solution change?

The continuity with BCA 2004 is worth noting. Its clause A0.10 required exactly the same three identifications for an Alternative Solution. A method that has survived two decades of revisions is a good sign that it addresses a real failure mode.

## Step 1: which DTS Provisions are departed from

This is an illustration. The east-end stair layout was checked against every egress provision in Part D2, not just the one known to fail:

- **D2D3, number of exits.** The mezzanine is not a storey (it is 190 m², below the 200 m² threshold), and the workshop storey has three exits. Complies.
- **D2D5(3), travel distance.** The farthest point on the mezzanine is about 28 m from the top riser along the aisles, with no two-way travel available. The limit is 20 m. **Departs.**
- **D2D14(3), total distance via a non-fire-isolated stair.** About 28 + 5.03 + 9.19 = 42 m to open space, against 80 m. Complies.
- **D2D14(5), stair discharge.** The stair foot is 9.19 m from exit P2, against 20 m. Complies.
- **D2D8 and D2D9, widths.** Unchanged. Complies.

The Performance Solution is therefore confined to one DTS Provision: the 20 m limit in D2D5(3), as it applies to the mezzanine. Writing that sentence precisely matters, because it defines the boundary of the solution. Everything else stays DTS and is not reopened.

## Step 2: requirements in the same Part

D2D5 sits in Part D2, whose Performance Requirements are in Part D1. The candidates and the reasoning:

- **D1P4, exits.** The travel distance is one of the factors listed in D1P4, and D2D5 is one of the provisions that satisfies it. **Relevant.**
- **D1P6, paths of travel to exits.** D1P6 concerns the dimensions of paths of travel appropriate to the occupants and use. The proposal does not change any width or height. Considered; **not affected**, provided the aisle widths stay as designed.
- **D1P2, safe movement.** The stair geometry, handrails and barriers are DTS-compliant and unchanged. Considered; **not affected**.
- **D1P5, fire-isolated exits.** The mezzanine stair is a non-fire-isolated stair, permitted under the DTS Provisions for this building. Considered; **not affected**.

"Considered; not affected" is a real outcome and should be recorded as such, with the reason. It shows the reader that the requirement was examined rather than forgotten. It also gives the next reviewer a starting point: if the building later changes, the reason shows exactly what assumption would have to fail for the requirement to become relevant.

## Step 3: requirements in other Parts

This is where solutions usually go wrong, because the connections are not shown by clause numbers. Two techniques help.

**Follow the physical changes.** List everything the solution adds, removes or moves. The east-end proposal moves the stair and may add smoke detection and an alarm on and under the mezzanine. Detection and alarms are fire safety systems with their own requirements. A longer escape route may need more direction signs. Each physical change points to a Part.

**Run a factor sweep.** Performance Requirements list the factors they depend on. If a solution changes a factor, every requirement listing that factor is a candidate. The running case changes the evacuation time, because occupants walk further. So search the Performance Requirements for "evacuation time" as a factor. In NCC 2022 Volume One, it appears in C1P1 on structural stability during a fire, C1P2 on the spread of fire and C1P4 on safe conditions for evacuation.

```figure
type: compare
title: Relevant Performance Requirements for the running case
cols: Why it is a candidate | Outcome of the review
caption: This is an illustration of the requirement register kept by the engineer. Every candidate is listed with its reason, including those found not to be affected.
- *D1P4 exits | travel distance is a listed factor; D2D5(3) departed | relevant: the core of the solution
- D1P6 paths of travel | same Part | not affected: widths and heights unchanged
- C1P4 safe conditions for evacuation | evacuation time is a listed factor | relevant: exposure time on the mezzanine
- C1P1 and C1P2 stability and fire spread | evacuation time is a listed factor | considered: affected only if evacuation is slower than the DTS reference
- E4P2 exit identification | a longer route with turns needs guidance | relevant: direction signs on the mezzanine
- E4P3 warning systems | an added local alarm is a warning system | relevant if an alarm forms part of the solution
- Part E2 smoke hazard management | added smoke detection | check whether its requirements are affected
```

The factor sweep produced a useful decision for C1P1 and C1P2. Neither is affected if the proposal's evacuation is no slower than the DTS reference layout's, because then the structure and the fire separation are not asked to perform for longer. That condition becomes an acceptance criterion in the brief (Chapter 4). In effect, the sweep converts a possible gap into a test.

## The error: a list with one line

The engineer's first draft of the requirement register had a single line: D1P4. It was a natural starting point, since D1P4 is the requirement that D2D5 serves. The certifier's review of the draft brief returned two questions:

1. If occupants spend longer on the mezzanine, how have you addressed tenability there, which C1P4 is about?
2. The proposed route has two right-angle turns between shelving rows. How will an unfamiliar person find the stair in smoke, which E4P2 is about?

Both requirements belonged on the list. The omission was detected because the certifier read the proposal through the requirements' factor lists, not through the clause numbers in the DTS Provisions. The engineer adopted the factor sweep for the rest of the project and added a line to the register template: "Factors changed by this solution, and every Performance Requirement listing each one."

## How narrow should a solution be?

There is a tension in this chapter. A wider list of requirements makes a solution safer and more defensible, but a wider solution also takes more of the building off the DTS route, which means more analysis and more conditions. The answer is to keep the departure narrow and the review wide:

- **Narrow departure.** Change as few DTS Provisions as possible. In the running case, only D2D5(3) on the mezzanine.
- **Wide review.** Examine every requirement the change could affect, and record why each is or is not affected.

A solution that departs from several DTS Provisions at once, each "a little", is harder to analyse than one that departs from one provision clearly. The interactions multiply. If a project finds itself needing several departures, it is often better to step back and ask whether the design itself should change.

## A register template

A requirement register does not need special software. A table with these columns, kept with the design brief, is enough for most small solutions:

1. **Requirement.** The clause number and a one-line summary in your own words.
2. **How it was found.** Same Part as the departed DTS Provision, physical-change review or factor sweep, with the factor named.
3. **Effect of the solution.** Relevant, considered and not affected, or affected only under a stated condition.
4. **Reason.** One or two sentences that a reviewer can check.
5. **Where it is addressed.** The section of the brief, analysis or report that deals with it.
6. **Conditions arising.** Anything the building's owner must do or avoid for the reasoning to hold.

The last column is the one that pays off later. In the running case, the C1P1 and C1P2 lines produced the condition "evacuation from the mezzanine no slower than the DTS reference", and the D1P6 line produced "aisle widths on the mezzanine maintained as designed". Both reappear in the final report's conditions in Chapter 10, and both can be traced back to a line in this register.

## State variations and other laws

Two more sources can add requirements that the national text does not show.

**State and territory variations.** Some jurisdictions vary or add Performance Requirements, not only DTS Provisions. NCC Online flags these beside the national clause. A register prepared from the national text alone can miss a state-specific requirement, so read each candidate clause in the version adopted where the building is.

**Other legislation.** The NCC is not the only law that touches egress. Work health and safety law requires an employer to provide and maintain safe means of entering and exiting the workplace and to have an emergency plan. A Performance Solution that relies on, for example, trained staff or a limit on the number of people on the mezzanine creates obligations that sit naturally in the employer's WHS systems. The register should note those links, even though the certifier does not assess them, because the solution will fail in practice if the workplace does not support it.

## Reviewing someone else's register

Owners, project managers and peer reviewers often see a register prepared by someone else. A short set of questions tests it quickly:

- Does it name the specific DTS Provisions departed from, and is that list as short as it can be?
- Does every candidate have a reason, including those found not to be affected?
- Has a factor sweep been done, and which factors did the solution change?
- Does every physical change in the solution, including added systems, map to at least one requirement?
- Have state variations been checked for each candidate?
- Do the conditions in the final column look like things the owner can actually maintain?

A register that answers all six is usually a sign of a careful solution. One that lists a single requirement with no reasons is usually a sign that the argument has not been tested yet.

## Who owns the register

The requirement register belongs to the person preparing the Performance Solution, usually a fire safety engineer for egress questions. But the owner and designer have facts the engineer needs: what is stored where, who uses the mezzanine, how the shelving is laid out and what may change. The register is only as complete as those facts.

In the running case, the owner's operations manager reviewed the draft register and added one candidate the engineer had not thought of: the mezzanine is sometimes used to stage packed export crates, which are much larger and more combustible than the usual tooling. That changed the fire load assumption and therefore the relevance of C1P4. It is a good example of why the register should be reviewed by people who know the building's use, not only by people who know the code.

The engineer's practice afterwards was to send the draft register to the owner with one question at the top: "What happens on, under and around the mezzanine that is not on the drawings?" The answers included the export crates, a battery charger for the order picker parked under the mezzanine overnight and a weekly stocktake that puts four people on the mezzanine at once. Each was a fact the analysis needed, and none appeared on any drawing.

```figure
type: checklist
title: Requirement register status for the running case
caption: This is an illustration. Open items are resolved in the design brief before any analysis is done.
- x DTS Provision departed: D2D5(3) on the mezzanine only
- x Same-Part requirements: D1P4 relevant; D1P2, D1P5, D1P6 considered and not affected
- x Factor sweep for "evacuation time": C1P1, C1P2, C1P4 found
- x Physical-change review: E4P2 signage; E4P3 and Part E2 if detection and alarm are added
- ? Export crate staging on the mezzanine | fire load to be agreed in the brief
- ? Final register signed off by the certifier | after the brief meeting
```

## Exercise: a different departure

Suppose that, instead of extending the travel distance, the owner proposed keeping the stair at the middle of the south edge but making it 800 mm wide instead of 1 m to save floor space. Which DTS Provision would be departed from, and which Performance Requirements would you list?

**Worked answer.** Step 1: the departure would be from D2D8(1), which requires each exit and path of travel to be at least 1 m wide. Step 2: the related Performance Requirements in Part D1 are **D1P6** on paths of travel, whose factors include the number, mobility and other characteristics of occupants, and **D1P4** on exits, whose dimensions must be appropriate to the same factors. **D1P2** on safe movement is also a candidate, because stair passage must suit the expected use and volume of traffic.

Step 3: a narrower stair slows the flow of people, which changes evacuation time, so the factor sweep brings in **C1P1, C1P2 and C1P4** for the same reasons as in this chapter. If the narrower stair also changed the handrail arrangement or the barrier layout, D1P3 on barriers would need checking too. The lesson is that a "small" change of 200 mm reaches into Part C through the evacuation time, just as the longer travel distance does.
