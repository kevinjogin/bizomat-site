---
title: "Fixing a recurring problem with DMAIC: define, measure, analyse, improve, control"
description: "Some problems keep coming back however many quick fixes are tried. How the DMAIC method moves from a clear problem statement to verified causes, tested fixes and a gain that lasts."
publishDate: 2026-10-09
category: "Operations"
tags:
  - process-improvement
  - manufacturing
  - validation
author: "KEVOS®"
featured: false
draft: false
---

Every business has problems that keep coming back. Rework on one product line that never quite goes away. Orders that keep shipping with the same kind of error. A machine that stops every few days and is restarted every time. Each occurrence gets a quick fix, the fix seems to work for a while, and then the problem returns. Over a year, the quick fixes cost far more than solving the problem properly would have.

Recurring problems usually survive because the response jumps straight from symptom to solution. Someone sees the problem, someone else has an idea, the idea is tried, and nobody checks whether it addressed the real cause. DMAIC is a structured way to break that cycle. Its five phases, Define, Measure, Analyse, Improve and Control, come from the Six Sigma tradition, but the logic does not require belts, statistics software or a large organisation. It requires discipline about evidence at each step.

This article explains each phase, the evidence needed before moving to the next, the most common ways the method goes wrong, and when it is the right tool. It is general information for owners, managers and teams dealing with chronic quality, cost or delivery problems.

## When to use DMAIC, and when not to

DMAIC suits **chronic problems**: ones that recur, have no obvious cause, cross more than one area, or cost enough to justify a few weeks of structured work. It is overkill for a simple, obvious local issue that can be safely tried and fixed in a day. For those, a quick improvement cycle is enough. The [zero defect manufacturing](/reados/collections/manufacturing-quality/zero-defect-manufacturing-in-a-small-factory/) article covers prevention and mistake-proofing more broadly.

## The five phases and their gates

| Phase | Purpose | Evidence needed before moving on |
|---|---|---|
| **Define** | Agree the problem, the customer need, the scope and the target | A clear problem statement, boundary, owner and agreed measure |
| **Measure** | Establish trustworthy baseline data | A defined measure, a checked measurement method and a baseline over normal conditions |
| **Analyse** | Find and verify the causes | Causes supported by data, observation or trials, not only brainstorming |
| **Improve** | Develop and test fixes that address verified causes | A trial showing meaningful improvement without unacceptable side effects |
| **Control** | Hold the gain | An owner, a standard method, a monitoring measure and a plan for what to do if it slips |

The gates are the heart of the method. Most failed improvement efforts skip one: they act without a baseline, fix a cause nobody verified, or declare victory without anyone owning the result afterwards.

## Define: describe the gap, not the solution

A useful problem statement describes the gap in measurable terms and does not contain the answer. "Nine per cent of controller boards fail final testing on product family A" can be investigated. "Operators need a new jig" is already a guess at the solution.

Define also covers:

- **The customer need**, translated into something measurable. A customer saying "it must be reliable" becomes a measurable characteristic, such as a failure rate or a test result. These are often called critical-to-quality characteristics.
- **The boundary**: where the process starts and ends, the main inputs and outputs, and the suppliers and customers involved.
- **Why it matters now**: the cost, delivery, safety or customer consequence, roughly quantified.
- **The target and time frame**, without assuming the cause.
- **Who owns the problem** and who will work on it.

## Measure: trust the data before using it

The Measure phase establishes a baseline the team can rely on:

- **Define the measure precisely**: what counts as a defect, what the denominator is, what is included or excluded, and when it is counted.
- **Check the measurement method.** Would two people record the same event the same way? Does the test or gauge give consistent results? A surprising number of "process" problems turn out to be measurement problems.
- **Collect long enough** to see normal behaviour, not one unusually good or bad shift.
- **Record useful detail**, such as product, machine, shift, operator, supplier and material batch, so the data can be split later.
- **Freeze the baseline**, recording the period and assumptions, so the before and after comparison is fair.

Simple tools work well here: a check sheet tallying defects by type at the point they are found, and a run chart plotting the measure over time. The [proving a process is ready for production](/reados/collections/product-development-and-launch/proving-a-process-is-ready-for-production/) article covers checking measurement systems and process stability in more depth.

