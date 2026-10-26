---
book: pipe-flow-by-the-numbers
chapterSlug: laminar-and-turbulent-flow
order: 3
title: "Laminar and turbulent flow"
description: "Viscosity, the Reynolds number and the two regimes of flow; velocity profiles; CW-2's turbulent headers against a laminar oil line; and an oil line sized with a turbulent friction factor."
draft: false
---

Water in a pipe moves in one of two quite different ways. In **laminar** flow, it slides along in smooth layers, each moving a little faster than the one outside it, with no mixing between them. In **turbulent** flow, eddies of every size tumble across the pipe, mixing the water constantly while it moves along on average. The two regimes lose energy to friction differently, carry heat differently and respond to changes differently, so the first thing to know about any flow is which it is.

This chapter sets out viscosity, the Reynolds number that tells the regimes apart, and the velocity profiles of each. It finds the Reynolds numbers in CW-2's headers and branches and in the oil circuit of a mould temperature unit, and ends with an oil line whose friction was taken from a chart for turbulent flow.

## Viscosity

Viscosity is a liquid's resistance to shearing, to one layer sliding over the next. It comes in two forms.

- **Dynamic viscosity**, μ, measured in pascal seconds, Pa·s, or more conveniently in millipascal seconds, mPa·s. Water at 25 °C has a dynamic viscosity of 0.890 mPa·s.
- **Kinematic viscosity**, ν, the dynamic viscosity divided by the density, measured in square metres per second or, more conveniently, in square millimetres per second, mm²/s, a unit traditionally called the centistoke. Water at 25 °C has a kinematic viscosity of 0.8926 mm²/s.

Water's viscosity falls steeply as it warms: at 80 °C, it is 0.354 mPa·s, about 40% of its value at 25 °C. Oils change far more. Lubricating and hydraulic oils are graded by their kinematic viscosity at 40 °C, so an ISO VG 46 oil has a kinematic viscosity of about 46 mm²/s at 40 °C, more than fifty times water's at the same temperature, and much higher when cold.

```figure
type: compare
title: Viscosity of water by temperature
rowhead: Temperature
cols: Dynamic, mPa·s | Kinematic, mm²/s | Reynolds number in CW-2's header at 1.751 m/s
caption: Water properties from public data at atmospheric pressure. The Reynolds number in the same pipe at the same velocity nearly triples between 20 °C and 80 °C.
- 20 °C | 1.0016 | 1.0034 | 141,176
- * 25 °C | 0.8900 | 0.8926 | 158,694
- 40 °C | 0.6527 | 0.6578 | 215,342
- 60 °C | 0.4665 | 0.4745 | 298,555
- 80 °C | 0.3544 | 0.3647 | 388,431
```

## The Reynolds number

Whether a flow is laminar or turbulent depends on the balance between the liquid's momentum, which tends to break smooth layers into eddies, and its viscosity, which damps them. That balance is measured by the **Reynolds number**, a pure number with no units:

Re = ρ × v × D ÷ μ = v × D ÷ ν,

where v is the average velocity and D the bore. As a working rule, flow in a pipe is laminar below a Reynolds number of about 2,300 and turbulent above about 4,000. Between them is a transition region, in which the flow may switch between the two and friction is hard to predict. Designers avoid running in the transition region where they can.

```figure
type: formula
title: Reynolds number in CW-2's supply header
formula: Re = ρ × v × D ÷ μ
caption: At the design flow and 25 °C. A Reynolds number near 159,000 is well into the turbulent range.
- ρ | Density, 997.05 kg/m³
- v | Average velocity, 1.751 m/s
- D | Bore, 0.0809 m
- μ | Dynamic viscosity, 0.000890 Pa·s
step: Re = 997.05 × 1.751 × 0.0809 ÷ 0.000890 = 158,700
step: In a 36.0 mm branch at 1.474 m/s: Re = 59,400
step: In the header's last length, 1.5 L/s at 0.292 m/s: Re = 26,500
```

Every part of CW-2 is turbulent, even the slow last length of the header. Water in pipes of plant size almost always is: for the header's last length to become laminar, its velocity would have to fall to 2,300 × 0.8926 × 10⁻⁶ ÷ 0.0809 = 0.025 m/s, a flow of 0.13 L/s, about a tenth of one machine's demand.

