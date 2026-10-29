---
book: heat-engines-and-cogeneration-by-the-numbers
chapterSlug: recovering-engine-heat
order: 9
title: "Recovering engine heat: exhaust, jacket water and the exergy limit"
description: "Where an engine's rejected heat goes, the exergy of a stream that cools as it gives up heat, matching each stream to a demand at the right temperature, and testing a heat-to-power claim."
draft: true
---

A gas engine that turns 40% of its fuel into electricity rejects the other 60% as heat, and cogeneration stands or falls on how much of that heat a site can use. The heat does not come in one lump. It leaves in streams at very different temperatures: exhaust gas at several hundred degrees, jacket water at about 90 °C, and water vapour in the exhaust that gives up its latent heat only below its dew point. Each stream suits some duties and not others.

This chapter sorts the laundry engine's heat by temperature, calculates the exergy of each stream, the most work any machine could get from it, and matches each one to a demand. It then tests a proposal to turn the jacket water into electricity with an organic Rankine cycle unit, a claim the first law cannot judge and the second law settles in a few lines.

## The engine's heat in three streams

Chapter 5 set out the engine's energy balance on the lower heating value: 1,000 kW of fuel gives 400 kW of electricity, 230 kW to the jacket water and oil cooler, 304.7 kW in the exhaust above 25 °C, and 65.3 kW of other losses. On the gross heating value, on which the laundry buys its gas, there is a fourth stream: about 110 kW of latent heat in the water vapour the combustion makes, which leaves with the exhaust unless the gas is cooled below its dew point of 48 °C.

This is an illustration. The streams, with the temperatures at which they are available, are the raw material for the heat-recovery design.

```figure
type: compare
title: The engine's rejected heat by stream
cols: Heat | Available between | Exergy, dead state 25 °C
rowhead: Stream
caption: This is an illustration. Exhaust 0.64 kg/s at c_p 1.07 kJ/kg·K; jacket water 2.745 kg/s at 4.19 kJ/kg·K. Exergy from the waste heat recovery limit check. The exhaust holds less heat than the jacket water's 230 kW above 200 °C but more than twice its exergy.
- Exhaust, hot band | 184.9 kW | 470 to 200 °C | 92.71 kW
- Exhaust, middle band | 54.8 kW | 200 to 120 °C | 16.97 kW
- Exhaust, low band | 65.1 kW | 120 to 25 °C | 8.58 kW
- Jacket water and oil | 230 kW | 90 to 70 °C | 35.77 kW
- Latent heat in the exhaust | about 110 kW | below the 48 °C dew point | small
```

## The exergy of a stream that cools

Chapter 1 found the Carnot limit for heat taken from a reservoir at one fixed temperature. A waste-heat stream is not a reservoir. As it gives up heat its temperature falls, so the first kilowatt taken from the exhaust is worth more than the last. The most work a reversible machine could make is the integral of the Carnot efficiency over the cooling, with the surroundings as the cold side, which for constant specific heat gives a closed form:

```figure
type: formula
title: The exergy of the exhaust's hot band
formula: Ex = ṁ c_p [(T₁ − T₂) − T₀ ln(T₁ ÷ T₂)]
caption: This is an illustration. Temperatures in kelvin; the dead state is the 25 °C surroundings. The result matches the waste heat recovery limit check.
- ṁ c_p | 0.64 × 1.07 = 0.6848 kW/K
- T₁, T₂, T₀ | 743.15 K, 473.15 K and 298.15 K
step: Heat released 0.6848 × 270 = 184.9 kW
step: T₀ ln(T₁ ÷ T₂) = 298.15 × ln(1.5706) = 298.15 × 0.45149 = 134.61 K
step: Exergy 0.6848 × (270 − 134.61) = 92.71 kW
step: Mean Carnot efficiency 92.71 ÷ 184.9 = 50.1%
```

The [waste heat recovery limit check](/tools/waste-heat-recovery-limit/) works this calculation for any stream: from its mass flow, specific heat, inlet and outlet temperatures and the surroundings' temperature, it gives the heat released, the exergy, the mean Carnot efficiency, a claimed power as a share of the heat and of the exergy, and the claimed power's yearly value, and it judges the claim against the exergy and against the largest share of it you consider realistic. It assumes constant specific heat and refuses an outlet below the surroundings, which no heat engine could reach.

A useful way to read the result: a stream that cools from T₁ to T₂ behaves like a reservoir at the logarithmic mean of the two temperatures, (T₁ − T₂) ÷ ln(T₁ ÷ T₂). For the jacket water, cooled from 363.15 K to 343.15 K, that is 353.06 K, or 79.9 °C, and 1 − 298.15 ÷ 353.06 = 15.6%, the tool's mean Carnot efficiency.

