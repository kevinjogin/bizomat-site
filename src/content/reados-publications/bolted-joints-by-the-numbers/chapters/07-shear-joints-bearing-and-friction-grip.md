---
book: bolted-joints-by-the-numbers
chapterSlug: shear-joints-bearing-and-friction-grip
order: 7
title: "Joints in shear: bearing type and friction grip"
description: "How bolted joints carry shear: by bolts bearing on their holes or by the friction their preload creates, how to check each, and what painted faying surfaces do to slip."
draft: false
---

Many bolted joints are loaded across the bolts rather than along them. A splice in a beam, a bracket on a column, a gusset in a frame: the load tries to slide one plate over another. There are two ways such a joint can carry it. In a bearing-type joint the plates slip until the bolts touch the sides of their holes, and the bolts then carry the load in shear while the plates carry it in bearing. In a friction-grip joint, also called slip-critical or slip-resistant, the bolts' preload clamps the plates so hard that friction between them carries the load and nothing slips at all.

This chapter checks the CT-1 frame's beam splice both ways, with the WORKOS bolt and pin shear and bearing tool and the friction-grip joint tool. Its mistake is a coat of paint in the one place a friction joint cannot have it.

## The frame splice

The CT-1's main frame is a long welded steel frame that reacts the forces of the cylinders under test. To get it into the workshop, the fabricator made the main bottom beam in two pieces, spliced near the middle with a cover plate above and below its 16 mm flange, each 12 mm thick, and six M20 property class 8.8 bolts through each side of the splice. Each bolt passes through both cover plates and the flange, so it has two shear planes. The splice carries a design force of 150 kN in the flange along the beam. This is an illustration.

The rig sets cylinders up between fixed points on the frame and pulls or pushes them through their stroke under load. If the splice slips, even by a millimetre or two, the frame's alignment changes and a cylinder under test sees a side load it was never meant to carry. So the splice must not slip: it is designed as a friction-grip joint, with the bolts as a backup in bearing if it does.

## Bearing-type joints

Once the plates have slipped into contact with the bolts, each bolt is sheared across each plane where the plates meet, and pushes on the side of its hole in each plate.

```figure
type: formula
title: Bolt shear and plate bearing
formula: τ = F ÷ (n m π d² ÷ 4)
formula: σb = F ÷ (n d t)
caption: F is the total shear load, n the number of bolts, m the number of shear planes per bolt, d the diameter at the shear plane and t the thinnest plate thickness in bearing. Equal sharing among the bolts is assumed; in a long line of bolts the end bolts carry more until the joint yields slightly.
- τ | shear stress in each bolt
- σb | bearing stress on the plate at each hole
```

The [bolt and pin shear and bearing tool](/tools/bolt-shear-bearing/) takes the total load, the number of fasteners, single or double shear, the diameter at the shear plane, the thinnest plate in bearing and the allowable shear and bearing stresses. It returns the shear stress, the bearing stress, their utilisations and which governs. It assumes equal load sharing and does not check edge distance, net section or block shear of the plates.

For the splice, the flange plate carries the whole 150 kN in bearing, the two cover plates half each, so the flange's 16 mm is the thickness that governs bearing. The shop's allowables for the bearing backup are 200 MPa in bolt shear and 300 MPa in bearing. This is an illustration; structural joints are checked to the steel structures standard's capacities, not to allowable stresses chosen by a shop.

```figure
type: steps
title: The splice as a bearing-type joint in the bolt shear and bearing tool
caption: This is an illustration. 150 kN, 6 bolts, double shear, 20 mm at the shear plane, 16 mm flange in bearing, allowables 200 MPa shear and 300 MPa bearing.
- Shear stress | 39.8 MPa
- Shear utilisation | 19.9%
- * Bearing stress | 78.1 MPa
- Bearing utilisation | 26.0%: ADEQUATE
- Governing mode | Plate bearing
```

The bolts and plates have a large margin as a bearing-type joint. That is the backup. The question for this joint is whether it slips at all.

### Shear on the thread

The stress was calculated on the bolt's full 20 mm diameter, which is right only if the shear planes cross the plain shank. If a shear plane crosses the thread, the area is closer to the root area, about a quarter less. The splice bolts were specified long enough that their thread ends inside the far cover plate's washer, so both shear planes cross plain shank; Chapter 6's grip length check is the way to confirm it.

### What the plates must also survive

