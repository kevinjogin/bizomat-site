---
book: bolted-joints-by-the-numbers
chapterSlug: fatigue-of-bolted-joints
order: 5
title: "Bolts that cycle: fatigue in tension joints"
description: "How a cyclic external load becomes a small alternating stress in a well-preloaded bolt, why separation and soft members destroy that protection, and how to check bolt fatigue."
draft: false
---

The CT-1 rig exists to cycle hydraulic cylinders, thousands of times a day, from zero to 25 MPa and back. Every cycle pulls the test head's screws a little further and lets them back. A bolt is a poor shape for fatigue: its thread is a ring of sharp notches, and the first engaged thread, where the load passes from bolt to nut or tapped hole, carries a large share of the load at the worst notch. Bolts survive cyclic loads only because a preloaded joint hides most of the load from them.

This chapter checks the test head screws in fatigue with the WORKOS bolted joint fatigue tool, and checks the torque-angle tightening of Chapter 3 with the turn-of-nut fatigue tool. Metal Fatigue by the Numbers explains the background, the thread's notch, rolled threads and the Goodman line for bolts, in its [chapter on bolted joints](/reados/publications/metal-fatigue-by-the-numbers/bolted-joints/); this chapter applies it to a pressure joint. Its mistake is a fibre gasket, proposed to cure a weep, that would have tripled the screws' alternating stress.

## How preload protects a bolt

From Chapter 1, an external load P adds only C × P to the bolt while the joint stays closed. If P cycles from zero to its working value, the bolt's load cycles from Fi to Fi + C P. Its alternating stress is half the change, divided by the stress area.

```figure
type: formula
title: Bolt stresses under a load cycling from zero
formula: σa = C P ÷ (2 At)
formula: σi = Fi ÷ At,  σm = σi + σa
formula: Goodman: n = Se (Sut − σi) ÷ (Sut σa + Se (σm − σi))
caption: σi is the preload stress, σa the alternating stress and σm the mean stress. This form of the Goodman check follows the load line from the preload point, because the preload is fixed and only the external load varies. Se must be the fully corrected endurance strength of the threaded bolt.
- C | joint constant
- At | tensile stress area
- Se | bolt endurance strength, including the thread's notch
```

For the test head, C = 0.2006 and P = 38.35 kN, so σa = 0.2006 × 38,350 ÷ (2 × 244.79) = 15.7 MPa. Without preload, the full 38.35 kN would cycle through each screw, and σa would be 78.3 MPa, five times as much. The preload does not make the bolt stronger; it makes the load it has to resist smaller.

## Endurance strength of a bolt

Fatigue tests on bolts show that their endurance strength hardly rises with tensile strength. A stronger bolt has a stronger core, but its thread roots are just as sharp and the stronger steel is more sensitive to them. Shigley's tabulates fully corrected endurance strengths, already including the thread's notch, of 129 MPa for rolled-thread property class 8.8 bolts, 162 MPa for class 10.9 and 190 MPa for class 12.9, all on the tensile stress area. A class 10.9 bolt has 25% more endurance than a class 8.8, though it has nearly 40% more proof strength.

How the thread is made matters. Rolled threads, formed by squeezing the blank between dies, have smooth roots, unbroken grain flow and compressive residual stress at the root, all of which help in fatigue. Cut or ground threads have none of these, and texts give them a higher fatigue stress-concentration factor. Rolling the thread after the bolt is heat treated keeps the compressive stress that rolling leaves; rolling before heat treatment loses most of it. The CT-1's screws were specified with rolled threads, and the shop asked the supplier to confirm they were rolled after heat treatment. This is an illustration.

## The test head screws in the fatigue tool

The [bolted joint fatigue check](/tools/bolted-joint-fatigue/) takes the tensile stress area, the preload, the maximum external load cycling from zero, the joint constant, the bolt's fully corrected endurance strength and tensile strength, and a required factor. It returns the alternating, mean and preload stresses and the Goodman fatigue factor. It assumes a concentric joint that does not separate, and reminds the user to confirm that with the bolted joint tool; bending and prying, which raise the stress range, are outside it.

The shop requires a fatigue factor of 2.0 for bolts. This is an illustration. It is higher than its 1.5 for machined parts in Chapter 4 because bolt fatigue data scatter widely and a broken test head screw is a serious event.

```figure
type: steps
title: A test head screw in the bolted joint fatigue check
caption: This is an illustration. Stress area 244.8 mm², preload 142.2 kN, external load 0 to 38.35 kN, C = 0.2006, Se = 162 MPa, Sut = 1,040 MPa, required factor 2.0.
- Alternating stress | 15.7 MPa
- Mean stress | 596.7 MPa
- Preload stress | 581 MPa
- * Goodman fatigue factor | 3.94: FATIGUE SAFE
```

The factor of 3.94 is higher than Chapter 4's 3.67 for the same joint, because the design check uses the highest preload in the scatter band for the preload stress, while this check uses the nominal preload. Both are valid; the design check's figure is the conservative one.

