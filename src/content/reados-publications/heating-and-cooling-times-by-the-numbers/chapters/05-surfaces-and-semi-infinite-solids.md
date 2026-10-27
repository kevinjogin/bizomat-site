---
book: heating-and-cooling-times-by-the-numbers
chapterSlug: surfaces-and-semi-infinite-solids
order: 5
title: "Surfaces first: the semi-infinite solid"
description: "In the first moments only a thin skin changes temperature. The semi-infinite solid gives that skin's behaviour, applied to DS-100's transfer to the quench and to contact with a cold rack."
draft: false
---

When a part's surface conditions change suddenly, the centre does not know about it at first. For a while, only a thin skin near the surface changes temperature, and the rest of the part might as well be infinitely thick. A body that behaves this way is called a **semi-infinite solid**: it has one surface and extends without limit beneath it. The model sounds artificial, but it describes the first seconds of a quench, the transfer of a hot part through the air, a hot part resting on a cold support, a die face touching a hot billet, and any process where the time is short or the part is thick. Its solutions are simple, and they need no eigenvalues.

This chapter gives the semi-infinite solutions for a sudden surface temperature, a convective surface and the contact of two bodies, shows how deep a surface change reaches, and applies them to DS-100's transfer from the furnace to the oil. The running case's error was to estimate the surface chill during transfer with the lumped model, which reports the average, and to conclude that a longer transfer did not matter.

## A sudden change of surface temperature

Take a thick body at a uniform temperature Tᵢ whose surface is suddenly brought to, and held at, T_s. The temperature at depth x after time t is:

(T − T_s) ÷ (Tᵢ − T_s) = erf[x ÷ (2√(α t))]

The error function, erf, rises from 0 at zero to about 0.84 at 1, 0.995 at 2 and almost exactly 1 beyond; spreadsheets provide it as ERF. The single combination x ÷ (2√(α t)) carries all the dependence on depth and time, so a given temperature penetrates to a depth that grows with the square root of time. That is the same square-root law the Fourier number expressed in Chapter 1.

The heat flux into the surface is q = k (T_s − Tᵢ) ÷ √(π α t). It is infinite at the first instant and falls with the square root of time. For DS-100's steel with an 830 K step, it would be about 6,080 kW/m² after 1 s, about 1,920 kW/m² after 10 s and about 780 kW/m² after a minute. No real surface can follow an instant step, because no real surroundings can supply heat that fast; that is why the convective form below is usually the one to use.

### How deep a change reaches

Setting erf equal to 0.99 gives x ÷ (2√(α t)) ≈ 1.82, so a surface change has altered the temperature by more than 1 % only to a depth of about **3.6√(α t)**. That depth is the practical test for whether a part can be treated as semi-infinite: if it is well under the distance to the centre, or to the opposite face, the semi-infinite answer applies. For DS-100's steel, 3.6√(α t) is about 29 mm after 10 s, 41 mm after 20 s and about 71 mm after a minute. Against the body's 50 mm radius, the semi-infinite model is good for the first 20 seconds or so and approximate after that.

```figure
type: bars
title: Depth affected by a surface change in DS-100's steel, 3.6√(αt)
unit: mm
max: 80
caption: This is an illustration with α ≈ 6.47 × 10⁻⁶ m²/s. Compare each depth with the distance to the part's centre or far face: the 50 mm body radius, or 20 mm for the flange's half-thickness.
- 1 s | 9
- 10 s | 29
- *20 s | 41
- 45 s | 61
- 60 s | 71
```

## A convective surface

More often the surroundings change, not the surface itself: the part meets air, oil or furnace gases at T∞ with a coefficient h. The semi-infinite solution for a convective surface, at the surface itself (x = 0), simplifies to:

(T_s − Tᵢ) ÷ (T∞ − Tᵢ) = 1 − exp(β²) × erfc(β),   with β = h √(α t) ÷ k

where erfc = 1 − erf. The dimensionless group β is a Biot number built on the penetration distance √(α t) instead of on the part's size. When β is small, the surface changes only a little and slowly; when β is large, the surface approaches T∞ almost at once and the constant-surface solution above takes over.

