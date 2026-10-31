---
book: adhesive-bonding-by-the-numbers
chapterSlug: lap-joints-and-shear-lag
order: 6
title: "Lap joints and shear lag"
description: "How shear stress is really spread along a bonded overlap, the Volkersen shear-lag model, why longer overlaps stop adding strength, and choosing a design shear stress to size an overlap."
draft: false
---

The lap joint is the basic bonded joint: two flat parts overlapping, with adhesive between them, pulled in opposite directions. It loads the adhesive in shear, the direction it carries best, and it is the joint used to measure adhesive strength. It is also the joint whose behaviour is most often misunderstood, because the obvious assumption, that the adhesive carries the load evenly over the overlap, is wrong in a way that decides how long an overlap should be.

This chapter explains why the shear stress peaks at the ends of an overlap, works through the shear-lag model published by Volkersen in 1938, shows why a longer overlap soon stops adding strength, and sizes a bonded lock-reinforcing strap on Plant K's door. Its error is borrowing a coupon's average strength for a longer joint.

## Why the stress is not uniform

Picture a single lap joint pulled from its ends. At the left end of the overlap, the upper adherend carries the whole load and the lower carries none. At the right end, the opposite. In between, load passes through the adhesive from one adherend to the other. As the upper adherend gives up load, its stress falls and it stretches less; the lower adherend picks up load and stretches more. The two adherends therefore stretch by different amounts at each point, and the adhesive between them has to shear to accommodate the difference.

The difference in stretching is largest at the ends, where one adherend is fully loaded and the other is not, and smallest in the middle. So the adhesive's shear strain, and its shear stress, is highest at the ends and lowest in the middle. If the adherends were perfectly rigid, they would not stretch at all and the stress would be uniform; it is the adherends' elasticity, together with the adhesive's flexibility, that concentrates the load at the ends. This effect is called **shear lag**.

## The Volkersen model

Volkersen's analysis treats the adherends as elastic bars in tension and the adhesive as an elastic layer in shear, and ignores bending. For two identical adherends of modulus E and thickness t, joined by an adhesive of shear modulus G and thickness η over an overlap of length L, it gives a shear stress that follows a hyperbolic cosine along the overlap, with a single parameter ω controlling how sharply it peaks.

```figure
type: formula
title: Volkersen's shear-lag result for a balanced lap joint
caption: Elastic adherends in tension, elastic adhesive in shear, no bending, identical adherends. The peak is at both ends of the overlap. Real joints also bend, which adds peel stress at the ends, as Chapter 7 describes.
- ω = √(2G ÷ (E t η)) | the shear-lag parameter, in 1/mm
- step: τ_max ÷ τ_avg = (ωL ÷ 2) × coth(ωL ÷ 2) | the peak-to-average ratio
- step: P_max = τ_max × b × (2 ÷ ω) × tanh(ωL ÷ 2) | the load at which the peak reaches the adhesive's limit, width b
- step: as L grows, tanh → 1 and P_max → 2 τ_max b ÷ ω | the capacity reaches a ceiling
```

The first line says that a stiffer adhesive, a thinner bondline or more flexible adherends make ω larger and the stress more peaked. The second says the peak-to-average ratio grows almost in proportion to the overlap once ωL is more than about 4. The third and fourth say that the load a joint can carry rises with overlap at first, then levels off: beyond an overlap of a few times 1 ÷ ω, the middle of the joint carries almost nothing and adding length adds nothing.

### Plant K's numbers

For Plant K's test coupons, two strips of 1.6 mm 5052 aluminium with a modulus of about 70,000 MPa, bonded with the toughened epoxy at an illustrative shear modulus of 800 MPa and a bondline of 0.2 mm:

ω = √(2 × 800 ÷ (70,000 × 1.6 × 0.2)) = √0.0714 = 0.267 per mm, so 1 ÷ ω = 3.74 mm.

Most of the load transfer happens within about three times that distance, about 11 mm, of each end of the overlap.

```figure
type: compare
title: Elastic shear-lag predictions for Plant K's coupons, 25 mm wide
rowhead: Overlap
cols: Peak ÷ average shear stress | Average stress at failure | Failure load
caption: This is an illustration. Volkersen model with ω = 0.267 per mm and an illustrative adhesive limit of 32 MPa at the peak. The failure load rises little beyond about 20 mm of overlap, while the average stress at failure keeps falling.
- 5 mm | 1.14 | 28.0 MPa | 3.49 kN
- 10 mm | 1.53 | 20.9 MPa | 5.21 kN
- * 12.5 mm | 1.79 | 17.9 MPa | 5.58 kN
- 20 mm | 2.70 | 11.9 MPa | 5.93 kN
- 25 mm | 3.35 | 9.5 MPa | 5.97 kN
- 40 mm | 5.35 | 6.0 MPa | 5.99 kN
```

