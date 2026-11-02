---
book: permanent-magnets-in-machines-by-the-numbers
chapterSlug: handling-storing-and-proving-magnets
order: 10
title: "Handling, storing and proving magnets"
description: "Work safely with strong magnets: pinching, shattering and implants; storage and shipping; incoming inspection by moment with a sampling plan; and baselines that prove magnetic parts in service."
draft: false
---

Every chapter so far has treated magnets as parts of machines. This one treats them as objects that people pick up, carry, store, assemble, ship and inspect. Strong rare-earth magnets are hazardous in ways that ordinary parts are not: they pull themselves and anything steel together with forces that rise steeply as the gap closes, they shatter, and their fields affect implants, instruments and electronics. They also arrive from suppliers with properties that cannot be seen and are easy to measure badly.

This chapter covers safe handling and assembly, storage and shipping, incoming inspection with a sampling plan from the KEVOS® acceptance sampling tool, and the baselines that let the plant prove its magnetic parts are still doing their jobs. The error is a batch of magnets accepted on readings that could not detect what was wrong with them.

## Hazards of strong magnets

**Pinching and crushing.** The force between a magnet and steel, or between two magnets, rises steeply as the gap closes, so a magnet that feels manageable at 50 mm can jump the last few millimetres with enough force to trap and crush a finger. This is an illustration. The supplier of the 50 × 50 × 25 mm NdFeB blocks used to rebuild Line 4's plate magnet lists each block's pull on a thick steel plate as about 800 N. Two such blocks allowed to come together attract each other with forces of the same order, far more than a hand can hold apart.

**Shattering.** Sintered magnets are brittle. Two magnets that snap together, or a magnet that hits steel, can chip or shatter, throwing sharp fragments at speed. Eye protection is essential when handling them unpackaged.

**Implants.** The UK Health and Safety Executive's guidance on magnetic lifting devices notes that magnetic fields can affect pacemakers, insulin pumps and other active implants. The same applies to strong permanent magnets. People with implants should not handle strong magnets or work close to magnetised assemblies without medical advice, and areas where large magnets are handled should be marked.

**Other effects.** Strong fields erase magnetic stripe cards, upset compasses and some instruments, and can damage mechanical watches. Large assemblies, such as plate magnets and coupling rotors, attract steel tools, fasteners and swarf from surprising distances, which becomes a hazard when the tool flies to the magnet.

## Handling and assembly

The plant's procedure for handling strong magnets and magnetised assemblies follows from those hazards:

- **Keep them in their packaging** until the moment of use, with their spacers, and never let two unpackaged magnets approach each other freely.
- **Slide, do not pry.** Separate magnets by sliding one off the other sideways, over the edge of a non-magnetic bench, rather than levering them apart.
- **Use non-magnetic tools** near magnets: brass, aluminium, stainless steel of austenitic grades, and plastics.
- **Use fixtures** that guide magnets into place along a controlled path, so that they cannot jump, in assemblies such as coupling rotors and plate magnets.
- **Magnetise after assembly where possible**, so that the magnets are handled unmagnetised and the whole assembly is magnetised in a fixture, as Chapter 1 described.
- **Wear eye protection and gloves** that protect against cuts without catching in the assembly.

```figure
type: checklist
title: Before handling strong magnets or magnetised assemblies
caption: The plant's pre-task check, kept with the magnet stores and the coupling rebuild bench. The open item is the one most often skipped in practice.
- x Nobody in the area has a pacemaker or other active implant | ask, and mark the area
- x Eye protection worn | sintered magnets chip and shatter
- ? Bench cleared of steel tools, fasteners and swarf | including what is in pockets
- x Non-magnetic tools and the assembly fixture ready | brass, aluminium, plastic
- x Magnets kept in packaging with spacers until used | one at a time
- x Cards, phones and instruments kept away | fields erase and disturb them
```

### Training and marking

Magnet hazards are unfamiliar to most people, including experienced fitters, because ordinary magnets in a workshop are weak. The plant's induction for maintenance staff includes a short demonstration with two small NdFeB blocks in a guarded fixture, which makes the speed and force of the last few millimetres clear in a way a written warning does not. Assemblies containing strong magnets carry a warning label, and the stores, the rebuild bench and the plate magnet's mounting are marked for people with implants.

## Storage

