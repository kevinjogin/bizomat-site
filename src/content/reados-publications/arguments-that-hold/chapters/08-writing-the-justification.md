---
book: arguments-that-hold
chapterSlug: writing-the-justification
order: 8
title: "Writing an engineering justification that holds"
description: "How to set out a conclusion as claim, grounds, warrant, backing, qualifier and rebuttal, why a test plan's own model is a warrant to check, and how to write a decision record that survives review."
draft: false
---

An investigation ends in a decision, and a decision needs a justification that someone else can read, challenge and rely on. Most engineering justifications are written in a hurry, after the work is done, and they show it: a confident conclusion, a list of things that were checked, and no account of why the checks support the conclusion or where the conclusion stops being true.

This chapter shows how to write a justification that holds up. It uses a layout adapted from the philosopher Stephen Toulmin, who described how practical arguments are actually structured. It then examines a test that the depot's purchasing manager wants before signing off the fix, and shows that the test's own model is a warrant whose conditions do not hold for gear fatigue. It ends with the depot's final justification, and a short summary of the habits the book has built.

## Six parts of a practical argument

In *The Uses of Argument*, Toulmin observed that real arguments in law, science and practical life have more parts than a syllogism. Adapted for engineering, a justification has six:

- **Claim.** The conclusion being put forward, stated as a checkable proposition (Chapter 1).
- **Grounds.** The facts and measurements offered in support.
- **Warrant.** The principle that connects the grounds to the claim: what Chapter 5 called the answer to "in virtue of what does this follow?"
- **Backing.** The reason to accept the warrant: a standard, a validated model, a body of test data, an established principle.
- **Qualifier.** How strongly the claim is made: certainly, probably, presumably, for these conditions.
- **Rebuttal.** The circumstances in which the claim would not hold.

The last two are the parts most often left out, and the parts that most improve a justification. A qualifier tells the reader how much weight the claim will bear. A rebuttal tells them what to watch for. Together they turn a verdict into something a later engineer can use.

## The failure case: the first draft

This is an illustration. The maintenance supervisor's first draft of the close-out report reads:

> Root cause: soft pinions from the new supplier. Hard pinions fitted. Drive is now reliable. No further action required.

Set against the six parts, the draft is almost all claim. Its grounds are one fact. It has no warrant, so nobody can see why hard pinions would make the drive reliable. It has no qualifier, so "reliable" is asserted without limits. It has no rebuttal, so nobody knows what would show it wrong. And its claim is incomplete: it leaves out the misalignment that Chapter 7 found to be a needed condition, so the fix it describes would probably have failed in time.

### How it is detected and corrected

A reviewer who asks for each of the six parts finds the gaps immediately. "What is the warrant?" has no answer. "Under what conditions would this be false?" exposes the alignment: a hard pinion on a misaligned drive. The correction is not to soften the language but to rebuild the argument from the investigation's actual findings, which is what the rest of this chapter does.

## The purchasing manager's test

Before approving the return of C1 to full throughput, the purchasing manager asks for proof that the fix works. She proposes a reliability demonstration: show, with 90% confidence, that the drives now achieve a mean time between pinion failures of at least 2,000 hours, with zero failures allowed, using C1 and C2 over the next 28 days.

The [reliability demonstration test plan tool](/tools/reliability-demonstration-test/) in BIZOMAT Tools works out the test length for that kind of demonstration. For equipment with a constant failure rate, the exponential or homogeneous Poisson process model, it gives the chi-square test-length factor for the chosen confidence and number of allowed failures, the total unit-hours needed, the hours per unit, and the calendar days at the stated running hours, and compares them with the days available. It warns that the failure rate must be roughly constant, with no early-life or wear-out failures in the test window.

With an objective of 2,000 hours, 90% confidence, zero failures, two units and 20 running hours a day, the tool gives a test-length factor of **2.303**, a total of **4,605 unit-hours**, 2,303 hours per unit and **115.1 calendar days**. Against 28 days available, it reports that the test is too long and suggests putting nine units on test.

```figure
type: compare
title: Reliability demonstration plans for an MTBF of 2,000 hours at 90% confidence
cols: Failures allowed | Units | Unit-hours | Calendar days
caption: This is an illustration. Results from the reliability demonstration test plan tool at 20 running hours a day. Allowing a failure lengthens the test, because the evidence then has to outweigh it.
- Proposed plan | 0 | 2 | 4,605 | 115.1
- One failure allowed | 1 | 2 | 7,779 | 194.5
- Tool's suggestion to fit 28 days | 0 | 9 | 4,605 | 25.6
```

