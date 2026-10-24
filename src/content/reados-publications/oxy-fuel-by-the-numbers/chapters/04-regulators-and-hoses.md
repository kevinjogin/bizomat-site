---
book: oxy-fuel-by-the-numbers
chapterSlug: regulators-hoses-and-torch-pressure
order: 4
title: "Regulators, hoses and the pressure at the torch"
description: "Understand regulator droop and supply-pressure effects, estimate pressure lost in hoses and fittings, and check the pressure that actually reaches the torch."
draft: false
---

A nozzle chart gives a pressure for each thickness. It rarely says where that pressure is to be measured, and the difference matters. Between the cylinder and the nozzle the gas passes through a regulator, a hose, couplings, a flashback arrestor at each end and the torch's own valves and passages, and every one of them takes some pressure. At low flows the losses are small. At the flows a cutting jet needs, they can be large enough to starve the cut.

The 1921 investigators could not accept any uncertainty about the pressure their torches received, because every result depended on it. How they solved the problem, and what they found when they measured the pressure lost between their gauge board and the torch, is the starting point for this chapter.

## What a regulator does

A regulator reduces the high, falling pressure in a cylinder to a lower, steadier working pressure. In the common single-stage design, a spring pushes on a diaphragm, which opens a valve; gas flowing through the valve builds pressure under the diaphragm, which closes the valve again. The outlet pressure settles where the spring force and the gas force balance. Turning the adjusting screw changes the spring force and so the outlet pressure.

That balance is not perfect, and three departures from it matter in practice.

- **Droop.** As the flow increases, the valve must open further, the spring extends and its force falls, so the outlet pressure drops. A regulator set to 400 kPa with no flow might deliver 370 kPa at full cutting flow, a droop of 7.5%. Setting the pressure while the gas is flowing avoids being misled.
- **Supply-pressure effect.** In a single-stage regulator, the cylinder pressure itself acts on the valve, so the outlet pressure shifts as the cylinder empties, and the operator must readjust during a long job.
- **Creep.** When flow stops, the valve should seal and the outlet pressure should hold. If the seat is worn or dirty, gas leaks past it and the outlet pressure creeps upwards towards cylinder pressure. Creep is a fault: it shows the regulator can no longer be relied on and must be withdrawn and serviced.

A **two-stage** regulator puts two such stages in series. The first reduces cylinder pressure to an intermediate value; the second, fed from an almost constant inlet, holds the outlet much steadier as the cylinder empties. That is why two-stage regulators are preferred where a steady pressure matters, as it does for a long machine cut.

## The 1921 gauge board

The investigators tried the standard regulators supplied with the equipment of the day and found none good enough. Their action was, in the report's words, intermittent and spasmodic: the outlet pressure jumped rather than flowing smoothly. The cure took four steps, each of which a modern system reproduces in some form.

1. **Two regulators in series.** One at the outlet of the cylinder manifold reduced the bank pressure to about 50% more than the torch needed; the second, on the gauge board, reduced it to the working value. For a torch needing 400 kPa, the first stage would deliver about 600 kPa.
2. **Selection.** The regulators used were the best performers from a large stock, chosen by trial, and kept for the whole series.
3. **Vibration.** Electric "rappers" tapped the body of the gauge-board regulator constantly, to keep the valve seat floating rather than sticking and jumping. Their contacts were shorted out at the board, so no spark could occur near a possible gas leak.
4. **A needle valve.** A small hand-set valve between the second regulator and the flow meter let an operator trim the pressure as needed. Once a torch had run for a few minutes, it seldom needed touching.

With that arrangement the delivered pressure was held, under most conditions, within 0.01 to 0.02 lb/in², about 0.07 to 0.14 kPa. An autographic recorder drew the pressure throughout each test as evidence. No workshop needs that precision, but the design principle carries over directly: a first stage to absorb the falling supply, a second stage to set the working pressure, and a way of seeing that pressure while the gas flows.

```figure
type: steps
title: The 1921 pressure-control chain
caption: Each element removed one source of pressure variation before the gas reached the torch.
- Manifold regulator | bank pressure to about 1.5 times working
- Gauge-board regulator | to working pressure; vibrated by rappers
- Needle valve | fine trim by an operator
- Flow meter and manometers | flow and static pressure read continuously
- Hose and flashback tank | standard length; pressure loss measured
- *Torch | handle valve fully open on at least one gas
```

## Line pressure and torch pressure

