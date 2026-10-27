---
book: heating-and-cooling-times-by-the-numbers
chapterSlug: the-surface-condition
order: 8
title: "The surface condition: radiation, loads and quenchants"
description: "Where surface coefficients come from in furnaces, loaded baskets, tempering ovens and oil quenches, and how a tempering cycle using the hardening coefficient ran half as long as needed."
draft: false
---

Every calculation in this book so far has rested on one number, the surface coefficient h, and Chapter 4 showed that DS-100's heating time is almost proportional to it. The previous chapters took h as given: 150 W/m²·K in the furnace, an assumed 1,000 W/m²·K in the quench. This chapter looks at where such numbers come from and why they change. In a furnace, the coefficient is mostly radiation, and it depends on the furnace temperature, the part's surface, and how much of the hot furnace each part can see past its neighbours. In a quench, it depends on boiling, and changes by an order of magnitude within seconds.

The chapter works through the hardening furnace, the loaded basket, the tempering furnace and the oil quench. The running case's error was carrying the hardening furnace's coefficient over to the tempering furnace, where radiation is much weaker, and writing a tempering heat-up time less than half the real one.

## Radiation in the furnace

Above about 500 °C, radiation carries most of the heat in an electric furnace. Chapter 2 gave its equivalent coefficient, h_rad = ε σ (T_s² + T_f²)(T_s + T_f), with temperatures in kelvin. Three features of that formula govern furnace practice.

First, the coefficient depends strongly on the furnace temperature. With the walls at 850 °C, oxidised steel's h_rad is about 87 W/m²·K when the part is cold and about 254 W/m²·K when it is near temperature. With the walls at 550 °C, the tempering temperature, it is only about 39 W/m²·K when the part is cold and about 99 W/m²·K near temperature. The same part, in the same kind of furnace, heats far more slowly at the lower setting.

Second, the coefficient depends on the part's emissivity, and oxidised steel's is high, about 0.79. A bright, freshly machined surface has a far lower emissivity and heats more slowly until it scales over; in a protective-atmosphere furnace, where the surface stays bright, the difference persists.

Third, convection is a minor partner in a still furnace above about 700 °C, but it is the major partner at low temperatures and wherever a fan moves the atmosphere. That is why most tempering and low-temperature furnaces have circulating fans and most hardening furnaces do not.

```figure
type: compare
title: Radiation coefficient for oxidised steel (ε = 0.8) by furnace and surface temperature
cols: Furnace at 850 °C | Furnace at 550 °C
caption: This is an illustration from h_rad = εσ(T_s² + T_f²)(T_s + T_f) with σ = 5.670 × 10⁻⁸ W/m²·K⁴. It assumes the part sees only the furnace walls. Convection adds roughly 10 W/m²·K in still air and several times that with a fan.
- Part surface at 20 °C | 87 W/m²·K | 39 W/m²·K
- Part surface at 300 °C | 122 W/m²·K | 64 W/m²·K
- Part surface at 500 °C | 160 W/m²·K | 92 W/m²·K
- *Part near furnace temperature | 254 W/m²·K (at 840 °C) | 99 W/m²·K (at 540 °C)
```

## The loaded basket

A single shaft hanging in the furnace sees nothing but hot walls. Six shafts lying side by side on a grid see each other as well, and a neighbour at the same temperature exchanges no net heat. The part of each shaft's view that is taken up by its neighbours is lost to heating. The geometric quantity that measures this is the **view factor**, the fraction of the radiation leaving one surface that strikes another.

This is an illustration. DS-100's load is six shafts in one row on the grid of a heat-resisting steel basket, with 50 mm gaps between their 100 mm bodies. For two long parallel cylinders of equal radius r with a gap s between them, the standard view factor is F = [√(X² − 1) + sin⁻¹(1 ÷ X) − X] ÷ π, with X = 1 + s ÷ 2r. With s = 50 mm and r = 50 mm, X = 1.5 and F ≈ 0.111. A shaft with a neighbour on each side loses about 22 % of its view to them. The grid bars beneath it take a further share, estimated here at about a tenth. So an inner shaft sees the hot walls over roughly 68 to 78 % of its surface, and its effective emissivity-and-view product, ε × F_walls, is between about 0.54 and 0.62.

That is where the book's effective h comes from. Run in the finite-difference model of Chapter 7 with ε × F = 0.58 and 10 W/m²·K of convection, the body's centre reaches 840 °C in about 66.3 minutes, matching the one-term solution's 67.1 minutes at a constant 150 W/m²·K. The end shafts in the row, which have only one neighbour, heat faster; the inner ones are the slow ones and the ones to measure.

