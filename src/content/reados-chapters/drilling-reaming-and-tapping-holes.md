---
title: "Drilling, reaming and tapping: making holes that are the right size, in the right place"
description: "A practical guide to holemaking for designers, buyers and workshop leaders: drill types and points, deep holes, reaming allowances, boring, countersinks, tap selection and tapped-hole design."
publishDate: 2026-10-16
category: "Manufacturing"
tags:
  - manufacturing
  - design
  - quality
author: "BIZOMAT"
featured: false
draft: false
---

Holes are the most common machined feature. A typical bracket, manifold, housing or plate may carry dozens of them: clearance holes for bolts, tapped holes for screws, dowel holes that locate one part against another, bores for bearings and passages for fluid. Because holes are so familiar, they are often treated as trivial, both on the drawing and in the workshop. Yet holes cause a disproportionate share of scrap, rework and assembly problems: tapped holes that are too shallow, broken taps in nearly finished parts, dowel holes in the wrong position, bearing bores that are out of round and burrs that stop parts seating.

Making a good hole is a sequence of decisions. Which process will produce the size, position and finish required? How deep can the hole be drilled reliably? Should it be reamed, bored or left as drilled? What tap and what drill size will produce a sound thread? How should the hole be specified on the drawing so the workshop knows what matters?

This article explains the main holemaking processes in general terms: drilling, spot drilling, deep-hole drilling, reaming, boring, counterboring and countersinking, and tapping. It covers how each affects size, position and finish, and offers design and specification guidance that reduces cost and defects. It is general information. Tool manufacturers' recommendations for speeds, feeds and sizes should always take precedence for a specific tool and material.

## Three properties of a hole

Every hole has three properties that may matter:

- **Size**: the diameter, and whether it falls within the tolerance.
- **Position and straightness**: where the hole is relative to other features, and whether its axis runs true through the depth.
- **Form and finish**: roundness, cylindricity and surface roughness of the wall.

Different processes control these properties differently. A drill largely determines position but produces a hole that is slightly oversize with a moderate finish. A reamer improves size and finish but follows the existing hole, so it does little to correct position. A boring tool can correct position and produce accurate size, but it is slower. Choosing the sequence starts with knowing which properties the function really needs.

| Process | Main strength | Main limitation | Typical use |
|---|---|---|---|
| Spot or centre drilling | Accurate starting position | Shallow only | Locating holes before drilling |
| Twist drilling | Fast, economical | Oversize, moderate finish, wander in deep holes | Clearance holes, tap drilling, pre-drilling |
| Reaming | Size and finish | Follows existing hole position | Dowel holes, fits, precise bores |
| Boring | Size, position and straightness | Slower; needs rigid set-up | Bearing bores, larger precise holes |
| Counterboring and countersinking | Seats for fastener heads | Must be concentric with the hole | Socket head and countersunk screws |
| Tapping or thread milling | Internal threads | Tap breakage; chip control | Threaded holes |

## Drilling

### Drill types

The **twist drill** is the workhorse. Common types include:

- **High-speed steel (HSS) drills**: inexpensive, tough and forgiving, suitable for general work and lower volumes.
- **Cobalt HSS drills**: better heat and wear resistance, often used for stainless steel and tougher alloys.
- **Solid carbide drills**: much faster cutting and better accuracy on rigid machines, especially with through-tool coolant, but more brittle and less tolerant of poor set-ups.
- **Indexable insert drills**: for larger diameters, using replaceable carbide inserts.

Drill lengths come in series such as stub, jobber and long series. Shorter drills are stiffer and wander less. A practical rule is to use the shortest drill that reaches the required depth.

### Point angle and starting the hole

General-purpose drills commonly have a 118° point. Drills with a 135° point, often with a split point, are common for harder materials and are more self-centring. Drills tend to wander as they start, especially on uneven or inclined surfaces. A **spot drill** or **centre drill** creates a small conical start that guides the drill. When spot drilling, the spot angle is usually chosen to be the same as or larger than the drill point angle so the drill engages on its corners rather than its chisel edge; a 90° spot also produces a useful chamfer.

The drill point adds length beyond the full-diameter depth. For a 118° point, the point length is roughly 0.3 times the drill diameter. That matters for blind holes, where the drawing usually specifies the full-diameter depth.

