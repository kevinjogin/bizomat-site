---
book: eddy-current-inspection-by-the-numbers
chapterSlug: conductivity-and-what-it-reveals
order: 3
title: "Electrical conductivity and what it reveals about a metal"
description: "The %IACS scale, why alloying and heat treatment change conductivity, correcting readings to 20 °C, calibrating a conductivity meter, and catching a mislabelled aluminium bar."
draft: false
---

An aluminium bar labelled 6061-T6 looks exactly like one in the T4 or annealed condition, and machines almost as easily. Only its strength differs, and strength is expensive to measure. Its electrical conductivity, however, also changes with its heat treatment, and an eddy-current meter measures that in two seconds without leaving a mark. That makes conductivity one of the most useful quick checks in an aluminium shop: not a substitute for a hardness or tensile test, but a fast screen that finds the bar that should not be there.

This chapter explains the scale conductivity is measured on, why a metal's structure changes its conductivity, how to correct readings for temperature, and how to calibrate a meter with the WORKOS linear calibration tool. Its mistake is a bar that the check was designed to catch, and did.

## The %IACS scale

Conductivity of non-magnetic metals is usually quoted as a percentage of the International Annealed Copper Standard, %IACS. The standard, adopted in 1913, defines 100 %IACS as the conductivity of a particular annealed copper at 20 °C: 58.0 MS/m, a resistivity of 1.7241 µΩ·cm. Modern high-purity copper exceeds it slightly, at about 101 to 102 %IACS.

```figure
type: formula
title: Converting between %IACS, conductivity and resistivity
formula: σ (MS/m) = 0.580 × %IACS
formula: ρ (µΩ·cm) = 172.41 ÷ %IACS
formula: ρ (Ω·m) = 1 ÷ (σ in S/m)
caption: All at the reference temperature of 20 °C. A meter displays %IACS; Chapter 2's standard depth needs the resistivity in Ω·m.
- σ | electrical conductivity
- ρ | electrical resistivity
```

```figure
type: compare
title: Typical conductivities of 6061 aluminium in three tempers
cols: Resistivity | Conductivity | What the structure holds
rowhead: Temper
- T4, solution treated and naturally aged | 40 %IACS: 4.310 µΩ·cm, 23.2 MS/m | Magnesium and silicon mostly in solid solution
- * T6, solution treated and artificially aged | 43 %IACS: 4.010 µΩ·cm, 24.9 MS/m | Much of the magnesium and silicon in fine strengthening precipitates
- O, annealed | 47 %IACS: 3.668 µΩ·cm, 27.3 MS/m | Magnesium and silicon in coarse particles; little left in solution
caption: This is an illustration. Typical values chosen to show the pattern; real ranges for an alloy and temper come from the specification or the material supplier, and they overlap more than single values suggest.
```

The pump maker's acceptance band for incoming 6061-T6 bar is 42.0 to 45.0 %IACS at 20 °C. It is the maker's own working figure for this illustration, chosen to separate T6 from T4 below it and from O above it.

## Why structure changes conductivity

A metal conducts because its electrons move freely through the regular lattice of atoms. What resists them is anything that breaks the lattice's regularity: the thermal vibration of the atoms, foreign atoms dissolved in it, vacancies and dislocations, grain boundaries and the boundaries of particles. To a good approximation, the resistivities from these sources add, a result known as Matthiessen's rule.

```figure
type: formula
title: Matthiessen's rule
formula: ρ = ρ_lattice(T) + ρ_solutes + ρ_defects
caption: Only the lattice term depends strongly on temperature. The solute and defect terms depend on the alloy's composition and condition, and that is what conductivity testing reads.
- ρ_lattice(T) | resistivity from thermal vibration of the lattice, rising with temperature
- ρ_solutes | from atoms dissolved in the lattice, roughly in proportion to their concentration
- ρ_defects | from vacancies, dislocations and boundaries
```

