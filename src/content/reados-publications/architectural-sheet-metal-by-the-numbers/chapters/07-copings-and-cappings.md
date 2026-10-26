---
book: architectural-sheet-metal-by-the-numbers
chapterSlug: copings-and-cappings
order: 7
title: "Copings and cappings"
description: "Design a parapet coping that sheds water the right way, joins without leaking, moves with temperature and stays on in the wind: falls, joint types, expansion groups, gaps and clip spacing."
draft: false
---

A coping is the lid on a wall. It keeps rain out of the top of the parapet, where water would soak down through the masonry, and it throws water clear of both faces. It sits in the most exposed place on the building, in full sun and full wind, and it runs in long continuous lines that grow and shrink with every change of temperature. Copings fail in three ways: they let water into the wall through joints and fixings, they buckle or tear because nothing allowed for their movement, or they lift off in a storm because their fixings were too few. Each has a calculation that prevents it.

This chapter completes W-40's parapet coping: the fall that sends water to the roof rather than down the street face, the joints between lengths and which kind to use where, the expansion groups and the gap to set at each expansion joint, and the spacing of concealed clips against wind uplift. The failure case is a coping on another building, screwed through its top and riveted end to end, that buckled, loosened and leaked into its wall.

## Fall the top towards the roof

Chapter 1 gave the coping's top a **10 mm** fall across its 240 mm width, towards the roof side, about **1 in 24**. The fall has a purpose. Rain on the coping picks up dust and grime, and if it runs over the street face, it streaks the facade below. Falling the top inwards sends it into the box gutter instead, where it belongs. The street-side drip handles only the rain blown directly against the face.

The fall also stops water lying on the coping. A flat top, or one that sags between fixings, holds water against the metal and its laps, which shortens the coating's life and tests every joint. A visible, deliberate fall avoids both.

## Joints between lengths

The coping is made in 3.2 m blanks, from Chapter 1, giving 3.1 m of cover each with a 100 mm lap. Each joint must keep water out and, at certain joints, allow movement.

```figure
type: compare
title: Three ways to join coping lengths
cols: Riveted, sealed lap | Sliding lap | Butt joint over a soaker
caption: This is an illustration of the joint types used on W-40's coping. Riveted laps lock lengths into groups; the joints between groups must move.
- Construction | 100 mm lap, sealed and riveted | 100 mm lap, sealed, not riveted, held by clips | ends 10 mm apart over a 150 mm folded soaker
- Movement | none; the lengths act as one | some, limited by the sealant's movement capability | full, the gap closes and opens
- Watertightness | very good | good while the sealant lasts | good, because the soaker carries any water out over the face
- Appearance | a visible lap line | a visible lap line | a neat, even gap
- *Where used on W-40 | within each expansion group | not used | at each expansion joint
```

W-40's lengths are joined with riveted, sealed laps into **expansion groups** of about 10 m, and the groups are separated by **butt joints over soakers**. A soaker is a short length of the coping's profile, folded slightly smaller so it nests underneath the two ends, with a raised bead at each side so water running into the gap is carried out over the face rather than into the wall. The two ends of the coping sit over it, 10 mm apart, and are clipped down but not fixed to it.

## How much a coping moves

The thermal movement calculation from the roof drainage design applies to copings too. Using the coefficient for steel, about **12 × 10⁻⁶** per °C, and the same assumed metal temperature range of −5 °C to 75 °C, an 80-degree range, the movement grows with the length of coping that moves as one piece.

```figure
type: bars
title: Movement of a steel coping over an 80 °C range, by length moving as one piece
unit: mm
max: 40
caption: This is an illustration using 12 × 10⁻⁶ per °C. A single 3.1 m length moves about 3 mm; the whole 40 m front, riveted end to end, would try to move nearly 40 mm.
- One length, 3.1 m | 3.0
- Two lengths, 6.2 m | 6.0
- *Expansion group, 10 m | 9.6
- Half the front, 20 m | 19.2
- Whole front, 40 m | 38.4
```

