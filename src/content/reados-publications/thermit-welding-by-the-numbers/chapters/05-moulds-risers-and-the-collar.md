---
book: thermit-welding-by-the-numbers
chapterSlug: moulds-risers-and-the-collar
order: 5
title: "Moulds, risers and the collar"
description: "Design the mould around a thermit weld: the collar that reinforces it, the runner that fills it from the bottom, and a riser sized so the weld freezes before its feed does."
draft: false
---

A thermit weld is a casting made in place. The poured iron must fill a cavity around the joint, melt into the faces of the parts, and freeze into sound metal without shrinkage cavities, slag or gas holes. Everything that foundry engineers know about casting applies: how the metal enters the mould, where air and slag escape, which part freezes last and how it is fed. The mould is therefore not just a container; its design decides much of the quality of the weld.

This chapter looks at the collar that surrounds the joint, the runner and riser that bring metal in and feed it, and the mould itself, using Hart's 1910 description and a classic foundry rule to size the riser for the crusher-frame weld.

## The collar

The collar is the band of weld metal that surrounds the joint, bigger than the parts themselves. Hart described the collar for a rail weld in 1910: it should extend 2 inches, about 50 mm, over each rail end, be twice as thick as the rail's web and base, and stop short of the rail head, which stays free so that the running surface can be ground true. The collar was not merely surplus metal. It had three jobs:

1. **to reinforce the joint**, by giving it more cross-section than the parts, so that the weld zone is not the weakest point;
2. **to move the edges of the fusion zone away from the joint faces**, so that any imperfection at the edge of the poured metal lies in the collar rather than across the load path;
3. **to supply heat to the faces of the parts**, because a larger mass of molten metal around the joint holds more superheat (Chapter 2) and keeps the faces hot long enough to fuse.

Modern rail welds also have a collar around the web and foot, shaped by the supplier's mould, with the head ground to the rail profile after welding.

For the crusher frame, the contractor's design gives the 200 × 150 mm member a collar 25 mm thick all round, extending 50 mm each side of the 25 mm gap. Chapter 4 showed that this collar holds 2.5 litres, more than three times the metal in the gap itself, and dominates the charge.

## Filling from the bottom

Hart described the rail mould as constructed so that the molten metal entered from the bottom. Metal entered through the runner at the bottom, and slag and surplus steel spilled over into the riser at the top. Bottom filling has three advantages over pouring straight into the top of the cavity:

- the metal rises steadily through the mould instead of falling through it, so it does not splash, trap air or erode the mould;
- air in the mould is pushed ahead of the rising metal and out through the riser and vents;
- slag that enters with the first metal, and any oxide formed on the way, floats up and out into the riser rather than being trapped in the weld.

In the fusion method, the crucible's bottom tap keeps most of the slag in the crucible (Chapter 1). The bottom-filled mould and the riser deal with the rest.

```figure
type: layers
title: The parts of a thermit weld mould, from top to bottom
caption: Metal enters at the bottom through the runner and rises through the collar and gap; air, slag and the last, coldest metal go up into the riser, which is cut off after the weld has cooled.
- Riser | reservoir above the weld; collects slag and air; feeds shrinkage
- *Collar and gap | the weld itself, surrounding and filling the joint
- Runner | channel from the crucible down the side of the mould to the bottom
- Crucible | above the runner, tapped from the bottom once the reaction is complete
```

## Which part freezes last

A casting shrinks as it freezes, and the last part to freeze is where any shortage of metal appears as a shrinkage cavity. The aim of mould design is to make the riser freeze after the weld, so that the riser feeds liquid metal into the weld as it shrinks and the cavity, if any, forms in the riser, which is cut off.

Foundry engineers use a classic result, known as Chvorinov's rule, to compare freezing times. The time a part of a casting takes to freeze is roughly proportional to the square of its modulus, the ratio of its volume to its cooling surface area, V ÷ A. A thick, compact shape has a high modulus and freezes slowly; a thin, spread-out shape has a low modulus and freezes quickly. A common foundry guideline is to make the riser's modulus at least about 1.2 times the modulus of the section it feeds.

