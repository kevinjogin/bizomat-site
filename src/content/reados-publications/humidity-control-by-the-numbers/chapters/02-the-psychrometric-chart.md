---
book: humidity-control-by-the-numbers
chapterSlug: the-psychrometric-chart
order: 2
title: "Reading and drawing on the psychrometric chart"
description: "How the psychrometric chart is built, the six air processes as directions on it, mixing lines, sensible heat ratio and the room ratio line, plotting a real design day, and chart pressure."
draft: false
---

The psychrometric chart is the map of moist air. Every state from Chapter 1 is a point on it, every process in an air-handling unit is a line between two points, and the direction of the line says what the process is doing to the air. Engineers who could calculate every property from the equations still draw the chart, because it shows at a glance what a calculation only implies: whether a coil can reach the state asked of it, whether a mixed stream will fog, and how much of a load is sensible heat and how much is water.

This chapter explains how the chart is built, sets out the six processes as directions on it, shows why mixing is a straight line, and introduces the sensible heat ratio and the room ratio line. It then plots the press hall's summer and winter design days, and ends with a supply state that a contractor specified and that no cooling coil could ever produce.

## What the chart plots

A psychrometric chart is a graph of humidity ratio against dry-bulb temperature, drawn for one barometric pressure. The horizontal axis is the dry-bulb temperature. The vertical axis, usually on the right-hand side, is the humidity ratio in grams of water per kilogram of dry air. A horizontal line is therefore air whose water content does not change, and a vertical line is air whose temperature does not change.

Five families of lines are drawn over that grid.

- **The saturation curve** is the upper-left boundary. It is the humidity ratio of saturated air at each temperature, and it curves upwards because the saturation vapour pressure rises steeply with temperature. Every real state of clear air lies below it.
- **Relative humidity curves** are the saturation curve scaled down: the 50% curve sits at roughly half the saturation humidity ratio at each temperature.
- **Enthalpy lines** slope down to the right. Along one of them, warmer air carries less water and the same energy per kilogram of dry air.
- **Wet-bulb lines** are almost parallel to the enthalpy lines but not quite. Chapter 3 explains why they differ and why the difference matters only when reading values to better than about 1%.
- **Specific volume lines** are steeper, falling to the right, and they let the reader turn a fan's volume flow into a dry-air mass flow.

Because every property depends on the total pressure, a chart is valid only at the pressure it was drawn for, usually 101.325 kPa. That point returns at the end of the chapter.

## Six processes, six directions

An air-handling unit does a small number of things to air, and each has its own direction on the chart. Learning the six directions is most of what reading the chart involves.

```figure
type: compare
title: The six air processes as directions on the chart
cols: Direction on the chart | Dry bulb | Humidity ratio | Enthalpy
rowhead: Process
caption: Directions on a chart with dry bulb across and humidity ratio up. Steam humidification moves slightly right of vertical because the steam is hotter than the air; water-spray humidification follows a wet-bulb line and cools the air as it humidifies it.
- Sensible heating | horizontal, to the right | rises | constant | rises
- Sensible cooling, coil above the dew point | horizontal, to the left | falls | constant | falls
- Cooling and dehumidifying | down and to the left, towards the saturation curve | falls | falls | falls
- Steam humidification | almost straight up | rises slightly | rises | rises
- Water-spray or evaporative humidification | up and to the left, along a wet-bulb line | falls | rises | nearly constant
- Desiccant dehumidification | down and to the right | rises | falls | nearly constant
```

Two of these processes deserve a remark straight away. Sensible cooling is horizontal only while the coil's surface is above the air's dew point; once the surface is colder, water condenses and the line bends downwards. And water-spray humidification lowers the air's temperature, because the heat needed to evaporate the water comes out of the air itself. It is the same process as an evaporative cooler, seen from the humidity side. Chapters 6 and 9 use both facts.

## Mixing is a straight line

When two air streams mix without heat exchange, the mixed humidity ratio and the mixed enthalpy are the averages of the two streams, weighted by their dry-air mass flows. Both quantities mix in proportion, so the mixed state lies on the straight line joining the two stream states, and its position along the line is set by the mass shares. If one stream is 36.6% of the dry-air mass, the mixed point is 36.6% of the way from the other stream towards it.

