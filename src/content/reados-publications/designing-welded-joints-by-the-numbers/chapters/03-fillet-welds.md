---
book: designing-welded-joints-by-the-numbers
chapterSlug: fillet-welds
order: 3
title: "Fillet welds: throat, length and capacity"
description: "Size fillet welds from the throat, calculate the load a millimetre of weld can carry at each size, find the length a joint needs, and see why doubling the leg nearly quadruples the weld metal."
draft: false
---

Fillet welds are the commonest welds in fabrication. They join tees, laps and corners without edge preparation, they are quick to make, and they carry most of the load in most machine frames and light structures. They are also the welds most often sized by habit, because their size is so easy to write on a drawing: a triangle and a number. Sizing them properly needs one idea, the throat, and one formula.

This chapter defines the leg and the throat of a fillet weld, calculates the load each millimetre of weld can carry at common sizes, sizes the welds on the conveyor drive's gearbox mounting plate, and explains why oversizing fillet welds is so costly. It uses the illustrative design shear strength of 200 MPa from Chapter 1, which is not a design value.

## Leg and throat

A fillet weld in a right-angled corner has a roughly triangular cross-section. Its **leg** is the length of each side of the triangle along the parts' surfaces, and it is the size usually written on drawings: a "6 mm fillet" has legs of 6 mm. Its **throat** is the shortest distance from the root of the joint to the face of the theoretical triangle, and it is the dimension through which the weld is assumed to carry load. For an equal-leg fillet in a right-angled corner with a flat face, the throat is the leg times the cosine of 45°, about 0.707 times the leg.

```figure
type: formula
title: Throat and capacity of a fillet weld
formula: a = 0.707 × s, and q = τ_d × a
caption: For an equal-leg fillet in a right-angled corner. q is the load the weld can carry per millimetre of length at the design shear strength τ_d; 200 MPa is an illustration, not a design value.
- s, leg | 6 mm
- τ_d, illustrative design shear strength | 200 MPa
step: throat a = 0.707 × 6 ≈ 4.24 mm
step: capacity q = 200 × 4.24 ≈ 848 N per millimetre of weld
step: 100 mm of 6 mm fillet carries about 85 kN at this strength
```

The throat is defined on the largest triangle that fits inside the weld's actual cross-section, so a weld with a convex face has no more throat than one with a flat face, and a weld with a concave face has less. A concave fillet with 6 mm legs may have a throat noticeably less than 4.24 mm, which is why inspection gauges measure the throat as well as the legs. Penetration beyond the root, which many processes produce, is not usually counted unless the welding procedure has been qualified to prove it.

## Capacity per millimetre

Because the capacity is simply the throat times the design strength, it rises in proportion to the leg.

```figure
type: bars
title: Load a millimetre of fillet weld can carry, by leg size
unit: N per mm of weld, at an illustrative 200 MPa on the throat
max: 1800
caption: This is an illustration. Calculated from q = 200 × 0.707 × s. Real design capacities depend on the filler, the parent metal and the factors in the applicable standard.
- 4 mm | 566
- 5 mm | 707
- *6 mm | 848
- 8 mm | 1131
- 10 mm | 1414
- 12 mm | 1697
```

The simplest design method, used widely, treats the fillet weld as carrying shear on its throat in whatever direction the load acts, and checks that the resultant force per millimetre of weld, from all the loads, does not exceed the capacity per millimetre. More refined methods allow some extra strength for welds loaded across their length (Chapter 4), but the simple method is conservative and easy to apply to complicated joints.

## Sizing a lap joint

This is an illustration. A tie in the walkway frame is a 10 mm flat bar carrying 120 kN in tension, lapped onto a gusset plate and joined by two longitudinal fillet welds, one along each edge of the bar. Each millimetre of 6 mm fillet carries about 848 N, so the two welds together carry about 1,696 N per millimetre of lap. The lap length needed is about 120,000 ÷ 1,696 ≈ **71 mm**, which the designer rounded up to 80 mm, plus allowances at the weld ends where the weld does not reach full size. With 8 mm fillets, about 53 mm would do.

The calculation also tells the designer where to stop. A 10 mm bar of an ordinary structural steel can carry far more than 120 kN in tension, so the joint's capacity is set by the welds; making the lap long enough to develop the bar's full strength would need a much longer lap, which may or may not be wanted. Designing the weld for the actual load, not the bar's full strength, saves weld metal, but the designer must be sure the load will never exceed it, or the joint, not the bar, becomes the weak point.

## The running case: the gearbox mounting plate

This is an illustration. The gearbox sits on a 16 mm plate welded across two frame members. The welds carry the gearbox's weight, about 3 kN, and its reaction torque, which the designer resolved into a pair of opposite forces of about 18 kN on the two frame members, reversing whenever the conveyor stops and starts. Each frame member is welded to the plate by two fillets, each 250 mm long.

With 18 kN plus a share of the weight, about 19.5 kN, on each member's 500 mm of weld, the force per millimetre is about 39 N/mm, far below even a 4 mm fillet's capacity. On strength alone, a 4 mm fillet would be ample. But the reversing load means fatigue matters (Chapter 8), and fillet welds that are too small for the plate thickness can crack from shrinkage when the heavy plate cools them fast (Chapter 4). The designer chose 6 mm fillets for those reasons, not for strength, and recorded why. A reviewer seeing a weld far stronger than its calculated load would otherwise be tempted to reduce it.

## Effective length

