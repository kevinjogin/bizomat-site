---
book: breakdowns-and-buffers-by-the-numbers
chapterSlug: from-model-to-decision
order: 10
title: "From model to decision: what to fix first"
description: "Pricing a minute of downtime, ranking improvements by the output they add on a buffered line, wear-out parts on a schedule, checking predictions against results, and the Pareto chart that misled."
draft: false
---

The models in this book exist to answer one question well: of all the things that could be done to a line, which buys the most output for the money? The answer is rarely obvious. The machine that stops most often may not be the one that costs most, a buffer may absorb exactly the stops an improvement programme targets, and a person may be worth less than a box of spare parts. A model that has been built from the line's own records and checked against its output can rank the options before any money is spent, and then check afterwards whether the chosen one delivered.

This chapter prices a line-hour with the KEVOS® downtime cost tool, ranks six options for the packing lines on the buffered line model, sets a replacement interval for the bagger's wear-out heaters with the preventive replacement tool, and sets out how to check predictions against results. It ends with an improvement project chosen from a Pareto chart of stop counts, which the model showed would add almost nothing.

## The price of a line-hour

This is an illustration. When line 1 stops, it loses 60 bags a minute at A$0.10 each, A$360 an hour of contribution, if the lost bags are not made up later. Three operators stand idle at a loaded rate of A$55 an hour. A restart after a long stop scraps about A$40 of film and product.

The [downtime cost tool](/tools/downtime-cost/) adds these up. From the hours of downtime, the lost contribution per operating hour, the people affected, their loaded labour rate and a restart or recovery cost, it calculates the lost contribution, the idle labour, the restart cost, the total and the cost per downtime hour. It warns against counting labour twice, if the contribution figure already includes it, and notes that lost output made up later with overtime or spare capacity costs the overtime instead of the contribution.

```figure
type: stats
title: One hour of line 1 stopped
caption: This is an illustration. Downtime 1 h, contribution A$360 an hour, 3 people at A$55, restart A$40; all excluding GST. The rest of this chapter values gains at A$0.10 a bag, the contribution alone, because the operators are paid for the shift either way.
- A$360 | Lost contribution | 3,600 bags at A$0.10
- A$165 | Idle labour | 3 people for 1 hour
- A$40 | Restart and recovery | scrap after a long stop
- * A$565 | Total for the hour | the tool's estimate
```

The tool's warning matters here. The operators are paid whether the line runs or not, so for decisions about improvements the gain is the extra bags' contribution, not the labour. Labour becomes a real saving only if better output lets the plant cut overtime or shifts. The rest of the chapter values gains at A$0.10 a bag over 500 shifts a year, per line.

## Six options for each line

Chapters 3 to 9 suggested several improvements. Each was run through the buffered line model of Chapter 5, with the bagger's stops as Chapter 3's jams and breakdowns and the case packer's as Chapter 5's mixture, so that the buffer's effect on each is counted. The base case, the line as it is, makes 24,777 bags a shift.

```figure
type: compare
title: Options for each packing line, from the buffered line model
cols: Extra bags a shift | Extra contribution a year | Cost, excluding GST | First-year net
rowhead: Option
caption: This is an illustration. Simulated with the line's measured stop rates and durations; 500 shifts and A$0.10 a bag. Costs are illustrative quotations per line. The case packer jam project and the conveyor extension are the weakest; the bagger's stop rate and repair kits are the strongest.
- Bagger stops cut by 30%: splice kits, training, routine checks | 826 | A$41,300 | A$15,000 a year | A$26,300
- * Bagger breakdown kits and fault guide, 48 to 40 min of work | 418 | A$20,900 | A$3,000 once, A$750 a year | A$17,150
- Case packer breakdowns cut from 48 to 30 min: spares at the line | 316 | A$15,800 | A$8,000 once, A$2,000 a year | A$5,800
- Buffer extended from 5 to 20 min | 246 | A$12,300 | A$60,000 once | −A$47,700
- Case packer carton jams cut by 25% | about 12 | about A$600 | A$10,000 a year | −A$9,400
- Second fitter on each shift, shared by four lines | 418 | A$20,900 | A$57,500 a year, a quarter of A$230,000 | −A$36,600
```

