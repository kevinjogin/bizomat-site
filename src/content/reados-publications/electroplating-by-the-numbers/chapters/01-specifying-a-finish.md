---
book: electroplating-by-the-numbers
chapterSlug: specifying-a-plated-finish
order: 1
title: "Specifying a plated finish"
description: "Decide what a plated coating is for, how a plating line produces it and what a drawing or order must state so the finish that arrives is the finish that was intended."
draft: false
---

A plated finish is usually specified in two or three words and delivered after a dozen process steps, each of which can change the result. When the words are vague, the plater has to choose the coating thickness, the passivate, the surfaces that matter, where the contact marks go and whether the parts are baked, and each choice is made to suit the plater's line rather than the part's service. The finish that arrives may be perfectly made and still wrong.

This chapter sets out what plating is for, what a plating line does and what a specification has to say. It introduces the running case, a batch of zinc-plated brackets, and shows how a two-word drawing note produced the wrong result.

## What plating is for

The 1917 treatise sorted plated metals by purpose, and the sorting still works. Gold and silver were used mainly for appearance, zinc mainly for protection, and nickel for both. Each metal capable of being deposited, it noted, had some property that gave it a use. Modern practice adds functional coatings to the list.

- **Protection.** Zinc and zinc alloys on steel corrode in preference to the steel, protecting it sacrificially, as Chapter 8 explains.
- **Appearance.** Nickel, chromium over nickel, brass, gold and silver give bright, durable decorative surfaces.
- **Function.** Hard chromium for wear resistance, tin for solderability, silver and gold for electrical contact, copper as an underlayer or for conductivity, nickel as a diffusion barrier.

The purpose decides almost everything else. A sacrificial zinc coating is specified mainly by its thickness and supplementary treatment; a decorative nickel and chromium system by its layers and appearance; a functional coating by the property it must deliver, such as hardness or contact resistance. A specification that does not state the purpose leaves the plater to guess it.

## What a plating line does

A plated part passes through a sequence of tanks. The details vary with the metal and the coating, but the outline is common to almost every line.

```figure
type: steps
title: A typical zinc plating sequence
caption: Every arrow between process tanks includes a rinse, because carrying one solution into the next spoils both. The bake applies only to parts at risk of hydrogen embrittlement.
- Load | parts racked or placed in a barrel
- Clean | hot alkaline cleaning removes oils and soils
- Pickle | acid removes rust, scale and oxide films
- *Plate | zinc deposited by direct current
- Passivate | conversion coating for corrosion resistance and colour
- Dry and unload | parts inspected and packed
- Bake if required | embrittlement relief, Chapter 7
```

The 1917 treatise describes the same core. Oils and grease were removed in hot alkaline solutions, oxides in acid pickles, each metal having its own preferred pickle, and the work was then suspended in the plating tank. It also describes a development that changed the economics of plating small parts: the rotating plating barrel. Where small articles would otherwise have to be strung on wires one by one, a barrel full of them could be tumbled in the solution and plated in bulk.

## Rack or barrel

That choice between rack and barrel is still the first decision a plater makes about a part.

```figure
type: compare
title: Rack plating and barrel plating
cols: Rack | Barrel
caption: Small, robust parts usually go in barrels; larger, delicate or appearance-critical parts go on racks. The specification may need to say which marks and finishes are acceptable.
- Suits | larger parts, appearance surfaces, delicate parts | small, robust parts in bulk
- Labour | each part hung and removed | parts loaded and tipped in bulk
- Contact marks | at each rack contact point | none, but parts rub together
- Thickness spread | set by geometry and racking | wider spread; averages lower
- *Typical uses | brackets, panels, housings | screws, nuts, washers, clips
```

This is an illustration. The workshop's 4,000 brackets are each about 120 × 80 mm with a formed channel, large enough to tangle in a barrel and with faces that will be seen, so the plater proposes rack plating at 40 brackets a rack, or 100 racks for the order. The 400 hardened spring clips that join the case in Chapter 7 are small and robust and would normally be barrel plated.

## What a specification must say

