---
book: marking-out-by-the-numbers
chapterSlug: what-marking-out-must-achieve
order: 1
title: "What marking out must achieve"
description: "Treat every scribed line as a measurement with an error: set a marking budget from the drawing's tolerance, list the error sources, add them honestly and choose hand or machine."
draft: false
---

A scribed line looks definite. It is a bright, narrow scratch on the sheet, and once it is there everyone treats it as the truth: the guillotine operator cuts to it, the driller centre-punches on it, the folder lines it up with the blade. But the line is only where someone put it. It carries every small error of the tape, the square, the reading of the scale, the angle of the scriber and the edge it was measured from. Marking out is measurement, and like any measurement it has an uncertainty, whether or not anyone has worked it out.

This chapter sets the frame for the rest of the book. It shows how to turn a tolerance on a drawing into an allowance for marking out, lists the sources of marking error with typical sizes, shows two honest ways to add them, and introduces the C-12 cowl kit that every later chapter marks out. It ends with a mistake that no amount of care with a scriber would have prevented: two mating parts marked with two different tapes.

## A mark is a measurement

When a fabricator marks a line 600 mm from a datum edge, three things decide where it really is. The first is the instrument: a tape or rule is itself only accurate to a stated limit. The second is the act of reading and marking: lining up a graduation, holding the scriber against the rule, keeping the eye square to the scale. The third is the reference: the datum edge may not be straight, the corner may not be square, or the measurement may be chained from an earlier mark that was itself out.

None of these can be removed, only made small. A good fabricator does not mark perfectly; they mark in a way whose error is known to be small compared with what the drawing allows. That is the difference between work that fits first time and work that fits most of the time.

There is also a physical limit. A sharp carbide scriber on galvanised sheet leaves a line roughly 0.1 to 0.2 mm wide, depending on the point and the pressure. A pencil line is wider, and a felt marker line wider again, about 0.5 mm or more. A dimension cannot be marked more precisely than the line that records it, so the marking tool sets a floor on accuracy before anything is measured. This book assumes a scribed line about 0.15 mm wide, so its centre can be judged to within about ±0.1 mm by a practised eye.

## Repeatable is not the same as right

Two different things are hidden in the word "accurate". One is how closely a fabricator repeats the same mark: mark a line 600 mm from an edge five times, and the five lines may lie within 0.1 mm of each other. The other is how close those lines are, on average, to the true 600 mm. A tape whose hook is bent 0.4 mm gives five beautifully repeatable lines, all 0.4 mm in the wrong place.

The first kind of error is random. It changes from one mark to the next, and it shows up when the same measurement is repeated. The second is systematic, a bias. It is the same every time, so repeating the measurement never reveals it. Only comparing with something independent does: a second tape, a steel rule that has been checked, a reference length scribed on a bench, or a diagonal that should equal a calculated value.

The distinction decides what to do about an error. Random error is reduced by better technique, better light and sharper points, and averaging several readings helps. Systematic error is reduced by checking the tool and the datum against a reference and correcting for what is found. Most of the serious faults in this book are systematic: a bent hook, a cambered edge, a divider set slightly long and stepped sixteen times, a rule of thumb that is always a little short. They are also the faults that a careful person is most likely to miss, precisely because their own work looks so consistent.

A practical test follows from this. When a layout has been marked, at least one check should use a different tool or a different route from the one that made the marks. If the check repeats the same method with the same tape, it can only confirm that the work is repeatable. Chapter 10 builds the final check of every C-12 part on that principle.

## Where the tolerance goes

A drawing tolerance covers the whole process, not just marking. On the C-12 kit, a general dimension of ±1.0 mm has to absorb the error of the mark, the error of the cut or punch, any movement of the sheet while it is sheared, and any growth or shrinkage in folding or rolling. If marking out uses the whole tolerance, every later step must be perfect.

The shop in the running case works to a simple rule: marking out may use no more than half of any tolerance. That rule is a policy, not a law of nature, and a shop could choose a third or two-thirds. What matters is that the share is decided before the job starts and written on the job sheet, so the person marking out knows the target.

```figure
type: stack
title: How the C-12 shop shares a ±1.0 mm tolerance
unit: mm
caption: This is an illustration. Half of the tolerance is allowed to marking out, and the rest is shared between cutting and forming. For hole positions on the same part (±0.5 mm), every share halves.
- Marking out | 0.5
- Cutting or punching | 0.3
- Forming and handling | 0.2
```

For C-12 that gives two targets:

1. **General dimensions, ±1.0 mm:** marking error no more than ±0.5 mm.
2. **Hole positions relative to one another, ±0.5 mm:** marking error no more than ±0.25 mm.

