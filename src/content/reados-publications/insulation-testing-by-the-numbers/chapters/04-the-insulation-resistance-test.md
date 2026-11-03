---
book: insulation-testing-by-the-numbers
chapterSlug: the-insulation-resistance-test
order: 4
title: "The insulation resistance test"
description: "Planning and doing a DC insulation resistance test: isolation, test voltage, the three currents, the one-minute reading, correction to 40 °C, comparing phases, and a cable fault blamed on the motor."
draft: false
---

The insulation resistance test is the most common electrical maintenance test in industry. A portable instrument applies a steady DC voltage between a winding and earth, measures the current that flows, and reports their ratio as a resistance, usually in megohms or gigohms. It takes a few minutes, needs no special skill to perform, and catches the two commonest problems, moisture and contamination, before they cause a failure. It is also easy to misread. The reading depends strongly on temperature, on time, on humidity and on everything else connected to the winding, and a reading without those details recorded is close to useless for trending.

This chapter covers preparing and doing the test safely, choosing the test voltage, the three currents that make up the reading and why the one-minute value is used, correcting readings to a common temperature, testing phases separately, and recording the test. It finishes with a low reading on C-1 that was blamed on the motor when the fault was in its cable termination.

## Preparing for the test

Before any test, the machine must be isolated from all sources of supply, locked out under the site's isolation procedure, and proved de-energised with an approved voltage indicator. For low-voltage work in Australia and New Zealand, AS/NZS 4836 sets out the requirements for safe work on or near low-voltage installations; for C-1 and C-2, which are 3.3 kV machines, the site's high-voltage rules and permits apply as well. Anything that could be damaged by the test voltage or that would distort the reading, such as drives, surge capacitors, voltage transformers and electronic protection relays, must be disconnected or the test planned around them.

The winding must then be earthed to discharge any residual charge, and kept earthed until the moment of the test. If the winding has been tested recently, Chapter 3 showed that absorbed charge can remain for many minutes.

Two further measurements are needed before the test: the winding temperature, from embedded temperature detectors where they exist or from a contact thermometer on the frame after the motor has stood long enough to reach a uniform temperature, and the air temperature and relative humidity, which matter for surface leakage and condensation. Without the winding temperature, the reading cannot be corrected and compared.

```figure
type: checklist
title: Before an insulation resistance test on C-1
caption: This is an illustration of the site's procedure. The real procedure for a high-voltage machine is set by the site's rules and permits.
- x Isolated, locked out and proved de-energised under the permit
- x Motor cables disconnected at the terminal box, or the cable's inclusion recorded
- x Surge capacitors and voltage transformers disconnected
- x Winding earthed, then earth removed only for the test
- x Winding temperature from the embedded detectors
- x Air temperature and relative humidity in the plant room
- x Terminal box and end windings inspected for dirt, oil and moisture
- x Barriers and signs to keep people clear of the test leads
```

## The test voltage

The test voltage is a DC voltage chosen according to the winding's rated voltage. Standards for testing rotating machine insulation, such as IEEE Std 43, give guidance relating test voltage to rating; that guidance is not reproduced here and should be read in full for real work. The cold store's own procedure uses 500 V DC for its 415 V motors and 2,500 V DC for its 3.3 kV compressor motors.

The test voltage should not be raised in the belief that a higher voltage is a more searching test. An insulation resistance test is a diagnostic measurement, not a proof test, and its value comes from comparison with previous readings taken at the same voltage. Insulation resistance usually falls a little as voltage rises, and markedly if there is a crack or a weak spot that conducts above a certain field, so readings at different voltages cannot be trended against each other.

## The three currents and the one-minute reading

When the test voltage is applied, the current that flows has three parts, as Chapter 3 described.

The **capacitive charging current** charges the winding's geometric capacitance. It is large at first, limited by the test set's output, and falls to nothing within a fraction of a second for a motor winding, or a few seconds if a long cable is connected.

The **absorption current** feeds the slow polarisation of the insulation. It falls as a power of time over minutes.

The **leakage current** flows through the bulk of the insulation and across its surfaces. It is steady for a given voltage and temperature.

The insulation resistance at time t is the test voltage divided by the total current at that time. Because the absorption current is still falling, the resistance rises during the test, so a single reading has meaning only if the time is fixed. The usual convention is to take the reading after one minute, called IR₁, and that is the reading the site trends.

