---
book: welder-training-by-the-numbers
chapterSlug: skill-decay-and-refreshers
order: 8
title: "Skill decay and refreshers"
description: "Model how a welder's reject rate creeps up in a position or process they have stopped using, track the gaps in a welder register, and decide when a refresher costs less than the repairs it prevents."
draft: false
---

A qualified welder does not stay qualified in skill just because the certificate is current. Welding skill, like any fine motor skill, is kept by use. A welder who welds flat fillets every day stays sharp at them, but the same welder, after nine months without a vertical-up weld, may find that the first few on a site job are not what they were. The decline is gradual and invisible from inside, and it shows up as defects found by the inspector, often in the hardest positions and on the most awkward jobs, where repairs cost most.

This chapter models how a welder's reject rate drifts up in a position they have not used, explains how a welder register shows where the gaps are, and works out when a short refresher is worth its cost.

## What fades and what stays

Motor skills are generally retained better than facts. A person who learned to ride a bicycle can ride one again after years, if a little shakily. But the fine control that separates a sound weld from a nearly sound one, the steady travel speed, the arc held exactly at the leading edge of the pool, the weave timed to the pool's freezing, is the part that fades first. Skills learned recently and practised little fade fastest; skills practised for years and used often fade slowest. Position-specific skills fade independently: a welder can stay excellent in the flat position while losing their touch in the vertical. The Library explains the general pattern of forgetting, and why spaced practice slows it, in [The forgetting curve and why training fades](/reados/collections/judgement-markets-and-learning/the-forgetting-curve-and-why-training-fades/).

## A model of decay

A simple model captures the shape. Suppose a welder's reject rate in a position, when they use it regularly, is p₀, and that if they stopped using it for good, it would drift towards a higher rate p∞, the rate of a welder who knows how but is badly out of practice. A reasonable assumption is that the rate approaches p∞ exponentially, with a time constant τ.

```figure
type: formula
title: Reject rate after a gap without welding in a position
formula: p(t) = p₀ + (p∞ − p₀) × (1 − e^(−t ÷ τ))
caption: This is an illustration. The values are invented to show the shape of the model, not measured data; each business can fit its own from the reject rates of welders returning to a position.
- p₀, reject rate when in regular use | 4%
- p∞, rate when long out of practice | 15%
- τ, time constant | 6 months
step: after 3 months: 4 + 11 × (1 − e^−0.5) ≈ 8.3%
step: after 6 months: 4 + 11 × (1 − e^−1) ≈ 11.0%
step: after 12 months: 4 + 11 × (1 − e^−2) ≈ 13.5%
```

```figure
type: line
title: A welder's vertical-up reject rate after a gap in that position
x: Months without vertical-up welding
y: Reject rate (%)
ymin: 0
ymax: 16
caption: This is an illustration of the decay model with p₀ = 4%, p∞ = 15% and τ = 6 months. The rate rises fastest in the first months, which is when a gap is easiest to ignore.
legend: Decay model
- 0 | 4.0
- 1 | 5.7
- 2 | 7.1
- 3 | 8.3
- 6 | 11.0
- 9 | 12.5
- 12 | 13.5
- 18 | 14.5
```

The model is an illustration, but its shape matches common experience: the rise is fastest early, so that three months away from a position does more harm than people expect, and it levels off, because the welder does not forget how to weld altogether. On these numbers, the reject rate after six months is nearly three times the rate in regular use.

## Recovery is faster than learning

The good news is that recovering a skill is much faster than learning it. Psychologists call the effect "savings": relearning something takes far less practice than learning it the first time, because much of the skill is still there. A welder whose vertical-up reject rate has drifted to 11% does not need the hundreds of hours a trainee needs to reach 4% again; a few hours of focused practice, with feedback, usually brings them most of the way back. That is what makes a refresher worthwhile: a small cost to recover a large part of the lost skill before it shows up in production.

## The welder register

