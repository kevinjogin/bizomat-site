---
book: cryogenic-liquids-by-the-numbers
chapterSlug: how-long-a-part-takes-to-cool
order: 5
title: "How long a part takes to cool"
description: "Film, transition and nucleate boiling, the vapour blanket that slows a warm part, a film boiling estimate for SF-180's shaft, how to tell when a part is really cold, and a shaft pulled out too soon."
draft: false
---

Chapter 4 found how much nitrogen a part needs. This chapter finds how long it takes, and the answer surprises most people the first time. A steel shaft dropped into liquid nitrogen does not cool in a minute or two, as a hot shaft quenched in water would. It sits inside a blanket of its own nitrogen vapour, which insulates it from the liquid, and for most of its cooling the heat crosses that blanket slowly. SF-180's 80 mm shaft takes the better part of half an hour.

The chapter explains the three regimes of boiling and why a warm part starts in the slowest one, estimates the shaft's cooling with a classical film boiling correlation and NIST vapour properties, checks that the shaft cools evenly through its section, sets out how to tell when a part is really cold, and ends with a shaft taken out while it was still in film boiling.

## Three ways to boil

When a surface is hotter than the liquid around it, the way the liquid boils depends on how much hotter. The difference between the surface temperature and the liquid's boiling point is called the wall superheat, and the relationship between superheat and heat flux is the boiling curve.

At small superheats, a few kelvins for nitrogen, bubbles form at points on the surface, grow and break away. This is nucleate boiling: the liquid keeps wetting the surface between bubbles, and it carries heat away very effectively. As the superheat rises, bubbles crowd together until, at the critical heat flux, they merge. Above that point, in transition boiling, patches of the surface are covered by vapour and the heat flux falls as the superheat rises. At large superheats the surface is covered completely by a continuous film of vapour. This is film boiling. The liquid never touches the surface; heat crosses the vapour film by conduction and radiation, and vapour is generated at the film's outer edge.

```figure
type: steps
title: What happens when SF-180's shaft goes into the bath
caption: This is an illustration of the sequence an observer sees. The times are from the film boiling estimate later in this chapter, for an 80 mm shaft lying in the bath.
- First seconds | violent boiling and spitting as the liquid meets the warm surface; the shaft is soon surrounded by a vapour film
- Film boiling, about 25 minutes | steady, fairly quiet boiling from the film's edge; the heat flux falls from about 13 to 2 kW/m² as the shaft cools
- Rewetting | the film collapses as the shaft nears the liquid's temperature; boiling becomes briefly vigorous as liquid touches the surface
- Nucleate boiling, a few minutes | fast cooling of the last few kelvins; bubbles from the surface
- Equilibrium | boiling stops; the shaft is at the bath temperature, 77.4 K
```

The same physics drives the Leidenfrost effect that cooks see when a drop of water skates across a very hot pan: the drop sits on a cushion of its own vapour and lasts far longer than it would on a merely hot pan. For liquid nitrogen, a room-temperature part is a very hot pan. The superheat at the start is about 216 K, far into the film boiling regime.

The end of film boiling, where the film breaks down and liquid touches the surface again, is known as the rewet or minimum film boiling temperature. Research on liquid nitrogen chilldown, such as Darr and colleagues' work for NASA, shows that it depends on the surface, the flow and the pressure, and that correlations developed for water predict it poorly for nitrogen. That is one reason why this chapter estimates the film boiling stage, which takes most of the time, and treats the end of the process as something to observe rather than predict.

## A film boiling estimate

The classical correlation for stable film boiling on a horizontal cylinder is Bromley's, published in 1950. It treats the vapour film as a thin layer in laminar flow up and around the cylinder, and gives a heat transfer coefficient from the vapour's properties at the film's mean temperature.

```figure
type: formula
title: Bromley's correlation for film boiling on a horizontal cylinder
formula: h = 0.62 × [k_v³ × ρ_v × (ρ_l − ρ_v) × g × h′_fg ÷ (μ_v × D × ΔT)]^(1/4)
formula: h′_fg = h_fg + 0.4 × c_p,v × ΔT
caption: Vapour properties k_v, ρ_v, μ_v and c_p,v at the film temperature, the mean of the surface and the boiling point; ρ_l and h_fg for the liquid at its boiling point. Radiation across the film is small at these temperatures and is neglected.
- ΔT | wall superheat, surface temperature minus 77.36 K
- D | cylinder diameter, 0.080 m for SF-180's shaft
- h′_fg | latent heat corrected for warming the vapour in the film
```

