---
book: industrial-hydraulics-by-the-numbers
chapterSlug: choose-the-pumps-and-control-the-speed
order: 4
title: "Choose the pumps and control the speed"
description: "Match pumps to a press that needs high flow at low pressure and low flow at high pressure, size a two-pump unit and motor, choose a valve centre, and control speed without pressure intensification."
draft: false
---

A press asks its pump for two incompatible things. During the approach it wants a lot of oil at almost no pressure; while pressing it wants very little oil at nearly full pressure. A single fixed pump can supply both only by being large and wasting most of its power as heat for part of every cycle. This chapter compares three pump arrangements for the press, sizes the one chosen, picks the directional valve's centre condition, and then deals with the most common speed-control request a press attracts: "can it press more slowly?"

The failure case is the answer to that request that nearly everyone tries first, a needle valve on the rod-side line. On this press it would have pushed the rod-end pressure above its rating, and in other circumstances the same effect has killed people.

## The duty, again

Chapter 1 set the speeds and Chapter 2 the cylinder. Together they give the flows and pressures the pumps must meet.

```figure
type: compare
title: What each part of the cycle asks of the pumps
cols: Flow | Pressure | Time per cycle
caption: This is an illustration. Approach and return pressures are estimates for an unloaded platen with a counterbalance valve. Pressing pressure rises from low to about 163 bar as the bush goes in; dwell is at the 175 bar relief setting.
- Approach, 270 mm | 40 L/min | about 8 bar | 4.97 s
- Press, 30 mm | 8 L/min | rising to about 163 bar | 2.76 s
- Dwell | almost none | 175 bar | 2 s
- Return, 300 mm | 40 L/min | about 15 bar | 3.79 s
- *Load and unload | none | none needed | about 30 s
```

No part of the cycle needs high flow and high pressure together. That is the property every efficient press circuit exploits.

## Three pump arrangements

```figure
type: compare
title: Three ways to supply the press
cols: One fixed pump | Two fixed pumps, high–low | Pressure-compensated variable pump
caption: This is an illustration. Shaft power uses the illustrative 92% volumetric and 90% mechanical efficiencies from Chapter 1. Prices are not compared, because they depend heavily on the supplier and the pump type.
- Pump | 40 L/min fixed | 32 L/min low-pressure pump plus 8 L/min high-pressure pump | up to 40 L/min, flow falls as pressure reaches the compensator setting
- Pressing speed | 54 mm/s, too fast to watch | about 11 mm/s | adjustable by the compensator and controls
- Largest shaft power | about 14.1 kW, 40 L/min at 175 bar | about 3.2 kW, 40 L/min at 40 bar | similar to the two-pump unit if set up well
- Heat while pressing and dwelling | about 10.6 kW over the relief valve | about 2.5 kW at the dwell, less while pressing | small; the pump delivers only what is used
- Motor | 15 kW class | 4 kW | 4 kW class
- Complexity | lowest | an unloading valve and a check valve | a more complex, more contamination-sensitive pump
```

The single pump is simple but hopeless for this duty. While pressing, the cylinder accepts only a few litres a minute, so the rest of the 40 L/min goes over the relief valve at 175 bar. That is 36 L/min × 175 bar ÷ 600, about **10.6 kW**, turned directly into heat in the oil, for every second of pressing and dwelling. It also presses at 54 mm/s, covering the 30 mm pressing stroke in about half a second, which is too fast for an operator to stop a misaligned bush.

The variable pump is the most efficient and the most flexible, and on a larger or busier press it would probably be the right choice. For a small workshop press its higher cost, its sensitivity to dirty oil and the specialist knowledge needed to adjust its compensator tipped the decision.

The two-pump unit, often called a high–low or hi-lo circuit, keeps almost all the benefit with simple, robust gear pumps.

## How the two-pump unit works

