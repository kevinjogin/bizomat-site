---
book: design-for-assembly-by-the-numbers
chapterSlug: error-proof-the-assembly-and-test-it
order: 6
title: "Error-proof the assembly and test it"
description: "List every way an assembly can be built wrongly, prevent what design can prevent, make the rest obvious at the point of assembly, and design a short function test that catches what is left."
draft: false
---

An assembly that is quick to build but easy to build wrongly is not a good design. Every product has some ways it can be put together incorrectly: a part left out, a part in backwards, a seal cut on the way in, a fastener not tightened. In a product built thousands of times a year, each of those happens sooner or later, however careful the assembler. The question is where it is caught: by the design, which makes the error impossible; at the bench, where it is cheap to fix; at the final test; or by the customer, where it is expensive and does lasting harm.

This chapter lists the ways revision A and revision B can be assembled wrongly, applies the principles of mistake-proofing to each, designs a six-second function test, and puts numbers on what defects cost. The failure case is an O-ring that the function test could not see.

## How revision A went wrong

The company's rework log for the year before the review recorded 72 units reworked at the bench, 1.2% of production, and 18 returned by customers, 0.3%.

```figure
type: bars
title: Revision A's defects in one year, by cause
unit: units
max: 45
caption: This is an illustration. From the rework log and the returns register. Rework averaged about 5 minutes a unit; a return cost about A$45 in handling, freight and replacement.
- Cut wiper O-ring, found at the bench | 42
- Cross pin misaligned or not fully home | 24
- Spring seat washer missing or doubled | 6
- *Knob loose, returned by the customer | 18
```

Three of the four causes involve a part that Chapter 2 eliminated or a step that Chapter 4 changed. The cut O-rings came from stretching them over the nose by hand and pushing the plunger past the sharp edge of the bore. The misaligned pins came from aligning a small hole while holding a spring compressed. The washer was thin enough that two sometimes stuck together. The loose knobs came from screws whose thread-locking compound had been missed or had not cured before the unit was handled.

At A$62 an hour, the rework cost about **A$372** a year and the returns about **A$810**, about **A$1,182** together, or A$0.197 a unit. That is about a sixth of the assembly labour, and it leaves out the harder cost: a customer whose machine's knob came off.

## Prevent, then detect

Mistake-proofing has a long history in manufacturing, and John Grout's public-domain review of it for the US Agency for Healthcare Research and Quality sets out its principles clearly, drawing on industrial practice. Two of its distinctions organise this chapter.

- **Prevention or detection.** The strongest controls make the error impossible, or make it impossible to continue once the error is made. Weaker controls detect the error after it is made and signal it. Weakest of all are warnings and reminders, such as a sign above the bench or a colour code, which rely on the assembler noticing them.
- **Benign failure.** A good mistake-proofing feature fails safely: if the wrong thing is done, the result is an obvious, harmless stop, such as a part that will not go in, rather than a product that looks right and is not.

In design for assembly terms, prevention means designing the parts so that wrong assembly is impossible, and detection means a quick, certain check at or near the step where the error occurs.

### Why attention is not enough

It is tempting to treat assembly errors as lapses of care and answer them with training and reminders. The arithmetic of repetition says otherwise. This is an illustration. Revision B is built 6,000 times a year in six steps, which is 36,000 assembly actions. Suppose a careful, trained assembler makes a slip on only one action in 5,000, a rate few people would claim to beat on a repetitive task over a whole year. That is still about **7** errors a year at the bench. Revision A, at ten steps, gave about 12 opportunities a year at the same rate, before counting the steps that were genuinely awkward.

Training reduces the slip rate; it cannot make it zero, and it fades when people are tired, rushed, new or distracted. Prevention by design does not fade. That is why the review spent its effort on parts and fixtures first and on instructions last, and why the instructions that remain point to things the assembler can see, such as a green ring, rather than things the assembler must remember.

## Revision B's error opportunities

