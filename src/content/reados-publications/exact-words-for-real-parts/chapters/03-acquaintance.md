---
book: exact-words-for-real-parts
chapterSlug: measured-or-reported
order: 3
title: "Measured or reported: knowledge by acquaintance and knowledge by description"
description: "Separate what someone measured directly from what is known only through a chain of records, count both for the bracket order, and find the link in the chain that broke."
draft: false
---

When the customer asks how the workshop knows its brackets conform, the honest answer has two parts. Some things the workshop knows because somebody put a gauge on a part and read a number. Most things it knows because a record says so, and that record rests on another record, which rests on an assumption that parts made the same way come out the same. Both kinds of knowledge are legitimate. They are not equally strong, and a certificate that blends them hides which is which.

Russell drew this distinction in 1911 and again in *The Problems of Philosophy* (1912), where he called it knowledge by acquaintance and knowledge by description. This chapter adapts it to inspection records, counts both kinds for the 60 brackets, and finds where the chain that connected them broke.

## Russell's distinction

For Russell, we are acquainted with something when we are directly aware of it, without any process of inference. We know something by description when we know only that there is exactly one thing answering to a description, and that it has certain properties. His example was the difference between seeing a table and knowing about a person you have never met as "the author of" a particular book. The second kind of knowledge reaches further, but it depends on every link in the description holding.

He added a principle that does real work: every proposition we can understand must be made up of parts with which we are acquainted. Knowledge by description extends what we know, but it is always anchored somewhere in acquaintance. A claim with no anchor is not knowledge at all.

Russell's own notion of acquaintance was much narrower than anything an engineer would use. He held that we are acquainted with our own sense-data, not with physical objects, so for him even a micrometer reading is knowledge by description of the part. This book uses a working version of the distinction. A result counts as direct when a calibrated instrument was applied to this characteristic of this part and the reading was recorded. Everything else is known by description: through a record, a sample, a certificate from someone else, or an argument that this part resembles one that was measured.

```figure
type: compare
title: Two ways a workshop knows a bracket conforms
cols: Direct measurement | Known by description
caption: Both are needed in any economical inspection system. The weakness of the second is that it inherits every assumption in the chain behind it.
- How it is obtained | a gauge on this characteristic of this part | a record, a sample, a certificate or a same-process argument
- What it rests on | the instrument's calibration and the reading | every link in the chain, including unstated ones
- Typical example | thickness micrometered on bracket 17 | bracket 44's holes, inferred from bracket 1's first-off report
- How it fails | measurement error, covered in Chapter 6 | a link that no longer holds, often without anyone noticing
- What the record must show | instrument, reading, person, time | the chain, back to its direct measurements
```

## Counting both for the bracket order

This is an illustration. The workshop's inspection plan for CB-12 read as follows:

1. First-off inspection: all ten characteristics on bracket 1, using a micrometer, the coordinate measuring machine and callipers.
2. In-process: thickness on every bracket, by micrometer.
3. Sample: bore, dowel hole, the four clearance holes and flatness on brackets 12, 24, 36, 48 and 60, on the coordinate measuring machine.
4. Length and width: first-off only, by callipers.

The plan is reasonable for a stable process. It also lets the workshop count exactly how much of its certificate rests on direct measurement.

```figure
type: formula
title: Direct results in the CB-12 inspection record
formula: direct = first-off + in-process + sample
caption: This is an illustration. Of the 600 characteristic results the certificate covers, 104 were measured directly. The other 496 are known by description.
- first-off | 10 characteristics on bracket 1
- in-process | thickness on the other 59 brackets
- sample | 7 characteristics on each of 5 brackets
step: direct = 10 + 59 + 5 × 7 = 104
step: share measured directly = 104 ÷ 600 = 17.3%
step: known by description = 600 − 104 = 496
```

The distribution across characteristics is uneven, and that unevenness is the first useful finding. Thickness was measured on every bracket. Length and width were measured once.

```figure
type: bars
title: Brackets measured directly, by characteristic, out of 60
unit: brackets
max: 60
caption: This is an illustration. Each clearance hole was measured on 6 brackets: the first-off and the five samples. Three of those samples came from the second set-up, and Chapter 7 shows that their hole positions were measured against the wrong reference.
- Thickness | 60
- Bore, datum B | 6
- Dowel hole, datum C | 6
- * Each clearance hole, size and position | 6
- Flatness, datum A | 6
- Length | 1
- Width | 1
```

