---
book: reference-class-forecasting-by-the-numbers
chapterSlug: forecasting-by-component
order: 8
title: "Forecasting by component: simulation and correlation"
description: "Bay 4 forecast part by part: component shares, a 10,000-run bootstrap giving P80 A$2.958m, a fully correlated A$3.027m, and why neither simply replaces the A$3.379m."
draft: false
---

The whole-class forecast of Chapters 4 and 5 treats Bay 4 as a typical member of the business's 24 past projects and reads its P80 at A$3.379m. That is the right starting point, and its great strength is that it needs no model: it is simply what happened to similar projects. But Bay 4 is not a typical member. It is heavy in machines, the thinnest-tailed work the business does, and light in software, the fattest. This chapter forecasts Bay 4 component by component, combines the components with a simple resampling simulation, shows how much the answer depends on whether the components go wrong together, and sets out which result to use for what.

The method is no harder than a spreadsheet with a random-number column. The judgement is in knowing what the simulation can and cannot see.

## Why Bay 4 differs from the class

This is an illustration. Bay 4's base cost of A$2.28m, excluding GST, is 37.7% building, 43.9% machines, 12.3% automation and 6.1% software and network. The class is weighted differently. Each past project counts once in the whole-class percentiles, whatever its size, so the class's effective mix is its mix by count: 8 building projects, 7 machine projects, 5 automation projects and 4 software projects, or 33.3%, 29.2%, 20.8% and 16.7%. A software project of A$95k moves the whole-class P80 as much as a machining centre of A$890k.

Chapter 6 showed how different the subclasses are: machines with a mean ratio of 1.020 and a worst of 1.08, software with a mean of 1.785 and a worst of 2.60. A project that is 44% machines and 6% software should, other things equal, expect a narrower and lower distribution than a project drawn at random from the class. Forecasting by component tests how much narrower.

## Giving each component its share of the budget

The class's cost ratios were measured against approved budgets that included each project's contingency, as Chapter 5 stressed. To apply a subclass ratio to a component, the component must carry its share of Bay 4's approved budget, not just its base cost. The simplest rule spreads the A$120k contingency in proportion to the base costs, so each component's share is its base × 2,400 ÷ 2,280.

```figure
type: stack
title: Bay 4's approved budget of A$2.40m split by component
unit: A$'000
caption: This is an illustration. Each share = base cost × 2,400 ÷ 2,280, so the A$120k contingency is spread pro rata across the four components.
- Building, base A$860k | 905.3
- Machines, base A$1,000k | 1052.6
- Automation, base A$280k | 294.7
- Software and network, base A$140k | 147.4
```

Each share is then multiplied by its subclass percentiles, read with PERCENTILE.INC as before.

```figure
type: compare
title: Component forecasts from the subclasses
cols: Projects in subclass | Approved share | P50 ratio | P50 | P80 ratio | P80
caption: This is an illustration. The subclasses hold four to eight projects, so each percentile rests on very few outcomes. Column totals: P50 A$2,739k and P80 A$3,029k.
- Building | 8 | A$905.3k | 1.155 | A$1,046k | 1.282 | A$1,161k
- Machines | 7 | A$1,052.6k | 1.020 | A$1,074k | 1.046 | A$1,101k
- Automation | 5 | A$294.7k | 1.270 | A$374k | 1.496 | A$441k
- * Software and network | 4 | A$147.4k | 1.665 | A$245k | 2.210 | A$326k
```

The component P80s add to 1,161 + 1,101 + 441 + 326 = A$3,029k. It is tempting to call that the project's P80. It is not, for a reason that matters more as projects get bigger.

## Why percentiles do not add

The P80 of each component is a value it stays under four times in five. For the sum of the four to exceed the sum of their P80s, the components would all have to be bad together. If they go wrong independently, a bad outcome in one is usually partly offset by ordinary outcomes in the others, and the project total is less extreme than the sum of the component extremes. Adding P80s is correct only in the special case where the components always land at the same percentile at once: when the building is at its P80, so are the machines, the automation and the software.

