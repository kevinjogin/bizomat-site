---
book: fins-and-heat-sinks-by-the-numbers
chapterSlug: the-fin-equation
order: 3
title: "The fin equation: how heat travels along a fin"
description: "A fin cools along its length, so its tip does less work than its root. The fin equation gives the profile and the heat for HS-150's fins, and exposes a steel fin sink costed as if it were aluminium."
draft: false
---

A fin adds surface, but not all of that surface is as hot as the base it grows from. Heat enters the fin at its root and must be conducted along it, and all the while the fin's faces are losing heat to the air. So the fin cools from root to tip, and the outer part of the fin, being cooler, sheds less heat per square metre than the inner part. How much less depends on a contest between two things: how easily heat is conducted along the fin, and how readily its faces give heat away. The **fin equation** settles that contest, and it is the basis of every fin calculation in this book.

This chapter derives the fin equation for a straight fin of uniform thickness, solves it for HS-150's fins in natural and forced air, and introduces the fin parameter m, whose inverse is a natural length scale for any fin. The running case's error came when the 250 W prototype was quoted with folded steel fins whose performance was estimated from their area alone, as if they were as conductive as aluminium.

## The energy balance on a slice

Take a straight fin of thickness t, height H from root to tip, and length L along the base, made of a material of conductivity k. The fin's root is at temperature T_b and the air at T∞, with a surface coefficient h on its faces. Consider a thin slice of the fin at distance x from the root, of height dx. Heat is conducted into the slice from the root side and out of it towards the tip; the difference is lost from the slice's two faces to the air.

With the fin thin enough that its temperature is uniform across its thickness, which needs h × t ÷ (2k) to be small, the balance gives a single equation for the excess temperature θ = T − T∞:

d²θ ÷ dx² = m² × θ,   with m = √(h × P ÷ (k × A_c))

Here P is the perimeter of the fin's cross-section, which for a thin fin is almost exactly 2L, and A_c = t × L is its cross-sectional area. For a thin straight fin, m reduces to √(2h ÷ (k × t)). The fin parameter m has units of 1/m, and its inverse, 1/m, is a length: the distance over which the fin's excess temperature would fall by a factor of e if the fin were very long. Comparing 1/m with the fin's height tells at once whether the fin is "short", nearly at its root temperature throughout, or "long", with a cold, idle tip.

## The solution

With the root held at θ_b and the tip assumed to lose negligible heat, the solution is:

θ(x) ÷ θ_b = cosh[m (H − x)] ÷ cosh(m H)

and the heat the fin carries away, all of which must enter at its root, is:

q = √(h × P × k × A_c) × θ_b × tanh(m H)

The tip in fact loses a little heat from its edge. A simple and accurate allowance is to use a **corrected height** H_c = H + t ÷ 2 in the heat formula, which adds the tip's area to the faces.

```figure
type: formula
title: The fin equation's result for one of HS-150's fins
formula: q = √(h P k A_c) × θ_b × tanh(m H_c),   m = √(2h ÷ (k t)),   H_c = H + t ÷ 2
caption: This is an illustration for one 6063-T5 fin, 45 mm tall, 2.5 mm thick and 250 mm long, in natural convection with h ≈ 5 W/m²·K (Chapter 6) and the base 54.5 K above the air.
- m | √(2 × 5 ÷ (209 × 0.0025)) ≈ 4.38 per metre; 1/m ≈ 229 mm
- m H_c | 4.38 × 0.04625 ≈ 0.202
- √(h P k A_c) | √(5 × 0.505 × 209 × 0.000 625) ≈ 0.574 W/K
step: q ≈ 0.574 × tanh(0.202) × 54.5 ≈ 0.115 × 54.5 ≈ 6.25 W per fin
step: An ideal fin at the base temperature throughout would shed about 6.30 W
```

## HS-150's fins in natural and forced air

In natural convection, HS-150's fins have a natural length scale 1/m of about 229 mm, five times their 45 mm height. They are short fins: the tip is only about 1.9 % cooler, in excess temperature, than the root, and each fin sheds 99 % of what it would if it were at the root temperature throughout. In forced air, with h about 16 W/m²·K (Chapter 8), m rises to about 7.8 per metre and 1/m falls to about 128 mm, so the tip runs about 5.9 % cooler. Only at much higher coefficients, such as 50 W/m²·K from a strong fan, does the tip fall well behind, about 17 % cooler.

