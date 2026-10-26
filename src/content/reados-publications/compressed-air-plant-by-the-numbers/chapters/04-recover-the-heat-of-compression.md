---
book: compressed-air-plant-by-the-numbers
chapterSlug: recover-the-heat-of-compression
order: 4
title: "Recover the heat of compression"
description: "Follow CA-1's 41 kW into its oil cooler, aftercooler and room, value the hot water and warm air it could supply, and keep heat recovery from cooling the oil below its dew point."
draft: false
---

Nearly all the electricity a compressor uses becomes heat. The compressed air leaving the aftercooler carries a little more energy than the air that entered, but the difference is small; the rest leaves through the oil cooler, the aftercooler, the motor and the package casing. On most sites that heat is blown out of a louvre or carried away by a cooling tower. On some, it heats the washdown water, the boiler feed or the building.

This chapter draws the energy balance for CA-1, values the heat it could recover as hot water or warm air, and sets out when heat recovery is worth doing and when it is not. It closes with a winter fault in which heat recovery worked too well.

## Where the 41 kW goes as heat

The first law makes the starting point simple: what goes in as electricity comes out as heat, apart from the small increase in the energy content of the air itself, which is mostly carried away in the aftercooler anyway. For an oil-injected screw, most of the heat is in the oil.

```figure
type: stack
title: Where CA-1's 41 kW of input leaves as heat, at full load
unit: kW
caption: This is an illustration. The aftercooler figure is calculated in Chapter 3; the split between the oil cooler and the room is a teaching assumption for an air-cooled oil-injected screw. Makers publish recoverable heat for their own machines.
- * Oil cooler | 29.5
- Aftercooler, sensible and condensation | 8.2
- Motor, fan and casing, into the room | 3.3
```

The oil cooler's heat, about 72 per cent of the input in this illustration, is the easiest to recover. The oil leaves the compressor hot, typically at 70 °C to 90 °C, and passes through a single heat exchanger, so a water-cooled plate exchanger in the oil circuit can capture most of it at a useful temperature. The aftercooler's heat is at a lower temperature and spread through a larger flow of air; it is usually recovered, if at all, as warm air from the whole package.

## Hot water from the oil

This is an illustration. CA-1 averages about 31.8 kW of input over its 6,000 hours a year, because it runs at 70 per cent load on load and unload control, as Chapter 8 calculates. If 72 per cent of that is recovered from the oil, the average recovered heat is about **22.9 kW**, or about 494 GJ a year.

Used to heat water from 15 °C to 60 °C, 22.9 kW warms about 0.122 kg/s, roughly 440 L/h, or about 10.5 kL over a full day of running. That is enough for a modest washdown system, boiler make-up preheating, or a hot water service for amenities.

```figure
type: compare
title: Annual value of CA-1's recoverable oil heat, about 494 GJ
rowhead: Heat it displaces
cols: Basis | Value a year
caption: This is an illustration, excluding GST, at 6,000 hours and 22.9 kW average. The value depends entirely on what the recovered heat replaces and whether it is needed at the same time as the compressor runs.
- * Gas-fired water heating | 85 per cent efficiency, A$18 per GJ | about A$10,500
- Electric resistance water heating | A$0.25 per kWh | about A$34,300
- Nothing, because there is no use for it | heat rejected as before | A$0
```

The table makes the main point: heat recovery's value is set by what it replaces. Displacing electric resistance heating is worth more than three times as much as displacing gas, at these teaching prices. Displacing nothing is worth nothing, however much heat is available. A compressor room surrounded by uses for warm water is a gift; one at the far end of a site with no heat demand nearby is not, and the honest answer there may be to recover nothing and spend the money on reducing air demand instead.


## Why most of the input becomes heat

It can seem odd that a machine built to make pressure turns nearly all its input into heat. The explanation is in Chapter 2. Even ideal isothermal compression, the least work possible, rejects all of its work as heat, because to keep the air at intake temperature the heat of compression must be removed as fast as it forms. The compressed air at the end holds its energy as pressure, not temperature, and that pressure energy is what users draw on. Real compression, with its losses, rejects more heat still. A compressor is in effect an electric heater that also produces a stream of compressed air, and treating it as a heat source as well as an air source is simply accounting for both of its outputs.

