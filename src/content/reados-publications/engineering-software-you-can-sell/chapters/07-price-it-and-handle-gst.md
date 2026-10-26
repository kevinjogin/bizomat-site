---
book: engineering-software-you-can-sell
chapterSlug: price-it-and-handle-gst
order: 7
title: "Price it and handle GST"
description: "Set a price for an engineering add-in from the value it creates and the alternatives customers have, show GST clearly, issue proper tax invoices, plan volume prices and change prices fairly."
draft: false
---

Engineers pricing their own software tend to start from cost: the hours spent building it, divided by the number of copies they hope to sell. That number is useful as a floor, but it says nothing about what customers will pay. The ceiling is set by the value the product creates for each customer and by what else the customer could do instead. The price lies somewhere between, and where exactly is a judgement informed by evidence.

This chapter prices the drawing-checking add-in. It estimates the value per seat, looks at the alternatives customers have, sets a list price and volume prices, and then deals with GST: when it applies, how to show it, what invoices must do and where to take advice for overseas sales. The failure case is a price on the website that did not say whether GST was included, and the three customers who reasonably assumed it was.

This chapter is general information, not tax or legal advice. GST rules depend on the business's circumstances and change over time. The Australian Taxation Office's guidance and the firm's accountant are the authorities.

## Start from the customer's value

This is an illustration. The design office's own figures from Chapter 1 give a starting point: about 2,400 drawings a year among about 8 designers, roughly **300** drawings per designer a year, and a saving of about **0.25** hours per drawing. At an internal cost of about A$95 an hour, the value per seat is about:

```figure
type: formula
title: Value per seat and the price as a share of it
formula: value per seat = drawings per designer × hours saved per drawing × cost per hour        price share = price ÷ value
caption: This is an illustration from the office's own figures. Pilot firms reported similar rates; customers with fewer drawings per designer gain less.
- Drawings per designer | about 300 a year
- Hours saved | about 0.25 per drawing
- Cost of design time | A$95 an hour
step: value per seat ≈ 300 × 0.25 × 95 ≈ A$7,125 a year
step: at A$495 per seat excluding GST, the price is about 7% of that value
step: a customer with 120 drawings per designer gains about A$2,850, and the price is about 17% of it
```

A price of a few hundred dollars against a value of several thousand looks like an easy sale. In practice, customers discount claimed savings heavily, because time saved in small pieces across many people rarely turns into fewer paid hours. What they notice more is errors avoided: a revision table that would have gone out wrong, a drawing sent to a fabricator without a tolerance note. The office's sales conversations led with those, using the pilot firms' examples, and used the time saving as supporting evidence.

## Look at what customers would do instead

Chapter 1 found four alternatives: a checklist, a CAD system's own checking utility where the customer's licence includes one, strict templates, and a senior checker. Each sets an expectation of price:

- A checklist costs nothing but time. The add-in must be clearly better than a good checklist to earn any price at all.
- A CAD system's checking utility is often already paid for. The add-in's price must be justified by what it does beyond that utility, mainly checking the customer's own conventions.
- Templates are an investment the customer has already made. The add-in complements them.
- A senior checker's time is expensive, and the add-in lets them spend it on judgement rather than on routine checks.

Another anchor is what customers pay for other add-ins and for their CAD licences. A checking add-in priced at a large fraction of a CAD seat's annual cost would face resistance however much value it created. Priced at a small fraction, it is easy to approve.

## Set the list price and volume prices

The office set its list price at **A$495 per seat per year, excluding GST**. At that level, a firm with a few designers can approve it within a manager's spending limit, it is a small fraction of the value for a typical designer, and it covers the costs in Chapters 3 and 10 at the volumes in Chapter 1.

Volume prices encourage firms to license everyone who checks drawings rather than a few people who check for the rest:

```figure
type: compare
title: The add-in's price list
cols: Price per seat per year, excluding GST | Including GST | Notes
caption: This is an illustration of the office's published prices. GST at 10% is added for Australian customers because the office is registered for GST.
- 1 to 4 seats | A$495 | A$544.50 | standard price
- 5 to 19 seats | A$445.50 | A$490.05 | 10% off every seat
- *20 or more seats | site licence, quoted | quoted | equivalent to a negotiated number of seats (Chapter 5)
- Monthly billing | A$45 a month | A$49.50 a month | about 9% more over a year
- Configuration service | A$150 an hour | A$165 an hour | the office's engineering rate
```

## When GST applies

GST applies to taxable sales by businesses that are registered for GST. A business must register when its GST turnover reaches **A$75,000** a year, or A$150,000 for non-profit bodies, according to the Australian Taxation Office. Turnover counts all of the business's sales, not just one product.

The design office was already registered, because its engineering fees far exceed the threshold. Its software sales are therefore subject to GST like its engineering services: for Australian customers, it adds 10% to the price excluding GST, issues tax invoices and reports the GST in its business activity statements. A new business formed only to sell the add-in would need to consider registration from the start if its expected turnover would reach the threshold, and could choose to register earlier.

For a price of A$495 excluding GST, the GST is **A$49.50** and the price including GST is **A$544.50**. Working backwards from a GST-inclusive price, the GST is one-eleventh of it: **544.50 ÷ 11 = A$49.50**.

```figure
type: stats
title: One seat, one year, with GST
caption: This is an illustration for an Australian business customer of a GST-registered seller. The customer can generally claim the GST back as a credit if it is registered and holds a valid tax invoice.
- A$495.00 | Price excluding GST | what the office keeps
- A$49.50 | GST at 10% | reported to the ATO
- *A$544.50 | Price including GST | what the customer pays
- 1/11 | GST share of an inclusive price | 544.50 ÷ 11 = 49.50
```

For a GST-registered business customer, the GST is usually a cash-flow item rather than a cost, because it can claim a credit for it. For a customer that is not registered, such as a sole practitioner below the threshold, the full A$544.50 is the cost. That difference is one reason the office's price had to be clear about GST from the first page a customer saw.

## Show prices clearly

Prices should be shown in a way no reasonable customer could misread. Where buyers may be consumers, consumer law generally expects a single total price that includes taxes and compulsory charges. Engineering customers are almost all businesses, which usually think in prices excluding GST, but the office's website is visible to anyone. The office settled on one format everywhere, on the website, in quotations and in the licence portal: **"A$495 per seat per year plus GST (A$544.50 including GST)"**.

## Invoices that customers' accounts teams accept

A business customer registered for GST needs a valid tax invoice to claim the GST it pays. The ATO sets out what a tax invoice must contain, and the requirements depend on the amount. The office's invoicing system, already used for its engineering fees, produces compliant tax invoices showing its ABN, the date, a description of the licences and term, the GST and, where needed, the customer's identity. Using the same system for software and engineering kept the accounting simple and meant that the customer's accounts team saw a familiar invoice.

## Customers outside Australia

Selling to overseas customers raises different questions. Some supplies of software to non-residents can be GST-free, depending on the circumstances, and the rules for sales of digital products across borders vary by country. Some countries expect foreign sellers to register for their own consumption taxes in certain circumstances. The office's first overseas enquiry came from New Zealand. It took its accountant's advice before quoting, priced in Australian dollars and recorded the basis for the GST treatment with the sale. The broader issues of selling overseas are covered in [Exporting for small manufacturers](/reados/collections/manufacturing-operations-and-design-for-manufacture/exporting-for-small-manufacturers/), and many of them apply to software too.

## Discounts and how to say no

Customers ask for discounts, and a small seller is tempted to agree to every one to win the sale. Each discount given becomes the price the next customer hears about. The office kept its discount policy short and published internally: the volume bands above, a 10% discount for the early-access group in Chapter 4 in return for testing, and nothing else without the principal's approval and a recorded reason.

When a customer asked for more, the office offered something other than price: an extra configuration hour, a longer trial, a training session for its designers. Those cost the office little and were often worth more to the customer than a few dollars per seat. The discipline of protecting a price under pressure is covered in [Reading discount requests and protecting price](/reados/collections/pricing-margins-and-profitability/reading-discount-requests-and-protecting-price/).