The team listed every way revision B could be built wrongly, and the control for each.

```figure
type: matrix
title: Revision B's error opportunities and their controls
x: Control: detection → prevention
y: Consequence if it escapes: minor → serious
hot: 3
caption: This is an illustration. The highlighted cell, a missing or cut O-ring, was first controlled only by a check at the function test; the failure case below shows why that was not enough.
- Serious, detected | knob not fully tightened: the clutch driver must slip before the unit can leave the fixture
- Serious, prevented | plunger reversed or bush not home: the bush will not pass a reversed plunger, and the press stops only at flush
- Minor at first, detected | missing or cut O-ring: harmless on the day, costly later when dirt gets in
- Minor, prevented | doubled spring seat or misaligned cross pin: both parts no longer exist
```

### Errors the design prevents

**A reversed plunger.** If the plunger goes into the body tail first, the 6 mm tail passes through the 8 mm nose bore, and the plunger seems to sit in place. But the nose, now at the rear, is 8 mm across, and the rear bush's bore is 6.5 mm. The bush cannot be pressed over it. The error stops the assembly at the next step, before any damage, which is a benign failure built into the geometry.

**A bush not fully home.** The press fixture's hard stop from Chapter 4 means the bush always ends flush. There is no "nearly home".

**A doubled or missing spring seat.** The part no longer exists.

**A misaligned cross pin.** The part no longer exists.

### Errors the design makes obvious

**A missing spring.** Without the spring, the plunger falls freely and the knob has no resistance. The assembler notices at once, and the function test's force check confirms it.

**A loose knob.** The clutch driver slips only when the knob reaches its set torque. The fixture is fitted with a simple switch that releases the unit only after the driver's clutch has slipped, so a knob that has not been driven home cannot leave the fixture.

### Errors that need a check

**A cut or missing O-ring** has no effect on whether the plunger works. It matters only later, when dirt and coolant get past the nose into the body. The first control was a visual check at the function test, which turned out to be the weakest point in the plan.

## Error-proofing the bench

Some controls belong to the way work is organised rather than to the parts.

- **Count balance.** Parts are issued to the bench in counted quantities for each batch of 200. At the end of the batch, every part's count should be zero. A leftover O-ring means a unit somewhere in the batch is missing one, and the batch is checked before it is packed. It costs nothing but a habit.
- **First-off check.** The first unit of every batch is checked in full, including a measured protrusion and force, before the rest are built, so a wrong batch of parts is caught at one unit instead of two hundred.
- **Fixture interlocks.** The fixture's switch that releases a unit only after the knob driver has slipped is an inexpensive interlock that turns a reminder into a prevention.

## Why the point of detection matters

The cost of an error grows with the distance it travels. This is an illustration at A$62 an hour. An O-ring noticed missing at the step where it is fitted costs about 30 s to correct, about **A$0.52**. The same unit found at the end of the bench needs the bush pressed out and the unit rebuilt, about 5 minutes or **A$5.17**. Found by a customer, it costs about **A$45** in handling, freight and a replacement, nearly ninety times the first figure, before counting the customer's own time and opinion. Every control in this chapter is an attempt to move detection towards the first of those three figures.

## A six-second function test

Every revision B unit goes through a function test fixture at the end of the bench. It replaced revision A's test, took the same 6 s, and checks more.

```figure
type: steps
title: Revision B's function test, about 6 s a unit
caption: This is an illustration. The fixture holds the body by its thread. Force limits are from the spring's specification: 25 N preload and 2.5 N/mm rate give 35 N at 4 mm of travel.
- Protrusion | nose must reach the 6.2 mm step of the gauge and not reach the 6.8 mm step
- Force | pull the knob 4 mm against a force gauge: 35 N ± 3.5 N, which proves the spring is present and correct
- Lock-out | pull, turn a quarter turn, release: the lug must rest on the face with the nose inside the body
- Release | turn back: the plunger must return fully to the protrusion gauge
- Seal | look for the O-ring at the nose
```

