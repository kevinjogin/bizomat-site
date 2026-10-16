---
title: "Gears and gearboxes: choosing reducers and geared motors that last"
description: "A gearbox chosen on ratio and price alone can overheat, waste energy or let a load run back. How gear types differ and how to select, install and maintain reducers and geared motors."
publishDate: 2026-10-09
category: "Engineering"
tags:
  - design
  - operations
  - quality
author: "KEVOS®"
featured: false
draft: false
---

Most machines need a motor's high speed and low torque converted into low speed and high torque. Conveyors, mixers, agitators, screw feeders, winches, rotating tables and gates all depend on a gearbox, often a standard reducer or a geared motor bought from a catalogue. Selection looks simple: find the ratio, find a unit with enough torque, check the price.

Gearbox problems usually come from what that simple process leaves out. A worm gearbox that is mechanically adequate overheats on continuous duty. A unit with a sprocket hung on its output shaft wrecks its output bearing. A cheaper, less efficient gearbox costs more in electricity every year than the price difference. A worm drive assumed to be self-locking lets an inclined conveyor run backwards when the power fails. Each of these has a standard check that a good selection includes.

This article explains the main gear and gearbox types, the gear basics that affect life and noise, a practical selection procedure covering torque, service factor, efficiency, thermal rating and shaft loads, and how to install, lubricate and maintain gearboxes. It is general information for designers, engineers and maintenance teams. Gearbox manufacturers publish selection data and offer application support, which should be used for specific designs.

## Gear types

| Type | Shaft arrangement | Characteristics | Typical uses |
|---|---|---|---|
| Spur | Parallel | Simple, efficient, noisier at speed, no axial thrust | Low-speed drives, simple mechanisms |
| Helical | Parallel | Quieter and stronger than spur, produces axial thrust | Most industrial gearboxes |
| Bevel | Intersecting, usually at right angles | Straight or spiral teeth; spiral bevels are quieter and stronger | Right-angle drives |
| Worm and wheel | At right angles, not intersecting | High ratio in one stage, compact, quiet; efficiency falls as ratio rises | Compact right-angle reducers, light to moderate duties |
| Planetary | Coaxial | Very high torque in a compact package, load shared between several planet gears | High-torque drives, servo gearheads, slewing drives |

Efficiency differs widely. A good helical or bevel stage typically loses only one or two per cent of the power passing through it. Worm gears lose more, from sliding between the worm and wheel, and low-efficiency, high-ratio worm sets lose a substantial share of input power as heat.

## Gear basics that affect life and noise

The **velocity ratio** of a gear pair is the number of teeth on the driven gear divided by the number on the driving gear. The smaller gear is the **pinion** and the larger the **wheel**. For a worm gear, the ratio is the number of wheel teeth divided by the number of starts on the worm.

A single gear pair is usually limited to a ratio of about 5 or so; larger ratios use several stages in a **compound train**, where ratios multiply. A ratio of 125 from a single pair would need an impractically large wheel, while three stages of 5 each give the same ratio compactly.

Other basics:

- **Module** is the pitch diameter in millimetres divided by the number of teeth, and sets tooth size. Gears that mesh must have the same module and pressure angle, normally 20 degrees.
- **Minimum teeth**: pinions with too few teeth are weakened by undercutting. A common working rule is at least about 17 teeth for a standard spur pinion, fewer for helical pinions.
- **Hunting teeth**: when the two tooth counts share no common factor, each tooth meets every tooth on the other gear in turn, spreading wear. A 21-tooth pinion with a 38-tooth wheel repeats contacts only every 38 pinion revolutions, while a 19-tooth pinion with a 38-tooth wheel repeats every 2, for a ratio within about 10% of the first.
- **Pinion harder than the wheel**: the pinion's teeth work more often, so making it harder balances wear.
- **Backlash**: a small clearance between teeth, needed for lubrication and thermal expansion. It matters in positioning drives, where low-backlash gearheads are used.

## Gear materials and ratings

Gear teeth fail in two main ways: **bending fatigue**, where a crack starts at the root of a tooth and the tooth breaks off, and **contact fatigue**, where repeated rolling and sliding pressure causes pitting on the tooth flanks. Gear rating methods, such as ISO 6336 and the AGMA standards, calculate the capacity of a gear pair against both, taking account of materials, heat treatment, accuracy, lubrication and load sharing.

Materials and treatments follow the duty:

- **Through-hardened alloy steels** suit moderate loads and are economical to make.
- **Case-carburised and ground steels** carry the highest loads in the smallest size and are used in most modern industrial gearboxes.
- **Nitrided steels** give hard, wear-resistant flanks with low distortion.
- **Bronze worm wheels** run against hardened steel worms, giving good sliding properties.
- **Cast iron** suits large, slow, lightly loaded gears.
- **Engineering plastics** such as acetal and nylon suit light, quiet drives, often running without lubrication.

Gear accuracy is classified in grades under ISO 1328. Higher accuracy reduces noise and dynamic loads at speed but costs more to make. For bought gearboxes these choices are made by the manufacturer, but they explain why units of the same size can carry very different torques.

## Selecting a gearbox

### 1. Define the duty

Gather the driven machine's torque or power, output speed and any speed tolerance, the type of load (uniform, moderate shock or heavy shock), hours per day, starts per hour, ambient temperature, mounting position and any loads on the output shaft from sprockets, pulleys or gears.

Output torque in newton metres is 9,550 times power in kilowatts divided by speed in rev/min. A conveyor needing 2.2 kW at 30 rev/min needs about 700 N·m at the gearbox output.

### 2. Calculate the ratio

The ratio is input speed divided by output speed. Four-pole motors on 50 Hz supply run at about 1,450 rev/min under load, so 30 rev/min output needs a ratio of about 48. Catalogue ratios are nominal; check the actual ratio of the chosen unit and calculate the real output speed.

### 3. Apply a service factor

Catalogue ratings assume steady, single-shift loads. A **service factor** from the manufacturer's tables increases the required rating for shock loads, longer running hours and frequent starts. Multiply the required output torque or input power by the service factor, then choose a unit whose rating exceeds the result. With a factor of 1.25, the conveyor above needs a unit rated for at least about 875 N·m.

### 4. Check efficiency and motor power

Motor power must cover the output power divided by the gearbox efficiency. For the conveyor, a helical-bevel unit at about 95% efficiency needs about 2.3 kW of input; a worm unit at this ratio might be around 70% efficient and need about 3.1 kW, which may require a larger motor.

### 5. Check the thermal rating

Gearboxes turn lost power into heat, which the housing must dissipate without the oil overheating. Continuous running, especially for worm gearboxes and in hot ambient conditions, can exceed the **thermal rating** even when the mechanical rating is ample. If the thermal check fails, options include a larger unit, synthetic lubricant, a cooling fan or an oil cooler, as advised by the manufacturer.

### 6. Check output shaft loads

Sprockets, pulleys and gears mounted on the output shaft apply **overhung loads** to the output bearings. Check them against the catalogue limits, which depend on where along the shaft the load acts. Where they are exceeded, mount the component closer to the housing, use a larger sprocket or pulley, or carry it on a separate shaft with its own bearings, connected by a coupling. Axial loads also need checking.

### 7. Consider holding and backdriving

When a load can drive the gearbox backwards, such as an inclined conveyor, a hoist or a gate, specify a **brake** or a **backstop** as required. Worm gearboxes are sometimes described as self-locking, but self-locking depends on ratio, efficiency, lubrication and vibration, and cannot be relied on as a safety function. Lifting and holding applications have additional safety requirements and standards.

### 8. Repeat the checks if the selection changes

A larger unit chosen for thermal or overhung load reasons may have a different actual ratio, so recheck speed and torque.

## Geared motors and variable speed drives

**Geared motors** combine the motor and gearbox in one unit, saving space, alignment and coupling costs. They suit most conveyor, mixer and general drives. Separate motor and gearbox arrangements suit larger powers and situations where either part may need to be changed independently.

**Variable speed drives** allow speed adjustment and soft starting, reducing shock on gears and couplings. At low speeds, check that the motor can produce the required torque without overheating, as self-cooled motors lose cooling when slowed. Speed changes made electronically may let a business use one gearbox ratio across several applications.

## Installation

- **Mount on a rigid, flat base**, so the housing is not distorted when bolted down.
- **Align couplings** between motor, gearbox and driven machine with suitable tools.
- **Specify the mounting position** when ordering. Oil quantity, breather and drain positions and sometimes bearing lubrication depend on it.
- **Fit breathers** and remove transport plugs as instructed.
- **Guard** couplings, shafts and drives.

## Lubrication and maintenance

