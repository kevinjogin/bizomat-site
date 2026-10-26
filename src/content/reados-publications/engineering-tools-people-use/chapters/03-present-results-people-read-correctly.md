---
book: engineering-tools-people-use
chapterSlug: present-results-people-read-correctly
order: 3
title: "Present results people read correctly"
description: "Show an engineering result against its requirement with the margin, put the cautious answer first, state assumptions, show which inputs matter most and round without hiding a failure."
draft: false
---

An engineering tool exists to support a decision. A stack-up exists to answer one question: will the parts fit, every time, under the conditions we care about? The old tool showed three numbers, the nominal gap and two sets of limits, to several decimal places, and left the user to work out the answer. Four of the six observed designers did that in a spreadsheet, each a little differently, and one picked the narrower statistical limits because they looked better. A result that has to be interpreted will be interpreted in more than one way.

This chapter redesigns the stack-up tool's results. It puts the requirement beside the result and states the answer and the margin. It shows the cautious worst-case answer first, with the statistical answer and its assumptions beneath. It shows which inputs drive the result, draws the result as a picture against the requirement, rounds without hiding a failure and produces a record for design review. The failure case is a result rounded to two decimals that turned a small fail into an apparent pass.

## Lead with the answer

The new result screen starts with the decision, in words: "Worst-case minimum gap 0.21 mm. Requirement at least 0.25 mm. Fails by 0.04 mm." Only then does it show the supporting numbers. A designer, a checker or a manager reading the screen sees the answer before the arithmetic.

To do that, the tool needs the requirement, which the old tool never asked for. The new tool asks for the requirement as part of setting up the stack: a minimum gap, a maximum gap, or both, with a short note of where it comes from, such as "clearance to avoid rub, from the gear supplier's guidance" or "interference for press fit". Asking for the requirement turned out to be valuable in itself. In testing, two designers set up a stack and then realised they did not know what gap they needed, which is better discovered at the design stage than at assembly.

## Show the margin, not just pass or fail

Pass or fail alone hides how close a design is. A stack that passes by 0.002 mm and one that passes by 0.2 mm deserve very different confidence. The tool states the margin in millimetres and as a share of the total tolerance effect: "Passes by 0.06 mm, about 21% of the worst-case tolerance effect of 0.29 mm." A thin margin prompts a second look at the inputs. A large one suggests the tolerances could be relaxed to save cost, a saving the old tool never prompted anyone to look for.

## Worst case first, statistics with their assumptions

Two common ways to combine tolerances give different answers. The **worst-case** method adds the half-bands, assuming every dimension could be at its limit at once. The **root-sum-square** (RSS) method combines them statistically, giving a narrower spread, on the assumption that each dimension varies independently, centred on its mean, with a roughly normal distribution. For the gear hub stack, the worst case is **0.21 to 0.79 mm** and the RSS result is **0.35 to 0.65 mm**.

```figure
type: range
title: The gear hub stack's results against its requirement
unit: mm of gap
min: 0
max: 1
caption: This is an illustration. The worst-case range dips below the 0.25 mm requirement; the statistical range does not. The tool shows both, with the worst case first and the assumptions of the statistical method stated beside it.
- Requirement, at least 0.25 mm | 0.25 | 1.00
- Worst case | 0.21 | 0.79
- Root-sum-square, if its assumptions hold | 0.35 | 0.65
```

The statistical answer is not wrong. For assemblies built in large numbers from parts made by stable, centred processes, it is a realistic estimate of the spread. But its assumptions often do not hold for the machine builder's small batches, where a dimension may be consistently near one limit because of how a particular machinist works.

The new screen shows the worst case first and in full, and the statistical result beneath it with a one-line statement of its assumptions. A designer who wants to rely on the statistical result records a reason, such as "high-volume bought-in bearings from a controlled process", which appears in the design-review record. The tool does not forbid the statistical method. It makes the choice visible and deliberate.

## Show which inputs matter

When a stack fails, or passes with a thin margin, the designer's next question is which tolerance to change. The tool answers it with a contribution chart.

