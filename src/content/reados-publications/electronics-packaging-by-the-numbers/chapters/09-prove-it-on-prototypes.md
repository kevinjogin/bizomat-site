---
book: electronics-packaging-by-the-numbers
chapterSlug: prove-it-on-prototypes
order: 9
title: "Prove it on prototypes"
description: "Plan prototype builds and tests from the brief, measure the thermal network on a heated plate, compare the sensor with a reference and read what a small sample can and cannot prove."
draft: false
---

Every calculation in the previous chapters rests on assumptions: a convection coefficient, a contact resistance, a gasket load, a laminate modulus, the losses an enclosure adds to a radio link. Prototypes are where those assumptions meet reality. A good test plan does more than check that the product passes. It measures the numbers the models assumed, so the models can be corrected and used again with confidence, and it is designed to find faults while they are still cheap to fix.

This chapter builds the gearbox monitor's prototype and test plan from the brief. It shows how a two-step heated-plate test separates the two thermal resistances of Chapter 4, how the reference-sensor comparison proves the measurement, what a sample of twelve units can and cannot prove statistically, and how a vibration test found a fault that was in the assembly instructions, not the design.

## Three builds, three questions

Hardware products usually go through several prototype builds, each answering a different question. The names vary between companies. A common set is:

- **Engineering validation (EVT):** does the design work at all? A few hand-built units, often with machined rather than cast or moulded parts.
- **Design validation (DVT):** does the design meet every requirement? Units built from production-intent parts and drawings, enough to run the full test plan.
- **Production validation (PVT):** can the factory build it consistently? Units built on the production line, with production tooling, fixtures and tests.

```figure
type: steps
title: The gearbox monitor's prototype builds
caption: This is an illustration. Quantities were set by the tests each build had to support, including units consumed by destructive tests.
- EVT, 5 units | machined base, printed lid; checks fit, function, first thermal and radio readings
- DVT, 12 units | cast base and moulded lid from soft tooling; full environmental, sealing, EMC pre-scan and field trial
- *PVT, 30 units | production tooling, line assembly and end-of-line tests; formal compliance tests on these units
```

Each build has an entry rule, the drawings and board revision it uses, and an exit rule, the results it must produce. A build is not finished when the units are assembled. It is finished when its questions are answered and recorded.

## A test plan traced to the brief

Every test in the plan exists because a requirement in the brief needs it, and every requirement has at least one test or analysis. The team built the plan as a table with that link in each row.

```figure
type: compare
title: Part of the DVT test plan, traced to the brief
cols: Requirement | Test | Units | Pass criterion
caption: This is an illustration. Standards are named as the basis the laboratory would apply; no test levels are quoted here. The in-house cycle comes from the failure case in Chapter 5.
- Mounting surface 75 °C, air 40 °C, sun | two-step heated-plate test with lamp | 2 | module case below 85 °C with margin
- Vibration measurement 10 Hz–1 kHz | comparison with a stud-mounted reference sensor | 3 | within ±5% at 469 Hz, no false peaks
- Survive gearbox vibration | vibration test to an IEC 60068-2 method agreed with the laboratory | 3 | functions throughout and after, no damage
- IP66 and IP67 | laboratory tests to IEC 60529 | 3 | no water or dust inside
- *Hot day then hose-down | in-house cycle, 20 repetitions | 3 | no water inside, seal faces undamaged
- Lid in outdoor sun | accelerated weathering agreed with the resin supplier | 6 test plaques | colour and impact strength retained
- Radio link on site | RSRP at mounting positions, guards closed | 2 | better than −105 dBm
```

Some tests are destructive or leave units unfit for others, and some must run in sequence on the same units because the order matters. Sealing, for example, is retested after vibration and thermal cycling, because the point is whether the seal survives them. The plan assigns each unit a route through the tests, which is how the team arrived at twelve DVT units.

## Measure the thermal network

Chapter 4's network had two resistances: R₁ from the enclosure to the gearbox, including the stainless spacer, and R₂ from the enclosure to the air. R₂ was an assumed coefficient, and R₁ included an estimated contact resistance. One test at one power level gives one equation with two unknowns. Two tests at different internal powers give two equations, and both unknowns can be found.

This is an illustration. A DVT unit was mounted through its spacer on a temperature-controlled steel plate at 75 °C, inside a chamber with air at 40 °C and without the sun lamp. A small resistor heater was added inside, so that the internal power could be set. A thermocouple was fixed to the inside of the base.

