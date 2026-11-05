---
book: springs-by-the-numbers
chapterSlug: disc-spring-stacks
order: 7
title: "Disc spring stacks: large forces in short spaces"
description: "How disc (Belleville) springs carry large forces in little space: the Almen–László characteristic, series and parallel stacking, stack design for force and travel, and stresses."
draft: false
---

When a spring must give thousands of newtons in a space a few centimetres across, coil springs stop being practical. The VM-8's spindle needs about 10 kN to pull a tool holder into its taper, from a spring that fits inside a hollow spindle about 32 mm across. A coil spring of that size carrying 10 kN would be stressed far beyond any wire's strength. Machine tool spindles use disc springs instead: shallow coned washers that flatten under load, stacked by the dozen on the drawbar.

This chapter explains how a disc spring works, how stacking discs face to face and nested together sets a stack's travel and force, and how the VM-8's drawbar stack was designed with the BIZOMAT disc spring tools. Its mistake is a stack designed at its clamped position with no room left for the travel that releases the tool.

## How a disc spring works

A disc spring is a dished annulus: a washer pressed into a shallow cone. Pushed flat, the cone's material is bent and stretched round its circumference, and the force needed rises with the deflection, but not in a straight line. How far from straight depends on the ratio of the cone height h0 to the thickness t. Discs with h0 ÷ t below about 0.4 are nearly linear; around 0.75 the curve flattens noticeably as the disc approaches flat; above about 1.4 the force passes a maximum and falls, which is useful for special purposes and awkward for ordinary ones.

The standard analysis is the Almen–László method, which treats the disc as rotating about a point in its cross-section as it flattens.

```figure
type: formula
title: Disc spring force and top inner-edge stress, Almen–László
formula: F = [4E ÷ (1 − ν²)] × t⁴ ÷ (K1 De²) × (s ÷ t) × [(h0 ÷ t − s ÷ t)(h0 ÷ t − s ÷ 2t) + 1]
formula: σI = −[4E ÷ (1 − ν²)] × t² ÷ (K1 De²) × (s ÷ t) × [K2 (h0 ÷ t − s ÷ 2t) + K3]
caption: s is the deflection of one disc, De and Di its outside and inside diameters, t its thickness and h0 its free cone height. K1, K2 and K3 depend only on De ÷ Di. σI is the compressive stress at the top inner edge, the largest in magnitude, used for static design; fatigue is governed by the tensile stresses at the lower edges.
- E, ν | modulus and Poisson's ratio of the disc
- K1, K2, K3 | shape constants
```

The VM-8's drawbar uses a disc of 31.5 mm outside diameter, 16.3 mm inside, 1.75 mm thick, with a free cone height of 0.70 mm, in spring steel with E = 206 GPa and ν = 0.3. This is an illustration; the dimensions are typical of a disc for a spindle of this size, and the actual disc is taken from the spindle maker's parts list. Its h0 ÷ t ratio is 0.40, so its force is close to linear.

```figure
type: line
title: Force and top inner-edge stress of one drawbar disc
x: Deflection of one disc, mm
y: Force, N (stress magnitude in MPa on the same scale)
caption: This is an illustration. Disc 31.5 × 16.3 × 1.75 mm, h0 = 0.70 mm. With h0 ÷ t = 0.40 the force curve bends only slightly; the force flat is 5,036 N. The working range used in the drawbar lies between 0.45 and 0.525 mm.
series: Force, N | Stress magnitude σI, MPa
- 0.1 | 811 | 423
- 0.2 | 1580 | 829
- 0.3 | 2313 | 1219
- 0.4 | 3018 | 1593
- 0.5 | 3703 | 1951
- 0.6 | 4373 | 2293
- 0.7 | 5036 | 2619
```

The [disc spring tool](/tools/disc-spring/) takes the outside and inside diameters, thickness, free cone height, modulus, Poisson's ratio, the deflection of one disc, and the numbers of discs in series and in parallel. It returns the force of one disc and of the stack, the force at flat, the stack's travel, the stress at the top of the mean diameter and the stress at the top inner edge. It treats discs without contact flats and neglects friction in the stack; it flags a working deflection above about 75% of h0, an h0 ÷ t above about 1.3, and reminds the user that fatigue needs the lower-edge stresses and the maker's data.

