---
book: centrifugal-pumps-by-the-numbers
chapterSlug: what-a-centrifugal-pump-does
order: 1
title: "What a centrifugal pump does"
description: "How an impeller and volute turn shaft power into head, why head depends on tip speed and not on the liquid, TP-3 in numbers, a pump's head measured across its flanges, and a head read from one gauge."
draft: false
---

A centrifugal pump has one moving part that matters: an impeller, a wheel of curved vanes spinning inside a casing. Liquid enters at the impeller's centre, is flung outward by the vanes, and leaves the rim much faster than it arrived. The casing around the impeller then slows the liquid down, and as it slows, its velocity turns into pressure. That is the whole machine, and everything else in this book follows from it.

This chapter sets out the energy conversion in a centrifugal pump, the link between an impeller's tip speed and the head it produces, the difference between head and pressure, and how a pump's head is measured across its flanges. It introduces TP-3, the running case, and ends with a pump's head read from its discharge gauge alone.

## From shaft to water

The motor turns the shaft, and the shaft turns the impeller. The impeller's vanes push on the liquid, and in doing so they give it both velocity and some pressure. At the impeller's rim, the liquid is moving roughly at the rim's own speed, plus or minus the effect of the vanes' shape.

Around the impeller, the casing is shaped as a **volute**, a spiral passage that widens steadily towards the discharge, or as a ring of fixed **diffuser** vanes. Either way, the passage widens, the liquid slows, and by the energy equation its velocity head turns into pressure head. The pump's discharge carries liquid at a much higher pressure than its suction and at a similar velocity.

A pump does not create flow by itself, which surprises many people who expect it to push a fixed amount of liquid like a piston pump. It adds head, and the flow is whatever the system lets through at that head. Chapter 4 makes that precise.

## Tip speed sets the head

The head a centrifugal pump can produce depends on how fast its impeller's rim moves. The **tip speed** is the rim's circumference times the revolutions per second:

u₂ = π × D₂ × n ÷ 60,

where D₂ is the impeller's diameter in metres and n its speed in revolutions per minute. The head the impeller gives the liquid is proportional to u₂² ÷ g, a quantity with the units of head. Real pumps produce some fraction of it, depending on the vanes' shape and the losses; at zero flow, a typical pump produces a little over half.

```figure
type: formula
title: TP-3's impeller tip speed and its scale of head
formula: u₂ = π × D₂ × n ÷ 60; head scale = u₂² ÷ g
caption: This is an illustration. TP-3's impeller is 160 mm across and turns at 2,900 rpm. Its head at zero flow, 34 m, is 0.565 of u₂² ÷ g.
- D₂ | Impeller diameter, 0.160 m
- n | Speed, 2,900 revolutions per minute
- g | 9.807 m/s²
step: u₂ = π × 0.160 × 2,900 ÷ 60 = 24.29 m/s
step: u₂² ÷ g = 24.29² ÷ 9.807 = 60.2 m
step: Shut-off head 34 m ÷ 60.2 m = 0.565
```

Two consequences follow. To double the head, the tip speed must rise by √2, either by a larger impeller or a faster speed; Chapter 6 develops that into the affinity laws. And a single impeller has a practical limit of head; pumps that must produce much more head than one impeller can manage use several in series, as Chapter 8 discusses.

## Head, not pressure

Because head comes from tip speed, a given pump at a given speed and flow produces nearly the same **head** whatever liquid it pumps, as long as the liquid is not much more viscous than water. The **pressure** it produces is that head times the liquid's density times g, so it changes with the liquid.

TP-3 produces 34 m of head at zero flow. Pumping water at 20 °C, density 998.21 kg/m³, that is a pressure rise of 998.21 × 9.807 × 34 = **332.8 kPa**. Pumping a brine 20% denser, it would produce the same 34 m but 20% more pressure, about 399 kPa, and take 20% more power. Pump curves are drawn in head for that reason, and a pump selected for water must be checked for power and casing pressure if it will ever pump something denser.

## Kinds of centrifugal pump

The same impeller-and-casing idea is built in many arrangements, each suited to its job.

