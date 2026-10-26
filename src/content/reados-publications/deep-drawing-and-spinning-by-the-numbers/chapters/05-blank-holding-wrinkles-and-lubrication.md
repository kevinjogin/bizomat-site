---
book: deep-drawing-and-spinning-by-the-numbers
chapterSlug: blank-holding-wrinkles-and-lubrication
order: 5
title: "Blank holding, wrinkles and lubrication"
description: "Hold a drawing flange flat without tearing the wall: holder pressure and area through the stroke, profiled force, lubrication, and catch a tear cured by a holder force that wrinkled the cup."
draft: false
---

The blank holder has the most delicate job in a draw. It must press the flange against the die's face hard enough to stop the shrinking flange buckling into wrinkles, and gently enough that the friction it creates does not add so much to the drawing force that the wall tears. Too little, and the cup wrinkles. Too much, and it tears. Between those two lies a window, and for a demanding draw in a work-hardening material that window can be narrow. Lubrication widens it, by letting the flange slide under the holder with less friction for the same pressure.

This chapter covers how the holding force is set from pressure and area, how the flange's area under the holder shrinks through the stroke and what that means for a constant force, how a profiled force follows the flange, and how lubrication fits in. The running case finds that an operator, faced with torn cups before the draw plan of Chapter 3 was fixed, reduced SC-100's holding force to less than half, and swapped the tears for wrinkles that tore the cups anyway.

## Why the flange wrinkles

As Chapter 1 showed, every ring of the flange shrinks in circumference as it is drawn in, so the flange is in compression around its circumference. A thin plate in compression buckles, and the flange buckles into radial waves, wrinkles, unless something stops it. The thinner the sheet relative to the blank, the more readily it wrinkles, which is why Chapter 3's t ÷ D matters. Thick blanks at modest ratios can be drawn without a holder; thin ones like SC-100's, at t ÷ D of about 0.4%, cannot.

Wrinkles in the flange are not only cosmetic. When a wrinkled flange is drawn into the die, its waves must pass through the gap between punch and die, which is only a little larger than the sheet's thickness. A wave several thicknesses high jams in the gap, the drawing force rises sharply, and the wall tears. Wrinkles therefore often end as tears, which is why reading the defect, as Chapter 1 urged, means looking at the flange's remains as well as at the tear.

## Pressure times area

The holding force is the holding pressure times the area of flange under the holder.

```figure
type: formula
title: Blank holder force from pressure and area
formula: F_BH = p × π ÷ 4 × (D_f² − D_h²)
caption: This is an illustration for the start of SC-100's first draw, at an illustrative holding pressure of 2.5 MPa. The right pressure for a real draw comes from the material, its thickness and trial.
- p | Holding pressure, MPa
- D_f | Current outer diameter of the flange, mm
- D_h | Inner diameter of the holder's contact, about the die opening plus its radius and clearance, mm
step: At the start: D_f = 199.3 mm, D_h ≈ 126.2 mm
step: Area ≈ π ÷ 4 × (199.3² − 126.2²) ≈ 18,690 mm²
step: F_BH ≈ 2.5 × 18,690 ≈ 46,700 N, about 46.7 kN
```

The holding pressures used in practice vary with the material, rising with its strength and with the sheet's thinness; handbooks give ranges and toolmakers refine them by trial. In this book's illustration, 2.5 MPa is the starting value for SC-100's first draw, chosen as the lowest pressure at which trial cups showed no flange wrinkles.

## The flange shrinks through the stroke

As the punch travels, the flange's outer edge moves inwards, and the area under the holder falls. For a cup of diameter d, each millimetre of punch travel moves about π × d mm² of the blank's area from the flange into the wall, so the flange's outer diameter after a travel s is roughly D_f = √(D² − 4ds).

This is an illustration. For SC-100's first draw on the 115 mm punch, the flange's outer diameter falls from 199.3 mm at the start to about 174.7 mm after 20 mm of travel, 146.0 mm after 40 mm, and leaves the holder entirely at about 52 mm. The area under the holder falls from about 18,690 mm² to about 11,460 mm² at 20 mm and 4,240 mm² at 40 mm.

## Constant force or constant pressure?

