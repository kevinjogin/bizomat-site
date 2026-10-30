---
book: bulk-solids-flow-by-the-numbers
chapterSlug: discharge-rate-and-the-hourglass-law
order: 9
title: "Discharge rate and the hourglass law"
description: "Why a coarse material's discharge rate depends on outlet size to the power 2.5 and not on the head, the Beverloo correlation and its limits, why fine powders are slower, and chutes below outlets."
draft: false
---

An hourglass runs at a steady rate. That simple fact, noticed long before anyone could explain it, is the key to estimating how fast a bin or silo can discharge. The rate is set by the outlet and the particles, not by how full the container is. Once that is understood, a short correlation gives the gravity discharge rate of most coarse, free-flowing materials to within about ten per cent, and the reasons it fails for fine powders become clear.

This chapter derives the shape of the discharge law from dimensions, applies the Beverloo correlation to Plant C's pellet silo S1, shows why fine powders discharge more slowly than it predicts, and checks the short chutes below the plant's outlets. Its error is the most common one in this area: scaling discharge rate with the outlet's area.

## Why the head does not matter

Chapter 5 showed that the stresses near an outlet are set by the outlet and the hopper, not by the height of material above, because the walls and the surrounding material carry the weight. What happens at the outlet is therefore local. Above the opening there is a region, a little larger than the outlet, where particles lose contact with each other and fall freely. Their speed as they leave depends on how far they have fallen in that region, which scales with the outlet size, D.

That is enough to find the form of the law by dimensional analysis, the method set out in the [chapter on building dimensionless groups](/reados/publications/scale-models-by-the-numbers/building-dimensionless-groups/). If the mass flow rate W depends only on the bulk density ρ_b, gravity g and the outlet size D, the only combination with the units of kg/s is

W ∝ ρ_b √g D^2.5

The exit velocity scales as √(g D) and the outlet area as D², giving D^2.5. The head does not appear, because it does not enter the physics at the outlet. Doubling the outlet diameter multiplies the flow by 2^2.5 = 5.66.

## The Beverloo correlation

In 1961 Beverloo, Leniger and van de Velde fitted that form to measurements on a range of seeds and granular materials and added one correction. Particles cannot use the full outlet: a band about half a particle wide around the edge is lost, because particle centres cannot get closer to the edge than that. The effective outlet size is therefore reduced by a few particle diameters:

W = C ρ_b √g (D − k d)^2.5

where d is the particle size, C is a constant commonly taken as about 0.58 (reported between about 0.55 and 0.65), and k is a constant reported between about 1 and 3, depending on particle shape, with about 1.4 typical of rounded particles.

```figure
type: formula
title: The Beverloo correlation for discharge through a round outlet
formula: W = C ρ_b √g (D − k d)^2.5
caption: For coarse, cohesionless particles discharging by gravity through a circular outlet in a flat or conical bottom, with the level well above the outlet. Fine powders, cohesive materials and outlets only a few particles wide are outside its range.
- W | mass discharge rate, kg/s
- C | about 0.58; reported between about 0.55 and 0.65
- ρ_b | bulk density of the flowing material, kg/m³
- D | outlet diameter, m
- k | about 1.4 for rounded particles; up to about 3 for angular or elongated ones
- d | particle size, m
step: S1, 200 mm outlet, pellets d = 3.5 mm: W = 0.58 × 545 × 3.132 × (0.200 − 0.0049)^2.5 = 16.6 kg/s, about 60 t/h
```

## S1's discharge rate

S1's pellets are about 3.5 mm, with a bulk density of 545 kg/m³. With C = 0.58 and k = 1.4, the correlation gives:

```figure
type: compare
title: Gravity discharge rate of S1's pellets by outlet diameter
rowhead: Outlet diameter
cols: k = 1.4 | k = 2.9 | Rate at k = 1.4
caption: This is an illustration. Beverloo correlation with C = 0.58, ρ_b = 545 kg/m³ and d = 3.5 mm. The uncertainty in k matters little for outlets many particles wide and a lot for small outlets.
- 50 mm | 0.43 kg/s | 0.31 kg/s | 1.5 t/h
- 100 mm | 2.76 kg/s | 2.40 kg/s | 9.9 t/h
- 150 mm | 7.94 kg/s | 7.24 kg/s | 28.6 t/h
- * 200 mm, S1 | 16.6 kg/s | 15.6 kg/s | 59.9 t/h
- 300 mm | 46.8 kg/s | 44.8 kg/s | 168.6 t/h
```

S1 does not discharge freely: its rotary valve meters the pellets into a pneumatic conveying line at about 1.0 t/h, the extrusion line's polypropylene rate. The gravity rate matters because the rotary valve must be fed faster than it can turn, so its pockets fill; at 60 t/h available against 1.0 t/h drawn, there is no question of that. It also sets the rate at which S1 would empty if the valve were removed for maintenance with the gate left open, a reason to lock the gate shut before the valve is unbolted.

