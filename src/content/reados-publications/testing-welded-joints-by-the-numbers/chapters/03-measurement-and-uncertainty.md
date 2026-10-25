---
book: testing-welded-joints-by-the-numbers
chapterSlug: measurement-and-uncertainty
order: 3
title: "Measurement and uncertainty"
description: "Combine the uncertainties in load, width and thickness into the uncertainty of a stress, see how rough weld surfaces gave Whittemore efficiencies over 100%, and handle results near a limit."
draft: false
---

A test result is a measurement, and every measurement has an uncertainty. The load cell is calibrated to within some tolerance, the micrometer reads to some resolution, and the specimen is never exactly the shape the calculation assumes. Usually the uncertainty is small enough not to matter, and nobody needs to calculate it. Sometimes it decides the answer: when a result lies close to an acceptance limit, or when a measurement is made in a way that biases it, as Whittemore discovered when his rough weld surfaces produced efficiencies of more than 100%.

This chapter combines the uncertainties in a tensile test into the uncertainty of its stress, looks at Whittemore's measurement problem and his solution, and shows how to treat a result close to a limit.

## Where the uncertainty comes from

The ultimate stress of a tensile specimen is σ = F ÷ (w × t), where F is the maximum load, w the width and t the thickness. Each of the three has an uncertainty:

- **load**, from the calibration of the testing machine, often expressed as a percentage of the reading;
- **width and thickness**, from the measuring instrument's resolution and accuracy, and from how uniform the specimen is along its reduced section.

For a quantity calculated by multiplying and dividing, the relative uncertainties combine approximately as the square root of the sum of their squares, provided they are independent.

```figure
type: formula
title: Uncertainty of the hopper specimen's ultimate stress
formula: u(σ) ÷ σ ≈ √[(u(F) ÷ F)² + (u(w) ÷ w)² + (u(t) ÷ t)²]
caption: This is an illustration with assumed standard uncertainties. The expanded uncertainty, at roughly 95% confidence, is about twice the standard uncertainty.
- u(F) ÷ F | load, 1.0%
- u(w) ÷ w | width, 0.05 mm on 25 mm = 0.20%
- u(t) ÷ t | thickness, 0.02 mm on 12 mm = 0.17%
step: u(σ) ÷ σ ≈ √(1.0² + 0.20² + 0.17²) % ≈ 1.03%
step: on 470 MPa: u(σ) ≈ 4.9 MPa, expanded about ±9.7 MPa
```

This is an illustration. For the hopper's 470 MPa specimen, the combined standard uncertainty is about 1.03% of 470, about **4.9 MPa**, and the expanded uncertainty, roughly a 95% interval, is about **±9.7 MPa**. The load dominates: the dimensions, measured carefully with a micrometer and vernier, contribute little. That balance changes completely if the dimensions are measured carelessly or taken from the drawing, as the rest of this chapter shows, because a single dimensional error of a few tenths of a millimetre can exceed the whole calibration uncertainty of the machine. In practice, laboratories estimate their uncertainty from their calibration records and procedures, and accredited laboratories state it on request.

## Whittemore's rough welds

Whittemore's specimens came from oxyacetylene welds left rough as the blowpipe made them, with a lumpy surface and varying thickness. He measured the cross-section with a micrometer at the weld, and found that some specimens, especially from his strip Y, seemed to give over 100% efficiency.

He worked out why. When a weld is rough, the person measuring tends to read the least thickness near the point being measured, because the micrometer's anvils meet the high spots of one face and the low spots of the other unpredictably, and the natural habit is to close the micrometer on the thinnest reading. That gives an area less than the true area, and so a stress, and an efficiency, higher than the truth. The error was a bias, not random scatter: it pushed results consistently upwards.

This is an illustration of the size of such an error. On a specimen about 6 mm thick, under-reading the thickness by 0.5 mm overstates the stress by about 0.5 ÷ 6.35 ≈ 7.9%, enough to turn a 95% efficiency into an apparent 103%.

## Grinding the surface

Whittemore's remedy was to grind the weld surface smooth before measuring and testing, so that the thickness could be measured accurately. He compared the ranges of efficiency in the strips he had ground with those he had left rough. For the unground strips, A, B, F, U and Y, the average range from lowest to highest efficiency within a strip was 39.8 percentage points. For the ground strips, C, D, E, G, H, R and X, it was 22.2 points, only 56% of the unground range.

