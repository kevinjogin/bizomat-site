---
book: vacuum-by-the-numbers
chapterSlug: safety-and-the-specification
order: 10
title: "Safety and the vacuum specification"
description: "Forces and stored energy in a vacuum chamber, flat panels and windows, certification, pump exhaust, vacuum lifting, VC-200's specification, and a rejected clear door."
draft: false
---

A vacuum chamber looks harmless: nothing is under pressure inside it, nothing can burst. But a chamber at vacuum is under pressure from outside, the full weight of the atmosphere on every square metre of its walls, and if it fails it does not burst, it collapses, violently and inward, and then throws its pieces outward. Its windows and flat panels carry loads measured in tonnes. Its pump discharges whatever the process gives off. And the vacuum systems found in factories, chambers, dryers, lifting cups, are often designed by people who would never improvise a compressed-air receiver but do not think of vacuum as pressure equipment at all.

This chapter works out the forces and stored energy in VC-200, looks at flat panels and windows, external pressure and certification, the pump's exhaust and other hazards, applies the same arithmetic to vacuum lifting, sets out VC-200's full specification, and ends with a clear door that a design review rejected.

## Forces on the chamber

Chapter 1 found the force on VC-200's 400 × 400 mm door: **16.2 kN** at its working pressure, about the weight of a 1.6 tonne car. The same arithmetic applies to every part of the chamber.

- A **Ø150 mm viewport** carries 101,325 × π × 0.075² = **1.79 kN**, the weight of about 180 kg, on a disc of glass.
- A **600 × 600 mm** flat side panel, if VC-200 had one, would carry **36.5 kN**, nearly four tonnes.
- The **whole chamber** is squeezed by the atmosphere on every face at once.

These loads appear the moment the chamber is pumped below a few kilopascals, and they stay as long as it is under vacuum. They are carried by the shell's shape and stiffness, by the door's clamps and hinges, and by the viewport's mounting. They act on every cycle, so fatigue of hinges, clamps and welds is part of the design, not just the single load.

## Stored energy

If a chamber at vacuum collapses, the atmosphere does work on it as it rushes in. The most work it can do is the atmospheric pressure times the chamber's volume: p₀ × V. For VC-200, that is 101,325 × 0.2 = **20.3 kJ**, about the same as the energy of a two-tonne weight dropped from a height of one metre.

A collapse releases that energy in milliseconds. Fragments of a failed window or panel are driven into the chamber, and then, as the inrushing air rebounds and the shell's own elastic energy is released, outward. An implosion of a glass vessel, a cathode-ray tube or a vacuum flask is a well-known hazard for this reason, and the same physics applies to any chamber at any size. The energy goes up with the volume, so a large chamber's failure is correspondingly more violent.

```figure
type: stats
title: The atmosphere's load on VC-200 at its working pressure
caption: This is an illustration at 200 Pa inside and 101.3 kPa outside. The load is almost the same at any pressure below a few kilopascals.
- 16.2 kN | On the 400 × 400 mm door | about 1.6 tonnes
- 1.79 kN | On the Ø150 mm viewport | about 180 kg on a glass disc
- 36.5 kN | On a 600 × 600 mm flat panel | if the chamber had one
- * 20.3 kJ | Most work in a collapse, p₀ × V | a two-tonne weight dropped one metre
```

## Flat panels and windows

Curved shells carry external pressure mostly in compression, which steel handles well until it buckles. Flat panels carry it in bending, which is far less efficient. A simply supported square plate of side a and thickness t under a uniform pressure q has a greatest bending moment, from classical plate theory with a Poisson's ratio of 0.3, of about 0.0479 × q × a², which gives a greatest bending stress of about:

σ = 0.287 × q × a² ÷ t²

For VC-200's 400 mm door, if it were a 12 mm flat steel plate simply supported at its edges, that stress would be 0.287 × 101,325 × 0.4² ÷ 0.012² = about **32 MPa**, well within what structural steel can carry, which is why a flat steel door of that size works. The square of the span makes the stress grow quickly with size: a 600 mm door of the same thickness would see 2.25 times as much. Real doors are clamped, stiffened and sealed in ways the simple formula does not capture, and their design and deflection under load, which matters for the seal, belong to the chamber's designer.

Windows are a special case. Glass is strong in compression and weak in tension, fails without warning and is sensitive to scratches, which become the origins of cracks. Viewports for vacuum chambers are made of suitable glass of adequate thickness for their diameter, mounted so that the glass is supported evenly and never clamped metal to glass, and protected against impact. Their makers rate them for vacuum service. A window that is not rated for the pressure difference across it has no place on a vacuum chamber.

