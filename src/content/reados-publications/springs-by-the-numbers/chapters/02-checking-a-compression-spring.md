---
book: springs-by-the-numbers
chapterSlug: checking-a-compression-spring
order: 2
title: "Checking a helical compression spring"
description: "How to check a round-wire compression spring: rate from wire and coils, Wahl-corrected stress, solid length and clash allowance, buckling and natural frequency."
draft: false
---

The helical compression spring is the most common spring in machines, and the one most often replaced with something that merely fits the hole. Checking one takes a handful of measurements and five or six numbers: its rate, its forces at the lengths where it works, the stress in the wire at the shortest of those lengths, how far it is from going solid, whether it can buckle, and how fast it can respond. This chapter works through each of them on the VM-8 tool changer's lock plunger spring, as the shop found it.

The lock plunger holds the changer arm parked between tool changes. A pin, pushed by the spring, drops into a notch in the arm's hub; when a change starts, a cam pulls the pin back against the spring and the arm is free to swing. With the arm parked, the spring is 50 mm long. With the pin retracted, it is 38 mm long. The maker's parts list gives a spring of 2.5 mm music wire, 22.5 mm outside diameter, 10 active coils, closed and ground ends, and 62 mm free length. The chapter's mistake is one that turns that 22.5 mm into the wrong rate.

## How a helical spring carries load

A compression spring looks as if it works in compression, but its wire is twisted. Push the ends of a coil together and each turn of wire acts as a short lever arm of length D ÷ 2, twisting the wire's cross-section about its own axis. The stress in the wire is a torsional shear stress, and the spring's deflection comes from the twist of the wire summed over its active length.

That picture gives the two formulas that every helical spring calculation starts from.

```figure
type: formula
title: Rate and stress of a round-wire helical compression spring
formula: k = G d⁴ ÷ (8 D³ Na)
formula: τ = K × 8 F D ÷ (π d³)
formula: C = D ÷ d,  K = (4C − 1) ÷ (4C − 4) + 0.615 ÷ C
caption: D is the mean coil diameter, the outside diameter less one wire diameter. Na is the number of active coils. K is the Wahl factor, which adds the direct shear and the extra stress on the inside of the coil, where the wire is curved most tightly. Fatigue cracks in springs start on that inner surface.
- G | shear modulus of the wire, about 79 to 82 GPa for spring steels
- d | wire diameter
- C | spring index
```

Three features of these formulas drive almost every spring decision. The rate goes with the fourth power of the wire diameter, so a wire 10% thicker makes a spring 46% stiffer. It goes inversely with the cube of the coil diameter, so a small error in D becomes a large error in k. And the stress goes inversely with the cube of the wire diameter, so thin wire carrying a given force is highly stressed.

### The spring index

The ratio C = D ÷ d, the spring index, describes how tightly the wire is coiled. Spring makers find indices of about 4 to 12 easiest to make well. Below about 4 the wire is bent so tightly that coiling damages its surface and the Wahl factor climbs steeply; above about 12 the spring is floppy, tangles in handling and varies more from one to the next. The plunger spring's index is 20 ÷ 2.5 = 8, in the middle of the range, with a Wahl factor of 1.184: the stress on the inside of the coil is 18% above the simple torsion figure.

### Active coils and end types

Not every coil of a compression spring deflects. The end coils are closed down onto their neighbours to give the spring a square seat, and are often ground flat so the spring stands upright and loads evenly. Closed ends add about one inactive coil at each end; grinding does not change that, but it shortens the solid length because the ground coils are thinner at their tips.

```figure
type: compare
title: End types and what they add to a compression spring
cols: Total coils | Solid length | Seating
rowhead: End type
- Plain | Na | (Na + 1) d | Poor: the spring leans
- Plain and ground | Na + 1 | (Na + 1) d | Fair
- Closed, not ground | Na + 2 | (Na + 3) d | Good
- * Closed and ground | Na + 2 | (Na + 2) d | Best: square ends, even load
caption: The relations used by the WORKOS compression spring tools. Spring makers' own rules differ slightly; when the solid length is close to the working length, the maker's figure governs.
```

## The plunger spring in the tool

The [helical compression spring design check](/tools/compression-spring/) takes the wire diameter, the mean coil diameter, the active coils, the end type, the shear modulus, the free length, the working length, an allowable shear stress and the wire's density. It returns the rate, the working load, the Wahl-corrected shear stress at the working length and at solid, the spring index and Wahl factor, the solid length and total coils, the clash allowance between working and solid length, the natural frequency of the spring with both ends fixed, and the slenderness ratio for buckling. It checks round wire under an axial load; it flags buckling and fatigue as matters for separate confirmation.

