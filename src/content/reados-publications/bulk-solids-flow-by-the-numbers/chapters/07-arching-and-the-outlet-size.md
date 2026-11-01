---
book: bulk-solids-flow-by-the-numbers
chapterSlug: arching-and-the-outlet-size
order: 7
title: "Arching and the smallest outlet that will not block"
description: "Why cohesive powders arch over an outlet, Jenike's comparison of the stress in an arch with the powder's strength, and how the flow function, flow factor and time consolidation set the outlet size."
draft: false
---

A cohesive powder can stop flowing even in a mass-flow hopper. The particles over the outlet lock together into a dome that spans the opening and carries the material above it, and nothing comes out. Breaking the arch with a mallet, an air lance or a vibrator gets flow going again until the next one forms. The cure is an outlet wide enough that no arch strong enough to stand can form across it, and the method for finding that width is one of the most useful results in bulk solids engineering.

This chapter sets out Jenike's arching method in plain terms, applies it to the filler in Plant C's bin B2, and shows why the design must use the powder's strength after it has sat still, not only its strength when it is flowing. That second point is where the first redesign of B2 went wrong.

## Why arches form

Think of an arch spanning an outlet of width B in a hopper. The arch must carry its own weight. The stress in its abutments, where it presses against the hopper walls, is roughly proportional to the bulk density, gravity and the span: wider arches carry more weight per unit of abutment. Jenike wrote this as

σ₁′ = ρ_b g B ÷ H(θ)

where σ₁′ is the major principal stress in the arch and H(θ) is a factor, read from Jenike's charts, that accounts for the arch's shape and the hopper geometry. H is a little over 2 for a conical hopper and a little over 1 for a wedge-shaped hopper with a slot outlet, both varying slowly with the hopper angle.

The arch is stable if the powder is strong enough to carry σ₁′ on its free lower surface: if its unconfined yield strength σ_c, from Chapter 4, is at least σ₁′. It collapses if σ_c is less. A free-flowing material with no unconfined strength cannot form a stable arch at all, apart from the mechanical interlocking arches that coarse particles form across an outlet only a few particle diameters wide.

The second half of the argument is that σ_c is not fixed. It depends on how hard the powder near the outlet was consolidated while it flowed, σ₁, through the flow function. And in a mass-flow hopper σ₁ near the outlet is itself proportional to the outlet size, because the hopper stresses scale with distance from the apex, as Chapter 5 noted. Jenike expressed the ratio between the consolidating stress in the flowing powder and the stress available to break an arch as the **flow factor**, ff, which depends on the hopper angle, φ_w and δ and is read from his charts. In the hopper, the stress acting on a potential arch is σ₁ ÷ ff.

## The critical point

The method compares two lines on a plot of strength against consolidating stress.

- The **flow function** of the powder, σ_c against σ₁, from the shear test.
- The **flow factor line**, σ₁ ÷ ff, the stress available in the hopper to break an arch formed from powder consolidated at σ₁.

Where the flow function lies above the flow factor line, the powder is stronger than the stress trying to break it, and arches can stand. Where it lies below, they cannot. The two lines cross at the critical point, (σ₁*, σ_c*), and the smallest outlet that will not arch is

B_min = H(θ) × σ_c* ÷ (ρ_b g)

using the bulk density at the critical consolidation stress.

```figure
type: formula
title: Jenike's critical outlet size
formula: Critical point: σ_c = σ₁ ÷ ff on the flow function     B_min = H(θ) × σ_c* ÷ (ρ_b g)
caption: For a cone, B_min is the outlet diameter; for a wedge, it is the slot width, and the slot should be at least about three times as long as it is wide. H(θ) and ff come from Jenike's charts or a testing laboratory's report for the hopper geometry and material.
- σ_c | unconfined yield strength of the powder, from the flow function
- σ₁ | major consolidation stress
- ff | flow factor for the hopper, from φ_w, δ and the hopper half-angle
- H(θ) | geometry factor: a little over 2 for cones, a little over 1 for wedges
- ρ_b | bulk density at the critical consolidation stress
step: B2 cone, instantaneous: σ₁* = 1.195 kPa, σ_c* = 0.885 kPa; B_min = 2.2 × 885 ÷ (820 × 9.807) = 0.242 m
step: B2 wedge, instantaneous: σ₁* = 1.129 kPa, σ_c* = 0.869 kPa; B_min = 1.1 × 869 ÷ (820 × 9.807) = 0.119 m
```

The wedge's critical outlet is about half the cone's, because a slot arch spans only one way and H is about half as large. That is the main reason slot outlets are used for cohesive powders: a slot outlet 120 mm wide does the work of a round outlet 240 mm across, and it can be fed by a screw or belt feeder along its length.

## B2's flow function and flow factors

