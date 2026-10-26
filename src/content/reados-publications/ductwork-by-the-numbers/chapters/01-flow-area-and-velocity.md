---
book: ductwork-by-the-numbers
chapterSlug: flow-area-and-velocity
order: 1
title: "Flow, area and velocity"
description: "Relate a duct's flow, area and velocity, convert flow units, size branches and mains for a minimum velocity, round in the right direction, and catch a branch upsized into trouble."
draft: false
---

Every duct calculation starts with one relationship: the flow through a duct equals the air's average velocity times the duct's cross-sectional area. Choose any two and the third follows. A designer who knows the flow a hood must draw and the velocity the air must keep can find the duct size; a fitter who knows the duct size and measures the velocity can find the flow. The relationship is simple, and the mistakes are in the units, in which way a size is rounded, and in forgetting that velocity, not size, is what the air cares about.

This chapter sets out flow, area and velocity, the units they come in, and how to size the branches and main of a system for a required velocity. The running case sizes EX-1's ducts and finds a branch that was upsized "for margin" until its air was too slow to carry the dust.

## The continuity relationship

For a duct carrying a volume flow Q at an average velocity v through a cross-sectional area A:

```figure
type: formula
title: Flow, velocity and area
formula: Q = v × A;   v = Q ÷ A;   for a round duct, d = √(4Q ÷ (π × v))
caption: This is an illustration for EX-1's branches, each drawing 0.30 m³/s with a minimum velocity of 18 m/s.
- Q | Volume flow, m³/s
- v | Average velocity across the section, m/s
- A | Internal cross-sectional area, m²
step: Diameter for exactly 18 m/s: d = √(4 × 0.30 ÷ (π × 18)) = 0.1457 m, 145.7 mm
step: A 140 mm duct: A = π × 0.14² ÷ 4 = 0.01539 m²; v = 0.30 ÷ 0.01539 = 19.49 m/s
step: A 150 mm duct: A = 0.01767 m²; v = 16.98 m/s, below the 18 m/s minimum
```

The velocity in the formula is the average across the section. Air moves fastest at the centre of a duct and slowest at its walls, so the average is what a measurement must find, which Chapter 10 returns to.

## Units of flow

Flow comes in several units, and a specification, a fan curve and a hood's data sheet may each use a different one:

- **cubic metres per second**, m³/s, the SI unit and the one the formulas use;
- **litres per second**, L/s, common in Australian building services: 1 m³/s = 1,000 L/s;
- **cubic metres per hour**, m³/h, common on fan and filter data sheets: 1 m³/s = 3,600 m³/h.

EX-1's booths each draw 0.30 m³/s, which is 300 L/s or 1,080 m³/h. The whole system, three booths, draws 0.90 m³/s, 900 L/s or 3,240 m³/h. Converting everything to m³/s before calculating is the simplest protection against a factor of 1,000 or 3,600.

Strictly, volume flow changes with the air's density, which changes with temperature and pressure. In a workshop extraction system at near-ambient temperature, the changes are small and the volume flow is treated as constant along the duct. For hot exhausts they are not, and the flows should be converted to the density at each point, or worked as mass flow.

## Where the flow comes from

A branch's flow is decided at its hood, not in the duct. For an enclosing booth, the usual starting point is the area of the booth's open face times the air velocity needed through that face to stop contaminant escaping, a **face velocity** that the ventilation designer chooses for the process and the booth's shape.

This is an illustration. Each of EX-1's booths has an open face 1,000 mm wide and 600 mm high, 0.60 m², and the designer has chosen a face velocity of 0.5 m/s, so each booth needs 0.60 × 0.5 = **0.30 m³/s**. A booth with a larger opening, or a process that throws dust further, needs more. The duct is then sized to carry that flow at the transport velocity. Getting the hood's flow wrong cannot be fixed by the duct: a perfectly sized duct carrying too little air leaves the booth leaking fume into the workshop.

## Flows add at junctions

Where a branch joins a main, the flows add. Air is not lost or created in a duct, so the main downstream of a junction carries the sum of the flows that entered upstream. For EX-1:

- from B1 to N2, the main carries B1's **0.30 m³/s**;
- from N2 to N3, it carries B1 and B2, **0.60 m³/s**;
- from N3 to the collector and fan, it carries all three, **0.90 m³/s**.