- **End-suction pumps**, like TP-3, take liquid in along the shaft's axis at one end and discharge it upward from the volute. They are the commonest general-purpose pump in plant.
- **Inline pumps** have their suction and discharge on one line, so they can be fitted into a straight pipe run, often with the motor standing vertically above.
- **Split-case pumps** have a casing split along the shaft so that the impeller can be removed without disturbing the pipework, and usually a double-suction impeller fed from both sides. They suit large flows.
- **Multistage pumps** have several impellers in series on one shaft, each adding its head, for high heads at moderate flows: boiler feed and pressure boosting.
- **Submersible and vertical turbine pumps** sit in the liquid, in a sump or a bore, so that they never have to lift water up a suction pipe.

The arrangement changes the mechanics, but not the hydraulics in this book: every one has a head, a flow, an efficiency and a net positive suction head requirement, and every one runs where its curve meets its system.

## Radial, mixed and axial flow

Impellers differ in which way they send the liquid. A **radial-flow** impeller, like TP-3's, turns the liquid through a right angle and flings it straight outward; it suits high heads at modest flows. A **mixed-flow** impeller sends the liquid outward and along the shaft at once, and an **axial-flow** impeller, essentially a propeller in a tube, pushes it along the shaft with little outward motion; those suit large flows at low heads, such as drainage, irrigation and circulating cooling water.

The shapes of their curves differ too. A radial pump's head falls gently as its flow rises, and its power rises with flow, so its power is greatest at high flow. An axial pump's head falls steeply, and its power is greatest at low flow, so it must never be started or run against a closed valve. Chapter 3 reads a radial pump's curves in detail; the point here is that a curve's shape belongs to its impeller type, and the habits that are safe with one type can be dangerous with another.

## How far a pump can lift

A pump above its sump, like TP-3, must draw water up its suction pipe, and it can only do that because the atmosphere pushes the water up as the pump lowers the pressure at its inlet. The atmosphere's pressure, about 101.3 kPa at sea level, could support a column of cold water at most 101.3 ÷ 9.79 = 10.35 m high, and only if the pressure at the top fell to zero absolute, which water cannot reach without boiling first. Subtract the water's vapour pressure, the suction pipe's losses and the margin the pump needs, and practical suction lifts are a few metres at most.

TP-3 lifts 2.0 m at its sump's low level, well within that. Chapter 5 works out exactly how much margin it has, and shows how quickly it disappears if the pump is mounted higher, the water is warmer or the strainer clogs.

## TP-3 in numbers

This is an illustration. TP-3 lifts washwater from a sump to a header tank. Its pump's curve, from its maker's illustrative data sheet, can be represented over its working range as

H = 34 − 0.060 × Q², with Q in L/s,

so that it produces 34 m at zero flow, 25.4 m at the 12 L/s the plant needs, and less beyond. On TP-3's system, with the sump at its low level 2.0 m below the pump, Chapter 4 will show that it runs at **13.17 L/s and 23.6 m**.

```figure
type: stats
title: TP-3 at its operating point
caption: This is an illustration. Each value is worked out in the chapter shown.
- 13.17 L/s | Flow with the sump at its low level | Chapter 4
- * 23.6 m | Head the pump produces there | Chapter 4
- 74% | Pump efficiency there | Chapter 2
- 4.1 kW | Shaft power | Chapter 2
```

## Measuring a pump's head

A pump's head is the difference in total head between its discharge flange and its suction flange: pressure head, velocity head and elevation, each at its own flange. With gauges at both flanges,

H = (p_d − p_s) ÷ ρg + (z_d − z_s) + (v_d² − v_s²) ÷ 2g,

where the pressures are gauge readings, the heights are the gauges' heights, and the velocities are those in the pipes at the gauges' tappings.

This is an illustration. TP-3's suction flange is 80 mm bore and its discharge flange 65 mm, so at 13.17 L/s the velocities there are 2.62 and 3.97 m/s, and the velocity heads 0.350 and 0.803 m. The discharge gauge is 0.3 m above the suction gauge. With the sump at its low level, the suction gauge reads **−28.0 kPa**, a head of −2.86 m: the pump is lifting water, and its suction is below atmospheric. The discharge gauge reads **195.6 kPa**, a head of 19.98 m. The pump's head is

