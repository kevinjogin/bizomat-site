---
book: engineering-software-you-can-sell
chapterSlug: choose-a-licensing-model
order: 5
title: "Choose a licensing model"
description: "Compare perpetual and subscription licences, named and floating seats, trials and site licences on five-year revenue, cash flow, customers' budgets and the promises each model makes."
draft: false
---

A licence is the product's commercial shape. It decides how customers pay, how much the firm earns over time, when the cash arrives, what customers can do with the software and what the firm has promised in return. Engineering firms selling software for the first time often copy whatever their CAD vendor does, or whatever a competitor does, without working through what that model means for a product of their size and kind.

This chapter compares the main licensing models for the drawing-checking add-in. It works through five-year revenue and cash flow for perpetual and subscription licences, shows why floating licences can quietly halve revenue for a tool used in short bursts, sets the trial and site-licence terms and records the promises each model makes. The failure case is a well-meant promise of free updates for life, made to the pilot firms, which became an obligation the office had to honour.

## The main models

```figure
type: compare
title: Licensing models for an engineering add-in
cols: Customer pays | Customer gets | What it means for the maker
caption: This is a general comparison. Many products combine models, for example subscriptions for most customers and site licences for large firms.
- Perpetual with maintenance | a one-off fee, then an optional annual maintenance fee | use of the version bought forever; updates and support while maintenance is paid | cash up front; maintenance renewals decline over time
- *Subscription | an annual or monthly fee | use, updates and support while subscribed | smaller, recurring revenue; the product must keep earning renewal
- Named user | per person | one person may use it on their machines | simple to count and price
- Floating or concurrent | per simultaneous user | any user, up to the number of licences at once | fewer licences for tools used briefly; needs a licence server
- Site or enterprise | one negotiated fee | unlimited users at a site or firm | predictable for large customers; harder to price
- Free trial | nothing, for a set period | full function, time-limited | the main route to a sale for small products
```

## Perpetual or subscription: five-year revenue

This is an illustration. The office considered two prices for a seat:

- **Perpetual:** A$1,200 per seat, excluding GST, with optional maintenance at 20% a year, A$240, covering updates and support. From the pilot and from conversations with peers, it assumed **70%** of seats would renew maintenance each year.
- **Subscription:** A$495 per seat per year, excluding GST, including updates and support. It assumed **85%** of seats would renew each year.

```figure
type: formula
title: Expected five-year revenue per seat
formula: perpetual = price + Σ maintenance × r^k for k = 1 to 4        subscription = Σ fee × s^k for k = 0 to 4
caption: This is an illustration with the office's assumed renewal rates, r = 0.70 for maintenance and s = 0.85 for subscriptions. Amounts exclude GST and are not discounted for timing.
- Perpetual | A$1,200, then maintenance A$240 a year
- Subscription | A$495 a year
step: perpetual ≈ 1,200 + 240 × (0.70 + 0.49 + 0.343 + 0.240) ≈ 1,200 + 426 ≈ A$1,626
step: subscription ≈ 495 × (1 + 0.85 + 0.7225 + 0.6141 + 0.5220) ≈ A$1,836
```

Over five years, on these assumptions, a subscription seat earns about **A$1,836** against about **A$1,626** for a perpetual seat. The difference is about 13%. The timing differs far more. For every 100 seats sold in year one, the perpetual model brings in **A$120,000** that year and only about **A$16,800**, **A$11,760**, **A$8,232** and **A$5,762** in maintenance in the following years. The subscription model brings in **A$49,500** in year one, then about **A$42,075**, **A$35,764**, **A$30,399** and **A$25,839**.

The perpetual model is attractive for its first-year cash. Its weakness is that the maker must keep improving and supporting the product for customers whose maintenance has lapsed and who no longer pay. Many will come back with questions anyway. The subscription model ties revenue to continuing value: if the product stops being useful, customers stop paying, and the maker finds out within a year.

## What customers' budgets prefer

Customers have views too. Some engineering firms prefer subscriptions, which fit operating budgets and avoid a large one-off cost. Others, especially those burned by CAD vendors' moves to subscription, prefer to own what they buy. The interviews in Chapter 1 split roughly evenly.

