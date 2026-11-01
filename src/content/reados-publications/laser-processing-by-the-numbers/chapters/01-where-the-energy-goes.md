---
book: laser-processing-by-the-numbers
chapterSlug: where-a-lasers-energy-goes
order: 1
title: "Where a laser's energy goes"
description: "How a laser's power is lost between the wall socket and the melt: conversion, optics, reflection, absorption in a thin surface layer, kerf reflections and checking power with a puck."
draft: false
---

A laser cutting machine is sold by its output power, but the number that cuts the metal is much smaller. Electrical power becomes light with an efficiency of about a third. The optics lose a few per cent. At the metal, most of the light that arrives is reflected rather than absorbed, and of the power that is absorbed, much flows into the surrounding metal as heat instead of melting the kerf. A planner who follows the energy from the wall socket to the melt can explain why a 4 kW laser cuts copper badly, why a dirty window slows every job, and why the chiller is nearly as big as the laser.

This chapter follows that chain through the LC-4 cell, sets out the physics of absorption that the next three chapters build on, and shows how the cell checks the power it actually delivers. Its mistake is a power loss that crept up over a month before anyone measured it.

## The LC-4 cell and its jobs

The fabricator's laser cell does four kinds of work, on five materials. Before following the energy, it is worth listing what each machine does and which chapter deals with it.

```figure
type: compare
title: The laser cell's machines and jobs
cols: Machine | Main jobs | Chapters
rowhead: Machine
- LC-4, 4 kW fibre, 1.07 µm | Cutting | 1.5 mm stainless doors, 6 mm brackets, 3 mm aluminium panels, 3 mm copper busbar links | 1 to 7
- LC-2, 2 kW CO₂, 10.6 µm | Cutting | Acrylic signs, thin mild steel | 2, 3
- W-2, 2 kW fibre on a robot | Welding | Stainless boxes, some steel brackets | 8
- M-20, 20 W pulsed fibre | Marking | Nameplates, two-dimensional codes | 9
- Whole cell | Support | Gases, fume extraction, chillers, guarding, costs | 7, 10
caption: This is an illustration. The cell's register of laser work. Every number in the book is calculated for one of these jobs.
```

## From the wall socket to the melt

The LC-4 draws about 12.5 kW of electrical power from its supply when it is delivering its rated 4.0 kW of light. That ratio, 4.0 ÷ 12.5 = 0.32, is the wall-plug efficiency of the laser source and its power supply; fibre lasers are among the most efficient industrial lasers, and CO₂ lasers are lower. The other 8.5 kW becomes heat inside the source and must be carried away by the chiller, which Chapter 10 sizes.

The light travels through a delivery fibre to the cutting head, where a collimating lens, a focusing lens and a protective window bring it to a focus just above or inside the sheet. Each surface loses a little. The cell's commissioning records show 3.86 kW measured below the protective window, 96.5% of the source power. That is the power at the work.

At the work, the light meets metal, and here the largest loss occurs. A flat, clean steel surface absorbs perhaps a third of the light at this wavelength and reflects the rest; Chapter 2 explains why and how the share changes. In a cut, the beam meets the sloping front of the kerf and its reflections strike the kerf walls again, so the total absorbed is higher than a flat surface suggests. Of what is absorbed, only part goes into melting the metal that is blown out of the kerf. The rest conducts into the sheet, or leaves as overheated melt and radiation.

```figure
type: bars
title: The LC-4's power, from the supply to the melt, cutting 1.5 mm stainless steel at 24 m/min
x: Stage
y: Power, kW
caption: This is an illustration. Electrical input 12.5 kW; laser output 4.0 kW; at the work 3.86 kW; absorbed in the kerf 2.80 kW with three reflections at an assumed absorptivity of 0.35; power that heats and melts the kerf volume 0.93 kW (Chapter 6). The melting power is about 7.5% of the electrical input.
- Electrical input | 12.5
- Laser output | 4.0
- At the work, below the window | 3.86
- Absorbed in the kerf | 2.80
- * Heats and melts the kerf | 0.93
```

The last bar is calculated in Chapter 6 from the volume of metal removed each second and the energy needed to heat it to its melting point and melt it. It means that about a third of the absorbed power does the useful work; the rest is conducted away or carried off as superheated melt. Those proportions explain much of what follows. Anything that lowers the absorbed share, such as a reflective metal, slows the cut far more than its percentage suggests, because the losses to conduction do not fall in proportion. Anything that raises the absorbed share, such as the extra heat from burning iron in oxygen in Chapter 7, speeds it up.

## Reflected, absorbed or transmitted

When light meets a surface, each part of it is reflected, absorbed or transmitted. The three shares add to one. For a metal more than a fraction of a micrometre thick, nothing is transmitted, so the absorbed share, the absorptivity A, is simply one minus the reflectivity R.

