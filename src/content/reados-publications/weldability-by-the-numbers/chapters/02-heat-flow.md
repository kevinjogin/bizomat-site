---
book: weldability-by-the-numbers
chapterSlug: heat-flow-conductivity-and-preheat
order: 2
title: "Heat flow, conductivity and preheat"
description: "Estimate how fast heat leaves a weld in different metals, how much energy a preheat needs, and why copper and aluminium are a matter of heating rate rather than heat quantity."
draft: false
---

Every weld is a race between the heat source putting energy in and the surrounding metal carrying it away. In mild steel the race is fairly even, which is one reason it is easy to weld. In copper and aluminium the metal wins: heat leaves the joint so quickly that a heat source sized for steel may never bring the joint to fusion. In stainless steel the heat source wins too easily, and the heat stays concentrated near the weld. Understanding which way the race runs, and by how much, is the first numerical tool of weldability.

Kautny met this repeatedly in 1915. Nickel, he wrote, conducts heat so well that it must be welded on an anvil heated to dark red; copper must be melted first where it meets iron because it drains heat so fast; lead, with its low melting point and modest conductivity, must be welded very quickly. This chapter puts numbers on those observations and applies them to the cast iron casing, the copper header and the aluminium cover.

## Conductivity and diffusivity

Two properties describe how heat moves in a metal.

**Thermal conductivity**, k, in watts per metre per kelvin, says how much heat flows through the metal for a given temperature gradient. It governs the steady drain of heat away from a hot zone.

**Thermal diffusivity**, the conductivity divided by the density and the specific heat, says how quickly a temperature change spreads through the metal. It governs how fast the heated zone grows and how quickly a hot spot cools once the heat source moves on. A metal with high diffusivity carries heat away quickly and does not let any one spot stay hot.

```figure
type: bars
title: Thermal diffusivity of the metals in the case
unit: mm²/s
max: 125
caption: Calculated from typical conductivity, density and specific heat values. Copper spreads heat about eight times as fast as carbon steel, aluminium about seven times.
- *Copper | 114.8
- Aluminium | 96.1
- Nickel | 24.0
- Grey cast iron | 15.7
- Carbon steel | 14.0
```

A useful rough guide is that heat spreads a distance of about the square root of diffusivity times time. In ten seconds, that is about 34 mm in copper, 31 mm in aluminium and 12 mm in carbon steel. The heated zone around a copper or aluminium weld is therefore several times wider than around a steel weld made in the same time, and the energy needed to keep the joint hot is spread over a far larger volume.

## How fast heat leaves the joint

This is an illustration. Consider heat flowing away from a weld zone at 600 °C above its surroundings, along a path of 12 mm by 50 mm cross-section and 50 mm length, a simple stand-in for one direction of heat flow out of a joint. The steady heat flow is the conductivity times the area times the temperature difference, divided by the length.

```figure
type: formula
title: Steady heat flow along a path from the weld zone
formula: q = k × A × ΔT ÷ L
caption: This is an illustration for a 12 × 50 mm path, 50 mm long, with a 600 K difference. Copper drains about 2.9 kW along this one path; steel about 0.39 kW.
- k | thermal conductivity, W/m·K
- A | cross-sectional area, m²
- ΔT | temperature difference, K
- L | path length, m
step: q (copper) = 401 × 0.0006 × 600 ÷ 0.05
step: q (copper) = 401 × 0.0006 × 12,000
step: q (copper) ≈ 2,887 W
```

For carbon steel the same path carries about 389 W, and for aluminium about 1,700 W. Compare those with the heat a flame delivers. The READOS book *Oxy-Fuel by the Numbers* estimates that a cutting preheat flame burning 0.50 m³/h of acetylene releases about 2.6 kW in its primary flame. A flame of that size on a steel joint has power to spare; on a copper joint, one direction of heat flow alone could take more than it supplies. That is why copper welds that start well can freeze as soon as the torch moves, and why copper and aluminium need larger heat sources, preheat, or both.

## Preheat: quantity of heat

