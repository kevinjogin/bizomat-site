---
book: entropy-by-the-numbers
chapterSlug: calculating-entropy-changes
order: 4
title: "Calculating entropy changes"
description: "Calculate entropy changes for heated water, condensing steam and compressed air, choose a reversible path for any real process, check them against NIST tables and read a temperature–entropy diagram."
draft: false
---

Entropy has a reputation for being abstract, but calculating a change in it is no harder than calculating a change in enthalpy. It is a property of the state of a substance, like temperature or pressure, and its change between two states depends only on those states. The definition looks as if it applies only to idealised, reversible processes, and that puzzles people. The resolution is simple and practical: to find the entropy change in any process, however messy, invent a reversible path between the same two states and calculate along it.

This chapter sets out the definition, the three formulas that cover almost every calculation in a plant, and the habit of checking them against property tables. It applies them to the running case's wash water, kettle steam and compressed air, and ends with an entropy change that came out 8.6 times too large because of one missing conversion.

## The definition

When a small quantity of heat δq enters a body reversibly at absolute temperature T, its entropy rises by

dS = δq_rev ÷ T

and when heat leaves, its entropy falls by the same rule. Entropy has units of energy divided by temperature: J/K for a body, kJ/kg·K per unit mass, kW/K for a flow.

Two consequences matter immediately.

- **It is a property.** Over any closed cycle of reversible changes, the sum of δq_rev ÷ T is zero, a result due to Clausius. So the change in entropy between two states is the same whatever reversible path links them, and the entropy of a state is fixed once the state is fixed.
- **It works for irreversible processes too.** A real process, with friction, mixing or heat flowing across a large temperature difference, does not follow a reversible path. But its end states are definite, and so is the entropy difference between them. Calculate that difference along any convenient reversible path. The real path does not matter.

The second point is the one that makes entropy useful. A gas leaking through a crack, water heated by a flame and air throttled through a regulator all have end states that can be described, and therefore entropy changes that can be calculated, even though none of them is reversible.

## Three formulas for a plant

```figure
type: formula
title: Entropy changes for the commonest cases
formula: Liquid or solid, constant specific heat: Δs = c × ln(T₂ ÷ T₁)
formula: Phase change at constant temperature: Δs = h_fg ÷ T
formula: Ideal gas: Δs = c_p × ln(T₂ ÷ T₁) − R × ln(p₂ ÷ p₁)
caption: Temperatures in kelvin and pressures absolute. Each formula follows from dS = δq_rev ÷ T along a convenient reversible path. Property tables give the same changes more accurately and are the check.
- c, c_p | specific heat, kJ/kg·K
- h_fg | enthalpy of vaporisation at temperature T, kJ/kg
- R | specific gas constant, kJ/kg·K; 0.287 for air
step: Wash water, 20 °C to 60 °C: 4.18 × ln(333.15 ÷ 293.15) = 0.53466 kJ/kg·K
step: Kettle steam condensing at 375.68 K: −2,249.65 ÷ 375.68 = −5.9882 kJ/kg·K
step: Air compressed from 1.01325 to 8 bar at 20 °C: −0.287 × ln(7.895) = −0.5930 kJ/kg·K
```

### Heating a liquid

For a liquid heated reversibly at constant pressure, δq = c dT, so dS = c dT ÷ T, which integrates to c ln(T₂ ÷ T₁) if c is constant. The running case's wash water is heated from 20 °C to 60 °C. With c = 4.18 kJ/kg·K the formula gives 0.53466 kJ/kg·K. The NIST WebBook gives entropies of 0.29642 and 0.83114 kJ/kg·K at 0.3 MPa for the two temperatures, a difference of **0.53472 kJ/kg·K**. The constant-specific-heat formula agrees to 0.01%.

The logarithm is what distinguishes entropy from enthalpy. Each kilojoule of heat added at a low temperature raises the entropy more than the same kilojoule added at a high temperature, because it is divided by a smaller T. That is the root of everything in Chapter 6.

### Phase changes

When a substance boils or condenses at constant pressure, its temperature stays constant while the latent heat flows, so the integral reduces to a division. The kettle's steam condenses at 102.53 °C, 375.68 K, where NIST gives an enthalpy of vaporisation of 2,249.65 kJ/kg. Its entropy falls by 2,249.65 ÷ 375.68 = **5.9882 kJ/kg·K** as it condenses, against the table's difference of 5.9883 between saturated vapour and liquid. Phase changes carry large entropy changes because their large latent heats flow at a single temperature.

### Ideal gases

For an ideal gas, a reversible path from (T₁, p₁) to (T₂, p₂) can be built from a constant-pressure step, which contributes c_p ln(T₂ ÷ T₁), and a constant-temperature step, which contributes −R ln(p₂ ÷ p₁). Raising the pressure lowers the entropy, because squeezing a gas at constant temperature requires heat to be removed.

