---
book: viscosity-by-the-numbers
chapterSlug: flow-in-lines-and-hoses
order: 7
title: "Flow in lines, hoses and filters"
description: "Calculate laminar and transitional pressure drop in oil lines with the Hagen–Poiseuille law and the KEVOS® line sizing tool, and see how a cold start multiplies losses in lines, strainers and filters."
draft: false
---

Water in a building's pipes flows turbulently, and its pressure drop depends mostly on velocity and pipe roughness. Oil in a hydraulic line usually flows in smooth, orderly layers, and its pressure drop depends directly on its viscosity. That single difference means an oil line's losses can change tenfold between a cold morning and a warm afternoon, while the same line full of water would barely notice.

This chapter applies the laminar flow law named after Hagen and Poiseuille to HPU-40's pressure, return and suction lines, uses the KEVOS® hydraulic line sizing tool to check velocity, Reynolds number, pressure drop and tube rating at four oil temperatures, and follows the effect of a cold start through the suction strainer and the return filter. It ends with a slow ram return that had been dismissed because the line losses were calculated at the data sheet's 40 °C.

## Laminar flow and the Reynolds number

Reynolds showed in 1883 that whether flow in a pipe is orderly or turbulent depends on one dimensionless number, the ratio of inertial to viscous effects: the mean velocity times the bore divided by the kinematic viscosity. Below about 2,000 to 2,300, disturbances die away and the flow is laminar; above about 4,000 it is turbulent; in between it is transitional and can switch between the two. Pipe Flow by the Numbers covers the distinction in detail in its chapter on [laminar and turbulent flow](/reados/publications/pipe-flow-by-the-numbers/laminar-and-turbulent-flow/), largely for water.

Oil changes the picture because its kinematic viscosity is so much higher. HPU-40's pressure line carries 40 L/min through a 16 mm bore at 3.32 m/s. With water at 20 °C, at 1.003 mm²/s, the Reynolds number would be about 52,900: fully turbulent. With HPU-40's oil at 50 °C, at 30.0 mm²/s, it is 1,770: laminar. On a cold morning at 5 °C it is 139.

In laminar flow the velocity profile across the pipe is a parabola, fastest at the centre and zero at the wall, and the pressure drop follows a simple exact law.

```figure
type: formula
title: The Hagen–Poiseuille law for laminar flow in a round pipe
formula: Δp = 128 μ L Q ÷ (π d⁴)
formula: equivalently f = 64 ÷ Re in the Darcy equation Δp = f (L ÷ d) ρ v² ÷ 2
caption: In laminar flow the pressure drop is proportional to dynamic viscosity and to flow, and inversely proportional to the fourth power of the bore. Pipe roughness does not enter.
- Δp | pressure drop, Pa
- μ | dynamic viscosity, Pa·s
- L, d | pipe length and bore, m
- Q | volume flow, m³/s
- Re | Reynolds number, v d ÷ ν
```

The fourth power of the bore is the lever every designer uses: a line one size larger, say 20 mm instead of 16 mm bore, loses (16 ÷ 20)⁴ = 0.41 times as much at the same flow and viscosity. The linear dependence on viscosity is what makes oil lines so sensitive to temperature.

This is an illustration. For HPU-40's 4 m pressure line at 50 °C, the dynamic viscosity is 25.44 mPa·s, and the law gives Δp = 128 × 0.02544 × 4 × (40 ÷ 60,000) ÷ (π × 0.016⁴) = 42,170 Pa, or 0.42 bar, in the straight tube alone.

## The hydraulic line sizing tool

The [hydraulic line sizing tool](/tools/hydraulic-line-sizing/) checks a pressure, return or suction line in one step. From the flow, the velocity limit for that kind of line, the tube's bore and outside diameter, the working pressure and the tube material's tensile strength with a design factor, the line length and the sum of fitting loss coefficients, and the oil's viscosity and density, it gives the least bore for the velocity limit, the actual velocity, the Reynolds number and regime, the friction factor (64 ÷ Re in laminar flow, the Colebrook equation above Re = 2,300), the pressure drop and the power lost as heat, and the tube's burst pressure by Barlow's formula with its working rating.

