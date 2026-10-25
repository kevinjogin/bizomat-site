---
book: sheet-metal-parts-by-the-numbers
chapterSlug: springback-and-overbending
order: 5
title: "Springback and overbending"
description: "Estimate springback from material strength, modulus, radius and thickness, see why it grows with radius, calculate the overbend a folder needs, and what a small angle error does to a flange."
draft: false
---

When the punch lifts, every bend opens a little. The outer fibres of the bend were stretched beyond yield, but part of the strain in every fibre was elastic, and that part recovers. The bend's angle opens and its radius grows. A folder who bends to exactly 90° gets something slightly more than 90°, and has to bend further, an overbend, so that the part springs back to the angle the drawing wants.

Springback is the folder's problem to manage at the machine, but the designer creates it, through the choice of material, thickness and radius, and the designer sets the angle tolerance that decides how carefully it must be managed. This chapter gives a classical estimate of springback, shows why it grows rapidly with the bend radius and the material's strength, and works out what an angle error does to a flange's position. The running case finds that a high-strength variant of the bracket springs open enough to spoil a clamp.

## Why bends spring back

In a bend, the stress through the thickness rises from zero at the neutral axis to the material's yield stress some way out, and stays near yield to the outer surfaces. When the bending moment is removed, the whole section unloads elastically. The elastic recovery is proportional to the stress divided by the modulus, so it depends on how strong the material is and how stiff it is. A strong material with a low modulus, such as a high-strength aluminium alloy, springs back much more than a soft steel.

The geometry matters as much. In a tight bend, most of the section is deep in the plastic range and the elastic core is thin, so there is little to recover. In a gentle bend, a large part of the section stays elastic, and the bend recovers a large fraction of its angle. That is why large-radius bends spring back far more than tight ones, and why Chapter 2 found that beyond a certain radius a bend never takes a permanent set at all.

## A classical estimate

For a bend formed by pure bending to an inside radius Rᵢ, an estimate published by Gardiner in 1957 relates the radius after springback, R_f, to the material and geometry through a single ratio:

x = Rᵢ × σ_y ÷ (E × t)        Rᵢ ÷ R_f = 4x³ − 3x + 1

where σ_y is the yield stress and E the modulus. Because the neutral axis keeps its length, the angle opens in inverse proportion to the radius at mid-thickness:

(Rᵢ + t ÷ 2) × θᵢ = (R_f + t ÷ 2) × θ_f

so the folder must bend to θᵢ = θ_f × (R_f + t ÷ 2) ÷ (Rᵢ + t ÷ 2) to finish at θ_f. The WORKOS [springback calculator](/tools/bending-springback/) applies the same estimate.

```figure
type: formula
title: Springback by Gardiner's pure bending estimate
formula: x = Rᵢ σ_y ÷ (E t)        Rᵢ ÷ R_f = 4x³ − 3x + 1
formula: angle to bend to = required angle × (R_f + t ÷ 2) ÷ (Rᵢ + t ÷ 2)
caption: This is an illustration for the bracket's mild steel, with a yield stress of 280 MPa and a modulus of 200,000 MPa. Pure bending; air-bent parts usually spring back more than this estimate at tight radii.
- Rᵢ, R_f | Inside radius while bent and after release
- σ_y, E | Yield stress and elastic modulus, MPa
- t | Thickness, 2.0 mm
step: x = 2 × 280 ÷ (200,000 × 2) = 0.0014
step: Rᵢ ÷ R_f = 0.9958, so R_f = 2.008 mm
step: To finish at 90°, bend to 90° × 3.008 ÷ 3.000 = 90.25°
```

## What the estimate says, and what it misses

For the bracket's 2 mm radius in 2 mm mild steel, the estimate gives only **0.25°** of springback. The folder's trial bends, however, sprang back between 1.0° and 1.5°. The difference is not an error in the arithmetic but in the model: air bending does not bend the sheet to a uniform radius under a pure moment. The sheet is supported at the die's shoulders and pushed at the punch tip, the curvature varies along the bend, and the region near the punch is bent much more tightly than the region near the shoulders. The pure bending estimate describes the trend well and underestimates the amount at tight radii.

The trend is the useful part. The estimate shows how springback grows with radius, strength and lower modulus, which tells the designer which choices will make the folder's job harder. For the measured amount, the folder's trial bends are the authority, and modern press brakes often measure the angle during the bend and correct for springback automatically. A designer comparing two material choices can still use the estimate's ratio with confidence: if the estimate says one choice springs back twice as much as another, the folder's trials will usually show something similar, even if both measured values are larger than the estimates.

