---
book: machine-noise-control-by-the-numbers
chapterSlug: daily-exposure-and-the-duty-to-control
order: 4
title: "Daily exposure and the duty to control"
description: "Work out a worker's eight-hour noise exposure and dose, compare it with the exposure standard, apply the hierarchy of control, set a design target, and catch a shift averaged in plain decibels."
draft: false
---

Noise damages hearing through the total sound energy a person's ears receive, accumulated over hours and years. A short period at a very high level can deliver as much energy as a whole shift at a moderate one, and the damage is permanent. Workplace noise is therefore judged by a daily exposure: the steady level that, over an eight-hour day, would deliver the same sound energy as the worker's real, varying day. That single figure is what the exposure standard is set against, and what a noise control design must bring down.

This chapter explains the eight-hour equivalent level and the daily dose, the exposure standard set by the work health and safety regulations, the peak limit, the hierarchy of control and the limits of hearing protectors, and how to turn an exposure into a design target for the controls. The running case finds that the fitter's exposure was first estimated by averaging decibels arithmetically over the shift, which gave 84.2 dB(A) and an apparent pass, when the correct energy average was about 86.1 dB(A).

## The eight-hour equivalent level

A worker's day is made of periods at different levels. The **eight-hour equivalent continuous A-weighted sound pressure level**, written L_Aeq,8h, combines them on an energy basis and normalises the result to an eight-hour day.

```figure
type: formula
title: Eight-hour equivalent level from a day's periods
formula: L_Aeq,8h = 10 × log₁₀( (1 ÷ 8) × Σ tᵢ × 10^(Lᵢ ÷ 10) )
caption: This is an illustration for the fitter: six hours at the bench at 87.3 dB(A) and two hours elsewhere at 75 dB(A). Times are in hours; the sum runs over every period of the day.
- tᵢ | Duration of period i, hours
- Lᵢ | A-weighted equivalent level during period i, dB(A)
- L_Aeq,8h | Eight-hour equivalent level, dB(A)
step: 6 × 10^8.73 + 2 × 10^7.5 ≈ 3.29 × 10⁹
step: Divide by 8 and take 10 × log₁₀: about 86.1 dB(A)
step: The two hours at 75 dB(A) contribute only about 2% of the day's energy
```

The formula has two features worth remembering. Time and level trade at **3 dB per halving**: an eight-hour day at 85 dB(A) delivers the same energy as four hours at 88, two hours at 91, one hour at 94 or fifteen minutes at 100 dB(A). And a quiet period contributes almost nothing; it cannot "average out" a loud one, because the loud period's energy dominates the sum.

## The exposure standard

The work health and safety regulations, as adopted in each Australian jurisdiction, define an **exposure standard for noise** as an L_Aeq,8h of **85 dB(A)** or a C-weighted peak level, L_C,peak, of **140 dB(C)**. The person conducting a business or undertaking must ensure that workers are not exposed above the standard, and more broadly must eliminate or minimise the risk of hearing loss so far as is reasonably practicable. Safe Work Australia's model code of practice on managing noise explains how to do that, and its own guidance makes the point that the standard protects most people but not all, so exposure should be kept below it where practicable.

The 85 dB(A) figure is measured at the worker's ear position, as if no hearing protector were worn. It is a limit, not a target, and an exposure just below it is not a safe one in any absolute sense.

```figure
type: compare
title: Time at a steady level that gives an L_Aeq,8h of 85 dB(A)
cols: Time to reach the exposure standard | Example in CP-30's workshop
caption: From the 3 dB exchange: each 3 dB increase halves the time. Levels are A-weighted at the ear, without hearing protection.
- 85 dB(A) | 8 hours | Just below the fitter's bench level from the compressor
- *88 dB(A) | 4 hours | About the bench level as found, 87.3 dB(A), allows about 4.7 hours
- 91 dB(A) | 2 hours | Two metres from CP-30
- 94 dB(A) | 1 hour | Servicing CP-30 at about 1 m
- 97 dB(A) | 30 minutes | Typical of heavy grinding at the operator
- 100 dB(A) | 15 minutes | Close to gouging or a cut-off saw
```

## Peaks

