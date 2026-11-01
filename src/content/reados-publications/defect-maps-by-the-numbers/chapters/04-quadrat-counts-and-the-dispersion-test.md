---
book: defect-maps-by-the-numbers
chapterSlug: quadrat-counts-and-the-dispersion-test
order: 4
title: "Quadrat counts and the dispersion test"
description: "Dividing a part into cells, counting defects in each, testing the counts against randomness with the index of dispersion and chi-square, choosing cell size, and finding which cells matter."
draft: false
---

The simplest formal test of whether defects are spread at random divides the surface into equal cells, called **quadrats**, counts the defects in each and asks whether the counts vary more, or less, than random scatter would make them. The method is old, it needs nothing more than a grid and a calculator, and it is the natural next step after a composite map like Plant E's. It also has a weakness that matters in practice: a single test over the whole part says whether something is not random, but not where.

This chapter sets out the index of dispersion and the chi-square test, applies them to Plant E's composite map, examines how the answer depends on cell size and shows how to find the cells that drive a significant result. Its error is a conclusion that the whole door was affected because one test over the whole door was significant.

## The index of dispersion

If defects follow complete spatial randomness, the count in each cell of equal area follows a Poisson distribution with the same mean, and, as Chapter 2 noted, a Poisson count has a variance equal to its mean. The **index of dispersion** is the ratio of the variance of the cell counts to their mean.

- An index near 1 is what randomness gives.
- An index well above 1 means the counts vary more than randomness gives: some cells have far more than their share and others far less. That is **clustering or uneven density** at the scale of the cells.
- An index well below 1 means the counts are more even than randomness gives: **regularity** at the scale of the cells.

### The chi-square test

To judge whether an index differs from 1 by more than chance, multiply it by the number of cells less one. The result, which equals the sum over the cells of (count − mean)² ÷ mean, follows approximately a chi-square distribution with degrees of freedom equal to the number of cells less one, when the pattern is random. A value far into the upper tail indicates clustering; one far into the lower tail indicates regularity.

```figure
type: formula
title: The quadrat test of randomness
formula: index of dispersion I = s² ÷ x̄     X² = (k − 1) I = Σ (xᵢ − x̄)² ÷ x̄     compare X² with chi-square on k − 1 degrees of freedom
caption: The approximation to chi-square is usually good when the mean count per cell is a few or more and there are a reasonable number of cells; when in doubt, the Monte Carlo test of Chapter 3 gives the same answer without any approximation.
- xᵢ | count of defects in cell i
- x̄, s² | mean and variance of the cell counts
- k | number of cells
step: Plant E, all 24 cells: x̄ = 9.167, s² = 37.80, I = 4.12, X² = 94.84 on 23 degrees of freedom
step: The 5% critical value of chi-square on 23 degrees of freedom is 35.17; the probability of 94.84 or more by chance is about 1 in 10 billion
```

## Plant E's composite map

The composite map of Chapter 1 had 220 defects in 24 cells of 200 mm, four across and six down, an average of 9.17 per cell. The counts were these.

```figure
type: compare
title: Defects in each 200 mm cell, 400 doors
rowhead: Row from the top
cols: Column 1 | Column 2 | Column 3 | Column 4 | Row total
caption: This is an illustration. Columns run from the left edge of the door as it hangs. The hooks pass through holes above columns 1 and 4, and the two cells directly under them hold the largest counts.
- * Row 1 | 26 | 15 | 14 | 27 | 82
- Row 2 | 8 | 4 | 5 | 7 | 24
- Row 3 | 11 | 6 | 8 | 6 | 31
- Row 4 | 7 | 2 | 10 | 10 | 29
- Row 5 | 6 | 7 | 7 | 5 | 25
- Row 6 | 3 | 8 | 10 | 8 | 29
```

Over all 24 cells, the counts have a variance of 37.80 and an index of dispersion of 4.12, and the chi-square statistic is 94.84 on 23 degrees of freedom. The 5% critical value is 35.17, and the probability of a value this large from random scatter is around 10⁻¹⁰. The defects are certainly not spread at random over the door.

## Which cells drive the result?

The chi-square statistic is a sum of contributions, one from each cell, and the contributions show where the departure lies. Each is (count − mean)² ÷ mean.

The two cells under the hooks contribute 30.9 and 34.7. The other two cells of the top row contribute 3.7 and 2.6. Together the top row contributes 71.9 of the total 94.8; the other 20 cells together contribute only 23.0, about what 20 random cells would contribute on their own. The departure from randomness is overwhelmingly in the top row, and above all under the hooks.

