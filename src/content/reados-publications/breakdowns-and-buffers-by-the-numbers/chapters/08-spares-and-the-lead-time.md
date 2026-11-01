---
book: breakdowns-and-buffers-by-the-numbers
chapterSlug: spares-and-the-repair-pipeline
order: 8
title: "Spares and the repair pipeline"
description: "Spares for random failures: Poisson demand over the lead time, Palm's theorem for units out for repair, service level against the cost of a stock-out, and the hours that set the failure rate."
draft: false
---

A breakdown can be repaired in an hour only if the part is on the shelf. For parts that fail at random and are repaired or replaced from far away, the spares holding decides whether a failure costs an hour or a week. Too few spares and the line waits for a courier; too many and money sits in a cupboard. The right number follows from the same mathematics as the rest of this book: failures arrive as a Poisson stream, the parts away for repair form a birth–death population, and the chance of running out is a tail probability that can be set against its cost.

This chapter sizes the spares holding for the packing lines' servo drives with the WORKOS critical spares tool, explains Palm's theorem, the result that makes repairable spares easy to calculate, and sets the service level from the cost of a stock-out rather than by habit. It ends with a holding that was one drive short because the failure rate was counted in production hours while the drives were powered all day.

## The drives and their pipeline

This is an illustration. The four packing lines use 24 identical servo drives, six on each line. The drives are electronic, their failures are random rather than wear-out, and the maker's reliability figure, confirmed by the plant's own records, is a mean time between failures of 50,000 powered hours. A failed drive is swapped for a spare in about an hour and sent to the maker's repair centre overseas, which returns it in 42 days on average. The repaired drive goes back on the shelf.

The holding works as a pipeline. Every failure takes a drive off the shelf and puts one into the repair pipeline; every return takes one out of the pipeline and puts it back. A stock-out happens when a drive fails and the shelf is empty, because every spare is in the pipeline. The question is how many drives are in the pipeline at a random moment.

## Palm's theorem

The answer is remarkably simple. If failures arrive as a Poisson stream at rate λ, and each failed unit spends a time in repair that is independent of the others, then the number of units in the pipeline at any moment has a Poisson distribution with mean λ × T, where T is the average turnaround. The shape of the turnaround distribution does not matter: a 42-day average gives the same answer whether every repair takes exactly 42 days or some take a week and others three months. The result is Palm's theorem, from the Swedish engineer Conny Palm's work on telephone traffic, and Sherbrooke's text on spares for repairable items builds on it.

For exponential turnarounds it follows from a birth–death chain like Chapter 6's. Units enter the pipeline at the constant rate λ, because each failed drive is replaced from the shelf and the installed population stays at 24; they leave at a rate proportional to the number in it, k ÷ T, because each is being repaired independently. Detailed balance gives pₖ = pₖ₋₁ × λT ÷ k, which is the Poisson distribution. Reichl's treatment of linear birth–death processes reaches the same distribution for populations with constant immigration and independent departures.

```figure
type: formula
title: Units in the repair pipeline
formula: Mean in the pipeline m = λ × T = (N × hours a day ÷ MTBF) × lead time in days
formula: P(k in the pipeline) = e^(−m) mᵏ ÷ k!
formula: Chance a failure finds the shelf empty with s spares = P(k ≥ s)
caption: This is an illustration: 24 drives powered 24 hours a day, MTBF 50,000 powered hours, 42-day turnaround. A failure finds the shelf empty when all s spares are already in the pipeline.
- Failure rate | 24 × 24 ÷ 50,000 = 0.01152 a day, 4.2 a year
- Mean in the pipeline | m = 0.01152 × 42 = 0.484
step: P(0) = 0.616, P(1) = 0.298, P(2) = 0.072, P(3) = 0.012
step: With 2 spares, a failure finds the shelf empty with probability P(k ≥ 2) = 8.5%
```

## The tool's answer

