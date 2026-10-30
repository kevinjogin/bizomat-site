---
book: defect-maps-by-the-numbers
chapterSlug: what-random-looks-like
order: 3
title: "What random looks like"
description: "What complete spatial randomness means, why random patterns look clumpy and gappy to the eye, how to simulate random defects for comparison, and how chance creates convincing false clusters."
draft: false
---

Before asking whether defects are clustered, it is necessary to know what unclustered looks like. Here intuition fails almost everyone. Asked to scatter dots at random by hand, people spread them far too evenly, avoiding gaps and near-coincidences, because that is what randomness feels like. Real random scatter is clumpy: it has tight groups, empty stretches and lines that seem to mean something. An engineer who has not seen genuine random patterns will find clusters in every map.

This chapter defines the reference pattern, complete spatial randomness, shows what it looks like on a door, gives the probabilities behind its clumps and gaps, and introduces simulation as the way to compare a real map with chance. Its error is a cluster of three specks that was blamed on a spray gun.

## Complete spatial randomness

The reference pattern for defects on a surface is called **complete spatial randomness**, CSR for short. It is the two-dimensional version of the Poisson model of Chapter 2, and it has two properties.

- **Uniformity**: every part of the surface is equally likely to receive a defect. There is no zone of higher or lower density.
- **Independence**: the position of one defect has no influence on where any other falls. Defects neither attract each other into groups nor repel each other into spacing.

A pattern with both properties is a homogeneous Poisson process. The number of points in any region follows a Poisson distribution with mean equal to the density times the region's area, and counts in regions that do not overlap are independent. Departures come in two directions. **Clustering**, more points close together than CSR gives, arises when defects come in groups, from one cause acting at one place, or when density varies over the surface. **Regularity**, points more evenly spread than CSR, arises when defects inhibit each other, as when each takes up space that others cannot occupy, or when they are produced by a regular mechanism such as a stepping machine.

### Uniform is not the same as evenly spread

The word "uniform" causes confusion. In CSR it means that the chance per unit area is uniform, not that the points end up evenly spaced. Evenly spaced points, like the holes in a perforated sheet, are a highly regular pattern, about as far from CSR as a tight cluster, in the other direction.

## What it looks like on a door

Plant E's engineer took two doors from the study. One was a typical door from a part of the run when the hooks had just been cleaned, with 25 dust specks spread over its face. The other was a door from a day when a silicone-contaminated air line had been connected to the manual touch-up gun, with 42 craters. Their positions, measured to the millimetre, are drawn below at the same scale.

