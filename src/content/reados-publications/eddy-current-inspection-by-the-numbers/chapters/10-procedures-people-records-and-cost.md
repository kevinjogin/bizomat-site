---
book: eddy-current-inspection-by-the-numbers
chapterSlug: procedures-people-records-and-cost
order: 10
title: "Procedures, people, records and cost"
description: "What a written eddy-current procedure contains, personnel qualification, reference checks and what to do when one fails, the records that make a result traceable, and the cost per part."
draft: false
---

Every chapter of this book has ended its mistake with a change to a procedure: a phase check with a shim, a three-depth rule, a centring sleeve, a zero coupon engraved with its alloy, reference checks at production speed, a reference shaft for each supplier, a designed sampling plan. That is how inspection matures. An eddy-current result is trustworthy only if it was produced by a qualified person following a written procedure, on equipment checked against references, and recorded so that it can be traced and reviewed. This chapter brings the pump maker's practices together: what its procedures contain, who may perform and interpret the tests, what happens when a reference check fails, what is recorded, and what it all costs.

## What a procedure contains

A written procedure turns a method into a repeatable test. ISO 15549 sets out general principles for eddy-current testing, and product and customer specifications add their own requirements. The pump maker's procedures follow the same outline for every test, so that an inspector moving between them always knows where to look.

```figure
type: checklist
title: Contents of each of the pump maker's eddy-current procedures
caption: This is an illustration. The order follows the pump maker's own template.
- x Scope: the part, the material, the surfaces covered and those not covered
- x Applicable standards and specifications, named by number, with the customer's requirements
- x Personnel: the qualification and certification level needed to perform and to interpret
- x Equipment: instrument, probe, frequency, filters and any scanner or fixture, by identity
- x Reference standards: identity, certificate, what each is used for
- x Set-up: balance, phase, gain, threshold, and how each is checked
- x Checks during use: when, on what, the acceptance limit, and what to do if one fails
- x Test method: surface preparation, temperature, scan plan, edge distances, blanked zones and how they are covered
- x Decision rules: thresholds, guard bands, confirmation steps and sampling plans
- x Records and reports: what is recorded for each part, lot or batch, and where it is kept
```

The procedures do not reproduce any standard's text; they state the pump maker's own instructions and name the standards whose requirements they are written to meet. Each procedure has an owner, an issue number and a review date, and it is reviewed after every mistake of the kind this book describes and at least every two years.

## People

Eddy-current testing depends heavily on the inspector's judgement: setting the phase, recognising an edge signal, deciding that an indication repeats. ISO 9712 specifies the qualification and certification of personnel for non-destructive testing, including eddy-current testing, by examination, training and documented experience, at three levels. In broad terms, a level 1 person performs tests under written instructions and supervision; a level 2 person also sets up equipment, interprets and evaluates results against the procedure and writes instructions; and a level 3 person is responsible for procedures and methods. The details, including the required training hours and experience, are in the standard and the certification scheme's own rules.

The pump maker's goods-in inspectors and journal scanner operators are certified at level 1 for the tests they run, and two quality technicians at level 2 set up the equipment, interpret indications and sign off the confirmation of rejects. The procedures were written and are reviewed with an external level 3 consultant. The certification of each person, with its expiry date and the methods and sectors it covers, is kept with the training records, and the scanner's software will not start a production program for an operator whose certification has lapsed.

## When a reference check fails

Every procedure includes checks on a reference during use, and every check has a rule for what happens when it fails. The journal scanner's rule is that the 0.5 mm notch must give at least 80% of its set-up signal of 2.6 divisions, 2.08 divisions, at each two-hourly check; if it does not, every shaft scanned since the last good check is rescanned after the fault is corrected.

### The mistake: a skipped check

On a busy afternoon shift, the scanner operator skipped the 4 pm reference check because a delivery truck was waiting. At the end-of-shift check at 10 pm, the 0.5 mm notch gave 1.6 divisions, 62% of its set-up signal. The cause was a chipped wear shoe that had been lifting the probe slightly off every journal; the extra lift-off weakened every signal.

Because the 4 pm check had been skipped, the last good check was at 2 pm, eight hours before. Every shaft scanned since then, 160 in all, had to be rescanned after the shoe was replaced and the set-up confirmed. The rescan found one cracked shaft. Its crack gave 2.2 divisions with the new shoe, above the threshold, and had given about 1.2 divisions during the afternoon, below it. Had the 4 pm check been done, the fault would probably have been found and the rescan limited to the shafts since 4 pm; had the end-of-shift check also been skipped, the cracked shaft would have been shipped.