The ranking follows from the earlier chapters. The bagger is the line's largest source of lost time, and cutting its stop rate gains most. Its breakdowns are long enough to pass straight through the buffer, so cutting their length pays almost bag for bag, and Chapter 6 showed that shorter work also shortens the wait for the fitter. A second fitter buys the same 418 bags as the repair kits but costs many times as much. The case packer's breakdowns are worth shortening too. The buffer extension pays back only over five years, because the case packer's stops are mostly too short or too long for it, as Chapter 5 found. And the case packer's carton jams, short enough to be swallowed whole by the existing five-minute buffer, are not worth attacking for output at all.

## Is the ranking robust?

Chapter 1 warned that a month of data gives the bagger's stop rate only to within about ±16%, a range of about 0.42 to 0.58 stops per running hour. A ranking that flipped within that range would not be a sound basis for spending money. The engineer reran the four main options at both ends.

```figure
type: compare
title: Extra bags a shift from each option at the ends of the bagger's likely stop rate
cols: Bagger at 0.42 stops an hour | Bagger at 0.50, central | Bagger at 0.58 stops an hour
rowhead: Option
caption: This is an illustration. Each column is a separate run of the buffered line model; the base output is 25,211, 24,777 and 24,363 bags a shift respectively. The order of the options does not change.
- * Bagger stops cut by 30% | 714 | 826 | 925
- Bagger breakdown kits | 363 | 418 | 469
- Case packer breakdowns shortened | 328 | 316 | 306
- Buffer extended to 20 min | 253 | 246 | 239
```

The order holds across the range. The bagger options are worth more if the bagger is worse than the central estimate and less if it is better, as expected, and the case packer and buffer options move little. At the low end, the case packer spares come close to the bagger kits, but they never change places, and both stay well above the buffer extension. A decision that holds across the data's uncertainty can be made now; one that flipped would justify another month of records first.

## Making the case

The model's output becomes a business case with three more steps. The costs must be stated on one basis, here excluding GST, since a registered business claims the GST on its purchases back as input tax credits; the plant's accountant confirms the treatment. The gains must be the contribution the extra bags actually earn: if the plant cannot sell more bags, the gain is the overtime or the shifts the extra output saves, which the downtime cost tool's own warning points to. And the uncertainty must be shown, with the range above, so that the decision-maker sees how firm the numbers are.

A one-page summary that gives the prediction, the assumptions, the range and the check planned for three months later is usually enough. It is also the page that the check described later in this chapter starts from.

## Combining options

Improvements interact, so a package is not the sum of its parts. Running the model with the three strongest measures together, the bagger stop-rate programme, the bagger breakdown kits and the case packer spares, gives 26,260 bags a shift, 1,483 more than the base case. The three measures alone add up to 826 + 418 + 316 = 1,560, so the package delivers about 95% of the sum: once the bagger stops less often, there are fewer breakdowns for the kits to shorten. For all four lines the package is worth about 4 × 1,483 × 500 × A$0.10 = A$297,000 a year in contribution, against costs of about A$71,000 a year once the kits are bought.

```figure
type: bars
title: Bags a shift on one line, from the limit to the output
max: 30000
caption: This is an illustration. The bagger at full speed for a whole shift would make 28,800; its own stops alone would leave 25,600; with the case packer's stops and the coupling, the line as built makes 24,777. The package recovers 1,483 of the 4,023 bags lost.
- Bagger at full speed, no stops | 28800
- Bagger's own stops only, as built | 25600
- * Line with the package of three measures | 26260
- Line as built | 24777
```

The funnel shows something else worth stating. Even after the package, the line makes 26,260 bags a shift against the 28,800 its bagger could make at full speed with no stops. The remaining gap is the next round of work, and the model is ready for it.

## Wear-out parts on a schedule

Chapter 2 set the bagger's heat-seal heaters aside, because they wear out and a Markov model treats every stop as random. They get their own calculation. The [preventive replacement interval plan](/tools/maintenance-interval-plan/) handles wearing parts with Weibull failure data. From the shape, the characteristic life, the cost of a planned replacement and the cost of a failure, it calculates the reliability, hazard rate, B10 life and mean life; the interval that gives a target reliability; the age-replacement cost per operating hour; the interval with the lowest cost; the run-to-failure cost per hour; and the yearly saving at the interval chosen.

This is an illustration. The heaters fit a Weibull shape of 3 and a characteristic life of 2,500 running hours. A planned replacement during a cleaning stop costs A$300 in parts and labour; a failure in production costs about A$1,500, including the breakdown and the scrap. The tool gives a lowest-cost interval of about 1,260 running hours, a cost of A$0.36 an hour against A$0.67 an hour for running to failure, and a saving of about A$1,230 a year per bagger at 4,000 hours a year. Replacing at 1,260 hours, the heaters survive to replacement 88% of the time; the B10 life, 1,181 hours, is close to the optimum, which is common for a shape near 3.

