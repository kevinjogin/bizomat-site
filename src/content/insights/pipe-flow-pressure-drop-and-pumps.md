---
title: "Pipe flow, pressure drop and pump selection: getting fluid where it needs to go efficiently"
description: "How head, velocity, friction and fittings set pressure drop, how system and pump curves fix the operating point, why efficiency and NPSH matter, and how pipe size affects energy cost."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - design
  - operations
  - process-improvement
author: "KEVOS"
featured: false
draft: false
---

Pumps and pipework move water, chemicals, oils, slurries and process fluids through almost every factory, building and plant. They are also among the largest users of electricity in many facilities. A pump that is oversized, running far from its best efficiency point, throttled by a half-closed valve or pushing fluid through undersized pipe can waste energy every hour it runs for decades. A pump that is poorly matched to its suction conditions can cavitate, destroying impellers and seals.

Most of these problems come from a handful of misunderstandings: confusing pressure with flow, sizing pipes on capital cost alone, selecting pumps with generous margins "to be safe", and never checking where a pump actually operates once installed. The principles that prevent them are not complicated, and a working understanding helps owners, maintenance teams and engineers ask better questions of designers and suppliers.

This article explains, in general terms, how pressure and head relate, how fluid velocity and flow regime affect losses, how to estimate friction and fitting losses, how system and pump curves combine to set the operating point, why the best efficiency point and net positive suction head matter, how variable speed drives change the picture and how pipe size affects lifetime energy cost. It is general information; pumping systems for critical or hazardous duties should be designed by qualified engineers using manufacturers' data.

## Pressure and head

Pump engineers often talk about **head** rather than pressure. Head is the height of a column of the fluid that the pressure could support, expressed in metres. The two are related by:

head (m) = pressure (Pa) ÷ (density (kg/m³) × g (m/s²))

For water, a pressure of 100 kPa (1 bar) corresponds to about 10.2 m of head. Head is useful because a centrifugal pump delivers roughly the same head regardless of the fluid's density, whereas the pressure it produces is proportional to density.

The total head a pump must provide is the sum of:

- **static head**, the vertical lift from the source liquid level to the delivery level, plus any difference in pressure between them;
- **friction head**, the losses in straight pipe; and
- **minor losses**, from fittings, valves, bends, entries and exits.

## Velocity and flow regime

Fluid velocity in a pipe is the flow rate divided by the pipe's internal area. Velocity matters because friction losses rise roughly with the square of velocity: doubling the velocity roughly quadruples the pressure drop.

The **Reynolds number**, which combines velocity, pipe diameter, density and viscosity, indicates the flow regime:

- **Laminar flow**, at low Reynolds numbers, typically below about 2,300 in pipes, with smooth, orderly flow, common with viscous fluids.
- **Turbulent flow**, at Reynolds numbers above about 4,000, with chaotic mixing, typical for water in most industrial pipework.
- A transitional range lies between.

Velocity guidelines vary by fluid and application, but water in many pumped industrial systems is designed for moderate velocities, often in the range of about one to three metres per second, with lower velocities in suction lines to protect pumps. Very high velocities increase friction, noise, erosion and the risk of pressure surges; very low velocities can allow solids to settle.

## Friction and fitting losses

The friction loss in straight pipe is commonly calculated using the **Darcy–Weisbach equation**:

h_f = f × (L ÷ D) × (v² ÷ 2g)

where f is the friction factor, L is the pipe length, D is the internal diameter, v is the velocity and g is gravitational acceleration. The term v² ÷ 2g is called the **velocity head**. The friction factor depends on the Reynolds number and the pipe's relative roughness, and is read from a Moody chart or calculated with established equations. Empirical formulas, such as Hazen-Williams, are also widely used for water systems.

**Minor losses** from fittings and valves are usually expressed as a loss coefficient, K, multiplied by the velocity head, or as an equivalent length of straight pipe. In systems with many fittings and short pipe runs, minor losses can exceed straight-pipe friction. Partly closed valves, strainers, check valves and sharp entries all add losses.

## System curves and pump curves

A **system curve** shows the head the system requires at each flow rate. It starts at the static head at zero flow and rises with flow, roughly with the square of flow, as friction and minor losses increase.