```figure
type: bars
title: Estimated springback at 90° against inside radius, 2.0 mm sheet
unit: °
max: 20
caption: This is an illustration from Gardiner's estimate, mild steel with σ_y 280 MPa and E 200,000 MPa. Springback grows roughly in proportion to the radius once the radius is several times the thickness.
- R = 2 mm, the bracket | 0.25
- R = 5 mm | 0.8
- R = 10 mm | 1.75
- *R = 20 mm | 3.76
- R = 40 mm | 8.04
- R = 80 mm | 17.86
```

## Springback and the flat pattern

Springback changes the angle, and it also changes the radius slightly, from 2.000 to 2.008 mm in the estimate for the bracket. Does that change the flat pattern? Not in practice. The flat pattern's bend allowance was measured with trial strips that had already sprung back, so the K-factor of Chapter 3 includes whatever springback happened at that radius and angle. That is another reason to measure K on parts bent the way the real part will be bent: a K-factor measured on strips bent to 90° by bottoming would not quite match an air-bent part, because the two spring back differently.

## Material matters as much as radius

The ratio σ_y ÷ E carries the material into the estimate. A higher yield stress raises springback; so does a lower modulus. This is an illustration, at the bracket's 2 mm radius in 2 mm sheet:

- mild steel, σ_y 280 MPa, E 200,000 MPa: estimated **0.25°**;
- high-strength steel, σ_y 420 MPa, E 200,000 MPa: estimated **0.38°**;
- an aluminium alloy, σ_y 200 MPa, E 70,000 MPa: estimated **0.52°**.

At a 20 mm radius the same three give 3.76°, 5.76° and 8.03°. Aluminium's low modulus roughly doubles steel's springback at the same yield stress, which is why aluminium parts with large radii often need forming methods other than air bending.

```figure
type: compare
title: Estimated springback by material and radius
cols: Yield stress | Modulus | At R = 2 mm | At R = 20 mm
caption: This is an illustration from Gardiner's estimate for 2.0 mm sheet bent to 90°. Property values are illustrative, not a grade's specification.
- Mild steel | 280 MPa | 200,000 MPa | 0.25° | 3.76°
- High-strength steel | 420 MPa | 200,000 MPa | 0.38° | 5.76°
- *Aluminium alloy | 200 MPa | 70,000 MPa | 0.52° | 8.03°
```

## What an angle error does to a flange

Springback is managed to within a tolerance, not eliminated, so the finished angle varies. The designer needs to know what that variation does to the part.

A flange of length L that is out of angle by Δθ moves its far end sideways by about L × sin Δθ. On the bracket's 60 mm legs, an angle error of 0.5° moves the top of the leg by 60 × sin 0.5° = **0.52 mm**; 1° moves it 1.05 mm; 2° moves it 2.09 mm. The return flange's tip, a little farther from the bend, moves slightly more.

For the bracket, the top of each leg carries a clamp that holds the drive, and the clamp's slots allow ±0.5 mm of float, as Chapter 3 noted. The legs' angle tolerance must therefore keep the top of each leg within that float, which means roughly ±0.5° on each leg's bend. The folder confirmed that its press brake's angle measurement holds ±0.5° on 2.0 mm mild steel, and the drawing states "BEND ANGLES 90° ±0.5°".

```figure
type: range
title: Width across the top of the legs for different angle errors
min: 158
max: 166
unit: mm
caption: This is an illustration. Both legs of the 160 mm base opening outwards by the same angle. The clamp allows about ±0.5 mm on each side, so ±1 mm on the width.
ticks: 158 | 160 | 162 | 164 | 166
- ±0.5° on each leg | 158.95 | 161.05
- ±1° on each leg | 157.9 | 162.1
- *Both legs 2° open, the high-strength trial | 164.19 | 164.19
- Clamp's float | 159 | 161
```

## The error: the high-strength variant

This is an illustration. The first trial of the high-strength variant from Chapter 2, folded with the mild steel bracket's press brake program, came out with both legs about 2° open. The folder had not changed the program's angle correction for the stronger material, and the stronger material sprang back further.

With both legs 2° open, the top of each leg sat 60 × sin 2° = 2.09 mm outside its intended position, and the width across the top of the legs was 160 + 2 × 2.09 = **164.19 mm** instead of 160 mm. The clamp, with its ±0.5 mm float, could not be fitted.

