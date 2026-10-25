---
book: arc-welding-by-the-numbers
chapterSlug: weld-metal-in-fillet-welds
order: 5
title: "Weld metal in fillet welds"
description: "Calculate the throat, cross-section and mass of fillet welds, see how fast weld metal grows with leg size and gaps, and estimate the weld metal in a conveyor frame."
draft: false
---

Most of the welds on a fabricated frame are fillet welds: triangular welds in the corner between two parts meeting at an angle, usually a right angle. They are quick to prepare, because the parts need no edge preparation, and their size is easy to specify and measure. Their geometry also makes them easy to calculate, which is the basis of every estimate of electrodes, time and cost. The calculation has one feature that catches out estimators and welders alike: weld metal grows with the square of the leg size, so a small oversize costs much more than it looks.

This chapter calculates the weld metal in the conveyor frames, shows the effect of oversize welds and fit-up gaps, and links weld size to strength.

## Fillet weld geometry

A fillet weld is specified by its leg length, the distance from the root of the joint to the toe of the weld along each part. An equal-leg fillet in a right-angle corner, with a flat face, is a right-angled triangle with two sides equal to the leg z.

Two quantities follow:

- **throat**, the shortest distance from the root to the face, which governs strength: a = z ÷ √2 ≈ 0.707 × z;
- **cross-sectional area**, which governs the volume of weld metal: A = z² ÷ 2.

Real welds are rarely perfectly flat. A slightly convex face adds metal beyond the triangle, and some penetration below the surfaces adds a little more. Estimators allow for this with a profile factor, typically about 1.1 for a slightly convex fillet, which the shop has confirmed by sectioning and weighing its own welds.

```figure
type: formula
title: Weld metal in a 6 mm fillet weld
formula: A = z² ÷ 2 × profile factor;  mass per metre = A × 1,000 × ρ
caption: This is an illustration. The profile factor of 1.1 allows for a slightly convex face; the shop confirmed it by sectioning its welds. Steel density 7,850 kg/m³ is 0.007 85 g/mm³.
- z | leg length, 6 mm
- profile factor | 1.1
- ρ | density of steel, 7.85 × 10⁻⁶ kg/mm³
step: A = 6² ÷ 2 × 1.1 = 19.8 mm²
step: mass per metre = 19.8 × 1,000 × 7.85 × 10⁻⁶ ≈ 0.155 kg/m
step: throat a = 6 ÷ √2 ≈ 4.24 mm
```

The WORKOS [fillet weld quantity calculator](/tools/fillet-weld-quantity/) performs the same calculation, with the profile factor and deposition efficiency as inputs.

## Weld metal in a conveyor frame

This is an illustration. Each conveyor frame has about 20 m of 6 mm fillet weld:

| Location | Weld length |
|---|---|
| Cross-member connections to the side rails | 9.0 m |
| Legs, bracing and foot plates | 6.5 m |
| Brackets, idler mounts and stiffeners | 4.5 m |
| **Total** | **20.0 m** |

At 0.155 kg/m, the frame needs 20 × 0.155 43 ≈ **3.11 kg** of weld metal. Chapter 4 showed that this takes about 125 of the shop's 4.0 mm electrodes, 6.0 kg bought, and about two hours of arc time.

## The square law: oversize welds

Because the area depends on z², weld metal rises much faster than leg size. Welders often make fillets a little larger than specified, to be sure they meet the minimum, and inspectors rarely reject a weld for being too big. The cost of that habit is easy to underestimate.

```figure
type: bars
title: Weld metal per conveyor frame by fillet leg size
unit: kg per frame (20 m)
max: 6
caption: This is an illustration with a profile factor of 1.1. A 7 mm fillet, one millimetre over the 6 mm specified, uses 36% more weld metal and, at the same deposition rate, 36% more arc time.
- 5 mm | 2.16
- *6 mm (specified) | 3.11
- 7 mm | 4.23
- 8 mm | 5.53
```

A 7 mm fillet has an area of 7² ÷ 2 × 1.1 = 26.95 mm², which is (7 ÷ 6)² ≈ 1.36 times the 6 mm area. On the conveyor frame that is about 4.23 kg instead of 3.11 kg, 1.12 kg more weld metal, about 45 more electrodes and about 45 more minutes of arc time on every frame, for no benefit if 6 mm was the right size. An 8 mm fillet uses 78% more than the 6 mm. Oversize welds also put more heat into the work, which increases distortion.

