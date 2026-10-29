---
book: heat-engines-and-cogeneration-by-the-numbers
chapterSlug: cogeneration-and-the-business-case
order: 10
title: "Cogeneration: utilisation, primary energy saving and the business case"
description: "Judge a cogeneration plant by utilisation, power-to-heat ratio and primary energy saving, size it to the heat demand, and build and stress-test the A$ business case for one site."
draft: true
---

Cogeneration, or combined heat and power (CHP), makes electricity on site and uses the heat that a power station would throw away. The previous chapters supplied its parts: an engine and its energy balance, the alternatives of gas turbines and steam turbines, and the streams of heat that can be recovered. This chapter puts them together for the laundry and asks the two questions an owner will ask. Does the plant save energy compared with buying electricity and burning gas in a boiler? And does it save money?

The answers depend less on the engine than on the site. A CHP plant saves energy only through the heat it delivers to a real demand, and saves money only through the price gap between electricity and gas, over the hours it actually runs. Both are properties of the laundry, not of the machine.

## The measures of a CHP plant

Five figures describe a CHP plant's energy performance. All must be on one heating-value basis; this chapter uses the gross (higher) heating value, on which Australian gas is bought.

- **Electrical efficiency:** net electrical output ÷ fuel input.
- **Heat efficiency:** useful heat delivered ÷ fuel input. Useful means used, displacing boiler fuel; heat dumped through a radiator does not count.
- **Utilisation factor:** the sum of the two. It adds kilowatts of electricity and heat as if they were equal, which Chapter 1 showed they are not.
- **Power-to-heat ratio:** net electrical output ÷ useful heat.
- **Primary energy saving (PES):** the fuel saved compared with producing the same electricity and heat separately, at stated reference efficiencies, as a share of the separate-production fuel.

```figure
type: formula
title: Primary energy saving
formula: F_sep = W ÷ η_E,ref + Q ÷ η_H,ref
formula: PES = (F_sep − F_CHP) ÷ F_sep
caption: The European Union's energy efficiency legislation (Directive 2012/27/EU, Annex II) defines a saving of this form with harmonised reference values. Here the references are the analyst's stated choices, not statistics.
- W, Q | net electricity and useful heat from the CHP plant
- η_E,ref | efficiency of the electricity the CHP displaces
- η_H,ref | efficiency of the boiler heat the CHP displaces
- F_CHP | fuel burnt by the CHP plant
```

The [cogeneration (CHP) utilisation and primary energy saving check](/tools/cogeneration-saving-check/) calculates all five from the fuel input, net electrical output and useful heat, with the two reference efficiencies and a saving you require, and gives the yearly fuel saved and used for the running hours you enter. It assumes steady operation at one load point and that every figure uses the same heating value.

## The laundry's CHP plant

This is an illustration. From Chapters 5 and 9, the gas engine burns 1,000 kW of fuel on the lower heating value, which is 1,000 ÷ 0.901 = 1,110 kW on the gross heating value. It makes 400 kW, of which 10 kW runs its own pumps and fans, leaving 390 kW net. It delivers 230 kW of jacket heat to hot water and 184.9 kW of exhaust heat to steam, rounded to 415 kW of useful heat. The engineer takes the laundry's own boiler, 82%, as the heat reference, and 40% as the reference for the electricity the engine displaces, a figure chosen to represent efficient gas-fired generation and stated as an assumption.

The check returns an electrical efficiency of **35.14%**, a heat efficiency of **37.39%**, a utilisation of **72.52%**, a power-to-heat ratio of 0.94, and a separate-production fuel of 390 ÷ 0.40 + 415 ÷ 0.82 = 1,481.1 kW against the CHP's 1,110 kW. The primary energy saving is (1,481.1 − 1,110) ÷ 1,481.1 = **25.06%**. Over 4,800 hours the plant burns 5,328 MWh of gas and saves 1,781 MWh compared with separate production.

