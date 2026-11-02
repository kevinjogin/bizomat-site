---
book: electrostatics-in-the-factory-by-the-numbers
chapterSlug: ionisers-for-insulating-surfaces
order: 7
title: "Ionisers for insulating surfaces"
description: "How ionisers neutralise charge on plastics and films, how passive, AC, pulsed DC and air-assisted types differ, why their range is short, and how decay time and balance are tested."
draft: false
---

Earthing deals with conductors. Plastics, films, glass and many composites cannot be earthed, because their charge cannot move through them to an earth connection. The only practical way to remove charge from them is to bring the opposite charge to them, through the air, as ions. Air itself becomes the conductor, for as long as the ions last. An ioniser does exactly that: it uses corona to fill the air near a charged surface with positive and negative ions, and the surface's own field pulls in the ions of opposite sign until its charge is neutralised.

This chapter explains how ionisers work and why their range is short, describes the main types, and sets out the two tests that show whether an ioniser is doing its job: decay time and balance. It applies them to the case factory's window line, where charged polycarbonate pulled dust onto every window, and ends with an ioniser that quietly lost most of its output because its emitter points had collected the very dust it was installed to keep away.

## How an ioniser neutralises charge

A charged surface has a field reaching out into the air around it. Put a cloud of mixed positive and negative ions into that field and the ions of opposite sign to the surface drift towards it, while ions of the same sign drift away. Each ion that reaches the surface cancels one elementary charge. The process continues, quickly at first and then more slowly, until the surface's field is too weak to attract more ions, which in practice means a residual voltage of a few tens of volts with a well-balanced ioniser.

The amounts of charge are small. Peeling the protective film from one of the factory's 300 × 300 mm windows leaves, as an illustration, about 10 µC per square metre on the window, about 0.9 µC in all. If the peel takes three seconds, the charge is generated at about 0.3 µA. An ioniser that can deliver a few microamperes of ions to the window while it is being peeled can keep up with the charging, and the window never reaches a high voltage.

## Why the range is short

Ions do not last long in air. Positive and negative ions attract each other and recombine into neutral molecules, and the rate of recombination rises with the product of their concentrations. In a dense ion cloud close to the emitters, half the ions recombine in a fraction of a second; further away, the cloud thins and lasts longer but contains fewer ions. Ions also move slowly unless something pushes them: at a mobility of about 2 × 10⁻⁴ m² per volt-second, an ion in a weak field of 1 kV/m drifts at only 0.2 m/s.

The result is that an ioniser without airflow works well over a few hundred millimetres at most, and its performance falls quickly with distance. Air-assisted ionisers, with built-in fans, air knives or compressed-air nozzles, carry the ions to the target before they recombine, extending the useful range and speeding neutralisation, at the cost of noise and air consumption.

```figure
type: compare
title: Types of ioniser
cols: How ions are made | Range and speed | Typical use
rowhead: Type
- Passive: earthed tinsel, brushes or wires | The charged surface's own field causes corona at fine earthed points | Very close; leaves several kV | Low-cost first step on film webs
- AC bar | Emitters driven at mains frequency, alternating polarity | Short range; ions recombine quickly | Close-range neutralising on webs and conveyors
- * Pulsed DC bar | Separate positive and negative emitters, pulsed at an adjustable rate and balance | Longer range; adjustable | Film peeling, moulding take-out, assembly
- Air-assisted blower or nozzle | Any of the above, with a fan or compressed air carrying the ions | Range of a metre or more; fast | Workstations, parts with recesses
- Alpha-source ioniser | A small radioactive source ionises the air | Short range; no power needed | Specialised uses; licensed radiation source
caption: General characteristics. Ionisers using radioactive sources are regulated as radiation sources in Australia under state and territory radiation laws, within the national framework coordinated by ARPANSA, and need licensing, records and disposal arrangements.
```

## Decay time and balance

Two numbers describe an ioniser's performance at a particular position, and both are measured with a charged plate monitor: an insulated metal plate of standard size and capacitance, typically about 20 pF, which can be charged to a set voltage and whose voltage is then watched as the ioniser neutralises it. The method is set out in IEC 61340-4-7 and in an equivalent American standard test method.

