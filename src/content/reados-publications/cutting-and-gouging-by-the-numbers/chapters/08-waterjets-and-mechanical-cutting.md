---
book: cutting-and-gouging-by-the-numbers
chapterSlug: waterjets-and-mechanical-cutting
order: 8
title: "Waterjets, saws and shears"
description: "Cut without heat: how an abrasive waterjet erodes steel, what its hour and metre cost, when its cold edge is worth the price, and how saws, shears, punches and drills compare for their work."
draft: false
---

Every thermal cut heats the edge it leaves. For most work that does not matter, but for some it is decisive: quenched and tempered wear plate that softens if heated, heat-treated tool steels, titanium and nickel alloys that heat contaminates, parts that must not distort at all, and materials that do not conduct or that burn, such as composites, rubber, stone and glass. For those, the cut must be cold. The abrasive waterjet is the cold equivalent of a profile cutter; saws, shears, punches and drills are the cold tools for sections, straight cuts and holes. They are slower or more limited than the thermal methods, but they leave the material as it was.

This chapter explains how an abrasive waterjet cuts, builds its hourly and per-metre cost, compares it with the thermal methods, and surveys the mechanical methods and where each fits.

## How a waterjet cuts

A waterjet cutter pumps water to a very high pressure, typically several thousand bar, and forces it through a tiny jewel orifice, forming a thin jet moving at several times the speed of sound. A pure water jet cuts soft materials such as rubber, foam and food. For metals, abrasive is added: fine garnet sand is drawn into the jet in a mixing chamber just below the orifice, accelerated by the water, and focused through a hard mixing tube onto the work. The abrasive particles erode the material, chipping away tiny pieces as they strike, and the jet carries them through the kerf. The cut is cold, because the water carries away the little heat the erosion produces, so the edge has no heat-affected zone, no hardened layer and no distortion from heat.

## Speed and taper

A waterjet cuts slowly in steel, and its speed falls steeply with thickness, because the jet loses energy as it passes through the material. As it slows in the lower part of the cut, it lags behind the head, curving the cut's path, and the kerf narrows towards the bottom, leaving a slight taper and, at higher speeds, striations on the cut face. Slower speeds give better edges; modern machines tilt the head automatically to compensate for taper and lag, making nearly square cuts at good speeds. Cut quality is often specified as a quality level from the machine's software, from a rough separation cut to a fine finish, each with its own speed.

## The hourly rate

```figure
type: formula
title: Hourly cost and cost per metre of abrasive waterjet cutting in 12 mm steel
formula: cost per metre = (machine + operator + abrasive + power + wear parts per hour) ÷ metres cut per hour
caption: This is an illustration for teaching, in Australian dollars excluding GST: a machine share of about A$40 an hour; an operator at A$72; garnet at about 0.4 kg a minute and A$0.60 a kg; a high-pressure pump of about 37 kW at A$0.25 per kWh; and orifices, mixing tubes and seals at about A$10 an hour. Speed about 130 mm/min for a fabrication-quality cut.
- Abrasive | 0.4 × 60 × 0.60 ≈ A$14.40 an hour
- Power | 37 × 0.25 ≈ A$9.25 an hour
- Total | 40 + 72 + 14.40 + 9.25 + 10 ≈ A$146 an hour
step: metres per hour = 130 × 60 ÷ 1,000 ≈ 7.8 m
step: cost per metre ≈ 146 ÷ 7.8 ≈ A$18.70
step: about nineteen times plasma's cost per metre on the same plate
```

The waterjet's hour costs about the same as a plasma table's; its metre costs many times more, because it cuts so slowly. Abrasive is its largest running cost after labour, and it all ends up as sludge in the catcher tank, which must be removed and disposed of.

```figure
type: bars
title: Illustrative cost per metre of 12 mm mild steel by method
unit: A$ per metre, excluding GST, cutting only
max: 20
caption: This is an illustration from the rates in Chapters 6 and 7 and this chapter. Pierces, finishing and the value of a cold edge are not included.
- Plasma, 200 A | 0.99
- Fibre laser, 6 kW, oxygen | 1.70
- Oxy-fuel, one torch | 4.06
- *Abrasive waterjet | 18.70
```

## When the cold edge is worth it

