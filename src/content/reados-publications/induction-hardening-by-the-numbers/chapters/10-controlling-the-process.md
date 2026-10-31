---
book: induction-hardening-by-the-numbers
chapterSlug: controlling-the-process
order: 10
title: "Controlling the process"
description: "Keeping induction hardening the same part after part: monitoring each heat, charting case depth, control limits against specification limits, capability, and a chart that hid its signal."
draft: false
---

An induction hardening recipe, once proved, is only as good as the machine's ability to repeat it on every part. The heat lasts seconds and cannot be watched; the case cannot be seen without destroying the part; and the things that change it, a coil knocked out of position, a warming quench bath, a different delivery of steel, change it quietly. Control therefore rests on two kinds of evidence: what the machine measures on every part as it heats, and what the laboratory measures on a sample of parts afterwards. Each catches what the other misses, and neither is enough without the start-of-shift checks that look at the coil and the quench directly.

This chapter describes how the IH-40 line monitors every heat, charts the laboratory's case depth results with a WORKOS control chart tool, judges the process's capability with another, and works through a chart that hid a real change by recalculating its limits with the change included.

## Monitoring every heat

Modern induction machines record, for every part, the quantities that define the heat: the power and frequency through the heat, the energy delivered, the heating and quench times, the dwell between them, the quench flow and temperature, and the coil's cooling. Each is compared with a band around its proven value, and a part outside any band is rejected automatically or held for inspection.

This is an illustration. The IH-40's recipe delivers about 228 kJ from the generator in its 4-second heat. The machine's energy band is ±4%, 219 to 237 kJ. A part outside it is diverted to a quarantine bin, and three in a row stop the machine. The quench flow, bath temperature (Chapter 6), coil water flow and part rotation are interlocked: if any is out of range, the heat does not start.

```figure
type: compare
title: What the IH-40 machine monitors on every part, and what it can miss
cols: Catches | Misses
rowhead: Monitored quantity
- * Energy from the generator | wrong time or power setting, generator faults, a part not in the coil | energy lost in a widened coil gap: the generator delivers it, the part does not receive it
- Frequency through the heat | a missing or different part, a changed coil | small changes in coupling
- Quench flow and bath temperature | pump faults, blocked lines, a warm bath | a few blocked spray holes
- Heating, dwell and quench times | controller or program changes | nothing within its own scope
caption: This is an illustration. The machine's monitoring is necessary but not sufficient: the coil's position and the spray holes need their own checks (Chapters 4 and 6), and the case itself is only seen by sectioning (Chapter 8).
```

The table's right-hand column is why the knocked coil of Chapter 4 passed the energy monitor: the generator delivered its normal energy, but less of it reached the shaft. Monitoring the coil's current and voltage as well as the generator's output, which some machines do, narrows the gap; the start-of-shift coil gap check closes it.

### Linking machine data to the case

The machine's records and the laboratory's results are most useful together. When the recipe was proved, the manufacturer deliberately hardened shafts across the edges of its energy band and sectioned them, and found that within the ±4% band the case depth varied by only a few hundredths of a millimetre either side of its mean. That trial is what justifies the band: a part inside it is very unlikely to have a case outside the specification, provided the coil, quench and steel are as proved. Outside the band, the relationship is no longer known, which is why such parts are quarantined rather than passed on a guess.

The link also works the other way. When a check shaft's case depth moves, the energy, frequency and bath temperature records for the same period are the first place to look, and a change in any of them usually points straight to the cause.

### Change control

Almost every error in this book began with a change: a coil knocked and reset, a heating time extended, a steel bought from a different mill, a production rate raised in hot weather, a feature added to a drawing. The process itself was sound; what failed was the assumption that a small change did not matter. The manufacturer's change control is therefore simple and strict. Any change to the coil, the recipe, the quench, the steel's source or condition, the part's drawing in or near the hardened zone, or the line's rate requires a short written assessment, sectioned parts before production continues, and the quality engineer's approval. Planned changes are cheap to control; unplanned ones are found only by the monitoring and the chart.

### Training and audits

The people on the line are part of the process. Operators are trained in what each monitored quantity means, why a quarantined part is never simply re-run, and how to do the start-of-shift checks; laboratory technicians are trained in sectioning, the validity rules and the traverse procedure (Chapter 8). Many customers in the automotive and agricultural machinery industries audit their heat treaters' systems against detailed questionnaires covering equipment, instrumentation, process control and records, and an induction line run as this book describes is ready for such an audit because its evidence already exists.

