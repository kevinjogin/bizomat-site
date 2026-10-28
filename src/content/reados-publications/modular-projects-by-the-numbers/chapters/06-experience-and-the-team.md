---
book: modular-projects-by-the-numbers
chapterSlug: experience-and-the-team
order: 6
title: "Experience, proven technology and keeping the team"
description: "Proven machines versus first-of-a-kind integration, borrowed cost ratios of 1.046 and 1.496 at P80, choosing an integrator, and the 346 hours a crew change cost."
draft: false
---

Chapter 5 showed the assembly hours for the end-of-line cell falling with each unit built, from 1,640 hours for the pilot to 1,030 hours for the sixth cell. That fall is experience expressed as a number. This chapter asks where the experience is held and how it is lost. Some of it is frozen into the equipment, in machines their makers have built hundreds of times. Some is held by the integrator as a firm, in its standard designs, test scripts and purchasing. A large part lives in one crew's hands and habits, and that part can leave the workshop on a Friday afternoon without anyone signing for it.

The chapter separates proven technology from first-of-a-kind integration and puts a borrowed reference class against each. It then covers how to choose an integrator for experience rather than price alone, how continuity and forgetting bend the learning curve, and how to write experience down so that it survives a change of people. The error case is a change of assembly crew after the sixth cell, which cost 346 hours on the next one.

## Frozen experience in proven components

A case erector bought from an established product line carries its maker's history: the design iterations, the field failures found and fixed, the suppliers qualified, the service manuals rewritten after real breakdowns. The buyer receives that experience frozen into the product. Buying a proven machine is buying a position far down someone else's learning curve, and paying for it in the price rather than in commissioning weeks.

The module defined in Chapter 2 was assembled on this principle. The case erector, case packer, checkweigher and palletising robot all come from established product lines. What is new is the integration: the transfers between the machines, the robot's gripper and layer patterns, the guarding layout, the controls that make the four machines behave as one cell, and the interfaces to each site. Risk concentrates where the work is new, so the useful rule is to be new only where newness buys something the outcome needs.

```figure
type: tree
title: Where the end-of-line cell is proven and where it is new
caption: This is an illustration. The machines carry their makers' experience; the integration is where the programme's own learning has to happen, first on the pilot and then on each rollout cell.
- End-of-line cell | one standard module, two case formats
  - Case erector | catalogue machine, proven
  - Case packer | catalogue machine, proven
  - Checkweigher | catalogue machine, proven
  - Robot palletiser | catalogue robot, proven; gripper and layer patterns new
  - * Integration | new: transfers, controls, HMI, guarding layout, safety functions
  - Site interfaces | new at each site: in-feed, power, air, floor, network
```

The cell's design deliberately avoided two kinds of newness that were offered during the design work: a gripper concept the integrator had not built before and a controls platform new to the business's maintenance staff. Each might have saved a little hardware cost. Each would also have moved part of the proven machinery into the first-of-a-kind column, where, as the next section shows, the outcomes are wider and almost always worse than planned.

## First of a kind and nth of a kind

The snack-food maker has no automation projects of its own to learn from: it has always packed by hand. It therefore borrows an outside view. [Choosing the reference class](/reados/publications/reference-class-forecasting-by-the-numbers/choosing-the-reference-class/) in *Reference Class Forecasting by the Numbers* builds a reference class of 24 projects for a different fictional business, a precision machining firm, and splits it by type. Two of its subclasses are relevant here. A cost ratio is the final cost divided by the budget approved at the decision to proceed.

This is an illustration. The machining firm's **five automation projects**, among them a robot deburring cell, a pallet pool and a collaborative robot loading two lathes, finished at cost ratios of 1.11, 1.15, 1.27, 1.45 and 1.68. All five ran over budget. Their median is **1.270** and their 80th percentile (P80) is **1.496**. Its **seven catalogue machines**, bought and installed, finished between 0.97 and 1.08, with a median of **1.020** and a P80 of **1.046**.

```figure
type: range
title: Borrowed cost ratios, median to P80
min: 0.9
max: 1.7
unit: ×
ticks: 0.9 | 1.3 | 1.7
caption: This is an illustration, borrowed from the machining firm's reference class in Reference Class Forecasting by the Numbers. Each band runs from the subclass median to its P80. The difference is not the price of the equipment but whether the work had been done before.
- Catalogue machines, 7 projects | 1.020 | 1.046 | highest ratio 1.08
- * Automation integration, 5 projects | 1.270 | 1.496 | highest ratio 1.68; all five over budget
```

The difference between the two bands is the difference between nth of a kind and first of a kind. A machining centre has been installed thousands of times; its rigging, foundations and commissioning are known work. Each of the automation projects was the first of its kind for that business, with a new gripper, new guarding and a new controls integration, and the overruns in the class came from exactly those items.

Apply the two classes to the case. A **bespoke cell** is first of a kind every time, because each is engineered for its own line. Its capital cost is engineering A$112,000, equipment A$520,000 and site work A$60,000, a total of **A$692,000**, excluding GST. At the automation median of 1.270, it would finish at **A$878,840**; at the P80 of 1.496, at **A$1,035,232**, which is A$343,232 above the estimate.

