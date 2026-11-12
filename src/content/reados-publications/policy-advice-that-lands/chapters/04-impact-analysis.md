---
book: policy-advice-that-lands
chapterSlug: impact-analysis
order: 4
title: "Impact analysis"
description: "Compare policy options by who pays and who gains: the base case, present values, benefit–cost ratios, net benefit, sensitivity tests and impacts you cannot price."
draft: true
---

A shortlist is not yet advice. A minister choosing between options needs to know what each would change, for whom and at what cost, and how far the numbers can be trusted. Impact analysis compares each option with the base case, turns future amounts into today's dollars, and tests the answer against its assumptions.

This is an illustration. After the workshop on Tue 12 Oct 2027, the Strategy and Policy Branch of the Northfield Regional Infrastructure Office (NRIO) had four options and a base case (Chapter 3). Tom Becker had less than three weeks to compare them before the options paper went to the Minister on Fri 29 Oct 2027. His numbers had to be sound enough to rely on, and honest enough to hold when the senior adviser pressed for the biggest option.

## Start with who pays and who gains

An impact analysis looks at the whole community, not only the Commonwealth's budget. Before any number goes in, list everyone an option touches and what changes for them, so that you do not count only the effects that are easy to price.

This is an illustration. Tom's list for Option C, the central assessment service:

| Who | What C costs them | What C gives them |
| --- | --- | --- |
| The Commonwealth | A$14.5 million over four years, then data register upkeep | Nothing directly; it pays for benefits others receive |
| Councils | Staff time to nominate bridges and give access; repairs that assessments bring forward | Fewer emergency closures and repairs; reliable data on their own bridges |
| Heavy vehicle operators | New limits where a bridge proves weaker than its current limit assumes | Shorter trips where limits are lifted or eased |
| Farm businesses and regional towns | Nothing | Part of the operators' savings, if freight rates fall |
| Everyone who crosses the bridges | Nothing | Unsafe bridges found and acted on |

Two rows need care. NRIO's payments to engineering firms are the cost of C: count them once, not again as the firms' benefit. And if operators pass savings on in lower freight rates, the saving has moved, not grown. A payment or price change that moves value from one party to another without creating any is a transfer. Transfers matter for who gains, but add nothing to the total. Counting one twice is this chapter's "When it goes wrong".

## Measure every option against the base case

A benefit is a difference: what happens with the option, minus what would happen without it. This is an illustration. The base case, Option A, is the "without". It is not zero. Councils keep paying for some assessments, most limits stay, and operators keep paying for detours.

This is an illustration. Tom's estimate in Chapter 2 put the cost of the 410 precautionary limits that councils reported at about A$9 million a year. Assessments are expected to let about 40 per cent of the 410 limits be lifted or eased, but Tom counted A$2.7 million a year of avoided detour costs, which is 30 per cent of the A$9 million. Some limits will only be eased, not lifted, so some trucks still detour, and the bridges likely to be eased carry less than average traffic. Earlier detection adds A$0.9 million a year of avoided emergency closures and repairs, so C's benefits are A$3.6 million a year in all (Figure 1).

```figure
type: stack
title: Option C's yearly benefits, by source
unit: A$m a year
- Avoided detour costs | 2.7 | heavy vehicle operators, where limits are lifted or eased
- Avoided emergency closures and repairs | 0.9 | councils and road users, through earlier detection
caption: This is an illustration. Tom's estimate of A$3.6 million a year, measured against the base case. Savings that operators pass on in freight rates move the benefit to others; they do not add to it.
```

Use one base case, one price basis and one horizon for every option: Tom counted 10 years. D also gets a second look over 30 years, because strengthened bridges last longer.

## Discount future amounts to present values

A dollar in 10 years is worth less than a dollar today, because money available now can be used now. Discounting converts future amounts into present values (PV), so that costs now and benefits later can be compared. At a 7 per cent discount rate, A$1 received in 10 years has a present value of 1.07^−10 = A$0.51.

For a level amount every year, the factor P/A(i, n) adds up the discounted years in one step: P/A(i, n) = (1 − (1 + i)^−n) ÷ i, where i is the discount rate and n the number of years.

This is an illustration. Tom used the [Benefit–Cost Ratio](/tools/benefit-cost-ratio/) tool. It takes six inputs: initial investment, level annual benefits, annual operating costs, salvage value, life in years and discount rate. It reports PV benefits, PV costs (the initial investment, plus the PV of operating costs, minus the PV of any salvage), their ratio and the net benefit. No bridge option has a salvage value. Figure 2 works Option C by hand.

