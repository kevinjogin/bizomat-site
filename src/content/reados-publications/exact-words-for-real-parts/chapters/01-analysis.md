---
book: exact-words-for-real-parts
chapterSlug: analyse-before-you-argue
order: 1
title: "Analyse before you argue: from a complaint to statements a measurement can settle"
description: "Apply Russell's method of analysis to a customer complaint: break a vague, complex claim into simple statements, find what would settle each one, and set up the bracket case."
draft: true
---

The message from the customer's site supervisor is four words long: "Your brackets don't fit." It arrives with a photograph of a camera module hanging from one screw and a request for 30 replacement brackets by the end of the week. Within an hour, three people at the workshop have three different explanations. The machinist blames the customer's screws. The quality lead blames the coordinate measuring machine. The owner wants to know whether the customer is about to stop paying.

None of them is yet arguing about anything definite. "Doesn't fit" is a single phrase that hides a dozen separate claims about holes, screws, threads, positions and people. Until those claims are separated, every argument about the complaint is an argument about different things. This chapter introduces the running case and the first of Russell's tools: analysis, the habit of breaking a complex claim into simpler claims that can each be checked.

## What Russell meant by analysis

Russell described his way of doing philosophy as analytic. In *Our Knowledge of the External World* (1914) and in a 1907 paper on the premises of mathematics, he set out a method that starts with something we already accept but cannot yet explain, and works backwards to the simplest statements from which it follows. The starting point is usually familiar and complex. The end point is a small set of simpler statements, each clearer than the starting point and each open to separate examination.

Two features of the method matter for engineers. First, analysis runs from the vague to the precise, not the other way round. You do not begin with exact definitions; you begin with what people actually say and refine it. Second, the simple statements are not guaranteed to be true. Analysis exposes what a claim depends on. Whether those dependencies hold is a separate question, answered by evidence.

Russell applied the method to arithmetic, to physical objects and to language. The engineering version is less ambitious and more immediately useful. A complaint, a requirement or a sign-off is a complex claim. Analysis turns it into a list of simple claims, each paired with the measurement or record that would settle it.

```figure
type: steps
title: Analysis applied to an engineering claim
caption: The method runs from what people say to what a measurement can settle. Each step narrows the claim; none of them yet decides whether it is true.
- State the claim as it was made | in the speaker's words, without correcting it
- Name the function behind it | what has to happen for the claim to be false
- Break the function into conditions | each condition a single property of a single thing
- * Pair each condition with a test | the measurement or record that settles it
- Order the tests | cheapest and most discriminating first
```

## The running case

This is an illustration. A small contract machining workshop in regional Australia has delivered 60 camera brackets, part CB-12, to a builder of inspection stations for packaging lines. The price was A$85 per bracket excluding GST: A$5,100 for the order, or A$5,610 including 10% GST. The customer builds ten lines, each with six camera modules, and each module is held by one bracket. The order covers exactly the 60 modules.

Each bracket is a plate of 6061-T6 aluminium, 120 × 80 × 12 mm. The drawing, revision B, shows ten characteristics:

| No. | Characteristic | Requirement |
| --- | --- | --- |
| 1 | Thickness | 12.00 ± 0.05 mm |
| 2 | Central bore, datum B | Ø20 H7 |
| 3 | Dowel hole, datum C | Ø6 H7, on the X axis |
| 4 to 7 | Four clearance holes | Ø6.6 to Ø6.8 mm, on a Ø90 mm pitch circle at 45°, 135°, 225° and 315° |
| 4 to 7 | Position of those holes | Ø0.3 mm at maximum material condition, relative to A, B and C |
| 8 | Flatness of the base face, datum A | 0.05 mm |
| 9 | Length | 120 ± 0.2 mm |
| 10 | Width | 80 ± 0.2 mm |

The four clearance holes count as four characteristics, each carrying both its size and its position. With ten characteristics on each of 60 brackets, the order involves 600 separate results. That number returns in Chapters 3 and 8.

Each camera module has four M6 tapped holes on the same 90 mm pitch circle. The fitter puts an M6 × 16 screw and washer through each bracket hole into the module. The workshop machined the brackets in two set-ups: brackets 1 to 30 on the first fixture, and brackets 31 to 60 after the fixture was removed for another job and refitted. The workshop issued a certificate of conformance stating that all 60 brackets conform to drawing CB-12 revision B.

Thirty brackets will not take their screws. Those are the facts on day one. The workshop, customer, drawing and measurements are invented for this book and are not BIZOMAT work.

## Analysing "doesn't fit"

