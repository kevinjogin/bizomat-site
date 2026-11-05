---
book: viscosity-by-the-numbers
chapterSlug: what-viscosity-measures
order: 1
title: "What viscosity measures"
description: "Define viscosity from the shear stress in a moving film, tell dynamic from kinematic viscosity, convert between units, and see which one each calculation needs."
draft: false
---

Pour two liquids from the same jug and one runs out in a thin stream while the other slumps over the lip. The difference is viscosity: a fluid's resistance to one layer sliding over the next. Every lubricated contact, every hydraulic line and every clearance in a pump depends on it, and engineers measure it, specify it and calculate with it every day. They also confuse its two forms and its many units more often than almost any other property.

This chapter defines viscosity from the simplest flow there is, a thin film sheared between two plates, and separates the two quantities that share the name: dynamic viscosity, which sets forces, and kinematic viscosity, which oil data sheets and laboratories report. It introduces HPU-40's oil in both forms, converts it into the older units still found on drawings and pump data sheets, and ends with a calculation that was out by a factor of a thousand and how a sense check caught it.

## A film between two plates

Imagine a flat plate sliding at speed U over a fixed one, separated by an oil film of thickness h. The oil touching each plate moves with it, so the layer on the fixed plate is still and the layer on the moving plate travels at U. In between, each thin layer of oil slides over its neighbour, and in a thin film the speed rises in a straight line from zero to U across the gap. The rate at which speed changes across the film, U ÷ h, is the shear rate.

To keep the top plate moving, a force must be applied to it, and the force per unit of plate area is the shear stress. For water, oils and gases, the shear stress is proportional to the shear rate, and the constant of proportionality is the dynamic viscosity. Fluids that behave this way are called Newtonian, after the relation Newton proposed; fluids that do not, such as greases and some polymer-thickened oils, are the subject of Chapter 5.

```figure
type: formula
title: Newton's law of viscosity and the two viscosities
formula: τ = μ × (U ÷ h)
formula: ν = μ ÷ ρ
caption: The shear stress in a thin film is the dynamic viscosity times the shear rate. Kinematic viscosity is dynamic viscosity divided by density.
- τ | shear stress, Pa
- μ | dynamic (absolute) viscosity, Pa·s
- U ÷ h | shear rate, 1/s: sliding speed over film thickness
- ν | kinematic viscosity, m²/s (1 mm²/s = 1 cSt)
- ρ | density, kg/m³
```

Dynamic viscosity has units of pascal-seconds: stress divided by shear rate. Kinematic viscosity has units of square metres per second, the same units as a diffusion coefficient, and the resemblance is not an accident. Kinematic viscosity measures how quickly a disturbance in velocity spreads through a fluid, just as a diffusion coefficient measures how quickly a difference in concentration spreads. Chapter 2 shows how both come from the same molecular motion.

## HPU-40's oil in numbers

This is an illustration. HPU-40's ISO VG 46 oil has a kinematic viscosity of 46.0 mm²/s at 40 °C. Its density is 870 kg/m³ at 15 °C and falls by 0.07% per kelvin, so at 40 °C it is 870 × (1 − 0.0007 × 25) = 854.8 kg/m³. Its dynamic viscosity at 40 °C is therefore 46.0 × 10⁻⁶ × 854.8 = 0.03932 Pa·s, or 39.32 mPa·s.

The press's ram runs in guides with oil-wetted gibs. Suppose one gib is a flat strip 200 mm × 100 mm separated from its slide by an oil film 0.05 mm thick, and the ram moves at 0.1 m/s. The shear rate is 0.1 ÷ 0.00005 = 2,000 per second.

```figure
type: steps
title: Viscous drag on one of HPU-40's press gibs at 40 °C
caption: This is an illustration. A full, uniform oil film is assumed; real gibs also carry load through local contact, which adds friction this calculation does not include.
- Dynamic viscosity at 40 °C | 46.0 × 10⁻⁶ m²/s × 854.8 kg/m³ = 0.03932 Pa·s
- Shear rate | 0.1 m/s ÷ 0.00005 m = 2,000 1/s
- Shear stress | 0.03932 × 2,000 = 78.6 Pa
- * Drag force | 78.6 Pa × (0.2 × 0.1) m² = 1.57 N
- Same gib with the oil at 5 °C | 335.1 mPa·s gives 13.4 N
```

