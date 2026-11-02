---
book: whirling-shafts-by-the-numbers
chapterSlug: starting-stopping-and-torsion
order: 10
title: "Starting, stopping and torsion"
description: "Getting a heavy rotor up to speed: inertia, run-up time and the energy a direct-on-line start puts into a motor, resonances passed through on the way, and torsional checks of the drive."
draft: false
---

A rotor that runs smoothly at speed still has to get there, and stop again. A heavy rotor stores a great deal of kinetic energy at full speed, and all of it has to come through the motor and the coupling while the rotor accelerates. A direct-on-line induction motor delivers that energy at the cost of an equal amount of heat in its own rotor, and a motor that is asked to start a large inertia too often, or for too long, overheats. On the way up, the rotor also passes through any natural frequency of the drive that lies below its running speed.

This chapter calculates the HM-30's run-up with a KEVOS® tool, shows why its first motor kept tripping on start, compares ways of starting a high-inertia rotor, and checks the drive's torsional natural frequency.

## Inertia and run-up time

A motor accelerating a rotor delivers an accelerating torque, the difference between the motor's torque and the load's torque, and the rotor's speed rises at a rate equal to that torque divided by the total inertia. With average torques over the run-up, the time to reach speed is:

```figure
type: formula
title: Run-up time and energy for a direct-on-line start
formula: Run-up time: t = J × ω ÷ (T_motor − T_load)
formula: Kinetic energy stored at speed: E_k = ½ × J × ω²
formula: Energy dissipated in an induction motor's rotor during a direct-on-line start: about E_k × T_motor ÷ (T_motor − T_load)
caption: J is the total inertia, including the motor's own rotor. The torques are averages over the run-up from the motor's torque–speed curve and the load's. With no load torque, a direct-on-line start heats the motor's rotor by exactly as much energy as it stores in the load.
- J | total inertia, kg·m²
- ω | final speed, rad/s
- T_motor | average motor torque during run-up, N·m
- T_load | average load torque during run-up, N·m
```

The third formula is the one that surprises people. An induction motor starting direct on line runs with a large slip while it accelerates, and the energy lost in that slip, as heat in the motor's rotor bars, equals the kinetic energy delivered to the load when there is no load torque. A rotor that stores 300 kJ at speed costs at least 300 kJ of heat in the motor every start. Motor makers state how long a start, and how many starts per hour, each motor can tolerate, and a high-inertia load can exceed both.

## The HM-30's run-up

The KEVOS® [Rotor run-up time](/tools/rotor-run-up-time/) tool does the calculation for a rotor made of up to two discs and a ring, plus the motor's rotor. From their masses and diameters, the motor's inertia, the final speed and the average motor and load torques during run-up, it gives the inertia of each part and the total, the run-up time, the revolutions to speed, the stored energy, the energy dissipated in the motor's rotor per start and per hour, and compares the start time and the energy per hour with the motor's allowances. Its guide notes that it uses average torques and assumes a direct-on-line induction motor start.

This is an illustration. The HM-30's discs are entered as one 140 kg disc of 520 mm, the hub as a 4 kg disc of 150 mm, and the hammers as a 36 kg ring from 360 to 560 mm. The motor's data sheet for the original 30 kW motor gave a rotor inertia of 0.25 kg·m², an average accelerating torque from its torque–speed curve of about 175 N·m, an allowed direct-on-line start time of 10 s with this kind of load, and a thermal capacity for rotor heating equivalent to about 1,000 kJ per hour. The empty mill's windage and fan load average about 20 N·m during run-up.

```figure
type: steps
title: HM-30 run-up in the rotor run-up time tool, original motor
caption: This is an illustration. The motor data are illustrative values for the case, not a particular motor's ratings.
- Inertia: discs 4.732, hub 0.011, hammer ring 1.994, motor 0.25 kg·m² | total 6.988 kg·m²
- Run-up time | 6.988 × 308.9 ÷ (175 − 20) = 13.9 s, against 10 s allowed
- Revolutions to speed | 342
- Stored energy at 2,950 rpm | 333 kJ
- Energy dissipated in the motor's rotor per start | 333 × 175 ÷ 155 = 377 kJ
- * Energy per hour at 4 starts | 1,506 kJ, against about 1,000 kJ allowed
```

The rotor's inertia without the motor, 6.74 kg·m², is within a few per cent of Chapter 9's 6.6 kg·m²; the ring model of the hammers is slightly more generous than the thin ring used there. Both estimates were later checked against a measured run-up on the test plinth, which matched the tool's 13.9 s to within half a second.