## Velocity profiles

The average velocity hides how the velocity varies across the bore. In both regimes, the water at the wall is stationary and the water at the centre moves fastest; what differs is the shape between.

- In **laminar** flow, the profile is a parabola. The centre moves at exactly twice the average velocity, and the velocity falls smoothly to zero at the wall.
- In **turbulent** flow, the eddies mix fast water outward and slow water inward, flattening the profile. A common approximation, the one-seventh power law, gives the centre a velocity about 1.22 times the average, with almost all of the change squeezed into a thin layer near the wall.

The difference matters in three places. Flow meters that measure velocity at one point, such as an insertion meter or a pitot tube, must be corrected from the point's velocity to the average, and the correction depends on the regime. Heat transfer between a pipe wall and the liquid is much higher in turbulent flow, because the eddies carry heat across the bore; READOS's [Heat Transfer by the Numbers](/reados/publications/heat-transfer-by-the-numbers/convection-at-surfaces/) deals with that. And friction, which comes from the shearing at the wall, follows different laws, which the next sections and Chapter 4 set out.

## A laminar flow on the same site

This is an illustration. Each moulding machine has a mould temperature unit that circulates oil through the mould's channels, separately from CW-2's water. The unit's oil is an ISO VG 46 grade, about 46 mm²/s at 40 °C, and it flows at 0.5 L/s through a 20 mm bore hose.

The oil's velocity is 0.0005 ÷ (π × 0.020² ÷ 4) = 1.592 m/s, close to CW-2's branch velocity. Its Reynolds number is 1.592 × 0.020 ÷ (46 × 10⁻⁶) = **692**, deep in the laminar range. The same pipe and the same velocity with water would give a Reynolds number fifty times higher. Viscosity, not velocity, decides the regime here. Two flows that look identical on a drawing, the same bore and the same velocity, can be in different regimes because of what flows in them, and the friction, the heat transfer and the mixing all follow from that.

## Friction in laminar flow

Laminar flow is the one case in pipe flow with an exact friction law. The pressure lost along a length of pipe is proportional to the viscosity, the length and the velocity, and inversely proportional to the bore squared. In the Darcy form that Chapter 4 uses for every flow, the friction factor is simply

f = 64 ÷ Re.

For the oil line, f = 64 ÷ 692 = 0.0925. Over 10 m of hose, the head lost is f × (L ÷ D) × v² ÷ 2g = 0.0925 × (10 ÷ 0.020) × 1.592² ÷ (2 × 9.807) = 5.97 m of oil. Taking the oil's density, as an illustration, as 870 kg/m³, that is a pressure loss of **51.0 kPa** per 10 m.

Laminar friction rises in direct proportion to the velocity, not with its square as turbulent friction nearly does. Doubling the oil's flow doubles its friction loss; doubling CW-2's water flow nearly quadruples its. It also rises in direct proportion to the viscosity, which is why a mould temperature unit's pump labours on a cold start, when the oil is many times more viscous than at its working temperature.

## The error: an oil line sized with a turbulent friction factor

This is an illustration. When a longer hose was fitted to one machine's mould temperature unit, a maintenance planner estimated the extra pressure loss using a friction factor of 0.03, read from a chart they used for water lines, without checking the Reynolds number. Their estimate for the extra 10 m of hose was **16.5 kPa**, well within the unit's spare pressure.

The flow was laminar, and the correct friction factor was 64 ÷ 692 = 0.0925, more than three times higher. The extra loss was **51.0 kPa**, more than the unit's pump could supply at full flow. After the change, the mould ran hot at its far end, and the unit's flow alarm tripped on cold mornings. It was found when the unit's supplier asked for the hose's length and bore and recalculated the loss.

The fix was a shorter route for the hose and a larger bore, which reduced both the length and the velocity. The planner's water chart was not wrong; it was the wrong chart. The Reynolds number is the first number to calculate for any flow, because it decides which friction law applies.

