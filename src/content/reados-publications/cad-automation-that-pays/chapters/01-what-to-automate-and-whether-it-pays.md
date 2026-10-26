---
book: cad-automation-that-pays
chapterSlug: what-to-automate-and-whether-it-pays
order: 1
title: "What to automate, and whether it pays"
description: "Choose CAD tasks to automate from a time study, the task's frequency, its error cost and its stability, estimate build and upkeep cost, and work out a payback before writing code."
draft: false
---

The question for any CAD automation is not whether it can be done; almost anything a person does in a CAD program can be done by code. The question is whether doing it in code is cheaper, over the tool's life, than doing it by hand. That depends on how often the task is done, how long it takes, how often people get it wrong and what that costs, and how much the tool will cost to build and keep working. A tool that saves a minute a day and breaks at every upgrade is a hobby. A tool that saves five hours a week and removes a class of errors is an asset.

This chapter sets out how to answer the question with numbers before writing code. It covers the time study that measures a task, the factors that make a task a good candidate, the costs of building and maintaining a tool, and a payback calculation that a manager can check. The running case measures the drawing office's release process and finds that a release pack tool should pay for itself in under six months, while an earlier tool would have taken twenty years.

## Measure the task first

Estimates of how long a routine task takes are usually wrong, and usually low, because the person doing it does not count the small steps. A short time study fixes that: watch the task done a few times, break it into steps, and time each step.

This is an illustration. The CAD administrator watched two drafters release ten drawings each and averaged the steps:

```figure
type: compare
title: Time to release one drawing by hand
cols: Minutes | What the step involves
caption: This is an illustration. Average of 20 releases by two drafters. Small steps add up to eight minutes a drawing.
- Check title block properties | 2.0 | Open the drawing, read each field, compare with the register
- Save PDF of the drawing | 1.0 | Save As, choose PDF, name the file
- Save DXF of sheet metal flats | 1.5 | For sheet metal parts only, averaged over all drawings
- Save STEP of the model | 1.0 | Open the model, Save As, STEP, name the file
- Copy files to the release folder | 1.0 | Rename to the convention, copy, check
- *Record the release in the register | 1.5 | Open the register, add a row, enter revision and date
- Total | 8.0 | Per drawing
```

At 40 drawings a week, the office spends 40 × 8 = 320 minutes, or **5.33 hours**, a week releasing drawings. Over 46 working weeks that is about **245 hours a year**.

The study also counts errors. In the last year's register, about 3% of releases had a fault found later: a PDF at the wrong revision, a STEP file missing, a file named against the convention. At 40 drawings a week for 46 weeks, that is about **55 faults a year**, each costing, by the administrator's estimate, three-quarters of an hour to find and fix: about **41 hours** a year.

## What makes a good candidate

Not every slow task is worth automating. The office scores candidates on five questions, each of which can sink a candidate on its own:

1. **Frequency.** How often is the task done? A task done 40 times a week repays effort that a task done twice a year never will.
2. **Time per instance.** How long does it take by hand? Eight minutes matters; ten seconds rarely does.
3. **Error cost.** How often do people get it wrong, and what does a mistake cost? A task whose errors reach suppliers is worth automating for its consistency alone.
4. **Stability.** Will the task be the same next year? A process the office is about to change is a poor candidate, because the tool will need rewriting.
5. **Data readiness.** Is the information the tool needs reliably in the files? A tool that fills a title block from custom properties is only as good as the properties, and READOS's *CAD Standards That Stick* deals with getting them right first.

```figure
type: matrix
title: Where a CAD task sits as an automation candidate
x: Hours a year spent on the task
y: Stability of the task and its data
hot: 2
caption: This is an illustration. High hours and a stable task with clean data are the sweet spot; low hours rarely justify a tool however stable the task.
- Stable, few hours | Script it only if it is trivial; otherwise leave it
- Stable, many hours | Automate: the release pack sits here
- Changing, few hours | Leave it manual
- Changing, many hours | Fix the process or the data first, then automate
```

## What a tool costs

A CAD tool has three costs, and the third is the one that is usually left out.

