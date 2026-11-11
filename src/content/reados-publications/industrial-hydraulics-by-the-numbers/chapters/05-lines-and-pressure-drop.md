---
book: industrial-hydraulics-by-the-numbers
chapterSlug: size-the-lines-for-the-real-flows
order: 5
title: "Size the lines for the real flows"
description: "Map every line in a hydraulic circuit to its real flow and pressure, size pressure, return and suction lines for velocity, pressure drop and tube rating, and allow for cold oil and the cap-end flow."
draft: false
---

Pipes and hoses look like the least interesting part of a hydraulic system, and they are often sized last, from a catalogue, at the pump's flow. That is where a surprising number of problems start. A line carries whatever flow the circuit sends through it, which on a cylinder with a rod can be much more than the pump delivers. It loses pressure in proportion to the viscosity of the oil, which on a cold morning can be six times its working value. And it has its own pressure rating, which must cover the highest pressure it can see, not the pressure on the main gauge.

This chapter maps every line on the press to its real flow and pressure, sizes each one, and checks it with a line sizing tool. The failure case is the first line schedule, which used the pump's 40 L/min for every line. It was caught on paper, which is the cheapest place to catch it.

## Three kinds of line

Hydraulic lines fall into three groups, each with a different priority.

- **Pressure lines** carry oil from the pump to the valves and the cylinder at high pressure. They are kept reasonably small, because oil is expensive and small tube is easier to bend, but not so small that velocity and pressure drop become large.
- **Return lines** carry oil back to the tank at low pressure. Pressure drop here causes back pressure, which resists the cylinder, loads the return filter and stirs air into the tank. They are kept larger and slower than pressure lines.
- **Suction lines** carry oil from the tank to the pump inlet. The pump can only draw oil in using the difference between atmospheric pressure on the tank and the pressure at its inlet, which is less than one bar in total. A restrictive suction line starves the pump, which then cavitates: vapour bubbles form and collapse, eroding the pump and making it scream. Suction lines are the largest and slowest of all.

This book uses starting velocity limits of **5 m/s** for pressure lines, **3 m/s** for return lines and about **1.2 m/s** for the suction line. The first two are also the defaults in the sizing tools. Pump makers state their own limits for inlet conditions, usually as a minimum inlet pressure, and those govern for a real pump.

## Map the lines to their real flows

The first step is a table of every line, with the largest flow and the highest pressure it can see. On a press with a single-rod cylinder, the return stroke changes everything on the cap side.

```figure
type: compare
title: The press's lines, with their largest flows and highest pressures
cols: Largest flow | When | Highest pressure
caption: This is an illustration. The rod line's highest pressure is the trapped rod-end pressure from Chapter 4, which the rod-side relief now limits, but the line is still rated for it. The return line carries the cap-end outflow on the return stroke.
- Suction, tank to pumps | 40 L/min | always | slightly below atmosphere
- Pressure, pumps to valve | 40 L/min | approach and return | 175 bar
- *Cap line, valve to cap end | 58.3 L/min out | return stroke | 175 bar
- Rod line, valve to rod end | 39.9 L/min in | return stroke | up to about 257 bar if trapped
- *Return, valve to filter and tank | 58.3 L/min | return stroke | a few bar
```

Two lines carry more than the pump delivers. On the return stroke, 40 L/min goes into the rod end and **58.3 L/min** comes out of the cap end, because the full-bore area is 1.457 times the annulus. That oil flows back through the cap line, the directional valve and the return line to the tank. Every one of them must pass 58.3 L/min.

## What a line loses

Oil flowing through a line loses pressure to friction along the wall and to turbulence in bends, tees and fittings. The Darcy–Weisbach equation gives the friction loss as a friction factor times the length divided by the bore, times the velocity pressure, which is half the density times the velocity squared. Fittings add their own loss coefficients, summed and multiplied by the same velocity pressure.

The friction factor depends on the Reynolds number, the velocity times the bore divided by the kinematic viscosity. Below about 2,300 the flow is laminar and the friction factor is simply 64 divided by the Reynolds number; above about 4,000 it is turbulent and depends weakly on roughness. In between is a transitional band where flow can switch between the two.

Two consequences follow for hydraulic lines.