Atoms dissolved in solid solution are by far the strongest scatterers per atom. When 6061 is solution treated, magnesium and silicon dissolve in the aluminium, the solute term is at its largest, and conductivity is at its lowest, around 40 %IACS in the T4 condition. Artificial ageing to T6 draws much of the magnesium and silicon out of solution into fine precipitates, which scatter electrons far less than the same atoms dissolved, so conductivity rises, to about 43 %IACS. Annealing to the O temper lets them gather into coarse particles and empties the solution further, and conductivity rises again, to about 47 %IACS.

In resistivity terms, the steps from T4 to T6 and from T6 to O are 0.30 and 0.34 µΩ·cm, about 7% and 8.5% of the total. That is small enough to need a good meter and large enough to be measured reliably by one. The same principle lets conductivity reveal overageing or a heat-treatment furnace that ran too hot or too cold, and it is why fire-damaged or locally overheated aluminium parts can be found by a rise in conductivity. A specification for checking wrought aluminium parts this way, SAE AMS 2658, covers hardness and conductivity inspection of wrought aluminium alloy parts; it combines the two because neither alone separates every condition.

### Checking for heat damage

Because overheating draws more of the alloying elements out of solution, conductivity also finds parts that have been heated after their heat treatment. A customer once returned a PH-6 pump from a machine that had been in a workshop fire and asked whether the housing could be reused. This is an illustration. The inspector mapped the housing's conductivity on a 20 mm grid over its faces, corrected each reading to 20 °C, and compared it with an undamaged housing from stock. The undamaged housing read 43.1 to 43.5 %IACS everywhere. The returned housing read the same on the side that had faced away from the fire, but rose to 46.1 %IACS on the corner that had faced it, with a smooth gradient between. The rise meant that corner had been heated enough to overage the alloy and lose strength, though it looked undamaged under its soot. The housing was scrapped, and the map went in the customer's report. A conductivity map is a quick way to find where a part was heated and how far the damage reaches; hardness tests at the highest readings then confirm the loss of strength.

## Correcting for temperature

The lattice term grows with temperature, so a warm part reads a lower conductivity than the same part at 20 °C. By Matthiessen's rule, the change in resistivity per kelvin is roughly the same for an alloy as for the pure metal, because only the lattice term changes. For pure aluminium, with a resistivity of 2.65 µΩ·cm and a temperature coefficient of 0.0043 per kelvin, that change is 2.65 × 0.0043 = 0.0114 µΩ·cm per kelvin. For 6061-T6 at 4.01 µΩ·cm, the same absolute change is a smaller fraction: 0.0114 ÷ 4.01 = 0.00284 per kelvin, or 0.28% per kelvin.

```figure
type: formula
title: Correcting a conductivity reading to 20 °C
formula: σ₂₀ = σ_T × (1 + α (T − 20))
caption: α is the temperature coefficient of resistivity of the alloy being measured, not of copper or pure aluminium. Valid for differences of a few tens of kelvin.
- σ₂₀ | conductivity at 20 °C, %IACS
- σ_T | reading at the part's temperature T, %IACS
- α | 0.00284 per kelvin for 6061-T6 by Matthiessen's rule
```

A bar read at 31 °C in a summer receiving bay at 41.8 %IACS is 41.8 × (1 + 0.00284 × 11) = 43.11 %IACS at 20 °C: comfortably inside the band, though the raw reading was outside it. A bar from an air-conditioned store at 12 °C reading 44.2 %IACS corrects to 44.2 × (1 − 0.00284 × 8) = 43.20 %IACS. Without correction, two bars of almost the same conductivity would read 2.4 %IACS apart.

Many meters compensate automatically, measuring the part's or the probe's temperature and applying a coefficient. The coefficient must suit the alloy: a meter set for a copper-like coefficient of 0.0039 per kelvin over-corrects 6061-T6. The pump maker's procedure requires the part and the reference standards to be at the same temperature, within 2 K, by letting bars stand in the inspection room for an hour, and records the part temperature with every reading.

