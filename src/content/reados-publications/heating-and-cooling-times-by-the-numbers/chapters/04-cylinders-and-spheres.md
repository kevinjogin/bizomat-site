---
book: heating-and-cooling-times-by-the-numbers
chapterSlug: cylinders-and-spheres
order: 4
title: "Long cylinders and spheres: heating the shaft body"
description: "One-term solutions for cylinders and spheres give the DS-100 body's heating and quench, show how shape changes time, and catch a radius-for-diameter slip that doubled the cycle."
draft: false
---

Shafts, bars, rolls, pins, tubes filled with product and cans on their sides are all cylinders, and balls, pellets, fruit and many castings behave roughly like spheres. Heat enters a cylinder over its curved surface and converges on the axis; it enters a sphere from every direction and converges on a point. Because the heat converges, the area it flows through shrinks as it goes inward, and these shapes heat faster than a plate of the same thickness. How much faster is one of the most useful facts in this subject.

This chapter gives the one-term solutions for the long cylinder and the sphere, applies the cylinder to DS-100's body in the furnace and the quench, compares plate, cylinder and sphere of the same thickness, and describes a slip the running case made when a planner used the diameter where the radius belonged and doubled the furnace cycle.

## The long cylinder

A long cylinder of radius r₀, starting at Tᵢ and exposed to surroundings at T∞ with a coefficient h, has the one-term solution:

θ ÷ θᵢ = C₁ × exp(−ζ₁² × Fo) × J₀(ζ₁ × r ÷ r₀)

Here Fo = α × t ÷ r₀², with the radius as the characteristic length, and Bi = h × r₀ ÷ k. J₀ and J₁ are Bessel functions of the first kind, of orders zero and one: they play the part that the cosine and sine play for the plate. J₀ starts at 1 on the axis and falls towards the surface. The eigenvalue ζ₁ is the first root of ζ × J₁(ζ) ÷ J₀(ζ) = Bi, between 0 and about 2.405, and C₁ = (2 ÷ ζ₁) × J₁(ζ₁) ÷ [J₀(ζ₁)² + J₁(ζ₁)²]. The fraction of the possible heat absorbed is Q ÷ Q_max = 1 − (2 ÷ ζ₁) × J₁(ζ₁) × θ₀ ÷ θᵢ.

Bessel functions sound forbidding but are built into spreadsheets: in Excel and similar programs, BESSELJ(x, 0) and BESSELJ(x, 1) return them. The eigenvalue is then found with goal seek exactly as for the plate. For small Biot numbers a good starting guess is ζ₁ ≈ √(2 × Bi); for DS-100's body that gives 0.674 against the true 0.6555.

```figure
type: formula
title: The one-term solution for a long cylinder, applied to DS-100's body
formula: θ ÷ θᵢ = C₁ × e^(−ζ₁² × Fo) × J₀(ζ₁ × r ÷ r₀),   ζ₁ × J₁(ζ₁) ÷ J₀(ζ₁) = Bi,   C₁ = (2 ÷ ζ₁) × J₁ ÷ (J₀² + J₁²)
caption: This is an illustration for the 100 mm body in the 850 °C furnace with h = 150 W/m²·K and the book's assumed properties. The centre reaches 840 °C about 67 minutes after loading.
- Bi | 150 × 0.05 ÷ 33 ≈ 0.227
- ζ₁ | 0.6555, with J₀(ζ₁) ≈ 0.8954 and J₁(ζ₁) ≈ 0.3105
- C₁ | ≈ 1.0546
- Target θ₀ ÷ θᵢ | 10 ÷ 830 ≈ 0.0120
step: Fo = ln(1.0546 ÷ 0.0120) ÷ 0.6555² ≈ 10.42
step: t = 10.42 × 0.05² ÷ 6.47 × 10⁻⁶ ≈ 4,030 s ≈ 67.1 min
```

## DS-100's body in the furnace

Stepping the solution through time gives the body's centre, mid-radius and surface temperatures. As for the flange, the small Biot number keeps them close: the surface leads the centre by about 66 K after 5 minutes, 25 K after 20 minutes and 1 K at the end.

