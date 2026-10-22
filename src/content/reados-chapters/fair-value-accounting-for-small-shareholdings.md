---
title: "Small shareholdings: fair value accounting and its effect on profit"
description: "How businesses account for small investments in other companies' shares, how fair value is measured for listed and unlisted shares, and why market swings can flow straight into reported profit."
publishDate: 2026-10-04
category: "Business"
tags:
  - finance
  - strategy
author: "GoCore"
featured: false
draft: false
---

Plenty of businesses hold small parcels of shares in other companies. A company with surplus cash might invest in listed shares. A business might take a small stake in a supplier or customer to strengthen a relationship. A founder's company might hold shares received in exchange for services, or a small interest in an early-stage venture.

When the holding is small enough that the investor has little or no influence over the company it has invested in, the accounting is quite different from the equity method or consolidation. The investment is treated as a financial asset and, in most cases, measured at **fair value**: what it would sell for today. That sounds simple, but it has important consequences. Changes in share prices can flow straight into reported profit, and valuing shares in private companies requires judgement.

This article explains how small shareholdings are accounted for under Australian standards and under the US standards used in the source course material, how fair value is measured, the choices available to investors, and what all this means for business owners and readers of financial statements. It is part of GoCore's series on investments, groups and acquisitions, introduced in [Accounting for investments in other companies](/reados/collections/acquisitions-groups-and-investment-accounting/accounting-for-investments-in-other-companies/).

## When fair value accounting applies

Fair value accounting applies to equity investments where the investor has neither control nor significant influence. As a starting presumption, that usually means holdings of less than 20% of the voting rights, though the substance of the relationship decides. A 15% holder with board representation might have significant influence and use the equity method instead.

## The Australian approach: AASB 9

In Australia, equity investments of this kind fall under AASB 9 *Financial Instruments*, equivalent to the international standard IFRS 9.

### The default: fair value through profit or loss

By default, equity investments are measured at **fair value through profit or loss**:

- The investment is recorded at fair value when acquired. Transaction costs are expensed for investments at fair value through profit or loss.
- At each reporting date, it is remeasured to fair value.
- Increases and decreases in fair value are recognised in profit or loss.
- Dividends are recognised as income when the right to receive them is established.

### The election: fair value through other comprehensive income

For an equity investment that is not held for trading, an investor can make an **irrevocable election**, on initial recognition and investment by investment, to present changes in fair value in **other comprehensive income** instead of profit. Under this election:

- the investment is still measured at fair value on the balance sheet
- fair value changes go to other comprehensive income, keeping them out of reported profit
- dividends are still generally recognised in profit
- when the investment is sold, accumulated gains or losses are **not** transferred into profit; they may be moved within equity

The election suits strategic, long-term holdings, where short-term market movements would otherwise make profit volatile without reflecting the business's performance. The trade-off is permanent: gains on sale never appear in profit.

## The US approach in the course material

The course material describes the US standard, ASC 321, which is similar in outline.

- Equity securities without significant influence are generally measured at **fair value through net income**, with dividends as income.
- There is no equivalent to the Australian other comprehensive income election for equity securities.
- Where fair value is **not readily determinable**, typically shares in a private company, an investor may elect a **measurement alternative**: cost, less impairment, plus or minus changes resulting from observable price changes in orderly transactions for identical or similar investments of the same issuer.

The measurement alternative is a practical concession: it avoids requiring a full valuation of private company shares every reporting period. Australian standards do not contain the same alternative, although cost may sometimes be an appropriate estimate of fair value in limited circumstances, such as when insufficient recent information is available.

## A worked example

This is an illustration with round numbers.

On 1 July, Ridgeway Pty Ltd buys 5,000 shares in a listed company at $12 per share, a total of $60,000. This represents a small fraction of the company's shares, giving Ridgeway no influence. During the year, the company pays a dividend of $0.50 per share. At 30 June, its shares trade at $15.

**Under fair value through profit or loss:**

