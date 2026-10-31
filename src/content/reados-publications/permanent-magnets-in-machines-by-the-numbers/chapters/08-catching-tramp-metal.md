---
book: permanent-magnets-in-machines-by-the-numbers
chapterSlug: catching-tramp-metal
order: 8
title: "Catching tramp metal"
description: "How separator magnets capture steel fragments: force from field and gradient, why shape matters more than size, distance and burden depth, grate and plate magnets, stainless steel and capture tests."
draft: false
---

Food and bulk-materials plants put magnets in their product streams to catch stray steel before it reaches a customer or damages equipment downstream: a broken screen wire, a nut shaken loose, a fragment of worn blade. The magnets are passive, cheap to run and easy to install, and they are often assumed to catch whatever steel passes them. They do not. Whether a fragment is caught depends on the field and how steeply it changes, the fragment's shape, how far from the magnet it passes and what the product does to it on the way.

This chapter works out the force on a steel fragment in a magnet's field, applies it to the plate magnet over Line 4's product conveyor and the grate magnet in its seasoning hopper, explains why stainless steel is a separate problem, and sets out how to test that a separator still catches what it should. The error is a plate magnet raised to clear a taller product.

## The force on a fragment

A uniform field does not pull a piece of steel anywhere; it only turns it. A steel fragment is attracted towards a magnet because the field is stronger close to the magnet than further away, and the fragment, magnetised by the field, is pulled up the gradient. The force is the fragment's magnetic moment times the field gradient.

For a small, soft steel sphere far below saturation, the field magnetises it to three times the applied field strength, because its own demagnetising field limits it, whatever its permeability. That gives a simple result:

```figure
type: formula
title: Magnetic force on a small soft-steel fragment
formula: Sphere: F = 3 × V × B × (dB/dz) ÷ μ₀
formula: Force ÷ weight = 3 × B × (dB/dz) ÷ (μ₀ × ρ × g)
formula: Field falling as B = B₀ × e^(−z/λ): force ÷ weight = 3B² ÷ (μ₀ × ρ × g × λ)
caption: The fragment's volume cancels from the ratio of force to weight: a small sphere and a large one feel the same ratio at the same place. Elongated fragments lying along the field are magnetised much more strongly and feel several times the force, until they saturate.
- B, dB/dz | flux density and its gradient where the fragment is
- V, ρ | fragment volume and density, 7,850 kg/m³ for steel
- λ | the distance over which the field falls by a factor of e, from the magnet's data
```

Three things follow. First, what matters is the product of the field and its gradient, not the field alone: a strong, uniform field catches nothing. Second, for compact fragments, the ratio of magnetic force to weight does not depend on size, so small fragments are not harder to catch than large ones in still air; they are harder to catch in practice because the product's flow and drag hold them more, relative to their weight. Third, shape matters a great deal. A thin wire lying along the field is weakly demagnetised by its own shape and becomes magnetised perhaps twenty times the applied field rather than three times, so it feels about seven times the force of a sphere of the same volume, until it saturates near the magnet.

## The plate magnet over the conveyor

This is an illustration. Line 4's product conveyor carries seasoned snacks at 1.0 m/s in a layer up to 60 mm deep. A ferrite plate magnet, 600 mm long in the direction of travel, is suspended above the belt. Its maker's data give the flux density below its face as 0.12 T at 50 mm and 0.06 T at 100 mm, which fits an exponential fall with λ = 72 mm and about 0.24 T at the face.

```figure
type: compare
title: Lift on steel fragments below the plate magnet, by distance from its face
cols: Flux density, T | Sphere: force ÷ weight | Wire along the field: force ÷ weight
rowhead: Distance from magnet face
- 50 mm | 0.120 | 6.2 | about 35, saturated
- 75 mm | 0.085 | 3.1 | 20.6
- * 100 mm | 0.060 | 1.54 | 10.3
- 125 mm | 0.042 | 0.77 | 5.1
- 150 mm | 0.030 | 0.38 | 2.6
caption: This is an illustration. Field from the case's invented maker's data, λ = 72 mm. Wire figures assume a demagnetising factor of 0.05, about 6.7 times the sphere's force, capped where the wire saturates. A ratio below 1 means the fragment is not lifted against its weight, before any drag from the product.
```

