---
book: engineering-tools-people-use
chapterSlug: measure-use-and-keep-improving
order: 8
title: "Measure use and keep improving"
description: "Measure whether a redesigned engineering tool is used and used correctly, choose measures that cannot be gamed, collect usage data openly, and run a steady cycle of small improvements."
draft: false
---

A redesigned tool is a hypothesis: that the changes will make people use it more, use it correctly and make fewer mistakes in the work it supports. Like any hypothesis, it needs testing after release, not just before. And like any tool, it will need further changes as the work, the CAD system and the people change. The office in this book had started from a gearbox returned by a customer. The question twelve months after release was whether the problem that caused it had gone, and what to improve next.

This chapter measures the redesigned stack-up tool a year after release. It repeats Chapter 1's baseline, chooses measures that reflect correct use rather than mere activity, collects usage data openly and fairly, sets up a steady cycle of small improvements and retires the old tool. The failure case is a usage figure that rose impressively for the wrong reason.

## Repeat the baseline

Chapter 1 recorded a baseline: time to set up a stack, the share of saved stacks with tolerances that disagreed with their drawings, whether designers compared results with the requirement inside the tool, and how many understood the statistical method's assumptions. Twelve months after release, the office measured the same things the same way.

```figure
type: compare
title: The stack-up tool before the redesign and a year after
cols: Baseline, Chapter 1 | A year after release
caption: This is an illustration from the office's observation, file audits and records. Field problems are few in either period, so that line is reported, not over-interpreted.
- Time to set up a five-dimension stack | about 18 minutes | about 5 minutes from the model
- Saved stacks disagreeing with their drawings | about 8% | none in a sample of 20
- Results compared with the requirement in the tool | none of 6 observed | all, by design
- Designers able to state the statistical method's assumptions | 1 of 6 | 5 of 6 after the training session
- Critical gaps on released assemblies with a current stack | not known | over 9 in 10
- *Field problems traced to tolerance stacks | 1 in the previous year | none in 12 months
```

Every measure improved. The office was careful with the last line. One field problem in a year against none in the next is encouraging, but such events are too rare to prove anything on their own. The audit and observation measures, which counted errors directly, carried more weight.

## Measure correct use, not just use

Activity measures, such as how many times a tool is opened, are easy to collect and easy to misread. A tool opened often may be useful, or confusing enough that people open it repeatedly. The office chose measures tied to the outcome the tool exists for:

- **completed, reviewed stacks** per month: stacks with every input confirmed, a requirement entered and a signed review record;
- the share of **critical gaps on released assemblies** with a current stack;
- the share of stacks with **inputs imported** rather than typed;
- the **audit disagreement rate**: tolerances that disagree with their drawings in a sample of saved stacks;
- **confirmed warnings with no stated reason**, a sign of warnings clicked through.

Each is hard to improve without actually doing the work correctly, which is the property a measure needs. Together they take the design manager about an hour a month to collect, most of it the small file audit, and they fit on one page alongside the office's other engineering measures.

```figure
type: bars
title: Completed and reviewed stacks per month, first year after release
unit: stacks
max: 25
caption: This is an illustration from the vault's records. Before the redesign, the office could not count reviewed stacks at all, because review records did not exist.
- Months 1 to 3, average | 14
- Months 4 to 6, average | 18
- Months 7 to 9, average | 20
- *Months 10 to 12, average | 21
```

Completed, reviewed stacks rose from about 14 a month to about **21**, as the dependency re-checks from Chapter 5 brought older assemblies into the process at each revision. That pattern, steady growth as revised assemblies gain current stacks, is what the office expected if the tool was being used as intended.

## Collect usage data openly

The tool logs, on the office's own server, which features are used, how long each step takes, which warnings fire and whether they are confirmed, and any errors. It does not log anything about drawings beyond their identifiers. Before the logging was turned on, the design manager told all designers what was recorded, why, and that it would be used to improve the tool, not to judge individuals. The data is reported in aggregate, never by person.

That openness mattered. A designer who suspects that a tool is measuring them will work around it. One who knows the data is used to fix the warning that annoys everyone will report problems more readily. The office kept its promise. When the logs showed that one designer confirmed far more warnings than anyone else, the design manager looked at the warnings, not the designer. They turned out to come from a type of assembly only that designer worked on, which needed a different plausibility threshold.

## A steady cycle of small improvements

Improvements come from several sources: the observation and audit, the usage logs, the warning statistics, questions to the author, the review records and the problem log from Chapter 6. The office reviews them together once a quarter and chooses a small number to make in the next release, by a simple comparison of value and effort.

```figure
type: stats
title: The first year's improvement cycle
caption: This is an illustration. Most changes were small; the largest, investigation variants with measured values, came from a field problem investigation in another product line.
- 4 | Releases after the redesign | one a quarter
- 23 | Improvements made | from 41 suggestions logged
- 3 | Warnings retuned or removed | from warning statistics
- *1 | Larger feature added | investigation variants with measured values
```

About half the suggestions were made. The rest were declined with a reason recorded, deferred, or combined with others. Declining is part of the cycle. A tool that adds every suggestion becomes as hard to use as the one it replaced.

## Retire the old tool

The old tool stayed available for three months after the new one's release, for reopening old stacks not yet converted. It was then removed from every workstation, with its files archived. Running two tools side by side for longer invites people to use the familiar one, with its old conventions, which was the source of the original problem. The three-month overlap was announced at release with its end date, repeated a month before removal, and nobody asked for an extension. Two designers who had kept using the old tool out of habit said afterwards that the deadline was what finally made them switch, and that they had not missed it since. The converter from Chapter 2 remained available for anyone reopening an old stack file.

