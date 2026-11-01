---
book: trips-and-alarms-by-the-numbers
chapterSlug: voting-between-sensors
order: 9
title: "Voting between sensors"
description: "What one-out-of-two, two-out-of-two and two-out-of-three voting do to spurious trips and failures on demand, why voting does not cure process noise, common-cause failures, and deviation alarms."
draft: false
---

When a trip misbehaves, someone soon suggests more sensors. Two transmitters, or three with a vote, sound more reliable than one, and for some kinds of failure they are. But voting addresses a particular problem: the failure of an individual instrument, by drifting, freezing, or failing to zero. It does little for noise that comes from the process itself, because every sensor on the same pipe sees the same process. Knowing which problem a voted arrangement solves, and what it costs in the other direction, is the difference between a sound design and an expensive one that changes nothing.

This chapter compares the common voting arrangements on spurious trips and on failure to trip, using the simplified equations of reliability engineering, shows by replay that voting barely changes PT-3's nuisance trips, and introduces the deviation alarm, which is where a second sensor earns its keep. Its error is a pair of transmitters that shared one tapping and failed together.

## The proposal

When the nuisance trips were at their worst, an instrument supplier proposed replacing PT-3 with three transmitters and a two-out-of-three vote, which, the proposal said, would eliminate false trips. Before the engineer had finished the analysis of Chapters 3 and 4, the plant manager asked whether to accept it.

The engineer separated two questions. Would three transmitters reduce the nuisance trips, which come from the noise? And would they make the trip more or less likely to fail when it was needed, or to act when a transmitter failed? The first question is about process noise, the second about instrument failures, and they have very different answers.

## Voting and process noise

Three transmitters on the same header measure the same water. The turbulence and the valve swells that make up PT-3's noise are real pressure changes, so all three transmitters see them together. Each transmitter adds a little noise of its own, from its electronics, but that is small: a standard deviation of about 0.02 bar for transmitters of this type, against 0.15 bar of process noise. When the process noise carries the pressure below 3.2 bar, it carries all three readings below together.

The engineer replayed the noise model through each voting arrangement, giving each transmitter the same process noise plus its own independent electronic noise, at a mean of 3.80 bar where nuisance trips are numerous enough to count.

```figure
type: compare
title: Nuisance trips per shift on raw readings at a mean of 3.80 bar, by voting arrangement
rowhead: Arrangement
cols: Trips per shift | Change from one transmitter
caption: This is an illustration. Replay of 20 hours of the noise model, each transmitter seeing the same process noise plus 0.02 bar of its own. Voting changes the count by tens of per cent, not by orders of magnitude, because the noise is common to all the transmitters.
- 1oo1: one transmitter | 62 | none
- 1oo2: either of two trips | 78 | 26% more
- 2oo2: both of two must agree | 44 | 29% fewer
- * 2oo3: any two of three | 51 | 18% fewer
```

A two-out-of-three vote reduced the nuisance trips by under a fifth. The 0.5 s filter of Chapter 4, at the same mean, reduces them to about one in a million shifts. Voting cannot remove noise that the transmitters share, and the supplier's claim that it would eliminate false trips was simply wrong for this kind of false trip. It would have been right for false trips caused by a transmitter fault, which is the next question.

## Voting and instrument failures

Transmitters fail in two broad ways. A **safe failure** drives the reading low, below the trip, for example a broken wire on a 4–20 mA loop that reads 0 mA, and causes a spurious trip. A **dangerous failure** leaves the reading at or above normal when the pressure has really fallen, for example a frozen output or a blocked impulse line, and the trip fails to act. Some dangerous failures are detected by diagnostics; those that are not, the dangerous undetected failures, are found only by a proof test, and until then the trip is unavailable.

Two numbers describe the result of each arrangement: the **spurious trip rate**, how often instrument failures stop the plant, and the **average probability of failure on demand**, the chance that the trip will not act when needed. For identical channels, ignoring common causes for the moment, the simplified equations found in functional safety texts such as the one in the references are as follows, where λS is each channel's safe failure rate, λDU its dangerous undetected failure rate, TI the proof-test interval and MTTR the time to repair a failed channel.

