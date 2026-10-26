---
book: process-chillers-by-the-numbers
chapterSlug: the-vapour-compression-cycle
order: 3
title: "The vapour-compression cycle, point by point"
description: "The four components and four states of CH-30's R-134a cycle from NIST data, refrigerant flow, compressor power, condenser heat and COP, the pressure–enthalpy diagram, and two reference states mixed."
draft: false
---

Almost every chiller, refrigerator, air conditioner and heat pump in a factory uses the same cycle, whose principles READOS's Heat Pumps and Refrigeration by the Numbers sets out in its chapter on [the vapour-compression cycle](/reados/publications/heat-pumps-and-refrigeration-by-the-numbers/the-vapour-compression-cycle/); this chapter works it with real refrigerant data. A refrigerant evaporates at a low pressure, taking in heat; a compressor raises its pressure; it condenses at a high pressure, giving out heat; and an expansion device drops its pressure back to the start. The trick is that a fluid's boiling temperature depends on its pressure, so the same refrigerant can boil at 2 °C in one part of the circuit and condense at 45 °C in another. Working out the cycle means finding the refrigerant's state at four points, and with good property data it takes a few lines of arithmetic.

This chapter describes the four components, finds CH-30's four states from NIST's R-134a data, calculates the refrigerant flow, compressor power, condenser heat and coefficient of performance, checks the energy balance, draws the cycle on a pressure–enthalpy diagram, splits the evaporator and condenser duties into their parts, and ends with a calculation that mixed property data from two reference states.

## Four components

- The **evaporator** is a heat exchanger in which liquid refrigerant at low pressure boils, taking heat from the water. CH-30's is a brazed-plate exchanger, as an illustration.
- The **compressor** draws in the low-pressure vapour and compresses it to the condensing pressure. It is the only component that takes in work.
- The **condenser** is a heat exchanger in which the high-pressure vapour cools, condenses and is slightly subcooled, giving its heat to the outdoor air through finned coils and fans.
- The **expansion valve** drops the liquid's pressure back to the evaporating pressure. It controls the flow so that the vapour leaving the evaporator has a set superheat.

## CH-30's four states

This is an illustration. CH-30's design point is: evaporating at **2 °C**, which for R-134a is a pressure of **0.31462 MPa**; superheat of **5 K** at the compressor inlet; condensing at **45 °C**, **1.1599 MPa**; subcooling of **5 K** at the expansion valve; and a compressor isentropic efficiency of **0.70**. All properties are NIST's, in the ASHRAE reference state.

**State 1, compressor inlet.** Superheated vapour at 0.31462 MPa and 7 °C. NIST gives h₁ = **256.13 kJ/kg** and s₁ = **0.94664 kJ/(kg·K)**, with a density of 15.073 kg/m³.

**State 2, compressor outlet.** An ideal, isentropic compressor would deliver vapour at 1.1599 MPa with the same entropy, 0.94664. Interpolating NIST's superheated data at that pressure gives 54.2 °C and h₂s = **284.03 kJ/kg**. The real compressor needs more work, in the ratio of its isentropic efficiency:

- h₂ = h₁ + (h₂s − h₁) ÷ 0.70 = 256.13 + 27.90 ÷ 0.70 = **295.99 kJ/kg**, which NIST's table places at **65.1 °C**.

**State 3, expansion valve inlet.** Liquid at 1.1599 MPa, subcooled to 40 °C. Its enthalpy is very close to that of saturated liquid at 40 °C, **108.27 kJ/kg**; NIST gives 108.24 for the subcooled liquid at that pressure, a difference of 0.03%, and this book uses the saturated value.

**State 4, evaporator inlet.** The expansion valve does no work and exchanges no heat, so the enthalpy is unchanged: h₄ = **108.27 kJ/kg**, at 0.31462 MPa and 2 °C, a mixture of liquid and vapour (Chapter 5).

```figure
type: compare
title: CH-30's cycle states from NIST R-134a data
rowhead: State
cols: Where | Pressure, MPa | Temperature, °C | Enthalpy, kJ/kg | Condition
caption: This is an illustration at the design point. NIST data in the ASHRAE reference state; state 2 from an isentropic efficiency of 0.70.
- 1 | compressor inlet | 0.31462 | 7.0 | 256.13 | vapour, 5 K superheat
- 2 | compressor outlet | 1.1599 | 65.1 | 295.99 | superheated vapour
- 3 | expansion valve inlet | 1.1599 | 40.0 | 108.27 | liquid, 5 K subcooled
- 4 | evaporator inlet | 0.31462 | 2.0 | 108.27 | liquid and 27.3% vapour
```

