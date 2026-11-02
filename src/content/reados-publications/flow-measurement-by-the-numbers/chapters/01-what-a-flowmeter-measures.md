---
book: flow-measurement-by-the-numbers
chapterSlug: what-a-flowmeter-measures
order: 1
title: "What a flowmeter measures"
description: "Volume, mass and standard volume flow and how to convert between them, mean velocity and Reynolds number, why temperature changes a litre, and a hot water recipe that came out 2.6% short."
draft: false
---

A flowmeter's display shows a number and a unit, and both deserve suspicion. The number may be a volume flow at the fluid's actual temperature and pressure, a mass flow, or a volume corrected to some standard conditions, and the unit alone does not always say which. Two meters on the same pipe can disagree by several per cent while both are working perfectly, simply because they measure different quantities. Before any meter is chosen, installed or believed, it is worth being clear about what it measures and what the process actually needs.

This chapter sets out the three kinds of flow, the conversions between them, the mean velocity and Reynolds number that describe how fluid moves through a pipe, and the brewery's five flows in those terms. It finishes with a hot water recipe, measured in litres at 80 °C and written in litres at 20 °C, that put 2.6% less water into every brew than the brewer intended.

## Three kinds of flow

**Volume flow** is the volume passing per unit time at the conditions in the pipe, in litres per minute or cubic metres per hour. Most meters measure it, because most meters respond to the fluid's velocity, and velocity multiplied by the pipe's area is volume flow.

**Mass flow** is the mass passing per unit time, in kilograms per hour or tonnes per hour. It is what a recipe, an energy balance or a stock record usually needs, because mass does not change with temperature or pressure. Coriolis meters measure it directly; other meters infer it by multiplying volume flow by a density.

**Standard volume flow** is the volume the fluid would occupy at agreed reference conditions, such as 0 °C or 15 °C and 1.01325 bar. It is a disguised mass flow, used mostly for gases, because a gas's actual volume changes dramatically with pressure and temperature. Chapter 7 returns to it for compressed air.

```figure
type: formula
title: Relations between the three kinds of flow
formula: Mass flow: ṁ = ρ × Q        Volume flow: Q = v̄ × A
formula: Standard volume flow: Q_std = ṁ ÷ ρ_std = Q × (ρ ÷ ρ_std)
caption: ρ is the density at the meter's conditions and ρ_std the density at the stated standard conditions. A volume flow is meaningful only with the temperature and pressure at which it applies; a standard volume flow only with the standard conditions named.
- ṁ | mass flow, kg/s
- Q | volume flow at actual conditions, m³/s
- v̄ | mean velocity over the pipe's cross-section, m/s
- A | internal cross-sectional area of the pipe, m²
```

## Mean velocity and the pipe's bore

Fluid in a pipe does not move at one speed. It is slowest at the wall, where it is held by friction, and fastest near the centre. The mean velocity, v̄, is the volume flow divided by the internal area, and it is the single number that describes how hard the fluid is moving. The internal bore matters, not the nominal size: a DN50 stainless tube with a 1.5 mm wall has a bore of 47.8 mm, while DN50 schedule 40 carbon steel pipe has a bore of 52.5 mm, and the areas differ by 21%.

The [pipe flow velocity tool](/tools/pipe-flow-velocity/) gives the mean velocity from a flow in litres per minute and a bore in millimetres. The brewery's wort line carries 12 m³/h, or 200 L/min, through a 47.8 mm bore: the tool gives a flow area of 1,794.5 mm² and a mean velocity of 1.858 m/s.

## Reynolds number

Whether the flow is smooth and layered or turbulent and mixed depends on the ratio of the fluid's inertia to its viscosity, expressed as the Reynolds number. It decides the shape of the velocity profile, which every meter depends on, as Chapter 2 explains.

