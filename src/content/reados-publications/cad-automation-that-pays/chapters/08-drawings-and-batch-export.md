---
book: cad-automation-that-pays
chapterSlug: drawings-and-batch-export
order: 8
title: "Drawings and batch export"
description: "Build a batch export that names files by convention, checks every output it writes, handles locked and missing files, recovers from failures, keeps the CAD session healthy and reports in full."
draft: false
---

A batch export is where CAD automation earns most of its keep and does most of its damage. It runs unattended over tens or hundreds of files, and its value depends entirely on whether every output is right: the right drawing, the right revision, every sheet, every format, named so that suppliers and systems find it. A batch that reports success while quietly writing one sheet of a three-sheet drawing, or skipping a locked file, is worse than no batch at all, because people stop checking.

This chapter builds the release pack's core: the batch that, for each drawing, exports PDF, DXF and STEP, names and copies them, and records the release. It covers timing the batch, naming outputs, checking each output after it is written, handling the files that fail, keeping the CAD session healthy over a long run, and writing a report someone can trust. The running case finds that a PDF option exported only the active sheet of every multi-sheet drawing, and that the check meant to catch it was missing.

## What the batch does for each drawing

This is an illustration. For each drawing in the batch, the release pack:

1. opens the drawing and checks its properties against the schema, as Chapter 7 describes;
2. finds the drawing's model by matching part numbers, as Chapter 3 describes;
3. saves a PDF of every sheet of the drawing;
4. for sheet metal parts, saves a DXF of the flat pattern;
5. opens the model in a light mode and saves a STEP file;
6. names each output by the convention and copies it to the release folder;
7. checks each output, then writes a line to the release register;
8. closes everything it opened.

Each step can fail, and each failure is logged with the drawing, the step and the reason.

## How long it takes

The administrator timed each step on the office's typical drawings.

```figure
type: stack
title: Machine time to release one drawing, average
unit: s
caption: This is an illustration. About 72 seconds a drawing, so a batch of 40 runs for about 48 minutes unattended. STEP export dominates, and grows with assembly size.
- Open drawing | 10
- PDF of all sheets | 8
- Open model, light mode | 12
- STEP export | 30
- DXF of flat, averaged | 3
- Copy and name | 5
- Check outputs and write register | 4
```

At about 72 seconds a drawing, the week's 40 drawings take about **48 minutes** of machine time. The release pack is run at the end of the day on a spare seat, so the time costs nobody anything, which is why Chapter 1's payback counted people's time only. For a single urgent drawing, a drafter can run it interactively and wait a little over a minute.

## Naming outputs

Each output is named by the office's convention, built from the drawing's properties: number, revision, and for multi-format releases, the extension that identifies the format. "TA-201 Rev C.pdf", "TA-201 Rev C.step", and for a sheet metal flat, "BR-310 Rev B FLAT.dxf". The name is built once per drawing, from properties checked in step 1, and used for every format, so that all of one drawing's files sort together.

Before writing, the tool checks whether a file of that name already exists in the release folder. If it does, a drawing at that revision has already been released, and the tool stops for that drawing and reports it, because overwriting a released file is a change to a record that suppliers may already hold. A re-release at the same revision is a decision for a person, not the batch.

## Check every output

The lesson of Chapter 2's forty-drawings-one-PDF fault is that a save call's success flag is not proof of a correct output. The release pack checks each file it writes:

```figure
type: compare
title: Checks on each output the release pack writes
cols: Check | Catches
caption: This is an illustration. Each check is cheap; together they turn "the call succeeded" into "the file is right".
- PDF | File exists, larger than zero, page count equals the drawing's sheet count | Missing sheets, empty files
- DXF | File exists, larger than zero, contains the expected number of closed outlines | Flats not unfolded, empty exports
- STEP | File exists, larger than zero, header names the expected part number | Wrong model, failed export
- *All | Name matches the convention; no existing file was replaced | Overwrites, convention drift
- Register | One new line per released drawing; count equals PDFs written | Double or missing entries
```

The checks add about four seconds a drawing. A deeper check, reopening each STEP file in the CAD program and comparing its volume with the model's, would catch more and takes much longer, so the release pack does it on one drawing in twenty, chosen at random, and logs the result.

## The error: one sheet of three

This is an illustration. The first version of the release pack had all the checks above except the PDF page count. In its third week, a supplier asked for sheet 2 of a fabrication drawing that the PDF they had been sent did not contain. The administrator checked the week's PDFs: of 40 drawings, 26 had one sheet and 14 had two or three, and every one of the 14 PDFs contained only one sheet.

The PDF save had been set, in a copy of the recorded options, to export the active sheet, which is the sheet the drawing opens on. On single-sheet drawings that was the whole drawing; on multi-sheet drawings it was sheet 1. The save call reported success every time, because it had done exactly what it was told.

The fix was to set the option to export all sheets, and to add the page count check: the PDF's page count must equal the drawing's sheet count, which the API reports. The 40 drawings should have produced 26 + 14 × 2.3, about 58 pages in total, against the 40 the faulty batch produced; the check would have flagged all 14 multi-sheet drawings on the first day. The 14 drawings were re-released at the same revision, as a corrected issue recorded in the register, and the suppliers were sent the complete PDFs.

## Files that fail

In its first six months, the release pack released 1,040 drawings and failed on 9, a rate of about **0.9%**. The failures fell into three groups.