### Drilled hole quality

Drilled holes are usually slightly larger than the drill, with a moderate finish and some error in position and straightness that grows with depth. They are entirely adequate for clearance holes and tap drilling. Where a hole must hold a tight size or fit, drilling is normally followed by reaming or boring.

### Deep holes

Chips must leave the hole and coolant must reach the cutting edge. As depth increases relative to diameter, both become harder. Common approaches include:

- **Peck drilling**, where the drill periodically retracts to clear chips, used for moderately deep holes, roughly beyond three to four diameters.
- **Through-tool coolant**, which flushes chips and allows carbide drills to drill much deeper in one pass.
- **Gun drilling** and other specialised deep-hole processes for very deep, straight holes, typically many times the diameter.

From a design perspective, deep small holes are expensive. If a deep passage is needed, consider whether it can be shortened, enlarged, drilled from both ends, or replaced by a different construction.

## Reaming

A **reamer** removes a small amount of material from an existing hole to bring it to an accurate size with a good finish and roundness. Reamed holes are common for dowel pins, fits with shafts and bushes, and precision bores.

Key points:

- **Leave the right allowance.** Too little material and the reamer rubs and glazes the hole; too much and it chatters and wears. The correct allowance depends on hole size and material; for common sizes it is typically a few tenths of a millimetre on diameter. Follow the reamer manufacturer's recommendation.
- **Reamers follow the hole.** They improve size and finish but do not substantially correct position or straightness. If position matters, spot drill accurately, use a stiff drill and consider boring.
- **Speeds and feeds differ from drilling.** A slower speed and higher feed than drilling the same size is a common starting point.
- **Choose the flute style for the hole.** Straight-flute reamers are general purpose. Spiral flutes help with interrupted cuts and with chip flow in through or blind holes, depending on direction.

Holes for dowel pins and close fits are often specified to an ISO tolerance class such as H7, which reaming can typically achieve with good practice.

## Boring

**Boring** uses a single-point or adjustable tool to enlarge an existing hole. Because the tool does not follow the existing hole, boring can correct position and straightness as well as producing accurate size and finish. It is the usual choice for bearing bores, larger precise holes and holes that must be accurately positioned. Boring needs a rigid set-up; long, slender boring bars are prone to chatter, and the length-to-diameter ratio of the bar strongly affects achievable accuracy.

## Counterbores, countersinks and spotfaces

**Counterbores** create a flat-bottomed recess so that a socket head cap screw sits below the surface. **Countersinks** create a conical recess for countersunk screws. The included angle matters: ISO metric countersunk screws use 90°, while unified inch flat-head screws commonly use 82°, and mixing them leaves a screw head bearing only on its edge. A **spotface** is a shallow counterbore that creates a flat, square seat on a rough or curved surface such as a casting.

These features must be concentric with the hole. Combined tools that drill and counterbore or countersink in one pass improve concentricity and save time on repeated holes.

## Tapping

**Tapping** cuts or forms an internal thread. It is also where many expensive failures occur, because a broken tap in a nearly finished part can scrap hours of machining.

### Choosing the tap drill

For metric coarse threads, a widely used rule of thumb is that the tap drill diameter is the nominal diameter minus the pitch. For example:

- M6 × 1.0: 6.0 − 1.0 = 5.0 mm tap drill;
- M8 × 1.25: 8.0 − 1.25 = 6.75 mm, usually rounded to 6.8 mm;
- M10 × 1.5: 10.0 − 1.5 = 8.5 mm tap drill.

These sizes give a high percentage of thread engagement. A full 100% thread adds little strength compared with roughly 65–75% engagement but requires much more tapping torque and increases breakage risk. In hard or tough materials, a slightly larger tap drill within the allowable range can make tapping far more reliable. Always check the tap drill against the tolerance of the thread's minor diameter and the tap maker's chart.

### Choosing the tap