Seventeen per cent is not in itself a problem. Most of the 496 results known by description are perfectly well founded, because they rest on a chain whose links hold: a capable process, a stable set-up and sampling that would catch a drift. The question is never whether to rely on description. It is whether each chain is still intact.

## The chain behind bracket 44

Take one result the certificate asserts: "the position of hole 5 on bracket 44 is within Ø0.3 mm at MMC of true position". Nobody measured it before delivery. The workshop knew it by description, and the description can be written out link by link.

```figure
type: layers
title: How the workshop knew hole 5 on bracket 44 was in position
caption: This is an illustration. Read from the top down, each layer rests on the one below. The highlighted layer stopped being true at the refit between brackets 30 and 31, and no record showed it.
- Certificate | all 60 brackets conform to CB-12 revision B
- Inspection plan | hole position is verified at first-off and by sampling
- Sample results | brackets 36, 48 and 60 passed hole position on the measuring machine
- * Same-set-up argument | bracket 44 was made on the same fixture set-up as bracket 1
- First-off report | bracket 1, all ten characteristics within tolerance
- Direct measurement | coordinate measuring machine readings for bracket 1, 3 October
```

Two layers carry the weight. The same-set-up argument connects bracket 44 to the direct measurement on bracket 1. The sample results are supposed to confirm that the connection still holds. In this case both failed. The same-set-up argument was false, because bracket 44 was made after the refit, on a set-up that was never first-off inspected. The sample results looked like confirmation, but Chapter 7 shows that the measuring machine was aligned in a way that could not detect the fault.

Russell's principle makes the diagnosis sharp. A claim known by description must be anchored in acquaintance. The claim about bracket 44 appeared to be anchored in bracket 1, but the description that linked them, "made on the same set-up", no longer picked out bracket 44. The anchor was real; the rope to it had been cut.

## Looking at the second set-up alone

When the count is repeated for brackets 31 to 60 alone, the picture is starker.

This is an illustration. Those 30 brackets carry 300 characteristic results. Direct measurements on them were thickness on all 30, and seven characteristics on each of brackets 36, 48 and 60: 30 + 21 = 51 results, or 17% of 300. For the characteristic that failed, hole position, the workshop had 12 direct results out of 120, all from the three sampled brackets, and all taken with the pattern best-fitted rather than aligned to datums B and C. In effect, it had no direct knowledge of hole position on the second set-up at all.

| Group | Results | Measured directly | Hole position measured directly |
| --- | --- | --- | --- |
| Brackets 1 to 30 | 300 | 53 | 12: bracket 1 aligned to datums, brackets 12 and 24 best-fitted |
| Brackets 31 to 60 | 300 | 51 | 12, all best-fitted |
| Whole order | 600 | 104 | 24 |

The two halves look almost the same in the totals. Only the right-hand column, and the note about alignment, shows the difference. A summary that reports "17% of results measured directly" for the order would be accurate and would conceal everything that matters.

## Failure: a chain with an unmarked break

The failure here is common enough to deserve a name: a chain of description that breaks without any record of the break. The refit was a real event. The machinist knew it happened, the production planner knew, and the machine's log showed a programme reload. But none of those records connected to the inspection plan, so the inspection plan went on treating brackets 31 to 60 as if they came from the set-up that bracket 1 had verified.

Detection comes from asking, for every claim known by description, what event would make the description stop applying, and whether that event is recorded where the inspector will see it. For the same-set-up argument, the events are a fixture removal, a tool change on a critical feature, a programme edit, a machine change and a material change. Any of them breaks the link.

The workshop's correction had three parts:

1. The inspection plan now lists the events that require a new first-off: fixture removed or moved, critical tool changed, programme edited, machine changed, new material batch.
2. The set-up sheet carries a signed line for each set-up change, with the first-off report number. Production cannot release the next part until that line is filled.
3. The inspection record shows, for each result, whether it was measured directly or inferred, and if inferred, from which direct result.

The third change is the one Russell's distinction most directly supports. It makes the anchor of every claim visible, so that a reader of the record can see in seconds which results depend on which measurements.