The table makes the central point plainly. Doubling the overlap from 12.5 to 25 mm raises the predicted failure load by only 7%, from 5.58 to 5.97 kN, while the average shear stress at failure nearly halves. Going to 40 mm adds almost nothing.

### What the model leaves out

The elastic model is a guide to the shape of the problem, not a strength calculation, because three effects it ignores all matter.

- **Adhesive plasticity.** Toughened epoxies yield in shear before they break. Once the ends have yielded, they carry their yield stress while further load is pushed towards the middle, so a ductile adhesive spreads the load more evenly than the elastic model predicts and longer overlaps continue to help somewhat. Elastic–plastic analyses developed for aircraft joints account for this.
- **Bending and peel.** A single lap joint is offset: the two adherends' centre lines do not line up, so the joint rotates under load and the adherends bend at the ends of the overlap. That bending peels the adhesive at exactly the places where shear is highest. Chapter 7 takes this up.
- **Adherend yielding.** Thin, soft adherends may yield before the adhesive fails, and once they yield they stretch far more at the ends, concentrating strain further.

The model also shows why bondline thickness matters. With a 0.1 mm bondline the peak-to-average ratio at 12.5 mm rises to 2.40; with 0.5 mm it falls to 1.35. A thicker bondline is more uniformly loaded. But thick bondlines of rigid adhesives tend to contain more voids and to fail at lower loads in tests for other reasons, so most structural adhesives are used at 0.1 to 0.3 mm, often controlled with glass beads mixed into the adhesive.

## What the coupons showed

Plant K bonded coupons from its own 1.6 mm skin stock, prepared by its own process, at the 12.5 mm overlap usual for lap shear testing and at 25 mm.

```figure
type: stats
title: Plant K's lap shear coupons in 1.6 mm 5052 aluminium
caption: This is an illustration. Coupons 25 mm wide, abraded and wiped, cured with the oven cycle. The data-sheet figure of 25 MPa was measured on thicker, stronger alloy adherends, which bend and stretch less.
- 5.6 kN | mean failure load at 12.5 mm overlap, an average of 17.9 MPa
- 6.6 kN | mean failure load at 25 mm overlap, an average of 10.6 MPa
- 165 MPa | stress in the adherend at 6.6 kN, at about its yield strength
- 25 MPa | data-sheet lap shear strength, on different adherends
```

Two lessons came out at once. The plant's coupons gave 17.9 MPa, not the data sheet's 25, because thin, soft 5052 adherends stretch and bend more than the stronger alloy used for the data sheet; a lap shear "strength" belongs to the adherends and the geometry as well as the adhesive. And doubling the overlap raised the failure load by only 18%, rather more than the elastic model's 7% because the toughened adhesive yields, but nowhere near double. At 6.6 kN the adherend itself was at about its yield stress, so a longer overlap could not have helped much more.

## Sizing an overlap

Plant K's new door type has a lock that pulls on the skin through a bonded reinforcing strap, 1.6 mm thick and 40 mm wide, overlapping the skin by 25 mm at each end. The plant set itself a requirement that each end carry a pull of 2 kN with a margin.

The [lap joint length tool](/tools/lap-joint-length/) sizes the overlap of a brazed, soldered or bonded lap or sleeve joint. From the thickness and strength of the thinner member, the joint width, the shear strength of the joint material and a wanted ratio of joint to member strength, it gives the overlap needed, the overlap in member thicknesses, the member's capacity w t σ, the joint's capacity w L τ at a chosen overlap, and a check against a service load. It assumes uniform shear over the overlap and says so; its guide notes that for adhesives a longer overlap gives diminishing returns. That assumption is safe only if the shear strength entered is the average failure stress measured at the overlap and with the adherends actually used.

```figure
type: compare
title: Sizing the lock strap's 25 mm overlap with different shear strengths
rowhead: Shear strength entered
cols: Overlap for 1.25 × member strength | Joint capacity at 25 mm | Against a 2 kN pull
caption: This is an illustration. From the lap joint length tool with t = 1.6 mm, w = 40 mm, member strength 160 MPa (member capacity 10.24 kN) and a 25 mm overlap. Only the last two rows use a strength that belongs to this overlap and these adherends.
- 17.9 MPa, the 12.5 mm coupon average | 17.9 mm, overlap adequate | 17.9 kN | passes, but the strength is borrowed from a shorter overlap
- 10.6 MPa, the 25 mm coupon average | 30.2 mm, overlap short | 10.6 kN | passes
- * 5.3 MPa, the 25 mm average halved for heat and ageing | 60.4 mm, overlap short | 5.3 kN | passes, 2.65 times the pull
```

## The error: a borrowed strength

The first sizing of the strap used the 12.5 mm coupon result. The tool reported that a 17.9 mm overlap would make the joint 1.25 times stronger than the strap and that the chosen 25 mm gave a capacity of 17.9 kN. The design was approved on that basis, with a capacity said to be almost nine times the 2 kN pull.

