---
book: industrial-hydraulics-by-the-numbers
chapterSlug: size-the-power-unit-and-keep-it-cool
order: 6
title: "Size the power unit and keep it cool"
description: "Size a hydraulic power unit's pumps, motor and reservoir, build an energy budget for one press cycle, find the oil's equilibrium temperature, and decide between shorter dwells and a cooler."
draft: false
---

Almost every watt that goes into a hydraulic system comes out as heat. Some of it leaves through the part being worked on, but most ends up in the oil: friction in the pumps, pressure lost in lines and valves, and oil pushed over a relief valve. If the reservoir and pipework cannot shed that heat as fast as it is made, the oil gets hotter until they can. Hot oil is thinner, so pumps leak more and lose efficiency; seals harden and crack sooner; the oil itself oxidises faster. Most of a hydraulic system's slow decline starts with a temperature that was never checked.

This chapter sizes the press's power unit with a sizing tool, then builds a proper energy budget for one cycle, because the press's heat depends far more on how it is used than on its peak power. The failure case is the summer contract job, when the oil in the tank reached 66 °C by mid-afternoon on a press that had run cool for months.

## Size the unit

The [Hydraulic Power Unit Sizing tool](/tools/hydraulic-power-unit-sizing/) takes the flow needed, the working pressure, the drive speed, the pump's volumetric and mechanical efficiencies, the motor's rated power, the reservoir volume as a multiple of the pump's flow per minute, the share of input power turned to heat, the share of time on load, a heat transfer coefficient for the reservoir and the oil temperature rise allowed above ambient. It returns the pump displacement, the drive torque, hydraulic and shaft power, the reservoir volume and an approximate surface area for a near-cubic tank, a heat load, the reservoir's natural dissipation and the cooler capacity still needed.

The press's highest power point, from Chapter 4, is both pumps delivering 40 L/min just before the unloading valve opens at 40 bar.

```figure
type: compare
title: Power unit sizing for the two-pump press and for one fixed pump
cols: Two pumps, at 40 L/min and 40 bar | One pump, at 40 L/min and 175 bar
caption: This is an illustration. Both runs use 1,450 rpm, 92% volumetric and 90% mechanical efficiency, a 4 kW motor, a reservoir of three times the flow per minute, 25% of input power to heat, 50% of time on load, 12 W/m²·K and 30 K allowed rise. The heat lines rest on those last three guesses, which this chapter replaces with a cycle budget.
- Combined pump displacement | 30 cm³/rev | 30 cm³/rev
- Drive torque | 21.2 N·m | 92.8 N·m
- Hydraulic / shaft power | 2.67 / 3.22 kW | 11.67 / 14.09 kW
- Motor check against 4 kW | adequate | too small
- Reservoir volume and surface | 120 L, about 1.58 m² | 120 L, about 1.58 m²
- Heat load / natural dissipation | 0.40 / 0.57 kW | 1.76 / 0.57 kW
- *Cooler capacity by this estimate | none | about 1.19 kW
```

The two-pump unit needs **3.22 kW** at the shaft, so the 4 kW motor is adequate. The single fixed pump would need **14.09 kW**, which confirms the choice made in Chapter 4. The combined displacement of 30 cm³/rev is the 24 and 6 cm³/rev pumps together.

### The reservoir

The tool sizes the reservoir at a multiple of the pump's flow per minute. Its default of three times gives **120 L**, a starting point that the jobs below then test. The reservoir does several jobs, and its volume is a compromise between them.

- **Settling.** Oil returning from the system carries air bubbles and fine debris. A reservoir with a baffle between the return and the suction gives them time to separate before the oil is drawn back in.
- **Volume swing.** The cylinder's cap end holds 3.68 L more at full extension than at full retraction, and the rod end holds 2.53 L less, so the tank level falls by the rod's volume, about **1.15 L**, as the press extends. The tank must keep the suction covered at the lowest level.
- **Heat.** Its walls lose heat to the surrounding air, which is why its surface area matters.

### Why the tool's heat line is only a start

The tool's heat estimate takes a share of the shaft power as heat and multiplies it by the share of time on load. Both are guesses, and for a press they are poor ones, because the press's power varies by a factor of ten within each cycle, and most of that cycle is idle. A better estimate builds the energy up from the cycle.

## Build an energy budget for one cycle

Each part of the cycle from Chapter 1 has a flow and an estimated pressure. Hydraulic power is pressure times flow, and shaft power is that divided by the pumps' overall efficiency, 0.828. Energy is power times time.