A **pump curve**, published by the manufacturer, shows the head a centrifugal pump delivers at each flow rate for a given impeller and speed. Head usually falls as flow increases. The manufacturer also publishes efficiency, power and NPSH required curves.

The pump operates where the two curves intersect: the **operating point**. If the system has more resistance than expected, the operating point moves to lower flow; if less, to higher flow. Engineers who add large safety margins to the calculated head often select pumps that, once installed, run at much higher flows than intended or have to be throttled.

### The best efficiency point

Every centrifugal pump has a **best efficiency point** (BEP), the flow at which it converts input power into hydraulic power most efficiently. Running well away from the BEP, especially at low flows, increases energy use, vibration, radial loads, heating and wear, and shortens bearing and seal life. Good selection places the expected operating point close to the BEP, within the manufacturer's recommended operating range.

### Net positive suction head and cavitation

If the pressure at the pump inlet falls too low, the liquid can vaporise locally, forming bubbles that collapse violently as pressure rises inside the pump. This **cavitation** causes noise, vibration, loss of performance and pitting damage to impellers.

To avoid it, the **net positive suction head available** (NPSHa), determined by the suction system, must exceed the **net positive suction head required** (NPSHr) published by the pump manufacturer, with a margin. NPSHa falls with higher suction lift, longer or smaller suction pipes, more suction fittings, higher liquid temperature and higher altitude. Short, generously sized suction lines with few fittings and a flooded suction, where the liquid level is above the pump, help prevent cavitation.

## Controlling flow: throttling or speed

Flow can be controlled by **throttling** a valve, which adds resistance and moves the operating point back along the pump curve, wasting the energy dissipated across the valve, or by changing the **pump speed** with a variable speed drive.

The **affinity laws** describe how a centrifugal pump's performance changes with speed: flow changes in proportion to speed, head with the square of speed and power with the cube of speed. A 20% reduction in speed can, in principle, reduce power by about half. In practice, savings are smaller in systems with high static head, because the pump must still overcome the lift, so the actual operating point must be assessed on the system curve. The [selecting electric motors and drives](/insights/selecting-electric-motors-and-drives/) article explains variable speed drives and motor efficiency.

## Pump types

**Centrifugal pumps** suit most clean, low-viscosity liquids at moderate to high flows. **Positive displacement pumps**, such as gear, lobe, progressive cavity, diaphragm and piston pumps, deliver a nearly fixed volume per revolution or stroke and suit viscous fluids, precise dosing, high pressures and shear-sensitive or solids-laden products. Positive displacement pumps must never be run against a closed outlet without pressure relief, because pressure can rise until something fails. Pump selection depends on the fluid's viscosity, solids content, abrasiveness, temperature, chemical compatibility and the required flow and head.

## Pressure surges and water hammer

When flow in a pipe is stopped or changed suddenly, for example by a quick-closing valve or a pump tripping, the momentum of the moving fluid creates a pressure wave called a **surge** or **water hammer**. The pressure rise can be many times the normal operating pressure in long pipelines, causing banging noises, damaged supports, failed fittings and burst pipes.

Surges are more severe with higher velocities, longer pipes and faster valve closure. Mitigation includes slower-closing valves, soft starting and stopping of pumps with variable speed drives, surge vessels or air chambers, appropriate check valves and keeping velocities moderate. Long pumping mains deserve a surge analysis during design.

## Measuring an installed pump

The most reliable way to know how a pump is performing is to measure it. Useful measurements include:

- **suction and discharge pressures**, converted to head, to find the head the pump is delivering;
- **flow**, using a permanent or clamp-on flow meter;
- **motor power or current**, to estimate efficiency; and
- **vibration and temperature**, as indicators of operating away from the best efficiency point or developing faults.

Plotting the measured operating point on the manufacturer's pump curve shows whether the pump is near its best efficiency point, running far to the left or right of it, or worn. Comparing measurements over time reveals wear, blockages and changes in the system. These checks often identify pumps that can be trimmed, slowed or replaced with smaller units, with substantial energy savings.

## Pipe size and lifetime cost

