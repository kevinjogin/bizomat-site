---
book: plate-work-by-the-numbers
chapterSlug: plate-list-mass-and-lifting
order: 10
title: "The plate list, mass and lifting"
description: "Bring the bin together on one plate list: net and gross mass, plate cost with GST, centre of gravity from its parts, sling loads for planning, and a lift plan that assumed the load was shared evenly."
draft: false
---

The plate list is where every decision in this book becomes a line: a part, its thickness, its size, how many, which sheet it comes from, what it weighs. Added up, the list gives the material to buy, the steel's cost, the bin's mass and, with each part's position, its centre of gravity. Those last two numbers leave the fabrication shop with the bin: whoever lifts, transports and installs it plans the work from them.

This chapter assembles the running case's plate list, calculates the bin's mass and centre of gravity from its parts, prices the plate, and works through the loads in a simple lift for planning. It ends with a lift plan that put the centre of gravity at mid-height and shared the load evenly between two cranes when it was not shared evenly.

## The plate list

Every plate part of the bin has been developed in an earlier chapter. Collected, with their masses calculated from their net areas at 7,850 kg/m³, they make the list below. The loading hopper is a separate item, delivered loose, and the bin's legs, cover plates, fasteners and fittings are on the designer's separate schedules.

```figure
type: compare
title: Plate and section list for the bin
rowhead: Part
cols: Qty | Material and size | Net mass, kg | From
caption: This is an illustration. Net masses are of the finished parts. Gross material is listed by sheet in Chapter 8.
- Shell plates | 4 | 6 mm, 3,777.3 × 2,400 mm | 1,709 | Four 6 mm sheets
- Cone segments | 3 | 8 mm, annular sectors 2,409.24 / 409.24 mm radius, 60° | 556 | One 8 mm sheet
- Outlet flange halves | 2 | 8 mm, half rings 560 / 420 mm diameter | 6.8 | Cone sheet offcut
- Roof half discs | 2 | 5 mm, 2,412 mm diameter disc, split | 179.3 | One 5 mm sheet
- Manway neck | 1 | 6 mm, 1,587.6 × 200 mm, rolled | 15.0 | Shell offcut
- Angle ring | 1 | 75 × 75 × 6 angle, 7,709.3 mm on centroid | 52.3 | One 9 m length
- * Bin total | | | 2,518 | Before legs and fittings
- Loading hopper sides | 4 | 6 mm, trapezoids 1,200 / 300 × 750 mm | 106 | Shell offcut, loose item
```

## Mass and what it is for

The bin's plate and ring weigh about **2,518 kg** before welds, legs and fittings. Weld metal adds a little; legs, a cover and a slide gate add more, and the designer's general arrangement should state the total. The fabricator's figure, built up part by part, is a check on the designer's: a difference of more than a few per cent means a part has been missed or a thickness misread on one side or the other.

Mass drives four decisions in the shop and beyond: the crane and rigging for each lift, the transport vehicle and its load restraint, the installation crane, and the foundation or structure the bin stands on, which must also carry its contents. The first three are the subject of the rest of this chapter. The fourth is the designer's, using the bin's mass and the loads from its stored material under the standards that govern it.

The empty bin's mass is also small beside what it will hold. This is an illustration. Chapter 4 found a geometric volume of about 24.8 m³ to the top of the shell. If the stockfeed's bulk density were 600 kg/m³, a full bin would hold roughly 14.9 t, nearly six times the steel's own mass. Bulk densities vary widely between materials and with moisture and compaction, and the loads a stored material puts on the walls and hopper depend on how it flows, not only on its weight; those are exactly the questions AS 3774 addresses and the designer answers. The fabricator's figure for the empty bin feeds into that design, and into every lift before the bin is filled, but it is not the number the structure is designed for.

## Plate cost

This is an illustration. If the shop pays A$1,850 per tonne for plate, excluding GST, its gross plate for the bin, 4,182 kg across six sheets from Chapter 8, costs 4.182 × 1,850 = **A$7,736.26** excluding GST, or **A$8,509.88** including 10% GST. Of that, the net parts account for 2,572 kg including the loading hopper, and the offcuts returned to stock for the rest.

Plate cost is only part of the bin's cost, and usually not the largest part. Cutting, rolling, forming, fitting, welding, inspection, surface treatment and handling all add labour and machine time, and the plate list is the base for estimating them: each line has a cut length, each rolled part a rolling time, each seam a weld length. The estimator works from the plate list, not from the drawing's outline.

