---
book: shape-memory-alloys-by-the-numbers
chapterSlug: heating-with-current
order: 6
title: "Heating the wire with current"
description: "Work out a wire's resistance, current, voltage and pulse energy, drive it from a 5 V supply with a resistor, PWM or a current driver, and catch a development rig that ran the wire straight off 12 V."
draft: false
---

The simplest way to heat a shape memory wire is to pass a current through it. The wire is its own heater: its resistance turns electrical power into heat throughout its volume, and the wire's small mass means it heats in a fraction of a second. The same simplicity is the danger. A wire that heats in a second at the right current heats in a fraction of that at a few times the current, and carries on heating, past any useful temperature, for as long as the current flows.

This chapter calculates VL-25's wire resistance, current, voltage, power and energy per operation from the maker's data, compares three ways of driving it from the cabinet's 5 V supply, sets the pulse length for the coldest cabinet, and records a development rig that drove the wire directly from a 12 V rail.

## Resistance and current

The wire maker's table, listed in the references, gives a resistance of 18.5 Ω per metre for 0.25 mm wire and a current of about 1,050 mA for a contraction in about one second. Those two numbers fix the electrical design.

```figure
type: formula
title: Electrical numbers for VL-25's 150 mm wire
formula: R = r L     V = I R     P = I² R     E = P t
caption: This is an illustration for VL-25, using the maker's published resistance and current. The current figure is for a contraction in about one second at room temperature; colder surroundings need more energy.
- r | Resistance per metre, 18.5 Ω/m
- L | Working length, 0.150 m
- I | Current, 1.05 A
- t | Pulse length, s
step: R = 18.5 × 0.150 = 2.775 Ω
step: V = 1.05 × 2.775 = 2.91 V
step: P = 1.05² × 2.775 = 3.06 W
step: For a 1.0 s pulse, E = 3.06 J
```

A wire of 0.0507 mm² cross-section and 150 mm length has a volume of about 7.6 mm³ and, at 6.5 g/cm³, a mass of about 0.05 g. Three joules into 0.05 g is about 60 J per gram, far more than the wire needs to heat by a hundred degrees and transform. Most of the energy leaves as heat to the surrounding air even during the pulse, which is why the current for a given contraction time depends on the surroundings and why the maker's figure is approximate.

### Resistance as a measurement

The wire's resistance changes slightly as it transforms, because austenite and martensite have different resistivities. Some actuators use the change to sense when the transformation is complete and cut the current, which saves energy and protects the wire. VL-25 does not; its controller simply times the pulse. But the resistance is still a useful production check: a wire whose resistance is well off 2.775 Ω is the wrong length, the wrong diameter or badly crimped, and the production test in Chapter 9 measures it.

## Driving it from 5 V

The cabinet's controller has a 5 V supply. Connected directly across the wire, 5 V would drive 5 / 2.775 = **1.80 A** and deliver 5² / 2.775 = **9.0 W**, three times the design power. The wire would contract quickly and then keep heating. The current must be limited, and there are three common ways.

```figure
type: compare
title: Three ways to drive VL-25's wire from 5 V
cols: Current in the wire | Power in the wire | Other losses and points
caption: This is an illustration. A 2.0 Ω resistor is the nearest standard value to the 1.99 Ω calculated. Pulse-width modulation switches the full voltage on and off fast enough that the wire sees its average heating.
- Direct, no limit | 1.80 A | 9.0 W | overheats within seconds; never acceptable
- Series resistor, 2.0 Ω | 1.05 A | 3.04 W | 2.19 W wasted in the resistor; simple and robust
- *Pulse-width modulation, about 34% duty | 1.80 A peaks, same average heating | 3.06 W average | efficient; needs firmware and a hardware time limit
- Constant-current driver | 1.05 A | 3.06 W | holds current as the wire's resistance and supply change; most controlled
```

