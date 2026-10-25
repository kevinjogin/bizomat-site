---
book: performance-solutions-by-the-numbers
chapterSlug: the-deemed-to-satisfy-benchmark
order: 3
title: "The Deemed-to-Satisfy layout as a benchmark"
description: "Build a fair reference design for a comparative Performance Solution: what must stay identical, what may differ, how to measure both the same way and how to avoid a straw man."
draft: false
---

The comparative route to a Performance Solution rests on one sentence in A2G2(1) of NCC 2022 Volume One: a Performance Solution can be achieved by showing it is at least equivalent to the Deemed-to-Satisfy Provisions. Comparison with the DTS Provisions is also one of the four Assessment Methods listed in A2G2(2).

The strength of the route is that it does not ask the engineer to prove what "safe" means in absolute terms. The code has already deemed a DTS-compliant building safe enough. The engineer's task is to show that the proposal is no worse. The weakness is that the result depends entirely on the reference: compare against the wrong DTS design, or measure the two differently, and the comparison proves nothing. This chapter builds the reference for the running case and sets the rules that keep the comparison fair.

## What "at least equivalent" means

Equivalence is not identity. A proposal can differ from the DTS design in many ways and still be equivalent, provided that, on the measures that matter for the relevant Performance Requirements, it performs at least as well. For egress, the measures that matter usually include:

- how long occupants take to reach a place of safety;
- how long conditions remain survivable along their route;
- how likely it is that their route is blocked by the fire;
- how easily they find the route, especially if they do not know the building.

A proposal that is worse on one measure can be equivalent overall if it is better on another, but only if the argument shows why the gain compensates for the loss for the requirement in question. Trading a longer walk for earlier warning is a common and defensible example. Trading a longer walk for a nicer staff room is not.

## Choosing the reference design

This is an illustration. Two DTS-compliant reference layouts were available for the running case:

1. **The DTS limit layout.** A hypothetical stair position that puts the farthest point on the mezzanine exactly 20 m from the top riser, measured along the aisles. This is the least favourable layout the DTS Provisions allow.
2. **The DTS alternative layout.** The actual compliant design from the companion analysis: the stair at the middle of the south edge, with the farthest point 18.5 m away along the aisles and the stair foot 9.54 m from exit P3.

The DTS limit layout is the more common choice for a reference, and it is defensible: the code deems any layout up to 20 m acceptable, so the proposal need only match the worst acceptable case. The DTS alternative layout is more conservative, because it compares the proposal with what the owner would actually build otherwise. The brief for the running case uses the DTS limit as the primary reference and the DTS alternative as a sensitivity check, and it says so in writing before any analysis.

```figure
type: svg
title: Proposal and reference layouts for the mezzanine
alt: Proposal and reference layouts for the mezzanine. Farthest point to the top riser: DTS limit reference 20.0 m, the D2D5(3) limit; Proposal, east-end stair 28.0 m. Line of nosings, 17 risers: DTS limit reference 5.03 m; Proposal, east-end stair 5.03 m. Stair foot to door to open space: DTS limit reference 9.54 m to P3; Proposal, east-end stair 9.19 m to P2. Total route to open space: DTS limit reference 34.6 m; Proposal, east-end stair 42.2 m. Stair foot location: DTS limit reference in the fabrication and assembly area; Proposal, east-end stair beside exit P2, outside forklift routes
caption: This is an illustration. Distances are along the shelving aisles to the top riser, then along the stair nosings, then across the workshop floor to the nearest door to open space.
viewbox: 0 0 640 220
- Farthest point to the top riser | DTS limit reference: 20.0 m, the D2D5(3) limit; Proposal, east-end stair: 28.0 m
- Line of nosings, 17 risers | DTS limit reference: 5.03 m; Proposal, east-end stair: 5.03 m
- Stair foot to door to open space | DTS limit reference: 9.54 m to P3; Proposal, east-end stair: 9.19 m to P2
- Total route to open space | DTS limit reference: 34.6 m; Proposal, east-end stair: 42.2 m
- Stair foot location | DTS limit reference: in the fabrication and assembly area; Proposal, east-end stair: beside exit P2, outside forklift routes
body:
<g class="kf-a kd1">
<text class="txb" x="20" y="26" text-anchor="start">DTS limit reference</text>
<rect class="fi kf-growx" x="20" y="34" width="240" height="22"/>
<text class="txs" x="140" y="72" text-anchor="middle">mezzanine 20.0</text>
<rect class="bxa kf-growx" x="260" y="34" width="60.4" height="22"/>
<text class="txs" x="290.2" y="72" text-anchor="middle">stair 5.03</text>
<rect class="fs kf-growx" x="320.4" y="34" width="114.5" height="22"/>
<text class="txs" x="377.6" y="72" text-anchor="middle">floor 9.54 to P3</text>
<text class="txb" x="443.2" y="50" text-anchor="start">34.6 m</text>
</g>
<g class="kf-a kd2">
<text class="txb" x="20" y="104" text-anchor="start">Proposal, east stair</text>
<rect class="fa kf-growx" x="20" y="112" width="336" height="22"/>
<text class="txs" x="188" y="150" text-anchor="middle">mezzanine 28.0</text>
<rect class="bxa kf-growx" x="356" y="112" width="60.4" height="22"/>
<text class="txs" x="386.2" y="150" text-anchor="middle">stair 5.03</text>
<rect class="fs kf-growx" x="416.4" y="112" width="110.3" height="22"/>
<text class="txs" x="471.5" y="150" text-anchor="middle">floor 9.19 to P2</text>
<text class="txa" x="534.4" y="128" text-anchor="start">42.2 m</text>
</g>
<g class="kf-a kd3">
<path class="lf dsh" d="M260 22V164"/>
<text class="txs" x="260" y="180" text-anchor="middle">D2D5(3) limit 20 m on the mezzanine</text>
<text class="txs" x="20" y="204" text-anchor="start">Route lengths in metres: along the aisles to the top riser, along the nosings, then across the floor to a door to open space.</text>
</g>
```