```figure
type: formula
title: Separating the two thermal resistances with two power levels
formula: G₁ + G₂ = ΔP ÷ ΔT        G₁ × (75 − 40) = T₁ × (G₁ + G₂) − P₁ − 40 × (G₁ + G₂)
caption: This is an illustration with invented test readings. The model predicted 55.4 °C at 0.6 W; the measured 57.8 °C showed the spacer path conducted more than assumed.
- Test 1 | 0.6 W internal, enclosure 57.8 °C
- Test 2 | 3.0 W internal, enclosure 63.1 °C
step: G₁ + G₂ = (3.0 − 0.6) ÷ (63.1 − 57.8) ≈ 0.453 W/K
step: G₁ = (57.8 × 0.453 − 0.6 − 40 × 0.453) ÷ 35 ≈ 0.213 W/K, so R₁ ≈ 4.69 K/W
step: G₂ ≈ 0.453 − 0.213 = 0.240 W/K, so R₂ ≈ 4.17 K/W
```

The measured R₂ of about 4.17 K/W agreed closely with the assumed 4.18 K/W, which confirmed the convection assumption for this shape and orientation. R₁ came out at about 4.69 K/W instead of 6.33 K/W, so the spacer path conducted more heat than estimated, probably because the stud itself carries heat through the spacer's bore and the contact resistances were lower than assumed.

With the measured values, the white-lid-in-sun case becomes **T = (0.213 × 75 + 0.240 × 40 + 0.6 + 1.9) ÷ 0.453 ≈ 62.0 °C**, about 1.7 K hotter than Chapter 4 predicted. With the module about 8 K above that, at about 70 °C, the margin to 85 °C is about 15 K. That is less than the 17 K first estimated, but still acceptable. The thermal model in the design file was updated with the measured values, and the same two-step method is now the standard way the team characterises a new enclosure.

## Prove the measurement, not just the hardware

For most products, a prototype passes if it works and survives. For a monitor, it must also measure correctly. Chapter 3's failure case showed how a board resonance created a false peak and inflated a real one. The DVT plan therefore repeats the reference comparison on three units, on a test gearbox and on a shaker with a sine sweep through the measurement band.

This is an illustration. On the test gearbox, with a laboratory reference accelerometer stud-mounted beside each monitor, the three DVT units read **97%**, **102%** and **104%** of the reference amplitude at the 469 Hz mesh frequency, and showed no peaks absent from the reference spectrum. On the shaker, all three tracked the reference within the ±5% criterion from 10 Hz to 1 kHz. The comparison is recorded with the monitor's firmware version, because the signal processing in firmware affects the result as much as the mounting.

## What twelve units can prove

It is tempting to read a test of twelve units with no failures as proof of reliability. It is not, and knowing why helps decide what the tests are for.

A common way to express what a zero-failure test demonstrates is the success-run relationship: with n units tested and none failing, the reliability demonstrated at confidence C is **R = (1 − C)^(1 ÷ n)**. For **n = 12** and **C = 90%**, **R = 0.1^(1 ÷ 12) ≈ 0.825**. Twelve successes demonstrate, at 90% confidence, only that at least about 82.5% of units would pass the same test. To demonstrate 95% at the same confidence needs **ln 0.1 ÷ ln 0.95 ≈ 44.9**, so **45** units with no failures.

The DVT tests are therefore not a reliability demonstration. They are a search for design faults: a mechanism that causes failure in a few units under stress is very likely to show up in a dozen units tested in sequence. Field reliability is then measured from the installed fleet, with the methods described in the companion book's chapter on verification with a pilot fleet.

## A failure case: the capacitor that cracked

This is an illustration. Three DVT units went through the vibration test. Two passed. The third stopped transmitting midway through the random-vibration part of the test, then recovered and failed again. On inspection, one lead of the tall bulk capacitor had cracked at the edge of its solder joint.

Chapter 3 had specified a bead of staking adhesive to hold that capacitor to the board. The design was right, but the DVT boards had been assembled by an outside board assembler from the board's own assembly files, which did not include the staking. The staking instruction existed only on the mechanical assembly drawing, which the board assembler never received. The two passing units had been staked by hand in the team's workshop before the test. The failing unit had been missed.

The fault was in the documentation, not the design. The corrections were:

1. The staking was added to the board assembly drawing and the board's bill of materials, with the adhesive's part number, so the board assembler applies it as a standard step.
2. A visual inspection point for staking was added to the board assembler's outgoing checks and to incoming inspection.
3. The vibration test was repeated on three units from the corrected process, and all passed.

The failure would not have been found by a test that exercised only correctly built units. Building DVT units through the real supply chain, with the real documents, found a gap that a workshop build would have hidden.

## Order the stresses as the field would

Tests run one at a time on fresh units can each pass while the product still fails in service, because real products meet stresses in sequence and the damage adds up. A seal that holds when new may not hold after a year of vibration, and a vent that works when clean may block after dust exposure. The gearbox monitor's plan therefore runs three DVT units through a sequence that mimics a service life in compressed form: thermal cycling, then vibration, then dust, then the hot-day and hose-down cycle, then the laboratory immersion and jet tests, with a functional check and a leak test between each stage.

The order matters. Thermal cycling comes first because it relaxes gaskets and screw preloads, which vibration then tests. Dust comes before the water tests because a dusty seal face or vent is the realistic condition for the next hose-down. Running the IP tests last, on units that have already been stressed, makes them a stricter test than the same IP tests on new units. A fault found late in the sequence is investigated by repeating the stages on a fresh unit, to find which stage caused it.

## Treat the field trial as a test

The DVT plan ends with a field trial: ten units installed at the quarry for eight weeks, alongside the laboratory work. A field trial is not a demonstration for the customer. It is a test with its own requirements, records and pass criteria, and it finds the problems laboratories cannot: installers, real cable runs, real guards, real hose-down habits and real network coverage.

This is an illustration. The gearbox monitor's trial plan set out what each unit would record: supply voltage at each transmission, internal temperature, signal strength, message success rate and any resets. It also set out what the team would inspect at the end: seal faces, vent, connector pins, cable routes and labels. The trial found the unit under the steel guard in Chapter 7 and the water that came down the cable in Chapter 6. Neither problem would have appeared in a laboratory.

The installers were asked to install from the draft instructions alone, without help from the design team. Every question they asked, and every step they did differently from the instructions, was logged as a finding against the instructions. The instructions are part of the product, and the field trial is the only test they get.

## Record the results so they can be used

Each test produces a short report: the requirement, the test method, the units and their configuration (board revision, enclosure revision, firmware version), the results, any deviations and a pass or fail against the stated criterion. A failure produces a corrective action with an owner, and the retest is linked to it.

These records do three jobs. They show the design meets its requirements, which the release in Chapter 10 depends on. They feed measured values back into the models, as the heated-plate test did. And they are evidence in the compliance file of Chapter 8 for the configuration that was tested.

## How this applies to a small Australian business

A small team cannot afford large prototype builds, which makes planning more important. Trace every test to the brief, so nothing is tested twice and nothing is missed. Build at least one prototype run through the real supply chain with the real documents, because outside assemblers build to the documents they receive, not to the intent in the designer's head. Use in-house tests, such as the heated plate, the hose cycle and the reference comparison, to find faults before paying for accredited laboratory time.

## Exercise: one test, one unknown

Suppose only the first heated-plate test had been run, at 0.6 W with the enclosure at 57.8 °C, and the team assumed R₂ = 4.18 K/W was correct. What R₁ would they calculate? How would the answer change if R₂ were actually 10% higher than assumed?

**Worked answer.** With **G₂ = 1 ÷ 4.18 ≈ 0.239 W/K**, the balance **G₁ × (75 − 57.8) = G₂ × (57.8 − 40) − 0.6** gives **G₁ = (0.239 × 17.8 − 0.6) ÷ 17.2 ≈ (4.25 − 0.6) ÷ 17.2 ≈ 0.212 W/K**, so **R₁ ≈ 4.7 K/W**, close to the two-test result because R₂ happened to be right. If R₂ were actually 10% higher, 4.60 K/W, then **G₂ ≈ 0.217 W/K** and **G₁ ≈ (0.217 × 17.8 − 0.6) ÷ 17.2 ≈ (3.87 − 0.6) ÷ 17.2 ≈ 0.190 W/K**, so **R₁ ≈ 5.3 K/W**. A 10% error in the assumed R₂ moves the inferred R₁ by about 12%. One test cannot separate the two. The second test at a different power is what removes the dependence on the assumption.
