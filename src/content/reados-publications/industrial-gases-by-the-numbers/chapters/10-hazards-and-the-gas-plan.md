---
book: industrial-gases-by-the-numbers
chapterSlug: hazards-and-the-gas-plan
order: 10
title: "Hazards and the gas plan"
description: "Calculate how far oxygen falls when an inert gas leaks, how little oxygen enriches the air and how fast fuel gas fills a pit, then build the workshop's gas plan."
draft: false
---

Every chapter of this book has touched on a hazard: acetylene's decomposition and acetylides, oxygen's way of making everything burn, hydrogen's invisible flame, the cold of cryogenic liquids, the inert gases that suffocate without warning. This final chapter brings the hazards together, puts numbers on the three that most often hurt people in workshops, oxygen deficiency, oxygen enrichment and fuel gas build-up, and then assembles the workshop's review into a single gas plan: what it uses, what it costs, what it has changed, and how it keeps people safe.

The numbers here are illustrations, made to show how quickly conditions can change. They are not a substitute for the risk assessment, the safety data sheets, the applicable standards, or the work health and safety regulator's codes of practice, including Safe Work Australia's model codes for welding processes and for confined spaces as adopted in each jurisdiction.

## The safe band for oxygen

Safe Work Australia's model code of practice for confined spaces states that air normally contains about 21% oxygen by volume and that oxygen levels between 19.5% and 23.5% are considered safe. Below that band, the air is oxygen-deficient, and the effects on people grow from impaired judgement and coordination to collapse and death as the oxygen falls. Above it, the air is oxygen-enriched, and the fire risk rises sharply. Both conditions are invisible: the air looks, smells and feels normal.

```figure
type: gauge
title: Oxygen in air and the safe band
min: 15
max: 26
value: 17.7
unit: % oxygen by volume
caption: The safe band of 19.5% to 23.5% is from Safe Work Australia's model code of practice for confined spaces. The needle shows the store-room calculation in this chapter, an illustration.
- 15 | 19.5 | Oxygen-deficient
- 19.5 | 23.5 | Considered safe
- 23.5 | 26 | Oxygen-enriched
```

## The store room, calculated

This is an illustration. The store room in Chapter 1, where an argon cylinder was found hissing on a Monday morning, has a volume of about 60 m³, and the cylinder had lost about 10 m³ of argon over the weekend. If the argon mixed evenly with the room air as it entered, and the displaced mixture leaked out under the door, the oxygen concentration would have fallen exponentially, as in the purge calculation of Chapter 7:

O₂ ≈ 20.9 × e^(−10 ÷ 60) ≈ **17.7%**

That is well below the safe band. And the even-mixing assumption is generous: argon is about 1.38 times as dense as air, so it would have collected near the floor first, where the concentration could have been much lower than the average. A person who bent down to read a label at the back of the room, or slumped there, would have been breathing the worst of it. The near miss was more serious than it seemed, and it is why the workshop moved its cylinder store outside, as Chapter 8 described.

## Oxygen enrichment

Oxygen enrichment needs surprisingly little oxygen. This is an illustration. If 1 m³ of oxygen leaked into a closed space of 20 m³, such as the inside of a tank or a small booth, and mixed evenly, the oxygen in the space would rise from about 20.9% to about (0.209 × 20 + 1) ÷ 21 ≈ **24.7%**, above the safe band. At that level, clothing, hair and oily rags ignite more easily and burn far more fiercely, and a spark from cutting or grinding that would die in air can set overalls alight.

The commonest causes of enrichment are leaking oxygen hoses and fittings, a cutting torch left with its oxygen valve open in a confined space, and, worst of all, the deliberate use of oxygen to "freshen" the air in a space that feels stuffy. Oxygen must never be used for ventilation, to blow down clothing, or to cool a person; compressed air or proper ventilation is the answer. And oxy-fuel torches and hoses are taken out of a confined space whenever work stops, so that a leak while nobody is there cannot enrich the space for the next person.

## Fuel gas in a pit

This is an illustration. Propane is about 1.52 times as dense as air and its lower flammable limit is about 2.1% by volume. The conveyor trench in Chapter 1, 10 m long, 0.6 m wide and 1.2 m deep, has a volume of about 7.2 m³. If propane from a leaking hose collected in the trench without mixing upwards, it would take only about 0.021 × 7.2 ≈ 0.15 m³, about **150 litres**, of propane to bring the whole trench to its lower flammable limit, and a leak of 1 L/min would supply that in about two and a half hours. A spark or a dropped hot part could then ignite the trench along its whole length.