The shop's response was to make weld size visible: welders carry fillet gauges, the drawings show the size clearly, and the weekly inspection measures a sample of welds against both the minimum and a maximum, with oversize reported as well as undersize.

## Concave, convex and unequal welds

A fillet's face may be flat, convex or concave. A convex weld has extra metal beyond the triangle, which adds to the weld metal but not to the design throat, because the throat is measured to the inscribed triangle. A concave weld is thinner at the centre than its legs suggest, so its actual throat can be less than 0.707 times the leg; for a concave weld, the throat must be measured, not calculated from the leg. That is why fillet gauges have separate scales for convex and concave welds.

Unequal-leg fillets arise deliberately, where one part is much thicker than the other or the joint is not at a right angle, and accidentally, where the weld has sagged onto the lower plate in the horizontal position. For an unequal-leg fillet with legs z₁ and z₂ in a right-angle corner, the cross-section is z₁ × z₂ ÷ 2, and the throat is the height of the triangle from the root to the face, z₁ × z₂ ÷ √(z₁² + z₂²). A 6 × 8 mm fillet, for example, has an area of 24 mm² and a throat of 48 ÷ 10 = 4.8 mm. A weld that sags into a 5 × 7 mm fillet when 6 × 6 was intended has an area of 17.5 mm² and a throat of 35 ÷ √74 ≈ 4.07 mm, below the 4.24 mm of the intended weld even though one leg is oversize.

## Measuring what was welded

The weld sizes in an estimate are only useful if the welds made match them, so the shop measures them. A fillet gauge checks the leg or the throat against a set size; a multi-purpose welding gauge measures leg, throat, reinforcement and undercut. Measurements are taken on cooled, cleaned welds, away from starts and stops, at several points along each weld.

The shop's weekly sample measures ten welds on one frame. This is an illustration. One week's results showed a mean leg of 6.6 mm with a range from 6.1 to 7.4 mm. All the welds met the 6 mm minimum, but the mean leg was 10% over size, which means (6.6 ÷ 6)² ≈ 1.21 times the planned weld metal, 21% more electrodes and arc time than the estimate allowed. The trend was discussed with the welders, and the next month's sample averaged 6.3 mm.

## Taking weld lengths off drawings

The weld length in an estimate comes from the drawings. Each weld symbol states the size, the length and whether the weld is continuous, intermittent or all round. The take-off counts every weld, multiplies by the number of identical joints, and adds them up by size and type. Intermittent welds are counted by their weld length, not the joint length: a pattern of 50 mm welds at 150 mm pitch welds one-third of the joint. Welds all round a member are counted on its full perimeter. The conveyor frame's 20 m came from such a take-off, and the shop checks it against a weighed frame from time to time by recording the electrodes used.

## Strength comes from the throat

The design strength of a fillet weld comes from its throat area: throat times effective length, multiplied by the design shear strength that the governing design standard allows for the weld metal and weld category. For structural steel in Australia, the design rules are set by the applicable standards, such as AS 4100 for steel structures and the AS/NZS 1554 series for welding, and the weld size on the drawing is set by the designer using them. This book does not reproduce those values.

The geometry is still useful. A 6 mm fillet has a throat of about 4.24 mm; an 8 mm fillet has a throat of about 5.66 mm. Throat, and so strength, rises in proportion to leg size, but weld metal rises with its square. Doubling the leg doubles the strength per metre but quadruples the weld metal. Where more strength is needed, a longer weld at the same size is often cheaper than a bigger weld over the same length, if the joint allows it. The WORKOS [fillet weld strength calculator](/tools/fillet-weld-strength/) shows the relationship between throat, length and an allowable shear stress entered by the user.

## Gaps at the root

A fillet weld's throat is measured from the root, the corner where the two parts meet. If the parts do not meet, because a cross-member has been cut short or out of square, there is a gap at the root. The weld then has to bridge the gap, and its effective throat is smaller than its leg suggests.

