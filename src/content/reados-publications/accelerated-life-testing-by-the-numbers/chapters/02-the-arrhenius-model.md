---
book: accelerated-life-testing-by-the-numbers
chapterSlug: the-arrhenius-model
order: 2
title: "The Boltzmann factor and the Arrhenius model"
description: "Why rates rise steeply with temperature, the Arrhenius acceleration factor and its sensitivity to activation energy, averaging a profile, and an activation energy from the wrong part."
draft: false
---

Most of the processes that wear products out are chemical or diffusive: an electrolyte reacts with an electrode, a polymer oxidises, atoms migrate through a metal, a gas permeates a seal. Each of them happens when a molecule or atom gains enough energy from the random jostling of its neighbours to get over a barrier, and the chance of that rises steeply with temperature. That steep rise is what makes temperature the most widely used accelerating stress, and it is described by one of the most important equations in physics.

This chapter derives the Arrhenius model from the Boltzmann factor, shows how to calculate an acceleration factor and how sensitive it is to the one parameter that must be known, the activation energy, explains how to average a profile of service temperatures properly, and relates the model to the "10 degree rule" that appears on component data sheets. It ends with an activation energy that was copied from the wrong kind of part.

## The Boltzmann factor

In any material at temperature T, energy is shared among its atoms and molecules unevenly and at random. Statistical physics shows that the probability of finding a particular molecule in a state with energy E above the lowest state is proportional to the **Boltzmann factor**, exp(−E/kT), where k is the Boltzmann constant, 8.617 × 10⁻⁵ eV/K, and T is the absolute temperature. At 55 °C, kT is about 0.0283 eV, the typical size of the random energy each molecule carries.

A chemical reaction or a diffusive hop needs a molecule to gather an energy Ea, the **activation energy**, before it can proceed. For an activation energy of 0.7 eV, which is about 24.7 times kT at 55 °C, the Boltzmann factor is exp(−24.75), about **1.8 × 10⁻¹¹**: only a tiny fraction of attempts succeed. Raise the temperature to 105 °C and the factor becomes about **4.7 × 10⁻¹⁰**, roughly 26 times larger. Nothing about the molecules has changed except how much random energy they carry, but because the barrier sits far out on the tail of the distribution, a modest rise in temperature multiplies the number that get over it.

```figure
type: formula
title: The Arrhenius model and its acceleration factor
formula: rate = A·exp(−Ea / kT)     AF = exp[(Ea / k)·(1/Tuse − 1/Ttest)]
caption: Temperatures are absolute, in kelvin. A cancels in the acceleration factor, leaving the activation energy as the only parameter that must be known.
- A | a constant for the process
- Ea | activation energy of the failure mechanism, eV
- k | Boltzmann constant, 8.617333262 × 10⁻⁵ eV/K
- Tuse, Ttest | absolute temperatures in use and in test, K
step: Ea = 0.7 eV, 55 °C to 105 °C: AF = exp[(0.7 ÷ 8.617 × 10⁻⁵) × (1/328.15 − 1/378.15)] = 26.4
step: Check against NIST: 25 °C to 125 °C gives 133 at 0.5 eV and about 17,600 at 1.0 eV
```

If the rate of the wear-out process follows the Boltzmann factor, so does the time to reach a given amount of damage, and the life at one temperature divided by the life at another is the acceleration factor in the figure. The model is empirical in the sense that real failure processes are rarely a single clean reaction, but it describes a wide range of chemical, diffusion and migration mechanisms well, as the NIST/SEMATECH handbook notes, and it is the default model for temperature acceleration. It does not describe mechanical fatigue, which Chapter 5 treats separately.

The same equation runs through other books in this series. [Temperature and the Arrhenius law](/reados/publications/diffusion-by-the-numbers/temperature-and-the-arrhenius-law/) in *Diffusion by the Numbers* applies it to carbon moving through steel in a carburising furnace, where the activation energy is much larger and the temperatures far higher, but the arithmetic is identical.

## Sensitivity to the activation energy

The activation energy sits inside an exponential, so the acceleration factor is extremely sensitive to it. The NIST/SEMATECH handbook gives a typical range for failure mechanisms of about 0.3 eV to 1.5 eV, and across even part of that range the factor changes by more than an order of magnitude.

```figure
type: compare
title: Arrhenius acceleration factor by activation energy
cols: 55 °C to 85 °C | 55 °C to 105 °C | Test hours for 43,800 h at 55 °C, testing at 105 °C
caption: Calculated with the CODATA Boltzmann constant. The same 50 K rise gives a factor of 4 or of 171 depending on Ea, so an assumed activation energy decides the answer.
- 0.3 eV | 2.4 | 4.1 | about 10,700
- 0.5 eV | 4.4 | 10.4 | 4,228
- * 0.7 eV | 8.0 | 26.4 | 1,660
- 0.9 eV | 14.4 | 67.2 | 651
- 1.1 eV | 26.0 | 171.3 | about 256
```

