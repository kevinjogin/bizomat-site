---
book: flow-measurement-by-the-numbers
chapterSlug: choosing-a-meter-and-the-cost-of-error
order: 10
title: "Choosing a meter and the cost of error"
description: "A selection method across fluid, range, accuracy, pressure loss, installation and cost, sizing for the range, valuing a meter’s error, and appraising a meter that reveals compressed-air leaks."
draft: false
---

There is no best flowmeter, only a best meter for a particular flow, range, purpose and budget. A magnetic meter cannot measure oil; a Coriolis meter is an expensive way to measure clean water; an orifice plate cannot measure a flow that varies twenty to one; a vortex meter sized for the maximum cannot see a weekend's leaks. Choosing well means starting from what the reading is for, working through what the fluid and the installation allow, sizing for the whole range, and then asking what the meter's error and its pressure loss will cost over its life.

This chapter sets out a selection method, applies it to the brewery's five flows, shows why meters are sized for their range rather than the pipe, puts a value on a meter's error and its pressure loss with KEVOS tools, and finishes with the compressed-air meter that was the right size for the compressor and the wrong size for the question the brewery most needed answered.

## A selection method

```figure
type: steps
title: Choosing a flowmeter
caption: Each step removes candidates; the last steps choose between those that remain.
- Purpose | what decision will the reading drive: billing, batching, control, balance, energy, leak finding?
- Quantity | volume, mass or standard volume, and at what accuracy over what range
- Fluid | liquid or gas; conductivity, viscosity, temperature, cleanliness, bubbles or solids, hygiene
- Range | lowest and highest flows that matter; turndown needed
- Installation | pipe size, straight runs available, orientation, vibration, access
- Pressure loss | how much pressure can be spent, and what it costs over the meter's life
- * Whole-life cost | price, installation, calibration, maintenance, energy and the cost of the meter's error
```

The first step is the one most often skipped. A meter for billing a tenant needs legal approval and long-term stability; one for a control loop needs a fast, repeatable signal and can tolerate a small bias; one for a mass balance needs a known, small bias over long totals; one for finding leaks needs good accuracy at the bottom of its range. The same flow can need different meters for different purposes.

## Matching meter types to fluids and duties

```figure
type: compare
title: Meter types against the brewery's needs
cols: Liquids | Gases | Typical turndown | Pressure loss | Straight runs | Main limitation
rowhead: Meter type
- Orifice plate | yes | yes | about 4 to 1 for good accuracy | high | long | square-root law
- Magnetic | conducting only | no | wide | very low | short to moderate | conductivity, grounding
- Coriolis | yes | yes, with pressure loss | wide | moderate to high | very short | price, bubbles, vibration
- Ultrasonic in-line | yes | yes | wide | very low | moderate | bubbles and solids
- Clamp-on ultrasonic | yes | difficult | wide | none | long | pipe data, a few per cent
- Vortex | yes | yes, and steam | about 10 to 1 above a cutoff | moderate | moderate to long | low-flow cutoff, pulsation
- Thermal mass | no | yes | wide, good at low flow | low | moderate | gas composition, moisture
caption: Typical characteristics for comparison; each maker's data decide for a particular meter.
```

Applied to the brewery, the method gives the meters it has, with two reconsiderations. The water, wort, glycol audit and hot liquor choices stand. The compressed air meter is the subject of this chapter's mistake.

## Size for the range, not the pipe

A meter's accuracy statement applies over its range, and its zero term, cutoff or square-root law makes its low-flow performance depend on velocity. Sizing a meter to match the pipe often leaves it too large for its lowest flows. The method is to list the flows that matter, minimum to maximum, convert them to velocities in candidate meter sizes, and choose the size that keeps the important flows within the meter's good range without excessive pressure loss at the maximum.

Chapter 4 did this for FT-101 and kept DN80, because its night flow is used only to watch for leaks and the water balance of Chapter 9 catches them anyway. The compressed air meter needed the same analysis, and did not get it.

## The cost of a meter's pressure loss

A meter's permanent pressure loss is paid for by the pump or compressor, every hour it runs. For FT-301, Chapter 3 found an orifice loss of about 10.1 kPa at 15 m³/h, costing about 140 kWh a year, a few tens of dollars. The brewery asked whether replacing the orifice plate with a magnetic meter, at about A$3,500 installed, would pay. Its savings, the energy plus the plate's annual inspection and the transmitter's impulse-line maintenance, came to about A$250 a year.

