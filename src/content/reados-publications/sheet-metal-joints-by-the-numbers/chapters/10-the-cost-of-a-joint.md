---
book: sheet-metal-joints-by-the-numbers
chapterSlug: the-cost-of-a-joint
order: 10
title: "The cost of a joint"
description: "Cost a sheet joint as part, hole, setting time, tooling and quality, total a product's joints, compare methods with payback, and catch rivets priced against a tool by part cost alone."
draft: false
---

A rivet costs a few cents; a joint costs much more. Its price includes the hole that must be punched or drilled and deburred, the seconds it takes to set, the tool that sets it and that tool's wear, the inspection that checks it and, now and then, the rework when it goes wrong. Across a product with a hundred and fifty joints, those seconds and cents become a real share of the product's cost, and decisions between methods that look obvious on part price alone often reverse once the labour is counted.

This chapter builds the cost of a joint from its parts, totals EN-700's joints, compares clinching with blind riveting at production volume, and includes the cost of getting a joint wrong. The running case finds that a proposal to drop the clinching tool in favour of blind rivets, made because rivets cost only a few cents each, would have added about A$20 to every enclosure.

## What a joint costs

The cost of one joint has five parts:

- **the part**: the rivet, nut, stud or screw, if there is one;
- **the hole**: punched in the flat blank, usually a second of machine time, or drilled and deburred at assembly, which takes much longer;
- **setting**: the seconds of labour to load and set the fastener or make the clinch;
- **tooling**: the setting tool's or die's cost spread over the joints it makes, plus its wear;
- **quality**: inspection, coupon testing and the expected cost of rework.

This is an illustration, in Australian dollars excluding GST, with labour at A$95 an hour and punching machine time at A$120 an hour. Each second of labour then costs about 2.6 cents, and each second of machine time about 3.3 cents.

```figure
type: compare
title: Cost of one joint by method, ex GST
cols: Part | Hole and setting time | Cost per joint
caption: This is an illustration. Times and prices are examples, not quotations; a fabricator's own records give its real figures. Tooling for the clinch is counted separately below.
- *Clinch | None | 2 s; plus about A$0.002 of die wear | A$0.055
- Blind rivet, hole punched in the blank | A$0.06 | 1 s punching, 5 s setting | A$0.225
- Blind rivet, hole drilled at assembly | A$0.06 | 15 s drilling, deburring and setting | A$0.456
- Self-clinching nut | A$0.30 | 6 s pressing, hole punched | A$0.458
- Blind rivet nut, hole drilled | A$0.25 | 14 s drilling and setting | A$0.619
```

The table's pattern is typical. The part's price is often the smallest share of the joint's cost; the hole and the setting time dominate, and a joint that needs its hole drilled at assembly costs about twice one whose hole was punched with the blank.

## The running case: EN-700's joints

This is an illustration. Using similar figures for each kind of joint, EN-700's joints cost per enclosure:

```figure
type: stack
title: Cost of EN-700's joints per enclosure, ex GST
unit: A$
caption: This is an illustration. About A$19 per enclosure, a third of it in the 116 clinches, which are the cheapest joint each but the most numerous.
- 116 clinches | 6.35
- 4 bracket rivets | 1.66
- 12 hinge rivets | 2.94
- 10 self-clinching nuts | 4.58
- Earth stud | 0.56
- 6 cable plate screws | 2.48
- Rain-hood seam | 0.79
```

The total is about **A$19.38** per enclosure, excluding the parts being joined, the seam sealant and the testing of Chapter 9. The self-clinching nuts, only ten of them, cost almost as much as the 116 clinches, because each nut is a bought part and each clinch is not.

## Consumables

Some joint costs are not per joint but per metre or per batch. EN-700's seams carry a sealant bead along about 5.8 m; at an illustrative A$0.40 per metre of bead, applied and tooled, that adds about **A$2.32** per enclosure, bringing its joint cost to about A$21.70. Isolating tape under the coastal hinge, thread-locking compound on the equipment plate's screws and touch-up paint on any damaged coating are similar costs. They are small per enclosure and easy to forget in an estimate, which is exactly why a joint schedule that lists them, line by line, produces better estimates than one that lists only fasteners.