That does not make compressed air a sensible way to produce heat. Running a compressor to make heat would be a poor heat pump and a worse boiler. Heat recovery is worthwhile only from compression that is already needed for air, which is why reducing air waste comes first.

## Matching heat to demand

The commonest reason heat recovery disappoints is a mismatch in time. The compressor makes heat whenever it runs loaded. The user needs heat when it needs it. If the washdown system draws hot water at the end of each shift but the compressor runs all day, the recovered heat needs storage, a hot water tank big enough to hold a shift's worth, or most of it will be rejected through the compressor's own cooler because the recovery loop has nowhere to send it.

Good candidates for compressor heat recovery share three features: a steady demand for low-grade heat during the compressor's running hours, a temperature requirement the oil can meet, typically 60 °C or less, and a location close enough to the compressor room to keep the piping short. Boiler make-up water preheating, process water preheating and amenities hot water often meet all three. Space heating meets the first only in winter.

## Warm air for the building

An air-cooled compressor's whole heat output leaves in its cooling air. Ducting that air into an adjacent workshop or store in winter turns the compressor into a space heater, with nothing more than a duct, a damper and a thermostat. In summer, the damper sends the air outside instead, which also solves the hot-room problem of Chapter 3.

This is an illustration. If about 90 per cent of CA-1's average input reaches a heated space through ducting for 1,500 winter hours, it delivers about 42,900 kWh, about 154 GJ, of space heating a year. Whether that is worth having depends on the space's need and on the alternative heat source, as before.

## Designing a recovery scheme

```figure
type: steps
title: Steps to a compressor heat recovery scheme
caption: The order matters: measure what the compressor actually produces and what the user actually needs before choosing equipment.
- Measure the compressor's real load profile | average and hourly input power, not the nameplate
- Measure the candidate user's heat demand | how much, at what temperature, at what times
- * Overlay the two in time | the matched heat, hour by hour, is what the scheme can save
- Size storage for the mismatch | a tank holds heat made when nobody needs it
- Include the compressor maker's oil temperature protection | recovery must never override it
- Price the alternative heat honestly | at the boiler's real efficiency and the site's real tariff
```

## Measure before designing

A recovery scheme is only as good as the data behind it. The compressor's controller usually records loaded hours, and a power meter or logged motor current over a few weeks gives the real average and hourly input. The candidate user's demand can be logged with a flow meter and two temperature sensors, or estimated from the heat it currently buys. Overlaying the two, hour by hour, shows how much of the compressor's heat could actually be used. On CA-1's site that overlay found the make-up water demand closely matched to the compressor's running hours, which is why the exercise below finds such a good fit.

## Storage

Where demand and supply do not coincide, a storage tank stores heat made when it is not needed. Storing 22.9 kW for a four-hour gap takes about 330 MJ, which, in water heated through 45 °C, needs about 1.75 m³ of tank. Tanks lose heat, take space and cost money, and they turn a simple heat exchanger into a small system that needs controls. Storage makes sense when it lets a large share of the recoverable heat be used; it rarely makes sense to store heat for a small or occasional user.

## Hot water hygiene

Recovered heat that ends up in water people use, for washing or showers, brings plumbing and health requirements with it. Warm stored water at the wrong temperature can support the growth of bacteria such as Legionella, and Australian plumbing requirements and health guidance set rules for storing and distributing heated water, including storage temperatures and controls at the outlets. A recovery scheme that preheats water for a hot water system should feed into a heater that brings it to the required temperature, not deliver lukewarm water directly. Designers should check the current plumbing requirements and their state's health guidance before connecting recovered heat to a potable supply.

## Oil-free compressors give hotter heat

Oil-free compressors, described in Chapter 2, have no oil to carry the heat, and their compression stages run much hotter, so their heat is available at higher temperatures, from the hot air between stages and from water-cooled jackets and coolers. Some oil-free machines are designed with heat recovery as a feature, delivering water hot enough for uses that an oil-injected machine's 60 °C to 70 °C cannot meet. The same tests of demand, timing and alternative still apply.

