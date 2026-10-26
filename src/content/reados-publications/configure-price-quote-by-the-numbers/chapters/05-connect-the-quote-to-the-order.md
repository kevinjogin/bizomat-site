---
book: configure-price-quote-by-the-numbers
chapterSlug: connect-the-quote-to-the-order
order: 5
title: "Connect the quote to the order"
description: "Carry an accepted configuration into the order, bill of materials, drawings, job card and purchasing without retyping, from one product model, and handle changes after the order."
draft: false
---

The moment a customer accepts a quote, the configuration that was a sales document becomes a manufacturing instruction. In many firms, that is also the moment it is retyped: into the order system, onto a job card, into a purchasing spreadsheet and onto a drawing. Each retyping is a chance to change a number. The configurator's value is only half realised if its precise configuration is turned back into hand-entered text at the factory door.

This chapter connects the bench fabricator's accepted quotes to everything that follows. It carries the configuration into the order, generates the bill of materials and drawings from the same product model that priced it, plans sheet purchasing for an order, issues the job card and handles changes after the order. The failure case is a long bench built with four legs instead of six, because the price model and the bill of materials had each kept their own copy of one rule.

## Measure the hand-off first

Before connecting anything, the firm measured what the hand-off cost. This is an illustration. Turning an accepted quote into an order, a job card, a purchasing list and drawing references took an office assistant about **35 minutes** per order. At about **576** orders a year that is about **336 hours** a year, about **A$25,200** at an internal cost of A$75 an hour.

More important than the time were the errors. Comparing 100 recent job cards with their accepted quotes found that about **4%** differed in some detail: a length transposed, a sink on the wrong side, an undershelf omitted. Most were caught by the workshop or at inspection. Over a year, about **23** orders would carry such an error, each costing hours of rework or an awkward conversation with the customer.

## One configuration, carried forward

The principle is that the accepted configuration, the same record that produced the quote, travels with the order and drives everything else. It has a unique identifier and records each option's value, the product-model revision and the cost-table revision.

```figure
type: steps
title: From accepted quote to the workshop, without retyping
caption: This is an illustration of the firm's connected process. Each step reads the configuration record; nobody re-enters dimensions or options.
- Accept | the customer accepts revision B of the quote; the configuration record is locked
- Order | the order is created in the business system with the configuration's identifier and price
- Bill of materials | generated from the product model: sheet parts, legs, feet, sink bowl, fixings
- *Drawings | generated or selected from the configuration, with its identifier in the title block
- Job card and purchasing | job card lists operations and times; purchasing gets sheets and bought parts
- Acknowledge | the customer receives the configuration, price and confirmed lead time
```

The order system did not need replacing. The firm's existing business system accepted orders with an item code, a description and a price. The configurator creates an item code for each new configuration, in the form of a short identifier, and passes the description, price and bill of materials through the system's import. Repeat configurations reuse their item code, so the business system's sales history shows how often each configuration sells.

## The bill of materials from the same model

The product model that priced the bench in Chapter 3 already knows every part: the top, undershelf, splashback, legs, feet and, for some benches, a sink bowl. The bill of materials is a structured list of those parts with quantities, generated from the configuration.

```figure
type: tree
title: Bill of materials for the 1,800 × 750 bench with one undershelf
caption: This is an illustration. Made parts carry the flat-pattern sizes the cutting and folding operations need; bought parts carry supplier codes. The same model generated the price in Chapter 3.
- Bench, 1,800 × 750, U1, S100 | configured assembly
  - Top, 1.2 mm 304, flat 1,960 × 910 mm | made from sheet
  - Undershelf, 0.9 mm 304 | made from sheet
  - Splashback, 100 mm high | made from sheet, welded to top
  - Legs, 40 × 40 square tube, 4 off | cut from stock length
  - Adjustable feet, 4 off | bought part
  - Fixings kit | bought part
```

