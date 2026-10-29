---
book: heat-engines-and-cogeneration-by-the-numbers
chapterSlug: real-engines-fuel-heat-rate-and-the-energy-balance
order: 5
title: "Real engines: fuel, heat rate and the energy balance"
description: "Gross and net heating values, heat rate at full and part load, ratings and ambient conditions, the full energy balance of a gas engine, and exhaust flow and dew point from the air–fuel ratio."
draft: true
---

The cycles of Chapters 3 and 4 explain how engines behave. To decide whether one is worth buying, an engineer needs the maker's numbers: fuel used, power out, heat recoverable and exhaust conditions, at the loads and ambient conditions the site will actually see. Those numbers come on a datasheet, and the datasheet is easy to misread. The commonest mistake is not in the engineering but in the units: engine fuel figures and gas bills are usually on different bases, and the difference is about 10%.

This chapter sets out the two heating values and converts between them, shows how heat rate changes with load and ambient conditions, assembles the engine's complete energy balance on both bases, and works out the exhaust flow and its water dew point from the air–fuel ratio. It ends with a fuel budget that came out A$30,000 a year too low.

## Gross and net heating values

When natural gas burns, its hydrogen becomes water. If the products are cooled back to 25 °C and the water condenses, the heat released is the **higher heating value** (HHV), also called the gross calorific value. If the water stays as vapour, as it does in any engine exhaust or ordinary boiler flue, the heat released is smaller by the latent heat of that water. That smaller figure is the **lower heating value** (LHV), or net calorific value.

For methane the difference is easy to calculate. Burning one mole releases about 890.6 kJ with the water condensed (NIST Chemistry WebBook). Each mole makes two moles of water, and turning liquid water at 25 °C into vapour takes 44.0 kJ/mol (CODATA key values). The lower heating value is therefore 890.6 − 2 × 44.0 = 802.6 kJ/mol.

```figure
type: compare
title: Gross and net heating values of methane
rowhead: Basis
cols: Per mole | Per kilogram | Water in the products | Used by
caption: Methane's molar mass is 16.043 g/mol. Pipeline natural gas is mostly methane with some ethane, carbon dioxide and nitrogen, so its ratio is close to, but not exactly, 0.901; the gas distributor's figures for the site should be used for real work.
- Higher (gross) heating value | 890.6 kJ/mol | 55.5 MJ/kg | condensed to liquid | Australian gas billing, most boiler efficiencies
- Lower (net) heating value | 802.6 kJ/mol | 50.0 MJ/kg | left as vapour | engine and turbine datasheets
- * Ratio LHV ÷ HHV | 0.901 | 0.901 | the latent heat of the water | converting between the two
```

Australian gas is sold by energy, in megajoules or gigajoules, worked out from the metered volume and the gas's gross heating value. Engine and gas turbine makers usually quote fuel consumption and efficiency on the lower heating value, following international practice. So an engine stated as 40% efficient on LHV is 40 × 0.901 = 36.0% efficient against the gas the site pays for.

This is an illustration. The laundry's gas engine uses 1,000 kW of fuel on LHV, which is 1,000 ÷ 0.901 = **1,110 kW** of gas as billed. The existing boiler's 82% efficiency is already on the gross basis, which is why Chapter 1 compared the boiler's 1,097.6 kW of gas with the engine's 1,110 kW, not 1,000 kW.

## The energy balance on both bases

The maker's datasheet for the offered engine lists, at full load and standard reference conditions, the electrical output, the jacket water and oil cooler heat, the exhaust flow and temperature and the fuel input. Chapter 1 used these for a first-law balance on the lower heating value. On the gross basis a fifth stream appears: the latent heat of the water vapour in the exhaust.

```figure
type: stack
title: The gas engine's energy balance against the gas as billed (gross basis)
unit: kW
caption: This is an illustration at full load. The 110 kW of latent heat is the difference between 1,110 kW on the gross basis and 1,000 kW on the net basis; it leaves as water vapour in the exhaust and can be recovered only by cooling the exhaust below its water dew point of about 48 °C.
- Electricity, gross | 400
- Jacket water and oil cooler, 90 °C | 230
- Exhaust sensible heat to 25 °C | 304.7
- Latent heat of water vapour in the exhaust | 110
- Alternator, radiation and intercooler losses | 65.3
```

The latent heat can be checked independently. The engine burns 0.020 kg/s of methane, which forms 0.020 × (2 × 18.015) ÷ 16.043 = 0.0449 kg/s of water. At about 2,442 kJ/kg to condense it at 25 °C, that is 109.7 kW, matching the 110 kW difference to within rounding. A balance that closes from two directions is good evidence that the datasheet has been read correctly.

### What each stream is worth

The five streams are equal on the first law and very unequal in use. The electricity is the product. The jacket water at 90 °C can heat the tunnel washer's water directly. The exhaust at 470 °C is hot enough to raise the 10 bar gauge steam the ironers need. The latent heat is available only below 48 °C, which suits only a cold-water preheater. The losses go to the engine room's ventilation air. Chapters 9 and 10 turn these streams into recovered heat and money.

## Heat rate at part load and in hot weather