```figure
type: bars
title: Pump shaft energy in one 43.5 s cycle on the contract job
unit: kJ
max: 11
caption: This is an illustration. Pressures assumed: approach 8 bar; pressing an average of 110 bar on the small pump with the large pump unloaded at 4 bar; dwell 175 bar; return 15 bar; idle 4 bar with both pumps circulating through the tandem-centre valve. Total about 29.2 kJ.
- Approach, 4.97 s | 3.2
- Press, 2.76 s | 5.6
- Dwell at 175 bar, 2 s | 6.15
- Return, 3.79 s | 4.58
- *Idle, 30 s | 9.66
```

Three results stand out. The idle period, with both pumps simply circulating oil at a few bar, uses a third of the cycle's energy, because it lasts two-thirds of the time. The 2 s dwell, the shortest part of the cycle, uses a fifth, because it runs at the relief setting. And the pressing stroke itself, the only part that does useful work, uses less than a fifth.

The total shaft energy is about **29.2 kJ** per cycle, which over 43.5 s is an average of about **0.671 kW**.

Not all of that heats the oil. Pressing a bush 30 mm against an average of about 135 kN does about 4.05 kJ of work on the part, which heats the bush and housing, not the oil. Lifting the platen on the return stores energy that is given back on the next approach, so it can be ignored over a cycle. The heat into the oil is therefore about (29.2 − 4.05) ÷ 43.5, which is **0.578 kW**. In the terms the next tool uses, the system's overall efficiency is 4.05 ÷ 29.2, about **13.9%**.

That low efficiency is normal for a press that spends most of its time waiting. It is also why the oil can get hot on a press whose peak power is modest.

## Find the oil's temperature

The [Gearbox or Hydraulic Unit Heat Balance tool](/tools/gearbox-heat-balance/), in its hydraulic unit mode, takes the input power and the system's overall efficiency, the heat-dissipating surface area, a heat transfer coefficient for that surface, the ambient temperature, the highest oil temperature allowed, the temperature drop across a cooler, and the oil's specific heat and density. It returns the heat generated, the surface dissipation per kelvin, the oil's equilibrium temperature, the largest power the unit can take without a cooler, and the cooler duty and oil flow needed when the surface is not enough.

The workshop set **60 °C** as its maximum tank temperature, a conservative figure chosen to protect seals and keep the oil's viscosity well above the pump's minimum; component makers state their own limits. The shed reaches **35 °C** on a hot summer afternoon.

```figure
type: formula
title: Equilibrium oil temperature on the contract job, 2 s dwell
formula: oil temperature = ambient + heat into oil ÷ (h × A)
caption: This is an illustration. Tool inputs: 0.671 kW input, 13.9% overall efficiency, 1.58 m² surface, 12 W/m²·K, 35 °C ambient, 60 °C limit. The surface coefficient for a still-air steel tank is an estimate; it is the least certain number in the calculation.
- Heat into the oil | 0.671 × (1 − 0.139) = 0.578 kW
- Surface dissipation | 12 W/m²·K × 1.58 m² = 19 W/K
step: oil temperature = 35 + 578 ÷ 19 = 65.5 °C
step: limit without a cooler = 19 W/K × (60 − 35) K ÷ 0.861 = 0.55 kW of input
step: cooler duty needed = 578 − 19 × 25 = about 104 W
```

At 35 °C ambient, the tank settles at about **65.5 °C**, above the 60 °C limit. The tool reports **COOLER REQUIRED** with a duty of about 0.104 kW.

For comparison, the same relation applied to a single fixed pump, with about 1.12 kW of heat into the oil per cycle, gives 35 + 1,124 ÷ 19, about **94 °C**. The two-pump choice in Chapter 4 is what keeps the problem small.

## Where else the heat comes from

The cycle budget counts energy at the pump shaft, so it already includes every loss downstream: lines, valves, the relief and the cylinder's seals. It does not say where each loss happens, and knowing that helps when looking for savings.

- **Lines.** Chapter 5 found about 58 W lost in the pressure line at 40 L/min and about 43 W in the cap line during the return, both warm. Those flows last only seconds per cycle, so the lines' average share is a few watts.
- **The directional valve.** A valve maker's pressure-drop curve gives the loss at each flow. This is an illustration: a valve that drops 5 bar at 58 L/min loses 58.3 × 5 ÷ 600, about 0.49 kW, for the 3.79 s of the return, which is about 42 W averaged over the cycle.
- **The idle circulation.** At 4 bar through the tandem centre, the idle period costs 9.66 kJ per cycle. If a larger valve or a separate unloading path brought that to 2 bar, it would save about 4.8 kJ per cycle, almost as much as shortening the dwell.
- **The relief valve during the dwell.** Every second at the relief setting sends the small pump's whole 8 L/min across the valve at 175 bar, 2.33 kW of heat in a fist-sized body.

