---
book: distribution-transformers-by-the-numbers
chapterSlug: harmonics-hum-and-magnetostriction
order: 9
title: "Harmonics, hum and magnetostriction"
description: "Why transformers hum at 100 Hz, how noise is specified and tested, how drive harmonics add winding loss and distort voltage, and how impedance trades fault level for distortion."
draft: false
---

Stand beside an energised transformer and you hear a steady hum, pitched a little below the lowest note of a guitar. It is the core changing shape a hundred times a second. Most of the time nobody minds, but a transformer near a boundary, an office or a house can become the subject of complaints, and an amorphous-core transformer, for reasons that go back to its atoms, is noisier than a conventional one. Meanwhile, inside the windings, the distorted currents drawn by variable-speed drives and other electronic loads are adding losses that the nameplate does not show.

This chapter explains magnetostriction and why it makes a transformer hum at 100 Hz, how transformer noise is specified and measured, and how the replacement's noise was checked with the BIZOMAT noise tools. It then turns to harmonics: why they add disproportionately to winding losses, how much they add for the plant's drives, and how the replacement's higher impedance, chosen in Chapter 5 to protect the switchboard, increases the voltage distortion they cause. It ends with a noise test that was declared a failure because it was done at the wrong time of day.

## Magnetostriction

When a ferromagnetic material is magnetised, it changes shape slightly. The domains of Chapter 1 are each a little elongated or shortened along their direction of magnetisation, and as the field rotates and aligns them, the whole piece of steel lengthens or shortens by a few parts per million or less. The effect is called magnetostriction.

It does not depend on which way the steel is magnetised, only on how strongly. So in each cycle of the 50 Hz supply, as the flux rises to its positive peak, falls through zero, rises to its negative peak and returns, the core stretches and relaxes twice. The fundamental of the hum is therefore 100 Hz, and because the change of length is not exactly proportional to the flux, there are harmonics at 200, 300 and 400 Hz too. The core's vibration is passed through the oil to the tank walls and radiators, which radiate it as sound.

Several things set how loud it is.

1. **Flux density.** Magnetostriction rises steeply with flux density, so a core worked at a lower flux density is quieter, at the cost of more steel.
2. **The steel.** Grain-oriented silicon steel has low magnetostriction along its rolling direction; flux that turns across the grain at the core's corners increases it. Iron-based amorphous metals have several times the magnetostriction of grain-oriented steel, so amorphous-core transformers are generally noisier for the same rating.
3. **The core's construction and clamping.** Step-lap joints and well-designed clamping reduce noise; loose clamping lets laminations rattle.
4. **The tank.** If a tank panel's natural frequency is close to 100 Hz or one of its harmonics, it resonates and amplifies the hum.

## How noise is specified and measured

Transformer noise is specified as a sound pressure or sound power level, A-weighted, measured at a stated distance around the transformer with it energised at rated voltage and no load; IEC 60076-10 covers the method. A-weighting reduces low frequencies to approximate the ear's sensitivity, reducing 100 Hz by about 19 dB, so the hum's A-weighted level understates its physical intensity. Because the hum is a pure tone, it can be more annoying than its A-weighted level suggests, and environmental noise rules, such as those administered by the Environment Protection Authority in Tasmania, may add a penalty for tonal noise at a neighbour's boundary. The Library's [Machine Noise Control by the Numbers](/reados/publications/machine-noise-control-by-the-numbers/) explains weighting and how noise adds and spreads.

The plant specified that the replacement's average sound pressure level must not exceed 62 dBA at 1 m from its surface at rated voltage. The houses nearest the substation room are about 40 m away.

The [machinery noise tool](/tools/sound-level/) works out a machine's own level from total and background readings, combines up to four sources and works out the change in level with distance from a point source in a free field. With the transformer at 61.2 dBA at 1 m, the free-field level at 40 m is 61.2 − 20 log₁₀(40) = 29.2 dBA. A transformer is not a point source at 1 m and the substation room's walls block much of its sound, so the real level outside the houses will be lower still; the calculation shows only that, even in the open, the hum would be quiet at the boundary. Inside the room, the transformer and the extraction fan, measured at 58 dBA at the same point, combine to 62.9 dBA, 1.7 dB above the transformer alone.

## When the hum changes

A transformer's hum is steady for years, so a change in it is a symptom worth following up. Three causes are common.