### Why not a coil spring?

It is worth seeing why a coil spring cannot do this job. A coil spring with an outside diameter of 30 mm, to fit the spindle bore, carrying 10 kN, would need a very thick wire on a small coil. With 8 mm wire on a 22 mm mean diameter the index is 2.75, far below the 4 that spring makers can coil well, and the Wahl-corrected stress at 10 kN is 1,808 MPa: more than the tensile strength of 8 mm spring wire, about 1,600 MPa by the A ÷ d^m fits. Thinner wire on a larger coil is worse: 7 mm wire on a 23 mm coil reaches 2,587 MPa. No coil spring in that diameter can carry the load.

A disc spring carries load by bending a short, thick ring of steel, not by twisting a long thin wire, so its material works at a much shorter lever arm. That is why disc springs give large forces in small diameters and short lengths, and why they are used in drawbars, clutch and brake packs, bolted joints that must hold preload, and valve actuators.

## Stacking discs

One disc gives a large force over a small travel: the drawbar disc gives 3,871 N at 0.525 mm. Real jobs need more travel, more force, or both, and discs are stacked to get them.

```figure
type: svg
title: Discs in series and in parallel
alt: Three side views of disc spring stacks drawn as shallow chevrons on a vertical rod. On the left, single discs alternate in direction, facing each other in pairs, labelled series: travel adds, force stays the same. In the middle, three discs nest inside each other facing the same way, labelled parallel: force adds, travel stays the same. On the right, groups of three nested discs alternate in direction, labelled series of parallel groups, as in the drawbar.
caption: Discs facing each other act in series: their travels add. Discs nested in the same direction act in parallel: their forces add. The drawbar uses 24 groups of 3 nested discs, alternating, for 72 discs in all.
viewbox: 0 0 660 300
body:
<path class="dsh" d="M110 20V280M330 20V280M550 20V280"/>
<path class="ln" d="M60 60L110 45L160 60M60 70L110 85L160 70M60 110L110 95L160 110M60 120L110 135L160 120M60 160L110 145L160 160M60 170L110 185L160 170"/>
<text class="tx txs" x="40" y="230">Series: travel adds</text>
<path class="ln" d="M280 120L330 105L380 120M280 128L330 113L380 128M280 136L330 121L380 136"/>
<text class="tx txs" x="270" y="230">Parallel: force adds</text>
<path class="ln" d="M500 60L550 45L600 60M500 66L550 51L600 66M500 72L550 57L600 72M500 82L550 97L600 82M500 88L550 103L600 88M500 94L550 109L600 94M500 128L550 113L600 128M500 134L550 119L600 134M500 140L550 125L600 140"/>
<text class="tx txs" x="480" y="230">Series of parallel groups</text>
<text class="tx txs" x="480" y="250">(the drawbar: 24 × 3)</text>
```

In a stack of ns groups in series, each of np discs nested in parallel, the force is np times one disc's force and the travel is ns times one disc's deflection. Friction between nested discs makes the force a little higher while compressing and a little lower while releasing, and long stacks must be guided on a hardened rod or in a bore so they stay centred.

### Standard discs

Disc springs are bought, not made to order. Makers sell them in standard sizes, commonly grouped into series by the ratio of outside diameter to thickness, and the European standard EN 16983, which replaced the earlier DIN 2093, sets dimensions, tolerances and quality requirements for them. A designer normally chooses a stocked disc whose outside diameter fits the bore and whose inside diameter clears the guide rod, then designs the stack around it, as the shop did. Larger discs over about 6 mm thick often have small flats ground at their contact edges, which changes the force calculation; the BIZOMAT tools assume discs without contact flats.

### Friction in the stack

The tools neglect friction, and a stack of nested discs has a lot of it: the nested faces slide on each other as the discs flatten, and every disc's edge slides on its neighbour or on the rod. The result is hysteresis. The force measured while compressing the stack is higher than the calculated force, and the force while releasing it is lower. For the drawbar, the release force the unclamp cylinder must overcome is therefore somewhat more than the 11.6 kN calculated, and the clamping force the tool holder sees after the cylinder lets go is somewhat less than 10.1 kN. Light grease on the discs, where the spindle maker specifies it, keeps the difference down; the force gauge measures the real clamped figure, which is the one that matters.