```figure
type: stack
title: The laundry's CHP fuel, gross heating value
unit: kW
caption: This is an illustration. The remaining 295 kW includes the exhaust below 200 °C, the latent heat of the water vapour (about 110 kW, the gap between gross and net heating values), the engine's other losses and alternator losses.
- Net electricity | 390
- Engine auxiliaries | 10
- Useful heat, jacket and exhaust | 415
- Unused heat and losses | 295
```

## The reference changes the answer

PES is only as meaningful as its references. The same plant gives very different savings against different assumptions about the electricity it displaces. With the boiler reference held at 82%, the check gives 34.24% against a 33% electricity reference, 25.06% against 40% and 13.69% against 50%. A cleaner, more efficient grid makes on-site gas generation look worse, and a grid with more renewable generation raises a separate question, about emissions, that PES on fuel does not answer.

A business should therefore state its references, show the result at more than one, and use PES to compare options on the same site, not to make a claim about national energy savings.

## Size to the heat

CHP saves fuel through its heat. The cogeneration check makes this plain when the useful heat is varied, everything else held at the base case.

```figure
type: bars
title: Primary energy saving against useful heat delivered
unit: %
max: 30
caption: This is an illustration: 390 kW net from 1,110 kW of gas, references 40% and 82%. Without any heat use the plant burns 13.85% more fuel than separate production; every kilowatt of heat that reaches a real demand moves the saving up.
- No heat used | -13.85
- Jacket water only, 230 kW | 11.59
- Reduced demand, 300 kW | 17.22
- * Base case, 415 kW | 25.06
- With economiser, 470 kW | 28.30
```

A CHP plant should therefore be sized to the site's heat demand, a rule known as heat-led sizing, and run when the heat can be used. The laundry's figures suit this well. While the plant runs, it needs 900 kW of heat and at least 400 kW of electricity. The engine's 390 kW net never exceeds the minimum electrical demand, so nothing is exported, and its 415 kW of useful heat is less than half the heat demand, so all of it can be used when the plant is busy, given the hot-water store and controls of Chapter 9. A larger engine would make more electricity but push more heat through its dump radiator in quiet periods.

The same logic sets the running hours. Outside the laundry's 4,800 operating hours, there is no heat demand. Running the engine at night to sell electricity would deliver power at 35.14% gross efficiency with no heat credit, the "no heat used" row of the chart, which is worse than the reference generation it would displace.

## The business case

This is an illustration, with all prices excluding GST. A GST-registered business claims GST credits on its gas, electricity, equipment and maintenance through its business activity statements, so the decision is made on GST-exclusive figures; the ATO's guidance on GST credits explains the rules. The prices are invented for the case: gas A$16.00/GJ on the gross heating value, avoided grid electricity A$0.20/kWh, maintenance A$0.025 per kWh generated, installed cost A$1.10 million.

```figure
type: compare
title: The laundry's CHP business case, per year
cols: Amount | Basis
rowhead: Item
caption: This is an illustration, excluding GST, for 4,800 running hours. The simple payback is 1,100,000 ÷ 160,633 = 6.85 years before finance, tax and any change in prices.
- Electricity not bought | A$374,400 | 390 kW × 4,800 h × A$0.20/kWh
- Boiler gas not burnt | A$139,926 | 415 ÷ 0.82 = 506.1 kW, 8,745.4 GJ × A$16.00
- CHP gas burnt | −A$306,893 | 1,110 kW, 19,180.8 GJ × A$16.00
- Engine maintenance | −A$46,800 | 1,872,000 kWh × A$0.025
- * Net saving | A$160,633 | simple payback 6.85 years
```

A compact way to see the same result is the cost of each kilowatt-hour the engine makes. It burns 1,110 ÷ 390 = 2.846 kWh of gas per kilowatt-hour of net electricity; at A$16.00/GJ, which is A$0.0576 per kWh of gas, that costs A$0.1639. The heat it delivers saves 415 ÷ 0.82 ÷ 390 = 1.298 kWh of boiler gas per kilowatt-hour, worth A$0.0747. Adding maintenance, each kilowatt-hour costs 0.1639 − 0.0747 + 0.025 = **A$0.1142**, against A$0.20 from the grid. The margin of A$0.0858 on 1,872,000 kWh is the A$160,633 net saving. The case breaks even if avoided electricity falls to A$0.114/kWh, or if gas rises to A$31.39/GJ with electricity unchanged.

