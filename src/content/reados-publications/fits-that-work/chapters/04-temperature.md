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

## Investigate temperatures that are not equal

A hot housing around a cool cartridge is a different load case. If Revision A's housing alone reaches 60 °C while the internal members remain at 20 °C, the worst-case gap is:

**60.06 × 1.00092 − 51.96 − 5.97 = 2.1852552 mm.**

This is substantially larger than the uniform-temperature result. It illustrates why the phrase “operating temperature 60 °C” is insufficient when components heat at different rates.

For Revision B, the corresponding value is **2.1452184 mm**, before any geometric contribution. That leaves less than 0.005 mm at the upper limit. The revision therefore cannot be declared suitable for arbitrary temperature gradients on the strength of the uniform analysis.

Map plausible thermal states with the people who understand start-up, shutdown and nearby heat sources. Use measurements or a justified thermal model to establish component temperatures. If different components can independently reach different extremes, evaluate those combinations rather than using one ambient reading for all of them.

## Check whether free expansion is the right model

A restrained member may develop stress instead of freely changing length. Contact may open or close, a polymer may creep, and a preload may change. The linear free-expansion equation does not describe those mechanisms on its own.

Also separate temperature during measurement from temperature during service. Correcting an inspection result to a reference temperature requires information about both the part and the measurement system. A warm part measured by a warm instrument is not automatically self-correcting, particularly when their materials differ.

Keep thermal inputs and assumptions in the design record. A later material substitution can change the result even if all dimensions remain unchanged. “Equivalent strength” does not mean equivalent thermal behaviour.

## Exercise: check a smaller temperature rise

Using Revision A's nominal lengths and assumed coefficients, calculate the nominal gap at 40 °C, a 20 °C rise from the reference state.

The net change is **0.01368 mm**, so the nominal gap is **2.01368 mm**. This is half the 40 °C-rise change because the model is linear with constant coefficients. The answer would not follow automatically for temperature-dependent properties or changing contacts.

Then write one observation that would invalidate the uniform model. A measured housing temperature of 60 °C with a cartridge still near 25 °C is sufficient. The correct action is to evaluate that condition, not average the two temperatures and retain the old conclusion.
