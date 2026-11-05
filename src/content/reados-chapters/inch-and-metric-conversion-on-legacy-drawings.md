---
title: "Inch and metric conversion on legacy drawings: tolerances, threads, pipe sizes and other traps"
description: "How to convert imperial drawings and data to metric without errors: exact factors, converting tolerance limits, why threads and pipe sizes must not be converted, and other common traps."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - design
  - quality
  - manufacturing
author: "BIZOMAT"
featured: false
draft: false
---

Australia converted to metric units in the 1970s, but imperial measurements never fully disappeared from engineering. Older machines, buildings, pipework and spare parts were designed in inches, feet and pounds. Equipment imported from the United States is still often dimensioned in inches. Legacy drawings in company archives show fractions such as 13/16", tolerances in thousandths of an inch and threads such as 3/8"-16 UNC or 1/2" BSW. Workshops replacing worn parts, reverse-engineering components or integrating imported equipment must work across both systems every week.

Conversion looks trivial, since one inch is exactly 25.4 millimetres, and for nominal dimensions it usually is. The errors come from the details: tolerances rounded the wrong way, threads converted into metric sizes that do not exist, pipe sizes treated as real diameters, sheet gauges assumed to be universal, and units for pressure, torque, temperature and surface finish that are converted with the wrong factor or not at all. Each error can produce a part that does not fit, a fastener that strips or a component that fails in service.

This article explains exact conversion factors, how to convert dimensions and tolerances safely, which items must not be converted, the other units that commonly appear on legacy drawings and how to manage mixed-unit work in drawings and CAD.

## The exact factor

Since an international agreement in 1959, the inch has been defined as exactly 25.4 mm. There is no rounding in the factor itself, so any rounding in a converted dimension is a deliberate choice about precision. Useful related values:

- 1 foot = 12 inches = 304.8 mm
- 1 thou (one thousandth of an inch, also called a mil) = 0.0254 mm
- 1 mm ≈ 0.03937 inch

Common fractional inch sizes convert as follows: 1/16" = 1.5875 mm, 1/8" = 3.175 mm, 1/4" = 6.35 mm, 5/16" = 7.9375 mm, 3/8" = 9.525 mm, 1/2" = 12.7 mm, 3/4" = 19.05 mm and 1" = 25.4 mm.

## Converting dimensions: precision follows purpose

An imperial dimension carries an implied precision. A fractional dimension such as 3/4" on an old fabrication drawing usually implies a general tolerance, perhaps ±1/64", whereas 0.7500" on a machining drawing implies precision to a ten-thousandth of an inch. When converting, the number of decimal places in the metric value should reflect the precision actually required, not simply the digits a calculator produces. A rough guide is to keep one more decimal place in millimetres than seems necessary until the tolerance is known, and then round to suit the tolerance.

## Converting tolerances: convert the limits, round inward

Tolerances need special care. The safest method is:

1. Convert the **upper and lower limits** of the dimension to millimetres, rather than converting the nominal value and the tolerance separately.
2. **Round each limit inward**, so that the metric tolerance zone lies entirely within the original imperial zone. Round the upper limit down and the lower limit up.

Consider a shaft dimensioned Ø1.000" +0.000/−0.002". The limits are 1.000" and 0.998", which convert to 25.400 mm and 25.3492 mm. Rounding inward to two decimal places gives 25.40 mm and 25.35 mm, a tolerance of 0.05 mm, slightly tighter than the original 0.0508 mm. A part made to the metric limits will always satisfy the original drawing.

Rounding outward, for example to 25.34 mm, would allow parts that the original design rejects. For fits between mating parts, such as bearings on shafts, the original design intent should be checked, because the metric equivalent may be better expressed as a standard ISO fit rather than a direct conversion. The [specifying tolerances, fits and surface finish](/reados/collections/engineering-design-practice/specifying-tolerances-fits-and-surface-finish/) article explains standard fits.

```figure
type: range
title: Converting a shaft tolerance: round the limits inward
unit: mm
min: 25.33
max: 25.41
caption: Ø1.000" +0.000/−0.002" is 25.400 to 25.3492 mm; rounding outward would accept parts the design rejects.
- Original limits | 25.3492 | 25.4
- *Rounded inward | 25.35 | 25.4
- Rounded outward (wrong) | 25.34 | 25.4
```

## Threads: never convert

Thread specifications must never be converted numerically. A 3/8"-16 UNC thread has a specific diameter, pitch, thread form and tolerance class; there is no metric thread that equals it. Writing "M9.5 × 1.59" on a converted drawing describes a thread that does not exist. Imperial threads commonly found in Australia include:

- **Unified threads** (UNC and UNF), common on North American equipment;
- **British Standard Whitworth** (BSW) and **British Standard Fine** (BSF), found on older British and Australian machinery; and
- **British Standard Pipe** threads (BSP), parallel and taper, still widely used for pipe fittings and hydraulics.

Legacy threads should be specified by their own standard designation. If a design is being converted to metric fasteners, that is a redesign decision: thread engagement, strength, clearance holes and tapping drills all change and must be checked. The [choosing fasteners and threads](/reados/collections/machine-elements-and-mechanical-design/choosing-fasteners-and-threads/) article covers thread systems and grades.

## Pipe sizes are names, not diameters

Nominal pipe sizes are names inherited from history, not actual dimensions. A pipe called "1/2 inch" has an outside diameter of about 21.3 mm, not 12.7 mm, and its bore depends on its wall thickness. Metric nominal sizes, often written as DN15 for the same pipe, are also names. BSP threads are named after the nominal pipe size, so a 1/2" BSP thread has a major diameter of about 21 mm. Pipe and fitting sizes should always be specified by their standard designation, never converted from the nominal inch value.

## Sheet and wire gauges

Gauge numbers for sheet metal and wire are not universal. Different gauge systems apply to steel, galvanised steel, aluminium, copper wire and others, and the same gauge number means different thicknesses in different systems. A "16 gauge" sheet might be about 1.6 mm in one system and a different value in another. When converting, establish which gauge system was intended and specify the metric thickness explicitly.

## Drill sizes

Imperial drills come in fractional sizes, number sizes (from No. 80, the smallest, upwards to No. 1) and letter sizes (from A to Z, increasing). Tapping drill sizes for imperial threads are often given as number or letter drills. Converting these to the nearest metric drill may change the thread engagement or the fit of a pin. Tapping drill tables for the specific thread should be used.

## Other units on legacy drawings

Legacy drawings and data sheets often carry other imperial units. Common conversions include:

- **Pressure**: 1 psi ≈ 6.895 kPa, so 100 psi ≈ 689.5 kPa, or about 6.9 bar.
- **Torque**: 1 ft·lbf ≈ 1.356 N·m, so a specified 50 ft·lbf is about 67.8 N·m. Some old specifications use in·lbf, which is one twelfth of a ft·lbf.
- **Force and mass**: 1 lbf ≈ 4.448 N, and 1 lb ≈ 0.4536 kg.
- **Temperature**: °C = (°F − 32) × 5 ÷ 9, so 350 °F is about 177 °C. Note that temperature differences convert without the offset: a 9 °F difference is a 5 °C difference.
- **Surface finish**: roughness in microinches converts to micrometres by multiplying by 0.0254, so 32 µin is about 0.8 µm Ra.
- **Hardness and material grades**: imperial-era material specifications, such as old steel grades, must be translated to current equivalents by matching properties, not by name.

## Dual dimensioning and drawing updates

When a legacy drawing is updated, the organisation must decide whether to convert it fully, show dual dimensions or leave it in its original units with a note. Dual dimensioning, showing both units, helps users but doubles the opportunity for inconsistencies and clutters the drawing. Many organisations keep the original units as the controlling dimensions and add converted values only as reference. Whatever the policy, the drawing should state clearly which unit system governs.

## CAD and mixed units

CAD systems store geometry in internal units and display it according to document settings. Problems arise when an inch-based model is opened in a millimetre template, when parts drawn in different units are combined, or when exported files carry the wrong unit flag and are scaled by 25.4 on import. Checking a known dimension after every import, setting document units deliberately and recording the governing unit in the title block prevent most of these issues. The [choosing and using measuring instruments](/reados/collections/machining-and-metal-parts/choosing-and-using-measuring-instruments/) article covers the inspection side: using instruments with the right resolution for the converted tolerances.

## Bought-out components

Many legacy assemblies include standard components in imperial sizes: bearings with inch bores, keys and keyways in fractional widths, O-rings from inch-based size series, roller chains, V-belts, bushes and shaft collars. These should be replaced with the same standard sizes rather than "nearest metric" equivalents unless the design is deliberately changed. An inch-bore bearing on an inch shaft is a precise fit; a metric bearing of similar size will be loose or will not fit at all. Supplier catalogues list imperial ranges, and part numbers from the original equipment manufacturer are the most reliable starting point.

## Gauges and instruments

Inspecting imperial parts is easiest with imperial instruments: micrometers and calipers reading in thousandths of an inch, imperial thread gauges and plug gauges, and drill gauges marked with number and letter sizes. Measuring an imperial part with metric instruments and converting the readings works, but adds a conversion step at every measurement and invites rounding errors. Where a workshop handles imperial work regularly, keeping a set of imperial gauges and a calibrated imperial micrometer is a modest investment. Dual-reading digital instruments can display either unit, but the inspector must be sure which unit is displayed before recording a result.