This is an illustration. On the humid summer day the press hall's mixing box takes 3.408 kg/s of outdoor air at 29 °C and 17.714 g/kg and 5.903 kg/s of return air at 22 °C and 8.225 g/kg. The outdoor air is 36.6% of the dry-air mass. The mixed humidity ratio is 8.225 + 0.366 × (17.714 − 8.225) = 11.70 g/kg, which agrees with the mixing tool's 11.699 g/kg. Applying the same rule to temperature gives 22 + 0.366 × 7 = 24.56 °C; the exact result, found from the mixed enthalpy, is 24.59 °C. Temperature does not mix exactly in proportion, because the specific heat of moist air depends a little on its water content, but on a chart drawn at ordinary scale the difference is invisible. Chapter 5 deals with mixing in full, including the case where the straight line crosses the saturation curve and the mixture fogs.

## Sensible heat ratio and the room ratio line

Most processes change both the temperature and the water content of the air. The **sensible heat ratio**, SHR, divides the total enthalpy change into its two parts: the sensible part, from the temperature change, divided by the total. A process with an SHR of 1 is horizontal on the chart. A process with an SHR of 0 changes only the water content.

The SHR fixes the slope of a process line. Most charts carry a small protractor in one corner, a semicircle marked with SHR values; a line drawn parallel to the protractor's ray for a given SHR has that ratio. With equations instead of a protractor, the slope follows from the specific heat of the moist air, about 1.020 kJ/kg·K for the room air, and the latent heat of the water, about 2,449 kJ/kg.

This is an illustration. On the humid design day the press hall gains 80 kW of sensible heat and 9 kW of latent heat, so the room's SHR is 80 ÷ 89 = **0.899**. Whatever air is supplied to the hall, it must lie on a line through the room state with that slope, the **room ratio line**, because only air on that line absorbs heat and moisture in the room's proportions and arrives at 22 °C and 50%. Converted to chart terms, the line falls by about 0.047 g/kg for each kelvin below the room temperature: it is nearly horizontal, because the hall's load is mostly heat.

The cooling coil has its own SHR, and on the humid day it is very different. The coil's job, as Chapter 7 shows, is 129.86 kW of sensible cooling and 91.04 kW of latent, an SHR of 0.588. The coil and the room work at different slopes, and the difference is the outdoor air's water, which the coil must remove but the room never sees.

## Plotting the summer design day

The steps below are how the engineer plotted the press hall's summer design day, on a chart and in a spreadsheet at the same time, so that each point could be read and checked.

```figure
type: steps
title: Plotting the humid design day for the press hall
caption: This is an illustration. Each state is given as dry bulb and humidity ratio. The coil leaves the air at 11.0 °C and 95%, slightly drier than the 7.830 g/kg the room ratio line needs; the margin covers sensor error.
- R, the room | 22 °C, 8.225 g/kg, 50%
- O, outdoors | 29 °C, 17.714 g/kg, 70%
- M, mixed, 36.6% of the way from R to O | 24.59 °C, 11.699 g/kg, 60.5%
- C, off the cooling coil | 11.0 °C, 7.751 g/kg, 95%
- F, after the supply fan, horizontal by 1.58 K | 12.58 °C, 7.751 g/kg, 85.6%
- * S, after reheat, horizontal by 1.0 K | 13.58 °C, 7.751 g/kg, 80.2%; on the room ratio line through R
```

The coil line M to C points down and to the left. Extended past C, it meets the saturation curve at about 9.2 °C. That intersection is the coil's apparatus dew point, the effective temperature of its wet surface, and Chapter 7 uses it to judge whether a real coil can make the change. The two horizontal steps from C to S are fan heat and a small reheat. Together they bring the air onto the room ratio line at the supply temperature of 13.58 °C that Chapter 4 calculates from the sensible load.