## Designing the drawbar stack

The spindle maker asks for at least 10 kN of clamping force on the tool holder. To release a tool, a hydraulic unclamp cylinder pushes the drawbar 1.8 mm further against the stack, and the stack must stay within its working range at that point too. The space between the drawbar's shoulder and the spindle's stop is 132 mm long when the tool is clamped. This is an illustration.

The two conditions must be designed together. At the clamped length each disc must deflect enough to give 10 kN from the stack; at the released length, 1.8 mm shorter, no disc may go beyond the usual limit of 75% of its cone height. With 0.7 mm cone height, 75% is 0.525 mm per disc.

The [disc spring stack design tool](/tools/disc-spring-stack-design/) takes one disc's dimensions, modulus and Poisson's ratio, the force needed at the working stroke, the stroke, the largest deflection allowed per disc as a share of h0, and an allowable stress at the top inner edge. It returns the number of groups in series so that each disc stays within the allowed share of h0 over the stroke, the number of discs in parallel to reach the force, the stack force, the deflection per disc, the free and solid stack heights and the stress, with a check on guiding for long stacks.

The shop used it for the clamped condition, with the per-disc limit set to leave room for the release travel. A disc at 0.45 mm, 64.3% of h0, has 0.075 mm left before 75%; 24 groups in series give 24 × 0.075 = 1.8 mm, the release travel needed.

```figure
type: steps
title: The drawbar stack in the disc spring stack design tool, clamped condition
caption: This is an illustration. Disc 31.5 × 16.3 × 1.75 mm, h0 0.70 mm, E 206 GPa, ν 0.3; force 10,000 N at a stroke of 10.8 mm; largest deflection per disc 64.3% of h0; allowable 2,400 MPa.
- Groups in series / discs per group | 24 / 3
- Total discs | 72
- Deflection per disc | 0.450 mm, 64% of h0
- Force per disc | 3,363 N
- * Stack force at the clamped length | 10,088 N
- Free / solid stack height | 142.80 / 126.00 mm
- Stress at the top inner edge | −1,774 MPa: STACK FEASIBLE
```

The free stack is 142.8 mm high, so in the 132 mm space it is compressed by 10.8 mm when the tool is clamped, 0.45 mm per disc. Then the disc spring tool checks the released condition, at 0.525 mm per disc:

```figure
type: steps
title: The drawbar stack in the disc spring tool, tool released
caption: This is an illustration. Same disc, 0.525 mm deflection per disc, 24 in series, 3 in parallel.
- Force, one disc | 3,871 N
- * Stack force | 11,614 N: the unclamp cylinder must overcome this
- Force at flat, one disc | 5,036 N
- Stack travel from free | 12.6 mm
- Stress σOM / σI | −1,178 / −2,038 MPa
- Working deflection | 75% of h0: within the usual range
```

The unclamp cylinder must therefore push at least 11.6 kN, plus friction in the stack and the drawbar's seals. The spindle's cylinder gives 12.5 kN at the hydraulic unit's working pressure. This is an illustration.

### Stress and fatigue

The largest stress, at the top inner edge, is −2,038 MPa at release: compressive, and within the 2,400 MPa static allowable the shop uses for these discs. This is an illustration. Disc spring steels are very hard, and a compressive stress of that size at the top edge does not crack them. Fatigue is decided elsewhere, by the tensile stresses at the lower inner and outer edges, which the BIZOMAT tools do not calculate.

The drawbar cycles every tool change, about 160,000 times a year. Its stress range is small, because the discs only move from 0.45 to 0.525 mm each cycle, and they never unload, because they are preloaded to 64% of h0. Disc makers recommend a preload of at least about 15 to 20% of h0 in cyclic duty to avoid cracking at the top inner edge, and publish fatigue diagrams for their discs that the shop used to confirm the life. This is an illustration.

## The mistake: designing at the clamped length only

