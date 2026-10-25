---
book: performance-solutions-by-the-numbers
chapterSlug: margins-sensitivity-and-uncertainty
order: 7
title: "Margins, sensitivity and the case that fails"
description: "Test a comparative result against slower people, slower detection and failed detection, connect escape time to survivable conditions, and decide what to do with a scenario that fails."
draft: false
---

A single result tells you what happens if every input is exactly right. Inputs are never exactly right. Sensitivity analysis asks how the conclusion changes when they are wrong, and margin analysis asks how wrong they can be before the conclusion fails. A Performance Solution that has not been through both has been tested only under the conditions its author chose.

This chapter puts the running case through the sensitivity cases agreed in the brief, finds the input on which the whole solution depends, connects escape time to the time that conditions remain survivable, and works through the responses to scenario D, which failed in Chapter 6.

## The principle behind the comparison

Fire safety engineering commonly frames egress as a race between two times. The available safe egress time (ASET) is how long conditions in a space remain survivable once a fire starts. The required safe egress time (RSET) is how long the occupants need to get out, which is what Chapter 6 calculated. The superseded NCC 2019 Fire Safety Verification Method stated the principle directly: ASET must be greater than RSET.

```figure
type: formula
title: The egress margin
formula: margin = ASET − RSET, which must be greater than zero
caption: The principle as stated in the NCC 2019 Fire Safety Verification Method, a superseded edition, and widely used in fire safety engineering. This book does not quote tenability values.
- ASET | available safe egress time: until conditions in the space stop being survivable, s
- RSET | required safe egress time: until the occupants reach a place of safety, s
step: Comparative check: if ASET is the same in reference and proposal, the proposal's margin is at least as large when its RSET is no longer
step: Scenario A: proposal RSET 173.25 s against reference 225.6 s, so its margin is larger by 52.35 s
```

A comparative analysis can avoid calculating ASET in absolute terms if ASET is the same in both layouts. In scenario A, it largely is: the fire, the mezzanine and the roof are identical, and smoke reaches the mezzanine at the same time whichever end the stair is at. The proposal's smaller RSET then means a larger margin.

In scenario D, ASET is not obviously the same. With the fire on the mezzanine, the proposal's longer route may take occupants closer to the fire, where conditions deteriorate first. The proposal may have both a longer RSET and a shorter ASET along its route. That is why scenario D is the hardest test, and why a time-line alone cannot clear it.

## The sensitivity cases

This is an illustration. The brief required each sensitivity case to be run for scenario A against the DTS limit reference, with everything else at its base value. The results:

```figure
type: compare
title: Scenario A sensitivity, proposal with detection against the reference
cols: Reference | Proposal | Difference
caption: This is an illustration using the teaching inputs. Negative differences mean the proposal is faster. The detection-unavailable case is the only one that fails.
- Base inputs | 225.6 s | 173.25 s | −52.35 s
- Slower walking 0.6 m/s and stair 0.3 m/s | 252.0 s | 204.7 s | −47.25 s
- Pre-movement 180 s in both | 345.6 s | 293.25 s | −52.35 s
- 20 occupants on the mezzanine in both | 238.6 s | 186.25 s | −52.35 s
- Detection slower, awareness at 100 s | 225.6 s | 213.25 s | −12.35 s
- DTS alternative reference at 18.5 m | 224.1 s | 173.25 s | −50.85 s
- *Detection unavailable | 225.6 s | 233.25 s | +7.65 s
```

Read the table by asking which inputs move the difference and which do not. Pre-movement time and the number of occupants change both times equally, so they change nothing in the comparison. Slower movement narrows the gap a little. The choice of reference narrows it a little. Slower detection narrows it a lot. And no detection reverses it.

The conclusion is stark: in scenario A, **the whole solution depends on the detection system working**. With it, the proposal has a margin of tens of seconds over the reference. Without it, the proposal is worse than the DTS layout.

## The error: one-sided sensitivity

The engineer's first sensitivity analysis varied walking speed, stair speed, pre-movement and occupant numbers. Every case passed. The draft concluded that the result was "robust".

It was not robust; it was untested where it was weakest. Every input varied was one that either affected both layouts equally or affected the walking term, which the detection advantage swamps. None varied the one input that differs between the layouts: awareness time with detection. The certifier's comment at the brief stage, that a detection-unavailable case must be included, was what exposed it.

