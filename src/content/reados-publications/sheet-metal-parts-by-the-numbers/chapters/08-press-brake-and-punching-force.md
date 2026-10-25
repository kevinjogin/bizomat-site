---
book: sheet-metal-parts-by-the-numbers
chapterSlug: press-brake-and-punching-force
order: 8
title: "Press brake force and punching force"
description: "Estimate air bending force from a manufacturer's formula converted to SI, see how bottoming multiplies it, estimate punching force from cut perimeter, and why small holes break punches."
draft: false
---

A designer rarely sets up a press brake or a punch, but the designer decides how hard they must work. Thickness, material strength, bend length, die opening and bending method set the press brake's force; hole perimeter, thickness and shear strength set the punch's. A part that needs more force than the folder's machine can supply, or more than its tooling is rated for, either goes to a bigger machine at a higher price or cannot be made as drawn.

This chapter gives working estimates of both forces. The press brake estimate uses a machine manufacturer's published formula, converted here from inches to SI units, and the punching estimate uses a tooling manufacturer's. Both are planning figures for design and quoting, not machine settings. The running case estimates the bracket's forces, and finds that a drawing note asking for bottomed bends on the thicker variant would have overloaded the folder's smaller press brake.

## Air bending force

Bystronic, a press brake manufacturer, publishes an air bending formula in inch units: forming tonnage equals 575 times the thickness squared, divided by the die opening and by 12, times the bend length, times a material factor and a method factor. The material factor is the material's tensile strength divided by 60,000 psi, the strength of the baseline steel, and the method factor is 1.0 for air bending, 5.0 or more for bottom bending and 10.0 or more for coining. The result is in US tons.

Converting each quantity to SI, with thicknesses, die opening and length in millimetres, tensile strength in megapascals and force in newtons, the formula becomes:

F ≈ 1.597 × UTS × L × t² ÷ V × method factor

The constant 1.597 comes from the conversion: 575 ÷ 12 tons per inch-unit, the inch-to-millimetre factors, 60,000 psi as 413.7 MPa, and 8.896 kN per US ton. Other published metric forms of the same relationship use constants nearer 1.33; KEVOS's WORKOS [press brake force calculator](/tools/press-brake-force/) uses 1.33 by default and lets the constant be changed. The difference, about 20%, is a reminder that these are estimates of an average forming force, and that the folder's own tonnage chart for its dies is the figure to plan with.

```figure
type: formula
title: Air bending force, Bystronic's formula converted to SI
formula: F ≈ 1.597 × UTS × L × t² ÷ V × method factor
caption: This is an illustration for the bracket, with a tensile strength of 400 MPa assumed for the sheet. Method factor 1.0 for air bending; Bystronic gives 5.0 or more for bottoming and 10.0 or more for coining.
- UTS | Tensile strength, MPa
- L | Length of the bend, 300 mm
- t | Thickness, 2.0 mm
- V | Die opening, 12 mm
step: F ≈ 1.597 × 400 × 300 × 2.0² ÷ 12 = 63,900 N, about 63.9 kN
step: Per metre of bend: 63.9 ÷ 0.3 = 213 kN/m
step: With a constant of 1.33 instead: about 53.2 kN
```

## What the numbers say about design choices

The formula's shape tells the designer what drives the force:

- **Thickness squared.** Doubling the thickness quadruples the force. Going from 2.0 to 3.0 mm multiplies it by 2.25 at the same die.
- **Die opening.** A wider die needs less force, which is why thicker sheet is bent in wider dies. The 3.0 mm variant in its V24 die needs less force per unit length than it would in a V16.
- **Tensile strength.** Linear: a steel twice as strong needs twice the force.
- **Length.** Linear: a 300 mm bend needs half the force of a 600 mm one.
- **Method.** Bottoming and coining multiply the force several times over.

This is an illustration. For the bracket, 2.0 mm sheet at an assumed 400 MPa in a V12 die over 300 mm needs about **63.9 kN**, or 213 kN per metre. For the 3.0 mm high-strength variant at an assumed 550 MPa in a V24 die, the estimate is 1.597 × 550 × 300 × 9 ÷ 24 = **98.8 kN**, or 329 kN per metre.