The maker's parts list gives an outside diameter of 22.5 mm, so the mean diameter is 22.5 − 2.5 = 20 mm. The shop uses a shear modulus of 79.3 GPa for its steel spring wires and an allowable static shear stress of 800 MPa for 2.5 mm music wire. This is an illustration. Music wire's tensile strength is fitted in spring texts as Sut = A ÷ d^m; with Shigley's figures of A = 2,211 MPa·mm^m and m = 0.145, a 2.5 mm wire has Sut = 1,936 MPa, and 800 MPa is 41% of it, a little under the 45% often used for static springs that have not had their set removed.

```figure
type: steps
title: The lock plunger spring in the compression spring tool, at its retracted length
caption: This is an illustration. 2.5 mm wire, 20 mm mean diameter, 10 active coils, closed and ground, G = 79.3 GPa, free length 62 mm, working length 38 mm, allowable 800 MPa.
- Spring rate | 4.840 N/mm
- Working load at 38 mm | 116.2 N
- Shear stress at 38 mm | 448 MPa: STRESS WITHIN ALLOWABLE
- Shear stress at solid | 598 MPa: can be pressed solid without exceeding 800 MPa
- Spring index / Wahl factor | 8.00 / 1.184
- Solid length / total coils | 30.00 mm / 12
- Clash allowance at 38 mm | 8.00 mm
- Natural frequency | 224 Hz
- * Slenderness L₀/D | 3.10: check buckling
```

Run again at the parked length of 50 mm, the tool gives 58.1 N and 224 MPa. So the spring pushes the pin into the notch with 58 N and resists the cam with 116 N when it is pulled back.

### Stress at the working length and at solid

The working stress, 448 MPa, is the one that matters in service. The stress at solid, 598 MPa, matters for a different reason: a spring that can be pressed solid in assembly, by a fitter's thumb or a misadjusted cam, must survive it without taking a set. If the stress at solid is above the allowable, the spring needs a stop that keeps it off solid, or it will shorten the first time it is fully compressed. The plunger spring passes both.

### Clash allowance

The clash allowance is the gap left between the working length and the solid length, here 8 mm. Coils do not close all at once: as a spring approaches solid, the coils nearest the ends touch first and the rate rises. Spring makers like at least 10 to 15% of the working deflection held back as clearance, so that tolerance on the coiling and the parts around the spring cannot drive it solid. The plunger's working deflection from free to 38 mm is 24 mm, and 8 mm is a third of that: ample.

## Buckling

A long, slender compression spring loaded between two plates can bow sideways like a strut. Whether it does depends on its slenderness, its deflection and how its ends are held. The tool screens with the ratio of free length to mean diameter: below 2.6, buckling is unlikely for any end condition. The plunger spring's ratio is 62 ÷ 20 = 3.10, so the tool asks for a check.

Shigley's gives the limit for absolute stability as a free length below 2.63 D ÷ α, where α is an end-condition constant: 1 for ends free to pivot, and 0.5 for both ends held square on flat parallel surfaces. The plunger spring sits on ground ends against a flat seat at one end and the flat back of the pin at the other, so α is close to 0.5 and the limit is 2.63 × 20 ÷ 0.5 = 105 mm. At 62 mm it is stable. If the pin could tilt in its bore, the limit would fall towards 53 mm and the spring would be near it.

In the VM-8 the spring also runs over the pin's 15 mm stem and inside a 23.5 mm bore, so it is guided along its whole length. Guiding prevents buckling but adds rubbing, so the shop checks that the spring's outside diameter, which grows slightly as it is compressed, stays clear of the bore, and that the stem is smooth.

```figure
type: decision
title: Does a compression spring need a buckling check?
caption: The VM-8 rebuild's rule. This is an illustration.
- L₀ ÷ D below 2.6 | Stable for any end condition | No check needed
- L₀ ÷ D 2.6 to 5.2, ends square on parallel plates | Usually stable | Confirm with the end-condition formula
- Ends free to tilt, or L₀ ÷ D above 5.2 | Likely to buckle under large deflection | Guide on a rod or in a bore, or redesign shorter
```

## Natural frequency and surge

A spring has mass as well as stiffness, so it has natural frequencies of its own. If one end is moved suddenly, a compression wave runs along the coils and reflects from the other end; if the motion repeats near the spring's natural frequency, the coils can surge, clash together and lose contact with their seats. Valve springs in engines are the classic case.

The tool gives the first natural frequency of a spring with both ends fixed as fn = ½ √(k ÷ m), with m the mass of the active coils. For the plunger spring, 24 g of active coil and 4,840 N/m give 224 Hz. The changer's cam moves the pin over about 0.2 s, a motion whose content is a few hertz. The spring is in no danger of surge. A rule used by many designers is to keep the spring's natural frequency at least 15 to 20 times the frequency of the motion that drives it.

## Tolerances

A spring made to the parts list will not give exactly 116.2 N at 38 mm. Wire diameter varies by a few hundredths of a millimetre, the coil diameter by a few tenths, and the free length by more, because the coiling machine's result depends on the wire's stiffness from batch to batch. Because the rate goes with d⁴ ÷ D³, a 1% thicker wire and a 1% smaller coil together raise the rate by about 7%.

