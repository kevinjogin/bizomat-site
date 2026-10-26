---
book: cad-automation-that-pays
chapterSlug: from-recorded-macro-to-written-tool
order: 2
title: "From a recorded macro to a written tool"
description: "What a recorded macro captures and what it gets wrong, how to strip it to the calls that matter, replace literals with inputs, check the session's state first, and report what happened."
draft: false
---

Most CAD programs can record a macro: the user starts the recorder, does the task once, and the program writes down each action as a line of code. It is the quickest way to find out which programming calls correspond to which menu commands, and the worst way to build a tool. A recording captures one performance of the task, in one state of the program, with one set of files and names. Run it again in a different state and it fails, or worse, succeeds on the wrong thing.

This chapter treats the recorder as what it is, a way of discovering calls, and shows how to turn a recording into a tool. It covers what recordings capture, what they get wrong, how to strip a recording down to the calls that do the work, how to replace its fixed values with inputs, how to check the CAD session before acting, and how to report success and failure. The running case starts the release pack from a recording of a drafter saving a PDF and finds the recording's first fault in its first batch.

## What a recording captures

A recorder writes a line for each action it can see, in the order it happened, with the values that applied at the time. A recording of a drafter saving the open drawing as a PDF typically contains:

- lines that set the window's position and size, because the drafter moved the window;
- lines that zoom and pan the view;
- a line that gets the active document, often stored in a variable named after the document that was open;
- the save call itself, with the full file path and name typed out;
- options for the save, as numbers whose meaning is not written down;
- sometimes a line that closes the document or returns to the previous view.

Many of those lines do nothing useful in a tool. Others are dangerous. The file name is the name of the drawing that was open when the macro was recorded, so every later run saves to the same file.

## What recordings get wrong

Four faults appear in almost every recorded macro.

1. **Fixed values.** Paths, names, dimension values and option numbers are written in as they were at the time. The tool does the same thing to whatever is open.
2. **Assumed state.** The recording assumes a document is open, of the right type, with the right thing selected. Run with nothing open and it stops with an error that tells the user nothing useful, typically that an object has not been set.
3. **Irrelevant actions.** Window moves, zooms, selections clicked and unclicked: they slow the tool down and can fail on a different screen size.
4. **No outcome.** A recording does not check whether its save succeeded. If the file is read-only or the folder does not exist, it carries on as if it had worked.

```figure
type: compare
title: Lines in the office's recorded PDF macro
cols: Count | Keep in the tool? | Why
caption: This is an illustration of a recording made by a drafter saving one drawing as PDF.
- Window position and size | 4 | No | Depends on the drafter's screen
- Zoom and pan | 14 | No | Changes nothing that is saved
- Get the active document | 2 | Yes, with a check | Must confirm a drawing is open
- Save call with path and options | 3 | Yes, rewritten | Path and name must come from the drawing
- Selections made and cleared | 11 | No | Not needed to save a PDF
- *Declarations and comments | 8 | Partly | Most are unused variables
- Total | 42 | 9 kept | About a fifth of the recording does the work
```

## The error: forty drawings, one PDF

This is an illustration. Before the release pack was designed, a drafter had recorded a PDF macro and shared it with the office. It saved the open drawing as a PDF in the release folder, named after the drawing that had been open when it was recorded: "TA-201 Rev B.pdf".

During a busy week, another drafter ran it on 37 drawings, one after another, and moved on. At the end of the week the release folder contained one PDF, "TA-201 Rev B.pdf", containing whichever drawing had been saved last. Every run had saved over the previous file, and the save call had reported success each time. The fault was found when a supplier asked for a drawing that should have been in the folder and was not.

A simple check would have caught it the first time: count the files in the release folder after a batch, and compare the count with the number of drawings. Thirty-seven drawings and one file is impossible to miss. The release pack does that count at the end of every batch, and Chapter 8 makes it part of the tool's report.

## Strip it to the calls that matter

The first step in turning a recording into a tool is deletion. Remove the window moves, zooms and pans, the selections that are made and cleared, and the unused declarations. What remains is usually a handful of calls: get the application, get the document, do the action, perhaps close or save.

Then look up each remaining call in the CAD program's API help. Recorders sometimes use older versions of a call, or the version that matches the menu path rather than the most suitable one, and the help usually lists a newer call with better error reporting. Check what each numeric option means, and replace the number with the named constant the API provides, so that the next reader knows what option 3 is.

## Replace fixed values with inputs

Each fixed value becomes either an input or a value the tool works out. For the PDF save:

- the **output folder** becomes an input, or a setting read from a configuration file the administrator controls;
- the **file name** is built from the drawing's own properties: its number, its revision and the office's naming convention;
- the **save options** become named constants chosen deliberately.

The rule is that nothing in the tool should depend on what happened to be open when it was written. A useful test is to run the tool on a drawing other than the one it was developed with, then on a drawing in a different folder, then on one with a long name and unusual characters. Each exposes a different fixed assumption. A fourth test, running the tool from a different user's login, finds paths that point into the author's own profile folder, which recordings capture surprisingly often because CAD programs keep temporary files there.

## Check the state before acting

A written tool begins by checking that the CAD session is in the state it needs. For a tool that saves the active drawing:

```
start
  get the CAD application; if none is running, report and stop
  get the active document; if there is none, report "no document open" and stop
  if the document is not a drawing, report "this tool works on drawings" and stop
  if the document has never been saved, report "save the drawing first" and stop
  read the drawing number and revision; if either is blank, report which and stop
  build the output name from number, revision and convention
  if the output folder does not exist, report and stop
  if a file of that name already exists, ask whether to replace it
  save, and check the result
  report what was saved and where
end
```

Every line before "save" is a check, and each check that fails tells the user exactly what is wrong and stops without changing anything. That is the difference between a tool that fails safely and one that fails silently.

