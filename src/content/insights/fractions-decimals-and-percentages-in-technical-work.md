---
title: "Fractions, decimals and percentages in technical work: tolerances, yields, markups and GST without slips"
description: "A practical refresher on fractions, decimals and percentages for engineering, manufacturing and business work, from inch fractions and rounding to yield chains, markup versus margin and GST."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - quality
  - finance
  - manufacturing
author: "KEVOS"
featured: false
draft: false
---

Fractions, decimals and percentages are taught early in school and then rarely revisited, yet they sit underneath a large share of everyday technical and commercial decisions. A machinist reads 5/16" on an old drawing and needs its decimal equivalent. A quality engineer reports that scrap fell from 4% to 3% and must decide whether that is a 1% improvement or a 25% improvement. An estimator applies a markup and a sales manager quotes a margin, and they are not talking about the same number. An accounts clerk removes GST from a total. Small slips in these operations do not look dramatic, but they flow straight into prices, tolerances, orders and profit.

This article is a practical refresher, not a school lesson. It focuses on the places where fractions, decimals and percentages most often cause errors in engineering, manufacturing and business, explains the reasoning behind each operation and offers checks that catch mistakes before they reach a quote or a drawing. Most of these ideas take minutes to revise and save hours of rework.

The examples use simple numbers so the reasoning is clear. In real work, the same methods apply with a calculator or spreadsheet, but the habit of estimating the answer first, and checking that the result is sensible, is what prevents most errors.

## Fractions: parts of a whole

A fraction such as 3/8 means three parts of a whole divided into eight equal parts. The top number is the **numerator** and the bottom the **denominator**.

### Equivalent fractions and simplifying

Multiplying or dividing the numerator and denominator by the same number gives an equivalent fraction: 3/8 = 6/16 = 12/32. Simplifying means dividing both by their largest common factor: 12/32 simplifies to 3/8 by dividing both by 4.

### Adding and subtracting

Fractions can be added or subtracted only when they share a denominator. To add 3/8 and 5/16, express both in sixteenths: 6/16 + 5/16 = 11/16. On older imperial drawings, where dimensions are given in halves, quarters, eighths, sixteenths, thirty-seconds and sixty-fourths, converting everything to the smallest denominator makes stacks of dimensions easy to add.

### Multiplying and dividing

To multiply fractions, multiply numerators and denominators: 3/4 × 2/3 = 6/12 = 1/2. To divide, multiply by the reciprocal: 3/4 ÷ 3/8 = 3/4 × 8/3 = 2. Dividing a length of 3/4" into pieces of 3/8" gives two pieces.

### Converting to decimals

Divide the numerator by the denominator: 5/16 = 0.3125. Common inch fractions are worth recognising: 1/8 = 0.125, 1/4 = 0.25, 3/8 = 0.375, 1/2 = 0.5, 5/8 = 0.625, 3/4 = 0.75 and 7/8 = 0.875. Each sixteenth adds 0.0625, and each thirty-second adds 0.03125.

## Decimals: place value and precision

Decimals express fractions with denominators that are powers of ten. Place value matters: in 12.345, the 3 is three tenths, the 4 four hundredths and the 5 five thousandths.

### Decimal places and significant figures

**Decimal places** count digits after the decimal point. **Significant figures** count meaningful digits from the first non-zero digit. A measurement of 0.0250 m has three significant figures; 25.0 mm expresses the same value. On drawings and in calculations, the number of digits implies precision: writing 25.000 mm suggests a precision far finer than 25 mm. Keep full precision through calculations and round only the final result to a sensible number of digits.

### Rounding

The usual rule is to round up when the next digit is 5 or more. Repeated rounding at each step of a long calculation can accumulate errors, which is another reason to round only at the end. Spreadsheets often display rounded values while storing full precision, so a column of displayed values may not add to the displayed total. Setting the display to show more decimal places, or using a rounding function deliberately, avoids confusing reports.

### Multiplying and dividing by powers of ten

Moving between units often means multiplying or dividing by 10, 100 or 1,000. A misplaced decimal point is one of the most damaging errors in technical work because the result is wrong by a factor of ten or more. The [SI units and calculation checking](/insights/si-units-and-calculation-checking/) article explains unit discipline and the checks that catch these slips.