Both pumps are driven by one motor through a common shaft. The large pump feeds the system through a check valve. The small pump feeds it directly. An unloading valve, piloted from system pressure, watches the pressure and, when it rises past its setting, opens the large pump's outlet to the tank. The check valve then closes, so the small pump's oil cannot escape back through the large pump.

```figure
type: steps
title: What happens to the pumps during one press stroke
caption: This is an illustration. Settings are the press's design values: unloading valve 40 bar, relief valve 175 bar.
- Approach | pressure about 8 bar, below the unloading setting; both pumps deliver 40 L/min, platen moves at 54.3 mm/s
- Contact | platen meets the bush, pressure rises as the bush resists
- Unload | at 40 bar the unloading valve opens; the large pump circulates to tank at a few bar; the check valve closes
- Press | the small pump alone delivers 8 L/min, platen moves at 10.86 mm/s, pressure rises with the load
- * Dwell | pressure reaches 175 bar; the relief valve passes the small pump's 8 L/min to tank
- Return | valve reverses; pressure is low again, both pumps deliver to the rod end
```

The unloading setting must sit above the highest pressure the approach and return need, or the press would drop to its slow speed before reaching the work. It must also sit well below the relief setting. At 40 bar, it is about five times the estimated approach pressure and well clear of the relief.

### Sizing the pumps and motor

Pump size is quoted as displacement, the volume swept per revolution. The motor is a four-pole electric motor running at about 1,450 rpm on the 50 Hz supply. With a volumetric efficiency of 92%:

- large pump: 32,000 cm³/min ÷ (1,450 × 0.92) = **24.0 cm³/rev**
- small pump: 8,000 cm³/min ÷ (1,450 × 0.92) = **6.0 cm³/rev**

The motor must cover the highest power point in the cycle. There are two candidates.

- Just before unloading: both pumps deliver 40 L/min at 40 bar, which is 40 × 40 ÷ 600 = **2.67 kW** hydraulic.
- At the dwell: the small pump at 175 bar is 2.33 kW, and the unloaded large pump circulating at about 4 bar adds about 0.21 kW, totalling **2.55 kW**.

The first is slightly higher. Divided by the overall efficiency of 0.828, it needs about **3.22 kW** at the pump shaft. The next standard motor size above that is **4 kW**, which leaves a sensible margin for a pump that will lose some efficiency as it wears. Chapter 6 confirms this with a power unit sizing tool and adds the reservoir.

### Two settings that protect the motor

The two-pump unit depends on two valve settings being right, and both can drift or be changed. Each has a signature that is worth knowing before it happens.

**The unloading valve set too high.** The motor was sized on the assumption that the large pump stops delivering at 40 bar. If someone winds the unloading valve up to, say, 80 bar, perhaps to make the press reach the work faster under a heavier platen, both pumps deliver 40 L/min until 80 bar. That is 40 × 80 ÷ 600, about **5.33 kW** hydraulic and about **6.4 kW** at the shaft, well beyond a 4 kW motor. The motor's overload protection should trip, and if it does not, the motor overheats. The setting is locked and recorded for this reason.

**The unloading valve set too low.** If the setting falls below the approach pressure, the large pump unloads before the platen reaches the work, and the press approaches at the small pump's 10.86 mm/s instead of 54.3 mm/s. The approach takes 25 s instead of 5 s. Chapter 9 uses a milder version of this, where the valve opens partly during the approach, as a diagnosis exercise.

**A leaking check valve.** While pressing, the check valve between the pumps holds the small pump's high-pressure oil away from the unloaded large pump. If the check valve leaks, part of the small pump's flow escapes backwards and the pressing stroke slows, while the approach stays normal because both pumps are then delivering forwards. A slow pressing stroke with a normal approach points to the check valve or the small pump; a slow approach with normal pressing points to the large pump or the unloading valve. That simple split saves a great deal of guesswork.

## The directional valve and its centre

