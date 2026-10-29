---
book: stage-gates-and-stopping-rules-by-the-numbers
chapterSlug: paying-for-information
order: 4
title: "Paying for information: perfect, sample and useless"
description: "EVPI of A$471.5k for the SB36 market, EVSI of three market tests (A$0k, A$149.5k, A$304.4k), and a A$140k third prototype that could not change any decision."
draft: false
---

Every stage before a launch buys information, and information is worth paying for only if it might change what the business does. A test whose every possible result leads to the same decision is worth nothing, however interesting its results, and however much the people proposing it want to know the answer. The useful questions are how much a test could change the expected value of the decision, and whether that is more than the test costs.

This chapter values information about the SB36's market at Gate 4, where Corella decides how to run the field season. It starts with the expected value of perfect information, **A$471.5k**, which caps what any market test is worth, then values three real tests by preposterior analysis: a cheap grower survey that turns out to be worth nothing, the planned market programme worth **A$149.5k**, and an extended programme worth **A$304.4k** but costing more than it adds. It ends with a A$140,000 prototype requested in November 2025 that could not have changed any decision.

## Information has value only through a decision

Howard (1966) set out the idea in a short paper on information value theory: the value of information is the increase in the expected value of a decision that the information makes possible. If the decision would be the same whatever the information says, the information adds nothing to the decision's value. Information is valuable in proportion to the chance that it changes the choice and to how much is gained when it does.

That definition forces two questions before any test is bought. Which decision will this test inform? Which result of the test would make us choose differently? If nobody can name a result that would change the decision, the test should not be bought for the decision's sake, though it may still be worth doing for another reason, such as product development or a legal requirement, and should then be justified on that reason.

## The decision at Gate 4

This is an illustration. All money is in Australian dollars excluding GST, with case values in thousands to one decimal.

At Gate 4 the prototypes have passed their technical tests, so the remaining question is the market. Without any further market information, Corella would compare launching with not launching using its prior probabilities: High 0.25, Medium 0.40, Low 0.35, with launch NPVs of A$7,258.9k, A$11.8k and −A$1,347.1k. The expected launch NPV is **A$1,348.0k**, which is positive, so with no more information Corella would launch. Every market test is valued against that default: its value is what it adds to A$1,348.0k by sometimes stopping a launch that would have lost money.

The Stage 4 budget of A$320k has two parts. **A$220k** is the technical field validation: running the prototype booms on growers' farms through the summer fallow season to confirm detection, spray accuracy and reliability under real conditions. That work is needed before any launch, whatever is known about the market. The other **A$100k** is the **market programme**: grower demonstration days, dealer briefings and a refundable dealer deposit scheme, designed to give the Strong or Weak signal used in Chapter 2. Only the A$100k is information about the market, and only it should be judged by what it adds to the launch decision.

## The ceiling: expected value of perfect information

Suppose a perfectly reliable source could tell Corella which market state it faces before it launches. Corella would launch in High and Medium, where the NPV is positive, and not launch in Low. The expected value with perfect information would be 0.25 × 7,258.9 + 0.40 × 11.8 + 0.35 × 0, which is A$1,819.5k when computed from the unrounded payoffs. Without it, the expected value is A$1,348.0k. The difference is the **expected value of perfect information**:

EVPI = 1,819.5 − 1,348.0 = **A$471.5k**.

The figure has a plain meaning here. The only thing perfect information changes is the launch into a Low market, which it prevents. That launch loses A$1,347.1k and has a 0.35 chance, and 0.35 × 1,347.1 = A$471.5k. Perfect information is worth exactly the expected loss it avoids. No real test is perfect, so **no market test is worth more than A$471.5k** to this decision, and any test that costs more can be rejected without further work.

## Sample information: preposterior analysis

Real tests are imperfect. They give a result that is more likely in some states than others, and the business must decide what it would do after each result before the test is run. Raiffa and Schlaifer (1961) called this **preposterior analysis**: working out, before the test, the posterior probabilities that each result would produce, the best decision after each, and so the expected value of deciding with the test. The **expected value of sample information** (EVSI) is that expected value minus the value of deciding without the test.

```figure
type: steps
title: Preposterior analysis of a market test
caption: The same five steps value any test with a small number of possible results. EVSI can never exceed EVPI, and it is zero when every result leads to the same decision.
- State the likelihoods | the chance of each test result in each market state
- Find the chance of each result | sum of prior × likelihood across the states
- Find the posteriors after each result | Bayes' rule: prior × likelihood ÷ chance of the result
- Decide after each result | launch if the posterior expected NPV is above zero, otherwise stop (0)
- * Value the test | EVSI = Σ chance of result × value of the best decision − value without the test
```

