---
title: "Rearranging formulas with confidence: transposition, order of operations and checking the answer"
description: "How to rearrange engineering and business formulas safely, from inverse operations to squares, roots, fractions and variables that appear twice, with checks that catch errors early."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - design
  - quality
  - process-improvement
author: "KEVOS"
featured: false
draft: false
---

Formulas are usually written to calculate one particular quantity. The cutting speed formula gives surface speed from diameter and spindle speed, but a machinist needs spindle speed from the recommended surface speed. The power formula gives power from torque and speed, but a designer choosing a coupling needs torque from the motor's rated power. The stress formula gives stress from force and area, but an engineer sizing a bar needs the area that keeps stress below a limit. In each case, the formula must be **rearranged**, or transposed, to make a different quantity the subject.

Rearranging formulas is one of the most useful skills in technical work and one of the most common sources of error. A single sign slip, a misplaced square root or a division applied to only part of an expression gives an answer that may look plausible but is wrong by a large factor. The errors often survive because they are buried inside a spreadsheet cell or a calculator sequence that nobody checks.

This article explains the principles of rearranging formulas, works through the situations that cause most trouble, including squares and roots, fractions and variables that appear more than once, and sets out checks that catch errors before they reach a drawing, a machine setting or a quote.

## The one rule: keep the balance

A formula is an equation: the left side equals the right side. Whatever is done to one side must be done to the whole of the other side to keep them equal. Rearranging is simply a sequence of such balanced operations, chosen to isolate the quantity wanted.

Each operation has an **inverse** that undoes it:

- addition is undone by subtraction, and subtraction by addition;
- multiplication is undone by division, and division by multiplication;
- squaring is undone by taking a square root, and a square root by squaring;
- an exponential is undone by a logarithm, and a logarithm by an exponential.

To isolate a variable, undo the operations applied to it in the reverse of the order in which they were applied.

## Order of operations

Formulas are evaluated in a standard order: brackets first, then powers and roots, then multiplication and division, then addition and subtraction. The common mnemonic is BODMAS or BIDMAS. When rearranging, it helps to think of how the variable was "built up" in that order and then to unpick it in reverse.

Writing formulas with clear brackets prevents ambiguity. In a spreadsheet, =A1/B1*C1 is evaluated as (A1/B1)×C1, which is not the same as A1/(B1×C1). Many formula errors in spreadsheets come from missing brackets around a denominator.

## Simple rearrangements

### Speed, distance and time

From v = d ÷ t, multiplying both sides by t gives d = v × t, and dividing by v gives t = d ÷ v.

### Stress, force and area

From σ = F ÷ A, the area needed to keep stress at or below an allowable value is A = F ÷ σ. If a tie must carry 20,000 N with an allowable stress of 100 MPa (100 N/mm²), the required area is 20,000 ÷ 100 = 200 mm².

### Cutting speed and spindle speed

Cutting speed in metres per minute is often written as v = π × D × N ÷ 1,000, where D is the diameter in millimetres and N the spindle speed in revolutions per minute. Multiplying both sides by 1,000 and dividing by π × D gives:

N = 1,000 × v ÷ (π × D)

For a 10 mm drill at a recommended 25 m/min, N = 1,000 × 25 ÷ (π × 10) ≈ 796 rpm. The [drilling, reaming and tapping holes](/insights/drilling-reaming-and-tapping-holes/) article explains how cutting speeds are chosen.

## Formulas with constants and units

Many engineering formulas include constants that convert units. Power, torque and speed are related by P = 2 × π × N × T ÷ 60, with P in watts, N in revolutions per minute and T in newton metres. Rearranged for torque:

T = 60 × P ÷ (2 × π × N)

A 5.5 kW motor at 1,450 rpm develops about 60 × 5,500 ÷ (2 × π × 1,450) ≈ 36.2 N·m. Constants such as 60, 1,000 and π must move with the terms they belong to, and the units used must match those assumed in the formula. The [selecting electric motors and drives](/insights/selecting-electric-motors-and-drives/) article applies this relationship to motor selection.

