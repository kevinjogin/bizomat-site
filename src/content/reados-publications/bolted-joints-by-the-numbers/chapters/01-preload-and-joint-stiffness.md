---
book: bolted-joints-by-the-numbers
chapterSlug: preload-and-joint-stiffness
order: 1
title: "Preload and joint stiffness: how a bolted joint carries load"
description: "Why a bolt and the parts it clamps act as two springs, how preload and their stiffnesses share an external load, when a joint separates, and what the joint constant means."
draft: false
---

Tighten a nut and two things happen at once. The bolt stretches, a little, and the parts it clamps squeeze together, a little less. Both are springs, held in balance by the same force: the preload. Everything a bolted tension joint does afterwards, how much extra load its bolts feel, when it opens, whether it leaks, whether its bolts fatigue, follows from that pair of springs and the force between them.

This chapter sets out the model that the rest of the book uses: bolt stiffness, member stiffness, the joint constant and the separation load. It applies it to the CT-1 test rig's test head, which closes a pressure chamber with eight M20 cap screws, and its mistake is an early design that sized the screws for the pressure load and forgot the preload's job.

## The test head

The CT-1's test chamber is a steel block with a 125 mm bore, sealed at its open end by a steel head. An O-ring in a face groove seals the head to the block, so the two steel faces meet metal to metal when the joint is tight. Eight M20 × 2.5 socket head cap screws, property class 10.9, pass through the 50 mm head and a 4 mm hardened washer into tapped holes in the block. The rig cycles cylinders at up to 25 MPa in endurance tests, and proof-tests the chamber itself at 31.5 MPa. This is an illustration.

At 25 MPa, the pressure on the 125 mm sealing diameter pushes the head off with π ÷ 4 × 125² × 25 = 306.8 kN, or 38.35 kN for each of the eight screws. At the proof test, 31.5 MPa, it is 48.32 kN per screw.

## Two springs and one force

A bolt's stiffness is that of a bar in tension: area times modulus over length. A bolt has two lengths in the grip, the plain shank and the threaded part, and they act in series, so their flexibilities add. The threaded part is counted on its tensile stress area, the effective area of the thread that standards and texts use for stress.

The clamped members are harder to model, because the bolt's force spreads out from under the head into a wider region of the plate. The usual model treats the compressed zone as a pair of cones, frustums with a half-angle of about 30°, meeting at the middle of the grip. That gives a member stiffness several times the bolt's for steel plates.

```figure
type: formula
title: Bolt and member stiffness, and the joint constant
formula: 1 ÷ kb = Ls ÷ (E Ad) + Lt ÷ (E At)
formula: km = 0.5774 π E d ÷ (2 ln[5 (0.5774 l + 0.5 d) ÷ (0.5774 l + 2.5 d)])
formula: C = kb ÷ (kb + km)
caption: Ls and Lt are the plain shank and threaded lengths in the grip, Ad the shank area and At the tensile stress area. l is the grip length and d the bolt diameter. The member formula is the 30° frustum estimate for plates of one material with washer-face bearing. C, the joint constant, is the share of any external load that reaches the bolt.
- kb | bolt stiffness
- km | member stiffness
- C | joint constant
```

For a cap screw into a tapped hole, the grip is not simply the clamped thickness, because the screw's thread engages over some depth of the block. Shigley's takes an effective grip of the clamped thickness plus half the screw diameter when the engagement is longer than the diameter. For the test head that is 54 + 10 = 64 mm, of which 16 mm is threaded: 6 mm of thread inside the head and washer, and the 10 mm allowance in the block.

## What happens when the pressure rises

Once the joint is preloaded, the bolt is stretched by Fi ÷ kb and the members compressed by Fi ÷ km. When an external load P tries to pull the head off, it stretches the bolt a little more and lets the members spring back a little. Both move by the same amount, because they are clamped together, so the load divides between them in proportion to their stiffnesses: the bolt gains C × P, and the members lose (1 − C) × P of their clamping force.

```figure
type: formula
title: Load sharing in a preloaded tension joint
formula: Bolt load Fb = Fi + C P
formula: Clamp force Fm = Fi − (1 − C) P
formula: Separation load P0 = Fi ÷ (1 − C)
caption: Fi is the preload and P the external tensile load per bolt. While the members stay in contact the bolt feels only the share C of the external load. At P0 the clamp force reaches zero and the joint opens; beyond it the bolt carries the whole external load.
- Fb | bolt load
- Fm | remaining clamp force on the members
- P0 | external load at which the joint separates
```

This is the central fact about bolted joints. A well-preloaded joint protects its bolts: most of an external load goes into unloading the members, not into stretching the bolt further. And it explains why the preload, not the bolt's strength, is what keeps a joint shut.

## The test head in the tool

The [bolted joint load sharing and separation tool](/tools/bolted-joint/) takes the nominal diameter, pitch, grip length, threaded length in the grip, the bolt's modulus, either a frustum estimate of member stiffness from the members' modulus or an entered member stiffness, the preload, the external tensile load per bolt and the bolt's proof strength. It returns the bolt and member stiffnesses, the joint constant, the bolt load and stress, the remaining clamp force and the separation load, with checks for separation and for the bolt staying within its proof strength. It treats a concentric tension joint; prying, bending and thermal loads are outside it.