Start where the method says: with the claim in the speaker's words. "Your brackets don't fit" is a claim about an assembly failing to go together, with the blame placed on one part. Before deciding whether the blame is right, name the function. For the screws to fit, each of the four screws has to pass through a clearance hole in the bracket and engage the thread in the module, all at once, without force.

That function breaks into conditions about single properties of single things. A screw passes through a hole if the hole is larger than the screw and the hole's centre sits close enough to the thread's centre. The assembly works if that holds at all four places at the same time. Russell would recognise the move: a statement about a whole is replaced by statements about its parts and how they are related.

```figure
type: tree
title: "Doesn't fit", analysed into conditions
caption: Each leaf is a property of one thing that a measurement can settle. The highlighted branch is where the clearance between screw and hole is used up.
- The screws will not enter the module | the complaint as stated
  - The screws are as specified | M6, no larger than 6.0 mm over the thread
  - The bracket holes are large enough | each at least Ø6.6 mm
  - The module threads are sound | M6 thread, clean, full depth
  - * Each hole centre is close enough to its thread centre | the gap between hole and screw covers the misalignment
    - Bracket holes are in position | within Ø0.3 mm at MMC of true position
    - Module threads are in position | within their own share of the tolerance
    - Both parts are located the same way | the bore and dowel on the bracket match the module's spigot and pin
```

The tree does several things at once. It shows that "doesn't fit" could be true for reasons that have nothing to do with the bracket: wrong screws, damaged threads, a mislocated module. It shows that the bracket can be at fault in two different ways: holes too small, or holes in the wrong place. And it shows that position is a relation between two parts, not a property of one, which is why the drawing divides the allowance between them.

## Where the allowance comes from

The highlighted branch is the one that needs numbers. When a screw is held in a tapped hole in one part and passes through a clearance hole in the other, the arrangement is called a fixed fastener. The gap between the smallest clearance hole and the largest screw is all the misalignment the joint can absorb. The designer divides it between the two parts as position tolerances.

```figure
type: formula
title: Fixed-fastener position tolerance
formula: H − F = T1 + T2
caption: This is an illustration. The bracket and the module each receive half of the 0.6 mm available. The formula assumes zero clearance at the worst case and ignores the screw's tilt in the thread.
- H | smallest clearance hole, at maximum material condition, mm
- F | largest fastener, at maximum material condition, mm
- T1 | position tolerance of the clearance holes, diameter, mm
- T2 | position tolerance of the threaded holes, diameter, mm
step: H − F = 6.6 − 6.0 = 0.6 mm
step: Bracket share T1 = 0.6 × 50% = 0.3 mm diameter at MMC
step: Module share T2 = 0.6 − 0.3 = 0.3 mm diameter at MMC
step: Radial misalignment the joint absorbs = 0.6 ÷ 2 = 0.3 mm
```

The [Fastener Position Tolerance](/tools/fastener-position-tolerance/) tool does this split. Set the case to fixed fasteners, enter the smallest clearance hole as 6.6 mm, the largest fastener as 6.0 mm and the bracket's share as 50%, and it returns Ø0.3 mm at MMC for each part. It also checks one measured hole from its X and Y deviations and its size, adding bonus tolerance when the hole is larger than its minimum. It does not include the screw's tilt in the thread, datum shift or the projected tolerance zone of the threaded part, which it flags for you to check.

The analysis has now produced a statement that a measurement can settle: "each bracket hole centre lies within a Ø0.3 mm zone, plus any bonus from its size, around its true position relative to datums A, B and C". That is a far cry from "doesn't fit", and it is something an inspector can check in minutes.

## Ordering the tests

A list of conditions is not yet a plan. Analysis also tells you which tests to run first. The best first test is cheap and splits the possibilities cleanly. Measuring every hole on every bracket is thorough but slow. Swapping parts is fast and points straight at the faulty one.

The workshop's quality lead drives to the customer's site and runs four quick checks with the fitter:

1. Measure six screws from the customer's stock with a micrometer over the thread crests. All are between 5.94 and 5.97 mm, so the screws are within the M6 limits and below 6.0 mm.
2. Try a 6.6 mm plug gauge in the holes of five failing brackets. It enters every hole, so the holes are not undersized.
3. Swap modules. A bracket from the first box fits a module that a failing bracket would not fit, and a failing bracket fails on two other modules. The fault follows the bracket.
4. Sort the failing brackets by serial number. All 30 are numbered 31 to 60: the second set-up.

```figure
type: compare
title: What each quick test ruled in or out
cols: Result | Conclusion
caption: This is an illustration. Four cheap tests reduce a dozen possible causes to one branch of the tree.
- Screw diameter | 5.94 to 5.97 mm | screws are not the cause
- Plug gauge Ø6.6 mm | enters every hole | holes are not undersized
- Module swap | fault follows the bracket | the module threads are not the cause
- * Serial numbers | failures are 31 to 60 only | something changed between set-ups
```

