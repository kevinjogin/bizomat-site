---
book: checking-drawings-by-the-numbers
chapterSlug: limits-and-fits-from-the-drawings
order: 6
title: "Limits and fits, recalculated from the drawings"
description: "Recalculate every fit from the limits on the two mating drawings, including the bore closure of a pressed bush, and find a running fit that can turn into an interference."
draft: false
---

A fit is never on one drawing. The bore is on the arm drawing, the bush's outside diameter and its bore are on the bush drawing, the pin's diameter is on the pin drawing, and the fit the design needs lives in the design brief or in the designer's head. Each drawing can be perfectly toleranced and the fit still be wrong, because nobody put the three sets of limits side by side and did the subtraction.

That subtraction is the checker's job. This chapter sets out how to recalculate a fit from the limits on the drawings, not from the designer's intention, and how to allow for what happens when one part is pressed into another. The running case recalculates the arm's pivot and finds that the pin can seize in the bush.

## A fit is two subtractions

For a shaft in a hole, the clearance at any pair of actual sizes is the hole size minus the shaft size. Over all the parts the drawings allow, the clearance ranges between two limits:

- **minimum clearance** = smallest hole − largest shaft;
- **maximum clearance** = largest hole − smallest shaft.

A negative clearance is an interference. If the minimum is negative and the maximum positive, the fit is a transition: some pairs will slide, some will need pressing.

The checker reads the four limits straight off the two drawings. If a drawing gives a tolerance class, such as an ISO hole or shaft code, the checker converts it to limits from the standard's table, writes the limits on the check sheet, and works from those. In the running case every fit is given as explicit limits, which is the office's practice for any fit the design depends on.

```figure
type: formula
title: Clearance limits from two drawings
formula: C_min = H_min − S_max        C_max = H_max − S_min
caption: H is the hole's size limits on one drawing, S the shaft's on the other. A negative value is an interference.
- H_min, H_max | Smallest and largest hole the hole drawing allows
- S_min, S_max | Smallest and largest shaft the shaft drawing allows
step: Bush bore as supplied, 12.020 to 12.038; pin, 11.973 to 11.984
step: C_min = 12.020 − 11.984 = 0.036 mm; C_max = 12.038 − 11.973 = 0.065 mm
step: As supplied, a running fit of 0.036 to 0.065 mm
```

## The running case: the pivot as drawn

This is an illustration. The design brief asks for a running clearance between the pin and the bush of 0.020 to 0.080 mm in the assembled tensioner, enough for grease and slight misalignment, small enough to keep the arm from rocking. The drawings give:

- arm TA-201: bore for the bush, **Ø16.000 to 16.018**;
- bush TA-203: outside diameter **Ø16.040 to 16.058**, bore **Ø12.020 to 12.038**;
- pin TA-202: diameter **Ø11.973 to 11.984**.

Taking the bush bore and the pin as drawn, the clearance is 0.036 to 0.065 mm, comfortably inside the brief. That is the calculation the designer did, and the checker repeats it first.

The bush's outside diameter and the arm's bore form a second fit. The interference ranges from 16.040 − 16.018 = **0.022 mm** to 16.058 − 16.000 = **0.058 mm**. That is a press fit, as intended, to stop the bush turning in the arm.

## What pressing does to the bush bore

A thin bush pressed into a stiff housing does not keep its bore. The housing squeezes its outside diameter by the interference, and the bush's wall transmits most of that inwards, so the bore closes. How much depends on the bush's wall thickness, the materials and the housing's stiffness; for a thin sintered bronze bush in a cast iron boss, supplier data commonly lets designers assume that most of the interference appears at the bore.

This is an illustration. The bush supplier's data, for this bush in a housing like the arm's, says to expect the bore to close by about **90%** of the interference. That turns the bush's as-supplied bore into an installed bore:

- the largest closure, 0.9 × 0.058 = 0.052 mm, applied to the smallest bore, 12.020 mm, gives **12.020 − 0.052 = 11.968 mm**;
- the smallest closure, 0.9 × 0.022 = 0.020 mm, applied to the largest bore, 12.038 mm, gives **12.038 − 0.020 = 12.018 mm**.

The installed bore ranges from 11.968 to 12.018 mm. Against the pin's 11.973 to 11.984 mm, the installed clearance ranges from 11.968 − 11.984 = **−0.016 mm** to 12.018 − 11.973 = **0.045 mm**.

