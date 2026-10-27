---
book: heating-and-cooling-times-by-the-numbers
chapterSlug: the-plane-wall
order: 3
title: "The plane wall: heating the flange through"
description: "The one-term plane-wall solution gives centre and surface temperatures in plates and flanges. It is applied to DS-100's flange in furnace and quench, with a one-sided-heating error."
draft: false
---

A plate heated on both faces is the simplest shape with a real inside: heat enters both faces, travels inward, and the centre plane, which nothing crosses because of symmetry, is the last to warm. Plates are everywhere in manufacturing: flanges, die blocks, mould plates, slabs, panels, trays of food, sheets of laminate. The exact solution for a plate with a convective surface is an infinite series, but after the first few moments only its first term matters, and that **one-term solution** is accurate, easy to calculate and the basis of the classic temperature charts.

This chapter sets up the plane wall, gives the one-term solution, shows how to find its eigenvalue without a chart, and applies it to DS-100's flange in the furnace and in the quench. It ends with an error the running case made in a trial load: laying the flange flat on a solid hearth plate, which turned a plate heated on two faces into one heated on one face and more than doubled its heating time.

## Setting up the plate

Take a plate of thickness 2L, wide enough that its edges do not matter, at a uniform starting temperature Tᵢ. At time zero, both faces are exposed to surroundings at T∞ with a surface coefficient h. Measure position x from the centre plane, so the faces are at x = ±L. Because the plate is symmetric, the centre plane acts like an insulated surface: no heat crosses it. That means a plate of thickness 2L heated on both faces behaves exactly like a plate of thickness L heated on one face and insulated on the other. The characteristic length for both is L, the distance heat must travel from a heated face to the plane that heats last.

The two numbers of Chapter 1 follow. For DS-100's flange in the furnace, 2L = 40 mm, so L = 0.02 m and Bi = h × L ÷ k = 150 × 0.02 ÷ 33 ≈ 0.0909. The Fourier number is Fo = α × t ÷ L², and with α ≈ 6.47 × 10⁻⁶ m²/s, one minute is a Fourier number of about 0.97 for the flange. Because L is small, the Fourier number grows quickly: the flange's whole heating takes place at Fourier numbers far above the 0.2 at which the one-term solution becomes accurate.

## The one-term solution

Write θ = T − T∞ for the temperature difference from the surroundings, so θᵢ = Tᵢ − T∞ at the start. The one-term solution is:

θ ÷ θᵢ = C₁ × exp(−ζ₁² × Fo) × cos(ζ₁ × x ÷ L)

At the centre, x = 0 and the cosine is 1, so θ₀ ÷ θᵢ = C₁ × exp(−ζ₁² × Fo). At the surface, x = L, the centre value is multiplied by cos ζ₁. The fraction of the possible heat that has entered the plate is Q ÷ Q_max = 1 − (sin ζ₁ ÷ ζ₁) × θ₀ ÷ θᵢ, where Q_max is the heat needed to bring the whole plate to T∞.

The eigenvalue ζ₁ and coefficient C₁ depend only on the Biot number. ζ₁ is the first positive root of ζ × tan ζ = Bi, and C₁ = 4 sin ζ₁ ÷ (2ζ₁ + sin 2ζ₁).

```figure
type: formula
title: The one-term plane-wall solution
formula: θ ÷ θᵢ = C₁ × e^(−ζ₁² × Fo) × cos(ζ₁ × x ÷ L),   with ζ₁ × tan ζ₁ = Bi and C₁ = 4 sin ζ₁ ÷ (2ζ₁ + sin 2ζ₁)
caption: This is an illustration for DS-100's flange in the furnace at 850 °C, starting at 20 °C, with h = 150 W/m²·K. The calculated time for the centre to reach 840 °C is about 51.8 minutes.
- Bi | 150 × 0.02 ÷ 33 ≈ 0.0909
- ζ₁ | root of ζ tan ζ = 0.0909: 0.2970 rad
- C₁ | 4 sin 0.2970 ÷ (0.594 + sin 0.594) ≈ 1.0147
- Target θ₀ ÷ θᵢ | (840 − 850) ÷ (20 − 850) = 10 ÷ 830 ≈ 0.0120
step: Fo = ln(1.0147 ÷ 0.0120) ÷ 0.2970² ≈ 50.3
step: t = 50.3 × 0.02² ÷ 6.47 × 10⁻⁶ ≈ 3,110 s ≈ 51.8 min
```

### Finding the eigenvalue without a chart