The shear and bearing tool checks the bolts and the bearing at each hole. A bolted plate can also fail between the holes and its edge, or across the line of holes. If a hole is too close to the end of a plate, the bolt can tear out the strip of steel in front of it. If the holes take too much of the plate's width, the net section left between them can yield in tension. And a group of bolts can tear out a whole block of plate along a path through the holes, block shear. The tool's check list flags these; the shop checks them by the steel structures standard for the frame, and by the simple rule of at least one and a half hole diameters from a hole's centre to a plate's end for brackets and machine parts. The splice's cover plates were laid out with 40 mm end distances for 22 mm holes, and their net section across the first line of three bolts is far from yielding under 150 kN. This is an illustration.

## Friction-grip joints

In a friction-grip joint, each bolt's preload presses the plates together, and the friction on each faying surface, the contact surface between plates, resists sliding. The joint's slip resistance is the preload times the friction coefficient times the number of faying surfaces, summed over the bolts.

```figure
type: formula
title: Slip resistance of a friction-grip joint
formula: Rs = n m μ (Fp − Ft) ÷ SF
caption: n is the number of bolts, m the number of faying surfaces each bolt clamps, μ the slip coefficient of the surfaces, Fp the preload per bolt, Ft any applied tension per bolt, which reduces the clamp, and SF a slip safety factor. The slip coefficient depends entirely on the surface condition of the plates.
- Rs | slip resistance with the safety factor
- μ | slip coefficient
- m | faying surfaces per bolt
```

The [friction-grip bolted joint tool](/tools/friction-grip-joint/) takes the number of bolts, the bolt diameter and pitch, the proof strength, the preload as a share of proof, the nut factor, the slip coefficient, the number of faying surfaces, the slip safety factor, the shear load on the joint, any applied tension per bolt, the thinnest plate and the allowable bolt shear and bearing stresses. It returns the stress area, the preload and tightening torque per bolt, the clamp left after applied tension, the slip resistance with the safety factor, and the backup bolt shear and bearing stresses if the joint slips. It assumes torque-controlled preload and reminds the user that turn-of-nut or direct tension indicators suit critical joints better.

The splice bolts are preloaded to 70% of their proof load. The proof strength of class 8.8 in this size is 600 MPa in Shigley's tables, so the preload is 0.70 × 600 × 244.79 = 102.8 kN. The design assumed clean, unpainted steel at the faying surfaces with a slip coefficient of 0.35 and a slip safety factor of 1.25. This is an illustration; the slip coefficient and the tightening method for structural joints come from the steel structures standard.

```figure
type: steps
title: The splice in the friction-grip joint tool, as designed
caption: This is an illustration. 6 bolts M20 × 2.5 class 8.8 (proof 600 MPa), 70% of proof, K 0.20, slip coefficient 0.35, two faying surfaces, slip factor 1.25, shear 150 kN, no applied tension, flange 16 mm, allowables 200 and 300 MPa.
- Stress area | 244.8 mm²
- Preload per bolt | 102.81 kN
- Tightening torque | 411 N·m
- * Slip resistance with safety factor | 345.5 kN: NO SLIP
- Backup bolt shear / bearing | 39.8 / 78.1 MPa: the bolts carry the load in bearing if the joint slips
```

As designed, the joint resists 345.5 kN before slip after its safety factor, more than twice the 150 kN design load.

## The mistake: paint on the faying surfaces

The fabricator delivered the frame painted inside and out, including the faces of the flange and cover plates that clamp together at the splice. Nobody at the shop noticed; the drawing's note about masking the faying surfaces was on a separate sheet.

At commissioning, the rig's frame was load-tested to 125% of its design load, 187.5 kN through the splice. At about 180 kN there was a sharp bang and the frame's alignment marks moved by 1.5 mm at the splice. The joint had slipped into bearing.

The paint had changed the slip coefficient. The painted surfaces' coefficient was not known from the paint maker's data, so the engineer worked backwards: slip at about 180 kN with 12 faying surfaces carrying 102.8 kN each means a coefficient of about 0.15. This is an illustration.

```figure
type: compare
title: The splice's slip resistance by faying surface condition
cols: Slip coefficient | Resistance with factor 1.25 | Resistance without factor | At the 187.5 kN load test
rowhead: Faying surfaces
- * Clean, unpainted, as designed | 0.35 | 345.5 kN | 431.8 kN | Holds
- Lightly coated | 0.20 | 197.4 kN | 246.8 kN | Holds, with little margin
- Fully painted, as delivered | 0.15 | 148.1 kN | 185.1 kN | Slips
caption: This is an illustration. Six M20 class 8.8 bolts at 102.8 kN, two faying surfaces each. The friction-grip joint tool, run at 0.15, reports JOINT WILL SLIP against the 150 kN design load.
```

