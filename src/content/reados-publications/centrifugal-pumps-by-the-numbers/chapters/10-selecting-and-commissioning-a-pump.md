---
book: centrifugal-pumps-by-the-numbers
chapterSlug: selecting-and-commissioning-a-pump
order: 10
title: "Selecting and commissioning a pump"
description: "A selection procedure from duty to shortlist, specific speed, TP-3's life-cycle cost in A$ with GST, commissioning checks and the pump record, and a replacement chosen on price that cost A$3,390 more."
draft: false
---

Every chapter so far has looked at TP-3 as a pump already chosen. This chapter goes back to the beginning: how a pump should be chosen, how it should be proved when it is installed, and what should be recorded so that every later question about it starts from a known point. The choice is made once and its consequences last for fifteen years or more, mostly on the electricity bill, so it deserves the care that a much larger purchase would get.

This chapter sets out a selection procedure, introduces specific speed as a guide to the kind of pump a duty needs, works out TP-3's life-cycle cost and what dominates it, lists the commissioning checks and the pump record, and ends with a replacement pump chosen on its purchase price.

## A selection procedure

A sound selection follows the same steps whatever the pump.

```figure
type: steps
title: Selecting a centrifugal pump
caption: The procedure the plant uses, drawing on every earlier chapter. The duty is defined by the system, not by the pump.
- Define the duty at every condition | flows and heads at each sump level, state of the pipes and demand
- Draw the system curves | static head plus friction, for the whole family of conditions
- Calculate NPSH available | at the worst condition: lowest level, warmest liquid, highest flow
- Shortlist pumps whose curves cross the system near their best points | at the main duty, inside the preferred range at every condition
- Check NPSH margin, power and motor | at every crossing, on the densest liquid
- Compare on life-cycle cost | purchase, installation, energy and maintenance over the pump's life
- Specify the test and the documents | curve to an agreed grade, data sheets, manuals
```

The first step is the one most often rushed, usually because the duty arrives as a single line on a request. A duty given as "12 L/s at 25 m" hides the question of what happens at the sump's high level, with new pipe, with old pipe, with a clogged strainer, and those are exactly the conditions in which a poorly chosen pump misbehaves. Chapter 4's family of system curves is the duty, not any single point on it.

## Specific speed

A pump's **specific speed** is a number that describes the shape of impeller a duty calls for, from its speed, flow and head at the best efficiency point. In one common metric form,

N_s = n × √Q ÷ H^0.75,

with n in rpm, Q in m³/s and H in metres. For TP-3 at its best point, N_s = 2,900 × √0.013 ÷ 23.86^0.75 = **30.6**.

Low specific speeds, like TP-3's, belong to radial impellers that make high heads at modest flows; high specific speeds belong to mixed-flow and axial impellers that move large flows at low heads. The number has no direct use in the calculations of this book, but it is a quick check on a selection: a duty whose specific speed falls in an awkward range, too low for good efficiency at the speed chosen, may be better served at a higher speed or with a different type of pump. Pump makers' literature relates specific speed to the best efficiency their pumps achieve, and the conventions for its units vary between sources, so it is always quoted with its formula.

## Life-cycle cost

A pump's cost over its life is its purchase price, its installation, its energy, its maintenance and, at the end, its removal. For most pumps that run regularly, energy is by far the largest.

This is an illustration. For TP-3's duty pump, the plant estimates a purchase price of A$4,500 including GST for the pump and motor, A$3,000 for installation including pipework, electrical work and commissioning, energy of A$3,237 a year as Chapter 2 found, and maintenance of about A$400 a year, over a life of 15 years. Prices are not discounted.

```figure
type: compare
title: TP-3's duty pump over 15 years
rowhead: Item
cols: Cost, A$ incl. GST | Share
caption: This is an illustration. Energy at A$0.30 per kWh and 300 m³ a day; maintenance includes seals, wear rings and bearings; no discounting.
- Purchase, pump and motor | 4,500 | 7.3%
- Installation and commissioning | 3,000 | 4.8%
- * Energy, 15 years | 48,555 | 78.2%
- Maintenance, 15 years | 6,000 | 9.7%
- Total | 62,055 | 100%
```

