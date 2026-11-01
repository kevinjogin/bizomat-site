---
book: rooftop-solar-for-factories-by-the-numbers
chapterSlug: the-solar-cell-as-a-diode
order: 2
title: "The solar cell as a diode"
description: "How a p–n junction separates light-generated carriers, how recombination sets the voltage, and how to read a module's IV curve, fill factor and resistances to find faults."
draft: false
---

Absorbing a photon makes an electron and a hole, but that alone produces no power. Left to themselves, the pair would wander for a while and recombine, returning their energy to the crystal as heat. A solar cell is built so that the electron goes one way and the hole the other before that happens, and the result is a current that flows through an outside circuit. The structure that does this is a p–n junction, the same structure as an ordinary diode. Everything a module datasheet says about current, voltage and power follows from treating each cell as an illuminated diode.

This chapter explains how the junction separates carriers, why recombination sets the voltage, and how the current–voltage curve, the fill factor and the series and shunt resistances are read. It fits a simple model to SF-90's module datasheet, and ends with a faulty connector that the string IV test found at commissioning.

## Doping and the junction

Pure silicon has very few free carriers at room temperature: close to 10¹⁰ electrons per cubic centimetre, against about 5 × 10²² atoms. To make it useful, it is doped. Adding a small amount of phosphorus, which has one more outer electron than silicon, gives each phosphorus atom a spare electron that is easily freed into the conduction band; this is n-type silicon, rich in electrons. Adding boron, with one fewer, leaves a missing electron, a hole; this is p-type silicon, rich in holes. A typical cell wafer is doped at about 10¹⁵ to 10¹⁶ atoms per cubic centimetre, one dopant atom in several million silicon atoms.

Where an n-type region meets a p-type region, electrons diffuse from the n side into the p side and holes the other way. The fixed, charged dopant atoms they leave behind build up an electric field across a thin zone at the junction, the depletion region, until the field balances the diffusion. That built-in field is the cell's engine. An electron–hole pair generated near the junction, or one that diffuses to it, is pulled apart by the field: electrons are swept to the n side and holes to the p side. Connected to a load, the separated charges drive a current.

Most light is absorbed well away from the thin depletion region, so most carriers have to reach it by diffusion. The carrier that matters is the minority carrier, the one in short supply on its side: an electron in p-type silicon or a hole in n-type. It survives on average for its lifetime τ before recombining, and in that time diffuses a distance called the diffusion length, L = √(Dτ), where D is its diffusion coefficient. A hole in good n-type wafer silicon, with D about 12 cm²/s and a lifetime of 1 ms, diffuses about 1.1 mm, several times the wafer thickness, so almost every hole generated anywhere in the wafer can reach the junction. An electron in p-type silicon with a lifetime of 10 µs diffuses only about 160 µm, about the wafer thickness, and many are lost. Long lifetime is the first requirement for a good cell.

## Recombination

Recombination is the reverse of generation: an electron falls back into a hole and the energy is lost. It happens in several ways.

- **Radiative recombination** gives the energy out as a photon. In direct-gap materials it is fast and is the basis of light-emitting diodes. In silicon, because the gap is indirect, it is very slow and is not the main loss.
- **Recombination through defects**, called Shockley–Read–Hall recombination, happens at impurities such as iron, crystal defects and grain boundaries, which create energy levels inside the gap that act as stepping stones. It is the main loss in most commercial cells and is why wafer purity matters.
- **Surface recombination** happens at the wafer's surfaces and at metal contacts, where the crystal ends and broken bonds create many such levels. Passivation layers of silicon dioxide, aluminium oxide or silicon nitride, and passivated contacts such as those in TOPCon and heterojunction cells, are mainly there to suppress it.
- **Auger recombination** hands the energy to a third carrier instead of to a photon or a defect. It is intrinsic to silicon and becomes important where carriers are crowded, as in heavily doped regions. It sets the ultimate limit on a silicon cell.

Recombination does not just reduce the current. It sets the voltage. With light on and no current drawn, carriers pile up until they recombine as fast as they are generated; the voltage at which that balance is reached is the open-circuit voltage. The faster carriers recombine, the lower the pile and the lower the voltage. A cell with long lifetimes and well-passivated surfaces reaches a higher voltage from the same light.

## The diode equation

In the dark, a solar cell is a diode. Forward voltage pushes current through it, and the current grows exponentially with voltage because the junction's barrier lowers and carriers cross it in proportion to exp(qV ÷ kT). The constant in front, the saturation current I₀, measures how fast carriers recombine: a large I₀ means rapid recombination and a leaky diode.

In the light, the cell generates a current I_L, proportional to the irradiance, that flows the other way. The current delivered to a load is the light current less what the diode lets back through, less what leaks through any shunt paths. Real cells also have series resistance in their metal fingers, busbars, contacts and the silicon itself.

