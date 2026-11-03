---
book: vibration-monitoring-by-the-numbers
chapterSlug: displacement-velocity-and-acceleration
order: 2
title: "Displacement, velocity and acceleration"
description: "The three ways to express vibration and converting between them, RMS, peak and peak-to-peak, overall levels, which unit suits which faults, and a peak reading compared with an RMS alarm."
draft: false
---

Vibration is motion, and motion can be described by how far a point moves, how fast it moves or how quickly its speed changes. Each description, displacement, velocity or acceleration, emphasises a different part of the frequency range, and each is quoted in several ways: as a peak value, a peak-to-peak value or a root-mean-square value. Two readings of the same vibration can therefore differ by a factor of three or a factor of a hundred while both are correct. Before a level can be compared with an alarm, a standard or last month's reading, its quantity and its form must match.

This chapter sets out the three quantities and how they are related for a vibration at a single frequency, explains RMS, peak and peak-to-peak and the factors between them, shows how separate components combine into an overall level, explains which quantity suits which faults, and finishes with a contractor's report quoted in peak values that put a healthy fan into the alarm zone.

## Three descriptions of the same motion

Take a point on F-2's fan bearing housing moving back and forth at a single frequency f, the fan's running speed of 24.67 Hz. Its displacement swings between two extremes; its velocity is greatest as it passes through the middle and zero at the extremes; its acceleration is greatest at the extremes, where the motion reverses, and zero in the middle. For a sinusoid the three are tied together by the angular frequency ω = 2πf: each time derivative multiplies the amplitude by ω.

```figure
type: formula
title: Relations between displacement, velocity and acceleration for a single frequency
formula: v = ω × d        a = ω × v = ω² × d        ω = 2π f
formula: d = v ÷ (2π f)        a = 2π f × v
caption: d, v and a are amplitudes of displacement, velocity and acceleration expressed the same way, all peak or all RMS. The relations hold for one frequency at a time; a signal with many frequencies must be converted line by line in its spectrum.
- d | displacement, m or µm
- v | velocity, m/s or mm/s
- a | acceleration, m/s² or g, where 1 g = 9.80665 m/s²
- f | frequency, Hz
```

The factor ω is the key to everything that follows. At low frequencies it is small, so a given velocity corresponds to a large displacement and a small acceleration; at high frequencies it is large, so the same velocity corresponds to a tiny displacement and a large acceleration. The three quantities weight the spectrum differently, and that decides which is best for which job.

### F-2 at its running speed

F-2's vibration at 1× is 4.5 mm/s RMS. At 24.67 Hz, ω = 155.0 rad/s, so its RMS acceleration is 0.0045 × 155.0 = 0.697 m/s², or 0.071 g, and its RMS displacement is 0.0045 ÷ 155.0 = 29.0 µm, which is 82.1 µm peak-to-peak.

A spalled bearing on the same machine might produce 1.2 mm/s RMS at about 1,000 Hz, a typical frequency for the ringing that a bearing defect excites. That is a quarter of the 1× velocity, but its acceleration is 0.0012 × 2π × 1,000 = 7.54 m/s², or 0.77 g, more than ten times the 1× acceleration, and its displacement is only 0.19 µm, far too small to see in a displacement measurement.

```figure
type: compare
title: Two components of F-2's vibration in three units
cols: Frequency | Velocity, RMS | Acceleration, RMS | Displacement, RMS
rowhead: Component
- Unbalance at 1× | 24.67 Hz | 4.5 mm/s | 0.70 m/s², 0.071 g | 29.0 µm
- Bearing defect ringing | about 1,000 Hz | 1.2 mm/s | 7.54 m/s², 0.77 g | 0.19 µm
caption: This is an illustration. The same two components rank in opposite orders in acceleration and displacement; velocity weights them more evenly, which is why it is the usual measure of overall machine vibration.
```

## Which quantity for which faults

**Displacement** emphasises low frequencies. It is the natural measure for slow machines, for shaft motion inside fluid-film bearings measured by non-contact probes, and for clearances: a shaft that moves 100 µm in a bearing with 150 µm clearance is close to rubbing. It is nearly blind to bearing defects and gear mesh.

**Velocity** weights frequencies more evenly across the range where most machine faults appear, roughly 10 to 1,000 Hz. It is also related directly to the energy in the vibration and to the fatigue stresses it causes, which is why severity standards for general machinery, such as the ISO 20816 series, use broadband RMS velocity. Velocity is the default for route measurements of overall level.

**Acceleration** emphasises high frequencies. It is the measure for rolling bearing defects in their early stages, gear mesh problems, cavitation and other events that produce short impacts and high-frequency ringing. It also reflects the forces involved, since force is mass times acceleration.

