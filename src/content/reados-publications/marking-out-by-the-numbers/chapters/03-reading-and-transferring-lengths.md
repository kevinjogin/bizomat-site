---
book: marking-out-by-the-numbers
chapterSlug: reading-and-transferring-lengths
order: 3
title: "Reading and transferring lengths"
description: "What a tape's accuracy class promises, how hooks, parallax, scribers and hot sheet add error, why one datum beats a chain of measurements, and how to check a tape against a reference."
draft: false
---

Most of a layout is lengths: a line so far from the datum, a hole so far along it, a blank so long. Each is read from a tape or rule and transferred to the metal with a scriber, dividers or a trammel. The length on the scale is not the length on the sheet. Between the two lie the tape's own error, the hook at its end, the gap between the graduations and the sheet, the angle of the scriber, the temperature of the metal and, most of all, the decision about where each measurement starts.

This chapter works through those sources one at a time, puts a size on each, and applies them to two C-12 parts: the collar blank, a single long length, and the louvre panel, a row of slot positions. It ends with a tape whose hook had been bent, a fault that made every measurement wrong by the same amount and was invisible until a second tool was used.

## What a tape's class mark promises

Many tapes and rules carry an accuracy class, shown as a Roman numeral I, II or III in an oval, from the European measuring instruments directive. Annex X of the directive, which covers material measures of length, sets the maximum permissible error between any two graduations that are not next to each other as a + bL millimetres, where L is the length rounded up to the next whole metre. The values of a and b depend on the class, and the reference temperature is 20 °C unless the maker marks another.

```figure
type: compare
title: Maximum permissible error of tapes and rules by class
rowhead: Length measured
cols: Class I | Class II | Class III
caption: From Directive 2014/32/EU, Annex X (MI-008): MPE = a + bL with L rounded up to the next whole metre; a and b are 0.1 and 0.1 mm for class I, 0.3 and 0.2 mm for class II, and 0.6 and 0.4 mm for class III. A further allowance c applies to a measurement that starts at an end surface such as a hook.
- 300 mm | ±0.2 mm | ±0.5 mm | ±1.0 mm
- * 971 mm (collar blank) | ±0.2 mm | ±0.5 mm | ±1.0 mm
- 1,200 mm | ±0.3 mm | ±0.7 mm | ±1.4 mm
- 2,400 mm | ±0.4 mm | ±0.9 mm | ±1.8 mm
```

Two features of the formula matter on the bench. First, the error does not shrink below a for short lengths, so even a 50 mm measurement with a class II tape may be 0.5 mm out. For short, accurate lengths a steel rule is the better tool. Second, the directive defines what a compliant measure must achieve when it is new and used as intended. A tape that has been dropped, kinked or had its hook bent may no longer meet its class, and the mark on its case says nothing about its present condition.

The directive also gives an extra allowance, c, for a measurement that begins at the end of the tape rather than at a graduation: 0.1, 0.2 and 0.3 mm for classes I, II and III. That is a recognition that the hook is the least reliable part of a tape.

## The hook and the end

A tape's hook slides on its rivets by the hook's own thickness, so that it reads correctly both when hooked over an edge (pulling the hook out) and when butted against a face (pushing it in). This works only while the hook and its rivet holes are undamaged. A hook that has been dropped on its end, or caught and bent, can move the zero by half a millimetre or more, and the error is the same on every measurement.

The remedy is to avoid the hook for any measurement that matters. Lay the tape with a whole graduation, commonly the 100 mm mark, on the starting point, read the far end and subtract 100 mm. This "burning" of the first 100 mm removes the hook, its slide and its wear from the measurement altogether, and it removes the directive's extra allowance c with them. The cost is a subtraction that must not be forgotten; the C-12 shop writes "−100" in pencil on the sheet beside the start point as a reminder.

## Reading the graduation and parallax

A graduation is read where it appears to line up with the edge or mark being measured. If the graduation is above the sheet, as it is on a steel rule lying flat or a tape whose curved blade does not touch the metal, the reading depends on where the eye is. Looking at the scale from an angle moves the apparent line.

```figure
type: compare
title: Parallax error when the scale is above the mark
rowhead: Height of the graduation above the sheet
cols: Eye 10° off square | Eye 20° off square | Eye 30° off square
caption: Error = height × tan(angle). A rule stood on its edge puts the graduations on the sheet and removes parallax almost entirely; a thin tape pressed flat reduces it.
- 1.0 mm (rule flat, curved tape) | 0.18 mm | 0.36 mm | 0.58 mm
- * 0.2 mm (thin tape pressed flat) | 0.04 mm | 0.07 mm | 0.12 mm
- On the sheet (rule on edge) | about 0 | about 0 | about 0
```

