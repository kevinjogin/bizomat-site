---
book: project-teams-and-contracts-by-the-numbers
chapterSlug: cost-plus-and-open-book
order: 4
title: "Cost-plus and open book: paying for cost and checking it"
description: "Percentage fee against fixed fee on A$13.50m of direct cost, defining reimbursable cost, an open-book audit that recovered A$207k, and a guaranteed maximum price of A$15.4m."
draft: false
---

Under a cost-plus contract, the owner pays the contractor's actual cost of doing the work, plus a fee for overhead and profit. The owner gives up a fixed price and takes on the whole risk of cost, in return for a contract that can absorb change without renegotiation and a price that contains no premium for risks that may never occur. It is the opposite end of the sharing rule from the lump sum, and it needs a different kind of owner: one prepared to define cost precisely, read cost reports every month and audit them.

This chapter explains when cost-plus fits, compares a percentage fee with a fixed fee on the distribution centre's works, sets out what should and should not count as reimbursable cost, and shows how an open-book audit works and what it can recover. It ends with a guaranteed maximum price, a cap that turns cost-plus back into something closer to a fixed price above a certain level.

## When cost-plus fits

Chapter 3 showed that a lump sum is only as firm as the scope it prices. When the scope cannot be defined well enough to price, a lump sum either carries a large risk premium or turns into a long sequence of variations, each priced without competition. Bajari and Tadelis (2001) showed why cost-plus becomes the better choice as projects grow more complex: the renegotiation costs that a fixed price brings when the design is incomplete eventually outweigh the stronger cost incentive it provides.

Cost-plus is therefore the natural choice for work that must start before it is designed, such as emergency repairs or fast-tracked work on an operating site; for work too new to price, where neither party has a reliable estimate, the situation examined in [The price of being first: a proven line against a novel process](/reados/publications/first-of-a-kind-technology-by-the-numbers/the-price-of-being-first/) in *First-of-a-Kind Technology by the Numbers*; and for work whose scope depends on decisions the owner has not yet made. For the distribution centre, the building is fully designed and suits a fixed price, but the conveyors and controls depend on order profiles and a WMS configuration that will not be final until month 10. That package is the strongest candidate for a cost-based contract.

Cost-plus is a pricing method, not a delivery model. A design-and-construct contractor, a managing contractor or a trade package can each be paid on cost plus fee. [Fixed price or not: separating how work is delivered from how it is priced](/reados/collections/procurement-and-tendering/fixed-price-or-not-choosing-how-work-is-priced/) sets out that distinction; this chapter deals only with the pricing method and the controls it needs.

The NEC4 Engineering and Construction Contract offers this route as **Option E**, a cost reimbursable contract, and **Option F**, a management contract, alongside the priced and target options. Each defines what the contractor is paid for in detail, because under a cost-based contract the definition of cost is the price.

## Percentage fee or fixed fee

The fee can be set in two ways.

A **percentage fee** is a fixed proportion of actual cost. Here it is 8%, so the fee grows and shrinks with the cost. It is simple and needs no estimate at award, which is why it is common for work whose size is unknown. Chapter 2 showed its flaw: a dollar saved costs the contractor 8 cents, and a dollar overspent earns it 8 cents.

A **fixed fee** is a lump sum for overhead and profit, set at award on the estimated cost. In the case it is 8% of the estimated direct cost of A$13.50m excluding GST, **A$1.080m**. The contractor's fee does not change with actual cost, so it has no reason to spend more, though no reason to spend less either. The fixed fee is adjusted only when the owner changes the scope, typically by the same 8% of the change's estimated cost, so that the contractor is paid a fair fee on work it was not asked to price.

```figure
type: formula
title: What the owner pays under cost-plus
formula: Percentage fee: payment = actual cost × (1 + 0.08)
formula: Fixed fee: payment = actual cost + 1.080 + 0.08 × estimated cost of owner changes
caption: This is an illustration. A$m excluding GST. Both fee types reimburse actual cost in full; they differ only in what the fee rewards. The worked lines use the behaviour assumptions stated in the text.
- Actual cost | reimbursable direct cost as defined in the contract, verified by audit
- 0.08 | the fee rate, 8%, for corporate overhead and profit
- 1.080 | the fixed fee, 8% of the estimated direct cost of A$13.50m
step: Percentage fee, actual cost 14.175: 14.175 × 1.08 = 15.309
step: Fixed fee, actual cost 13.905: 13.905 + 1.080 = 14.985
step: Difference to the owner: 15.309 − 14.985 = 0.324
```

## Working the two fees

