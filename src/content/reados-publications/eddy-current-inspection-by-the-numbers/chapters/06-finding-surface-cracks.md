---
book: eddy-current-inspection-by-the-numbers
chapterSlug: finding-surface-cracks
order: 6
title: "Finding surface cracks"
description: "Scanning ground journals for cracks: reference notches, signal and noise, the alarm threshold, scan pitch and coverage, how scan speed meets the instrument's filters, and charting rejects."
draft: false
---

Grinding a hardened surface can crack it. If the wheel is dull, the feed too heavy or the coolant poor, the surface layer is heated far beyond the temperature at which it was tempered, softened or even rehardened, and then quenched by the coolant. The stresses that follow can open fine cracks, often in a network or in lines across the grinding direction, too fine to see without help. On a pump shaft's bearing journal, such a crack is where a fatigue failure will start. Eddy-current testing finds them quickly on a rotating journal, but only if the scan covers the whole surface, the instrument can see the smallest crack that matters, and the alarm is set where it catches cracks without crying wolf.

This chapter sets up the PH-6 shafts' journal scan: reference notches, signal and noise, the alarm threshold, the scan plan and coverage. Its mistake is a speed-up that made the scanner blind to the cracks it was meant to find. It finishes by charting the daily rejects.

## The journals and the probe

Each PH-6 drive shaft has two bearing journals, 25 mm in diameter and 40 mm long, induction hardened to a case of about 2 mm and ground. The scanner holds the shaft between centres and rotates it, while a probe holder, riding the journal on a wear shoe, indexes along its length. The probe is an array of four small differential coils side by side, each sensitive over a footprint about 1.5 mm wide, run at 200 kHz, where the currents in the hardened steel are confined to about the top 0.06 mm (Chapter 2). The differential connection ignores the slow changes in permeability along a journal and responds sharply to a crack passing under first one coil of a pair and then the other.

## Reference notches, signal and noise

A scanner is set up on a reference standard: a journal of the same steel, hardness and finish as production, with artificial flaws of known size cut into it by electrical discharge machining. The pump maker's reference journal carries three notches across the grinding direction, each 0.1 mm wide and 5 mm long, at depths of 0.2, 0.5 and 1.0 mm.

The gain is set so that the 0.5 mm notch, the smallest crack the drawing requires the test to find, gives a vertical signal of 2.6 divisions on the display. With that gain, the other notches and the background give:

```figure
type: bars
title: Signal amplitude from the reference journal's notches and the background noise, at the set gain
x: Source
y: Vertical signal, divisions
caption: This is an illustration. Notches 0.1 mm wide and 5 mm long. The noise is the standard deviation of the vertical signal over sound, ground journal surface. The alarm threshold is 1.3 divisions, half the 0.5 mm notch's signal.
- Noise, 1 standard deviation | 0.25
- * Alarm threshold | 1.3
- 0.2 mm notch | 1.0
- 0.5 mm notch | 2.6
- 1.0 mm notch | 4.4
```

The signal grows with notch depth but not in proportion: doubling the depth from 0.5 to 1.0 mm raises it by about 70%. As Chapter 2 noted, the relation between a crack's depth and its signal depends on the probe, frequency and steel, and must be measured on notches, not calculated. Real grinding cracks are also tighter and more irregular than a clean EDM notch, so a crack of a given depth usually gives a smaller signal than a notch of the same depth. That is one reason the threshold is set below the target notch's signal, not at it.

## Setting the threshold

The alarm threshold must be low enough to catch the cracks that matter and high enough not to fire on noise. The noise on a sound journal is roughly normally distributed with a standard deviation of 0.25 divisions. The pump maker sets the threshold at half the 0.5 mm notch's signal, 1.3 divisions, which is 5.2 standard deviations of noise.

That may look excessive. The reason is the number of chances the noise gets. A journal's scan covers 40 mm × π × 25 mm of surface with a 1.5 mm footprint, the equivalent of about 2,800 independent looks at the surface. If each look has a one-sided chance p of exceeding the threshold by noise alone, the chance of at least one false call on a journal is 1 − (1 − p) raised to the 2,800th power.

```figure
type: compare
title: False calls and detection for two thresholds, noise standard deviation 0.25 divisions
cols: In noise standard deviations | Chance per look of a false call | Chance of a false call per journal | Chance of detecting a 0.2 mm notch | Chance of detecting a 0.5 mm notch
rowhead: Threshold
- 0.75 divisions | 3.0 | 0.13% | 97.7% | 84.1% | Practically certain
- * 1.3 divisions | 5.2 | 1.0 × 10⁻⁷ | 0.028% | 11.5% | Practically certain
caption: This is an illustration. About 2,800 independent looks per journal, normally distributed noise. Detection is the chance that the notch's signal plus noise exceeds the threshold.
```

