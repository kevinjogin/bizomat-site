---
book: diffusion-by-the-numbers
chapterSlug: carburising-the-shaft
order: 4
title: "Carburising the shaft: boost, diffuse and harden"
description: "Design DS-40's carburising cycle with a high-carbon boost and a diffusion stage, compare it with a constant-carbon cycle, mask areas that must stay soft, and see what an over-long boost does to edges."
draft: false
---

Chapter 2 found that holding DS-40's surface at 0.80% carbon would give its 0.8 mm effective case in about 11.7 hours at 925 °C. Heat treaters rarely run a cycle that way. They push carbon in quickly with a richer atmosphere first, the **boost**, then lower the carbon potential and let the excess spread inwards, the **diffuse** stage, ending with the surface carbon they want and the case depth they need in less furnace time. The error-function solution no longer applies directly, because the surface carbon changes partway through, but Fick's second law can be solved step by step on a spreadsheet or computer.

This chapter models DS-40's boost-and-diffuse cycle numerically, compares it with the constant-carbon cycle, explains why the boost carbon cannot simply be raised further, covers masking for areas that must stay soft, and sets out the hardening and tempering that turn a carbon profile into a hard case. The failure case is an over-long boost that left brittle carbides at spline edges.

## Solving Fick's second law step by step

When the surface carbon changes during a cycle, the profile is found by dividing the depth into thin slices and stepping through time. In each small time step, each slice gains or loses carbon in proportion to the difference between the carbon in its neighbours and its own, the discrete form of ∂C/∂t = D ∂²C/∂x². With slices 0.01 mm thick and time steps short enough to keep the calculation stable, a few hundred slices and a few thousand steps reproduce the error-function solution of Chapter 2 almost exactly when the surface is held constant, which is the test that the model is built correctly. Changing the surface value at the end of the boost then gives the boost-and-diffuse profile.

## DS-40's boost-and-diffuse cycle

The heat treater proposes a boost at a carbon potential that holds the surface at **1.10%** for **4 hours**, then a diffuse stage at **0.80%** until the carbon at 0.8 mm reaches the 0.40% that defines the effective case.

```figure
type: compare
title: Constant-carbon and boost-and-diffuse cycles for DS-40 at 925 °C
cols: Surface carbon | Time | Surface carbon at the end | Effective case
caption: This is an illustration from a numerical solution of Fick's second law with D ≈ 8.1 × 10⁻¹² m²/s. Both cycles finish with 0.80% at the surface and 0.40% at 0.8 mm; the boost-and-diffuse cycle takes about 2.8 hours less.
- Constant | 0.80% throughout | about 11.7 hours | 0.80% | 0.8 mm
- *Boost and diffuse | 1.10% for 4 hours, then 0.80% | about 4 + 4.9 = 8.9 hours | 0.80% | 0.8 mm
```

At the end of the 4-hour boost, the carbon near the surface is above 1%, about **1.03%** at 0.05 mm, while at 0.8 mm it has only reached about **0.29%**. The diffuse stage then does two things at once: it carries the excess near the surface inwards, raising the carbon at depth, and, with the surface held at 0.80%, it lets some carbon escape back to the atmosphere, bringing the near-surface carbon down to the target. After about 4.9 hours of diffusion, the profile is:

```figure
type: bars
title: DS-40's carbon profile after the boost-and-diffuse cycle
unit: % carbon
max: 0.9
caption: This is an illustration from the numerical model. The profile falls smoothly from 0.80% at the surface to 0.40% at 0.8 mm, without a hump below the surface, and is very close in shape to the 11.7-hour constant-carbon profile of Chapter 2.
- Surface | 0.80
- 0.1 mm | 0.745
- 0.2 mm | 0.691
- 0.4 mm | 0.585
- 0.6 mm | 0.486
- *0.8 mm | 0.400
- 1.0 mm | 0.330
- 1.2 mm | 0.279
```

The cycle saves about a quarter of the furnace time, about **2.8 hours** a load, and delivers almost the same profile. That saving is why boost-and-diffuse cycles are standard practice. Over a year of loads, a quarter of the furnace time is a quarter of the gas, power and furnace wear, and a quarter more capacity from the same equipment.

## How rich a boost?

If a 1.10% boost saves time, a richer one should save more. The model agrees, up to a point:

