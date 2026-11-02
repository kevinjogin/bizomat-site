---
book: permanent-magnets-in-machines-by-the-numbers
chapterSlug: magnetic-couplings-and-sealless-pumps
order: 5
title: "Magnetic couplings and sealless pumps"
description: "Size a magnetic coupling for a sealless pump: shaft power, running and starting torque, temperature derating, eddy losses in the containment shell, and what dead-heading or dry running does."
draft: false
---

A magnetic coupling transmits torque without any shaft passing through the wall between driver and driven. An outer rotor of magnets on the motor shaft turns an inner rotor of magnets on the pump shaft, and between them sits a thin containment shell, sealed to the pump casing, that keeps the pumped liquid in. There is no shaft seal to leak, wear or need flushing, which is why sealless magnetic-drive pumps are used for hazardous, hot, expensive or simply messy liquids.

The coupling brings its own limits. It can transmit only up to its slip torque, after which the rotors slip and the pump stops pumping while the motor runs on. A metal containment shell turns some of the power into heat by eddy currents. And the pump's bearings and magnets depend on the pumped liquid to cool and lubricate them. This chapter sizes Line 4's coupling with the KEVOS® pump system design, torque and flexible coupling tools, estimates its shell losses, and shows what dead-heading does. The error is a valve sequence that dead-headed the pump.

## The duty

The KEVOS® [pump system design tool](/tools/pump-system-design/) calculates a simple pumping system: pipe velocity, Reynolds number and the Darcy friction factor from the Colebrook–White equation, friction and fitting losses, the total head from static lift, pressure difference and losses, the hydraulic, shaft and motor power, and the net positive suction head available from the suction conditions, against the pump's requirement.

This is an illustration. Line 4's clean-in-place supply pump draws 1.5% caustic solution at 75 °C from a vented tank whose level is 1 m above the pump, and delivers 250 L/min through 60 m of 50 mm bore stainless pipe, with fittings totalling a loss coefficient of 12, to spray devices 6 m above the pump that need 2 bar at their inlets. The solution's density is about 990 kg/m³ and its kinematic viscosity about 0.4 mm²/s; its vapour pressure is taken as that of water at 75 °C, 0.386 bar. The pump's efficiency at the duty point is 55%, and it needs 2.5 m of net positive suction head.

```figure
type: stats
title: Line 4's clean-in-place duty, from the pump system design tool
caption: This is an illustration. Suction: 4 m of pipe with a fitting loss coefficient of 3, atmospheric pressure on the tank surface. The tool's motor size includes a 15% margin over the shaft power.
- 2.12 m/s | pipe velocity
- 8.35 m | friction and fitting losses
- 34.95 m | total head, including 6 m of lift and 2 bar of pressure
- 1.41 kW | hydraulic power
- * 2.57 kW | shaft power at 55% efficiency
- 6.4 m | net positive suction head available, against 2.5 m required
```

A 4 kW, two-pole motor running at about 2,900 rpm drives the pump. The KEVOS® [torque, power and speed tool](/tools/torque-power/) converts the shaft power into the steady running torque: 2.57 kW at 2,900 rpm is 8.46 N·m. The motor's rated torque, 4 kW at the same speed, is 13.17 N·m.

## How a coupling transmits torque

At no load, each magnet on the inner rotor sits directly opposite a magnet of opposite polarity on the outer rotor. As load torque is applied, the inner rotor lags the outer by a small angle, and the magnets' attraction, now slightly sideways, transmits torque. The torque rises with the lag angle, roughly as the sine of the angle in electrical degrees, to a maximum when each inner magnet is midway between two outer magnets. Beyond that the torque falls, the rotors slip a pole, and the coupling has decoupled: the inner rotor slows or stops while the outer one turns on, the magnets passing each other with alternating attraction and repulsion.

The maximum is the coupling's slip torque, also called its decoupling or pull-out torque. Makers rate couplings by it, at a stated temperature. This is an illustration. Line 4's coupling has a slip torque of 25 N·m at 20 °C. From Chapter 4, the torque falls to about 88.3% at the magnets' 75 °C running temperature: about 22.1 N·m.

## Sizing against running and peak torque

The KEVOS® [flexible coupling selection tool](/tools/flexible-coupling-selection/) checks a conventional flexible coupling: the running torque from power and speed, the torque with a service factor against the coupling's nominal rating, the starting or peak torque against its maximum rating, speed, misalignment, bore and key. A magnetic coupling has no misalignment allowance or key in the same sense, but the tool's torque checks are a useful first screen.

