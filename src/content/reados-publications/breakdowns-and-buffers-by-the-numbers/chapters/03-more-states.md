---
book: breakdowns-and-buffers-by-the-numbers
chapterSlug: more-states-and-the-balance-equations
order: 3
title: "More states and the balance equations"
description: "Splitting stops into minor jams and breakdowns: a three-state Markov model, its balance equations and detailed balance, slower settling, long-stop risk, and availability inside OEE."
draft: false
---

Chapter 1 ended with two records of the same bagger that disagreed, and Chapter 2 found that the bagger's repair times were far more variable than a single exponential allows. Both point to the same fix. The bagger does not have one kind of stop; it has at least two: short jams that the operator clears in a few minutes, and breakdowns that need a fitter for about an hour. A model with one stopped state averages them into a 15-minute stop that almost never happens. A model with two stopped states describes what actually happens, and answers questions that the average cannot.

This chapter builds the three-state model, solves its balance equations, shows why the long-run availability is unchanged while almost everything else changes, and follows the model through the hour after a restart. It links the result to overall equipment effectiveness with the WORKOS OEE tool, and ends with a scrap estimate for long stops that was four times too low because it used the two-state average.

## Three states

This is an illustration. Splitting the bagger's month by who restarted the machine gave two streams. About 114 stops, at a rate of 0.40 per running hour, were minor jams cleared by the operator in 3.75 minutes on average. About 28, at 0.10 per running hour, were breakdowns needing the fitter, averaging 60 minutes. Together they reproduce the month's 142 stops and 35.6 hours: 0.50 stops per running hour and 15 minutes per stop on average.

```figure
type: svg
title: The bagger as a three-state Markov process
alt: A circle labelled Running in the centre-left, with two circles to the right: Minor stop above and Breakdown below. Arrows go from Running to Minor stop labelled 0.40 per hour and back labelled 16 per hour; from Running to Breakdown labelled 0.10 per hour and back labelled 1.0 per hour. Long-run shares are given beside each state.
caption: This is an illustration. Each stopped state has its own restart rate: 16 per hour for a 3.75-minute jam, 1.0 per hour for a 60-minute breakdown.
viewbox: 0 0 600 270
body:
<circle class="bxa" cx="150" cy="135" r="60"/>
<circle class="bx" cx="450" cy="60" r="48"/>
<circle class="bx" cx="450" cy="210" r="48"/>
<text class="txb" x="114" y="140">Running</text>
<text class="txb" x="416" y="64">Minor stop</text>
<text class="txb" x="414" y="214">Breakdown</text>
<path class="la flow" d="M206 112L404 64"/>
<path class="ah" d="M404 64l-13-1 4-11z"/>
<path class="la flow" d="M404 82L210 130"/>
<path class="la flow" d="M206 158L404 206"/>
<path class="ah" d="M404 206l-12-6 9-8z"/>
<path class="la flow" d="M404 226L200 172"/>
<text class="tx txs" x="250" y="64">λm = 0.40 per h</text>
<text class="tx txs" x="300" y="138">μm = 16 per h</text>
<text class="tx txs" x="300" y="160">λb = 0.10 per h</text>
<text class="tx txs" x="270" y="232">μb = 1.0 per h</text>
<text class="tx txs" x="96" y="222">88.9% of the time</text>
<text class="tx txs" x="506" y="64">2.2%</text>
<text class="tx txs" x="506" y="214">8.9%</text>
```

## Getting the split from the data

The split into jams and breakdowns has to come from the log, and there are three ways to make it. The best is by who restarted the machine or what was done, which is what the bagger's records allowed: a stop with a fitter's work order is a breakdown, one without is a jam. The second is by cause code, if operators choose a reason from a short list when they restart. The third, when neither is available, is by duration: every stop longer than some threshold is called a breakdown.

The duration threshold is the weakest, because the two kinds overlap: a stubborn jam can last twelve minutes and a quick breakdown eight. A plot helps. On a chart of the share of stops longer than each duration, with the share on a logarithmic scale, a single exponential gives a straight line. The bagger's repair times give two straight sections: a steep one over the first fifteen minutes, whose slope corresponds to a 3.75-minute mean, and a shallow one beyond, whose slope corresponds to a 60-minute mean. The bend between them shows where the two populations separate, and the height at which the shallow section meets the vertical axis, about 0.2, is the share of breakdowns. Reading a mixture from such a plot is rough, but it is often enough to decide whether two states are needed.

## When to add a state

Every extra state needs data to estimate its rates, and a model with many states fitted to a month of records is mostly noise. Three tests decide whether a kind of stop deserves its own state.

- **A different resource restarts it.** Jams need the operator; breakdowns need the fitter. Any question about the fitter, the crew or spares needs breakdowns separated.
- **Its duration differs by a large factor.** A ratio of five or more between the mean durations, as here with sixteen, changes buffer and hold-time answers.
- **A different action would reduce it.** If one kind of stop would respond to training and another to spares, separating them shows what each action is worth.

The bagger passes all three. Splitting the jams further, by product clumps and film tracking for instance, would pass only the third, and is better done in a Pareto analysis of causes than in the model.