The bolts then carried the load in bearing, as the backup check said they could, so nothing broke. But the frame's alignment had shifted, and the slipped joint could slip back and forth under reversing loads, wearing the holes. The splice was dismantled, the paint removed from the faying surfaces back to clean steel, the frame realigned on its datum marks, new bolts fitted and tightened, and the joint retested to 187.5 kN without movement. The faying surface note was moved onto the main frame drawing, beside the splice detail.

## Why friction joints suit reversing loads

A bearing-type joint is fine for a load that always acts one way: it slips once, settles into bearing and stays there. Under a load that reverses, it slips back across the hole clearance every time the load changes direction. Each slip hammers the bolts against the hole walls, elongates the holes, and lets the frame move. The CT-1 pulls and pushes cylinders, so its splice sees reversing loads, which is a second reason, beyond alignment, for a joint that does not slip. Friction-grip joints also resist fatigue better, because the load passes through friction over a broad area around each hole instead of concentrating at the hole's edge.

## Tightening structural bolts

Structural bolts in friction-grip joints are tightened by the methods the steel structures standard and the structural bolting standard set out, commonly a part-turn method from snug or a load-indicating device, and their minimum tensions come from those standards. The friction-grip tool's torque figure, from the nut factor, is useful for understanding the joint but is not the method a structural engineer would accept on its own. For the CT-1's frame, the fabricator tightened the splice bolts by its procedure under the steel structures standard and gave the shop a record; the WORKOS figures above are the shop's own check of the joint's behaviour. This is an illustration.

## Preparing faying surfaces

A friction joint's surfaces are part of its design. They are left as rolled and cleaned of loose mill scale, oil and paint, or blasted, or coated only with a coating whose slip coefficient has been tested and published. They must be flat, so that the clamp reaches the whole surface, and burrs around the holes must be removed, so the plates sit flat against each other. Once a friction joint has been assembled, its surfaces must not be greased or painted at a later maintenance, which is why the shop's frame drawing marks the splice area as not to be painted.

## Hole clearance and slip distance

The 1.5 mm of slip was possible because the bolts sit in clearance holes: 22 mm holes for 20 mm bolts, 2 mm of diametral clearance. A bearing-type joint always slips by up to the hole clearance before it carries load, and in a frame that has to stay aligned, that slip is the real failure. Friction-grip joints are chosen precisely so that clearance does not matter. Where slip must be prevented and friction cannot be relied on, fitted bolts in reamed holes, or dowels beside the bolts, take the shear without movement. Fitted bolts cost more: the holes in both parts must be reamed together, or to a tight position tolerance, and the bolts are made to a close shank diameter. On the CT-1 they were considered for the splice and rejected, because the frame had to be assembled on site from two pieces, and holes reamed in the workshop would not have lined up after transport within a fitted bolt's clearance.

## Tension and shear together

The friction-grip tool's applied tension input covers joints where the same bolts also carry a tensile load, which reduces the clamp on the faying surfaces. If the splice bolts also carried 20 kN each in tension, from a bending moment in the beam, the clamp would fall from 102.8 to 82.8 kN per bolt, and the slip resistance with its factor from 345.5 to 278.3 kN. The splice sees no such tension, but a bracket in Chapter 8 does.

## Exercise: single shear

An earlier frame design had the splice with a single cover plate on one side of the flange, so each bolt had one faying surface and one shear plane. With the same six M20 class 8.8 bolts at 70% of proof and clean surfaces at 0.35, what is the slip resistance with the 1.25 factor, and the backup bolt shear stress at 150 kN?

### Worked answer

With one faying surface per bolt, the slip resistance halves: 6 × 1 × 0.35 × 102.81 ÷ 1.25 = 172.7 kN. That still exceeds 150 kN, by 15%.

The backup bolt shear stress with one shear plane doubles: 150,000 ÷ (6 × π × 20² ÷ 4) = 79.6 MPa, against 200 MPa. The bearing stress depends on the thinnest plate carrying the whole load; with one 12 mm cover plate against the 16 mm flange, it is 150,000 ÷ (6 × 20 × 12) = 104.2 MPa.

The friction-grip tool with one faying surface and the bolt shear and bearing tool with single shear give the same figures. The single-cover splice would hold, but with a slip margin of 15% instead of 130%, and a single cover plate also bends the joint because the load path is offset. Double covers were chosen for both reasons.
