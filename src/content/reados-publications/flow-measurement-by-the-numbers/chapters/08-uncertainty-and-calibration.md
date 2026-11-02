---
book: flow-measurement-by-the-numbers
chapterSlug: uncertainty-and-calibration
order: 8
title: "Uncertainty and calibration"
description: "Reading an accuracy specification, percentage of reading against span, zero stability at low flow, an orifice uncertainty budget, calibration and in-place checks, and a meter quoted in full scale."
draft: false
---

Every flowmeter's datasheet states an accuracy, and almost every accuracy statement hides a condition. Half a per cent of what: of the reading, of the maximum flow, of the span the instrument is set to? Under what conditions: in the maker's laboratory, with water at 20 °C, after 50 diameters of straight pipe? And plus what: a zero term, a repeatability, a temperature effect? An engineer who reads the headline figure and stops there will expect a meter to be ten times better than it is at the flows where it matters.

This chapter shows how to read an accuracy specification, compares percentage-of-reading and percentage-of-span statements across a meter's range, adds the zero term that dominates at low flows, builds an uncertainty budget for the hot liquor orifice meter, describes calibration in a laboratory and checks in place, and finishes with a rinse-water meter whose ±1% turned out to be ±10% at the flow it was actually used at.

## Reading an accuracy specification

Makers state accuracy in one of a few forms, often combined.

```figure
type: compare
title: Common forms of a flowmeter accuracy statement
cols: Means | Typical of
rowhead: Statement
- ±0.4% of reading | the error is a fixed fraction of whatever the meter reads | magnetic, Coriolis, ultrasonic in-line meters over most of their range
- ±1% of full scale, or of span | the error is a fixed flow, a fraction of the maximum | differential pressure transmitters, simple meters, many older instruments
- ± a zero stability | a fixed flow error added to the percentage term | Coriolis in kg/h, magnetic in mm/s, ultrasonic in m/s or ns
- ±0.1% repeatability | the scatter of repeated readings, not their bias | almost all meters
caption: Each statement applies under the maker's reference conditions; installation, temperature, fluid and age add to it. The total is usually the percentage term plus the zero term at the flow in question.
```

The difference between the first two forms is the most important. A meter accurate to 1% of reading is 1% wrong at any flow. A meter accurate to 1% of full scale is wrong by a fixed amount, 1% of its maximum, whatever it reads, which at a tenth of full scale is 10% of the reading.

## The zero term at low flow

Meters whose headline accuracy is a percentage of reading usually add a zero stability, a fixed flow or velocity within which the zero can be relied on. At high flows it is negligible; at low flows it dominates.

For FT-101, the magnetic water meter, take the maker's statement as ±0.4% of reading plus ±1 mm/s. In its 80.0 mm bore, the zero term is a fixed 1 mm/s, so its share of the reading grows as the flow falls.

```figure
type: compare
title: FT-101's accuracy across its range, ±0.4% of reading plus ±1 mm/s
cols: Mean velocity | Zero term as a share of reading | Total, added linearly
rowhead: Flow
- 30 m³/h | 1.658 m/s | 0.06% | ±0.46%
- 15 m³/h | 0.829 m/s | 0.12% | ±0.52%
- 3 m³/h | 0.166 m/s | 0.60% | ±1.0%
- 0.5 m³/h, night | 0.028 m/s | 3.6% | ±4.0%
caption: This is an illustration of a typical magnetic meter specification. Adding the terms linearly is the cautious practice for a specification limit; a statistical combination would give a smaller figure.
```

At its normal flows FT-101 is accurate to about half a per cent. At the overnight flow it is accurate to about 4%, which is still useful for spotting a leak that doubles the night flow, but not for measuring that flow precisely. The same meter is a good meter and a poor one depending on where in its range it works, which is why Chapter 10 chooses meter size on the range of flows, not the maximum.

## Repeatability and averaging

Repeatability is the scatter of a meter's readings under unchanged conditions. It is usually much smaller than the accuracy, a tenth of a per cent against half a per cent, and it describes random scatter rather than bias. Averaging reduces it: a meter that scatters by 0.1% on single one-second readings scatters by about 0.1 ÷ √60 = 0.013% on one-minute averages, and a totaliser over a whole batch averages so many readings that its repeatability vanishes into its bias. That is why totals are usually more trustworthy than instantaneous flows, and why a meter used for control, which acts on the instantaneous reading, may need more damping, and so a slower response, than one used only for totals.

A meter's bias, the part of its error that does not average out, is what calibration finds and corrects. A totaliser on a meter that reads 0.5% high reads 0.5% high over a day, a month and a year, and no amount of averaging changes it.

## Reference conditions and the plant