**Decay time** is the time for the plate's voltage to fall from, typically, 1,000 V to 100 V, measured once with the plate charged positive and once negative. It shows how fast the ioniser removes charge at that position. A 20 pF plate at 1,000 V carries 20 nC, so an ioniser that neutralises it in two seconds delivers an average of 9 nA of net ions to the plate over that time, a figure that shows how much the plate's small size understates the current an ioniser can deliver to a large surface. The test is a standardised comparison between positions and over time, not a measure of the ioniser's total output.

**Offset voltage**, or balance, is the voltage the plate settles at when it starts uncharged and is left in the ioniser's output. A perfectly balanced ioniser supplies equal positive and negative ions and leaves the plate near zero; an unbalanced one charges the plate, and anything else, to its offset. An ioniser offset by 150 V is itself a source of charge on whatever it is aimed at.

## The case: the window line

Chapter 1 found the factory's polycarbonate windows charged to about 9 kV at 25 mm after the protective film was peeled, enough to pull airborne dust onto them before they were fitted. Dust trapped behind the fitted window was the main cause of rejects at final inspection on enclosures with windows, and each reject meant removing and refitting the window by hand.

The factory installed a pulsed DC ioniser bar 150 mm above the peeling point, with a small fan blowing across the bar towards the window, and set it up with a charged plate monitor at the window's position.

```figure
type: compare
title: The window peeling station before and after the ioniser
cols: Before | After installation | After six months, before cleaning | After cleaning and rebalancing
rowhead: Measure
- Window voltage at 25 mm after peeling | about 9 kV | below 0.3 kV | about 3 kV | below 0.3 kV
- Decay time, 1,000 V to 100 V, plate at the window position | not applicable | about 1.5 s | about 15 s | about 1.5 s
- Offset voltage | not applicable | within ±20 V | about +150 V | within ±20 V
- * Enclosures rejected for dust behind windows | about 6% | about 0.5% | rising to about 3% | about 0.5%
caption: This is an illustration. Voltages measured with the factory's field meter at its calibrated distance; decay and offset with a charged plate monitor at the window's position.
```

## When it goes wrong: emitters coated in dust

Six months after installation, the dust rejects crept back up. Nobody had touched the ioniser, and its indicator light showed it working. A charged plate monitor test showed the decay time had grown from 1.5 seconds to about 15 seconds, and the offset had drifted to about +150 V.

The emitter points were coated with a grey film of dust. An ioniser's emitters are the sharpest, highest-field points in the area, and the field draws charged dust to them exactly as it draws dust to a charged window. A coated point needs more voltage to start corona and makes fewer ions, and since positive and negative emitters do not coat at the same rate, the balance drifts as well. A drifted ioniser was now charging the windows positively at the same time as neutralising them less effectively.

Why did nobody notice for six months? Because the decline was gradual, the indicator light stayed on, and the dust rejects were counted at final inspection, a day's work away from the window line, without a breakdown by cause until a quality engineer added one. The factory now charts the window line's dust rejects weekly beside the ioniser's monthly decay times, so that a rise in one can be checked against the other, and the first monthly test after cleaning confirmed that the two move together.

```figure
type: checklist
title: The window line ioniser's maintenance
caption: This is an illustration. It shows the factory's revised plan, following the ioniser maker's instructions.
- x Emitter points cleaned weekly with the maker's brush, with the bar switched off and isolated
- x Charged plate monitor test monthly at the window position: decay time and offset recorded
- x Action limits: decay time over 3 s or offset beyond ±35 V
- x Fan filter checked monthly
- ? Emitter replacement at the interval the maker recommends
```

Cleaning the points restored a decay time of about 1.5 seconds; adjusting the balance control brought the offset back within ±20 V. The rejects fell back to about 0.5% within a week of the cleaning. The ioniser's indicator light had shown only that it was powered, not that it was making ions in balance, which is why the factory now tests it, rather than looking at it. The same lesson applies to any static control with a status lamp: the lamp shows that power is on, not that the control works.

## Choosing and placing an ioniser

The factory's engineer followed a short sequence for the window line, and uses it for every new static problem on insulating material.

