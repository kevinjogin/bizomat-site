---
book: thermoelectric-cooling-by-the-numbers
chapterSlug: the-cabinet-heat-load
order: 6
title: "The cabinet heat load"
description: "Internal heat, heat through the walls, sol-air temperature for sun on the cabinet, what insulation gains and costs, why fans cannot cool below ambient, and a load estimate that left out the walls."
draft: false
---

A cooler is sized for a heat load, and the heat load of a sealed cabinet on a hot day is not just the electronics inside it. Heat also leaks in through the walls, because the outside air is hotter than the inside, and the sun adds more by warming the cabinet's outer surface. On a 45 °C afternoon, those outside contributions can match or exceed the electronics, and they depend on choices the designer makes: where the cabinet is mounted, its colour, and whether it is insulated.

This chapter builds TC-1's design heat load piece by piece, shows what insulation does to it on the hottest day and the rest of the year, uses the enclosure cooling tool to show where plain ventilation stops working, and finishes with a quote for a cooler sized for the electronics alone.

## Heat from inside

The internal load is everything that turns electricity into heat inside the cabinet. For electronics, that is practically all the power they draw, since almost none leaves as anything else; the radio's transmitted power is a fraction of a watt.

```figure
type: compare
title: TC-1's internal heat
cols: Basis | Heat
rowhead: Item
- Station controller with I/O cards | maker's typical dissipation | 12 W
- 4G router | maker's maximum power | 6 W
- Telemetry radio, averaged over its transmit duty | maker's figures | 4 W
- 24 V power supply losses | about 80% efficient at its light 36 W load | 9 W
- Relays, terminals and I/O wiring | estimated from coil and contact data | 6 W
- Battery charger and 12 V battery | maker's float figures | 4 W
- Flow meter converter | maker's figure | 4 W
- * Cooler's internal fan | maker's figure | 3 W
caption: This is an illustration. Electronics 45 W; with the cooler's internal fan, 48 W. Maximum ratings were used where typical figures were not given, so the total errs high.
```

The power supply is easy to overlook. It feeds the controller, the I/O, the router and the radio, about 36 W, and at that light load it is only about 80% efficient, so its losses, 36 ÷ 0.8 − 36 = 9 W, are heat inside the cabinet. The cooler has its own 24 V supply, mounted in the cooler's outer housing beside the hot-side fan so that its losses are released outside, for the reason Chapter 8 explains.

## Heat through the walls

Heat flows through each wall at a rate set by the area, the temperature difference between outside and inside air, and the wall's overall heat transfer coefficient, U, which includes the air films on both faces and any insulation between them.

```figure
type: formula
title: Heat through the walls of a cabinet
formula: Q_walls = U × A × (T_outside − T_inside)
formula: Insulated wall: U = 1 ÷ (1 ÷ U_bare + t_ins ÷ k_ins)
caption: A is the exposed surface area; the back of a wall-mounted cabinet is usually excluded. U_bare is the overall coefficient of the uninsulated steel wall with its air films, about 5.5 W/(m²·K) in still air; t_ins and k_ins are the insulation's thickness and conductivity.
- U | overall heat transfer coefficient, W/(m²·K)
- A | exposed area, m²
```

TC-1's exposed faces are the front, 0.5 × 0.6 = 0.30 m², two sides, 2 × 0.6 × 0.25 = 0.30 m², and top and bottom, 2 × 0.5 × 0.25 = 0.25 m², a total of 0.85 m². Bare, at U = 5.5 W/(m²·K), the walls admit 5.5 × 0.85 = 4.68 W for every kelvin by which the outside air exceeds the inside: 46.8 W at 45 °C outside and 35 °C inside, as much as the electronics.

Lining the walls with 20 mm of closed-cell foam, with a conductivity of 0.035 W/(m·K), adds a resistance of 0.020 ÷ 0.035 = 0.571 m²·K/W to the bare wall's 1 ÷ 5.5 = 0.182, giving U = 1 ÷ 0.753 = 1.328 W/(m²·K). The walls then admit 1.129 W per kelvin, 11.3 W at the design condition, a quarter of the bare figure.

## Sun on the cabinet

TC-1 hangs on the pump shed's south wall under a sunshade hood that keeps direct sun off its top and front for most of the day. Its front still receives sky and ground-reflected radiation, about 190 W/m² on a bright summer afternoon. A surface absorbing radiation warms above the air until the extra heat it loses by convection balances what it absorbs. The temperature that would give the same heat flow into the wall without the sun is the sol-air temperature.

```figure
type: formula
title: Sol-air temperature of a sunlit surface
formula: T_sol-air = T_air + α × G ÷ h_o
caption: α is the surface's solar absorptance, G the solar radiation falling on it and h_o the outside surface heat transfer coefficient. For TC-1's front: 0.6 × 190 ÷ 17 = 6.7 K above the air. Long-wave exchange with the sky is neglected here, which errs slightly high for a vertical face.
- α | solar absorptance, about 0.6 for a light grey powder coat
- G | radiation on the surface, W/m²
- h_o | outside heat transfer coefficient, about 17 W/(m²·K)
```