Choosing a pipe size is an economic trade-off. A smaller pipe costs less to buy and install but creates higher friction, requiring more pump power for the life of the system. A larger pipe costs more initially but reduces energy use. Because pumps often run for thousands of hours a year for decades, energy frequently outweighs the difference in pipe cost.

## A worked example

This is an illustrative example. The figures are hypothetical and simplified; a real design would use detailed data and allow for all losses and conditions.

A plant needs to transfer 10 L/s of water through 120 m of steel pipe with a static lift of 15 m. Fittings and valves have a combined loss coefficient of about 8. The pump is expected to run about 4,000 hours a year, and electricity costs about $0.25 per kWh.

**Option A: 80 mm internal diameter.** The velocity is 0.010 m³/s divided by an area of about 0.00503 m², or about 2.0 m/s, giving a velocity head of about 0.20 m. The flow is turbulent, and the friction factor is about 0.0195. Friction loss is about 0.0195 × (120 ÷ 0.08) × 0.20, or about 5.9 m. Minor losses are about 8 × 0.20, or 1.6 m. The total head is about 15 + 5.9 + 1.6, or 22.5 m. Hydraulic power is about 1,000 × 9.81 × 0.010 × 22.5, or about 2.2 kW. At a pump efficiency of 65%, shaft power is about 3.4 kW.

**Option B: 100 mm internal diameter.** The velocity falls to about 1.27 m/s, with a velocity head of about 0.083 m. Friction loss is about 1.9 m and minor losses about 0.7 m, so the total head is about 17.6 m. Hydraulic power is about 1.7 kW, and shaft power about 2.7 kW.

The larger pipe saves about 0.75 kW of shaft power. Over 4,000 hours, that is about 3,000 kWh a year, or about $750 a year at $0.25 per kWh, before considering motor efficiency. If the extra cost of the larger pipe and fittings is modest, it pays back within a few years and keeps saving for the life of the system. The larger pipe also allows a smaller pump and motor, and leaves headroom for future flow increases.

## How this applies to a small Australian business

- **Size pipes on lifetime cost**, not just installed cost.
- **Select pumps near their best efficiency point** for the real operating condition.
- **Avoid excessive safety margins** that lead to oversized, throttled pumps.
- **Protect suction conditions** to prevent cavitation.
- **Use variable speed drives** where flow demand varies, rather than throttling.
- **Check installed performance**: measure flow, pressures and power and compare with the pump curve.
- **Maintain pumps and strainers**, as wear and blockages move the operating point.

## Common mistakes

- **Oversizing pumps "to be safe"**, then throttling them.
- **Long, small or fitting-laden suction lines.**
- **Ignoring minor losses** in compact systems with many fittings.
- **Running centrifugal pumps at very low flows** for long periods.
- **Running positive displacement pumps without pressure relief.**
- **Assuming affinity-law savings without checking static head.**
- **Never measuring how the installed system actually performs.**

## Frequently asked questions

**Why does a pump deliver more flow than specified?** Usually because the actual system resistance is lower than the design estimate, often after generous margins were added, so the operating point moves to higher flow along the pump curve.

**Is it better to throttle or trim the impeller?** For a permanent reduction in duty, trimming the impeller or reducing speed is usually more efficient than throttling, which wastes energy across the valve. The pump manufacturer can advise on trimming.

## Questions to ask

- Where do our major pumps actually operate relative to their best efficiency points?
- Are any pumps throttled for long periods?
- Do our suction conditions provide adequate NPSH with margin?
- Were pipe sizes chosen on lifetime energy cost?
- Would variable speed control suit any of our varying-demand systems?

## Bringing it together

Pumping systems obey a few clear principles. Head combines static lift, friction and minor losses; friction rises steeply with velocity; system and pump curves together set the operating point; pumps should run near their best efficiency point; and suction conditions must provide enough NPSH to prevent cavitation. Speed control usually beats throttling, and larger pipes often repay their extra cost through lower energy use. Checking how installed pumps actually operate, rather than assuming the design was right, uncovers many of the energy savings and reliability improvements available. The [cutting energy use in business premises](/insights/cutting-energy-use-in-business-premises/) article shows where pumping fits in a wider energy review.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. Pumping systems for critical or hazardous duties should be designed by qualified engineers using manufacturers' data.*