```figure
type: svg
title: The press hall's design days on a psychrometric chart
alt: A simplified psychrometric chart with dry-bulb temperature from 0 to 40 °C across and humidity ratio from 0 to 20 g/kg up. A saturation curve rises from the lower left to the upper middle, with a 50 percent relative humidity curve below it. Summer: a mixing line joins the outdoor point O at 29 °C with the room point R at 22 °C, and the mixed point M lies on it. A coil line runs from M down and left to C at 11 °C near saturation, then a short horizontal line runs right to the supply point S at 13.6 °C, and a dashed room ratio line runs almost horizontally from S to R. Winter: a dashed mixing line joins the winter outdoor point W at 5 °C with R, with the mixed point MW at 15.4 °C, and a heating and humidifying line rises from MW to H.
caption: Drawn to scale for dry bulb and humidity ratio at 101.325 kPa; enthalpy, wet-bulb and volume lines are left off for clarity. This is an illustration of the running case.
viewbox: 0 0 600 340
body:
<path class="ln" d="M60 300L60 30M60 300L560 300"/>
<path class="lf" d="M180 300L180 296M300 300L300 296M420 300L420 296M540 300L540 296M60 235L64 235M60 170L64 170M60 105L64 105M60 40L64 40"/>
<text class="txs" x="56" y="318">0</text>
<text class="txs" x="172" y="318">10</text>
<text class="txs" x="292" y="318">20</text>
<text class="txs" x="412" y="318">30</text>
<text class="txs" x="532" y="318">40</text>
<text class="txs" x="40" y="304">0</text>
<text class="txs" x="40" y="239">5</text>
<text class="txs" x="34" y="174">10</text>
<text class="txs" x="34" y="109">15</text>
<text class="txs" x="34" y="44">20</text>
<text class="txs" x="420" y="336">dry bulb, °C</text>
<text class="txs" x="70" y="24">humidity ratio, g/kg dry air</text>
<path class="li" d="M60 251L90 241L120 230L150 216L180 201L210 183L240 162L270 137L300 109L330 76L360 39"/>
<text class="txs" x="262" y="104">saturation</text>
<path class="lf" d="M60 276L90 271L120 265L150 258L180 251L210 242L240 231L270 219L300 206L330 190L360 172L390 151L420 127L450 100L480 69L510 34"/>
<text class="txs" x="452" y="64">50%</text>
<path class="la draw" pathLength="1" d="M408 70L324 193"/>
<path class="la draw" pathLength="1" d="M355 148L192 199"/>
<path class="la" d="M192 199L223 199"/>
<path class="cl" d="M223 199L324 193"/>
<path class="ln dsh" d="M120 244L324 193"/>
<path class="li" d="M245 213L275 195"/>
<circle class="fa" cx="324" cy="193" r="5"/>
<circle class="fa" cx="408" cy="70" r="5"/>
<circle class="fa pulse" cx="355" cy="148" r="5"/>
<circle class="fa" cx="192" cy="199" r="5"/>
<circle class="fa" cx="223" cy="199" r="5"/>
<circle class="fi" cx="120" cy="244" r="4"/>
<circle class="fi" cx="245" cy="213" r="4"/>
<circle class="fi" cx="275" cy="195" r="4"/>
<text class="txb" x="332" y="188">R</text>
<text class="txb" x="416" y="66">O</text>
<text class="txb" x="363" y="144">M</text>
<text class="txb" x="176" y="194">C</text>
<text class="txb" x="217" y="187">S</text>
<text class="txs" x="104" y="262">W</text>
<text class="txs" x="246" y="232">MW</text>
<text class="txs" x="280" y="184">H</text>
```

## Winter on the same chart

The winter day plots in the lower left. The outdoor point W, 5 °C and 4.314 g/kg, joins the room R by a mixing line, and the mixed point MW sits 39.0% of the way from R towards W at 15.39 °C and 6.698 g/kg. From MW the air must go up and slightly to the right, to the point H at 17.95 °C and 8.056 g/kg, before the supply fan adds the last 1.52 K. Chapter 6 splits that line into its heating and humidifying parts and shows that the order, and the choice between steam and water spray, changes the heater's duty by more than half.

The chart makes one more winter fact visible. The mixed point MW is well below the room's humidity ratio, so recirculating more return air would raise it and reduce the humidifier's work. The outdoor air quantity, not the weather alone, sets the winter humidification load, which is why the minimum outdoor air is one of the most important numbers in Chapter 5.

## Pressure, altitude and software

A chart printed for sea level is wrong at altitude, and the error is systematic. At 600 m the standard barometric pressure is about 94.3 kPa, and the same dry bulb and relative humidity give a humidity ratio and a specific volume about 7.5% larger. For a site more than a few hundred metres up, use a chart printed for the site's pressure or calculate with the equations, entering the pressure. The WORKOS tools in this book all take the barometric pressure as an input.

