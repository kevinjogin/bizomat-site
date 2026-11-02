---
book: buckling-by-the-numbers
chapterSlug: crooked-members-and-offset-loads
order: 5
title: "Crooked members and offset loads"
description: "How initial crookedness and off-centre loads turn the sudden buckle into growing bending: the amplification factor, the secant formula, wind on a tank stand and a detail that moved the load line."
draft: false
---

The strut of Chapter 1 was perfectly straight and loaded exactly along its centreline. No real member is. Rolled and welded sections leave the mill or the jig with a slight bow, and loads arrive through connections that are never exactly on the centroid. Those small departures change the character of buckling. Instead of staying straight until a sudden fork, a real member starts bending as soon as it is loaded, and the bending grows faster and faster as the load approaches the Euler load.

This chapter shows how fast, introduces the secant formula that turns an offset load into a peak stress, adds the wind on HT-8's tank to its leg loads, and works through a connection detail that moved the load line by 88 mm.

## A crooked strut under load

Suppose a pinned strut starts with a small bow of δ₀ at mid-height. When a load P is applied, the bow grows. For a bow in the shape of the buckling mode, the result is simple:

```figure
type: formula
title: Growth of an initial bow under axial load
formula: δ = δ₀ ÷ (1 − P ÷ P_E)
formula: Amplification factor: 1 ÷ (1 − P ÷ P_E)
formula: Mid-height bending moment: M = P × δ
caption: The initial bow δ₀ is amplified as the load P approaches the Euler load P_E. At half the Euler load it has doubled; at 90% it is ten times its original size.
- δ₀ | initial bow at mid-height, mm
- δ | total bow under load, mm
- P_E | Euler load of the member on its effective length
```

The amplification factor is the key idea. It does not depend on how big the initial bow is: it multiplies whatever is there. A perfectly straight member has nothing to amplify and stays straight until P_E; a crooked one bends from the start.

```figure
type: line
title: Mid-height bow of a 4,000 mm pinned leg as the load rises
x: Load ÷ Euler load
y: Total bow at mid-height, mm
ymin: 0
ymax: 340
legend: Initial bow 4 mm, L ÷ 1,000 | Initial bow 8 mm, L ÷ 500 | Initial bow 16 mm, L ÷ 250
caption: Each curve is the initial bow multiplied by 1 ÷ (1 − P ÷ P_E). The curves do not jump at P_E; they rise steeply towards it. A member with a larger initial bow reaches any given bow, and so any given bending stress, at a lower load.
- 0 | 4 | 8 | 16
- 0.2 | 5 | 10 | 20
- 0.4 | 6.7 | 13.3 | 26.7
- 0.6 | 10 | 20 | 40
- 0.8 | 20 | 40 | 80
- 0.9 | 40 | 80 | 160
- 0.95 | 80 | 160 | 320
```

The chart explains why real members fail before the Euler load. As the bow grows, so does the bending moment P × δ, and the bending stress adds to the direct stress P ÷ A on the inside of the bow. At some load short of P_E, the combined stress reaches yield at the outer fibre. From then on the member's stiffness falls, the bow grows faster still, and the member collapses.

There is a close parallel in physics. A magnet cooled through its Curie point in a perfectly zero magnetic field has to choose a direction of magnetisation spontaneously, at a sharp transition. In even a small applied field, the field picks the direction in advance and the magnetisation grows smoothly as the temperature falls, with no sharp transition at all. Initial crookedness plays the part of the field: it decides in advance which way the member will bow, and it smooths the sudden fork into a steep but continuous curve.

## Offset loads and the secant formula

An offset load is one that acts parallel to the member's centreline but at a distance e from it. A load applied through a bracket on the side of a column, or through a connection that bears on one edge of a cap plate, is offset. It bends the member from the start, and the axial load then amplifies that bending in the same way as an initial bow.

For a pin-ended member with the same offset e at both ends, the peak stress is given by the secant formula:

```figure
type: formula
title: The secant formula for an offset load
formula: σ_max = (P ÷ A) × [1 + (e × c ÷ r²) × sec((K × L ÷ 2r) × √(P ÷ (A × E)))]
caption: The term e × c ÷ r² is the eccentricity ratio. The secant term is 1 at zero load and grows without limit as P approaches the Euler load. Setting σ_max equal to the yield stress and solving for P gives the load at which the member first yields.
- e | offset of the load from the centroid, mm
- c | distance from the centroid to the extreme fibre, mm (38.05 for the HT-8 leg)
- r | radius of gyration, mm
- K × L | effective length, mm
```

The secant formula does not have a neat inverse, so the load at which the peak stress reaches yield has to be found by trial or by a numerical search. The KEVOS® [Eccentrically loaded column (secant formula)](/tools/eccentric-column/) tool does that search. From the axial load, eccentricity, area, second moment of area in the bending plane, distance to the extreme fibre, length, effective length factor, modulus and yield strength, it reports the peak stress at your load, the direct stress, the Euler load, and the load factor at which the peak stress first reaches yield, compared with the factor you require. It assumes an elastic, prismatic member with equal eccentricities at both ends, and it refuses a load at or above the Euler load.

A small initial bow can be handled in the same tool by adding it to the eccentricity. The two are not identical, because a bow is largest at mid-height and an end offset is the same everywhere, but for a first check the sum is a reasonable and slightly conservative approximation.

## Wind on HT-8

Chapter 2 sent the wind on HT-8's tank into the diagonals. The wind also tries to overturn the stand, and the overturning moment is resisted by extra compression in the downwind legs and less compression, or tension, in the upwind ones.

This is an illustration. The assumed horizontal wind force on the tank is 3.52 kN (Chapter 2), acting at the centre of the tank, about 5.1 m above the base plates. The overturning moment is 3.52 × 5.1 = 17.95 kN·m.

```figure
type: steps
title: Extra leg compression from wind on HT-8
caption: This is an illustration. The assumed 1.0 kPa wind pressure is not a design value; real wind actions come from AS/NZS 1170.2. The diagonal case is approximate: it gives the whole moment to the single corner leg, which is slightly conservative.
- Wind force on the tank | 1.0 kPa × 0.8 × 2.2 m × 2.0 m = 3.52 kN
- Height of the force above the base plates | 4.0 + 0.1 + 1.0 = 5.1 m
- Overturning moment | 3.52 × 5.1 = 17.95 kN·m
- Wind square to a face | two downwind legs, 2.2 m lever arm: 17.95 ÷ 2.2 ÷ 2 = 4.08 kN each
- * Wind along a diagonal | one corner leg, 2.2 × √2 = 3.11 m lever arm: 17.95 ÷ 3.11 = 5.77 kN
- Leg load with wind | 19.67 + 5.77 = 25.44 kN
```

The diagonal wind case gives the largest load on one leg: 25.4 kN, 29% more than the gravity load alone. Load combinations for real design apply load factors to each action and combine them by rules set out in AS/NZS 1170.0; the simple sum here is for illustrating the buckling check, not for design.

## HT-8's leg with an offset load

This is an illustration. The tank's top frame of 100 × 100 SHS sits on a 12 mm cap plate welded to the top of each leg. The frame's centreline is designed to lie directly over the leg's, but fit-up tolerances, the frame's own bow and the way the tank bears on the frame mean that the load can arrive off-centre. The shop's engineer allowed 15 mm of offset at the top of each leg, and checked the upper 2,000 mm segment, between the cap plate and the mid-height struts, with the same offset taken at both ends, which is conservative because the struts carry the bottom of the segment with little or no offset.

