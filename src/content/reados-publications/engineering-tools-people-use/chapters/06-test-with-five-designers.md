---
book: engineering-tools-people-use
chapterSlug: test-with-five-designers
order: 6
title: "Test with five designers"
description: "Run small, repeated usability tests on an engineering tool: realistic tasks, five participants a round, problems rated by severity, fixes between rounds and a review against known principles first."
draft: false
---

Chapter 1's observation found problems with a tool already in use. Before releasing the redesigned tool, the office needed to find the problems the redesign had introduced, and the ones it had not fixed, before fourteen designers met them on real projects. The obvious approach, a big test with everyone, is slow and expensive, and most of what it finds the first few participants would have found anyway. A better approach is small tests, repeated: a handful of people, fix what they find, then another handful.

This chapter tests the redesigned stack-up tool in that way. It explains why five participants per round finds most problems, reviews the design against established principles before involving anyone, designs realistic tasks, runs three rounds of testing with fixes in between, rates problems by severity and decides when the tool is ready. The failure case is a first round whose invented tasks avoided exactly the kind of tolerance most likely to be entered wrongly.

## Why five

Jakob Nielsen's widely cited analysis, published by the Nielsen Norman Group in 2000, modelled the share of usability problems found by n test users as **1 − (1 − L)^n**, where L is the share a single user finds. Across the projects he studied, L averaged about **31%**. On that model, one user finds about 31% of the problems, two about 52%, three about 67%, and five about 84%, which the article rounds to about 85%. Beyond five, each extra user mostly finds problems already found.

```figure
type: line
title: Share of usability problems found as test users are added
x: Number of test users
y: Problems found, %
ymin: 0
ymax: 100
mark: 5 | About 85% in Nielsen's article
caption: Calculated from Nielsen's model with L = 31%. The model assumes users find problems independently and with similar likelihood; real tools and users vary, which is why the office tested in rounds rather than relying on the curve alone.
- 1 | 31
- 2 | 52
- 3 | 67
- 5 | 84
- 10 | 98
- 15 | 100
```

The practical conclusion is not that five people find everything. It is that fifteen people's testing time is better spent as three rounds of five, with fixes between rounds, than as one round of fifteen. The second and third rounds test the fixes and find the problems that the first round's problems were hiding: a user who gives up at step two never reaches the problem at step four.

## Review against principles first

Before involving any designer, the tool's author and the design manager reviewed the redesign against a short list of established usability principles, the ten heuristics Nielsen published and later updated, paraphrased for an engineering tool:

- the tool shows what it is doing and what it has understood;
- it uses the user's words and conventions, here the drawing's;
- the user can undo and back out easily;
- it is consistent with itself and with the CAD system it runs in;
- it prevents errors rather than just reporting them;
- it shows options rather than relying on the user's memory;
- it supports both new and experienced users;
- it shows only what is needed;
- its messages help the user recover;
- help is available where it is needed.

The review took two hours and found eight problems, mostly inconsistencies, such as two different words for the same button, and one serious one: undo did not reverse a chain proposed from the model, so a wrong proposal could only be fixed by starting again. Fixing those before user testing meant the test rounds were spent on problems the authors could not see for themselves, rather than on ones any careful reader could have spotted.

## Design realistic tasks

Test tasks should be real work, or close to it. The office built five tasks from recent stacks in its records, with the designers' permission:

1. Set up the hub-to-housing stack on the gearbox assembly from scratch, from the model.
2. Open an old stack converted from the old tool, and confirm its tolerances.
3. Find out why a given stack fails and propose the cheapest fix.
4. Revise a dimension on a drawing and deal with the re-check result.
5. Prepare the review record for a stack and explain its method to the reviewer.

Each task had a clear end point and a definition of success: the right result, the right conclusion and no undetected input error. The observer recorded whether each participant succeeded, how long it took, every error and every hesitation, as in Chapter 1.

## Run the rounds

Each round used five designers who had not used the redesigned tool before, a mix of experienced and new. Sessions took about an hour each, so a round took about a week of elapsed time and five hours of designers' time, plus the observer's.

```figure
type: bars
title: Problems found in each round of testing
unit: problems
max: 16
caption: This is an illustration from the office's three rounds. Between rounds the author fixed the serious and moderate problems; later rounds found fewer, smaller problems, including some that earlier problems had hidden.
- Round 1, five designers | 14
- Round 2, five designers | 8
- *Round 3, five designers | 2
```

The first round found **14** problems. The author fixed ten, including all the serious ones, before the second round. The second round found **8**: six new and two not yet fixed. Several of the new ones had been hidden in round one, because participants had stopped before reaching them. The third round found **2**, both minor.

## Measure as well as watch

Each round recorded three numbers per task, so the rounds could be compared. This is an illustration. In round one, participants completed about 19 of 25 task attempts correctly, five tasks for five people. In round two, about 22 of 25. In round three, all 25. The average time for task 1, setting up the hub-to-housing stack from the model, fell from about 11 minutes in round one, when the chain proposal often needed correction, to about 5 in round three. Undetected input errors, the measure that matters most, fell from four in round one to one in round two and none in round three.

The numbers are small and should not be over-read. Five people are not a statistical sample. But the direction across rounds was clear, and the numbers kept the discussion of each round's findings anchored in what happened rather than in what the author or the participants felt.

## Keep one problem log