Psychrometric software and spreadsheets have largely replaced reading values off a chart, and they should, because they read to more figures than any eye. The chart remains the best way to check that the software's answer is sensible. A process drawn the wrong way, a mixed point off its line or a coil leaving state above the saturation curve is obvious on paper and invisible in a column of numbers.

## The error: a supply state no coil can make

This is an illustration. An early mechanical scope for the hall, prepared before the engineer joined the project, specified the cooling coil by its leaving state: "13.6 °C and 7.83 g/kg, supplied direct to the hall". It was the correct supply state, taken from the room ratio line. The contractor's proposal offered a single coil to deliver it, with no reheat, and its price was lower than the others.

The engineer drew the proposed coil process on the chart, a straight line from the mixed point M at 24.59 °C and 11.699 g/kg to the specified point at 13.58 °C and 7.830 g/kg, and extended it. The line never reached the saturation curve. At its closest, near 3.8 °C, it still passed 0.57 g/kg below it. A cooling coil's leaving state always lies on the line from its entering state towards its apparatus dew point, a point on the saturation curve. A line that never meets the curve has no apparatus dew point, so no coil, however large, can move air along it in one step. The specified state was 81% relative humidity at 13.58 °C, too dry for its temperature for a single coil fed with this mixed air.

```figure
type: compare
title: The proposed coil process against the one that works
cols: Proposed | Revised
rowhead: Item
caption: This is an illustration. The revised sequence matches the case's design: the coil dehumidifies to 11.0 °C near saturation, then the fan and a small reheat raise the temperature along a horizontal line.
- Coil entering state | 24.59 °C, 11.699 g/kg | 24.59 °C, 11.699 g/kg
- Coil leaving state | 13.58 °C, 7.830 g/kg, 81% | 11.0 °C, 7.751 g/kg, 95%
- Line meets saturation | never; 0.57 g/kg short at best | at about 9.2 °C, the apparatus dew point
- Fan heat | ignored | 1.58 K
- Reheat | none | 1.0 K, about 9.5 kW
- * Hall on the humid day | humidity drifts above the limit | about 22 °C and 49.5%
```

The scope was corrected to the sequence the case now uses: the coil cools and dries the air to 11.0 °C near saturation, the draw-through supply fan warms it by 1.58 K, and a reheat coil adds the final 1.0 K. Supplied at 7.751 g/kg, slightly drier than the line requires, the hall settles at about 49.5%. The chart took two minutes to draw; without it the shortfall would have appeared as a humidity alarm on the first humid day after handover. Chapters 7 and 8 work through the coil and the reheat in detail.

## How this applies to a small Australian business

Few small businesses will draw a psychrometric chart, but most will at some point receive a proposal for air conditioning, drying or humidity control that states a leaving condition. Asking the supplier to show the process on a chart, with the entering state, the leaving state and the room ratio line, is a fair request and a quick test of competence. A process that runs off the chart, or a supply state that does not sit on the line through the room, means the system will not hold the conditions promised, whatever the equipment's capacity.

The chart is also a good way to explain a humidity problem to people who have to pay for the fix. The difference between a dehumidifying coil and a heater, or between outdoor air that dries a room and outdoor air that only feels dry, is clearer as two arrows on a chart than as a page of numbers.

## Exercise: the frosty morning on the chart

On the frosty morning the mixing box takes outdoor air at 0 °C and 3.585 g/kg, 39.5% of the dry-air mass, and return air at 22 °C and 8.225 g/kg. Use the straight-line rule to locate the mixed point. Then find its relative humidity if it is heated to 17.95 °C, the temperature the heater must reach before the fan, and how much steam must be added to bring it to the supply humidity ratio of 8.056 g/kg when the total dry-air flow is 9.758 kg/s.

**Worked answer.** This is an illustration. The mixed humidity ratio is 8.225 − 0.395 × (8.225 − 3.585) = **6.392 g/kg**, which agrees with the mixing tool. The straight-line temperature is 22 − 0.395 × 22 = 13.31 °C; the exact value from the mixed enthalpy is 13.35 °C. Heated to 17.95 °C along a horizontal line, the air has a relative humidity of **50.1%**: heating alone cannot raise its water content. Bringing it to 8.056 g/kg needs 9.758 × (8.056 − 6.392) = 16.2 g/s, or **58.5 kg/h** of steam, an almost vertical line on the chart, against 47.5 kg/h on the ordinary winter day of Chapter 6.