The [critical spares plan](/tools/critical-spares-poisson-plan/) performs this calculation. From the number of identical parts installed, the mean time between failures of one part, the running hours a day and the resupply or repair lead time, it calculates the expected failures across the installed parts during the lead time, the smallest number of spares whose Poisson probability of covering all failures in that time reaches the service level the user sets, the cover given by the spares actually held, and the yearly failure rate. It assumes failures at a constant rate and reminds the user to confirm that failures are random rather than wear-out before relying on it.

```figure
type: compare
title: Spares for the 24 drives from the critical spares plan
cols: Expected failures in 42 days | Spares for 95% | Spares for 99% | Cover with 1 spare | Cover with 2 spares
rowhead: Hours a day entered
caption: This is an illustration. The cover is the Poisson probability that failures in one lead time do not exceed the spares held. The hours that apply are the hours the drives are powered, not the hours the lines produce.
- 16, production hours | 0.323 | 1 | 2 | 95.79% | 99.56%
- * 24, powered hours | 0.484 | 2 | 3 | 91.47% | 98.68%
```

Two measures of service appear in this chapter, and they answer different questions. The tool's cover is the chance that the pipeline holds no more drives than there are spares, P(k ≤ s): with two spares, 98.68%. The chance that a particular failure finds the shelf empty is the chance that all the spares are already in the pipeline when it happens, P(k ≥ s): with two spares, 8.5%. They are not complements of each other, because a failure that finds exactly s drives in the pipeline counts as covered in the first measure, the pipeline not yet exceeding the spares, but finds the shelf empty in the second. Because Poisson failures see the pipeline in its long-run state, the second measure is the one that counts stock-outs, and it is the one the cost analysis below uses. A plan that quotes a service level should say which of the two it means.

## Setting the service level from costs

A service level of 95% is a habit, not a calculation. The right level depends on what a stock-out costs and what a spare costs, and the model gives both sides.

This is an illustration. When a drive fails with no spare, the line stops until an emergency replacement arrives, about five working days with air freight. Each day costs two shifts of about 24,775 bags at A$0.10, A$4,955, so a stock-out costs about A$25,000. A spare drive costs A$4,800 excluding GST; spread over five years, with an allowance for storage, insurance and the capital tied up, it costs about A$1,900 a year to hold.

```figure
type: compare
title: Stock-outs and their cost for 24 drives powered 24 hours a day
cols: Chance a failure finds the shelf empty | Stock-outs a year | Expected stock-out cost a year | Saving from one more spare
rowhead: Spares held
caption: This is an illustration. 4.2 failures a year; each stock-out about A$25,000 of lost contribution; each spare about A$1,900 a year to hold. A third spare saves about A$7,600 a year; a fourth about A$1,200, less than its holding cost.
- 1 | 38.4% | 1.61 | A$40,300 | not applicable
- 2 | 8.5% | 0.36 | A$9,000 | A$31,300
- * 3 | 1.3% | 0.055 | A$1,400 | A$7,600
- 4 | 0.16% | 0.007 | A$200 | A$1,200
```

On these figures the plant should hold three drives. The second saves far more than it costs, the third saves about four times its holding cost, and the fourth saves less than its holding cost. The cover with three spares is 99.84%, higher than either habitual target. The economic answer is often higher than 95% for parts whose stock-out stops a line, and lower for parts whose failure only slows it.

The calculation also shows what else would help. Halving the turnaround from 42 to 21 days, by a local repairer or an exchange arrangement with the maker, halves the pipeline's mean to 0.242 and cuts the stock-out chance with two spares from 8.5% to 2.5%. A shorter pipeline can be cheaper than more spares, and Palm's theorem says it is the average turnaround that counts, so a faster average matters even if some repairs still take months.

## Sharing spares

Pooling spares across lines or sites reduces the total needed, because random failures on different machines rarely coincide. This is an illustration. If each of the four lines held its own spares for its six drives, each line's pipeline would have a mean of 6 × 24 × 42 ÷ 50,000 = 0.121. One spare per line would give a cover of e^(−0.121) × (1 + 0.121) = 99.3%, so the four lines would need four spares in all, each line's cover still below the pooled figure. The pooled holding reaches 99.84% with three. Pooling works as long as a spare can reach any line quickly, which for drives in one building is minutes. Across sites, the transport time adds to the stock-out cost and the advantage shrinks.