## Squares and square roots

When the wanted variable is squared, isolate the square first and then take the square root of both sides. From P = I² × R (electrical power in a resistance), dividing by R gives I² = P ÷ R, and taking the square root gives I = √(P ÷ R). For 2,000 W in a 50-ohm resistance, I = √40 ≈ 6.32 A.

Two cautions apply. First, the square root applies to the whole expression, not just part of it. Second, a square root has a positive and a negative solution mathematically; in physical problems, the sign is chosen by context, such as a current flowing in a particular direction or a length that must be positive.

## Fractions and reciprocals

Formulas with fractions can be cleared by multiplying both sides by the denominators. Resistances in parallel, and springs in series, follow the pattern:

1 ÷ R = 1 ÷ R1 + 1 ÷ R2

To find R, combine the right-hand side over a common denominator: 1 ÷ R = (R1 + R2) ÷ (R1 × R2). Inverting both sides gives:

R = R1 × R2 ÷ (R1 + R2)

For 100 and 220 ohms in parallel, R = 22,000 ÷ 320 = 68.75 ohms. A common error is to invert each term separately, writing R = R1 + R2, which is the formula for series resistances. Checking that the combined value is less than the smaller of the two, as it must be for parallel resistances, catches that slip.

## Variables that appear twice

Sometimes the wanted variable appears in more than one place. The method is to gather all terms containing it on one side, factor it out and then divide. Consider:

y = (a × x + b) ÷ (x + c)

Multiply both sides by (x + c): y × x + y × c = a × x + b. Move the x terms to one side and the others to the other side: y × x − a × x = b − y × c. Factor out x: x × (y − a) = b − y × c. Divide:

x = (b − y × c) ÷ (y − a)

This form appears in calibration, mixing and rate problems. Note that the result is undefined when y equals a, which is a reminder to consider whether a formula has values where it breaks down.

## Exponentials and logarithms

When the variable is in an exponent, logarithms bring it down. If a quantity grows as A = P × (1 + r)ⁿ, the number of periods to reach A is n = log(A ÷ P) ÷ log(1 + r). Exponential and logarithmic relationships are covered in more detail in the article on growth and decay, but the principle is the same: apply the inverse operation to both sides.

## Thermal expansion: a worked rearrangement

The change in length of a bar with temperature is ΔL = α × L × ΔT, where α is the coefficient of linear expansion. For steel, α is roughly 12 × 10⁻⁶ per °C. A 6 m steel rail warming by 40 °C grows by about 12 × 10⁻⁶ × 6,000 × 40 ≈ 2.9 mm. Rearranged, the temperature change that would close a 2 mm expansion gap in the same rail is ΔT = ΔL ÷ (α × L) = 2 ÷ (12 × 10⁻⁶ × 6,000) ≈ 28 °C. Using the rearranged formula, a designer can check whether a gap is large enough for the expected temperature range.

## Inequalities and limits

Design work often involves limits rather than exact values: stress must not exceed an allowable value, deflection must stay below a limit, cost must stay within a budget. Inequalities rearrange like equations, with one important exception: multiplying or dividing both sides by a negative number reverses the direction of the inequality. In most engineering limits the quantities are positive, so the rule rarely bites, but it matters in calculations involving temperature differences, losses or offsets that can be negative. Writing the limit as an inequality, rearranging it and then checking with numbers on both sides of the limit confirms the direction is right.

## Documenting formulas

Formulas used repeatedly in a business, such as those for machine settings, material quantities, pricing or allowable loads, deserve documentation. A short record of each formula, its source, the units assumed for every term, the range over which it is valid and an example calculation lets others use it correctly and check it later. Where a formula has been rearranged, recording the original form alongside the rearranged one helps reviewers see what was done. This documentation is particularly valuable when the person who built a spreadsheet moves on.