The [equipment investment appraisal tool](/tools/investment-appraisal/) tests that. With A$3,500, A$250 a year in savings, no extra running cost, no salvage, a 15-year life and an 8% hurdle rate, it gives an NPV of −A$1,360, an IRR of 0.9% and a simple payback of 14 years. The replacement does not pay on cost. The orifice plate, maintained as Chapter 3 describes, stays. The same calculation on a large, continuously running water main, where an orifice plate's loss is many kilowatts, would come out the other way.

## The cost of a meter's error

A meter's bias costs money whenever its reading sets a quantity that is bought, sold or used. For FT-101, a bias of 0.5% on the brewery's 60 m³ a day is 0.3 m³ a day, about 110 m³ a year; at an illustrative combined water and trade-waste charge of A$4 per kilolitre, that is about A$440 a year of misattributed water, though not a cost the brewery pays, because the authority bills from its own meter. For FT-201, a bias of 0.5% on wort would misstate every brew's yield by half a per cent, enough to hide a real loss of that size in the cellar. The value of accuracy depends on what the number is used for, which is the first step of the selection method again. Where a reading sets money directly, as in billing a tenant or buying a product by meter, every tenth of a per cent of bias is a tenth of a per cent of the money, and the case for a better meter, or for calibration, is easy to make with the same appraisal tool.

## The mistake: the right size for the wrong question

FT-401 was chosen to match the DN50 compressed-air main and to read the compressor's full output. Chapter 7 showed that at full output its velocity, 3.96 m/s, was close to its cutoff, and that on weekends, when the only demand is leaks, it reads zero. When the brewery's energy review asked how much air was being lost to leaks, FT-401 could not say.

```figure
type: steps
title: Choosing a meter for the leak question
caption: This is an illustration. The weekend leak flow was measured with a temporary thermal mass meter before the permanent change.
- Question | how much compressed air is lost to leaks when the brewery is idle?
- FT-401, DN50 vortex | reads zero below about 3 m/s; weekend flow about 0.59 m/s
- A DN25 vortex | weekend flow about 2.3 m/s, still below a typical cutoff
- Temporary thermal mass meter | weekend flow about 0.6 m³/min of free air, steady over a weekend
- * Cost of that leakage | 10 L/s at 6.5 kW per m³/min, all year: about 3.9 kW, 34,200 kWh, about A$10,200 at A$0.30 per kWh
- Decision | permanent thermal mass meter fitted beside FT-401 for low flows; leak repair programme started
```

A temporary thermal mass meter, which responds to mass flow down to very low velocities, showed a steady weekend flow of about 0.6 m³/min of free air, 10 L/s, a sixth of the compressor's capacity, lost to leaks. The [compressed air leak cost tool](/tools/air-leak-cost/) values it from a measured leak flow: with 10 L/s of free air, a compressor specific power of 6.5 kW per m³/min, 8,760 hours a year and electricity at A$0.30 per kWh, it gives 3.9 kW of compressor power wasted, about 34,200 kWh and about A$10,200 a year. That assumes the leaks run all year and the compressor makes up for them at its full-load specific power, an upper estimate, but even half of it was a large sum to have been invisible.

FT-401 was right for its original purpose, measuring production demand, and wrong for the question the energy review asked. A smaller vortex meter would not have helped, since at DN25 the weekend flow is still only about 2.3 m/s. The brewery fitted a permanent thermal mass meter for low flows alongside FT-401, at about A$4,200 installed, and started a leak repair programme.

### Was the second meter worth it?

The appraisal tool tests the meter, not the repairs. Crediting the meter with only a quarter of the leak cost, about A$2,600 a year, on the reasoning that without it the leaks would not have been found or their repair tracked, and allowing A$150 a year for its calibration, gives, over ten years at 8%, an NPV of A$12,240, an IRR of 58% and a simple payback of 1.7 years. A meter that answers a question worth asking pays for itself quickly; one that answers no question is a cost, however accurate.

```figure
type: compare
title: Two meter decisions at the brewery
cols: Installed cost | Yearly benefit | NPV at 8% | Simple payback | Decision
rowhead: Proposal
- Replace FT-301's orifice with a magnetic meter | A$3,500 | about A$250 | −A$1,360 over 15 years | 14 years | keep the orifice plate
- * Add a thermal mass meter for compressed-air leaks | A$4,200 | about A$2,450 net | A$12,240 over 10 years | 1.7 years | fitted
caption: This is an illustration from the equipment investment appraisal tool, excluding GST and tax. The leak meter's benefit is credited with a quarter of the leak cost it revealed.
```

## Meters belong in the design

The cheapest time to choose and place a meter is when the pipework is designed. A drawing can give a meter its straight runs, its low point, its isolating valves and bypass, its grounding and its access for a few metres of pipe and a few hours of drafting. Retrofitting the same meter into a finished plant means compromises at every step, as FT-101's first position behind a throttled valve and FT-401's size showed. The brewery's piping standard now asks, for every new line, whether it needs a meter now or may need one later, and reserves a straight spool where the answer is later, so that a future meter, or a clamp-on audit, has a good place to go.

