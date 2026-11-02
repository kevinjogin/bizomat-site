---
book: bolted-joints-by-the-numbers
chapterSlug: threads-tapped-holes-and-screw-lengths
order: 6
title: "Threads, tapped holes and screw lengths"
description: "How long a thread must engage so the screw breaks before the thread strips, how to design a tapped hole, and how to choose a screw length that puts full thread where it is needed."
draft: false
---

A screw in a tapped hole can fail in two ways: the screw breaks across its stress area, or the threads strip, the screw's or the hole's, by shearing along the cylinder where they engage. Designers want the first, if anything, because a broken screw is obvious and its replacement restores the joint, while a stripped thread in a tapped hole damages the part that holds it and may let go without warning while being tightened. The rule is to engage enough thread that the screw would break first.

This chapter works out the engagement for the CT-1 test head's M20 screws in their steel block and for the valve screws in the aluminium manifold, designs the tapped holes, and checks that the screws' lengths put full thread where the joint needs it. It uses three KEVOS® tools: thread length of engagement, tapped hole design, and bolt and screw grip length. Its mistake is a box of screws 5 mm too short.

## Shear areas and the strength ratio

The handbook method compares three strengths. The screw's tensile strength acts on its tensile stress area. Its thread, if it strips, shears along a cylinder near the minor diameter of the internal thread; the hole's thread, if it strips, shears along a cylinder near the screw's major diameter. Both shear areas grow in proportion to the length of engagement.

```figure
type: formula
title: Length of thread engagement, handbook shear-area method
formula: Le = 2 At ÷ (external thread shear area per mm)
formula: J = (external shear area × Su screw) ÷ (internal shear area × Su tapped material)
formula: Required engagement = J × Le if J > 1, otherwise Le
caption: At is the screw's tensile stress area. The shear areas per millimetre of engagement come from the basic, or limiting, diameters of the two threads. The factor 2 reflects shear strength taken as about half the tensile strength. When the tapped material is weaker, J exceeds 1 and the internal thread governs.
- Le | engagement at which the screw's thread and its body are equally strong
- J | strength ratio of external to internal thread
```

For two threads of the same strength, the engagement needed for a coarse metric thread comes out a little over half the diameter. Real joints use more, because tapped holes are seldom as strong as the screw, threads are never perfectly formed, and the first few threads carry most of the load.

## The test head screws in steel

The test chamber block is a plain carbon steel with a tensile strength of 430 MPa; the M20 class 10.9 screws have 1,040 MPa. This is an illustration.

The [thread length of engagement tool](/tools/thread-engagement/) takes the basic major diameter and pitch, optional limiting diameters for the thread class, and the tensile strengths of the screw and of the tapped material. It returns the tensile stress area, the engagement for the external thread, the strength ratio, the engagement required and its ratio to the diameter, and says which thread governs. With the limits left at zero it uses basic diameters, which slightly overstate the shear areas; it asks for the thread-class limits for a design check.

```figure
type: steps
title: The test head screws in the thread engagement tool
caption: This is an illustration. M20 × 2.5, basic diameters, screw tensile strength 1,040 MPa, block 430 MPa.
- Tensile stress area | 244.79 mm²
- Engagement for the external thread | 12.02 mm
- Strength ratio J | 1.793: the tapped material is weaker; the internal thread governs
- * Required engagement | 21.54 mm, 1.08 × D
```

The screws engage 46 mm, more than twice the requirement. In a solid steel block, deep engagement costs nothing but a longer screw and a deeper hole, and it pays for itself: it spreads the load over more threads, tolerates a damaged first thread, and leaves enough thread to chase and reuse the hole after a screw has galled. For a joint that is assembled and dismantled as often as the test head, the extra depth is cheap insurance.

```figure
type: compare
title: Engagement needed for an M20 class 10.9 screw, by tapped material
cols: Strength ratio J | Engagement needed | × D
rowhead: Tapped material, tensile strength
- Steel, 540 MPa | 1.43 | 17.2 mm | 0.86
- * Steel, 430 MPa | 1.79 | 21.5 mm | 1.08
- Aluminium alloy, 310 MPa | 2.49 | 29.9 mm | 1.50
caption: This is an illustration. Basic diameters. The weaker the tapped material, the longer the engagement. In aluminium, a coarse thread for a high-strength screw needs about one and a half diameters.
```

## Designing the tapped hole

The [tapped hole design tool](/tools/tapped-hole-design/) takes the nominal diameter and pitch, the percentage of thread, the tap type (cutting or forming), the tensile strengths of screw and tapped material, the tap's chamfer length in pitches, the extra drill depth beyond the threads and the drill's point angle. It returns the tap drill, the engagement for the screw's thread, the strength ratio, the engagement needed, the full-thread depth allowing for the tap's chamfer, and the drill depth to the point. It works with basic diameters and static strength, and flags an engagement above two diameters as a case for a thread insert or a through-bolt.