## What must stay the same

A comparison isolates the effect of the change only if everything else is held constant. For the running case, the brief lists what must be identical in the reference and the proposal:

- **The building.** Same mezzanine, deck height, shelving, stair geometry, barriers and workshop.
- **The occupants.** Same number on the mezzanine, same characteristics, same familiarity with the building.
- **The fires.** Same design fire scenarios, in the same locations, with the same growth.
- **The baseline fire safety systems.** Same DTS-required systems: hydrants, hose reels, extinguishers, emergency lighting and exit signs.
- **The calculation inputs.** Same walking speed, stair speed, response times and flow rates, and the same method of measuring distances.

What may differ is the change itself, the stair position, and anything the proposal adds to compensate, such as detection and an alarm on the mezzanine. Anything added must be part of the solution, specified, evidenced and maintained (Chapter 8). A compensating measure that the owner might remove later is not a compensating measure.

## Measuring both layouts the same way

The first comparison prepared for the running case contained a quiet error. It measured the reference as "20 m", the DTS limit, and the proposal as **√(19² + 9²) = 21.0 m**, the straight-line distance from the far corner to the top riser. On that basis the proposal was only 1 m worse than the reference, and the engineer's first note described the departure as "marginal".

The error was the measurement basis. The DTS limit is a distance measured as D2D20 requires, around built obstructions. With floor-fixed shelving, a person on the mezzanine walks along the aisles, which makes the proposal's route 9 m south plus 19 m east, **28 m**. A DTS layout must meet 20 m on the same basis. Comparing a straight-line proposal distance with an along-the-aisle limit understated the difference by a factor of eight: the real increase is 8 m, not 1 m.

```figure
type: svg
title: The same proposal measured two ways against the 20 m reference
alt: The same proposal measured two ways against the 20 m reference. DTS limit reference: 20 m. Proposal, straight line from the far corner: 21 m. Proposal, along the shelving aisles: 28 m
caption: This is an illustration. Only the along-the-aisle measure is comparable with the DTS limit, because D2D20 measures around built obstructions.
viewbox: 0 0 640 163
body:
<g class="kf-a kd1">
<text class="txb" x="20" y="26">DTS limit reference</text>
<rect class="fp" x="20" y="33" width="470" height="18" rx="3"/>
<rect class="fi kf-growx" x="20" y="33" width="313.3" height="18" rx="3"/>
<text class="txb" x="500" y="47">20 m</text>
</g>
<g class="kf-a kd2">
<text class="txb" x="20" y="75">Proposal, straight line from the far corner</text>
<rect class="fp" x="20" y="82" width="470" height="18" rx="3"/>
<rect class="fi kf-growx" x="20" y="82" width="329" height="18" rx="3"/>
<text class="txb" x="500" y="96">21 m</text>
</g>
<g class="kf-a kd3">
<text class="txb" x="20" y="124">Proposal, along the shelving aisles</text>
<rect class="fp" x="20" y="131" width="470" height="18" rx="3"/>
<rect class="fa kf-growx" x="20" y="131" width="438.7" height="18" rx="3"/>
<text class="txa" x="500" y="145">28 m</text>
</g>
```