## The error: rivets priced by the part

This is an illustration. When a large order was expected, the fabricator's clinching tool was due for replacement, at about **A$6,000**. A proposal circulated to replace it with blind rivets for the body seams, on the grounds that 116 rivets at A$0.06 cost under A$7 an enclosure, "much less than a new tool".

The comparison set a part cost against a tool cost and left out the labour. Costed properly, as the table above does, a seam joint costs about A$0.055 clinched and about A$0.225 as a blind rivet in a punched hole. Over 116 joints, that is about **A$6.35** against about **A$26.13** per enclosure, a difference of about **A$19.78** in the clinch's favour. The tool pays for itself after about 6,000 ÷ 19.78 = **303 enclosures**, about six months of the expected volume of 600 a year, and saves about **A$11,870** a year after that. If the rivet holes had to be drilled at assembly instead of punched, the difference would be about A$46.52 per enclosure and the payback about 129 enclosures.

```figure
type: bars
title: Body seam joints per enclosure, by method, ex GST
unit: A$
max: 55
caption: This is an illustration for 116 joints. The clinch's tool, at about A$6,000, pays back after about 303 enclosures against punched-hole rivets.
- *Clinched | 6.35
- Blind rivets in punched holes | 26.13
- Blind rivets in drilled holes | 52.88
```

The proposal was withdrawn and the tool replaced. The general lesson is that joint costs must include labour and holes, and that a tool's cost is weighed against the labour it saves over the volume it will make, not against the price of the parts it replaces.

## Joints against the sheet they join

It helps to compare a product's joint cost with something familiar. This is an illustration. EN-700's body uses about 1.3 m² of 1.2 mm galvanised sheet, about 12.2 kg, which at an illustrative A$2.40 per kilogram costs about **A$29.40**. Its joints, at about A$21.70 including sealant, cost about **74%** as much as the sheet of the body they hold together. Designers who pay close attention to sheet usage and nesting often pay much less attention to joints, though in a product like EN-700 the joints are nearly as large a cost, and more of that cost is labour, which is where savings are usually easiest to find.

## Where the times come from

The times in this chapter are illustrations. A fabricator's real figures come from timing its own work: a few dozen joints of each kind, set by different operators at the production bench, give an average and a spread. Times fall as a team repeats a job and rise with awkward access, small batches and frequent tool changes, so a figure timed on a long run of one product may be optimistic for a short run of another. The figures should be revisited when the method, the tooling or the product changes, and they should include the small actions that are easy to forget: picking the fastener, positioning the part, changing the tool, checking the joint.

## Time is also capacity

Joint time is not only cost; it is capacity. This is an illustration. EN-700's 116 body seam joints take about **3.9 minutes** to clinch and about **29 minutes** as drilled blind rivets. For a batch of 50 enclosures, that is about 3 hours against about 24 hours of assembly time, three working days at the assembly bench for the same output. When the bench is the bottleneck, as it often is in a small fabricator, the slower method costs not only its labour but the orders that cannot be taken while the bench is full.

## The cost of quality

Inspection and testing cost money, and so does their absence. This is an illustration. Each spun self-clinching nut in Chapter 6's error meant replacing a bracket, about A$4.50 of part and half an hour of labour, about **A$52** per bracket, before counting the delay. The shift check of clinch bottom thickness in Chapter 5 takes a few minutes per shift and caught a fault that would have required re-clinching a batch of roofs. The coupon tests of Chapter 9 found a drilling error before it reached production. Each check costs far less than the fault it catches, and the joint's cost estimate should include the routine checks, as a few cents per joint or a few minutes per shift.

## Designing out joints

The cheapest joint is the one that is not needed. EN-700's body could, in principle, fold two of its corners from one blank instead of seaming them, removing a seam and its 25 or so clinches, at the cost of a larger, more awkward blank. Its two brackets could become one folded shelf with fewer rivets. Its earth stud could be replaced by an earthing tab formed in the door's edge. Each such change trades joint cost against part complexity, blank size or tooling, and each is worth pricing with the method of this chapter before the design is frozen. Joints are much cheaper to remove on a drawing than on a production line.

## Volume changes the answer

