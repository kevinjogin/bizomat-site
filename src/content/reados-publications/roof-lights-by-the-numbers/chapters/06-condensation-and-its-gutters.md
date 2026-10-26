---
book: roof-lights-by-the-numbers
chapterSlug: condensation-and-its-gutters
order: 6
title: "Condensation and the gutters that carry it"
description: "Calculate the room's dew point, predict the inner surface temperatures of RL-24's glass and bars on a winter night, and size the condensation channels and weeps that carry the water outside."
draft: false
---

On a cold night, warm moist air in a room meets the cold underside of a roof light, and water condenses on it. A roof light is the coldest surface in most rooms: it faces the night sky, it is usually thinner and less insulated than the roof around it, and its metal bars conduct heat outwards faster still. Condensation on a roof light is therefore normal, not a defect, unless nobody planned for it. The 1922 trade course put condensation gutters on every skylight and explained to apprentices why; the physics has not changed.

This chapter calculates the dew point of RL-24's room, predicts the inner surface temperatures of its glass and bars on a winter night, decides whether to accept or prevent condensation, and sizes the channels and weeps that carry it away. The failure case is a roof light whose weep holes were sealed shut, so that its condensation was mistaken for a roof leak.

## Dew point

Air holds water vapour up to a limit that depends on its temperature. **Relative humidity** is the amount it holds as a percentage of that limit. If air is cooled, its relative humidity rises, and at the **dew point** it reaches 100% and water begins to condense on any surface at or below that temperature.

The dew point can be calculated with the Magnus approximation. This book uses the coefficients published by Alduchov and Eskridge in 1996: with the air temperature T in °C and the relative humidity RH in percent, γ = ln(RH ÷ 100) + 17.625 T ÷ (243.04 + T), and the dew point is 243.04 γ ÷ (17.625 − γ).

```figure
type: formula
title: Dew point of RL-24's room on a winter evening
formula: γ = ln(RH ÷ 100) + 17.625T ÷ (243.04 + T)        dew point = 243.04γ ÷ (17.625 − γ)
caption: This is an illustration for an open-plan kitchen and living room at 21 °C. Cooking, showers, people and drying clothes raise the humidity; the 60% case is a cold evening with dinner cooking and the rangehood off.
- 21 °C and 50% RH | dew point ≈ 10.2 °C
- *21 °C and 60% RH | γ ≈ 0.8910; dew point ≈ 12.9 °C
- 21 °C and 70% RH | dew point ≈ 15.3 °C
step: Any surface in the room colder than the dew point will collect condensation
```

A relative humidity of 60% at 21 °C is not unusual in a kitchen on a winter evening. The question is how cold the roof light's surfaces get.

## Inner surface temperatures

Heat flows out through the glass from the warm room to the cold night. The glass's **thermal transmittance**, or U-value, in W/m²·K, measures how readily it does so. Part of the temperature drop from room to outside happens in the thin layer of air on the inside surface, which has a resistance of its own, the **internal surface resistance**. The inner surface temperature is the room temperature less the fraction of the total drop that occurs across that layer.

```figure
type: formula
title: Inner surface temperature of a glazing element
formula: inner surface temperature = T_in − U × R_si × (T_in − T_out)
caption: This is an illustration. The U-values are teaching values for a 25° roof light: about 5.8 W/m²·K for single laminated glass, 2.8 for a double-glazed unit, 7.0 for an aluminium bar with no thermal break and 3.5 for a thermally broken bar. R_si is taken as 0.10 m²·K/W for heat flowing upwards. Real values come from the glazing and frame makers' data.
- Room and outside | 21 °C inside, 2 °C outside on a clear winter night
- Single laminate, U = 5.8 | 21 − 5.8 × 0.10 × 19 ≈ 10.0 °C
- Double-glazed unit, U = 2.8 | 21 − 2.8 × 0.10 × 19 ≈ 15.7 °C
- Aluminium bar, no break, U = 7.0 | 21 − 7.0 × 0.10 × 19 ≈ 7.7 °C
- Thermally broken bar, U = 3.5 | 21 − 3.5 × 0.10 × 19 ≈ 14.4 °C
```

Comparing each surface temperature with the room's dew point shows which surfaces will run with water.

