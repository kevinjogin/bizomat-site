---
book: distribution-transformers-by-the-numbers
chapterSlug: paper-oil-and-the-life-of-insulation
order: 7
title: "Paper, oil and the life of insulation"
description: "Why paper insulation sets a transformer's life, how heat, water and oxygen age it, how to estimate ageing over a daily load cycle, and what oil tests reveal about the paper."
draft: false
---

A transformer has no moving parts to wear out. Its core steel and copper last practically for ever. What ages is the insulation: the paper wrapped around the conductors and the pressboard spacers between the windings, soaked in oil. Oil can be filtered, dried, regenerated or replaced; paper cannot be reached without taking the transformer apart. When the paper becomes so weak that the vibration of a short circuit or the movement of a few decades of load cycles cracks it, the transformer has reached the end of its life, whatever its age in years.

This chapter explains what paper is and how it ages, why temperature dominates the rate of ageing, and how to turn the hot-spot temperatures of Chapter 6 into a rate of ageing for the plant's daily load cycle, using the KEVOS® Arrhenius tool alongside the doubling rule common in transformer practice. It then looks at water and oxygen, at what oil tests reveal about the paper, and ends with an ageing calculation that said TX-1 was young and an oil test that said otherwise.

## Cellulose and what ageing does to it

Transformer paper and pressboard are made of cellulose, the material of wood and cotton: long chains of glucose units linked end to end. The strength of the paper comes from the length of those chains, measured as the degree of polymerisation, DP, the average number of glucose units per chain. New transformer paper has a DP of roughly 1,000 to 1,200. As it ages, the chains break into shorter pieces and the paper loses tensile strength. A DP of about 200 is commonly taken as the end of its useful life, when it has lost most of its strength and can no longer be relied on to survive mechanical stress.

Three processes break the chains, and each produces substances that dissolve in the oil.

1. **Heat** breaks chains directly, producing water, carbon monoxide and carbon dioxide.
2. **Water** attacks the links between glucose units, a reaction called hydrolysis, and since ageing itself produces water, it feeds on itself.
3. **Oxygen**, together with the acids formed as the oil oxidises, speeds both of the others.

Ageing also produces furan compounds, small ring-shaped molecules that come only from the breakdown of cellulose and dissolve in the oil, where a laboratory can measure them. They are the most direct clue to the paper's condition that can be had without opening the tank, short of cutting a paper sample from a lead during a repair.

## Temperature and the rate of ageing

The chemical reactions that break cellulose chains speed up steeply with temperature, as most reactions do. Chemistry describes that with the Arrhenius equation, in which the rate rises exponentially with the inverse of absolute temperature, scaled by an activation energy. Transformer engineers have long used a simpler rule: the rate of paper ageing doubles for each fixed rise in temperature. The idea goes back at least to Montsinger's work in 1930, and loading guides express it as a relative ageing rate, compared with the rate at a reference hot-spot temperature.

For this book's case, the plant's engineers took a doubling interval of 6 K and a reference hot-spot temperature of 98 °C, at which the ageing rate is defined as 1. These are assumptions for the illustration, of the kind loading guides use for ordinary kraft paper in mineral oil; a real assessment should use the values in the loading guide that applies and the transformer maker's data, and thermally upgraded papers age more slowly.

```figure
type: formula
title: Relative ageing rate by the doubling rule
formula: V = 2^((θ_hs − 98) ÷ 6)
formula: Equivalent ageing hours per day = Σ (hours at each load × V at that load's hot spot)
caption: V is the rate of ageing relative to the rate at a 98 °C hot spot, θ_hs the hot-spot temperature in °C. Both the 98 °C reference and the 6 K doubling interval are assumptions for this illustration. An equivalent of 24 hours per day means the paper ages at exactly the reference rate.
- V | relative ageing rate
- θ_hs | hot-spot temperature, °C
- 6 K | assumed doubling interval
```

The [Arrhenius acceleration check tool](/tools/arrhenius-acceleration-check/) works out the acceleration factor between a use temperature and a higher test temperature for a given activation energy, and from it the equivalent service hours of a test. Used with the reference hot spot as the "use" temperature and the actual hot spot as the "test" temperature, the same factor is the relative ageing rate. A doubling interval of 6 K around 98 °C corresponds to an activation energy of about 1.39 eV, and with that value the tool gives a factor of 3.73 at the tunnel peak's 109.6 °C, against 3.82 by the doubling rule.

