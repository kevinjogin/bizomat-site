---
book: viscosity-by-the-numbers
chapterSlug: measuring-viscosity
order: 6
title: "Measuring viscosity"
description: "How capillary, rotational and falling-ball viscometers work, why temperature control dominates accuracy, how to correct a reading to 40 °C, and how to read a viscosity on an oil report."
draft: false
---

Every viscosity in this book so far has come from a data sheet. A data sheet describes a new oil from a production batch, measured by its maker. The oil in a machine is a particular sample, of a particular age, possibly mixed or contaminated, and the only way to know its viscosity is to measure it. Measurement is also how an engineer checks a delivery before it goes into a machine, and how a laboratory's report should be read.

This chapter explains the three families of viscometer an engineer meets, the glass capillary that oil laboratories use, the rotational instruments used for greases, thick fluids and field checks, and the falling ball, and shows the physics each relies on. It shows why temperature control dominates every measurement, how to bring a reading at the wrong temperature back to 40 °C, and how to read the viscosity line on an oil analysis report. It ends with a field reading that was compared with the specification at the wrong temperature and in the wrong kind of viscosity.

## The glass capillary viscometer

The standard laboratory method for oils, ASTM D445 and its equivalents, times how long a fixed volume of oil takes to flow under its own weight through a calibrated glass capillary held in a temperature-controlled bath. The physics is the Hagen–Poiseuille law of Chapter 7 applied to a vertical tube: the driving pressure is the weight of the oil column, ρgh, so the flow rate is proportional to ρ ÷ μ, and the time for a fixed volume is proportional to μ ÷ ρ, the kinematic viscosity.

```figure
type: formula
title: The capillary viscometer measures kinematic viscosity
formula: ν = C × t
formula: C = π g h r⁴ ÷ (8 L V)
caption: C is the tube's calibration constant, fixed by its geometry and found by calibration with reference oils. Small corrections for the oil's kinetic energy are needed only for short flow times.
- ν | kinematic viscosity, mm²/s
- t | flow time between two marks, s
- C | tube constant, mm²/s per second
- h, r, L, V | mean head, capillary radius and length, timed volume
```

The capillary radius enters to the fourth power, so a tube suits only a limited range of viscosities, and laboratories keep sets of tubes of different bore. A tube is chosen so that the flow time is long enough to time precisely, usually a few hundred seconds.

This is an illustration. A tube with a constant of 0.1 mm²/s per second would time HPU-40's new oil at 40 °C at 46.0 ÷ 0.1 = 460 seconds. A stopwatch error of half a second would change the result by about 0.1%. The bath temperature is a far larger risk: at 40 °C the oil's viscosity changes by 4.6% per kelvin, as Chapter 3 found, so a bath only 0.1 K low reads 0.46% high and a bath 0.02 K low reads 0.09% high. That is why the method controls the bath to a few hundredths of a kelvin and checks it with a calibrated thermometer, and why a laboratory's thermometer calibration is the first thing to ask about if its results drift.

Glass capillaries are not suited to opaque, very thick or non-Newtonian fluids. For dark used oils, laboratories use reverse-flow tubes in which the meniscus can be seen, and many modern laboratories use automated capillary instruments that time the flow optically. They all measure the same quantity: kinematic viscosity at a stated temperature.

## Rotational viscometers

A rotational viscometer shears the fluid between a rotating and a stationary surface and measures the torque. In the coaxial cylinder form, a cylinder turns inside a cup; in the cone-and-plate form, a shallow cone turns on a flat plate, which gives the same shear rate everywhere in the sample. The torque gives the shear stress and the speed and geometry give the shear rate, so the instrument measures dynamic viscosity directly, and can measure it at a chosen shear rate.

This is an illustration. A cone of 1° angle turning at 60 rpm shears the sample at the angular speed divided by the cone angle in radians, 2π ÷ (π ÷ 180) = 360 per second. Changing the speed changes the shear rate in proportion, which is how rotational instruments map the shear-thinning of the greases and polymer-thickened oils of Chapter 5.

```figure
type: compare
title: Three viscometer families
cols: Measures | Best for | Watch for
rowhead: Type
- Glass capillary, gravity flow | Kinematic viscosity | Oils, the laboratory reference method | Bath temperature; tube choice; dirty or opaque samples
- Rotational, cylinder or cone and plate | Dynamic viscosity at a set shear rate | Greases, thick and non-Newtonian fluids, field checks | Sample temperature; spindle choice; range of the instrument
- Falling ball | Dynamic viscosity | Clear fluids, simple checks | Wall effects; Reynolds number must stay low
caption: Results from different families can be compared only after converting to the same kind of viscosity at the same temperature.
```