The right-hand column shows what is at stake. If FL-60's capacitor mechanism has an activation energy of 0.7 eV, a test at 105 °C must run about 1,660 hours to represent 43,800 hours at 55 °C. If it is really 0.5 eV, the same test needs about 4,228 hours, and a 1,660-hour test would represent only about 17,000 hours of service, under half the design life. The activation energy must therefore come from evidence for the specific mechanism: the component maker's life data, published measurements for that mechanism, or a test at two or three temperatures, as Chapter 8 describes. A value taken from a table for a different mechanism is a guess dressed as a number.

### Where activation energies come from

There are three sources of an activation energy, in rough order of preference. The first is the **component maker's life data** for the part and mechanism in question, usually given as a life rule or a life at two temperatures, from which an activation energy can be calculated. The second is **published measurements** for the same mechanism in similar materials, in the reliability literature or in industry guides that tabulate mechanisms and typical values; these are useful for a first plan but carry the uncertainty of a different material and process. The third is a **measurement** on the product's own parts at two or three test temperatures, which gives the activation energy directly from how the life or degradation rate changes; it is the most convincing and the most expensive, and Chapter 8 shows a practical way to do it with degradation data rather than waiting for failures.

Whichever source is used, the report should state it, and should show the result at the ends of a plausible range as well as at the chosen value. A prediction that holds across 0.5 to 0.9 eV is robust; one that holds only at exactly 0.7 eV is not.

## Two mechanisms, two activation energies

Real products often have more than one wear-out mechanism in the same part, with different activation energies, and the Arrhenius model then holds a trap. The mechanism with the larger activation energy speeds up more with temperature, so it dominates at test temperatures; the mechanism with the smaller activation energy speeds up less, so it may dominate in service.

This is an illustration. Suppose a driver has two mechanisms: A, with Ea = 0.7 eV, which fails units in about 2,000 hours at a 105 °C test; and B, with Ea = 0.3 eV, which would fail them in about 10,000 hours at 105 °C. At test, every failure is from A, and B is never seen. At the 57.9 °C effective use temperature, A's life becomes 2,000 × 21.2 = about **42,500 hours**, but B's becomes 10,000 × 3.71 = about **37,100 hours**. In service, B fails units first, and the test, however well run, never revealed it.

The defences are to identify mechanisms by failure analysis of every test failure, to run at more than one test temperature when the stakes justify it, so that a change in the dominant mechanism shows up, and to compare early field returns with the test's predictions, as Chapter 9 does.

## Limits at the top of the range

The model also has an upper limit set by the physics of the part. Above a component's rated temperature, a polymer's glass transition, a solder's softening range or an electrolyte's boiling point, the material behaves differently and a new mechanism appears, as Chapter 1's 85 °C test showed. The test temperature must stay safely below every such limit for every material in the test item, which is why FL-60's driver is tested alone, with its capacitor cores at or below their 105 °C rating, rather than inside a hot luminaire.

## The 10 degree rule

Many component data sheets, especially for aluminium electrolytic capacitors, state a simpler rule: life doubles for each 10 K fall in temperature. It is a convenient approximation of the Arrhenius model, but it does not correspond to a single activation energy. Solving the Arrhenius equation for a factor of exactly 2 over 10 K gives an activation energy of about **0.55 eV** between 25 °C and 35 °C, **0.66 eV** between 55 °C and 65 °C, and **0.83 eV** between 95 °C and 105 °C. The rule is therefore gentler than a fixed 0.7 eV at room temperature and steeper at high temperature.

```figure
type: line
title: Activation energy implied by "life doubles every 10 K"
x: Lower temperature of the 10 K step, °C
y: Implied activation energy, eV
ymin: 0.4
ymax: 0.9
caption: Calculated from the Arrhenius equation. The rule is an approximation whose implied activation energy rises with temperature; for a capacitor, follow the maker's own rule over the maker's stated range.
- 25 | 0.55
- 55 | 0.66
- 95 | 0.83
```

The practical advice is to use the maker's rule for the maker's part over the range the maker states, because that rule was fitted to the part's own life data, and to use an Arrhenius model with a mechanism-specific activation energy elsewhere. Chapter 3 applies both to FL-60's capacitors and shows that they give similar answers over FL-60's range.

## Averaging a temperature profile

FL-60's capacitor cores do not sit at one temperature. Chapter 1's profile puts them at 45 °C for 25% of operating hours, 55 °C for 50%, 65 °C for 20% and 75 °C for 5%. The arithmetic mean is 55.5 °C, but averaging temperatures is the wrong operation. What accumulates is damage, and damage accumulates at a rate that follows the Boltzmann factor, so the rates must be averaged, not the temperatures.