A drag of 1.57 N is tiny beside the press's 600 kN, and that is typical of well-lubricated sliding surfaces at modest speeds. The more striking number is the last one: on a winter morning, with the oil at 5 °C, the same film needs 13.4 N, eight and a half times as much. Temperature dominates viscosity, and Chapter 3 is devoted to it.

## Dynamic or kinematic: which does a calculation need?

The two viscosities answer different questions, and using the wrong one is a common error.

Dynamic viscosity appears wherever a force or a pressure is balanced against viscous shear: drag in a film, friction in a journal bearing, pressure drop in laminar flow along a line, leakage through a clearance and the power turned to heat in a shear film. In all of these, the fluid's mass does not matter, only its resistance to shear.

Kinematic viscosity appears wherever inertia competes with viscosity, because density enters both and the ratio of the two contains μ ÷ ρ. The Reynolds number, which decides whether flow is laminar or turbulent, is velocity times diameter divided by kinematic viscosity. Kinematic viscosity is also what a gravity-driven instrument measures. In the glass capillary viscometers that oil laboratories use, the oil's own weight drives it through the tube, so the flow time depends on viscosity divided by density. That is why oil data sheets and laboratory reports give kinematic viscosity, and why converting to dynamic viscosity needs the density at the same temperature.

```figure
type: compare
title: Which viscosity each calculation uses
cols: Quantity used | Why
rowhead: Calculation
- Shear force or friction in a film | Dynamic, μ | stress = μ × shear rate
- Laminar pressure drop in a line | Dynamic, μ | Hagen–Poiseuille law, Chapter 7
- Leakage through a clearance | Dynamic, μ | pressure-driven flow in a thin gap, Chapter 8
- Reynolds number | Kinematic, ν | inertia over viscous forces
- Capillary viscometer result | Kinematic, ν | weight drives the flow, Chapter 6
- Oil grade and data sheet values | Kinematic, ν | measured by capillary at 40 °C and 100 °C
```

## The units engineers still meet

The SI units are the pascal-second for dynamic viscosity and the square metre per second for kinematic viscosity. Both are inconveniently large for oils and water, so practice uses millipascal-seconds and square millimetres per second, which happen to equal the older centipoise (cP) and centistokes (cSt). The poise and the stokes are the CGS units, named after Poiseuille and Stokes; one centipoise is one millipascal-second and one centistokes is one square millimetre per second, exactly.

Two older units survive on older drawings, imported equipment and some data sheets. The reyn, the imperial unit of dynamic viscosity, is one pound-force second per square inch, about 6.895 million centipoise. Saybolt Universal Seconds (SUS) are the time in seconds for 60 mL of oil to run through a standard orifice; they are an instrument reading rather than a physical unit and can only be converted to centistokes approximately.

```figure
type: compare
title: Viscosity units and their conversions
cols: Kind | Equal to
rowhead: Unit
- Pa·s | Dynamic | SI unit
- mPa·s | Dynamic | 1 cP
- cP (centipoise) | Dynamic | 1 mPa·s = 0.001 Pa·s
- reyn (lbf·s/in²) | Dynamic | 6.895 × 10⁶ cP
- m²/s | Kinematic | SI unit
- mm²/s | Kinematic | 1 cSt
- cSt (centistokes) | Kinematic | 1 mm²/s = 10⁻⁶ m²/s
- SUS | Instrument reading | approximately 4.63 × cSt for thicker oils only
```

The BIZOMAT [oil viscosity unit conversion tool](/tools/viscosity-units/) converts between centistokes, centipoise, pascal-seconds, reyns and Saybolt seconds from the oil's specific gravity, which is its density in grams per cubic centimetre. This is an illustration. Entering 46 cSt with a specific gravity of 0.8548, HPU-40's oil at 40 °C, the tool returns 39.32 cP, 0.03932 Pa·s, 5.70 × 10⁻⁶ reyn and 213.1 SUS on the 40 °C basis.