```figure
type: compare
title: Torque checks for the magnetic coupling
cols: Torque, N·m | Against 25 N·m at 20 °C | Against 22.1 N·m at 75 °C
rowhead: Check
- Running torque, 2.57 kW at 2,900 rpm | 8.5 | 34% | 38%
- With a service factor of 1.5 | 12.7 | 51% | 57%
- * Peak, 2.3 × running, the tool's starting-torque method | 19.5 | 78% | 88%
- Coupling torque during a direct-on-line start, inertia split | 10.9 | 44% | 49%
- Coupling torque near the motor's breakdown torque, inertia split | 17.6 | 70% | 80%
caption: This is an illustration. The first three rows are the flexible coupling selection tool's results with service factor 1.5 and a peak-to-running ratio of 2.3, the motor's locked-rotor torque ratio from its datasheet. The last two rows are worked below. Percentages are torque divided by the coupling's slip torque.
```

The tool's method treats the peak as a multiple of the running torque, which is the right check for a conventional coupling whose peak load is a fault or a start against full load. A magnetic coupling during a start is different, and worth working out, because it shows where the real risk lies.

### What the coupling sees during a start

When the motor starts direct on line, it produces its locked-rotor torque, about 2.3 × 13.17 = 30.3 N·m from its datasheet. That torque accelerates everything on both sides of the coupling. The coupling transmits only the share needed to accelerate the pump side, plus the pump's load torque, which is near zero at low speed because a centrifugal pump's torque rises with the square of speed.

This is an illustration. The motor rotor and outer magnet rotor have a combined inertia of 0.0107 kg·m², and the inner rotor and impeller 0.0060 kg·m². At standstill, the coupling transmits 30.3 × 0.0060 ÷ (0.0107 + 0.0060) = 10.9 N·m. Later in the start, near full speed, the motor passes through its breakdown torque, about 2.8 × 13.17 = 36.9 N·m, while the pump at 90% speed needs about 0.81 × 8.46 = 6.9 N·m. The coupling then transmits 6.9 + (36.9 − 6.9) × 0.0060 ÷ 0.0167 = 17.6 N·m, 80% of its hot slip torque.

The margin is adequate, but it shows why magnetic-drive pump makers often recommend a soft starter or variable-speed drive for larger pumps: limiting the motor's torque during the start limits the coupling's share. The same reasoning explains why the tool's simple method is conservative for this pump: it asks the coupling to carry 2.3 times the running torque, 19.5 N·m, when the inertia split gives at most 17.6 N·m. The tool's figure is a sound first screen; the inertia split is the check to make when the margin is tight.

The other risks are a pump side that is hard to turn, from a seized bearing, solids in the impeller or a blocked strainer, which raise the load torque directly; and a heavy, high-inertia impeller.

## Eddy losses in the containment shell

The containment shell sits in the gap where the magnets' flux crosses between the rotors, and the field it sees sweeps past it at the rotors' surface speed. If the shell conducts electricity, the moving field induces eddy currents in it, which dissipate power as heat. That power comes from the motor and is lost to the pump.

An order-of-magnitude estimate treats the shell as a conductor moving at speed v relative to a field of amplitude B̂:

```figure
type: formula
title: Eddy loss in a metal containment shell, order of magnitude
formula: P ≈ k × σ × v² × (B̂² ÷ 2) × V
formula: v = π × D × n ÷ 60; V = π × D × l × t
caption: σ is the shell's electrical conductivity and V its volume in the field. k, between about 0.3 and 0.7, allows for the paths the eddy currents take at the ends of the field and for the field's shape; 0.5 is used here. Makers' measured losses for a particular design should replace this estimate.
- D, l, t | shell diameter, length in the field and wall thickness
- n | speed, rpm
- B̂ | amplitude of the flux density in the gap, from the load line in Chapter 3
```

This is an illustration. Line 4's shell is 80 mm in diameter, 60 mm long in the field and 1 mm thick, at 2,900 rpm, so v = 12.15 m/s and V = 1.51 × 10⁻⁵ m³; from Chapter 3, B̂ ≈ 0.80 T.

```figure
type: bars
title: Estimated containment-shell eddy loss by shell material
unit: W
max: 500
caption: This is an illustration. Resistivities 7.4 × 10⁻⁷ Ω·m for 316 stainless steel and 1.3 × 10⁻⁶ Ω·m for a nickel-chromium-molybdenum alloy of the C-276 type; non-metallic shells of suitable polymers or ceramics do not conduct. The case's pump uses the nickel alloy for its corrosion resistance in hot caustic.
- 316 stainless steel | 481
- * Nickel-chromium-molybdenum alloy | 274
- Non-metallic shell | 0
```

