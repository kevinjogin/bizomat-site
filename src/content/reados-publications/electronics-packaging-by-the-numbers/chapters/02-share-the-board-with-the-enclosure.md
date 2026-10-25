---
book: electronics-packaging-by-the-numbers
chapterSlug: share-the-board-with-the-enclosure
order: 2
title: "Share the board with the enclosure"
description: "Exchange board outlines, mounting holes, height zones and keep-outs between electronics and mechanical CAD, check clearances with tolerances and catch clashes before prototypes."
draft: false
---

The circuit board and the enclosure are designed in different software by different people, yet they must fit together to a fraction of a millimetre. The electronics designer works in an electronics CAD tool (ECAD), which places components and routes copper. The mechanical designer works in mechanical CAD (MCAD), which models solids and assemblies. Neither tool sees the other's world clearly. A connector that looks perfectly placed on the board can drive straight through a casting boss. A lid rib can sit exactly where a tall module was moved last week.

This chapter sets up the exchange between the two for the gearbox monitor. It covers what must be exchanged, the formats that carry it, the height-zone map that turns a three-dimensional problem into a few simple rules, the clearance check with tolerances and the change discipline that stops the two models drifting apart.

## What each side owns

The first decision is ownership, because a shared item with two owners is changed by both. A common and workable split is this:

- **The mechanical designer owns** the board outline, its thickness, the mounting-hole positions and diameters, the height-zone map and the positions of any part that passes through the enclosure, such as a connector, a light pipe or a push button.
- **The electronics designer owns** the placement of every other component, the copper, the component heights within the zone limits and the antenna's position within the area the mechanical designer has released for it.

Either side may propose a change to the other's items, but only the owner makes it. For the gearbox monitor, the board outline was fixed in the brief as a maximum of 80 mm by 50 mm. The mechanical designer then drew the actual outline, with its corner holes and any cut-outs, and released it to the electronics designer as revision A.

## What must be exchanged

A board outline drawn as a flat line is not enough. The mechanical model needs the board's thickness, the hole positions, each component's footprint and height, and especially anything that is taller than its neighbours or hangs over the board edge. The electronics model needs the outline, the holes and the zones where component height is limited or where nothing may be placed.

```figure
type: compare
title: Ways to exchange board data between ECAD and MCAD
cols: Carries | Good for | Watch for
caption: Named formats only. IDX is maintained by the ProSTEP iViP association; IDF 3.0 is an older, widely supported text format. Check what both tools actually support.
- 2D drawing exchange (DXF) | outline and holes as lines | the very first concept | no heights, layers easily misread
- IDF 3.0 board and library files | outline, holes, keep-outs, component outlines and heights | simple height checks | components as extruded boxes only
- STEP model of the populated board | full 3D shapes | final clash checks and renders | one-way, large, no change history
- *Incremental exchange (IDX) | changes proposed and accepted item by item | ongoing collaboration | needs both tools and a disciplined owner for each item
```

The gearbox monitor team uses IDF early, because both tools support it and it carries component heights as simple boxes. From the first full layout onwards they also exchange a STEP model of the populated board for the final clash check before each prototype build.

## Build a height-zone map

Checking every component against every rib by eye is slow and unreliable. A height-zone map simplifies it. The mechanical designer divides the board area into zones and gives each zone a maximum component height above the board's top surface (and, where needed, below its bottom surface). The electronics designer then only has to keep each component within its zone's limit, and the ECAD tool can check that automatically.

This is an illustration. The gearbox monitor's internal stack is:

- From the base floor to the underside of the lid there is **36 mm** of clear height.
- The board sits on standoffs **10 mm** tall, so its top surface is at **10 + 1.6 = 11.6 mm**.
- That leaves **36 − 11.6 = 24.4 mm** above the board.
- The lid has a stiffening rib grid that hangs **10 mm** below its underside, and **2 mm** is reserved for tolerances and for the lid flexing inwards under an impact.
- Under the ribs, therefore, components may be up to **24.4 − 10 − 2 = 12.4 mm** tall. The zone map states **12 mm**.

