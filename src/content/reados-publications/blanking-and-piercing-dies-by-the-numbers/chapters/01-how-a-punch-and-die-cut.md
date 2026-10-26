---
book: blanking-and-piercing-dies-by-the-numbers
chapterSlug: how-a-punch-and-die-cut
order: 1
title: "How a punch and die cut sheet metal"
description: "What happens to sheet as a punch cuts it, the four zones of a sheared edge, blanking and piercing, which tool sets each size, and the MP-40 plate that runs through this book."
draft: false
---

A punch does not cut sheet metal the way scissors cut paper, slicing progressively along a line. It pushes a whole outline into a matching opening at once, and the sheet between the two cutting edges deforms, shears and finally cracks through. Everything about a die follows from that action: the force it needs, the edge it leaves, the burr on one side, which tool controls which dimension, and how the edges wear. Understanding the cut is the first step in checking any die.

This chapter follows a punch through 2.0 mm steel from first contact to breakthrough, names the zones of the edge it leaves, separates blanking from piercing, introduces the vocabulary used for the rest of the book, and sets out the running case: the MP-40 mounting plate and the three-station progressive die that makes it.

## The cut, stroke by stroke

A press drives the punch down onto the strip, which rests on the die. The die has an opening the shape of the punch but slightly larger; the gap on each side is the **clearance**, the subject of Chapter 3. As the punch descends, the cut passes through four stages.

1. **Contact and bending.** The punch touches the sheet and presses it into the die opening. The sheet bends elastically, then plastically, and its surface rolls over the cutting edges. No metal has separated yet.
2. **Shearing.** The punch penetrates. Metal in the narrow band between the punch edge and the die edge is forced to slide past itself, and the sheared faces are pressed hard against the sides of the punch and die opening, which burnishes them smooth.
3. **Cracking.** Once the punch has penetrated part of the way, typically somewhere between a fifth and a half of the thickness in low-carbon steel, depending on the material and clearance, cracks start at the punch edge and the die edge and run towards each other through the remaining metal.
4. **Breakthrough.** If the clearance is right, the two cracks meet cleanly and the slug or blank separates. The punch carries on a little into the die to push it clear, then returns, and the sheet is stripped off the punch on the way up.

The force on the punch rises steeply through the first two stages, peaks around the start of cracking and falls sharply at breakthrough. That sudden release is what makes blanking noisy and hard on presses: the press frame, stretched by the load, springs back in a few milliseconds. Chapter 2 estimates the peak force, and Power Presses by the Numbers deals with what breakthrough does to the press.

```figure
type: steps
title: A punch cutting through sheet, in four stages
caption: The force on the punch peaks near the start of cracking and drops almost to zero at breakthrough. The proportion of the thickness that is burnished rather than fractured depends on the material and the clearance.
- Contact and bending | the sheet is pressed into the die opening and rolls over both edges
- Shearing | metal slides in the band between the edges; the sheared faces are burnished
- *Cracking | cracks start at the punch and die edges and run towards each other
- Breakthrough | the slug or blank separates and is pushed into the die; the load releases suddenly
```

## The four zones of a sheared edge

Look at the edge of any blanked part through a magnifier and the stages of the cut can be read in it. From the side the punch entered, there are four zones.

- **Rollover**, a rounded edge where the sheet bent before it began to shear.
- **Burnish**, a smooth, bright band, the part of the thickness that sheared cleanly against the tool.
- **Fracture**, a rougher, duller band, slightly angled, where the cracks ran through.
- **Burr**, a small raised lip on the far side, where the last metal tore away from the cutting edge.

The proportions of the zones are the die's report card. A healthy edge in low-carbon steel shows a modest rollover, a burnish band of perhaps a quarter to a half of the thickness, a fracture band that runs straight across, and a burr too small to catch a fingernail. Too little clearance produces a second burnish band below the first, because the cracks miss each other and the remaining ligament is sheared a second time. Too much clearance produces a large rollover, a steeply angled fracture and a tall burr. Blunt edges produce a tall burr whatever the clearance. Chapter 3 uses those patterns to diagnose a die, and Chapter 9 uses the burr's growth to decide when to sharpen it.

The burr and the rollover sit on opposite faces, and which face depends on which piece is kept. With the punch coming down, a pierced hole in the strip has its rollover on the top face and its burr on the underside, next to the die edge. The piece pushed down into the die, whether a slug or a blank, is the other way round: rollover underneath, burr on top, next to the punch edge. So a part whose holes are pierced and whose outline is then blanked by punches coming down from above, as MP-40's are in a progressive die, has its hole burrs on one face and its outline burr on the other. A compound die, which pierces and blanks in one stroke with the blanking punch below the strip, puts all the burrs on the same face; Chapter 7 returns to that difference. Burr faces matter for anything the part is assembled against, and for anyone handling it.