```figure
type: compare
title: Simplified equations for voted channels, without common cause
rowhead: Arrangement
cols: Spurious trip rate | Average probability of failure on demand
caption: Simplified forms, valid when λ × TI is small. They show the structure: voting arrangements that need more channels to agree trip less spuriously but fail on demand more often, and the reverse.
- 1oo1 | λS | λDU × TI ÷ 2
- 1oo2 | 2 λS | (λDU × TI)² ÷ 3
- 2oo2 | 2 λS² × MTTR | λDU × TI
- 2oo3 | 6 λS² × MTTR | (λDU × TI)²
```

For illustration, the engineer used a safe failure rate of 0.1 a year and a dangerous undetected rate of 0.02 a year for each transmitter channel, with its wiring and input card, an annual proof test and a repair time of 8 hours. These are invented round numbers chosen to show the pattern, not data for any product.

```figure
type: compare
title: The voting arrangements with illustrative failure rates
rowhead: Arrangement
cols: Spurious trips from instrument failures, per year | Probability of failure on demand, no common cause | With 10% common cause
caption: This is an illustration. λS = 0.1 a year, λDU = 0.02 a year, TI = 1 year, MTTR = 8 h, common-cause fraction β = 10% where shown. Common cause dominates the voted arrangements' failure on demand; without it, the second-order terms would look a hundred times better than they are.
- 1oo1 | 0.1 | 0.010 | 0.010
- 1oo2 | 0.2 | 0.00013 | 0.0011
- 2oo2 | 0.00002 | 0.020 | 0.020
- * 2oo3 | 0.00005 | 0.0004 | 0.0014
```

Three things stand out. First, every arrangement's spurious trips from instrument failures, at most 0.2 a year, are tiny next to the noise trips the plant was suffering, about 2.8 a shift, or some 1,400 a year at 500 shifts. Instrument failures were not the problem. Second, 2oo3 is attractive where both spurious trips and failure on demand matter: it is nearly as resistant to spurious trips as 2oo2 and nearly as safe as 1oo2. Third, the common-cause term is decisive. Two or three transmitters of the same make, on the same tapping, calibrated by the same person with the same calibrator, can fail together, and a common-cause fraction of 10% makes the 1oo2 and 2oo3 failure probabilities about ten times worse than the independent-failure formulas suggest.

### The probability at the end of the interval

The [system reliability tool](/tools/system-reliability/) calculates the reliability of up to four blocks in series at a mission time, each block made of identical units in active redundancy with its own Weibull shape and characteristic life. With a shape of 1, which is a constant failure rate, a characteristic life of 1 ÷ 0.02 = 50 years, or 438,000 hours, and a mission time of one proof-test interval, 8,760 hours, it gives a single channel's reliability of 0.9802 and, with two units in parallel, 0.99961. One minus these, 0.0198 and 0.00039, are the probabilities that one channel, and both of two, have failed dangerously by the end of the year. They are the end-of-interval values, about twice and three times the averages in the table, because the probability grows through the interval and the average is taken over it. The tool does not model voting other than one-out-of-n, common cause or proof testing, so it complements the equations rather than replacing them; it is a quick check of the redundancy arithmetic.

## Where a second sensor earns its keep: the deviation alarm

There is one thing two transmitters on the same process do that one cannot: compare. Because they share the process noise, their **difference** contains only their own electronic noise and any drift or fault of one of them. With 0.02 bar of electronic noise each, the difference has a standard deviation of √2 × 0.02 = 0.028 bar, against 0.15 bar on either reading. A deviation alarm at 0.15 bar sits more than five standard deviations of the difference away from zero, and with a little filtering of the difference, much further. It will catch one transmitter drifting by 0.15 bar, or freezing while the other moves, long before either would cause a missed trip.

In practice the deviation alarm is best set from a log, like every other threshold in this book. A day's log of the two transmitters' difference gives its mean, which should be close to zero once both are calibrated, its standard deviation and its mean-crossing rate, and Rice's formula then gives the rate of false deviation alarms for any setting. Two effects usually make the difference noisier than the electronic noise alone: the transmitters may have different damping, so they follow fast pressure changes slightly differently, and their tappings may be far enough apart for the flow to give them slightly different pressures. A difference filtered over a few seconds removes both, and because a drifting or frozen transmitter is a slow fault, the filter costs nothing in detection. A deviation that is persistent, not momentary, is the signature of a failing instrument.

This is how a second transmitter converts dangerous undetected failures into detected ones. In functional safety terms it raises the diagnostic coverage, and it is often worth more than the vote itself. The deviation alarm needs its own response: a maintenance call, and a defined rule for which transmitter the trip trusts until the fault is found.

