---
book: insulation-testing-by-the-numbers
chapterSlug: thermal-ageing-and-insulation-life
order: 9
title: "Thermal ageing and insulation life"
description: "Thermal classes, the Arrhenius model and the ten-degree rule, hot spots, equivalent ageing hours for C-1, Weibull life of windings, and a summer of overheating judged with the wrong activation energy."
draft: false
---

Heat is the slowest of the four stresses and the most certain. Every hour a winding runs, the organic materials in its insulation oxidise a little further, lose a little more of their flexibility and bond, and move a little closer to the brittle, cracked state in which vibration, moisture or a surge finishes them off. The rate depends steeply on temperature. A motor that runs ten degrees hotter than it should, because of a blocked filter, a fouled cooler, a high ambient or an overload, can lose half its insulation life, and nothing in the routine DC tests will show it until the damage is done.

This chapter explains thermal classes and the Arrhenius model of thermal ageing, connects it with the familiar rule that life halves for each ten degrees, calculates how much of C-1's life a year of running uses, links the model to a Weibull description of winding life, and finishes with a summer of overheating whose cost was underestimated because the wrong activation energy was used.

## Thermal classes

Insulation systems are assigned thermal classes, designated by a temperature in degrees Celsius and often also by a letter. IEC 60085 sets out the thermal evaluation and designation of electrical insulation, with classes such as 130 (B), 155 (F) and 180 (H). The class number is a temperature index derived from thermal endurance testing: in broad terms, the temperature at which the insulation system is expected to give an acceptable service life. It is not a temperature at which the insulation may be run indefinitely without consequence, and running near it uses life far faster than running below it.

C-1 and C-2 have class 155 (F) insulation. Their makers designed them to run with the winding hottest spot well below 155 °C at full load in a 40 °C ambient, a practice often described as running a class F insulation at a lower class's temperatures, which gives a margin of life. The real temperatures of the winding depend on load, ambient and the condition of the cooling. The site's working figure for C-1's hot spot at its usual load in winter is about 115 °C, and in summer, with a hotter plant room and higher load, about 125 °C.

## The Arrhenius model

Most thermal ageing of organic insulation is a chemical reaction, and the rate of a chemical reaction usually follows the Arrhenius law: it is proportional to exp(−E_a ÷ kT), where E_a is an activation energy, k is Boltzmann's constant and T is the absolute temperature. If the insulation fails when a certain amount of reaction has taken place, its life is inversely proportional to the rate: L ∝ exp(E_a ÷ kT). The ratio of lives at two temperatures, the acceleration factor, is AF = exp((E_a ÷ k) × (1 ÷ T₁ − 1 ÷ T₂)).

```figure
type: formula
title: Arrhenius life and acceleration factor
formula: L ∝ exp(E_a ÷ kT)
formula: AF = L(T₁) ÷ L(T₂) = exp((E_a ÷ k) × (1 ÷ T₁ − 1 ÷ T₂))
caption: T in kelvin. AF is the factor by which ageing at T₂ is faster than at T₁. The result is very sensitive to the activation energy, which must suit the material and the failure mechanism.
- E_a | activation energy, eV
- k | Boltzmann's constant, 8.617 × 10⁻⁵ eV/K
- T₁, T₂ | the two absolute temperatures, K
- AF | acceleration factor
```

The well-known rule that insulation life halves for each 10 °C rise, sometimes called the ten-degree rule, is a special case. At about 150 °C, a halving for 10 K corresponds to an activation energy of k × ln 2 ÷ (1 ÷ 418.15 − 1 ÷ 428.15) = 1.07 eV. Activation energies of around 1 eV are typical of the oxidation of many insulating resins, though values for real systems vary and should come from thermal endurance data for the system concerned.

For C-1, taking an activation energy of 1.0 eV, the [Arrhenius acceleration check](/tools/arrhenius-acceleration-check/) gives an acceleration factor of 2.08 between 120 °C and 130 °C: ten degrees roughly doubles the rate of ageing. Its sensitivity table shows how much depends on the activation energy: at 0.8 eV the factor would be about 1.8, and at 1.2 eV about 2.4.

```figure
type: bars
title: Acceleration factor between 120 °C and 130 °C, by activation energy
unit: ×
max: 2.6
caption: From the Arrhenius acceleration check. The ten-degree rule corresponds to a factor of 2. With the tool's default of 0.5 eV, intended for other mechanisms, the factor is only 1.44.
- 0.5 eV | 1.44
- 0.8 eV | 1.80
- * 1.0 eV | 2.08
- 1.2 eV | 2.41
```

## The hot spot