```figure
type: line
title: DS-100's body in the 850 °C furnace
x: Time in the furnace, min
y: Temperature, °C
legend: Surface | Mid-radius | Centre
ymin: 0
ymax: 900
caption: This is an illustration from the one-term cylinder solution, Bi ≈ 0.227. At 5 minutes the Fourier number is already about 0.78, so one term is accurate throughout. The body has absorbed about 74 % of its heat after 20 minutes and 98 % after 60.
- 0 | 20 | 20 | 20
- 5 | 289 | 240 | 223
- 10 | 448 | 413 | 401
- 20 | 644 | 626 | 619
- 30 | 744 | 735 | 732
- 40 | 796 | 791 | 789
- 50 | 822 | 820 | 819
- 60 | 836 | 834 | 834
- 67.1 | 841 | 840 | 840
```

Two things in the figure are worth noticing. First, the mid-radius temperature is much closer to the centre than to the surface, because J₀ falls slowly near the axis: at half the radius, J₀(ζ₁ ÷ 2) ≈ 0.973. Most of the temperature drop is in the outer part of the section. Second, the surface reaches 840 °C at about 65.4 minutes, only 1.7 minutes before the centre, so in this furnace a surface measurement would be a reasonable proxy for the centre near the end of the cycle. That is a consequence of the small Biot number, and it does not hold in the quench.

## DS-100's body in the quench

This is an illustration. In oil at 60 °C with the assumed 1,000 W/m²·K, the body's Biot number becomes about 1.52, and the solution changes character: ζ₁ ≈ 1.4620, C₁ ≈ 1.2826 and J₀(ζ₁) ≈ 0.5329, so the surface's temperature difference from the oil is only about half the centre's.

```figure
type: compare
title: DS-100's body in the oil quench: centre, mid-radius and surface
cols: Fourier number | Centre | Mid-radius | Surface
caption: This is an illustration with oil at 60 °C and an assumed h = 1,000 W/m²·K, Bi ≈ 1.52. The 60 s row is below Fo ≈ 0.2 and is approximate; the full series or the model of Chapter 7 should be used there. The centre reaches 300 °C at about 260 s.
- 60 s | 0.155 | ≈ 787 °C | ≈ 693 °C | ≈ 448 °C
- 120 s | 0.310 | 582 °C | 514 °C | 338 °C
- 180 s | 0.466 | 435 °C | 386 °C | 260 °C
- *260 s | 0.673 | 301 °C | 270 °C | 188 °C
- 400 s | 1.04 | 171 °C | 157 °C | 119 °C
```

The surface-to-centre spread is now more than 240 K at two minutes and still more than 110 K at four. That spread matters twice. It is the source of quench stresses and distortion. And it means a surface reading says little about the centre: a contact thermometer reading 300 °C on the surface at about three minutes would be measuring a shaft whose centre was still near 440 °C. Chapter 9 returns to measuring.

## Spheres

The sphere's one-term solution has the same form, with a different spatial function and eigenvalue condition:

θ ÷ θᵢ = C₁ × exp(−ζ₁² × Fo) × sin(ζ₁ r ÷ r₀) ÷ (ζ₁ r ÷ r₀),   with 1 − ζ₁ cot ζ₁ = Bi

and C₁ = 4 (sin ζ₁ − ζ₁ cos ζ₁) ÷ (2ζ₁ − sin 2ζ₁). The heat absorbed is Q ÷ Q_max = 1 − 3 (θ₀ ÷ θᵢ) × (sin ζ₁ − ζ₁ cos ζ₁) ÷ ζ₁³. For small Biot numbers, ζ₁ ≈ √(3 × Bi) is a good start. Spheres are less common in metalworking than in food, minerals and plastics processing, but the sphere is useful as a bound for compact, chunky shapes such as cubes, short cylinders and knobs, which heat at rates between a long cylinder and a sphere of the same thickness.

## Shape and time

Because heat converges in a cylinder and a sphere, a given thickness heats faster as the shape becomes more compact. The comparison is clearest for a plate 100 mm thick, a cylinder 100 mm in diameter and a sphere 100 mm in diameter, all with the same 50 mm characteristic length, h = 150 W/m²·K and the furnace at 850 °C.