## Direct knowledge has a date

A direct measurement is a measurement of a part at a moment. It says what the part was when the gauge touched it, not what it is now. Between inspection and use, a part can be handled, deburred, anodised, stored in a hot shed or dropped. Each of those events turns a direct result about the part then into a description of the part now, resting on the argument that nothing relevant has changed since.

For the brackets the gap was short and the risks small: aluminium plate does not creep at room temperature, and the brackets were packed straight after inspection. But the point matters for anything that is coated, heat treated, stress relieved or assembled after measurement. A thickness measured before anodising does not describe the anodised part, because the coating grows on both faces. A hole measured before a press fit is inserted nearby may not describe the hole after. Russell's distinction carries over directly: a claim about the part in service is a claim by description, and its chain runs through every process step after the last measurement.

The record should therefore say when each direct result was taken, at which stage of manufacture, and whether any later step could change it. That costs one column in the inspection record and removes a whole class of disputes.

## Someone else's measurement

The customer's incoming inspection also measured brackets, after the complaint: its technician checked hole position on four failing brackets with a height gauge and a set of pins. To the customer, those results are direct. To the workshop, they are known by description, through the customer's report, the customer's equipment and the customer's method.

That is not a reason to dismiss them. It is a reason to ask for the chain: which brackets, which instrument, how the part was located, what was read. In this case the customer had located each bracket on a pin in its bore and a pin in its dowel hole, exactly as the module does. That method aligned the measurement to datums B and C and found all four holes rotated by about half a degree. The workshop's quality lead could then repeat the measurement on bracket 44 in the workshop and turn a description into a direct result of her own. When two parties disagree about a measurement, the fastest route to agreement is usually for each to state the chain behind its result, and for both to measure one part the same way.

## Description is not second-class

None of this argues for measuring everything. Russell's point was that knowledge by description vastly extends what we can know; without it we would know almost nothing beyond our immediate surroundings. The same is true in a workshop. Measuring 600 results to certify 60 brackets at A$85 each would cost more than the order is worth. Sampling, process control and supplier certificates exist so that a small amount of direct measurement can support a large number of justified claims.

The discipline is to know which claims are which, to keep the chains short, and to put a check on every link that can break. A process with good capability and a short, well-guarded chain can support a certificate on 17% direct measurement with confidence. A process with an unguarded link cannot support it on 50%.

## What the customer receives

The customer's question was how the workshop knows its brackets conform. After the investigation, the workshop can give a precise answer. For brackets 1 to 30, it knows hole position by description from bracket 1's first-off, which was aligned to the datums; the samples at brackets 12 and 24 were best-fitted, so they confirm hole size and the shape of the pattern but not its orientation. For brackets 31 to 60, it did not know hole position at all until the re-inspection described in Chapter 7. That is an uncomfortable sentence to send. It is also the only one that will survive the customer's own audit.

## Exercise: classify the claims on a material certificate

The aluminium plate for the brackets came with a mill certificate. The workshop's receiving record makes five claims about the material in brackets 31 to 60:

1. The plate is 6061-T6.
2. The plate's tensile strength is at least 290 MPa.
3. The heat number on the plate matches the heat number on the mill certificate.
4. The plate's hardness, tested by the workshop on two offcuts, is 95 and 96 HBW.
5. All 30 brackets were cut from that plate.

Classify each as direct or by description, write the chain for each claim known by description, and name one event that would break each chain.

**Worked answer.** Claim 3 is direct: someone read the stamped heat number and compared it with the certificate. Claim 4 is direct for the two offcuts and by description for the brackets, through the argument that the offcuts and the brackets came from the same plate. Claims 1 and 2 are by description: the mill tested its own samples, and the workshop relies on the certificate, the matching heat number and the mill's quality system. The chain breaks if the heat number was transcribed wrongly or the certificate belongs to a different plate. Claim 5 is by description, resting on the cutting list and the saw operator's practice; it breaks if a second plate was opened partway through, for example after a miscut. Of the five claims, one is fully direct, one is partly direct, and three rest on chains. The most fragile is claim 5, because nothing in the record would show a second plate. A one-line entry on the cutting list naming the heat number for each bracket batch would turn it into a short chain with a visible anchor.