The office chose **subscription as the standard model**, priced at A$495 per seat a year excluding GST. It offered a perpetual option for firms that insisted, at A$1,200 with 20% maintenance, but it did not advertise it. Few took it. The subscription matched the product's reality: an add-in that must be updated for every new CAD release to keep working is not really a one-off purchase.

## Named or floating: the trap for short-use tools

Floating licences let any user run the software, up to a set number at once. For tools used all day, such as CAD itself, a floating licence and a named licence are worth similar amounts. For a tool used in short bursts, they are not.

This is an illustration. At a firm with **10** designers, each checks about 7 drawings a week, with the add-in open for about 6 minutes per drawing. That is **10 × 7 × 6 ÷ 60 = 7** hours of use a week, out of about 380 designer-hours, about **2%** of the time. Even allowing for peaks before deadlines, the firm would rarely need more than **3** floating licences.

```figure
type: bars
title: Annual revenue from one firm of ten designers
unit: A$, excluding GST
max: 5500
caption: This is an illustration. Because the add-in is open only about 2% of each designer's time, three floating licences would serve ten people; floating licences must be priced accordingly or not offered.
- Ten named-user subscriptions at A$495 | 4950
- Three floating licences at 1.5 × A$495 | 2228
- Three floating licences at 3 × A$495 | 4455
```

Ten named subscriptions earn **A$4,950** a year. Three floating licences priced at 1.5 times the named price, a common rule of thumb in some software markets, earn only about **A$2,228**, less than half. Floating licences would need to be priced at about three times the named price to come close. They also need a licence server at the customer, which adds installation work.

The office offered named-user subscriptions only, with licences transferable between people when staff change. For large firms that asked for flexibility, it offered a site licence instead.

## Monthly or annual

Subscriptions can be billed monthly or annually. Monthly billing lowers the barrier for small firms and lets them stop at any time. It also multiplies the work: twelve invoices or card charges a year instead of one, twelve chances for a card to fail and a payment-service fee on each. Monthly customers also leave more easily, because each month is a fresh decision.

This is an illustration. The office offered annual billing at A$495 per seat, and monthly billing at A$45 per seat a month, **A$540** a year, both excluding GST. The roughly 9% difference covered the extra payment fees and administration and rewarded annual commitment. About four in five customers chose annual billing. Those who chose monthly were mostly sole practitioners and very small firms, for whom the monthly option was the difference between buying and not buying.

## Staff changes, transfers and true-ups

Named-user licences raise practical questions in engineering firms, where staff come and go and contractors join for a project. The office's terms answer them simply:

- a licence can be moved from one person to another at any time, for example when a designer leaves, by the firm's administrator in the licence portal;
- temporary users, such as contractors on a project, can be added for whole months at the monthly rate;
- at each annual renewal, the firm confirms its seat count, and any seats added during the year are charged pro rata.

The office deliberately did not build technical enforcement that would lock out a firm the moment it added an extra user. A firm that briefly uses one more seat than it pays for is usually a firm that is growing, and the renewal conversation, a true-up, is the right place to settle it. Chapter 6 develops the balance between enforcement and goodwill.

## How the models look in the accounts

The choice of model also changes how the business's results look, which matters if the firm reports to a bank, investors or a buyer. Broadly, revenue from a subscription is earned over the period it covers, so a year's subscription paid in advance is not all income on the day it is received. A perpetual licence fee is generally recognised when the licence is delivered, with maintenance spread over its term. The details depend on accounting standards and the firm's circumstances, and the office took its accountant's advice on how to record each kind of sale before it made the first one. The practical point for a small firm is that cash received in advance for subscriptions is partly an obligation to keep providing the service, and it should not all be treated as available to spend.

## Site licences for larger firms

A firm with 40 designers does not want to count seats. The office's site licence covers unlimited users at one firm for a fee set at the price of a number of named seats, agreed with the firm from its headcount and expected use, and reviewed each year. For a 40-designer firm, the office priced it at the equivalent of 30 named seats. That is a discount the firm valued for its simplicity, and it removed any reason for the firm to ration use.