```figure
type: formula
title: Surface temperature of a semi-infinite solid with a convective surface
formula: (T_s − Tᵢ) ÷ (T∞ − Tᵢ) = 1 − e^(β²) × erfc(β),   β = h × √(α × t) ÷ k
caption: This is an illustration for DS-100's surface during transfer from the furnace to the quench, starting at 850 °C in air at 20 °C, with an effective h of about 100 W/m²·K from radiation and convection.
- h | about 87 W/m²·K radiation (ε 0.8, surface 850 °C, room 20 °C) plus about 13 W/m²·K convection
- √(α t) at 20 s | √(6.47 × 10⁻⁶ × 20) ≈ 0.0114 m
- β at 20 s | 100 × 0.0114 ÷ 33 ≈ 0.0345
step: 1 − e^(0.00119) × erfc(0.0345) ≈ 1 − 1.00119 × 0.96113 ≈ 0.0377
step: Surface drop ≈ 0.0377 × 830 ≈ 31 K, to about 819 °C
```

## The running case: the transfer to the quench

This is an illustration. When DS-100's load comes out of the furnace, each shaft is carried on the crane to the oil tank, a few metres away. The heat treatment procedure allows a transfer time of 20 seconds from the furnace door opening to the shaft entering the oil, because the surface must still be above the temperature at which the steel begins to transform when the quench starts. The limit itself comes from the steel's transformation data and the heat treater's practice; the calculation's job is to say how much the surface cools in a given time.

During transfer, the hot surface radiates to the shop and loses heat by convection to the air. At a surface of 850 °C and surroundings at 20 °C, oxidised steel's radiation coefficient is about 87 W/m²·K; adding convection from a part moving through still air gives an effective coefficient of about 100 W/m²·K at the start. The semi-infinite solution then gives the surface drop for different transfer times.

```figure
type: compare
title: DS-100's surface and average temperature during transfer from an 850 °C furnace
cols: Surface drop, semi-infinite | Surface, finite-difference cylinder | Average drop, lumped
caption: This is an illustration with an effective h of about 100 W/m²·K. The finite-difference column uses radiation that weakens as the surface cools, plus 15 W/m²·K convection (Chapter 7). The lumped model reports the average, which hides the surface chill.
- 10 s | 22 K | 826 °C | 6.5 K
- *20 s | 31 K | 816 °C | 12.9 K
- 45 s | 46 K | 799 °C | 28.8 K
- 60 s | 53 K | 790 °C | 38.1 K
```

At the permitted 20 seconds, the surface has fallen about 31 K by the semi-infinite estimate, to about 819 °C, and about 34 K by the fuller finite-difference model of Chapter 7. At 45 seconds it has fallen about 46 to 52 K. The centre, meanwhile, has barely moved: at 45 seconds it is still within about 5 K of 850 °C. The chill is a surface event.

## The failure case: an average that hid the surface

This is an illustration. On busy days the crane was shared with the next bay, and transfers were timed at up to 45 seconds. Asked whether that mattered, an engineer used the lumped model: with a time constant of 7,850 × 650 × 0.025 ÷ 100 ≈ 1,280 s, a 45-second transfer lowers the shaft's temperature by 830 × (1 − e^(−45/1,280)) ≈ 29 K. That seemed modest, and the engineer concluded that the longer transfers were harmless.

The lumped model's answer was the change in the **average** temperature, and for a Biot number in air of about 0.15 on the radius it is a fair average. But the quench's effect on the surface depends on the surface temperature, which had fallen 46 to 52 K, nearly twice the average, and further at the flange rim, where heat leaves through two faces at once (Chapter 6 doubles the effect at edges). The error showed up as a scatter of surface hardness on shafts from busy days, and the correlation with transfer time was found by comparing the crane log with the hardness results. The correction had two parts: the crane was reserved for the quench during transfers, and the surface drop, not the average drop, was written into the procedure's justification for the 20-second limit. The general lesson is that a lumped average tells you about energy, while surface events, chills, scaling, decarburisation and the start of a quench, need the semi-infinite solution or the full model.

## The quench's first seconds

The same convective solution describes the first seconds in the oil, before the centre responds. This is an illustration. With the assumed 1,000 W/m²·K and oil at 60 °C, β after one second is 1,000 × √(6.47 × 10⁻⁶ × 1) ÷ 33 ≈ 0.077, and the surface has fallen about 0.081 of the 790 K difference, to about 786 °C. After two seconds it is at about 762 °C and after five seconds about 717 °C, the same figure the full plate series gave for the flange in Chapter 3, because at five seconds the cooling has reached only about 20 mm deep. If the oil's coefficient during the vapour-film and boiling stages were nearer 3,000 W/m²·K, the surface would be at about 680 °C after one second and 540 °C after five.

