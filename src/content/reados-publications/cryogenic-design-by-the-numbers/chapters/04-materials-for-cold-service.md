---
book: cryogenic-design-by-the-numbers
chapterSlug: materials-for-cold-service
order: 4
title: "Materials for cold service"
description: "Choosing materials for the cold end: toughness and crystal structure, conductivity integrals, magnetism near a coil, vacuum, joints and solders, and cap screws that broke."
draft: false
---

A cryostat's materials do three different jobs, and each job wants different properties. The cold plate and the thermal straps should conduct heat as well as possible. The supports and the wiring should conduct it as little as possible while carrying load or current. And everything at the cold end has to stay tough when cold, survive its own contraction, live in a vacuum and, near a test coil, stay out of the magnetic field's way. No single material does all three jobs, which is why cryostats are made of so many.

This chapter sorts the common materials by those jobs, using NIST's conductivity data turned into the single number that matters for heat leaks, the conductivity integral. It explains why some steels break when cold and others do not, flags the materials that cause trouble near a superconducting coil, covers joints, solders and adhesives, and ends with a set of standard cap screws that should never have been at the cold end.

## Toughness and crystal structure

Chapter 1 noted that metals become stronger as they cool. Whether they stay tough depends on their crystal structure. In face-centred cubic metals, the planes on which the crystal slips stay active at all temperatures, so the metal can still deform plastically at the tip of a crack and blunt it. In body-centred cubic metals, slip needs thermal activation, and below a transition temperature the metal cannot deform fast enough at a crack tip; the crack runs instead, and the part breaks with little warning and little energy absorbed.

```figure
type: compare
title: Crystal structure and cold toughness of common cryostat metals
cols: Crystal structure | At 40 K | Typical cryostat use
caption: General metallurgical behaviour. Particular grades, heat treatments and welds can differ; check the grade's own low-temperature data before relying on it for a loaded part.
- *Austenitic stainless steels, 304 and 316 | face-centred cubic | tough | vessels, supports, fasteners, tubes
- Aluminium alloys | face-centred cubic | tough | shields, plates, formers
- Copper and its alloys | face-centred cubic | tough | plates, straps, leads, springs (beryllium copper)
- Titanium alloy Ti-6Al-4V | mainly hexagonal, two-phase | usable with care | high-strength, low-conduction supports
- Carbon and low-alloy steels | body-centred cubic | brittle | not at the cold end
- Ferritic and martensitic stainless steels | body-centred cubic | brittle | not at the cold end
```

The practical rule is short: at the cold end, use austenitic stainless steel, aluminium alloys, copper alloys and, with care, titanium alloys; keep ordinary steels, including most standard fasteners, at room temperature.

## Conductors and insulators: the conductivity integral

For a part that runs from one temperature to another, the heat it conducts is set by its shape and by the integral of its conductivity between the two temperatures. Cryostat designers therefore compare materials by that integral rather than by conductivity at any one temperature. Parma's survey of cryostat design for CERN tabulates such integrals and gives the classic comparison: for a support at 4.2 K, a glass-fibre epoxy laminate can cut the conduction load by a factor of about twenty against stainless steel, before strength and stiffness are weighed.

Integrating NIST's fits between CT-40's two temperatures gives each material's integral, and dividing by a million gives a memorable form: the heat in watts carried by a bar of 1 mm² cross-section and 1 m length between 293 K and 40 K.

```figure
type: compare
title: Conductivity integrals between 293 K and 40 K, from NIST's fits
cols: Integral | Heat through 1 mm² × 1 m | Role
caption: Integrated numerically from NIST's thermal conductivity fits. G-10 values are along and across the glass fibres. Copper's two grades differ little over this range; Chapter 6 shows where purity matters.
- Copper, RRR 500 | 129,600 W/m | 130 mW | conductor
- * Copper, RRR 50 | 116,500 W/m | 117 mW | conductor
- 1100 aluminium | 61,100 W/m | 61 mW | conductor
- 6061 aluminium | 30,200 W/m | 30 mW | structure that also conducts
- 304 stainless steel | 2,840 W/m | 2.8 mW | structure, poor conductor
- Invar | 2,550 W/m | 2.5 mW | structure, poor conductor
- Ti-6Al-4V | 1,260 W/m | 1.3 mW | strong support
- G-10 along the fibres | 150 W/m | 0.15 mW | insulating support
- G-10 across the fibres | 102 W/m | 0.10 mW | insulating spacer
- PTFE | 64 W/m | 0.06 mW | insulating pad or slide
```

The range is three orders of magnitude, from copper's 117 mW to G-10's 0.15 mW, and the table explains the architecture of nearly every cryostat. Heat paths that should conduct, like CT-40's plate and strap, are copper or pure aluminium. Paths that must carry load without conducting, like its supports, are glass-fibre laminate, titanium alloy or thin-walled stainless steel. Stainless steel conducts nineteen times as much as G-10 along its fibres, and copper forty-one times as much as stainless steel.

