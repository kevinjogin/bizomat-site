---
book: yes-and-no-when-sources-disagree
chapterSlug: copying-errors-and-superseded-revisions
order: 3
title: "Copying errors and superseded revisions: lost units, slipped digits, withdrawn values"
description: "How to recognise a number damaged in copying or withdrawn by its author: lost units, decimal and digit slips, wrong rows and superseded revisions, with plausibility and document-history checks."
draft: false
---

Some conflicts are not disagreements at all. One of the sources is simply a damaged copy of the other, or an old statement its own author has since withdrawn. These are among the easiest conflicts to resolve once suspected, and among the most expensive to miss, because a damaged copy looks exactly as authoritative as the original.

Abelard named both problems. A scribe could make a blunder in copying a manuscript, so an apparent absurdity in a text might belong to the copyist rather than the author. And writers sometimes changed their minds: he pointed to Augustine, who reviewed his own earlier works late in life and openly corrected them. A reader who found an old opinion contradicting a later one should check whether the author had withdrawn it. Engineering documents suffer from both. Values are retyped, converted, transferred between systems and printed onto cards, and each step can drop a unit or slip a digit. Drawings and manuals are revised, but the old copies remain in folders, email attachments and maintenance systems.

## The drawing note with no unit

In the planner's register, source S3 is a note on the pump's general arrangement drawing, revision B: "FLANGE BOLTS TORQUE 23". No unit is given. Read as N·m, the [bolt torque and preload tool](/tools/bolt-torque-preload/) gives a preload of 7.19 kN in a dry M16 8.8 bolt, only 7.6% of the 94.0 kN proof load. That is so low that the joint would barely be clamped.

A value that implausible is evidence of a copying problem, not of an engineering intention. The planner therefore treats the number as a fragment and asks what complete statement it might be a fragment of.

### Test candidate units for plausibility

A useful first test is to bracket the range of torques that would make engineering sense, then see which readings of the bare number fall inside it. For an M16 8.8 bolt with dry threads, a preload anywhere from 30% to 90% of proof load covers most real tightening targets for gasketed flanges. Using the torque–preload relation at K = 0.20, that range is about **90 N·m to 271 N·m**.

Older drawings and foreign data sheets commonly use kilogram-force metres (kgf·m) or pound-force feet (lbf·ft). The conversions are fixed: one kilogram-force is the force of standard gravity on one kilogram, 9.80665 N, so 1 kgf·m = 9.80665 N·m; and 1 lbf·ft = 1.355818 N·m.

```figure
type: compare
title: Three readings of the bare number 23
cols: In N·m | Preload, dry M16 8.8 | Inside 90 to 271 N·m
caption: This is an illustration. Preloads from the bolt torque and preload tool at K = 0.20. Only the kilogram-force reading gives a plausible tightening value, and it matches the site card's 226 N·m.
- 23 N·m | 23.0 | 7.2 kN, 8% of proof | No
- 23 lbf·ft | 31.2 | 9.7 kN, 10% of proof | No
- *23 kgf·m | 225.6 | 70.5 kN, 75% of proof | Yes
```

Only one reading makes sense. At 23 kgf·m, the note specifies 225.55 N·m, which gives 70.5 kN, 75% of proof load, and matches the site torque card almost exactly. The plausibility test does not prove the unit, but it narrows the search to a specific hypothesis that can be checked against the document itself.

### Confirm the hypothesis in the document

The planner retrieves a full-size scan of revision B rather than the reduced copy in the maintenance system. The title block, which was cropped off the reduced copy, states "Units: mm, kgf, kgf/cm²". The drawing was prepared at a time and place where kilogram-force units were normal. The hypothesis is confirmed: S3 means **23 kgf·m**, or 225.6 N·m on dry threads.

This is a common pattern. The unit was never missing from the original document; it was in a general note or title block, and it was lost when the note was read in isolation. The fix is to read the whole document, not the extract.

## The failure case: a lost unit that became a procedure

The planner then searches the maintenance system for other uses of the number. She finds a work instruction from a previous decade titled "Pump discharge spool replacement". Its tightening step reads "Torque flange bolts to 23 N·m". Someone transcribed the drawing note, saw no unit, and supplied the one they expected.

