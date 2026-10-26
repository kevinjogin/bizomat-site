---
book: pipe-flow-by-the-numbers
chapterSlug: flow-area-and-velocity
order: 1
title: "Flow, area and velocity"
description: "Volume and mass flow, bore against nominal size, the continuity equation through CW-2's header and branches, the heat the water carries, and a branch velocity worked from its nominal size."
draft: false
---

Every pipe calculation starts with three numbers: how much liquid is moving, through what area, and how fast. They are tied together by the simplest equation in fluid flow, and almost every later calculation, of friction, of fitting losses, of pump head, depends on getting them right. Most errors in pipe work that are not errors of judgement are errors here: a flow in the wrong units, an area worked out from the wrong diameter, a velocity that is a third too high or too low.

This chapter sets out volume flow and mass flow, the difference between a pipe's nominal size and its bore, the continuity equation and what it says at a junction, the heat a flow of water carries, and the velocities that a cooling loop like CW-2 runs at. It ends with a branch velocity worked out from the pipe's nominal size.

## Volume flow and mass flow

A flow can be counted two ways.

- **Volume flow**, Q, is the volume passing a point each second. In SI units it is cubic metres per second, m³/s, but litres per second, L/s, and cubic metres per hour, m³/h, are more convenient for plant work. One litre per second is 3.6 m³/h.
- **Mass flow**, ṁ, is the mass passing each second, in kilograms per second, kg/s. It is the volume flow times the liquid's density.

For CW-2, the design flow is 9.0 L/s, which is 0.009 m³/s or 32.4 m³/h. Water at 25 °C has a density of 997.05 kg/m³, so the mass flow is 0.009 × 997.05 = **8.97 kg/s**.

Mass flow is the more fundamental of the two, because mass is conserved and volume is not quite. Water warming from 25 °C to 32 °C expands slightly, its density falling to 995.03 kg/m³, so the same 8.97 kg/s occupies 9.018 L/s on the warm return. The difference, 0.2%, is too small to matter for sizing CW-2's pipes, but it shows which quantity to trust when the two disagree: count mass.

## Bore, not nominal size

A pipe's **nominal size**, written DN80 or "3 inch", is a name. It identifies a family of pipes and fittings that fit together, but it is not a dimension of any of them. The dimension that matters for flow is the **bore**, the inside diameter, which is the outside diameter less twice the wall thickness. Pipes of the same nominal size made to different wall thicknesses or different standards have different bores.

This is an illustration. CW-2's headers are steel pipe with an outside diameter of 88.9 mm and a wall of 4.0 mm, giving a bore of 88.9 − 2 × 4.0 = **80.9 mm**. Its machine branches are steel pipe of 36.0 mm bore. Both bores come from the pipe supplier's data for the pipe actually installed; neither is the nominal size.

The bore's area is the area of a circle, π × D² ÷ 4. For the header, π × 0.0809² ÷ 4 = 0.005140 m², or 51.40 cm². For a branch, π × 0.036² ÷ 4 = 0.001018 m², 10.18 cm².

## The continuity equation

In steady flow, the mass entering any length of pipe each second equals the mass leaving it, because there is nowhere for the mass to go. For a liquid whose density barely changes, that becomes a statement about volume: the volume flow is the same at every section of a pipe without branches. Since the volume flow is the area times the average velocity, the velocity changes inversely with the area.

```figure
type: formula
title: Continuity in a pipe
formula: Q = A × v, and A₁ × v₁ = A₂ × v₂ along a pipe without branches
caption: Worked for CW-2's supply header at its design flow. The velocity is the average over the bore; the water at the centre moves faster and the water at the wall slower.
- Q | Volume flow, 0.009 m³/s
- A | Area of the bore, 0.005140 m² for 80.9 mm
- v | Average velocity, m/s
step: v = Q ÷ A = 0.009 ÷ 0.005140 = 1.751 m/s
step: In a 36.0 mm branch at 1.5 L/s: v = 0.0015 ÷ 0.001018 = 1.474 m/s
```

The velocity in the formula is the **average velocity**, the volume flow divided by the area. The real velocity varies across the bore, fastest at the centre and zero at the wall. Chapter 3 shows how much it varies, and why the average is still the right number for almost every calculation in this book.