## Solving the balance equations

The method is Chapter 1's, applied to each state: in the long run, the flow into each state equals the flow out. For the minor-stop state, the flow in is the running probability times 0.40, and the flow out is the minor-stop probability times 16. For the breakdown state, the flow in is the running probability times 0.10 and the flow out the breakdown probability times 1.0. The three probabilities add to one.

```figure
type: formula
title: Steady state of the three-state bagger
formula: P_minor = P_run × λm ÷ μm and P_break = P_run × λb ÷ μb
formula: P_run = 1 ÷ (1 + λm ÷ μm + λb ÷ μb)
caption: This is an illustration. Each ratio λ ÷ μ is the time stopped per hour of running for that kind of stop. They add, which is why availability depends only on total downtime per running hour.
- Minor stops | λm ÷ μm = 0.40 ÷ 16 = 0.025 h stopped per running hour
- Breakdowns | λb ÷ μb = 0.10 ÷ 1.0 = 0.100 h stopped per running hour
step: P_run = 1 ÷ 1.125 = 0.8889, the same as the two-state model
step: P_minor = 0.8889 × 0.025 = 0.0222; P_break = 0.8889 × 0.100 = 0.0889
```

The balance here is detailed: the flow between each pair of states is balanced on its own, not just the total into each state. That always happens when the states form a tree, with no loop that the machine could travel round in one direction only, and it makes the solution a simple product of ratios. Reichl's chapter on stochastic processes calls the condition detailed balance and shows when it holds; the practical consequence is that every model in this book that is a chain or a star of states can be solved by multiplying ratios along the branches. Chapters 6 and 8 use the same trick for repair crews and spares.

## Same availability, different machine

The three-state model gives exactly the two-state availability, 88.9%, because availability depends only on the total time stopped per hour of running, 0.125 hours, however it is divided. That is the insensitivity Chapter 2 noted. But the two kinds of stop contribute very differently.

```figure
type: compare
title: The bagger's two kinds of stop
cols: Share of stops | Share of time stopped | Stops per shift | Mean duration | Who restarts
rowhead: Kind of stop
caption: This is an illustration. Ranking by count puts minor jams first; ranking by lost time puts breakdowns first. The right ranking depends on the question.
- Minor jam | 80% | 20% | 2.84 | 3.75 min | operator
- * Breakdown | 20% | 80% | 0.71 | 60 min | fitter
```

This explains the two managers of Chapter 1. The operators experience the bagger as a machine that stops constantly, almost three times a shift for jams alone. The maintenance team experiences it as a machine that needs them less than once a shift. Both are right, and a two-state model that averages them describes neither experience.

It also changes the improvement priorities. Halving the minor jams would remove 40% of the stops but only 10% of the lost time; halving the breakdowns would remove 10% of the stops and 40% of the lost time. Which matters more depends on what happens around the machine. Chapter 5 shows that a buffer absorbs short stops and passes long ones, so on a buffered line the long stops dominate even more.

## Slower settling

The three-state model settles towards its steady state more slowly than the two-state one, because breakdowns are rare and long. The master equation now has three probabilities and a 3 × 3 matrix of rates. Its solution is a sum of exponentials, one for each non-zero eigenvalue of the rate matrix. For the bagger the two eigenvalues are −16.4 and −1.10 per hour. The fast one, a time constant of 3.7 minutes, describes the minor stops settling; the slow one, a time constant of 55 minutes, describes the breakdowns.

```figure
type: line
title: Probability the bagger is running after a fresh start, two-state and three-state models
x: Minutes after a start in the running state
y: Probability of running
ymin: 0.85
ymax: 1
caption: This is an illustration. Both reach 0.889 eventually; the three-state model takes about four times as long because breakdowns, which dominate the downtime, are rare.
legend: Three-state model | Two-state model
- 0 | 1.000 | 1.000
- 15 | 0.955 | 0.925
- 30 | 0.939 | 0.901
- 60 | 0.918 | 0.890
- 120 | 0.899 | 0.889
- 180 | 0.892 | 0.889
```

The eigenvalues come from the rate matrix, whose off-diagonal entries are the rates of moving between states and whose diagonal entries are minus the total rate of leaving each state. For the bagger the non-zero eigenvalues are the roots of s² + 17.5 s + 18.0 = 0, where 17.5 is the sum of all four rates and 18.0 is μm μb + λm μb + λb μm = 16 + 0.4 + 1.6. The roots are −1.097 and −16.40 per hour. The rule of thumb is that the slowest state to leave sets the slowest settling; here it is the breakdown state, with its one-hour mean, slowed a little further by the time spent running between breakdowns.

After an hour, the two-state model says the bagger has forgotten its start; the three-state model says its probability of running is still 0.918, three points above the long-run figure. The difference is practical. A one-hour trial after a fresh start, of a new film or a new setting, will overstate the bagger's long-run availability by about three points, mostly because a breakdown has not yet had time to happen. The chance of at least one breakdown in an hour of running is 1 − e^(−0.10) = 9.5%; in a whole shift, 1 − e^(−0.71) = 51%.

## Availability inside OEE