```figure
type: bars
title: Where each quantity is most useful, by frequency
unit: Hz, upper end of the usual range
max: 10000
caption: Typical guidance, not hard limits. Velocity's range covers unbalance, misalignment, looseness and most resonances; acceleration's covers bearing and gear defects.
- Displacement, slow machines and shaft motion | 10
- Velocity, general machine condition | 1000
- * Acceleration, bearings, gears, impacts | 10000
```

## RMS, peak and peak-to-peak

A vibration's amplitude can be quoted in three ways. The peak is the largest value the signal reaches from zero; peak-to-peak is the distance between the largest positive and largest negative values; the root-mean-square, RMS, is the square root of the average of the squared signal, which measures its energy. For a pure sinusoid they are fixed multiples of each other.

```figure
type: formula
title: Amplitude forms of a pure sinusoid
formula: Peak = √2 × RMS = 1.414 × RMS
formula: Peak-to-peak = 2 × Peak = 2.828 × RMS
caption: These factors hold only for a pure sine wave. For real signals with several components or impacts, the peak is larger than √2 × RMS, and the ratio of peak to RMS, the crest factor, is itself a useful indicator of impacting faults.
- RMS | root-mean-square, related to energy
- Peak | largest excursion from zero
```

Conventions vary by country, industry and instrument. Velocity in Australian and international practice is usually RMS, in mm/s. Displacement is usually peak-to-peak, in µm. Acceleration may be RMS or peak, in m/s² or g. Some instruments made for the American market default to peak velocity in inches per second. Every reading should carry its form, and every comparison should check that the forms match.

### Crest factor

For a sine wave the crest factor, peak divided by RMS, is 1.414. Smooth vibration from unbalance or misalignment stays close to that. Early bearing defects produce short, sharp impacts as balls strike a spall, which raise the peak much more than the RMS, so the crest factor of the acceleration signal rises, often to 5 or more, before the RMS level changes much. Later, as damage spreads, the RMS rises and the crest factor falls back. A rising crest factor is therefore an early warning, and a falling one in a machine with rising RMS is a sign of advanced damage, a pattern Chapter 8 uses.

## Combining components into an overall level

An overall level, the single number most route readings start with, is the RMS of the whole signal across a frequency band. Because RMS measures energy, and energies at different frequencies add, the overall RMS is the square root of the sum of the squares of the individual components' RMS values.

If F-2's spectrum contains 4.5 mm/s at 1×, 1.5 mm/s at 2× and 0.8 mm/s at the bearing's outer-race frequency, its overall velocity is √(4.5² + 1.5² + 0.8²) = 4.81 mm/s RMS. The 1× component dominates: removing the two smaller ones would lower the overall level only from 4.81 to 4.5 mm/s. That is why an overall level is a good indicator of the largest problem and a poor indicator of a small new one. A bearing defect that doubles from 0.8 to 1.6 mm/s raises F-2's overall level by only 0.2 mm/s, a change easily lost in normal scatter. Spectra, and acceleration measurements focused on high frequencies, are needed to see it.

## Shaft vibration and housing vibration

Everything so far describes vibration measured on a bearing housing, which is what a route technician can reach. Large machines with fluid-film bearings, such as turbines, big compressors and some large fans, are also monitored by non-contact displacement probes that measure the shaft's motion relative to its bearing. In those bearings the shaft floats on an oil film, and much of its motion is absorbed by the film and never reaches the housing, so housing measurements understate what the shaft is doing. Shaft displacement, usually quoted peak-to-peak in micrometres, can be compared directly with the bearing's clearance. None of the mill's machines has fluid-film bearings, so its route uses housing measurements throughout, but the distinction matters when guidance written for one kind of measurement is applied to the other.

## Three directions at every bearing

Vibration is measured in three directions at each bearing: horizontal and vertical, both radial, and axial, along the shaft. They are not interchangeable. Most machines are stiffer vertically than horizontally, because they sit on their feet, so the same rotating force usually produces more horizontal vibration. Unbalance acts radially and shows similarly in both radial directions on a symmetrical machine; misalignment and bent shafts push and pull along the shaft and show strongly in the axial direction; a soft or cracked foot shows in one radial direction more than the other. Comparing the three directions is one of the simplest and most powerful diagnostic steps, and every route point at the mill records all three on the fan and motor bearings, and two on the smaller machines.

Each direction is measured at the same marked spot every time. A sensor moved 30 mm along a housing, or onto a cover plate instead of the bearing housing itself, can change the reading by as much as a real fault would, because housings flex and cover plates resonate. The mill's route points are marked with small steel pads, glued to the housing over the bearing, which give the sensor a flat, repeatable seat.

