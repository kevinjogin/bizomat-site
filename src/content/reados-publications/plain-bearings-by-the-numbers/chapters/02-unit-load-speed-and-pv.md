---
book: plain-bearings-by-the-numbers
chapterSlug: unit-load-speed-and-pv
order: 2
title: "Unit load, sliding speed and PV"
description: "Calculate a bearing's unit load, sliding speed and PV, check a bush against its material limits with the BIZOMAT PV tool, handle oscillating motion, and see why PV does not rate a full-film bearing."
draft: false
---

Not every plain bearing runs on a full oil film. Bushes in pivots, linkages, hinges and slow shafts spend all their lives in boundary or mixed lubrication, with their surfaces in contact through a thin layer of grease, oil or solid lubricant. For these bearings there is no film to calculate. They are chosen instead by three numbers that every bush catalogue uses: the unit load on the projected area, the sliding speed, and the product of the two, PV.

This chapter defines the three numbers, explains why their product is really a limit on heat, checks the bushes in FB-75's inlet damper with the BIZOMAT plain bearing PV tool, deals with oscillating motion, and shows why a PV check cannot rate a full-film bearing like FB-75's main journals. It ends with a proposal to replace those journals' white metal shells with sintered bronze bushes "rated for 6 kN".

## Unit load and sliding speed

The unit load on a journal bearing is the radial load divided by the projected area, the bore diameter times the bearing length. It is not the real contact pressure, which varies around the bore, but it is the standard measure for comparing bearings and the one all makers' limits use.

```figure
type: formula
title: Unit load, sliding speed and PV of a journal bearing or bush
formula: P = W ÷ (d × L)
formula: V = π × d × n ÷ 60,000
formula: PV = P × V
caption: With W in newtons and d and L in millimetres, P is in MPa. With d in millimetres and n in rpm, V is in m/s. PV is then in MPa·m/s.
- W | radial load, N
- d, L | bore diameter and bearing length, mm
- n | speed, rpm
- P | unit load on the projected area, MPa
- V | sliding speed at the bore surface, m/s
```

This is an illustration. FB-75's main journal bearings carry 6,000 N on an 80 mm diameter, 60 mm long bore at 1,480 rpm. Their unit load is 6,000 ÷ (80 × 60) = 1.25 MPa, their sliding speed π × 80 × 1,480 ÷ 60,000 = 6.20 m/s, and their PV 7.75 MPa·m/s.

## Why PV is a limit on heat

In a bush running in boundary or mixed lubrication, friction is roughly proportional to load, with a friction coefficient f set by the materials and lubricant. The heat generated per unit of projected area is f times the unit load times the sliding speed, f × P × V. For a given material and lubricant, f is roughly constant, so the heat generated is proportional to PV. The bush can shed only so much heat through its housing and shaft before its surface temperature exceeds what the material or lubricant can bear: the softening point of a polymer, the drop point of a grease or the point at which an oil-impregnated bronze loses its oil. PV is therefore a proxy for surface temperature, and a bush's PV limit is really a temperature limit expressed in mechanical terms.

The limits on P and V on their own guard against other failures. Too much unit load crushes or extrudes the bearing material or squeezes out the lubricant; too much speed overheats a small contact even at low load, or flings out grease. Because PV stands in for temperature, a PV limit quietly assumes a particular way of shedding heat. A catalogue figure is usually measured with the bush in a steel housing in still air at room temperature. The same bush in a hot environment, such as a fan handling warm air, or in a plastic housing that conducts heat poorly, reaches its temperature limit at a lower PV, and many makers publish factors that reduce the allowable PV for such conditions. Conversely, a bush in a well-cooled steel housing, or one whose duty is intermittent so that it cools between movements, can tolerate more. The number in the catalogue is a starting point for a particular set of conditions, and the first question about any PV limit is what those conditions were.

A bush must satisfy all three limits at once. Makers publish them for each material, often with conditions attached: continuous or intermittent duty, a given running-in, a given lubricant, a given housing temperature.

```figure
type: compare
title: What each limit in a bush catalogue protects against
cols: Exceeded means | Usual remedy
rowhead: Limit
- Unit load P | Crushing, extrusion or squeezing out the lubricant | Longer or larger bush; stronger material
- Sliding speed V | Local overheating; grease thrown out | Lower speed; oil instead of grease; different material
- PV | Surface temperature too high for material or lubricant | Better cooling, lubrication or material; lower duty
caption: All three apply together. A bush can pass on P and V separately and still fail on PV.
```

## FB-75's inlet damper bushes

This is an illustration. FB-75's inlet damper, which throttles its flow, turns on a 30 mm shaft supported in two greased bronze bushes, each 30 mm long and carrying 1.2 kN from the damper blade's weight and air load. In service the damper actuator hunts, swinging the blade through ±45° about six times a minute.

