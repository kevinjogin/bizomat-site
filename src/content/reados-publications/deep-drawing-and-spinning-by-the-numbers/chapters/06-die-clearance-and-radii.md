---
book: deep-drawing-and-spinning-by-the-numbers
chapterSlug: die-clearance-and-radii
order: 6
title: "Die clearance, radii and tool sizes"
description: "Size a drawing tool's punch and die from the part: clearance for a thickening wall, die and punch radii, finish, venting, and catch a clearance set to the sheet's thickness that ironed the rim."
draft: false
---

A drawing tool is a punch, a die and a blank holder, and the numbers that matter most in it are small: the gap between punch and die, and the radii over which the metal bends as it enters the die and wraps the punch. A few tenths of a millimetre in the clearance, or a millimetre or two in a radius, separate a tool that draws cleanly from one that tears, wrinkles, scores or irons the wall. These dimensions are where the part's drawing, the draw plan and the toolmaker's experience meet, and they should be calculated and recorded rather than left to habit.

This chapter sizes SC-100's punches and dies from the part's dimensions, sets the clearance against the wall's thickening, chooses the die and punch radii for each stage, and covers the tools' finish and venting. The running case finds that SC-100's first draw die was made with a clearance equal to the sheet's thickness, which ironed the thickened rim at the end of every stroke and produced a second force peak that tore some cups.

## Which tool makes which surface

The **punch** forms the inside of the cup and the **die** the outside. A part dimensioned to its inside, as most covers that fit over something are, has its critical diameter set by the punch; one dimensioned to its outside, as a part that fits into something is, by the die. The other tool is then sized from it by the clearance.

```figure
type: formula
title: Punch and die sizes for a drawing stage
formula: punch diameter = mean diameter − t;   die opening = punch diameter + 2 × c
caption: This is an illustration for SC-100's two stages in 0.8 mm sheet, with a clearance per side of 0.96 mm, 1.2 times the sheet's thickness.
- t | Sheet thickness, mm
- c | Clearance per side between punch and die, mm
step: First draw, 115 mm mean: punch ≈ 114.20 mm, die ≈ 116.12 mm
step: Redraw, 100 mm mean: punch ≈ 99.20 mm, die ≈ 101.12 mm
step: SC-100's inside diameter, 99.2 mm, is the redraw punch's diameter
```

The final stage's punch makes the part's inside diameter, so its tolerance is the part's tolerance, less the punch's wear allowance and less the cup's **springback**, the small elastic recovery when the part is stripped off. Earlier stages' tools need only be consistent with the plan.

## Clearance for a thickening wall

In blanking and piercing, the clearance between punch and die is a small fraction of the sheet's thickness, because the aim is to shear the metal cleanly. In drawing, the aim is the opposite: the wall must pass between punch and die without being cut or squeezed. The clearance per side is therefore **larger** than the sheet's thickness, to allow for the thickening that Chapter 1 described. Toolmakers commonly work with clearances somewhat above the thickness, and refine them for the material and the part.

This is an illustration. Trial cups from SC-100's first draw measured about **0.92 mm** thick at the rim, about 15% thicker than the 0.8 mm sheet, and close to the sheet's thickness lower down the wall. A clearance per side of **0.96 mm**, 1.2 times the sheet's thickness, passes the thickened rim without squeezing it, and is not so loose that the wall wanders and the cup comes out tapered or out of round.

A clearance smaller than the wall's thickness **irons** the wall, thinning it to the gap, as Chapter 8 does on purpose. A clearance much larger lets the wall bulge and wrinkle as it enters the die, and the cup's diameter and roundness suffer. The right clearance sits just above the thickest wall the draw produces.

## The error: clearance equal to the sheet

This is an illustration. SC-100's first-draw die was machined to a die opening of **115.80 mm**, a clearance per side of 0.80 mm, equal to the sheet's thickness. The die's drawing had taken its clearance from a template for drawn parts in a thinner, less work-hardening material, where a clearance equal to the thickness had worked.