1. **Measure the charge and find where it is made.** A field meter at its calibrated distance, used along the process, showed that the windows were uncharged when they arrived and charged to about 9 kV the moment the film came off. The peeling point was the place to neutralise.
2. **Estimate the charging rate.** About 0.9 µC per window in three seconds, roughly 0.3 µA: well within what a pulsed DC bar can deliver at short range.
3. **Choose the type and distance.** A pulsed DC bar 150 mm from the peel point, with a fan to carry ions to the window, because the operator's hands and the window move and the bar must not be in the way.
4. **Check the area.** The window line is not a hazardous area, so a standard ioniser could be used; near the alcohol benches or in the powder booth, only ionisers certified for the zone would be acceptable.
5. **Set up with a charged plate monitor at the target position**, adjust the balance, and record decay time and offset as the baseline for maintenance.
6. **Measure the result in the process**, here the window voltage after peeling and the dust reject rate, not just on the monitor.

The sequence avoids the common mistake of buying an ioniser and mounting it wherever there is space. An ioniser half a metre from the charging point, with no airflow, may show a respectable decay time on its data sheet and achieve almost nothing in the process.

## Ionisers in the ESD-protected area

In the assembly area, ionisers do a different job. Most items there are conductive or dissipative and are earthed through the benches and the technicians (Chapter 8). But some insulating items are essential to the process: plastic connector housings, cable ties, tape, the plastic bodies of components, and the protective covers of displays. They cannot be earthed and may carry charge that induces voltages on nearby components. Benchtop air ionisers neutralise them. For this use, the ioniser's offset matters even more than its decay time, because an unbalanced ioniser blowing across a bench of sensitive components can induce charge on them; the assembly area's ionisers have a tighter offset limit than the window line's, and their checks are part of the ESD audit.

## Ozone and safety

Every corona makes some ozone, and an ioniser is a corona source. Modern ionisers designed for workplaces produce very little, and makers state their output, but large banks of ionisers in a small, poorly ventilated room, or old equipment, can raise ozone concentrations; the maker's data and, if in doubt, a measurement settle the question. Emitters carry high voltage at very low current, limited so that touching one gives at most a mild shock, but bars should be mounted where people do not touch them in normal work and isolated before cleaning. Ionisers using radioactive sources need the licensing, labelling and disposal arrangements of a radiation source.

## Where ionisers help and where they do not

Ionisers neutralise charge on surfaces, and nothing more. They do not stop charging, they cannot keep up with very fast processes such as high-speed film webs without being placed very close, and they are not a control for conductors, which should be earthed. In hazardous areas, only ionisers designed and certified for the zone may be used, because an ioniser is itself a high-voltage device making corona. And an ioniser in the wrong place is useless: ions must reach the surface while it is charged, so the bar goes where charging happens, at the peel point or the take-out point, not somewhere downstream where the charge has already attracted the dust.

## Exercise: a moulded part take-out

Polypropylene housings come out of an injection moulding machine charged to about 6 kV. An ioniser at the take-out point gives a decay time of 2 seconds from 1,000 V to 100 V.

1. If the decay is roughly exponential, what is its time constant, and how long would it take to bring a 6 kV housing below 100 V?
2. The housings spend 4 seconds on the take-out conveyor under the ioniser. Is that enough?
3. What would you check before trusting the answer?

**Answer.**

1. A fall from 1,000 V to 100 V is a factor of 10, which takes ln 10 ≈ 2.3 time constants, so the time constant is 2 ÷ 2.3 ≈ 0.87 s. From 6,000 V to 100 V is a factor of 60, ln 60 ≈ 4.1 time constants, about 3.6 s.
2. Just. Four seconds gives about 4.6 time constants and a residual of about 6,000 × e^(−4.6) ≈ 60 V, if the decay really is exponential and the housing sits where the plate was tested.
3. That the decay is measured at the housing's actual position and orientation, since ionisers weaken with distance and the housing's shape matters; that the offset is small, so that neutralised housings are not recharged to the offset; and that the decay time holds over time, which means testing it regularly. The exponential assumption is a guide; real decay curves often slow down near the end.
