---
book: hand-forming-sheet-metal-by-the-numbers
chapterSlug: checking-noise-and-the-job-record
order: 8
title: "Checking, noise and the job record"
description: "Accept hand-formed parts on thickness, shape and finish, work out a hammering day's noise dose against the exposure standard, catch a noise reading taken in the wrong place, and close the job record."
draft: false
---

A hand-formed part is finished when it has been checked, not when the hammering stops. The customer's drawing for HF-01 sets three requirements, thickness, shape and finish, and each needs a measurement that can be recorded and repeated. The job also has two other outcomes that are easy to overlook: the hours it took against the hours planned, which decide whether the next quote is right, and the noise the worker absorbed, which decides whether the next job is done safely.

This chapter sets out HF-01's acceptance checks, works through a day of hand forming as a noise dose against the Australian exposure standard, records a noise reading that was taken in the wrong place, and closes the job with its hours against the plan.

## Acceptance checks

**Thickness.** Each dome is gauged with the ultrasonic gauge, calibrated on an offcut of the same sheet, at its top and at four points halfway down, at 90° intervals. This is an illustration. The first good dome, the one corrected for an over-sunk centre in Chapter 4, read 1.34 mm at its top and between 1.40 and 1.44 mm at the four mid points. The second read 1.37 mm at its top and between 1.41 and 1.45 mm at the mid points. Both pass the 1.3 mm limit, and both are close to the mean of 1.45 mm that Chapter 3 predicted for a 340 mm net blank, with the top thinnest as expected. The rings and panels, which are shrunk or barely stretched, are gauged at three points each as a record rather than a risk.

**Shape.** The domes are checked against their template across two diameters, within ±2 mm; the panels against their two templates, within ±1.5 mm; and the rings for roundness at top and bottom, within 1 mm, and for flange flatness, within 0.5 mm, as Chapters 5 and 7 describe.

**Finish.** The drawing asks for no visible hammer marks. That is a judgement, and the workshop makes it repeatable by fixing the conditions: the part is viewed under a raking lamp from about 1 m, in a darkened corner of the workshop, and any facet or mark that casts a visible shadow is planished out. A photograph under the same lamp goes on the job record.

Finish is the requirement most likely to cause a dispute, because "no visible marks" means different things to different people and under different light. The workshop agrees the standard with the customer before work starts, not at delivery. For HF-01, it planished a small offcut dome to the finish it intended to deliver and sent the customer a photograph under the raking lamp, with the viewing distance and lamp position stated. The customer accepted that sample as the standard, and the sample was kept in the workshop beside the job. At delivery, each dome was compared with the sample under the same lamp, which turned a matter of opinion into a comparison anyone could repeat.

The same approach suits any hand-formed finish: a reference sample, fixed viewing conditions and a photograph. It costs an hour at the start of a job and can save a rejected delivery at the end. It also protects the worker, whose finish is judged against an agreed sample rather than against a customer's memory of an original part made decades ago in a different workshop.

```figure
type: checklist
title: Acceptance record for one HF-01 housing set
caption: This is an illustration. One record per set, with photographs under the raking lamp. Readings are the second set's.
- x Dome thickness | top 1.37 mm; mid points 1.41 to 1.45 mm; limit 1.3 mm
- x Dome shape | within ±2 mm of template across two diameters
- x Ring | round within 1 mm top and bottom; flange flat within 0.5 mm
- x Panel shape | within ±1.5 mm of both templates; not loose when pressed
- x Finish | no marks visible under the raking lamp at 1 m; photographs filed
- x Assembly | dome seated on ring flange all round before drilling; rivets set
```

## Noise

Hand forming is loud. Hammering aluminium on a steel stake produces a sharp, ringing impact many times a minute, for hours, close to the worker's ears. Safe Work Australia's material, listed in the references, sets out the exposure standard for noise in Australian workplaces: an eight-hour equivalent level, LAeq,8h, of 85 dB(A), or a peak level of 140 dB(C). It also notes that 85 dB(A) is not a safe level for everyone, only the standard that must not be exceeded.