Datasheet figures are for full load at stated reference conditions. International standard ISO 3046-1 sets out standard reference conditions and how reciprocating engine power and fuel consumption are declared, and makers use it or their own stated conditions. A site is rarely at those conditions, and an engine is not always at full load.

### Part load

Friction, pumping and the engine's own auxiliaries change little with load, so at part load they take a larger share of a smaller output, and the heat rate rises. Spark-ignition gas engines also lose efficiency when they reduce output by throttling the mixture or reducing boost.

```figure
type: bars
title: Heat rate of the offered engine at three loads
unit: kJ/kWh
max: 11000
caption: This is an illustration of the usual shape, using 40.0%, 38.5% and 36.0% electrical efficiency (LHV) at 100%, 75% and 50% load. Real part-load figures come only from the maker's datasheet for the engine and its settings.
- * 100% load, 400 kW | 9000
- 75% load, 300 kW | 9351
- 50% load, 200 kW | 10000
```

At 50% load the engine needs 200 ÷ 0.36 = 555.6 kW of fuel for 200 kW, 11% more fuel per kilowatt-hour than at full load. Most engine makers also set a minimum continuous load below which the engine should not run for long periods. For cogeneration, the lesson is to size the engine so that it runs near full output for most of its hours, which Chapter 10 does by matching it to the site's steadiest demands.

### Ambient conditions

A turbocharged engine needs a certain mass of air each second. Hot intake air and high altitude both reduce air density, so at some point the turbocharger cannot supply enough and the engine must be derated. Hot weather also makes it harder to reject heat from radiators, and a hot charge-air cooler raises the intake temperature, which increases the risk of knock (Chapter 3). Makers publish derating tables or curves against intake temperature and altitude. The laundry is near sea level, so altitude is not an issue, but on a 40 °C afternoon in a regional town the engine's rated output may be lower than its nameplate. An engine room with a cool, shaded air intake is worth designing for.

## Exhaust flow from the air–fuel ratio

The exhaust flow sets how much heat the exhaust can give up, so it needs to be known accurately. It can be calculated from the fuel flow and the air–fuel ratio, which in turn follows from the excess air.

For complete combustion of methane, one mole of CH₄ needs two moles of oxygen. Dry air carries 3.76 moles of nitrogen with each mole of oxygen, so each mole of methane needs 2 × 4.76 = 9.52 moles of air, a stoichiometric air–fuel ratio by mass of 9.52 × 28.97 ÷ 16.043 = 17.19. The engine runs lean, with about 80% excess air, so the actual ratio is 17.19 × 1.8 = 30.94.

This is an illustration. The [Hydrocarbon Combustion Air and Flue Gas Check](/tools/combustion-air-flue-gas-check/) takes the fuel's formula CₓHᵧ, its mass flow, the excess air, the flue gas pressure and the lowest surface temperature the exhaust will meet. It returns the stoichiometric and actual air–fuel ratios, the air and flue gas flows, the dry oxygen and carbon dioxide an analyser would read, the water vapour content and its partial pressure, the water dew point, and the margin between the surface and the dew point. For methane (x = 1, y = 4), 72 kg/h of fuel and 80% excess air, it gives:

- air–fuel ratio 17.191 stoichiometric and 30.944 actual;
- combustion air 2,227.95 kg/h (0.619 kg/s) and exhaust 2,299.95 kg/h (0.639 kg/s);
- dry exhaust analysis 9.92% oxygen and 6.2% carbon dioxide;
- water vapour 11.03% of the exhaust, a partial pressure of 11.174 kPa, and a water **dew point of 48 °C**.

These are the figures behind the 0.62 kg/s of air and 0.64 kg/s of exhaust used in Chapters 2 and 3. The tool assumes complete combustion with dry air and no sulfur, so it gives the water dew point only. It does not model the engine itself, and it is used here as a combustion calculation alongside the maker's data, not in place of it.

### From an analyser reading back to the air flow

On site, the excess air is usually found the other way round, from a flue gas analyser. For methane burned completely, the dry products per mole of fuel are 1 mole of CO₂, 2e moles of spare oxygen and 7.52 (1 + e) moles of nitrogen, where e is the excess air as a fraction.

```figure
type: formula
title: Excess air of a methane-fired engine from the measured dry oxygen
formula: O₂ (dry) = 2e ÷ (8.52 + 9.52e)
formula: e = 8.52 × O₂ ÷ (2 − 9.52 × O₂)
caption: This is an illustration for methane and complete combustion. The second line inverts the first, so a measured dry oxygen fraction gives the excess air, and with the fuel flow the air and exhaust flows.
- O₂ (dry) | measured oxygen fraction in the dried exhaust sample
- e | excess air as a fraction of the theoretical air
step: Measured dry O₂ 9.92%: e = 8.52 × 0.0992 ÷ (2 − 9.52 × 0.0992) = 0.80, or 80% excess air
step: Air–fuel ratio = 17.19 × 1.80 = 30.94
step: Air = 30.94 × 0.020 = 0.619 kg/s; exhaust = 0.619 + 0.020 = 0.639 kg/s
```

### The water dew point

