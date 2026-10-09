---
title: "Selecting bearings and lubrication for reliable machines: types, life, fits, sealing and failure causes"
description: "Most bearings fail from contamination, poor lubrication or bad fitting, not fatigue. How to choose bearing types, size them for life, fit, seal and lubricate them, and diagnose failures."
publishDate: 2026-10-09
category: "Engineering"
tags:
  - design
  - operations
  - quality
author: "KEVOS"
featured: false
draft: false
---

Bearings sit in almost every machine: motors, pumps, fans, gearboxes, conveyors, rollers and spindles. When a bearing fails, the machine stops, sometimes with secondary damage to shafts, housings, seals and gears. Replacing the bearing is usually cheap; the downtime, the labour and the damage around it are not.

Bearing catalogues make selection look like arithmetic: calculate the load, look up a bearing with enough rated life, done. Life calculations matter, but in practice many bearings that fail early were large enough. They failed because dirt or water got in, because the lubricant was wrong, too little or too much, because they were hammered on, misaligned or fitted with the wrong interference, or because they were the wrong type for the job. Reliable bearing arrangements come from getting all of these right, not just the size.

This article explains the main bearing types and how to choose between them, how rolling bearing life is calculated, how plain bearings are sized, how fits, clearance, sealing and lubrication affect reliability, and how to read the common failure causes. It is general information for designers, engineers and maintenance teams. Bearing manufacturers publish detailed catalogues, calculation tools and application advice, which should be used for specific designs.

## Rolling and plain bearings

**Rolling element bearings** carry load through balls or rollers running between inner and outer rings. They have low friction from start-up, are standardised and interchangeable, and need relatively little lubricant. **Plain bearings**, also called bushes, sleeves or journal bearings, carry load on a sliding surface, either with a lubricant film or with self-lubricating materials. They are compact, quiet, tolerant of shock and can be split for assembly around shafts.

Rolling bearings dominate in general machinery. Plain bearings remain the best choice for oscillating motions, heavy shock loads, very large sizes, compact pivots, dirty environments with suitable materials and high-speed machines with full oil films, such as turbines and engine crankshafts.

## Choosing a rolling bearing type

Choose the type before the size. Load direction, speed, misalignment, stiffness, noise and sealing needs decide the type; the life calculation then decides the size.

| Type | Strengths | Limitations | Typical uses |
|---|---|---|---|
| Deep groove ball | High speed, moderate radial and some axial load both ways, available sealed and greased for life | Limited misalignment and heavy load capacity | Electric motors, fans, light shafts |
| Angular contact ball | Combined radial and axial loads, high speed and stiffness | Usually used in pairs and needs correct preload | Pumps, spindles, gear shafts |
| Self-aligning ball | Tolerates misalignment | Lower load capacity | Light shafts with deflection or mounting errors |
| Cylindrical roller | High radial capacity, high speed | Little or no axial capacity in many designs; needs good alignment | Gearboxes, motors with belt loads |
| Tapered roller | High combined radial and axial loads | Must be adjusted in pairs; sensitive to setting | Wheel hubs, gearboxes, heavy shafts |
| Spherical roller | Very high radial capacity with misalignment tolerance | Lower speed limits than ball bearings | Conveyor pulleys, vibrating screens, heavy plant |
| Needle roller | High radial capacity in a small radial space | Needs hardened shafts or inner rings; sensitive to misalignment | Compact mechanisms, gearboxes |
| Thrust bearings | Pure axial load | Little or no radial capacity | Vertical shafts, screw jacks |

**Mounted units**, bearings pre-assembled in pillow block or flange housings, are common for conveyors, fans and agricultural machinery. They are quick to install and replace, but their sealing and locking method should suit the duty.

## How rolling bearing life is calculated

Rolling bearings eventually fail by **fatigue** of the raceways, even when perfectly installed and lubricated. Because fatigue varies widely between identical bearings, life is defined statistically. The **basic rating life, L10**, is the number of revolutions that 90% of a group of identical bearings will reach or exceed under the same conditions. The standard method is set out in ISO 281.

Life in millions of revolutions is the ratio of the bearing's **basic dynamic load rating C**, from the catalogue, to the **equivalent dynamic load P**, raised to a power: 3 for ball bearings and 10/3 for roller bearings. Life is therefore very sensitive to load. Doubling the load on a ball bearing reduces its life by a factor of eight; on a roller bearing, by a factor of about ten.

