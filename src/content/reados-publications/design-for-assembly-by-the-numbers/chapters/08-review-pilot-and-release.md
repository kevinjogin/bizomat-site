---
book: design-for-assembly-by-the-numbers
chapterSlug: review-pilot-and-release-the-redesign
order: 8
title: "Review, pilot and release the redesign"
description: "Close a design-for-assembly review: check the design against its requirements, run a pilot build with a learning curve, verify retention and loosening, switch production over and keep the gains."
draft: false
---

A redesign is not finished when its drawings are signed. Every number in the earlier chapters was a measurement on prototypes, a supplier's quotation or an estimate, and every one of them can turn out differently in production. The press fit might hold less at its smallest interference. The knob might loosen after a few thousand lock-out cycles. The 26 s assembly time might be a prototype bench's time, not a production bench's. The pilot build is where the redesign's claims are tested on real parts, by the people who will build it, before the old design is retired.

This chapter takes revision B through a final design review, a pilot build of 100 units with a learning curve, the verification tests the earlier chapters left open, the switch from revision A, and the measures that keep the gains. The failure case is the first production batch at a second bench, which took a third longer than the pilot.

## The final design review

Before ordering pilot parts, the team met with the owner, the assemblers, the plunger and knob suppliers' representatives and the company's inspector, and went through a checklist built from the earlier chapters.

```figure
type: checklist
title: Revision B's design review before the pilot
caption: This is an illustration. Ticked items were closed at the review; open items were assigned to the pilot. Each item names the chapter that raised it.
- x Function: protrusion, stroke, lock-out and spring forces meet the specification | Chapters 1 and 5
- x Part count and sequence: six parts, one direction, nothing held while fitting | Chapters 2 and 4
- x Handling rules: no tiny or thin parts, closed-ended springs, symmetrical bush | Chapter 3
- x Stacks: protrusion and lock-out pass on worst case | Chapter 5
- x Error-proofing: reversed plunger prevented, knob interlock, green O-ring, shortened cone | Chapter 6
- x Business case approved, with conditions | Chapter 7
- ? Press fit holds at the smallest interference, at temperature and under repeated pulls | Chapters 4 and 5
- ? Knob does not loosen under repeated lock-out cycles | Chapter 4
- ? Assembly time of about 26 s confirmed on a production bench | Chapters 3 and 4
- ? Defect rate close to the 0.3% rework and 0.1% returns estimated | Chapter 6
```

The four open items became the pilot's purpose. Each was given a test, a pass criterion and an owner before the parts were ordered, so that the pilot could not drift into a production run with no conclusion.

The drawings were also checked against the purchasing lesson from Chapter 3. The spring's closed ends, the plunger's collar-to-nose length, the bush's outside diameter and both chamfers, the knob insert's thread and the O-ring's colour are all marked on the drawings and the purchase specifications as characteristics that cannot be changed without engineering approval.

## The pilot build and its learning curve

The pilot was 100 units, built by the IP-16's regular assembler on the rearranged bench, in two sessions. Every unit was timed from the bench video. The first units were slow, as the first units of anything are, and the team used a learning curve to judge whether the times were falling as they should.

T. P. Wright described in 1936 how the time to make each unit falls by a constant percentage every time the cumulative quantity doubles. On an 85% curve, the 2nd unit takes 85% of the 1st, the 4th 85% of the 2nd, and so on. The time for unit n is the first unit's time multiplied by n raised to the power of the logarithm, base 2, of the learning rate. For 85%, that power is about **−0.2345**.

```figure
type: bars
title: Pilot unit times on an 85% learning curve from 75 s
unit: s
max: 80
caption: This is an illustration. Predicted times from the learning-curve relation with a first-unit time of 75 s. The measured average of units 91 to 100 was 26.4 s, against 25.8 s predicted for those units. The planned 26.0 s is reached at about unit 92.
- Unit 1 | 75.0
- Unit 10 | 43.7
- Unit 50 | 30.0
- *Unit 100 | 25.5
```

