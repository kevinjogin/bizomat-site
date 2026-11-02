---
book: metal-fatigue-by-the-numbers
chapterSlug: finite-life-and-damage
order: 6
title: "Finite life and mixed loads"
description: "How to estimate the life of a part stressed above its endurance limit from an S-N line, add up mixed loads with Miner's rule, and why averaging stresses hides the damage."
draft: false
---

The PK-16 camshafts passed an infinite-life check on their normal load, with a thin margin, and still cracked within about a year. The missing piece was the loads that were not normal: larger cartons, which some customers run for part of every week, and the occasional jam. Each of those cycles was above the endurance limit, and each used up a small part of the shaft's life. This chapter shows how to estimate that life, how to add up damage from mixed loads, and what the PK-16 numbers say when they are added properly.

## The S-N line

Between about 10³ and 10⁶ cycles, the S-N curve of a steel is close to a straight line on log-log axes. That straight line is known as Basquin's relation, from a 1910 paper that fitted it to endurance tests. Where no test data exist, the line is commonly anchored at two estimated points: a fatigue strength of about 0.9 Su at 10³ cycles, and the corrected endurance limit at 10⁶ cycles.

```figure
type: formula
title: The estimated S-N line for steel
formula: S = a N^b,  between N = 10³ and N = 10⁶
formula: a = (f Su)² ÷ Se,   b = −log₁₀(f Su ÷ Se) ÷ 3,   N = (S ÷ a)^(1 ÷ b)
caption: f is the fraction of the tensile strength reached at 10³ cycles, about 0.9 for steels up to about 500 MPa and somewhat lower for stronger steels in some texts; the KEVOS® tools take 0.9 by default. Below 10³ cycles, strain-life methods are needed.
- S | fully reversed alternating stress, or the equivalent fully reversed stress (Chapter 5)
- N | cycles to failure
- a, b | constants of the line; b is negative
- Se | corrected endurance limit, reached at 10⁶ cycles
```

For the PK-16 camshaft, with Su = 900 MPa, f = 0.9 and Se = 250.5 MPa, the line runs from 810 MPa at 10³ cycles to 250.5 MPa at 10⁶ cycles. Then a = 810² ÷ 250.5 = 2,619.2 MPa and b = −log₁₀(810 ÷ 250.5) ÷ 3 = −0.1699.

The exponent b tells how steeply life changes with stress. Life varies as stress to the power 1 ÷ b, here about −5.9, so a 10% rise in stress cuts life by a factor of 1.1^5.9 = 1.75. That steepness is why load estimates matter so much (Chapter 2), and why a small reduction in stress, by a bigger fillet or a better finish, buys such a large gain in life.

### Below a thousand cycles

Under about 10³ cycles the stresses are so high that the part yields on every cycle, and stress no longer describes the damage well. Low-cycle fatigue is assessed with strain-life methods, which relate the plastic and elastic strain amplitudes to life. A machine part like the camshaft rarely lives in that region, but parts that see a few thousand large cycles in their life, such as pressure vessels cycled by start-ups, hydraulic cylinders with occasional relief-valve events, and anything that yields locally at each overload, do. The S-N line of this chapter should not be pushed below 10³ cycles.

### The S-N fatigue life tool

The [fatigue life from the S-N curve](/tools/sn-fatigue-life/) tool takes a fully reversed (or equivalent) alternating stress, the tensile strength, the corrected endurance limit, the fraction f at 10³ cycles and a required life. It returns the Basquin constants, the estimated cycles to failure (unlimited if the stress is at or below the endurance limit), and the stress allowed for the required life, which is the endurance limit itself for any required life of 10⁶ cycles or more.

## The PK-16's mixed load

The prototype strain gauges of Chapter 2 were fitted, after the event, to a PK-16 at a customer who ran mixed products. A week's record, rainflow counted, gave three kinds of cycle at the shoulder. This is an illustration.

