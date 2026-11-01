---
book: breakdowns-and-buffers-by-the-numbers
chapterSlug: are-stops-random
order: 2
title: "Are the stops random? Poisson counts and memoryless clocks"
description: "Testing a stoppage log for the randomness a Markov model assumes: Poisson counts per shift, a c chart for special causes, exponential intervals, repair time spread and wear-out parts."
draft: false
---

Chapter 1 assumed that the bagger stops at a constant rate and restarts at a constant rate. That assumption is what makes the model Markov, and everything later in this book rests on it. It is also testable. A machine whose stops arrive at random produces stop counts per shift that follow a Poisson distribution, intervals between stops that follow an exponential distribution, and no pattern linked to the time of day, the operator or the age of a part. A log can be checked against each of those in an afternoon.

This chapter sets out what randomness looks like in a stoppage log, checks the bagger's counts per shift against the Poisson distribution and with the WORKOS c chart tool, looks at its intervals and repair times, and shows how a part that wears out breaks the assumption. It ends with a rate inflated by one bad shift that would have overstated every later calculation by 18%.

## What a random stream looks like

If stops arrive at a constant rate λ per running hour, independently of one another, the number of stops in a running time t follows a Poisson distribution with mean λt. Its key property is that the variance equals the mean. The bagger runs about 7.11 hours in an 8-hour shift, so its expected count is 0.50 × 7.11 = 3.56 stops a shift, and the standard deviation is √3.56 = 1.89. A shift with one stop and a shift with seven are both ordinary.

```figure
type: bars
title: Chance of each number of bagger stops in a shift, Poisson with mean 3.56
caption: This is an illustration. Probabilities from the Poisson distribution, P(k) = e^(−m) mᵏ ÷ k!. The chance of 8 or more stops in a shift is 2.9%; of 11 or more, about 1 in 870.
max: 0.25
- 0 stops | 0.029
- 1 | 0.102
- 2 | 0.181
- * 3 | 0.214
- 4 | 0.190
- 5 | 0.135
- 6 | 0.080
- 7 | 0.041
- 8 | 0.018
```

The Poisson distribution arises as the limit of many rare, independent chances, the same limit Chapter 1 used to explain why a machine with many small causes of stopping behaves as if it had one constant rate. Reichl's probability chapters derive it from the binomial distribution as the number of trials grows and the chance per trial shrinks with their product fixed. For an engineer the useful consequences are two: the variance-to-mean ratio of the counts should be close to one, and a count far outside the distribution signals something other than chance.

## Twelve shifts on a c chart

This is an illustration. The bagger's stop counts for twelve consecutive shifts were 1, 5, 3, 7, 2, 11, 4, 3, 6, 1, 4 and 2. The [c chart check](/tools/c-chart-check/) treats each shift as an inspection unit of equal size and each stop as a count. From up to twelve units it calculates the average count, the upper and lower control limits from the Poisson model at the chosen width, normally three standard deviations, with no lower limit when it would be negative; the count that would signal; and which units fall outside the limits.

```figure
type: stats
title: The bagger's stops per shift on the c chart
caption: This is an illustration. Counts 1, 5, 3, 7, 2, 11, 4, 3, 6, 1, 4, 2, limit width 3. The sixth shift is out of control. With it removed, the remaining eleven average 3.45 stops a shift, with a variance-to-mean ratio of 1.12.
- 4.08 | Average stops per shift | 49 stops over 12 shifts
- 10.15 | Upper control limit | 4.08 + 3 × √4.08; no lower limit
- * Shift 6 | Out of control | 11 stops: 11 or more signals
- 1.12 | Variance ÷ mean, other eleven shifts | close to 1, as a Poisson stream should be
```

The sixth shift, with 11 stops, is above the limit. A count that high has a Poisson probability of about 0.1% at the bagger's usual rate. The chart does not say what happened; it says something did. The shift supervisor's notes recorded a new batch of film whose splices kept failing, and the film was changed at the start of the next shift. The other eleven shifts look like a random stream: their counts range from 1 to 7, average 3.45 and have a variance of 3.87, a ratio of 1.12 to the mean. A ratio well above one would suggest the shifts differ systematically, for example by product or crew; well below one, that the stops are more regular than chance, as wear-out failures at fixed intervals would make them.

