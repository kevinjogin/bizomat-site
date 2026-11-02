---
book: flow-measurement-by-the-numbers
chapterSlug: ultrasonic-transit-time-meters
order: 6
title: "Ultrasonic transit-time meters"
description: "How sound travelling with and against the flow measures velocity, nanosecond time differences, path geometry and profile factors, clamp-on pipe data, and a glycol audit that read 5% high."
draft: false
---

Sound travels faster with a current than against it. An ultrasonic transit-time meter sends pulses of sound diagonally across a pipe, alternately downstream and upstream, and times them. The difference between the two travel times is proportional to the fluid's velocity along the path. In-line versions have their transducers built into a spool; clamp-on versions are strapped to the outside of an existing pipe and measure through its wall, which lets a technician audit a flow in an hour without cutting a pipe or stopping a process. The brewery's FT-501 is a clamp-on meter used exactly that way.

This chapter derives the transit-time relation, works out the tiny time difference in the glycol loop, explains why the path geometry and the velocity profile set the accuracy, describes what a clamp-on meter needs to know about the pipe, and finishes with a glycol audit that read 5% high because the pipe's wall was thicker than its nominal size implied.

## Timing sound with and against the flow

A pulse sent from transducer A, upstream, to transducer B, downstream, along a path of length L at an angle φ to the pipe's axis, travels at the speed of sound in the fluid plus the component of the fluid's velocity along the path. A pulse from B to A travels at the speed of sound minus that component. The two travel times differ.

```figure
type: formula
title: Transit times with and against the flow
formula: t_down = L ÷ (c + v cos φ)        t_up = L ÷ (c − v cos φ)
formula: Δt = t_up − t_down ≈ 2 L v cos φ ÷ c²
formula: Exactly: v = L ÷ (2 cos φ) × (1 ÷ t_down − 1 ÷ t_up)
caption: c is the speed of sound in the fluid, v the average velocity along the path and φ the path's angle to the axis. The exact form uses both measured times and does not need c, which is why meters use it: the speed of sound changes with temperature and composition.
- L | acoustic path length in the fluid, m
- φ | angle between path and pipe axis
- Δt | difference between upstream and downstream times
```

The exact form is the key to the method's practicality. The speed of sound in a liquid changes with its temperature and composition, by a few metres per second per kelvin in water, and a meter that needed it entered would drift with every change. By using the reciprocals of both measured times, the meter eliminates c entirely; it needs only the path's length and angle, which come from the geometry.

## How small the time difference is

FT-501 audits the glycol loop, which carries 40 m³/h of a 30% propylene glycol solution at about −2 °C through DN100 schedule 80 steel pipe with a 97.2 mm bore. The mean velocity is 1.497 m/s. The meter is mounted in V-mode, with both transducers on the same side of the pipe and the sound reflecting off the far wall, so the path crosses the bore twice, at 65° to the axis: a total path length in the liquid of 2 × 0.0972 ÷ sin 65° = 0.2145 m.

Taking the glycol's speed of sound as about 1,650 m/s, the sound takes about 130 µs to cross the path. The velocity along the path is the mean velocity divided by the profile factor, which for the glycol's Reynolds number of about 25,000 is about 0.930, giving 1.610 m/s. The time difference is then 2 × 0.2145 × 1.610 × cos 65° ÷ 1,650² = 107 ns.

```figure
type: stats
title: FT-501's measurement on the glycol loop
caption: This is an illustration. Glycol: about 1,035 kg/m³, kinematic viscosity about 5.8 mm²/s, speed of sound about 1,650 m/s at −2 °C, all typical values.
- 40 m³/h | true flow in the 97.2 mm bore
- 1.497 m/s | mean velocity; Reynolds number about 25,000
- 0.2145 m | acoustic path in V-mode at 65° to the axis
- 130 µs | travel time across the path
- 107 ns | difference between upstream and downstream times
```

A difference of about a ten-thousandth of a millisecond in a travel time of 130 µs is less than a thousandth of the travel time. Modern meters resolve time differences to well under a nanosecond by correlating whole received waveforms rather than timing single edges, and average many pulses a second. Even so, the result depends on the electronics treating the upstream and downstream pulses identically, which is why the zero matters, as a later section explains. The measurement is demanding but routine.

## The profile factor again

A single path, like FT-501's, senses the average velocity along a line across the pipe, not over its area. Chapter 2 showed that the ratio between the two, the profile factor, depends on the profile's shape and so on the Reynolds number. For a power-law exponent of 6.6, about right at a Reynolds number of 25,000, it is 0.930; for an exponent of 7, which a meter might assume for water at higher Reynolds numbers, it is 0.933. Using the wrong one costs 0.4% in this case. Meters correct their profile factor from a Reynolds number they calculate from the velocity, the bore and a viscosity that must be entered for the fluid. A meter told the fluid is water at 20 °C, when it is glycol at −2 °C with five times the viscosity, uses a Reynolds number five times too high and the wrong factor.

