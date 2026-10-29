---
book: heat-engines-and-cogeneration-by-the-numbers
chapterSlug: the-otto-cycle-and-the-gas-engine
order: 3
title: "The Otto cycle and the gas engine"
description: "The air-standard Otto cycle step by step: compression ratio, efficiency, net work, mean effective and peak pressure, why the ideal overstates a gas engine, and how knock and lean burn set limits."
draft: true
---

A spark-ignition gas engine draws in a mixture of air and gas, compresses it, ignites it with a spark near the top of the stroke and lets the hot gas push the piston down. Real combustion is fast but not instant, the gas is not air, and heat leaks to the cylinder walls throughout. Even so, a simple model that replaces all of this with air heated at constant volume, the air-standard Otto cycle, explains the most important fact about these engines: their efficiency depends mainly on the compression ratio.

This chapter works through the Otto cycle for the laundry's gas engine, state by state, and uses it to explain efficiency, net work and mean effective pressure. It then shows where the model overstates a real engine, why knock limits the compression ratio of a spark-ignition engine, and why large gas engines run lean. It ends with a power estimate that came out three and a half times too high.

## The four processes

The air-standard Otto cycle treats the working gas as air with constant specific heats, in a closed cylinder, going through four reversible processes:

1. **1 to 2, isentropic compression.** The piston compresses the air from the bottom of the stroke to the top. Volume falls by the compression ratio r = V₁ ÷ V₂; temperature and pressure rise.
2. **2 to 3, heat addition at constant volume.** Combustion is modelled as heat added instantly with the piston at the top. Temperature and pressure jump.
3. **3 to 4, isentropic expansion.** The hot gas pushes the piston down to the bottom of the stroke, doing work.
4. **4 to 1, heat rejection at constant volume.** The exhaust and intake strokes are modelled as cooling the gas back to its starting state.

```figure
type: svg
title: The air-standard Otto cycle on a pressure–volume diagram
alt: A pressure–volume diagram. From state 1 at large volume and low pressure, a curve rises steeply to state 2 at small volume. A vertical line rises from state 2 to state 3 at the peak pressure. A curve falls from state 3 to state 4 at large volume, and a vertical line drops from 4 back to 1. The enclosed area is shaded and labelled net work. Heat in is marked by an arrow at the 2 to 3 line and heat out at the 4 to 1 line.
caption: Not to scale. Heat is added at constant volume (2 to 3) and rejected at constant volume (4 to 1); the enclosed area is the net work per cycle. For the running case the pressures at states 1, 2, 3 and 4 are 100, 3,242, 11,590 and 357 kPa absolute.
viewbox: 0 0 520 320
body:
<path class="ln" d="M60 290V20M60 290H500"/>
<path class="fs" d="M110 70Q140 180 440 250L440 280Q200 250 110 140Z"/>
<path class="la draw" pathLength="1" d="M110 140V70"/>
<path class="li" d="M110 70Q140 180 440 250"/>
<path class="li" d="M440 250V280"/>
<path class="li" d="M440 280Q200 250 110 140"/>
<text class="txb" x="92" y="64">3</text>
<text class="txb" x="92" y="154">2</text>
<text class="txb" x="448" y="248">4</text>
<text class="txb" x="448" y="296">1</text>
<text class="txa" x="122" y="108">heat in</text>
<text class="txs" x="452" y="270">heat out</text>
<text class="txb" x="230" y="226">net work</text>
<text class="txs" x="66" y="16">pressure p</text>
<text class="txs" x="420" y="312">volume V</text>
<path class="lf dsh" d="M110 290V280"/>
<text class="txs" x="96" y="312">V₂</text>
<text class="txs" x="434" y="312">V₁ = r × V₂</text>
```

## The running case, state by state

This is an illustration. The laundry's gas engine has a compression ratio of 12. For the first pass the engineer takes the air at the start of compression as 100 kPa absolute and 50 °C (323.15 K), as if the engine were not turbocharged, and adds heat equal to the fuel the engine burns per kilogram of air. Chapter 5 shows the engine burns 0.020 kg/s of gas with 0.62 kg/s of air, so each kilogram of air receives 1,000 kW ÷ 0.62 kg/s = **1,613 kJ** on the lower heating value. Air has k = 1.4 and R = 0.287 kJ/kg·K, so c_v = R ÷ (k − 1) = 0.7175 kJ/kg·K.