A cleaner check is to test the 20 lower cells separately, with their own mean. Those 138 defects average 6.9 per cell, with a variance of 5.67 and an index of dispersion of 0.82. The chi-square statistic is 15.62 on 19 degrees of freedom, against a 5% critical value of 30.14, and the probability of a value at least this large by chance is 0.68. Below the top row, the defects are entirely consistent with random scatter.

```figure
type: compare
title: Quadrat tests on the composite map
rowhead: Region
cols: Cells | Mean per cell | Index of dispersion | Chi-square and degrees of freedom | Probability by chance
caption: This is an illustration. A Monte Carlo test with 999 simulated random patterns of 138 defects on the lower region gave a probability of 0.69 for the 200 mm cells, agreeing with the chi-square approximation.
- * Whole door | 24 | 9.17 | 4.12 | 94.84 on 23 | about 10⁻¹⁰
- Top row only, contributions | 4 | not applicable | not applicable | 71.9 of the 94.84 | not applicable
- Lower five rows | 20 | 6.90 | 0.82 | 15.62 on 19 | 0.68
```

The quadrat analysis therefore says three things. Defects are not random over the door; the departure is concentrated in the top row, particularly under the hooks; and the rest of the door looks like random scatter at the 200 mm scale. That is consistent with the explanation that flakes fall from the hooks onto the top of the door while ordinary dust settles at random everywhere.

## Choosing the cell size

The quadrat test looks at one scale, the size of the cells, and its answer can change with that scale. Cells much larger than a cluster average the cluster with its empty surroundings and dilute it; cells much smaller than a cluster split it up and leave most cells with zero or one defect. A useful working rule is to choose cells comparable to the size of the clusters one suspects, while keeping the mean count per cell above about one so that the chi-square approximation behaves, and to repeat the test at two or three sizes.

For Plant E's lower region, the engineer placed the 138 defects within their 200 mm cells as recorded and repeated the test with smaller cells, each time checking the chi-square probability against a Monte Carlo test of 999 random patterns.

```figure
type: compare
title: The lower region tested at four cell sizes
rowhead: Cell size
cols: Cells | Mean per cell | Chi-square probability | Monte Carlo probability
caption: This is an illustration. At every size, the lower region is consistent with randomness, and the chi-square approximation agrees closely with simulation even when the mean count per cell is well below one, because the number of cells is large. With few cells and small means it would not, and simulation is the safe choice.
- 200 mm | 20 | 6.90 | 0.68 | 0.69
- 100 mm | 80 | 1.73 | 0.63 | 0.64
- 50 mm | 320 | 0.43 | 0.26 | 0.27
- 25 mm | 1,280 | 0.11 | 0.17 | 0.13
```

At larger cells the picture is the opposite. Combining the composite map into six cells of 400 mm, two across and three down, puts the counts at 53, 53, 26, 34, 24 and 30, with a chi-square of 23.4 on 5 degrees of freedom and a probability of 0.0003. The top band still shows, but more weakly than with 200 mm cells, because each of its 400 mm cells now includes the quieter second row. A cluster is best seen at its own scale, which is why Chapter 6 introduces a method that looks at all scales at once.

### Cells must be fixed before looking

One rule matters above all. The cells must be chosen without reference to where the defects are. Drawing a cell boundary around an apparent cluster after seeing the map and then testing whether that cell is unusual guarantees that it will be, because the cell was chosen for being unusual. Chapter 3's example showed that among 20 random cells averaging 6.9, at least one will hold 12 or more almost two times in three. A regular grid fixed in advance, or a Monte Carlo test that repeats the whole selection procedure on each simulated pattern, avoids the trap.

## Cells of unequal area

Real parts are rarely tidy rectangles. A casting face may have bosses and holes, a door may have a cut-out for a meter or a lock, and a natural grid may follow features rather than squares. The quadrat test still works if the expected count in each cell is made proportional to its area. With an overall density λ, cell i of area aᵢ is expected to hold eᵢ = λ aᵢ defects, and the test statistic becomes the sum of (xᵢ − eᵢ)² ÷ eᵢ, still compared with chi-square on one fewer degrees of freedom than cells. The only change is that each cell is compared with its own expectation rather than with a common mean.