A **rollout cell** built to a design proven on the pilot looks more like a catalogue machine: the same drawings, the same software and the same test script as the cell before it. Cell 2's capital cost is hardware A$470,000, assembly of 1,360 hours at A$120, which is A$163,200, and site work A$25,000, a total of **A$658,200**. At the machine P80 of 1.046, it would finish at **A$688,477**, which is A$30,277 above the estimate.

```figure
type: compare
title: One cell's capital cost against the borrowed classes
cols: Estimate | At median ratio | At P80 ratio | Growth at P80
caption: This is an illustration, in A$ excluding GST. The bespoke cell is read against the automation class (1.270 and 1.496), the rollout cell against the catalogue-machine class (1.020 and 1.046).
- Bespoke cell, first of a kind | A$692,000 | A$878,840 | A$1,035,232 | A$343,232
- * Rollout cell 2, nth of a kind | A$658,200 | A$671,364 | A$688,477 | A$30,277
```

Three cautions keep this honest. First, the classes are borrowed from another business, and they are small: five and seven projects. They show the direction and rough size of the effect, not a forecast for this programme. Second, the design-once work and the pilot cell remain first of a kind and belong in the automation class; the benefit of nth-of-a-kind behaviour is earned only after the pilot has passed the acceptance tests of [Proving the pilot](/reados/publications/modular-projects-by-the-numbers/proving-the-pilot/) and the design is frozen. Third, reading the rollout cells against the machine class is an assumption, and Chapter 10 shows how the programme's own records replace it. A rollout cell whose design is changed for its site drifts back towards first of a kind, which is one reason the standard has to be kept.

## Choosing an integrator for experience

Most of the programme's learning happens in the integrator's workshop, so the choice of integrator is a choice about experience. The useful questions are concrete. How many cells of this kind, with this robot and this controls platform, has the firm built in recent years? Are the people who built them still employed, and will they be assigned to this programme? Does the firm keep hours by cell for repeated builds, and will it share them, so that its own learning curve can be compared with the planning curve of Chapter 5? Can the business visit a running installation and speak to its maintenance staff?

The answers matter more than a modest difference in the quoted price. An integrator new to the robot or controls platform turns the programme's integration back into first-of-a-kind work, and the borrowed ratios suggest that the gap between the classes at P80 is about 45 percentage points of capital cost (1.496 against 1.046). On the A$658,200 of a rollout cell, that gap is worth far more than most price differences between competent bids.

```figure
type: checklist
title: Questions for an integrator about experience
caption: Ticks are things to require; the cross is a choice to avoid; question marks are points to settle before signing. Safety competence is a requirement, not a scoring item.
- Comparable cells built on the same robot and controls platform | count, dates and reference sites
- Hours by cell for repeated builds | the integrator's own learning curve, set beside the planning curve
- Named lead fitter and supervisor for the programme | with notice and handover terms for any change
- Competent people for risk assessment and validation of safety functions | AS/NZS 4024 series; the model Code of Practice for plant
- x Lowest price from a firm new to the platform | buys first-of-a-kind risk at an nth-of-a-kind price
- ? Who keeps the build book and the jigs if the programme pauses
- ? Where spares and service come from, and how quickly, at each of the three sites
```

Experience on the owner's side counts too. The business's own maintenance technicians will look after twelve cells for many years. Sending two of them to the integrator's workshop for the builds of cells 2 and 3 and their factory acceptance tests costs some wages and travel, and places experience inside the business, where it supports every later installation and fault.

## Continuity and forgetting

The learning curve of Chapter 5 assumes that the same people keep building at a steady rhythm. The learning is held in practised sequences, in jigs and fixtures, in the layout of the assembly bay, in the order in which cables are pulled and in dozens of small decisions nobody wrote down. Two things erode it: gaps between builds and changes of people.

A gap lets skills fade and sends the crew to other work, from which it returns with other habits. A change of people loses the practised hand while keeping the drawings and the jigs. Neither returns the next build to unit 1, because the design is proven and the equipment for building it exists. A simple planning device is to treat the next build as an earlier **equivalent unit** on the curve. It is a way of putting a number on judgement, not a law of nature, and the right equivalent unit for a real crew should come from its own records.

This is an illustration. The case assumes that a new crew taking over after cell 6 builds its first cell at the hours of unit 2 on the planning curve (first unit 1,600 hours, 85% learning rate), **1,360 hours**, instead of the **1,014 hours** expected for unit 7. The extra is **346 hours**, which at A$120 an hour is **A$41,538**, about A$41.5k, on that one cell.

The loss does not stop at one cell if the new crew then learns along the curve from that point, building cells 7 to 12 at the hours of units 2 to 7. Those six cells would take 6,915 hours instead of 5,690, an extra **1,225 hours** or **A$146,947**.