## Matching heat to demand temperature

Heat flows only from hotter to colder, and a heat exchanger needs a temperature difference to do it in a sensible size. Each stream can therefore serve only the demands below it. The laundry's demands, from the case, are 550 kW of steam at 184.1 °C and 350 kW of hot water at 60 to 70 °C, heated from mains water at about 20 °C.

This is an illustration. The engineer matched the streams top-down:

1. **Exhaust, hot band, to steam.** Only the exhaust is hot enough to raise 10 bar gauge steam. An exhaust steam generator cooling the gas to 200 °C, 15.9 K above the saturation temperature, delivers 184.9 kW, reducing the boiler's steam load from 550 to 365 kW.
2. **Jacket water to hot water.** At 90 °C flow and 70 °C return, the jacket circuit heats the tunnel washer's water directly through a plate heat exchanger: 230 kW, leaving 120 kW for the steam calorifier.
3. **Exhaust, middle band, to hot water.** An economiser after the steam generator could take the exhaust from 200 °C to 120 °C, giving another 54.8 kW to hot water and cutting the calorifier's share to 65.2 kW. Chapter 10's base case leaves this out and treats it as an option.
4. **Condensing heat to cold mains water.** Below the exhaust's 48 °C dew point (Chapter 5), the water vapour starts to condense. Cooling the gas to 40 °C would condense about 37% of it and release about 40 kW of latent heat, but only into water colder than about 35 °C, which the laundry has in its incoming mains supply. The condensate is mildly acidic, so the exchanger and flue must be built for it, as [Combustion by the Numbers](/reados/publications/combustion-by-the-numbers/flue-gas-dew-point-and-condensing-heat-recovery/) explains.

```figure
type: bars
title: The engine's heat, matched to the laundry's demands
unit: kW
max: 250
caption: This is an illustration. The first two rows are Chapter 10's base case, 415 kW of useful heat. The economiser and condensing stages are options whose value depends on how much hot water remains to be heated after the jacket water.
- * Exhaust 470 to 200 °C, to steam | 184.9
- * Jacket water 90 to 70 °C, to hot water | 230
- Exhaust 200 to 120 °C, economiser option | 54.8
- Exhaust latent heat to 40 °C, condensing option | 39.5
```

The order matters. Using the hot exhaust to heat washing water would waste its ability to raise steam, which only it can do; the boiler would then burn gas for steam the exhaust could have made. The rule is a cascade: the hottest stream to the hottest demand it can meet, and each remaining stream to the hottest demand still open.

## Heat that arrives when it is needed

Matching by temperature is not enough; the heat must also arrive when the demand is there. An engine runs steadily, while a tunnel washer draws hot water in batches and the ironers' steam use rises and falls with the linen mix. Heat that arrives when no one can take it must still leave the engine, or the engine overheats and trips.

Two pieces of plant handle this. A **hot-water store** buffers the jacket heat. This is an illustration. One hour of the jacket's 230 kW is 230 × 3,600 = 828,000 kJ. Stored in water heated from 40 °C to 70 °C, a rise of 30 K, it needs 828,000 ÷ (4.19 × 30) = 6,587 kg, about 6.7 m³ of tank at the water's density near 70 °C. A store of that order lets the engine run steadily through the washer's short peaks and pauses, provided the cold water returning to the engine stays below the engine maker's return temperature limit.

A **dump cooler**, a fan-cooled radiator on the jacket circuit, rejects whatever heat the store cannot take. It protects the engine but wastes heat, so its hours should be logged. Every kilowatt-hour it rejects is heat the cogeneration calculations in Chapter 10 must not count as useful. An installation whose dump cooler runs for long periods is telling its owner that the engine is bigger than the heat demand, or that the store or controls are wrong.

The exhaust has its own bypass: a diverter damper sends gas around the steam generator when the steam main is satisfied. Again, the heat that bypasses is lost, and should be logged.

## Turning heat into power instead

An organic Rankine cycle (ORC) unit is a Rankine cycle that uses a refrigerant-like working fluid instead of water, so it can boil at the low temperatures of jacket water or geothermal brine. It is the usual way to make electricity from heat below about 150 °C. Its efficiency is low because the temperatures are low, and the second law sets the ceiling.