The first unit took **75 s**, mostly because the assembler was learning the new press and the loading cone. On an 85% curve, unit 50 should take about 30.0 s and unit 100 about 25.5 s, reaching the planned 26.0 s at about unit **92**. The measured average of units 91 to 100 was **26.4 s**, close to the curve's prediction of 25.8 s for those units. The pilot confirmed the planned time within about half a second.

A real learning curve flattens: no assembler gets faster forever, and once the method is settled, the time stops falling. The curve is useful for the early units, to tell normal learning from a real problem. If units 40 to 50 had still been taking over 40 s, the team would have looked for a problem in the method or the parts rather than waiting for practice to fix it.

With the pilot time, revision B's design efficiency index is 3 × 5 ÷ 26.4, about **56.8%**, against 23.6% for revision A without its lock nut.

## Verification tests

The pilot's other job was to close the open technical items. Each test used units from the pilot, not prototypes.

```figure
type: compare
title: Verification tests on pilot units
cols: Test | Criterion | Result
caption: This is an illustration. Push-out and pull tests were made by the company's inspector on a bench test rig. The minimum-interference group was made by selecting bushes near the small end of their outside limit and bodies near the large end of their bore limit.
- *Press-fit push-out, smallest interference, 10 units | interference 0.010 to 0.014 mm | at least 750 N | lowest 1,180 N
- Push-out at 60 °C, 5 units | after 2 hours at temperature | at least 750 N | lowest 1,050 N
- Repeated pull, 5 units | 100,000 pulls at 250 N | bush stays flush within 0.02 mm | no measurable movement
- Knob loosening, 10 units | 20,000 lock-out cycles | knob stays tight; breakaway torque falls less than 15% | largest fall 9%
- Function test, all 100 units | as Chapter 6 | all pass | 100 pass, after the O-ring correction
```

Every test passed, but the push-out result changed a number. The prototypes in Chapter 4 had held 1,500 N; the pilot's smallest-interference bushes held at least **1,180 N**. That still gives a capacity of about 4.7 times the 250 N design load, above the design factor of 3, but the rating recorded in the design file was lowered from 1,500 N to 1,180 N, with its basis stated. A rating should come from the worst case of the parts that will actually be built, and the prototypes had happened to be near the middle of their limits.

## Switching production over

Revision A could not simply stop. The company held stock of revision A's unique parts, including rear caps, cross pins, knob screws, knob washers and spring seats, for about 1,200 units, worth about **A$2,748** at cost. It also held made revision A bodies and plungers for a similar number.

Scrapping that stock would cost A$2,748 in parts alone. Building those 1,200 units as revision A would cost the extra assembly and defect cost of about A$0.77 a unit, about **A$924**. Running the old stock down first was clearly cheaper, so revision B's start was timed for the week revision A's parts ran out, about ten weeks after the pilot. In that time the knob mould was modified, the pilot results were written up, the work instruction was finished with photographs of each step, and the second assembler was trained on the pilot bench.

Customers were told before the change, not after it. Revision B fits the same threaded hole, protrudes the same distance and locks out the same way, but it looks different at the rear, its knob turns differently into lock-out, and its lock nut now arrives loose in the bag. A one-page notice went to every customer who had bought IP-16s in the previous two years, with a photograph of both revisions and the reason for the change. Two customers asked for samples to check in their own fixtures before accepting the new revision, which the pilot's spare units provided.

The changeover was recorded as a revision on every drawing and in the bill of materials, with the effective serial number marked on the product's packaging, so that a returned unit can be identified as revision A or B at a glance.

## The work instruction

Revision B's work instruction is one page, laminated at the bench. It has a photograph of each of the six steps, taken on the pilot bench, and three short columns beside each: the step, the key point that makes it right, and the reason for the key point. For the plunger step, for example, the key point is "green ring visible on the nose before the plunger goes in", and the reason is "a missing ring cannot be seen once the bush is pressed". Giving the reason matters. An assembler who knows why a key point exists is more likely to keep to it when rushed, and to notice when a change to the parts makes it wrong.

The instruction was written by the regular assembler with the engineer, not by the engineer alone, and it was tried by the second assembler before release. Two of its key points changed in that trial, both to describe what the assembler actually sees rather than what the drawing says.

