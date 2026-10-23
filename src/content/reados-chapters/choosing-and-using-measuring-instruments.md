---
title: "Choosing and using measuring instruments: callipers, micrometers, indicators, gauges and CMMs"
description: "How to match measuring instruments to tolerances, why technique, temperature and calibration matter as much as resolution, and how to plan inspection so that measurements can be trusted."
publishDate: 2026-10-16
category: "Manufacturing"
tags:
  - quality
  - manufacturing
  - process-improvement
author: "KEVOS"
featured: false
draft: false
---

Every quality decision in manufacturing rests on a measurement. A part is accepted or rejected, a machine is adjusted, a supplier is paid or challenged and a customer complaint is resolved on the strength of a number read from an instrument. If that number is wrong, every decision built on it is wrong too. Yet measuring instruments are often chosen by habit: the digital calliper on the bench, because it is convenient, regardless of whether it can resolve the tolerance being checked.

Good measurement is not only about owning precise instruments. It depends on choosing an instrument capable of the job, using it with sound technique, controlling temperature and cleanliness, keeping instruments calibrated and planning inspection so that the right features are measured in the right way. A micrometer used carelessly on a warm part can be less reliable than a calliper used well on a part that does not need precision.

This article explains, in general terms, the common measuring instruments used in workshops and inspection rooms, how to match instruments to tolerances, the principles that affect accuracy, the role of temperature, calibration and traceability, and how to plan inspection. It complements the article on measurement system analysis, which explains how to test whether a measurement system is good enough. It is general information; instrument manufacturers' instructions should be followed for specific instruments.

## Common instruments and what they suit

| Instrument | Typical use | Strengths | Watch out for |
|---|---|---|---|
| Steel rule and tape | Rough lengths, layout | Simple, robust | Low resolution; parallax |
| Callipers (vernier, dial, digital) | External, internal, depth and step measurements | Versatile and quick | Measuring force and jaw position affect results; not suited to tight tolerances |
| Outside micrometers | External diameters and thicknesses | Higher accuracy; consistent force via ratchet or friction thimble | Limited range per instrument; must be zeroed |
| Inside, bore and depth micrometers | Bores, grooves and depths | Accurate internal measurement | Technique sensitive; bore gauges need setting |
| Dial and test indicators | Runout, flatness, height comparison, alignment | Comparative measurement against a reference | Need a stable mount and reference; cosine error with test indicators |
| Height gauges and surface plates | Heights, positions, layout | Flexible inspection on a reference plane | Surface plate condition and cleanliness |
| Gauge blocks | Reference lengths for setting and calibrating | Very accurate references | Care, cleanliness and temperature |
| Plug, ring, snap and thread gauges | Go and not-go checks | Fast, simple acceptance | Show only pass or fail, not the size |
| Radius, feeler and pitch gauges | Radii, gaps, thread pitch | Quick checks | Limited accuracy |
| Optical comparators and vision systems | Profiles, small features, non-contact measurement | Fast for 2D features and delicate parts | Edge definition and lighting |
| Coordinate measuring machines (CMMs) | 3D geometry, positions and form | Measure complex geometric relationships | Programming, fixturing, environment and cost |
| Portable arms and laser trackers | Large parts and in-situ measurement | Bring measurement to the part | Technique and environment |
| Surface roughness testers | Surface finish parameters | Quantify finish | Correct filter and evaluation settings |

## Matching the instrument to the tolerance

A common rule of thumb is that an instrument's resolution should be no more than about one tenth of the tolerance being checked, with its overall accuracy, including the effects of technique and environment, comfortably within the tolerance. The [measurement system analysis](/reados/collections/manufacturing-quality/measurement-system-analysis-for-manufacturers/) article explains this ten-to-one rule and how to test whole measurement systems with gauge repeatability and reproducibility studies.

In practical terms:

- **Callipers** are well suited to general dimensions with tolerances of a tenth of a millimetre or more, depending on the instrument and technique.
- **Micrometers** suit tighter tolerances on external features, down to a few hundredths of a millimetre and, with care, finer.
- **Bore gauges, air gauges and comparators** suit tight tolerances on bores and repeated measurement of the same feature.
- **CMMs** suit geometric relationships, such as position, profile and orientation, that hand instruments cannot measure directly.

Resolution is not accuracy. A digital calliper displaying three decimal places is not accurate to a thousandth of a millimetre.

## Principles that affect accuracy

### Measuring force

