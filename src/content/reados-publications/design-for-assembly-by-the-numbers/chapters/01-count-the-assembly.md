---
book: design-for-assembly-by-the-numbers
chapterSlug: count-the-assembly-and-what-it-costs
order: 1
title: "Count the assembly and what it costs"
description: "Start a design-for-assembly review by listing every part, timing a settled build properly, costing the labour, finding where the time goes and calculating a design efficiency index."
draft: false
---

A design-for-assembly review starts with counting, not with ideas. Ideas for simplifying a product come quickly once a team looks at it, but without a count of parts, operations, seconds and dollars, there is no way to tell a good idea from a popular one, or to know afterwards whether anything improved. The count also tends to surprise people. Most teams underestimate how long their own product takes to build, and almost all of them underestimate how much of that time is spent on parts that do nothing but hold other parts together.

This chapter describes the IP-16 indexing plunger, lists its parts, times its assembly properly, costs it and calculates the design efficiency index that the rest of the book tries to improve. The failure case is the time estimate that had been used to quote the product for three years, which was out by nearly 30 seconds.

## The product

An indexing plunger locks a moving part of a machine, such as a rotary table, a swing arm or a fixture plate, in one or more set positions. Its body screws into a threaded hole in the fixed part. A hardened pin, the plunger, is pushed forward by a spring so that its nose drops into a hole in the moving part. To release it, the operator pulls the knob, which draws the nose back against the spring. To leave it released, the operator pulls and turns the knob a quarter turn, so that it rests in a "locked-out" position.

This is an illustration. The IP-16 has an M16 × 1.5 threaded body, an 8 mm diameter nose that protrudes **6.5 mm** when engaged, an 8 mm stroke, and a spring that pushes with about **25 N** when engaged and **45 N** when fully retracted. It sells to machine builders and fixture makers. The company builds about **6,000** a year at a single bench, in batches of 200.

## Revision A, part by part

```figure
type: steps
title: How revision A of the IP-16 is assembled
caption: This is an illustration. Eleven parts, each assembled once. The lock nut is the customer's mounting nut, which revision A ships screwed onto the body.
- 1 Body | placed in a holding fixture, rear end up
- 2 Wiper O-ring | stretched over the plunger's nose into its groove
- 3 Plunger | inserted into the body from the rear
- 4 Spring | dropped over the plunger's tail
- 5 Spring seat washer | placed on top of the spring
- 6 Rear cap | screwed into the body's rear thread and tightened, with the plunger's tail passing through it
- 7 Cross pin | pressed through a hole in the plunger's tail while the spring is held compressed, so that it bears on the rear cap
- 8 Knob washer | placed over the tail
- 9 Knob | pushed onto the tail
- 10 Knob screw | a small screw with thread-locking compound, driven through the knob into the tail
- * 11 Lock nut | screwed onto the body's thread
```

Every part has a reason to be there in the current design. The spring seat gives the spring a flat face to push on. The rear cap closes the body and guides the plunger's tail. The cross pin stops the spring pushing the plunger out of the front of the body, and its ends rest in a notch in the cap to give the locked-out position. The knob screw holds the knob on. The question for Chapter 2 is whether each of those reasons requires a separate part.

## Time the assembly properly

Assembly times are easy to measure badly. A stopwatch held by a supervisor watching a nervous new starter produces a number, but not a useful one. The IP-16 team followed five rules.

1. **Time a settled assembler.** The person timed had built several thousand IP-16s. A newcomer's times can be far longer, and they fall quickly with practice. This is an illustration: a new starter's fifth unit took 104 s, against 69.5 s for the settled assembler. Chapter 8 describes the learning curve that explains this.
2. **Time many builds.** Twenty consecutive builds were timed, and the average taken for each step. One build can be fast or slow for reasons that have nothing to do with the design.
3. **Separate the steps.** Each step was timed from the moment the assembler's hand moved towards a part until the hand left it in place. A video of the bench made this practical; the steps were timed from the recording afterwards.
4. **Keep testing and packing separate.** The function test at the end of the build, 6 s, and packing are real costs, but they are not caused by the parts. They are recorded separately so they do not hide changes in the assembly itself.
5. **Record the conditions.** Bench layout, fixture, tools, bin positions and batch size were written down, because changing any of them changes the times.

