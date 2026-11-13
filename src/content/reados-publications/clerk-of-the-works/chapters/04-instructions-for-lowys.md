---
book: clerk-of-the-works
chapterSlug: instructions-for-a-ten-year-old
order: 4
title: "Instructions for a ten-year-old: writing method statements and set-out checks a newcomer can follow"
description: "Use Chaucer's Treatise on the Astrolabe as a model for procedures, then write and use a levelling check of grandstand base plates, including the arithmetic check and the error it cannot catch."
draft: false
---

Around 1391, Chaucer wrote an instruction manual. *A Treatise on the Astrolabe* explains how to use the astronomical instrument of that name, and it is addressed to a boy he calls "Lyte Lowys my sone", who was ten. Some scholars think Lewis was Chaucer's own son; others have suggested he was the son of a friend. It was written in English, not the Latin in which such treatises usually circulated, and it is often described as the oldest surviving technical manual in the English language. It was never finished. The surviving text stops partway through.

What survives is a model of how to write instructions for someone who does not yet know the subject. This chapter draws five habits from the treatise, applies them to a set-out check on the grandstand's column base plates, and shows how an inexperienced person following a good procedure caught an error and also how a good procedure can still miss one.

## How Chaucer wrote for Lewis

The prologue to the treatise is unusually explicit about method. Chaucer says he has noticed the boy's ability with numbers and proportions and his eagerness to learn the instrument. He promises to teach "a certein nombre of conclusions", meaning a set of worked procedures, not everything the instrument can do. He gives his reasons: nobody knows every possible use; some of the procedures in other treatises do not work as promised; and some are too hard for a child of ten. He writes in English because that is the boy's language, noting that the same knowledge has been taught to Greeks in Greek, Arabs in Arabic and Latin readers in Latin. And he apologises in advance for repeating himself, explaining that it is easier for a child to learn a point said twice than to remember it said once.

The treatise then describes the instrument before using it, part by part, so that the reader knows the names of the pieces before the procedures refer to them. The procedures follow as numbered conclusions, each a self-contained task.

```figure
type: compare
title: Five habits from the Treatise on the Astrolabe
cols: What Chaucer did | What it means for a method statement
caption: Paraphrased from the treatise's prologue and structure. None of the habits is specific to astronomy.
- Wrote in the reader's language | English, not Latin | plain words; define every technical term on first use
- Promised a set number of conclusions | not every use of the instrument | state the scope, and what the procedure does not cover
- Left out what was too hard | named the reason | say who to call when the task goes beyond the procedure
- Described the instrument first | names of the parts before the procedures | equipment, set-up and terms before the steps
- * Repeated the key points | apologised for it, and did it anyway | repeat the checks that catch errors, in the step where they apply
```

## The task: checking base plate levels

This is an illustration. In week 8 the builder sets the steel base plates for the grandstand's first frame line, grid line A, on their holding-down bolts, ready for grout. The contract requires each plate to be within ±5 mm of its design level before grouting, and the superintendent has asked the clerk of works to check the four plates on grid A independently of the builder's surveyor.

The clerk of works cannot attend that morning. The society has a volunteer helper for the week: a second-year engineering student who has used an automatic level once, at university. The clerk writes a procedure for the student the evening before, using the treatise as a model.

```figure
type: steps
title: Procedure GS-QP-04, checking base plate levels on grid A
caption: This is an illustration. Each step is one task, in the order it is done; the checks that catch errors are repeated where they apply.
- Know the equipment | automatic level, tripod, 4 m staff with a bubble, booking sheet; benchmark BM1 is the brass pin at the pavilion step, level 100.000 m
- Set up and check | set the level midway between BM1 and the plates; level the bubble; check it again before every reading
- Read the benchmark | backsight to BM1, staff vertical by its bubble; book it; read it again and confirm
- Read each plate | intermediate sight on the top of each plate at its centre; book each; repeat the reading
- * Move and close | change point on a firm peg; move the level; read the remaining plates; finish on BM1
- Check the arithmetic | sum of backsights minus sum of foresights must equal the change from first to last level
- Stop and call | if the loop does not close within 5 mm, or any plate is out by more than 5 mm, call the clerk of works before anyone grouts
```

Two features of the procedure are Chaucer's directly. It states its scope: four plates on grid A, not the whole set-out, and not the bolts, which the builder's surveyor checks. And it names the point at which the student must stop: the procedure is for a checker, not a decision maker, and anything outside it goes to someone who can decide.