## Pure metals and alloys of the same metal

The table also shows that the same metal can be a good or a poor conductor depending on what is added to it. Pure 1100 aluminium conducts twice as much as 6061 alloy between 293 K and 40 K, and its advantage grows at lower temperatures, where NIST's fits give 1100 about ten times the conductivity of 6061 at 20 K. Copper and brass differ far more: integrating NIST's brass fit, which covers only up to about 110 K, gives brass about one-sixteenth of copper's integral between 40 K and 110 K.

The choice follows the part's job. A thermal shield or a heat-spreading plate is made of a pure grade, 1100 aluminium or oxygen-free copper, and accepts its lower strength. A structural part that should not conduct much is made of an alloy, 6061 aluminium or stainless steel. Where a part must do both, such as a coil former that also spreads heat, the designer decides which job matters more, and often splits it into two parts. CT-40's former is 6061 because it carries the coil's forces; its heat path to the plate is through its base, which is clamped with indium foil and spring washers.

## Plastics and laminates

Plastics have three uses at the cold end: electrical insulation, thermal isolation and low-friction slides. They bring two problems: they contract far more than metals, and most become brittle.

PTFE is the exception to brittleness and the extreme of contraction. NIST's fit gives it 2.08% between 293 K and 40 K, seven times as much as stainless steel, so a PTFE sleeve on a metal shaft that is a snug fit at room temperature grips the shaft hard when cold, and a PTFE ring in a metal bore pulls away from it. PTFE parts are designed with the contraction in mind, often loaded by springs so that they stay in contact at every temperature.

Glass-fibre epoxy laminates such as G-10 are anisotropic: along the glass fibres they contract 0.23%, close to stainless steel's 0.30%, while across them, through the laminate's thickness, they contract 0.69%, where the epoxy dominates. A G-10 support tube made with its fibres along its length matches the metal fittings bonded or bolted to its ends far better than a tube cut so that the fibres run around it. The direction of the fibres goes on the drawing.

Thin polyimide film is the usual electrical insulation at the cold end: it stays flexible, insulates well and is thin enough that its own contraction does little harm. It is used to insulate the current leads where they are clamped to the cold plate, and between the coil's terminals and the plate.

## CT-40's materials schedule

This is an illustration. The rules in this chapter come together in a schedule of materials for the cold end, which CT-40's drawings carry and which is checked whenever a part is changed:

```figure
type: compare
title: CT-40 cold-end materials schedule
cols: Material | Main reason | Watch for
caption: This is an illustration of how the chapter's rules become a schedule. Grades and conditions on a real drawing come from the designer's own checks and the materials' data.
- Cold plate | oxygen-free copper, minimum RRR stated | conducts heat to the strap | not to be substituted by brass or other alloys
- Thermal strap | laminated oxygen-free copper foil | conducts heat, flexes for movement | joint preload and contact (Chapter 6)
- Coil former | 6061-T6 aluminium | strong, light, non-magnetic | contraction against copper (Chapter 3)
- Supports | G-10 tube, fibres along the axis | strong per watt leaked | fibre direction; bonded end fittings
- Fasteners at the cold end | austenitic stainless steel with spring washers | tough when cold | no substitution with alloy steel
- Electrical insulation | polyimide film | stays flexible | clamping pressure on thin film
- Seals | elastomer O-rings, warm flange only | simple and reliable | no demountable seals at the cold end
```

Writing the schedule down has a value beyond the drawings. It forces the designer to give a reason for each choice, and that reason is what stops a well-meaning substitution later.

## Strength per watt

For a support, the right comparison is not conductivity alone but load carried per watt leaked. A support's heat leak is its conductivity integral times its area divided by its length, and its load capacity is its allowable stress times its area. So for a given length and load, the heat leak is proportional to the conductivity integral divided by the allowable stress, and the best support material has the highest ratio of strength to conductivity integral.

That ratio usually favours glass-fibre laminates and titanium alloys over stainless steel, and stainless steel over aluminium. The reason G-10 wins is not that it is strong, but that it conducts so little: even a support that must be made several times thicker in G-10 than in stainless steel to carry the same load leaks far less heat. Stiffness and buckling, which favour metals, and the risk of creep or damage in laminates, are then weighed against it. Chapter 5 sizes CT-40's supports on these grounds, using the grade's own strength data, which designers take from the material's data sheet or a qualified test rather than from a general table.

## Magnetism near a coil