The mean velocity of pellets through the outlet at 16.6 kg/s is W ÷ (ρ_b × area) = 16.64 ÷ (545 × 0.03142) = **0.97 m/s**, of the same order as √(g D) = 1.40 m/s, as the dimensional argument expects.

## Fine powders are slower

The correlation fails for fine powders, and in a consistent direction: they discharge more slowly than it predicts, often much more slowly. The reason is air. As material leaves an outlet it dilates slightly, and the gaps between particles grow. Air must flow into those gaps from below, through the outlet, against the falling material. For coarse particles the gaps are wide and the air flows in easily. For fine particles the gaps are narrow and the air resistance is large, so the air pressure in the material just above the outlet falls below atmospheric and holds the material back. The finer the powder, the stronger the effect.

The opposite can happen too. A fine powder that arrives at the outlet already full of air, from a collapsing rathole or a recent fill, flows faster than a settled one and can flood, as Chapter 8 described. Fine-powder discharge rates are therefore unpredictable from a formula and are controlled by a feeder: B2's screw, a rotary valve or a belt feeder, sized from the material's tests and the feeder maker's data. Gravity discharge of a fine powder straight from an open outlet is rarely a good idea.

## The error: scaling the rate by the outlet area

This is an illustration. Plant C occasionally changes S1 over to a different pellet grade. The old grade must be emptied into bulk bags through a 100 mm spout below the slide gate. The planner estimated the time from the silo's rate through its 200 mm outlet, scaled by the outlet area: a 100 mm spout has a quarter of the area, so a quarter of 16.6 kg/s, 4.16 kg/s, and 39.1 t would take **2.6 hours**. A crane and a truck were booked for three hours.

The emptying took nearly four hours. The engineer's review found two reasons, both in the Beverloo correlation. First, flow scales with the 2.5 power of the outlet size, not the square: halving D divides the flow by 5.66, not by 4. Second, the particle-edge correction matters more for a small outlet: 1.4 × 3.5 mm = 4.9 mm is 2.5% of 200 mm but 4.9% of 100 mm. Together they give 2.76 kg/s through the spout, two-thirds of the planner's figure, and **3.9 hours** for the silo.

```figure
type: bars
title: Time to empty S1's 39.1 t through a 100 mm spout
unit: h
caption: This is an illustration. Area scaling assumes the rate falls with D²; the Beverloo correlation gives D^2.5 with a particle-edge correction. The crane and truck were booked on the first figure.
- Scaled by outlet area | 2.6 | 4.16 kg/s
- * Beverloo correlation | 3.9 | 2.76 kg/s
- Beverloo with k = 2.9 | 4.5 | 2.40 kg/s
```

The planner's spreadsheet now uses the Beverloo correlation for pellet discharge through spouts and gates, with k = 2 as a cautious middle value, and changeovers are booked with an hour's margin. The underlying lesson is general: before scaling any rate by a geometric ratio, ask what physics sets it.

## Chutes below an outlet

Material leaving an outlet often runs down a short chute: into a conveying pick-up, a bag spout or a feeder inlet. The chute must be steep enough for material to slide and not so steep or long that it arrives too fast.

The [gravity chute check tool](/tools/gravity-chute-check/) treats a single part sliding on an inclined chute with constant sliding friction. It gives the acceleration along the chute, the least chute angle at which the part slides, the exit speed and time from the entry speed and length, and the impact energy at the bottom, against the largest exit speed accepted. For a stream of free-flowing pellets, which slide on a steel chute much like single parts, it is a reasonable first check, though round pellets can also roll, which the tool does not model.

For S1's 1.2 m chute from the rotary valve to the conveying pick-up, at 45° with the pellets' wall friction coefficient of 0.249, it gives an acceleration of 5.21 m/s², a least sliding angle of 14°, and an exit speed of **3.53 m/s** after 0.68 s, from rest. That is within the 4 m/s the pick-up's maker allows.

For the filler, the tool gives a different kind of answer. With μ = 0.488, a 1.2 m chute at 30° passes its sliding check, 4° steeper than the 26° friction angle, with an exit speed of 1.35 m/s. A cohesive powder does not behave like a sliding block, though. It sticks to the chute in a layer, the layer grows until it is thick and strong enough to stay put, and the chute blocks. The tool's model, constant sliding friction with no adhesion, does not apply. Chutes for cohesive powders are made much steeper than their wall friction angle, often near vertical, with smooth walls and no ledges, or replaced by a feeder or screw. The tool's own note on its model, "constant sliding friction; no rolling", is the clue to where its answer stops being useful.

