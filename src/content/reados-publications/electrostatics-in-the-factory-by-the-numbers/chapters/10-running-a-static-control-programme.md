---
book: electrostatics-in-the-factory-by-the-numbers
chapterSlug: running-a-static-control-programme
order: 10
title: "Running a static control programme"
description: "How to bring earthing, humidity, ionisers, ESD control and precipitator care into one programme with checks, records, training and audits, and how to judge its business case."
draft: false
---

Every chapter of this book ended with a control that had quietly stopped working: a meter held at the wrong distance, humidity measured in the wrong place, a funnel that was never earthed, hangers caked in cured powder, inside corners sprayed the wrong way, ionisers coated in dust, a bench unplugged during a move, precipitator cells left unwashed. None was a failure of technology. Each was a failure of the system around the technology: nobody checking, nobody noticing the change, nobody connecting a symptom with a cause. A static control programme is that system.

This chapter brings the earlier controls together into one programme for the case factory: what it covers, how it is checked and recorded, how changes and incidents feed into it, and how it is audited. It then works out the programme's business case with the BIZOMAT investment appraisal tool, separating savings that were measured from those that were estimated, and ends with a checklist that was always signed and rarely done.

## What the programme covers

The factory's programme is a short document with a register behind it. It covers the four areas where static matters, and for each one it records the hazards, the controls and the checks.

```figure
type: compare
title: The factory's static control register, by area
cols: Main hazard or loss | Controls | Key checks
rowhead: Area
- Powder line PL-2 | Ignition of powder clouds; poor film build; waste | Earthed hangers, guns, hoppers, booth and operators; metal funnel; gun settings; booth interlocks | Hanger resistance daily; bonds monthly; transfer efficiency on change
- * Assembly area | ESD damage to boards; ignition of alcohol vapour | EPA earthing of people and benches; ionisers; humidity; closed bonded dispensers; extraction | Testers at every entry; benches monthly; ionisers monthly; humidity continuously
- Window line | Dust on charged windows | Pulsed DC ioniser at the peel point | Decay and offset monthly; emitters cleaned weekly
- Welding bay | Fume returned to the bay | Two-stage precipitator; washing by welding hours | Collector voltage daily; outlet count after each wash; exposure monitoring
caption: This is an illustration. It shows the factory's register; each line refers to the procedure, the test method and the record for that control.
```

The register is the programme's centre. Every control has an owner, a check, an interval, a pass criterion, a record and a response to a failed check. A control that appears in the register without a check is treated as a control that does not exist, however good it looks.

## Checks, records and who does them

Checks are only as good as their records, and records are only as good as the checks behind them. The factory's rules are simple.

1. **Instrument logs where possible.** Footwear and wrist strap testers log every test with the time and the person; the precipitator supply logs its voltage; the humidity sensors log continuously. Automatic logs cannot be filled in later.
2. **Measured values, not ticks.** Manual checks record the reading, such as a hanger resistance of 0.3 MΩ, not a tick in a box, so that a slow drift is visible and a made-up result is harder to write.
3. **A response for every failure.** Each check's procedure says what to do when it fails: stop, isolate, repair, retest, and record.
4. **Independent sampling.** Someone outside the area repeats a sample of each check during the six-monthly audit and compares the results with the records.

## Changes and incidents

Most of the failures in this book followed a change: a bench moved, a door propped open, a funnel swapped, a target replaced, a washing interval deferred. The factory's change procedure therefore asks, for any change in the four areas, whether it affects an earth path, a humidity zone, an ioniser's position, an EPA boundary or a precipitator's maintenance, and requires the relevant checks to be repeated before work resumes.

Near misses and static shocks in the powder line and assembly area are reported and investigated like incidents, as Chapter 4's dispenser spark was. The factory found that once people saw shocks being taken seriously, reports rose for a few months and then fell as the causes were removed, which is the pattern a reporting system should show.

## Training

Each group is trained in what matters to it: powder line operators in earthing, hanger checks and why turning up the voltage is rarely the answer; technicians in the EPA's rules and why a passed wrist strap test is necessary but not sufficient; maintenance staff in bonding, test instruments, ioniser cleaning and precipitator washing and isolation; supervisors in reading the records and recognising the symptoms of a failing control. The training records sit in the same register as the controls, and refresher training is triggered by audit findings as well as by the calendar.

