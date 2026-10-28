---
book: modular-projects-by-the-numbers
chapterSlug: drawing-the-module-boundary
order: 2
title: "Drawing the module boundary: interfaces and variants"
description: "Decide what goes inside a standard packing cell, write a five-part interface specification, handle two case formats by settings, and measure 94% parts commonality."
draft: true
---

A module is only as standard as its boundary. Draw the line too wide and the module swallows parts of each site that differ, so every unit becomes a redesign. Draw it too narrow and the sites are left to build the difficult parts themselves, twelve different ways. This chapter draws the boundary for the running case's end-of-line cell: what goes inside the module, what stays with each site, and the interface specification that joins the two.

It then deals with variants, the lines that are almost but not quite the same, and shows how to handle them by settings and change parts rather than by redesign. It measures how much of the cell is truly common, explains why some design rules must be visible to everyone while others can stay hidden inside the module, and ends with an interface that was left off the specification and found at site C.

## What makes a module

A module is a unit whose internal design can be settled once and whose connections to everything else are fixed by a small set of rules. Carliss Baldwin and Kim Clark, in *Design Rules* (2000), described those rules as **visible information**: the architecture, the interfaces and the tests that every designer working on any part of the system must know and obey. Everything else about a module can be **hidden**: its internal arrangement, its settings, its software. Hidden parameters can be improved without anyone outside the module needing to know, provided the visible rules are still met.

Applied to a programme of equipment, this has a practical meaning. The interface specification, the safety architecture, the data exchange with the site and the acceptance test are visible rules. They are set by the programme and change rarely, and only through formal change control. The robot's motion paths, the case packer's timing and the layout of parts inside the control panel are hidden. The integrator can refine them from one cell to the next, and every site benefits, because no site connection depends on them.

## Inside the module and outside it

This is an illustration. The running case's standard cell is built on two skids. The first carries the case erector and the case packer, with its case sealer and label applicator. The second carries the checkweigher with its reject, the robot palletiser with its two pallet positions, and the guarding around both. A control panel on the second skid holds the cell's controller, its safety controller and the operator screen. Everything on the skids is designed once, built in the integrator's workshop and tested there before it ships.

Each site provides what connects the cell to that site: the conveyor that brings packs from the line to the cell's in-feed point, a power supply to the cell's isolator, compressed air to its inlet, a level floor with anchor points, a network connection and a clear route for a forklift to take pallets to the stretch wrapper.

```figure
type: tree
title: The module boundary for the end-of-line cell
caption: This is an illustration. Everything under the module is built and tested in the workshop; everything under the site is prepared before the installation weekend and must meet the interface specification.
- End-of-line cell | standard module, built and tested off site
  - Skid 1 | case erector and case packer
  - Skid 2 | checkweigher with reject, robot palletiser, two pallet positions
  - Guarding and safety controls | fixed guards, interlocked doors, light curtains at the pallet positions
  - * Controls | cell controller, safety controller, operator screen, recipes
- Site works | different on every line, prepared in advance
  - In-feed conveyor | from the line's discharge to the cell's in-feed point
  - Services | power to the isolator, air to the inlet, network connection
  - Floor and access | level slab, anchor points, forklift route to the wrapper
```

The boundary was drawn at the in-feed point for a reason. Upstream of it, every line is different: some discharge at floor level, some from a mezzanine, some around a column. Downstream of it, every line needs the same thing. If the module had included the in-feed conveyor, twelve conveyors of twelve shapes would have entered the standard parts list, and the module's drawings would have needed a site version for every cell. If the boundary had been drawn after the case packer, leaving the sites to provide their own palletising, the hardest and most hazardous part of the cell would have been bought twelve times.

## The interface specification

The interface specification is the module's contract with every site. It states, for each connection, what the site must provide, to what value and tolerance, and where the responsibility changes hands. A good specification is short, numerical and complete. A value written as "to suit site" is not an interface; it is an open question that will be answered on the installation weekend.

This is an illustration. The case's interface specification covers five kinds of connection, plus the environment the cell must work in.

```figure
type: compare
title: Interface specification for the standard cell, summary
cols: Site provides | Module accepts
caption: This is an illustration. Every value is a number with a tolerance and a named handover point; nothing reads "to suit site".
- Mechanical | in-feed conveyor delivering single packs, 300 mm wide | top of belt at 900 mm ± 10 mm above floor, packs flat, long edge leading
- Floor | slab level within 5 mm over the skid footprint, anchor points as drawn | skids on adjustable feet, 20 mm of adjustment
- Electrical | 400 V three-phase, 50 Hz, 63 A supply cabled to the cell's isolator | isolator on skid 2; the cell's own distribution inside
- Pneumatic | dry, filtered air at 6 bar, 400 normal litres a minute | regulator and filter at the inlet on skid 1
- Data | network connection to the site system at the control panel | line running, cell ready, cell stop request, counts and rejects
- * Safety | emergency stop circuit linked to the line, both ways | an emergency stop on either stops both; guard opening stops the cell only
- Environment | ambient 5–35 °C, dry area, no washdown | rated for the stated range
```

