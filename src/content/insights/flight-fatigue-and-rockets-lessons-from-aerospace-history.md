---
title: "Flight, fatigue and rockets: what aerospace history teaches about development, control and repeated loads"
description: "The Wright brothers, the sound barrier, the Comet airliner and the rocket equation show how to find the governing problem, test cheaply and design for repeated loads."
publishDate: 2026-10-09
category: "Ideas"
tags:
  - product-development
  - design
  - quality
author: "KEVOS"
featured: false
draft: false
---

In 1903, the first sustained, controlled, powered aeroplane flight lasted twelve seconds. Sixty-six years later, people walked on the Moon and returned safely. Few fields have moved so far so quickly, and few have recorded their failures as thoroughly. Aerospace engineering was shaped as much by crashes, investigations and changes to certification rules as by breakthroughs, and its methods for development, testing and structural design have spread into almost every other industry.

The history is full of lessons that apply far from aircraft. The Wright brothers succeeded because they identified the problem that actually governed flight and built a way to test it cheaply. The sound barrier turned out to be a control problem rather than a wall of drag. The de Havilland Comet showed that a structure strong enough for any single load could still fail under the repeated loads of ordinary service. The rocket equation shows how some costs multiply rather than add.

This article traces those developments, along with related advances in air conditioning, sailing and Australian aviation, and draws out lessons for engineers, product developers and managers about governing problems, testing, control, repeated loads and accumulated costs. It is general information for readers in any industry.

## Powered flight: control was the hard part

By 1900, the principles of lift were reasonably well understood, and light engines were becoming available. Several serious experimenters had built machines that could generate lift. What none had solved was **control**. An aircraft that lifts but cannot be controlled about all three axes, pitch, roll and yaw, will not stay in the air, and a pilot cannot learn to fly a machine that is wrecked on every attempt.

Wilbur and Orville Wright, bicycle makers from Ohio, treated control as the governing problem. Their approach was methodical:

- **They measured for themselves.** Published data on wing performance proved unreliable, so in 1901 they built a small wind tunnel and tested many wing shapes.
- **They iterated where failure was survivable.** They learned to control gliders through hundreds of flights at Kitty Hawk, North Carolina, before adding an engine.
- **They designed integrated control.** Twisting the wings, called wing warping, controlled roll; a rudder controlled yaw; and a forward elevator controlled pitch. Linking roll and yaw allowed coordinated turns.
- **They built what did not exist.** No suitable engine was available, so their mechanic Charles Taylor built one of about 12 horsepower. They designed propellers by treating each blade as a rotating wing, rather than copying ship propellers, and achieved high efficiency.

On 17 December 1903 they made the first sustained, controlled, powered flights. The lasting contribution was the method: identify the unknown that governs success, build a way to measure it, iterate cheaply where failure can be survived, and integrate the full system last.

### An Australian contribution

In Australia, Lawrence Hargrave experimented with flying machines in the 1880s and 1890s and developed the **box kite**, a stable lifting structure. In 1894, at Stanwell Park south of Sydney, a train of four box kites lifted Hargrave off the ground. Hargrave published the work rather than patenting it, and box-kite structures influenced several early European aircraft designs.

## Air conditioning: solving the real requirement

In 1902, the American engineer Willis Carrier designed a system for a printing works in Brooklyn, New York, where changes in humidity made paper expand and shrink, spoiling colour registration. The aim was to control humidity; cooling was the means. Carrier's later work on the relationships between temperature, humidity and moisture provided a basis for air conditioning design.

Air conditioning began as an industrial process control for printing, textiles and other manufacturing, and only later became a comfort technology. Defining the real requirement, stable humidity rather than cool air, led to the right solution.

## Faster than the wind: sailing hydrodynamics

The America's Cup, first raced in 1851, became a long-running engineering contest within strict design rules. A sailing boat moving across the wind experiences an apparent wind, the combination of the true wind and the wind created by its own motion. As the boat accelerates, the apparent wind strengthens and shifts forward, letting a well-designed boat sail faster than the wind itself. Modern America's Cup yachts use rigid wing sails and hydrofoils that lift the hull clear of the water.

Australia II's victory in 1983, with its innovative winged keel designed by Ben Lexcen, ended the New York Yacht Club's 132-year hold on the Cup and remains a celebrated moment in Australian sport and design.

