---
book: accept-or-reject-by-the-numbers
chapterSlug: measuring-again-and-majority-votes
order: 5
title: "Measuring again and majority votes"
description: "Compare repeat-measurement policies: re-measuring rejects, measuring until a pass, averaging, majority votes and re-measuring only near the limit, with the cost of each per shift."
draft: false
---

When a reading falls near a limit, the instinct is to measure again. Sometimes that is exactly right; sometimes it quietly turns a gauge's random error into a way of accepting bad parts. Which it is depends on the policy: what is re-measured, how the readings are combined, and what decision rule is applied to them. The same choice arises with pass–fail checks, where a camera or an inspector can be asked to look twice or three times and the verdicts combined by majority vote, the simplest of all error-correcting codes.

This chapter compares five repeat-measurement policies for BU-25's bore at the cost-based limits of Chapter 3, shows why averaging removes only part of the gauge's error, prices each policy including the time of the extra readings, and applies majority voting to the vision system. The error is a habit every inspection area has seen: measuring again until the part passes.

## What averaging can and cannot remove

The air gauge's uncertainty budget from Chapter 2 has two kinds of contributor. Repeatability and resolution vary from reading to reading: a second reading of the same bush gets a fresh error. Calibration and temperature do not: the gauge's calibration offset and the bush's temperature are the same for a second reading taken a moment later. Repeat readings average away only the first kind.

```figure
type: compare
title: The air gauge's errors, split by whether a repeat reading changes them
cols: Contributors | Standard uncertainty, µm | Averaging n readings
rowhead: Kind of error
- Varies reading to reading | repeatability 1.0, resolution 0.144 | 1.010 | divided by √n
- Fixed for a given bush and setting | calibration 0.5, temperature 0.083 | 0.507 | unchanged
- One reading | all contributors | 1.130 | —
- Average of 2 | all contributors | 0.876 | not 1.130 ÷ √2 = 0.80
- Average of 3 | all contributors | 0.773 | not 1.130 ÷ √3 = 0.65
caption: This is an illustration. Averaging shrinks only the varying part. However many readings are averaged, the uncertainty cannot fall below the fixed part's 0.507 µm.
```

Averaging two readings cuts the uncertainty from 1.13 to 0.88 µm, not to the 0.80 µm the square-root rule applied to the whole budget would suggest. The difference grows with more readings, and the fixed part sets a floor. *Random Error and Drift by the Numbers* develops the square-root rule and its limits in [Averaging and the square-root rule](/reados/publications/random-error-and-drift-by-the-numbers/averaging-and-the-square-root-rule/).

## Five policies

This is an illustration. Each policy uses the cost-based acceptance limits of Chapter 3, 25.0012 to 25.0193 mm, applied to whatever reading or combination of readings it uses. The rates were calculated by integrating over the bore distribution, the fixed error and the varying error, with every repeat reading sharing the same fixed error.

```figure
type: compare
title: Repeat-measurement policies for BU-25's bore, per shift of 2,000 bushes
cols: Readings a shift | Escapes | Good bushes rejected | Errors cost, A$ | Extra reading time, A$
rowhead: Policy
- * One reading | 2,000 | 0.34 | 50.0 | 459 | 0
- Re-measure rejects once; accept if the second passes | 2,065 | 0.67 | 27.5 | 446 | 9
- Re-measure until it passes, up to three readings | 2,108 | 0.95 | 19.4 | 506 | 14
- Average two readings, same limits | 4,000 | 0.11 | 44.2 | 332 | 267
- Majority of three readings | 6,000 | 0.09 | 43.7 | 320 | 533
caption: This is an illustration. Escapes A$400, false rejects A$6.50, operator time A$80 an hour at 6 seconds a reading, all excluding GST. Totals: one reading A$459, re-measure once A$455, until it passes A$520, average of two A$599, majority of three A$853.
```

The table repays careful reading.

Re-measuring rejects once looks like a free improvement: it rescues 22 good bushes a shift for 65 extra readings. But it doubles the escapes, from 0.34 to 0.67 a shift, because a bad bush near the limit that read just outside on the first reading now gets a second chance to read just inside. At A$400 an escape, the extra escapes cost almost exactly what the rescued bushes save. If the true cost of an escape is higher than A$400, which is common, the policy is worse than a single reading.

Re-measuring until the bush passes is worse still. Each extra chance to pass is an extra chance for a bad bush to read low, and escapes almost triple. It rescues more good bushes, but not enough to pay for the escapes.

Averaging two readings cuts both errors, escapes to 0.11 and false rejects to 44, because the average is a better measurement. But it doubles the measuring time, and at 6 seconds a reading that costs A$267 a shift, more than the A$127 it saves in wrong decisions. A majority of three readings is better still on errors and much worse on time.

