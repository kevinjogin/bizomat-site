---
book: checking-drawings-by-the-numbers
chapterSlug: enough-views-and-the-right-ones
order: 3
title: "Enough views, and the right ones"
description: "Check that every feature is shown in true shape and located in every direction: a feature-by-view matrix, sections that cut the right features, auxiliary views and redundant views."
draft: false
---

A drawing's views must between them show every feature's shape without ambiguity and give a place to dimension it in every direction. Too few views leave a feature guessed at; too many crowd the sheet, invite duplicated dimensions and make the drawing slower to read. The drafter chose the views while thinking about the part as a whole. The checker tests the choice feature by feature, which is the only way to find the one feature that no view quite shows.

This chapter sets out that test. It builds a matrix of features against views, explains what each view must do for each feature, and shows how sections, auxiliary views and partial views fill the gaps. It checks the TA-201 arm and finds an inclined hole whose angle appears in no view, and whose breakout edge turns out to be too thin.

## What a view must do for a feature

For each feature, the views together must do three things:

1. **Show its shape**, ideally in true shape in at least one view: a hole as a circle, a slot as its outline, a chamfer as its profile.
2. **Show its extent in the third direction**: how deep the hole goes, how thick the boss is, whether a slot runs through. Hidden lines can do this, but a section usually does it better.
3. **Provide somewhere to dimension it**, in every direction its position and size need, without dimensioning to hidden lines where a visible line is available.

A feature that passes all three needs no further view. A feature that fails one needs either a different view, an added section or detail, or a note that makes its form unambiguous, such as "THRU" on a hole.

## The feature-by-view matrix

The quickest systematic test is a small table: features down the side, views across the top, and in each cell what that view shows of that feature. It sounds laborious and takes about ten minutes for a part like the arm, because most cells are obvious. The value is in the few cells that are not.

This is an illustration. The arm drawing has two views on sheet 1: a front view looking along the pivot axis, and a section A–A through the pivot and spindle axes. Sheet 2 adds enlarged details of the bore chamfers. The checker listed the arm's 14 functional features and filled the matrix.

```figure
type: compare
title: Feature-by-view matrix for the TA-201 arm, as first drawn
cols: Front view | Section A–A | Shape, depth and location all shown?
caption: This is an illustration. One feature, the spring anchor hole, has its angle shown in neither view.
- Pivot bore Ø16 | True shape | Depth and both boss faces | Yes
- Pivot boss front and rear faces | Edge only | True extent, 30 mm length | Yes
- Spindle tapped hole M12 | True shape | Depth, through | Yes
- Spindle boss faces | Edge only | True extent | Yes
- Stop lug face | Profile and angle | Not cut | Yes
- Bore chamfers, front and rear | Hidden circles | Profile, enlarged on sheet 2 | Yes
- *Spring anchor hole Ø8.5, drilled at 15° | An ellipse | Not cut | No: angle and breakout unseen
- Web, 12 mm thick | Outline | Thickness | Yes
- Cast outline | True shape | Thickness at the cut | Yes
```

## The running case: the spring anchor hole

This is an illustration. The spring that loads the tensioner hooks through a Ø8.5 mm hole in the arm's web. So that the spring pulls straight, the design drills the hole at 15° to the pivot axis, tilted in the plane that contains the arm's centreline.

In the front view, looking along the pivot axis, a hole tilted by 15° appears as an ellipse whose major axis is 8.5 ÷ cos 15° = 8.80 mm, a shape that most readers would take for a slightly distorted circle. Section A–A runs through the pivot and spindle axes and does not pass through the anchor hole. No view shows the 15° angle, no view shows where the hole breaks out on the far face, and the only dimension given for the angle, "15°", has a leader pointing at the ellipse. A machinist could guess the direction of tilt; so could the inspector; they might guess differently.

The checker's fix was to ask for a section B–B through the anchor hole's axis, square to the web, drawn on sheet 2 at 2:1. In that section the hole appears as two parallel lines at 15°, its entry and breakout are visible, and the angle can be dimensioned to the web face, which is the surface the drill starts on.

