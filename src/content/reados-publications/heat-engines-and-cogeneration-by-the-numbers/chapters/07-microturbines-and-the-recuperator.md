---
book: heat-engines-and-cogeneration-by-the-numbers
chapterSlug: microturbines-and-the-recuperator
order: 7
title: "Microturbines and the recuperator"
description: "How a recuperator lifts a microturbine's efficiency, how effectiveness, size and pressure ratio interact, and why a cooler exhaust can leave a steam-using site worse off."
draft: true
---

Chapter 6 found that a simple-cycle microturbine turns only about a fifth of its fuel into power and sends the rest out of the exhaust at 622 °C, hotter than the air leaving its own compressor. A recuperator puts that difference to work. It is a heat exchanger that passes heat from the turbine exhaust to the compressed air on its way to the combustor, so the burner has less heating to do and the same shaft power costs less fuel. Nearly every microturbine sold for power generation has one.

The recuperator raises electrical efficiency by taking heat out of the exhaust, and that is the same heat a cogeneration site wants to use. This chapter calculates how much efficiency a recuperator adds, what it costs in size, how it changes the best pressure ratio, and then asks the question that matters for the laundry: with steam to raise, is a recuperated machine or a simple-cycle machine the better buy?

## What a recuperator does

In the simple cycle, air leaves the compressor at state 2 and the combustor heats it all the way to the turbine inlet temperature. With a recuperator, the air first passes through the exchanger and leaves at a new state, 5, hotter than state 2. The combustor then only has to heat it from T₅ to T₃. The exhaust, cooled by the same amount of heat, leaves the recuperator at a temperature below T₄.

The recuperator's quality is its **effectiveness** ε, the share of the largest possible temperature rise that the air actually receives. The largest possible rise would take the air all the way to the exhaust temperature, so:

ε = (T₅ − T₂) ÷ (T₄ − T₂)

Because the air and the exhaust have nearly the same mass flow and specific heat on the cold-air standard, the exhaust falls by the same number of kelvin that the air rises. The compressor and turbine work are unchanged, so on the ideal cycle the net power stays the same and only the fuel falls.

## The recuperated microturbine

This is an illustration. The microturbine of Chapter 6 (1.3 kg/s, pressure ratio 4, 25 °C inlet, 950 °C turbine inlet, compressor 78% and turbine 82% isentropic efficiency) is fitted with a recuperator of 87% effectiveness. The [gas turbine (Brayton) cycle check](/tools/brayton-regenerator-check/) takes the effectiveness as an input and reports both efficiencies side by side.

```figure
type: formula
title: Adding an 87% recuperator to the microturbine
formula: T₅ = T₂ + ε (T₄ − T₂)
formula: η = w_net ÷ c_p (T₃ − T₅)
caption: This is an illustration on the cold-air standard, c_p = 1.005 kJ/kg·K. The compressor exit (210.8 °C), turbine exit (622.0 °C) and net work (143.0 kJ/kg) are those of Chapter 6; only the heat input changes.
- ε | recuperator effectiveness, 0.87
- T₅ | air temperature entering the combustor
step: Air to the combustor 210.77 + 0.87 × (621.97 − 210.77) = 568.5 °C
step: Exhaust after the recuperator 621.97 − 357.74 = 264.2 °C
step: Heat input 1.3 × 1.005 × (950 − 568.5) = 498.4 kW, against 965.8 kW without the recuperator
step: Efficiency 185.9 ÷ 498.4 = 37.29%, against 19.24%
```

The recuperator nearly doubles the efficiency, from 19.24% to 37.29%, and cuts the exhaust from 622 °C to 264.2 °C. The first law still balances: 185.9 kW of power plus 1.3 × 1.005 × (264.2 − 25) = 312.5 kW of exhaust heat equals the 498.4 kW heat input.

