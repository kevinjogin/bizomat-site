---
book: welder-training-by-the-numbers
chapterSlug: the-learning-curve
order: 3
title: "The learning curve"
description: "Describe a trainee's improving speed and falling reject rate with a learning curve, fit one from two points, forecast the practice hours to a target, and allow for noise and plateaus."
draft: false
---

Every trainee improves quickly at first and then more slowly. The first hours of practice turn wandering beads into continuous ones; the hundredth hour adds less that can be seen. That pattern is so common in manufacturing that it has a name and a simple mathematical form, the learning curve, first set out by the aircraft engineer T. P. Wright in 1936. He found that the labour hours to build each aeroplane fell by a roughly constant percentage every time the cumulative number built doubled. The same shape describes how a welder's speed rises and reject rate falls with practice.

This chapter sets out the learning curve, applies it to the fabricator's trainees for speed and for quality, shows how to fit a curve from two measurements and use it to forecast the practice hours to a target, and explains the noise and plateaus that make real data less tidy than the formula.

## Wright's learning curve

Wright's observation can be written as a power law. If y is the time or cost of the xth unit, and a is the time or cost of the first, then

y = a × x^b

where b is a negative number. The constant percentage per doubling, called the learning rate r, is related to b by r = 2^b, or b = log₂ r. An 80% learning curve means each doubling of cumulative output brings the time per unit to 80% of what it was. READOS explains power laws and logarithms in [Growth, decay and logarithms](/reados/collections/practical-mathematics-for-engineering/growth-decay-and-logarithms/), including how a power law becomes a straight line on log-log axes.

```figure
type: formula
title: The learning curve and its learning rate
formula: y = a × x ^ b, with b = log₂ r
caption: Wright's form of the learning curve. For an 80% curve, every doubling of cumulative output multiplies the time per unit by 0.8.
- r, learning rate | 80%, or 0.8
- a, time for the first unit | 12 minutes
step: b = log₂ 0.8 ≈ −0.322
step: 2nd unit: 12 × 2^−0.322 = 9.6 min; 4th: 7.7 min; 8th: 6.1 min
step: each doubling multiplies the time by 0.8
```

## Speed: time per coupon

This is an illustration. The fabricator's standard practice coupon is a pair of 150 mm fillet welds on a tee joint in 10 mm plate, including fitting, tacking, welding both sides and cleaning. An experienced welder completes one in about 3 minutes. A trainee's first coupon took about 12 minutes. If the trainee follows an 80% learning curve, the time for the xth coupon is 12 × x^−0.322.

```figure
type: line
title: Time per practice coupon on an 80% learning curve
x: Coupons completed
y: Minutes per coupon
ymin: 0
ymax: 13
caption: This is an illustration: 12 minutes for the first coupon, 80% learning rate. The trainee reaches an experienced welder's 3 minutes at about the 74th coupon.
legend: 80% learning curve
- 1 | 12.0
- 10 | 5.7
- 20 | 4.6
- 40 | 3.7
- 74 | 3.0
- 100 | 2.7
```

The time reaches 3 minutes when 12 × x^−0.322 = 3, so x = 4^(1 ÷ 0.322) ≈ **74** coupons. Speed, on this illustration, comes surprisingly fast: within a couple of weeks of practice, a trainee can be making coupons at an experienced welder's pace. Whether the welds are good is another matter.

## Quality: the reject rate

Speed is the easy part. The harder measure is quality: the fraction of practice coupons that fail inspection, judged by visual examination and a break or bend test. The reject rate also falls along a learning curve, but much more slowly, because the faults that remain after the first weeks are small, intermittent and hard to see.

This is an illustration. Suppose a trainee's reject rate after 10 hours of practice is 60%, and it falls on a 70% learning curve with practice hours, so that p = 0.6 × (h ÷ 10)^−0.515, where h is hours of practice.

```figure
type: line
title: Reject rate on practice coupons against hours of practice
x: Hours of practice
y: Coupons rejected (%)
ymin: 0
ymax: 65
caption: This is an illustration: 60% rejected after 10 hours, 70% learning rate per doubling of practice hours. The rate halves roughly every four times the practice, so the last few points of improvement take the longest.
legend: 70% learning curve
- 10 | 60
- 20 | 42
- 40 | 29
- 100 | 18
- 200 | 13
- 400 | 9
- 800 | 6
- 1240 | 5
```

