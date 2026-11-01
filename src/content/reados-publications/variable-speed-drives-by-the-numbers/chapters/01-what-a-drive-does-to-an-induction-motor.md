---
book: variable-speed-drives-by-the-numbers
chapterSlug: what-a-drive-does-to-an-induction-motor
order: 1
title: "What a drive does to an induction motor"
description: "How an induction motor's speed follows supply frequency, how a drive's rectifier, DC link and PWM inverter make a variable frequency and voltage, and how to read motor load on and off a drive."
draft: false
---

An induction motor connected straight to the mains runs at one speed, fixed by the frequency of the supply and the number of its poles, give or take a few per cent of slip. For most of the last century, that meant a fan or pump ran flat out and its output was controlled by throwing energy away in a damper or a valve. A variable-speed drive changes the frequency and the voltage the motor receives, so the motor runs at whatever speed the machine needs, and the energy that would have been wasted is never drawn.

This chapter explains how an induction motor's speed and torque depend on frequency and voltage, how a drive makes a variable frequency from a fixed supply, and what that means for the current and power readings a technician sees. It works DP-4's extraction fan motor and ends with a motor downsized on the strength of a current reading taken at reduced speed.

## Speed, poles and slip

The three windings of an induction motor's stator, fed with three-phase current, set up a magnetic field that rotates around the stator. Its speed, the synchronous speed, is n_s = 120 f ÷ p in revolutions per minute, where f is the supply frequency in hertz and p the number of poles. A 4-pole motor on 50 Hz has a synchronous speed of 120 × 50 ÷ 4 = 1,500 rpm; a 2-pole motor 3,000 rpm.

The rotor, a cage of aluminium or copper bars, does not turn at quite that speed. The rotating field must sweep past the rotor bars to induce the currents that make torque, so the rotor slips behind the field. Slip is s = (n_s − n) ÷ n_s. At no load it is almost zero; at full load it is a few per cent. F-1's motor is rated at 1,475 rpm, a rated slip of (1,500 − 1,475) ÷ 1,500 = 1.67%.

In the normal working range, torque is nearly proportional to slip. That gives a simple way to estimate a motor's load from its speed: measure the speed with a tachometer, work out the slip and compare it with the rated slip. The [motor slip tool](/tools/motor-slip/) does exactly that. With F-1 on the mains and the damper partly closed, the shaft was measured at 1,482 rpm, a slip of 1.20% against the rated 1.67%, so the load was about 72% of rated, about 21.6 kW. The tool's guide notes that the method is approximate, because slip also changes with voltage and rotor temperature, and that nameplate speeds have a tolerance.

```figure
type: formula
title: Induction motor speed, torque and power
formula: n_s = 120 f ÷ p;   s = (n_s − n) ÷ n_s
formula: Load ≈ s ÷ s_rated × rated load, in the normal working range
formula: T = 9,549.3 × P ÷ n   (T in N·m, P in kW, n in rpm)
formula: Line current I = P_out ÷ (√3 V cos φ η)
caption: f is the supply frequency, p the number of poles, n the shaft speed, P the shaft power, V the line voltage, cos φ the power factor and η the efficiency. The slip method and the current formula both assume the motor runs on a fixed-frequency supply at rated voltage.
- n_s | synchronous speed, rpm
- s | slip, as a fraction or per cent
- T | shaft torque, N·m
- I | line current, A
```

The [three-phase motor power tool](/tools/motor-power/) gives the current, input power and torque from the nameplate data. For F-1's motor at its rated 30 kW, 400 V, power factor 0.86 and efficiency 93.6%, it gives a line current of 53.79 A, an input of 32.05 kW and a torque of 194.2 N·m at 1,475 rpm.

## Changing the speed: frequency and voltage

Since synchronous speed is proportional to frequency, the way to change an induction motor's speed efficiently is to change the frequency of its supply. Feed F-1's motor at 40 Hz and its field turns at 1,200 rpm; at 25 Hz, 750 rpm.

