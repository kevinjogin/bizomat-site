---
book: printed-mechanisms-that-run
chapterSlug: join-parts-without-stripping-them
order: 7
title: "Join parts without stripping them"
description: "Choose between inserts, nut traps, self-tapping screws and snap fits, limit screw torque so plastic does not crush or creep, and test joints that must be reassembled."
draft: false
---

Printed parts are joined to each other, and to bought parts, dozens of times in a mechanism like the indexing table. Each joint is a small design problem with a few common failure modes: threads that strip, bosses that split, clamped plastic that slowly crushes and loosens, and snap fits that break after a handful of uses. Most of these failures come from treating plastic like metal.

This chapter sets out the joining options, shows how to choose among them for a mechanism that students will take apart and reassemble, and works through the numbers that matter: insert holes, screw torque, clamp pressure and snap-fit strain.

## Know the options

```figure
type: compare
title: Ways to join printed parts
cols: Reassembly | Strength | Best use
caption: For a mechanism that will be taken apart repeatedly, threads must be in metal, not in plastic.
- Self-tapping screw into a printed hole | A few times, then strips | Moderate | Parts assembled once
- Captive nut in a hex pocket | Many times | Good | Where the back of the joint is reachable at assembly
- *Heat-set threaded insert | Many times | Good | Most screwed joints in a reassembled mechanism
- Through-bolt and nut | Many times | Good | Where both sides are accessible
- Snap fit | Tens of times if designed for it | Low to moderate | Covers and lids
- Adhesive | Never | Good if surfaces are prepared | Permanent subassemblies only
```

The first decision follows directly from the scope in Chapter 1: the table is reassembled by students each term. Any thread that will be used repeatedly must be in metal. That rules out self-tapping screws into printed holes for anything except parts that are assembled once, and it makes heat-set inserts the default.

## Install heat-set inserts properly

A heat-set insert is a small brass sleeve, threaded inside and knurled outside. It is pressed into a slightly undersized printed hole with a heated tool. The plastic around the hole softens, flows into the knurls and solidifies, locking the insert in place. The result is a metal thread in a plastic part.

Insert makers publish hole sizes and depths for each insert size, and those values should be used. This is an illustration. The table's M3 inserts are 5.7 mm long; the maker's data sheet for printed parts gives a 4.0 mm hole, and the designer made each hole 7.5 mm deep, leaving about 1.8 mm below the insert for displaced plastic and for the screw tip.

```figure
type: checklist
title: Installing an M3 heat-set insert
caption: This is an illustration. A crooked insert makes every later screw start at an angle; a jig or a guide on the soldering iron is worth the effort.
- x Hole size and depth | 4.0 mm, 7.5 mm deep, from the insert data sheet
- x Boss wall | at least 2 mm around the hole; four or five walls in the slicer
- x Tool temperature | as recommended for the material; too hot and plastic floods the thread
- x Alignment | insert pressed square, with a guide or a drill-press style stand
- *x Flush finish | insert top level with or just below the surface, then pressed flat while cooling
- x Check | screw runs in by hand without binding
```

Two installation faults are common. Pressing the insert in at an angle leaves it crooked, so screws start cross-threaded. Overheating or pushing too hard floods molten plastic into the insert's thread, so the screw will not run in. A simple vertical guide, such as a drill stand holding the iron, and patience while the insert sinks under its own light pressure, prevent both.

## Size each screw from its stack

With three standard screw lengths, every screwed joint must be designed so that one of them fits. A screw that is too short engages only part of the insert's thread; one that is too long passes through the insert and bottoms in the hole, so the head never clamps, or it pushes the insert out of the back of the boss.

This is an illustration. Each insert is 5.7 mm long in a 7.5 mm deep hole, leaving 1.8 mm of empty hole below it. A screw should engage most of the insert's length and protrude below it by no more than about 0.8 mm, keeping at least 1 mm clear of the bottom. For a joint clamping a printed part of thickness t with a 0.5 mm washer, the screw's engagement is its length minus t minus 0.5.

```figure
type: compare
title: Clamped thickness for each standard screw
cols: Clamped part plus washer | Engagement in the insert | Below the insert
caption: This is an illustration. Each printed part that a screw passes through was made one of these thicknesses, so every joint uses one of the three standard lengths with full engagement and no bottoming.
- M3 × 8 | 2.0 + 0.5 = 2.5 mm | 5.5 mm | none; 0.2 mm short of the insert's end
- *M3 × 12 | 5.0 + 0.5 = 5.5 mm | 6.5 mm | 0.8 mm, leaving 1.0 mm clear
- M3 × 20 | 13.0 + 0.5 = 13.5 mm | 6.5 mm | 0.8 mm, leaving 1.0 mm clear
```