The equation ζ × tan ζ = Bi has no closed-form solution, but it is easy to solve. In a spreadsheet, put a trial ζ in one cell, ζ × TAN(ζ) − Bi in the next, and use goal seek to drive the second cell to zero, starting from a guess between 0 and 1.57 (π/2). By hand, a few steps of bisection between 0 and π/2 converge quickly. For small Biot numbers, a good starting guess is ζ₁ ≈ √Bi, which gives 0.3015 for the flange against the true 0.2970. For large Biot numbers, ζ₁ approaches π/2 ≈ 1.5708. Every number in this book was found this way, which is more accurate than reading a chart and leaves a record of the working.

## The flange in the furnace

Stepping the one-term solution through time gives the flange's centre and surface temperatures as it heats. Because the Biot number is small, the two stay close: the surface leads the centre by about 31 K after 2 minutes, by about 16 K after 10 minutes and by under 1 K at the end.

```figure
type: line
title: DS-100's flange in the 850 °C furnace, centre and surface
x: Time in the furnace, min
y: Temperature, °C
legend: Surface | Centre plane
ymin: 0
ymax: 900
caption: This is an illustration from the one-term solution with Bi ≈ 0.091. A ten-term series gives the same values to 0.1 K at every point shown, because even 2 minutes is a Fourier number of about 1.9.
- 0 | 20 | 20
- 2 | 171 | 140
- 5 | 325 | 301
- 10 | 508 | 492
- 20 | 705 | 698
- 30 | 788 | 785
- 40 | 824 | 823
- 51.8 | 840 | 840
```

The heat absorbed follows the same curve. After 10 minutes the flange has taken about 57.5 % of the heat it will eventually take; after 20 minutes about 81.9 %; after 30 minutes about 92.3 %. The last 10 K takes as long as the first 700 K would at the starting rate, which is the exponential approach that every furnace cycle has to live with. Chapter 10 returns to that tail, because it is where most of a cycle's time goes and where a small change of target makes a large change of time.

### The heat flow behind the curve

The same solution gives the rate at which the flange takes heat, which is what the furnace has to supply. At the surface, the heat flux is h × (T∞ − T_s). With the cold flange just loaded, it is about 150 × 830 ≈ 125 kW/m², and the flange's two faces, each π × 0.22² ÷ 4 ≈ 0.038 m², take about 9.5 kW between them. After 10 minutes, with the surface at about 508 °C, the flux has fallen to 150 × 342 ≈ 51 kW/m², and after 30 minutes, at about 788 °C, to about 9 kW/m². The demand is front-loaded: most of the energy goes in during the first third of the cycle. Six shafts loaded at once ask the furnace for many times its holding power, which is why the furnace's own temperature sags after loading, and why Chapter 8 treats the furnace's recovery as part of the surface condition rather than assuming the walls stay at their setpoint.

## When one term is not enough

The one-term solution is accurate when the Fourier number is above about 0.2. Below that, the higher terms of the series have not yet died away, and the single term can give nonsense. The quench shows it clearly, because a quench happens fast.

This is an illustration. In oil at 60 °C with an assumed coefficient of 1,000 W/m²·K, the flange's Biot number becomes 1,000 × 0.02 ÷ 33 ≈ 0.606, with ζ₁ ≈ 0.7080 and C₁ ≈ 1.0820. Five seconds into the quench, the Fourier number is only about 0.081. The one-term solution says the centre is then at about 881 °C, which is hotter than the 850 °C it started at: impossible for a part that is only being cooled. The full series gives about 849 °C. By 20 seconds, a Fourier number of about 0.32, the two agree to within 2 K, and from 30 seconds on they are the same.

```figure
type: compare
title: DS-100's flange in the oil quench, one term against the full series
cols: Fourier number | Centre, one term | Centre, full series | Surface, one term | Surface, full series
caption: This is an illustration with oil at 60 °C and an assumed h = 1,000 W/m²·K (Bi ≈ 0.606). Below Fo ≈ 0.2 the single term misbehaves; above it, one term is enough. The centre falls to 300 °C after about 157 s.
- 5 s | 0.081 | 881 °C | 849 °C | 684 °C | 717 °C
- 10 s | 0.162 | 848 °C | 835 °C | 659 °C | 672 °C
- *20 s | 0.323 | 787 °C | 785 °C | 612 °C | 614 °C
- 60 s | 0.970 | 586 °C | 586 °C | 459 °C | 459 °C
- 120 s | 1.94 | 383 °C | 383 °C | 306 °C | 306 °C
```

The practical rule is to check the Fourier number before trusting a one-term answer. For early times, use the full series, which a spreadsheet handles with ten columns, or the semi-infinite solid of Chapter 5, which describes the first moments simply. The quench also shows the Biot number's effect on the temperature spread: at a Biot number of 0.606, the surface runs 130 to 170 K below the centre for most of the first minute, against the 16 to 31 K spread in the furnace. That spread is what drives the thermal stresses in a quench, and it is why thick sections are prone to quench cracking while thin ones are not.

## The failure case: the flange that lay flat