Preheating raises the temperature of the part before welding, so the weld zone starts closer to its working temperature and loses less heat to the surrounding metal. The energy needed is simple to estimate: the mass times the specific heat times the temperature rise.

This is an illustration. Chapter 5 shows that the cast iron casing needs preheating to about 300 °C for its repair. Raising all 85 kg from 20 °C to 300 °C needs about 85 × 0.46 × 280 ≈ **10,950 kJ**, roughly 10.9 MJ or 3.0 kWh. That is a substantial quantity of heat. If the workshop tried to deliver it with a large oxy-fuel heating nozzle burning 1.5 m³/h of acetylene, which releases about 82,000 kJ an hour in total, and about a quarter of that reached the casing, the heating would take over half an hour, and in practice longer, because losses rise as the casing gets hotter. Kautny recommended heating complex castings slowly in a furnace until the heat penetrated the whole mass, and the arithmetic supports him: a furnace or electric heating blankets deliver that energy evenly and controllably, while a flame heats the surface it touches first.

```figure
type: formula
title: Heat to preheat a part
formula: Q = m × c × ΔT
caption: This is an illustration for the 85 kg cast iron casing heated from 20 °C to 300 °C.
- m | mass, kg
- c | specific heat, kJ/kg·K (cast iron about 0.46)
- ΔT | temperature rise, K
step: Q = 85 × 0.46 × 280
step: Q ≈ 10,950 kJ
step: Q ≈ 3.0 kWh
```

## Preheat: rate of heat

The copper header shows that the quantity of heat is only half the story. This is an illustration. The 12 mm thick header block weighs about 1.8 kg. Raising it to 400 °C, within the range TWI gives for preheating thick copper, needs about 1.8 × 0.39 × 380 ≈ **267 kJ**. A steel block of the same size would weigh about 1.58 kg and need about 1.58 × 0.49 × 380 ≈ **294 kJ**, slightly more. The copper header does not need more heat than steel; it needs the heat delivered faster than its conductivity carries it away, and it needs the whole block hot, because any cold part of it acts as a sink that draws heat from the joint.

That is the real distinction between the metals. Steel tolerates a heat source that delivers its energy slowly and locally. Copper and aluminium punish it: the heat spreads into the whole part as fast as it arrives, and the joint never gets ahead. The remedy is either a heat source with much higher power concentrated at the joint, or preheating the whole part so the surrounding metal is no longer a sink.

## Heat input from an arc

For arc welding, the heat delivered per millimetre of weld is usually estimated as the arc voltage times the current, divided by the travel speed, multiplied by an efficiency factor for the process, since not all the arc's energy enters the work. This is an illustration. At 24 V, 180 A and a travel speed of 250 mm per minute, with an assumed efficiency of 0.8, the heat input is about 24 × 180 × 60 ÷ (1,000 × 250) × 0.8 ≈ **0.83 kJ/mm**. The same figure means very different things in different metals. In carbon steel it governs how fast the heat-affected zone cools, which Chapter 4 shows controls hardening. In copper it may simply be too little to fuse a thick joint. In stainless steel it may be more than the joint needs. Heat input is a common language for welding procedures; conductivity and diffusivity translate it into what actually happens in the metal.

## Thickness changes the race

Thickness matters as much as the metal. In thin sheet, heat can flow away only sideways, in two dimensions, and the joint heats up quickly. In thick plate, heat flows away in three dimensions, including down through the thickness, and the cooling is much faster. That is why TWI's guidance for copper is that thin sections can be welded without preheat while sections above about 5 mm need it, rising to as much as 600 °C for thick components. The same metal moves from easy to difficult as it thickens, not because its properties change but because the geometry of heat flow does. The copper coil's 1 mm tube walls in the case need no preheat at all; its 12 mm header block does.

## Lead at the other extreme

Kautny's note on lead completes the picture from the other side. Lead melts at about 327 °C and conducts heat modestly, so an oxy-acetylene flame can melt far more than intended in an instant, and thin lead sheet, he wrote, demands extraordinary skill. Here the heat source is far too strong for the metal, and the work must be done quickly and lightly. Lead work also carries serious health risks from lead fume and dust, and in Australia lead work is subject to specific work health and safety requirements, including health monitoring for lead risk work. The race between heat in and heat out can be lost in either direction.

