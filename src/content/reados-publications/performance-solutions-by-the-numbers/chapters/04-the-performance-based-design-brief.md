---
book: performance-solutions-by-the-numbers
chapterSlug: the-performance-based-design-brief
order: 4
title: "The performance-based design brief"
description: "Agree the scope, scenarios, inputs and acceptance criteria with the stakeholders before any analysis, and see what happens to a solution whose numbers were run first."
draft: false
---

The most important document in a Performance Solution is written before the analysis starts. NCC 2022 calls it the performance-based design brief. It sets out what will be analysed, how, with what inputs, and what result will count as success. Once it is agreed, the analysis becomes a test with a known pass mark rather than an argument that can be adjusted until it reaches the desired conclusion.

This chapter explains what the code requires of the brief, builds one for the running case's mezzanine stair, and shows what happened when the analysis was run before the brief was agreed.

## What the code requires

A2G2(4) of NCC 2022 Volume One sets out the steps of a Performance Solution:

```figure
type: svg
title: The four steps of a Performance Solution, NCC 2022 A2G2(4)
alt: The four steps of a Performance Solution, NCC 2022 A2G2(4). 1. Prepare a performance-based design brief: in consultation with relevant stakeholders. 2. Carry out the analysis: as proposed by the brief. 3. Evaluate the results: against the acceptance criteria in the brief. 4. Prepare a final report: Performance Requirements, methods, steps, confirmation and any conditions or limitations
caption: Summarised from NCC 2022 Volume One. The brief in step 1 fixes the method and the acceptance criteria used in steps 2 and 3.
viewbox: 0 0 640 320
body:
<path class="la draw" pathLength="1" d="M34 58.5V101.5"/>
<path class="la draw" pathLength="1" d="M34 129.5V172.5"/>
<path class="la draw" pathLength="1" d="M34 200.5V252.5"/>
<g class="kf-a kd1">
<rect class="bxa" x="58" y="14" width="562" height="61" rx="6"/>
<circle class="fa" cx="34" cy="44.5" r="14"/>
<text class="txb" x="34" y="49.5" text-anchor="middle">1</text>
<text class="txb" x="74" y="36">Prepare a performance-based design brief</text>
<text class="tx" x="74" y="57">in consultation with relevant stakeholders</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="58" y="85" width="562" height="61" rx="6"/>
<circle class="bxi" cx="34" cy="115.5" r="14"/>
<text class="txb" x="34" y="120.5" text-anchor="middle">2</text>
<text class="txb" x="74" y="107">Carry out the analysis</text>
<text class="tx" x="74" y="128">as proposed by the brief</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="58" y="156" width="562" height="61" rx="6"/>
<circle class="bxi" cx="34" cy="186.5" r="14"/>
<text class="txb" x="34" y="191.5" text-anchor="middle">3</text>
<text class="txb" x="74" y="178">Evaluate the results</text>
<text class="tx" x="74" y="199">against the acceptance criteria in the brief</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="58" y="227" width="562" height="79" rx="6"/>
<circle class="bxi" cx="34" cy="266.5" r="14"/>
<text class="txb" x="34" y="271.5" text-anchor="middle">4</text>
<text class="txb" x="74" y="249">Prepare a final report</text>
<text class="tx" x="74" y="270">Performance Requirements, methods, steps, confirmation and any conditions or</text>
<text class="tx" x="74" y="288">limitations</text>
</g>
```

The NCC defines the performance-based design brief as a report that sets out the scope of work for the performance-based analysis, the technical basis for the analysis, and the acceptance criteria for any relevant Performance Solution, as agreed by the stakeholders. Three things in that definition matter: the brief defines scope, it defines the technical basis, and it is agreed. A brief written by the engineer alone and attached to the final report does not meet the definition.

## Who the stakeholders are

"Relevant stakeholders" is not defined as a list, so each project decides. For the running case, the brief was prepared by the fire safety engineer in consultation with:

- **The owner and operations manager**, who know how the mezzanine is used and must live with any conditions.
- **The designer**, who controls the layout, shelving and services.
- **The certifier**, who will assess the final report and must be able to accept the method and criteria.
- **The maintenance contractor**, because any added detection system must be maintained and tested.

Some states require the fire brigade to be consulted on certain fire safety Performance Solutions, and the certifier will say whether that applies to a particular project and stage. Where it does, the brigade is a stakeholder in the brief, not just a reviewer of the outcome.