```figure
type: formula
title: Reynolds number in a full pipe
formula: Re = v̄ × D ÷ ν
caption: D is the internal bore and ν the kinematic viscosity, the dynamic viscosity divided by the density. In pipes, flow is laminar below about 2,000 and fully turbulent above about 4,000; most industrial liquid and gas flows are turbulent.
- Re | Reynolds number, dimensionless
- ν | kinematic viscosity, m²/s; 1.14 × 10⁻⁶ for water at 15 °C
```

The [liquid pipe velocity and Reynolds number tool](/tools/pipe-flow/) calculates both together. For the mains water through FT-101, 30 m³/h, or 500 L/min, in an 80.0 mm bore with water at 15 °C and a kinematic viscosity of 1.14 mm²/s, it gives a mean velocity of 1.658 m/s and a Reynolds number of 116,000, well into turbulent flow.

```figure
type: compare
title: The brewery's five flows at their normal rates
cols: Bore | Normal flow | Mean velocity | Reynolds number | Meter measures
rowhead: Meter
- FT-101 mains water, 15 °C | 80.0 mm | 30 m³/h | 1.66 m/s | 116,000 | volume at line conditions
- FT-201 wort, 18 °C, SG 1.048 | 47.8 mm | 12 m³/h | 1.86 m/s | about 55,000 | mass, and density
- FT-301 hot liquor, 80 °C | 62.7 mm | 15 m³/h | 1.35 m/s | about 230,000 | volume at 80 °C, from a pressure difference
- FT-401 compressed air, 7 bar gauge | 52.5 mm | about 4 m³/min free air | see Chapter 7 | high | volume at line conditions, corrected to standard
- FT-501 glycol, 30% by mass, about −2 °C | 102.3 mm nominal | see Chapter 6 | — | lower, owing to viscosity | volume at line conditions
caption: This is an illustration. Kinematic viscosities: water 1.14 mm²/s at 15 °C and 0.365 mm²/s at 80 °C; wort about 1.6 mm²/s. Glycol and air are worked in Chapters 6 and 7.
```

## Density and temperature

Converting between volume and mass needs the density at the meter's conditions, and for liquids the important variable is temperature. Water's density is 998.2 kg/m³ at 20 °C and 971.8 kg/m³ at 80 °C, 2.6% less. A litre of water at 80 °C contains 2.6% less water than a litre at 20 °C.

Wort is denser than water, because it carries dissolved sugars. Brewers express its strength as specific gravity, the ratio of its density to water's, or in degrees Plato, the mass percentage of extract. The [density and specific gravity converter](/tools/density-converter/) converts a specific gravity of 1.048 to 1,048.0 kg/m³, taking water at its maximum density as the reference. The wort line's 12 m³/h is therefore 12 × 1,048 = 12,576 kg/h, the figure the brewer's extract and yield calculations need.

Brewers often convert specific gravity to degrees Plato with the approximation °P ≈ 259 − 259 ÷ SG, which gives 259 − 259 ÷ 1.048 = 11.9 °P for the brewery's wort, close to the 12 °P its recipe targets. The approximation is good enough for the brewhouse; the extract tables of the brewing industry, or the Coriolis meter's own conversion, should be used where a gravity is reported. Either way, the gravity is a property measured at a stated temperature, usually 20 °C, and a hot wort's density must be corrected before it is converted.

### Liquids are slightly compressible

For liquids, pressure barely matters. Water's volume falls by about 0.05% for every 10 bar, so a line pressure of a few bar changes a volume reading by a few hundredths of a per cent, less than any process meter's uncertainty. Gases are a different matter, because their volume is inversely proportional to absolute pressure, and Chapter 7 deals with them.

## Full pipes, one phase

Every meter in this book assumes that the pipe is full of a single fluid. A liquid line that runs partly empty, at a high point or downstream of a valve that drains it, presents the meter with a smaller area of moving liquid than it assumes, and velocity-based meters read high or erratically. Bubbles in a liquid, or droplets in a gas, change the density, the speed of sound and the electrical behaviour that different meters rely on, each in its own way. At the brewery the commonest culprit is carbon dioxide coming out of solution in fermenting or warm beer, and Chapter 5 meets it in the wort line. Installation, which Chapter 2 covers, is largely about guaranteeing full pipes and clean, single-phase flow at the meter.

