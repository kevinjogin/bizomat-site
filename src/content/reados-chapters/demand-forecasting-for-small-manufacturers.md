---
title: "Demand forecasting for small manufacturers: matching supply with demand without drowning in stock"
description: "Practical forecasting and planning for small manufacturers: simple forecasting methods, measuring forecast error, safety stock, reorder points, order quantities and a monthly planning meeting."
publishDate: 2026-10-04
category: "Manufacturing"
tags:
  - manufacturing
  - operations
  - systems
author: "GoCore"
featured: false
draft: false
---

Every manufacturer faces the same fundamental challenge: matching supply with demand. Make too little, and you miss sales, disappoint customers and pay for expediting. Make too much, and cash is tied up in stock that may become obsolete, storage overflows and you discount to clear it. Bottling companies, food manufacturers, car makers and small job shops all face it.

If you cannot predict demand, you cannot know how much raw material to buy, how much to produce, how much inventory to hold, how many people to employ or how much funding you need. If you can predict it, even approximately, these decisions become far easier.

A beverage manufacturer studied in business training addressed this by implementing manufacturing-focused planning software that helped it forecast demand three, six, nine and twelve months ahead. Software helps, but the principles come first. This article explains practical forecasting methods for small manufacturers, how to measure forecast accuracy, how to set safety stock and reorder points, how to choose order quantities and how to run a monthly planning meeting that turns forecasts into decisions.

## Forecasts are always wrong, but useful

No forecast is exactly right. The goal is not perfection but a forecast that is good enough to make better decisions than guessing, combined with buffers and processes that handle the error. Three principles help:

1. **Forecasts are more accurate for groups than for individual items.** Total monthly demand for a product family is easier to predict than demand for each variant.
2. **Forecasts are more accurate for shorter horizons.** Next month is easier to predict than next year.
3. **Measure the error.** Knowing how wrong your forecasts usually are tells you how much buffer you need.

## Start with good data

Forecasting depends on clean demand history. Collect at least one to two years of:

- **Orders or shipments by product and month.** Orders reflect demand more accurately than shipments, which can be constrained by stock shortages.
- **Lost sales and backorders**, where customers wanted products you could not supply.
- **Promotions, price changes and one-off events** that distorted demand.
- **Customer information**: which customers buy what, and how regularly.

Remove or adjust one-off events, such as a large once-only order, so they do not distort future forecasts.

## Simple forecasting methods

### Naive forecast

Next month's demand equals this month's. It is simple and surprisingly hard to beat for stable products, and it provides a baseline against which to judge other methods.

### Moving average

Average the last few periods. Suppose monthly demand for a product was:

| Month | Jan | Feb | Mar | Apr | May | Jun |
|---|---|---|---|---|---|---|
| Units | 400 | 380 | 420 | 450 | 470 | 430 |

A three-month moving average forecast for July is (450 + 470 + 430) ÷ 3 = 450 units. Longer averages smooth out noise but react more slowly to genuine changes.

### Exponential smoothing

A weighted average that gives more weight to recent months. Spreadsheets and planning software calculate it easily. It responds faster than a simple moving average while still smoothing noise.

### Seasonal adjustment

Many products have seasonal patterns: irrigation equipment in summer, heating products in winter, construction products around holiday shutdowns. Calculate a **seasonal index** for each month by comparing that month's average demand with the overall monthly average over several years. If July demand has averaged 20 per cent above the yearly average, its index is 1.2. Multiply the underlying forecast by the index.

### Customer and market intelligence

Numbers alone miss important information:

- **Sales pipeline**: quotes likely to convert, and when.
- **Customer schedules and forecasts**: many industrial customers share production plans.
- **Known events**: a customer's new project, a competitor's exit, a planned price rise.
- **Market trends**: economic conditions, regulation and technology changes.

The best forecasts combine a statistical baseline with judgement from sales and customers, documented so you can learn whether the judgement improves accuracy.

### New products with no history