Audits are where the programme checks itself. The factory's six-monthly audit is done by someone from outside the area, usually the quality engineer for the powder line and the maintenance planner for the assembly area, with the register in hand. The auditor repeats a sample of each check with the factory's instruments, compares the results with the records, walks the area looking for uncontrolled insulators, unbonded conductors and unreported changes, and talks to the people who do the checks about what gets in the way. The findings go to the production manager with owners and dates, and are closed at the next audit or sooner.

## How the programme shows it is working

The factory reviews a handful of measures each quarter, chosen because each one would move if a control failed.

1. **Check completion,** from instrument logs: the share of scheduled checks actually performed, by area. Anything below complete is investigated, not averaged.
2. **Check failures,** with their causes and how long each took to fix. A rising failure rate in one check points to a control that needs redesign rather than more checking.
3. **Process indicators:** powder transfer efficiency and film thickness capability on PL-2, dust rejects on the window line, first-pass test yield and field returns by cause for the control boards, and the precipitator's outlet counts.
4. **Reports:** static shocks and near misses, which should be investigated individually and counted together.
5. **Audit findings,** open and closed.

None of these needs special software; the factory keeps them in a spreadsheet beside the register. What matters is that someone with authority looks at them every quarter, and that a bad number leads to a decision.

## Starting the programme in a new area

When the factory added a small line for coating parts with a solvent-based primer, the static programme was extended to it by the same steps used for the original areas.

1. **Survey:** walk the process with a field meter and electrostatic voltmeter, note every charging operation, every isolated conductor and every insulator near the primer (Chapters 1 to 3).
2. **Assess:** identify the flammable materials and their data, the zones from the hazardous area classification, and compare the discharges that could occur with the materials' ignition energies (Chapter 4).
3. **Control:** in the order of Chapter 4, starting with the flammable atmosphere itself, then charge generation, then earthing and bonding (Chapter 5) and ionisation where insulators remain (Chapter 7).
4. **Check:** add each control to the register with its check, interval and record.
5. **Train:** the operators and maintenance staff for the new line, before it starts.
6. **Audit:** include the new line in the next audit, and compare its first months' records with the assessment's assumptions.

For the primer line, the survey found that the spray gun's fluid hose was a plastic hose with a metal fitting at each end, isolated from the earthed gun body by a plastic coupling. The fitting was bonded before the line started.

## Contractors, visitors and temporary equipment

Static controls are designed around the people and equipment that are always there, and they are easily defeated by those who are not. A contractor welding on the powder booth's structure, a service technician bringing a test instrument into the EPA, a visitor walking the line in their own shoes, or a hired portable fan placed near the alcohol benches can each bring a charge source, an isolated conductor or a discharge into a controlled area.

The factory's permit-to-work and visitor procedures include the static controls: visitors to the EPA use heel grounders and do not handle boards; contractors working in the powder line get a briefing on earthing and on keeping ignition sources away from powder, and their work is planned for when the booth is empty and cleaned; temporary equipment in the assembly area or near the powder line is checked by maintenance before use. These procedures are short, and they exist because each of them was prompted by something that nearly went wrong.

## The business case

Static control costs money, and the factory's managers wanted to know whether it paid. The engineer separated the costs and savings into those measured and those estimated.

```figure
type: compare
title: The static programme's costs and savings
cols: Amount | Basis
rowhead: Item
- Humidifier, ionisers, ESD testers and bench earth monitors, hanger redesign | A$55,500 once | Quotations, excluding GST
- Running costs: humidifier energy and maintenance, ioniser and tester calibration, audit time | A$6,000 a year | Estimates from Chapters 2 and 7
- Powder saved, transfer efficiency 55% to 70% on 12,000 enclosures | A$21,960 a year | Measured, Chapter 6
- Window rework avoided, rejects 6% to 0.5% on 5,000 windows at A$45 each | A$12,375 a year | Measured, Chapter 7
- * ESD field returns avoided, assumed 0.3% of 7,200 boards at A$1,800 each | A$38,880 a year | Estimated, Chapter 8
caption: This is an illustration. Measured savings come from before-and-after records; the ESD saving assumes the programme prevents returns at a modest fraction of the rate seen in the bench incident, and is the least certain figure.
```

