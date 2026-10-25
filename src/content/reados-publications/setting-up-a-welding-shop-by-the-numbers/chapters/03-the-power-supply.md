---
book: setting-up-a-welding-shop-by-the-numbers
chapterSlug: the-power-supply
order: 3
title: "The power supply"
description: "Estimate what a welding shop's machines draw from the supply, from arc power to three-phase current, check the worst realistic demand against the unit's supply, and cost a year's electricity."
draft: false
---

Welding machines are among the largest electrical loads a small business owns. A single wire-feed machine welding at 300 A can draw more from the supply than a whole house running its oven, heater and kettle at once, and a shop with two of them, a plasma cutter and a compressor can easily ask more of a rented unit's supply than it was built for. New owners often discover this when the main breaker trips in the first week, with a job half welded. The arithmetic to avoid it is simple and is best done before signing the lease.

This chapter estimates the input of each of the shop's machines from the arc it makes, adds the loads that could run together, checks the total against the unit's supply, and costs a year's electricity. Electrical installation work, including any new circuits and outlets, must be designed and carried out by a licensed electrician to AS/NZS 3000 and the network's requirements; this chapter explains the numbers they will ask about.

## From arc to supply

A welding machine converts electrical power from the supply into arc power. The arc power is the arc voltage times the welding current; the machine's input is the arc power divided by its efficiency; and the current drawn from the supply depends on the input, the machine's power factor and the supply voltage. Arc Welding by the Numbers explains each step in its chapter on [duty cycle, supply and cables](/reados/publications/arc-welding-by-the-numbers/duty-cycle-supply-and-cables/).

```figure
type: formula
title: Supply current drawn by a wire-feed welder at 300 A
formula: I_supply = (V_arc × I_arc ÷ efficiency ÷ power factor) ÷ (√3 × V_line)
caption: This is an illustration for a three-phase machine on a 415 V supply. Efficiency and power factor vary with the machine; its rating plate and manual give the real input current at each output.
- Arc, 30 V × 300 A | 9.0 kW
- Efficiency, about | 0.85
- Power factor, about | 0.90
step: input power ≈ 9.0 ÷ 0.85 ≈ 10.6 kW
step: apparent power ≈ 10.6 ÷ 0.90 ≈ 11.8 kVA
step: current ≈ 11,800 ÷ (1.732 × 415) ≈ 16.4 A on each phase
```

The rating plate of every welding machine states its input current at its rated output and duty cycle, and that is the number the electrician uses. The calculation shows where it comes from, and lets an owner check whether a machine they are thinking of buying will suit the supply they have.

## Duty cycle and average demand

A welder does not weld continuously. The arc is on for only part of each hour, the rest being spent fitting, tacking, cleaning and moving, so the average power a welding machine draws is much less than its draw while welding. For the shop's planning, two figures matter: the **peak**, the current drawn while the arc is on, which decides whether breakers trip and cables are large enough, and the **average**, which decides the electricity bill. A machine's duty cycle rating is a separate matter, about how long it can weld at a given current before overheating, and also bears on whether the machine suits the work.

## The shop's loads

Mara listed the electrical loads her shop would have, with their approximate input from rating plates and makers' data, as an illustration.

```figure
type: compare
title: Mara's planned electrical loads
cols: Supply | Approximate input while working
caption: This is an illustration with typical values; each machine's rating plate gives its actual input. Single-phase loads are spread across the three phases by the electrician.
- Wire-feed welder 1, 350 A | three-phase | about 11.8 kVA at 300 A
- Wire-feed welder 2, 350 A | three-phase | about 11.8 kVA at 300 A
- *Plasma cutter | three-phase | about 12 kVA
- Air compressor, 4 kW | three-phase | about 5 kVA
- Cold saw and drill press | three-phase | about 3.8 kVA together
- Tungsten arc and stick inverter | single-phase | about 5 kVA at its maximum
- Lighting, office, small tools | single-phase | about 4 kVA together
```

If every machine ran at full output at the same moment, the connected load would be nearly 50 kVA, about 67 A on each phase. That will not happen: two welders, the plasma cutter, the saw and the inverter will not all be working at their maximum at once in a two-person shop. But some combinations will.

## The worst realistic demand

