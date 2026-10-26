---
book: cooling-towers-by-the-numbers
chapterSlug: what-a-cooling-tower-does
order: 1
title: "What a cooling tower does"
description: "See how a tower cools water by evaporating a little of it, what range, approach and wet-bulb mean, why it can cool below the air temperature, and catch a chiller nearly bought for a job a tower does."
draft: false
---

A cooling tower brings warm water from a plant into close contact with outside air. The water is spread into thin films or droplets over a large surface, air is drawn through, and a small fraction of the water evaporates. Evaporation takes a great deal of heat, about 2,400 kJ for every kilogram of water at the temperatures a tower works at, and that heat comes mostly from the water left behind, which cools. A tower therefore rejects heat mainly as water vapour, not as warmed air, and its limit is set not by the air's temperature but by how much more moisture the air can take up, which the wet-bulb temperature measures.

This chapter explains the heat balance of a tower, defines the three temperatures that describe its performance, range, approach and wet-bulb, shows why a tower can deliver water colder than the air around it, and introduces the running case. It finds that the plant's first brief for its cooling water, 29 °C water on 35 °C days, was read as a job only a refrigeration chiller could do, and that a chiller was nearly bought for a duty a tower does with about a tenth of the power.

## The heat balance

The water side of a tower is a simple energy balance. The plant heats a flow of water; the tower cools the same flow back down; in steady operation, the heat rejected equals the plant's heat load.

```figure
type: formula
title: Heat rejected by a tower, and the water it evaporates
formula: Q = m_w × c_p × (T_hot − T_cold);   evaporation ≈ Q ÷ h_fg
caption: This is an illustration for CT-250 at its design point, with water's specific heat about 4.18 kJ/(kg·K) and a latent heat of evaporation about 2,430 kJ/kg near 30 °C. The evaporation estimate is a simplification that Chapter 5 refines.
- Q | Heat rejected, kW
- m_w | Circulating water flow, kg/s
- T_hot, T_cold | Water temperatures entering and leaving the tower, °C
- h_fg | Latent heat of evaporation, kJ/kg
step: m_w ≈ 250 ÷ (4.18 × 5) ≈ 11.96 kg/s, about 12 L/s or 43 m³/h
step: Evaporation ≈ 250 ÷ 2,430 ≈ 0.103 kg/s, about 0.37 m³/h
step: About 0.9% of the circulating flow evaporates, carrying away nearly all the heat
```

The striking number is the last one: evaporating less than 1% of the water removes the plant's whole heat load. That is why towers use so much less water than once-through cooling, which would need the whole flow, and so much less energy than refrigeration, which must pump the heat uphill. It is also why a tower's water consumption is best thought of as a heat-rejection cost: roughly a fixed number of litres for every kilowatt-hour of heat the plant sends to it, plus the blowdown that the water chemistry requires.

## Range, approach and wet-bulb

Three temperatures describe a tower's duty.

- The **range** is the difference between the hot water entering and the cold water leaving: the water's temperature drop through the tower. It is set by the plant's heat load and the water flow, not by the tower.
- The **wet-bulb temperature** is the temperature a wetted thermometer reaches in moving air, when evaporation from its wet wick has cooled it as far as the air's humidity allows. It is the lowest temperature evaporation can reach in that air.
- The **approach** is the difference between the cold water temperature and the wet-bulb temperature: how close the tower brings the water to that limit. It is set by the tower's size and air flow.

```figure
type: compare
title: CT-250's design temperatures
cols: Temperature | What sets it
caption: This is an illustration. The design wet-bulb of 24 °C corresponds, for example, to air at 35 °C and about 40% relative humidity, as Chapter 2 calculates.
- Hot water entering | 34 °C | The plant's heat load added to the cold water
- *Cold water leaving | 29 °C | The wet-bulb plus the tower's approach
- Range | 5 K | Heat load ÷ (water flow × c_p)
- Approach | 5 K | The tower's size, air flow and fill
- Design wet-bulb | 24 °C | The site's summer climate
- Air dry-bulb on the design day | 35 °C | Weather; not the tower's limit
```

