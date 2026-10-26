---
book: roof-drainage-by-the-numbers
chapterSlug: box-gutters-and-rainheads
order: 5
title: "Box gutters and rainheads"
description: "Size a box gutter behind a parapet for the rarer storm: flow along it, Manning depth, fall against depth, the opening through the parapet, rainhead outlets, freeboard and continuous support."
draft: false
---

A box gutter is a gutter inside the building. It runs behind a parapet, between two roofs or along a valley at low pitch, and everything below it is the building's interior. An eaves gutter that overflows spills outside; a box gutter that overflows pours into the ceiling, onto stock, into switchboards. That changes the design attitude completely. A box gutter is sized for the rarer storm, given generous depth above the water, supported continuously, and provided with an overflow that works even when everything else is blocked. The Housing Provisions exclude box gutters for this reason and refer their design to AS/NZS 3500.3, which sets the detailed requirements and is the document a real design must follow.

This chapter works W-40's front box gutter through with the hydraulic estimates used so far: the flow along it, the depth to carry that flow, the trade between fall and depth, the opening through the parapet, the rainhead and its downpipe, the freeboard above the highest water and the gutter's support. The failure case is a neat little scupper on the architect's first drawing, which would have backed water up behind the parapet.

## The layout

W-40's front roof slope drains towards the street, where a parapet rises 1.0 m above the roof. The box gutter runs along the full 40 m behind the parapet. It has a **high point in the middle** and falls **20 m** to each end, where an opening through the parapet discharges into a **rainhead**, a box fixed to the outside of the parapet, from which a downpipe runs to the ground.

Keeping the outlets outside the building is a deliberate choice. Sumps inside the roof, with downpipes running through the building, are common and sometimes unavoidable. But every joint in an internal downpipe is a potential leak inside the building, and a blocked internal sump has nowhere safe to overflow. An opening through the parapet sends water outside the building line as soon as it leaves the gutter.

## Flow along the box gutter

Each metre of box gutter collects from 12 m of roof slope and, by Chapter 2's assumption, half of a 1 m strip of parapet, **12.5 m²** in all. At the 1% AEP intensity of 250 mm/h, that is **250 × 12.5 ÷ 3,600 ≈ 0.87 L/s** for every metre from the high point. Twenty metres from the high point, at each end, the flow is about **17.4 L/s**. At 5% AEP, it is 12.5 L/s.

Chapter 1 explained why this book sizes the box gutter itself for the 1% AEP storm rather than the 5% storm used for eaves gutters: a box gutter that is merely overwhelmed, not blocked, should still not overflow into the building.

## Depth to carry the flow

W-40's box gutter is **400 mm** wide at the sole, a width that gives room to walk in it for cleaning and to fit the outlet opening. At a fall of 1:200, Manning's formula, used as in Chapter 3, gives the flow depth.

```figure
type: formula
title: Flow depth at the end of the box gutter, 1% AEP
formula: Q = A × (1 ÷ n) × R^(2/3) × S^(1/2)        where R = A ÷ P
caption: This is an illustration for a 400 mm wide box gutter at 1:200 with n = 0.012, carrying 17.4 L/s. The depth was found by trial. Manning's uniform-flow assumption makes this an estimate; AS/NZS 3500.3 sets the method for real design.
- Width b and trial depth y | 0.400 m and 0.058 m
- Area A = b × y | 0.0232 m²
- Wetted perimeter P = b + 2y | 0.516 m
step: R = 0.0232 ÷ 0.516 ≈ 0.045 m
step: velocity = (1 ÷ 0.012) × 0.045^(2/3) × 0.005^(1/2) ≈ 0.745 m/s
step: Q ≈ 0.0232 × 0.745 ≈ 0.0173 m³/s, about 17.3 L/s at a depth of about 58 mm
```

The flow depth along the gutter near each end is about **58 mm** at 1% AEP, and about 47 mm at 5% AEP. These are modest depths, because a 400 mm wide channel at 1:200 carries water efficiently. The depth at the very end, where water leaves through the parapet opening, is set by the opening, as the next section shows, and is greater.

## Fall against depth