```figure
type: bars
title: Gas needed to reach a hazardous condition, three workshop cases
unit: litres of gas released
max: 11000
caption: This is an illustration, using the calculations in this chapter. The small volume needed for the fuel gas case explains why heavier-than-air fuel gases are kept well away from pits and trenches.
- *Propane to the lower flammable limit in a 7.2 m³ trench | 150
- Oxygen to 24.7% in a 20 m³ space | 1000
- Argon to 17.7% oxygen in a 60 m³ room | 10000
```

The comparison shows why the workshop's rules treat each gas differently. A fuel gas becomes dangerous in tiny quantities if it collects; an oxidising gas needs more but turns ordinary materials into fuel; an inert gas needs the most, but gives no warning at all.

## Hot work on containers

A container that has held a flammable liquid or gas can explode when it is cut or welded, even if it looks empty, because vapour remains inside and in residues on its walls. The same is true of containers that held materials which react to produce gas, such as the damp carbide drum in Chapter 2. Hot work on drums, tanks and pipes that have held flammable or reactive materials is done only after the container has been identified, cleaned and made safe by a recognised method, and the atmosphere inside has been tested, under a hot work permit. Purging with an inert gas, as in Chapter 7, is one such method, and it brings its own asphyxiation hazard if anyone enters the container.

## Combustion products and fume

Gas flames and arcs also produce hazardous gases of their own. Oxy-fuel flames produce carbon dioxide and, if starved of air, carbon monoxide, which is toxic and has no smell; heating or cutting in a poorly ventilated space can build up carbon monoxide to dangerous levels. Arcs produce ozone and nitrogen oxides from the surrounding air, and both arcs and flames produce metal fume from the work. READOS covers fume and ventilation for arc welding in Arc Welding by the Numbers, in its chapter on [fume, radiation and electrical safety](/reados/publications/arc-welding-by-the-numbers/fume-radiation-and-electrical-safety/), and the same principles apply to flame processes.

## Pressure and handling

Two hazards are easy to forget because they have nothing to do with the chemistry of the gas. The first is stored pressure. A full cylinder at around 20 MPa holds a great deal of energy, and a cylinder whose valve is broken off, by a fall or a vehicle, can release it as a jet violent enough to drive the cylinder through a wall. That is why cylinders are chained upright, carried on trolleys, fitted with valve guards when moved, and never used as rollers or supports. Regulators, hoses and fittings fail under pressure too, and a hose whipping free of a fitting can injure anyone nearby, so connections are checked and hoses secured. The second hazard is the weight. Full-size cylinders are heavy and awkward, and lifting, tilting and rolling them injures backs and crushes feet and hands. Trolleys, cylinder cages lifted by forklift with the right attachment, and a store laid out so that cylinders never have to be lifted by hand all reduce the risk. The workshop's move to a manifold and an outdoor store cut its cylinder movements in the bays to almost none, which counted as a safety gain in its own right.

## Detection and monitoring

Instruments make invisible hazards visible. The workshop's review added three kinds:

- a fixed oxygen monitor with an alarm in the new outdoor cylinder store's enclosed section, and at low level in the welding bay nearest the trench;
- a portable multi-gas detector, measuring oxygen, flammable gas and carbon monoxide, for any work in confined spaces, tanks and pits, used by trained people and calibrated to the maker's schedule;
- leak detection solution and an ultrasonic leak detector for routine leak surveys (Chapter 9).

Instruments are a control, not a substitute for removing the hazard: cylinders outside, lines isolated out of hours, fuel gases away from pits and confined-space entry under a permit.

## Emergencies

A gas emergency needs a plan made before it happens. For the workshop, that plan covers what to do if a leak is found (isolate at the cylinder if safe to do so, ventilate, keep people and ignition sources away, call the supplier), if a cylinder is involved in a fire (evacuate, call the fire service, tell them the number and type of cylinders and where they are, and do not try to move a heated cylinder), and if someone collapses in a space that may be oxygen-deficient (raise the alarm and do not enter without breathing apparatus and training, because would-be rescuers who rush in are often the second victim). The plan is posted at the store and rehearsed.

## Training

