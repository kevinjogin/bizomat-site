---
book: designing-welded-joints-by-the-numbers
chapterSlug: butt-welds
order: 2
title: "Butt welds: full and partial penetration"
description: "Size butt welds from their effective throat, compare full and partial penetration, see how the groove angle and a double-V change the weld metal, and why reinforcement does not count."
draft: false
---

A butt weld joins two parts edge to edge, or a part's edge to another's face, by filling a gap or a prepared groove between them. Made with full penetration, it fuses the whole thickness and becomes, in effect, part of the plate: the joint can be as strong as the parts. Made with partial penetration, it fuses only part of the thickness and is weaker in a way that is easy to forget. Choosing between them, and choosing the groove's shape, decides the joint's strength, its cost and how much it distorts.

This chapter defines the effective throat of a butt weld, sizes full and partial penetration welds for a tension splice, calculates how much weld metal different groove shapes need, and explains why the reinforcement on the surface of a butt weld adds nothing to its design strength.

## Full and partial penetration

A **complete penetration** butt weld fuses the parts through their whole thickness, usually by welding from both sides, or from one side onto a backing bar or with a technique that fuses the root completely. Its effective throat, the thickness used to calculate its strength, is the thickness of the thinner part joined. If the weld metal is at least as strong as the parent metal and the weld is sound, the joint carries the same load as the plate.

An **incomplete** or **partial penetration** butt weld fuses only part of the thickness, leaving an unfused region at the root. Its effective throat is less than the plate thickness, related to the depth of the preparation, and design standards set how it is measured and what allowances apply. A partial penetration weld is cheaper and distorts less, because it uses less weld metal, but it carries less load, and its unfused root is a built-in crack-like discontinuity.

```figure
type: compare
title: Full and partial penetration butt welds
cols: Effective throat | Strengths | Limits
caption: General characteristics. The design standard defines the effective throat and any allowances for partial penetration welds; values here are for illustration.
- *Complete penetration | thickness of the thinner part | full strength of the plate; best in fatigue when the root is sound | more weld metal; needs back-gouging, backing or a skilled root
- Partial penetration | less than the thickness, from the preparation depth | less weld metal and distortion | lower strength; unfused root; poor in fatigue and in tension across the root
```

## Sizing a butt weld in tension

A butt weld loaded in tension across its length carries a stress equal to the load divided by its effective throat times its length.

```figure
type: formula
title: Stress in a butt weld splice in a tension member
formula: σ = F ÷ (t_e × L)
caption: This is an illustration for a 100 mm × 12 mm flat bar in a walkway support carrying 150 kN in tension. The partial penetration case assumes an effective throat of 8 mm, an illustration only.
- F | 150 kN
- L, weld length across the bar | 100 mm
- t_e, complete penetration | 12 mm
step: complete penetration: σ = 150,000 ÷ (12 × 100) = 125 MPa, the same as in the bar
step: partial penetration, t_e = 8 mm: σ = 150,000 ÷ (8 × 100) ≈ 188 MPa
step: the partial penetration weld carries 50% more stress than the bar beside it
```

With complete penetration, the weld's stress is the bar's stress, and if the bar is adequate, so is the weld. With partial penetration, the weld is the weakest section of the member, and the joint must be checked on its throat. In a tension member, that usually means a complete penetration weld is needed, or the member's design must allow for the reduced throat.

## Reinforcement does not count

A butt weld usually stands slightly proud of the plate surface, with a crown called the reinforcement. It is tempting to count it as extra strength, and Whittemore's 1910 tests show why that is a mistake. The unground welds of those tests, rough and bulging, were hard to measure, and when their cross-section was taken at the thinnest points, their efficiencies appeared higher than they were; grinding the surface flush gave more consistent and more honest results. The reinforcement adds metal, but it also adds a sharp change of section at the weld toe, which concentrates stress, so that under repeated loads a reinforced weld can be weaker than a flush one. Design codes therefore calculate butt weld strength on the effective throat alone, ignoring reinforcement, and joints that must resist fatigue are often specified with the reinforcement ground flush (Chapter 8).

## Preparing the groove

