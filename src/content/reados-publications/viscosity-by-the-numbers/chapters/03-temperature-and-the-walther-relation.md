---
book: viscosity-by-the-numbers
chapterSlug: temperature-and-the-walther-relation
order: 3
title: "Temperature and the Walther relation"
description: "Find an oil's viscosity at any temperature from its two data sheet values with the Walther (ASTM D341) relation, judge its sensitivity and limits, and avoid linear interpolation."
draft: false
---

An oil data sheet gives two viscosities, usually at 40 °C and 100 °C. A machine runs at neither temperature. Its oil might sit at 5 °C on a winter morning, 50 °C most of the day and 65 °C on a hot afternoon, and the viscosity at each of those temperatures is what decides whether the pump starts, whether the bearings carry their load and how much the lines lose. Getting from two catalogue numbers to the viscosity at a working temperature is therefore the most frequent viscosity calculation in industry.

This chapter introduces the relation that does it, the double-logarithmic equation Walther published in 1931 and on which the ASTM D341 viscosity–temperature charts are built. It fits the relation to HPU-40's oil, uses the WORKOS tool that applies it, looks at how sensitive viscosity is to temperature and what that means for measurement, compares two oils of the same grade, and ends with the error of interpolating in a straight line between the data sheet values.

## Why oils need their own relation

Chapter 2 showed that a liquid's viscosity falls roughly as an exponential of the reciprocal of absolute temperature, and that the fit is only approximate. For oils over the range from a cold start to a hot running temperature, a span in which viscosity can change a hundredfold, the approximation is not good enough. Engineers in the early twentieth century plotted oil viscosities on charts with specially scaled axes until the curves became straight lines, and Walther found the algebraic form behind the straightest of them.

```figure
type: formula
title: The Walther relation used for oil viscosity
formula: log₁₀ log₁₀ (ν + 0.7) = A − B × log₁₀ T
caption: ν is kinematic viscosity in mm²/s and T is absolute temperature in kelvin. Two data points fix A and B; the relation is then used between and, with care, beyond them. ASTM D341 adds terms for very thin fluids that oils of the grades in this book do not need.
- ν | kinematic viscosity, mm²/s (cSt)
- T | absolute temperature, K (°C + 273.15)
- A, B | constants fitted to two measured viscosities
- 0.7 | constant in the double logarithm, from the original relation
```

Taking the logarithm twice compresses the enormous range of viscosity into a near-straight line against the logarithm of temperature. On an ASTM D341 chart, which is ruled in exactly these coordinates, most mineral and many synthetic oils plot as straight lines over their normal working range, which is why a data sheet with two points is enough.

## Fitting HPU-40's oil

This is an illustration. HPU-40's data sheet gives 46.0 mm²/s at 40 °C (313.15 K) and 6.8 mm²/s at 100 °C (373.15 K).

```figure
type: steps
title: Fitting the Walther relation to HPU-40's VG 46 oil
caption: This is an illustration. Logarithms are to base 10. Carrying five decimal places keeps the result accurate to better than 0.1%.
- Left side at 40 °C | log log (46.0 + 0.7) = log log 46.7 = 0.22254
- Left side at 100 °C | log log (6.8 + 0.7) = log log 7.5 = −0.05796
- Log temperatures | log 313.15 = 2.49575; log 373.15 = 2.57188
- Slope B | (0.22254 − (−0.05796)) ÷ (2.57188 − 2.49575) = 3.68444
- Intercept A | 0.22254 + 3.68444 × 2.49575 = 9.41799
- * Viscosity at 60 °C | A − B × log 333.15 = 0.12347; ν = 10^(10^0.12347) − 0.7 = 20.62 mm²/s
```

The [oil viscosity at temperature tool](/tools/oil-viscosity-temperature/) does exactly this. Entering 40 °C and 46 cSt, 100 °C and 6.8 cSt, and an operating temperature of 60 °C returns 20.62 cSt, with Walther constants A = 9.41799 and B = 3.68444, and a check that tells the user whether the operating temperature lies between the two data points or is extrapolated. Running it at each of HPU-40's temperatures gives the oil's viscosity across its year.