Overall equipment effectiveness multiplies three factors: availability, performance and quality. The availability factor is the share of planned time the machine runs, which is what this chapter models. The [OEE and downtime analysis tool](/tools/oee-downtime-pro/) calculates all three from one production period: availability from the planned time and the downtime, performance from the ideal cycle time, the units produced and the running time, quality from the good and total units, and the overall figure, with a table of where the planned time went.

```figure
type: stats
title: One shift of the bagger in OEE terms
caption: This is an illustration. Planned 480 min, downtime 53.3 min (11.1%), ideal cycle 1 s a bag, 25,100 bags made, 24,850 good. The model sets the availability factor; the other two come from the shift's counts.
- 88.9% | Availability | 426.7 min running of 480
- 98.0% | Performance | 25,100 bags against 25,600 possible in the running time
- 99.0% | Quality | 24,850 good of 25,100
- * 86.3% | OEE | 0.889 × 0.980 × 0.990
```

The Markov model and OEE answer different questions. OEE describes a period that has happened; the model predicts periods that have not, including on lines that do not yet exist. Each checks the other: if the model's availability and the measured availability factor drift apart, either the machine or the data has changed.

The boundary between the availability and performance factors needs the same care as Chapter 1's definitions. Stops shorter than the threshold the plant uses for logging, often a minute or two, are not counted as downtime and show up instead as lost performance, because the machine made fewer bags in its running time than its ideal rate allows. The bagger's 98.0% performance factor includes such micro-stops. A three-state model built from a log with a two-minute threshold describes the stops above it; those below are folded into an effective running speed. Changing the threshold moves time between the two factors without changing the bags made, which is why OEE figures from plants with different logging rules cannot be compared directly.

## Jams, hands and isolation

Minor jams have a cost that the arithmetic does not show. Each is an occasion when someone reaches into or near a machine to clear it, and at 2.8 jams a shift on each of four baggers, that is about 11 such occasions a shift. Work health and safety law requires plant to be isolated, its energy controlled and stored energy released, before anyone reaches into a danger zone, and Safe Work Australia's model code of practice on managing the risks of plant sets out how. A model that shows the cost of a jam's four minutes must never be read as a reason to clear jams faster by skipping isolation. The right response to frequent jams is to remove their causes, which removes both the lost minutes and the exposure.

## The error: long stops from the average

This is an illustration. The plant's quality rule says that product sitting in the bagger's weigher for more than 60 minutes must be discarded, about 12 kg each time. To budget for it, the planner used the two-state model: if stops are exponential with a 15-minute mean, the chance that a stop exceeds 60 minutes is e^(−4) = 1.8%, which at 3.56 stops a shift is 0.065 events a shift, about 33 a year and 390 kg of product.

The engineer recalculated with the three-state model. A minor jam almost never lasts an hour: e^(−16) is negligible. A breakdown exceeds an hour with probability e^(−1) = 36.8%, and breakdowns are a fifth of all stops, so the chance that a stop exceeds an hour is 0.2 × 0.368 = 7.4%, four times the planner's figure. That is 0.26 events a shift, about 131 a year and 1,570 kg of product. The two-state model got the average right and the tail wrong, because a single exponential with a 15-minute mean has far too few long stops for a machine whose long stops are hour-long breakdowns.

```figure
type: compare
title: Stops longer than the 60-minute hold time
cols: Share of stops over 60 min | Events per shift | Events per year | Product discarded per year
rowhead: Model
caption: This is an illustration. 3.56 stops a shift, 500 shifts a year, 12 kg discarded per event. Same mean stop length, different tails.
- Two-state, exponential 15 min | 1.8% | 0.065 | 33 | 390 kg
- * Three-state, jams and breakdowns | 7.4% | 0.26 | 131 | 1,570 kg
```

The budget was corrected, and the result changed a decision as well. With 131 events a year, it became worth having the fitter's response time and the spares for the commonest breakdowns reviewed, since cutting the average breakdown from 60 to 45 minutes would reduce the share over an hour from 36.8% to e^(−60 ÷ 45) = 26.4%.

## Exercise: faster repairs for breakdowns

Suppose spares held at the line cut the bagger's average breakdown from 60 to 45 minutes, with the rates of both kinds of stop and the minor jam duration unchanged. Find the new steady-state probabilities, the availability, and the share of time stopped that is due to minor jams.

**Worked answer.** This is an illustration. The breakdown repair rate becomes 60 ÷ 45 = 1.333 per hour, so λb ÷ μb = 0.10 ÷ 1.333 = 0.075. With the minor jams' 0.025, P_run = 1 ÷ (1 + 0.025 + 0.075) = **0.9091**, P_minor = 0.9091 × 0.025 = **0.0227** and P_break = 0.9091 × 0.075 = **0.0682**. Availability rises from 88.9% to **90.9%**. Minor jams now account for 0.025 ÷ 0.100 = **25%** of the time stopped, up from 20%, because the breakdowns have shrunk. Every bagger gains about 2.0 points of availability, worth about 580 bags a shift at 60 a minute before the case packer and buffer of Chapters 4 and 5 are taken into account.