The cold-air standard flatters every one of these figures. A real recuperator adds pressure drop on both sides, which lowers the turbine's expansion ratio and its work. Real packages also lose power in the high-speed generator, the power electronics that convert its output to 50 Hz, the fuel gas compressor and the casing. Datasheet efficiencies for recuperated microturbines sit well below the ideal-cycle value, and a business case should use the maker's tested figure at site conditions.

## Effectiveness and size

A recuperator's effectiveness is bought with surface area. For a counterflow exchanger with equal heat capacity rates on both sides, a fair model of a recuperator, effectiveness and the number of transfer units (NTU, the exchanger's UA divided by the heat capacity rate) are related by ε = NTU ÷ (1 + NTU). The heat capacity rate here is 1.3 × 1.005 = 1.3065 kW/K. [Heat Exchangers by the Numbers](/reados/publications/heat-exchangers-by-the-numbers/rating-with-effectiveness-and-ntu/) explains the method.

```figure
type: compare
title: Recuperator effectiveness against efficiency and size
cols: Efficiency | Heat input | Exhaust out | NTU | UA needed
rowhead: Effectiveness
caption: This is an illustration for the 185.9 kW microturbine, cold-air standard, counterflow with equal capacity rates. Going from 80% to 95% effectiveness adds 6.1 points of efficiency but needs nearly five times the UA, and each step adds pressure drop that the ideal cycle ignores.
- 0% (simple) | 19.24% | 965.8 kW | 622.0 °C | 0 | 0 kW/K
- 50% | 26.66% | 697.2 kW | 416.4 °C | 1.00 | 1.31 kW/K
- 70% | 31.52% | 589.7 kW | 334.1 °C | 2.33 | 3.05 kW/K
- 80% | 34.67% | 536.0 kW | 293.0 °C | 4.00 | 5.23 kW/K
- *87% | 37.29% | 498.4 kW | 264.2 °C | 6.69 | 8.74 kW/K
- 90% | 38.54% | 482.3 kW | 251.9 °C | 9.00 | 11.76 kW/K
- 95% | 40.81% | 455.4 kW | 231.3 °C | 19.00 | 24.82 kW/K
```

The returns diminish quickly. The first 50% of effectiveness takes one transfer unit; the last 5% takes ten. Makers settle on the effectiveness where extra surface, weight, cost and pressure drop stop paying, which for compact recuperators is typically in the region the table's middle rows cover.

## Pressure ratio with a recuperator

A recuperator changes the best pressure ratio. Without one, Chapter 6 found efficiency still rising at a ratio of 8. With one, a low ratio is better, because it leaves a wide gap between the hot turbine exhaust and the cool compressed air, and the recuperator can then do most of the heating. The Brayton cycle check, with the 87% recuperator, gives:

- pressure ratio 2.5: 152.4 kW at 38.07%;
- pressure ratio 3: 168.9 kW at **38.35%**;
- pressure ratio 4: 185.9 kW at 37.29%;
- pressure ratio 5: 191.5 kW at 35.49%;
- pressure ratio 6: 191.2 kW at 33.51%.

Efficiency now peaks near a ratio of 3, while net power per kilogram of air still peaks near 5. Recuperated microturbines are designed around this compromise: a low ratio, achievable in one radial compressor stage, with a recuperator doing the work that extra compression would do in a simple cycle.

At high pressure ratios the recuperator stops helping altogether. This is an illustration. For the industrial gas turbine of Chapter 6 pushed to a ratio of 20, the compressor exit reaches 494.3 °C while the turbine exhaust is only 446 °C. The Brayton cycle check returns a warning that a regenerator would cool the compressed air and leaves it out. Large gas turbines with high ratios recover their exhaust heat in a steam cycle instead, which is the subject of Chapter 8.

## What the recuperator does to the laundry's heat

The laundry needs 550 kW of steam at 10 bar gauge, saturated at 184.1 °C, and 350 kW of hot water at 60 to 70 °C. To raise steam, an exhaust boiler must cool the gas to no lower than about 200 °C, leaving a margin above the steam temperature for heat to flow. Hot water can take the exhaust from 200 °C down to about 90 °C. The heat available in each band follows from the exhaust heat capacity rate of 1.3065 kW/K.