The useful figure is the worst combination that could realistically happen. In Mara's shop, that is one welder welding at 300 A, the second at about 60% of that, the plasma cutter cutting a thick plate at the same time, the compressor running to feed the plasma cutter, and the lights and office.

```figure
type: bars
title: Worst realistic simultaneous demand in Mara's shop
unit: kVA
max: 14
caption: This is an illustration. The total of about 40 kVA is about 55 A per phase on a 415 V supply, more than the unit's 50 A supply, so this combination would trip the main breaker.
- Wire-feed welder 1 at 300 A | 11.8
- *Plasma cutter | 12.0
- Wire-feed welder 2 at 60% | 7.1
- Air compressor | 5.0
- Lighting and office | 4.0
```

The total is about 40 kVA, about **55 A** per phase. The unit's supply, the landlord told Mara, was three-phase at 50 A per phase. The worst realistic combination would therefore exceed the supply, and the main breaker would trip, probably in the middle of a job when both welders and the plasma cutter were busy together.

## What to do about it

Mara had three options. She could **upgrade the supply**, which would need the landlord's consent, an electrician's design and possibly the network operator's approval, at a cost she was quoted as about A$6,000, excluding GST, with uncertain timing. She could **manage the load**, with a simple rule that the plasma cutter is not used while both welders are welding, which in a two-person shop is easy to follow most of the time. Or she could **choose different equipment**, for example a smaller plasma cutter, adequate for the plate thicknesses she usually cut, drawing less.

She chose to manage the load at first, with a sign on the plasma cutter and an agreement with Sam, and to record any trips. If the trips became a nuisance, or the work grew, she would upgrade. She also asked the electrician to fit the compressor with a soft starter, which reduces the surge when its motor starts, and to arrange the single-phase loads across the three phases so that no phase carried more than its share.

## Outlets and circuits

Each machine needs a suitable outlet and circuit. Three-phase welders and plasma cutters need three-phase outlets of the right current rating; single-phase inverters may need higher-rated single-phase outlets than ordinary power points, depending on their input current. The electrician sizes the circuits, protection and cables for each machine's rated input, and places outlets where the layout needs them (Chapter 2), with enough spare outlets that machines are not run from long extension leads. Each circuit has residual current protection where required, and every outlet is labelled.

## Extension leads and voltage drop

Long, light extension leads cause trouble. They drop voltage, so the machine sees less than the supply voltage and welds poorly, and they heat up, especially if they are coiled. A welder that works well near the switchboard and badly at the far end of the shop on an extension lead is usually short of voltage. The answer is outlets where the work is, and, where a lead is unavoidable, one rated for the machine's current, of a suitable length, fully uncoiled and inspected and tested as the regulations require.

## Reading a rating plate

Every welding machine carries a rating plate, and it holds the numbers an owner needs. It states the supply the machine needs, single- or three-phase and the voltage; the rated welding current at stated duty cycles, such as a current at 60% and a lower current at 100%; and the input current from the supply at those outputs, often given as both a maximum and an effective value that allows for the duty cycle. The electrician sizes the circuit protection and cable from the plate's figures and the maker's instructions, not from the owner's estimate. Before buying any machine, new or used, Mara photographed its rating plate and checked its input current against the outlets and supply she would have. A cheap used machine that needs a new circuit is not cheap.

## Earthing and the welding circuit

Two separate circuits meet at a welding machine, and they must not be confused. The supply circuit, from the switchboard to the machine, has its protective earth, which keeps the machine's casing safe if something fails inside it. The welding circuit, from the machine to the work and back through the work return lead, carries the welding current. If the work return lead is clamped badly, or not at all, welding current can find its way back through other paths, such as the protective earth conductors of other equipment, building steel or a crane, and damage them. Arc Welding by the Numbers explains these stray current paths in its chapter on [polarity, arc blow and the return path](/reados/publications/arc-welding-by-the-numbers/polarity-arc-blow-and-the-return-path/). In the shop, the rule is simple: the work return clamp goes on the work, or on the welding table that the work sits on, every time.

## Inverters and the supply

Most modern welding machines are inverters, which draw current from the supply in a way that is less smooth than a simple resistive load and can affect other equipment on the same circuit. They also tolerate supply variations within limits stated by their makers. A shop that shares a supply with neighbours, or that runs sensitive equipment such as a computer-controlled plasma table near its welders, may need the electrician's advice on separate circuits. For most small shops, following the machine makers' installation instructions is enough.