The structure matters as much as the content, and it is the same for every configuration, which is what lets it be generated rather than drawn up by hand. Made parts are children of the bench, each with its own routing of operations. Bought parts carry supplier codes for purchasing. The companion book [Bills of Materials by the Numbers](/reados/publications/bills-of-materials-by-the-numbers/) covers how such structures, quantities and units work in detail.

## Drawings from the configuration

The workshop needs drawings, and there are two ways to provide them for configured products. The firm's earlier practice was a **family of standard drawings**, one per length and depth, with option details shown as separate sheets the workshop combined. That works for small ranges but not for 600 buildable configurations.

The firm moved to **generated drawings** for each configuration, using the approach set out in the companion book [CAD Automation by the Numbers](/reados/publications/cad-automation-by-the-numbers/): a master model driven by the configuration's values, with a master drawing that updates, carrying the configuration identifier and model revision in its title block. A configuration that has been made before reuses its released drawing, so drawings are generated only for new configurations, about a third of orders.

## Plan the sheet purchasing

Sheet is the largest material cost, and buying it per bench wastes money. The configurator totals the sheet area for an order and estimates the number of sheets to buy.

This is an illustration. Each 1,800 × 750 bench above uses about **2.61 m²** of sheet. An order for **10** of them needs about **26.1 m²**. The firm buys 2,400 × 1,200 mm sheets, **2.88 m²** each, and its nesting typically uses about **78%** of a sheet. The order therefore needs about **26.1 ÷ (2.88 × 0.78) ≈ 11.6** sheets, so the purchasing list asks for **12**. The real nest, done by the cutting operator's software when the job is released, confirms the number, and any spare sheet goes back into stock for the next order. The estimate's purpose is to place the order for sheet early, not to replace the nest.

## The job card

The job card lists the operations for the order, from the product model's labour table: cut, fold, weld, polish, assemble and inspect, with the standard minutes for each. It carries the configuration identifier, the drawing references and a sketch. Because the minutes come from the same labour table that priced the bench, the production manager can compare the actual time recorded on the card with the standard, which feeds the six-monthly price-model check in Chapter 3.

## Load the workshop from the orders

The standard minutes on each job card add up to a load on the workshop. Each Monday, the production manager sees the total standard hours of accepted orders due in the coming weeks, set against the workshop's available hours. This is an illustration. With two fabricators giving about 64.6 hours a week of bench work, as in Chapter 4, a week holding 80 standard hours of orders is overloaded by about 15 hours. The production manager can see that before it happens and decide what to do: overtime, a contract fabricator for simple benches, or a conversation with a customer whose order could move a week without harm.

The same figures feed the lead-time calculation in Chapter 4, so the quotes and the workshop plan always agree about how busy the factory is. Before the connected process, the estimators judged lead times from what they heard in the lunchroom and the workshop planned from a whiteboard, and the two often disagreed by weeks. A shared source does not make the factory any faster. It does make its promises consistent, and it shows early when capacity needs adding.

Actual hours recorded on the job cards close the loop. When a week's actual hours run consistently above standard, either the labour table is optimistic or something on the floor has changed, and both are worth knowing before they show up as late deliveries.

## Inspect against the configuration

Final inspection used to compare the bench with the job card, which had been typed from the quote. Now the configurator generates an inspection sheet from the configuration itself: overall length, depth and height with their tolerances, the number and position of undershelves, the splashback height, the sink position and size if any, the number of legs and the finish. The inspector ticks each item and records any measurement outside tolerance.

Because the sheet comes from the same record as the quote and the bill of materials, an inspector who finds a difference knows it is a real manufacturing error, not a transcription difference between documents. That made the failure case below visible as a question about the model, rather than being dismissed as a paperwork mix-up.

## Traceability for food-industry customers

Many of the firm's customers are food manufacturers whose own quality systems ask where the stainless steel came from. The configurator's bill of materials gives each made part a line. When the job is cut, the cutting operator records which sheet, identified by the supplier's batch or heat number on its mill certificate, each part came from. The order file then holds a complete record: the configuration, the drawing revision, the material certificates for the sheet used and the inspection sheet. A customer's auditor asking for the material certificate for a bench bought two years ago receives it in minutes. The general methods are described in [Product traceability in manufacturing](/reados/collections/manufacturing-quality/product-traceability-in-manufacturing/).