Two parts of the specification deserve more care than the others. The **data interface** is easy to underestimate because it is invisible. It must list each signal, its meaning and its direction: for example, the cell's stop request tells the line to stop feeding when the accumulation conveyor is full, and the line's running signal tells the cell to expect packs. If one site's line controller cannot send or receive one of those signals, the cell will run but the pair will not work together. The **safety interface** is a design decision with legal weight. Which stops in the cell must stop the line, and which stops in the line must stop the cell, follows from the risk assessment for the combined plant, carried out by competent people under the work health and safety laws and the AS/NZS 4024 series on machinery safety. The specification records the outcome so that every site connects the circuits the same way.

Interfaces are also where risks hide. [Finding project risks before they find you](/reados/collections/project-planning-and-control/finding-project-risks-before-they-find-you/) recommends testing the interfaces between parts of a project on purpose, because each side tends to assume the other is responsible. The interface specification is that test written down in advance.

## Variants: settings, not redesigns

Not every line packs the same case. This is an illustration. Nine of the twelve lines pack **format A**, 12 packs to a case, palletised 10 cases to a layer and 6 layers high. Three lines pack **format B**, a club-store case of 24 packs, palletised 5 cases to a layer and 6 layers high, 30 cases a pallet. At 120 packs a minute, a format-B line produces 5 cases a minute, so its pallet also takes 30 ÷ 5 = 6 minutes. Each pallet carries the same 720 packs and, at about 6 kg a case, about 180 kg of product, the same as format A's 60 cases at about 3 kg.

The tempting response is a second cell design for format B. The modular response is to ask which parts of the cell actually depend on the case, and to make those parts either adjustable or exchangeable. In the case, four things change between formats: the case magazine's guides, the packer's pick head, the robot gripper's fingers and the palletising pattern. The guides are made adjustable, with marked positions for both formats. The pick head and gripper fingers become a **change-part kit**, quick to exchange and identical for every format-B cell. The palletising pattern, the case size and the checkweigher's limits become a **recipe**, selected on the operator screen. The cell's frame, drives, controls, guarding and software are the same for both formats.

The integrator's price of A$470,000 a cell for the module's hardware, excluding GST, covers either format, and the kit's fitting time is booked to the kit, not to the cell's assembly hours. That keeps the assembly record of every cell comparable, which matters when the learning curve is fitted in Chapter 5.

## How much is common

Commonality is the share of the module's parts that are the same in every cell. It is worth measuring, because it is the quantity that design once, learn once and stock spares once depend on.

This is an illustration. The standard cell's parts list has 1,250 lines. Of those, 1,175 are identical in every cell, and 75 are the format-specific parts: the format-B change-part kit and the matching format-A parts it replaces. Commonality is 1,175 ÷ 1,250 = **94.0%**. The site-specific items, the in-feed conveyors, cables and anchors, are not on the module's parts list at all, because they sit outside the boundary.

```figure
type: stack
title: The standard cell's 1,250 part lines
unit: part lines
caption: This is an illustration. Commonality is 1,175 ÷ 1,250 = 94.0%. Site-specific items are outside the module and are not on its parts list.
- Common to every cell | 1175
- Format-specific change parts | 75
```

Commonality pays in more ways than purchasing. The spares stock for twelve cells is one stock, sized for the fleet. A technician trained on one cell can work on any other. A software fix tested on the pilot can be loaded on every cell. Each of these weakens as commonality falls, and none of them is visible in the price of one cell. That is why a site request that looks small, such as a different brand of controller or screen, should be judged against the fleet, not against the cell it applies to.

## Choosing where to draw the line

There is no formula for the boundary, but there is a test, applied to each part of the system in turn.

```figure
type: decision
title: Inside the module or outside it
question: Is this part the same on every line, apart from values that can be set?
caption: Parts that pass go inside and are designed once. Parts that fail stay with the site, behind an interface stated as numbers.
- * Yes, identical | Inside the module | designed, built and tested once
- Yes, with known variants | Inside, with recipes or change parts | variants listed and kept few
- No, but the connection can be fixed | Outside, behind a stated interface | site works meet the interface
- No, and the connection varies too | Outside, and reconsider the scope | a candidate for its own standard later
```

