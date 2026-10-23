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

## Treat the margin as a budget

Revision A leaves 0.02 mm between each worst-case limit and the functional limit. That margin is not spare; it is the only room left for every effect the ideal model excludes. Before anyone claims it, list what might need it:

- **Temperature:** the operating range extends to 60 °C, and Chapter 4 shows how differential expansion moves the gap.
- **Geometry:** perpendicularity, flatness and seating errors can change the effective lengths, as Chapter 5 explains.
- **Measurement:** the uncertainty of the instruments used to accept parts and assemblies, covered in Chapter 6.
- **Process effects:** coatings, burrs and assembly force, which the record lists as excluded.

Each claim on the margin should be explicit and should appear once. A common failure is for each specialist to assume the margin is theirs: the thermal check uses all of it, the geometric review uses it again, and the measurement plan uses it a third time. Writing a small margin ledger, with each effect, its estimated size and its source, prevents the same 0.02 mm being spent three times.

## Understand why the half-widths add

For this linear chain, each input has a sensitivity of either +1 or −1. A worst-case gap half-width therefore equals the sum of the magnitudes of the three component half-widths: **0.06 + 0.04 + 0.03 = 0.13 mm**. The resulting interval is 2.00 ± 0.13 mm.

```figure
type: stack
title: Worst-case half-width of the gap
unit: mm
caption: 2.00 ± 0.13 mm: 1.87 to 2.13 mm, leaving 0.02 mm at each end of the 1.85 to 2.15 mm requirement.
- Housing H | 0.06
- Cartridge C | 0.04
- *Spacer S | 0.03
```

The negative signs in the nominal equation do not make the tolerance contributions cancel. Each internal component can move in the direction that makes the assembly result worse. This distinction between a signed dimension and an unsigned bound should be visible in the worksheet.

If a lever or geometric relationship gives an input a sensitivity other than one, include that sensitivity. For a linear expression Y = 2A − B, a half-width of 0.03 on A contributes 0.06 to the bound on Y. For a nonlinear model, evaluate the appropriate extremes or use an analysis that establishes where the extremes occur; simply adding half-widths may no longer be valid.

## Watch the bound grow with the number of parts

In a linear chain, the worst-case half-width is the sum of the individual half-widths, so it grows with every part added. A chain of three parts with half-widths of 0.05 mm each has a worst-case half-width of 0.15 mm. A chain of five parts with half-widths of 0.03 mm each reaches the same 0.15 mm, even though each part is held more tightly.

```figure
type: bars
title: Worst-case half-width as parts are added
unit: mm
max: 0.2
caption: Each part adds its full half-width to the bound. Fewer parts in the chain often help more than tighter tolerances on each.
- Revision A, three parts | 0.13
- Three parts at ± 0.05 mm | 0.15
- *Five parts at ± 0.03 mm | 0.15
```

That arithmetic is a strong argument for short dimensional chains. Removing a part from the chain, or arranging for two features to be machined in one setting so that they act as a single term, often achieves more than tightening every remaining tolerance. Chapter 7 returns to this when comparing ways to recover margin.

## Run the bound backwards

The same arithmetic can be used in reverse, to find what component tolerances a requirement allows. The functional interval of 1.85 to 2.15 mm has a half-width of 0.15 mm around a 2.00 mm centre. If the whole of that half-width were given to the three components, their half-widths would have to sum to no more than 0.15 mm.

Revision A uses 0.13 mm of it and keeps 0.02 mm in reserve. An equal split of the full 0.15 mm would give 0.05 mm to each part, but equal shares are rarely sensible: the 60 mm housing span is harder to hold than the 6 mm spacer, and a supplier's process may make one feature far cheaper to control than another. Revision A's split of 0.06, 0.04 and 0.03 mm roughly follows the size of each feature.

Working backwards like this is useful early, before drawings are released, because it shows at once whether the requirement is achievable with ordinary processes. If the sum of economical half-widths already exceeds the functional half-width, no amount of later checking will rescue the design; the chain, the requirement or the process has to change. Chapter 7 develops allocation further, including the cost of each choice. At this stage, the backwards check simply confirms that the requirement and the drawings are on speaking terms.

## Do not invent combinations that cannot occur

The calculation assumes the listed limits can vary independently as permitted component dimensions. Physical or drawing relationships can prevent some combinations. Two distances measured from the same machined surface may share a constraint; the length of a single rigid component cannot simultaneously take two inconsistent values.

