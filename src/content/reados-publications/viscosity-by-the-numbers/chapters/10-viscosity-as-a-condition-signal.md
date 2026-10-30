---
book: viscosity-by-the-numbers
chapterSlug: viscosity-as-a-condition-signal
order: 10
title: "Viscosity as a condition signal"
description: "Use viscosity trends to detect oxidation, the wrong oil, dilution and shear loss, estimate a blend's viscosity and the size of a wrong top-up, and set practical limits from the new oil's baseline."
draft: false
---

Oil does not wear out the way a bearing does, but it changes. It oxidises when hot, picks up water and dirt, loses polymer to shear, and gets topped up, sometimes from the wrong drum. Most of those changes move its viscosity, some up and some down, and because viscosity is cheap, precise and measured by every oil laboratory, it is usually the first number on an oil report to show that something is happening. It is rarely enough on its own to say what.

This final chapter sets out what makes an oil's viscosity rise or fall in service, shows how to estimate the viscosity of a blend and work backwards from a step change to the size of a wrong top-up, follows HPU-40's oil through two years of reports, and sets limits based on the new oil's own baseline rather than its grade band. It ends with a report that was read against the grade band and nearly let an oxidising oil run on.

## What moves viscosity in service

The causes divide neatly by direction, which is the first clue an engineer reading a report has.

```figure
type: compare
title: Common causes of viscosity change in industrial oils
cols: Direction | How it usually shows | Confirm with
rowhead: Cause
- Oxidation | Up | Gradual rise, faster after hot periods | Acid number, oxidation by infrared, colour, varnish tests
- Topped up with a heavier oil | Up | Step change after a top-up | Maintenance records, additive elements, 100 °C viscosity
- Water emulsified in the oil | Up, usually | Cloudy sample; step after a leak or washdown | Water content
- Evaporation of light fractions | Up | Slow rise in hot, open systems | Flash point
- Topped up with a lighter oil | Down | Step change after a top-up | Records, additive elements
- Dilution by a solvent or fuel | Down | Step or steady fall | Flash point, specific contaminant tests
- Shear of polymer modifiers | Down | Fall larger at 100 °C than at 40 °C (Chapter 5) | 100 °C viscosity against new oil
caption: The direction narrows the field; the shape of the trend and the other results on the report identify the cause.
```

The shape of the trend is the second clue. Oxidation and evaporation are gradual and accelerate with temperature; contamination by the wrong oil is a step; water can be either. Polymer shear shows most at high temperature. Viscosity therefore works best as a trigger: a change beyond a limit starts an investigation, and the other results on the report finish it.

## The viscosity of a blend

Mixing two oils does not average their viscosities. A mixture's viscosity is much closer to the thinner oil's than a simple average suggests, because the double-logarithmic scale of Chapter 3 is roughly the scale on which oils mix. A widely used estimate, of the kind set out in the ASTM D7152 practice for calculating blend viscosities, averages each component's log log (ν + 0.7) by its fraction, at the same temperature.

```figure
type: formula
title: Estimating the viscosity of a blend of two oils
formula: log log (ν_blend + 0.7) = (1 − x) × log log (ν₁ + 0.7) + x × log log (ν₂ + 0.7)
caption: x is the fraction of the second oil, by mass or, for oils of similar density, by volume. Both viscosities must be at the same temperature. This is an estimate; a measured blend is the final word.
- ν₁, ν₂ | kinematic viscosities of the two oils, mm²/s
- x | fraction of oil 2 in the blend
- ν_blend | estimated blend viscosity, mm²/s
```

This is an illustration. If 20 L of VG 68 oil (68.0 mm²/s at 40 °C) were mixed into 100 L of HPU-40's VG 46 (46.0 mm²/s), the fraction would be 20 ÷ 120 = 0.167, and the blend would be about 49.0 mm²/s at 40 °C, not the 49.7 mm²/s a simple average gives. A tenth of VG 32 in VG 46, the opposite mistake, gives about 44.6 mm²/s. Both blends are still within the VG 46 band of 41.4 to 50.6, which is why a top-up from the wrong drum often goes unnoticed if reports are read only against the grade.

The same relation can be turned around. If a sample steps from one viscosity to another between two reports and the maintenance records show a top-up, solving for x gives the fraction of the system that came from the top-up, which can be checked against the volume added.

```figure
type: steps
title: Working backwards from a step change to the size of a wrong top-up
caption: This is an illustration. Two consecutive reports, 46.9 and 50.4 mm²/s at 40 °C; the suspected contaminant is the shop's VG 68 gear oil at 68.0 mm²/s; system volume 120 L.
- Double logs | log log 47.6 = 0.22469; log log 51.1 = 0.23259; log log 68.7 = 0.26410
- Fraction of contaminant | (0.23259 − 0.22469) ÷ (0.26410 − 0.22469) = 0.200
- * Volume implied | 0.200 × 120 L = 24 L
- Check against records | 24 L topped up from an unlabelled drum: consistent
- If the contaminant had been VG 100 | about 12 L would explain the same step
```

The answer depends on knowing what went in, which is why additive element results on the same report help: a gear oil's additive package looks different from a hydraulic oil's, and the laboratory can often tell them apart.