The peak limit addresses a different mechanism: a single very high pressure, from a hammer blow, a press stroke, a nail gun or a compressed air blow-off close to the ear, can damage the inner ear at once. It is measured with the C-weighting and a peak-detecting meter, not with the averaging used for L_Aeq. CP-30 is a steady source and its peaks are well below 140 dB(C), but the workshop's hammering and air blow-guns need their own peak assessment.

## Dose

Exposure is often expressed as a **dose**, the percentage of the exposure standard's daily energy received. Each period contributes (t ÷ 8) × 10^((L − 85) ÷ 10) × 100%. This is an illustration. The fitter's six hours at 87.3 dB(A) contribute about **127%**, the two hours at 75 dB(A) about 2.5%, a total of about **130%**, equivalent to 85 + 10 × log₁₀(1.30) ≈ 86.1 dB(A). The WORKOS [Noise Exposure Check](/tools/noise-exposure-check/) combines sources and works out a daily dose from levels and times. Personal noise dosimeters, worn by the worker, measure the dose directly over a whole shift, which captures the real pattern of movement around a workshop better than a set of fixed measurements.

## The error: averaging decibels

This is an illustration. The workshop's first exposure estimate took the fitter's six hours at 87.3 dB(A) and two hours at 75 dB(A), and averaged them by time in the ordinary way: (6 × 87.3 + 2 × 75) ÷ 8 ≈ **84.2 dB(A)**. That is under 85 dB(A), and the estimate concluded that no action was required.

Decibels cannot be averaged like that, because they are logarithms of energy. The energy average, as above, is about **86.1 dB(A)**, above the exposure standard. The arithmetic average understated the exposure by about 1.9 dB, which in energy terms is a factor of about 1.5.

```figure
type: bars
title: The fitter's eight-hour exposure, dB(A)
unit: dB(A)
max: 90
caption: This is an illustration. Averaging decibels arithmetically gave an apparent pass; the energy average is above the standard.
- Arithmetic time-average of decibels | 84.2
- Exposure standard | 85.0
- *Energy average, L_Aeq,8h | 86.1
```

The check that catches it is the dose calculation: a dose over 100% means the standard is exceeded, whatever an arithmetic average says. The six hours at the bench alone deliver 127% of the standard's daily energy; no quiet period can bring that back below 100%. The general lesson is that exposures combine as energies, and any spreadsheet or rule that averages decibels directly is wrong in the direction that matters, because it gives the quiet periods too much weight.

## The hierarchy of control

The work health and safety framework sets an order of preference for controlling risks, and it applies to noise directly.

- **Eliminate** the noise source: for example, run compressed air from a remote plant room, or stop using a noisy process.
- **Substitute** a quieter machine or process: buy quiet, as Chapter 10 discusses, or replace a noisy method with a quieter one.
- **Isolate** the source or **engineer** the path: enclosures, barriers, absorption, silencers and vibration isolation, Chapters 5 to 9.
- **Administrative** controls: limit the time spent in noisy areas, move work positions, schedule noisy work when fewer people are present.
- **Personal protective equipment**: hearing protectors, as a last line of defence.

For CP-30, elimination might mean relocating the compressor to a separate plant room; engineering controls mean an enclosure, absorption and isolation in place; an administrative control might move the fitter's bench further away; hearing protection would be the fallback, not the plan.

## Why hearing protectors come last

Hearing protectors work, but they work only when they are worn, fitted correctly and in good condition, for the whole of the noisy period. Protectors are rated by laboratory tests, and the protection achieved in a workplace is usually less than the rating suggests. Wear time matters more than most people expect.

This is an illustration. A protector providing **20 dB** of attenuation when worn, but removed for 10% of the noisy period, gives an effective attenuation of only about **9.6 dB** over that period, because the unprotected 10% delivers most of the energy. Worn 99% of the time, it gives about 17 dB. Where protectors are needed, the model code and the regulations also require audiometric testing for workers who must wear them frequently, and protectors must be selected for the noise and the person.

## Measuring exposure in practice

Exposure can be estimated in two ways, and each has its place. A **task-based** estimate, like the fitter's above, divides the day into tasks or locations, measures or predicts the level for each, and combines them with their durations. It shows which task contributes most, which is exactly what a noise control plan needs, but it depends on the durations being right, and people rarely know how long they spend at each task. A **dosimeter**, worn on the shoulder near the ear for a full shift, records the real exposure as the worker moves, including the tasks nobody thought to list. It gives a reliable total but less insight into its causes.