```figure
type: steps
title: The test block's tapped holes in the tapped hole design tool
caption: This is an illustration. M20 × 2.5, 75% thread, cutting tap, screw 1,040 MPa, block 430 MPa, tap chamfer 3 pitches, 2 mm extra drill depth, 118° drill point.
- Tap drill | 17.564 mm, use 17.5 mm
- Engagement for the screw's thread | 12.02 mm
- Strength ratio J | 1.793
- * Engagement needed | 21.54 mm, 1.08 × D
- Full-thread depth | 29.04 mm
- Drill depth to the point | 36.32 mm
```

The tool's depths are for the minimum engagement. For the actual 46 mm, the shop adds the same allowances: 46 mm of full thread plus 4 mm below the screw's tip so it cannot bottom, 7.5 mm for the tap's three-pitch chamfer, 2 mm extra and the 5.3 mm drill point, a drill depth of about 65 mm. The block's drawing gives those depths and states the thread as M20 × 2.5 6H, so the hole is made and gauged to a known class.

### Thread classes and gauging

The engagement calculation used basic diameters, the theoretical sizes of a thread with no tolerance. Real threads are made within tolerance classes: for metric threads, 6H is the usual class for internal threads and 6g for external ones, each defining how far the pitch, major and minor diameters may fall from basic. A tapped hole at the large end of its tolerance and a screw at the small end of its tolerance engage less deeply than basic threads, and their shear areas are smaller. The thread engagement tool accepts the limiting diameters for the class in place of the basic ones; the shop uses basic diameters for a first look and the 6H and 6g limits for the final check when the margin is small. The test head's 46 mm engagement leaves so much margin that the difference does not matter there; in the valve manifold, where the margin was a few millimetres, it does.

The tapped holes are checked with thread plug gauges: the GO gauge must screw in its full length, and the NOT GO gauge must not enter more than a turn or two. A hole that passes both is within its class, and the calculation's assumptions hold for it.

### Percentage of thread

A tap drill slightly larger than the theoretical minor diameter leaves less than a full thread form but makes tapping much easier, especially in tough materials. Thread strength falls only slowly as the percentage drops from 100%, because stripping happens near the major diameter, so 70 to 75% thread is normal for cut threads. Forming taps, which displace material instead of cutting it, need a larger drill for the same percentage, because the displaced metal flows up to form the crest; the tool's two tap types use different constants for that reason.

### Coarse or fine

Fine-pitch threads have a larger stress area for the same diameter, so a fine-thread screw is slightly stronger in tension, and its smaller helix angle makes it slightly less prone to loosening. But its thread is shallower, and in a soft tapped material its internal thread strips more easily for a given length of engagement. Fine threads are also more easily damaged in handling and more prone to galling. The CT-1 uses coarse threads throughout, and the handbook's advice to prefer coarse threads in soft materials such as aluminium and cast iron is part of the shop's design standard.

## Blind holes in practice

A blind tapped hole has three practical problems that a calculation does not show. Chips from a cutting tap collect at the bottom, and a screw that reaches them before it reaches the joint feels tight while clamping nothing; holes are blown out and checked with a depth gauge before assembly. A screw that bottoms in its hole gives the same false tightness, which is why the test block's holes have 4 mm of full thread below the screw's tip. And a blind hole full of oil or water can be hydraulically locked by a screw run in quickly, cracking the part around it; the shop's assembly notes ask for blind holes to be dry before screws go in.

## Thread inserts

A helical wire thread insert is a coil of diamond-section wire, usually stainless steel, that screws into an oversize tapped hole and presents a standard internal thread to the screw. Because the insert's outer thread is on a larger diameter, it spreads the screw's load over a larger shear area in the parent material, and its hard wire resists wear from repeated assembly. Inserts are the usual repair for a stripped hole in a casting or an aluminium part, and are often designed in from the start where screws will be removed many times. They need their own tap, and the insert maker's tables give the hole sizes and the engagement lengths for each parent material. The KEVOS® thread tools calculate solid threads; they are not used to size an insert.

## Screw lengths

A screw's thread does not run its full length. A socket head cap screw of a given length has a standard thread length, measured from its tip, and an unthreaded body under the head, with a transition of incomplete thread between them. Two things depend on that geometry: the incomplete thread must not end up inside the tapped hole, where the hole's thread would bind on it before the joint is tight; and enough full thread must reach beyond the clamped parts to give the engagement needed.

The [bolt and screw grip length check](/tools/bolt-grip-thread-length/) takes the fastener type (socket head cap screw, metric bolt or screw, or heavy hex structural bolt), the nominal length, the thread length from the standard table for that size and length, the pitch, the diameter, the transition length for structural bolts, the joint type (tapped hole or through bolt with nut), the clamped thickness, and the length needed beyond the joint. It returns the grip length, the body length where the rule defines one, the length beyond the joint, and where full thread begins, with checks that the joint is long enough for the tapped hole to work on full thread and that enough length reaches beyond it.