Riveted end to end, the 40 m front coping would try to change length by about **38 mm**. Fixed at the corners, it would buckle in the heat and pull its rivets in the cold. Divided into four groups of about 10 m, each fixed near its middle and free to slide outwards on its clips, each end of a group moves through a range of about 4.8 mm, and each expansion joint between two groups sees the movement of 5 m from each side, **10 m** in all: about **9.6 mm** over the full range.

## Set the gap for the day

As in the roof drainage design, the expansion joint's gap is set for the metal temperature on the day it is installed. If the coping is fixed when the metal is at **25 °C**, it can warm by 50 °C and cool by 30 °C. Warming, the 10 m effective length grows by **12 × 10⁻⁶ × 10,000 × 50 = 6.0 mm**, so the gap closes by 6.0 mm. Cooling, it shrinks by **3.6 mm**, and the gap opens by that much.

A **10 mm** gap at 25 °C closes to about 4 mm on the hottest day and opens to about 13.6 mm on the coldest. The 150 mm soaker covers that range with plenty to spare, and the gap never closes completely, so the ends never butt and buckle. On a hot day, with the metal at 50 °C, the installer sets a smaller gap; on a cold morning, a larger one. A contact thermometer on the metal takes the guesswork out.

## Concealed clips, not face screws

The coping must be held down without holes through its top, because every screw through the top is a hole in the lid. W-40's coping is held by **concealed clips**: folded steel brackets fixed to the parapet's faces below the coping, each with a hook that engages the coping's leg returns from inside. The clips hold the coping down and in, and, because the hooks slide along the returns, they let it move along its length.

Each expansion group is fixed against sliding at one point near its middle, with a single pair of screws through the legs into the clip, sealed with sealing washers, so the group cannot creep along the wall over the years. Everywhere else the clips allow sliding.

## Clip spacing against wind

Wind blowing over a parapet creates suction on the coping's top, trying to lift it off. The design pressure depends on the building's location, height, terrain, exposure and the position along the parapet, and is calculated using AS/NZS 1170.2. Corners and ends of parapets see higher pressures than the middle. The clip's capacity comes from its maker's tested data, together with the capacity of its fixings into the wall.

This book uses round teaching values: a design uplift pressure of **2.0 kPa** on the coping's top along the middle of the parapet, and a clip design capacity of **0.6 kN**. This is an illustration; neither number may be used for real work.

```figure
type: formula
title: Clip spacing for wind uplift on the coping
formula: load per metre = pressure × width of the top        maximum spacing = clip capacity ÷ load per metre
caption: This is an illustration with teaching values for the pressure and the clip's capacity. Real values come from AS/NZS 1170.2 and the clip maker's tested data, and corners need their own, higher pressure.
- Design uplift pressure | 2.0 kPa = 2.0 kN/m²
- Width of the coping top | 0.24 m
step: load per metre = 2.0 × 0.24 = 0.48 kN/m
step: maximum spacing = 0.6 ÷ 0.48 = 1.25 m
step: chosen spacing 1.0 m, giving 4 clips per 3.1 m length and some margin
```

At **1.0 m** centres, each clip carries about 0.48 kN at the design pressure, comfortably within its 0.6 kN teaching capacity. The clips are placed within about 150 mm of each lap and each expansion joint, where the coping's ends are least stiff, and the spacing is reduced near the parapet's corners, where the pressure is higher, as the exercise shows.

## Corners and returns

The corner pieces developed in Chapters 2 and 3 belong to the end groups. Each end group runs from a corner along the front for about 10 m, and its fixed point is set near its middle, so the corner moves a few millimetres as the group grows and shrinks. The 2 m return along the side wall moves with it: the return's lengths are riveted to the corner piece, and the return's far end, where it meets the side wall's own capping, is a butt joint over a soaker, just like the expansion joints on the front. A corner fixed rigidly at both faces would have to absorb the movement of the whole front group in its mitre, which is the weakest place to put it.

## Sealants and their limits