A coating standard does much of the work, because it defines coating classes, test methods and the information the purchaser must supply. In Australia, batch zinc electroplating on iron and steel is covered by AS/NZS 1789:2023, which adopts ISO 2081:2018 with modifications and includes the information to be supplied by the purchaser and requirements for heat treatment before and after plating. Electroplated steel fasteners have their own standard, ISO 4042. ISO 2081 itself changed in 2025: the new edition is limited to zinc with supplementary treatments containing hexavalent chromium, so a specification that cites "ISO 2081" without an edition may now point to something different from what was intended. The requirements themselves must be read from the current edition of whichever standard is called up.

Whatever standard is used, the specification has to supply the decisions that only the purchaser can make.

```figure
type: checklist
title: What a plating note must state
caption: Each line is a decision the purchaser owns. Leaving any of them out hands it to the plater.
- x Coating and standard | zinc, AS/NZS 1789:2023 (or the edition specified)
- x Minimum local thickness | 8 µm on significant surfaces
- x Significant surfaces | marked on the drawing
- x Supplementary treatment | trivalent passivate, stated colour
- x Embrittlement relief | required or not, by part hardness and strength
- x Contact marks | where they are acceptable
- x Inspection | thickness method, locations, sampling
- *? Threads and fits | allowances for coating on toleranced features
```

Two of those decisions need more explanation.

**Minimum local thickness.** A plated coating is never uniform, as Chapter 5 shows. A specification that gives an average thickness, or a thickness without saying where, allows thin coating in exactly the places where corrosion starts. Modern zinc standards specify a minimum local thickness, measured on significant surfaces.

**Significant surfaces.** Coating standards use this term for the surfaces on which the coating is essential to the part's appearance or service. Some standards help define them by accessibility, for example whether a ball of stated size can touch the surface, but the reliable way is to mark them on the drawing. Deep recesses, internal bores and inaccessible faces often cannot reach the minimum thickness economically, and a specification that demands it everywhere either cannot be met or costs far more than intended. Marking the significant surfaces on the drawing is the purchaser's job.

## Coating thickness and fit

A coating adds material to every plated surface, and on toleranced features that can matter.

- **Holes.** A coating of 8 µm reduces the diameter of a hole by about 2 × 8 = 16 µm, if the coating reaches inside it. Bores usually plate thinner than open faces, so the effect is often less, but it cannot be assumed to be zero.
- **External diameters.** A shaft gains about 16 µm in diameter.
- **Threads.** On a 60° screw thread, coating on the flanks moves the pitch diameter by about four times the coating thickness, because each flank is inclined at 30° to the thread axis. An 8 µm coating can therefore increase the pitch diameter of an external thread by about 32 µm, which is enough to stop a tight-tolerance thread assembling. Fastener standards deal with this by specifying thread tolerances or allowances for coated threads, and the scope of ISO 2081 itself notes that dimensional requirements can limit the coating thickness on threaded parts.

A drawing that specifies both a fit and a plating needs to say whether the dimensions apply before or after plating.

## What the plater controls

Between the specification and the coating lies the plater's process, and the 1917 treatise listed the levers clearly. A plater, it said, could govern the quality of a deposit through how strong the solution was and what it contained, how much current each unit of area carried, how warm the bath was and what impurities it held. It also described a then-recent advance: small additions of substances such as glucose or gelatin to a plating solution could change the deposit profoundly. Modern baths use proprietary brighteners, levellers and grain refiners for the same purpose, and their concentrations are controlled as closely as the main chemicals.

None of these levers is visible to the purchaser, and a specification should not try to dictate them. What it should do is state the result required clearly enough that the plater can choose the levers, and ask for evidence that the process is under control, such as bath analysis records, rectifier logs and thickness measurements on production parts.

## Plating does not hide a poor surface

One observation in the treatise surprises many engineers today. During electroplating, it said, a surface almost always becomes rougher, not smoother, and irregularities are accentuated rather than covered. A smooth plated finish needs a smooth surface to start from, and grinding and polishing before plating are as important as finishing afterwards. It identified that mechanical work as the most costly part of the plating trade.

Modern bright and levelling baths can smooth a surface to some extent, but the principle still holds for ordinary zinc on steel. Burrs, laser-cut dross, weld spatter, deep scratches and rolled-in scale all show through the coating, and sharp burrs attract extra current and grow nodules of zinc, as Chapter 5 explains. The specification therefore needs a partner on the drawing: a statement of the condition the parts must be in when they reach the plater, such as deburred, free of spatter and free of oil. The plater cleans and pickles the surface, but it cannot remove a burr.

