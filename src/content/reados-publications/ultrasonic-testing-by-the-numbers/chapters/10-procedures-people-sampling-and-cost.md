---
book: ultrasonic-testing-by-the-numbers
chapterSlug: procedures-people-sampling-and-cost
order: 10
title: "Procedures, people, sampling and cost"
description: "What a written ultrasonic procedure must fix, how inspectors are qualified, what a 10% weld sample really protects against, random selection, trustworthy records and what testing costs."
draft: false
---

Every chapter so far has ended with a mistake that a written rule would have prevented: a velocity carried over, a coating measured in the wrong mode, a reading taken hot, a doubled echo, a marker lost, a minimum misread, a worn wedge, a missing transfer correction, a sensitivity without attenuation. Ultrasonic testing depends on dozens of settings and judgements, and a result is only as good as the weakest of them. The procedure, the people who apply it, the sampling that decides what gets tested and the records that show what was done are what turn a skilled measurement into a decision that others can rely on.

This chapter sets out what the mill's procedures fix, how its inspectors are qualified, what a 10% sample of welds actually protects against, and what the slack season's testing costs, and it finishes with a sample that was not random.

## The written procedure

A procedure is the agreed method for one kind of test on one kind of item. It is written by a person qualified to level 3 in the method, approved by the client where the contract requires, and followed by the technician performing the test. The mill has four: thickness surveys of piping and vessels, angle-beam testing of butt welds in ferritic steel, straight-beam testing of roll shafts, and lamination checks of plate.

```figure
type: checklist
title: What each of the mill's ultrasonic procedures fixes
caption: Every item answers a mistake in an earlier chapter. The open item is this chapter's mistake.
- x Scope and standards | items covered; the standards and specification the test is done to, such as ISO 16809 or AS 2207
- x Equipment | instrument, probe types, frequencies, sizes and angles; couplant; reference blocks
- x Calibration and checks | velocity, zero, angle, index and DAC; when they are checked and what drift is allowed (Chapters 1, 4, 7, 8)
- x Surface and temperature | preparation, coating mode, temperature limits and correction (Chapters 2 and 4)
- x Sensitivity | reference reflector, transfer correction, attenuation correction, scanning gain (Chapters 8 and 9)
- x Coverage | CMLs and bands, scan pattern, probe directions, both legs, both sides (Chapters 5 and 7)
- x Evaluation | recording and acceptance levels, sizing method, characterisation
- ? Selection of items when sampling | random selection by the client, not by the contractor
- x Records | what the report must contain for the result to be checked and repeated
```

The procedure is not a summary of a standard. A standard such as AS 2207 or ISO 17640 sets out methods and options, and a procedure chooses among them for the job: which probe angles, which reference block, which testing level. Where a standard offers a choice, a procedure that does not make it leaves the choice to whoever is holding the probe on the day.

## The people

Personnel performing ultrasonic testing are normally certified under ISO 9712, which Australia has adopted as AS ISO 9712, through a certification body that examines their knowledge and practical skill and verifies their training and industrial experience. The standard defines three levels.

```figure
type: layers
title: Levels of qualification under ISO 9712
caption: A summary of the roles; the standard and the certification body's scheme set the full requirements for training, experience, examination and recertification.
- Level 1 | performs tests and records results under a written instruction and the supervision of level 2 or 3; does not evaluate
- Level 2 | sets up and calibrates equipment, performs and supervises tests, interprets and evaluates results against the procedure, writes reports
- Level 3 | writes and approves procedures, interprets standards and specifications, chooses methods and techniques, reviews level 2 work
```

At the mill, the inspection contractor's level 2 technician performs the surveys and weld tests and signs the reports. The contractor's level 3 writes and approves the procedures and reviews every weld report and every report that leads to a repair or a change of interval before it is issued, which is how the missing transfer correction of Chapter 8 was caught. The mill's reliability engineer is not certified in the method and does not need to be; the engineer's role is to understand what the results mean, ask the right questions and decide what to do, which is what this book has tried to support.

Certification does not cover everything. A technician certified in weld testing may have little experience of long-path forgings, and the procedure and the level 3's review are what bridge the gap. The mill now asks for evidence of relevant experience, not just a certificate, when the contractor assigns someone to the shaft.

## What a 10% sample protects against

The mill's new juice heater bypass, fabricated by a contractor, has 120 butt welds in DN100 pipe. The specification called for 10% of welds to be tested ultrasonically, with the lot accepted if all the tested welds pass. That is a sampling plan with a sample of 12 and an acceptance number of zero, and the [acceptance sampling OC tool](/tools/sampling-oc/) shows what it does.

