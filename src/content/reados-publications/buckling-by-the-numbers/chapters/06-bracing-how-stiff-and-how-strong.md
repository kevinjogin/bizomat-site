---
book: buckling-by-the-numbers
chapterSlug: bracing-how-stiff-and-how-strong
order: 6
title: "Bracing: how stiff and how strong"
description: "What a brace must do to hold a compression member: the stiffness it needs, the small force it carries, tension-only diagonals, sizing a strut, and what slack in the bracing does."
draft: false
---

Chapter 2 showed that bracing is the most powerful tool against buckling. A strut at mid-height halves the length that can buckle and, for an elastic member, quadruples the buckling load. But a brace only does that if it actually holds the point it is attached to. A brace that is too flexible lets the point move, and the column buckles in a longer shape than intended. A brace that is too weak, or attached by a connection that slips, fails when the column leans on it.

This chapter works out how stiff and how strong HT-8's bracing needs to be, explains why diagonal rods are allowed to work in tension only, sizes the mid-height struts with a BIZOMAT tool, and deals with an error found at erection: bracing installed slack.

## What a brace has to do

Picture one of HT-8's legs with a brace at mid-height. If the brace were infinitely stiff, the mid-height point could not move and the leg would buckle in two half-waves, each 2,000 mm long. If there were no brace, it would buckle in one half-wave 4,000 mm long. With a brace of some finite stiffness, the answer lies in between, and it depends on the brace's stiffness compared with the leg's load.

George Winter, working at Cornell University in the 1950s and 1960s, found a simple way to see this. Replace the leg with two rigid bars joined by a hinge at mid-height, with a spring of stiffness β at the hinge. When the hinge moves sideways by Δ, the axial load P tries to push it further, and the spring pushes back. Balancing moments about the hinge shows that the spring holds the hinge in place as long as its stiffness exceeds an ideal value:

```figure
type: formula
title: Winter's model of a column braced at mid-height
formula: Ideal brace stiffness: β_i = 2P ÷ L_b
formula: Movement at the brace, with an initial offset Δ₀: Δ = Δ₀ ÷ (β ÷ β_i − 1)
formula: Brace force: F = β × Δ, which is 4P × Δ₀ ÷ L_b when β = 2β_i
caption: L_b is the length of each braced segment, here 2,000 mm. A brace exactly at the ideal stiffness allows unlimited movement once the column is imperfect; doubling it keeps the extra movement equal to the initial offset.
- β | brace stiffness, N/mm: the force per millimetre of sideways movement at the braced point
- P | axial load the column must be able to reach in its braced mode, N
- Δ₀ | initial sideways offset of the braced point, mm
```

The model brings out two separate requirements.

**Stiffness.** At the ideal stiffness, a perfect column can just reach its braced buckling load. But a real column has an initial offset, and with a brace at exactly the ideal stiffness the offset grows without limit. Doubling the stiffness keeps the extra movement equal to the initial offset, which is the usual target for design.

**Strength.** The brace force is the stiffness times the movement. With twice the ideal stiffness and an initial offset of Δ₀, the brace force is 4P × Δ₀ ÷ L_b. For an initial offset of 1 in 1,000 of the segment length, that is 0.4% of the column load; for 1 in 500, 0.8%. Bracing forces are small, but they are not zero, and they are needed at exactly the moment the column is most heavily loaded.

## HT-8's bracing: stiffness

This is an illustration. The braced mode of HT-8's leg is the two-segment mode on 2,000 mm, with an elastic Euler load of 266.5 kN. The shop takes that as P in Winter's stiffness formula, so that the brace can hold the mid-height point whatever load the leg reaches up to its Euler load:

β_i = 2 × 266,510 ÷ 2,000 = 266.5 N/mm, and twice that is 533 N/mm.

The brace stiffness comes from the panel of bracing in each face. The mid-height strut is attached to the leg, and the strut's other end is held by the diagonal rods of the adjacent panels. The stiffest part is the strut itself; the most flexible is the diagonal rod, which has to stretch for the braced point to move. Each 16 mm rod has an area of 201 mm² and runs 2,973 mm on the diagonal of a panel 2,200 mm wide and 2,000 mm high. For a sideways movement Δ of the braced point, the rod stretches by Δ × cos θ, where cos θ = 2,200 ÷ 2,973 = 0.740, and its force along the horizontal is again cos θ times its tension. The horizontal stiffness of one rod is therefore:

k = E × A × cos² θ ÷ L_d = 200,000 × 201 × 0.740² ÷ 2,973 = 7,405 N/mm

That is about fourteen times the 533 N/mm the leg needs. Even allowing for the flexibility of the connections, which in practice can halve the stiffness of a bolted rod, the bracing is stiff enough with a large margin. Stiffness is rarely the problem with properly installed diagonal bracing. The error later in this chapter shows when it becomes one.