The voltage must change too. The magnetic flux in the motor's iron is proportional to the voltage divided by the frequency. If the frequency is halved at full voltage, the flux doubles, the iron saturates and the magnetising current rises enormously. If the voltage is cut with the frequency, keeping V ÷ f constant, the flux stays at its rated value and the motor can produce its rated torque at any speed below its rated speed, with about the same slip in rpm as on the mains. That is constant-flux, or V/f, operation. At low speeds, the voltage lost in the stator winding's resistance becomes a larger share of the whole, so drives add a little voltage boost or use a motor model to keep the flux up.

Above rated frequency the drive cannot raise the voltage beyond its supply, so the flux falls as the frequency rises. The motor can still run faster, but its torque capability falls roughly in inverse proportion to speed, at roughly constant power. That is field weakening, and Chapter 6 deals with it.

```figure
type: compare
title: F-1's motor on the drive, constant flux below 50 Hz
cols: Synchronous speed | Voltage at constant V/f | Torque available | Power available at rated torque
rowhead: Frequency
- 10 Hz | 300 rpm | 80 V | rated, about 194 N·m, if cooled | about 6 kW
- 25 Hz | 750 rpm | 200 V | rated | about 15 kW
- 40 Hz | 1,200 rpm | 320 V | rated | about 24 kW
- * 50 Hz | 1,500 rpm | 400 V | rated | 30 kW
- 60 Hz | 1,800 rpm | 400 V, field weakening | about 5/6 of rated | about 30 kW
caption: This is an illustration. Voltages ignore the low-speed boost. Torque at low speed is limited in practice by the motor's own cooling fan, which slows with the shaft (Chapter 6).
```

## Inside the drive

A drive of DP-4's type makes its variable frequency in three stages.

1. **The rectifier.** Six diodes in a bridge turn the 400 V, 50 Hz three-phase supply into direct current. With a smoothing capacitor, the DC voltage is close to the peak of the line voltage, √2 × 400 = 566 V with no load, falling to about 1.35 × 400 = 540 V on load.
2. **The DC link.** A bank of electrolytic capacitors, often with a choke, smooths the rectified voltage and stores energy for the inverter to draw on between the supply's peaks. It holds hundreds of joules at 540 V and stays charged for minutes after the supply is isolated, which is why every drive carries a warning to wait before opening it. Chapter 5 deals with the capacitors' life.
3. **The inverter.** Six IGBTs, each with a diode across it, connect each motor terminal either to the positive or to the negative side of the DC link. By switching thousands of times a second with varying pulse widths, the inverter builds an output whose average over each switching period follows a sine wave of the frequency and amplitude wanted. This is pulse-width modulation, PWM. The motor's inductance smooths the current, which is close to sinusoidal with a small ripple at the switching frequency.

