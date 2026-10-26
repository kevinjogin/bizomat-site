---
book: cooling-towers-by-the-numbers
chapterSlug: tower-performance-and-the-merkel-method
order: 4
title: "Tower performance and the Merkel method"
description: "Model a tower with the Merkel method: the air's operating line, the Merkel number, the characteristic and other wet-bulbs, and catch a tower specified at the annual-average wet-bulb."
draft: false
---

A tower's performance can be predicted with surprising economy. Chapter 2 showed that a tower's driving force is the difference between the enthalpy of saturated air at the water's temperature and the enthalpy of the air passing it. Integrating that driving force through the tower gives a single number, the **Merkel number**, which describes how much transfer a duty needs. A given tower, with its fill and fan, can provide a certain Merkel number at each ratio of water to air flow, a curve called its **characteristic**. Where the duty's need meets the tower's capability, the tower's performance is fixed. With that, a plant engineer can predict a tower's cold water at any wet-bulb, load or flow, without a test.

This chapter sets out the Merkel method, works it through for CT-250's design point, derives the tower's characteristic, and uses it to predict the cold water at other wet-bulb temperatures. The running case finds that a tower specified to deliver 29 °C water at the site's annual-average wet-bulb of 15 °C would have had less than half CT-250's capability, and would have delivered about 33.8 °C water on the design day.

## The air's operating line

As air rises through a counterflow tower, it gains exactly the heat the water loses. If the water flow is L and the dry air flow G, both in kg/s, the air's enthalpy at any level rises by (L ÷ G) × c_w for each kelvin that the water there is warmer than the cold water at the bottom. Starting from the inlet air's enthalpy, which its wet-bulb fixes, the air's enthalpy is a straight line against the water's temperature: the **operating line**, with slope (L ÷ G) × c_w. Its ratio L ÷ G is the tower's **liquid-to-gas ratio**. For CT-250, about 11.96 kg/s of water and about 9.97 kg/s of dry air give an L/G of about **1.2**.

At each level, the enthalpy of saturated air at the water's temperature lies above the operating line, and the gap between them is the local driving force.

## The Merkel number

The **Merkel number** is the integral, through the tower, of the water's temperature change divided by that driving force:

```figure
type: formula
title: The Merkel number for a counterflow tower
formula: KaV ÷ L = ∫ c_w dT ÷ (h_s(T) − h_a(T)), from T_cold to T_hot
caption: This is an illustration for CT-250 at its design point: water from 34 °C to 29 °C, inlet wet-bulb 24 °C, L/G ≈ 1.2, evaluated with the common four-point Chebyshev approximation at 10%, 40%, 60% and 90% of the range.
- h_s(T) | Enthalpy of saturated air at the water's temperature, kJ/kg
- h_a(T) | Enthalpy of the air on the operating line at the same level, kJ/kg
- c_w | Specific heat of water, about 4.186 kJ/(kg·K)
step: Driving forces at 29.5, 31, 32 and 33.5 °C: about 22.4, 22.8, 23.3 and 24.7 kJ/kg
step: KaV ÷ L ≈ c_w × range × (average of 1 ÷ driving force) ≈ 4.186 × 5 × 0.0430 ≈ 0.90
step: The design point needs a Merkel number of about 0.90
```

The Merkel number is a measure of how difficult a duty is: a close approach, which squeezes the driving force at the cold end, or a large range, needs a larger number. It is not a measure of the tower itself; that is the characteristic.

## The tower's characteristic

A particular tower, with its fill, height and fan, can provide a Merkel number that depends mainly on its liquid-to-gas ratio: more water per kilogram of air gives each kilogram of water less air to work with, and a lower Merkel number. Tower makers measure this as a characteristic curve, commonly expressed in the form KaV ÷ L = C × (L ÷ G)^(−n), where C and n depend on the fill and are obtained from tests. The exponent n is typically between about 0.5 and 0.8. In this book's illustration, CT-250 is assumed to have n = 0.6, and its characteristic is fixed by its design point: C = 0.90 × 1.2^0.6 ≈ **1.00**.

The tower's performance at any condition is where its characteristic, what the tower can provide, equals the Merkel number the duty demands. Solving for the cold water temperature that makes them equal, at a given load, flow and wet-bulb, is a short iteration that a spreadsheet or a few lines of code does at once.

