---
book: machine-part-repairs-by-the-numbers
chapterSlug: cast-housings
order: 8
title: "Cast housings and casings"
description: "Repair cracked cast-iron and aluminium housings: why uneven heating cracks cast iron, hot and cold welding methods, braze welding and metal stitching, and checking bores and tightness afterwards."
draft: false
---

Gearbox housings, pump casings, engine blocks, bearing housings and machine frames are often castings, of grey cast iron or aluminium alloy, and when they crack, the repair is one of the most demanding a repair shop does. Willis wrote in 1917 that probably about three-quarters of the welding in a custom repair shop was the welding of castings, and the early manuals were full of methods for cracked cylinders, crank cases and gear cases: brick furnaces, charcoal fires, slow cooling in ashes or lime. Castings are fewer in a modern repair shop's work, but they are no easier.

This chapter explains why cast iron cracks when heated unevenly, compares the main repair methods, from hot welding to metal stitching, deals briefly with aluminium housings, and sets out how bores and tightness are checked after repair. Weldability by the Numbers covers the metallurgy of cast iron welding in its chapter on [cast iron, graphite, silicon and repair](/reados/publications/weldability-by-the-numbers/cast-iron-graphite-silicon-and-repair/); this chapter concentrates on the housing as a machine part.

## Why cast iron cracks

Grey cast iron is strong in compression but weak and brittle in tension, with little ability to stretch before it breaks. When part of a casting is heated, it tries to expand, and the cooler metal round it holds it back, so the hot part is squeezed and the cold part is pulled. On cooling, the reverse happens. A thermal stress of roughly E × α × ΔT arises wherever one part of the casting is much hotter than its neighbours.

```figure
type: formula
title: Thermal stress from uneven heating of a cast-iron housing
formula: σ ≈ E × α × ΔT
caption: This is an illustration with approximate values for grey cast iron. The tensile strength of grey irons varies widely by grade; the point is that a local temperature difference of a couple of hundred degrees can produce stresses comparable to it.
- E, grey cast iron, about | 100 GPa
- α, about | 11 × 10⁻⁶ /°C
- ΔT between the hot area and the casting round it | 200 °C
step: σ ≈ 100,000 MPa × 11 × 10⁻⁶ × 200
step: σ ≈ 220 MPa, comparable to the tensile strength of many grey irons
```

That is why the early repairers heated whole castings slowly in fires and furnaces before welding them, and cooled them slowly afterwards: a casting heated uniformly expands uniformly and carries little thermal stress, while one heated at a single spot with a torch can crack again beside the weld, or somewhere else entirely.

## Before repairing

A cracked housing is examined first for the cause, as Chapter 2 described: a crack across a mounting lug may point to a loose bolt or a misaligned mounting; a crack from a bearing bore to an edge may point to an overloaded bearing or an over-tight fit; a crack in a water jacket to freezing. The crack's full length is found, often with dye penetrant, because cracks in cast iron run further than they appear. The ends are often drilled with small holes, a common practice to blunt the crack tip so that it does not run further during repair. The casting is cleaned thoroughly, and oil-soaked castings, such as gearbox housings, are degreased and heated gently to drive oil out of the porous iron near the crack, because oil in the metal boils into the weld as porosity.

## The repair methods

```figure
type: compare
title: Methods of repairing a cracked cast-iron housing
cols: How | Strengths | Limits
caption: General characteristics. The casting's size, shape, duty, distance of the crack from bores and machined faces, and the repairer's skill decide the method.
- Hot fusion welding | whole casting preheated slowly to a high temperature, welded with cast-iron filler, cooled very slowly | weld similar in colour and properties to the casting | needs a furnace; distortion and scaling of machined faces
- Cold arc welding | little or no preheat; nickel-based electrodes; short beads; peening | no furnace; little distortion | hard zones at the fusion line; skill; cracks if beads are long
- Braze welding | copper-based filler; casting not melted; moderate preheat | lower heat; less cracking | lower strength at temperature; colour mismatch
- *Metal stitching | crack drilled and tapped or slotted; locks and studs fitted cold | no heat at all; no distortion | specialist method; mainly for thicker sections
- Bonding or patching | adhesives or bolted patches for non-structural leaks | simple | not for load-bearing cracks
```

