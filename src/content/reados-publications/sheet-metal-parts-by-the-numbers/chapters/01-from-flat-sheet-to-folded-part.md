---
book: sheet-metal-parts-by-the-numbers
chapterSlug: from-flat-sheet-to-folded-part
order: 1
title: "From flat sheet to folded part"
description: "How a folded sheet metal part is made, what happens in a bend, inside and outside dimensions, the effect of sheet thickness, bend sequence and the running case bracket."
draft: false
---

Every folded sheet metal part is designed twice: once as the finished shape and once as the flat blank it is cut from. The two are linked by what happens in the bends, and most of the faults in sheet metal drawings come from getting that link wrong. A designer who dimensions the finished shape without thinking about the flat, or about which face each dimension is measured to, hands the folder a puzzle; one who dimensions it with the bends in mind hands them a part.

This chapter sets out the process from sheet to finished part, what happens in a bend, the difference between inside and outside dimensions, how much the sheet's own thickness tolerance matters, and why the order of the folds can decide whether a part can be made at all. It introduces the running case, a C-channel bracket for a variable speed drive, and finds a dimensioning mistake before any bend has been calculated.

## The process

A typical folded part goes through five stages.

1. **Cutting the blank.** The flat shape, with its holes, slots and reliefs, is cut by laser, punch or shear, from a nested sheet. The flat pattern drawing or file defines it.
2. **Deburring.** Cut edges are cleaned, because burrs cut hands and spoil fits.
3. **Folding.** Each bend is made on a press brake, usually by air bending: a punch presses the sheet into a V-shaped die without bottoming, and the depth of the stroke sets the angle.
4. **Joining and inserts.** Any welding, riveting, clinching or pressed-in fasteners are added, before or after folding as the design requires.
5. **Finishing.** Painting, powder coating or plating protect the part, and add thickness that the drawing should allow for.

The drawing serves all five. It must define the finished part for the folder and inspector, the flat pattern or the information to make it for the cutter, and the finish for the coater.

```figure
type: steps
title: From sheet to finished bracket
caption: This is an illustration of the running case's route. The flat pattern is the cutter's input; the folded shape is what the inspector accepts.
- Nest and cut the blank | Laser cut 295.6 × 300 mm with 4 holes and 4 slots, from 2.0 mm cold-rolled sheet
- Deburr | Tumble or hand deburr all cut edges
- Fold the returns | Two 90° bends, 15 mm return flanges
- Fold the legs | Two 90° bends, 60 mm legs
- Powder coat | After folding, with holes and slots masked if the coating would close them
```

## What happens in a bend

When a sheet is bent, the material on the outside of the bend stretches and the material on the inside compresses. Somewhere between, a surface neither stretches nor compresses: the **neutral axis**. Its length is the same before and after bending, so it is the length that sets the flat blank. In a thick sheet bent to a large radius, the neutral axis lies near the middle of the thickness; bent tightly, it moves towards the inside.

The bent region is an arc, bounded by two **bend tangent lines** where the flat portions meet it. Between the outside surfaces of the two flanges, extended until they meet, lies a theoretical sharp corner called the **virtual sharp** or mould line. Most sheet metal dimensions are given to the virtual sharp, because a ruler or calliper laid against the outside of the flanges measures to it.

```figure
type: svg
title: Cross-section of the running case bracket
alt: A C-shaped channel in cross-section, open at the top. The base is 160 mm wide outside. Two legs rise 60 mm high outside. At the top of each leg a 15 mm return flange points inwards. The sheet is 2 mm thick and the four bends have an inside radius of 2 mm, drawn here with sharp corners for clarity. Dimensions are to the outside surfaces.
caption: This is an illustration, drawn at half scale with the bend radii omitted. Every dimension is to the outside, at the virtual sharp of each bend.
viewbox: 0 0 420 230
body:
<path class="bx" d="M40 160H360V40H330V44H356V156H44V44H70V40H40Z"/>
<path class="lf" d="M40 185H360M40 165V190M360 165V190"/>
<text class="txb" x="182" y="204">160 outside</text>
<path class="lf" d="M380 40V160M365 40H390M365 160H390"/>
<text class="txb" x="388" y="105">60</text>
<path class="lf" d="M40 22H70M330 22H360M40 18V34M70 18V34M330 18V34M360 18V34"/>
<text class="txs" x="42" y="14">15</text>
<text class="txs" x="334" y="14">15</text>
<path class="la draw" pathLength="1" d="M70 60H330"/>
<text class="txa" x="150" y="76">130 between return tips</text>
<text class="txs" x="120" y="140">Inside width 156, t = 2.0</text>
```