## Performance at other wet-bulbs

This is an illustration. At CT-250's design load and flow, the model gives its cold water across a range of wet-bulb temperatures.

```figure
type: line
title: Cold water temperature against wet-bulb at 250 kW and 12 L/s
x: Inlet wet-bulb temperature, °C
y: Cold water temperature, °C
legend: CT-250, selected for 29 °C at a 24 °C wet-bulb | A tower selected for 29 °C at a 15 °C wet-bulb
ymin: 20
ymax: 36
caption: This is an illustration from the Merkel model with n = 0.6. CT-250's approach shrinks from about 7.8 K at a 15 °C wet-bulb to about 4.5 K at 26 °C; the smaller tower meets 29 °C only at 15 °C and delivers about 33.8 °C on the design day.
- 15 | 22.84 | 29.00
- 18 | 24.83 | 30.53
- 20 | 26.19 | 31.60
- 22 | 27.58 | 32.69
- 24 | 29.00 | 33.83
- 26 | 30.45 | 35.00
```

The approach is not constant. CT-250's approach is about 5 K at its design wet-bulb, about 6.8 K at 18 °C and about 4.5 K at 26 °C. Warmer air carries much more enthalpy per kelvin, because saturated air's enthalpy rises steeply with temperature, so the same tower brings the water closer to the wet-bulb on warmer days and less close on cooler ones. A rule that assumes a constant approach misjudges a tower's cold water in both directions.

## The running case: the first specification

This is an illustration. An early draft of the tower specification, written before Chapter 2's design wet-bulb was settled, asked for 29 °C cold water "at the site's average wet-bulb", which its author took from the annual climate summary: about **15 °C**. At 15 °C, delivering 29 °C water is an approach of 14 K, an easy duty.

## The error: specified at the average

The Merkel number for 34 °C to 29 °C at a 15 °C wet-bulb is only about 0.39, less than half the 0.90 needed at 24 °C, because at low wet-bulb temperatures the air's enthalpy is low and the driving force wide. A tower selected for that duty would have a characteristic constant of about 0.44 against CT-250's 1.00: a much smaller tower. On the design day, at a 24 °C wet-bulb, it would have delivered water at about **33.8 °C**, and at 26 °C about 35 °C, every water-cooled load in the plant running about 5 K hotter than designed on summer afternoons.

The check that caught it was the reviewer's question that Chapter 2 also asked: a tower's design wet-bulb must be a summer design value for the site, chosen for an acceptable number of exceedance hours, not an annual average, which the tower falls short of on most summer days. The fix was the 24 °C design wet-bulb and the tower selected for it, with the basis for the wet-bulb written into the specification. The general lesson is that a tower specification states its cold water at a design wet-bulb chosen for the hot season, and that the same cold water at a lower wet-bulb describes a much smaller tower.

## How hard each duty is

The Merkel number makes duties comparable. This is an illustration, for 34 °C to 29 °C water at an L/G of 1.2.

```figure
type: bars
title: Merkel number needed to cool water from 34 °C to 29 °C, by design wet-bulb
unit: KaV/L
max: 1.6
caption: This is an illustration from the four-point Merkel integration. The same 29 °C target needs less than half the transfer at a 15 °C wet-bulb, and about 56% more at 26 °C, than at CT-250's 24 °C.
- Wet-bulb 15 °C, approach 14 K | 0.39
- *Wet-bulb 24 °C, approach 5 K, CT-250 | 0.90
- Wet-bulb 26 °C, approach 3 K | 1.41
```

Each step closer to the wet-bulb costs more transfer than the last, the same diminishing returns as an exchanger's close approach. A plant that asks for a 3 K approach is asking for a tower about half as large again as one with a 5 K approach, for about 2 K colder water on the hottest days.

## What sets the characteristic

A tower's characteristic constant C reflects how much transfer its fill provides per unit of water flow. Higher fill, more fill surface per cubic metre, finer films and better distribution of water and air all raise it. **Film fill**, closely spaced corrugated sheets over which water runs as thin films, gives high transfer in a compact volume but is sensitive to fouling and to poor water quality, because its narrow passages trap debris and grow biofilm. **Splash fill**, bars or grids that break falling water into droplets, gives less transfer per volume but tolerates dirty water. The choice of fill is therefore a water-quality decision as well as a thermal one, which Chapter 6 returns to.

