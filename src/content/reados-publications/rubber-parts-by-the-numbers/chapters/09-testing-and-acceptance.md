---
book: rubber-parts-by-the-numbers
chapterSlug: testing-and-acceptance
order: 9
title: "Testing and acceptance"
description: "Plan qualification, batch and pre-use tests for a rubber part, check the modulus with a low-pressure inflation test, and catch a misuse test run at a pressure too low to show the misuse."
draft: false
---

Every number in this book so far has been an estimate: a modulus from hardness, a pressure from a model, a friction coefficient from a handful of pulls, a relaxation rate from one compound test. Each is good enough to design with and none is good enough to trust a pressurised product with on its own. Rubber varies from batch to batch, models simplify, and the ways a product is misused are rarely the ways its designer imagined. Testing is how the estimates become evidence.

This chapter sets out the three levels of testing a rubber product like TP-100 needs, qualification, batch and pre-use, shows how a simple low-pressure inflation test checks the modulus that everything else depends on, and records a misuse test that was made safe by making it meaningless.

## Three levels of testing

Tests do different jobs at different stages, and a test programme that tries to do everything with one test usually does nothing well.

```figure
type: steps
title: TP-100's test programme
caption: This is an illustration of the manufacturer's programme for its fictional plug. Pressure tests are run behind a shield with sacrificial sleeves where misuse or burst is being tested.
- Qualification, once per design or compound | tensile, set, ageing and ozone tests on the compound; inflation, slip, temperature and misuse tests on the plug
- Batch, every delivery of sleeves | hardness on the supplier's button; low-pressure inflation test on two sleeves
- Assembly, every plug | clamp torque; leak test at 150 kPa in a test pipe for 20 minutes
- Pre-use, by the user | visual check stretched, clamp check, gauge check after insertion
- Field feedback | every failure and complaint logged against the sleeve's cure date and batch
```

Qualification tests are thorough and slow; they prove the design and the compound. Batch tests are quick and targeted; they catch a batch that differs from the one qualified. Pre-use checks are simple enough to be done every time; they catch damage and ageing. Field feedback closes the loop, because the field finds the failure modes that the laboratory did not imagine, as the café drain and the welding-bay shelf did in earlier chapters.

## The low-pressure inflation test

The single most useful batch test for an inflatable part is an inflation curve: pressure against size, measured on a real part. It checks the compound's stiffness and the part's geometry together, in the mode the part actually works in.

For TP-100's sleeve, the test must stay well below the free-inflation limit of 78 kPa, or the sleeve will run away. This is an illustration. The manufacturer's test fixture holds a sleeve between end plates in free air, behind a polycarbonate shield, and inflates it in steps to 20 and 40 kPa, measuring the sleeve's outside diameter with a circumference tape at its mid-length. From the measured outside diameter and the wall thickness, the mean diameter gives the stretch, and the neo-Hookean formula gives G.

```figure
type: compare
title: Low-pressure inflation test of a TP-100 sleeve
cols: Predicted outside diameter | Measured outside diameter | Implied shear modulus
caption: This is an illustration. Prediction for G = 0.82 MPa, 4 mm wall, 42 mm mean radius, ends held. G is back-calculated from the measured mean diameter with p = G (T / R)(1 − 1 / λ⁴). The batch limit is G within ±15% of 0.82 MPa.
- 20 kPa | 94.2 mm | 94.4 mm | 0.80 MPa
- *40 kPa | 103.9 mm | 104.3 mm | 0.81 MPa
```

At 40 kPa, the measured outside diameter of 104.3 mm corresponds to a mean diameter of about 101 mm, a stretch of 1.202, and a back-calculated G of 0.805 MPa, within 2% of the hardness estimate. That one measurement confirms the compound, the wall thickness and the model in the plug's own geometry, and it takes five minutes per sleeve.

The test also shows why it must stop at 40 kPa. At 60 kPa the model predicts an outside diameter of about 124 mm, and at 70 kPa about 151 mm; the curve is flattening towards its limit, and a small error in pressure or a slightly soft sleeve could take it into runaway. A batch test that risks bursting its specimen is a poor batch test.

## Qualification tests for the plug