The eight-hour equivalent combines the levels and durations of a working day. Each 3 dB increase in level halves the time to reach the same dose: 85 dB(A) for 8 hours, 88 for 4, 91 for 2, 94 for 1, 97 for half an hour and 100 for a quarter of an hour.

```figure
type: bars
title: Time to reach the 85 dB(A) daily exposure standard, by level
unit: hours
max: 8
caption: Equal-energy rule with a 3 dB exchange rate. Time at a level divided by the allowed time gives that activity's share of the daily dose; the shares are added.
- 85 dB(A) | 8
- 88 dB(A) | 4
- 91 dB(A) | 2
- 94 dB(A) | 1
- *97 dB(A) | 0.5
- 100 dB(A) | 0.25
```

### The running case: a forming day

This is an illustration. A worker on HF-01 spends a day on 1.5 hours of sinking and raising at 97 dB(A) at the ear, 1.5 hours of planishing at 94 dB(A), 2 hours of wheeling at 80 dB(A) and 3 hours of marking, trimming, checking and other quieter work at about 75 dB(A). The shares of the daily dose are:

- raising and sinking: 1.5 / 0.5 = 300%;
- planishing: 1.5 / 1.0 = 150%;
- wheeling: 2 / 25.4 = about 8%;
- other work: about 4%.

The total is about 4.6 times the allowed dose, an LAeq,8h of 85 + 10 × log₁₀(4.62) = **91.6 dB(A)**, well over the exposure standard. Nearly all of it comes from the hammering, and nearly all of that from the raising. The KEVOS® [noise exposure check](/tools/noise-exposure-check/) does the same arithmetic for any mix of sources and times.

### Controls

Safe Work Australia's guidance ranks controls from eliminating or reducing the noise at its source, through engineering controls such as isolation and damping, down to administrative controls and, last, hearing protection. For a hand-forming workshop, that means:

1. **Quieter methods.** Sinking into a sandbag is quieter than on a hollowed block; nylon, rawhide or wooden mallets ring less than steel hammers on soft aluminium; the English wheel is far quieter than hammering for any shape it can make.
2. **Damping the stake and the work.** A stake mounted in a rubber-lined holder rather than clamped hard in a steel vice rings less, and a damping mat under the work reduces the panel's ringing.
3. **Separation.** Hammering in a screened bay keeps other workers out of the noise.
4. **Time.** Spreading the raising across days, rather than raising both domes in one session, reduces each day's dose.
5. **Hearing protection**, selected for the measured levels and worn for the whole of the loud work, as the last line of defence.

This is an illustration. With rubber-mounted stakes and nylon mallets, the workshop measured raising at 93 dB(A) and planishing at 91 dB(A). The same day's dose then falls to about 2.1 times the allowed dose, an LAeq,8h of **88.1 dB(A)**. That is a large improvement and still over the standard, so hearing protection remains necessary during hammering, and the workshop schedules raising sessions so that no worker does more than one in a day. The work health and safety regulations also deal with workers who must frequently wear hearing protection, including hearing tests; the workshop checks the current requirements in its own state with the regulator rather than relying on memory.

The peak level matters too. A single hard blow can produce a peak far above the average level. The workshop's meter recorded peaks of about 128 dB(C) during raising, below the 140 dB(C) peak standard, but that margin should be measured for each tool and stake, not assumed.

## The error: measured in the wrong place

This is an illustration. When the workshop first assessed its hand-forming noise, a supervisor stood a phone sound app on the bench about a metre from the raising stake and recorded 91 dB(A) during raising. On that figure, 1.5 hours of raising was 75% of a day's dose by itself, uncomfortable but apparently manageable with the rest of the day kept quiet.

The figure was wrong because of where it was taken. The worker's ear is about half a metre from the stake, not a metre. For a small source such as a stake and hammer, the level falls by about 6 dB for each doubling of distance, so halving the distance raises it by about 6 dB, to 97 dB(A). At 97 dB(A), the same 1.5 hours is 300% of the daily dose, four times what the supervisor's reading suggested. A phone app also has unknown accuracy; it is useful for finding loud activities, not for an assessment.