## A shop conversion reference

Workshops that convert often benefit from a single, checked reference sheet, posted where people work and stored with the quality documents. Typical contents include fractional inch to millimetre equivalents, number and letter drill sizes, tapping drill sizes for common UNC, UNF, BSW and BSP threads, pressure and torque conversions, and the company's rule for rounding converted tolerances. Making one reference authoritative, rather than relying on phone apps and memory, reduces inconsistency between people and shifts.

## Reverse engineering imperial parts

When a worn part has no drawing, measuring it in millimetres and producing a metric drawing can hide its imperial origin. Measurements such as 12.69 mm, 19.04 mm or 25.38 mm are strong hints that the original design used 1/2", 3/4" or 1" nominal sizes, adjusted for wear and fit. Recognising imperial sizes, and checking threads with imperial thread gauges, leads to better replacements and to standard bought-out components rather than custom ones.

## A worked example

This is an illustrative example. The part and figures are hypothetical.

A maintenance workshop needs a replacement pin for an imported machine. The original drawing shows Ø0.750" +0.000/−0.001" with a 3/8"-16 UNC tapped hole in one end and a surface finish of 32 µin.

The machinist converts the diameter limits: 0.750" = 19.050 mm and 0.749" = 19.0246 mm. Rounding inward to three decimal places gives 19.050 mm and 19.025 mm. The thread stays as 3/8"-16 UNC, with the tapping drill taken from a UNC table, and imperial taps are ordered rather than substituting a metric thread. The surface finish becomes 0.8 µm Ra. The workshop's drawing notes that the thread is imperial and that the dimensions are converted from the original inch drawing, with the inch values shown as reference.

An earlier attempt, made before the workshop adopted this method, had specified the pin as Ø19.0 ± 0.02 mm with an M10 thread. The pin was undersize by the drawing's standard, rattled in its bore and could not accept the original screw.

```figure
type: compare
title: A replacement pin, converted twice
cols: Earlier attempt | Converted properly
best: 2
caption: Original: Ø0.750" +0.000/−0.001", a 3/8"-16 UNC tapped hole and a 32 µin finish.
- Diameter | Ø19.0 ± 0.02 mm: undersize | 19.025 to 19.050 mm, rounded inward
- *Thread | M10: would not take the original screw | 3/8"-16 UNC, never converted
```

## How this applies to a small Australian business

- **Use the exact factor of 25.4** and round deliberately.
- **Convert tolerance limits and round inward.**
- **Never convert threads or pipe sizes numerically**; specify them by standard.
- **Clarify gauge systems** and specify metric thicknesses.
- **State the governing units** clearly on every drawing and model.
- **Check a known dimension** after importing CAD files.

## Common mistakes

- **Converting a nominal dimension and tolerance separately**, then rounding outward.
- **Inventing metric equivalents of imperial threads.**
- **Treating nominal pipe sizes as diameters.**
- **Using the wrong gauge table** for sheet or wire.
- **Applying the 32-degree offset** to temperature differences.
- **Importing inch geometry at the wrong scale.**
- **Substituting nearest metric bearings, keys or O-rings** for imperial standard parts.

## Frequently asked questions

**Is 25.4 an approximation?** No. Since 1959, the international inch has been defined as exactly 25.4 mm.

**Should old drawings be converted to metric?** Only when there is a reason, such as redesign or ongoing manufacture. Converting creates a new controlled drawing that must be checked. Many organisations retain original units and add metric reference values.

**How can an imperial part be recognised from metric measurements?** Look for measurements close to common fractions of an inch, such as 6.35 mm, 9.53 mm, 12.70 mm or 19.05 mm, and check threads with imperial thread gauges.

**Can an imperial bearing be replaced with a metric one?** Only if the shaft and housing are modified to suit, which is a design change. Otherwise, order the same imperial bearing by its standard designation or the original part number.

## Questions to ask

- Which of our machines and spare parts are designed in imperial units?
- Do we convert tolerances by limits and round inward?
- How do we specify imperial threads and pipe fittings on our drawings?
- Which units govern each of our legacy drawings?
- How do we check CAD imports for unit errors?
- Do we keep imperial gauges and a single, checked conversion reference?

## Bringing it together

Converting inches to millimetres is exact, but converting drawings safely requires judgement. Convert tolerance limits and round inward, keep threads, pipe sizes and gauges in their own standards, convert pressure, torque, temperature and surface finish with the right factors, state which units govern each drawing and check CAD imports. Recognising imperial origins in worn parts leads to better replacements. With these habits, workshops can move between the two systems without the errors that cost time, money and reliability.

---

*Source: BIZOMAT editorial notes. Examples and figures in this article are illustrations.*