The folder measured the angles, re-ran its springback correction for the new material with trial strips, and folded the next parts at 90° ±0.5°. The designer added the material's name to the bend angle note, so that anyone setting up the press brake sees that the program for one material is not the program for another: "BEND ANGLES 90° ±0.5° (HIGH-STRENGTH STEEL: CONFIRM SPRINGBACK CORRECTION)".

## Bottoming and coining

Air bending sets the angle by stroke depth and leaves springback to be corrected. Two older methods reduce springback by force instead. In **bottoming**, the punch drives the sheet down onto the die's faces, so that the die's angle, rather than the stroke, sets the part's angle. In **coining**, the punch tip is pressed into the inside of the bend hard enough to thin it locally, which relieves the elastic stresses that cause springback.

Both need much more force than air bending. Bystronic's tonnage guidance, used in Chapter 8, applies a method factor of 1.0 for air bending, 5.0 or more for bottom bending and 10.0 or more for coining. The press brake that folds the bracket comfortably by air bending might not have the capacity to bottom it along its full 300 mm length, and coining would need dies matched to the exact angle and thickness. For a part like the bracket, a press brake with angle measurement and correction in air bending is usually the better answer, and the designer need only state the angle and its tolerance.

## Measuring the finished angle

An angle tolerance is only as good as its measurement. A bend's angle should be measured across the flanges' flat portions, clear of the bend region, with a protractor, an angle gauge or a fixture, and at more than one point along the bend: a long bend can be more closed at one end than the other if the press brake's ram or bed deflects under load, which folders call crowning when they compensate for it.

This is an illustration. The bracket's folder checks each leg's angle at 30 mm from each end and at the middle of the 300 mm bend. A first-off part read 90.3°, 89.8° and 90.4°, all inside ±0.5°, with the middle slightly more closed than the ends. Had the middle read more than 0.5° different from the ends, the folder would have adjusted its crowning before running the batch. The drawing's angle tolerance applies to every point along the bend, and the inspection plan says where to measure.

## Springback from batch to batch

Springback depends on the yield stress, and yield stress varies between batches of the same grade, often more than the designer expects. A batch at the strong end of a grade's range springs back more than one at the weak end, and a press brake program set for one batch will be slightly off for the next. The variation is small for the bracket's tight radius, where springback itself is small, and large for a 20 mm lip, where it is several degrees.

Folders manage this with first-off checks on each new batch or, on press brakes that measure angles during bending, automatically. Designers can help by not specifying materials whose properties vary more than the part's tolerance allows, and by stating on the drawing when an angle is critical, so that the folder checks it on every batch rather than every year.

## Designing to make springback easier

The designer cannot remove springback but can make it smaller and more consistent:

- **Use tighter radii where function allows**, within the material's limit, because springback grows with radius.
- **Avoid long, unsupported flanges with tight angle requirements**, because a small angle error becomes a large position error at the end of a long flange.
- **Add stiffening features near the bend**, such as small gussets or ribs pressed across the bend, which set the angle more firmly, where the folder can form them.
- **Allow a realistic angle tolerance**, and where the function needs a precise position at the end of a flange, consider a feature that absorbs the error, such as a slot, rather than a tighter angle.

## Exercise: a large-radius lip

A cable tray lip on the same conveyor is folded from 2.0 mm mild steel with a 20 mm inside radius to 90°. Using Gardiner's estimate, what angle must the folder bend to, and what radius does the lip finish at? What happens if the folder bends it to 90° and does not correct?

**Worked answer.** x = 20 × 280 ÷ (200,000 × 2) = **0.014**. Then Rᵢ ÷ R_f = 4 × 0.014³ − 3 × 0.014 + 1 = 0.958, so R_f = 20 ÷ 0.958 = **20.88 mm**.

The angle opens in the ratio (Rᵢ + t ÷ 2) ÷ (R_f + t ÷ 2) = 21.00 ÷ 21.88 = 0.960, so to finish at 90° the folder must bend to 90° ÷ 0.960 = **93.8°**.

Bent to 90° without correction, the lip would finish at 90° × 0.960 = **86.4°**, 3.6° short. On a 50 mm lip, that moves its edge by about 50 × sin 3.6° = 3.1 mm. A tray lip will tolerate that; a lip that must line up with a cover would not. Because the estimate understates springback in air bending, the folder should still confirm the overbend with a trial piece before running the batch.
