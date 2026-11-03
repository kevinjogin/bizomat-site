---
book: vibration-monitoring-by-the-numbers
chapterSlug: the-piezoelectric-accelerometer
order: 3
title: "The piezoelectric accelerometer"
description: "How a piezoelectric crystal turns force into charge, the accelerometer as a mass on a spring, sensitivity, mounted resonance, mounting, cables and overload, and a magnet that invented a fault."
draft: false
---

Almost every vibration reading on a route or an online system starts at a piezoelectric accelerometer, a small metal cylinder a few centimetres tall that screws or clamps to a bearing housing. Inside it a slice of ceramic crystal is squeezed by a small weight as the housing accelerates, and the crystal produces an electric charge in proportion to the squeeze. The physics of that crystal, and the mechanics of the weight that loads it, decide what frequencies the sensor can measure, how small a vibration it can see, how large a one it can survive, and how the way it is mounted can make it report vibration that is not there.

This chapter explains the piezoelectric effect from the structure of the crystals that show it, describes the accelerometer as a mass on a stiff spring, works out its sensitivity and its usable range, compares mounting methods, covers cables, power and overload, and finishes with a magnetic mount on a painted, curved housing that made a healthy bearing look as if it were failing.

## Crystals that turn force into charge

Most solids are electrically neutral in every small region: their positive and negative charges sit, on average, at the same place. In some crystals the arrangement of the ions has no centre of symmetry, and squeezing the crystal moves the positive ions slightly relative to the negative ones. That separation of charge, an electric polarisation, appears as a charge on the crystal's faces. Releasing the squeeze removes it; stretching reverses it. That is the direct piezoelectric effect, and the charge is proportional to the force.

Quartz shows the effect naturally and very stably, but weakly. The materials used in most industrial accelerometers are ceramics such as lead zirconate titanate, PZT, which belong to a class called ferroelectrics. Below a temperature called the Curie point, a ferroelectric crystal's ions settle into an arrangement with a built-in, spontaneous polarisation. A ceramic is a mass of tiny crystals pointing every which way, whose polarisations cancel; during manufacture it is heated and cooled in a strong electric field, a process called poling, which aligns most of their polarisations in one direction. The poled ceramic then responds to force with a charge far larger than quartz's for the same force, typically a hundred or more times larger.

```figure
type: formula
title: Charge from a piezoelectric element loaded by a seismic mass
formula: Q = d × F        F = m × a        so Q = d × m × a
caption: d is the element's piezoelectric charge coefficient in coulombs per newton, m the seismic mass and a the acceleration. For a PZT element with d of about 400 pC/N and a 10 g mass, Q is about 39 pC for each g of acceleration; a quartz element with d of about 2.3 pC/N would give about 0.23 pC/g.
- Q | charge produced, pC
- d | piezoelectric charge coefficient, pC/N
- m | seismic mass, kg
```

The poling that makes a ceramic so sensitive is also its weakness. Heated towards its Curie temperature, a ceramic loses its alignment and its sensitivity, permanently. Accelerometers are rated for a maximum temperature well below the Curie point, and a sensor left on a housing hotter than its rating, or welded near, can lose sensitivity without any visible sign. Ferroelectric ceramics are also pyroelectric: a change in their temperature changes their polarisation and produces a charge with no vibration at all. A sudden draught of cold air on a hot sensor shows as a slow, large, false signal at very low frequencies, one more reason for the high-pass filter mentioned in Chapter 2.

## A mass on a stiff spring

Inside the sensor, the seismic mass sits on the piezoelectric element, which acts as a very stiff spring, and the assembly is clamped to the sensor's base. When the base accelerates, the element must push the mass to make it follow, and the force it exerts, mass times acceleration, is what generates the charge. As long as the base moves slowly compared with the assembly's own natural frequency, the mass follows faithfully and the charge is proportional to the base's acceleration.

As the frequency approaches the natural frequency, the mass lags and overshoots, and the force, and so the output, is magnified. For a lightly damped sensor the magnification at a frequency ratio r, the vibration frequency divided by the natural frequency, is close to 1 ÷ (1 − r²).

```figure
type: compare
title: An accelerometer's over-reading as the frequency approaches its mounted resonance
cols: Magnification 1 ÷ (1 − r²) | Error in the reading
rowhead: Frequency as a share of mounted resonance
- 0.1 | 1.010 | +1.0%
- 0.2 | 1.042 | +4.2%
- 1/3 | 1.125 | +12.5%
- 0.5 | 1.333 | +33%
- 1.0 | very large | the reading is meaningless
caption: For a lightly damped sensor. A common working rule keeps measurements below about a fifth to a third of the mounted resonance; the usable range is set by the resonance of the sensor as mounted, not the sensor alone.
```

## Sensitivity and electronics

A charge of a few tens of picocoulombs is tiny and easily lost to the capacitance of a long cable. Two arrangements handle it.