This is an illustration. At the start, with the surface at 293.15 K, the film is at 185.3 K, where NIST gives nitrogen gas at 101.325 kPa a conductivity of 0.01705 W/(m·K), a density of 1.849 kg/m³, a viscosity of 12.1 µPa·s and a specific heat of 1.044 kJ/(kg·K). The corrected latent heat is 199.2 + 0.4 × 1.044 × 215.8 = 289.3 kJ/kg. Bromley's correlation then gives h = **62 W/(m²·K)**, about the coefficient for air blown across a part by a strong fan, and nowhere near the thousands of W/(m²·K) of nucleate boiling.

As the shaft cools, the film becomes thinner and the coefficient rises a little, but the temperature difference falls faster, so the heat flux falls steadily.

```figure
type: compare
title: Film boiling on SF-180's 80 mm shaft as it cools
cols: Coefficient | Heat flux | Heat flow from the shaft | Nitrogen boiled
caption: This is an illustration. Bromley's correlation with NIST nitrogen vapour properties at 101.325 kPa; shaft area 0.098 m² including its ends.
- *293 K, entering the bath | 62 W/(m²·K) | 13.4 kW/m² | 1,312 W | 6.6 g/s
- 200 K | 64 W/(m²·K) | 7.9 kW/m² | 774 W | 3.9 g/s
- 150 K | 68 W/(m²·K) | 5.0 kW/m² | 487 W | 2.4 g/s
- 100 K | 84 W/(m²·K) | 1.9 kW/m² | 186 W | 0.9 g/s
```

## Does the shaft cool evenly?

Before using the coefficient to find a time, it is worth checking whether the inside of the shaft keeps up with its surface. The test is the Biot number: the ratio of the resistance to conduction inside the part to the resistance to heat transfer at its surface. When it is below about 0.1, the part's temperature is nearly uniform at every moment, and the whole part can be treated as one lump.

For a long cylinder, the length scale is its volume divided by its surface area, about D ÷ 4 = 20 mm for the shaft. NIST's fit for low-alloy nickel steel gives a conductivity of about 36 W/(m·K) at 200 K, so Bi = 64 × 0.020 ÷ 36 = **0.036**. The surface resistance dominates by a factor of nearly thirty. The shaft's core and surface stay within a few kelvins of each other throughout, which is good for the fit: the shaft contracts evenly, without the thermal stress that a fast, uneven quench would cause.

With the lumped model, the heat balance is simple: in each second, the heat crossing the film, h × A × (T − 77.36), comes out of the shaft's heat capacity, m × c(T), using NIST's specific heat at the shaft's current temperature. Stepping that balance forward second by second gives the cooling curve. Heat Transfer by the Numbers explains the same model, with a constant coefficient, in its chapter on [heating up and cooling down](/reados/publications/heat-transfer-by-the-numbers/heating-up-and-cooling-down/).

```figure
type: line
title: SF-180's shaft cooling in film boiling, estimated
x: Time in the bath, minutes
y: Shaft temperature, K
ymin: 70
ymax: 300
caption: This is an illustration. Lumped model with Bromley's coefficient, NIST vapour properties and NIST's specific heat for nickel steels. The curve stops at 100 K because film boiling ends near there and rewetting, which this model does not cover, finishes the cooling within a few minutes.
- 0 | 293
- 3.8 | 250
- 9.1 | 200
- 15.8 | 150
- 21.1 | 120
- 25.8 | 100
```

The estimate puts the shaft at 200 K after 9 minutes, 150 K after 16, and 100 K after 26. After that the film collapses, liquid touches the steel, and nucleate boiling takes out the last 23 K quickly, because only 4.3 kJ/kg of heat remains (Chapter 4). A realistic plan for SF-180 is therefore about 30 minutes in the bath, confirmed on the job.

## Size and the time it takes

Film boiling makes cooling time grow with the part's size faster than in proportion. The heat to remove grows with the part's volume, the area that removes it with its surface, and the coefficient falls slowly as the diameter rises. For cylinders, time scales roughly as the diameter to the power 1.25.

```figure
type: bars
title: Estimated film boiling time to 100 K for 350 mm low-alloy steel shafts
unit: minutes
max: 60
caption: This is an illustration. Same model and properties as the cooling curve. Thin parts cool quickly; heavy sections take much longer, so a mixed batch is ready when its heaviest part is.
- 40 mm, 3.5 kg | 11.4
- * 80 mm, 13.8 kg | 25.8
- 160 mm, 55.2 kg | 55.7
```

Two consequences follow. A batch of mixed parts is ready only when its heaviest section is cold, so thin parts should go in later rather than sit in the bath boiling nitrogen for nothing after they are cold. And because the shaft cools evenly but its surface is in film boiling throughout, stirring the bath or moving the part does little to shorten the time: the vapour film reforms at once.

## Gentle on the part, with two exceptions