## Re-optimising for the better measurement

A policy that improves the measurement should also move the acceptance limits, because Chapter 4 showed that better measurement lets the limits move out towards the tolerance. With the average of two readings, whose uncertainty is 0.876 µm, the best upper limit moves out to about 25.0196 mm. That gives 0.22 escapes and 35.1 false rejects a shift, A$316 in errors. With the extra reading time, the total is A$583, still worse than a single reading at A$459.

The arithmetic changes if the second reading costs nothing in labour, for example if the gauging station is automated and takes two readings in the time the handling takes anyway. Then averaging two readings with re-optimised limits would save about A$143 a shift. Whether repeat readings pay is therefore a question about the cost of a reading as much as about statistics.

## Measuring again only near the limit

The policies so far apply the same treatment to every bush, or re-measure only the rejects. A better policy uses the first reading to decide whether a second is worth taking. Most bushes read far from either limit and are decided at once. Only bushes whose first reading falls close to a limit get a second reading, and then the decision is made on the average of both readings, never on the second alone.

This is an illustration. Under this policy, a bush is re-measured if its first reading is within 1 µm of the upper cost-based limit, between 25.0183 and 25.0203 mm, and accepted if the average of its two readings is no more than 25.0196 mm, the limit suited to the better measurement.

```figure
type: compare
title: One reading against a second reading only near the limit
cols: Readings a shift | Escapes | Good bushes rejected | Errors cost, A$ | Extra reading time, A$ | Total, A$
rowhead: Policy
- One reading at the cost-based limits | 2,000 | 0.34 | 50.0 | 459 | 0 | 459
- * Second reading within 1 µm of the upper limit; decide on the average | 2,079 | 0.20 | 38.0 | 327 | 11 | 338
caption: This is an illustration. Calculated as for the five policies above, with both readings on the air gauge sharing the same fixed error. Widening the re-measure band to 1.5 µm changes the total by only a few dollars.
```

The policy takes only 79 extra readings a shift, under 4%, and cuts the total cost by about a quarter. It works because it spends the second reading only where it can change the decision, and because it combines the two readings rather than letting the second one overrule the first. The contrast with re-measuring rejects is instructive: both take a similar number of extra readings, but re-measuring rejects gives a bad bush a second chance to pass, while averaging near the limit gives every borderline bush, good or bad, a better measurement.

## A better use of a second reading

The policies above re-measure on the same gauge, so the second reading shares the first one's fixed error and is only partly new information. A second reading on a different, better gauge is much more informative, because its errors are independent and smaller. Chapter 10 builds a two-stage plan on this idea: accept the clear cases on the air gauge, and send only the uncertain ones to the bench gauge. That plan reaches A$230 a shift, half the single-reading cost, because it spends the expensive measurement only where it changes decisions.

```figure
type: decision
title: When to measure a part again
question: What will the second measurement add?
caption: The bottom row is the most common practice and the most costly. Re-measuring is useful when it adds independent evidence and the decision rule does not reward luck.
- A better, independent gauge | errors independent and smaller | re-measure the uncertain parts there: Chapter 10
- The same gauge, averaged, with re-optimised limits | reduces only the varying error; costs a full reading | worth it only if the extra reading is cheap or automatic
- * The same gauge, until the part passes | each try is a fresh chance for a bad part to read good | do not use
```

## Majority votes for pass–fail checks

The same ideas apply to pass–fail checks, where the evidence is a verdict rather than a number. Asking the camera to inspect each bush three times and taking the majority verdict is the simplest error-correcting code: repeat the message three times and decode by majority. Shannon's 1948 theory of communication showed that far more efficient codes exist, but the repetition code is the one that maps directly onto inspection.

If the three looks are independent, the majority is wrong only when at least two looks are wrong. For an error rate p on each look, the majority's error rate is 3p² − 2p³. The camera's false-call rate of 2% becomes 0.12%; its miss rate of 5% becomes 0.73%, so its sensitivity rises from 95% to 99.3%. At the shop's 0.6% chatter rate, the share of rejects that truly have chatter would rise from 22.3% to 83.5%, and false rejects would fall from 40 to 2.4 a shift.

```figure
type: compare
title: The vision system with one look and with a majority of three, at 0.6% chatter
cols: False-call rate | Sensitivity | Good bushes rejected a shift | Escapes a shift | Rejects truly bad
rowhead: Policy
- One look | 2.0% | 95.0% | 39.8 | 0.60 | 22.3%
- * Majority of three, errors independent | 0.12% | 99.3% | 2.4 | 0.09 | 83.5%
- Majority of three, three-quarters of false calls persistent | 1.51% | not estimated | 30.0 | not estimated | not estimated
caption: This is an illustration. The last row assumes that 1.5 of the 2 percentage points of false calls come from features that look like chatter every time, such as a tool mark, and only 0.5 points from random causes such as a reflection.
```