```figure
type: steps
title: The failed reference check and its consequences
caption: This is an illustration. Two-hourly checks; acceptance at least 80% of the set-up signal.
- 2 pm check | 0.5 mm notch 2.6 divisions: pass
- 4 pm check | Skipped
- * 10 pm check | 1.6 divisions, 62% of set-up: fail
- Cause | Chipped wear shoe lifting the probe; shoe replaced, set-up confirmed at 2.6 divisions
- Rescan | All 160 shafts since the 2 pm check: one cracked shaft found and scrapped
- Prevention | Scanner software now stops production when a check is overdue by more than 15 minutes
```

The procedure already said what to do. What changed was the design of the system: the scanner now enforces its own checks, because a rule that depends on memory on a busy shift will eventually be broken.

## Records

The records are what make a result traceable. For each test, the pump maker records enough that a reviewer, months or years later, could reconstruct what was done and judge whether it was valid.

```figure
type: compare
title: What the pump maker records for each test
cols: For each part, lot or batch | For each session
rowhead: Test
- Bar conductivity | Bar heat and supplier, part temperature, three readings and their corrected mean, decision | Meter, probe, standard checks with times, inspector
- Coating thickness | Batch, housing serials sampled, location and reading, tolerance interval | Gauge, zero coupon, foil check, inspector
- Journal scan | Shaft serial, program, result, confirmation of any reject | Reference checks with times and amplitudes, wear shoe count, operator
- Shaft sort | Shaft serial, bridge output, supplier reference used | Good and fail master readings, operator
- Tube audit | Lot, supplier records reviewed, tubes tested, defectives and their confirmation, decision | Bench reference checks, inspector
caption: This is an illustration. Records are kept electronically against serial numbers for the life of the product plus the customer's retention period.
```

## Change is where tests fail

Looking back over the book's mistakes, almost every one followed a change that nobody treated as a change to the test. A new technician arrived used to another instrument. A thinner part arrived for a test set up on thick ones. A coating gauge's workstation moved and its zero went with a convenient offcut. A scanner was speeded up. A new bar supplier was approved. A supplier proposed a sampling plan. A busy shift skipped a check. None of these was a fault in the method; each was a change that bypassed the thinking the method depends on.

The pump maker's change control now lists the changes that require a test to be revalidated before it is used again: a new or repaired instrument, probe or scanner component; new software or settings; a new part, material, supplier or surface condition; a new inspector; a moved or rebuilt workstation; and any change to speed, frequency, filters or thresholds. Revalidation means the reference checks of the procedure, run as production runs, and, for any change to the part or material, a check that the decision rules still separate good from bad with the margins the procedure assumes. A level 2 technician signs off each revalidation, and the record is kept with the procedure.

## Blind test parts

Reference checks prove that the equipment responds to a notch in a known place. They do not prove that the whole system, people included, finds a defect in an unknown place under production conditions. The pump maker therefore keeps a small set of blind test parts: two shafts with real grinding cracks found in earlier production, confirmed by magnetic particle inspection and marked only with a code, a housing with a measured coating deliberately near the lower limit, and a bar offcut in the O temper. Once a month, the quality engineer slips one into the production flow without warning. The result, found or missed and how it was handled, goes on the procedure's review record. A blind part that passes unnoticed is a far more useful finding than a reference check that passes, because it tests what the customer depends on.

## Equipment and standards

The instruments themselves need periodic verification as well as daily checks. The ISO 15548 series sets out how eddy-current instruments, probes and systems are characterised and verified, and the pump maker's instrument maker verifies each instrument annually against its own published characteristics, issuing a report kept with the instrument's history. Reference standards, notched journals, reference tubes, conductivity blocks and coating foils are recalibrated or re-measured on fixed intervals and whenever damaged, and each is identified, stored in its own case and recorded in a register that shows where it is, when it was last calibrated and which procedures depend on it. A reference standard that has quietly changed is worse than none, because every result checked against it inherits the change.

## Reporting to customers

When a customer asks for evidence of inspection, the pump maker's report states the method, the procedure and its issue number, the instrument and reference standards used with their calibration status, the inspector and the level of their certification, the results, and the decision rule applied, such as guarded acceptance for conductivity. It says what the test covers and what it does not, for example that cracks below 0.5 mm are not reliably detected and that the oil hole's edge was inspected by a separate hand probe. A report that states its own limits is more useful to a customer than one that implies a certainty no inspection can give.