Chapter 4 gave the filler's flow function: σ_c = 0.80, 1.10, 1.65 and 2.60 kPa at σ₁ = 1, 2, 4 and 8 kPa, fitted well by σ_c ≈ 0.580 + 0.255 σ₁ (kPa). The laboratory's report gave, for 2B stainless steel and the hopper half-angles chosen with a 2° margin inside the mass-flow limits, these values. This is an illustration.

- **Cone at 10° from vertical:** ff = 1.35, H = 2.2.
- **Wedge at 22° from vertical:** ff = 1.30, H = 1.1.
- **Bulk density** at the critical stress: about 820 kg/m³.

Setting 0.580 + 0.255 σ₁ = σ₁ ÷ 1.35 and solving gives σ₁* = 0.580 ÷ (1 ÷ 1.35 − 0.255) = **1.195 kPa** and σ_c* = **0.885 kPa** for the cone, and B_min = **0.242 m**. For the wedge, the same steps give σ₁* = 1.129 kPa, σ_c* = 0.869 kPa and B_min = **0.119 m**.

```figure
type: line
title: B2's flow function and the cone's flow factor line
x: Major consolidation stress σ₁, kPa
y: Stress, kPa
ymin: 0
ymax: 3.2
legend: Flow function σ_c, instantaneous | Flow factor line σ₁ ÷ 1.35
caption: This is an illustration. Below the crossing at σ₁ = 1.20 kPa the powder is stronger than the stress available to break an arch; above it, arches cannot stand. The crossing sets the critical outlet. The flow function is extrapolated slightly below the lowest test point at 1 kPa.
- 0 | 0.58 | 0
- 0.5 | 0.71 | 0.37
- 1 | 0.84 | 0.74
- 1.5 | 0.96 | 1.11
- 2 | 1.09 | 1.48
- 3 | 1.35 | 2.22
- 4 | 1.60 | 2.96
```

The crossing lies just above the lowest test point. That is typical, and it is why the test plan in Chapter 4 included a consolidation stress as low as 1 kPa: a flow function measured only at 5 to 20 kPa would have had to be extrapolated a long way to find the critical point, and extrapolating a curved flow function as a straight line usually gets the intercept wrong.

## Why B2's 150 mm outlet blocks

B2's present outlet is 150 mm. Even if B2 were in mass flow, an arch across 150 mm in a cone would carry a stress of only ρ_b g B ÷ H = 820 × 9.807 × 0.15 ÷ 2.2 = **548 Pa**, about 0.55 kPa. The filler's flow function never falls that low: even unconsolidated, its strength intercept is 0.58 kPa, and after consolidation it is more. Arches across the outlet are therefore stable whatever the hopper does, and the operators' mallet was supplying the stress the arch could not.

## The error: designing on the flowing strength only

This is an illustration. The first redesign of B2 used a wedge hopper at 22° from vertical with a slot 150 mm wide and 600 mm long, a margin of 1.26 on the instantaneous critical width of 0.119 m. The engineer's checklist then raised a question the design had not answered: how long does the filler sit still in B2?

The answer was: overnight on most days, and from Friday evening to Monday morning every week. Chapter 4's time consolidation test showed the filler's strength rising by about 30% after 24 hours at rest under load. A powder at rest in a bin is not being sheared, so it does not get the benefit of flowing; it sits in its consolidated state and gains strength.

Repeating the calculation with the time flow function, taken as 1.3 times the instantaneous one, moves the critical point up and the critical width out.

```figure
type: compare
title: B2's critical outlet sizes, instantaneous and after 24 hours at rest
rowhead: Hopper
cols: Critical σ₁ | Critical σ_c | B_min | First redesign outlet
caption: This is an illustration. Time flow function taken as 1.3 × the instantaneous fit, from the 24-hour test. The 150 mm slot is adequate for continuous running but would arch after an overnight stop.
- Cone, instantaneous | 1.20 kPa | 0.885 kPa | 0.242 m | not used
- Cone, 24 hours at rest | 1.85 kPa | 1.37 kPa | 0.374 m | not used
- Wedge, instantaneous | 1.13 kPa | 0.869 kPa | 0.119 m | 150 mm slot, margin 1.26
- * Wedge, 24 hours at rest | 1.73 kPa | 1.33 kPa | 0.181 m | 150 mm slot fails
```

The 150 mm slot would have run well all week and blocked every Monday. The final design uses a slot **200 mm wide** and 800 mm long, a margin of 1.10 on the 24-hour critical width of 0.181 m and 1.68 on the instantaneous value. The plant also asked the laboratory for a 72-hour time test, to cover long weekends; until it arrives, the standing instruction is to run B2 down to its hopper before any shutdown longer than a weekend.

The wedge at 22° from vertical, running from B2's 1.6 m diameter down to a 200 mm slot, needs (0.8 − 0.1) ÷ tan 22° = **1.73 m** of height for its sloping walls, against the 3.06 m a mass-flow cone would have needed. It fits under the bag station.

