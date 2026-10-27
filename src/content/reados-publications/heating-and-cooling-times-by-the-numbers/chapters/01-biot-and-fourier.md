---
book: heating-and-cooling-times-by-the-numbers
chapterSlug: biot-and-fourier
order: 1
title: "Biot and Fourier: the two numbers behind every heating time"
description: "Two dimensionless numbers decide how long a part takes to heat through and which model to use. They are applied to the DS-100 shaft, with a rule-of-thumb scaling error they expose."
draft: false
---

When a cold part goes into a hot furnace, heat has to make two journeys. First it must cross the surface, from the furnace gases and walls into the steel. Then it must travel inward through the steel to the centre. Each journey has a resistance, and the time a part takes to heat through depends on which resistance is larger and on how much heat the part has to store along the way. Two dimensionless numbers capture all of this: the **Biot number**, which compares the two resistances, and the **Fourier number**, which measures elapsed time against the part's size. Every chapter of this book uses them, and they are the first thing to calculate for any heating or cooling problem.

This chapter defines both numbers, calculates them for the DS-100 shaft, and shows how they decide which model a problem needs. It ends with a scaling error the running case nearly made: stretching a heating time measured on one size of part to a much larger part, in proportion to diameter on one attempt and to diameter squared on another, and getting both wrong.

## The running case begins

This is an illustration. The heat-treatment shop has hardened smaller shafts for years with a simple written rule: load the furnace, wait until the controller shows 850 °C again, then hold for one hour before quenching. DS-100 is new to the shop. Its body is 100 mm in diameter and 500 mm long; its flange is 220 mm in diameter and 40 mm thick. The customer's drawing calls for through-hardening, which needs the whole section, centre included, to reach the hardening temperature and be held there long enough for the steel's structure to change. The metallurgical hold is set by the heat treatment procedure for the steel; this book is about the part before that hold can begin: how long it takes the centre to get there. The shop's questions are simple. Is its usual cycle long enough for DS-100's centre? Is it far too long for the thinner flange? And how would the answer change for the larger shafts the customer has mentioned for next year?

## Two resistances in series

Think of the heat flowing into one square metre of DS-100's surface. At the surface, heat arrives from the furnace by radiation and convection, and the surface coefficient h, in W/m²·K, says how much heat crosses per kelvin of difference. The resistance of that step, per square metre, is 1/h. Inside, heat must be conducted through the steel to the centre, a distance of the order of the radius r₀, and the resistance of that step is about r₀/k, where k is the steel's thermal conductivity.

For DS-100's body in the furnace, with an effective surface coefficient of about 150 W/m²·K (Chapter 8 shows where that figure comes from) and the assumed mean conductivity of 33 W/m·K, the two resistances per square metre are:

- surface: 1/h = 1/150 ≈ 0.00667 m²·K/W
- inside: r₀/k = 0.05/33 ≈ 0.00152 m²·K/W

The surface resistance is more than four times the inside resistance. Heat struggles to get into DS-100 far more than it struggles to get through it. That single comparison already says a lot: the steel's temperature will not differ much from surface to centre at any moment, and the heating time will depend mainly on the furnace, not on the steel's conductivity.

## The Biot number

The ratio of those two resistances is the Biot number:

Bi = (inside resistance) ÷ (surface resistance) = h × L_c ÷ k

where L_c is a characteristic length. For DS-100's body, with L_c taken as the radius, Bi = 150 × 0.05 ÷ 33 ≈ **0.227**. For the flange, which is a plate heated from both faces, the natural length is the half-thickness, 0.02 m, and Bi ≈ 150 × 0.02 ÷ 33 ≈ **0.091**.

```figure
type: formula
title: The Biot and Fourier numbers
formula: Bi = h × L_c ÷ k        Fo = α × t ÷ L_c²,   with α = k ÷ (ρ × c)
caption: This is an illustration for DS-100's body in the furnace, with the book's assumed mean properties for 4140 steel during the hardening heat.
- h | Surface coefficient, W/m²·K (about 150 in the furnace)
- L_c | Characteristic length, m (the radius, 0.05 m, for the body)
- k | Thermal conductivity, W/m·K (33 assumed)
- α | Thermal diffusivity, m²/s (about 6.47 × 10⁻⁶)
- t | Elapsed time, s
step: Bi = 150 × 0.05 ÷ 33 ≈ 0.227
step: α = 33 ÷ (7,850 × 650) ≈ 6.47 × 10⁻⁶ m²/s
step: After one hour, Fo = 6.47 × 10⁻⁶ × 3,600 ÷ 0.05² ≈ 9.31
```

The characteristic length needs care, because different models define it differently. The one-term solutions of Chapters 3 and 4 use the half-thickness of a plate and the outer radius of a cylinder or sphere. The lumped model of Chapter 2 uses the volume divided by the surface area, which is the half-thickness for a plate, half the radius for a long cylinder and a third of the radius for a sphere. The numbers differ by those factors, so a Biot number should always be quoted with the length it used. A common screening rule is that the lumped model is accurate enough when the Biot number based on volume over area is below about 0.1. For DS-100's body, that Biot number is 150 × 0.025 ÷ 33 ≈ 0.114, just over the line; for the flange it is 0.091, just under it.