The front's extra 6.7 K drives an extra 1.328 × 0.30 × 6.7 = 2.7 W through the insulated front, or 11.1 W through a bare one. A dark cabinet, with an absorptance of 0.9, would raise the front's sol-air excess to 10 K; direct afternoon sun at 600 W/m² on an unshaded face would raise it to 21 K. Mounting, shading and colour are the cheapest cooling there is.

## TC-1's design load

```figure
type: stats
title: TC-1's design heat load at 45 °C outside, 35 °C inside
caption: This is an illustration. Insulated with 20 mm of closed-cell foam; light grey; under a sunshade hood on a south wall. The bare cabinet's load on the same day would be about 106 W.
- 48.0 W | electronics and the cooler's internal fan
- 11.3 W | through the insulated walls, 1.129 W/K × 10 K
- 2.7 W | sun on the front, sol-air excess 6.7 K
- 62.0 W | design heat load
- 1.129 W/K | added for every kelvin the cabinet is held below 35 °C
```

The last line matters because the load is not fixed. When the cooler holds the cabinet below its limit, more heat leaks in, which is why Chapters 4 and 5 found the cabinet settling where the heat pumped equals 48 W plus 1.129 W for each kelvin of difference from the outside air.

## What insulation costs

Insulation cut the design load from about 106 W to 62 W, which is why three modules suffice. It has a cost that appears on every other day of the year. A sealed cabinet with 48 W inside and no cooling settles where its walls lose 48 W. Bare, it rises 48 ÷ 4.68 = 10.3 K above the outside air; insulated, 48 ÷ 1.129 = 42.5 K.

```figure
type: compare
title: TC-1 with no cooling: where the sealed cabinet would settle
cols: Bare walls, rise 10.3 K | Insulated walls, rise 42.5 K
rowhead: Outside air
- 10 °C, a winter afternoon | 20.3 °C | 52.5 °C
- 20 °C, a mild day | 30.3 °C | 62.5 °C
- 30 °C | 40.3 °C | 72.5 °C
- 45 °C, design | 55.3 °C | 87.5 °C
caption: This is an illustration for 48 W inside, with the cooler stopped. Without cooling, the insulated cabinet exceeds 35 °C on any day warmer than −7.5 °C outside.
```

The bare cabinet needs cooling only when the outside air is above about 25 °C. The insulated cabinet needs its cooler running all year, and if the cooler fails on a mild day the cabinet passes its limit within an hour or two. Insulation makes the cooler a single point of failure. The trust accepted that for two reasons: the cooler's power on mild days is small, because its modules work across a small or even reversed temperature difference at a high COP, and the controller raises an alarm through the telemetry radio whenever the cabinet passes 36 °C, which a technician can answer within a day. Chapter 9 puts numbers on the cooler's reliability. A middle course, insulating only the faces that see the sun and the hot air most, the front and top, would cut most of the design-day load while letting the sides and bottom shed heat on mild days; the trust kept full insulation because the shaded sides gain little on cool days and the alarm covers the risk.

## Checking the load by measurement

An estimate built from data sheets and textbook coefficients should be checked on the real cabinet, and a sealed cabinet makes that easy. With the cooler off and its openings blanked, the electronics' own heat warms the cabinet until the walls lose as much as is generated. The steady rise above the outside air, divided into the known internal heat, gives the walls' actual U × A directly.

The trust ran the test overnight in the workshop at a steady 18 °C, with the electronics powered from a bench supply whose meter showed 45 W, plus a 3 W resistor standing in for the cooler's internal fan. After about five hours the cabinet air settled at 59.5 °C, a rise of 41.5 K. That gives U × A = 48 ÷ 41.5 = 1.157 W/K, about 2.5% more than the calculated 1.129 W/K, a difference easily explained by the gasket, cable glands and the cooler's mounting cut-out, all of which conduct a little more than foam. The design load at 45 °C outside, recalculated with the measured figure, is 48 + 11.6 + 2.7 = 62.3 W, still within the cooler's 66.4 W.

The test also checks something an estimate cannot: whether the electronics really give off what their data sheets imply. Here the bench supply's meter confirmed it. A cabinet whose measured rise is much larger than expected has either more heat inside than assumed or worse walls, and both are worth knowing before the cooler is ordered.

## Margin and growth

CC-1 pumps 66.4 W against a design load of 62 W, a margin of about 7%. That margin has to cover several things at once: errors in the estimate, the slow fouling of the sinks that Chapter 5 described, ageing of the modules, a hotter day than the design day, and equipment added to the cabinet later. In practice, the last is the most likely. Telemetry cabinets accumulate equipment: a second radio, a camera's power supply, a larger router. Each watt added inside is a watt the cooler must pump, plus about 1.2 W more electricity to pump it at CC-1's COP of 0.865, all of which the hot-side sink must also reject.