The general rule is to vary first the inputs that differ between reference and proposal, because those are the inputs the conclusion rests on. Varying inputs that are common to both is useful for checking absolute times, but it cannot test a comparative conclusion. A sensitivity analysis in which every case passes should prompt the question: did we vary anything that could have made it fail?

## Turning a dependency into a condition

A solution that depends on detection can still be acceptable, if the detection is made dependable and if the building has a plan for when it is not. The engineer proposed three linked conditions:

1. **Specification and evidence.** The detection and alarm system on and under the mezzanine is designed and installed to the relevant standard, with evidence of suitability (Chapter 8).
2. **Maintenance.** The system is listed among the building's fire safety measures, maintained and tested on the schedule its standard requires, and included in the annual fire safety statement.
3. **Impairment procedure.** Whenever the system is out of service, the mezzanine is closed to occupants until it is restored, with a sign at the stair and an entry in the impairment log.

The third condition is what makes the detection-unavailable case acceptable. It turns "detection fails and seven people are on the mezzanine" into "detection fails and nobody is on the mezzanine". The condition must be practical, or it will not be followed. Closing a storage mezzanine for a day while a detector is replaced is practical. Closing an office would not be.

## Responding to scenario D

Scenario D, the fire on the mezzanine, failed in Chapter 6 by 7.65 s, independent of detection. The engineer examined the three responses.

**Re-plan the shelving.** Any route through rows of shelving set at right angles is at least as long as the sum of its east–west and north–south legs: **19 + 9 = 28 m**. Reorganising the shelving to leave an open diagonal approach to the stair would bring the route down to the straight-line distance of **21.0 m**. Scenario D would then take **30 + 60 + 21.02 + 10.06 + 9.19 + 6 = 136.27 s**, against the reference's 135.6 s. That is still **0.67 s slower**, and slower again against the DTS alternative. The re-plan narrows the failure but does not remove it, and it costs storage.

**Restrict the fire load.** If the mezzanine holds only non-combustible items, such as steel tooling and fixtures in steel bins, with no cardboard, timber pallets or packed export crates, then a fire on the mezzanine large enough to threaten the occupants is unlikely. The time difference is unchanged, but the scenario itself becomes far less credible. That argument is Expert Judgement, not calculation, and Chapter 9 tests it.

**Move the stair.** The DTS alternative removes the problem entirely.

The engineer's draft conclusion was that the Performance Solution could be supported only with the fire load restriction, and that the restriction must be written as a condition: no combustible storage on the mezzanine, no staging of packed export crates, and steel bins for tooling.

```figure
type: matrix
title: Responses to the scenario D failure
x: Ongoing burden on the business: low → high
y: Confidence the failure is resolved: low → high
hot: 1
caption: This is an illustration of the engineer's assessment. The fire load restriction resolves the failure only through Expert Judgement and creates a lasting operational condition.
- Move the stair to the DTS position | resolved by the DTS Provisions; no ongoing condition
- Restrict the mezzanine to non-combustible storage | resolved by judgement; permanent restriction on use
- Accept the failure without a response | not acceptable under the brief
- Re-plan shelving for a diagonal route | narrows but does not resolve; loses storage
```

## Why the mezzanine is the exposed place

The time-line treats the mezzanine like any other floor. Physically, it is not. Hot smoke from a fire rises to the roof and spreads out as a layer that thickens downwards over time. In the running case, the roof is 6.0 m high at the eaves and 7.5 m at the ridge. People standing on the mezzanine deck, 3.0 m above the floor, have their heads well above the height of people on the workshop floor. The descending smoke layer reaches them first.

That is why the comparison focuses on the time spent on the mezzanine, not on the total route. In the proposal, 8 m of the extra route is on the mezzanine, in the most exposed part of the building, while the 0.35 m saving is on the floor, the least exposed part. A second on the mezzanine is worth more than a second on the floor. A purely time-based comparison treats them as equal, which slightly flatters the proposal.

The engineer handled this by comparing the time each layout's occupants spend on the mezzanine as a separate measure. In scenario A with detection, the proposal's occupants leave the mezzanine deck after 60 + 60 + 28 + 6 = 154 s, counting the queue at the top of the stair, against the reference's 120 + 60 + 20 + 6 = 206 s. The proposal still leaves the exposed level about 52 s earlier, so the conclusion holds on this measure too. In scenario D, the proposal's occupants leave the deck 8 s later, which reinforces the failure.