The analysis has not proved what is wrong. It has removed most of the possibilities and pointed to a single condition: the position of the holes on the second-set-up brackets. Chapter 4 constructs the hole positions from measurements, and Chapter 7 shows why the workshop's own measuring machine passed parts that do not fit.

## Failure: analysing at the wrong level

Analysis can fail in two directions. It can stop too early, leaving a claim that still hides several conditions, or it can go further than any decision needs.

The workshop's first internal note stopped too early. It read: "Second-box brackets out of tolerance, remake." That sounds definite, but it is still a complex claim. Out of tolerance on which characteristic? Every bracket in the second box, or the five that were tried? Remade to the same set-up that produced them? A remake ordered on that note would likely repeat the fault, because the note names a symptom and a batch but not a condition.

The detection test is simple. For each statement in the note, ask what single measurement would show it to be false. If no single measurement would, the statement has not been analysed far enough. "Out of tolerance" fails the test; "the position of holes 4 to 7 on brackets 31 to 60 exceeds Ø0.3 mm at MMC relative to A, B and C" passes it.

The opposite error appeared in the first draft of the investigation plan, which listed every one of the ten characteristics on every bracket for re-inspection, including length, width and edge breaks. None of those can stop a screw entering a hole. Analysis that goes past the function wastes time and buries the useful results among irrelevant ones. The correction is to return to the function named in the second step and keep only the conditions that bear on it.

| Symptom of poor analysis | Detection | Correction |
| --- | --- | --- |
| A statement no single test could falsify | Ask what measurement would show it false | Split it until each part has one test |
| Conditions that cannot affect the function | Trace each back to the function | Drop them from this investigation |
| A list with no order | Ask which test splits the possibilities most | Run cheap, discriminating tests first |
| Blame assigned before analysis | Check whether the tree has branches for other parts | Keep every branch until a test closes it |

## Analysis is not decomposition for its own sake

It is tempting to treat analysis as a filing exercise: break everything into small pieces and number them. Russell's interest was in what the pieces explain. The simpler statements matter because the complex one follows from them. If the simple statements are all true, the complex one must be; if the complex one is false, at least one simple statement is false, and the tests will find it.

That is why the tree in this chapter is organised by function rather than by the drawing's list of characteristics. The drawing lists what was specified. The tree lists what has to be true for the screws to go in. The two overlap, but they are not the same. The bore and dowel, for example, appear on the drawing as size characteristics. In the tree they appear as the means by which the bracket is located against the module, which is a much more important role than their diameters suggest. Chapter 7 shows how ignoring that role let the fault through.

## What analysis gives the people involved

There is a human benefit too. The machinist, the quality lead and the owner were each defending a whole explanation. Once the complaint was analysed, each explanation became a branch with a test attached, and the tests settled them in an afternoon. Nobody had to win an argument. The screws were measured, the holes were gauged, the modules were swapped, and the conclusion followed.

The supervisor's original message can now be answered with something better than an apology. The workshop knows which 30 brackets are affected, which condition fails on them, and that the screws and modules are not the cause. It does not yet know why, or how its own inspection missed it. Those questions run through the rest of the book.

## Exercise: analyse "the bore is a good fit on the spigot"

The customer's design engineer adds a second concern: "I'm not sure the bore is a good fit on the spigot either." The module's locating spigot is specified as Ø20 g6, which is 19.980 to 19.993 mm. The bracket bore is Ø20 H7, which is 20.000 to 20.021 mm. Analyse the concern into statements a measurement can settle, give the clearance range, and say which statements are about the bracket and which are about the module.

**Worked answer.** Start with the function: the bracket must slide onto the spigot by hand and locate the bracket's centre on the module's centre closely enough for the hole pattern to line up. That breaks into four statements. The bracket bore diameter is between 20.000 and 20.021 mm, a statement about the bracket, settled by a bore gauge or the coordinate measuring machine. The spigot diameter is between 19.980 and 19.993 mm, a statement about the module. The bore is round and square to datum A within whatever the drawing allows, a statement about the bracket. The clearance between them is enough to assemble but small enough to locate. The clearance runs from 20.000 − 19.993 = 0.007 mm at the tightest to 20.021 − 19.980 = 0.041 mm at the loosest, so the bracket's centre can sit up to 0.041 ÷ 2 = 0.0205 mm off the spigot's centre, well inside the 0.3 mm radial allowance from the fastener calculation. "A good fit" therefore analyses into two diameter checks, one form check and a clearance that the limits already guarantee. If the engineer's concern persists after the diameters are measured, it is about something else, and the next question is what.