Velocities do not add. Each section's velocity depends on its own flow and its own area, which is why the main must grow as branches join it.

## Sizing for a minimum velocity

Extraction systems that carry dust need a minimum velocity, often called the **transport velocity**, so that particles stay airborne and do not settle in the duct. The right figure depends on the dust and is specified by the ventilation designer; in this illustration it is 18 m/s. Every section must run at or above it.

This is an illustration. The exact diameters for 18 m/s are 145.7 mm for 0.30 m³/s, 206.0 mm for 0.60 m³/s and 252.3 mm for 0.90 m³/s. The fabricator's standard sizes in this illustration step through 125, 140, 150, 160, 180, 200, 225, 250 and 280 mm. To keep the velocity at or above 18 m/s, each section is rounded **down** to the next standard size below its exact diameter, except where the size just above is close enough to stay over the minimum:

```figure
type: compare
title: EX-1's duct sizes for a minimum of 18 m/s
cols: Flow | Exact diameter | Chosen size | Velocity
caption: This is an illustration. Rounding down raises the velocity and the pressure loss; rounding up below the minimum risks settled dust. The 250 mm main stays above 18 m/s although it is a little smaller than exact.
- Branches B1, B2, B3 | 0.30 m³/s | 145.7 mm | 140 mm | 19.49 m/s
- Main, N2 to N3 | 0.60 m³/s | 206.0 mm | 200 mm | 19.10 m/s
- *Main, N3 to fan | 0.90 m³/s | 252.3 mm | 250 mm | 18.33 m/s
```

## Which way to round

Whether to round a duct size up or down depends on what the system is for.

- **Dust and fume extraction** needs a minimum velocity, so ducts are rounded **down**, accepting a higher velocity and a higher pressure loss.
- **Comfort ventilation and air conditioning** usually needs a maximum velocity, to limit noise and pressure loss, so ducts are rounded **up**, accepting a larger duct and a lower velocity.

The direction should be decided once, at the start of a job, and written on the calculation sheet, because a fabricator used to one kind of work will instinctively round the other way.

## The error: a branch upsized for margin

This is an illustration. When EX-1's ducts were ordered, the drafter changed B3's branch from 140 to 150 mm "for margin", reasoning that a bigger duct would carry more air. The branch's flow is set by its hood and the fan, not by its size, so it still carried 0.30 m³/s, but now at 0.30 ÷ 0.01767 = **16.98 m/s**, below the 18 m/s minimum.

After a few weeks of grinding, the maintenance fitter found a layer of dust lying along the bottom of B3's horizontal run, and B3's hood drawing noticeably less than the others. The settled dust had narrowed the duct and roughened its floor, which raised its resistance and cut its flow further, the usual spiral of a duct running below transport velocity.

The check that would have caught it was the velocity column of the compare table above: every section's velocity, recalculated after any size change, against the minimum. The fix was to replace the 150 mm branch with a 140 mm one, which runs at 19.49 m/s, and to add the minimum velocity to the drawing's notes, so that the next change would be checked against it.

```figure
type: bars
title: Velocity in a 0.30 m³/s branch, by diameter
unit: m/s
max: 26
caption: This is an illustration. The 18 m/s minimum lies between 140 and 150 mm; only the 140 mm and smaller sizes keep the dust moving.
- 125 mm | 24.45
- *140 mm | 19.49
- 150 mm | 16.98
- 160 mm | 14.92
```

## Velocity and pressure loss

Rounding down has a cost: a smaller duct runs faster, and pressure losses in ducts rise roughly with the square of the velocity, as Chapters 4 and 5 show. B3 at 140 mm runs about 15% faster than at 150 mm, and its losses per metre are therefore roughly a third higher, (19.49 ÷ 16.98)² = 1.32 times, before the small effect of the change in diameter itself. The fan must make up the difference. That is the trade that every extraction system makes: velocity high enough to carry the dust, and no higher than it needs to be, because every metre per second costs fan power.

## Too fast is a problem too

