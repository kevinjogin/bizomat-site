---
book: inertia-and-flywheels-by-the-numbers
chapterSlug: starting-a-heavy-rotor
order: 7
title: "Starting a heavy rotor"
description: "How long a motor takes to bring a heavy rotor to speed, how much energy it dissipates in its own rotor while doing so, and how start time and starts per hour are checked against the motor's limits."
draft: false
---

Some machines are almost all inertia. A chipper, a large fan, a centrifuge or a crusher's flywheel takes little torque to keep turning but a great deal of energy to bring up to speed, and the motor that starts it spends that whole time drawing several times its rated current. The question is not whether the motor can turn the load, but whether it can get it to speed before it overheats, and how often it can do so.

This chapter checks the DL-3 chipper's direct-on-line start with the WORKOS rotor run-up time tool. It explains why an induction motor heats its own rotor by about as much energy as it gives the load, how the motor's limits on start time and starts per hour come in, and what a star-delta start would do. Its mistake is a motor torque entered on the wrong side of the belt, which made a good start look impossible.

## The chipper's start

The chipper's rotating parts are its 1,400 mm disc, 222.05 kg·m², and its hub, a 300 mm, 60 kg casting with 0.675 kg·m². The four knives' 3.9 kg·m² from Chapter 1 are left out of this chapter's figures to keep them traceable to the tool; including them would lengthen the start by about 0.13 s.

The 75 kW motor drives the disc through V-belts with a ratio of 1,480 ÷ 600 = 2.467. Its rotor, 1.201 kg·m² from Chapter 2, looks like 1.201 × 2.467² = 7.307 kg·m² from the chipper's shaft. In total the start must accelerate 230.03 kg·m² to 600 rpm.

The motor's rated torque is 75,000 ÷ 154.99 = 483.9 N·m. Started direct on line, an induction motor's torque varies with speed, and its average over the run-up is typically about one and a half to two times its rated torque; the mill used 1.8 times, 871.1 N·m, an illustration that a real check takes from the motor's torque-speed curve. Through the belt, with 95% efficiency, that is 871.1 × 2.467 × 0.95 = 2,041 N·m at the chipper. The disc's air drag and bearing friction average about 150 N·m during the run-up.

The motor maker's figures for this motor and this inertia, both illustrations, are a largest start time of 15 s and a largest rotor heating of 3,000 kJ an hour. The mill expects up to three starts an hour.

## The rotor run-up time tool

The [rotor run-up time tool](/tools/rotor-run-up-time/) takes up to two discs and a ring on the shaft, each by mass and diameter, and the motor's rotor inertia; the final speed, the average motor torque and the average load torque during the run-up; and the motor's allowed start time, the starts per hour and the allowed rotor energy per hour. It returns the inertia of each part and the total, the run-up time, the revolutions to speed, the kinetic energy stored, the energy dissipated in the motor's rotor in each start and in an hour, with checks on start time and hourly energy. It uses average torques and assumes a direct-on-line induction start; it also reminds the user to check the supply's voltage dip and the protection settings for a long start.

Every input must be on one shaft. The chipper's shaft is the natural one here, so the motor's rotor and its torque are both entered as seen from the chipper.

```figure
type: steps
title: The chipper's start in the rotor run-up time tool
caption: This is an illustration. Disc 906.31 kg × 1,400 mm, hub 60 kg × 300 mm, no ring, motor rotor 7.307 kg·m² at the chipper; 600 rpm, average motor torque 2,041 N·m and load torque 150 N·m at the chipper; allowed start 15 s, 3 starts an hour, 3,000 kJ an hour.
- Inertia of disc and hub | 222.05 and 0.675 kg·m²
- Total inertia including the motor | 230.03 kg·m²
- * Run-up time | 7.64 s
- Revolutions to speed | 38.2
- Stored energy | 454.1 kJ
- Rotor energy per start | 490.1 kJ
- Rotor energy per hour | 1,470 kJ: START ACCEPTABLE
```

The start takes 7.64 s, about half the motor's allowed time, and three starts an hour heat the rotor by 1,470 kJ, about half the hourly limit.

## The rotor's share of the energy

The most striking number is the rotor energy per start: 490.1 kJ dissipated as heat in the motor's own rotor, more than the 454.1 kJ stored in the chipper. That is not a property of this motor; it is a property of every induction motor started direct on line.