## Stress-testing the case

```figure
type: compare
title: The net saving and payback under changed assumptions
cols: Net saving | Simple payback
rowhead: Change from the base case
caption: This is an illustration, excluding GST, one change at a time, capital A$1.10 million throughout. The economiser row excludes the economiser's own cost. The avoided electricity price matters most.
- * Base case | A$160,633 | 6.85 years
- Useful heat 230 kW, no exhaust steam | A$98,256 | 11.20 years
- Useful heat 470 kW, with economiser | A$179,177 | 6.14 years
- Gas A$12.00/GJ | A$202,375 | 5.44 years
- Gas A$20.00/GJ | A$118,891 | 9.25 years
- Electricity A$0.15/kWh | A$67,033 | 16.41 years
- Electricity A$0.25/kWh | A$254,233 | 4.33 years
- 4,000 running hours | A$133,861 | 8.22 years
```

A gas price rise hurts less than its size suggests, because the heat credit rises with it. The electricity price is the decisive variable, and it must be the price the laundry would actually avoid. Most business tariffs combine energy charges, network charges that may depend on peak demand, and fixed daily charges. The engine avoids the energy charges and some network charges, but an engine that trips during the month's peak can leave the demand charge unchanged. The avoided price should be worked out from the tariff, item by item, with the retailer and network tariff documents in hand.

## Availability: the hours that count

The base case assumes the engine runs every one of the laundry's 4,800 operating hours. Real engines stop for servicing, for faults and for the occasional day when the laundry runs short. Every item in the business case scales with running hours, so lost hours come straight off the saving.

This is an illustration. If the engine is available for 95% of the operating hours, it runs 4,560 hours and the net saving falls in proportion, to about A$152,600 a year, lengthening the payback from 6.85 to 7.21 years. Hours lost at the wrong time can cost more than this simple scaling suggests. On a tariff with a monthly demand charge, one unplanned stop during the month's busiest afternoon can set the demand charge as if the engine had never been installed.

Three practical measures protect the hours. Plan routine servicing for days when the laundry is quiet or closed. Ask suppliers for an availability figure in the maintenance contract, defined in a way that can be measured from the engine's own run-hour and fault logs. And keep the boiler sized to carry the full heat load alone, so that an engine stop costs money but never stops the laundry.

## Gas use and emissions

CHP shifts energy use from the grid to the site's gas meter. With the engine running, the laundry burns 1,555.1 kW of gas, against 1,097.6 kW today, a rise of 41.7%, while buying 390 kW less electricity. Over 4,800 hours the site's gas use rises from 5,268 MWh to 7,465 MWh on the gross heating value, and its grid purchases fall by 1,872 MWh.

Whether that lowers or raises the laundry's total greenhouse gas emissions depends on the emissions intensity of the grid electricity it displaces, which varies between states and falls as more renewable generation is connected. The Australian Government publishes emission factors for fuels and for each state's grid electricity each year in its National Greenhouse Accounts Factors, and those, not a rule of thumb, should be used for the comparison, at the factors expected over the engine's life rather than this year's. A site with a target to reduce its own direct emissions should also note that CHP raises them, even where it lowers the total. These questions sit beside the primary energy saving, not inside it, and an owner may weigh them differently from the financial case.

## The error: the average price on the bill

This is an illustration. The laundry's first business case valued every kilowatt-hour from the engine at A$0.26, the result of dividing a year's electricity bills by the kilowatt-hours bought. It showed a net saving of A$272,953 and a payback of 4.03 years, and the case went to the owner on those figures.