```figure
type: bars
title: Each dimension's share of the gear hub stack's variation
unit: % of the worst-case tolerance effect
max: 40
caption: This is an illustration. In the statistical method, the shares are of the variance, which weights large tolerances more heavily: the housing depth is about 44% of the variance and about 34% of the worst-case effect.
- *A housing depth, ± 0.10 | 34.5
- D gear hub, ± 0.08 | 27.6
- B bearing, ± 0.06 | 20.7
- C spacer, ± 0.05 | 17.2
```

The housing depth contributes about a third of the worst-case effect, the largest share. Tightening it from ±0.10 to ±0.05 would reduce the worst-case effect from 0.29 to 0.24 mm, raising the minimum gap to about **0.26 mm**, just inside the 0.25 mm requirement. The chart turns "the stack fails" into "tighten the housing depth, or change the nominal gap", which is the decision the designer has to make.

## Compare alternatives side by side

A failing stack usually has several possible fixes, each with a cost: tighten a tolerance and pay more for machining, choose a more precise bought part, or change a nominal dimension and redo a drawing. In the old tool, a designer compared options by changing values, noting the result, changing them back and trying another, often losing track of which combination gave which answer.

The new tool lets a designer save variants of a stack and shows them side by side: the original, "housing ±0.05", "spacer 7.95 mm" and so on, each with its minimum and maximum gap, margin and pass or fail. The designer adds a short note of the cost implication beside each, such as "housing bore depth tolerance needs a finishing pass", so the review record shows not just the chosen fix but the alternatives considered and why they were rejected.

That turned the stack-up from a check into a design tool. In the six months after the change, the office's designers used variants on about a third of stacks, and the review records showed that roughly half of failing stacks were fixed by moving a nominal rather than tightening a tolerance, the cheaper route that the old tool's single-answer display had made easy to overlook.

## Round for reading, decide on the exact values

Results are shown to a sensible number of decimals: for millimetre stacks, three decimals for the results and two for the inputs as drawn. The pass or fail decision is made on the unrounded values, never on the displayed ones. The failure case below shows why. Showing more decimals than the inputs justify is the opposite mistake: a result of 0.21437 mm suggests a precision that tolerances given to two decimals cannot support, and invites people to argue about the last digits instead of the design.

## Draw the result

Beneath the numbers, the tool draws a horizontal line representing possible gap values, with the requirement shaded and the worst-case and statistical ranges drawn as bars against it. The range figure above is a version of it. Designers, and especially the newer ones, said the picture let them see at once whether a failure was marginal or gross, and whether the problem was at the small-gap end or the large-gap end, which numbers alone did not convey as quickly.

## Conditions the stack does not include

A linear stack at room temperature is a model, and the result screen should say what it leaves out. The most common omission in the office's gearbox work was temperature. This is an illustration. The gear hub stack has an aluminium housing and steel bearing, spacer and hub. At an operating temperature 40 K above assembly temperature, the 45.50 mm housing depth grows by about **45.50 × 23 × 10⁻⁶ × 40 ≈ 0.042 mm**, using a typical expansion coefficient for aluminium, while the 45 mm of steel parts grow by about **45 × 11.5 × 10⁻⁶ × 40 ≈ 0.021 mm**. The gap opens by about **0.021 mm** when hot.

In this case, the hot gap is larger, so the cold, assembled condition governs. In other assemblies the effect runs the other way and can close a clearance. The new tool lets a designer state an operating temperature difference and a material for each dimension, and shows the hot result beside the cold one. Where a designer chooses not to, the result screen says "room temperature, thermal effects not included", so a reviewer can decide whether they matter.

## Results read by people who did not set up the stack

Managers, customers' engineers and assembly supervisors read stack results without knowing how they were set up. The summary at the top of the result screen and the review record is written for them: one sentence stating the answer, the margin and the method, such as "With all dimensions at their drawing limits, the gap is at least 0.21 mm, below the 0.25 mm needed to avoid rub." No symbols, no abbreviations, no reference to the tool's internals. The detail follows for those who need it. The office found that writing that sentence for every stack also forced designers to state the requirement and the method clearly to themselves, which several said improved their own understanding.