```figure
type: compare
title: HPU-40's VG 46 oil across its working year
cols: Kinematic viscosity | Density | Dynamic viscosity
rowhead: Oil temperature
- 5 °C, winter start | 382.5 mm²/s | 876.1 kg/m³ | 335.1 mPa·s
- 20 °C | 133.8 mm²/s | 867.0 kg/m³ | 116.0 mPa·s
- 40 °C, data sheet | 46.0 mm²/s | 854.8 kg/m³ | 39.3 mPa·s
- * 50 °C, normal running | 30.0 mm²/s | 848.7 kg/m³ | 25.4 mPa·s
- 65 °C, summer peak | 17.4 mm²/s | 839.6 kg/m³ | 14.6 mPa·s
- 80 °C | 11.1 mm²/s | 830.4 kg/m³ | 9.2 mPa·s
caption: This is an illustration. Kinematic viscosity from the Walther relation fitted above; density from 870 kg/m³ at 15 °C less 0.07% per kelvin; dynamic viscosity is their product.
```

Between a winter start and a summer peak the oil's viscosity changes by a factor of 22. Between its normal 50 °C and the summer peak it nearly halves. Those two ratios explain most of what the press shop sees through the year: sluggish, noisy starts in July and slightly slower, hotter running in January.

## How sensitive is viscosity to temperature?

A useful way to express temperature sensitivity is the percentage change in viscosity per kelvin, found by differentiating the fitted relation or simply by evaluating it one kelvin either side.

```figure
type: bars
title: Fall in HPU-40's oil viscosity per kelvin of warming
unit: %
max: 7
caption: This is an illustration. From the Walther relation fitted to 46.0 and 6.8 mm²/s. The sensitivity is greatest when the oil is cold.
- At 20 °C | 6.2
- * At 40 °C | 4.6
- At 50 °C | 4.0
- At 60 °C | 3.5
```

At 40 °C, the temperature of every data sheet and most laboratory tests, the oil's viscosity changes by 4.6% for each kelvin. A laboratory bath one kelvin cold reads 47.2 instead of 46.0 mm²/s and could move an oil from the middle of its grade to near its upper limit. That is why the viscosity test methods control the bath temperature to a few hundredths of a kelvin, and why a viscosity reported without its temperature is meaningless. Chapter 6 returns to this.

The sensitivity also falls as the oil warms, from 6.2% per kelvin at 20 °C to 3.5% at 60 °C. A machine that runs cold is therefore far more sensitive to small temperature changes than one that runs hot. On a winter morning, HPU-40's oil thins by almost a third in the first five kelvin of warming, which is why the press's behaviour changes so quickly in the first minutes after start-up and then settles. A sensible rule for any test or adjustment that depends on viscosity, such as setting a flow control or measuring a cycle time, is to make it at the normal running temperature and to record that temperature beside the result.

The same sensitivity matters in the machine. A temperature gauge on a reservoir that reads 5 K low will make the oil appear about 23% more viscous than it is at 50 °C, which can mislead anyone comparing running conditions against a pump maker's limits.

## Two oils of the same grade

Grade, as Chapter 4 explains, is set by the viscosity at 40 °C only. Two oils with the same 40 °C viscosity can differ widely at other temperatures, depending on how steeply they thin. The usual measure of that steepness is the viscosity index, a dimensionless number defined in ASTM D2270 by comparing the oil's change between 40 °C and 100 °C with that of two reference oils. A higher index means a flatter curve. This book does not calculate the index, because the calculation needs the standard's reference tables, but the comparison it summarises can be made directly with the Walther relation.

This is an illustration. Suppose the press shop considers a second VG 46 oil, a high viscosity index type whose data sheet gives 46.0 mm²/s at 40 °C and 8.0 mm²/s at 100 °C.

```figure
type: line
title: Two VG 46 oils from 10 °C to 90 °C
x: Oil temperature, °C
y: Kinematic viscosity, mm²/s
ymin: 0
ymax: 280
legend: HPU-40's oil, 6.8 mm²/s at 100 °C | High-index oil, 8.0 mm²/s at 100 °C
caption: This is an illustration. Both curves from the Walther relation through each oil's two data sheet values. They cross at 40 °C, the temperature that defines the grade.
- 10 | 261.9 | 209.4
- 20 | 133.8 | 117.5
- 30 | 75.4 | 71.2
- 40 | 46.0 | 46.0
- 50 | 30.0 | 31.4
- 60 | 20.6 | 22.4
- 70 | 14.9 | 16.6
- 80 | 11.1 | 12.7
- 90 | 8.6 | 9.9
```