```figure
type: svg
title: Section through a punch, sheet and die partway through the cut
alt: A cross-section with the punch above the sheet and the die below. The punch edge sits slightly inside the die edge, the gap between them labelled clearance c per side. The sheet is bent down into the die opening between the edges, and two short lines show cracks running from the punch edge and the die edge towards each other. Labels name the rollover on the top surface, the burnished band, the fracture band and the burr that will form on the underside.
caption: Not to scale. The clearance c is measured per side, from the punch edge to the die edge. Cracks start at both edges; when the clearance is right they meet and the slug separates cleanly.
viewbox: 0 0 640 330
body:
<path class="bx" d="M120 30H330V150H120Z"/>
<text class="txb" x="170" y="95">punch</text>
<path class="bx" d="M60 210H350V310H60Z"/>
<path class="bx" d="M370 210H600V310H370Z"/>
<text class="txb" x="170" y="270">die</text>
<text class="txb" x="450" y="270">die</text>
<path class="la draw" pathLength="1" d="M40 150H320Q332 152 338 170L350 200Q356 206 370 208H620"/>
<path class="la draw" pathLength="1" d="M40 190H300Q318 190 330 196L350 210"/>
<path class="ln" d="M330 150L340 176"/>
<path class="ln" d="M350 210L344 192"/>
<path class="ln dsh" d="M330 40V320"/>
<path class="ln dsh" d="M350 40V320"/>
<text class="txa" x="300" y="325">c</text>
<text class="tx txs" x="356" y="140">rollover on top face</text>
<text class="tx txs" x="380" y="170">burnish, then fracture</text>
<text class="tx txs" x="380" y="196">cracks from both edges</text>
<text class="tx txs" x="60" y="200">sheet, t = 2.0 mm</text>
<text class="tx txs" x="60" y="325">strip burr forms underneath; slug burr on top</text>
```

## Blanking and piercing

The same cutting action has two names, depending on which piece is kept.

- **Blanking** cuts out a part, the blank, and keeps it. The sheet left behind, the skeleton, is scrap.
- **Piercing**, or punching, cuts a hole in a part and keeps the part. The piece pushed out, the slug, is scrap.

MP-40 needs both. Its two holes and its slot are pierced; its outline is blanked. Hodgson's 1903 book on press tools described a punch as an endless shearing tool, and that is the useful way to think of both operations: a guillotine blade bent round into a closed loop, cutting its whole length at once.

The distinction matters because it decides which tool sets which size. A blank is pushed through the die opening, and its edge is formed against the die, so **a blank takes the size of the die**. A hole is made by the punch passing through the sheet, and its edge is formed against the punch, so **a hole takes the size of the punch**. The other tool in each pair is then made larger or smaller by the clearance. Chapter 3 works through the sizes for MP-40; the rule is worth remembering from the start, because getting it backwards produces parts that are out of tolerance by twice the clearance.

Below each cutting edge, the die opening is not a straight hole all the way down. It has a short straight **land**, a few millimetres deep, which keeps its size as the face is ground back, and below that the opening widens with a small taper or a step, the **relief**, so that slugs and blanks fall away instead of packing tight. A slug that sticks and is pulled back up on the punch, **slug pulling**, lands on the strip at the next stroke and is punched into the part. Die makers deal with it by the land's length, the relief, the clearance and, in stubborn cases, by spring-loaded ejector pins in the punch face. MP-40's slugs are small and its blanks fall through the die and the press bolster into a chute; both openings need relief.

Several related operations use the same mechanics: **notching** cuts a shape from an edge, **lancing** cuts without removing metal so that a tab can be bent, **parting** separates parts along a line with a scrap web between them, **cut-off** separates them with no scrap, and **shaving** takes a thin second cut to clean up an edge. MP-40 needs none of them, but most progressive dies use at least one.

## Terms used in this book

The names of die parts vary between shops and countries. This book uses the following.

- **Punch** and **die**, or die block: the two cutting members. A die with several openings may have them in separate inserts.
- **Punch plate**, or punch holder: the plate that holds the punches square to the die.
- **Stripper**: the plate that pulls the strip off the punches on the upstroke. A spring stripper also holds the strip flat while it is cut (Chapter 5).
- **Die set**: the upper and lower shoes with guide pillars and bushes, which keep the punches aligned with the die openings.
- **Pilot**: a pin that enters a hole already pierced in the strip to locate it exactly before the next cut.
- **Pitch**, or progression: the distance the strip advances each stroke.
- **Shut height**: the height of the die when closed at the bottom of the press stroke (Chapter 8).

## The running case: MP-40

This is an illustration. MP-40 is a flat mounting plate, 80 × 50 mm with R6 corners, in 2.0 mm low-carbon cold-rolled steel. It has two Ø8.5 mm holes on 60 mm centres along its long axis, for M8 screws, and a 16 × 8 mm obround slot at its centre for a cable tie. The holes are toleranced +0.10/0 mm and the outline ±0.10 mm. Demand is 60,000 plates a year, made in batches of 5,000 from coil slit to width.