This is an illustration. A supplier proposed an ORC unit on the jacket water, claiming 25 kW of electricity from the 230 kW cooled from 90 °C to 70 °C, with heat rejected to the 25 °C surroundings by fan coolers. Chapter 1 checked the claim against a fixed reservoir at 90 °C and found it 60.73% of the Carnot limit, with a most work of 41.17 kW. That treated the whole 230 kW as available at 90 °C. The waste heat recovery limit check, with the water cooling from 90 °C to 70 °C, gives an exergy of only **35.77 kW**. The claim is 10.9% of the heat and **69.9% of the exergy**, which the check flags as CLAIM OPTIMISTIC against a realistic share of 50%, chosen as an illustration for a small machine. The 50% benchmark is the analyst's judgement, not a property of ORC units; the point is that a claim at 70% of the second-law limit needs test evidence from the maker at these temperatures.

## The error: power from heat the site already uses

This is an illustration. The ORC proposal valued its 25 kW at the laundry's A$0.20 per kWh over 4,800 hours: A$24,000 a year, excluding GST. The plant engineer's objection was not the efficiency claim but the heat.

The jacket water is not waste at the laundry. In the cascade above it supplies 230 kW of the tunnel washer's hot water, displacing 230 ÷ 0.82 = 280.5 kW of boiler gas. Over 4,800 hours that is 4,846.8 GJ, worth A$77,549 a year at A$16.00 per GJ. An ORC unit takes the same heat and rejects about 205 kW of it to the air at a temperature too low for washing. Running it would trade A$77,549 of avoided gas for A$24,000 of electricity, and the claim of 25 kW was gross: the ORC's own feed pump and cooler fans would come off it.

The detection came from listing each stream with its use before valuing any proposal for it, as the figure above does. The correction was a rule: heat-to-power machines are considered only for heat that no process on the site can use at its temperature, and their claims are checked against the stream's exergy, not against a fixed-temperature Carnot limit, and net of their own auxiliaries. On a site that truly had nowhere to put its jacket heat, the same 25 kW would be a fair candidate, still subject to the evidence question.

## Recovering heat from other plant

The same method applies to every heat source on a site. The laundry's air compressor rejects most of its input as heat at 70 to 90 °C, and [Compressed Air Plant by the Numbers](/reados/publications/compressed-air-plant-by-the-numbers/recover-the-heat-of-compression/) shows how to recover it. Dryer exhaust air carries heat and moisture at lower temperatures still. In each case, list the stream's flow, temperature range and exergy, list the demands by temperature, and match top-down. Exergy tells you which streams are precious; temperature tells you where each can go; the site's demand profile tells you whether anyone will be there to use it.

## How this applies to a small Australian business

For most small and medium Australian sites with a gas engine, the jacket water is the easiest heat to use and the exhaust the most valuable. Hot-water demands for washing, cleaning in place, space heating and pool heating sit comfortably below 90 °C. Steam or high-temperature hot water from the exhaust needs a pressure-rated exhaust boiler, which is registrable pressure equipment in some jurisdictions and brings inspection obligations under state and territory work health and safety law.

Heat-to-power units such as ORC machines have a place on sites with a large, steady stream of heat that nothing else can use, such as some kiln, furnace or engine exhausts at remote sites. Before accepting a claim, run it through the waste heat recovery limit check with the stream's real inlet and outlet temperatures, ask for the net output after the unit's own pumps and fans, and ask what the heat would be worth if used directly.

Whatever is installed, meter it. A heat meter on each recovery circuit, a flow meter with flow and return temperature sensors, records the heat actually delivered, and a run-hours counter on the dump cooler and the exhaust diverter records the heat thrown away. With those readings and the gas meter, a site can calculate its real utilisation each month and compare it with the design. The difference between the two is usually the first sign that controls have drifted, a store is too small, or demand has changed since the plant was sized.

## Exercise: the economiser option

The laundry adds an economiser after the exhaust steam generator, cooling the exhaust from 200 °C to 120 °C into the hot-water circuit. Find the heat recovered, its exergy, the gas it saves at the boiler's 82% over 4,800 hours, the value at A$16.00 per GJ excluding GST, and the margin left above the exhaust's 48 °C dew point.

**Worked answer.** The heat recovered is 0.6848 × (200 − 120) = **54.8 kW**. Its exergy, from the formula or the waste heat recovery limit check, is 0.6848 × [80 − 298.15 × ln(473.15 ÷ 393.15)] = **16.97 kW**, a mean Carnot efficiency of 31%. The calorifier's remaining hot-water load falls from 120 kW to 65.2 kW.

The boiler gas avoided is 54.8 ÷ 0.82 = 66.8 kW. Over 4,800 hours that is 66.8 × 4,800 × 3.6 ÷ 1,000 = **1,154.5 GJ**, worth **A$18,472 a year**. The exhaust leaves the economiser at 120 °C, 72 K above the 48 °C dew point, so the economiser runs dry and can be built from ordinary materials. That annual value is the budget against which the economiser's installed cost, its extra back pressure on the engine and its maintenance must be weighed.
