---
book: distribution-transformers-by-the-numbers
chapterSlug: heat-cooling-and-the-hot-spot
order: 6
title: "Heat, cooling and the hot spot"
description: "How losses become oil and winding temperatures, how to estimate top-oil and hot-spot temperatures at any load, and how to size a substation room's ventilation."
draft: false
---

Every watt of a transformer's losses ends up as heat in its core and windings, and it must find its way out through the oil, the tank and the radiators to the air. The temperatures along that path decide how much load the transformer can carry and, as Chapter 7 shows, how quickly its insulation ages. The temperature that matters most is the hottest point in the windings, the hot spot, which nobody can see in an ordinary distribution transformer and which must therefore be estimated.

This chapter follows TX-1's heat from the windings to the air. It explains natural oil cooling, sets out a simple model of the top-oil and hot-spot temperatures that follows from the physics of natural convection, and applies it to the plant's loads with and without the freezing tunnel. It then sizes the ventilation of TX-1's substation room with the BIZOMAT enclosure cooling tool, and ends with a set of clogged filters that turned a cool room into a warm one.

## How an ONAN transformer cools

TX-1 is cooled ONAN: Oil Natural, Air Natural. Oil heated by the core and windings rises through ducts between the winding layers and discs, collects at the top of the tank, flows into the radiators, cools as it sinks through them and returns to the bottom of the tank. Nothing pumps it: the flow is driven by the oil's lower density when hot. Outside the radiators, air warmed by them rises and is replaced by cooler air from below, again with nothing to drive it but buoyancy. Larger transformers add fans on the radiators (ONAF) and pumps in the oil circuit (OFAF) to carry more load in the same tank.

The temperatures along the path build up in steps. The bottom oil is a little above the surrounding air, the top oil is hotter, the average winding hotter again, and somewhere near the top of the windings, where the oil arriving is hottest and the leakage field concentrates eddy losses, is the hot spot.

```figure
type: steps
title: TX-1's temperatures at rated load in 30 °C air, from its test report
caption: This is an illustration. Top-oil rise and winding gradient from the 1996 test report. The hot-spot factor of 1.3, which scales the average gradient up to the hottest point, is an assumed typical value for a distribution transformer; the maker can give the design value.
- Surrounding air | 30 °C
- Top-oil rise at rated load | +52 K
- Top oil | 82 °C
- Average winding gradient over the oil | 14 K
- Hot-spot gradient, 1.3 × 14 | +18.2 K
- * Hot spot | about 100 °C
```

## How temperatures change with load

At other loads the temperatures change because the losses change. The top-oil rise depends on the total loss, core plus load loss. The winding gradient depends on the load loss alone, since it is the heat generated in the winding that must cross into the oil.

Neither rises in simple proportion to the heat, because the oil and air move faster when they are hotter and so carry heat more effectively. For natural convection, the heat-transfer coefficient rises roughly with the quarter power of the temperature difference, so the heat carried rises with the 1.25 power of the temperature difference, and the temperature difference with the 0.8 power of the heat. Applying that to the oil and to the windings gives a simple steady-state model, of the same form as those used in transformer loading guides.

```figure
type: formula
title: Steady-state top-oil and hot-spot temperatures at load K
formula: Δθ_oil = Δθ_oil,rated × [(1 + R × K²) ÷ (1 + R)]^0.8
formula: Δθ_hs = H × g_rated × K^1.6
formula: θ_hot spot = θ_air + Δθ_oil + Δθ_hs
caption: K is the load as a fraction of rated, R the ratio of load loss to no-load loss at rated load (16.5 ÷ 2.40 = 6.875 for TX-1), Δθ_oil,rated the rated top-oil rise, g_rated the rated average winding gradient and H the hot-spot factor. The exponents follow from natural convection, as explained above; loading guides give values for each cooling type, and the maker's data should be used where available.
- K | load ÷ rating
- R | 6.875 for TX-1
- 0.8, 1.6 | natural-convection exponents
```

The model is deliberately simple, and it is worth knowing where it is weak. It treats the oil as one body with one top temperature, while real oil stratifies, and it assumes the hot spot sits a fixed factor above the average winding gradient, while the true factor depends on the winding's design and the oil ducts. Its exponents are good for natural cooling over the normal working range but less so at very light loads, where the oil hardly moves, or at heavy overloads, where viscosity falls and flow speeds up more than the simple rule expects. Its real strength is that it scales known test results to other loads, so it is only as good as the test report it starts from. For an old transformer like TX-1, a few days of measured top-oil temperatures at known loads are a valuable check on it, and the plant's logging confirmed the model's top-oil values within about 3 K.

## The case: TX-1 with and without the tunnel