Too much force deflects the part or the instrument; too little gives inconsistent contact. Micrometers use ratchet or friction thimbles to apply consistent force. Callipers depend on the user's touch, which is one reason they vary more between people.

### The Abbe principle

Measurement error is reduced when the scale is in line with the dimension being measured. A micrometer measures along the axis of its spindle, in line with its scale, so small angular errors have little effect. A calliper measures with jaws offset from its scale, so any tilt of the jaws, or measuring near the jaw tips, magnifies errors. This is a key reason micrometers are more accurate than callipers for the same dimension.

### Cosine error

If a measuring direction is not aligned with the feature, the reading is affected by the cosine of the angle. Test indicators in particular need their stylus positioned correctly, or readings must be corrected.

### Two-point and form measurement

A micrometer measures between two points. A part that is out of round, such as a lobed shape produced by some grinding and turning conditions, can measure the same diameter in every direction while not being round. Roundness, cylindricity and flatness need appropriate methods, such as V-blocks with indicators, roundness instruments or CMMs.

## Temperature

Materials expand as they warm. The international reference temperature for dimensional measurement is 20 °C, and drawings implicitly specify dimensions at that temperature. When a part is measured at a different temperature, its size differs from its size at 20 °C.

The change in length is approximately the coefficient of thermal expansion multiplied by the length and the temperature difference. Steel expands by roughly 11 to 12 millionths of its length per degree Celsius, and aluminium by roughly 23 millionths. A 300 mm steel part measured at 30 °C is about 0.035 mm longer than at 20 °C; an aluminium part of the same length is about 0.07 mm longer. For tight tolerances, those differences matter.

```figure
type: bars
title: Growth of a 300 mm part measured at 30 °C
unit: mm
max: 0.08
caption: Drawings specify size at 20 °C; for tight tolerances, a warm part reads oversize.
- Steel | 0.035
- *Aluminium | 0.07
```

Practical measures include letting parts stabilise at room temperature before measuring, measuring parts and instruments at the same temperature, keeping inspection areas away from direct sun, heaters and machines, and, for precision work, using a temperature-controlled room. Hands warm instruments too; holding a micrometer frame for a long time changes its reading.

## Care, cleanliness and technique

Simple habits prevent many errors:

- **Clean** measuring faces, parts and surface plates before measuring; a speck of dirt can exceed a tight tolerance.
- **Zero or check** instruments against a reference before use.
- **Avoid parallax** by reading scales straight on.
- **Measure in the same way each time**, at defined locations, with consistent technique.
- **Store instruments properly**, protected from damage, with micrometer faces slightly apart.
- **Withdraw damaged instruments**, including dropped ones, until they have been checked.

## Fixed gauges or variable measurement

Go and not-go gauges, such as plug gauges for holes, ring and snap gauges for shafts and thread gauges, check whether a feature lies within its limits. They are fast, need little skill and are hard to misread, which makes them ideal for high-volume production checks. Their limitation is that they say nothing about where within the tolerance a feature lies. A process drifting towards a limit looks fine until parts start failing.

**Variable measurement**, using micrometers, indicators, comparators or CMMs, records the actual value. It supports statistical process control, reveals drift and allows the process to be adjusted before parts go out of tolerance. Many businesses combine the two: fixed gauges for every part or frequent checks, and variable measurements at defined intervals for process control.

## Measuring geometric tolerances

Modern drawings often control **position**, **profile**, **flatness**, **perpendicularity**, **runout** and other geometric characteristics relative to datums. These cannot be checked properly with a calliper. They require the part to be located on its datums, as the drawing defines, and measured relative to them. Methods include surface plates with height gauges and indicators, fixtures with indicators, functional gauges that simulate the mating part, and CMMs that construct datums from measured points. Measuring a hole's position from a convenient edge rather than from the specified datums can give a misleading answer, accepting bad parts or rejecting good ones.

## Recording measurements

Measurements that are written down properly become information. Recording the actual value, the instrument used, the person, the date and the part or batch allows trends to be seen, supports investigations and provides evidence for customers. Simple digital data collection, through instruments with data output or tablets on the shop floor, reduces transcription errors and makes analysis easier. The [statistical process control on the shop floor](/reados/collections/manufacturing-quality/statistical-process-control-on-the-shop-floor/) article explains how recorded measurements are used to keep processes stable.

## Calibration and traceability

Instruments drift and wear, so they need periodic **calibration**: comparison with references of known accuracy, with results recorded. For the measurements to be meaningful, the references must be **traceable**, through an unbroken chain of calibrations, to national standards.

