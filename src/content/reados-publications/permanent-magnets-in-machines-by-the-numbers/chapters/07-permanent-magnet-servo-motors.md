---
book: permanent-magnets-in-machines-by-the-numbers
chapterSlug: permanent-magnet-servo-motors
order: 7
title: "Permanent-magnet servo motors"
description: "How magnets set a servo's torque constant, RMS and peak torque from the duty cycle, why hot magnets mean more current and heat, the drive's current limit, demagnetisation and back-EMF checks."
draft: false
---

Nearly every servo motor on a modern packaging machine is a permanent-magnet synchronous motor: a stator with three-phase windings and a rotor carrying rare-earth magnets. The magnets provide the rotor's field without any current, which is why these motors are compact, efficient and quick to respond. They also tie the motor's performance to the magnets' condition. A servo's torque per ampere is proportional to the flux its magnets drive across the air gap; hot magnets give less torque per ampere, and demagnetised magnets give less permanently.

This chapter checks the cross-seal jaw servo on Line 4's bagger with the KEVOS® motor duty cycle check at two line speeds, explains how magnet temperature feeds back into current and heat, and shows how the drive's current limit protects the magnets. The error is a drive replaced with its current limit set too high.

## Torque, current and the magnets

In a permanent-magnet servo, the torque is the product of the stator current and a torque constant, kt, in newton-metres per ampere. The same flux that produces torque also produces a voltage in the windings when the rotor turns, the back-EMF, proportional to speed through the back-EMF constant ke. In consistent SI units, kt and ke are the same number, because both measure the flux linkage between the magnets and the windings.

```figure
type: formula
title: Torque constant, heat and magnet temperature
formula: Torque T = kt × I; back-EMF E = ke × ω, with kt = ke in SI units
formula: kt(T) ≈ kt(20 °C) × [1 + α × (Tmagnet − 20)]
formula: Copper loss P = 3 × I² × R ∝ (T ÷ kt)²
caption: α is the magnets' reversible coefficient of remanence, about −0.11 %/°C for sintered NdFeB. The winding resistance R also rises with winding temperature, by about 0.39% per degree for copper, which adds to the heating.
- kt | torque constant, N·m/A
- I | current, A (RMS phase current in the usual convention)
- T | torque, N·m
```

Because torque needs current and current makes heat, a servo's continuous rating is a thermal limit: the RMS torque over the duty cycle, which sets the RMS current and so the average copper loss, must stay within the continuous torque rating. The peak torque, reached during acceleration, is limited separately, by the drive's current and by the magnets.

## The cross-seal jaw duty

This is an illustration. The bagger's cross-seal jaws close, seal and cut each bag. Their servo drives a cycle of acceleration, running, deceleration and a dwell in which the jaws are held closed against the seal with a holding torque. At 120 bags a minute, the cycle is 0.5 s.

The KEVOS® [motor duty cycle check](/tools/motor-duty-cycle-check/) sizes a motor for a repeated trapezoidal move: the acceleration, running, deceleration and dwell segments from the inertia at the motor, the top speed and the segment times; the segment torques including friction or load torque; the RMS torque over the cycle against the continuous rating; the peak torque against the peak rating; the inertia ratio; and the energy returned on each deceleration.

```figure
type: compare
title: The cross-seal servo at two line speeds, from the motor duty cycle check
cols: 120 bags a minute | 150 bags a minute
rowhead: Quantity
- Cycle: accelerate, run, decelerate, dwell | 0.10, 0.10, 0.10, 0.20 s | 0.08, 0.08, 0.08, 0.16 s
- Top speed for the same jaw travel | 1,500 rpm | 1,875 rpm
- Acceleration torque | 4.10 N·m | 5.95 N·m
- Peak torque, against 12 N·m | 4.10 N·m | 5.95 N·m
- * RMS torque, against 4.0 N·m continuous | 2.69 N·m, 67% | 3.68 N·m, 92%
- Inertia ratio | 2.5 | 2.5
- Energy returned per deceleration | 19.6 J | 34.2 J
caption: This is an illustration. Load inertia 0.0015 kg·m², motor inertia 0.0006 kg·m², friction torque 0.8 N·m while moving, holding torque 2.5 N·m during the dwell. Both rates pass the tool's checks; the faster one uses 92% of the continuous rating.
```

