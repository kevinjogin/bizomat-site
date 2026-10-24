---
book: oxy-fuel-by-the-numbers
chapterSlug: the-cost-of-a-metre-of-cut
order: 9
title: "The cost of a metre of cut"
description: "Build the cost of a metre of cut from time and gas, compare the 1921 costing with modern cost splits, and see when a faster, hungrier setting pays and when it does not."
draft: false
---

A metre of cut costs the time it takes plus the gas it burns, and almost every argument about cutting settings is an argument about the balance between those two. The 1921 investigators ranked their torches by cost per linear foot of cut, and the method they used is still the right starting point. What has changed is the balance. Labour and overheads now dwarf gas in most workshops, and that changes which settings are economical.

This chapter builds the cost per metre for the three base-plate settings, compares it with the 1921 approach and with a modern cost split, and finds a result that the 1921 report would not have predicted.

## How the 1921 report costed a cut

To compare torches on economy, the investigator had to fix prices, and he was frank that any fixed values were open to criticism. Labour was costed at 80 cents an hour, from the standard pay schedule of the United States Naval Gun Factory for the summer of 1920. Oxygen was valued at $1.50 and acetylene at $2.75 per hundred cubic feet, the prices at which the Bureau had been supplied, excluding transport. In metric terms, that is about US$0.53 per cubic metre of oxygen and US$0.97 per cubic metre of acetylene, with acetylene about 1.83 times the price of oxygen per unit volume.

Only gas and labour were included. The report left out equipment maintenance, overheads and secondary supplies, on the reasoning that management and local conditions would control those so strongly that any assumption about them would mislead. Before settling on the prices, it recalculated some results with different ratios of oxygen to acetylene price and found that any reasonable change altered the ranking of the torches only slightly. That sensitivity check is good practice: a ranking that holds across plausible prices can be trusted further than one that depends on a single figure.

## The modern balance

TWI's application note on oxyfuel cutting gives a typical breakdown of cutting cost: about 50% overheads, 30% handling labour, 18% cutting labour and only 1 to 2% gas. The exact split varies with the work, the number of torches and the degree of mechanisation, but the message is robust. In most modern work, the gas is a small part of the cost of a cut part, and the time spent cutting and, even more, handling the work is the large part.

That reverses the emphasis of the 1921 cost study, where gas was a large share of a cost that left out overheads and handling. It does not make the 1921 findings wrong. It means that a setting which saves gas but cuts more slowly can be uneconomical today even if it would have won in 1921, and that a setting which uses more gas to cut faster can pay, as long as it does not create work elsewhere.

## Cost per metre

The cost per metre of cut is the hourly cost of everything that runs while the torch is cutting, divided by the cutting speed.

```figure
type: formula
title: Cost of one metre of cut
formula: C = (R + Q_O × P_O + Q_A × P_A) ÷ v
caption: This is an illustration at setting B with an hourly rate of A$110, oxygen at A$5.50/m³ and acetylene at A$22.00/m³, all excluding GST.
- R | hourly rate for operator, machine and overheads, A$/h
- Q_O, Q_A | total oxygen and acetylene flows, m³/h
- P_O, P_A | gas prices, A$/m³
- v | cutting speed, m/h
step: C = (110 + 5.15 × 5.50 + 0.50 × 22.00) ÷ 24
step: C = (110 + 28.33 + 11.00) ÷ 24
step: C ≈ A$6.22 per metre
```

The prices are an illustration, not quotations. They are stated excluding GST. A GST-registered business normally claims GST on its inputs as a credit, so its costing is done excluding GST; with GST at 10%, the rate would be A$121 an hour and the gases A$6.05 and A$24.20 per cubic metre. The ATO's guidance on GST credits governs how that applies to a particular business. The illustrated acetylene costs four times as much as oxygen per cubic metre, against about 1.83 times in 1921, so the preheat flame weighs more heavily in the gas cost than it did then.

Applying the formula to the three settings gives the following.

```figure
type: compare
title: Cost per metre for the three settings, 25 mm plate
cols: Cutting time | Gas | Total
caption: This is an illustration at A$110 an hour, oxygen A$5.50/m³ and acetylene A$22.00/m³, excluding GST.
- A, chart | A$4.82 | A$1.97 | A$6.80
- B, trimmed preheat | A$4.58 | A$1.64 | A$6.22
- *C, high oxygen | A$4.37 | A$1.82 | A$6.19
```