A four-way directional valve sends pump flow to the cap end to extend, or to the rod end to retract. What it does in its middle position, with neither solenoid energised, is a design choice with consequences for heat and safety.

```figure
type: decision
title: Choosing the directional valve's centre condition for the press
question: What should happen when the operator lets go of the controls?
caption: This is an illustration. The tandem centre was chosen. A counterbalance valve on the rod side, described in Chapter 7, holds the platen's weight; the valve centre alone is not relied on to hold a load.
- All ports blocked (closed centre) | cylinder held | pumps deadhead against the relief valve, about 2.5 kW of heat for the whole idle time
- Pump to tank, cylinder ports blocked (tandem) | cylinder held by the blocked ports | pumps unload to tank at a few bar while idle
- *Tandem centre, chosen | platen held, pumps unloaded | heat while idle about 0.27 kW hydraulic, at about 4 bar
- All ports to tank (open centre) | cylinder free to drift | pumps unloaded, but the platen can creep down
```

For a press that sits idle for two-thirds of every cycle, the tandem centre is the right choice. With a closed centre, both pumps would push over the relief valve for the whole 30 s loading time. With the tandem centre, they circulate to tank at a few bar.

## Controlling the speed

The pressing speed of about 11 mm/s is set by the small pump's flow. Within a month of commissioning, the operator asked for slower pressing on thin-walled bronze bushes, which can collapse if pushed in too quickly. The target was about **5 mm/s**, which needs 12,271.8 mm² × 5 mm/s, about **3.68 L/min**.

There are three standard ways to slow a cylinder.

- **Meter-in.** A flow control valve in the line feeding the cylinder limits the flow going in. The excess pump flow goes over the relief valve. It works well when the load always resists motion, which a pressing load does.
- **Meter-out.** A flow control in the line leaving the cylinder restricts the oil coming out. It holds a steady speed against loads that try to pull the cylinder along, and Chapter 7 uses the same idea, in the form of a counterbalance valve, to hold the platen's weight.
- **Less flow.** A smaller pump, or a variable-speed drive on the motor, delivers less oil in the first place, with no throttling and almost no heat.

Each throttling method turns pressure drop times flow into heat. Meter-out has a second consequence that is easy to miss.

## A failure case: slowing the press with a needle valve

This is an illustration. Before the speed question reached the designer, a technician solved it on the spot. He fitted a needle valve in the rod-side line between the cylinder and the directional valve and closed it until the pressing stroke slowed to about 5 mm/s. It worked, and the bushes went in gently.

What the technician had built was meter-out control on a cylinder pushing a resisting load from its full bore. During pressing, the cap end sits at up to the relief setting while the rod end is throttled. The piston is a balance: pressure on the full bore pushes down, pressure on the annulus pushes up. If the oil cannot leave the rod end freely, its pressure rises until the forces balance, and because the annulus is smaller than the full bore, the rod-end pressure must be higher than the cap pressure.

The [Cylinder Meter-Out Speed Control tool](/tools/cylinder-speed-control/) calculates exactly this balance. It takes the bore, rod diameter, supply or relief pressure, the load (positive if it resists, negative if it pulls the cylinder along), the speed wanted, the pump flow, the orifice's discharge coefficient, the oil density and the rod-side pressure rating. It returns the cap-side and annulus areas and flows, the rod-side pressure from the force balance including intensification, the orifice diameter that passes the rod-side flow, the heat in the orifice and over the relief valve, and the rod-side pressure against its rating.