## Site power

A sixth of the shop's expected work is on site (Chapter 1), where mains power may be unavailable or unsuitable. An engine-driven welder-generator, mounted on the site vehicle or a trailer, gives welding current and auxiliary power for grinders and lights. It is a significant purchase, with fuel and maintenance costs, and Chapter 6 includes it in the equipment budget. Site power also brings its own electrical safety requirements, including earthing and residual current protection for the auxiliary outlets, set out in the generator maker's instructions and the regulations.

## A year's electricity

The electricity bill is smaller than many new owners fear, because the arc is on for only a fraction of the time. This is an illustration. With about 2,340 billable hours a year and the arc on for about a quarter of them, the shop has about 585 hours of arc time. If the welders draw on average about 70% of the 10.6 kW calculated above while the arc is on, they use about 585 × 10.6 × 0.7 ≈ **4,340 kWh** a year. Lighting, the compressor, the plasma cutter, machines and the office add perhaps another 6,000 kWh.

```figure
type: stats
title: An illustrative year of electricity for Mara's shop
caption: This is an illustration, excluding GST, at an illustrative 30 cents per kilowatt-hour energy charge. Supply charges and any demand charges on the tariff are additional.
- 4,340 kWh | Welding | about 585 hours of arc time
- 6,000 kWh | Everything else | lights, compressor, plasma, machines, office
- *About A$3,100 | Energy cost a year | at 30 cents per kWh
- About 1% | Share of expected revenue | far below labour and materials
```

Electricity is a small part of the shop's costs, which means that saving it is a low priority compared with saving labour time. But some business tariffs include a demand charge based on the highest power drawn in a billing period, and a shop that runs everything at once, every morning, can pay more for that peak than for the energy itself. Industrial Electric Heating by the Numbers explains demand charges and how they arise in its chapter on [safety, cost and choosing electric heat](/reados/publications/industrial-electric-heating-by-the-numbers/safety-cost-and-choosing-electric-heat/). Mara asked her electricity retailer which tariff the unit's meter was on before signing the lease.

## Solar and the shop

Many industrial units now have rooftop solar, or room for it. Daytime welding coincides with solar generation, so a system on the roof can supply a useful share of the shop's energy. Its value depends on the tariff, the system's size and whether the landlord owns it, and it does not help with the peak demand at a cloudy moment. For a rented unit, it is a question for the landlord as much as the tenant.

## A failure: the morning trip

This is an illustration. In the shop's third week, Sam was welding a trailer drawbar, Mara was welding brackets on the second machine, and a delivery driver waiting for a cut part asked whether it could be done while he waited. Mara started the plasma cutter on a 16 mm plate, the compressor started, and the main breaker tripped, stopping everything.

Nothing was damaged, but the trailer weld had to be ground back and restarted, and the delivery driver waited longer than he would have otherwise. The trip was exactly the combination the demand calculation had predicted. Mara's response was to make the load rule visible: the plasma cutter's switch now has a tag reading "not with both welders running", and the shop's routine is to batch plasma cutting at the start of the day, before welding begins.

## Exercise: a bigger welder

Mara is considering a 500 A wire-feed welder for heavy trailer work, welding at up to 450 A at about 36 V. Using the efficiency and power factor in this chapter, estimate its supply current at that output. Would it fit the unit's 50 A three-phase supply alongside the existing worst realistic demand without the first welder?

The arc power is 36 × 450 = **16.2 kW**. The input is about 16.2 ÷ 0.85 ≈ 19.1 kW, and the apparent power about 19.1 ÷ 0.90 ≈ **21.2 kVA**, a current of about 21,200 ÷ (1.732 × 415) ≈ **29.5 A** per phase.

Replacing welder 1's 11.8 kVA with 21.2 kVA raises the worst realistic demand from about 40 kVA to about 49 kVA, about 69 A per phase, well beyond the 50 A supply. Even without the plasma cutter, the demand would be about 37 kVA, about 52 A, still slightly over. The bigger welder would need a supply upgrade, strict load management, or both, and Mara would weigh that cost against how often she really needed 450 A.
