---
book: random-vibration-by-the-numbers
chapterSlug: fatigue-under-random-loading
order: 8
title: "Fatigue under random loading"
description: "From RMS stress to fatigue life: the S–N line, Miner's rule with three bands and with the Rayleigh distribution, and how the endurance limit assumption swings the predicted life."
draft: false
---

Most vibration failures are fatigue failures. A bracket, a weld, a lead or a solder joint is flexed millions of times at stresses far below its static strength, and a crack starts and grows until the part breaks. Under random vibration the stress cycles come in every size, from tiny ones that do nothing to rare large ones that do most of the harm, and the fatigue calculation must add up the damage from all of them. The tools for doing so are old and simple: an S–N curve giving cycles to failure at each stress, Miner's rule for adding damage, and the peak distribution of Chapter 7 for counting cycles at each level. The difficulty lies in one assumption about the S–N curve that the data rarely settle.

This chapter calculates the fatigue life of the sensor bracket on the screen frame, first in its original form, which cracked in service, and then stiffened. It uses the KEVOS® S–N fatigue tool for cycles to failure, adds damage by the three-band method and by integrating over the Rayleigh distribution, and shows how much the answer depends on what is assumed below the endurance limit.

## From acceleration to stress

The bracket's fatigue-critical point is the weld at its root, where it joins the screen frame's side plate. A finite element model of the bracket, loaded by the sensor's inertia, gives the stress there per g of acceleration of the sensor mass. This is an illustration. For the original bracket the model gave 6.0 MPa per g at the weld toe, so Chapter 4's response of 7.52 g RMS means a stress of 45.1 MPa RMS: 90 MPa at 2σ, 135 MPa at 3σ.

Those stresses look modest beside the steel's yield strength of about 250 MPa, and the original design's strength check, at the 3σ stress, passed comfortably. Fatigue is a different question, because the bracket flexes 120 times a second.

## The S–N line

The [S–N fatigue life tool](/tools/sn-fatigue-life/) estimates cycles to failure for a fully reversed alternating stress from a straight line on log–log axes between the strength at 10³ cycles and a corrected endurance limit at 10⁶ cycles. From the alternating stress, the tensile strength, the corrected endurance limit, the fraction of tensile strength reached at 10³ cycles and a required life, it gives the cycles to failure, the stress allowed for the required life and the line's Basquin constants. Below the endurance limit it reports unlimited life, and it reminds the user to apply a factor for fatigue scatter.

```figure
type: stats
title: The bracket's weld detail in the S–N tool
caption: This is an illustration. Tensile strength 410 MPa; endurance limit corrected for surface, size and the weld detail, 110 MPa; strength at 10³ cycles 0.9 × 410 = 369 MPa.
- 1,237.8 MPa / −0.1752 | Basquin a and b | S = a Nᵇ between 10³ and 10⁶ cycles
- 5.71 | Slope exponent m = −1 ÷ b | cycles to failure fall as stress to the power 5.7
- * 306,000 cycles | Life at the 3σ stress, 135 MPa | under an hour at 120 Hz
- Unlimited | Life at 1σ and 2σ, 45 and 90 MPa | below the endurance limit
```

## Miner's rule and the three bands

Miner's rule adds fatigue damage linearly: each cycle at stress S uses up 1 ÷ N(S) of the life, and failure is predicted when the sum reaches one. With the three-band approximation of Chapter 7, the cycles at each band are counted and divided by the cycles to failure at that band's stress.

```figure
type: steps
title: Three-band damage for the original bracket over its 20,000-hour life
caption: This is an illustration. 120 Hz × 20,000 h × 3,600 s = 8.64 × 10⁹ cycles. Only the 3σ band is above the endurance limit, and it alone consumes the life more than a thousand times over.
- 1σ band, 68.3% of cycles at 45.1 MPa | below the endurance limit: no damage counted
- 2σ band, 27.1% at 90.2 MPa | below the endurance limit: no damage counted
- 3σ band, 4.33% at 135.4 MPa | 3.74 × 10⁸ cycles ÷ 306,000 = 1,220
- * Total damage over 20,000 hours | about 1,220: predicted life about 16 hours
```

The prediction was 16 hours. In the field, the first bracket cracked at the weld toe after about two days of screening, some 20 hours of operation. The original design had been checked for strength at 3σ, never for fatigue.

