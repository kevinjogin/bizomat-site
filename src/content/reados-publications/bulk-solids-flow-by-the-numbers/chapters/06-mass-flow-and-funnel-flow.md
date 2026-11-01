---
book: bulk-solids-flow-by-the-numbers
chapterSlug: mass-flow-and-funnel-flow
order: 6
title: "Mass flow and funnel flow"
description: "The two ways a bin discharges, what each means for first-in-first-out, ratholes, segregation and live capacity, what decides between them, and how to check a hopper and prove its flow pattern."
draft: false
---

Open the outlet of a full bin and one of two things happens. Either the whole contents move downwards together, sliding along the hopper walls as they go, or only a channel above the outlet moves while the material around it stays where it is. The first is called mass flow and the second funnel flow, or core flow. Which one a bin runs in decides whether it empties completely, whether the oldest material comes out first, whether a blend comes out mixed and whether a cohesive powder can form a stable hole down the middle.

This chapter describes both patterns and their consequences, explains what decides between them, and checks Plant C's two stores. It also shows how the plant found out that S1, sold as a mass-flow silo, was not one.

## The two flow patterns

In **mass flow**, every particle in the bin is moving whenever material is drawn from the outlet. The material slides on the hopper walls. The level falls evenly, apart from a shallow crater at the top, and the first material in is the first material out. Nothing stays in the bin longer than one fill-and-empty cycle.

In **funnel flow**, a flow channel forms above the outlet, roughly the width of the outlet at the bottom and widening upwards. Material in the channel moves; material outside it, in the hopper corners and often against the cylinder walls, stays still. The top surface falls in a crater over the channel, and material slides from the surface into the channel. The last material in is often the first out, and material against the walls may stay for weeks or months until the bin is emptied completely.

```figure
type: svg
title: Mass flow and funnel flow in the same cylinder
alt: Two bins side by side. On the left a bin with a steep cone is shaded entirely as moving material, with arrows pointing down along the walls and through the middle, labelled mass flow. On the right a bin with a flatter cone has a shaded moving channel from the outlet to the top surface, widening upwards, with unshaded stagnant regions between the channel and the walls, labelled funnel flow with stagnant zones.
caption: In mass flow the whole contents move and slide on the walls. In funnel flow only a channel above the outlet moves; the rest is stagnant until the channel draws it in from the top surface. Whether a hopper gives one or the other depends on its wall angle, wall friction and the material's internal friction, not on the angle of repose.
viewbox: 0 0 640 300
body:
<path class="bxa" d="M60 30H260V170L175 262H145L60 170Z"/>
<path class="li" d="M60 30V170L145 262H175L260 170V30"/>
<path class="la flow" d="M110 50V140M160 50V200M210 50V140"/>
<path class="ah" d="M104 140h12l-6 12zM154 200h12l-6 12zM204 140h12l-6 12z"/>
<text class="txb" x="104" y="290">Mass flow</text>
<path class="bx" d="M380 30H436L466 232H380V170Z"/>
<path class="bx" d="M524 30H580V170L496 232H494Z"/>
<path class="bxa" d="M436 30H524L496 232H466Z"/>
<path class="li" d="M380 30V170L466 232H496L580 170V30"/>
<path class="la flow" d="M480 46V200"/>
<path class="ah" d="M474 200h12l-6 12z"/>
<text class="txs tx" x="386" y="110">stagnant</text>
<text class="txs tx" x="528" y="110">stagnant</text>
<text class="txb" x="414" y="290">Funnel flow</text>
<text class="txs tx" x="440" y="22">flow channel</text>
```

There is a third, mixed pattern, often called expanded flow: a steep mass-flow hopper section at the bottom feeding a flatter or flat-bottomed bin above it. The lower section runs in mass flow and its flow channel is wide enough that a stable rathole cannot form above it. It is a common way to convert a large existing bin without rebuilding all of it.

## What each pattern means

```figure
type: compare
title: Consequences of the two flow patterns
rowhead: Effect
cols: Mass flow | Funnel flow
caption: Funnel flow is not wrong for every material. For free-flowing, non-degrading, non-segregating materials it is cheaper and usually adequate. For cohesive, degrading or segregating materials it is the source of most bin problems.
- Discharge order | first in, first out | last in, often first out
- Material left in the bin | none, apart from the outlet | stagnant zones until full clean-out
- Ratholes in cohesive powders | prevented | * can form and stand
- Segregated material on discharge | largely remixed | delivered in size bands
- Flooding of aerated powder | rare, flow is steady | common when ratholes collapse
- Wall wear | higher, material slides on walls | lower, material rests on walls
- Headroom needed | more, steep hopper | less, flatter hopper
```

