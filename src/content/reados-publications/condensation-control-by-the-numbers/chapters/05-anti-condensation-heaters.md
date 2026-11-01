---
book: condensation-control-by-the-numbers
chapterSlug: sizing-and-controlling-anti-condensation-heaters
order: 5
title: "Sizing and controlling an anti-condensation heater"
description: "Set the temperature lift a heater must hold, size it with the wall-loss method and its outdoor allowance, place and control it, estimate its energy, and avoid the frost thermostat trap."
draft: false
---

An anti-condensation heater is a small, cheap device, and it is often chosen with no calculation at all: a catalogue picture, a wattage that looks about right, and a thermostat set to whatever it came with. Some of those heaters work. Many run when they are not needed and stay off when they are, and a few are too small to keep the one surface that matters above the dew point.

This chapter sizes CC-7's heater properly. It decides how many kelvin of lift the heater must hold and why, applies the maker's sizing method and its allowance for outdoor cabinets, places the heater, chooses its control, estimates the energy it uses over a year, and describes the heater that never switched on during the humid nights it was bought for.

## How much lift the heater must hold

A heater's job is to keep every surface inside the enclosure above the dew point of the air inside. Since the heater does not change the dew point, the requirement is a temperature lift: the inside air must be held some number of kelvin above the outside air, enough that the coldest surface stays above the dew point with a margin.

Two numbers set the lift. The first is how far below the inside air the coldest surface falls. Chapter 2 showed that for CC-7's roof under a canopy, with a fan heater stirring the air, the roof's inner face settles about 2 K below the inside air when the inside is held 5 K above outside, and about the same when held 8 K above. The second is how close to saturation the outside air gets: at PS-7 on a summer night, the dew point is 0.8 K below the air.

```figure
type: bars
title: Inside relative humidity on a 20 °C, 95% RH night, by heater lift
unit: % RH
max: 100
caption: This is an illustration. Each kelvin of lift near room temperature lowers the inside RH by roughly 6%. At +8 K the inside air is at 58.7%, below the levels at which salts and corrosion films become active (Chapter 8).
- No lift | 95
- +2 K | 84
- +4 K | 74.4
- +6 K | 66.1
- * +8 K | 58.7
- +10 K | 52.3
```

For CC-7 the business chose a lift of **8 K**. Chapter 2's balance showed that it keeps the roof's inner face at 21.7 °C on a clear summer night, 2.5 K above the 19.2 °C dew point, with the canopy fitted and the air stirred. It also brings the inside relative humidity down to about 59% on the most humid nights, which matters for corrosion as much as for condensation.

## The maker's sizing method

Enclosure heater makers publish a simple method based on the enclosure's wall losses. The heat lost through the walls is the exposed area times a heat transmission coefficient for the wall material times the temperature lift. The heater supplies that loss, less whatever the equipment inside already dissipates. AutomationDirect's guide gives coefficients of 5.5 W/m²·K for painted steel, 3.7 for stainless steel, 12 for aluminium and 3.5 for plastic or insulated stainless, and doubles the wall-loss term for enclosures outdoors.

```figure
type: formula
title: Heater power for CC-7 by the wall-loss method
formula: P_heater = A × k × ΔT − P_internal  (outdoors: 2 × A × k × ΔT − P_internal)
caption: This is an illustration. The wall-loss term is the same quantity the enclosure cooling airflow tool calculates as the heat lost through the walls.
- A | exposed surface area, 3.20 m²
- k | painted steel, 5.5 W/m²·K
- ΔT | lift required, 8 K
- P_internal | standby dissipation that is always present, 30 W
step: indoors: 3.20 × 5.5 × 8 − 30 = 140.8 − 30 = 110.8 W
step: outdoors: 2 × 140.8 − 30 = 251.6 W
```

The [enclosure cooling airflow tool](/tools/enclosure-cooling-airflow/), used in Chapter 4 for the fan, calculates the same wall-loss term from the surface area, coefficient and temperature difference, so it can be used to check the first part of the heater sum.

### Why outdoor enclosures need more

The doubling for outdoor enclosures is a maker's allowance, not a law of physics, but Chapter 2 shows why something like it is needed. The wall coefficient of 5.5 W/m²·K describes an enclosure in still indoor air, losing heat by natural convection and by radiation to surroundings at about the air temperature. Outdoors at night, the roof and upper walls radiate to a sky 20 K colder than the air, and any wind increases convection from the outside. Both increase the heat the walls lose for a given lift. The canopy recovers part of that, which is one reason PS-7 fits one. Doubling the wall-loss term is a reasonable allowance until measurements show otherwise, and Chapter 9 shows how CC-7's actual heat loss was measured during commissioning.