The waterjet earns its price where heat would damage the part or require costly work afterwards. Quenched and tempered wear plate, used for chutes, liners and buckets in the running case's mining work, loses hardness in a band along a thermal cut, and for some parts, such as wear liners whose edges take the wear, that soft band matters. Thin parts that must stay flat, parts with many closely spaced features that would distort under heat, and parts in titanium, nickel alloys or stainless where heat tint and contamination must be avoided are all cut by waterjet when quality outweighs cost. So are non-metals: rubber, plastics, composites, stone, glass and ceramics, which no thermal process cuts well.

The waterjet also pierces without heat, cuts very thick sections of almost anything given time, and cuts stacks of thin sheet at once. Its accuracy is good, its edge needs little finishing, and it leaves no hardened layer to blunt the drills and taps of the next operation.

## Wear plate and the soft band

Thermal cutting heats the edge of quenched and tempered plate above the temperature at which it was tempered, softening a band along the cut, and can harden a thin layer right at the edge as it cools. Plate makers publish guidance on thermal cutting their plates, including the width of the affected band for each process and thickness, and preheat for flame cutting thick plate to avoid cracking. For most wear plate parts, plasma or oxy-fuel cutting following the maker's guidance is entirely adequate; the affected band is narrow, and the part's wearing face is the plate's surface, not its edge. For parts where the edge must keep its full hardness, or for small parts where the band is a large share of the part, the waterjet is used. The service centre sent about 5% of its plate, mostly wear plate for edge-critical liners, to the subcontractor's waterjet for that reason.

## Waterjet hazards and upkeep

The waterjet's jet can cut flesh as easily as rubber, and a jet that escapes from a burst high-pressure line or strikes a hand under the nozzle causes injuries that look small at the skin but carry water and abrasive deep into the tissue; they need urgent medical attention even when they seem minor. Waterjet machines guard the cutting area, interlock the head, and keep the high-pressure plumbing behind covers; maintenance on the high-pressure circuit is done only with the pump stopped and the pressure released. The pump's seals, check valves and the orifice and mixing tube wear steadily and are replaced on schedule, because a worn mixing tube widens the jet and spoils the cut. The catcher tank fills with spent abrasive and swarf, which is dug out and disposed of, and the water is filtered or replaced. Noise from the jet striking the tank is reduced by cutting with the plate just under the water's surface.

## Stacking and nesting on the waterjet

Because the waterjet's speed is low, every saving in cut length matters. Nesting parts to share cut lines, cutting thin sheets in stacks so that one pass cuts several, and choosing the lowest acceptable quality level for edges that will be machined or hidden all reduce its cost per part considerably. The subcontractor that cut the service centre's liners stacked thin rubber sheets five deep and cut wear liners with common lines wherever the shapes allowed, which cut its time on the centre's work by about a fifth.

## Combining cold and hot methods

Some parts are cut with both: a plasma or oxy-fuel cut for most of the profile, where the edge is not critical, and a waterjet or machining for the edges or features where heat would harm the part. A wear liner might be plasma cut slightly oversize all round and its wearing edge then waterjet trimmed, or machined, to remove the softened band, saving most of the waterjet's time. The service centre used that approach for its largest liners, where the waterjet's slow speed over the full perimeter would have made them too dear.

## Saws

Band saws and circular cold saws cut sections, bar, tube and solid blocks square and cold, with a narrow kerf and no heat-affected zone. They are slow by the square millimetre compared with thermal cutting of plate, but for sections they are fast, accurate and cheap, and they leave a square, clean end ready for welding or machining. A band saw cuts a 150 mm steel beam in a few minutes; a cold saw cuts bar and tube faster still. Saws also cut stacks of bar and tube at once. The service centre's band saws cut all of its sections and bar, while its plasma table cut only plate and its shear cut the simple strips.

## Saw blades and cutting rates

Saws have their own arithmetic. A band saw's cutting rate in steel is limited by the blade's tooth pitch, speed and feed, and by the section's size and shape; a blade dulled by hard material, such as a thermally cut edge or a work-hardened section, cuts slowly and wanders, giving out-of-square ends. Blade life is measured in square metres of section cut, and the cost per cut includes a share of the blade, the saw's time and the operator's. The service centre tracks blade life by the material cut, and changes blades before they wander, because a cut that is a few degrees out of square costs the fabricator downstream far more to correct than a blade.