## Centre of gravity from the parts

The bin's centre of gravity follows from its parts' masses and positions. Measuring heights from the outlet, with the bin standing:

- the cone, 556 kg, has its centroid of surface 661.2 mm below its top edge, h ÷ 3 × (R₁ + 2R₂) ÷ (R₁ + R₂) for a frustum's sloping surface, which puts it **1,070.9 mm** above the outlet;
- the shell, 1,709 kg, has its centroid at its mid-height, 1,732.1 + 2,401 = **4,133.1 mm**;
- the roof, 179.3 kg, sits at the top, about 6,536.6 mm;
- the angle ring, 52.3 kg, about 6,513.1 mm;
- the manway neck, 15 kg, at 2,332.1 mm; and the outlet flange, 6.8 kg, at about 4 mm.

The centre of gravity is the mass-weighted average: (556 × 1,070.9 + 1,709 × 4,133.1 + 179.3 × 6,536.6 + 52.3 × 6,513.1 + 15 × 2,332.1 + 6.8 × 4) ÷ 2,518.4 = **3,656 mm** above the outlet.

```figure
type: stats
title: The bin as a load
caption: This is an illustration, empty bin, plate and ring only, before legs and fittings.
- 2,518 kg | Mass | plate and angle ring
- 6,539 mm | Overall height | outlet to roof
- * 3,656 mm | Centre of gravity above the outlet | 56% of the height, not 50%
- 3,270 mm | Mid-height | where a quick guess would put it
```

The centre of gravity sits well above mid-height, because the heavy shell and roof are at the top and the light cone, despite its thicker plate, is at the bottom. Any plan that assumes the middle will be wrong by 386 mm, which matters in the error below.

## Sling loads, for planning

This is an illustration. When the bin is lifted upright by four lugs at its top ring, with slings meeting at a single hook above the centre, each sling carries a quarter of the weight divided by the sine of its angle to the horizontal. The bin's weight is 2,518.4 × 9.81 = 24.7 kN, so each lug carries 6.18 kN if the slings were vertical. With slings at 60° to the horizontal, each carries 6.18 ÷ sin 60° = **7.13 kN**; at 45°, **8.73 kN**. The flatter the slings, the more each one and each lug carries, and the greater the inward pull on the top of the shell.

These are static loads for a perfectly balanced lift. A real lift plan adds factors for dynamic loading, uneven sharing between slings and the rigging's own rated capacities, and the lugs themselves are designed for those loads by the bin's designer; the KEVOS® [lifting lug calculator](/tools/lifting-lug-design/) shows the kind of checks involved. Lifting is high-risk work under Australian work health and safety law: the lift plan, the rigging and the crane are matters for licensed and competent people, and this chapter's numbers illustrate the arithmetic, not a plan.

```figure
type: bars
title: Load in each of four slings by sling angle
unit: kN
max: 10
caption: This is an illustration for the empty bin, static, perfectly shared. Real lift plans add dynamic and sharing factors and use the rigging's rated capacities.
- Vertical slings | 6.18
- 60° to horizontal | 7.13
- 45° to horizontal | 8.73
```

## Turning the bin upright

The bin is fabricated lying on its side, on rollers, so that the welders can turn the circumferential seams to a comfortable position. To stand it up, it is usually lifted by two cranes or a crane and a tailing device: the main crane at the top lugs, the tailing crane at the outlet end, lifting together until the bin is clear of the ground, then the main crane raising the top while the tailing crane lowers the outlet end.

While the bin hangs horizontally between the two lift points, each crane carries a share of its weight in proportion to the centre of gravity's distance from the other crane. With lift points near the outlet and the top, about 6,539 mm apart, the main crane at the top carries 2,518.4 × 3,656 ÷ 6,539 = **1,408 kg**, 55.9% of the weight, and the tailing crane at the outlet **1,110 kg**. As the bin rotates upright, the tailing crane's share falls to nothing and the main crane takes the whole weight.

## Transport dimensions

The plate list's sizes also decide how the bin travels. Lying on its side, the bin is 6,539 mm long. Its width is set not by the shell, 2,412 mm across the outside, but by the angle ring, whose toe stands 75 mm out from the shell all round: 2 × (1,206 + 75) = **2,562 mm** across. That is wider than the general width limit for vehicles on Australian roads, which is 2.5 m for most vehicles, so the load would be oversize and need the arrangements that the National Heavy Vehicle Regulator and the state road authorities require for it. The current rules, not this paragraph, govern.