The trust handles growth with a rule in the cabinet's drawing: any equipment added must be listed with its dissipation and the total checked against the cooler's capacity at 45 °C outside. Where the total exceeds about 60 W, the options are to move the new equipment to a separate ventilated enclosure, if it tolerates outside air temperatures, or to fit a larger cooler. The rule costs nothing and prevents the commonest cause of cabinet overheating, which is not a failed cooler but a cooler asked to carry more than it was sized for.

## Why a fan cannot do it

The cheapest way to cool a cabinet is to blow outside air through it with a filtered fan. The [enclosure cooling airflow tool](/tools/enclosure-cooling-airflow/) sizes that fan: it subtracts the heat the walls lose from the heat inside and calculates the airflow needed to carry the rest away within the allowed rise.

Entering TC-1's 48 W, the insulated walls' 1.328 W/(m²·K) and 0.85 m², and a 35 °C inside limit, with 30 °C outside, the tool finds that the walls lose 6 W, the fan must remove 42 W, and 26.2 m³/h of air does it with a 5 K rise. At 20 °C outside it needs only 6.4 m³/h. At 45 °C outside the tool refuses to calculate: the inside limit must be above the outside air for a fan to cool. No amount of outside air can bring a cabinet below the temperature of that air.

That refusal is the reason for CC-1. A fan would also break the cabinet's IP66 seal and, at the pump station, pull in the same dust and chaff that fouled CC-1's external sink in Chapter 5, this time onto the electronics. Thermoelectric cooling keeps the cabinet sealed: only heat crosses its wall.

## The mistake: a cooler sized for the electronics

The trust's first request for quotes described the cabinet's contents and their 45 W and asked for a cooler to hold 35 °C at 45 °C outside. The lowest quote offered a 50 W thermoelectric cooler, with a margin of 5 W over the stated load.

```figure
type: steps
title: Adding the walls and the sun to the load
caption: This is an illustration. The quote answered the question that was asked; the question left out more than half the load.
- Load in the request for quotes | 45 W of electronics
- Quoted cooler | 50 W at 45 °C outside and 35 °C inside
- Review: walls of the bare cabinet | 4.68 W/K × 10 K = 46.8 W
- Review: sun on the front and the cooler's own fan | 11.1 W and 3 W
- * Bare cabinet's true design load | about 106 W, more than twice the quote
- Decision | insulate the cabinet, bringing the load to 62 W, and re-quote with the full load breakdown
```

Before an order was placed, the reliability engineer added the walls, the sun and the cooler's own internal fan, and found a design load of about 106 W for the bare cabinet, more than twice the quoted cooler's capacity. On a 45 °C day the 50 W cooler would have let the cabinet climb until the walls' extra loss closed the gap, far above 35 °C. Rather than buy a 110 W cooler, the trust lined the cabinet with foam, bringing the load to 62 W, and re-issued the request with the full breakdown. Every later quote was compared on its heat pumped at 45 °C outside and 35 °C inside.

## Exercise: a darker cabinet in the sun

A second station's identical cabinet is dark green, with a solar absorptance of 0.9, and hangs on a west wall without a hood. On the design afternoon, its front receives 600 W/m² of direct and diffuse sun and its top 700 W/m². It is insulated like TC-1. Calculate the sol-air excess on the front and the top, taking h_o = 17 W/(m²·K), the extra heat through those two faces, and the design load. Then say whether CC-1 can cool it.

### Answer

**Given:** α = 0.9; front 0.30 m² at 600 W/m²; top 0.125 m² at 700 W/m²; U = 1.328 W/(m²·K); h_o = 17 W/(m²·K); internal 48 W; walls 11.3 W at 10 K.

**Assumptions:** sol-air method; long-wave exchange to the sky neglected; other faces shaded.

**Method:** sol-air excess αG ÷ h_o on each face; extra heat U × A × excess; sum with the internal and wall loads.

**Front:** excess = 0.9 × 600 ÷ 17 = 31.8 K; extra heat = 1.328 × 0.30 × 31.8 = 12.7 W.

**Top:** excess = 0.9 × 700 ÷ 17 = 37.1 K; extra heat = 1.328 × 0.125 × 37.1 = 6.2 W.

**Design load:** 48 + 11.3 + 12.7 + 6.2 = 78.2 W.

**Can CC-1 cool it?** CC-1 pumps 66.4 W with the cabinet at 35 °C and 45 °C outside. Against 78.2 W, the cabinet would settle above its limit. Chapter 5's method, with the additional 18.9 W of solar load, gives a settling temperature of about 39 °C.

**Interpretation:** the sun on a dark, unshaded cabinet adds nearly 19 W, more than the insulated walls. A sunshade hood and a light colour bring the load back to TC-1's 62 W and let the standard cooler serve both stations. Painting and shading cost less than a fourth module and its larger sink.

**Verification:** the front's extra heat on TC-1, 2.7 W at a 6.7 K excess, scales to 12.7 W at 31.8 K in the ratio 31.8 ÷ 6.7 = 4.7, as calculated.