The gain depends entirely on independence. Three images of the same bush under the same light are not independent if the false calls come from a persistent feature: a turning mark that looks like chatter will look like chatter in every image. The last row of the figure shows the effect. If three-quarters of the camera's false calls come from such features, the majority of three cuts the false-call rate only from 2.0% to 1.51%, because only the random quarter of the errors is corrected. Before buying a majority-vote scheme, it is worth finding out how many of a check's errors are random and how many persistent, by re-inspecting a sample of false calls and seeing how many repeat.

## Repetition and better codes

Information theory explains why repetition is an expensive way to buy reliability. A repetition code sends every bit three times, so two-thirds of what is sent is redundancy, and it corrects only one error in three. Shannon showed that codes exist which correct errors far more efficiently, by spreading the redundancy cleverly over many bits instead of repeating each one, and that reliable communication is possible at any rate below a noisy channel's capacity. Modern error-correcting codes, the subject of much of the statistical physics behind this book, come close to that limit.

Inspection cannot use those codes directly, because a part is not a message that can be encoded before it is measured. But their lesson carries over: independent, different evidence is worth more than the same evidence repeated. Three looks by the same camera share its blind spots; one look by the camera, one by a roughness probe and one by an operator each fail in different ways, so their combined errors are much rarer. Chapter 6 shows how to combine such checks, each weighted by how informative it is, and why the result can be far more reliable than any majority of identical looks.

## Keeping the readings

Every policy in this chapter depends on knowing what was actually done at the gauge, and the simplest safeguard is to log every reading, not just every decision. A gauge that records the bush's serial or sequence number, each reading, the time and the decision gives the quality engineer three things. It shows the repeat-measurement pattern directly: bushes measured several times, with the last reading just inside the limit, are the signature of measuring until a pass. It provides the data for the process prior, because the first reading of every bush is a sample of the process, measured with known uncertainty. And it makes the monthly audit sharper, because the audit can concentrate on bushes accepted from readings near the limit, where escapes come from, rather than sampling accepted bushes at random. Many electronic gauges and air gauge columns can export their readings; where a gauge cannot, a tally sheet of repeat measurements kept beside it is a cheap substitute. Either way, the record should be reviewed, not just kept: a weekly glance at how many bushes were measured more than once, and by whom, takes minutes and catches drifting habits early.

## The error: measuring until it passes

This is an illustration. A new operator at the air gauge, wanting to avoid scrapping good bushes, began re-measuring every bush that read outside the green band, up to three times, and accepting it if any reading was inside. Nobody had told the operator not to; nobody had told the operator to, either.

The monthly audit of accepted bushes, measured on the bench gauge, found it. The audit usually found about one oversize bush in 6,000 accepted, consistent with the 0.34 escapes a shift expected at the cost-based limits; for the new operator's shifts, it found about three times as many. The air gauge's log of readings showed the pattern: bushes with two or three readings, the last just inside the limit. The calculation above explained it: re-measuring until a pass nearly triples escapes.

The correction was a written rule, displayed at the gauge: one reading decides; a bush in the red band goes to the bench gauge queue, not back under the plug. The operator had been trying to do the right thing, and the rule explains why the intuitive way to save good bushes is the wrong one.

## Exercise: majority of three on the camera

This is an illustration. With the camera's sensitivity of 95% and false-call rate of 2%, assume three independent looks at each bush and a majority decision.

1. What are the majority's false-call rate and sensitivity?
2. In a shift of 2,000 bushes at 0.6% chatter, how many good bushes are rejected and how many bushes with chatter escape?
3. What share of rejects truly have chatter?

**Worked answer.**

1. False-call rate: 3 × 0.02² × 0.98 + 0.02³ = 0.001176 + 0.000008 = **0.118%**. Sensitivity: the majority is right if at least two looks catch the chatter: 0.95³ + 3 × 0.95² × 0.05 = 0.8574 + 0.1354 = **99.3%**.
2. Good bushes: 1,988 × 0.00118 = **2.4** rejected. Bushes with chatter: 12 × (1 − 0.9928) = **0.09** escape.
3. Rejects that are truly bad: 12 × 0.9928 = 11.91; total rejects 11.91 + 2.35 = 14.26; share **83.5%**, against 22.3% for one look. The improvement holds only if the three looks' errors are independent.