For the plant's compressed air, compressed from atmospheric pressure to 8 bar absolute and cooled back to 20 °C in the aftercooler, the temperature term vanishes and the entropy falls by 0.287 × ln(8 ÷ 1.01325) = **0.5930 kJ/kg·K**. A real gas departs slightly from the formula. For nitrogen, the closest common gas in the NIST WebBook to air, the table gives an entropy fall of 0.6183 kJ/kg·K between 0.101325 MPa and 0.8 MPa at 20 °C, against 0.6133 from the ideal-gas formula with nitrogen's own gas constant: agreement within 1%, which is typical at these pressures.

```figure
type: compare
title: Formula against NIST table for the running case
rowhead: Process
cols: Formula, kJ/kg·K | NIST table, kJ/kg·K | Difference
caption: Water at 0.3 MPa; steam saturated at 102.53 °C; nitrogen at 20 °C as a stand-in for air. The simple formulas are good enough for most plant calculations; the tables are the check.
- * Water heated 20 °C to 60 °C | +0.53466 | +0.53472 | 0.01%
- Water heated 20 °C to 80 °C | +0.77835 | +0.77898 | 0.08%
- Steam condensing at 102.53 °C | −5.9882 | −5.9883 | under 0.01%
- Nitrogen, 0.101325 to 0.8 MPa at 20 °C | −0.6133 | −0.6183 | 0.8%
```

## Two useful approximations

For quick estimates, the logarithm can be avoided. Dividing the heat by the arithmetic mean temperature gives Δs ≈ Δh ÷ T_mean. For the wash water, 167.226 ÷ 313.15 = 0.53401 kJ/kg·K, only 0.13% below the table value, and for water heated to 80 °C, 251.016 ÷ 323.15 = 0.77678 kJ/kg·K, 0.28% low. The approximation is good whenever the temperature range is small compared with the absolute temperature, which covers most hot water, cooling water and air-conditioning calculations. Dividing by the logarithmic mean temperature, (T₂ − T₁) ÷ ln(T₂ ÷ T₁), instead of the arithmetic mean, makes it exact for a constant specific heat.

The second approximation is the constant specific heat itself. Water's specific heat varies by less than 0.5% between 20 °C and 80 °C, according to the same NIST table, so a single value of 4.18 kJ/kg·K serves well. Air's c_p of about 1.005 kJ/kg·K is similarly steady near room temperature. Over wide ranges, such as combustion gases from 1,500 °C to 150 °C, the variation is large and the integral must use a temperature-dependent specific heat or a table.

## Zeros and reference states

A property table lists absolute-looking values of entropy, such as 0.29642 kJ/kg·K for water at 20 °C, but in engineering tables the zero is a convention. NIST's default for water, like most steam tables, sets the entropy of saturated liquid water at its triple point to zero. Other references set other zeros, and two tables can list different values for the same state.

Only differences matter, and differences are the same in every table, provided both values come from the same one. Mixing an entropy from one source with an entropy from another is a quiet way to produce a wrong answer. The third law of thermodynamics does supply a natural zero, the entropy of a perfect crystal at absolute zero, and chemists use it for absolute entropies of substances. For the plant calculations in this book, a consistent table and its stated reference state are enough.

## Choosing the reversible path

The formulas are tools for one step: replace the real process by a reversible one between the same end states. Three examples from the plant show the method.

1. **Water heated by a gas flame.** The real process involves combustion gases at well over 1,000 °C and heat flowing violently into water. The water's end states are 20 °C and 60 °C at the same pressure, so its entropy change is calculated as if it had been heated slowly and reversibly: 0.53472 kJ/kg·K. What the flame does to its own entropy and the surroundings' is a separate calculation, and Chapter 6 makes it.
2. **Air through a regulator.** Air enters at 8 bar and leaves at 5 bar, at very nearly the same temperature. The real process is a sudden, turbulent expansion. The reversible path is a slow isothermal expansion from 8 to 5 bar, and the entropy change is 0.287 × ln(8 ÷ 5) = 0.1349 kJ/kg·K, an increase. Chapter 8 shows that this increase, with no heat transferred at all, is entropy generated by the throttle.
3. **Steam condensing in the kettle jacket.** Here the real process is close to the reversible one, since condensation happens at constant temperature, and the formula h_fg ÷ T applies directly.

## Entropy for a system and its surroundings

The entropy of one body can fall as well as rise. The kettle steam loses entropy as it condenses, the compressed air loses entropy in its aftercooler, and Chapter 5 shows food in the cool room losing entropy as it chills. None of that breaks the second law, which is a statement about the total: the entropy of a system plus everything it exchanges heat with never decreases, and increases in every real process.

In practice that means every second-law calculation has two halves. For the kettle, the steam loses 0.02 × 5.9882 = 0.1198 kW/K of entropy, while the food in the kettle, at a lower temperature, gains more. The difference is the entropy generated by the heat transfer, and Chapter 6 calculates it. Leaving out either half produces a nonsense answer: a "violation" if the receiving body is forgotten, or an exaggerated loss if the giving body is.

## The temperature–entropy diagram