## Setting limits from the baseline

The grade band is the wrong yardstick for a working oil. It tells you whether an oil is a VG 46; it does not tell you whether your VG 46 has changed. An oil that starts at 46.2 mm²/s, as HPU-40's new fill measured, could rise by 9% before it left the VG 46 band, and an oil that started near the band's top would have almost no room at all.

The press shop's reliability engineer, with its laboratory, set limits relative to the baseline measured on a sample of the new oil after its first week in the machine.

```figure
type: compare
title: The press shop's viscosity limits for HPU-40
cols: Limit from baseline | For HPU-40, baseline 46.2 mm²/s | Response
rowhead: Level
- Normal | within ±5% | 43.9 to 48.5 mm²/s | Continue routine sampling
- Caution | ±5% to ±10% | 41.6 to 43.9 or 48.5 to 50.8 mm²/s | Investigate the cause; shorten the sampling interval
- Action | beyond ±10% | below 41.6 or above 50.8 mm²/s | Find and fix the cause; plan an oil change
- Polymer-thickened oils | 100 °C value down by more than 10% | Chapter 5's rule | Review even if the 40 °C value is normal
caption: This is an illustration. These are the press shop's own limits for this machine, not values from a standard. Each site should set its own with its laboratory and the oil and machine makers' guidance.
```

Limits from the baseline catch slow changes early and make a step change obvious. They also make the machine's own history the reference, which removes the arguments about whether a particular product was "always a bit thick".

## Two years of HPU-40's oil

This is an illustration. HPU-40 was refilled with fresh VG 46 oil at the start of a two-year record. Samples were drawn every six months by the procedure in Chapter 6, with the reservoir temperature on the label.

```figure
type: line
title: HPU-40's oil viscosity at 40 °C over two years
x: Months since the oil change
y: Kinematic viscosity at 40 °C, mm²/s
ymin: 44
ymax: 52
legend: Laboratory result | Caution limit, baseline + 5%
caption: This is an illustration. Baseline 46.2 mm²/s. The rise accelerates after each summer, the signature of oxidation. The 24-month result is the sample estimated in the field in Chapter 6's exercise.
- 0 | 46.2 | 48.5
- 6 | 46.6 | 48.5
- 12 | 47.2 | 48.5
- 18 | 47.9 | 48.5
- 24 | 49.1 | 48.5
```

The rise is gradual and steepens after each summer, which points to oxidation: the oil spent its first summer at up to 65 °C, before the cooler upgrade of Chapter 9, and oxidation roughly doubles in rate for every ten kelvin or so of temperature, a long-standing rule of thumb for mineral oils. The 24-month sample is 49.1 mm²/s, 6.3% above baseline, inside the caution band. The same report showed the acid number rising and an oxidation peak on the infrared spectrum, both confirming the cause. The engineer scheduled an oil change at the next planned shutdown, eight weeks away, and moved sampling to monthly until then.

## The error: reading the report against the grade

This is an illustration. Before the baseline limits were introduced, the 24-month report was first read by a planner who checked the viscosity against the VG 46 band, saw 49.1 mm²/s inside 41.4 to 50.6, saw the laboratory's flag colour, which was green because the laboratory's default limits were also set on the grade, and filed the report. The oil would have run on until the next scheduled change, another year away.

The reliability engineer reread the report a month later when reviewing the trend for all machines. Against the new oil's own baseline of 46.2 mm²/s, the rise was 6.3%, and the trend showed it accelerating, from 0.4 mm²/s in the first six months to 1.2 mm²/s in the last six. The acid number on the same report had also risen, which the grade check had not looked at. By the time the engineer acted, a further month of running had passed, and the oil change found the beginnings of varnish on the reservoir walls and the pump's valve plate, which a flush removed.

```figure
type: compare
title: The 24-month result read two ways
cols: Reference | Result | Conclusion
rowhead: Reading
- Against the VG 46 grade band | 41.4 to 50.6 mm²/s | 49.1, inside | No action
- * Against the baseline and trend | 46.2 mm²/s, rising faster each period | +6.3%, accelerating; acid number rising | Plan an oil change; sample monthly
caption: This is an illustration. The laboratory's default flags were also based on the grade band, and were changed to the baseline limits after this review.
```

Three changes followed. The laboratory was given each machine's baseline and asked to flag against it. Every report is now read for its trend and with its companion results, not just its viscosity line. And the summer temperature that drove the oxidation was already fixed by the cooler upgrade, which should slow the next fill's ageing considerably.

## Two temperatures tell more than one

Most routine oil reports give the viscosity at 40 °C only. Asking for the 100 °C value as well costs little and adds a second dimension, because the different causes of change move the two values differently. Fitting Chapter 3's Walther relation to a used oil's two results gives its slope, B, and comparing that slope with the new oil's says whether the oil's temperature sensitivity has changed as well as its level.

