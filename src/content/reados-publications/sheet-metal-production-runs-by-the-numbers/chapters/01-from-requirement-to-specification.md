---
book: sheet-metal-production-runs-by-the-numbers
chapterSlug: from-requirement-to-specification
order: 1
title: "From a requirement to a product specification"
description: "Turn a customer's needs for 500 tote trays into a specification: footprint, capacity to a fill line, flare for nesting, thickness for load, denesting lugs, and a 36 L requirement read as brim-full."
draft: false
---

A production run starts with a sentence from a customer, and the sentence is never a drawing. "Five hundred steel trays for our shelving, about forty litres, powder coated." Before anyone can develop a blank or time a press brake, that sentence has to become a specification: every dimension, material and feature the product needs, each traced to something the customer asked for or something the shop decided, and each written down. Most expensive mistakes in a production run are made here, because they are copied five hundred times.

This chapter turns the running case's requirement into a specification for a flared steel tote tray. It lists what the customer actually needs, translates each need into a number or a feature, shows how the decisions interact, and ends with a capacity requirement that was read as brim-full and would have produced five hundred trays that each held four litres too little.

## What the customer asked for

This is an illustration. An equipment distributor wants 500 steel tote trays for storing small parts on warehouse shelving. In a short meeting and a follow-up email, its stores manager gave these requirements:

1. The trays must sit on existing shelving, whose bays take a **600 × 400 mm** footprint.
2. Each tray must hold at least **36 litres** of parts to a fill line **20 mm below the rim**, so that parts do not spill when trays are carried.
3. A full tray may weigh up to **25 kg** and is carried by hand.
4. Empty trays are stored and transported stacked, and twenty must **nest in no more than 700 mm** of height.
5. The trays must be **powder coated**, in the distributor's colour.
6. The first order is **500 trays**; the distributor expects about 2,000 a year if the trays work out.

Two of these, the fill line and the nesting height, came from the follow-up email, not the meeting. A specification built only from the meeting notes would have missed both.

## Translating needs into numbers

Each requirement becomes one or more specification items, and some become constraints that limit the others.

The **footprint** fixes the tray's top at 600 × 400 mm, outside the rim. The shop takes that as the inside dimension at the top of the wall, with the rim's hem turned outward and down, so that the outside is a few millimetres larger; it confirms with the stores manager that the shelving has that much clearance.

The **nesting requirement** means the walls must flare outward, because trays with vertical walls cannot sit inside one another. A flare costs capacity: the tray is smaller at the bottom than the top. The shop chooses a flare of 0.2 mm out per millimetre of depth, 11.31° from vertical, which is enough to nest freely and to release the tray from the stack, as Chapter 4 shows.

The **capacity** then sets the depth, through the geometry of a flared tray, which Chapter 2 works out. With the top fixed and the flare chosen, depth is the only free dimension.

The **load** sets the material's thickness and the rim's stiffness. A 25 kg load spread over the base is a pressure of only about 1,500 Pa, trivial for steel sheet; the demanding case is the tray being lifted by its handles with the load in it, which bends the long walls and the rim. The shop chooses **1.2 mm** cold-rolled steel and a hemmed rim, and will confirm the choice by test on the first article.

The **coating** adds a finishing operation and a cost per square metre, and its film thickness slightly changes nesting clearances. The colour itself is a requirement with consequences: a distributor's corporate colour may be a special order from the coater, with a minimum batch and a longer lead time than a standard colour, and that belongs in the specification before the run is scheduled, not discovered when the trays are ready to send out.

```figure
type: compare
title: From requirement to specification
rowhead: Requirement
cols: Specification item | Decided by | Chapter
caption: This is an illustration. Each item is traced to a requirement or a shop decision, so that a later change can be followed through.
- Fits 600 × 400 shelving | Top 600 × 400 inside, rim hemmed outward | Customer | 3
- 36 L to a fill line 20 mm below the rim | Depth 205 mm | Geometry | 2
- Nests 20 high in 700 mm | Walls flared 11.31°, denesting lugs at 25 mm pitch | Shop | 4
- * Carries 25 kg by hand | 1.2 mm steel, hemmed rim, two handle slots | Shop, confirmed by test | 4, 10
- Powder coated | Coating by subcontractor, distributor's colour | Customer | 6
- 500 now, about 2,000 a year | Batch of 500, setups planned for repeats | Customer and shop | 8
```

