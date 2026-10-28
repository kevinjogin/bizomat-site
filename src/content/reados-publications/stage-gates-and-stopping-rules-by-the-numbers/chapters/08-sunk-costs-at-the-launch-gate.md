---
book: stage-gates-and-stopping-rules-by-the-numbers
chapterSlug: sunk-costs-at-the-launch-gate
order: 8
title: "Sunk costs at the launch gate"
description: "SB36 has spent A$1,245k by Gate 5. A note that set stopping's sunk loss against launching's forward value made launch look A$983.8k better; on one basis, stopping beats launching by A$351.2k."
draft: true
---

By the launch gate, a development programme has usually spent a lot of money, and everyone in the room knows the figure. It is the one number that cannot be changed by anything the gate decides, and it is often the number that dominates the discussion. "We have put A$1.2 million into this" sounds like an argument for launching. It is not an argument for anything. It describes the past, and a gate chooses between futures.

This chapter sets out what the research on the sunk cost effect found, adds up what SB36 had spent by Gate 5, and compares the options open to Corella Plains Implements on the only basis that can rank them: what each is worth from today. It then separates what really is sunk from what is not, including salvage, reusable work and the accounting write-off, and ends with a note to the gate that compared stopping and launching on two different bases, and made a losing launch look nearly a million dollars better than stopping.

## The sunk cost effect

A **sunk cost** is money, time or effort already spent that cannot be recovered whatever is decided next. Decision analysis treats it as irrelevant to the choice: every option inherits the same past, so the past cancels out of any comparison between them. The **sunk cost effect** is the observed tendency of people to let it count anyway: to continue an endeavour because of what has been put into it, rather than because of what it will return.

Hal Arkes and Catherine Blumer's 1985 paper gave the effect its name and some of its best-known evidence. In one field study, some buyers of theatre season tickets paid full price and others were given discounts. Over the first part of the season, those who had paid full price attended more plays than those who had paid less. The plays were the same and the money was already spent in every group, so the extra attendance can only be explained by the price paid: the buyers who had spent more felt they had more to get back.

Later work has found the effect to be real but uneven. Stefan Roth, Thomas Robbert and Lennart Straus's 2015 meta-analysis in *Business Research* combined 98 effect sizes from published studies. It found the sunk cost effect present, and found that its size depended on the kind of decision being studied, in particular whether people were deciding whether to **use something already bought** (like the theatre tickets) or whether to **keep investing** in an endeavour. A launch gate is the second kind: the business decides whether to commit new money to a project that has already absorbed a great deal. Most of the studies are experiments with individuals, not boards of small businesses, and the effect in any one business may be stronger or weaker. What the research supports is a narrower claim: people do weigh sunk costs, so a gate should be built so that they cannot.

## What SB36 had spent by Gate 5

This is an illustration. All money in this chapter is in Australian dollars excluding GST, in thousands (A$k). Gate 5 for the SB36 camera spot-spray boom was held on 21 April 2026. By then Corella had spent:

```figure
type: stack
title: SB36 spend to Gate 5, A$1,245k by stage
unit: A$'000
caption: This is an illustration. Stage 3 includes the A$145k of top-ups described in Chapter 6. Stages 3 and 4, A$1,025k, are capitalised as development in the accounts under the case's illustrative treatment.
- Stage 1, scoping | 40
- Stage 2, concept and bench detection trial | 180
- Stage 3, development of two prototypes | 705 | budget 560
- Stage 4, field validation season | 320 | technical 220, market 100
```

The total is 40 + 180 + 705 + 320 = **A$1,245k**, against a planned A$1,100k for the four development stages, an overrun of 13.2%. In the accounts, under the case's illustrative treatment, the Stage 3 and Stage 4 costs of **A$1,025k** sit on the balance sheet as capitalised development. AASB 138 *Intangible Assets* is the Australian standard that separates the research phase of a project from its development phase and sets the conditions under which development costs may be recognised as an asset. Whether and how much a real business may capitalise is a matter for its accountant; the case uses the figure only to show what it does and does not mean for the decision.

The field season had returned a **Weak** signal (Chapter 7). On the decision tree of Chapter 2, that put the market's posterior probabilities at **0.0655 High, 0.3843 Medium and 0.5502 Low**.

## The options on one basis

This is an illustration. Three options for the product were open at Gate 5, valued at the launch date on the Weak posterior. Chapter 9 adds a fourth, waiting a season, and the competing welding cell; here the point is the treatment of the A$1,245k.

- **Launch the full boom.** Spend A$1,800k on tooling, inventory, dealer units and launch. Expected NPV: 0.0655 × 7,258.9 + 0.3843 × 11.8 + 0.5502 × (−1,347.1) = **−A$261.2k**.
- **Pivot to a retrofit kit.** Sell the cameras, controller and nozzle valves as a kit for growers' existing booms, at A$38k with A$14k contribution, for an investment of A$560k (A$140k development and A$420k launch). Its NPV is positive in every market state: A$1,269.2k High, A$781.4k Medium, A$171.7k Low. Expected NPV: 0.0655 × 1,269.2 + 0.3843 × 781.4 + 0.5502 × 171.7 = **A$477.9k**.
- **Stop and sell the prototypes.** Close the programme and sell the two prototype booms as conventional booms for **A$90k**.