- **Hand taps** in taper, intermediate (plug) and bottoming forms are used progressively for manual tapping, especially in blind holes.
- **Spiral point taps**, sometimes called gun taps, push chips ahead of the tap. They are well suited to **through holes**.
- **Spiral flute taps** lift chips back out of the hole. They are generally preferred for **blind holes**.
- **Forming taps**, also called roll taps, displace material rather than cutting it, producing no chips and a strong, work-hardened thread in ductile materials such as aluminium and many steels. They need a larger pre-drilled hole than cutting taps, sized from the maker's chart, and are less suitable for brittle materials.

On CNC machines, **rigid (synchronised) tapping** coordinates spindle rotation and feed precisely. Tension-compression tap holders are used where the machine cannot synchronise.

### Thread milling

**Thread milling** uses a rotating cutter that follows a helical path to produce the thread. It is slower per hole than tapping but offers advantages: one tool can cut several sizes of the same pitch, the thread size can be adjusted by offset, a broken tool rarely jams in the part, and it works well in hard materials, large threads and expensive parts where a broken tap would be costly.

## Designing tapped holes

Many tapping problems start on the drawing. Good design practice includes:

- **Specify full-thread depth, not just hole depth.** Allow extra drill depth below the full thread for the tap's chamfer and the drill point. A common allowance is a few thread pitches plus the drill point length.
- **Use only the engagement needed.** In steel, an engagement of about one times the nominal diameter typically develops the strength of a matching steel bolt; softer materials such as aluminium generally need more. Excess depth adds cost and breakage risk.
- **Avoid tapping to the bottom of blind holes** where possible. Provide clearance for chips.
- **Prefer through holes** where function allows. They are easier to tap and clean.
- **Consider inserts** for soft materials or threads that will be assembled repeatedly. The [choosing fasteners and threads](/reados/collections/machine-elements-and-mechanical-design/choosing-fasteners-and-threads/) article covers thread inserts and screws for soft materials.
- **Standardise sizes.** Fewer thread sizes mean fewer tools, fewer tool changes and fewer mistakes.

On metric drawings, internal threads are commonly made to tolerance class 6H unless otherwise specified.

## Specifying holes on drawings

Clear hole callouts prevent ambiguity. A good callout states the diameter and tolerance, depth (and whether it is full-diameter depth or thread depth), any counterbore or countersink with its diameter, depth or angle, and the number of identical holes. Position should be controlled with appropriate tolerances relative to the datum features that matter for assembly. The [specifying tolerances, fits and surface finish](/reados/collections/engineering-design-practice/specifying-tolerances-fits-and-surface-finish/) article explains how to apply tight tolerances only where function requires them.

## Materials and coolant

Material affects every holemaking process:

- **Aluminium** machines easily but can form built-up edge on tools; sharp tools with polished flutes and good lubrication help.
- **Stainless steels** work-harden. Keep the tool cutting with a positive feed; dwelling or rubbing hardens the surface and makes the next pass harder.
- **Cast iron** is often drilled dry and produces powdery chips.
- **Plastics** may melt or close up after drilling; sharp tools, appropriate speeds and chip clearance matter.

Coolant and lubrication reduce heat, improve finish and help clear chips. Tapping in particular benefits from appropriate lubricants.

## A worked example

This is an illustrative example. The part and figures are hypothetical.

A small manufacturer machines aluminium hydraulic manifold blocks, each with 24 blind M8 × 1.25 tapped holes. The drawing specifies "M8 × 20 deep". The shop drills 6.8 mm to 20 mm and taps with spiral point taps. About one block in fifteen has a broken tap or a shallow thread, and each scrapped block represents about four hours of machining.

The investigation finds several causes. The drawing does not say whether 20 mm is the thread depth or the drill depth, so the shop has drilled to 20 mm, leaving no room for chips or the tap's chamfer. Spiral point taps push chips towards the bottom of a blind hole, where they pack. And 20 mm of engagement is more than twice the nominal diameter, more than the joint needs.

```figure
type: compare
title: Why one manifold in fifteen was scrapped
cols: Before | After
best: 2
caption: Each scrapped block represented about four hours of machining.
- Callout | M8 × 20 deep | M8 × 1.25 – 6H, 16 full thread, drill ⌀6.8 × 21
- Room below the thread | None: drilled to 20 | Space for the tap chamfer and chips
- *Tap | Spiral point in a blind hole | Spiral flute for blind holes
```

