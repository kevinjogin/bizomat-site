---
book: shop-floor-optimisation-by-the-numbers
chapterSlug: cutting-bars-with-least-waste
order: 6
title: "Cutting bars with least waste"
description: "Cut a list of tube or bar lengths from stock with the fewest bars: the material lower bound, the first-fit decreasing rule in the KEVOS® stock cut planner, cutting patterns, offcuts and stock length."
draft: false
---

Cutting tube, bar, extrusion or timber to length is the most common optimisation problem in a fabrication shop, and the one where waste is most visible: it ends up in the scrap bin at the end of the saw. The task is to cut a list of required pieces from stock lengths, allowing for the saw kerf and the trimmed ends, using as few stock lengths as possible. It is a cousin of the loading problems of Chapters 2 and 3, with bars in place of machines and lengths in place of times, but the aim is different: not to balance the bars, but to fill as few of them as possible.

This chapter cuts the stand frames for EC-600 floor stands with the KEVOS® stock cut planner, proves the result best with the material bound, shows a case where the rule falls one bar short of the best and how cutting patterns find it, and ends with a batch cut stand by stand.

## The cut list

This is an illustration. EC-600 cabinets can be supplied on a floor stand welded from 50 × 50 mm square hollow section. Each stand needs two 1,460 mm legs, three 880 mm rails and four 620 mm cross members. This week's batch is three stands, so the cut list is 6 × 1,460 mm, 9 × 880 mm and 12 × 620 mm. The shop buys the section in 6.5 m lengths, trims 10 mm from each end of every length to remove damaged and out-of-square ends, and its cold saw blade removes 3 mm per cut. Two lengths are already in the rack.

```figure
type: stats
title: The stand frame cut list
caption: This is an illustration. The 27 pieces need 24,120 mm of finished tube plus 81 mm of kerf. Each 6.5 m length offers 6,480 mm after trimming.
- 27 pieces | 6 legs, 9 rails, 12 cross members
- 24,120 mm | finished length of all pieces
- 6,480 mm | usable length of each 6,500 mm bar after two 10 mm trims
- 3 mm | kerf per piece cut
- 2 bars | already in the rack
```

## The material bound

As with machine loading, a bound comes first. Every piece consumes its own length plus one kerf, so the batch consumes 24,120 + 27 × 3 = 24,201 mm of usable bar. Each bar offers 6,480 mm, so the batch needs at least 24,201 ÷ 6,480 = 3.73 bars, rounded up to **4**. No cutting plan can use fewer than four bars, however clever.

```figure
type: formula
title: Material lower bound for cutting stock
formula: Usable length per bar = stock length − 2 × end trim
formula: Bound = (sum of piece lengths + pieces × kerf) ÷ usable length, rounded up
caption: The bound assumes that pieces could be cut across bar ends, which they cannot, so real plans often need one more bar than the bound. When a plan equals the bound, it is proved best.
- end trim | length removed from each end of each bar
- kerf | width of material removed by each cut
```

## First-fit decreasing

The standard heuristic for cutting is first-fit decreasing. Sort the pieces from longest to shortest. Take each in turn and cut it from the first bar that still has room for it and its kerf; if none has room, start a new bar. Long pieces are placed first, while bars are empty, and short pieces fill the gaps that remain. The rule is guaranteed never to use more than about 11/9 of the best number of bars, plus a small constant, and in practice it is usually optimal or one bar over.

The [three-size stock cut planner](/tools/stock-cut-plan/) applies exactly this rule. It takes the stock bar length, the end trim at each end, the kerf per finished piece, up to three finished lengths with their quantities and the number of bars already available. It reports the bars required and to purchase, the material lower bound, the finished, kerf, trim and offcut lengths, the yield, and a per-bar cutting plan. When its plan equals the lower bound, it states that the minimum bar count is proved; otherwise it reports a feasible plan.

This is an illustration. Entering 6,500 mm stock, 10 mm trim, 3 mm kerf and the three lengths and quantities, with 2 bars available, the planner gives the following.

```figure
type: compare
title: Stock cut plan for three EC-600 stands from 6.5 m lengths
cols: Pieces | Offcut, mm
rowhead: Bar
- 1 | 4 × 1,460 and 1 × 620 | 5
- 2 | 2 × 1,460 and 4 × 880 | 22
- 3 | 5 × 880 and 3 × 620 | 196
- 4 | 8 × 620 | 1,496
caption: This is an illustration from the KEVOS® stock cut planner. 4 bars, equal to the material lower bound, so the minimum is proved. 2 bars to buy. Finished length 24,120 mm, kerf 81 mm, end trim 80 mm, offcut 1,719 mm, gross 26,000 mm, yield 92.8%.
```