## Trials

A trial is often the main way a product like this is sold. The office's trial is **30 days, full function, no payment details required**, for up to five seats per firm. It is long enough to cover a drawing release cycle and short enough to keep attention. Trial users get the same onboarding call as paying customers, because a trial that is installed and never used tells the firm nothing. Chapter 9 measures how many trials became sales.

## Whether to offer a free version

Some software products offer a permanently free version with limited features, hoping some users will upgrade. For a specialised engineering add-in with a small market, the office decided against it. A free version would still need installing, supporting and updating for each CAD release. Its users would be engineers at firms that might otherwise have paid. And the market was too small for the handful of upgrades that a free version typically produces to cover the cost.

The office made one exception. Students and teaching staff at universities and TAFE institutes could have free, non-commercial licences, renewed each academic year, with community support only. The cost was small, the goodwill was real, and graduates who had used the add-in at university were likely to ask for it at their first employer.

## The promises a licence makes

Every licence model makes promises, and promises to customers are hard to take back. The office wrote down what each of its licences promised:

- **Subscription:** use, updates and support for the paid term; the product will be kept compatible with supported CAD releases as published; the price for the next term will be notified at least 60 days before renewal.
- **Perpetual:** use of the purchased version indefinitely, on the CAD releases it supports; updates and support only while maintenance is paid.
- **Site licence:** as the subscription, for unlimited users at the named firm.

Each promise was written into the licence terms in Chapter 8 and reviewed by the office's lawyer.

## A failure case: updates for life

This is an illustration. When the four pilot firms in Chapter 1 paid A$250 per seat for their six-month pilot, the principal, keen to thank them, wrote in the pilot agreement that pilot firms would receive "all future updates free for life" if they bought perpetual licences at the end of the pilot. Two of the firms did, for 8 seats between them.

Two years later, the office released version 3.0, a major rewrite for a new configuration format and a new CAD interface, which took about 300 hours. The two firms reasonably expected it free, and the agreement said so. The office's lawyer advised that the promise was clear and that the office should honour it. Trying to narrow a written promise to customers after the event would also have damaged trust with the office's earliest supporters.

The cost was modest: 8 seats that would otherwise have paid maintenance. The lesson was not. A promise made casually to a few early customers can bind a firm for as long as those customers use the product. The corrections were that every promise about future updates now appears only in the standard licence terms, reviewed by a lawyer, and is limited in time. Pilot and launch offers use discounts on a fixed term rather than open-ended promises.

## How this applies to a small Australian business

Small software sellers in Australia face the same licensing choices as large ones, with less room for error. Start with the simplest model that matches how the product is used: for a frequently updated add-in, a named-user annual subscription is usually it. Work through five-year revenue and cash flow with honest renewal assumptions before choosing. Pricing the licence is the next chapter's subject, and the general principles of setting a price are in [Pricing your product or service](/reados/collections/pricing-margins-and-profitability/pricing-your-product-or-service/). The KEVOS® [Subscription Value](/tools/subscription-value/) calculator can test renewal assumptions quickly. Whatever model you choose, write it up in one page that a customer's purchasing officer can understand without a call, because unclear licensing slows every sale.

## Exercise: a lower renewal rate

The office is unsure of its 85% subscription renewal assumption. If renewal is only **75%** a year, what is the expected five-year revenue per subscription seat at A$495 a year? How does it compare with the perpetual model's A$1,626, and what does that suggest?

**Worked answer.** The five-year revenue is **495 × (1 + 0.75 + 0.5625 + 0.4219 + 0.3164) ≈ 495 × 3.0508 ≈ A$1,510**. That is below the perpetual model's A$1,626 on its 70% maintenance assumption. The comparison is sensitive to renewal rates, which the office cannot know until it has customers. It suggests that subscription revenue depends on keeping customers satisfied year after year, through reliable updates for each CAD release and responsive support. It also suggests measuring renewal from the first year and revisiting the model if retention is poor, rather than assuming either model is inherently better.