```figure
type: checklist
title: Preconditions for the release pack's PDF step
caption: This is an illustration. Each check that fails stops the step and says why; none changes a file.
- CAD application running and reachable | Otherwise nothing else can be checked
- A document is open | Otherwise "no document open"
- The document is a drawing | Parts and assemblies get a different message
- The drawing has been saved at least once | An unsaved drawing has no path or properties to read
- Drawing number and revision are filled in | The output name depends on them
- Output folder exists and is writable | Checked before, not after, saving
- x Existing file of the same name replaced silently | Ask, or stop, but never overwrite without saying
- ? Drawing has unsaved changes | Ask whether to save the drawing first
```

## Report what happened

A recording reports nothing. A tool should report three things: what it did, what it could not do, and why. For a single drawing, that can be a short message. For a batch, it is a log: one line per file, with the file, the action, the result and any message, and a summary at the end that counts successes and failures.

Two habits make reports useful. Check every call's return value, so that a save that failed is recorded as failed rather than assumed to have worked. And write the log as plain text or a simple table that a person can read and a spreadsheet can open, with the date, the user and the tool's version at the top, so that a report found months later can be traced to the run that made it.

## Stop, skip or ask

When a check fails, the tool has three choices, and the right one depends on whether it is working on one file or many and on how serious the failure is.

```figure
type: decision
title: A check has failed. What should the tool do?
question: The tool cannot safely complete an action on this file. Which response?
- Single file, any failure | Stop and tell the user exactly what is wrong | The user is watching and can fix it
- *Batch, failure on one file | Skip the file, log why, and carry on | One bad file should not stop forty good ones
- Batch, failure affecting every file | Stop the batch and report | A missing output folder will fail every file the same way
- Destructive action, any doubt | Ask before acting, or stop | Replacing or deleting files is not undoable
```

The release pack applies the table directly. Run on one drawing, it stops at the first failed check. Run on a batch, it skips drawings that fail a per-file check, logs each skip with its reason and finishes the rest. If a check fails that would fail for every drawing, such as the release folder being missing or read-only, it stops at once, because carrying on would fill the log with forty identical failures and change nothing.

## Where the code lives

A recorded macro is usually saved as a macro file that the CAD program runs inside its own scripting environment. That is fine for a personal tool. For an office tool, three questions matter.

**Can it be versioned?** Some macro formats are binary files that a version control system can store but not compare. Keeping the code also as plain text, exported from the macro editor, lets changes be reviewed line by line.

**Can it be deployed?** A macro file copied to nine seats is nine copies, and the next change means nine more. A single copy on a shared folder that every seat runs from is easier, provided the folder is read-only to users, so that nobody edits the office's copy by accident.

**Does it need to be compiled?** Larger tools, with forms and settings, are often written as standalone programs or add-ins in a general-purpose language, which connect to the CAD program from outside. They are more work to set up and easier to test, version and deploy. Chapter 9 compares the options.

The release pack started as a macro file for the first trial and moved to a small compiled program once its scope was settled, with its source in the office's version control and one deployed copy on a read-only share.

## Names and comments

A recording names its variables after whatever was open: "Part1", "Drawing3", "boolstatus". A tool's variables should be named for what they hold, "activeDrawing", "outputFolder", "saveSucceeded", so that the code reads as a description of the task. And each block should have a comment saying why it is there, not what it does: "Refuse unsaved drawings: they have no path to build the output name from" helps the next owner; "Check if saved" does not. The release pack's code has about one line of comment for every four lines of code, which the administrator considers about right for a tool someone else may have to fix.

## Keep the recording, too

The original recording is still worth keeping, in the tool's project folder, labelled as the recording it came from. When an upgrade changes a call, re-recording the same action in the new version and comparing the two recordings is often the quickest way to find out what changed. The release pack's folder keeps one recording for each export type, with the CAD version each was made in.

## The running case: the release pack's first step

This is an illustration. The administrator recorded a PDF save, deleted 33 of its 42 lines, looked up the remaining calls, replaced the two option numbers with named constants, and wrapped the save in the checks above. The output name is built as drawing number, a space, "Rev", a space, the revision, then the extension, matching the office's convention, for example "TA-201 Rev C.pdf". The tool refuses to run on an unsaved drawing, a part or an assembly, and asks before replacing an existing file.

Tested on 20 drawings from four projects, including two with blank revision fields, the step saved 18 PDFs with the right names and stopped on the two with blank revisions, naming the field that was empty. The release folder held 18 files after the run, matching the log's 18 successes. That count, files against log, is the first line of the release pack's test plan.

## Exercise: the STEP export

The office's recording of a STEP export, made from an open part, contains 31 lines: window and view lines, a line that gets the active document, a save call with the path "C:\Release\BR-310 Rev A.step" typed in, and an option number of 214. What would you remove, what would you replace, and what checks would you add?

**Worked answer.**

**Remove** the window and view lines, any selections and any unused declarations; for a save, they do nothing.

**Replace** the fixed path with an output folder from the tool's settings, and the fixed name with one built from the model's part number and revision, following the convention. Replace option 214 with the API's named constant for the export setting it represents, after looking it up; a number like 214 means nothing to the next reader and may mean something different in another version.

**Add checks** that a document is open, that it is a part or an assembly rather than a drawing, that it has been saved, that its part number and revision are filled in, that the output folder exists, and that no file of the same name exists, or ask before replacing it. After the save, check the call's result and that the file now exists and is larger than zero bytes, and log the outcome.

The finished step will probably be about the same length as the recording, but every line will do something deliberate. Test it on an assembly as well as a part, because assemblies with many components export more slowly and sometimes need different options, which the recording, made on one small part, could never have shown.
