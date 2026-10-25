---
book: performance-solutions-by-the-numbers
chapterSlug: evacuation-time-by-the-numbers
order: 6
title: "Escape time by the numbers"
description: "Build a time-line of awareness, response, walking, stair travel and queuing for the reference and the proposal, and find the fire scenario in which detection does not help."
draft: false
---

An egress Performance Solution eventually comes down to time. How long does it take people to realise there is a fire, decide to leave, and reach a place of safety? A longer route adds walking time. Earlier warning removes waiting time. Whether a proposal is at least as good as the Deemed-to-Satisfy reference depends on how those additions and subtractions balance, scenario by scenario.

This chapter builds the time-line for the running case, using the teaching inputs agreed in the brief. It shows the proposal losing without detection, winning with it in most scenarios, and losing again in the one scenario where detection cannot help. That last result is the most useful number in the book.

## The time-line

Fire engineers commonly break the time needed to escape into stages. The running case uses five:

1. **Awareness.** The time from ignition until an occupant becomes aware of the fire, through an alarm, through seeing or smelling smoke, or through being told.
2. **Pre-movement.** The time between becoming aware and starting to move: stopping work, putting down a load, looking to see what is happening, deciding to go.
3. **Walking.** Travel on the flat to the stair.
4. **Stair travel.** Travel down the stair, along its line of nosings.
5. **Floor travel and queuing.** Travel from the stair foot to the door to open space, plus any wait to get onto the stair behind others.

The sum is the required escape time for the last person to leave the mezzanine and reach open space. In a comparative analysis, the same five stages are calculated for the reference and the proposal with the same inputs, except where the proposal deliberately changes one.

```figure
type: formula
title: Required escape time from the mezzanine to open space
formula: t = t_aware + t_pre + L_m ÷ v + L_s ÷ v_s + L_f ÷ v + (n − 1) ÷ F
caption: This is an illustration using the teaching inputs from the brief, not design values. The queue term is the delay for the last of n people entering the stair at flow F.
- t_aware, t_pre | awareness and pre-movement time, s
- L_m, L_s, L_f | route length on the mezzanine, along the stair nosings and on the floor, m
- v, v_s | walking speed on the flat and travel speed on the stair, m/s
- n, F | occupants on the mezzanine and flow onto the stair, persons per second
step: Stair travel: 5.03 ÷ 0.5 = 10.06 s, the same in every case
step: Queue for the last of 7 people at 1.0 person per second: 6 ÷ 1.0 = 6 s
```

## Scenario A: a fire under the mezzanine

This is an illustration. In scenario A, packaging catches fire in the workshop under the mezzanine. Smoke rises past the mezzanine edge towards the roof. Without detection, the brief assumes the people on the mezzanine become aware after 120 s, when smoke or noise reaches them. With smoke detection and a local alarm on and under the mezzanine, part of the proposal, the brief assumes 60 s. Pre-movement is 60 s in every case. Walking speed is 1.0 m/s and stair speed 0.5 m/s.

**DTS limit reference, no detection:**

120 + 60 + 20 ÷ 1.0 + 10.06 + 9.54 ÷ 1.0 + 6 = **225.6 s**

**Proposal, no detection:**

120 + 60 + 28 ÷ 1.0 + 10.06 + 9.19 ÷ 1.0 + 6 = **233.25 s**

**Proposal, with detection and alarm:**

60 + 60 + 28 ÷ 1.0 + 10.06 + 9.19 ÷ 1.0 + 6 = **173.25 s**

Without detection, the proposal is **7.65 s slower** than the reference: 8 m more walking on the mezzanine, less 0.35 m on the floor. With detection, it is **52.35 s faster**. Against the more demanding DTS alternative reference, which takes 224.1 s, the detected proposal is 50.85 s faster.

```figure
type: bars
title: Scenario A escape time from the mezzanine to open space
unit: s
max: 240
caption: This is an illustration using the agreed teaching inputs. Detection reduces awareness time from 120 s to 60 s, which outweighs the longer walk.
- DTS limit reference, no detection | 225.6
- DTS alternative reference, no detection | 224.1
- Proposal, no detection | 233.25
- *Proposal, with detection and alarm | 173.25
```

The break-even point is easy to find. The proposal without detection is 7.65 s slower, so detection must bring awareness forward by at least 7.65 s for the proposal to match the DTS limit reference. In this scenario, awareness would need to come no later than **120 − 7.65 = 112.35 s**. The brief's assumed 60 s gives a wide margin, but Chapter 7 tests what happens if the detection is slower or not working.