The dwell's holding torque dominates the RMS at both speeds: the jaws spend 40% of each cycle clamped, and that torque needs current the whole time. At 150 bags a minute the accelerations are sharper and the dwell shorter, and the RMS rises to 92% of the rating. On paper the motor is adequate. Whether it is adequate in the bagger depends on two things the tool's rating comparison does not include: the motor's real ambient temperature, and the state of its magnets.

## Hot magnets and the heating spiral

Servo makers state their continuous ratings for a stated ambient, often 40 °C, and for windings reaching their rated temperature at that load. The rotor magnets in a servo running at its continuous rating run hot, heated by the stator through the air gap and by eddy currents in the magnets themselves, and the maker's torque constant at rated load already reflects that, if the datasheet gives kt hot. Some datasheets give kt at 20 °C; the designer should check which.

If the magnets run hotter than the rating assumed, for example because the ambient is higher, kt falls. This is an illustration. At a magnet temperature of 100 °C rather than 20 °C, an NdFeB rotor's kt is about 1 − 0.0011 × 80 = 91.2% of its 20 °C value. The current for the same torque rises to 1 ÷ 0.912 = 109.6%, and the copper loss, proportional to current squared, to about 120%. That extra heat raises the winding and magnet temperatures further. The feedback is self-limiting in a healthy motor, but it eats the margin that the RMS calculation appears to show.

```figure
type: bars
title: Copper loss for the same torque, by rotor magnet temperature, relative to 20 °C
unit: %
max: 130
caption: This is an illustration. Torque constant falling at −0.11 %/°C with NdFeB magnets; copper loss proportional to the square of current. The rise in winding resistance with temperature adds further loss, not shown.
- 20 °C | 100.0
- 60 °C | 109.4
- * 100 °C | 120.2
- 120 °C | 126.2
```

The bagger's servos sit in an enclosure beside the fryer exhaust, where the plant measured air at up to 50 °C in summer. Servo makers publish derating curves for ambients above the rated one. A common approximation, when only the rating and the winding temperature limit are known, scales the continuous torque by the square root of the ratio of the allowable temperature rises. This is an illustration. For a winding limit of 140 °C, a rating at 40 °C ambient and a 50 °C ambient, the continuous torque becomes 4.0 × √((140 − 50) ÷ (140 − 40)) = 3.79 N·m. The 150 bags a minute duty, at 3.68 N·m, then uses 97% of the derated rating. The plant decided that was too little margin and fitted a cooling fan and a duct to the enclosure before raising the line speed.

## Energy returned to the drive

Each deceleration turns the moving parts' kinetic energy back into electrical energy: the motor acts as a generator, and the drive must absorb what comes back. The motor duty cycle check reports it per stop: 19.6 J at 120 bags a minute and 34.2 J at 150. At 150 bags a minute that is 34.2 × 150 ÷ 60 = 86 W returned on average, which the drive either passes to other axes on a shared DC bus or burns in a braking resistor. A braking resistor sized for the slower line can overheat at the faster one, so the drive's regeneration capacity belongs on the list of things to check when a line speed changes, beside the motor's RMS torque.

## Field weakening

At high speeds the back-EMF approaches the drive's available voltage, and the drive can no longer push the current needed for torque. Drives extend the speed range by field weakening: injecting a component of current whose field opposes the magnets', reducing the effective flux and so the back-EMF. That opposing field is exactly what Chapter 4 warned about. Field weakening is designed to stay within the magnets' safe limits at the motor's rated temperatures, but it is one more reason to respect the maker's speed and current limits, and to be wary of running a hot motor at the top of its speed range for long periods.

## Choosing a motor with margin

The plant's engineering standard asks for three margins when a servo is selected or its duty changed:

- **RMS torque** no more than about 80% of the continuous rating, derated for the real ambient, so that hot magnets, rising winding resistance and wear in the mechanism do not take the motor past its rating.
- **Peak torque** no more than about 70% of the peak rating, so that the drive's current limit is not reached in normal running and remains a protection rather than an operating point.
- **Regeneration** within the drive's and braking resistor's continuous and peak ratings at the new speed.

At 120 bags a minute the cross-seal servo met all three. At 150 it failed the first until the enclosure was cooled; even then it sits at 93%, above the standard's 80%, and the plant accepted that with a written exception and a plan to fit the next size of motor at the next major overhaul.

## Peak current and demagnetisation

