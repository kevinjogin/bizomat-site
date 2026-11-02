---
book: buckling-by-the-numbers
chapterSlug: when-yield-meets-buckling
order: 4
title: "When yield meets buckling"
description: "Why Euler's formula overestimates stocky members, and how the Johnson parabola, the Rankine–Gordon formula and classic column formulas bridge the gap between squashing and buckling."
draft: false
---

Euler's formula assumes the steel stays elastic right up to the moment of buckling. For a slender member that is true: it buckles at a stress far below yield. For a stocky member it is not. As the slenderness falls, the Euler stress climbs towards the yield stress and then past it, and somewhere along the way the steel starts to yield before the member buckles elastically. In that range, Euler's formula promises more than the member can deliver.

This chapter explains why, describes three ways of bridging the gap between a member that squashes and one that buckles, applies them to HT-8's braced leg segment, and shows the error of a spreadsheet that only knew Euler.

## Why stocky members fall short of Euler

Two things make a real member of intermediate slenderness weaker than Euler predicts.

**Yielding begins early.** A steel member is never stress-free before it is loaded. Rolling, welding and cold-forming leave residual stresses locked into the section: some fibres in compression, others in tension, balancing each other out. When an external compressive load is added, the fibres that were already in compression reach yield first, at an average stress well below the nominal yield stress. Once they yield, they no longer contribute their full stiffness, and the section's effective bending stiffness falls. Buckling then happens at a lower load than the elastic E would suggest. The effect is strongest when the Euler stress is near the yield stress.

**Imperfections matter more.** Every member is slightly crooked and every load slightly off-centre. Chapter 5 shows that these add bending stresses that grow as the load approaches the Euler load. For a stocky member whose Euler stress is near yield, the added bending is enough to start yielding at the outer fibre well before the Euler load is reached.

### The tangent modulus

A third way of seeing the same problem looks at the steel's stress-strain curve. Euler's formula uses E, the slope of the curve in its straight, elastic part. Once the steel starts to yield, or once its fibres start to yield unevenly because of residual stresses, the slope of the curve falls. The slope at any point is called the tangent modulus, E_t. Friedrich Engesser suggested in 1889 that a column stressed into this range should buckle at the Euler load calculated with E_t in place of E, and after half a century of argument F. R. Shanley showed in 1947 that the tangent-modulus load is the load at which a real column begins to bend sideways.

The idea explains the shape of the column curves. For a steel with a sharp yield point and no residual stress, E_t equals E right up to yield and then drops to nearly zero, so the column curve would follow Euler up to the yield stress and then go flat. Real hot-rolled members, with residual stresses, start to lose stiffness at perhaps half the yield stress. Cold-formed tubes, such as the CHS sections in this book, have a rounded stress-strain curve with no sharp yield point at all, because the forming has already worked the steel. Their tangent modulus starts to fall gradually well below the nominal yield. In both cases the result is a smooth curve that leaves the Euler curve at roughly half the yield stress and runs down to the squash load, which is very much what the Johnson parabola does.

Both effects are largest at intermediate slenderness. For very slender members the Euler stress is so far below yield that neither matters much. For very stocky members there is no buckling to speak of, and the member squashes at its yield stress.

## Three ways to bridge the gap

### The Johnson parabola

J. B. Johnson proposed in the 1890s a parabola that starts at the yield stress for zero slenderness and meets the Euler curve tangentially at a stress of half the yield stress:

```figure
type: formula
title: The Johnson parabola and its transition slenderness
formula: σ_cr = S_y − (S_y × λ ÷ 2π)² ÷ E, for λ < C_c
formula: C_c = π × √(2E ÷ S_y)
formula: Above C_c, use Euler: σ_cr = π² × E ÷ λ²
caption: λ = K × L ÷ r. At λ = C_c both formulas give S_y ÷ 2, and their slopes match, so the change from one to the other is smooth.
- S_y | yield strength, MPa
- E | elastic modulus, MPa
- λ | slenderness ratio
- C_c | transition slenderness, 106.2 for E = 200,000 MPa and S_y = 350 MPa
```

The Johnson parabola is the method used by the KEVOS® [Column buckling](/tools/column-buckling/) tool and the other KEVOS® buckling tools in this book whenever the slenderness is below the transition value. It is simple, smooth and widely used in machine design. It does not represent any particular steel's residual stresses or any particular fabrication tolerance; it is a sensible engineering curve, not a code curve.

### The Rankine–Gordon formula

An older approach, from the nineteenth century, blends crushing and buckling in a single expression:

P_cr = S_c × A ÷ (1 + a × λ²)

where S_c is the crushing strength and a is a constant. With a = S_c ÷ (π² × E), the formula approaches the squash load for stocky members and the Euler load for slender ones. In between it gives lower values than either. Historically, a was also fitted to tests for particular materials and end conditions.