A threshold at three standard deviations, which sounds strict, would raise a false alarm on almost every journal, 97.7% of them. At 5.2 standard deviations, the chance of a false call on a journal falls to about 3 in 10,000, while the 0.5 mm notch's signal of 2.6 divisions is still 5.2 standard deviations above the threshold and is detected practically every time. The price is that a 0.2 mm notch, with its 1.0 division signal, is caught only 11.5% of the time. That is acceptable because the drawing calls for the test to find cracks of 0.5 mm and deeper, and the procedure says so plainly. A test never finds everything; its procedure should state what it reliably finds.

Chapter 9 returns to this balance between false calls and missed flaws, and to the probability of detection, for the whole inspection system.

## Covering the surface

A crack that never passes under a coil is never found. The scan is a helix: as the journal turns, the probe indexes along it, and the index per revolution must be small enough that each element's paths overlap. The pump maker's rule is an index no more than half the footprint, so every point on the surface passes under at least two coil positions.

With a single 1.5 mm element, that means an index of 0.75 mm per revolution: 40 ÷ 0.75 = 53.3 revolutions per journal, a helical path of 53.3 × 78.5 = 4,190 mm. With the four-element array side by side, each element covers its own quarter of the band, and the index can be four times as large, 3.0 mm per revolution, while every point still passes under two positions: 13.3 revolutions per journal.

```figure
type: compare
title: Scan plans for a 25 × 40 mm journal
cols: Index per revolution | Surface speed | Revolutions | Time per journal | Time per shaft | Signal frequency
rowhead: Probe and speed
- One element, original | 0.75 mm | 50 mm/s, 38 rpm | 53.3 | 83.8 s | 167.6 s | 33 Hz
- One element, sped up | 0.75 mm | 200 mm/s, 153 rpm | 53.3 | 20.9 s | 41.9 s | 133 Hz
- * Four-element array | 3.0 mm | 50 mm/s, 38 rpm | 13.3 | 20.9 s | 41.9 s | 33 Hz
caption: This is an illustration. Signal frequency is the surface speed divided by the 1.5 mm footprint: the rate at which a short crack passes through the coil's field.
```

## The mistake: faster, and blind

The scanner was installed with a single element. At 167.6 s a shaft it could not keep up with the grinder, and a production engineer, seeing that the drive could turn four times faster, raised the surface speed from 50 to 200 mm/s. The scan time fell to 41.9 s a shaft, matching the grinder, and for two weeks the scanner passed every shaft.

Then a customer returned a pump with a cracked journal. The start-of-shift check on the reference journal had been run as the procedure then said, at the set-up speed of 50 mm/s, and had passed. When the quality engineer ran the reference journal at the production speed of 200 mm/s, the 0.5 mm notch gave 1.1 divisions, below the 1.3 division threshold.

The cause was the instrument's filters. A crack passing under a 1.5 mm coil at speed v produces a signal pulse whose frequency is about v ÷ 1.5 mm: 33 Hz at 50 mm/s. The instrument's band-pass filter, set at commissioning to 10 to 100 Hz to reject slow permeability changes and electrical noise, passed it untouched. At 200 mm/s the pulse is at 133 Hz, above the filter's upper corner, and the filter cut most of it away.

```figure
type: steps
title: How the speed-up was found and fixed
caption: This is an illustration. The two weeks' shafts were traced by serial number and rescanned.
- Symptom | A returned pump with a cracked journal that the scanner had passed
- Check at production speed | 0.5 mm notch at 200 mm/s gave 1.1 divisions, below the 1.3 threshold
- * Cause | Crack signal at 133 Hz, above the 100 Hz filter; set-up check had been run at 50 mm/s
- Immediate action | Speed back to 50 mm/s; 1,840 shafts from the two weeks rescanned; 6 more cracked shafts found and scrapped
- Permanent fix | Four-element array at 50 mm/s: same 41.9 s a shaft, signal still at 33 Hz
- Procedure | Reference checks run at the production speed and filter settings, at the start of each shift and every two hours
```

The four-element array gave the same speed-up without changing the signal frequency, because it covers more surface per revolution instead of turning faster. The deeper lesson is about the reference check: a check is only valid if it is run exactly as production runs, at the same speed, filters, gain and probe. The procedure now requires every reference check to run on the scanner's production program.

## Edges, holes and fillets

