---
book: cryogenic-design-by-the-numbers
chapterSlug: radiation-and-multilayer-insulation
order: 7
title: "Radiation and multilayer insulation"
description: "Radiation from a warm vessel onto a cold mass, effective emissivity, the radiant heat tool for cold surfaces, multilayer insulation by CERN’s formula, and a quick test without it."
draft: false
---

A vacuum stops convection and gas conduction, but it does nothing to stop radiation. Every surface of CT-40's warm vacuum vessel radiates heat across the vacuum onto the cold mass, and at room temperature a black surface radiates about 420 W/m². Even with clean metal surfaces, which radiate and absorb only a small fraction of that, the radiation onto CT-40's cold mass would be about half of the cooler's capacity at 40 K. Radiation is the heat leak that needs the most careful treatment, and multilayer insulation is the tool that tames it.

This chapter calculates the radiation from CT-40's vessel onto its cold mass with bare surfaces, using the effective emissivity of two enclosed surfaces and the KEVOS® radiant heat tool, explains multilayer insulation with the engineering formula that CERN derived from tests on the Large Hadron Collider's cryostats, sets out the practical rules for installing it, and ends with a cooldown run without it.

## Radiation between a warm vessel and a cold mass

The Stefan–Boltzmann law gives the power radiated by a surface as its emissivity times σT⁴, with σ = 5.670 × 10⁻⁸ W/(m²·K⁴). A black surface at 293.15 K radiates 418.8 W/m²; at 40 K, only 0.145 W/m². In a cryostat, the cold surface's own emission is negligible, and the heat leak is essentially the warm vessel's radiation that the cold mass absorbs.

For two surfaces, one enclosing the other, with diffuse grey surfaces, the net exchange depends on both emissivities and on the ratio of their areas:

```figure
type: formula
title: Radiation between an enclosed cold surface and its enclosure
formula: Q = ε_eff × σ × A₁ × (T₂⁴ − T₁⁴)
formula: ε_eff = 1 ÷ [1 ÷ ε₁ + (A₁ ÷ A₂) × (1 ÷ ε₂ − 1)]
caption: Diffuse grey surfaces; A₁ and ε₁ for the inner, cold surface; A₂ and ε₂ for the enclosing, warm surface. When A₁ is much smaller than A₂, ε_eff approaches ε₁: the cold surface's own emissivity dominates.
- σ | 5.670 × 10⁻⁸ W/(m²·K⁴)
- T₂, T₁ | warm and cold absolute temperatures
- A₁ ÷ A₂ | 0.35 ÷ 1.005 = 0.348 for CT-40
```

Emissivity depends on the material, its finish and its cleanliness, and for metals it falls as the temperature falls. Parma's survey of cryostat design gives tables and a worked example; this chapter uses the values in that example, 0.12 for a cold mass and 0.2 for a stainless steel vacuum vessel, as reasonable values for clean but not specially polished surfaces.

Why a metal's emissivity falls as it cools is another consequence of its electrons. A metal reflects infrared radiation because its conduction electrons respond to the wave's electric field and re-radiate it; the small part that is absorbed, which is the emissivity, depends on how strongly the electrons are scattered while they respond. Classical theory makes the absorption grow with the square root of the electrical resistivity, so as a pure metal cools and its resistivity falls, it reflects better. At very low temperatures in very pure metals the electrons travel further between collisions than the depth the wave penetrates, a regime known as the anomalous skin effect, and the emissivity stops falling as fast as the simple theory predicts. For design, the measured values in tables like Parma's are what count, taken for the finish the part will actually have.

This is an illustration. CT-40's cold mass has 0.35 m² of outer surface at 40 K inside the vessel's 1.005 m² at 293.15 K. With ε₁ = 0.12 and ε₂ = 0.2, the effective emissivity is 1 ÷ (8.333 + 0.348 × 4) = **0.1028**.