```figure
type: formula
title: Insulation resistance at time t
formula: IR(t) = V ÷ i(t) = V ÷ (i_c(t) + A × t⁻ⁿ + I_L)
formula: C-1 model at 40 °C and 2,500 V: IR₁ = 2,500 V ÷ (1.113 + 0.137) µA = 2,000 MΩ
caption: By one minute the charging current is negligible. The resistance rises as the absorption current decays; if the leakage current is large it hardly rises at all.
- V | test voltage, V
- i(t) | total current at time t, µA
- IR(t) | insulation resistance at time t, MΩ
```

For C-1 at 40 °C, the working model of Chapter 3 gives a total current at one minute of 1.250 µA, of which the absorption current is 1.113 µA and the leakage current 0.137 µA. The one-minute insulation resistance is therefore 2,500 ÷ 1.250 = 2,000 MΩ. Most of the current at one minute is absorption current, which is the mark of a clean, dry winding.

## Correcting to a common temperature

Chapter 2 showed that insulation resistance falls steeply as temperature rises. The same winding read at 20 °C and at 40 °C gives readings about four times apart. To compare readings taken on different days, the site corrects every reading to a winding temperature of 40 °C, using its rule that resistance halves for each 10 °C rise. The correction factor for a reading taken at temperature T is K = 0.5^((40 − T) ÷ 10), and the corrected value is IR₄₀ = K × IR_T.

```figure
type: formula
title: Correcting a reading to 40 °C
formula: IR₄₀ = K × IR_T        K = 0.5^((40 − T) ÷ 10)
caption: The site's halving rule. A reading below 40 °C is reduced; a reading above 40 °C is increased. The rule is an approximation; a correction curve measured on the machine itself is better.
- IR_T | reading at winding temperature T, MΩ
- T | winding temperature, °C
- K | correction factor
- IR₄₀ | reading corrected to 40 °C, MΩ
```

C-1's readings over three tests illustrate why correction matters. In July, with the winding at 20 °C after an overnight stop, it read 8,000 MΩ. In October, at 26 °C, it read 5,200 MΩ. In January, at 32 °C on a hot day, it read 3,100 MΩ. Uncorrected, the readings appear to fall by more than half in six months. Corrected to 40 °C, they are 2,000, 1,970 and 1,780 MΩ: a small fall, worth watching but not alarming.

```figure
type: compare
title: C-1's readings, raw and corrected to 40 °C
cols: Winding temperature | Raw IR₁ | Factor K | IR₁ at 40 °C
rowhead: Test
- July | 20 °C | 8,000 MΩ | 0.250 | 2,000 MΩ
- October | 26 °C | 5,200 MΩ | 0.379 | 1,970 MΩ
- January | 32 °C | 3,100 MΩ | 0.574 | 1,780 MΩ
caption: This is an illustration. Raw readings fall by 61 %; corrected readings fall by 11 %, within the variation Chapter 6 finds normal for C-1.
```

The correction is least reliable when the winding temperature is far from 40 °C, and it should not be applied across freezing at all: ice is a good insulator, so a winding with frozen moisture in it reads high, and the same winding thawed reads far lower than any temperature correction predicts. The site tests its freezer fan motors only after they have been brought into the workshop and have warmed to near room temperature, or in place after a defrost has warmed them above freezing.

## Testing the phases separately

When all six ends of a three-phase winding are brought out to the terminal box, as on C-1, each phase can be tested separately with the other two earthed. This tests the insulation between each phase and earth, and between that phase and the other two phases, and allows the three phases to be compared. In a sound winding, the three readings are similar, because the phases are built alike and share the same environment. A phase that reads markedly lower than the others points to a local problem, such as contamination or damage in one area, rather than to general moisture, which affects all three.

The site's procedure records the three phases separately at each annual test and compares the lowest with the average of the other two. Where a winding's star point is made inside the machine, as in many low-voltage motors, the phases cannot be separated and the whole winding is tested to earth.

## Recording the test

An insulation resistance reading is only useful with its context. The site's test sheet records the machine, the date, the instrument and its serial number, the test voltage, the readings at 30 seconds, one minute and ten minutes, the winding temperature and how it was measured, the air temperature and humidity, the corrected values, whether a guard was used, and exactly what was connected to the winding during the test: the motor alone, or the motor and its cable, and from which point.

```figure
type: steps
title: The insulation resistance test, in order
caption: This is an illustration of the site's sequence for a motor tested at its terminals.
- Isolate, lock out and prove de-energised
- Disconnect the cables and anything that the test voltage could damage
- Record winding temperature, air temperature and humidity
- Inspect the terminal box and end windings
- Remove the earth and connect the test set: line to the winding, earth to the frame, guard if used
- * Apply the test voltage; record readings at 30 seconds, one minute and ten minutes
- Discharge through the test set, then earth for at least four times the test duration
- Correct the readings to 40 °C and compare with previous tests
```