Portable rotational viscometers are common in maintenance shops because they need no bath and give a reading in a minute. Their readings are only as good as the sample's temperature, which in a field instrument is usually whatever the oil happens to be.

## The falling ball

A ball falling slowly through a fluid reaches a speed at which its weight, less buoyancy, equals Stokes' drag of Chapter 2, 6πμaU. Timing the ball over a measured distance gives the dynamic viscosity. The method is simple and old, but it holds only if the flow around the ball is slow enough to be dominated by viscosity, which means a ball Reynolds number well below one, and only if the tube is wide enough that the walls do not slow the ball.

This is an illustration. A glass ball 1 mm in diameter, of density 2,500 kg/m³, in HPU-40's oil at 40 °C falls at 2/9 × (2,500 − 854.8) × 9.81 × (0.5 × 10⁻³)² ÷ 0.03932 = 22.8 mm/s, taking 4.4 seconds to fall 100 mm. Its Reynolds number, 854.8 × 0.0228 × 0.001 ÷ 0.03932, is 0.50, at the upper edge of the Stokes range. A steel ball of the same size would fall more than four times faster, at a Reynolds number of 2.1, and Stokes' law would understate its drag and so overstate the oil's viscosity. Commercial falling-ball viscometers deal with this by using calibrated balls and tubes and reporting a viscosity from the instrument's constants rather than from Stokes' law directly.

## Temperature is the measurement

The most important lesson of this chapter is that a viscosity measurement is a temperature measurement in disguise. At 40 °C, HPU-40's oil changes by 4.6% per kelvin; at 20 °C by 6.2%. No viscometer can do better than its sample's temperature.

```figure
type: checklist
title: Getting a viscosity measurement right
caption: The same rules apply whether the instrument is a laboratory capillary or a portable rotational meter.
- Measure at a standard temperature | 40 °C for comparison with grades and data sheets; 100 °C as well for polymer-thickened oils
- Let the sample reach temperature | A sample straight from a cold store or a hot machine takes time to settle in a bath or cup
- Record the temperature with the result | A viscosity without its temperature cannot be compared with anything
- Use a representative, clean sample | Taken from a live line or the middle of the reservoir, not from a drain or a dead leg
- x Compare dynamic with kinematic | Convert with the density at the same temperature first
- ? Ask which method and instrument | A laboratory report should state the test method
```

## Correcting a reading to 40 °C

Field readings are often taken at whatever temperature the sample has. If the oil's data sheet is known, the reading can be brought to 40 °C using the Walther relation with the new oil's slope B, on the assumption that ageing has changed the oil's viscosity level more than its temperature sensitivity. That assumption is reasonable for a plain mineral oil over moderate changes, and less so for a polymer-thickened oil that has sheared.

```figure
type: steps
title: Correcting a field reading to 40 °C using the oil's Walther slope
caption: Uses the slope B = 3.68444 fitted to the new oil in Chapter 3. Convert a dynamic reading to kinematic first, with the density at the measurement temperature.
- Convert to kinematic | ν = μ ÷ ρ at the measured temperature
- Keep the new oil's slope | B from the data sheet's two values
- Find the sample's intercept | A = log log (ν + 0.7) + B × log T
- * Evaluate at 40 °C | ν₄₀ = 10^(10^(A − B × log 313.15)) − 0.7
```

The correction should be reported as an estimate and marked as such. For any decision that matters, such as rejecting a delivery or changing an oil, the sample goes to a laboratory for a measurement at 40 °C.

## Taking a sample worth measuring

A laboratory measures the sample it is sent, and a careless sample can make a good oil look bad or hide a real change. Viscosity is less sensitive to sampling than particle counts, but it is still affected by where and when the sample is drawn.

The oil in a working machine is not uniform. Oil in a dead leg, such as a little-used branch line or the bottom of an idle cylinder, may be older and more oxidised than the circulating oil. Oil near the reservoir's floor may hold settled water and sludge; Chapter 2 showed that fine particles and droplets take hours to settle, so they accumulate there during shutdowns. A top-up poured in that morning may not yet have mixed. The best sample is drawn from a live, turbulent part of the circuit, usually a sampling valve fitted in the return line ahead of the filter or in the pressure line, with the machine running at normal temperature and after the valve has been flushed.

This is an illustration. The press shop fitted a sampling valve to HPU-40's return line, upstream of the return filter. Its procedure is to sample with the press cycling at its normal 50 °C, to flush at least half a litre through the valve into a waste container first, and to fill a clean, labelled bottle to about three quarters, leaving room for the laboratory to shake it. The label records the machine, the date, the hours since the last oil change, the oil product, any top-up since the last sample and the oil temperature. The same valve and the same procedure are used every time, so that a change in the results reflects a change in the oil and not in the sampling.