```figure
type: formula
title: Air-standard Otto cycle for the gas engine, compression ratio 12
formula: T₂ = T₁ × r^(k − 1);   p₂ = p₁ × r^k
formula: T₃ = T₂ + q_in ÷ c_v;   T₄ = T₃ ÷ r^(k − 1)
formula: η = 1 − 1 ÷ r^(k − 1)
caption: This is an illustration on the cold-air standard, matching the Air-Standard Otto and Diesel Cycle Check. The efficiency depends only on r and k; the heat added sets the temperatures, pressures and work.
- q_in | 1,613 kJ per kg of air
- c_v | 0.7175 kJ/kg·K
step: State 2: T₂ = 323.15 × 12^0.4 = 873.1 K (600.0 °C); p₂ = 100 × 12^1.4 = 3,242 kPa
step: State 3: T₃ = 873.1 + 1,613 ÷ 0.7175 = 3,121.2 K (2,848.1 °C); p₃ = 3,242 × 3,121.2 ÷ 873.1 = 11,590 kPa
step: State 4: T₄ = 3,121.2 ÷ 12^0.4 = 1,155.2 K; p₄ = 357 kPa
step: q_out = 0.7175 × (1,155.2 − 323.15) = 597 kJ/kg; w_net = 1,613 − 597 = 1,016 kJ/kg
step: η = 1,016 ÷ 1,613 = 1 − 12^−0.4 = 62.99%
```

The [Air-Standard Otto and Diesel Cycle Check](/tools/otto-diesel-cycle-check/) carries out the same steps. Given the cycle type, the compression ratio, the heat added per kilogram (for Otto) or the cutoff ratio (for Diesel), the starting pressure and temperature, k and R, it returns the temperature and pressure at each state, the heat added and rejected, the net work, the thermal efficiency, the mean effective pressure and the Carnot efficiency between the lowest and highest temperatures, and checks the peak pressure against an allowable value you enter. For this case it gives 62.99%, 1,016 kJ/kg, a mean effective pressure of 1,195 kPa, a peak of 11,590 kPa and 2,848.1 °C, and a Carnot efficiency of 89.65% between 50 °C and the peak temperature.

## Compression ratio and efficiency

The efficiency formula η = 1 − r^(1 − k) contains no temperatures and no heat input. Squeezing the charge harder before burning it raises the temperature at which heat is added and lowers, relative to it, the temperature at which heat is rejected, which is the Carnot argument from Chapter 1 in another form.

```figure
type: bars
title: Air-standard Otto efficiency against compression ratio, k = 1.4
unit: %
max: 80
caption: Each bar is 1 − r^−0.4. The gains shrink as r rises: going from 8 to 12 adds 6.5 points, going from 12 to 16 only 4.0. Real engines gain less again, because friction and heat loss grow with compression ratio.
- r = 6 | 51.16
- r = 8 | 56.47
- r = 10 | 60.19
- * r = 12, the gas engine | 62.99
- r = 14 | 65.20
- r = 16 | 67.01
```

### Net work and mean effective pressure

The net work per kilogram is useful, but engines are compared by the **mean effective pressure** (MEP): the constant pressure that, acting on the piston over one stroke, would do the same net work as the cycle. It is the net work divided by the swept volume per kilogram of air:

MEP = w_net ÷ (v₁ − v₂) = w_net ÷ [v₁ (1 − 1 ÷ r)]

With v₁ = R T₁ ÷ p₁ = 0.287 × 323.15 ÷ 100 = 0.9274 m³/kg, the swept volume is 0.9274 × (1 − 1/12) = 0.8502 m³/kg, and the MEP is 1,016 ÷ 0.8502 = **1,195 kPa**. MEP removes engine size from the comparison: two engines with the same MEP extract the same work from each litre swept.

## Turbocharging

Boosting the intake pressure puts more air, and so more fuel, into each cylinder. In the air-standard model, multiplying p₁ by a factor multiplies every pressure in the cycle and the MEP by the same factor, while leaving temperatures and efficiency unchanged.

This is an illustration. The turbocharger of Chapter 2 delivers 250 kPa absolute. After the charge-air cooler the intake manifold is at about 240 kPa and 50 °C. At that density, 240 ÷ (0.287 × 323.15) = 2.588 kg/m³, an engine of 21 litres turning at 1,500 r/min, with one intake stroke per cylinder every two revolutions, sweeps 0.021 × 12.5 = 0.2625 m³/s and could take in 0.679 kg/s of air if it filled perfectly. The measured 0.62 kg/s is 91% of that, a plausible volumetric efficiency, which is a useful cross-check on the air flow used in Chapter 2.