For the planned market programme the likelihoods are those of Chapter 2: a Strong signal with probability 0.85 in High, 0.45 in Medium and 0.10 in Low. P(Strong) is 0.4275. After Strong, the expected launch NPV is A$3,502.9k and Corella launches; after Weak, it is −A$261.2k and Corella stops. The expected value with the test is 0.4275 × 3,502.9 + 0.5725 × 0 = A$1,497.5k, so

EVSI = 1,497.5 − 1,348.0 = **A$149.5k**,

against a cost of A$100k, a net value of **A$49.5k**. This reconciles with the Gate 4 value in Chapter 2. The technical work costs A$220k, the market programme adds a net A$49.5k to the A$1,348.0k launch value: −220 + 1,348.0 + 49.5 = A$1,177.5k, the V4 of the tree.

## Three tests compared

The sales and dealer manager put three ways of reading the market to Gate 4, each with its own cost and accuracy.

- **Grower survey**: a phone and online survey of 120 growers, costing A$25k. Growers say they like the idea more readily than they pay for it, so a favourable result is common in every state: likelihoods of a favourable result 0.70, 0.50 and 0.35.
- **Market programme**: the planned A$100k of demonstrations and dealer deposits, with likelihoods 0.85, 0.45 and 0.10.
- **Extended programme**: 10 farms in two regions instead of 6, two extra prototype booms and paid pre-orders, costing A$280k, with likelihoods 0.92, 0.35 and 0.04.

```figure
type: compare
title: Three market tests at Gate 4, valued by preposterior analysis
cols: Cost | P(favourable) | EV after favourable | EV after unfavourable | EVSI | Net value
caption: This is an illustration. Values in A$k. The survey's unfavourable result still leaves a positive expected launch value, so Corella would launch after either result and the survey is worth nothing to the decision.
- Grower survey | 25 | 0.4975 | 2,226.4 | 478.3 | 0.0 | −25.0
- * Market programme | 100 | 0.4275 | 3,502.9 | −261.2 | 149.5 | 49.5
- Extended programme | 280 | 0.3840 | 4,303.0 | −494.1 | 304.4 | 24.4
```

The survey is the instructive case. After a favourable result the expected launch NPV rises to A$2,226.4k; after an unfavourable one it falls, but only to A$478.3k. Both are positive, so Corella would launch after either result. The survey changes the probabilities but never the decision, and its EVSI is **zero**. It is not that the survey tells Corella nothing; it shifts the posterior probability of Low from 0.35 to 0.45 after an unfavourable result. It is that the shift is not enough to cross the line where stopping becomes better than launching.

The extended programme is the opposite case. It is more accurate, especially at telling Low from High, and its EVSI of A$304.4k is about 64.6% of the EVPI, against 31.7% for the planned programme. But it costs A$280k, so its net value is A$24.4k, about half the planned programme's A$49.5k. More accurate information is worth more, and it also costs more; the best test is the one with the largest net value, not the largest EVSI.

```figure
type: bars
title: Value and cost of market information at Gate 4
unit: A$'000
max: 480
caption: This is an illustration. EVPI caps every test. Only the market programme's value exceeds its cost by a clear margin; the extended programme is worth more but costs nearly as much as it adds.
- EVPI, the ceiling | 471.5
- Extended programme: EVSI | 304.4
- Extended programme: cost | 280
- * Market programme: EVSI | 149.5
- Market programme: cost | 100
- Grower survey: EVSI | 0
- Grower survey: cost | 25
```

Two cautions apply to the comparison. The likelihoods are judgements, and the ranking between the two programmes depends on them; a gatekeeper should ask what evidence supports a claim that the extended programme is so much better at spotting a Low market. [Testing each driver against the record](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/testing-the-drivers/) in *Demand and Benefit Forecasts by the Numbers* shows how to check market assumptions of this kind against what actually happened before. And the extended programme would take more time and more prototype booms, which are costs the A$280k may not fully capture. Designing tests whose accuracy can be estimated, rather than assumed, is the subject of [The value of a test: buying information before committing](/reados/publications/prototypes-and-simulation-by-the-numbers/the-value-of-a-test/) in *Prototypes and Simulation by the Numbers*. [The value of information: when is it worth finding out more?](/reados/collections/valuing-time-delay-and-uncertainty/the-value-of-information/) introduces EVPI and an imperfect test with a simpler, two-state example, and [Thinking in probabilities](/reados/collections/judgement-markets-and-learning/thinking-in-probabilities/) explains the Bayes' rule used in each row.

## What makes a market test useful here

A test adds value only through its unfavourable result, because that is the only result after which Corella would do something other than launch. Its EVSI is therefore the expected loss it avoids: the chance of an unfavourable result multiplied by the expected launch loss after it. For the market programme that is 0.5725 × 261.2 = A$149.5k. Seen from Gate 3, where the programme is reached only after a technical pass, the same saving is worth 0.75 × 149.5 = A$112.1k, the market gate's value in Chapter 3.