This is an illustration. The simple-cycle unit's exhaust at 622 °C can raise 1.3065 × (622 − 200) = 551.3 kW of steam, almost exactly the laundry's steam demand, and then heat 1.3065 × (200 − 90) = 143.7 kW of water. The recuperated unit's exhaust at 264.2 °C can raise only 1.3065 × (264.2 − 200) = 83.9 kW of steam before it, too, gives 143.7 kW to hot water. The recuperator has moved 467.4 kW from the exhaust into the combustor air, and nearly all of it was steam-raising heat.

To compare fairly, the whole site must be counted: the turbine fuel, plus boiler fuel at 82% for whatever heat the turbine does not supply, plus grid electricity for whatever power it does not make. For comparison only, all fuel figures below are on one basis, the turbine's heat input being taken as fuel energy.

```figure
type: compare
title: Site fuel for 900 kW of heat with one microturbine
cols: Turbine fuel | Useful heat from exhaust | Boiler fuel for the rest | Site fuel | Grid power
rowhead: Option
best: 1
caption: This is an illustration on the cold-air standard, one 185.9 kW unit, boiler 82%, steam taken to 200 °C exhaust and hot water to 90 °C. With the same electrical output, the simple-cycle unit needs 101 kW less fuel in total, because its heat displaces boiler fuel kilowatt for kilowatt plus the boiler's losses.
- *Simple cycle | 965.8 kW | 693.7 kW | 251.6 kW | 1,217.4 kW | 264.1 kW
- Recuperator 80% | 536.0 kW | 265.2 kW | 774.1 kW | 1,310.1 kW | 264.1 kW
- Recuperator 87% | 498.4 kW | 227.6 kW | 820.0 kW | 1,318.4 kW | 264.1 kW
- Boiler only (today) | 0 kW | 0 kW | 1,097.6 kW | 1,097.6 kW | 450.0 kW
```

When every kilowatt of exhaust heat is used, a recuperator does not save fuel at the site; it moves heat from the exhaust boiler, where it would have displaced 82%-efficient boiler fuel, to the combustor. The simple-cycle unit uses its fuel at 91.1% utilisation, (185.9 + 693.7) ÷ 965.8. A recuperated unit pays when the exhaust heat cannot be used, or can be used only at low temperature. That makes it the right machine for a site with modest hot-water demand and no steam, and the wrong one for a laundry whose largest heat demand is steam.

Two recuperated units would cover more of the electrical load, 371.8 kW, for 996.8 kW of turbine fuel, but supply only 167.8 kW of steam and 287.4 kW of hot water, leaving the boiler to burn 542.5 kW. Two simple-cycle units would raise far more steam than the ironers can use and dump the surplus. The engineer's conclusion is that among microturbines a single simple-cycle unit fits the laundry best, and Chapter 10 compares that kind of match with the gas engine.

## Pressure drop: the recuperator's hidden cost

The ideal cycle treats the recuperator as free. A real one adds flow resistance on the air side, between compressor and combustor, and on the exhaust side, between turbine and stack. Both reduce the pressure ratio the turbine actually expands through, while the compressor still does the full work of a ratio of 4.

This is an illustration. Suppose the recuperator, combustor and exhaust ducting together cost 3% of the pressure ratio, so the turbine expands through 4 × 0.97 = 3.88 instead of 4. By hand, with the same efficiencies, the turbine's temperature ratio becomes 3.88^0.2857 = 1.4731, its ideal exit 1,223.15 ÷ 1.4731 = 830.31 K and its real exit 1,223.15 − 0.82 × 392.84 = 901.02 K, or 627.9 °C. Its work falls from 329.7 to 323.7 kJ/kg, the net work from 143.0 to 137.0 kJ/kg and the net power from 185.9 to **178.1 kW**, a loss of 4.2%. The hotter exhaust gives the recuperator a little more to recover, so the air reaches the combustor at 573.7 °C and the heat input falls to 491.7 kW, but the efficiency still drops from 37.29% to **36.23%**.