```figure
type: compare
title: Effect of boost carbon on DS-40's cycle, 4-hour boost
cols: Diffuse time to 0.40% at 0.8 mm | Total cycle
caption: This is an illustration from the numerical model. Richer boosts shorten the cycle, but the surface carbon during the boost must stay below the level at which carbides form for the steel and temperature, which the steel maker's data and the heat treater's experience set.
- 1.00% boost | about 5.9 hours | about 9.9 hours
- *1.10% boost | about 4.9 hours | about 8.9 hours
- 1.20% boost | about 3.8 hours | about 7.8 hours
```

The limit is metallurgical, not mathematical. Austenite can dissolve only so much carbon at a given temperature, and alloying elements such as chromium lower that limit. Push the surface carbon past it and the excess forms **carbides**, hard, brittle particles that may form continuous networks along grain boundaries, particularly at edges and corners where carbon arrives from two directions. Carbide networks make the case brittle and prone to cracking in grinding or in service. The boost potential is therefore set from the steel's solubility limit at the boost temperature, with a margin, not pushed as high as the furnace allows.

## Controlling the carbon potential

The surface carbon in gas carburising is set by the furnace atmosphere, typically a carrier gas with carbon monoxide, hydrogen and nitrogen, enriched with a hydrocarbon gas. The atmosphere's **carbon potential** is the carbon content that plain iron would reach in equilibrium with it, and it depends on the balance between carbon-bearing and oxidising species in the gas. Modern furnaces measure that balance continuously, commonly with an oxygen probe in the furnace, and adjust the enriching gas to hold the potential at its set point. The heat treater checks the probe's reading periodically against a shim, a thin foil of plain steel carburised through and analysed for its carbon content.

For the diffusion calculation, the carbon potential is the boundary condition: 1.10% during the boost and 0.80% during the diffuse stage for DS-40. Real steels reach a surface carbon a little different from the potential, because alloying elements change carbon's activity, and the surface takes a short time to approach the potential at the start of each stage. The heat treater's coupon data absorb both effects, which is why the model is calibrated against coupons before it is trusted.

## Grinding takes case away

DS-40's bearing diameters are ground after hardening to remove distortion and finish them to size. Every hundredth of a millimetre ground off the surface comes off the case. If the grinding allowance is **0.15 mm** per side, an as-carburised effective case of 0.8 mm becomes about **0.65 mm** after grinding, below the 0.7 mm minimum. The drawing must therefore state whether the case depth applies before or after grinding, and the carburising target must allow for the stock removed. To leave 0.8 mm after removing 0.15 mm, the case must be carburised to about **0.95 mm**, which, because time grows with the square of depth, takes about **(0.95 ÷ 0.8)² ≈ 1.41** times as long: about **12.6 hours** for the boost-and-diffuse cycle instead of 8.9. Grinding allowance is diffusion time, and both are minimised by controlling distortion so that less needs to be ground away.

DS-40's drawing applies the 0.7 to 1.0 mm range to the finished, ground part. Its process holds the grinding stock on the bearing diameters to **0.05 mm** per side, by straightening and careful fixturing in the furnace, so the 0.8 mm as-carburised target leaves about **0.75 mm** after grinding, inside the range with a modest margin. The 0.15 mm example above is what a careless allowance would have cost: either a rejected case or nearly four more hours in the furnace for every load.

## Checking the model against a coupon

The numerical model is a prediction until a coupon confirms it. For the first loads on the new cycle, the heat treater carburised coupons of DS-40's steel alongside the shafts, then analysed thin layers machined from one coupon for carbon at several depths and ran a hardness traverse on another. The measured carbon profile matched the model within a few hundredths of a per cent at every depth, and the hardness traverse put the effective case at about 0.78 mm. The small shortfall was within the coupon-to-coupon scatter and the tolerance; had it been larger, the effective D would have been refitted, as in Chapter 2, and the diffuse time adjusted. A model calibrated this way can then be trusted for variations in the cycle, such as a different boost time, without a full trial for each.

## Masking areas that must stay soft