## Checking the angle-tightened screws

The test head screws are tightened by torque to snug and then by angle, so their preload depends on the angle, the thread lead and the stiffnesses. The [turn-of-nut preload and bolt fatigue check](/tools/turn-of-nut-fatigue-check/) works from the angle. It takes the turn angle past snug, the thread lead, the shank diameter, the tensile stress area, the plain shank and threaded lengths in the grip, the bolt's modulus, the joint stiffness, the maximum external load cycling from zero, the proof strength, the largest preload allowed as a share of proof, and the endurance and tensile strengths with a required factor. It returns the bolt stiffness, the preload from the angle, the preload stress and its share of proof, the joint constant, the alternating and mean stresses and the fatigue factor.

The tool counts the angle from a snug point with no preload. The test head's snug of 100 N·m gives about 25 kN, which is equivalent to 25 ÷ 5.27 = 4.75° of turn, so the shop enters 22° + 4.75° = 26.75°.

```figure
type: steps
title: A test head screw in the turn-of-nut fatigue check
caption: This is an illustration. 26.75° equivalent turn, lead 2.5 mm, M20, stress area 244.8 mm², 48 mm shank and 16 mm thread in the grip, E 207 GPa, joint stiffness 3,781 kN/mm, load 0 to 38.35 kN, proof 830 MPa, largest preload 90% of proof, Se 162 MPa, Sut 1,040 MPa, required factor 2.0.
- Bolt stiffness | 948.9 kN/mm
- Preload | 140.9 kN
- Preload stress / share of proof | 576 MPa / 69%
- Joint constant | 0.201
- Alternating / mean stress | 15.7 / 591 MPa
- * Fatigue factor | 3.98: JOINT ADEQUATE
```

## What separation does

The protection holds only while the joint stays closed. If the external load exceeds the separation load, the members lose contact and the bolt carries the whole external load from then on. For a joint that separates on every cycle, the bolt's alternating stress is not C P ÷ 2 At but nearly P ÷ 2 At.

```figure
type: compare
title: A test head screw's fatigue factor, closed and separating
cols: Alternating stress, MPa | Fatigue factor | Verdict
rowhead: Joint behaviour
- * Stays closed, C = 0.2006 | 15.7 | 3.94 | Safe
- Separates every cycle, bolt carries all of P | 78.3 | 0.79 | Fails in fatigue
caption: This is an illustration. Same screw, same preload, same 0 to 38.35 kN cycle. The second line is the M12 design of Chapter 1 in spirit: a joint that opens under its working load breaks its bolts.
```

That is why Chapter 4 checks separation at the lowest preload before fatigue at all: a fatigue factor calculated on the assumption of a closed joint is meaningless if the joint opens.

## The mistake: a gasket to stop a weep

After a few hundred hours of endurance testing, a slight weep of oil appeared at the test head's edge. The O-ring was sound; the oil was creeping along the metal faces from a scratch across the seal face. A fitter proposed fitting a 2 mm compressed fibre gasket between the head and the block, under the screws, to stop it.

The engineer checked the idea before it was tried. A fibre gasket is far softer than steel, and in series with the steel members it reduces the member stiffness drastically. The joint's member stiffness would fall from 3,781 kN/mm to something nearer 630 kN/mm, which gives a joint constant of about 0.6. This is an illustration; the figure for a real gasket comes from its maker's compression data.

```figure
type: compare
title: Test head screw fatigue with and without a fibre gasket
cols: Joint constant | Preload, kN | Alternating stress, MPa | Fatigue factor | Against 2.0
rowhead: Joint
- * Steel to steel, as designed | 0.20 | 142.2 | 15.7 | 3.94 | Safe
- With gasket, joint constant 0.4 | 0.40 | 142.2 | 31.3 | 1.97 | Just fails
- With gasket, joint constant 0.6 | 0.60 | 142.2 | 47.0 | 1.32 | Fails
- With gasket, 0.6, after 20% relaxation | 0.60 | 113.8 | 47.0 | 1.65 | Fails
caption: This is an illustration. Bolted joint fatigue check, Se 162 MPa, Sut 1,040 MPa. A soft member hands the bolt a larger share of every pressure cycle. A fibre gasket also relaxes, losing preload, which in this form of the check slightly improves the factor but brings separation closer.
```

With the gasket, each screw's alternating stress would triple, and the fatigue factor would fall from 3.94 to 1.32. The angle-tightening procedure would also go wrong: the turn-of-nut fatigue check, with a joint stiffness of 633 kN/mm, gives a preload of only 70.5 kN from the same 26.75°, because the soft gasket absorbs most of the turn. The screws would be at 35% of proof, not 70%.

The weep was cured instead by lapping out the scratch on the seal face and fitting a new O-ring. The proposal went into the rig's file as a reminder that a joint designed metal to metal must stay metal to metal.

## Other things that raise a bolt's stress range

The fatigue tools assume a concentric load and a joint that stays square. Several things break those assumptions, and each raises the stress range at the first engaged thread.