The plant's loads give four points to check: the night load, today's peak, the production load with the tunnel and the tunnel peak. The surrounding air is the air in the substation room, not outdoors, and the room runs warmer than outside because the transformer heats it. On a typical day the room is at about 26 °C; on a hot summer afternoon, with 30 °C outside and the room's ventilation working as designed, at about 38 °C.

```figure
type: compare
title: TX-1's steady-state temperatures at the plant's loads
cols: Total loss | Top-oil rise | Hot-spot gradient | Hot spot, room at 26 °C | Hot spot, room at 38 °C
rowhead: Load
- Night, 650 kVA | 5.50 kW | 19.4 K | 4.8 K | 50.1 °C | 62.1 °C
- Today's peak, 1,175 kVA | 12.52 kW | 37.4 K | 12.3 K | 75.7 °C | 87.7 °C
- With tunnel, 1,300 kVA | 14.79 kW | 42.7 K | 14.5 K | 83.2 °C | 95.2 °C
- * Tunnel peak, 1,520 kVA | 19.34 kW | 53.0 K | 18.6 K | 97.6 °C | 109.6 °C
caption: This is an illustration. Steady-state values from the model above with TX-1's test report data and H = 1.3. The tunnel peak lasts about two hours, less than the several hours the oil takes to reach a steady temperature, so these values overstate the real peak somewhat, which makes them a safe estimate.
```

At the tunnel peak on a hot afternoon, TX-1's hot spot would reach about 110 °C. That is above the roughly 100 °C it reaches at rated load in 30 °C air, which is where its design temperatures sit, but only for about two hours a day. Whether that matters depends on how fast the insulation ages at those temperatures, which is the subject of Chapter 7.

The oil's thermal time constant matters here. A distribution transformer's oil and tank take a few hours to approach a new steady temperature after a change of load; the windings follow within minutes. A two-hour peak therefore never brings the top oil to its full steady-state value, and the real hot spot at the end of the peak is a few kelvin below the table's. Loading guides give methods for following the temperatures through a daily cycle; the steady-state values are a sound upper bound for a first check.

## Tank and radiators

The heat reaches the air through the tank walls and, mostly, through the radiators bolted to them. Their size follows from a simple balance. At rated load TX-1 loses 2.40 + 16.5 = 18.9 kW. If the oil in the radiators averages about 40 K above the surrounding air, the tank and radiators together must pass 18,900 ÷ 40 = 473 W for each kelvin of difference. With natural convection and radiation from painted steel together worth roughly 10 W per square metre per kelvin, that calls for about 47 m² of effective surface, which is why a 1,500 kVA transformer carries a bank of deep, closely spaced radiator panels rather than relying on its plain tank.

Three things erode that surface over the years. Dust and grime on the fins insulate them and block the air between them, so radiators in a dusty room need cleaning. Paint matters less than people think for convection but does affect radiation: most paints, whatever their colour, radiate well at these temperatures, but bare galvanised or metallic finishes radiate poorly. And a radiator whose isolating valves have been left closed after maintenance, or whose top header has an air lock, does nothing at all, which the next section shows how to find.

## Measuring temperatures on site

The oil temperature indicator on TX-1's tank has a red drag pointer that follows the needle up and stays at the highest reading until reset, so a glance during the morning round shows the highest top-oil temperature since the last reset. Recording it daily, with the reset, gives a cheap long-term record of how hard the transformer is working.

A thermal camera gives more. The radiators should be warm at the top and cooler at the bottom, by roughly the oil's temperature drop through them, and every radiator should look the same. A radiator that is cold all over is not circulating, usually because a valve is shut. A radiator that is hot at the top but cold for most of its height may have an air lock or sludge. Bushings and LV connections that are much hotter than their neighbours show high-resistance joints, which Chapter 10 discusses.

Thermometers in the room's air at the intake and near the radiators' top, logged for a few weeks in summer, close the loop: they show whether the room is behaving as the ventilation calculation assumed. It was such a logger that found the clogged filters.

## Short-term overloads

A transformer's rating is a continuous rating at a stated ambient temperature, and because its oil heats slowly it can carry more than its rating for a few hours, especially if it was lightly loaded beforehand and the air is cool. Loading guides set out how to calculate such overloads from the transformer's thermal characteristics, with limits on the hot-spot and top-oil temperatures and on the current. Other parts set limits too: bushings, internal leads, the tap changer and the LV cables and breakers all have current ratings of their own, and a transformer loaded beyond its nameplate may be limited by one of them before its windings. Planned overloading of an old transformer should be agreed with its maker or a specialist, with its condition known from oil tests.

## The substation room