The same form handles a deliberate comparison of zones. If the engineer wants to test whether the 200 mm band under the hooks has more than its share, the door can be split into two cells, the band of 0.16 m² and the rest of 0.80 m², and the counts compared with the shares their areas predict. Of 220 defects, the band would be expected to hold 220 × 0.16 ÷ 0.96 = 36.7 and the rest 183.3. The band held 82 and the rest 138, giving (82 − 36.7)² ÷ 36.7 + (138 − 183.3)² ÷ 183.3 = 56.0 + 11.2 = 67.3 on one degree of freedom, far beyond any critical value. Testing a zone chosen in advance for a physical reason, here the hooks, is legitimate in a way that testing a zone chosen by looking at the map is not.

### Types tested separately

When several defect types are mapped together, testing each type separately is often more revealing than testing the total, because different causes produce different patterns and adding them together can blur both. Plant E's craters, mostly from contaminated compressed air, and its dust inclusions, mostly from hooks and room air, have different sources; a test on the total mixes a strongly clustered type with a nearly random one. With enough defects of each type, separate maps and tests are the better practice, and the next chapter looks at the craters on their own.

## The error: one test, the whole door

The engineer's first summary of the quadrat test stated that defects were "significantly clustered over the whole door face (chi-square 94.8, p < 0.001)", and proposed, as the main action, enclosing the whole powder booth in a clean-room style tent with a positive-pressure air supply, at an estimated cost of A$65,000, to keep airborne dust off the doors.

The plant manager, reading the map beside the summary, asked why a tent would help when most of the excess was at the top of the door. The engineer broke the chi-square into its cell contributions, which put three quarters of it in the top row, and then tested the lower 20 cells alone, which were consistent with randomness. A significant test over the whole door had been read as a statement about every part of the door. All it said was that the door as a whole was not random; where the non-randomness lay was a separate question, answered by the contributions and the separate test.

The tent proposal was set aside, at least for the time being, in favour of clean hooks, whose cost Chapter 1's exercise worked out, with the background dust level in the lower door left to be dealt with afterwards if the rework rate still justified it. The case for the tent would then rest on the density of the random background, 0.43 defects per m², not on a test that the hooks had made significant.

## Counts per door are a quadrat test too

Chapter 2's comparison of counts per door with the Poisson model is the same test at a different scale: each door is a quadrat. There, the index of dispersion was 2.64 over 400 doors, and the chi-square statistic, 399 × 2.64 = 1,053 on 399 degrees of freedom, is overwhelming. Across doors, defects are strongly clustered, meaning that some doors receive many more than others. Within the lower region of the door, at the 200 mm scale, they are not. Both results hold together if some doors are more exposed than others: doors that pass under heavily coated hooks receive flakes at the top, and, as Chapter 7 shows, doors coated at dusty times receive more of the background dust as well. Where on a door a speck lands can be random while which doors receive specks is not.

### What the test cannot tell

A quadrat test compares counts in cells; it is blind to arrangement within each cell. Two cells holding seven defects each are treated alike whether the seven are spread evenly or piled into one corner. Fine-scale clustering inside cells is therefore invisible to it, which is why the distance methods of the next chapter, which use exact positions, are its natural complement.

## How this applies to a small Australian business

A grid laid over a composite map, a count in each cell and a variance-to-mean ratio will tell you quickly whether defects are spread at random. Fix the grid before you look, test at two or three cell sizes, and when the result is significant, find out which cells drive it before deciding what to do. The cheapest effective action usually targets the cells that contribute most, not the whole part.

## Exercise: testing the hook cells

Suppose the plant cleans the hooks and maps another 400 doors. The top row now holds 8, 7, 6 and 9 defects in its four cells, and the lower 20 cells hold 138 as before. (a) What is the mean count per cell over all 24 cells? (b) Compute the chi-square contributions of the four top-row cells. (c) Is the top row still unusual?

**Worked answer.** (a) Total defects are 30 + 138 = 168, so the mean is 168 ÷ 24 = **7.0** per cell. (b) Contributions are (8 − 7)² ÷ 7 = 0.143, (7 − 7)² ÷ 7 = 0, (6 − 7)² ÷ 7 = 0.143 and (9 − 7)² ÷ 7 = 0.571, a total of **0.86**. (c) **No.** Four random cells would be expected to contribute about four to the chi-square statistic; these contribute less than one. With clean hooks, the top row looks like the rest of the door, and what remains is the random background that Chapter 8 deals with.