For most of the stroke the wall, close to 0.8 mm thick, passed through. In the last part of the stroke, the rim, thickened to about 0.92 mm, arrived at the gap and was ironed down to 0.80 mm, a reduction of about **13%**. The load monitor showed a second force peak near the bottom of the stroke, where none should have been, and some cups tore just below the rim or stuck on the punch with burnished lines around their upper wall.

```figure
type: bars
title: SC-100's first draw: wall thickness and clearance per side, mm
unit: mm
max: 1.1
caption: This is an illustration. A clearance equal to the sheet's thickness is smaller than the thickened rim, so the rim is ironed at the end of the stroke.
- Sheet thickness | 0.80
- Clearance as first machined | 0.80
- Rim thickness measured in trial | 0.92
- *Clearance as reworked, 1.2 t | 0.96
```

The fix was to grind the die opening to 116.12 mm, a clearance of 0.96 mm per side. The second force peak disappeared, the burnishing stopped and the tears near the rim with it. The general lesson is that a drawing clearance must be set against the thickest wall the draw makes, which depends on the draw ratio and the material, and that a template value from another part carries no evidence about this one. Measuring the trial cup's rim thickness takes a micrometer and a minute, and the measurement, with the cup it came from, belongs in the tool's trial record beside the clearance it set.

## The die radius

The **die radius**, the rounded edge of the die's opening, is where the flange bends to enter the die and straightens to become wall. Its size affects the draw strongly.

- **Too small**, and the flange resists bending over it, the drawing force rises, and the wall may tear; the metal can also be scored or thinned at the radius.
- **Too large**, and the part of the flange that has left the holder but not yet reached the wall is unsupported over a long arc, and wrinkles there, where the holder cannot reach.

Toolmakers commonly choose die radii of several times the sheet's thickness for drawing, adjusting for material and draw ratio. This is an illustration. SC-100's first-draw die has a radius of **4.8 mm**, six times the sheet's thickness, which in Chapter 4 set the holder's inner diameter. Its redraw die has a smaller radius suited to the cup's stiffer wall, set by the toolmaker in trial.

## The punch radius

The **punch radius**, the rounded nose of the punch, forms the cup's corner, and it is where the wall is thinnest and most likely to tear. A small punch radius concentrates the bending and stretching there; a larger one spreads it.

The final stage's punch radius makes the part's inside corner. SC-100's corner is 4 mm at mid-thickness, so its redraw punch has a nose radius of about **3.6 mm**, the mean radius less half the thickness. The first draw's cup has a 6 mm mean corner, a punch radius of about 5.6 mm, which spreads the strain while the draw is hardest; the redraw sharpens it to the part's radius. A part that needs a sharper corner than the draw can safely give is usually drawn with a generous radius and then **restruck** or sized in a final stage, which forms the corner with little further drawing.

## Finish and tool material

The die radius and the die's face carry the flange under pressure as it slides, and the punch carries the bottom. Their **surface finish** affects friction and galling. Drawing tools are usually hardened and their working surfaces polished, often in the direction of the metal's flow, and some are coated to reduce friction and galling. For stainless steel, which galls readily, the toolmaker's choice of tool material, hardness, coating and polish matters as much as the lubricant. A die radius that starts to pick up material shows it at once as scoring on the cups' walls, and should be repolished before the scoring becomes a tear.

## Venting and stripping

When a cup is drawn tightly onto its punch, the air that was between them is expelled, and when the punch withdraws, a vacuum can form under the cup's bottom, holding the cup on the punch and sometimes collapsing the bottom inwards as it is stripped off. A small **vent hole** through the punch, from its face to the atmosphere, lets air back in and releases the cup. The cup is stripped from the punch by the die's lower edge or a stripper ring as the punch withdraws. Vent holes can also let trapped lubricant escape that would otherwise leave a dent in the cup's bottom. They are a small detail on the punch's drawing that is easily forgotten and quickly missed in trial. SC-100's punches each have a central vent of a few millimetres' diameter, with its exit kept clear of the press's lubricant spray so that it does not draw lubricant back in on the return stroke.