The series resistor is the simplest: 5 / 1.05 − 2.775 = 1.99 Ω, so a 2.0 Ω resistor rated for a few watts gives 1.047 A and wastes about 2.2 W during the pulse. Pulse-width modulation switches the full 5 V on and off rapidly, so the wire sees 9.0 W for about 34% of the time and an average of 3.06 W, with almost no wasted power, but the peaks are higher and the firmware is now part of the wire's protection. A constant-current driver holds the current at 1.05 A whatever the supply does and whatever the wire's resistance, which is the most controlled option and the one VL-25 adopted after the error below.

### What the wire's temperature actually does

During a pulse, the wire's temperature climbs from its surroundings towards a level where its electrical heating balances its heat loss to the air. At the maker's rated current, that balance point is comfortably above the transformation temperatures; at much higher currents it is far above them. Part of the way up, the wire passes As and begins to transform, and the transformation absorbs latent heat, which slows the temperature rise for a moment, much as ice melting holds a drink at 0 °C. Once the transformation is complete, the temperature resumes its climb.

That shape explains two practical observations. A wire heated at its rated current contracts and then sits at a stable, safe temperature if the current is left on briefly, which is why a timed pulse with some margin is forgiving. And a wire heated at several times its rated current passes through the transformation in a fraction of a second and then heads for a balance point far above anything it can tolerate, which is why the margin disappears at high current. A thermocouple taped beside a wire this thin gives only a rough, lagging reading, as the unloaded bench test in Chapter 3 showed: it suggested the wire was hot enough when, under load, it was not. That is why the team measured the effect of each pulse through the latch's behaviour, full release or not, on assembled latches under their real load, rather than by trying to measure the wire's temperature directly.

## Pulse length and the coldest cabinet

The heating pulse must take the wire past its loaded Af of about 113 °C, from Chapter 3, with margin, and it must do so from the coldest condition the cabinet sees. At 20 °C, the maker's figure of about one second at 1.05 A is a fair starting point. At 0 °C, the wire starts 20 °C colder and loses heat faster to colder air, so it needs a longer pulse.

This is an illustration. The team measured, on assembled latches in a climate chamber, the shortest pulse at 1.05 A that released the latch fully at each cabinet temperature, and set the firmware's pulse with a margin over it, using the controller's own temperature sensor to choose the pulse:

```figure
type: bars
title: VL-25 heating pulse at 1.05 A by cabinet temperature
unit: s
max: 1.6
caption: This is an illustration from the fictional climate chamber tests on assembled latches under load. The firmware uses these values, with the pulse capped at 1.5 s by a hardware timer whatever the firmware asks for.
- Cabinet at 0 °C | 1.3
- *Cabinet at 20 °C | 1.0
- Cabinet at 40 °C | 0.8
- Cabinet at 60 °C | 0.7
```

At 0 °C, a 1.3 s pulse delivers 1.05² × 2.775 × 1.3 = **3.98 J**. Over VL-25's design life of 20,000 operations, the total energy is about 20,000 × 3.06 J = 61 kJ, or about 17 watt-hours, trivial for a cabinet on mains power and small enough that the backup battery needs only to cover the few operations expected during an outage.

### The hardware time limit

Firmware chooses the pulse; hardware must cap it. A watchdog timer or a monostable circuit in the driver, independent of the microcontroller, cuts the current after 1.5 s whatever the firmware does. The reason is simple: a firmware fault that leaves the output on would cook the wire in seconds, and the wire cannot protect itself. Any wire actuator that could be left energised by a software fault needs a limit the software cannot override.

## The error: straight off 12 V

This is an illustration. During early development, a technician wired a VL-25 prototype to the test bench's 12 V supply through a MOSFET switch controlled by a development board, intending to set the pulse length in software. The current limit on the bench supply had been left at its maximum. With 12 V across 2.775 Ω, the wire drew about 4.3 A and dissipated about 52 W, seventeen times the design power. The software's 1 s pulse was more than long enough: the wire contracted in a small fraction of a second and then went on heating, discoloured, and on the third operation broke at the middle of its length.

