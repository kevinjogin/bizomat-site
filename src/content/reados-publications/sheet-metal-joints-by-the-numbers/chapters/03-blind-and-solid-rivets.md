---
book: sheet-metal-joints-by-the-numbers
chapterSlug: blind-and-solid-rivets
order: 3
title: "Blind and solid rivets"
description: "Choose blind or solid rivets by access, load and sealing, match grip range and hole size to the joint, pick head and material, size a solid rivet's length, and catch hinge rivets with the wrong grip."
draft: false
---

A rivet is a simple part, and the choice between rivets is full of small numbers that decide whether a joint holds. A blind rivet must suit the total thickness it clamps, within a range of a millimetre or two; its hole must be the size its maker specifies; its head must spread the load on soft or thin sheet; its body and mandrel must not corrode the sheets around them; and for an outdoor product it must not let water through its middle. A solid rivet must be long enough to form a proper head and no longer. Each of these is a number on a data sheet, and each is easy to overlook when a rivet is chosen because it is in the drawer.

This chapter compares blind and solid rivets, then covers grip range, hole size, head styles, materials and sealing, and the length of a solid rivet. The running case selects the rivets for EN-700's hinge and brackets, and finds that the first batch of hinges was riveted with rivets whose grip range was too long for the joint, leaving loose hinges that rattled.

## Blind and solid

A **solid rivet** is a plain shank with a head on one end. It is placed through the joint and the other end is upset, by hammer, rivet set or press, into a second head. It needs access to both sides, fills its hole well as it is upset, and is strong, reliable and cheap per rivet. Its setting takes skill or a machine, and it is mostly used where both sides are easy to reach: hinges made on a bench, brackets riveted before assembly, aircraft-style structures.

A **blind rivet** is a hollow body on a mandrel, set from one side. A tool grips the mandrel and pulls it, which draws the mandrel's head into the body, expanding the far end into a blind head against the back sheet, until the mandrel breaks off at a designed load. Blind rivets need access from one side only, need little skill and are fast. Their strength depends heavily on their design, which is why their makers publish shear and tensile ratings for each type, size and material.

```figure
type: compare
title: Blind and solid rivets for sheet metal work
cols: Access | Strength and fill | Typical use in EN-700
caption: This is an illustration of the trade-offs. Strengths for any particular rivet come from its maker's data.
- Solid rivet | Both sides | High; fills its hole when upset | Bench-riveted parts before assembly
- Open-end blind rivet | One side | Moderate; hollow after setting | Light internal fixings
- *Closed-end blind rivet | One side | Moderate; sealed body | Outdoor joints that must not leak
- Structural blind rivet | One side | High; locked mandrel fills the body | Load-bearing joints with one-side access
```

## Grip range

A blind rivet is designed to set correctly over a range of total joint thickness, its **grip range**. Below the range, the rivet's body is too long and the blind head forms loosely, or the body buckles; above it, there is not enough body to form a head at all. Makers publish the grip range for every length of every rivet.

This is an illustration. EN-700's hinge joins a 1.5 mm stainless hinge leaf to the 2.0 mm aluminium door, a total grip of **3.5 mm**. Its bracket joint clamps the 2.0 mm bracket to the 1.2 mm back wall, **3.2 mm**. A rivet whose grip range is, say, 3.0 to 4.8 mm suits both. One rated for 6.4 to 8.0 mm does not suit either, however strong it is.

```figure
type: range
title: Grip ranges of three lengths of 4.0 mm blind rivet against EN-700's hinge
min: 0
max: 9
unit: mm
ticks: 0 | 3 | 6 | 9
caption: This is an illustration; real grip ranges come from the rivet maker's table. The hinge's total grip of 3.5 mm falls inside only the middle length's range.
- Short length | 1.5 | 3.0
- *Middle length | 3.0 | 4.8
- Long length | 6.4 | 8.0
- Hinge total grip | 3.5 | 3.5
```

## The error: loose hinges