```figure
type: formula
title: The single-diode model of a module
formula: I = I_L − I₀ [exp((V + I R_s) ÷ (n N_s V_t)) − 1] − (V + I R_s) ÷ R_sh
formula: V_t = kT ÷ q, 25.69 mV at 25 °C
formula: Short circuit (V = 0): I_sc ≈ I_L
formula: Open circuit (I = 0): V_oc ≈ n N_s V_t ln(I_L ÷ I₀ + 1)
formula: Fill factor FF = P_mp ÷ (V_oc × I_sc)
caption: N_s is the number of cells in series, n the ideality factor (1 for an ideal diode, typically 1 to 1.5 for a real module), R_s the series resistance and R_sh the shunt resistance of the whole module. The model describes the module as one equivalent diode.
- I_L | light-generated current, proportional to irradiance, A
- I₀ | diode saturation current, A
- V_t | thermal voltage, V
- R_s, R_sh | series and shunt resistance, Ω
```

Two consequences follow at once. The short-circuit current is proportional to irradiance: half the light, half the current. The open-circuit voltage grows only with the logarithm of irradiance, so it barely changes from full sun to cloud: halving the light lowers it by n N_s V_t ln 2.

## SF-90's module as a diode

SF-90's module carries 108 half-cut cells wired as two halves of 54 cells in series, the halves in parallel. Electrically it behaves like 54 cells in series carrying the full module current. The datasheet gives, at standard test conditions:

- maximum power 420 W, with a power tolerance of 0 to +5 W;
- open-circuit voltage 38.2 V and short-circuit current 14.00 A;
- voltage and current at maximum power 31.9 V and 13.17 A.

The open-circuit voltage per cell is 38.2 ÷ 54 = 0.707 V. The fill factor is 420 ÷ (38.2 × 14.00) = 0.785.

A single-diode model with an ideality factor of 1.2, a series resistance of 0.105 Ω and a shunt resistance of 400 Ω for the whole module reproduces those figures. With 54 cells, n N_s V_t = 1.2 × 54 × 0.02569 = 1.665 V. Matching the open-circuit voltage then fixes the saturation current at about 1.5 × 10⁻⁹ A, which looks tiny but sets everything: ln(14.0 ÷ 1.5 × 10⁻⁹) = 22.95, and 1.665 × 22.95 = 38.2 V. Solving the model point by point gives a maximum power of 420.8 W at 31.9 V and 13.2 A, within the module's power tolerance, and a fill factor of 0.787.

```figure
type: line
title: SF-90 module current against voltage at 1,000 W/m² and 25 °C, single-diode model
x: Module voltage, V
y: Module current, A
caption: This is an illustration. n = 1.2, R_s = 0.105 Ω, R_sh = 400 Ω, 54 cells in series. The current stays close to 14 A until the diode starts to conduct above about 28 V, then falls steeply to zero at 38.2 V. Power peaks at 420.8 W near 31.9 V.
series: Current
- 0 | 14.00
- 10 | 13.97
- 20 | 13.95
- 25 | 13.92
- 28 | 13.85
- 30 | 13.68
- 32 | 13.15
- 34 | 11.59
- 36 | 7.83
- 38 | 0.87
```

The shape of the curve is the diode's signature. On the flat part, from short circuit up to about 28 V, almost all the light current reaches the load and the module behaves like a current source. Near open circuit the diode takes over and the curve drops like a cliff; there the module behaves like a voltage source. The maximum power point sits on the shoulder between them. An inverter's maximum power point tracker hunts for that shoulder continuously, because it moves with irradiance and temperature.

```figure
type: compare
title: Key points on the SF-90 module curve at standard test conditions
cols: Voltage | Current | Power | What it shows
rowhead: Point
- Short circuit | 0 V | 14.00 A | 0 W | Light current; proportional to irradiance
- On the flat | 25 V | 13.92 A | 348 W | Current source region; shunt leakage only
- * Maximum power | 31.9 V | 13.2 A | 420.8 W | Where the tracker should hold the module
- On the cliff | 36 V | 7.83 A | 282 W | Diode region; series resistance shows here
- Open circuit | 38.2 V | 0 A | 0 W | Set by recombination; logarithmic in irradiance
caption: This is an illustration. Values from the fitted single-diode model, which matches the datasheet within its power tolerance.
```

## What the resistances do

Series resistance tilts the cliff. With no series resistance, the model's fill factor would be 0.821 and its maximum power about 439 W. With 0.105 Ω, the voltage at the operating current is reduced by about 13.2 × 0.105 = 1.4 V, and power falls to 420.8 W. Each extra 0.1 Ω in a module costs about 17 W at full sun, about 4%.

Shunt resistance tilts the flat part. It represents leakage paths around or through the junction: cracks, edge defects, impurities. A good module's shunt resistance is high enough that it hardly matters at full sun. At low light it matters more, because the light current shrinks but the leakage at the operating voltage does not. With 400 Ω, the model's efficiency at 200 W/m² is 92.9% of its efficiency at 1,000 W/m², a typical low-light figure. A module whose shunt resistance had fallen to 40 Ω, as can happen with potential-induced degradation (Chapter 9), would lose much more on cloudy days and in the mornings and evenings.

