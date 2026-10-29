---
book: stage-gates-and-stopping-rules-by-the-numbers
chapterSlug: waiting-testing-or-proceeding
order: 5
title: "Waiting, testing or proceeding: simple real options"
description: "Waiting a year at Gate 3 to watch a competitor: A$214.8k against A$323.1k for staging now, a close call that turns on lost High-market sales, and a naive wait of A$643.9k."
draft: false
---

A gate has more than two answers. Besides going on and stopping, the business can wait: hold the programme where it is, keep the money, and decide later when more is known. Waiting is sometimes the best answer, and an ordinary net present value calculation cannot show when, because it compares investing now with never investing and leaves out investing later. Treating the timing of an investment as an option repairs that, at the cost of having to say how much the business learns by waiting and what it loses while it waits.

This chapter sets out when waiting has value, distinguishes passive learning, which comes from watching, from active learning, which comes from staging and testing, and values a proposal made at Corella's Gate 3 to wait a year while a competitor's imported camera boom shows whether the market is there. On Corella's central assumptions waiting is worth **A$214.8k**, against **A$323.1k** for staging now. The margin is not large, and it turns almost entirely on one judgement: how many High-market sales Corella would lose by arriving a year after the competitor. The chapter ends with the paper that valued waiting at **A$643.9k** by leaving the costs of waiting out.

## When waiting has value

Dixit and Pindyck (1994) set out the conditions under which the right to delay an investment is worth something. Three must hold together.

- **The investment is at least partly irreversible.** Money spent on tooling, development or launch stock cannot be recovered in full if the investment turns out badly. If it could, there would be no reason to wait: the business could invest now and undo the investment if the news was bad.
- **Uncertainty is resolved over time.** Waiting is valuable only if the business will know more later than it knows now, about the market, the technology or costs.
- **The business has some freedom over timing.** If waiting means losing the opportunity entirely, there is nothing to wait for. In practice the freedom is partial: a competitor can take part of the market, and each year of delay pushes the returns further into the future.

The SB36 meets the first two conditions clearly. The development and launch spending is largely sunk once made, and the market for camera spot-spray booms in the Wimmera is genuinely uncertain. The third condition is where the argument lies, because waiting has costs: the time value of money, and the share of the market a competitor may take while Corella watches.

## Why a positive NPV is not enough

McDonald and Siegel (1986) showed that the rule "invest when the benefits exceed the costs" ignores the value of waiting, and that, for plausible values of the uncertainty and the discount rate in their model, the best policy can be to wait until the project's benefits are **about twice** the investment cost. Their model is continuous in time, with an irreversible investment and uncertain benefits and costs, and its threshold depends on the parameters. It is not a rule of thumb that can be applied to the SB36, whose benefits come in three discrete states and whose uncertainty resolves through specific events. For the record, the present value of the launch's contribution is 5.03 times the A$1.8 million launch cost in the High state and 1.75 times on the prior average. What the result does establish is the principle: an investment that is worth doing now may be worth more if it is done later, and a positive NPV today does not settle the question. The comparison has to be made explicitly.

## Passive and active learning

There are two ways to learn about an uncertain market before committing to it.

**Passive learning** comes from waiting and watching: the market develops, competitors launch or do not, prices and costs become clearer. It costs nothing to collect, but it costs time, and the business has no control over what it learns or when.

**Active learning** comes from doing: building prototypes, running field trials, taking deposits. It costs money, but the business chooses what to learn and when, and the knowledge it gains is about its own product, not someone else's. The staged SB36 programme is active learning: A$560k of development and A$320k of field validation, each followed by a gate. Chapter 4 showed that the field season's market programme alone is worth A$149.5k as information.

The two are not exclusive. A business that stages its programme can still watch its competitors, and a business that waits can still run cheap tests. But at Corella's Gate 3 they were presented as alternatives, because the paper proposing to wait also proposed to stop development spending for a year.

## The proposal to wait a year

This is an illustration. All money is in Australian dollars excluding GST, with case values in thousands to one decimal.

In July 2025 the sales and dealer manager learned that an importer planned to bring a competing camera spot-spray boom into Australia for the 2025–26 season. The sales and dealer manager proposed that Corella pause the SB36 at Gate 3, watch how the imported boom sold through its first season, and decide in August 2026 whether to restart, by which time the market would be clearer. The managing director asked the finance manager to value the proposal properly.

The passive signal is whether the competitor's boom **sells well** or **sells poorly** in its first season. As with Corella's own field signal, it is imperfect: P(sells well | High) = **0.80**, P(sells well | Medium) = **0.50**, P(sells well | Low) = **0.20**. It says nothing about whether Corella's own prototypes will work, so the 0.75 chance of a technical pass is unchanged by waiting.

