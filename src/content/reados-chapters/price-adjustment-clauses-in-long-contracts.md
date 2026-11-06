---
title: "Price adjustment clauses: sharing inflation and market risk fairly in long contracts"
description: "A fixed price over several years forces someone to guess future costs. How index-linked adjustment works, how to choose indices and weights, and how to keep the formula fair and auditable."
publishDate: 2026-10-09
category: "Business"
tags:
  - finance
  - sales
  - customers
author: "BIZOMAT"
featured: false
draft: false
---

A small fabricator is asked to quote a fixed price per unit for a two-year supply contract. Steel makes up a large share of the cost, and steel prices have moved sharply in recent years. Labour rates will rise at the next award or enterprise agreement review. Some components are imported, so the exchange rate matters too. The fabricator has three choices: add a large contingency and risk losing the contract, price tightly and hope costs behave, or propose a price that adjusts as costs move.

Long fixed-price contracts often feel safe to the buyer. In practice, when a major cost driver is volatile and outside both parties' control, a fixed price does not remove the risk. It hides it. The supplier either prices the risk in through contingency, which the buyer pays whether or not costs rise, or does not price it in and may struggle, cut corners or walk away if costs rise sharply. Neither outcome is good for the buyer.

A **price adjustment clause**, sometimes called a rise-and-fall or escalation clause, links part of the price to published measures of cost, so that the price moves when those costs move. This article explains when such clauses make sense, how the formula works, how to choose indices and weightings, how to keep the clause fair and workable, and what to watch for under Australian law. It is general information. Contract wording matters, so take legal advice on significant agreements.

## The underlying question

The key question in any long contract is: **which cost movements should the supplier control, and which are external market risks?**

The supplier should carry the risks it can manage: its own productivity, purchasing skill, scrap rates, overheads and efficiency. If the supplier buys steel badly or wastes labour, that is its problem. But a broad movement in the market price of steel, a general rise in wage rates or a large exchange rate swing is not something the supplier can control. Asking it to guess these years in advance produces either an inflated price or an unsustainable one.

A well-designed adjustment clause separates the two. It passes through general market movements, measured by an external index, while leaving the supplier fully responsible for how efficiently it buys and works.

## When an adjustment clause makes sense

A clause is worth the effort when most of the following hold:

- **Exposure**: a major cost driver, such as a material, labour or an exchange rate, makes up a significant share of the price.
- **Volatility**: that cost has moved significantly in the past and could do so again.
- **Duration**: the contract runs long enough for movements to matter, typically more than about a year.
- **Objectivity**: a credible, independently published index tracks the cost.
- **Relevance**: the index reflects the supplier's real cost exposure.
- **Administration**: both parties can calculate and check the adjustment without excessive effort.

For short contracts, stable costs or small values, a clause adds administration without much benefit. A firm price, perhaps with a short validity period on the quote, is simpler.

## How the formula works

Most adjustment clauses use a formula of this shape:

**Adjusted price = Base price × (Fixed share + Σ (Weight × Current index ÷ Base index))**

In words, the base price is split into portions. A **fixed share** does not change. Each variable portion has a **weight**, equal to its share of the price, and moves in proportion to an agreed index, compared with the index value at an agreed **base date**. The weights and the fixed share add up to 1.

```figure
type: formula
title: The shape of a price adjustment formula
formula: Adjusted price = Base price × (Fixed share + Σ (Weight × Current index ÷ Base index))
caption: Keep margin and overheads in the fixed share, and index only genuinely volatile costs.
- Fixed share | the part that never adjusts
- Weight | each variable cost's share of the price
- Index ratio | today's index value against the base date
- Sum | weights plus fixed share add up to 1
```

Each element needs care:

| Element | What it is | What to decide |
|---|---|---|
| **Base price** | The agreed price at the base date | Usually the tendered or quoted price |
| **Base date** | The date the base price reflects | Often the tender closing date or quote date |
| **Fixed share** | The part of the price that never adjusts | Usually margin, overheads and costs not tied to an index |
| **Weights** | Each variable cost's share of the price | Based on the actual cost structure of the work |
| **Indices** | Published measures of each cost | Relevant, reliable, regularly published |
| **Adjustment timing** | When and how often prices are recalculated | Per invoice, per order, quarterly or annually |
| **Index period** | Which index value applies to each adjustment | For example, the latest published value at the order date |

Keeping margin and overheads in the fixed share matters. If the whole price were indexed, a rise in steel prices would also increase the supplier's margin on labour and overheads, which is a windfall the supplier did nothing to earn.

## Choosing indices

The index is the heart of the clause, and a poor choice causes most disputes. A good index:

- **Tracks the actual cost** the supplier faces, for the specific material, labour type or currency.
- **Is published independently**, by a statistical agency, central bank or recognised market source, not by either party.
- **Is published regularly and reliably**, with a known schedule.
- **Is likely to continue**, so the clause does not fail halfway through the contract.