Allowing one failure, which might seem to make the test easier, lengthens it to 7,779 unit-hours and 194.5 days, because the test must then accumulate enough failure-free time to outweigh the failure. The depot has two conveyors, not nine. On the numbers alone, the demonstration cannot be done in four weeks.

## Whence the warrant? The test's own model

The numbers are not the most important problem with the purchasing manager's test. The test is an argument too:

- **Grounds:** no failures in so many unit-hours.
- **Claim:** the mean time between failures is at least 2,000 hours, with 90% confidence.
- **Warrant:** failures occur at a constant rate, so every hour of running carries the same chance of failure, and failure-free hours accumulate evidence evenly.

Ask Abelard's question of it. In virtue of what does a run of failure-free hours support the claim? Only in virtue of the constant-rate warrant. And that warrant does not hold for gear tooth fatigue. Fatigue is a wear-out mechanism: damage accumulates with load cycles, and the chance of failure rises with age. A new pinion is least likely to fail in its first weeks, whatever its eventual life. Twenty-eight days, or even 115, without a failure is just what both a sound pinion and a marginal one would show early in life. The tool flags exactly this limit in its own output.

There is a second problem with the warrant: the test pools C1 and C2 as if they were identical units, and Chapter 5 showed they are not. They carry different loads and, until C1 is realigned, have different alignment.

So the demonstration, even with enough units and time, would not support the claim the manager wants. This is the most general lesson of the book in its sharpest form. **A calculation tool is an argument, and its model is its warrant.** A correct calculation with a model whose conditions do not hold supports nothing. The question "whence the warrant?" applies to tools as much as to people.

The depot does not abandon evidence from running. It changes what that evidence is used for: not to demonstrate a mean life, but to check that the conditions the fix relies on stay in place.

### What running evidence does support

Failure-free running cannot demonstrate a fatigue life, but it can support other, narrower claims well. The depot plans its inspections around those claims.

- **Alignment has held.** A contact-pattern check after four weeks, about 560 running hours, shows whether the realignment has stayed put through the drive's first loading. That is a direct check of a ground in the justification.
- **No cracks have started.** A dye-penetrant inspection of the tooth roots at the coupling end, where the earlier cracks began, looks for the earliest stage of the failure mode itself. At four weeks each tooth has seen about 49 million load cycles, more than the soft pinions on misaligned C1 survived. A clean result does not prove the pinion will last, but it is diagnostic in a way that "no failures yet" is not: it looks for the damage, not just for its end result.
- **The duty is as assumed.** Power logs confirm that the measured 12.4 kW, on which the stress check rests, still describes the drive.

Each inspection checks a specific condition the justification relies on. That is how running evidence should be used under a wear-out mechanism: to confirm the warrant's conditions, not to count failure-free hours as if they were evidence of life.

## The depot's justification

The reliability engineer writes the final justification for returning C1 to full throughput in the six-part layout.

```figure
type: layers
title: Justification for returning C1 to full throughput
caption: This is an illustration. Each layer is drawn from an earlier chapter. The qualifier and rebuttal make the claim usable: they say how far it reaches and what would show it wrong.
- Claim | with the corrective actions in place, C1 can run at its extended duty without the conditions that caused the pinion failures
- Grounds | every replacement pinion measured 280 to 320 HB at the tooth; C1 realigned with full-face contact; steady duty 12.4 kW measured; soft starter fitted
- Warrant | root bending fatigue life depends on root stress relative to the material's strength; full-face contact keeps stress near the full-face value, 76.0 MPa against 120 MPa allowable in the screening check
- Backing | Lewis screening check; full rating of the gear set to ISO 6336 by the drive maker, received and filed
- *Qualifier | for the measured duty, the verified pinion lot and the corrected alignment; not a demonstrated life
- Rebuttal | the claim fails if alignment drifts, an unverified pinion is fitted, steady duty rises well above 12.4 kW, or inspections find root cracking
```

The rebuttal line is backed by actions, so that each condition that would defeat the claim is watched:

- the contact pattern and tooth roots are inspected at four weeks and three months, then at each routine service;
- every pinion is hardness-checked on receipt, and the drawing's acceptance note now requires evidence for each requirement (Chapters 2 and 4);
- C1's power is logged, with an alert if steady duty exceeds 13.5 kW for more than a shift;
- the drive base grout and hold-down bolts are checked at the three-month inspection, since movement of the base caused the misalignment.