The plan uses four bars, equal to the bound, so no plan can do better. The first two bars are almost perfectly used, the third has a short offcut, and the fourth carries the leftover cross members with a 1,496 mm offcut. That offcut is long enough to be useful, a point taken up below. The shop needs to buy two lengths to add to the two in the rack.

## When the rule misses: cutting patterns

This is an illustration. The following week, the order is four stands: 8 × 1,460, 12 × 880 and 16 × 620 mm. The material bound is (32,160 + 36 × 3) ÷ 6,480 = 4.98 bars, rounded up to 5. The stock cut planner's first-fit decreasing plan uses **6** bars, and because 6 is more than the bound of 5, it reports a feasible plan rather than a proved minimum. The sixth bar carries a single 620 mm piece.

The bound of 4.98 bars is very tight: five bars would have to be used to within 132 mm in total, about 26 mm per bar. Whether that is possible is a question about cutting patterns. A pattern is one way of filling one bar: so many legs, so many rails and so many cross members, with the total length plus kerfs no more than 6,480 mm. There are 102 different patterns for these three lengths, and the question becomes: is there a choice of five patterns whose pieces add up to exactly what is needed? This pattern view of the problem goes back to Gilmore and Gomory's work in 1961, and it is how commercial cutting optimisers work.

```figure
type: compare
title: Two cutting plans for four stands from 6.5 m lengths
cols: Bars | Patterns used | Yield
rowhead: Plan
- First-fit decreasing | 6 | 4 × 1,460 + 620 twice; 7 × 880; 5 × 880 + 3 × 620; 10 × 620; 1 × 620 | 82.5%
- * Best, from patterns | 5 | 1,460 + 8 × 620, twice; 2 × 1,460 + 4 × 880, three times | 99.0%
caption: This is an illustration. The best plan uses two patterns that waste 33 mm and 22 mm per bar. A search of the 102 possible patterns found it; first-fit decreasing could not, because it places all the legs first.
```

The best plan pairs each leg with eight cross members in one pattern and two legs with four rails in another. First-fit decreasing could not find it because it places all eight legs before any rail or cross member, four to a bar, which leaves the bars with awkward gaps that only cross members can fill, and too few cross members to fill them. A search over patterns, which a short program does in a fraction of a second for three lengths, finds the five-bar plan and saves one bar, about A$62 excluding GST at this section's illustrative price.

The general lesson is that the bound is the first thing to read in the planner's output. A plan that equals the bound is finished. A plan one bar above it may or may not be improvable; for a small batch it rarely matters, and for a large or repeated batch it is worth running a pattern search or asking the steel supplier's cutting service.

## Offcuts and stock length

Two decisions surround the cutting plan itself: what to do with offcuts, and which stock length to buy.

An offcut is waste only if it is thrown away. The 1,496 mm offcut from bar 4 will cut two more cross members on the next stand order. A sensible rule is to keep any offcut at least as long as the shortest regular piece, label it with its section and length, and rack it where the saw operator looks first; shorter offcuts go to scrap. Some shops add the offcut rack to the planner's input as extra short bars, which is easy with a pattern search and not with a three-size tool.

The stock length is a choice too. Square hollow section in this size is commonly available in more than one length, and longer lengths are not automatically better. The exercise shows a case where 8 m lengths use the same number of bars as 6.5 m and waste far more. The best stock length depends on the cut list, and for a recurring product it is worth checking both.

```figure
type: decision
title: What to do when the planner's result exceeds the bound
question: How large is the gap, and how often is the batch cut?
caption: The planner proves the minimum whenever its plan equals the bound; most batches need nothing more.
- Plan equals the bound | proved minimum | cut it
- One bar over, small one-off batch | the extra bar costs less than the time to search | cut it, keep the offcut
- * One bar over, large or repeated batch | the saving recurs | run a pattern search, or ask the supplier's cutting service
- More than one bar over | something is unusual | check the lengths, quantities and stock length entered
```

## Yield and what it hides

Yield, finished length divided by gross stock bought, is the usual measure of cutting performance. The three-stand plan's 92.8% is good for a mixed cut list, and the four-stand best plan's 99.0% is exceptional. But yield can mislead in two ways. It counts a long, reusable offcut as waste, so a plan that leaves one 1,500 mm offcut looks worse than a plan that leaves five 300 mm offcuts, though the first is better. And it rewards cutting whole batches in one go, which may not suit the floor: the welders may need one complete stand at a time.