This is an illustration. The crusher-frame collar is a band 25 mm thick wrapped around the member. A wide plate cooled on both faces has a modulus of about half its thickness. The collar loses heat outwards into the sand mould and inwards into the member, which, although preheated, is far below the iron's temperature and has a large mass to absorb heat, so the engineer treats both faces as cooling surfaces and takes the collar's modulus as about half its thickness, **12.5 mm**. That is an assumption, and the contractor's experience with similar moulds, or a casting simulation, would confirm it. On that basis the riser needs a modulus of at least 1.2 × 12.5 = **15 mm**.

```figure
type: formula
title: Checking the crusher-frame riser by modulus
formula: M = V ÷ A;  freezing time ∝ M²;  M_riser ≥ 1.2 × M_section
caption: This is an illustration using a common foundry guideline. The riser is a cylinder standing on the collar, so its base is not a cooling surface; its top and side are.
- M_section | collar modulus, taken as 25 mm ÷ 2 = 12.5 mm
- riser | cylinder 100 mm diameter × 150 mm high
- V | π ÷ 4 × 100² × 150 ≈ 1,178,000 mm³ (1.18 L)
- A | side π × 100 × 150 + top π ÷ 4 × 100² ≈ 55,000 mm²
step: M_riser ≈ 1,178,000 ÷ 55,000 ≈ 21.4 mm, above the 15 mm needed
step: freezing time ratio ≈ (21.4 ÷ 12.5)² ≈ 2.9
```

The proposed riser, a cylinder 100 mm in diameter and 150 mm high on top of the collar, has a modulus of about 21.4 mm, comfortably above 15 mm. By Chvorinov's rule it would stay liquid roughly 2.9 times as long as the collar, long enough to feed it as it shrinks.

The volumes are consistent with Chapter 4. The riser holds about 1.18 L, and the runner perhaps half a litre more, so the runner and riser together hold about 1.7 L, about half the 3.25 L of the weld. Hart's doubling allowed as much again for runner and riser as for the weld itself, so the design leaves a margin for metal that overflows or is lost.

## The gap between the faces

The fusion method needs the parts separated by a gap, as Viall noted, so that the thermit steel can flow between them and fuse the faces; how wide the gap should be depends on how big the parts are and what they are made of. The width is a balance.

A gap that is too narrow is hard to fill. The iron must flow down between the faces from the runner at the bottom and rise between them, and in a narrow gap it loses heat to both faces quickly, so it may freeze before the gap is full or before the faces have melted. A narrow gap also leaves little room for oxide or slag on the faces to be washed away.

A gap that is too wide needs more metal, more heat and a bigger charge, shrinks more as it freezes (Chapter 7), and creates a larger volume of cast metal in the load path, whose properties are those of the thermit steel rather than the parent. For the crusher frame, the 25 mm gap was the contractor's choice for this section, wide enough to fill and fuse the full 200 × 150 mm faces and to remove the crack completely.

The faces themselves must be clean and sound. A crack cut out by gouging leaves oxide and possibly carbon pick-up on the faces, which the contractor removes by grinding back to bright metal before the wax pattern is made. Any remaining crack tip beyond the gap would be left in the parent metal beside the weld, ready to grow again, so the faces are checked for cracks, for example by magnetic particle inspection, before the mould is built.

## Mould materials

Hart's locomotive-frame weld used firebrick cut to shape. Early heavy repairs used moulds rammed from refractory sand mixtures around a wax pattern in a steel box, as described above. Modern rail welding uses pre-formed moulds made by the supplier from bonded refractory sand, shaped to the rail section and the collar design, which are clamped around the rail and sealed. Whatever the material, it must withstand the iron's temperature without melting or eroding, be dry, let gas escape through it or through vents, and come away cleanly when the weld is stripped. The mould's own heat capacity also matters: a cold, massive mould draws superheat from the iron, which is one reason moulds are preheated with the parts.

## Venting, drying and sealing

Three more details make a mould work.

**Venting.** Air and gas must escape as the metal rises. The riser is the main vent, but high points of the cavity away from the riser need small vents too, or air trapped there becomes a gas hole in the weld.

