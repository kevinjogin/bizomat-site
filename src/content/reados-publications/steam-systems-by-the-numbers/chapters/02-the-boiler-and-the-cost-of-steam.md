---
book: steam-systems-by-the-numbers
chapterSlug: the-boiler-and-the-cost-of-steam
order: 2
title: "The boiler and the cost of steam"
description: "Calculate a boiler's heat output, fuel input and efficiency from the steam table, see why feedwater temperature matters, account for blowdown and work out what a tonne of steam costs."
draft: false
---

A boiler turns fuel into steam. Its rating plate gives a steam output in kilograms an hour, but the heat it must supply for each kilogram depends on two things the plate does not show: the temperature of the water fed into it and the pressure of the steam it makes. The fuel it burns depends on its efficiency, which depends in turn on how it is run. Put together with the steam table from Chapter 1, those few numbers give the most useful figure in any steam system: what a tonne of steam costs. Every later chapter uses that figure to decide whether a trap, a length of insulation or a condensate pump is worth fixing.

This chapter calculates SV-8's boiler output and fuel input, explains where the rest of the fuel's energy goes, shows how feedwater temperature changes output and fuel use, accounts for blowdown, and works out the cost of steam per tonne and per year. The failure case is a morning when the boiler could not keep up because its condensate return had stopped.

## Heat added in the boiler

The boiler takes in feedwater and delivers saturated steam. The heat it adds to each kilogram is the steam's enthalpy minus the feedwater's. SV-8's boiler makes steam at 800 kPa absolute, with an enthalpy of **2,768 kJ/kg**. Its feedwater, a mixture of returned condensate and treated make-up water from the feed tank, enters at **80 °C**, with an enthalpy of about **4.19 × 80 ≈ 335 kJ/kg**, using water's specific heat as an approximation.

```figure
type: formula
title: SV-8 boiler's heat output and gas input at full output
formula: heat output = steam flow × (h_g − h_feed)        fuel input = heat output ÷ efficiency
caption: This is an illustration at 1,000 kg/h of steam at 800 kPa absolute, feedwater at 80 °C and an assumed boiler efficiency of 85%.
- Steam enthalpy h_g at 800 kPa | 2,768 kJ/kg
- Feedwater enthalpy at 80 °C | about 335 kJ/kg
step: heat per kilogram ≈ 2,768 − 335 ≈ 2,433 kJ/kg
step: heat output ≈ 1,000 × 2,433 ÷ 3,600 ≈ 676 kW
step: gas input ≈ 676 ÷ 0.85 ≈ 795 kW
```

At full output, SV-8's boiler puts about **676 kW** into the steam and burns gas at about **795 kW**.

## Where the rest goes

The other 119 kW or so of the gas's energy leaves elsewhere. Most goes up the flue as hot exhaust gas; some is radiated and convected from the boiler's shell; some leaves with blowdown water; and some is lost each time the burner cycles on and off, as the boiler is purged and its casing heats and cools. The **efficiency**, steam heat out divided by fuel energy in, combines all of them. SV-8's assumed 85% is an illustration. A boiler's actual efficiency is measured, at least roughly, by comparing its metered gas with its metered steam and the feedwater temperature, and flue gas analysis during a burner service shows how much is lost up the flue.

Efficiency falls at low loads, where cycling losses and the shell's fixed loss become a larger share of a smaller output. A boiler sized for a peak it rarely reaches spends much of its life at low, inefficient loads, which is one reason oversized boilers cost more to run than their nameplate efficiency suggests.

## Feedwater temperature matters

The colder the feedwater, the more heat the boiler must add per kilogram. If SV-8's feed tank were at **15 °C** instead of 80 °C, each kilogram would need about **2,768 − 63 ≈ 2,705 kJ**, about **11%** more. For the same burner input, the boiler would make only about **899 kg/h** instead of 1,000.

```figure
type: compare
title: Effect of feedwater temperature on SV-8's boiler
cols: Feedwater enthalpy | Heat per kg of steam | Steam at 676 kW of heat
caption: This is an illustration at 800 kPa absolute. Warm feedwater, mainly from returned condensate, lets the same boiler make more steam from the same gas.
- *80 °C, with condensate return | about 335 kJ/kg | about 2,433 kJ/kg | 1,000 kg/h
- 15 °C, cold make-up only | about 63 kJ/kg | about 2,705 kJ/kg | about 899 kg/h
```

