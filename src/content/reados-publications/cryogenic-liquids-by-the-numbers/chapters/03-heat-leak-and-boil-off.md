---
book: cryogenic-liquids-by-the-numbers
chapterSlug: heat-leak-and-boil-off
order: 3
title: "Heat leak and boil-off"
description: "Turn a vessel's normal evaporation rate into watts, calculate a foam bath's heat leak with a mean conductivity, bound the open-lid loss by radiation, and find a bath left open between jobs."
draft: false
---

Every cryogenic vessel loses liquid all the time, because no insulation stops heat completely and every watt that gets in boils some liquid away. The loss is easy to calculate once it is expressed in watts: one watt boils 3.6 kJ of heat an hour, which is 18 g of liquid nitrogen at atmospheric pressure. The rest of this chapter is about where the watts come from and how to count them.

It turns SF-180's cylinder rating into a heat leak, calculates the heat leak of the foam-insulated bath with the BIZOMAT layered-wall tool, using a conductivity averaged over the temperature range, bounds the extra loss when the lid is open with the radiant heat tool, and ends with a weighing that showed where the station's nitrogen was really going.

## Watts and kilograms

The conversion between heat leak and boil-off follows from the latent heat. At atmospheric pressure, liquid nitrogen absorbs 199.2 kJ/kg as it boils, so:

```figure
type: formula
title: Boil-off from a heat leak, liquid nitrogen at 101.325 kPa
formula: ṁ (kg/h) = Q (W) × 3.6 ÷ 199.2 = 0.01807 × Q
formula: V̇ (L/h) = ṁ ÷ 0.806 = 0.02242 × Q
caption: Latent heat and density from NIST. At a vessel's own pressure, use the latent heat at that pressure (190.5 kJ/kg at 100 kPa gauge).
- 1 W | 18.1 g/h, 22.4 mL/h, 0.43 kg/day
- 10 W | 0.18 kg/h, 4.3 kg/day
- 100 W | 1.8 kg/h, a full 26 L bath in about 12 hours
```

The numbers are small per watt and large per day, which is the pattern of all cryogenic losses. A heat leak that would not warm a cup of tea boils off a bucketful of liquid nitrogen in a week.

## The cylinder's rating

Makers of cryogenic vessels state their thermal performance as a normal evaporation rate (NER): the fraction of the full contents that boils away in a day with the vessel standing still, vented to atmosphere, under stated ambient conditions. It includes every path into the inner vessel at once: radiation across the vacuum space through the multilayer insulation, conduction along the neck and the supports, and conduction along the pipes and valves.

This is an illustration. SF-180's cylinder has an NER of 2.0% a day on its 140 kg fill:

```figure
type: steps
title: SF-180's cylinder heat leak from its normal evaporation rate
caption: This is an illustration. The NER is the fictional maker's figure; latent heat from NIST at 101.325 kPa, because NER is measured with the vessel vented.
- Boil-off | 0.020 × 140 kg = 2.8 kg a day
- Volume | 2.8 ÷ 0.806 = 3.47 L a day
- Heat | 2.8 × 199.2 = 557.7 kJ a day
- * Heat leak | 557,700 ÷ 86,400 s = 6.46 W
- Over a four-day shutdown | 11.2 kg, 8% of a full cylinder
```

Six and a half watts is about the power of a small night light, spread over the whole of a vessel the size of a wheelie bin. That figure is the result of a vacuum space and many layers of reflective insulation, and it is why a liquid cylinder can hold nitrogen for weeks while an open bucket would lose it in hours.

A closed cylinder does not vent its 2.8 kg a day at first. With its valves shut, the boil-off stays inside and raises the pressure, as Chapter 8 calculates, until the relief valve opens. From then on the cylinder loses about its NER for as long as it stands. An unused cylinder therefore loses nitrogen whether it vents or not: either as gas through the relief valve, or as a rise in pressure that later flashes away in a transfer.

## The NER as a health check

The NER is also a test. A cylinder whose vacuum has deteriorated, through a slow leak or outgassing, can lose several times its rated amount, and its outer jacket shows it: cold spots, sweating or frost on the jacket away from the valves are signs of lost vacuum. The simple test is to weigh the cylinder at the start and end of a period with no withdrawals, such as a weekend with the gas-use valve open to a safe vent, and compare the loss with the NER. A loss of about the rated amount means the vessel is healthy. A loss of twice the rating or more is a matter for the supplier, who owns most liquid cylinders and is responsible for their condition.

## Conduction through the bath's foam

SF-180's bath is a different kind of vessel. It has no vacuum; it relies on 100 mm of rigid polyurethane foam around a thin stainless liner. Heat flows from the room, through a thin film of air on the outside, through the foam and the liner, into the liquid. The liner's resistance is negligible, and the liquid side's boiling film is a very small resistance, so the foam and the outer air film do almost all the work.

