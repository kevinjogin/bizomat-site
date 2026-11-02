---
book: electrostatics-in-the-factory-by-the-numbers
chapterSlug: esd-control-in-electronics-assembly
order: 8
title: "ESD control in electronics assembly"
description: "Why components fail from discharges too small to feel, how the human body and charged device models describe them, and how an ESD-protected area earths people, benches and parts."
draft: false
---

In the powder line, static is a fire hazard. In the assembly area, it is a quality hazard of a different kind: invisible, cumulative and often delayed. A technician who picks up a control board after walking across the floor may discharge a few hundred volts into one of its pins without feeling anything. The board may fail its test immediately, or it may pass, ship and fail in a customer's switchboard months later, because the discharge weakened a junction or an insulating layer without destroying it. Electrostatic discharge (ESD) control in electronics manufacturing exists to make such discharges impossible rather than merely unlikely.

This chapter explains why modern components are so sensitive, how the standard discharge models describe the threats, and how an ESD-protected area (EPA) controls them: earthing people, earthing work surfaces, dealing with insulators, protecting parts in transit and proving that it all works. It applies them to the case factory's assembly area and ends with a bench that was moved, and a batch of controllers that came back from the field.

## Why components are sensitive

Integrated circuits contain transistors whose gate insulation is a few nanometres thick and junctions a few micrometres across. A voltage of a few volts across a nanometre-thick oxide is a field of thousands of megavolts per metre; a discharge that drives a current of an ampere through a structure a few micrometres wide concentrates enough energy to melt silicon or metal locally. Components include protection structures at their pins, but those protect against a limited discharge, and their limits are stated on the data sheet.

Damage takes two forms. Catastrophic failure destroys a function outright, and a functional test usually catches it. Latent damage weakens a structure, raising its leakage or reducing its strength, so that the part passes its tests and fails later under normal stress. Latent damage is why ESD control matters even when the factory's test yields look fine, and why returns from the field are the most expensive form of ESD failure. A good first-pass test yield is not evidence that the assembly area is free of ESD.

## The discharge models

Standard test models represent the main ways a component is discharged, so that components can be rated and tested consistently.

```figure
type: compare
title: Standard models of electrostatic discharge into components
cols: What it represents | Circuit | Pulse | Example at the stated voltage
rowhead: Model
- * Human body model (HBM) | A charged person touching a pin | 100 pF through 1,500 Ω | Rise of nanoseconds, decay time constant about 150 ns | At 2 kV: peak about 1.3 A, energy about 0.2 mJ
- Charged device model (CDM) | The component itself charged, discharging when a pin touches a conductor | The device's own small capacitance, very low resistance | Well under a nanosecond | Peak currents of several amperes from a few hundred volts
- Machine model, now largely retired | A charged metal tool or machine | Small capacitance, almost no resistance | Oscillating, nanoseconds | Shown for history; replaced in most component ratings by CDM
caption: The HBM figures follow from the model's 100 pF and 1,500 Ω: peak current ≈ V ÷ 1,500, time constant 100 pF × 1,500 Ω = 150 ns, energy ½CV². Component data sheets state withstand voltages in HBM and CDM terms; the test methods are standardised internationally.
```

The model numbers are small, deceptively so. An HBM discharge from 2 kV, below the level at which a person feels anything, delivers a peak current of about 1.3 A and an energy of only 0.2 mJ, but into a structure measured in micrometres that is plenty. The factory's control boards use microcontrollers and MOSFETs whose data sheets give, as an illustration, HBM withstand levels around 500 V to 2 kV and CDM levels of a few hundred volts. A person walking across a sealed vinyl floor in rubber soles on a dry winter day reaches several kilovolts (Chapter 2).

The CDM threat needs no person at all, only a charged part. A board or component that becomes charged, by sliding along a plastic tray, by being near a charged insulator, or by tape being pulled off it, discharges through its own pins the moment one touches an earthed tool, test probe or bench. CDM discharges are fast and intense, and they are the main reason why insulators are kept away from sensitive parts even when every person is properly earthed.

## The ESD-protected area