The required life in millions of revolutions is 60 times the speed in rev/min times the required hours, divided by one million. For an electric motor bearing running at 1,450 rev/min for 20,000 hours, that is about 1,740 million revolutions, so a ball bearing needs a load rating about 12 times the equivalent load. For a conveyor pulley bearing running at 120 rev/min for 50,000 hours, it is 360 million revolutions, and a spherical roller bearing needs a load rating about 5.9 times the equivalent load. With an equivalent load of 20 kN, that is a load rating of at least about 117 kN.

The **equivalent load** combines radial and axial loads using factors from the catalogue. Shock and vibration should be allowed for with load factors. Modern methods, including ISO 281's modified life, adjust the basic life for reliability, lubricant film, contamination and a fatigue load limit. These adjustments can raise or reduce the calculated life by large factors, which shows how strongly lubrication and cleanliness affect real bearing life.

A calculated life far beyond what is needed is not always good. Very lightly loaded roller bearings can **skid** instead of rolling, damaging the raceways, so manufacturers specify minimum loads.

## Sizing plain bearings

Bushes running with grease, boundary lubrication or self-lubricating materials are checked against three limits from the material supplier:

- **Bearing pressure P**: load divided by projected area, diameter times length.
- **Sliding speed V**: the shaft's surface speed.
- **PV value**: pressure times speed, a measure of the frictional heat generated per unit area. Heat, rather than strength, usually limits a rubbing bush.

A 20 mm diameter bush, 25 mm long, carrying 2 kN at 500 rev/min has a bearing pressure of 4 MPa, a sliding speed of about 0.52 m/s and a PV of about 2.1 MPa·m/s. The chosen bush material must exceed all three values with margin. Length-to-diameter ratios around 1 are a common compromise between load spreading and tolerance of misalignment.

Oil-lubricated journal bearings at higher speeds work on a different principle: the rotating shaft drags oil into a converging gap and builds a pressure film that lifts the shaft off the bearing entirely. Their design needs clearance, viscosity, load and speed to be considered together and is a specialist task.

## Fits, clearance and mounting

Bearing rings must be fitted correctly to the shaft and housing:

- **The rotating ring relative to the load needs an interference fit.** Usually this is the inner ring on a rotating shaft. A loose fit lets the ring creep, wearing the shaft and generating heat.
- **The stationary ring** can usually have a looser fit, which also allows one bearing to float axially for thermal expansion.
- **One bearing locates, the other floats** in most shafts, so thermal expansion does not load the bearings axially.

Interference fits and temperature differences reduce a bearing's **internal clearance**. Bearings are supplied in clearance classes, such as normal and the larger C3, and the class should suit the fits and operating temperatures.

**Mounting** must never drive force through the rolling elements. Use fitting tools that press on the ring being fitted, induction heaters to expand inner rings within the manufacturer's temperature limit, or hydraulic methods for large bearings. Hammering bearings on, or heating them with a flame, damages them before they start.

## Shaft alignment and support

Misalignment between bearings, from shaft deflection, housing errors or poor installation, overloads raceway edges and shortens life. Self-aligning ball and spherical roller bearings tolerate misalignment; cylindrical and tapered roller bearings do not. Housings should be stiff, flat and machined in line, and couplings between machines should be aligned with suitable tools.

## Lubrication

The lubricant's main job is to separate the rolling or sliding surfaces with a film. It also cools, protects against corrosion and helps keep contaminants out.

### Grease or oil

- **Grease** is used in most rolling bearings. It stays in place, helps seal and needs simple housings. Sealed, greased-for-life bearings remove relubrication entirely for many applications.
- **Oil** is used for high speeds and temperatures, where heat must be carried away, and where gears and bearings share a lubricant.

### Viscosity

**Viscosity** is the most important lubricant property. Industrial oils are graded by ISO viscosity grade, where the number is the viscosity in centistokes at 40 °C, such as ISO VG 68. Slow, heavily loaded bearings need higher viscosity; fast, lightly loaded bearings need lower. Viscosity falls as temperature rises, so the viscosity at operating temperature is what counts. Bearing manufacturers provide methods to check that the lubricant gives an adequate film.

The film must be thick compared with the surface roughness. The ratio of film thickness to combined roughness, often called lambda, indicates whether surfaces are fully separated, in mixed contact or in boundary contact, where additives in the lubricant do the protecting.

### Quantity and intervals

Too little grease starves the bearing; too much causes churning, heat and seal damage. Follow the manufacturer's guidance for initial fill, relubrication quantity and interval, which depend on bearing size, speed, temperature and contamination. Use the right grease type and do not mix incompatible greases.

## Sealing and contamination

Contamination is one of the most common causes of premature bearing failure. Hard particles dent raceways; water causes corrosion and degrades lubricants. Choose seals for the environment:

- **Contact seals** such as lip seals give good protection but add friction and wear.
- **Non-contact seals** such as labyrinths suit high speeds and add little friction.
- **Combined seals**, often with grease-filled labyrinths, suit dirty and wet environments such as quarries, mines and food washdown areas.

Keep lubricants clean in storage, clean grease fittings before use and check seals during maintenance.

## Reading bearing failures

| Appearance | Likely cause |
|---|---|
| Flaking or spalling of raceways | Fatigue, often accelerated by overload, poor lubrication or contamination |
| Dents and indentations | Hard particle contamination or impact during mounting |
| Rust and etching | Water ingress or condensation |
| Discoloured, overheated components | Inadequate or excessive lubrication, too little clearance |
| Wear tracks off-centre or at an angle | Misalignment or incorrect axial loading |
| Fluting, washboard-like patterns | Electric current passing through the bearing, for example from variable speed drives |
| Marks at rolling element spacing on a stationary machine | Vibration while not rotating, called false brinelling |
| Worn shaft or housing seats | Ring creep from loose fits |

Bearing manufacturers publish failure analysis guides with images. Keep failed bearings for examination rather than discarding them. The [maintenance that prevents breakdowns](/insights/maintenance-that-prevents-breakdowns/) article covers condition monitoring, such as vibration analysis, that detects bearing deterioration before failure.

## A worked example

This is an illustrative example. A food business runs several screw conveyors in a washdown area. Their bearings are replaced roughly every six months, with each failure stopping a line for several hours. The bearings were sized with calculated lives of many years, so fatigue is unlikely to be the cause.

**Investigation.** Maintenance staff examine failed bearings and find rust, dents and grease washed out. Grease is applied weekly by hand, often in large quantities, and washdown water is sprayed directly at the bearing housings. On one conveyor, a worn shaft shows the inner ring has been creeping because of a loose fit.

**Changes.**

- Mounted units with stainless housings and multi-lip washdown seals replace the existing units.
- Grease type and quantity are standardised to the manufacturer's recommendations, with a set interval and the quantity per shot recorded.
- Washdown procedures avoid spraying directly at seals.
- The worn shaft is repaired and the bearing fit corrected.
- Vibration readings are added to monthly inspections.

**Result.** Over the following year, bearing failures fall from about twice a year per conveyor to occasional planned replacements found by inspection. The cost of the new housings is recovered quickly through avoided downtime. The [putting a dollar value on equipment losses](/insights/putting-a-dollar-value-on-equipment-losses/) article shows how to calculate the value of improvements like this.

## Applying this in an Australian business

- **Choose the bearing type** for load direction, speed, misalignment and environment before sizing.
- **Size for the required life** using catalogue methods, including load factors.
- **Specify fits and clearance** to suit rotation, loads and temperatures.
- **Arrange one locating and one floating bearing** on each shaft.
- **Mount bearings properly**, never through the rolling elements.
- **Choose lubricant viscosity and quantity** for the operating conditions.
- **Seal for the environment** and keep lubricants clean.
- **Examine failed bearings** to find root causes.

## Where bearing arrangements go wrong

- **Sizing only by load**, ignoring sealing and lubrication.
- **The wrong type**, such as cylindrical rollers where misalignment is unavoidable.
- **Loose fits** on rotating rings.
- **Hammering bearings** on and off.
- **Over-greasing or under-greasing**, or mixing greases.
- **Seals unsuited** to dust, water or washdown.
- **Replacing failed bearings** without asking why they failed.

## Questions to ask about a bearing arrangement

- What loads, speeds, misalignment and temperatures will the bearings see?
- Which bearing locates the shaft and which floats?
- Are the fits and internal clearance suited to the duty?
- What lubricant, quantity and interval have we specified, and why?
- How will dirt and water be kept out?
- What did the last failed bearing show?

## Bringing it together

Reliable bearings come from the whole arrangement, not just the size. Choose the type for the duty, size it for the required life with suitable load factors, and specify fits, clearance and the locating and floating arrangement. Mount bearings with proper tools, align shafts and housings, choose lubricant viscosity and quantity for the conditions, and seal against the environment. When bearings fail, examine them to find the cause. The result is machines that run longer between stoppages and cost less to maintain.

---

*Source: KEVOS editorial notes, drawing on earlier KEVOS engineering handbooks on rolling element bearing selection, fits and installation, thrust bearings, plain and journal bearings, and lubricants and lubrication, together with established bearing practice. The worked example is illustrative. This article is general information; use bearing manufacturers' catalogues and advice for specific designs.*