This is an illustration. All amounts are in A$m excluding GST. To compare the two fee types, the case needs an assumption about how each affects actual cost. This book uses **illustrative teaching assumptions**, not research findings: with a percentage fee, direct cost drifts **5%** above the neutral median of 13.50, because nothing in the contract rewards economy and the open book makes every cost recoverable; with a fixed fee, it drifts **3%**, because the contractor no longer earns on the extra but still has little reason to save. Readers should replace both with their own judgement.

With a **percentage fee**, direct cost is 13.50 × 1.05 = **14.175**, the fee is 0.08 × 14.175 = **1.134**, and the owner pays **15.309**.

With a **fixed fee**, direct cost is 13.50 × 1.03 = **13.905**, the fee is **1.080**, and the owner pays **14.985**.

The difference is **0.324**. Of that, 0.270 is the difference in drift, 0.675 against 0.405, and 0.054 is the fee earned on the extra cost under the percentage fee. A fixed fee costs nothing extra to set up and needs only the estimate the owner already has, yet on these assumptions it saves the owner A$324,000.

Now add the owner's expected changes of **0.50** of direct cost. Under a percentage fee they attract the 8% fee automatically; under a fixed fee, the fee is adjusted by 8% of the change. Either way the changes cost 0.50 × 1.08 = 0.54, so the totals become **15.849** with a percentage fee and **15.525** with a fixed fee. Compare those with the lump sum's expected outturn of **15.695** from Chapter 3, [Lump sum contracts](/reados/publications/project-teams-and-contracts-by-the-numbers/lump-sum-contracts/). On these assumptions, a fixed-fee cost-plus contract is A$0.170m cheaper than the lump sum, because it carries no risk premium and pays only 8% on changes instead of 15%, while a percentage fee is A$0.154m dearer.

```figure
type: bars
title: Expected contract outturn by payment model, including owner changes
unit: A$m
max: 16
caption: This is an illustration. A$m excluding GST, before external contract administration. Cost-plus outturns use the stated behaviour assumptions of +5% and +3% drift; they are teaching values, not research.
- Cost-plus, percentage fee | 15.849 | direct 14.175, fee 1.134, changes 0.54
- Lump sum | 15.695 | price 15.120, variations 0.575
- * Cost-plus, fixed fee | 15.525 | direct 13.905, fee 1.080, changes 0.54
```

These are single-point comparisons at the median. The owner also pays to run each contract. External administration for a cost-plus contract is higher than for a lump sum, about **0.25** against 0.15 in this case, because the costs must be checked and audited. Including it, the fixed-fee contract's expected cost is 15.775 and the percentage-fee contract's 16.099, against the lump sum's 15.845. More important than the medians is the spread. Under a lump sum the owner's cost barely moves when the contractor's cost moves; under cost-plus, every dollar of overrun is the owner's dollar. [Fat tails: when the average misleads](/reados/publications/reference-class-forecasting-by-the-numbers/fat-tails/) in *Reference Class Forecasting by the Numbers* explains why that exposure matters more than the median suggests, and Chapter 10 of this book compares the models across a full simulated distribution.

## Defining reimbursable cost

Under cost-plus, the contract's definition of cost does the work that the price does in a lump sum. Every cost the definition admits is paid in full, with a fee on top if the fee is a percentage, so a loose definition is an open invitation. A sound definition answers five questions.

- **Whose people are cost?** Site staff and labour working on the project, at actual wages and stated on-costs, are cost. Head-office staff, such as estimators, executives and accounts staff, are covered by the fee and are not.
- **What does plant cost?** Plant hired from third parties is paid at invoice. Plant the contractor owns is paid at an agreed **schedule of rates**, set at tender, because otherwise the contractor can charge its own plant to the project at whatever rate it chooses.
- **How are materials and subcontracts paid?** At actual invoice, net of all trade discounts, rebates and credits, with the contractor passing on any discount it receives.
- **What is excluded?** Rework of the contractor's own defective work, fines and penalties, costs of the contractor's disputes with its own subcontractors, interest and finance charges, and anything the contractor would have spent in any case.
- **How is cost evidenced?** Time sheets, invoices, plant logs and payment records, kept to a standard set in the contract and open to the owner's auditors.

```figure
type: checklist
title: Reimbursable cost in a cost-plus contract
caption: Ticked items are reimbursable on evidence; crossed items should be excluded or paid only at agreed rates. The three crossed items at the end are the ones this chapter's audit found.
- Site labour at actual wages and stated on-costs | supported by time sheets
- Materials and subcontracts at invoice, net of discounts and rebates | supported by invoices and payment records
- Third-party hired plant at invoice | supported by plant logs
- Owned plant at the agreed schedule of rates | rates set at tender
- x Head-office staff charged as site staff | covered by the fee
- x Owned plant charged at hire rates above the schedule | the schedule is the ceiling
- x Rework of the contractor's own defective work | the contractor's cost, not the owner's
```