The force check is worth explaining. A spring with a preload of 25 N and a rate of 2.5 N/mm pushes with 25 + 2.5 × 4 = **35 N** after 4 mm of travel. A gauge reading in the band 31.5 to 38.5 N proves that the spring is present, that it is the right spring, and that the plunger is moving freely. A wrong spring, a missing spring or a plunger binding in its bore all fall outside the band.

## A failure case: the O-ring the test could not see

This is an illustration. In the first pilot batch of 50 revision B units, built with the new loading cone, one unit left the bench without its O-ring. It passed the function test: protrusion, force, lock-out and release were all correct, because the O-ring has nothing to do with them. The check "look for the O-ring at the nose" was the last line of the test, and the black O-ring against a dark blued steel nose was easy to miss in the bench lighting.

The missing O-ring was found by the company's own audit of five pilot units, a check that would not happen in normal production. The investigation found the O-ring still on the loading cone: the cone was slightly longer than it needed to be, and an O-ring could stay on its tip if the assembler lifted it away too quickly.

Three corrections followed, in order of strength.

1. **Prevent.** The loading cone was shortened so that its tip ends inside the O-ring's groove; an O-ring pushed down the cone has nowhere to go except into the groove.
2. **Make it obvious.** The O-ring was changed from black to green, at no change in price or material, so its presence at the nose can be seen from across the bench and its absence is obvious.
3. **Check it where it happens.** The assembler now checks for the green ring before dropping the plunger into the body, the step where it is fitted, not at the end of the bench.

The general lesson is that a function test catches only errors that affect function. Features whose job is protection, appearance or long life, such as seals, coatings, labels and lubricant, need their own controls, preferably at the point where they are fitted. The team went back through the error list after the pilot and marked every feature the function test could not detect. There were two: the O-ring and the grease on the plunger. The grease is now applied from a metered dispenser that delivers a fixed dot with each press, so its presence no longer depends on the assembler's judgment.

## What the defects are expected to cost

With the causes of three of revision A's four defects designed out, and the fourth controlled at the bench, the team estimated revision B's defect rates for its business case.

- rework about **0.3%**, 18 units a year at 5 minutes each, about **A$93**;
- returns about **0.1%**, 6 units a year at A$45 each, about **A$270**;
- total about **A$363** a year, about **A$0.06** a unit.

That is an estimate, not a measurement, and Chapter 8 compares it with the first months of production. Against revision A's A$1,182, it saves about **A$819** a year, a third as much again as the assembly labour saving from Chapter 4.

## How this applies to a small Australian business

List every way your product can be assembled wrongly, with what each costs if it escapes. Eliminate the parts that cause errors where you can. For what remains, prefer prevention by design, then detection at the step where the error happens, and treat signs and colour codes as the weakest control. Make wrong assembly fail early and harmlessly. Design a short function test that proves the product works, and add separate checks for anything whose job is protection rather than function. Count defects and their costs, because they belong in the business case for a redesign.

## Exercise: a different spring

The spring supplier offers a cheaper spring with a preload of **22 N** and a rate of **3.0 N/mm**, which the designer says is "close enough". What force would the function test read at 4 mm? Would it pass the 35 N ± 3.5 N check? What does that tell you about whether the substitution is acceptable?

**Worked answer.** At 4 mm the cheaper spring gives 22 + 3.0 × 4 = **34 N**, inside the band of 31.5 to 38.5 N, so it would pass the test. That does not make it acceptable. At full retraction of 8 mm it gives 22 + 3.0 × 8 = **46 N** against the original 45 N, so the pull force is similar, but when engaged it holds the nose in with only 22 N instead of 25 N, 12% less, which may matter to a customer whose fixture vibrates. The function test is designed to catch a missing or grossly wrong spring, not to approve a design change. A substitution like this goes back to the designer as a change to the specification, with the customer's application in mind, as the purchasing rule in Chapter 3 requires.