The [equipment investment appraisal tool](/tools/investment-appraisal/) works out the net present value, internal rate of return, payback and benefit–cost ratio of a purchase with uniform yearly savings and running costs. Over eight years at a 9% hurdle rate, with all three savings, it gives a net yearly flow of A$67,215, a net present value of A$316,523 and a simple payback of 0.83 years. With the measured savings only, leaving out the ESD estimate, it gives a net yearly flow of A$28,335, a net present value of A$101,329 and a payback of 1.96 years.

```figure
type: compare
title: The business case with and without the estimated ESD saving
cols: Net yearly flow | Net present value at 9%, 8 years | Simple payback | Benefit–cost ratio
rowhead: Savings counted
- Measured only: powder and windows | A$28,335 | A$101,329 | 1.96 years | 2.14
- * Measured plus estimated ESD returns | A$67,215 | A$316,523 | 0.83 years | 4.57
caption: This is an illustration. Results from the equipment investment appraisal tool with A$55,500 invested, A$6,000 a year of running costs and no salvage value. Safety benefits, such as the avoided ignition risk at the hopper and the alcohol benches, are not valued in money here.
```

The case stands on the measured savings alone, which is the version the engineer led with. The ESD estimate, the largest single number, is the hardest to prove, because a prevented field failure leaves no trace; the factory tracks field returns by cause so that, over a few years, the estimate can be replaced by a measurement. And the most important benefit, a lower chance of a fire in the powder booth or at the alcohol benches, appears nowhere in the arithmetic, which is correct: safety controls are required by duty, not justified by payback.

## What the programme does not replace

A static control programme is one part of the factory's safety and quality systems, not a substitute for others. It does not replace the hazardous area classification and the selection of certified equipment for the zones, which are done by competent people to the applicable standards; it assumes them. It does not replace the electrical installation's protective earthing and its inspection by licensed electricians; it relies on them. It does not replace the booth's fire protection, the extraction design or the welders' exposure monitoring. And it does not replace the component suppliers' data or the customers' own ESD requirements, which may be stricter than the factory's. The register says, for each area, which other systems it depends on and who owns them, so that a change in one, such as a new booth, a new electrical contractor or a new customer specification, prompts a review of the static controls as well.

## When it goes wrong: the checklist that was always signed

At the first six-monthly audit, the auditor compared the powder line's daily hanger check sheet with the megohmmeter's own memory, which stores each reading with its time. The sheet showed a signature and "OK" for every day of the period. The meter's memory showed readings on only about a third of those days, and none at all for a fortnight in which the sheet was fully signed.

The checks had not been falsified out of carelessness so much as squeezed out by a busy start of shift, with the sheet signed at the end because the line had run without obvious problems. Chapter 5 had already shown how hangers drift out of earth without obvious problems until film build fails or a spark is seen.

```figure
type: decision
title: Making the hanger check real
caption: This is an illustration. It shows the factory's response, agreed with the line supervisors.
- Remind operators to do the check | Changes nothing about why it was skipped | Not adopted alone
- * Record readings from the meter's memory instead of a signed sheet, and build the check into the line start-up so the conveyor waits for it | The check cannot be skipped unnoticed; takes about five minutes | Adopted
- Move the check to the maintenance team | Adds a hand-over and loses the operators' ownership | Not adopted
```

The check now takes about five minutes at start-up, the line's start-up screen waits for it, and the record is the meter's own data. The auditor's sampling found no gaps in the next period. The same comparison, a signed record against an instrument's own data, was then applied to every check in the register that had a logging instrument, and two more paper checks were moved onto instrument records. The general lesson is that a control's record should come from the measurement itself wherever possible, and that a checklist which is always signed and never fails deserves a closer look.

## Exercise: the business case at a lower powder saving

The powder saving depends on how much reclaimed powder the line reuses. Suppose only half of the measured A$21,960 is a real saving, because more reclaim is now reused.

1. What are the measured savings and the net yearly flow?
2. Roughly what payback does that give on A$55,500?
3. How should the factory present the case?

**Answer.**

1. Measured savings: A$10,980 + A$12,375 = A$23,355 a year; less A$6,000 running costs, a net flow of A$17,355.
2. A$55,500 ÷ A$17,355 = 3.2 years simple payback. The [equipment investment appraisal tool](/tools/investment-appraisal/) would give the discounted payback and net present value; at 9% over eight years the case still has a positive value.
3. Lead with the measured savings and the uncertainty in each, show the ESD estimate separately as a likely additional benefit, and state that the safety controls at the powder line and the alcohol benches are required regardless of payback. A case built on its most certain numbers survives questioning.