At low volume, joints that need little tooling win: blind rivets in drilled holes need only a drill and a hand riveter, and suit a prototype or a run of ten. At higher volume, joints with tooling and short cycle times win, because the tooling's cost is spread thinly and the seconds saved are multiplied. The crossover point is where the extra tooling cost equals the labour saved, the payback calculation above. A fabricator that makes the same product at very different volumes over its life may rightly change method as the volume grows, and the joint schedule should record which method applies at which volume, with the coupon tests of Chapter 9 for each.

## Tooling life

A clinching die, a rivet nose-piece and a self-clinching press tool each wear, and their replacement is part of the joint's cost. The die-wear figure in the table above, about A$0.002 per clinch, is the die's cost divided by the number of clinches it makes before it must be replaced, which the trend checks of Chapter 5 tell the fabricator in its own conditions. A worn tool does not only cost its replacement, which for EN-700's clinching die is planned from its trend chart; it makes weaker joints for a while before it is noticed, so a planned replacement at a known joint count is cheaper than a replacement forced by a failed check.

## A joint cost sheet

The figures of this chapter fit on one sheet, one row per kind of joint, with columns for the count per product, the part's price, the hole method and its time, the setting time, the tooling allowance, the consumables and the quality allowance, and a total. EN-700's sheet has eight rows. It is updated whenever the joint schedule changes, and it feeds the product's cost estimate directly, so that a design change that adds ten rivets shows up as dollars before anyone approves it. Kept beside the joint schedule of Chapter 1, it gives each joint both its engineering requirement and its price, which is the information a design review needs to make a sensible trade between them.

## The book's checks together

Every chapter of this book found a joint going wrong and the check that caught it. Gathered, they make a short review for any mechanical joint in sheet.

```figure
type: checklist
title: Checks for a mechanical sheet metal joint
caption: This is an illustration that gathers the checks from each chapter. Most take minutes on a drawing or at a bench.
- Requirement | Load, environment, sealing, access and service written down for each joint
- Strength | Shear, bearing, net section and tear-out checked in every sheet
- Layout | Edge distance, pitch and prying tension checked for every load direction
- Fastener | Part number with grip range, hole size, head, material and type
- Tooling | Die, groove or nose-piece matched to the actual sheets
- Threads | Torque set below torque-out, with the reason recorded
- Mixed metals | Every contact judged by series, wetness and area ratio
- Test | Pass criterion written first; every specimen and failure mode recorded
- x Cost judged on part price alone | The error of this chapter
```

None of these checks needs special equipment or software. Each compares two numbers that should agree, a load with a strength, a torque with a torque-out, a grip with a range, a coupon's failure mode with the design's prediction, a tool cost with the labour it saves, and asks why when they do not. EN-700 met each of its faults in development or at the start of production, where they cost a prototype, a batch of hinges or a shift's roof panels. The same faults found in the field would have cost a recall of enclosures from customers' sites. A mechanical joint in sheet is a small thing, and a product is made of a great many of them; the habit of checking each one, and recording why it is the way it is, is what keeps the product together.

## Exercise: self-clinching nuts or rivet nuts

EN-700's ten nuts are self-clinching, pressed into punched holes. A proposal suggests blind rivet nuts in drilled holes instead, so that the nuts can be fitted after the enclosure is folded. Using the illustrative costs above, what would the change cost per enclosure and per year at 600 enclosures? What else should be weighed?

**Worked answer.** Ten self-clinching nuts cost about 10 × A$0.458 = **A$4.58** per enclosure; ten rivet nuts in drilled holes about 10 × A$0.619 = **A$6.19**. The change adds about **A$1.61** per enclosure, about **A$966** a year at 600 enclosures.

The cost is modest, so the decision rests on the other factors. Rivet nuts can be fitted after folding and from one side, which may simplify assembly if the self-clinching nuts' pressing is awkward once the parts are formed. They are weaker in torque-out than self-clinching nuts in the same sheet, as Chapter 6 noted, so the assembly torques must be reviewed and probably reduced, and coupons tested. And a drilled hole brings back a cut edge in the galvanised sheet at every nut. If the self-clinching nuts are pressed into the flat blanks before folding, as is usual, the original method is both cheaper and stronger, and the proposal solves a problem that a change of operation sequence could solve instead.