A c chart is the right tool here because each shift has the same running time. If shift lengths or running times differ, the counts must be divided by running time and a u chart used instead, with limits that vary with each unit's size.

## Intervals between stops

The second test looks at the times between stops. If stops form a Poisson stream, the running time between them follows an exponential distribution with mean 1 ÷ λ. Two quick checks need no software. For an exponential distribution the standard deviation equals the mean, so the coefficient of variation is one. And the share of intervals shorter than the mean is 1 − e⁻¹ = 63.2%, more than half, because the distribution has many short intervals and a long tail of long ones.

```figure
type: bars
title: Share of the bagger's running intervals longer than a given time, exponential with mean 2.0 h
caption: This is an illustration. The share surviving past t is e^(−t ÷ 2). A plot of the log's intervals on the same axes, or on a log scale where the exponential becomes a straight line, is the visual test.
max: 1
- Longer than 0.5 h | 0.779
- Longer than 1 h | 0.607
- * Longer than 2 h, the mean | 0.368
- Longer than 3 h | 0.223
- Longer than 4 h | 0.135
- Longer than 6 h | 0.050
```

This is an illustration. The engineer took the 141 intervals between the 142 stops in the bagger's month, measured in running time. The mean was 2.00 hours, the standard deviation 1.94 hours, a coefficient of variation of 0.97, and 89 of the 141 intervals, 63.1%, were shorter than the mean. Both checks agree with an exponential distribution. A plot of the share of intervals longer than each time, on a logarithmic scale, gave a nearly straight line, which is what an exponential distribution produces.

Getting running time between stops from a paper log is tedious, because every break and changeover must be subtracted by hand. A machine status signal recorded by the control system, running or not running with a time stamp, makes it automatic, and it also catches the short stops that operators do not bother to write down. For the bagger, the plant added a status signal from the machine's controller to its production database, which also gave the stop durations to the second for Chapter 3's analysis. Where only a paper log exists, a month of careful manual recording is usually enough to test the assumptions; the model does not need years of data, but it does need the data it has to be consistent.

The intervals must be measured in running time, not clock time. An interval that spans a lunch break, a changeover or a weekend includes time when the machine could not stop, and counting it inflates the long intervals and distorts the shape.

## Patterns the overall tests can miss

A stream can pass the count and interval tests overall and still hide a pattern, because the tests average over everything in the log. Three cuts of the data are worth a look before trusting a constant rate.

- **Time into the shift.** Stops that cluster in the first half hour after start-up, or after breaks, point to warm-up problems: heaters not yet at temperature, film tension not settled. A count of stops by quarter-hour of the shift shows it.
- **Crew and product.** Stops that differ between crews or products point to training, settings or materials rather than chance. Counting stops per running hour for each crew or product and comparing them, as below, shows whether the difference is real.
- **Season.** Some machines are sensitive to temperature and humidity; packaging film and adhesives often are. A monthly rate plotted across a year shows it.

The comparison needs care, because random counts differ by chance. This is an illustration. In the bagger's month, the day shifts logged 64 stops and the afternoon shifts 78, each in about 142.2 running hours: rates of 0.45 and 0.55 per hour, a difference of 22% that looks like a finding. But if the true rates were equal, each crew would expect 71 stops, and the difference of 14 between two Poisson counts totalling 142 has a standard deviation of √142 = 11.9. The difference is 1.2 standard deviations, well within chance. A month is not enough to say the afternoon crew has more stops; it would take a sustained difference of that size over several months, or a known cause, to justify treating the crews differently in the model.

## Repair times are another matter

The repair times did not pass the same tests. Their mean was 15.0 minutes, but their median was only about 3.5 minutes, and their coefficient of variation was about 2.3, far above the exponential's one. Most stops were short jams cleared by the operator; a few were breakdowns that took a fitter an hour. A distribution like that is a mixture, and Chapter 3 models it as two kinds of stop with their own rates.

For many questions the shape of the repair time does not matter. The long-run availability of a single machine depends only on the means: A = MTBF ÷ (MTBF + MTTR) holds for any distribution of repair times, a result sometimes called insensitivity. But the shape matters a great deal for questions about waiting and buffering: how often a stop outlasts the conveyor's buffer, how long machines wait for a fitter, how much product is lost when a stop exceeds a hold time. Chapters 3 and 5 return to it.