The test of whether the right people are involved is simple: could any of them reasonably reject the final report on grounds they could have raised at the brief stage? If so, they should have been consulted at the brief stage.

## What the running case brief contains

This is an illustration. The brief for the mezzanine stair runs to a few pages and has ten parts:

1. **Building and use.** The workshop, mezzanine, shelving layout, stored goods and normal occupancy, with drawings.
2. **The departure.** D2D5(3) on the mezzanine only, with the farthest point 28 m along the aisles against 20 m.
3. **Relevant Performance Requirements.** The register from Chapter 2, with D1P4, C1P4 and E4P2 as relevant, C1P1 and C1P2 conditional, and the rest considered and not affected.
4. **Approach.** Equivalence with the DTS Provisions, using the DTS limit layout as the primary reference and the DTS alternative as a sensitivity reference (Chapter 3).
5. **Occupants.** Seven persons on the mezzanine from D2D18, characterised as trained staff, with a sensitivity case for unfamiliar people.
6. **Design fire scenarios.** Listed below.
7. **Methods and inputs.** A comparative time-line calculation of escape time, with every input stated and sourced.
8. **Acceptance criteria.** Listed below.
9. **Sensitivity and uncertainty.** Which inputs will be varied and by how much (Chapter 7).
10. **Roles and review.** Who prepares, who peer reviews and who accepts; the form of the final report.

## Describing the occupants

The occupant section of a brief is often a single line: "seven persons". That is the number, but it is not the description D1P4 asks for. The requirement lists the number, mobility and other characteristics of occupants, and those characteristics drive the inputs in the analysis.

For the running case, the brief describes the mezzanine's occupants in four ways:

- **Who they are.** Stores staff and, occasionally, machinists collecting tooling. On stocktake days, up to four people at once. Contractors servicing the shelving a few times a year.
- **How familiar they are.** Regular users know the stair position and the route. Contractors and new starters may not, which is why the sensitivity analysis includes an unfamiliar-occupant case.
- **How mobile they are.** The mezzanine is reached only by stair, and the owner has asked the certifier to accept that accessible access to it is not required, on the basis of how the store is used. The brief records that basis, because a change in it would undermine the analysis. It also considers a staff member with a temporary injury, who would move more slowly on the stair.
- **What they are doing.** Handling heavy items, sometimes at height on a step platform. That can lengthen the time between becoming aware of a fire and starting to move, which is why pre-movement time appears as a separate input.

The number from D2D18, seven, is used as the design occupancy because it is higher than the usual daily number and higher than the stocktake case. Using the code's number rather than the owner's estimate keeps the analysis consistent with the DTS reference, which is also based on D2D18.

## How long should a brief be?

A brief should be proportionate to the departure. A Performance Solution for a large shopping centre's smoke control may have a brief of fifty pages and several meetings. The running case's brief is a few pages and one meeting, because the departure is a single travel distance for seven people.

Proportionate does not mean incomplete. Even a short brief must state the scope, the requirements, the approach, the occupants, the scenarios, the inputs with sources, the acceptance criteria, the sensitivity plan and the review arrangements. What scales with the project is the depth of each part, not the presence of it. A useful test is whether a competent engineer who was not at the meeting could carry out the analysis from the brief alone and reach the same numbers. If they would need to ask what an input was or how a distance was measured, the brief is too thin and should be fixed before analysis begins.

A brief should also not contain the answer. Phrases such as "the analysis will demonstrate that the proposal is acceptable" or "it is expected that detection will compensate" signal that the conclusion came first. The running case's brief describes what will be tested and how success will be judged, and is silent on what the result will be.

## Design fire scenarios

A scenario is a description of a fire: where it starts, what it burns and how it develops. For a comparative analysis, the same scenarios are applied to the reference and the proposal. The brief for the running case selected four, each chosen to challenge a different part of the argument.