```figure
type: svg
title: Two doors: dust specks and craters
alt: Two tall rectangles side by side representing the outer faces of two doors. The left door has 25 dots scattered across its face with some small groups and some empty areas. The right door has 42 dots gathered into three tight groups, one in the upper left, one in the middle right and one lower down, with most of the face empty.
caption: This is an illustration; positions measured on two doors, drawn at one fifth scale. The left door's 25 dust specks have some apparent groups and gaps, but Chapters 4 and 5 show they are consistent with complete spatial randomness. The right door's 42 craters are strongly clustered in three groups around places where contaminated air from the touch-up gun reached the wet powder.
viewbox: 0 0 440 300
body:
<rect class="bx" x="30" y="20" width="160" height="240"/>
<rect class="bx" x="250" y="20" width="160" height="240"/>
<circle class="ah" cx="112" cy="147" r="3"/>
<circle class="ah" cx="127" cy="162" r="3"/>
<circle class="ah" cx="166" cy="149" r="3"/>
<circle class="ah" cx="43" cy="147" r="3"/>
<circle class="ah" cx="127" cy="128" r="3"/>
<circle class="ah" cx="107" cy="222" r="3"/>
<circle class="ah" cx="97" cy="181" r="3"/>
<circle class="ah" cx="139" cy="59" r="3"/>
<circle class="ah" cx="59" cy="86" r="3"/>
<circle class="ah" cx="93" cy="110" r="3"/>
<circle class="ah" cx="123" cy="51" r="3"/>
<circle class="ah" cx="126" cy="158" r="3"/>
<circle class="ah" cx="97" cy="223" r="3"/>
<circle class="ah" cx="159" cy="205" r="3"/>
<circle class="ah" cx="81" cy="170" r="3"/>
<circle class="ah" cx="70" cy="33" r="3"/>
<circle class="ah" cx="149" cy="255" r="3"/>
<circle class="ah" cx="77" cy="55" r="3"/>
<circle class="ah" cx="149" cy="103" r="3"/>
<circle class="ah" cx="119" cy="158" r="3"/>
<circle class="ah" cx="165" cy="54" r="3"/>
<circle class="ah" cx="166" cy="217" r="3"/>
<circle class="ah" cx="92" cy="26" r="3"/>
<circle class="ah" cx="42" cy="222" r="3"/>
<circle class="ah" cx="110" cy="146" r="3"/>
<circle class="ah" cx="314" cy="195" r="3"/>
<circle class="ah" cx="284" cy="197" r="3"/>
<circle class="ah" cx="291" cy="203" r="3"/>
<circle class="ah" cx="286" cy="186" r="3"/>
<circle class="ah" cx="280" cy="208" r="3"/>
<circle class="ah" cx="302" cy="205" r="3"/>
<circle class="ah" cx="288" cy="197" r="3"/>
<circle class="ah" cx="308" cy="190" r="3"/>
<circle class="ah" cx="299" cy="203" r="3"/>
<circle class="ah" cx="297" cy="187" r="3"/>
<circle class="ah" cx="302" cy="198" r="3"/>
<circle class="ah" cx="282" cy="205" r="3"/>
<circle class="ah" cx="289" cy="189" r="3"/>
<circle class="ah" cx="303" cy="195" r="3"/>
<circle class="ah" cx="282" cy="207" r="3"/>
<circle class="ah" cx="368" cy="152" r="3"/>
<circle class="ah" cx="368" cy="132" r="3"/>
<circle class="ah" cx="368" cy="149" r="3"/>
<circle class="ah" cx="370" cy="146" r="3"/>
<circle class="ah" cx="367" cy="144" r="3"/>
<circle class="ah" cx="356" cy="154" r="3"/>
<circle class="ah" cx="366" cy="141" r="3"/>
<circle class="ah" cx="356" cy="149" r="3"/>
<circle class="ah" cx="386" cy="149" r="3"/>
<circle class="ah" cx="370" cy="142" r="3"/>
<circle class="ah" cx="369" cy="161" r="3"/>
<circle class="ah" cx="365" cy="152" r="3"/>
<circle class="ah" cx="378" cy="139" r="3"/>
<circle class="ah" cx="304" cy="85" r="3"/>
<circle class="ah" cx="316" cy="87" r="3"/>
<circle class="ah" cx="315" cy="78" r="3"/>
<circle class="ah" cx="304" cy="83" r="3"/>
<circle class="ah" cx="302" cy="70" r="3"/>
<circle class="ah" cx="316" cy="70" r="3"/>
<circle class="ah" cx="331" cy="95" r="3"/>
<circle class="ah" cx="328" cy="81" r="3"/>
<circle class="ah" cx="304" cy="79" r="3"/>
<circle class="ah" cx="309" cy="79" r="3"/>
<circle class="ah" cx="311" cy="75" r="3"/>
<circle class="ah" cx="314" cy="81" r="3"/>
<circle class="ah" cx="316" cy="82" r="3"/>
<circle class="ah" cx="311" cy="90" r="3"/>
<text class="txb" x="40" y="285">25 dust specks</text>
<text class="txb" x="262" y="285">42 craters</text>
```

The dust door is the instructive one. Its specks are not evenly spread: there are two or three loose groups, an empty band across the upper middle, and a cell 200 mm square with four specks in it. Divided into the 24 cells of the composite grid, 9 cells are empty. Yet this is close to what complete spatial randomness predicts: with 25 specks in 24 cells, the chance that any one cell is empty is e^(−25/24) = 0.353, and the expected number of empty cells is 24 × 0.353 = 8.5. Nine empty cells, and one cell with four, are exactly what chance produces.