The finance manager questioned it. The A$0.26 average included fixed daily charges and metering charges that the laundry would still pay with an engine running, and demand charges that the engine would reduce only if it ran reliably through every monthly peak. Working through the tariff item by item, the engineer and the retailer's account manager found that the marginal energy and network charges the engine would avoid came to A$0.20/kWh. The net saving fell to A$160,633 and the payback rose to 6.85 years.

The correction was a rule written into the laundry's capital-request template: every energy saving is valued at the marginal price of what it avoids, from the tariff, with any demand-charge saving shown separately and tested against the plant's expected availability.

## Approvals and duties

CHP plant touches several regulated areas, and the list belongs in the project plan from the start.

```figure
type: checklist
title: Approvals and duties for a CHP project, in general terms
caption: Requirements differ between states and territories and between network areas; each item needs the relevant regulator's or provider's current requirements and qualified people.
- Gas installation | licensed gas fitting under AS/NZS 5601.1 and acceptance of the gas plant by the state or territory gas technical regulator
- Electrical installation | licensed electrical work under AS/NZS 3000, and protection and synchronising for a generator that runs in parallel with the grid
- Grid connection | the distribution network service provider's application, technical requirements and connection agreement for embedded generation
- Pressure equipment | the exhaust steam generator's design, registration where required, and in-service inspection
- Environment and planning | local council planning approval, and the state environment protection authority's requirements for air emissions and noise
- Plant safety | duties to manage plant risks under work health and safety law and Safe Work Australia's model code of practice for plant, including noise and carbon monoxide
- ? Gas supply capacity | ask the gas distributor whether the meter and supply can carry the engine and boiler together
```

The gas supply question is easy to miss. With the engine running, the laundry burns 1,110 kW in the engine and 365 ÷ 0.82 = 445.1 kW in the boiler, a total of 1,555.1 kW, against 1,097.6 kW today. The gas meter, regulator and supply pipe must carry the larger total.

## How this applies to a small Australian business

CHP suits Australian sites with a large, steady heat demand that coincides with their electricity demand for many hours a year: laundries, hospitals, aquatic centres, food and beverage plants, hotels. The checks in this book give a sequence for screening one. List the heat demands by temperature and hour. Choose a machine whose heat fits under the demand. Confirm its claims against the first and second laws. Calculate the primary energy saving at stated references. Then value the case at marginal prices, excluding GST, and stress-test it, above all against the avoided electricity price.

The final decision also depends on things this book does not cover: finance and tax treatment, maintenance contracts and availability guarantees, emissions reporting, and the site's plans for electrification. Those belong to the business's advisers, and the design and installation to qualified engineers and licensed trades. This book is educational and is not a design or advice for any particular site.

## Exercise: a smaller heat demand

The laundry is considering a new tunnel washer that recycles more of its rinse water, which would cut the jacket heat it can use. Suppose the useful heat falls from 415 kW to 300 kW, everything else unchanged. Find the heat efficiency, utilisation, power-to-heat ratio and primary energy saving, then the net saving and simple payback.

**Worked answer.** The heat efficiency is 300 ÷ 1,110 = **27.03%** and the utilisation 35.14 + 27.03 = **62.16%**. The power-to-heat ratio rises to 390 ÷ 300 = **1.30**. Separate production would need 390 ÷ 0.40 + 300 ÷ 0.82 = 975 + 365.9 = 1,340.9 kW, so PES = (1,340.9 − 1,110) ÷ 1,340.9 = **17.22%**. The cogeneration check gives the same figures and a yearly fuel saving of 1,108 MWh.

The boiler gas avoided falls to 300 ÷ 0.82 = 365.9 kW, 6,322.0 GJ a year, worth A$101,151. The net saving becomes 374,400 + 101,151 − 306,893 − 46,800 = **A$121,858** a year, excluding GST, and the payback 1,100,000 ÷ 121,858 = **9.03 years**. The washer would cut the laundry's total gas use, but it would weaken the CHP case, which is why the two projects must be assessed together, with the heat demand that will exist after both.
