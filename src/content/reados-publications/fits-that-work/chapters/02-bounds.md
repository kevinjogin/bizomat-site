---
book: fits-that-work
chapterSlug: calculate-the-dimensional-bounds
order: 2
title: "Calculate the dimensional bounds"
description: "Build and check a signed worst-case tolerance stack, distinguish half-widths from total tolerances and test asymmetric limits without hidden assumptions."
draft: false
---

The first dimensional calculation should answer a direct question: can every permitted combination of component sizes satisfy the assembly limit under the stated model? This is a bounds question. It does not require a probability distribution or a claim about how frequently a supplier reaches a limit.

Bounds are particularly useful when the consequence of an unfavourable combination matters more than its expected frequency. They also provide a transparent baseline before statistical arguments enter the discussion. A later proposal to accept some risk can then be compared with a known deterministic result.

## List limits before doing arithmetic

This is an illustration using the stop-cartridge assembly. The initial design, called Revision A in the teaching record, has the following dimensions at 20 °C:

| Term | Nominal size | Bilateral half-width | Lower limit | Upper limit |
|---|---:|---:|---:|---:|
| Housing span H | 60.00 mm | 0.06 mm | 59.94 mm | 60.06 mm |
| Cartridge C | 52.00 mm | 0.04 mm | 51.96 mm | 52.04 mm |
| Spacer S | 6.00 mm | 0.03 mm | 5.97 mm | 6.03 mm |

The total tolerance width on H is 0.12 mm. Its half-width is 0.06 mm. Mixing these quantities is a common source of a factor-of-two error. Record actual upper and lower limits even when the drawing uses a plus/minus notation.

The nominal gap is **60.00 − 52.00 − 6.00 = 2.00 mm**. To minimise the gap, use the smallest housing span and the largest internal components. To maximise it, reverse those choices.

**Gmin = 59.94 − 52.04 − 6.03 = 1.87 mm.**

**Gmax = 60.06 − 51.96 − 5.97 = 2.13 mm.**

Both lie inside the assumed functional interval of 1.85 to 2.15 mm. The remaining margin is **0.02 mm at each end**, within this model and reference state. That is a small amount available for effects not yet included; it is not a general assurance that the assembly will work.

## Understand why the half-widths add

For this linear chain, each input has a sensitivity of either +1 or −1. A worst-case gap half-width therefore equals the sum of the magnitudes of the three component half-widths: **0.06 + 0.04 + 0.03 = 0.13 mm**. The resulting interval is 2.00 ± 0.13 mm.

The negative signs in the nominal equation do not make the tolerance contributions cancel. Each internal component can move in the direction that makes the assembly result worse. This distinction between a signed dimension and an unsigned bound should be visible in the worksheet.

If a lever or geometric relationship gives an input a sensitivity other than one, include that sensitivity. For a linear expression Y = 2A − B, a half-width of 0.03 on A contributes 0.06 to the bound on Y. For a nonlinear model, evaluate the appropriate extremes or use an analysis that establishes where the extremes occur; simply adding half-widths may no longer be valid.

## Do not invent combinations that cannot occur

The calculation assumes the listed limits can vary independently as permitted component dimensions. Physical or drawing relationships can prevent some combinations. Two distances measured from the same machined surface may share a constraint; the length of a single rigid component cannot simultaneously take two inconsistent values.

This does not justify assuming favourable correlation. It requires writing the real dependency. If the same dimension appears twice in an expression with opposite signs, simplify it algebraically before assigning separate variations. Otherwise the stack may double-count a feature that cancels exactly.

Conversely, two nominally identical spacers are two physical parts. Their dimensions need not be identical. Treating both as one shared random variable or one fixed dimension without a reason can understate uncertainty or overstate it, depending on the model.

## Handle asymmetric limits directly

Suppose an alternative spacer is specified as 6.00 mm with a lower deviation of zero and an upper deviation of 0.05 mm. Its permitted interval is 6.00 to 6.05 mm. Retaining Revision A's other dimensions gives:

**Gmin = 59.94 − 52.04 − 6.05 = 1.85 mm.**

**Gmax = 60.06 − 51.96 − 6.00 = 2.10 mm.**

The low end now touches the functional limit. The nominal gap remains 2.00 mm if nominal means the stated basic numbers, but the centre of the permitted gap interval is 1.975 mm. These are different concepts. Do not silently recentre the design merely to make a symmetric spreadsheet template convenient.

A zero calculated margin leaves no room for an omitted effect. It also creates difficult measurement decisions at the boundary. This alternative is therefore a different engineering proposition even though every nominal size still looks familiar.

## Make the worksheet checkable

Keep units in the input table. Include the drawing revision, source of each limit and the sign of its contribution. Protect formula cells where the software allows it, but do not rely on protection as proof of correctness. A protected incorrect formula remains incorrect.

Check one deliberately unfavourable combination by hand. Then perturb each input separately and confirm that the result moves in the expected direction. Finally, compare the output against an independent limiting calculation.

This small Python example reproduces all eight corners of the original three-dimensional input box. It requires only the standard library:

```python
from itertools import product

H = (59.94, 60.06)
C = (51.96, 52.04)
S = (5.97, 6.03)
gaps = [h - c - s for h, c, s in product(H, C, S)]
print(f"{min(gaps):.3f}, {max(gaps):.3f}")
# Expected: 1.870, 2.130
```

Corner enumeration is exact here because the function is linear over independent bounded intervals. It is not a universal optimiser. A nonlinear function can have an extreme inside a region, and a physical constraint may make part of the input box impossible.

## Keep arithmetic precision separate from evidence

Carry enough digits to avoid rounding across a limit, then report the result at a useful precision. Binary floating-point arithmetic may produce 1.869999999999997 rather than 1.87. That numerical representation is not a manufacturing error. Use a justified numerical tolerance in software comparisons and preserve the unrounded values during engineering review.

More significant figures do not improve uncertain inputs. If a component limit came from an unconfirmed email, a six-decimal answer still depends on that unconfirmed email. Record unresolved inputs beside the result.

## Exercise: evaluate a supplier proposal

A supplier proposes widening H from ±0.06 to ±0.08 mm while retaining the other Revision A dimensions. Calculate the new reference-temperature gap range and explain what the result permits.

The half-width becomes **0.08 + 0.04 + 0.03 = 0.15 mm**, giving **1.85 to 2.15 mm**. The ideal dimensional model reaches both functional limits. It does not establish compliance after temperature, geometry and measurement effects are included. A suitable response is to investigate the complete model or change the design, rather than approve the proposal solely because the spreadsheet cells remain inside the limits.

Keep the original bounds as the baseline. The next chapter asks a different question: what a statistical model predicts, and what evidence is needed before using it.