```figure
type: formula
title: Option C's benefit–cost ratio, step by step
formula: P/A(i, n) = (1 − (1 + i)^−n) ÷ i
formula: B/C = (B × P/A) ÷ (P + C × P/A)
- i | real discount rate: 7%, NRIO's choice
- n | years counted: 10
- P | initial investment: C's whole four-year cost, A$14.5m
- B | level annual benefits: A$3.6m
- C | annual operating cost: A$0.15m
step: P/A(7%, 10) = (1 − 0.50835) ÷ 0.07 = 7.0236
step: PV benefits = 3.6 × 7.0236 = A$25.28m
step: PV costs = 14.5 + 0.15 × 7.0236 = 14.5 + 1.05 = A$15.55m
step: B/C = 25.28 ÷ 15.55 = 1.63; net benefit = 25.28 − 15.55 = A$9.73m
caption: This is an illustration. There is no salvage value. Amounts are in A$ million, rounded to two decimal places at the end.
```

Three habits keep discounting honest:

- **Match the rate to the prices.** NRIO's 7 per cent is a real rate, which goes with amounts in today's prices. A nominal rate goes with amounts that include inflation. Never mix the two.
- **Say where the rate comes from.** Seven per cent is NRIO's choice, not a Commonwealth rule, so Tom also tested 3 and 10 per cent. Ask your agency's economists, and check the current impact analysis guidance, before you choose.
- **Know what the tool assumes.** It treats P as spent at the start, and B and C as level every year. Treating C's whole four-year cost as spent at the start is cautious, since most of it is spent later. The A$0.15 million a year of register upkeep is counted from year one, which also errs high. Against that, the tool counts full benefits from year one, though assessments take three years; the test of lower benefits below covers the gap.

Discounting changes the answer. Undiscounted, C's benefits over 10 years are 3.6 × 10 = A$36.0 million and its costs 14.5 + 0.15 × 10 = A$16.0 million, a ratio of 2.25. Discounted, it is 1.63, because the costs come first and the benefits later. The [Public Service Act 1999](https://www.legislation.gov.au/C2004A00538/latest/text) describes Stewardship as supporting the public interest now and into the future "by understanding the long-term impacts of what it does" (s 10(6)). The discount rate sets how much those impacts weigh; the horizon sets which are counted at all.

## The bridge options side by side

This is an illustration. Tom's results, in A$ million, at a 7 per cent real discount rate over 10 years, with P/A(7%, 10) = 7.0236:

| Option | Initial investment P | Annual benefits B | Annual operating cost C | PV benefits | PV costs | B/C | Net benefit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| B Assessment grants | 15.0 | 3.0 | 0.10 | 21.07 | 15.70 | 1.34 | 5.37 |
| C Central assessment service | 14.5 | 3.6 | 0.15 | 25.28 | 15.55 | 1.63 | 9.73 |
| D Strengthening fund (10 years) | 120 | 14.0 | 0.5 | 98.33 | 123.51 | 0.80 | −25.18 |
| E Guidance and data standard only | 0.8 | 0.25 | 0.05 | 1.76 | 1.15 | 1.53 | 0.60 |

Each figure is rounded from unrounded values, so a row may not subtract exactly: E's net benefit is 0.60, although 1.76 − 1.15 = 0.61. Over 30 years, with P/A(7%, 30) = 12.4090, D's PV benefits are 14.0 × 12.4090 = 173.73, its PV costs are 120 + 0.5 × 12.4090 = 126.20, and its ratio is 1.38.

```figure
type: bars
title: Benefit–cost ratio by option
max: 2
- B Assessment grants | 1.34
- *C Central assessment service | 1.63 | recommended
- D Strengthening fund, 10 years | 0.80 | below 1: PV costs exceed PV benefits
- D Strengthening fund, 30 years | 1.38 | longer life, same sequencing problem
- E Guidance and data standard only | 1.53
caption: This is an illustration. NRIO's figures at a 7 per cent real discount rate. A ratio above 1 means PV benefits exceed PV costs.
```

## Net benefit and the ratio answer different questions

The benefit–cost ratio (B/C) says how much benefit each dollar of cost buys. Net benefit, PV benefits minus PV costs, says how much an option adds in total. For one option they agree: a ratio above 1 means a positive net benefit. Between options they can disagree.

This is an illustration. Three comparisons from the table show why you need both:

- **C against B: one option dominates.** C has more PV benefits (25.28 against 21.07) and lower PV costs (15.55 against 15.70), so it ranks above B on every measure.
- **C against E: the ratio flatters the small option.** E's ratio of 1.53 is close to C's, but its net benefit of A$0.60 million is about a sixteenth of C's A$9.73 million. Ask whether the extra spending is worth it. Moving from E to C adds 25.28 − 1.76 = A$23.52 million of PV benefits for 15.55 − 1.15 = A$14.40 million of PV costs: an incremental ratio of 23.52 ÷ 14.40 = 1.63.
- **C against D over 30 years: unlike things.** Over 30 years D's net benefit is about A$47.5 million. But a 30-year result cannot be set beside a 10-year one, and D's benefits assume it strengthens the right bridges, which nobody can know without assessments. D's weakness is sequencing, not arithmetic.

When options are alternatives, as these are, prefer the highest net benefit among those with a ratio above 1, and check the incremental ratio of each step up in size. The tool also reports a modified ratio, which subtracts operating costs from benefits instead: for C, (25.28 − 1.05) ÷ 14.5 = 1.67. Use one convention for every option and say which.

## Test how far the answer holds

A single ratio hides its assumptions. Sensitivity analysis changes one assumption at a time and reports how the result moves. Test the assumptions that are both uncertain and influential: here, the discount rate and the benefits.

This is an illustration. Tom ran three tests on Option C, holding everything else as in Figure 2:

- At 3 per cent, P/A(3%, 10) = 8.5302. PV benefits are 30.71 and PV costs 15.78, so the ratio is 1.95.
- At 10 per cent, P/A(10%, 10) = 6.1446, and the ratio is 1.43.
- With benefits 30 per cent lower, A$2.52 million a year at 7 per cent, the ratio is 1.14.

```figure
type: range
title: Option C's benefit–cost ratio under each test
min: 0
max: 2
ticks: 0 | 1.0 | 2.0
- *Central case, 7 per cent | 1.63
- Discount rate from 10 to 3 per cent | 1.43 | 1.95
- Benefits 30 per cent lower, at 7 per cent | 1.14
caption: This is an illustration. Each test changes one assumption and holds the others. Below 1.0, PV costs would exceed PV benefits.
```

A second test, the switching value, asks how wrong an estimate would have to be to change the answer. C's benefits would have to fall to 15.55 ÷ 7.0236 = A$2.214 million a year before PV benefits stopped covering PV costs: 1 − 2.214 ÷ 3.6 = 0.385, or 38.5 per cent below Tom's estimate. In plain terms, the benefits could be a third lower and C would still pay its way.

Report the tests that hurt as plainly as the ones that help. A sensitivity table with only comfortable results is advocacy, not analysis.

## Distribution and the impacts you cannot price

Totals hide who wins and who loses, so set the distribution out beside them.

This is an illustration. Three-quarters of C's priced benefits, A$2.7 million of A$3.6 million a year, go first to heavy vehicle operators (Figure 1). Councils and road users receive the rest, and the Commonwealth pays.

Some impacts have no reliable price. Leave them out of the arithmetic, never out of the analysis: say which way each points, how large you judge it, and why it is not priced. This is an illustration. The options paper listed five for C:

- **Safety:** unsafe bridges found and acted on. Positive and possibly large, but there is no sound evidence on the chance of a failure to price it with.
- **New limits:** some bridges will prove weaker than their limits assume. Operators lose a route, but an unknown risk becomes a known one.
- **Lasting data:** the register and data standard outlast the program and help councils plan works.
- **Pressure on engineers:** a panel may draw engineers from other regional work. A possible cost, to watch.
- **Fairness:** small councils get the same service as large ones.

## Regulatory burden and the official guidance

Some options work by requiring people to act: keep records, report, seek approval or change how they work. The time and money that costs businesses, community organisations and individuals is regulatory burden. The Australian Government publishes a *Regulatory Burden Measurement* framework for estimating it. Ask your agency's impact analysis contact whether it applies, use the current version, and do not invent a rate.

This is an illustration. As framed, no bridge option requires anyone outside the Commonwealth to act: councils choose whether to apply (B and D) or nominate bridges (C), and E's standard is guidance. The funding condition screened out in Chapter 3 would have required councils to hold a current assessment, and its burden would have needed measuring.

Whether a proposal needs a formal impact analysis, and in what form, is a matter for the *Australian Government Guide to Policy Impact Analysis*. Read the current version and talk to your impact analysis contact early.

