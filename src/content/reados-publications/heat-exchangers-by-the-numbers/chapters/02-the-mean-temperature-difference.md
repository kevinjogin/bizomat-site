---
book: heat-exchangers-by-the-numbers
chapterSlug: the-mean-temperature-difference
order: 2
title: "The mean temperature difference"
description: "Find the temperature difference that drives an exchanger: counterflow and parallel flow, the log mean, crosses and approach, and catch an arithmetic mean that left a heat-recovery duty 12% short."
draft: false
---

Heat crosses an exchanger's wall because one fluid is hotter than the other, and the rate at each point is proportional to the temperature difference there. But the difference changes along the exchanger: wide where the hot fluid enters, narrow where it leaves, or the other way round. To size the whole exchanger, the designer needs a single mean temperature difference that, multiplied by the area and the overall coefficient, gives the duty. The right mean is not the simple average of the two ends but a logarithmic one, and the difference matters most exactly where exchangers are hardest: close approaches and lopsided ends.

This chapter derives the log mean temperature difference for counterflow and parallel flow, explains why counterflow is almost always preferred, introduces the approach and the temperature cross, and sets out the design equation that turns a duty into an area. The running case finds that a proposal to recover OC-35's heat into the plant's parts-washer water was first estimated with the arithmetic mean temperature difference, which understated the area needed by about 12%.

## The design equation

The duty of an exchanger is the product of three things: its area, its overall heat transfer coefficient and its mean temperature difference.

Q = U × A × ΔT_m

The overall coefficient U, in W/(m²·K), describes how easily heat crosses from one fluid to the other through the films, fouling and wall, and Chapters 4 to 6 build it up. The area A is what the designer is usually solving for. The mean temperature difference ΔT_m is the subject of this chapter. Given the duty from Chapter 1 and U, the area follows directly once ΔT_m is known.

## The log mean temperature difference

In an exchanger where each stream's temperature changes linearly with the heat transferred, as it does for a stream of constant specific heat, the local temperature difference varies exponentially along the area, and integrating the local heat transfer gives a mean that depends only on the differences at the two ends:

```figure
type: formula
title: Log mean temperature difference
formula: ΔT_lm = (ΔT₁ − ΔT₂) ÷ ln(ΔT₁ ÷ ΔT₂)
caption: This is an illustration for OC-35 in counterflow. ΔT₁ and ΔT₂ are the temperature differences between the streams at the two ends of the exchanger. If they are equal, the mean is simply that difference.
- ΔT₁ | Temperature difference at one end, K
- ΔT₂ | Temperature difference at the other end, K
step: Counterflow, hot end: 55 − 34 = 21 K; cold end: 45 − 29 = 16 K
step: ΔT_lm = (21 − 16) ÷ ln(21 ÷ 16) ≈ 18.39 K
step: The arithmetic mean, (21 + 16) ÷ 2 = 18.5 K, is within 0.6% here, because the ends are similar
```

The log mean is always smaller than the arithmetic mean, and the gap grows as the two end differences grow apart. When the ends are similar, as for OC-35, the arithmetic mean is a fair estimate; when one end is several times the other, it overstates the driving force considerably, and an exchanger sized with it will be too small.

## Counterflow and parallel flow

In **counterflow**, the two streams enter at opposite ends and flow in opposite directions; in **parallel flow**, they enter at the same end and flow together. For OC-35's temperatures, counterflow pairs the hot oil inlet with the warm water outlet at one end, and the cool oil outlet with the cold water inlet at the other. Parallel flow pairs the hot oil inlet with the cold water inlet, a large difference of 55 − 29 = 26 K, and the oil outlet with the water outlet, a small one of 45 − 34 = 11 K.

```figure
type: compare
title: Mean temperature differences for three duties
cols: End differences | Log mean | Arithmetic mean | Arithmetic mean's error in area
caption: This is an illustration. The arithmetic mean always overstates the driving force; the error is small when the ends are similar and large when they are not.
- OC-35, counterflow | 21 K and 16 K | 18.39 K | 18.50 K | 0.6% too little area
- OC-35, if piped in parallel flow | 26 K and 11 K | 17.44 K | 18.50 K | 5.7% too little area
- *Heat recovery, counterflow | 7 K and 25 K | 14.14 K | 16.00 K | 11.6% too little area
```