```figure
type: compare
title: HT-8 leg segment with a 15 mm offset load, CHS 76.1 × 3.6
cols: Direct stress, MPa | Peak stress, MPa | Load factor to first yield
rowhead: Load case
- Gravity only, 19.7 kN | 24.0 | 46.8 | 5.57
- * Gravity and diagonal wind, 25.4 kN | 31.0 | 61.4 | 4.30
- Gravity and wind, offset plus a 2 mm bow, 17 mm | 31.0 | 65.5 | 4.08
caption: This is an illustration. Secant formula on a 2,000 mm effective length, A = 820 mm², I = 540,065 mm⁴, c = 38.05 mm, E = 200 GPa, yield 350 MPa. The load factor is the multiple of the load at which the peak stress first reaches yield.
```

With the gravity and wind load and the 15 mm offset, the eccentric column tool reports a peak stress of 61.4 MPa against a direct stress of 31.0 MPa, an Euler load of 266.5 kN, and a load factor to first yield of 4.30. The offset has doubled the peak stress, but the segment, braced at 2,000 mm, still has a good margin. Adding a 2 mm bow, the shop's allowance for a 2,000 mm segment built to a straightness of 1 in 1,000, lowers the factor only slightly, to 4.08.

The load factor to first yield is a different number from the buckling factor of Chapter 4. It is the multiple of the load at which the most highly stressed fibre starts to yield. A member can usually carry somewhat more than that before it collapses, but for checking an imperfect member it is a sound and simple limit.

### Where imperfections come from

The initial bow of a member is not a single number set at the mill. It builds up through the member's life. Hot-rolled and cold-formed sections leave the mill within a straightness tolerance. Welding shrinks the weld metal as it cools, which pulls a member towards the side with more weld, and a leg with a gusset welded to one side will bow away from it. Galvanising heats the whole member to about 450 °C, relieving and redistributing residual stresses, and long, light members can come out of the bath bent. Handling bends members that are lifted from one point or dropped. And on site, a member exposed to sun on one side and shade on the other bows towards the shade while the temperature difference lasts.

Each of these can be measured: a string line or a laser along the member, read at its middle, gives the bow directly. The shop records the bow of each HT-8 leg before erection (Chapter 11) and compares it with the 2 mm it assumed for a 2,000 mm segment.

### First yield and the buckling curves

A useful check on the methods of Chapter 4 is to compare them with a first-yield calculation for a realistic imperfection. This is an illustration. With a bow of 2 mm and no offset, the HT-8 leg segment under the gravity and wind load of 25.4 kN has a load factor to first yield of 7.56 by the secant formula. The Johnson parabola gives a buckling load of 209.7 kN, a factor of 8.24 on the same load. The two are within about 10% of each other.

That is not a coincidence. The idea of treating a column's strength as the load at which an imperfect member first yields goes back to the 1880s, and it underlies the column curves of several modern codes, which choose the imperfection to represent the members tested. The Johnson parabola, with no explicit imperfection, happens to land close to a member with a bow of about 1 in 1,000 at this slenderness. A member with a worse bow, or an offset load, falls below it, which is why the offset must be checked separately and not assumed to be covered by the buckling curve.

## The error: a detail that moved the load line

This is an illustration. When the fabrication drawings for HT-8 came back from the drafter, the top of each leg had been redrawn. To make the welding easier, the leg was no longer under the top frame with a cap plate; it ran up beside the frame, and the frame was welded to the side of the leg. The drafter had not thought of it as a structural change.

The checker traced the load path with a pencil: from the tank, into the top frame, and down into the leg. The frame's centreline was now beside the leg, not over it. The offset was half the frame's width plus half the leg's diameter: 50 + 38 = 88 mm.

```figure
type: compare
title: HT-8 leg with the load offset by 88 mm, gravity and wind
cols: Peak stress, MPa | Load factor to first yield
rowhead: Effective length
- 2,000 mm, braced at mid-height | 209.3 | 1.57
- 4,000 mm, if the struts were ever removed | 310.3 | 1.07
- For comparison: 2,000 mm with a 15 mm offset | 61.4 | 4.30
caption: This is an illustration. Same leg and loads as before, with e = 88 mm. The eccentricity ratio rises from 0.87 to 5.08, and the peak stress more than triples.
```

