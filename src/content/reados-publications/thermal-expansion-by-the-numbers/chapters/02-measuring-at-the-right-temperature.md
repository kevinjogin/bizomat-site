---
book: thermal-expansion-by-the-numbers
chapterSlug: measuring-at-the-right-temperature
order: 2
title: "Measuring at the right temperature"
description: "Relate measured sizes to the 20 °C reference temperature, correct a warm part's reading, see why the instrument's own temperature matters, and set soak times and rules so good parts are not rejected."
draft: false
---

Every dimension on an engineering drawing is the size the part should have at a stated temperature, and unless the drawing says otherwise, that temperature is **20 °C**, the reference temperature set by ISO 1 for geometrical product specifications. A part measured at any other temperature is a different size from the one the drawing describes, by exactly the thermal growth from Chapter 1. For a steel part measured a few degrees off 20 °C, the difference is usually negligible. For an aluminium part measured hot from the machine, it can be larger than the whole tolerance.

This chapter puts numbers on measurement and temperature in HW-60's workshop. It explains the reference temperature, works out the error when a warm aluminium flowmeter body is measured with an instrument at room temperature, shows why measuring part and instrument at the same temperature helps only when they are the same material, gives a correction formula, sets soak times, and draws out rules for the workshop. The failure case is a batch of good parts rejected because they were measured warm.

## The reference temperature

Measuring instruments, gauge blocks, ring gauges and the scales of coordinate measuring machines are all made and calibrated to be correct at 20 °C. A drawing's dimensions describe the part at 20 °C. When both the part and the instrument are at 20 °C, a measurement compares like with like. When either is not, the measurement includes thermal growth that is not part of the part's true size.

Temperature-controlled inspection rooms exist to remove that error at its source, by keeping parts and instruments at or near 20 °C. Most small workshops have no such room, and parts are often measured on the shop floor, near machines, soon after cutting. That is where temperature errors arise.

## The flowmeter body

HW-60's workshop machines an aluminium flowmeter body with a bore of **200.000 mm**, with a tolerance of **+0.050 / −0.000 mm** at 20 °C. This is an illustration. Machining heats the part, and a body taken straight from the machine may be at **35 °C** while the workshop, the bore gauge and its setting ring are at **20 °C**.

A body whose bore is truly **200.020 mm** at 20 °C, comfortably within tolerance, grows with its temperature. At 35 °C, its bore is larger by aluminium's coefficient, 23 × 10⁻⁶ per °C, over 15 °C.

```figure
type: formula
title: Reading of a good aluminium bore measured at 35 °C
formula: D at T = D at 20 °C × (1 + α × (T − 20))
caption: This is an illustration. The bore gauge was set on a ring at 20 °C and stays at 20 °C; only the part is warm.
- True bore at 20 °C | 200.020 mm
- Aluminium α | 23 × 10⁻⁶ per °C
- Part temperature | 35 °C, 15 °C above reference
step: growth = 200.020 × 23 × 10⁻⁶ × 15 ≈ 0.069 mm
step: reading ≈ 200.089 mm, outside the 200.000 to 200.050 tolerance
```

The reading of about **200.089 mm** would reject a good part. The temperature error, about **0.069 mm**, is larger than the whole 0.050 mm tolerance band.

## When part and instrument share a temperature

If the bore gauge were also at 35 °C, as might happen if it had been lying beside the machine, it would grow too, and its reading would change. But the gauge is steel, about 12 × 10⁻⁶ per °C, and the part aluminium, 23. Each grows by its own coefficient, so the error that remains is the **difference** in their growth:

**(23 − 12) × 10⁻⁶ × 200 × 15 ≈ 0.033 mm**

The reading would be about **200.053 mm**, still just outside the tolerance. Equal temperatures cancel the error only when the part and instrument have the same coefficient: a steel part measured with a steel instrument, both at 25 °C, reads correctly even though both are off the reference temperature. That is why steel gauges are well suited to steel parts, and why aluminium, plastic and composite parts need more care.