```figure
type: compare
title: Spread of efficiency within Whittemore's ground and unground strips
cols: Unground (A, B, F, U, Y) | Ground (C, D, E, G, H, R, X)
caption: Average range within a strip as reported by Whittemore. Grinding the weld surface smooth made thickness measurable and roughly halved the apparent scatter, though it introduced the question of what grinding itself did to the weld.
- Number of strips | 5 | 7
- Average range, lowest to highest efficiency | 39.8 points | 22.2 points
- Ground range as share of unground | 100% | 56%
```

Whittemore was careful about his own remedy. Grinding, he noted, introduced another factor whose influence on the welds was unknown, and he suggested that milling the surfaces smooth would be better. That is essentially what modern test standards require, more than a century later: the specimen's reinforcement is machined flush, so that the cross-section is regular and measurable, and the machining is controlled so that it does not damage the specimen.

## Measure the specimen, not the drawing

Whittemore's lesson has a modern form. The area must be calculated from the measured dimensions of each specimen after machining, not from the nominal dimensions on the drawing or the plate thickness on the order. Machining removes metal; plates vary in thickness within their tolerance; and a specimen machined flush may end up a few tenths of a millimetre thinner than the nominal plate.

This is an illustration. A specimen from a nominally 12 mm plate, machined flush on both faces, measures 11.7 mm thick. If its stress were calculated using 12 mm, the stress would be understated by 0.3 ÷ 12 = 2.5%: a true 482 MPa would be reported as 470 MPa. In the other direction, a plate that is thicker than nominal, say 12.3 mm, would have its stress overstated if 12 mm were used.

## Bias and scatter

Measurement errors come in two kinds. Random errors scatter results above and below the true value, and averaging several measurements reduces them. Systematic errors, or bias, push results consistently one way, and averaging does nothing for them: twenty biased measurements average to a biased answer. Whittemore's rough-surface problem was a bias, which is why his unground strips gave apparently higher efficiencies on average as well as wider scatter.

Bias is the more dangerous kind because it is invisible in the results themselves. A set of tightly grouped results looks trustworthy whether or not it is biased. Bias is found by checking against something known: a reference specimen of known strength, a calibration of the machine against a standard load, a comparison between two laboratories testing matched specimens, or, as Whittemore did, a change of method that removes a suspected cause and shows whether the results move.

## Uncertainty in an efficiency

Efficiency divides one measured stress by another, so it carries the uncertainty of both. This is an illustration. If the welded specimen's stress and the plate's average stress each have a relative standard uncertainty of about 1.03%, the efficiency's relative uncertainty is about √(1.03² + 1.03²) ≈ 1.46%. The hopper specimen's 97.9% efficiency is therefore 97.9 ± about 1.4 percentage points at one standard uncertainty, or about ±2.9 points expanded.

That puts the result in perspective. An efficiency of 97.9% is not measurably different from 100%: the difference is within the uncertainty. Reading anything into the 2.1-point shortfall, such as a weakened zone beside the weld, would be over-interpreting the data. By contrast, Whittemore's strip averages of 51% to 82% were far below 100%, by many times any plausible measurement uncertainty, so the weakness they show was real.

## Resolution and rounding

The resolution of an instrument, the smallest change it can show, sets a floor on its uncertainty. A micrometer reading to 0.01 mm resolves thickness to about 0.1% on 12 mm; a testing machine displaying load to 0.1 kN resolves 141.0 kN to about 0.07%. Both are well below the load calibration uncertainty, as they should be.

Rounding can add error if it is done too early. Stresses should be calculated from the unrounded load and dimensions and rounded only for reporting, typically to the nearest megapascal for tensile strength. A report that rounds the area to 300 mm² before dividing has thrown away information that the micrometer provided.

## Specimens that are not uniform

A machined specimen is never perfectly uniform. Its thickness and width can vary slightly along the reduced section, especially if the plates were misaligned or distorted. Test standards specify where and how many times the dimensions are measured. Where the specimen varies, the dimensions at the place where it broke are the relevant ones, which is what Whittemore used: he used the original cross-section measured where the specimen eventually broke. Recording the dimensions at several points before testing makes that possible after the fact.

