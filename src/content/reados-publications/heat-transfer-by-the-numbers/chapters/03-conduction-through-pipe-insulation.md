---
book: heat-transfer-by-the-numbers
chapterSlug: conduction-through-pipe-insulation
order: 3
title: "Conduction through pipe insulation"
description: "Calculate heat loss from insulated pipe with the cylindrical conduction formula, see why each extra millimetre of insulation helps less, account for valves and fittings, and meet the critical radius."
draft: false
---

A pipe is not a flat wall. Heat leaving a pipe flows outwards through insulation whose area grows with every millimetre, because each layer of insulation is a larger circle than the one inside it. That changes the arithmetic in two ways that matter in practice. The first centimetres of insulation do most of the work, and each additional one does less. And on very small pipes and cables, a thin layer of insulation can actually increase the heat loss. The flat-wall method from Chapter 2 gives the wrong answer for pipes; the cylindrical form of the same law gives the right one.

This chapter calculates the heat loss from HW-60's 60 m hot water pipe. It derives the thermal resistance of a cylindrical insulation layer, combines it with the outside surface resistance, compares thicknesses, shows how much heat escapes through uninsulated valves and flanges, links the result to the water's temperature drop, and explains the critical radius. The failure case is a pipe run whose insulation stopped short at every valve.

## The resistance of a cylindrical layer

For a cylindrical layer of insulation, inner radius **r₁**, outer radius **r₂**, conductivity **k**, the thermal resistance for one metre of pipe length is:

**R′ = ln(r₂ ÷ r₁) ÷ (2π × k)**, in K·m/W

The natural logarithm replaces the thickness of the flat-wall formula. It grows ever more slowly as r₂ increases, which is the mathematical form of the diminishing returns described above. The outside surface's resistance per metre is **1 ÷ (h × π × D₂)**, where D₂ is the outer diameter of the insulation, and it falls as the insulation gets thicker, because the outer surface is larger.

HW-60's pipe is **60.3 mm** in outside diameter, so r₁ is about **30.15 mm**. The water's film and the steel wall add resistances so small they are left out here, as in Chapter 2. The outside surface coefficient is the same **9 W/m²·K** used for the tank's painted jacket.

## HW-60's pipe with 40 mm of insulation

```figure
type: formula
title: Heat loss per metre from HW-60's pipe with 40 mm of mineral wool
formula: R′ = ln(r₂ ÷ r₁) ÷ (2π k) + 1 ÷ (h π D₂)        q′ = ΔT ÷ R′
caption: This is an illustration with k = 0.04 W/m·K, h = 9 W/m²·K, water at 85 °C and the room at 20 °C. Chapter 5's more detailed calculation gives about 18.1 W/m, a close match.
- Inner radius r₁ and outer radius r₂ | 30.15 mm and 70.15 mm
- Insulation | ln(70.15 ÷ 30.15) ÷ (2π × 0.04) ≈ 0.845 ÷ 0.251 ≈ 3.36 K·m/W
- Outside surface, D₂ = 140.3 mm | 1 ÷ (9 × π × 0.1403) ≈ 0.25 K·m/W
step: R′ ≈ 3.36 + 0.25 ≈ 3.61 K·m/W
step: q′ ≈ 65 ÷ 3.61 ≈ 18.0 W per metre, about 1.08 kW for 60 m
```

With 40 mm of mineral wool, the 60 m run loses about **1.08 kW**. Over 6,000 hours that is about 6,500 kWh a year, costing about **A$600**. The insulation provides over 90% of the resistance, as on the tank.

## Diminishing returns

The same calculation for other thicknesses shows how the logarithm behaves.

```figure
type: bars
title: Heat loss from 1 m of HW-60's pipe by insulation thickness
unit: W/m
max: 30
caption: This is an illustration with the same assumptions. The first 25 mm cuts the loss from a bare pipe's 100-plus W/m to about 24 W/m; each later step saves less. Chapter 6 turns this into an economic choice.
- 25 mm | 23.9
- *40 mm | 18.0
- 50 mm | 15.8
- 65 mm | 13.7
- 80 mm | 12.2
```

Going from 25 mm to 40 mm saves about 5.9 W/m. Going from 65 mm to 80 mm, the same 15 mm extra, saves only about 1.5 W/m. Two things cause this. The logarithm grows slowly, so each added layer adds less resistance. And each added layer is a larger circle, so it uses more insulation material per metre than the one inside it: at 80 mm thick, the outer surface is about 3.65 times the pipe's own surface. The cost of insulation rises while its benefit falls, so there is a thickness beyond which it does not pay, which is the subject of Chapter 6.

