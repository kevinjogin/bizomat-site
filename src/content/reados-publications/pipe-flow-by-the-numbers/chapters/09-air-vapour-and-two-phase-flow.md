---
book: pipe-flow-by-the-numbers
chapterSlug: air-vapour-and-two-phase-flow
order: 9
title: "Air, vapour and two-phase flow"
description: "Where air comes out of water, CW-2's return high point at −25.4 kPa, three remedies and their cost in flow, vapour, flashing and two-phase flow, and an air vent that let air in."
draft: false
---

A pipe full of liquid is the simplest thing to calculate. A pipe with gas in it is not. Air drawn in at a leak, air coming out of solution where the pressure falls, vapour forming where hot water meets low pressure: each turns a single-phase flow into a two-phase one, and two-phase flow gurgles, slugs, bangs and carries less than it should. Most of the noises a liquid system makes, and many of its unexplained shortfalls, come from gas.

This chapter deals with gas in liquid lines. It sets out dissolved air and where it comes out, finds the pressure at the high point of CW-2's return, weighs three remedies for it and what each costs, deals with vapour and flashing in hot systems and the two-phase flow that follows, and ends with an air vent that let air in.

## Dissolved air

Water in contact with air dissolves some of it, and the amount it can hold rises with pressure and falls with temperature. Water that has been sitting in an open tank is close to saturated with air at atmospheric pressure. If that water passes through a region of lower pressure, or is warmed, it is suddenly oversaturated, and the excess air comes out of solution as small bubbles. They do not redissolve quickly when the pressure rises again; they gather into larger bubbles, collect at high points, and travel with the flow as slugs.

CW-2 picks up air in three ways: at its open tank, where the return splashes in and the surface is churned; at any leaking joint on the pump's suction, where the pressure is near or below atmospheric; and wherever the pressure in the loop falls below atmospheric, where dissolved air comes out.

## CW-2's return high point

Chapter 2 noted that CW-2's return header runs overhead at 4.0 m before dropping to discharge 1.2 m above the tank's water. The energy equation from the top of the drop to the discharge gives the pressure there.

At the discharge, the water leaves as a jet at atmospheric pressure, 1.2 m above the datum. Between the top of the drop and the discharge are 3 m of pipe and two elbows, which lose 0.112 + 0.094 = 0.206 m at the design flow. The velocity is the same at both ends. So the pressure head at the high point is 1.2 − 4.0 + 0.206 = **−2.59 m**, a gauge pressure of **−25.4 kPa**, about 76 kPa absolute at sea level.

```figure
type: formula
title: Pressure at the top of CW-2's return drop
formula: p_high ÷ ρg = z_discharge − z_high + h_loss between them
caption: This is an illustration at the design flow. The discharge is open to the atmosphere, so its pressure is zero gauge; velocity heads are equal and cancel.
- z_discharge | Height of the return discharge, 1.2 m above the tank's water
- z_high | Height of the return header, 4.0 m
- h_loss | 3 m of pipe and two elbows, 0.206 m
step: p_high ÷ ρg = 1.2 − 4.0 + 0.206 = −2.59 m
step: Gauge pressure: −2.59 × 9.778 = −25.4 kPa; about 75.9 kPa absolute
```

The water arriving at the high point has come from the open tank, close to saturated with air at about 101 kPa absolute. At 76 kPa absolute, it holds about a third more air than it can keep in solution, since the amount water can hold is roughly proportional to the absolute pressure, and the excess comes out. The bubbles collect along the top of the overhead return, are swept to the drop in slugs, and gurgle down it. The machines farthest along the return are noisy, and the slugs disturb the flow readings on the return.

## Three remedies

There are three ways to keep the high point's pressure at or above atmospheric, and each costs head that the pump must supply.