## Repeat orders

About a third of the firm's orders turned out to be repeats of configurations it had made before, often for the same customer extending a line. With every configuration stored under its identifier, a repeat order reuses the released drawing, bill of materials and inspection sheet, and only the price and lead time are recalculated from current costs and backlog. Repeat orders became the quickest jobs in the factory, because nothing had to be worked out again, and the most reliable, because every document had already been proved on a real bench.

```figure
type: compare
title: The hand-off from quote to workshop, before and after connecting it
cols: Before | After
caption: This is an illustration from the firm's measurements over two quarters. Amounts exclude GST.
- Office time per order | about 35 minutes of retyping | about 5 minutes of checking
- Orders with a transcription difference | about 4%, roughly 23 a year | none found in the first two quarters
- Drawings for repeat configurations | redrawn or adapted by hand | reused from the released drawing
- Material certificate for a past bench | searched for in paper files | linked to the order record
- *Rule consistency between price and parts | two copies that could drift | one product model, tested line by line
```

## Changes after the order

Customers sometimes change an order after accepting it: a different length, an added sink. Each change goes through the configurator as a new revision of the configuration, which re-runs the rules, recalculates the price and lead time and regenerates the bill of materials and drawing. The customer approves the change and any price difference before it reaches the workshop. If the workshop has already started, the production manager decides whether the change can be absorbed or needs a new part, and the cost of scrapped work is shown to the customer.

The change process has one firm rule: the workshop never builds from a marked-up drawing. A configuration change that has not been through the configurator does not exist.

## A failure case: four legs on a 2,700 mm bench

This is an illustration. In the first version of the connected process, the price model and the bill-of-materials generator were written by different people. The price model included the consequence rule from Chapter 2, six legs for benches over 2,400 mm. The bill-of-materials generator had been written from the old standard drawings, which showed four legs on every bench, and nobody had told its author about the rule.

The first 2,700 mm bench through the new process was priced correctly with six legs and built with four. At final inspection, the inspector noticed that the bench's top deflected visibly at mid-span when leaned on. The bench was reworked with two extra legs before dispatch.

The detection came from a careful inspector, which is the last line of defence. The investigation found two copies of the same rule, one in each program, that had drifted apart. The correction was structural: the leg rule, and every other consequence rule, now lives once in the product model, and both the price and the bill of materials are generated from it. A test was added that, for every configuration in the pairwise test set from Chapter 2, the parts in the bill of materials match the parts priced, line by line. "One model, many outputs" became the firm's design principle for the whole system.

## How this applies to a small Australian business

The connection from quote to factory is where small manufacturers lose the most to retyping, because the same few people do sales, orders and production paperwork in a hurry. Connecting them does not require a new business system. A configurator that exports a clean item, description, price and bill of materials into the system you already have, and a drawing with the same identifier, removes most of the errors. Keep every rule in one place, and test that every output agrees with every other. Start with the outputs that cause the most rework today, which for most fabricators are the job card and the purchasing list, and connect the rest once those are reliable.

## Exercise: a mixed order

An order contains **6** benches of 1,800 × 750 mm (2.61 m² of sheet each) and **4** benches of 2,700 × 750 mm (3.92 m² each). With 2.88 m² sheets and 78% nesting use, how many sheets should purchasing order? How many legs does the order need?

**Worked answer.** Sheet area is **6 × 2.61 + 4 × 3.92 = 15.66 + 15.68 = 31.34 m²**. Sheets needed: **31.34 ÷ (2.88 × 0.78) ≈ 13.95**, so order **14**, confirmed by the nest. Legs: four for each 1,800 mm bench and six for each 2,700 mm bench, over 2,400 mm: **6 × 4 + 4 × 6 = 48** legs. If the legs had been taken from the old standard drawings, the order would have been 8 legs short.