- **Viscosity matters a great deal.** In laminar flow, pressure drop is directly proportional to viscosity. An ISO VG 46 oil, which is 46 cSt at 40 °C, is about 30 cSt at 50 °C and about 185 cSt at 15 °C. Chapter 8 shows where those figures come from. A line that loses 1 bar when warm can lose several bar on a cold start.
- **Velocity matters even more.** The velocity pressure rises with the square of velocity, and halving a line's bore quadruples its velocity for the same flow.

Pressure lost in a line is power lost as heat, flow times pressure drop. That heat ends up in the oil, and Chapter 6 adds it to the press's heat budget.

## The tool

The [Hydraulic Line Sizing tool](/tools/hydraulic-line-sizing/) checks one line at a time. It takes the flow, the velocity limit for that kind of line, the tube's bore and outside diameter, the working pressure, the tube's tensile strength and a design factor (burst pressure divided by working pressure), the line length, the sum of the fitting loss coefficients, the oil's viscosity at working temperature and its density, and the tube's roughness and an allowed pressure drop. It returns the least bore for the velocity limit, the actual velocity, the Reynolds number and regime, the friction factor, the pressure drop through the line and fittings, the power lost as heat, the tube's burst pressure by Barlow's formula on the outside diameter, and its working pressure rating at the chosen design factor.

Barlow's formula gives burst pressure as twice the tensile strength times the wall thickness divided by the outside diameter. Dividing by a design factor, 4 here, gives a working rating. It is a check on the tube itself; fittings and hoses have their own ratings, which must be at least as high.

## Size each line

All tube here is cold-drawn seamless steel with an illustrative tensile strength of 410 MPa, checked with oil at 30 cSt (warm) and 184.7 cSt (cold).

```figure
type: compare
title: Line sizing results for the press, warm oil at 30 cSt unless noted
cols: First schedule | Final schedule
caption: This is an illustration. Tube sizes are outside diameter × wall in mm. Lengths and fitting coefficients: cap line 3 m and K = 4; return line 2.5 m and K = 3; rod line 3 m and K = 4; suction 0.6 m and K = 1.5. The first schedule used one size for every pressure and return line.
- Cap line at 58.3 L/min | 20 × 2.5: 5.5 m/s, 1.7 bar, fails velocity | 25 × 3: 3.43 m/s, 0.44 bar, rating 246 bar
- Cap line, cold oil | 20 × 2.5: 4.3 bar | 25 × 3: 1.67 bar
- Rod line at up to 257 bar | 20 × 2.5: rating 256 bar, fails | 20 × 3: rating 308 bar, 2.98 m/s
- Return line at 58.3 L/min | 20 × 2.5: 5.5 m/s against 3 m/s, fails | 30 × 3: 2.15 m/s, 0.14 bar
- *Return line, cold oil | 20 × 2.5: not acceptable | 30 × 3: 0.54 bar
- Suction at 40 L/min, cold oil | 38 × 3: 0.83 m/s, 0.03 bar | 38 × 3 unchanged
```

### The pressure line

From the pumps to the valve, the flow is 40 L/min at up to 175 bar. A 20 × 2.5 tube has a 15 mm bore, a velocity of 3.77 m/s and, over 4 m with fittings totalling K = 5, a warm pressure drop of about **0.87 bar**, costing about 58 W. Its Barlow burst pressure is 2 × 410 × 2.5 ÷ 20 = 102.5 MPa, which is 1,025 bar, and its working rating at a factor of 4 is **256 bar**, above the 175 bar relief. It stays.

### The cap line

The cap line carries 40 L/min in and 58.3 L/min out. In 20 × 2.5 tube the outflow runs at **5.5 m/s**, above the 5 m/s limit, with a warm drop of 1.7 bar and a cold drop of **4.3 bar**. Moving up to 25 × 3 tube, with a 19 mm bore, brings the velocity to **3.43 m/s**, the warm drop to **0.44 bar** and the cold drop to 1.67 bar. Its working rating of **246 bar** covers the 175 bar the cap end can see.

### The rod line

The rod line carries 39.9 L/min in on the return stroke and 27.5 L/min out on the approach. Flow is not its problem. Pressure is. Chapter 4 showed the rod end can reach about 257 bar if oil is trapped there, and although a rod-side relief now limits that, the design rates the line for it as a second line of defence. The 20 × 2.5 tube's rating of 256 bar falls just short. A 20 × 3 tube, with a 14 mm bore, is rated at **308 bar** and runs at 2.98 m/s.