## Writing the specification

A meter is bought from a specification, and most of the mistakes in this book could have been prevented by one. The brewery's specification sheet for any new meter now asks for the purpose of the reading; the fluid with its density, viscosity, conductivity and temperature range; the minimum, normal and maximum flows; the quantity to be reported, with its reference conditions for gases; the pipe's material, outside diameter and wall, measured; the straight lengths available upstream and downstream, and the fittings beyond them; the pressure available to spend; the accuracy required at the minimum and normal flows, as a percentage of reading with the zero term; the outputs and diagnostics needed; and hygienic, hazardous-area or trade requirements. The supplier's sizing sheet must answer each line, with the meter's velocity, accuracy and pressure loss at the three flows. Comparing two quotes then means comparing two filled-in sheets, not two headline accuracies.

## Diagnostics, spares and standardisation

Modern meters report far more than flow: empty pipe, coil and electrode condition, tube health, gas in the tubes, signal strength and verification results. Those diagnostics are useful only if they reach someone, so the brewery brings each meter's status into the control system with its flow and alarms on the ones that matter. It also standardises where it can: one make of magnetic meter across its water and cleaning lines, with one spare electronics module that fits all of them, and one calibration supplier. Standardising reduces the spares held, the training needed and the chance of a technician misconfiguring an unfamiliar instrument, at the cost of sometimes choosing a meter slightly less suited to one duty than the best available. For a plant of the brewery's size, that trade is usually worth making.

## Learn, apply, improve

Flow measurement rests on a few physical ideas: Bernoulli's trade between pressure and speed in an orifice, the voltage induced in a conducting liquid moving through a magnetic field, the Coriolis force in a vibrating tube, sound carried faster with a current than against it, and vortices shed at a frequency proportional to speed. Every practical rule in this book follows from those ideas and from the plant around them: say whether a number is volume, mass or standard volume and at what conditions; give the meter a developed profile, a full pipe and a ground; apply the square root once; measure the bore; convert gases on an absolute basis; read accuracy as a percentage of what; read every total over the same period; and choose a meter for the question it must answer. Each mistake in the book was a step in that chain left out, and each was caught by comparing one number with another that should have agreed.

## Exercise: a meter for the reverse osmosis plant's reject stream

The reverse osmosis plant of Chapter 4 also discharges a reject stream to drain, at 0.3 to 0.5 m³/h of water with a conductivity of about 1,500 µS/cm, in a DN15 PVC line with a 15.0 mm bore. The brewery wants to measure it to check the plant's recovery and to include it in the water balance. Using the selection method, calculate the velocity range, propose a meter type and size, say what installation details matter, and estimate, for a meter with ±0.5% of reading plus ±1 mm/s, its accuracy at both ends of the range.

### Answer

**Given:** Q from 0.3 to 0.5 m³/h; bore 15.0 mm; conductivity about 1,500 µS/cm; PVC pipe; meter ±0.5% of reading plus ±1 mm/s.

**Assumptions:** a full pipe at the meter; a steady flow.

**Purpose and quantity:** volume, for recovery and the balance, at about 1% accuracy over a small range.

**Velocity range:** A = π × 0.015² ÷ 4 = 1.767 × 10⁻⁴ m²; at 0.3 m³/h, v = (0.3 ÷ 3,600) ÷ 1.767 × 10⁻⁴ = 0.472 m/s; at 0.5 m³/h, 0.786 m/s.

**Meter type:** a DN15 magnetic meter. The water conducts well, the range is narrow, the velocities sit in the meter's good range, and there is no pressure to spare on a line to drain.

**Installation:** grounding rings on both sides, because the pipe is PVC (Chapter 4's mistake); the meter in a low point or a rising section so it stays full, since a drain line can run partly empty; and a few diameters of straight pipe upstream, away from the plant's reject valve.

**Accuracy:** at 0.472 m/s, the zero term is 0.001 ÷ 0.472 = 0.21%, total ±0.71%; at 0.786 m/s, 0.13%, total ±0.63%.

**Interpretation:** about ±0.7% across the range, ample for the purpose. A meter sized to a larger pipe, say DN25 with its 26.0 mm bore, would see 0.16 to 0.26 m/s, and its zero term would rise to about 0.6%, for no benefit.

**Verification:** the velocity ratio, 0.786 ÷ 0.472 = 1.67, equals the flow ratio 0.5 ÷ 0.3, and the DN25 velocities scale as (15.0 ÷ 26.0)² = 0.333 of the DN15 ones.