```figure
type: bars
title: Share of each shaft's view lost to its neighbours, two neighbours, by gap
unit: %
max: 30
caption: This is an illustration for 100 mm shafts in a single row, from the view factor between two long parallel cylinders. Widening the gap from 25 mm to 150 mm halves the loss, at the cost of fitting fewer shafts in the basket.
- 25 mm gap | 27.2
- *50 mm gap (DS-100's load) | 22.1
- 100 mm gap | 16.3
- 150 mm gap | 12.9
```

The calculation ignores reflections and treats the walls as uniformly hot, so it is an estimate, not a measurement. Its value is that it shows which way the load arrangement pushes the time, and roughly how far. Packing parts more closely puts more metal in each load but makes each part slower to heat, and a load thermocouple, Chapter 9, is the way to settle the trade-off for a real furnace.

## The tempering furnace

After quenching, DS-100 is tempered at 550 °C. Tempering involves no transformation on heating, so the steel's mean specific heat is lower; this illustration uses 560 J/kg·K, between the published 0.519 J/g·K at 150–200 °C and 0.561 J/g·K at 350–400 °C, and a mean conductivity of 39 W/m·K. The target is the centre within 10 K of 550 °C.

## The failure case: the hardening coefficient in the tempering furnace

This is an illustration. When the tempering procedure was written, the planner reused the hardening calculation's 150 W/m²·K, changed the temperatures and properties, and obtained a heat-up time to the body's centre of about **51 minutes**. The tempering hold specified by the heat treatment procedure was then counted from that point.

At 550 °C, radiation is much weaker than at 850 °C. The tempering furnace in this shop has no fan. Run with the loaded effective emissivity of 0.58 and still-air convection of 10 W/m²·K, the finite-difference model gives a centre heat-up time of about **112 minutes**, more than twice the planner's figure. For the first hour of the planned hold, the body's centre was still heating; it was tempered for far less time than the procedure intended.

```figure
type: bars
title: DS-100's body: time for the centre to reach 540 °C in a 550 °C tempering furnace
unit: min
max: 120
caption: This is an illustration from the finite-difference model with c = 560 J/kg·K and k = 39 W/m·K. The fan row assumes a circulating fan raising convection to 40 W/m²·K; the real figure depends on the fan and the load.
- Constant h = 150 W/m²·K, the planner's assumption | 51.4
- Radiation, isolated shaft, ε 0.8, still air | 85.5
- Radiation with circulating fan, ε × F 0.58, h_conv 40 | 77.3
- *Radiation, loaded, ε × F 0.58, still air | 112.0
```

The error was found at the hardness check after tempering, where the shafts were harder than the customer's range and the hardness varied across the section. The planner's calculation had no arithmetic mistake; it had an input borrowed from a different furnace. The correction was to calculate the tempering furnace's own coefficient, confirm it with a load thermocouple, and write the tempering heat-up time as about two hours for this load in this furnace, with the hold counted from the centre reaching temperature. The shop also costed a circulating fan, which would cut the heat-up to about 77 minutes. The general lesson is that a surface coefficient belongs to a furnace, a temperature and a load, and must be recalculated whenever any of the three changes.

## The oil quench

Quenching is where the surface condition is least constant. When a hot part enters oil, the oil next to it vaporises and forms a film of vapour over the surface. Vapour conducts heat poorly, so the first stage of a quench is relatively slow. As the surface cools, the film collapses and the oil boils violently in contact with the metal: the second stage, nucleate boiling, removes heat far faster than the first. When the surface falls below the oil's boiling range, boiling stops, and the third stage is ordinary convection, slower again. The surface coefficient therefore rises and falls by a large factor during a single quench, and the stage boundaries move with the oil's type, temperature, age and agitation.

The heat treatment industry describes quench severity in several ways. One long-established measure is the **Grossmann H-value**, which expresses severity through the surface heat transfer coefficient and the steel's conductivity; still oils have low H-values and agitated water and brine much higher ones. A more complete description comes from **cooling-curve tests**, in which an instrumented probe is quenched and its centre temperature logged; ASTM D6200 is the standard test for quench oils. The cooling curve, and its rate against temperature, shows where the vapour stage ends and how fast the oil cools through the temperatures that matter for hardening. Oil suppliers publish such curves, and well-run quench tanks have their oil tested periodically.