This is an illustration. With Ea = 0.7 eV, the rates at the four temperatures, relative to the rate at 55 °C, are 0.459, 1.000, 2.079 and 4.146. Weighting each by its share of hours and adding gives an average relative rate of **1.238**. The temperature at which a constant rate would equal this average, the **effective temperature**, is **57.9 °C**: 2.4 K hotter than the arithmetic mean.

```figure
type: bars
title: Share of FL-60's capacitor wear by core temperature, Ea = 0.7 eV
unit: %
max: 45
caption: This is an illustration. The 5% of hours at 75 °C cause about 17% of the wear, more than the 25% of hours at 45 °C. The effective temperature is 57.9 °C.
- 45 °C, 25% of hours | 9.3
- * 55 °C, 50% of hours | 40.4
- 65 °C, 20% of hours | 33.6
- 75 °C, 5% of hours | 16.7
```

The hot hours count for more than their share of time, because the Boltzmann factor makes them disproportionately damaging. The effective temperature depends a little on the activation energy, 57.1 °C at 0.5 eV and 58.6 °C at 0.9 eV, because a larger activation energy weights the hot hours more heavily. From here on, FL-60's capacitor calculations use the effective temperature of 57.9 °C, at which the acceleration factor to a 105 °C test is **21.2**, so a design life of 43,800 hours needs about **2,061 hours** of test.

## The error: an activation energy from the wrong part

This is an illustration. In planning the first driver test, a junior engineer looked up an activation energy and found **1.0 eV** in the reliability report for one of the driver's integrated circuits, where it described a semiconductor failure mechanism. With 1.0 eV, the acceleration factor from 57.9 °C to 105 °C is **78.7**, so the 43,800-hour design life needed only **556 hours** of test, and the engineer planned a test of that length, delighted to fit it into four weeks.

The plan was caught at review, where the reviewer asked what mechanism the 1.0 eV described. The integrated circuit's mechanism was not the one expected to limit the driver's life: that was the electrolytic capacitors, whose maker's rule implies roughly 0.7 to 0.8 eV over this range. At 0.7 eV, 556 hours at 105 °C represents only about 556 × 21.2 = **11,800 hours** of service, about a quarter of the design life. Had the test passed, it would have been reported as demonstrating ten years when it had demonstrated less than three.

The test plan was rewritten with the capacitor's own life rule as the primary model, an Arrhenius cross-check at 0.7 eV, and a test duration set by the more conservative of the two. The plan now states, for every acceleration factor, the mechanism it applies to and the source of its parameter, and a reviewer signs it off before chamber time is booked.

```figure
type: checklist
title: Checks on an Arrhenius acceleration factor
caption: The open item is this chapter's error. An activation energy belongs to a mechanism, not to a product.
- x Mechanism named | capacitor electrolyte loss
- x Temperatures absolute and measured on the part | core temperature, not chamber air
- x Use temperature from rate-weighted profile | 57.9 °C, not the 55.5 °C mean
- x Sensitivity to Ea shown | 0.5 to 0.9 eV bracket reported
- ? Activation energy sourced for this mechanism | 1.0 eV from an IC report: test a quarter of the needed length
```

## How this applies to a small Australian business

Small manufacturers rarely have the resources to measure activation energies, and they do not need to for most products. They need to identify the life-limiting part, find its maker's life data and rule, apply it to a realistic profile of service temperatures, and report the result with its sensitivity to the parameters, so that whoever approves the product understands how firm the prediction is. Component makers publish far more life data than most buyers read, and their application engineers will usually advise on what their parts' life rules assume. The temperatures themselves must be measured on the parts, in the product, in conditions representing Australian service, with the attention to sensor placement that any good temperature measurement needs.

## Exercise: testing at 95 °C

The capacitor maker advises against running the cores continuously at their full rated 105 °C during a long test, so the business considers a test with cores at **95 °C**. Using Ea = 0.7 eV and the effective use temperature of 57.9 °C, what is the acceleration factor, and how many test hours represent one design life of 43,800 hours?

**Worked answer.** AF = exp[(0.7 ÷ 8.617 × 10⁻⁵) × (1/331.05 − 1/368.15)] = exp(8,123 × 3.044 × 10⁻⁴) = exp(2.473) = **11.9**. One design life needs 43,800 ÷ 11.9 = about **3,695 hours**, about 22 weeks of continuous testing, against about 2,061 hours at 105 °C. Lowering the test temperature by 10 K has nearly doubled the test time, which is the doubling rule seen from the other side. The business must weigh the maker's advice against the chamber time, and Chapter 7 shows how adding test units can buy back some of the time.