The KEVOS® [Column strength by Rankine–Gordon](/tools/rankine-column/) tool calculates the crippling load from the crushing strength, modulus, area, least second moment of area, length and effective length factor, using the theoretical constant unless you enter an empirical one, and gives the factor against your applied load. It reports the crushing load of a short column alongside, which is a useful sense check.

### Classic and modern code curves

Steel design codes go further. They use column curves fitted to large test programmes, with different curves for different section types and manufacturing methods, because residual stresses differ between, say, a hot-rolled I-section and a cold-formed tube. Australia's steel structures standard, AS 4100, takes this approach, with member section constants that depend on the section and how it was made. For any structure that must comply with the Building Code or a client's specification, the code's curve, not any of the formulas here, is the one to use.

Before limit-state codes, working-stress formulas gave an allowable stress directly, with a factor of safety built in. One historic set, the classic American formulas reproduced in engineering handbooks, gives a parabola in pounds per square inch up to a slenderness of 120 and a secant-type formula above it, reduced for main members. The KEVOS® [Column formula comparison](/tools/column-formula-compare/) tool puts the Euler load, the Rankine–Gordon crippling load and that classic safe load side by side for one member, from its area, least radius of gyration, length, effective length factor, crushing strength and modulus. Its guide notes, correctly, that the classic formula is a historic working-stress method and that new designs should use the current steel code.

## Comparing the curves

```figure
type: line
title: Critical stress against slenderness, E = 200,000 MPa, yield 350 MPa
x: Slenderness K × L ÷ r
y: Critical stress, MPa
ymin: 0
ymax: 400
legend: Euler, shown where below 400 MPa | Johnson below C_c, Euler above | Rankine–Gordon, theoretical constant
mark: 106.2 | C_c
caption: The Euler curve rises without limit as the slenderness falls; the Johnson curve is capped by yield; the Rankine–Gordon curve sits below both in the intermediate range. Above a slenderness of about 150 all three are close.
- 25 |  | 340.3 | 315.1
- 50 |  | 311.2 | 242.5
- 75 | 350.9 | 262.7 | 175.2
- 100 | 197.4 | 194.9 | 126.2
- 125 | 126.3 | 126.3 | 92.8
- 150 | 87.7 | 87.7 | 70.1
- 200 | 49.3 | 49.3 | 43.3
- 250 | 31.6 | 31.6 | 29.0
```

Three features of the chart are worth fixing in the memory.

At high slenderness, above about 150 for this steel, all methods agree closely. Slender members are governed by elastic stiffness and the choice of formula hardly matters.

At intermediate slenderness, from about 50 to 120, the methods differ by up to a factor of two. This is where the choice of formula matters, and where real members are most sensitive to their imperfections and residual stresses.

At low slenderness, below about 25, the member is effectively a short block that squashes at about its yield stress.

## HT-8's braced segment by each method

This is an illustration. Each of HT-8's legs, braced at mid-height, buckles on a 2,000 mm segment with a slenderness of 77.9, in the intermediate range where the methods disagree most.

```figure
type: compare
title: HT-8 leg on its 2,000 mm braced segment by four methods
cols: Critical stress, MPa | Load, kN | Factor on 19.7 kN
rowhead: Method
- Euler (not valid here) | 325.0 | 266.5 | 13.5
- * Johnson parabola | 255.8 | 209.7 | 10.66
- Rankine–Gordon, theoretical constant | 168.5 | 138.2 | 7.03
- Classic working-stress safe load, main member | 96.9 allowable | 79.5 allowable | utilisation 25%
- Squash load, A × S_y | 350.0 | 287.0 | 14.6
caption: This is an illustration. CHS 76.1 × 3.6, C350, A = 820 mm², r = 25.66 mm, slenderness 77.9. The classic formula gives an allowable stress that already includes its own factor of safety, so its load is not comparable directly with the others.
```

The Johnson and Rankine–Gordon loads differ by a third, which shows how much depends on the method at this slenderness. HT-8's braced legs pass comfortably by any of them, so the choice does not change the design. It matters for members that are close to their limit, and for those the governing code's curve should decide.

The Rankine–Gordon tool, given a crushing strength of 350 MPa, E = 200 GPa, A = 820 mm², I = 540,065 mm⁴, L = 2,000 mm, K = 1, a theoretical constant and P = 19,669 N, reports a Rankine constant of 1/5,640, a crippling load of 138.2 kN, a crushing load of 287.0 kN and a factor of 7.03. The column formula comparison tool, given A = 820 mm², r = 25.66 mm, L = 2,000 mm, K = 1, a crushing strength of 350 MPa, E = 200 GPa, a main member and 19.7 kN, reports the same Rankine–Gordon load, an Euler load of 266.5 kN and a classic safe load of 79.5 kN.

### Stronger steel helps only stocky members

A consequence of the Johnson curve is that a stronger steel raises the buckling load of a stocky member but not of a slender one.

