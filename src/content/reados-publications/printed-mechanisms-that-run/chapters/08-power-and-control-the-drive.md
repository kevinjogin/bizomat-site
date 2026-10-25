---
book: printed-mechanisms-that-run
chapterSlug: power-and-control-the-drive
order: 8
title: "Power and control the drive"
description: "Wire a 12 V gearmotor with a compliant supply, a fuse and a small controller; set speed and dwell, detect jams, and guard the pinch points the mechanism creates."
draft: false
---

A printed mechanism usually needs a motor, and a motor needs power, switching and some control. This is where many mechanical designers feel least at home, and where a few simple habits make the difference between a demonstrator that runs reliably for years and one that resets itself, overheats a wire or pinches a finger.

This chapter wires the indexing table's 12 V gearmotor, adds speed and dwell control with a small microcontroller board, uses the Geneva's motion to detect a jam, and deals with the hazards the mechanism creates. Everything here is extra-low-voltage DC. Mains electricity stays inside a purchased, compliant power supply.

## Keep the mains outside the project

Under the Australian wiring rules, AS/NZS 3000, extra-low voltage means not exceeding 50 V AC or 120 V ripple-free DC. A 12 V DC circuit is well within that, and it is the only kind of wiring this book covers.

The mains side is handled by a bought plug-pack or desktop power supply. In Australia, electrical equipment sold for connection to mains is regulated under the Electrical Equipment Safety System administered through the state and territory regulators, and compliant equipment carries the Regulatory Compliance Mark (RCM). Buy a supply sold for the Australian market that carries the mark, with a rating comfortably above the project's needs. Do not open, modify or build mains-powered equipment; in Australia, mains electrical work is for licensed electricians.

## Draw the system before wiring it

A block diagram, drawn before any wire is cut, shows every part, every connection and where current flows. It also becomes the wiring page in the build guide.

```figure
type: svg
title: Power and control for the indexing table
alt: Block diagram. A mains plug-pack supplies 12 volts DC through a barrel jack, a 2 amp fuse and a switch to a power rail. The rail feeds the motor driver, which drives the gearmotor, and the controller board. The controller reads a speed potentiometer, a dwell potentiometer and an index sensor on the Geneva driver, and sends a PWM signal to the motor driver and drives a status LED.
caption: This is an illustration. Heavy lines carry motor current at 12 V; light lines are low-current signals at 5 V.
viewbox: 0 0 640 330
body:
<rect class="bx" x="20" y="40" width="110" height="56" rx="6"/>
<text class="txb" x="32" y="64">Plug-pack</text>
<text class="tx txs" x="32" y="84">RCM, 12 V 2 A</text>
<rect class="bx" x="170" y="40" width="120" height="56" rx="6"/>
<text class="txb" x="182" y="64">Fuse, switch</text>
<text class="tx txs" x="182" y="84">2 A, on/off</text>
<rect class="bxa" x="330" y="40" width="130" height="56" rx="6"/>
<text class="txb" x="342" y="64">Motor driver</text>
<text class="tx txs" x="342" y="84">PWM switching</text>
<rect class="bx" x="500" y="40" width="120" height="56" rx="6"/>
<text class="txb" x="512" y="64">Gearmotor</text>
<text class="tx txs" x="512" y="84">12 V, 50 rpm</text>
<path class="li" d="M130 68H170 M290 68H330 M460 68H500"/>
<path class="li" d="M230 96V170H330"/>
<rect class="bxi" x="330" y="140" width="130" height="66" rx="6"/>
<text class="txb" x="342" y="166">Controller</text>
<text class="tx txs" x="342" y="186">5 V board</text>
<path class="la flow" d="M395 140V96"/>
<rect class="bx" x="40" y="240" width="130" height="50" rx="6"/>
<text class="tx txs" x="52" y="270">speed and dwell pots</text>
<rect class="bx" x="250" y="240" width="140" height="50" rx="6"/>
<text class="tx txs" x="262" y="270">index sensor</text>
<rect class="bx" x="470" y="240" width="130" height="50" rx="6"/>
<text class="tx txs" x="482" y="270">status LED</text>
<path class="lf" d="M105 240V190H330 M320 240V206 M535 240V173H460"/>
```

The heavy path carries motor current: supply, fuse, switch, driver, motor and back. The light paths carry signals: two potentiometers, the index sensor and an LED. Keeping the two kinds of wiring physically apart, and returning the motor current by its own ground wire to the supply rather than through the controller board, avoids most noise problems.

## Write the power budget

The supply, fuse and wires are chosen from the current the system draws, in normal running and at worst.

This is an illustration. The gearmotor's data sheet gives a stall current of 1.2 A. Measured running current on the assembled table, at full speed, was about 0.35 A. The controller board and LED draw about 0.07 A together.

```figure
type: compare
title: Current budget at 12 V
cols: Running | Worst case
caption: This is an illustration. The 2 A supply and 2 A fuse sit above the worst case; the fuse protects the wiring if something shorts.
- Gearmotor | 0.35 A, measured | 1.20 A, stall, from data sheet
- Controller board | about 0.05 A | about 0.05 A
- Status LED | about 0.02 A | about 0.02 A
- *Total | about 0.42 A, about 5 W | about 1.27 A, about 15 W
```