```figure
type: bars
title: SF-90 module output at 25 °C by irradiance, relative to proportional scaling
x: Irradiance, W/m²
y: Efficiency relative to 1,000 W/m², %
caption: This is an illustration. Single-diode model with R_sh = 400 Ω. At 200 W/m² the module delivers 78.2 W, 92.9% of the 84.2 W that proportional scaling from 420.8 W would give. The open-circuit voltage falls only from 38.2 V to 35.5 V.
- 1,000 | 100.0
- 800 | 99.6
- 600 | 98.7
- 400 | 97.0
- 200 | 92.9
- 100 | 87.4
```

## How cells, modules and strings add up

Cells in series add their voltages and carry the same current; that is why 54 cells at 0.707 V make a 38.2 V module, and 18 modules make a string of about 688 V at open circuit at 25 °C. Strings in parallel add their currents at the same voltage. The weakest cell in a series chain limits the current of the whole chain, which is the root of the shading problem in Chapter 6, and the half-cut layout, two parallel halves of 54 cells, halves each cell's current and so quarters its resistive loss in the ribbons.

A string's curve is the module curve scaled: 18 times the voltage at the same current, giving 7,574 W at about 574 V and 13.2 A at standard conditions. Its series resistance is 18 times the module's, 1.89 Ω, plus the cable and connectors. Any extra resistance in the string's connectors and cables shows up exactly as it would in a cell: a tilted cliff and a lower fill factor.

## The error: a hot connector found by the curve

At commissioning, the installer traced the current–voltage curve of each string with a portable curve tracer, as a full commissioning test under IEC 62446-1 provides for, and translated each curve to standard test conditions using the irradiance and module temperature measured at the time. Eleven strings gave fill factors between 0.785 and 0.788. String 7 gave 0.778, and its maximum power, translated to standard conditions, was 1.1% below the average of the others.

A 1% shortfall could be put down to module tolerance or a measurement error. The commissioning engineer did not accept that, because the fill factor had fallen rather than the current: a low current points to shading, soiling or a low-power module, while a lower fill factor with the same short-circuit current and open-circuit voltage points to added series resistance. The model put a number on it: an extra 0.5 Ω in the string reproduces a fill factor of 0.778 and a maximum power 1.15% below the others.

Half an ohm in a string carrying 13.2 A dissipates 13.2² × 0.5 = 87 W. Spread along a cable that would be harmless; concentrated in one connector it is a fire risk. A thermal imaging camera, walked along string 7 with the array in full sun, found a plug-and-socket connector between two modules at about 95 °C while the others sat near the module temperature. The connector had been made up on site with a crimp tool for a different brand of contact. It was replaced with a matched pair from one manufacturer, crimped with that maker's tool, and the string's fill factor returned to 0.787.

```figure
type: decision
title: Reading a string curve that falls short
caption: This is an illustration. The order the commissioning engineer now uses for any string more than 1% below its neighbours, after translation to standard conditions.
- Short-circuit current low, shape normal | Less light reaching the cells: shading, soiling, a module of a lower power class, or wrong irradiance reference | Check shade and soiling; compare the reference cell's plane and position with the string
- Fill factor low, current and voltage normal | Added series resistance in a connector, cable, fuse or module ribbon | Thermal-image the string in full sun; measure connector resistance; never ignore it
- Open-circuit voltage low by a module's share | A module or bypass diode shorted, or a module missing from the count | Check the string's module count and bypass diodes (Chapter 6)
- Steps or notches in the curve | Partial shading, a failed bypass diode or cracked cells | Inspect the modules; repeat in uniform light
```

## Exercise: the module on a hazy day

On a hazy morning the irradiance on the workshop roof is 500 W/m² and the cells happen to be at 25 °C. Use the module's single-diode figures: I_sc = 14.00 A and V_oc = 38.2 V at 1,000 W/m², and n N_s V_t = 1.665 V.

1. Estimate the short-circuit current and the open-circuit voltage at 500 W/m².
2. The full model gives a maximum power of 206.2 W at 31.4 V and 6.57 A. What is the fill factor, and what is the efficiency relative to standard conditions?
3. A sales sheet claims the module "keeps its voltage in low light, so it makes the same power in cloud". What is wrong with that?

### Worked answer

1. The short-circuit current scales with irradiance: 14.00 × 0.5 = 7.00 A. The open-circuit voltage falls by n N_s V_t ln 2 = 1.665 × 0.693 = 1.15 V, to 38.2 − 1.15 = 37.05 V. The model gives 37.04 V.
2. FF = 206.2 ÷ (37.04 × 7.00) = 0.795. That is slightly higher than at full sun, because the smaller current loses less voltage in the series resistance. Proportional scaling from 420.8 W would give 210.4 W, so the relative efficiency is 206.2 ÷ 210.4 = 98.0%.
3. The voltage does stay high, falling by only about 3%, but power is voltage times current, and the current falls in proportion to the light. At 500 W/m² the module makes about half its rated power, not the same power. What a good module does in low light is lose little efficiency, as here 2%, which depends on its shunt resistance and series resistance.