The exhaust's water vapour condenses on any surface colder than 48 °C. That matters in two opposite ways. A heat exchanger or stack not built for condensate will corrode where the exhaust cools below its dew point, so the exhaust steam generator in Chapter 9 is designed to keep its coldest surface well above it: at 200 °C outlet, its tubes are around 180 to 190 °C, far above 48 °C. On the other hand, a condensing heat exchanger built of suitable materials, with drainage and neutralisation of the condensate, can recover part of the 110 kW of latent heat by heating cold water. With the tunnel washer's incoming mains water at around 20 °C, a condensing stage is physically possible; whether it pays is a question for Chapter 9. The same physics for burners and boilers is covered in [Water in the flue gas and condensing heat recovery](/reados/publications/combustion-by-the-numbers/flue-gas-dew-point-and-condensing-heat-recovery/) in *Combustion by the Numbers*.

## Reading the heat side of the datasheet

Heat figures on an engine datasheet are only meaningful with the temperatures attached to them. Two are easy to miss.

**The exhaust heat's cut-off temperature.** Makers often state the recoverable exhaust heat "cooled to 120 °C" or some other temperature, not to 25 °C. This is an illustration. The same 0.64 kg/s of exhaust at 470 °C gives 0.64 × 1.07 × (470 − 120) = 239.7 kW cooled to 120 °C, 184.9 kW cooled to 200 °C as the laundry's steam generator would, and 304.7 kW cooled to 25 °C as in the balance above. Three honest figures for one exhaust differ by 120 kW, so the cut-off temperature must be matched to the heat user. Steam at 184 °C cannot be raised by exhaust cooler than about 200 °C, whatever the datasheet's headline figure.

**The jacket water's return temperature.** The 230 kW of jacket heat is available at 90 °C only if the water comes back from the heat user at 70 °C or cooler. If the tunnel washer's demand drops and the water returns hotter, the engine's control system sends the surplus to a dump radiator, and the recovered heat falls even though the engine is still running at full output. The datasheet's figure is a maximum; the heat actually used depends on the site's demand at each hour, which is why Chapter 10 counts only heat that displaces boiler fuel.

## The error: a fuel budget on the wrong basis

This is an illustration. The laundry's accountant prepared a first fuel budget for the engine from the datasheet: 1,000 kW of fuel for 4,800 hours a year is 4,800 MWh, or 17,280 GJ, which at an illustrative gas price of A$16.00 per gigajoule, excluding GST, came to **A$276,480 a year**.

The engineer noticed that the datasheet's footnote gave the fuel input "based on LHV" and that the gas contract priced energy on the gross heating value. The engine would draw 1,110 kW as billed, 5,328 MWh or 19,180.8 GJ a year, costing **A$306,893**. The budget was A$30,413 too low, an error of 9.9% of the true figure, which by itself was a fifth of the net saving that Chapter 10 later finds for the whole project.

The correction was simple, and the habit it produced is the useful part: every fuel figure in the project file now carries the letters HHV or LHV, and every efficiency carries its basis and whether the output is gross or net. Comparisons between boilers, engines and the gas bill are made only after converting all of them to the gross basis that the bill uses.

## How this applies to a small Australian business

Any business considering on-site generation will be handed datasheets on the net basis and gas contracts on the gross basis. Asking three questions of every datasheet avoids most mistakes:

1. Is fuel input on the higher or the lower heating value, and at what reference conditions?
2. Is electrical output gross at the alternator terminals or net of the package's own pumps and fans?
3. What are the efficiency, exhaust flow and recoverable heat at 75% and 50% load, and how is the rating reduced at the site's hottest intake temperature?

The gas distributor or retailer can supply the site's gas heating value and composition. Gas fitting, exhaust systems and pressure equipment for engines are regulated work under each state's gas and safety legislation, and Australian Standards such as AS/NZS 5601.1 (gas installations) and AS 3814 (industrial and commercial gas-fired appliances) apply to the installation, under the review of licensed and qualified people. GST is excluded from the illustrative prices here because a registered business claims it back; a business that is not registered should add it.

## Exercise: the engine at 75% load

At 75% load the engine delivers 300 kW at 38.5% electrical efficiency (LHV), an illustrative figure. Find its fuel input on both bases, its heat rate on the gross basis, and the fuel cost per kilowatt-hour of electricity at A$16.00 per gigajoule excluding GST. Compare with full load.

**Worked answer.** Fuel on the net basis is 300 ÷ 0.385 = 779.2 kW; on the gross basis it is 779.2 ÷ 0.901 = **864.8 kW**. The gross heat rate is 864.8 ÷ 300 × 3,600 = **10,378 kJ/kWh**, or 0.010378 GJ per kilowatt-hour, so the fuel cost is 0.010378 × 16.00 = **A$0.166 per kWh**.

At full load the gross heat rate is 1,110 ÷ 400 × 3,600 = 9,990 kJ/kWh, and the fuel cost is 0.00999 × 16.00 = A$0.160 per kWh. Running at 75% load costs about 3.9% more fuel per kilowatt-hour of electricity, before counting the auxiliaries, which take a larger share of a smaller output and widen the gap further on a net basis.