The supply is rated at 2 A, above the 1.27 A worst case with margin. A 2 A fuse sits immediately after the supply's connector, so that a short circuit anywhere in the project blows the fuse rather than overheating a wire. The fuse is chosen to protect the wiring and to stay intact through the motor's brief starting current; it is not a substitute for the jam detection described below, because a stalled motor at 1.2 A will not blow a 2 A fuse.

## Choose wire by current and drop

The motor circuit uses 0.5 mm² stranded copper wire, which comfortably carries the currents here. Wire also has resistance, so it drops some voltage. Copper's resistivity is about 0.0172 Ω·mm²/m, so a 0.5 mm² wire has about 0.0344 Ω per metre.

This is an illustration. The longest motor circuit runs about 1 m from the supply connector to the motor and 1 m back, a 2 m loop with a resistance of about **0.0172 × 2 ÷ 0.5 ≈ 0.069 Ω**. At the 1.2 A stall current, the drop is about **0.069 × 1.2 ≈ 0.083 V**, under 0.7% of 12 V. Wire size is not a constraint here; it would become one with a larger motor or a longer run.

Joints matter as much as wire size. Every crimp or solder joint in the motor circuit carries the full current, and a poor joint has far more resistance than the wire either side of it. Crimp with the correct tool for the terminal, or solder and cover each joint with heat-shrink sleeving, and give each joint a firm tug before closing up the enclosure.

Signal wires to the potentiometers and sensor carry milliamps and can be thinner. Use different colours for power and signals, and keep a consistent convention, such as red for 12 V, black for ground, and other colours for signals, recorded on the wiring page.

## Switch the motor with PWM

The table's motor only ever turns one way, so it does not need a full reversing bridge. A logic-level MOSFET switching the motor's negative side, with a flyback diode across the motor, is enough; a small ready-made motor driver module does the same job with less soldering. The controller switches the MOSFET on and off rapidly, a technique called pulse-width modulation, or PWM. The fraction of time the switch is on, the duty cycle, sets the average voltage the motor sees, and therefore its speed.

On common ATmega328P-based boards, the analogue inputs read 0 to 5 V as a number from 0 to 1023, a 10-bit range, and the standard PWM output takes a value from 0 to 255, an 8-bit range. The speed potentiometer is wired as a voltage divider between 5 V and ground, so its wiper gives a reading from 0 to 1023.

This is an illustration. Tests showed the gearmotor would not start reliably below about 35% duty, because of static friction in its own gearbox and in the mechanism. The controller therefore maps the potentiometer's full travel onto duty values from 90 to 255, rather than 0 to 255, so that every position of the knob gives a running motor.

```figure
type: formula
title: Mapping the speed knob to PWM duty
formula: duty = 90 + reading × 165 ÷ 1023
caption: This is an illustration. The lower limit of 90 out of 255, about 35%, came from start-up tests on the assembled table. Full travel gives the full 12 V.
- reading | potentiometer value, 0 to 1023
- duty | PWM value, 90 to 255
step: Knob at minimum: 90 ÷ 255 ≈ 35% duty
step: Knob at mid-travel, reading 512: 90 + 512 × 165 ÷ 1023 ≈ 173, about 68% duty
step: Knob at maximum: 255, 100% duty
```

At about 35% duty, the table indexed roughly four times a minute; at full duty, about ten. The relationship between duty and speed is not exactly linear, because friction takes a larger share at low speed, but the knob gives smooth, predictable control across the range.

## Sense the index and add dwell

The Geneva gives two thirds of every driver revolution as dwell, which at full speed is 4 s per station. Some demonstrations need longer. Rather than slowing the whole mechanism, the controller can pause the motor during the dwell.

An index sensor tells the controller where the driver is in its revolution. This is an illustration. A small magnet in the locking disc passes a Hall-effect sensor fixed to the frame once per driver revolution, at a point inside the dwell zone, when the dial is locked. When the sensor triggers, the controller stops the motor for an extra dwell set by the second potentiometer, from 0 to 10 s, then restarts it. Because the sensor sits in the dwell zone, the dial is always locked while the motor is stopped, and each station stops at the same Geneva-determined position.

The sensor also gives a revolution counter for free. Counting sensor pulses gives the number of indexes, which the soak test in Chapter 9 uses.

## Detect a jam and stop

A stalled motor is the worst case for the gears, as Chapter 5 showed: the sun's tooth stress rises from about 6.4 MPa to about 19.1 MPa, above the working limit. The fuse will not catch a stall. The index sensor can.

At any speed setting, the controller knows roughly how long a driver revolution should take: about 6 s at full speed and about 15 s at the slowest setting. If the sensor does not trigger within 1.5 times the expected period, plus any programmed dwell, something is wrong. The controller then stops the motor and flashes the status LED. At full speed, that timeout is **6 × 1.5 = 9 s**; at the slowest, **15 × 1.5 = 22.5 s**.

