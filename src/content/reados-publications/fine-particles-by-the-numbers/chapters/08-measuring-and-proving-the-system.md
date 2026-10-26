---
book: fine-particles-by-the-numbers
chapterSlug: measuring-and-proving-the-system
order: 8
title: "Measuring particles and proving the system works"
description: "Choose instruments that see LX-3's fume, sample dust without inertial bias, read particle counts with their counting uncertainty, and commission the extractor against its design numbers."
draft: false
---

An extraction system is proved by measurement, not by its specification sheet. The fan may be running, the pressure gauge may read normally and the air may look clean, while fume escapes at the table or passes the filter. The trouble is that every particle instrument sees only part of the size range, every sampling method can bias what it collects, and every count carries its own statistical uncertainty. A measurement that ignores those limits can prove anything.

This chapter matches instruments to LX-3's particle families, uses the Stokes number to explain why dust must be sampled isokinetically and fume need not be, uses electrical mobility to explain how sub-micron fume is sized, treats a particle count as a counting experiment with a known uncertainty, and sets out the commissioning measurements that tie the system back to its design numbers. The failure case is an outlet test that read "zero" because the instrument could not see the fume.

## What each instrument sees

Particle instruments differ in what they measure and in the sizes they can detect.

```figure
type: compare
title: Instruments for LX-3's particles
cols: What it measures | Sizes it sees | Used for
caption: This is an illustration of instrument classes, not of particular products. Size limits vary by model and are given in the maker's specifications. No single instrument covers LX-3's whole range.
- Gravimetric sampler | mass collected on a filter, weighed | all sizes the sampler's inlet admits | exposure against mass-based standards, by a hygienist
- Optical particle counter | light scattered by single particles | typically from a few tenths of a micrometre upwards | dust and coarse fume; filter leak scans with a test aerosol
- *Condensation particle counter | particles grown by vapour condensation, then counted | down to about 0.01 µm or below, total count only | fume number concentration; outlet checks
- Mobility sizer | drift of charged particles in an electric field | roughly 0.01 to 1 µm, by mobility diameter | fume size distributions
```

The **gravimetric** method, drawing air through a filter for hours and weighing it, is the basis of exposure monitoring against Safe Work Australia's workplace exposure standards, and sampling methods for inhalable and respirable dust are set out in Australian Standards. It is the job of an occupational hygienist, and its result is a time-weighted mass concentration. It says nothing about particle number or size.

The **optical particle counter** counts particles one at a time by the light each scatters, and sorts them into size bands. It is quick, portable and ideal for coarse dust and for scanning filters with a test aerosol. Its weakness is the smallest particles: below a few tenths of a micrometre, a particle scatters too little light to be detected reliably, so most of LX-3's fume, by number, is invisible to it.

The **condensation particle counter** gets around that by passing the sample through a supersaturated vapour, which condenses on every particle and grows it to a size that can be counted optically. It counts particles down to about 0.01 µm but does not size them.

The **mobility sizer** charges the particles, passes them through an electric field and sorts them by how fast they drift, which depends on their **electrical mobility**.

## Electrical mobility

A particle carrying a charge q in an electric field E feels a force qE, which drag resists. Its steady drift speed is qE times its mobility in the drag sense, and the electrical mobility is **Z = q C_c ÷ (3π μ d)**, the same slip-corrected friction coefficient that appeared in Chapters 3 to 5.

For a particle carrying one elementary charge, 1.602 × 10⁻¹⁹ C, LX-3's numbers give:

- a 1 µm particle, Z ≈ **1.1 × 10⁻⁹ m²/(V·s)**;
- a 0.1 µm particle, Z ≈ **2.7 × 10⁻⁸ m²/(V·s)**, a drift of about **2.7 mm/s** in a field of 100 kV/m;
- a 0.01 µm particle, Z ≈ **2.1 × 10⁻⁶ m²/(V·s)**, a drift of about **0.21 m/s** in the same field.

Mobility spans three orders of magnitude across the fume range, which is why it is such an effective way to size fume. The same physics underlies electrostatic precipitators, which charge particles and draw them onto collecting plates, and it is the reason the slip correction matters so much for fume: an error in C_c is an error in the size an instrument reports.

## Sampling dust: isokinetic or not