## Analyse: find causes and prove them

Analysis moves from the data to the mechanism:

1. **Split the data** by defect type, machine, product, shift or batch.
2. **Prioritise** with a Pareto chart, which ranks categories by how much of the problem they cause. Usually a few categories dominate.
3. **List possible causes** broadly, for example using a fishbone diagram covering methods, machines, materials, people, measurement and environment, to avoid fixating on the first idea.
4. **Drill down** with repeated "why" questions where the chain of cause is credible.
5. **Verify.** Check each suspected cause against data, direct observation or a controlled trial.
6. **State the mechanism**: a real root cause explains why the problem happens and predicts when it will occur.

The crucial step is verification. A factor can move with the problem without causing it. If changing the suspected cause does not change the result, or the physical explanation does not make sense, the analysis is not finished. The [reviews that ask why](/reados/collections/records-business-data-and-learning/reviews-that-ask-why/) article covers why teams so often stop at categories instead of causes.

## Improve: prefer fixes that prevent

Not all fixes are equally strong. In rough order of preference:

| Fix | Example | Strength |
|---|---|---|
| **Eliminate the cause** | Remove an unnecessary step or adjustment | Strongest |
| **Prevent the error** | A keyed fixture, interlock or part that only fits one way | Strong |
| **Detect at the source** | A sensor or go/no-go check before more work is added | Moderate to strong |
| **Warn** | An alarm that relies on someone responding | Moderate |
| **Inspect later** | Final inspection or sorting | Weakest; it contains the problem rather than preventing it |

```figure
type: layers
title: From the strongest fix to the weakest
shape: pyramid
caption: Prefer fixes that prevent the defect over those that only find it.
- *Eliminate the cause
- Prevent the error
- Detect at the source
- Warn
- Inspect later
```

Then trial before full release:

- **Set success criteria** for quality, time, safety and cost.
- **Run the smallest representative trial**: a fixture, a setting change, a method change or a pilot batch.
- **Change one thing at a time** where possible, so you know what worked.
- **Measure before and after** using the same definitions.
- **Ask the people doing the work.** A technically correct fix that is awkward to use tends to fade.

## Control: make the gain last

Improvements decay when the project team moves on. A control package keeps the gain:

- **A documented standard**: the method, settings, checks and responsibilities.
- **A monitoring measure**: the simplest measure that gives early warning of a change.
- **A reaction plan**: who stops, contains, adjusts or investigates when the measure moves outside its limits.
- **A named owner** in the operation, not the project team.

Update the relevant drawings, work instructions, training and records, and schedule a check some weeks later. The project closes only when the owner is genuinely running the new standard.

A useful distinction: a process can be stable but not good enough, or look good in a short sample while being unstable. Monitoring shows whether the process is behaving consistently; capability shows whether it meets the requirement. You need both.

## Where DMAIC goes wrong

- **Starting with a solution** and using DMAIC to justify it.
- **Scoping too broadly**, such as "improve quality", so the team cannot measure or act.
- **Trusting bad data**, especially from unchecked tests or inconsistent recording.
- **Brainstorming causes and treating the list as proof.**
- **Fixing with inspection** instead of prevention.
- **Closing the project** without an owner and a reaction plan.
- **Over-engineering it**: a two-person, three-week DMAIC on a real chronic problem is often enough; it does not need certificates or software.

## A worked example

This is an illustration. A 25-person manufacturer assembles electronic controllers. On one product family, about 9% of boards fail final functional testing and are reworked, roughly 45 boards a week out of 500. Each rework costs about $30 in labour and parts, and the problem has persisted for a year despite several quick fixes.

**Define.** The problem statement: "About 9% of family A controller boards fail final functional test." The customer need is reliable controllers; the measure is first-time pass at final test. The target is under 3% within three months. The production supervisor owns the problem, working with a test technician and two assembly operators.

**Measure.** The team defines a failure precisely and checks the test rig by retesting 30 failed boards without touching them. Six pass on retest: the rig's contacts are worn and cause false failures. Fixing the rig first brings the true baseline to about 7%. A check sheet over four weeks records each failure by type and location on the board.

