---
book: production-leak-testing-by-the-numbers
chapterSlug: the-helium-mass-spectrometer
order: 7
title: "The helium mass spectrometer"
description: "How a helium detector ionises gas and bends ions in a magnetic field, why it needs a vacuum, its calibration and response time in a chamber, and a shortened cycle that read leaks low."
draft: false
---

At the heart of the OC-40's helium station is an instrument that counts helium atoms. It takes the gas pumped from the test chamber, knocks an electron off some of its molecules to make them into ions, accelerates them, and sends them through a magnetic field that bends each into a circle whose radius depends on its mass. A slit placed at the radius for helium lets only helium ions through to a collector, where they make a tiny electric current. That current, a few picoamperes for a leak at the OC-40's limit, is the measurement.

The physics is the motion of charged particles in a magnetic field, the same physics that traps particles in the Earth's radiation belts and guides them in fusion machines. This chapter explains it from the force on a moving charge, calculates the radii for helium and its neighbours, explains why the instrument needs a high vacuum, how it is calibrated, how fast it responds in a chamber, and finishes with a shortened cycle that quietly loosened the reject limit by half.

## A charge moving through a magnetic field

A charged particle moving through a magnetic field feels a force at right angles both to its velocity and to the field, with a size equal to its charge multiplied by its speed and the field strength. Because the force is always at right angles to the motion, it never changes the particle's speed, only its direction. A particle moving perpendicular to a uniform field therefore travels in a circle, at constant speed, with the magnetic force supplying exactly the centripetal force the circle needs.

```figure
type: formula
title: Circular motion of an ion in a uniform magnetic field
formula: Force: F = q v B        Circle: q v B = m v² ÷ r
formula: Radius: r = m v ÷ (q B)        Angular frequency: ω = q B ÷ m
formula: After acceleration through a voltage V: v = √(2 q V ÷ m), so r = √(2 m V ÷ q) ÷ B
caption: q is the ion's charge, m its mass, v its speed and B the magnetic flux density. The radius is the gyroradius, or Larmor radius, and ω the cyclotron frequency. For singly charged ions accelerated through the same voltage, the radius grows with the square root of the mass.
- r | radius of the ion's path, m
- B | magnetic flux density, T
- V | accelerating voltage, V
```

The last line is the instrument's principle. Ions of different mass, given the same energy by the same accelerating voltage, follow circles of different radius in the same field. Heavier ions swing wider. Place an exit slit at the radius for helium and only helium arrives.

## Radii in the OC-40's detector

The detector's analyser, for illustration, uses an accelerating voltage of 300 V and a field of 0.15 T from a small permanent magnet, and turns the ions through 180°. The radii and other figures for the ions most likely to be present follow from the formulas.

```figure
type: compare
title: Ions in the detector's analyser, 300 V and 0.15 T
cols: Mass | Speed after 300 V | Radius | Time to turn 180°
rowhead: Ion
- Hydrogen, H₂⁺ | 2.016 u | 169.5 km/s | 23.6 mm | 0.44 µs
- Helium-3, ³He⁺ | 3.016 u | 138.5 km/s | 28.9 mm | 0.66 µs
- * Helium-4, ⁴He⁺ | 4.003 u | 120.3 km/s | 33.3 mm | 0.87 µs
- Water, H₂O⁺ | 18.02 u | 56.7 km/s | 70.6 mm | 3.9 µs
caption: This is an illustration with singly charged ions. Speed v = √(2qV ÷ m); radius r = mv ÷ (qB); half-turn time π ÷ ω = πm ÷ (qB). After 180°, ions land at a distance of twice their radius from the entry slit.
```

After half a circle, each ion lands at twice its radius from where it entered. Helium-4 lands at 66.5 mm, helium-3 at 57.7 mm, 8.8 mm away. Hydrogen, the nearest abundant light ion, lands at 47.2 mm, and water vapour, the most abundant gas left in most vacuum systems, at 141 mm, far beyond the collector. A collector slit a few millimetres wide at 66.5 mm takes helium-4 alone.

Notice how fast and how brief the ions' journey is. A helium ion crosses the analyser in under a microsecond. The instrument measures not single ions but a steady stream of them, millions per second for a large leak, and the collector current is proportional to the stream.

### Tuning the peak

The radius depends on the square root of the accelerating voltage, so a 1% drift in the voltage moves helium's radius by 0.17 mm and its landing point by 0.33 mm. Detectors therefore tune themselves: at start-up and periodically, they scan the accelerating voltage across the helium peak, using their internal reference leak, and set it at the top of the peak, where small drifts change the signal least. A detector whose tuning has drifted reads low, because helium ions are landing partly beside the slit.

## Why it needs a high vacuum

The ions must travel the analyser's path, about a hundred millimetres in all, without colliding with gas molecules, which would knock them off course or neutralise them. The mean free path of Chapter 2, 68 nm in air at atmospheric pressure, grows in inverse proportion to pressure: at 10⁻⁴ mbar it is about 0.69 m, at 10⁻⁵ mbar about 6.9 m. The analyser therefore runs below about 10⁻⁴ mbar, pumped by a turbomolecular pump backed by a rotary or scroll pump, so that almost every ion completes its path undisturbed.