Sampling from a duct means drawing a small stream of air into a probe. If the air enters the probe at the same speed as the duct air around it, the streamlines run straight into the probe's mouth and the sample is representative: **isokinetic** sampling. If it enters more slowly, streamlines diverge around the mouth; if faster, they converge into it. Particles that follow the streamlines are unaffected. Particles with a significant Stokes number do not follow them, and are over- or under-sampled.

For LX-3's duct at 19.1 m/s and a 10 mm probe, the Stokes number at the probe mouth is about **2.98** for 10 µm dust, **0.034** for 1 µm dust and less than 0.001 for 0.1 µm fume. The coarse dust is badly biased by any mismatch in velocity, so dust sampling from LX-3's duct is done isokinetically, with the probe's flow set to the measured duct velocity at the sampling point. Fume follows the streamlines whatever the probe's speed, so fume sampling need not be isokinetic, though it still needs a short, clean sample line, as Chapter 5 showed.

## A count is a counting experiment

A particle counter counts discrete particles, and counts obey **Poisson statistics**: if the expected count in a sample is N, the count observed fluctuates from sample to sample with a standard deviation of √N. The relative uncertainty of a single count is therefore **1 ÷ √N**.

```figure
type: stats
title: Counting uncertainty for one-minute samples at 2.83 L/min
caption: This is an illustration. At the low concentrations found downstream of a good filter, counts are small and their relative uncertainty is large. About 400 counts are needed for a 5% relative uncertainty.
- 10 per litre | about 28 particles counted | about ±19%
- 100 per litre | about 283 particles counted | about ±5.9%
- *1,000 per litre | about 2,830 particles counted | about ±1.9%
- 400 counts | needed for ±5% | (1 ÷ 0.05)²
```

Counting uncertainty is only one part of a measurement's uncertainty. The instrument's flow rate, its counting efficiency at each size, coincidence losses at very high concentrations, sampling-line losses and the representativeness of the sampling point all add to it, and the instrument's calibration certificate and manual give the size of several of them. At low concentrations, however, counting statistics usually dominate, and they are the easiest part to reduce: sample for longer.

Downstream of LX-3's after-filter, concentrations are low, and a one-minute sample may count only a handful of particles. A count of 3 in one sample and 9 in the next does not show that the filter has failed; both are consistent with an expected count of about 6. Low counts need long samples, or many samples averaged, before a difference means anything. *Random Error and Drift by the Numbers* develops the same square-root rule for measurement noise in general.

### Efficiency by size band

When inlet and outlet are both measured with a sizing instrument, efficiency should be reported band by band, not as a single number. LX-3's commissioning report shows penetration for each of the instrument's size channels, with the counting uncertainty of each. The bands near the most penetrating size, from Chapter 6, have the highest penetration and the fewest counts at the outlet, and therefore the largest uncertainty; they are the bands sampled longest. A single overall efficiency, weighted by whatever happened to be in the inlet air that day, hides exactly the band that matters.

## Measuring airflow at the source

The particles cannot be captured if the air is not moving where they are made. LX-3's capture depends on a downdraught through the active zone of the table, and that is measured directly. With the zone open and a sheet on the slats, the fitter traverses the open area with a vane anemometer on a grid of points about 250 mm apart, averages the readings and multiplies by the open area. The design figures give a check: an average downdraught of about **0.4 m/s** over an active zone of about **1.5 m²** should correspond to the design flow of **0.60 m³/s**. If the traverse finds the average downdraught well below 0.4 m/s while the fan is delivering its design flow, air is entering somewhere else: through other zones' dampers that are not closing, through leaks in the plenum, or through joints in the duct, as Chapter 7 described.

Smoke tubes, which release a small visible stream of smoke, show what the anemometer cannot: where the air goes. Released around the cutting head, at the edges of the sheet and at the gaps between sheet and table, the smoke shows whether it is drawn down into the table or drifts away. A picture of smoke escaping at one corner of the table is worth more, in a commissioning report, than a page of averaged velocities.

## Leak scanning with a test aerosol

The after-filter leak scan in Chapter 6 needs a test aerosol: a steady, known challenge of particles near the most penetrating size, released upstream of the filter so that its concentration there is high and uniform. Downstream, a counter probe is moved slowly along the filter face and around its gasket, at a speed and distance set by the filter maker's procedure, so that any jet of unfiltered air through a pinhole or a gap is detected as a spike in the count. The test is meaningful only if the upstream challenge is high enough for a leak to stand out from the counting noise downstream; that is the counting rule of this chapter applied to a leak. Filter standards and makers' procedures specify how such scans are done; LX-3's commissioning followed the maker's.