A minimum velocity is not a licence to go as fast as possible. Above the transport velocity, extra speed buys nothing for the dust and costs in three ways. Pressure losses rise with the square of the velocity, so the fan works harder. Abrasive dust wears through elbows and the outer walls of junctions faster at high velocity, and the wear concentrates where the air turns. And noise rises with velocity, which matters in a workshop where people work beside the ducts all day.

This is an illustration. Had B3 been made 125 mm instead of 140 mm, it would run at 24.45 m/s, 25% faster than the 140 mm duct, with roughly 57% more pressure loss per metre from the velocity alone, more again from the smaller diameter, and faster wear in its elbow. The best size is the largest standard size that still meets the minimum, which for EX-1's branches is 140 mm.

## Average velocity and the section

The formula uses the internal cross-sectional area. Ducts are often specified by their nominal size, which for spiral-wound or rolled round duct is usually close to the internal diameter, but liners, internal insulation, dents and heavy dust build-up all reduce the real area. A duct lined with 25 mm of acoustic insulation inside a 300 mm casing has a 250 mm bore, and its velocity is that of a 250 mm duct, not a 300 mm one. The calculation should use the size the air actually sees.

## Rectangular ducts

The same relationship applies to rectangular ducts, with A equal to width times height. A rectangular duct of 300 × 200 mm has an area of 0.06 m², and at 0.90 m³/s its velocity would be 15 m/s. Chapter 2 shows that a rectangular duct and a round duct of the same area do not behave the same, because the rectangle has more wall for its area and loses more pressure, and sets out how to find a rectangle that is truly equivalent.

## Mass flow

Some data, such as a collector's dust-loading or a heat calculation, need **mass** flow: the volume flow times the air's density. At about 1.2 kg/m³, typical of air near 20 °C at sea level, EX-1's 0.90 m³/s is about **1.08 kg/s** of air. Mass flow is what is truly conserved along a duct; volume flow is conserved only while the density stays the same, which is why the hot-exhaust case above needs care.

## Air out means air in

Every cubic metre extracted from a building has to be replaced, through doors, louvres or a makeup air unit. This is an illustration. EX-1 removes 0.90 m³/s, 3,240 m³/h, from a workshop of 20 × 12 × 6 m, 1,440 m³, which is about **2.25 air changes an hour**. If the workshop is closed up in winter with no makeup air, the extraction pulls the building into a slight negative pressure, doors become hard to open, and the fan delivers less than its design flow because the air it needs has nowhere to come from. Makeup air is part of the extraction system's design, even though it is not in any duct of it.

## Leakage

Suction ducts leak inwards. Every unsealed seam, poorly fitted access door and loose flexible connection draws in air that never passed through a hood. The fan then handles more air than the hoods draw, and the hoods draw less than intended for the same fan setting. This is an illustration. A leakage of 3% across EX-1's ductwork means the fan handles about 0.927 m³/s for 0.90 m³/s at the hoods, 27 L/s of air doing no useful work. AS 4254.2 deals with the construction and sealing of rigid duct; the practical rule is that every joint on an extraction system is sealed, because leakage costs both capture and fan power.

## Exercise: a fourth booth

The workshop proposes a fourth booth, B4, drawing 0.40 m³/s, to join the main between N3 and the fan. Using the same 18 m/s minimum and the standard sizes above, what size should B4's branch be, what flow does the main carry downstream of B4, and does the 250 mm main still work there?

**Worked answer.** B4's exact diameter for 18 m/s is √(4 × 0.40 ÷ (π × 18)) = **168.2 mm**. Rounding down to **160 mm** gives a velocity of 0.40 ÷ (π × 0.16² ÷ 4) = **19.89 m/s**, above the minimum; 180 mm would give 15.72 m/s, below it.

Downstream of B4 the main carries 0.90 + 0.40 = **1.30 m³/s**. In the existing 250 mm duct that would be 26.5 m/s, well above the minimum but with roughly double the 250 mm section's original pressure loss per metre. The exact diameter for 18 m/s is 303.2 mm, so a **280 mm** duct, at 21.11 m/s, is the standard size that keeps above the minimum without running far faster than it needs to. The main from B4 to the fan, and the collector and fan themselves, must be checked for the new flow, which is a bigger question than the branch: adding a booth changes the whole system's duty, as Chapter 6 shows.