```figure
type: svg
title: Design fire scenarios in the running case brief
alt: Design fire scenarios in the running case brief. A. Packaging fire under the mezzanine: Why it was chosen smoke rises directly beneath the occupants; What it tests detection time and exposure on the mezzanine. B. Fire near the proposal's stair foot: Why it was chosen the single stair could be threatened; What it tests the value of the 3 m clear zone at the stair foot. C. Fire near the reference stair foot: Why it was chosen the DTS layout's stair lands in the fabrication area; What it tests fairness: the reference faces the same test. D. Fire on the mezzanine among the shelving: Why it was chosen occupants are in the room of fire origin; What it tests whether a longer walk past the fire is acceptable
caption: This is an illustration. Real scenario selection is the fire engineer's responsibility and should draw on recognised guidance for the building type.
viewbox: 0 0 640 296
body:
<g class="kf-a kd1">
<rect class="fs" x="20" y="10" width="600" height="33" rx="4"/>
<text class="txb" x="219.8" y="31">Why it was chosen</text>
<text class="txb" x="426.3" y="31">What it tests</text>
</g>
<g class="kf-a kd2">
<path class="lf" d="M20 95H620"/>
<text class="txb" x="28" y="64">A. Packaging fire</text>
<text class="txb" x="28" y="83">under the mezzanine</text>
<text class="tx" x="219.8" y="64">smoke rises directly</text>
<text class="tx" x="219.8" y="82">beneath the occupants</text>
<text class="tx" x="426.3" y="64">detection time and</text>
<text class="tx" x="426.3" y="82">exposure on the mezzanine</text>
</g>
<g class="kf-a kd3">
<path class="lf" d="M20 147H620"/>
<text class="txb" x="28" y="116">B. Fire near the</text>
<text class="txb" x="28" y="135">proposal's stair foot</text>
<text class="tx" x="219.8" y="116">the single stair could be</text>
<text class="tx" x="219.8" y="134">threatened</text>
<text class="tx" x="426.3" y="116">the value of the 3 m clear</text>
<text class="tx" x="426.3" y="134">zone at the stair foot</text>
</g>
<g class="kf-a kd4">
<path class="lf" d="M20 215H620"/>
<text class="txb" x="28" y="168">C. Fire near the</text>
<text class="txb" x="28" y="187">reference stair foot</text>
<text class="tx" x="219.8" y="168">the DTS layout's stair</text>
<text class="tx" x="219.8" y="186">lands in the fabrication</text>
<text class="tx" x="219.8" y="204">area</text>
<text class="tx" x="426.3" y="168">fairness: the reference</text>
<text class="tx" x="426.3" y="186">faces the same test</text>
</g>
<g class="kf-a kd5">
<rect class="bxa" x="20" y="215" width="600" height="71" rx="4"/>
<path class="lf" d="M20 286H620"/>
<text class="txb" x="28" y="236">D. Fire on the</text>
<text class="txb" x="28" y="255">mezzanine among the</text>
<text class="txb" x="28" y="274">shelving</text>
<text class="tx" x="219.8" y="236">occupants are in the room</text>
<text class="tx" x="219.8" y="254">of fire origin</text>
<text class="tx" x="426.3" y="236">whether a longer walk past</text>
<text class="tx" x="426.3" y="254">the fire is acceptable</text>
</g>
<rect class="lf" x="20" y="10" width="600" height="276" rx="4" fill="none"/>
<path class="lf" d="M211.8 10V286"/>
<path class="lf" d="M418.3 10V286"/>
```

Scenario D deserves comment. When the fire is on the mezzanine itself, occupants may have to walk towards or past it to reach the only stair. A longer route makes that more likely. The brief therefore required the analysis to consider where on the mezzanine a fire could start relative to the route, not just how long the route is. Chapter 7 returns to it.

## Inputs and their sources

Every number used in the analysis should appear in the brief with its source, before results exist. For a real project, the sources would be recognised fire engineering data and guidance, chosen and justified by the engineer. In this book, the inputs are teaching assumptions, chosen to make the arithmetic visible.