Magnets in stores should be kept with keepers or in their original packaging with spacers, away from steel shelving or with a non-magnetic barrier, in a dry place because of NdFeB's sensitivity to corrosion, and within their temperature limits. Each storage location should be labelled as containing strong magnets. Spare magnetised assemblies such as coupling rotors are stored in purpose-made boxes that keep steel and fingers at a distance, and are never stacked together.

Stores are also where unlabelled magnets end up mixed: grades that look identical but differ in coercivity or temperature rating, as in Chapter 4's error. The plant keeps each type in a labelled container with its specification number, and issues magnets against that number, not by size.

## Shipping

Magnets and magnetised assemblies are restricted for air transport, because their fields can affect aircraft instruments. Under the international dangerous goods rules for air transport, magnetised material whose field exceeds set limits at a set distance from the package is regulated, and shipments must be measured, shielded if necessary and declared. The IATA Dangerous Goods Regulations govern the details. Road and sea transport do not usually impose the same restrictions, but packaging must still keep the magnets apart and away from the packaging's outside. The plant sends magnetic assemblies for repair by road where it can, and asks the freight forwarder before sending any by air. Shielding a large assembly for air freight usually means a steel box or keeper plates that close its magnetic circuit, which adds weight and must itself be secured, so the decision is best made before the assembly is packed rather than at the airport counter.

## Incoming inspection

A magnet's properties cannot be seen. They can be measured in three ways, which differ greatly in what they show.

A **gaussmeter reading** at the magnet's surface is quick, but it varies sharply with the probe's position and angle, because the field near a magnet changes rapidly over its face, and it depends on the magnet's shape. Readings repeat only with a jig that holds the probe in the same place each time, and even then they compare magnets of the same shape only.

A **pull test** against a standard steel piece measures what a holding magnet does, but it combines the magnet with its contact.

A **magnetic moment measurement** with a Helmholtz coil and fluxmeter measures the magnet's total moment: the magnet is placed in the coil, or withdrawn from it, and the fluxmeter integrates the voltage induced. The result does not depend on exactly where in the coil the magnet sits, and divided by the magnet's volume it gives the magnet's magnetisation, which for a fully magnetised magnet corresponds to its remanence. It is the measurement that shows whether a magnet is the grade it should be and whether it is fully magnetised.

### A sampling plan

Testing every magnet in a lot is possible but slow. The plant samples. The KEVOS® [acceptance sampling plan tool](/tools/acceptance-sampling-plan/) designs a single attributes sampling plan: the smallest sample size and acceptance number whose binomial operating characteristic accepts lots at the acceptable quality level with at least one minus the producer's risk, and lots at the rejectable quality level with at most the consumer's risk; it gives the plan's average outgoing quality limit, and checks any plan the user enters.

This is an illustration. Coupling magnet segments arrive in lots of 400. The plant wants to accept lots with 1% of segments outside the moment specification at least 95% of the time, and to accept lots with 10% outside it no more than 10% of the time.

```figure
type: compare
title: Sampling plans for lots of coupling magnet segments, from the acceptance sampling plan tool
cols: Accepts lots at 1% defective | Accepts lots at 10% defective | Average outgoing quality limit
rowhead: Plan
- * Designed: sample 52, accept with up to 2 outside specification | 98.5% | 9.7% | 2.63%
- Supplier's proposal: sample 20, accept with none outside | 81.8% | 12.2% | 1.80%
caption: This is an illustration. Acceptable quality level 1%, rejectable quality level 10%, producer's risk 5%, consumer's risk 10%. The binomial model is approximate when the sample is more than a tenth of the lot; with 52 from 400 the real protection is slightly better than shown.
```

The supplier's proposal looks strict, because it rejects a lot for a single bad segment, but its operating characteristic shows it does the job worse in both directions: it rejects good lots nearly a fifth of the time, and it accepts bad lots more often than the plant wants. The designed plan, with a larger sample and an acceptance number of 2, meets both requirements. *Accept or Reject by the Numbers* explains sampling plans and their operating characteristics in more depth.

### Setting the specification

A sampling plan is only as useful as the specification it tests against. The plant's specification for coupling segments states a minimum moment per unit volume, derived from the minimum remanence in the magnet's datasheet, measured with a Helmholtz coil at 20 °C ± 2 °C, because remanence changes with temperature by about 0.11% per degree for NdFeB and a warm magnet reads low. It also states the dimensions, the coating thickness, and the direction of magnetisation, checked with a simple polarity indicator. A segment outside any of these counts as one defective in the sampling plan.