## Inside or outside?

A folded part has two faces, and every dimension must say which it runs to. A dimension to the inside faces is 2t less than the same dimension to the outside faces, for a channel whose two walls are both between the dimension's ends. For the bracket, the base is 160 mm outside and 160 − 2 × 2 = **156 mm** inside.

There is no universal rule for which to use. The useful rule is function: dimension to the face that matters. The bracket's base must fit between the conveyor frame's rails, so its outside width matters; the drive must fit between the legs, so the inside width might matter too. Either can be dimensioned, provided the drawing says which, consistently, and gives only one. Many offices adopt a default, "ALL DIMENSIONS TO OUTSIDE UNLESS STATED", and mark the exceptions.

## The error: one inside, one outside

This is an illustration. The drafter's first drawing of the bracket gave the leg height as 60 mm outside, the return flanges as 15 mm outside, and the base as 156 mm, picked up from the model's inside faces because the drive's mounting face is inside the channel. There was no note saying which face any dimension referred to.

The folder, following the common convention, treated every dimension as outside and made a base 156 mm wide outside, so 152 mm inside. The drive's mounting feet span 154 mm, so the drive would not drop into the channel. The first-off part was rejected at the fitting trial.

The investigation found two faults: the mixed reference, and the missing note. The drawing was corrected to give the base as 160 mm outside, with the inside width of 156 mm shown as a reference dimension in brackets for the fitter's benefit, and a general note: "ALL DIMENSIONS TO OUTSIDE MOULD LINE UNLESS STATED". The office's sheet metal checklist now starts with that note.

## Thickness is a tolerance too

Sheet is supplied to a thickness tolerance set by its product standard and grade, and a 2.0 mm sheet is never exactly 2.0 mm. Thickness affects the flat pattern, because the bend's geometry depends on it, and the part's inside dimensions, because they are the outside less the walls.

This is an illustration. If the supplier's sheet ranges from 1.9 to 2.1 mm, and the folder keeps the same flat blank and the same outside dimensions as its target, the four bends of the bracket take up slightly different lengths of blank. Using the bend relationships of Chapters 3 and 4, a flat blank laid out for 2.0 mm sheet would need to be about **296.1 mm** wide for 1.9 mm sheet and **295.0 mm** for 2.1 mm sheet, against 295.6 mm nominal. A folder working to tight tolerances checks the thickness of each batch and adjusts. A designer should not set tolerances on a folded part that the sheet's own thickness tolerance makes impossible.

```figure
type: stats
title: The bracket in numbers
caption: This is an illustration. Flat width from Chapter 4's calculation with K = 0.40; mass at a typical 7,850 kg/m³ for carbon steel.
- 295.6 mm | Flat blank width | Across the four bends, nominal 2.0 mm sheet
- 300 mm | Length along the bends | Unchanged by folding
- 4 | Bends, all 90° | Inside radius 2 mm
- * 1.38 kg | Mass of the bracket | 87,874 mm² of blank after holes and slots
```

## Talking to the folder early

The single most useful step in designing a folded part is to send the folder a sketch before the drawing is finished. A folder knows its tooling: which die openings it has, which radii it can form in which materials, how short a flange it can hold, how deep a channel its punches can clear, and what K-factor it has measured for its machines. Each of those numbers appears in a later chapter of this book, and each is better taken from the supplier who will make the part than from a general table.

This is an illustration. The bracket's designer sent the folder the cross-section above with three questions: what inside radius its 12 mm die opening forms in 2.0 mm mild steel, what K-factor it uses for that combination, and whether the channel can be folded in its standard tooling. The answers, 2 mm, 0.40 and yes, became the starting values for every calculation in this book. They took a day to arrive and saved a trial batch.

## Bend sequence

A press brake folds one bend at a time, and each fold must leave room for the next. The punch comes down from above, and the part's already folded flanges swing up around it. If a flange collides with the punch, the ram or the machine's back gauge, the bend cannot be made in that order, and sometimes not at all.

