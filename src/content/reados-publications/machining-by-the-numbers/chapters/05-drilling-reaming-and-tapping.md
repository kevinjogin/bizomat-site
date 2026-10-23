---
book: machining-by-the-numbers
chapterSlug: drilling-reaming-and-tapping
order: 5
title: "Drilling, reaming and tapping calculations"
description: "Calculate drilling speeds, feeds and hole times including point length, estimate drilling power and torque, choose tap drill sizes and time synchronised tapping cycles."
draft: false
---

Holes are the most common machined feature, and often the most numerous. A part with a dozen holes spends a surprising share of its cycle time drilling, tapping and moving between holes. The calculations are simple, but each has a detail that is easy to forget: the extra length of the drill point, the power needed in a tough material, the pitch that fixes the tapping feed, or the time to reverse out of a blind tapped hole.

This chapter works through the holes in the Harbourline flange: six through holes, two tapped holes and the large bore drilled on the lathe.

## Speed and feed for drills

Drill spindle speed follows the same formula as any rotating tool:

**n = 1000 × vc ÷ (π × D)**

Drill feed is given per revolution, fn, in mm/rev, and the feed rate is:

**vf = fn × n**

Solid carbide drills generally run at much higher cutting speeds than high-speed steel drills, and their feeds per revolution increase roughly in proportion to diameter. Tool supplier data, for the specific drill geometry and coating, is the right starting point.

For the flange's six Ø11 bolt holes, Harbourline plans a solid carbide drill at 90 m/min and 0.18 mm/rev:

- n = 1000 × 90 ÷ (π × 11) = 2,604 rev/min
- vf = 0.18 × 2604 = 469 mm/min

```figure
type: stats
title: Drilling the six Ø11 bolt holes
caption: Solid carbide drill at 90 m/min and 0.18 mm/rev, with an assumed kc of 2,000 N/mm².
- 2,604 rev/min | Spindle speed
- 469 mm/min | Feed rate
- 0.324 min | Cutting time for six holes
- *1.49 kW · 5.44 N·m | Power and torque
```

## Spot drilling and chamfering

High-speed steel drills, and long drills of any material, can wander as they enter an uneven or inclined surface, so a short spot or centre drill is often used first to start the hole in the right place. Many modern carbide drills are designed to start accurately on a flat surface without a spot, which saves a tool change and an operation for each hole.

A spot drill with an included angle larger than the drill's point can also produce the hole's entry chamfer in the same operation, which removes a separate chamfering step. For the flange's bolt holes, Harbourline's carbide drills start without a spot, and a combined chamfering pass is used only where the drawing calls for an edge break. Each extra tool adds a tool change, which Chapter 10 shows is not free.

## The length of a drilled hole

A drill does not cut a flat-bottomed hole. Its conical point must pass right through the material before a through hole is complete. The length of the point is:

**L_point = (D ÷ 2) ÷ tan(point angle ÷ 2)**

For the common 118° point angle, L_point = 0.30 × D. For a 140° point, common on carbide drills, it is about 0.18 × D.

The total feed length for a through hole is the hole depth plus the point length plus an approach clearance, and often a small breakthrough allowance:

**L = depth + L_point + approach**

For the bolt holes, through 20 mm of flange with a 118° point and a 2 mm approach:

- L_point = 0.30 × 11 = 3.3 mm
- L = 20 + 3.3 + 2 = 25.3 mm
- Time per hole: 25.3 ÷ 469 = 0.054 min
- Six holes: **0.324 min** of cutting time, plus the rapid moves between holes

On a thin part, the point and approach are a large fraction of the total length. Here they add more than a quarter to the drilling time.

```figure
type: svg
title: The feed length of a drilled through hole
alt: A drill with a 118 degree point passes through a 20 millimetre plate. The total feed length is the 2 millimetre approach, the 20 millimetre depth and the 3.3 millimetre point length.
caption: L = depth + point length + approach = 20 + 3.3 + 2 = 25.3 mm for each Ø11 hole.
viewbox: 0 0 640 330
body:
<path class="bx" d="M80 110H260V250H80Z"/>
<path class="bx" d="M380 110H560V250H380Z"/>
<rect class="fi bob" x="270" y="20" width="100" height="230"/>
<path class="fi bob" d="M270 250L320 280L370 250Z"/>
<path class="li" d="M600 70V110M600 110V250M600 250V280"/>
<path class="ln" d="M592 70H608M592 110H608M592 250H608M592 280H608"/>
<text class="tx" x="580" y="94" text-anchor="end">approach 2</text>
<text class="txb" x="580" y="186" text-anchor="end">depth 20</text>
<text class="txa" x="580" y="272" text-anchor="end">point 3.3</text>
<path class="la" d="M300 268L320 280L340 268"/>
<text class="tx" x="320" y="310" text-anchor="middle">118° point: 0.30 × D</text>
<path class="lf dsh" d="M40 70H620"/>
<text class="tx" x="40" y="62">tool start</text>
```

