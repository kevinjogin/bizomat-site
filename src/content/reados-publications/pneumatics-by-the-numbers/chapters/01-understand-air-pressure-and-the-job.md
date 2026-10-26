---
book: pneumatics-by-the-numbers
chapterSlug: understand-air-pressure-and-the-job
order: 1
title: "Understand air, pressure and the job"
description: "Start a pneumatic design with the job in numbers, gauge and absolute pressure, free air, compressibility and the cost of compressed air, then decide whether pneumatics suits the task."
draft: false
---

Pneumatic design usually starts at the catalogue: a cylinder that looks about the right size, a valve the maintenance team already stocks, a pressure that is whatever the factory happens to run at. That is how many machines are built, and many of them work. The ones that do not tend to fail in the same few ways: too little force at the end of a long pipe, too slow for the line, too violent at the end of the stroke, too thirsty for the compressor, or too dangerous to work on. Nearly all of those failures trace back to a job that was never written down in numbers.

This chapter writes the reject station's job down. It states what the pusher must do, sets out the units the rest of the book uses, explains gauge and absolute pressure and why the difference matters for every air calculation, describes what compressibility means for a machine designer, counts what compressed air costs as a form of energy, and decides whether a pneumatic cylinder is the right answer at all. The failure case is the air-jet reject on line 1, which was cheap to buy and expensive in every other way.

## The job in numbers

The packing business's line 2 fills, seals and weighs cartons of dry goods. A checkweigher after the sealer weighs every carton and signals when one is underweight. The new reject station must push that carton sideways off the belt into a chute before it reaches the palletiser.

```figure
type: stats
title: The reject station's job
caption: This is an illustration of the brief the maintenance lead wrote before choosing any component. Every later calculation in the book starts from these numbers.
- *40 a minute | Line rate | one carton every 1.5 seconds at a belt speed of 0.4 m/s
- 4 kg | Heaviest carton | 300 mm long in the direction of travel, 250 mm wide
- 300 mm | Pusher stroke | the belt's width plus clearance into the chute
- 1.0 s | Time for a full extend and retract | leaves margin before the next carton arrives
- 2% | Expected reject rate | from three months of checkweigher records
- 5 bar | Lowest pressure expected at the machine | measured during the busiest hour
```

Three of those numbers deserve comment. The time budget, 1.0 seconds for a complete cycle, comes from the line: cartons arrive every **0.6 m ÷ 0.4 m/s = 1.5 s**, and the pusher must be fully back before the next carton reaches it, with margin for variation in spacing. The reject rate tells the designer how often the pusher works, which matters for air consumption and wear but not for its size. And the lowest pressure, 5 bar, is a measurement, not the compressor's setting. Chapter 6 explains why the two differ.

## Measure the pressure where the air is used

The 5 bar figure came from a week of measurement. The maintenance lead fitted a small pressure logger to the air drop beside line 2, where the new station would connect, and left it recording every ten seconds through a full production week. The compressor was set to run between 7 and 7.5 bar, and the gauge in the compressor room never read below 7. At the line, the logger showed about 6.4 bar for most of the day, falling to just above **5 bar** for a few minutes at a time when the workshop's blow guns and line 1's sealer were working together.

A single glance at a gauge would have suggested 6 bar or more. Designing to that figure would have produced a pusher that worked on most strokes and failed on a few, at exactly the times the factory was busiest. Measuring at the point of use, over long enough to catch the worst hour, costs a logger hire and a week of patience.

## The units the book uses

Pressure in Australian industry is usually given in **bar** or **kilopascals**. One bar is 100 kPa, or 0.1 MPa, and a little over 14.5 pounds per square inch, the unit still printed on many imported gauges. Force is in newtons, and areas of pistons are most convenient in square millimetres.

One coincidence makes pneumatic force easy to work out by hand. A pressure of 1 MPa is 1 newton per square millimetre. So the force a piston produces, in newtons, is the pressure in megapascals multiplied by the piston area in square millimetres. A pressure of 6 bar is 0.6 MPa, and a piston of 491 mm² at 0.6 MPa produces about **295 N**. Chapter 2 builds on that.

Volumes of air are in litres, and flow in litres a minute or cubic metres a minute. As the next sections explain, a volume of air means nothing until you say at what pressure it is measured.

## Gauge pressure and absolute pressure