```figure
type: bars
title: Time for the centre to reach 840 °C: plate, cylinder and sphere 100 mm thick
unit: min
max: 150
caption: This is an illustration with Bi ≈ 0.227 on the 50 mm half-thickness or radius in each case. At small Biot numbers the times stand roughly in the ratio 3 : 1.5 : 1, the ratio of the shapes' volume-to-surface ratios.
- Plate 100 mm thick, heated on both faces | 135.9
- *Long cylinder 100 mm diameter (DS-100's body) | 67.1
- Sphere 100 mm diameter | 44.3
```

The 3 : 1.5 : 1 ratio comes from the lumped view of Chapter 2: the volume-to-surface ratio is r₀ for a plate's half-thickness, r₀ ÷ 2 for a cylinder and r₀ ÷ 3 for a sphere, and at small Biot numbers the heating time is roughly proportional to it. A practical consequence follows for parts whose shape lies between the ideals. A square bar 100 mm across heats a little slower than a 100 mm round, and much faster than a 100 mm plate; a short, thick cylinder heats somewhere between a long cylinder and a sphere. Chapter 6 shows how to calculate such shapes exactly by multiplying one-dimensional solutions, but the shape ranking alone often settles which part in a mixed load is the slowest.

## The failure case: the radius and the diameter

This is an illustration. Before the furnace trials, a planner estimated the body's heating time from a printed set of cylinder charts and a calculator. The charts are drawn with the radius as the characteristic length, but the planner entered the body's 100 mm diameter. That doubled the Biot number to about 0.455 and cut the Fourier number per hour to a quarter. The result was a heating time of about **143 minutes**, more than twice the correct 67. The planner, reasonably, added a margin and proposed a 2.5-hour hold for every DS-100 load.

The error would have cost about 76 minutes of furnace time on every load, about two and a half hours a shift with two loads a shift. It was caught at review by a simple cross-check. The lumped estimate of Chapter 2, which needs no chart and no characteristic-length decision beyond volume over area, gave about 63 minutes. A one-term time should be a little longer than the lumped time when the Biot number is modest, not more than twice as long. The disagreement sent the reviewer back to the chart's axis labels, where "r₀" was written in small print.

```figure
type: checklist
title: Cross-checks before trusting a heating-time calculation
caption: This is an illustration of the shop's review checklist after the radius slip. Each line is quick, and together they catch most input errors.
- x Characteristic length matches the model | radius for cylinders and spheres, half-thickness for plates
- x Biot number written down with its length | 0.227 on the radius for DS-100's body
- x Fourier number above about 0.2 at the time of interest | 10.4 at the end of heating
- x Lumped time calculated as a floor | 62.6 min, against 67.1 min one-term
- x Units of α in m²/s and time in seconds | 6.47 × 10⁻⁶ m²/s
- *? Result compared with a measurement | load thermocouple, Chapter 9
```

The general lesson is that every one-term calculation should be paired with a lumped estimate. The lumped time is a floor: the true centre time is always longer, and at Biot numbers below about 0.5 not much longer. A one-term result far above the lumped floor means either a large Biot number, which can be checked, or an input error.

## How sure is 67 minutes?

Every input to the cylinder calculation is uncertain, and it is worth knowing which uncertainties matter. The book uses constant mean properties, but the published data for 4140 show the conductivity falling from about 42.6 W/m·K at 100 °C to about 33 W/m·K at 600 °C, and the specific heat rising with temperature, with an extra absorption of heat where the steel transforms on heating. The surface coefficient, too, is an average of a radiation coefficient that changes through the cycle. Running the same one-term calculation with each input moved over a plausible range, one at a time, shows where the time is sensitive.

```figure
type: compare
title: DS-100's body: time for the centre to reach 840 °C as each input changes
cols: Low value | Time | High value | Time
caption: This is an illustration from the one-term cylinder solution, with the other inputs held at the book's values (k 33 W/m·K, c 650 J/kg·K, h 150 W/m²·K). Because the Biot number is small, the conductivity barely matters; the stored heat and the surface coefficient matter almost in proportion.
- Conductivity k | 28 W/m·K | 67.9 min | 42.6 W/m·K | 66.0 min
- Specific heat c | 550 J/kg·K | 56.7 min | 700 J/kg·K | 72.2 min
- *Surface coefficient h | 120 W/m²·K | 82.7 min | 180 W/m²·K | 56.6 min
```