Designing the clamped thicknesses to suit the screws, rather than choosing screws to suit arbitrary thicknesses, is what made the three-screw standard from Chapter 1 work. The frame's side-plate flanges are 5.0 mm thick for M3 × 12 screws; the motor mount's clamping lugs are 13.0 mm thick for M3 × 20 screws; the thin cover tabs are 2.0 mm thick for M3 × 8 screws.

## Design bosses that do not split

The plastic around an insert or a screw is stressed when the insert is installed, when the screw is tightened and whenever the joint is loaded. Thin bosses split, usually along a layer line or along the seam.

A practical starting point is a boss outside diameter about twice the insert's hole diameter, 8 mm for the 4.0 mm hole here, with at least four walls in the slicer so the boss is solid around the insert. Bosses near an edge should be tied back to the nearest wall with a rib, and should sit at least a boss radius from the edge of the part. Where a boss must sit close to an edge, orient the part so the layer lines run across the likely crack, not along it. The table's bosses all follow those rules, and none has split in testing.

## Limit screw torque for plastic

A steel M3 socket-head screw can be tightened far harder than the plastic around it can tolerate. Tightened as if into steel, the screw crushes the plastic under its head, pulls the insert out of its boss, or clamps so hard that the plastic creeps and the joint loosens within weeks.

This is an illustration. The designer measured how much torque the joint could take by tightening screws into ten test inserts in PLA, using a small torque screwdriver, until the insert began to turn in its boss. The average was about 1.1 N·m. The designer chose an assembly torque of **0.25 N·m**, about a quarter of that.

The torque sets the screw's clamp force. A common approximation relates torque T to clamp force F by T = K × F × d, where d is the screw diameter and K is a nut factor, often taken as about 0.2 for plain steel screws. The value is an approximation, and friction varies widely, but it gives a useful estimate.

```figure
type: formula
title: Clamp force and pressure under an M3 screw head
formula: F = T ÷ (K × d); pressure = F ÷ bearing area
caption: This is an illustration using a nut factor of 0.2. Bearing areas are for an M3 socket head 5.5 mm across on a 3.4 mm hole, and for an M3 washer 7 mm across.
- F | clamp force, N
- T | tightening torque, N·m
- K | nut factor, assumed 0.2
- d | screw diameter, 0.003 m
step: At 0.25 N·m: F ≈ 0.25 ÷ (0.2 × 0.003) ≈ 417 N
step: Under the bare head, area about 14.7 mm²: about 28 MPa
step: Under a 7 mm washer, area about 29.4 mm²: about 14 MPa
```

A few hundred newtons from a tiny screw is more than many people expect. Under the bare screw head, the pressure on the printed surface is about 28 MPa. That is a significant sustained stress for PLA, and over time the plastic under the head would creep, letting the clamp force fall. A standard M3 washer roughly doubles the bearing area and halves the pressure to about 14 MPa. The table uses a washer under every screw head that bears on printed plastic.

Had the designer used 0.4 N·m, the clamp force would have been about 667 N and the pressure under a bare head about 45 MPa, enough to leave a visible ring in the plastic. Torque, washer and plastic must be considered together.

## Accept that plastic joints relax

Even at a sensible torque, a screwed joint in plastic loses some clamp force over time as the plastic creeps. The effect is larger in warm conditions and with PLA than with PETG. For the table, this matters in two ways.

First, joints that must stay tight, such as the motor mount after it has been set with the alignment tool, should be checked and retightened after the first few hours of running. The build guide in Chapter 9 includes that step. Second, joints that locate parts accurately should not rely on clamp force alone. Dowel pins, printed bosses that engage holes, or stepped faces should set position; screws should hold the parts together. This is the same separation of locating and clamping used in fixture design, and it makes a printed mechanism much more tolerant of relaxed screws.

A simple way to see relaxation is a witness mark. After the joint is tightened to its design torque, draw a short line with a paint marker across the screw head, the washer and the part. If the screw later turns, even slightly, the line breaks. On the table, witness marks went on the motor mount and the two side-plate joints that carry the driver shaft. After the first ten hours of running, one motor-mount screw showed a small break in its mark; it was retightened to 0.25 N·m and remarked, and none moved again during the soak test. A torque screwdriver set to the design value, kept with the table, lets teachers retighten without guessing and without over-tightening, which matters as much as the original assembly.