```figure
type: bars
title: Estimated bending force for the bracket's bends
unit: kN
max: 520
caption: This is an illustration from the converted Bystronic formula over a 300 mm bend. Bottoming is shown with Bystronic's minimum method factor of 5.0.
- 2.0 mm mild steel, V12, air bending | 63.9
- 3.0 mm high-strength, V24, air bending | 98.8
- 2.0 mm mild steel, V12, bottoming | 319.4
- *3.0 mm high-strength, V24, bottoming | 494.1
```

## Machine and tooling limits

A press brake has a rated capacity, usually stated in tonnes over its full length, and its punches and dies have load ratings per metre of length. A short part concentrates the machine's force on a short length of tooling, so a bend well within the machine's total capacity can still exceed the tooling's rating per metre. Folders check both, and many press brakes refuse to run a program that exceeds either.

The designer's part in this is to avoid specifying a method or a combination that needs more than a typical folder's equipment, and to give the folder the information to check: material, thickness, radius, bend lengths and any method requirement. A drawing that says nothing about method leaves the folder free to air bend, which needs the least force.

It also helps to know roughly where a part sits in a folder's range. This is an illustration. If a folder's smaller press brake is 40 tonnes, about 392 kN, and its larger one several times that, the bracket's 63.9 kN bends use about a sixth of the smaller machine, and the thicker variant's 98.8 kN about a quarter. Both are comfortable. A part whose estimated force is above about two-thirds of the folder's smaller machine is one where the uncertainty in the estimate matters, and where a call to the folder before release is cheaper than a requote after it.

## The error: bottoming the thicker variant

This is an illustration. Worried about springback in the 3.0 mm high-strength variant after Chapter 5's experience, the designer added a note to its drawing: "BOTTOM BEND ALL BENDS FOR ANGLE ACCURACY". The folder had two press brakes: a large one, and a smaller 40-tonne machine, about 392 kN, which it used for short brackets because it set up faster.

At Bystronic's minimum method factor of 5.0 for bottom bending, each 300 mm bend in the thicker variant needs about 5 × 98.8 = **494 kN**, more than the smaller machine's 392 kN in total, and about 1,650 kN per metre on the tooling. The folder's quote came back for the large machine only, at a higher hourly rate, with a request to confirm that bottoming was essential.

It was not. The folder's smaller press brake measured and corrected bend angles automatically in air bending, holding ±0.5° on trial strips of the high-strength steel, which met the drawing's tolerance. The designer removed the bottoming note and replaced it with the angle tolerance alone, leaving the method to the folder. The quote came back lower and the parts met the tolerance.

## Punching force

A turret punch or a punching die cuts a hole by shearing the sheet around the hole's whole perimeter at once. Mate Precision Technologies, a punch tooling manufacturer, publishes the standard estimate: force equals the cut perimeter times the sheet thickness times the material's shear strength. KEVOS's WORKOS [punching force calculator](/tools/punching-force/) applies the same relationship.

This is an illustration, taking the bracket's sheet to have a shear strength of 320 MPa:

- a **Ø7 hole**: perimeter π × 7 = 21.99 mm, force 21.99 × 2.0 × 320 = **14.1 kN**;
- a **9 × 20 mm slot**, two 11 mm straight sides and two semicircular ends: perimeter 2 × 11 + π × 9 = 50.27 mm, force **32.2 kN**;
- the **Ø25 cable gland hole** of Chapter 6: perimeter 78.54 mm, force **50.3 kN**.

All are well within a typical turret punch's capacity. Where several holes are punched at once by a multi-tool or a dedicated die, their perimeters add: punching all four Ø7 holes and four slots in one stroke would need 4 × 14.1 + 4 × 32.2 = about 185 kN, which is why progressive and compound dies are sized for the whole set of features they cut together. The bracket is laser cut in practice, but the same blank could be punched, and a designer who knows the forces can see which features would need the largest tools.

## Why small holes break punches

The punching force divided by the punch's cross-sectional area gives the compressive stress in the punch:

stress = (π × d × t × τ) ÷ (π × d² ÷ 4) = 4 × t × τ ÷ d

For a 2.0 mm sheet with a shear strength of 320 MPa, a Ø7 punch carries 4 × 2 × 320 ÷ 7 = **366 MPa**, a Ø4 punch 640 MPa and a Ø2 punch **1,280 MPa**. The stress rises as the hole gets smaller relative to the thickness, and a slender punch also buckles more easily. This is the reason behind the rule of thumb in Chapter 6 that punched holes should be no smaller than roughly the sheet thickness: at d = t the stress is 4τ whatever the thickness, and smaller holes push the punch harder still.