The workshop had the noise reassessed with a calibrated sound level meter held near the worker's ear position, and later with a personal dosimeter worn on the worker's shoulder through a full forming day, which measured an LAeq,8h close to the calculated 91.6 dB(A). The lesson recorded was that **noise exposure is measured at the ear**, with an instrument whose accuracy is known, and that the distance between a hammer and an ear is short enough for a few tens of centimetres to change the answer by a factor of four.

## Hands, backs and the rest

Noise is the most measurable hazard of hand forming, not the only one. Pneumatic planishing hammers transmit vibration to the hands and arms, which over time causes damage to nerves and blood vessels, and their use should be limited and managed with the tool's vibration data. Repetitive hammering strains wrists, elbows and shoulders, and the remedy is the same as for noise: quieter, lighter tools, rotation between tasks and planned rest. Cut sheet edges cut hands, so blanks are deburred before forming and gloves are worn for handling. Hot aluminium after annealing looks exactly like cold aluminium, so annealed parts are marked and left on a dedicated rack to cool. Each of these belongs in the workshop's risk assessment for hand forming.

## The job record

This is an illustration. The quote for HF-01 was built on 20 hours of forming for the two housings: 5.0 hours per dome, 2.5 per ring and 2.5 per panel. The hours booked tell a different story.

```figure
type: compare
title: HF-01 forming hours, planned against booked
cols: Planned | Booked | Where the difference went
caption: This is an illustration. Booked hours include the scrapped first dome and first ring and the corrections described in Chapters 3 to 7. Labour at A$95 an hour, excluding GST.
- Domes | 10.0 h | 14.5 h | scrapped 340 mm blank (4.0 h); over-sunk centre corrected (0.7 h)
- Rings | 5.0 h | 7.1 h | ring folded over by large bites (1.5 h); wired edge corrected (0.7 h)
- Panels | 5.0 h | 5.65 h | loose panel corrected (0.75 h); second panel under plan
- *Total | 20.0 h | 27.25 h | 7.25 h over, A$688.75 of labour
```

The job lost money on its first parts. But the record shows that the losses came from first-off errors, each now corrected in the workshop's method, and that the second dome, ring and panel each came in at or under plan: 4.8, 2.4 and 2.4 hours, 9.6 hours for the set against 10.0 planned. The workshop's estimate per set was sound; what it lacked was an allowance for learning on a part type it had not made before.

The record also shows where the errors were caught. Two were caught by checks built into the method, the template after two raising courses and the ring's diameters at top and bottom, and cost well under an hour each to correct. The two that scrapped parts, the blank cut with no trim allowance and the flange bitten too hard, were caught only when the damage was done, because no check existed at that point. Each of those now has one: the planning sheet's cut size in bold, and the measured bite size on the shrinker. The pattern is general to hand forming. Errors found by a check during forming are corrected; errors found at the end are scrapped.

The workshop's quoting template now carries a first-off allowance for any hand-formed part it has not made in the past year, set from records like these. For HF-01's set, the allowance would have been about 7 hours. The planning sheets, trial strips, templates and noise measurements are filed with the job, so that a repeat order starts from the second set's numbers, not the first's.

## Exercise: a repeat order

The customer orders two more housings a year later, to the same drawing.

1. Using the second set's booked hours, what forming labour would you quote per set and for the two sets, excluding and including GST?
2. Using the controlled noise levels, how should the raising and planishing be scheduled so that no day's dose exceeds the standard without hearing protection being relied upon for more than the hammering itself?

**Worked answer.**

1. The second set took 9.6 hours, so about **9.6 hours per set**, or 19.2 hours for two: 19.2 × 95 = **A$1,824** excluding GST, **A$2,006.40** including GST. A prudent quote might round up to the planned 10 hours per set, A$1,900 excluding GST, since the worker on the repeat order may not be the one who made the second set.
2. At 93 dB(A), the allowed time is 8 / 2^((93 − 85) / 3) = 1.26 hours, and at 91 dB(A) it is 2 hours. One dome's raising, about 1.6 hours, is already more than a full day's dose at 93 dB(A) by itself, so no schedule makes hammering compliant without hearing protection. The aim is to keep the protected time short and the unprotected time quiet: one dome's raising per day, its planishing on a different day, wheeling and the quieter work in between, hearing protection worn throughout every hammering session, and a check of the levels after any change of stake, mallet or bench.