**Charge-mode sensors** send the raw charge down a low-noise cable to a charge amplifier. They work at high temperatures, because there is no electronics in the sensor, but need special cable and careful handling.

**IEPE sensors**, standing for integrated electronics piezo-electric, contain a small amplifier that converts the charge to a voltage, powered by a constant current sent from the data collector down the same two-wire cable. They are the usual choice for route and online monitoring. A typical general-purpose IEPE accelerometer has a sensitivity of 100 mV per g.

The IEPE arrangement gives a useful check. The amplifier sits at a steady bias voltage, typically around 10 to 12 V, on which the vibration signal rides. A bias near zero means a short circuit; a bias near the supply voltage means an open circuit or a disconnected sensor. Online systems monitor the bias continuously, and route instruments check it before each reading, which catches most cable and connector faults before they produce false data. A bias that drifts slowly over months, while still inside its normal band, is an early sign of moisture in a connector or a failing amplifier, and is worth trending like any other reading.

### Overload

The amplifier has a limited output swing, typically ±5 V around its bias. At 100 mV/g that is ±50 g. Impacts from a loose part, a cavitating pump or a chipper striking a knot can exceed that briefly, clipping the signal and producing spurious frequencies across the spectrum. Sensors for machines with heavy impacts are chosen with lower sensitivity, such as 10 mV/g, at the cost of a higher noise floor for small signals.

## How mounting changes the range

The sensor's own natural frequency, often 30 kHz or more, applies only if it is attached infinitely stiffly. In practice the attachment, a stud, a layer of adhesive, a magnet or a technician's hand, is itself a spring, and the sensor and its mount resonate at a lower frequency. That mounted resonance, not the sensor's, sets the usable range.

```figure
type: compare
title: Typical mounted resonance and usable range by mounting method
cols: Mounted resonance, typical | Within +5% up to about | Within +12.5% up to about | Used for
rowhead: Mounting
- Stud into a drilled, faced and tapped hole | 25 kHz | 5.5 kHz | 8.3 kHz | online sensors; reference measurements
- Adhesive on a flat pad | close to stud, depending on the adhesive | similar | similar | semi-permanent sensors where drilling is not allowed
- Magnet on a flat, clean steel pad | 7 kHz | 1.5 kHz | 2.3 kHz | route measurements
- Magnet on a painted or curved surface | 2 kHz | 0.44 kHz | 0.67 kHz | not recommended
- Hand-held probe | 1 kHz | 0.22 kHz | 0.33 kHz | quick checks of low-frequency vibration only
caption: Typical figures for illustration; each sensor maker publishes its own. Limits use the magnification 1 ÷ (1 − r²); a +5% error is reached at r = 0.218.
```

The table explains the mill's choices. Bearing defects excite ringing in the kilohertz range, so a hand-held probe, flat only to a few hundred hertz, cannot see them. A magnet on a flat steel pad, good to about 1.5 kHz within 5%, sees bearing frequencies and their low harmonics but not the higher ringing. Studs, used for the chipper's online sensors, cover the whole range. The steel pads glued at the mill's route points exist so that the route's magnets always sit on clean, flat steel and give the 7 kHz resonance, not 2 kHz. A stud mount reaches its full range only if it is made properly: the hole drilled square to the surface, the surface spot-faced flat and smooth over the sensor's base, a thin film of silicone grease or couplant between the faces to fill microscopic gaps, and the sensor tightened to its maker's torque. An uneven face or an over-tightened stud can lower the mounted resonance or distort the sensor's base and change its sensitivity, so the mill's online sensors were fitted by the instrument supplier to a written procedure and their resonances checked afterwards.

## The mistake: a magnet that invented a bearing fault

On one route, the technician found the P-4 motor's drive-end pad missing, knocked off during a repair, and placed the magnet directly on the motor's painted, curved end shield. The acceleration spectrum showed a broad hump around 1.8 kHz, and the analysis software flagged a possible bearing defect, since bearing defects often show as raised energy in that region.

```figure
type: steps
title: Separating a mounting resonance from a bearing fault
caption: This is an illustration. A hump that moves when the mounting changes belongs to the mounting, not the machine.
- Reading | broad hump near 1.8 kHz; software flagged a possible bearing defect
- Mounting | magnet on a painted, curved end shield; pad missing
- Check 1 | same point with a temporary adhesive pad: hump gone
- Check 2 | spectrum at the bearing's defect frequencies of Chapter 8: no peaks, no harmonics, no sidebands
- * Cause | the magnet rocking on the curved, painted surface resonated near 1.8 kHz and amplified the ordinary broadband vibration
- Fix | pad re-glued; route rule: no reading without a pad, and a missing pad is reported, not worked around
```