The error was found by a peer reviewer who redrew both routes on the shelving plan. It is a common failure: the proposal is measured optimistically and the reference pessimistically, or vice versa, and the comparison quietly favours whichever outcome the author expected. The defence is a single, written measurement method applied to both.

## Avoiding a straw man

A straw-man reference is a DTS design chosen or described to look worse than a real DTS design would be, so that the proposal compares well. In egress solutions, common versions include:

- **A reference with unrealistic conditions.** For example, assuming that in the DTS layout the stair foot would be blocked by stock, while assuming the proposal's stair foot stays clear. Both must carry the same housekeeping assumptions, or the difference must be secured by a condition.
- **A reference stripped of DTS systems.** Removing emergency lighting or exit signs from the reference because "they are not relevant" makes the proposal look better if the proposal keeps them.
- **A reference occupant number that differs.** Using the D2D18 count for the reference and a lower documented number for the proposal.

The running case had one genuine asymmetry that favoured the proposal: the reference stair foot lands in the fabrication area, where hot work and combustible packaging are more likely than beside exit P2. That is a real difference, not a straw man, but the brief treats it carefully. It is recorded as a qualitative benefit, and the proposal must keep a 3 m clear zone at its stair foot as a condition, so that the benefit is secured rather than assumed.

## Writing the reference into the brief

The reference design should be fixed in the performance-based design brief, before any results exist. If it is chosen after the analysis, there is an obvious temptation to pick the reference that makes the proposal look best, and even an honest choice will look suspect to a reviewer.

For the running case, the brief describes the reference in enough detail that another engineer could rebuild it:

1. A plan of the mezzanine and shelving, with the DTS limit stair position marked so that the farthest point is 20.0 m along the aisles.
2. A plan of the DTS alternative, with the stair at the middle of the south edge.
3. The measurement method: along the aisles to the nearest riser, along the nosings, then the shortest walkable route to the nearest door to open space.
4. The list of items held identical between reference and proposal.
5. The list of items that differ, which is only the stair position and the compensating measures.

That last list is short, and it should be. Every item on it is something the analysis must account for. If the list of differences grows long, the comparison is no longer comparing like with like, and the engineer should step back and consider whether the comparative route still fits.

There is also a practical benefit. When the certifier reviews the final report, the first thing they check is whether the comparison was fair. A reference written down in advance, agreed by the stakeholders and applied unchanged answers that question in one page. A reference that appears for the first time in the results section invites the reviewer to rebuild the whole analysis.

## Equivalence on more than one measure

The four measures listed at the start of this chapter rarely move together. The running case's proposal is worse on one, better on another and uncertain on the rest:

- **Time to reach safety.** Worse without compensation, because the walk is longer. Chapter 6 shows that detection on the mezzanine can more than recover the difference.
- **Survivable conditions along the route.** The route is the same height above the floor for longer, so exposure is the concern. Chapter 7 treats this through the comparison of available and required escape time.
- **Likelihood of the route being blocked.** Probably better, because the stair foot is in a clear zone beside an exit rather than in the fabrication area, but only if the clear zone is kept.
- **Wayfinding.** Worse, because the route has two turns between shelving rows. Direction signs to E4P2 are part of the solution.

The comparison must address each measure, and the final report must say how each was handled. A solution that wins decisively on one measure and ignores another is incomplete, however good the headline number looks.

## When a comparison is not enough

The comparative route works when there is a sensible DTS design to compare with and when the change is local. It struggles in three situations.

**No DTS analogue.** Some buildings, such as very large warehouses with unusual geometry, have no DTS design that is a realistic comparison. Comparing them with a hypothetical DTS building of a kind nobody would build proves little.

**The change alters the fire itself.** If a proposal changes the fire load, the ventilation or the compartment size, the fire in the proposal is not the same as the fire in the reference, and the "everything else equal" assumption breaks.

**Several departures at once.** Each departure may be small against its own reference, but the combination may have no DTS equivalent at all.

In those cases, an absolute approach, showing directly that the Performance Requirements are met, or the Fire Safety Verification Method in C1V4 and D1V4 may be more appropriate. Chapter 5 discusses the methods. The running case fits the comparative route well: one local departure, the same fire and a clear DTS alternative.

## The reference is also the sanity check