A journal is not a plain cylinder. Each PH-6 journal ends in a fillet radius where it meets a shoulder, and one journal has a cross-drilled oil hole. The edge of a hole or the start of a shoulder interrupts the eddy currents just as a crack does, and gives a large signal that would trip the alarm on every shaft. The scanner's program therefore blanks the alarm over the oil hole's position, which it knows from the shaft's orientation on the centres, and stops the helical scan 1 mm short of each fillet.

Blanking a zone means not inspecting it, so the zones are inspected another way. The oil hole's edge, a classic site for grinding cracks and fatigue, is checked by hand with a small pencil probe that follows the hole's edge, set up on a reference hole with a notch at its edge. The fillets are checked with a probe shaped to the fillet's radius on a separate pass. The procedure lists each blanked zone and the method that covers it, so that no part of the surface is left uninspected by oversight.

## Lift-off at the probe

The wear shoe that carries the probe holds it at a fixed small distance from the journal, so that lift-off stays constant as the shaft turns. As the shoe wears, the probe moves closer, the coupling rises and the signals grow, which raises the false call rate; a shoe that chips or catches a burr lifts the probe and weakens every signal. The shoe is a consumable, replaced on a fixed count of shafts, and the reference journal's notch signals are watched for the steady rise that shows a worn shoe. With the phase set so that lift-off is horizontal, as in Chapter 1, a sudden lift-off from a burr shows as a horizontal excursion and does not trip the vertical alarm, but it still weakens any crack signal at that moment.

## Confirming an indication

An alarm is an indication, not a crack. The procedure takes every alarmed shaft through three steps before it is scrapped. First, the journal is rescanned at the same settings; an indication that does not repeat is recorded as a false call and the shaft released, and the false call rate is watched as a measure of the scanner's health. Second, a repeating indication is located on the journal and examined with fluorescent magnetic particle inspection, which shows surface-breaking cracks in steel as bright lines under ultraviolet light. Third, where grinding burn is suspected, a sample of affected shafts is etched with a weak acid etch that darkens tempered or rehardened zones, confirming the cause for the grinder. Only confirmed cracks count as rejects on the p-chart, so that the chart measures the grinding process and not the scanner's false calls.

## Charting the rejects

The scanner tests about 200 shafts a day. The number rejected for crack indications, confirmed by a second scan and a magnetic particle check, is a measure of the grinding process's health. The [p-chart check tool](/tools/p-chart-check/) charts the fraction rejected each day against control limits from the binomial distribution.

```figure
type: steps
title: Ten days of journal crack rejects in the p-chart check tool, 200 shafts a day
caption: This is an illustration. Rejects per day: 1, 0, 2, 1, 0, 1, 7, 1, 0, 1.
- Average fraction rejected | 0.7%
- Standard deviation of the daily fraction | 0.0059
- Control limits | 0% to 2.469%: 5 or more rejects in a day signals
- * Day 7, 7 rejects | Outside the upper limit: SAMPLE OUT OF CONTROL
- Lower limit | Zero: larger samples would be needed to show an improvement
```

Day 7's seven rejects were a special cause. The grinding log showed that the wheel had not been dressed that morning after a change of wheel batch, and the dull wheel had burned the journals. The rejected shafts' journals showed grinding burn when etched, confirming the cause. A daily dressing check was added to the grinder's start-up routine. The chart did what the scanner alone could not: it turned individual rejects into evidence about the process that made them. With an average of 0.7% and 200 shafts a day, the lower control limit is zero, so the chart can show a deterioration but not an improvement. To see whether the dressing check lowered the reject rate, the quality engineer compares longer periods, the confirmed rejects in the month before and the month after, rather than looking for a single good day.

## Exercise: a faster array

With the four-element array, could the scanner run at 75 mm/s without the filter problem? Find the signal frequency, the time per journal and per shaft, and the rotation speed, keeping the 3.0 mm index per revolution. What must be done before running production at the new speed?

### Answer

The signal frequency is 75 ÷ 1.5 = 50 Hz, inside the 10 to 100 Hz band, so the filter will pass the crack signal. Each journal still needs 40 ÷ 3.0 = 13.3 revolutions, a path of 13.3 × 78.5 = 1,047 mm per element, which takes 1,047 ÷ 75 = 14.0 s, or 27.9 s a shaft. The journal turns at 75 ÷ 78.5 × 60 = 57.3 rpm.

Before production, the reference journal must be run at 75 mm/s with the production filters, gain and program, and the 0.5 mm notch must still give its 2.6 divisions, or the gain be reset so that it does, with the noise and threshold re-checked. Only a reference check at the new speed shows that the scanner still sees the cracks it is meant to find. If it passes, the scan time falls from 41.9 s to 27.9 s a shaft, a third less, with no change in what the scanner can find.