## Drawing the section found a second fault

Sketching section B–B to confirm the request, the checker noticed what the missing view had hidden. The web is 12 mm thick, and the hole's centre is 9 mm from the web's outer edge at the entry face. Tilted at 15°, the hole's centre moves 12 × tan 15° = **3.22 mm** across the web by the time it reaches the far face, and the tilt is towards the edge.

At the far face, the hole's centre is therefore 9 − 3.22 = 5.78 mm from the edge, and its edge is 5.78 − 4.25 = **1.53 mm** from the outer edge of the web. A wall that thin in a cast web, carrying the spring load, is a likely crack and a certain casting problem.

The design brief did not set a minimum wall, so the checker took the finding to the approver, who set 3 mm. To keep 3 mm of wall at the far face, the centre at the entry face must be at least 3 + 4.25 + 3.22 = **10.47 mm** from the edge, so the designer moved the hole to 11 mm from the edge and added a local pad on the casting to keep the material around it. The fault was a design fault, but the missing view was what let it through.

```figure
type: formula
title: Where an inclined hole breaks out through a plate
formula: lateral shift at breakout = t × tan θ
formula: wall at breakout = c − t × tan θ − d ÷ 2
caption: This is an illustration for the arm's spring anchor hole, tilted towards the edge. A hole tilted away from the edge gains wall instead.
- t | Plate or web thickness, 12 mm
- θ | Tilt of the hole from square to the face, 15°
- c | Distance from the hole centre to the edge at the entry face
- d | Hole diameter, 8.5 mm
step: Shift = 12 × tan 15° = 3.22 mm
step: As drawn, c = 9: wall = 9 − 3.22 − 4.25 = 1.53 mm
step: For a 3 mm wall, c ≥ 3 + 3.22 + 4.25 = 10.47 mm; the hole moved to 11 mm
```

## The principal view

Before testing individual features, the checker looks at the choice of principal view, the front view from which the others are projected. A good principal view shows the part in its most characteristic shape, with the fewest hidden lines, usually in the orientation it has in use or on the machine that makes it. For the arm, the front view looks along the pivot axis and shows the arm's profile, both bores as circles and the stop lug's angle, which is the right choice: it is the view a machinist sees when the arm is clamped to drill and bore it, and it puts most features in true shape at once.

A poor principal view shows up in the matrix as many features seen only edge-on or hidden. If more than a few of the matrix's cells say "edge only" for the principal view, it is worth asking whether another view should lead.

## Cast form and machined form

A part made by casting or forging and then machined has two shapes: the shape that comes out of the mould, and the shape after machining. Some offices draw both on one sheet, with the machined surfaces identified by surface texture symbols and the cast surfaces left to general casting tolerances. Others draw them on separate sheets, or as separate drawings, one for the foundry and one for the machine shop.

The arm uses two sheets: sheet 1 shows the finished part with its cast outline, and sheet 2 the machining details. The checker confirms that the matrix covers both. For each machined feature, a view must show it machined, with its size and tolerance; for each cast surface that a machining operation locates from, a view must show it clearly enough for the machine shop to set up on it. The arm's machining is located from the cast pivot boss and the cast web face, and both appear in section A–A, so the machine shop can find its datums. The stop lug face is machined from a cast lug whose cast thickness, 14 mm, is given on sheet 1, so the 2 mm machining allowance to its finished 12 mm is clear.

## When a 3D model is supplied

Many suppliers now receive the 3D model with the drawing. It can be tempting to accept fewer views on the grounds that the model shows everything. The checker should first find out which governs. If the drawing governs, as it does in the running case office's procedure, the drawing must be complete on its own, because the model carries no tolerances, no material notes and no surface texture unless the office uses a model-based definition, and because a supplier may print the drawing and never open the model. If the model governs, the drawing becomes a supplement, and the checking task changes, but that change should be a written decision, not a consequence of thin drawings.

## Sections: what they cut and what they miss

Sections are the most powerful tool for showing interiors, and the most common source of view gaps, because a section shows only what its cutting plane passes through. The checker asks three questions of every section.

