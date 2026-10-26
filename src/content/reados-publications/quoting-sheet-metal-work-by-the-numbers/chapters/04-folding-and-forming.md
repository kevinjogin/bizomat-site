---
book: quoting-sheet-metal-work-by-the-numbers
chapterSlug: folding-and-forming
order: 4
title: "Folding and forming"
description: "Estimate press brake time from a count of bends and hits, keep set-ups apart from running time, allow for hems and awkward parts, and catch four hems left out of a bend count."
draft: false
---

After cutting, most sheet metal parts are folded, usually on a press brake. Folding time is easy to estimate badly, because the obvious count, the number of bends on the drawing, is only part of it. Each bend needs the part positioned against the back gauge, the bend made and the part turned or flipped for the next; some bends need two hits, such as a hem that is pre-bent and then flattened; some parts are large or awkward and need two people; and each part type needs the brake set up with its tools and programme and a first part checked. Set-ups and running time behave differently with quantity, and a quote must keep them apart.

This chapter estimates EN-700's folding from a count of bends and hits, prices the running time and the set-ups separately, and covers hems, large parts and the order of bends. The running case finds that a first estimate counted every bend on the drawings but left out the extra hits for four hems and the hemming tool's set-up.

## Counting bends and hits

Each part's bends are counted from its drawing or flat pattern. For quoting, the count that matters is **hits**: each stroke of the brake. A simple bend is one hit. A hem, a fold flattened back on itself, is usually two: a pre-bend to about 30° in a hemming or acute tool, then a flattening hit. A bend that the brake cannot make in one setting, such as one that would collide with a previous flange, may need a different tool and a separate setting.

This is an illustration. EN-700's parts have:

```figure
type: compare
title: Bends and hits in EN-700's parts
cols: Bends | Of which hems | Hits
caption: This is an illustration. Each hem adds a second hit, and the hems need their own tool set-up.
- Back panel | 4 | 0 | 4
- Side panels, two | 8 | 0 | 8
- Roof, with drip edge | 4 | 1 | 5
- Base | 4 | 0 | 4
- Rain hood | 3 | 1 | 4
- Brackets, two | 2 | 0 | 2
- *Door, with hemmed returns | 4 | 2 | 6
- Equipment plate, cable plate | 0 | 0 | 0
```

In total, **29 bends**, of which **4 are hems**, giving **33 hits**. Each hem also needs the part turned and repositioned between its pre-bend and its flattening hit, which the estimate allows as one more hit-equivalent per hem. The estimate therefore prices **37** hits per enclosure: 29 for the bends and 8 for the four hems' extra hits and handling.

## Time per hit

The time per hit includes picking up the part, positioning it against the gauge, making the bend and putting it down or turning it for the next. For small and medium panels on a modern CNC brake, a figure of around 10 to 15 seconds per hit is common; large, heavy or awkward parts take longer. This is an illustration. EN-700's estimate uses **12 seconds** per hit, so its 37 hits take about 444 seconds, **7.4 minutes** per enclosure. At an illustrative brake rate of A$110 an hour, the running time costs about **A$13.57** per enclosure.

## Set-ups

Each part type must be set up on the brake: the right punch and die fitted, the programme loaded, a first part bent and checked against its drawing. This is an illustration. EN-700 has eight bent part types. At about **15 minutes** each, the set-ups take about 2 hours per batch, about **A$220** at the brake rate. The hems need a hemming tool fitted, about **20 minutes**, about A$36.67, once per batch.

Set-ups are a cost per batch, not per enclosure. At 20 off, the brake's set-ups of about A$256.67 add about A$12.83 per enclosure; at 200 off, about A$1.28. That is the single largest reason, along with the other set-ups of Chapter 7, that small batches cost more per unit.

```figure
type: bars
title: Brake set-up cost per enclosure, by batch size, ex GST
unit: A$
max: 14
caption: This is an illustration. About A$256.67 of brake set-ups per batch, including the hemming tool, spread over the batch.
- 20 off | 12.83
- *50 off | 5.13
- 200 off | 1.28
```

## The error: four hems left out

This is an illustration. The estimator's first count took the bends from the parts' drawings, 29 of them, and priced 29 hits at 12 seconds. The drawings showed the roof's drip edge, the rain hood's front edge and the door's two returns as hemmed, but the estimator counted each hem as a single bend and did not allow for the hemming tool.

The four hems' extra hits and handling, 8 hits at 12 seconds, add about **96 seconds**, about **A$2.93** per enclosure, and the hemming tool's set-up adds about A$36.67 per batch, about A$0.73 per enclosure at 50 off. In total, the omission understated folding by about **A$3.67** per enclosure at 50 off, about A$183 on the batch, and more at 20 off, where the hemming set-up is spread over fewer enclosures.

The review found it by reading the drawings' bend notes rather than counting bend lines: "hem" on a drawing means two operations and a different tool. The fix was to add a hem column to the estimating sheet, so that hems are counted separately and their tool set-up appears automatically.

## Sequencing batches to save set-ups

Set-ups can be shared. If two jobs use the same punch and die, running them one after the other saves a tool change; if the same part is needed by several orders, running them together saves a whole set-up. A shop that plans its brake work in sequences of compatible tooling can cut its set-up time substantially. A quote, though, should normally carry the set-ups the job needs on its own, for the same reason as Chapter 2's nesting: the shop cannot count on compatible work running alongside it. Where a customer's repeat orders are predictable, a quote that offers a lower price for a call-off schedule that lets the shop combine set-ups is a fair way to share the saving.