## Integrating over the Rayleigh distribution

The three-band method is an approximation. The Rayleigh distribution of Chapter 7 gives the share of peaks at every stress, and Miner's rule can be applied to it continuously: integrate, over all stress levels, the number of cycles at each level divided by the cycles to failure there. For the original bracket the integral gives a damage of about 1,200 over the life, a life of about 17 hours: the three-band method and the full integral agree closely here, because almost all the damage comes from stresses well above the endurance limit where both count cycles similarly.

## The redesign and the endurance limit

The bracket was redesigned with a gusset and a thicker plate. Chapter 4 showed that stiffening it to 240 Hz raised the sensor's acceleration to 9.26 g RMS but cut the bracket's deflection by more than two-thirds. The finite element model of the stiffened bracket gave 2.5 MPa per g at the weld toe, so the stress fell to 23.2 MPa RMS, 69.5 MPa at 3σ: below the endurance limit in every band.

By the three-band method and the S–N tool, the stiffened bracket therefore has unlimited life. That answer depends entirely on the endurance limit, and here the data are uncertain. A constant-amplitude endurance limit is measured with every cycle the same size. Under random loading, occasional large cycles above the limit start cracks that smaller cycles below it can then grow, and many fatigue codes for welded steel, including AS 4100's fatigue provisions, use S–N curves that bend to a shallower slope below the constant-amplitude limit instead of stopping. Haibach proposed a common form, continuing the line below the limit with an exponent of 2m − 1.

```figure
type: compare
title: Predicted life of the bracket's weld under three assumptions below the endurance limit
cols: Life with a hard endurance limit | Life with the slope changed to 2m − 1 | Life with the line extended unchanged
rowhead: Bracket
caption: This is an illustration. Miner's rule integrated over the Rayleigh distribution of peaks; 20,000 hours required. The original bracket fails under every assumption; the first redesign passes only if the endurance limit is real; the final design passes under the middle assumption, just.
- Original, 45.1 MPa RMS at 120 Hz | 17 h | 13 h | 10 h
- First redesign, 23.2 MPa RMS at 240 Hz | 68,000 h | 2,000 h | 230 h
- * Final design, 18.5 MPa RMS at 240 Hz | 47 million h | 21,000 h | 840 h
```

The table makes the uncertainty visible. For the first redesign, the predicted life ranges from more than three times the requirement to a hundredth of it, depending on an assumption the S–N data cannot settle. A design whose acceptability depends on that assumption is not robust. The team took the middle course, closest to the welded-steel codes, and reduced the stress further: a larger gusset brought it to 2.0 MPa per g, 18.5 MPa RMS, which meets the 20,000-hour requirement with the slope change, though without much margin. The final decision rested on the measurement and test of Chapter 9.

## What reduces random fatigue damage

Because damage rises with stress to a high power, every lever that lowers the stress pays out heavily. Halving the RMS stress at the weld, with an S–N exponent of 5.7 and all cycles above the endurance limit, would cut the damage by a factor of about 50; with a hard endurance limit, it can remove the damage almost entirely. The levers, roughly in order of effect for a bracket like this one, are:

- **Geometry and stiffness.** A gusset, a deeper section or a shorter arm lowers the stress per unit of deflection and raises the natural frequency, which lowers the deflection itself. It may raise the acceleration of what the bracket carries, as Chapter 7 found for the relay.
- **Moving the resonance.** A natural frequency moved to where the input PSD is lower reduces the response in proportion to the square root of the PSD ratio, by Miles' equation. On CB-7's profile, frequencies above 200 Hz see a falling input.
- **Damping.** Response falls with √Q, so doubling the damping lowers the stress by about 30%. Constrained-layer damping treatments or a damped mount for the sensor can achieve that on a bracket.
- **The weld detail.** A better weld profile, toe grinding or moving the weld away from the highest stress raises the S–N curve itself.
- **Mass.** A lighter sensor or junction box reduces the inertia load directly.

For the sensor bracket, geometry and the weld location did most of the work; a lighter junction box, with the relay moved out as Chapter 7 described, helped a little.

## Measuring the stress