In Australia, the National Measurement Institute maintains national measurement standards, and calibration laboratories accredited by the National Association of Testing Authorities (NATA) provide traceable calibrations. Many businesses send master references, such as gauge blocks and setting rings, to accredited laboratories and check workshop instruments in-house against those references. Calibration intervals should reflect use, risk and stability, and should be adjusted based on calibration history.

## Planning inspection

Good inspection starts with planning which features matter and how each will be measured:

1. **Identify critical features** from the drawing and function, often by ballooning or numbering every requirement on the drawing.
2. **Choose the method and instrument** for each feature, considering tolerance, geometry and volume.
3. **Define how and where to measure**, including datums, locations and number of measurements.
4. **Set sampling plans** for production inspection, matched to risk and process capability.
5. **Record results** in a form that supports analysis, not just pass or fail.
6. **Review the plan** when processes, parts or customers change.

The [inspection and test plans for supplier work](/reados/collections/suppliers-contractors-and-government-work/inspection-and-test-plans-for-supplier-work/) article explains how to agree inspection requirements with suppliers.

## A worked example

This is an illustrative example. The figures are hypothetical.

A small manufacturer machines steel shafts with a 40 mm bearing seat toleranced to the k6 fit, which allows a diameter between 40.002 and 40.018 mm, a band of just 16 micrometres. Operators have been checking the diameter with a digital calliper with a resolution of 0.01 mm. Several bearings have later been reported as loose or difficult to fit.

The calliper's resolution alone is more than half the tolerance band, and its accuracy, combined with operator technique, is worse still. The calliper simply cannot tell good parts from bad. In addition, shafts are measured straight off the lathe, still warm from cutting and coolant.

The business changes its method. Bearing seats are measured with an outside micrometer with a resolution of 0.001 mm, checked daily against a setting standard, after the shaft has cooled to room temperature. For higher volumes, it introduces a snap gauge set to the tolerance limits as a quick production check, with periodic micrometer measurements recorded for process control. A short gauge study confirms the new measurement system is capable. Loose bearing complaints stop.

```figure
type: range
title: A 16-micrometre band and a 10-micrometre calliper
unit: mm
min: 39.99
max: 40.03
caption: A k6 bearing seat allows 40.002 to 40.018 mm; a calliper resolving 0.01 mm cannot judge it, so a micrometer and snap gauge took over.
- *k6 tolerance band | 40.002 | 40.018
- One calliper step | 40.01 | 40.02
```

## How this applies to a small Australian business

- **Match instruments to tolerances**, using the ten-to-one rule as a starting point.
- **Prefer micrometers and comparators** for tight external and internal tolerances.
- **Control temperature**, letting parts and instruments stabilise.
- **Train consistent technique**, especially for callipers and indicators.
- **Calibrate traceably**, with records and sensible intervals.
- **Plan inspection** for critical features rather than measuring everything the same way.
- **Use CMMs or specialist methods** for geometric relationships hand tools cannot measure.

## Common mistakes

- **Using callipers on tight tolerances.**
- **Measuring warm parts.**
- **Confusing resolution with accuracy.**
- **Ignoring roundness**, assuming a two-point measurement proves a round feature.
- **Dirty measuring faces and surface plates.**
- **Uncalibrated or damaged instruments still in use.**
- **Measuring every feature, but not the critical ones properly.**

## Frequently asked questions

**Do we need a CMM?** If your parts have tight positional or geometric tolerances, complex shapes or many features to measure, a CMM or access to one is often valuable. For simple parts with size tolerances, hand instruments and gauges may be enough.

**How often should instruments be calibrated?** It depends on use, risk and stability. Many businesses start with annual calibration for workshop instruments and adjust intervals based on results.

## Questions to ask

- Can each instrument we use resolve and accurately measure the tolerance it checks?
- Are parts measured at a stable temperature close to 20 °C?
- How do we check that instruments are accurate before use?
- Are our calibrations traceable, recorded and at suitable intervals?
- Which features are critical, and do we have an inspection plan for them?

## Bringing it together

Measuring instruments range from rules and callipers to micrometers, indicators, gauges, vision systems and CMMs, and each suits particular features and tolerances. Accuracy depends as much on technique, measuring force, alignment, temperature, cleanliness and calibration as on resolution. Matching instruments to tolerances, controlling the conditions of measurement, maintaining traceable calibration and planning inspection around critical features produces measurements that can be trusted, and therefore quality decisions that can be trusted too. Good measurement also starts upstream, with tolerances set only as tight as function requires.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. Always follow instrument manufacturers' instructions.*