The justification also records what was ruled out and why, so the questions do not reopen: the lubricant (no mechanism, clean flanks, no effect on C2), a fillet defect (fillet within drawing), and overload as a sole cause (failure with the 11 kW motor refitted, full-face stress well under the allowable). And it records the investigation's honest uncertainty from Chapter 6: because the pinions, alignment and starter were corrected in one shutdown, the result will show that the combination works, not which correction mattered most.

The purchasing manager approves on that basis. Her concern was legitimate: she wanted evidence that the fix works. The justification gives her better evidence than the demonstration could have, and tells her what will be watched to keep it true.

## Write for the reviewer

A justification is written for someone who was not in the investigation and has less time than the investigator. A few practical rules help it survive that reader.

- **Put the claim first,** in one sentence, with its qualifier attached. The reviewer should know within ten seconds what is being asked of them.
- **Keep the six parts visible,** as headings or a table, so that a missing part is obvious rather than hidden in prose.
- **Point to the record** for detail: the claims register, the hypothesis table, the calculations and the tool inputs. The justification summarises; the record proves.
- **State what was ruled out,** briefly, so the reviewer does not raise questions that have already been answered.
- **Avoid words that substitute for evidence,** such as "obviously", "clearly" and "as expected". If something is clear, the grounds will show it.

A justification that follows these rules is usually a page long. It takes longer to write than the supervisor's four-line draft, and much less time to review, because the reviewer can see at once where to look and what to challenge.

## Who signs

A justification supports a decision; it does not make one. At the depot, the return to service is approved by the engineering manager under the site's procedure for equipment modifications, with the drive maker's rating as backing. Where a decision affects safety, the person who signs must be competent to judge the warrant and the backing, not just the conclusion. A well-structured justification makes that judgement possible, because it puts the warrant and its limits on the page.

## The habits, in brief

The eight chapters reduce to a handful of habits that apply far beyond gear drives.

```figure
type: checklist
title: Habits for arguments that hold
caption: Each habit corresponds to a chapter. Together they turn a meeting's opinions into a justification someone else can check.
- x Make every claim checkable: subject, measure, limit, condition, method (Chapter 1)
- x Read conditions exactly: sufficient, necessary, only if, unless (Chapter 2)
- x Test the form before the facts; write hidden premises down (Chapter 3)
- x Match the quantifier to the evidence: one counterexample refutes all; a quiet period proves little (Chapter 4)
- x Ask what warrants each inference, including a tool's model (Chapters 5 and 8)
- x Demand a mechanism and a control before accepting a coincidence (Chapter 6)
- x Test every hypothesis against diagnostic evidence; look for sets of conditions (Chapter 7)
- x Write claim, grounds, warrant, backing, qualifier and rebuttal (Chapter 8)
```

## Exercise: rewrite an overconfident claim

A contractor's report on a different drive at the depot concludes: "New coupling fitted. Vibration now 1.9 mm/s, down from 4.2 mm/s. Problem solved."

Rewrite it in the six-part layout, supplying a warrant, a qualifier and a rebuttal that the evidence can support. State one further piece of evidence that would strengthen the backing.

**Worked answer.** One good rewrite:

- **Claim:** fitting the new coupling has reduced the drive's overall vibration to an acceptable level for its current duty.
- **Grounds:** overall vibration velocity fell from 4.2 mm/s to 1.9 mm/s after the coupling was replaced, measured at the same point, speed and load.
- **Warrant:** a worn or damaged coupling transmits misalignment and unbalance forces to the bearings, so replacing it reduces vibration from that source.
- **Backing:** the old coupling's condition on removal, if recorded; the site's vibration acceptance limit for this class of machine.
- **Qualifier:** for the measured speed and load, immediately after the change.
- **Rebuttal:** the claim fails if the reduction came from a different change made at the same time, for example a realignment done while the coupling was off, or if vibration rises again as the new coupling's elements bed in.

The further evidence that would most strengthen the backing is a **vibration spectrum** before and after, showing that the frequency components associated with the coupling and misalignment, rather than some other source, are the ones that fell. A single overall reading shows that vibration fell; a spectrum shows why, which is what the warrant claims. And because the contractor may also have realigned the shafts while fitting the coupling, the report should say so: as with the depot's combined fix, it would then show that the work as a whole succeeded, without claiming which part did it.