| Item | Calculation | Amount |
| --- | --- | --- |
| Initial investment | 5,000 × $12 | $60,000 |
| Dividend income | 5,000 × $0.50 | $2,500 in profit |
| Fair value at year end | 5,000 × $15 | $75,000 |
| Fair value gain | $75,000 − $60,000 | $15,000 in profit |

Ridgeway's profit includes $17,500 from the investment: $2,500 of dividends and a $15,000 unrealised gain.

```figure
type: stack
title: What Ridgeway's $60,000 holding adds to profit in year one
unit: $
caption: Under the default treatment, both lines are in profit; under the election, only the dividend is.
- Unrealised fair value gain, 5,000 × ($15 − $12) | 15000
- Dividend income, 5,000 × $0.50 | 2500
```

**Under the other comprehensive income election:** the balance sheet still shows $75,000, and dividend income of $2,500 is in profit, but the $15,000 gain appears in other comprehensive income instead of profit.

Now suppose the next year the share price falls to $10. Under fair value through profit or loss, Ridgeway records a $25,000 loss in profit. Under the election, the loss goes to other comprehensive income. In both cases the balance sheet shows $50,000.

```figure
type: line
title: Ridgeway's holding at each reporting date
x: Date
y: Carrying amount ($'000)
ymin: 40
ymax: 80
caption: The balance sheet follows the market either way. The $15,000 gain and then $25,000 loss hit profit by default, or other comprehensive income under the election.
- Purchase, $12 | 60
- Year 1, $15 | 75
- Year 2, $10 | 50
```

The example shows why the choice matters: under the default, a business's reported profit can swing by tens of thousands of dollars because of share price movements unrelated to its own operations.

## Measuring fair value

**Fair value** is defined in AASB 13 *Fair Value Measurement* as the price that would be received to sell an asset in an orderly transaction between market participants at the measurement date. It is a market-based exit price, not what the investor paid or what it thinks the shares are worth to itself.

AASB 13 groups the inputs used to measure fair value into a **hierarchy**:

| Level | Inputs | Example |
| --- | --- | --- |
| Level 1 | Quoted prices in active markets for identical assets | Shares traded on the ASX |
| Level 2 | Other observable inputs | Recent prices for similar shares; observable market data |
| Level 3 | Unobservable inputs based on assumptions | Valuation models for private company shares |

```figure
type: layers
title: The AASB 13 fair value hierarchy
caption: The further down the hierarchy, the more judgement is involved and the more must be disclosed.
- Level 1 | quoted prices for identical assets in active markets, such as ASX shares
- Level 2 | other observable inputs, such as recent prices for similar shares
- *Level 3 | unobservable inputs: valuation models for private company shares
```

Listed shares are usually straightforward Level 1 measurements: quantity multiplied by quoted price. Shares in private companies usually require Level 3 valuations, using approaches such as:

- **market approaches:** prices in recent transactions in the company's shares, or valuation multiples of comparable companies
- **income approaches:** discounted cash flow models estimating the value of future cash flows
- **net asset approaches:** the value of the company's underlying assets less liabilities, sometimes used for asset-holding entities

Level 3 measurements involve significant judgement, and financial statements must disclose more information about them, including the techniques and key assumptions used.

## Practical issues for unlisted investments

Businesses holding shares in private companies face particular challenges.

**Information.** Small minority shareholders may receive limited financial information from the investee.

**Discounts.** A minority stake in a private company is usually worth less per share than a proportionate share of the whole company, because it carries no control and cannot easily be sold. Valuations often reflect this.

**Changes in value.** Funding rounds, offers for the company or significant changes in its performance may provide evidence that fair value has changed.

**Cost and effort.** Formal valuations can be expensive. For small holdings, a reasonable, documented approach proportionate to the investment's significance is usually appropriate, but professional advice is worthwhile when amounts are material.

## No separate impairment test

Investments measured at fair value do not need a separate impairment test. Any fall in value is already captured in the fair value measurement: through profit or loss under the default treatment, or through other comprehensive income under the election. This is a difference from investments carried at cost or under the equity method, which must be tested for impairment when there are signs of a decline. Under the US measurement alternative, which carries investments at cost with adjustments, an impairment assessment is required.