The interval has to fit the plant's routine to be followed. The baggers run about 4,000 hours a year, so 1,260 running hours is about every sixteen weeks. The plant set the replacement for the cleaning stop nearest to each heater's 1,200th running hour, read from the machine's hour counter, which puts it a little before the optimum where the cost curve is flat: at 1,181 hours the cost is A$0.365 an hour, almost identical to the optimum's A$0.364. Recording the hours at each replacement, and the hours at any heater that fails early, keeps the Weibull fit current, and if the shape turns out lower than 3 the interval will move.

The schedule also removes some breakdowns from the Markov model's stream, which the next update of the model will show as a slightly lower breakdown rate.

## Checking predictions against results

A model that is never checked is only an opinion with arithmetic. This is an illustration. Before the package was introduced, the engineer wrote down the predicted output for each line, 26,260 bags a shift, and the conditions it assumed: the stop rates and durations after the change, the buffer, the speeds. After three months the lines averaged 26,050 bags a shift, 0.8% below the prediction. The log showed why: the bagger's stop rate had fallen by 26% rather than 30%. Rerunning the model with the measured rate gave 26,160, within half a per cent of the result.

```figure
type: checklist
title: Before and after an improvement
caption: This is an illustration. Writing the prediction down before the change is what makes the check honest.
- x Prediction written down, with the stop rates and durations it assumes
- x Same definitions of stops and scheduled time before and after, Chapter 1
- x Enough time after the change for the c chart to show a stable new rate, Chapter 2
- x Model rerun with the measured new rates and compared with the measured output
- ? Gap between prediction and result explained, and the model updated
```

That check did two jobs. It confirmed that the model was a good description of the line, so the next round of options could be ranked with confidence. And it showed where the programme had fallen short, the bagger's stop rate, which became the focus of the next quarter's work.

## The error: the tallest bar on the Pareto chart

This is an illustration. Before the model was built, the plant's improvement team had ranked the line's stops by count. The case packer's carton jams topped the chart, because they happened more often than any other single cause. The team proposed a A$10,000-a-year programme to cut them by a quarter, with new carton magazines, supplier tests and operator training.

The model gave the project a value of about twelve bags a shift, A$600 a year. The carton jams average three minutes, and the five-minute buffer absorbs almost all of them: while the case packer clears a jam, the bagger keeps filling the conveyor, and the case packer catches up within the hour. The jams cost the case packer's operator effort, but they cost the line almost no bags.

The team's mistake was ranking by the wrong measure. A Pareto chart of counts is the right tool for finding the commonest cause of a symptom, but the line's output is lost through the stops the buffer cannot absorb, which are the long ones and the upstream ones. Re-ranked by bags lost, using the model, the chart put the bagger's breakdowns and jams first and the case packer's breakdowns second, which is the order of the options above. The carton jam project was kept as a smaller operator-effort and safety project, since each jam is still a hands-in-the-machine event that Chapter 3's isolation rules govern, but its output justification was dropped. The team now draws two Pareto charts for every line, one of stop counts and one of bags lost from the model, and starts improvement work from the second. When the two charts disagree, the disagreement itself is informative: it marks the stops that the buffer, or the line's speed margin, is already handling.

## Exercise: the package without the stop-rate programme

Suppose the bagger stop-rate programme cannot be funded this year, and only the bagger breakdown kits and the case packer spares go ahead. From the table, estimate the extra bags a shift if the two measures did not interact, and the contribution a year per line and for four lines. Why is the true combined figure likely to be close to the sum in this case?

**Worked answer.** This is an illustration. The two measures add 418 + 316 = **734 bags a shift** if they do not interact, worth 734 × 500 × A$0.10 = **A$36,700 a year per line** and **A$146,800 a year for four lines**. Their first-year costs are A$3,750 and A$10,000 per line, A$13,750 in all, so the first-year net is about **A$22,950 per line**. The two measures act on different machines and on long stops in both cases: the kits shorten the bagger's breakdowns, which pass through the buffer, and the spares shorten the case packer's, which overflow it. Neither changes how often the other's stops happen, so their effects overlap only where a long bagger stop and a long case packer stop coincide, which is rare. The sum is a good estimate. Running the model with both measures gives 25,522 bags a shift, 745 more than the base case, slightly above the sum because shorter bagger breakdowns also leave the buffer fuller when the case packer next stops. Running it took a minute, and should always be done before the purchase order.