```figure
type: compare
title: Punch stress for holes in the bracket's 2.0 mm sheet
cols: Hole diameter ÷ thickness | Punch stress | Comment
caption: This is an illustration with a shear strength of 320 MPa. Stress = 4tτ ÷ d. Small, slender punches are the ones that break.
- Ø7 hole | 3.5 | 366 MPa | Comfortable
- Ø4 hole | 2.0 | 640 MPa | Still routine
- *Ø2 hole | 1.0 | 1,280 MPa | At the rule-of-thumb limit
```

## Off-centre bends

A press brake's ram is driven at both ends, and its rated capacity assumes the load is spread along the bed, or at least centred on it. A short part bent near one end of a long machine loads one end of the ram far more than the other, which can tilt the ram, spoil the angle along the bend and, on some machines, overload one side's drive. Folders normally position short parts near the centre for that reason, or use the machine's off-centre limits.

The bracket, 300 mm long, is short compared with a typical press brake's bed, and the folder bends it at the centre. Where a part must be bent off centre, for example a long part with a short bend near one end, the designer may see it reflected in the folder's questions or price, and should not be surprised.

## Holes, hits and punch clearance

On a turret punch, each round hole of a standard size is one hit, and each slot is one hit with a slot-shaped punch or several with a smaller one. The bracket's blank has four holes and four slots, so eight hits if the turret holds both tools. Its total cut perimeter, 4 × π × 7 plus 4 × 50.27, is 289.1 mm, the length a laser would cut for the internal features alone, before the outline.

Two punching details affect the drawing. The **die clearance**, the gap between punch and die, is set by the tooling supplier as a function of thickness and material, and it decides the hole's slight taper and the burr on the exit side. And the **burr side** is the die side, so a drawing that cares where the burr ends up, inside the bend or on the face that touches a gasket, should say which face is up during punching or ask for deburring. Chapter 2's note, "BURR SIDE TO INSIDE OF BENDS", is the folder's instruction; the punch shop needs the same information to load the blank the right way up.

## Marking from the tooling

The forces in this chapter are applied through the die's shoulders and the punch's tip, and both can mark the part. On a visible face, die shoulder marks along each side of a bend are often unacceptable, especially on stainless steel or pre-painted sheet. Folders can reduce them with protective film, polymer die inserts or dies with rolling shoulders, each of which costs something.

The drawing should therefore say which faces are cosmetic. For the bracket, which is powder coated after folding and hidden inside a cabinet, no face is cosmetic, and the drawing says nothing, which lets the folder use its standard tooling. A cover variant with an exposed outer face would carry a note such as "OUTER FACE COSMETIC: NO TOOL MARKS", and the folder would price the film or inserts accordingly.

## Estimates, not settings

Every number in this chapter is a planning estimate. Real forming forces vary with the material batch, the tooling's condition, friction and the press brake's own characteristics, and real punching forces with the punch's clearance and sharpness. The folder and the punch shop work from their machines' charts and their own experience, and their machines' controls enforce the limits. The designer's estimate is for asking the right questions early: can a typical folder make this, and does anything on the drawing force an unusual method?

## Exercise: a longer bracket

A long version of the bracket, 1,200 mm along its bends, is wanted for a wider drive cabinet. In the original 2.0 mm mild steel, air bent in the V12 die, what force does each bend need, and would a 40-tonne press brake, about 392 kN, cope? What about the 3.0 mm high-strength variant at the same length?

**Worked answer.** Force is proportional to length, so the 300 mm figures scale by 1,200 ÷ 300 = 4.

- 2.0 mm mild steel: 4 × 63.9 = **255.6 kN** per bend, below 392 kN. A 40-tonne machine with a bed at least 1.2 m long, and tooling rated for 213 kN per metre, would cope.
- 3.0 mm high-strength: 4 × 98.8 = **395.2 kN** per bend, just above 392 kN. With the formula's uncertainty, a 40-tonne machine would be at or beyond its limit, and the folder would use its larger press brake.

The per-metre loads, 213 and 329 kN/m, are unchanged by length, so the tooling's ratings are not the issue; the machine's total capacity is. If the folder can only offer the larger machine for the long variant, its quote will reflect it, and that is a design consideration worth knowing before the variant is released.
