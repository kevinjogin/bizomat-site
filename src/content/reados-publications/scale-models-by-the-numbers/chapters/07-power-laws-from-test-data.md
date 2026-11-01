---
book: scale-models-by-the-numbers
chapterSlug: power-laws-from-test-data
order: 7
title: "Power laws from test data"
description: "Fit a power law to measured data on logarithmic axes, read the exponent and its uncertainty, test it against theory, and use the fit to set a model's flows without fooling yourself."
draft: false
---

Scaling laws are power laws. Flow through an orifice varies as the square root of the head, drag as the square of the velocity, pump power as the cube of the speed, and every Froude scaling ratio in Chapter 4 is a power of the length scale. When a model produces data, the first question is usually whether it follows the expected power law, and the second is what the exponent actually is. Both questions are answered most simply by plotting on logarithmic axes, where a power law becomes a straight line and its exponent becomes the slope.

This chapter shows how to fit a power law, how to judge the uncertainty of its exponent and how to test that exponent against theory. The running case is a calibration every intake model needs: the orifice plates that measure the flow in the PS-3 model's suction pipes. It ends with a straight line drawn on the wrong axes.

## Why logarithms

A power law y = C xⁿ becomes, after taking logarithms of both sides,

log y = log C + n log x.

That is a straight line with slope n and intercept log C. The transformation does three useful things. It turns a curve into a line, which the eye judges far better. It turns the exponent, the quantity of physical interest, into a slope that a standard straight-line fit estimates directly with a standard error. And it spreads data that span several orders of magnitude evenly across the plot, so that small values are not crushed into a corner.

The base of the logarithm does not matter for the slope, as long as both axes use the same base. Base 10 is convenient because its values are easy to read: log₁₀ 100 = 2 and log₁₀ 1,000 = 3.

```figure
type: formula
title: Fitting a power law as a straight line
formula: y = C × xⁿ   becomes   log y = log C + n × log x
caption: A least-squares straight line through the logarithms gives the exponent as its slope and the coefficient from its intercept. The fit minimises errors in log y, which means relative errors in y.
- n | the exponent: the slope of the line through the logarithms
- C | the coefficient: 10 raised to the intercept, in the units of y per unit of xⁿ
- s | residual standard deviation of log y; 0.001 in log₁₀ is about 0.23% in y
step: Take log₁₀ of every x and y value
step: Fit the straight line log y = a + b log x by least squares
step: Read n = b and C = 10ᵃ, with the standard error of b
step: Plot the residuals against log x and look for a curve or a trend
```

## What the least-squares fit on logarithms assumes

A straight-line fit through logarithms minimises the scatter in log y. Since a difference in logarithms is a ratio, that is the same as minimising relative errors in y. It suits data whose scatter grows in proportion to the value, which is typical of flow measurements, where a 1% uncertainty is 1% at any flow. It does not suit data with a fixed absolute error, such as a level gauge with a ±0.5 mm resolution, where the smallest readings have by far the largest relative error. For those, either weight the fit or keep the smallest readings out of it.

The fit also assumes that the relationship really is a power law over the whole range. If the exponent changes part way along, because the flow changes regime, the straight line averages two different behaviours and describes neither. Chapter 8 deals with that case. The residual plot is the check: residuals that scatter randomly about zero support a single power law, and residuals that curve or trend do not.

Finally, the range of the data controls the precision of the exponent. A slope estimated from data spanning a factor of two in x is far less certain than one spanning a factor of forty. As a working rule, try to cover at least a factor of ten in the variable on the horizontal axis.

## Calibrating the model's orifice plates

This is an illustration. Each PS-3 model suction pipe, 100 mm in bore, contains an orifice plate with a 60 mm sharp-edged hole, a diameter ratio of 0.6. The differential head across it is read on a water manometer in millimetres. Theory says the flow through an orifice varies with the square root of the differential head, Q = C × Δh^0.5, with C depending on the discharge coefficient. Rather than rely on a published coefficient, the laboratory calibrates each plate in place by timing the filling of a weighed tank at six flows from 1.0 to 6.5 L/s.

```figure
type: compare
title: Calibration of the downstream suction pipe's orifice plate
rowhead: Point
cols: Differential head Δh | Measured flow Q | log₁₀ Δh | log₁₀ Q | Residual in log₁₀ Q
caption: Invented calibration data for the illustration, water at 20 °C. The residuals are from the fitted line log₁₀ Q = −0.57786 + 0.49642 log₁₀ Δh and scatter randomly about zero, with no curve.
- 1 | 14.5 mm | 1.00 L/s | 1.1614 | 0 | +0.0013
- 2 | 37.9 mm | 1.60 L/s | 1.5786 | 0.2041 | −0.0017
- 3 | 92.3 mm | 2.50 L/s | 1.9652 | 0.3979 | +0.0002
- 4 | 193.4 mm | 3.60 L/s | 2.2865 | 0.5563 | −0.0009
- 5 | 387.2 mm | 5.10 L/s | 2.5879 | 0.7076 | +0.0008
- 6 | 632.5 mm | 6.50 L/s | 2.8011 | 0.8129 | +0.0003
```