Fillet welds do not reach their full size at their very ends, where the welder starts and stops, and very short welds behave poorly. Design standards set an effective length, often the actual length less an allowance at each end, and a minimum length for a weld to count at all. For long welds in lap joints loaded along their length, standards may also reduce the design capacity, because the load is not shared evenly along a very long weld. The designer applies the standard's rules; the practical point is that a fillet weld's capacity comes from its effective length, not its drawn length.

## Intermittent welds

Where the load is low, a fillet weld need not be continuous. Intermittent welds, short lengths of weld with gaps between them, carry the load with less weld metal and less distortion. A 6 mm fillet welded 50 mm on and 100 mm off carries a third of the load of a continuous weld, which may be ample. Intermittent welds have costs of their own: more starts and stops, each a potential defect; crevices between the welds where corrosion can start; and poor performance in fatigue, because each weld end is a stress concentration. They suit statically loaded, sheltered joints, such as stiffeners and cover plates, and are best avoided where loads repeat or where the joint is exposed.

## Size drives cost

The cross-sectional area of a fillet weld is half the leg squared, so the weld metal per metre rises with the square of the leg. An 8 mm fillet needs about 1.78 times the weld metal of a 6 mm fillet, and a 10 mm fillet about 2.78 times, while their strengths rise only in proportion to the leg, by 1.33 and 1.67 times. Arc Welding by the Numbers calculates weld metal in fillet welds in its chapter on [weld metal in fillet welds](/reados/publications/arc-welding-by-the-numbers/weld-metal-in-fillet-welds/), and the KEVOS® tools include a [fillet weld strength calculator](/tools/fillet-weld-strength/) and a [fillet weld quantity calculator](/tools/fillet-weld-quantity/).

The consequence is that, where more strength is needed, a longer weld of the same size is usually cheaper than a larger weld of the same length. Two 6 mm fillets each 100 mm long carry the same load as one 12 mm fillet 100 mm long but use half the weld metal. Large fillet welds also need several passes, adding time and distortion.

## Single-sided fillets

A tee joint welded with a fillet on one side only is hinged about the unwelded side: a load that bends the standing plate towards the unwelded side opens the root of the weld and concentrates stress there, as the partial penetration butt weld in Chapter 2 did. Single-sided fillets are therefore used only where the load cannot bend the joint that way, or where the other side is closed by another part, and designers prefer a fillet on each side of a tee wherever both sides can be reached.

## Unequal legs and skewed joints

Not every fillet sits in a right-angled corner. Where the parts meet at an acute or obtuse angle, or where an unequal-leg fillet is used to blend into a thicker part, the throat must be calculated from the actual geometry rather than the 0.707 factor, and standards set limits on the angles for which a fillet weld may be relied on. Skewed tee joints are common in frames with sloping members; the designer works out the throat for each and specifies the legs on the drawing, so that the welder knows what size to make on each side.

## Fillets round hollow sections

The conveyor frame is made of rectangular hollow sections, and many of its welds are fillets round the ends of members where they meet others. A weld all round a hollow section looks generous, but its capacity is not shared evenly round the perimeter: the parts of the weld over the section's side walls, which are stiff in the direction of the load, carry much more than the parts over the flexible flat faces between them, as Chapter 1's point about stiffness attracting load suggests. Design guides for hollow section connections give methods that allow for this and for the local bending of the connected faces. For a first estimate, the designer can count only the weld over the walls that carry the load, and check the face of the section separately.

## Checking an existing weld

Fillet weld arithmetic works backwards as easily as forwards, which is useful when checking an existing machine or a joint someone else designed. Measure the legs and the throat with a gauge, measure the effective length, calculate the capacity at a suitable design strength, and compare it with the load the joint carries. A repairer checking a cracked bracket, or an engineer asked whether a frame can take a heavier motor, can tell in a few minutes whether the welds were ever large enough, and therefore whether the crack is a weld problem or a load problem. The answer often changes the repair.

## Design strength and the filler

The illustrative 200 MPa in this book stands for a design shear strength on the throat for an ordinary structural filler. Real values depend on the filler's strength classification, which is printed on the consumable's packaging and data sheet, and on the factors the standard applies. A higher-strength filler raises the weld's capacity, but only if the parent metal can carry the load as well, and higher-strength fillers can bring a higher risk of hydrogen cracking. Chapter 7 discusses matching the filler to the steel.

## A failure: the concave welds

This is an illustration. A batch of handrail posts on an earlier job had their base plates welded with fillets specified as 6 mm. The posts passed visual inspection by eye. When one post bent under a man leaning on it, the inspector measured the welds with a gauge: their legs were about 6 mm, but their faces were strongly concave, and their throats were only about 3 mm, about 70% of the design throat.

The welder had been running hot and fast, which wetted the legs well but drew the face in. The welding procedure was adjusted, the welders were shown the throat gauge as well as the leg gauge, and the design note for the posts now states the throat as well as the leg. Throat, not leg, carries load.

## Exercise: a bracket weld

A 12 mm plate bracket is welded to a column with two vertical 6 mm fillets, one on each side of the plate, each 150 mm long. It carries a 60 kN vertical load directly in line with the welds, with no eccentricity. Using the illustrative capacity of 848 N/mm, check the welds. Would 5 mm fillets do?

The two welds have a total length of 300 mm and a capacity of about 300 × 848 ≈ **254 kN**, far above the 60 kN load; the force per millimetre is about 60,000 ÷ 300 = **200 N/mm** against a capacity of 848 N/mm. Five millimetre fillets, with a capacity of about 707 N/mm, would also be ample on strength.

But a load exactly in line with the welds is rare in a bracket; most brackets carry their load some distance from the welds, and Chapter 5 shows that the moment of that load can multiply the stress several times. The designer would check the eccentricity before reducing the weld size.