The minimum is negative. With the bush's bore at its smallest and the arm's bore at its smallest, and the pin at its largest, the pin will not enter the bush, or will enter it as a press fit and seize. The fit the designer calculated is the fit before assembly, and nobody builds the tensioner before assembly.

```figure
type: range
title: Pin-to-bush clearance before and after the bush is pressed in
min: -0.03
max: 0.1
unit: mm
caption: This is an illustration. The installed range assumes the bore closes by 90% of the press-fit interference, as the bush supplier's data suggests for this housing.
ticks: −0.03 | 0 | 0.03 | 0.06 | 0.09
- Bush as supplied | 0.036 | 0.065
- *Bush installed, as drawn | -0.016 | 0.045
- Required by the design brief | 0.02 | 0.08
```

## Finding it, and why it was missed

The checker found the fault by a habit rather than inspiration: for every fit that involves a pressed or shrunk part, ask what the press does to the other surfaces of that part. The designer had calculated the press fit and the running fit separately, each correctly, and never combined them.

It is a common pattern, and worth generalising. Any fit whose parts change size between being made and being used needs recalculating at the condition of use: a bush pressed into a housing, a bearing ring on a shaft, a plated or painted surface, a part that runs hot. Chapter 8 deals with coatings, which affect this same pin.

## Three ways to fix it

The checker reported the fault with the calculation, and the designer and approver considered three remedies.

**Ream the bush after pressing.** Pressing first and then reaming the bore to 12.020 to 12.038 mm restores the as-supplied clearance, 0.036 to 0.065 mm, regardless of the closure. It adds an operation after assembly, and the supplier should confirm that reaming suits a sintered bush, whose porous surface carries its lubricant.

**Enlarge the bush's as-supplied bore.** To keep at least 0.020 mm of clearance with the largest closure and the largest pin, the as-supplied bore must be at least 11.984 + 0.052 + 0.020 = **12.056 mm**. With the same 0.018 mm tolerance, 12.056 to 12.074 mm gives an installed clearance of 0.020 to 0.081 mm, which just exceeds the brief's 0.080 mm at the top.

**Enlarge the bore and tighten the press fit.** Tightening the arm's bore to 16.000 to 16.011 mm and the bush's outside diameter to 16.040 to 16.051 mm reduces the interference to 0.029 to 0.051 mm and its closure to 0.026 to 0.046 mm. With the bush bore at 12.056 to 12.070 mm, the installed clearance becomes **0.026 to 0.071 mm**, inside the brief, with no extra operation.

```figure
type: compare
title: Remedies for the pivot fit
cols: Installed clearance | Meets 0.020 to 0.080? | Cost
caption: This is an illustration. Closure taken as 90% of interference throughout; the minimum interference of 0.029 mm in the third option must still stop the bush turning, which the approver confirmed with the supplier.
- As drawn | −0.016 to 0.045 mm | No, can seize | None, until it fails
- Ream after pressing | 0.036 to 0.065 mm | Yes | An extra operation per arm
- Enlarge bush bore only | 0.020 to 0.081 mm | Just outside at the top | Bush drawing change
- *Enlarge bore, tighten press fit | 0.026 to 0.071 mm | Yes | Tighter boring on the arm and grinding on the bush
```

The approver chose the third, after the bush supplier confirmed that a 0.029 mm minimum interference holds the bush against the arm's working torque and that the tighter outside diameter is within its grinding capability. Three drawings changed: the arm's bore, the bush's outside diameter and the bush's bore. The checker rechecked all three fits against the new limits before the revision was issued.

## Worst case, or likely case?

A designer faced with a worst-case interference of 0.016 mm may argue that it will never happen: it needs the smallest bush bore, the tightest press fit and the largest pin together, and each is unlikely on its own. Statistical methods, covered in READOS's *Fits That Work*, can estimate how often such combinations occur, and for large volumes with capable processes they can justify tolerances that the worst case would reject.

The checker's position should be simpler. The checker reports the worst case that the drawings allow, because that is what the drawings permit a supplier to make and an inspector to accept. Whether a statistical argument justifies accepting it is a design decision for the approver, made with evidence about the processes, and recorded. For a tensioner made in batches of 40, by a supplier whose capability nobody has measured, the worst case is the honest basis, and the approver chose to fix it rather than argue it.