In Australia, the Australian Bureau of Statistics publishes the Consumer Price Index, the Wage Price Index and a range of Producer Price Indexes covering inputs and outputs for many industries. The Reserve Bank of Australia publishes exchange rates. Industry bodies and commodity markets publish prices for specific materials. Choose the most specific suitable index rather than a general one. The Consumer Price Index, for example, measures household prices and may move quite differently from the costs of a fabricator or a cleaning contractor.

Three practical cautions apply. Indices are published after the period they measure, sometimes weeks later, so decide which published value applies at the time of each adjustment. Some indices are revised after first publication, so state whether the first published value is used or whether revisions are taken into account. And indices are sometimes rebased, renamed or discontinued, so include a fallback: how the parties will choose a replacement and convert between the old and new series.

## Weightings should reflect the real cost structure

Weights should be based on how the supplier's costs actually break down for this work, not on a generic template. If steel is 40% of the price, its weight should be close to 0.40. Over-weighting a volatile input transfers more risk to the buyer than necessary; under-weighting it leaves the supplier exposed.

Buyers can reasonably ask for a cost breakdown to support the weights, and suppliers should be prepared to give one. A should-cost estimate, built from material, labour, overhead and margin, is a useful check. The [should-cost modelling for bought parts](/reados/collections/procurement-and-tendering/should-cost-modelling-for-bought-parts/) article covers estimating what an item ought to cost.

## Symmetry: movements both ways

A fair clause works in both directions. If costs fall, the price falls. A clause that only allows increases is a one-way bet for the supplier and should be resisted by any buyer.

This also matters legally. Under the Australian Consumer Law, unfair terms in standard form contracts with consumers and small businesses are void, and businesses can face penalties for including them. The law's examples of potentially unfair terms include a term that lets one party, but not the other, vary the upfront price without giving the other party a right to terminate. A one-sided price increase clause in a standard form contract can therefore carry real legal risk. The ACCC publishes guidance on unfair contract terms, and a lawyer can review your terms.

Some states also restrict price escalation clauses in domestic building contracts. If you work in residential construction, check the rules in your state before including one.

## Thresholds, caps and sharing

A basic formula passes all movements through. Several refinements are common:

- **Threshold or deadband**: no adjustment unless the formula moves the price by more than an agreed percentage, such as 2%. This avoids administering tiny changes.
- **Cap**: a maximum adjustment over a period or over the contract, which limits the buyer's exposure.
- **Floor or collar**: a minimum, which limits the supplier's exposure to falls.
- **Sharing**: movements beyond a threshold are shared between the parties in an agreed ratio, such as 50:50.
- **Re-opener**: if movements exceed a larger limit, the parties must renegotiate, with a right to end the contract if they cannot agree.

Each refinement changes who carries how much risk. Caps protect the buyer but return extreme risk to the supplier, who may price it in. Use them deliberately, not by habit.

```figure
type: compare
title: Refinements to a basic formula
cols: What it does | Who it protects
caption: Each refinement moves risk between the parties; test them all against high and low scenarios.
- Threshold | No adjustment inside a band, such as 2% | Both: less administration
- Cap | Limits the maximum adjustment | The buyer
- Floor or collar | Limits the minimum | The supplier
- Sharing | Splits movements beyond a threshold, such as 50:50 | Both, in agreed proportions
- Re-opener | Forces renegotiation past a larger limit | Both, with a right to exit
```

## Alternatives to an index clause

Indexation is not the only option. Others include:

- **A firm price with contingency**: simplest to administer, but the buyer pays for risk whether or not it occurs.
- **Shorter contracts or price review dates**: the price is reset periodically by negotiation.
- **Pass-through of actual costs with evidence**: the supplier passes on invoiced material costs. This tracks the supplier's real costs but removes its incentive to buy well, so it needs scrutiny.
- **The buyer supplying the material**: common for high-value materials, though it moves handling and quality responsibilities to the buyer.
- **Buying ahead or hedging**: securing materials or currency early, where the supplier or buyer has the capacity to do so.

An index clause has one particular advantage over cost pass-through. The supplier is paid for the market movement, not its own costs. If it buys better than the index suggests, it keeps the benefit; if it buys worse, it bears the loss. That keeps the incentive to manage costs well.

## Test the clause before signing

Before agreeing a clause, both parties should run the formula through plausible high and low scenarios to see the range of prices it could produce. For the buyer, that range, not the base price, is the real budget commitment. For the supplier, it shows whether the clause genuinely protects against the risks it fears.

Write a worked example into the contract or a schedule, showing exactly how an adjustment is calculated with sample index values. If both parties' finance staff can reproduce the calculation independently, most disputes are avoided.

## Administering the clause

A clause is only as good as its administration. Record the base date, the base index values and their sources. Diarise each adjustment date. Keep a calculation sheet that both parties can see. Apply decreases as promptly as increases. Review the clause periodically to check that the indices still reflect the supplier's real costs, and use the fallback provisions if they no longer do.

## A worked example

This is an illustration. A steel fabricator quotes a two-year contract to supply frames to an equipment manufacturer at a base price of $1,000 per frame. The fabricator's cost breakdown shows that steel is about 40% of the price, labour about 30%, and the remaining 30% covers consumables, overheads and margin.