```figure
type: compare
title: Reading the 200.020 mm aluminium bore under different conditions
cols: Part temperature | Gauge temperature | Reading | Verdict
caption: This is an illustration with an aluminium part at 23 and a steel gauge at 12 millionths per °C. Only measuring at the reference temperature, or correcting, gives the true size.
- Part hot, gauge at room | 35 °C | 20 °C | about 200.089 mm | wrongly rejected
- Both warm | 35 °C | 35 °C | about 200.053 mm | wrongly rejected, just
- *Both at reference | 20 °C | 20 °C | 200.020 mm | accepted, correctly
- Part hot, reading corrected | 35 °C | 20 °C | 200.089 corrected to 200.020 mm | accepted, if the temperature is known well
```

```figure
type: bars
title: Thermal error in a 200 mm dimension measured 15 °C above reference
unit: mm
max: 0.22
caption: This is an illustration: α × 200 mm × 15 °C, with the instrument at 20 °C. For comparison, the flowmeter body's whole tolerance band is 0.050 mm.
- Carbon steel, 12 | 0.036
- Stainless steel 304, 17.3 | 0.052
- *Aluminium, 23 | 0.069
- PVC, 70 | 0.21
```

## Measuring on the machine

Many machines now measure parts with a probe in the spindle before the part is unclamped. That saves handling, but the part is at its machining temperature and the machine's own structure is warm too. Two practices make on-machine measurement trustworthy. The first is to measure a **master**, a reference part of the same material and similar size whose true size at 20 °C is known, on the machine at the same time, so the probe's reading of the part can be compared with its reading of the master: both are at nearly the same temperature, and both are aluminium, so the thermal error largely cancels. The second is to treat on-machine measurements as process control, adjusting the machine's offsets, and to make the final acceptance measurement in the inspection area after soaking. HW-60's workshop does both for the flowmeter body's bore.

## Plastics need conditioning as well

Plastic parts add problems beyond their large coefficients. Many absorb moisture and change size as they do, and freshly moulded or machined plastic can relax and move for hours or days. Drawings for plastic parts often specify conditioning, a stated time at a stated temperature and humidity, before measurement. A plastic part measured warm and dry straight from the machine can be wrong by far more than its thermal growth alone suggests.

## Correcting a reading

If the part's temperature is measured, its reading can be corrected to 20 °C:

**D at 20 °C ≈ D measured ÷ (1 + α_part × (T_part − 20))**, with a further correction if the instrument is not at 20 °C.

Applied to the hot reading, 200.089 ÷ (1 + 23 × 10⁻⁶ × 15) gives **200.020 mm**, the true size. Correction works, but it depends on knowing the part's temperature accurately, which is harder than it sounds: a part straight off a machine is hotter in some places than others, and a surface thermometer reads only where it touches. An error of 2 °C in the assumed temperature of the aluminium body is an error of about **0.009 mm** in the corrected bore. For tight tolerances, waiting for the part to cool is more reliable than correcting it.

## Soak before measuring

The simplest remedy is to let parts reach room temperature before measuring critical dimensions. How long that takes depends on the part's mass, its surface area and how it is placed, following the cooling behaviour described in the companion book *Heat Transfer by the Numbers*. A thin aluminium part on a metal bench cools in minutes; a thick one standing on a wooden bench may take an hour or more.

The workshop measured it directly. A flowmeter body taken from the machine at about 35 °C, placed on an aluminium soak plate beside the inspection bench, was within 1 °C of the room in about **40 minutes**. That became the soak time written into the inspection procedure, with a contact thermometer check on the part before the bore is measured.

## Hands, lights and the sun

Smaller heat sources matter for tight tolerances. Holding a gauge block or a small part in a warm hand for a minute warms it noticeably; inspectors use gloves or tongs and handle masters as little as possible. Bench lights, a sunny window or a nearby machine's warm exhaust can warm one side of a part or instrument. A coordinate measuring machine in a corner that catches the afternoon sun may drift through the day. None of this matters for a coping or a gutter; for a 0.05 mm tolerance on aluminium, it can.

## Large parts and site measurement

Thermal growth affects large structures measured on site even more, because the lengths are large. A 40 m steel frame measured with a steel tape at the same temperature reads correctly, because both grow together. The same frame measured early on a cold morning and again in the afternoon sun, with the frame much hotter than the tape in the shade, will appear to have grown. Set-out for large steel or concrete work therefore notes the time, the temperature and the instrument, and critical dimensions are checked at similar times of day.