## Process meters and trade meters

The brewery's water is billed by the water authority from its own meter at the property boundary. That meter, like any meter used to determine a price, is a trade meter. In Australia, trade measuring instruments must be of a pattern approved by the National Measurement Institute and must be verified, and their use is governed by trade measurement law. The brewery's own meters, FT-101 to FT-501, are process meters: they are used to run and improve the brewery, not to bill anyone, and no legal approval applies to them.

The distinction matters in two ways. A process meter that disagrees with the trade meter does not overturn the bill, though a persistent disagreement is worth raising with the authority, which can test its meter. And a process meter used informally for trade, such as to charge a tenant for water, may need to meet trade requirements. The brewery uses FT-101 to watch its own consumption and to check the authority's meter, and the two have agreed within 1% over each billing period, a useful check on both.

## Units and their traps

Flow units mix volume or mass with time, and both halves cause mistakes. Litres per minute and cubic metres per hour differ by a factor of 16.67; kilograms per hour and tonnes per hour by a thousand; and imported equipment may display United States gallons per minute, about 3.785 L/min each, or imperial gallons, about 4.546 L/min. A totaliser's units must match its flow's: a flow in m³/h fed to a totaliser that expects L/min gives a total wrong by a factor of 16.67. Most of these errors are caught by the velocity check of this chapter's checklist, because they put a reasonable flow at an unreasonable velocity.

## The range of flows, not just the normal one

A meter is chosen for a range, not for one flow. FT-101 sees 30 m³/h when the brewhouse is filling its hot liquor tank, a few cubic metres an hour during cleaning, and as little as 0.5 m³/h overnight from toilets, a leaking float valve or a cooling tower's make-up. At 0.5 m³/h the mean velocity in its 80 mm bore is only 0.028 m/s, and the ratio of the highest to the lowest flow, the turndown it must cover, is 60 to 1. Many meters lose accuracy at very low velocities, and the brewery's night flow, which is where leaks show up, is exactly the reading it most wants to trust. Chapter 8 shows how a meter's accuracy at the bottom of its range depends on whether its uncertainty is stated as a percentage of the reading or of the full scale, and Chapter 10 how the range shapes the choice of meter.

## What the process needs

Choosing which quantity to measure starts with the question the reading must answer.

```figure
type: decision
title: Which kind of flow the brewery needs at each point
caption: This is an illustration of the reasoning.
- Water bills and the site water balance | Volume, at the meter's own conditions | FT-101 reads cold mains water; the water authority bills by volume
- Extract, yield and batch size of wort | Mass, and density for gravity | FT-201's Coriolis meter gives both
- Hot liquor for each brew | Mass, or volume at a stated temperature | FT-301 reads volume at 80 °C; the recipe must say which
- Compressed air use and leaks | Standard volume, as free air | FT-401 must be corrected for pressure and temperature
- Glycol circulation for cooling capacity | Volume, with temperatures, for heat flow | FT-501 audits the loop occasionally
```

## The mistake: hot liquor by the litre

The brewery's recipes give the volume of hot liquor for each brew in litres: 1,900 L for the house pale ale. The brewer had always taken those litres to mean water at 20 °C, as the recipe software assumed when it calculated the mash's thickness and the expected gravity. FT-301, measuring the hot liquor at 80 °C, delivered 1,900 L at 80 °C.

Over several months the brewer noticed that the pale ale's original gravity was running consistently a little above the recipe's prediction, and that the mash seemed thicker than it should. The quality manager traced the difference to the hot liquor.

