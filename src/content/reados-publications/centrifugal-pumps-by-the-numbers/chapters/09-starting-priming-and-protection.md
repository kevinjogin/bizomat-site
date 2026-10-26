---
book: centrifugal-pumps-by-the-numbers
chapterSlug: starting-priming-and-protection
order: 9
title: "Starting, priming and protecting a pump"
description: "Priming a pump that lifts, why a pump must not run dry or at shut-off, heat and minimum flow, starting and stopping, the protections that work, and a foot valve that let the prime go."
draft: false
---

Most pump failures do not happen at the design point. They happen at the edges of a pump's life: when it starts without water in it, when it runs against a closed valve, when its suction runs dry, when it stops and the column of water behind it slams back. A pump that runs well for months at its best efficiency point can be wrecked in minutes at one of those edges, and the protection that prevents it is cheap compared with the damage.

This chapter deals with those edges for TP-3. It sets out priming and why a pump that lifts must be primed, the heat that builds when a pump runs without flow and the minimum flow that prevents it, how TP-3 starts and stops, the protections that guard each risk, and ends with a foot valve that let the prime drain away overnight.

## Why a pump must be primed

A centrifugal pump can push water, but it cannot pull air. Its impeller, spinning in air, produces the same head in metres of air that it would in water, and a column of air 34 m high exerts almost no pressure: not nearly enough to draw water up a suction pipe. So a pump that stands above its liquid, like TP-3, must have its casing and suction pipe full of water before it starts. That is **priming**.

TP-3's suction pipe, 6 m of 105.3 mm bore, holds about **52 litres**, and its casing a few litres more. A **foot valve** at the bottom of the suction pipe, a check valve with a strainer, holds that water in place when the pump stops, so that the pump stays primed between runs. The foot valve is therefore one of the most important parts of the installation, and one of the least looked at, because it is under water.

## Ways to prime

When a lifting pump loses its prime, it must be refilled before it runs. The common methods are:

- **From the discharge**: a small valved line around the discharge check valve lets water from the full discharge column run back into the casing and suction. TP-3 has one, with its valve normally closed.
- **From a priming tank or the mains**: a separate supply fills the casing through a filling connection, with a vent at the casing's top to let the air out.
- **By vacuum**: a vacuum pump draws the air out of the casing and suction, and the atmosphere pushes the water up. Large lifting installations use it.
- **A self-priming pump**: a pump with a casing that retains water and separates air, so that it can evacuate its own suction pipe after the first fill.

Whichever is used, priming is confirmed before starting, by a steady stream of water at the casing's vent, not assumed.

## Running dry and running shut off

Two conditions are especially harmful, and they are related.

**Running dry** means running with air instead of water in the casing. The mechanical seal's faces, which depend on a thin film of liquid to cool and lubricate them, overheat within seconds to minutes and crack. The wear rings and close clearances may rub and seize.

**Running at shut-off** means running full of water but with no flow, against a closed valve or a check valve that the pump cannot open. All the shaft's power then goes into the trapped water. This is an illustration: TP-3 takes about 2.9 kW at shut-off, and if its casing holds about 6 litres, that water warms by 2.9 × 60 ÷ (6 × 0.998 × 4.18) = about **7 K a minute**, ignoring heat lost through the casing. From 20 °C, it would reach 100 °C in about 11.5 minutes, and the seal would fail well before that, as the water near its faces flashed to steam.

```figure
type: formula
title: How fast trapped water heats at shut-off
formula: rate of rise = P ÷ (m × c)
caption: This is an illustration for TP-3, with an assumed 6 litres of water in the casing and no heat lost to the surroundings.
- P | Shaft power at shut-off, about 2.9 kW
- m | Mass of water in the casing, 6 × 0.998 = 5.99 kg
- c | Specific heat of water, 4.18 kJ/kg·K
step: Rate = 2.9 ÷ (5.99 × 4.18) = 0.116 K/s, about 7 K a minute
step: From 20 °C to 100 °C: 80 K ÷ 7 K a minute ≈ 11.5 minutes
```

