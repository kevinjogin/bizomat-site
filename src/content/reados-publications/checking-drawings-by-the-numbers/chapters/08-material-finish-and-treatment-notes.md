---
book: checking-drawings-by-the-numbers
chapterSlug: material-finish-and-treatment-notes
order: 8
title: "Material, surface texture and treatment notes"
description: "Check material callouts, surface texture symbols and treatment notes for completeness and consistency, and recalculate the fits and stacks that coatings and paint change."
draft: false
---

The notes on a drawing are where dimensions meet the rest of manufacturing. The material callout tells the buyer what to order; the surface texture symbols tell the machinist how finely to cut; the treatment note tells the plater or painter what to add. Each is usually written in words and symbols that look complete, and each can quietly change a size the dimensions depend on. A zinc coating a hundredth of a millimetre thick is nothing on a bracket and everything on a running fit.

This chapter checks the notes in three groups: material, surface texture and treatments. For each it sets out what a complete note says and how to test it against the rest of the drawing. The running case finds that the pivot pin's plating would close the running clearance that Chapter 6 restored, and that paint on the arm would clamp it on its pin.

## Material: what a buyer can order

A material callout must let a buyer order the material, and an inspector confirm it, without asking anyone. That usually means:

- the **material and grade**, such as a ductile iron grade or a steel grade;
- the **standard** the grade is defined in, such as the relevant Australian Standard for ductile cast iron or for steel bar;
- the **form and condition** where it matters, such as bright bar, hot rolled, normalised or a heat treatment;
- any **test or certification** requirement, such as a mill certificate.

A callout that says "MILD STEEL" or "BRONZE" fails the first test: there are many of each, with different properties. A callout that names a grade that no longer exists, or a standard that has been superseded, fails it more subtly, and is common on drawings copied from old templates.

This is an illustration. The checker's material pass on the TA-200 set found:

- the arm: a ductile iron grade to its Australian Standard, with a note requiring the foundry's test certificate; complete;
- the pin: "STEEL BAR, BRIGHT"; incomplete, since no grade is given, and the pin's wear on the bush depends on its hardness;
- the bush: "SINTERED BRONZE, OIL IMPREGNATED, TO SUPPLIER'S SPECIFICATION"; acceptable for a bought-in bush if the supplier and part number are named, which they are on the parts list.

The checker marked the pin's callout for a grade and condition, and noted why: a soft pin running in a bronze bush wears into a step at the bush's edges, and the wear would open the running clearance that Chapter 6 worked so hard to set. The designer specified a free-machining carbon steel bar grade and its standard, and noted the bar's condition.

## Surface texture: function, process and tolerance agree

Surface texture symbols state how rough a surface may be, usually as an Ra value in micrometres, and sometimes the process, lay or machining allowance. The checker looks for three kinds of disagreement.

**With function.** A running surface, a sealing face or a press-fit bore needs a finer finish than a clearance face. The pin's running surface and the bush bore carry the arm; the arm's cast faces that touch nothing need no symbol at all.

**With the process.** A finish finer than the process implied by the rest of the drawing either adds an operation or will not be achieved. A drawn cast surface marked with a finish only grinding can give, but with no machining allowance shown, is a contradiction.

**With the tolerance.** A dimension with a tolerance of a few hundredths of a millimetre on a surface allowed to be rough is unmeasurable in practice, because the peaks and valleys of a rough surface occupy a large part of such a tolerance, and different instruments will read different sizes. Fine tolerances and rough finishes rarely belong together.

```figure
type: compare
title: Surface texture on the TA-200 parts, as drawn
cols: Finish as drawn | Tolerance on the surface | Finding
caption: This is an illustration. Ra values are the office's choices for these functions; real values come from the design brief and the process.
- Pin shank, running in the bush | Ra 0.4 µm | 0.011 mm on diameter | Agreed
- Arm bore for the bush, press fit | Ra 1.6 µm | 0.011 mm after Chapter 6 | Agreed
- Arm pivot boss faces, against washers | Ra 3.2 µm | ±0.05 mm on length | Agreed
- *Arm stop lug face, against the frame stop | None given | ±0.2 mm | Machined face with no finish stated
- Arm cast surfaces | None | Casting general tolerance | Agreed, no symbol needed
```