## The mistake: the cable that wasn't separated

In March, C-1 was tested from the switchboard, through the 150 m of cable to the motor, because the terminal box was hard to reach during other plant room work. The one-minute reading at a winding temperature of 20 °C was 809 MΩ. At the same temperature the previous year, the motor alone had read 8,000 MΩ. The technician reported that C-1's insulation had fallen by a factor of ten and recommended removing the motor for inspection and possible rewind at the next opportunity, a job estimated at about A$45,000.

The electrical supervisor asked whether the cable had been disconnected the previous year. It had: the previous test had been done at the motor terminals. When the cable was disconnected at the motor and each was tested alone, the motor read 7,900 MΩ and the cable read about 900 MΩ. In parallel, 8,000 MΩ and 900 MΩ give 1 ÷ (1 ÷ 8,000 + 1 ÷ 900) = 809 MΩ, which is the reading obtained.

Inspection found that the cable's stress-control termination at the motor end had been damaged during earlier work and was tracking across its surface. The termination was remade, after which the cable read well above 50,000 MΩ, and the motor stayed in service.

```figure
type: stats
title: Separating the motor from its cable
caption: This is an illustration. Readings at 2,500 V DC, one minute and 20 °C winding temperature.
- 809 MΩ | motor and cable tested together from the switchboard
- 7,900 MΩ | motor alone, at its terminals
- about 900 MΩ | cable alone, with a damaged termination
- 809 MΩ | parallel combination of 8,000 and 900 MΩ, matching the first reading
- over 50,000 MΩ | cable after the termination was remade
```

The test sheet now has a mandatory field stating what was in the circuit, and a reading taken with a different configuration from the last one cannot be entered in the trend without a note. When a low reading is found with a cable connected, the cable and motor are separated and tested individually before any conclusion is drawn.

## The step voltage test

A variant of the test applies two or more voltages in steps, for example 500 V, 1,000 V and 2,500 V, each for the same time, and compares the resistances. In sound, clean insulation the readings are nearly the same at each step, because the leakage current rises in proportion to the voltage. A crack, a pinhole or a contaminated path that begins to conduct above a certain field draws disproportionately more current at the higher steps, and the resistance falls. The cold store runs a step test on C-1 and C-2 once a year at the shutdown; at a winding temperature of 20 °C, C-1 read 8,100 MΩ at 500 V, 8,050 MΩ at 1,000 V and 8,000 MΩ at 2,500 V, a fall of about 1 %, which the site regards as normal. A fall of more than a few per cent between steps would prompt closer inspection. The maximum step must stay within the site's procedure for the machine.

## Instruments and their limits

Insulation testers differ in their maximum voltage, their current output, their resolution at high resistance and the stability of their output. A tester that can supply only a small current takes longer to charge a large capacitance, such as a long cable, and its early readings are lower until the charging current has died away. At very high resistances, the current is a few nanoamperes, and leakage across the test leads, the instrument's own terminals and even a damp fingerprint on a lead can be comparable with it; screened leads connected to the guard terminal prevent this. The site keeps one tester for its 3.3 kV machines and uses the same instrument, or one checked against it, for every test, so that differences between instruments do not appear in the trend. Each tester is checked against a reference resistor before use.

## Exercise: a freezer fan motor tested cold

EF-03, in blast freezer BF-1, was tested in place at a winding temperature of −18 °C and read 3,200 MΩ at 500 V DC. The same motor, removed to the workshop and allowed to warm to 22 °C, read 140 MΩ. Correct both readings to 40 °C using the halving rule, and explain why they disagree.

### Answer

**Given:** 3,200 MΩ at −18 °C; 140 MΩ at 22 °C.

**Assumptions:** the halving rule for the correction.

**Method:** K = 0.5^((40 − T) ÷ 10); IR₄₀ = K × IR_T.

**Cold reading:** K = 0.5^5.8 = 0.0180; IR₄₀ = 3,200 × 0.0180 = 57.4 MΩ.

**Warm reading:** K = 0.5^1.8 = 0.287; IR₄₀ = 140 × 0.287 = 40.2 MΩ.

**Why they disagree:** the cold reading was taken on a winding with any moisture frozen. Ice conducts far less than liquid water, so the reading was high, and the halving rule, which describes ionic conduction in a material without a change of state, cannot correct across freezing. The warm reading is the one to trust. At about 40 MΩ corrected, the motor's insulation is far below its sister motors in the storage rooms and should be dried and retested, as Chapter 6 describes.

**Verification:** the two factors differ by 0.5^(−4.0) = 16 for the 40 °C difference in temperature, which matches the ratio 0.287 ÷ 0.0180 = 16.