For OC-35, parallel flow would give a log mean of about 17.44 K against 18.39 K in counterflow, about 5% less, so the same exchanger would need about 5% more area. That is a modest penalty here, but counterflow has a more important advantage: it allows the cold stream to leave hotter than the hot stream leaves, which parallel flow can never do, because in parallel flow the two outlets can at best approach each other.

## Approach and the temperature cross

The **approach** is the smallest temperature difference between the streams anywhere in the exchanger, usually at one end. A close approach recovers more heat but needs much more area, because the driving force near that end is small. For OC-35 the approach is 16 K, generous for a cooler. Heat-recovery exchangers, whose purpose is to extract as much heat as possible, run much closer, often a few kelvin.

A **temperature cross** occurs when the cold stream leaves hotter than the hot stream leaves. In pure counterflow, a cross is possible and normal for close-approach duties. In parallel flow it is impossible. In multi-pass shell-and-tube exchangers, where the flow is partly counter and partly parallel, a cross is possible only up to a limit, which is the subject of Chapter 3. The temperature diagram of Chapter 1 shows a cross at once: the cold stream's outlet sits above the hot stream's outlet.

## The running case: recovering OC-35's heat

This is an illustration. OC-35 rejects 35 kW to the cooling tower, around the clock in production. The plant's parts washer heats fresh water from about **20 °C** to about **48 °C** with an electric heater. A proposal suggested passing that fresh water through a second exchanger fed with the hot oil before it reached OC-35, so that the oil's heat preheated the washer water. With the oil still cooling from 55 °C to 45 °C and giving up 35 kW, the washer water's heat capacity rate would be 35 ÷ 28 ≈ 1.25 kW/K, about 0.30 kg/s.

In counterflow, the hot end pairs the oil inlet at 55 °C with the water outlet at 48 °C, a difference of only **7 K**; the cold end pairs the oil outlet at 45 °C with the water inlet at 20 °C, **25 K**. The water would leave at 48 °C, above the oil's 45 °C outlet: a temperature cross, possible in counterflow but not in parallel flow.

## The error: the arithmetic mean on a lopsided duty

The proposal's first estimate used the arithmetic mean temperature difference, (7 + 25) ÷ 2 = **16.0 K**, a habit carried over from calculations where the ends were similar. The log mean is (25 − 7) ÷ ln(25 ÷ 7) ≈ **14.14 K**. With the arithmetic mean, the estimated area was about 11.6% too small: an exchanger built to it would fall short of the 48 °C target, and the parts washer's heater would make up the difference, eroding the saving the project was justified on.

```figure
type: line
title: Oil and water temperatures along the heat-recovery exchanger, counterflow
x: Share of the duty transferred, %
y: Temperature, °C
legend: Hydraulic oil | Parts-washer water
ymin: 15
ymax: 60
caption: This is an illustration. The gap between the lines, the local driving force, narrows from 25 K at the water inlet end to 7 K at the water outlet end; the log mean of about 14.1 K reflects how much of the area works across a small gap.
- 0 | 45.0 | 20.0
- 25 | 47.5 | 27.0
- 50 | 50.0 | 34.0
- 75 | 52.5 | 41.0
- 100 | 55.0 | 48.0
```

The check that caught it was the habit this chapter recommends: compute the log mean every time, because it costs nothing more than the arithmetic mean and is never wrong for these simple cases. The general lesson is that the arithmetic mean is a shortcut that fails exactly in close-approach and heat-recovery duties, which are the exchangers where area is most expensive and performance matters most.

## The cost of the last few kelvin

The heat-recovery proposal shows a general pattern. With the oil fixed at 55 °C to 45 °C and 35 kW, and the washer water entering at 20 °C, the hot-end approach depends on how hot the water is asked to leave. This is an illustration, with the same U throughout. An approach of 15 K, water leaving at 40 °C, needs about 0.72 times the area of the 7 K design; 10 K needs about 0.86 times; 5 K about 1.14 times; 3 K about 1.36 times; and 2 K about 1.55 times. Each step closer costs more area than the one before, while the extra heat delivered to the washer water is the same duty spread over a smaller flow at a higher temperature.

