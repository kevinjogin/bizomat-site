---
book: contact-temperature-sensors-by-the-numbers
chapterSlug: calibration-and-the-uncertainty-budget
order: 9
title: "Calibration, traceability and the uncertainty budget"
description: "The kelvin and ITS-90, the chain to a national standard, ice points and dry blocks, budgets for CV-180's profile and control sensors, guard bands, and a correction applied backwards."
draft: false
---

Every chapter so far has found a way for a contact reading to be wrong and a way to make it less wrong. This chapter puts a number on what remains. It explains what the temperature scale rests on and how a factory sensor is tied to it, describes the calibrations a small business can do for itself and those it should buy, and builds an uncertainty budget for two of CV-180's measurements: a trailing thermocouple proving a cure, and the controller's Pt100 holding the air. It uses the first budget to set the guard band that decides when a cure starts, and ends with a calibration correction that was entered with the wrong sign.

## What the temperature scale rests on

Temperature is defined through thermodynamics, and since 2019 the kelvin has been defined by fixing the value of the **Boltzmann constant** at exactly 1.380649 × 10⁻²³ J/K. That links a temperature directly to an energy, kT, which is the natural way statistical physics uses temperature. Thermometers that measure temperature from first principles, through a property that can be calculated from physics, such as the pressure of a gas, the speed of sound in it or the electrical noise in a resistor, are called **primary thermometers**. They are slow and difficult, and are used only by national laboratories.

Everyday measurement relies instead on the **International Temperature Scale of 1990 (ITS-90)**, a practical scale designed to agree closely with thermodynamic temperature. It defines a set of fixed points, the temperatures at which very pure substances melt, freeze or reach their triple points, with assigned values, such as the triple point of water at 0.01 °C, the freezing point of tin at 231.928 °C and the freezing point of zinc at 419.527 °C. Between the fixed points, it specifies the instruments and equations used to interpolate: the standard platinum resistance thermometer over most of the range, and radiation thermometry above the freezing point of silver. Every other thermometer is a **secondary thermometer**, whose readings mean something only because it has been compared, directly or through a chain, with instruments that realise the scale.

## The calibration chain

In Australia, the National Measurement Institute maintains the national standards of measurement, including the realisation of the temperature scale. Calibration laboratories accredited by NATA calibrate their own reference thermometers against those standards, directly or through other accredited laboratories, and then calibrate customers' instruments against their references. Each link adds a stated uncertainty. A calibration certificate from an accredited laboratory, with its uncertainty, is what makes a measurement **traceable**: tied by an unbroken, documented chain of comparisons to the national standard.

```figure
type: steps
title: CV-180's calibration chain
caption: This is an illustration. Uncertainty grows at each link. The business owns the bottom two links and must keep their records as carefully as the laboratory keeps its own.
- National standard | the temperature scale realised at fixed points by the National Measurement Institute
- Accredited laboratory's reference | standard platinum resistance thermometers and fixed-point cells, calibrated against the national standard
- * CV-180's working reference | a reference Pt100 with its readout, calibrated by an accredited laboratory: ±0.10 K at k = 2 from 0 to 250 °C
- CV-180's dry-block calibrator | compares each sensor with the working reference in adjacent wells
- CV-180's sensors and logger channels | trailing thermocouples, controller Pt100, limit thermocouple
```

[Calibration, traceability and the uncertainty budget](/reados/publications/infrared-temperature-measurement-by-the-numbers/calibration-and-uncertainty/) in *Infrared Temperature Measurement by the Numbers* describes the same chain for radiation thermometers, which are calibrated against black-body sources. Contact sensors are calibrated by putting them where the reference is: at a fixed point, in a stirred bath, or in a dry block.

## Calibrations a business can do itself

### The ice point

A properly made ice point is the most accessible fixed point there is. Fill a vacuum flask with finely crushed ice made from clean water, add enough cold water to fill the gaps without floating the ice, stir, and let it stand for a quarter of an hour. Push the probe into the slush to a depth well beyond its element, and keep the ice packed around it. Made carefully, an ice point sits at 0 °C to within a few hundredths of a kelvin, far better than any industrial sensor needs.

For a Pt100, the ice point checks R₀ directly: a class A sensor should read between 99.94 Ω and 100.06 Ω, as Chapter 4 showed. For a thermocouple, it checks the whole chain at one point, including the instrument's cold-junction compensation. Its limitation is the one Chapter 4 found: a single point at 0 °C cannot reveal an error that grows with temperature.

### The dry-block calibrator