## Percentages: parts per hundred

A percentage is a fraction with a denominator of 100: 12% means 12/100, or 0.12.

### Finding a percentage of a quantity

Multiply by the decimal: 15% of 240 is 0.15 × 240 = 36.

### Expressing one quantity as a percentage of another

Divide and multiply by 100: 18 rejects out of 600 parts is 18 ÷ 600 = 0.03, or 3%.

### Percentage change

Percentage change compares the change with the starting value:

percentage change = (new − old) ÷ old × 100

If scrap falls from 4% to 3%, the change is (3 − 4) ÷ 4 × 100 = −25%. Scrap has fallen by **25%**, or by **one percentage point**. Both statements are correct, but they mean different things, and reports should say which is meant. Confusing percentage points with percentages is one of the most common errors in business reporting.

### Increases and decreases do not cancel

An increase of 10% followed by a decrease of 10% does not return to the start. Starting at 100, a 10% increase gives 110, and a 10% decrease from 110 gives 99. Successive percentage changes multiply: 1.10 × 0.90 = 0.99.

### Reverse percentages

If a value after an increase is known, divide by the multiplier to find the original. A price of $110 after a 10% increase was $110 ÷ 1.10 = $100, not $110 − 10% = $99.

## GST: a common reverse percentage

In Australia, goods and services tax is generally charged at 10% on taxable supplies. To find the GST-exclusive price from a GST-inclusive price, divide by 1.1. The GST component of a GST-inclusive amount is one eleventh of the total. A GST-inclusive price of $99 contains $9 of GST and $90 excluding GST. Subtracting 10% of $99 would give $89.10, which is wrong. Specific transactions can have different GST treatment, so accounting systems and tax advice should be followed for the details.

## Markup and margin

Two common ways of expressing profit on a sale are easily confused:

- **Markup** is profit as a percentage of **cost**.
- **Margin** is profit as a percentage of **selling price**.

A product costing $80 sold for $100 has a profit of $20. Its markup is 20 ÷ 80 = 25%, and its margin is 20 ÷ 100 = 20%. To achieve a target margin, divide the cost by (1 − margin): to earn a 20% margin on a cost of $80, the price is $80 ÷ 0.8 = $100. Adding 20% to the cost would give $96, a margin of only about 16.7%.

Discounts bite into margin faster than intuition suggests. A 10% discount on the $100 price gives $90, leaving a profit of $10, a margin of about 11.1%. The discount removed half the profit. The [discounting without destroying your margin](/insights/discounting-without-destroying-your-margin/) article explores this effect in pricing decisions.

## Yields multiply

When a process has several stages, each with its own yield, the overall yield is the product of the stage yields, not their average or sum of losses. Three stages with yields of 95%, 98% and 97% give an overall yield of 0.95 × 0.98 × 0.97 ≈ 0.903, or about 90.3%. If 1,000 good parts are needed, about 1,000 ÷ 0.903 ≈ 1,108 parts must be started. This compounding effect is why small improvements at each stage add up and why many-step processes need high yields at every step.

## Averaging percentages

Percentages calculated on different bases cannot simply be averaged. If one production line scraps 2% of 10,000 parts and another scraps 10% of 1,000 parts, the average of the two rates is 6%, but the actual combined scrap rate is (200 + 100) ÷ 11,000, or about 2.7%. The combined rate must be weighted by volume. The same trap appears when averaging margins across products, on-time delivery rates across customers or utilisation across machines. When combining percentages, go back to the underlying counts or amounts and recalculate.

## Smaller units: per mille and parts per million

For very small proportions, other units are clearer than percentages. **Per mille** (‰) means parts per thousand, and **parts per million (ppm)** is widely used for defect rates in manufacturing supply chains and for concentrations of contaminants. A defect rate of 0.05% is 500 ppm. Customer quality agreements often specify defect targets in ppm, so being able to convert quickly between percentages and ppm avoids misunderstanding: multiply a percentage by 10,000 to obtain ppm.

## Percentages in spreadsheets

Spreadsheets store percentages as decimals and display them with a percent sign, so 12% is stored as 0.12. Typing 12 into a cell formatted as a percentage may give 1,200% or 12% depending on the software and settings, and formulas that multiply by a percentage written as a whole number give results a hundred times too large. Labelling columns clearly, keeping a consistent convention and checking a few results by hand prevent these errors from spreading through a workbook.