Two cautions apply to that tool and to any conversion. The specific gravity must be at the same temperature as the viscosity; using the data sheet's 15 °C density of 0.870 with a 40 °C viscosity overstates the dynamic viscosity by about 2%. And the tool's Saybolt figures use fixed factors of 4.632 and 4.664, which are the high-viscosity forms of the conversion. For thinner oils, below roughly 75 cSt, the true relation is not a simple ratio and the conversion tables of the relevant ASTM standard should be used instead. HPU-40's oil at 46 cSt is in that range, so its 213.1 SUS is an approximation.

## Viscosity of three common fluids

The difference between the two viscosities is easiest to see with three fluids side by side at the same temperature.

```figure
type: compare
title: Three fluids at 20 °C and atmospheric pressure
cols: Dynamic viscosity | Density | Kinematic viscosity
rowhead: Fluid
- Water | 1.001 mPa·s | 998.2 kg/m³ | 1.003 mm²/s
- Nitrogen gas | 0.01757 mPa·s | 1.150 kg/m³ | 15.29 mm²/s
- * HPU-40's VG 46 oil | 116.0 mPa·s | 867.0 kg/m³ | 133.8 mm²/s
caption: Water and nitrogen from NIST's fluid property data; the oil is an illustration, from its data sheet values and the relation in Chapter 3. Nitrogen has 57 times less dynamic viscosity than water but 15 times more kinematic viscosity.
```

Water's dynamic and kinematic viscosities are almost equal in the practical units, because its density is almost exactly 1,000 kg/m³. That coincidence is the root of a common shortcut, "centipoise and centistokes are the same", which is true for water and wrong for everything else. For HPU-40's oil the two differ by 14% to 19% across its working temperatures. For nitrogen, the gas in HPU-40's accumulator precharge, they differ by a factor of about 870. Nitrogen resists shear far less than water does, but it has so little mass to carry momentum that a velocity disturbance spreads through it faster, which is what its higher kinematic viscosity means.

## Shear rates in a real machine

The gib's shear rate of 2,000 per second is modest. Oil in a machine is sheared over a range of more than a hundred to one, and the range matters for two reasons. First, the power turned to heat in a shear film rises with the square of the shear rate, so the fastest, thinnest films run hottest. Second, the oils that are not Newtonian, which Chapter 5 describes, have a viscosity that depends on the shear rate, so a value measured slowly in a laboratory may not be the value in a fast, thin film.

```figure
type: compare
title: Typical shear rates in and around HPU-40
cols: Speed | Film or size | Shear rate
rowhead: Place
- Press gib, as above | 0.1 m/s | 0.05 mm film | 2,000 1/s
- Pressure line wall, laminar flow at 40 L/min | 3.32 m/s mean | 16 mm bore | 1,660 1/s
- Pump piston in its bore | about 3 m/s | 10 µm clearance | about 300,000 1/s
- Journal bearing of 80 mm at 1,480 rpm | 6.20 m/s | 0.06 mm clearance | about 103,000 1/s
caption: This is an illustration. The wall shear rate in laminar pipe flow is 8 × mean velocity ÷ bore; the others are speed ÷ film thickness. The journal bearing is the running case of the companion book, Plain Bearings by the Numbers.
```

For a plain mineral oil these differences do not change the viscosity; it is Newtonian across the whole range. They do change what a measurement means. A capillary viscometer shears the oil at a few hundred to a few thousand per second, close to the gib and the line, and nowhere near a piston clearance. For a straight mineral oil that is no problem. For an oil thickened with polymer, which HPU-40's is not, the viscosity in the pump's clearances can be noticeably lower than the data sheet value, which is why Chapter 5 asks for a high-shear viscosity when such an oil is used.

## Viscosity is not density, thickness or friction

Three everyday words get attached to viscosity and mislead. "Thick" and "thin" describe viscosity, not density: a dense liquid such as mercury runs very freely, while a light oil can be far more viscous than water. "Heavy" oil means high viscosity grade, not high density; most mineral oils have densities within a few per cent of each other whatever their grade. And viscosity is not a friction coefficient. In a full oil film, friction depends on viscosity, speed, load and geometry together, as the gib calculation shows, and a more viscous oil can give either more or less friction depending on whether the surfaces are fully separated. Keeping the words straight saves arguments with suppliers and in maintenance meetings.