Because δq_rev = T dS, the heat transferred in a reversible process is the area under its path on a diagram of temperature against entropy. Heating the wash water from 20 °C to 60 °C traces a gentle curve from 293.15 K to 333.15 K across an entropy change of 0.53472 kJ/kg·K, and the area under it is the heat, 167.2 kJ/kg.

```figure
type: svg
title: Heating the wash water on a temperature–entropy diagram
alt: A temperature–entropy diagram. A curve rises from 293.15 K at the left to 333.15 K at the right across an entropy change of 0.535 kJ/kg·K. The region under the curve down to absolute zero is shaded and labelled heat, 167.2 kJ/kg. A dashed horizontal line at 293.15 K, the dead state, splits the region into a small top part labelled exergy, 10.5 kJ/kg, and a large rectangle below labelled T0 times delta s, 156.8 kJ/kg.
caption: The axes are not to scale; the true diagram's vertical axis runs down to 0 K. The area under the curve is the heat. The part above the dead-state line is the exergy of Chapter 7; the rectangle below it is heat that the surroundings could have supplied free.
viewbox: 0 0 440 300
body:
<path class="ln" d="M60 270L60 30M60 270L410 270"/>
<path class="fs" d="M120 140Q220 110 340 70L340 270L120 270Z"/>
<path class="fa" d="M120 140Q220 110 340 70L340 140Z"/>
<path class="la" d="M120 140Q220 110 340 70"/>
<path class="cl" d="M60 140L380 140"/>
<text class="txs" x="12" y="144">293 K</text>
<text class="txs" x="12" y="74">333 K</text>
<path class="lf" d="M60 70L340 70"/>
<text class="txa" x="346" y="100">exergy</text>
<text class="txa" x="346" y="118">10.5</text>
<text class="txs" x="160" y="215">T0 × Δs = 156.8 kJ/kg</text>
<text class="txs" x="346" y="158">dead state</text>
<text class="txs" x="355" y="290">entropy s</text>
<text class="txs" x="66" y="24">temperature T</text>
```

The diagram anticipates Chapter 7. The rectangle under the dead-state line is T₀ × Δs = 293.15 × 0.53472 = 156.8 kJ/kg, heat the surroundings could have supplied with no work at all. Only the thin sliver above it, 10.5 kJ/kg, needed work, and that sliver is the water's exergy.

## The error: logarithms of degrees Celsius

This is an illustration. A graduate engineer preparing the plant's second-law audit calculated the wash water's entropy change in a spreadsheet as 4.18 × ln(60 ÷ 20) = 4.592 kJ/kg·K, and from it an exergy that was hugely negative: 167.2 − 293.15 × 4.592 = −1,179 kJ/kg. A negative exergy for hot water is impossible, since hot water can always drive an engine against cold surroundings, and the spreadsheet's later sheets inherited the nonsense.

The reviewing engineer's first check was the one in the table above: compare the formula with the property table. NIST gives 0.53472 kJ/kg·K; the spreadsheet gave 8.6 times as much. The ratio pointed at the logarithm, and the cause was temperatures entered in degrees Celsius. With kelvin, ln(333.15 ÷ 293.15) = 0.1279 instead of ln(3) = 1.0986.

The fix was a single conversion, but the shop changed its practice too. Every temperature in the audit spreadsheet now has a column in kelvin, used by every formula that divides or takes a logarithm, and every entropy change is checked against a NIST value for at least one case before the sheet is used. The check takes less time than the error took to find.

## How this applies to a small Australian business

Most small plants never calculate an entropy change, and need not, until they want to compare options that the first law cannot separate: a heat pump against a boiler, heat recovery against more insulation, a lower compressed-air pressure against new tools. Then the three formulas in this chapter, a free property table and one rule, kelvin for every ratio and logarithm, are all that is needed. The NIST WebBook gives water, air components, refrigerants and dozens of other fluids free of charge, and any calculation that can be checked against it should be. A shop that keeps a one-page sheet of checked values for its own common states, hot water, steam at its kettle pressure, compressed air at its line pressure, has a reference that catches unit errors before they reach a decision.

## Exercise: the compressed air's aftercooler

The compressor delivers 0.06 kg/s of air at 8 bar absolute, which its aftercooler returns to 20 °C. Treating air as an ideal gas with R = 0.287 kJ/kg·K, find the rate at which the air's entropy falls between the intake at 1.01325 bar and 20 °C and the aftercooler outlet at 8 bar and 20 °C. If the compression were reversible and isothermal at 20 °C, how much heat would have to be removed?

**Worked answer.** The temperature is the same at both ends, so Δs = −R ln(p₂ ÷ p₁) = −0.287 × ln(8 ÷ 1.01325) = −0.287 × 2.0663 = −0.5930 kJ/kg·K. For 0.06 kg/s, the entropy falls at **0.0356 kW/K**.

In a reversible isothermal compression, all the heat leaves at 293.15 K, so Q = T × ΔS = 293.15 × 0.0356 = **10.43 kW**. For an ideal gas at constant temperature the internal energy does not change, so this heat equals the work of compression. Chapter 9 compares it with the 22 kW the real compressor takes.