The pattern follows from the Biot number. At 0.227, the surface controls, so the time is almost proportional to the heat the part must store, ρ × c, and inversely proportional to h, while the conductivity hardly enters. Cutting the conductivity by about 15 % moves the time by about 1 %; moving h by 20 % either way moves the time by 16 to 23 %, and moving the specific heat by about 8 % either way moves the time by about the same 8 %. Those three numbers are worth carrying into any discussion of whether a cycle can be shortened. The effort of refining a calculation should therefore go into the surface coefficient and the specific heat, not into a better conductivity value. In a quench, where the Biot number is above 1, the balance shifts: the conductivity starts to matter and the surface coefficient matters less, which is why quench calculations need a good conductivity at the temperatures the steel passes through.

### How long is long?

The solutions in this chapter assume an infinitely long cylinder, with heat entering only through the curved surface. DS-100's body is 500 mm long and 100 mm in diameter. Its far end is joined to the flange and its free end is exposed, so heat also enters through the end face. The end's influence reaches inward a distance of the order of the diffusion length or the radius, whichever is less, so a body five diameters long behaves as a long cylinder over most of its length, with an end zone that heats faster near the free end. Chapter 6 calculates that zone exactly; for setting the cycle, the long-cylinder centre time is the right figure, because the middle of the body is the slowest part of it.

## Cylinders that are not solid

A tube heated from outside with its bore open, or a hollow roll, is not a solid cylinder, and the solutions above do not apply directly. If the bore is closed or the inside is insulated, a thin-walled tube behaves almost like a plate whose thickness is the wall, heated on one face. If both surfaces are exposed, the wall heats from both sides and the characteristic length is about half the wall thickness. For thick-walled tubes, where the curvature matters, the finite-difference model of Chapter 7 handles the geometry without new mathematics: it only needs the inner radius as a second boundary.

## How this applies to a small Australian business

Round bar is the most common heat-treated shape, and the cylinder solution covers it. The calculation needs two spreadsheet functions, BESSELJ and goal seek, and once set up it gives centre, surface and absorbed heat for any diameter and any surface coefficient. Writing the Biot number and the lumped floor beside every calculated time catches most mistakes, including the radius-for-diameter slip, which is the most common single error in heating-time work and always errs on the side of wasted furnace time. Where a business processes compact parts, the sphere gives a quick lower bound, and the ranking plate, cylinder, sphere, in the ratio of about 3 to 1.5 to 1, tells which part in a mixed load is the slowest.

## Exercise: a 75 mm shaft

The customer asks about a smaller version of DS-100 with a 75 mm body. Using h = 150 W/m²·K, the furnace at 850 °C and the book's properties, find the body's Biot number, ζ₁ and C₁, and the time for its centre to reach 840 °C. Check the answer against the lumped floor.

**Worked answer.** With r₀ = 0.0375 m, Bi = 150 × 0.0375 ÷ 33 ≈ **0.170**. Solving ζ J₁(ζ) ÷ J₀(ζ) = 0.170 gives ζ₁ ≈ **0.5717**, and C₁ ≈ **1.0414**. Then Fo = ln(1.0414 ÷ 0.01205) ÷ 0.5717² ≈ 4.46 ÷ 0.3268 ≈ 13.6, and t = 13.6 × 0.0375² ÷ 6.47 × 10⁻⁶ ≈ 2,970 s, about **49.5 minutes**.

The lumped floor is ρ × c × (r₀ ÷ 2) ÷ h × ln 83 = 7,850 × 650 × 0.01875 ÷ 150 × 4.42 ≈ 2,820 s, about **47.0 minutes**. The one-term time is about 5 % above the floor, consistent with a Biot number of 0.17. The 75 mm body takes about three-quarters of the 100 mm body's time, close to the ratio of the diameters, as Chapter 1's scaling showed for small Biot numbers.