Film boiling is slow, but it is also gentle. Because the Biot number is small, the shaft's surface and core stay close in temperature, and the thermal stress that comes from a surface shrinking around a warmer core stays low. That is the opposite of a water quench in heat treatment, where a high surface coefficient chills the skin far faster than the core. For most machined parts in ordinary steels, stainless steels, copper alloys and aluminium alloys, a liquid nitrogen bath is not a thermal shock risk.

There are two exceptions worth checking before a part goes in. The first is a hardened steel part that may contain retained austenite, the phase that some hardened steels keep after quenching. Cooling well below room temperature can transform part of it to martensite, which is the basis of deliberate sub-zero treatment, and the transformation brings a small, permanent change in size and in internal stress. A hardened and ground part should go into the bath only with the agreement of whoever specified its heat treatment. The second is a part with sharp internal corners, cracks or brittle coatings, where even modest stresses concentrate; such parts should be inspected first and cooled slowly, for example by being held in the cold vapour above the liquid before immersion.

Holding a part in the vapour first also shortens the violent spitting at the moment of immersion, because the part is already a little colder. It does not shorten the total time much, since the cold vapour is a far poorer coolant than boiling liquid.

## How to tell when a part is cold

The estimate gives a time to plan around; the decision to take a part out should rest on what the bath shows. Three signs, in increasing order of certainty:

1. **The boiling stops.** In film boiling the bath boils steadily, and a fitter can mistake its quieting as the shaft cools for the end. The real end comes after the rewetting surge: a short period of more vigorous boiling as the film collapses, followed by a near-silent bath. A part is cold when the bath around it boils no harder than the bath's standing loss.
2. **The scale stops falling faster than its idle rate.** With the bath on a scale, the mass falls quickly while the part gives up heat, then returns to the standing rate of Chapter 3. The change of slope marks the end.
3. **A thermocouple says so.** A type T or type K thermocouple pressed against or drilled into a test piece of the same section gives the temperature directly. Its reading needs a reference table that extends to cryogenic temperatures, and the instrument must be set for the thermocouple type, because a type K thermocouple's output at −196 °C is far from linear in temperature. It is most useful when setting the station up, to confirm the time for each part size once.

## The error: a shaft taken out in film boiling

This is an illustration. During SF-180's first week, a shaft went in, boiled hard for a few minutes and then settled into a steady, much quieter simmer. After about a quarter of an hour the fitter, judging the shaft cold, lifted it out and offered it to the carrier. It entered about a third of its length and stuck. The fit had to be pressed out, and both parts went back for inspection.

The quieting the fitter saw was the film boiling stage, not the end of cooling. The estimate puts the shaft at about 150 K after 16 minutes, and NIST's contraction data, used in Chapter 6, give only 0.114 mm of contraction on the 80 mm diameter at 150 K. The carrier was at the tight end of the tolerance, with 0.095 mm of interference, and the fitters wanted 0.03 mm of clearance, so the shaft needed 0.125 mm. It was short by about 0.01 mm, and it was still warming in the carrier's bore.

The supervisor found the cause by repeating the cooling with a thermocouple drilled into an offcut of the same bar, which reached 150 K at about 16 minutes and did not reach the bath temperature until about 29 minutes, after a clear surge of boiling around the 26-minute mark. The station's procedure now calls for a minimum of 30 minutes in the bath for this shaft, timed from immersion, and for the bath to be quiet before the part comes out.

## Exercise: a shaft twice the diameter

A larger repair needs a 160 mm shaft of the same steel, 350 mm long, cooled in a bigger bath. Using the size result in this chapter, estimate the film boiling time to 100 K and the heat removed, and say how the nitrogen boiled per minute at the start compares with SF-180's shaft.

**Worked answer.** This is an illustration. The shaft's mass is π ÷ 4 × 0.16² × 0.35 × 7,850 = **55.2 kg**, four times the 80 mm shaft, and it gives up 55.2 × 77.11 = **4,259 kJ**, which boils 21.4 kg of nitrogen. The film boiling estimate gives about **56 minutes** to 100 K, 2.2 times the 80 mm shaft's 25.8 minutes, close to the 2^1.25 = 2.4 that the rough scaling suggests. At the start its area is 0.216 m², 2.2 times as large, and Bromley's coefficient is lower by the factor (1 ÷ 2)^(1/4) = 0.84, so the heat flow and the rate of boiling at the start are about 2.2 × 0.84 = 1.85 times those of the smaller shaft: about 12 g/s, which is 0.7 kg a minute. The bath must hold at least the 26.5 L of liquid the shaft will boil, plus enough to keep it covered, and the room's ventilation must cope with the gas, as Chapter 9 shows.