### The return line

From the directional valve to the return filter and tank, the return stroke sends 58.3 L/min. In 20 × 2.5 tube that is 5.5 m/s, nearly twice the 3 m/s limit for a return line. A 30 × 3 tube, with a 24 mm bore, runs at **2.15 m/s** and loses only **0.14 bar** warm and 0.54 bar cold. Low back pressure in the return line keeps the return filter's pressure drop down, which matters in Chapter 8.

### The suction line

The two pumps draw 40 L/min together through one inlet. A 38 × 3 tube, with a 32 mm bore, runs at **0.83 m/s** and loses about **0.03 bar** even with cold oil at 184.7 cSt, where the flow is firmly laminar. The pump inlet is below the tank's oil level, so the oil's head helps a little. A suction strainer, if fitted, must be sized so that its own drop, when cold and partly clogged, does not starve the pumps; many designers prefer a coarse strainer or none, with fine filtration on the return line instead.

## Hoses

The press's cylinder is fixed to the crosshead, so the cylinder lines can be rigid tube. The power unit stands beside the press on its own anti-vibration mounts, and short hoses connect it to the press's tube so that pump vibration does not travel into the frame and fittings do not crack. Each hose is chosen like a tube, for its flow and the highest pressure it can see, plus its bend radius, length and routing, and it is protected where people stand. A hose burst at 175 bar releases a jet that can inject oil through skin or whip the hose end. [Hydraulic fittings and hose assemblies](/reados/collections/machine-elements-and-mechanical-design/hydraulic-fittings-and-hose-assemblies/) covers selection, assembly, routing and inspection, and this chapter does not repeat it.

On the press, the hoses facing the operator are fitted with protective sleeves and routed behind the guarding, and the ends are restrained so that a failed end fitting cannot whip.

## A failure case: one size for everything

This is an illustration. The first line schedule for the press was written in a hurry from the pump's flow. Every pressure and return line was specified as 20 × 2.5 tube, because a 15 mm bore at 40 L/min gives 3.77 m/s, inside the 5 m/s pressure-line limit. The return line was the same size "to keep the fittings common".

The design review caught it with one question: what flows through each line on the return stroke? The answer was the table at the start of this chapter. On the return stroke, the cap line and return line carry 58.3 L/min, not 40, and the return line had been sized to a pressure-line velocity, not a return-line one. In service, the first schedule would have produced about 5.5 m/s in both lines, a cold back pressure of several bar through the cap line, valve, return line and filter, and a noisy, aerated return to the tank. The back pressure on the cap end also acts against the return stroke: every bar of back pressure there needs about 1.46 bar more at the rod end to overcome it.

The rod line was the subtler problem. Its 256 bar rating looked comfortable against the 175 bar relief. Only the intensification check from Chapter 4 showed that it could see more.

The correction was the final schedule above, which costs a little more in tube and fittings and saves heat, noise and filter trouble for the life of the press.

## How this applies to a small Australian business

Draw the circuit and write the largest flow and highest pressure beside every line before choosing any tube or hose. Remember that the cap side of a single-rod cylinder carries the area ratio times the pump flow on the return stroke. Check pressure drop with cold oil as well as warm, because cold starts are when back pressure and pump starvation do their damage. Rate the rod-side line for the trapped pressure it could see. And size suction lines generously, because the pump has less than one bar to work with.

## Exercise: a smaller suction line

To make the power unit more compact, the builder proposes a **25 × 2** suction tube, with a 21 mm bore, for the 40 L/min inlet, with the same 0.6 m length and K = 1.5. Check it with the [Hydraulic Line Sizing tool](/tools/hydraulic-line-sizing/) using cold oil at **184.7 cSt**, a velocity limit of **1.2 m/s** and an allowed drop of **0.2 bar**. Does it pass?

**Worked answer.** The tool gives a velocity of **1.92 m/s**, above the 1.2 m/s limit, and a least bore of **26.6 mm** for that limit. The cold pressure drop is about **0.16 bar**, just inside the 0.2 bar allowed, with laminar flow at a Reynolds number of about 219. The line fails on velocity. Its pressure drop is close to the limit with clean oil and no strainer, so any strainer, a partly blocked inlet or colder oil would push it over. The 38 × 3 suction line stays; a compact unit can be achieved by moving the pumps, not by squeezing the inlet.