```figure
type: formula
title: The energy balance at a surface and the optical penetration depth
formula: A + R + T = 1;  for an opaque metal, A = 1 − R
formula: I(z) = I₀ e^(−αz),  α = 4πk ÷ λ
formula: Optical penetration depth = 1 ÷ α = λ ÷ (4πk)
caption: A is absorptivity, R reflectivity and T transmissivity, as shares of the incident power. Inside the metal the intensity I falls exponentially with depth z. k is the extinction coefficient, the imaginary part of the metal's complex refractive index, and λ the wavelength in vacuum.
- α | absorption coefficient, 1/m
- k | extinction coefficient, dimensionless
- λ | wavelength, m
```

The penetration depth is extraordinarily small. A metal's extinction coefficient at near-infrared wavelengths is several units. Taking k = 4.0 as an assumed value for steel at the LC-4's 1.07 µm wavelength, the absorption coefficient is 4π × 4.0 ÷ 1.07 × 10⁻⁶ m = 4.70 × 10⁷ per metre, so the light's intensity falls by a factor of e, to 37%, in 1 ÷ 4.70 × 10⁷ = 21 nm. Within about a tenth of a micrometre, practically all of the absorbed light has become heat.

Heat, by contrast, spreads by conduction at a rate set by the thermal diffusivity, which for mild steel is about 1.36 × 10⁻⁵ m²/s (thermal conductivity 50 W/(m·K) divided by density 7,850 kg/m³ and specific heat 470 J/(kg·K)). In one microsecond, heat spreads a distance of the order of √(1.36 × 10⁻⁵ × 10⁻⁶) = 3.7 µm, about 170 times the optical penetration depth. Even in the shortest pulses most machines use, the laser is a surface heat source: it deposits energy in a skin a few tens of nanometres thick, and conduction does the rest. Chapters 2 and 5 use this to calculate how hot a surface gets.

This also explains why the surface matters so much. A film of oxide, paint, oil or rust a micrometre thick is far thicker than the layer in which light is absorbed, so it changes the absorptivity completely. A mill-scaled steel plate absorbs more than a bright one; a polished copper bar absorbs less than an oxidised one. Real cutting charts are written for the surfaces the maker tested, and a different surface condition is one of the first suspects when a cut that used to work stops working.

### The kerf as a light trap

In a cut, the beam does not meet a flat surface once. It strikes the steep cutting front, and much of the reflected light goes deeper into the kerf, where it meets the front or the walls again. If each strike absorbs the same share A, the share absorbed after n strikes is 1 − (1 − A)ⁿ.

```figure
type: bars
title: Share of the beam absorbed after repeated reflections in the kerf, absorptivity 0.35 per strike
x: Number of strikes
y: Share absorbed, %
caption: This is an illustration. 1 − (1 − 0.35)ⁿ. Two strikes absorb 57.8%; three, 72.5%; four, 82.1%. The LC-4 planning figures assume three, giving 2.80 kW absorbed of 3.86 kW at the work.
- 1 | 35.0
- 2 | 57.8
- * 3 | 72.5
- 4 | 82.1
```

This is why the share absorbed in a deep, narrow kerf is much higher than the absorptivity of a flat surface, and why thick sections are cut more efficiently than a flat-surface calculation suggests. It also explains a common surprise: piercing, when the beam first meets a flat surface, takes far longer than cutting the same thickness, and on reflective metals the pierce is where most failures happen. Once a hole and a kerf exist, the light is trapped.

## Checking the power the cell actually delivers

None of these numbers matters if the power at the work is not what the planner thinks. Laser sources are monitored internally, but the internal monitor measures light inside the source, not below a protective window that may be spattered. The only way to know the power at the work is to measure it there.

The LC-4's maintenance routine uses a calorimetric power meter, a power puck: an aluminium block with a black absorbing face and a built-in thermometer. The beam is defocused onto the face for a set time, and the temperature rise gives the energy absorbed. Because the block is massive and the exposure short, little heat is lost during the measurement, and the power is the energy divided by the time.

```figure
type: formula
title: Laser power from a calorimetric power puck
formula: P = m c ΔT ÷ t
caption: m is the mass of the absorbing block, c its specific heat, ΔT its temperature rise and t the exposure time. Heat lost from the block during and after the exposure makes the result low, so the reading is taken as soon as the temperature peaks.
- P | power absorbed by the puck, W
- m | block mass, kg
- c | specific heat, J/(kg·K)
- ΔT | temperature rise, K
- t | exposure time, s
```

At commissioning, the cell measured 3.86 kW below the protective window. The routine calls for the same measurement on the first Monday of each month.

### The mistake: a month of slow cutting

For three weeks, the operators noticed that 1.5 mm stainless steel doors were leaving more dross on their bottom edges, and they compensated by dropping the cutting speed from 24 to 22 m/min. Nobody connected it to the laser. The monthly power check then gave a temperature rise of 10.06 K on the 0.80 kg puck (specific heat 900 J/(kg·K)) for a 2.0 s exposure:

P = 0.80 × 900 × 10.06 ÷ 2.0 = 3,622 W