Used together, they check each other. If a dosimeter shift gives a dose well above the task-based estimate, a task has been missed or underestimated: perhaps the fitter uses an air blow-gun at the bench, or stands beside CP-30 to read its gauges each morning. If the two agree, the task-based breakdown can be trusted to rank the controls. For the workshop, two dosimeter shifts on the fitter gave results within about a decibel of the task-based 86.1 dB(A), which gave confidence in the breakdown that set the compressor's target.

## Noise and other hazards

Noise is not the only thing that harms hearing at work. Some chemicals, including certain solvents and metals, are **ototoxic**: they damage the inner ear themselves and appear to increase the damage done by noise. Safe Work Australia's model code addresses workers exposed to such substances and advises keeping their noise exposure lower than the standard. A workshop that uses solvents for degreasing, or where welding fumes contain such metals, should consider this when setting its noise targets, which is another reason the workshop's 80 dB(A) target sits well below the standard rather than just under it.

Hand-arm vibration from grinders and impact tools is a separate hazard with its own assessment, though the same tools often dominate both noise and vibration exposure. Replacing a tool for one reason should consider the other.

## Consultation

The people exposed know things the measurements do not: which tasks are loudest, how long they really take, where they stand, and which controls would get in the way of the work. The work health and safety framework requires consultation with workers on matters that affect their health and safety, and noise control benefits from it directly. The fitter was the first to point out that the morning gauge check at CP-30 was missing from the task list, and the storeperson's description of a "rumble" was the clue, in Chapter 3, that the problem was low-frequency. Controls designed with the people who must live with them are also the ones that stay in use.

## Records and review

The noise assessment, its measurements, the controls chosen and their verification should be recorded, and the record should say when it must be reviewed: when a machine is added, moved or changed, when work patterns change, when a control is found not to work, and when audiometric testing shows hearing loss in a worker. For CP-30's workshop, the second compressor of Chapter 1's exercise is a review trigger in its own right. Recording the task-based breakdown, not only the total, makes each review much faster, because a change to one task can be recalculated without re-measuring the whole shop.

The record also protects the people who make decisions later. A manager who inherits a workshop with a dated assessment, a list of controls and a measured result can see what was done and why, and can tell whether the second compressor, a new press or a change of shift pattern needs a fresh assessment. Without the record, every decision starts again from guesswork.

## A design target

The controls of the following chapters need a target. This is an illustration. The workshop set a target L_Aeq,8h for the fitter of **80 dB(A)**, comfortably below the standard. With two hours at 75 dB(A), the six hours at the bench must average no more than about 80.9 dB(A). The shop's other work contributes about 78 dB(A) at the bench, so CP-30's contribution must be no more than about 77.8 dB(A). The design target was set at **76 dB(A)** from CP-30 at the bench, a reduction of about **11 dB** from its present 86.8 dB(A), which gives a bench level of about 80.1 dB(A) and an L_Aeq,8h of about **79.3 dB(A)**.

The target shows two things. CP-30 needs a substantial reduction, more than absorption alone can give, as Chapter 5 shows. And the shop's own 78 dB(A) at the bench is not far below the compressor's target, so after CP-30 is treated, the next gain will come from the shop's other sources, which is when quieter grinders, Chapter 1's premature purchase, will start to matter.

## Exercise: the maintenance fitter's day

On a service day, the maintenance fitter spends half an hour at about 1 m from CP-30, at about 93.2 dB(A), five and a half hours at the bench at 87.3 dB(A), and two hours at 75 dB(A). What is their L_Aeq,8h? How much does the half hour at the compressor add compared with an ordinary day?

**Worked answer.** L_Aeq,8h = 10 × log₁₀((0.5 × 10^9.32 + 5.5 × 10^8.73 + 2 × 10^7.5) ÷ 8) ≈ **87.1 dB(A)**, about 1 dB above the ordinary day's 86.1 dB(A). The half hour at 93.2 dB(A) delivers about as much energy as two hours at the bench.

The result shows why short tasks near noisy machines matter: half an hour is 6% of the day but about a quarter of the energy. A compressor enclosure, which lowers the level at 1 m much more than at the bench, reduces the maintenance fitter's dose sharply, but servicing usually means opening the enclosure, so service tasks should be planned with the machine stopped where possible, or with hearing protection for the duration.
