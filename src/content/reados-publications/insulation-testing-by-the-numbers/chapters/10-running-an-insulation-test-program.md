---
book: insulation-testing-by-the-numbers
chapterSlug: running-an-insulation-test-program
order: 10
title: "Running an insulation test program"
description: "Putting the tests together: what to test and when, site criteria, records, safety, the blast freezer results after the fix, rewind or replace, and testing that cost more than it saved."
draft: false
---

The earlier chapters each describe one test or one stress. A program puts them together: it decides which machines are tested, with which tests, how often, against what criteria, by whom and under what safety rules, and what happens when a result is outside its expected range. A good program spends its effort where failure is likely and costly, records results so that they can be compared over years, and turns results into decisions: run, clean, dry, repair, rewind or replace. A poor program generates numbers that nobody reads, or tests cheap machines so often that it costs more than the failures it prevents.

This chapter sets out the cold store's program for its three groups of motors, its criteria and records, and the safety rules that govern the testing. It reviews the blast freezer fan motors' record after the fix of Chapter 6, uses the repair or replace tool to decide whether to keep rewinding the old fan motors or replace them, and finishes with an extension of testing to the storage-room motors that cost ten times what it saved.

## The program

The cold store's program, set out in the figure below, follows the ranking of Chapter 1. The compressor motors get the most attention because their failure is the most costly. The blast freezer fan motors are tested often while the fix of Chapter 6 is proven. The storage-room fan motors are tested before restarts and at their annual service. The condenser fan motors are tested annually, with the drive surges checked after any change to drive, filter or cable.

```figure
type: compare
title: The cold store's insulation test program
cols: Tests | When | Who
rowhead: Machines
- C-1 and C-2 | IR at 30 s, 1 and 10 min with PI; step test; capacitance and tan δ with tip-up; inspection | annual shutdown | site electricians; rewinder for AC tests
- C-1 and C-2 | IR at 1 min with DAR; winding temperature trend | quarterly stops, before restart after any stop over a week | site electricians
- C-1 and C-2 | off-line partial discharge | every few years, or if tip-up rises | rewinder
- Blast freezer fan motors | IR at 1 min, corrected, after warming | every planned stop for a year after the fix, then annual | site electricians
- Storage-room fan motors | IR at 1 min, corrected | annual service; before restart after a standstill | site electricians
- Condenser fan motors | IR at 1 min; terminal peak voltage | annual; peak measured after any drive, filter or cable change | site electricians
caption: This is an illustration of the site's program. Test voltages, criteria and procedures are the site's own and must be set for real machines from the relevant standards and the makers' guidance.
```

## The site's criteria

The criteria the site uses, all labelled in its procedure as site criteria rather than values from a standard, are those developed in earlier chapters. For C-1 and C-2: a one-minute reading corrected to 40 °C of at least 1,000 MΩ and a polarisation index of at least 2.0 before energising, with any reading outside the individuals chart limits of Chapter 6 investigated even if it meets those values; a tan delta and capacitance within their usual range at the reference temperature; and a tip-up below 0.1 percentage points. For the fan motors, which are random-wound and for which the polarisation index means little, the criterion is the corrected one-minute reading compared with the motor's own history and with its sister motors, with any motor reading less than a quarter of the median of its group investigated before restart.

Criteria are reviewed each year with the rewinder, using the year's results. A criterion that is never met by healthy machines, or always met by failing ones, is wrong and is changed.

```figure
type: checklist
title: What every test record contains
caption: This is an illustration of the site's test sheet. A reading without these details cannot be trended.
- x Machine, date, technician and instrument with its serial number
- x Test voltage and the times of each reading
- x Winding temperature and how it was measured
- x Air temperature and relative humidity
- x Exactly what was in the circuit: motor alone, motor and cable, from which point
- x Guard used or not, and where
- x Raw and corrected readings, PI or DAR where meaningful
- x Comparison with the last result and with the control chart limits
- x Decision taken and by whom
```

## Safety

Every test in this book applies a voltage high enough to injure, and every tested winding stores charge afterwards. The site's rules are simple and absolute: testing is done only by competent, authorised people; the machine is isolated, locked out and proved de-energised under the site's procedures before the test, which for low-voltage equipment follow AS/NZS 4836 and for the 3.3 kV machines the site's high-voltage rules as well; the test area is barricaded while voltage is applied; the winding is discharged and then earthed for at least four times the test duration, and stays earthed until reconnected; and test equipment is rated for the voltage, inspected before use and calibrated on schedule.

## The blast freezer motors after the fix

