---
book: blending-bulk-solids-by-the-numbers
chapterSlug: blenders-and-scale-up
order: 5
title: "Batch blenders and scale-up"
description: "Tumbling, convective and high-shear blenders, the Froude number that sets a tumbler's flow regime, and why a blend time found in one blender does not carry to a larger one without a test."
draft: false
---

A blender that works at one size often disappoints at the next. A drum that mixes a 50 kg trial batch in five minutes may need half an hour for a tonne, or never get there; a ribbon blender four times larger than the old one may need half as long again at the same speed. The reasons follow from the random-walk model of Chapter 4: the distances a pattern must cross grow with the blender, and the motions that cross them do not grow in proportion.

This chapter surveys the main types of batch blender, explains the Froude number that sets a tumbling blender's flow regime, and works through Plant C's move from a 500 L to a 2,000 L ribbon blender for its premix. Its error is the most common in scale-up: assuming the blend time stays the same.

## Types of batch blender

```figure
type: compare
title: Common batch blenders
rowhead: Type
cols: How it mixes | Suits | Watch for
caption: General guidance. Choice depends on the materials, the blend's sensitivity to shear and segregation, cleaning needs and batch size; makers' trials with the real materials are the usual basis for selection.
- Tumbling: drum, double cone, V, bin blender | diffusion and shear in the moving surface layer as the vessel turns | free-flowing, fragile or abrasive materials; easy cleaning | slow axial mixing; segregation of free-flowing blends with size differences
- Convective: ribbon, paddle, plough share | agitator moves material along and across the trough | most powders, cohesive materials, liquid addition | dead zones at ends and discharge valve; heat and attrition at high speed
- High-shear: intensive mixer with chopper | fast agitator breaks agglomerates and shears the bed | cohesive fines, dispersing small amounts of minor ingredient | heat, particle breakage, power
- Fluidised or air-mixed | air lifts and circulates the bed | fine, free-flowing powders | fine-particle loss to the filter, segregation when the air stops
```

Plant C's premix uses a ribbon blender because the stabiliser and polypropylene powders are fairly free-flowing but differ in size, a combination that tends to segregate in a tumbler's moving layer, and because a ribbon blender can be loaded and discharged from a bag station without lifting the vessel.

## Tumblers and the Froude number

In a tumbling blender, the material is carried up the rising wall and slides, rolls or falls back down the free surface. What it does depends on the ratio of centrifugal to gravitational acceleration at the wall, the **Froude number**:

Fr = ω² R ÷ g

where ω is the rotational speed in radians per second and R the radius. At low Fr the bed slumps in intermittent avalanches, like a slowly tilted heap. As Fr rises it rolls with a steady, flat surface, then cascades with a curved surface, and at higher Fr particles are thrown clear of the bed (cataracting). At Fr = 1 material is held against the wall and turns with the drum without mixing at all. Most tumbling blenders run in the rolling or cascading regime, well below the critical speed.