The ion source needs the vacuum too. It ionises gas with electrons from a hot filament, and a filament exposed to air at higher pressure burns out. Detectors protect their filaments by switching them off whenever the pressure rises, which is one reason a gross leaker that floods the chamber with gas also takes the detector out of service for a minute while it recovers.

### Getting helium from the chamber to the analyser

The test chamber cannot be pumped to 10⁻⁴ mbar in a production cycle, nor does it need to be. Most production detectors use a counter-flow arrangement: the chamber is pumped by a roughing pump to a few millibar, and the detector is connected to the foreline between its turbomolecular pump and backing pump. Heavier gases cannot flow backwards through the spinning turbomolecular pump against its pumping action, but helium, light and fast, diffuses back through it to the analyser. The turbomolecular pump becomes a filter that favours helium, and the analyser stays at high vacuum while the chamber is at a much higher pressure.

## Sensitivity and calibration

The collector current is proportional to the helium arriving per second, which is the helium leak rate once the flow has settled. The constant of proportionality, the detector's sensitivity in amperes per mbar·L/s, depends on the ion source's efficiency, the tuning and the pumping, and it drifts. Detectors calibrate it against an internal reference leak, usually a permeation leak of about 10⁻⁷ mbar·L/s with a temperature sensor so that its rate can be corrected, at start-up and at set intervals.

The internal calibration fixes the detector's own scale. It does not account for the chamber, the pumping and the timing of the production test, which change how much of a part's helium reaches the detector in the measurement window. That is the role of the external reference leak described in Chapter 5: a capillary leak, fitted to a known-good cooler in the chamber, measured with exactly the production cycle.

```figure
type: layers
title: What each calibration covers in the OC-40 station
caption: This is an illustration. The internal calibration makes the detector read correctly; the external reference leak makes the station read correctly.
- Detector scale | internal permeation leak at about 10⁻⁷ mbar·L/s; automatic, at start-up and every hour
- Peak tuning | accelerating voltage set on the helium peak during the internal calibration
- Chamber, pumps and timing | external capillary leak of 9.0 × 10⁻⁴ mbar·L/s of helium on a known-good cooler, run through the production cycle each shift
- Background | measured with the chamber empty and evacuated before each cooler; subtracted from its reading
```

## Response time in a chamber

When helium starts to leak into the evacuated chamber, the detector's reading does not jump to its final value. The chamber holds a volume of gas that is being pumped away at a certain speed, and the helium concentration in it rises towards a steady value as leak and pumping come into balance. The rise is exponential, with a time constant equal to the chamber's free volume divided by the effective pumping speed for helium.

```figure
type: formula
title: Response of a chamber test to a leak
formula: τ = V_chamber ÷ S_He        Reading(t) = Q × (1 − e^(−t ÷ τ))
caption: V_chamber is the chamber's free volume around the part and S_He the effective pumping speed for helium at the chamber. The reading approaches the true leak rate Q with time constant τ; after 3τ it is within 5%.
- τ | response time constant, s
- S_He | effective helium pumping speed, L/s
```

The OC-40 chamber's free volume around a cooler is 20 L, and the effective helium pumping speed is 5 L/s, so τ = 4 seconds. In a 6-second measurement, the reading reaches 1 − e^(−1.5) = 78% of the true leak rate; in 12 seconds, 95%.

```figure
type: bars
title: Share of the true leak rate the OC-40 chamber reads, by measurement time
unit: %
max: 100
caption: This is an illustration with τ = 20 L ÷ 5 L/s = 4 s. The external reference leak, measured with the same timing, corrects for the shortfall automatically, provided the timing does not change.
- 3 s | 52.8
- * 6 s, the production cycle | 77.7
- 12 s | 95.0
```

Reading 78% of the true rate is not an error if the reject limit was set with the reference leak measured in exactly the same cycle: the reference leak also reads 78% of its value, and the station's threshold, set at the reading the reference leak produces, already includes the shortfall. It becomes an error the moment the timing changes without the reference leak being rerun.

## The mistake: a shortened cycle

To raise the line rate, a production engineer shortened the helium station's measurement from 6 to 3 seconds, saving 3 seconds a cooler. The station's reject threshold, a reading set in Chapter 8 from the reference leak's response in the 6-second cycle, was left as it was. The shift's reject rate fell slightly, which was taken as good news.

```figure
type: steps
title: Restoring the station's calibration after a timing change
caption: This is an illustration. A threshold set from a reading in one cycle is wrong in any other cycle.
- Change | measurement shortened from 6 s to 3 s; threshold unchanged
- Effect on every reading | 52.8% ÷ 77.7% = 68% of what the 6 s cycle read
- Effective limit | a leak had to be 1 ÷ 0.68 = 1.47 times larger to reach the threshold
- * Found | the shift's reference leak check read 68% of its usual value and failed
- Fix | measurement restored to 6 s; the day's coolers retested; any timing change now requires the reference leak rerun and the threshold reset
```