The second target is tight for hand work. Chapter 5 shows that it can be met on the base plate's sixteen holes, but only with the right method; chaining divider steps around the circle would use the whole budget on its own.

## The sources of marking error

The table below lists the sources this book deals with, the typical size of each for careful hand work on sheet, and the chapter that shows how to reduce it. The sizes are illustrations built from the assumptions stated in each chapter, not measurements of any particular shop.

```figure
type: compare
title: Sources of error in a marked length, careful hand work on sheet
rowhead: Source
cols: Typical size | What controls it | Chapter
caption: This is an illustration for lengths up to about 1 m. The tape's error grows with length; most of the others do not. Chained measurements add their errors at every step.
- Tape or rule accuracy | ±0.2 to ±0.5 mm | Accuracy class, condition, calibration | 3
- Reading the graduation | ±0.1 to ±0.2 mm | Lighting, magnification, rule on edge | 3
- Scribe line position | ±0.1 mm | Sharp point, steady angle against the rule | 1, 3
- Parallax | ±0.05 to ±0.2 mm | Eye square to the scale, thin rule | 3
- Hook or end of the tape | ±0.2 to ±0.5 mm | Measure from a graduation, not the hook | 3
- Datum edge not straight or square | Up to several mm | Choose and check the datum | 2
- Construction geometry | Depends on the angle of intersection | Choose radii that cross squarely | 4
- Accumulation in chained steps | Grows with the number of steps | Measure from one datum, calculate chords | 5
- Temperature | Usually under ±0.1 mm in steel | Same-material tape, avoid hot sheet | 3
```

Two features stand out. The datum and the method of construction can produce errors of millimetres, far larger than anything the scriber or the eye contributes. And accumulation turns small errors into large ones simply by repeating them. Most of the improvement in a shop's marking accuracy comes from better datums and better methods, not from steadier hands.

## Adding errors honestly

When several independent sources each contribute an error, there are two common ways to estimate the total.

The **worst case** adds the sizes: if every error is at its limit and all in the same direction, that is how far out the mark can be. It is simple and safe, and it is the right figure when a part must never fail, or when the errors are not independent, for example when the same bent tape is used for every measurement.

The **root-sum-square** (RSS) adds the squares and takes the square root. It estimates a realistic spread when the errors are independent and random, because it is unlikely that every source will be at its limit at once. NIST Technical Note 1297 sets out the full method for combining uncertainties; the shop version here treats each typical size as if it were comparable, which is rough but serviceable.

```figure
type: formula
title: Two ways to add independent marking errors
formula: worst case = e₁ + e₂ + e₃ + …
formula: root-sum-square = √(e₁² + e₂² + e₃² + …)
caption: This is an illustration for the collar blank's 946 mm length marked with a class II tape. RSS is smaller than the worst case and is the better estimate when the errors are independent.
- e₁ | tape, class II at 946 mm: ±0.5 mm
- e₂ | reading the graduation: ±0.2 mm
- e₃ | scribe line position: ±0.1 mm
- e₄ | parallax: ±0.15 mm
step: Worst case: 0.5 + 0.2 + 0.1 + 0.15 = 0.95 mm
step: RSS: √(0.25 + 0.04 + 0.01 + 0.0225) = 0.57 mm
step: Same with a class I tape (±0.2 mm): RSS 0.34 mm
```

For the collar, whose general tolerance gives a marking budget of ±0.5 mm, the class II tape does not quite meet the target even on the RSS estimate. Changing to a class I tape, or to a 1 m steel rule, brings the estimate down to about 0.34 mm, inside the budget with room to spare. Nothing else needed to change. That is the typical pattern: one source dominates, and fixing it fixes the total.

Notice also what RSS does to small sources. The scribe line's ±0.1 mm contributes 0.01 to a sum of squares of 0.32. Halving it would barely change the result. Effort spent on the largest source pays; effort spent on the smallest is wasted.

## Hand or machine

A layout budget also answers a practical question: should this part be marked by hand at all? If the honest estimate of marking error is larger than the budget, and no change of tool or method brings it inside, the part should go to a machine that does better, such as a CNC punch or laser, or the tolerance should be challenged with the designer.

```figure
type: decision
title: Should this feature be marked out by hand?
question: Does a careful hand method, at its estimated error, fit inside the marking budget?
caption: This is an illustration. Work through the options in order; a change of method is usually cheaper than a change of process.
- *Yes, with room to spare | mark by hand | record the method and the estimate on the job sheet
- Only with a better tool or method | change tape, use a template or calculate chords | re-estimate, then mark
- No | send the feature to a machine | or ask whether the tolerance is really needed
```