The stop lug face was machined, carried a tolerance and had no surface texture symbol. The general note on the arm drawing gives no default finish for machined surfaces, so the machinist would have to guess. The checker asked for Ra 6.3 µm, enough for a face that only seats against a rubber stop.

## Symbols must be readable

A surface texture symbol has a fixed orientation: like dimensions, it should be readable from the bottom or the right-hand side of the sheet, and it should touch the surface it refers to, an extension of it or a leader to it. A symbol on a leader that ends in mid-air between two surfaces refers to neither. On the arm's sheet 2, the bore's Ra 1.6 symbol sat on a leader that ended close to both the bore and its chamfer. The checker asked for it to be moved onto the bore's extension line.

## Treatments change sizes

Coatings, platings, paint and some heat treatments add thickness or change dimensions, and the drawing must say whether its dimensions apply before or after. Where it does not, the convention in many offices is that dimensions apply after treatment, but that convention is not universal, and a machinist asked to finish a pin to 11.973 to 11.984 mm will reasonably cut it to that size before sending it for plating.

This is an illustration. The pin drawing's treatment note reads "ZINC PLATE 8–12 µm", with no statement of whether the diameter limits apply before or after plating. A coating adds its thickness on each side, so it adds twice its thickness to a diameter. If the machinist finishes the pin to its limits and then plates it:

- the smallest pin grows by 2 × 0.008 = 0.016 mm, to **11.989 mm**;
- the largest grows by 2 × 0.012 = 0.024 mm, to **12.008 mm**.

Against the installed bush bore from Chapter 6's revision, 12.010 to 12.044 mm, the clearance becomes 12.010 − 12.008 = **0.002 mm** to 12.044 − 11.989 = **0.055 mm**. The minimum is a tenth of the brief's 0.020 mm. The arm would turn stiffly, if at all, on the tightest combinations.

```figure
type: range
title: Pin-to-bush clearance with and without plating the pin
min: 0
max: 0.09
unit: mm
caption: This is an illustration. Installed bush bore from the Chapter 6 revision. Plating 8 to 12 µm adds 0.016 to 0.024 mm to the pin's diameter.
ticks: 0 | 0.03 | 0.06 | 0.09
- Unplated pin | 0.026 | 0.071
- *Pin plated after finishing to its limits | 0.002 | 0.055
- Required by the design brief | 0.02 | 0.08
```

## Can the drawing be fixed by saying "after plating"?

The obvious fix is to state that the diameter applies after plating, and leave the machinist to allow for it. The checker tested whether that is possible. To finish within 11.973 to 11.984 mm after plating of 8 to 12 µm, the pin before plating must be at least 11.973 − 0.016 = 11.957 mm, so that thin plating still reaches the lower limit, and at most 11.984 − 0.024 = 11.960 mm, so that thick plating does not exceed the upper limit. That leaves a pre-plating tolerance of **0.003 mm**, which a turned and ground pin can barely hold and the plating's own variation makes pointless.

The plating's variation, 0.008 mm on the diameter, uses most of the pin's 0.011 mm tolerance by itself. No note can fix that; the treatment and the fit are incompatible. The checker reported it as a design finding, and the designer and approver considered masking the running surface during plating, which adds cost to every pin, or changing the treatment. They chose a black oxide finish with a corrosion-inhibiting oil, which the treatment supplier confirmed adds negligible thickness, and noted "DIMENSIONS APPLY AFTER TREATMENT" on the drawing for completeness.

## Paint on the arm

The arm is painted, and its treatment note reads "PAINT, 2 COATS, 60 µm EACH" with no masking instruction. Paint on the bore would add to the press fit; paint on the pivot boss faces would add to the boss length in the axial float stack of Chapter 7.

This is an illustration. Two coats of 60 µm on each boss face add 0.12 mm to the boss's length as the washers see it. Chapter 7's revised float of 0.10 to 0.50 mm becomes **−0.02 to 0.38 mm**: on the tightest combinations the arm is clamped between the washers and cannot turn. The bore, painted, would add 0.24 mm to the press fit's interference, enough to crack the bush or the boss.

The checker asked for "MASK BORE, BOSS FACES AND STOP LUG FACE BEFORE PAINTING", with the masked surfaces identified on the drawing. A masked surface is also a surface that will rust if the paint is the only corrosion protection, which the approver accepted for the bore and faces since they are greased in service.