```figure
type: checklist
title: Things that make a bolt's fatigue worse than the tool shows
caption: The CT-1 design review's list. This is an illustration.
- x Bending: a flange or head that tilts under load bends the bolt as well as stretching it
- x Prying: a thin flange levers on its outer edge and adds to the bolt load
- x Uneven load sharing: the bolt nearest the load carries more than its share
- x Soft or inconsistent members: gaskets, paint, plated or soft washers
- x Short thread engagement in a soft tapped hole: more load on the first thread
- x Lost preload from loosening, relaxation or temperature
```

For the test head, the 50 mm steel head keeps bending and prying small, the eight screws share a uniform pressure load, and the tapped holes in the steel block engage over 46 mm, as Chapter 6 shows. The margins of 3.94 and 3.98 leave room for what the tools do not count.

## Where bolts break

Bolts fail in fatigue at a few predictable places. By far the commonest is the first engaged thread, where the bolt's thread enters the nut or tapped hole and the load starts to pass from one to the other; that thread carries a disproportionate share of the load at a sharp root. The next is the thread run-out, where the thread ends and the plain shank begins, and the third is the fillet under the head. A fatigue fracture at any of them has a smooth zone where the crack grew slowly over many cycles and a rough zone where the last of the section broke at once, and often small ratchet marks around the edge where cracks started at several points of the thread root and joined.

A bolt that has broken in fatigue is evidence about the joint, not just the bolt. It usually means the joint lost preload, separated under load, or bent, and replacing the bolt alone, without finding out which, invites the next one to break.

## Making a joint kinder to its bolts

When a joint's fatigue factor is too low, there are more effective cures than a stronger bolt, which, as the endurance figures show, gains little.

1. **Make the bolt more flexible.** A longer bolt through a thicker joint, or a bolt with its shank turned down below the thread's root diameter, has a lower stiffness and so a smaller joint constant. An M20 screw with its 48 mm of plain shank waisted to 16 mm diameter would have a stiffness of 681 kN/mm instead of 949, a joint constant of 0.153 instead of 0.201, an alternating stress of 12.0 MPa and a fatigue factor of 5.2.
2. **Keep the members stiff.** Steel to steel, no gaskets or soft washers under the clamp, as the mistake above showed.
3. **Raise and hold the preload.** A higher preload, delivered by an accurate method and verified, keeps the joint shut under larger loads. It raises the mean stress, which the Goodman line penalises a little, but it guards against the separation that would be far worse.
4. **Use rolled threads, rolled after heat treatment.**
5. **Spread the load in the threads.** Nuts or tapped holes in a slightly softer material than the bolt, and full-length engagement, share the load among more threads.

The test head did not need any of these: it passes with a wide margin as it is. The waisted screw is noted in the rig's file in case a future version of the rig runs at a higher pressure.

## Inspecting cycled screws

Test head screws are removed every time the chamber's seals are changed, and the shop uses those occasions to inspect them. Each screw is cleaned and examined under a magnifier at the first engaged thread, the run-out and the head fillet, and its length is checked against its new length to detect stretch. Any screw with a crack indication, a stretched shank or damaged threads is scrapped, and screws are replaced as a set after a fixed number of reassemblies regardless of their condition. This is an illustration.

## Finite life and cycle counts

The fatigue tools check for infinite life. The test head's screws see several million cycles a year in endurance testing, so infinite life is the right target. For a joint that cycles only a few thousand times in its life, such as a pressure vessel opened for inspection once a month, a finite-life check against the bolt maker's S–N data could allow a higher stress range. The shop does not stretch an infinite-life check to that case; it uses the maker's data when it needs one.

## Exercise: class 8.8 screws

A buyer asks whether M20 class 8.8 screws, cheaper and easier to find, would do in the test head. Take the proof strength as 600 MPa, the tensile strength as 830 MPa and the endurance strength as 129 MPa, with the same 70% of proof preload and the same joint constant. Find the preload, the stresses and the Goodman factor, and comment.

### Worked answer

The proof load is 600 × 244.79 = 146.9 kN, and 70% of it is 102.8 kN. The preload stress is 102,800 ÷ 244.79 = 420 MPa. The alternating stress is unchanged at 15.7 MPa, because it depends only on C, P and the area, so the mean stress is 435.7 MPa.

The Goodman factor is 129 × (830 − 420) ÷ (830 × 15.7 + 129 × 15.7) = 52,890 ÷ 15,056 = 3.51.

The bolted joint fatigue check gives 3.51, fatigue safe against 2.0. In fatigue alone, class 8.8 would do. But its preload is 102.8 kN against 142.2 kN for class 10.9, so the separation load falls from 177.9 kN to 102.8 ÷ 0.7994 = 128.6 kN per screw, and the margin at the proof test shrinks accordingly. Re-running the design check of Chapter 4 at 70% with torque-angle would show whether that is still acceptable; the fatigue check alone cannot answer the question.