The [liquid pipe velocity and Reynolds number tool](/tools/pipe-flow/) is a quick check of the Reynolds number the meter should be using. Entering the glycol loop's 97.2 mm bore, its 40 m³/h as 666.7 L/min and a kinematic viscosity of 5.8 mm²/s gives a mean velocity of 1.497 m/s and a Reynolds number of about 25,100, turbulent but well below the 100,000 and more of the brewery's water lines. If the glycol were allowed to cool further, or the pump slowed, the Reynolds number would fall towards the transition region, where the profile factor changes quickly and a single-path meter's accuracy is at its worst.

The profile factor also assumes a fully developed, symmetrical profile. Clamp-on meters are therefore sensitive to installation, and their makers' straight-run requirements are usually longer than a magnetic meter's. Multi-path in-line meters, with four or more paths at different positions across the bore, sample the profile and can correct for much of its shape, which is why they are used for custody transfer of oil and gas.

## What a clamp-on meter needs to know

A clamp-on meter cannot see inside the pipe. It is told the pipe's outside diameter, wall thickness and material, any lining, and the fluid. From these it works out the inside bore, the angle at which sound refracts through the wall into the liquid, the path length, and the spacing at which the transducers must be mounted for the reflected beam to reach the second transducer. Every one of those numbers depends on the bore.

```figure
type: checklist
title: What FT-501 must be told before each audit
caption: The open item is this chapter's mistake: nominal size is not wall thickness.
- x Outside diameter, measured | DN100 steel: 114.3 mm
- ? Wall thickness, measured | schedule 40 is 6.02 mm, schedule 80 is 8.56 mm
- x Pipe material and any lining | carbon steel, unlined
- x Fluid and temperature | 30% propylene glycol at about −2 °C
- x Viscosity | for the Reynolds number and profile factor
- x Mounting mode and spacing | V-mode, at the spacing the meter calculates
- x Straight runs | at least the maker's requirement upstream of the transducers
```

## The mistake: a thicker wall

On the first glycol audit, the technician entered the pipe as DN100 schedule 40, the brewery's usual pipe, with a 6.02 mm wall and a 102.3 mm bore. FT-501 read 42.1 m³/h, 5% more than the glycol pump's curve and its measured head suggested. The refrigeration contractor, who had installed the loop, remembered using heavier pipe for the buried section, which the audit point turned out to be on.

```figure
type: steps
title: Finding the thicker wall
caption: This is an illustration. The meter's velocity scales inversely with the bore it is told, and its flow with the bore squared, so its flow error is in proportion to the bore it was given.
- Reading | 42.1 m³/h with schedule 40 entered; pump curve suggested about 40 m³/h
- Wall measured with an ultrasonic thickness gauge | 8.6 mm: schedule 80, bore 97.2 mm
- Effect of the wrong bore | path and velocity scale as 1 ÷ D, area as D²: flow scales as D
- * Error | 102.3 ÷ 97.2 = 1.052, 5.2% high
- Re-entered as schedule 80 | 40.0 m³/h, consistent with the pump
- Procedure changed | wall thickness measured at every clamp-on position before the meter is set up
```

The wall was measured with an ultrasonic thickness gauge, the instrument of Ultrasonic Testing by the Numbers, at four points around the pipe, and read 8.6 mm: schedule 80, with a bore of 97.2 mm. With the wrong bore, the meter had assumed a path 5.2% longer than the real one, so it underestimated the velocity in that proportion, and an area 10.7% larger, so it overestimated the flow by the net 5.2%. Re-entered with the measured wall, the meter read 40.0 m³/h. The brewery's audit procedure now requires the wall thickness to be measured, not assumed, at every clamp-on position, and the measured figures to be recorded with the audit. The outside diameter is checked too, with a circumference tape, because an old pipe can be out of round or carry thick paint, and the circumference divided by π gives the mean diameter directly. The 5% error had been plausible enough to be believed: it was the pump curve, an independent estimate of the flow, that made the engineer look for a cause. A clamp-on audit should always be compared with at least one independent estimate, a pump curve, a heat balance or another meter, before its number is used.

## In-line or clamp-on