```figure
type: checklist
title: Treatment checks for any coated, plated or painted part
caption: This is an illustration of the office's treatment pass. Each item comes from a fault found on a real drawing somewhere.
- Treatment named fully | Process, thickness range and specification
- Before or after stated | Which dimensions apply before treatment and which after
- Every fit and stack involving a treated surface recalculated | Pin plating and arm paint both failed this
- Masked surfaces identified | Bore, boss faces and stop lug face on the arm
- Thickness variation compared with the tolerance | 0.008 mm of plating variation against a 0.011 mm tolerance
- x Treatment added after the fits were calculated | The commonest way a correct fit becomes a wrong one
- ? Heat treatment distortion | Ask the designer whether any machined size is finished before heat treatment
```

## Notes that say too little, or the same thing twice

Some notes are complete in form and empty in content. "FINISH AS REQUIRED", "BREAK SHARP EDGES", "SUITABLE PROTECTIVE COATING" and "TO SUIT" each hand a decision to the supplier without saying what would satisfy it, and each is a dispute waiting to happen when the part arrives. The checker's test is whether an inspector could reject a part against the note. "BREAK SHARP EDGES 0.2 TO 0.5" can be inspected; "BREAK SHARP EDGES" cannot.

The opposite fault is a note stated twice: once in the title block's material or finish field and again in the notes list, or once in a general note and again beside a feature. Two statements agree until one is revised. This is an illustration. The arm drawing's title block finish field said "PAINT", and general note 4 said "PAINT, 2 COATS, 60 µm EACH". The checker asked for the title block field to read "SEE NOTE 4", so that the treatment is stated once, completely, in the place a painter will read.

## Certificates and traceability

Where the material matters to safety or performance, the drawing can require evidence that the right material was used: a mill or foundry certificate, a hardness test, a batch marking. The checker confirms that any such requirement is stated where the supplier will see it, on the drawing or in the purchase specification it names, and that it is proportionate. The arm's foundry certificate is justified, because a wrong iron grade could let the arm crack under the belt load. A certificate for the washers would add paperwork for no benefit; their parts list entry names the supplier's part, and that is enough.

Where parts must be traceable, so that a batch can be recalled if a fault is found, the drawing should say how they are marked and where. The tensioner arm carries a cast batch number in a pad on its web, shown on sheet 1 with its position and character height, so that it is not machined away.

## Treatments on bought-out parts

Bought-out parts carry treatments too, and those are fixed by the supplier's part number rather than the drawing. A washer ordered zinc plated is plated whether or not the drawing set mentions it, so the checker reads the bought-out items' data for their finish as well as their size, exactly as for a made part. The exercise below is the tensioner's example. The retaining ring, in this illustration, is supplied phosphated and oiled, which adds negligible thickness, and its supplier's thickness tolerance already applies to the finished ring.

## Heat treatment and distortion

Heat treatment can change dimensions without adding anything: hardening a steel part can grow or distort it, and a part machined to size before hardening may need grinding after. The drawing must show which features are finished after heat treatment and leave allowance for them. The tensioner's parts are not heat treated, but the office's checklist keeps a line for it, because a drawing that calls for hardening and gives final sizes on surfaces that cannot be ground afterwards is a recurring fault.

## Exercise: a coated washer

A buyer proposes zinc-plated washers in place of the precision washers Chapter 7 specified, plated 8 to 12 µm on each face, because they are cheaper and the supplier says their thickness before plating is the same 1.5 ±0.05 mm. What does that do to the arm's axial float, and would you accept it?

**Worked answer.** Plating on both faces adds 2 × 0.008 = 0.016 mm to 2 × 0.012 = 0.024 mm to each washer's thickness. The two washers together grow by 0.032 to 0.048 mm, so the stack of Chapter 7's revised design, 32.85 to 33.15 mm, becomes 32.882 to 33.198 mm.

The ring's face is unchanged at 33.25 to 33.35 mm, so the float becomes 33.25 − 33.198 = **0.052 mm** to 33.35 − 32.882 = **0.468 mm**. The minimum falls below the brief's 0.1 mm.

The substitution should not be accepted as it stands. The buyer could be asked for washers whose thickness tolerance applies after plating, or the designer could move the groove's load wall out by about 0.05 mm to recentre the float, which is a drawing change and needs the stack redone. Either way, the substitution is a design change disguised as a purchasing decision, and the checker's job is to make sure it is treated as one.