A pressure gauge reads zero when it is open to the atmosphere. The atmosphere itself presses on everything with about **1.013 bar** at sea level. So a gauge reading of 6 bar means the air is 6 bar above atmospheric pressure, and its absolute pressure is about 7.013 bar. Gauge readings are often marked "bar g" and absolute ones "bar a".

For forces, gauge pressure is what matters, because the atmosphere presses on both sides of a piston and its effect cancels. For quantities of air, absolute pressure is what matters, because the amount of air packed into a volume depends on its absolute pressure. Getting this wrong is the most common error in air consumption calculations, and it always makes consumption look smaller than it is.

```figure
type: formula
title: From gauge pressure to the compression ratio
formula: absolute pressure = gauge pressure + atmospheric pressure        compression ratio = absolute pressure ÷ atmospheric pressure
caption: This is an illustration at sea level, with atmospheric pressure taken as 1.013 bar. The compression ratio converts a volume at working pressure into the free air it took to fill it.
- Gauge pressure at the machine | 6 bar g
- Atmospheric pressure | 1.013 bar
step: absolute pressure = 6 + 1.013 = 7.013 bar a
step: compression ratio = 7.013 ÷ 1.013 ≈ 6.92
step: at 5 bar g, (5 + 1.013) ÷ 1.013 ≈ 5.94
```

A compression ratio of 6.92 means that a cylinder holding 1 litre at 6 bar gauge contains the air that occupied about 6.92 litres at atmospheric pressure. The compressor had to draw in all of it.

## Free air, and why litres need a label

Compressor capacities and many air-use figures are given as **free air**: the volume the air would occupy at atmospheric pressure and a stated temperature. Manufacturers use various reference conditions, and flow figures for valves and other components are often given at a standard reference condition, marked "ANR" or similar. For a small factory's purposes, the important point is to convert everything to free air before adding it up, so the compressor's delivery and the machines' demand are in the same units. A cylinder's swept volume in litres, multiplied by the compression ratio, gives the free air it uses on each stroke. Chapter 5 does that for the reject station.

## Air is a spring

Air compresses. A hydraulic cylinder, full of nearly incompressible oil, stops where its valve stops it. A pneumatic cylinder, full of air, behaves more like a spring: push on the piston and it moves, and the trapped air pushes back harder as it is squeezed. That has four consequences for a designer:

- **Pneumatic cylinders are good at moving between two ends** and poor at stopping accurately in the middle, as the [Power screws and linear motion](/reados/collections/machine-elements-and-mechanical-design/power-screws-and-linear-motion/) chapter notes when it compares actuators.
- **Speed varies with load.** A cylinder pushing a heavy carton moves more slowly than one pushing a light one, unless flow control holds the speed steady.
- **Slow movement can be jerky.** At low speeds, seal friction and air compressibility can combine into a stop-start motion called stick-slip, which Chapter 3 deals with.
- **Compressed air stores energy.** A cylinder that has stopped may still hold pressure, and can move when a fitting is undone or a valve is operated by hand. Chapter 7 covers isolation.

None of these is a reason to avoid pneumatics. All of them are reasons to design for how air actually behaves rather than how a catalogue picture suggests.

## Compressed air is expensive energy

Compressed air feels free because it comes out of a pipe on the wall. It is not. The U.S. Department of Energy's compressed air sourcebook describes it as probably the most expensive form of energy in a plant, with a typical overall efficiency of 10 to 15 percent. Most of the electrical energy that drives a compressor ends up as heat, and only a small fraction reaches the tool as useful work.

That does not rule out pneumatics for short, intermittent movements like a reject pusher, where the air used is small and the simplicity is valuable. It does argue against using compressed air for continuous jobs that electricity can do directly, such as blowing, cooling or stirring, and against tolerating leaks. Chapter 5 puts dollar figures on both.

## Pneumatic or something else

Before choosing a cylinder, the maintenance lead compared three ways of rejecting a carton.