## Checking an outlet backwards

The same relation can be run in reverse to judge an existing outlet. Rearranged, it gives the largest unconfined strength an outlet can break: σ_c,max = ρ_b g B ÷ H. If the material's strength at the critical point is above that figure, arches can stand.

For B2's new 200 mm slot, σ_c,max = 820 × 9.807 × 0.20 ÷ 1.1 = **1,462 Pa**, or 1.46 kPa. The filler's critical strength is 0.869 kPa when flowing and 1.33 kPa after 24 hours at rest, both below 1.46 kPa, so the slot should not arch. For the old 150 mm round outlet, σ_c,max is the 0.55 kPa found above, below even the unconsolidated strength.

This backwards check is useful when a new material is proposed for an existing bin. If the supplier or a laboratory can give a flow function, a few lines of arithmetic show whether the bin's outlet will cope, before the first delivery arrives. It also shows how much margin the bin has: a material change that raises the critical strength by 10% uses up all of B2's margin after a 24-hour rest.

## Interlocking arches of coarse particles

Free-flowing materials have no unconfined strength, so Jenike's method gives no critical outlet for them. They can still block an outlet that is only a few particles wide, by forming a mechanical arch of interlocking particles. For coarse granular materials a common rule of thumb is an outlet at least six to ten times the largest particle size, larger for elongated or angular particles. S1's pellets are about 3.5 mm long, so the rule asks for 21 to 35 mm; its 200 mm outlet is far beyond that. The rule matters more for regrind flakes, chopped fibre and wood chips, whose long particles knit together, and the regrind feeder at Plant C has a 250 mm outlet for that reason.

## What the margin has to cover

A critical outlet calculated from one test of one sample is not a guarantee. Bulk solids vary between batches, suppliers and seasons; moisture changes strength; the flow function is fitted through scattered points; and ff and H are read from charts. The margin between the chosen outlet and the critical one has to cover all of that. Testing laboratories recommend margins for their reports, and the margin should be larger where the material is variable or the consequence of a blockage is severe.

Plant C's design check for the new B2 hopper is set out below.

```figure
type: checklist
title: B2 outlet design checks
caption: This is an illustration. The open item is the one the plant is waiting on; the standing instruction to empty B2 before long stops covers it until the result arrives.
- x Flow function measured down to 1 kPa | critical point at 1.13 to 1.85 kPa
- x Wall friction on the actual 2B sheet | 26° at low stress, Chapter 4
- x Hopper half-angle inside the mass-flow limit | wedge at 22° against 24°
- x Slot width above the 24-hour critical width | 200 mm against 181 mm
- x Slot length at least three widths | 800 mm
- x Feeder draws along the whole slot | stepped-pitch screw
- ? Strength after the longest stop | 72-hour time test requested
```

## Feeding a slot outlet

A slot outlet only gives mass flow if the feeder under it draws material evenly along the whole slot. A screw feeder with a constant pitch and constant diameter fills its flights at the back end of the slot and carries that material past the rest, which then has no room to enter: the hopper discharges only from the back, in funnel flow, however steep its walls. The usual cure is a screw whose pitch or flight diameter increases along the slot so that each turn has room for more material, or a belt feeder with a tapered skirt opening. B2's new screw has a pitch that increases in steps along the slot. Its design belongs to the feeder supplier, working from the hopper drawing and the material's test report.

## How this applies to a small Australian business

If a bin needs a mallet, a vibrator or an operator with a rod to keep it going, the outlet is probably below the critical size for the material in the condition it sits in. A flow function test with a time test costs far less than the lost production, and the arithmetic in this chapter turns it into a size. When you redesign, use the strength after the longest rest the bin will see, and choose a slot over a round outlet where the material is cohesive and headroom is short.

## Exercise: a denser filler grade

A new filler grade has a flow function σ_c ≈ 0.70 + 0.28 σ₁ (kPa) and a bulk density of 900 kg/m³ at the critical stress. Using the wedge values ff = 1.30 and H = 1.1, find the instantaneous critical slot width. Is B2's 200 mm slot still adequate if the 24-hour strength is again 1.3 times the instantaneous?

**Worked answer.** Instantaneous: σ₁* = 0.70 ÷ (1 ÷ 1.30 − 0.28) = 0.70 ÷ 0.4892 = **1.431 kPa**, σ_c* = 1.431 ÷ 1.30 = **1.101 kPa**, and B_min = 1.1 × 1,101 ÷ (900 × 9.807) = **0.137 m**. After 24 hours: σ₁* = 0.91 ÷ (0.7692 − 0.364) = 0.91 ÷ 0.4052 = 2.246 kPa, σ_c* = 1.727 kPa, and B_min = 1.1 × 1,727 ÷ 8,826 = **0.215 m**. The 200 mm slot is **not** adequate after an overnight stop with this grade; a 250 mm slot, or emptying B2 before stops, would be needed.
