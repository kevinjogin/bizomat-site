---
book: louvres-and-ventilators-by-the-numbers
chapterSlug: blade-geometry
order: 2
title: "Blade geometry: pitch, angle, overlap and the formed blade"
description: "Set PR-30's blade pitch, angle and chord so the blades overlap and block sightlines, calculate the free area from the gap between blades, and develop the formed drainable blade for cutting."
draft: false
---

A louvre's performance is decided by four numbers about its blades: the **pitch**, the vertical distance from one blade to the next; the **angle** of each blade to the horizontal; the **chord**, the width of the blade from front to back; and the shape folded into it. Between them they decide whether you can see through the louvre, whether rain can fly straight through it, how much free area it has and how much water its blades can catch and carry away.

This chapter sets PR-30's intake louvre blades, checks their overlap, calculates the gap between them and the free area that results, compares steeper and flatter blades, and develops the formed drainable blade for cutting. The failure case is a louvre installed back to front, with its blades sloping down towards the room.

## Pitch, angle and chord

PR-30's intake louvre has blades at a **100 mm** pitch, set at **45°**, with a **150 mm** chord. The blades slope down towards the outside, so that rain striking them runs outwards and drops clear of the wall.

```figure
type: svg
title: Section through three of PR-30's intake blades
alt: Three parallel blades drawn in section, each sloping up at 45 degrees from the outside on the left to the inside on the right, stacked one above another at equal vertical spacing. A dashed line square to the blades shows the gap between two of them. Each blade has a short lip turned down at its outer edge and a small hook turned up at its inner edge.
caption: This is an illustration at about 0.9 scale. The blades overlap vertically by about 6.1 mm, so no horizontal sightline passes through. The narrowest gap, square to the blades, is 70.7 mm between flat faces and about 52 mm once the hooks and lips are allowed for.
viewbox: 0 0 560 320
body:
<path class="la draw" pathLength="1" d="M180 120L275.5 24.5M180 210L275.5 114.5M180 300L275.5 204.5"/>
<path class="li" d="M180 120V133M180 210V223M180 300V313M275.5 24.5V8L265 18M275.5 114.5V98L265 108M275.5 204.5V188L265 198"/>
<path class="ln dsh" d="M227.75 162.25L272.7 207.2"/>
<path class="lf" d="M140 120V210M134 120H146M134 210H146"/>
<text class="txs" x="60" y="170">pitch 100</text>
<text class="txa" x="292" y="190">gap 70.7 flat, 52 net</text>
<text class="txs" x="292" y="70">hook catches water</text>
<text class="txs" x="70" y="300">drip lip</text>
<text class="txs" x="196" y="64">chord 150 at 45°</text>
<text class="txs" x="20" y="30">outside</text>
<text class="txs" x="470" y="30">inside</text>
<path class="ah" d="M114 40l-14 -5v10z"/>
<path class="lf" d="M30 40H100"/>
```

### Overlap and sightlines

Seen from the front, looking horizontally, each blade covers a vertical height equal to its chord times the sine of its angle: **150 × sin 45° ≈ 106.1 mm**. The pitch is 100 mm, so each blade's projection overlaps the next by about **6.1 mm**. No horizontal line passes through the louvre without striking a blade: someone outside cannot see in, and a raindrop travelling horizontally on the wind cannot fly straight through either.

Overlap is the first check on any blade layout. If the projection is less than the pitch, there is a clear horizontal slot between every pair of blades, through which light, sight and wind-driven rain all pass directly. For a plant room, sightlines are a security matter as much as an appearance one; for weather, a direct path is the worst case for rain.

Horizontal is not the only direction that matters. A person standing close to a louvre and looking up through it sees along a line rising steeply inwards, which is roughly the direction the blades themselves slope, and can often see through a louvre that blocks every horizontal view. Looking down from above, the opposite happens: the blades' faces block the view entirely. For PR-30's plant room, with its intake low in a wall beside a footpath, the upward view is into the ceiling of the plant room and harmless. For a louvre at eye level in front of switchgear or a store, the designer checks the sightline at the angles from which people will actually look, and may choose chevron blades, which block views in every direction because the air path doubles back on itself within each blade. Rain behaves similarly: wind gusts drive drops at all sorts of angles, not only horizontally, which is why overlap is a first check and not a guarantee.

### The gap between blades

The air must squeeze between adjacent blades. Two parallel blades at an angle θ to the horizontal, a vertical pitch p apart, are separated, measured square to the blades, by **p × cos θ**. For PR-30's blades that is **100 × cos 45° ≈ 70.7 mm**. This square gap, not the vertical pitch, is the width of the passage the air flows through.

