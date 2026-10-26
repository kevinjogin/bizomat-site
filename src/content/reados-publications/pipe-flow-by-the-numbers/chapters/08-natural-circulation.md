---
book: pipe-flow-by-the-numbers
chapterSlug: natural-circulation
order: 8
title: "Natural circulation"
description: "How density difference drives flow, the driving head of CW-2's roof cooler loop, its flow and heat, why heat grows with ΔT to the power 1.5, and a check valve that stopped it."
draft: false
---

Warm water is lighter than cool water. In a loop with a heat source low down and a heat sink high up, the warm water rises from the source, cools in the sink, and the cooler, heavier water falls back to be heated again. The loop circulates on its own, with no pump, for as long as heat goes in at the bottom and comes out at the top. That is **natural circulation**, and it is how solar water heaters with tanks above their collectors work, how many old heating systems worked, and how some plant is designed to keep cooling when its pumps have no power.

This chapter sets out the conditions for natural circulation, calculates the driving head of a natural-circulation loop added to CW-2, solves the flow and heat it carries, shows how they change with the temperature difference and the pipe size, and ends with a check valve that stopped the loop dead.

## Forced and natural circulation

In **forced circulation**, a pump drives the flow, and the flow is whatever the pump's curve and the system's curve agree on. In **natural circulation**, the driving force is the difference in weight between the column of cool water on one side of the loop and the column of warm water on the other. Natural circulation needs four things:

1. **A heat source below a heat sink**, so that the warm side of the loop is the rising side.
2. **A temperature difference** between the two sides, which gives the density difference.
3. **A continuous flow path**, with no valves closed and no air pockets blocking it.
4. **Low resistance**, because the driving head is small and every loss in the loop competes with it.

The fourth is the one that catches people out. Natural circulation can carry useful amounts of heat, but only through a loop designed for it, with generous pipes and few fittings.

## CW-2's roof cooler loop

This is an illustration. CW-2's tank is cooled normally by a pumped cooler. As a backup during power failures, when the moulding machines stop but their moulds and oil still hold heat, the plant added a finned cooling coil on the roof, 6 m above the tank's water, connected by an 80.9 mm bore pipe loop with no pump. Warm water rises from the top of the tank through one pipe to the coil, is cooled there, and returns through the other pipe to the bottom of the tank.

With the tank at 32 °C and the coil cooling the water to 25 °C, the rising column is water at 32 °C, density 995.03 kg/m³, and the falling column is water at 25 °C, density 997.05 kg/m³.

## The thermal driving head

The driving pressure is the difference in weight between the two columns, over the height between the centre of heating and the centre of cooling:

Δp = (ρ_cool − ρ_warm) × g × H.

```figure
type: formula
title: Thermal driving head of the roof cooler loop
formula: Δp = (ρ_cool − ρ_warm) × g × H
caption: This is an illustration. The driving pressure is about 0.12 kPa, roughly a thousandth of what CW-2's pump provides.
- ρ_cool | Density of the falling water at 25 °C, 997.05 kg/m³
- ρ_warm | Density of the rising water at 32 °C, 995.03 kg/m³
- H | Height from the tank to the coil, 6 m
step: Δp = (997.05 − 995.03) × 9.807 × 6 = 118.9 Pa
step: As a head of water: 118.9 ÷ (997.05 × 9.807) = 0.0122 m, about 12 mm
```

The whole driving force of the loop is 12 mm of water. CW-2's pump, by comparison, provides nearly 11 m. Natural circulation is real and reliable, but it is weak, and that sets everything about how such a loop must be designed.

## The flow it drives

The loop flows at whatever rate makes its losses equal its driving head. This is an illustration. The loop has 18 m of 80.9 mm pipe, four long-radius elbows, an entrance and an exit, and the coil, whose resistance, from its maker's data, is equivalent to a K of 10 at the pipe's velocity, for a total K of 12.7 plus the pipe's friction.

Solving for the velocity at which those losses equal 118.9 Pa gives a velocity of **0.110 m/s**, a flow of **0.567 L/s**. The Reynolds number is about 10,700, turbulent, so the losses rise nearly with the square of the velocity.

The heat the loop carries is the mass flow times the specific heat times the temperature difference: 0.567 L/s of water at about 996 kg/m³, through 7 K, carries 0.000567 × 996 × 4.18 × 7 = **16.5 kW**. That is about 6% of what CW-2's pumped flow carries, enough to keep the tank from boiling or overheating while machines cool down during a power cut, nowhere near enough to run the plant.

## Flow and temperature difference

In a natural-circulation loop, the temperature difference both drives the flow and multiplies the heat each kilogram carries. The driving head rises roughly in proportion to the temperature difference. The losses rise with the square of the velocity. So the flow rises with roughly the square root of the temperature difference, and the heat, which is flow times temperature difference, rises with roughly its 1.5th power.

```figure
type: compare
title: The roof cooler loop at three temperature differences
rowhead: Temperature difference
cols: Flow, L/s | Heat carried, kW
caption: This is an illustration, scaling the driving pressure in proportion to the temperature difference. Doubling the difference from 7 K to 14 K multiplies the heat by 2.87, close to 2 to the power 1.5.
- 3.5 K | 0.394 | 5.7
- * 7 K | 0.567 | 16.5
- 14 K | 0.813 | 47.4
```

That behaviour is self-regulating, and useful. As the tank warms after a power failure, the temperature difference grows and the loop carries more heat, so the tank's temperature levels off at a value where the loop removes heat as fast as it arrives. A designer can estimate that level by finding the temperature difference at which the loop's heat equals the heat load.

## Where the temperature settles