A bearing defect produces energy at specific frequencies set by the bearing's geometry and, usually, harmonics and sidebands of them, as Chapter 8 explains. The hump had neither. Repeated with a temporary pad bonded to the end shield, the measurement showed no hump at all. The magnet, rocking on paint over a curved surface, had formed a soft mount whose resonance near 1.8 kHz amplified the motor's ordinary broadband vibration into something that looked like a fault. The pad was replaced the same day. The route instructions now forbid taking a reading where a pad is missing, and require the missing pad to be reported for replacement, because a reading from a poor mount is worse than no reading: it looks like data.

## Cables, connectors and ground loops

Most sensor faults are not in the sensor. Cables chafe and their shields break; connectors loosen, corrode and admit water; a cable laid beside a variable-speed drive's motor leads picks up switching noise. A shield earthed at both ends can carry current from differences in earth potential around the plant, a ground loop, which appears as a strong line at 50 Hz and its harmonics. Online systems use shielded twisted-pair cable earthed at one end, kept away from power cables, with connectors sealed against moisture. Route cables are coiled loosely, inspected at each use and replaced on a schedule, because a cable's failure is intermittent and hard to find in the data.

## Checking a sensor

A sensor's sensitivity can drift, from overheating, a hard knock or a failing amplifier, and a route instrument cannot tell. The mill checks its route sensors each quarter on a hand-held reference shaker that vibrates at a known acceleration, 1 g RMS at 159.2 Hz. That frequency is chosen because its angular frequency is exactly 1,000 rad/s, so 1 g, 9.807 m/s², corresponds to 9.81 mm/s of velocity and 9.81 µm of displacement: the same number in all three units, which checks the instrument's integration as well as the sensor. A sensor reading more than a few per cent from 1 g is replaced. The online sensors on the chipper are checked by comparing each with a calibrated route sensor stud-mounted beside it, a back-to-back check that covers the whole measurement chain.

## Noise and the smallest signal

Every sensor and amplifier adds a little electrical noise, which sets the smallest vibration that can be measured. For a general-purpose 100 mV/g sensor the noise is typically a few hundred micro-g across its band, far below the levels of the mill's machines but not far below the earliest stage of a bearing defect, whose high-frequency signal can be a few milli-g. A more sensitive sensor, 500 mV/g or 1 V/g, lowers the noise floor in proportion but overloads at a lower acceleration. Choosing a sensitivity is a trade between seeing the smallest signal and surviving the largest, and for most route work 100 mV/g sits in the middle of that trade.

## Choosing a sensor for each job

```figure
type: decision
title: The mill's sensor choices
caption: This is an illustration of the reasoning.
- General route measurements on fans, motors and pumps | IEPE, 100 mV/g, magnet on a steel pad | Covers unbalance to early bearing defects
- Chipper main bearings, online | IEPE, 100 mV/g, stud mounted, low-frequency rated | Running speed about 8.3 Hz; heavy impacts checked against overload
- Gearbox G-3 mesh and high-frequency checks | IEPE, 100 mV/g, stud on a tapped pad | Gear mesh near 470 Hz and its harmonics
- Hot fan bearing near the kiln | Charge-mode or high-temperature IEPE | Housing above a standard sensor's rating
```

## Exercise: will the route catch P-4's bearing ringing?

P-4's 6309 bearing, when it develops an outer-race defect, is expected to excite ringing between about 2 and 4 kHz as well as its defect frequency of about 75 Hz. The route uses a 100 mV/g IEPE accelerometer on a magnet. Using this chapter's typical mounted resonances, calculate the magnification of a 75 Hz signal and of a 3 kHz signal for a magnet on a flat pad and for a stud, and decide which mounting can measure each part of the defect's signature reliably. Then calculate the voltage output for 0.5 g at the sensor.

### Answer

**Given:** mounted resonance 7 kHz on a flat pad, 25 kHz with a stud; signals at 75 Hz and 3 kHz; sensitivity 100 mV/g; amplitude 0.5 g.

**Assumptions:** lightly damped mount; magnification 1 ÷ (1 − r²).

**Method:** r = f ÷ f_mount; magnification = 1 ÷ (1 − r²).

**75 Hz on a pad:** r = 75 ÷ 7,000 = 0.0107; magnification 1.0001, essentially exact. **On a stud:** r = 0.003, exact.

**3 kHz on a pad:** r = 3,000 ÷ 7,000 = 0.429; magnification 1 ÷ (1 − 0.184) = 1.225, a 22.5% over-reading. **On a stud:** r = 3,000 ÷ 25,000 = 0.12; magnification 1.015.

**Decision:** the magnet on a pad measures the defect frequency itself and its low harmonics accurately and shows that the ringing is present, but over-reads it by about a fifth; the stud measures both reliably. For trending the ringing on the same mount, a consistent over-reading does not matter; for comparing with another machine or a stud-mounted sensor, it does.

**Output:** 0.5 g × 100 mV/g = 50 mV, well within the amplifier's ±5 V range.

**Verification:** the magnifications agree with the chapter's table: at r = 0.429, between the 0.333 and 0.5 rows, 1.225 lies between 1.125 and 1.333.