## Minimum flow

The cure for heating is flow. Even a small flow carries the heat away: a flow of Q litres per second, warmed by ΔT kelvin, carries away Q × 4.18 × ΔT kW. To hold TP-3's water to a 5 K rise at about 3 kW, it needs only 3.0 ÷ (4.18 × 5) = 0.14 L/s. That is the **thermal minimum flow**.

But a pump's maker usually specifies a higher **minimum continuous flow**, because heat is not the only problem at low flow. Well left of the best efficiency point, recirculation in the impeller's eye and outlet, rising vibration and radial loads, as Chapters 3 and 5 described, shorten the pump's life long before the water boils. This is an illustration: TP-3's maker gives a minimum continuous flow of 3.9 L/s, 30% of its best point's flow. Any operating condition that would take the pump below that must be prevented by the controls or a bypass.

```figure
type: bars
title: TP-3's flows that matter at the low end
unit: L/s
max: 14
caption: This is an illustration. The thermal minimum keeps the water from boiling; the maker's minimum continuous flow keeps the pump from damaging itself; the best point is where it should run.
- Thermal minimum for a 5 K rise | 0.14
- * Maker's minimum continuous flow | 3.9
- Best efficiency point | 13.0
```

## A bypass for minimum flow

Where a system's demand can fall to zero while its pump keeps running, as with a pressure-holding pump feeding valves that close, a **minimum-flow bypass** returns enough flow to the suction source to keep the pump above its minimum. It may be a small fixed orifice line that always flows, or a valve that opens only when the main flow falls. Chapter 7 showed that a bypass used to reduce a steady flow wastes energy; a bypass that flows only when the demand has fallen to almost nothing costs little and protects the pump. TP-3 does not need one, because its level switches stop it when the header tank is full, but the float-valve arrangement Chapter 4 described would.

## Starting TP-3

TP-3 starts against its discharge check valve, which is held shut by the standing column of water in the discharge pipe, 18 m high, a pressure of about 176 kPa. For the first second or so, as the motor accelerates, the pump runs at shut-off until its head exceeds the column's, then the check valve opens and the flow builds to the operating point.

For a radial pump like TP-3, starting against a closed check valve is normal and gentle: a radial pump's power is lowest at shut-off, so the motor starts against its lightest load. For an axial-flow pump, whose power is highest at shut-off, the opposite applies, and it must start with its discharge open.

## Starting into an empty line

After maintenance, TP-3's discharge pipe may be partly or wholly empty, and the pump then starts without the column's back-pressure. Chapter 4 showed that it runs far to the right of its best point while the line fills, at high flow, near its peak power and with its highest NPSH required. For the minute or so TP-3's line takes to fill, that is acceptable. The plant's procedure nonetheless refills the line slowly first, by starting the pump with its discharge isolating valve only partly open and opening it as the gauge rises, so that the column arrives at the top gently rather than with a rush, and the pump stays inside its range throughout.

## Stopping TP-3

When TP-3 stops, the flow in the discharge pipe decelerates, reverses briefly, and the check valve closes. If it closes slowly, after the flow has reversed and gathered speed, it slams, sending a pressure surge up and down the pipe. READOS's [Water Hammer by the Numbers](/reados/publications/water-hammer-by-the-numbers/pump-trip-and-check-valve-slam/) deals with that in detail. TP-3's discharge pipe is short, and its check valve is a type that closes quickly, so its stop is quiet. A long, high discharge would need a slower stop, a soft-stopping drive, or a check valve with a damper.

## Direction of rotation

A three-phase motor runs in either direction, depending on the order in which its supply's phases are connected, and a pump connected the wrong way round turns backwards. A centrifugal pump running backwards still moves some water outward, so it does not obviously fail: it delivers a fraction of its head and flow, makes more noise, and may unscrew an impeller held on by a threaded nut. A pump that seems weak after installation or after electrical work should have its rotation checked before anything else.