With the magnet's face 100 mm above the belt, a fragment on the belt under a 60 mm layer of product is 100 mm from the face, where a compact fragment's lift is 1.54 times its weight. It will rise, if the product lets it, with a net upward acceleration of about (1.54 − 1) × 9.81 = 5.4 m/s², and would rise the 60 mm to the top of the layer in about 0.15 s in free air. The belt carries it under the 600 mm magnet in 0.6 s. The margin is real but not large, and product drag, interlocking snacks and a deeper layer all eat into it. A wire fragment at the same place feels ten times its weight and is caught easily.

The calculation also explains why a plate magnet is usually rated by its reach, the distance at which it can lift a stated test piece, rather than by its surface field. The surface field says little about what happens 100 mm away; the reach, measured with a defined piece under defined conditions, describes the job the magnet is bought for. When comparing separators, the plant asks for the field and gradient at the working distance, or the reach for its own test pieces.

### Burden depth and placement

The table shows why a separator's height above the belt is critical. Moving the magnet from 100 mm to 150 mm above the belt cuts the lift on a compact fragment at the belt surface from 1.54 to 0.38 times its weight: it is no longer lifted at all. Because the field falls exponentially, every few centimetres of extra distance cost a large share of the force. The usual practice is to put the magnet as close to the product as the largest pieces allow, keep the burden depth even, and, where possible, place the magnet where the product falls or tumbles, at a transfer point, so that fragments are loose and pass close to the magnet's face.

## The grate magnet in the hopper

This is an illustration. The seasoning hopper's grate magnet has NdFeB rods 25 mm in diameter at 50 mm centres, so the widest gap between rods is 25 mm and no particle can pass more than 12.5 mm from a rod's surface. The maker's data give about 1.0 T at the rod's surface, falling with λ ≈ 8 mm.

At 12.5 mm from a rod, the flux density is about 1.0 × e^(−12.5/8) = 0.21 T and its gradient about 0.21 ÷ 0.008 = 26 T/m. A compact steel fragment there feels a force about 3 × 0.21 × 26 ÷ (4π × 10⁻⁷ × 7,850 × 9.81) = 170 times its weight. The grate's short-range, steep field makes it far more powerful than the plate magnet for fine fragments that pass close to it, which is why grates are used in free-flowing powders and granules. Its limitation is the opposite: the field reaches only a few centimetres, so everything must pass between the rods.

Fragments caught on a grate are not held forever. A build-up of captured fines on the rods pushes later fragments further from the surface, and a fast product flow can scour fragments off. Grates are cleaned at a set frequency, often every shift, and the catch is recorded, because what a grate catches is evidence of where metal is coming from.

## Other separator types

The same physics governs every magnetic separator; the designs differ in where they put the field and how they remove what they catch.

- **Overband magnets** hang across or along a belt conveyor carrying bulk material and include their own small belt that carries captured steel off to the side, so they clean themselves continuously. They are common on quarry, recycling and mineral conveyors, where the burden is deep and the tramp steel large.
- **Drum and pulley magnets** put the magnet inside the conveyor's head pulley or a rotating drum, so that steel is held to the belt or drum as the product falls away, and released further round. They catch steel at the point where the product is loosest.
- **In-line magnets** for pipelines and pneumatic conveying place rods or plates inside a housing in the flow, and are cleaned by withdrawing the magnet.
- **Plate and grate magnets**, as in Line 4, are simple and cheap, and must be cleaned by hand.

For bulk solids, the burden's depth and the way the material flows past the magnet usually decide which design works; *Bulk Solids Flow by the Numbers* covers how bulk materials move through chutes and transfers, which is where many separators are best placed.

## Reading the catch

What a separator catches is evidence about the process upstream. A steady trickle of fine grey particles on a grate is usually wear debris from equipment; a sudden piece of wire points to a screen; a nut or washer to a loose fastener. The plant logs each shift's catch by weight and by type, with photographs of anything unusual, and reviews the log weekly with maintenance.