The stagnant zones in funnel flow matter most for materials that change with time. Powders that cake, products that oxidise, absorb moisture or go off, and anything with a shelf life will age in the stagnant zones. Food and pharmaceutical bins are usually designed for mass flow for this reason. For cohesive powders, the stagnant material has time to consolidate and gain strength, which helps a rathole stand, as Chapter 8 explains.

## What decides the pattern

Mass flow happens when the hopper walls are steep enough and smooth enough for the converging material to slide on them. Jenike's analysis of the stresses in a flowing, converging bulk solid gives a boundary between the two patterns that depends on three things:

- the **wall friction angle**, φ_w, from the wall friction test;
- the **effective angle of internal friction**, δ, from the shear test;
- the **hopper shape**: a cone, in which the material converges from all sides, or a wedge with a slot outlet, in which it converges from two sides only.

Higher wall friction needs a steeper hopper. A conical hopper must be considerably steeper than a wedge-shaped one for the same material and wall: wedge hoppers typically allow a half-angle about ten degrees larger. Jenike published his boundary as design charts, and testing laboratories report the result for the material and wall tested, usually as the largest hopper half-angle from vertical that gives mass flow, with a recommended margin of a few degrees below it, because the boundary is sharp and a hopper close to it can switch between patterns.

Note what is not on the list. The angle of repose, the height of the bin and the outlet size do not decide the flow pattern. A bigger outlet does not turn funnel flow into mass flow.

## Checking S1 and B2

The plant's test reports gave these mass-flow limits, for cones in 2B stainless steel. This is an illustration.

- **S1's pellets:** δ = 32°, φ_w = 14°; mass flow in a cone up to a half-angle of **27°** from vertical, a wall at 63° from horizontal.
- **B2's filler:** δ = 48°, φ_w = 26°; mass flow in a cone up to **12°**, a wall at 78°; in a wedge hopper up to **24°**.

The [hopper and bin design tool](/tools/hopper-bin-design/) compares a hopper's wall angle with the least angle the material needs, entered as an angle from horizontal. For S1, with its 2.6 m cone to a 200 mm outlet and a least angle of 63°, it reports a wall angle of 60.0° and fails the wall angle check: "make the cone taller or the outlet larger". For B2, with a least angle of 78°, it reports 60.1° and fails by 18°.

The tool's advice deserves a comment. Making the cone taller steepens it, which is the right fix. Making the outlet larger also steepens the wall for the same cone height, which is why the tool suggests it, but the material's limit is on the wall angle, so a larger outlet helps only through that geometry. For S1, a 63° cone to the same 200 mm outlet would be 1.5 × tan 63° = **2.94 m** high instead of 2.60 m. For B2, a 78° cone from 1.6 m down to even a 300 mm outlet would be 0.65 × tan 78° = **3.06 m** high, which does not fit under the bag station. That is why Chapter 7's redesign of B2 uses a wedge.

```figure
type: compare
title: Plant C's hoppers against their mass-flow limits
rowhead: Store
cols: Cone wall from horizontal | Least angle for mass flow | Hopper and bin design tool | Flow pattern
caption: This is an illustration. Limits from the plant's test reports for cones in 2B stainless steel. S1 is 3° short of mass flow; B2 is 18° short.
- S1, polypropylene pellets | 60.0° | 63° | wall angle fails by 3° | funnel flow, close to the boundary
- * B2, calcium carbonate filler | 60.1° | 78° | wall angle fails by 18° | funnel flow with ratholes
```

## Live capacity in funnel flow

Funnel flow also changes how much of a bin is usable. The **live capacity** is the amount that will discharge by gravity; the rest is dead. For free-flowing pellets the dead material eventually slides into the channel as the level falls, so S1 empties nearly completely, if not in order. For a cohesive powder the stagnant material can stay put, and the live capacity may be a small fraction of the bin.

B2 shows how small. When the plant's operators looked into it after a stoppage, they found a near-vertical hole about 0.4 m across running from the outlet region to the surface, with the rest of the filler standing around it. The channel's volume, treating it as a 0.4 m cylinder through the 1.5 m cylinder and the 1.26 m cone, is π × 0.2² × 2.76 = **0.347 m³**, or about 264 kg at 760 kg/m³. That is **8.8%** of B2's 3.947 m³. Of a full bin holding about 2,550 kg at 85% fill, only about a tenth would discharge before the hole emptied and the feeder starved, which matches the plant's experience of stoppages within an hour of a bag change. The rest came out only when someone hit the cone.

## Converting an existing bin

A bin in funnel flow does not always need replacing. Common conversions, each to be designed from the material's test results, include:

- **A steeper hopper section at the bottom** feeding the existing bin, giving expanded flow.
- **An insert**, such as an inverted cone or a cone-in-cone, mounted inside the hopper to change the stress field and the flow channel. Inserts can give mass flow in a hopper that would otherwise be too flat, but their position is critical and they carry large loads.
- **A low-friction liner**, such as an ultra-high molecular weight polyethylene sheet, which lowers φ_w and so raises the half-angle at which mass flow is possible. Liners wear and must be fixed so that their joints do not form ledges.
- **A change of outlet shape** from a round outlet to a slot, which turns a cone into a transition with plane-flow walls and allows a flatter wall.