## A failure case: the number that grew for the wrong reason

This is an illustration. In the first month after release, the design manager reported that the number of stacks created had more than doubled compared with the old tool. Management took it as a sign of success. The usage logs, examined more closely, showed something else.

Many of the new stacks were incomplete: created, given one or two dimensions, saved as provisional and never finished. The new tool made it easy to start a stack from the model, so designers started them as quick checks and abandoned them, or started a new one instead of reopening the old. The count of stacks created measured how easy it was to start one, not how much tolerance analysis was being done.

The detection came from looking beneath a headline number before celebrating it. The correction was to report completed, reviewed stacks instead, as above, and to change the tool so that a provisional stack left untouched for 30 days prompts its creator to finish it, archive it or delete it. Stacks created stayed in the logs as a measure of how the tool was used, but stopped being reported as a measure of success. The broader lesson recorded was that any measure which can rise without the real work improving will, sooner or later, do exactly that.

## What the redesign cost and returned

This is an illustration. The redesign took about **335** hours: about 20 for the observation and audit, about 200 of the author's design and programming, and about 115 for the three test rounds and their fixes, 15 designer-hours, 40 observer-hours and 60 author-hours. At A$110 an hour, that is about **A$36,850**, excluding GST.

The time saved is modest by comparison. At about 13 minutes saved per stack and about 21 reviewed stacks a month, it comes to about **55 hours** a year, about A$5,200 at A$95 an hour. On time alone, the redesign would take seven years to pay back.

Time was never the point. The redesign was justified by the errors it prevents. The gearbox return in Chapter 1 cost the firm the rework of three gearboxes in the field, a batch of housings, engineering time on the investigation and some of a customer's goodwill. The housing revision in Chapter 5 cost twelve reworked housings. Either incident cost a substantial share of the redesign's price, and the audit had shown that silent tolerance errors were present in about one stack in twelve. The office made the case on prevented errors, presented honestly as an estimate, with the time saving as a secondary benefit. It is the same argument the companion book on CAD automation makes about counting benefits that are not time.

## Apply the method to other tools

The office had a dozen in-house tools. Having redesigned one, it applied the same method to the next most important, a bolt preload and joint calculator, in a lighter form: one observation session with three designers, an audit of ten saved calculations, a review against the style guide from Chapter 7, and two test rounds of four. It found a units problem in the bolt calculator, torque entered in newton-metres in one field and read as newton-millimetres in a sub-calculation, which had no effect in practice only because the sub-calculation's result was not used. That review took about a tenth of the effort of the stack-up redesign, because the style guide, glossary and message pattern already existed.

## When to rebuild rather than improve

Some tools are not worth improving. The office's rule of thumb is to rebuild when the observation and audit find problems in the tool's basic model, such as a field whose meaning is ambiguous throughout or a calculation structure that cannot represent common cases, rather than in its presentation. The stack-up tool was rebuilt because its basic input model, the total-band field, was the problem. The bolt calculator was improved in place because its model was sound and only its screens and messages needed work.

## Write down what was learned

At the end of the year, the design manager and the author wrote a two-page summary of what the redesign had taught them, for whoever builds the office's next tool. It listed the findings that had surprised them most:

- the most serious errors came from inputs, not calculations, and from conventions the author thought were obvious;
- users' workarounds pointed directly at missing features;
- showing the interpreted value of every input caught more errors than any warning;
- realistic test tasks found problems that demonstration files hid;
- a single number on a dashboard can rise for the wrong reason;
- the biggest gain in use came from fitting the tool into the design process, not from making the screens nicer.

The summary sits with the style guide and glossary. New tool authors in the office read all three before writing a line of code, and the summary is updated whenever a later project teaches something new. It is the cheapest way to make sure the next tool starts where this one finished, rather than where the old stack-up tool started five years earlier.

## Keep the people in view

The measures describe the tool. The people using it are the reason it exists. The office continued the short observation sessions from Chapter 1 with new designers, ran the five-person test rounds from Chapter 6 for every substantial change, and kept the author's door open for questions, while counting them. Measures showed where to look. Watching people showed what to do, and talking with them showed why.

## How this applies to a small Australian business

Small offices rarely measure their internal tools at all. A handful of measures that reflect correct use, repeated once a year against a baseline, is enough to know whether a tool is doing its job. Tell people what you log and why, and report it only in aggregate. Review suggestions quarterly, make a few, decline the rest with reasons, and retire old versions promptly. Australian engineering firms often depend on small in-house tools for years without anyone checking whether they are used correctly. The cost of checking is a few days a year. The cost of not checking can be a returned gearbox.

## Exercise: choosing a measure

The office wants a single monthly measure to show whether the stack-up tool is helping prevent tolerance problems. Three candidates are proposed: the number of stacks created, the number of plausibility warnings shown, and the share of revised drawings whose dependent stacks were re-checked and passed before release. Which would you choose, and why are the other two weaker?

**Worked answer.** Choose the **share of revised drawings whose dependent stacks were re-checked and passed before release**. It measures the outcome the tool exists for, preventing releases with failing stacks, and it cannot rise without the checks actually happening. **Stacks created** can rise without any useful analysis, as the failure case showed. **Warnings shown** is ambiguous. More warnings could mean more errors being caught, or worse inputs, or badly tuned thresholds. Fewer could mean better inputs or ignored checks. It is useful for tuning warnings, but not as a measure of success.