The approach can never reach zero: water cannot be cooled to the wet-bulb temperature by a finite tower, just as an exchanger cannot reach a zero approach. Smaller approaches need disproportionately larger towers, the same diminishing returns that Chapter 2 of *Heat Exchangers by the Numbers* shows for close-approach exchangers. Typical industrial towers are selected for approaches of a few kelvin, a balance between the tower's cost and the value of colder water to the plant.

## Why a tower can cool below the air temperature

An ordinary air-cooled radiator can only cool a fluid towards the air's **dry-bulb** temperature, the reading of an ordinary thermometer, and never below it. A cooling tower is different because it cools by evaporation. On a hot, dry day, the air at 35 °C can still take up a lot of moisture, and water evaporating into it can cool itself well below 35 °C, towards the wet-bulb of about 24 °C. CT-250's 29 °C water on such a day is 6 K below the air temperature, and the tower does it with nothing but a fan and a pump.

On a humid day, the wet-bulb is closer to the dry-bulb, the air can take up less moisture, and the tower's cold water is warmer. A tower's performance therefore depends on the weather's humidity as much as its temperature, which is why towers in humid coastal climates are larger, for the same duty, than towers in dry inland ones.

## The running case: CT-250

This is an illustration. CT-250 is an open, induced-draught, counterflow tower. Warm water from the plant is sprayed over a bank of **fill**, sheets of formed plastic that spread it into thin films, and runs down through it into a **basin**; a fan at the top draws air up through the fill, against the falling water, and out past **drift eliminators**, which catch droplets before the air leaves. The basin's cold water is pumped back to the plant. The tower serves:

- two hydraulic press oil coolers, each rejecting 35 kW, one of them the OC-35 that *Heat Exchangers by the Numbers* follows;
- two air compressors, each rejecting about 30 kW;
- a water-cooled chiller for the moulding machines, rejecting about 120 kW from its condenser.

The total is 250 kW, and the tower circulates about 12 L/s, cooled from 34 °C to 29 °C at a design wet-bulb of 24 °C.

## The error: a chiller for a tower's job

This is an illustration. When the plant was planned, its brief asked for cooling water at 29 °C "on 35 °C summer days". A member of the project team, reasoning that no device could cool water below the air's temperature without refrigeration, concluded that the cooling water needed a chiller, and a quotation was obtained for a chiller sized to reject the plant's 250 kW.

The reasoning confused the dry-bulb temperature, 35 °C, with the limit that matters for evaporative cooling, the wet-bulb, about 24 °C on the design day. A tower selected for a 5 K approach delivers 29 °C water on that day with a fan of a few kilowatts. A chiller doing the same job would need a compressor of the order of 60 kW at a typical efficiency, and it would still need somewhere to reject its own heat, about 310 kW in all, usually to a tower anyway.

```figure
type: bars
title: Power to deliver CT-250's 250 kW of cooling at 29 °C on the design day, kW
unit: kW
max: 70
caption: This is an illustration. The chiller figure assumes a coefficient of performance of about 4, so about 62.5 kW of compressor power, before its own heat-rejection fans or pumps. The tower figure is its fan.
- Chiller compressor, illustrative | 62.5
- *Cooling tower fan, CT-250 | 5.5
```

The check that caught it was a request for the site's design wet-bulb temperature, which the brief had not given. With it, the duty was a routine tower selection. The project team cancelled the chiller quotation and selected a tower. The general lesson is that evaporative cooling is limited by the wet-bulb temperature, and that a cooling water specification without a wet-bulb is incomplete, because the dry-bulb alone says nothing about what a tower can do.

## Where the heat actually goes

The estimate that evaporation equals the heat load divided by the latent heat assumes all the heat leaves as vapour. In reality, the air also exchanges sensible heat with the water. On a cool day, the air entering is colder than the water and is warmed as it passes through, carrying some heat away as sensible heat, so less water evaporates than the simple estimate says. On a hot, dry day like CT-250's design day, the air entering at 35 °C is hotter than the water, so the air is cooled as it passes through the tower, giving its sensible heat to the water; that heat must also be removed by evaporation, and more water evaporates than the simple estimate says.