This does not justify assuming favourable correlation. It requires writing the real dependency. If the same dimension appears twice in an expression with opposite signs, simplify it algebraically before assigning separate variations. Otherwise the stack may double-count a feature that cancels exactly.

Conversely, two nominally identical spacers are two physical parts. Their dimensions need not be identical. Treating both as one shared random variable or one fixed dimension without a reason can understate uncertainty or overstate it, depending on the model.

## Handle asymmetric limits directly

Suppose an alternative spacer is specified as 6.00 mm with a lower deviation of zero and an upper deviation of 0.05 mm. Its permitted interval is 6.00 to 6.05 mm. Retaining Revision A's other dimensions gives:

**Gmin = 59.94 − 52.04 − 6.05 = 1.85 mm.**

**Gmax = 60.06 − 51.96 − 6.00 = 2.10 mm.**

The low end now touches the functional limit. The nominal gap remains 2.00 mm if nominal means the stated basic numbers, but the centre of the permitted gap interval is 1.975 mm. These are different concepts. Do not silently recentre the design merely to make a symmetric spreadsheet template convenient.

```figure
type: range
title: Worst-case gap intervals
unit: mm
min: 1.8
max: 2.2
caption: The asymmetric spacer keeps a 2.00 mm nominal, but the centre of the permitted gap moves to 1.975 mm.
- Functional requirement | 1.85 | 2.15
- Revision A | 1.87 | 2.13
- *Spacer 6.00 +0.05/0 mm | 1.85 | 2.10 | touches the lower limit
```

A zero calculated margin leaves no room for an omitted effect. It also creates difficult measurement decisions at the boundary. This alternative is therefore a different engineering proposition even though every nominal size still looks familiar.

## Rewrite asymmetric limits as a centre and half-width

Any pair of limits can be expressed as a centre and a half-width:

**centre = (upper + lower) / 2, half-width = (upper − lower) / 2**

For the alternative spacer of 6.00 mm +0.05/0, the centre is 6.025 mm and the half-width 0.025 mm. Using centres for every term, the gap centre becomes **60.00 − 52.00 − 6.025 = 1.975 mm**, and the worst-case half-width **0.06 + 0.04 + 0.025 = 0.125 mm**. The interval is 1.975 ± 0.125 mm, or **1.85 to 2.10 mm**, exactly as found from the limits directly.

This form has two advantages. It makes the shift in the centre visible, which the nominal sizes hide, and it prepares the inputs for the statistical model of Chapter 3, which works naturally with centres and spreads. The check that both forms give the same limits is also a cheap test of the worksheet.

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

## Know when the bound is the right answer

A worst-case bound is sometimes criticised as pessimistic, because the chance of every part sitting at its unfavourable limit together may be small. That criticism is valid only when its assumptions are. A bound is often the appropriate basis for acceptance when:

- the consequence of a failure is severe, so even a rare combination matters;
- quantities are small, so there is no population over which unfavourable combinations average out;
- there is no reliable process data to support a statistical model;
- parts come from several suppliers or batches whose distributions may differ or shift;
- the parts are sorted or reworked in ways that can concentrate sizes near the limits.

In those conditions, the bound is not pessimism but the honest result. Where a statistical argument is used instead, it should be presented alongside the bound, so a reviewer can see what has been assumed to close the difference.

## Present the bounds so they can be challenged

A bounds result is most useful when a reviewer can check it quickly. A short summary should give:

1. the requirement identifier, limits and reference state;
2. the equation, with each term's sign and source drawing revision;
3. the minimum and maximum results and the margin at each end;
4. the effects excluded from this calculation and where they will be assessed.

For Revision A, that summary fits in a few lines: GAP-01, 1.85 to 2.15 mm at 20 °C seated and unloaded; G = H − C − S from the listed drawings; worst case 1.87 to 2.13 mm; margin 0.02 mm at each end; temperature, geometry, measurement and process effects open. Anyone reading it knows both what has been shown and what has not.

## Exercise: evaluate a supplier proposal

A supplier proposes widening H from ±0.06 to ±0.08 mm while retaining the other Revision A dimensions. Calculate the new reference-temperature gap range and explain what the result permits.

The half-width becomes **0.08 + 0.04 + 0.03 = 0.15 mm**, giving **1.85 to 2.15 mm**. The ideal dimensional model reaches both functional limits. It does not establish compliance after temperature, geometry and measurement effects are included. A suitable response is to investigate the complete model or change the design, rather than approve the proposal solely because the spreadsheet cells remain inside the limits.

Keep the original bounds as the baseline. The next chapter asks a different question: what a statistical model predicts, and what evidence is needed before using it.