## The cost of inspection

The [machine hour rate tool](/tools/machine-hour-rate/) gives the inspection station's hourly cost. Its instruments, the journal scanner, the sorting bridge, the tube bench and their reference standards cost A$68,000 installed, excluding GST, with a resale value of A$5,000 after eight years. At 9% interest, 1,800 productive hours a year, A$2,500 a year of floor space, 0.4 kW of power at A$0.28 a kilowatt-hour, A$4,500 a year for maintenance and calibration of the instruments and standards, and A$3 an hour of probes, wear shoes and consumables, the machine rate is A$13.57 an hour. With an inspector at A$78 an hour, fully loaded, the station costs A$91.57 an hour.

```figure
type: compare
title: Inspection cost per item at A$91.57 an hour
cols: Time | Cost
rowhead: Item
- Housing: conductivity share per housing plus coating readings | 0.8 min | A$1.22
- * Shaft: journal scan 42 s plus handling and sorting | 1.2 min | A$1.83
- Tube lot audit: 132 tubes on the bench and records review | 92 min | A$140.41, A$0.07 a tube
- Confirming one reject or false call | 10 min | A$15.26
caption: This is an illustration. Costs excluding GST.
```

Inspection adds a little over three dollars to each pump's housing and shaft. Set against that is the cost of a single escape: a returned pump, a customer's downtime and, after the cracked journal in Chapter 6, a rescan of nearly two thousand shafts. The station's cost is also sensitive to how much it is used. The tool's warning applies here as everywhere: base the productive hours on measured use. At 1,200 hours a year instead of 1,800, the machine rate rises from A$13.57 to A$18.81 an hour, and the station's rate from A$91.57 to A$96.81, because the capital, space and maintenance are spread over fewer hours; the inspector's time, the largest part, does not change.

## Inspection as feedback

An inspection that only sorts good parts from bad pays for itself once, by stopping a bad part. An inspection whose records are used to improve the processes upstream pays again and again, by stopping the bad parts being made. Each of the pump maker's eddy-current tests now feeds a named process owner.

The bar conductivity records go to the purchasing engineer each quarter as a chart for each supplier, and a supplier whose bars drift towards a limit hears about it while every bar still passes. The coating thickness records go to the anodising supervisor, whose line was found running below the centre of the specification in Chapter 9; recentring it raised the capability index without touching the spread. The journal scanner's p-chart goes to the grinding cell, whose dressing routine it changed. The sorting bridge's outputs, logged by bar heat, go back to the bar suppliers as evidence of heat-to-heat variation. And the tube audit results go to the tube maker, who tightened its own process so that lots run well inside the designed plan's acceptable level.

Over the first year, the confirmed crack reject rate on the journals fell and the coating thickness spread narrowed. The inspection station's cost per part did not change, but the number of parts it had to reject, confirm or rework did, and that is where most of the savings from inspection come from.

## Exercise: the cost of a check interval

The journal scanner's two-hourly reference check takes 3 minutes. Over a 16-hour day of two shifts, how much does checking every two hours cost, at A$91.57 an hour, compared with checking every four hours? If a failed check means rescanning every shaft since the last good one, at 200 shafts a day spread evenly over 16 hours and 1.2 minutes a shaft, what is the largest rescan each interval can cause? Which interval would you choose?

### Answer

Every two hours over 16 hours means 8 checks a day, 24 minutes, A$36.63. Every four hours means 4 checks, 12 minutes, A$18.31. The shorter interval costs A$18.31 a day more.

At 200 shafts in 16 hours, 12.5 shafts are scanned an hour. A failed check at the end of a two-hour interval means rescanning up to 25 shafts, 30 minutes or A$45.79; at the end of a four-hour interval, up to 50 shafts, 60 minutes or A$91.57. One failed check in a month at the longer interval costs more in extra rescanning than the shorter interval saves in a few days, and the longer interval also lets a fault run twice as long before it is found, with twice as many shafts at risk of shipping before it is. The two-hour interval is the better choice, and the scanner's software now enforces it. The general lesson is that a check interval should be chosen from the cost of the largest rescan it can cause and the number of parts that could ship with an undetected fault, not from the cost of the checks alone, which is almost always the smallest of the three.