The instruction was used. The plant's work-order history shows that after the last two shutdowns, the discharge spool joints were reported weeping on restart and were "re-tightened hot" by the operators. Nobody connected the repeated leaks with the instruction, because each leak was treated as an isolated event.

That is how copying errors usually reveal themselves: not as an obviously wrong number on a page, but as a pattern of small failures with no shared explanation. Detection depends on someone asking where a value came from and following it back.

```figure
type: timeline
title: How a drawing note became a faulty instruction
caption: This is an illustration. The note's unit lived in the title block. Copying the note without the block produced an instruction that under-tightened the joints by a factor of almost ten.
- Revision B | Pump maker issues general arrangement drawing | title block: units mm, kgf; note: flange bolts torque 23
- Later | Plant scans drawing at reduced size | title block cropped off in the maintenance system copy
- Earlier work instruction | Note transcribed as 23 N·m | intended 225.6 N·m on dry threads
- Revision C | Pump maker changes casing material | flange torque note deleted; installation manual referenced; plant copy not updated
- *Last two shutdowns | Spool joints weep on restart | re-tightened hot each time; no root cause raised
```

### How it is corrected

Three actions follow, each aimed at a different copy of the error.

1. **Withdraw the work instruction.** It is marked superseded in the maintenance system, with a note giving the reason and pointing to the new instruction.
2. **Replace the reduced drawing copy.** The maintenance system now holds the full-size scan with its title block, so the unit cannot be lost again from that copy.
3. **Raise the leak history as a finding.** The repeated hot re-tightening is recorded as a consequence of the instruction, so that the plant's leak records make sense to whoever reviews them next.

## The superseded revision

The timeline has one more entry that matters. While retrieving revision B, the planner asks the pump maker's representative for the current drawing. It is revision C. The change note says the pump casing material changed from cast steel to grey cast iron, and the flange torque note was deleted. In its place is a reference to the installation manual, which is source S5: "do not exceed 110 N·m with clean dry threads" on the pump's own flanges.

So S3 was not only damaged in copying. It had been withdrawn by its author, for a reason that directly affects joint J1. The original 23 kgf·m was written for a cast steel flange. The current pump has a grey iron flange, and the maker has replaced the old value with a much lower ceiling.

This is Abelard's second explanation in modern form. An author's earlier statement contradicts the later one because the author changed it. The later statement governs, provided the item in front of you matches the later revision. The planner confirms this by checking the pump's nameplate serial number against the maker's records: the installed pump was built to revision C. S3 is closed as **superseded** for J1, and is not a source for J2 or J3 either, since it only ever referred to the pump's flanges.

### Revision checks that catch this early

- Record the revision of every source in the register, as Chapter 1 required.
- For any manufacturer's document, ask the manufacturer for the current revision and its change history. Do not rely on the copy in your own system.
- Match the revision to the actual item, using a serial number, build date or nameplate data. A current drawing for a different build is as misleading as an old drawing for the right one.
- Look for service bulletins, errata and safety notices. These are the manufacturer's retractions, and they are often kept separately from the drawings they amend.

### Controlled and uncontrolled copies

Most organisations already distinguish a controlled document, held in one register and updated when revised, from the uncontrolled copies people print and carry. The distinction only helps if the uncontrolled copies say what they are. The planner's site now prints every drawing and instruction with its revision, the date of printing and the words "uncontrolled when printed: check the register before use". It sounds bureaucratic, but it gives a fitter holding an old printout a simple way to know that a newer revision might exist, and it gives the planner a date to compare against the register when a printed copy turns up in a conflict. A copy that carries its own revision and print date is a source you can test. A copy that carries neither can only be traced by luck.

## A catalogue of copying errors

The lost unit is one of several characteristic copying faults. Each has a typical signature that helps to detect it.

```figure
type: checklist
title: Copying faults and how each one shows itself
caption: This is an illustration. Plausibility checks catch the first three well. The fourth and fifth produce believable numbers and are caught only by comparing with the source.
- x Lost or wrong unit | value implausible by a factor such as 9.81, 1.356 or 25.4
- x Decimal shift | value off by a factor of ten: 13.5 for 135
- x Wrong conversion constant | small error: 230 N·m from 23 kgf·m using 10 for 9.80665
- ? Transposed digits | plausible value: 262 for 226 still gives a believable preload
- ? Wrong row or column | right kind of value for the wrong size, grade or condition
- x Superseded revision | value correct for an earlier design, not the item installed
```