1. **A back-pressure orifice** at the discharge, sized to raise the high point's pressure. This is an illustration: an orifice taking 3.5 m at the design flow would add 3.5 m to the system curve. With CW-2's pump curve, the flow falls to **8.11 L/s**, and because the orifice's loss falls with the flow, the high point's pressure is only just positive, about +0.2 m.
2. **A vented high point**, with a pipe open to the atmosphere at the top of the drop so that the pressure there is atmospheric, and the drop below running part full by gravity. The pump must then lift the water to 4.0 m instead of 1.2 m, and the flow falls to **8.18 L/s**.
3. **Lowering the return** so that it never rises above the discharge. Run along the wall at 1.2 m instead of overhead at 4.0 m, the return's highest point is at the discharge's own level, and its pressure is slightly above atmospheric everywhere, about +0.2 m at the design flow, with no change to the system curve.

```figure
type: compare
title: Remedies for CW-2's return high point
rowhead: Remedy
cols: Flow with the existing pump, L/s | Pressure at the high point, m | Cost
caption: This is an illustration with the pump curve H = 16.5 − 0.070 × Q². The first two remedies take head from the machines; the third takes money and a shutdown.
- As built | 9.00 | −2.59 | air release, gurgling
- Back-pressure orifice, 3.5 m | 8.11 | +0.21 | 10% less flow
- Vented high point | 8.18 | 0 | 9% less flow, open vent
- * Return lowered to 1.2 m | 9.00 | +0.21 | pipework, one weekend
```

The plant chose the third. The first two would have cost each machine about a tenth of its cooling water, which was not acceptable; the reroute cost a weekend's work and some new pipe and brackets, and it removed the problem at its cause. The general lesson is that the cheapest time to avoid a sub-atmospheric high point is when the pipe is drawn: a hydraulic grade line plotted along the route, as Chapter 4 described, shows any length where the pipe rises above it.

## Finding air in a loop

Air announces itself, if anyone is listening. The signs on a loop like CW-2 are:

- **noise**: gurgling or rushing at high points and in drops, rattling at control valves;
- **unsteady readings**: gauge needles that flicker, flow meters whose readings wander, especially ultrasonic meters, which lose their signal in bubbly water;
- **uneven temperatures**: a branch or a cooler whose upper part is cooler than expected because an air pocket is sitting in it;
- **falling flow**: a pump that delivers less than its curve says, because the air reduces its effective head and blocks parts of the system.

```figure
type: checklist
title: Keeping air out of a liquid loop
caption: Each item closes one way that air enters or one place it collects.
- Suction pipe joints tight, and suction pressure positive at the worst strainer condition | air drawn in at leaks
- Return discharges below the tank's water surface, or into a calm zone away from the suction | air entrained by splashing
- Suction entrance submerged enough to stop vortices | air drawn down from the surface
- No length of pipe above the hydraulic grade line | air released at sub-atmospheric pressure
- Automatic air vents only where the pressure is always positive | vents that admit air
- An air separator where the water is warmest and its pressure lowest, on a positive-pressure section | air removed continuously
- x Air vent fitted at a high point at −25 kPa | admitted air instead of releasing it
```

An **air separator** removes dissolved and entrained air continuously. It is a vessel in which the water slows and turns, letting bubbles rise to a vent at the top. It works best where the water holds least air, which is where it is warmest and its pressure lowest while still above atmospheric. On CW-2, after the reroute, the separator sits on the return just before the tank, on the warm side, at a small positive pressure.

## Vapour and flashing

Water can turn to vapour as well as release air. It boils wherever its pressure falls to its **vapour pressure**, which rises steeply with temperature: about 3.2 kPa absolute at 25 °C, 19.9 kPa at 60 °C and 47.4 kPa at 80 °C. CW-2's water at 32 °C, with a vapour pressure of about 4.8 kPa, is nowhere near boiling at its high point's 76 kPa absolute.

A hot-water loop at 80 °C with the same high point would be closer, but its 76 kPa absolute is still above 47.4 kPa. Pushed further, by a higher run, a hotter temperature or a pump suction at low pressure, hot water **flashes**: part of it turns to steam where the pressure falls, and the steam bubbles collapse violently where the pressure rises again. That collapse is cavitation, and at a pump's impeller it erodes metal and destroys performance; the Library’s Centrifugal Pumps by the Numbers deals with it in detail.

## Filling and venting after maintenance

Most of the air in a loop arrives in one go, when it is drained for maintenance and refilled. How the loop is filled decides how much of that air stays. The plant's procedure for CW-2, an illustration of good practice, has five steps.

