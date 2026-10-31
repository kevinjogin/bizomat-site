---
book: solvent-vapours-by-the-numbers
chapterSlug: vapour-pressure-and-boiling
order: 2
title: "Vapour pressure and boiling"
description: "What vapour pressure is, how it rises steeply with temperature by the Clausius–Clapeyron relation, checking it against Antoine data, boiling, and ranking solvents by volatility."
draft: false
---

Every question about a solvent's vapour leads back to one property: its vapour pressure. It decides how much vapour sits above the liquid in a closed drum, how fast an open surface evaporates, whether a tank can form a flammable atmosphere, how cold an evaporating film gets and how much vapour a condenser can recover. It depends on the liquid and on its temperature, and it rises with temperature far faster than intuition suggests.

This chapter explains vapour pressure, derives its temperature dependence from the Clausius–Clapeyron relation, checks that relation against measured data, treats boiling as the point where vapour pressure meets the surrounding pressure, and ranks Plant S's solvents by how readily they evaporate. Its error is a vapour pressure taken from a safety data sheet at 20 °C and used on a hot afternoon.

## Evaporation and equilibrium

In a liquid, molecules are held together by attractions, but their energies are spread over a range, and at any moment a few near the surface have enough energy to escape. Those escaping molecules form a vapour. In an open container they drift away, and the liquid slowly evaporates. In a closed one they accumulate in the space above the liquid, and some of them, striking the surface, are recaptured. The vapour builds up until the rate of capture equals the rate of escape. At that point the vapour is saturated and its partial pressure is the liquid's **vapour pressure**.

For a pure liquid, the vapour pressure depends only on temperature. It does not depend on how much liquid there is, on the size of the space above it, or on whether air is present as well. A 205 L drum with 5 L of acetone left in it holds vapour at the same partial pressure as a full one, once both have reached equilibrium at the same temperature. Chapter 4 shows why that fact makes nearly empty drums dangerous.

## How vapour pressure depends on temperature

Escaping the liquid takes energy: the enthalpy of vaporisation, the heat needed to turn a mole of liquid into vapour at constant temperature. Because only the most energetic molecules escape, and the share of molecules with enough energy rises steeply with temperature, so does the vapour pressure.

The relation between the two comes from the condition for equilibrium between the phases. Along the line where liquid and vapour coexist, the slope of vapour pressure against temperature equals the enthalpy of vaporisation divided by the temperature and by the change in volume on vaporising. That is the Clapeyron equation. If the vapour behaves as an ideal gas, and the liquid's volume is negligible beside the vapour's, it integrates to a simple form.

```figure
type: formula
title: The Clausius–Clapeyron relation for vapour pressure
caption: Assumes an ideal vapour, a negligible liquid volume and an enthalpy of vaporisation that does not change over the temperature range. Temperatures must be absolute. One known point and the enthalpy give the whole curve near that point.
- dP ÷ dT = ΔH_vap ÷ (T Δv) | Clapeyron: the slope of the coexistence line
- step: Δv ≈ RT ÷ P | ideal vapour, liquid volume neglected
- step: ln(P₂ ÷ P₁) = −(ΔH_vap ÷ R)(1 ÷ T₂ − 1 ÷ T₁) | Clausius–Clapeyron, integrated
- step: P₂ = P₁ exp[−(ΔH_vap ÷ R)(1 ÷ T₂ − 1 ÷ T₁)] | the vapour pressure at a new temperature
```

The relation has the same form as the Arrhenius relation for reaction rates, and for the same reason: both describe molecules that need a certain energy to do something, in a population whose energies follow the Boltzmann distribution. The enthalpy of vaporisation plays the part of the activation energy.

## Plant S's solvents

The engineer collected the properties of the five solvents in use from two public sources: the NIST Chemistry WebBook for molar masses, boiling points, enthalpies of vaporisation and fitted vapour pressure equations, and the NIOSH Pocket Guide for vapour pressures at 20 °C, flammable limits and flash points.