Every problem found, whether by the principles review, a test round or a quick test, goes into one log with the same fields: what was observed, in which task, how many participants hit it, its severity, the proposed fix, who fixes it and whether the fix was confirmed in a later round. The log is the backbone of the process. It stops a problem seen by one participant in round one being forgotten because nobody else hit it, and it shows at a glance what remains open before release.

The log also prevents a common trap: arguing about whether a problem is real. If a participant was confused, the confusion is a fact, recorded with what they did. Whether to fix it is a separate decision, made on severity and cost. The author does not get to decide that a participant "should have known", and the observer does not get to redesign the tool. The design manager reviews the log after each round and agrees the fixes with the author.

## Rate problems by severity

Not every problem deserves the same effort. The office rated each problem on a simple three-level scale:

- **Serious:** the user gets a wrong result without knowing it, or cannot complete the task. Must be fixed before release.
- **Moderate:** the user is slowed or confused but recovers and gets the right result. Should be fixed before release if possible.
- **Minor:** cosmetic or rare. Fixed when convenient.

```figure
type: compare
title: The office's severity scale, with examples from the rounds
cols: Definition | Example from testing | Rule
caption: This is an illustration. A silent wrong result is always serious, however rarely it occurs, because nobody knows to look for it.
- *Serious | wrong result without the user knowing, or task cannot be completed | asymmetric tolerance entered reversed, unnoticed | fix before release
- Moderate | slowed or confused, but recovers with the right result | chain proposal missed a spacer; user added it by hand | fix before release if possible
- Minor | cosmetic or rare | two words for the same button | fix when convenient
```

The scale put the gear hub problem from Chapter 1 squarely in the serious category, with any other silent wrong result. The rule that no serious problem may remain at release gave the testing a clear finish line.

## Test the help and the record as well

The tool is not just its screens. Round three included a sixth task: answer a question about the statistical method using only the tool's help, and a seventh: review a colleague's stack record and find the deliberate input error planted in it. The first checked that the help from Chapter 4 answered real questions. The second checked that the review record from Chapter 3 let a reviewer find an error without opening the tool. Both found small problems: a help page that used a term not in the glossary, and a record layout that listed imported and typed inputs in separate places, making the comparison with drawings slower. Both were fixed before release.

## Quick tests between rounds

Not every change needs a full round. For small changes, such as a reworded label or a new warning, the office uses a ten-minute test: one or two designers passing the author's desk are asked to try the changed part on a real stack while the author watches silently. It finds the obvious problems with almost no cost, and the full rounds are kept for substantial changes.

## Decide when it is ready

The office released the redesigned tool after the third round, when no serious or moderate problems remained open, every participant in the last round completed every task correctly, and the average time to set up the hub-to-housing stack from the model was about 5 minutes. The two minor problems from round three went onto the improvement list.

The test rounds had a cost: fifteen designer-hours, about forty observer-hours and about sixty hours of the author's fixes. Against a single silent wrong result reaching a customer, as the gear hub had, the cost was small.

## A failure case: the tasks that avoided the hard case

This is an illustration. The first round, before the five real tasks were written, used an invented exercise stack that the author had created for a demonstration. All its tolerances were symmetric, such as ± 0.10 and ± 0.05, because that made the demonstration tidy. The round went well. Participants found the new upper and lower deviation fields easy.

The real tasks, introduced in round two, included the bearing with its asymmetric tolerance of +0 / −0.12. Two of the five participants entered **−0.12** into the upper deviation field and **0** into the lower, reading the fields left to right as "minus" first. The resulting limits, shown beside the row as Chapter 2 required, read "12.00 to 11.88", which one participant noticed and corrected. The other did not notice, because they read the limits as a range regardless of order.

The detection came from realistic tasks in round two. The invented exercise in round one had avoided the very case the new fields were designed for. The corrections were to label the fields "upper deviation (+)" and "lower deviation (−)" with the example from Chapter 4 beneath, to show the limits always as "lower to upper" so a reversed entry produces an obviously backwards range, and to make an upper deviation smaller than the lower one a warning, as Chapter 2's plausibility checks list. The office's rule since then: test tasks come from real recent work, chosen to include the awkward cases, never from a demonstration file. Demonstration files are built to show a tool at its best, which is the opposite of what a test needs. A good test task is one the author would rather not see attempted.

## How this applies to a small Australian business

Small offices can run this kind of testing with no special facilities: a desk, a colleague, a real task and someone to take notes. Five people per round, three rounds, fixes between them, and the author kept out of the room. If you have fewer than fifteen people who could take part, reuse people in later rounds but give them different tasks. Australian engineering offices are often small enough that everyone knows the tool's author, which makes candid feedback harder. An observer who is not the author, and a firm rule against helping during the session, are what make the results honest. Thank the participants afterwards and show them what changed because of what they found. People who see their confusion turned into a fix volunteer readily for the next round.

## Exercise: planning the rounds

The office plans to test a new feature, investigation variants with measured values, and has eight designers available who have not used it. Using Nielsen's model with L = 31%, what share of problems would one round of eight be expected to find? How would you use the same eight designers instead, and why?

**Worked answer.** One round of eight would be expected to find about **1 − 0.69⁸ ≈ 95%** of the problems the model assumes exist. A better use is two rounds of four, which on the model each find about **1 − 0.69⁴ ≈ 77%** of the problems remaining at the time. The second round tests the fixes from the first and finds problems the first round's problems hid, which a single large round cannot do. If the feature is small, a review against principles followed by two rounds of three or four is usually enough.