## The error: a motor that tripped on start

This is an illustration. The first production HM-30s were fitted with a standard 30 kW motor and a direct-on-line starter, as the prototype had been. On the test plinth each mill started once and ran for an hour, and nothing went wrong. In service, at a farm that started and stopped its mill between batches, the motor's protection relay tripped on the third start of a busy morning, and twice in the following week. The electrician raised the relay's setting. A month later the motor's rotor failed.

The run-up calculation showed why. Each start took 13.9 s, longer than the 10 s the motor was rated for, and each put 377 kJ of heat into the motor's rotor. Four starts in an hour, 1,506 kJ, was half as much again as the motor could shed. The relay had been doing its job, and raising its setting removed the motor's protection.

```figure
type: compare
title: Ways to start the HM-30
cols: Average accelerating torque, N·m | Run-up time, s | Heat in the motor's rotor per start
rowhead: Starting method
- * Original motor, direct on line | 175 | 13.9 | 377 kJ
- Larger motor with higher starting torque, direct on line | 260 | 9.0 | 361 kJ
- Star–delta starter on the original motor | about 60 | 54 | 500 kJ
- Variable-speed drive, about 120% of rated torque | 116.5 | 22.4 | much less: low slip throughout
caption: This is an illustration. Load torque 20 N·m in every case; inertia 6.988 kg·m². The variable-speed drive's start is slower but keeps the motor near its rated slip, so the rotor heating of a direct-on-line start, which the tool's energy figure assumes, does not apply.
```

A larger motor with more starting torque brings the start time within its allowance, but the heat per start barely changes, because it is set by the rotor's stored energy, not the motor. A star–delta starter, which reduces the starting torque to about a third, makes things much worse for a high-inertia load: the start takes nearly a minute and the heat rises. A variable-speed drive accelerates the rotor slowly at close to rated current, with the motor running near its normal slip throughout, so the heating problem disappears; the drive itself must be sized for the start.