Oscillating motion needs an equivalent speed. In one full oscillation, ±45° and back, the shaft surface travels four times the amplitude: 4 × 45° = 180°, half a revolution. At six oscillations a minute, the sliding distance is that of three revolutions a minute. The equivalent speed is therefore 3 rpm, the speed the [plain bearing PV tool](/tools/journal-bearing-pv/) asks for when it says "or equivalent for oscillation".

```figure
type: steps
title: FB-75's damper bush in the plain bearing PV tool
caption: This is an illustration. Material limits are those of a fictional greased bronze catalogue entry: 25 MPa, 2.5 m/s and 1.6 MPa·m/s. Use the bush maker's figures for the actual material and duty.
- Inputs | 1,200 N; 30 mm shaft; 30 mm long; 3 rpm equivalent; limits 25 MPa, 2.5 m/s, 1.6 MPa·m/s
- Projected pressure | 1,200 ÷ (30 × 30) = 1.33 MPa, against 25 MPa
- Sliding velocity | π × 30 × 3 ÷ 60,000 = 0.0047 m/s, against 2.5 m/s
- PV | 0.0063 MPa·m/s, against 1.6
- * Verdict | WITHIN MATERIAL LIMITS, by a wide margin
```

The damper bushes are far inside every limit. Their risks lie elsewhere: oscillating bushes do not move far enough to spread fresh grease over the whole surface, so they can wear locally at the ends of their swing, and an actuator that hunts continuously wears them far faster than one that moves only when commanded. The useful conclusion from the PV check is that the bushes are not overloaded; the useful action is to stop the actuator hunting and to grease the bushes on a schedule that moves the damper through its full travel while greasing.

## Wear in a bush that never floats

A bush that runs without a full film wears, and its life is set by how fast. The usual first estimate, for steady sliding, is Archard's relation: the volume worn is proportional to the load times the sliding distance, with a wear coefficient that depends on the materials, the lubricant and the surface temperature. Divided by the projected area, it gives a wear depth that grows in proportion to P times V times time. PV therefore governs wear as well as heat, and makers of polymer and composite bushes publish wear factors so that users can estimate a bush's life from its PV.

This is an illustration. Suppose the damper bush's material had a wear coefficient of 1 × 10⁻¹⁵ m³ per newton-metre of sliding, a fictional figure of a plausible order for a lubricated bush. The wear rate is the coefficient times P times V: 1 × 10⁻¹⁵ × 1.333 × 10⁶ × 0.00471 = 6.3 × 10⁻¹² metres per second. If the actuator hunted continuously, that would remove about 0.20 mm of bush in a year, enough to loosen the damper noticeably. If it moved only a quarter of the time, about 0.05 mm. The estimate's absolute value is only as good as the wear coefficient, which can vary several-fold with conditions; its value is in comparisons. It shows that halving the time the actuator spends moving halves the wear, which was the case for fixing the actuator before anything else.

Grease helps a bush in two ways: it supplies a boundary film that lowers the wear coefficient, and it seals out dirt, whose particles would otherwise act as an abrasive. Both effects fade as the grease is used up or contaminated, which is why bushes in dirty places, like a dust extraction fan's damper, are greased on a schedule rather than when they squeak. Purging enough fresh grease to push old grease out at the bush's ends carries the dirt out with it.

## Length, diameter and the projected area

The projected area depends on both diameter and length, and the two are not interchangeable. Raising the diameter raises the sliding speed in proportion, so it lowers P but leaves PV unchanged for a given load and shaft speed: PV = W × π n ÷ (60,000 × L), which does not contain d at all. Raising the length lowers both P and PV. For a bush limited by PV, length is the lever.

Length has its own limits. A long bush is more sensitive to misalignment and shaft bending, which load its ends, and it is harder to lubricate along its whole length. For full-film journal bearings, length also changes how much oil leaks from the ends, which Chapter 4 shows changes the film itself. Most full-film journal bearings are shorter than their diameter, like FB-75's at 0.75, and most bushes in pivots are about as long as their diameter.

## Why PV does not rate a full-film bearing

FB-75's main bearings have a PV of 7.75 MPa·m/s, far above the limits printed for most boundary-lubricated bush materials. Yet they run for years with almost no wear. The reason is that in a full film the friction coefficient is not a property of the materials at all. It is set by viscous shear, and Chapter 3 finds it to be about 0.006 for these bearings, against perhaps 0.1 for a bush running in boundary lubrication.

