---
book: heat-exchangers-by-the-numbers
chapterSlug: rating-with-effectiveness-and-ntu
order: 7
title: "Rating an existing exchanger: effectiveness and NTU"
description: "Predict how an existing exchanger performs at new conditions with effectiveness and NTU, without guessing outlet temperatures, and catch a summer rating that nearly bought a second cooler."
draft: false
---

The log mean temperature difference method of Chapters 2 and 3 is natural for **sizing**: the duty and all four temperatures are known, and the area is the unknown. But much of an engineer's work with exchangers is **rating**: the exchanger exists, its area and coefficient are fixed, and the question is how it will perform at different conditions: a hotter summer, a bigger load, a lower flow. Then the outlet temperatures are the unknowns, and the log mean method can only be used by guessing them and iterating, or, worse, by assuming they stay where they were. The **effectiveness–NTU** method answers the rating question directly.

This chapter defines effectiveness and the number of transfer units, gives the relationships for counterflow and for OC-35's one-shell, multi-pass arrangement, and uses them to predict OC-35's oil temperature on a summer day and at a higher production load. The running case finds that a summer rating done by the log mean method, with the outlet temperatures assumed unchanged, concluded that OC-35 could remove only 28 kW and that the press would overheat, when the cooler would in fact remove the full 35 kW with the oil about 3 K warmer, and a second cooler was nearly bought.

## Effectiveness

An exchanger's **effectiveness**, ε, is the ratio of the heat it transfers to the most heat any exchanger could transfer between the same two inlet streams. The most heat would be transferred by an infinitely large counterflow exchanger, in which the stream with the smaller heat capacity rate, C_min, would change temperature all the way from its inlet to the other stream's inlet temperature. So:

ε = Q ÷ Q_max, with Q_max = C_min × (T_hot,in − T_cold,in)

Once ε is known, the duty follows from the two inlet temperatures alone, and both outlet temperatures follow from the duty and each stream's heat capacity rate. No outlet temperature has to be assumed.

## The number of transfer units

The effectiveness of a given exchanger depends on two numbers. The **number of transfer units**, NTU = U × A ÷ C_min, compares the exchanger's conductance with the smaller stream's heat capacity rate: it is a dimensionless measure of the exchanger's size for the duty. The **capacity ratio**, C_r = C_min ÷ C_max, describes the two streams. For each flow arrangement, ε is a known function of NTU and C_r.

```figure
type: formula
title: Effectiveness for counterflow and for one shell with an even number of tube passes
formula: counterflow: ε = (1 − e^(−NTU(1 − C_r))) ÷ (1 − C_r × e^(−NTU(1 − C_r)));   1-shell: ε = 2 ÷ [1 + C_r + √(1 + C_r²) × (1 + e^(−NTU√(1 + C_r²))) ÷ (1 − e^(−NTU√(1 + C_r²)))]
caption: This is an illustration for OC-35 at its design fouling allowance: U × A ≈ 1.91 kW/K, C_min = C_oil ≈ 3.5 kW/K and C_r = 0.5.
- NTU | U × A ÷ C_min
- C_r | C_min ÷ C_max
- ε | Effectiveness, the fraction of the maximum possible duty
step: NTU ≈ 1.91 ÷ 3.5 ≈ 0.546
step: One shell, multi-pass: ε ≈ 0.379
step: At design, with water at 29 °C: oil in ≈ 29 + 35 ÷ (0.379 × 3.5) ≈ 55.4 °C, out ≈ 45.4 °C
```

The curves of ε against NTU, for a given C_r, show the exchanger's diminishing returns. At low NTU, effectiveness rises almost in proportion to size; at high NTU it levels off, and doubling the area adds little.

```figure
type: line
title: Effectiveness against NTU at C_r = 0.5
x: Number of transfer units, NTU
y: Effectiveness
legend: Counterflow | One shell, two or more tube passes
ymin: 0
ymax: 1
caption: These curves follow from the standard relationships. OC-35 works at an NTU of about 0.55, where the two arrangements are almost identical; at large NTU, the one-shell arrangement levels off well below counterflow.
- 0.25 | 0.210 | 0.209
- 0.5 | 0.362 | 0.357
- 0.75 | 0.476 | 0.463
- 1 | 0.565 | 0.540
- 1.5 | 0.691 | 0.639
- 2 | 0.775 | 0.693
- 3 | 0.874 | 0.741
```

## The running case: a summer afternoon

This is an illustration. On a hot, humid summer afternoon, the cooling tower cannot cool the water as far as usual, and it reaches OC-35 at **32 °C** instead of 29 °C. The press still rejects 35 kW to the oil. The question is simply how hot the oil will run, and whether that matters to the press.