## Flow, power and performance

With the four enthalpies, every duty follows from energy balances per kilogram of refrigerant.

- **Refrigerating effect**, heat taken in by the evaporator: q = h₁ − h₄ = 256.13 − 108.27 = **147.86 kJ/kg**.
- **Compressor work**: w = h₂ − h₁ = **39.86 kJ/kg**.
- **Condenser heat**: h₂ − h₃ = **187.72 kJ/kg**.

For 30 kW of cooling:

- refrigerant flow: ṁ = 30 ÷ 147.86 = **0.2029 kg/s**;
- compressor power: 0.2029 × 39.86 = **8.09 kW**;
- condenser heat: 0.2029 × 187.72 = **38.09 kW**;
- coefficient of performance: 147.86 ÷ 39.86 = **3.71**.

The energy balance closes: 30 kW taken in plus 8.09 kW of work equals the 38.09 kW rejected. The condenser always rejects more than the evaporator takes in, by the compressor's work, which is why an air-cooled chiller's condenser is larger than its evaporator and why its fans move more heat than the chiller's rating suggests.

The compressor's power here is the work done on the refrigerant. The electrical power is larger, by the losses in the motor and drive, and the chiller's total input includes its fans and controls; Chapter 8 adds them.

```figure
type: formula
title: CH-30's cycle from four enthalpies
formula: COP = (h₁ − h₄) ÷ (h₂ − h₁)
caption: This is an illustration with NIST R-134a enthalpies at the design point. The energy balance closes: 30 + 8.09 = 38.09 kW.
- h₁, h₂ | 256.13 and 295.99 kJ/kg
- h₃ = h₄ | 108.27 kJ/kg
step: q = 147.86 kJ/kg; w = 39.86 kJ/kg; COP = 3.71
step: ṁ = 30 ÷ 147.86 = 0.2029 kg/s; compressor 8.09 kW
step: Condenser: 0.2029 × 187.72 = 38.09 kW
```

## The pressure–enthalpy diagram

Refrigeration engineers draw the cycle on a chart with enthalpy across and pressure up, usually on a logarithmic scale. The refrigerant's saturation dome divides the chart into liquid on the left, vapour on the right and a mixture under the dome. On it, the cycle is a simple four-sided figure:

- the evaporator is a horizontal line at the low pressure, from state 4 under the dome to state 1 just right of it;
- the compressor is a line rising steeply to the right, from state 1 to state 2;
- the condenser is a horizontal line at the high pressure, from state 2 back across the dome to state 3, just left of it;
- the expansion valve is a vertical line straight down, from state 3 to state 4, because its enthalpy does not change.

The widths of the horizontal lines are the evaporator's and condenser's duties per kilogram, and the horizontal width of the compression line is the work. The whole cycle can be read, and its changes seen, at a glance.

```figure
type: svg
title: CH-30's cycle on a pressure–enthalpy diagram
alt: A pressure against enthalpy chart, not to scale. A dome-shaped saturation curve rises to a peak near the top centre. A rectangle-like cycle sits across it: a horizontal line at the low pressure of 0.315 MPa runs from point 4 at enthalpy 108 inside the dome to point 1 at 256 just outside the right side of the dome; a line rises to the right from point 1 to point 2 at 296 and 1.160 MPa; a horizontal line at 1.160 MPa runs left from point 2 across the dome to point 3 at 108 just outside the left side; a vertical line drops from point 3 to point 4.
caption: Schematic, not to scale. Horizontal lines are the evaporator and condenser at constant pressure; the vertical line is the expansion valve at constant enthalpy; the sloping line is the compressor.
viewbox: 0 0 640 330
body:
<path class="ln" d="M60 300H610"/>
<path class="ln" d="M60 300V20"/>
<text class="tx txs" x="520" y="322">enthalpy, kJ/kg</text>
<text class="tx txs" x="66" y="16">pressure, MPa (log)</text>
<path class="lf" d="M110 300Q160 40 300 30Q430 40 470 300"/>
<text class="tx txs" x="280" y="22">saturation dome</text>
<path class="la draw" pathLength="1" d="M200 230H460L540 110H200V230"/>
<text class="txa" x="186" y="250">4</text>
<text class="txa" x="466" y="250">1</text>
<text class="txa" x="546" y="104">2</text>
<text class="txa" x="186" y="104">3</text>
<text class="tx txs" x="240" y="222">evaporator, 0.315 MPa, 2 °C</text>
<text class="tx txs" x="250" y="102">condenser, 1.160 MPa, 45 °C</text>
<text class="tx txs" x="508" y="180">compressor</text>
<text class="tx txs" x="70" y="170">expansion valve</text>
<text class="tx txs" x="196" y="290">108</text>
<text class="tx txs" x="450" y="290">256</text>
<text class="tx txs" x="528" y="290">296</text>
```