```figure
type: compare
title: Three ways to reject a 4 kg carton from line 2
cols: Pneumatic pusher | Electric linear actuator | Powered diverter arm
caption: This is an illustration of the comparison the maintenance lead made. Costs and judgements are for this case only; a different line, load or duty could favour a different answer.
- Speed for a 300 mm stroke | well within 0.5 s each way | possible, but needs a larger, costlier actuator | fast, but sweeps a large area
- Force and robustness | ample, tolerant of knocks and dust | ample, more sensitive to shock loads | ample
- Position control | two ends only, which is all the job needs | precise, not needed here | two positions
- Energy use at a 2% reject rate | small | very small | small, depending on drive
- *Parts and skills on site | cylinders, valves and spares already stocked | new to the maintenance team | new mechanism to build and guard
- Main concern | cushioning a fast stroke; guarding the pusher | cost and shock loading | guarding a large swept area
```

The pneumatic pusher won on the factors that mattered most for this job: it only needs two positions, it must be fast, it will be knocked by cartons, and the team already understands and stocks pneumatic parts. An electric actuator would be the better choice for a job needing positions between the ends, or where no compressed air was available. The decision was recorded with its reasons, so that a later change in the job, such as a need to push cartons to two different chutes, would prompt a fresh look.

## Write the brief before the parts list

The maintenance lead turned the job into a one-page brief before opening a catalogue. Besides the numbers above, it listed what the station must do when things go wrong and what it must not do:

- On loss of electrical power, the pusher retracts and stays retracted.
- On loss of air, the pusher may stop where it is, but must not move again unexpectedly when air returns.
- The pusher's travel is guarded so no one can reach the moving plate during operation.
- The station can be isolated and its stored air released before anyone works on it.
- Exhaust air is filtered and silenced, because the line packs food and runs beside people.
- Every component can be replaced from stock within an hour.

The brief also named who would check the design: the maintenance lead, the production supervisor and an external machinery safety adviser for the guarding. That list became the checklist for commissioning in Chapter 8.

## A failure case: the air jet on line 1

This is an illustration. Line 1 rejects packets with an air jet: a nozzle that fires a short blast across the belt when the checkweigher signals. It was bought years ago, when line 1 packed 500 g packets, because it was cheap and needed no moving parts. It worked well for light packets.

When line 1 was changed to pack 2 kg bags, the jet could no longer move every reject. Some rejected bags were only nudged, and travelled on to the palletiser. An operator, trying to help, adjusted the controller so the jet blew continuously at full pressure, which moved more of them but still not all.

The detection came from outside. A customer's receiving inspection weighed a sample of pallets and found underweight bags, which became a formal complaint. The investigation found two problems. The jet had never been checked against the heavier product, and the continuous blowing used about **379 litres of free air a minute** through its 3 mm nozzle, which Chapter 5 shows was costing around **A$3,200** a year in electricity. The correction was a pusher on line 1 similar to this book's case, and a rule written into the business's change procedure: any change of product on a line includes a check that the reject device still rejects it.

The line 2 brief started from that lesson. A reject device is a quality control. It must be shown to work on the heaviest, lightest and most awkward product the line will run.

## How this applies to a small Australian business

Small factories often specify pneumatic equipment by copying what is already on the floor. That is reasonable when the job is the same. When it is not, write the job down first: the load, the stroke, the time available, how often it happens, and the lowest pressure actually measured at the machine. Convert pressures to absolute before calculating any quantity of air. Treat compressed air as the expensive energy it is, and use it where its simplicity and robustness earn their cost. And state in the brief what the machine must do when power or air is lost, because that decision shapes the valves, the guarding and the isolation that follow.

## Exercise: free air at two pressures

The reject station's cylinder sweeps a volume of about **0.147 litres** on each extend stroke. How much free air does one extend stroke use at 6 bar gauge, and how much at 5 bar gauge? By what percentage would running the station at 5 bar rather than 6 reduce the air used, assuming the cylinder still does the job?

**Worked answer.** At 6 bar gauge, the compression ratio is **(6 + 1.013) ÷ 1.013 ≈ 6.92**, so one extend stroke uses about **0.147 × 6.92 ≈ 1.02 litres** of free air. At 5 bar gauge, the ratio is **(5 + 1.013) ÷ 1.013 ≈ 5.94**, and the stroke uses about **0.147 × 5.94 ≈ 0.87 litres**. The reduction is **(6.92 − 5.94) ÷ 6.92 ≈ 14%**. Note that the ratio of absolute pressures, not gauge pressures, sets the saving: using gauge pressures would wrongly suggest about 17%. Whether 5 bar is enough depends on the force check in Chapter 2.