To know who needs a refresher, the business must know what each welder has been doing. The fabricator's welder register, which it keeps for qualification records (Chapter 7), also records for each welder the last date they welded production work in each process and position covered by their qualification, from job records and weld maps. Once a month, the manager looks for gaps.

```figure
type: checklist
title: When the fabricator schedules a refresher
caption: This is an illustration of the business's own rules, set from its experience. They are in addition to, not instead of, the continuity and renewal requirements of the qualification standard.
- x Gap of more than three months in a position | before the next job in that position
- x Return from extended leave | before returning to production in all positions
- x Change of process, wire or machine | short practice on the new set-up before production
- x Rising reject rate in production | targeted practice on the fault identified
- *? Site job in a difficult position | practice in the booth the week before
```

## The cost of not knowing

Most businesses find out about skill decay the expensive way, from an inspection report on a job where the repairs are slow and awkward. The register and the monthly check cost the fabricator's manager about an hour a month. Against the single overhead job described below, which cost about A$4,000, that hour is cheap, and it also tells the planner where the business is thin in a position before a tender is priced.

## Continuity is not the same as currency of skill

Qualification standards set continuity requirements so that a welder who has not welded within the range of their qualification for some time loses it until they requalify. Those requirements set a minimum. A welder who has welded within the range, but mostly in the easy positions, may meet the continuity requirement on paper while their skill in the hardest position has faded. The fabricator's register therefore tracks positions separately, and the manager uses the business's own refresher rules, not just the standard's continuity, to decide who practises before a job.

## When a refresher pays

A refresher costs the welder's time, the instructor's time, materials and the booth. Chapter 5 costed a two-day, 12-hour vertical-up refresher at about **A$1,356**, excluding GST. Whether it pays depends on what it prevents.

This is an illustration. An experienced site welder has not welded vertical-up for about nine months, so on the decay model their reject rate in that position has risen from about 4% to about 12.5%. A site job needs about 200 m of vertical-up fillet welds. Repairs on site are dearer than in the shop, about A$150 a metre including access, grinding, rewelding, reinspection and delay. Without a refresher, the extra repairs would be about 200 × (0.125 − 0.04) × 150 ≈ **A$2,550**. If the refresher brings the welder back to about 4%, it saves about A$2,550 for A$1,356, and also cuts the risk of a defect escaping inspection.

```figure
type: bars
title: Refresher cost against the extra site repairs it prevents
unit: A$, excluding GST
max: 3000
caption: This is an illustration for 200 m of vertical-up site welding by a welder nine months out of practice in that position, using the decay model and the refresher cost from Chapter 5.
- Refresher, 12 hours | 1356
- *Extra site repairs without refresher | 2550
```

For a smaller job, say 50 m of vertical welding, the extra repairs would be about A$640, less than the refresher, and a shorter refresher of half a day might be enough. The calculation tells the manager how much refresher a job justifies, and it can be done in a minute when the job is planned.

## Refreshers in practice

The fabricator's refreshers are short and focused: an hour or two of practice in the booth on coupons like the job's joints, inspected and broken by the instructor, until the welder's last ten coupons are clean, then straight to the job. They are scheduled as part of job preparation, like ordering materials, not as training that can be dropped when the job is busy. Experienced welders were at first reluctant, seeing refreshers as a slight on their skill, until the manager showed them the decay model and the cost of the site repairs that had prompted it. Now some ask for a refresher before an unusual job.

## Measuring decay in your own shop

The decay model has three numbers, and a business can estimate its own from records it may already keep. Each time a welder returns to a position after a gap, the inspector's results on their first welds, or a short set of practice coupons before the job, give a reject rate after a known gap. Over a year or two, the fabricator collected about twenty such points across its welders and positions. Plotting them against the length of the gap gave a rough curve: little change after a month, a clear rise by three months, and a levelling off after about a year, close to the shape in this chapter. The fitted numbers are rough, because the welders differ and the samples are small, but they turned the refresher rules from a hunch into a policy the welders could see was based on their own results.