This is an illustration. Approximating the geometry, a 2 mm root gap reduces the effective leg on the gapped part by about the size of the gap. A 6 mm fillet measured on the surface would then have an effective throat of about (6 − 2) ÷ √2 ≈ **2.83 mm** instead of 4.24 mm, a third less strength than the drawing intends, even though the weld looks the right size. Common practice, where a procedure allows the gap at all, is to increase the leg by the size of the gap, which for a 2 mm gap means an 8 mm leg and 78% more weld metal on that joint.

```figure
type: compare
title: A 6 mm fillet with and without a 2 mm root gap
cols: Tight fit-up | 2 mm gap, 6 mm leg | 2 mm gap, 8 mm leg
caption: This is an illustration using the approximation that the gap reduces the effective leg by its own size. The gap either weakens the weld or costs extra weld metal; fixing the fit-up avoids both.
- Effective throat | 4.24 mm | about 2.83 mm | about 4.24 mm
- Weld metal per metre | 0.155 kg | 0.155 kg | 0.276 kg
- Strength relative to design | 100% | about 67% | about 100%
```

Gaps are a fit-up problem, not a welding problem. They come from inaccurate cutting, out-of-square ends, distortion during earlier welding and poor fixturing. Chapter 8 deals with fit-up; the point here is that a gap either makes the weld weaker or makes it bigger, and both cost money.

## Other weld types on the frame

The conveyor frames have a few other welds that need their own calculation. The head and tail plates have butt welds, prepared with a bevel, whose cross-section depends on plate thickness, bevel angle, root gap and root face; [Weld Repairs That Hold](/reados/publications/weld-repairs-that-hold/joint-preparation-and-weld-volume/) works through groove areas and their sensitivity to root gap. Plug welds and slot welds are calculated from the volume of the hole. Intermittent fillet welds are calculated from their total length, not the length of the joint. Every type follows the same rule: weld metal is cross-sectional area times length, times a profile factor, times density.

## A failure: the cross-members that measured right

This is an illustration. A customer's inspector checking a batch of frames found that several cross-member welds, although they measured 6 mm on the fillet gauge, had visible gaps at the root on one side, up to about 2.5 mm. The inspector rejected them as below the design throat.

The shop's investigation started with the saw. A batch of angle cross-members had been cut on a band saw whose blade had wandered, leaving ends up to 2 mm out of square across the 75 mm leg of the angle. Fitted against the channel webs, they touched on one edge and gapped on the other. The welders had made the specified 6 mm fillets, measured on the surface, without noticing the gaps under the slag.

The rejected welds were assessed with the designer, and the joints were built up to a larger leg where the gap was within the procedure's limit, or the cross-members were cut out and replaced where it was not. The saw blade was replaced and its guides adjusted, a squareness check on the first cut of each batch was added, and the fit-up check before welding (Chapter 8) now includes a feeler gauge at the root of each cross-member.

## Exercise: smaller and larger welds

A lighter conveyor frame uses 5 mm fillets over the same 20 m, and a heavy-duty frame uses 8 mm fillets. Using a profile factor of 1.1, calculate the weld metal per metre and per frame for each, the number of the shop's 4.0 mm electrodes (25 g deposited each) and the arc time at 1.5 kg/h. Compare with the 6 mm frame.

For 5 mm: area 5² ÷ 2 × 1.1 = 13.75 mm², so 13.75 × 1,000 × 7.85 × 10⁻⁶ ≈ **0.108 kg/m** and **2.16 kg** per frame. That needs about 2,159 ÷ 25 ≈ **87 electrodes** and 2.16 ÷ 1.5 ≈ **1.44 h** of arc time.

For 8 mm: area 8² ÷ 2 × 1.1 = 35.2 mm², so about **0.276 kg/m** and **5.53 kg** per frame. That needs about 5,526 ÷ 25 ≈ **221 electrodes** and 5.53 ÷ 1.5 ≈ **3.68 h** of arc time.

The 6 mm frame needs 3.11 kg, 125 electrodes and 2.07 h. Moving from 6 mm to 8 mm adds about 78% to weld metal and arc time for 33% more throat. An 8 mm fillet would also usually need more than one run with a 4.0 mm electrode, which the shop's procedure would have to cover; the extra runs add slag removal and restarts, so the real time difference would be larger still.