On this curve, the trainee reaches a reject rate of about 18% after 100 hours, about 9% after 400 hours and 5% only after about 1,240 hours. The slow tail explains much about welder training: getting a trainee to produce mostly good welds is a matter of weeks; getting them to produce good welds reliably, every time, in every position, is a matter of many months.

## Speed before quality

The two curves together carry a warning. On the illustrations in this chapter, a trainee can be as fast as an experienced welder after about 74 coupons, a few days of practice, while still rejecting a quarter or more of the welds. A trainee who is praised or paid for speed at that point learns to weld fast and badly, and the habits set in. The fabricator's instructors therefore do not time trainees' coupons in the first months except to record the data; the target is a sound weld at a travel speed within the procedure's range, and speed beyond that is left to come with time. Only once the reject rate is low do the instructors begin to work on productivity, using the methods of arc time and operator factor from Arc Welding by the Numbers.

## Setting targets from the curve

A learning curve makes targets realistic. Instead of telling a trainee to "get better at vertical welds", the instructor can say that on the trainee's present curve the reject rate should fall from about 20% to about 14% over the next 100 hours, and agree what each week's practice will contain. Targets set from the trainee's own curve are achievable, which keeps the trainee motivated, and a trainee who beats them has learned something worth noticing. Targets set from an experienced welder's performance, or from the manager's hopes, are usually missed, which teaches the trainee only that the targets do not mean much.

## The shop's own learning curve

Wright's curve was first about a whole factory, not one person, and it applies to the fabricator as a business too. The first frames of a new design take longer than later ones, as welders, fitters and supervisors learn the jigs, sequences and details; the time per frame falls with each doubling of the number made. A fabricator quoting a run of frames can use its own past learning rates, measured on earlier designs, to estimate the hours for the first frames and for the run as a whole, rather than assuming every frame will take as long as the hundredth. The same records that track trainees, hours and output by job, also give the business that information.

## Fitting a curve from two points

A learning curve has two unknowns, the starting value and the exponent, so two measurements fix it. On log-log axes, the curve is a straight line, and its slope is b.

This is an illustration. Ben, the second-year apprentice, had a reject rate of 40% over his coupons around 20 hours of practice and 20% around 80 hours. Then b = ln(0.20 ÷ 0.40) ÷ ln(80 ÷ 20) = ln 0.5 ÷ ln 4 = **−0.50**, a learning rate of 2^−0.5 ≈ **71%**.

```figure
type: formula
title: Practice hours to reach a target reject rate
formula: h_target = h₁ × (p_target ÷ p₁) ^ (1 ÷ b)
caption: This is an illustration for Ben, fitted from two measured points, 40% at 20 hours and 20% at 80 hours. The forecast assumes the curve continues, which must be checked as more data arrive.
- h₁, p₁ | 20 hours, 40%
- b | −0.50
- p_target | 8%
step: (0.08 ÷ 0.40) ^ (1 ÷ −0.5) = 0.2 ^ −2 = 25
step: h_target = 20 × 25 = 500 hours of practice
```

At about 12 hours of practice a week, 500 hours is about 42 weeks, close to the year the manager had hoped for.

## Four trainees, four curves

This is an illustration. By the end of the third month, the manager had enough data to fit a curve for each trainee: their reject rate around 10 hours of practice and their learning rate since. The curves differed, as people do.

```figure
type: compare
title: The four trainees' fitted reject-rate curves
cols: Reject rate at 10 hours | Learning rate | Hours to an 8% reject rate
caption: This is an illustration. Each curve is fitted to the trainee's break-tested practice coupons; the forecast hours assume the curve continues.
- Ana, first-year apprentice | 65% | 72% | about 830
- Ben, second-year apprentice | 55% | 71% | about 500
- *Chris, boilermaker's labourer | 50% | 68% | about 270
- Dee, career changer | 35% | 75% | about 350
```

Dee started best, with her earlier welding experience, but improved more slowly than the others, partly because she had habits to unlearn. Chris started in the middle but learned fastest, and was forecast to reach the target first. Ana, starting from nothing, needed the most practice, as a first-year apprentice would be expected to. The forecasts let the manager plan: Chris could move to supervised production work in the shop within about six months, while Ana's plan should run well into her second year.

## Noise in the data