The foam's conductivity is not constant. NIST's fit for a 32 kg/m³ carbon-dioxide-blown polyurethane foam gives 0.039 W/(m·K) at 293 K and only 0.011 W/(m·K) at 85 K, because the gas in the cells conducts less as it cools. Through a slab, Fourier's law with a temperature-dependent conductivity integrates exactly to a mean value: the heat flow is the same as if the slab had the conductivity averaged over the temperature range.

```figure
type: formula
title: Conduction through a slab whose conductivity varies with temperature
formula: Q = (A ÷ t) × ∫ k(T) dT, from T_cold to T_warm
formula: k_mean = [∫ k(T) dT] ÷ (T_warm − T_cold)
caption: Exact for one-dimensional conduction through a flat slab. Averaging the NIST foam fit from 85 K, the lower limit of its equation range, to 293 K gives k_mean = 0.0242 W/(m·K).
- A | area, m²; t | thickness, m
- ∫ k dT | the conductivity integral over the temperature range, W/m
- k_mean | the value to enter in a constant-conductivity calculation
```

The [layered wall heat flow tool](/tools/wall-heat-loss/) calculates steady conduction through up to three flat layers with optional surface film coefficients, and reports the overall coefficient, the heat flow and the temperature at each interface. It takes a constant conductivity for each layer, so the mean value is what it needs. It treats the wall as flat and excludes thermal bridges, both reasonable for a first estimate of a box of this size.

This is an illustration. The bath's liner has a bottom of 0.4 × 0.3 = 0.12 m² and sides of 2 × (0.4 + 0.3) × 0.35 = 0.49 m², 0.61 m² in all. With the room at 20 °C and the liquid at −195.8 °C, a room-side film coefficient of 8 W/(m²·K), no film on the cold side, and one layer of 100 mm at 0.0242 W/(m·K), the tool gives:

```figure
type: stats
title: SF-180 bath walls from the layered wall tool
caption: This is an illustration. Inputs: hot side 20 °C, cold side −195.8 °C, 0.61 m², hot-side film 8 W/(m²·K), cold-side film ignored, 100 mm at 0.0242 W/(m·K).
- 0.2349 W/(m²·K) | Overall coefficient U | 1 ÷ (0.125 + 4.132)
- * 30.9 W | Heat leak through walls and bottom | 0.2349 × 0.61 × 215.8
- 13.7 °C | Outside surface temperature | 6.3 K below the room
- 0.56 kg/h | Boil-off | 0.69 L/h
```

The lid adds its own share. Treating its 0.12 m² of 100 mm foam the same way, with its underside at the liquid's temperature, gives an upper estimate of 6.1 W, because the cold vapour under the lid is in fact a little warmer than the liquid. With the lid closed, the bath leaks about 37 W, or 0.67 kg/h: about 5.3 kg in an eight-hour shift, nearly as much as one shaft takes to cool in Chapter 4.

The outside surface temperature deserves a glance. At 13.7 °C the box's skin is below the dew point of humid workshop air on many summer days, so it will sweat. That does no harm to a box with a sealed skin, but water running down into a timber bench or an electrical outlet does; Condensation Control by the Numbers explains how to check a surface against the [dew point](/reados/publications/condensation-control-by-the-numbers/water-in-air-vapour-pressure-and-dew-point/).

## Why a room-temperature conductivity misleads

A designer who looked up the foam's conductivity at room temperature, 0.039 W/(m·K), and put that into the tool would get an overall coefficient of 0.372 W/(m²·K) and a wall heat leak of 49.0 W, 58% more than the mean-conductivity answer. The difference is not a rounding matter. Most of the foam's thickness sits well below room temperature, where it insulates far better, and a cryogenic calculation must use the conductivity averaged over the actual temperature range. The same rule applies to every material in Cryogenic Design by the Numbers, where conductivity changes by much larger factors.

```figure
type: bars
title: SF-180 bath wall heat leak by the conductivity used
unit: W
max: 55
caption: This is an illustration. Same geometry and film coefficient; only the foam's conductivity changes. The mean over 85 K to 293 K is the right input for a constant-property tool.
- Conductivity at 293 K, 0.039 W/(m·K) | 49.0
- * Mean over 85 to 293 K, 0.0242 W/(m·K) | 30.9
- 150 mm of foam at the mean value | 20.8
```

## The open lid

With the lid open, the liquid surface sees the room directly. Two things then add heat. The surface absorbs thermal radiation from the warm room, and warm, moist air drifts over the rim, is chilled, and gives up its heat, its moisture as frost and ice, and some of its oxygen and nitrogen as condensate. The convective part depends on draughts and is hard to calculate. The radiation part has a firm upper bound.

The [radiant heat tool](/tools/radiant-heat/) calculates the net radiant exchange between a surface and large surroundings from its area, emissivity and the two temperatures, by the Stefan–Boltzmann law, and also reports an equivalent radiation coefficient. For a surface colder than its surroundings, the net heat comes out negative: heat gained, not lost.

