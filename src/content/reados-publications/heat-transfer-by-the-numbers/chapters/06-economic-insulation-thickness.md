---
book: heat-transfer-by-the-numbers
chapterSlug: economic-insulation-thickness
order: 6
title: "Economic insulation thickness"
description: "Choose how thick to insulate by weighing installed cost against the value of heat saved: annual losses, simple payback, marginal payback, discounted totals and the effect of a higher heat price."
draft: false
---

Insulation always saves heat, but each extra millimetre saves less than the one before and costs more, because it is a larger circle. Somewhere between too little and too much lies a thickness at which the combined cost of the insulation and the heat it fails to stop is lowest: the **economic thickness**. Finding it takes the heat losses from Chapter 3, a heat price, an installed cost for each thickness and a way of comparing money spent now with money saved over years. The answer is rarely sharp. It is usually a range of thicknesses that cost about the same, and the final choice inside that range is made on other grounds.

This chapter chooses the insulation for HW-60's 60 m pipe. It converts each thickness's loss into an annual cost, compares the simple payback of insulating at all with the marginal payback of each extra step, adds the installed costs to find the lowest total over ten years with and without discounting, tests the answer against a higher heat price, and records why 40 mm was chosen. The failure case is an insulation decision on another system made on installed price alone.

## The losses and their annual cost

Chapter 3 gave the pipe's loss for each thickness, and Chapter 5 confirmed the figures with radiation calculated properly. At HW-60's 6,000 hours a year and about A$0.093 per kWh of delivered heat, each loss becomes a cost.

```figure
type: compare
title: Annual heat loss and cost of HW-60's 60 m pipe by insulation thickness
cols: Heat loss | Heat a year | Cost of heat a year
caption: This is an illustration with a painted jacket, 6,000 hours a year and A$0.093 per kWh of heat. The bare pipe is weathered stainless steel. Valve jackets are not included; they are worthwhile at any thickness, as Chapter 3 showed.
- Bare | about 8.66 kW | about 51,960 kWh | about A$4,840
- 25 mm | about 1.44 kW | about 8,640 kWh | about A$805
- *40 mm | about 1.08 kW | about 6,480 kWh | about A$604
- 50 mm | about 0.95 kW | about 5,700 kWh | about A$531
- 65 mm | about 0.82 kW | about 4,920 kWh | about A$458
- 80 mm | about 0.73 kW | about 4,380 kWh | about A$408
```

The first insulation is overwhelmingly worthwhile. Going from bare to 25 mm saves about **A$4,000 a year**. From 25 to 80 mm, the further saving is about **A$400 a year**, a tenth as much.

## Installed costs

The installed cost of insulation depends on the material, the jacket, access and labour, and rises with thickness: more material per metre, larger jackets, and more labour for larger sections. For HW-60's pipe, with mineral wool sections and a painted metal jacket, the business obtained installed prices per metre. This is an illustration: about **A$45** for 25 mm, **A$55** for 40 mm, **A$65** for 50 mm, **A$80** for 65 mm and **A$95** for 80 mm, all excluding GST. Over 60 m, that is **A$2,700, A$3,300, A$3,900, A$4,800 and A$5,700**.

## Simple and marginal payback

The **simple payback** of insulating at all is very short. Fitting 50 mm, for about A$3,900, saves about **A$4,840 − A$531 ≈ A$4,310** a year against a bare pipe, so it pays back in under **11 months**. Nearly any reasonable thickness pays back within a year on a pipe this hot, used this often.

The more useful question is the **marginal payback** of each extra step: what the next increment of thickness costs, against what it saves.

- From **25 to 40 mm**: about A$600 more, saving about A$201 a year, a payback of about **3 years**.
- From **40 to 50 mm**: about A$600 more, saving about A$73 a year, about **8 years**.
- From **50 to 65 mm**: about A$900 more, saving about A$73 a year, about **12 years**.

Each step pays back more slowly. Where the marginal payback becomes longer than the business accepts, or longer than the insulation is likely to last undisturbed, the thickness has gone past the economic range.

## Lowest total cost over ten years

A tidier way to see the trade-off is to add each thickness's installed cost to the cost of the heat it loses over a period, here **ten years**, and look for the lowest total.