A butt weld in thin plate can be made with square edges and a small gap, but thicker plate needs a groove so that the welder can reach the root and fuse the full thickness. The Davis-Bournonville course of 1919 taught its gas welders to bevel each plate at about 45°, giving an included angle of about 90°, and noted that a smaller angle could be used on brass and bronze. Arc welding, with its more penetrating heat source, commonly uses smaller included angles, often around 60° for a single-V groove in steel, with a root gap and a root face set by the welding procedure.

The angle matters for cost, because the groove's cross-section is the weld metal that must be deposited.

```figure
type: formula
title: Cross-sectional area of a single-V butt weld groove
formula: A = t² × tan(θ ÷ 2) + g × t
caption: Ignoring the root face and reinforcement, for 20 mm plate with a 2 mm root gap. The weld metal per metre of joint is the area times a metre times the density of steel.
- t, plate thickness | 20 mm
- g, root gap | 2 mm
- θ, included angle | 60° or 90°
step: 90° groove: A = 400 × tan 45° + 40 ≈ 440 mm²
step: 60° groove: A = 400 × tan 30° + 40 ≈ 271 mm²
step: double-V, 60° each side: A ≈ 2 × 100 × tan 30° + 40 ≈ 155 mm²
```

```figure
type: bars
title: Weld metal needed for a 20 mm butt weld by groove shape
unit: mm² of groove cross-section
max: 480
caption: This is an illustration. Calculated as in the formula above. A double-V halves the depth of each side, and the area falls with the square of the depth.
- Single-V, 90° | 440
- *Single-V, 60° | 271
- Single-V, 45° | 206
- Double-V, 60° each side | 155
```

The narrower groove needs about 40% less weld metal than the 90° groove the early gas welders used, and a double-V needs less again, because each side is only half as deep and the area grows with the square of the depth. The double-V also balances the shrinkage on the two sides of the plate, reducing angular distortion. Its costs are access to both sides and, usually, back-gouging of the root before welding the second side. A narrower groove saves weld metal but must still be wide enough for the welder to reach and fuse the root, which the welding procedure sets.

## Backing, back-gouging and the root

A complete penetration weld needs a sound root, and there are three common ways to get one. Welding from both sides, after gouging or grinding the back of the first side's root to sound metal, is the most reliable, because any lack of fusion at the root of the first side is removed before the second side is welded. Welding from one side onto a steel backing bar, tacked behind the joint and left in place, lets the welder fuse the root against the bar; it is common where the back is inaccessible, but the bar remains, with a crevice behind it and a notch at its edge, which matters in fatigue and corrosion. Welding from one side with an open root and a technique or process that fuses the root completely, as in pipe welding, needs the most skill. The designer's choice affects the cost, the inspection and the fatigue performance, and belongs on the drawing.

## Efficiency, then and now

Whittemore's oxy-acetylene welds of 1910 averaged roughly two-thirds to three-quarters of the plate's strength in the first series, with individual specimens ranging from under half to above the plate's strength. A modern complete penetration butt weld, made to a qualified procedure by a qualified welder with matching filler and inspected, is expected to carry the full strength of the plate, and design standards treat it so. The difference is not in the steel but in the control: qualified procedures, consistent consumables, trained welders and inspection. A designer who specifies a complete penetration weld relies on all of those being in place, which is why the specification of the weld and the specification of its procedure, welder qualification and inspection go together.

## Butt welds in compression and shear

Most of this chapter has dealt with tension, the most demanding case. A butt weld in compression is less critical, because an unfused region carries compression by bearing, provided the parts are fitted closely, though designers still size compression welds on their throat. In shear along the weld, a butt weld carries load on its throat area in the same way as a fillet weld (Chapter 3). Many butt welds carry combinations of these, which Chapter 7 deals with.

## Joints between different thicknesses

When plates of different thicknesses are butt welded, the effective throat is that of the thinner plate, and the change of section concentrates stress. Design practice tapers the thicker plate down to the thinner one over a length, so that the stress flows smoothly through the joint, especially where fatigue matters. The taper is a detail the designer shows on the drawing; left to the fabricator, the joint may be welded with an abrupt step.

## Butt welds in tee joints