```figure
type: svg
title: Teaching inputs for the comparative escape-time check
alt: Teaching inputs for the comparative escape-time check. 120 s, Time to become aware of a fire, no detection (cue-based awareness on the mezzanine). 60 s, Time to become aware, with detection and a local alarm (added by the proposal). 60 s, Pre-movement time once aware (same in reference and proposal). 1.0 m/s, Walking speed on the flat (mezzanine and workshop floor). 0.5 m/s, Travel speed along the stair nosings (descending one flight). 1.0 person per second, Flow onto the stair (queue for the last of 7 people)
caption: This is an illustration. These are not design values. A real brief cites recognised data for each and explains why it suits the occupants and building.
viewbox: 0 0 640 320
body:
<g class="kf-a kd1">
<rect class="bxa" x="20" y="10" width="192" height="153" rx="8"/>
<circle class="fa pulse" cx="198" cy="24" r="5"/>
<text class="txa" x="32" y="36">120 s</text>
<text class="txb" x="32" y="61">Time to become aware</text>
<text class="txb" x="32" y="80">of a fire, no</text>
<text class="txb" x="32" y="99">detection</text>
<text class="tx" x="32" y="120">cue-based awareness on</text>
<text class="tx" x="32" y="138">the mezzanine</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="224" y="10" width="192" height="153" rx="8"/>
<text class="txa" x="236" y="36">60 s</text>
<text class="txb" x="236" y="61">Time to become</text>
<text class="txb" x="236" y="80">aware, with</text>
<text class="txb" x="236" y="99">detection and a</text>
<text class="txb" x="236" y="118">local alarm</text>
<text class="tx" x="236" y="139">added by the proposal</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="428" y="10" width="192" height="153" rx="8"/>
<text class="txa" x="440" y="36">60 s</text>
<text class="txb" x="440" y="61">Pre-movement time</text>
<text class="txb" x="440" y="80">once aware</text>
<text class="tx" x="440" y="101">same in reference and</text>
<text class="tx" x="440" y="119">proposal</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="20" y="175" width="192" height="133" rx="8"/>
<text class="txa" x="32" y="201">1.0 m/s</text>
<text class="txb" x="32" y="226">Walking speed on the</text>
<text class="txb" x="32" y="245">flat</text>
<text class="tx" x="32" y="266">mezzanine and workshop</text>
<text class="tx" x="32" y="284">floor</text>
</g>
<g class="kf-a kd5">
<rect class="bx" x="224" y="175" width="192" height="133" rx="8"/>
<text class="txa" x="236" y="201">0.5 m/s</text>
<text class="txb" x="236" y="226">Travel speed along</text>
<text class="txb" x="236" y="245">the stair nosings</text>
<text class="tx" x="236" y="266">descending one flight</text>
</g>
<g class="kf-a kd6">
<rect class="bx" x="428" y="175" width="192" height="133" rx="8"/>
<text class="txa" x="440" y="201">1.0 person per</text>
<text class="txa" x="440" y="220">second</text>
<text class="txb" x="440" y="245">Flow onto the stair</text>
<text class="tx" x="440" y="266">queue for the last of 7</text>
<text class="tx" x="440" y="284">people</text>
</g>
```

Two features of the table matter more than the values. First, the inputs that differ between reference and proposal are few: only the time to become aware, because detection is part of the proposal. Everything else is identical, as Chapter 3 requires. Second, each input will be varied in the sensitivity analysis, so the brief also states the ranges, which stops anyone choosing a range after seeing which way the result moves.

## Acceptance criteria

Acceptance criteria turn "at least equivalent" into a test. The running case brief set five:

1. In each design fire scenario, the proposal's required escape time from the mezzanine to open space is not longer than the reference's.
2. The criterion holds against both the DTS limit reference and the DTS alternative reference.
3. The criterion holds across the sensitivity ranges stated in the brief, or the report explains any exception and why it is acceptable.
4. The stair foot clear zone, signage and detection are specified, evidenced and listed for maintenance.
5. The solution's conditions can be written as simple, checkable statements for the building's fire safety records.

The first three are numerical. The last two are practical, and they are there because a solution that cannot be maintained will not stay a solution.

## The error: numbers before the brief

The engineer, keen to give the owner an early answer, ran a quick calculation before the brief meeting. It used a walking speed of 1.2 m/s, no detection in either layout, and the straight-line distance of 21.0 m for the proposal. On those inputs the proposal's escape time was only about half a second longer than the reference's, and the engineer's covering note said the departure "appears acceptable without additional measures".

At the brief meeting, the certifier asked three questions: where does 1.2 m/s come from, why is the proposal measured in a straight line when the shelving is fixed, and what will the sensitivity analysis vary? Each question changed an input. Once the distances were measured along the aisles (Chapter 3) and the inputs were set as in the table above, the proposal without detection came out about 7.65 seconds slower than the DTS limit reference, as Chapter 6 shows. The early note had to be withdrawn.

Nothing in the quick calculation was dishonest. The problem was the order of work. Results produced before the inputs are agreed shape the inputs that follow, because nobody likes to see a favourable answer disappear. The brief exists to break that loop. A practical rule follows: do not circulate results until the brief is agreed, and if early numbers are needed for a decision, label them clearly as unagreed and likely to change.

## Recording agreement