This is an illustration. A calculation on the air side of CT-250 at its design point, with air entering at 35 °C and 40% relative humidity and leaving nearly saturated at about 29.5 °C, gives an evaporation of about 0.12 kg/s, against the simple estimate of about 0.103 kg/s. Over a year of mixed weather the two effects partly cancel, and the simple estimate is a reasonable basis for annual water planning, but peak summer evaporation can exceed it noticeably. Chapter 5 uses both.

## Compared with once-through cooling

Before towers were common, plants often cooled with water taken from a river or the town supply, passed once through their equipment and discharged. CT-250's duty would need the whole circulating flow, about 43 m³/h, to be taken and discharged warm, more than 1,000 m³ in a 24-hour day at full load. With a tower, the plant takes only its makeup water, the evaporation plus the blowdown of Chapter 5, about half a cubic metre an hour at full load in this illustration. Once-through cooling with town water is now rare, largely because of the water it wastes and what that water costs, and any such use is subject to the local water authority's rules. The tower's evaporation, though large in absolute terms, is a small fraction of what once-through cooling would waste.

## The parts that matter

Beyond the fill, fan and eliminators, a few humble parts decide whether a tower works. The **basin** holds the cold water and must be large enough to stop the pump drawing air, clean enough not to collect sludge, and covered or shaded to limit sunlight, which feeds algae. A **makeup valve**, usually float-operated or level-controlled, replaces the water lost. A **bleed** or blowdown connection removes concentrated water. A **strainer** or side-stream filter catches debris before it reaches the plant's exchangers, which Chapter 8 of *Heat Exchangers by the Numbers* shows can be decisive. And **access** for inspection and cleaning, with safe platforms and isolations, is what makes the maintenance of Chapter 7 practical.

## Types of tower

Towers come in several arrangements, each with its uses.

- **Counterflow** towers, like CT-250, pass the air up against the falling water; they are compact in plan and thermally efficient.
- **Crossflow** towers pass the air horizontally across the falling water; they are taller in plan, easier to inspect and maintain, and gravity-fed from open distribution basins.
- **Induced-draught** towers have their fans at the air outlet, drawing air through; **forced-draught** towers blow air in at the bottom. Induced draught gives more even air distribution and throws the warm, moist exhaust higher, which helps against recirculation, as Chapter 9 shows.
- **Closed-circuit** towers, or evaporative fluid coolers, pass the process fluid through a coil inside the tower and spray water over the outside, so the process water never touches the air. They keep the process loop clean at the cost of a larger, costlier unit and a slightly wider approach.
- **Dry coolers**, air-cooled exchangers without evaporation, use no water but can only approach the dry-bulb temperature, so they cannot deliver CT-250's 29 °C on a 35 °C day.

## Why towers need care

The features that make a tower effective also make it demanding. Evaporation concentrates the dissolved salts in the remaining water, so water must be bled off and replaced, the subject of Chapter 5. Contact with outside air brings dust, debris and microorganisms into the water, and the warm, wet, aerated tower is a good environment for biological growth, including Legionella bacteria, which Chapter 7 addresses. The water needs treatment, as Chapter 6 describes, to prevent scale, corrosion and fouling in the tower and in every exchanger it serves. A tower is therefore a system to be managed, not only a machine to be bought, and its running costs, in water, chemicals, energy and the qualified people who must inspect and test it, belong in the decision to install one as much as its purchase price does.

## Exercise: a humid day

On a humid summer day, the air is 30 °C with a relative humidity of about 60%, a wet-bulb of about 23.8 °C, close to the design value. If CT-250's approach at that wet-bulb is about 5 K, what cold water temperature does it deliver, and how far below the air's dry-bulb is it? What does that say about using the dry-bulb temperature to judge a tower?

**Worked answer.** The cold water is about 23.8 + 5 ≈ **28.8 °C**, about **1.2 K below** the 30 °C air. On the design day, at 35 °C and 40% relative humidity, the same tower delivered 29 °C water, 6 K below the air.

The cooler, more humid day produces almost the same cold water as the hotter, drier design day, because their wet-bulb temperatures are almost the same. The dry-bulb temperature, which most people notice, tells almost nothing about a tower's performance; the wet-bulb tells nearly everything about what the tower can deliver.