The check is simple. Every pump has an arrow on its casing showing its direction of rotation. With the pump primed and the discharge open, the motor is started for a second and stopped, a "bump test", while someone watches the coupling or the motor's fan as it slows. If it turns against the arrow, two of the supply's phases are swapped by an electrician before the pump is run.

## Idle pumps

A standby pump that sits idle for weeks needs attention of its own. Its seal faces can stick, its bearings can corrode where they rest, sediment can settle in its casing, and if it stands outdoors in a cold climate, water left in it can freeze and crack the casing. The weekly swap between TP-3's duty and standby pumps, which Chapter 8 showed the cost of neglecting, is as much a protection as any switch: it proves that the standby pump starts, primes and delivers, and it keeps both pumps' wear even.

A pump that will be idle for a long time is drained, or kept warm, and turned by hand at intervals, following its maker's instructions. When it returns to service, it is primed, its rotation checked and its first run watched as if it were new.

## Protections

Each risk has a protection, and most are inexpensive.

```figure
type: checklist
title: Protections on TP-3
caption: Each item guards one way a pump is damaged at the edges of its operation.
- Foot valve and strainer, inspected quarterly | holds the prime between runs
- Low-level switch in the sump | stops the pump before the suction entrance draws air
- Power monitor on the motor | stops the pump on the low load of dry running or shut-off
- Flow switch on each pump's discharge | stops a pump running more than a minute without flow
- Header tank level switches | start and stop the pump without throttling
- Motor overload protection | trips on overcurrent
- x Pump started after the foot valve let the prime drain | ran dry for twenty minutes
```

The **power monitor** deserves a word. A pump running dry draws much less power than one pumping, because air is so light, and a pump running at shut-off draws less than one at its operating point. A monitor that trips when the motor's power falls below a set fraction of its normal value catches both, with no sensor in the water. On TP-3, normal power is 4.7 kW at the supply; the monitor trips below about 3.2 kW, an illustration chosen above the shut-off draw.

## The error: a foot valve that let the prime go

This is an illustration. TP-3's duty pump started one morning at 6:00 on its low-level switch, and the header tank's level kept falling. An operator found the pump running, its discharge gauge reading close to zero, its suction gauge at zero, and its casing hot to touch near the seal. It had been running dry for about twenty minutes.

The foot valve's flap had been held partly open by a strip of plastic film from the wash bay, and overnight the 52 litres in the suction pipe had drained back to the sump. With no water in the casing, the pump could not draw any up. Its mechanical seal was ruined.

The pump was primed from the discharge column through its priming line and restarted on its standby partner while the seal was replaced. The plant then fitted the power monitor described above, which would have stopped the pump within a minute of starting dry, and added a finer screen around the foot valve's strainer. In the plant's case, the monitor cost less than a replacement seal and the labour to fit it, so it would pay for itself the first time it prevented one failure, and the downtime saved would be a bonus. The foot valve's inspection was also moved from yearly to quarterly, because a flap held open by debris can be seen and cleared in minutes.

## Exercise: how long at shut-off?

TP-3's discharge isolating valve is closed by mistake during maintenance and the pump is started. With 2.9 kW at shut-off and 6 litres of water in the casing, how long until the water has warmed by 40 K? What would a flow switch with a one-minute delay limit the rise to?

**Worked answer.**

- The heat needed is 6 × 0.998 × 4.18 × 40 = 1,001 kJ.
- At 2.9 kW, that takes 1,001 ÷ 2.9 = 345 s, about **5.8 minutes**.
- In one minute, the water warms by about 7 K, so a flow switch with a one-minute delay limits the rise to about **7 K**.

Five or six minutes is long enough for an operator to walk away from a pump that has just been started. A protection that acts within a minute turns a possible seal failure into a non-event, and costs nothing while the pump runs normally.
