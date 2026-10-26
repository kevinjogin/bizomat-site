---
book: configure-price-quote-by-the-numbers
chapterSlug: write-quotes-customers-trust
order: 4
title: "Write quotes customers trust"
description: "Produce quote documents that state the configuration plainly, show prices and GST clearly, give an honest lead time from real capacity, set validity and terms, and track revisions."
draft: false
---

A quote is a promise in writing. It tells the customer what they will get, what it will cost, when it will arrive and on what terms. A fast, correctly priced configuration is worth little if the document that carries it is unclear, because unclear quotes lead to disputes after the order, when everyone has the least room to move. The best quotes are short, specific and honest about what they do not cover.

This chapter designs the bench fabricator's quote document. It covers describing the configuration in words and a sketch, laying out prices and GST, calculating a lead time from the factory's real capacity, setting validity and terms, handling revisions and acceptance, and keeping the quote consistent with consumer law. The failure case is a lead time copied from a template while the workshop's backlog was more than twice as long.

## What a quote must say

The firm wrote down what every quote must contain before designing the configurator's output.

```figure
type: checklist
title: What every bench quote contains
caption: This is an illustration of the firm's quote standard. Each item is generated from the configuration, the price model or a controlled table, never typed by hand.
- Quote number, revision and date, with the customer's reference | unique and traceable
- The configuration in plain words and a dimensioned sketch | what the customer will receive
- Each line's price excluding GST, the GST and the total including GST | consistent format on every quote
- Lead time from the live workshop backlog, and the date it was calculated | not a template value
- Validity period, payment terms, delivery and exclusions | from the controlled terms
- Statement of the consumer guarantees and the firm's own warranty | never a "no warranty" clause
- How to accept: sign and return, order number or online acceptance | one clear route
- ? Freight and installation, if the customer asked for them | separate lines or stated as excluded
- x Prices or lead times typed over the generated values | changes go back through the configurator
```

## Describe the configuration in words a customer reads

Customers do not read option codes. A quote that says "BNCH-1800-750-U1-S100-C0-SK0" helps nobody outside the firm. The configurator turns the configuration into a short description: "Stainless-steel bench, 1,800 mm long by 750 mm deep, 900 mm high, with one undershelf and a 100 mm splashback at the rear. No castors, no sink. Grade 304 stainless steel, satin finish."

Under the description, the quote includes a simple dimensioned sketch generated from the configuration: a front and side view with overall sizes, shelf positions and any sink or splashback. The sketch answers questions that words leave open, such as which side a sink is on when viewed from the front, and it catches misunderstandings before the order. Chapter 5 shows how the same configuration drives the workshop drawings.

## Lay out prices so nobody misreads them

The price section follows a fixed layout: each bench or line with its quantity, price each and total, all excluding GST; then any freight and installation lines; then the subtotal, the GST and the total including GST. The bench in Chapter 3 appears as one line at **A$1,285.00** excluding GST, GST **A$128.50**, total **A$1,413.50**. Every quote uses the same layout, so customers and the firm's own staff learn where to look.

Quantity prices, from the set-up sharing in Chapter 3, appear as the price each for the quantity ordered, with a note that the price applies to that quantity. If the customer later reduces the quantity, the price changes, and the note makes that clear in advance.

## Calculate the lead time from real capacity

The lead time on a quote is often the least reliable number on it, because it is copied from a template rather than calculated. The configurator calculates it from the workshop's live backlog.

```figure
type: formula
title: Quoted lead time from the workshop backlog
formula: weekly capacity in benches = available hours ÷ hours per bench        lead time = (backlog + this order) ÷ weekly capacity + finishing and dispatch
caption: This is an illustration. Two fabricators at 38 hours a week, 85% available for bench work after maintenance and other jobs; 225 minutes per average bench; one week added for polishing, inspection and dispatch.
- Available hours | 2 × 38 × 0.85 ≈ 64.6 hours a week
- Hours per average bench | 225 ÷ 60 = 3.75
- Backlog | 46 benches already ordered
- This order | 5 benches
step: capacity ≈ 64.6 ÷ 3.75 ≈ 17.2 benches a week
step: workshop time ≈ (46 + 5) ÷ 17.2 ≈ 3.0 weeks
step: quoted lead time ≈ 3.0 + 1 = about 4 weeks from order
```