Waiting has two costs. Every value is pushed a year later, so it is discounted at 10%, a factor of 1 ÷ 1.1. And in the High state, a competitor that has had the market to itself for a year will have taken part of it. The finance manager and the sales and dealer manager agreed that in a High market Corella would then sell **28 booms a year instead of 40**. Medium and Low were left at 8 and 2, on the reasoning that in a small market an established competitor takes sales Corella would not have made anyway. That **pre-emption** assumption reduces the High-state launch NPV from A$7,258.9k to 28 × 52 × 4.3553 − 1,800 = **A$4,541.3k**, a loss of A$2,717.7k in present value if the market proves High.

## Valuing wait-then-stage

The value of waiting comes from the same roll-back as Chapter 2, with one more chance node at the front.

The chance that the competitor sells well is 0.25 × 0.80 + 0.40 × 0.50 + 0.35 × 0.20 = **0.47**. After "sells well", Bayes' rule moves the probabilities of High, Medium and Low from 0.25, 0.40 and 0.35 to 0.4255, 0.4255 and 0.1489. Corella would then restart the staged programme, and rolling back its tree with those probabilities and the late High NPV gives a value at the restarted Gate 3 of A$502.6k, worth 502.6 ÷ 1.1 = **A$456.9k** today. After "sells poorly", the probabilities move to 0.0943, 0.3774 and 0.5283, and the restarted programme would be worth −A$526.1k today, so Corella would not restart: that branch is worth **0**.

The value of waiting is 0.47 × 456.94 + 0.53 × 0 = **A$214.8k**, using the restarted value before rounding.

```figure
type: tree
title: Waiting a year at Gate 3, then deciding whether to stage
caption: This is an illustration. Values in A$k, discounted one year at 10%, with High-market sales of 28 booms a year after the competitor's head start. The staged programme after "sells well" is the Chapter 2 tree with revised probabilities.
- * Wait a year, then decide | value 0.47 × 456.94 + 0.53 × 0 = 214.8
  - Competitor sells well, p 0.47 | High 0.4255, Medium 0.4255, Low 0.1489
    - Restart the staged programme | 502.6 a year from now; 456.9 today
  - Competitor sells poorly, p 0.53 | High 0.0943, Medium 0.3774, Low 0.5283
    - Do not restart | 0 (restarting would be worth −526.1 today)
- Stage now, as in Chapter 2 | 323.1
```

## Four strategies at Gate 3

Putting the strategies side by side shows what each assumes.

```figure
type: compare
title: Four ways to proceed at Gate 3
cols: Value in A$k | Learning | What it gives up
caption: This is an illustration. The naive wait leaves out the discount and the competitor's head start; with both included, waiting is worth less than staging now.
- All-in approval now | −81.5 | none before the launch is committed | the right to stop (Chapter 3)
- * Stage now | 323.1 | active: prototypes, then the field season | A$560k at risk on Stage 3
- Wait a year, then stage | 214.8 | passive first, then active | a year, and 12 High-market booms a year
- Naive wait, as first proposed | 643.9 | passive first, then active | nothing, wrongly
```

On these assumptions, staging now is worth A$108.3k more than waiting. Staging now is itself a way of learning: it learns about the technology, which waiting cannot, and about the market through the field season. Waiting learns only about the market, and only indirectly, through someone else's product. Where the main uncertainty is technical rather than commercial, the choice between waiting for a technology to mature and learning by building it is the subject of [The price of being first: a proven line against a novel process](/reados/publications/first-of-a-kind-technology-by-the-numbers/the-price-of-being-first/) in *First-of-a-Kind Technology by the Numbers*.

## A close call that turns on lost sales

The difference of A$108.3k is not large compared with the uncertainty in the inputs, and almost all of it comes from the pre-emption assumption. The finance manager therefore reran the comparison for different numbers of High-market booms Corella could still sell after a year's delay.

```figure
type: bars
title: Value of waiting a year, by High-market sales after the delay
unit: A$'000
max: 420
caption: This is an illustration. Discounted at 10%. Each extra boom a year that Corella keeps in a High market adds about A$30.9k to the value of waiting. Waiting overtakes staging now at about 31.5 booms a year.
- 24 booms a year | 91.2
- 26 booms a year | 153.0
- * 28 booms a year, the agreed assumption | 214.8
- 30 booms a year | 276.5
- 31.5 booms a year | 322.9
- Staging now, for comparison | 323.1
- 33 booms a year | 369.2
- 34 booms a year | 400.1
```