## Getting from acceleration to velocity

Most vibration sensors, as Chapter 3 explains, measure acceleration. Velocity is obtained by integrating the acceleration signal, either electronically in the instrument or digitally on the spectrum, by dividing each line by 2πf. Integration divides by frequency, so it amplifies anything at very low frequencies, including sensor drift and electronic noise, which in the spectrum appears as a rising ramp towards zero hertz, often called a ski slope. Instruments apply a high-pass filter before integrating, typically at a few hertz, and the overall velocity is quoted over a defined band, for example 10 to 1,000 Hz. A velocity reading without its band is incomplete; the same signal can give different overall levels over different bands. On a slow machine, where the running speed itself is only a few hertz, a 10 Hz lower limit would cut out the very component that matters, so slow machines need a lower band edge, a sensor rated for low frequencies, or displacement measured directly. The chipper, at 500 r/min, about 8.3 Hz, is measured over 2 to 1,000 Hz for exactly that reason.

## Units in severity guidance

Severity guidance for general machinery, such as the ISO 20816 series, is framed in broadband RMS velocity over a defined frequency band, with separate criteria for machines of different size and support stiffness, and sometimes broadband displacement for slow machines. Machine makers' acceptance limits may be in any of the units above, and older guidance from the United States is often in peak velocity in inches per second. Before a reading is compared with any criterion, the reading and the criterion must be put in the same quantity, form, band and units. Chapter 4 explains why the mill relies less on fixed criteria than on each machine's own baseline, but the rule about units applies to both.

## The mistake: a peak reading against an RMS alarm

During a week when the mill's own technician was on leave, a contractor took the route readings with his own instrument. His report showed F-2 at 6.4 mm/s, against the mill's alert level of 5.6 mm/s for that fan, and recommended balancing at the next shutdown. The reliability engineer, looking at the trend, saw F-2 jump from 4.5 mm/s two weeks earlier to 6.4 mm/s, with no change in its spectrum shape.

```figure
type: steps
title: Matching the contractor's reading to the mill's units
caption: This is an illustration. A 41% jump with an unchanged spectrum shape is the signature of a change of units, not of the machine.
- Contractor's reading | 6.4 mm/s on F-2 against an alert at 5.6 mm/s
- Mill's last reading | 4.5 mm/s RMS, two weeks earlier
- Ratio | 6.4 ÷ 4.5 = 1.42, almost exactly √2
- Contractor's instrument settings | velocity in peak, not RMS
- * Converted | 6.4 ÷ 1.414 = 4.5 mm/s RMS: no change
- Procedure changed | route instructions state velocity RMS, 10 to 1,000 Hz; any outside reading converted before trending
```

The ratio of the two readings, 1.42, was almost exactly √2, and the spectrum's shape was unchanged, which pointed to units rather than the machine. The contractor's instrument was set to report velocity as peak, its factory default. Converted, 6.4 ÷ 1.414 = 4.5 mm/s RMS, the same as before. The balancing job, which would have cost a shutdown and a contractor's day for no benefit, was cancelled, and the mill's route instructions now state the quantity, form and band of every measurement, with a requirement that readings from any other instrument be converted and checked against the last reading before they enter the trend.

## Exercise: one vibration, six numbers

A reading on P-4's motor shows a single dominant component of 2.8 mm/s RMS at 2× running speed, 49.33 Hz. Calculate its peak and peak-to-peak velocity, its RMS and peak acceleration in m/s² and g, and its RMS and peak-to-peak displacement in µm. Then say which of these numbers a severity guideline based on broadband velocity would use.

### Answer

**Given:** v = 2.8 mm/s RMS; f = 49.33 Hz.

**Assumptions:** a pure sinusoid, so the √2 factors apply.

**Method:** ω = 2πf; peak = √2 × RMS; a = ω v; d = v ÷ ω.

**Angular frequency:** ω = 2π × 49.33 = 310.0 rad/s.

**Velocity:** peak = 2.8 × 1.414 = 3.96 mm/s; peak-to-peak = 7.92 mm/s.

**Acceleration:** RMS = 0.0028 × 310.0 = 0.868 m/s², or 0.0885 g; peak = 1.227 m/s², or 0.125 g.

**Displacement:** RMS = 0.0028 ÷ 310.0 = 9.03 µm; peak-to-peak = 9.03 × 2.828 = 25.5 µm.

**For severity:** the guideline uses the broadband RMS velocity, which for a single dominant component is about 2.8 mm/s; any other components add to it by root-sum-square.

**Verification:** acceleration ÷ displacement = ω² = 310.0² = 96,100 s⁻², and 0.868 ÷ 9.03 × 10⁻⁶ = 96,100, so the conversions are consistent.
