---
book: tolerances-that-work
chapterSlug: choosing-and-calculating-fits
order: 3
title: "Choosing and calculating fits"
description: "Select clearance, transition and interference fits, calculate their limits, account for bought-in bearing tolerances and check a shrink fit for pressure, torque and stress."
draft: true
---

A fit is the relationship between two mating features before assembly: a shaft in a hole, a key in a slot, a bearing in a housing. The fit decides whether the parts slide, locate, grip or are pressed together for life. Because both features vary, a fit is never a single clearance. It is a range, from the tightest combination of parts to the loosest.

This chapter shows how to calculate that range, how to choose between the standard ISO fits, why bought-in parts such as rolling bearings need special care and how to check an interference fit for the pressure, torque and stress it produces.

## Clearance, transition and interference

Every fit falls into one of three families, defined by its extreme combinations:

- **Clearance fit:** the smallest hole is larger than the largest shaft. There is always clearance.
- **Interference fit:** the largest hole is smaller than the smallest shaft. There is always interference.
- **Transition fit:** depending on the actual parts, the assembly may have a little clearance or a little interference.

The two limits of any fit come from simple subtraction:

- **Maximum clearance** = largest hole − smallest shaft
- **Minimum clearance** = smallest hole − largest shaft

A negative minimum clearance is an interference. Writing the two limits this way, with clearance positive and interference negative, avoids sign errors.

## Hole basis and the preferred fits

Most mechanical design uses the **hole-basis system**: holes are H, with their lower deviation at zero, and the shaft letter is chosen to give the required fit. The reason is practical. Holes are usually made with fixed-size tools such as reamers and checked with fixed plug gauges, so keeping holes standard reduces tooling. Shafts are turned or ground and can be made to any size with the same tools. The **shaft-basis system**, with h shafts, suits cases such as several components on one bar of drawn stock.

ISO 286 allows a very large number of hole and shaft combinations, but a short list of preferred fits covers most needs. The table shows commonly used hole-basis fits with their limits at 25 mm nominal. The limits come from the ISO 286-2 deviations for the size range above 18 mm up to 30 mm, and were cross-checked against the preferred-fit tables in Machinery's Handbook.

| Fit | Usual description | At Ø25: from | to |
|---|---|---|---|
| H11/c11 | Loose running | 0.110 clearance | 0.370 clearance |
| H9/d9 | Free running | 0.065 clearance | 0.169 clearance |
| H8/f7 | Close running | 0.020 clearance | 0.074 clearance |
| H7/g6 | Sliding | 0.007 clearance | 0.041 clearance |
| H7/h6 | Locational clearance | 0.000 | 0.034 clearance |
| H7/k6 | Locational transition | 0.019 clearance | 0.015 interference |
| H7/n6 | Locational transition | 0.006 clearance | 0.028 interference |
| H7/p6 | Locational interference | 0.001 interference | 0.035 interference |
| H7/s6 | Medium drive | 0.014 interference | 0.048 interference |

```figure
type: range
title: Preferred hole-basis fits at Ø25, from clearance to interference
min: -0.05
max: 0.05
unit: mm
ticks: −0.05 interference | −0.025 | 0 | 0.025 | 0.05 clearance
caption: Bars left of zero mean interference and bars right of zero mean clearance. Transition fits straddle zero.
- H7/g6 sliding | 0.007 | 0.041
- H7/h6 locational clearance | 0 | 0.034
- *H7/k6 locational transition | -0.015 | 0.019
- H7/n6 locational transition | -0.028 | 0.006
- H7/p6 locational interference | -0.035 | -0.001
- H7/s6 medium drive | -0.048 | -0.014
```

This is an illustration of the calculation. For H7/g6 at Ø25, the hole is 25.000 to 25.021 mm and the shaft is 24.980 to 24.993 mm. Maximum clearance is 25.021 − 24.980 = 0.041 mm. Minimum clearance is 25.000 − 24.993 = 0.007 mm. Every combination of good parts slides with between 7 and 41 micrometres of diametral clearance.

The descriptions are a starting point, not a design rule. A "sliding" fit for a precision locating pin and one for a hand-operated slide may need different choices once lubrication, length of engagement, temperature and contamination are considered.

## Choosing a fit

A sensible sequence for any mating pair is:

1. **State the function.** Must the parts move relative to each other, locate accurately but come apart, or transmit load through friction?
2. **Identify the conditions.** Speed, lubrication, temperature differences between parts, materials with different expansion coefficients, engagement length and the frequency of assembly.
3. **Choose a family** and a candidate preferred fit.
4. **Calculate the limits** at the actual size and check both extremes against the function. The loosest combination must still locate or seal; the tightest must still assemble and run.
5. **Check temperature effects** where the parts are of different materials or run at different temperatures. Chapter 9 shows how a fit can change in service.
6. **Check manufacturing.** Fine grades on both parts may need grinding or reaming. A slightly coarser grade on one part sometimes gives an acceptable fit at much lower cost.

```figure
type: decision
title: First choice of fit family
question: What must this pair of features do?
caption: The family is only the starting point; check both extremes, temperature and manufacturing before settling the fit.
- Move relative to each other | Clearance fit | e.g. H8/f7 or H7/g6, chosen for speed, lubrication and length
- Locate accurately, but come apart | Transition or locational clearance | e.g. H7/h6 or H7/k6
- Carry load through friction | Interference fit | e.g. H7/p6 or H7/s6, with a hub stress check
```

## Bought-in parts: rolling bearing fits

Rolling bearings illustrate why fits cannot always be read straight from the ISO tables. A bearing's bore and outside diameter are made to the bearing standards, such as ISO 492, not to H or h tolerance classes. In the normal tolerance class, the mean bore of a bearing in the 20 mm size range is typically up to 0.010 mm **below** nominal, and the outside diameter of a 42 mm ring up to 0.011 mm below nominal. Confirm the values for your bearing in the manufacturer's catalogue.

Bearing manufacturers publish fit recommendations based on which ring rotates relative to the load, the load magnitude and the materials. The general principle is that a ring with a rotating load needs an interference fit to stop it creeping, while a ring with a stationary load can have a looser fit. The READOS chapter on [selecting bearings and lubrication](/reados/collections/machine-elements-and-mechanical-design/selecting-bearings-and-lubrication-for-reliable-machines/) covers the wider selection.

In the Northgate guide roller, the shaft rotates, so the inner rings carry a rotating load and the outer rings a stationary one. Following its bearing supplier's guidance for this load, Northgate chose a k5 shaft seat and an H7 housing bore. The resulting fits are:

| Fit | Shaft or ring | Hole or bore | Result |
|---|---|---|---|
| Inner ring on shaft | Shaft Ø20 k5: 20.002 to 20.011 | Bearing bore: 19.990 to 20.000 | 0.002 to 0.021 interference |
| Outer ring in housing | Bearing OD: 41.989 to 42.000 | Housing Ø42 H7: 42.000 to 42.025 | 0.000 to 0.036 clearance |

Notice that the inner ring fit is tighter than a k5 shaft in an H hole would be, because the bearing bore sits below nominal. Designers who treat the bearing as an H7 hole underestimate the interference and the reduction in the bearing's internal clearance. The outer ring fit allows the ring to be pushed in by hand or light press, which suits a stationary load and allows the outer rings to move axially when the shaft grows.

```figure
type: range
title: Northgate bearing fits once the bearing tolerances are included
min: -0.025
max: 0.04
unit: mm
ticks: −0.025 interference | 0 | 0.02 | 0.04 clearance
caption: The bearing bore sits below nominal, so the inner ring fit is tighter than the k5 code alone suggests.
- *Inner ring on k5 shaft | -0.021 | -0.002 | interference 0.002 to 0.021 mm: rotating load, must not creep
- Outer ring in H7 housing | 0 | 0.036 | clearance 0.000 to 0.036 mm: stationary load, free to move axially
```

## Checking an interference fit

An interference fit transmits torque or axial load through friction. Two questions decide whether it works: is the **minimum** interference enough to carry the load, and is the **maximum** interference low enough to avoid overstressing the hub or making assembly impractical?

For a solid steel shaft in a steel hub of the same elastic modulus, standard thick-cylinder theory, as presented in mechanical design texts such as Shigley's, gives the contact pressure as:

**p = (E × δ ÷ 2d) × (1 − (d ÷ D)²)**

where E is the elastic modulus, δ the diametral interference, d the interface diameter and D the hub outside diameter. The torque that friction can carry is approximately:

**T = μ × p × π × d² × L ÷ 2**

where μ is the coefficient of friction at the interface and L the engagement length. The largest tangential (hoop) stress occurs at the hub bore:

**σ = p × (D² + d²) ÷ (D² − d²)**