Two practical points follow. The first seconds decide the surface's cooling rate through the temperatures where the steel transforms, so the quenchant's behaviour in those seconds matters more than its average over the quench; that is what cooling-curve tests measure, as Chapter 8 explains. And because the affected depth is only 9 to 20 mm in those seconds, a thick shaft and a thin flange start their quench identically at the surface: section size only begins to tell after the cooling has penetrated far enough to feel the centre or the far face.

## Two bodies in contact

When two thick bodies at different temperatures are pressed together, the contact face jumps at once to a temperature between them and stays there while both behave as semi-infinite solids:

T_c = (e₁ T₁ + e₂ T₂) ÷ (e₁ + e₂),   with e = √(k ρ c)

The quantity e is the **thermal effusivity**, which measures how strongly a material pulls the contact face towards its own temperature. Two bodies of the same material meet at the mean of their temperatures. For DS-100's steel, e ≈ √(33 × 7,850 × 650) ≈ 12,980 W·s^½/m²·K.

This is an illustration. If a shaft at 850 °C is laid briefly on a cold steel rack at 20 °C, the contact line drops at once to about 435 °C, the mean of the two, and a local chill spreads from it. Even a few seconds of contact can leave a soft spot on a hardened surface, or a local distortion. If the rack is faced with a material whose effusivity is one-tenth of steel's, as many insulating refractories are, the contact temperature becomes (850 + 0.1 × 20) ÷ 1.1 ≈ 775 °C, a far smaller chill. This is why hot-part handling tools are often faced with insulating material, and why parts should not rest on cold steel between furnace and quench.

The same formula explains why a steel surface at 60 °C feels much hotter to the touch than timber at 60 °C: steel's effusivity is many times that of skin, so the contact face sits near the steel's temperature, while timber's is close to skin's, so the contact sits near the middle. Hot surfaces in a heat treatment shop need guarding for that reason, whatever they look like.

## The first minutes in the furnace

The semi-infinite solution also describes the start of heating, before the centre responds. In the furnace, with h = 150 W/m²·K, β after one minute is 150 × √(6.47 × 10⁻⁶ × 60) ÷ 33 ≈ 0.0897. The surface has then risen by 1 − e^(β²) erfc(β), about 0.093 of the 830 K difference, roughly 77 K. The centre has not yet moved. This early surface rise is where oxidation and decarburisation begin, and the semi-infinite model is the right one for estimating how quickly the surface reaches temperatures where those reactions speed up. [Losing carbon: decarburisation during reheating](/reados/publications/diffusion-by-the-numbers/decarburisation/) takes the chemistry from there; the heat flow it rides on is this chapter's.

## How this applies to a small Australian business

Most surface events in a heat-treatment, forging, casting or moulding shop happen within seconds or minutes, and the semi-infinite solid is the model for them. A spreadsheet with ERF, ERFC and EXP gives the surface temperature for any transfer time, contact or short exposure, and the 3.6√(α t) depth says whether the answer can be trusted for the part's size. The most useful habit is to separate surface questions from average questions: a lumped average is right for energy and for slow processes, but it understates every chill, flash and contact by a large factor, and the surface is where most quality problems begin.

## Exercise: a slower crane

A new crane will take 30 seconds to move each shaft. Using the semi-infinite convective solution with h = 100 W/m²·K, find DS-100's surface drop at the end of transfer. Check whether the semi-infinite assumption is reasonable for the body, and say what the drop would be at the flange's rim if the rim behaves roughly like an edge cooled from two faces.

**Worked answer.** √(α t) = √(6.47 × 10⁻⁶ × 30) ≈ 0.0139 m, so β = 100 × 0.0139 ÷ 33 ≈ 0.0422. Then 1 − e^(0.00178) × erfc(0.0422) ≈ 1 − 1.00178 × 0.95240 ≈ 0.0459, a surface drop of about 0.0459 × 830 ≈ **38 K**, to about 812 °C.

The affected depth is 3.6 × 0.0139 ≈ 50 mm, equal to the body's radius, so the semi-infinite answer is at the edge of its range; the finite-difference model would give a slightly larger drop, because the curved surface loses heat from a shrinking volume. At the flange's rim, where heat leaves through the face and the edge, Chapter 6 shows that the temperature-change fractions of the two faces combine; as a first estimate the rim's drop is roughly 1 − (1 − 0.0459)² ≈ 0.090 of the difference, about **74 K**. On a 30-second transfer the rim, not the body, sets the limit.