The two question-marked entries need particular care, because they defeat the plausibility test. A transposed 262 N·m on dry M16 8.8 bolts gives F = 262,000 ÷ (0.20 × 16) = **81.9 kN**, 87.1% of proof load. That is high but believable; nobody would reject it on sight. A value read from the M20 row of a table instead of the M16 row would be similarly believable. Only comparison with the original source catches these, which is why the register always records where a number came from.

### Copying faults in digital documents

Modern copying is done by software as often as by people, and software has its own characteristic faults.

- **Decimal commas.** Many European data sheets write a nut factor as "0,12". Pasted into a spreadsheet set to an English locale, that can become the text "0,12", which the formula ignores, or the number 12, which makes every calculated torque a hundred times too large. A torque column that suddenly shows values in the thousands is the usual sign.
- **Lost superscripts and symbols.** Converting a PDF to a spreadsheet can turn "mm²" into "mm2", "N·m" into "Nm" or "N m", and "±" into a stray character. The number survives; the unit or tolerance that gave it meaning may not.
- **Optical character recognition.** Scanned documents read by software confuse 1 and 7, 5 and 6, and 0 and 8 more often than people do, and the result looks clean.
- **Rounding on conversion.** A value stored to one decimal place and converted twice can drift. Converting 225.6 N·m to 23 kgf·m and back gives 225.55 N·m: harmless here, but a reminder to convert from the original value, not from an earlier conversion.

The defence is the same as for manual copying: keep a link from every derived number to the document it came from, and check a sample of derived values against their sources whenever a spreadsheet or conversion tool is introduced.

## Find every copy of a corrected value

Correcting the original is only half the job. A damaged value spreads, and every copy has to be found or it will resurface at the next shutdown. The planner searches for "23" and "flange bolt" across the places where copies of maintenance data usually live:

1. the maintenance system's task lists, work instructions and attached documents;
2. shared drives and the email attachments of previous shutdown packs;
3. laminated cards, tool-crib charts and notes written on equipment;
4. contractors' own instructions from previous jobs;
5. the operators' start-up checklists, which sometimes carry their own re-tightening values.

She finds two more copies: an attachment to an old shutdown pack and a contractor's method statement. Both are marked superseded with the same reference as the withdrawn work instruction. The register records the search, the places searched and the copies found, so a later reviewer can see that the correction was complete rather than assume it.

The wrong-constant case is small but worth knowing. Converting 23 kgf·m with g taken as 10 m/s² gives 230 N·m, about 2% high, and a preload of 71.9 kN instead of 70.5 kN. On its own this is inside the scatter of torque tightening. Its importance is as evidence: a value of exactly 230 in a document suggests that somebody converted an older kgf·m figure, which tells you where to look for the original.

## Exercise: the newer torque card

During the review, a supervisor produces a second, newer printing of the site torque card from another workshop. It lists "M16 8.8: 262 N·m". The calculation sheet behind the original card still gives 225.6 N·m. The supervisor argues that the newer card should govern because it is more recent.

Decide what the 262 N·m value is, show how you would test your hypothesis, and state what goes in the register.

**Worked answer.** The digits 2, 2 and 6 rearranged give 262, so a transposition is the first hypothesis. Plausibility does not reject it: the bolt torque and preload tool gives 81.9 kN at K = 0.20, 87.1% of proof load. The test is therefore against the source, not against engineering sense.

1. Look for a calculation behind the new card. If there is none, it is a copy of something.
2. Compare the other rows on both cards. If every other row matches and only M16 differs, a typing error in one row is far more likely than a deliberate change to one size.
3. Check the card's revision history or ask who printed it.

Suppose the other rows match and no new calculation exists. The register entry reads: "Second card, M16 8.8: 262 N·m. No calculation found; all other rows identical to the original. Assessed as a transposition of 226. Status: copying error; card withdrawn and reprinted." Being newer does not make a copy more authoritative than its source. Recency matters only when the author of the newer document actually changed the value, as the pump maker did with revision C.