The high-index oil is 20% less viscous at 10 °C and 10% more viscous at 65 °C, 19.2 against 17.4 mm²/s. For HPU-40, whose problem in summer is thin oil and whose cold start is already within limits, that is a modest but real improvement. Whether it is worth the higher price is the subject of the next chapter's grade selection. It also illustrates why comparing oils only by their grade misses half the picture.

## Where the relation stops working

The Walther relation describes oils in their normal liquid state. It does not know about the things that happen when an oil gets very cold or very hot.

```figure
type: checklist
title: Limits of a two-point viscosity relation
caption: Use the relation freely between its two data points, cautiously a little beyond them, and not at all where the oil's behaviour changes.
- Interpolate between the data points | Errors are small for mineral and most synthetic oils
- Extrapolate modestly | Up to about 20 K beyond the data, check against a third value if one is published
- x Extrapolate towards the pour point | Waxy mineral oils thicken faster than the relation predicts as wax forms
- x Use it for polymer-thickened oils at high shear | The data sheet values are low-shear values (Chapter 5)
- ? Ask the oil maker for low-temperature data | Many publish a viscosity at 0 °C or below, or a cold-cranking or pumping viscosity
- ? Ask what happens above 100 °C | Oxidation and evaporation, not viscosity, usually limit hot oil
```

This is an illustration. Extrapolated, HPU-40's oil reaches 1,000 mm²/s, the pump maker's cold-start limit, at −6.1 °C, eleven kelvin below the coldest morning the press shop sees. The extrapolation is 46 K beyond the 40 °C data point, so the margin should not be trusted to the degree. The oil maker's data sheet also gives a pour point of −30 °C, well below the working range, which is reassuring but is a different property: the pour point is the temperature at which the oil stops flowing in a test jar, and an oil can be far too thick to pump long before it reaches it.

## The error: a straight line between the data points

This is an illustration. The press shop's maintenance planner wanted to know HPU-40's oil viscosity at 60 °C to compare with the pump maker's preferred range. Having only the data sheet's two values, they interpolated in a straight line: 60 °C is one third of the way from 40 °C to 100 °C, so the viscosity should be one third of the way from 46.0 to 6.8, which gives 46.0 − (46.0 − 6.8) ÷ 3 = 32.9 mm²/s. That figure is comfortably within the preferred 16 to 36 mm²/s, and the planner concluded that the oil would stay in range well beyond 60 °C.

```figure
type: compare
title: HPU-40's oil at 60 °C by three methods
cols: Viscosity at 60 °C | Error against Walther
rowhead: Method
- Straight line between 40 °C and 100 °C | 32.9 mm²/s | +60%
- Straight line on log viscosity | 24.3 mm²/s | +18%
- * Walther relation (ASTM D341 form) | 20.6 mm²/s | reference
caption: This is an illustration. Viscosity falls fastest just above 40 °C, so any straight line between the end points overstates it in between.
```

The error was found when the planner entered the same two values in the oil viscosity tool to prepare a chart for the whole year. The tool gave 20.6 mm²/s at 60 °C. The straight line had overstated the viscosity by 60%, because an oil's viscosity drops steeply just above 40 °C and then levels off; a straight line between the end points runs well above the real curve. Even interpolating in a straight line on the logarithm of viscosity, a common improvement, left an 18% error.

The difference mattered. With the Walther relation, the oil leaves the pump maker's preferred range at 67.6 °C, where it reaches 16 mm²/s, only 2.6 K above the summer peak. With the straight line, it appeared to stay above 16 mm²/s until about 86 °C. The planner's original conclusion would have allowed the oil to run hotter than the pump maker intended. The shop now uses the Walther relation, through the tool or a spreadsheet of the same form, for every viscosity it needs at a temperature that is not on a data sheet.

## Checking an extrapolation with a third value