For the C-12 kit, every feature passes this test with the methods in this book, although the base plate's hole circle passes only if the holes are located from calculated chords and checked across the circle, as Chapter 5 shows.

## The C-12 kit and its layout plan

The parts are listed in the book's introduction. Before any line is marked, the shop writes a short layout plan for each part on the job sheet: the datum edges, the order of construction, the method for each feature, the marking budget and the check that will prove it. The plan takes ten minutes and saves the common failures, which are almost all decisions rather than slips.

```figure
type: stats
title: The C-12 kit at a glance
caption: This is an illustration. All parts are 1.2 mm galvanised steel, marked by hand from 2400 × 1200 mm sheets.
- *Octagon 600 AF | Base plate | sixteen Ø7 holes on a 540 mm pitch circle
- Ø300 × 250 | Collar | girth 946.25 mm on the mean line
- 900 × 900 | Flashing apron | on a 10° roof, hole for the collar
- 700 × 120 | Hood | chord and rise of the rolled arc
- 7 slots | Louvre panel | equal pitch along 900 mm
```

Each chapter takes one or more of these features and marks it out. Chapter 2 starts with the sheet itself, because nothing on it can be more accurate than the edges and corner everything is measured from.

## The error: mating parts, two tapes

This is an illustration. On an earlier cowl kit, the shop marked the base plate's hole circle on one bench and the collar's matching flange holes on another, at the same time, to save a day. Each fabricator used their own tape. Both tapes were class II, and both were in good order.

At trial assembly, the holes on one side lined up and the holes on the far side were about a hole's radius apart. The pitch circle on the flange measured roughly 0.8 mm larger in diameter than on the base plate. Neither part was out of its own tolerance on the drawing, which gave the pitch circle diameter as 540 ±1.0 mm. They simply did not agree with each other.

The cause was the tapes. A class II tape may be in error by up to 0.3 + 0.2 × 1 = 0.5 mm over any length up to a metre, so two compliant tapes can disagree by up to 1.0 mm over the 540 mm diameter, one reading long and one short. Each fabricator had marked accurately to their own tape.

The fix was a process change, not a skill change. The shop now marks mating parts with the same tape, or better, drills one part and uses it as a template to mark the other, which removes the tape from the relationship altogether. The job sheet's layout plan has a line for it: "mating features: same tool or template". The two parts on the bench were saved by opening the flange holes to Ø8 mm, which the designer accepted for that kit, but a tighter fit would have meant a remake.

The deeper lesson is in the tolerances. A tolerance on each part separately does not control how well two parts fit each other. When the fit is what matters, the drawing should say so, as the ±0.5 mm relative tolerance on C-12's hole positions does, and the marking method should be chosen to protect that relationship rather than each part's absolute size.

## How this applies to a small Australian business

Small fabrication shops in Australia often run without a quality engineer, and nobody writes down a marking budget. The work still has one: it is whatever the customer will tolerate before they send the part back. Writing the budget down costs a line on the job sheet, and it changes how people work. A fabricator who knows that the holes must agree to ±0.25 mm reaches for the template or the steel rule, not the tape on their belt.

The same habit helps when quoting. A feature that cannot be marked by hand inside its budget will need a machine, a supplier or a conversation with the designer, and each has a cost that belongs in the price. Finding that out on the bench, after the quote is accepted, is how small shops lose money on jobs that looked simple.

## Exercise: the octagon's width

The C-12 base plate is 600 mm across flats, with a general tolerance of ±1.0 mm. The fabricator will mark the flats with a 1 m steel rule of accuracy class I. Estimate the marking error for the 600 mm dimension and decide whether it meets the shop's budget. Assume reading ±0.1 mm (the rule is laid on edge, so the graduations touch the sheet), scribe line ±0.1 mm and parallax ±0.05 mm.

**Worked answer.** The marking budget is half the tolerance, ±0.5 mm. A class I measure has a maximum permissible error of 0.1 + 0.1L mm, where L is the length rounded up to the next whole metre, so for 600 mm it is 0.1 + 0.1 × 1 = 0.2 mm.

- Worst case: 0.2 + 0.1 + 0.1 + 0.05 = **0.45 mm**, inside the budget.
- RSS: √(0.04 + 0.01 + 0.01 + 0.0025) = **0.25 mm**, comfortably inside.

The dimension can be marked by hand with this rule. The rule's accuracy is the largest single source, so if a tighter result were ever needed, the next step would be to check the rule against a reference, not to try to mark more finely.