None of these numbers includes the A$1,245k. Each is the cash the option would bring in from today, less the cash it would still require, discounted at 10%. That is the forward basis, and on it the ranking is clear: the kit is worth A$739.1k more than launching and A$387.9k more than stopping, and stopping is worth A$351.2k more than launching.

The sunk cost could be added, of course, provided it is added to every option. Subtracting A$1,245k from each gives a launch at **−A$1,506.2k**, the kit at **−A$767.1k** and stopping at **−A$1,155.0k**. Every option now looks like a loss, which is true of the programme as a whole: whatever happens, SB36 will not earn back everything spent on it on the Weak posterior's expectations. But the ranking and the gaps between options are exactly the same, because the same number has been taken from each.

```figure
type: compare
title: The three options at Gate 5, forward-only and with sunk spend included
cols: Forward-only | Including A$1,245k spent | Rank
best: 1
caption: This is an illustration. Expected values on the Weak posterior, A$k. Including sunk spend on every option moves all three down by the same A$1,245k and changes nothing about the choice.
- * Retrofit kit | 477.9 | −767.1 | 1
- Stop, sell prototypes | 90.0 | −1,155.0 | 2
- Full launch | −261.2 | −1,506.2 | 3
- Gap, kit over launch | 739.1 | 739.1 | same
- Gap, stop over launch | 351.2 | 351.2 | same
```

The comparison shows the practical rule. Sunk costs are harmless if they are treated the same way on every option, and decisive if they are not. The danger is never that someone includes them, but that someone includes them on one side only.

## What is not sunk

Treating the past as irrelevant does not mean treating everything associated with the past as worthless. Some of what the programme bought still has a future value, and that value belongs in the forward comparison.

**Salvage.** The two prototype booms can be stripped of their cameras and sold as conventional trailed boomsprays. The A$90k they would fetch is a future cash flow, and it appears as the value of stopping. It would also be lost if the prototypes were kept for the kit programme or for dealer demonstrations, which is why each option's value has to be built from its own future, not from a common list.

**Reusable work.** About **A$430k** of the A$1,025k capitalised development, the detection software, the camera mounts and the controller, is reused by the retrofit kit. That reuse already shows in the kit's numbers: its development budget is only A$140k because most of the work exists. Adding the A$430k to the kit's value as well would count the same benefit twice. The right question about past work is always what it saves or earns in each future, not what it cost.

**The write-off.** If Corella stopped the full boom, the A$595k of capitalised development that the kit does not reuse would, under the case's illustrative treatment, be written off in the accounts. A write-off is a loss in the profit and loss statement, and it is unwelcome: it reduces reported profit for the year and may draw questions from the bank. It is not a cash flow. The cash left the business when the work was done in 2025 and 2026, and writing the asset down does not take any more out. The case is before tax and ignores any R&D tax offset; in a real appraisal, tax effects of a write-off and of an offset under the R&D Tax Incentive, administered by the ATO with the Department of Industry, Science and Resources, would be future cash flows and would need professional advice. They would not make the sunk A$1,245k itself relevant.

**What the team learned.** The field season showed where detection fails, what dealers will commit to and that growers ask for a kit. None of that is lost by stopping the full boom, and the 14 retrofit kit enquiries recorded in the season (Chapter 7) are one reason the kit is on the list at all.

## The error: two bases in one note

This is an illustration. On 17 April 2026, after the reissued Gate 5 paper reported a Weak signal, the engineering manager sent the gatekeepers a one-page note arguing that the full boom should be launched anyway. Its central passage read:

> Stopping now loses the A$1,245k we have spent. Launching gives a 6.6% chance of A$7,258.9k and recovers the investment.

A table in the note set out the two choices. Stopping was shown at **−A$1,245k**: the money spent, presented as the loss that stopping would crystallise. Launching was shown at its forward expected value of **−A$261.2k**. On that table, launching looked **A$983.8k** better than stopping (−261.2 against −1,245), and the note concluded that a launch was "the lower-loss path".

```figure
type: compare
title: The engineering manager's table against the same table on one basis
cols: Stop, sell prototypes | Full launch | Launch better by
caption: This is an illustration. The note charged stopping with the sunk A$1,245k and showed launching forward-only. On one basis, either forward-only or with sunk costs on both, stopping beats launching by A$351.2k.
- Note of 17 April, mixed basis | −1,245.0 | −261.2 | 983.8
- * Forward-only basis | 90.0 | −261.2 | −351.2
- Sunk included on both | −1,155.0 | −1,506.2 | −351.2
```

