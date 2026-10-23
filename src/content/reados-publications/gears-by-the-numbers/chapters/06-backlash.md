---
book: gears-by-the-numbers
chapterSlug: backlash-and-tooth-thickness
order: 6
title: "Backlash and tooth thickness"
description: "Specify backlash through tooth thickness and centre distance tolerances, and check that temperature and errors cannot close the clearance."
draft: false
---

Perfect gears made to the theoretical tooth thickness of half the circular pitch would mesh with no clearance at all. Real gears cannot run that way. They need room for lubricant, for manufacturing errors, for deflection under load and for thermal expansion. That deliberate clearance between non-working flanks is **backlash**. Too little and the gears bind, heat and fail; too much and they knock when the load reverses and lose positional accuracy.

Backlash is not a dimension you machine directly. It is the result of two things you do specify: the tooth thickness of each gear and the centre distance of the housing. This chapter shows how they combine.

## Two ways to measure backlash

- **Circumferential backlash**, jt, is the distance one gear can rotate, measured along its pitch circle, while the other is held still.
- **Normal backlash**, jn, is the clearance between the non-working flanks measured along the line of action, which is what a feeler gauge between the teeth would show.

For spur gears they are related by the pressure angle:

**jn = jt × cos α**

## Backlash from thinning the teeth

The most common way to create backlash is to make each tooth slightly thinner than the theoretical value at the pitch circle. If the pinion's tooth is reduced by Δs₁ and the gear's by Δs₂, then at the standard centre distance:

**jt ≈ Δs₁ + Δs₂**

For the conveyor pair, suppose each gear's tooth thickness is reduced by 0.05 mm from the theoretical 4.712 mm:

**jt ≈ 0.05 + 0.05 = 0.10 mm**

**jn ≈ 0.10 × cos 20° ≈ 0.094 mm**

In practice the drawing specifies a tolerance band on tooth thickness, usually expressed as a span or over-pins measurement (Chapter 10), so the backlash has a minimum and a maximum rather than a single value.

## Backlash from the centre distance

Opening the centres also adds backlash. For a small increase Δa:

**jt ≈ 2 × Δa × tan α**

If the housing tolerance allows the centre distance to be up to 0.05 mm over nominal:

**jt ≈ 2 × 0.05 × 0.364 ≈ 0.036 mm**

Combined with the thinned teeth, the maximum circumferential backlash becomes about 0.10 + 0.036 = 0.136 mm, or about 0.128 mm normal backlash. A housing bored undersize would subtract from the backlash, which is why centre distance tolerances on gear housings are often specified as zero or positive only.

```figure
type: stack
title: Where the conveyor pair's maximum backlash comes from
unit: mm
caption: Circumferential backlash at the pitch circle, at the upper housing tolerance and before thermal effects.
- Pinion tooth thinning | 0.05
- Gear tooth thinning | 0.05
- *Centre distance 0.05 mm over nominal | 0.0364
```

## Temperature can close or open the clearance

Gears and housings rarely sit at the same temperature, and they are often made of different materials. Both effects change the backlash in service.

**An aluminium housing with steel gears.** Suppose the whole drive warms by 40 °C. The housing's centre distance grows by about 120 × 23 × 10⁻⁶ × 40 ≈ 0.110 mm. The gears' pitch radii together grow by about 120 × 12 × 10⁻⁶ × 40 ≈ 0.058 mm. The net effect is like opening the centres by about 0.053 mm, which adds roughly **2 × 0.053 × 0.364 ≈ 0.038 mm** of circumferential backlash.

**Steel gears running hotter than a steel housing.** Suppose the gears run 30 °C hotter than the housing. Their pitch radii grow by about 120 × 12 × 10⁻⁶ × 30 ≈ 0.043 mm in total, which acts like closing the centres by that amount and removes about **2 × 0.043 × 0.364 ≈ 0.031 mm** of backlash.

The second case is the dangerous one. A minimum backlash that looked comfortable at room temperature can disappear in service. The design check is to take the minimum backlash, from the thickest teeth and the closest permitted centres, and subtract the worst thermal closure and any expected deflection and runout. The result must still be positive with a margin.

```figure
type: decision
title: Will the minimum backlash survive service?
question: What could close the clearance?
caption: Check the tightest combination, not the nominal one.
- Thickest permitted teeth | Least tooth thinning | from the thickness tolerance
- Closest permitted centres | Housing at its lower limit | prefer zero or positive tolerances
- *Gears hotter than the housing | Thermal closure | estimate from expansion
- Runout and deflection | Local tight spots | from accuracy grade and loads
```

## How much backlash?

There is no single right amount. Positioning drives, indexing heads and reversing servo axes want small backlash, sometimes with anti-backlash arrangements. Heavily loaded, hot-running drives need more. Gear standards and suppliers publish recommended ranges by module and centre distance; use those as a starting point, then check the service conditions as above.

## Exercise: combine thinning and centres

A pair is specified with a combined tooth thickness reduction of 0.08 mm and a centre distance tolerance of +0.04/0 mm. Calculate the maximum circumferential and normal backlash, ignoring temperature.

The centre distance contribution at its maximum is **2 × 0.04 × 0.364 ≈ 0.029 mm**, so the maximum circumferential backlash is **0.08 + 0.029 ≈ 0.109 mm**, and the normal backlash is **0.109 × cos 20° ≈ 0.103 mm**. At the lower centre distance limit, the backlash is 0.08 mm circumferential. Explain how a 30 °C temperature difference like the one above would affect that minimum.