```figure
type: steps
title: Folding one EN-700 part type at the brake
caption: This is an illustration of where the time goes. The first three steps happen once per part type per batch; the last two once per part.
- Fit tools | Punch and die for the part's bends; hemming tool if the part has hems
- Load programme | Back gauge positions and bend angles for each bend in sequence
- *Bend and check a first part | Measured against its drawing; adjustments made
- Bend the batch | Each part through its hits in sequence
- Check a sample | Angles and flange lengths at intervals through the batch
```

## Scrap at the brake

Some parts are spoiled in folding: a flange bent the wrong way, a part loaded against the wrong gauge stop, an angle out of tolerance that cannot be corrected. Each spoiled part costs its material, its cutting and the folding done so far, and a replacement must be cut. A first part bent wrongly during set-up is expected and belongs in the set-up time; parts spoiled during the run belong in a scrap allowance. This is an illustration. If one EN-700 part in a hundred is spoiled at the brake, and a spoiled part costs on average about A$12 in material and earlier operations, the allowance is about A$0.12 per part, or about A$1.20 per enclosure across its ten bent and cut parts. Chapter 9 combines such allowances into one risk line.

## Offline programming

Modern brakes are programmed offline, from the part's 3D model, which calculates the bend sequence, checks for collisions and sets the back gauge positions before the part reaches the machine. Offline programming moves time from the brake, where it costs the machine's rate, to an office, where it costs a programmer's. For a new job, the programming is a one-off cost, like the laser's in Chapter 3; for a repeat, it is already done. EN-700's brake programmes are included in the two hours of programming already allowed for the job.

## Large and awkward parts

A part's size and stiffness change its handling. EN-700's back panel, 740 × 540 mm in 1.2 mm sheet, is floppy enough that one person can bend it but must support it carefully; a panel twice that size may need two people, which doubles the labour per hit, or a sheet follower on the brake. Long, narrow parts are awkward to turn; small parts are fiddly to position and may need a special gauge. The estimate's time per hit should vary with the part: perhaps 8 seconds for EN-700's small brackets and 15 for its back panel, rather than one average for everything. The average of 12 seconds used here is reasonable for a product of mixed, moderate parts; for a quote dominated by large panels it would be optimistic.

## Bend sequence and collisions

Parts are bent in an order that lets each flange clear the brake's tools and the previous flanges. A box-like part, with flanges on all four sides, may need special deep or gooseneck tools to fold its last flanges without colliding. If the standard tools cannot make the part, the quote must include either the special tooling or a design change. The estimator should check every part with return flanges, closed boxes or short flanges near holes, and ask the production team if in doubt. EN-700's door, with returns on all four edges, folds with the shop's standard gooseneck punch, which the production team confirmed before the quote went out.

## Tolerances and inspection at the brake

Tight angular or dimensional tolerances slow folding: the operator checks more parts, adjusts more often and scraps more. A drawing with general tolerances suited to the process folds at the standard rate; one with tight tolerances on every flange does not. *Sheet Metal Parts by the Numbers* covers what tolerances a folded part can reasonably hold. For quoting, a tight-tolerance part should carry a longer time per hit, more inspection time and a scrap allowance, and the quote can usefully say which tolerances are driving the price, so that the customer can relax those that do not matter.

## Other forming operations

Press brakes are not the only forming in sheet metal work. Rolling a cylinder, flanging a disc, forming a louvre or a bead in a punch press, and inserting self-clinching fasteners in a press are all forming operations with their own set-up and running times. Each is estimated the same way: count the operations per part, time each one, price at the machine's rate and keep the set-ups separate. EN-700's ten self-clinching nuts are pressed into their flat blanks before folding, about 6 seconds each in this illustration, and are priced with the joining of Chapter 5 rather than here.

## When the brake is the bottleneck

In many sheet metal shops the press brake, not the laser, limits how much work the shop can do, because a laser cuts a sheet of parts in minutes while each of those parts must then be folded one hit at a time. This is an illustration. At 7.4 minutes of running time per enclosure plus set-ups, a batch of 50 EN-700s needs about 6.2 hours of running time and about 2.3 hours of set-ups, roughly 8.5 hours of brake time: a full shift. If the brake is already booked for the next two weeks, the quote's lead time must allow for it, and a job that needs a shift of brake time at short notice may displace other work, which has a cost of its own. Brake capacity is therefore part of the lead-time check of Chapter 1, and a quote for a large batch should be checked against the brake's schedule, not only priced at its rate.

## The folding line in summary

For EN-700 at 50 off, folding costs about A$13.57 per enclosure in running time and about A$5.13 per enclosure in set-ups, about **A$18.70** in all, almost exactly the same as the laser's line, although the brake's hourly rate is lower, because folding takes longer per enclosure than cutting. At 20 off the set-ups raise it to about A$26.40; at 200 off it falls to about A$14.85. The figures come from a count of hits and a time per hit, both checkable, and from a set-up time per part type that the shop's own records can confirm, as Chapter 10 does when it compares the job's actual times with the estimate.

## Exercise: a two-person back panel

Suppose the customer's next product has a back panel 1,480 × 1,080 mm, double EN-700's in each direction, which needs two people at the brake for its four bends, at 20 seconds per hit, at a labour rate of A$95 an hour for the second person in addition to the brake's A$110 an hour. What do its bends cost per panel, and how does that compare with EN-700's back panel at 12 seconds and one person?

**Worked answer.** The large panel's four hits at 20 seconds take 80 seconds. The brake and its operator cost A$110 an hour and the second person A$95, so the pair costs A$205 an hour, about 5.69 cents a second. Its bends cost about 80 × A$205 ÷ 3,600 = **A$4.56** per panel.

EN-700's back panel, four hits at 12 seconds at A$110 an hour, costs about **A$1.47** per panel. The larger panel's bends cost about three times as much, for twice the length of each bend, because each hit takes longer and needs two people. Size enters a quote not only through material but through handling, and the estimating sheet should let the time per hit and the crew size vary by part.