**Hot fusion welding**, the method of the early manuals, heats the whole casting slowly, often to several hundred degrees, welds it with a cast-iron filler, and cools it very slowly over many hours. Done well, it produces a repair close to the casting in properties and machinability. It needs a furnace or an insulated enclosure large enough for the casting, and it can distort the casting and scale its machined faces.

**Cold arc welding** uses nickel or nickel-iron electrodes, whose weld metal is ductile enough to stretch as it cools rather than cracking the casting. The beads are short, perhaps 25 to 50 mm, each peened lightly while hot to relieve shrinkage stress, and the casting is allowed to cool to near hand-warm between beads, so that it never gets hot enough for large thermal stresses to build up. It is slow and needs skill, but it avoids distortion and needs no furnace. Its weak point is the narrow, hard zone at the fusion line, where the cast iron melted and cooled quickly; beads are kept small to keep that zone thin, and the first layer is sometimes laid as a buttering layer before the joint is filled.

**Braze welding**, with copper-based fillers that melt below the cast iron, puts less heat into the casting and suits thinner sections and parts that must not distort.

**Metal stitching** uses no heat at all. Holes are drilled along and across the crack, and shaped locks of a strong, ductile metal are driven into slots across the crack to pull it closed, with tapped studs along the crack itself to seal it. It is a specialist process, often carried out by firms that do nothing else, and it is particularly useful for large castings and cracks near machined bores, where any heat would distort them.

## Heat and the size of the casting

Hot repairs need a great deal of heat, and the numbers explain why they take so long. This is an illustration. A gearbox housing of about 45 kg of cast iron, with a specific heat of about 500 J/(kg·°C), heated from 20 °C to 600 °C needs about 45 × 500 × 580 ≈ **13 MJ**, before losses. And as it heats, it grows: a bore spacing of 400 mm grows by about 400 × 11 × 10⁻⁶ × 580 ≈ **2.6 mm**. Heating must be slow and even, so that no part runs far ahead of another, and the casting must be supported so that it can expand freely without sagging or binding. Cooling must be slower still. A hot repair of a large casting is a two-day job, most of it waiting.

## Aluminium housings

Aluminium alloy housings, common on modern machinery and vehicles, are repaired by tungsten arc or metal arc welding with aluminium fillers. They do not crack from thermal stress as readily as cast iron, because aluminium is ductile, but they bring problems of their own: a tenacious oxide film, high heat conductivity that draws heat away from the weld, porosity from hydrogen and from oil soaked into the casting, and loss of strength in heat-treated alloys near the weld. Weldability by the Numbers explains these in its chapter on aluminium. Thorough degreasing, preheating heavy sections moderately, and a filler matched to the casting alloy are the basics.

## Bores and faces after repair

A housing exists to hold bearings, shafts and seals in the right places, and a repair that leaves a bore out of position or a face out of flat has failed even if the crack is sealed. After any repair near a bore or a machined face, the repairer checks:

- **bore diameters and roundness**, against the bearing maker's fit;
- **bore alignment**, with a mandrel or a line-boring bar through bores that share a shaft, or by measurement on a surface plate;
- **bore centre distances**, for gear shafts, against the gear set's requirement;
- **flatness of joint faces**, so that covers and gaskets seal.

Where the repair has moved a bore, the usual correction is line boring and fitting a sleeve or a bearing carrier, or reworking the face, which is why repairs close to bores are often done by methods that put in little or no heat.

## Testing for tightness

Housings that hold oil, coolant or pressure are tested for leaks after repair: by pressure testing with air or water at a pressure the procedure sets, by a penetrating dye or oil test on the outside of the repair, or by running the machine and watching. Dunham described testing repaired cylinder water jackets by filling them with water through a reducing valve, closing the outlet and looking for leaks at cracks and porous places. Porous cast iron near a repair can weep oil even when the weld itself is sound, which is one reason the casting is degreased and baked before repair.