The [radiant heat tool](/tools/radiant-heat/) calculates the net radiant exchange between a surface and large surroundings, Q = ε σ A (T_s⁴ − T_a⁴), from the surface's area and emissivity and the two temperatures, and gives an equivalent radiation coefficient; a surface colder than its surroundings shows a negative result, heat gained. It treats the surroundings as large and black, so for an enclosed pair the right input is the effective emissivity, not the cold surface's own.

```figure
type: stats
title: Radiation onto CT-40's bare cold mass from the radiant heat tool
caption: This is an illustration. Inputs: 0.35 m², emissivity 0.1028 (the effective value for the enclosed pair), surface −233.15 °C, surroundings 20 °C.
- * −15.06 W | Net radiant exchange | 15.1 W gained by the cold mass
- −43.0 W/m² | Heat flux | 0.1028 × (418.8 − 0.145)
- 0.17 W/(m²·K) | Equivalent radiation coefficient | small, but over 253 K
```

Fifteen watts is half the cooler's 30 W at 40 K. Bare surfaces are not acceptable, even clean ones, and the rest of this chapter is about how to do better.

## How surface condition changes it

The cold surface's emissivity dominates the result, so its condition matters most. Fingerprints, oxide, adhesive tape, paint and oil all raise emissivity towards that of a non-metal, close to one at long infrared wavelengths. Parma's survey adds a trap: aluminised polyester tapes that look shiny, with the aluminium under a transparent polyester layer, behave almost like black bodies, because the polyester absorbs the infrared before it reaches the metal.

```figure
type: bars
title: Radiation onto CT-40's bare cold mass by surface condition
unit: W
max: 50
caption: This is an illustration. Enclosed-surface formula with the vessel at ε = 0.2 unless stated; 0.35 m² at 40 K inside 1.005 m² at 293.15 K.
- Cold mass dirty or tarnished, ε 0.6 | 47.9
- * Clean cold mass, ε 0.12 | 15.1
- Clean cold mass, vessel polished to ε 0.1 | 12.8
- Polished cold mass, ε 0.06 | 8.1
```

Polishing helps, but even a well-polished cold mass leaks 8 W. Radiation has to be stopped by something more than a good finish.

## Multilayer insulation

Multilayer insulation, or MLI, is a blanket of many thin reflective layers, usually polyester or polyimide film aluminised on both sides, separated by a light netting or paper spacer so that the layers touch as little as possible. Each layer floats at an intermediate temperature and acts as a radiation shield. In the ideal case, N perfectly reflecting, non-touching layers reduce radiation by a factor of N + 1. In practice the layers do touch, through the spacers and wherever the blanket is compressed, so some heat is also conducted through the stack.

Parma's survey gives the engineering model CERN uses, with a radiation term and a solid conduction term, each divided by the number of layers plus one, and coefficients fitted to tests of the LHC's thermal shield blankets:

```figure
type: formula
title: Engineering model of heat flux through multilayer insulation
formula: q = [β ÷ (N + 1)] × (T₂⁴ − T₁⁴) + [α ÷ (N + 1)] × [(T₂ + T₁) ÷ 2] × (T₂ − T₁)
formula: β = 3.741 × 10⁻⁹ W/(m²·K⁴), α = 1.401 × 10⁻⁴ W/(m²·K²)
caption: From Parma (CERN Accelerator School, 2014), for the LHC thermal shield MLI. The coefficients belong to that blanket design and installation; other blankets differ and should be tested. The same source reports about 1 W/m² measured for 30 layers between 300 K and 50 K in the installed machine.
- N | number of reflective layers
- T₂, T₁ | warm and cold boundary temperatures, K
- First term | radiation through the stack
- Second term | solid conduction through spacers and contacts
```