## Writing it down

Each fit gets one line on the check sheet with the two drawings, the four limits, any change between manufacture and use, and the resulting range compared with the requirement. For the pivot, the line reads:

"Pin TA-202 Ø11.973/11.984 in bush TA-203 bore Ø12.020/12.038 as supplied; bush pressed into TA-201 Ø16.000/16.018 with OD Ø16.040/16.058, interference 0.022/0.058, closure 90% per supplier data; installed clearance −0.016/0.045 against required 0.020/0.080. FAIL: possible seizure."

That one line is enough for the approver to see the problem without redoing the work, and for a later reader to see what was checked. It also makes the assumption, the 90% closure, visible, so that if the supplier's data changes, someone knows which fits depend on it.

## Checking that it can be inspected

A fit that only works at the installed condition must be inspectable at that condition, or the drawing must make clear which condition its limits apply to. The bush drawing's bore limits apply to the bush as supplied; nothing on the drawings says what the installed bore should measure. For the revised design, the checker asked for a note on the assembly drawing: "BUSH BORE AFTER PRESSING Ø12.010/12.044, CHECK WITH PLUG GAUGE", so that the assembler can confirm the installed condition the clearance depends on, and a bush that has closed more than expected is found before the pin goes in.

## Fits the drawings do not state

Some fits are implied rather than drawn. The retaining ring and its groove, the washer bore on the pin, the pulley's bore on its bolt: each is a fit between a made part and a bought-out part whose limits come from the supplier's data sheet, not a drawing. The checker includes them, taking the bought-out part's limits from the data sheet named on the parts list.

This is an illustration. The washer's bore, per its supplier's data, is 12.3 to 12.5 mm, and the pin's shank is 11.973 to 11.984 mm, so the washer runs on the pin with 0.316 to 0.527 mm of clearance. That is loose enough that the washer can sit eccentric to the pin, but it bears on the arm's boss face, which is 32 mm across, so the eccentricity does not matter. The fit is acceptable and the check records it as checked, which is the point: a fit nobody looked at is a fit nobody can vouch for.

## Fits on one drawing

Occasionally both halves of a fit are on one drawing: a shaft with a journal and a shoulder, a bore that must clear a spigot on the same part. The arithmetic is the same, but the fault is easier to miss because no second drawing prompts the checker to look. A good habit is to list every pair of surfaces that touch, slide or must clear one another, on any drawing or between drawings, and to give each pair a line on the check sheet with its calculated range.

This is an illustration. The pin's head, Ø20 mm, must clear the counterbore in the frame bracket it sits against, which is on a different drawing, but it must also clear the arm's cast fillet behind the pivot boss, which is on the arm drawing. The fillet's radius, R4 under the casting's general tolerance of ±1.5 mm, could bring the fillet to within 0.5 mm of the head's edge at its largest. Neither drawing invites the comparison, and the list of touching and clearing surfaces is what put it on the check sheet. The approver accepted it, since the head does not rotate against the fillet, but the line records that someone looked.

## Exercise: a hotter tensioner

The tensioner is offered for a kiln conveyor where the arm runs at 90 °C and the pin, cooled by the frame, at 40 °C. With the third remedy's limits at 20 °C, the installed clearance is 0.026 to 0.071 mm. Take the ductile iron arm and bronze bush together as growing like bronze, at 18 × 10⁻⁶ per °C, and the steel pin at 12 × 10⁻⁶ per °C. These are typical values for illustration. What is the running clearance hot, and does it still meet the brief?

**Worked answer.** Assume, for this estimate, that the installed bush bore grows with the bush material. The bore, about 12.0 mm, rises 70 °C and grows by 12.0 × 18 × 10⁻⁶ × 70 = **0.0151 mm**. The pin rises 20 °C and grows by 12.0 × 12 × 10⁻⁶ × 20 = **0.0029 mm**. The clearance therefore increases by 0.0151 − 0.0029 = **0.0122 mm**, to about 0.038 to 0.083 mm.

The maximum now slightly exceeds the brief's 0.080 mm. The clearance is not at risk of closing, which would be the dangerous direction, but the arm would rock a little more than the brief allows at the hot condition. The checker would report it to the approver with the calculation and its assumptions, because the real expansion of a bush held in an iron boss is constrained by the boss and is a question for the designer, not one the checker can settle with typical coefficients.
