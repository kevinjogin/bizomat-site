---
book: stage-gates-and-stopping-rules-by-the-numbers
chapterSlug: what-the-right-to-stop-is-worth
order: 3
title: "What the right to stop is worth"
description: "Staged against all-in approval of the SB36: A$323.1k against −A$81.5k, a right to stop worth A$404.6k, the risk profile of each, and gates that never said no."
draft: true
---

A gate is usually described as a checkpoint, a place where a project is inspected. It is more useful to see it as an option: the right, but not the obligation, to spend the next stage's money. An option has value because its holder can decline to exercise it when the news is bad. A programme approved in stages carries a string of such options; a programme approved all at once has given them up. The difference between the two is the value of the right to stop, and it can be calculated from the same decision tree that values the programme.

This chapter compares Corella's staged SB36 programme with an all-in approval of the same programme at Gate 3, finds that the right to stop is worth **A$404.6k**, splits that value between the technical gate and the market gate, and looks at how staging changes the spread of outcomes as well as their average. It ends with Corella's own gate record, 11 reviews and 11 "go" decisions, and what such gates are worth.

## A gate as an option to abandon

In the language of real options, each SB36 gate is an **option to abandon**: at Gate 4 the business can decline to spend A$320,000 on the field season, and at Gate 5 it can decline to spend A$1,800,000 on the launch. Cooper's stage-and-gate model (Cooper 1990) describes the same idea in management terms: the gates are go or kill decision points, and the stages are designed so that the money committed at each gate is matched to what has been learned. Kill is the decision that gives the option its value. A gate at which the project is never killed is an inspection, and an inspection has no option value.

The tree in Chapter 2 already contains the options, because the roll-back assumed that Corella would stop after a technical failure or a Weak field signal. To see what those options are worth, the tree has to be compared with a programme that does not have them.

## Two ways to approve the same programme

This is an illustration. All money is in Australian dollars excluding GST, with case values in thousands to one decimal.

**Staged approval** is the plan: Gate 3 approves Stage 3 only, and later gates decide the later stages. Chapter 2 valued it at **A$323.1k**.

**All-in approval** is the alternative that Corella's tooling order in Chapter 1 drifted towards: Gate 3 approves the whole programme, and the launch orders for tooling, inventory, dealer units and compliance work are placed at once to save time. If the prototypes then fail at Gate 4, the launch orders are cancelled, losing **65%** of the A$1,800k, or A$1,170k. If they pass, the field season goes ahead but the launch commitments have already been made, so Corella launches whatever the field signal says.

The all-in value follows from the same inputs:

- technical fail, probability 0.25: −560 − 1,170 = −A$1,730k;
- technical pass, probability 0.75: −560 − 320 + a launch worth the prior expected NPV of A$1,348.0k.

The expected value is −560 + 0.75 × (−320 + 1,348.0) + 0.25 × (−1,170) = −560 + 771.0 − 292.5 = **−A$81.5k**. The same product, the same market and the same costs are worth A$323.1k approved in stages and less than nothing approved all at once.

```figure
type: compare
title: Staged and all-in approval of the SB36 at Gate 3
cols: Staged | All-in
caption: This is an illustration. Values in A$k, excluding the sunk A$220k of Stages 1 and 2. The right to stop is the difference between the two expected values.
- After a technical fail at Gate 4 | stop: −560 | cancel launch orders: −1,730
- After a pass and a Weak signal | stop before launch: −880 | launch anyway: EV −1,141.2
- After a pass and a Strong signal | launch: EV 2,622.9 | launch: EV 2,622.9
- * Expected value at Gate 3 | 323.1 | −81.5
- Value of the right to stop | 404.6 |
```

The after-Weak and after-Strong values in the all-in column include the A$880k of development and field spending: −880 + (−261.2) = −1,141.2 and −880 + 3,502.9 = 2,622.9.

## Where the A$404.6k comes from

The value of the right to stop is 323.1 − (−81.5) = **A$404.6k**, and it splits cleanly into the two gates that the all-in approval gave up.

The **technical gate** at Gate 4 avoids the cancellation loss when the prototypes fail. That happens with probability 0.25 and saves A$1,170k each time: 0.25 × 1,170 = **A$292.5k**.

The **market gate** at Gate 5 avoids launching after a Weak signal. That happens with probability 0.75 × 0.5725, and each time it saves the expected loss of A$261.2k from launching into a probably weak market. Seen from Gate 4 that saving is worth 0.5725 × 261.2 = A$149.5k, and seen from Gate 3 it is 0.75 × 149.5 = **A$112.1k**.

The two parts add to 292.5 + 112.1 = 404.6. The split is informative. Most of the value of the right to stop here comes from the technical gate, and it comes mainly from the cancellation terms: the more expensive it is to undo the launch commitments, the more the gate that prevents them is worth. If the launch orders could be cancelled for nothing, the all-in programme would be worth −560 + 771.0 = A$211.0k, and the right to stop would shrink to the market gate's A$112.1k. No cancellation terms, however generous, can recover the market gate's value, because that value comes from not launching at all.