The air flow sets the L/G ratio, and with it the characteristic's value. A larger fan, or a faster one, moves more air, lowers L/G and raises the Merkel number the tower provides, at a steep cost in fan power, as Chapter 8 shows. Tower selections balance fill volume against fan power: a larger tower with a smaller fan, or a smaller tower with a larger fan, can meet the same duty, with different capital and running costs.

## Using the model on site

With its characteristic established, the model becomes a monitoring tool. At any time, the plant can measure the wet-bulb at the tower's inlet, the hot and cold water temperatures and the flow, and compare the measured cold water with the model's prediction for those conditions. A tower that delivers warmer water than predicted has lost capability: fill partly blocked by scale or biofilm, spray nozzles clogged so that part of the fill runs dry, a fan blade's pitch slipped, air bypassing the fill through a damaged casing, or warm exhaust being drawn back into the inlet. Each has its own signs on inspection, and the gap between prediction and measurement says how much capability has been lost. Chapter 10 sets out the formal version of this comparison, the capability test, and the routine version that a plant can do monthly.

## Part load

At part load, the plant's heat falls while the water flow usually stays constant, so the range falls and the tower, with less heat to reject, delivers colder water. If the plant needs only its design cold-water temperature, the fans can slow, reducing the air flow and raising L/G until the tower just meets the set point at the lower load. The model predicts the fan speed needed at each load and wet-bulb, which is how the fan energy estimates of Chapter 8 are made. Running the fans at full speed whenever the tower runs, regardless of load, wastes most of the energy a modern variable-speed drive could save.

## Flow and the liquid-to-gas ratio

The model also shows what happens when the water flow changes. This is an illustration. If the plant's pumps circulated 25% more water than design, about 15 L/s, for the same 250 kW, the range would fall to 4 K and the liquid-to-gas ratio would rise to about 1.5. The tower's characteristic gives a lower Merkel number at the higher L/G, but the duty, with a smaller range, needs less, and in this illustration the cold water comes out at about 29.2 °C, slightly warmer than design. Extra flow does not make the water colder; it spreads the same heat over more water and costs pump energy. The flow should be the flow the equipment needs.

## Crossflow towers

The Merkel method as set out here is for counterflow, where air and water move in opposite directions and the operating line is straight. In a crossflow tower, air crosses the falling water horizontally, so different parts of the fill see different air and water temperatures, and the integration becomes two-dimensional. Makers' rating methods handle it, and the characteristic approach, a Merkel number provided against one demanded, still applies. For a plant engineer predicting a crossflow tower's performance at other conditions, the maker's performance curves, which give cold water against wet-bulb at several ranges and flows, are the practical tool, and they can be fitted with a simple model in the same way as CT-250's.

## The model's limits

The Merkel method makes simplifying assumptions: it treats the air leaving each level as saturated in its enthalpy driving force, neglects the water evaporated from the water balance, and assumes a uniform distribution of water and air across the fill. More detailed methods relax them and are used in tower design software and in acceptance testing. For predicting a tower's cold water at other conditions from its own characteristic, as a plant engineer needs, the Merkel model is accurate enough, and its main uncertainty is the characteristic itself, best obtained from the maker's data or a test of the actual tower, as Chapter 10 describes.

## Exercise: a hotter design day

The plant considers a more conservative design wet-bulb of 26 °C. With the same load and flow, what cold water does CT-250 deliver at 26 °C, and what approach is that? What would a tower selected to deliver 29 °C at 26 °C need, compared with CT-250?

**Worked answer.** From the model, CT-250 delivers about **30.45 °C** at a 26 °C wet-bulb, an approach of about **4.45 K**.

A tower delivering 29 °C at 26 °C would have an approach of only 3 K. Its Merkel number, calculated as above for 34 °C to 29 °C at a 26 °C wet-bulb and an L/G of 1.2, is about **1.41**, about 56% more than 0.90, because the driving force at the cold end is small, so the tower would be considerably larger, with more fill, a larger fan or both. The calculation lets the plant weigh that extra cost against the hours each year when the wet-bulb exceeds 24 °C, which is exactly the risk decision Chapter 2 described.