Checked against the reported result, the formula gives 1.17 W/m² for 30 layers between 300 K and 50 K, consistent with the measured figure of about 1 W/m². For CT-40, with ten layers between 293.15 K and 40 K, it gives **3.05 W/m²**, of which 2.51 W/m² is radiation and 0.54 W/m² conduction. Over 0.35 m², that is **1.07 W**, a fourteenth of the bare figure. Expressed as an emissivity, ten layers behave like a surface with ε_eff = 3.05 ÷ 418.7 = 0.0073.

```figure
type: compare
title: Radiation onto CT-40's cold mass with multilayer insulation, 293 K to 40 K
cols: Heat flux | Heat leak over 0.35 m² | Share of the cooler's 30 W
caption: This is an illustration. Parma's engineering formula with the LHC coefficients, applied outside the conditions they were fitted to; CT-40's laboratory checked the result by the cooler's balance (Chapter 9).
- Bare, clean surfaces | 43.0 W/m² | 15.06 W | 50%
- 5 layers | 5.59 W/m² | 1.96 W | 6.5%
- * 10 layers (CT-40) | 3.05 W/m² | 1.07 W | 3.6%
- 20 layers | 1.60 W/m² | 0.56 W | 1.9%
- 30 layers | 1.08 W/m² | 0.38 W | 1.3%
```

The returns diminish quickly. The first ten layers remove 93% of the bare radiation; the next twenty remove another 4%. CT-40 uses ten because its cold mass is small and its other heat leaks, especially the current leads in Chapter 8, are much larger.

## Installing MLI

MLI's performance depends heavily on how it is installed, and Parma's survey gives the rules learned on the LHC:

```figure
type: checklist
title: MLI installation rules from CERN's experience, applied to CT-40
caption: After Parma (CERN Accelerator School, 2014). The open item is the one CT-40's laboratory found hardest to keep.
- x Packing density near the optimum | 15 to 25 layers per centimetre; compressed blankets conduct more
- x A gap of at least a few centimetres between the warm wall and the outermost layer | blankets must not touch the vessel
- x Blankets cut and seamed to allow for the larger circumference of outer layers | no tension that compresses the stack
- x Contraction of blanket and support allowed for | blankets must not tighten as they cool
- ? Penetrations for supports, leads and wiring kept small and overlapped | every gap is a black-body hole
```

Penetrations deserve their own mention. Every support, lead and wire must pass through the blanket, and each hole lets radiation straight through to the cold mass. A hole of 1 cm² in the blanket, seeing the warm vessel, admits roughly the effective emissivity of the cold surface beneath it times 418.8 W/m² × 10⁻⁴ m², a few milliwatts each, but a blanket with dozens of loose openings, or one that has slipped to expose a strip of the plate, can lose a large part of its benefit. CT-40's blankets are made as overlapping pieces, tied with thread rather than taped, with each penetration covered by a small collar of MLI.

## Shields: cooled and floating

Most larger cryostats add a radiation shield between the vessel and the cold mass: a metal enclosure, usually of high-conductivity aluminium or copper, cooled by the first stage of a two-stage cryocooler or by liquid nitrogen to somewhere between 40 and 80 K. The cold mass then sees the shield instead of the warm vessel. Because radiation goes as the fourth power of temperature, a shield at 77 K radiates (77 ÷ 293)⁴ = 0.5% as much per unit area as the vessel, and the radiation onto the cold mass almost disappears; the shield's own load, which is large, is taken at a temperature where cooling is cheaper. The shield is itself wrapped in MLI, as on the LHC, where Parma's survey reports about 1 W/m² onto the shield through 30 layers.

CT-40 has a single-stage cooler, so it has no cooled shield. An uncooled, floating shield still helps a little. A thin aluminium enclosure hung between the vessel and the cold mass, touching neither, settles at the temperature where the radiation it receives from the vessel equals what it passes to the cold mass. With equal effective emissivities on both sides, its temperature is the fourth root of the mean of the two fourth powers, (293.15⁴ + 40⁴) ÷ 2, giving about 246 K, and the radiation onto the cold mass is halved. That is the N = 1 case of the multilayer formula's ideal limit, and it shows why MLI works: each additional floating layer divides the radiation again.