The stress per g came from a finite element model, and the model's weld-toe stress is itself an estimate. A strain gauge placed a short, defined distance from the weld toe, with a second at a greater distance, allows the stress at the toe to be extrapolated in the way fatigue codes for welds describe, and a recording during screening gives the real stress spectrum directly. This is an illustration. Gauges on the final bracket, recorded during an hour of screening, gave an RMS stress at the weld toe of 16.9 MPa against the model's 18.5 MPa, 9% lower, and a rainflow count whose shape followed the Rayleigh distribution to about 3.5σ, as Chapter 7 described. With the measured stress, the middle assumption gave a predicted life of about 54,000 hours, 2.7 times the 20,000-hour requirement. The measurement converted a design that passed "just" on paper into one with a margin that could be defended.

## Mean stress, scatter and factors

Three further corrections apply to any real fatigue check. Mean stress: the sensor's weight puts a small static stress on the weld, and the weld itself has residual stresses near yield; for welded details, codes generally treat the stress range as what matters and fold the residual stress into the S–N data, which is why the bracket's S–N line is a weld detail's line, not the parent steel's. Scatter: fatigue lives of nominally identical parts vary by a factor of several, and an S–N curve is usually drawn at a low failure probability with a further factor on life. Surface and environment: corrosion from quarry water and dust shortens fatigue life and can remove the endurance limit altogether, another reason to prefer the middle assumption above.

None of these changes the method; each changes the numbers. A fatigue estimate for vibration should state its S–N curve's source, its probability level, its assumption below the endurance limit and its factor on life, so that a reader can judge how conservative it is.

## Solder joints and leads

The same method applies inside the enclosure, with different materials and a different measure of severity. A circuit board's solder joints and component leads are strained as the board flexes, so their fatigue is governed by the board's deflection under each component rather than by a stress calculated from acceleration. Solder's fatigue behaviour differs from steel's: it creeps at room temperature, has no endurance limit worth relying on, and its S–N curve is usually taken as a straight line with a fairly steep exponent. Steinberg's text sets out a widely used approach for electronic assemblies that combines an allowable board deflection, the three-band cycle counts and Miner's rule, with exponents for solder and leads drawn from test data; its values are not reproduced here.

For CB-7's main board on its soft mounts, Chapter 6 found a deflection of about 4 µm RMS, most of it slow motion following the enclosure, and a resonant response at 180 Hz of only about 0.11 g RMS. On any reasonable criterion the board's solder joints are far from fatigue limits. On the frame without isolation, at 62.5 µm RMS and 120 to 180 cycles a second, they would not have been, and the transformer moved in Chapter 6 would have been the first part to fail. Isolation is often the cheapest fatigue fix for electronics, because it acts on every joint at once.

## Adding damage from several conditions

Miner's rule adds damage from different conditions as readily as from different cycles. This is an illustration. If the stiffened bracket's screening damage over 20,000 hours is 0.95 under the middle assumption, and towing between quarries, 50 hours a year at a more severe spectrum, adds its own damage, the two are simply summed. A condition that is brief but severe can contribute as much as a long mild one, because damage rises with stress to a high power. For the sensor bracket the towing condition contributed about a tenth of the screening damage, small but not negligible against a total already close to one, and it was one more reason the team wanted test evidence before releasing the final design.

## Exercise: the bracket at 3σ

For the stiffened bracket at 23.2 MPa RMS, use the S–N tool's line, S = 1,237.8 N^(−0.1752) above 110 MPa, to find the cycles to failure at 3σ and 4σ, and the number of peaks at or above each level in 20,000 hours at 240 Hz from the Rayleigh tail. What does the comparison say about the "unlimited life" answer?

**Worked answer.** This is an illustration. At 3σ, 69.5 MPa is below 110 MPa, so the tool reports **unlimited** life for cycles of that size. At 4σ, 92.8 MPa is still below the limit. The limit is reached at 110 ÷ 23.2 = **4.74σ**, and the Rayleigh tail gives exp(−4.74² ÷ 2) = **1.3 × 10⁻⁵** of peaks above it. Over 20,000 hours at 240 Hz, 1.73 × 10¹⁰ cycles, that is about **230,000 peaks above the endurance limit**. Each of those is a cycle the hard endurance limit treats as harmless only so long as it stays below 110 MPa, while some of them are well above it, and all of them can grow a crack that later smaller cycles extend. "Unlimited life" here means "life governed by the rare tail and by the assumption below the limit", which is exactly why the final design reduced the stress further.