In a 3-second measurement, every reading reached 52.8% of the true leak rate instead of 77.7%, 68% of what the 6-second cycle had read. Every leak looked smaller, and the threshold, unchanged, now accepted leaks up to 1.47 times the intended limit. The falling reject rate was the station passing coolers it should have rejected. The next shift's reference leak check, run with the new timing, read 68% of its usual value and failed, which stopped the line. The measurement was restored to 6 seconds, the coolers tested with the short cycle were retested, and the station's software now refuses any change to its timing until the reference leak has been rerun and the threshold reset from it.

## The hydrogen sniffer: a different kind of detector

The hydrogen sniffer kept beside the chamber for locating leaks works on a different principle. Its sensor is a small solid-state element whose electrical properties change when hydrogen molecules adsorb on its surface. It needs no vacuum, no magnet and no filament, so it is small, robust and cheap, and it can be carried to the part. Its selectivity comes from the sensor's chemistry rather than from separating masses, so it can respond weakly to other reducing gases, such as solvent vapours from a recent wash, and it must be checked against a reference leak before use.

Its sensitivity, about 10⁻⁶ to 10⁻⁷ mbar·L/s of hydrogen in sniffing, is far coarser than the chamber's but ample for finding a leak in a cooler the chamber has already rejected at around 10⁻³. The operator fills the rejected cooler with the 5% hydrogen mixture at 10 bar gauge, runs the probe slowly along each braze joint and around the cast tanks, and marks the point of the strongest signal for the repair team. Because hydrogen's background in air is about a tenth of helium's and is not raised by the helium station's activity, the sniffer works reliably in the same cell, an advantage the mistake of Chapter 6 made obvious.

## What limits the detector

Three things set how small a leak the station can see. The detector's own noise, a few times 10⁻¹⁰ mbar·L/s for a good counter-flow detector, is far below anything the OC-40 needs. The background, from helium in the chamber's walls and seals and from the cell's air, is typically 10⁻⁷ to 10⁻⁶ mbar·L/s at the station and rises after a gross leaker. And the timing, as the mistake showed, sets how much of a leak's helium is counted. For the OC-40's limit near 10⁻³ mbar·L/s, the station has more than two orders of magnitude of margin over its background; for the evaporator of Chapter 1's exercise, with a limit 44 times tighter, the margin would shrink to a factor of about 20 and the background would need closer watching.

## Exercise: a larger chamber

The OC-60's helium chamber will have a free volume of 36 L around the cooler and an effective helium pumping speed of 6 L/s. Calculate its time constant and the share of the true leak rate it reads in 6, 9 and 12 seconds. Then calculate the radius at which helium-4 ions travel in a detector with an accelerating voltage of 250 V and a field of 0.12 T, and the separation between the helium-3 and helium-4 landing points after 180°.

### Answer

**Given:** V = 36 L; S = 6 L/s; measurement times 6, 9 and 12 s; V_acc = 250 V; B = 0.12 T; masses 4.003 u and 3.016 u; 1 u = 1.6605 × 10⁻²⁷ kg; e = 1.602 × 10⁻¹⁹ C.

**Assumptions:** a well-mixed chamber; constant pumping speed; singly charged ions.

**Method:** τ = V ÷ S; share = 1 − e^(−t ÷ τ); r = √(2 m V ÷ q) ÷ B; separation = 2 (r₄ − r₃).

**Time constant:** 36 ÷ 6 = 6.0 s.

**Shares:** 6 s: 1 − e⁻¹ = 63.2%; 9 s: 1 − e^(−1.5) = 77.7%; 12 s: 1 − e⁻² = 86.5%.

**Helium-4 radius:** m = 4.003 × 1.6605 × 10⁻²⁷ = 6.647 × 10⁻²⁷ kg; r = √(2 × 6.647 × 10⁻²⁷ × 250 ÷ 1.602 × 10⁻¹⁹) ÷ 0.12 = √(2.074 × 10⁻⁵) ÷ 0.12 = 4.554 × 10⁻³ ÷ 0.12 = 38.0 mm.

**Helium-3 radius:** scales with the square root of mass: 38.0 × √(3.016 ÷ 4.003) = 32.9 mm. Separation after 180° = 2 × (38.0 − 32.9) = 10.0 mm, slightly more than the OC-40 analyser's 8.8 mm because the radii are larger.

**Interpretation:** the OC-60's chamber needs a 9-second measurement to read the same 78% share as the OC-40's 6-second cycle; whatever timing is chosen, its threshold must be set from its own reference leak run in that timing.

**Verification:** a 9-second measurement with τ = 6 s is 1.5 time constants, the same as the OC-40's 6 seconds with τ = 4 s, so the shares match. The radius scales from the OC-40's analyser as √(250 ÷ 300) × (0.15 ÷ 0.12) × 33.3 mm = 38.0 mm.