## Inside the evaporator and condenser

Each heat exchanger does more than one job, and splitting the duties shows where each kilowatt goes.

**Evaporator, 30.0 kW:**

- boiling the liquid part of the mixture, from h₄ to saturated vapour at 251.62 kJ/kg: 0.2029 × 143.35 = **29.08 kW**;
- superheating the vapour by 5 K to 256.13 kJ/kg: 0.2029 × 4.51 = **0.92 kW**.

**Condenser, 38.09 kW:**

- **desuperheating** the discharge vapour from 65.1 °C to the saturated vapour at 45 °C, 273.37 kJ/kg: 0.2029 × 22.62 = **4.59 kW**;
- **condensing** from saturated vapour to saturated liquid, 115.80 kJ/kg: 0.2029 × 157.57 = **31.97 kW**;
- **subcooling** the liquid by 5 K to 108.27 kJ/kg: 0.2029 × 7.53 = **1.53 kW**.

Most of each exchanger's duty is the change of phase, at constant temperature. That is what makes a vapour-compression cycle efficient: heat goes in and out at nearly fixed temperatures close to those of the water and air, which keeps the lift small. The desuperheating duty, 12% of the condenser's, is rejected at temperatures from 65 °C down to 45 °C, which Chapter 8 shows is useful for heat recovery.

```figure
type: stack
title: Where CH-30's 38.09 kW of condenser heat comes from
unit: kW
caption: This is an illustration at the design point. The condensing duty is at a constant 45 °C; the desuperheating duty is available at up to 65 °C.
- Desuperheating, 65 to 45 °C | 4.59
- Condensing at 45 °C | 31.97
- Subcooling, 45 to 40 °C | 1.53
```

## Volume at the compressor

A compressor is a volume machine: each revolution sweeps a fixed volume, and what matters for its size is the volume of vapour it must take in, not the mass. At state 1, R-134a vapour has a density of 15.073 kg/m³, so CH-30's 0.2029 kg/s is:

- 0.2029 ÷ 15.073 = **0.01346 m³/s**, or **48.5 m³/h** of suction vapour.

No compressor takes in its full swept volume. Gas left in the clearance at the end of each stroke re-expands, the incoming vapour is warmed by the hot compressor, and gas leaks back past seals and valves. The ratio of the vapour actually delivered to the swept volume is the **volumetric efficiency**, and it falls as the compression ratio rises. If CH-30's compressor delivered 85% of its swept volume at this condition, as an illustration, it would need a swept volume of about 57 m³/h. The suction density also explains why a chiller's capacity falls as its evaporating temperature falls: colder, lower-pressure vapour is less dense, so the same compressor moves fewer kilograms of refrigerant a second (Chapter 7).

## What the expansion valve controls

The expansion valve does more than drop the pressure. It meters the refrigerant into the evaporator at the rate the evaporator can boil it, and it does that by watching the superheat at the evaporator's outlet.

- A **thermostatic expansion valve** senses the suction line's temperature with a bulb and compares it, through a diaphragm, with the evaporating pressure. If the superheat rises above its setting, meaning the evaporator is short of liquid, it opens; if the superheat falls, it closes.
- An **electronic expansion valve** does the same with a temperature sensor, a pressure transducer and a controller driving a stepper motor, and can hold the superheat more tightly across a wider range of loads.

Holding superheat at a few kelvin keeps liquid out of the compressor, which could damage it, while using as much of the evaporator's surface as possible for boiling, which transfers heat far better than superheating vapour does. CH-30's setting of 5 K is an illustration of a common choice. Too little superheat risks liquid reaching the compressor; too much starves the evaporator and lowers the evaporating temperature, which costs capacity and efficiency (Chapter 7).