- **Use the specified oil type and grade.** Some synthetic oils, such as polyglycols, are incompatible with mineral oils and some seals; never mix without checking.
- **Change the oil** after the running-in period recommended by the manufacturer, then at regular intervals based on temperature and hours.
- **Check oil level, temperature, noise and vibration** at routine inspections.
- **Use oil analysis** on critical gearboxes to detect wear and contamination early.
- **Watch for leaks** and replace seals before contamination gets in.

The [maintenance that prevents breakdowns](/reados/collections/lean-and-continuous-improvement/maintenance-that-prevents-breakdowns/) article covers condition monitoring routines that apply directly to gearboxes.

## Common gearbox failures

- **Overheating**: thermal rating exceeded, wrong oil or blocked cooling.
- **Tooth pitting and wear**: overload, inadequate lubrication or contaminated oil.
- **Scuffing**: breakdown of the oil film under high load and sliding, often from wrong oil viscosity.
- **Tooth breakage**: shock loads, jams or fatigue.
- **Output bearing failure**: excessive overhung load.
- **Oil leaks**: worn seals, blocked breathers or overfilling.
- **Housing or shaft cracking**: soft or uneven foundations and misalignment.

## A worked example

This is an illustrative example. An inclined conveyor is driven by a worm gearbox with a ratio of about 48, selected some years ago because it was the cheapest unit with enough torque. The conveyor runs about 6,000 hours a year. The gearbox runs hot, the oil darkens quickly and the wheel shows wear. On one occasion, the conveyor ran backwards after a power interruption, spilling material.

**Analysis.** The conveyor needs about 2.2 kW at the gearbox output. At about 70% efficiency, the worm gearbox draws about 3.1 kW. A helical-bevel geared motor at about 95% efficiency would draw about 2.3 kW. The difference, about 0.8 kW for 6,000 hours a year, is about 4,900 kWh, or roughly $1,200 a year at 25 cents a kilowatt-hour. The worm unit is also running close to its thermal limit in summer, and its self-locking cannot be relied on.

**Changes.**

- A helical-bevel geared motor is selected with a service factor suited to the conveyor's starts and loads.
- A backstop is fitted to prevent reverse running.
- The drive sprocket is moved closer to the gearbox housing to reduce overhung load.
- Oil changes and temperature checks are added to the maintenance plan.

**Result.** The new drive runs cooler, the energy saving pays back the price difference within a few years, and the backstop removes the run-back risk. The [buying for the whole life of equipment](/reados/collections/investment-appraisal-and-business-cases/buying-for-the-whole-life-of-equipment/) article explains how to compare options like these on whole-of-life cost.

## Applying this in an Australian business

- **Define the duty fully**, including loads, hours, starts, ambient temperature and shaft loads.
- **Use the actual ratio** and confirm the output speed.
- **Apply realistic service factors.**
- **Compare efficiency and energy cost**, not just purchase price.
- **Check thermal ratings** for continuous duty and hot locations.
- **Check overhung and axial loads** on the output shaft.
- **Fit brakes or backstops** where loads can run back.
- **Specify mounting position and lubricant**, and maintain oil and seals.

## Where gearbox selection goes wrong

- **Choosing by ratio and price alone.**
- **Skipping the thermal check** on continuous duty.
- **Sprockets far out on the output shaft.**
- **Relying on worm self-locking** to hold loads.
- **Ignoring efficiency** and running cost.
- **Mixing incompatible oils.**
- **Mounting on soft or uneven bases.**

## Questions to ask when choosing a gearbox

- What torque, speed, load type and duty hours will this gearbox see?
- What service factor applies, and does the selected unit's rating exceed it?
- How efficient is it, and what will it cost to run each year?
- Does it pass the thermal check at our highest ambient temperature?
- What overhung and axial loads act on the output shaft?
- Can the load drive the gearbox backwards, and how is that prevented?

## Bringing it together

A gearbox selection is more than a ratio and a torque rating. Define the duty fully, apply service factors for shock, hours and starts, and choose the gear type with efficiency and running cost in mind. Check thermal ratings, overhung and axial loads, and backdriving, and repeat the checks if the selection changes. Install on rigid bases with aligned couplings, specify the mounting position and lubricant, and maintain oil, seals and condition checks. The result is drives that run cool, use less energy, hold their loads safely and last for many years.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® engineering handbooks on gearboxes and geared motors, worm gearbox selection, gear geometry, types, rating and selection, spur, helical, bevel and worm gearing, and gear trains, together with established power transmission practice. The worked example is illustrative. This article is general information; use manufacturers' selection data for specific designs.*