## Removal rate, power and torque in drilling

A drill of diameter D advancing at vf removes material at:

**Q = (π × D² ÷ 4) × vf ÷ 1000** in cm³/min

For the Ø11 holes: Q = π × 11² ÷ 4 × 469 ÷ 1000 = 44.5 cm³/min.

Power follows from removal rate and the specific cutting force kc, the energy needed per unit volume of material, which Chapter 6 discusses in detail. Substituting the spindle speed formula into the removal rate gives a convenient form used by tool suppliers:

**Pc = fn × vc × D × kc ÷ 240,000** in kW

with fn in mm/rev, vc in m/min, D in mm and kc in N/mm². The constant 240,000 collects the conversions.

This is an illustration. Taking an assumed kc of 2,000 N/mm² for the medium-carbon steel at drilling chip thicknesses:

- Pc = 0.18 × 90 × 11 × 2000 ÷ 240,000 = **1.49 kW**
- Torque: M = Pc × 9549 ÷ n = 1.49 × 9549 ÷ 2604 = **5.44 N·m**

The factor 9,549 converts kilowatts and revolutions per minute into newton-metres. Thrust force, the axial push on the drill, is also significant in drilling, largely because the chisel edge at the centre of a conventional drill pushes material aside rather than cutting it. Thrust matters for thin or poorly supported workpieces and for workholding, and suppliers give methods for estimating it.

## Moving between holes

Six holes on an 80 mm pitch circle sit 60° apart, so neighbouring holes are a chord of 80 × sin 30° = **40 mm** apart. Moving from the first hole to the last means five moves of 40 mm, 200 mm in all. At a rapid traverse of 30 m/min, that is only about **0.4 seconds** of travel, if the axes could reach full speed instantly.

They cannot. On short moves, the time is dominated by acceleration, deceleration and the settling of the axes, and each hole also needs a rapid retract to a clearance plane and a rapid approach back down. In practice, the time between holes is often a second or more, and for a part with many small holes, that time can exceed the drilling time itself. Chapter 10 treats these moves as part of the non-cutting time; for now, the lesson is that hole count matters as much as hole depth. A drilling cycle that retracts only to a low clearance plane between holes, where the part and fixture allow it, saves time on every hole.

## Where the holes end up

A hole's position depends on more than the program. The drill can deflect as it enters if the surface is uneven or the drill is long and slender; the part may be positioned slightly differently from part to part, as Fixtures That Repeat explains; and the machine's own positioning accuracy contributes a small amount. A drilled hole is generally less accurately positioned and less straight than a bored or interpolated one.

For the flange, the bolt holes are clearance holes for bolts, so their position tolerance is usually generous. The M8 tapped holes, by contrast, may need to line up with a mating part, and their position is set by the tap drill. Where a hole position is critical, a stiff, short drill, a flat entry surface and checking the first part's hole positions before running the batch are the practical controls.

## The large bore: indexable drilling on the lathe

On operation 10, Harbourline drills the flange's bore to Ø38 with an indexable insert drill held stationary in the lathe turret while the work rotates. It plans 180 m/min and 0.10 mm/rev:

- n = 1000 × 180 ÷ (π × 38) = 1,508 rev/min
- vf = 0.10 × 1508 = 151 mm/min
- Feed length, through the 34 mm blank with approach and breakthrough: 40 mm
- Time: 40 ÷ 151 = **0.265 min**

Indexable drills have a flat cutting face with inner and outer inserts and no long point, so the extra length is small. They are sensitive to alignment with the spindle and to adequate coolant pressure for chip evacuation. Indexable drill suppliers give feed ranges that should not be undercut, because too light a feed can cause vibration and poor chip formation.

## Tap drill size

The minor diameter of an internal thread is produced by the drill, not the tap. For ISO metric coarse threads, a widely used starting point is:

**Tap drill ≈ D − P**

where D is the nominal diameter and P the pitch. For M8 × 1.25: 8 − 1.25 = 6.75 mm, and the standard tap drill is 6.8 mm. By the usual workshop definition of percentage thread, that gives roughly a 75% to 80% thread, which in practice gives nearly full thread strength while greatly reducing tapping torque and the risk of tap breakage compared with a smaller hole.

Thread strength also depends on the length of engagement. As a rule of thumb, an engagement of about one to one and a half times the nominal diameter in steel lets the screw fail before the internal thread strips. Softer materials, such as aluminium, need more. The READOS chapter on [bolted joints that stay tight](/reados/collections/machine-elements-and-mechanical-design/bolted-joints-that-stay-tight/) discusses the wider joint design.

For the flange's two M8 holes, with 14 mm of usable thread, Harbourline drills Ø6.8 to 18 mm, allowing for the tap's lead chamfer, which cannot cut a full thread. With a 118° point (2.0 mm long) and a 2 mm approach, the feed length is 22 mm. At 80 m/min and 0.15 mm/rev, the drill runs at 3,745 rev/min and 562 mm/min, taking 0.039 min per hole, or **0.078 min** for both.