## Commissioning LX-3

Commissioning ties the system back to the design numbers in earlier chapters, one measurement at a time.

```figure
type: steps
title: LX-3's commissioning measurements
caption: This is an illustration of the shop's commissioning sheet. Each measurement is compared with its design value, and any difference is explained before handover.
- Airflow at the active table zone | anemometer traverse; design downdraught about 0.4 m/s
- Duct velocity in the horizontal run | pitot traverse; design about 19.1 m/s
- Filter pressure drops, clean and at the cleaning set point | from the unit's gauges
- After-filter leak scan | test aerosol upstream, counter probe scanned downstream
- Fume number, inlet and outlet | condensation particle counter, long samples
- *Breathing-zone exposure | gravimetric sampling by the hygienist against the exposure standard
```

Each measurement on the sheet is recorded with the instrument used, its serial number and calibration date, the conditions at the time, including which machine zones were open and what was being cut, and the person who made it, so that a later measurement can be compared like for like.

The breathing-zone measurement is the one that ultimately matters, and it is not an engineering measurement: it is an exposure assessment, made by a competent hygienist with the methods and standards that apply. Everything before it is the engineer's evidence that the system is working as designed, so that when the hygienist's result arrives, its meaning is clear.

### Keeping it proved

Commissioning proves the system on one day. Fans wear, filters load, dampers drift and the material being cut changes. LX-3's controller logs the fan's speed and current and each filter's pressure drop continuously, and the shop repeats the table airflow traverse and the outlet count every six months, and after any change to the machine, the ductwork or the filters. The trend in those numbers, not any single reading, shows whether the system is holding its design performance. A table downdraught that has fallen by a few per cent each time it is measured is a warning long before the operators notice fume escaping.

## A failure case: zero at the outlet

This is an illustration. On an earlier fume extractor, an installer used an optical particle counter to check the outlet, found almost no particles in any channel and reported the filter "99.99% efficient" from the ratio of inlet to outlet counts.

Months later, a hygienist's survey found fume in the workshop at levels that did not match that claim. The detection came from repeating the outlet test with a condensation particle counter, which counts down to about 0.01 µm: the outlet concentration by number was a small but significant fraction of the inlet's, almost all of it in particles below 0.3 µm, which the optical counter's lowest channel could not see. The filter was a dust-grade cartridge with no after-filter, and the "99.99%" had been calculated on the particles that were easiest to catch.

The correction was a fume-rated cartridge and an after-filter, tested with the condensation counter and leak-scanned. The shop's commissioning procedure now names the instrument and its lower size limit next to every particle measurement, and reports efficiency only for the size range the instrument actually covers.

## How this applies to a small Australian business

Match the instrument to the particles: gravimetric sampling for exposure, optical counters for dust and leak scans, condensation counters or mobility sizers for fume. Sample dust isokinetically and keep fume sample lines short. Treat every particle count as a counting experiment with an uncertainty of about 1 ÷ √N, and collect enough counts before concluding anything. Commission the system against its design numbers, record which instrument made each measurement and what it could see, and leave exposure assessment to a competent hygienist.

## Exercise: is the filter getting worse?

At LX-3's outlet, a condensation particle counter sampling 0.3 L/min recorded 18 particles in one 5-minute sample in March and 32 in an identical sample in June. What were the concentrations per litre, and their counting uncertainties? Is the increase clearly real? How long a sample would give about 100 counts at the June concentration?

**Worked answer.** Each sample drew **0.3 × 5 = 1.5 L**. March: **18 ÷ 1.5 = 12 per litre**, with a counting uncertainty of **√18 ≈ 4.2** counts, about **±24%**. June: **32 ÷ 1.5 ≈ 21 per litre**, uncertainty **√32 ≈ 5.7** counts, about **±18%**. The difference, 14 counts, is about **14 ÷ √(18 + 32) ≈ 2.0** combined standard deviations: suggestive, but not conclusive from one sample each. At about 21 per litre, 100 counts need about **100 ÷ 21 ≈ 4.7 L**, about **16 minutes** at 0.3 L/min; longer samples, repeated, would settle the question.