## How much margin is enough?

The NCC does not state a required margin for comparative solutions. The equivalence test is "at least equivalent", which strictly means a margin of zero or more. In practice, a margin of zero is uncomfortable, because every input carries uncertainty and a solution that only just passes at base values will fail for some plausible combination of errors.

The brief is the right place to decide what margin is needed, and it should do so before results exist. The running case's brief did not set a numerical margin. Instead, it required the conclusion to hold across the stated sensitivity ranges, which is a way of building margin into the test. A proposal that passes at base values and fails within the agreed ranges does not meet the criteria. That approach suits small solutions; larger ones may justify explicit margins or probabilistic methods.

## Presenting sensitivity to the owner

Sensitivity tables are easy to misread. The running case's report ordered the cases by how much they moved the difference, largest first, and drew one line under the case that changed the conclusion. The owner did not need to follow every number. They needed to see that one input, the detection, carried the solution, and that one scenario, the fire on the mezzanine, defeated it. Everything else was detail, available in an appendix for anyone who wanted to check it.

## Margins, not just passes

The sensitivity table also gives the solution's margins, which belong in the final report. In scenario A, the margin against the reference ranges from 52.35 s at base values down to 12.35 s if detection is slower than assumed. The break-even awareness time is 112.35 s, so detection could be up to 52.35 s slower than the 60 s assumed before the proposal lost its advantage. That is a wide margin for an input the owner can influence through maintenance.

In scenario D, there is no margin: the proposal is behind at every value tested. A Performance Solution with no margin in a credible scenario should not be presented as robust, however good its other scenarios look. Presenting the margins honestly, including the absent one, is what allows the owner to make an informed decision in Chapter 10.

## Uncertainty that the numbers do not capture

Some uncertainty cannot be put into a sensitivity table:

- **Future use.** The analysis assumes seven trained stores staff and non-combustible storage. A future manager who converts the mezzanine to an office invalidates both assumptions.
- **Human behaviour.** The impairment procedure assumes people will close the mezzanine when the detection is out. That depends on training, signage and culture.
- **Model form.** The time-line model is simple. A more detailed model might find interactions it misses, such as occupants on the mezzanine waiting for a colleague.

- **Combined errors.** The table varies one input at a time. Two moderate errors together, such as slower detection and slower walking, can move the result more than either alone. For the running case, combining awareness at 100 s with the slower speeds still leaves the proposal ahead in scenario A, by only about 7.25 s: 244.74 s against 251.99 s. The margin shrinks from 52.35 s to about 7 s when two plausible errors combine, which is worth knowing, because a third error in the same direction could erase it. The check should be made rather than assumed.

The final report should name these uncertainties and say how each is managed, usually by a condition, a record or a limit on use. An uncertainty that cannot be managed by any of these is a reason to reconsider the solution, not a footnote.

```figure
type: checklist
title: Sensitivity and margin record for the running case
caption: This is an illustration. Each finding becomes either a margin in the report or a condition on the building.
- x Scenario A passes in all cases except detection unavailable
- x Detection dependency managed by specification, maintenance and an impairment procedure
- x Break-even awareness time 112.35 s against an assumed 60 s
- x Scenario D fails by 7.65 s; shelving re-plan narrows it to 0.67 s but does not resolve it
- ? Fire load restriction on the mezzanine | Expert Judgement, Chapter 9
- ? Owner's decision between conditions and the DTS stair position | Chapter 10
```

## Exercise: how slow can detection be?

Using the scenario A inputs, at what awareness time with detection would the proposal exactly match the DTS alternative reference, which takes 224.1 s?

**Worked answer.** Without detection, the proposal takes 233.25 s with an awareness time of 120 s. Every second of earlier awareness takes a second off the total. To match 224.1 s, the proposal must save **233.25 − 224.1 = 9.15 s**, so awareness must come no later than **120 − 9.15 = 110.85 s**.

Against the DTS alternative reference, the break-even awareness time is about 110.85 s, compared with 112.35 s against the DTS limit reference. The difference is the 1.5 m by which the alternative's mezzanine route is shorter than the limit. Both break-even times are far above the assumed 60 s, so the detection advantage is robust to the choice of reference. It is not robust to the detection being absent, which is why the impairment procedure matters.
