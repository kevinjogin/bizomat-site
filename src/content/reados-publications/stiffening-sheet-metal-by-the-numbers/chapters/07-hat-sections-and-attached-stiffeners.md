---
book: stiffening-sheet-metal-by-the-numbers
chapterSlug: hat-sections-and-attached-stiffeners
order: 7
title: "Hat sections and attached stiffeners"
description: "Size a hat-section stiffener with the panel acting as its flange, compare layouts by bay size, check the rivets' shear, and catch flat bars fitted flat that left the panel as soft as before."
draft: false
---

When folds and beads are not enough, or not wanted, a panel can be stiffened by attaching something to it: a light folded section riveted, bonded, clinched or welded to its back. The panel and the stiffener then act together as a beam, with a strip of panel serving as the beam's flange. Attached stiffeners are heavier and dearer than beads, but they can be placed exactly where they are needed, they can be much deeper than any bead, and they divide a panel into bays that can be made as small as stability and vibration demand.

This chapter sizes a hat-section stiffener for SP-90, compares three layouts by the deflection of their stiffeners and of the bays between them, checks the fasteners that join stiffener to panel, and records a workshop trial in which the stiffeners were fitted the wrong way round.

## Why a hat section

A stiffener for a thin panel should be deep, light and easy to attach. The **hat section**, a channel with a flange turned out along each edge, is the usual answer. Its two flanges lie flat on the panel for riveting or bonding, its top is far from the panel, and its closed shape against the panel resists twisting. Angles and Z sections are cheaper to fold but have only one attachment flange and twist more easily; flat bars, as the error in this chapter shows, depend entirely on being fitted on edge.

This is an illustration. The builder's hat stiffener is folded from the same 1.2 mm sheet as SP-90: two 15 mm flanges, two 25 mm webs and a 30 mm top, a girth of 110 mm and a mass of about 1.04 kg per metre.

```figure
type: svg
title: Hat stiffener on SP-90, in section
alt: A cross-section. A long horizontal line at the bottom represents the panel. On it sits a hat section: two short flanges lying on the panel, two vertical webs rising 25 millimetres, and a 30 millimetre top. A dashed line marks the neutral axis of the combined section about 9.6 millimetres above the panel. Labels give the flange, web and top dimensions and the effective width of panel, 48 millimetres.
caption: This is an illustration, drawn at about five times full size. The 48 mm of panel under the hat, 40 times the thickness, is taken as acting with it. The combined neutral axis lies 9.6 mm above the panel and the combined I is about 19,300 mm⁴.
viewbox: 0 0 640 220
body:
<path class="ln" d="M40 180H600"/>
<path class="la draw" pathLength="1" d="M170 176H245V51H395V176H470"/>
<path class="lf" d="M200 196H440"/>
<text class="tx txs" x="250" y="214">effective panel 48 mm</text>
<path class="ln dsh" d="M120 132H540"/>
<text class="tx txs" x="548" y="136">neutral axis</text>
<text class="tx txs" x="160" y="168">15</text>
<text class="tx txs" x="470" y="168">15</text>
<text class="tx txs" x="206" y="118">web 25</text>
<text class="tx txs" x="296" y="42">top 30</text>
<text class="txa" x="40" y="40">I = 19,300 mm⁴</text>
```

### Panel acting as flange

The hat alone has a second moment of area of about 12,500 mm⁴. Riveted to the panel, it gains a strip of panel as a bottom flange, and the combination is stiffer. How much panel acts is uncertain: close to the hat the panel follows it, but further away it bends as a plate and lags behind. This book takes 48 mm, 40 times the thickness, as a cautious effective width. With it, the combined I is about **19,300 mm⁴**; with the full 300 mm between stiffeners, it would be about 28,600 mm⁴.

The difference turns out to matter little for SP-90, for a reason worth understanding before any numbers: once a panel is stiffened, the stiffener usually deflects much less than the bays between stiffeners. The bays then govern, and the bays are governed by their width, not by the stiffener's I.

## Three layouts

This is an illustration. The designer compared three layouts, each with the hats running between opposite edges of SP-90 and riveted at their ends to the returns:

- **one vertical hat** down the middle, spanning 900 mm, creating two bays 300 × 900 mm;
- **two horizontal hats** at 300 mm pitch, each spanning 600 mm, creating three bays 600 × 300 mm;
- **three horizontal hats** at 225 mm pitch, each spanning 600 mm, creating four bays 600 × 225 mm.

Each stiffener carries the pressure on its share of the panel as a uniform load and is treated as simply supported at the returns. Each bay is treated as a simply supported plate on the stiffeners and the panel's edges, using Chapter 2's coefficients. The total deflection at the middle of a bay is the stiffener's deflection plus the bay's own.