## Why awareness dominates

Look at the shape of the scenario A numbers. Of the reference's 225.6 s, awareness and pre-movement account for 180 s, or 80%. Walking, stair travel, floor travel and queuing together account for about 46 s. The longer route changes only the walking term, by 8 s.

That pattern is typical of small spaces with few occupants. The time people spend not yet moving usually exceeds the time they spend moving. It has two consequences for the argument.

First, improvements in warning are powerful. Halving awareness time saves far more than the longer route costs. That is why detection is such an effective compensating measure in scenario A, and why the analysis must take its reliability seriously (Chapter 7).

Second, the route geometry matters less than intuition suggests, until the scenario removes the advantage of early warning. In scenario D, awareness is quick in both layouts, so the only difference left is the route, and the proposal loses. A Performance Solution that relies on detection is strong in scenarios where detection helps and weak in scenarios where it cannot. The report must show both, side by side, so that the reader sees the weakness as clearly as the strength.

The proportions also guide where effort is best spent. Debating whether the walking speed should be 1.0 or 1.2 m/s changes the scenario A result by a few seconds. Debating whether pre-movement is 60 s or 180 s changes it by two minutes, though equally in both layouts. The inputs that differ between reference and proposal deserve the closest scrutiny, because they decide the comparison.

## Single values and real people

The calculation uses one value for each input. Real occupants vary: some notice smoke at once and leave immediately; others finish a task, look for a colleague or go back for a phone. Fire engineers often treat awareness and pre-movement as distributions and examine the slower occupants, not the average.

For a comparative analysis of seven trained staff, single values are a defensible simplification, provided the sensitivity analysis tests slower values and the report states the simplification. It would not be defensible for a building with large numbers of unfamiliar occupants, where the slow tail of the distribution sets the outcome.

## Scenarios B and C: where the stair lands

Scenarios B and C test whether a fire could block the single stair. They are not well suited to a time-line calculation, because the important question is whether the route is usable at all, not how long it takes.

In scenario C, the fire starts near where the DTS reference stair would land, in the fabrication area. The reference's occupants would have to descend towards the fire. In scenario B, the fire starts near the proposal's stair foot, beside exit P2. The brief's response to B is the 3 m clear zone at the stair foot, kept free of combustible materials, which makes a fire there much less likely than a fire in the busy fabrication area.

The comparison of B and C is therefore qualitative and relies on Expert Judgement about the relative likelihood and severity of fires near each stair foot. Chapter 9 explains how that judgement is made and recorded. The time-line calculation does not cover it, and the report says so.

## Scenario D: a fire on the mezzanine

In scenario D, the fire starts on the mezzanine itself, among packed tooling on the shelving. The occupants are in the room where the fire starts. They will see, hear or smell it quickly, alarm or not. The brief assumes awareness after 30 s in every case, because detection adds little when the fire is in plain sight.

**DTS limit reference:**

30 + 60 + 20 + 10.06 + 9.54 + 6 = **135.6 s**

**Proposal, with detection:**

30 + 60 + 28 + 10.06 + 9.19 + 6 = **143.25 s**

The proposal is **7.65 s slower**, with or without detection, because detection has nothing to contribute when awareness is immediate. Acceptance criterion 1 in the brief, that the proposal's required escape time is not longer than the reference's in each scenario, is **not met** in scenario D.

```figure
type: compare
title: Results against acceptance criterion 1
cols: Reference | Proposal with detection
caption: This is an illustration. Times are for the last person to reach open space from the mezzanine, using the agreed teaching inputs.
- Scenario A, fire under the mezzanine | 225.6 s | 173.25 s: meets
- Scenario B, fire near the proposal's stair foot | qualitative | addressed by the clear zone and Expert Judgement
- Scenario C, fire near the reference stair foot | qualitative | the proposal is not exposed
- *Scenario D, fire on the mezzanine | 135.6 s | 143.25 s: does not meet
```

## What a failed scenario means

A failed scenario is not a failed project. It is information. The brief anticipated it: criterion 3 allows an exception if the report explains why it is acceptable. Scenario D tells the engineer and owner exactly where the proposal is weak: when the fire is on the mezzanine, the longer route is a pure loss, and in this scenario the occupants may even have to pass the fire to reach the single stair.