```figure
type: steps
title: A test head screw in the grip length check
caption: This is an illustration. Socket head cap screw M20 × 100, thread length 52 mm from the maker's catalogue, pitch 2.5 mm, screwed into a tapped hole, clamped thickness 54 mm (head 50 mm and washer 4 mm), engagement needed 21.54 mm.
- Grip length LG = L − LT | 48 mm
- Total thread length LTT = LT + 5P | 64.5 mm
- Body length LB = L − LTT | 35.5 mm
- * Length beyond the joint | 46 mm against 21.54 mm needed
- Full thread within the joint | 54 mm clamped against 48 mm grip: LENGTH SUITS THE JOINT
```

The grip length of 48 mm is the shortest clamped thickness for which the tapped hole meets only full thread. With 54 mm clamped, the screw's full thread starts 6 mm inside the head, so the hole engages full thread from its first turn.

## The mistake: screws 5 mm short

The CT-1's aluminium valve manifold carries four directional valves, each held by four M6 class 12.9 socket head cap screws through the valve body into tapped holes in the manifold. The manifold's aluminium alloy has a tensile strength of 310 MPa. This is an illustration.

```figure
type: steps
title: The valve screws in the thread engagement tool
caption: This is an illustration. M6 × 1, basic diameters, screw 1,220 MPa, aluminium 310 MPa.
- Tensile stress area | 20.12 mm²
- Engagement for the external thread | 3.47 mm
- Strength ratio J | 2.765
- * Required engagement | 9.60 mm, 1.60 × D
```

The valve maker's literature calls for M6 × 40 screws through the 27 mm valve body, which leaves 13 mm beyond the joint: ample. When the valves were first fitted, two of the sixteen tapped holes stripped as the screws were tightened. The fitter had used M6 × 35 screws from the shop's stock, which left only 8 mm in the manifold.

The grip length check, with the 35 mm screw, a thread length of 24 mm from the catalogue, a 27 mm valve body and 9.6 mm needed, reports 8 mm beyond the joint against 9.6 mm needed: choose another length. With 8 mm engaged, the aluminium's threads are only 8 ÷ 9.6 = 83% as strong as the screw, and would strip at about 20.5 kN. The screws were being tightened to 70% of their proof load, 13.7 kN nominally, but with a nut factor at the low end of its scatter some would reach 18.2 kN, close enough to the stripping load that any hole with a slightly undersized thread let go.

```figure
type: compare
title: Valve screw length against engagement in the aluminium manifold
cols: Beyond the 27 mm body | Thread strength against the screw | Result
rowhead: Screw
- M6 × 35, from stock | 8 mm | 83% | Two holes stripped while tightening
- * M6 × 40, as specified | 13 mm | 135% | Screw breaks first
caption: This is an illustration. Required engagement 9.6 mm for class 12.9 in 310 MPa aluminium. A screw 5 mm too short turned a joint designed to break its screw into one that strips its manifold.
```

The two stripped holes were repaired with helical wire thread inserts, which put a steel thread in a larger tapped hole in the aluminium and spread the load over a larger diameter; the insert maker's tables give the hole and length. The stock bin of M6 × 35 screws was relabelled, and the manifold drawing now gives the screw length beside each tapped hole.

## Tapped holes in the manifold

The [tapped hole design tool](/tools/tapped-hole-design/), run for the manifold with a forming tap, gives a tap drill of 5.49 mm, a full-thread depth of 12.6 mm for the 9.6 mm engagement, and a drill depth of 16.3 mm. Forming taps suit ductile aluminium alloys: they make no chips, and the formed thread is work-hardened and slightly stronger. The manifold's holes are 15 mm of full thread, to accept the 13 mm of a 40 mm screw with clearance, and the drawing shows the nearest oil gallery 6 mm below the drill point.

## Exercise: class 8.8 valve screws

The valve maker allows class 8.8 screws as an alternative. Take the tensile strength as 830 MPa. What engagement do they need in the 310 MPa manifold, and would the 35 mm screws have been adequate with them?

### Worked answer

The external thread's engagement is unchanged at 3.47 mm, because it depends only on the screw's geometry. The strength ratio falls in proportion to the screw's strength: 2.765 × 830 ÷ 1,220 = 1.881. The required engagement is 1.881 × 3.47 = 6.53 mm, 1.09 × D.

The thread engagement tool gives the same: J = 1.881 and 6.53 mm. A 35 mm screw leaves 8 mm beyond the 27 mm body, which would have been enough for class 8.8 screws. But the valve maker's tightening torque for the valve assumes class 12.9 screws and their preload; with class 8.8 screws the torque would have to be reduced, and the valve's seals would get less clamp. The shop kept class 12.9 screws of the specified length.
