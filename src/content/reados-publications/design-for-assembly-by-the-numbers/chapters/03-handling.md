---
book: design-for-assembly-by-the-numbers
chapterSlug: make-parts-easy-to-handle
order: 3
title: "Make parts easy to handle"
description: "Cut the time spent grasping and orienting parts with symmetry or clear asymmetry, sensible size and thickness, parts that cannot tangle, good bench presentation and purchasing rules that protect them."
draft: false
---

Handling is the half of every assembly step that happens before the part reaches the product: reaching for it, picking it up, separating it from its neighbours, and turning it the right way round. It is easy to overlook, because a skilled assembler does it without thinking and very quickly. It is also where small design details have a surprisingly large effect. A washer a fraction of a millimetre too thin to pick up cleanly, a spring that hooks onto the next one, or a bush that looks the same both ways round but is not, can each double the time a part takes.

This chapter looks at the handling half of the IP-16's assembly, explains the properties of a part that decide its handling time, applies them to the parts that remain in revision B, and shows how a purchasing decision undid a design feature. The failure case is that decision: a cheaper spring that cost more than it saved.

## Revision A's handling time

The video from Chapter 1 split each step into handling and insertion. With the lock nut now packed loose, revision A's ten assembled parts spend **24.5 s** in handling.

```figure
type: bars
title: Revision A's handling time by part, lock nut excluded
unit: s
max: 6
caption: This is an illustration. Handling is from reaching for the part until it is held, correctly oriented, at the product. Total 24.5 s of the 63.5 s build. The spring's time is mostly spent separating tangled springs.
- Body | 1.5
- Wiper O-ring | 2.0
- Plunger | 1.0
- *Spring | 5.5
- Spring seat washer | 4.0
- Rear cap | 2.0
- Cross pin | 3.0
- Knob washer | 2.0
- Knob | 1.5
- Knob screw | 2.0
```

Four parts stand out: the spring, which tangles; the spring seat washer, which is thin and hard to pick up; the cross pin, which is small and must be turned end-on to the hole; and the small fasteners and washers generally. Chapter 2 has already eliminated three of those. The spring must stay, so it needs a different cure.

## What decides handling time

The published design for assembly method classifies handling difficulty by a handful of features of a part. A small company can use the same features as a checklist without the method's time tables.

```figure
type: checklist
title: Features that make a part quick or slow to handle
caption: This is an illustration. Each item is a design property the drawing can control. The open items are the ones revision A's remaining parts failed.
- x Big enough to grasp with the fingers, not tweezers | the 2.5 mm cross pin failed this, and was eliminated
- x Thick enough to pick up from a flat tray | the 0.8 mm spring seat washer failed this, and was eliminated
- ? Cannot tangle, nest or stick to the next part | open-ended springs tangle in their tote
- ? Symmetrical end to end, or obviously not | revision B's first rear bush looked symmetrical but was not
- x Symmetrical about its insertion axis, or keyed | round parts need no rotational orientation
- x Light, rigid and not fragile | every IP-16 part passes
- x Needs one hand and no tool to grasp | every remaining part passes
```

Two kinds of symmetry matter, and the method treats them separately.

- **End-to-end symmetry.** Can the part go in either end first? A plain pin, chamfered both ends, can. A plunger, with a nose and a tail, cannot, so the assembler must find which end is which before inserting it.
- **Symmetry about the insertion axis.** Once the right end is leading, does it matter how the part is rotated? A round bush, no. A part with a flat or a key, yes, and the assembler must turn it until it lines up.

The ideal is a part that is symmetrical in both ways, so that no orientation is needed. When that is impossible, the next best thing is a part that is **obviously** asymmetrical, so that the right way round is visible at a glance and takes no searching. The worst case is a part that is nearly symmetrical: it looks the same both ways round but works only one way, so the assembler must look closely or test it.

## Applying the checklist to revision B

### The spring

The IP-16's spring is an open-coiled compression spring. Open-coiled springs with open ends, where the last coil is not closed down onto the next, tangle easily: the end of one spring slips between the coils of another. In a tote of a few hundred springs, the assembler spends most of each spring's handling time pulling them apart.

