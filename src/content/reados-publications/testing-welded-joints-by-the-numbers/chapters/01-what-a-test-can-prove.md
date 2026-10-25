---
book: testing-welded-joints-by-the-numbers
chapterSlug: what-a-test-can-prove
order: 1
title: "What a test can prove"
description: "Separate what a weld test proves about the specimen from what it suggests about other welds, and calculate how likely a sample is to miss a problem in the rest."
draft: false
---

Every weld test answers a question about one piece of metal at one moment. A tensile specimen tells you the load at which that specimen broke. A radiograph tells you what that length of weld looked like to X-rays. What people usually want to know is something larger: whether every weld made by this procedure, or every weld in this hopper, is good enough. The gap between what was tested and what is concluded is where most of the misunderstanding about weld testing lies.

This chapter sets out the kinds of weld test and what each can prove, and uses a little probability to show how far a sample can be trusted to represent the welds that were not tested.

## Destructive and non-destructive tests

Weld tests fall into two families.

**Destructive tests** cut, bend, break or etch a specimen. They measure properties directly: strength, ductility, hardness, toughness and the shape of the weld inside. But the specimen is destroyed, so it cannot go into service. Destructive tests are therefore made on test pieces: qualification plates welded to prove a procedure or a welder, production test plates welded alongside the work, or occasionally a sacrificial part.

**Non-destructive tests** examine the weld without harming it: visual inspection, radiography, ultrasonic testing, magnetic particle and dye penetrant testing. They can be applied to the actual welds in the product. But they find imperfections rather than measure properties, and each method finds some kinds of imperfection better than others.

The two families answer different questions. Destructive tests on a qualification plate show that a procedure can produce welds with the required properties. Non-destructive tests on production welds show that particular welds are free of imperfections the method can detect. Neither alone proves that every weld in a product has the required properties, and neither tests the weld under its actual service loads, temperatures and environment; together, with control of the welding itself, they build the case.

```figure
type: compare
title: What each family of tests can and cannot show
cols: Destructive tests | Non-destructive tests
caption: The two families answer different questions. A sound case for a welded product uses both, with control of the welding process in between.
- Applied to | test pieces, not the product | the actual welds in the product
- Measures | strength, ductility, hardness, toughness, internal shape | presence, size and position of imperfections
- Proves | the procedure or welder can produce good welds | these welds are free of detectable imperfections
- Cannot prove | that every production weld matches the test piece | the weld's mechanical properties
```

## Tests in the life of a welded product

Tests appear at several points in the life of a welded product, and each has its own purpose. Before production, procedure and welder qualification tests prove capability. During production, visual inspection, non-destructive testing and sometimes production test plates check that the capability is being delivered. After an incident or during service, tests on failed parts or on welds in service investigate what went wrong or how a structure is ageing. A test result is only interpreted correctly when it is clear which of these questions it was meant to answer.

## Whittemore's question

Whittemore's question in 1910 was simple: how strong is an oxyacetylene weld in steel compared with the plate? He answered it by testing, and his answer came with an honest account of how far it could be trusted. He welded strips of plate, cut each strip into specimens, and pulled each to destruction. The result for each specimen was an efficiency, the ultimate stress of the welded specimen divided by the average ultimate stress of unwelded specimens of the same plate.

His averages for different strips ranged from about 51% to 82%, and individual specimens ranged from about 35% to over 100%. He attributed some of the variation to the welding, some to the specimens not being straight when tested, and some to the difficulty of measuring the cross-section of a rough weld. Chapters 2 to 4 use his results to explore each of those causes. The point for this chapter is that the answer to his question was not a single number but a range, and the range was as important as the average.

## Hornor's lugs

Hornor's account of the 1919 spot-welding tests for the American shipbuilding programme shows a different use of testing. Spot-welded and riveted attachments of a steel angle lug to a plate were made and pulled apart in a testing machine. The riveted samples sheared their rivets at 45,000 to 48,000 pounds, about 200 to 214 kN; the spot-welded samples carried more in every test reported. The tests were made on the actual joint configuration the shipbuilders cared about, a lug attached to a plate, rather than on idealised specimens, and they compared two methods under the same conditions, which is often the most useful thing a test programme can do: not proving an absolute strength, but showing which of two choices is better and by how much.

## A test proves something about its specimen

It is worth being exact about what a passed test proves. If a transverse tensile specimen from a qualification plate breaks in the parent metal above the required strength, it proves that this specimen, cut from this plate, welded on this day by this welder with these consumables and settings, was at least that strong. It strongly suggests that the procedure can produce welds that strong. It says nothing directly about a weld made next month with a different batch of electrodes, by a welder who has not been trained in the procedure, on plate from a different mill.

That is why qualification is combined with control. The procedure records the variables that were used when it was qualified, the standards define how far each can change before requalification is needed, and production welding is supervised to keep within them. The test proves the capability; control keeps production within the conditions that were proved.

## Hart's grain of salt

Hart opened his 1910 book with a warning that test and cost data must be taken with a grain of salt. His reasons apply to any test report a buyer is shown. A test reported by the seller of a process, on specimens prepared by its best operator under ideal conditions, shows what the process can do at its best, not what it will do in an ordinary shop. A report that gives an average without the range hides the variation that matters. A report that omits the failures, or the specimens that broke unexpectedly, overstates what was achieved. And a test made on one material, thickness or position says little about another.

Three questions take most of the salt out of a test report: who made and tested the specimens, under what conditions, and what were all the results, including the worst? A report that answers all three can be weighed; one that does not should be treated as an advertisement.

## Two ways to be wrong

Every accept-or-reject decision based on a test can be wrong in two ways. A good weld can be rejected, which wastes the cost of repair or retesting and delays the job. A bad weld can be accepted, which leaves a defect in service, where the cost of failure may be far larger. Quality engineers call these the producer's risk and the consumer's risk.