## Why the flat-wall formula is wrong for pipes

If the flat-wall formula from Chapter 2 were used for the pipe, with the insulation's 40 mm thickness and the pipe's own surface area, the insulation's resistance per metre would come out as **0.04 ÷ (0.04 × π × 0.0603) ≈ 5.28 K·m/W**, far more than the true 3.36. The flat-wall formula ignores the growing area and overstates insulation's effect on small pipes, predicting losses about a third lower than reality. Using the pipe's outer insulation surface area instead understates it. Only the logarithmic form is right, and the larger the ratio of insulation thickness to pipe radius, the more it matters. For a 1.5 m tank with 50 mm of insulation, the ratio is small and the flat-wall formula is close enough; for a 60 mm pipe with 40 mm of insulation, it is not.

## Valves, flanges and fittings

The 60 m run is not all straight pipe. HW-60's pipe has **eight** valves for isolation and the hose stations, each with a flanged or screwed body, plus elbows, tees and pipe supports. Straight lengths are easy to insulate with preformed sections. Valves and flanges are awkward shapes, and they are often left bare.

A bare valve body on a 60 mm pipe, with its bonnet and flanges, exposes perhaps **0.15 m²** of metal at nearly the water temperature. This is an illustration. Using Chapter 5's figures for a bare, weathered stainless surface at 85 °C, about 760 W/m², each bare valve loses about **114 W**, as much as about **6.4 m** of insulated pipe. Eight bare valves lose about **0.91 kW**, almost as much as the whole 60 m of insulated pipe.

```figure
type: compare
title: Where HW-60's pipe heat goes, with and without valve jackets
cols: Insulated pipe, 60 m | Eight valves | Total
caption: This is an illustration. Each bare valve is taken as 0.15 m² of weathered stainless steel at 85 °C. Removable insulated jackets are assumed to cut each valve's loss to about a tenth.
- Valves bare | about 1.08 kW | about 0.91 kW | about 1.99 kW
- *Valves jacketed | about 1.08 kW | about 0.09 kW | about 1.17 kW
```

The answer is **removable insulated jackets**: shaped, fastened covers of insulation with a durable outer skin, made for each valve and flange, that can be taken off for maintenance and put back. They pay for themselves quickly on hot water and very quickly on steam, where surfaces are hotter still. HW-60's eight valves were fitted with them when the pipe was insulated.

## From heat loss to temperature drop

Chapter 1 linked heat loss to the water's temperature drop through **ṁ × c × ΔT**. With the circulation pump moving **0.1 kg/s** round the pipe, an insulated pipe with jacketed valves, losing about 1.17 kW, cools the water by about **1.17 ÷ (0.1 × 4.19) ≈ 2.8 K** on its way round. With bare valves, the loss of about 1.99 kW would cool it by about **4.8 K**. The difference shows in the temperature at the farthest hose station, and in the gas bill.

## The critical radius

On small pipes, tubes and cables, insulation can behave unexpectedly. Adding a thin layer increases the outer surface area, which lowers the surface resistance, while the insulation's own resistance is still small. Up to a certain outer radius, the first effect wins and the heat loss **increases**. That radius, the **critical radius**, is:

**r_critical = k ÷ h**

For mineral wool at 0.04 W/m·K and a surface coefficient of 9 W/m²·K, the critical radius is about **4.4 mm**. HW-60's pipe, at a radius of 30 mm, is far above it, so any insulation reduces its loss. But a small instrument tube 6 mm in diameter, with a radius of 3 mm, is below it. As the exercise shows, a thin layer of insulation on such a tube slightly increases its heat loss, and only a thicker layer reduces it. The same effect is why electrical cables, whose insulation is meant to shed heat, can run cooler with a modest insulating sheath than without one.

## Supports, hangers and the outer jacket

Pipe supports are thermal bridges, like the tank's legs in Chapter 2. HW-60's pipe rests on its supports on rigid insulating saddles, so the hanger clamps go round the insulation, not the pipe. The insulation is protected by a painted metal jacket, lapped so that water sheds off it, and sealed at every penetration and at the jacket's ends, so the insulation stays dry. Where the pipe runs through the wash-down area, the jacket is stainless steel, because it is hosed regularly.

## Installing preformed sections

