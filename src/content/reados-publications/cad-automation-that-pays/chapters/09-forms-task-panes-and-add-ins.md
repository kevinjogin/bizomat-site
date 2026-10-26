---
book: cad-automation-that-pays
chapterSlug: forms-task-panes-and-add-ins
order: 9
title: "Forms, task panes and add-ins"
description: "Choose how users meet a tool: a plain macro, a form, a native task pane or an add-in, and deploy and update it across seats so that everyone runs the same version."
draft: false
---

A tool that only its author can run is a script. A tool the whole office uses needs a way for people to start it, give it inputs and see its results, and a way to get the same version onto every seat and keep it there. Both are often harder than the tool itself, and both decide whether it is used. A release pack that needs a drafter to open a macro editor and edit a path before running it will be used by one drafter. One that appears as a button, asks two questions in a familiar panel and reports in plain words will be used by nine.

This chapter compares the ways a CAD tool can present itself, from a plain macro to a full add-in, and sets out how to deploy and update a tool across an office. The running case moves the release pack from a macro to an add-in, and finds a seat that had been releasing drawings for two months with an old version that used the previous naming convention.

## Four ways to meet the user

**A plain macro.** The user runs it from the CAD program's macro menu or a toolbar button. It has no interface beyond messages and simple input prompts. It is quick to build and suits tools with no inputs or one or two.

**A form.** The tool shows its own window, with fields, lists and buttons, built with the programming language's form designer. It can be run as a macro with a form, or as a separate program that connects to the CAD program. It suits tools with several inputs and a report to show.

**A native task pane or property page.** Many CAD programs let a tool show a panel in the same style as the program's own commands, with selection boxes, check boxes and the program's own OK and Cancel buttons. SOLIDWORKS calls these PropertyManager pages. A panel like this can filter selections, as Chapter 5 recommends, and responds to the user's actions as they make them. It feels like part of the program, which reduces training.

**An add-in.** The tool is loaded by the CAD program at startup, adds its own menu items or toolbar, and can show forms or native panels. It can respond to events, such as Chapter 7's warning on save. It is the most work to build and deploy, and the most seamless for users.

```figure
type: compare
title: Ways to present a CAD tool
cols: Build effort | User experience | Deployment | Suits
caption: This is an illustration of the office's experience. Effort and experience rise together; the right choice depends on how often and by how many people the tool is used.
- Plain macro | Low | Basic messages | Copy one file | One or two inputs, occasional use
- Form | Medium | Clear, but a separate window | One file or a small program | Several inputs and a visible report
- Native task pane | Medium to high | Feels like the CAD program | As part of a macro or add-in | Inputs that involve selections
- *Add-in | High | Seamless, with its own commands | Installer, registration on each seat | Daily use by the whole office
```

## The running case: from macro to add-in

This is an illustration. The release pack began, in its first trial, as a macro with message boxes. For the office's daily use, the administrator moved it to an add-in with three commands on its own toolbar: "Release this drawing", "Release selected" and "Release assembly". Each opens a native task pane with the inputs that command needs: a check box for the dry run, a selection box filtered to components for "Release selected", and a choice of configuration for "Release assembly". The report appears in the same pane when the run finishes, with a button to open the full log.

The add-in took about 30 of the release pack's 90 build hours. The administrator judged it worth it because nine people would use it daily, and because the native pane let "Release selected" filter the selection, removing the commonest source of confusion found in the macro trial.

## Keep the engine separate from the interface

The release pack's work, checking properties, finding models, exporting, naming, checking outputs and writing the register, lives in one library, the engine, which knows nothing about buttons or panes. The add-in's commands are thin layers that gather the user's inputs, call the engine and show its report. The overnight batch of Chapter 8 is another thin layer, a small program that reads a list of drawings and calls the same engine with unattended settings. And the test harness of Chapter 10 is a third.

The separation costs a little design effort and pays three times. The batch and the add-in can never drift apart, because they run the same code. The engine can be tested without anyone clicking anything. And when the CAD program's interface changes in an upgrade, only the thin layers need attention; the engine, which uses the document and export calls, changes only if those calls change.

## Designing the task pane

A good task pane asks for as little as possible and makes the right choice the default.

```figure
type: checklist
title: Design rules for the release pack's task panes
caption: This is an illustration of the office's rules, written after the macro trial showed where users hesitated.
- Ask only for what the tool cannot work out | The drawing, its model and its name come from properties
- Default to the safe choice | Dry run is off for single drawings, on for assemblies over 50 drawings
- Filter selections to the right type | Components only in Release selected
- Validate as the user types or selects | A blank configuration choice disables the OK button
- Show what will happen before it happens | "Release 10 drawings" on the OK button, not just "OK"
- x Settings that belong to the office | Release folder and naming convention are not on the pane
- ? Advanced options | Hidden under a single expandable group, used by the administrator
```

The OK button's label is a small detail with a large effect. A user who reads "Release 214 drawings" before clicking will stop if they expected ten; one who reads "OK" will not.

## What an add-in needs

An add-in is a compiled library that the CAD program loads. To be loaded, it must be registered on each seat, which usually means an installer that writes entries telling the CAD program where the add-in is and whether to load it at startup. Two consequences follow.

- **Startup time.** An add-in that does heavy work when it loads slows every start of the CAD program on every seat. The release pack's add-in does nothing at startup except add its toolbar; everything else waits until a command is used.
- **Robustness.** An add-in that fails while loading can produce an error at every startup, or be disabled by the CAD program, and the user may not know why. The add-in should catch and log every failure in its loading code, and show a single, clear message if it cannot start.