Energy is more than three-quarters of the total. The purchase price, which is usually the only number a quote shows, is less than a tenth. A pump that is a few points more efficient, or better matched to its system so that it runs near its best point, saves far more over its life than any difference in price between competing pumps.

## What the simple sum leaves out

The table adds costs over fifteen years without discounting, which treats a dollar spent in year fifteen as equal to one spent today. A discounted calculation, using the plant's cost of capital, values future energy less, and narrows the gap between an efficient pump and a cheap one; a rising electricity price widens it again. For comparing two pumps for the same duty, the undiscounted sum usually points the same way as a careful financial analysis, and it is far easier to explain. Where the decision is close, or large, the finance team's method should be used.

The table also covers one pump. TP-3 is a duty and standby pair, so the plant buys and installs two, but because they alternate, their energy together is the same as one pump's, and their maintenance is shared. Doubling the purchase and installation lines and keeping the energy line gives the pair's life-cycle cost, about A$69,555, in which energy is still about 70%.

## Questions for every supplier

A quote that gives only a price and a model number cannot be compared fairly. The plant's enquiry for a pump asks each supplier for:

- **the curve** at the offered speed and impeller diameter, with the duty points marked, and a statement of whether it is a typical or a tested curve;
- **efficiency** at each duty point, stated as bare-pump or overall;
- **NPSH required** at the highest flow the system allows, to check against Chapter 5's NPSH available;
- **power** at the highest flow, and the motor offered, with its efficiency class;
- **shut-off head**, and confirmation that the curve rises steadily to it, for starting against a column and for parallel running;
- **materials** of the casing, impeller and seal, against the liquid;
- **minimum continuous flow**, for the controls;
- **spares**, their prices and lead times, and the test the supplier will carry out before delivery.

The answers make the quotes comparable on life-cycle cost, and the missing answers are often as telling as the given ones.

## Materials and the liquid

TP-3 pumps washwater: water with detergent, food residue and some grit, at up to about 40 °C after the hot wash cycle's water is cooled. Cast iron casings and bronze or stainless impellers suit it, with a mechanical seal whose faces resist abrasion. A liquid that is corrosive, abrasive, hot or hygienic would change every one of those choices, and the maker's materials guidance governs. Grit deserves particular respect: the worn standby pump of Chapter 8 was worn by grit, and a sump that is cleaned regularly and a strainer that stops the coarse material extend every pump's life more than any choice of material.

## Standardising pumps on a site

The plant's pump TP-4, on a similar system, uses the same model as TP-3. That has real value: one set of spares serves both, the fitters know the pump, and an impeller or a whole pump can be borrowed from one to the other in an emergency, as Chapter 3's spare was. The cost is that a standard model may be slightly less well matched to each duty than a pump chosen for that duty alone. Where the duties are close, as TP-3's and TP-4's are, standardising is usually right. Where they differ widely, a standard model may run far from its best point on one of them, and the energy it wastes there can exceed what the shared spares save.

## Commissioning

A pump is commissioned when it has been proved to do its job, not when it has been started. The plant's commissioning procedure for TP-3, an illustration of good practice, covers:

1. **Before starting**: alignment of pump and motor checked, pipework supported so that it does not load the pump's flanges, rotation checked by a bump test, casing and suction primed, protections set.
2. **First run**: discharge valve partly open, gauges watched as the line fills, then the valve opened fully.
3. **Readings at the operating point**: flow, suction and discharge pressures with gauge heights, sump level, motor power, bearing temperatures after an hour, and vibration measured at the bearings and compared with the maker's limits.
4. **The point on the curve**: the pump's head worked out from all four terms, plotted on its curve against the measured flow, with its efficiency from the measured power.
5. **Protections tested**: low-level switch, power monitor, flow switch and level switches each made to operate.

## The pump record