## Continuity at a junction

At a tee, continuity says that the flows in equal the flows out. CW-2's supply header carries 9.0 L/s from the pump. At the first machine's tee, 1.5 L/s leaves into the branch, and 7.5 L/s carries on along the header. At each later tee, another 1.5 L/s leaves, until the last tee feeds the last machine with the final 1.5 L/s.

The header's bore does not change, so its velocity falls in step with its flow.

```figure
type: bars
title: Velocity along CW-2's supply header
unit: m/s
max: 2
caption: This is an illustration. The header is 80.9 mm bore throughout; each machine's tee takes 1.5 L/s.
- * Pump to machine 1, 9.0 L/s | 1.751
- Machine 1 to 2, 7.5 L/s | 1.459
- Machine 2 to 3, 6.0 L/s | 1.167
- Machine 3 to 4, 4.5 L/s | 0.875
- Machine 4 to 5, 3.0 L/s | 0.584
- Machine 5 to 6, 1.5 L/s | 0.292
```

The far end of the header carries water at less than 0.3 m/s. That matters for friction, which falls steeply with velocity, and so for how the flow divides between machines, which Chapter 7 deals with. It also matters for sediment and air, which settle or collect where water moves slowly.

## The heat the water carries

CW-2 exists to carry heat away from the moulding machines. The heat a flow of water carries is its mass flow times its specific heat capacity times its temperature rise. Water's specific heat capacity at these temperatures is about 4.18 kJ/kg·K.

With 8.97 kg/s warming by 7 K, from 25 °C to 32 °C, the loop carries 8.97 × 4.18 × 7 = **262.6 kW**. Each machine's share, 1.5 L/s, carries 43.8 kW. That is the link between the hydraulics and the job: a machine that gets 1.2 L/s instead of 1.5 L/s either runs its water 25% hotter across its coolers or rejects 25% less heat, and its moulds run warm. Most "the machine runs hot" complaints on a cooling loop are, underneath, flow problems.

## A flow balance as a check

Continuity is also a check on measurements. If CW-2's pump delivers 9.0 L/s, the six branch flows must add up to 9.0 L/s, whatever the individual flows are. During commissioning, the technician measures each branch with a clamp-on ultrasonic meter and the main flow with the meter at the pump. This is an illustration. Before the branches were balanced, the readings were 1.59, 1.55, 1.50, 1.48, 1.47 and 1.46 L/s, totalling 9.05 L/s, against 9.14 L/s at the pump.

The two totals differ by 0.09 L/s, 1%, which is within the combined uncertainty of the meters. Had they differed by 10%, either a meter was wrong or water was going somewhere it should not: a bypass left open, a leak, or a seventh connection nobody had drawn. A flow balance takes a few minutes and finds faults that no amount of looking at individual readings will.

The individual readings show something else, which Chapter 7 explains: the machines nearest the pump get more than their share, and the farthest get less.

## Pipes that run part full

Not every pipe runs full. CW-2's return header discharges into the open tank above the water level, and the tank's overflow and drain lines run by gravity, partly full, with air above the water. Continuity still holds, but the area in Q = A × v is the **wetted area**, the part of the bore that the water actually occupies, not the whole bore.

A part-full pipe's wetted area depends on its depth of flow, and its velocity depends on its slope and roughness, not on a pump. Gravity drains are sized differently from pumped lines, and READOS's Roof Drainage by the Numbers deals with that kind of flow. In this book, every pipe runs full unless it says otherwise, and the area is the bore's.

## How long the water takes

Velocity also sets how long water takes to get anywhere, which matters whenever something changes at one end of the loop and must be felt at the other: a change of tank temperature, a dose of water treatment chemical, a slug of air. The time to travel along a length of pipe is its length divided by its velocity, and along CW-2's supply header the velocity changes at every tee.

The first 22 m, at 1.751 m/s, takes 12.6 s. Each later 8 m length takes longer as the velocity falls, and the last, at 0.292 m/s, takes 27.4 s on its own. Water leaving the pump takes **75.1 s** to reach the last machine's tee, more than twice the 35.4 s it would take if the whole 62 m ran at the first length's velocity. The supply header holds about 0.32 m³ of water, and the last machine sees a change at the tank more than a minute after the first machine does.