The loss in the case's shell, about 274 W, is about 11% of the pump's 2.57 kW shaft power, and the tool's 55% efficiency was the maker's figure including it. The heat goes into a small internal flow of pumped liquid that the pump circulates behind the impeller, through the gap between the inner rotor and the shell, to cool the shell and lubricate the bearings. With 4 L/min of that flow, the 274 W raises its temperature by about 274 ÷ (0.066 kg/s × 3,900 J/kg·K) = 1.1 °C. The inner magnets therefore run at about 76 °C, a little above the solution.

## When the flow stops

Everything above depends on liquid flowing through the pump. If the pump runs against a closed valve, dead-headed, it still absorbs power, and with no flow to carry it away, that power heats the liquid in the casing. If it runs dry, there is no liquid to cool the shell or lubricate the bearings at all.

This is an illustration. At shut-off, Line 4's pump absorbs about 1.3 kW, from the maker's curve. With about 2 kg of solution in the casing, the temperature rises by about 1,300 ÷ (2 × 3,900) = 0.17 °C a second, or 10 °C a minute. From 75 °C the solution reaches about 100 °C in two and a half minutes and starts to boil. The vapour stops the internal flow, the product-lubricated bearings run dry, and the magnets, now at the solution's temperature or above, are in the range where Chapter 4 showed a slip would demagnetise them.

Makers of magnetic-drive pumps therefore insist on protection against dry running and dead-heading. Common measures are a power monitor that trips the motor on low power, which detects both dry running and many dead-head conditions; a temperature sensor on the containment shell; and interlocks so that the pump cannot run with its suction or discharge valves closed.

## Monitoring a sealless pump

Because a sealless pump has no seal to drip, its faults are quiet. The plant monitors Line 4's pump with four signals, each tied to one of the failure modes in this chapter:

- **Motor power.** Low power with the motor running means no flow, dry running or a decoupled coupling: the motor turns the outer rotor, but the inner rotor and impeller are slipping or stopped, so the motor draws little power. High power means a blocked impeller or a fault in the motor.
- **Shell or casing temperature.** A rising temperature means the internal flow has stopped or the losses have grown.
- **Discharge pressure.** A pressure well below normal at full speed means the pump is not pumping, whatever the motor is doing.
- **Vibration.** A change shows bearing wear, which in a product-lubricated pump usually follows a period of poor lubrication.

A decoupled coupling is easy to miss without the first signal. The motor runs at full speed and sounds normal, the outer rotor turns, and nothing leaks; only the lack of flow, and the low motor power, show that the pump has stopped working. A coupling left slipping also heats its magnets and shell rapidly, from the eddy currents induced by the rotors passing each other, so it should be stopped within seconds.

## The error: a dead-headed start

This is an illustration. A change to the clean-in-place sequence in the line's controller reordered two steps, so that on one circuit the pump started a few minutes before the discharge valve opened. The pump ran dead-headed for about six minutes before the valve opened, every time that circuit was cleaned.

The line's power monitor had been set only to trip on high power, as motor protection; it did not trip on the low power of a dead-headed pump. Over several weeks, the pump's bearings wore quickly, and on one start the coupling slipped when the valve opened onto a cold, partly vapour-locked pump. The maintenance team found worn bearings, discoloration on the shell, and inner magnets with lower surface fields at their corners than the spare rotor.

The sequence was corrected so that the discharge valve opens before the pump starts; the power monitor was set to trip on low power after a short delay; a shell temperature sensor was added, wired to stop the pump at 90 °C; and the rotor, bearings and shell were replaced. The plant's procedure for controller changes now requires a check of every pump's start conditions against its maker's requirements.

## Exercise: a larger pump

This is an illustration. A second clean-in-place circuit needs 400 L/min through 65 mm bore pipe, with the same lift, pressure, length, fittings, solution and pump efficiency as the first. The pump system design tool gives a total head of 32.7 m and a shaft power of 3.85 kW for that duty.

1. What running torque does the coupling transmit at 2,900 rpm?
2. With a service factor of 1.5, what slip torque does the coupling need at the magnets' running temperature, and what rating at 20 °C if the temperature factor is 0.883?
3. Would a non-metallic shell change the motor needed?

**Worked answer.**

1. T = 3,850 × 60 ÷ (2π × 2,900) = **12.7 N·m**.
2. 1.5 × 12.7 = **19.0 N·m** at running temperature, so 19.0 ÷ 0.883 = **21.5 N·m** at 20 °C. Line 4's 25 N·m coupling would pass this screen; the start must still be checked as in this chapter, with the larger pump's inertias.
3. **Possibly.** If the maker's efficiency includes a metal shell's eddy loss of the order of 10% of the shaft power, a non-metallic shell would save a few hundred watts, which may leave more margin on the motor or allow a smaller one. The maker's data for both shells, at the duty point, settle it.