## Setting masters and their temperature

Comparative instruments, such as bore gauges and dial gauges on stands, are set to a known size with a **master**: a setting ring, a gauge block stack or a reference part. The master's calibrated size applies at 20 °C. If the master is warmer or colder than that when the instrument is set, the setting carries an error into every reading that follows. The workshop's 200 mm setting ring is steel; set at 25 °C, it is about **12 × 10⁻⁶ × 200 × 5 ≈ 0.012 mm** larger than its calibrated size, and every bore measured afterwards reads that much small. Masters are therefore kept in the inspection area, handled as little as possible, and allowed to settle before use. The calibration certificate's temperature, and the master's material, are both worth checking against the parts being measured. A steel ring used to set a gauge for aluminium parts is fine at 20 °C, but away from it the ring and the parts drift apart at different rates.

## Temperature in the measurement uncertainty

A measurement result is only as good as its uncertainty, and temperature is often the largest contributor in a workshop. When the inspection area is held within, say, ±2 °C of 20 °C, an aluminium 200 mm bore carries an uncertainty from temperature alone of about **23 × 10⁻⁶ × 200 × 2 ≈ 0.009 mm**, before the instrument's own uncertainty, the operator and the part's form are counted. On a 0.050 mm tolerance, that is nearly a fifth of the band. The [Choosing and using measuring instruments](/reados/collections/machining-and-metal-parts/choosing-and-using-measuring-instruments/) chapter explains how instrument uncertainty is judged against a tolerance. Temperature belongs in the same budget, and for aluminium it is often the term that decides whether an instrument is good enough.

## Workshop rules that follow

HW-60's workshop wrote four rules into its inspection procedure for parts with tolerances tighter than ±0.05 mm:

- measure critical dimensions only after the part has soaked to within 1 °C of the inspection area, checked with a contact thermometer;
- keep instruments and their setting masters in the inspection area, not beside machines;
- for aluminium and plastic parts, never rely on equal temperatures to cancel errors when measuring with steel instruments;
- record the part temperature with every critical measurement, so a doubtful result can be corrected or repeated.

## A failure case: the batch rejected warm

This is an illustration. During a busy week, the workshop machined a batch of 20 aluminium flowmeter bodies and inspected each one at the machine as soon as it came off. Eleven were recorded as oversize in the bore, by between 0.06 and 0.08 mm, and set aside for scrap or rework.

The next morning, the workshop supervisor, puzzled that a stable process had suddenly produced so many oversize parts, measured the eleven again on the inspection bench, now at room temperature. All eleven were within tolerance, most near the middle of the band. The rejected bores had been measured at around 35 to 40 °C.

The detection came from re-measuring the rejected parts cold, which turned an apparent process failure into a measurement error. The correction was the soak rule and the other workshop rules above. The eleven bodies were released, a week's rework avoided, and the inspection record format was changed to include a column for part temperature.

## How this applies to a small Australian business

Remember that drawings describe parts at 20 °C. For steel parts with ordinary tolerances, a few degrees either way rarely matters. For aluminium, plastics and tight tolerances, it does: calculate the thermal error as α × size × temperature difference and compare it with the tolerance. Let parts soak to room temperature before measuring critical features, keep instruments away from heat, and record part temperatures. Correct readings only when the temperature is well known. And when a stable process suddenly produces out-of-tolerance parts, check the temperature before adjusting the machine.

## Exercise: a steel shaft and an aluminium shaft

A steel shaft and an aluminium shaft, each **50.000 mm** in diameter at 20 °C, are measured at **28 °C** with a steel micrometer at 20 °C. What does each read? If the tolerance is ±0.010 mm, does either error matter?

**Worked answer.** The steel shaft grows by **12 × 10⁻⁶ × 50 × 8 ≈ 0.0048 mm**, reading about **50.005 mm**, about half the tolerance. The aluminium shaft grows by **23 × 10⁻⁶ × 50 × 8 ≈ 0.0092 mm**, reading about **50.009 mm**, almost the whole tolerance. On a ±0.010 mm tolerance, the steel shaft's error is significant and the aluminium's is enough to reject a part that is slightly oversize but good. Both should be measured after soaking to 20 °C, or corrected using a measured part temperature.
