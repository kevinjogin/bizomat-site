---
book: variable-speed-drives-by-the-numbers
chapterSlug: the-motor-at-low-and-high-speed
order: 6
title: "The motor at low and high speed"
description: "How load torque changes with speed for conveyors, fans and pumps, why a self-cooled motor overheats at low speed under constant torque, and what field weakening gives above rated speed."
draft: false
---

A drive can run a motor at any speed, but the motor does not cope equally well at all of them. At low speed a standard motor's own cooling fan turns slowly and moves little air, so the motor cannot carry its rated torque for long. Above rated speed the drive runs out of voltage and the torque the motor can produce falls. Whether either matters depends on what the load asks for as its speed changes, which differs completely between a conveyor and a fan.

This chapter sets out how load torque varies with speed, sizes DP-4's conveyor drive with the BIZOMAT conveyor tool, explains the motor's cooling limit at low speed and the field-weakening range above rated speed, and ends with a conveyor motor that passed an RMS torque check and still overheated.

## How loads vary with speed

Loads fall into a few families by how their torque changes with speed:

- **Constant torque.** Conveyors, positive-displacement pumps, extruders, mixers and hoists need roughly the same torque at any speed, set by friction, lift and the material's resistance. Power is proportional to speed.
- **Variable torque.** Centrifugal fans and pumps on systems without static head need a torque proportional to the square of speed, so power goes with the cube of speed (Chapter 7). At half speed they need a quarter of full-speed torque.
- **Constant power.** Winders and some machine-tool spindles need torque inversely proportional to speed over part of their range.

The family matters because a motor's limits also depend on speed. A constant-torque load at low speed asks the motor for its full working torque while its cooling is weakest; a variable-torque load at low speed asks for very little.

```figure
type: line
title: Load torque and a self-cooled motor's continuous torque against speed, per unit of rated
x: Speed, % of rated
y: Torque, per unit of rated motor torque
caption: This is an illustration. The motor's continuous torque limit for a standard totally enclosed, fan-cooled motor on a drive, assumed from typical maker curves: 0.55 at 10%, 0.70 at 40%, 0.85 at 60%, 0.95 at 80% and 1.0 at rated speed. A fan's torque, here 0.72 at rated speed, falls with the square of speed; the conveyor's, worked from the conveyor tool's formula with the feeder at 45 t/h, rises at low speed because material piles up on the slower belt: at 20% speed it would exceed rated torque.
series: Self-cooled motor limit | Fan, variable torque | Conveyor C-2
- 20 | 0.62 | 0.03 | 1.42
- 40 | 0.70 | 0.12 | 0.75
- 60 | 0.85 | 0.26 | 0.52
- 80 | 0.95 | 0.46 | 0.41
- 100 | 1.00 | 0.72 | 0.34
```

## Sizing the conveyor

C-2 is an inclined belt conveyor, 40 m between pulley centres, lifting shredded containers 12 m from a receiving hopper to the shredder's infeed. A vibrating feeder under the hopper loads it at up to 45 t/h. At 50 Hz the belt runs at 0.6 m/s. The moving parts, the belt on both runs and the turning idlers, weigh about 40 kg per metre, and the overall friction factor for a short, inclined conveyor with skirt boards was taken as 0.05. The drive pulley is 400 mm in diameter with 200° of wrap and a lagged surface with a friction coefficient of 0.3 when wet.

The [belt conveyor drive sizing tool](/tools/conveyor-drive-sizing/) works out the load per metre from the throughput and speed, the effective belt tension from the friction factor and lift, the power at the pulley and at the motor, and the belt tensions and pulley torque.

```figure
type: compare
title: C-2 at full and reduced belt speed with the feeder at 45 t/h, from the belt conveyor drive sizing tool
cols: Material load | Effective tension | Power at the pulley | Pulley torque | Motor torque | Share of rated
rowhead: Belt speed
- * 0.60 m/s, 50 Hz | 20.8 kg/m | 3,645 N | 2.19 kW | 729 N·m | 16.9 N·m | 34%
- 0.24 m/s, 20 Hz | 52.1 kg/m | 7,935 N | 1.90 kW | 1,587 N·m | 36.9 N·m | 75%
caption: This is an illustration. L = 40 m, lift 12 m, moving mass 40 kg/m, f = 0.05, drive efficiency 85%, motor margin 15%. Motor torque = pulley torque ÷ (gear ratio 50.6 × 0.85); rated torque of the 7.5 kW, 1,450 rpm motor 49.4 N·m. The tool's motor power with margin is 2.96 kW at full speed and 2.58 kW at 20 Hz.
```