If the holder's force is held constant through the stroke, as a simple cushion set to one force will do, the pressure on the shrinking flange rises as its area falls. If the force follows the area, the pressure stays constant.

```figure
type: line
title: Holding pressure on SC-100's first-draw flange, by punch travel
x: Punch travel, mm
y: Holding pressure, MPa
legend: Constant force of 46.7 kN | Force profiled to hold 2.5 MPa
ymin: 0
ymax: 12
caption: This is an illustration from the flange's shrinking area. A constant force more than quadruples the pressure by 40 mm of travel; a profiled force holds it level.
- 0 | 2.5 | 2.5
- 10 | 3.1 | 2.5
- 20 | 4.1 | 2.5
- 30 | 5.9 | 2.5
- 40 | 11.0 | 2.5
```

The flange's own behaviour complicates the picture. It thickens as it shrinks, as Chapter 1's exercise showed, and the holder bears mainly on its thickest, outer ring, so the real contact pressure is less even than the averages suggest. The general point holds: a constant force grips the flange harder and harder as the draw proceeds, adding friction just when the wall, carrying the peak drawing force, can least afford it. A **profiled** cushion, whose force falls through the stroke, keeps the holding pressure closer to what is needed. For SC-100's first draw on the hydraulic press, the cushion was programmed to fall from 46.7 kN at the start to about 20 kN at 30 mm of travel, keeping the average pressure near 2.5 MPa.

Springs do the opposite. A spring-loaded holder's force rises as the springs compress through the stroke, which raises the pressure on the shrinking flange even faster than a constant force. Springs suit shallow draws and forgiving materials; deep draws in stainless steel need a cushion whose force can be controlled.

## The error: curing a tear with a wrinkle

This is an illustration. Before the two-stage plan of Chapter 3 was adopted, SC-100's single draw at a ratio of 1.99 was tearing three cups in ten. An operator, reasoning correctly that the holding force adds to the force the wall must carry, reduced the cushion from 46.7 kN to **20 kN**, a holding pressure at the start of the stroke of about **1.07 MPa**.

The tears did not stop. The next cups showed wrinkles in the flange's remains and in the top of the wall, and some tore later in the stroke, at the point where the wrinkled flange was being forced through the clearance. The lower holding force had reduced the friction, but it had let the flange buckle, and the buckled flange jammed in the die.

```figure
type: decision
title: Reading a drawing defect before changing the holder
question: Where is the defect, and what does the flange show?
- Tear at the punch radius, flange smooth | Too much force on the wall | Check the draw ratio, radii, clearance and lubricant before the holder
- Wrinkles in the flange or upper wall, no tear | Too little holding | Raise the holding pressure, or check the holder's flatness and parallelism
- *Tear at the punch radius, flange wrinkled | Wrinkles jammed in the clearance | Restore the holding force; the tear's cause is the wrinkle
- Tear with scoring on the wall | Friction from galling | Check the lubricant and the tools' finish
```

The fix had two parts. The cushion was returned to 46.7 kN, profiled through the stroke as above, which stopped the wrinkles; and the draw plan was changed to two stages, which removed the real cause of the original tears, a ratio too close to the limit. The general lesson is that the holding force is a balance between two defects, and changing it to cure one invites the other. A tear whose cause is the draw ratio cannot be cured by the holder; it can only be exchanged for a wrinkle.

## Finding the window in trial

The holding force's window can be found in trial the same way as Chapter 3's limiting ratio: draw cups at a series of starting forces, several at each, and note where wrinkles stop and where tears begin. This is an illustration. With SC-100's two-stage plan and its production lubricant, trial cups from the first draw showed flange wrinkles at starting forces below about **40 kN**, about 2.1 MPa, were clean from 40 kN to about **70 kN**, and began to tear at the punch radius above that. The window was therefore about 40 to 70 kN, and the setting of 46.7 kN sits about 17% above its lower edge and well below its upper.

The setting is placed near the lower edge on purpose. A force near the wrinkling limit adds the least friction and leaves the most margin against tearing, which is the more costly defect because it scraps the part outright, while light wrinkling in the flange is often removed with the trim. A setting near the lower edge needs a stable cushion and a consistent lubricant film, because a small fall in either crosses the edge. The trial should be repeated with sheet from a second coil, because the window moves with the material's properties, and a window that narrows sharply from coil to coil is a sign that the draw plan, not the holder, needs attention.