At 88 mm the peak stress was 209.3 MPa and the load factor to first yield 1.57, below the shop's requirement of 2 for this check. On the full 4,000 mm length, which would apply during any future maintenance that took the struts out, the factor fell to 1.07: the leg's outer fibre would be close to yield under the full tank and a moderate wind.

The fix was to go back to the original detail, with the leg under the frame's centreline and a cap plate, and to add a note on the drawing: "Leg centreline to coincide with top frame centreline, tolerance ±5 mm." The checker also added a line to the shop's drawing review checklist.

```figure
type: checklist
title: Checking where the load goes in a compression member
caption: The open item is the one the drafter's change missed.
- Load path traced from the load to the foundation | with a pencil on the general arrangement
- ? Centreline of each member that delivers load compared with the column's centreline | any offset is an eccentricity
- Connections bearing on one edge or through one leg flagged | angles, brackets and side plates
- Offsets used in the check stated on the drawing as a tolerance | so fabrication can achieve them
- Initial bow allowance matched to the fabrication tolerance | Chapter 11
```

### Offsets that come and go

Not every offset is fixed by the drawing. Some appear only under load. A top frame that deflects under the tank rotates slightly at each corner, and a rotating frame member bears harder on the inner edge of the cap plate than on the outer, moving the load inwards. A tank that settles unevenly on its pads loads one side of the frame more than the other. And a leg in the afternoon sun, hotter on its western face than its eastern, bows towards the east while the difference lasts, adding a temporary bow that comes and goes with the weather.

None of these is large on a well-built stand, but together they are why the shop allows 15 mm of offset at the top of each leg even though the drawing shows the centrelines meeting exactly. The allowance is a judgement, written down in the design note so that the checker can see it and the fabricator can be held to the tolerance that makes it true. On a more heavily loaded member, closer to its limit, the same effects would deserve a calculation of their own: the frame's rotation from a beam analysis, the settlement from the pad's stiffness, and the thermal bow from the temperature difference across the section, as Chapter 8 shows for a member restrained at both ends.

## Living with imperfection

The practical lessons of this chapter can be put in three sentences. Every compression member is imperfect, so check it with an imperfection, either directly through the secant formula or indirectly through a code curve that includes one. Keep the load on the centreline by detailing, because an offset of a few tens of millimetres can do more harm than any reasonable crookedness. And keep the load well below the Euler load, because the amplification factor grows without limit as it approaches it; a member working at half its Euler load doubles its imperfections, one at 90% multiplies them by ten.

## Exercise: the leg without its struts

This is an illustration. During a maintenance shutdown, a contractor proposes removing two of HT-8's mid-height struts to get a pump out, with the tank still full and the original 15 mm offset detail in place.

1. What is the Euler load of a leg over the full 4,000 mm?
2. Using the gravity and wind load of 25.4 kN, what is the amplification factor for an initial bow?
3. The eccentric column tool gives a load factor to first yield of 2.02 for this case. Would you allow the work?
4. What would you require instead?

**Worked answer.**

1. From Chapter 1, P_E = **66.6 kN** on 4,000 mm.
2. P ÷ P_E = 25.44 ÷ 66.63 = 0.382, so the amplification factor is 1 ÷ (1 − 0.382) = **1.62**. Any initial bow or offset bending is increased by 62%, against 11% on the braced 2,000 mm segment.
3. A load factor of 2.02 just meets the shop's requirement of 2 for this check, but only with the assumed wind, the assumed offset and no allowance for the struts' role in holding the legs during the work. Removing the struts also changes the frame: Chapter 2 showed that the diagonals rely on the struts to brace the legs at mid-height. **No**, the work should not go ahead as proposed.
4. Either drain the tank first, which cuts the leg load to about 1 kN plus wind, or fit temporary struts before removing the permanent ones, so that the legs are never unbraced under load. The method statement should say which, and someone competent should check it before the work starts.