```figure
type: compare
title: Cycles at the PK-16 camshaft fillet, from a week of mixed production
cols: Share of cycles | Cycles per year | Local alternating stress, MPa | Against Se = 250.5 MPa
rowhead: Load
- * Standard cartons | 92% | 8,832,000 | 225.9 | below
- Large cartons, 12% higher moment | 8% | 768,000 | 253.0 | above
- Jams, before the torque limiter slips | about 3 cycles, twice a shift | 3,000 | 451.8 | far above
caption: This is an illustration. Local stresses at the PK-16's 0.5 mm fillet, Kf = 2.303, fully reversed bending. A year is 9.6 million cycles. Jam cycles are taken as twice the standard bending stress.
```

The standard carton's stress, 225.9 MPa, is below the endurance limit: on the elementary method it does no damage at all. The large carton's, 253.0 MPa, is just above it. The jam's is far above.

### Life at each level

Entering 253.0 MPa in the S-N tool with the shaft's constants gives N = (253.0 ÷ 2,619.2)^(1 ÷ −0.1699) = 943,000 cycles. At 451.8 MPa, the jam stress, N = 31,000 cycles.

```figure
type: steps
title: The PK-16's large-carton cycles in the S-N fatigue life tool
caption: This is an illustration. Su = 900 MPa, Se = 250.5 MPa, f = 0.9, required life 7.68 million cycles: ten years of large-carton running.
- Basquin constants | a = 2,619.2 MPa, b = −0.1699
- * Estimated cycles to failure at 253.0 MPa | 943,000
- Required | 7,680,000: LIFE TOO SHORT
- Stress allowed for the required life | 250.5 MPa: the endurance limit, because the requirement exceeds 10⁶ cycles
- Large-carton cycles in one year | 768,000, already 81% of the estimated life
```

### How the cycles were counted

The week of records behind that table is the most valuable evidence in the PK-20 file, and the way it was gathered is worth recording. A full bridge of strain gauges was bonded beside the fillet of a spare PK-16 camshaft, wired through a slip ring and logged at 2,000 samples a second, fifty times the cam frequency, so that no peak was missed. The bridge was calibrated by hanging known weights on the shaft before it was fitted. The log was rainflow counted into bins 10 MPa wide, and the bins were grouped into the three loads of the table.

A week is a short sample. The customer confirmed that the product mix that week was typical, but jams are rare events, and a week's count of them carries a large uncertainty: the twelve jams recorded could easily have been eight or twenty in another week. The builder therefore asked the customer's maintenance log for a year's record of jam stops, which agreed with about two a shift. Where a rare, damaging event drives the result, the count of that event deserves the most care.

## A part designed for finite life

Not every part needs infinite life. The PK-20's carton magazine has a changeover clamp, operated about 20 times a day when the customer changes product, 250 days a year, for ten years: 50,000 cycles in its life. Designing it for infinite life would make it larger than it needs to be.

For a required life of 50,000 cycles, the S-N tool's allowed stress on the camshaft steel's line is a × N^b = 2,619.2 × 50,000^−0.1699 = 416.7 MPa. But the clamp's life must also allow for scatter: fatigue lives of nominally identical parts commonly vary over a range of three to ten times. A common practice is to design for a multiple of the required life. With a factor of 3 on life, the clamp is designed for 150,000 cycles, and the allowed stress falls to 345.7 MPa. Because life is so sensitive to stress, a factor of 3 on life costs only about 17% in stress.

```figure
type: bars
title: Allowed alternating stress on the camshaft steel's S-N line for several required lives
unit: MPa
caption: This is an illustration. Su = 900 MPa, Se = 250.5 MPa, f = 0.9. Any required life of 10⁶ cycles or more gives the endurance limit.
- 50,000 cycles | 416.7
- 100,000 cycles | 370.4
- * 150,000 cycles (50,000 × 3 for scatter) | 345.7
- 200,000 cycles | 329.2
- 1,000,000 cycles or more | 250.5
```