## Checking the rearranged formula

Rearrangements should be checked before they are used:

- **Substitute numbers back.** Choose simple values, calculate the original quantity, then use the rearranged formula to recover the input. If the original formula with x = 4 gives y = 6, the rearranged formula with y = 6 should return x = 4.
- **Check the units.** Every term in a formula must have consistent units, and the result must have the units of the quantity sought.
- **Check limiting cases.** What happens if a quantity is zero or very large? Does the result behave sensibly?
- **Check the size.** Estimate roughly whether the answer should be in tens, hundreds or thousands.
- **Have someone else review** critical rearrangements, especially in spreadsheets used repeatedly.

The [SI units and calculation checking](/insights/si-units-and-calculation-checking/) article explains unit checks and independent verification in more detail.

## Rearranging in spreadsheets

Spreadsheets hide formulas behind results. To reduce errors, put inputs in clearly labelled cells with units, write each formula once and copy it rather than retyping, use brackets generously and include a check cell that substitutes the answer back into the original formula. Goal-seek and solver tools can find a value that satisfies a formula without rearranging it at all, which is a useful cross-check for complex rearrangements.

## A worked example

This is an illustrative example. The figures are hypothetical.

A maintenance planner builds a spreadsheet to set spindle speeds for a range of drills, using N = 1,000 × v ÷ π × D, typed as =1000*B2/PI()*C2. For a 10 mm drill at 25 m/min, the spreadsheet returns about 79,577 rpm, an absurd result that the planner fortunately notices because the drill press's maximum is 3,000 rpm.

The error is missing brackets: the spreadsheet divided by π and then multiplied by D, instead of dividing by the product π × D. Corrected to =1000*B2/(PI()*C2), the result is about 796 rpm. The planner adds a check column that recalculates the cutting speed from the computed rpm using the original formula, v = π × D × N ÷ 1,000, and flags any row where the result does not match the input, and adds a warning when the computed speed exceeds the machine's maximum.

## How this applies to a small Australian business

- **Rearrange formulas on paper first**, step by step, before entering them in software.
- **Use brackets generously**, especially around denominators.
- **Substitute numbers back** to check every rearrangement.
- **Check units and magnitudes** of every result.
- **Add check cells** to spreadsheets used for settings, quotes or design.
- **Have critical formulas reviewed** by a second person before they are relied on.

## Common mistakes

- **Applying an operation to only part of one side.**
- **Missing brackets around denominators** in spreadsheets.
- **Taking a square root of part of an expression.**
- **Inverting a sum term by term.**
- **Losing constants such as 60 or 1,000** during rearrangement.
- **Ignoring values where a formula breaks down**, such as division by zero.

## Frequently asked questions

**What is the safest way to rearrange a complicated formula?** Write each step on a new line, doing one operation to both sides at a time, then check the final form by substituting numbers.

**Is it better to rearrange a formula or use goal seek?** Rearranged formulas are faster, transparent and easier to check. Goal seek is useful for formulas that cannot easily be rearranged and as an independent check of a rearrangement.

**Why do unit constants cause so many errors?** Because they depend on the units assumed by the formula. Changing from minutes to seconds or millimetres to metres without adjusting the constant gives results that are wrong by large factors.

## Questions to ask

- Which of our routine calculations rely on rearranged formulas?
- Are those formulas checked by substitution and unit analysis?
- Do our spreadsheets include check cells and range warnings?
- Who reviews formulas before they are used for machine settings or quotes?
- Where could a missing bracket or unit constant cause a costly error?

## Bringing it together

Rearranging a formula means applying inverse operations to both sides, in reverse order, until the wanted quantity stands alone. Squares need square roots of the whole side, fractions need clearing, variables appearing twice need collecting and factoring, and unit constants must travel with their terms. Substituting numbers back, checking units and magnitudes, using brackets generously and adding check cells to spreadsheets catch most errors before they reach a machine, a drawing or a customer.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