The safety side is not in the procedure, because it is not the clerk's to set. The student works under the builder's site induction and rules, as construction work in New South Wales is regulated under work health and safety law and the builder controls the site. The procedure says so in its first line and tells the student to follow the site manager's directions.

## Testing the procedure on its reader

Chaucer could watch his reader learn; the clerk of works could not, because the procedure would be used the next morning without its author. So the clerk tested it the evening before, in ten minutes on the phone. The student read each step aloud and said back, in their own words, what they would do.

Two problems surfaced at once. The student did not know what a "change point" was, and assumed "intermediate sight" meant a reading taken halfway through the job. Both terms were obvious to the clerk and meaningless to the reader, exactly the gap Chaucer guarded against by describing the instrument before any procedure used it. The clerk added a short glossary at the top of the procedure:

| Term | Meaning in this procedure |
| --- | --- |
| Backsight | the first reading after the level is set up, taken on a point of known level |
| Foresight | the last reading before the level is moved, taken on the point the next set-up will start from |
| Intermediate sight | any reading between the backsight and the foresight, such as a plate |
| Change point | a firm point, here a peg, read as a foresight from one set-up and a backsight from the next |
| Reduced level | the height of a point above the site datum, worked out from the readings |

The third problem was subtler. Asked what they would do if a plate was 6 mm out, the student said they would ask the builder's leading hand to adjust it. That was the right instinct and the wrong action: the student had no authority to direct the builder, and an adjusted plate with no record of why it moved is the kind of change Chapter 1 warned against. The clerk rewrote the last step to say who to call and that nobody adjusts anything on the student's word.

Testing a procedure on someone who has never used it is the cheapest quality check in this book. It takes minutes and finds the words that only the writer understands.

## The readings

The student set up the level between the benchmark and the first two plates, read the benchmark and plates A1 and A2, moved the level using a change point, read plates A3 and A4, and closed back on the benchmark. The booking, reduced by the rise and fall method, is below.

| Point | Backsight | Intermediate | Foresight | Rise | Fall | Level (m) |
| --- | --- | --- | --- | --- | --- | --- |
| BM1 | 1.425 | | | | | 100.000 |
| Plate A1 | | 1.612 | | | 0.187 | 99.813 |
| Plate A2 | | 1.598 | | 0.014 | | 99.827 |
| Change point | 1.204 | | 1.732 | | 0.134 | 99.693 |
| Plate A3 | | 1.316 | | | 0.112 | 99.581 |
| Plate A4 | | 1.297 | | 0.019 | | 99.600 |
| BM1 | | | 0.893 | 0.404 | | 100.004 |

The loop closes 4 mm high on the benchmark, inside the 5 mm the procedure allows for a short loop. The arithmetic check confirms the reduction.

```figure
type: formula
title: The arithmetic check on the levelling booking
formula: ΣBS − ΣFS = Σrise − Σfall = last level − first level
caption: This is an illustration. All three quantities equal +0.004 m. The check proves the booking was reduced correctly; the 4 mm is the loop's misclosure, which the procedure allows up to 5 mm.
- ΣBS | sum of backsights, m
- ΣFS | sum of foresights, m
- Σrise, Σfall | sums of the rises and falls, m
step: ΣBS − ΣFS = (1.425 + 1.204) − (1.732 + 0.893) = 2.629 − 2.625 = 0.004
step: Σrise − Σfall = (0.014 + 0.019 + 0.404) − (0.187 + 0.134 + 0.112) = 0.437 − 0.433 = 0.004
step: last level − first level = 100.004 − 100.000 = 0.004
```

Against the design levels on the drawings, the four plates came out as follows.

| Plate | Design level (m) | Measured (m) | Difference (mm) | Within ±5 mm? |
| --- | --- | --- | --- | --- |
| A1 | 99.815 | 99.813 | −2 | yes |
| A2 | 99.825 | 99.827 | +2 | yes |
| A3 | 99.585 | 99.581 | −4 | yes |
| A4 | 99.595 | 99.600 | +5 | at the limit |

Plate A4 sits exactly at the tolerance, and the loop misclosed by 4 mm. The student, following the last step, called the clerk of works rather than reporting four passes. The clerk asked the builder to lower A4 by 3 mm on its levelling nuts before grouting, which put it comfortably inside the tolerance whatever the true error in the loop.

## Failure: the error the arithmetic check cannot catch

On the first attempt that morning, before the readings above, the student had booked plate A3 as 1.361 instead of 1.316, transposing two digits. That gave a level of 99.536 m, 49 mm below design. The student stopped, as the procedure said, and called.