Insulation ages fastest where it is hottest, and a winding is not at one temperature. The copper in the slots, carrying current and surrounded by iron and insulation, runs hotter than the copper in the end windings, which are cooled by air. Within the slots, the coils furthest from the cooling air run hottest. The temperature detectors embedded in C-1's slots read close to, but usually a little below, the hottest spot; the average winding temperature, measured by the rise in the winding's resistance, is lower still.

The hot spot temperature is the sum of the cooling medium's temperature, the average temperature rise of the winding above it, and the further rise from the average to the hottest point. Any change that raises any of these raises the ageing rate exponentially: a dirty air filter or a fouled heat exchanger raises the cooling air temperature; an overload or an unbalanced supply raises the current and the losses; a voltage that is too low or too high raises the losses in the iron or the copper. The site therefore treats a rise in C-1's winding detector readings at the same load as an insulation problem as well as a cooling problem.

## A year of C-1's life

The Arrhenius model allows running at different temperatures to be converted into equivalent hours at a reference temperature. Taking 120 °C as the reference for C-1 and an activation energy of 1.0 eV, an hour at 115 °C counts as AF = exp((1.0 ÷ k) × (1 ÷ 393.15 − 1 ÷ 388.15)) = 0.684 hours at 120 °C, and an hour at 125 °C counts as 1.449 hours.

In a typical year C-1 runs about 6,000 hours with its hot spot near 115 °C and about 2,000 hours near 125 °C, and stands for the rest of the year. Its equivalent ageing is 6,000 × 0.684 + 2,000 × 1.449 = 4,102 + 2,897 = 7,000 hours at 120 °C, less than its 8,000 actual running hours because most of its running is cooler than the reference. A quarter of its ageing in a year happens in a quarter of its running hours, in summer.

```figure
type: compare
title: C-1's yearly ageing in equivalent hours at 120 °C
cols: Running hours | Factor to 120 °C | Equivalent hours
rowhead: Hot spot
- About 115 °C, winter | 6,000 | 0.684 | 4,102
- About 125 °C, summer | 2,000 | 1.449 | 2,897
- Total | 8,000 | — | 7,000
caption: This is an illustration. Activation energy taken as 1.0 eV. Temperatures are the site's working figures for C-1's hot spot.
```

## From the Arrhenius model to winding life

The Arrhenius model gives the ratio of lives at different temperatures, but not the life itself or its spread. Windings of the same design do not all fail at the same age, because their materials, manufacture and service differ. The spread of lives in a population is often described by a Weibull distribution, with a shape parameter β greater than 1 for ageing failures and a scale parameter η, the characteristic life, at which 63.2 % have failed.

The site's rewinder, from records of similar form-wound machines, suggested working figures of β = 2.5 and η = 150,000 hours at a hot spot of 120 °C for C-1's insulation system, which the site uses for planning, with the caveat that they are estimates. Given those values and a mission of ten years, 87,600 hours, the [Weibull reliability tool](/tools/weibull-reliability/) gives a reliability of 77.1 %, a B10 life, the age by which 10 % would fail, of 60,976 hours, and a mean life of 133,090 hours.

The Arrhenius factor scales the characteristic life. If C-1 ran permanently 10 °C hotter, at 130 °C, its characteristic life would fall by the factor 2.08 to about 72,130 hours, and the Weibull tool gives a reliability at ten years of only 19.7 % and a B10 life of 29,321 hours. A ten-degree rise sustained over a machine's life is the difference between a winding that will probably see its second decade and one that probably will not.

```figure
type: stats
title: C-1's winding life at two hot spot temperatures, planning figures
caption: This is an illustration. Weibull β = 2.5; η = 150,000 h at 120 °C, divided by the Arrhenius factor of 2.08 for 130 °C. From the Weibull reliability tool.
- 77.1 % | reliability at ten years, hot spot 120 °C
- 60,976 h | B10 life at 120 °C
- 19.7 % | reliability at ten years, hot spot 130 °C
- 29,321 h | B10 life at 130 °C
```

## The mistake: the default activation energy

In C-1's ninth summer, the plate heat exchanger that cools the plant room's ventilation air fouled, and for about 2,000 hours C-1 ran with its hot spot near 130 °C rather than its usual summer 120 °C to 125 °C. After the heat exchanger was cleaned, the plant manager asked how much insulation life the summer had cost.

The technician opened the Arrhenius acceleration check and entered 120 °C and 130 °C with 2,000 hours, but left the activation energy at the tool's default of 0.5 eV. The tool reported an acceleration factor of 1.44, so the 2,000 hours were equivalent to 2,884 hours at 120 °C, an extra 884 hours, about five weeks of normal ageing. The report concluded that the overheating had been of little consequence.