```figure
type: compare
title: Relative ageing rate by the doubling rule and by Arrhenius with 1.39 eV
cols: Doubling rule, 6 K | Arrhenius, 1.39 eV | Difference
rowhead: Hot spot
- 80 °C | 0.125 | 0.109 | Arrhenius lower
- 90 °C | 0.397 | 0.384 | Close
- * 98 °C | 1.000 | 1.000 | Reference
- 104 °C | 2.000 | 1.997 | Close
- 110 °C | 4.000 | 3.901 | Close
- 120 °C | 12.70 | 11.38 | Arrhenius lower
caption: Arrhenius factors from the Arrhenius acceleration check tool, with 98 °C as the use temperature. The two agree near the reference, where 1.39 eV was fitted, and drift apart away from it, because a fixed doubling interval is not exactly an Arrhenius law; the equivalent activation energy is about 1.26 eV between 80 and 86 °C and 1.56 eV between 120 and 126 °C.
```

The comparison is a useful warning. The doubling rule is a convenient approximation, not a law of nature, and the activation energy that matches it depends on where it is fitted. Both are only as good as the assumption behind them, which is why the conclusions below rest on comparisons between cases rather than on absolute lifetimes.

## The case: TX-1's daily ageing

Chapter 6 gave TX-1's steady-state hot-spot temperatures at each part of the plant's daily load cycle. With the tunnel, a production day has eight hours at 650 kVA, fourteen hours at 1,300 kVA and two hours at the 1,520 kVA peak. Multiplying the hours at each load by its relative ageing rate, and adding, gives the paper's ageing that day expressed in hours at the reference rate.

```figure
type: compare
title: TX-1's paper ageing per production day, in hours at the 98 °C reference rate
cols: Room at 26 °C | Room at 38 °C | Room at 43 °C, clogged filters
rowhead: Case
- TX-1 today, no tunnel | 1.25 h | 5.01 h |
- * TX-1 with the tunnel | 4.47 h | 17.89 h | 31.87 h
- 2,000 kVA replacement with the tunnel | 0.36 h | 1.45 h |
caption: This is an illustration. Doubling rule with a 98 °C reference and 6 K interval, applied to the steady-state hot spots of Chapter 6; the replacement has a rated top-oil rise of 50 K, a gradient of 14 K and losses of 2.30 and 19.0 kW. A result below 24 hours means the paper ages more slowly than the reference rate that day.
```

Three conclusions follow. With the tunnel, TX-1's paper ages faster than today, about three and a half times as fast, but even on a hot afternoon in a properly ventilated room it ages more slowly than the reference rate: 17.9 equivalent hours in a 24-hour day. On the warmest days with the filters clogged, at 31.9 hours, it ages a third faster than the reference rate, which is acceptable for a few days a year but not as a habit. And a 2,000 kVA replacement, less heavily loaded, would age its paper about twelve times more slowly than TX-1 would with the same load.

Thermally, then, TX-1 can carry the tunnel. The temperature calculation does not say how much life its paper has left, because it says nothing about the paper's condition at the start, or about the water and oxygen that have been working on it for thirty years.

## Water and oxygen

Water speeds paper ageing several-fold according to published research, and it does its damage in other ways too: wet paper and oil have lower electrical strength, and at high temperature, during an overload, water in the paper can form bubbles in the oil near the hot spot, which can lead to a flashover. Almost all of the water in a transformer sits in the paper, not the oil, because cellulose holds water far more strongly. The oil's water content, measured in parts per million, is a window onto the paper's moisture, but a fogged one: the water moves between paper and oil as the temperature changes, so a reading means little unless the oil temperature at sampling is recorded with it.

Oxygen enters through gaskets and, in transformers that breathe through a conservator, through the breather. TX-1's sealed tank keeps most of it out, which is one reason sealed distribution transformers age well. But gaskets harden and leak with age, and every leak that lets oil out can let air and moisture in.

## What oil tests reveal

TX-1's oil has been sampled every year since 2005 and sent to a laboratory for a standard set of tests: dissolved gas analysis (Chapter 3 used its hot-metal gases), water content, acidity, dielectric breakdown voltage and, since 2018, furan analysis. For the paper, three results matter.

1. **Carbon monoxide and carbon dioxide**, from the dissolved gas analysis, show how fast paper is breaking down, especially their trend from year to year.
2. **Water content**, corrected to a standard temperature, shows whether the paper is getting wetter.
3. **Furans**, chiefly 2-furaldehyde, rise as the paper's DP falls. Laboratories estimate the DP from the furan level using published correlations; the estimate is rough, but its trend is informative.

```figure
type: compare
title: TX-1's oil test results relevant to the paper
cols: 2023 | 2024 | 2025 | Trend
rowhead: Result
- Water in oil, corrected to 20 °C | 14 ppm | 19 ppm | 24 ppm | Rising
- 2-furaldehyde | 0.4 mg/kg | 0.9 mg/kg | 1.6 mg/kg | Rising faster
- * Laboratory's estimate of average paper DP | about 550 | about 450 | about 370 | Falling
- Carbon dioxide to carbon monoxide ratio | steady | steady | steady | No sign of a local hot spot in the paper
caption: This is an illustration. The laboratory's DP estimates are based on its own correlation between furans and DP and are averages for the whole winding; the paper at the hot spot is older than the average.
```