### What the Biot number says

A small Biot number means the surface controls: the part's inside stays nearly uniform while heat trickles in, and the heating time depends on h, the part's heat capacity and its volume-to-surface ratio, not on k. A large Biot number means the inside controls: the surface jumps quickly to near the surroundings' temperature, and the heating time depends on how fast heat diffuses inward, which depends on α and on the square of the size. Between the two, both matter, and the one-term solutions of Chapters 3 and 4 handle the whole range.

## The Fourier number

The Fourier number, Fo = α × t ÷ L_c², is time made dimensionless. The thermal diffusivity α = k ÷ (ρ × c) combines how well a material conducts heat with how much heat it must store per degree, and it has units of m²/s. With the book's assumed properties, DS-100's steel has α ≈ 6.47 × 10⁻⁶ m²/s, or 6.47 mm²/s. One hour in the furnace is a Fourier number of about 9.31 for the body's 50 mm radius.

The square in the denominator is the important part. For a fixed Biot number, the Fourier number needed to reach a given state is fixed, so the time needed rises with the square of the size: double the radius and, other things equal, the time quadruples. But other things are rarely equal, because doubling the radius also doubles the Biot number. That is exactly where the scaling error in this chapter came from.

A useful companion to the Fourier number is the **diffusion length**, √(α × t), which gives the distance over which a temperature change has spread in time t. For DS-100's steel it is about 62 mm after 10 minutes and about 153 mm after an hour. Comparing that length with the part's size shows at a glance whether the centre has felt the surface change yet. After 10 minutes, the 62 mm diffusion length is already longer than the body's 50 mm radius, so the centre is warming; in a much larger part, the centre would not yet have noticed.

## How long DS-100's body takes

Chapter 4 develops the cylinder solution in full. Its result, used here, is that DS-100's body, entering at 20 °C a furnace at 850 °C with an effective h of 150 W/m²·K, reaches 840 °C at its centre, within 10 K of the furnace, after about **67 minutes**, a Fourier number of about 10.4. The flange, a 40 mm plate heated from both faces, gets there in about **52 minutes**. A lumped estimate, which ignores the temperature difference inside the steel, gives about 63 minutes for the body, close to the one-term figure because the Biot number is small.

The shop's rule, a one-hour hold starting when the controller shows 850 °C again, would therefore be enough for DS-100's centre only if the furnace recovered almost at once. The real picture depends on the furnace, which Chapter 8 examines: a loaded furnace shades the parts from each other and from the walls, and its effective coefficient is lower. For now, the point is that the time can be calculated, and that the calculation needs the Biot number before anything else.

### Where the time goes

It is worth seeing how strongly the surface coefficient controls DS-100's heating time, because it shows what to improve. With h of 50 W/m²·K, typical of a gentle convection oven, the body would take about 192 minutes to reach 840 °C at its centre. At 150 W/m²·K, the furnace's effective value, it takes about 67 minutes. At 500 W/m²·K it would take about 23 minutes, and at 5,000 W/m²·K, the kind of coefficient found in a fluidised bed or a salt bath, about 7 minutes. Even with an infinitely strong surface, the steel's own conductivity limits the body to about 5.5 minutes.

```figure
type: bars
title: DS-100 body: time for the centre to reach 840 °C, by surface coefficient
unit: min
max: 200
caption: This is an illustration from the one-term cylinder solution of Chapter 4, with the furnace at 850 °C and the body starting at 20 °C. Below a Biot number of about 1, the surface sets the time; above it, the steel does.
- h = 50 W/m²·K, Bi 0.076 | 192.3
- *h = 150 W/m²·K, Bi 0.227 | 67.1
- h = 500 W/m²·K, Bi 0.758 | 23.3
- h = 5,000 W/m²·K, Bi 7.58 | 7.0
- Surface held at 850 °C, Bi → ∞ | 5.5
```

The figure says something practical. In an ordinary electric box furnace, DS-100's heating time is set almost entirely at the surface. Better conductivity in the steel would barely change it; a different steel with a lower conductivity would barely lengthen it. What changes it is the furnace: its temperature, how well its walls see the parts, how the load is arranged, and whether a fan moves the atmosphere. That is the opposite of the case in a quench, where Chapter 8 will show the Biot number rises above 1 and the steel's own conductivity starts to govern how fast the centre cools.

## The scaling error

This is an illustration. Before anyone calculated DS-100, the shop's planner tried to estimate its heating time from experience. The shop had measured, with a thermocouple in the centre of a 50 mm bar, that the bar reached 840 °C in about 32 minutes in the same furnace. The planner scaled that to DS-100's 100 mm body in proportion to diameter and got about 65 minutes, close to the 67 minutes calculated. Encouraged, the planner scaled to the 200 mm and 400 mm shafts the customer had mentioned, giving 130 and 259 minutes.