An induction motor's rotor turns more slowly than the rotating magnetic field that drives it. The difference is called slip, and the power lost in the rotor is the power crossing the air gap times the slip. At standstill the slip is total and all that power becomes heat in the rotor; at full speed the slip is a few per cent. Integrated over a start against inertia alone, the rotor's losses come out exactly equal to the kinetic energy given to the load, the same result as for a friction clutch engaging a load: a slipping coupling, whether a clutch or a motor's air gap, dissipates as much energy as it delivers. With a load torque, the start lasts longer and the rotor dissipates more; the tool multiplies the kinetic energy by Tm ÷ (Tm − TL), which for the chipper is 2,041 ÷ 1,891 = 1.079.

```figure
type: bars
title: Energy in one direct-on-line start of the chipper
x: Quantity
y: Energy, kJ
caption: This is an illustration. The stator's own losses during the start, and the work done against the load torque, come on top of these. A motor maker limits starts per hour mainly because of the rotor energy.
- Kinetic energy stored in the rotor system | 454.1
- * Heat in the motor's rotor | 490.1
```

The rotor of a 75 kW motor weighs perhaps a hundred kilograms or so, and 490 kJ into it raises its temperature by tens of kelvin in a few seconds. The rotor then cools slowly, mostly through the air gap and the shaft. That is why a motor maker states starts per hour, or rotor energy per hour, for a given load inertia: repeated starts accumulate heat faster than the rotor can shed it.

## A star-delta start

Many large motors are started star-delta: connected in star for the start, which lowers the voltage across each winding to 1 ÷ √3 of normal, then switched to delta near full speed. Starting current falls to a third of the direct-on-line current, which suits a weak supply. So does the starting torque: torque varies with voltage squared, so a star start gives a third of the direct-on-line torque.

For the chipper, a third of 2,041 N·m is 680 N·m against a load torque of 150 N·m. The run-up time becomes 27.3 s, nearly twice the motor's allowed 15 s, and the rotor energy per start rises to 582.5 kJ, because the load torque now takes a larger share of a smaller motor torque.

```figure
type: compare
title: The chipper's start, direct on line and star-delta
cols: Average torque at the chipper | Run-up time | Rotor energy per start | Rotor energy, 3 starts an hour
rowhead: Starting method
- * Direct on line | 2,041 N·m | 7.64 s | 490.1 kJ | 1,470 kJ
- Star-delta | 680 N·m | 27.25 s | 582.5 kJ | 1,747 kJ
caption: This is an illustration. Same rotor and load torque of 150 N·m. The star-delta start's lower torque roughly triples the run-up and exceeds the motor's 15 s allowed start time, an illustration of the motor maker's figure; it also raises the rotor heating per start.
```

Star-delta starting therefore suits loads with low inertia and a light load at low speed, not heavy rotors. The mill kept the direct-on-line start, after its electrical engineer confirmed that the supply could take the starting current for 8 s. A soft starter, which ramps the voltage, lets the start's current and torque be set between the two; Chapter 9 returns to the start when a flywheel doubles the inertia.

## The supply and the protection

A direct-on-line start draws several times the motor's rated current for the whole run-up; six to eight times is common for this kind of motor. For the chipper that is a current of several hundred amperes for about 8 s, and two things must be checked by the mill's electrical engineer, not by the mechanical calculation.

The first is the supply. A large starting current through the site's transformer and cables lowers the voltage at the motor and at everything else on the same supply. The motor's torque falls with the square of its voltage, so a supply that sags by 10% during the start cuts the motor's torque by about 19%, lengthening the start, which in turn lengthens the sag. Lights flicker, contactors may drop out and other drives may trip. The electricity distributor's connection rules, and the site's own switchboard, set what is acceptable.

The second is the motor's protection. An overload relay or electronic protection relay is set to trip if the motor draws too much current for too long. A start of 7.6 s at high current must not trip it, but a stalled rotor, drawing the same current with no prospect of reaching speed, must. The relay's setting is chosen with the start time in hand, which is one reason the tool reminds its user to check the protection for a long start.

## Variable-speed drives and heavy starts

A variable-speed drive starts a motor in a different way. It raises the frequency gradually, so the motor always runs at a small slip close to its rated current, and the load's speed follows the drive's ramp. The current drawn from the supply stays near the motor's rated current instead of six or more times it, and the heat in the motor's rotor is much less than the kinetic energy given to the load, because the motor never runs at a large slip.

