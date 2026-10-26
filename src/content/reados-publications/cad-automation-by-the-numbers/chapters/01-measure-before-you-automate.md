---
book: cad-automation-by-the-numbers
chapterSlug: measure-before-you-automate
order: 1
title: "Measure before you automate"
description: "Find the repetitive design work worth automating by logging it, timing each step, calculating savings and payback honestly, and counting the hidden costs that sink many tools."
draft: false
---

Most CAD automation projects start with enthusiasm rather than measurement. Someone who enjoys programming notices a tedious task, writes a macro over a weekend and is surprised when nobody else uses it. Or a manager sees a configurator at a trade show and commissions one for a product the office designs twice a year. The tools that pay are the ones aimed at work that is frequent, repetitive and rule-based, and the only reliable way to find that work is to measure it.

This chapter measures the design office in the running case before anyone writes a line of code. It logs the work for four weeks, times each step of the most repeated task, calculates the saving and payback for two levels of automation, and counts the costs that do not appear in a demonstration. It ends with an earlier tool that the office built, which never paid back, and the measurement that would have stopped it.

## Log the work before choosing the target

Engineers usually know which tasks feel tedious, but feeling and frequency are different things. A task that is painful once a quarter feels larger than a mildly boring task done every day. A short work log removes that bias.

This is an illustration. For four weeks, each of the four people in the trestle fabricator's design office recorded every task longer than 15 minutes: what it was, which product family, how long it took and whether it followed a pattern they had done before. The log took each person about five minutes a day. At the end, the office had about 520 entries, which they grouped into task types.

Three groups stood out:

- **Trestle variants**: model, drawing set and cut list for a trestle size not drawn before, about **36 a month**, all following the same rules.
- **Customer general-arrangement drawings**: different for every job, about **14 a month**, largely judgement rather than rules.
- **Revision updates** to existing drawings after customer comments, about **50 a month**, short but frequent, each one different.

Only the first group combines high frequency with a stable set of rules. The general-arrangement drawings need judgement that would be very hard to encode. The revision updates are frequent but each is different, so there is little to automate beyond better templates.

```figure
type: matrix
title: Where the office's repeated work sits
x: How often it happens: rare → frequent
y: How rule-based it is: judgement → rules
hot: 2
caption: This is an illustration from the four-week log. Automation pays best in the top-right quadrant: frequent work that follows rules.
- Rule-based but rare | special adaptors; a template may be enough
- Frequent and rule-based | trestle variants; the automation target
- Judgement and rare | one-off machine layouts; leave to people
- Judgement and frequent | revision updates; improve templates and checklists
```

## Time every step of the target task

Once the target is chosen, break it into steps and time each one. The breakdown shows which steps automation can remove, which it can shorten and which will stay with a person whatever happens.

This is an illustration. The office timed ten recent trestle variants and averaged them:

- copy a similar model and rename its files, **0.2 h**;
- edit the dimensions, hole patterns and bracing, **0.5 h**;
- rebuild and check the model for errors, **0.3 h**;
- update the drawing set's views, dimensions and notes, **0.6 h**;
- type the cut list into the purchasing spreadsheet, **0.4 h**;
- independent check of the drawings by a second person, **0.4 h**.

The total is **2.4 hours** per variant.

```figure
type: stack
title: Where 2.4 hours go on one trestle variant, by hand
unit: hours
caption: This is an illustration from ten timed variants. The independent check stays with a person in every automated option; most of the rest is mechanical.
- Update the drawing set | 0.6
- Edit dimensions, holes and bracing | 0.5
- Type the cut list | 0.4
- Independent check | 0.4
- Rebuild and check the model | 0.3
- Copy and rename files | 0.2
```

A full configurator, which builds the model, drawings and cut list from a few inputs, would leave the designer to enter the inputs (about 0.05 h), review the generated model (0.1 h) and drawings (0.1 h), and still have the independent check, now shorter because the drawings follow a fixed pattern (0.1 h). That is about **0.35 hours** per variant.

## Calculate the saving and the payback