The shop preloads the screws to 70% of their proof load, for reasons Chapter 4 sets out. Property class 10.9 has a proof strength of 830 MPa in Shigley's tables, and an M20 × 2.5 has a tensile stress area of 244.8 mm², so the proof load is 203.2 kN and the preload 142.2 kN. This is an illustration.

```figure
type: steps
title: The test head joint in the bolted joint tool, at 25 MPa
caption: This is an illustration. M20 × 2.5, grip 64 mm, 16 mm threaded in the grip, steel bolt and members at 207 GPa, frustum member stiffness, preload 142.2 kN, external load 38.35 kN per screw, proof strength 830 MPa.
- Bolt stiffness | 949 kN/mm
- Member stiffness | 3,781 kN/mm
- Joint constant C | 0.2006: the bolt sees 20.1% of the external load
- Bolt load / stress | 149.92 kN / 612 MPa
- * Remaining clamp force | 111.57 kN: JOINT HOLDS
- Separation load | 177.92 kN, 4.64 times the external load
```

Each screw starts at 142.2 kN. When the chamber reaches 25 MPa, each screw gains only 7.7 kN, a fifth of the 38.35 kN it is asked to carry, and the faces still press together with 111.6 kN. The joint would not open until the load per screw reached 177.9 kN, which would take a pressure of about 116 MPa.

```figure
type: line
title: The test head joint diagram: bolt load and clamp force against external load
x: External load per screw, kN
y: Force, kN
caption: This is an illustration. Preload 142.2 kN, C = 0.2006. The bolt load rises slowly and the clamp force falls quickly as the pressure rises. At 25 MPa the external load is 38.35 kN; at the 31.5 MPa proof test, 48.32 kN.
series: Bolt load | Clamp force
- 0 | 142.23 | 142.23
- 10 | 144.23 | 134.23
- 20 | 146.24 | 126.24
- 30 | 148.24 | 118.24
- 38.35 | 149.92 | 111.57
- 48.32 | 151.92 | 103.60
```

At the 31.5 MPa proof test the screws carry 151.9 kN each, 620 MPa on the stress area, still below the 830 MPa proof strength, and the faces are still clamped with 103.6 kN.

### Why the members are stiffer

The member stiffness is four times the bolt's because the compressed cone of steel under the screw head is much larger in area than the screw. That ratio, and so the joint constant, depends on the grip, the bolt diameter and the members' material. Long thin bolts through thick plates give a small C; short stubby bolts or soft members, such as aluminium, cast iron or a gasket, give a larger one. Chapter 5 shows what a larger C does to fatigue, and Chapter 9 what a gasket does.

### Where the load goes in

The simple model assumes the external load is applied at the bolt's head and nut, pulling the two outer faces of the joint apart. In the test head that is close to true: the pressure acts on the inside face of the head, near the screw heads' line, and pulls the whole head away from the block. In many joints the load enters partway into the clamped parts instead, for example through a bracket welded to the middle of a flange. Then only part of each member is unloaded by it, the bolt sees a smaller share than C, and the simple model is conservative for the bolt but optimistic for separation. The German guideline VDI 2230 handles this with a load introduction factor; the BIZOMAT tools use the simple model, and the shop treats their joint constant as an upper bound on the bolt's share.

### Washers, embedding and relaxation

A tightened joint loses some of its preload in the first hours and days, without anything coming loose. The surfaces under the head, under the nut and between the plates are never perfectly smooth, and their high spots flatten under the clamp force. Each micrometre they flatten lets the bolt shorten and the members spring back, and because the two springs act in series, every micrometre costs 949 × 3,781 ÷ (949 + 3,781) = 759 kN/mm × 0.001 mm, about 0.76 kN of preload. A few micrometres of embedding at each interface is normal, so a few per cent of the preload goes.

Hardened washers under the screw heads spread the load and reduce embedding into the softer head, which is why the test head has them. Fewer interfaces, smoother surfaces and longer, more flexible bolts all reduce the loss. Long bolts are more tolerant of embedding precisely because they are less stiff: the same few micrometres cost them a smaller share of their preload. Chapter 3 shows how the shop measures what is left.

### Members of different materials

The frustum formula assumes one material. When a steel head is clamped to an aluminium block, or a cast-iron cover to a steel frame, each cone has its own modulus, and the member stiffness is found by treating the two halves as springs in series, each worked out for its own thickness and modulus. A softer member raises the joint constant, because it is less stiff against the bolt. A joint with an aluminium member at 70 GPa can have twice the joint constant of the same joint in steel. The CT-1's test head is steel throughout, so the single-material estimate applies. The aluminium valve manifold in Chapter 10 is clamped through its own aluminium body, so the same formula is used there with aluminium's modulus, and gives a joint constant more than twice the test head's.