At full speed, the conveyor needs only about a third of the motor's rated torque. The 7.5 kW geared motor was chosen for starting a fully loaded belt after a stop and for clearing jams, not for steady running.

At reduced speed the picture changes. C-2's speed is controlled by the shredder: when the shredder's current rises on a heavy load, the controller slows the belt to feed it less. But the vibrating feeder keeps loading the belt at its own rate, so at 0.24 m/s each metre of belt carries 52.1 kg instead of 20.8 kg. The effective tension more than doubles, and the motor torque rises to 75% of rated. The power at the pulley actually falls slightly, from 2.19 kW to 1.90 kW, because the speed falls faster than the tension rises. The tool's motor power with margin, 2.58 kW, is correct as a power, and it is exactly the wrong number to judge the motor by at low speed. Its guide notes that it uses a single overall friction factor and that starting tensions are higher still.

## Cooling at low speed

A standard totally enclosed, fan-cooled induction motor carries its own cooling fan on its shaft. At rated speed the fan moves enough air over the finned frame to remove the motor's losses at rated torque. At half speed it moves about half the air, and its cooling falls by more than half. The motor's losses at a given torque, on the other hand, barely change with speed, because they are dominated by the current in the windings, which depends on torque. So at low speed and full torque the motor heats up.

Motor makers publish the continuous torque a self-cooled motor can carry on a drive at each speed. Typical figures are about 95% of rated torque at 80% speed, 85% at 60%, 70% at 40% and lower still below that. The motor's thermal time constant, perhaps 30 to 60 minutes for a motor of this size, means a short spell at low speed and high torque is harmless; hours of it are not.

The remedies are well known:

- **Forced ventilation.** A separately powered fan on the motor's non-drive end, replacing the shaft fan, gives full cooling at any speed. It is the usual answer for constant-torque loads that run slowly for long periods.
- **A larger motor**, whose torque limit at low speed covers the load.
- **A different gear ratio**, so that the motor runs faster for the same belt speed, which lowers the torque it must provide and raises its cooling.
- **Changing the process**, for example slowing the feeder with the belt, so that the belt loading does not rise.

## Above rated speed: field weakening

A drive can run a motor above 50 Hz, but it cannot raise the voltage above what its DC link provides. Above rated frequency, the voltage stays at its maximum while the frequency rises, so V ÷ f and the flux fall. The torque the motor can produce falls roughly in proportion: at 60 Hz, about 50 ÷ 60 = 83% of rated torque, so the power stays roughly constant at rated power. The motor's peak torque falls even faster, roughly with the square of the ratio, which limits how far above rated speed field weakening can go.

For C-2, running at 60 Hz to clear a backlog would give a belt speed of 0.72 m/s with up to 49.4 × 50 ÷ 60 = 41.2 N·m available, far more than the 16.9 N·m the belt needs at normal loading. The mechanical limits matter more: bearing speeds, the gearbox's rating, the belt's and the shredder's own limits. For fans and pumps, running above rated speed raises torque with the square of speed while the motor's capability falls, so a few per cent above rated is usually the most that is possible without a larger motor.

## Starting a loaded belt

The heaviest demand on C-2's motor is not running but starting with a loaded belt. After an emergency stop with the belt slowed, it can carry about 52 kg of material on every metre, and the friction of a belt at rest, with material bedded into it, is higher than when it is moving. Allowing 30% extra for breakaway on the effective tension at 20 Hz loading, the tension at start is about 7,935 × 1.3 = 10,316 N, and the motor must deliver about 48.0 N·m, 97% of its rated torque, before it accelerates the belt and its load at all.

A direct-on-line start would give the motor its full locked-rotor torque, usually two to three times rated, together with a current six to seven times rated and a jolt to the belt and gearbox. A drive in simple V/f mode can give rated torque from low speed, and one using sensorless vector control, which models the motor to hold its flux and torque accurately, can give 150% of rated torque, about 74 N·m, for a minute from almost zero speed, enough to break the belt away and accelerate it gently. The drive's current limit, not the motor's starting characteristics, sets the torque, so the belt and gearbox see a controlled force. C-2's drive is set to vector control with a 10-second acceleration ramp and a current limit at 150% for starts.

## Gearboxes and bearings at unusual speeds