So the honest answer depends on how the components are related, and the subclasses alone cannot say. The way through is to compute the project total under explicit assumptions about that relationship, and the easiest way to compute it is to simulate.

## The bootstrap, by hand

The **bootstrap**, introduced by Efron (1979), estimates a distribution by resampling the observed data. Applied here, one simulated Bay 4 is built by drawing one past project at random from each subclass, applying its ratio to that component's share, and adding the four results. Each past project is equally likely to be drawn, and drawing is with replacement, so the same project can be drawn again in the next run. Repeat thousands of times, sort the totals and read the percentiles.

This is an illustration of three runs.

```figure
type: compare
title: Three simulated outcomes for Bay 4
cols: Building | Machines | Automation | Software | Total
caption: This is an illustration. Each run draws one past project per subclass and applies its ratio to the component's share. Run 2 shows a software disaster diluted by good draws elsewhere.
- Run 1 | P15, 1.24: A$1,122.5k | P13, 1.03: A$1,084.2k | P14, 1.45: A$427.4k | P17, 1.21: A$178.3k | A$2,812.4k
- Run 2 | P06, 1.06: A$959.6k | P16, 0.97: A$1,021.1k | P09, 1.11: A$327.2k | P05, 2.60: A$383.2k | A$2,690.9k
- * Run 3 | P08, 1.52: A$1,376.0k | P20, 1.08: A$1,136.8k | P18, 1.68: A$495.2k | P21, 1.95: A$287.4k | A$3,295.4k
```

Run 2 contains the worst software outcome the business has had, a ratio of 2.60, and still totals less than run 1, because the building, machines and automation all drew good projects. Run 3 drew the worst building, machine and automation projects and the second-worst software project, and reached A$3,295.4k. Three runs prove nothing; ten thousand show the shape.

With 8 × 7 × 5 × 4 = 1,120 equally likely combinations, Bay 4's independent bootstrap can also be computed exactly by listing every combination. Doing so gives a P50 of A$2,784k, a P80 of A$2,955k and a P90 of A$3,054k, within a few thousand dollars of the 10,000-run simulation below. That is a useful check that the simulation has been set up correctly. Larger projects with more components quickly have too many combinations to list, which is why simulation is the general method.

The whole calculation fits in a few lines of JavaScript. A spreadsheet does the same with one row per run: for each component, `=INDEX(ratios, RANDBETWEEN(1, ROWS(ratios)))` picks a past ratio, the row adds the four shares multiplied by their draws, and PERCENTILE.INC reads the column of totals.

```js
// Independent bootstrap for Bay 4 (A$k). Ratios are each subclass's recorded cost ratios.
const share = { building: 905.263, machines: 1052.632, automation: 294.737, software: 147.368 };
const ratios = {
  building: [1.13, 1.06, 1.52, 0.92, 1.24, 1.10, 1.18, 1.31],
  machines: [1.02, 0.99, 1.00, 1.05, 1.03, 0.97, 1.08],
  automation: [1.27, 1.11, 1.45, 1.68, 1.15],
  software: [2.60, 1.38, 1.21, 1.95],
};
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const runs = Array.from({ length: 10000 }, () =>
  Object.keys(share).reduce((sum, k) => sum + share[k] * pick(ratios[k]), 0)).sort((a, b) => a - b);
const pct = (p) => { const h = (runs.length - 1) * p, i = Math.floor(h); return runs[i] + (h - i) * (runs[i + 1] - runs[i]); };
console.log(pct(0.5), pct(0.8), pct(0.9)); // about 2,783, 2,958 and 3,053
```

## What the simulation shows

The case's simulation used 10,000 runs with a fixed random seed so that its results can be reproduced. This is an illustration. Assuming the components are independent, Bay 4's P50 is **A$2,783k**, its P80 **A$2,958k** and its P90 **A$3,053k**, with a mean of A$2,800k. In 99.3% of runs the total exceeded the inside-view budget of A$2.40m.