## Why thickness matters twice

Choosing between 1.0 mm and 1.2 mm sheet shows how one decision runs through the whole run. This is an illustration.

- **Stiffness.** A wall's resistance to bending rises with the cube of its thickness, so 1.2 mm is (1.2 ÷ 1.0)³ = **1.73 times** as stiff as 1.0 mm, for the same shape. That is what keeps the long walls from bowing when the tray is lifted full.
- **Mass and material cost.** The tray's blank, about 0.579 m², weighs **4.54 kg** in 1.0 mm sheet and **5.45 kg** in 1.2 mm. Material is priced by mass, so 1.2 mm costs about 20% more per tray.
- **Folding.** Thicker sheet needs more press brake force and a wider die, and springs back differently, which the Library’s [Sheet Metal Parts by the Numbers](/reados/publications/sheet-metal-parts-by-the-numbers/press-brake-and-punching-force/) covers.

The shop chooses 1.2 mm because the full tray is carried by hand and a bowed wall would let the rim twist out of the shelf. The first article's load test in Chapter 10 checks the choice; if 1.0 mm with a stiffer rim passes the same test, a later run can change.

## The flare and the capacity

Flaring the walls makes nesting possible and costs volume. A tray with vertical walls, 600 × 400 mm and filled to 185 mm, would hold 0.6 × 0.4 × 0.185 = **44.4 litres**. The flared tray, with the same top and fill depth, holds much less, because its base is only 518 × 318 mm. Chapter 2 calculates exactly how much less, and why the depth had to be increased from a first sketch of 200 mm to 205 mm.

The flare also sets the tray's blank, its corners and its folds. Every wall leans outward at 11.31°, so every wall's pattern is a trapezoid, the corners need lap tabs to close, and the folds between base and walls are 78.69° rather than 90°. Chapter 3 develops them.

## Questions worth asking at the start

Most of the requirements above came out of two conversations. A short list of questions, asked at the first meeting, would have produced them all at once, and the shop now keeps one for every new product:

1. **Where does it go?** Shelving, racking, a machine, a vehicle: the space it must fit, with clearances.
2. **What goes in it, and how much?** Volume, mass, the nature of the contents, and whether capacity is measured brim-full or to a line.
3. **How is it handled?** By hand, by forklift, by conveyor; full or empty; how often.
4. **How is it stored and moved empty?** Nested, stacked, flat-packed, and the limits on stack height or pallet size.
5. **What finish, and why?** Appearance, corrosion, cleaning, food or chemical contact, and the colour.
6. **How many, and how often?** The first order and the expected annual demand, which decide tooling, setups and batch size.
7. **How will it be accepted?** The customer's own checks, which become the shop's first-article and sampling plan.

The last question is the one most often missed. A customer who will check every tray's capacity with a measuring jug, or load-test one in fifty, has told the shop exactly what its inspection must prove, and the answer belongs in the specification from the start.

## Who decides what

The specification mixes the customer's requirements with the shop's design choices, and it should say which is which. The customer decides what the tray must do: fit, hold, carry, nest, look. The shop decides how: thickness, flare, rim, corners, lugs, routing. Where a shop choice limits what the customer can later change, such as a flare that fixes the nesting pitch or a corner detail that fixes the load rating, the specification records the choice and the reason, so that a request to change one item can be traced to everything it affects.

The distinction also matters commercially. A change to a requirement, made by the customer, is a variation to the order; a change to a design choice, made by the shop to save cost or fix a problem, is the shop's own business, provided every requirement is still met and the customer has agreed any change to what they will see.

## The draft specification

This is an illustration. The shop's draft specification for the tote tray, after this chapter's decisions, reads:

1. Material: 1.2 mm cold-rolled steel sheet.
2. Top, inside the wall: 600 × 400 mm. Depth, base to top of wall: 205 mm. Walls flared 41 mm per side, 11.31° from vertical. Base, inside: 518 × 318 mm.
3. Rim: 12 mm closed hem turned outward on all four walls.
4. Corners: lap tabs on the short walls, two 4 mm blind rivets per corner.
5. Handles: one 120 × 30 mm slot with 15 mm end radii in each short wall, 40 mm below the rim.
6. Nesting: four pressed denesting lugs setting a stacking pitch of 25 mm.
7. Finish: powder coat, distributor's colour, inside and out.
8. Capacity: at least 36 litres to a fill line 20 mm below the rim, marked inside.
9. Load: 25 kg, lifted by both handles, without permanent deformation, by test.