**Analyse.** A Pareto chart shows about 60% of failures come from poor solder joints on one connector. Splitting by time shows the failures cluster late in long production runs. Asking why repeatedly leads to the solder paste printing step: the stencil that deposits solder paste is meant to be cleaned every few hours, but on long runs the cleaning is skipped because there is no clear trigger. The team verifies this with a controlled trial, cleaning the stencil at fixed intervals for a week. Connector failures drop sharply, and rise again when the old practice resumes for a day.

**Improve.** The team prefers prevention over inspection. It sets the printer's automatic under-stencil cleaning to run after a fixed number of boards, removing the reliance on memory, and adds a quick visual check of solder paste on the connector pads before placement, detecting any remaining problem at the source. A two-week trial brings the failure rate to about 2.5%.

**Control.** The cleaning setting and the visual check go into the work instructions. A simple daily run chart of first-time pass rate is posted at the line, with a reaction plan: if the rate falls below 96% for two days, the supervisor checks the printer settings and stencil. The supervisor owns the chart.

The reduction from about 7% to 2.5% on 500 boards a week avoids around 22 reworked boards a week. At about $30 each, that is roughly $675 a week, or about $32,000 a year over 48 working weeks, from a project that took two people around four weeks part-time.

```figure
type: bars
title: Controller boards failing final test
unit: %
max: 10
caption: About 22 fewer reworked boards a week at about $30 each: roughly $32,000 a year.
- Reported, with a worn test rig | 9
- True baseline after fixing the rig | 7
- *After DMAIC | 2.5
```

## How this applies to a small Australian business

- **Use DMAIC for chronic problems**, not one-off fixes.
- **Write a problem statement** that describes the gap, not the solution.
- **Check the measurement** before trusting the baseline.
- **Split and rank the data** to find where most of the problem lies.
- **Verify causes** with data, observation or trials.
- **Prefer prevention** over inspection.
- **Trial fixes** before full release.
- **Hand over a control package** with a named owner.

## Signals worth watching

- The same problem fixed again and again.
- Fixes chosen before the cause is known.
- Defect data nobody trusts.
- Final inspection as the main quality control.
- Improvements that fade after a few months.
- Projects closed without a reaction plan.
- Test results that change when the same part is retested.

## Common mistakes

- **Skipping the baseline.**
- **Assuming a correlation is a cause.**
- **Changing several things at once** and not knowing which worked.
- **Relying on warnings and inspection** when prevention is possible.
- **Leaving the gain without an owner.**
- **Applying the full method** to simple problems.
- **Ignoring the people who do the work** when designing the fix.

## Frequently asked questions

**Do we need Six Sigma training to use DMAIC?** No. The logic is simple. Training helps with statistical tools for complex problems, but many chronic problems yield to careful data collection and verification.

**How long should a DMAIC project take?** For a focused problem in a small business, often a few weeks of part-time effort. Larger problems may take a few months.

**Does DMAIC work outside manufacturing?** Yes. The same steps apply to invoicing errors, delivery mistakes, long customer wait times or missed service calls.

**What if we cannot find a single root cause?** Some problems have several contributing causes. Address the largest verified ones first, and keep monitoring.

**What is the difference between DMAIC and kaizen?** DMAIC is a structured project for chronic, unclear problems. Kaizen-style improvement suits small, quick, local improvements. Most businesses benefit from both.

## Questions to ask

- What exactly is the gap, in measurable terms?
- Can we trust the data we are about to use?
- Where is most of the problem concentrated?
- How have we verified the cause?
- Does our fix prevent the problem or just catch it?
- Who owns the result, and what will they do if it slips?

## Bringing it together

Recurring problems survive quick fixes because nobody checks the cause. DMAIC moves through five phases with evidence at each gate: define the gap without assuming the answer, measure with data you can trust, analyse until the cause is verified, improve with fixes that prevent rather than inspect, and control the gain with a standard, a measure, a reaction plan and an owner. Used on the right problems and kept light, it turns a chronic cost into a solved one.

---

*Source: KEVOS® notes, drawing on earlier KEVOS® manufacturing handbooks on the DMAIC phases, voice of the customer and critical-to-quality characteristics, and structured root-cause problem solving. Examples and figures in this article are illustrations. This article is general information.*