**Drying.** A mould made of refractory sand holds moisture, and Chapter 3 showed what water does under molten iron. Hart's wax method had a useful side effect: the wax pattern was melted out by heating the mould, which also dried it. Modern pre-formed moulds are supplied dry and must be kept dry; site-made moulds are dried and preheated as the procedure requires.

**Sealing.** The mould must seal against the parts so that molten iron cannot escape. Hart's locomotive-frame test used firebrick cut to shape; modern moulds are sealed to the parts with a refractory luting paste or sand packing. On a cast part with an irregular surface, sealing takes care, as the failure below shows.

## Stripping and trimming

When the weld has frozen and cooled enough to hold its shape, the mould is broken away, the runner and riser are cut off, and the collar is dressed to its final shape. On a rail, the head is ground to the rail profile so that wheels run smoothly, while the collar around the web and foot is usually left. On the crusher frame, the riser would be cut off above the collar and the collar dressed to remove fins and surface roughness that could start fatigue cracks, but left otherwise intact, because its extra section is part of the repair's strength. Hart's locomotive-frame test planed part of the collar back below the original surface specifically to show where the metals had joined; in service, collars are kept.

## Making the mould around the crusher frame

This is an illustration. The contractor's method for the crusher frame follows the outline Hart described for heavy repairs:

```figure
type: steps
title: Building the mould for the crusher-frame weld
caption: This is an illustration of the outline of a heavy-repair mould, not a procedure. The contractor's approved method governs.
- Prepare the joint | crack cut out to a 25 mm gap with clean, sound faces
- Wax pattern | gap filled and collar modelled in wax to the design size
- Mould box | steel box around the member, with runner and riser patterns
- Ram the mould | refractory sand packed around the wax and patterns
- Melt out and dry | heating removes the wax and dries the mould
- *Seal and check | joints with the member sealed; mould dry and vents clear
```

The wax pattern also gives the charge check from Chapter 4: the wax used is weighed and multiplied by 32, and the answer compared with the volume calculation.

## A failure: the run-out

This is an illustration. In the contractor's records was a weld on a cast steel mill housing where the iron had run out of the mould shortly after the pour started. A stream of molten metal escaped between the mould and the casting on one side, across the dry sand bed beneath. Nobody was hurt, because everyone was outside the exclusion zone and the sand bed caught the metal, but the weld was short of metal on that side and had to be cut out and remade.

The investigation found that the casting's surface on that side had a slight hollow where the mould box met it, and that the luting had bridged the hollow without being packed into it. When the hot iron reached the seal, the unsupported luting gave way. The contractor's procedure was changed to require the mould's contact line to be checked against the casting's actual surface, and any hollows to be packed and supported, before the mould is closed.

For the crusher frame, the engineer asked for the contact line on the cast frame to be checked in the same way. Cast frames rarely have flat, true surfaces where a repair is needed.

## Exercise: a thicker collar

The contractor considers increasing the crusher-frame collar to 30 mm thick for extra reinforcement. Taking the collar's modulus as half its thickness, find the minimum riser modulus by the 1.2 guideline. Check whether a riser 80 mm in diameter and 120 mm high would be large enough, and whether the 100 × 150 mm riser would be, counting only the top and side as cooling surfaces.

The collar's modulus becomes 30 ÷ 2 = **15 mm**, so the riser needs at least 1.2 × 15 = **18 mm**.

For the 80 × 120 mm riser: V = π ÷ 4 × 80² × 120 ≈ 603,000 mm³ and A = π × 80 × 120 + π ÷ 4 × 80² ≈ 35,200 mm², so M ≈ **17.1 mm**, just short of 18 mm. For the 100 × 150 mm riser, M ≈ **21.4 mm**, which is enough.

The smaller riser would freeze at about the same time as the thicker collar, leaving the collar without feed in its last moments, so the contractor would keep the 100 × 150 mm riser. A thicker collar also needs more metal, so the charge in Chapter 4 would rise, which the engineer would check before accepting the change.
