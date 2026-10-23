---
book: fits-that-work
chapterSlug: use-statistics-without-losing-the-limits
order: 3
title: "Use statistics without losing the limits"
description: "Compare worst-case and statistical stacks, test distribution and correlation assumptions, and recognise why a drawing tolerance is not a standard deviation."
draft: false
---

A worst-case stack can look conservative when most production lies near the middle of each component tolerance. That observation may justify investigating a statistical model. It does not justify replacing the sum of tolerances with a square root and calling the assembly proven.

A statistical stack predicts variation under assumptions about populations and their relationships. The useful engineering question is whether those assumptions describe the parts that will actually be assembled, including changes between suppliers, batches, machines and time periods.

## Begin with a population model

Let H, C and S now represent varying component dimensions. The gap still follows G = H − C − S. Its mean is the mean housing span minus the two mean internal lengths. If the three variables are independent, its variance is the sum of their variances.

For this illustration only, assume each Revision A component is normally distributed, centred on its nominal dimension, and has a standard deviation equal to one-third of its drawing half-width. These are invented process assumptions. They cannot be inferred from the drawing.

| Input | Assumed mean | Assumed standard deviation |
|---|---:|---:|
| H | 60.00 mm | 0.060 / 3 = 0.020000 mm |
| C | 52.00 mm | 0.040 / 3 = 0.013333 mm |
| S | 6.00 mm | 0.030 / 3 = 0.010000 mm |

The predicted gap standard deviation is:

**sG = √(0.020000² + 0.013333² + 0.010000²) = 0.026034 mm**, approximately.

Three times this value is about 0.078102 mm. A mean-plus-or-minus-three-standard-deviations interval is therefore approximately **1.921898 to 2.078102 mm**. This is narrower than the worst-case interval of 1.87 to 2.13 mm, but it is a different kind of statement.

Normal distributions have unbounded tails. This model even permits some individual component sizes outside the drawing limits. If incoming inspection removes those parts, the accepted population is truncated and must be modelled accordingly. Neither the normal model nor its three-standard-deviation interval guarantees that every assembly conforms.

## Ask where the standard deviations came from

The table above uses standard deviations invented for teaching. In a real project, each one must come from somewhere, and its source decides how much weight the statistical result can carry. Useful questions include:

- **Which process produced the data?** The same machine, tooling, material and supplier that will make production parts, or a prototype route?
- **Over what period?** A short run of consecutive parts usually shows less variation than months of production with tool changes, maintenance and seasonal temperature swings.
- **Was the process stable?** A standard deviation describes a population only if the process behaved consistently while the data were collected. A control chart or a simple run plot of the measurements in time order answers this better than a single summary number.
- **Was the measurement adequate?** If the measurement uncertainty is a large fraction of the observed spread, the data describe the gauge as much as the parts. Chapter 6 develops this.
- **How many parts?** A standard deviation estimated from ten parts is itself uncertain; the true value could easily be noticeably larger.

A first-article inspection report, however careful, shows that one part conformed. It does not supply a standard deviation. A supplier's capability claim should come with the data, period and conditions behind it.

It also helps to distinguish short-term from long-term variation. A standard deviation calculated from consecutive parts made in one setting describes how repeatable the process is over minutes. One calculated from parts sampled across weeks includes tool wear, re-setting, material lots and operator changes, and is almost always larger. A stack that uses short-term values to predict long-term assembly performance will look better than reality. Which one belongs in the model depends on the question: a single batch assembled at once, or a product built continuously over years. The model's record should say which was used and why.

## Test the interpretation of a tolerance

Suppose instead that every value inside each component's drawing limits is equally likely, with independent uniform distributions. A uniform variable on a symmetric interval with half-width t has standard deviation t / √3. The gap standard deviation would then be:

**√((0.06² + 0.04² + 0.03²) / 3) = 0.045092 mm**, approximately.

The dimensions and limits have not changed. The statistical answer has changed because the assumed populations changed. This is why assigning “tolerance divided by three” automatically is not an innocent spreadsheet convention.

In the uniform model, all possible gap values still lie inside 1.87 to 2.13 mm. Three times the calculated standard deviation is approximately 0.13528 mm, slightly larger than the 0.13 mm physical half-width. A three-sigma interval is not a universal statement about possible values. Its interpretation depends on the distribution.