## HT-8's bracing: strength

The brace force depends on the leg load and the initial offset. This is an illustration.

```figure
type: compare
title: Mid-height brace force on one HT-8 leg
cols: Leg load, kN | Initial offset at mid-height, mm | Brace force, N | Share of leg load
rowhead: Case
- Working load with wind, offset 1 in 1,000 | 25.4 | 2 | 102 | 0.40%
- Working load with wind, offset 1 in 500 | 25.4 | 4 | 204 | 0.80%
- * Leg at its Johnson buckling load, offset 1 in 1,000 | 209.7 | 2 | 839 | 0.40%
caption: This is an illustration. F = 4P × Δ₀ ÷ L_b with L_b = 2,000 mm, for a brace with twice the ideal stiffness. Bracing designed for the force at the leg's capacity, not just at its working load, will hold the leg as long as the leg itself holds.
```

The shop designs the bracing connections for the force at the leg's capacity, about 0.84 kN per leg, rounded up to 1 kN. That is a sound habit: a brace sized only for the working load would be the first thing to fail if the leg were ever overloaded, and its failure would then halve the leg's capacity at the worst possible moment.

### Forces add up along a line of struts

When several columns lean on one line of bracing, their brace forces add. HT-8's struts form a ring at mid-height, and if all four legs were bowed the same way, which is quite possible if they came from the same batch and were welded the same way, each face's strut would collect the brace forces of the legs at its ends and pass them to the diagonals. The diagonals must therefore be checked for the sum of the brace forces of all the legs they restrain, plus the wind.

## Why the diagonals work in tension only

HT-8's diagonals are 16 mm round bar, 2,973 mm long. As compression members they are hopeless. The radius of gyration of a 16 mm bar is 4 mm, its slenderness on the diagonal is 743, and its Euler load is about 0.7 kN.

That does not matter, because the diagonals are arranged in crossing pairs. When the stand tries to lean one way, one diagonal of each pair is stretched and carries tension, while the other is shortened, bows slightly and carries almost nothing. When the stand leans the other way, the roles swap. A tension-only bracing system needs two conditions to work:

- both diagonals of each pair must be present, so that one is always in tension;
- each must be installed taut, so that it starts to carry load as soon as the stand moves, not after it has moved some distance.

The second condition is the one that is easy to lose on site.

## Sizing the mid-height struts

The struts are different. They are compression members in their own right: when the wind blows square to a face, the strut at the mid-height panel point of each braced face carries the horizontal component of the active diagonal's force, and it also collects the legs' brace forces.

This is an illustration. Each strut carries 1.76 kN from the wind, plus up to 0.2 kN of brace force from the two legs at its ends at their working load: about 2.0 kN in all. The strut is 2,200 mm long between leg centres and is treated as pinned at both ends.

The BIZOMAT [Compression strut sizing](/tools/compression-strut-sizing/) tool sizes a pin-ended or end-restrained strut in solid round bar or round tube. From the load, length, effective length factor, modulus, yield and required factor, and for a tube the ratio of outside diameter to wall thickness, it searches for the least outside diameter that gives the required factor, using Euler or Johnson as appropriate. It then reports the slenderness, buckling mode, critical stress, working stress, factor and mass per metre for the size you choose.

```figure
type: steps
title: HT-8 mid-height strut in the compression strut sizing tool
caption: This is an illustration. Tube with a diameter-to-wall ratio of 48.3 ÷ 3.2 = 15.09, E = 200 GPa, yield 350 MPa, required factor 2.5.
- Load and length | 2.0 kN on 2,200 mm, K = 1.0
- Least outside diameter for a factor of 2.5 | 27.6 mm at the same diameter-to-wall ratio
- Size chosen | CHS 48.3 × 3.2: A = 453 mm², r = 15.99 mm
- Slenderness and mode | 2,200 ÷ 15.99 = 137.6, Euler
- Critical stress and working stress | 104.2 MPa and 4.4 MPa
- * Factor of the chosen size | 23.6
- Mass | 3.56 kg/m
```

The tool says a tube of about 27.6 mm outside diameter would do. The shop chose 48.3 × 3.2 anyway, with a factor of 23.6. Three reasons drove that choice, and none of them is buckling under the calculated load.

First, slenderness. A 27.6 mm tube would have a slenderness near 250 on 2,200 mm. Such a member sags visibly under its own weight, rattles in the wind and is easily bent when someone stands on it or hangs a hose from it. The shop limits compression bracing to a slenderness of about 140 for stiffness and robustness, and 48.3 × 3.2 meets that.

Second, the connection. The strut is welded to the 76.1 mm legs through a profiled end, and a 48.3 mm tube gives a good fit and enough weld length.