CT-40 tests superconducting coils, and the field from a coil is distorted by any ferromagnetic material near it. Ordinary steels are ferromagnetic and are kept away from the coil for that reason as well as for their brittleness. Austenitic stainless steels are not ferromagnetic when annealed, but some grades, 304 more than 316, can transform partly to a magnetic phase when heavily cold-worked or welded, or when cold. For parts close to a coil, 316L in the annealed condition, aluminium, copper alloys, titanium and glass-fibre laminates are safer choices, and a simple test with a strong magnet or a magnetometer on the finished part is worth doing.

Electrically, every metal near a coil also matters when the current changes, because the changing field induces eddy currents that heat the metal and slow the field's change. Chapter 10 returns to this in the context of a quench, when the field collapses in milliseconds.

## Vacuum, joints and solders

Everything at the cold end also lives in the vacuum. Porous materials, unfilled plastics and materials that hold water outgas for a long time and spoil the vacuum, as Vacuum by the Numbers explains; parts are cleaned and dried before assembly, and adhesives and laminates are chosen from grades known to be acceptable in vacuum. Glass-fibre laminates are acceptable when clean and dry, and are often baked before use.

Joints need as much thought as parts:

```figure
type: checklist
title: Joining methods at the cold end
caption: General practice. Each method's suitability depends on the alloys, the temperature and the loads; the grade's maker or a qualified test confirms it.
- x Welded austenitic stainless steel | tough when cold with suitable filler and procedure; the usual choice for vessels and tubes
- x Brazed copper and stainless steel joints | widely used for leads and plates; check the braze alloy for vacuum use
- x Bolted joints with spring washers or matched washers | demountable; preload checked against contraction (Chapter 3)
- x Indium-sealed and indium-padded joints | soft at low temperature, good for seals and thermal contact
- ? Soft solders | some tin-rich solders become brittle at low temperature; choose a grade with cryogenic data
- ? Adhesive bonds | short, thin bond lines between matched materials; epoxies chosen and tested for cryogenic use
```

## Property data you can trust

Every number in this book comes from NIST's published fits, and NIST states for each fit the temperature range of the data behind it and its typical error, often 1 to 5%. Those are fits to measurements on particular samples. A different heat, temper or batch of the same nominal material can differ, by a little for stainless steel's conductivity and by a great deal for copper's below 40 K, where purity and cold work dominate.

Three habits keep the design honest. Use a fit only inside its stated range: NIST's brass conductivity, for example, stops at about 110 K, and its nickel steel specific heat at 55 K. Say on the drawing which data were used, so that a later reviewer can tell whether a measured result disagrees with the design or with the data. And measure the properties that matter most on the real material, as CT-40's laboratory does for the RRR of its copper. A property that carries the design's margin, such as the conductivity of a strap or the strength of a support, is worth a test; the rest can rest on published data.

## The error: standard cap screws at the cold end

This is an illustration. When CT-40's second coil was installed, its clamp was fastened to the aluminium former with standard high-tensile socket-head cap screws taken from the workshop's stock, because the stainless steel screws specified on the drawing were out of stock and the high-tensile ones were "stronger". After the first test, two of the six screws were found broken, their fracture faces flat and bright, and the coil's field map showed a small distortion near the clamp.

Both effects came from the screws' material. High-tensile socket-head screws are made of quenched and tempered alloy steel, a body-centred cubic metal that becomes brittle when cold. The aluminium former, shrinking 0.11% more than steel between room temperature and 40 K, had already changed the screws' load, as Chapter 3 showed for bolted joints, and the brief shock of the coil's quench in Chapter 10 found them brittle. The flat, bright fracture faces were the sign of a brittle failure. The screws were also ferromagnetic, which explained the distorted field.

The engineer found the cause by checking the screws against the drawing and recognising the fracture appearance. The laboratory now stores cold-end fasteners separately, in labelled austenitic stainless steel, brass and titanium bins, and its drawings carry a note forbidding substitution at the cold end without the engineer's approval.

## Exercise: one rod, five materials

A designer needs a rod 4 mm in diameter and 150 mm long to carry a small load from the vessel at 293 K to the cold plate at 40 K. Using the conductivity integrals in this chapter, find the heat it would conduct if made of copper (RRR 50), 6061 aluminium, 304 stainless steel, Ti-6Al-4V or G-10 along its fibres, and compare each with CT-40's 30 W cooler capacity.

**Worked answer.** This is an illustration. The rod's area is π × 2² = 12.57 mm², so its shape factor A ÷ L is 12.57 × 10⁻⁶ ÷ 0.15 = 8.38 × 10⁻⁵ m. Multiplying by each integral: copper **9.76 W**, 6061 aluminium **2.53 W**, 304 stainless steel **0.238 W**, Ti-6Al-4V **0.106 W**, and G-10 **0.0125 W**. A copper rod would use a third of the cooler's capacity on its own; a G-10 rod would use 0.04% of it. The same shape factor appears in every conduction calculation in Chapters 5, 6 and 8: once the integral is known, a part's heat leak is one multiplication.