Sealant is used in every lap and at the soakers' edges, and it is tempting to rely on it for movement as well. Each sealant has a stated movement capability, the percentage by which a joint of a given width can widen and narrow without the sealant tearing or losing adhesion. A thin bead squeezed into a lap has almost no width to work with, so even a millimetre of movement is a large percentage of it. That is why riveted laps are made rigid, with the sealant acting only as a seal, and why the movement is taken at the expansion joints, where the soaker and the gap do the work and the sealant does not have to stretch.

The sealant must also suit the coating. A neutral-cure sealant recommended by the coping material's maker avoids the corrosion that some acid-curing sealants cause on metallic-coated steel.

## Inspect the coping

A coping is easy to forget, because nobody looks at the top of a parapet. W-40's maintenance schedule includes it at the annual roof inspection: each expansion gap is checked to be open and clean, each soaker in place, each lap sealed, and the coping straight and tight on its clips, with any lifted length refixed before the next storm. Damp or salt deposits on the inside face of the parapet, visible from the roof walkway, are the early warning of a coping leak, and are recorded with the inspection.

## The clip is only as strong as its fixing

A clip's tested capacity assumes its own fixings hold. On W-40, each clip is fixed into the brickwork or blockwork of the parapet with two anchors, and the anchors' capacity in that masonry, near the top edge of a wall, is often lower than the clip's. The designer checked the anchors' published capacity for the parapet's material and edge distance, and the lower of the clip and anchor capacities set the spacing. A clip that holds while its anchors pull out of soft mortar holds nothing.

## Cappings on other edges

The same principles apply to every capping on W-40: the barge cappings on the canopy gables from Chapter 4, the ridge capping on the canopy, and the cappings on the parapet returns. Each falls so water runs where it should, is jointed with laps in groups and expansion joints between them, and is held by fixings that allow movement and resist wind. The coping's numbers become a template for the others, adjusted for each one's length, width and exposure.

## A failure case: screwed through the top

This is an illustration. Another building in the owner's group had a 36 m parapet coping installed by a different contractor. It was fixed with screws through its top into timber battens on the parapet, at about 600 mm centres, and its laps were riveted and sealed along the whole length. It had no expansion joints and no soakers.

Over the first two summers, the coping tried to move with every day's heating and cooling. Restrained by more than a hundred screws through its top, the metal flexed between them, a rippling known as oil-canning, and each screw hole wore slightly larger. The sealing washers under the screw heads cracked in the sun. Water entered through the enlarged holes and the cracked sealant at the laps, soaked into the battens and ran down inside the parapet.

The detection came from damp patches and white salt deposits, efflorescence, on the inside face of the parapet above the roof, and from rotted battens found when a section of coping was lifted. The correction was to remove the coping, replace the battens with a treated fixing system, and refit a new coping on concealed clips, in expansion groups with soakers at the joints, with no fixings through the top. The business now specifies concealed fixing for all copings.

## How this applies to a small Australian business

Fall coping tops towards the roof so dirty water does not streak the facade. Join lengths with riveted, sealed laps in groups of about 10 m, and separate the groups with butt joints over soakers that let the coping move. Calculate the movement with the material's coefficient and a realistic temperature range, and set each expansion gap for the metal temperature on the day. Hold copings down with concealed clips, not screws through the top. And space the clips from a real wind pressure for the site, from AS/NZS 1170.2, and the clip maker's tested capacity, closer at corners and at joints.

## Exercise: the corner zone

Near each corner of W-40's parapet, the design uplift pressure on the coping is higher. Using a teaching value of **3.0 kPa** and the same 0.24 m top and 0.6 kN clip capacity, what is the load per metre and the maximum clip spacing? What spacing would you choose?

**Worked answer.** The load per metre is **3.0 × 0.24 = 0.72 kN/m**. The maximum spacing is **0.6 ÷ 0.72 ≈ 0.83 m**. A practical choice is **0.75 m** centres in the corner zones, giving a little margin, with the 1.0 m spacing resuming where the pressure falls back to the middle-of-parapet value. The corner zone's length comes from the wind standard for the building's dimensions, and the clip's real capacity from its maker.