Stator current produces a magnetic field of its own. Current in phase with the torque-producing direction mostly crosses the magnets sideways, but at high currents, and especially with any field-weakening current the drive applies at high speed, part of the stator's field opposes the magnets' magnetisation. Chapter 4 showed that an opposing field moves a magnet's working point down its curve, and that hot NdFeB has a lower knee. Servo makers therefore state a peak current, or a demagnetisation current, that the motor must never exceed, at its hottest rated temperature. The drive enforces it through its current limit.

The drive's current limit is therefore part of the magnets' protection, not only the motor's. A drive that can deliver more current than the motor's peak rating must be set to the motor's limit, which modern drives usually do automatically from the motor's electronic nameplate. A drive fitted to a motor without that data, or with its limits set by hand, may not.

## Checking the magnets: back-EMF

The simplest test of a servo's magnets is to measure its back-EMF. With the motor disconnected from its drive, turning it at a known speed produces an open-circuit line-to-line voltage proportional to speed and to the magnets' flux. Comparing that voltage with the motor's datasheet value of ke, corrected to the magnets' temperature, shows whether the magnets have lost strength.

This is an illustration. The cross-seal servo's datasheet gives a back-EMF constant of 60 V per 1,000 rpm at 20 °C. Spun at 1,000 rpm by a test rig with the motor at 25 °C, a healthy motor should give about 60 × (1 − 0.0011 × 5) = 59.7 V.

The test needs care. The motor must be disconnected from the drive, or the drive disabled in a way that leaves the motor's terminals open, because a spinning permanent-magnet motor generates voltage at its terminals whether or not anyone wants it to. At high speeds that voltage can be dangerous, and it is present whenever the motor is turned, including by hand or by a falling load. The plant's electricians do the test on the bench, with the motor driven by a test rig at a set speed.

## Magnets in the feedback

Many servo motors also carry a second set of magnets, in their position feedback. Magnetic encoders use a small diametrically magnetised magnet on the end of the shaft, read by a Hall-effect or magnetoresistive sensor, or a multipole magnetic ring read by a sensor head. They tolerate dust, oil and condensation better than optical encoders, which suits food plants. Their accuracy depends on the magnet's field at the sensor, so the gap between magnet and sensor, the magnet's temperature and stray fields from nearby magnets or current-carrying cables all matter. Chapter 9 applies the same thinking to proximity and position sensors.

## The error: a drive's current limit set too high

This is an illustration. When the cross-seal servo's drive failed, it was replaced with a larger drive from stores, the only one available. The technician entered the motor's parameters by hand from the old drive's records but left the peak current limit at the new drive's default, which was well above the motor's peak rating, so that the jaws would not trip on the first day.

Some weeks later, on a hot afternoon, product jammed in the jaws. The drive drove its full current into the motor for a few seconds, trying to close the jaws against the jam, before the jam fault stopped it. Afterwards the bagger ran, but the jaw servo's current at the same speed was noticeably higher, it began to trip on thermal overload at 150 bags a minute, and the seal leak tests showed weaker seals, because the jaws no longer reached their holding torque within the current limit.

A back-EMF test at 1,000 rpm, at 25 °C, gave 55.5 V against the expected 59.7 V: about 7% lower. The magnets had been partly demagnetised by the jam's current while hot. The motor was replaced, the drive's peak current limit set to the motor's rating, and the plant's drive replacement procedure changed to load the motor's limits from its data, not leave defaults, with a second person checking the current limit before the axis is restarted.

## Exercise: cooler air

This is an illustration. With the cooling fan fitted, the enclosure air stays below 42 °C.

1. Using the same approximation, what is the derated continuous torque at 42 °C?
2. What share of it does the 150 bags a minute duty use?
3. If the motor's magnets had been partly demagnetised, losing 7% of kt, how much more copper loss would the same duty cause?

**Worked answer.**

1. 4.0 × √((140 − 42) ÷ (140 − 40)) = 4.0 × √0.98 = **3.96 N·m**.
2. 3.68 ÷ 3.96 = **93%**.
3. Current rises by 1 ÷ 0.93 = 1.075, so copper loss rises by 1.075² = **about 16%**, enough to use up most of the margin the cooling fan bought. A partly demagnetised servo is therefore not a motor that works slightly less well; it is a motor that runs hotter at every load, and it should be replaced rather than kept running.