## Windows, ports and holes

Any opening in the insulation through which the cold mass can see a warm surface is a direct radiation path. A viewing window is the worst case: glass and most window materials are nearly black in the infrared at room temperature, so a window behaves like a small black-body source. This is an illustration. A 50 mm window looking straight at CT-40's clean cold plate, with an effective emissivity of about 0.12 for the pair, would add about 1.96 × 10⁻³ m² × 418.8 W/m² × 0.12 = 0.1 W, where the same patch of MLI would pass about 0.006 W. That is small for one window, but large cryostats with many ports and penetrations add up such paths with care, and fit cold baffles or infrared-blocking filters in front of windows where the load matters.

Pumping ports and instrument tubes are similar holes. A pumping line that looks straight at the cold mass radiates down its bore; a bend in the line, or a small baffle at its inner end, blocks the line of sight while barely affecting the pumping.

## Checking radiation in commissioning

The radiation load cannot be measured on its own in an assembled cryostat, but it can be checked by difference. CT-40's laboratory, during commissioning, measured the cooler's balance temperature with the leads unpowered, then with an extra, known heater power on the plate, which calibrated the cooler's curve in place. The difference between the total load inferred from the balance and the sum of the calculated conduction paths is the radiation plus anything forgotten. On CT-40, once the corrected support figure and the push rod of Chapter 5 had been accounted for, that difference was about 0.7 W more than the calculated 1.07 W. It was traced to penetrations in the blanket left without collars; once they were collared, the difference fell to about 0.2 W, which is about as close as such a check gets. Chapter 9 tells the whole commissioning story.

## The error: a quick test without the blanket

This is an illustration. Eager to check a new coil before a deadline, the laboratory ran a cooldown with the MLI blankets left off, reasoning that the clean copper plate would radiate little. The plate settled at about 46 K with the leads at 100 A, too warm for the test.

The calculation explains it. Without MLI, the radiation is 15.06 W instead of 1.07 W, raising the total load from 10.58 W to 24.57 W. On the cooler's curve, the cold stage then settles at 25 + 24.57 ÷ 2 = 37.3 K; the strap's drop at that load, from NIST's integral, is 7.2 K, and the joints add 2.0 K, putting the plate at about **46.5 K**. The extra 14 W also roughly doubled the strap's temperature difference, because the strap carries every watt.

The engineer found the cause by working the budget with and without the blanket before the next attempt, which is how the laboratory now plans any change to the cold end: a change to one heat leak moves the plate temperature through the cooler's curve, the strap and the joints together. The blankets went back on, and the plate returned to 33.6 K.

## Exercise: twenty layers

The laboratory considers replacing CT-40's ten-layer blankets with twenty-layer ones, which fit in the available space at the right packing density. Using the formula and coefficients above, find the new heat flux and heat leak, the change in total load, and the new plate temperature, given that the cold stage sits at 25 + Q ÷ 2 kelvins for a load of Q watts and that the strap and joints add 3.17 K at the new load.

**Worked answer.** This is an illustration. With N = 20, the radiation term is 3.741 × 10⁻⁹ ÷ 21 × (293.15⁴ − 40⁴) = 1.315 W/m² and the conduction term 1.401 × 10⁻⁴ ÷ 21 × 166.6 × 253.15 = 0.281 W/m², a total of **1.60 W/m²**, or **0.56 W** over 0.35 m². The total load falls from 10.58 W to 10.58 − 1.07 + 0.56 = **10.07 W**. The cold stage settles at 25 + 10.07 ÷ 2 = 30.04 K, and the plate at 30.04 + 3.17 = **33.2 K**, about 0.4 K colder than with ten layers. The saving is real but small, because radiation is already a small part of CT-40's budget; the leads, in Chapter 8, are where the larger gains are.
