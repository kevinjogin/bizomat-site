---
title: "Fans and ductwork for ventilation and HVAC: fan curves, duct design, extraction and energy"
description: "How fans and ducts move air, how fan and system curves set the operating point, how duct design and fittings drive pressure loss, and how to extract dust and fumes and cut fan energy."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - design
  - operations
  - process-improvement
author: "KEVOS"
featured: false
draft: false
---

Air is the medium that ventilation, air conditioning, dust extraction and fume control all work through, and fans and ducts are how it is moved. Fans run for long hours in most buildings and factories, so they are often among the largest electricity users on a site. They are also among the least examined: once a system is installed, few people check whether it still delivers the air it was designed for, whether filters and dampers are adding unnecessary resistance, or whether the fan is running faster than it needs to.

Moving air well depends on matching the fan to the system it serves. A fan does not deliver a fixed amount of air; it delivers whatever flow results from the balance between the pressure it can generate and the resistance of the ductwork, filters, coils and fittings. Change the resistance and the flow changes. Poorly designed bends, blocked filters or a damper left half closed can starve one area of air while the fan works harder than necessary. Good design and maintenance, on the other hand, can deliver the right air quietly with modest energy use.

This article explains, in general terms, how fans work, how fan and system curves determine the operating point, how ducts and fittings create pressure loss, how local exhaust ventilation captures dust and fumes, and how fan energy can be reduced. It is general information; ventilation systems that control hazardous contaminants or form part of fire safety systems must be designed by qualified people to the relevant standards.

## Types of fans

**Axial fans** move air parallel to the shaft, like a propeller. They handle large flows at low pressure and suit general exhaust, cooling towers and some duct systems. Propeller fans in walls and roofs are the simplest form.

**Centrifugal fans** draw air into the centre of a rotating impeller and throw it outwards into a scroll casing. They generate higher pressures and suit ducted systems with filters and coils. Their impeller blade shape matters:

- **Forward-curved** blades are compact and quiet at moderate pressures, common in smaller air handlers, but can overload their motors if system resistance falls.
- **Backward-curved or backward-inclined** blades are more efficient and have power curves that do not overload, making them common in larger systems.
- **Radial** blades are robust and resist build-up, suiting dust-laden air and material conveying.

**Mixed-flow fans** combine features of both. In modern air handlers, direct-drive **plug fans** with electronically commutated or variable-speed motors are common because they avoid belt losses and allow precise speed control.

## Fan curves and system curves

A fan's performance is shown by its **fan curve**: the pressure it develops at each flow rate when running at a given speed, usually with efficiency and power curves alongside. As flow increases, the pressure a fan can develop falls.

The ductwork and components have their own **system curve**. Resistance in turbulent airflow rises roughly with the square of the flow: doubling the airflow through a duct system requires about four times the pressure. The **operating point** is where the fan curve and system curve cross. If the system resistance turns out higher than designed, perhaps because of extra bends or dirty filters, the operating point moves to a lower flow. If resistance is lower, flow increases and, for some fan types, so does power.

Understanding this relationship explains many common complaints. A system that delivered enough air when commissioned may fall short as filters load up. A fan "upgraded" to a larger size may deliver little extra air if the ducts are the real restriction.

## The fan laws

For a given fan and system, the **fan laws** describe how performance changes with speed:

- Flow is proportional to speed.
- Pressure is proportional to the square of speed.
- Power is proportional to the cube of speed.

The cube law is why speed control saves so much energy. Reducing fan speed by 20% reduces flow by about 20% but power to roughly half, since 0.8 × 0.8 × 0.8 is about 0.51. In practice, losses in motors and drives and the fixed pressure some systems need reduce the savings somewhat, but they remain large. The [selecting electric motors and drives](/reados/collections/machine-elements-and-mechanical-design/selecting-electric-motors-and-drives/) article explains variable-speed drives in more detail.

## Duct design

Ducts carry air from the fan to where it is needed and back. Their design balances space, cost, noise and energy:

- **Velocity**: higher air velocities allow smaller ducts but increase friction, noise and fan energy. Main ducts typically run at higher velocities than branches and outlets in occupied spaces.
- **Friction loss**: air rubbing against duct walls loses pressure along every metre of duct. Smooth, round ducts lose less than rough or flat rectangular ones of the same area.
- **Fittings**: bends, tees, transitions, dampers and grilles create additional losses that can exceed the losses in straight duct. Sharp bends, abrupt changes in size and poorly arranged branches are costly. Turning vanes in rectangular bends, gradual transitions and well-shaped branch takeoffs reduce losses.
- **Leakage**: leaking joints waste air and energy and can draw contaminated air into supply systems. Sealing standards specify acceptable leakage for different duct classes.
- **Balancing**: dampers are adjusted at commissioning so that each outlet receives its design flow.

Designers commonly size ducts by methods that hold friction loss per metre roughly constant or that recover pressure as velocity falls along a run. Whatever the method, the total pressure the fan must overcome is the sum of losses along the most demanding path, so one badly designed fitting on that path affects the whole system. The [pipe flow, pressure drop and pump selection](/reados/collections/fluids-hvac-and-building-services/pipe-flow-pressure-drop-and-pumps/) article explains the same principles for liquids.

## System effects at the fan

Fans are tested in ideal conditions, with smooth, straight ducts at inlet and outlet. In real installations, a bend directly at the fan inlet, a sudden expansion at the outlet or a cramped plenum can reduce performance significantly. These **system effects** are a frequent cause of fans that cannot deliver their rated performance. Allowing straight duct lengths before and after the fan, or using properly designed inlet boxes, avoids most of them.

## Filters, coils and changing resistance

Filters protect equipment and occupants, but their resistance rises as they load with dust. Systems are designed with an allowance for dirty-filter pressure, and pressure gauges across filter banks show when replacement is due. Replacing filters by condition rather than on a fixed calendar balances energy, air quality and cost. Coils, heat recovery devices and silencers add resistance too, and their condition, such as fouled coil fins, affects airflow.

## Constant and variable air volume

**Constant air volume** systems deliver the same airflow at all times and vary the supply temperature. **Variable air volume** systems vary the airflow to each zone according to demand, allowing the fan to slow down at part load. Ventilation for occupants can also be controlled by occupancy or carbon dioxide levels, so that outside air, which must be heated or cooled, is supplied according to the number of people present rather than at maximum all day.

## Capturing dust and fumes: local exhaust ventilation

Where processes produce dust, fumes or vapours, **local exhaust ventilation** captures contaminants at the source before they reach workers' breathing zones. A system includes:

- **Hoods** shaped and positioned to enclose or capture the contaminant. Enclosing hoods are more effective than hoods that must reach out to capture it.
- **Capture velocity**: enough air speed at the source to draw contaminants into the hood against cross-draughts and process motion.
- **Ducts** sized to keep dust in suspension so it does not settle and block them.
- **Air cleaners**, such as filters, cyclones or scrubbers, that remove contaminants before air is discharged.
- **A fan** sized for the whole system resistance, including the air cleaner at its dirtiest.

Local exhaust systems should be tested when commissioned and periodically after that, because hoods are moved, ducts are extended and filters load up over time. Australian ventilation standards and workplace exposure standards apply, and specialist advice is needed for hazardous substances such as silica, welding fumes, wood dust and solvents.

## Fire and smoke

Ducts can carry fire and smoke between parts of a building. Where ducts pass through fire-rated walls and floors, **fire dampers** close to maintain the rating, and some systems are designed to control smoke in a fire. Building regulations and standards govern these requirements, and fire dampers must be inspected and tested as part of essential safety measures maintenance.

## Noise and vibration

Fans and air movement generate noise. Oversized fans running inefficiently, high duct velocities, poorly designed fittings and outlets all add noise. Silencers, lined ducts, lower velocities, flexible connections and vibration isolation mounts reduce noise and stop vibration travelling through the structure.

## Make-up air and building pressure

Every cubic metre of air exhausted from a building must be replaced. If extraction systems remove more air than is deliberately supplied, the building runs at negative pressure: doors become hard to open, unconditioned air is drawn through gaps and loading docks, flues can spill combustion products, and extraction hoods perform worse because they are fighting the building itself. Planning **make-up air**, supplied and, where needed, heated or cooled, keeps the building balanced. When new extraction is added to a site, the make-up air should be reviewed at the same time.