```figure
type: bars
title: Extra assembly hours if a new crew relearns from the unit-2 position
unit: h
max: 400
caption: This is an illustration on the planning curve (1,600 hours, 85%). Each bar is the relearning crew's hours minus the planned hours for that cell. Rows are rounded; the unrounded total is about 1,225 hours, A$146,947 at A$120 an hour.
- * Cell 7, built as unit 2 | 346 | 1,360 h against 1,014 h
- Cell 8, as unit 3 | 254 | 1,237 h against 983 h
- Cell 9, as unit 4 | 200 | 1,156 h against 956 h
- Cell 10, as unit 5 | 165 | 1,097 h against 933 h
- Cell 11, as unit 6 | 139 | 1,051 h against 912 h
- Cell 12, as unit 7 | 120 | 1,014 h against 893 h
```

The shape matters as much as the total. The penalty is largest on the first cell after the change and shrinks as the new crew learns, but it never fully closes within the programme, because the new crew is always five units behind where the old crew would have been.

## Writing the experience down

Experience that lives only in people is lost when they leave. The defence is to move as much of it as possible into things that stay: documents, jigs and trained successors.

The **build book** is the main record. It sets out the assembly sequence for the cell with photographs, torque values, jig settings, cable schedules, loop-check sheets and the factory acceptance test script. It is written by the lead fitter, not by an office, and marked up after every cell: a step that took longer than it should, a part fitted in a better order, a check that caught a fault. Each revision is tied to the design baseline it describes, so that a fitter building cell 9 knows the book matches cell 9's drawings. Chapter 10 treats that link under configuration management.

Training turns the book into skill. A second fitter shadows the lead fitter through a full build before taking a section alone. Crews are changed one person at a time, never all at once, so that the practised hand and the new hand overlap. The jigs and the assembly bay layout stay together between builds, and are photographed and listed if they must be moved.

```figure
type: steps
title: Handing a build from one crew to another without losing the curve
caption: This is an illustration of a handover that keeps most of the learning. The overlap costs hours; a cold change costs more, as the error case shows.
- Bring the build book up to the current cell | every mark-up since the last revision entered and checked by the lead fitter
- Name the incoming people early | at least one full cell before the change
- Overlap on one complete build | incoming fitters work each section beside the outgoing crew
- Keep the jigs, bay layout and test equipment in place | photograph and list anything that must move
- * Track hours by stage against the curve on the first cell after the change | an early warning, not a report after the fact
- Review the first cell's FAT findings with both crews | add lessons to the build book before the next cell starts
```

## The error: a new crew after cell 6

This is an illustration. When cell 7, the first cell for site B, was due to start assembly, the integrator moved its experienced crew to a large job for another customer as each fitter finished his or her part of cell 6, and assigned a different crew to cell 7. The contract did not require notice of a crew change, and the integrator gave none. The new crew had the drawings and the jigs, but the build book had not been revised since cell 3, so most of what the first crew had learned on cells 4 to 6 was held only in their memories.

Cell 7 took **1,360 hours**. The planning curve expected 1,014 hours, and the curve fitted to cells 1 to 6 in Chapter 5, which forecasts 5,566 hours for cells 7 to 12 against the plan's 5,690, expected about 997 hours for cell 7 alone. Against the plan, the extra was **346 hours**, or **A$41,538**. The crew worked extra shifts to hold the shipping date, so the programme did not lose time, only money.

The overrun was found early because the business's engineer received the integrator's booked hours each week by build stage. By the time the frame and transfers were complete, the hours ran about a third above the curve for that stage, which no earlier cell had done. Asked why, the integrator disclosed the crew change. The factory acceptance test of cell 7 then produced a longer punch list than cell 6's, which confirmed the cause.

The correction had three parts. The first crew's lead fitter returned for cells 8 and 9 to work beside the new crew. The build book was brought up to date with the lessons from cells 4 to 7. The contract was varied to name the lead fitter and supervisor as key personnel, to require four weeks' notice of any change, and to require an overlap of one complete cell for any replacement. Had the new crew relearned from the unit-2 position through all six remaining cells instead, the loss would have been about **1,225 hours, A$146,947**, more than three times the cost of the first cell's lesson.

## Exercise: a pause between builds

The integrator proposes to pause the programme for six weeks between cells 8 and 9 to fit in another job, keeping the same crew. Assume the crew forgets enough that cell 9 takes the hours of unit 5 on the planning curve, and that cells 10, 11 and 12 follow on as units 6, 7 and 8. Every cell from 9 onward also starts its benefit six weeks later, at A$180,000 a year per cell. What does the pause cost, and which part of the cost is larger?

**Worked answer.** On the planning curve, units 5 to 8 take 1,097 + 1,051 + 1,014 + 983 = **4,145 hours**, against 956 + 933 + 912 + 893 = **3,694 hours** for units 9 to 12. The extra is 451 hours, which at A$120 is **A$54,113**. The weekly benefit per cell is A$180,000 ÷ 52 = A$3,461.54, so four cells starting six weeks late lose 4 × 6 × A$3,461.54 = **A$83,077**. The pause costs about **A$137,190**, and the delay is the larger part, which Chapter 8 explores further. Unless the integrator offers a price reduction of about that size, the business should decline the pause and ask the integrator to staff its other job without breaking up this crew.