The **fully correlated** case assumes the opposite extreme: in each run a single random percentile is drawn and every component is read at that same percentile of its subclass, so they are good or bad together. It gives a P50 of **A$2,734k**, a P80 of **A$3,027k** and a P90 of **A$3,187k**. In theory, the fully correlated P80 equals the sum of the component P80s; the simulated A$3,027k against the summed A$3,029k differs only by sampling and rounding. That is the precise sense in which adding P80s assumes the components move in lockstep.

```figure
type: compare
title: Bay 4's forecast by method
cols: P50 | P80 | P90
caption: This is an illustration, excluding GST. The component methods use the four subclasses; the whole-class method applies the 24-project ratios to the A$2.40m approved budget.
- Components, independent, 10,000 runs | A$2,783k | A$2,958k | A$3,053k
- Components, fully correlated | A$2,734k | A$3,027k | A$3,187k
- * Whole class, 24 projects | A$2,736k | A$3,379k | A$3,917k
- Inside-view approved budget | A$2,400k | A$2,400k | A$2,400k
```

The medians barely differ: A$2,734k to A$2,783k against the whole-class A$2,736k. The methods agree on the typical outcome. They disagree about the tail: the whole-class P80 is about A$420k above the independent component P80, and the whole-class P90 is about A$860k above it.

### How many runs are enough

Rerunning the independent simulation with three other random seeds gave P80s of A$2,954k, A$2,953k and A$2,959k, and P90s between A$3,049k and A$3,055k. Ten thousand runs pin the simulated percentiles to within a few thousand dollars, which is far finer than anything the decision needs. More runs would tighten them further, but this is the precision of the arithmetic, not of the forecast. The forecast's uncertainty comes from the records: 24 projects, split into subclasses of four to eight. A million runs cannot make a subclass of four software projects say more than four projects can, and a simulated P80 printed to the dollar invites a confidence the data does not support. Report simulated results rounded to the nearest A$10k or so, state the number of runs and the seed, and keep the file so that anyone can reproduce the result.

## How closely the components move together

Neither extreme is realistic. Bay 4's components share a site, a project team, a schedule and an owner. A wet winter delays the slab, which delays the machine installation, which delays the pallet system, and every week of delay costs project staff time on every component. Chapter 7 found a correlation of 0.937 between cost and schedule ratios across the class, which says that common causes, not independent accidents, drive most of the overrun. On the other hand, the machine supplier's price and lead time have nothing to do with whether the ERP interface works. Some outcomes are shared and some are not.

A reasonable reading is that the true answer lies between the independent and fully correlated results, closer to the correlated end for the building, automation and software, which are installed together and depend on each other, and closer to independence for the machines, which are bought on a fixed quotation. On that reading, the component method puts Bay 4's P80 at roughly A$3.0m.

## What the simulation cannot see

The bootstrap has a hard limit: it can only reuse outcomes that have happened. If every component draws its subclass's worst ratio, the total is 905.3 × 1.52 + 1,052.6 × 1.08 + 294.7 × 1.68 + 147.4 × 2.60 = **A$3,391k**, and no run of the independent bootstrap can ever exceed it. The whole-class P80 of A$3,379k is almost exactly that ceiling. With four to eight projects in each subclass, the worst recorded outcome is not the worst possible one. A machine that fails its acceptance test, a building approval refused at the first attempt, or a second ERP-scale software failure would each sit outside the record, and the component simulation would give them no weight at all.

That is the trade between the two approaches. The whole class has 24 outcomes, enough to show a fat tail, but it ignores Bay 4's favourable mix. The components respect the mix but rest on thin subclasses that cannot reach beyond their own worst cases. [Choosing the reference class](/reados/publications/reference-class-forecasting-by-the-numbers/choosing-the-reference-class/) described the same tension between similarity and sample size; component forecasting is one way of having more similarity without discarding the larger class.

