---
book: forge-welding-by-the-numbers
chapterSlug: strength-and-testing
order: 7
title: "Strength and testing of forge welds"
description: "Read the early tests that found smiths' worst welds at half the bar's strength, express weld strength as joint efficiency, see why variation matters more than the average, and test welds in the shop."
draft: false
---

A good forge weld can be as strong as the bar. A poor one can look exactly like it and carry half the load, or less. That combination, high possible strength with wide and invisible variation, decided the fate of forge welding in industry. The early twentieth-century manuals were frank about it. Hart, in 1910, reported tests made by Campbell in which four able and experienced smiths, knowing their welds would be tested, produced worst welds with between 44 and 70% of the strength of the original bar. Swingle, in 1915, wrote that forge welds very seldom exceeded 70% of the strength of the metal, had very low elongation, and often separated under shock.

This chapter looks at those tests, expresses weld strength as joint efficiency, shows why the spread of results matters more than the average, and sets out how a shop can test forge welds with simple equipment. Testing Welded Joints by the Numbers covers weld testing in general.

## Joint efficiency

The strength of a weld is usually stated as a joint efficiency: the load at which the welded bar breaks, divided by the load at which an unwelded bar of the same stock breaks, as a percentage. A weld that breaks at the same load as the bar, or that breaks in the bar away from the weld, has an efficiency of 100%. A weld with unbonded patches, or with a slag sheet across it, breaks through the joint at a lower load, and its efficiency is the fraction of the bar's strength it reached.

```figure
type: formula
title: Joint efficiency of a forge weld in 20 mm round bar
formula: joint efficiency = breaking load of welded bar ÷ breaking load of unwelded bar
caption: This is an illustration for a mild steel bar with an assumed tensile strength of about 400 MPa. Real strengths come from tests of the actual stock.
- Bar section | π × 10² ≈ 314 mm²
- Unwelded breaking load | 314 × 400 ≈ 126 kN
- Welded bar | broke through the weld at 88 kN
step: joint efficiency = 88 ÷ 126 ≈ 70%
step: the weld carried the load of a bar with only 70% of its section
step: an unbonded patch over about 30% of the face would give roughly that result
```

A joint efficiency is a single number for a single weld. It says nothing about the next weld made by the same smith, which is where the trouble lies.

## Campbell's tests

The tests Hart reported were made with four experienced smiths, each welding flats and rounds of several kinds of steel and wrought iron in the sizes and shapes most convenient to handle. The welds were then broken in a testing machine. Hart quoted the worst individual weld of each smith.

```figure
type: bars
title: Worst individual weld of each smith in Campbell's tests, as reported by Hart in 1910
unit: % of the strength of the unwelded bar
max: 100
caption: Historical figures from Hart's account, rounded as given there. They are the worst welds of experienced smiths, not their average; the same account reported worst results of 44 to 59% for the different steels tested.
- Smith A | 70
- Smith B | 54
- Smith C | 58
- Smith D | 44
```

These were not the average results, and many of the welds were much better. But the worst welds of experienced smiths, who knew they were being tested, had between less than half and about three-quarters of the bar's strength. If a part's safety depended on every weld reaching the bar's strength, any of those smiths would sooner or later have made one that did not. Hart's account added that the poorest results appeared in all the kinds of metal tested, so the variation came from the process and the people, not from one poor steel.

## Why the spread matters

A designer who must rely on a weld cannot use its average strength; they must use a strength that almost every weld will reach. If forge welds by a particular smith average about 85% efficiency with a standard deviation of about 10 percentage points, roughly normally distributed, about 7% of welds will be below 70% and about one in 160 below 60%. If the same smith's welds had a standard deviation of only 5 points, almost none would fall below 70%.

```figure
type: compare
title: Share of welds below a given efficiency for two spreads, average 85%
cols: Below 70% | Below 60%
caption: This is an illustration assuming normally distributed efficiencies, for teaching. Real distributions of forge weld strength often have a long tail of very poor welds, which makes the low end worse than the normal curve suggests.
- Standard deviation 10 points | about 7% of welds | about 0.6%, one in 160
- *Standard deviation 5 points | about 0.1% of welds | almost none
```