```figure
type: compare
title: Properties of Plant S's solvents
rowhead: Solvent
cols: Molar mass | Vapour pressure at 20 °C | Normal boiling point | Enthalpy of vaporisation near room temperature
caption: Vapour pressures for acetone, toluene and ethyl acetate from NIST's Antoine fits, which agree with the NIOSH values of 180, 21 and 73 mmHg; for 2-butanone and isopropanol, whose NIST fits do not extend down to 20 °C, the NIOSH values of 78 and 33 mmHg converted to kPa. Enthalpies from NIST data near 288 to 309 K.
- Acetone | 58.08 g/mol | 24.6 kPa | 56.2 °C | 31.3 kJ/mol
- Ethyl acetate | 88.11 g/mol | 9.84 kPa | 77.1 °C | 35.7 kJ/mol
- 2-Butanone (MEK) | 72.11 g/mol | 10.4 kPa | about 80 °C | 34.6 kJ/mol
- Isopropanol | 60.10 g/mol | 4.40 kPa | 82.4 °C | 45.5 kJ/mol
- Toluene | 92.14 g/mol | 2.91 kPa | 110.7 °C | 38.0 kJ/mol
```

A vapour pressure of 24.6 kPa means that saturated acetone vapour at 20 °C makes up about a quarter of the air above the liquid, 24.6 ÷ 101.325 = 24%. Even toluene, the least volatile of the five, saturates air at about 2.9% at 20 °C, well above its lower explosive limit of 1.1%.

### Reading vapour pressures from documents

Vapour pressures come in a confusing variety of units and reference temperatures. Safety data sheets give them in kilopascals, hectopascals, millibars or millimetres of mercury, at 20 °C or 25 °C, and sometimes at 50 °C for transport classification. The conversions are fixed: 1 hPa = 1 mbar = 0.1 kPa, and 1 mmHg = 0.1333 kPa. The NIOSH Pocket Guide gives acetone's vapour pressure as 180 mmHg, which is 180 × 0.1333 = 24.0 kPa, at its standard reference temperature of 20 °C; the NIST Antoine fit gives 24.6 kPa at the same temperature. Differences of a few per cent between sources are normal and do not matter for the calculations in this book.

Two habits prevent most errors. Write the temperature next to every vapour pressure copied from a document, and convert everything to kilopascals before calculating. When a data sheet gives a value only at 50 °C, use the Clausius–Clapeyron relation to bring it back to the working temperature rather than using it as it stands.

### Checking the relation against data

The NIST WebBook gives, for acetone, an Antoine equation fitted to measured vapour pressures from −14 °C to 234 °C. It has the form log₁₀ P = A − B ÷ (T + C), an empirical refinement that allows for the slow change of the enthalpy of vaporisation with temperature. Comparing the Clausius–Clapeyron relation, anchored at the normal boiling point with 31.3 kJ/mol, with the Antoine fit shows how good the simple relation is over the range that matters in a workshop.

```figure
type: compare
title: Acetone vapour pressure, Clausius–Clapeyron against the NIST Antoine fit
rowhead: Temperature
cols: Antoine fit | Clausius–Clapeyron from 56.2 °C and 101.325 kPa | Difference
caption: Antoine coefficients from the NIST Chemistry WebBook (A 4.42448, B 1312.253, C −32.445, pressure in bar, temperature in K). The simple relation with a constant enthalpy is within about 3% over the workshop range, close enough for every calculation in this book.
- 0 °C | 9.39 kPa | 9.65 kPa | +2.8%
- 10 °C | 15.50 kPa | 15.69 kPa | +1.2%
- * 20 °C | 24.60 kPa | 24.70 kPa | +0.4%
- 30 °C | 37.75 kPa | 37.73 kPa | −0.1%
- 40 °C | 56.19 kPa | 56.09 kPa | −0.2%
- 50 °C | 81.37 kPa | 81.37 kPa | 0.0%
```

The same check for toluene, from its 20 °C value with 38.0 kJ/mol, gives 9.91 kPa at 45 °C against the Antoine fit's 9.87. Over the few tens of degrees that matter in a workshop, one reliable point and a sensible enthalpy of vaporisation are enough. Farther from the known point, or near the critical temperature, the enthalpy changes appreciably and a fitted equation such as Antoine's is better.