A box gutter's fall costs height. At 1:200, the sole drops **100 mm** over each 20 m run. The top of the gutter, under the ends of the roof sheets, is roughly level, so the gutter is shallower at the high point and deeper at the ends. W-40's box gutter is **150 mm** deep at the high point and **250 mm** deep at the ends.

A steeper fall, 1:100, would carry the flow at about **46 mm** instead of 58 mm, but would drop the sole **200 mm** over each run, making the gutter 350 mm deep at the ends for the same depth at the high point, and pushing the rainhead openings lower in the parapet. A flatter fall saves height but carries water more slowly and empties more slowly after rain, leaving the sole wet for longer. W-40's designer kept 1:200 as a balance. AS/NZS 3500.3 sets minimum falls and dimensions for box gutters, and those govern a real design.

## The opening through the parapet

At each end, water leaves the box gutter through a rectangular opening in the parapet, the full **400 mm** width of the gutter, into the rainhead outside. The opening behaves like a weir: water spills over its sill, and the depth over the sill must be enough to pass the flow.

Using the weir estimate from Chapter 4, a 400 mm wide opening passes 17.4 L/s with about **84 mm** of water over the sill, and 12.5 L/s with about 68 mm. The water at the end of the gutter is therefore about 84 mm deep at 1% AEP, deeper than the 58 mm flowing along the gutter, because the opening, like any outlet, needs depth to drive the flow through it.

```figure
type: bars
title: Water depth over the parapet opening at 17.4 L/s, by opening width
unit: mm
max: 180
caption: This is an illustration using the weir estimate with a coefficient of 0.6. Narrow openings need much deeper water; a 150 mm opening would need about 162 mm, more than a typical scupper's height.
- 150 mm wide | 162
- 300 mm wide | 102
- *400 mm wide, full gutter width | 84
- 500 mm wide | 73
```

The opening is **200 mm** high, giving clearance above the highest water, room for debris to pass through rather than lodge in it, and space for the overflow arrangement described in Chapter 6.

## The rainhead and its downpipe

The rainhead is a sheet metal box on the outside of the parapet. It receives the water from the opening, lets it settle, and passes it down a downpipe from an outlet in its base. Because the rainhead can be made deep, it gives the outlet plenty of water depth to work with, which is the same advantage a sump gives.

W-40's rainheads each have a **150 mm** round outlet. As an orifice, it passes 17.4 L/s with about **137 mm** of water over it, and about 18.2 L/s at 150 mm. The rainhead is therefore made **300 mm** deep below the opening's sill, so that water standing 150 mm deep in it remains well below the opening and cannot back up into the box gutter. Its front carries an overflow, covered in Chapter 6, for when the downpipe blocks.

The downpipe from each rainhead is 150 mm diameter, running down the street front to a stormwater pit. Its connection, like the rear downpipes', is given to the civil designer with its flow.

## Freeboard: the space above the water

The highest water level in the box gutter, about 84 mm at the ends in the 1% AEP storm, must stay well below the lowest point where water could get into the building. On W-40 that point is the roof side of the gutter, where the roof sheets end and the gutter's back is turned up under them. The gutter's depth at the ends is 250 mm, so the water is about **166 mm** below that edge.

The vertical distance between the highest water and the lowest point of entry is the **freeboard**. It allows for waves and surges along the gutter, for debris that raises the water locally, for small errors in the estimates and for the gutter not being perfectly true. AS/NZS 3500.3 sets freeboard requirements for box gutters; this book uses at least **50 mm** as a teaching figure, which W-40 exceeds comfortably at the ends. At the high point, where the gutter is 150 mm deep, there is almost no flow, so the freeboard is nearly the full depth.

## Support it continuously

A box gutter full of water is heavy: 400 mm wide and 84 mm deep, it holds about **34 kg** of water a metre, plus the weight of a person walking in it to clean it. Unlike an eaves gutter on brackets, it needs **continuous support** under its sole, a sole board or a steel support channel set to the fall, so that it cannot sag between supports. A sag in a box gutter holds water inside the building line, which is where corrosion does most damage.

The support is set to the fall with a laser level before the gutter is laid, and the gutter's sole is checked again with the level after laying. The roof sheets' ends are turned down into the gutter, and the gutter's back turned up under them, with clearance for the sheets' thermal movement.