```figure
type: bars
title: Settled assembly time for each part of revision A
unit: s
max: 13
caption: This is an illustration. Average of 20 timed builds by an experienced assembler. Total 69.5 s, not counting the 6 s function test.
- Body into fixture | 3.5
- Wiper O-ring | 8.0
- Plunger | 4.0
- Spring | 6.5
- Spring seat washer | 4.5
- Rear cap | 9.0
- *Cross pin | 12.0
- Knob washer | 4.0
- Knob | 3.5
- Knob screw | 8.5
- Lock nut | 6.0
```

The total is **69.5 s** per unit. The longest single step is the cross pin, at 12 s, because the assembler must hold the spring compressed with one hand, line up the hole in the plunger's tail with the pin, and press the pin through with a small hand press. The O-ring takes 8 s because it must be stretched over the nose without cutting it. The knob screw takes 8.5 s because it is small, needs a drop of thread-locking compound, and must be driven to a set torque.

### Handling and insertion

The design for assembly method splits each step into two parts, and the team timed them separately from the video. **Handling** is reaching for a part, grasping it, and turning it the right way round. **Insertion** is putting it in place and doing whatever holds it there: pushing, pressing, screwing or holding it while something else is fitted. The split matters because the two halves are cured by different design changes. Handling time falls when parts are symmetrical, easy to grasp and do not tangle; insertion time falls when parts locate themselves, slide in on chamfers, need no holding down and are secured by a simple action.

For the IP-16, handling was about 26 s of the 69.5 s and insertion about 43.5 s. The split varied a great deal by part. The spring's 6.5 s was mostly handling, 5 s of it spent separating springs that had tangled in their tote. The cross pin's 12 s was mostly insertion, 9 s of holding, aligning and pressing. The spring seat washer's 4.5 s was nearly all handling: it is thin, and the assembler had to slide it to the edge of the tray to pick it up. Chapter 3 works on the handling half and Chapter 4 on the insertion half.

## Where the time goes

Grouping the steps by what they do shows where the design spends its time.

```figure
type: compare
title: Revision A's assembly time by the job each part does
cols: Parts | Time | Share of 69.5 s
caption: This is an illustration. Functional parts move, seal or carry load in a way the product needs; the rest locate, hold or join them.
- Base part | body | 3.5 s | 5%
- Parts that do the product's job | plunger, spring, O-ring, knob | 22.0 s | 32%
- *Parts that hold, join or seat other parts | rear cap, cross pin, knob screw, knob washer, spring seat washer | 38.0 s | 55%
- Part assembled only to be removed | lock nut | 6.0 s | 9%
```

More than half the assembly time goes on five parts whose only job is to locate, hold or join the parts that do the work. Together with the lock nut, which every customer unscrews before mounting the plunger through a plate, those six parts take **44 s**, or **63%** of the build. That pattern is typical of products that were designed one function at a time, and it is the target of Chapters 2 to 4.

## Cost the labour

The labour cost of assembly is the time multiplied by a fully loaded labour rate, which includes wages, on-costs, supervision and the share of the bench and building the work uses. This is an illustration: the company's rate is **A$62 an hour**, which is about **A$0.0172 a second**.

- assembly labour per unit = 69.5 s × A$62 ÷ 3,600 = **A$1.197**
- function test per unit = 6 s × A$62 ÷ 3,600 = A$0.103
- assembly labour per year = A$1.197 × 6,000 = about **A$7,182**, or about **116 hours** at the bench

The parts cost **A$16.91** per unit, bought or made: the machined body is A$7.80 and the plunger A$4.60, and the other nine parts together cost A$4.51. The unit cost of parts and assembly is about **A$18.11**, or A$18.21 with the test.

Two things follow. Assembly labour is only about 7% of the unit cost, so even halving it will not transform the product's price. And the parts that cost the most to buy, the body and plunger, are the ones that do the work, while the cheap parts, a 5-cent washer and a 7-cent pin, cost far more to assemble than to buy. A 7-cent cross pin that takes 12 s to fit costs about 21 cents to install. That ratio is the clearest sign of a part worth questioning.

## Count more than seconds

Assembly time is the most visible cost of a part, but not the only one. Every separate part also has to be specified, drawn, bought, received, checked, stored, counted and issued to the bench, and every one is a place where something can go wrong. The review team counted those as well.

```figure
type: stats
title: Revision A beyond the stopwatch
caption: This is an illustration. The cost per part number is the company's own rough estimate of purchasing, receiving inspection, storage and stocktaking time, not a measured figure.
- 11 | part numbers in the bill of materials
- 6 | suppliers, including two for small fasteners
- 4 | hand tools at the bench: hand press, torque driver, O-ring pick, thread-locker bottle
- about A$350 | yearly overhead per part number, by the company's estimate
- 1.2% | units reworked at the bench, mostly misaligned cross pins and cut O-rings
- 0.3% | units returned by customers, mostly loose knobs
```