## Preventing decay

The cheapest way to deal with decay is to prevent it, by giving each welder some work in each position and process they are qualified for, often enough to keep it current. The fabricator's production planner now looks at the welder register when allocating work, and, where the work allows, gives a welder who has been on flat work for a while a share of the vertical and overhead welds on the next suitable job, with the inspector aware. Rotating work this way costs little: the welds have to be made by someone, and spreading them keeps several welders current instead of one. It also builds resilience, because the business is not dependent on a single welder for its hardest positions.

## Changes in the welder

Skill can also change because the welder changes. Eyesight alters with age, and a welder who needs reading glasses may find that the filter lens and the pool are harder to see clearly; magnifying lenses that fit inside the helmet are available for this. Injuries, tremor, fatigue and some medications affect fine control. A welder whose reject rate rises without any gap in their work deserves a conversation, not just a refresher, to find out whether something has changed that the business can help with, such as a lens, a different helmet, better lighting or a change of work.

## Instructors fade too

Instructors and inspectors lose touch as well. An instructor who no longer welds production work can drift from current practice, and an inspector who has not looked at a particular kind of weld for a while can become more or less strict. The fabricator's instructors weld some production work each month, and the instructors and the inspector repeat the agreement exercise of Chapter 6 every six months, so that the people who judge welds stay current as well as the people who make them.

## Procedures change

Skill also goes out of date when the work changes. A new wire, a new machine, a revised procedure or a new material can make a welder's well-practised habits wrong in small ways: a different stickout, travel speed or gun angle. Whenever the fabricator changes a procedure or a consumable, every welder who will use it does a short practice session on the new set-up before production, with coupons broken and inspected, as the checklist above records. It costs an hour or two per welder and avoids the expensive discovery, in production, that the new wire needs a different technique.

## The trainees after qualification

This is an illustration. After Chris and Dee qualified, they were scheduled mostly on flat and horizontal shop work, because that was what the jobs needed. Six months later, the manager's monthly register check showed that Chris had not welded vertical-up for four months and Dee for five. Both were given a half-day refresher before a stair job, and their reject rates on the stairs were close to their qualification-test rates. Without the register, the gap would have been noticed only when the stair inspection found it.

## A failure: current on paper

This is an illustration. Some years earlier, an experienced welder whose qualification included the overhead position was sent to a site job welding overhead fillets under a platform. The qualification was current, and the welder had welded production work within its range throughout the year, all of it flat and vertical. The welder had not welded overhead for more than a year.

The inspector rejected about a fifth of the first day's overhead welds for undercut and lack of fusion, and the repairs, overhead, at height, under a deadline, took most of the next day. The cost, about A$4,000 in repairs and delay, was several times the cost of a day's refresher. The fabricator's position-by-position register began after that job.

## Exercise: a refresher for a small job

A welder last welded vertical-up four months ago. A shop job needs 80 m of vertical-up fillets, with shop repairs at A$60 a metre. Using the decay model in this chapter, estimate the welder's reject rate, the extra repair cost without a refresher, and the most that a refresher could cost and still pay for itself, assuming it restores the 4% rate.

The reject rate after four months is about 4 + 11 × (1 − e^(−4÷6)) ≈ 4 + 11 × 0.487 ≈ **9.4%**. The extra repairs on 80 m would be about 80 × (0.094 − 0.04) × 60 ≈ **A$259**.

A refresher would pay for itself on repair cost alone if it cost less than about A$259. On Chapter 5's figures, with the welder at A$45 an hour, instruction at one in four and materials at about A$23 an hour, an hour of refresher costs about A$90, so about two and a half hours would break even, while a half-day of four hours, at about A$360, would cost more than the repairs it saves. The manager would choose a short session of two hours or so, and would weigh the lower risk of a defect escaping into the customer's building, which favours doing it.