The saving per year is the time saved per item, multiplied by the items per year and by the cost of the time. The cost of the time should be the full internal cost of an hour of the people doing the work, not their wage alone.

```figure
type: formula
title: Saving and payback for the trestle configurator
formula: annual saving = items per year × hours saved per item × cost per hour        payback = build cost ÷ (annual saving − annual upkeep) × 12
caption: This is an illustration. The internal cost rate, build estimate and upkeep allowance are the office's own figures, excluding GST.
- Items | 36 a month, 432 a year
- Hours saved per item | 2.4 − 0.35 = 2.05 h
- Cost of design time | A$95 an hour
- Build | 320 h at A$110 an hour = A$35,200
- Upkeep | 15% of the build cost a year = A$5,280
step: annual saving = 432 × 2.05 × 95 ≈ A$84,132
step: net annual saving = 84,132 − 5,280 ≈ A$78,852
step: payback ≈ 35,200 ÷ 78,852 × 12 ≈ 5.4 months
```

The A$95 needs explaining, because it is the input most often understated. This is an illustration. A designer paid A$95,000 a year costs the business about **95,000 × 1.12 ≈ A$106,400** once the 12% superannuation guarantee is added, before leave loading, workers' compensation, payroll tax where it applies and the like. Out of about 1,600 productive hours a year, after leave, training and meetings, that is about **A$66.50** an hour. Workstations, CAD licences, office space and supervision add, in this office's estimate, about A$28.50 an hour, giving A$95. Using the wage alone, about A$46 an hour on a 2,080-hour year, would halve the apparent saving and could reject a good project.

A payback of about five and a half months is attractive, but the number is only as good as its inputs. Three of them deserve scrutiny.

**The volume.** 36 variants a month was the average over four weeks. If the next year is quieter, the saving falls in proportion. The office checked its order book for the previous two years, which showed a similar average with seasonal swings.

**The hours saved.** The 0.35 hours for the automated process is an estimate, not a measurement, because the tool does not yet exist. Chapter 10 measures it once the tool is running.

**The upkeep.** Automation needs maintaining. CAD upgrades, rule changes and new product options all need work. The 15% a year allowance is the office's assumption, and Chapter 10 shows what it actually cost.

## Compare levels, not just yes or no

Automation is not one decision. Chapter 2 sets out the levels in detail, from better templates to a full configurator. At this stage, the office compared two:

- **A recorded and edited macro** that opens a master model, applies the dimensions from a small input form and updates the drawing, leaving the cut list and the file housekeeping by hand. Estimated build about **60 hours**, about **A$6,600**. It would bring the time per variant to about **1.1 hours**, saving 1.3 hours.
- **The full configurator** described above, saving 2.05 hours per variant for A$35,200.

For the macro, the annual saving is **432 × 1.3 × 95 ≈ A$53,352**, and the payback is about **6,600 ÷ 53,352 × 12 ≈ 1.5 months** before upkeep. The configurator saves about **A$30,780** a year more, for about **A$28,600** more in build cost and more upkeep.

Both are good investments on these numbers. The macro pays back fastest and teaches the office what the configurator would need. The office decided to build the macro first, measure it for three months and then decide on the configurator with real data. That staged decision is often wiser than either extreme. The rest of this book follows the configurator, because the office's measured results from the macro justified it.

## Count the benefits that are not time

Time saved is the easiest benefit to count, but not always the largest. The log and the checking records showed that about **4%** of hand-made trestle variants needed rework after the independent check or, worse, after fabrication: a hole pattern copied from the wrong belt width, a brace omitted, a cut length typed wrongly. Each rework cost about **6 hours** across design and the workshop.

At 432 variants a year, that is about **432 × 0.04 × 6 ≈ 104** hours a year, about **A$9,850**. A configurator that applies the rules the same way every time removes most of that class of error, though it adds a new risk: a wrong rule repeated perfectly in every variant. Chapter 3 deals with that.

Other benefits are real but harder to price: faster quotations because the cut list is available in minutes, consistent drawings that the workshop reads more easily, and designers freed for the general-arrangement work that needs judgement. The office recorded them in the business case without putting numbers on them.