The backlog comes from the order system each morning. The quote states the lead time as "about 4 weeks from order, calculated on" the date, because a lead time is only true on the day it is calculated. If the customer accepts the quote two weeks later, the firm confirms the lead time again with the order acknowledgement.

## Set the validity honestly

A quote's prices depend on costs that change, as Chapter 3 showed for stainless steel. The validity period is the time during which the firm promises to honour the price. Too long, and a cost rise in the meantime comes out of the margin. Too short, and customers with slow approval processes cannot accept in time.

The firm chose **30 days**, long enough for most food-factory purchasing processes, and reviewed it after a large rise in sheet prices. For quotes over A$20,000 excluding GST, it notes that the price of stainless steel is based on a stated sheet price and may be adjusted if that price rises by more than 5% before the order. That clause is written in plain terms, agreed with the firm's lawyer and applied symmetrically: if the sheet price falls by more than 5%, the customer's price falls too.

## Terms, warranty and consumer guarantees

Each quote carries the firm's terms of trade, from a controlled document: payment terms, delivery, title and risk, cancellation, and warranty. Many of the firm's customers are businesses buying benches for well under A$100,000, so under the Australian Consumer Law, the consumer guarantees generally apply to their purchases, as the ACCC's guidance for businesses explains. The terms therefore say what the firm's own warranty adds, and acknowledge the guarantees. They never contain a "no warranty" or "no refunds" clause, which could mislead customers about rights they cannot lose. The companion book on selling engineering software discusses these points in more detail for software, and they apply equally to steel benches.

## Quote in the customer's currency of thinking

Some customers think in benches, others in projects. A food factory fitting out a new hall may need 30 benches of six configurations, a few trolleys and a sink unit, and wants to see one project total with a clear breakdown. The configurator groups lines under a project heading when the customer asks, carries the quantity pricing for each configuration and shows a single subtotal, GST and total. The underlying lines are the same configured benches, so nothing is priced differently because it is presented as a project. The project view simply saves the customer from adding up six quotes, and it means one acceptance covers the lot, with a single lead time worked out from the whole quantity.

## Exclusions and assumptions

Every quote states what it assumes and what it excludes, briefly: the bench is delivered to a ground-floor dock, not installed unless an installation line is included, and connected to plumbing by the customer's plumber if it has a sink. Each exclusion is there because, at some point, a customer assumed otherwise. A short list prevents disputes far more effectively than a long one that nobody reads. When a new misunderstanding arises, the firm adds one line, and removes any line nobody has needed for two years.

## Revisions and acceptance

Customers change their minds. A customer who adds a second undershelf gets a revised quote, generated from the changed configuration, with a new revision letter and the same quote number. The old revision remains in the record, marked as superseded. The configurator never edits a sent quote in place, because a customer who accepts revision A while the firm thinks revision B is current is the start of a dispute.

Acceptance follows one clear route: the customer signs and returns the quote, sends a purchase order quoting its number and revision, or accepts online. The order acknowledgement repeats the configuration, price and confirmed lead time, so any misunderstanding surfaces immediately.

```figure
type: timeline
title: A quote's life at the bench fabricator
caption: This is an illustration of the firm's process. The day-3 follow-up came from Chapter 1's finding that a quarter of quotes received no reply until chased.
- Day 0 | Quote issued | configuration, sketch, price, lead time and validity generated
- Day 3 | Follow-up | a call if there is no reply; questions answered
- As needed | Revision | changes generate revision B, C and so on; earlier revisions superseded
- Before day 30 | Acceptance | signed quote, purchase order or online acceptance, citing the revision
- Within one day | Order acknowledgement | configuration, price and confirmed lead time repeated
```

## When customers quote themselves

Once the configurator worked for the estimators, the firm considered letting customers use it directly on its website. A customer who can configure a bench and see a price at ten at night does not wait for anyone. The risks are different from an estimator's quote, because nobody reviews it before it reaches the customer.