The figures show why experienced markers stand a steel rule on its edge for short accurate lengths, and press a tape flat with a thumb at the reading point. They also show that keeping the eye square to the scale matters most when the scale is high. With a rule on its edge, it hardly matters at all.

Good light from the side, at a low angle, makes graduations and scribed lines stand out. A hand lens of two or three times magnification helps judge where a scribed line sits between graduations, which is the reading error of ±0.1 mm assumed in this book. Without it, ±0.2 mm is a more honest figure.

## Scribing against a rule

A scriber held against a rule marks a line slightly away from the rule's edge, because the point sits a little way out from the side of the shank. The offset is constant only if the scriber is held at the same angle every time. Two habits keep it constant: tilt the scriber in the direction of travel and lean its top slightly away from the rule, the same way on every line, and draw each line in a single pass. A second pass rarely lands exactly on the first and widens the line.

Points are marked with a short cross, two scribed lines crossing at the point, or with a small V whose tip is the point. A single tick across a line is ambiguous, because its width hides where along the line the point lies. A centre punch should go in only after the point has been checked, because a punch mark cannot be moved and its cone is wider than any scribed line.

On galvanised sheet, a scribed line cuts through the zinc coating. Lines that will remain on a visible or exposed face after cutting are better marked with a fine marker or a hard pencil, and scribed lines are kept in the waste or on faces that will be covered. The C-12 shop scribes everything that will be cut along and pencils everything that will only be folded.

## Temperature

Graduations are correct at 20 °C. A steel tape measuring steel sheet at another temperature expands with the sheet, and the two effects nearly cancel. A steel tape measuring aluminium or stainless steel does not: aluminium expands about twice as much as carbon steel per degree, and austenitic stainless steel about half as much again as carbon steel. Representative coefficients from the Engineering ToolBox are 10.8 to 12.5 µm per metre per kelvin for carbon steel, 17.3 for 304 stainless steel and 23 for aluminium.

```figure
type: bars
title: Length error over 2,400 mm with a steel tape, both at 35 °C
unit: mm
max: 0.5
caption: This is an illustration. Error = L × (α sheet − α tape) × (T − 20 °C), taking α tape as 12 µm/m·K. For galvanised steel the residual comes only from the spread of carbon steel coefficients.
- Galvanised steel, worst spread | 0.06
- 304 stainless steel | 0.19
- * Aluminium | 0.40
```

A more common trap on a hot day is a sheet lying in the sun. A galvanised sheet at 55 °C marked with a tape at 25 °C is about 30 K warmer than the tape, so lengths marked on it come out short when the sheet cools: over the collar's 971 mm blank, about 971 × 12 × 10⁻⁶ × 30 = 0.35 mm. That is most of the collar's marking budget, from a cause nobody can see. Sheet for accurate work should be brought into the shade and left to reach the shop's temperature before it is marked.

## Chained or from one datum

The biggest choice in transferring lengths is where each one starts. There are two ways to mark a row of points.

- **Chained:** each point is measured from the one before it.
- **Baseline:** every point is measured from the same datum.

Chaining is natural, because a drawing often gives a pitch, and it is fast with a tape locked at the pitch. But every step adds its own error, so the last point carries the errors of all the steps before it. With a baseline, each point carries only one measurement's error.

```figure
type: compare
title: Seven louvre slots at 112.5 mm pitch, ±0.25 mm per measurement
rowhead: Method
cols: Error at slot 1 | Error at slot 7 | Error at the far end (8 steps)
caption: This is an illustration. Worst case adds the step errors; RSS assumes they are independent. A baseline also gives each slot its own reading, so one bad reading affects one slot, not every slot after it.
- Chained, worst case | ±0.25 mm | ±1.75 mm | ±2.00 mm
- Chained, RSS | ±0.25 mm | ±0.66 mm | ±0.71 mm
- * Baseline from datum B | ±0.25 mm | ±0.25 mm | ±0.25 mm
```

On the C-12 louvre panel, the slot centres lie at 112.5, 225.0, 337.5, 450.0, 562.5, 675.0 and 787.5 mm from datum B. Marked from B, each is a single tape reading. The shop writes those running dimensions on the job sheet, so that nobody has to add up pitches at the bench, which is itself a source of error.