The cure is in the specification. A spring with **closed ends**, where the end coils are wound down to touch the next coil, has no open gap at the end for another spring's end to enter, and tangles far less. Closed and ground ends also sit square, which helps the spring seat on the plunger's collar in revision B. This is an illustration: the spring supplier quoted A$0.62 for the closed-ended spring against A$0.55, and a trial tote showed handling falling from 5.5 s to about **2.5 s**.

### The plunger

Revision A's plunger had a nose and a tail of similar diameter, and assemblers checked which end was which before inserting it. Revision B's plunger has a collar near the nose end and a thread on the tail, so its orientation is obvious from across the bench. Handling stays at about **1.0 s**, and the risk of inserting it backwards, which happened occasionally with revision A, goes away.

### The rear bush

The pressed bush that replaces the threaded rear cap is a plain sintered bronze cylinder. Its handling should be trivial, provided it can go in either way round. Its first drawing did not allow that, as the second failure case below shows; the corrected bush is symmetrical end to end and takes about **1.0 s** to handle.

### The O-ring and knob

The wiper O-ring is small and flexible, and picking one out of a bag takes time. Presenting them on a short peg at the bench, so the assembler slides one off, brought handling from 2.0 s to about **1.5 s**. The knob is large, rigid and easy to grasp, at about 1.5 s.

## Present parts at the bench

Handling time depends on the bench as much as the part. The IP-16 bench was rearranged with the parts in assembly order, left to right, within easy reach of a seated assembler, and with each part presented the right way up where possible.

- **Trays and pegs** hold parts in a known orientation. The plungers sit nose-down in a drilled block, so the assembler picks each one up already pointing the right way.
- **Totes are small and kept topped up**, so the assembler is not reaching to the bottom of a deep bin.
- **Nothing needs a tool to pick up.** Revision A's cross pins needed tweezers on some days; revision B has no part that small.

Handling also has a health side. Pinching small parts out of bins, thousands of times a day, is the kind of repetitive task that Safe Work Australia's model code of practice on hazardous manual tasks asks businesses to assess and control. Revision A required about 60,000 small grasps a year at the IP-16 bench; revision B requires about 36,000, of larger and easier parts. Fewer, easier grasps are a design control, which ranks above training and job rotation. The assemblers were asked which steps they found awkward before the redesign, and their list, the cross pin, the thin washer and untangling springs, matched the slowest steps on the video almost exactly.

## Revision B's handling time

```figure
type: compare
title: Handling time per part, revision A against revision B
cols: Revision A | Revision B | Change
caption: This is an illustration. Revision B's times are from a prototype trial of 20 builds at the rearranged bench. Totals: 24.5 s and 9.0 s. Insertion is covered in Chapter 4.
- Body | 1.5 s | 1.5 s | unchanged
- Wiper O-ring | 2.0 s | 1.5 s | presented on a peg
- Plunger | 1.0 s | 1.0 s | now obviously one way round
- *Spring | 5.5 s | 2.5 s | closed ends, no tangling
- Spring seat washer | 4.0 s | eliminated | job taken by the plunger's collar
- Rear cap or rear bush | 2.0 s | 1.0 s | plain bush, symmetrical end to end
- Cross pin, knob washer, knob screw | 7.0 s | eliminated | Chapter 2
- Knob | 1.5 s | 1.5 s | unchanged
```

Handling falls from **24.5 s** to **9.0 s**, a saving of 15.5 s per unit, worth about A$0.267 per unit at A$62 an hour, or about **A$1,602** a year at 6,000 units. Most of it comes from eliminating parts, not from improving them, which is the lesson of Chapter 2 again. The spring and the bush show what is left to gain from a part that must stay: a few seconds each, for a few cents.

## If the volume grows

At 6,000 units a year, the IP-16 is assembled by hand, and will be for the foreseeable future. If a large customer ever multiplied the volume, the company might consider feeding parts automatically, with a vibratory bowl feeder or a simple gravity track, and handling would change character. A machine has no eyes to find the chamfered end of a bush or a hand to separate tangled springs. It orients parts by their shape alone: a part either falls into the right orientation on a track, or is rejected back into the bowl.