```figure
type: line
title: Excess temperature along an HS-150 fin, by surface coefficient
x: Distance from the root as a fraction of the fin's height
y: Excess temperature, % of the root's
legend: h = 5 W/m²·K, natural | h = 16 W/m²·K, fan | h = 50 W/m²·K, strong fan
ymin: 80
ymax: 100
caption: This is an illustration for a 45 mm × 2.5 mm 6063-T5 fin, from θ ÷ θ_b = cosh[m(H − x)] ÷ cosh(mH). The stronger the cooling, the more the fin's outer part falls behind its root.
- 0 | 100.0 | 100.0 | 100.0
- 0.25 | 99.2 | 97.4 | 92.6
- 0.5 | 98.6 | 95.6 | 87.4
- 0.75 | 98.2 | 94.5 | 84.3
- 1 | 98.1 | 94.1 | 83.3
```

The figure shows the fin equation's central idea. Whether a fin is "good" is not a property of its shape alone; it depends on how hard it is being cooled. The same fin that is nearly perfect in still air becomes noticeably less effective under a strong fan, because its faces then remove heat faster than conduction along it can supply.

## When the fin is thick or the material poor

The fin equation assumes the temperature is uniform across the fin's thickness. The check is the fin's own Biot number, h × (t ÷ 2) ÷ k. For HS-150's fins in natural air it is about 5 × 0.00125 ÷ 209 ≈ 0.00003, and even under a strong fan it is far below 0.1, so the assumption is excellent. It would only fail for very thick fins in liquids or in boiling, which are outside this book.

The material matters through k, which sits under a square root in m. A steel fin of the same shape, with k about 54 W/m·K for a plain carbon steel, has m about twice as large as aluminium's. In natural convection, that still leaves the steel fin about 95 % efficient, because the coefficient is so small. Under a fan, the same steel fin falls to about 86 %, and a thinner, taller steel fin falls much further.

## The failure case: the steel fins costed as aluminium

This is an illustration. For the 250 W version, a sheet-metal supplier offered a fan-cooled heat sink with folded fins of 1.5 mm mild steel, 60 mm tall, brazed to a base. It was cheaper than an aluminium extrusion. The supplier's estimate of its performance took the fins' total area, multiplied it by the expected forced-air coefficient of about 16 W/m²·K, and treated every square metre as if it were at the base temperature. On that basis it matched an aluminium sink of the same geometry, and it was provisionally accepted.

The fin equation tells a different story. For a 1.5 mm steel fin, m = √(2 × 16 ÷ (54 × 0.0015)) ≈ 19.9 per metre, so 1/m is only about 50 mm, shorter than the fin's 60 mm height. The corrected height gives m H_c ≈ 1.21, and the fin carries only tanh(1.21) ÷ 1.21 ≈ **69 %** of the heat of an ideal fin; its tip's excess temperature is about 44 % below the root's. The same fin in 6063 aluminium would be about 89 % efficient.

```figure
type: compare
title: A 60 mm × 1.5 mm fin under a fan (h ≈ 16 W/m²·K), steel and aluminium
cols: Natural length 1/m | m H_c | Fin efficiency | Tip excess below root
caption: This is an illustration from the fin equation with the corrected height. The area-only estimate assumes 100 % efficiency and so overstated the steel sink's fin performance by about 44 %.
- Ideal fin, area-only estimate | infinite | 0 | 100 % | 0 %
- 6063 aluminium, k 209 W/m·K | 99 mm | 0.61 | 89 % | 16 %
- *Mild steel, k 54 W/m·K | 50 mm | 1.21 | 69 % | 44 %
```

The area-only estimate overstated the steel fins' heat transfer by about 1 ÷ 0.69 ≈ 1.44, about 44 %, and the steel sink would have run far hotter than the aluminium sink it was meant to replace. The error was caught when the drive's thermal engineer asked for the fin efficiency as part of the quotation review, a question the supplier's estimate had no answer to. The correction was either to keep aluminium or, if steel were essential, to use shorter, thicker fins and more of them, and to compare options on the fin equation's numbers, not on area. The general lesson is that a fin's area is only useful once multiplied by its efficiency, and the efficiency depends on the material, the thickness, the height and the cooling, all together.