The firm opened self-service quoting for its standard range only, with four guardrails. Every rule from Chapter 2 applies, with the same explanations. Special requests produce an enquiry to an estimator, not a price. Quantities above ten benches produce a quote marked as provisional, confirmed by the production manager within one working day, because of the lead-time lesson below. And every self-service quote is logged and visible to the estimators, who call any customer whose configuration looks unusual, such as two undershelves on the shortest bench, to check it suits the purpose.

In the first three months, about a fifth of quotes came through self-service, mostly from repeat customers. Their win rate was higher than average, because those customers had already decided to buy and wanted the price and lead time quickly.

## Write in plain words

Quotes are read by people who are not stainless-steel fabricators: purchasing officers, project managers and accountants. The firm's quote standard bans internal codes and abbreviations from the customer-facing text, describes every option in words, and writes exclusions as short sentences rather than legal phrases. A trial with three regular customers, asking them to read a sample quote and say what they would receive, found two phrases that each had been misread: "splash 100" (read as a 100 mm high bench back, which it is, but also as a liquid-resistance rating) and "c/w castors" (unfamiliar to two of the three readers). Both were rewritten.

## Count the questions after acceptance

A useful measure of quote quality is how many questions a customer asks after accepting it. Each question, such as "which side is the sink on?", "is it delivered assembled?" or "does the price include the legs?", is a sign that the quote left something unclear. The firm's order desk records every such question for a quarter at a time. Before the new quote standard, about one accepted quote in three generated a question. After it, about one in eight did, and most of those were about delivery arrangements that genuinely depended on the customer's site.

## Keep every quote

Quotes are business records. The firm keeps every revision of every quote, with the configuration, the model and cost-table revisions and the sketch, for at least five years, consistent with the general record-keeping expectations for Australian businesses. When a customer reorders "the same bench as last time" three years later, the old quote shows exactly what that was. When a warranty question arises, it shows what was promised.

## A failure case: two weeks that were five

This is an illustration. In the first month of the configurator's pilot, the lead time on every quote came from a fixed field in the quote template: "2 weeks from order". It had been true a year earlier, when the workshop was quiet.

A customer installing a new production line accepted a quote for **12** benches, planning their installation on the strength of the two weeks. The workshop's backlog at the time was about **86** benches, about five weeks of work at the workshop's capacity of about 17 benches a week. The benches arrived in six weeks. The customer's installation contractor had to be rescheduled, at a cost the customer asked the firm to share.

The detection came from the customer, which is the worst way to learn. The firm paid part of the rescheduling cost, about **A$1,800**, as a matter of fairness, and changed two things: lead times are now calculated from the live backlog as shown above, and any quote for more than ten benches is checked by the production manager before it is sent. The lesson was that every number on a quote is a promise, and a promise copied from a template is a promise nobody has checked. The firm also reviewed every other fixed value in the old template, and found two more: a freight rate two years out of date and a warranty period that no longer matched its terms of trade.

## How this applies to a small Australian business

Small manufacturers often send quotes from a word-processing template with the numbers typed in, and the template slowly fills with outdated promises. Generate every number from a source someone owns: prices from the price model, lead times from the backlog, terms from a controlled document. Food, pharmaceutical and construction customers in Australia often plan installations around quoted lead times, so an honest lead time is worth more than an optimistic one. Have a lawyer review your terms of trade once, and keep them in one controlled file that every quote draws from.

## Exercise: a big order in a busy month

The workshop's backlog is **70** benches. A customer asks for **20** benches. With the capacity above, about 17.2 benches a week, and one week for finishing and dispatch, what lead time should the quote state? If the firm temporarily adds a third fabricator at the same availability, what would the lead time be?

**Worked answer.** With two fabricators, workshop time is **(70 + 20) ÷ 17.2 ≈ 5.2** weeks, so the quoted lead time is about **6.2**, stated as **about 6 to 7 weeks** from order. With a third fabricator, available hours become **3 × 38 × 0.85 ≈ 96.9** a week, and capacity about **96.9 ÷ 3.75 ≈ 25.8** benches a week. Workshop time is **90 ÷ 25.8 ≈ 3.5** weeks, so the lead time is about **4.5 weeks**. The quote should state what the firm has actually arranged, not what it hopes to arrange.