DS-40's plated end carries a thread that must be machined after heat treatment and must stay tough, so it must not be carburised. Areas like that are **masked** before carburising, commonly with a stop-off paint formulated to block carbon, or with a copper plate that carbon cannot easily penetrate, or by leaving extra stock that is machined off after carburising, taking the case with it. The diffusion calculation sizes the extra stock: to remove the effective case and the high-carbon zone behind it, the machining allowance must exceed the total case depth, which Chapter 2 put at about **1.76 mm** for carbon still noticeably above the core. DS-40's threaded end is left **2.5 mm** oversize on diameter, giving 1.25 mm per side, and is masked with stop-off paint as well, so the allowance removes any carbon that gets past the mask rather than a full case.

## From carbon profile to hard case

A carbon profile is not yet a hard case. After carburising, DS-40 is cooled, reheated to a hardening temperature suited to the carburised case, quenched in oil so that the high-carbon case transforms to hard martensite while the low-carbon core becomes tough, and then tempered at a low temperature to relieve stresses and reduce brittleness. The hardness at each depth then follows mainly the carbon at that depth, which is why a carbon level can stand in for the effective-case hardness limit in this book's teaching model. Each of those steps has its own risks: the reheat can decarburise the surface, which Chapter 5 calculates; the quench distorts; tempering too hot loses hardness. They are part of the same specified process and are verified on the same coupons.

## Low-pressure carburising

Gas carburising at atmospheric pressure is not the only method. In low-pressure, or vacuum, carburising, parts are heated in a vacuum furnace and exposed to short pulses of a hydrocarbon gas such as acetylene, which deposits carbon on the surface, alternating with periods of diffusion under vacuum. It is a boost-and-diffuse cycle in many small steps, designed with exactly the numerical diffusion model described here, and it typically runs hotter than atmospheric carburising to shorten cycles, using steels whose grain size tolerates it. The surfaces stay clean and free of the internal oxidation that atmospheric processes can cause. *Vacuum by the Numbers* covers the vacuum side of such furnaces; the diffusion inside the steel is the same physics as this chapter's.

## A failure case: carbides at the spline edges

This is an illustration. To shorten the cycle for a rush order of shafts like DS-40, a boost was run at a higher potential and for longer than the established recipe, reasoning that the extra carbon would diffuse away during the diffuse stage.

The shafts passed the case-depth check on the plain-diameter coupon. During grinding of the spline flanks, however, fine cracks appeared at several tooth edges, found by magnetic particle inspection, which DS-40's process requires after grinding. Metallographic sections through a cracked tooth showed a network of carbides along grain boundaries at the edge, where carbon had entered from two faces and the local carbon had exceeded the solubility limit during the boost.

The detection came from the crack inspection; the cause from the sections; and the arithmetic of Chapter 1 explained why only edges were affected. The correction was to return to the proven boost potential and time, to add generous chamfers to all tooth ends, and to add a metallographic check of an edge section to the first-article inspection of any new or changed cycle. The plain-diameter coupon, which had passed, could not have revealed an edge problem; coupons test what they sample.

## How this applies to a small Australian business

Expect carburising cycles to use a boost and diffuse sequence, and ask the heat treater for the cycle and the predicted profile. Use a numerical solution of Fick's second law to compare cycles when the surface carbon changes. Keep the boost below the carbide-forming limit for the steel, and chamfer edges and corners. Mask areas that must stay soft, and size any machining allowance from the total case, not the effective case. Remember that hardening and tempering complete the process, and check edges as well as plain surfaces when a cycle changes.

## Exercise: a longer boost

The heat treater tries a **6-hour** boost at 1.10% surface carbon, followed by diffusion at 0.80%. The model shows that only about **1.4 hours** of diffusion are then needed for 0.40% carbon at 0.8 mm. What is the total cycle time, and how much shorter is it than the 8.9-hour cycle? What should the heat treater check before adopting it?

**Worked answer.** The total is **6 + 1.4 ≈ 7.4 hours**, about **1.5 hours** shorter than the 8.9-hour cycle and about 4.3 hours shorter than the constant-carbon cycle. Before adopting it, the heat treater should check that a 6-hour boost at 1.10% does not exceed the carbide limit at edges and corners, that the short diffuse stage leaves the near-surface carbon at the intended 0.80% without a subsurface hump, and that a sectioned edge coupon and a hardness traverse from a trial load confirm both. The model predicts the profile on a flat surface; only a section shows what happened at a tooth tip.