This is an illustration. The first batch of EN-700 hinges was riveted with 4.0 mm closed-end aluminium blind rivets of the long length, rated for 6.4 to 8.0 mm, because the stores had issued the wrong box: both lengths looked alike in the bin. At a grip of 3.5 mm, the rivets' bodies were nearly 3 mm too long. Their blind heads formed as loose, misshapen bulbs that did not clamp the leaf to the door, and the hinges rattled when the doors were opened and closed.

The assembly check caught them on the first doors: every hinge was given a shake, and the loose ones moved. A pull test on one rivet drilled out of a rejected hinge confirmed a malformed head. The fix was to drill out and replace the rivets with the correct length, to label the bins with the grip ranges in large type, and to add the rivet's part number, not only its diameter, to the hinge drawing. A rivet's diameter alone does not specify it; its length, material, head and type all matter.

## Hole size

A blind rivet's hole is specified by its maker, usually a little over the nominal diameter: a 4.0 mm rivet in a 4.1 mm hole, a 4.8 mm rivet in a 4.9 mm hole, in this book's illustrations. Too small a hole and the rivet will not enter, or will be forced in and damage its body; too large and the body expands into the gap instead of the far side, giving a weak blind head and a joint that slips. Holes drilled in a stack of two sheets that have moved between drilling and riveting are elongated in one sheet, and the rivet bears on the other sheet alone, which halves its bearing strength in the thinner sheet.

## Heads

The head spreads the rivet's clamping load into the top sheet. A standard **dome head** suits most metal sheet. A **large flange head**, perhaps half as large again across, spreads the load further, which suits thin or soft sheet and slotted holes. A **countersunk head** sits flush, at the cost of a countersink that removes sheet and weakens thin material.

This is an illustration. The pull-through strength of a head, estimated as the shear of the sheet around its circumference, is π × head diameter × t × shear strength. For a 4.8 mm rivet with a 9.5 mm dome head in EN-700's 1.2 mm steel, that is about **6,876 N**; with a 14 mm large flange head, about **10,134 N**. In the 2.0 mm aluminium door, a 4.0 mm rivet's 8 mm dome head gives about 6,876 N and a 12 mm flange head about 10,314 N. These estimates are higher than most blind rivets' own tensile ratings, so in these joints the rivet, not the sheet, limits the tension, as Chapter 4 checks.

```figure
type: bars
title: Estimated pull-through strength of a rivet head, by head and sheet
unit: N
max: 11000
caption: This is an illustration, estimated as π × head diameter × thickness × shear strength. A larger head raises the pull-through in proportion to its diameter.
- 4.8 mm dome head, 9.5 mm, in 1.2 mm steel | 6876
- *4.8 mm large flange, 14 mm, in 1.2 mm steel | 10134
- 4.0 mm dome head, 8 mm, in 2.0 mm aluminium | 6876
- 4.0 mm large flange, 12 mm, in 2.0 mm aluminium | 10314
```

## Materials

The rivet's material must be strong enough, compatible with the sheets galvanically and suitable for the environment.

- **Aluminium rivets** suit aluminium sheet and light loads, and are galvanically close to it.
- **Steel rivets**, usually zinc-plated, suit steel and galvanised steel and are much stronger.
- **Stainless steel rivets** suit stainless and outdoor work, but are galvanically noble, which matters in aluminium, as Chapter 8 explains.
- **Mandrels** are often a different material from the body, and the part left in the rivet after setting is in contact with the joint and the weather.

EN-700's brackets use zinc-plated steel rivets in its galvanised steel; its hinge uses aluminium rivets with aluminium mandrels in the aluminium door, so that nothing noble sits in the aluminium.

## Rivets and coatings

Drilling or punching a hole in galvanised sheet exposes a ring of bare steel at the hole's wall. On thin galvanised sheet, the zinc around a small cut edge tends to protect it sacrificially, which is one reason galvanised products tolerate punched and drilled holes outdoors. Larger cut areas, thick sheet and harsh environments reduce that protection. A rivet that fills its hole and is sealed under its head keeps water off the cut edge, which helps further. For painted or powder-coated products, the order matters: riveting after coating can crack the coating around the head, while coating after riveting traps the rivet and its crevices under the coat. The finish's supplier can say which order suits a given coating, and the joint schedule should record the choice.