The company's estimate of about A$350 a year per part number is rough, but it puts the 11 part numbers at about **A$3,850** a year of overhead that never appears in the product's costing, roughly half the assembly labour. Each part removed saves some of it.

The defect figures matter more than they look. Rework at the bench took about 5 minutes a unit; 1.2% of 6,000 units is 72 units, which is 6 hours of labour, about A$372 a year. Returns cost much more each, because a customer has had to find the fault, report it and send the unit back. The company estimates A$45 per return in handling, freight and replacement; 0.3% of 6,000 is 18 returns, about A$810 a year, and an unknown cost in the customer's opinion of the product. Both kinds of defect come from the same parts: the cross pin, the O-ring and the knob screw. Chapter 6 returns to them.

## A design efficiency index

The design for assembly method published by Boothroyd, Dewhurst and Knight compares the actual assembly time with an ideal one. The ideal assumes that the product has only its theoretical minimum number of parts, found with three questions described in Chapter 2, and that each of those parts is easy to handle and insert, taking about **3 s**. The design efficiency index is:

```figure
type: formula
title: Design efficiency index for revision A
formula: E = 3 s × theoretical minimum number of parts ÷ actual assembly time
caption: This is an illustration. Chapter 2 finds a theoretical minimum of 6 parts for revision A, counting the lock nut, which must stay separate so the customer can mount the plunger. The index is a comparison between designs, not a percentage to drive to 100.
- Ideal time per part | 3 s
- Theoretical minimum number of parts | 6
- Actual assembly time | 69.5 s
step: E = 3 × 6 ÷ 69.5 = 0.259, about 26%
```

An index of about **26%** says the assembly takes roughly four times as long as a design with only its essential parts, all easy to assemble, would take. The number is useful mainly for comparison: between revision A and revision B, and between products in the same company. Perfect scores are not the aim. Some parts that the minimum-part questions mark as candidates for elimination earn their place for other reasons, as Chapter 2 shows.

## A failure case: the 40-second estimate

This is an illustration. When the IP-16 was first quoted to customers, the production supervisor estimated its assembly at "about 40 seconds", and that figure went into the costing spreadsheet. Three years later nobody had checked it. The time study in this chapter found **69.5 s**.

The gap of 29.5 s per unit, at A$62 an hour, is about **A$0.508** of labour per unit that the price did not recover, or about **A$3,048** a year at 6,000 units. Over three years the company had given away about A$9,000 of assembly labour without knowing it.

The detection was the time study done for this review, not a complaint or a loss that anyone noticed. The correction was to replace the estimate in the costing spreadsheet with the measured time, add a line to the costing procedure requiring a measured time for any product built more than 1,000 times a year, and repeat the study whenever the design, the fixture or the bench changes. The quote for the next year's contract was revised.

The estimate had not been careless. Forty seconds is about how long the assembly looks like it should take, and about how long an experienced assembler thinks it takes. Human estimates of short repetitive tasks are poor, which is the reason for the stopwatch.

## How this applies to a small Australian business

Before changing a design for assembly, list every part, including fasteners and the parts nobody thinks of as parts, such as washers and pins. Time a settled assembler over many builds, step by step, and keep test and packing separate. Multiply by a fully loaded labour rate, not the wage. Look for cheap parts that are slow to fit, and for parts assembled only to be undone. Use the design efficiency index to compare designs, and replace estimated assembly times in costings with measured ones.

## Exercise: the smaller plunger

The company also makes the IP-12, a smaller plunger with the same 11 parts. Its timed steps, in the same order as revision A of the IP-16, are **3.0, 7.0, 3.5, 6.0, 4.0, 8.5, 11.0, 3.5, 3.0, 8.0 and 5.5 s**. It is built about **4,000** times a year at the same A$62 an hour. What are its total assembly time, its labour cost per unit and per year, and its design efficiency index if its theoretical minimum is also 6 parts?

**Worked answer.** The total is **63.0 s**. The labour per unit is 63.0 × 62 ÷ 3,600, about **A$1.085**, and per year about A$1.085 × 4,000, roughly **A$4,340**. The design efficiency index is 3 × 6 ÷ 63.0, about **28.6%**. The IP-12 is slightly quicker to build because its parts are smaller and lighter, but its index is almost the same as the IP-16's, because the design has the same structure. A redesign of the IP-16 is likely to apply to the IP-12 as well, which is worth knowing before the review starts.