A sound procedure for any change to a line carrying something other than water has four steps: find the liquid's viscosity at its coldest and warmest working temperatures from its data sheet; calculate the Reynolds number at both; pick the friction law for each; and size the line for the worse case. For an oil that may be several times more viscous at start-up than when warm, the cold case usually governs, and a line that is comfortable when warm may starve the pump when cold. The supplier's recalculation for the mould temperature unit followed exactly those steps, and took less than half an hour.

```figure
type: bars
title: Extra loss in 10 m of the oil hose
unit: kPa
max: 60
caption: This is an illustration. At a Reynolds number of 692 the flow is laminar and f = 64 ÷ Re = 0.0925. A turbulent chart's f = 0.03 understates the loss by two-thirds.
- Estimated with f = 0.03 | 16.5
- * Laminar, f = 0.0925 | 51.0
```

## The transition region

Between a Reynolds number of about 2,300 and 4,000, a flow may be laminar or turbulent, or switch between the two, depending on how smooth the pipe is, how disturbed the flow entering it is, and how the flow got there. Friction in that range cannot be predicted reliably, and a system that operates there may behave differently from one day to the next.

Oil circuits are the most likely to land there, especially as the oil warms up and its viscosity falls. The mould temperature unit's oil, at 692 when at 40 °C, would reach the transition region only if its viscosity fell to about 30% of its 40 °C value, 2,300 ÷ 692 = 3.3 times lower, which needs a much higher temperature than the unit runs at. Water lines in plant are almost never there, except in very small bores at very low flows, such as instrument lines and bypasses.

## Mixing, dosing and cleaning

Turbulence mixes. A dose of water treatment chemical injected into CW-2's header spreads across the bore within a few diameters, and by the first machine it is evenly mixed. In a laminar flow, it would not: a dye injected at the centre of a laminar stream stays a thin thread for a long way, spreading only by slow diffusion. That is one reason water treatment dosing points are placed upstream of a pump or a fitting that stirs the flow, and why dosing into a slow, smooth branch can leave one machine over-dosed and the next under-dosed.

Turbulence also scours. Sediment, biofilm and scale settle where water moves slowly and the layer near the wall is thick and quiet. CW-2's last header length, at 0.29 m/s, is the place in the loop where sludge collects first, and the plant's maintenance schedule flushes the far end of the header twice a year. A cleaning flush is effective only if it raises the velocity well above normal; flushing at the normal flow moves little that has already settled.

## A spreadsheet column for the Reynolds number

Every flow calculation in the CW-2 workbook carries a Reynolds number column next to its velocity column, and a second column that names the regime: laminar, transition or turbulent. The friction factor column then uses 64 ÷ Re for laminar rows and the turbulent formula of Chapter 4 for turbulent rows, and flags transition rows for a person to look at. With that structure in place, the planner's error below could not have happened: the oil hose's row would have been labelled laminar the moment its viscosity was entered.

## Entry length

A flow entering a pipe from a tank or a fitting does not have its final velocity profile at once. The profile develops over an **entry length**, which in turbulent flow is typically a few tens of diameters and in laminar flow can be much longer. Within the entry length, friction is a little higher than in fully developed flow. For long pipes such as CW-2's headers, the difference is negligible. For short pipes, and for flow meters that assume a developed profile, it is not, and meter suppliers specify a length of straight pipe upstream of their meters for this reason, as Chapter 10 discusses.

## Exercise: the header warm and cold

CW-2's water is normally at 25 °C, but on a winter start-up the tank can be at 15 °C, where water's kinematic viscosity is about 1.14 mm²/s. Find the Reynolds number in the supply header at the design flow at 15 °C, and say whether the regime changes. What flow would make the header's first length laminar at 25 °C?

**Worked answer.**

- At 15 °C, Re = v × D ÷ ν = 1.751 × 0.0809 ÷ (1.14 × 10⁻⁶) = **124,300**.
- That is lower than at 25 °C but still far into the turbulent range; the regime does not change.
- For the first length to be laminar at 25 °C, Re must fall below 2,300, so v below 2,300 × 0.8926 × 10⁻⁶ ÷ 0.0809 = 0.0254 m/s, a flow of 0.0254 × 0.005140 = 0.000130 m³/s, **0.13 L/s**.

Water in plant piping is turbulent at any flow that does useful work. The Reynolds number matters most for oils, glycols and other viscous liquids, and for water in very small pipes.