- **Does the cutting plane pass through every interior feature that needs it?** Section A–A through the pivot and spindle axes shows both bores. It does not show the anchor hole, which lies off that plane.
- **Is the cutting plane identified and the view labelled?** The section line on the front view must carry the letters and arrows, and the section must be titled to match, "SECTION A–A", with its scale if it differs.
- **Is the hatching unambiguous?** Hatching shows cut material; a section through a bushed bore should hatch the arm and the bush differently on an assembly, but on the arm's detail drawing only the arm appears.

Offset and aligned sections can catch features off a single plane, at the cost of being harder to read. For the arm, a separate small section was clearer than bending A–A through the anchor hole.

## Auxiliary and partial views

A feature on an inclined face, or an inclined feature on a flat face, is not seen in true shape in any principal view. An **auxiliary view**, projected square to the inclined face or along the feature's axis, shows it truly. A **partial view** shows only the region of interest, saving space. The anchor hole's section B–B is in effect a partial auxiliary section.

The checker's test for any feature seen only as an ellipse or a foreshortened shape is simple: can its size and angle be dimensioned in a view where it appears true? If not, a view is missing.

## Views that are not needed

The opposite fault, too many views, is less dangerous but still worth finding. A view that shows nothing not already shown invites a second copy of a dimension, and a second copy can disagree with the first after an edit. A useful test is to cover each view in turn and ask whether anything becomes undefined. If nothing does, the view is redundant, unless it helps a reader understand the part, which is a legitimate reason to keep it without dimensions.

This is an illustration. The pin drawing, TA-202, has a front view and an end view. The end view shows a circle and a centre mark; every feature of the pin, its diameters, lengths, groove and chamfers, is defined in the front view with Ø symbols. Covering the end view leaves nothing undefined. The checker suggests deleting it, and the drafter agrees. The sheet is clearer, and the space saved goes to the enlarged groove detail that the exercise below asks for.

```figure
type: decision
title: A feature fails the view test. What is the remedy?
question: Which fix makes the feature's shape, depth and location unambiguous with least clutter?
- Shape not seen in true form | Auxiliary or partial view square to the feature | The anchor hole in section B–B
- Depth or interior unseen | Section through the feature, or a note such as THRU | Bores, pockets, blind holes
- *Feature off every section plane | A separate small section, or an offset section | Usually clearer than bending the main section
- View adds nothing | Delete it, or keep it undimensioned for understanding | The pin's end view
```

## Hidden lines

Hidden lines show features behind the visible surfaces, and good practice is to show them where they help and omit them where they confuse. The checker looks for two faults. A hidden line used as the only way to show a feature's depth, when a section would be clearer, makes dimensioning to it necessary, which most offices avoid. And a view crowded with hidden lines, often from a CAD default that shows every hidden edge, makes the visible features hard to read. On the arm's front view, the CAD default showed the hidden bore chamfers, the hidden anchor hole and the back of the spindle boss; the checker suggested hiding all but the bore, since section A–A shows the rest.

## Exercise: the pin's groove

The pin drawing shows the retaining ring groove only in the front view, as two short vertical lines near the right end, dimensioned for its width, 1.1 mm, and its position from the head. Its diameter, 11.5 mm, is dimensioned with a leader to one of the lines. Is the groove adequately shown, and what would you ask for?

**Worked answer.** The front view shows the groove's axial position and width truly, and its diameter can be read from the leader, so all three are defined. But at 2:1, a groove 1.1 mm wide is 2.2 mm on paper and its depth, (Ø12 nominal − Ø11.5) ÷ 2 = 0.25 mm, is 0.5 mm on paper, so its form, square-bottomed or radiused, cannot be seen, and the dimensions crowd each other.

Ask for an enlarged detail of the groove at 10:1, where its 1.1 mm width is 11 mm and its 0.25 mm depth is 2.5 mm on paper. The groove's form, its bottom radius if the retaining ring supplier specifies one, and its diameter tolerance can then be shown and dimensioned clearly. The front view keeps the groove's position from the head, which is what the axial stack in Chapter 7 depends on.