```figure
type: svg
title: The power circuit of a DP-4 drive
alt: A block diagram from left to right. Three supply lines labelled 400 volts 50 hertz enter a block labelled diode rectifier, six diodes. Two lines labelled DC link plus and minus about 540 volts run to a block labelled capacitor bank and choke, then on to a block labelled inverter, six IGBTs and diodes, switching at 4 kilohertz. Three output lines labelled variable frequency and voltage run to a circle labelled induction motor. Beneath the rectifier is a small waveform showing rippled DC; beneath the inverter a pulse train with a sine wave drawn through it.
caption: This is an illustration. The rectifier and DC link are the same for every output frequency; the inverter's switching pattern sets the motor's frequency and voltage.
viewbox: 0 0 640 220
body:
<path class="ln" d="M10 70H70"/>
<path class="ln" d="M10 90H70"/>
<path class="ln" d="M10 110H70"/>
<text class="tx txs" x="10" y="55">400 V, 50 Hz</text>
<rect class="bx" x="70" y="55" width="110" height="70"/>
<text class="txb" x="82" y="85">Rectifier</text>
<text class="tx txs" x="82" y="105">six diodes</text>
<path class="ln" d="M180 75H240"/>
<path class="ln" d="M180 105H240"/>
<text class="tx txs" x="186" y="65">DC +</text>
<text class="tx txs" x="186" y="125">DC −</text>
<rect class="bxi" x="240" y="55" width="120" height="70"/>
<text class="txb" x="252" y="85">DC link</text>
<text class="tx txs" x="252" y="105">capacitors, 540 V</text>
<path class="ln" d="M360 75H410"/>
<path class="ln" d="M360 105H410"/>
<rect class="bx" x="410" y="55" width="120" height="70"/>
<text class="txb" x="422" y="85">Inverter</text>
<text class="tx txs" x="422" y="105">6 IGBTs, 4 kHz</text>
<path class="la" d="M530 70H585"/>
<path class="la" d="M530 90H585"/>
<path class="la" d="M530 110H585"/>
<circle class="bx" cx="610" cy="90" r="24"/>
<text class="tx txs" x="598" y="94">M</text>
<path class="ln" d="M80 175H100V160H120V175H140V160H160V175"/>
<text class="tx txs" x="70" y="200">rectified, smoothed</text>
<path class="ln" d="M420 185H430V160H436V185H446V160H456V185H462V160H476V185H486V160H490V185H500"/>
<path class="dsh" d="M420 185C440 150 470 150 500 185"/>
<text class="tx txs" x="410" y="210">PWM pulses, sine average</text>
```

## Other ways to vary speed

Drives are not the only way to vary a machine's speed or output, and the alternatives are still found in factories. Knowing why drives displaced them helps in judging an old installation.

- **Throttling at constant speed.** A damper, a valve or a bypass leaves the motor at full speed and wastes the surplus pressure. It is simple and cheap to install but the most wasteful way to reduce flow.
- **Two-speed and pole-changing motors.** A motor wound for two pole numbers gives two fixed speeds, such as 1,500 and 750 rpm. Cheap and robust, but there is nothing in between.
- **Slip-based methods.** Slip-ring motors with rotor resistances, eddy-current couplings and fluid couplings all reduce speed by increasing slip. The motor still turns at nearly full speed, and the power corresponding to the slip is turned into heat in the resistance, the coupling or the oil. At half speed, about half the power drawn is wasted in this way.
- **Mechanical variators.** Variable-pitch pulleys and friction drives change the ratio between motor and machine. They are efficient but wear, need adjustment and are limited in power.
- **DC drives.** A DC motor's speed follows its armature voltage, easily varied with a controlled rectifier. DC drives dominated variable-speed work for decades, but DC motors need brushes and commutators, which wear.

A soft starter, often confused with a drive, is not a speed controller at all: it ramps the voltage up during starting to limit current and torque and then connects the motor directly to the mains. It suits a machine that only needs a gentle start. The AC drive won because it gives continuous speed control of a standard, brushless, sealed induction motor with little more loss than the motor itself, and because the semiconductor switches that make it possible became cheap and reliable. Chapter 2 explains those switches.

## What the readings mean on a drive

A drive displays output frequency, current, voltage, power and often an estimate of motor torque. These are useful, but they are not the same quantities a technician would read on a motor running from the mains, and they must be read with that in mind.

The motor current includes a magnetising part that sets up the flux and does no work, and a torque-producing part. On F-1's motor, the magnetising current is about a third of rated current, about 18 A, at any speed in the constant-flux range. At full load, the total is 53.8 A. At 40% of rated torque, the torque-producing part falls to 40% of its rated value but the magnetising part does not, so the total is about 27 A, half of rated current. Current is a poor measure of load at light load, and on a drive at reduced speed it is worse, because power is torque times speed: 40% torque at 80% speed is only 32% of rated power.