Two further questions refine the answer. Does including the part make the module hard to transport or install in three days? The skids must fit through each site's doors and on a truck. And does excluding it leave a hazard or an integration problem with the site? The safety controls stay inside, even though the circuits connect to each line, because a module whose safety depends on twelve different site designs is not a standard.

## What the boundary does to site work

The boundary also moves work from the factory floor to the workshop, and the case's costs show it. In the bespoke option, each cell's site cost is about **A$60,000**, excluding GST, because much of the mechanical, electrical and controls work is done in place, around a production line that has been stopped. In the modular option, the site cost falls to about **A$25,000** a cell: the in-feed section, the services to the stated handover points and the anchors, most of it done before the installation weekend while the line is still running. The remaining work in the shutdown is to set the skids, connect a handful of interfaces that have already been checked, and run the site acceptance test.

That shift only works if the site works are finished, and proved against the specification, before the line stops. A site that arrives at the installation weekend with its air supply untested or its network connection unpatched has turned a three-day installation back into an open-ended one. Chapter 7 treats the shutdown itself; the boundary's contribution is to make the site's share of the work small, defined and checkable in advance.

## The error: an interface that was not written down

This is an illustration. The first issue of the interface specification gave the in-feed height as "to suit the line". The design team had measured site A's lines, all within a few millimetres of 900 mm, and set the module's in-feed at that height. The site survey form, written from the specification, asked for power, air, floor and network details but not for the in-feed height, because the specification did not state one.

At site C, the lines discharge packs at **1,050 mm**, 150 mm higher than the module's in-feed. Nobody had measured it. The difference was found at site C's pre-installation check, ten weeks before its first installation, when the installer walked the route from the line to the cell's footprint with the layout drawing and noticed that the in-feed conveyor on the drawing was flat.

Two fixes were proposed. Raising the cell on plinths would have changed the operator's working heights, the guarding, the robot's reach to the top layer and the access steps, turning site C's cells into variants of the module. Lowering the packs on the site side kept the module standard: a declining conveyor section, inside the site works, takes the packs down 150 mm. At a gentle decline of 5°, it needs about 150 ÷ tan 5° ≈ **1,715 mm** of length, which the floor space allowed. The section cost about **A$14,000**, excluding GST, as a planned item. Found on the installation weekend instead, the cell could not have been connected: about two more lost production days at A$8,000 each and an urgent fabrication charge of about A$6,000 would have taken the cost to about **A$36,000**, with the cell standing idle.

The correction went further than the conveyor. The interface specification was reissued with the in-feed height as a number and tolerance, 900 mm ± 10 mm, and the survey form gained a row for every value in the specification, so that each site measures every interface and signs the result. The rule that came out of it is simple: an interface that is not stated as a number will be found by measurement at the worst possible moment.

```figure
type: checklist
title: Site survey against the interface specification
caption: This is an illustration. The open question is this chapter's error: the in-feed height had no number, so nobody measured it.
- Top of in-feed belt measured at the cell's in-feed point | 900 mm ± 10 mm required; site C measured 1,050 mm
- Slab level checked over the skid footprint | within 5 mm
- Supply capacity confirmed at the isolator location | 400 V, 63 A
- Air pressure measured at the inlet at peak site demand | 6 bar, 400 normal litres a minute
- Line controller can send and receive each listed signal | running, ready, stop request, counts
- x Values left as "to suit site" | each one is an unanswered question
- ? Who signs the survey, and who checks it against the specification | named before the survey starts
```

Because the specification is now a controlled document, a later change to any of its values, by a site or by the integrator, is a programme decision. Chapter 10, [Keeping the standard](/reados/publications/modular-projects-by-the-numbers/keeping-the-standard/), deals with how such changes are requested, judged and recorded.

## Exercise: a site's preferred controller

Site B asks for its four cells to use the controller brand already fitted to its lines, so that its electricians need learn only one system. The change would replace 95 of the 1,175 common part lines with site-B-specific parts, and the cell software would have to be rewritten and tested for the second controller, about 300 engineering hours at A$160 an hour. What happens to commonality, what is the direct engineering cost, and what is the better way to meet site B's concern?

**Worked answer.** Common part lines fall from 1,175 to 1,175 − 95 = 1,080, so commonality falls from 94.0% to 1,080 ÷ 1,250 = **86.4%**, and the fleet now has two control systems. The software rewrite costs 300 × A$160 = **A$48,000**, excluding GST, before counting a second spares stock, a second version of every future software fix and a second acceptance test. The controller is a hidden part of the module; what site B needs is a visible rule: a defined data interface to its line controllers, which the specification already provides, plus training for its electricians on the standard cell. The request should be declined, with the training offered, and recorded so that the next site asking the same question gets the same answer.