```figure
type: stats
title: The right to stop at Gate 3
caption: This is an illustration. The technical part depends on the 65% cancellation loss; the market part does not depend on cancellation terms at all.
- * A$404.6k | Value of the right to stop | staged A$323.1k against all-in −A$81.5k
- A$292.5k | Technical gate at Gate 4 | 0.25 × A$1,170k cancellation loss avoided
- A$112.1k | Market gate at Gate 5 | 0.75 × (0.5725 × A$261.2k) = 0.75 × A$149.5k expected launch loss avoided
```

## What makes the right to stop valuable

Three features of the SB36 programme give its gates their value, and the same three can be checked in any staged plan.

The first is the **size of what a gate can avoid** compared with what has been spent to reach it. Stopping at Gate 4 avoids a launch commitment of A$1,800k after spending A$560k; stopping at Gate 5 avoids A$1,800k after spending A$880k. A gate in front of a small next stage is worth little, however uncertain the project, because there is little to avoid.

The second is **uncertainty that the stage resolves**. The technical gate is valuable because there is a real, one-in-four chance that the prototypes fail, and Stage 3 finds out. A stage that leaves the key question unanswered gives the following gate nothing new to decide on.

The third is **how well the evidence separates good from bad**. The market gate is worth A$112.1k because a Strong signal is far more likely in a High market than in a Low one. If the field signal were equally likely in every state, the posteriors would equal the priors, the expected launch NPV after either signal would be A$1,348.0k, the business would launch whatever it saw, and the market gate would be worth nothing. The right to stop would shrink to the technical gate's A$292.5k. A gate is only as valuable as the information that arrives just before it, which is why Chapter 4 puts a price on that information.

The comparison also tells the gatekeepers what the all-in approval would have to deliver to be worth choosing: its earlier launch, or any other benefit of committing at once, would have to be worth more than A$404.6k in expected terms. Corella's plan has no such benefit, because, as Chapter 1 showed, ordering at Gate 5 still meets the production date.

## The risk profile: what staging does to the spread

Expected values are averages. The gatekeepers also care about how bad things can get, and a small family business cares a great deal. Listing every way each programme can end shows that staging changes the shape of the risk, not just its average.

The staged programme has the five outcomes from Chapter 2: technical fail (p 0.2500, −A$560k), Weak and stop (p 0.4294, −A$880k), and Strong and launch into High (p 0.1594, +A$6,378.9k), Medium (p 0.1350, −A$868.2k) or Low (p 0.0262, −A$2,227.1k). The all-in programme has four: technical fail and cancel (p 0.2500, −A$1,730k), and launch into High (p 0.1875, +A$6,378.9k), Medium (p 0.3000, −A$868.2k) or Low (p 0.2625, −A$2,227.1k). In the all-in programme the launch probabilities are the priors multiplied by 0.75, because the field signal no longer decides anything.

```figure
type: bars
title: Probability of each kind of result, staged and all-in
unit: %
max: 100
caption: This is an illustration, rounded to one decimal. Staging makes some loss slightly more likely but makes a loss worse than A$1m rare. The worst single outcome, launching into a Low market, is −A$2,227.1k under both.
- Staged: any loss | 84.1
- All-in: any loss | 81.3
- * Staged: loss worse than A$1m | 2.6
- All-in: loss worse than A$1m | 51.2
- Staged: gain | 15.9
- All-in: gain | 18.8
```

Three things stand out.

- **Large losses become rare.** Under all-in approval, the chance of losing more than A$1m is 51.2%: the cancellation (25%) plus a launch into a Low market (26.25%). Under staging it is 2.6%, the chance of a Strong signal followed by a Low market.
- **Small losses become more common.** The chance of some loss rises slightly, from 81.3% to 84.1%, because staging turns some outcomes that would have been gains into small, deliberate losses. When a High market sends a Weak signal, which happens 15% of the time, the staged programme stops after spending A$880k and never learns what it missed. The all-in programme would have launched and made A$6,378.9k.
- **The worst case does not change.** A Strong signal followed by a Low market loses A$2,227.1k under either approval. Staging reduces the probability of the worst case, from 26.25% to 2.6%, but cannot remove it, because the field signal is imperfect.

Staging is therefore not a way to avoid losses. It is a way to buy small, likely losses in exchange for avoiding large ones, and the trade is worth A$404.6k on average here. That is the shape a family business should usually prefer.

A seeded simulation of 10,000 programmes, drawing the market state, the technical result and the field signal at random (seed 20261028), confirms the arithmetic: the mean result was A$314.4k for staged approval and −A$68.8k for all-in, and the share of runs losing more than A$1m was 2.9% and 52.1%. The small differences from the exact values are sampling noise; 10,000 runs are enough to check the tree, not to replace it.

