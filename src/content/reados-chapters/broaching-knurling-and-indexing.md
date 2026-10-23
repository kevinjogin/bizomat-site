---
title: "Specialised machining operations: broaching, keyways, splines, knurling and indexing"
description: "How keyways, splines, hexagon holes, knurls and evenly spaced features are made, when broaching pays, the CNC alternatives and the design details that keep these features economical."
publishDate: 2026-10-16
category: "Manufacturing"
tags:
  - manufacturing
  - design
  - process-improvement
author: "KEVOS"
featured: false
draft: false
---

Most machined features are made by drilling, turning and milling. A smaller group of features needs something different: the keyway in a pulley bore, the internal spline in a gear hub, the hexagonal socket in a fastener, the knurled grip on a knob and the evenly spaced holes or slots around a flange. These features look minor on a drawing, yet they often decide how a part is made, how long it takes and whether it can be produced in-house at all. A single internal keyway can turn a simple turned part into a job that needs a slotting machine, a broach, wire erosion or a specialist subcontractor.

Understanding how these features are produced helps designers specify them sensibly, helps workshops choose economical methods and helps buyers understand why some apparently simple parts carry surprising prices. This article explains, in general terms, how broaching works and when it pays, the main ways to produce keyways and splines, rotary broaching for polygon holes, knurling, and indexing for evenly spaced features, together with design guidance that keeps these features economical. It is general information; tooling suppliers' guidance should be followed for specific tools and set-ups.

## Broaching

A **broach** is a long, multi-toothed cutting tool in which each tooth is slightly larger, or higher, than the one before. As the broach is pushed or pulled through or across the workpiece, each tooth removes a thin layer, so the full profile is produced in a single stroke. The increase between successive teeth is called the **rise per tooth**.

Broaching can produce:

- **internal profiles**, such as keyways, splines, squares, hexagons and other non-round holes; and
- **external profiles**, such as flat surfaces, slots and forms on the outside of a part.

Its strengths are speed and consistency. Once the broach exists, each part takes seconds, and every part has the same profile, because the profile is in the tool. Broaching is widely used for high-volume parts such as gear hubs and automotive components.

Its weaknesses are tooling cost and inflexibility. A custom broach is expensive, and each profile needs its own tool. Broaching usually needs a through hole or an exit for the tool, and the workpiece must be held securely against substantial forces.

### Keyway broaching in small workshops

For keyways, small workshops often use standard keyway broach sets with guide bushings, driven through the bore by a hydraulic or arbor press. The bushing locates the broach in the bore, and shims raise it for successive passes until the keyway reaches depth. This is an inexpensive way to produce standard keyways in small to moderate quantities, provided the bore is through and the keyway size is standard.

### Rotary broaching

**Rotary broaching**, sometimes called wobble broaching, produces polygon holes such as hexagonal sockets in a turned part. The broach is held in a holder that allows it to wobble slightly, so only part of its profile cuts at any moment, which reduces force. It is often performed on lathes and turning centres, and can produce blind polygon holes if a pre-drilled hole and relief are provided at the bottom.

## Keyways: the main methods

| Method | Suits | Strengths | Limitations |
|---|---|---|---|
| Push broaching with bushings | Standard internal keyways, through bores | Low tooling cost, quick for small batches | Through bores only; standard sizes |
| Slotting or shaping | Internal keyways and profiles | Flexible; blind keyways possible with relief | Slow; dedicated equipment |
| CNC lathe keyway broaching | Internal keyways on turning centres | Completes the part in one set-up | Slow stroke-by-stroke cutting; holder rigidity |
| Wire EDM | Internal keyways and complex profiles, hard materials | Accurate; any profile | Needs a start hole; slower; often subcontracted |
| Milling with end mill or keyseat cutter | External keyseats on shafts | Standard tools, common machines | End mill leaves rounded ends; keyseat cutter suits Woodruff keys |

**External keyseats** on shafts are usually milled. An end mill produces a keyseat with rounded ends, which suits standard parallel keys with rounded ends. A Woodruff cutter produces the semicircular seat for a Woodruff key. The [shafts, keys, couplings and alignment](/reados/collections/machine-elements-and-mechanical-design/shafts-couplings-and-alignment/) article covers how keys transmit torque and how to choose between keys and other shaft-hub connections.

## Splines

**Splines** are multiple keys formed integrally on a shaft and in a hub, transmitting more torque than a single key and centring the hub more accurately. They come in straight-sided and involute forms, with involute splines being widely used in modern machinery and defined by international standards.

Common manufacturing methods include:

- **Hobbing** for external splines, using a rotating hob that generates the profile, as in gear cutting;
- **Shaping** for external and internal splines, including those near shoulders;
- **Broaching** for internal splines in volume;
- **Rolling** or cold forming for external splines in high volume, producing strong work-hardened profiles; and
- **Milling** with form cutters or on multi-axis machines for small quantities.

Splines typically require specialised tooling or subcontracting. Where a standard spline form will do, using it gives access to standard tools, gauges and mating parts.

## Knurling

**Knurling** produces a regular pattern of ridges on a cylindrical surface, typically for grip, appearance or to create an interference that holds a part, such as a metal insert pressed into plastic. Common patterns are straight knurls and diamond knurls.

There are two broad methods:

- **Form (rolled) knurling** presses hardened wheels into the surface, displacing material. Because material is pushed up rather than removed, the outside diameter increases, so the blank must be turned undersize. Form knurling needs considerable force and a rigid set-up.
- **Cut knurling** uses wheels that cut the pattern, requiring less force and causing less change in diameter, which suits slender parts and materials that do not form well.

Successful knurling depends on matching the knurl pitch to the workpiece diameter so that the pattern tracks evenly around the circumference. Mismatches cause "double tracking", where the pattern does not join cleanly. Specifying the pattern, pitch and finished diameter, rather than simply writing "knurl", gives the workshop what it needs.

## Indexing: equally spaced features

Many parts carry features spaced evenly around an axis: bolt holes in a flange, slots in a disc, flats on a shaft, teeth on a gear. Producing them requires **indexing**, rotating the workpiece through precise angles between operations.

### Dividing heads

On manual milling machines, a **dividing head** (or indexing head) uses a worm and wheel, commonly with a 40:1 ratio, so that 40 turns of the crank rotate the work through one revolution. For **simple indexing**, the number of crank turns per division is 40 divided by the number of divisions required. An index plate with several circles of holes allows fractional turns.

For example, to produce seven equally spaced divisions, each division needs 40 ÷ 7 = 5 5/7 turns. Using a plate with a 21-hole circle, 5/7 of a turn equals 15 holes, so each division is five full turns plus 15 holes on the 21-hole circle. **Compound** and **differential** indexing extend the method to numbers that simple indexing cannot reach.

```figure
type: steps
title: Seven divisions on a 40:1 dividing head
caption: 40 crank turns rotate the work once, so each seventh needs 40 ÷ 7 turns.
- 40 ÷ 7 | 5 5/7 turns per division
- Choose a plate | a 21-hole circle
- 5/7 of a turn | 15 holes
- *Each division | 5 full turns + 15 holes
```

### Rotary tables and CNC axes

Rotary tables, and especially CNC rotary axes on machining centres, have made indexing far simpler. A fourth or fifth axis can rotate the part to any programmed angle, allowing several faces and evenly spaced features to be machined in one set-up. This reduces handling, improves the relationship between features and often justifies the investment in multi-axis capability for parts with many angled or radial features.

## Gear cutting in brief

Gears are the most familiar indexed feature. Most gears are produced by **generating** processes rather than by cutting each tooth space individually. In **hobbing**, a rotating hob and the gear blank turn together in a fixed ratio, so the hob generates the involute tooth form continuously; it is efficient and widely used for external spur and helical gears. **Gear shaping** uses a reciprocating cutter shaped like a gear and suits internal gears and gears close to shoulders. For hardened, high-precision gears, **gear grinding** or honing follows heat treatment.

Form milling each tooth space with a dividing head remains possible for one-off repairs and small quantities, but it is slow and less accurate than generating methods. For most businesses, gears are bought in as standard components or made by specialist gear cutters. The [gears and gearboxes](/reados/collections/machine-elements-and-mechanical-design/choosing-gearboxes-and-geared-motors/) article explains gear types and selection from the user's side.

## Inspecting specialised features

Features that are difficult to make are often difficult to measure too. Keyway width is commonly checked with gauge blocks or keyway gauges, and keyway depth with a measurement over a pin or the shaft. Splines are usually checked with **go and not-go spline gauges** matched to the spline standard and class, sometimes supplemented by measurement over pins. Polygon holes can be checked with plug gauges. Knurls are usually judged by finished diameter and visual pattern quality. For indexed features, the angular position can be checked on a coordinate measuring machine or with a rotary table and indicator.

Agreeing the inspection method at the same time as the specification avoids disputes later, particularly when parts are made by a subcontractor.

## Design guidance

Specialised features are where design choices most strongly affect cost. Useful guidance includes:

- **Use standard sizes.** Standard key sizes, standard spline forms and standard knurl pitches give access to standard tools and gauges.
- **Prefer through features where possible.** Through keyways and polygon holes can be broached; blind ones need slotting, EDM or rotary broaching with relief.
- **Provide relief.** Where a keyway or spline must stop, a relief groove or undercut allows the tool to finish the cut.
- **Specify functional requirements.** State the key size and fit, the spline standard and class, or the knurl pattern, pitch and diameter, rather than generic notes.
- **Consider alternative connections.** For moderate torque, a keyless locking device, a polygon profile or a press fit may avoid a keyway altogether.
- **Group features for one set-up.** Radial features that can be machined in one orientation on a rotary axis are cheaper than those needing several set-ups.
- **Ask the workshop early.** A short conversation about how a feature will be made often reveals a simpler alternative.

The [designing parts that are economical to machine](/reados/collections/machining-and-metal-parts/designing-parts-that-are-economical-to-machine/) article sets out the general principles of set-ups, features and tolerances behind these choices.

## A worked example

This is an illustrative example. The figures are hypothetical.

A small manufacturer of conveyor components makes about 600 cast-iron pulley hubs a year, each with a standard internal keyway in a through bore. The keyways are currently cut on an old slotting attachment, taking about 20 minutes per hub. At a charge-out rate of $90 an hour, keyway cutting costs about $30 per hub, or about $18,000 a year.

The workshop investigates a standard keyway broach set with guide bushings and shims, used in an existing hydraulic press. The tooling for the two keyway sizes it uses most costs about $2,500. Trials show each keyway takes about 3 minutes, including setting the bushing and shims, costing about $4.50 in labour. Allowing about $1 per hub for broach wear and resharpening, the cost falls to about $5.50 per hub, or about $3,300 a year.

The annual saving is about $14,700, so the $2,500 of tooling pays for itself within the first couple of months of normal production. The workshop keeps the slotting attachment for the occasional blind keyway and for non-standard sizes, and updates its design guide to prefer through keyways in standard sizes wherever the design allows.

```figure
type: bars
title: Cost of cutting keyways in 600 hubs a year
unit: $'000
max: 20
caption: $2,500 of broach tooling paid for itself within the first couple of months.
- Slotting attachment: 20 min each | 18
- *Push broach with bushings: 3 min each | 3.3
```

## How this applies to a small Australian business

- **Map your specialised features.** Know which parts carry keyways, splines, polygon holes, knurls and indexed features, and how each is made.
- **Check the economics.** Standard broach sets, rotary broaches and CNC rotary axes can transform the cost of repetitive features.
- **Use subcontractors wisely.** Wire EDM, spline cutting and gear shops can produce features that are uneconomical in-house.
- **Standardise sizes.** A small set of standard keyways, splines and knurls simplifies tooling and gauging.
- **Design for through features and relief.** Many difficult features become easy with a through bore or a relief groove.

## Common mistakes

- **Blind keyways without relief**, forcing slow or specialised methods.
- **Non-standard key, spline or knurl sizes** chosen without need.
- **Writing "knurl" without pattern, pitch and diameter.**
- **Forgetting diameter growth in form knurling**, producing oversize parts.
- **Several set-ups for radial features** that a rotary axis could handle in one.
- **Keeping slow manual methods out of habit** when inexpensive tooling would pay back quickly.

## Frequently asked questions

**Is it worth buying a broach for a few dozen parts?** For standard keyways, often yes, because standard broach sets are inexpensive and reusable. For custom profiles, a custom broach usually needs higher volumes to justify its cost.

**Can a CNC lathe cut internal keyways?** Yes, with a keyway broaching or slotting tool driven by the machine's axis motion, although cycle times are longer than with a dedicated broach.

## Questions to ask

- Which of our parts carry specialised features, and how much time do those features consume?
- Could standard broaching, rotary broaching or a rotary axis reduce that time?
- Are our keyways, splines and knurls standard sizes and through features where possible?
- Do our drawings specify these features fully?
- Which specialised features should we subcontract rather than make in-house?

## Bringing it together

Keyways, splines, polygon holes, knurls and indexed features are small parts of a drawing that can dominate how a part is made. Broaching produces internal and external profiles quickly and consistently once the tool exists; standard broach sets make keyways economical in small workshops; rotary broaching produces polygon holes on lathes; splines usually need hobbing, shaping, broaching or rolling; knurling depends on matching pitch and diameter; and indexing, now often handled by CNC rotary axes, places features evenly around an axis. Choosing standard sizes, through features and relief grooves at the design stage keeps all of these economical.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. Always follow tooling suppliers' guidance for specific tools and set-ups.*