Trends in the log lead to sources. In the case's first year, the grate's catch of fine particles rose steadily over two months; maintenance traced it to a worn auger flight in the seasoning feeder, replaced the flight, and the catch fell back. Without the log the wear would have continued until the flight failed, and the grate would have been the last line of defence against a larger fragment. A separator that is cleaned but not logged throws that evidence away with the catch.

## Stainless steel

Austenitic stainless steels such as 304 and 316, the most common materials of food equipment, are not ferromagnetic when annealed. Their magnetic susceptibility is tiny, and the force on a fragment of them in a separator's field is a small fraction of the force on carbon steel, too small to catch it in practice. Fragments that have been heavily cold-worked, such as shavings from a worn part, can be weakly magnetic, because cold work transforms some austenite to martensite, but they cannot be relied on to be caught.

Magnets are therefore one control among several. Metal detectors after packing detect stainless steel and other metals by their effect on an alternating field, and X-ray inspection detects dense contaminants regardless of magnetism. A plant's food safety plan states which hazard each control addresses; magnetic separators address ferrous metal, mainly upstream where they also protect equipment.

## Testing capture

A separator's capture can decline without any visible change: the magnet weakens from heat or corrosion, the gap to the product grows, the burden deepens or the line speeds up. Two tests show whether it still works.

The first measures the magnet. For a grate, a pull test with a standard steel test piece, pulled from the rod's surface with a calibrated gauge, gives a force that can be compared with the value when new; a gaussmeter reading at fixed points does the same. For a plate magnet, a gaussmeter reading at a fixed distance below the face, using a jig so that the distance is the same every time, is the usual check.

The second measures capture. Test pieces of known size and material, ferrous and stainless, are introduced into the product stream upstream of the separator under normal running conditions, and the separator is checked to see which were caught. The plant uses small steel spheres and short lengths of steel wire, with stainless pieces to confirm that the metal detector, not the magnet, catches those.

```figure
type: checklist
title: Line 4's separator checks
caption: This is an illustration of the plant's schedule. The open item is the one that this chapter's error showed was missing.
- x Grate cleaned each shift | catch weighed and recorded, pieces identified where possible
- x Grate pull test monthly | each rod at marked points, compared with the value when new
- x Plate magnet field reading monthly | gaussmeter in a jig at 100 mm below the face
- ? Plate magnet height checked after any change to the line | against the height in the separator's specification
- x Capture test quarterly | steel spheres and wire through each separator; stainless pieces to the metal detector
```

## The error: a magnet raised for a taller product

This is an illustration. A new product with larger, irregular pieces was introduced on Line 4. During trials, pieces caught on the plate magnet's lower edge, so a fitter raised the magnet from 100 mm to 150 mm above the belt, which cleared them. The change was not recorded as a change to the separator.

Weeks later, the metal detector after the bagger rejected several packs, and the rejected packs contained small steel fragments from a worn screen upstream. The plate magnet should have caught them. At 150 mm, compact fragments at the belt surface felt a lift of only 0.38 times their weight; the magnet was still there and still magnetised, but it could no longer lift them through the product. A capture test at the new height confirmed that the steel spheres passed through.

The plant lowered the magnet back to 100 mm and fitted a short spreader plate upstream to keep the large pieces from piling up, so that the burden depth stayed under 60 mm. It added the magnet's height to the separator's specification, with a marked bracket, and made any change to it a change requiring a capture test before production.

## Exercise: a second magnet

This is an illustration. Instead of lowering the plate magnet, the plant considers keeping it at 150 mm and adding a second, identical magnet at 125 mm further along.

1. What lift on a compact fragment at the belt surface does each magnet give?
2. Would either catch compact fragments at the belt surface?
3. What would catch them?

**Worked answer.**

1. At 150 mm, **0.38** times the fragment's weight; at 125 mm, **0.77** times.
2. **No.** Both are below 1, so neither lifts a compact fragment from the belt surface, however many magnets are added at those heights. Adding magnets increases the time a fragment spends under a field, which helps only if each field can lift it.
3. **A magnet close enough, or a different position.** The magnet at 100 mm with an even burden, or a magnet at a transfer point where the product falls past its face, so that fragments pass close to it. Whatever is chosen, a capture test with the plant's own test pieces, at the real burden depth and line speed, is the evidence that it works.