## Count the costs that do not appear in a demonstration

A tool's demonstration shows it working. It does not show the costs of owning it:

- **Maintenance through CAD upgrades.** Programming interfaces change between releases, and a tool tested on one release must be retested on the next.
- **Rule changes.** When the product changes, the rules in the tool must change too, by someone who understands both.
- **Support and training.** New staff must learn the tool, and someone must answer questions when it behaves unexpectedly.
- **Dependence on one person.** A tool written and understood by one person is a risk the day that person leaves. Chapter 10 addresses this directly.
- **The cost of being wrong.** A tool that silently produces a wrong design is worse than a slow manual process, because it is trusted.

The 15% upkeep allowance is meant to cover the first three. The last two are managed by the methods in the rest of this book rather than by budget.

## A failure case: the tool nobody used

This is an illustration. Three years before, one of the office's designers had written a tool to generate quotation drawings for a special adaptor plate. It took about **120 hours** of evenings and some paid time, and it worked well in its demonstration.

The four-week log showed the adaptor plate being drawn **once**, and the order history showed about **three** a year. Each manual drawing took about 2 hours. The tool reduced that to about 0.5 hours, a saving of 1.5 hours, or about **4.5 hours a year**. At A$95 an hour that is about **A$428** a year against a build cost of about **A$13,200**. The payback was about **31 years**, before any upkeep. In practice, the tool had already stopped working after a CAD upgrade, and nobody had noticed because nobody used it.

The failure was not in the programming. It was in choosing the target from what felt tedious rather than what the log said was frequent. The correction, for every later proposal, was a simple rule: no automation is built without a measured frequency, a timed breakdown and a payback calculation like the one above, reviewed by someone other than the person proposing it.

## Keep the measurement for later

The four-week log and the timed breakdown are not just inputs to the decision. They are the baseline against which the tool will be judged. Chapter 10 repeats the timing after the configurator has been in use for six months and compares the result with the 0.35 hours estimated here. Without a baseline, a team cannot tell whether a tool delivered what it promised, and cannot learn to estimate better next time.

The general case for when CAD automation pays, and the levels available, is introduced in [Automating CAD with macros and APIs](/reados/collections/cad-modelling-and-design-intent/automating-cad-with-macros-and-apis/). This book takes that decision through to a working, supported tool.

## How this applies to a small Australian business

Small design offices often have the strongest case for automation, because a few people carry a large volume of repeated work, and the weakest capacity to maintain it. Measure first, start with the simplest level that captures most of the saving, and treat the upkeep as a real cost. Australian fabricators often quote and design in the same small team, so a tool that produces a reliable cut list in minutes can also shorten quotation times. That benefit may matter more to winning work than the design hours themselves. Finally, keep the log simple enough that people actually fill it in. A shared spreadsheet with five columns, reviewed for five minutes at the end of each week, is enough. An elaborate time-tracking system that people resent will produce worse data than a short honest log, and the decision it supports is worth tens of thousands of dollars.

## Exercise: a second candidate

The office also draws about **8** custom guard panels a month, each taking about **3.0** hours by hand. A configurator for them is estimated at **200** hours to build at A$110 an hour, would reduce the time to about **0.8** hours each, and would need upkeep of 15% of the build cost a year. Using A$95 an hour, calculate the annual saving, the net saving and the payback in months. Would you build it before or after the trestle configurator?

**Worked answer.** Items a year: **8 × 12 = 96**. Hours saved per item: **3.0 − 0.8 = 2.2**. Annual saving: **96 × 2.2 × 95 ≈ A$20,064**. Build cost: **200 × 110 = A$22,000**, and upkeep **0.15 × 22,000 = A$3,300** a year. Net annual saving: **20,064 − 3,300 ≈ A$16,764**. Payback: **22,000 ÷ 16,764 × 12 ≈ 15.7 months**. It pays back, but about three times more slowly than the trestle configurator. Build it after the trestle tool, and reuse what the office learns about rules, master models and testing.