This is an illustration. For HPU-40's pressure line at its normal 50 °C, the inputs are 40 L/min, a velocity limit of 5 m/s, a 16 mm bore and 22 mm outside diameter, 160 bar working pressure, a tube tensile strength of 410 MPa with a design factor of 4, 4 m length, fitting coefficients summing to 5, 30.0 cSt, 848.7 kg/m³, a roughness of 0.0015 mm and an allowed drop of 5 bar.

```figure
type: steps
title: HPU-40's pressure line at 50 °C in the hydraulic line sizing tool
caption: This is an illustration. The tube strength and design factor are illustrative; real tube ratings come from the tube maker's data and the applicable standard.
- Least bore for 5 m/s | 13.0 mm, so the 16 mm bore is adequate
- Velocity and regime | 3.32 m/s; Re = 1,770, laminar
- Friction factor | 64 ÷ 1,770 = 0.0362
- Pressure drop | 0.42 bar in the tube plus 0.23 bar in fittings = 0.66 bar
- Power lost as heat | 44 W
- * Tube rating | burst 1,118 bar by Barlow; working rating 280 bar against 160 bar
- Verdict | LINE ADEQUATE
```

The tool's Barlow calculation uses the outside diameter and the wall thickness, (22 − 16) ÷ 2 = 3 mm: 2 × 410 × 3 ÷ 22 = 111.8 MPa, or 1,118 bar. A design factor of 4 gives a working rating of 280 bar. The tool also reminds the user that fittings and hoses need their own ratings, which Machine Elements and Mechanical Design covers in [hydraulic fittings and hose assemblies](/reados/collections/machine-elements-and-mechanical-design/hydraulic-fittings-and-hose-assemblies/).

## Four temperatures, one line

Running the tool for each of HPU-40's oil temperatures shows how strongly viscosity drives the losses.

```figure
type: compare
title: HPU-40's pressure line through the year
cols: Viscosity | Reynolds number | Pressure drop | Heat
rowhead: Oil temperature
- 5 °C, cold start | 382.5 mm²/s | 139, laminar | 5.80 bar | 386 W
- 20 °C | 133.8 mm²/s | 396, laminar | 2.16 bar | 144 W
- 40 °C | 46.0 mm²/s | 1,153, laminar | 0.89 bar | 59 W
- * 50 °C, normal | 30.0 mm²/s | 1,770, laminar | 0.66 bar | 44 W
- 65 °C, summer peak | 17.4 mm²/s | 3,048, transitional | 0.73 bar | 49 W
caption: This is an illustration. Hydraulic line sizing tool, 40 L/min, 16 mm bore, 4 m, fitting coefficients 5. At 5 °C the drop exceeds the 5 bar allowance; at 65 °C the tool switches to its turbulent friction factor.
```

Between the cold start and normal running the line's loss falls ninefold. At 5 °C it exceeds the 5 bar allowance and the tool reports the line as not suitable, which is correct for that moment; the question is whether the moment matters, which depends on what happens at a cold start. The 65 °C result shows a subtlety. At a Reynolds number of 3,048 the flow is transitional, and the tool, using the turbulent Colebrook friction factor above 2,300, predicts a slightly higher loss than at 50 °C. Had the flow stayed laminar, the loss would have been lower, about 0.47 bar. In the transitional range the real loss lies somewhere between the two, and it can fluctuate; the conservative turbulent estimate is the right one for sizing.

Fitting losses behave differently from tube friction. The tool treats them as a constant number of velocity heads, which is accurate in turbulent flow. In laminar flow at low Reynolds numbers, fitting loss coefficients rise as the Reynolds number falls, so the tool's cold-start fitting losses are optimistic. That is one more reason to treat cold-start calculations as estimates and to measure.

## Hoses, bends and short passages

The Hagen–Poiseuille law assumes a long, straight, round passage in which the parabolic velocity profile has had time to form. Real circuits are full of short passages, bends, hose ends and drilled galleries, where the flow has not settled and the losses are higher than the straight-pipe law predicts. In laminar flow, the length needed for the profile to develop is roughly 0.06 times the Reynolds number times the bore; for HPU-40's pressure line at 50 °C that is 0.06 × 1,770 × 16 mm, about 1.7 m, a large part of its 4 m length. The tool's fitting coefficients account for some of this, and its results should be read as good estimates rather than exact values.