```figure
type: tree
title: The market programme at Gate 4, branch by branch
caption: This is an illustration. Values in A$k. Only the Weak branch changes the decision, and the A$149.5k it is worth is the expected loss avoided on that branch.
- * Run the market programme, cost 100 | EV with the test 1,497.5; EVSI 149.5; net 49.5
  - Strong, p 0.4275 | posteriors 0.4971 / 0.4211 / 0.0819; launch, EV 3,502.9
  - Weak, p 0.5725 | posteriors 0.0655 / 0.3843 / 0.5502; stop, 0 instead of −261.2
- No market test | launch on the prior, EV 1,348.0
```

The arithmetic also shows what accuracy matters. Because the High state's payoff is so large, the expected launch NPV after an unfavourable result turns negative only if that result is much rarer in a High market than in a Low one. Ignoring the small Medium term, the High state contributes 0.25 × 7,258.9 = A$1,814.7k and the Low state 0.35 × 1,347.1 = A$471.5k, so the chance of an unfavourable result in High must be below about 0.26 times its chance in Low, nearly four times rarer. The market programme gives an unfavourable result 15% of the time in High and 90% in Low, a ratio of 0.17, and passes. The grower survey gives 30% and 65%, a ratio of 0.46, and fails. A test that is good at confirming the High state is not enough; what it must rarely do is send a false alarm when the market is in fact High.

## The error: a third prototype that could not change anything

This is an illustration. In November 2025, while the two prototypes were being finished, the engineering manager asked for a third prototype boom, costing **A$140,000**, to "prove stubble detection": to show that the cameras could find green weeds among heavy standing stubble, which had given the bench trials trouble. The request was presented as risk reduction and had support from the engineering team, who wanted to know the answer.

The finance manager asked the question this chapter starts with: which result of the third prototype would change what Corella does? The answer was none. If the third prototype detected weeds well in stubble, Corella would go on to the field season. If it did poorly, Corella would still go on to the field season, because the field season on growers' summer fallow paddocks would test stubble detection under real conditions anyway, and the Gate 4 technical criteria would be judged on the two existing prototypes in any case. Neither result could stop Stage 4 or change its design, so the third prototype's value to the decision was **zero**, and its net value **−A$140k**.

The request was rejected in November 2025, with the reason minuted: the question it asked was real, but the field season would answer it on growers' paddocks, within its existing budget, before any launch money was committed. The engineering manager's concern was recorded as a specific item for the field-season results. The episode is common because the value of a test is easily confused with the importance of its question. Stubble detection mattered a great deal; a separate test of it, ahead of a field season that would test it anyway, did not.

```figure
type: checklist
title: Questions before buying information
caption: The last item is the third prototype's failing: its question mattered, but no result could change the decision.
- Which decision will this inform, and when is it made | the Gate 4 field-season design and the Gate 5 launch
- What will we do with no more information | launch on the prior: expected NPV A$1,348.0k
- Is the cost below the EVPI | any market test above A$471.5k is rejected at once
- Which result would change the decision | name it, with its probability
- Does the net value beat the alternatives | A$49.5k for the market programme against A$24.4k extended
- x A test justified by the importance of its question alone | the A$140k third prototype: EVSI zero
```

## What the value of information does not cover

EVSI values information for one decision. Some information has other uses: the field season's technical data will also shape the production design, and dealer deposits build relationships whatever they signal. Those benefits are real and can justify spending, but they should be argued for separately, so that a test is not credited twice. Equally, EVSI assumes the business will act on the result. A market programme whose Weak result would be explained away at Gate 5 is worth nothing, whatever the arithmetic says; Chapter 7 deals with fixing the criteria before the result arrives.

## Exercise: a dealer-only deposit scheme

At Gate 4 the sales and dealer manager proposes a cheaper alternative to the market programme: a dealer-only deposit scheme, without grower demonstrations, costing **A$30k**. The chance of a favourable result is 0.75 in a High market, 0.45 in Medium and 0.20 in Low. Using the priors and launch NPVs of this chapter, what is the scheme's EVSI and net value, and should Corella buy it?

**Worked answer.** P(favourable) = 0.25 × 0.75 + 0.40 × 0.45 + 0.35 × 0.20 = 0.1875 + 0.18 + 0.07 = **0.4375**. The posteriors after a favourable result are 0.4286, 0.4114 and 0.1600, and the expected launch NPV is **A$2,900.3k**: launch. After an unfavourable result they are 0.1111, 0.3911 and 0.4978, and the expected launch NPV is **A$140.6k**, still positive: launch. Corella launches after either result, so the expected value with the scheme equals the value without it, and the **EVSI is zero**. The net value is −A$30k, and Corella should not buy it for the launch decision. The scheme fails for the same reason as the grower survey: in a Low market it still gives a favourable result one time in five, so an unfavourable result does not shift the probabilities far enough to make stopping better than launching.