Two years after the drains were repaired and the motors remounted, the four blast freezer fan motors had run 4 × 2 × 8,760 = 70,080 hours without a winding failure. Their corrected insulation resistance readings, tested at every planned stop, had stayed between 3,000 and 6,000 MΩ, against the 7 to 60 MΩ found on the worst of them before.

The [MTBF confidence bounds tool](/tools/mtbf-confidence-bounds/), given 70,080 hours and no failures at 90 % confidence, gives a lower bound on the MTBF of 30,435 hours. That is far better than the 17,861 hours of Chapter 1, but it does not yet demonstrate the ten-year target, and the tool reports that about 131,600 more failure-free hours would be needed, nearly four more years for the four motors. Zero failures in a short record cannot prove a high MTBF; it can only show that the old rate has gone. The site moved the blast freezer motors to annual testing but kept the restart tests, and will review the record again.

```figure
type: stats
title: The blast freezer fan motors before and after the fix
caption: This is an illustration. Bounds from the MTBF confidence bounds tool at 90 % one-sided confidence.
- 7 failures in 210,240 h | six years before the fix
- 17,861 h | 90 % lower bound on MTBF before the fix
- 0 failures in 70,080 h | two years after the fix
- 30,435 h | 90 % lower bound on MTBF after two years
- about 131,600 h | further failure-free hours to demonstrate 87,600 h
```

## Rewind or replace the fan motors

Many of the evaporator fan motors are now old, and several have been rewound once or twice. Each time one fails or needs drying, the site must choose between repairing it and replacing it with a new motor that is more efficient and better sealed. The [repair or replace tool](/tools/repair-or-replace/) compares the two by equivalent uniform annual cost.

For a typical old fan motor, the site's working figures are as follows. The defender, the old motor, has a present value of about A$100 as a spare. Its costs that differ from a new motor's in the next year are about A$620: about A$276 of extra electricity, because at an assumed efficiency of 82 % against 87 % for a new motor, delivering 1.8 kW continuously it draws 2.195 kW instead of 2.069 kW, which at A$0.25 per kWh over 8,760 hours costs 0.126 × 8,760 × 0.25 = A$276; about A$225 of expected repairs, a one-in-four chance each year of a rewind and refit costing about A$900; and about A$120 of extra testing and drying. These costs are expected to rise by about A$90 a year as the windings age, and the motor's remaining life is taken as five years. The challenger, a new motor, costs A$1,450 installed, with differing costs of about A$165 a year for its smaller expected repairs and routine tests, and a life of twelve years. The interest rate is 8 %.

With these figures, the tool gives the defender an equivalent annual cost of A$811 and the challenger A$357: replacing is cheaper by A$454 a year per motor. The site's decision is to replace each old fan motor when it next comes out for a fault, drying or rewind, rather than rewinding it again, and to buy the replacements to a specification that includes the drain holes and sealing that the blast freezers taught it to value.

```figure
type: compare
title: Keep rewinding or replace an old fan motor
cols: Defender, old motor | Challenger, new motor
rowhead: Item
- Value or price | A$100 as a spare | A$1,450 installed
- Differing costs next year | A$620 | A$165
- Yearly rise in costs | A$90 | none assumed
- Life | 5 years remaining | 12 years
- Equivalent annual cost at 8 % | A$811 | A$357
caption: This is an illustration. From the repair or replace tool. Efficiencies, repair probabilities and prices are the site's working assumptions.
```

## Acting on a result

A result outside its expected range starts a short, fixed sequence, so that the response does not depend on who happens to be on shift. First, the test is checked: the winding temperature and its correction, what was in the circuit, whether the guard was used, and whether the instrument and voltage were the same as last time. Chapters 2, 4 and 7 each found a false alarm at this step. Second, the cheap explanations are examined: dirty terminal boards and end windings, moisture after a stop, a failed heater. Third, the machine is cleaned or dried as needed and retested, and the result compared with its history again. Only if the result is still abnormal after that is a repair, rewind or replacement considered, and for C-1 and C-2 the rewinder is asked to review the full set of results before any decision.

```figure
type: decision
title: The site's response to an abnormal result
caption: This is an illustration of the sequence. Each step is recorded on the test sheet.
- Result outside its usual range | Check the test: temperature, circuit, guard, instrument, voltage | Most false alarms end here
- Test confirmed | Inspect for dirt, moisture, failed heaters; clean or dry | Most real problems end here
- Still abnormal after cleaning or drying | Further tests: phases separately, AC tests, rewinder's review | Points to the winding itself
- Winding confirmed weak | Plan repair, rewind or replacement with the repair or replace comparison | Timing set by risk and cost
```

## New and rewound motors

