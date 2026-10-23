---
book: fits-that-work
chapterSlug: carry-the-stack-through-temperature
order: 4
title: "Carry the stack through temperature"
description: "Calculate differential thermal expansion, evaluate dimensional limits at operating temperature and identify the conditions that invalidate a uniform-temperature model."
draft: false
---

An assembly may pass a dimensional check in a controlled room and behave differently after it warms. The question is not simply whether metal expands. It is which lengths expand, how their changes combine, and whether the components actually share the temperature assumed in the calculation.

The housing and its contents need not grow by the same amount. Even when they are made from similar materials, different lengths and constraints can change the result. This chapter extends the gap model without pretending to replace a thermal analysis of a real machine.

## Put temperature into the equation

For a freely expanding member over a range where a constant coefficient is an adequate approximation:

**L(T) = L20 × [1 + α(T − 20)].**

L20 is its length at 20 °C. The coefficient α is expressed per degree Celsius or per kelvin; temperature differences have the same numerical size in those two units. The result uses the same length unit as L20.

The [NPL dimensional metrology guide](https://eprintspublications.npl.co.uk/3360/1/mgpg80.pdf) discusses temperature correction and its uncertainties. For the calculations here, use deliberately assumed coefficients of **23 × 10⁻⁶ /°C for the housing** and **12 × 10⁻⁶ /°C for both internal members**. These are teaching inputs, not certified values for unspecified aluminium and steel grades.

Actual alloy, heat treatment, direction, temperature range and property uncertainty can matter. A material label such as “stainless” is not enough to justify one universal expansion coefficient.

## Calculate the nominal change

This is an illustration. All three Revision A members rise uniformly from 20 to 60 °C, a change of 40 °C. They remain free to expand along the chain and the contact arrangement is unchanged.

| Member | Calculation of growth | Growth |
|---|---|---:|
| Housing | 60 × 23 × 10⁻⁶ × 40 | 0.05520 mm |
| Cartridge | 52 × 12 × 10⁻⁶ × 40 | 0.02496 mm |
| Spacer | 6 × 12 × 10⁻⁶ × 40 | 0.00288 mm |

The housing growth opens the gap while the two internal growths close it. The net change is **0.05520 − 0.02496 − 0.00288 = 0.02736 mm**. The nominal hot gap is therefore **2.02736 mm**.

```figure
type: bars
title: Growth from 20 to 60 °C
unit: mm
max: 0.06
caption: The housing's higher coefficient outgrows the internal parts, so the nominal gap opens to about 2.027 mm.
- Housing, 60 mm at 23 × 10⁻⁶ /°C | 0.0552 | opens the gap
- Cartridge, 52 mm at 12 × 10⁻⁶ /°C | 0.02496 | closes it
- Spacer, 6 mm at 12 × 10⁻⁶ /°C | 0.00288 | closes it
- *Net change in the gap | 0.02736 | opens
```

This nominal result lies inside the functional interval. It does not answer the worst-case question because the manufactured lengths are not necessarily nominal.

## Apply expansion to the actual limiting lengths

At 60 °C, the largest gap uses H = 60.06, C = 51.96 and S = 5.97 mm at the reference temperature:

**Gmax,60 = 60.06 × 1.00092 − 51.96 × 1.00048 − 5.97 × 1.00048 = 2.1574488 mm.**

The result exceeds the 2.15 mm upper limit by approximately **0.00745 mm**. Adding only the nominal thermal change to the cold maximum would be a useful estimate, but expanding the limiting lengths gives the consistent result.

For every allowed combination in this particular case, the gap increases as the common temperature rises. The lowest gap over the uniform 20-to-60 °C range is consequently the cold minimum, **1.87 mm**. The highest is the hot maximum just calculated.

This monotonic behaviour follows from the positive coefficient of temperature in the gap equation. Do not assume it for every design. Different materials, lengths or constraints can reverse the sign, and nonlinear behaviour may require checking intermediate conditions.

## Do not forget the cold side

The requirement record defines an operating range of 20 to 60 °C, but products are also stored, shipped and sometimes started in the cold. The smallest gap moves the other way as temperature falls. For Revision A's smallest combination, the rate is about 0.000682 mm per °C, so from 1.87 mm at 20 °C:

- **At 0 °C:** about 1.856 mm, still inside the limit.
- **At −10 °C:** about 1.850 mm, effectively at the 1.85 mm limit.

```figure
type: compare
title: Revision A's smallest gap as temperature falls
cols: Smallest gap | Margin to 1.85 mm
caption: Uniform temperature. The cold-side margin is used up at about −9 °C; whether that matters depends on whether the gap must hold in that state.
- 20 °C | 1.870 mm | 0.020 mm
- 10 °C | 1.863 mm | 0.013 mm
- 0 °C | 1.856 mm | 0.006 mm
- *−10 °C | 1.850 mm | About zero
```

Whether that matters depends on the function. If the gap only needs to hold while the mechanism operates, and it never operates below 20 °C, the cold result may be irrelevant. If the mechanism could be started in a cold environment, or if a closed gap in storage could preload and damage a part, the cold state becomes part of the requirement. Either way, the decision belongs in the requirement record, not in an unspoken assumption about where the product will be kept.

## Test a focused revision

Consider Revision B, which changes only the housing span to **59.98 ± 0.04 mm**. C and S retain their original limits. At 20 °C:

**Gmin = 59.94 − 52.04 − 6.03 = 1.87 mm.**

**Gmax = 60.02 − 51.96 − 5.97 = 2.09 mm.**

At 60 °C, the largest gap becomes:

**60.02 × 1.00092 − 51.96 × 1.00048 − 5.97 × 1.00048 = 2.117412 mm.**

The complete ideal interval across the stated uniform-temperature range is now **1.87 to 2.117412 mm**. The lower-side margin remains 0.02 mm; the upper-side margin becomes approximately 0.03259 mm.

```figure
type: range
title: The gap from 20 to 60 °C
unit: mm
min: 1.8
max: 2.2
caption: Expanding the limiting lengths, Revision A exceeds 2.15 mm by about 0.007 mm; Revision B's housing of 59.98 ± 0.04 mm stays inside.
- Functional requirement | 1.85 | 2.15
- Revision A | 1.87 | 2.157 | exceeds the upper limit
- *Revision B | 1.87 | 2.117
```

Revision B improves the model, but it also asks manufacturing to hold a tighter housing span and a different nominal size. That proposal needs a process and inspection assessment. Chapter 7 compares it with other ways to spend the available tolerance budget.

## Find the temperature at which the margin runs out

Because the model is linear, each worst-case combination changes at a constant rate with uniform temperature. For Revision A's largest gap, the rate is:

**60.06 × 23 × 10⁻⁶ − (51.96 + 5.97) × 12 × 10⁻⁶ ≈ 0.000686 mm per °C**

Starting from 2.13 mm at 20 °C, the 0.02 mm of upper margin is used up after about 0.02 / 0.000686 ≈ 29.1 °C, at roughly **49 °C**. Revision B's largest gap starts at 2.09 mm and changes at almost the same rate, so its 0.06 mm of margin would last to about **108 °C** under the same uniform assumptions.

Expressing a result as the temperature at which a limit is reached is often clearer than reporting a margin at one temperature. It tells the reviewer directly how much the operating assumption could be wrong before the conclusion changes, and it invites the right question: how confident are we that the assembly never sees more than 60 °C, uniformly?

## Investigate temperatures that are not equal

A hot housing around a cool cartridge is a different load case. If Revision A's housing alone reaches 60 °C while the internal members remain at 20 °C, the worst-case gap is:

**60.06 × 1.00092 − 51.96 − 5.97 = 2.1852552 mm.**

This is substantially larger than the uniform-temperature result. It illustrates why the phrase “operating temperature 60 °C” is insufficient when components heat at different rates.

For Revision B, the corresponding value is **2.1452184 mm**, before any geometric contribution. That leaves less than 0.005 mm at the upper limit. The revision therefore cannot be declared suitable for arbitrary temperature gradients on the strength of the uniform analysis.

Map plausible thermal states with the people who understand start-up, shutdown and nearby heat sources. Use measurements or a justified thermal model to establish component temperatures. If different components can independently reach different extremes, evaluate those combinations rather than using one ambient reading for all of them.

## Consider heat that starts inside

The uneven case above put the heat in the housing. Many assemblies heat from the inside instead: friction in a bearing, a motor winding or a process flow warms the internal parts before the housing catches up. That reverses the effect on this gap.

This is an illustration. If Revision A's cartridge and spacer reach 60 °C while the housing is still at 20 °C, the smallest gap becomes:

**59.94 − 52.04 × 1.00048 − 6.03 × 1.00048 ≈ 1.842 mm**

That is below the 1.85 mm limit, even though the uniform analysis found the lower side safe at every temperature in the range. Revision B shares the same lower combination and therefore the same result. Start-up from cold, with internal heating, may be the most demanding state for the small-gap side, while external heating may be the most demanding for the large-gap side. Both transient directions need to be mapped before the thermal check can be called complete.

## Allow for uncertainty in the coefficients

The coefficients used here are assumptions. Real values vary with alloy, temper and temperature range, and published values are themselves rounded. A change of 1 × 10⁻⁶ /°C in the housing coefficient alters its growth over the 40 °C rise by:

**60 × 1 × 10⁻⁶ × 40 = 0.0024 mm**

That is small against Revision B's upper margin of about 0.033 mm, but it is a tenth of Revision A's original 0.02 mm budget. When margins are this tight, the coefficient deserves a source: a material data sheet for the specified grade, a standard, or a measurement. When margins are generous, a reasonable textbook value may be enough, provided the record states it as an assumption.

## Write the thermal states down

The thermal checks in this chapter cover four states: uniform cold, uniform hot, a hot housing around cool internal parts, and hot internal parts inside a cool housing. Each moves the gap differently, and a design that passes one can fail another. A short table in the design record, listing each state, the temperature of each member, the source of those temperatures and the resulting minimum and maximum gaps, makes the coverage visible.

The table also shows what has not been checked. If nobody knows whether the cartridge can lead the housing by 40 °C during start-up, that is an open question with an owner, not a blank cell to be filled with the uniform result. A single measurement campaign with thermocouples on a prototype, through a realistic start-up, often settles several such questions at once and replaces assumptions with evidence.

## Check whether free expansion is the right model

A restrained member may develop stress instead of freely changing length. Contact may open or close, a polymer may creep, and a preload may change. The linear free-expansion equation does not describe those mechanisms on its own.

Also separate temperature during measurement from temperature during service. Correcting an inspection result to a reference temperature requires information about both the part and the measurement system. A warm part measured by a warm instrument is not automatically self-correcting, particularly when their materials differ.

Keep thermal inputs and assumptions in the design record. A later material substitution can change the result even if all dimensions remain unchanged. “Equivalent strength” does not mean equivalent thermal behaviour.

## Temperature during measurement

Thermal effects apply to inspection as well as service. Parts measured at a workshop temperature different from 20 °C read differently from their reference size. An aluminium housing span of 60 mm measured at 23 °C would be about 60 × 23 × 10⁻⁶ × 3 ≈ 0.004 mm longer than at 20 °C. If the instrument is steel and at the same temperature, part of that growth is cancelled by the instrument's own expansion; with the assumed coefficients, the apparent difference is about 60 × (23 − 12) × 10⁻⁶ × 3 ≈ 0.002 mm.

Against a housing tolerance of ±0.04 mm, a 0.002 mm effect is about five per cent of the half-width. It is not negligible when a part measures close to a limit, and it is easily larger if the part has just come off the machine. The inspection procedure should state the temperature at which measurements are taken or corrected, and the measurement uncertainty budget in Chapter 6 should include any remaining thermal effect.

## Let parts soak before measuring

Machining, washing and handling all change a part's temperature. A housing taken straight from the machine may be several degrees warmer than the room, and a large casting can take hours to settle. Measuring before the part has stabilised gives a result that describes the part's temperature as much as its size.

Practical rules help: leave parts on a metal surface plate in the measuring room for a set soak time before measuring; keep gauges and masters in the same room; avoid handling parts and gauges longer than necessary; and record the room temperature with each measurement. The soak time can be established once, by measuring a part repeatedly as it cools until the readings stop changing, and then written into the inspection instruction.

## Exercise: check a smaller temperature rise

Using Revision A's nominal lengths and assumed coefficients, calculate the nominal gap at 40 °C, a 20 °C rise from the reference state.

The net change is **0.01368 mm**, so the nominal gap is **2.01368 mm**. This is half the 40 °C-rise change because the model is linear with constant coefficients. The answer would not follow automatically for temperature-dependent properties or changing contacts.

Then write one observation that would invalidate the uniform model. A measured housing temperature of 60 °C with a cartridge still near 25 °C is sufficient. The correct action is to evaluate that condition, not average the two temperatures and retain the old conclusion.