This is an illustration. During testing, a pencil pushed into the dial's path stalled the mechanism. The motor stopped about 9 s later, the LED flashed, and the table restarted only after the switch was cycled. Nine seconds at stall is short enough that the gears and motor are not harmed, and the stall stress, briefly above the working limit, occurs only on those rare occasions.

A current-sensing approach, which measures motor current through a small resistor and stops when it exceeds a threshold, can react faster. It adds parts and calibration. For a slow teaching mechanism, the sensor timeout is simpler and sufficient.

## Write the control logic as states

The controller's program is short, but it is easier to write, test and explain as a small set of states than as a tangle of conditions. Each state has one job and a clear rule for leaving it.

```figure
type: cycle
title: Controller states for the indexing table
caption: This is an illustration. A jam from the running state goes to a stopped state that only a power cycle clears, so a jammed table never restarts by itself.
- Start | read knobs, LED on, motor off
- *Running | motor at the knob's duty; watch the sensor and the timeout
- Dwell | sensor seen: motor off for the set extra dwell, then back to running
- Jammed | timeout passed: motor off, LED flashing, wait for power cycle
```

Writing the states down first has two benefits. It makes the jam behaviour explicit, so nobody adds an automatic restart that would grind the gears against a trapped pencil. And it gives the build guide a simple way to describe what the table should do, which a builder can check: the LED pattern says which state the controller is in.

Keep the program with the CAD files and the scope, under the same revision number, and record the values that came from tests, such as the 90 minimum duty and the 1.5 timeout factor, as named constants at the top of the program with a comment saying where they came from.

## Mount and protect the electronics

Electronics in a printed enclosure need some thought about heat, strain and access. The controller board's onboard linear regulator drops the 12 V supply to 5 V and turns the difference into heat. At about 60 mA, it dissipates about **(12 − 5) × 0.06 ≈ 0.42 W**, enough to make the regulator noticeably warm in a closed box. A few ventilation slots near it, or a small switching regulator supplying 5 V instead, keeps temperatures down. The motor also warms in use, so its printed mount is PETG rather than PLA, for the heat margin discussed in Chapter 1.

Every wire that leaves the enclosure or crosses a moving joint needs strain relief, such as a printed clamp or a cable tie anchored to the frame, so that a tug on the cable does not pull on a solder joint. Connectors at the motor and sensor let either be replaced without soldering. And the board should be mounted on standoffs with access to its programming port, so the program can be updated without dismantling the mechanism.

## Guard the pinch points

The mechanism can hurt fingers even at 12 V. At stall, the Geneva pin can push with about 67.5 N, as Chapter 1 estimated, and the dial can push at its rim with about **2.03 ÷ 0.07 ≈ 29 N**. Neither is large in engineering terms, but either is enough to pinch a fingertip painfully between the pin and the wheel, or between the dial and the frame.

```figure
type: checklist
title: Hazard controls on the indexing table
caption: This is an illustration. The hazards are mechanical, not electrical; the controls are guards, limits and a clear off switch.
- x Gearbox and Geneva enclosed | snap-on cover from Chapter 7; no fingers can reach the pin or slots
- x Gap between dial and frame | kept above finger size, or closed to below it
- x Jam stop | motor stops within about 9 s of a stall
- x Off switch | on the top face, within reach, clearly labelled
- *x Mains | purchased RCM-marked supply only; no mains wiring in the project
- ? Classroom risk assessment | for the school to complete for its own setting
```

The cover over the gearbox and Geneva, clipped on with the snap fits from Chapter 7, is the main control. The gap between the dial's rim and the frame is either generous enough that a finger cannot be trapped or small enough that a finger cannot enter. The off switch is easy to reach. A school or workshop using the table should still apply its own risk assessment to its own setting.

## Detect an electrical fault

This is an illustration. On the first powered test, the controller reset every time the motor started: the LED gave its start-up blink, the motor jerked and stopped, and the cycle repeated. The cause was the motor's starting current pulling the supply voltage down momentarily, together with electrical noise from the motor's brushes reaching the controller through a shared ground wire.

Three changes fixed it. A 470 µF electrolytic capacitor across the 12 V rail, near the driver, smoothed the dip. A 100 nF ceramic capacitor across the motor's terminals reduced the brush noise. And the motor's return current was given its own ground wire back to the supply, so it no longer flowed through the controller board's ground. After the changes, the controller started and ran without resets through fifty consecutive starts.

## Exercise: add a second motor

A later version adds a small 12 V motor to drive a conveyor belt past one station, drawing 0.4 A running and 1.0 A at stall. Rework the power budget and say whether the supply, fuse and wiring still suit.

**Worked answer.** The new worst case is the sum of both stalls plus the controller and LED: **1.2 + 1.0 + 0.05 + 0.02 = 2.27 A**, above the 2 A supply and fuse ratings. Normal running is about 0.35 + 0.4 + 0.07 = 0.82 A, which is fine.

The supply should be upgraded to at least 3 A, and the fuse to suit the new supply and wiring, so that a double stall does not overload the supply. The 0.5 mm² wire still carries the current comfortably. The second motor also needs its own jam detection, for example its own sensor or a current threshold, because the indexing table's sensor cannot see a conveyor stall.