If an option needs new legislation, the law adds one assessment. A member proposing a Bill "must cause a statement of compatibility to be prepared" ([Human Rights (Parliamentary Scrutiny) Act 2011](https://www.legislation.gov.au/C2011A00186/latest/text), s 8(1)), as must the rule-maker for a disallowable legislative instrument (s 9(1)). It assesses compatibility with human rights and binds no court or tribunal (ss 8(3)–(4), 9(2)–(3)).

## When it goes wrong: benefits counted twice

This is an illustration. In late 2026, another NRIO team analysed a proposal to upgrade a regional freight route: A$30.0 million of works up front and A$0.3 million a year of extra maintenance, over 30 years at 7 per cent, with P/A(7%, 30) = 12.4090. The analysis counted two benefits:

- savings to freight operators in vehicle running costs and time, A$2.5 million a year;
- higher returns to farm businesses as freight rates fell, A$1.2 million a year.

PV benefits were (2.5 + 1.2) × 12.4090 = A$45.91 million, and PV costs 30.0 + 0.3 × 12.4090 = A$33.72 million. The ratio was 1.36 and the net benefit A$12.19 million.

The second line came from the first. The team had assumed that operators would pass A$1.2 million of their A$2.5 million savings on to farm businesses through lower freight rates. That moves part of the benefit; it does not add one. Counted once, PV benefits were 2.5 × 12.4090 = A$31.02 million, the ratio 31.02 ÷ 33.72 = 0.92, and the net benefit 31.02 − 33.72 = −A$2.70 million.

An economist outside the team, reading a late draft, asked where the farm figure came from. The proposal was withdrawn before it reached the Minister, and three months of work were lost. Had nobody asked, a minister would have been told that a loss-making proposal returned A$1.36 a dollar.

Two controls would have caught it. First, a benefits map: for each benefit, write down who receives it first and where it ends up, and count it at one point only; anything that moves between parties belongs in the distribution, not the total. Second, a review by someone who did not build the numbers, asking one question: could any two lines be the same money?

## Exercise: rework Option C

This is an illustration. Before the options paper goes, the Director, Strategy and Policy, asks Tom: what if the discount rate should be 10 per cent, what if the benefits are 30 per cent too high, and what if both are true? Using the method in Figure 2:

1. Rework C at 10 per cent.
2. Rework C at 7 per cent with benefits 30 per cent lower.
3. Rework C with both changes at once.
4. Run Option B through the same tests. Does C still rank above B?
5. Write two or three sentences for the options paper.

### Worked answer

This is an illustration.

**1. At 10 per cent.** 1.10^−10 = 0.38554, so P/A(10%, 10) = (1 − 0.38554) ÷ 0.10 = 6.1446.

- PV benefits = 3.6 × 6.1446 = 22.12.
- PV costs = 14.5 + 0.15 × 6.1446 = 14.5 + 0.92 = 15.42.
- B/C = 22.12 ÷ 15.42 = 1.43, and net benefit = 22.12 − 15.42 = A$6.70 million.

**2. Benefits 30 per cent lower.** Annual benefits become 3.6 × 0.7 = A$2.52 million.

- PV benefits = 2.52 × 7.0236 = 17.70.
- PV costs are unchanged at 15.55.
- B/C = 17.70 ÷ 15.55 = 1.14, and net benefit = 17.70 − 15.55 = A$2.15 million.

**3. Both at once.** PV benefits = 2.52 × 6.1446 = 15.48, against PV costs of 15.42. B/C = 15.48 ÷ 15.42 = 1.00, and net benefit = A$0.06 million. C only just breaks even.

**4. Option B.** At 10 per cent, PV benefits = 3.0 × 6.1446 = 18.43 and PV costs = 15.0 + 0.10 × 6.1446 = 15.61, so B/C = 1.18. With benefits 3.0 × 0.7 = 2.1, PV benefits = 2.1 × 7.0236 = 14.75 against 15.70, so B/C = 0.94. With both, 2.1 × 6.1446 = 12.90 against 15.61, so B/C = 0.83.

C ranks above B in every test. B fails sooner because its switching value is lower: 15.70 ÷ 7.0236 = A$2.235 million a year, only 25.5 per cent below its A$3.0 million.

**5. For the paper.** "Option C's benefits exceed its costs under each test on its own: its ratio is 1.43 at a 10 per cent discount rate and 1.14 if benefits are 30 per cent lower. If both happened together, C would only break even, so the case for C rests mainly on the benefit estimate, which the evaluation will measure. Option B would fall below 1 if its benefits were 30 per cent lower."

The middle sentence is the one that matters. It is bad news for the recommended option, and it goes in.

Chapter 5 turns Option C's A$14.5 million from a single number into a costing, year by year.