```figure
type: formula
title: Rod-end pressure when the press stroke is metered out at the relief setting
formula: rod-end pressure = (cap pressure × full-bore area − load) ÷ annulus area
caption: This is an illustration. Tool inputs: 125 mm bore, 70 mm rod, 175 bar, load −1.77 kN (the platen's weight helps the stroke before contact), 5 mm/s, 8 L/min pump, rating 250 bar. Once the platen meets the bush, the resisting load lowers the figure, but a part that is not yet touching, or one that suddenly gives way, leaves the full intensified pressure.
- Full-bore area | 12,272 mm²
- Annulus area | 8,423 mm²
- Cap pressure | 175 bar, 17.5 MPa
step: rod-end pressure = (17.5 × 12,272 + 1,770) ÷ 8,423 = 25.7 MPa, about 257 bar
step: against a 250 bar rod-side rating: fails by about 7 bar
step: heat: 1,083 W in the needle valve plus 1,260 W over the relief, about 2.3 kW
```

The tool reports **CONTROL NOT ADEQUATE**: a rod-side pressure of **257.1 bar** against a 250 bar rating, an orifice of about 0.6 mm, and about **2.3 kW** of heat. The rod-end gland seals, the rod-side line and its fittings were all rated for 250 bar or less. Chapter 3's barrel check at 257 bar passed, but only just.

### Why this matters beyond one press

Intensification is not a theoretical curiosity. The NSW Resources Regulator's list of fatal incidents involving fluid power systems includes a case in which a jet of hydraulic fluid escaping from a cylinder fatally injured an engineer, and records that the oil injection was caused by intensification. The pressure on the rod side of a cylinder can be far above anything shown on the system's main gauge, and a fitting or seal that fails there releases a jet at that pressure.

### Detection and correction

The detection came at the press's three-month service, when a technician noticed oil weeping from the rod-end gland and fitted a gauge to the rod-side test point. During a press stroke it read over 250 bar while the main gauge read 175. The needle valve was found and removed the same day.

The correction had three parts.

1. **Remove the cause.** The needle valve came out. Speed control for delicate bushes now uses a pressure-compensated **meter-in** flow control in the line to the cap end, switched into circuit by a selector on the control panel. With meter-in, the rod end is never throttled, so intensification cannot occur.
2. **Add a backstop.** A small relief valve on the rod side, set below the rod-side components' rating, now protects the rod end against trapped pressure from any cause, including a counterbalance valve set wrongly.
3. **Make it visible.** A permanent gauge port on the rod-side line is labelled, and the commissioning record in Chapter 9 includes a rod-side pressure reading during a press stroke.

The meter-in solution is not free. Slowing the stroke to 5 mm/s from an 8 L/min pump still sends the surplus over the relief valve. The exercise works out how much, and what a smaller pump would save.

## How this applies to a small Australian business

Look at the duty before choosing a pump: if high flow and high pressure are never needed together, two pumps or a variable pump will save a large motor and a great deal of heat. Choose the valve centre for what the machine does most of the time, which for a press is waiting. Never slow a cylinder by throttling its rod end while its cap end can see full pressure, and fit a gauge port on the rod side so the pressure there can be measured. Treat any speed change made on the shop floor as a design change that needs checking.

## Exercise: the price of slowing down

With the pressure-compensated meter-in valve set for **5 mm/s**, the small pump still delivers **8 L/min** and the relief is at **175 bar**. Assume an average cylinder pressure of **110 bar** while pressing. How much heat is generated in the flow control and over the relief valve while pressing? What pressing speed would a small pump of **4.5 L/min** give with no flow control at all?

**Worked answer.** The cylinder takes 3.68 L/min at 5 mm/s. The flow control drops the pressure from 175 bar to about 110 bar on that flow: (175 − 110) × 3.68 ÷ 600 = **0.40 kW**. The surplus, 8 − 3.68 = 4.32 L/min, goes over the relief at 175 bar: 175 × 4.32 ÷ 600 = **1.26 kW**. The total is about **1.66 kW** while pressing slowly. A 4.5 L/min pump would press at 4,500,000 ÷ 60 ÷ 12,271.8, about **6.1 mm/s**, with no throttling and almost no added heat. If 6 mm/s is gentle enough for the bushes, a smaller pump is the better fix; if not, a variable-speed drive on the motor is worth pricing.