```figure
type: compare
title: What a sample of 12 welds with zero allowed rejects actually accepts
cols: Probability the lot is accepted | Probability the lot is rejected
rowhead: True share of defective welds in the lot
- 1% | 88.6% | 11.4%
- 5% | 54.0% | 46.0%
- 10% | 28.2% | 71.8%
caption: This is an illustration. Binomial model from the acceptance sampling OC tool and the acceptance sampling plan tool. With a lot of 120 and a sample of 12, the hypergeometric model would give slightly more protection; the binomial figures are a cautious approximation.
```

A lot with one weld in twenty defective, six of the 120, is accepted more often than not. A lot with one in ten defective, twelve welds, is accepted 28% of the time. A 10% sample is not a check that each weld is sound; it is a check on the welder's or contractor's process, and a weak one at that.

The [acceptance sampling plan tool](/tools/acceptance-sampling-plan/) designs a plan for stated risks. Asking for a lot at 1% defective to be accepted at least 95% of the time, and a lot at 10% defective to be accepted no more than 10% of the time, gives a sample of 52 with up to 2 rejects allowed, and confirms that the plan of 12 with none allowed meets neither requirement: it accepts only 88.6% of good lots and 28.2% of bad ones. For 120 welds, a sample of 52 is already 43% of the lot.

### Choosing between sampling and testing everything

The comparison that matters is cost. At the contractor's illustrative rate of A$65 per weld for ultrasonic testing with reporting, testing all 120 welds costs A$7,800, a sample of 52 costs A$3,380 and a sample of 12 costs A$780. A leaking weld in the juice heater bypass during the crushing season would stop that part of the factory for a repair, at a cost the mill estimates in tens of thousands of dollars an hour of lost crushing. Against that, the A$7,000 difference between a 10% sample and 100% testing is small. The mill now specifies 100% ultrasonic testing of butt welds in juice and steam service, and uses sampling only for welds where a failure would be cheap and safe to repair.

## The mistake: a sample that was not random

When the bypass's 12 sample welds were tested, all passed, and the lot was accepted. At the mill's handover audit, the reliability engineer asked how the 12 had been chosen. The contractor's supervisor had chosen them, and all 12 were shop welds made in the flat position on a rotator, the easiest welds on the job. None of the 30 field welds made in position on the pipe rack, which are harder to make and more likely to contain defects, had been tested.

```figure
type: steps
title: Repairing a biased sample
caption: This is an illustration. A sample chosen by the party whose work is being checked is not a random sample, and the probabilities in the OC table do not apply to it.
- Sample of 12 chosen by the contractor | all shop welds in the flat position; all passed
- Audit question | how were the 12 chosen? None of the 30 field welds was in the sample
- Field welds sampled at random by the mill | 8 drawn from the 30 by random numbers; 2 rejected, both for lack of root fusion
- * Decision | all 30 field welds tested: 4 rejected in total, repaired and retested clear
- Procedure changed | the client selects sample items at random and tells the contractor after welding
```

A sample tells you about the population it was drawn from. Twelve shop welds said something about the shop welds and nothing about the field welds. When eight field welds were drawn at random by the mill, two were rejected for lack of root fusion, and testing all 30 found four. The repair took two days before commissioning, rather than an unplanned stop in the crushing season. The procedure now says that the client selects sample items at random, by numbering the welds and drawing random numbers, and that the contractor learns which welds are to be tested only after welding is complete.

## Detection is a probability too

The sampling calculation assumes that every defective weld in the sample is found. No test does that. Whether a given flaw is detected depends on its size, orientation, position and type, on the surface, on the technician's care on the day, and on chance. The usual way to describe a test's capability is a probability of detection curve: the probability that a flaw of a given size is found, rising from near zero for very small flaws towards, but never quite reaching, one for large ones. Such curves are measured by testing many specimens containing flaws of known sizes, with many inspectors, and they are often summarised by the flaw size found with 90% probability at 95% confidence.

For most plant inspection, nobody has measured a probability of detection curve for the exact procedure, material and geometry, and the honest statement is qualitative. The mill's weld procedure is expected to find lack of fusion and slag of the sizes its acceptance levels address with high probability, because the reference reflectors, sensitivity and coverage were chosen for that. It is not expected to find every small pore or a tight crack lying at an unfavourable angle. When a decision rests on finding small flaws reliably, as for a shaft that would wreck the mill if it broke, the right response is to add capability: inspect the critical areas from more than one direction, use a second method such as magnetic particle testing of the fillets when the roll is out of the mill, and shorten the interval so that a crack missed once can be found before it is critical.