A tee joint can also be made with a butt weld: the edge of the standing plate is bevelled, on one or both sides, and the weld fills the bevel to fuse the plate's full thickness into the face of the other part, often with a small reinforcing fillet over the top. This complete penetration tee joint carries the standing plate's full strength in tension and bending, where a pair of fillet welds might not, and it is the usual choice for highly stressed or fatigue-loaded tee joints. It also loads the face plate through its thickness, which for thick plate can raise the risk of lamellar tearing, the tearing of the plate between its rolled layers.

## Partial penetration in bending

Partial penetration butt welds are especially poor where bending puts their root in tension. Imagine a partial penetration weld made from one side only, joining a plate loaded so that it bends with the unwelded side in tension: the unfused root opens like a crack under the load, and the stress at its tip is very high. If the same weld is loaded so that its root is in compression, it may be adequate. Designers therefore avoid single-sided partial penetration welds where the root can see tension, and use complete penetration or double-sided partial penetration welds instead.

## Inspection and the throat

A butt weld's strength depends on its throat being fully fused, and the fusion inside a butt weld cannot be seen from outside. Complete penetration welds in important joints are therefore inspected by ultrasonic testing or radiography, at a frequency the design specification sets, as Testing Welded Joints by the Numbers describes. The designer's specification of a complete penetration weld is only as good as the inspection that confirms it; a drawing that calls for complete penetration without any inspection is a hope rather than a design.

## When a butt weld is the wrong choice

A complete penetration butt weld is the strongest joint, but it is often not the best. It needs edge preparation, more weld metal, more skill, more inspection and usually more distortion than fillet welds, and for many joints that carry modest loads, a pair of fillet welds or a lap joint does the job for a fraction of the cost. Designers sometimes specify complete penetration welds everywhere "to be safe", which raises the cost of a frame substantially without making it any safer where the loads are low. The better habit is to use complete penetration where the load or fatigue demands it, and to let fillet welds carry the rest, sized as the next chapter describes.

## The running case: the walkway splice

This is an illustration. The walkway supports needed a flat bar tie, 100 mm by 12 mm, longer than the stock lengths, so the designer considered a butt weld splice. The tie carries about 150 kN in tension under the design load. A complete penetration butt weld, from both sides with the root back-gouged, would carry the bar's full stress of about 125 MPa; a partial penetration weld with an 8 mm throat would carry about 188 MPa, more than the bar, and would put the unfused root in tension.

The designer chose a complete penetration weld, specified ultrasonic testing of the splice, and located the splice away from the support's connections, where the bending was least. A second option, avoiding the splice by ordering longer bar, turned out cheaper once the inspection cost was counted, and the final design used it. Avoiding a weld is often the best weld design of all.

## A failure: the hidden partial penetration

This is an illustration. On an earlier frame, the company's drawing had shown a butt weld symbol on a tension member's splice without saying whether full penetration was required. The fabricator, reasonably, made a single-sided weld that fused about two-thirds of the thickness, which was easier and quicker. The member cracked from the unfused root under repeated loads within a year.

The drawing, not the fabricator, was at fault. A butt weld symbol without a penetration requirement leaves the decision to the person welding, who will usually choose the quicker option. Chapter 10 explains how the drawing should say what is needed.

## Exercise: groove metal per metre

A 16 mm plate is to be butt welded with a single-V groove of 60° included angle and a 2 mm root gap, over 3 m of joint. Calculate the groove area, the volume and the mass of weld metal, ignoring reinforcement and losses. Compare a double-V preparation with 60° on each side.

The single-V area is 16² × tan 30° + 2 × 16 ≈ 256 × 0.577 + 32 ≈ **180 mm²**. Over 3 m, the volume is 180 × 3,000 = 540,000 mm³, and the mass about 540,000 × 7.85 ÷ 1,000,000 ≈ **4.2 kg**.

The double-V area is 2 × 8² × tan 30° + 32 ≈ 2 × 64 × 0.577 + 32 ≈ **106 mm²**, about 2.5 kg for the 3 m joint, about 40% less weld metal, with balanced shrinkage, at the cost of welding from both sides and back-gouging the root.