```figure
type: svg
title: Section through the gearbox monitor's internal stack
alt: A schematic cross-section of the enclosure. The base floor is at the bottom and the lid at the top, with 36 mm between them. Two standoffs 10 mm tall carry the board. A radio module stands on the board under one of three ribs that hang down from the lid. A dashed line marks the 12 mm height limit above the board; the module rises 2 mm above it and almost touches the rib.
caption: Not to scale. The 12 mm zone limit is 24.4 mm of space above the board, less 10 mm of rib and 2 mm of reserve. The 14 mm module in the failure case breaks the limit by 2 mm.
viewbox: 0 0 640 300
body:
<rect class="bx" x="40" y="250" width="560" height="14"/>
<text class="tx txs" x="48" y="282">Base floor</text>
<rect class="bx" x="40" y="20" width="560" height="14"/>
<text class="tx txs" x="48" y="14">Lid</text>
<rect class="bxi" x="196" y="34" width="10" height="60"/>
<rect class="bxi" x="335" y="34" width="10" height="60"/>
<rect class="bxi" x="474" y="34" width="10" height="60"/>
<text class="tx txs" x="490" y="66">Ribs, 10 mm</text>
<rect class="bxi" x="130" y="190" width="14" height="60"/>
<rect class="bxi" x="496" y="190" width="14" height="60"/>
<text class="tx txs" x="150" y="226">Standoff, 10 mm</text>
<rect class="bxa" x="120" y="180" width="400" height="10"/>
<text class="tx txs" x="528" y="190">Board, 1.6 mm</text>
<rect class="bxa grow" x="300" y="96" width="80" height="84"/>
<text class="txa" x="236" y="150">Module</text>
<path class="la dsh draw" pathLength="1" d="M120 108H520"/>
<text class="txa" x="528" y="112">12 mm limit</text>
<path class="ln" d="M610 34V250"/>
<text class="tx txs" x="560" y="246">36 mm</text>
<circle class="fa pulse" cx="340" cy="96" r="4"/>
```

Below the board the stack is simpler. The base floor has bosses and a raised pad over the mounting stud, and the zone map limits bottom-side components to 3 mm everywhere except a clear area over the stud, which Chapter 3 reserves for the accelerometer's mounting.

The antenna area gets its own zone. Under the lid's polycarbonate window there are no ribs, but the antenna maker's integration guide requires a volume free of metal around the antenna. The zone map shows that volume as a keep-out for all metal parts, including screws, shields and the aluminium base, whose wall is cut back locally. Chapter 7 returns to it.

## Check clearances with tolerances

A model that fits at nominal dimensions may still clash in production. Every gap that matters should be checked with the tolerances of the parts that create it.

This is an illustration. The board sits centrally in an internal cavity 102 mm by 62 mm, so there are **(102 − 80) ÷ 2 = 11 mm** of space at each end and **(62 − 50) ÷ 2 = 6 mm** along each side. The lid screws pass into corner bosses in the die-cast base. Each boss has a 10 mm diameter, centred 6 mm from both inner walls, so it reaches 11 mm along the length and 11 mm across.

At the board's corners, the boss's edge and the board's corner meet at the same point: 11 mm from the end wall, and the board corner is only 6 mm from the side wall, inside the boss's 11 mm reach. In the first layout the clearance between the boss and the board corner was zero at nominal. With a routed board outline tolerance of ±0.2 mm, a board positioning error of up to ±0.3 mm from hole clearance and a casting tolerance on the boss of ±0.15 mm, the worst case is an interference of **0.2 + 0.3 + 0.15 = 0.65 mm**. A first suggestion, a 2 mm by 2 mm chamfer on each corner, was checked and rejected: the chamfer's end point still sits only about **√(5² + 2²) − 5 ≈ 0.39 mm** from the boss at nominal, less than the 0.65 mm stack. The adopted fix was a relief notch at each corner, a 6 mm radius concentric with the boss. That gives a nominal clearance of **6 − 5 = 1.0 mm** and a worst case of **1.0 − 0.65 = 0.35 mm**, accepted because the boss is a rigid casting that does not move in service. The corner mounting holes, 4 mm in from each edge, keep about 2.2 mm of board material between the notch and the hole.

The arithmetic here is a simple worst-case stack. For a gap with many contributors a statistical stack may be justified, but for a one-off clash check, worst case is quicker and safe.

## A failure case: the module that grew

This is an illustration. Six weeks into the design, the radio module's supplier announced a lead-time problem. The electronics designer substituted a pin-compatible module from another supplier, which was **14 mm** tall with its shield can, 2 mm taller than the module it replaced. The change was made in the ECAD tool late on a Friday, with no change request, because the footprint was identical.

The next IDF exchange on Monday ran the automatic zone check, and the module was flagged in zone B: **14 mm** against a **12 mm** limit. The 3D clash check confirmed it: the module's top was within 0.4 mm of the middle lid rib at nominal and would hit it at worst case.

Three corrections were considered:

1. Shorten the middle rib by 2 mm locally. This weakens the lid at its most loaded point, the centre of a jet impact.
2. Move the module 25 mm towards the antenna end, between two ribs. This moves it closer to the antenna, which the radio designer was content with, but it also moves a heat source closer to the polycarbonate window.
3. Return to the original module and accept the lead time.

The team chose option 2, with a thermal check in Chapter 4, and the zone map was revised to show the new position. The lesson was not the clash itself, which the exchange caught as intended, but the missing change request. A pin-compatible substitution can still change height, mass, heat and radio performance, and all four affect the package.