The scaling gives a quick estimate of how hot the tank will run on the backup loop. This is an illustration. Suppose that the heat reaching CW-2's tank after a power failure, from the hot moulds, the oil and the warm water held in the stopped machines and the headers, averages about 30 kW in the first hour. The loop carries 16.5 kW at a 7 K difference across it, and its heat rises with the 1.5th power of the difference. The difference at which it carries 30 kW is 7 × (30 ÷ 16.5)^(2/3) = **10.4 K**.

So the tank settles about 10 K above the water returning from the coil, and that return temperature depends in turn on the air around the coil. On a 25 °C day with a coil that brings the water close to ambient, the tank would settle in the mid-thirties. That is warm, but well within what the tank and its pipework are rated for, and it buys time for the moulds to cool slowly without cracking. Without the roof loop, the same 30 kW would have nowhere to go but into the tank's 20 m³ of water, warming it by about 1.3 K every hour, and rising steadily for as long as the outage lasted; with it, the temperature stops rising once the loop catches up. The estimate is rough, because it assumes the loop's resistance and the coil's performance stay as they were at 7 K, but it is the kind of number a power-failure procedure needs.

## Starting and stability

A natural-circulation loop does not start instantly. At the moment the pumps stop, both columns are at much the same temperature and the driving head is near zero. As the tank warms and the coil cools its contents, the columns separate in temperature and the flow builds up over minutes. A loop with long horizontal runs, or with its heat source and sink at nearly the same height, may hesitate, oscillate, or even start the wrong way round if a stray temperature difference favours it. Loops of that kind can show **flow instability**, with the flow surging and stalling as slugs of warm and cool water pass through.

The design features above, a large height, a continuous rise on the warm side and a continuous fall on the cool side, make a loop start promptly and run steadily. After the fault described below had been corrected, the plant tested its roof loop by stopping CW-2's pump on a warm afternoon and logging the temperatures at the coil's inlet and outlet; within about twenty minutes, the coil's inlet was warm and the loop was carrying heat.

## Designing for natural circulation

Every feature of a good natural-circulation loop follows from its tiny driving head.

- **Height.** The driving head is proportional to the height between the heat source and the heat sink. Doubling the height doubles the head. The coil on the roof, 6 m up, is far better than one at tank height.
- **Large pipes.** With 154.1 mm bore pipe instead of 80.9 mm, and the same fittings and coil resistance at the pipe's velocity, the same 118.9 Pa would drive **2.30 L/s** and carry about **67 kW**. Friction falls so steeply with bore that pipe size is the strongest lever.
- **Few fittings and no throttling.** Every elbow and valve takes some of the 12 mm. Isolating valves in the loop are full-bore ball or gate valves, locked open.
- **No air.** An air pocket at a high point can block a natural-circulation loop completely, because the driving head is far too small to push air through. The loop rises continuously from the tank to the coil, with an automatic air vent at the coil, its highest point.
- **Slopes in the right direction.** Horizontal runs are kept short and sloped, rising towards the coil on the warm side and falling away from it on the cool side.

## The error: a check valve in the loop

This is an illustration. When the roof cooler loop was installed, the contractor fitted a spring-loaded check valve in its return pipe, to stop water draining back from the coil if the tank was emptied. The valve's spring needed about 3 kPa to open it.

The loop's whole driving pressure is 118.9 Pa, about **one twenty-fifth** of the valve's opening pressure. The check valve never opened. At the first power failure, the tank's temperature rose steadily while the coil on the roof stayed cold, and the plant's operators found the loop's two pipes at very different temperatures: the warm pipe warm for a metre or so above the tank, where convection inside the pipe carried a little heat, and the rest of the loop at the roof's temperature.

The fix was to remove the check valve and fit a full-bore isolating valve in its place, with a procedure for closing it when the tank is drained. The loop was then tested as it should have been at handover: the pump was stopped on a warm afternoon, and the coil's inlet and outlet temperatures were logged until the loop was seen to carry heat. A natural-circulation loop that has never been tested in this way should be assumed not to work until it has. The lesson is quantitative: in a loop driven by 12 mm of water, any device that needs kilopascals to operate is a blockage. Check valves, strainers, control valves and meters must each be checked against the driving head before they go into a natural-circulation loop, and most of them do not belong there at all.

```figure
type: bars
title: The roof loop's driving pressure against the check valve's opening pressure
unit: Pa
max: 3200
caption: This is an illustration. A spring check valve needing 3 kPa to open is about 25 times the loop's whole driving pressure.
- * Thermal driving pressure, 7 K over 6 m | 118.9
- Spring check valve's opening pressure | 3000
```

## Natural circulation in pumped systems

Natural circulation also appears where it is not wanted. In a pumped hot-water system, a branch that rises to a hot heater and falls back can circulate on its own when its pump is off, carrying heat away and wasting it; a "heat trap", a short downward loop in the pipe, or a check valve with a low opening pressure stops it. And in a system whose pumps stop, natural circulation is what is left: knowing whether it will carry enough heat, and in which direction, is part of designing for a power failure.

## Exercise: a taller loop

Suppose the roof coil could be mounted 9 m above the tank instead of 6 m, with the extra 6 m of pipe adding a little friction. Ignoring that extra friction, by what factor does the driving pressure rise, and roughly by what factor would the flow and the heat rise? What is the new driving pressure?

**Worked answer.**

- The driving pressure is proportional to the height, so it rises by a factor of 9 ÷ 6 = **1.5**, to 1.5 × 118.9 = **178.4 Pa**.
- With losses rising roughly with the square of the flow, the flow rises by about √1.5 = **1.22**, to about 0.69 L/s.
- At the same temperature difference, the heat rises in proportion to the flow, by about **1.22**, to about 20 kW.

The extra pipe's friction would take back some of that gain, so the true improvement is a little less. Height helps, but less than bore: raising the coil by half again gains about 22%, while the larger pipe above gained about fourfold.