For the bracket, the folder makes the two return flanges first, while the blank is still mostly flat, and then the two legs. When the second leg is folded, the first leg and its return stand up 60 mm on one side of the punch. The opening between the two return tips, 160 − 2 × 15 = **130 mm**, does not matter to the punch, which works on the outside of the base bend, but the first leg must clear the punch's body as it swings up. The folder's standard punch is tall and narrow enough, and the part folds without special tooling.

Had the design called for returns of 40 mm, the folded first leg and its return would have swept into the punch's path, and the folder would have needed a gooseneck punch or a different sequence. Designers do not need to plan the sequence, but should know that flange lengths and channel depths can make a part unfoldable, and should ask the folder early about any deep, narrow or closed shape. A closed box, four walls folded up from a base, is the classic case: the last wall to be folded meets the other three, and unless their corners are relieved and their heights allow it, the punch cannot reach. Such parts are often made in two pieces and joined, which is a design decision best made before the drawing is detailed.

## Cut before folding, or after?

Almost every hole and slot in a folded part is cut in the flat, because cutting a flat blank is fast and accurate and cutting a folded part is neither. That has a consequence the designer must accept: the position of a feature on one flange relative to a feature on another flange depends on the bends between them. Each bend adds the variation of its own bend allowance and angle, so features on different flanges are never located as precisely as features on the same flange.

For the bracket, the four Ø7 holes in the base are all on one flat and are located relative to each other to the cutter's accuracy, a small fraction of a millimetre. The slots in the legs are on different flanges from the holes, so their height above the base, which sets where the bracket sits on the frame, depends on the base-to-leg bend. That is why the slots are slots, 20 mm long, rather than round holes: they absorb the variation Chapter 9 calculates. A designer who needs two features on different flanges to align precisely, such as a shaft bore through both legs, may need to drill or ream them after folding, and the drawing must say so.

## Coatings come last

The bracket is powder coated after folding, and coating adds thickness to every surface, including the inside of holes and slots. This is an illustration. The coating supplier works to a film of 60 to 80 µm. A Ø7 hole coated inside its bore shrinks by twice the film, to about Ø6.84 to 6.88 mm, which still clears an M6 screw, and the outside dimensions grow by twice the film, about 0.16 mm at most, which the bracket's tolerances absorb. The holes do not need masking; a tapped hole or a close fit would. The drawing says "POWDER COAT AFTER FOLDING. DIMENSIONS BEFORE COATING", so that the folder and inspector both know which state the dimensions describe.

## Grain direction

Rolled sheet has a grain: its properties differ slightly along and across the rolling direction. For tight bends in less ductile materials, bending with the bend line across the grain is less likely to crack than bending along it. For mild steel at a radius equal to its thickness, the difference rarely matters, but for higher-strength steels, aluminium alloys in hard tempers or stainless steel at tight radii, it can. Chapter 2 deals with the bend radius limit; for now the drawing need only say "BEND LINES ACROSS ROLLING DIRECTION" when it matters, so that the cutter nests the blank the right way on the sheet.

## Exercise: a deeper channel

A variant of the bracket needs legs 90 mm high, outside, with the same 160 mm base and 15 mm returns. What is the inside width between the legs, the opening between the return tips, and the change in flat blank width, given that each 30 mm of extra leg adds 30 mm of flat length per leg?

**Worked answer.** The base is unchanged, so the inside width between the legs is still 160 − 2 × 2 = **156 mm** and the opening between the return tips is still 160 − 2 × 15 = **130 mm**. The legs are straight flats between bends, so each extra 30 mm of outside leg height adds 30 mm of flat length, and the flat blank grows from 295.6 mm to 295.6 + 2 × 30 = **355.6 mm**.

The deeper legs raise one question that the dimensions do not answer: whether the folder can make the last leg bend without the first leg, now 90 mm tall with its return, hitting the punch. The designer should send the folder the section and ask; if a special punch is needed, it may be cheaper to shorten the returns or change the shape than to pay for tooling. The deeper legs also make the bracket heavier and its legs more flexible, which the designer should check against the drive's mass and the conveyor's vibration before confirming the variant.