A better measure for a shop with an offcut rack is the scrap rate: the material that goes in the bin, kerf and trims included, as a share of the stock bought. For the three-stand plan, that is the 81 mm of kerf, 80 mm of trims and the 223 mm of short offcuts from bars 1 to 3, 384 mm in all, or 1.5% of the 26,000 mm bought, with the 1,496 mm offcut going to the rack. *Bills of Materials by the Numbers* shows how cutting allowances like these are carried into planned material quantities in [Scrap, yield and cutting allowances](/reados/publications/bills-of-materials-by-the-numbers/scrap-yield-and-cutting-allowances/).

## From plan to saw

A cutting plan only saves material if the saw follows it, and the plan has to be written for the person at the saw rather than for the planner. A good cut sheet lists the bars in order, each with its pieces in cutting order and their lengths, the offcut expected at the end, and a tick box for each piece. Cutting the longest piece first on each bar is a sensible convention, because a mistake on a long piece can still be recovered as a shorter piece, while a mistake on the last piece of a bar cannot.

Three habits keep actual results close to the plan. First, measure the first piece of each length against the sheet before cutting the rest, because a saw stop set 2 mm long will steal 2 mm from every piece and can leave the last piece of a well-filled bar short. Second, measure the stock itself: bars delivered as 6.5 m are often slightly longer, and occasionally shorter, and the planner's usable length should be what arrives. Third, label every piece with its part number as it comes off the saw, so that pieces cut out of stand order can be kitted correctly afterwards; this is what makes the efficient sorted order acceptable to the welders.

The saw length stop and readout in Chapter 5's project list, P4, is partly a cutting-waste project for exactly this reason. Its saving was estimated from the reduction in measuring time and in pieces recut because they were cut short, and a cutting plan that is followed accurately is where that saving appears.

## The error: cutting stand by stand

This is an illustration. On the first stand order, the saw operator cut the tube one stand at a time, in the order of the stand drawing: two legs, three rails and four cross members for stand 1, then the same for stands 2 and 3, starting a new length whenever the next piece would not fit.

```figure
type: compare
title: Three stands cut stand by stand, against the planner's plan
cols: Bars used | Short offcuts, mm | Yield
rowhead: Method
- Stand by stand, in drawing order | 5 | 282, 802, 759, 499 and 5,857 | 74.2%
- * Planner's first-fit decreasing | 4 | 5, 22 and 196, plus 1,496 to the rack | 92.8%
caption: This is an illustration. Same 27 pieces, same stock. Cutting stand by stand needed a fifth bar, which carried a single 620 mm cross member.
```

The fifth bar was the giveaway: the shop had expected to need four, and the fifth carried a single cross member, leaving a 5,857 mm length to be returned to the rack. Cutting in drawing order leaves medium-sized gaps at the end of each bar that the next stand's long legs cannot use. The material cost was modest, one extra length partly used, but the habit would have repeated on every order. The correction was to cut from the planner's list, sorted longest first, with the pieces for each stand labelled and kitted afterwards. Kitting takes a few minutes; the saved length is saved on every batch.

## Exercise: 8 m lengths

This is an illustration. The steel supplier offers the same section in 8.0 m lengths at a lower price per metre. For the three-stand batch, with the same trims and kerf:

1. What is the material bound?
2. The stock cut planner's plan uses 4 bars: 5 × 1,460 + 620; 1,460 + 7 × 880; 2 × 880 + 9 × 620; and 2 × 620. Is it proved minimal?
3. What is the yield, and how does it compare with 6.5 m lengths?

**Worked answer.**

1. Usable length per bar 8,000 − 20 = 7,980 mm. Bound = 24,201 ÷ 7,980 = 3.03, rounded up to **4 bars**.
2. Yes. The plan uses 4 bars, equal to the bound, so the planner reports the minimum as proved. The bound only just rounds up to 4: three bars would fall short by about 260 mm of usable length, and the fourth bar carries just two cross members.
3. Gross stock is 4 × 8,000 = 32,000 mm, so the yield is 24,120 ÷ 32,000 = **75.4%**, against 92.8% from four 6.5 m lengths. The 8 m plan buys 6 m more tube for the same batch and leaves a 6,734 mm offcut. Unless that offcut is used promptly, or the price per metre is at least 19% lower, which is 26,000 ÷ 32,000 of the 6.5 m price, 6.5 m lengths are the better buy for this batch. A batch of four stands would change the answer, and the planner makes checking both lengths a minute's work.