For Bay 4, the business uses the two results for different purposes. The component forecast shows where the money is likely to go, which is how Chapter 9 decides where to act and how the project's contingency is allocated within the team. The whole-class P80 of A$3.379m stays as the funding figure in the decision paper, with the component P80 of about A$3.0m stated beside it, because the difference between them is exactly the tail that thin subclasses cannot see. As the business adds projects and the subclasses grow, the case for leaning on the component method will strengthen. [Uplifts and contingency](/reados/publications/reference-class-forecasting-by-the-numbers/uplifts-and-contingency/) covers how the funded amount is split between the project and the owner.

## The error: every component drawn from the whole class

This is an illustration. The estimator's first simulation looked convincing: a P50 of A$2,891k, a P80 of **A$3,366k** and a P90 of A$3,759k. The P80 agreed with the whole-class A$3,379k to within A$13k, which seemed to confirm both methods.

The agreement was an accident of a mistake. The formula for each component drew its ratio from all 24 past projects, not from its own subclass, so the machines could draw a software disaster. The reviewer found it by sorting the runs and reading the components of the worst ones. The highest total, A$6,050k, had the machines at a ratio of 2.60, which would make Bay 4's machining centres cost A$2,737k against a share of A$1,052.6k. No machine project in the business's history has overrun by more than 8%. Under the faulty set-up, the machines drew a ratio of 1.50 or more in about one run in six, because 4 of the 24 class ratios are at that level; under their own subclass, never.

```figure
type: checklist
title: Checks on a component simulation before it is used
caption: This is an illustration. The first two checks would have caught the estimator's error in minutes.
- Each component draws only from its own subclass | machines from the 7 machine projects, never from all 24
- Read the components of the worst runs | a machining centre at 2.60 has no precedent
- Reproduce a known result | the exact enumeration of 1,120 combinations gives P80 A$2,955k
- Label the correlation assumption on every result | independent, fully correlated, or stated in between
- x Add component P80s and call the total the project P80 | A$3,029k is the fully correlated case, not a neutral one
- ? Ask what the subclasses have never recorded | the simulation cannot exceed A$3,391k
```

The corrected simulation gave the independent results above. The estimator's second slip, in the same draft, was to present the sum of the component P80s, A$3,029k, as "the component P80" without saying that it assumed full correlation. The decision paper now labels every simulated figure with its correlation assumption.

## Exercise: the bounds of the bootstrap

Using Bay 4's component shares and subclass ratios, calculate (a) the highest total the independent bootstrap can produce, (b) the lowest total it can produce, and (c) the fully correlated P80 by hand from the component P80 ratios. Compare (a) with the whole-class P80 and say what the comparison implies.

**Worked answer.** (a) Every component at its subclass's worst ratio: 905.3 × 1.52 + 1,052.6 × 1.08 + 294.7 × 1.68 + 147.4 × 2.60 = 1,376.0 + 1,136.8 + 495.2 + 383.2 = **A$3,391.2k**. (b) Every component at its best: 905.3 × 0.92 + 1,052.6 × 0.97 + 294.7 × 1.11 + 147.4 × 1.21 = **A$2,359.4k**. Only 7 of the 1,120 combinations come in at or under A$2.40m, about 0.6%, and every one of them needs the building to repeat P12's 0.92. (c) 905.3 × 1.282 + 1,052.6 × 1.046 + 294.7 × 1.496 + 147.4 × 2.210 = **A$3,028.2k**, which rounds to the A$3,029k of the summed component figures. The whole-class P80 of A$3,379k is within A$12k of the most extreme total the component bootstrap can produce. The whole class therefore says that one Bay 4 in five would cost more than the component method thinks is possible at all. Either the mix really protects Bay 4 that much, or the subclasses are too small to show its tail; with four to eight projects each, the business cannot yet tell which, and should keep both figures in view.