Each item has a number, a reason, and a chapter where it is worked out or checked.

```figure
type: stats
title: The tote tray in numbers
caption: This is an illustration. Values are worked out in the chapters that follow.
- 600 × 400 mm | Top, inside | the shelving footprint
- 205 mm | Depth | set by 36 L to the fill line
- * 36.5 L | Capacity to the fill line | 41.3 L brim-full
- 5.45 kg | Mass | 1.2 mm steel, before coating
```

## The error: 36 litres read as brim-full

This is an illustration. The shop's first sketch, drawn from the meeting notes before the follow-up email was read, took "36 litres" as the tray's brim-full capacity. With the 600 × 400 mm top and 11.31° flare, a depth of 175 mm gives a brim-full volume of 36.2 litres, and the sketch showed a tray 175 mm deep.

Filled to 20 mm below the rim, that tray holds only **31.4 litres**, 4.6 litres short of the requirement, nearly 13%. Every one of the 500 trays would have failed the distributor's acceptance check, and the shortfall could not have been fixed after cutting.

The fault was found at the specification review, when a second person read the follow-up email against the sketch. The shop's procedure now requires every requirement to be quoted in the specification in the customer's own words, with the source, before it is turned into a number. "At least 36 L to a fill line 20 mm below the rim (email, stores manager)" cannot be misread as brim-full; "36 L" can.

```figure
type: checklist
title: Specification review before any pattern is drawn
caption: Each check traces a number back to what the customer asked for.
- Every requirement quoted in the customer's words with its source | email and meeting notes both read
- Capacity defined: brim-full or to a fill line | 36 L to 20 mm below the rim
- Constraints separated from choices | footprint fixed, flare chosen
- Each specification item traced to a requirement or a decision | the table above
- Items to be confirmed by test identified | load, nesting
- x Capacity taken from the meeting notes alone | the 175 mm tray, 4.6 L short
```

## Requirements that conflict

Requirements do not always fit together, and a specification is where conflicts are found and resolved. Here, the footprint, the fill-line capacity and the nesting height pull against each other. A deeper tray holds more but stacks taller; a steeper flare nests more tightly but holds less; a larger denesting pitch stops trays jamming but adds height to the stack.

The shop checks the stack before committing: twenty trays at a 25 mm pitch stand 205 + 19 × 25 = **680 mm** high, within the 700 mm limit with 20 mm to spare. Had the depth needed to be 225 mm for capacity, the stack would have been 700 mm exactly, with no margin for coating thickness or variation, and the shop would have gone back to the customer to relax one requirement or the other. A specification that meets every requirement on paper with no margin is a specification that will fail in production. Margins belong in the specification as deliberately as the dimensions do: 20 mm on the stack height, 0.5 litres on the capacity, and a load test at the full 25 kg rather than at the average load the distributor expects.

## Exercise: a 1.0 mm tray

The distributor asks whether 1.0 mm sheet would be cheaper. With the same 0.579 m² blank, find the tray's mass in 1.0 mm sheet and the saving per tray and per 500 trays in steel, and the ratio of wall stiffness. Assume steel at 7,850 kg/m³.

**Worked answer.**

- Mass in 1.0 mm: 0.579 × 0.0010 × 7,850 = **4.54 kg**; in 1.2 mm, **5.45 kg**.
- Saving: about **0.91 kg** of steel per tray, or about **455 kg** over 500 trays, about a sixth of the steel in the finished trays.
- Stiffness: the 1.0 mm wall is (1.0 ÷ 1.2)³ = **0.58 times** as stiff as the 1.2 mm wall.

The material saving is real, but the walls would be 42% less stiff. The answer to the distributor is not yes or no, but a test: make a 1.0 mm prototype with the same rim, load it to 25 kg on its handles, and see whether it meets the specification's "without permanent deformation" requirement. If it does, the next run can change.