The blades are not flat plates. Each has a drip lip at its outer edge and a hook at its inner edge, and the metal has thickness; together they intrude into the passage by about **18.7 mm**, leaving a narrowest net gap of about **52 mm**. That 52 mm is the number that sets the free area.

## From gap to free area

The free area is the narrowest gap times the number of gaps times the clear width they run across. PR-30's core is **1,400 mm** high, so at a 100 mm pitch it has **14** gaps; its clear width, between the jambs and less a 50 mm central mullion, is **2,250 mm**.

```figure
type: formula
title: Free area of PR-30's intake louvre from its blade geometry
formula: free area = number of gaps × narrowest gap × clear width
caption: This is an illustration. Makers publish tested free areas for their louvres; a calculation like this is how a shop-made louvre's free area is found, and how a catalogue figure can be checked.
- Square gap between flat blades | 100 × cos 45° ≈ 70.7 mm
- Net narrowest gap, after hooks, lips and thickness | about 52.0 mm
- Number of gaps | 1,400 ÷ 100 = 14
- Clear width | 2,400 − 2 × 50 frame − 50 mullion = 2,250 mm
- Free area | 14 × 0.052 × 2.25 ≈ 1.638 m²
step: About 52% of the 3.15 m² core and 45.5% of the 3.60 m² gross area
```

## Steeper or flatter blades

Blade angle trades free area against weather resistance. Steeper blades overlap more and shed water better but close up the gap between blades; flatter blades open the gap but lose their overlap.

```figure
type: compare
title: PR-30's blades at three angles, keeping a 100 mm pitch and 150 mm chord
cols: Projection and overlap | Square gap, flat then net | Free area and ratio | Free-area velocity at 3.89 m³/s
caption: This is an illustration with the same 18.7 mm allowance for hooks and lips at every angle. At 35° the blades no longer overlap, leaving a 14 mm horizontal slot between each pair. At 55° the louvre is very weather-resistant but would need a much larger opening to keep the velocity down.
- 35° | 86.0 mm, 14.0 mm short: open slot | 81.9, 63.2 mm | 1.991 m², 55.3% | 1.95 m/s
- *45°, as built | 106.1 mm, 6.1 mm overlap | 70.7, 52.0 mm | 1.638 m², 45.5% | 2.37 m/s
- 55° | 122.9 mm, 22.9 mm overlap | 57.4, 38.7 mm | 1.218 m², 33.8% | 3.19 m/s
```

The 45° blade gives a modest overlap and a reasonable free area. If PR-30's wall were more exposed to wind-driven rain, the designer might move to a deeper, steeper blade and a larger louvre, or to a double-bank louvre with two rows of blades; both cost free area, which Chapter 4 weighs against rain.

## The formed drainable blade

Rain that strikes the face of a blade runs down it to the outside, which is what a sloping blade is for. But in heavy rain, and with air flowing inwards across the blade, some water is blown up the blade towards the inside. A **drainable blade** has a hook folded up at its inner edge, forming a small gutter that catches water running inwards. The gutter runs the length of the blade and discharges into a channel in each jamb, which carries the water down to the sill and out. The drip lip at the outer edge makes water leave the blade cleanly rather than running back along its underside.

PR-30's blade is folded from 1.2 mm aluminium sheet. Its profile, from the outside edge inwards, is:

- a **15 mm** drip lip, turned down;
- the **150 mm** blade face;
- a **20 mm** upturn, forming the back of the gutter;
- a **12 mm** return, turned back towards the outside over the gutter;
- a **10 mm** hem on the return, for stiffness and a safe edge.

Its girth is **15 + 150 + 20 + 12 + 10 = 207 mm**. From 1,200 mm wide coil, **five** blanks fit across the width, using 1,035 mm, with a **165 mm** offcut that is used for the sill flashing's stop-ends and the jamb channel closers. *Architectural Sheet Metal by the Numbers* covers girths and stretch-outs of folded profiles in [Profiles, girth and stretch-out](/reados/publications/architectural-sheet-metal-by-the-numbers/profiles-girth-and-stretch-out/); the blade is a small example of the same method.

### Folding and fixing

The blade is folded hem first, then the return, the upturn and finally the drip lip, so that each fold clears the brake's blade. Each fold is checked against a cut stay, a thin template of the profile, rather than by eye, because twenty-eight identical blades that each differ slightly from the drawing do not line up in the frame.

The blades are held at 45° in the jambs and mullion by **blade clips**: small folded brackets riveted to the jamb channel at 100 mm centres, each with its face at exactly 45°. The clip positions are marked from a single datum at the sill, not measured blade to blade, so that errors do not accumulate up the louvre. Each blade is riveted to a clip at each end. PR-30's louvre has two bays, each **1,125 mm** clear, so each blade is cut to **1,121 mm**, leaving 2 mm at each end for movement.