```figure
type: compare
title: SP-90 with hat stiffeners under 250 Pa
cols: Stiffener deflection | Bay deflection | Total | Mass of hats
caption: This is an illustration. Hats with I = 19,300 mm⁴, simply supported; bays simply supported with coefficients for their aspect ratio (3.0, 2.0 and 2.67, the last interpolated). Hat masses for full-length hats; the built hats stop 25 mm short of each return.
- One vertical, 900 mm span, bays 300 × 900 | 0.17 mm | 0.78 mm | 0.95 mm | 0.93 kg
- Two horizontal, 600 mm span, bays 600 × 300 | 0.03 mm | 0.65 mm | 0.68 mm | 1.24 kg
- *Three horizontal, 600 mm span, bays 600 × 225 | 0.03 mm | 0.23 mm | 0.26 mm | 1.87 kg
```

All three layouts meet the 3 mm deflection target easily. They differ in what else they achieve:

- The **vertical hat** creates bays 300 mm wide, giving Chapter 3's estimated thermal buckle of 2.1 mm, just over the builder's 2 mm limit.
- **Two horizontal hats** create bays 300 mm high: the same 2.1 mm estimate, and a stiffer panel overall because the hats span the short direction.
- **Three horizontal hats** create bays 225 mm high, an estimated buckle of 1.6 mm, inside the limit.

The vertical hat is the weakest layout for a reason Chapter 2 predicted: it spans the long direction, so its own deflection is six times that of a horizontal hat, and it leaves long, narrow bays that behave almost like strips. Horizontal hats shorten the span that matters.

The choice between two and three horizontal hats cannot be made on deflection, where both are far inside the target, or on mass, where the difference is 0.63 kg. It depends on stability, where three is needed, and on vibration, which Chapter 8 examines. The designer provisionally chose three.

### The panel's total mass

This is an illustration. SP-90's blank with 20 mm returns and 10 mm lips, about 660 × 960 mm less its corner notches, weighs 5.93 kg in 1.2 mm sheet. Three hats, each 550 mm long to stop 25 mm short of the returns, add 1.71 kg, for a total of about **7.6 kg**, under the builder's 8.0 kg limit with a little margin for rivets and the brush strip.

## Joining stiffener to panel

The stiffener and panel act together only if they cannot slide relative to each other. The fasteners or adhesive between them carry a **shear flow**, a force per unit length along the joint, which is greatest near the stiffener's ends, where the shear force in the beam is greatest. For a beam, the shear flow at the joint is V Q / I, where V is the shear force, Q is the first moment of the area outside the joint about the neutral axis, and I is the combined second moment.

This is an illustration. For one of SP-90's three hats, the end shear is half its 33.75 N load, 16.9 N. The panel strip outside the joint is 48 × 1.2 mm with its centre 9.6 − 0.6 = 9.0 mm from the neutral axis, so Q = 57.6 × 9.0 = 518 mm³. The shear flow is 16.9 × 518 / 19,300 = **0.45 N per mm**. With blind rivets at 100 mm pitch, each rivet carries about 45 N, a tiny fraction of a blind rivet's shear capacity.

```figure
type: formula
title: Shear flow between a hat stiffener and the panel
formula: q = V Q / I
caption: This is an illustration for one of SP-90's three hats under 250 Pa, at its end, where the shear is greatest. Strength does not govern the rivet pitch here; flatness and stiffness of the joint do.
- V | End shear force, 16.9 N
- Q | First moment of the 48 mm panel strip about the neutral axis, 518 mm³
- I | Combined second moment of area, 19,300 mm⁴
step: q = 16.9 × 518 / 19,300 = 0.45 N/mm
step: At 100 mm rivet pitch, about 45 N per rivet
```

So strength does not set the rivet pitch. Flatness and continuity do. Between rivets, the panel and the hat's flange can gap apart, and if the gap is long enough the panel strip under the hat stops acting with it and the panel can buckle locally between rivets. Pitches of a few tens of millimetres up to around 100 mm are common on thin panels for this reason. [Sheet Metal Joints by the Numbers](/reados/publications/sheet-metal-joints-by-the-numbers/) covers rivet pitch, edge distance and the alternatives in detail.

The builder's options for SP-90 were:

- **Blind rivets** through both hat flanges at 100 mm pitch: simple, visible as rivet heads on the outside face.
- **Structural adhesive** along both flanges, with a few rivets to hold position while it cures: invisible from outside, continuous, and it adds a little damping, which Chapter 8 values; but it needs clean surfaces and controlled curing.
- **Spot welding**: fast and strong, but on zinc-coated sheet it burns the coating, marks the outside face and adds heat that can buckle a thin panel, as Chapter 3 described.
- **Clinching**: no consumables and no heat, but it marks the outside face.

The builder chose adhesive with four rivets per hat, two at each end, and riveted each hat's end tabs to the returns so that the hats deliver their load to the panel's edges.