## When heat recovery is not worth doing

Heat recovery is not free. It needs heat exchangers, pumps or fans, controls, piping and maintenance, and it adds a water circuit to a compressor. A recovery system sized for heat that is only sometimes needed, or that replaces a cheap heat source, can have a payback longer than the compressor's life. Three warning signs:

- the recovered heat would replace heat from a boiler that is already efficient and lightly loaded, so the saving is small;
- there is no use at the times the compressor runs, and no space for storage;
- the compressor itself is oversized and lightly loaded, so it makes less heat than its nameplate suggests, as CA-1 does at 70 per cent load.

The last point matters for ranking measures. Reducing compressed air waste, as Chapter 7 describes, reduces the compressor's load and therefore its recoverable heat. Saving electricity first and then recovering heat from what remains is the right order, just as fixing steam leaks comes before recovering flash steam.

## A failure case: recovery that cooled the oil too far

This is an illustration. CA-1 was fitted with a plate heat exchanger in its oil circuit to preheat cold make-up water for the site's boiler. In summer it worked well. In winter, the mains water entering the exchanger fell to about 12 °C, and the exchanger, sized for summer, removed so much heat that the compressor's oil temperature fell well below its normal range during light-load periods.

A routine oil analysis found water in the oil, and the compressor's bearing condition began to deteriorate. Chapter 3 had calculated the reason: the air inside CA-1's element has a dew point of about 55 °C on a 25 °C, 60 per cent humidity day, and oil cooled below that collects water that condenses out of the compressed air.

The error was in letting the heat recovery loop control the oil temperature instead of the compressor. The correction was a thermostatic valve on the recovery loop that diverts water around the exchanger whenever the oil temperature falls towards its minimum, so the compressor's own thermostatic control always has priority. Heat recovery systems for oil-injected compressors are normally supplied with such controls by the compressor maker; the site's system had been assembled from separate parts without one.

## Keep the scheme working

A heat recovery scheme fails quietly. A bypass valve left open, a pump that has stopped, or a heat exchanger fouled on its water side all return the heat to the compressor's own cooler without any alarm, and the boiler or electric heater simply makes up the difference. Logging the recovery loop's flow and temperatures, and reporting the heat recovered each month alongside the compressor's energy use, is what keeps the saving real. The figure belongs in the same monthly report as the compressor's specific power from Chapter 2.

## Water-cooled compressors and larger plants

On water-cooled compressors, all the heat is already in a water circuit. Recovering it can be as simple as raising the circuit's temperature and taking the water to a user before it reaches the cooling tower. On large plants, with several hundred kilowatts of compression, recovered heat can supply a significant share of a site's low-temperature heat demand, and it often features in plans to reduce gas use. The same three tests apply: a matching demand, a usable temperature and reasonable distance.

## Exercise: preheating boiler make-up

The site's boiler takes about 330 kg/h of make-up water at 15 °C during the hours CA-1 runs. If CA-1's recovered oil heat, 22.9 kW on average, preheats that water, to what temperature could it be raised, and is there heat to spare?

**Answer.** Heating 330 kg/h, about 0.0917 kg/s, by ΔT takes 0.0917 × 4.18 × ΔT kW. Setting that equal to 22.9 kW gives ΔT of about **60 °C**, so the water could reach about 75 °C. That is above what the oil can reliably deliver: with the oil at around 80 °C to 85 °C, a practical exchanger might heat the water to about 60 °C to 65 °C. At 60 °C, the make-up water takes 0.0917 × 4.18 × 45, about **17.2 kW**, leaving about 5.7 kW of the average recoverable heat unused.

The calculation shows a good match: most of the recoverable heat finds a use at a temperature the oil can provide, and the remaining heat can be rejected by the compressor's own cooler. The thermostatic protection from the failure case is still required. In winter, when the mains water arrives colder, the same exchanger would take more heat, which is exactly when that protection matters most.