The crater door is different in kind. Its craters are packed into three groups, each perhaps 100 to 150 mm across, with most of the door empty. No one would call that random, and Chapters 5 and 6 confirm it with numbers. The point of the comparison is the left-hand door: patterns that look somewhat grouped to the eye are often entirely random.

### Regular patterns

Regularity is rarer among defects than clustering, but it occurs, and it is worth recognising. Defects that take up space prevent others from forming close by: two blisters cannot overlap, and gas bubbles rising through a coating merge if they meet, so the survivors end up spaced apart. Defects produced by a stepping or indexing mechanism appear at regular intervals: a spot welder that marks every weld, a press that dents the sheet at each feed step, a conveyor chain whose links touch the part at fixed spacing. And features of the part itself may be regular, so that defects tied to them inherit their spacing, like pinholes above every one of a row of weld nuts on the back of a panel.

A regular pattern of defects is often the most informative pattern of all, because its spacing can be matched against the pitch of a machine or a feature. If defects on a strip repeat every 314 mm, a roll of 100 mm diameter is the first suspect. Plant E found no regular patterns in its coating defects, but the thin-film defects along folded edges, which Chapter 2 set aside, did repeat at the 150 mm pitch of the hanger clips on the folding brake, which pointed to marks left by the clips before coating.

## The probabilities behind clumps and gaps

Simple calculations show how strongly chance produces apparent structure. Two examples from Plant E's data make the point.

**A hot cell among twenty.** Chapter 1's composite map had 138 defects in the 20 cells below the top row, an average of 6.9 per cell. If they were spread completely at random, the chance that a particular cell would contain 12 or more is only 0.049. But there are 20 cells, and the chance that **at least one** of them contains 12 or more is 1 − (1 − 0.049)^20 = 0.634. More often than not, a random map of this kind has a cell that looks like a hot spot. Likewise, the chance that at least one of the 20 cells has 2 or fewer, a "clean" spot, is 0.478.

**Three specks close together.** On a door with six defects scattered completely at random, simulation shows that the chance of at least one pair lying within 100 mm of each other is 0.372, and the chance that some defect has two others within 150 mm, a tight-looking triple, is 0.119. About one door in eight with six random defects will show such a triple.

```figure
type: stats
title: How often chance produces apparent structure
caption: Probabilities under complete spatial randomness, from the Poisson distribution and from 200,000 simulated doors. Each of these looks like a pattern to the eye and none of them is evidence of a cause on its own.
- 0.634 | chance that at least one of 20 cells averaging 6.9 holds 12 or more
- 0.478 | chance that at least one of those cells holds 2 or fewer
- 0.372 | chance that a door with 6 random defects has a pair within 100 mm
- 0.119 | chance that such a door has a defect with 2 others within 150 mm
```

The lesson is not that patterns are always chance. It is that the eye cannot tell, and that a claim of clustering needs a comparison with what randomness would have produced in the same circumstances: the same number of defects, on the same shape of part, examined in the same way. That comparison is made with statistics, or more flexibly with simulation.

## Simulating randomness

Complete spatial randomness is easy to simulate. To place n random defects on a rectangle W wide and H high, draw n pairs of independent random numbers u and v between 0 and 1 and set x = W u and y = H v. Any spreadsheet can do it with its random number function, and a few hundred simulated doors can be generated in seconds. For a part that is not a rectangle, simulate on the enclosing rectangle and discard points that fall outside the part's outline, such as in holes or cut-outs.

Simulation answers questions that formulas cannot, or can only with difficulty. What is the chance that a door with 42 random defects shows a group of 13 within 100 mm? What range of nearest-neighbour distances does randomness give on this particular door shape, with its edges? What spread of the K function of Chapter 6 should be expected? In each case the method is the same: compute the statistic for the real pattern, compute it for many simulated random patterns with the same number of points on the same region, and see where the real value falls among the simulated ones. If it falls among the most extreme few per cent, chance is an unlikely explanation.

