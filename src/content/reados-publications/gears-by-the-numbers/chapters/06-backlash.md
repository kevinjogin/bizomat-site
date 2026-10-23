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

## Working a backlash range from tolerances

A single backlash figure hides the real question: what are the smallest and largest values the drawings allow? This is an illustration. Suppose the conveyor pair's drawings specify, for each gear, a tooth thickness reduction of between 0.05 mm and 0.10 mm from the theoretical 4.712 mm, and the housing allows the centre distance to be between nominal and 0.05 mm over.

- **Minimum backlash**, thickest teeth at the closest centres: 0.05 + 0.05 = **0.10 mm** circumferential.
- **Maximum backlash**, thinnest teeth at the widest centres: 0.10 + 0.10 + 2 × 0.05 × 0.364 ≈ **0.236 mm** circumferential.

If the gears then run 30 °C hotter than a steel housing, as in the example above, the minimum falls by about 0.031 mm to roughly **0.069 mm**. That is still positive with a margin, so the specification is workable. If the minimum had come out close to zero, the remedy would be to increase the minimum tooth thinning or to raise the lower limit of the centre distance, not to rely on the nominal value.

```figure
type: compare
title: The conveyor pair's backlash range
cols: Circumferential | Normal
caption: Illustrative tolerances: each tooth thinned 0.05 to 0.10 mm, centres 0 to +0.05 mm, gears 30 °C hotter than a steel housing in service.
- Maximum, thinnest teeth, widest centres | 0.236 mm | 0.222 mm
- Minimum, thickest teeth, closest centres | 0.100 mm | 0.094 mm
- *Minimum in service, after thermal closure | 0.069 mm | 0.065 mm
```

The range is wide, more than three to one between its ends, and that is normal. Narrowing it means tighter tooth thickness and housing tolerances, which cost money in manufacture and inspection. A drive that needs little backlash variation is better served by one of the adjustment methods described below than by ever tighter tolerances.

## Runout takes backlash away at the tight spot

A gear whose teeth are not concentric with its axis has **radial runout**. As it turns, its teeth move in and out relative to the mating gear, which has the same effect as the centre distance changing once per revolution. Where the high points of both gears meet, the backlash is at its smallest.

This is an illustration. If the pinion has a radial runout of 0.02 mm and the gear 0.03 mm, measured as total indicator readings, the teeth move in by up to half of each value at their high points. When both high points meet, the local backlash falls by about:

**2 × (0.01 + 0.015) × tan 20° ≈ 0.018 mm**

That reduction should be included in the minimum backlash check alongside the thermal closure. It also explains why backlash measured at one position in an assembled gearbox can mislead: the same pair may show noticeably different values a quarter of a turn later. Gear accuracy grades in ISO 1328 limit runout, and a better grade buys a more uniform backlash as well as quieter running.

## Measuring backlash in an assembly

The usual workshop method locks one gear and rocks the other through its free movement, measuring the movement with a dial indicator. The indicator is placed against a tooth flank at the pitch circle and perpendicular to the tooth, or against an arm clamped to the shaft at a known radius. A reading taken at a radius other than the pitch radius is converted in proportion:

**jt = reading × pitch radius / indicator radius**

This is an illustration. With the pinion locked, an indicator on an arm 120 mm from the gear's axis reads 0.16 mm of movement. The gear's pitch radius is 90 mm, so:

**jt = 0.16 × 90 / 120 = 0.12 mm**

That lies within the 0.10 to 0.236 mm range calculated above. The measurement should be repeated at several positions, commonly four at roughly 90° intervals on the larger gear, to reveal the effect of runout. Feeler gauges between the non-working flanks give the normal backlash directly where access allows, and a soft lead wire rolled through the mesh and then measured is an older method still used on large gears.

## How much backlash?

There is no single right amount. Positioning drives, indexing heads and reversing servo axes want small backlash, sometimes with anti-backlash arrangements. Heavily loaded, hot-running drives need more. Gear standards and suppliers publish recommended ranges by module and centre distance; use those as a starting point, then check the service conditions as above.

## Writing backlash onto the drawings