```figure
type: compare
title: Plant C's chutes in the gravity chute check tool
rowhead: Chute
cols: Angle | μ | Exit speed | Tool verdict | Engineering judgement
caption: This is an illustration. The tool treats a sliding part with constant friction. It suits free-flowing pellets; it does not capture the adhesion that makes cohesive powders build up and block a chute.
- S1 pellets to pick-up, 1.2 m | 45° | 0.249 | 3.53 m/s | chute works | sound, within the pick-up's 4 m/s
- Filler, 1.2 m, proposed | 30° | 0.488 | 1.35 m/s | chute works | * will build up and block; use a feeder
- Filler, 1.2 m, steep | 45° | 0.488 | 2.92 m/s | chute works | still risky; near-vertical preferred
```

## Slots and other outlet shapes

The same dimensional reasoning extends to a slot outlet of width B and length L, provided L is several times B. The exit velocity is still set by a free-fall region whose size scales with the smaller dimension, so it goes as √(g B), and the area is L × B. The discharge rate therefore scales as

W ∝ ρ_b √g L B^1.5

with the particle-edge correction applied to both dimensions in the same way as Beverloo's. Two consequences follow. Doubling a slot's length doubles the flow, because the flow is shared along the slot; doubling its width multiplies the flow by 2^1.5 = 2.83. And a slot of the same area as a round outlet passes more material than the round outlet only if it is wide enough; a long, narrow slot has a small exit velocity. The constant for slots differs from Beverloo's C and should come from measurements or from published work on slot discharge, not from the round-outlet value.

## The rate at the end of discharge

The correlation assumes the level is well above the outlet. As the level falls into the hopper, the stress field near the outlet changes and the rate can change too. Several experimental studies, including some on hourglasses, have reported that the rate rises slightly as the container empties. For engineering purposes the change is small for coarse materials, and the constant-rate assumption holds until the last few per cent of the contents.

## Rotary valves and feeders

Below most bins the discharge rate is set by a feeder, not by gravity, and the gravity rate only has to exceed what the feeder draws. A rotary valve's volumetric throughput is its pocket volume per revolution, times its speed, times a fill fraction that falls as the speed rises and the pockets have less time to fill. S1's valve has a pocket volume of 8 L per revolution and runs at up to 20 rpm. At a fill fraction of 0.7 it can pass 8 × 20 × 60 × 0.7 = **6.72 m³/h**. This is an illustration. The line needs 1,035 kg/h ÷ 545 kg/m³ = **1.90 m³/h**, so the valve runs at less than a third of its capacity, at about 6 rpm, where its pockets fill well. The pellets above it, able to arrive at 60 t/h, keep it full.

Fine powders through rotary valves need more care. A valve that also seals a pneumatic conveying line against pressure leaks air back up through its clearances, and that air rising into the bin outlet can slow or stop the flow of a fine powder, the reverse of flooding. A vent on the valve's inlet side, leading the leakage air away, is the usual cure.

## Measuring the rate

The best check on any discharge calculation is a measurement. With load cells, as on B2, the rate is simply the change of mass divided by the time. Without them, a timed sample caught in a container of known tare, repeated a few times at different levels, gives the rate and shows whether it depends on the level, which for a coarse material it should not. If the measured rate differs from the Beverloo estimate, the measurement can be used to back-calculate C for that material and outlet, which is then reliable for other outlet sizes of the same shape.

## How this applies to a small Australian business

For pellets, grain, plastic regrind, seeds and similar coarse materials, the Beverloo correlation gives a quick and reliable estimate of how fast a bin will empty through any outlet, enough to plan bagging, size a gate or check that a feeder is not starved. Remember that the rate goes with the 2.5 power of the outlet size, and that the level hardly matters. For fine powders, do not rely on gravity discharge at all; put a feeder under the bin and size it from tests.

## Exercise: a larger bagging spout

The plant considers a 150 mm spout for emptying S1. Using the Beverloo correlation with C = 0.58, k = 1.4, ρ_b = 545 kg/m³ and d = 3.5 mm, find the discharge rate and the time to empty 39.1 t. How much time does it save over the 100 mm spout?

**Worked answer.** D − k d = 0.150 − 0.0049 = 0.1451 m, and 0.1451^2.5 = 0.008020. W = 0.58 × 545 × 3.132 × 0.008020 = **7.94 kg/s**, about 28.6 t/h. The time to empty 39,149 kg is 39,149 ÷ 7.94 = 4,931 s, or **1.37 hours**, against 3.94 hours through the 100 mm spout: a saving of about **2.6 hours**. A 50% larger spout cuts the time by almost two-thirds, because the rate rises with the 2.5 power of the diameter.
