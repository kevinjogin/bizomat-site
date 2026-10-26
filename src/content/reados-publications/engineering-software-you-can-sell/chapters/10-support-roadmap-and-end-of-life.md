---
book: engineering-software-you-can-sell
chapterSlug: support-roadmap-and-end-of-life
order: 10
title: "Support, roadmap and end of life"
description: "Measure support load and cost per seat, cut repeat questions at the source, plan releases from customers' needs, review the venture honestly and plan how the product would end."
draft: false
---

Selling software is a promise that lasts as long as the customer keeps paying. Customers will ask questions, find faults, upgrade their CAD system, change their drafting standards and ask for features. Each needs a response, and each response costs the seller time. A small firm can sustain that only if the support load is measured and kept within what the price pays for, and if the firm decides deliberately, rather than by drift, what the product will become and how it would end.

This chapter closes the drawing-checking add-in's story. It measures the support load after two years, reduces repeat questions at their source, plans the roadmap from evidence, reviews the venture against the stopping rules set in Chapter 1, answers large customers' question about what happens if the office stops, and writes an end-of-life plan before it is needed. The failure case is a week when the only two people who could answer support tickets were both unwell.

## Measure the support load

Chapter 1 set a stopping rule: support time above **2 hours** per seat per year after the first six months would mean the product cost more to support than its price allows. The office measured support from its ticket system, which records each ticket's cause and the time spent on it.

```figure
type: formula
title: Support load and cost per seat in year two
formula: hours per seat = tickets per seat × minutes per ticket ÷ 60        cost share = hours per seat × rate ÷ price
caption: This is an illustration from the office's ticket records at the end of year two, with 104 seats installed. Amounts exclude GST.
- Tickets | about 0.9 per seat a year, about 94 tickets
- Time | about 40 minutes per ticket on average, including follow-up
- Rate | A$110 an hour
step: total ≈ 94 × 40 ÷ 60 ≈ 62.4 hours, about 0.6 hours per seat
step: cost ≈ 62.4 × 110 ≈ A$6,864, about A$66 per seat
step: about 13% of the A$495 price, well inside the 2-hour stopping rule
```

At about **0.6 hours** per seat a year, support was well inside the stopping rule of 2 hours. It cost about **A$66** per seat, about 13% of the price. That figure is what the A$495 price must cover in support, alongside product upkeep, licensing, reseller margins and the return on the original investment.

## Fix the causes, not just the tickets

The ticket system's causes showed where support time went.

```figure
type: bars
title: Support tickets in year two by cause
unit: tickets
max: 40
caption: This is an illustration from the office's ticket records. About 94 tickets in total; causes are the office's own categories.
- Installation and customers' IT | 33
- Configuration of drafting standards | 28
- How to use a feature | 19
- Faults in the add-in | 14
```

Most tickets were not faults. They were questions the product or its documentation could have answered. The office's rule became: any question asked three times gets a permanent fix. That might be a change to the product so the question does not arise, a clearer message, or an article in the support knowledge base that the next customer can find. In year two:

- The two most common installation questions, about a proxy setting and a security policy, became sections of the administrator guide and a check in the installer that explains the problem when it occurs.
- Configuration questions led to a configuration checker improvement and three worked example configurations.
- Faults went into the release process from Chapter 4, each with a test that would have caught it.

## Plan the roadmap from evidence

Customers ask for features constantly, and a small firm can build only a few. The office keeps a public list of requested features, which customers can add to and vote on. It decides what goes into each quarterly release in a short planning session, using four kinds of evidence:

- **tickets**: features that would remove a common support question;
- **votes and requests** on the public list, weighted by how many firms, not how loudly;
- **renewal conversations**: reasons customers gave for reducing seats or not renewing;
- **CAD releases**: changes needed to stay compatible, which always come first.

The office's capacity for product work is about **150 hours** a year after compatibility and fixes, the figure from Chapter 3. That is enough for one or two significant features a year. Being honest with customers about that, through the public list and its status labels, earned more goodwill than vague promises would have.

## Learn from every customer who leaves

Renewal was close to the assumption, but about one seat in six was not renewed. Each lost seat is a lesson the office would otherwise never hear. When a firm reduces its seats or does not renew, the office asks, once and politely, for the reason, and records it. This is an illustration. In year two, the reasons given were:

- the firm changed CAD systems, about a third of lost seats;
- staff reductions, about a quarter;
- the firm's standards or templates had improved enough that the checks found little, about a fifth;
- price or budget, a small share;
- a fault or support experience, one firm.

Most of the reasons were outside the office's control, which was reassuring. The third reason was interesting: firms whose drafting had improved, partly because of the add-in, found less value in it. The office responded with a monthly summary report for each firm's administrator, showing the number and kind of issues found, so that a firm could see the add-in's continuing work even when its drafting was good. The single support-related loss was followed up personally by the principal, who listened, apologised and explained what had changed, and the firm returned a year later.

## Keep customers informed

Customers who do not hear from a supplier assume nothing is happening. The office keeps in touch through a few regular channels: release notes for every release, written for designers rather than developers; a short email each quarter to administrators summarising releases, planned work from the public list and any changes to supported CAD versions; and a status page showing the licensing service and any known issues. The quarterly email takes about an hour to write. Customers repeatedly mentioned it at renewal as a sign that the product was looked after.

## Review the venture honestly

At the end of year two, the office reviewed the venture against the stopping rules and the original business case. This is an illustration.