This is an illustration of the difference. A friction coefficient of 0.1 at FB-75's load and speed would generate 0.1 × 6,000 × 6.20 = 3,720 W in each bearing, enough to destroy it within minutes. The full film generates about 217 W. The heat flux on the projected area of 0.0048 m² is 45 kW/m² with the film and 775 kW/m² without it. A full-film bearing is limited not by PV but by the conditions of Chapters 4 to 6: the film's thickness, the bearing's temperature and the lining's strength under the film's peak pressure. PV remains useful for a full-film bearing only at the moments it is not in full film, which Chapter 9 examines.

```figure
type: bars
title: Heat in one of FB-75's journal bearings at 1,480 rpm
unit: W
max: 4000
caption: This is an illustration. Boundary friction coefficient 0.1 assumed for comparison; full-film loss from the short-bearing solution of Chapters 3 and 4.
- Boundary friction, f = 0.1 | 3720
- * Full oil film, f ≈ 0.006 | 217
```

## The error: a bush rated for 6 kN

This is an illustration. A contractor quoting to rebuild FB-75's bearings proposed replacing the white metal shells with oil-impregnated sintered bronze bushes, which needed no oil rings, no oil level checks and no rebabbitting. The bush catalogue listed the proposed 80 × 60 mm bush with a "load rating" of 6.4 kN, comfortably above the bearings' 6 kN. The maintenance planner liked the idea.

The reliability engineer looked for the catalogue's other limits and found them in a footnote: the 6.4 kN was a static load rating, and for running the catalogue gave a maximum sliding speed of 5 m/s and a PV limit of 1.8 MPa·m/s for continuous duty. Entering FB-75's duty in the PV tool, 6,000 N, 80 mm, 60 mm and 1,480 rpm with those limits, gave a unit load of 1.25 MPa, a sliding speed of 6.20 m/s and a PV of 7.75: outside the material limits on speed and on PV, by more than four times on PV.

```figure
type: compare
title: FB-75's duty against the proposed sintered bush's limits
cols: FB-75 | Bush limit | Result
rowhead: Quantity
- Unit load | 1.25 MPa | 10 MPa (catalogue) | Within
- Sliding speed | 6.20 m/s | 5 m/s | Exceeds
- * PV | 7.75 MPa·m/s | 1.8 MPa·m/s | Exceeds by 4.3 times
caption: This is an illustration. Catalogue values are fictional. The bush would have run in mixed or boundary lubrication with heat several times what it can shed.
```

An oil-impregnated bush runs on the small amount of oil held in its pores, which forms at best a partial film. At FB-75's duty it would have overheated, lost its oil and seized. The proposal was declined, and the plant added a line to its purchasing checklist: any bearing proposed as a substitute must be checked against its maker's running limits, P, V and PV, and not against a static load rating. For FB-75 the right substitute for a white metal sleeve bearing remained a white metal sleeve bearing, or a full-film bearing of another kind, checked as the following chapters do.

## A screening routine for bushes

```figure
type: checklist
title: Screening a bush for a duty
caption: The PV tool performs the first four steps; the rest need the maker's data and judgement.
- Find the radial load | Including shocks and the worst steady case
- Find the sliding speed | Or the equivalent speed for oscillation: cycles a minute × 4 × amplitude ÷ 360°
- Calculate P, V and PV | And compare each with the material's limit for the duty
- Check the length | PV falls only with length, not diameter
- ? Ask which duty the limits apply to | Continuous, intermittent, oscillating; lubricated or dry; housing temperature
- x Use a static load rating for a running duty | It describes a stationary load only
- x Rate a full-film bearing by PV | Its limits are film thickness, temperature and lining strength
```

## Bringing it together

Unit load is load over projected area, sliding speed is the bore's surface speed, and their product, PV, measures the heat a boundary-lubricated bush must shed. A bush must satisfy its maker's P, V and PV limits together, for the actual duty; oscillating motion is handled with an equivalent speed. FB-75's damper bushes pass easily. Its main bearings have a PV that would destroy a boundary-lubricated bush, and they survive only because they run on a full film with about a seventeenth of the friction. The next chapter calculates that friction from the film itself.

## Exercise: a longer damper bush

The damper actuator is repaired but the plant also considers a faster damper for a new control strategy: ±30° oscillations at 20 cycles a minute, with the same 1,200 N on each bush. Find the equivalent speed, P, V and PV for the 30 × 30 mm bush, and the bush length that would halve the PV.

**Worked answer.** This is an illustration. Each oscillation slides through 4 × 30° = 120°, a third of a revolution, so 20 cycles a minute equal **6.67 rpm**. The unit load is unchanged at 1.33 MPa; the sliding speed is π × 30 × 6.67 ÷ 60,000 = **0.0105 m/s**; PV is 1.33 × 0.0105 = **0.0140 MPa·m/s**, still far below 1.6. Because PV is inversely proportional to length for a given load and speed, halving it needs a **60 mm** bush. The check shows that no change is needed; the damper's real limit is wear at the ends of its swing, not heat.