With p₁ = 240 kPa the tool gives an MEP of 2,868 kPa, a peak pressure of **27,817 kPa**, and the verdict **peak pressure over limit** against the default allowable of 12,000 kPa. The efficiency and temperatures are unchanged at 62.99% and 2,848.1 °C.

## Why the ideal overstates the engine

The real engine converts 40% of its fuel to electricity at the alternator, about 41.7% to shaft work once the alternator's losses are added back (400 ÷ 0.96 = 416.7 kW of shaft power from 1,000 kW of fuel, taking an alternator efficiency of 96%). The air-standard model says 62.99%. The gap has several causes, and each also explains why the model's peak temperature and pressure are too high.

```figure
type: compare
title: The air-standard Otto cycle against the real gas engine
rowhead: Feature
cols: Air-standard model | Real engine | Effect
caption: This is an illustration. Changing only k from 1.4 to 1.3, closer to hot combustion gas, lowers the model's efficiency to 52.55% and its peak to 2,093.9 °C and 8,790 kPa at 100 kPa intake. The remaining gap is heat loss, finite combustion time, pumping and friction.
- Working gas | air, k = 1.4 | combustion products, k falls as temperature rises | lower efficiency and peak temperature
- Heat addition | instant, at top dead centre | over 30 to 40 degrees of crank angle | lower peak pressure, some work lost
- Walls | no heat loss | heat to the jacket water, 230 kW | less work, more jacket heat
- Gas exchange | no work | pumping across valves and turbocharger | small loss, or gain with a good turbocharger
- Friction and auxiliaries | none | bearings, rings, oil and water pumps | brake work below indicated work
- Peak temperature | 2,848 °C | far lower; dissociation and heat loss limit it | air-standard peaks are a ceiling, not a design figure
```

The model's value is its trends, not its numbers. It shows correctly that efficiency rises with compression ratio, that boosting raises power without changing efficiency, and that heat rejection is unavoidable. For numbers, an engineer uses the maker's tested data, as Chapter 5 does.

### What the model says about the exhaust

The model's state 4 is the gas at the end of expansion, just before the exhaust valve opens: 1,155.2 K, or 882 °C, and 357 kPa. The real engine's exhaust reaches the turbocharger turbine at 575 °C (Chapter 2). The difference is a direct consequence of the table: heat that left through the cylinder walls during combustion and expansion went to the jacket water instead of the exhaust, and real combustion products with a lower k cool less on expansion than the model's air but start from a far lower peak. The model's q_out of 597 kJ/kg, 37% of the heat added, must cover everything the real engine rejects, but the real engine splits its rejected heat between the jacket water, the exhaust and the room in proportions the model cannot predict. That split decides how much useful heat a cogeneration plant recovers, and it comes only from the maker's energy balance, which Chapter 5 reads.

### Part load

The air-standard efficiency does not depend on how much heat is added, so the model predicts the same efficiency at half load as at full load. Real gas engines lose efficiency at part load. Less fuel is burned while friction and the auxiliaries stay much the same, so they take a larger share; and a spark-ignition engine controls its output by restricting the mixture with a throttle or by reducing boost, which lowers p₁, adds pumping work and leaves the cylinder walls relatively cooler. The model shows only one of these effects: lowering p₁ lowers the MEP and the peak pressure in proportion, and so the power, while the efficiency stays put. For an engine that will run below full output for long periods, the maker's part-load fuel data matter more than the full-load figure, and Chapter 10 shows why cogeneration engines are usually sized to run near full output for as many hours as possible.

## Knock and the limit on compression ratio

If the efficiency rises with compression ratio, why do spark-ignition engines not run at 20? Because the unburnt mixture ahead of the flame is itself being compressed and heated as the flame advances. If it reaches its auto-ignition conditions before the flame arrives, it explodes all at once. This is **knock**: a pressure wave that rings through the cylinder, overheats the piston crown and can destroy an engine. The tendency to knock rises with compression ratio, intake temperature, boost pressure and spark advance.