A **dry-block calibrator** is a heated metal block with bored wells, controlled to a set temperature. The sensor under test goes in one well and a reference thermometer in another, and the two readings are compared once both have settled. It is portable and clean, works across CV-180's range, and lets the business check sensors at the working temperature.

Its limitations are the installation errors of Chapter 7 in a new setting. The block is not perfectly uniform, so wells at different positions and depths differ slightly; the sensor must be immersed deeply enough that stem conduction does not pull it low; and the bore must fit the probe closely, because an air gap slows the response and adds error. Good practice is to use inserts bored for each probe size, immerse to the bottom of the well, wait until both readings are stable for several minutes, and rely on the calibrator's stated uniformity figures in the budget.

### Calibrating the system, not just the sensor

CV-180's trailing thermocouples are calibrated together with the logger channels they use, in the dry block at 100 °C, 180 °C and 220 °C, so that the logger's cold-junction compensation, its converter and each thermocouple's departure from the reference function are all measured in one comparison. The result is a correction for each channel at each point, with an uncertainty. Calibrating the system removes the class 1 tolerance of ±1.5 K from the budget and replaces it with a measured correction good to a few tenths of a kelvin, at the price of keeping each thermocouple with its channel.

## The profile channel's budget

An uncertainty budget lists every known source of error, estimates each as a **standard uncertainty**, roughly the standard deviation it contributes, combines them by root-sum-of-squares on the assumption that they are independent, and multiplies the result by a **coverage factor**, usually 2, to give an expanded uncertainty that covers about 95% of cases. A limit stated as ±a with no reason to prefer any value inside it is converted to a standard uncertainty by dividing by √3.

This is an illustration for a trailing thermocouple reading a 10 mm plate at 180 °C in CV-180, with its system calibration applied.

- **Calibration**, from the dry-block comparison: ±0.6 K at k = 2, including the reference and the block's uniformity, so **0.30 K**.
- **Drift** of the thermocouple and channel between calibrations: ±0.5 K, rectangular, **0.29 K**.
- **Cold-junction stability** in the field, as the logger warms beside the oven: ±0.3 K, rectangular, **0.17 K**.
- **Attachment**: a magnetic probe reads 0 to 2 K low at 180 °C (Chapter 7), corrected by +1.0 K to the midpoint, leaving ±1.0 K rectangular, **0.58 K**.
- **Lag** at the 180 °C crossing: about 1 K low (Chapter 8), corrected to its midpoint, leaving ±0.5 K rectangular, **0.29 K**.
- **Wire inhomogeneity** in the oven's gradient, which a dry-block calibration at a different immersion cannot capture: ±0.5 K, rectangular, **0.29 K**.
- **Repeatability** of readings on a steady plate, from logged data: **0.20 K**.

The combined standard uncertainty is √(0.30² + 0.29² + 0.17² + 0.58² + 0.29² + 0.29² + 0.20²) = **0.86 K**, and the expanded uncertainty is about **±1.7 K** at k = 2.

```figure
type: bars
title: Uncertainty budget for a profile channel at 180 °C, standard uncertainties
unit: K
max: 1
caption: This is an illustration. Combined by root-sum-of-squares: 0.86 K standard, about ±1.7 K expanded at k = 2. Attachment to the part dominates; the calibration itself is a minor term.
- * Attachment to the part | 0.58
- Calibration | 0.30
- Drift | 0.29
- Lag at the crossing | 0.29
- Wire inhomogeneity | 0.29
- Repeatability | 0.20
- Cold-junction stability | 0.17
- Combined | 0.86
```

If the business had not calibrated the channels and had relied on the class 1 tolerance of ±1.5 K instead, the calibration term would rise from 0.30 K to 1.5 ÷ √3 = 0.87 K, the combined standard uncertainty to about 1.18 K, and the expanded uncertainty to about **±2.4 K**. Calibration buys about 0.7 K of guard band. Better attachment, such as peened junctions on a dedicated test part, would buy more.

## The controller's budget

This is an illustration for the controller's class A Pt100 reading the supply air at 200 °C, installed as corrected in Chapter 7.

```figure
type: compare
title: Uncertainty budget for CV-180's controller at 200 °C air
cols: Limit or estimate | Standard uncertainty
caption: This is an illustration. Combined: 0.40 K standard, about ±0.8 K at k = 2. With an individually calibrated sensor in place of the class A tolerance, about ±0.5 K.
- Sensor tolerance, class A | ±0.55 K, rectangular | 0.318 K
- Controller input accuracy | ±0.3 K, rectangular | 0.173 K
- Three-wire lead mismatch | up to 0.047 K | 0.027 K
- Stem conduction at 150 mm, corrected to midpoint | 0 to 0.53 K low | 0.156 K
- Display resolution, 0.1 K | ±0.05 K | 0.029 K
- * Combined, k = 1 | | 0.396 K
- Expanded, k = 2 | | ±0.79 K
```