**Building.** Design, coding, and testing against real files. For the release pack, the administrator estimated 60 hours of development, 20 of testing and 10 of documentation and training: **90 hours**.

**Running.** The time people still spend using the tool: starting it, reviewing its output, fixing what it reports. The release pack would need about half a minute of a person's time per drawing to start it and glance at its report, **0.33 hours a week**, plus machine time that runs unattended.

**Maintaining.** Each CAD upgrade, change to the office's standards or change to the release folder's structure needs the tool to be checked and sometimes changed. The administrator allowed **15 hours a year**, based on the office's experience with its other tools.

This is an illustration. At the office's internal rate of A$95 an hour, excluding GST, building costs 90 × 95 = **A$8,550** and maintenance **A$1,425** a year.

## The running case: the release pack's payback

The tool would cut people's time from 5.33 to 0.33 hours a week, saving 5.0 hours a week, or 230 hours over 46 weeks. If it also prevented four in five of the release faults, it would save another 0.8 × 41.4 = 33 hours. The total, about **263 hours a year**, is worth about **A$25,000** at A$95 an hour.

Net of maintenance, the annual saving is about A$25,000 − A$1,425 = A$23,600. The A$8,550 build therefore pays back in about 8,550 ÷ (23,600 ÷ 12) = **4.4 months**.

```figure
type: formula
title: Payback of the release pack
formula: payback (months) = build cost ÷ ((annual saving − annual maintenance) ÷ 12)
caption: This is an illustration at an internal rate of A$95 an hour, excluding GST. The saving counts people's time only; machine time running unattended is not charged.
- build cost | 90 hours, A$8,550
- annual saving | 230 hours of release time plus 33 hours of faults avoided, about A$25,000
- annual maintenance | 15 hours, A$1,425
step: Net annual saving ≈ A$25,000 − A$1,425 = A$23,600
step: Payback ≈ 8,550 ÷ (23,600 ÷ 12) = 4.4 months
```

## How sure is the payback?

A payback estimate rests on three numbers that can each be wrong: how often the task happens, how long the tool takes to build, and how much time it really saves. A quick sensitivity check shows whether the decision survives the likely errors.

This is an illustration. Keeping every other input the same, the release pack's payback moves as follows:

```figure
type: bars
title: Payback of the release pack under different assumptions
unit: months
max: 10
caption: This is an illustration. Each bar changes one input from the base case of 40 drawings a week and a 90-hour build.
- 20 drawings a week | 9.3
- *Base case, 40 a week, 90-hour build | 4.4
- 60 drawings a week | 2.8
- Build overruns by half, 135 hours | 6.5
- Build takes twice as long, 180 hours | 8.7
```

Even with half the drawings or twice the build time, the tool pays back in under ten months. The decision is robust. A candidate whose payback swings from six months to six years across plausible inputs is a candidate to study more closely, or to pilot cheaply first.

## Run the study properly

A time study that is too small or too polite gives a flattering answer. Three habits make it honest.

**Watch enough instances.** Ten releases by each of two drafters is the minimum for a task like this; the spread between drafters is often as large as the average, and one drafter's shortcut can hide a step another always does.

**Count the exceptions.** The study above averaged sheet metal DXFs over all drawings. The administrator also recorded that about one drawing in five needed a correction before release, which took four or five minutes more. Those exceptions are where errors live, and a tool that handles the routine case but not the exception saves less than the average suggests.

**Measure the people, not the clock.** A tool that runs for twenty minutes unattended saves nearly all of those minutes; one that needs a person to click through each file saves very little. The study should record which steps need attention and which only need waiting.

## Buy, adapt or build

Before writing code, the office checks whether the task is already solved. CAD vendors and resellers sell add-ins for common tasks such as batch export, property editing and drawing creation; product data management systems often include release workflows that do part of the release pack's job; and some CAD programs have built-in task schedulers that run batch jobs without code.