## Keeping the pipeline honest

The model needs two numbers from the plant's records, the failure rate and the average turnaround, and both drift if nobody watches them. A spares register that records, for each serial number, the date it failed, the date it was dispatched for repair and the date it came back gives the real turnaround, including the days a failed drive sat on a bench before anyone sent it. This is an illustration. When the register was first kept for the drives, the maker's 42-day repair time turned out to be 42 days at the repair centre plus an average of 9 days at the plant waiting to be packed and shipped. The real turnaround was 51 days, and the pipeline's mean 0.588, not 0.484. Shipping failed drives within two days of the failure was a cheaper fix than a fourth spare.

The register also shows whether repaired units are as reliable as new ones. If repaired drives fail again sooner than new ones, the failure rate is higher than the maker's figure, and the plant may be better served by exchange units or by replacing rather than repairing. The model is only as current as the register behind it, and the register costs a few minutes per failure.

## Wear-out parts and new lines

Palm's theorem and the critical spares plan assume random failures. Parts that wear out, the heaters of Chapter 2, cutting knives, belts and bearings, fail more often as they age, and their demand depends on how many are installed at each age. For them, the spares holding should follow the replacement plan: if heaters are replaced on a schedule, the spares needed are mostly the scheduled replacements, which are known in advance, plus a small allowance for those that fail early. The WORKOS directory includes Weibull-based tools for such fleets; the Poisson model is the right one only for random failures.

A new line has no history at all. Its first spares plan must use the makers' reliability figures, which are often optimistic for a particular duty, and should allow for the early failures that follow installation. A practical approach is to plan the first year's holding with the makers' rates and a margin, record every failure, and rerun the plan at the end of the year with the plant's own rates. One year of data on 24 drives, about four failures, is not much, but it is enough to show whether the makers' figure is roughly right or badly wrong.

## The error: production hours for a powered part

This is an illustration. The first spares plan for the drives used 16 hours a day, the production hours, in the critical spares plan. It gave 0.323 expected failures in the lead time, one spare for 95% cover and two for 99%, and the plant bought two.

The engineer reviewing the plan noticed that the drives' failure records included failures discovered at start-up on Monday mornings, after the weekend, and failures on nights when the lines were not producing. The drives stay powered all day and every day, with their control cabinets energised for cooling and communication; electronic failures depend on powered hours, not production hours. With 24 hours a day, and counting the weekends, the expected failures in the lead time rose by half to 0.484, the cover from two spares fell from 99.56% to 98.68%, and the cost-based analysis above called for three.

The mistake was in the clock, not the formula. The hours entered must be the hours during which the part can fail. For a mechanical part that wears only while moving, they are running hours; for an electronic part that is powered continuously, they are calendar hours; for a seal that ages whether or not it is used, they may be calendar hours too. The plan was rerun with 24 hours a day, a third drive was bought, and the hours basis was written into the spares register next to each part.

## Exercise: a faster repair arrangement

The maker offers an exchange service: a repaired drive is sent as soon as a failed one is reported, cutting the effective turnaround to 21 days. With 24 drives powered 24 hours a day and an MTBF of 50,000 hours, find the expected failures in the lead time and the cover with one, two and three spares. How many spares does the cost analysis now support?

**Worked answer.** This is an illustration. The expected failures in 21 days are 24 × 24 × 21 ÷ 50,000 = **0.242**. The Poisson probabilities are P(0) = e^(−0.242) = 0.785, P(1) = 0.190 and P(2) = 0.023, so the cover is **78.5%** with no spares, **97.5%** with one, **99.8%** with two and about **99.99%** with three. A failure finds the shelf empty with one spare with probability 1 − 0.785 = 21.5%, about 0.90 stock-outs a year at 4.2 failures a year; with two, 2.5%, about 0.10 a year; with three, 0.2%, about 0.008 a year. At A$25,000 a stock-out, the second spare saves about A$20,000 a year and the third about A$2,400, each more than its A$1,900 holding cost, though the third only just. Two or three drives would be defensible, against three under the 42-day service; the exchange service's fee should be compared with the cost of the drive it saves.