## Charting the case depth

The laboratory sections one shaft per shift (Chapter 8). A list of case depths, all inside 2.0 to 3.0 mm, says little; the same numbers plotted in time order on a control chart show whether the process is steady. Because there is one result per shift, the right chart is an individuals chart, which estimates the process's short-term variation from the differences between consecutive results, the moving ranges.

The WORKOS [Individuals control chart check](/tools/individuals-chart-check/) tool takes up to twelve readings in time order and gives their mean, the moving ranges and their average, the standard deviation estimated from the average moving range, the upper and lower control limits at three standard deviations from the mean, and which readings fall outside them. Its check notes that limits from few readings are rough and should be recalculated from 20 to 25, and that run rules should be applied too.

This is an illustration. The IH-40's first twelve shifts after the recipe was proved gave these effective case depths, in millimetres: 2.35, 2.40, 2.33, 2.38, 2.42, 2.36, 2.31, 2.39, 2.37, 2.44, 2.34 and 2.38.

```figure
type: steps
title: The IH-40's first twelve case depths in the individuals chart tool
caption: This is an illustration. Twelve results, one per shift, from the case depth traverses of Chapter 8.
- Mean | 2.373 mm
- Average moving range | 0.057 mm
- Estimated standard deviation | 0.057 ÷ 1.128 = 0.051 mm
- * Control limits | 2.220 to 2.525 mm
- Readings outside the limits | none: the process is in statistical control
```

The control limits, 2.22 to 2.53 mm, are much tighter than the specification limits of 2.0 to 3.0 mm. They describe what this process does when nothing has changed; the specification describes what the customer will accept. A result inside the specification but outside the control limits is a sign that something has changed, long before it produces a reject.

### What else to chart

Case depth is the headline result, but it is not the only one worth charting. The manufacturer also keeps individuals charts of the surface hardness from each check shaft, the tempered surface hardness from each batch, the journal's growth and runout after hardening (Chapter 9), and the daily averages of energy per part and bath temperature from the machine's records. Each has its own limits, calculated from a stable period. A change in the process usually shows on more than one chart at once, and seeing which charts moved together often identifies the cause before anyone reaches the machine: case depth and growth moving together suggest heating; surface hardness alone suggests the quench or temper; energy alone, with no change in the case, suggests the generator or its measurement.

### When to stop

A control chart signal is a reason to look, not automatically a reason to stop. The manufacturer's reaction plan sets out what happens: a single point outside the control limits but inside the specification means the next check shaft is sectioned at once and the machine, coil and quench records are reviewed; a point outside the specification, or two consecutive points outside the control limits, stops the line, quarantines everything hardened since the last good check, and requires the cause to be found and corrected before production restarts. Writing the plan down in advance means nobody has to decide under pressure, at the end of a shift, whether a result is worth stopping for.

## Capability

With a stable process and an estimate of its variation, the process's capability against the specification can be expressed as indices. Cp compares the width of the specification with six standard deviations of the process; Cpk does the same for the nearer limit, so it also reflects how well the process is centred.

The WORKOS [Process capability from summary data](/tools/process-capability/) tool calculates Cp and Cpk, and the two one-sided indices, from the specification limits, the process mean and the within-process standard deviation. It deliberately reports them only as arithmetic unless you confirm that stability and a suitable distribution have been established separately, and it infers no acceptance threshold.

```figure
type: compare
title: Capability of the IH-40 case depth against 2.0 to 3.0 mm
cols: Value | Meaning
rowhead: Index
- Cp | 3.28 | the specification is more than three times the width of six standard deviations
- Upper-side index | 4.12 | the mean is far from the 3.0 mm limit
- * Cpk, lower side | 2.45 | the mean is nearer the 2.0 mm limit, but still more than seven standard deviations above it
caption: This is an illustration. Mean 2.373 mm and standard deviation 0.051 mm from the individuals chart, with stability confirmed by the chart over twelve shifts. Twelve results give only a rough estimate; capability is recalculated as results accumulate.
```