## Run the exchange as a routine

Clashes are found reliably only when exchanges are frequent and routine. The gearbox monitor team settled on a simple cycle.

```figure
type: steps
title: The weekly board and enclosure exchange
caption: This is an illustration. Each exchange is logged with the revisions of both models, so that any later question about what fitted what can be answered.
- Export | the electronics designer exports the board model and the mechanical designer exports the enclosure constraints, each with a revision
- Check zones | the ECAD tool checks every component against the height-zone map and keep-outs
- *Check in 3D | the mechanical designer loads the populated board into the enclosure assembly and runs an interference check at nominal and with tolerances
- Raise changes | each clash becomes a change request to the owner of the item that must move
- Log | the exchange log records both revisions, the clashes found and the decisions
```

The log can be a simple table, but it matters. When a prototype arrives with a part that does not fit, the first question is which revision of the board was built into which revision of the enclosure. Without a log, nobody knows.

## Model the assembly order, not just the fit

Two models can fit together perfectly in their final positions and still be impossible to assemble. The board has to travel into the enclosure along some path, the flying leads have to be plugged in by fingers that need room, and a screwdriver has to reach each standoff screw. None of that shows up in a static interference check.

For the gearbox monitor, the assembly order in its final form, including details added in Chapters 3 and 4, is: fit the M12 connector to the base wall and tighten its nut; place the thermal pad on its boss; lower the board vertically onto its standoffs; fit and torque the screws; plug the connector's flying leads into the board header and tie them to the anchor point; fit the lid gasket; fit and torque the lid. The mechanical designer modelled each step as an assembly state and checked the travel path of the board. That check found one problem. The header for the flying leads was on the side of the board facing the connector, but so close to the wall that a finger could not push the plug home with the board in place. Rotating the header by 90°, so that the plug went in from above, cost the electronics designer an hour and saved a fiddly assembly step on every unit.

The same review checks tool access. A screwdriver reaching a standoff screw needs a clear vertical path above the screw head and enough room for the bit's diameter. In the zone map these paths appear as small keep-out columns above each mounting hole, so that no tall component is later placed where the screwdriver must go.

## Things that cross the boundary

Some parts belong to both worlds and need extra care, because they are positioned by the board but pass through or touch the enclosure:

- **Connectors** that pass through the enclosure wall, or that mate with a cable connector on the wall. Their position is fixed by both models, so one of them must be the master. On the gearbox monitor, the M12 connector is on the enclosure wall, owned mechanically, and its flying leads plug into a header on the board.
- **Light pipes and indicators**, whose length depends on the board's height above the floor and the lid's thickness.
- **Push buttons and switches** actuated through the lid, which need travel and over-travel allowances.
- **Test points** that production must reach with spring pins, which must not be covered by a bracket or rib.
- **Mounting holes** that also carry ground connections to a metal enclosure, where Chapter 8's EMC needs and Chapter 3's mechanical needs coincide.

Every such item is listed in the brief, with an owner, and is checked at every exchange.

## How this applies to a small Australian business

A small team may not have tools that support incremental exchange, and that is fine. A disciplined routine of IDF or STEP exports, a height-zone map agreed early and an exchange log will catch most clashes. Product data management for a small team does not need an expensive system; the essentials are revision control and a clear owner for each file, as discussed in [Product data management for small teams](/reados/collections/engineering-design-practice/product-data-management-for-small-teams/). If the board is designed by an outside contractor, put the zone map and the exchange routine in the contract, because a contractor working to a fixed price has every reason to substitute parts quietly.

## Exercise: a taller bottom-side part

The electronics designer wants to place a 5 mm tall electrolytic capacitor on the bottom of the board, near one end. The base floor in that area has a 4 mm high boss for a cable tie point, 20 mm from the board's end. The standoffs are 10 mm tall and the zone map limits bottom-side parts to 3 mm. The board's bottom surface tolerance in height, from standoff and casting tolerances, is ±0.3 mm, and the boss height is ±0.2 mm. Can the capacitor go there if it is placed directly above the boss? If not, what is the smallest change that would allow it?

**Worked answer.** The space between the board's bottom surface and the top of the boss is **10 − 4 = 6 mm** at nominal. The worst case is **6 − 0.3 − 0.2 = 5.5 mm**, leaving **0.5 mm** for a 5 mm capacitor, which is too little once the capacitor's own height tolerance and the board's flexing under vibration are allowed for. The capacitor is also above the 3 mm zone limit, so it needs a change request whatever its position. The smallest change is to place it anywhere away from the boss, where the clearance is the full 10 mm less the floor's own tolerance. The zone map would then be revised to create a local zone with a 6 mm limit away from the boss, and the boss itself would be marked as a 3 mm zone in the map. Leaving the zone limit at 3 mm everywhere and granting a silent exception would recreate the problem in the failure case.