Hoses add two practical points. Their bore is set by the hose standard's nominal size and can differ slightly from the fittings' bore, and the fourth-power law makes small differences matter: a hose whose bore is 5% smaller than assumed loses about 23% more. And because roughness does not enter laminar flow, the smoothness of a hose lining that matters greatly for turbulent water makes no difference to oil at normal temperature. What does matter is temperature: a hose run near a hot surface, or through a cold exterior wall, carries oil at a different viscosity from the reservoir's.

## The suction side at a cold start

The pump's suction is where viscosity can do real damage. A pump can only fill its chambers if the oil reaching its inlet is above a certain absolute pressure, which its maker states. Below that, dissolved air comes out of solution and the oil can vaporise locally, the pump cavitates, and it becomes noisy and wears. The pressure available at the inlet is atmospheric pressure, plus the head of oil above the inlet, minus the losses in the suction line and anything fitted in it.

This is an illustration. HPU-40's pump maker requires at least 0.8 bar absolute at the inlet. The oil level is 0.3 m above the inlet, worth 0.03 bar, and the suction line is a 38 mm bore hose 0.8 m long. The original design included a 125 µm suction strainer whose maker's data gave 0.05 bar at 30 mm²/s and 40 L/min. In laminar flow, both the hose's loss and the strainer's loss are proportional to viscosity.

```figure
type: compare
title: Pump inlet pressure, normal running and cold start
cols: 50 °C, normal | 5 °C, cold start
rowhead: Item
- Atmospheric pressure | 1.013 bar | 1.013 bar
- Head of oil, 0.3 m | +0.025 bar | +0.026 bar
- Suction hose loss | −0.005 bar | −0.037 bar
- Suction strainer loss | −0.050 bar | −0.638 bar
- * Pressure at the pump inlet, absolute | 0.983 bar | 0.364 bar
- Pump maker's minimum | 0.8 bar | 0.8 bar
caption: This is an illustration. Hose losses from the hydraulic line sizing tool with fitting coefficients of 1.5; strainer loss scaled from its maker's value in proportion to viscosity.
```

At 50 °C the inlet is comfortably above the limit. At a 5 °C start it falls to 0.36 bar absolute, far below 0.8 bar, almost entirely because of the strainer. The hose itself, at 38 mm bore and low velocity, loses very little even when cold. This is why many pump makers advise against suction strainers, or ask for very generously sized ones with a bypass, and why the cold-start viscosity limit of Chapter 4 exists. The press shop removed the strainer, relying on the return filter and the reservoir's clean design, and the pump's cold-start noise disappeared.

## Filters at a cold start

A filter element's pressure drop, for the oil passing through its fine pores, is very nearly proportional to viscosity. A return filter sized for a clean drop of 0.4 bar at the normal 30.0 mm²/s will lose 0.4 × 382.5 ÷ 30.0 = 5.1 bar at a 5 °C start. Return filters carry a bypass valve, set by their maker at a few bar, which opens to protect the element from collapsing. HPU-40's return filter bypass opens at 2.5 bar, so on every cold start the oil returns to the reservoir unfiltered until it warms enough to bring the drop back below that setting, which this oil does at about 15 °C. A filter's clogging indicator can also give a false alarm when cold, which is why indicators are often fitted with a thermal lockout and why their readings mean something only at running temperature.

## The error: line losses at the data sheet temperature

This is an illustration. Chapter 1 left open why HPU-40's ram returned slowly on winter mornings. An engineer investigating it calculated the return path's losses using the oil's data sheet viscosity of 46.0 mm²/s, since that was the figure on file. The 25 mm bore, 5 m return line came out at 0.17 bar and the return filter at 0.61 bar, totalling under a bar, too little to slow a ram whose return cylinder had pressure to spare. The engineer concluded that the line and filter were not the cause and turned to the valve.