The finance manager found the error in the way a finance manager usually does: by asking where each number came from. The −1,245 was the programme's spend to date; the −261.2 was a forward value from the tree. Putting both options on the forward basis gave stopping A$90k (the prototype sale) and launching −A$261.2k, so stopping was **A$351.2k** better than launching. Putting the A$1,245k on both gave −A$1,155.0k against −A$1,506.2k, the same A$351.2k gap. The note's A$983.8k advantage was nothing but the sunk cost, counted on one side.

The note's wording was the second problem. "A 6.6% chance of A$7,258.9k" is accurate: 6.55% is the posterior probability of the High market, and A$7,258.9k is the launch NPV if it occurs. But the full picture on the Weak posterior is three outcomes, not one:

- **6.6%** chance that the market is High and the launch earns more than its cost and the A$1,245k already spent;
- **38.4%** chance that it is Medium, where the launch NPV of A$11.8k is close to break-even and recovers none of the past spend;
- **55.0%** chance that it is Low, where the launch loses **A$1,347.1k** more.

"Recovers the investment" was true in one case in fifteen. In more than half the cases, launching added a second large loss to the first.

The note also shows why the sunk cost effect is persuasive. It framed stopping as a **certain loss**, "loses the A$1,245k", and launching as a **chance to recover**. People faced with a sure loss often prefer a gamble that might avoid it, even a poor gamble. But the A$1,245k was lost whichever option the gate chose; stopping did not lose it and launching could not avoid having spent it. The only losses still open to choice were future ones: A$1,800k of new launch money at risk on one side, a A$90k sale on the other, and a A$560k kit with a positive value in every market state in between.

```figure
type: balance
title: Gate 5 on the forward basis: retrofit kit against full launch
left: Full launch, −A$261.2k
right: Retrofit kit, A$477.9k
tilt: right
caption: This is an illustration. Expected values on the Weak posterior. The A$1,245k already spent is the same under both and is left off the scale.
- New money A$1,800k | New money A$560k
- NPV −A$1,347.1k to A$7,258.9k by state | NPV A$171.7k to A$1,269.2k by state
- 55.0% chance of the Low-market loss | positive in every state
```

The managing director's response was to change the format of gate papers rather than to argue with the note. From Gate 5 onward, every option in a Corella gate paper is shown in one table with the same columns: new money required, value in each market state, expected value, and the probability of a loss, all from today. A line under the table states the spend to date once, labelled "the same under every option". [Stopping well: ending projects that no longer deserve the people and money](/reados/collections/project-sponsors-governance-and-decisions/stopping-projects-well/) describes the organisational side of the same decision, including how to close a project so that the people who worked on it are not treated as having failed.

The engineering manager accepted the corrected table at the gate. That matters more than the error. The note was written by the person who had led the programme for fourteen months and whose team had built the prototypes, which is the position in which the sunk cost effect is hardest to resist. The remedy was not to doubt the manager's judgement but to give the business a format in which the past could not be counted twice.

## Re-forecasting forward

A sunk cost argument often hides a second habit: defending the original business case instead of re-forecasting. The SB36 plan at Gate 3 used a prior of 0.25 High; by Gate 5 the evidence said 0.0655. A gate paper that quoted the Gate 3 expected value of A$1,348.0k for a launch, because it was the approved figure, would make the same mistake as the note by a different route: it would value the future using what was believed in the past. [Schedule, benefits and the cost of delay](/reados/publications/reference-class-forecasting-by-the-numbers/schedule-and-benefit-forecasts/) in *Reference Class Forecasting by the Numbers* shows how a benefit forecast can be checked against the outcomes of similar past projects. At a launch gate, the same discipline means every option's benefits are forecast again from what is known now, and the approved figure appears only as a record of what was once believed. [Scenarios, sensitivity and switching values](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/scenarios-and-switching-values/) in *Demand and Benefit Forecasts by the Numbers* shows how a corrected forecast is tested against its switching values, the inputs at which the decision would change, which is the same forward question a launch gate asks of each option.

## Exercise: an offer for the detection software

Suppose that, a week before Gate 5, a larger sprayer manufacturer offered Corella A$250k, net and payable now, for the SB36 detection software and its rights. Accepting means no retrofit kit, since the kit depends on the software, but the two prototypes could still be sold for A$90k. Corella's spend to date is A$1,245k and its capitalised development A$1,025k. What is the forward value of accepting the offer, how does it compare with the kit and with a full launch, and what role do the A$1,245k and the A$1,025k play?

**Worked answer.** Accepting the offer is worth 250 + 90 = **A$340k** from today. The retrofit kit is worth **A$477.9k** on the Weak posterior and a full launch **−A$261.2k**, so the kit is still the best option, by 477.9 − 340 = A$137.9k, and the offer beats a full launch by A$601.2k. The A$1,245k spent and the A$1,025k capitalised are irrelevant to the ranking: they are the same under all three options. They would matter only to how the sale is accounted for, since selling the software for A$250k would mean writing down most of the capitalised development, and that is a matter for the accounts, not the decision. The offer is still useful: it is a market price for part of the past work, and it sets a floor. If later evidence lowered the kit's expected value below A$340k, selling the software would become the better forward choice.