A specification applies under the maker's reference conditions: usually water at about 20 °C, a long straight pipe, a steady flow and a stable ambient temperature. The plant rarely matches them. Hot liquor at 80 °C, glycol at −2 °C, a short straight run, a vibrating pipe or a meter in direct sun all add to the error, and makers state some of these effects, such as a temperature coefficient or a vibration limit, in the specification's fine print. The honest way to state a meter's uncertainty in service is its specification plus an allowance for each departure from the reference conditions, which the brewery's estimates later in this chapter include.

## An uncertainty budget for the orifice meter

The orifice meter's uncertainty can be built from its parts, because its equation is known. Each input's uncertainty contributes to the flow's in proportion to how strongly the flow depends on it: the flow goes as the discharge coefficient, as the square of the bore, and as the square root of the differential and of the density.

```figure
type: compare
title: Uncertainty of FT-301's mass flow at 15 m³/h, standard uncertainties
cols: Input uncertainty | Sensitivity | Contribution to flow
rowhead: Source
- Discharge coefficient | 0.5% | 1 | 0.50%
- Orifice bore, ±0.02 mm on 37.62 mm | 0.053% | about 2.1, including its effect through E | 0.11%
- Differential, ±0.1% of span at 162.4 mbar | 0.18% of the differential | ½ | 0.09%
- Density from temperature, ±1 K at 80 °C | 0.062% | ½ | 0.03%
- * Combined | — | — | 0.52%
- Expanded, k = 2 | — | — | 1.04%
caption: This is an illustration. The coefficient's uncertainty is taken as a typical figure for a plate made and installed to the standard; the plate's actual figure comes from ISO 5167-2. Contributions are combined by root-sum-square.
```

The coefficient dominates: the most careful measurement of the differential cannot make the plate more accurate than its coefficient. Spending money on a better transmitter would change the combined figure from 0.52% to about 0.51%; calibrating the plate in a laboratory, which replaces the standard's coefficient uncertainty with the laboratory's much smaller one, would halve it. The method, converting each input's uncertainty to a standard uncertainty, multiplying by its sensitivity and combining by root-sum-square, is the general one. The [measurement uncertainty budget tool](/tools/measurement-uncertainty-budget/) applies it to dimensional measurements, with terms for calibration, resolution, repeatability, Abbe error and temperature in micrometres; the flow budget here was built by hand in percentages, with the same logic.

## Calibration

A meter is calibrated by comparing it with a reference of much smaller uncertainty, over its range, at conditions close to its use.

**Gravimetric rigs** weigh the liquid collected in a tank over a timed period, with diverters that switch the flow into and out of the tank quickly enough that the switching error is negligible. They give the smallest uncertainties, a few hundredths of a per cent, and are used by meter makers and accredited calibration laboratories.

**Master meter rigs** pass the flow through a reference meter, itself calibrated gravimetrically, in series with the meter under test. They are quicker and cheaper, at a somewhat larger uncertainty.

**In-place checks** compare the meter with something the process provides: a tank of known volume filled or emptied, a weighed batch, a second meter in series. Their uncertainty is larger and must be worked out for each check, but they test the meter in its own installation, which a laboratory calibration cannot.

**Electronic verification**, offered by many magnetic and Coriolis meters, checks the meter's own electronics, coils or tubes against stored values. It confirms that the meter has not changed since its calibration; it says nothing about its installation.

The brewery has FT-101 and FT-201 calibrated by an accredited laboratory when they are new and every five years, uses electronic verification every year, and checks every meter in place against tank volumes or weighed batches as the earlier chapters described.

### Traceability

A calibration is only as good as the reference it was compared with, and that reference's own calibration, back to national standards. In Australia, calibration laboratories accredited by NATA, the National Association of Testing Authorities, issue certificates that state the meter's errors at each test point with their uncertainties and the traceability of the reference. A certificate without an uncertainty, or from a laboratory not accredited for flow, says little about how far the meter can be trusted. The brewery files each certificate with the meter's record and copies its errors into the control system's correction where the meter allows it.

## Drift and calibration intervals

A meter calibrated today will not stay exactly as it is. Electrodes coat, tubes wear, electronics age, and the installation changes around it. The calibration interval should be set from how fast a meter actually drifts, which is known only from its history. Each calibration's as-found result, before any adjustment, is the evidence: a meter found within its specification at three successive calibrations can have its interval lengthened; one found outside it needs a shorter interval and an investigation of every reading since the last good calibration.

The brewery's history for FT-201 shows as-found errors of +0.04%, +0.06% and +0.05% at its last three calibrations, well inside its ±0.15% specification, which supports the five-year interval. FT-301's plate inspections have found no change in its edge or bore, but its transmitter's zero has drifted by about 0.2 mbar a year, which the monthly zero check catches.

## When two meters disagree