The utility chose a **250 W fan heater**, the nearest standard size to the outdoor figure. A fan heater rather than a plain convection heater was chosen deliberately: Chapter 2's balance shows that stirred air, with an inner coefficient of about 8 W/m²·K instead of 3, is what lets warm air keep the roof above the dew point.

## Checking the heater's reach

Sizing by wall loss tells you how much power holds the air at the chosen lift. It does not tell you whether the coldest surface is above the dew point, so the roof balance from Chapter 2 is worth repeating with the heater's lift as an input. It also shows what happens on a night when the heater cannot quite hold its lift, for example on a colder, windier night than the design case.

```figure
type: compare
title: CC-7's roof inner face on a clear 20 °C night, by lift and construction
cols: Roof inner face | Margin above the 19.2 °C dew point
rowhead: Arrangement, with a fan heater stirring the air
caption: This is an illustration from the roof heat balance. A canopy and an insulating liner are alternative ways of stopping the sky from pulling the roof's inner face below the dew point; the liner only works if it is also a sealed vapour barrier.
- Canopy, +4 K lift | 19.8 °C | 0.6 K
- *Canopy, +8 K lift | 21.7 °C | 2.5 K
- No canopy, 10 mm closed-cell liner, +5 K lift | 21.3 °C | 2.1 K
- No canopy, 10 mm closed-cell liner, +8 K lift | 23.6 °C | 4.4 K
```

The rows show two things. With the canopy, the roof stays above the dew point even if the heater manages only half its design lift, though with little margin. And a thin closed-cell foam liner glued under the roof does the same job as the canopy, because it puts an insulating layer between the warm air and the cold steel: the liner's face sits at 23.6 °C even though the steel behind it is at about 13.6 °C.

That second point carries a warning. The steel behind the liner is still 5.6 K below the dew point. If moist air can reach it, through gaps at the liner's edges or through an open-celled foam, water condenses out of sight between the liner and the roof and runs down the inside of the walls. A liner works only if it is closed-cell, fully bonded and sealed at its edges, so that it acts as a vapour barrier as well as an insulator. Chapter 7 meets exactly the same rule on cold pipes. PS-7 chose the canopy, because it also cuts the solar load by day and leaves nothing hidden inside the cabinet to inspect.

## Placing the heater

Where the heater goes affects both how well it works and what it can damage.

- **Low in the enclosure.** Warm air rises, so a heater near the bottom heats the whole cabinet, and the fan sends its air up the back towards the roof.
- **Away from the hygrostat and thermostat.** A control mounted directly above the heater measures the heater's own plume and switches it off long before the cabinet is warm.
- **Clear of cables and plastics.** Heater surfaces can be much hotter than the air. Positive temperature coefficient (PTC) heaters limit their own surface temperature, which is one reason they are common in enclosures, but cables still need clearance.
- **Not blocking the drive's airflow.** The drive's own fan draws air through its heat sink, and the heater should not sit in that path.
- **On a circuit that stays live.** If the drive's isolator also isolates the heater, the heater stops whenever the drive is isolated for maintenance, which is often exactly when the door is open and humid air gets in.

## Controlling the heater

A heater needs a control that switches it on when condensation is possible and off otherwise. There are three common choices.

```figure
type: compare
title: Three ways to control CC-7's heater
cols: Switches on | Suits | Fails when
rowhead: Control
caption: For condensation, the hygrostat measures the quantity that matters; a thermostat measures a proxy that is wrong on warm, humid nights.
- Thermostat | inside air below its set point | frost protection; cold, dry climates | the night is warm but humid: the heater never runs
- *Hygrostat | inside RH above its set point | condensation control in any climate | the sensor drifts high (Chapter 9) or sits in the heater's plume
- Continuous | always | short trials, and sites with no other control | it wastes energy and can overheat the cabinet on hot days
```

CC-7's hygrostat switches the heater on above 65% RH and off below 55%, and a safety thermostat switches it off above 40 °C whatever the humidity. The 10-point differential keeps the heater from cycling every few minutes. The interlock from Chapter 4 blocks the heater while the ventilation fan runs.

## Recovering after the door has been open

A heater sized for steady conditions also has to recover the cabinet after maintenance. With the door open on a humid afternoon, CC-7's air is replaced by outside air in minutes, and its contents cool towards the outside temperature. When the door closes, the heater has to bring the whole cabinet, not just its air, back up to its lift.