Each fuel has a resistance to knock. For gaseous fuels it is described by a methane number, and natural gas, being mostly methane, resists knock better than petrol does, which lets gas engines use higher compression ratios. Gas with more ethane, propane or hydrogen knocks more easily, so engine makers state the gas quality an engine needs and derate it, or retard its spark, for poorer gas. That is one reason the gas composition supplied to a site should be known before an engine is chosen.

### Lean burn

Large gas engines usually run **lean**, with far more air than the fuel needs: the laundry's engine runs with about 80% excess air, an air–fuel ratio of about 31 against the stoichiometric 17.2 (Chapter 5). Lean mixtures burn cooler. That reduces nitrogen oxides, which form fastest at high flame temperatures, and lowers the end-gas temperature, which suppresses knock and allows a higher compression ratio and more boost. The air-standard model shows the effect directly: less heat per kilogram of air means a lower T₃ and p₃ for the same compression ratio. Lean mixtures are harder to ignite, which is why lean-burn engines use pre-chamber spark plugs or other strong ignition systems.

Emissions limits for engines are set by state environment protection authorities through the licence or approval for the site, and the engine maker's emission data at the chosen settings should be checked against them early.

## The error: a power estimate three and a half times too high

This is an illustration. Checking the supplier's proposal, a junior engineer estimated the engine's power from the turbocharged air-standard MEP. The 21-litre engine runs at 1,500 r/min, or 25 revolutions per second, so the estimate was 2,868 kPa × 0.021 m³ × 25 s⁻¹ = **1,506 kW**, against the nameplate's 400 kW of electricity.

Two mistakes compounded. First, a four-stroke engine has one power stroke per cylinder every two revolutions, not every revolution, so the power is MEP × V × n ÷ 2: 753 kW from the same MEP. Second, the air-standard MEP is an ideal figure. The engine's real **brake mean effective pressure**, worked back from its shaft power, is 416.7 kW ÷ (0.021 m³ × 12.5 s⁻¹) = 1,587 kPa, about 55% of the ideal 2,868 kPa. Two factors account for it: the engine's brake efficiency is 41.7 ÷ 62.99 = 66% of the ideal, and each cubic metre swept takes in 0.62 ÷ 0.2625 = 2.36 kg of air rather than the 2.82 kg the model assumes, a factor of 0.84. Together, 0.66 × 0.84 = 0.55.

The correction was a rule written into the review checklist: use the air-standard cycle to explain trends and check efficiency claims, and use the maker's brake MEP, power and fuel data for any number that will be relied on.

## How this applies to a small Australian business

The Otto cycle gives a buyer three practical questions for any gas engine offer:

- What compression ratio and gas quality is the engine set for, and what happens to its rating if the gas supplied to the site differs? The gas distributor can supply the typical composition.
- What brake MEP does the rating imply? A figure far above similar engines deserves a question about life and maintenance intervals.
- What emissions does it produce at the settings that give the quoted efficiency? Lean-burn settings that cut nitrogen oxides may cost some efficiency.

Installation of gas-fired engines involves gas fitting, pressure equipment, electrical connection and environmental approval, each handled by licensed and qualified people under state regulation. The air-standard cycle helps an owner ask the right questions; it does not replace the maker's data or that review.

## Exercise: a lower compression ratio

The engine maker offers a variant with a compression ratio of 9 for sites with poorer gas. Using the same intake state (100 kPa, 50 °C) and heat added (1,613 kJ/kg), find the air-standard efficiency, net work and peak pressure, and estimate how much more fuel the real engine might need for the same output if its real efficiency fell in proportion.

**Worked answer.** The efficiency is 1 − 9^−0.4 = **58.48%**. The net work is 0.5848 × 1,613 = **943.2 kJ/kg**. T₂ = 323.15 × 9^0.4 = 778.2 K and p₂ = 100 × 9^1.4 = 2,167 kPa; T₃ = 778.2 + 2,248.1 = 3,026.3 K and p₃ = 2,167.4 × 3,026.3 ÷ 778.2 = **8,429 kPa**, all matching the Air-Standard Otto and Diesel Cycle Check.

If the real efficiency fell in the same proportion, 58.48 ÷ 62.99 = 0.928, the 40% engine would become 37.1%, and the fuel for the same 400 kW would rise from 1,000 kW to 400 ÷ 0.3714 = 1,077 kW, about 7.7% more. This is only an estimate from trends; the maker's data for the variant is the figure to use.