## Low conductivity: the opposite problem

Stainless steel sits at the other end of the scale, conducting heat about a quarter as well as carbon steel. Heat stays near the weld, so a given heat input produces a hotter, narrower zone. That makes stainless steel easy to bring to fusion but prone to overheating, to distortion, because the hot zone expands strongly against cold metal around it, and to changes in the metal held too long at temperature. The usual response is less heat, not more: lower heat input, faster travel, and attention to interpass temperature. The same ratio that tells a welder to add heat for copper says to hold it back for stainless.

## Nickel and Kautny's heated anvil

Kautny's rule for nickel shows the same reasoning applied with the tools of 1915. Nickel conducts heat less than copper but nearly twice as well as steel by modern figures, and he found that a nickel joint lost heat so quickly into a cold support that the work had to rest on an iron block heated to 700 to 800 °C. The heated anvil did two jobs: it stopped the support acting as a heat sink, and it acted as a preheat that kept the joint near welding temperature while it was hammered. A modern welder uses the same idea when placing copper or aluminium work on insulating supports, or on a heated plate, rather than on a cold steel bench that would draw the heat out of the joint.

## A failure: the header that would not wet

This is an illustration. The workshop's first attempt at the copper header used an oxy-acetylene welding tip that the welder would normally choose for steel of the same thickness. The tube end melted, but the header block glowed dull red and would not wet: the filler beaded on its surface instead of fusing. The welder held the flame longer, and the tube end began to sag and oxidise while the block still stayed below fusion.

The diagnosis came from the numbers in this chapter. The block was drawing heat away faster than the small tip could supply it, and the thin tube, with little mass to conduct its heat away, overheated first. The correction was to preheat the whole header block evenly to the planned temperature with a larger heating nozzle before welding, to support it on insulating firebrick rather than the steel bench, and to direct the welding heat mainly at the block rather than the tube. With the block no longer acting as a heat sink, the joint wetted and fused. The repair also moved to the welding process and filler that Chapter 7 describes, but the first fault was a heat balance, not a technique.

## Measuring preheat and interpass temperature

A preheat is only as good as its measurement. Temperature-indicating crayons, contact thermometers and infrared thermometers are the common shop tools. Each has limits: crayons must be suitable for the metal, and Chapter 8 shows that some contain sulphur that is harmful to nickel; infrared readings depend on the surface emissivity, which is low and variable on bright copper and aluminium, so contact measurement is more reliable there. The temperature should be measured at a stated distance from the joint, on the far side from the heat source where possible, and recorded. For thick parts, the temperature must be reached through the thickness, not only on the surface, which takes time in proportion to the square of the thickness divided by the diffusivity.

## Exercise: preheating the aluminium cover

The 6061-T6 aluminium cover plate measures 400 × 300 × 10 mm. Calculate its mass, using 2,700 kg/m³, and the heat needed to raise it by 80 K. Compare with a steel plate of the same size, using 7,850 kg/m³ and 0.49 kJ/kg·K. Then estimate how long a heat source delivering 2 kW effectively to the plate would take to warm the aluminium, ignoring losses.

The aluminium plate weighs 0.4 × 0.3 × 0.01 × 2,700 ≈ **3.24 kg** and needs about 3.24 × 0.91 × 80 ≈ **236 kJ**. The steel plate would weigh about 9.42 kg and need about 9.42 × 0.49 × 80 ≈ **369 kJ**. At 2 kW, the aluminium would take about 236 ÷ 2 ≈ **118 seconds**. The aluminium needs less heat than the steel, but its diffusivity is about seven times higher, so the heat spreads through the whole plate rather than staying where it was applied, and losses from its large surface rise quickly. Any preheat on a heat-treated aluminium alloy must also be kept within the limits its supplier or the welding procedure sets, because excessive or prolonged heating reduces the strength that the T6 temper provides.