The plug's qualification programme tests every mechanism the earlier chapters identified, in conditions that represent use and misuse:

- **Sealing and grip.** Slip tests in each pipe material and condition, with the thirty-minute hold of Chapter 6, at 5, 20 and 40 °C.
- **Leak and cooling.** A plug charged warm and inserted into a cold pipe, with the gauge recorded over an hour, to confirm the levelling-off of Chapter 7.
- **Endurance.** A plug inflated and deflated 1,000 times in a test pipe, twice its retirement count, then inspected for cuts, cracks and clamp movement and retested for grip.
- **Ageing and ozone.** Sleeves from the compound's ageing and ozone tests inflated and inspected, to confirm that the compound's test results carry over to the part.
- **Misuse.** Inflation in free air from the supplies users actually have, behind a shield, with sacrificial sleeves, recording what happens.

## The error: a misuse test that could not show the misuse

This is an illustration. The first qualification report for TP-100 included a "free inflation test", run because the design review had asked what happens if the plug is inflated outside a pipe. The technician, sensibly concerned about safety, set the test supply's regulator to 60 kPa rather than the working 150 kPa. The sleeve grew to about 124 mm outside diameter and stopped. The report concluded that "free inflation is self-limiting at about 1.4 times the sleeve's diameter".

The reviewer who read the report had been at the design review and remembered Chapter 5's limit pressure. At 60 kPa, the supply was below the sleeve's free-inflation limit of 78 kPa, so of course the sleeve found an equilibrium: the test had been run in the one range where the danger cannot occur. The misuse the review had asked about was inflation from a regulated supply at 150 kPa, almost twice the limit, where there is no equilibrium short of a burst. The test had been made safe by making it unable to answer its question.

The test was repeated properly: in a bunded test enclosure with a heavy shield, with a sacrificial sleeve, from the 150 kPa regulated supply, filmed rather than watched. The sleeve bulged locally at one end within seconds and burst. A second test with the fixed-charge cylinder of Chapter 5 confirmed that the sleeve grew to about 1.5 times its diameter and stopped. Both results went into the report, with the conclusion that the plug must be supplied with the fixed-charge inflator and must not be inflated from a regulated line.

The lesson, recorded in the manufacturer's test procedure, is that a misuse test must reproduce the misuse, and that its safety must come from the test arrangement, shields, distance, remote operation and sacrificial parts, not from reducing the severity of the test until the hazard disappears.

## Proof and burst tests for the reinforced plug

TP-100R, the reinforced successor of Chapter 5, changes the test programme because its cord layer, not the rubber, carries the pressure once the sleeve reaches its restrained diameter. Its safety rests on the cord, and the cord must be tested like any other pressure-carrying element.

This is an illustration. The manufacturer's programme for TP-100R adds two tests. A **proof test** inflates every plug in free air, behind a shield, to one and a half times its 150 kPa working pressure, 225 kPa, holds it for a minute and checks that the sleeve's diameter stays within the cord's limit and that nothing leaks. A **burst test**, on a sample from each batch of cord-reinforced sleeves, raises the pressure in free air until the sleeve fails, records the burst pressure and the mode of failure, and requires it to exceed a multiple of the working pressure set in the design. Both tests are run remotely. At 225 kPa in a sleeve restrained to about 120 mm, the air stores roughly 460 J, about two and a half times the 186 J calculated for the unreinforced plug in its pipe in Chapter 5, and a burst test goes higher still.

The unreinforced TP-100 has no proof test in free air, because it has no free-air equilibrium at working pressure. Its equivalent is the assembly leak test in a test pipe, which proves the plug in the only condition in which it is allowed to hold 150 kPa.

## The gauge as an instrument

Almost every check in TP-100's programme relies on its inflation gauge: setting 150 kPa, watching for cooling, spotting leaks. A gauge reading 10% high would leave every plug under-inflated by 15 kPa, cutting contact pressure and grip by about an eighth. The manufacturer checks each plug's gauge against a calibrated reference at assembly, and the user instructions ask for the gauge to be checked against a reference gauge each year and replaced if it reads more than a few kilopascals out. In a product whose safety depends on a pressure, the pressure gauge is a measuring instrument, not a fitting.