The design rules for hand handling and machine feeding point the same way, which is why they are worth following even when automation is not planned.

- **Symmetry helps both.** A part that needs no orientation needs no orienting device.
- **Obvious asymmetry helps both.** A machine can orient a plunger by its collar, using a slot the collar cannot pass, far more reliably than it could orient revision A's plain plunger by comparing its two ends.
- **Tangling and nesting defeat both,** and are worse in a feeder, which jams.
- **Very small and very thin parts are hard for both,** and are best designed out.

Revision B's six parts would all be practical to feed automatically. Revision A's cross pin, thin washer and small screw would each have needed special feeding, and the open-ended spring could not have been fed at all.

## Rules the team kept

The review produced a short set of handling rules that now sit beside the company's drawing standard, for new designs as well as changes.

1. No separate part smaller than about 3 mm in any direction, unless it is bought fed on a tape or strip.
2. No washer or flat part thinner than about 1.5 mm, unless it is presented in a stack or on a peg.
3. Springs specified with closed ends, and the end form listed as a critical characteristic.
4. Every part either symmetrical end to end or with an asymmetry visible from 1 m away.
5. Any part that must be oriented about its axis has a feature that makes the orientation obvious, and ideally one that prevents wrong assembly, as Chapter 6 explains.

The numbers are the company's own judgment from this review, not published limits, and they are reviewed whenever a product breaks one for a good reason.

## A failure case: the cheaper spring

This is an illustration. When the time study in Chapter 1 found the spring taking 6.5 s, of which 5 s was separating tangled springs, the team asked why revision A's springs tangled at all. The original revision A drawing had specified closed ends. The purchasing history showed that, two years earlier, a buyer had switched to a different supplier's spring, with open ends, at **A$0.04** less per spring. The drawing's note about the ends had not been carried onto the purchase order, and the supplier had quoted their standard open-ended spring of the same size and rate.

The saving was real on the purchase invoice. On the bench, the open-ended springs added about **3.5 s** of handling to every unit, about **A$0.060** of labour at A$62 an hour. The company had been losing about A$0.020 per unit, about **A$122** a year at 6,000 units, as well as paying for an assembler's frustration with a tote of tangled springs every batch.

The detection was the time study, followed by the question "why?" asked of one slow step. The correction was to reinstate the closed-ended spring, to put the end form on the purchase specification as a critical characteristic, and to add a rule to the purchasing procedure: a change of supplier or part for anything that is assembled needs a check by production before it is approved.

### And the rear bush

The rear bush's first drawing had a chamfer at one end only, for pressing, and a plain edge at the other. The two ends looked almost identical. In the prototype trial, assemblers had to look closely at each bush to find the chamfer, adding about 1.5 s, and two out of twenty went in the wrong way and had to be pressed out. The corrected drawing chamfers both ends, so the bush can be pressed in either way round. The second chamfer adds about two cents to the bush's cost and removed the orientation step entirely.

## How this applies to a small Australian business

Time handling separately from insertion, because the cures are different. Check every part against a short list: big enough to grasp, thick enough to pick up, cannot tangle or nest, symmetrical or obviously asymmetrical. Make near-symmetrical parts fully symmetrical, or clearly different at each end. Specify properties that affect handling, such as spring ends, on the drawing and the purchase order. Present parts in order, oriented and within reach. And require production to check any purchasing substitution for a part that is assembled.

## Exercise: springs on a rod

A spring supplier offers to deliver the closed-ended springs threaded onto plastic rods, so that the assembler slides one off the end, for an extra **A$0.03** per spring. A trial suggests it would cut the spring's handling from 2.5 s to about **1.0 s**. At A$62 an hour and 6,000 units a year, is it worth it?

**Worked answer.** The saving is 1.5 s per unit, worth 1.5 × 62 ÷ 3,600, about **A$0.026** per unit. The extra cost is A$0.03 per spring. The change would cost about A$0.004 per unit more than it saves, about **A$24** a year, so on assembly labour alone it is not worth it. It might still be worth considering if the springs are being damaged or tangling despite their closed ends, or if the bench is the bottleneck in a busy period, but neither applies here. The closed-ended spring in a small tote is the better choice.