An EPA is a defined area in which every conductor that can touch or come near sensitive parts is earthed, insulators are controlled, and the controls are checked regularly. Its requirements are set out in IEC 61340-5-1 and, in an equivalent form, in ANSI/ESD S20.20, both widely used by electronics manufacturers and their customers, and a factory's ESD control programme is written to one of them. The programme sets its own limits for each element from the standard it follows, writes them into a plan, and verifies them.

The factory's assembly area has six benches and eight technicians. Its programme, as an illustration, has these elements.

1. **Boundary and marking.** The EPA is marked on the floor and at its entrance; nobody handles unprotected boards outside it.
2. **People.** Every person entering tests their footwear or heel grounders at the entrance tester and wears a wrist strap, tested daily, while seated at a bench. Wrist straps include a series resistor of about a megohm so that a technician touching a live conductor is protected from shock.
3. **Floor.** A dissipative floor finish connected to earth, so that footwear can drain charge as people walk.
4. **Work surfaces.** Dissipative bench mats, each connected through a cord to the bench's common earth point, and through it to the building's earth.
5. **Insulators.** Process-essential insulators, such as plastic connector housings and display covers, are kept away from boards or neutralised by benchtop ionisers (Chapter 7); non-essential ones, such as drink bottles, plastic folders and bubble wrap, are banned from the benches.
6. **Packaging and transport.** Boards move between stations in dissipative trays and leave the EPA in static-shielding bags, which have a conductive layer that keeps external fields and discharges away from the contents.
7. **Training and verification.** Every person is trained before working in the EPA, and every element is tested at a set interval, with records.

## Humidity and the EPA

Humidity helps an EPA, as Chapter 2 showed: at 45% the factory's audits found people walking at under 1 kV, against over 3 kV when the bench humidity fell to 30%. But the factory's programme treats humidity as a supporting measure, not a primary control, for three reasons. It cannot be guaranteed everywhere and always, as the propped-open door showed. It does little for hydrophobic plastics, which are common in electronics packaging and components. And a board can be damaged by a discharge of a few hundred volts, which even humid air does not prevent if a person or a bench is isolated. Earthing does not depend on the weather, so it is the foundation, and humidity is recorded with every audit so that results can be compared fairly between summer and winter, and so that the programme can be tested in the season when it is most likely to fail.

## Earthing people at a bench

A wrist strap earths the technician through the strap's resistance. With 1 MΩ in series and a body capacitance of about 150 pF, the time constant is 1 MΩ × 150 pF = 150 µs: any charge the technician picks up by moving in the chair drains in well under a millisecond. The same resistance limits the current that would flow if the technician touched a 230 V conductor to about 0.23 mA, below the level that causes a dangerous shock. Wrist straps fail where the cord flexes and where the band loses contact with the skin, which is why they are tested every day, at a tester that checks the whole path from skin to earth, rather than inspected by eye.

## When it goes wrong: the bench that was moved

During a rearrangement of the assembly area, the final test bench was moved two metres to make room for a new fixture. A few months later, the factory's largest customer began returning control boards that had failed after installation: a handful at first, then about 2% of one month's deliveries. The component supplier's failure analysis of a sample of the returned parts found damage at the input pins of one microcontroller, consistent with ESD, in a pattern suggesting a discharge at the point where the board's connector met the test fixture.

An audit of the assembly area found that the moved bench's mat was connected to its common earth point, but the common earth point's lead to the building earth had been unplugged during the move and left lying behind the bench. The technicians at that bench plugged their wrist straps into the mat's snap, as they always had; their wrist strap tester at the entrance had passed them, because it tested the strap, not the bench. Bench, mat and technicians were all bonded together and all isolated from earth: a resistance to earth measured at over 10¹² Ω.

```figure
type: steps
title: How an unearthed bench damaged boards
caption: This is an illustration. It shows the factory's investigation. The test fixture, earthed through the test equipment's own mains earth, was the only earthed object the board touched at that bench.
- Bench, mat and wrist-strapped technician bonded together but not earthed | All at the same floating voltage
- Technician moving, plastic test covers handled, the group charges | Several hundred volts relative to earth
- Board picked up from the mat, at the group's voltage | The board is charged too
- * Board connector pushed onto the earthed test fixture | Discharge through the microcontroller's input pins
- Some boards fail test; others pass with latent damage | Field returns months later
```