Every new or rewound motor is tested before it enters service, and those results become its baseline. The site asks its rewinder for the insulation resistance and polarisation index, the surge test result and, for the compressor motors, the capacitance, tan delta and tip-up at the rewinder's works, all with the winding temperature recorded. The same tests are repeated on site after installation, so that any damage in transport or handling shows up, and the site's own instrument provides the first point of each trend. A motor that arrives without test results is not accepted until they are supplied. For drive-fed motors, the terminal peak voltage is measured at commissioning, as Chapter 8 described, and the motor's specification is checked against it.

## The mistake: testing that cost more than it saved

After the blast freezer findings, the maintenance planner extended quarterly insulation resistance tests to all twenty storage-room fan motors, reasoning that more testing could only help. Each test needed an electrician to isolate the motor, open the evaporator casing in a freezer room, test and record: about A$60 of labour and access time per motor. Twenty motors tested four times a year cost about 20 × 4 × A$60 = A$4,800 a year.

At the next annual review, the electrical supervisor compared this with what the tests could prevent. In six years the storage-room motors had had two winding failures, about one every three years. At about A$1,500 each for a replacement motor, labour and the brief loss of one fan in a room with several, the failures cost about A$500 a year. Even if quarterly testing had prevented every one of them, which it could not, it would have cost nearly ten times what it saved. Most of the tests had found nothing, as expected for motors in rooms with only one defrost a day.

```figure
type: bars
title: Yearly cost of testing the storage-room fan motors against the failures it could prevent
unit: A$ per year
max: 5000
caption: This is an illustration. Labour at about A$60 per motor test; failures at about A$1,500 each, two in six years.
- * Quarterly tests, 20 motors | 4800
- Annual tests, 20 motors | 1200
- Cost of the failures, if all were prevented | 500
```

The program was changed back: the storage-room motors are tested at their annual service and before any restart after a standstill, which is when a test is most likely to catch a wet winding. Even the annual tests cost more than the failures they prevent; they are kept because they also find drain and sealing problems early, and because the cost of a fan failure in a room full of product on a hot day is higher than the average suggests. The lesson is that testing effort follows likelihood and consequence, as Chapter 1 ranked them, and that the test program itself should be costed.

## What the program is worth

The program's value lies mostly in the compressor motors. Its annual cost, including the rewinder's AC tests, the site's labour and the condenser drive measurements, is about A$9,500. A summer failure of C-1 would cost about A$180,000 in hire, transfer and lost product beyond a rewind of about A$45,000. If the program prevents one such failure in twenty years, that alone is worth about A$11,250 a year, before counting the fan motor failures avoided, the unnecessary rewinds and inspections it has already stopped in earlier chapters, and the earlier warning it gives of ageing. The site's judgement, reviewed each year, is that the program pays its way, provided its effort stays where the risk is.

## Reviewing the program

Once a year, the electrical supervisor, the maintenance planner and the rewinder review the program together. They look at every failure and near miss of the year and ask which test, if any, could have caught it; at every false alarm and ask which check would have stopped it sooner; at the cost of the testing against the failures avoided; and at whether the criteria still separate healthy machines from unhealthy ones. The changes described in this book, from guarded tests and cable separation to small-motor criteria, temperature limits for AC tests, named activation energies and reduced testing of the storage-room motors, each came out of such a review. A program that never changes is probably not being read.

## Exercise: proving the fix

How many failure-free hours in total would the four blast freezer motors need to demonstrate an MTBF of 87,600 hours at 90 % confidence, and how many years is that from the start of the record after the fix? The 90 % chi-square value for two degrees of freedom is 4.605.

### Answer

**Given:** no failures; 90 % one-sided confidence; requirement 87,600 hours; four motors running continuously.

**Assumptions:** a constant failure rate after the fix; the record ends at a fixed time.

**Method:** with no failures, MTBF_L = 2T ÷ χ²(0.90, 2) = 2T ÷ 4.605. Setting MTBF_L = 87,600 gives T = 87,600 × 4.605 ÷ 2.

**Total hours:** 87,600 × 4.605 ÷ 2 = 201,700 hours.

**Years:** 201,700 ÷ (4 × 8,760) = 5.76 years from the fix.

**Conclusion:** after two years, with 70,080 hours, the motors need about 131,600 more failure-free hours, roughly another three and three-quarter years. A single failure in that time would push the demonstration further out.

**Verification:** with no failures, the lower bound can also be written T ÷ ln 10, because χ²(0.90, 2) = 2 ln 10 = 4.605; the MTBF confidence bounds tool, given 70,080 hours and no failures, gives a lower bound of 30,435 hours, equal to 70,080 ÷ 2.3026, and about 131,626 further hours needed, which agrees.