- **Seats:** about **104** installed, well above the stopping rule of 40 at 18 months and close to the 120 the market test in Chapter 1 expected by year three.
- **Renewal:** about **84%** of seats due for renewal were renewed, close to the 85% assumed in Chapter 5 and above the 70% stopping rule.
- **Support:** about 0.6 hours per seat, against the 2-hour rule.
- **Revenue:** about **A$48,880** a year, at an average realised price of about A$470 per seat after volume prices.
- **Costs:** product upkeep about A$16,500, support about A$6,864, the licensing service about A$2,400 and reseller margins on about 20 reseller seats about A$2,970, a total of about **A$28,734**.
- **Contribution:** about **A$20,146** a year towards the original investment of about A$66,000 at the internal cost rate. At that rate, about **3.3** years to repay it, longer if measured against the A$90,000 of forgone fees.

The venture was working, but slowly, as Chapter 1's market test had predicted. The office decided to continue, to increase the contribution through the configuration service and site licences rather than price rises, and to review again after year three. It also recorded the review's figures in the same form each year, so that the trend, not a single year's snapshot, would drive the next decision.

## Answer the question large customers ask

Larger customers asked a fair question: what happens to us if the office stops supporting the add-in? Their drafting process depends on it, and a small firm is a real supply risk.

The office offered three answers. First, the end-of-life commitments described below, written into the licence terms. Second, for site-licence customers who wanted more, a **source-code escrow** arrangement, in which a copy of the source code and build instructions is deposited with an independent escrow agent, to be released to the customer if the office stops supporting the product without arranging a successor. The customer pays the escrow agent's fee. Third, the plain fact that the office uses the add-in itself and has every reason to keep it working.

## Write the end-of-life plan before you need it

Every product ends. Writing the plan in advance means that, when the time comes, customers are treated well and the office's reputation survives. The plan, summarised in the licence terms, commits the office to:

```figure
type: timeline
title: The add-in's end-of-life commitments
caption: This is an illustration of the plan written into the licence terms. Dates run from the office's public announcement.
- Announcement | End of sale | no new customers; existing customers may renew and add seats
- 12 months later | End of new features | compatibility and security fixes only
- 24 months later | End of support | final release made available with an offline licence file valid indefinitely
- *At every stage | Fair dealing | prepaid periods beyond the end of support refunded pro rata; configurations and reports remain the customers'
```

Two details matter most to customers. The **final release with a non-expiring offline licence** means that customers who are happy with the last version can keep using it on the CAD releases it supports, without any server. And **pro-rata refunds** for prepaid subscription periods beyond the end of support mean no customer pays for service that will not be provided. For a firm with 4 seats that had prepaid five months beyond the end date, that would be **4 × 495 × 5 ÷ 12 = A$825**, excluding GST.

## Ending is not the only exit

If the office ever decides it no longer wants to run the product, ending it is not the only option. A CAD reseller, another add-in maker or a larger engineering software company might buy it, taking on its customers and support. The ownership register from Chapter 2, the controlled code and tests, the customer register and the record of terms each customer accepted are exactly what a buyer would ask to see. Keeping them in order is part of keeping the product's value, whether or not a sale ever happens.

A sale also has to respect the promises already made. Customers accepted the office's licence terms, including its end-of-life commitments, and a buyer would need to honour them or agree changes with customers at renewal. The office's lawyer advised that the terms should say how licences would be treated if the product were transferred to another owner, and a clause to that effect was added at the next terms review. Customers can see from it that their rights would travel with the product, which also answers part of the question large customers ask about supply risk.

## A failure case: the week nobody answered

This is an illustration. For most of the first two years, support was handled by the lead designer, with the principal as backup. In one week of winter, both were unwell for several days. The office's published commitment was a response within one business day. That week, **11** tickets waited between two and four business days for a first response, including two from a reseller's customers.

The detection came from the ticket system's response-time report at the end of the week and, less comfortably, from the reseller, who called to ask what was happening. Nothing was lost permanently, but the office had broken a published commitment, and the reseller's confidence took a knock.

The corrections were:

1. A second engineer was trained to handle first-line support, using the knowledge base and the support bundle, with about two hours a week set aside.
2. The ticket system sends an automatic acknowledgement with the expected response time, and alerts the principal if any ticket goes more than one business day without a response.
3. A short holding message was prepared for weeks when capacity is reduced, telling customers honestly when to expect a reply.

The office also wrote to the eleven customers, apologised and explained the changes. Two of them mentioned that letter at their next renewal, as the reason they trusted the office.

## How this applies to a small Australian business

An engineering firm that sells software has two businesses, and the software business needs its own measures: seats, renewals, support load, contribution and time to repay the investment. Measure them from the first sale, compare them with the rules you set before you started, and decide deliberately whether to continue, change course or stop. Plan support so that it survives illness, leave and busy project weeks. Write the end-of-life plan early, because customers trust a supplier who has thought about it, and because the time you need it is the time you will have the least capacity to write it. The companion book [CAD Automation by the Numbers](/reados/publications/cad-automation-by-the-numbers/) covers keeping an internal tool alive, which is where every product like this begins.

## Exercise: a bigger installed base

The office expects about **250** seats by year five. If tickets stay at 0.9 per seat a year and 40 minutes each, how many support hours a year does that mean, and what share of a full-time person's year of about 1,600 productive hours? If the knowledge-base work cuts tickets to **0.6** per seat, what are the new figures?

**Worked answer.** At 0.9 tickets per seat: **250 × 0.9 = 225** tickets, **225 × 40 ÷ 60 = 150** hours a year, about **150 ÷ 1,600 ≈ 9%** of a full-time year. At 0.6 tickets per seat: **150** tickets, **100** hours, about **6%**. The load is manageable either way, but it is spread across interruptions throughout the year. Reducing tickets saves 50 hours, worth about **A$5,500** at A$110 an hour. It also means fewer interruptions to engineering work, which is often the larger cost.