When an oil maker publishes a third viscosity, usually at 0 °C or lower, it is the best check on a cold extrapolation, and it can replace the 100 °C value when the question is about cold starting. Fitting through the two points closest to the temperature of interest always gives the more reliable answer, because the relation then interpolates rather than extrapolates.

This is an illustration. Suppose the oil maker's extended data sheet for HPU-40's oil also gives 560 mm²/s at 0 °C. The two-point relation through 40 °C and 100 °C predicts 577.3 mm²/s there, 3% high, which is good agreement for a 40 K extrapolation. Refitting through 0 °C and 40 °C gives 373.1 mm²/s at 5 °C instead of 382.5, and moves the 1,000 mm²/s cold-start temperature from −6.1 °C to −6.5 °C. The difference is small for this oil, which tells the press shop that its two-point chart can be trusted at the winter start. For a waxy oil, or one with a pour point close to the working range, a third value can move the answer by much more, and is worth asking for.

## Old data sheets: 100 °F and 210 °F

Older machine manuals, and some imported equipment, quote oil viscosities at 100 °F and 210 °F, often in Saybolt seconds. These temperatures are 37.78 °C and 98.89 °C, close to but not the same as the modern 40 °C and 100 °C, and the difference matters at 4.6% per kelvin. The Walther relation handles it directly: enter the data at the temperatures actually stated, converted to Celsius, and use the result at any other temperature.

This is an illustration. HPU-40's oil, described the old way, would be 51.0 mm²/s at 100 °F and 6.97 mm²/s at 210 °F. A reader who took 51 mm²/s as the 40 °C value would think the oil was a VG 46 at the top of its band, or even a VG 46 out of grade, when it is exactly in the middle. Saybolt seconds add a second layer of approximation, because the conversion to centistokes is only proportional for thicker oils, as Chapter 1 noted. The safest approach with an old specification is to convert it once, carefully, record the converted values with their temperatures, and use only those afterwards.

## Building a viscosity chart for a machine

A simple deliverable from this chapter, worth making for every important oil-filled machine, is a one-page chart of the oil's viscosity against temperature with the machine's limits drawn on it. For HPU-40 the chart shows the oil's curve, the pump maker's preferred band of 16 to 36 mm²/s, its short-term minimum of 10 mm²/s and its cold-start maximum of 1,000 mm²/s, and the temperatures where the curve crosses each: 45.6 °C and 67.6 °C for the preferred band, 83.9 °C for the minimum and −6.1 °C, extrapolated, for the cold-start limit. Taped inside the power unit's cabinet, the chart turns a reservoir thermometer reading into a viscosity anyone can compare with the limits, without a calculation.

## Bringing it together

The Walther relation, the basis of the ASTM D341 charts, turns two data sheet viscosities into a viscosity at any working temperature with an accuracy that is good between the points and acceptable a little beyond them. HPU-40's oil changes 22-fold between a winter start and a summer peak, and by 4.6% per kelvin at 40 °C, which is why every viscosity needs its temperature. Straight-line interpolation overstates viscosity between the data points and should not be used. With the oil's curve in hand, the next chapter asks whether VG 46 is the right grade for HPU-40 at all.

## Exercise: a VG 68 oil at 55 °C

The press shop's gearboxes use a VG 68 oil whose data sheet gives 68.0 mm²/s at 40 °C and 8.6 mm²/s at 100 °C. Find its viscosity at 55 °C, and the temperature at which it falls to 16 mm²/s.

**Worked answer.** This is an illustration. The double logarithms are log log 68.7 = 0.26410 and log log 9.3 = −0.01391, so B = (0.26410 + 0.01391) ÷ 0.07613 = 3.6517 and A = 0.26410 + 3.6517 × 2.49575 = 9.3778. At 55 °C (328.15 K), A − B × 2.51607 = 0.18990, and ν = 10^(10^0.19073) − 0.7 = **34.65 mm²/s**. The oil viscosity tool gives the same. Solving for 16 mm²/s, by trial in the tool or algebraically, gives **76.9 °C**. The VG 68 oil reaches the same viscosity as HPU-40's VG 46 oil does at 67.6 °C about 9 K later.