The price is time and cost. With the motor held near its rated torque, the chipper would take 230.03 × 62.83 ÷ (483.9 × 2.467 × 0.95 − 150) = 14.7 s to reach speed, nearly twice as long as on a direct start, and a 75 kW drive costs far more than a contactor. For a machine started a few times a shift and then run for hours, the direct start is usually the better choice when the supply allows it. For a heavy rotor that must be started often, or a supply that cannot take the starting current, the drive's lower losses can decide the matter.

## A start against a load

The calculation above assumes the chipper starts empty. If it is stopped full of chips and restarted, the chips must be thrown out while the disc speeds up, and the average load torque during the run-up could be several times higher. At an average of 600 N·m instead of 150 N·m, the start would take 10.03 s and dissipate 643.1 kJ in the rotor: still within the motor's limits, but with much less margin. The mill's operating instruction is to run the chipper empty for a minute before stopping it, so that it starts clear.

## The mistake: torque on the wrong side of the belt

The first run-up check entered the motor's average torque as 871 N·m, its value at the motor shaft, together with the inertias as seen from the chipper. The tool returned a run-up time of 20.04 s, beyond the 15 s limit, and a proposal for a soft starter and a larger motor followed.

The inputs mixed two shafts. Seen from the chipper, the motor's torque is multiplied by the belt ratio, less the belt's losses, just as its inertia is multiplied by the ratio squared. With 2,041 N·m at the chipper the start takes 7.64 s. The reviewer found the error by working the start a second way, entirely at the motor shaft: the chipper's inertia divided by 2.467² is 36.6 kg·m², plus the rotor's 1.201, is 37.8 kg·m²; the speed is 154.99 rad/s; the torques are 871.1 N·m and 150 ÷ (2.467 × 0.95) = 64.0 N·m. That gives 37.8 × 154.99 ÷ (871.1 − 64.0) = 7.3 s, close to the chipper-shaft result, not 20 s.

The small difference between 7.3 s and 7.64 s comes from the belt's efficiency, which the reviewer's quick check applied to the load torque but not to the inertia. Either shaft gives the right answer if every quantity is moved to it consistently.

```figure
type: checklist
title: Before trusting a run-up calculation
caption: The DL-3 review's checks. This is an illustration.
- x Every inertia and torque referred to the same shaft
- x Motor torque taken as its average over the run-up, from its torque-speed curve
- x Load torque during the run-up estimated, including a loaded restart
- x Start time compared with the motor maker's allowed time for this inertia
- x Rotor energy per hour compared with the maker's figure for the starts expected
- x Supply's voltage dip and the motor protection settings checked for the long start
```

## Exercise: a large fan

**Problem.** A fan has an impeller that can be treated as a 1,200 mm disc of 180 kg, and a 250 mm, 20 kg hub, directly coupled to a 30 kW motor at 1,480 rpm with a rotor of 0.8 kg·m². The motor's average torque on a direct start is 1.6 times its rated torque, and the fan's air load averages one third of the rated torque over the run-up. The motor maker allows 10 s and 1,500 kJ of rotor heating an hour, and the fan is started six times an hour. Find (a) the total inertia, (b) the run-up time, (c) the rotor energy per start and per hour, and (d) whether the start is acceptable.

**Answer.** Rated torque = 30,000 ÷ 154.99 = 193.6 N·m; average motor torque = 309.7 N·m; load torque = 64.5 N·m.

(a) Impeller: 180 × 1.2² ÷ 8 = 32.40 kg·m². Hub: 20 × 0.25² ÷ 8 = 0.156 kg·m². Total with the rotor: 33.36 kg·m².

(b) t = 33.36 × 154.99 ÷ (309.7 − 64.5) = 21.1 s.

(c) Stored energy = 0.5 × 33.36 × 154.99² = 400.6 kJ. Rotor energy = 400.6 × 309.7 ÷ 245.2 = 506.0 kJ per start; 3,036 kJ an hour.

(d) No. The start takes twice the allowed time and the hourly heating is twice the limit. A fan this heavy needs a larger motor, fewer starts, or a variable-speed drive that brings it up slowly at a current the motor can carry, which avoids the high rotor slip losses of a direct start.