```figure
type: bars
title: Inner surface temperatures on a 2 °C night, against the room's 12.9 °C dew point
unit: °C
max: 18
caption: This is an illustration. Surfaces below 12.9 °C collect condensation when the room is at 21 °C and 60% RH. RL-24 as built has single laminated glass on unbroken aluminium bars, the two coldest options.
- Aluminium bar, no thermal break | 7.7
- *Single laminated glass | 10.0
- Room dew point at 60% RH | 12.9
- Thermally broken bar | 14.4
- Double-glazed unit | 15.7
```

Another way to read the same numbers is to ask at what room humidity each surface starts to condense on that night. Single laminated glass at 10.0 °C reaches the dew point when the room is at about **49%** relative humidity; the unbroken bars at 7.7 °C, at about **42%**; a double-glazed unit at 15.7 °C, at about **72%**. In other words, RL-24's single glass will condense on most cold winter evenings with any cooking, while a double-glazed unit would condense only in a steamy room.

### Why clear nights are worst

The calculation uses the outside air temperature, but a roof light on a clear night loses heat to something colder than the air: the night sky. A near-horizontal surface facing a clear sky radiates heat upwards and can cool below the surrounding air temperature, which is why frost forms on car roofs and roof sheeting on clear nights when the air stays above freezing. A roof light's outer glass does the same, and its inner surface follows it down. Cloud cover blankets the sky and reduces the effect. So the worst condensation nights are cold, clear and still, and a calculation using the air temperature alone is, if anything, optimistic. The shop treats the numbers above as a minimum expectation, not a worst case.

### Thermal breaks in bars

An aluminium bar is an excellent conductor. Without a break, heat flows from the warm inside flange of the bar straight through its web to the cold outside capping, and the inside flange ends up colder than the glass beside it, as the figures show. A **thermal break** is a strip of low-conductivity material, usually a polyamide strip or a poured and debridged resin, that joins the inner and outer parts of the bar so that no continuous metal path runs from inside to outside. Thermally broken glazing bars cost more, are deeper and are usually extrusions from a glazing system rather than folded sections, so they suit a roof light designed around a proprietary system more than a shop-folded one like RL-24. Where unbroken folded bars are used, as in RL-24, the bars will always be the first surfaces to condense, and their channels must be generous.

## Measure before you guess

Humidity in a home is rarely known; it is assumed. When a roof light condenses more than expected, or before deciding between glazing options for a room known to be damp, a small temperature and humidity logger left in the room for a week gives real numbers: the evening peaks after cooking and showers, the overnight humidity, the early-morning temperature. A surface thermometer held against the glass and the bars on a cold morning shows their actual temperatures. With those, the dew point calculation stops being a teaching exercise and becomes a diagnosis. Loggers are inexpensive, and a week of data settles arguments between owners, builders and roof light makers that otherwise run for months.

## Prevent it or manage it

There are two strategies, and most roof lights use some of both.

**Prevention** raises the inner surface temperatures above the dew point or lowers the dew point. Double-glazed units and thermally broken bars raise the surfaces; a ducted rangehood, an exhaust fan and sensible ventilation lower the room's humidity. A double-glazed unit for RL-24 would have roughly doubled the glass's weight, from about 48 kg to something near 95 kg for two 6 mm laminates, needed deeper bars and rebates and cost considerably more.

**Management** accepts that condensation will form on some nights and makes sure it is caught and carried outside, never dripping into the room. That is what the condensation channels in the bars and frame are for.

RL-24's owner chose management with some prevention: single laminated glass on unbroken bars, a fully developed condensation channel system, a ducted rangehood near the roof light and an insulated kerb lining. On a 2 °C night with dinner cooking, the glass will mist and run; the water must go somewhere other than the kitchen bench.

## The condensation path

Water that condenses on the underside of sloping glass runs down the glass towards the eaves, provided the slope is steep enough and the surface is reasonably clean. At 25°, it runs. On flatter glass, drops grow until they are heavy enough to fall, and they drip into the room before reaching any gutter; that is one reason Chapter 5 kept RL-24 at 25°.

```figure
type: steps
title: Where a drop of condensation goes in RL-24
caption: This is an illustration. Every step has a channel or a lap that hands the water on. A break anywhere in the chain becomes a drip into the room.
- Condenses on the glass underside | runs down the glass at 25°
- Reaches a bar or the eaves frame | runs off the glass edge into the bar's condensation channel
- Runs down the bar's channel | commons and hips each carry a channel under their rebates
- Drops into the eaves frame channel | a continuous channel around the inside of the frame
- Leaves through weep holes | baffled weeps through the frame's outer face, above the kerb flashing
- *Runs down the kerb flashing outside | and away with the rain
```