The hoses on the 1921 rig were longer than usual, 28 feet for oxygen and 30 feet for acetylene, and they ran through flashback tanks. The investigators therefore measured, with mercury manometers, the pressure lost between the gauge board and the torch handle for each combination of hose, fittings and flow. Every result in the report quotes two figures: the **mean line pressure**, held at the gauge board, and the **mean torch pressure**, the same value corrected for the measured loss. The torch pressure was what the torch actually received.

That distinction is still the right one. A nozzle chart may state pressures at the regulator for a stated hose length and bore, or at the torch. Which it means, and for what hose, should be read from the maker's data, not assumed. When the hose, the arrestors or the flow differ from the chart's assumptions, the pressure at the torch will differ too.

## How much pressure a hose takes

For the turbulent flow found in cutting oxygen hoses, the pressure lost in a length of hose rises roughly in proportion to the length, with the square of the flow, and very steeply as the bore gets smaller, roughly with the inverse fifth power of the diameter for a given flow. These proportions come from standard pipe-flow relationships. They are good enough to compare options as long as the loss is a small fraction of the absolute pressure; when it is not, the gas expands along the hose and the simple model underestimates the loss.

```figure
type: formula
title: Scaling a measured hose pressure loss
formula: Δp₂ ≈ Δp₁ × (L₂ ÷ L₁) × (Q₂ ÷ Q₁)² × (d₁ ÷ d₂)⁵
caption: This is an illustration. Measure one loss on your own hose, then scale it to compare options. Valid only while the loss is small compared with the absolute pressure.
- Δp₁ | loss measured at length L₁, flow Q₁, bore d₁
- L | hose length, m
- Q | flow, m³/h
- d | hose bore, mm
step: Δp₂ ≈ 35 × (15 ÷ 10) × (6.35 ÷ 5.15)² × 1
step: Δp₂ ≈ 35 × 1.5 × 1.520
step: Δp₂ ≈ 79.8 kPa
```

This is an illustration. In the base-plate workshop, a test gauge fitted temporarily at the torch inlet showed that 10 m of the workshop's 10 mm oxygen hose, with its arrestors and couplings, lost about **35 kPa** at setting B's total oxygen flow of 5.15 m³/h. Scaling that one measurement gives the losses for other arrangements.

```figure
type: bars
title: Oxygen pressure lost between regulator and torch
unit: kPa
max: 340
caption: This is an illustration, scaled from one measured loss of 35 kPa on 10 m of 10 mm hose at 5.15 m³/h. The two largest values are beyond the range in which the simple model is accurate.
- *10 m, 10 mm, setting B | 35
- 10 m, 10 mm, setting C flow | 53.2
- 20 m, 10 mm, setting B | 70
- 30 m, 10 mm, setting B | 105
- 30 m, 8 mm, setting B | 320
```

Three lessons follow. Doubling the hose length doubles the loss. Raising the flow from setting B to setting C, about 23% more oxygen, raises the loss by about 52%, because the loss goes with the square of the flow. And a modest reduction in bore, from 10 mm to 8 mm, multiplies the loss about three times. A long, narrow hose can take so much of the pressure that no regulator setting within the equipment's rating will restore it.

## Why lost pressure means lost oxygen

A cutting nozzle's oxygen bore behaves like an orifice. Above a certain upstream pressure the flow through it becomes **choked**: the gas reaches the speed of sound in the narrowest section, and the flow then rises in proportion to the absolute pressure upstream rather than with the square root of a pressure difference. For oxygen and other gases made of two-atom molecules, the flow is choked when the absolute pressure downstream is less than about 0.528 of the absolute pressure upstream. With the nozzle discharging to the atmosphere, that means an upstream pressure above about 192 kPa absolute, or roughly 90 kPa gauge. Cutting oxygen pressures are well above that, so the cutting flow is, to a good approximation, proportional to the absolute pressure at the nozzle.

That gives a direct way to see what a pressure loss costs. If the torch receives 400 kPa gauge, the absolute pressure is about 501.3 kPa. If losses cut the torch pressure to 260 kPa gauge, about 361.3 kPa absolute, the cutting oxygen flow falls in the ratio 361.3 ÷ 501.3 ≈ 0.72. Setting B's 4.6 m³/h of cutting oxygen would drop to about 3.32 m³/h, some 28% less. The jet then carries less oxygen into the bottom of the cut, which is exactly where the failure described below showed itself. In reality the two effects interact: less flow means less loss in the hose, so the system settles somewhere between the two figures, and a test gauge at the torch is the simplest way to find where.