## Where viscosity shows up in HPU-40

Each of the following chapters takes one place where HPU-40's oil viscosity matters. The list is also a useful checklist for any oil-filled machine.

```figure
type: checklist
title: Where viscosity matters in a hydraulic power unit
caption: Chapter numbers refer to this book.
- Cold start | The pump must be able to draw oil up its suction line without cavitating (Chapters 4 and 7)
- Running film | Pump and motor bearings and the pump's sliding parts need a thick enough oil film (Chapter 4)
- Pressure drop | Lines, filters and valves lose pressure in proportion to viscosity in laminar flow (Chapter 7)
- Leakage | Internal leakage in pumps, valves and cylinders rises as viscosity falls (Chapter 8)
- Heat | Every pressure loss and every leak becomes heat in the oil (Chapter 9)
- Condition | A change in viscosity is one of the first signs of the wrong oil, oxidation or contamination (Chapter 10)
```

## The error: a thousand times too much drag

This is an illustration. An engineer at the press shop checked whether the gib drag above could explain a slow ram return on cold mornings. Their spreadsheet took the oil's dynamic viscosity as "39.32" from the data sheet conversion and entered it in a cell labelled "viscosity, Pa·s". The spreadsheet then reported a gib drag of 1,573 N at 40 °C and 13,400 N at 5 °C, and concluded that the gibs were the problem.

The number did not survive a sense check. A technician pointed out that a single gib strip of 200 mm × 100 mm, wiped with oil, can be slid by hand; 1.5 kN is about the weight of two adults standing on it. The engineer traced the figure back to the viscosity cell. The value 39.32 was in millipascal-seconds, a thousand times smaller than the pascal-seconds the formula assumed. With 0.03932 Pa·s the drag became 1.57 N, and with the cold oil 13.4 N, both negligible beside the press's return cylinder force. The slow cold return was later traced to the pressure drop in the lines and valves, which Chapter 7 calculates.

The engineer also noticed a second, smaller slip in an earlier version: taking 46 cP as if it were 46 cSt, which overstates the dynamic viscosity by 17% because it ignores the oil's density of 854.8 kg/m³. Neither mistake is unusual. The press shop now labels every viscosity in its calculations with both its kind and its unit, converts to SI base units before any formula is applied, and asks for a quick order-of-magnitude estimate of any force before it is used in a decision.

## Bringing it together

Viscosity is the ratio of shear stress to shear rate in a fluid. Dynamic viscosity, in pascal-seconds, sets forces, pressure drops and leakage; kinematic viscosity, in square millimetres per second, sets the Reynolds number and is what oil data sheets and laboratories report. Converting between them needs the density at the same temperature. Centipoise and centistokes are equal only for water. With HPU-40's oil described in both forms, the next chapter asks where viscosity comes from, and why gases and liquids behave so differently when they are heated.

## Exercise: the gib at summer temperature

On the hottest days HPU-40's oil reaches 65 °C, where its kinematic viscosity is 17.41 mm²/s. Find the density, the dynamic viscosity in mPa·s and Pa·s, and the drag on the same 200 mm × 100 mm gib with a 0.05 mm film at 0.1 m/s. Then check your dynamic viscosity with the unit conversion tool.

**Worked answer.** This is an illustration. The density is 870 × (1 − 0.0007 × 50) = 839.6 kg/m³. The dynamic viscosity is 17.41 × 10⁻⁶ × 839.6 = 0.01462 Pa·s, or **14.62 mPa·s**. The shear stress is 0.01462 × 2,000 = 29.2 Pa, and the drag is 29.2 × 0.02 = **0.58 N**, about 37% of the 40 °C value and one twenty-third of the 5 °C value. Entering 17.41 cSt with a specific gravity of 0.8396 in the unit conversion tool returns 14.62 cP. The same oil, in the same machine, offers 23 times more resistance to shear on a cold morning than on a hot afternoon.