The spread, not the average, decides whether forge welds can be trusted where safety depends on them. Fusion welds made to qualified procedures, examined by modern methods, have a much smaller spread, and their defects can be found. Forge welds' defects, unbonded patches inside the joint, cannot be seen from the outside and are hard to find even with ultrasonic testing. That is the main reason industry abandoned forge welding for load-bearing parts once fusion and resistance welding were available, and why forge welded lifting chain, once universal, was replaced by electrically welded chain made and proof-tested to standards.

## Ductility and shock

Strength in a slow tensile test is not the whole story. Swingle reported that forge welds had very low elongation, breaking at the weld before stretching much, and often separated under shock. A weld with unbonded patches behaves like a bar with a crack in it: under a sudden load, the crack can run across the remaining bonded area, and the weld snaps at a load well below its slow-test strength. Hart recorded the old view that large welds were unsafe, with welds of large forging steel rods described as entirely unreliable. For parts that take shock, such as hammers, hooks and chain, low ductility at the weld is as serious as low strength.

## Where the weakness sits

The unbonded areas in a forge weld are not random. They cluster where the faces met last, at the edges and tips of scarfs, where the slag had furthest to travel and the metal was thinnest and coolest, and at the middle of a weld whose faces were flat or concave, where slag was trapped. A nick-break test that shows a sound centre and an unbonded rim points to a weld that cooled before its edges closed; one that shows a bonded rim and a dull centre points to trapped slag. Reading where the weakness sits tells the smith what to change: a quicker transfer, a second heat for the edges, or a more convex face.

## Proof testing

Where forge welded items were once made in quantity, such as chain, each length was proof tested: loaded to a stated multiple of its working load and inspected for stretching or cracking. A proof test finds the grossly defective welds, because they break or open under the load, but it cannot find every weak one, because a weld with a moderate unbonded area may carry the proof load and fail later under shock or fatigue. Proof testing therefore reduces the risk but does not remove it, which is part of why forge welded chain gave way to electrically welded chain of controlled quality. The standards that govern lifting chain today set out how it is made, tested and marked; a smith's shop is not the place to make it.

## Shop tests

A blacksmith's shop has no tensile testing machine, but it can test welds in ways that reveal their soundness. The tests are destructive, made on sample welds made from the same stock, by the same smith, in the same way as the work.

```figure
type: checklist
title: Simple shop tests for forge welds
caption: This is an illustration of the shop's tests. They show soundness and ductility, not a number for strength; they are used on sample welds, never on the finished work itself.
- x Cold bend | bend the welded bar in a vice through 90° or more with the weld at the bend; a sound weld bends with the bar
- x Nick and break | saw a nick across the weld, clamp and break it; examine the broken faces for bonded grain or flat grey scale
- x Twist | twist a square bar through several turns with the weld in the twisted length; a poor weld opens
- x Hot bend | bend at a red heat over the anvil horn; useful on wrought iron, whose fibres show the weld
- x Etch | cut, polish and etch a section to show the weld line and any slag
- *? Record | stock, smith, date, fire, flux and result written on the sample's tag
```

The cold bend test is the shop's standard. A bar with a sound weld bends round evenly and the weld line, if it shows at all, stays closed. A poor weld opens along the joint during bending, often suddenly, showing the flat, smooth face of an unbonded area. The nick-break test shows the inside of the weld: a sound weld breaks through the bar's grain, rough and crystalline or fibrous; an unbonded area shows as a flat, smooth patch, often grey or blued by the scale that kept the faces apart. Testing Welded Joints by the Numbers explains bend and nick-break tests and what they can and cannot prove.

## How many samples