A window that does not exist, wrinkles below some force and tears above a slightly lower one, says the draw is beyond what the holder can rescue. That was SC-100's single draw at 1.99, and it is the strongest argument for finding the window in trial before a production tool is finished.

## Flatness, parallelism and stops

A holder only holds evenly if it is flat and parallel to the die's face. A holder tilted by a fraction of a millimetre grips the flange hard on one side and lets it wrinkle on the other, and the cup comes out with wrinkles on one side and a tear on the other. Where a part's flange thickens strongly, some dies use **spacers** or stops that limit how close the holder comes to the die, set to slightly more than the sheet's thickness, so that the holder controls wrinkles without pinching the thickening flange. The toolmaker chooses between pressure control and gap control for the part; for SC-100, the cushion's profiled pressure was used without stops.

## Draw beads

For shallow panels and rectangular boxes, where the holder alone cannot restrain the flange enough without very high pressure, **draw beads** are used: a raised ridge on the holder engaging a groove in the die, which the flange must bend over and straighten as it is drawn in. Each bead adds a controlled restraint where it is placed. Round cups like SC-100 rarely need them; rectangular boxes often have them along their straight sides, where the metal would otherwise flow in too freely compared with the corners.

## Lubrication

Lubrication reduces the friction between the flange and the holder and die, and between the wall and the die radius, which lowers the drawing force and widens the window between wrinkling and tearing. For stainless steel, which galls readily on tool steel, the lubricant must also keep the surfaces apart under high pressure, which is why drawing compounds for stainless steel are generally heavier-duty than those for mild steel. The lubricant's maker recommends a type and an application rate for the material and the severity of the draw.

Where it is applied matters. The flange's two faces and the die radius benefit most; lubricant on the punch's face can let the bottom slide on the punch and transfer more strain to the punch radius, which some toolmakers avoid on purpose. A consistent film from part to part matters as much as the type: a cup drawn with a dry spot behaves differently from the one before it.

## Cleaning after drawing

What goes on must come off. A drawn stainless steel part carries its drawing compound, and often fine particles from the tools, into the next operation. For SC-100, which must resist corrosion outdoors, residues and embedded iron particles can start corrosion on a surface that the material itself would resist. Drawn stainless parts are usually cleaned thoroughly after forming and, where the specification requires it, passivated. The lubricant should be chosen with its removal in mind, because a compound that draws well but cleans badly costs its saving back in the wash.

## Recording the holder setting

The process sheet should record each stage's holding force or force profile, the pressure and area it was derived from, the lubricant, its application and the trial evidence that set them: the lowest force at which no wrinkles appeared, and the margin above it. For SC-100's first draw, that is the profiled cushion from 46.7 kN to 20 kN over 30 mm, the starting pressure of 2.5 MPa, and the lubricant's type and application. An operator who changes the setting can then see what it was and why, and a change can be recorded, and reversed, rather than lost.

## Exercise: the redraw's holder

SC-100's redraw takes the 115 mm cup to 100 mm. In a direct redraw, the holder is a sleeve inside the cup, pressing the cup's bottom area outside the new die's opening against the die. If the sleeve contacts a ring from about 106 mm to 113 mm diameter, at an illustrative 4 MPa because the metal has work-hardened, what is the holding force? Why is it so much less than the first draw's?

**Worked answer.** The contact area is π ÷ 4 × (113² − 106²) ≈ **1,204 mm²**, and the force is about 4 × 1,204 ≈ **4.8 kN**. It is about a tenth of the first draw's 46.7 kN, because the redraw's "flange" is only the narrow ring of the first cup's bottom between the old and new diameters, and because the cup's wall, already formed, is far stiffer against wrinkling than a flat flange.

That is one reason a redraw at a modest ratio is an easier stage than a first draw, even in a work-hardened cup. Chapter 4's exercise assumed 15 kN for the redraw's holder, which is conservative against this estimate; the trial's load monitor would show which is closer.