1. **Fill slowly from the lowest point**, so that the water rises steadily through each pipe and pushes the air ahead of it towards the high points, rather than trapping pockets behind it.
2. **Open the manual vents at every high point** while filling, and close each one only when water, not air, comes out steadily.
3. **Start the pump with the machines' isolating valves open** and run it at its normal flow for some minutes, so that the flow sweeps the remaining pockets towards the separator and the tank.
4. **Vent again**, with the pump stopped, because the moving water has gathered small pockets into larger ones at the high points.
5. **Check the flows** against the commissioning record, and repeat the venting if any branch is short.

The order matters because a pump will not move a large air pocket out of a downward leg on its own: the pocket's buoyancy resists the flow, and the pump's head is used up holding it in place. Venting by hand at each stage is quicker than waiting for the system to clear itself, which it may never do.

## Two-phase flow

Once gas and liquid flow together, the flow takes forms that single-phase calculations do not describe. In a horizontal pipe, at low gas fractions, small **bubbles** ride along the top. With more gas, they merge into long **plugs** and then into **slugs**, which fill the pipe for a moment and then leave it nearly empty, so that the flow lurches. At high gas fractions, the gas runs as a core with the liquid as a film on the wall, an **annular** flow. In a vertical pipe, the sequence is similar, and slug flow in a riser is notorious for heavy, irregular forces on the pipe and its supports.

Two-phase flows lose more head than the same liquid flow alone, often by a large factor, because the gas takes up area and the slugs accelerate and decelerate the liquid. Their losses are calculated by special methods, and the first engineering step is almost always to keep the gas out.

## Steam and condensate lines

The most violent two-phase effects occur in steam systems. Condensate collecting in a steam line can be picked up by the steam as a slug, driven at high speed, and stopped at a bend or a closed valve, with a blow that can split fittings. Steam meeting cold condensate can collapse suddenly, drawing the liquid into the void with a bang. These are forms of **water hammer** and **steam hammer**, and they are among the reasons steam lines are sloped, drained at low points through steam traps, and warmed up slowly. The Library’s [Water Hammer by the Numbers](/reados/publications/water-hammer-by-the-numbers/column-separation-and-the-profile/) deals with the pressure surges of liquid systems, including the column separation that forms when a pipeline's pressure falls to its vapour pressure.

## The error: an air vent that let air in

This is an illustration. Before the return was rerouted, a maintenance fitter, hearing the gurgling at the return's high point, fitted an automatic air vent there, a float valve that opens to release air when air collects under it. It is the standard remedy for air at a high point, and it is the right one for a high point at positive pressure.

At CW-2's high point, the pressure was −25.4 kPa. Whenever air collected and the float dropped, the vent opened, and instead of air escaping, the atmosphere pushed more air in. The gurgling grew worse, the return's flow became more irregular, and the vent's outlet whistled. It was found when an engineer held a hand over the vent's outlet and felt suction.

An automatic air vent only works where the pressure is above atmospheric. At a sub-atmospheric high point it is an air inlet, and the right device there, if the high point cannot be removed, is a vent combined with a valve that admits no air, or no vent at all. The vent was removed the same day, the opening was plugged, and the reroute was planned for the next shutdown. The gurgling returned to its old level, which was at least no worse than before the vent.

## Exercise: the pressure at a lowered high point

With the return rerouted to run along the wall at 1.2 m and discharge at the same 1.2 m, and the same 3 m of pipe and two elbows between the return's last tee and the discharge, find the pressure at the start of that 3 m length at the design flow. Is it above or below atmospheric?

**Worked answer.**

- The high point and the discharge are now at the same height, 1.2 m, so z_discharge − z_high = 0.
- The loss between them is unchanged at 0.206 m.
- The pressure head is 0 + 0.206 = **+0.21 m**, a gauge pressure of 0.21 × 9.778 = **+2.0 kPa**.

The pressure is above atmospheric, just. Air no longer comes out of solution there, and an automatic air vent at that point would release air rather than admit it. Along the rest of the return, upstream, the pressure is higher still, because each upstream length adds its own friction.