The [linear calibration check tool](/tools/linear-calibration-check/) fits a least-squares straight line to up to eight pairs of reference values and readings, and reports the intercept and slope with their standard errors, the residual standard deviation, the residuals, and the reference value that corresponds to a new reading with its confidence interval. It is built for instrument calibration, but entering the logarithms turns it into a power-law fit. With log₁₀ Δh as the reference values and log₁₀ Q as the readings, it gives:

- intercept a = −0.57786, so C = 10^−0.57786 = **0.2643** L/s per mm^n;
- slope b = **0.49642**, with a standard error of 0.00089;
- residual standard deviation 0.0012 in log₁₀ Q, about 0.28% in flow, with 4 degrees of freedom.

The fitted calibration is therefore Q = 0.2643 × Δh^0.4964, with Q in litres per second and Δh in millimetres. Over the calibrated range it reproduces every point within 0.4%.

## Testing the exponent against theory

The fitted exponent, 0.4964, is close to the theoretical 0.5 but not equal to it. Whether the difference is real depends on the exponent's uncertainty. The tool reports the standard error, 0.00089, and the critical t value for 4 degrees of freedom at 95% confidence, 2.776. The test statistic is (0.49642 − 0.5) ÷ 0.00089 = **−4.03**, larger in size than 2.776. The exponent is significantly below 0.5. (The tool's own slope test compares the slope with 1, the ideal for an instrument calibration; for a power law the comparison with the theoretical exponent is made by hand, as here.)

The physical explanation is a viscous scale effect of the kind Chapter 5 described. An orifice plate's discharge coefficient rises slightly as its Reynolds number falls. At the lowest calibration flow the pipe Reynolds number is about 12,700, at the highest about 82,500, and the plate passes relatively more flow at low heads than a pure square-root law would predict. That flattens the curve, lowering the exponent. The orifice-plate standard, ISO 5167-2, describes this dependence for standard installations; the laboratory's plates, close to valves and bends in a model, are calibrated in place instead.

The practical consequence is small but real. Forcing the exponent to 0.5 and fitting the coefficient through the design point alone would read the lowest flow 1.3% low. That is within some laboratories' tolerance, but it is a systematic error that grows towards the edges of the range, which is exactly where a model's high-flow and low-flow tests are run.

## Using the fit to set the design flow

The model needs its suction pipe at 5.103 L/s for the Froude-scaled design case. Entering log₁₀ 5.103 = 0.7078 as the new reading, the tool inverts the line and gives log₁₀ Δh = 2.5899, so the manometer should read **388.9 mm**, with a 95% calibration interval from 381.9 to 396.1 mm.

The interval looks wide, ±1.8% in head, but because flow varies with roughly the square root of head, it corresponds to about ±0.9% in flow. That is the uncertainty in setting the model's flow from this calibration, and it belongs in the test report beside the Froude number it implies.

```figure
type: compare
title: How the data range controls the exponent's uncertainty
rowhead: Points used
cols: Flow range | Fitted exponent | Standard error | 95% interval for the exponent
caption: The same calibration fitted with all six points and with only the top three. With a range of 1.8 in flow and a single degree of freedom, the interval is more than eleven times wider and cannot distinguish 0.497 from 0.5.
- * All six | 1.0 to 6.5 L/s (6.5 ×) | 0.4964 | 0.00089 | 0.4939 to 0.4989
- Top three only | 3.6 to 6.5 L/s (1.8 ×) | 0.4989 | 0.00224 | 0.4703 to 0.5274
```

The comparison shows why calibrations should span the full operating range and more. With only the top three points, the exponent is estimated almost as well in the middle of its range, but the uncertainty is so large that the fit cannot tell whether the plate follows the theoretical law, and the line's behaviour at low flows would be unknown.

## The error: a straight line on linear axes

This is an illustration. Before the laboratory adopted logarithmic fits, a technician calibrated an earlier set of plates by fitting a straight line to flow against differential head on ordinary axes. Applied to the data above, that gives Q = 1.439 + 0.008592 × Δh. It has a respectable-looking correlation, and at the design point it reads 4.77 L/s instead of 5.10, 6.6% low.

The error showed itself in two ways. The fitted line says that at zero differential head the flow is 1.44 L/s, which is impossible: no head, no flow. And at the lowest calibration point, 14.5 mm, it predicts 1.56 L/s against a measured 1.00 L/s, 56% high. The residuals on linear axes formed a clear arch, positive at both ends and negative in the middle, the signature of a curve fitted with a straight line.