## Synchronised tapping

On modern machining centres, taps are usually run in rigid or synchronised tapping cycles, in which the control locks the feed to spindle rotation. The feed per revolution must equal the thread pitch exactly:

**vf = P × n**

Taps run at much lower cutting speeds than drills. At 10 m/min, an M8 tap runs at 1000 × 10 ÷ (π × 8) = 398 rev/min, with a feed rate of 1.25 × 398 = 497.5 mm/min.

A tapped blind hole must be fed in and reversed out. For a thread of 14 mm with a 2 mm approach, the tap travels 16 mm each way:

- Time per hole: 2 × 16 ÷ 497.5 = 0.064 min
- Two holes: **0.129 min**

Many controls allow the retraction to run faster than the feed in, which shortens the cycle. Spindle reversal also takes time, particularly on large spindles, and should be included in a detailed estimate.

```figure
type: formula
title: Synchronised tapping: the feed must equal the pitch
formula: vf = P × n
caption: Two M8 holes take 0.129 min of tapping; spindle reversal adds to this in a detailed estimate.
- P | thread pitch, 1.25 mm for M8
- n | 1000 × 10 ÷ (π × 8) = 398 rev/min at 10 m/min
step: vf = 1.25 × 398 = 497.5 mm/min
step: Per hole, in and out over 16 mm: 2 × 16 ÷ 497.5 = 0.064 min
step: Two holes: 0.129 min
```

## Check threads with gauges

Threaded holes are normally checked with thread plug gauges: a go gauge that must screw in to the required depth, and a no-go gauge that must not enter more than a small amount. The gauges confirm the thread's functional size, which depends on the pitch diameter rather than the drilled minor diameter. A thread that accepts a bolt is not necessarily within tolerance, and a thread made with a worn tap may pass the go gauge but fail the no-go.

For the flange, checking the two M8 holes with go and no-go gauges on the first part and at intervals through the batch catches tap wear before it produces a rejected part. The depth of usable thread, 14 mm in this case, should be checked with the go gauge as well, because a tap that does not reach full depth, or a drill that was too short, leaves the bottom threads incomplete.

## Reaming and finishing holes

Drilled holes are rarely accurate enough for fits such as H7. Reaming removes a small allowance, typically a few tenths of a millimetre on diameter for small and medium holes, to produce an accurate size and good finish. Reamers generally run at lower cutting speeds and higher feeds per revolution than drills of the same diameter; follow the reamer supplier's data for allowance, speed and feed. Too small an allowance makes the reamer rub, and too large an allowance overloads it.

The flange's Ø40 H7 bore is finished by single-point boring on the lathe instead, as described in Chapter 3. Boring corrects the position and straightness errors of the drilled hole as well as its size, which reaming cannot.

## Deep holes

Holes deeper than about three to five diameters need care with chip evacuation. Peck drilling, in which the drill retracts periodically to clear chips, adds considerable time and should be estimated from the number and length of retractions. Drills with through-tool coolant at adequate pressure can often drill much deeper holes without pecking. The READOS chapter on [drilling, reaming and tapping](/reados/collections/machining-and-metal-parts/drilling-reaming-and-tapping-holes/) covers the practical techniques.

## Count all the hole-making steps

When estimating a part with holes, it is easy to count only the drilling. A complete count for the flange's operation 30 includes the drill for the six bolt holes, the tap drill for the two M8 holes, the tap itself, any chamfering, the tool changes between them and the moves between holes. Listing every step, with its tool, length and feed, before adding up the times prevents the most common estimating error for hole-rich parts: a quote built on the drilling time alone.

## Common mistakes

- **Forgetting the point length** on through holes and the tap lead chamfer on blind tapped holes.
- **Tap drills that are too small,** which raise torque and break taps for little gain in strength.
- **Tapping feeds not equal to pitch.** In synchronised cycles the feed must match the thread exactly.
- **Ignoring retraction and reversal** in tapping times.
- **Underestimating drilling power** with large drills in tough materials.

## Questions to ask

- What point angle does the drill have, and has its length been included?
- Is the tap drill size standard for the thread, and is the engagement length adequate for the material?
- Can the spindle deliver the torque needed for the largest drill at the planned speed?
- Do any holes need pecking, and how much time does it add?

## Exercise: time the holes on a part

Choose a part with several drilled and tapped holes. For each hole, calculate the spindle speed, feed rate, feed length including point and approach, and cutting time. For tapped holes, include reversal and retraction. Add the times, then add the rapid moves between holes from the program. Compare the hole-making share of the total cycle with your expectations.

The power calculation in this chapter used an assumed specific cutting force. The next chapter explains where that value comes from and uses it to check whether a machine can take the planned cuts.