## The error: gates that never said no

This is an illustration. Chapter 1 noted that Corella held 11 gate reviews between 2019 and 2024, on the grain-cart weighing system, the hydraulic boom fold kit and the linkage fertiliser spreader, and that all 11 ended in "go". The fold kit was eventually stopped before launch, but only at 107.8% of its development budget, after every gate it passed through had said go.

The independent board adviser, preparing for the SB36 Gate 3, asked the finance manager for the outcome of every past gate. The count, 11 out of 11, raised the question of what the gates had actually been deciding. Reading the minutes showed that they had reviewed progress and budgets, but none had had written conditions under which the project would stop. The gate papers presented each project's best case, and the meeting's role in practice was to agree the next stage's budget.

A gate that always passes is equivalent, in the tree, to a programme that does not place the launch orders early but launches whatever the field signal says. Its value is −560 + 0.75 × (−320 + 1,348.0) = **A$211.0k**, which is A$112.1k less than the staged programme's A$323.1k. A rubber-stamp gate has kept the technical gate's value only because nobody ordered the tooling early, and has thrown away the market gate's value entirely. It also leaves the business exposed to the drift Chapter 1 described: if the gates never stop anything, there is no obvious reason not to place the long-lead orders early.

The correction began at Gate 3 and was completed at Gate 4. Each gate's paper now carries written stop conditions, agreed before the evidence for that gate is gathered, and the minutes record which conditions were met. Chapter 7 shows how Corella turned the break-even probabilities from this tree into measurable criteria for the field season. [Stage gates that make real decisions: go, hold, recycle or stop](/reados/collections/project-delivery-procurement-and-governance/stage-gates-that-make-real-decisions/) describes the same failure from the process side, and the signs that gates have become a ritual.

```figure
type: checklist
title: Signs that a gate has stopped being an option
caption: Each sign means the gate's option value is being lost. The last two are the ones Corella found in its own record.
- Stop conditions written before the evidence is gathered | stated in the gate paper and checked in the minutes
- Long-lead commitments for later stages listed and approved at gates | see Chapter 1's tooling order
- Gate outcomes counted over several years | kill, hold and recycle decisions should appear
- x Gate papers that present only the best case | no range, no probabilities, no stop conditions
- x A record of every gate saying "go" | 11 of 11 at Corella, 2019 to 2024
```

## Technical risk and why the first gates matter

The decomposition showed that most of the right to stop, A$292.5k, comes from the technical gate. That is typical of new technology: the early stages exist to find out whether the thing works at all, and the money committed before that is known should be as small as the work allows. [Technology readiness levels and critical technology elements](/reados/publications/first-of-a-kind-technology-by-the-numbers/technology-readiness-levels/) in *First-of-a-Kind Technology by the Numbers* shows how to judge how far a new technology is from working, which is the judgement behind a figure like Corella's 0.75. A pilot or a prototype is itself a staged commitment, and the test it must pass is part of the gate. [Proving the pilot: acceptance tests and run length](/reados/publications/modular-projects-by-the-numbers/proving-the-pilot/) in *Modular Projects by the Numbers* shows how to set the acceptance test and the run length for a pilot so that passing it means something.

Staging also has costs that the tree above ignores: the gates take management time, and a staged programme may reach the market later than one that commits everything at the start. Those costs should be set against the value of the right to stop, and the comparison is usually lopsided in a programme like the SB36, where the launch costs more than all the development put together. Where a project's cost risk, rather than its technical or market risk, is the main worry, [Cutting the tail before approval](/reados/publications/reference-class-forecasting-by-the-numbers/cutting-the-tail/) in *Reference Class Forecasting by the Numbers* uses the same staging logic to reduce the chance of a large overrun.

## Exercise: kinder cancellation terms

The toolmaker and the other launch suppliers offer terms under which Corella would lose only **30%** of the A$1,800k launch commitment if it cancelled after a technical failure at Gate 4. Everything else is as in this chapter. What is the all-in programme now worth, and how much is the right to stop worth, split between the two gates?

**Worked answer.** The cancellation loss becomes 0.30 × 1,800 = A$540k. The all-in value is −560 + 0.75 × (−320 + 1,348.0) + 0.25 × (−540) = −560 + 771.0 − 135.0 = **A$76.0k**. The staged value is unchanged at A$323.1k, so the right to stop is worth 323.1 − 76.0 = **A$247.1k**. The technical part falls to 0.25 × 540 = **A$135.0k**; the market part stays at **A$112.1k**, because it does not depend on cancellation terms. Kinder terms make all-in approval look less reckless, but staging is still worth A$247.1k more, and the market gate's A$112.1k can be kept only by keeping the launch decision until the field signal is in.