Reject rates measured on small numbers of coupons are noisy. If a trainee's true reject rate is 10% and the manager tests 20 coupons, the number rejected follows a binomial distribution with a standard deviation of about √(0.1 × 0.9 ÷ 20) ≈ 0.067, or **6.7 percentage points**. A trainee whose true rate is 10% could easily show 5% or 15% in any one batch of 20, by chance alone. Testing Welded Joints by the Numbers discusses this kind of variation in its chapter on [variation and how many specimens](/reados/publications/testing-welded-joints-by-the-numbers/variation-and-how-many-specimens/).

The practical rules follow. Use a rolling count over the last 20 to 40 coupons rather than a daily figure. Fit curves to several points, not two, once there are enough. Do not react to one bad batch, and do not celebrate one good one. Doubling the sample to 40 coupons reduces the standard deviation only to about 4.7 points, so patience is part of the method.

## Plateaus and setbacks

Real learning curves have plateaus: weeks where the reject rate stops falling, often while the trainee is consolidating a skill or learning a new position, followed by renewed improvement. They also have setbacks: a change of process, position or material sends the reject rate back up, sometimes sharply, before it falls again along a new curve. A trainee moving from horizontal to vertical-up fillets is, for the vertical position, partly a beginner again. Learning curves should be kept separately for each position and process, or at least marked where the work changed, or a setback will look like a failure to learn.

## What the curve is not

A learning curve is a description, not a law. It fits a great deal of experience in manufacturing and training well enough to plan with, but it does not guarantee that a trainee will keep improving at the same rate. Curves flatten, sometimes well above the target, when a trainee has reached the limit of their technique, their eyesight or their interest, and further practice without new instruction adds little. Extrapolating a curve far beyond the data is guesswork. The forecast hours in this chapter are best treated as a plan to be checked against each month's data, not as a promise.

## Recording the reasons

A reject rate tells the instructor how often a trainee fails, not why. The fabricator's coupon record therefore notes the reason for each rejection: lack of fusion at the root, undercut, porosity, uneven leg length, poor profile, cracking. Over a few weeks, the pattern shows where each trainee's curve is held up. A trainee whose rejections are mostly undercut needs work on travel speed and angle; one whose rejections are lack of fusion needs work on keeping the arc at the leading edge of the pool. Splitting the curve by reason shows which faults are falling and which have stuck, and directs instruction to the faults that have stopped improving on their own.

## Using the curve in practice

The fabricator's manager now keeps, for each trainee, a simple record: hours of practice, coupons made, coupons rejected and the reason, and average time per coupon, by position. Each month, the manager plots reject rate and time against hours on log-log paper or in a spreadsheet, fits a line, and compares the forecast with the plan. A trainee whose curve has flattened early gets new instruction, not just more hours; a trainee ahead of the plan gets new positions or work sooner. The curve turns impressions into numbers that the manager, the trainee and the instructor can all see.

## A failure: the early forecast

This is an illustration. After the trainees' first fortnight, the manager, eager to plan, fitted a curve to Ben's first two measurements: 70% rejected at about 5 hours and 30% at about 20 hours. That gave b ≈ −0.61 and a forecast of about **175 hours** to an 8% reject rate, and the manager promised a customer that Ben would be welding production frames within four months.

Ben's improvement slowed after the first month, as early learning curves often do; the large, easily corrected faults of the first days had been removed, and the remaining ones were harder. By three months, his curve had settled at about b = −0.50, forecasting about 500 hours. The customer's frames were welded by the experienced welders instead, and the manager learned not to forecast from the first, steepest part of a curve, but to wait for several weeks of data and to forecast in ranges.

## Exercise: when will Dee be ready?

Dee's reject rate is 35% at 10 hours of practice, on a 75% learning curve. Calculate her expected reject rate at 100 and at 200 hours, and the practice hours to reach 8%. If she practises 15 hours a week, how many weeks is that?

For a 75% curve, b = log₂ 0.75 ≈ **−0.415**. At 100 hours, p = 0.35 × (100 ÷ 10)^−0.415 = 0.35 × 10^−0.415 ≈ 0.35 × 0.385 ≈ **13.5%**. At 200 hours, p ≈ 0.35 × 20^−0.415 ≈ 0.35 × 0.288 ≈ **10.1%**.

The hours to 8% are h = 10 × (0.08 ÷ 0.35)^(1 ÷ −0.415) = 10 × (0.229)^−2.41 ≈ 10 × 35 ≈ **350 hours**. At 15 hours a week, that is about **23 weeks**, a little under six months, provided her curve keeps its slope, which the monthly data will show.