Over the 96 m job, setting A costs about A$652.80, setting B about A$597.12 and setting C about A$594.24. Setting A is simply worse: slower, with more acetylene, and A$55.68 dearer than B over the job. It is the 1921 oversized preheat flame with a modern price on it.

## The surprise: setting C is cheaper by a hair

Setting C uses 26% more cutting oxygen than setting B to cut 5% faster, the diminishing return that Chapter 8 described. On the 1921 reasoning it should be the less economical setting. At A$110 an hour, it is not. It saves about 0.12 minutes per metre (2.50 against 2.38), worth about A$0.21 of operator and machine time, and spends about A$0.18 more on gas, so it comes out about A$0.03 per metre, or A$2.88 over the job, cheaper.

The result depends on the hourly rate. Setting C's gas costs A$45.93 an hour against setting B's A$39.33, and its extra speed saves a fixed fraction of the time. Solving for the rate at which the two settings cost the same gives about **A$93 an hour**. Below that rate, setting B is cheaper; above it, setting C is. In 1921, with labour at 80 cents an hour, gas dominated and the economical torches were those that used gas well. Today, with labour and overheads dominant, a setting that uses gas less well but cuts faster can win.

```figure
type: bars
title: Job cost for 96 m of cut, three settings
unit: A$
max: 720
caption: This is an illustration. C is A$2.88 cheaper than B on cutting alone; adding one minute of grinding per plate to remove C's gouges makes it about A$107 dearer.
- A, chart | 652.80
- B, trimmed preheat | 597.12
- C, high oxygen | 594.24
- *C plus 1 min grinding per plate | 704.24
```

That is not the end of the comparison. Setting C left local gouging on the cut face, and Chapter 8 recorded that the workshop needed square, clean edges because stiffeners would be welded to the plates. If removing C's gouges takes even one minute of grinding per plate, at A$110 an hour that is about A$1.83 a plate, or A$110 over the 60 plates. Setting C's A$2.88 advantage becomes a disadvantage of about A$107. The cheapest setting is the one with the lowest total cost to a finished part, not the lowest cost per metre of cut.

## Which input matters most

The 1921 report tested whether its ranking survived changes in gas prices. The same check on the base-plate cost shows which inputs deserve the most care. This is an illustration. Changing each input of setting B by 10%, one at a time, moves the cost per metre of A$6.22 as follows.

```figure
type: bars
title: Change in setting B's cost per metre for a 10% change in one input
unit: A$ per metre
max: 0.75
caption: This is an illustration. Speed and the hourly rate dominate; a 10% change in the acetylene price moves the cost by under five cents a metre.
- *Speed 10% lower | 0.69
- Speed 10% higher | 0.57
- Hourly rate 10% higher | 0.46
- Oxygen price 10% higher | 0.12
- Acetylene price 10% higher | 0.05
```

A 10% fall in speed adds about A$0.69 a metre; a 10% rise saves about A$0.57, the two differing because cost goes with the inverse of speed. A 10% change in the hourly rate moves the cost by about A$0.46. A 10% rise in the oxygen price adds about A$0.12, and in the acetylene price about A$0.05. The order matters for where effort goes. Measuring the real cutting speed, as Chapter 1 did, and protecting it, as Chapters 4, 7 and 8 showed, is worth far more than negotiating a few per cent off the gas.

## More torches, same operator

Profile-cutting machines often carry several torches cutting identical parts at once. The operator, machine and overhead cost is then shared among the torches, while the gas multiplies with them. This is an illustration. If the base plates could be cut three at a time at setting B, the hourly rate of A$110 would be spread over 72 m of cut an hour instead of 24 m, while the gas would still cost about A$1.64 per metre of cut. The cost per metre falls to about (110 + 3 × 39.33) ÷ 72 ≈ **A$3.17**, roughly half the single-torch figure.

Two things follow. Multi-torch cutting is a large saving whenever the parts are repeated and the plate can be nested for it. And as the time cost per metre falls, the gas becomes a larger share of the cutting cost, about 52% in this example, so settings that waste gas cost more on a multi-torch machine than on a single torch. The 1921 attention to gas economy returns, in a different form, wherever the time cost is shared widely. Handling, which TWI's split shows as the largest share of a typical cut part, is not shared in the same way and still has to be added for each part.