## The error: flat bars fitted flat

This is an illustration. Before the hat sections were designed, the workshop tried a quick stiffener on one SP-90: two lengths of 25 × 3 mm flat bar, spanning the 600 mm width at 300 mm pitch, bonded and riveted to the back of the panel. The drawing showed the bars on edge, standing 25 mm off the panel, but gave no way of attaching a bar on edge. The fitter, sensibly unable to rivet through a 3 mm edge, laid the bars flat and riveted through them.

Measured under the extraction, the panel still bowed by about 3.5 mm between the bars. The arithmetic shows why. A 25 × 3 mm bar on edge, acting with 48 mm of panel, has I ≈ 9,500 mm⁴; the same bar laid flat has I ≈ 207 mm⁴, forty-six times less, because it is 3 mm deep instead of 25. Laid flat, each bar spanning 600 mm and carrying a 300 mm strip of panel deflects about 3.06 mm, and the bay between the bars adds 0.65 mm, about 3.7 mm in total under ideal simply supported conditions. On edge, the bar would have deflected 0.07 mm.

```figure
type: bars
title: Deflection of a 25 × 3 mm flat bar stiffener, 600 mm span, 300 mm strip, 250 Pa
unit: mm
max: 3.5
caption: This is an illustration. Bar acting with 48 mm of panel. The bay deflection of 0.65 mm adds to each. Laid flat, the bar is little stiffer than the sheet it is fixed to.
- *Laid flat, I = 207 mm⁴ | 3.06
- On edge, I = 9,504 mm⁴ | 0.07
```

The drawing was at fault as much as the fitter. A stiffener that only works on edge must come with a way to hold it on edge, and a flat bar has no flange to rivet through. That is precisely why folded sections such as hats and angles are used: their attachment flanges lie on the panel while their depth stands off it. The office's rule since then is that every stiffener on a drawing shows its attachment, and that a section whose stiffness depends on orientation carries a note stating the orientation and the reason.

## Stiffeners and the rest of the design

Attached stiffeners interact with everything else on the panel. Their ends must reach the panel's supported edges, or their load has nowhere to go but back into the panel. Openings must sit within a bay, not across a stiffener. And stiffeners on the inside of an enclosure collect dust on their tops and on the panel beside them; the hat's closed shape against the panel avoids a pocket between the webs, which a channel open towards the panel would have.

### Ending a stiffener

How a stiffener ends decides whether it works as the calculation assumed. A hat that stops in mid-panel, short of any support, delivers its end reaction into the bare panel as a concentrated load, and the panel bulges around the end. A hat whose ends are riveted to the panel's returns delivers its load to the edges, which are held by the frame's fasteners; that is the simply supported beam of the calculation.

This is an illustration. SP-90's hats stop 25 mm short of each vertical return so that they clear the bend radius and the return's lip, and a small folded tab on each end of the hat, cut and bent from the hat's top, laps onto the return and takes two rivets. The tab carries the 16.9 N end reaction with a large margin, and it also holds the hat square while the adhesive cures. Without the tabs, the first trial hats rocked slightly on their adhesive while curing and ended up a degree or two off square, which made no measurable difference to stiffness but looked careless through the cable opening.

The end detail also matters for the panel's appearance. A stiffener bonded or riveted close to a fold can pull the fold out of square or print through the outside face as a faint line, so the outside face of a painted panel should be checked under raking light after the first assembly.

They also add mass, which lowers natural frequencies, while adding stiffness, which raises them. Which wins depends on the layout, and the result for SP-90 is not obvious. Chapter 8 calculates it.

## Exercise: angles instead of hats

The workshop has 25 × 25 × 1.6 mm folded angles in stock. Acting with 48 mm of 1.2 mm panel and fitted with one leg on the panel and the other standing up, such an angle has a combined I of about 6,600 mm⁴.

1. For the three-stiffener layout, what is each angle's mid-span deflection under 250 Pa, and the total with the bay?
2. Is the angle an acceptable substitute on stiffness? What else should be considered?

**Worked answer.**

1. Each angle carries 0.00025 × 225 = 0.05625 N per mm over 600 mm. Its deflection is 5 × 0.05625 × 600⁴ / (384 × 200,000 × 6,600) = **0.07 mm**. With the bay's 0.23 mm, the total is about **0.30 mm**, still an order of magnitude inside the 3 mm target.
2. On stiffness, yes; the bays still govern. But an angle has only one attachment flange, so the joint is on one side of the section, and under load an angle tends to twist about its corner, which a hat's two flanges and closed shape resist. An angle also leaves a ledge for dust on the inside of the enclosure. If angles are used, they should be attached along their full length, ideally bonded, with their standing legs all facing the same way so that the panel's behaviour is predictable, and the first panel should be tested as Chapter 9 describes.