## Percentages in tolerances and errors

Tolerances and errors are sometimes expressed as percentages: a resistor of 100 ohms ±5% may measure from 95 to 105 ohms. **Percentage error** compares a measured value with a reference: if a scale reads 10.2 kg for a 10.0 kg test weight, the error is (10.2 − 10.0) ÷ 10.0 × 100 = 2%. When combining quantities, relative errors in multiplied quantities add approximately, so a 1% error in length and a 1% error in width give roughly a 2% error in area.

## Estimating first

Before reaching for a calculator, estimate. If 15% of 240 is calculated as 360, an estimate of "a bit more than a tenth of 240, so about 36" exposes the slip immediately. Rounding numbers to one or two significant figures, doing the calculation mentally and comparing with the precise result is the single most effective check against decimal point and percentage errors.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A small fabrication business quotes a batch of brackets. Its material and labour cost is $80 per bracket, and its estimator adds a 25% markup to quote $100 plus GST. The customer asks for a 10% discount, and the sales manager agrees, believing the business will still make "15%".

The owner checks the numbers. After the discount, the price is $90 excluding GST, and the profit is $10 per bracket: a margin of about 11.1% and a markup of 12.5%, not 15%. The process also has two stages with yields of 97% and 96%, so only about 0.97 × 0.96 ≈ 93.1% of brackets started are good. To deliver 500 good brackets, the shop must start about 537, adding about 37 brackets' worth of cost that the quote did not include.

Including scrap, the effective cost per good bracket is about $80 ÷ 0.931 ≈ $85.90, leaving a profit of just over $4 per bracket at the discounted price. The owner changes the quoting template to calculate prices from target margins, include yield losses explicitly and show the effect of any discount on margin before it is offered.

## How this applies to a small Australian business

- **State whether changes are percentages or percentage points** in reports.
- **Calculate prices from target margins**, not markups, when margin is the goal.
- **Divide by 1.1 to remove GST** from GST-inclusive amounts.
- **Multiply stage yields** to find overall yield, and quote on good parts.
- **Keep full precision in calculations** and round only the final result.
- **Estimate first** and compare with the calculated answer.
- **Recalculate combined rates from the underlying counts** rather than averaging percentages.

## Common mistakes

- **Subtracting 10% to remove GST** instead of dividing by 1.1.
- **Confusing markup and margin**, leading to underpricing.
- **Adding percentage changes** that should be multiplied.
- **Averaging yields** instead of multiplying them.
- **Misplacing a decimal point** when converting units.
- **Implying false precision** with too many decimal places.
- **Averaging percentages** from groups of different sizes without weighting them.

## Frequently asked questions

**Is a fall from 4% to 3% a 1% or a 25% improvement?** It is a fall of one percentage point and a relative reduction of 25%. Both are correct; state which is meant.

**Why does a 10% discount remove so much profit?** Because the discount comes off the price, while the cost stays the same. With a 20% margin, a 10% discount removes half the profit.

**When should inch fractions be converted to decimals?** Convert when calculating, programming machines or comparing with metric dimensions, but keep the original dimension on the drawing unless the drawing is formally revised.

## Questions to ask

- Do our reports distinguish percentage changes from percentage points?
- Are our quotes built from target margins and realistic yields?
- How do we check calculations for decimal point and unit errors?
- Do our spreadsheets display rounded values that hide mismatches?
- Who checks the effect of discounts on margin before they are offered to a customer?
- Are combined rates in our reports calculated from the underlying counts?

## Bringing it together

Fractions, decimals and percentages underpin tolerances, conversions, yields, prices and reports. Converting fractions carefully, keeping precision until the end, distinguishing percentages from percentage points, reversing percentages correctly, separating markup from margin and multiplying yields avoid errors that quietly erode quality and profit. The [two breakeven numbers every owner should know](/insights/two-breakeven-numbers-every-owner-should-know/) article applies the same arithmetic to the question of how much a business must sell. Estimating before calculating, and checking that answers make sense, remains the most reliable safeguard of all.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. This article is general information and does not constitute tax or accounting advice.*