The right approach is therefore an economic choice: the cost of area against the value of the heat recovered, which depends on what the recovered heat displaces, here electricity for the washer heater. For coolers like OC-35, whose job is simply to get rid of heat, approaches are generous and area is cheap. For heat recovery, the approach is chosen by comparing the annual saving at each outlet temperature with the cost of the exchanger that achieves it, and the log mean makes that comparison quick to set up: a short table of outlet temperature, area and annual saving, computed in a few minutes, settles a question that is otherwise argued by instinct.

## Crossflow exchangers

Many exchangers are neither counterflow nor parallel flow but **crossflow**: one fluid flows across the other at right angles. Air-cooled exchangers, car radiators and the fin-and-tube coils of air-conditioning units are crossflow, with air blowing across tubes carrying liquid. An air-blast oil cooler, a common alternative to OC-35 on hydraulic power units, is one. Crossflow performance lies between counterflow and parallel flow, and it is handled like the multi-pass exchangers of Chapter 3: the counterflow log mean is multiplied by a correction factor less than one, read from charts or calculated from published formulas for each crossflow arrangement, or the effectiveness–NTU method of Chapter 7 is used directly.

## The mean difference in service

The log mean is also the key to checking an exchanger in service. With thermometers on all four connections and a measured flow, the duty and the log mean can be calculated, and their ratio gives the product U × A, the exchanger's **conductance**. Because A does not change, any change in U × A over months shows a change in U, almost always from fouling, which Chapter 6 tracks. This is an illustration. If OC-35, measured in its first month while still clean, transfers 35 kW across a log mean of about 15.9 K, because a clean exchanger lets the oil leave cooler, its U × A is about 2.20 kW/K. If a year later it transfers only 30 kW across a log mean of 21 K, its U × A has fallen to about 1.43 kW/K, about 35% lower, and its tubes need cleaning.

## Why the log mean works

The logarithm appears because the local heat transfer depends on the local difference, and the local difference depends on how much heat has already been transferred. Along a counterflow exchanger with constant specific heats, both streams' temperatures change linearly with the heat transferred, so their difference also changes linearly with the heat transferred. But heat is transferred in proportion to the difference, so the rate at which the difference changes along the area is proportional to the difference itself: an exponential. Integrating an exponential gives a logarithm. The result holds whenever the specific heats are roughly constant and U is roughly uniform; when either varies strongly, as with a fluid near its boiling point or an oil whose viscosity changes greatly across the exchanger, the exchanger is divided into zones and each is calculated with its own log mean.

## Sizing OC-35

With the design equation, OC-35's area follows once U is known. This is an illustration, anticipating Chapters 3 to 6: with an overall coefficient of about 349 W/(m²·K) including fouling, and the counterflow log mean of 18.39 K reduced slightly by the multi-pass correction of Chapter 3, the area needed is about **5.6 m²**. A designer can see at once how sensitive that is to the temperatures: if the water arrived at 31 °C instead of 29 °C, the end differences would fall to 19 K and 14 K, the log mean to about 16.4 K, and the area needed would rise by about 12%, which is why the summer water temperature belongs on the data sheet. A cooler that is just adequate at 29 °C water will run its oil hot on the first warm, humid afternoon, when the tower cannot reach its design temperature, and the oil's temperature, not the cooler, will be blamed.

## Exercise: a closer approach

To reduce the parts washer's electric heating further, the proposal now asks for the washer water to leave at 52 °C instead of 48 °C, with the oil still cooling from 55 °C to 45 °C. What is the water's heat capacity rate, the log mean temperature difference and the ratio of the area needed to the 48 °C design?

**Worked answer.** The water now rises 32 K for 35 kW, so its heat capacity rate is 35 ÷ 32 ≈ **1.09 kW/K**. In counterflow, the ends are 55 − 52 = **3 K** and 45 − 20 = **25 K**, and the log mean is (25 − 3) ÷ ln(25 ÷ 3) ≈ **10.38 K**.

With the same U, the area needed scales inversely with the log mean: 14.14 ÷ 10.38 ≈ **1.36**, about 36% more area for 4 K more water temperature. The approach of 3 K is close: the last few kelvin of a close-approach duty cost far more area than the first, and the economic choice of outlet temperature is a balance between that area and the electricity saved.