## Pressures in everyday units

Service technicians read refrigerant pressures on gauges that show gauge pressure, usually in kilopascals or bar. CH-30's absolute pressures of 0.31462 and 1.1599 MPa are, with a standard atmosphere of 0.101325 MPa, about **213 kPa** gauge on the suction side and **1,059 kPa** gauge on the discharge side. Their ratio, the **compression ratio** in absolute terms, is 1.1599 ÷ 0.31462 = **3.69**. Chapter 4 shows how a technician reads the evaporating and condensing temperatures straight from those pressures.

## Beyond the simple cycle

CH-30 uses the simplest form of the cycle, and most small and medium chillers do. Larger and more demanding plants add refinements, each aimed at one of the losses Chapter 1 listed.

- **Liquid-to-suction heat exchangers** use the cold suction vapour to subcool the liquid further, adding refrigerating effect at the cost of more superheat at the compressor; whether it helps depends on the refrigerant.
- **Economisers** flash part of the liquid at an intermediate pressure and return that vapour partway through compression, reducing the work of compressing flash gas from the lowest pressure.
- **Two-stage compression** with intercooling splits a large lift between two compressors, lowering discharge temperatures and improving efficiency where the lift is large, as in freezing.
- **Cascade systems** use two circuits with different refrigerants for very low temperatures.

Each adds cost and complexity. For CH-30's modest lift, the simple cycle is the right choice, and the four-point calculation above describes it fully.

## The error: two reference states mixed

This is an illustration. A graduate engineer checking CH-30's quoted performance worked the cycle with enthalpies taken from two places: state 1 from a printed pressure–enthalpy chart and states 2, 3 and 4 from NIST's tables. The calculation gave a refrigerating effect of **296.0 kJ/kg**, double the figure above, and a coefficient of performance of **7.43**.

A COP of 7.43 between 2 °C and 45 °C is impossible: Chapter 1's Carnot limit for those temperatures is 6.40. The engineer's supervisor spotted it from that alone, and the cause was soon found. Enthalpy and entropy have no absolute zero for engineering purposes; each data source fixes them by a **reference state**. NIST's tables were in the ASHRAE reference state, with enthalpy zero for saturated liquid at −40 °C. The printed chart used the IIR reference state, with enthalpy 200 kJ/kg for saturated liquid at 0 °C. For R-134a the two differ by a constant 148.14 kJ/kg, and the engineer's h₁ from the chart, 404.27 kJ/kg, was the NIST value plus that constant.

Differences of enthalpy are the same in any reference state, so a cycle can be worked in either, provided every value comes from the same one. The engineer reworked the cycle entirely from NIST and found 3.71, and the team's calculation sheet template now records the source and reference state of every property it uses.

```figure
type: checklist
title: Checks on a refrigeration cycle calculation
caption: The cycle is four enthalpies; most errors are in where they came from. The last line is this chapter's error.
- One property source and one reference state throughout | NIST, ASHRAE reference state
- Energy balance closes | 30 + 8.09 = 38.09 kW
- COP below the Carnot limit for the refrigerant temperatures | 3.71 against 6.40
- Superheat and subcooling stated with the states | 5 K each
- Compressor work from an isentropic efficiency, stated | 0.70
- x Enthalpies from two reference states mixed | COP 7.43, above the Carnot limit
```

## Exercise: less subcooling

If CH-30's condenser provides only **2 K** of subcooling, so the liquid reaches the expansion valve at 43 °C, find the new refrigerating effect, refrigerant flow for 30 kW, compressor power and COP. NIST's saturated liquid enthalpy at 43 °C is **112.77 kJ/kg**; states 1 and 2 are unchanged.

**Worked answer.**

- q = 256.13 − 112.77 = **143.36 kJ/kg**.
- ṁ = 30 ÷ 143.36 = **0.2093 kg/s**, 3.2% more refrigerant.
- Compressor power: 0.2093 × 39.86 = **8.34 kW**.
- COP = 143.36 ÷ 39.86 = **3.60**.

Losing 3 K of subcooling costs 3% of the COP, because each kilogram of refrigerant arrives at the evaporator with more of its liquid already flashed to vapour. Chapter 5 explains the flash gas.