```figure
type: bars
title: Ten-year total of insulation cost and lost heat, undiscounted
unit: A$
max: 11000
caption: This is an illustration: installed cost plus ten years of lost heat at today's price, excluding GST. The bottom of the curve is flat; 40 mm, 50 mm and 65 mm are within about A$170 of each other over ten years.
- 25 mm | 10750
- 40 mm | 9340
- *50 mm | 9210
- 65 mm | 9380
- 80 mm | 9780
```

Undiscounted, **50 mm** is cheapest over ten years, at about **A$9,210**, but 40 mm, at about A$9,340, and 65 mm, at about A$9,380, are close behind. The bare pipe, at over A$48,000, is far off the chart.

## Discounting future savings

Money saved in ten years' time is worth less than money spent today. Discounting at a rate the business uses for investment decisions, here **7%** a year, the ten years of heat costs are multiplied by a present value factor of about **7.02** instead of 10.

```figure
type: formula
title: Present value total for each thickness at 7% over 10 years
formula: present value total = installed cost + annual heat cost × (1 − 1.07⁻¹⁰) ÷ 0.07
caption: This is an illustration. The factor (1 − 1.07⁻¹⁰) ÷ 0.07 ≈ 7.024 turns ten equal annual costs into their value today. Discounting moves the lowest total from 50 mm to 40 mm.
- 25 mm | 2,700 + 805 × 7.024 ≈ A$8,354
- 40 mm | 3,300 + 604 × 7.024 ≈ A$7,542
- 50 mm | 3,900 + 531 × 7.024 ≈ A$7,630
step: 65 mm: 4,800 + 458 × 7.024 ≈ A$8,017
step: 80 mm: 5,700 + 408 × 7.024 ≈ A$8,566
```

With discounting, **40 mm** has the lowest present value total, about **A$7,542**, with 50 mm about A$90 more. The economic range is clearly 40 to 50 mm. Within that range, the difference is too small to decide on cost alone.

## A higher heat price

Gas prices change, and insulation lasts longer than any price forecast. If the gas price rose from A$22 to **A$30 per gigajoule**, the cost of delivered heat would rise to about **A$0.127 per kWh**. The present value totals become about A$10,410 for 25 mm, **A$9,083** for 40 mm, **A$8,987** for 50 mm, A$9,191 for 65 mm and A$9,609 for 80 mm. The economic thickness moves to **50 mm**, again by under A$100. A higher heat price, longer operating hours or a longer life always pushes the economic thickness up; a lower price, shorter hours or a higher discount rate pushes it down.

## What price of heat to use

The heat price is the most important input after the losses, and it is easy to get wrong. It should be the cost of a kilowatt-hour of heat **delivered** to the water, which means the fuel price divided by the heater's efficiency, as Chapter 1 explained. It should be the **marginal** price, what the next gigajoule actually costs on the business's tariff, not an average that includes fixed charges the business would pay anyway. And it should reflect what the business expects over the insulation's life, which is why this chapter tests a higher price as well as today's. For electrically heated systems, the same method applies with the electricity tariff, which is usually higher per kilowatt-hour of heat and makes thicker insulation economic.

## Getting installed prices that compare

Insulation quotations differ in what they include as much as in their prices. HW-60's request for quotation asked every contractor to price the same scope for each thickness: supply and fitting of preformed sections, the painted metal jacket and its sealing, insulating saddles at every support, removal and disposal of the old insulation, access equipment, and the removable valve jackets as a separate item. It also asked for the product's conductivity at a mean temperature of about 55 °C, so the losses could be checked. Without a common scope, the cheapest price per metre is often the one that leaves out the jacket sealing or the saddles, which are exactly the details that keep insulation dry and effective.

## The tank and other equipment

The same method applies to the tank, the water heater's casing and any other hot surface. Chapter 2's exercise found that doubling the tank top's insulation from 50 to 100 mm would save about **A$22** a year. If the extra insulation cost about A$150 installed, its marginal payback would be about seven years, borderline at HW-60's hours. For the tank's sides, which were being insulated anyway, the extra thickness costs mostly material, and the business chose 50 mm as a reasonable balance. Small, hot, awkward surfaces such as valves, flanges and pump casings often have the best returns of all, because they are usually bare to begin with. A walk round any plant room with a thermal camera, looking for the brightest uninsulated surfaces, is the quickest way to find them and rank them by their likely saving.