Spring makers deal with this by adjusting what they are not asked to hold. If the drawing fixes the force at one length with a tolerance, the maker may vary the free length to hit it; if it fixes the force at two lengths, the maker may also adjust the active coils. That is why Chapter 1's specification gives forces at working lengths, and leaves the free length as a reference dimension. For the plunger, the shop asked for 55 N ± 10% at 50 mm and 100 N ± 10% at 38 mm on the replacement springs, and let the maker choose the free length and coils within the space available.

## The mistake: outside diameter as mean diameter

The first check of the plunger spring was done by an apprentice working from the parts list. The list gives 22.5 mm, and the apprentice entered it as the mean coil diameter. The tool returned a rate of 3.399 N/mm and a force of 81.6 N at 38 mm, 30% below the figures above, and a stress of 348 MPa. The apprentice concluded that the spring was lightly stressed and could be replaced by a cheaper, lighter one.

```figure
type: compare
title: The plunger spring with the right and wrong coil diameter
cols: Rate, N/mm | Load at 38 mm, N | Stress at 38 mm, MPa
rowhead: Diameter entered
- 22.5 mm, outside diameter taken as mean | 3.399 | 81.6 | 348
- * 20.0 mm, the true mean diameter | 4.840 | 116.2 | 448
- 17.5 mm, inside diameter taken as mean | 7.225 | 173.4 | 600
caption: This is an illustration. 2.5 mm wire, 10 active coils, 62 mm free length. Because the rate goes with 1 ÷ D³, a 12.5% error in the diameter becomes a 30% error in the rate in one direction and a 49% error in the other.
```

The error was found when the bench test of the old spring, set aside for the record, gave 108.9 N at 38 mm: nowhere near 81.6 N. Allowing for its 1.5 mm of set, the old spring's rate measured 4.84 N/mm, matching the calculation with the mean diameter. The shop's checking routine now asks two questions of every spring calculation: was the diameter entered the mean diameter, and does the calculated rate agree with a measured one?

### Other ways a check goes wrong

The same routine lists the other common slips:

```figure
type: checklist
title: Before trusting a compression spring calculation
caption: The VM-8 rebuild's checks. This is an illustration.
- x Mean coil diameter used, not outside or inside
- x Active coils counted, not total coils; end type known
- x Free length measured, and compared with the drawing for set
- x Working lengths taken from the parts around the spring, not from the spring
- x Shear modulus for the actual wire: stainless and alloy wires differ from carbon steel
- x Stress at solid checked, or a stop provided
- x Calculated rate compared with a measured one
```

## What the check showed

The VM-8's original plunger spring, as designed, is sound for static strength: 448 MPa against 800 MPa, a solid stress within the allowable, ample clash allowance, stable against buckling and far from surge. Yet it had taken 1.5 mm of set and two had broken. The static check cannot explain either: even pressed solid, the spring stays below its allowable. Springs that have not had their set removed by the maker, by compressing them solid before delivery, lose some free length in their first period of service, and lose more when they work at high stress; and broken springs in a part that cycles with every tool change point to fatigue. Both clues lead to the stress range in service, which Chapter 4 follows. Chapter 3 first designs a replacement from the forces the changer needs.

## Exercise: a spring with two more coils

A previous fitter had replaced one broken plunger spring with a spring of the same wire, diameter and free length but 12 active coils, closed and ground. Using the compression spring tool's formulas, find its rate, its force at the parked length of 50 mm and at the retracted length of 38 mm, the stress at 38 mm and its clash allowance. Does it do the job, given that the changer needs at least 50 N on the pin when parked?

### Worked answer

The rate scales inversely with active coils: 4.840 × 10 ÷ 12 = 4.033 N/mm. At 50 mm the deflection is 62 − 50 = 12 mm, so the force is 4.033 × 12 = 48.4 N. At 38 mm it is 4.033 × 24 = 96.8 N.

The index and Wahl factor are unchanged at 8 and 1.184, so the stress at 38 mm is 1.184 × 8 × 96.8 × 20 ÷ (π × 2.5³) = 374 MPa.

With closed and ground ends the spring has 14 total coils and a solid length of 14 × 2.5 = 35 mm. At 38 mm the clash allowance is only 3 mm, an eighth of the 24 mm working deflection.

The spring is less stressed than the original, but it fails the job: 48.4 N is below the 50 N the changer needs to hold the arm, and with only 3 mm before solid, a cam that overtravels by 3 mm would drive it solid. The tool, run at 38 mm, gives the same figures: 4.033 N/mm, 96.8 N, 374 MPa, a solid length of 35 mm and a clash allowance of 3 mm. Run at 50 mm it shows the 48.4 N that leaves the arm under-held.