```figure
type: line
title: The orifice calibration on linear axes, measured and with a straight-line fit
x: Differential head, mm
y: Flow, L/s
legend: Measured | Straight-line fit on linear axes
caption: The measured points follow a square-root curve. A straight line on linear axes misses the curve at both ends and implies 1.44 L/s at zero head; on logarithmic axes the same data fit a straight line within 0.4%.
- 14.5 | 1.00 | 1.56
- 37.9 | 1.60 | 1.76
- 92.3 | 2.50 | 2.23
- 193.4 | 3.60 | 3.10
- 387.2 | 5.10 | 4.77
- 632.5 | 6.50 | 6.87
```

Earlier runs that had used that calibration were rechecked, and the low-flow cases were rerun. The laboratory's calibration procedure now requires a residual plot for every fit, a check of the fitted line at zero for any quantity that must pass through zero, and a fit on logarithmic axes for any relationship expected to follow a power law.

## Laws that are not power laws

Not every relationship is a power law, and logarithmic axes are not the only way to straighten a curve. The general idea is to transform one or both variables so that the expected relationship becomes a line, then fit the line and check its residuals.

- **Exponential decay or growth**, such as a temperature approaching ambient or a swirl decaying along a pipe, becomes a straight line when the logarithm of the quantity is plotted against the ordinary variable, a semi-logarithmic plot. The slope is the decay rate.
- **A square-root law in time**, such as the storage tank's level, becomes straight when the square root of the level is plotted against time. Torricelli's law makes √H fall at a steady rate as the tank empties.
- **A sum of a power law and a constant**, such as a measured pressure with an instrument offset, is not straightened by logarithms at all, and the offset must be removed first or fitted separately.

The storage tank gives a neat check of the second case. In the prototype, √H falls from √3.0 = 1.732 to √0.3 = 0.548 m^½ in 356.6 s, a slope of 0.003322 m^½ per second. In the model, √H falls from √0.5 = 0.707 to √0.05 = 0.224 m^½ in 145.6 s, a slope of 0.003322 m^½ per second, the same. That is not a coincidence. The slope has dimensions L^½ T⁻¹, and under Froude scaling both a length to the power ½ and a time scale as L_r^½, so their ratio is the same at every scale. A model drain test that gives a different slope from the scaled prototype prediction is telling the laboratory that its outlet's discharge coefficient differs from the one assumed, which is useful information in its own right.

## Extrapolation

A fitted power law is a description of the data within its range. Using it outside the range assumes that nothing changes, and in flow problems things often do. The PS-3 calibration covers 1.0 to 6.5 L/s, but the 1.5 times Froude-scaled runs need 7.66 L/s, beyond the highest point. The fit predicts a differential head of 880 mm for that flow, and the extrapolation is short and the physics unlikely to change over it, so the error is probably small. The laboratory nevertheless added two calibration points at 7.5 and 8.0 L/s before the high-flow runs, which cost an hour and removed the question.

Longer extrapolations are where power laws mislead. Scaling a model's measured head loss to prototype size assumes the exponent holds over a fourteen-fold rise in Reynolds number, which it often does not. Chapter 8 shows what happens when the data cross from one regime to another.

## How this applies to a small Australian business

Power laws appear in many workshop tests: a fan's pressure against flow, a spring's force against compression beyond its linear range, a tool's wear against cutting speed, a part's cooling time against wall thickness. Fitting them on logarithmic axes takes a spreadsheet and a few minutes, and gives an exponent that can be compared with theory and a standard error that says how far to trust it. The two checks that matter most cost nothing: plot the residuals, and look at what the fit says at zero.

## Exercise: the second plate

The upstream suction pipe's plate is calibrated the same way, and its fit gives log₁₀ Q = −0.5743 + 0.4970 log₁₀ Δh, with a standard error of the slope of 0.0011 and 4 degrees of freedom. What differential head sets the design flow of 5.103 L/s, and is its exponent significantly different from 0.5 at 95% confidence?

**Worked answer.** log₁₀ Δh = (log₁₀ 5.103 + 0.5743) ÷ 0.4970 = (0.7078 + 0.5743) ÷ 0.4970 = 1.2821 ÷ 0.4970 = 2.5797, so Δh = 10^2.5797 = **379.9 mm**. The test statistic is (0.4970 − 0.5) ÷ 0.0011 = **−2.73**, smaller in size than the critical 2.776, so at 95% confidence this plate's exponent is **not** significantly different from 0.5, though only just. Both plates are still used with their own fitted calibrations, since fitting the exponent costs nothing and removes a possible bias.