Because backlash depends on both gears and the housing, no single drawing can guarantee it. A gear maker who is told only "backlash 0.10 to 0.20 mm" does not know how the thinning should be split between the pinion and the gear, or what centre distance tolerance the housing will have. The clearer approach is to specify what each maker controls:

- **On each gear drawing:** the tooth thickness tolerance, normally as a span or over-pins measurement with upper and lower limits, as Chapter 10 describes.
- **On the housing drawing:** the centre distance with its tolerance, preferably zero or positive only, and the parallelism of the bores.
- **On the assembly drawing:** the resulting backlash range as a reference value, with the method and positions used to check it at assembly.

Stated that way, each supplier can check their own part, and the assembler has a figure to confirm.

## Backlash and the oil

Backlash also gives the lubricant somewhere to go. As teeth come into mesh, oil trapped in the closing space between them must escape, either sideways along the face or through the clearance between the non-working flanks. With very little backlash, particularly on wide, fast-running gears, the trapped oil is squeezed out at high speed, absorbing power, heating the oil and adding noise. This effect, often called oil pocketing or pumping, is one more reason not to chase the smallest possible backlash in a power transmission drive. The minimum backlash should leave room for the oil film as well as for heat, runout and deflection.

## Backlash as lost motion

In a conveyor, backlash hardly matters as long as it is neither zero nor excessive. In a positioning drive, it becomes lost motion: when the direction of rotation reverses, the input turns through the backlash before the output moves at all.

The angular backlash at the gear is the circumferential backlash divided by the gear's pitch radius. For 0.10 mm on the conveyor gear's 90 mm radius:

**0.10 / 90 ≈ 0.00111 rad ≈ 0.064°, or about 3.8 minutes of arc**

On a 200 mm diameter pulley mounted on the output shaft, that is about 0.11 mm of movement at the pulley's surface before the drive takes up the reversal. For a conveyor, that is irrelevant. For a rotary table or a robot joint, it may be the largest single source of positioning error.

In a multi-stage train, the backlash of each stage adds at the output, but stages nearer the input are reduced by the ratios that follow them. Backlash in the first stage of the 4:1 and 5:1 train from Chapter 1 appears at the output shaft divided by five, while backlash in the final stage appears in full. That is why low-backlash gearboxes concentrate their precision in the output stage.

## Reducing backlash where it matters

When small backlash is required, several approaches are used instead of, or as well as, tight tolerances:

- **Adjustable centre distance.** One shaft is mounted in an eccentric bearing housing or a sliding plate, and the centres are closed until the backlash reaches the required value at the tightest point.
- **Split or scissor gears.** The gear is made in two thin halves, sprung against each other in rotation so that one half bears on each flank of the mating teeth. Backlash is taken up, but the spring must be strong enough for the torque that reverses through it.
- **Dual drives with preload.** Two pinions drive one gear or rack, with one pinion biased against the other, so that one always bears on each flank direction. This is common on large rack drives.
- **Selective assembly.** Gears and housings are measured and matched so that thicker teeth go into wider centres.

Each brings cost, complexity or a load limit. They belong in drives where lost motion really matters, not in power transmission like the conveyor.

## Backlash grows with wear

As teeth wear, they thin, and the backlash rises. A record of the backlash at commissioning, measured at marked positions with a known method, turns later measurements into a simple wear indicator. A steady rise over years is normal. A rapid rise, or a large difference between positions, points to a problem worth investigating, such as poor lubrication, misalignment or a worn bearing letting a shaft move.

## Exercise: combine thinning and centres

A pair is specified with a combined tooth thickness reduction of 0.08 mm and a centre distance tolerance of +0.04/0 mm. Calculate the maximum circumferential and normal backlash, ignoring temperature.

The centre distance contribution at its maximum is **2 × 0.04 × 0.364 ≈ 0.029 mm**, so the maximum circumferential backlash is **0.08 + 0.029 ≈ 0.109 mm**, and the normal backlash is **0.109 × cos 20° ≈ 0.103 mm**. At the lower centre distance limit, the backlash is 0.08 mm circumferential. Explain how a 30 °C temperature difference like the one above would affect that minimum.