Every person who handles gases in the workshop is trained in the hazards of the gases they use, the safe handling of cylinders, the operation of the equipment they use, leak checking, the emergency plan, and the reasons behind each rule. The early manuals said again and again that only trained people should charge generators, connect cylinders and adjust torches, and the principle has not changed. Training is recorded, refreshed, and repeated when equipment or gases change.

## The gas plan

The workshop's review ends in a short document: the gas plan. It lists each gas, its use, its supplier and product code, its storage and supply method, its consumption and cost, its hazards and controls, and the decisions taken, with their reasons and the conditions under which they will be revisited.

```figure
type: checklist
title: Contents of the workshop's gas plan
caption: This is an illustration. A gas plan is the workshop's own record; it does not replace the risk assessment, safety data sheets, standards or the regulator's requirements.
- x Gas register | each gas, use, product code, grade and supplier
- x Consumption and cost | measured each quarter against need
- x Storage and supply | cylinder store, manifold, piping drawing and test records
- x Hazards and controls | deficiency, enrichment, fire, cryogenic and pressure, per gas
- x Detection and emergencies | monitors, detector calibration, emergency plan
- x Training records | who is trained for which gases and equipment
- *? Decisions to revisit | bulk supply, argon-hydrogen mixture, on-site oxygen
```

## What the review achieved

This is an illustration. The manager added up what the review had achieved in its first year, against the starting gas bill of about A$38,000, excluding GST.

```figure
type: stats
title: The workshop's gas review in its first year
caption: This is an illustration. Savings are estimates from earlier chapters; the safety changes have no price but were the review's first purpose.
- *A$3,780 | Shielding gas fixes | flow, surge and leaks (Chapter 7)
- A$800 | Rental review | cylinders not needed returned (Chapter 8)
- A$450 | Grade correction | special grade no longer reordered (Chapter 4)
- 13% | Of the starting gas bill | about A$5,030 a year in all
```

The money mattered, but the manager's report led with the safety changes: the closed store room replaced by a ventilated outdoor store with an oxygen monitor; cylinders removed from the welding bays to a manifold; fuel gases kept away from the trench; lines isolated out of hours; oxygen equipment kept clean and separate; and a trained team with an emergency plan. None of those changes appears in the savings, and all of them would have been worth making if the savings had been nothing.

## Bringing it together

The book began with the gases a workshop never sees made. Their making explains much of their behaviour: acetylene stores energy in its triple bond, so it must be kept at low pressure and away from copper; oxygen comes from air, so its impurities are argon and nitrogen and its purity matters for cutting; hydrogen is the lightest gas, so it leaks, rises and burns invisibly; argon and nitrogen come from the same columns as oxygen, and like carbon dioxide they suffocate without warning. A workshop that understands where its gases come from and how they behave can buy, store, pipe and use them more cheaply and much more safely, and the numbers in this book are the tools for doing so.

## A failure: the stuffy tank

This is an illustration. A contractor's welder working inside a large tank on another site complained that the air felt stale, and a labourer, trying to help, opened the oxygen valve on the cutting torch at the manhole to "freshen it up". The supervisor saw what was happening and shut the valve within a minute, and the welder was brought out while the tank was ventilated with fresh air from a fan.

Nobody was hurt, but the tank's oxygen level, measured afterwards by the gas tester, had risen above the safe band near the manhole. The labourer had not known that oxygen enrichment makes clothing burn fiercely, and the welder's overalls were exactly what a cutting spark would have ignited. The contractor retrained its crews on enrichment and confined-space ventilation, and the site rule now states plainly that oxygen is never used to ventilate.

## Exercise: a smaller store room

A workshop stores six argon cylinders in an enclosed room of 25 m³. One cylinder, holding about 10 m³ of gas, empties completely through a failed valve. Estimate the average oxygen concentration in the room, assuming even mixing and outflow of the displaced mixture, and say what it shows.

The oxygen falls to about 20.9 × e^(−10 ÷ 25) ≈ 20.9 × 0.67 ≈ **14.0%**, far below the 19.5% lower limit of the safe band, and lower still near the floor, where the dense argon would collect first. A single cylinder can make a small room lethal. The answer is the one the workshop reached: store cylinders outdoors or in a store with ventilation designed for the purpose, monitor oxygen where an enclosed store cannot be avoided, and never treat a cylinder store as an ordinary room.