## Use captive nuts where inserts are awkward

A captive nut sits in a hexagonal pocket printed into the part, so it cannot turn while the screw is tightened from the other side. It is cheap, needs no heated tool, and gives a full steel thread.

Captive nuts have three practical requirements. The pocket must be sized from coupons, like any other fit, so the nut slides in without falling out. The pocket's orientation must suit printing: a hex pocket with its axis vertical prints cleanly, while one with its axis horizontal needs a bridged roof. And the builder must be able to place the nut before the parts are closed up. The table uses captive nuts in two places where an insert would have been awkward to install squarely, both in the motor mount.

## Design snap fits for the strain, not the force

The table's top cover, which keeps fingers out of the gearbox, clips on with four cantilever snap fits so that it can be removed without tools. Snap fits fail when the plastic is strained too far as the hook deflects over its catch. The deflection is set by the catch height; the strain depends on the beam's length and thickness.

For a simple rectangular cantilever, a common design approximation gives the maximum surface strain as **ε = 1.5 × y × t ÷ L²**, where y is the deflection, t the beam thickness and L its length. Longer, thinner beams strain less for the same deflection.

This is an illustration. Each catch needs 1.0 mm of deflection, and the beams are 1.6 mm thick. The first design used 12 mm long beams; the revised design used 16 mm.

```figure
type: bars
title: Snap-fit strain against beam length, 1.0 mm deflection, 1.6 mm thick
unit: %
max: 2
caption: This is an illustration. The 12 mm beams cracked during repeated-use testing; the 16 mm beams survived it. Allowable strain depends on the material and print orientation and was established by test.
- 12 mm beam | 1.67
- *16 mm beam | 0.94
```

The 12 mm beam's strain, about **1.5 × 1.0 × 1.6 ÷ 12² ≈ 1.67%**, was too much for the PLA cover: in a repeated-use test, beams started cracking after five clip-on cycles. The 16 mm beam's strain, about **0.94%**, survived fifty cycles without visible damage. The allowable strain of a printed material depends heavily on its orientation and settings, so the designer established it by test rather than quoting a value. The [snap fit](/tools/snap-fit/) tool in WORKOS runs the same calculation for other geometries.

Orientation matters even more for snap fits than for most parts. The beam must bend in the layer plane, so it should be printed with its length and thickness both in XY. A snap beam printed with its thickness in Z bends across its layers and snaps off at the root.

## Choose adhesive only where permanence is wanted

Cyanoacrylate and two-part epoxy bond many printed plastics well, especially if surfaces are lightly roughened and clean. Adhesive is useful for permanent subassemblies, such as fixing a printed label plate. It has no place in joints that students must undo, and it can wick into bearings or gear meshes if used carelessly. The table uses adhesive in exactly one place: the steel Geneva pin, which is pressed into its crank and then fixed with a drop of retaining compound suitable for the material.

## Detect a stripped joint before it happens

This is an illustration. The first teaching batch used self-tapping screws directly into printed holes for the side covers, on the theory that they would rarely come off. Records from the first term showed the covers were removed and refitted about three times by each class. On the second refit, two of the eight holes had begun to strip, and by the third, five had. The covers rattled.

The failure was predictable from the scope: a joint that would be reassembled needed a metal thread. The covers were redesigned with heat-set inserts. In the following term, the same use produced no stripped threads. The fix cost a few cents per insert and a little installation time, which was far less than reprinting covers each term.

## Exercise: tighten the motor mount

The motor mount is held by four M3 screws into heat-set inserts in the PLA base, with washers. A colleague tightens them to 0.5 N·m to make sure the alignment holds. Estimate the clamp force and the pressure under each washer, and comment.

**Worked answer.** With K = 0.2 and d = 0.003 m, the clamp force is about **0.5 ÷ (0.2 × 0.003) ≈ 833 N** per screw. Under a 7 mm washer with a bearing area of about 29.4 mm², the pressure is about **833 ÷ 29.4 ≈ 28 MPa**, double the design value.

At that pressure the PLA under each washer will creep noticeably, so the clamp force will fall over the following days, and the mount may shift, which is exactly what the extra torque was meant to prevent. The torque is also nearly half of the measured 1.1 N·m that turned inserts in their bosses, so an insert might start to spin. The better approach is the design torque of 0.25 N·m, a positive location for the mount once it has been aligned, such as two pins fitted through the mount into the base, and a retightening check after the first few hours of running.