That is why the feed tank is kept hot, why returned condensate is so valuable, and why so much attention goes to getting condensate back. Chapters 6 and 7 count it in detail.

## Blowdown

Water evaporating in the boiler leaves its dissolved solids behind, so they concentrate in the boiler water. Above certain levels, they cause foaming, carry-over of water into the steam and deposits on heating surfaces. The boiler is therefore **blown down**: a controlled amount of concentrated boiler water is discharged, continuously or at intervals, and replaced with feedwater. The blowdown rate is set by water treatment advice for the feedwater's quality and the boiler's limits.

Blowdown water leaves at the boiler's saturation temperature, with the enthalpy of saturated liquid at 800 kPa, **720.9 kJ/kg**, much hotter than the feedwater that replaces it. If SV-8 blows down **30 kg/h**, an illustration of about 3% of its feed, it discards about **30 × (720.9 − 335) ÷ 3,600 ≈ 3.2 kW** of heat, about **A$1,200** a year over 4,000 hours. Blowdown heat recovery, through a flash vessel and a heat exchanger that warms make-up water, can capture much of it on larger boilers. On SV-8, the business recorded the figure and kept it on the list of future projects.

## The cost of a tonne of steam

From the heat per kilogram, the efficiency and the gas price, the cost of steam follows.

- Heat per tonne: **1,000 × 2,433 kJ ≈ 2,433 MJ**.
- Gas per tonne at 85% efficiency: **2,433 ÷ 0.85 ≈ 2,862 MJ ≈ 2.86 GJ**.
- Cost per tonne at A$22 per gigajoule: **2.86 × 22 ≈ A$63**.

```figure
type: bars
title: Cost of a tonne of SV-8's steam under different conditions
unit: A$ a tonne
max: 85
caption: This is an illustration at 800 kPa absolute, excluding GST. Each change is applied on its own to the base case of 80 °C feedwater, 85% efficiency and A$22 per gigajoule.
- *Base case | 63
- Efficiency falls to 80% | 67
- Gas rises to A$28 per GJ | 80
- Feedwater at 15 °C, cold make-up only | 70
```

SV-8's average steam use is about **600 kg/h** over 4,000 hours, about **2,400 tonnes** a year, costing about **A$151,000** a year in gas. That number, and the cost per tonne behind it, is the yardstick for every saving in the rest of the book. Many sites find it useful to add water, treatment chemicals and maintenance to get a full cost per tonne, which is higher still.

## Sizing the boiler for the load

A boiler must meet the plant's peak demand, not its average. SV-8's four kettles, each rated at 100 kW, need about **4 × 100 ÷ 2,133 × 3,600 ≈ 675 kg/h** of steam when all are heating at once, before allowing for the heat lost from the main and the steam used by the cleaning hoses. The boiler's 1,000 kg/h gives margin for those, for the higher demand when a cold kettle first comes up to temperature, and for the slower recovery when feedwater is cooler than normal, as the failure case below shows.

The average demand, about 600 kg/h, is well below the peak, and for much of the day it is lower still. A boiler that is much larger than its peak spends most of its time at low fire or cycling, where its efficiency falls. Staggering the kettles' start times, so that no more than two heat at once, cuts the peak sharply and lets the boiler run steadily. SV-8's production plan staggers start-ups by fifteen minutes for that reason, a free change that improved both steam pressure and efficiency.

## Feedwater treatment and deaeration

Feedwater is more than a temperature. Make-up water from the mains contains hardness salts that form scale on heating surfaces and dissolved oxygen and carbon dioxide that corrode boilers, steam pipes and condensate lines. Make-up water is therefore softened, and the feed tank is kept hot, because hot water holds much less dissolved gas: at 80 °C or more, much of the oxygen is driven off and vented. Chemical treatment, dosed on the advice of a water treatment specialist, deals with the rest. A cold feed tank is not just an efficiency loss; it lets oxygen into the boiler and shortens its life. That is a second reason the feed tank's temperature is worth an alarm.

## Standing losses