Heat can also be seen. A quick survey with an infrared thermometer after an hour's running shows where it is being made. A relief valve noticeably hotter than its lines means flow is passing over it, which is expected during a dwell and a fault at any other time. A pump case much hotter than its inlet line means internal leakage is rising. A directional valve hotter than the lines either side of it points to a high pressure drop through it. Recording those temperatures at commissioning gives a baseline that Chapter 9 uses.

## A failure case: the summer contract job

This is an illustration. For its first months the press did repair work: a few dozen cycles a day, with long gaps. The tank barely warmed. Then the workshop won a contract to press bushes into a batch of 4,000 housings, and ran the press steadily for whole shifts in January.

By mid-afternoon on the third day, the thermometer on the tank read **66 °C**. The pressing stroke had slowed slightly, which the operator noticed, and the small pump was noisier. At 65 °C, the ISO VG 46 oil's viscosity falls to about 17 cSt, close to the 16 cSt minimum the pump maker's data asked for in this illustration; thinner oil leaks more past the pump's gears, which explains the slower pressing. Nothing had failed yet, but every hour above 60 °C was costing seal and oil life.

The detection was a tank thermometer and an operator who mentioned a change in speed. The diagnosis was the energy budget above, which showed that the press, unchanged, had moved from a duty where heat did not matter to one where it did.

### The correction

The workshop looked first at where the heat came from, then at how to remove it.

1. **Shorten the dwell.** A trial on 20 housings showed that a 0.5 s dwell seated the bushes as well as 2 s, checked by measuring their position. The dwell timer was reset to 0.5 s.
2. **Recalculate.** The shorter dwell cut the cycle to about 42.0 s and the shaft energy to about 24.6 kJ. The heat into the oil fell to about **0.489 kW** and the overall efficiency rose to about 16.5%. The heat balance tool gave an equilibrium of **60.8 °C** at 35 °C ambient, still just over the limit, with a cooler duty of only about 15 W.
3. **Fit a cooler for the hottest days.** On a 40 °C day the same heat would settle at about 66 °C. A small air-blast cooler on the return line, with a thermostat that runs its fan above 50 °C, was fitted, sized at about 1 kW so that it also covers a pump losing efficiency with age.

The dwell change alone saved about 4.6 kJ per cycle. The cooler handles what is left.

## What the energy costs

The electricity is the smallest of the costs, but it is worth knowing. This is an illustration, at **A$0.30 per kWh excluding GST**, 1,500 running hours a year, and an assumed motor efficiency of 85%.

- Two-pump press, 2 s dwell: 0.671 kW ÷ 0.85 × 1,500 h, about **1,184 kWh**, about **A$355** a year.
- Single fixed pump, same use: about **2,156 kWh**, about **A$647** a year.

The difference, under A$300 a year, would never justify a design change on its own. The real costs of the single pump are a 15 kW motor and its supply, an oil temperature near 94 °C without a cooler large enough to remove more than half a kilowatt, and the seal and oil replacement that follow. Heat, not electricity, is what a hydraulic designer is managing.

## How this applies to a small Australian business

Size the motor from the highest power point in the cycle, and the cooling from an energy budget over the whole cycle at the duty the machine will actually see. Look at the idle and dwell periods first, because they are often where most of the heat comes from and the cheapest to change. Fit a tank thermometer, set a temperature limit, and recalculate whenever the duty changes, such as a new contract, a second shift or a hotter location. Australian summers, in sheds without air conditioning, deserve their own calculation.

## Exercise: a second shift in a hotter shed

The contract is extended and the press moves to a second building that reaches **40 °C** on summer afternoons, with the 0.5 s dwell and the press's other settings unchanged. With an input of **0.585 kW** and an overall efficiency of **16.5%**, what equilibrium temperature does the [heat balance tool](/tools/gearbox-heat-balance/) give without a cooler, and what cooler duty is needed to hold 60 °C?

**Worked answer.** The heat into the oil is 0.585 × (1 − 0.165), about **0.489 kW**. With 19 W/K of surface dissipation, the equilibrium is 40 + 489 ÷ 19, about **65.8 °C**, above the limit. To hold 60 °C, the surface can shed 19 × (60 − 40) = **380 W**, so the cooler must remove about 489 − 380, roughly **110 W**. The 1 kW cooler already fitted covers that comfortably, which is why it was sized for more than the summer of the first contract.