A technician fitted a gauge to the return line at the cylinder and recorded it on a cold morning. It read 3.8 bar for the first few minutes, falling to under 1 bar as the oil warmed. Recalculated at 5 °C, the return line's loss was 1.20 bar, and the filter, whose element alone would have needed 5.1 bar, was held at its 2.5 bar bypass setting: together about 3.7 bar, matching the gauge. The return cylinder's rod side had to push the oil out against nearly four bar more than the engineer had allowed, and on a press whose return relies on a modest pressure that was enough to halve its speed.

```figure
type: bars
title: Back-pressure in HPU-40's return path at the start of a cold morning
unit: bar
max: 4
caption: This is an illustration. Line loss from the hydraulic line sizing tool at 5 °C; filter limited to its 2.5 bar bypass setting. The engineer's estimate used 46.0 mm²/s, the 40 °C data sheet value.
- Engineer's estimate at 40 °C | 0.78
- Return line at 5 °C | 1.20
- Return filter at 5 °C, held at bypass | 2.50
- * Total at 5 °C | 3.70
- Gauge reading | 3.8
```

The mistake was calculating at the temperature on the data sheet rather than the temperature in the machine. The fixes were a warm-up routine, cycling the press unloaded for ten minutes, and a small reservoir heater that keeps the oil above 20 °C overnight in winter, where the return path loses about 2.2 bar and the filter stays below its bypass setting. The press shop's rule is now that any viscosity-dependent calculation is made at the coldest and hottest oil temperatures the machine will see, not at 40 °C.

## Line sizing rules for oil

Hydraulic designers use velocity limits to size lines, because velocity is easy to calculate and sets both the losses and the risk of erosion and noise. The limits differ by line because the consequences of a loss differ.

```figure
type: checklist
title: Sizing oil lines with viscosity in mind
caption: Velocity limits are design choices set by the designer or the equipment maker; the values in the hydraulic line sizing tool are entered by the user.
- Suction lines slowest | Losses there reduce the pump's inlet pressure, which has little margin, especially when cold
- Return lines next | Back-pressure slows actuators and stresses filters and seals
- Pressure lines fastest | The loss is a small share of a high working pressure
- Check at the coldest oil temperature | Laminar losses scale with viscosity, ten times or more between cold and warm
- x Rely on a suction strainer | Its cold-start loss can exceed the pump's whole inlet margin
- ? Ask the filter maker for the cold-start drop | And at what temperature its bypass and indicator are reliable
```

## Bringing it together

Oil lines usually run laminar, so their pressure drop follows the Hagen–Poiseuille law: proportional to viscosity and flow, and to the inverse fourth power of bore. HPU-40's pressure line loses 0.66 bar at 50 °C and nearly 6 bar at a cold start; its suction strainer would have starved the pump on cold mornings; its return filter bypasses until the oil reaches about 15 °C. Every viscosity-dependent calculation needs the coldest and hottest oil temperatures, not the data sheet's. The next chapter takes the same viscous flow into the narrowest passages of all, the clearances through which pumps, valves and cylinders leak.

## Exercise: one size up

The press shop considers replacing HPU-40's 5 m return line, 25 mm bore, with a 32 mm bore line. Using the hydraulic line sizing tool or the Hagen–Poiseuille law, find the straight-line loss at 40 L/min and 5 °C (382.5 mm²/s, 876.1 kg/m³) for both bores, ignoring fittings.

**Worked answer.** This is an illustration. In the 25 mm line the velocity is 1.358 m/s, the Reynolds number 88.8, and the straight-line loss 1.17 bar. In laminar flow the loss scales with the inverse fourth power of the bore, so the 32 mm line loses 1.17 × (25 ÷ 32)⁴ = 1.17 × 0.3725 = **0.43 bar**. The tool, with 32 mm bore, gives a velocity of 0.829 m/s, a Reynolds number of 69.4 and the same 0.43 bar. Together with the 2.5 bar filter bypass, the cold-start back-pressure would fall from about 3.7 to about 2.9 bar. The larger line helps, but the warm-up routine and heater, which also stop the filter bypassing, do more.