A few per cent of pressure ratio costs more than a point of efficiency because of the back-work ratio met in Chapter 6: the lost turbine work comes off a net output less than half the size of the turbine's gross. This is why recuperators are designed for low pressure drop as well as high effectiveness, and why exhaust ducting, silencers and a heat-recovery boiler downstream must be included when the maker states the package's output.

## The error: counting the heat twice

This is an illustration. A sales summary for a recuperated unit listed "185.9 kW electrical at 37.3% efficiency" and "551 kW of steam from the exhaust", and calculated an overall utilisation from the two. The plant engineer noticed that the steam figure was the one for a 622 °C exhaust.

The check was an energy balance. The recuperated unit's fuel is 498.4 kW. Power plus the claimed steam is 185.9 + 551.3 = 737.2 kW, or 147.9% of the fuel. No machine delivers more energy than it is given, so one of the two figures belonged to a different machine. The Brayton cycle check, run at 87% effectiveness, put the exhaust at 264.2 °C and the steam-raising heat at 83.9 kW. The summary had paired the recuperated machine's efficiency with the simple-cycle machine's exhaust.

The correction was a rule for every proposal the laundry receives: power, recoverable heat and fuel must be stated for the same machine at the same conditions, and their sum must close against the fuel input with a plausible remainder for losses. The same rule caught a smaller slip in a second quotation, which gave exhaust temperature and flow at full load but fuel use at a lower ambient temperature.

## How this applies to a small Australian business

The choice between a recuperated and a simple-cycle machine is a choice about heat temperature. Many Australian sites with heat demand need it at low temperature: hot water for washing, space heating, swimming pools and process preheating. For them a recuperated microturbine, with its higher electrical efficiency and exhaust in the low hundreds of degrees, is a sensible fit. Sites that need steam or very hot air for drying are better matched by an unrecuperated machine, or by a recuperated one with a bypass that sends exhaust around the recuperator when steam is wanted, an option some makers offer.

Before comparing quotations, list the site's heat demands by temperature, as the laundry did: 550 kW above 184 °C, 350 kW at 60 to 70 °C. Then ask each supplier for exhaust flow and temperature at site conditions, and calculate the useful heat in each temperature band yourself. Gas, electrical and pressure equipment work on any such plant is regulated and needs qualified engineers and licensed trades.

## Exercise: a smaller recuperator

The supplier offers a cheaper recuperator of 80% effectiveness for the single microturbine. Find the air temperature entering the combustor, the exhaust temperature, the heat input and efficiency, and the site's total fuel for the laundry's 900 kW of heat. Compare with the 87% recuperator and with the simple cycle.

**Worked answer.** The air entering the combustor is 210.8 + 0.80 × (622.0 − 210.8) = **539.8 °C**, and the exhaust leaves the recuperator 329.0 K cooler, at **293.0 °C**. The heat input is 1.3 × 1.005 × (950 − 539.8) = 536.0 kW, so the efficiency is 185.9 ÷ 536.0 = **34.67%**, matching the Brayton cycle check's 539.7 °C, 293 °C and 536 kW to rounding.

The exhaust can raise 1.3065 × (293.0 − 200) = 121.5 kW of steam and 143.7 kW of hot water, 265.2 kW in all. The boiler must supply 900 − 265.2 = 634.8 kW, burning 634.8 ÷ 0.82 = 774.1 kW. The site's fuel is 536.0 + 774.1 = **1,310.1 kW**.

That is 8.3 kW less than with the 87% recuperator (1,318.4 kW) and 92.7 kW more than with no recuperator (1,217.4 kW). At the laundry the cheaper recuperator is slightly better than the dearer one, and no recuperator is better than either, because the laundry can use the hot exhaust as steam.