A Cpk of about 2.4 means the process, as long as it stays as it is, will very rarely produce a case below 2.0 mm: the lower specification limit is more than seven standard deviations below the mean. High capability is also what makes a sampling plan of one section per shift reasonable; a process with a Cpk near 1 would need far more sections, or a non-destructive check on every part, to give the same confidence. It does not mean the process cannot change. Capability describes a stable process; the control chart is how the manufacturer knows it is still the same process.

## The error: limits recalculated with the change included

This is an illustration. On the thirteenth shift, just after a coil change, the check shaft's case depth came out at 2.17 mm, inside the specification but below the chart's lower control limit of 2.220 mm. A supervisor, updating the chart's spreadsheet, recalculated the limits from the latest twelve results, dropping the oldest and adding the new one. The new limits came out at 2.166 to 2.549 mm, and the 2.17 mm result now sat just inside them. The chart showed no signal, and production continued.

The quality engineer, reviewing the chart at the end of the week, saw the problem. Control limits are calculated from a period when the process is known to be stable and then held fixed, so that new results are judged against them. Recalculating them with a suspect result included lets the result widen its own limits, by enlarging both the mean shift and the moving range, until it no longer looks unusual.

```figure
type: compare
title: The thirteenth shift's 2.17 mm result against two sets of limits
cols: Control limits, mm | Is 2.17 mm inside? | Conclusion
rowhead: Limits used
- * Fixed limits from the first twelve, stable shifts | 2.220 to 2.525 | no | out of control: look for a special cause
- Recalculated from the latest twelve, including 2.17 | 2.166 to 2.549 | just | no signal: the change is hidden
caption: This is an illustration. From the individuals chart tool. Limits are recalculated only deliberately, after a confirmed and accepted change to the process, from a new period of stable results.
```

The special cause was found quickly once someone looked: the new coil's gap was 2.9 mm on one side, 0.4 mm wider than the old coil's, and the second traverse on the next check shaft showed 2.15 and 2.45 mm on opposite sides. The coil was reset, the next three check shafts returned to about 2.37 mm, and the shafts hardened in between were sectioned at a higher rate until the laboratory was satisfied that none was below 2.0 mm. The chart's spreadsheet was locked so that its limits can be changed only by the quality engineer, with a recorded reason.

```figure
type: checklist
title: Rules for the IH-40's case depth chart
caption: The open item is the rule broken in the error above.
- One result per shift, plotted in time order the same day | with the shaft's identity and the traverse report
- Results outside the control limits investigated before the next shift | even when inside the specification
- ? Control limits fixed from a stable period, changed only after an accepted process change | never recalculated to include a suspect point
- Run rules applied as well as the limits | for example several results in a row on one side of the mean
- Capability recalculated as results accumulate | and only for a process shown to be stable
```

## Bringing it together

The ten chapters of this book followed one journal through the whole of induction hardening. Frequency sets where the heat is generated, through the reference depth, which jumps as the steel passes its Curie point. Power and time set how much heat goes in and how far conduction carries it. The coil and its gap decide how much of the generator's power arrives. The steel's carbon, starting structure and grain size decide whether the heated layer can transform in seconds. The quench must be fast enough and kept that way; the temper must follow promptly; the case is measured by valid indentations and an honest interpolation; and the stresses and shape changes that come with a hard case must be designed for. Holding all of that steady, part after part, is the work of monitoring every heat and charting every result against limits that are allowed to show a change.

## Exercise: reading a chart

This is an illustration. After the coil was reset, the next eight case depths, against the original fixed limits of 2.220 to 2.525 mm and a mean of 2.373 mm, were 2.38, 2.41, 2.43, 2.42, 2.44, 2.45, 2.43 and 2.46 mm.

1. Is any result outside the control limits?
2. Is there anything else on the chart worth noticing?
3. What would you do?

**Worked answer.**

1. **No**; all eight lie between 2.220 and 2.525 mm.
2. **Yes.** All eight are above the mean of 2.373 mm, and they drift upwards. A long run on one side of the mean is a common run rule signal: the process has probably shifted, here towards deeper cases, even though no single result is outside the limits.
3. Look for a cause: the reset coil's gap, if now tighter than before, would deliver more power to the part (Chapter 4), as would a change in the incoming steel or the bath. Check the energy and coil records for the same period. If the cause is the tighter gap and the cases remain well inside the specification, the gap can be set back to its proven value; if the change is accepted as permanent, new limits are calculated from a fresh stable period, deliberately and with a recorded reason.