## Payment terms and collection

Customers pay in two ways. Small firms usually pay by card through the licence portal, which activates their licences immediately. Larger firms prefer an invoice with payment terms, typically 14 or 30 days, through their accounts-payable process. The office accepts both. For card payments it absorbs the payment service's fee within its price. For invoices it issues licences on order and follows up overdue invoices at 7 and 21 days past due.

Unpaid renewals are handled the same way as expired subscriptions in Chapter 6: the add-in keeps working through a grace period while the invoice is chased, then stops checking with a clear message. In two years, the office wrote off one invoice, from a firm that closed. The rest paid, most of them late, which the office treated as normal for engineering firms' accounts processes rather than as a problem to escalate.

## Treat the first price as a test

No calculation settles a price in advance. The office treated A$495 as a hypothesis and watched three signals in the first year. The first was **objections**: how many prospects raised price as their reason for not buying, as distinct from timing, IT approval or fit. The second was **the size of purchases**: whether firms licensed all their designers or only one or two. A small purchase suggested the price felt high per seat. The third was **renewals**: whether firms that paid once paid again.

This is an illustration. In the first year, price was the main objection for about one prospect in six, mostly sole practitioners. Most firms licensed nearly all their designers, and renewal was close to the 85% assumed in Chapter 5. The office kept the price and moved the monthly option from the small print to the front of the pricing page, which addressed the sole practitioners' objection without lowering the price for everyone. Lowering the list price would have reduced revenue from every firm that was already willing to pay it.

## Changing prices

Prices will need to change, and the way they change affects trust. The office's licence terms, reviewed in Chapter 8, give at least **60 days'** notice of any price change before a customer's renewal date. Existing customers keep their current price until their next renewal after the notice. The office reviews prices once a year rather than adjusting them often.

## A failure case: the price that did not mention GST

This is an illustration. At launch, the office's website said simply "A$495 per seat per year". The first invoices, issued correctly with GST added, showed A$544.50 per seat. Three of the first customers, small firms whose owners handled purchasing themselves, queried the invoices: they had read the website as the full price, and their purchase approvals were for A$495 per seat.

The office's view, after a short discussion with its lawyer, was that the customers' reading was reasonable and that an unclear price was the office's problem, not theirs. It honoured A$495 including GST for those three customers' first year, a cost of **A$49.50** per seat on **8** seats, about **A$396**. It changed the website, quotations and portal to the single clear format above the same day.

The detection came from customers querying invoices, which is the least damaging way to find such a fault, because they told the office rather than quietly leaving. The lesson recorded was that every price, everywhere, states its GST treatment, and that the price customers saw before buying is the one the office stands behind.

## How this applies to a small Australian business

Pricing is the decision engineers most often get wrong, usually by pricing too low out of modesty about their own work. Start from the customer's value and alternatives, set a price that a typical customer can approve easily, and test it with the pilot and early customers before treating it as fixed. GST is straightforward for a firm that is already registered, but clarity matters more than people expect. Overseas sales need advice before the first quote, not after the first invoice. The general principles of pricing are developed in [Pricing your product or service](/reados/collections/pricing-margins-and-profitability/pricing-your-product-or-service/).

## Exercise: a quote for a growing firm

A firm with **12** designers asks for a quote for an annual subscription, and also wants the office to write its configuration, estimated at **6 hours**. Using the price list, calculate the total excluding GST, the GST and the total including GST.

**Worked answer.** Twelve seats fall in the 5 to 19 band, at **A$445.50** per seat excluding GST: **12 × 445.50 = A$5,346.00**. Configuration is **6 × 150 = A$900.00**. The total excluding GST is **A$6,246.00**. GST at 10% is **A$624.60**, and the total including GST is **A$6,870.60**. As a check, one-eleventh of A$6,870.60 is A$624.60. The quote should show each line excluding GST, the GST and the total including GST, in the format used everywhere else.