The acetylene side is affected differently. Acetylene runs at much lower pressures, and a preheat nozzle's fuel ports are not choked, so the flow varies roughly with the square root of the pressure difference. But because the working pressure is low, a loss of a few kilopascals is a large fraction of it. At 50 kPa, a 10 kPa loss is 20% of the pressure. A long or narrow acetylene hose, or an undersized arrestor on a heating nozzle, can starve the preheat flame and, worse, make the flame less stable, which is part of the story of Chapter 6.

## Fittings, arrestors and torches

Hoses are not the only losses. Each flashback arrestor, non-return valve, quick coupling and hose connector takes some pressure, and the amount rises with flow. Makers of flashback arrestors publish flow curves showing the pressure loss at each flow for each gas. An arrestor chosen for a welding torch may be too restrictive for a heavy cutting or heating nozzle, and the loss across it then becomes the largest in the line. Chapter 6 explains why arrestors must be fitted; this chapter's point is that they must also be sized for the flow. The torch's own valves and passages take pressure too, which is one reason the 1921 rule of keeping at least one handle valve fully open made consumption reproducible.

## A failure: the long hose

This is an illustration. Partway through the base-plate job, the track machine was moved to the far end of the bay. To reach it, a 10 m extension of 8 mm hose was added to the 10 m of 10 mm hose. The cut immediately lost quality: drag lines became coarse and swept back, slag clung to the bottom edge, and at the bottom of the plate the cut occasionally failed to break through. The operator slowed the machine, which helped, and suspected a poor nozzle.

The supervisor fitted the test gauge at the torch inlet. With the regulator at the usual setting, the torch was receiving about 140 kPa less than the regulator showed, not the usual 35 kPa. The scaling formula agrees: 35 kPa for the original hose plus 35 × 3.05 ≈ 107 kPa for the narrower extension gives about 142 kPa. The torch had been starved of cutting oxygen pressure, and slowing the machine had masked the problem at the cost of the job's time.

The correction was to replace the extension with 10 mm hose, to check that the arrestors' flow curves suited the flow, and to record the torch-end pressure on the settings sheet. A note was added that any change in hose length or bore requires the torch-end pressure to be checked again. Turning up the regulator would have restored some pressure, but it would have hidden the cause and left the arrestors and couplings carrying a higher pressure than the setting implied.

## Checking the pressure at the torch

A torch-end check needs no special equipment beyond a calibrated test gauge and a suitable fitting at the torch inlet, used in accordance with the equipment maker's instructions and AS 4839.

```figure
type: checklist
title: Torch-end pressure check
caption: This is an illustration of the entries kept for the base-plate track machine.
- x Configuration | 10 m of 10 mm hose; arrestors at both ends
- x Flow | setting B, gas flowing, handle valves fully open
- x Regulator reading | recorded while flowing, not at rest
- x Torch-end reading | test gauge at torch inlet
- *x Loss | about 35 kPa; within the expected range
- x Creep test | outlet held with flow stopped
- ? Arrestor flow curve | confirm it covers setting C's flow
```

## Exercise: the cost of a longer hose

The workshop wants to run setting C, with its total oxygen flow of 6.35 m³/h, on 15 m of the same 10 mm hose. Estimate the pressure lost between the regulator and the torch, and the regulator setting needed while flowing to give 400 kPa at the torch.

Scale the measured loss: 35 × (15 ÷ 10) × (6.35 ÷ 5.15)² ≈ 35 × 1.5 × 1.520 ≈ **79.8 kPa**. The regulator must therefore read about 400 + 80 ≈ **480 kPa while flowing**. The loss is about 16% of the torch pressure in gauge terms and a smaller share of the absolute pressure, so the simple scaling is reasonable, but the result should be confirmed with the test gauge before the job. Now suppose nobody adjusts the regulator, which stays at 400 kPa while flowing. The torch would receive roughly 400 − 80 = 320 kPa gauge, about 421.3 kPa absolute. Because the cutting flow is choked, it would fall in the ratio 421.3 ÷ 501.3 ≈ 0.84, from 5.8 m³/h to about **4.87 m³/h** of cutting oxygen, which is closer to setting B's jet than to setting C's. The workshop would then be paying for setting C's trial result while cutting with something else. (The reduced flow would itself reduce the hose loss a little, so the true figure lies slightly above 4.87 m³/h; the test gauge settles it.) Explain why the regulator setting would need to change again if the workshop switched back to setting B on the same hose, and why the settings sheet should state torch-end pressure rather than regulator pressure.