## The part, not the metre

The cost of a base plate includes handling: loading the plate, setting up the track, marking out, moving the cut plates and clearing slag. This is an illustration. If handling takes 6 minutes a plate at the same hourly rate, it costs A$11.00 a plate. At setting B, each plate's 1.6 m of cut costs A$7.33 in cutting time and A$2.62 in gas, so the total is about **A$20.95 per plate**.

```figure
type: stats
title: Where a base plate's cost goes, setting B
caption: This is an illustration. Handling is the largest share, as in TWI's typical split; gas is larger here than TWI's 1 to 2% because the case uses one torch and the hourly rate already includes overheads.
- *52.5% | Handling | 6 min per plate
- 35.0% | Cutting time | 1.6 m at 24 m/h
- 12.5% | Gas | oxygen and acetylene
```

Handling is more than half the cost. A setting that saved 10% of the gas would save about A$0.26 a plate; a better way of loading and unloading the track machine that saved one minute of handling would save about A$1.83. The 1921 report's decision to leave handling out of its costing made sense for comparing torches. It would make no sense for pricing a job.

## Hand cutting and machine cutting

The 1921 comparison of hand and machine cutting found the machine about 25% faster on 1/2 inch plate with the same torch and pressures. This is an illustration. Applying the same relationship to setting B, a hand cutter would manage about 320 mm/min, 19.2 m/h, against the machine's 24 m/h. With the same flows, the cost per metre rises to about A$7.78, and the 96 m job would take about 5.0 hours of cutting instead of 4.0. The relationship comes from one 1921 test on one thickness and should be replaced by the workshop's own measurement, but it shows that whether a cut is made by machine or by hand belongs in the estimate.

## A failure: the quote that priced the gas

This is an illustration. Before the base-plate job, an estimator priced a similar order of 60 plates by calculating the gas at setting B, A$2.62 a plate or A$157.20 in all, and adding the cutting time, A$7.33 a plate. The quote came to about A$597 for cutting. The job's actual cost, with handling included, was about A$1,257. The missing A$660 was the handling, more than half the true cost, which the estimate had left out in the same way the 1921 costing did, but for a very different purpose.

The error was found when the job's recorded hours were compared with the quote. The workshop's estimating sheet was changed to build each cut part from three lines, handling time, cutting time and gas, with the cutting speed and flows taken from the settings sheet rather than from a nozzle chart. Building the cost from separate lines in this way is the approach of a job cost estimate; the KEVOS® WORKOS [Job Cost Estimate](/tools/job-cost/) tool sets out the same structure for a whole job.

## Other costs to remember

The formula covers the costs that run with the torch. A full estimate also allows for cylinder rental and delivery, which are fixed costs that grow with the number of cylinders kept on site; nozzles and other consumables; pierces and restarts, which take time without producing length; slag removal, grinding and rework; and the time spent on trial cuts and setting up. Chapter 3's acetylene withdrawal limit may add a manifold and extra cylinder rental for a heavy heating job. None of these appears in a cost per metre, and all of them appear in the job's result.

Pierces are a good example of a cost that hides between the metres. This is an illustration. If a part has to be started with a pierce rather than from the plate edge, and the pierce takes 30 seconds of preheating and burning through before the torch can travel, it costs about 110 × 30 ÷ 3,600 ≈ A$0.92 of time before the gas, and it is the moment when nozzles are most often damaged. On the base plates, each cut from the edge of a strip avoids that cost. On a part with internal cut-outs, the number of pierces can matter as much as the length of cut, and the estimating sheet should count both.

## Exercise: the cost of cutting by hand

Using the 1921 relationship that machine cutting was about 25% faster than hand cutting, calculate the cost per metre and the job cost for cutting all 96 m by hand at setting B's flows, and the difference from cutting by machine.

Hand speed is 24 ÷ 1.25 = **19.2 m/h**. Cost per metre = (110 + 5.15 × 5.50 + 0.50 × 22.00) ÷ 19.2 = 149.33 ÷ 19.2 ≈ **A$7.78**. Over 96 m, that is about **A$747**, against A$597.12 by machine, a difference of about A$150 for the cutting alone, before any difference in edge quality or rework. Gas per metre also rises, from about A$1.64 to about A$2.05, because the same flows run for longer. Explain why investing in a track machine is usually justified by time rather than by gas.