A colleague objected that heating times go with the square of the size, citing the Fourier number, and scaled the same 32 minutes to about 130, 519 and 2,074 minutes for the 100, 200 and 400 mm bars. Both estimates could not be right, and in fact neither was.

```figure
type: compare
title: Centre heating time to 840 °C, scaled from a 50 mm bar and calculated
cols: Scaled with diameter | Scaled with diameter squared | Calculated
caption: This is an illustration with h = 150 W/m²·K and the furnace at 850 °C. The 50 mm bar takes about 32.4 minutes. Linear scaling falls further short as the Biot number rises; square scaling is wildly long because the surface still controls.
- 100 mm, Bi 0.227 | 65 min | 130 min | 67 min
- 200 mm, Bi 0.455 | 130 min | 519 min | 143 min
- *400 mm, Bi 0.909 | 259 min | 2,074 min | 324 min
```

The calculation explains both errors. While the Biot number is small, the surface controls, and the heating time goes roughly with the volume-to-surface ratio, which for a long cylinder is proportional to the diameter. So linear scaling works well for small parts. As the part grows, its Biot number grows with it, the inside resistance starts to matter, and the time rises faster than in proportion. For the 400 mm shaft, linear scaling falls about 65 minutes short, which on a through-hardening job could mean a soft core. Square scaling would only be right if the inside controlled completely, which in this furnace it never does; following it would have quoted the customer a cycle more than six times longer than needed.

The error was detected because the two estimates disagreed by a factor of four for the 200 mm shaft, and a disagreement that large means the rule behind at least one of them does not apply. The correction was to calculate the Biot number for each size first, then use the solution that suits it. The lesson generalises: experience measured on one size transfers to other sizes only when the Biot number stays about the same. When it changes, the ratio of times changes too, and the only safe way across is the calculation.

## Which model to use

The Biot number, together with the time of interest, points to the model. The rest of the book follows this map.

```figure
type: decision
title: Choosing a heating-time model from the Biot and Fourier numbers
question: What do the Biot number and the time of interest say?
caption: The thresholds are working guides, not sharp limits. When in doubt, use the more detailed model, or check with the finite-difference model of Chapter 7.
- Bi (volume ÷ area) below about 0.1 | thin plates, small bars, thermocouple beads | the lumped model, Chapter 2
- *Bi above about 0.1, Fo above about 0.2 | DS-100's body, flange and most furnace work | the one-term solutions, Chapters 3 and 4
- Short times, Fo below about 0.2, or a thick part | surface heating, contacts, the transfer before a quench | the semi-infinite solid, Chapter 5
- Ends, corners, junctions | shaft ends, flange edges, blocks | product solutions, Chapter 6
- Changing properties, radiation, odd shapes or schedules | real furnace cycles, quenches | finite differences, Chapter 7
```

The Fourier number's role in the map is to say whether the early-time behaviour matters. Early in a heating cycle, at small Fourier numbers, the centre has not yet felt the change and only a layer near the surface is heating; the semi-infinite solid describes that layer simply. Later, once the whole section is involved, a single term of the series solution is enough. The crossover is usually taken at a Fourier number of about 0.2.

## How this applies to a small Australian business

Most small heat-treatment, moulding, curing and food-processing businesses run on times that someone set years ago for a different product. Calculating the Biot number for each part family is a short exercise that shows which times are about right, which are generous and which may be short. Where the Biot number is small, as it is for most parts in an air oven or an electric box furnace, the heating time scales close to the volume-to-surface ratio, and a calculation of that ratio for each part already separates the quick parts from the slow ones. Where the Biot number is large, as in quenching, salt baths and some moulding processes, the time grows with the square of the section, and thick sections need far more time than thin ones. Either way, the calculation turns an inherited rule into a number the business can check with a thermocouple.

## Exercise: the test coupon

The shop quenches a 25 mm diameter test bar, a coupon, with each load of DS-100 shafts so that it can be hardness-tested without cutting up a shaft. Using the same properties and h = 150 W/m²·K, find the coupon's Biot number based on its radius and based on its volume over area, say which model applies, and estimate the time for its centre to reach 840 °C. What does the answer say about using the coupon to judge whether DS-100's body is ready?

**Worked answer.** Based on the radius, Bi = 150 × 0.0125 ÷ 33 ≈ **0.057**; based on volume over area, half the radius, it is about 0.028. Both are well below 0.1, so the lumped model applies. Its time constant is ρ × c × (r₀/2) ÷ h = 7,850 × 650 × 0.00625 ÷ 150 ≈ 213 s, and the time to come within 10 K of the furnace is the time constant multiplied by ln(830 ÷ 10) ≈ 4.42, about **15.7 minutes**. The one-term cylinder solution gives about 15.9 minutes, a Fourier number of about 39.5.

So the coupon is ready about 50 minutes before DS-100's body. A coupon that reaches temperature and hardens well says that the furnace and quench can do the job; it does not say that the shaft's centre was hot enough when it was quenched. If the coupon is to represent the shaft, it has to be either the same section or treated as a surface sample only, with the body's heating time proved by calculation and by a thermocouple in a representative part, as Chapter 9 describes.