The numbers suggest choices that are cheap at the plate list stage and expensive later. The ring could be fitted on site instead of in the shop, bringing the load's width down to 2,412 mm. The ring could be rolled toe in, inside the shell, though Chapter 7 showed that is harder to roll and it would reduce the bin's usable inside diameter. Or the shop could accept an oversize load and plan for it. Each choice belongs to the client, the designer and the transport contractor together, and the fabricator's job is to put the 2,562 mm on the table before the ring is welded.

## Keeping the plate list current

A plate list is a working document. During a job it changes: a part is re-cut, a thickness is upgraded, an offcut is used for something else, a designer adds a stiffener. Each change alters the mass, the centre of gravity, the plate yield and the cost, and every downstream number that was calculated from the list.

The shop keeps its plate list under revision control, like a drawing. Each revision records what changed and why, and the summary at the foot of the list, total mass, centre of gravity and sheets used, is recalculated whenever a line changes. The lift plan and the transport booking refer to the plate list's revision, so that anyone can see whether they were made from the current figures. The exercise below shows how much a single added item moves them.

## The error: an even share

This is an illustration. The first draft of the lift plan for standing the bin up was prepared by a supervisor who assumed the centre of gravity was at mid-height, because the bin "is a cylinder". The plan gave each crane half the weight, 1,259 kg, and sized the main crane's rigging accordingly with only a small margin.

The shop's engineer checked the plan against the plate list. With the centre of gravity at 3,656 mm, not 3,270 mm, the main crane's share while the bin hung horizontally was 1,408 kg, **11.8% more** than the plan allowed, and the tailing crane's was correspondingly less. The rigging chosen for the main crane would have been loaded beyond the margin the plan intended. The plan was revised with the calculated centre of gravity and rigging rated for the full weight at the main hook, since the main crane takes it all once the bin is upright, and the revised plan was reviewed by the crane contractor's lift supervisor before the lift.

Nothing failed, because the check was made on paper. The shop's lift planning procedure now takes the centre of gravity from the plate list, with each part's mass and position, and never from the shape's outline.

```figure
type: checklist
title: From plate list to lift plan
caption: The numbers a lift planner needs from the fabricator, each taken from the parts, not guessed from the outline.
- Total mass built up part by part | 2,518 kg, plate and ring
- Centre of gravity from part masses and positions | 3,656 mm above the outlet
- Lug positions and capacities from the designer | four at the top ring
- Shares between cranes while horizontal | 1,408 and 1,110 kg
- Plan reviewed by the crane contractor's competent person | before the lift
- x Centre of gravity assumed at mid-height | main crane underestimated by 11.8%
```

## Bringing the plate work together

The bin in this book was made from a handful of ideas, applied at every part. Develop rolled plate on its mean line, and convert a drawing's inside or outside dimension to the mean line in writing before anything is marked. In a sloping wall, offset the mean line square to the plate, then convert to plan. Bend sections on their centroid. Mark holes in rolled plate in arcs on the mean line, wide enough at the surface where the opening is narrowest. Roll to a template, from the open side, because springback cannot be calculated closely enough to set a machine. Prove every rectangle by its diagonals. Nest the small parts in the large parts' offcuts, and find the parts that miss the plate's width before ordering. And measure every finished dimension on the surface its figure belongs to.

Each chapter's error broke one of those ideas, and each was found by a check that used a different route to the same number: a girth tape, a template, a diagonal, a recalculated radius, a part-by-part centre of gravity. A shop that builds those checks into its plate lists, fit-up sheets and lift plans does not need to be lucky.

## Exercise: the bin with its legs

The designer's four legs, with their base plates and bracing, add 420 kg, with their combined centre of gravity 900 mm above the outlet. Find the new total mass and centre of gravity, and the main crane's share while the bin hangs horizontally between the same lift points, 6,539 mm apart.

**Worked answer.**

- New mass: 2,518.4 + 420 = **2,938.4 kg**.
- New centre of gravity: (2,518.4 × 3,656 + 420 × 900) ÷ 2,938.4 = (9,207,270 + 378,000) ÷ 2,938.4 = **3,262 mm** above the outlet.
- Main crane's share: 2,938.4 × 3,262 ÷ 6,539 = **1,466 kg**, 49.9% of the new total.

The legs bring the centre of gravity down almost exactly to mid-height, so the shares become nearly equal, but the main crane's load still rises, from 1,408 to 1,466 kg, because the bin is heavier. Every change to the bin's parts changes both numbers, and the lift plan is recalculated from the updated list each time.