## Open-book reporting and audit

Open book means the owner can see the contractor's actual costs, not just its claims. In practice that takes three things.

First, a **monthly cost report** in a fixed format. In this case it has 12 lines, from site labour and staff through materials, subcontracts, hired and owned plant and site overheads to the fee, each showing cost this month, cost to date, the original estimate and the forecast cost to complete. The cost-to-complete forecast matters most, because it shows where the final cost is heading while there is still time to act.

Second, **audit rights** written into the contract: the owner's auditor may inspect any record supporting a claimed cost, at any time up to a stated period after completion, and costs not supported are not paid.

Third, **audits that actually happen**, early enough to change behaviour. An audit after completion recovers money; an audit in the first third of the works also changes how costs are coded for the rest of the job.

Open book does not mean the owner trusts less. It means trust is checked, which protects an honest contractor as much as the owner, because a clean audit is the best evidence that the contractor's costs are real.

## The error: costs that should not have been there

This is an illustration, worked on the percentage-fee version of the works. The owner's first open-book audit, in **month 9**, sampled the cost reports for months 5 to 8 against time sheets, invoices and plant logs. It found three problems.

- **Head-office estimating staff charged as site staff: A$112,000.** Two estimators who had worked on the tender and on pricing changes from head office were coded to the project's site staff line. Their cost is covered by the fee.
- **Owned plant charged at hire rates above the agreed schedule: A$46,000.** The contractor's own telehandlers and elevated work platforms had been charged at the rates a hire company would charge, not at the lower schedule of rates in the contract.
- **Rework of the contractor's own defective work: A$34,000.** A section of tilt-up panel connections had been installed out of tolerance and redone, and the rework was coded to the structure line.

Together, the disallowed costs came to **A$192,000**. Under the percentage fee, each disallowed dollar also carried 8% fee, a further **A$15,000**, so the owner's saving was **A$207,000**. The two audits in the contract cost **A$18,000** each, **A$36,000** in total, so the audits returned about **5.8 to 1**.

None of the three items needed fraud. Coding head-office staff to the project is easy when the same people work on both; charging owned plant at market rates seems reasonable to a plant department that charges every job the same way; and rework looks like any other labour on a time sheet. They were found because the audit sampled the source documents against the definition of cost, and because the definition was precise enough to test against. The contractor accepted the findings, credited the amounts in the next payment claim, and changed its cost coding for the rest of the job, which is the larger and less visible benefit of an early audit.

## Guaranteed maximum price

A **guaranteed maximum price** (GMP) adds a cap to a cost-plus contract. The owner pays cost plus fee up to the cap; above it, the contractor pays. Below the cap, the owner keeps the open-book benefits; above it, the contractor carries the risk as it would under a lump sum. Some GMP contracts also share savings below the cap, which moves them towards the target-cost model of the next chapter, [Target cost with pain and gain share](/reados/publications/project-teams-and-contracts-by-the-numbers/target-cost-pain-and-gain-share/).

A GMP is only as useful as the scope it covers. Changes by the owner must adjust the cap, or the cap becomes meaningless, and a contractor asked for a GMP on an incomplete design will set the cap high enough to protect itself, which brings back the risk premium that cost-plus was meant to avoid.

## Exercise: a guaranteed maximum price

The owner asks for a guaranteed maximum price of **A$15.4m** on the works, with a fixed fee of A$1.080m and no sharing below the cap. Ignoring owner changes, what does the owner pay, and what is the contractor's margin, if actual direct cost is A$13.50m, A$14.00m and A$14.50m? At what direct cost does the cap start to bind?

**Worked answer.** At a direct cost of **13.50**, cost plus fee is 13.50 + 1.080 = 14.580, below the cap, so the owner pays **14.580** and the contractor's margin is its full fee, **1.080**. At **14.00**, cost plus fee is **15.080**, still below the cap; the owner pays it and the margin is again **1.080**. At **14.50**, cost plus fee would be 15.580, above the cap, so the owner pays **15.400** and the contractor's margin falls to 15.400 − 14.50 = **0.900**. The cap binds once direct cost exceeds 15.400 − 1.080 = **14.320**; above that, every extra dollar comes out of the contractor's fee, and above 15.400 the contractor is working at a loss. Below the cap the owner carries the cost risk in full; above it, the contractor does. The GMP has bought the owner protection against the upper tail at the price of making the contractor behave like a lump-sum contractor once costs approach the cap.