## What the totals leave out

The totals in this chapter count only installed cost and lost heat. Several other things can tip a close decision. Thicker insulation needs more space, which may not exist beside walls and other pipes. It is heavier and needs stronger supports on long runs. It lowers the jacket's temperature, which helps with burn risk and comfort. Insulation that is damaged, wet or removed for maintenance and not replaced saves nothing, so a thickness that is easy to keep intact can be worth more than a slightly better one that is not. And where a business puts a price on carbon emissions, the value of each kilowatt-hour saved rises, moving the economic thickness up. The decision record should mention whichever of these mattered, so that a later reviewer can see why the cheapest total on paper was or was not chosen.

## Life and upkeep

Ten years is a cautious life for pipe insulation with a sound jacket indoors; it often lasts much longer. But its performance depends on its condition. Jackets are dented by trolleys and ladders, sections are removed for repairs and refitted carelessly or not at all, and leaks soak the insulation, as Chapter 2 described. HW-60's maintenance plan includes the insulation in the annual thermal survey from Chapter 5, with any damage, gaps or wet sections recorded and repaired, and a rule that insulation removed for work is refitted before the job is signed off. A business that budgets for keeping insulation intact gets the savings this chapter calculates; one that does not gets less each year, and the economic comparison quietly stops being true.

## The decision

HW-60's pipe was insulated with **40 mm**. The business recorded its reasons: 40 and 50 mm were within about A$100 of each other on every basis tested; 40 mm sections fitted between the pipe and the wall where the run passes close to the plant room's wall; and the money saved was put into removable valve jackets, which Chapter 3 showed were worth far more than the step from 40 to 50 mm. The tank, which is easier to insulate thickly and has no space limits, was given 50 mm. The decision, its numbers and the quotations were filed together.

The BIZOMAT [pipe insulation design](/tools/pipe-insulation-design/) calculator runs the same comparison for other pipe sizes, temperatures and prices.

## A failure case: chosen on price per metre

This is an illustration. A few years earlier, the same business insulated a steam condensate return line on another system by asking for the cheapest insulation that met a minimum thickness, and accepted 25 mm because it was the lowest price per metre. The line ran hot for most of the year.

When HW-60's insulation was being chosen, the engineer reran the condensate line's numbers with the method in this chapter. At its operating temperature and hours, the condensate line's economic thickness was well above 25 mm, and the extra heat lost each year through the thinner insulation was about equal to the whole saving in installed cost, every year. The cheapest insulation had become the most expensive choice within its first year.

The detection came from applying the life-cycle comparison to a past decision. The correction was to add insulation to the condensate line at its next shutdown, and to change the business's insulation specification so that thickness is chosen on total cost over the insulation's life, not on installed price per metre.

## How this applies to a small Australian business

Insulate hot pipes and vessels that run for long hours: the first insulation pays back in months. Then choose the thickness by total cost. Convert each thickness's heat loss into an annual cost with your own heat price and hours, add installed costs, and compare totals over a sensible life, discounted at the rate you use for other investments. Expect a flat bottom to the curve, and use space, practicality and other priorities, such as valve jackets, to choose inside it. Re-run the numbers if heat prices change significantly, and never choose insulation on price per metre alone.

## Exercise: longer hours

The factory adds a third shift, and HW-60 runs **8,000 hours** a year instead of 6,000, at the original heat price. What are the annual heat costs for 40 mm and 50 mm? What is the marginal payback of going from 40 to 50 mm now? Does the choice change?

**Worked answer.** The annual heat costs scale with hours. For 40 mm, about **1.08 × 8,000 × 0.0932 ≈ A$805**; for 50 mm, about **0.95 × 8,000 × 0.0932 ≈ A$708**. The step from 40 to 50 mm saves about **A$97** a year for an extra **A$600**, a marginal payback of about **6.2 years**, shorter than the 8 years at 6,000 hours. With discounting at 7% over ten years, 50 mm now has the lower present value, about **3,900 + 708 × 7.024 ≈ A$8,875** against **3,300 + 805 × 7.024 ≈ A$8,956** for 40 mm. The economic thickness moves to 50 mm, though by under A$100, so where space allows, the next insulation work on the pipe should use 50 mm.