There are three honest responses, which Chapter 7 develops:

1. **Change the scenario's likelihood or severity.** For example, restrict the mezzanine to non-combustible storage, which makes a significant fire there unlikely. That becomes a condition on how the business uses the space.
2. **Change the design.** For example, re-plan the shelving so the main aisle leads more directly to the stair, or add a second stair.
3. **Accept the DTS alternative.** Move the stair, and drop the Performance Solution.

What is not acceptable is to drop scenario D from the report, or to change its inputs after the fact until it passes. The brief's scenarios and inputs were agreed in advance for exactly this reason.

## The error: the stair you measured vertically

An early version of the spreadsheet calculated stair travel as the deck height divided by the stair speed: **3.0 ÷ 0.5 = 6 s**. The NCC measures distance on a stair along the line of nosings, and the brief adopted the same convention for the time-line: **5.03 ÷ 0.5 = 10.06 s**. Using the vertical rise understated stair time by about 4 s.

Because the error affected the reference and the proposal equally, it did not change the differences between them, which is perhaps why nobody noticed it at first. But it made every absolute time 4 s too short, which matters when those times are compared with how long conditions remain survivable on the mezzanine, as Chapter 7 does. It was caught by a plausibility check: the peer reviewer noticed that the spreadsheet implied a descent rate of 0.5 m/s vertically, which for risers of 176.5 mm means nearly three risers a second, and asked whether that was intended. The fix was a single cell, plus a line in the method describing how stair distance is measured.

The general lesson is that comparative results can hide errors that cancel out. A good review checks the absolute numbers as well as the differences, and asks of each term whether the implied physical behaviour is believable.

## Reading the numbers with care

Several cautions apply to every number in this chapter:

- **The inputs are teaching assumptions.** In a real project, each would be sourced from recognised data, justified for the occupants and building, and stated with its uncertainty.
- **The model is deliberately simple.** It treats people as moving at a constant speed along fixed routes, ignores interactions between them beyond a simple queue, and treats awareness and pre-movement as single numbers rather than distributions.
- **Time is not the whole story.** A route that takes 7.65 s longer may be acceptable on the floor of a large workshop and unacceptable on a mezzanine that is filling with smoke. Chapter 7 adds that dimension.

The value of the calculation is not precision. It is that it makes the argument visible: anyone can see which term changed, by how much, and why. A reviewer who disagrees with an input can change it and see the effect at once, which is much harder with a complex model whose workings are hidden.

```figure
type: checklist
title: Escape time results for the running case
caption: This is an illustration. Results are recorded with the inputs and the scenario, so that each can be reproduced.
- x Time-line method and inputs as agreed in the brief
- x Scenario A: proposal with detection 173.25 s against reference 225.6 s; meets
- x Scenarios B and C: qualitative; referred to Expert Judgement
- x Scenario D: proposal 143.25 s against reference 135.6 s; does not meet criterion 1
- x Stair distance measured along the nosings, 5.03 m, after review
- ? Response to scenario D | Chapter 7
```

## Exercise: faster detection, slower people

Suppose the brief had assumed a walking speed of 0.6 m/s and a stair speed of 0.3 m/s, for example to represent a person carrying a load or a slower-moving occupant, with everything else as in scenario A. Calculate the reference time and the proposal time with detection, and say whether the proposal still meets criterion 1.

**Worked answer.** Stair travel becomes **5.03 ÷ 0.3 = 16.8 s** (16.76 s unrounded).

**Reference:** 120 + 60 + 20 ÷ 0.6 + 16.76 + 9.54 ÷ 0.6 + 6 = 120 + 60 + 33.33 + 16.76 + 15.90 + 6 = **252.0 s**.

**Proposal with detection:** 60 + 60 + 28 ÷ 0.6 + 16.76 + 9.19 ÷ 0.6 + 6 = 60 + 60 + 46.67 + 16.76 + 15.32 + 6 = **204.7 s**.

The proposal is about **47.3 s faster**, so it still meets criterion 1 in scenario A. Slower movement increases the cost of the longer route, from 7.65 s to about 12.75 s, because the extra 8 m on the mezzanine now takes 13.3 s and the 0.35 m saving on the floor 0.6 s. But the 60 s gained by detection is still much larger. In scenario D, by contrast, the same slower speeds would make the proposal about 12.75 s slower than the reference, widening the failure.