```figure
type: compare
title: HT-8 leg segments in three steel grades
cols: Transition slenderness | Buckling load at slenderness 77.9, kN | Buckling load at slenderness 155.9, kN
rowhead: Yield strength
- 250 MPa | 125.7 | 165.6 | 66.6
- * 350 MPa | 106.2 | 209.7 | 66.6
- 450 MPa | 93.7 | 241.3 | 66.6
caption: This is an illustration. Johnson parabola below each grade's transition slenderness, Euler above. On the 2,000 mm braced segment the stronger grades carry more; on the full 4,000 mm all three buckle elastically at the same 66.6 kN.
```

On the full 4,000 mm length all three grades buckle at exactly the same load, because the slenderness of 155.9 is above every grade's transition value and only E matters. Paying for a higher grade of steel for a slender member buys nothing. Bracing it does.

## The error: a spreadsheet that only knew Euler

This is an illustration. The shop's older column spreadsheet calculated the Euler load for every member, whatever its slenderness, and compared it with the load. It had served well for long, slender members such as handrail posts and light struts.

When the shop used it for a 600 mm long stub of CHS 76.1 × 3.6 under the pump skid next to HT-8, it reported a buckling load of 2,961 kN for a member whose squash load is 287 kN. Nobody would have believed that number, and the checker did not. But the same spreadsheet, used on HT-8's 2,000 mm leg segments, reported 266.5 kN, which looked plausible, and that one did get into the first design note. It overstated the Johnson value by 27%.

On HT-8 the overstatement did no harm, because the factor was large either way. On a heavily loaded member at a slenderness of 50 to 100, the same mistake could turn an inadequate member into one that appeared to pass. The shop retired the spreadsheet and now uses tools that switch between Johnson and Euler at the transition slenderness and report which governs. The rule written into its template is short: if the Euler stress is more than half the yield stress, Euler's formula is not valid.

```figure
type: checklist
title: Before trusting a buckling load
caption: The open item is the one the old spreadsheet skipped.
- Slenderness calculated about the least axis | Chapter 3
- Effective length factor justified | Chapter 2
- ? Euler stress compared with half the yield stress | if higher, use Johnson, Rankine–Gordon or the code curve
- Crookedness and load offset considered | Chapter 5
- Code curve used where the work must comply with a standard | AS 4100 for steel structures
```

### Very short members

At the other end of the scale, the pump-skid stub that the old spreadsheet got so wrong is a useful reminder of what does govern a short member. This is an illustration. At 600 mm long, the stub's slenderness is 600 ÷ 25.66 = 23.4. The Johnson parabola gives 341.5 MPa, a load of 280 kN, within 3% of the 287 kN squash load. For a member this short, buckling of the member as a whole is not the issue at all.

What matters instead are the local checks: the bearing stress under the base plate and on the concrete, the welds that join the stub to its plates, local buckling of the tube wall if it is thin, and the effect of any offset load, which on a short member produces bending without much amplification. A short member is a stress problem, and a design that spends effort on its buckling check while skipping its welds has its priorities upside down.

## Which method to use

For checking machine members, temporary works and first estimates, the Johnson parabola with a suitable factor of safety, as the KEVOS® buckling tools use, gives sensible answers. The Rankine–Gordon formula is more conservative at intermediate slenderness and is a useful second opinion. For steel structures that must comply with a standard, the code's member capacity is the answer, and the simple formulas are for checking it is roughly right. And for any method, the inputs matter more than the formula: an effective length factor that is too low or a radius of gyration about the wrong axis will defeat the best curve.

## Exercise: a grade 250 leg

This is an illustration. A supplier offers the same CHS 76.1 × 3.6 tube in a grade with a 250 MPa yield strength at a lower price.

1. What is the transition slenderness for this grade?
2. On HT-8's 2,000 mm braced segment, what does the Johnson parabola give for the critical stress, buckling load and factor on 19.7 kN?
3. On the full 4,000 mm length, if the mid-height struts were removed, what is the buckling load, and how does it compare with the C350 tube?
4. Would you accept the cheaper grade for HT-8?

**Worked answer.**

1. C_c = π × √(2 × 200,000 ÷ 250) = **125.7**.
2. The slenderness, 77.9, is below 125.7, so Johnson applies: σ_cr = 250 − (250 × 77.9 ÷ 2π)² ÷ 200,000 = **201.9 MPa**; load 201.9 × 820 = **165.6 kN**; factor 165.6 ÷ 19.7 = **8.42**.
3. The slenderness, 155.9, is above 125.7, so Euler applies, and the load is **66.6 kN**, exactly the same as the C350 tube. Grade makes no difference to an elastically buckling member.
4. On buckling alone the grade 250 tube is adequate, with a factor of 8.42 on the braced segment. The decision depends on the other checks: the leg-to-frame welds, the base plates, and the extra compression from wind and imperfections in Chapter 5. If those pass, the cheaper grade is acceptable, provided the drawings and purchase order specify it and the material certificates confirm it.