```figure
type: bars
title: Release pack failures in its first six months
unit: drawings
max: 5
caption: This is an illustration. 9 failures in 1,040 drawings. Each was logged and skipped; none stopped the batch or produced a wrong output.
- STEP export timed out on a large assembly | 4
- File locked by another user | 3
- Model not found for the drawing | 2
```

Each failure was handled the same way: the drawing was skipped, the reason logged, and the batch continued. None produced a wrong file in the release folder, because each output is checked before the next step and a failed export leaves nothing behind: the tool writes to a temporary name and renames to the final name only after the checks pass, so a half-written STEP file can never be mistaken for a released one. For timeouts, the tool retries once with a longer limit before giving up, which cleared two of the four. Locked files are reported with the name of the user who has them open, where the CAD program or vault provides it, so that the drafter can ask. Missing models are reported with the path the drawing expected. Every failure appears at the top of the batch report, before the list of successes, so that nobody misses it.

## Keep the CAD session healthy

A CAD program opening and closing hundreds of documents in one session can slow down as memory fills with data it does not release, and a long batch can fail late for reasons unrelated to any one file. The release pack takes three precautions. It closes every document it opened as soon as it has finished with it. It restarts the CAD program after every 100 drawings, which in the office's experience keeps the session fast. And it writes its log line for each drawing as soon as that drawing is done, not at the end, so that if the CAD program crashes at drawing 87, the log shows exactly which 86 were released and the batch can be resumed from 87.

## Settings other people depend on

Each export format has settings that matter to whoever receives the file. A STEP file can be written to different application protocols, which carry different information; a DXF file can be written in different versions and with different units and layer handling; a PDF can embed fonts or not, and can include or exclude colour. A supplier's laser cutter may need DXF in millimetres with each outline on one layer; a customer's CAD system may need STEP to a particular protocol.

The release pack keeps every export setting in a settings file that the administrator controls, not in the code, with a comment beside each saying who depends on it. When a supplier asks for a different DXF version, the administrator changes one line and records why. The settings file is under version control with the code, so that a change to an export setting is as traceable as a change to the program.

## Dry runs for batches

A batch of 600 drawings is a large change to make in one go. Before the real run, the release pack can do a dry run: open each drawing, check its properties, find its model, build its output names and check for existing files, without exporting anything. On the office's drawings, a dry run takes about 15 seconds a drawing, a third of the real run, and it finds most of the failures that would otherwise appear in the morning: blank properties, missing models, names that collide with already released files. For the 600-drawing batch in the exercise below, the administrator would run a dry run on Friday afternoon, fix what it finds, and start the real run before leaving.

## Interactive and unattended runs

The same batch code serves two kinds of run. Interactively, a drafter releases one drawing or a few, watches the progress and reads the report at once; the tool can ask questions, such as whether to save a drawing with unsaved changes. Unattended, nobody is watching, so the tool must never ask: every question needs a default answer set in advance, usually the safe one, "skip and log". The release pack has a single setting that switches between the two modes, and in unattended mode any situation that would have prompted a question becomes a logged skip. A batch that stops at drawing 3 with a dialog box waiting for an answer has wasted the night.

## Licences and seats

An unattended batch runs the CAD program, which uses a licence. In an office with as many licences as people, a batch run in working hours takes a licence someone may need. The release pack runs on a spare seat after hours, and the office's licence count was checked before that arrangement was relied on. Licensing terms for running CAD software unattended or for automated processing vary between vendors and agreements, and the office confirmed its arrangement with its reseller rather than assuming.

## The register

The release register records each release: drawing number, revision, date, who released it, and which files were written. The release pack appends one line per drawing after its outputs pass their checks. Two people running the tool at once could append to the register at the same moment and corrupt it, so the tool takes a lock on the register file for the moment it writes, and waits briefly if another instance holds it. The register's line count is one of the batch's checks: lines added must equal drawings released.

## The report

At the end of a batch, the release pack writes a report with, in order:

- a summary: drawings in the batch, released, skipped, and the reason for each skip;
- the failures, each with the drawing, the step and the message;
- the list of released drawings with their files;
- the counts that check the batch: PDFs, pages, DXFs, STEP files and register lines, each compared with what was expected.

A person reads the summary and the failures every time. The counts are there so that a mismatch, like 40 pages for 58 sheets, is impossible to miss.

The report is written as plain text and as a table, both in the release folder beside the files they describe, and its first line names the tool's version, the settings file's version and the CAD version that ran it. When a supplier queries a file a year later, the report says exactly how it was made, which is often the quickest way to answer the query.

## Exercise: a bigger batch

At the end of a project, the office wants to release 600 drawings in one batch over a weekend. At 72 seconds each, with a restart every 100 drawings taking about three minutes, how long will it run? At the first six months' failure rate, how many failures should the administrator expect, and what should the report let them do on Monday?

**Worked answer.** Machine time is 600 × 72 = 43,200 seconds, or **12 hours**. Five restarts, after drawings 100, 200, 300, 400 and 500, add 5 × 3 = **15 minutes**. The batch runs for about **12 hours 15 minutes**, comfortably within a weekend.

At about 0.9%, 600 drawings would produce about **5** failures; the observed rate was 9 in 1,040, which on 600 gives 5.2.

On Monday the report should let the administrator see at once which drawings failed and why, fix the causes, such as asking a user to close a locked file, and re-run the batch on just those drawings. Because the tool refuses to overwrite released files, re-running the whole batch would also be safe: the 595 drawings already released would be skipped as "already released at this revision", and only the failures would be attempted again.