The motor is not the only part with speed limits. C-2's helical gearbox is splash-lubricated: its lower gears dip in the oil and throw it over the others. At very low speeds the gears may not throw enough oil to lubricate the upper bearings and gear meshes, and gearbox makers give a minimum input speed, or a different lubrication arrangement, for long running at low speed. At high speed, splash losses and oil temperature rise. Motor bearings have grease life ratings that shorten at high speed and high temperature. Any plan to run a machine well away from its rated speed for long periods should check the gearbox and bearings with their makers, not only the motor.

## Other motors on drives

A drive does not have to feed an induction motor. Permanent-magnet synchronous motors, which carry magnets on the rotor, and synchronous reluctance motors, which use a shaped rotor without a cage, have no rotor current to produce and so lower losses, and some are rated for full torque down to low speed with less heating. Both need a drive to run at all, and their drives must be set up for them. Their efficiency advantage is largest at part load and low speed, which is exactly where many drives spend their time. The Library’s [Permanent Magnets in Machines by the Numbers](/reados/publications/permanent-magnets-in-machines-by-the-numbers/) explains how the magnets' temperature affects such motors.

## The error: an RMS check that missed the cooling

In the first autumn after the drive was fitted, C-2's motor tripped twice on its thermistor protection, both times late on shifts processing heavy, wet material, when the conveyor had run near 20 Hz for most of the afternoon.

When the drive was specified, the engineer had checked the motor with the [RMS torque tool](/tools/rms-torque/), modelling a ten-minute cycle as six minutes at full speed at 16.9 N·m and four minutes slowed at 36.9 N·m. The tool gave an RMS torque of 26.8 N·m, 54.2% of the motor's continuous rating, and reported MOTOR ADEQUATE. Both inputs and the result were correct. But the tool, as its guide says, works on torque only: speed and the motor's thermal time constant also matter. The real duty was not a ten-minute cycle at all. On heavy days the belt ran at about 20 Hz for hours, with the motor carrying 75% of its rated torque at 40% speed, where its continuous limit is only about 70%. The motor was overloaded thermally for long enough to reach its trip temperature.

```figure
type: decision
title: Options for C-2's motor at low speed
caption: This is an illustration. The plant adopted the first and the third.
- * Fit a forced-ventilation fan kit to the motor | Full cooling at any speed; a few hundred dollars and a small fan supply from the panel | Adopted
- Replace with an 11 kW motor and gearbox | Torque limit covers 20 Hz, but a larger frame and new base | Not adopted
- * Slow the vibrating feeder with the belt | Belt loading stays near 21 kg/m, so torque stays near a third of rated at any speed | Adopted in the controller
- Accept trips on heavy days | Lost production and repeated thermal stress on the windings | Not acceptable
```

Slowing the feeder with the belt removed the cause, because the belt no longer piled up; the forced-ventilation fan removed the risk if the feeder control was ever bypassed. The RMS torque check still has its place, for fast repeating cycles such as an index table or a pusher, where the cycle is short compared with the motor's thermal time constant. For long periods at one speed, the check is against the motor maker's torque limit at that speed.

## Exercise: the extraction fan above rated speed

On the hottest days, operators ask whether F-1 could run at 55 Hz to pull more air through the granulator hoods. At 50 Hz the fan needs 21.6 kW, 72% of the motor's 30 kW rating, at 1,482 rpm.

1. By the fan laws, what power would the fan need at 55 Hz, about 10% faster?
2. What torque does that correspond to, and what torque can the motor provide at 55 Hz in field weakening?
3. Is it acceptable, and what else must be checked?

### Worked answer

1. P = 21.6 × 1.1³ = 28.75 kW.
2. At 1,482 × 1.1 = 1,630 rpm, torque = 9,549.3 × 28.75 ÷ 1,630 = 168.4 N·m. Rated torque is 194.2 N·m; at 55 Hz in field weakening, about 194.2 × 50 ÷ 55 = 176.5 N·m is available continuously.
3. The motor could just carry it, at 95% of its reduced capability and 96% of its rated power, with little margin for a hotter day or a dirtier filter. Before allowing it, the plant would need to check the fan's maximum safe speed with its maker, the belt drive and bearings at the higher speed, the duct's pressure rating, and the drive's current at 55 Hz. A better answer to more airflow is usually to reduce the system's resistance, for instance by cleaning the duct and filters, which the BIZOMAT fan drive sizing tool in Chapter 7 shows can be worth as much as the speed increase.