New products have no demand history, so use other evidence:

- **Analogous products**: how did a similar product sell in its first months?
- **Customer commitments**: pre-orders, letters of intent and pilot orders.
- **Pipeline**: quotes and enquiries specifically for the new product.
- **Market sizing**: the number of potential customers multiplied by realistic adoption and purchase rates.

Launch with conservative quantities, monitor early sales weekly and be ready to increase production quickly. Where possible, keep components flexible so they can be used in other products if demand disappoints.

### Working with suppliers on lead times

Forecasts help suppliers as well as you. Sharing a rolling forecast with key suppliers lets them plan capacity and materials, often shortening and stabilising lead times. In return, ask for commitments on lead times, and track their delivery performance. Reliable lead times reduce the safety stock you need.

## Measuring forecast accuracy

Track two measures every month:

- **Forecast error**: the gap between forecast and actual demand. A common summary is the mean absolute percentage error: the average of each period's absolute error as a percentage of actual demand.
- **Bias**: whether forecasts are consistently too high or too low. Consistent over-forecasting builds excess stock. Consistent under-forecasting causes shortages.

Bias is often more damaging than random error, and easier to fix, because it usually reflects optimism or caution rather than genuine uncertainty.

## Classify your items

Not every item deserves the same attention. Two classifications help:

- **ABC by value**: A items are the small number that account for most of your sales or inventory value. B items are moderate. C items are the many low-value items.
- **XYZ by variability**: X items have steady demand, Y items vary moderately and Z items are erratic.

Forecast and manage AX items carefully, because they are valuable and predictable. Consider making CZ items only to order, or holding modest stock, because forecasting them is unreliable and their value is low.

## Safety stock and reorder points

Because forecasts and lead times are uncertain, hold **safety stock**: a buffer that protects against higher-than-expected demand or late supply.

A common formula, assuming demand varies but lead time is steady:

**Safety stock = z × standard deviation of daily demand × √(lead time in days)**

where z reflects the service level you want. A z of about 1.65 corresponds to roughly a 95 per cent chance of not running out during a replenishment cycle.

### An illustration

A component has average demand of 20 units a day, with a standard deviation of 6 units a day. The supplier's lead time is 9 days.

- Safety stock = 1.65 × 6 × √9 = 1.65 × 6 × 3 ≈ 30 units.
- **Reorder point** = average demand during lead time + safety stock = (20 × 9) + 30 = 210 units.

When stock falls to 210 units, place an order. If lead times are also variable, as they often are with imported items, safety stock needs to be larger.

## How much to order

The **economic order quantity** balances the cost of placing orders against the cost of holding stock:

**EOQ = √(2 × annual demand × cost per order ÷ annual holding cost per unit)**

If annual demand is 5,000 units, each order costs $150 to place and receive, and holding one unit for a year costs $4, then EOQ = √(2 × 5,000 × 150 ÷ 4) ≈ 612 units.

EOQ is a guide, not a rule. Adjust for supplier minimum order quantities, price breaks, container sizes, storage space, shelf life and cash constraints.

## Make to stock or make to order?

| Approach | Suits | Trade-off |
|---|---|---|
| Make to stock | Standard products with steady demand and customers who expect immediate supply | Requires accurate forecasts and inventory investment |
| Make to order | Custom or low-volume products, or customers who accept lead times | Lower stock, but longer lead times |
| Assemble to order | Products built from standard components into many variants | Stock components, assemble to the customer's order |

Many manufacturers combine approaches: stocking fast-moving standard items and common components, and making specials to order.

## A monthly sales and operations planning meeting

Forecasts only help if they drive decisions. A monthly planning meeting, often called sales and operations planning, brings sales, production, purchasing and finance together.

**Agenda, 60 to 90 minutes:**