That is 6.2% below the 3.86 kW commissioning figure. The source's own monitor still showed 4.0 kW, so the loss was between the source and the work. Inspection found a fine film of spatter on the protective window, the cheap disposable glass below the focusing lens that is meant to catch exactly that. The window absorbed some of the light, heated, and, as Chapter 4 shows, a hot window also shifts the focus.

```figure
type: steps
title: How the cell found and fixed the power loss
caption: This is an illustration. The daily window check takes about a minute and is now recorded on the shift sheet.
- Symptom | More dross on 1.5 mm stainless doors; operators lowered speed from 24 to 22 m/min
- Measurement | Power puck: 0.80 kg × 900 J/(kg·K) × 10.06 K ÷ 2.0 s = 3,622 W
- * Comparison | 6.2% below the 3,860 W commissioning value; source monitor unchanged at 4.0 kW
- Cause | Spatter film on the protective window below the focusing lens
- Correction | Window replaced; power re-measured at 3,860 W; speed restored to 24 m/min
- Prevention | Window inspected at each shift start; power puck weekly instead of monthly
```

Two lessons carried into the rest of the cell's practice. First, a slow loss of power is easy to hide by small adjustments, and every adjustment hides it further. A measured number on a fixed schedule is the only defence. Second, the operators' change was not harmless: slowing the cut put more heat into the edges of every door, which Chapter 5 shows is what hardens cut edges in steel.

## What the energy chain tells a planner

Following the energy through the cell gives several working rules that later chapters make precise.

The absorbed power, not the rated power, sets the cutting speed. A process that loses half its absorbed power to a reflective surface loses more than half its speed, because conduction losses do not fall with it. Reflective metals such as copper and aluminium need either more power, a shorter wavelength that they absorb better, or help from an exothermic reaction.

Heat is deposited at the surface and must be conducted into the metal. That limits how fast a deep section can be heated and sets the width of the heat-affected zone. Short interaction times give narrow heat-affected zones but need high power densities.

The geometry of the cut changes absorption. The kerf traps light, and the angle at which the beam meets the cutting front, treated in Chapter 3, changes the absorptivity of each strike.

The power at the work must be measured, not assumed. The internal monitor of a laser source tells the operator about the source, not about the optics or the window.

Finally, every one of these numbers sits inside a Class 4 laser enclosure. The power that is reflected, about 1 kW on the stainless cut above, does not disappear: it is scattered inside the machine and absorbed by its walls, which is why laser machines are fully enclosed and interlocked, and why the duty to manage the risks of plant in Safe Work Australia's model Code of Practice applies to them as it does to any other machine. Chapter 10 deals with guarding, fume and the cell's other hazards.

### Energy per millimetre of cut

A useful way to compare settings is the energy delivered per unit length of cut: the power at the work divided by the cutting speed. At 3.86 kW and 24 m/min, which is 400 mm/s, the LC-4 delivers 3,860 ÷ 400 = 9.65 J for every millimetre of door edge. When the operators slowed to 22 m/min (367 mm/s) with only 3.62 kW reaching the work, the figure was 3,622 ÷ 367 = 9.88 J/mm, almost the same. Without knowing it, they had restored the energy per millimetre by slowing down, which is why the cut looked acceptable again. The number is a quick check when comparing two machines, two powers or two speeds on the same material and thickness.

### Where the remaining power goes

Of the 3.86 kW at the work in the stainless steel cut, about 1.06 kW is reflected out of the kerf and absorbed by the machine's enclosure, the slats of the cutting table and the spatter shield. About 0.93 kW heats and melts the metal that leaves the kerf. The remaining 1.87 kW is conducted into the sheet beside the kerf, superheats the melt above its melting point and is radiated from the hot front. The conducted share is what produces the heat-affected zone, warms small parts enough to distort them and, on thin sheet, makes closely spaced cuts slow down to avoid burning corners. Planning software that cuts the parts of a nest in an order that spreads the heat is managing this share.

## Exercise: checking the welding laser

The W-2 welding cell's 2 kW fibre laser is checked with a different puck: a 0.60 kg copper block with a specific heat of 385 J/(kg·K). A 3.0 s exposure raises its temperature by 24.9 K. What power reached the puck, and what share of the rated 2 kW is that? If heat lost from the block during the exposure is ignored, is the true power higher or lower than the result?

### Answer

The power is P = m c ΔT ÷ t = 0.60 × 385 × 24.9 ÷ 3.0 = 1,917 W, which is 1,917 ÷ 2,000 = 95.9% of the rated power. That is close to the 96.5% the LC-4 delivers through similar optics, so the W-2's optics and window are in order.

Heat lost from the block by convection and radiation during the exposure is not counted in the temperature rise, so the calculated power is lower than the power that actually arrived. The true power is slightly higher than 1,917 W. Reading the temperature as soon as it peaks keeps that error small, and recording the result against the same puck and exposure each time makes any drift visible even if the absolute error is not zero.