## Housings that should be replaced

Not every cracked housing is worth repairing. Cracks that run through a bearing bore, a gear-mesh region or a sealing face; cracks in housings that carry pressure, such as hydraulic pump bodies, where the maker forbids repair; multiple cracks from an overload that has also distorted the casting; and housings of safety-critical assemblies such as steering boxes are usually replaced. So are cheap, mass-produced castings, whose replacement costs less than a careful repair. The repair decision of Chapter 1 applies: a housing repair is slow and skilled, and its cost and risk are weighed against a new casting and the downtime.

## Fixing the mounting

Many housing cracks begin at mounting lugs and feet, because the housing is being asked to carry loads it was not designed for: a loose bolt that lets it rock, a frame that twists under load and bends the housing with it, a mounting face that is not flat so that tightening the bolts pre-stresses the casting. Repairing the crack without dealing with the mounting invites the same crack again. The repairer checks the mounting face for flatness, uses shims where the maker allows, replaces bolts that may have stretched, tightens them to the maker's figure, and considers whether a stronger bracket or an extra mounting point is needed, in consultation with the owner and, for anything structural, the maker.

## The cost and time of a casting repair

This is an illustration. The metal stitching of the gearbox housing cost the repairer about A$1,100 from the specialist, excluding GST, plus about four hours of its own time for dismantling, cleaning, measuring and reassembly, against about A$3,600 and six weeks for a new housing. A hot repair in-house would have needed about two days of furnace time and welding, with the risk of distorting the bore. The comparison followed the pattern of Chapter 1: the repair won on downtime as much as on price, and the method was chosen to protect the bore.

## The running case: the gearbox housing

This is an illustration. A harvester's cast-iron gearbox housing had cracked from a mounting lug about 120 mm towards a bearing bore, after one of its mounting bolts had worked loose and let the housing flex on its frame. The crack stopped about 20 mm from the bore. The housing was about 45 kg, oil-soaked, and its bores held the shafts of a gear set that needed accurate centre distances.

The repairer judged that any significant heat would risk distorting the nearby bore, and that hot welding in a furnace would also scale the machined faces. It sent the housing to a metal stitching specialist, who stitched the crack cold, sealed it and pressure tested it. Back in the shop, the bore was measured and found unchanged. The mounting bolt holes were checked, the bolts replaced and tightened to the maker's figure with thread locking, and the frame's mounting face checked for flatness.

## A failure: the torch on the crack

This is an illustration. A farmer, trying to save time, had once tried to weld a crack in a cast-iron pump casing himself, playing an oxy-acetylene flame on the crack until it glowed and running filler into it. When the casing cooled, a new crack had opened beside the weld, longer than the first.

The local heating had made exactly the thermal stress calculated in this chapter: the glowing spot had expanded against the cold casing round it and, on cooling, had been pulled apart by it. The casing was repaired properly by cold arc welding with short nickel beads, peened, with the casing kept near hand-warm, and held. The farmer's attempt cost a second crack and a longer repair.

## Exercise: short beads

A cold arc repair of a 300 mm crack is to be made in beads of 40 mm, each followed by peening and a pause until the casting is hand-warm, about 4 minutes. If each bead takes about 30 seconds of arc time, how many beads are needed for one layer, and how long will the layer take? What does this say about quoting such repairs?

A 300 mm crack needs about 300 ÷ 40 ≈ **8 beads** for one layer. Each bead takes about 0.5 minutes of arc time plus about 4 minutes of peening and cooling, about 4.5 minutes, so one layer takes about 8 × 4.5 ≈ **36 minutes**, of which only 4 minutes is arc time.

A groove deep enough to need three or four layers would take two hours or more of welding, plus preparation, drilling the crack ends, degreasing and finishing. The repair is slow because it must be, and a quote based on the arc time alone would be wrong by a factor of ten.