```figure
type: checklist
title: Box gutter checks for W-40's front gutter
caption: This is an illustration of the design checklist. AS/NZS 3500.3 governs a real box gutter; these are the questions the checks answer.
- Flow at each end at 1% AEP | about 17.4 L/s
- Flow depth along the gutter by Manning | about 58 mm at 1:200 in a 400 mm gutter
- Depth over the outlet opening | about 84 mm for a 400 mm wide opening
- Freeboard above the highest water to the lowest entry point | about 166 mm at the ends, at least 50 mm required here
- Rainhead outlet capacity at its water depth | 150 mm outlet, about 18.2 L/s at 150 mm
- Continuous support set to the fall | sole support checked with a laser level
- x Narrow scupper openings that need more depth than the gutter has | see the failure case
```

## Joints, stop ends and the high point

A 40 m box gutter is made from shorter lengths joined on site. Every joint is a place where water inside the building line could leak, so joints are lapped in the direction of flow, so water runs over a lap rather than into it, then riveted and sealed, or soldered where the material allows. The lap at the high point is the one place where the flow divides, so W-40's designer placed the gutter's expansion joint there, as Chapter 7 explains, rather than a sealed lap. The ends of the gutter are closed with stop ends folded up and sealed to the parapet's flashing, so water cannot run out of the end of the gutter behind the parapet.

## Make it cleanable

A box gutter collects everything that washes off the roof: leaves, grit, bird nesting material, and the offcuts and screws that roofers leave behind. W-40's 400 mm width lets a person stand in it to clean it, wearing appropriate fall protection, as Chapter 8 describes. Access to the roof was designed with the box gutter in mind: a fixed ladder to a roof hatch near one end, and a walkway along the parapet so nobody walks on the roof sheets. A box gutter that cannot be reached safely will not be cleaned, and a box gutter that is not cleaned will eventually overflow into the building.

## A failure case: the neat scupper

This is an illustration. The architect's first drawing of W-40's front showed a neat **150 mm wide, 100 mm high** scupper at each end of the box gutter, discharging into a slim rainhead. It looked tidy on the elevation.

The designer's check found the problem. A 150 mm opening would need about **162 mm** of water over its sill to pass 17.4 L/s as a weir, more than its 100 mm height. Once the water rose above the opening's top, the opening would run full as an orifice, and the estimate showed the water would have to stand about **240 mm** above its sill to pass the flow, nearly the full depth of the gutter at the ends, with no freeboard left. In the 1% storm, water would back up along the box gutter and over its roof-side edge into the building, with nothing blocked at all.

The detection came from checking the opening as an outlet, separately from the gutter. The correction was the 400 mm wide, 200 mm high opening and the deeper rainhead described above. The architect accepted the larger opening once the rainhead was redesigned to match the building's facade, with a plain face and a crisp top edge.

## How this applies to a small Australian business

Box gutters protect the inside of the building, so treat them as a design element, not a plumbing detail. Design them to AS/NZS 3500.3, for the rarer storm, with generous freeboard. Work out the flow at each outlet and the depth along the gutter, then check every outlet, opening and sump separately, because they usually need more depth than the gutter. Prefer outlets that discharge outside the building line. Support the gutter continuously, set to its fall, and make it wide enough to clean. And check the architect's neat details with numbers before they are built.

## Exercise: a narrower box gutter

To save space, the architect asks whether W-40's box gutter could be **300 mm** wide, with a 300 mm wide opening at each end. At 1:200, the Manning estimate for 17.4 L/s in a 300 mm gutter is about **73 mm**. Using the bar chart, how deep is the water over the opening? With the gutter 250 mm deep at the ends, what freeboard remains, and is it acceptable against the 50 mm teaching figure?

**Worked answer.** The bar chart gives about **102 mm** over a 300 mm wide opening at 17.4 L/s. That is deeper than the 73 mm flow depth, so it governs at the end. The freeboard is **250 − 102 = 148 mm**, well above 50 mm. Hydraulically, the narrower gutter works. The questions that remain are practical: whether 300 mm is wide enough to clean and walk in safely, whether it meets AS/NZS 3500.3's minimum dimensions, and whether the deeper water at the opening suits the overflow arrangement in Chapter 6.