## Boiling

A liquid boils when its vapour pressure reaches the pressure around it. Bubbles of vapour can then form inside the liquid, not just at its surface, because the vapour inside a bubble can push back the liquid around it. At sea level that pressure is about 101.325 kPa, and the temperature at which a liquid's vapour pressure reaches it is the normal boiling point. Under a vacuum, boiling happens at a lower temperature, which Chapter 10 uses for solvent recovery; in a pressurised vessel, at a higher one.

The [boiling margin check](/tools/clausius-boiling-margin-check/) applies the integrated Clausius–Clapeyron relation with a constant enthalpy of vaporisation and one known boiling point. It gives the vapour pressure at the liquid's temperature, the boiling temperature at the absolute pressure above the liquid, the margin between them, and the pressure that would give a required margin. It judges the result either for keeping a liquid from boiling or flashing, or for making it boil, as in vacuum drying or distillation, and it warns when the liquid temperature is far from the known point.

For Plant S's acetone, entered with its normal boiling point of 56.2 °C at 101.325 kPa and 31.3 kJ/mol, the tool gives the vapour pressures at the temperatures the plant actually meets.

```figure
type: bars
title: Acetone vapour pressure at Plant S's working temperatures
unit: kPa
caption: From the boiling margin check with a known boiling point of 56.2 °C at 101.325 kPa and 31.3 kJ/mol. From 20 °C to 45 °C, the vapour pressure rises about 2.7 times, while the margin to boiling at atmospheric pressure falls from 36.2 K to 11.2 K.
- 20 °C, the data sheet's temperature | 24.7
- 35 °C, the workshop on a hot afternoon | 46.2
- * 45 °C, the solvent store, a steel container in sun | 67.8
```

The store in summer is the important case. A steel shipping container in full sun can reach 45 °C inside. Acetone stored there does not boil, with a margin of 11.2 K, but its vapour pressure is about two-thirds of an atmosphere. Every drum breathes out vapour as it warms during the day, and a drum opened in the afternoon releases a rush of it.

### Drums that breathe

The steep rise of vapour pressure with temperature has a cost even when a drum is never opened, provided it has a vent or a loosely fitted cap, as many in-use drums do. As the drum warms during the day, two things push gas out of it: the air in the headspace expands, and the vapour pressure rises, so the same headspace holds more vapour and less air. At night the drum cools and draws fresh air in. Each daily cycle expels a mixture rich in vapour.

The engineer estimated the loss from one acetone drum in the store, holding 50 L of liquid and so about 155 L of headspace, warming from 15 °C at dawn to 45 °C in the afternoon. At dawn the headspace vapour pressure is about 19.8 kPa; by afternoon it is 67.8 kPa, and the air in the headspace has been reduced from about 5.3 to about 2.0 moles. Following the air out step by step, each step carrying vapour at the ratio of vapour to air at that temperature, about 3.3 moles of air leave during the warming and take about 2.8 moles of acetone with them: 0.16 kg a day.

```figure
type: stats
title: Daily breathing of one vented acetone drum in a hot store
caption: This is an illustration. A 205 L drum with 50 L of acetone, warming from 15 °C to 45 °C each day at atmospheric pressure, vapour pressure by the Clausius–Clapeyron relation. A sealed drum would instead build pressure; a cooler store or a reflective, shaded one cuts both the loss and the pressure.
- 19.8 to 67.8 kPa | headspace vapour pressure from dawn to afternoon
- 0.16 kg | acetone expelled each day
- about 4.8 kg | each month, about 6 L
- 30 K | daily temperature swing driving it
```

Six litres a month from one drum is small beside Plant S's 536 kg, but it is released in a store where vapour can collect, and it is avoidable. Shading the store, ventilating it at low level, keeping fewer part-full drums, and keeping caps tight all reduce it.

## Ranking volatility

How fast a solvent evaporates from an open surface depends on its vapour pressure, on its molar mass and on the air movement over the surface, as Chapter 5 shows. For a rough ranking under the same conditions, the product of vapour pressure and molar mass is a fair guide to the evaporation rate by mass, because it is proportional to the mass of vapour in a saturated volume of air.