## Results close to a limit

Uncertainty matters most when a result lies close to an acceptance limit. This is an illustration. Suppose a specimen measures 434 MPa against a requirement of 430 MPa, with an expanded uncertainty of about ±9.7 MPa. The measured result passes, but the true value could plausibly lie anywhere from about 424 to 444 MPa, so the measurement alone cannot show that the true strength exceeds 430 MPa.

How such results are treated is set by the standard or specification. Many test standards compare the measured value directly with the requirement, with the uncertainty built into the method's precision. Some specifications require a guard band, accepting only results that exceed the limit by more than the uncertainty. Either way, a result close to a limit is information: it says the margin is thin, and a procedure whose results sit just above the limit is likely to produce some welds below it. The hopper fabricator treats any qualification result within the expanded uncertainty of a limit as a reason to look at the procedure, even if the result passes.

```figure
type: range
title: A measured 434 MPa against a 430 MPa requirement
unit: MPa
min: 410
max: 460
caption: This is an illustration with an expanded uncertainty of about ±9.7 MPa. The measured value passes, but the interval in which the true value plausibly lies straddles the limit.
- Plausible true value | 424.3 | 443.7 | measured 434 ± 9.7
- *Below the requirement | 410 | 430
```

## Other measurements, same principles

The same thinking applies to every weld test:

- **Hardness**: the size of a Vickers indentation is measured with a microscope, and small errors in reading the diagonals produce larger errors in hardness, because hardness depends on the inverse square of the diagonal (Chapter 6).
- **Impact energy**: Charpy results scatter widely, especially near the transition temperature, so the uncertainty of a single result is large and averages of several specimens are used (Chapter 7).
- **Weld size and imperfection size**: gauges, radiographs and ultrasonic indications all have resolution limits, which decide the smallest imperfection that can be detected and sized (Chapters 8 and 9).

## Reporting a result properly

A test report that lets someone else judge the result gives, for each specimen, the measured dimensions, the maximum load, the calculated stress, the fracture location and a description of the fracture face, together with the testing machine, its calibration status and, where required, the laboratory's accreditation and stated uncertainty. With that information, a reader can check the arithmetic, spot a nominal-dimension error like the one below, and see how close each result came to its limit. A report that gives only "pass" leaves the reader to trust it blindly, which is the opposite of what a test is for.

## A failure: the nominal dimensions

This is an illustration. During the hopper procedure qualification, the laboratory's first report showed transverse specimen T2 failing, at 420 MPa against the 430 MPa requirement, though it had broken in the parent metal, which was surprising for a plate averaging 480 MPa.

The fabricator's engineer asked for the measured dimensions. The laboratory had calculated the stress from the nominal 12 × 25 mm area, 300 mm². The specimen had been machined to 11.6 mm thick to remove a slight misalignment between the plates, so its true area was 11.6 × 25 = 290 mm². With the recorded maximum load of 126.0 kN, the stress on the true area was 126,000 ÷ 290 ≈ **434 MPa**, not 420 MPa.

The laboratory reissued the report with measured dimensions for every specimen, and its procedure was corrected so that the stress is always calculated from dimensions measured on the specimen itself and recorded on the report. The engineer also noted that 434 MPa, while a pass, was close to the limit and well below the plate's average, and that the misalignment that had required extra machining was itself worth correcting in the procedure. A new plate welded with better fit-up gave the results shown in Chapter 2.

## Exercise: a less accurate machine

A workshop testing machine has a load uncertainty of 2.0% instead of 1.0%, with the same dimensional uncertainties. Calculate the relative and absolute standard uncertainty for a 470 MPa result, and the expanded uncertainty. Then calculate how much a thickness error of 0.3 mm on a 12 mm specimen changes the stress, and compare it with the load uncertainty.

The relative uncertainty is √(2.0² + 0.20² + 0.17²) ≈ **2.02%**, which on 470 MPa is about **9.5 MPa**, with an expanded uncertainty of about **±19 MPa**. A thickness error of 0.3 mm on 12 mm is 2.5%, about 12 MPa on 470 MPa.

The single gross error in thickness is larger than the whole standard uncertainty of the less accurate machine. Careful measurement of each specimen matters at least as much as the testing machine's calibration, which is the lesson Whittemore drew from his rough welds more than a century ago.