The electrical supervisor noticed the activation energy. The tool's guidance says the value must be one measured for the failure mechanism, and its sensitivity table shows the result changing steeply with it. For the thermal oxidation of the resins in C-1's insulation, a value of about 1.0 eV, consistent with the ten-degree rule, is more appropriate. With 1.0 eV, the factor is 2.08, the 2,000 hours were equivalent to 4,159 hours at 120 °C, and the extra ageing was 2,159 hours, about three months of normal running, two and a half times the first estimate.

```figure
type: steps
title: Two estimates of the summer's ageing
caption: This is an illustration. 2,000 hours at 130 °C compared with running at 120 °C, from the Arrhenius acceleration check.
- Event | heat exchanger fouled; hot spot near 130 °C for about 2,000 hours
- First estimate | tool default 0.5 eV; factor 1.44; extra ageing 884 hours
- Check | activation energy should suit resin oxidation, about 1.0 eV
- * Revised estimate | factor 2.08; 4,159 equivalent hours; extra ageing 2,159 hours
- Fix | heat exchanger added to the monthly inspection; winding temperature alarm set at the summer normal plus 5 °C
```

Neither figure is alarming for a single summer, but the second is the one that should guide decisions, and the episode changed two things. The ventilation heat exchanger is now inspected monthly in summer, and C-1's winding temperature detectors have an alarm set 5 °C above their usual summer reading at the same load. The site's procedure for using the Arrhenius tool now names the activation energy to use for each mechanism, with its source.

## Using equivalent age in planning

The equivalent hours add up over a machine's life into an equivalent age, which the site uses to plan rather than to predict. After its first eight years at about 7,000 equivalent hours a year, and a ninth year with 4,102 equivalent hours in winter and 4,159 in the hot summer, C-1's equivalent age at 120 °C is about 56,000 + 8,261 = 64,261 hours. With the planning figures of β = 2.5 and η = 150,000 hours, the reliability at that age is exp(−(64,261 ÷ 150,000)^2.5) = 0.887: about 89 % of windings like C-1's would be expected to survive to it. The planning B10 life of 60,976 hours has been passed.

That does not mean C-1 is about to fail; it means the population it belongs to is entering the part of its life where failures become more common, and the site's response is to watch more closely and to be ready. The probability that a winding which has reached 64,261 equivalent hours survives a further 70,000, about ten more years at the present rate, is R(134,261) ÷ R(64,261) = 0.53 on the same figures. The site therefore keeps a standing arrangement with its rewinder for a rewind slot, holds the drawings and winding data for C-1 and C-2, and makes the annual test results the trigger for any decision, as Chapter 10 describes.

## Other ageing that heat drives

Thermal ageing interacts with the other stresses. A winding that has become brittle cracks more easily under the forces of starting, so a compressor motor that starts many times a day ages mechanically faster as it ages thermally. Thermal cycling, the expansion and contraction of copper and insulation at different rates each time the motor heats and cools, loosens coils and opens gaps between insulation and copper, which can become voids. The Arrhenius model describes only the steady chemical part of the ageing, and the planning figures must be checked against the machine's test results, which is what the program of Chapter 10 does.

## Exercise: a hot condenser fan motor

During a heatwave, with the condenser coil fins clogged with dust, one condenser fan motor ran with its hot spot at about 120 °C, instead of its normal 95 °C, for 600 hours. Using an activation energy of 1.0 eV, calculate the acceleration factor and the equivalent hours at 95 °C, and say how much extra ageing the heatwave caused.

### Answer

**Given:** normal 95 °C, hot 120 °C, 600 hours, E_a = 1.0 eV.

**Assumptions:** Arrhenius ageing with a single activation energy; the same failure mechanism at both temperatures.

**Method:** AF = exp((E_a ÷ k)(1 ÷ T₁ − 1 ÷ T₂)), with T₁ = 368.15 K and T₂ = 393.15 K; equivalent hours = 600 × AF.

**Acceleration factor:** (1.0 ÷ 8.617 × 10⁻⁵) × (1 ÷ 368.15 − 1 ÷ 393.15) = 11,605 × 0.0001727 = 2.004; AF = exp(2.004) = 7.42.

**Equivalent hours:** 600 × 7.42 = 4,453 hours at 95 °C.

**Extra ageing:** 4,453 − 600 = 3,853 hours, about five and a half months of normal continuous running, used in 25 days.

**Verification:** the Arrhenius acceleration check, with a use temperature of 95 °C, a test temperature of 120 °C, 1.0 eV and 8,760 hours, gives a factor of 7.4216, which agrees.