Each changes the loads on the bin as well as the flow, so a structural check goes with it.

## The error: a silo sold as mass flow

This is an illustration. S1's supplier described it in the quotation as a "mass-flow silo for plastic pellets", and the plant had assumed for years that it ran first-in, first-out. The question came up when a customer traced a moulding defect to a pellet lot that, by the plant's records, should have been consumed two weeks earlier.

The engineer ran a tracer test. During the next fill, the tanker driver stopped the delivery three times so that about 25 kg of the same pellets, coloured with a masterbatch, could be dropped through the roof inlet: a red layer near the bottom, a blue layer in the middle and a yellow layer near the top. The extruder hopper was then sampled every 30 minutes as S1 discharged.

The result was unambiguous. The yellow pellets, the last in, appeared at the outlet after about 4 t had been drawn, long before the levels below them should have been reached. The blue appeared next, and red pellets were still turning up in small numbers when the silo was nearly empty. Material from the top was being drawn down a central channel ahead of the material below: funnel flow.

The test report explained why. S1's cone, at 30° from vertical, was 3° outside the 27° mass-flow limit for these pellets on 2B steel. In addition, the slide gate's throat was 180 mm against the hopper's 200 mm outlet, leaving a 10 mm ledge all round on which pellets sat still, and that stagnant ring helped stabilise a funnel above it. The supplier's description had probably been based on a smoother, bright-finished cone of the same angle, on which the wall friction would have been lower.

```figure
type: timeline
title: Tracer pellets at S1's outlet during discharge
caption: This is an illustration. Coloured layers were placed at about 25%, 50% and 85% of the fill. In mass flow they would have appeared in order red, blue, yellow, each at the tonnage that had been below it. In funnel flow the top layer arrived first.
- 4 t discharged | yellow, the top layer, first appears
- 9 t discharged | blue, the middle layer, first appears
- 16 t discharged | yellow mostly gone; blue at its peak
- 26 t discharged | red, the bottom layer, first appears
- 38 t discharged | red still present in small amounts as the silo empties
```

For pellets that do not cake or degrade, funnel flow in S1 is not a crisis. It explained the lot traceability problem and, as Chapter 10 shows, a pattern of dust and fines at the extruder after each delivery. The plant chose three changes: the gate was replaced with one whose throat matches the outlet; lot records were changed to assume mixing of the last three deliveries rather than first-in, first-out; and S1 is now emptied to the cone once a month so that the stagnant material against the walls is cycled out. Converting S1 to true mass flow would have needed a new, steeper cone or an insert, which the plant decided against.

## Proving a flow pattern

A tracer test like Plant C's is the simplest way to find out how an existing bin discharges. A few practical points:

1. Use tracer material with the same size, shape and density as the bulk, such as the same pellets coloured, so the tracer does not segregate on its own.
2. Place tracers at several heights and, if possible, at the wall as well as the centre. Wall tracers that arrive late, or not at all, mark stagnant zones.
3. Sample at the outlet at known intervals of discharged mass, and record first appearance, peak and last appearance for each colour.
4. For powders, a small amount of a distinguishable but similar powder, or a coloured pigment, can serve; check it does not change the flow.

For a new design, the test reports and the mass-flow limits are the evidence, with the margin the laboratory recommends.

## How this applies to a small Australian business

Ask any bin or silo supplier which flow pattern their design gives, for your material and their wall finish, and on what evidence. "Mass flow" in a brochure is a claim, not a property of the steel. If first-in, first-out matters to you, for shelf life, lot tracing or blending, either buy a design backed by tests of your material or run a tracer test on the bin you have. If your material is free-flowing and stable, funnel flow may be perfectly acceptable, and cheaper.

## Exercise: a steeper cone for S1

S1's cone is to be replaced with one at 25° from vertical, giving the recommended 2° margin below the pellets' 27° limit, keeping the 3.2 m diameter and 200 mm outlet. (a) How high is the new cone? (b) By how much does the cone volume change, using V = π h (D² + D d + d²) ÷ 12?

**Worked answer.** (a) The wall is at 65° from horizontal, so the cone height is (1.6 − 0.1) × tan 65° = 1.5 × 2.1445 = **3.217 m**, 0.617 m more than the present 2.6 m. (b) D² + D d + d² = 10.24 + 0.64 + 0.04 = 10.92 m². The new cone holds π × 3.217 × 10.92 ÷ 12 = **9.196 m³**, against 7.433 m³ now, an increase of **1.76 m³**, about 0.96 t of pellets at 545 kg/m³. The silo's overall height rises by the same 0.617 m unless the cylinder is shortened.
