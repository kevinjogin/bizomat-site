---
book: tolerances-that-work
chapterSlug: temperature-deflection-and-allocation
order: 9
title: "Temperature, deflection and allocating the tolerance budget"
description: "Add thermal expansion, distortion and form effects to a stack-up, then share an assembly tolerance between parts using equal, size-based and cost-based allocation."
draft: true
---

A stack-up calculated from drawing dimensions describes the assembly at one moment: on the bench, at the reference temperature, with every part rigid and perfectly formed. Real assemblies run warm or cold, are clamped and bolted, and contain faces that are not quite flat or square. Those effects can be as large as the manufacturing tolerances themselves.

This chapter adds temperature and deflection to the Northgate guide roller analysis, then looks at the reverse problem: starting from an allowed assembly variation and deciding how much tolerance each part should receive.

## Reference temperature

Dimensions on engineering drawings are defined at a standard reference temperature of 20 °C, set by ISO 1. A part that measures exactly on size at 25 °C is, strictly, not on size: at 20 °C it would be slightly smaller. For most work the difference is negligible. For close tolerances on large parts, or for parts measured warm straight off a machine, it is not.

Linear thermal expansion is calculated as:

**ΔL = α × L × ΔT**

where α is the coefficient of linear expansion, L the length and ΔT the change in temperature. Typical coefficients are about 11 to 13 × 10⁻⁶ per °C for carbon and bearing steels and about 23 × 10⁻⁶ per °C for many aluminium alloys. Use the value for your specific material.

This is an illustration. A 100 mm steel dimension measured at 30 °C instead of 20 °C reads about 100 × 11.5 × 10⁻⁶ × 10 = 0.0115 mm large. For aluminium the error is about 0.023 mm. An IT7 tolerance at 100 mm is 0.035 mm, so measuring a warm aluminium part can consume two-thirds of the tolerance before any manufacturing error is counted. Parts should be allowed to reach the temperature of the measuring room, or measurements should be corrected.

```figure
type: bars
title: Reading error on a 100 mm part measured 10 °C warm
unit: mm
caption: A warm aluminium part can use two-thirds of an IT7 tolerance before any manufacturing error is counted.
- Steel, α ≈ 11.5 × 10⁻⁶ /°C | 0.0115
- *Aluminium, α ≈ 23 × 10⁻⁶ /°C | 0.023
- IT7 tolerance at 100 mm, for comparison | 0.035
```

## Different materials in one assembly

Temperature becomes a design problem when parts of different materials share a dimension chain. If every part were the same material at the same temperature, the whole assembly would simply scale and gaps would change in proportion. With an aluminium housing and steel internal parts, the housing grows about twice as fast.

### Bearing fit in the aluminium housing

Chapter 3 gave the Northgate outer ring fit in the housing as 0.000 to 0.036 mm clearance at 20 °C. Suppose the unit runs at 80 °C and, for simplicity, the housing and outer rings reach the same temperature. The bore grows by 42 × 23 × 10⁻⁶ × 60 mm and the ring by 42 × 11.5 × 10⁻⁶ × 60 mm. The difference is:

42 × (23 − 11.5) × 10⁻⁶ × 60 ≈ **0.029 mm**

At 80 °C the fit becomes roughly 0.029 mm to 0.065 mm clearance. A ring that was a light push fit at assembly is now loose. Under a stationary load that may be acceptable, but it can allow the outer ring to creep, which wears the housing. Bearing manufacturers commonly recommend tighter housing fits for light alloy housings for exactly this reason. In service, the inner ring often runs warmer than the outer ring, which reduces the bearing's internal clearance; that effect should be checked against the bearing manufacturer's guidance as well.

### Axial float

The axial stack is affected the same way. Housing dimension A, 41.80 mm of aluminium, grows faster than the steel stack it encloses: two bearings, the spacer and the ring, 41.75 mm in total. The float changes by:

(41.80 × 23 × 10⁻⁶ − 41.75 × 11.5 × 10⁻⁶) mm per °C ≈ **0.00048 mm per °C**

| Condition | Change in float | Revised design RSS range |
|---|---|---|
| 20 °C, as assembled | 0 | 0.101 to 0.299 mm |
| 80 °C running | +0.029 mm | 0.130 to 0.328 mm |
| −10 °C cold start | −0.014 mm | 0.087 to 0.285 mm |

```figure
type: range
title: Revised float range as temperature changes
min: 0
max: 0.45
unit: mm
ticks: 0 | 0.05 | 0.20 | 0.40 | 0.45
caption: The aluminium housing grows faster than the steel stack, opening the float by about 0.00048 mm per °C.
- *Requirement | 0.05 | 0.40
- −10 °C cold start | 0.087 | 0.285
- 20 °C as assembled | 0.101 | 0.299
- 80 °C running | 0.130 | 0.328
```

In this case the effect is modest and stays inside the 0.05 mm to 0.40 mm window, but it shows why the lower float limit exists. In a design where the housing were steel and the shaft aluminium, or with a much larger temperature range, thermal change could close the float completely and load the bearings axially. The analysis should be done for the extreme temperatures the product will see, including storage and transport where relevant, not only for normal running.

Uniform temperature is itself an assumption. A housing heated by a nearby motor on one side, or cooled by airflow, will distort unevenly. For critical precision equipment, thermal behaviour may need measurement or simulation.

## Deflection and distortion

Parts also change shape under load:

- **Clamping and bolting.** Tightening the four M8 screws can pull a thin flange towards an uneven frame and distort the bore slightly. A stiff flange, a flat frame and a defined tightening sequence reduce the effect.
- **Press fits.** An interference fit expands the hub and compresses the shaft, which can reduce the clearance of other features nearby, for example a bearing pressed onto a shaft reduces the bearing's internal clearance.
- **Operating loads.** Belt tension bends the shaft and tilts the bearings within their clearances. For a guide roller the effect on alignment may matter more than any manufacturing tolerance.
- **Gravity and fixturing.** Long or thin parts sag differently in a fixture, on a measuring table and in service.

Deflection is not a tolerance, but it belongs in the same budget. Calculate it with standard mechanics where it is significant and include it as an additional term in the stack-up, usually as a worst-case allowance rather than a statistical one, because it is systematic rather than random.

## Form and orientation in the chain

Chapter 7 treated the spacer as a perfect cylinder of measured length. If its end faces are out of square with its bore, the bearing rings it pushes against may contact it at one edge, and the effective length in the stack differs from the length measured between parallel planes. A cautious approach is to add the relevant geometric tolerance, here the perpendicularity of the spacer end faces, as an extra term wherever it can shift the contact point along the stack direction. The better approach is to specify the geometric tolerance tightly enough that its contribution is small compared with the size tolerance, then document that judgement.

## Allocating a tolerance budget

So far the analysis has started from part tolerances and calculated the assembly result. Design often needs the reverse: given the allowed assembly variation, how much tolerance should each part have? There are several reasonable methods.

**Fix the bought-in parts first.** Bearings, rings, seals and fasteners have tolerances set by their makers. Subtract their contribution from the budget before allocating the rest.

**Equal allocation.** Give every remaining part the same tolerance. It is simple, but it ignores the fact that some dimensions are much harder to control than others.

**Size-based allocation.** Give each part a tolerance proportional to the ISO standard tolerance factor for its size, i = 0.45 × ∛D + 0.001 × D, as introduced in Chapter 2. Every part then works to roughly the same tolerance grade, which tends to correspond to similar manufacturing difficulty for similar processes.

**Cost-based allocation.** Give more tolerance to dimensions that are expensive to hold, such as a groove position in an aluminium housing, and less to those that are cheap, such as the length of a turned and faced spacer. With cost data for a few tolerance levels per part, the allocation can be optimised; without it, engineering judgement and supplier input are a sound substitute.

## Allocation for the guide roller

Northgate decided to use the inflated statistical method from Chapter 8. Centred at 0.20 mm, the float window of 0.05 mm to 0.40 mm allows ±0.15 mm on the low side, so the target is 1.5 × RSS ≤ 0.15 mm, which means the RSS of all contributors must be no more than 0.10 mm.

The bearings and ring are fixed: 0.06² + 0.06² + 0.03² = 0.0081 mm². The total allowed is 0.10² = 0.0100 mm², so 0.0019 mm² remains for the housing dimension A and the spacer S.

| Method | Housing A | Spacer S | Check: A² + S² |
|---|---|---|---|
| Equal | ±0.031 | ±0.031 | 0.0019 |
| Size-based, using i for each size range | ±0.036 | ±0.025 | 0.0019 |

For the size-based method, the tolerance factor is 1.561 µm for A, in the 30 mm to 50 mm range, and 1.083 µm for S, in the 10 mm to 18 mm range. Scaling both by the same constant so that their squares add to 0.0019 mm² gives about ±0.036 mm for A and ±0.025 mm for S.

The size-based split happens to match the cost judgement here: the groove position in the larger aluminium housing gets more tolerance, and the shorter turned spacer gets less. Northgate rounded the result to A = 41.80 ± 0.035 mm and S = 16.00 ± 0.025 mm. Both are within normal capability for a careful machining supplier, and the allocation is recorded with its reasoning so that a later change, such as a different bearing supplier with a different width tolerance, can be re-evaluated quickly.

```figure
type: compare
title: Sharing the remaining 0.0019 mm² between housing and spacer
cols: Equal | Size-based (ISO factor i) | Released
best: 3
caption: Bearings and ring are fixed at 0.0081 mm² of the 0.0100 mm² budget, so only 0.0019 mm² is left to allocate.
- Housing A, 41.80 mm | ±0.031 | ±0.036 | ±0.035
- Spacer S, 16.00 mm | ±0.031 | ±0.025 | ±0.025
- Basis | Same tolerance each | Proportional to i: 1.561 and 1.083 µm | Rounded size-based split
```

## Common mistakes

- **Analysing only at 20 °C** when parts of different materials share a chain.
- **Measuring warm parts** against tight tolerances without correction.
- **Ignoring assembly loads** such as bolt tightening and press fits.
- **Allocating before subtracting fixed contributors.** The bought-in parts' share is not negotiable.
- **Equal allocation by default.** It usually overspends on cheap dimensions and starves expensive ones.

## Questions to ask

- What temperature range will the assembly see in operation, storage and transport?
- Which parts in the chain are different materials, and how does the gap change per degree?
- Which deflections or distortions can shift the contact points in the chain?
- Which tolerances are fixed by suppliers, and how much budget remains after them?
- Which dimensions are expensive to control, and has the allocation reflected that?

## Exercise: add temperature and reallocate

For your own stack-up, list the material of each part and calculate the change in the gap per degree. Find the gap at the coldest and hottest expected conditions. Then subtract fixed contributors from the allowed variation and reallocate the remaining budget using the size-based method. Compare the result with the existing drawing tolerances.

The design now has tolerances that are reasoned, allocated and checked against temperature. The final chapter asks how those tolerances will be verified, and sets out a review process to use before releasing a drawing.