## The error: rating with assumed outlets

The first answer used the log mean method. The engineer assumed the oil would still enter at 55 °C and leave at 45 °C, and the water, entering at 32 °C, would leave at 37 °C. The end differences were then 55 − 37 = 18 K and 45 − 32 = 13 K, a log mean of about 15.36 K and, with F ≈ 0.963, a duty of about 1.91 × 0.963 × 15.36 ≈ **28.3 kW**. Since the press puts 35 kW into the oil, the engineer reasoned, the cooler would fall 6.7 kW short and the oil would heat up without limit until the press tripped on high oil temperature. A second, parallel cooler was specified.

The reasoning had a flaw: the assumed temperatures were not consistent. If the oil entered at 55 °C and the cooler removed only 28.3 kW, the oil could not leave at 45 °C; and if the oil warmed, the cooler's driving force would rise and it would remove more heat. The system does not run away; it settles at a new balance where the cooler removes exactly the 35 kW the press adds. The effectiveness–NTU method finds that balance directly. The cooler's effectiveness does not depend on the temperatures, only on its NTU and C_r, so ε ≈ 0.379 still, and:

35 = 0.379 × 3.5 × (T_oil,in − 32), so T_oil,in ≈ **58.4 °C** and T_oil,out ≈ **48.4 °C**.

```figure
type: bars
title: OC-35's oil inlet temperature by condition, °C
unit: °C
max: 65
caption: This is an illustration at the design fouling allowance. A summer day raises the oil about 3 K; a 20% higher production load raises it about 5 K. Neither runs away.
- Design day, water at 29 °C | 55.4
- *Summer day, water at 32 °C | 58.4
- Higher load, 42 kW, water at 29 °C | 60.7
```

The oil runs about 3 K warmer on a summer afternoon, and it cools again as the evening air and the tower water cool. Whether that matters depends on the hydraulic system's limits, not on the cooler: if the oil's maximum working temperature, from the hydraulic system's design, is comfortably above 58 °C, nothing needs to change. In this illustration it was, and the second cooler was cancelled. The check that caught it was a reviewer asking what would actually happen to the oil temperature, a question the log mean calculation could not answer. The general lesson is that rating questions, how an existing exchanger performs at new conditions, should be answered with the effectiveness–NTU method, because it never needs an outlet temperature to be assumed, and assumed outlets are where rating errors hide.

## A higher production load

The same method handles a change of duty. This is an illustration. If a production increase raised the press's heat load to 42 kW with the oil flow unchanged, the oil's temperature drop across the cooler would rise to 42 ÷ 3.5 = 12 K. With water at 29 °C and ε still about 0.379, the oil would enter at about 29 + 42 ÷ (0.379 × 3.5) ≈ **60.7 °C** and leave at about 48.7 °C. On a summer day with water at 32 °C, it would enter at about 63.7 °C. Those figures, compared with the oil's limits, decide whether OC-35 needs more area, cleaner tubes or a colder water supply before the production increase goes ahead.

## A rating table for the operating envelope

Because the effectiveness of a fixed exchanger, at fixed flows, does not change with the temperatures, one number, ε ≈ 0.379 for OC-35 at its design fouling, rates it across its whole operating envelope. A short table of oil inlet temperature against water temperature and heat load gives the plant a map of where the press will run.

```figure
type: compare
title: OC-35's oil inlet temperature across its operating envelope, at the design fouling allowance
cols: 30 kW load | 35 kW load | 42 kW load
caption: This is an illustration with ε ≈ 0.379 and C_oil ≈ 3.5 kW/K, from T_oil,in = t_water,in + Q ÷ (ε × C_oil). The oil leaves 30 ÷ 3.5, 35 ÷ 3.5 or 42 ÷ 3.5 kelvin cooler than it enters.
- Water at 26 °C | 48.6 °C | 52.4 °C | 57.7 °C
- *Water at 29 °C | 51.6 °C | 55.4 °C | 60.7 °C
- Water at 32 °C | 54.6 °C | 58.4 °C | 63.7 °C
- Water at 35 °C | 57.6 °C | 61.4 °C | 66.7 °C
```

The table answers questions before they are asked. If the hydraulic system's oil must stay below, say, 60 °C at the cooler's inlet, OC-35 handles the present 35 kW load with water up to about 33 °C, but the 42 kW production increase only with water at about 28 °C or below, which the tower will not always deliver in summer. The table therefore says which combination needs action, and the action can be chosen: a larger cooler, cleaner tubes, more tower capacity or a load reduction. Each cell took one line of arithmetic.