A boiler kept hot and pressurised loses heat continuously from its shell, even when no steam is being used, and loses more through its flue as the burner fires briefly to hold pressure. SV-8's boiler was kept at pressure overnight for years, "to be ready in the morning". A test one weekend, logging gas with the plant idle and the boiler at pressure, showed a standing loss that, over the nights and weekends of a year, cost several thousand dollars. The boiler is now allowed to cool after the last shift and brought back up an hour before the first, which the kettles' schedule easily accommodates. Before making such a change, the boiler maker's guidance on heating rates and the plant's operating procedures are checked, because rapid heating from cold stresses the boiler.

## Steam against other ways of heating

The cost of a tonne of steam can be turned into a cost per kilowatt-hour of useful heat, to compare with hot water, direct gas firing or electric heating. A tonne of steam at 400 kPa delivers about **593 kWh** of latent heat when it condenses. At A$63 a tonne, that is about **A$0.106** per kWh of latent heat at the point of use, before allowing for losses in the main, traps and lost condensate, which raise it further. The comparison is only fair when each option is costed the same way, delivered to the process, with its own losses included.

## Measuring steam

The calculation rests on knowing the steam flow, which many small sites do not measure. A steam flow meter on the boiler's outlet, and a water meter on the make-up supply, turn estimates into records. Comparing metered steam with metered gas each month tracks the boiler's efficiency; comparing make-up water with steam shows how much condensate is being lost. SV-8 has both meters, and their monthly figures go into the operations report.

## The boiler log

A daily boiler log is the cheapest monitoring there is. SV-8's operator records, at the start of each shift, the steam pressure, the feed tank temperature, the gas and steam meter readings, the make-up water meter, the result of the water level and low-water alarm checks the maker and the site procedures require, and anything unusual: a burner that took longer to light, a safety valve weeping, a change in the flue's appearance. The figures take ten minutes to record. Trended weekly, they show a falling efficiency, a rising make-up rate or a cooling feed tank long before any of them stops production, and they are the first thing an inspector or insurer asks to see. A log that is filled in but never read is only half the job, so the maintenance engineer reviews it every Friday.

## A failure case: the boiler that could not keep up

This is an illustration. On a busy Monday morning, all four kettles were heating batches at once, and the steam pressure at the kettles, normally a steady 400 kPa absolute, sagged well below it. The kettles slowed, and the boiler's burner was at full fire continuously.

The boiler operator checked the feed tank's thermometer: it read about **25 °C**, not its usual 80 °C. The condensate return pump in the kitchen had tripped on Friday afternoon, and over the weekend and into Monday all the condensate had run to drain through its overflow, while the feed tank filled with cold make-up water. With feedwater at 25 °C instead of 80 °C, the boiler needed about 9% more heat for every kilogram of steam, and at full fire it could no longer supply four kettles at once.

The detection came from the low steam pressure, and the feed tank's temperature pointed straight to the cause. The correction was to reset and repair the condensate pump, and to add an alarm on the feed tank's temperature and on the condensate pump's status, so a failure is seen within minutes rather than days. The incident also showed how much the boiler's capacity depended on condensate return, which the business had never quantified.

## How this applies to a small Australian business

Work out what your steam costs. Use the steam table for the steam's enthalpy, the feedwater temperature for its starting point, an efficiency from metered gas and steam, and your gas price. Keep feedwater hot by returning condensate, and alarm the feed tank's temperature. Account for blowdown and look at recovering its heat on larger boilers. Measure steam and make-up water, and track efficiency monthly. And use the cost per tonne as the yardstick for every other steam improvement.

## Exercise: a dearer, less efficient year

Next year, gas is expected to cost **A$26 per gigajoule**, and an inspection shows the boiler's efficiency has fallen to **82%**. With feedwater still at 80 °C, what will a tonne of steam cost? What would SV-8's 2,400 tonnes a year cost?

**Worked answer.** Heat per tonne is still about **2,433 MJ**. Gas per tonne becomes **2,433 ÷ 0.82 ≈ 2,967 MJ ≈ 2.97 GJ**, costing about **2.97 × 26 ≈ A$77** a tonne. Over 2,400 tonnes, that is about **A$185,000** a year, about A$34,000 more than now. Restoring the boiler's efficiency to 85% would bring the cost per tonne back to about **2.86 × 26 ≈ A$74**, saving about A$6,500 a year at the higher gas price, which is the value of a good burner service and clean heating surfaces.