The bars' channels must be continuous and must hand over to the frame channel without a dam. Where a common bar meets the eaves frame, its channel is notched so that water drops into the frame's channel, not onto the frame's top. The 1922 course made the same point about notching each bar's gutter over the curb gutter below it, so that the drip falls where it should. Where the hips meet the eaves corners, the corner pieces of the frame channel are folded and sealed as boxes, because the hips deliver their water exactly there.

## How much water

The amount of condensation depends on the surface temperatures, the room's humidity, how long the cold lasts and how air moves in the room, and it varies widely. For sizing the channels, the shop uses a teaching rate of **50 g per square metre of glass per hour** on a bad night: deliberately generous, not a measured value.

On RL-24's 3.178 m² of glass, over an eight-hour cold night, that is about **50 × 3.178 × 8 ≈ 1,270 g**, about 1.27 litres. The eaves frame's condensation channel is about 10 mm wide and 12 mm deep, a cross-section of 120 mm², running the full 7,200 mm perimeter, so it holds about **120 × 7,200 = 864,000 mm³, or 0.864 litres**, when full to the brim.

The comparison is the point. The channel cannot store a bad night's condensation; it must drain continuously through its weeps. RL-24's frame has a baffled weep hole at each end of each long side and at the centre of each end, six in all, each placed at a low point of the channel, and the channel falls slightly to each weep. A channel that only stores water is a reservoir waiting to overflow.

### Weeps that keep wind out

A plain hole through the frame lets condensation out, but on a windy day it also lets wind and rain in, blowing water back up into the channel. RL-24's weeps are **baffled**: each has a small folded hood on the outside, open downwards, so that water can drain out but wind-driven rain strikes the hood rather than entering. The weeps sit above the kerb flashing's upstand and inside the frame's skirt, so they discharge onto the flashing, not into the lap between skirt and upstand.

## The kerb and the light well

The glass and bars are not the only cold surfaces. The kerb's inside face and the light-well lining near the top of the well are colder than the room, because they are close to the cold roof light and the outside. Chapter 2 insulated RL-24's kerb on its inside face. Without that insulation, the top of the lining would be close to the bars' temperature on a cold night, and condensation there has no channel to run into: it soaks into the lining and grows mould. Insulating the kerb lining keeps its surface well above the dew point on all but the steamiest evenings.

## A failure case: the leak that was not rain

This is an illustration. On an earlier roof light over a bathroom, the owner reported drips onto the floor below "whenever it rains". The roof light maker was called back three times. Each time the kerb flashings were hose tested and found dry.

The detection came when someone noticed that the drips happened on cold, clear mornings after showers, not during rain. A cheap temperature and humidity logger left in the room for a week showed 75% relative humidity at 7 am, a dew point above 16 °C, and the drips coincided exactly. The water was condensation, not rain.

Inspection then showed why the condensation was dripping instead of draining: the weep holes in the frame had been filled with sealant during an earlier repair, so the frame's channel filled and overflowed onto the ceiling lining. The correction was to clear and baffle the weeps, fit an exhaust fan with a run-on timer in the bathroom and leave the door open after showers. The shop's procedure now checks weeps at every service, and its first question for a reported leak is when, exactly, the water appears.

## How this applies to a small Australian business

Work out the room's likely humidity and the dew point. Calculate the inner surface temperatures of the glass and the bars for a cold night, using the makers' U-values. Decide, with the owner, whether to prevent condensation with better glazing and ventilation, or to manage it with channels, or both. Make the channel system continuous from glass to weep, with notches where bars meet the frame and boxed corners where hips meet it. Drain the channels continuously through baffled weeps. Insulate the kerb's inner face. And when a leak is reported, find out whether it appears in rain or on cold mornings.

## Exercise: a milder night

On a milder winter night, the outside temperature is 8 °C and the room is at 21 °C and 60% relative humidity. Using this chapter's teaching values, what are the inner surface temperatures of RL-24's single laminated glass and unbroken bars? Will either condense?

**Worked answer.** The temperature difference is **21 − 8 = 13 K**. The glass's inner surface is **21 − 5.8 × 0.10 × 13 ≈ 13.5 °C**, just above the 12.9 °C dew point, so the glass stays clear, though only by about half a degree. The unbroken bars are at **21 − 7.0 × 0.10 × 13 ≈ 11.9 °C**, below the dew point, so they will collect condensation along their undersides. The bar channels earn their place even on a mild night, and a little more humidity from cooking would bring the glass to its dew point too.