The racing rules offer a further lesson. When rules banned powered pumps for the hydraulic systems controlling sails and foils, the need for power did not disappear; crews generated it by hand, becoming part of the power system. When a constraint forbids one solution, the requirement reappears somewhere else.

## Rockets and the rocket equation

In 1926, the American physicist Robert Goddard launched the first liquid-fuelled rocket, which flew for about two and a half seconds. Liquid propellants mattered because they can be throttled, stopped and restarted, giving control that solid rockets lacked.

Rocket design is governed by the **rocket equation**: the change in velocity a rocket can achieve depends on its exhaust velocity and on the natural logarithm of the ratio between its starting mass and its final mass. Because of the logarithm, achieving a larger velocity change needs a disproportionately larger amount of propellant. Every kilogram of structure that stays on board must be accelerated for the whole flight, which is why rockets discard empty stages and why aerospace engineers track mass rigorously from the earliest design stage.

The broader lesson is that some costs **compound** rather than add. Weight in vehicles, delays early in a schedule and complexity in software can all multiply through a system, and they deserve tighter control than their direct cost suggests.

The Apollo program, which landed astronauts on the Moon in July 1969, depended as much on management methods as on rockets. Coordinating hundreds of thousands of people across government and contractors required disciplined systems engineering, configuration management and testing of whole systems rather than parts alone. Its worst setback came on the ground: in 1967, a fire during a launch rehearsal killed the three-person crew of Apollo 1 inside a cabin filled with pure oxygen at above-atmospheric pressure. The investigation led to major changes to the spacecraft, including a faster-opening hatch, fewer flammable materials and a different cabin atmosphere on the launch pad. A test condition had been more dangerous than the mission it was meant to prepare for.

## The sound barrier: when a control stops working

During the Second World War and after, aircraft diving at speeds approaching the speed of sound suffered violent buffeting and loss of control, and some test pilots died. The phrase "sound barrier" suggested a wall of drag. Drag did rise sharply, but the deadlier problem was control. As airflow over the wings and tail approached the speed of sound, shock waves formed. A conventional elevator, a hinged flap at the back of the tailplane, could no longer change the airflow ahead of the shock, so pulling back on the control column achieved little.

On 14 October 1947, the rocket-powered Bell X-1 flew faster than sound in level flight. A key feature was a tailplane whose whole surface could move, so the pilot could still change its angle and keep control through the transonic region. The fix came from asking whether the mechanism of control still worked, rather than from applying more force to a control that had stopped working.

## The Comet: strong enough once, not a thousand times

The de Havilland Comet, which entered service in 1952 as the world's first jet airliner, was fast, smooth and quiet, cruising high above the weather. Flying at high altitude needs a pressurised cabin, so the fuselage is inflated and deflated on every flight. Each flight is a load cycle.

In 1954, two Comets broke up in flight. Investigators at the Royal Aircraft Establishment at Farnborough placed a complete fuselage in a water tank and repeatedly pressurised and depressurised it, simulating flights. After a number of cycles, the fuselage failed. Fatigue cracks had started at a stress concentration near the corner of a cutout in the pressurised skin and grown until the structure failed. The design was strong enough for any single load; it was not designed adequately for repeated loads concentrated at corners.

The investigation changed how aircraft structures are designed and certified. Over the following decades, design philosophies developed:

| Approach | Assumption | What it requires |
|---|---|---|
| Static strength | The structure must carry its maximum loads | Strength testing |
| Safe life | No significant crack will form within a set life | Fatigue testing and retirement at a set number of cycles |
| Fail safe | Cracks will occur, but the structure must still carry load with a part failed | Redundant load paths and crack stoppers |
| Damage tolerance | Cracks may exist from manufacture, so their growth must be slow and detectable | Crack growth analysis and inspection intervals set to find damage before it becomes critical |

### The flight recorder

The Comet accidents also inspired an Australian invention. David Warren, a scientist at the Aeronautical Research Laboratories in Melbourne, worked on the Comet investigation and saw how little evidence survived a crash. In the 1950s Warren developed a prototype device to record cockpit voices and instrument readings, the forerunner of the flight recorders now carried by airliners worldwide. Recording what happened so failures can be understood became a principle of aviation safety.