**Over-voltage.** A supply that has risen, or a tap set for a lower supply, raises the flux density, and the hum grows louder and harsher as the core approaches saturation and the higher harmonics of magnetostriction strengthen. On the −2.5% tap of Chapter 2's error, with the 11.3 kV supply, TX-1's flux density rose to about 1.74 T, enough to make its hum noticeably louder.

**Loosened clamping.** Over decades the paper and pressboard in the windings dry and shrink and the core's clamping can relax, letting laminations and windings vibrate more freely. The noise rises gradually, often with a buzzing or rattling quality, and the same looseness reduces the windings' ability to withstand a short circuit (Chapter 5). A rising trend in noise readings taken at the same points each year is a reason to have the clamping inspected at the next outage.

**Direct current in the windings.** A transformer is designed for alternating current only. If a small direct current flows through a winding, for example from a faulty rectifier load with an unbalanced output, or on long transmission networks from geomagnetic disturbances, it shifts the core's flux so that it saturates on one half of each cycle. The hum becomes louder and takes on a characteristic rough tone, the magnetising current becomes large and lopsided, and the core and structure heat. In a factory transformer this is rare, but a hum that changed when a new piece of power electronics was commissioned is worth investigating.

The plant now records the noise at four marked points around the transformer once a year, under the same conditions, alongside the oil test results and the thermal images, so that a change can be seen against its own history.

## When it goes wrong: the noise test at midday

The replacement, option C, was installed and its noise checked on site as part of acceptance. The first test was done at midday, with the plant in full production next door. The meter read 64.0 dBA at 1 m with the transformer energised and unloaded, and a technician recorded it as a failure against the 62 dBA limit, and the transformer's supplier was told so.

The reading included everything else that was making noise: compressors, fans, forklifts and the plant's own LV switchboard. The [machine noise acceptance test tool](/tools/machine-noise-acceptance/) works out a machine's own level from the reading with it running and the background reading with it stopped, checks that the difference between them is large enough for a valid test, corrects to the specification distance and compares with the limit. With the background, taken with the transformer de-energised, at 62.5 dBA, the difference was only 1.5 dB, far below the 3 dB the plant's procedure requires for a valid result. The tool reports the test as not valid: the transformer's own level cannot be separated reliably from a background that loud.

```figure
type: compare
title: Two noise tests of the replacement transformer at 1 m
cols: Reading, transformer on | Background, transformer off | Difference | Transformer's own level | Result
rowhead: Test
- Midday, plant in production | 64.0 dBA | 62.5 dBA | 1.5 dB | 58.7 dBA, unreliable | Not valid
- * 2 am, plant shut down | 61.6 dBA | 51.0 dBA | 10.6 dB | 61.2 dBA | Meets the 62 dBA limit
caption: This is an illustration. Results from the machine noise acceptance test tool with a 3 dB minimum difference between readings. Both tests used the same calibrated meter, checked before and after with an acoustic calibrator.
```

The test was repeated at 2 am during a maintenance shutdown, when the background was 51.0 dBA. The reading with the transformer energised was 61.6 dBA, a difference of 10.6 dB, and the transformer's own level came out at 61.2 dBA, within the limit. The supplier received an apology. The plant's acceptance procedure now states the background condition for every noise test, and requires the background reading as well as the reading with the machine running.

## Harmonics

Variable-speed drives, rectifiers, switch-mode power supplies and many other electronic loads draw current in pulses rather than smoothly, and the pulsed current can be described as the 50 Hz fundamental plus harmonics at whole multiples of it. A six-pulse drive's input current is rich in the 5th, 7th, 11th and 13th harmonics. The Library's [Variable-Speed Drives by the Numbers](/reados/publications/variable-speed-drives-by-the-numbers/) explains why.

The plant's logging in Chapter 4 measured the harmonic content of TX-1's load current at the afternoon peak: as an illustration, the 5th at 10%, the 7th at 6%, the 11th at 3% and the 13th at 2% of the fundamental. The total harmonic distortion of the current is the square root of the sum of their squares, √(10² + 6² + 3² + 2²) = 12.2%.

### Extra winding losses

The harmonic currents add to the resistive loss in proportion to their squares, which for a distortion of 12% is small: the total rms current is only 0.7% higher than the fundamental alone. The eddy losses in the windings are a different matter. Chapter 4 noted that they rise with the square of frequency, so a 5th harmonic current of 10% produces 5² × 0.1² = 25% of the eddy loss that the full fundamental current would, and the 13th harmonic at 2% produces 13² × 0.02² = 6.8%. Summed over the spectrum, the winding eddy loss at the same rms current is multiplied by a harmonic loss factor.