The maker chose a variable-speed drive for its standard starter, set to ramp the mill up over about 25 s and locked at a maximum of 50 Hz (Chapter 8's lesson). For customers who did not want a drive, it offered a larger motor rated for heavy starting duty, with a limit of two starts per hour written into the manual.

### Fluid couplings

A third classic answer for high-inertia loads is a fluid coupling between the motor and the rotor. The motor starts almost unloaded and reaches its speed in a second or two, well within its rating; the coupling then transmits torque through its oil, slipping while the rotor accelerates. The energy lost in the slip has not disappeared: about the same 333 kJ as in a direct-on-line start is dissipated, but as heat in the coupling's oil rather than in the motor's rotor bars. The coupling must be sized for that heat and for the number of starts per hour, and it brings a small running slip and a fusible plug that releases the oil if it overheats. The maker considered one for the HM-30 and chose the variable-speed drive instead, because the drive also limited the maximum speed and gave the truck variant a controlled stop.

### Measuring a start

A run-up calculation is easily checked on the real machine. Recording the motor current and the rotor speed against time during a start, with a clamp meter and a tachometer or the drive's own data log, shows the start time directly. The slope of the speed against time, with the motor's torque known from its curve at that speed, gives the total inertia: J = (T_motor − T_load) ÷ (dω ÷ dt). On the HM-30's test plinth, the recorded start agreed with the tool's 13.9 s, which confirmed the inertia used in Chapters 9 and 10. The same record is the right basis for setting the motor's protection relay: its trip time must exceed the measured start time with a margin, and the relay must still protect the motor against a stalled rotor.

## Passing through resonances on the way up

A rotor that accelerates from rest to its running speed passes through every natural frequency below the running speed that its excitations can reach. The HM-30 runs below its first lateral critical speed, so it never passes through a whirling resonance. Machines that run above their first critical speed do, every start and stop, and the time spent near the critical speed matters: the shorter the passage, the less the response has time to build up. A run-up of 13.9 s on the HM-30 spends about 1.6 s within ±10% of any given speed below 2,950 rpm; a variable-speed drive's slow ramp spends longer, which is one reason supercritical machines often ramp quickly through their critical speeds even when they ramp slowly elsewhere.

### The drive's torsional natural frequency

The motor, coupling, shaft and rotor also form a torsional system: two inertias, the motor's and the rotor's, joined by a torsional spring, the coupling and shaft in series. Its natural frequency must be kept away from the torque fluctuations of running speed and its harmonics.

The KEVOS® [Drive shaft torsional check](/tools/drive-torsional-check/) tool treats a two-inertia drive joined by a shaft. From the shaft's diameter, bore and length, its shear modulus, the two inertias, the speed range, the number of running-speed orders to check, a separation margin, the drive torque and an allowable shear stress, it gives the shaft's torsional stiffness, the effective inertia, the natural frequency, each order's excitation band and whether the natural frequency is clear of it, the speed at which each order would excite it, and the shaft's stress and twist. Its checks remind the user to add the coupling's and any gear's stiffness in series for an accurate frequency.

This is an illustration. For the HM-30's 90 mm shaft, 600 mm from the coupling to the middle of the rotor, with the motor at 0.25 kg·m² and the rotor at 6.6 kg·m², the tool gives a stiffness of 851,000 N·m/rad and a natural frequency of 299 Hz, far above anything at running speed. But the shaft is not the soft part of this drive. The flexible coupling, with a torsional stiffness of about 8,000 N·m/rad from its maker's catalogue, is a hundred times softer. Combining the two in series by hand:

```figure
type: steps
title: HM-30 torsional natural frequency with the coupling included
caption: This is an illustration. The coupling stiffness is an illustrative catalogue value. The shaft alone, as the tool reports it, would put the frequency at 299 Hz; the coupling brings it down to 28.9 Hz.
- Shaft stiffness | 851,318 N·m/rad
- Coupling stiffness | 8,000 N·m/rad
- * In series | 1 ÷ (1 ÷ 851,318 + 1 ÷ 8,000) = 7,926 N·m/rad
- Effective inertia | 0.25 × 6.6 ÷ 6.85 = 0.241 kg·m²
- Natural frequency | √(7,926 ÷ 0.241) ÷ 2π = 28.9 Hz
- Against running speed | 1× = 49.2 Hz and 2× = 98.3 Hz: clear by more than 20% below both
```

At 28.9 Hz the drive's torsional natural frequency is well below the running speed's 49.2 Hz, so in normal running nothing excites it. During every start the rotor passes through 1,734 rpm, where once-per-revolution torque fluctuations would coincide with it, and 867 rpm for twice per revolution. Both are passed quickly, and the coupling's rubber elements, chosen partly for their damping, absorb what little builds up. The torsional side of drives, including how to model couplings and gears, is covered in more depth in [Twist: torsional modes of the fan drive](/reados/publications/vibrating-machine-elements-by-the-numbers/torsional-modes-of-the-fan-drive/).

### Torque at the coupling during a start

A start also loads the coupling and shaft with more than the running torque. During a direct-on-line start the motor's torque, here about 175 N·m on average and more at its peak, is nearly twice the rated 97.1 N·m, and the first instants of a direct-on-line start add a brief electrical torque transient on top. The coupling must be rated for the starting torque as well as the running torque, and for the number of starts it will see. A variable-speed drive's controlled ramp keeps the torque close to its set limit and avoids the transient, which is a further reason couplings on drive-started machines tend to last longer.

## Stopping

Stopping is the start in reverse. A rotor left to coast down dissipates its 333 kJ slowly in bearing friction and windage, which on the HM-30 takes several minutes. A brake, or a variable-speed drive braking the motor, stops it faster, but the braking torque passes through the coupling and shaft just as the starting torque does, and the energy must go somewhere: into brake linings, into a braking resistor, or back into the supply. For the truck-mounted mill, whose rotor must be slowed before tight turns (Chapter 9), the drive's braking ramp was set to bring the rotor from full speed to a safe speed in about 30 s, with the braking resistor sized for one such stop every few minutes.

## Exercise: the larger motor's start limit

This is an illustration. A customer who does not want a variable-speed drive buys the larger motor, with an average accelerating torque of 260 N·m, an allowed start time of 15 s, and a rotor thermal capacity of about 1,000 kJ per hour. Assume the same inertia and load torque.

1. What are the run-up time and the energy per start?
2. How many starts per hour does the thermal capacity allow?
3. What would you write in the operating manual?

**Worked answer.**

1. t = 6.988 × 308.9 ÷ (260 − 20) = **9.0 s**, within 15 s. Energy per start = 333.4 × 260 ÷ 240 = **361 kJ**.
2. 1,000 ÷ 361 = 2.8, so **two starts per hour**, with the third start only after the motor has had time to cool.
3. "Do not start the mill more than twice in any hour. If the mill trips on start, do not raise the protection setting; wait 30 minutes and contact the supplier if it trips again." The limit belongs on a label at the starter as well as in the manual.