## Transferring without numbers

Some lengths never need to be read at all. Dividers and trammels carry a length directly from one place to another, and that removes the tape's error and the reading error from the transfer. When a part must match something already made, such as a flange to fit an existing duct, the most accurate method is to take the length from the existing work with dividers or a trammel and transfer it, rather than measure it, write it down and measure it again.

Dividers are set from a rule by placing one point in a graduation and opening the other to the required graduation, under a lens, with the rule on its edge. They hold their setting well if their joint is firm, and the setting should be checked again after a few minutes of use. A trammel, two points on a bar, does the same over lengths of up to a few metres and is the tool for the large arcs of Chapter 8.

## Checking a tape against a reference

A shop needs one length it trusts. The C-12 shop keeps a reference scribed on a steel bench top: two fine crosses exactly 1,000 mm apart, set out with a 1 m steel rule that is kept only for that purpose and checked against a second rule of the same class. Any tape can be compared with the reference in under a minute, both from its hook and from its 100 mm mark.

A tape that differs from the reference by more than its class allows is withdrawn. One that agrees from its 100 mm mark but not from its hook has a damaged hook and is used only by burning 100 mm. The check is recorded with the date, so that a fault found on a job can be traced to the tools used on it.

## Marking the collar blank

This is an illustration. The collar is Ø300 mm inside in 1.2 mm sheet, so its girth on the mean line is π × 301.2 = 946.25 mm. The shop's riveted lap is 25 mm, giving a blank 971.25 mm long by 250 mm high. On the sheet:

1. From datum B, burn 100 mm with a class I tape and mark 1,071.25 mm, which is 971.25 mm from B.
2. Mark the same length at a second point 250 mm along B, using the same tape the same way.
3. Join the two marks with a straightedge and check that the line is parallel to B by measuring across at both ends with a steel rule.
4. Mark the 250 mm height from datum A, at both ends of the blank.
5. Check the blank's diagonals: both should be √(971.25² + 250²) = 1,002.91 mm.

The marking estimate for the 971.25 mm length, with a class I tape read from a graduation, a lens, the tape pressed flat and the sheet at shop temperature, is about ±0.3 mm by RSS, inside the ±0.5 mm budget.

## The error: a bent hook on the louvre panel

This is an illustration. The first C-12 louvre panel was marked by an apprentice who measured each slot from the panel's left edge, the correct baseline approach, with the tape's hook over the edge. The slots were punched, and at trial fit every louvre sat about 0.6 mm to the right of the frame's matching holes.

Because every slot was out by the same amount, the error was systematic, and it pointed at the start of every measurement: the hook. Against the bench reference, the tape read 1,000.0 mm from its 100 mm mark to its 1,100 mm mark, but 1,000.6 mm from its hook. The hook had been bent outwards, probably when the tape was dropped, so every hooked reading started 0.6 mm too far out.

The panel was within the drawing's general tolerance and was accepted, but it would not have been if the error had been larger. The shop changed two things: louvre positions are now marked by burning 100 mm, and every tape is checked against the bench reference at the start of each job, from both its hook and its 100 mm mark. The bent tape is now used only for rough cutting lengths.

## How this applies to a small Australian business

Tapes are cheap and every fabricator owns one, so they are rarely checked and often shared. A bench reference costs one good steel rule and an hour's careful marking, and it turns "my tape says" into a known number. Writing running dimensions on the job sheet, rather than pitches, removes the chained errors and the mental arithmetic at a stroke. Neither change needs new equipment, and both show up straight away as fewer parts that need opening up with a file.

## Exercise: chaining the hole row

A fabricator marks a row of nine holes at 100 mm pitch along a 900 mm flange. They can chain the holes with dividers set to 100 mm, or measure each from the datum with a class I tape read from a graduation. Assume ±0.1 mm per divider setting, applied at every step, and ±0.25 mm for each tape measurement from the datum, everything included. Which method gives the smaller error at the ninth hole, which is 800 mm from the first?

**Worked answer.** With dividers set once, the setting error repeats at every step and is systematic, so it adds directly: 8 steps × 0.1 mm = **±0.8 mm** at the ninth hole, with no averaging. Each step's placement adds a little more.

From the datum, the ninth hole carries one measurement's error: **±0.25 mm**. The baseline method is better by a factor of three at the far end. Dividers are the better tool only when they are used to check equal spacing between already-marked points, or when the setting itself is corrected after a trial step, as Chapter 5 shows.