```figure
type: steps
title: A Monte Carlo test against complete spatial randomness
caption: The same five steps work for any statistic of a pattern. With 99 simulations, a real value more extreme than all of them has a probability of 1 in 100 or less of arising by chance, which gives a test at about the 1% level for a one-sided question.
- Choose a statistic | for example the mean nearest-neighbour distance, or the count in the fullest cell
- Compute it for the real pattern | with the actual number of defects on the actual part outline
- Simulate random patterns | 99 or more, each with the same number of points on the same outline
- Compute the statistic for each simulation | and sort the results
- * Compare | if the real value lies beyond all or nearly all simulated values, randomness is unlikely
```

Monte Carlo testing of this kind has a great advantage on real parts: it handles awkward shapes, holes and edges automatically, because the simulated patterns have the same shape and edges as the real one. Many published formulas for spatial statistics assume an infinite surface or a simple shape and need corrections at the edges; simulation needs none.

## The error: three specks and a spray gun

Early in the study, an inspector flagged a door with six dust specks, three of which lay within about 150 mm of each other near the left edge, at mid-height. The inspector's note suggested that the automatic gun on that side was spitting lumps of powder, and the maintenance fitter was asked to strip and clean it, which took the line down for 40 minutes.

The engineer later asked how unusual the door was. Simulation answered: a door with six defects placed completely at random has a defect with two others within 150 mm about one time in eight. In the two weeks of mapping there were 50 or so doors with five or more defects; several of them would be expected to show such a group by chance alone. The gun, when examined, was clean and its spray pattern normal. One door's triple was not evidence of anything.

What would have been evidence is a **repeated** pattern: groups at the same place on many doors, which the composite map would show as a hot cell; or groups much tighter, or more frequent, than simulation predicts, which the methods of Chapters 5 and 6 detect. The engineer added a line to the inspection instructions: a single door with a suspicious group is recorded and mapped like any other, and maintenance is called only when the map shows the pattern repeating.

## Random at one scale, clustered at another

A final subtlety: a pattern can be random at one scale and clustered at another. Plant E's composite map is a good example. Within the lower five rows of the door, the defects look consistent with CSR, but the door as a whole is not uniform, because the top row holds far more than its share. On a single door, dust specks may fall independently of each other, yet across doors they are not independent, because the specks on one door depend on the state of its hooks. The question "are these defects random?" therefore needs a scale attached to it: random within what region, and between which defects? The tests in the following chapters each look at a particular scale. Quadrat counts look at the scale of the cells; nearest-neighbour distances at the scale of the gap between a defect and its closest neighbour; the K function at every scale up to a chosen limit; and the counts per door at the scale of whole parts.

Keeping the scales apart prevents a common confusion, in which a test at one scale finds randomness and an engineer concludes that there is no pattern anywhere. Plant E's dust specks passed a test of randomness within one door and failed, spectacularly, a test of randomness across doors. Both results were true, and together they pointed at the hooks.

## How this applies to a small Australian business

Before acting on an apparent cluster, ask whether chance would produce it as often as you are seeing it. Simulate: a spreadsheet with random positions for the same number of defects on the same part will show you, in a few minutes, how clumpy randomness looks. Look for patterns that repeat across many parts, which the composite map reveals, rather than single striking parts, which chance supplies in plenty. Keep the tools of the next chapters for the cases where the eye cannot decide.

## Exercise: empty cells

A door with 12 random dust specks is divided into the same 24 cells of 200 mm. (a) What is the chance that a given cell is empty? (b) How many empty cells would you expect? (c) The door actually has 15 empty cells. Is that surprising?

**Worked answer.** (a) The mean per cell is 12 ÷ 24 = 0.5, so the chance a cell is empty is e^(−0.5) = **0.607**. (b) Expected empty cells: 24 × 0.607 = **14.6**. (c) **No.** Fifteen empty cells is almost exactly the expectation. With few defects on a large part, most of the part is necessarily empty, and the specks that do appear will seem to group in the remaining cells. Small counts carry little information about pattern, which is why Plant E's analysis combines many doors in the composite map.