In-line ultrasonic meters have their transducers set into a spool piece at a known geometry, calibrated together in the factory, often with several paths. They are as accurate as good magnetic meters and, unlike them, work with non-conducting liquids such as oils and deionised water, and with gases. Clamp-on meters trade accuracy for convenience: their geometry depends on the pipe data entered and the care taken in mounting, and their uncertainty is typically a few per cent in the field, against a fraction of a per cent for an in-line meter. For an audit, a check on another meter or a temporary measurement, a few per cent is often enough, and the ability to measure without breaking into the pipe is decisive. For a permanent meter whose readings will be trusted for years, the brewery uses in-line meters, and keeps FT-501 for the audits and cross-checks it does well.

## Zero and low flows

With no flow, the upstream and downstream times should be identical, but small asymmetries in the transducers, the cables and the electronics leave a residual time difference, the zero offset. For FT-501 on the glycol loop, an offset of 0.5 ns would be 0.5% of the 107 ns difference at 40 m³/h, but 5% at 4 m³/h. Like the Coriolis meter's, the zero is best checked with the flow positively stopped and the fluid at its working temperature, and on a clamp-on meter it is checked at each new mounting, because re-mounting changes the acoustic coupling. The brewery cannot stop the glycol loop during the season, so FT-501's zero is checked on the bench on a closed, water-filled test pipe before each audit.

## Fluids that defeat the method

Transit-time meters need sound to cross the pipe. Large bubbles or solids scatter it and can stop the measurement; a liner that is not bonded to the wall reflects the sound before it reaches the liquid; heavy scale on the inside wall attenuates it and changes the bore. The glycol loop is clean and bubble-free when properly filled and vented. Where liquids carry bubbles or solids, ultrasonic Doppler meters, which measure the frequency shift of sound reflected from moving particles, are an alternative, though their accuracy depends on the particles moving at the same speed as the liquid and being spread evenly through it.

## Gas meters by transit time

The same principle measures gases, where the speed of sound is lower, about 343 m/s in air at 20 °C, and the time differences correspondingly larger for the same velocity. Multi-path ultrasonic meters are widely used for natural gas custody transfer. Clamp-on measurement of gas is much harder, because so little sound passes from a steel wall into a gas, a direct consequence of the impedance mismatch that Ultrasonic Testing by the Numbers explains for steel and air.

## Exercise: an audit on the wort cooler's water

The brewery wants to audit the cooling water to its wort cooler with FT-501. The line is DN65 copper with an outside diameter of 66.7 mm and a wall of 1.6 mm, carrying water at 15 °C, kinematic viscosity 1.14 mm²/s, at about 10 m³/h. Calculate the bore, the mean velocity, the Reynolds number and, for a single V-mode path at 65° to the axis and a speed of sound of 1,465 m/s, the path length and the time difference, using a profile factor of 0.933. Then calculate the flow the meter would report if the wall were wrongly entered as 2.0 mm.

### Answer

**Given:** OD 66.7 mm; wall 1.6 mm; Q = 10 m³/h; ν = 1.14 × 10⁻⁶ m²/s; c = 1,465 m/s; φ = 65°; k = 0.933; wrong wall 2.0 mm.

**Assumptions:** fully developed profile; V-mode; flow scales with the entered bore as in this chapter's mistake.

**Bore:** 66.7 − 2 × 1.6 = 63.5 mm. **Area:** π × 0.0635² ÷ 4 = 3.167 × 10⁻³ m².

**Mean velocity:** (10 ÷ 3,600) ÷ 3.167 × 10⁻³ = 0.877 m/s. **Reynolds number:** 0.877 × 0.0635 ÷ 1.14 × 10⁻⁶ = 48,900.

**Path length:** 2 × 0.0635 ÷ sin 65° = 0.1401 m. **Path velocity:** 0.877 ÷ 0.933 = 0.940 m/s.

**Time difference:** 2 × 0.1401 × 0.940 × cos 65° ÷ 1,465² = 2 × 0.1401 × 0.940 × 0.4226 ÷ 2,146,225 = 51.9 ns.

**Wrong wall:** entered bore 66.7 − 4.0 = 62.7 mm; the reported flow scales with the entered bore: 10 × 62.7 ÷ 63.5 = 9.87 m³/h, 1.3% low.

**Interpretation:** a wall error of 0.4 mm on a thin copper pipe costs 1.3%, a quarter of the steel pipe's error, because it is a smaller fraction of the bore. On thin-walled pipe the outside diameter's accuracy matters as much as the wall's, and both should be measured.

**Verification:** the time difference scales with path length and velocity: compared with the glycol loop's 107 ns, the path is 0.65 times as long, the path velocity 0.58 times, and c² is 0.79 times as large, giving 107 × 0.65 × 0.58 ÷ 0.79 = 51 ns, matching.