This is an illustration. Treating the 0.12 m² liquid surface as a perfect absorber, emissivity 1.0, at −195.8 °C in a room at 20 °C, the tool gives a net exchange of **−50.0 W**: the surface gains at most 50 W by radiation, with an equivalent coefficient of 1.93 W/(m²·K). That alone would boil 0.90 kg/h, more than the whole closed bath loses, and the air drifting in adds more. Leaving the lid open is the most expensive habit a bath user can have.

## The error: a bath left open between jobs

This is an illustration. In its first month SF-180 used far more nitrogen than the shaft count explained. The supervisor weighed the bath on a platform scale through a shift, writing down the mass every hour and noting what was happening at the time.

The hourly readings told the story. With the lid closed and no work in the bath, it lost 0.68 kg/h, matching the 0.67 kg/h calculated above. With the lid propped open, as fitters had been leaving it so that the next shaft could go straight in, it lost 2.1 kg/h, which is 116 W of heat gain: the 50 W radiation bound plus about as much again from the air. Over a shift in which the bath stood open for six hours, the open lid cost (2.1 − 0.68) × 6 = 8.5 kg of nitrogen, more than one and a half shafts' worth.

```figure
type: compare
title: Bath losses measured by weighing over a shift
cols: Condition | Measured loss | Heat equivalent | Notes
caption: This is an illustration. Heat equivalent uses 199.2 kJ/kg. The closed-lid measurement agrees with the calculation, which gives confidence in both.
- Lid closed, idle | 0.68 kg/h | 38 W | calculated 0.67 kg/h, 37 W
- * Lid open, idle | 2.1 kg/h | 116 W | radiation at most 50 W; the rest from air and frost
- Shaft cooling | 5.3 kg per shaft | 1,065 kJ | Chapter 4
```

The fix cost nothing: a rule that the lid is closed whenever a part is not going in or coming out, and a spring on the hinge so that it closes by itself. The measurement also gave the station a reference figure. Weighing the bath for one idle hour now and then, and comparing the result with 0.68 kg/h, shows whether the foam has absorbed water or cracked, both of which raise its conductivity.

## Measuring a heat leak by weighing

A calculation of heat leak is only as good as its conductivities and film coefficients, and the cheapest way to check one is to weigh the vessel. The method needs a platform scale that reads to about 0.1 kg, a clock and some patience.

1. Fill the vessel to its normal working level and let it settle for at least half an hour, so that its liner and insulation reach a steady temperature profile. Readings taken while the walls are still cooling overstate the steady loss.
2. Close the lid, keep people and parts away, and record the mass every 30 to 60 minutes for at least three hours.
3. Fit a straight line through the readings. Its slope in kilograms per hour, multiplied by 199.2 ÷ 3.6 = 55.3, is the heat leak in watts.
4. Repeat with the lid open, or with whatever condition is in question, and compare.

Two cautions apply. The mass falls in steps if the scale's resolution is coarse, so read over long enough periods for the loss to be many times the resolution. And a vessel under pressure, like the cylinder, must be vented to atmosphere through its gas-use valve during the test, or its boil-off stays inside and the scale shows nothing.

## Ice in the bath

The moist air that enters an open bath leaves its water behind as frost on the rim and lid, and as ice crystals that fall into the liquid. Ice adds to the heat load as it forms, jams the lid, and coats the parts that go in. A shaft that comes out with ice on its surface takes that ice into the fit, where it melts into water in the interface. The bath should be emptied and dried when ice builds up, and a closed lid, again, is the main prevention.

## Exercise: thicker foam

The workshop considers rebuilding the bath with 150 mm of the same foam on the walls, bottom and lid, keeping the same inside dimensions. Using the mean conductivity of 0.0242 W/(m·K) and an outside film coefficient of 8 W/(m²·K), find the new closed-lid heat leak and boil-off, and the nitrogen saved in a 2,000-hour year of standing with the lid closed.

**Worked answer.** This is an illustration. The overall coefficient becomes 1 ÷ (0.125 + 0.150 ÷ 0.0242) = 1 ÷ (0.125 + 6.198) = **0.1581 W/(m²·K)**. The walls and bottom then leak 0.1581 × 0.61 × 215.8 = **20.8 W**, and the lid 0.1581 × 0.12 × 215.8 = **4.1 W**, a total of 24.9 W against 37.0 W before. The boil-off falls from 0.67 to 0.45 kg/h, saving 12.1 W × 3.6 ÷ 199.2 = **0.219 kg/h**, or about **437 kg** over 2,000 hours. The outside surface rises from 13.7 °C to 15.7 °C, which also reduces sweating. The layered wall tool gives the same coefficients and heat flows when the thickness is changed to 150 mm. Whether the rebuild pays depends on the price of the nitrogen and of the new box, but the saving per hour is far smaller than the 1.4 kg/h that the open lid was costing.