19.98 − (−2.86) + 0.3 + (0.803 − 0.350) = **23.6 m**,

which matches the curve at 13.17 L/s.

```figure
type: compare
title: The parts of TP-3's measured head
rowhead: Term
cols: Value, m | What it is
caption: This is an illustration at 13.17 L/s with the sump at its low level. The discharge gauge alone accounts for less than 85% of the pump's head.
- Discharge pressure head | 19.98 | discharge gauge, 195.6 kPa
- * Minus suction pressure head | +2.86 | suction gauge, −28.0 kPa
- Gauge height difference | 0.30 | discharge gauge above suction gauge
- Velocity head difference | 0.45 | smaller discharge flange
- Pump head | 23.59 | the sum
```

## Where the energy goes inside

Not all the shaft's energy reaches the water as head. Some is lost to friction between the liquid and the impeller and casing, some to liquid leaking back from the discharge to the suction past the impeller's wear rings, some to the impeller's discs churning the liquid around them, and a little to the bearings and the shaft seal. Chapter 2 measures those losses together as the pump's efficiency. At TP-3's best point, about three-quarters of the shaft's power reaches the water; the rest warms the water slightly and the pump's casing.

Wear rings deserve a mention, because their wear is the commonest reason an old pump produces less than its curve. As the clearance between the impeller and its ring opens, more liquid recirculates internally, the pump's head at a given flow falls, and its efficiency with it. A pump whose measured head has fallen well below its curve, at a flow that has been checked, usually has worn rings or a worn impeller.

## Seals and leakage

Where the shaft passes out of the casing, something must stop the liquid following it. Older pumps use **gland packing**, rings of braided material compressed around the shaft, which must leak a little to cool and lubricate themselves. Most modern pumps use a **mechanical seal**, two flat faces, one turning with the shaft and one fixed, held together by a spring, with a film of liquid between them a few micrometres thick. A mechanical seal leaks almost nothing while it is running, but it depends on that film: run dry, even for a few seconds, its faces overheat and crack. Chapter 9 returns to that when it deals with starting a pump that must be primed.

## The error: a head read from one gauge

This is an illustration. A maintenance technician checking TP-3 read its discharge gauge, 195.6 kPa, divided by 9.79 kPa per metre to get about **20.0 m**, and compared that with the curve's 23.6 m at the measured flow. They reported that the pump had lost 15% of its head and recommended an overhaul.

The pump had lost nothing. The discharge gauge reads the pressure at the discharge relative to the atmosphere, but the pump's head is the rise from its suction to its discharge, and its suction was 2.86 m below atmospheric because it was lifting water from the sump. Adding the suction's negative head, the gauges' height difference and the velocity heads gave the full 23.6 m. It was found when the engineer reviewing the report asked for the suction gauge's reading, which had not been taken.

The plant's pump check sheet now has a line for every term in the head equation, and no pump is condemned on one gauge. Had the overhaul gone ahead, it would have cost a week's use of the header tank and found nothing wrong.

## Exercise: TP-3 on brine

Suppose TP-3 were used for a day to pump a brine with a density of 1,198 kg/m³, 20% more than water, at the same flow of 13.17 L/s and the same head of 23.6 m. What pressure rise does it produce on brine and on water? What happens to the shaft power?

**Worked answer.**

- On water: 998.21 × 9.807 × 23.59 = **231.0 kPa**.
- On brine: 1,198 × 9.807 × 23.59 = **277.1 kPa**, 20% more.
- The power is ρ × g × Q × H ÷ η, so with the same head, flow and efficiency it rises in proportion to the density: **20% more**.

The head is unchanged, so the curve on the data sheet still applies; the pressure, the power and the load on the motor all rise. A motor that is just big enough on water would be overloaded on brine, which is why Chapter 2 checks the motor at the densest liquid the pump will see.