The figure was borrowed from a shorter joint. At 25 mm overlap, the coupons themselves showed an average failure stress of 10.6 MPa, not 17.9, because the extra length carried little load. Entering 10.6 MPa, the capacity falls to 10.6 kN and the tool reports that the overlap is short of what the 1.25 strength ratio requires: 30.2 mm. And the coupons were tested fresh at room temperature. A design shear stress has to allow for the joint's hottest service temperature, for ageing in moisture and for scatter, which together often halve the value. At 5.3 MPa, the strap's capacity is 5.3 kN.

The tool's "overlap short" verdict at the lower strengths also teaches something. The requirement that the joint be 1.25 times stronger than the strap cannot be met by lengthening the overlap, because lengthening it barely raises the real capacity. The tool's linear model would say 60 mm, but the coupons show the capacity has already levelled off. For a thin, ductile strap of soft aluminium, making the joint stronger than the strap is the wrong target. The right one is a capacity comfortably above the real load, after knock-downs, and a joint shape that keeps the adhesive out of peel. On that basis the 25 mm overlap carries 2.65 times the 2 kN pull and was accepted, with the strap ends tapered as Chapter 7 describes.

```figure
type: checklist
title: Choosing a design shear stress for a bonded overlap
caption: The shear strength entered in a uniform-shear calculation should be an average failure stress that already contains the shear-lag effect for the joint being designed.
- x Measured on the real adherends, thickness and preparation | not a data sheet's coupons
- x Measured at the overlap length to be used | shear lag makes the average fall with length
- x Reduced for the hottest service temperature | ask the supplier for strength against temperature
- x Reduced for moisture ageing and scatter | from durability tests, Chapter 9, and test statistics, Chapter 10
- ? Checked for peel at the overlap ends | Chapter 7
```

## Shear lag at the stiffener ends

The same idea explains where Plant K's stiffeners are most heavily loaded. When the door bends, for example when wind presses on it or when it is dropped onto an edge, the skin and the stiffener act together as a beam only if the bondline passes shear between them. Along most of the stiffener's 1,600 mm length, that shear is modest and varies slowly. At each end, though, the stiffener stops abruptly, and whatever force its flanges were carrying must pass into the skin within the short distance over which shear lag allows load to transfer, roughly 11 mm by the numbers above.

The end of a bonded stiffener is therefore a lap joint end: the most highly stressed few millimetres of the whole bondline, carrying a concentrated share of the load, and the place where the stiffener's bending also tries to peel it away from the skin. A long bonded length does not protect it. The 1,600 mm of bonded flange that made the strength-times-area calculation of Chapter 1 look so comfortable has almost nothing to do with the strength of the end.

This is consistent with what the drop tests showed: separations always started at the stiffener ends and ran back 60 to 80 mm before stopping, where the stress fell to a level the bond could hold. The cure for an end is not more bonded length but a gentler end: a tapered flange, a fillet of adhesive, or a mechanical fixing that stops peel from starting.

## Other joint shapes

The single lap is the simplest joint, not the best. A **double lap**, with the load-carrying part sandwiched between two cover plates, removes most of the bending that peels a single lap. A **scarf joint**, with the two parts tapered to a long fine edge, keeps the adherends nearly aligned and the shear almost uniform, at the cost of machining the taper. A **stepped** or **tapered lap**, in which the end of the outer adherend is thinned, reduces the stiffness change at the end of the overlap and so the peak stress. Bonded stiffeners and straps on panels behave like single laps at their ends, and tapering those ends is the practical version of the same idea.

## How this applies to a small Australian business

Do not expect a longer overlap to carry proportionally more load: beyond a length of a few times 1 ÷ ω, it carries almost nothing more. Measure lap shear on your own adherends, preparation and overlap, because a data-sheet strength belongs to someone else's coupons. Use a uniform-shear sizing tool only with a strength measured at the overlap you will use, and reduce it for temperature, ageing and scatter. When more capacity is needed, add width or change the joint shape rather than length.

## Exercise: a thicker strap

The lock strap is changed to 3 mm aluminium of the same alloy, keeping the 0.2 mm bondline. (a) What is the new shear-lag parameter ω for a balanced joint of 3 mm adherends? (b) What is the elastic peak-to-average ratio at a 25 mm overlap? (c) What does the change suggest?

**Worked answer.** (a) ω = √(2 × 800 ÷ (70,000 × 3 × 0.2)) = √0.0381 = **0.195 per mm**. (b) ωL ÷ 2 = 0.195 × 25 ÷ 2 = 2.44, and the ratio is 2.44 × coth 2.44 = **2.48**, against 3.35 for 1.6 mm adherends. (c) Stiffer adherends spread the load along the overlap more evenly, so the same overlap works harder and the average strength at failure rises. The thicker strap also stretches and bends less, so it would raise the joint's capacity more than lengthening the thin one could. The cost is weight and a stiffer step in the skin, which concentrates peel at the strap's ends unless they are tapered.