Third, the strut must carry the brace force at the legs' capacity, not just at their working load. At about 1 kN per leg plus the wind, it still has a large margin.

The tool's checks note that the effective length factor must match how the ends are really held, and that very thin tubes need a local buckling check. A tube with a diameter-to-wall ratio of 15 is far from that concern.

### Connections are part of the brace

A brace is only as good as the joints at its ends. A strut welded to the leg at one end and merely resting against the other braces nothing in tension and very little in compression. A bolted connection in a clearance hole can slip by a millimetre or two before the bolt bears, and that slip adds directly to the braced point's movement, just as slack does. A brace that connects to the leg through a thin gusset plate on one side loads the leg off-centre and can twist it.

HT-8's struts are welded all round to profiled ends that fit the legs, so there is no slip. The diagonals are bolted with a single pin at each end through a fitted hole, which keeps their slip small, and their turnbuckles allow the rods to be tensioned after erection. Each of those details was chosen because of what it does to the brace's stiffness, not just its strength.

## The error: diagonals installed slack

This is an illustration. When HT-8 was erected on site, the diagonal rods were fitted with turnbuckles at their lower ends, and the erection crew left them finger-tight, intending to tighten them after the tank was in place. The tank was then filled for a leak test before anyone came back to them.

During the fill, the plant's maintenance planner, standing beside the stand, pushed one of the legs at shoulder height and felt the whole stand move. A dial gauge on a stand set against the top frame showed that a firm push moved the frame about 12 mm before it stiffened. The diagonals were hanging with about 6 mm of slack each.

Slack changes the stiffness picture completely. Until the slack is taken up, the brace has no stiffness at all, and the frame is a sway frame: Chapter 2 showed that with pinned bases and a full tank, a sway frame of these legs has a factor of 0.85. The only reason the stand had not leaned over was that the slack was limited: once the frame had moved 6 to 12 mm, the rods came taut and the bracing took over. In effect, the slack had become an initial offset of the braced points, and Winter's model shows what that does to the brace forces.

```figure
type: compare
title: Brace force on one leg with slack in the diagonals
cols: Effective offset, mm | Brace force at 25.4 kN, N | Ratio to the taut case
rowhead: Condition
- Taut, initial offset 2 mm | 2 | 102 | 1.0
- 6 mm slack | 8 | 407 | 4.0
- * 12 mm slack | 14 | 712 | 7.0
caption: This is an illustration. The slack is added to the 2 mm initial offset as an approximation: the brace provides no restraint until the slack is taken up. Brace forces grow in proportion, and the legs carry bending from the extra sway.
```

The fill was stopped at half height, the turnbuckles were tightened to take out the slack without bowing the frame, a plumb line was used to check that the top frame was centred over the base, and the turnbuckles were locked with their lock nuts. The fill then continued. The shop added two lines to its erection method statement: "Diagonal bracing to be tensioned and locked before any load is placed on the stand," and "Check by pushing: no perceptible movement of the top frame."

```figure
type: checklist
title: Before loading a braced frame
caption: The open item is the one the erection crew left for later.
- All diagonals present in every braced panel | crossing pairs, both members
- ? Diagonals taut and turnbuckles locked | before any load is applied
- Struts welded at both ends and welds inspected | a strut welded at one end braces nothing
- Frame plumb within tolerance | before tensioning locks in any lean
- Temporary bracing in place if any permanent bracing is missing | Chapter 10
```

## Exercise: a heavier stand

This is an illustration. The shop is asked to quote a similar stand for a larger tank, with each leg carrying 60 kN at its working load, braced at mid-height with segments of 2,000 mm, and an initial offset of 2 mm.

1. If the bracing is designed for the leg's working load, what ideal brace stiffness and what design stiffness (twice ideal) does Winter's model give?
2. What is the brace force at the working load with the design stiffness?
3. Is 16 mm diagonal rod, with a horizontal stiffness of 7,405 N/mm per rod, stiff enough?
4. Why might the shop still design for a larger brace force than question 2 gives?

**Worked answer.**

1. β_i = 2 × 60,000 ÷ 2,000 = **60 N/mm**; design stiffness **120 N/mm**. (If the shop again used the segment's Euler load as P, as it did for HT-8, the requirement would be set by the leg's section, not its load.)
2. F = 4 × 60,000 × 2 ÷ 2,000 = **240 N**, 0.4% of the leg load.
3. Yes, by a wide margin: **7,405 N/mm** against 120 N/mm, even allowing for flexible connections.
4. Because the brace should hold the leg up to the leg's own capacity, not just its working load, and because slack, larger initial offsets and the sum of several legs' forces on one line of bracing all increase the force. Designing the connections for the force at the leg's buckling load, as the shop did for HT-8, covers all of these.