### Scatter and the design value of damage

The same scatter applies to Miner sums. Because tests on mixed loading fail at damage sums from about 0.3 to 3, many designers limit the calculated damage over the design life to a fraction of 1, and a value of 0.3 to 0.5 is common for parts whose failure matters. The PK-20 builder adopted 0.3 for its cycling parts: the PK-20 shaft's 0.056 to 0.108 over ten years is comfortably within it, and the PK-16's 0.911 a year exceeds it within four months.

## Miner's rule

A part that sees cycles at several stress levels needs a way to add their effects. The simplest, and still the most widely used, is the linear damage rule published by Miner in 1945, building on an earlier proposal by Palmgren for ball bearings.

```figure
type: formula
title: The linear damage rule (Palmgren–Miner)
formula: D = Σ nᵢ ÷ Nᵢ
formula: failure is predicted when D reaches 1
caption: Each block of nᵢ cycles at stress level i uses up the fraction nᵢ ÷ Nᵢ of the life, where Nᵢ is the life at that level from the S-N line. In tests, failure occurs at sums from roughly 0.3 to 3, depending on the order and mix of loads, so designs often limit D to well below 1.
- nᵢ | cycles applied at level i
- Nᵢ | cycles to failure at level i alone
- D | accumulated damage
```

The rule assumes that the damage from a cycle does not depend on when it is applied, which is not quite true: high loads early in life can start cracks that later small loads grow, and occasional overloads can sometimes slow a growing crack by leaving compressive stress at its tip. For machine parts under a reasonably steady mix of loads, the rule works acceptably as long as its result is treated as an estimate, not a prediction.

### The PK-16, added up

```figure
type: compare
title: Damage per year at the PK-16 camshaft fillet, elementary Miner
cols: Cycles per year, n | Life at that level, N | Damage per year, n ÷ N
rowhead: Load
- Standard cartons, 225.9 MPa | 8,832,000 | unlimited | 0
- Large cartons, 253.0 MPa | 768,000 | 943,000 | 0.814
- Jams, 451.8 MPa | 3,000 | 31,000 | 0.097
- * Total | 9,603,000 | not applicable | 0.911
caption: This is an illustration. A damage of 0.911 a year predicts failure after 1 ÷ 0.911 = 1.10 years, about 13 months, of running at this customer's mix. The field failures, about a third within the first year, are consistent with that.
```

The result matches the field experience well, better than an estimate this rough deserves. The fit is a useful check on the whole chain of the method: endurance limit estimate, factors, notch factor and loads. It also points to the cure. The PK-16 failed because its normal stress was so close to the endurance limit that a 12% heavier carton pushed it over, and once over, the steep S-N line used up life fast.

## The error: averaging the stresses

The first attempt at this calculation, made by the PK-16's original designer, was simpler. The designer averaged the stress over the product mix: 0.92 × 225.9 + 0.08 × 253.0 = 228.1 MPa, below the endurance limit, and concluded that the mix made no difference.

That averaging hides all the damage. Fatigue life depends on stress through a power of about 5.9 above the endurance limit and not at all below it. A weighted average of stresses is not the stress that does the average damage; the damage must be found at each level first and then added. A part loaded at 225.9 MPa for 92% of the time and at 253.0 MPa for 8% does not behave like one loaded at 228.1 MPa all the time. The first predicts failure in about a year; the second predicts infinite life.

The builder found the error by doing the calculation the right way round: damage at each level, then the sum. The rule that came out of it applies to every fatigue calculation in the PK-20 file. Never average stresses, loads or moments across a mix of conditions before applying an S-N line or an endurance limit. Count the cycles at each level and add their damage.