## Calibrating the meter

A conductivity meter is calibrated against reference standards: blocks of known conductivity, certified by a calibration laboratory. The pump maker's set has five standards spanning 8.80 to 59.10 %IACS. At the annual calibration check, the meter read each standard as follows, and the [linear calibration check tool](/tools/linear-calibration-check/) fitted a straight line to the readings against the certified values.

```figure
type: steps
title: The conductivity meter in the linear calibration check tool
caption: This is an illustration. Standards 8.80, 17.40, 29.90, 43.10 and 59.10 %IACS read 8.95, 17.52, 30.08, 43.31 and 59.36. New reading 43.40 %IACS; 95% confidence; half-width accepted 0.5 %IACS.
- Line | reading = 0.10391 + 1.00253 × reference
- Residual standard deviation | 0.0216 %IACS, 3 degrees of freedom
- Offset and gain | Intercept t = 5.31 and slope t = 4.70 against 3.182: both differ from 0 and 1, so apply the correction
- * Calibrated value for a reading of 43.40 | 43.187 %IACS
- Calibration interval | 43.109 to 43.265 %IACS, ± 0.078: CALIBRATION INTERVAL WITHIN TOLERANCE
```

The meter reads about 0.2 %IACS high near 43 %IACS: a small constant offset and a gain slightly above one. Both are statistically significant, so the tool recommends applying the correction. For an acceptance band 3.0 %IACS wide, an uncorrected bias of 0.2 %IACS would use a fifteenth of the band near each limit; corrected, the remaining uncertainty from the calibration line is ± 0.078 %IACS at 95% confidence. The pump maker applies the correction through the meter's own calibration routine, re-checks the 43.10 standard afterwards, and records both.

## The mistake that was caught: a bar that was not T6

Six weeks after the conductivity check was introduced at goods-in, a 65 mm bar from a delivery labelled 6061-T6 read 47.3 %IACS at 20 °C, well above the band's 45.0 limit. The inspector repeated the reading at three places along the bar, all within 0.1 %IACS, and checked the meter on the 43.10 standard. The reading stood.

Conductivity alone could not say what the bar was. A high reading could mean an annealed bar, an overaged one or a different alloy. The quality engineer cut a slice and made a Brinell test with a 10 mm ball and 500 kgf, the usual load for aluminium alloys.

```figure
type: compare
title: The suspect bar and a good T6 bar in the Brinell hardness test check tool, 10 mm ball, 500 kgf
cols: Mean indentation | Hardness | d/D | Validity | Against 80 to 120 HBW
rowhead: Bar
- * Suspect bar, 47.3 %IACS | 4.38 mm | 32 HBW 10/500 | 0.438 | All checks pass | OUT OF SPECIFICATION
- Good T6 bar, 43.2 %IACS | 2.57 mm | 95 HBW 10/500 | 0.257 | All checks pass | WITHIN SPECIFICATION
caption: This is an illustration. Indentation diameters 4.36 and 4.40 mm, and 2.56 and 2.58 mm. The 80 to 120 HBW range is the pump maker's working check for T6 bar.
```

The [Brinell hardness test check tool](/tools/brinell-test-check/) gave the suspect bar 32 HBW 10/500, with every validity rule satisfied, and a good bar 95 HBW. A hardness of 32 HBW with a conductivity of 47.3 %IACS is the signature of annealed 6061. The supplier's investigation found that a bar from an annealed batch had been tagged with a T6 label at their warehouse. The rest of the delivery was checked bar by bar, two more annealed bars were found, and all three were returned. Housings machined from annealed bar would have looked perfect and failed at the bolt bosses under the pump's pressure.

### Two suppliers compared