This is an illustration. For the first trial load, the furnace operator stood each DS-100 shaft upright on its flange, with the flange face flat on the furnace's solid steel hearth plate, because the shafts were stable that way. The hearth plate is 50 mm thick and starts cold with the load. The operator then applied the cycle calculated for the body, about 67 minutes to the body's centre.

Standing on a cold, solid plate, the flange's lower face receives almost no radiation from the furnace and loses part of what it gains to the hearth plate. To a first approximation, the flange becomes a plate heated from one face only, its upper face, with the lower face insulated. A 40 mm plate heated on one face behaves like an 80 mm plate heated on both, so L doubles to 0.04 m. Its Biot number doubles to about 0.182, and its time to reach 840 °C at the lower face becomes about **107 minutes** from the one-term solution, more than twice the 51.8 minutes when both faces see the furnace and well beyond the body's 67 minutes. The cold hearth plate makes it worse, because it absorbs heat from the flange until it too is hot.

```figure
type: bars
title: Time for the flange's slowest plane to reach 840 °C, by how the shaft is loaded
unit: min
max: 120
caption: This is an illustration with h = 150 W/m²·K on heated faces and the furnace at 850 °C. Laying the flange flat on a solid hearth makes it the slowest part of the shaft. The figure ignores the extra heat drawn by a cold hearth plate, so the real delay is longer.
- Flange on a grid, both faces heated, L = 20 mm | 51.8
- Body centre, for comparison | 67.1
- *Flange flat on a solid hearth, one face heated, L = 40 mm | 107.0
```

The error surfaced at hardness testing: the flange's lower face, tested after quenching, was softer than its upper face and softer than the body. A thermocouple placed in the next trial load, in a hole drilled to just above the flange's lower face, confirmed that it lagged the body by more than half an hour. The correction was to stand the shafts on a slotted grid that lets the furnace see the flange's lower face, or to lay them horizontally on a rack, and to treat the slowest point in the load, not the thickest section, as the one that sets the time. Chapter 9 makes that the rule for placing load thermocouples: the coldest point in the load is wherever heat has the furthest to travel or the least access, and it is not always the obvious place.

## Plates elsewhere in a shop

The same solution covers most flat work. A mould plate heated from one face by platens and cooled at the other is a plate with different conditions on its two faces, which needs the finite-difference model of Chapter 7, but its first estimate comes from treating it as the one-sided plate above. A tray of product in an oven is a plate whose characteristic length is the product's depth if the tray's base is insulating. A laminate in a press is a plate heated on both faces. In every case the questions are the same: where is the plane that heats last, how far is it from the heated faces, and what is the Biot number on that distance?

## How this applies to a small Australian business

Plates are the shapes where loading arrangement matters most, because covering one face doubles the characteristic length and, at small Biot numbers, roughly doubles the heating time, and at large Biot numbers roughly quadruples it. A shop that loads parts flat on solid shelves, trays or hearths should calculate the time on the full thickness, not the half thickness, or change the loading so both faces see the heat. The one-term solution needs only a goal-seek and an exponential, so it fits on a process sheet beside the part number, with the Biot number written next to it so that anyone changing the oven, the load or the part knows the time has to be checked again.

## Exercise: the flange at 30 minutes

Using the one-term solution for DS-100's flange on a grid in the 850 °C furnace (Bi ≈ 0.0909, ζ₁ ≈ 0.2970, C₁ ≈ 1.0147), find the centre and surface temperatures and the fraction of the possible heat absorbed after 30 minutes. Then find how much longer it takes to bring the centre to 845 °C instead of 840 °C.

**Worked answer.** After 30 minutes, Fo = 6.47 × 10⁻⁶ × 1,800 ÷ 0.02² ≈ 29.1. Then θ₀ ÷ θᵢ = 1.0147 × exp(−0.2970² × 29.1) ≈ 1.0147 × exp(−2.567) ≈ 0.0779, so the centre is at 850 − 0.0779 × 830 ≈ **785 °C**. The surface ratio is 0.0779 × cos 0.2970 ≈ 0.0745, so the surface is at about **788 °C**. The heat absorbed is 1 − 0.9854 × 0.0779 ≈ **0.923**, about 92 % of the total.

To reach 845 °C, the target ratio is 5 ÷ 830 ≈ 0.00602. Fo = ln(1.0147 ÷ 0.00602) ÷ 0.0882 ≈ 5.13 ÷ 0.0882 ≈ 58.1, which is about 3,590 s or **59.9 minutes**, about 8 minutes longer than the 51.8 minutes to reach 840 °C. Halving the remaining difference costs one more time constant's worth of time, ln 2 ÷ ζ₁² in Fourier number, whatever the starting point. A cycle should state its target as a temperature and a tolerance for exactly that reason.