The sampling and detection probabilities multiply. A sample of 12 that accepts a 5% defective lot 54% of the time does so on the assumption of perfect detection; with imperfect detection, the chance of accepting a bad lot is higher still.

## The reviewer's questions

The level 3's review is the last defence, and most of the mistakes in this book were caught there or at a similar review by the reliability engineer. The questions are short and they recur.

Does the result make physical sense? Walls do not grow; elbows do not wear more slowly than the straights beside them; a depth cannot exceed the thickness. Is every number that the result depends on recorded, and was it measured on the day: velocity, zero, angle, index, DAC, transfer correction, attenuation, temperature? Does the coverage match the procedure, both legs, both sides, every band? Were sample items chosen at random by someone other than the party whose work is being checked? Would another technician, given this report, be able to repeat the test and compare?

A report that answers all of those questions quickly is one the inspection body, the client and the next technician can trust. One that cannot answer them is a measurement whose value nobody can establish, however skilled the person who made it.

## Records that can be trusted

A report is the only part of a test that survives the day. It must let a reviewer check the result and let a later technician repeat the test and compare. The mill's reports record, for every test: the procedure and its revision; the technician's name and certification; the instrument, probe and serial numbers; the reference blocks; the calibration and check readings with times; the couplant, surface condition and temperature; the transfer correction; the scan coverage; and every recordable indication with its position, level, length and characterisation, as well as the acceptance decision. For thickness surveys, every CML reading is recorded, not just the minimum, together with the position of the minimum on scanned bands.

```figure
type: stats
title: The slack season's ultrasonic testing at the mill
caption: This is an illustration. Costs are the contract's illustrative rates, excluding GST; they are not market prices.
- 13 CMLs | juice line survey, including the new reducer: half a day
- 30 points + 2 scans | V-12 shell grid, heads and impingement area: one day
- 2 welds | V-12 insert plate, tested, repaired and retested: two days in total
- 4 positions | No. 3 roll shaft from the end face, both fillets and the shrink-fit edge: half a day
- 120 welds | juice heater bypass, 100% after the audit: four days
- about A$14,000 | total testing cost for the season, a small fraction of one day's lost crushing
```

## Learn, apply, improve

The numbers in this book come from physics that is simple at its core: sound travels at a speed set by stiffness and density, reflects where the impedance changes, spreads and weakens with distance. Every practical rule follows from that and from the measurements that confirm it on the actual part: calibrate velocity on the same material, time echoes not coatings, correct for temperature, check angles on blocks, compare echoes with references at the same distance through the same surface, measure attenuation where the path is long, and sample at random. The mill's experience, illustrative as it is, shows that most errors in ultrasonic testing are not failures of the method but omissions of one of those steps, and that each is caught by a reviewer asking a simple question about whether a result makes physical sense.

## Exercise: sampling the spool welds of a smaller job

A second contractor is fabricating 40 butt welds for a new syrup line, where a leak would be messy but not hazardous and could be repaired at the next weekly stop. The specification offers a sample of 8 welds with no rejects allowed. Using the binomial model of the acceptance sampling OC tool, calculate the probability of accepting a lot in which 5% and 15% of welds are defective. Then say whether the plan is reasonable for this line and what else the specification must say for the numbers to mean anything.

### Answer

**Given:** lot 40 welds; n = 8; c = 0; p = 5% and 15%.

**Assumptions:** binomial model; welds sampled at random; each defective weld detected by the test.

**Method:** probability of acceptance with c = 0 is (1 − p)ⁿ.

**At 5% defective:** (0.95)⁸ = 0.663, so the lot is accepted 66.3% of the time.

**At 15% defective:** (0.85)⁸ = 0.272, so it is accepted 27.2% of the time.

**Is the plan reasonable?** For a line where a leak is safe and cheap to repair at a weekly stop, a plan that catches a badly performing contractor about three times in four, and a moderately performing one about one time in three, may be acceptable as a check on the contractor's process, provided every rejected weld leads to more testing. It would not be reasonable for juice or steam service, where the mill tests every weld.

**What the specification must also say:** that the client selects the 8 welds at random, after welding; that any reject triggers testing of further welds, for example two more by the same welder for each reject, or all of that welder's welds; and that the welds include field welds in proportion to their number. Without random selection the probabilities above do not apply.

**Verification:** the acceptance sampling OC tool with n = 8, c = 0 gives 66.3% at p = 5% and 27.2% at p = 15%, matching the hand calculation. With 40 welds and a sample of 8, the lot is under ten times the sample, so the hypergeometric model would give slightly more protection than these figures.