## When it goes wrong: the calculation that said TX-1 was young

The plant's first replacement study was done by a planner with the ageing calculation alone. TX-1's historical loads had been lighter than today's, and an estimate of its paper ageing over thirty years gave about 1.5 reference hours per day, about 16,000 hours of reference-rate ageing in 30 years, against the 262,800 hours that 30 years at the reference temperature would represent. The study concluded that TX-1's paper had used only a small fraction of its life and that the transformer could carry the tunnel for another twenty years.

The oil tests said otherwise. The estimated DP had fallen from about 550 to about 370 in two years, and the water content had risen in step. The paper was ageing far faster than its temperature alone could explain, because it was getting wetter, most likely through gaskets that had hardened with age. Wet paper ages several times faster at the same temperature, and the calculation had no term for it.

```figure
type: decision
title: TX-1's future after the oil tests
caption: This is an illustration. The plant chose a planned replacement and asked a specialist to review the condition data before the tender.
- Keep TX-1 for twenty years on the ageing calculation | Ignores the oil tests; risks an unplanned failure with months to replace | Not adopted
- Dry the oil and replace gaskets, then reassess | Slows further ageing; the paper's lost strength is not recovered | Adopted as an interim measure
- * Plan a replacement within two years, sized for the tunnel and future load | Removes the risk on the plant's terms and timetable | Adopted
```

The lesson is that a temperature calculation and an oil test answer different questions. The calculation says how fast the paper is ageing from heat under a given load; the oil test says what state the paper is actually in. Neither is enough alone, and when they disagree, the oil test describes the transformer and the calculation describes an idealised one. A sound assessment combines them: the calculation to compare loading options, the oil tests to set the starting point and to check, year by year, that the paper is ageing as the calculation expects.

## What can be done for old insulation

Some ageing can be slowed; none can be reversed. The options for an old transformer are worth knowing, because they buy time for a planned replacement.

**Oil drying and filtering.** A mobile treatment plant circulates the oil through heaters, filters and a vacuum chamber, removing water, gases and particles. It improves the oil's electrical strength at once, but because most of the water is in the paper, it takes long or repeated treatment, often with the transformer energised and warm, to draw water out of the paper.

**Oil regeneration.** Passing the oil through absorbent earth columns removes acids and the products of oxidation, which otherwise attack the paper and form sludge. It is usually combined with drying.

**Gasket and leak repair.** New gaskets stop the ingress of water and air. On a thirty-year-old sealed tank this is often the most useful single action.

**Load management.** Keeping the hot spot down, by power factor correction (Chapter 4), cooler room air (Chapter 6) or shifting load, slows thermal ageing directly.

None of these restores the strength the paper has lost, so they extend a transformer's life only from where its paper is now. For TX-1, the plant had the oil dried and the gaskets replaced while the replacement was specified and built, which also made the transformer a more reliable stand-by during the changeover.

## Better insulation for the replacement

Two developments are relevant to TX-1's replacement. Thermally upgraded paper is cellulose treated chemically to resist the reactions that break its chains, so it ages more slowly at a given temperature; loading guides allow a higher reference temperature for it. Natural and synthetic ester fluids, made from vegetable oils or by chemical synthesis, can replace mineral oil. They have much higher fire points, which matters for a transformer in a building beside the main switchboard; they hold far more water in solution than mineral oil, drawing it out of the paper and slowing its ageing; and natural esters are readily biodegradable. They cost more and are more viscous, so the transformer must be designed for them. Both are options for the specification in Chapter 10.

## Exercise: the clogged-filter afternoon

On the afternoon the filters were clogged, TX-1's hot spot at the tunnel peak was about 114.5 °C for two hours.

1. What is the relative ageing rate by the 6 K doubling rule?
2. What does the Arrhenius acceleration check tool give with 1.39 eV?
3. How many reference hours of ageing did those two hours cost, compared with the 38 °C room?

**Answer.**

1. V = 2^((114.5 − 98) ÷ 6) = 2^2.75 = 6.73.
2. The [Arrhenius acceleration check tool](/tools/arrhenius-acceleration-check/) with 98 °C and 114.5 °C and 1.39 eV gives an acceleration factor of 6.36, about 6% lower than the doubling rule, as expected above the fitting range.
3. By the doubling rule, 2 × 6.73 = 13.5 reference hours, against 2 × 3.82 = 7.6 hours in the 38 °C room: the clogged filters nearly doubled the paper ageing during the peak. Over the whole day, Chapter 6's room at 43 °C gave 31.9 reference hours against 17.9.