## Rating and control

Many oil coolers have a thermostatic valve that throttles the water to hold the oil at a set temperature, so that the oil does not run cold, and therefore viscous, in winter or at light load. The effectiveness method shows what such a valve does: by reducing the water flow, it raises the water's outlet temperature and lowers the cooler's effectiveness until the duty just matches the load at the set oil temperature. It also shows the valve's limit: once the valve is fully open, the cooler is at its maximum effectiveness, and any further rise in load or water temperature raises the oil temperature as the table shows. A cooler whose valve is fully open on a design day has no control margin left, which is worth knowing before summer arrives. Minimum water velocities also matter here: a valve that throttles the water to a trickle for long periods lets the tubes foul, as Chapter 6 showed, so many installations prefer to control the tower's water temperature, or bypass part of the oil, rather than starve the cooler of water.

## When the flows change

If a flow changes, so do C_min, C_r and NTU, and usually U as well, because the film coefficient of the changed stream depends on its velocity. The method still works, but U must be recalculated with the correlations of Chapter 5 at the new velocity before NTU is found. For OC-35, a lower water flow changes C_r and slightly lowers U through the small water film; a lower oil flow changes C_min and noticeably lowers U, because the oil film controls. That is why the half-water case of Chapter 1's exercise needs a fresh rating, not a proportional guess.

## Effectiveness and approach

Effectiveness also connects to the approach temperature. With ε known, the cold stream's outlet temperature and the hot stream's outlet are known, and the smallest difference between the streams follows. A heat-recovery exchanger designed for a close approach is an exchanger with high effectiveness, and the curves above show why such exchangers are large: at C_r = 0.5, raising a counterflow exchanger's effectiveness from 0.775 to 0.874 takes NTU from 2 to 3, half as much area again for about 10 percentage points of effectiveness. In a one-shell multi-pass arrangement, the same step is not available at all, because its curve levels off near 0.74, which is the effectiveness view of the F-factor cliff in Chapter 3.

## Effectiveness from site readings

Effectiveness is also the quickest number to calculate from site readings, because it needs only temperatures. When the oil is the C_min stream, as in OC-35, ε equals the oil's temperature drop divided by the difference between the two inlet temperatures: no flow measurement is needed. This is an illustration. Readings of oil 57.0 °C in and 47.0 °C out, with water arriving at 30.5 °C, give ε ≈ 10.0 ÷ 26.5 ≈ 0.377, close to the design-fouling value of 0.379, so the cooler is performing as expected. A reading of ε well below the design figure, at the design flows, points to fouling or to a flow problem, and the conductance calculation of Chapter 6, which does need a flow, tells which. Because ε depends on the flows through C_r and NTU, the readings must be taken at the design flows for the comparison to mean anything; a quick check of the water flow, even with a clamp-on meter, belongs with every effectiveness reading.

## Sizing with effectiveness

The method also sizes exchangers: from the required duty and inlet temperatures, the required ε follows; from ε and C_r, the formula or chart gives the NTU needed; and from NTU, C_min and U, the area. For OC-35's design case, ε = 35 ÷ (3.5 × 26) ≈ 0.385, which on the one-shell curve at C_r = 0.5 needs an NTU of about 0.56, an area of about 0.56 × 3,500 ÷ 349 ≈ 5.6 m², the same as the log mean method gave. The two methods are the same physics written two ways. Use whichever matches the question: the log mean when all temperatures are known, effectiveness when some are not. Many engineers keep both on the same calculation sheet, so that every design is also a rating tool for the conditions it will meet in service.

## Exercise: the cleaned cooler on a summer day

Just after cleaning, OC-35's conductance is about 2.20 kW/K. On a summer day with water at 32 °C and the press's normal 35 kW, what is its NTU, its effectiveness and the oil's inlet temperature? How much of the summer rise does cleaning recover?

**Worked answer.** NTU ≈ 2.20 ÷ 3.5 ≈ **0.629**. At C_r = 0.5, the one-shell formula gives ε ≈ **0.416**. Then the oil enters at about 32 + 35 ÷ (0.416 × 3.5) ≈ **56.1 °C**, leaving at about 46.1 °C.

Against 58.4 °C with the cooler at its design fouling, cleaning lowers the summer oil temperature by about 2.3 K, recovering most of the 3 K that the warmer water added. A plant that schedules OC-35's cleaning just before summer, rather than at fixed intervals, gets the most from each clean, a scheduling decision the effectiveness method makes easy to test with nothing more than the conductance trend of Chapter 6.