One sample weld proves little about the next; several give a fair picture. The shop's practice is to have every student make and bend-test at least five sample welds before welding any piece of work, and every new batch of stock tested with at least two. A student whose five samples all pass with the weld closed through the bend has shown a consistency that one good weld does not. A student whose samples are mixed is not yet ready, however good the best one looks. The same thinking applies to a professional smith qualifying themselves on a new stock or a new joint.

## What the tests found in the shop

This is an illustration. Over a year, the shop bend-tested about 400 sample welds made by students and staff in mild steel. About 70% of students' first ten welds passed; by their thirtieth weld, about 90%. The owner's own sample welds passed about 98% of the time. When the samples were sorted by fire, the welds made in the gas forge passed less often than those in the coke fire, which led the owner to retune the gas forge's burner for a more reducing flame. The numbers were simple to collect and changed the shop's teaching more than any amount of discussion.

## Forge welds in loaded work

Given what the tests show, the shop's rule is that forge welds are used where their failure would not injure anyone: ornamental work, tools for the maker's own use, decorative hardware, and heritage repairs where the load is light and the authority asks for traditional methods. For anything that lifts, holds or restrains a load where failure could hurt someone, such as a lifting hook, a chain, a trailer component or a structural member, the shop either uses a fusion weld made to a qualified procedure, or makes the part without a weld at all. That rule follows from the spread of strength shown in this chapter, not from any doubt about the craft or the skill of the people who practise it.

## The record

Testing is useful only if its results are recorded. Each sample weld is tagged with the stock, the smith, the date, the fire, the flux and the result, and the tags are entered into the shop's record. Over time, the record shows each smith's consistency, the effect of changes in fuel and flux, and the performance of each batch of stock. It also gives a heritage authority or a customer evidence that the shop's welds are tested, which matters in the heritage work of Chapter 10.

## Wrought iron's breaks

Wrought iron breaks differently from steel. Its fibres of iron and slag make a broken wrought iron bar look like split wood, fibrous and stringy, and a sound forge weld in wrought iron, nicked and broken, shows those fibres running through the joint where the weld was well worked. A poor wrought iron weld shows a flat, clean break across the fibres at the joint, or a sheet of slag. Heritage repairers use the nick-break test on samples of reclaimed wrought iron both to check the iron's quality and to check their welds.

## The running case: a test for the gate

This is an illustration. The council's heritage officer asked the shop, before approving forge welded repairs to a set of park gates, for evidence that its welds in reclaimed wrought iron were sound. The shop made six sample scarf welds from the same batch of reclaimed bar that would be used for the repair, bend-tested three and nick-broke three, photographed the results and sent them with its method statement. All six were sound. The officer approved the repair, and the photographs went into the job file.

## A failure: the forged hook

This is an illustration. Years before the shop's current rules, a farmer had asked a smith to make a hook for lifting a water tank, and the smith forge welded an eye onto a bent bar. The hook held the empty tank. When the tank was lifted part-full, the weld at the eye let go suddenly, and the tank dropped a short distance onto its stand.

Nobody was hurt, but the broken weld showed a flat grey area across most of its face, bonded only round the edge. The hook had looked perfect. The incident is the reason the shop does not forge weld anything used for lifting, and it is told to every class.

## Exercise: average and spread

A smith's sample welds in mild steel have an average joint efficiency of about 88% and a standard deviation of about 8 percentage points, assumed normally distributed. Estimate the share of welds below 70%. If practice reduced the standard deviation to 4 points with the same average, what would the share be? What does this suggest about how to judge a smith's welding?

Below 70% is (88 − 70) ÷ 8 ≈ 2.25 standard deviations below the average, and about **1.2%** of a normal distribution lies further out than that, so roughly one weld in 80 would be below 70%.

With a standard deviation of 4 points, 70% is (88 − 70) ÷ 4 = 4.5 standard deviations below the average, and the share is a few in a million, **practically none**. The average was the same in both cases; only the consistency changed. Judging a smith by their best weld, or even their average, misses what matters; judging by the spread across many tested samples shows whether their welds can be relied on, and real forge welds, with their long tail of poor results, should be judged more cautiously still.