```figure
type: bars
title: Relative evaporation rate by mass at 20 °C, acetone = 1
unit: relative to acetone
caption: The product of vapour pressure and molar mass, relative to acetone's. A rough ranking for open surfaces under the same air movement. Isopropanol and toluene evaporate at nearly the same rate by mass, although their boiling points differ by 28 K.
- * Acetone | 1.00
- Ethyl acetate | 0.61
- 2-Butanone | 0.52
- Toluene | 0.19
- Isopropanol | 0.18
```

The ranking shows that boiling point is a poor guide to evaporation at room temperature. Isopropanol boils at 82 °C and toluene at 111 °C, yet at 20 °C they evaporate at almost the same rate by mass, because isopropanol's higher enthalpy of vaporisation makes its vapour pressure fall faster as it cools from its boiling point, and its lighter molecules carry less mass. Vapour pressure at the working temperature is the property to compare.

## The error: a 20 °C number on a 35 °C afternoon

The plant's first risk assessment of its gun-washing station used the acetone vapour pressure from the safety data sheet, 24 kPa at 20 °C, to estimate the vapour released from the open drum. The station is in the busiest part of the workshop, where afternoon temperatures in summer reach 35 °C, and the drum itself warms to the same temperature.

At 35 °C, the vapour pressure is 46.2 kPa, 1.88 times the 20 °C value. Everything that scales with vapour pressure was underestimated by the same factor: the vapour released from the open drum, the concentration above it and, as Chapter 5 shows, the evaporation rate. In the solvent store at 45 °C the factor was 2.75.

```figure
type: stats
title: The same acetone drum at two temperatures
caption: From the boiling margin check. Data sheets usually give vapour pressure at 20 °C or 25 °C; the workshop's real temperatures can roughly double it in summer.
- 24.7 kPa | vapour pressure at 20 °C
- 46.2 kPa | vapour pressure at 35 °C
- 1.88 times | factor by which the 20 °C figure understates it at 35 °C
- 2.75 times | the same factor at 45 °C in the store
```

The lesson is simple and general. A vapour pressure is meaningful only with its temperature. Assessments should use the warmest temperature the liquid will reach, which in an Australian workshop is often 35 °C or more, and in a closed store or a vehicle in sun higher still. A second, quieter version of the same mistake is to use a value at 25 °C for a cold winter morning, which overstates the vapour and can make a marginal process look worse than it is; it matters less for safety but can mislead cost estimates.

## How this applies to a small Australian business

Find the vapour pressure of each solvent you use at one temperature, from the safety data sheet, the NIOSH Pocket Guide or the NIST WebBook, and its enthalpy of vaporisation. With those two numbers, the Clausius–Clapeyron relation gives the vapour pressure at any workshop temperature within a few per cent. Use the hottest temperature the liquid will reach, including in stores and vehicles. Compare solvents by vapour pressure and molar mass at the working temperature, not by boiling point. Keep the numbers on one page for every solvent on site, so that each later calculation starts from the same, sourced values.

## Exercise: toluene on a hot afternoon

(a) Using the Clausius–Clapeyron relation, what is toluene's vapour pressure at 35 °C, from 2.91 kPa at 20 °C and 38.0 kJ/mol? (b) What fraction of the air above the liquid would saturated vapour form at 101.325 kPa? (c) How does that compare with its lower explosive limit of 1.1%?

**Worked answer.** (a) The exponent is (38,000 ÷ 8.314) × (1 ÷ 293.15 − 1 ÷ 308.15) = 0.759, and e^0.759 = 2.14, so P = 2.91 × 2.14 = **6.22 kPa**, in agreement with the NIST Antoine fit's 6.23 kPa. (b) 6.22 ÷ 101.325 = **6.1%** by volume. (c) That is about **5.6 times the lower explosive limit**, and also near the top of toluene's flammable range, whose upper limit is 7.1%. Saturated toluene vapour at 35 °C is flammable, and mixing with air on its way out of a container keeps it so until it is diluted below 1.1%.