This is an illustration. Take CC-7's steel body and fittings as about 60 kg at a specific heat of 460 J/kg·K, and its equipment as about 40 kg at an average of 600 J/kg·K. Its heat capacity is then about 27,600 + 24,000 = **51,600 J/K**. With the outdoor allowance, the cabinet loses about 35.2 W for each kelvin of lift, so its thermal time constant is 51,600 ÷ 35.2 ≈ 1,470 s, about **24 minutes**. With the 250 W heater and the 30 W standby load, the final lift is 280 ÷ 35.2 ≈ 8.0 K, and the cabinet reaches 90% of it after about 2.3 time constants, close to **an hour**.

Two habits follow. Maintenance crews close the door before leaving and leave the heater's circuit live, so recovery starts at once. And maintenance is not left to the end of a humid day if it can be done in the morning, because a cabinet closed at dusk has only an hour of recovery before the night's cooling starts.

## Energy and cost

A heater controlled by a hygrostat runs only when it is needed, and its average power while running is the wall loss at the lift it holds, not its nameplate rating. At PS-7, the logs suggest the hygrostat calls for heat about **10 hours a night on about 250 nights a year**. The average power while it runs lies between the indoor figure of 110.8 W and the outdoor allowance of 251.6 W.

```figure
type: stats
title: CC-7's heater energy over a year
caption: This is an illustration at an assumed electricity price of A$0.33/kWh including GST. The real figure lies between the two bounds and is measured from the heater's logged run hours in Chapter 9.
- 2,500 h | heater running time, 10 h a night on 250 nights
- 277 kWh | at the indoor wall loss of 110.8 W
- 629 kWh | at the outdoor allowance of 251.6 W
- A$91–A$208 | electricity a year, including GST
```

The cost is small against the value of the equipment it protects and the call-outs it avoids, but it is not zero, and heaters left on continuously cost several times more. A heater running all day and night at 250 W would use about 2,190 kWh a year, and would also add 250 W of heat in daytime to a cabinet that already needs a fan to stay below 45 °C.

## The error: a frost thermostat in a humid climate

This is an illustration. Before the investigation described in the earlier chapters, CC-7 already had a 100 W heater, fitted by the panel builder as standard. It was controlled by a thermostat set at **15 °C**, a typical factory setting for frost and low-temperature protection. On PS-7's summer nights the inside air never fell below about 21 °C, so the heater never switched on, during exactly the humid nights when condensation formed. Even in winter, with the inside air at 8.7 °C, the 100 W heater ran flat out and lifted the cabinet only (100 + 30) ÷ 35.2 ≈ 3.7 K with the outdoor allowance, or 7.4 K by the indoor coefficient, not enough to keep the roof above the dew point.

The problem was found when heater run hours were added to the telemetry: over three summer months the heater had logged no running time at all, while the inside relative humidity had exceeded 85% on most nights. Nobody had checked the setting, because a heater was fitted and was assumed to be working.

The heater was replaced by the 250 W fan heater sized above, controlled by a hygrostat with a safety thermostat. The business now specifies the control and its set points, not just the heater, on every enclosure drawing, and treats zero heater run hours during a humid month as a fault.

### Winter at PS-7

The same heater has to work in winter, when the outside air is colder and drier. On a 7 °C, 95% RH winter night, the same 8 K lift holds the inside at 15 °C and about 56% RH, with a dew point of 6.3 °C, so the margin at the roof is far larger than in summer. The heater runs harder in winter because the hygrostat sees a high inside RH more often, but the lift it needs is the same, and its outdoor sizing covers the extra loss. The pit air of Chapter 3 would defeat any reasonable heater, which is why the conduits had to be sealed first: a heater cannot be sized for a source of water, only for a temperature lift.

## Exercise: a stainless steel cabinet

The utility is considering a stainless steel cabinet of the same size for a new site nearer the sea. Using the same 8 K lift, 3.20 m² of exposed area and 30 W of standby dissipation, what heater power does the wall-loss method give indoors and with the outdoor allowance, and what standard heater size would you choose from 100, 150, 250 and 400 W?

**Worked answer.** For stainless steel, k = 3.7 W/m²·K. The wall-loss term is 3.20 × 3.7 × 8 = **94.7 W**. Indoors, the heater needs 94.7 − 30 = **64.7 W**. With the outdoor allowance, 2 × 94.7 − 30 = **159.4 W**. The nearest standard size above that is **250 W**; a 150 W heater would fall just short of the outdoor figure. Since the outdoor allowance is a rule of thumb, a 150 W heater could be trialled and its achieved lift measured on cold, clear nights, as Chapter 9 describes, but the safer choice before measurements exist is the 250 W unit, controlled by a hygrostat so that the larger size costs little extra energy.