## Shares received rather than bought

Small businesses sometimes receive shares instead of cash, for example when a start-up client pays for services partly in equity, or when shares are received as part of a settlement. In such cases, the shares are generally recorded at fair value when received, and the corresponding revenue or gain is measured on the same basis. Thereafter, they are accounted for like any other equity investment.

Valuing such shares is often difficult, because they are usually in young private companies with uncertain prospects. A prudent, documented estimate, considering recent funding rounds and the company's circumstances, is important, and it is worth recognising that the shares may ultimately prove to be worth much less than their initial valuation.

## What must be disclosed

Financial statements must explain how investments are measured and provide information about fair value measurements, including which level of the hierarchy they fall into. For Level 3 measurements, disclosures include the valuation techniques used, significant unobservable inputs and how changes in those inputs would affect the valuation. Investments designated at fair value through other comprehensive income must be identified, along with the reasons for the designation. These disclosures help readers judge how much reliance to place on the reported values.

## Why this matters for business owners

**Profit volatility.** If a business holds material listed investments at fair value through profit or loss, its reported profit may move with the share market. This can affect perceptions of performance, bonus calculations and lending covenants based on profit. The other comprehensive income election, made at the start, can avoid this for strategic holdings.

**Unrealised gains are not cash.** A fair value gain increases profit but produces no cash until the shares are sold. Distributions or decisions based on such profits deserve caution.

**Tax differs from accounting.** The tax treatment of shares, including capital gains tax on disposal, generally depends on realisation and on the investor's circumstances, not on accounting fair value changes. Businesses should not assume that accounting gains create immediate tax liabilities, or vice versa, without advice.

**Documentation matters.** For private company shares, keeping records of how fair value was estimated supports the financial statements and any audit.

## Reading financial statements with fair value investments

For investors and lenders reading another company's financial statements:

- **separate operating profit from investment gains.** A business whose profit rose mainly because of fair value gains on investments has not necessarily improved its operations.
- **check the level of measurement.** Level 3 valuations involve more judgement and deserve more scrutiny.
- **look at other comprehensive income.** Gains and losses on investments under the election are not in profit, but they are part of the company's overall performance.
- **consider liquidity.** Investments in private companies may be hard to sell at their reported value.

## Common mistakes

**Ignoring the other comprehensive income election.** It must be made at initial recognition and cannot be changed later.

**Treating unrealised gains as cash.** They are not available until the shares are sold.

**Valuing private shares at a proportion of the company's total value without considering minority discounts.** Fair value reflects what a market participant would pay for the actual holding.

**Mixing up accounting and tax.** The rules and timing differ.

**Assuming US and Australian rules are identical.** The measurement alternative and the election differ.

## Questions to ask

- Does the investor have little or no influence, or could it have significant influence?
- Is the investment held for trading, and would the other comprehensive income election be appropriate?
- How is fair value measured, and at what level of the hierarchy?
- How much of reported profit comes from fair value changes rather than operations?
- For your own business: how would a 30% fall in the value of your investments affect your reported profit?

## Bringing it together

Small shareholdings, without significant influence or control, are generally measured at fair value. Under Australian standards, changes in fair value go to profit by default, with an irrevocable election available to present them in other comprehensive income for equity investments not held for trading. US standards, used in the source course, require fair value through net income but offer a measurement alternative for shares without readily determinable fair values.

Fair value is a market exit price, measured using a hierarchy of inputs from quoted prices to valuation models. For business owners and readers of financial statements, the key points are to understand how fair value changes affect profit, to treat unrealised gains with caution, and to scrutinise valuations of unlisted investments.

---

*Sources: course materials from an advanced financial reporting course (Module 1, based on US GAAP), together with Australian Accounting Standards, including AASB 9 and AASB 13. Figures are illustrations. This article is general information, not accounting, tax or financial advice; consult a qualified accountant about your circumstances.*