## Reading an oil report

An oil analysis report from a commercial laboratory usually gives the kinematic viscosity at 40 °C, sometimes also at 100 °C, with the method, and often a comparison with the oil's new value or grade and a flag colour. Three habits make the viscosity line useful.

First, compare it with the right reference. The grade band tells you whether the oil is still a VG 46; the new oil's actual value, measured by the same laboratory when the oil was first sampled, tells you how far it has moved. Chapter 10 sets limits on that movement. Second, read it as a trend. A single result within limits means little; a steady rise over several samples can mean oxidation, and a step change usually means a top-up with the wrong oil. Third, read it with the other results on the report, water, oxidation, wear metals and particle counts, because viscosity alone cannot tell one cause from another.

Every measurement method has a stated repeatability, the largest difference expected between two results by the same operator and instrument, and a reproducibility, the largest expected between laboratories. Those figures are in the test method. A change between two samples that is smaller than the method's repeatability is not evidence of anything; a laboratory can supply the figures for its method on request.

## The error: a portable reading at room temperature

This is an illustration. The press shop bought a portable rotational viscometer to check oil deliveries. On a cool morning a storeman tested a newly delivered drum labelled VG 46 at the drum's temperature of 24.0 °C and read 92.0 mPa·s. The specification on the purchase order said 46 mm²/s at 40 °C. The storeman reasonably concluded that the drum held oil twice as viscous as ordered, quarantined it and asked the supplier to collect it.

The supplier's technical officer asked two questions: at what temperature, and in what units? The reading was dynamic viscosity at 24 °C; the specification was kinematic viscosity at 40 °C. Converting the reading, with the oil's density at 24 °C of 864.5 kg/m³, gives a kinematic viscosity of 92.0 ÷ 0.8645 = 106.4 mm²/s at 24 °C. Applying the new oil's Walther slope to bring it to 40 °C gives 46.4 mm²/s, within 1% of the data sheet and well inside the VG 46 band of 41.4 to 50.6. The drum was right.

```figure
type: compare
title: The same drum reading, three ways
cols: Value | Compared with 46 mm²/s at 40 °C
rowhead: Reading
- As read: dynamic, 24.0 °C | 92.0 mPa·s | appears twice the specification
- Kinematic, 24.0 °C | 106.4 mm²/s | still not comparable: wrong temperature
- * Kinematic, corrected to 40 °C | 46.4 mm²/s | within the VG 46 band
caption: This is an illustration. Density 864.5 kg/m³ at 24 °C; correction with the new oil's Walther slope B = 3.68444.
```

The quarantine cost a day and an apology. The press shop changed its goods-in procedure: the portable meter is used only to compare a delivery with a retained reference sample of the same product at the same temperature, read side by side, which cancels the temperature and density effects; any disagreement of more than the meter's stated accuracy sends a sample to the laboratory for a measurement at 40 °C. The meter is labelled with a note that it reads dynamic viscosity.

## Bringing it together

Capillary viscometers measure kinematic viscosity from a flow time and are the reference for oils; rotational instruments measure dynamic viscosity at a chosen shear rate and suit greases and field checks; falling balls work only when the ball's Reynolds number is small. Temperature control dominates accuracy, because viscosity changes by several per cent per kelvin, and every result must carry its temperature. A field reading can be corrected to 40 °C with the oil's Walther slope as an estimate, but decisions rest on laboratory results. With a reliable viscosity in hand, the next chapter follows the oil into HPU-40's lines.

## Exercise: a sample from the machine

A sample drawn from HPU-40's reservoir after a summer reads 33.5 mPa·s on the portable rotational meter at 45.0 °C. Estimate its kinematic viscosity at 40 °C, using the oil's density formula and the new oil's Walther slope, and say whether a laboratory test is warranted.

**Worked answer.** This is an illustration. The density at 45 °C is 870 × (1 − 0.0007 × 30) = 851.7 kg/m³, so the kinematic viscosity at 45 °C is 33.5 ÷ 0.8517 = 39.33 mm²/s. The new oil at 45 °C would be 36.9 mm²/s, so the sample is about 7% more viscous. With B = 3.68444, log log (39.33 + 0.7) = 0.20477 and log 318.15 = 2.50263, so A = 0.20477 + 3.68444 × 2.50263 = 9.42557, and at 40 °C the estimate is 10^(10^(9.42557 − 3.68444 × 2.49575)) − 0.7 = **49.3 mm²/s**, 7% above the new oil and near the top of the VG 46 band. That is enough of a change to send a sample to the laboratory for a measurement at 40 °C and an oxidation check, which is what Chapter 10 does with it.