The temperature tolerance is not a detail. A lot measured straight from a delivery truck on a hot afternoon at 35 °C would read about 1.6% low, and a lot measured on a cold morning at 5 °C about 1.6% high: enough to shift a marginal lot from reject to accept, or the reverse.

## Baselines in service

Most of this book's checks compare a measurement with its value when new. The plant records a baseline for each magnetic part at commissioning, under stated conditions, and repeats the measurement on a schedule.

```figure
type: layers
title: Line 4's magnetic baselines
caption: This is an illustration of the plant's register. Each line comes from an earlier chapter; a falling trend in any of them is the earliest sign of a magnet losing strength or a circuit changing.
- Pump coupling | motor power at duty flow; shell temperature | Chapter 5
- Brake on the film-reel lift | static torque test at 2.4 N·m; creep test | Chapter 6
- Cross-seal servo | back-EMF at 1,000 rpm on the bench at overhaul; current at duty speed | Chapter 7
- Grate and plate magnets | pull test and gaussmeter readings in a jig; capture test | Chapter 8
- * Sensors and interlocks | switching distances; defeat check | Chapter 9
- Spare magnets in stores | moment of a sample from each lot on receipt | this chapter
```

## Repair, re-magnetising and disposal

Magnetised assemblies that need repair, such as a coupling rotor with a damaged encapsulation or a servo motor with a failed bearing, go to repairers who have the fixtures to handle them. Some repairs can be done on the assembly as it is; others need it demagnetised first and re-magnetised after, which only a repairer with a magnetising fixture can do. A rotor that has lost strength from heat, as in Chapter 4, may be restored by re-magnetising if the loss was recoverable, and must be replaced if the magnets were damaged by corrosion or overheating that changed the material, as Arnold's note distinguishes.

Magnets at the end of their life are still magnets. Scrap rotors and grate rods should be packed as carefully as new ones, labelled, and kept away from steel scrap bins, where they attract and hold everything around them. Rare-earth magnets contain valuable and strategically important elements, and recycling routes for them exist; the plant sends its scrap rare-earth magnets to a metal recycler that accepts them, rather than to general scrap. Heating a magnet above its Curie temperature, about 310 °C for NdFeB, removes its magnetisation completely, which some recyclers do before processing.

## The error: accepted on the wrong measurement

This is an illustration. A lot of replacement magnet segments for the pump coupling was received and checked as the plant's procedure then required: five segments read with a handheld gaussmeter at the centre of one face, against the previous lot's readings. The readings were within 5% of the previous lot's, inside the scatter that hand-held readings always show, and the lot was accepted.

When the rebuilt coupling was tested on the bench before installation, its slip torque was about 12% below its specification. A Helmholtz coil measurement of ten segments from the lot found their moments 6% below the specification's minimum, consistently. The magnets were the right grade, but had not been fully magnetised by the supplier; their remanence, and so the coupling's torque, which goes roughly as its square, was correspondingly low. The handheld readings, with their positional scatter, could not have detected a consistent 6% shortfall.

The lot was returned for re-magnetising, and the plant changed its procedure: magnet segments are now sampled by the designed plan above and measured by moment with a Helmholtz coil, against a specification stated in moment per unit volume. The handheld gaussmeter is kept for checking magnetised assemblies against their own baselines, where its repeatability with a jig is good enough to show change, which is the question it is asked there.

## Exercise: a smaller lot

This is an illustration. Sensor magnets arrive in lots of 100. The plant considers using the same designed plan, 52 samples with an acceptance number of 2.

1. Why is the binomial operating characteristic less accurate for this lot?
2. Is the error in the safe or the unsafe direction?
3. What else might the plant consider for small lots from a trusted supplier?

**Worked answer.**

1. The sample is more than half the lot, so each sample drawn changes the proportion of bad magnets left, which the binomial model ignores. The hypergeometric distribution is the exact model for sampling without replacement.
2. **Safe.** Sampling a large share of a small lot discriminates better than the binomial curve shows, so the real protection is better than the tool's figures.
3. **Use the supplier's data with a smaller check.** If the supplier provides moment measurements for every magnet with each lot, the plant can verify a small sample against the supplier's records, as *Accept or Reject by the Numbers* describes for suppliers with good process data, and inspect fully only when the check disagrees.