## Parts that wear out

A Markov model assumes that a running machine's chance of stopping does not depend on how long it has run. Parts that wear break that assumption. This is an illustration. The bagger's heat-seal jaws are heated by cartridge heaters, and their failures, recorded over several years across the four lines, fit a Weibull distribution with shape β = 3 and characteristic life η = 2,500 running hours. A shape above one means the failure rate rises with age.

The [Weibull reliability tool](/tools/weibull-reliability/) gives the consequences. From the shape and the characteristic life, it calculates the reliability and probability of failure at a mission time, the hazard rate there, the B10 life, the mean time to failure and the failure pattern, and it notes whether time-based replacement can reduce failures. For the heaters at 1,000 hours it gives a reliability of 93.8%, a hazard rate of 1.92 × 10⁻⁴ per hour, a B10 life of 1,181 hours and a mean life of 2,232 hours, with the pattern "wear-out".

```figure
type: decision
title: Does a stop cause belong in the Markov model?
question: What does the failure rate of this cause do as the part ages?
caption: This is an illustration. The bagger's jams belong in the Markov model; its heaters do not. Treating the heaters as random would understate failures late in their life and miss the chance to replace them before they fail.
- Constant, no link to age | jams, sensor faults, electronic failures | include in the stop rate λ
- *Rising with age, Weibull β > 1 | heaters, blades, belts, seals | plan age-based replacement; Chapter 10
- Falling with age, Weibull β < 1 | early failures after installation or repair | improve installation and commissioning
```

Heater failures are a small share of the bagger's stops, about one every 2,200 running hours on each machine against a stop every 2 hours, so they make little difference to the rate in the model. But their pattern is the opposite of random, and the right response to them, replacing heaters on a schedule before they fail, would be invisible to a model that lumped them in with the jams. The Markov model is for the random stops; wear-out parts get their own treatment.

## The error: one bad shift in the average

This is an illustration. The engineer preparing the buffer study for Chapter 5 first took the twelve shifts' average, 4.08 stops a shift, as the bagger's normal rate. Dividing by 7.11 running hours gave a failure rate of 0.574 per hour, 15% higher than the month's 0.50. Applied to the line model, the higher rate would have overstated the bagger's stops and the value of a larger buffer, and made the line look worse than it is.

The c chart caught it. The sixth shift's 11 stops had a known special cause, the film batch, which had been removed. Including it in the rate treated a one-off failure of supply as part of the machine's normal behaviour. Excluding it, the eleven remaining shifts gave 3.45 stops a shift, 0.486 per running hour, consistent with the month's 0.50 and with a Poisson stream. The pooled average overstated the normal rate by 18%.

The opposite mistake is as easy. Dropping every high shift as "special" would understate the rate and flatter the line. The rule is to remove a point only when a special cause is identified and dealt with, and to keep it, and investigate, when one is not. The film batch was also worth recording for its own sake: the purchasing team added a splice test to the incoming inspection for new film suppliers.

## Exercise: a second line's shifts

Line 3's bagger logged 2, 4, 3, 5, 3, 4, 6, 2, 9, 3, 4 and 3 stops in twelve shifts of equal running time. Find the average, the upper control limit at three standard deviations and whether any shift is out of control. Then find the variance-to-mean ratio and say what it suggests.

**Worked answer.** This is an illustration. The counts total 48, so the average is **4.00** stops a shift and the upper limit 4.00 + 3 × √4.00 = **10.0**. The highest count, 9, is below it, so **no shift is out of control**; a count of 11 or more would signal. The deviations from 4 square to 4, 0, 1, 1, 1, 0, 4, 4, 25, 1, 0 and 1, which sum to 42, so the sample variance is 42 ÷ 11 = 3.82 and the variance-to-mean ratio **0.95**. That is close to one, as a Poisson stream should be, so line 3's bagger looks like line 1's: random stops at a steady rate, with the shift of 9 an unremarkable member of the distribution, whose chance of 9 or more at a mean of 4 is about 2%.