## The mistake: screws sized for the pressure alone

The CT-1's first layout drawing, from a draftsperson working to a deadline, showed eight M12 × 1.75 cap screws of property class 10.9 for the test head. The reasoning was written on the drawing: 48.3 kN per screw at the proof test, against a proof load of 69.9 kN for an M12 10.9: a factor of 1.45.

That compares the external load with the bolt's strength, as if the joint were a hook on a rope. It ignores the preload's job, which is to keep the faces closed. The reviewing engineer ran the M12 design through the bolted joint tool.

```figure
type: compare
title: M12 and M20 test head screws at the 31.5 MPa proof test
cols: Preload, kN | Joint constant | Separation load, kN | Clamp left at 48.32 kN | Verdict
rowhead: Screws, eight, class 10.9, 70% of proof
- M12, nominal preload | 49.0 | 0.157 | 58.0 | 8.2 kN | Holds, with little margin
- M12, preload 20% low | 39.2 | 0.157 | 46.4 | −1.6 kN | JOINT SEPARATES
- * M20, nominal preload | 142.2 | 0.201 | 177.9 | 103.6 kN | Holds
caption: This is an illustration. M12 grip taken as 60 mm with 12 mm threaded; M20 as above. A torque-tightened screw can easily be 20% below its nominal preload, which Chapter 4 allows for.
```

At its nominal preload, the M12 design keeps only 8.2 kN of clamp at the proof test. At the low end of the preload that torque tightening can give, it separates. A separated test head lets the O-ring extrude into the gap, and on the next cycle the ring is cut. On a rig that cycles to 25 MPa, it would also put the whole external load on each screw at every cycle, which Chapter 5 shows is a fatigue disaster.

The M20s were chosen to keep the head clamped, with margin, at the proof test and with the low end of the preload. Their strength is far more than the pressure needs. That is normal for a pressure joint: its bolts are sized by the preload they must hold, not by the load they carry.

## How to read a bolted joint calculation

Three numbers summarise a tension joint, and the shop reads them in this order:

```figure
type: checklist
title: Reading a tension joint calculation
caption: The CT-1 design review's order of checks. This is an illustration.
- x Separation load against the highest external load, at the lowest preload the tightening method can give
- x Bolt stress at the highest preload plus its share of the highest external load, against proof strength
- x Alternating bolt stress from the cyclic external load, against the bolt's fatigue strength
- x Member stiffness: frustum estimate only for plates of one metal; measured or calculated for gaskets, castings or mixed materials
- x Effects outside the model: prying from flange bending, eccentric loads, temperature
```

Chapter 4 turns this list into a single design check with the preload scatter built in.

## Stored energy in a tightened joint

A preloaded screw is a stretched spring. Each M20 in the test head stretches by about 0.15 mm at its 142.2 kN preload and holds ½ × 142.2 kN × 0.15 mm, about 10.7 J. A screw that breaks while tight releases that energy as a sharp crack and can throw its head. More important, a pressurised chamber holds far more energy in the compressed oil and the stretched steel around it. The shop's procedure never loosens or tightens a test head screw with the chamber under any pressure, and bleeds the chamber to zero, with its gauge confirming it, before any joint is touched. The model Code of Practice for managing the risks of plant from Safe Work Australia expects stored energy of this kind to be identified and controlled during maintenance.

## Exercise: a thinner head

To save weight on a portable version of the rig, a designer proposes a 35 mm head instead of 50 mm, with the same 4 mm washer and M20 10.9 screws. The effective grip becomes 35 + 4 + 10 = 49 mm, with the same 16 mm of thread in it. Using the bolted joint tool's formulas, find the bolt and member stiffnesses, the joint constant and the separation load at a 142.2 kN preload. Does the shorter grip help or hurt?

### Worked answer

The shank length in the grip is 49 − 16 = 33 mm. The bolt stiffness is 1 ÷ [33 ÷ (207,000 × 314.16) + 16 ÷ (207,000 × 244.79)] = 1 ÷ (5.074 × 10⁻⁷ + 3.158 × 10⁻⁷) = 1,215 kN/mm.

The member stiffness by the frustum formula with l = 49 mm is 0.5774 × π × 207,000 × 20 ÷ (2 ln[5 × (28.29 + 10) ÷ (28.29 + 50)]) = 7,509,700 ÷ (2 ln 2.4454) = 7,509,700 ÷ 1.7884 = 4,199 kN/mm.

The joint constant is 1,215 ÷ (1,215 + 4,199) = 0.2244, and the separation load 142.2 ÷ (1 − 0.2244) = 183.4 kN.

The bolted joint tool gives the same figures. The shorter grip makes both the bolt and the members stiffer, but the bolt more so, so the joint constant rises from 0.201 to 0.224: the screw sees 22% of the external load instead of 20%. The separation load rises slightly, to 183.4 kN, so the head stays shut, but the screws' alternating stress in fatigue rises by about 12%, and a thinner head bends more under pressure, which the simple model does not include. The portable rig would need its head checked for bending before the idea went further.