The bench's earth was reconnected and checked, and every bench's resistance to earth is now measured monthly and after any move. Bench common earth points are labelled, their leads fixed so that they cannot be unplugged without a tool, and a move of any EPA furniture triggers an EPA check before work resumes. The customer's remaining stock of boards from the affected months was replaced. The factory also changed its incoming wrist strap tester to one that tests the strap through the bench's own earth point, so that a bench without an earth now fails the technician's daily test instead of passing it.

## What the returns cost

The factory ships about 600 control boards a month, so 2% of a month's deliveries is about 12 boards. A board that fails in a customer's installation costs far more than the board. For this illustration, the factory's estimate of the cost of each field failure, a replacement board, freight, a technician's visit and the customer's downtime claims, was about A$1,800, so the month's returns cost about A$21,600 before counting the stock replaced as a precaution and the damage to the customer relationship. The monthly bench resistance check that would have caught the fault takes about twenty minutes.

That arithmetic is typical of ESD failures, and it is why an ESD programme's verification tests matter more than its purchases. Wrist straps, mats and ionisers are cheap; what fails is the connection nobody checks after something changes.

## Parts outside the EPA

Sensitive parts spend time outside the EPA: in goods receiving, in stores, in transit between buildings and in the field. They are protected there by packaging, not by earthing. The factory's goods-in procedure keeps sensitive components in their original shielding packaging until they enter the EPA, and opens and counts them only inside it. Finished boards leave in static-shielding bags, sealed, with a label showing that they contain sensitive devices. Field technicians who replace boards in customers' switchboards carry a portable kit, a folding dissipative mat with an earth lead and a wrist strap, and are trained to use it, because a customer's plant room is no kinder to a board than the factory's corridor.

Packaging is not interchangeable. Pink antistatic bags only resist charging themselves; they do not stop an external field or discharge from reaching the contents. Static-shielding bags, usually silvery and translucent, have a conductive layer that does. Conductive black trays and dissipative bins have their own uses. The programme lists which packaging is used for what, so that a technician who reaches for the nearest bag gets the right one.

```figure
type: checklist
title: The assembly area's verification plan
caption: This is an illustration. It shows the factory's plan; the limits and intervals come from the programme written to the standard it follows.
- x Wrist straps and footwear tested at every entry and every bench session, results logged by the tester
- x Bench mats and common earth points: resistance to earth monthly and after any move
- x Floor: resistance to earth quarterly, with humidity recorded
- x Benchtop ionisers: decay time and offset monthly
- x Humidity at bench height logged continuously
- x Full audit twice a year by someone outside the assembly team
- ? Packaging checks at goods-in and dispatch added after the audit
```

## Verifying the EPA

The programme's tests are the evidence that the controls exist. The factory's verification plan, as an illustration, tests wrist straps and footwear at every use, bench and floor resistance to earth monthly, ionisers' decay time and offset monthly, and the EPA's humidity continuously (Chapter 2), with a full audit of every element twice a year by someone from outside the assembly team. Results are recorded, failures are investigated and corrected, and the audit report goes to the production manager with a list of actions and their owners.

## Exercise: a board touched by a charged technician

A technician without an earth connection is charged to 800 V with a body capacitance of 150 pF and touches the input pin of a component whose data sheet gives an HBM withstand level of 500 V.

1. Using the HBM circuit, what peak current and energy does the discharge deliver?
2. Is the component at risk?
3. If the technician had been wearing a properly connected 1 MΩ wrist strap, what would their voltage have been with a charging current of 0.1 µA?

**Answer.**

1. Peak current ≈ 800 ÷ 1,500 = 0.53 A. Energy = ½ × 150 × 10⁻¹² × 800² = 0.048 mJ, about 48 µJ. (The HBM's standard 100 pF gives 32 µJ; the real person's 150 pF is used here.)
2. Yes. The discharge exceeds the component's 500 V rating, which is a withstand level from a test, not a safe working level, and may cause latent damage even if the part survives.
3. V = I × R = 0.1 × 10⁻⁶ × 10⁶ = 0.1 V. With a working wrist strap the technician cannot charge to anything that matters, which is the whole point of earthing people.