TX-1 stands in a brick room with intake louvres low on one wall and an extraction fan high on the opposite wall, rated 9,000 m³/h. Everything the transformer loses must leave the room, partly through its walls and roof and mostly in the ventilation air, and the room's temperature rises until the two balance. The LV switchboard in the same room adds about 1.5 kW at peak.

The [enclosure cooling airflow tool](/tools/enclosure-cooling-airflow/) works out the heat lost through an enclosure's surface from a wall heat transfer coefficient, the heat a fan must remove, and the airflow needed to remove it at an allowed temperature rise, and compares the airflow with the fan's. It is written for cabinets, but the physics is the same for a room: heat in, heat out through the walls, the rest carried by air from outside at the outside temperature.

```figure
type: compare
title: Ventilation of TX-1's room for an 8 K rise over 30 °C outside air
cols: Heat in the room | Lost through the walls | For the fan to remove | Airflow needed | Fan delivers
rowhead: Load
- Today's peak, 1,175 kVA | 14.0 kW | 1.2 kW | 12.8 kW | 4,950 m³/h | 9,000 m³/h
- * Tunnel peak, 1,520 kVA | 20.8 kW | 1.2 kW | 19.6 kW | 7,582 m³/h | 9,000 m³/h
caption: This is an illustration. Enclosure cooling airflow tool with 60 m² of wall and roof at 2.5 W/(m²·K), air density 1.16 kg/m³ and specific heat 1.005 kJ/(kg·K); heat is the transformer's total loss plus 1.5 kW from the switchboard. The fan's 9,000 m³/h must be its delivery against the louvres and filters as installed, not its free-air rating.
```

The fan is adequate for the tunnel peak, with about 19% to spare, as long as it delivers its rated airflow. That margin is thinner than it looks, because a fan's delivery falls as its filters load with dust and its blades collect grime, and because the hottest afternoons are exactly when the margin is needed. The room's air path matters as much as the fan: intake low and exhaust high, on opposite sides, so that the cool air sweeps past the radiators before it leaves, rather than short-circuiting from one louvre to the fan without passing the transformer.

## When it goes wrong: the clogged filters

During the first hot spell after the tunnel was commissioned, a temperature logger left in TX-1's room recorded 43 °C in the late afternoon with 30 °C outside, five kelvin more than the design. The fan was running. A maintenance electrician measured the airflow across the intake louvres with a vane anemometer and found about 4,500 m³/h, half the fan's rating. The louvres' filter pads, fitted years before to keep out dust, were thick with dust and pollen, and the fan, working against the extra resistance, delivered far less air.

With 4,500 m³/h and the same 20.8 kW of heat, the room settles where the heat lost through the walls and carried by the air equals the heat produced: 30 + 20,843 ÷ (2.5 × 60 + 1.16 × 1,005 × 4,500 ÷ 3,600) = 43.0 °C. At the tunnel peak the hot spot would then reach about 114.5 °C instead of 109.6 °C, and Chapter 7 shows that the insulation ages almost twice as fast at that temperature.

The filters had last been cleaned three years earlier, when someone remembered them, and nobody had connected them with the transformer. They cost a few dollars each. The heat they trapped in the room was costing insulation life on every hot afternoon, invisibly, and would have kept doing so after the new transformer arrived.

```figure
type: checklist
title: Keeping TX-1's room cool
caption: This is an illustration. The plant added the pressure gauge and the alarm after the event.
- x Intake filters cleaned every three months and replaced yearly
- x Differential pressure gauge across the filters, with a marked "clean me" level
- x Room temperature alarm to the control room at 40 °C
- x Fan airflow measured each year with an anemometer and recorded
- x Nothing stored in the room that blocks the air path past the radiators
- ? Consider a second fan, run on temperature, when the replacement transformer is installed
```

## Exercise: a cooler room

The plant would like the room to stay at 36 °C at the tunnel peak on a 30 °C afternoon, giving the transformer 2 K more margin.

1. What airflow is needed?
2. Is the existing 9,000 m³/h fan enough?
3. What hot spot would TX-1 reach at the tunnel peak in a 36 °C room?

**Answer.**

1. The [enclosure cooling airflow tool](/tools/enclosure-cooling-airflow/) with 20,843 W, 30 °C outside, 36 °C inside, 60 m² at 2.5 W/(m²·K) gives 900 W through the walls, 19,943 W for the fan and 10,264 m³/h of air.
2. No: 9,000 m³/h is short by about 1,260 m³/h. A second fan, or a larger one with the louvres enlarged to suit, would be needed.
3. 36 + 53.0 + 18.6 = 107.6 °C, two kelvin below the 38 °C room's 109.6 °C. Whether two kelvin is worth a second fan is a question for Chapter 7, which puts a rate of ageing on each kelvin.