This is an illustration. A commercial batch export add-in quoted to the office cost about A$450 a seat a year, excluding GST, or A$4,050 a year for nine seats. It would export PDF, DXF and STEP, but it could not check properties against the register or write the register entry, which were half the value of the release pack. The office chose to build, but the comparison was worth making: had the add-in covered the whole task, its A$4,050 a year with the vendor maintaining it through upgrades would have beaten a tool the office had to maintain itself.

## The error: a tool that never paid

This is an illustration. Two years earlier, a drafter had written a tool that assigned the next part number from the register and wrote it into a new part's properties. It took about 40 hours to write and test. It saved about half a minute a file, and the office created about five new part numbers a week.

The saving was 0.5 × 5 × 46 = about **1.9 hours a year**. At that rate, the 40 hours of building would take about **21 years** to pay back, before counting maintenance. The tool broke at the next upgrade, because a function it used had been replaced, and nobody fixed it. The time study the office now does first would have shown in ten minutes that the task was too rare to automate, however tedious it felt.

The lesson is not that small tools are bad. A small tool that takes an hour to write and saves half an hour a week pays back in a fortnight. The lesson is that the build cost must be proportionate to the hours the task really takes, and that the hours must be measured, not felt.

## Benefits that are not time

Some benefits of automation are hard to price and still real.

- **Consistency.** A tool names files, fills properties and exports formats the same way every time. Downstream, suppliers and the vault stop meeting surprises.
- **Knowledge capture.** The release pack encodes the office's release procedure. A new drafter who runs it follows the procedure without having to remember it.
- **Auditability.** A tool can log what it did, to which file, at what revision, which a person rarely records.

These can tip a marginal case, and they are good reasons to automate a task whose errors are costly even when its time is modest. They are not reasons to skip the time study.

## Risks that are not cost

Automation also brings risks that a time study does not show. A tool can do the wrong thing very quickly and to many files. It can hide a process that nobody understands any more, so that when it fails, nobody can do the task by hand. And it can lock the office into a CAD version, because upgrading means rewriting the tool. Each risk has a remedy covered later in the book: dry runs and logs, written procedures kept alongside the tool, and a maintenance plan with an owner. Each remedy has a cost that belongs in the estimate.

## Who owns the tool

Every tool needs an owner: a named person who knows how it works, keeps its code and test files, decides on changes, and fixes it after an upgrade. The owner need not be the author, but must be able to read and change the code. A tool without an owner is a tool that will one day fail at the worst moment, with nobody able to say why.

The release pack's owner is the CAD administrator, with one of the engineers as a trained second, so that a holiday or a resignation does not leave it orphaned. The office's register of tools lists each tool, its owner and second, its purpose, the CAD versions it has been tested on and the date of its last test. The register has four entries; it had none before the release pack was proposed, and two of the office's older macros turned out to have no surviving author at all.

Ownership also has a cost that belongs in the payback. The release pack's 15 hours a year of maintenance assumes the owner knows the code; an owner learning it from scratch after the author has gone could spend three times that on the first upgrade. Documenting the tool, in the code and in a short written note of what it does and why, is part of the build cost for that reason.

## Exercise: automatic drawing creation

The office also considers a tool that creates a new drawing from a model: it picks the right template, inserts standard views and fills the title block. By hand, setting up a new drawing to that point takes about 25 minutes; with the tool, the drafter would spend about 8 minutes checking and adjusting the views. The office creates about 12 new drawings a week. The administrator estimates 120 hours to build the tool and 25 hours a year to maintain it, because drawing templates change more often than the release process. Does it pay, and how fast?

**Worked answer.** The tool saves 25 − 8 = 17 minutes a drawing, so 17 × 12 × 46 ÷ 60 = **156 hours a year**, worth about 156 × A$95 = **A$14,860**.

Maintenance costs 25 × A$95 = A$2,375 a year, so the net saving is about **A$12,480** a year. Building costs 120 × A$95 = **A$11,400**. The payback is 11,400 ÷ (12,480 ÷ 12) = about **11 months**.

It pays, more slowly than the release pack and with a higher maintenance burden. The office should build the release pack first, because it pays back faster and its process is more stable, and revisit the drawing tool once the templates have settled, which would also cut its maintenance estimate.