Scaling a tumbler up at constant Froude number keeps its flow regime the same, so the surface layer behaves similarly. That requires the speed to fall as the drum grows: ω ∝ 1 ÷ √R. The [scale models book's chapter on Froude scaling](/reados/publications/scale-models-by-the-numbers/froude-scaling/) sets out the same rule for free-surface water flows, and the reasoning is identical: gravity drives the flow, so gravity's ratio to the inertial forces must match.

```figure
type: compare
title: A drum blender scaled at constant Froude number
rowhead: Drum
cols: Diameter | Speed | Froude number | Critical speed, Fr = 1
caption: Constant Froude number keeps the flow regime of the moving layer the same at both sizes. It does not keep the blend time the same: the larger drum's material must travel twice as far along its axis.
- Trial drum | 0.6 m | 30 rpm | 0.302 | 54.6 rpm
- Production drum, same regime | 1.2 m | 21.2 rpm | 0.302 | 38.6 rpm
```

Matching the regime does not match the blend time. Mixing along a drum's axis is slow, mainly diffusive, and the distance it must cover grows with the drum's length; by Chapter 4's result the time grows roughly with the square of that distance unless the dispersion improves. Long drums are often fitted with internal baffles or flights that move material axially for that reason.

## Convective blenders

In a ribbon blender, an outer helical ribbon pushes material towards one end along the trough wall and an inner ribbon pushes it back along the centre, so the bed circulates end to end while the ribbons also lift and turn it. The two quantities that set how vigorously it does so are the ribbon's tip speed, π D N, and, again, a Froude number, here ω² R ÷ g at the ribbon's outer radius, which says whether material is lifted and thrown or merely pushed.

Plant C's 500 L blender has a ribbon 0.70 m in diameter turning at 40 rpm: a tip speed of **1.47 m/s** and a Froude number of 0.63. This is an illustration.

Scale-up rules for convective blenders are less settled than for tumblers. Constant tip speed, constant Froude number and constant power per unit mass are all used, and they give different speeds for the larger blender. More important, none of them guarantees the same blend time, because the dispersion along the trough, D in Chapter 4, depends on both the agitator motion and the distance to be covered.

## Two models for the larger blender

The plant decided to replace its 500 L blender with a 2,000 L blender of the same design, so that premix could be made in 800 kg batches, four times fewer. The new blender is geometrically similar, so every length is 4^(1/3) = **1.587** times larger: the ribbon is 1.11 m in diameter and the trough 2.38 m long.

Chapter 4's model says the mixing rate is k = π² D ÷ L². With L 1.587 times longer, the effect on k depends on how D changes, and two simple assumptions bracket the likely answer.

1. **D unchanged.** If the dispersion coefficient stays at 0.0025 m²/s, k falls by 1.587² = 2.52, from 0.662 to **0.263 per minute**.
2. **D grows with tip speed times length.** A common picture of convective dispersion is that each circulation moves material a distance proportional to the blender's size at a speed proportional to the tip speed. At the same tip speed, D grows with L, and k falls only by 1.587, to **0.417 per minute**.

Starting from the same initial excess variance as the small blender, 38.1 square percentage points from Chapter 4's fit, the time to reach the plant's criterion of s = 1.5 σ_R, an excess of 0.0884, is ln(38.1 ÷ 0.0884) ÷ k.

```figure
type: bars
title: Predicted premix blend time to s = 1.5 σ_R
unit: min
caption: This is an illustration. From Chapter 4's exponential model with the small blender's fitted starting point. The two scale-up assumptions bracket the answer; only a test in the larger blender can say where it lies.
- 500 L blender, fitted | 9.2 | k = 0.662 per minute
- * 2,000 L, D grows with size at the same tip speed | 14.5 | k = 0.417 per minute
- 2,000 L, D unchanged | 23.1 | k = 0.263 per minute
```

Neither model is a law. They are two reasonable guesses that bracket the answer, and they say clearly that the old 12-minute time will probably not be enough.

## The error: the same blend time in a bigger blender

This is an illustration. The new blender was commissioned at the maker's standard speed for its size, 25 rpm, which gives a tip speed of 1.45 m/s, close to the old blender's 1.47 m/s. The first production batches were blended for 12 minutes, the validated time for the old blender, on the reasoning that the same design at the same tip speed must mix at the same rate.

The first validation batch, with ten 0.5 g samples at 12 minutes, gave a standard deviation of **0.57 percentage points**, a CV of 2.9% and a ratio s ÷ σ_R of 2.15, against the criterion of 1.5. It failed. The result is almost exactly what the second model predicts: with k = 0.417 per minute, the excess variance at 12 minutes is 38.1 × e^(−0.417 × 12) = 0.256, so s = √(0.0707 + 0.256) = 0.571.

```figure
type: compare
title: Premix at 12 minutes in the old and new blenders
rowhead: Blender
cols: s, percentage points | CV | s ÷ σ_R | Against s ≤ 1.5 σ_R
caption: This is an illustration. Same materials, loading pattern and tip speed. The larger blender mixes more slowly because its material has further to travel along the trough.
- 500 L at 40 rpm | 0.29 | 1.45% | 1.09 | pass
- * 2,000 L at 25 rpm | 0.57 | 2.86% | 2.15 | fail
```

The engineer ran a short blend time study in the new blender, at 8, 12, 16 and 20 minutes. The fitted rate was 0.42 per minute and the predicted time to the criterion 14.4 minutes. The validated blend time was set at **18 minutes**, with the same margin philosophy as before. Running the new blender faster to restore the old blend time was considered and rejected: at 40 rpm its Froude number would be about 1.0, enough to throw material against the cover, raise the power draw sharply and break the stabiliser's particles.

The batches are four times larger and take half as long again to blend, so the premix still takes far less operator time per kilogram than before. The error was not in buying the larger blender but in assuming that a validated time is a property of a design rather than of a size.

## Fill level, power and heat

Three practical limits sit alongside the scale-up rules. **Fill level**: a ribbon or paddle blender mixes best when the bed covers the agitator without burying it deeply; overfilled, the top layer rides along unmixed, and underfilled, the agitator throws material rather than moving it. A tumbler needs free space for its moving layer to form, and an overfilled drum mixes very slowly. The maker's recommended working range is the starting point, and a validated blend time applies only within the fill range it was tested at.

**Power**: the power an agitator draws rises steeply with speed and size, so a larger blender run at the old blender's speed may need a much larger motor and gearbox than one run at the same tip speed. **Heat**: that power ends up as heat in the powder. Long blending of a fine powder at high speed can warm it enough to soften low-melting ingredients, change their flow and make them cake. Plant C's stabiliser includes a component that softens at a modest temperature, and the plant checks the premix's temperature at discharge on validation batches.

## Discharge and the heel

The blend is not finished when the agitator stops. It must leave through a discharge valve, and the first material out, from the valve's throat and the dead zone above it, has often been mixed less than the rest. At the end, a heel of material left on the trough floor and the ribbon may be discharged only by running the agitator, which can re-segregate a free-flowing blend. Plant C's procedure runs the ribbon slowly during discharge and adds the first 5 kg back into the next batch rather than bagging it, and validation samples are taken from the discharge stream at the start, middle and end of each batch as well as from inside the blender. Chapter 7 deals with what happens to the blend after it leaves.

## Batch or continuous

Scale-up trouble is one reason some plants move from batch to continuous blending: two or more feeders deliver the components at the right ratio into a short continuous mixer, or straight into the process, as Plant C's extruder feeders do. A continuous blender does not need to cross the whole length of a large vessel. It needs to smooth out the short-term fluctuations of its feeders over the time a product unit takes to pass, which is a much smaller job, and its capacity can be raised by running longer rather than by building larger. The price is that the blend's quality now depends on the feeders' accuracy second by second, not on a batch's final state, and that a feeder fault produces off-specification material immediately. Chapter 8 deals with how feeders and back-mixing combine.

For the premix, batch blending remains the better choice: the stabiliser must be pre-dispersed at 20% so that it can be fed accurately at 15 kg/h, and a 15 kg/h feeder could not meter 3 kg/h of pure stabiliser powder as evenly as it meters the premix.

## What to ask a blender supplier

A supplier's blend time claims usually come from trials in a laboratory or pilot blender with a test material. Before relying on them, ask what material, fill level, speed, loading pattern and blender size the trial used, how uniformity was measured and at what sample mass, and whether results exist at two sizes. A claim of "homogeneous in five minutes" without a sample mass and a criterion cannot be checked. A trial at the supplier's works with your own materials, sampled your way, is worth far more than a brochure.

## How this applies to a small Australian business

When you change the size of a blender, plan for the blend time to change and budget a short study to find the new one. Keep the agitator's tip speed and Froude number within the maker's range, load the minor ingredient so that it starts spread along the blender, and validate the first batches with samples at the right scale before releasing product. A blend time is a property of a blender, a material, a fill and a speed, not of a design. If the two scale-up models in this chapter give very different times for your case, that spread is itself the reason to test rather than calculate.

## Exercise: a bigger drum

The plant's 0.6 m trial drum mixes a pellet blend satisfactorily at 30 rpm in 6 minutes. A 1.2 m production drum, geometrically similar, is to run at the same Froude number. (a) What speed should it run at? (b) If the blend time is set by axial mixing with an unchanged dispersion coefficient, how long will it need?

**Worked answer.** (a) At constant Froude number, ω² R is constant, so the speed falls with the square root of the size ratio: 30 ÷ √2 = **21.2 rpm**. (b) The axial length doubles, so with D unchanged the rate constant falls by 2² = 4 and the blend time rises fourfold, to about **24 minutes**. In practice the larger drum's moving layer may disperse material somewhat faster, so the true figure is likely to lie between 12 and 24 minutes, and a test is needed. Internal flights that move material along the axis would shorten it.