```figure
type: range
title: Worst-case and statistical intervals
unit: mm
min: 1.84
max: 2.16
caption: A statistical interval describes an assumed population; it is a different kind of statement from a worst-case bound.
- Worst-case bound | 1.87 | 2.13
- Normal model, ±3 standard deviations | 1.922 | 2.078
- *Uniform model, ±3 standard deviations | 1.865 | 2.135 | wider than the physical bound
```

The purpose of this comparison is to expose assumptions, not to recommend uniform distributions whenever data are missing. When evidence is weak, retain the deterministic bounds and identify what data would make a probabilistic decision credible.

## Include correlation with the right sign

Independence is often convenient and sometimes wrong. Components machined on the same equipment, measured against a shared reference or selected from matched batches can vary together.

For the signed gap model, the full variance expression is:

**Var(G) = Var(H) + Var(C) + Var(S) − 2Cov(H,C) − 2Cov(H,S) + 2Cov(C,S).**

Covariance describes joint variation. Positive correlation between C and S increases gap variation because both lengths enter with the same negative sign. Positive correlation between H and C can reduce it because their signs are opposite. A reduction is legitimate only when the dependency is real, measured and maintained.

In the normal teaching model, assume only C and S have correlation 0.6. The additional variance is **2 × 0.6 × 0.013333 × 0.010000 ≈ 0.000160 mm²**. The resulting gap standard deviation is approximately **0.028944 mm**, and three standard deviations are approximately **0.086833 mm**.

This does not establish that correlation is 0.6 in any factory. It shows why a recorded assembly pairing and a source for the covariance matter. Randomly shuffling one column of data before calculation would destroy the pairing and change the answer.

## Separate centring from spread

A narrow process can be consistently in the wrong place. Suppose the housing mean shifts upward by 0.03 mm and the cartridge mean shifts downward by 0.01 mm, while the spacer mean remains unchanged. The mean gap becomes:

**60.03 − 51.99 − 6.00 = 2.04 mm.**

```figure
type: stats
title: Spread, correlation and centring
caption: A tight spread cannot compensate for a process that is consistently in the wrong place.
- 0.026 mm | Gap standard deviation | independent normal inputs
- 0.029 mm | With C and S correlated at 0.6
- *2.04 mm | Mean gap after shifts | H up 0.03, C down 0.01
```

Its standard deviation need not change. Reporting only a smaller spread would hide the reduced upper-side margin. Tool offsets, cavity differences and thermal conditions can move means without producing dramatic scatter in a short sample.

Keep mean and variation estimates tied to the period and process conditions that produced them. A pooled dataset can be wide because several stable populations have different means. Alternatively, a pooled average can conceal a continuing drift. Examine sequence and groups before treating all observations as interchangeable.

## Translate the model into a predicted nonconformance

A statistical model earns its place when it answers a decision question, such as how many assemblies are expected to fall outside the functional limits. For the centred normal model, the limits of 1.85 and 2.15 mm lie 0.15 mm, or about **5.76 standard deviations**, from the 2.00 mm mean. The normal model then predicts about **4 assemblies in a billion** beyond each limit.

If the means shift so that the gap centre moves to 2.04 mm, as in the example above, the upper limit is only 0.11 mm away, about **4.23 standard deviations**. The predicted fraction above it rises to about **12 in a million**, roughly three thousand times higher, even though the spread has not changed at all.

```figure
type: compare
title: Predicted fraction above the upper limit, normal model
cols: Distance to 2.15 mm | Predicted fraction above
caption: The same spread of 0.026 mm. Moving the centre by 0.04 mm raises the predicted fraction about three thousand times.
- Gap centred at 2.00 mm | 5.76 standard deviations | About 4 in a billion
- *Gap centred at 2.04 mm | 4.23 standard deviations | About 12 in a million
```

These figures are only as good as the model's tails, which are exactly where real distributions most often depart from the normal shape. They are useful for comparing options and for showing sensitivity to centring. They should not be quoted as an expected field failure rate without evidence that the tails behave as assumed.

## Capability indices for the assembly

The same comparison is often expressed with capability indices. For the gap, using the functional limits as the specification:

- **Cp = (2.15 − 1.85) / (6 × 0.026034) ≈ 1.92**, which compares the permitted width with the spread and ignores the centre.
- **Cpk** takes the nearer limit. Centred at 2.00 mm, it equals Cp. Centred at 2.04 mm, it falls to **0.11 / (3 × 0.026034) ≈ 1.41**.

The indices summarise the same information as the predicted fractions, and they carry the same assumptions: a stable process, a known distribution shape and a measurement system that does not distort the data. A high index computed from a short, unrepresentative sample is a common source of false confidence. Chapter 8 returns to capability when the pilot build produces real data.

## Mixed populations break the bell curve

Suppose the housing is made on two machines, half on each. Each machine is stable with a standard deviation of 0.012 mm, but one runs centred at 59.98 mm and the other at 60.02 mm. Pooled together, the housing population has two humps, not one bell. Its overall standard deviation is:

**√(0.012² + 0.02²) ≈ 0.0233 mm**

slightly larger than the 0.020 mm assumed in the teaching model, and the shape is no longer normal. Using the pooled value in the gap calculation gives a gap standard deviation of about 0.0287 mm, but the normal tail predictions built on it would be unreliable, because the real distribution has a flatter top and sharper sides.

The practical response is to keep the machines, cavities or suppliers separate in the data, check whether each is stable on its own, and model the assembly with the real mixture or with each source separately. Recording which machine made each part, and which parts went into each assembly, is what makes that possible.

## Inspection changes the population

If parts outside the drawing limits are found and removed before assembly, the population that reaches the assembly is truncated at the limits. For a capable process, almost nothing is removed and the effect on the model is negligible. For a process that cannot hold the tolerance, sorting removes the tails but leaves a population crowded towards the limits, which behaves more like the uniform model above than the normal one.

That has an uncomfortable consequence. A supplier who sorts an incapable process can deliver parts that all conform to the drawing, yet whose spread is wider than any statistical stack assumed. Asking whether the parts are made capable or made and sorted is therefore a legitimate engineering question, not a commercial intrusion.

## Use simulation to inspect a model

A simulation is useful for investigating nonlinear relationships, selection rules or mixed populations. It is not evidence that its input distributions are correct. Record the random seed, number of trials, units, distributions, dependencies and acceptance rule.

Check the code against a case with a known answer before trusting a complicated model. For the present linear normal case, the simulated mean and standard deviation should approach the analytical values as the trial count grows. An unexplained disagreement is a debugging signal.

Do not report a precise failure rate when no failures occurred in a finite run. Zero observed failures in a simulation or trial is not a proof of zero probability. A rare-event claim needs an appropriate statistical method and evidence about the model itself.

## Check a simulation against a known answer

A short simulation of the independent normal model should reproduce the analytical standard deviation. This example uses only the Python standard library and a fixed seed, so the result can be repeated:

```python
import random, statistics

random.seed(1)
gaps = [random.gauss(60.00, 0.020) - random.gauss(52.00, 0.013333)
        - random.gauss(6.00, 0.010) for _ in range(200_000)]
print(f"{statistics.mean(gaps):.4f} {statistics.stdev(gaps):.5f}")
# Expect values close to 2.000 and 0.0260
```

If the printed standard deviation does not come out close to 0.0260 mm, the code has an error, such as a wrong sign or a half-width used in place of a standard deviation. Only after this check does it make sense to extend the simulation to correlation, mixtures or inspection rules, where no simple formula exists to check against.

## Exercise: challenge a favourable result

A report says, “The stack is acceptable because RSS is 0.078 mm.” List the information missing from that statement.

At minimum, ask what RSS represents, which component standard deviations were used, how means were estimated, whether the inputs are independent, what distributional assumptions apply, which operating state was modelled, and what level of nonconformance is acceptable. Also ask whether inspection or selective assembly changes the input population.

For a numerical check, recalculate the mean gap after H increases by 0.02 mm and S increases by 0.01 mm. The mean increases by **0.01 mm**, because the contributions have opposite signs. A tighter statistical spread cannot compensate automatically for that shift.

Keep the deterministic and statistical results beside each other. The next chapter adds a physical effect that neither reference-temperature result has yet addressed.