The controller's uncertainty, about ±0.8 K, is much smaller than the profile channel's. That is no surprise: it measures air, which is easy to couple to, with a platinum sensor. It also does not matter much, because the controller's job is to hold the air steady, and a steady error of a kelvin in the air shifts every part's heating time by a few seconds. What decides whether the powder is cured is the profile channel, and the budget shows that its uncertainty is dominated by how the sensor touches the part.

## Guard bands

The cure is defined as 10 minutes with the slowest part at or above 180 °C. If the business started the cure clock when the profile probe first read 180.0 °C, a plate truly at 178.3 °C could be credited with cure time, because the reading may be up to 1.7 K high. A **guard band** moves the decision point inside the specification by the expanded uncertainty, so that a reading above the guard-banded limit very probably means the part is truly above the specification.

This is an illustration. With an expanded uncertainty of ±1.7 K, CV-180's cure clock starts when the slowest part's probe reads **181.7 °C**, rounded to **182 °C**. On a heavy plate approaching 180 °C at about 0.026 K/s, the extra 2 K adds a little over a minute to the cycle. With uncalibrated channels at ±2.4 K, the clock would start at 182.4 °C, and with peened junctions and a smaller attachment term it could start lower. Every term in the budget therefore has a price in cycle time, which tells the business where its effort is best spent.

## How often to calibrate

There is no universal interval. A sensible start is the maker's recommendation, often a year for loggers and reference thermometers, and a check against the working reference before each set of profiles for the trailing thermocouples, which are handled roughly and flexed through the door seal. The interval is then adjusted on evidence: if successive calibrations find corrections that hardly change, the interval can lengthen; if they find drift approaching the budget's allowance, it should shorten. The working reference itself goes back to an accredited laboratory on its own interval, and the business compares it with the ice point between visits, which shows quickly if it has been damaged.

## The error: a correction applied backwards

This is an illustration. After the system calibration, channel 3 of the logger was found to read **0.8 K high** at 180 °C: it showed 180.8 °C when the reference showed 180.0 °C. The certificate gave the **error** as +0.8 K and the **correction**, the amount to add to a reading, as −0.8 K. The technician setting up the logger's channel offsets entered +0.8 K, reading the error column instead of the correction column.

Channel 3 now read **1.6 K high**: it showed 181.6 °C when the plate was at 180.0 °C. On a plate rising at 0.026 K/s near 180 °C, that started the cure clock about 62 seconds early on any part profiled with channel 3, using up nearly all of the 1.7 K guard band with an error that the budget did not contain.

The error was found at the next check against the working reference, a routine step before each set of profiles, where channel 3 differed from the reference by 1.6 K in the opposite direction to the certificate's correction. The certificate was clear; the setup was not. The business changed its procedure in two ways: a calibrated channel must be checked against the reference immediately after its offset is entered, and the setup sheet now records the certificate's correction value and its sign, with a second person checking the entry.

```figure
type: checklist
title: Checks before trusting a calibration
caption: The open item is this chapter's error. A correction is only as good as its entry into the instrument.
- x Certificate from an accredited laboratory for the working reference | stated uncertainty at the working temperature
- x Sensors compared at the working temperature | 100, 180 and 220 °C for the profile channels
- x Immersion in the calibrator matches or exceeds the working immersion | no stem conduction in the comparison
- x Budget includes the installation terms the calibration cannot see | attachment, lag, inhomogeneity
- ? Correction entered with the right sign and verified against the reference | +0.8 K entered for −0.8 K: 1.6 K high
```

## Exercise: peened junctions

The business makes a dedicated test plate with thermocouples peened into shallow drilled holes, so that the attachment term falls from ±1.0 K rectangular to ±0.3 K rectangular. All other terms in the profile budget stay the same. What are the new combined and expanded uncertainties, and the new guard-banded cure start?

**Worked answer.** The attachment term becomes 0.3 ÷ √3 = **0.17 K**. The combined standard uncertainty is √(0.30² + 0.29² + 0.17² + 0.17² + 0.29² + 0.29² + 0.20²) = √0.4401 = **0.66 K**, and the expanded uncertainty is about **±1.33 K**, so the cure clock can start at about **181.3 °C**. The saving over the magnetic probes is about 0.4 K of guard band, worth roughly 14 seconds on a heavy plate near 180 °C. That is small; the test plate's larger value is as the reference against which the magnetic probes' correction is measured and checked.