With conductivity recorded for every bar, the pump maker could also compare its two bar suppliers. Twelve T6 bars from each gave means of 43.62 and 43.28 %IACS, with standard deviations of 0.21 and 0.24. The [two-sample comparison tool](/tools/two-sample-t/) gave a difference of 0.34 %IACS, a Welch t statistic of 3.69 on 21.6 degrees of freedom and a p-value of 0.0013, with a 95% confidence interval for the difference of 0.149 to 0.531 %IACS. The difference is real, probably a difference in the suppliers' ageing practice, but both suppliers' bars sit well inside the band. The comparison went on file as a baseline: if either supplier's mean moves, the change will show against it. The tool assumes each sample is independent and random. Bars cut from the same heat share its chemistry and heat treatment, so they are not independent; the twelve bars from each supplier were therefore drawn from at least four different heats, and the comparison is repeated each year with new heats.

## What conductivity can and cannot tell apart

A conductivity reading is one number, and many different conditions can give the same number. It separates conditions well when they differ in how much alloying element is in solid solution, as 6061's tempers do. It separates poorly, or not at all, in several common situations.

**Different alloys with overlapping ranges.** Two aluminium alloys of different composition can share a conductivity, so a reading inside the 6061-T6 band does not prove the bar is 6061. Alloy identity comes from the mill certificate and, where it matters, from chemical analysis; conductivity checks condition, not identity.

**Cold work.** Plastic deformation adds dislocations, which raise resistivity slightly, but in aluminium alloys the effect is small beside the effect of solutes. Conductivity is a poor guide to how much a part has been cold worked.

**Surface conditions.** Clad sheet, with a thin layer of purer aluminium on each face, reads the cladding at high frequency and the core at low. Anodising and paint add lift-off, which the meter compensates only up to its stated limit. Heavy machining marks change lift-off from point to point.

**Magnetic metals.** In steel, permeability swamps conductivity, and a conductivity meter calibrated for non-magnetic metals gives meaningless readings. Steels are sorted by other eddy-current methods, as Chapter 7 shows.

For these reasons the pump maker treats conductivity as a screen. A reading inside the band, with the mill certificate, accepts the bar. A reading outside it triggers a second test, normally hardness, and a supplier query only when both disagree with the label.

## Recording conductivity at goods-in

Every bar's reading is recorded with the bar's heat number, its supplier, the part temperature, the corrected reading, the meter's identity and the date of its last standard check. Recording every bar, not only failures, is what made the supplier comparison above possible, and it gives the quality engineer a running picture of each supplier's process. A supplier whose bars begin to drift towards one limit of the band can be asked about it while every bar still passes. The same records let the shop answer a customer's question about a pump's housing years later: which bar it came from, what it read and what the meter read on its standard that day.

## Exercise: a warm reading

A bar is read at 27 °C and shows 42.0 %IACS, at the lower limit of the band. Correct it to 20 °C with the coefficient for 6061-T6, and give the corrected value in MS/m and µΩ·cm. What would the corrected value have been if the meter's automatic compensation had used a coefficient of 0.0039 per kelvin, and does the difference matter here?

### Answer

σ₂₀ = 42.0 × (1 + 0.00284 × 7) = 42.0 × 1.01988 = 42.83 %IACS. In SI units that is 0.580 × 42.83 = 24.84 MS/m, and the resistivity is 172.41 ÷ 42.83 = 4.025 µΩ·cm. The bar is inside the band.

With a coefficient of 0.0039 per kelvin, the correction would be 42.0 × (1 + 0.0039 × 7) = 43.15 %IACS, 0.31 %IACS higher. Here it does not change the decision, because the bar passes either way. But a bar whose true conductivity at 20 °C was 41.9 %IACS, just outside the band, would read about 41.1 at 27 °C and be corrected to 42.2 by the wrong coefficient, a false pass. Over-correction matters most for readings near the limits, which is why the procedure fixes the coefficient for the alloy and asks for parts and standards at the same temperature.