## Other blade shapes

The single-bank, formed drainable blade is one of many shapes, and the 1922 trade course already showed several: simple brake-formed slats, S-shaped slats rolled in pipe rollers, and slats bent so that each one's lower edge sat inside the next one's upturn. The modern families are much the same, chosen for different jobs.

- **Plain angled blades**, flat or with a stiffening lip, are cheapest and have the highest free area, but give little rain defence beyond what the overlap provides. They suit exhausts and sheltered walls.
- **Drainable blades**, like PR-30's, add a gutter at the inner edge and drain channels in the jambs. They suit intakes on exposed walls at moderate velocities.
- **Chevron and Z blades** bend the air path twice within each blade, so that water is thrown out of the air at each turn. They resist rain better and block sightlines completely, at the cost of more pressure drop.
- **Double-bank louvres** have two rows of blades, one behind the other, often with a drained cavity between. They are used where rain resistance must be high, such as intakes to switchrooms, and they have low free-area ratios.
- **Aerofoil and acoustic louvres** are specialised: aerofoil blades lower the pressure drop, and acoustic louvres line deep blades with absorbent to cut noise from the plant inside.

Each needs its own free-area calculation and, for anything beyond a plain blade, the maker's tested data rather than a shop estimate.

## Material, weight and finish

PR-30's blades are 1.2 mm aluminium, which is light, does not rust and takes a powder-coat finish. Each metre of the 207 mm blade weighs about **0.207 × 0.0012 × 2,700 ≈ 0.671 kg**, and the 28 blades of 1,121 mm, about 31.4 m in all, weigh about **21 kg**. The same blades in 0.8 mm galvanised steel would weigh about **1.30 kg** per metre and **41 kg** in all, nearly twice as much, and would need a protective finish at every cut edge.

Weight matters for the frame and fixings and for handling on site, and the material matters for corrosion. A plant room near the coast, or one whose exhaust carries moisture or chemicals, may call for marine-grade aluminium or stainless steel. Whatever the material, the blades, clips, rivets and frame must be compatible, so that no galvanic pair is created where water collects in the blade gutters, and rivets in aluminium blades are aluminium or stainless, never plain steel.

## Checking the finished louvre

The free area of a shop-made louvre is only as good as its blade spacing. Before the louvre leaves the shop, the net gap between adjacent blades is checked with a gauge cut to 52 mm at both ends and the middle of every gap in each bay, and the blade angle with a protractor on every fifth blade. A louvre whose blades have crept closer together at the top, because each clip was set from the one below, can lose several per cent of its free area without anyone noticing, and the loss goes straight into velocity and pressure drop.

## A failure case: back to front

This is an illustration. On an earlier job, a shop-made louvre was delivered to site and installed by a builder who had not seen the drawing. The frame was symmetrical outside, and nothing on it showed which face was the outside. It went in back to front, with its blades sloping down towards the room.

The first heavy rain ran down every blade face straight into the plant room, and the drainable hooks, now facing outwards and downwards, caught nothing. The detection was water on the floor below the louvre after the first storm. A glance at the blades, sloping the wrong way, explained it.

The correction was to remove the louvre, turn it round and refit it, with new fixings and sealant. The shop now stencils **OUTSIDE** and an arrow pointing up on each frame's jamb, and its installation sheet shows a section through a blade with the words "blades slope down to the outside".

## How this applies to a small Australian business

Choose pitch, angle and chord together. Check that the blades overlap, by comparing chord × sine of the angle with the pitch, so that no horizontal sightline or rain path exists. Calculate the square gap between blades, subtract what the blade's lips, hooks and thickness take, and work out the free area from the narrowest net gap, the number of gaps and the clear width. Compare angles before settling on one. Develop the formed blade's girth, fold it to a stay and fix it to clips set out from one datum. Mark every frame so it cannot go in back to front.

## Exercise: a wider pitch

To save blades, a designer proposes a **120 mm** pitch with the same 45° angle and 18.7 mm allowance for hooks and lips. What chord would give at least a 10 mm overlap? What are the square gap between flat blades and the net gap? What fraction of the core height is then free, compared with 52% at the 100 mm pitch?

**Worked answer.** The projection must be at least **120 + 10 = 130 mm**, so the chord must be at least **130 ÷ sin 45° ≈ 183.8 mm**; the existing 150 mm chord would leave a slot. The square gap is **120 × cos 45° ≈ 84.9 mm**, and the net gap about **84.9 − 18.7 = 66.2 mm**. The free fraction of the core height is **66.2 ÷ 120 ≈ 55.2%**, a little more than 52%, but the blades are now 23% wider, cost more metal per blade and are less stiff across the 1,125 mm span, which Chapter 8 would have to check.