## Sealing

An open-end blind rivet leaves a hollow body, and its broken mandrel may fall out, leaving a hole straight through the joint. Rain on an outdoor door finds that hole. A **closed-end** blind rivet has a body sealed at its blind end, so that water cannot pass through it, and the mandrel's head stays trapped inside. Outdoor and wet joints use closed-end rivets, often with a bead of sealant under the head for good measure. EN-700's hinge rivets, on the outside of the door, are closed-end for this reason.

## Solid rivet length

A solid rivet must be long enough to form a full second head but not so long that it bends over. A common shop rule makes the rivet's length the grip plus about one and a half diameters. This is an illustration. A 4.0 mm solid aluminium rivet through EN-700's 3.5 mm hinge stack would need about 3.5 + 1.5 × 4.0 = **9.5 mm** of length, so a 10 mm rivet would be chosen, and the formed head checked against the rivet maker's or the design standard's dimensions. Too short and the head is thin and weak; too long and the shank bends or forms a lopsided head.

## Setting tools and setting force

Blind rivets are set by hand tools, lever tools or powered tools, each with a stroke and a pulling capacity. Larger rivets and stronger materials need more force; a structural steel blind rivet may need more than a hand tool can deliver comfortably. A powered tool on a production line sets each rivet consistently in a second or two, which matters for both the joint's quality and the operator's hands over a shift of hundreds of rivets, a manual handling consideration that work health and safety law expects to be assessed. Tool, rivet and nose-piece should be matched as the rivet maker specifies.

## Inspecting set rivets

A set rivet can be inspected only partly from outside, which is why the checks that can be made are made on every rivet. From the head side, the head should sit flat on the sheet with no gap, and the mandrel should have broken off at or just below the head, as the maker specifies; a mandrel standing proud, or broken deep inside, signals a rivet set at the wrong grip or with a worn tool. Where the blind side can be seen, for instance on a sample assembly, the blind head should be fully formed and seated. On a production line, a sample of joints is tested destructively each shift, by a push-out or pull test on a test piece made with the same rivets, sheets and tool, so that a change of rivet batch or tool wear is found within hours rather than in the field.

For EN-700, the assembly check of every hinge for rattle, added after the loose-hinge error, is a hundred-per-cent inspection that costs a few seconds per door. It finds exactly the fault that the grip error produced, and it would find a missing rivet, a cracked leaf or a hinge bent in handling as well.

## Removing a rivet

Rivets are permanent, but sometimes have to be removed: a wrong rivet, a damaged part, a repair in service. A blind rivet is drilled out through its head with a drill the size of its body, and the remains pushed through. Drilling too large, or off centre, enlarges the hole, and the replacement then needs the next size up, with its own edge distance and bearing checks. The joint schedule of Chapter 1 should say whether a replacement in an oversize hole is acceptable, and what size it should be.

## Exercise: the bracket's rivets

EN-700's bracket joint clamps a 2.0 mm steel bracket to the 1.2 mm galvanised back wall, with access from inside the enclosure only once the box is closed. The rivet maker's illustrative table offers 4.8 mm zinc-plated steel blind rivets in open-end and closed-end types, in grip ranges of 1.5 to 3.0 mm, 3.0 to 4.8 mm and 4.8 to 6.4 mm. Which rivet should be specified, and what should the drawing state?

**Worked answer.** The total grip is 2.0 + 1.2 = **3.2 mm**, inside the **3.0 to 4.8 mm** range and outside the others. The joint is inside the enclosure, dry, and the rivet's hollow body does not open to the outside, so an **open-end** rivet is acceptable; a closed-end rivet would also work and might be chosen to keep to one type across the product. Zinc-plated steel suits the galvanised steel galvanically and has the strength Chapter 2 relied on.

The drawing should state the rivet's full part number, its type, material, diameter and grip range, the 4.9 mm hole size, the edge distance of 10 mm and pitch from Chapter 2, and that the rivets are set from inside the enclosure. With only the diameter shown, the stores could again issue a rivet of the wrong length.