The first stack design, drafted by a contractor, used the stack design tool with its default limit of 75% of h0 applied to the clamped condition. For 10 kN at 10.8 mm of stroke, the tool chose 21 groups of 3 discs, each deflected 0.514 mm, giving 11,397 N clamped. It fitted with a spacer, and it met the clamping force with margin.

The reviewing engineer ran the release condition through the disc spring tool. Adding 1.8 mm of travel over 21 groups takes each disc a further 0.086 mm, to 0.600 mm: 86% of h0.

```figure
type: compare
title: Two drawbar stacks, clamped and released
cols: Groups × discs | Clamped force | Released deflection | Released force | Top inner stress, released
rowhead: Design
- Designed at 75% of h0 clamped | 21 × 3 | 11.4 kN | 0.600 mm, 86% of h0 | 13.1 kN | −2,293 MPa
- * Designed to leave release travel | 24 × 3 | 10.1 kN | 0.525 mm, 75% of h0 | 11.6 kN | −2,038 MPa
caption: This is an illustration. Both stacks give at least 10 kN clamped. Only the second stays within 75% of h0 when the tool is released, and only the second can be released by the spindle's 12.5 kN cylinder.
```

At release the first design needs 13.1 kN, more than the unclamp cylinder can give. On the machine it would have shown as a tool that would not release, or released only when the hydraulic pressure was at the top of its range; it would also have worked its discs beyond their usual range on every change. Designing the stack at both ends of its travel caught it before any discs were bought.

## Assembling and releasing a stack

A drawbar stack holds about 56 J in its clamped condition, from Chapter 1, and is assembled under compression. The spindle maker's procedure uses a press fixture that compresses the stack before the retaining nut is fitted or removed; the shop wrote it into a work instruction and tied it to Chapter 1's stored energy register.

```figure
type: checklist
title: Reassembling the VM-8's drawbar stack
caption: The rebuild's work instruction checks. This is an illustration.
- x Stack compressed in the press fixture before the retaining nut is touched
- x Discs counted: 72, in 24 groups of 3
- x Group orientation checked against the drawing, alternating face to face
- x Free stack height measured before fitting: 142.8 mm within the maker's tolerance
- x Discs and drawbar lightly greased where the maker specifies
- x Clamping force measured with a drawbar force gauge after assembly: at least 10 kN
- x Release checked at the lowest hydraulic working pressure
```

A drawbar force gauge, a dummy tool holder with a load cell, reads the clamping force in the spindle. The shop records it at each service: a slow fall shows discs losing height or cracking, long before a tool is pulled from the spindle.

## Reading the clamping force over time

The force gauge reading is the drawbar stack's health record. A new stack in the VM-8 read 10.3 kN at its first measurement, a little above the calculated 10.1 kN because the discs' actual cone heights sat near the top of their tolerance. This is an illustration. The shop's limits are set from the design: a reading below 9.5 kN means the stack is investigated at the next planned stop, and a reading below 9.0 kN means the machine does not run until the stack has been opened.

A falling reading has a few causes, and the stack itself shows which. Discs that have lost cone height through relaxation give a uniformly shorter free stack. A cracked disc lets its group deflect further than the others, which shows as one group nearly flat when the stack is opened. Wear at the drawbar's gripper or the tool holder's retention knob reduces the force reaching the holder without any change in the stack. Measuring the free stack height and checking each group when the stack is out separates the three.

A rising reading is rarer and also worth investigating: it usually means something is binding, such as a disc caught on the guide rod, and a binding stack may not release a tool cleanly.

## Exercise: a stack of single discs

A fitter asks why the stack uses groups of three discs. If the drawbar used single discs in series, how many would be needed for 10 kN, and could they deliver it?

### Worked answer

A single disc gives at most 5,036 N, its force at flat, and 3,871 N at the 75% limit. No number of single discs in series can give 10 kN, because discs in series all carry the same force: the stack's force is one disc's force. To reach 10 kN within the working range, each group must have at least three discs in parallel, since two would give only 2 × 3,871 = 7,742 N at 75% of h0.

The stack design tool shows the same. Entered with a force of 10,000 N and its 64.3% limit, it chooses 3 discs per group because 10,000 ÷ 3,363 = 2.97, rounded up. The series groups then set the travel, and the parallel discs in each group set the force.