The engineer revises the callout to "M8 × 1.25 – 6H, 16 full thread, drill ⌀6.8 × 21". The 21 mm full-diameter drill depth leaves 5 mm below the full thread: room for the tap's chamfer, about three pitches or 3 × 1.25 = 3.75 mm, plus a little space for chips. The drill point, roughly 0.3 × 6.8 ≈ 2 mm long, extends beyond that, and the engineer checks that the block's wall thickness allows for it. The shop switches to spiral flute taps for the blind holes. After the change, tap breakage becomes rare and thread depth failures stop. A later trial with forming taps, using the larger pre-drill specified by the tap maker, removes chips altogether and strengthens the thread in the aluminium.

```figure
type: svg
title: A blind tapped hole that leaves room for chips
alt: A section through a blind M8 tapped hole: 16 millimetres of full thread, about 3.75 millimetres for the tap chamfer and chips below it, a 21 millimetre full-diameter drill depth, and a drill point about 2 millimetres longer.
caption: Callout: M8 × 1.25 – 6H, 16 full thread, drill ⌀6.8 × 21.
viewbox: 0 0 560 300
body:
<rect class="fp" x="40" y="20" width="480" height="260"/>
<rect class="bxi" x="230" y="20" width="100" height="210"/>
<path class="bxi" d="M230 230L280 262L330 230Z"/>
<rect class="bxa" x="230" y="20" width="100" height="160"/>
<path class="lf" d="M340 20H400M340 180H400M340 230H400M340 262H400"/>
<text class="txb" x="280" y="105" text-anchor="middle">16 full thread</text>
<text class="tx txs" x="408" y="104">16 thread</text>
<text class="tx txs" x="408" y="210">chamfer and chips</text>
<text class="tx txs" x="408" y="234">drill depth 21</text>
<text class="tx txs" x="408" y="266">plus about 2 point</text>
```

## How this applies to a small Australian business

- **Decide which hole properties matter.** Size, position and finish each call for different processes.
- **Spot drill holes that must be accurately positioned.** It is a cheap step that reduces wander.
- **Ream or bore fits.** Do not expect drilled holes to hold close tolerances.
- **Match taps to holes.** Spiral point for through holes, spiral flute for blind holes, forming taps where material suits.
- **Write clear callouts.** Distinguish drill depth from thread depth, and specify thread class.
- **Limit thread engagement to what the joint needs.** Extra depth costs time and risk.
- **Consider thread milling** for expensive parts, hard materials or large threads.

## Common mistakes

- **Ambiguous depth callouts.** The most common cause of shallow threads and packed chips.
- **Expecting reamers to fix position.** Reamers follow the hole.
- **Too little or too much reaming allowance.** Both damage size and finish.
- **Mixing 82° and 90° countersinks.** Screw heads seat poorly.
- **Drilling deep holes without chip control.** Wander, poor finish and broken drills follow.
- **Excess thread engagement.** It adds cost and breakage risk without adding useful strength.
- **Ignoring material behaviour.** Work-hardening stainless and gummy aluminium need different practices.

## Questions to ask

- Which holes need tight size, position or finish, and which are simple clearance holes?
- Are thread depths and drill depths clearly distinguished on our drawings?
- Are we using the right tap type for through and blind holes?
- Is thread engagement longer than the joint requires?
- Where do tap breakages and hole rejects occur most, and why?
- Would thread milling or forming taps reduce risk on our most valuable parts?

## Bringing it together

Holes look simple, but making them well requires matching each process to the property that matters: drilling for economical holes, spot drilling for accurate starts, reaming for size and finish, boring for position and precision, and the right tap or thread mill for sound threads. Clear drawings that distinguish drill depth from thread depth, sensible thread engagement, the right tap for through and blind holes and attention to material behaviour prevent most of the scrap and assembly problems that holes cause. For the wider economics of machined parts, the [designing parts that are economical to machine](/reados/collections/machining-and-metal-parts/designing-parts-that-are-economical-to-machine/) article explains how set-ups, features and tolerances drive cost.

---

*Source: BIZOMAT editorial notes. Examples and figures in this article are illustrations. Always follow tool manufacturers' recommendations for a specific tool and material.*