## Lessons for engineering and business

### Find the governing problem

The Wrights won by solving control while others focused on lift and power. In any development project, ask which unknown will decide success, and work on it first.

### Measure for yourself when data matters

The Wrights tested wing data rather than trusting published tables. When a decision depends on data, check its source and, where it matters, measure it yourself.

### Test cheaply where failure is survivable

Gliders came before powered aircraft. Prototypes, simulations and small trials let teams learn before failures become expensive. The [experiment before you standardise](/insights/designed-experiments-before-standardising/) article explains how designed experiments find robust settings.

### When a control stops working, question the mechanism

Applying more of something that no longer has an effect, more pressure on staff, more discounts or more inspection, rarely helps. Ask whether the mechanism still works.

### Design for repeated loads

Products, structures and machines that see repeated loading need fatigue assessment, especially at welds, holes, corners and joints. The [durability is sustainability](/insights/durability-is-sustainability/) article covers designing for the loads a product will actually face, and the [choosing metals for engineered parts](/insights/choosing-metals-for-engineered-parts/) article explains why weld details often govern fatigue strength.

### Plan inspection around how damage grows

Damage-tolerance thinking applies to any critical asset: understand how damage starts and grows, and set inspection intervals so it is found in time.

### Control compounding costs

Mass in rockets, early delays in projects and complexity in systems multiply through everything that follows. Track them closely from the start.

### Record what happens

Flight recorders made failures understandable. Logging data from machines, processes and incidents allows learning instead of guessing.

## A worked example

This is an illustrative example. A manufacturer has built about 400 heavy-duty trailers over three years. Cracks begin to appear in some trailers near a rectangular cutout in the chassis rails, where hydraulic lines pass through, after roughly 150,000 kilometres of service. Twelve trailers are affected.

**Find the mechanism.** Engineers inspect the cracked rails and confirm fatigue cracking starting at the sharp corners of the cutouts, close to a weld. The original design had been checked for static strength under maximum load, but not for the repeated loads from rough roads.

**Test cheaply.** The company fits strain gauges to a trailer on a typical route and records the loads. It then builds a test rig that applies those load cycles to sample rail sections. The rig reproduces the cracking within weeks, rather than the years it took in service.

**Redesign.** The cutouts are moved to a lower-stress area, given generous corner radii and kept away from welds. Rig tests show the revised detail survives several times the cycles of the original.

**Damage tolerance for the fleet.** For trailers already in service, the company calculates how quickly a crack might grow and sets an inspection interval of 25,000 kilometres, with clear criteria for repair, while it offers owners a retrofit reinforcement. It notifies owners promptly and keeps records of inspections.

**Result.** No further failures occur, the retrofit program is completed over a year, and fatigue checks become a standard step in the company's design reviews.

## Applying these lessons in an Australian business

- **Identify the governing unknown** in each development project.
- **Check critical data** rather than relying on published or assumed figures.
- **Prototype and test cheaply** before committing to full builds.
- **Question the mechanism** when a control stops producing results.
- **Assess fatigue** where products or structures see repeated loads.
- **Set inspection intervals** based on how damage develops.
- **Log operating and failure data** so problems can be understood.

## Questions worth considering

- What is the governing problem in our current development project?
- Which data that our decisions depend on have we never checked?
- Where could we learn through cheap tests instead of expensive failures?
- Which of our products or assets experience repeated loads that we have not assessed?
- Which costs in our business compound rather than add?

## Bringing it together

Aerospace engineering advanced through method as much as invention. The Wright brothers solved control by measuring for themselves and testing cheaply; air conditioning began by solving the real requirement; the sound barrier yielded to a better control mechanism; the rocket equation showed how some costs compound; and the Comet accidents taught the world to design for repeated loads and to record what happens when things fail, with an Australian scientist inventing the flight recorder. For any business, the lessons are to find the governing problem, test where failure is cheap, question mechanisms that stop working, design for repeated loads and learn from recorded evidence.

---

*Source: KEVOS editorial notes, drawing on an earlier KEVOS engineering history series on powered flight, sailing hydrodynamics, air conditioning, jet airliners, supersonic flight and spaceflight, together with established histories of aviation and engineering. The worked example is illustrative. This article is general information; structural and fatigue design must be carried out by appropriately qualified engineers.*