Commissioning ends with a record that every later check is compared with. It is kept in the plant's maintenance system and in a folder beside the pump, because the person who needs it is usually standing at the pump, not at a desk. For TP-3, it holds the pump's data sheet and certified curve, the system curves for the sump's high and low levels, the commissioning readings and the measured operating point, the NPSH calculation, the settings of every protection, the impeller's diameter and the motor's speed, and the spare parts list. Each year's check from Chapter 3 is added to it. With that record, the questions this book has asked, whether the pump has worn, whether the system has changed, whether a drive or a trim would pay, can each be answered in an afternoon.

## The error: a replacement chosen on price

This is an illustration. When TP-3's standby pump reached the end of its life, purchasing obtained two quotes for a replacement to the same duty. Pump A, a like-for-like replacement, was A$4,500; pump B, from another supplier, was A$3,600, A$900 cheaper, and met the duty point on its data sheet. Purchasing chose pump B.

Pump B's efficiency at TP-3's operating point was 68%, against pump A's 74%. Its energy per cubic metre was therefore 74 ÷ 68 = 1.088 times A's, and its energy cost about **A$3,523 a year** against A$3,237, A$286 more. Over 15 years, that is A$4,284 more in energy, and pump B's life-cycle cost is about **A$65,445**, against pump A's A$62,055: A$3,390 more, nearly four times the A$900 saved at purchase.

The difference was found when the plant's energy sub-meter showed higher consumption in the weeks pump B ran as duty. The plant's purchasing procedure now asks every supplier for the pump's efficiency at each duty point and compares quotes on life-cycle cost, with the energy price and running hours stated, not on purchase price alone. Pump B was kept as the standby, where it runs only half the time and its extra energy is halved, and the next replacement will be bought on the new procedure. Purchasing had followed its rules correctly; the rules had simply not asked the question that mattered most.

```figure
type: bars
title: Fifteen-year cost of two pumps for TP-3
unit: A$
max: 70000
caption: This is an illustration with prices including GST and no discounting. The cheaper pump costs more over its life because it is six points less efficient at the duty.
- * Pump A, A$4,500, 74% efficient | 62055
- Pump B, A$3,600, 68% efficient | 65445
```

## The method, summarised

Every chapter of this book has applied a few ideas to one pump, and they serve any centrifugal pump on any liquid system:

1. **Think in head**, not pressure, and measure a pump's head from all four terms.
2. **Price the power** at the supply, through both the pump's and the motor's efficiency.
3. **Read the curves** at the right speed and impeller, and run near the best efficiency point.
4. **Find the operating point** where the pump's curve meets the whole family of system curves.
5. **Check NPSH** at the worst condition, with a margin, and keep the margin through every change.
6. **Use the affinity laws** on the system, not just the pump, before believing any saving.
7. **Match the flow** by trimming or speed rather than throttling or bypass, where the duty is steady.
8. **Combine pumps** knowing that a second adds less than the first, and that unmatched pumps fight.
9. **Protect the edges**: prime, minimum flow, dry running, starting and stopping.
10. **Choose on life-cycle cost**, commission against the curve, and keep the record.

## Exercise: when is the cheaper pump worth it?

Using the same figures, how many hours a year would TP-3 have to run for pump B's lower price to be recovered over 15 years, with energy cost in proportion to running hours? TP-3 runs about 2,310 hours a year.

**Worked answer.**

- At TP-3's 2,310 hours a year, pump B costs A$286 a year more in energy, A$4,284 over 15 years.
- Pump B's A$900 saving equals 15 years of extra energy at a rate of A$900 ÷ 15 = A$60 a year.
- Energy cost scales with hours, so the break-even is 2,310 × 60 ÷ 286 = **about 485 hours a year**.

A pump that runs fewer than about 485 hours a year, about an hour and twenty minutes a day, could justify the cheaper, less efficient choice. A pump that runs for hours every day almost never can. Running hours are the first number to establish before comparing pumps, because they decide how much each point of efficiency is worth. For a fire pump that runs only on test, efficiency hardly matters; for a transfer pump like TP-3, it is most of what the plant pays for.