1. **Review last month**: forecast accuracy and bias, service levels, inventory levels.
2. **Update the demand forecast** for the next three to twelve months, by product family, with sales input on pipeline and customer plans.
3. **Review supply capacity**: machines, people, materials and supplier lead times.
4. **Balance demand and supply**: identify gaps and decide responses, such as overtime, extra shifts, subcontracting, building stock ahead of peaks or managing customer expectations.
5. **Review the financial implications**: inventory, cash and margin.
6. **Agree decisions and owners.**

This meeting aligns the business around one set of numbers, rather than sales, production and purchasing each working to their own assumptions.

## When software helps

Spreadsheets work well for small ranges. As the number of products, components and customers grows, planning software becomes valuable:

- **Material requirements planning**, usually part of an ERP system, translates forecasts and orders into material and production requirements, using bills of materials and lead times.
- **Forecasting modules** apply statistical methods automatically and track accuracy.
- **Inventory optimisation tools** calculate safety stocks and reorder points across many items.

Choose software that solves your specific problem. Systems differ in their strengths, and software designed for manufacturing usually handles bills of materials and production planning better than general business software. The article on [choosing an ERP system for a small manufacturer](/reados/collections/business-systems-security-and-it-decisions/choosing-an-erp-system-for-a-small-manufacturer/) explains how to select one.

## Better forecasts open better decisions

Once you understand future demand, you can answer bigger questions with confidence:

- How much working capital will we need, and should we raise funds or borrow?
- When should we hire, and how many people?
- When will we need more capacity, such as a new machine or shift?
- Which customers and products will drive growth?

## A worked example

A manufacturer of stainless steel fittings in Melbourne has 400 products. It regularly runs out of popular items while its warehouse fills with slow movers. Staff spend hours expediting.

The operations manager:

- extracts two years of order history and removes three large one-off project orders;
- classifies items by ABC and XYZ, finding that 60 items account for 75 per cent of sales;
- sets up exponential smoothing forecasts with seasonal indices for those 60 items in a spreadsheet;
- calculates safety stocks and reorder points for them, using measured demand variability and supplier lead times;
- moves 150 erratic, low-value items to make-to-order with quoted lead times;
- starts a monthly planning meeting with sales, production and purchasing.

Within six months, stockouts of A items fall from about 12 a month to 2, total inventory value falls by 18 per cent, and expediting time drops sharply. Forecast bias, initially 15 per cent too high because sales estimates were optimistic, falls to under 3 per cent once sales input is tracked against actual orders.

## Common mistakes

- **Forecasting from shipments** rather than orders, which hides lost demand.
- **Treating every item the same.**
- **Ignoring forecast error and bias.**
- **Letting sales forecasts go unchallenged**, often resulting in optimism.
- **Setting safety stock by gut feel.**
- **Planning in separate silos**, with sales, production and purchasing using different numbers.

## Frequently asked questions

**Do I need statistical expertise?** No. Moving averages, seasonal indices and simple safety stock formulas can be run in a spreadsheet by anyone comfortable with basic formulas. Specialist help becomes useful when ranges grow large or demand patterns are complex.

**How far ahead should I forecast?** Far enough to cover your longest lead times and capacity decisions. For many small manufacturers, a detailed three-month forecast and a broader twelve-month view by product family are enough.

**What if customers give me forecasts that turn out wrong?** Track the accuracy of each customer's forecasts over time and adjust for their typical bias. Share the results with them: better forecasts benefit both sides.

## Summary

Matching supply with demand is central to manufacturing efficiency. Start with clean demand history, use simple methods such as moving averages, exponential smoothing and seasonal indices, and combine them with sales and customer intelligence. Measure forecast error and bias every month. Classify items by value and variability, set safety stock and reorder points with simple formulas, and use economic order quantities as a guide. Choose make-to-stock or make-to-order deliberately, run a monthly planning meeting to turn forecasts into decisions and adopt planning software when spreadsheets can no longer cope.

---

*Sources: small-business training notes on ERP and business automation, including a beverage manufacturer's approach to matching supply with demand, together with general demand planning and inventory practice. Figures are illustrations.*