The interesting point is what the arithmetic check said about that booking: nothing. With A3 booked as 1.361, the fall to A3 becomes 0.157 and the rise from A3 to A4 becomes 0.064. The extra 45 mm appears once as a fall and once as a rise, and cancels. The sums of backsights and foresights do not include intermediate sights at all. The check balanced perfectly on a booking with a 45 mm error in it.

```figure
type: compare
title: What each check catches
cols: Catches | Misses
caption: The arithmetic check proves the reduction, not the readings. An intermediate sight is read once and checked by nothing unless the procedure adds a check.
- Arithmetic check | mistakes in adding up rises, falls and levels | any error in an intermediate sight
- Closing on the benchmark | errors in backsights, foresights and change points | any error in an intermediate sight
- * Repeating each plate reading | misreads and transpositions at that plate | a staff not held vertical both times
- Comparing with design | large errors that put a plate far from its design | small errors that leave it plausibly in tolerance
```

The error was caught by the last line of the table: a 49 mm departure from design was implausible enough to stop the student. A 4 mm transposition would not have been. That is why the procedure, like Chaucer, repeats itself: step 4 says to read each plate twice. On the first attempt the student had skipped the repeat for A3 because the plate was awkward to reach. Detection came from the stop rule; the correction was to make the repeat unmissable. The revised procedure has a booking sheet with two columns for every plate reading, and the student does not move on until both are filled and agree within 1 mm.

## Saying what you leave out

The prologue's most useful sentence for a procedure writer is the one in which Chaucer says some conclusions are too hard for a ten-year-old and he will not attempt them. A procedure that tries to cover every case becomes too long to follow, and the reader skips the parts that matter. A procedure that names its limits, and says who handles what lies beyond them, can stay short.

GS-QP-04 left out three things, and said so: checking holding-down bolt positions, which is the builder's surveyor's work; checking plates on other grid lines, which needs a new benchmark loop; and deciding what to do with a plate out of tolerance, which belongs to the superintendent. The student did not need to know how to do any of these. The student needed to know they existed and where to send them.

## Why an independent check at all

The builder's surveyor had already set the plates, and the builder's own check showed all four within tolerance. The superintendent asked for an independent check anyway, and the reason is worth stating because committees often question the cost. The builder's surveyor used the builder's benchmark, set from the same survey control the surveyor established at the start of the job. An error in that control would move every plate together and leave every one of the builder's checks looking perfect. The clerk's loop started from BM1, the society's own benchmark on the pavilion step, which the builder had not used. Two loops from independent starting points that agree within a few millimetres are far stronger evidence than one loop repeated.

## A treatise left unfinished

The surviving *Treatise* stops before the later parts Chaucer promised. Procedures on projects suffer the same fate. They are written for the first task, then the job moves on and nobody updates them for the second. The clerk of works dates every procedure and lists, at the end, the tasks it was written for and the date it was last used. A procedure that has not been used or reviewed for three months is re-read before anyone relies on it.

## Exercise: book and check a second loop

The next week the student checks grid line B. Readings: backsight on BM1 1.388; plate B1 intermediate 1.571; plate B2 intermediate 1.560; change point foresight 1.690, then backsight 1.255; plate B3 intermediate 1.369; plate B4 intermediate 1.350; foresight on BM1 0.948. Design levels are B1 99.815, B2 99.825, B3 99.585 and B4 99.595. Reduce the levels, do the arithmetic check, state the misclosure, and say which plates pass.

**Worked answer.** From BM1 at 100.000: B1 falls 0.183 to 99.817; B2 rises 0.011 to 99.828; the change point falls 0.130 to 99.698; B3 falls 0.114 to 99.584; B4 rises 0.019 to 99.603; BM1 rises 0.402 to 100.005. ΣBS − ΣFS = (1.388 + 1.255) − (1.690 + 0.948) = 2.643 − 2.638 = 0.005; Σrise − Σfall = (0.011 + 0.019 + 0.402) − (0.183 + 0.130 + 0.114) = 0.432 − 0.427 = 0.005; last minus first = 0.005. The arithmetic checks, and the loop misclosure is 5 mm, at the procedure's limit. Against design, B1 is +2 mm, B2 +3 mm, B3 −1 mm and B4 +8 mm. B4 fails. Because the misclosure is at the limit and B4 is outside tolerance, the student should stop and call: the clerk of works will ask for B4 to be adjusted and for the loop to be re-run before grouting, to separate a plate error from a levelling error.