```figure
type: steps
title: Finding the missing water
caption: This is an illustration. 1,900 L at 80 °C holds 1,846 kg; 1,900 L at 20 °C would hold 1,897 kg.
- Recipe | 1,900 L of hot liquor, assumed by the software to be at 20 °C, 1,897 kg
- Delivered | 1,900 L measured at 80 °C by FT-301
- Mass delivered | 1,900 × 0.9718 = 1,846 kg, 50 kg or 2.6% less than the recipe assumed
- * Effect | thicker mash and slightly higher gravity than predicted on every brew
- Fix | recipe quantities converted to mass; FT-301's volume converted to mass at the measured temperature by the control system
```

The 1,900 L delivered at 80 °C contained 1,900 × 0.9718 = 1,846 kg of water, 50 kg, or 2.6%, less than the 1,897 kg the recipe software had assumed. The mash was correspondingly thicker and the gravity a little higher. The fix was to express recipe quantities in kilograms and to have the control system multiply FT-301's volume by the density at its measured temperature. The difference was within the brewer's normal adjustments, which is why it went unnoticed for so long, but it was a systematic error on every brew, and it made the recipe software's predictions wrong in a consistent direction.

## Checking a flow reading

A few quick checks catch most misunderstandings about what a reading means.

```figure
type: checklist
title: Before trusting a flow reading
caption: The open item is this chapter's mistake: a volume without its temperature is half a number.
- x Volume, mass or standard volume | the meter's display unit and configuration say which
- x Conditions of a volume | the temperature and pressure at which it applies
- ? Conditions the user assumes | a recipe, bill or report in another temperature's litres
- x Standard conditions named | 0 °C, 15 °C or 20 °C, and the reference pressure
- x Bore, not nominal size | for any calculation of velocity from flow
- x Velocity reasonable | about 0.5 to 3 m/s for liquids in process lines
```

The last check is a useful sanity test. Liquid velocities in process pipes are usually between about 0.5 and 3 m/s. A calculated velocity far outside that range usually means a wrong bore, a wrong unit or a meter in the wrong size of pipe.

## Exercise: wort by mass and volume

A brew of 2,500 L of wort at 18 °C and a specific gravity of 1.048 is transferred through FT-201 in 12.5 minutes. Calculate the volume flow in m³/h, the mean velocity in the 47.8 mm bore, the mass transferred and the mass flow. Then calculate the volume the same mass of wort would occupy at 98 °C, at the end of the boil, taking its density there as 1,010 kg/m³, and say which number the brewer should use to judge the brew's size.

### Answer

**Given:** V = 2.500 m³; t = 12.5 min; SG 1.048, ρ = 1,048 kg/m³ at 18 °C; ρ = 1,010 kg/m³ at 98 °C; bore 47.8 mm.

**Assumptions:** steady flow; the density uniform through the transfer.

**Method:** Q = V ÷ t; v̄ = Q ÷ A; m = ρ V; ṁ = m ÷ t; V_hot = m ÷ ρ_hot.

**Volume flow:** 2.500 ÷ (12.5 ÷ 60) = 12.0 m³/h.

**Mean velocity:** A = π × 0.0478² ÷ 4 = 1.7945 × 10⁻³ m²; v̄ = (12.0 ÷ 3,600) ÷ 1.7945 × 10⁻³ = 1.858 m/s.

**Mass:** 1,048 × 2.500 = 2,620 kg. **Mass flow:** 2,620 ÷ 12.5 = 209.6 kg/min, or 12,576 kg/h.

**Volume at 98 °C:** 2,620 ÷ 1,010 = 2.594 m³, about 2,594 L.

**Which to use:** the mass, 2,620 kg, which does not change with temperature. The same wort is 2,594 L at the end of the boil and 2,500 L cooled, a difference of 3.8%, enough to make a brew look larger or smaller depending on when it was measured. Volumes can be reported, but only with their temperature. The brewery now records every transfer in kilograms, with the volume and temperature alongside for the brewers who think in litres.

**Verification:** the pipe flow velocity tool, with 200 L/min and a 47.8 mm bore, gives 1.858 m/s, and the ratio of the two volumes equals the inverse ratio of the densities: 1,048 ÷ 1,010 = 1.038.