```figure
type: compare
title: Two ways of handling the PK-16's product mix
cols: Stress used | Predicted life | Agrees with the field?
rowhead: Method
- Average the stress, then check | 228.1 MPa, below Se | infinite | no
- * Damage at each level, then add | 225.9, 253.0 and 451.8 MPa separately | about 13 months | yes
caption: This is an illustration. The averaging error predicts infinite life for a shaft that failed in about a year.
```

## Cycles below the endurance limit

The elementary rule counts no damage for cycles below the endurance limit. That is reasonable for a part whose stresses are all below the limit: no crack starts. It is not safe once a crack has started, because a crack, once present, grows under cycles that could never have started it. In the PK-16, the large-carton and jam cycles started the crack, and the standard-carton cycles, 92% of the total and only 10% below the endurance limit, then helped grow it.

Several modified rules allow for this by extending the S-N line below the endurance limit, either at the same slope (very conservative) or at a shallower slope; one widely used proposal, due to Haibach, extends it with an exponent of 2k − 1, where k = −1 ÷ b. For the PK-16, those rules predict lives shorter than the field showed, which suggests the real behaviour lies between them and the elementary rule. For a new design, the honest approach is to make the answer insensitive to the choice: keep every frequent cycle well below the endurance limit, so that whichever rule is used, the damage is small.

### When a crack is already there

Once a crack exists, its growth can be calculated directly instead of through damage sums. Fracture mechanics relates the crack's growth per cycle to the range of the stress intensity at its tip, which rises with both the stress range and the square root of the crack's length; the best-known fit is the Paris relation. That approach is how aircraft structures, pressure vessels and large welded plant are given inspection intervals: the time for a crack to grow from the smallest size an inspection can find to the size at which the part breaks, divided by a safety factor. For a mass-produced machine part like the camshaft, it is cheaper to stop cracks starting than to track them, but the same idea explains why a crack, once found, must be treated as a fault and not watched.

### The PK-20, added up

The PK-20 shaft, with its 2 mm ground fillet (Chapter 7), has a corrected endurance limit of 298.3 MPa and a local bending stress of 163.1 MPa for a standard carton. A large carton raises that to 182.7 MPa, still well below the limit, and a jam to 326.2 MPa. With the PK-20 line's constants, a = 2,199.5 MPa and b = −0.1446, a jam cycle's life is about 539,000 cycles.

```figure
type: compare
title: Damage over ten years at the PK-20 camshaft fillet
cols: Elementary Miner | With cycles below Se counted by Haibach's extension
rowhead: Load
- Standard cartons, 163.1 MPa | 0 | 0.038
- Large cartons, 182.7 MPa | 0 | 0.014
- Jams, 326.2 MPa, 30,000 cycles | 0.056 | 0.056
- * Total over ten years | 0.056 | 0.108
caption: This is an illustration. Either way the PK-20 shaft uses about a tenth of its life or less in ten years. A design whose answer does not depend on which damage rule is chosen is a robust design.
```

## Exercise: a customer who runs only large cartons

One PK-20 customer will run large cartons only, 9.6 million cycles a year, and expects twice the usual number of jams: 6,000 jam cycles a year. Using the PK-20 shaft figures above, find the elementary Miner damage per year. Is the shaft adequate for ten years? What would the same customer have done to a PK-16 shaft?

**Worked answer.** For the PK-20, the large-carton stress of 182.7 MPa is below the 298.3 MPa endurance limit, so on the elementary rule it does no damage. The jam damage is 6,000 ÷ 539,000 = 0.0111 a year, or 0.111 in ten years. The shaft is adequate: even doubling the jams uses about a ninth of its life.

For a PK-16 shaft, every cycle would be a large-carton cycle at 253.0 MPa, with a life of 943,000 cycles. The damage from those alone would be 9,600,000 ÷ 943,000 = 10.2 a year: a predicted life of about five weeks. The jams add 6,000 ÷ 31,000 = 0.19 a year, which hardly matters beside that. A customer like this would have broken a PK-16 shaft in about five weeks.