## Acceptance and records

A rubber part is accepted when its records show that it is the part the design described and that it passed its checks. For each TP-100 batch, the manufacturer's record holds:

```figure
type: checklist
title: TP-100 batch acceptance record
caption: This is an illustration. One record per batch of sleeves, kept for the life of the plugs made from it.
- x Supplier certificate | compound, batch, cure dates, hardness and tensile results
- x Incoming hardness | supplier's test button, 50 to 52 Shore A
- x Low-pressure inflation test | two sleeves, implied G 0.80 and 0.81 MPa, within ±15%
- x Visual inspection | no flash, cuts, inclusions or bubbles
- x Assembly leak test | every plug, 150 kPa for 20 minutes in a test pipe, gauge level after cooling
- ? Field feedback | open for the batch's life; failures logged against cure date
```

The records serve two purposes. They let the manufacturer show, if a plug fails, that it was made and tested to the design; and they let it trace a failure to a batch and decide whether other plugs from that batch need checking. A failure traced to a batch with a low implied modulus would be a reason to recall that batch; one traced to a cut would point to handling or instructions instead.

## Who decides

Tests produce results; people decide what they mean. In a small manufacturer, it is tempting for the person who designed a part to test it and accept it, and for a borderline result to be read generously by someone keen to ship. TP-100's manufacturer separates the roles where it can: the designer writes the test procedure with its pass criteria before the test, a technician runs it and records the results, and a second engineer, not the designer, signs the qualification report. Batch acceptance is by the quality inspector against the written limits, with no discretion to accept a result outside them without a written concession signed by the engineering manager.

For a regulated or safety-critical product, the decision also involves people outside the company: a certifying body, a customer's engineer, or the authority whose requirements the product must meet. The test records described here are what those people will ask to see, and they are only persuasive if they were written as the tests were done, against criteria set beforehand.

## Bringing the book together

TP-100 is a simple product, a rubber tube between two plates, and it has needed every chapter of this book. Its compound was characterised from hardness and checked by tension and inflation. Its sleeve was calculated at large stretch in two directions. Its free-inflation limit, the most important number in the design, led to a fixed-charge inflator, an insertion mark and a reinforced successor. Its grip was measured rather than looked up, and restraint was made mandatory. Its trapped air, its relaxation, its clamped ends, its storage and its ozone exposure were all found to matter. And each of those findings came with a test.

None of those findings needed advanced analysis. Each came from a short calculation with a model whose limits were understood, checked against a test designed to answer one question. That combination, a simple model honestly used and a test that could prove it wrong, is the most reliable tool a designer of rubber parts has. The same sequence applies to any rubber part that stretches a long way or holds back pressure: estimate stiffness, calculate at large stretch with the right model and the right membrane state, find any limit point, check contact and friction honestly, allow for temperature and time, and test in the conditions of use and misuse.

## Exercise: a softer batch

A new batch of sleeves passes its hardness check at 47 Shore A, inside the 45 to 55 tolerance. In the low-pressure inflation test at 40 kPa, two sleeves measure 107.0 and 107.5 mm outside diameter.

1. Estimate the implied shear modulus from the 107.0 mm reading.
2. Should the batch be accepted under the ±15% limit, and what else does the result mean for the plug?

**Worked answer.**

1. The mean diameter is the outside diameter less the wall. At this stretch the wall is about 4 / 1.23 = 3.25 mm, so the mean diameter is about 107.0 − 3.3 = 103.7 mm, a stretch of 103.7 / 84 = 1.235. Then G = 0.040 / ((4 / 42) × (1 − 1 / 1.235⁴)) = 0.040 / (0.0952 × 0.570) = **0.74 MPa**.
2. That is about 10% below 0.82 MPa, inside the ±15% limit, so the batch can be accepted, and it agrees with its lower hardness. But a softer sleeve has a lower free-inflation limit, about 0.74 × 4 / 42 = **70 kPa**, and grows further in free air with the fixed-charge inflator. The manufacturer should check that the fixed charge still stops the softer sleeve well short of tearing, and the batch record should note its lower modulus so that any field problems can be traced. A batch near the edge of its tolerance is acceptable; it is also worth watching.