Two meters measuring the same flow will not agree exactly, and the question is whether their disagreement is larger than their uncertainties allow. If the two are independent, the expected scatter of their difference is the root-sum-square of their expanded uncertainties. FT-101, at about ±0.6% in service, and the water authority's meter, at perhaps ±2% for a meter of its class, should agree within about √(0.6² + 2²) = ±2.1%. Their 2.4% disagreement in Chapter 2 was just outside that, which was a reason to investigate; their later agreement within 1% is well inside it and says nothing more about either meter. A disagreement outside the combined uncertainty points to a fault in one of them or in the installation; one inside it does not show which meter is the better.

## The mistake: a rinse-water meter quoted in full scale

The brewery's cleaning-in-place system returns rinse water through a small paddle-wheel meter, installed to account for water use in cleaning. Its datasheet stated ±1% accuracy, and the water balance treated it as a 1% meter. Rinse flows were usually about 2 m³/h. The monthly water balance, comparing FT-101's intake with the sum of the measured uses, never closed: about 1.5 m³ a day was unaccounted for, and the brewery suspected a leak.

```figure
type: steps
title: Finding a 10% meter behind a 1% datasheet
caption: This is an illustration. ±1% of a 20 m³/h full scale is ±0.2 m³/h at any flow.
- Datasheet | ±1%, read as 1% of reading
- Fine print | ±1% of full scale; full scale 20 m³/h
- At the rinse flow of 2 m³/h | ±0.2 m³/h, ±10% of the reading
- In-place check against a 1,000 L tank | meter read 8% low at 2 m³/h
- * Effect on the water balance | rinse water under-recorded by about 1.3 m³ a day, most of the unaccounted water
- Fix | meter replaced with a small magnetic meter sized for 0.5 to 4 m³/h; balance gap fell below 0.3 m³ a day
```

The datasheet's ±1% was of full scale, 20 m³/h, so the meter's uncertainty was ±0.2 m³/h at any flow: ±10% at the 2 m³/h it actually measured. An in-place check against a 1,000 L tank showed it reading 8% low at that flow. Over a day of cleaning, the under-recording came to about 1.3 m³, most of the water balance's gap. The meter was replaced with a small magnetic meter sized for the rinse flows, and the gap fell to below 0.3 m³ a day, within the combined uncertainty of the meters in the balance. The suspected leak did not exist. The brewery's purchasing specification for meters now asks for accuracy as a percentage of reading, with the zero term and the reference conditions stated, and for any percentage-of-full-scale figure to be converted to the expected flows before a meter is accepted.

## Total uncertainty in service

A meter's uncertainty in service combines its specification with everything the installation and the fluid add: profile effects from short straight runs, temperature and pressure different from the calibration conditions, wear, deposits and drift since calibration. For FT-101 after its relocation, the brewery's estimate is about ±0.6% at normal flows, the specification plus an allowance for installation, confirmed by its agreement with the water authority's meter. For FT-501, the clamp-on meter, the estimate is ±3% even after the wall thickness is measured, because its profile factor and transducer spacing carry more uncertainty than an in-line meter's factory geometry.

## Exercise: the Coriolis meter at batching flows

FT-201's maker states ±0.15% of reading plus a zero stability of ±0.6 kg/h. The wort line runs at 12,576 kg/h for most of a transfer, and at 1,500 kg/h for the last minute to limit the overrun, as Chapter 5 described. Calculate the meter's accuracy at both flows, adding the terms linearly, and the error in a 2,620 kg transfer of which 25 kg are delivered at the low flow. Then say which term matters.

### Answer

**Given:** ±0.15% of reading; zero ±0.6 kg/h; flows 12,576 and 1,500 kg/h; transfer 2,620 kg, 2,595 kg at high flow and 25 kg at low flow.

**Assumptions:** the zero term applies at its full value at both flows; the percentage term is the same bias across the transfer.

**Method:** total = percentage term + zero ÷ flow; transfer error = sum of each portion's mass × its accuracy.

**At 12,576 kg/h:** zero term 0.6 ÷ 12,576 = 0.005%; total ±0.155%.

**At 1,500 kg/h:** zero term 0.6 ÷ 1,500 = 0.04%; total ±0.19%.

**Transfer:** 2,595 × 0.155% + 25 × 0.19% = 4.02 + 0.05 = ±4.1 kg, about ±0.16% of 2,620 kg.

**Which term matters:** the percentage term. Even at the low batching flow the zero contributes only 0.04%. A Coriolis meter's zero matters at flows a hundred times smaller than its normal flow, not at a slowed batch.

**Verification:** the transfer's error divided by its mass, 4.1 ÷ 2,620 = 0.156%, is close to the high-flow accuracy, as it should be when 99% of the mass passes at that flow.