## Shears and punches

Guillotine shears cut sheet and plate up to their capacity, often around 10 to 16 mm in mild steel for a heavy shop shear, in a straight line, almost instantly, with no kerf and no heat. For straight cuts of strips, squares and blanks within the shear's capacity, nothing in the shop is faster or cheaper, and a skilled operator with a good back gauge cuts blanks to a fraction of a millimetre, one after another, all day. The sheared edge has a small burr and a band of deformed metal, acceptable for most fabrication. Punching presses, including CNC turret punches, punch holes and shapes in sheet very quickly, and ironworkers punch, shear and notch plate and sections in fabrication shops. Their limit is the thickness of the material relative to the hole, and the force needed.

```figure
type: compare
title: Mechanical cutting methods
cols: Best for | Limits
caption: General characteristics for teaching. Machine capacities depend on the material's strength and thickness.
- Band saw | sections, bar, tube; square cuts; stacks | slow on large solid sections; straight cuts only
- Cold circular saw | bar and tube in quantity; very square, fast | limited section size
- *Guillotine shear | straight cuts in sheet and plate | thickness limit; straight lines only; small burr
- Punch and ironworker | holes, notches, copes in sheet, plate and sections | hole at least about the plate's thickness; force limits
- Drill and tap | accurate holes and threads | one hole at a time; slow in thick plate
- Abrasive cut-off wheel | small cuts on site and in the shop | dust, noise, sparks; wheel hazards
```

## Drilling holes

For bolt holes that must be accurate, round and square to the plate, drilling remains the standard, either after thermal cutting the outside of the part or on a combined machine that drills and cuts on the same table. Many plate cutting machines now carry a drilling head alongside the plasma or oxy-fuel torch, drilling the holes and then cutting the profile in one set-up. Holes drilled in plate that has been thermally cut nearby are unaffected; holes drilled through a hardened thermal cut edge can blunt the drill, which is why holes are drilled before the profile is cut, or away from cut edges.

## Abrasive wheels on site

Hand-held abrasive cut-off and grinding wheels are the commonest cutting tools on site, cutting bolts, bar, sheet and small sections and cleaning gouged grooves. They are cheap and versatile, but noisy, dusty and dangerous: a wheel that shatters, or one used on its side when it is designed for cutting with its edge, can cause severe injury. Wheel speed ratings, guards, the right wheel for the job and eye and face protection are essential, and Chapter 10 covers the noise and dust.

## The running case: the waterjet subcontract

This is an illustration. The service centre's waterjet work, about 70 tonnes a year of wear plate liners and some rubber and composite parts for mining customers, was cut by a subcontractor at about the cost per metre in this chapter. The manager considered buying a waterjet, but the volume would have filled only a few hundred hours a year, far too few to justify its capital and the space for its pump and catcher tank. Subcontracting stayed cheaper, and the centre negotiated a schedule with the subcontractor that met its customers' lead times.

## A failure: the hot-cut liner

This is an illustration. A fabricator elsewhere cut small wear liner tiles from quenched and tempered plate with oxy-fuel to save the cost of a waterjet. The tiles were small enough that the softened band along their edges made up a large share of each tile, and in service the edges wore away quickly, leaving the tiles undercut and loose.

Recut by waterjet, the next set of tiles wore evenly across their faces. The fabricator now checks the plate maker's guidance on heat-affected band width before choosing a thermal method for small wear parts.

## Exercise: waterjet or plasma for wear liners

A set of wear liners in 16 mm quenched and tempered plate has 120 m of cut. A waterjet cuts it at about 95 mm/min at A$146 an hour; plasma at about 1,800 mm/min at A$149 an hour, after which each metre of edge must be ground back to remove the softened band, at about A$4.50 per metre. What does each cost?

The waterjet cuts at about 5.7 m an hour, so 120 m takes about 21 hours and costs about 21 × 146 ≈ **A$3,070**.

Plasma cuts at about 108 m an hour, so 120 m takes about 1.1 hours, about A$165, plus 120 × 4.50 = A$540 of grinding, about **A$705** in all. Plasma with edge grinding is far cheaper, provided grinding removes enough of the softened band for the liners' service. Where the band is too wide to grind away, or the parts too small to grind economically, the waterjet's cold edge is worth its price.