Pipe insulation is usually supplied as **preformed sections**: rigid half-shells or split cylinders of mineral wool, about a metre long, made for each pipe size and thickness. They fit the pipe closely, which matters, because a gap between the pipe and the insulation lets air circulate and adds a convection path the calculation does not include. Sections are butted tightly end to end, with the joints between successive sections staggered on multi-layer work so that no joint runs straight through to the pipe. At bends, sections are cut into mitred segments, or preformed bends are used, rather than leaving a gap on the outside of the bend. The installer checks the thickness on every size of section delivered, because a product supplied 30 mm thick against a 40 mm specification increases the loss by about a fifth along the whole run, from about 18.0 to 21.4 W/m on HW-60's pipe.

## Surface temperature and safety

Insulation also protects people. A bare HW-60 pipe runs at nearly 85 °C, hot enough to burn skin on contact within moments. With 40 mm of mineral wool and a painted jacket, Chapter 5's calculation puts the jacket's surface at about **24 °C**, barely warmer than the room. Where people can touch hot pipes or equipment, the risk depends on the surface temperature, the material and how long contact lasts, and work health and safety law requires that risk to be managed. Insulation, guards or barriers are the usual controls. On HW-60, insulation does both jobs at once: it saves heat and removes a burn hazard along every metre of pipe within reach.

## Keeping a dead leg warm

Not every pipe circulates. A branch to a hose station that is used once a shift holds still water between uses, which cools through its insulation. The time it takes to cool can be estimated with the method in Chapter 8. Where a branch must stay hot, it is kept short, or the circulation loop is taken past it, or an electric heat trace is laid under its insulation to replace the heat it loses. The heat trace's power per metre is set by the insulated loss calculated in this chapter: about 18 W/m on HW-60's pipe.

## A failure case: the insulation stopped at every valve

This is an illustration. Before HW-60's present insulation was installed, the pipe had been lagged by a contractor who insulated the straight lengths and left every valve, flange and union bare, "for access". The farthest hose station's water was noticeably cooler than the tank, and the gas use seemed high.

The maintenance engineer measured it with the method from Chapter 1. With the circulation pump running and no hoses open, the water cooled by about **5 K** between the tank and the farthest point and back, against about 2.8 K calculated for a fully insulated system. A thermal camera showed every valve and flange glowing against the cool jacketed pipe.

The detection came from comparing a measured temperature drop with a calculated one. The correction was to fit removable jackets to every valve and flange, after which the measured drop fell to about 3 K. The calculated saving of about 0.8 kW, around **A$450** a year, repaid the jackets within two years. The insulation specification now states that valves and flanges are insulated with removable jackets, not left bare.

## How this applies to a small Australian business

For pipes, use the cylindrical formula, ln(r₂ ÷ r₁) ÷ (2π k), not the flat-wall one. Expect diminishing returns: the first 25 to 40 mm of insulation do most of the work. Count the valves, flanges and fittings, and fit removable jackets so they can be insulated and still maintained. Check the result by measuring the temperature drop round a circulating loop. Support pipes on insulating saddles, keep the jacket watertight, and remember that on very small tubes and cables, a thin layer of insulation can increase heat loss.

## Exercise: a small instrument tube

A 6 mm outside diameter stainless instrument tube carries 85 °C water through a 20 °C room. Using k = 0.04 W/m·K and h = 9 W/m²·K, what is its loss per metre bare, with **1.4 mm** of insulation and with **10 mm** of insulation? What does the result show?

**Worked answer.** Bare, the loss is **h × π × D × ΔT = 9 × π × 0.006 × 65 ≈ 11.0 W/m**. With 1.4 mm of insulation, bringing the outer radius to about 4.4 mm, the critical radius, the insulation's resistance is **ln(4.4 ÷ 3) ÷ (2π × 0.04) ≈ 1.52 K·m/W** and the surface's **1 ÷ (9 × π × 0.0088) ≈ 4.02 K·m/W**, a total of about 5.54, so the loss is about **11.7 W/m**, slightly **more** than bare. With 10 mm, the resistances are about **ln(13 ÷ 3) ÷ (2π × 0.04) ≈ 5.83** and **1 ÷ (9 × π × 0.026) ≈ 1.36 K·m/W**, a total of about 7.20, and the loss falls to about **9.0 W/m**. Thin insulation on a tube smaller than the critical radius increases its loss; it takes a thicker layer to reduce it.