## Measuring airflow

Airflow can be measured in several ways. Technicians traverse ducts with pitot tubes or anemometers at a grid of points to find average velocity, use flow hoods on supply and exhaust grilles, and read differential pressures across fans, coils and filters. Some modern fans report their own airflow from motor and pressure data. Whatever the method, measurements are most useful when compared with design values and with previous readings, so that gradual changes can be seen and corrected before occupants or processes are affected.

## Maintenance

Fan systems need regular attention: checking belts and pulleys on belt-driven fans, lubricating bearings, cleaning impellers that collect dust, changing filters, checking dampers and actuators and measuring airflow and pressures against commissioning records. A drifting system usually shows itself first in pressure readings.

## A worked example

This is an illustrative example. The figures are hypothetical, and actual savings depend on the system and tariffs.

A factory's general exhaust fan has a 15 kW motor and runs at full speed for about 4,000 hours a year, with airflow controlled by a partly closed damper. A ventilation review finds that the required airflow is about 80% of the fan's full-speed flow.

The site installs a variable-speed drive, opens the damper fully and runs the fan at about 80% speed. By the fan laws, power falls to about 0.8³, or roughly 51% of full-speed power: about 7.7 kW instead of 15 kW. Allowing for drive losses, the saving is still about 7 kW. Over 4,000 hours, that is about 28,000 kWh a year, worth roughly $7,000 at $0.25 per kWh, for a drive costing a few thousand dollars installed. The airflow is measured after the change to confirm that the extraction still meets the required rate.

## How this applies to a small Australian business

- **Measure actual airflows and pressures** and compare them with design or commissioning records.
- **Remove unnecessary resistance**, such as dirty filters, crushed flexible duct and part-closed dampers.
- **Use speed control instead of dampers** where flow needs to be reduced, and confirm airflow afterwards.
- **Check hoods and capture velocities** on extraction systems regularly.
- **Inspect fire dampers** as part of essential safety maintenance.
- **Seek specialist advice** for hazardous contaminants and fire and smoke systems.

## Common mistakes

- **Throttling with dampers** instead of reducing fan speed.
- **Bends and obstructions right at the fan**, which cut performance.
- **Extending extraction systems** without checking that the fan can cope.
- **Changing filters too late** or too early.
- **Ignoring commissioning records**, so drift goes unnoticed.
- **Adding extraction without make-up air**, leaving the building under negative pressure.
- **Running ventilation at full outside air** when occupancy is low.

## Frequently asked questions

**Why does a bigger fan not always deliver more air?** Because flow is set by the balance between fan pressure and system resistance. If ducts and fittings are the restriction, a bigger fan adds energy and noise without much extra airflow.

**How often should local exhaust ventilation be tested?** At commissioning and periodically afterwards, at intervals set by the hazard, the regulator's guidance and the system's history. Any change to hoods or ducts should trigger a retest.

## Questions to ask

- Do our ventilation and extraction systems deliver their design airflows today?
- Which fans run at constant speed when demand varies?
- Are any dampers being used to throttle flow that a drive could control instead?
- When were our extraction hoods and fire dampers last tested, and who keeps the results?
- What resistance in our ducts and filters could be removed without reducing protection?

## Bringing it together

Fans deliver whatever flow their curve and the system's resistance allow. Fan type, duct velocity, fittings, system effects, filters and dampers all shape that balance, and the fan laws make speed control one of the most effective ways to save energy. Local exhaust ventilation needs well-designed hoods, adequate capture velocity and regular testing, while fire dampers and noise control complete a sound system. The [HVAC for commercial and industrial buildings](/reados/collections/fluids-hvac-and-building-services/hvac-for-commercial-and-industrial-buildings/) article places fans and ducts within the wider air-conditioning system. Measuring what systems actually deliver, removing unnecessary resistance and matching fan speed to need give cleaner air at lower cost.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. This article is general information and does not replace advice from a qualified ventilation engineer or occupational hygienist.*