For calculations, the sheet's tensile strength is taken as 350 MPa and its shear strength as 280 MPa, 0.8 of the tensile strength. Those are illustrative values for a low-carbon cold-rolled steel; a real job would use the values on the mill's certificate, and Chapter 2 discusses why the ratio matters.

The die is a three-station progressive die. At station 1 the two holes and the slot are pierced. At station 2 two pilots enter the holes and locate the strip; nothing is cut. At station 3 the outline is blanked and the finished plate falls through the die. The strip advances 52 mm each stroke, so every stroke, once the strip has filled the die, produces one finished plate.

```figure
type: stats
title: MP-40 in numbers
caption: This is an illustration. Material properties are assumed values for the calculations in this book, not data for any particular steel.
- 80 × 50 mm | Plate outline | R6 corners, ±0.10 mm
- 2 × Ø8.5 mm | Holes | 60 mm centres, +0.10/0 mm
- 16 × 8 mm | Obround slot | at the centre
- 2.0 mm | Low-carbon cold-rolled steel | UTS 350 MPa, shear 280 MPa
- * 3 stations | Progressive die | pierce, pilot, blank
- 60,000 a year | Demand | batches of 5,000
```

## Why the cut decides the cost

Before calculating anything, it is worth seeing how the cut connects to the things a buyer of a die cares about.

- **Force.** The longer the cut and the thicker and stronger the sheet, the bigger the press. MP-40's cut perimeters total about 344 mm (Chapter 2).
- **Edge quality.** The clearance and the sharpness of the edges decide the burr, the burnish band and the part's flatness near the edge.
- **Accuracy.** The die sets the blank's size and the punches set the holes' sizes; the pilots and the die set's guidance set their positions relative to each other.
- **Tool life.** Every cut wears the edges a little. Edges are sharpened by grinding their faces, and the number of sharpenings a die can take decides its life (Chapter 9).
- **Material.** The die cuts parts from a strip, and the strip layout decides how much of the steel bought becomes scrap (Chapter 6).

A die that is right on all five makes cheap, consistent parts for years. A die that is wrong on any one makes trouble on every stroke.

## The error: the burr on the wrong face

This is an illustration. MP-40's first drawing said nothing about burrs, and the planner who reviewed the progressive die's design assumed, wrongly, that all its burrs would be on one face. The first 500 plates were packed and sent. At the customer's assembly line, the plates were screwed to a painted bracket. Whichever way up they were fitted, one set of burrs faced the paint: the hole burrs one way, the outline burr the other. The burrs scratched through the coating and spoiled the joint's appearance.

The customer's incoming inspection had not checked burrs, because the drawing gave no requirement. The fix took three steps. The drawing was revised with a note, "burr height 0.10 mm maximum on all edges; mating face free of raised burr", and an arrow showing the mating face. Because the progressive die puts burrs on both faces, the plates gained a vibratory deburring step after the press; Chapter 9 counts its cost. And the die-type decision was reopened, since a compound die would have put every burr on the face away from the paint; Chapter 7 weighs that option. A drawing note that costs nothing would have raised the question before the die was built.

The general lesson is that a press-cut part has burr faces whether the drawing says so or not, that the die type decides where they are, and that the drawing should say what is acceptable on each face.

```figure
type: checklist
title: Questions to settle about a blanked part before the die is designed
caption: Each item is a property of the cut, decided by the die, that the drawing should state rather than leave to chance.
- Burr faces and maximum burr height | 0.10 mm maximum; mating face free of raised burr
- Which dimensions are blanked and which pierced | outline blanked; holes and slot pierced
- Where the chosen die type puts each burr | progressive: hole burrs down, outline burr up
- Tolerances on blanked and pierced sizes | outline ±0.10, holes +0.10/0
- Edge condition needed | sheared edge acceptable; no shaving
- Material grade and thickness, with certificate | 2.0 mm low-carbon cold-rolled steel
- x Burrs left unstated | the first 500 plates scratched the customer's paint
```

## Exercise: reading two edges

Two MP-40 plates from different dies are examined under a magnifier. Plate A's edge shows a small rollover, a bright band about 0.7 mm deep, a straight fracture band and a burr of 0.03 mm. Plate B's edge shows a large rollover, a bright band about 0.3 mm deep, a fracture band that slopes noticeably and a burr of 0.15 mm. What is the likely difference between the two dies, and which plate meets the revised drawing?

**Worked answer.** Plate A's edge has the pattern of a sharp die with suitable clearance: a burnish band of 0.7 ÷ 2.0, about a third of the thickness, a straight fracture and a small burr. Plate B shows the pattern of too much clearance, a large rollover, a shallow burnish band and a sloping fracture, made worse by a tall burr, which may also mean blunt edges. Plate A meets the drawing's 0.10 mm burr limit; Plate B, at 0.15 mm, does not. The next checks for Plate B's die are its clearance, measured as in Chapter 3, and the condition of its cutting edges, as in Chapter 9.