A useful side-effect of building a reference is that it shows the size of the problem. The DTS limit layout's total route is about 34.6 m; the proposal's is about 42.2 m, an increase of about 7.65 m. Most of that, 8 m, is on the mezzanine, partly offset by a stair foot 0.35 m closer to its door. At an assumed walking speed of 1.0 m/s, the added walk is a few seconds. That does not settle anything on its own, because time on the mezzanine may be more dangerous than time on the floor. But it tells the owner, before any modelling, that the question is about seconds of exposure in a particular place, not minutes.

Knowing the scale early helps everyone decide how much analysis the question deserves. A departure measured in seconds for seven trained people suggests a proportionate, comparative analysis. A departure measured in minutes for hundreds of members of the public would suggest something much more rigorous.

```figure
type: svg
title: Fair comparison rules agreed for the running case
alt: Fair comparison rules agreed for the running case. Done: Primary reference: DTS limit layout at 20 m; sensitivity reference: the DTS alternative at 18.5 m. Done: Both measured along the shelving aisles, then the stair nosings, then the floor route. Done: Identical building, occupants, fires, baseline systems and calculation inputs. Done: Compensating measures are part of the solution and must be maintained. Done: Stair foot clear zone of 3 m secured as a condition, not assumed. Open: Peer reviewer to redraw both routes before the analysis is accepted
caption: This is an illustration. The rules are written into the design brief and applied to both layouts.
viewbox: 0 0 640 393
body:
<g class="kf-a kd1">
<rect class="bx" x="20" y="12" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="29" r="11"/>
<path class="la draw" pathLength="1" d="M34 29l4 4 8-8"/>
<text class="txb" x="64" y="32">Primary reference: DTS limit layout at 20 m; sensitivity</text>
<text class="txb" x="64" y="51">reference: the DTS alternative at 18.5 m</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="20" y="78" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="95" r="11"/>
<path class="la draw" pathLength="1" d="M34 95l4 4 8-8"/>
<text class="txb" x="64" y="98">Both measured along the shelving aisles, then the stair nosings,</text>
<text class="txb" x="64" y="117">then the floor route</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="20" y="144" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="161" r="11"/>
<path class="la draw" pathLength="1" d="M34 161l4 4 8-8"/>
<text class="txb" x="64" y="164">Identical building, occupants, fires, baseline systems and</text>
<text class="txb" x="64" y="183">calculation inputs</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="20" y="210" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="227" r="11"/>
<path class="la draw" pathLength="1" d="M34 227l4 4 8-8"/>
<text class="txb" x="64" y="230">Compensating measures are part of the solution and must be</text>
<text class="txb" x="64" y="249">maintained</text>
</g>
<g class="kf-a kd5">
<rect class="bx" x="20" y="276" width="600" height="39" rx="6"/>
<circle class="bxa" cx="40" cy="293" r="11"/>
<path class="la draw" pathLength="1" d="M34 293l4 4 8-8"/>
<text class="txb" x="64" y="296">Stair foot clear zone of 3 m secured as a condition, not assumed</text>
</g>
<g class="kf-a kd6">
<rect class="bxi" x="20" y="323" width="600" height="58" rx="6"/>
<circle class="bxi" cx="40" cy="340" r="11"/>
<text class="txa" x="40" y="345" text-anchor="middle">?</text>
<text class="txb" x="64" y="343">Peer reviewer to redraw both routes before the analysis is</text>
<text class="txb" x="64" y="362">accepted</text>
</g>
```

## Exercise: compare against the alternative layout

Using the figures in this chapter, compare the proposal with the DTS alternative layout instead of the DTS limit layout. How much longer is the proposal's route, and where does the difference arise?

**Worked answer.** The DTS alternative's route is **18.5 + 5.03 + 9.54 = 33.07 m**, about **33.1 m**. The proposal's route is **28 + 5.03 + 9.19 = 42.22 m**, about **42.2 m**. The difference is about **9.2 m**.

On the mezzanine, the proposal is **28 − 18.5 = 9.5 m** longer. The stair is identical. On the floor, the proposal's stair foot is **9.54 − 9.19 = 0.35 m** closer to its door. The net difference is **9.5 − 0.35 = 9.15 m**, about 9.2 m. Compared with the DTS limit reference, the difference was about 7.65 m, so the alternative reference is the more demanding comparison by about 1.5 m. That is why the brief uses it as a sensitivity check: if the proposal still performs at least as well against the more demanding reference, the conclusion is robust to the choice of reference.