## First articles and acceptance

A complete note is still only words until the first parts are made to it. A first-article inspection, agreed before production, turns the specification into evidence: thickness measured at stated points, including at least one in the most difficult significant area; passivate colour compared with an agreed sample; adhesion checked by a stated method; appearance judged against stated criteria; and the plating parameters recorded. The plater's record of current, time, area and bath condition for the first-article rack becomes the reference for every later rack, and Chapter 10 builds it into a plating record.

## Changes after approval

A finish that has passed first-article inspection can still drift if the process behind it changes. Platers change chemical suppliers, replace a passivate with a new formulation, move a part from rack to barrel to free a line, or alter a cleaning cycle. Each change may be sensible and still alter the coating's thickness, colour, corrosion resistance or effect on the steel. A specification for parts that matter should therefore require the plater to notify the purchaser of changes to the coating system, the process route or the plating location, and to repeat the relevant first-article checks before shipping parts made the new way. The same principle governs any controlled manufacturing process; plating is simply a process where the change is invisible to the eye.

## The running case

This is an illustration. The bracket drawing's first revision carried a single note: "zinc plate". The workshop's buyer sent it to a plater with the order quantity and a request for a price. The plater quoted the line's standard commercial finish and plated the first 500 brackets.

When they arrived, incoming inspection measured the zinc with a magnetic gauge on the flat faces and found readings of about 3 to 5 µm, with a clear passivate. The plater had done exactly what was asked: zinc, plated well, at the thickness the line normally applies to parts sold without a specification. The brackets were to be mounted in a sheltered outdoor location, and Chapter 8 shows that a coating of that thickness could be consumed in a few years there. Nothing in the drawing told the plater so.

## A failure: the two-word note

The failure was not in the plating but in the specification, and it was detected only because the workshop measured the coating at incoming inspection. Had the brackets gone straight to assembly, the first sign would have been red rust in service.

The correction had three parts. The drawing note was rewritten to the checklist above, with AS/NZS 1789:2023 cited, 8 µm minimum on significant surfaces, the significant surfaces marked, a trivalent passivate of stated colour, rack marks permitted only on the inside of the channel and embrittlement relief stated as not required for the mild steel brackets. The plater was asked to confirm, before plating the remaining 3,500, how the minimum would be achieved in the channel recess, which led to the thickness-distribution work in Chapter 5. And the first 500 were stripped and replated, at a cost that a complete note would have avoided.

## Health, safety and the choice of plater

Electroplating uses corrosive, toxic and in some cases carcinogenic chemicals, high currents and heavy plant. Safe Work Australia's guide to controlling the risks associated with electroplating covers the chemical, electrical, plant, noise and manual-handling hazards, and applies also to anodising, electroless plating and other metal finishing. A purchaser does not run the plater's line, but choosing a plater is partly a choice about how well those risks and the plater's wastes are managed. A plater who can show its controls, its trade-waste approval and its process records is usually also the plater whose coatings can be relied on, because the same discipline produces both.

## Exercise: completing the bracket note

The bracket has a 10.0 mm clearance hole for an M10 bolt, toleranced at 10.0 to 10.2 mm, and a pressed-in M8 stud whose thread is plated with the bracket. Write the elements of a complete plating note, then estimate the effect of an 8 µm coating on the hole and on the stud's pitch diameter.

The note should state the coating and standard (zinc to AS/NZS 1789:2023), the minimum local thickness (8 µm) on marked significant surfaces, the trivalent passivate and colour, that embrittlement relief is not required for the mild steel bracket, where rack marks are acceptable, how thickness will be inspected and that dimensions apply after plating unless stated otherwise. The hole, if fully coated, shrinks by about **16 µm**, from 10.0 to about **9.984 mm** at its smallest, which is slightly below the lower limit; either the tolerance should state "after plating" with the hole drilled larger, or the hole should be shown as not significant and allowed to plate thinner. The stud's pitch diameter could grow by about 4 × 8 = **32 µm**. Whether that matters depends on the thread tolerance class, and the note should require the stud's thread to suit plating or be masked.