```figure
type: checklist
title: What the new result screen shows, in order
caption: This is an illustration of the office's result layout. Every item answers a question that observed designers had previously answered in their own spreadsheets.
- The answer in one sentence, with the requirement and the margin | for readers who need only the decision
- Worst-case range drawn against the requirement | the cautious view first
- Statistical range with its assumptions, and the method relied on with its reason | a deliberate choice, recorded
- Contribution of each dimension | which tolerance to change
- Conditions not included, such as temperature | so a reviewer can judge them
- Provisional inputs and confirmed warnings | so an unfinished stack is never mistaken for a finished one
- x Results rounded before the pass or fail decision | compare on exact values
```

## Produce a record for review

Every stack is reviewed by a second designer before the drawing is released. The tool produces a one-page record for the review: the sketch of the chain, every input with its source, imported or typed, the requirement and its source, the worst-case and statistical results, the margin, the contribution chart, any confirmed plausibility warnings, the method relied on and its reason, and the tool's version. The reviewer reads the record, not the tool's screen, and signs it. A signed record can be found again years later, when an assembly is revised or a field problem raises questions. The record is stored with the drawing in the vault.

The review record changed how reviews worked. Before, reviewers either repeated the calculation or trusted it. Now they check the inputs against the drawings, which is where Chapter 1 showed the errors were, and the reasoning, which is where judgement is needed.

## A failure case: 0.246 shown as 0.25

This is an illustration. The first version of the new result screen rounded the worst-case limits to two decimal places for display, and compared the displayed value with the requirement. A designer's bracket stack had a worst-case minimum of **0.246 mm** against a requirement of at least **0.25 mm**: a fail by 0.004 mm. The screen showed "0.25 mm, meets requirement".

The reviewer, checking the inputs against the drawing as the new process asked, recalculated the stack by hand because one input looked unusual, and got 0.246. The discrepancy was traced to the rounding. The detection came from a reviewer doing their job thoroughly, which is reassuring, but the tool should never have needed it.

The corrections were to compare unrounded values, to show three decimal places for results in millimetres, and to state a marginal result plainly: "Fails by 0.004 mm, within rounding of the requirement. Review the inputs and requirement." The designer chose to tighten one tolerance slightly rather than argue that 0.004 mm did not matter. That was a sound judgement, but one the designer could only make because the tool showed the real number.

## How this applies to a small Australian business

Small offices often share calculation spreadsheets that end in a column of numbers and leave the reader to draw the conclusion. Add the requirement, the answer in words and the margin, and the most common misreadings disappear. Lead with the cautious method and make any less cautious choice visible and justified. Many Australian manufacturers build in small batches, where the statistical assumptions behind narrower tolerance methods are weakest, so the worst-case view deserves first place. The underlying tolerance principles are covered in [Fits That Work](/reados/publications/fits-that-work/).

## Exercise: which tolerance to tighten

For the gear hub stack, the designer considers tightening either the gear hub D from ±0.08 to ±0.05, or the bearing B from ±0.06 to ±0.03 by choosing a higher-precision bearing. Calculate the worst-case minimum gap for each option against the 0.25 mm requirement. Which, if either, makes the stack pass?

**Worked answer.** The current worst-case effect is **0.29 mm**. Tightening D by 0.03 gives **0.26 mm**, so the minimum gap is **0.50 − 0.26 = 0.24 mm**, still failing by 0.01. Tightening B by 0.03 gives the same **0.26 mm** and the same **0.24 mm** minimum, also failing. Neither change alone is enough. Tightening the housing depth A by 0.05, as the contribution chart suggested, gives **0.26 mm**, a pass by 0.01. Alternatively, increasing the nominal gap by 0.05 mm, for example by shortening the spacer to 7.95 mm, gives a minimum of **0.26 mm** with no tolerance changes, which may be cheaper. The contribution chart points to the most effective tolerance, but the designer should also consider moving the nominal.