## Tolerances from the tools

A drawn part's dimensions come from its tools, and its tolerances should match what the tools hold. The inside diameter, made by the last punch, can be held closely. The height before trimming varies with the blank, the material and the lubricant, which is why it is trimmed, as Chapter 7 shows. The wall's thickness varies along its length as the process gives it, and is specified, as Chapter 1 recommended, as nominal with limits on thinning. Roundness and taper depend on the clearance and the springback. A drawing that asks for tolerances the tools cannot hold invites a sizing or machining stage that the quote may not have included.

## Wear and regrinding

Drawing tools wear, and they wear where the work is: the die radius, where the flange slides under pressure, and the die's opening, where the wall passes. As the die radius wears it grows larger and rougher, and as the opening wears it grows larger, increasing the clearance. A larger clearance lets the wall wander, and the cup's diameter, which the punch controls on its inside, is still right while its roundness and taper slowly worsen. A worn, rough radius raises friction and scores the wall. Neither shows on a single cup; both show in a trend.

This is an illustration. If SC-100's redraw die opening wears by about 0.01 mm on its diameter for every few thousand cups, it takes tens of thousands of cups to move the clearance by a tenth of the sheet's thickness. The rate in practice depends on the material, the lubricant and the tool's hardness and coating, and it is found by measuring the die at intervals, not by assuming. A tool record with the die's sizes measured at each maintenance shows when it is due for repolishing or replacement, before its parts drift out of tolerance.

## SC-100's tool sizes

Gathering this chapter's numbers, SC-100's two drawing stages are sized as follows.

```figure
type: compare
title: SC-100's punch and die sizes by stage
cols: Punch diameter | Die opening | Clearance per side | Die radius | Punch nose radius
caption: This is an illustration. Clearance is set against the 0.92 mm rim measured in trial; the redraw's die radius is set in trial.
- First draw, 115 mm mean | 114.20 mm | 116.12 mm | 0.96 mm | 4.8 mm | 5.6 mm
- *Redraw, 100 mm mean | 99.20 mm | 101.12 mm | 0.96 mm | Set in trial | 3.6 mm
```

Each number in the table has a source: the part's mean dimensions, the sheet's thickness, the rim thickness measured in trial, and the toolmaker's choice of radius for the material. That is the test of a tool table: a reviewer should be able to trace every dimension back to the part, the plan or a measurement.

## Recording the tool sizes

The tool drawing for each stage should carry the punch diameter, the die opening, the clearance per side and the thickness it was set against, the die radius and the punch radius, each with the part dimension or the trial measurement it came from. For SC-100, that is two short tables, for the first draw and the redraw, plus the trimming tool. When a die is reground or replaced, its sizes are checked against the table, and a clearance that has grown with wear, or a radius that has been polished larger, is visible as a change rather than discovered as a defect.

## Exercise: an aluminium version

The customer asks for a lighter version of SC-100 in 1.2 mm aluminium alloy sheet, with the same 100 mm mean diameter and 4 mm mean corner radius. Using the same rules, a clearance per side of 1.2 times the thickness and a die radius of six times the thickness, what are the redraw punch's diameter, the die's opening and the first draw's die radius? What else should change?

**Worked answer.** The redraw punch's diameter is 100 − 1.2 = **98.8 mm**, and the clearance per side 1.2 × 1.2 = 1.44 mm, so the die opening is 98.8 + 2 × 1.44 = **101.68 mm**. The first draw's die radius is 6 × 1.2 = **7.2 mm**. The punch nose radius for the 4 mm mean corner is 4 − 0.6 = **3.4 mm**, which is under three times the new thickness, sharper relative to the sheet than SC-100's, and may need a restrike.

The blank, the draw plan, the force and the holder pressure all change with the material. Aluminium's limiting ratio, strength, work hardening and galling behaviour differ from 304's, so each chapter's calculation must be redone, and the rim thickening measured again in trial before the clearance is finalised. A material change in a drawn part is a new tool design that happens to share the part's dimensions.