That lag is one reason why a temperature controller that measures at the tank and controls the cooler can hunt: by the time the far machines feel a correction, the controller has made another. Measuring the return temperature at the far end, or slowing the controller down, are the usual remedies, and both start from knowing the lag.

## Velocities that work

There is no single correct velocity for water in a pipe, but there are ranges that work. Too low, and the pipe is larger and dearer than it needs to be, air and sediment settle, and temperature control is sluggish. Too high, and friction and pumping energy rise steeply, fittings erode, and noise and water hammer become problems. This is an illustration: the plant's own design guide asks for 1.0 to 2.5 m/s in headers and 1.0 to 2.0 m/s in branches, with higher velocities accepted for short runs. CW-2's 1.75 m/s header and 1.47 m/s branches sit inside those ranges.

The ranges are guides, not rules. Chapter 10 shows how to choose a pipe size on its whole cost, pipe and energy together, and the answer depends on how long the pump runs and what electricity costs.

## Units that cause errors

Pipe flow mixes units more than most engineering. A short list of conversions prevents most of the trouble.

```figure
type: compare
title: Conversions used throughout this book
rowhead: Quantity
cols: Unit | Equals
caption: Exact conversions, except where marked as approximate.
- Volume flow | 1 L/s | 3.6 m³/h, 0.001 m³/s
- Volume flow | 1 m³/h | 0.2778 L/s
- * Mass flow of water | 1 L/s | about 1 kg/s at room temperature
- Area | 1 cm² | 0.0001 m²
- Velocity | 1 m/s | 3.6 km/h
- Pressure | 1 bar | 100 kPa
```

The commonest single error is mixing L/s and m³/h. A flow of 9 entered as m³/h instead of L/s gives a velocity 3.6 times too small; entered the other way round, 3.6 times too large. A spreadsheet that carries the unit in its column heading, and converts once at the top, prevents both.

## The error: a branch worked out from its nominal size

This is an illustration. When CW-2 was being commissioned, a technician checked the velocity in the branch to machine 3. The branch was labelled DN32 on the drawing, so they took its bore as 32 mm, worked out an area of π × 0.032² ÷ 4 = 0.000804 m², and found a velocity of 0.0015 ÷ 0.000804 = **1.865 m/s**, uncomfortably close to the plant's 2.0 m/s guide for branches. They recommended replacing the branch with a larger size.

The branch's actual bore was 36.0 mm, from the supplier's data for the pipe installed, and its true velocity was **1.474 m/s**, comfortably within the guide. The nominal-size calculation had overstated the velocity by 26.5%. It was found when the project engineer asked for the bore's source before approving the change. The shop's calculation sheets now carry a column headed "bore, mm, from" with the source of every bore. Had the change gone ahead, the plant would have paid for new pipe, fittings and a shutdown on machine 3's branch to solve a problem that existed only on paper, and the larger branch would have slowed its water towards the bottom of the range the guide asks for.

The lesson is general. Every quantity in this book that depends on a diameter depends on the bore: velocity on its square, friction on its fifth power, as Chapter 4 shows. A few millimetres of error in the bore is not a few per cent of error in the answer.

## Exercise: sizing the header

Suppose CW-2's designer had wanted the supply header's velocity at the design flow to be 1.5 m/s instead of 1.75 m/s. What bore would the header need? What bore would give 2.5 m/s, the top of the plant's range?

**Worked answer.**

- From Q = A × v, A = Q ÷ v = 0.009 ÷ 1.5 = 0.006 m².
- From A = π × D² ÷ 4, D = √(4 × A ÷ π) = √(4 × 0.006 ÷ π) = **87.4 mm**.
- For 2.5 m/s, A = 0.009 ÷ 2.5 = 0.0036 m², and D = √(4 × 0.0036 ÷ π) = **67.7 mm**.

Neither bore is a standard pipe, so the designer picks the nearest bore available. A header of 80.9 mm gives 1.75 m/s, between the two; the next size up would give a lower velocity, a larger pipe and less friction, and Chapter 10 shows how to weigh that.