```figure
type: formula
title: Harmonic loss factor for winding eddy losses
formula: F_HL = Σ (I_h ÷ I₁)² × h² ÷ Σ (I_h ÷ I₁)²
formula: P_eddy, with harmonics = F_HL × P_eddy, sinusoidal at the same rms current
caption: I_h is the current at harmonic h and I₁ the fundamental; the sums run over all harmonics including h = 1. For the plant's spectrum, F_HL = (1 + 0.25 + 0.1764 + 0.1089 + 0.0676) ÷ (1 + 0.01 + 0.0036 + 0.0009 + 0.0004) = 1.579.
- h | harmonic number
- F_HL | 1.579 for the plant
```

For option C at the 1,520 kVA peak, with its 19.0 kW rated load loss assumed to split into 17.2 kW resistive, 1.0 kW winding eddy and 0.8 kW other stray losses, the load loss at 76% of rating is 10.97 kW with a sinusoidal current. With the plant's harmonics, the winding eddy part rises by the factor 1.579, adding 334 W, about 3% of the load loss. The other stray losses rise too, though more slowly; leaving them unchanged here slightly understates the effect.

Three per cent extra load loss is modest. But winding eddy losses concentrate at the ends of the windings, where the leakage field bends, which is near the hot spot, so the hot spot rises by more than the average. For loads with much heavier distortion, such as a data centre or a large rectifier, transformers are derated or designed for the harmonic content, sometimes described by a K-factor, and the specification must state the expected spectrum.

### Voltage distortion

Each harmonic current flowing through the transformer's reactance drops a harmonic voltage, and since reactance rises in proportion to frequency, the drop is the harmonic current times the harmonic number times the transformer's reactance. That distorts the voltage at the LV switchboard for every other load in the plant.

```figure
type: compare
title: Voltage distortion at the LV switchboard from the plant's harmonic currents
cols: 5th | 7th | 11th | 13th | Total voltage distortion
rowhead: Transformer at the 1,520 kVA peak
- TX-1, 1,500 kVA, X = 4.88% | 1.85% | 1.56% | 1.22% | 0.96% | 2.9%
- 2,000 kVA, 5% impedance, X = 4.91% | 1.87% | 1.57% | 1.23% | 0.97% | 2.9%
- * 2,000 kVA, 6% impedance, X = 5.92% | 2.25% | 1.89% | 1.49% | 1.17% | 3.5%
caption: This is an illustration. Harmonic voltage = (I_h ÷ I_rated) × h × X%, with I_h from the measured spectrum at the peak load; the network's own impedance, ignored here, adds a little more. TX-1's figures use 1,520 ÷ 1,500 of rated current, the replacements' 1,520 ÷ 2,000.
```

The 6% impedance chosen in Chapter 5 to keep the fault level within the switchboard's rating raises the voltage distortion from 2.9% to 3.5%. That is still modest, but it is a real trade-off: higher impedance protects the switchboard and worsens the voltage, both regulation and distortion. Network operators set limits on the distortion a customer may cause at the connection point, and sensitive equipment has its own tolerances. If the plant adds many more drives, filters or drives with active front ends would reduce the harmonic currents at their source, which is cheaper than living with the distortion.

## Exercise: a quieter specification

A neighbour asks the plant whether the new transformer could be made quieter.

1. At 1 m the transformer measures 61.2 dBA. What would a transformer 6 dB quieter measure at 40 m in a free field?
2. Which design changes reduce magnetostrictive noise, and what do they cost?
3. Why might a silicon-steel transformer be quieter than option C, and what would it cost the plant?

**Answer.**

1. 55.2 − 20 log₁₀(40) = 55.2 − 32.0 = 23.2 dBA, by the [machinery noise tool](/tools/sound-level/)'s distance calculation.
2. A lower flux density, which needs a larger core and raises the price and weight; better steel or step-lap joints; tank stiffening to move panel resonances away from 100 Hz and its harmonics; and anti-vibration mounts, though the tank radiates most of the sound.
3. Grain-oriented silicon steel has much lower magnetostriction than amorphous metal, so for the same rating and care a silicon-steel transformer is usually quieter. Option B would cost A$4,796 more to own over 30 years (Chapter 8). Since the boundary level is already low, the plant could reasonably keep option C and consider an acoustic treatment of the room's louvres if a complaint ever arose.