## Across the product family

Design for assembly is most valuable when it is applied to a family rather than one product. The IP-12 has the same structure as the IP-16, and the review asked which revision B parts the two could share. The spring and the O-ring could not, because the IP-12 is smaller. The rear bush could, if the IP-12's body were given the same 14 mm rear bore, and so could the knob, if both used the M6 tail thread. Sharing those two parts would mean one press fixture, one mould, one knob insert and two fewer part numbers across the family. The IP-12's redesign therefore starts with a constraint the IP-16's did not have: keep the bush and knob common. The family's part numbers would fall from 22 across the two revision A products to 12 across the two revision B products, sharing two.

## A failure case: the second bench

This is an illustration. The first full production batch of revision B, 200 units, was built by a second assembler at a second bench in another part of the workshop, because the pilot bench was busy. The batch averaged **34.5 s** a unit, about a third longer than the pilot's settled 26.4 s.

The assembler had been trained on the pilot bench and was not the problem. The second bench had been set up from the parts list, not from the pilot bench. The parts were in a different order, so the assembler crossed hands for two of them; the O-ring peg was missing, so the O-rings came out of a bag; and the press was a slightly different model whose stop had been set by eye. Every one of those differences added a second or two, and the press's stop being set by eye added a risk, too.

The detection was the batch time, which the bench records at the end of every batch: 200 units in about 1 hour 55 minutes, against about 1 hour 28 minutes planned. Without that simple record, the extra half hour a batch would have looked like an ordinary slow day. The correction was a standard bench layout, a photograph and a plan drawn to scale, which every IP-16 bench must match; a second O-ring peg and loading cone; and a check of the press stop with a setting gauge before every batch. The next batch on the second bench averaged 26.8 s.

## Keeping the gains

Design-for-assembly gains erode quietly if nobody watches them: a supplier substitutes a part, a bench is rearranged, a step is added to fix a problem and never removed. The company now keeps four measures for the IP-16 and reviews them every quarter.

1. **Assembly time per batch**, from the batch record, against 26.4 s.
2. **Rework and returns**, from the rework log and the returns register, against the 0.3% and 0.1% estimates. In the first 1,500 production units, 4 were reworked, about 0.27%, and 1 was returned, about 0.07%.
3. **Design efficiency index**, recalculated whenever a part or step changes.
4. **Change control**, so that any purchasing, process or design change to an assembled part is checked by engineering and production before it is made.

The review also left a procedure for the next product, a short version of this book: count and time, find the theoretical minimum, improve handling and insertion, check retention and stacks, error-proof, cost the whole unit, pilot, and release with standard benches and measures. The IP-12 is next.

## How this applies to a small Australian business

Turn every open item from a redesign into a test with a criterion and an owner before ordering pilot parts. Build the pilot with the people who will build the product, time it, and use a learning curve to tell normal learning from a problem. Test retention and loosening on the worst-case parts you will actually build, and lower a rating when the evidence says so. Plan the changeover around existing stock. Standardise benches, not just parts, and record batch times so that drift is visible. Keep a few measures and a change rule, and repeat the review on the next product.

## Exercise: a different learning rate

The IP-12 redesign is expected to start, like the IP-16's pilot, at about **75 s** for the first unit, with a planned settled time of **26 s**. Using the learning-curve relation, what time would unit 100 take on an **80%** curve and on a **90%** curve? Roughly how many units would each take to reach 26 s? What would you conclude if, after 100 units, the measured time were still about 37 s?

**Worked answer.** For 80%, the power is the base-2 logarithm of 0.8, about −0.3219, so unit 100 takes 75 × 100^−0.3219, about **17.0 s**, and 26 s is reached at about unit **27**. For 90%, the power is about −0.1520, so unit 100 takes about **37.2 s**, and 26 s would not be reached until about unit **1,064**. A time of about 37 s at unit 100 fits a 90% curve, which is a slow rate of learning for a simple six-part build that the IP-16 pilot learned at about 85%. The likely conclusion is not that the assembler needs more practice, but that something in the method, the bench or the parts is making a step harder than planned, and the video should be checked step by step, as it was for the second bench.