```figure
type: tree
title: What redundancy can and cannot fix
caption: Voting and comparison deal with instrument faults. Process noise is common to every sensor on the same process and has to be dealt with in the decision rule.
- Nuisance trips
  - From process noise | Common to all sensors; cure with a filter, on-delay or margin, Chapters 4 to 7.
  - * From instrument faults | Independent between sensors; cure with 2oo2 or 2oo3 voting.
- Missed trips
  - From a frozen or drifted sensor | Cure with 1oo2 or 2oo3 voting and a deviation alarm.
  - From a common cause | Shared tapping, shared calibration, shared power; cure by separating them.
```

## The error: two transmitters on one tapping

The engineer took the idea of common cause seriously because of an incident on the plant's melting furnace, whose cooling-water trip already used two transmitters in a 1oo2 vote. During an annual proof test, the technician isolated the transmitters to apply a test pressure and found that neither responded to the falling system pressure before the test began. Both had been reading a steady 4.1 bar for weeks.

Both transmitters were connected through a single tapping and a single isolating valve, and the valve had been left almost closed after a previous replacement. Trapped water held both transmitters at the pressure on the day the valve was closed. The 1oo2 vote, intended to make the trip more dependable than a single channel, had been exactly as dependable as a single channel with a closed valve: not at all. The failure was common cause in its purest form, one valve shared by both channels, and the independent-failure formula of the table above would have rated the arrangement at about one chance in 7,500 of failing on demand.

The fix was a second tapping and valve, so that each transmitter had its own impulse line, and a deviation alarm, which would also have revealed the closed valve: two frozen transmitters agree with each other, but a single frozen one disagrees with its partner as soon as the pressure moves. The proof-test procedure was changed to record the transmitters' readings before isolation, and to check that they move together with the process.

## The decision at Plant C

The 2oo3 proposal was declined as a cure for nuisance trips, because the filter of Chapter 4 cures them for the cost of a few lines of code. Whether PSLL-3 needs more than one transmitter for its reliability on demand is a separate question, answered by the plant's risk assessment of the die-cooling hazard, not by the nuisance trips. Trips that protect people are safety functions under IEC 61508 and IEC 61511, adopted in Australia as AS 61508 and AS IEC 61511, and their architecture, failure data, proof testing and verification are decided by competent people through that process, with realistic failure rates and common-cause factors. PSLL-3 protects equipment; the plant's own assessment kept a single transmitter, with the filter, an annual proof test and the strainer advisory, and put a deviation alarm on the list for when DC-2's second transmitter is fitted for trending.

## How this applies to a small Australian business

Before adding sensors to cure nuisance trips, find out whether the trips come from the process or from an instrument. If the trip log matches Rice's formula for the measured noise, it is the process, and more sensors will not help. If you do add a second sensor, give it its own tapping, power and cable route, and use the difference between the two as a deviation alarm, because that is where redundancy pays. For any trip that protects people, the voting arrangement and its numbers belong in a functional safety assessment, not in a supplier's quotation.

## Exercise: comparing 1oo2 and 2oo3

Using λS = 0.1 a year, λDU = 0.02 a year, TI = 1 year and MTTR = 8 hours, (a) how many years would pass, on average, between spurious trips from instrument failures for 1oo2 and for 2oo3? (b) What are their probabilities of failure on demand with a common-cause fraction of 10%, using the extra term β × λDU × TI ÷ 2? (c) Which would you choose for a trip where spurious trips are costly and failures on demand are serious, and why?

**Worked answer.** (a) 1oo2: 2 × 0.1 = 0.2 a year, one every **5 years**. 2oo3: 6 × 0.1² × (8 ÷ 8,760) = 5.5 × 10⁻⁵ a year, one every **18,000 years** or so. (b) The common-cause term is 0.1 × 0.02 × 1 ÷ 2 = 0.001. 1oo2: 0.00013 + 0.001 = **0.0011**. 2oo3: 0.0004 + 0.001 = **0.0014**. (c) **2oo3.** Its probability of failure on demand is close to 1oo2's, because both are dominated by the same common-cause term, while its spurious trips from instrument failures are practically eliminated. The comparison also shows where to spend effort next: reducing common cause, by separate tappings, staggered calibration and diverse instruments, improves both arrangements far more than adding a fourth transmitter would.