## Deploying to every seat

A tool's code is only useful if every seat runs the same version of it. The office tried three approaches over the release pack's first year.

```figure
type: bars
title: People's hours a year to deploy four updates to nine seats
unit: hours
max: 13
caption: This is an illustration. Manual installs took about 20 minutes a seat; a scripted installer about 2 minutes; a shared copy with a version check about a quarter of an hour per update in total.
- Install by hand on each seat | 12
- Scripted installer run on each seat | 1.2
- *Shared copy, version check at start | 1
```

Installing by hand, 20 minutes a seat, nine seats, four updates a year, cost about 12 hours a year and left seats out of step whenever someone was on leave. A scripted installer cut the time to about 2 minutes a seat. The office settled on a third approach: the add-in's library lives on a read-only shared folder, each seat's registration points to it, and the add-in checks its own version against a version file on the share when a command starts. An update means copying the new library to the share, about a quarter of an hour including a test, and every seat picks it up at its next CAD start.

## The error: a seat two versions behind

This is an illustration. Before the version check existed, the release pack was installed on each seat by hand. Three months after an update that changed the naming convention for DXF flats from "BR-310 Rev B flat.dxf" to "BR-310 Rev B FLAT.dxf", to match a supplier's system, a supplier reported that some flats were not loading. The register showed 23 releases over two months with the old lower-case name, all from one seat.

That seat's drafter had been on leave during the update and nobody had installed the new version on their machine. The report header, which records the tool's version, showed the old version on every one of the 23 releases, which made the cause quick to find. The fix had two parts: rename the 23 flats and notify the supplier, and add the version check. The add-in now compares its version with the share's at the start of every command and, if it is out of date, refuses to run and tells the user to restart the CAD program. In the year since, no release has been made with an old version.

## Removing an add-in cleanly

Tools are retired as well as installed, and an add-in removed carelessly can leave registration entries behind that make the CAD program look for a library that is no longer there, with an error at every start. Removing one properly means undoing its registration on each seat, which the installer should do when run in uninstall mode, and deleting its library and settings. With the shared-copy approach, the office retires a tool by first removing its registration from every seat, with the same script that installed it, and only then deleting the library from the share, so that no seat is left pointing at nothing. The office's register of tools, from Chapter 1, records each retirement with its date, so that the tool's old reports remain explainable.

## Settings and per-user choices

Some choices belong to the office and some to the user. The release folder, naming convention and export settings are the office's and live in the shared settings file of Chapter 8, read only to users. Some choices are personal: whether to open the release folder after a run, whether to show the dry-run option by default. Those can live in the user's own settings, so that changing them does not affect anyone else. Keeping the two separate stops a drafter from changing the release folder for the whole office by ticking a box.

## Getting people to use it

A tool that saves time only saves it if people use it. The release pack's logs record who ran which command, which gave the administrator a measure of adoption that did not depend on asking.

This is an illustration. In its first month as an add-in, six of the nine drafters used it; the other three released by hand as before. Asked why, two said they had not realised it handled multi-sheet drawings, a fault they remembered from the trial and which had since been fixed, and one said the task pane's dry-run option confused them. A fifteen-minute demonstration at a team meeting, showing a multi-sheet release and explaining the dry run, brought all nine into use within a fortnight. Hand releases, which the register marks separately, fell from about a third of the week's releases to two or three a month, all of them unusual cases the tool deliberately refuses, such as re-releases at the same revision.

Two lessons came out of it. People remember a tool's early faults long after they are fixed, so a fix that matters should be announced, not just deployed. And the log is the cheapest way to see whether a tool is used; a tool nobody runs is a tool whose maintenance cost buys nothing, and the register of tools should note its use alongside its owner.

## Help and messages

Every message a tool shows should say what happened, why and what to do. "Error 3" helps nobody; "TA-201: no model found whose part number matches the drawing number TA-201. Check the drawing's views and the model's part number property." lets the user fix it. The release pack's messages are written in the office's own terms, use the drawing number, and where a fix is in the office's procedures, name the procedure. Each command's task pane has a short help link to a one-page note on the shared drive. The note is written by the administrator and checked by a drafter who did not build the tool, because the author always knows too much to see which step needs explaining.

## Exercise: should the property checker be an add-in?

Chapter 7 described a property check that warns on save. It could be a macro the drafter runs before saving, a command in the release pack's add-in, or event-driven code in the add-in that runs automatically on every save. Which would you choose, and what would you watch for?

**Worked answer.** A macro the drafter must remember to run will be run occasionally, and the problems it would catch will still reach release. A command in the add-in is easier to reach but still depends on the drafter choosing to run it. The event-driven check runs on every save without anyone remembering, which is why the office chose it.

Three things to watch for. **Speed:** the check runs on every save of every document on nine seats, so it must take a fraction of a second; checking only the document being saved, with the schema cached in memory, achieves that. **Safety:** it must never change or block the save, only warn, as Chapter 7 decided. **Robustness:** a failure in the check must be caught and logged, never shown as an error that interrupts the save. With those three rules, the check is invisible when everything is right and helpful when something is not. It also belongs in the same add-in as the release pack rather than a separate one, so that it shares the release pack's schema loading, version check and deployment, and the office has one add-in to maintain, not two.