```figure
type: stack
title: How the $1,000 frame price is weighted
unit: %
caption: Weights follow the fabricator's actual cost breakdown; only steel and labour are indexed.
- Fixed: consumables, overheads, margin | 30
- Steel, indexed | 40
- Labour, indexed | 30
```

The parties agree a formula:

**Price = $1,000 × (0.30 + 0.40 × Steel index ÷ Steel base index + 0.30 × Labour index ÷ Labour base index)**

The steel index is a published producer price index for the relevant steel products, and the labour index is the Wage Price Index for the relevant industry. Adjustments are made quarterly, using the latest published index values at the start of each quarter. No adjustment is made if the calculated change is within ±2% of the current price.

**First adjustment.** After six months, the steel index has risen 15% and the labour index 4%. The calculation is 0.30 + (0.40 × 1.15) + (0.30 × 1.04) = 0.30 + 0.46 + 0.312 = 1.072. The new price is $1,072, an increase of 7.2%.

```figure
type: formula
title: The first quarterly adjustment
formula: Price = $1,000 × (0.30 + 0.40 × steel ratio + 0.30 × labour ratio)
caption: No adjustment is made if the calculated change is within ±2% of the current price.
step: Steel up 15%, labour up 4%
step: 0.30 + (0.40 × 1.15) + (0.30 × 1.04) = 1.072
step: New price $1,072, an increase of 7.2%
```

**A fall.** A year later, steel has fallen back to 10% below its base value, while labour is 4% above base. The calculation is 0.30 + (0.40 × 0.90) + (0.30 × 1.04) = 0.30 + 0.36 + 0.312 = 0.972. The price falls to $972.

**Scenario testing before signing.** In a high scenario, with steel up 30% and labour up 8%, the price would be $1,000 × (0.30 + 0.52 + 0.324) = $1,144. In a low scenario, with steel down 20% and labour up 3%, it would be $1,000 × (0.30 + 0.32 + 0.309) = $929. The buyer therefore budgets for a range of roughly $930 to $1,145 per frame.

**The comparison.** Without the clause, the fabricator says it would have quoted a firm price of about $1,080, including contingency for steel risk. With the clause, the buyer pays less than that in most scenarios and more only if steel rises sharply. The buyer decides that the lower expected price and the fabricator's greater willingness to commit to a two-year term are worth the budget variability. The fabricator, for its part, can quote tightly without betting the business on steel prices.

```figure
type: range
title: The frame price with and without the clause
min: 900
max: 1160
ticks: $900 | $1,030 | $1,160
caption: The buyer pays less than the firm price in most scenarios, and more only if steel rises sharply.
- *With the clause: tested range | $929 | $1,144 | low and high scenarios
- After steel fell 10% | $972
- After the first adjustment | $1,072
- Firm price without the clause, with contingency | $1,080
```

## How this applies to a small Australian business

- **As a supplier**, identify volatile cost drivers before quoting long contracts, and propose a clause rather than a large contingency.
- **As a buyer**, consider whether a firm price is really cheaper once the supplier's contingency is included.
- **Keep margin and overheads fixed**, and index only genuinely volatile costs.
- **Choose specific, independent indices**, with a fallback if they change.
- **Base weights on the real cost structure.**
- **Make the clause symmetric**, and be aware of unfair contract terms law.
- **Test the formula** with high and low scenarios before signing.
- **Include a worked calculation** in the contract.
- **Administer it consistently**, applying decreases as promptly as increases.
- **Take legal advice** on significant contracts.

## Common mistakes

- **Assuming any adjustment destroys fixed-price discipline.**
- **Indexing the whole price**, including margin.
- **Choosing a general index** that does not match the real costs.
- **Allowing increases only.**
- **Adding complex formulas** to short, stable contracts.
- **Forgetting about index revisions**, delays or discontinued series.
- **Treating the base price** as the buyer's only budget commitment.

## Questions to ask

- Which costs in this contract can the supplier control, and which are market risks?
- How large and volatile are the uncontrollable costs?
- Is there an independent index that tracks each one?
- What would the formula produce in high and low scenarios?
- Does the clause work the same way in both directions?
- Could both parties reproduce the calculation from the contract alone?
- What happens if an index stops being published?

## Bringing it together

In a long contract, someone has to carry the risk of costs that neither party controls. A fixed price makes the supplier guess and usually makes the buyer pay for that guess. A well-designed adjustment clause passes general market movements through transparently, using independent indices and weights based on the real cost structure, while leaving the supplier responsible for everything it can control. Keep the clause symmetric, test it against plausible scenarios, write in a worked example and a fallback, and administer it consistently. Done well, it lets suppliers quote realistic prices and gives buyers a fairer deal over the life of the contract. The [negotiating as a small supplier](/reados/collections/selling-and-business-development/negotiating-as-a-small-supplier/) article covers other terms worth negotiating with larger customers.

---

*Source: BIZOMAT notes on economic price adjustment in long-duration contracts. Examples and figures in this article are illustrations. This article is general information and does not constitute legal or financial advice.*