The drive's own power reading, worked out from the DC link voltage and current or from the output voltages and currents, is a much better guide to the power the motor is taking. So is the slip method, if the frequency is known: at constant flux the slip in rpm for a given torque is about the same at any frequency, so a motor at 40 Hz slipping 12 rpm below its 1,200 rpm synchronous speed is carrying about 12 ÷ 25 = 48% of rated torque. The motor slip tool itself works with mains-frequency speeds and refuses a rated speed above the synchronous speed, so at other frequencies the comparison must be made in rpm by hand.

## The error: downsizing from a current reading

A year after F-1's drive was fitted, the fan was running most of the time at about 40 Hz, set by a pressure controller in the extraction duct. A maintenance contractor reviewing the plant's motors for an energy audit read the drive's display: 29.3 A, 55% of the motor's rated 53.8 A. The report recommended replacing the 30 kW motor with an 18.5 kW motor, "since the motor runs at 55% load".

The plant's engineer checked before ordering. The drive's power reading at the same moment was 11.1 kW, about 37% of the motor's rated output, and the speed was 1,188 rpm, a slip of about 12 rpm at 40 Hz, corresponding to about 46% of rated torque: the fan's torque falls with the square of its speed. More importantly, the fan did not always run at 40 Hz: on hot, humid days, with all the wash tanks steaming and the granulators running, the pressure controller drove it up to 50 Hz, where it drew about 21.6 kW, the figure found by the slip method before the drive was fitted. An 18.5 kW motor would have been overloaded by about 17% on every hot afternoon.

The contractor had read three things into one number. The current included the magnetising current, so it overstated the load share at reduced speed; the reading was taken at one operating point, not the worst; and load share at reduced speed is not load share at full speed. The motor stayed as it was. The audit's real saving was the drive itself, which Chapter 7 quantifies.

```figure
type: checklist
title: Before judging a motor's load from a drive's display
caption: This is an illustration. The plant's rule for motor load assessments.
- x Use the drive's power or torque reading, not its current, to judge load
- x Record the output frequency with every reading; load share depends on speed
- x Find the highest-duty operating point over a year, not one moment
- x On the mains, cross-check with the slip method or a power meter
- ? Check the motor's thermal limit at low speed separately (Chapter 6)
```

## Safety: the stored energy

A drive is dangerous in two ways a direct-on-line starter is not. Its DC link capacitors stay charged at hundreds of volts after the supply is switched off; DP-4's drives carry a label requiring five minutes before the covers are opened, and the DC link voltage is measured before any work. And a drive can restart a motor by itself after a fault clears or a power dip, if it is set to. Work on drives and the machines they control is planned under the duty to manage electrical risks, as set out in the electrical risks code of practice approved in the state, with isolation of the supply, a check of the DC link voltage and isolation of the machine's other energy sources.

## Exercise: the cooling-water pump

P-3's motor is rated at 22 kW, 400 V, 2-pole, 50 Hz, 2,950 rpm, power factor 0.88 and efficiency 93.0%.

1. What are its rated current and torque?
2. Running from the mains before its drive was fitted, P-3's shaft was measured at 2,962 rpm. Estimate its load.
3. On the drive at 45 Hz, the shaft runs at 2,664 rpm. Estimate its torque as a share of rated.

### Worked answer

1. I = 22,000 ÷ (√3 × 400 × 0.88 × 0.930) = 38.8 A. T = 9,549.3 × 22 ÷ 2,950 = 71.2 N·m.
2. Synchronous speed 3,000 rpm. Slip = (3,000 − 2,962) ÷ 3,000 = 1.27%; rated slip = 50 ÷ 3,000 = 1.67%; load ≈ 1.27 ÷ 1.67 = 76% of rated, about 16.7 kW.
3. At 45 Hz, synchronous speed = 120 × 45 ÷ 2 = 2,700 rpm, so the slip is 2,700 − 2,664 = 36 rpm. Rated slip is 50 rpm, so the torque is about 36 ÷ 50 = 72% of rated, about 51 N·m. The shaft power is about 51 × 2,664 ÷ 9,549.3 = 14.3 kW, 65% of rated.