The two are traded against each other. Tighter acceptance criteria and more testing reduce the chance of accepting a bad weld, but increase the chance of rejecting good ones and the cost of testing. Looser criteria do the reverse. The right balance depends on the consequence of failure: a hopper's stiffener weld and a pressure vessel's main seam deserve different treatment. Standards and specifications strike the balance for their applications, which is one reason their acceptance criteria and test frequencies should be followed rather than improvised.

## Tests that measure and tests that screen

Some tests produce a number on a continuous scale: tensile strength in megapascals, hardness in Vickers units, impact energy in joules. Others produce a pass or fail: a bend test either cracks or does not; a radiograph either shows an unacceptable imperfection or does not. Measured results carry more information. A tensile result just above the requirement tells a different story from one far above it, while two passed bend tests look the same however close either came to cracking.

Where results are measured, the margin above the requirement and the scatter between specimens are both worth recording and watching, as Chapters 2 to 4 show. Where results are pass or fail, the number of tests and how they are chosen carry the weight, as the sampling calculation above shows.

## How far a sample can be trusted

Non-destructive testing often covers only a sample of production welds. How much can a clean sample tell you about the rest? A little probability gives a clear answer.

Suppose that a fraction p of the welds in a batch are defective, and that welds are chosen at random for testing. If the test finds every defect in the welds it examines, the chance that a single tested weld is clean is 1 − p, and the chance that all n tested welds are clean, so that the sample misses the problem entirely, is:

**P(miss) = (1 − p)ⁿ**

This is an illustration. If 5% of a batch of welds were defective, a sample of 10 would miss every one of them with probability 0.95¹⁰ ≈ **0.60**. A sample of 20 would miss them with probability about 0.36, and a sample of 45 with probability about 0.10.

```figure
type: bars
title: Chance a random sample misses every defect when 5% of welds are defective
unit: probability of finding no defective weld
max: 1
caption: Assumes random selection and a test that finds every defect it examines. Even a sample of 20 misses a 5% defect rate more than a third of the time.
- 5 welds tested | 0.774
- 10 welds tested | 0.599
- 20 welds tested | 0.358
- *45 welds tested | 0.099
```

The number of welds needed to have a 90% chance of finding at least one defective weld, when 5% are defective, is the smallest n for which 0.95ⁿ is below 0.10, which is **45**. The lesson is uncomfortable but important: a small clean sample is weak evidence that a batch is good. It is good evidence only when the process is already known to be well controlled, so that a high defect rate is unlikely to begin with. Sampling confirms control; it does not create it. A fabricator that relies on sampling to find a poorly controlled process will usually find out from its customer instead.

## Random and targeted samples

The calculation above assumes random selection. In practice, inspectors often target the welds most likely to be defective: starts and stops, tie-ins, positional welds, welds made by a new welder, and welds in highly stressed locations. Targeting makes a sample more likely to find problems, which is its purpose, but it means the result cannot be converted into a defect rate for the whole batch. A sample chosen to find problems is a good detector and a poor estimator. Inspection plans should say which kind of sample they use and why.

## The hopper fabricator's testing plan

This is an illustration. The hopper customer's specification requires:

1. a welding procedure for the 12 mm butt welds, qualified by testing a welded plate;
2. qualified welders;
3. visual inspection of all production welds;
4. non-destructive testing of a stated percentage of the butt welds, increased if defects are found.

The fabricator's plan maps each requirement to the question it answers:

```figure
type: checklist
title: The hopper fabricator's testing plan and the question each test answers
caption: This is an illustration. Each test answers a different question; together they make the case that the hoppers' welds are fit for purpose.
- x Procedure qualification plate | can this procedure produce welds with the required properties?
- x Welder qualification tests | can each welder make a sound weld with this procedure?
- x Visual inspection, 100% | are there visible imperfections in any weld?
- x Ultrasonic testing, sampled | are there internal imperfections in the butt welds tested?
- x Supervision and records | did production stay within the qualified conditions?
- *? Escalation | if a defect is found, how far does testing extend?
```

## A failure: the sample that said nothing

This is an illustration. On an earlier contract, the fabricator's customer had specified ultrasonic testing of 10% of butt weld length. The fabricator's inspector chose the lengths to test from the easiest-to-reach areas of each hopper, all of which were in the flat position, welded by the most experienced welder. All passed. When the customer's own inspector later tested other lengths, chosen from positional joints and from welds made by a new welder, two of eight lengths had lack of fusion.

The fabricator's sample had not been random and had not been targeted at the most likely problems; it had been chosen for convenience, and it said almost nothing about the welds the customer cared about. The welds were repaired, the remaining positional joints were tested in full, the inspection plan was rewritten to specify how lengths are selected, and selection was made the inspector's decision, recorded with reasons, rather than left to whoever was available.

## Exercise: a lower defect rate

Suppose the fabricator's process is so well controlled that only 1% of butt weld lengths contain a detectable defect. Calculate the probability that a random sample of 10 lengths finds no defect, and the number of lengths needed for a 90% chance of finding at least one defective length.

The probability of a clean sample of 10 is 0.99¹⁰ ≈ **0.904**, so a sample of 10 would miss a 1% defect rate about nine times in ten. For a 90% chance of finding at least one, 0.99ⁿ must fall below 0.10, which needs n ≥ ln 0.10 ÷ ln 0.99 ≈ 229.1, so **230 lengths**.

At low defect rates, sampling has almost no power to detect the occasional defect. Its value lies in catching a process that has gone wrong, when the defect rate jumps, which is why escalation rules that extend testing after a defect is found are part of most inspection plans.