The brief is agreed when the stakeholders say so in writing. In the running case, the engineer circulated the final brief with a one-page summary of the approach, scenarios, inputs and criteria, and asked each stakeholder to confirm by email. The certifier's confirmation included one comment, that the sensitivity analysis must include a case where the detection system is not working. That comment became part of the brief, and Chapter 7 shows why it mattered.

Agreement is not the end of the brief's life. Analysis sometimes reveals that an input is wrong or a scenario is missing. When that happens, the brief should be changed openly: the engineer records what changed, why, and whether any results already produced are affected, and the stakeholders confirm the change. In the running case, the operations manager's late disclosure of export crates staged on the mezzanine (Chapter 2) arrived after the first brief draft. It was handled as a formal amendment that added fire load to scenario D, with a note that no results had yet been produced. A brief that changes silently during analysis has the same weakness as no brief at all: nobody can tell whether the criteria were set before or after the answer was known.

```figure
type: svg
title: Brief agreement record for the running case
alt: Brief agreement record for the running case. Done: Scope: D2D5(3) on the mezzanine only. Done: Requirement register attached and reviewed by the owner. Done: Approach and references fixed: DTS limit primary, DTS alternative sensitivity. Done: Scenarios A to D, inputs with sources, acceptance criteria 1 to 5. Done: Sensitivity ranges stated, including detection unavailable. Done: Written agreement from owner, designer, certifier and maintenance contractor
caption: This is an illustration. Analysis starts only when every line is ticked.
viewbox: 0 0 640 336
body:
<g class="kf-a kd1">
<rect class="bx" x="20" y="12" width="600" height="39" rx="6"/>
<circle class="bxa" cx="40" cy="29" r="11"/>
<path class="la draw" pathLength="1" d="M34 29l4 4 8-8"/>
<text class="txb" x="64" y="32">Scope: D2D5(3) on the mezzanine only</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="20" y="59" width="600" height="39" rx="6"/>
<circle class="bxa" cx="40" cy="76" r="11"/>
<path class="la draw" pathLength="1" d="M34 76l4 4 8-8"/>
<text class="txb" x="64" y="79">Requirement register attached and reviewed by the owner</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="20" y="106" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="123" r="11"/>
<path class="la draw" pathLength="1" d="M34 123l4 4 8-8"/>
<text class="txb" x="64" y="126">Approach and references fixed: DTS limit primary, DTS alternative</text>
<text class="txb" x="64" y="145">sensitivity</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="20" y="172" width="600" height="39" rx="6"/>
<circle class="bxa" cx="40" cy="189" r="11"/>
<path class="la draw" pathLength="1" d="M34 189l4 4 8-8"/>
<text class="txb" x="64" y="192">Scenarios A to D, inputs with sources, acceptance criteria 1 to 5</text>
</g>
<g class="kf-a kd5">
<rect class="bx" x="20" y="219" width="600" height="39" rx="6"/>
<circle class="bxa" cx="40" cy="236" r="11"/>
<path class="la draw" pathLength="1" d="M34 236l4 4 8-8"/>
<text class="txb" x="64" y="239">Sensitivity ranges stated, including detection unavailable</text>
</g>
<g class="kf-a kd6">
<rect class="bx" x="20" y="266" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="283" r="11"/>
<path class="la draw" pathLength="1" d="M34 283l4 4 8-8"/>
<text class="txb" x="64" y="286">Written agreement from owner, designer, certifier and maintenance</text>
<text class="txb" x="64" y="305">contractor</text>
</g>
```

## Exercise: write an acceptance criterion

The owner suggests adding a criterion: "the proposal must be no more than 10 seconds slower than the reference". Is this an acceptable acceptance criterion for an equivalence-based Performance Solution? Rewrite it if not.

**Worked answer.** It is not acceptable as written. An equivalence-based solution must show that the proposal is **at least equivalent** to the DTS Provisions under A2G2(1). A criterion that allows the proposal to be up to 10 seconds slower accepts a solution that is, on that measure, worse than the DTS design, without any argument that the loss is compensated elsewhere.

A suitable rewrite is: "In each design fire scenario and sensitivity case, the proposal's required escape time from the mezzanine to open space is not longer than the reference's. Where a scenario or case does not meet this, the report must show that the proposal is at least equivalent on the other measures listed in the brief and explain why that compensates." This keeps the comparison honest and puts the burden of any exception on a written argument that the certifier can test.