This is an illustration. A steel gear hub of 90 mm outside diameter and 40 mm length is fitted to a 50 mm solid steel shaft with an H7/s6 fit. From ISO 286-2, the 50 H7 hole is 50.000 to 50.025 mm and the 50 s6 shaft 50.043 to 50.059 mm, so the interference ranges from 0.018 mm to 0.059 mm. Take E = 200,000 MPa and an assumed friction coefficient μ = 0.15.

| Condition | Interference | Pressure | Torque capacity | Hub bore hoop stress |
|---|---|---|---|---|
| Minimum | 0.018 mm | 24.9 MPa | 586 N·m | 47.1 MPa |
| Maximum | 0.059 mm | 81.6 MPa | 1,922 N·m | 154.4 MPa |

For the minimum case, E × δ ÷ 2d = 200,000 × 0.018 ÷ 100 = 36 MPa, and (1 − (50 ÷ 90)²) = 0.691, so p = 24.9 MPa. The torque is 0.15 × 24.9 × π × 50² × 40 ÷ 2, about 586,000 N·mm or 586 N·m.

```figure
type: formula
title: Checking the 50 H7/s6 hub at minimum interference
formula: p = (E × δ ÷ 2d) × (1 − (d ÷ D)²)
formula: T = μ × p × π × d² × L ÷ 2
caption: Torque capacity comes from the minimum interference; hub stress from the maximum (81.6 MPa pressure, 154.4 MPa hoop stress).
- δ | diametral interference, 0.018 mm minimum
- d, D | interface 50 mm, hub outside 90 mm
- L, μ | engagement 40 mm, friction 0.15 (assumed)
- E | 200,000 MPa for steel
step: E × δ ÷ 2d = 200,000 × 0.018 ÷ 100 = 36 MPa
step: p = 36 × (1 − 0.309) = 24.9 MPa
step: T = 0.15 × 24.9 × π × 50² × 40 ÷ 2 ≈ 586,000 N·mm
step: Design torque must stay below 586 N·m, with margin
```

The design torque must be compared with the **minimum** value, 586 N·m, with a suitable margin, because a pair of parts at the loose end of their tolerances will be assembled sooner or later. The hub stress must be compared with the hub material's strength using the **maximum** value. A hub of hardened or brittle material, a thin section or a keyway near the bore all need more careful treatment than this simple model allows.

Real interfaces also lose some interference when surface peaks flatten during assembly, and friction varies with surface finish, lubrication and assembly method. Use published friction values with caution, and test critical joints.

## Assembly temperature

Interference fits are often assembled by heating the hub or cooling the shaft. The temperature change needed to remove the interference and leave a working clearance is:

**ΔT = (δ_max + c) ÷ (α × d)**

where α is the coefficient of thermal expansion and c is the assembly clearance needed to slide the parts together before they equalise. For the hub above, with α = 11.5 × 10⁻⁶ per °C for steel and an assumed assembly clearance of 0.03 mm:

ΔT = (0.059 + 0.03) ÷ (11.5 × 10⁻⁶ × 50) ≈ 155 °C

The hub must be heated about 155 °C above the shaft, to roughly 175 °C in a 20 °C workshop. That is within normal induction or oven practice for plain steel, but it could affect a hardened gear, a coating or a part with seals. Cooling the shaft instead reduces the hub temperature needed. Whichever method is used, handling hot or very cold parts is a work health and safety matter and needs a safe procedure.

## Common mistakes

- **Designing for the nominal fit.** Check both extremes. A fit that grips at nominal may slip at minimum interference.
- **Treating bearings as H and h parts.** Use the bearing manufacturer's tolerances and fit recommendations.
- **Ignoring different materials.** An aluminium housing and a steel bearing can change fit significantly with temperature.
- **Specifying interference without a hub check.** Thin hubs and keyways can crack under the pressure of a heavy interference.
- **Over-precise fits on non-critical features.** A clearance hole for a bolt does not need a sliding fit.

## Questions to ask

- What must this pair of features do, and what happens at the loosest and tightest combinations?
- Are any parts made to standards other than ISO 286, such as bearings, bushes or pins?
- Is the minimum interference enough for the load, with margin, and is the maximum interference safe for the hub?
- How will the parts be assembled, and is that method practical and safe at the maximum interference?

## Exercise: tabulate your fits

For one assembly you know, list every mating pair, its function, the fit used and its calculated limits at actual size. Mark any pair where the fit was chosen by habit rather than function, and any bought-in part whose tolerance you have not checked.

The guide roller now has its bearing fits. The next chapter turns to the question of where measurements start: the datum reference frame.