For calculation, the practical approach is to treat the quench coefficient as uncertain and to bracket it. This book's 1,000 W/m²·K is an assumption chosen to illustrate the method, not a property of any oil.

```figure
type: compare
title: DS-100's body: time for the centre to fall to 300 °C, by assumed quench coefficient
cols: Biot number on radius | Centre at 300 °C
caption: This is an illustration from the finite-difference model with oil at 60 °C, a constant coefficient and constant properties. Doubling h from 1,000 to 2,000 W/m²·K saves only about 74 s, because at Biot numbers above about 1 the steel's own conduction starts to govern.
- 500 W/m²·K | 0.76 | 412 s
- *1,000 W/m²·K | 1.52 | 260 s
- 2,000 W/m²·K | 3.03 | 186 s
- 4,000 W/m²·K | 6.06 | 148 s
```

The figure shows why a constant-coefficient estimate is still useful for a lift-out time even though the real coefficient is not constant. The centre's cooling time is relatively insensitive to h once the Biot number is above about 1, so a reasonable bracket on h gives a usable bracket on the time. For DS-100, a lift-out time set from the low end of the bracket, about seven minutes for an h of 500 W/m²·K, would be safe even if the oil were sluggish. What the constant-coefficient model cannot do is predict hardness, which depends on the cooling rate through particular temperature ranges and so on the stages. That needs the oil's measured cooling curve as the surface condition, in a model like Chapter 7's with h as a table against surface temperature, and in the end it needs metallurgical testing.

### Oil temperature and agitation

Two settings that the shop controls change the quench's surface condition as much as the choice of oil. The oil's temperature changes its viscosity and the stability of the vapour film; the tank's agitation, from pumps or propellers, sweeps vapour from the surface and shortens the vapour stage. Both are reasons why a quench that worked in winter can behave differently in summer, and why the oil temperature and the agitator's running state belong on every quench record. A part that sits in a dead corner of a tank, away from the flow, sees a gentler quench than one in the flow path, which is the quench's equivalent of the shaded shaft in the furnace.

## Measuring a coefficient

The most reliable surface coefficient for a furnace, a load or a quench is a measured one. Chapter 2 showed how to take it from a small lumped probe's heating curve; for a real load, the finite-difference model can be run with different effective emissivities until it matches a load thermocouple's trace, which is how the 0.58 above would be confirmed in practice. A coefficient fitted that way carries the furnace's real geometry, wall temperatures, recovery and load arrangement within it, and it should be refitted when any of those change.

## How this applies to a small Australian business

The surface coefficient is the input most worth getting right, and it is a property of the process, not the part. Radiation coefficients can be calculated from temperatures and emissivity, but the load's shading and the furnace's recovery are easier to measure than to calculate. Quench coefficients are the least certain of all and are best bracketed, with the decision taken at the safe end of the bracket and confirmed by testing. A business with more than one furnace, or one furnace used at several temperatures, needs a separate coefficient for each combination; a single number on a process sheet, borrowed from a different furnace, is the commonest single cause of a cycle that is quietly wrong.

## Exercise: a wider gap

To speed up heating, the shop considers spacing DS-100's shafts with 100 mm gaps, fitting four shafts in the basket instead of six. Using the view factor above, estimate the inner shafts' effective ε × F with the grid taking a tenth of the view, and say in which direction and roughly how far the body's heat-up time changes. Is fewer, faster shafts per load a good trade?

**Worked answer.** With a 100 mm gap, X = 1 + 0.1 ÷ 0.1 = 2, and F = [√3 + sin⁻¹(0.5) − 2] ÷ π ≈ (1.732 + 0.524 − 2) ÷ π ≈ 0.081 per neighbour, about 0.163 for two. With a tenth of the view to the grid, the inner shafts see the walls over about 1 − 0.163 − 0.10 ≈ 0.74 of their surface, giving ε × F ≈ 0.8 × 0.74 ≈ **0.59**, against about 0.54 on the same basis for the 50 mm gap. The effective coefficient rises by about 9 %, and the finite-difference model, run with 0.543 and 0.59, gives heat-up times of about 70.2 and 65.3 minutes: about **5 minutes** saved, roughly 7 %.

That is not a good trade on its own: the load drops from six shafts to four, a third fewer, to save about 7 % of the heat-up time, and the hold and quench take as long as before. Chapter 10 shows how to compare such options by shafts per furnace-hour. Wider spacing pays when the heat-up time, not the number of parts per load, limits the cycle, and when parts must be spaced anyway for even quenching.