## The fin's natural length

The quantity 1/m is worth remembering because it gives a quick sense of proportion. For HS-150's aluminium fins it is about 229 mm in natural convection and about 128 mm under a fan. Fins much shorter than 1/m are nearly isothermal and their efficiency is close to 1; fins much longer than about 2/m have cold, idle outer parts that add weight and cost without adding much cooling. This suggests a rule of thumb for checking any finned design: work out 1/m for the material, thickness and expected coefficient, and compare it with the fin height. If the fins are taller than about twice 1/m, they are probably wasting material; if they are much shorter than 1/m, they could be taller or thinner before efficiency suffers, and the real limit on their size lies elsewhere, usually in the air flow between them, which Chapters 6 and 8 address.

## What the extruder can make

The fin equation says that, in natural convection, thin aluminium fins are nearly as good as thick ones, and that taller fins lose little efficiency. The limit on how thin and how tall an extruded fin can be is set by the extrusion die, not by heat transfer. The steel tongue in the die that forms each gap between fins must withstand the pressure of the aluminium flowing past it, and a long, narrow tongue breaks. Extruders therefore limit the ratio of a gap's depth to its width, the tongue ratio, and the minimum fin thickness for a given height; the limits depend on the alloy, the press, the die design and the extruder's experience, and are best obtained from the extruder early in the design.

HS-150's fins, 45 mm tall with gaps of about 9 mm, are a modest profile. Thinner fins at the same pitch would widen the gaps slightly and help the air flow, but the efficiency gain is negligible in natural convection, as this chapter showed; the main reason to thin them would be to save weight and cost. The practical design loop is therefore: choose the spacing for the air flow (Chapter 6), choose the fin height for the area needed and the extruder's tongue-ratio limit, choose the thickness for the extruder's minimum and for the fin efficiency under the expected coefficient, and check each choice with the fin equation. Fins bonded or brazed into a base, or folded from sheet, escape the tongue-ratio limit and allow taller, thinner fins, at the cost of the root joints Chapter 2 described.

## Pins, tapers and other shapes

The same equation applies to pin fins, with P = π d and A_c = π d² ÷ 4, so that m = √(4h ÷ (k d)). Pins suit air arriving from any direction, such as an impinging fan or a sink whose orientation is not known. Tapered fins, which are thicker at the root than the tip, are common in extrusions because they are easier to extrude and put material where the heat flow is largest; their solution involves Bessel functions, but for small tapers the uniform-fin result with the average thickness is a good estimate. Annular fins on tubes and motor housings are solved the same way in radial form. In every case, the qualitative message of this chapter carries over: compare the fin's size with its natural length.

## How this applies to a small Australian business

The fin equation takes a minute in a spreadsheet and answers the questions that arise when buying or modifying heat sinks: whether a cheaper material will do, whether fins can be thinner, whether taller fins will help. For aluminium sinks in natural convection, fins are almost always efficient and the limit lies in the airflow. For fan-cooled sinks, liquid-cooled plates and any steel or stainless fins, efficiency can fall quickly, and an estimate based on area alone will be optimistic. Asking a supplier for the fin efficiency behind a performance claim is a simple test of whether the claim was calculated or guessed.

## Exercise: a taller fin

To gain area for natural convection, a designer proposes making HS-150's fins 70 mm tall instead of 45 mm, keeping 2.5 mm thickness and h ≈ 5 W/m²·K. Find m H_c, the fin efficiency and the heat per fin per kelvin of base excess, and compare with the 45 mm fin's 0.115 W/K. Ignore, for now, the effect on the air flow.

**Worked answer.** m is unchanged at about 4.38 per metre. H_c = 0.070 + 0.00125 = 0.07125 m, so m H_c ≈ 0.312, and the efficiency is tanh(0.312) ÷ 0.312 ≈ **0.969**. The heat per kelvin is 0.574 × tanh(0.312) ≈ **0.173 W/K**, about 51 % more than the 45 mm fin's 0.115 W/K for about 54 % more area.

The taller fin loses almost nothing in efficiency, as expected for a fin far shorter than its 229 mm natural length. Whether it actually helps depends on what the extra height does to the flow of air up between the fins, which Chapter 6 calculates; it also needs a deeper, heavier extrusion, and the cost must be weighed against the gain.