Waiting beats staging now only if Corella would still sell more than about **31.5 booms a year** in a High market after the competitor's head start. The agreed figure of 28 is a judgement made in a meeting, not a measurement, and the difference between 28 and 31.5 is three or four booms a year, well within what two reasonable people might disagree about. The honest statement to the gate was therefore not that staging now is clearly better. It was that staging now is better if the competitor would take more than about a fifth of a High market in its first year (12 of 40 booms is 30%; the break-even is 8.5 of 40, about 21%), and that the gatekeepers should decide whether they believed that.

They did, for two reasons that sit outside the tree. Dealers in the Wimmera tend to standardise on one supplier's spray technology for service and parts, so an early entrant's advantage was expected to persist; and the business had no evidence that the imported boom would be withdrawn if it sold poorly. Gate 3 approved Stage 3, minuting that the choice over waiting rested on the pre-emption assumption and that the competitor's season would be watched through Stage 4 in any case. The decision did not need the gatekeepers to be confident that waiting was wrong; it needed them to see what it turned on.

## Waiting is not always valuable

It is tempting to conclude that, because information has value, waiting for it always helps. A simpler calculation shows why not. Suppose Corella could skip the development stages and decide only whether to launch, either now on the prior or in a year's time, when it would know the market state for certain. Launching now on the prior is worth **A$1,348.0k**. Waiting for perfect knowledge, with the competitor's head start and a year's discount, is worth 0.25 × 4,541.3 ÷ 1.1 + 0.40 × 11.8 ÷ 1.1 = **A$1,036.4k**, less than launching now, even though the information is perfect. Without the pre-emption the same wait would be worth A$1,654.0k, more than launching now. Again, the answer turns on what is lost while waiting.

[When outside uncertainty hits: change your options, not just your forecast](/reados/collections/valuing-time-delay-and-uncertainty/uncertainty-should-change-your-options/) treats staging and waiting as responses to outside uncertainty in a food-plant expansion, and [What is a day worth? Pricing delay before deciding whether to speed up](/reados/collections/valuing-time-delay-and-uncertainty/what-is-a-day-of-delay-worth/) shows how to price the delay itself. Being clear about which outcome the timing is meant to serve is the starting point of [Options derived from the outcome, and why the choice changed](/reados/publications/outcome-first-projects-by-the-numbers/options-derived-from-the-outcome/) in *Outcome-First Projects by the Numbers*, where a staged option is compared with doing everything at once.

## The error: a wait valued without its costs

This is an illustration. The sales and dealer manager's first paper valued waiting at **A$643.9k**, nearly double the staged value, and recommended deferring a year. Its arithmetic was correct given its inputs, but it had left out both costs of waiting. It did not discount the restarted programme, and it assumed that Corella would still sell 40 booms a year in a High market after the competitor had had a year to itself. With those inputs, the restarted programme was worth A$1,370.0k after "sells well" and −A$415.3k after "sells poorly", giving 0.47 × 1,370.0 = A$643.9k.

The finance manager found the problem by asking what the paper assumed would happen during the year of waiting. The answer was that nothing would: the money would not lose time value, and the competitor would not take any customers. Adding the 10% discount and the agreed pre-emption gave the corrected value of A$214.8k. The error was not a lapse of arithmetic. It was a framing that made waiting free, and waiting is never free: if it were, it would always be the best answer, because it keeps every option open at no cost.

Public guidance takes the same view of these methods. Infrastructure Australia's *Assessment Framework: Guide to risk and uncertainty analysis* (July 2021) includes real options analysis and a decision-tree example among the techniques for appraising investments under uncertainty, and asks that the costs of delay be valued alongside the value of what is learned.

## Exercise: no loss of High-market share

Suppose the gatekeepers do not accept the pre-emption assumption: they believe Corella would still sell 40 booms a year in a High market after waiting a year. The 10% discount stays. What is waiting now worth, and which strategy should Gate 3 choose? As a further check, what is waiting worth with the pre-emption assumption but without the discount?

**Worked answer.** With 40 booms a year in High and the 10% discount, the restarted programme is worth A$1,245.4k today after "sells well" and −A$377.6k after "sells poorly", so Corella would restart only after "sells well". The value of waiting is 0.47 × 1,245.43 = **A$585.4k**, more than the A$323.1k of staging now, and the gate should wait. With the pre-emption assumption but no discount, the value of waiting is **A$236.2k**, still below staging now. The discount alone does not decide the comparison; the pre-emption assumption does. That is the judgement the gatekeepers must make and minute, and it is worth checking against whatever evidence there is about how dealers and growers respond to an established competitor.