The investigation was short; the wire's straw-to-blue discolouration showed it had been far hotter than any transformation temperature. Even before it broke, the overheated wire had lost much of its stroke, because temperatures well above those it was processed at change the microstructure that gives it its memory. That is why actuator wire is always driven at a limited current, and why a wire that has once been overheated should be replaced rather than trusted.

The bench procedure was changed: wire actuators are only ever driven through a current-limited driver set to the wire's rated current, and the bench supply's own current limit is set below the wire's rating as a second line of defence. The product design adopted the constant-current driver and the hardware time limit described above. The general lesson: the current figure in the wire maker's table is a rating, not a suggestion, and a wire actuator's driver must enforce it with hardware.

## Faster or slower heating

The maker's current is for a contraction in about a second. More current heats faster: the wire's temperature rises at a rate roughly proportional to the power, so doubling the current, which quadruples the power, can contract the wire in a fraction of the time. Some actuators use a short boost at a higher current to release quickly and then drop to a lower holding current to keep the wire contracted without overheating it.

Fast heating has costs. The wire heats less evenly, with its middle running ahead of its cooler ends; the margin between "fully contracted" and "overheated" shrinks, so the pulse must be timed precisely; and a fault that leaves the boost on is more damaging. For VL-25, which has two seconds to release, there is no need for speed, and the design runs at the maker's rated current throughout. Slower heating, at lower current for longer, is gentler on the wire and wastes more energy to the air; it is a reasonable choice when power is limited and time is not.

### Holding the wire contracted

Some applications need the wire to stay contracted for a long time, for example a valve held open. Holding needs only enough current to keep the wire above its loaded Af against the heat it loses, which is much less than the current that heated it. The holding current is found by test: reduce the current after contraction until the stroke begins to fall back, then set the holding current comfortably above that. VL-25 does not hold; once the flap opens, the latch's job is done and the wire is allowed to cool. A design that does hold should treat the holding current with the same care as the heating current, with a hardware limit on how long it may run, since a wire held hot for hours ages faster than one pulsed briefly.

## Checking the drive in production

Every VL-25 controller is checked at the end of its assembly line with a dummy load of 2.775 Ω in place of the wire. A current probe and a timer record the pulse: its current must be within 5% of 1.05 A and its length must match the firmware's table for the test room's temperature, and the hardware limit is checked by commanding a pulse of 3 s and confirming that the current stops at 1.5 s. The check takes under a minute and catches the two faults that would damage wires in the field, a current set wrong and a time limit that does not work.

## Wiring and connections

A few practical points complete the electrical design:

- **Terminations** must carry the current without heating the wire's ends further. Crimped terminals, as Chapter 4 described, are electrically good if made correctly; a loose crimp adds resistance and heats locally.
- **Leads** to the wire should be sized for the current with a small voltage drop, so that the wire receives the voltage the design assumed.
- **Polarity** does not matter to the wire, but the driver's protection does: a reversed connection to a polarised driver can disable its current limit.
- **Isolation** of the wire from the latch body, already discussed, also prevents the wire's current from finding a path through the cabinet's metalwork.

## Exercise: a 24 V cabinet

A customer's cabinets have a 24 V control supply and no 5 V rail. The team considers a series resistor.

1. What resistor would give 1.05 A, and how much power would it waste during a 1.0 s pulse?
2. What would you recommend instead, and why?

**Worked answer.**

1. The total resistance must be 24 / 1.05 = 22.9 Ω, so the series resistor is 22.9 − 2.775 = **20.1 Ω**. During the pulse it dissipates 1.05² × 20.1 = **22.1 W**, about seven times the wire's own 3.06 W, for 22.1 J wasted per operation. The resistor must be rated for that pulse and mounted where its heat does no harm.
2. A constant-current switching driver, or a pulse-width-modulated output at about 1.05² × 2.775 / (24² / 2.775) = 1.5% average duty, would deliver the wire's 3.06 W with little waste. At 24 V, the peak current under PWM would be 8.6 A, so a constant-current driver is the safer choice: it limits the current at all times, rather than relying on fast switching to average it, and it keeps the failure mode of a stuck output from becoming an 8.6 A overload.