```figure
type: compare
title: Bending stress in a flat square door at full vacuum, simply supported
rowhead: Door
cols: Side, mm | Thickness, mm | Force, kN | Greatest stress, MPa
caption: From σ = 0.287 × q × a² ÷ t² with q = 101.3 kPa. The square of the span drives the stress; real doors are clamped and stiffened, and their design belongs to the chamber's designer.
- * VC-200's door, steel | 400 | 12 | 16.2 | 32
- Proposed clear door, acrylic | 400 | 10 | 16.2 | 47
- Larger door, steel | 600 | 12 | 36.5 | 73
- Larger door, thicker steel | 600 | 16 | 36.5 | 41
```

## Inspection and maintenance

A vacuum chamber's safety depends on its condition as well as its design. VC-200's maintenance plan includes:

- a visual check of the viewport at every cycle for chips, scratches and resin build-up, with the viewport replaced, not repaired, if it is damaged;
- a monthly check of the door's hinges, clamps and seal for wear, cracking and deformation, alongside the rate-of-rise test;
- a periodic inspection of the shell and its welds at the interval its records and the applicable regulations require, by a competent person;
- tests of the door interlock and vent sequence at every service, confirming that the door cannot be opened under vacuum.

The records go with the chamber. A chamber sold or moved without its design and inspection records is a chamber whose next owner cannot know what it is fit for.

## External pressure and certification

A shell under external pressure fails not by bursting but by **buckling**: at a critical pressure its walls fold inward, often suddenly, at a stress far below the material's strength. Buckling depends on the shell's diameter, thickness, length between stiffeners and roundness, and a shell that is slightly out of round buckles at a much lower pressure than a perfect one. A thin steel drum or a plastic container that holds water perfectly well can collapse completely under one atmosphere of external pressure.

Pressure vessels in Australia are designed to AS 1210, which covers vessels under external pressure as well as internal, and the design of a vacuum chamber is a job for a qualified pressure-vessel designer working to it. Depending on the vessel's size and hazard, the work health and safety regulations in each state and territory can require its design to be verified and registered; the local regulator states what applies. VC-200 was bought from a supplier who provided its design calculations, materials certificates and test records, and the shop keeps them with the chamber.

## The pump's exhaust and other hazards

The vacuum is not the only hazard.

- **Exhaust.** Everything pumped out of the chamber leaves through the pump's exhaust: the air, water vapour, the resin's volatile components and, from an oil-sealed pump, oil mist. VC-200's exhaust passes through an oil mist filter and is piped outside, away from doors and air intakes, and the resin's safety data sheet and Safe Work Australia's workplace exposure standards for airborne contaminants guide where it may discharge.
- **Oxygen and flammable vapours.** Oil-sealed pumps must not be used to pump oxygen-enriched gas, because the hot oil can ignite, and pumping flammable solvent vapours needs a pump and exhaust designed for them. VC-200's resin is not a significant source of flammable vapour at its process temperature, a point the shop confirmed from the safety data sheet before choosing the pump.
- **Hot surfaces and noise.** A running oil-sealed pump is hot to the touch and noisy; it is guarded and sited accordingly.
- **Venting.** Admitting air fast through a large valve can disturb loose material inside; VC-200 vents through a small valve, and its door stays locked until the chamber is near atmospheric pressure (Chapter 9).

## Vacuum lifting

The same pressure-times-area arithmetic governs vacuum lifting cups and grippers, which are common in sheet handling and packaging. A cup of 100 mm diameter at 60 kPa absolute, with 101.3 kPa outside, holds with a force of (101,325 − 60,000) × π × 0.05² = about **325 N**, before any allowance for the cup's effective area, the surface's porosity, acceleration or the angle of the load. The KEVOS® [vacuum cup calculator](/tools/vacuum-cup/) does the sum. The safety questions are the same as for a chamber: what happens when the vacuum is lost, through a leak, a power failure or a damaged cup, and whether the load can fall on anyone. Lifting devices are designed with safety factors, reservoirs or check valves that hold vacuum for a time if the supply fails, and warnings of low vacuum, as their standards and makers require.

## VC-200's specification

Bringing the book's numbers together, VC-200's specification, as an illustration, reads:

1. **Chamber**: 0.2 m³ stainless steel vessel designed for full external pressure, with design calculations, materials certificates and test records; 400 × 400 mm steel door with rated glass viewport of Ø150 mm.
2. **Process**: degas at 200 Pa absolute, ±50 Pa, for 10 minutes, measured at the chamber; reach 250 Pa within 6 minutes; resin and chamber 18 to 25 °C; staged pump-down for full batches.
3. **Pump**: two-stage oil-sealed rotary vane, 16 m³/h, ultimate about 0.5 Pa, gas ballast open for degassing, oil mist filter, exhaust piped outdoors.
4. **Line**: 1.5 m of 25 mm bore hose and a ball valve; effective speed at the chamber at least 3.9 L/s at 200 Pa.
5. **Gauges**: capacitance diaphragm gauge, 13.3 kPa full scale, on the chamber, controlling the process and calibrated with traceability; Pirani gauge for trend and pump checks.
6. **Leak tightness**: steady rate of rise no more than 6 Pa per minute at 200 Pa, 0.02 Pa·m³/s, checked monthly and after maintenance.
7. **Interlocks**: door locked until near atmospheric pressure; vent valve opens only with the pump valve shut; process timer starts on the gauge.
8. **Records**: pump-down curve per cycle with batch size; weekly pump ultimate; monthly rate of rise; gauge calibrations.

Each line traces back to a chapter, and each number to a calculation that can be repeated. A specification written this way can be given to a supplier, who can show how the offered equipment meets each line, and to an auditor, who can check each line against the records. It also makes change visible: a new resin, a larger batch or a lower pressure alters particular lines, and the chapters behind them show what else must be recalculated.

## The error: a clear door

This is an illustration. When the shop considered a second chamber, a supplier proposed a **10 mm acrylic door**, 400 × 400 mm, so that operators could watch the whole batch foam and subside. Acrylic is clear, light and easy to machine, and small acrylic desiccator lids are common in laboratories.

The shop's design review, with the chamber supplier's pressure-vessel engineer, ran the plate formula. Simply supported, the 10 mm acrylic panel would see a greatest bending stress of about 0.287 × 101,325 × 0.4² ÷ 0.01² = **47 MPa**, on every cycle, and its centre would deflect noticeably under load, working the door seal. The engineer pointed out three further problems the number does not show: acrylic under sustained load creeps; it crazes when stressed in the presence of some solvent vapours, which the resin could release; and a crazed panel can fail suddenly. Under one atmosphere of external pressure, with 20 kJ of stored energy behind it, a failure would be an implosion with the operator standing in front of it.

The proposal was rejected. The second chamber has a steel door with a rated glass viewport, like VC-200's, and a camera inside for operators who want to watch the foam. The shop's purchasing checklist for vacuum equipment now asks for every window's and every flat panel's rating for the pressure difference it will carry.

```figure
type: checklist
title: Safety checks before a vacuum chamber is used
caption: Vacuum equipment is pressure equipment under external load. The last line is this chapter's error.
- Shell designed for full external pressure, with records | design calculations and test certificates kept
- Doors, clamps and flat panels checked for bending and fatigue | 16.2 kN on the door every cycle
- Windows rated for vacuum and protected | Ø150 mm rated glass viewport
- Exhaust routed outdoors; vapours checked against the safety data sheet | oil mist filter fitted
- Interlocks fail safe | door locked until near atmospheric pressure
- x Acrylic door proposed | 47 MPa bending, creep and crazing under solvent vapour; rejected
```

## Exercise: a larger door

The second chamber's steel door is to be **600 × 600 mm**. Find the force on it at full vacuum, and the plate formula's greatest bending stress for a 12 mm and a 16 mm steel door, simply supported. How does the stress compare with VC-200's 400 mm, 12 mm door?

**Worked answer.**

- Force: 101,325 × 0.36 = **36.5 kN**.
- 12 mm: σ = 0.287 × 101,325 × 0.6² ÷ 0.012² = **72.8 MPa**, 2.25 times VC-200's 32 MPa, because the stress goes as the square of the span.
- 16 mm: σ = 0.287 × 101,325 × 0.6² ÷ 0.016² = **40.9 MPa**.

Thickening the door by a third brings the stress back to about the 400 mm door's level, at the cost of a heavier door, stronger hinges and clamps. Stiffening ribs are the usual alternative. Either way, the door's design, including its deflection at the seal, belongs to the chamber's designer and its verification under AS 1210.