A plain mineral oil that has oxidised moderately usually rises at both temperatures by similar proportions, so its slope changes little. A polymer-thickened oil that has sheared falls more at 100 °C than at 40 °C, as Chapter 5's annex unit did, so its slope steepens. A plain oil contaminated by a heavier oil of a different type shifts towards that oil's slope. None of these patterns is decisive on its own, but each narrows the possibilities, and the two-temperature result costs far less than the investigation it can shorten. For HPU-40's plain mineral oil the press shop asks for both temperatures once a year, and for its annex unit's high-index oil at every sample.

## What viscosity cannot see

A steady viscosity is not a clean bill of health. Many of the changes that damage hydraulic components move viscosity little or not at all, and a monitoring programme that watches viscosity alone will miss them.

Particles are the obvious example. A hydraulic oil can carry enough fine silt to wear a pump's valve plate and score its pistons while its viscosity stays within a fraction of a per cent of new, because a few milligrams of dirt per litre do not change how the oil flows. Free water, as opposed to emulsified water, settles out and leaves the viscosity of the oil phase unchanged while it corrodes surfaces and attacks additives. Additive depletion, the gradual consumption of anti-wear and anti-oxidant additives, can be well advanced before oxidation of the base oil begins to raise its viscosity. And foaming and poor air release, which make a pump noisy and the oil spongy, are properties of the oil's surface chemistry rather than its viscosity.

That is why the routine below reads viscosity with its companions. For HPU-40 the press shop's standard report includes particle count, water content, acid number, an infrared oxidation reading and the main additive and wear elements, with viscosity at 40 °C. Viscosity triggers an investigation when it moves; the other results catch the problems it cannot see.

## Temperature and oil life

The oxidation that drove HPU-40's two-year trend is a chemical reaction, and like most reactions it speeds up with temperature. A rule of thumb often quoted for mineral oils is that the rate of oxidation roughly doubles for each ten kelvin or so rise in temperature, so that an oil's useful life roughly halves. The rule is approximate and depends on the oil and its additives, but it explains why the press shop's first summer, with the oil reaching 65 °C on hot afternoons, did more to age the oil than the cooler months, and why the oxidation trend steepened after each summer.

It also gives a rough measure of the cooler upgrade's value. Holding the summer peak at 55 °C instead of 65 °C, and the normal running temperature at about 43 °C instead of 50 °C, should, on the rule of thumb, roughly halve the rate at which the oil ages through the hottest periods. The press shop will not rely on that estimate; it will watch the next fill's viscosity and acid number trend from its new baseline and compare it with the old one. That comparison, two years from now, is the real test of whether the upgrade paid for itself in oil life as well as in the press's summer speed.

## A routine for viscosity monitoring

```figure
type: checklist
title: Using viscosity to watch an oil's condition
caption: The routine costs little once set up and turns each oil report into a decision.
- Take a baseline | Sample the new oil after a week of running and keep the result as the reference
- Sample the same way every time | Same valve, same temperature, same interval (Chapter 6)
- Read the trend, not the result | Gradual rises and steps mean different things
- Read viscosity with its companions | Water, acid number, oxidation, wear metals, particle count, additive elements
- Record every top-up | Product, batch, volume and date; label every drum and top-up container
- x Rely on the grade band | It cannot see a change that stays within the grade
- ? Ask the laboratory for its repeatability | A change smaller than the method's repeatability is not a trend
```

## Bringing the book together

This book began with a definition, the ratio of shear stress to shear rate, and has followed one property through a whole machine. Viscosity comes from momentum carried by moving molecules in a gas and by activated hops in a liquid, which is why gases thicken and oils thin as they warm. For oils the Walther relation turns two data sheet values into a viscosity at any temperature. Grades are chosen by placing those viscosities inside a machine's window at every temperature it sees. Pressure thickens oil and shear can thin it. Measurement depends on temperature above all. In the machine, viscosity sets laminar pressure drops, clearance leakage and the heat that both produce, and the heat feeds back into the viscosity. Finally, a change in viscosity is an early sign that the oil itself is changing.

For HPU-40 the practical outcomes were modest and specific: a strainer removed, a heater fitted, a cooler sized for the hottest day, pump tests done at a fixed temperature, and oil reports read against a baseline. The companion book, Plain Bearings by the Numbers, takes the same property into the oil film of a hydrodynamic bearing.

## Exercise: a lighter oil by mistake

A later sample from HPU-40 reads 43.4 mm²/s at 40 °C, 6.1% below the new fill's baseline of 46.2 mm²/s, a step from 46.5 mm²/s six months earlier. The records show a 15 L top-up, and the only lighter oil on site is a VG 32 at 32.0 mm²/s. Estimate the fraction and volume of VG 32 that would explain the step, and say whether it is consistent with the records.

**Worked answer.** This is an illustration. The double logarithms are log log 47.2 = 0.22374, log log 44.1 = 0.21602 and log log 32.7 = 0.18028. The fraction is (0.21602 − 0.22374) ÷ (0.18028 − 0.22374) = 0.178, which in 120 L is **about 21 L**. The record shows 15 L, so the top-up alone does not fully explain the step; either more VG 32 went in than was recorded, or something else, such as a solvent used in a nearby repair, has also diluted the oil. The engineer asked the laboratory for a flash point and an additive element comparison before deciding between a partial drain and a full change.
