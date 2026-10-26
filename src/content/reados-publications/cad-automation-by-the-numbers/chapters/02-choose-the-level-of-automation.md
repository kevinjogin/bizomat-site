---
book: cad-automation-by-the-numbers
chapterSlug: choose-the-level-of-automation
order: 2
title: "Choose the level of automation"
description: "Compare templates, driven master models, macros, stand-alone programs, add-ins and configurators on effort, risk and upkeep, and choose the simplest level that captures the saving."
draft: false
---

Automation in CAD is a ladder, not a switch. At the bottom are good templates and standard parts, which every office should have. At the top are rules-based configurators that build a complete model, drawing set and cut list from a handful of inputs. In between are master models driven by tables, recorded macros, stand-alone programs that drive the CAD system from outside and add-ins that live inside it. Each rung up captures more of the work and costs more to build, test and keep alive.

This chapter sets out the ladder, compares the rungs on the measures that matter over a tool's life, and chooses the architecture for the trestle configurator. It explains the practical difference between a program that runs inside the CAD system and one that drives it from outside, because that choice shapes everything from debugging to deployment. The failure case is the office's first macro, which drew holes in the wrong place because it remembered clicks rather than meaning.

## The ladder of automation

```figure
type: layers
title: Six levels of CAD automation, lowest first
caption: Each level builds on the ones below it. A configurator built on poor templates and fragile master models will inherit their problems.
- Templates and standard parts | consistent starting files, properties and libraries; no programming
- Driven master model | one model whose dimensions and options come from a table or equations
- Recorded or edited macro | a script that repeats a sequence of commands, often recorded then cleaned up
- Stand-alone program | a separate application that starts or connects to the CAD system and drives it from outside
- Add-in | a program loaded by the CAD system itself, with its own menus, panels and access to events
- *Rules-based configurator | inputs, engineering rules, generated models, drawings and outputs, usually built on an add-in or program
```

**Templates and standard parts** are the foundation. If the office's templates do not carry the right properties and drawing formats, every level above them has to work around the gap. The companion book on CAD standards covers this level in detail.

**A driven master model** holds the whole product family in one model, with its dimensions set from a table, often a spreadsheet embedded in or linked to the model. Many CAD systems support this natively. For the trestle range, a table of 828 rows, one per variant, could drive the model's dimensions. It does nothing for the drawings' detail or the cut list, and a table of hundreds of rows is hard to check.

**A macro** repeats a sequence of commands. Recorded macros are quick to create but brittle, because they often record what was clicked rather than what was meant. Edited macros, cleaned up by someone who understands the programming interface, are much more robust and are often the right first tool.

**A stand-alone program** runs as its own application and connects to the CAD system from outside. **An add-in** is loaded by the CAD system itself and runs inside it. The difference matters enough to deserve its own section.

**A configurator** captures the product's engineering rules, takes a few inputs, applies the rules and generates everything the office would otherwise produce by hand. It is usually built as an add-in, a stand-alone program or both.

## Inside or outside the CAD system

CAD systems with programming interfaces usually allow two kinds of program. An **add-in** is loaded by the CAD application when it starts, or when a user enables it, and runs in the same process. A **stand-alone** program is a separate application that starts the CAD system or attaches to a running one, and sends it commands from outside.

The supplied source for this book, written for one CAD system's 2009 interface, compared the two in detail. The trade-offs it described remain broadly true, and the comparison below restates them in general terms.

```figure
type: compare
title: Add-in, stand-alone program or a hybrid of both
cols: Add-in, inside the CAD process | Stand-alone, driving from outside | Hybrid
caption: General characteristics; the details differ between CAD systems and their programming interfaces. Check the vendor's documentation for what is available only to add-ins.
- Integration | menus, panels and toolbars inside the CAD window | its own window beside the CAD system | add-in for the interface, separate program for the heavy work
- Events and notifications | can respond to saves, opens, rebuilds and selections | usually cannot | add-in listens; program acts
- Speed of calls | fastest, no crossing between processes | slower per call | depends on where the work runs
- *Debugging and updating | the CAD system must usually be closed to replace it | can be rebuilt and rerun with the CAD system open | the part that changes most can sit outside
- Deployment | needs registration with the CAD system, usually an installer | copy and run, or a simple installer | both, in one installer
- Independence | runs only with the CAD system | can do other work without the CAD system open | either
```

Two questions usually settle the choice.

**Does the tool need to react to events?** If it must do something when a user saves a file, opens a drawing or changes a selection, or if it needs to put a panel inside the CAD window, it needs an add-in. Some programming interfaces also reserve certain functions for code running inside the process.

**How often will the code change?** A tool whose rules and logic will change frequently is easier to develop and maintain as a stand-alone program, because it can be rebuilt and rerun without closing the CAD system. Replacing an add-in usually means closing the CAD application on every machine that uses it.

When both answers point different ways, a **hybrid** works well: a small, stable add-in provides the menus, panels and event handling, and calls a separate library or program that holds the rules and does the heavy work. The part that changes most is the part that is easiest to replace.

## Speed is rarely the deciding factor

Calls from a stand-alone program cross from one process to another, so each is slower than the same call from an add-in. It is tempting to choose an add-in for speed. For most design automation, the numbers say otherwise.

This is an illustration. Generating one trestle variant takes about 2,000 calls to the programming interface and about 40 seconds of model rebuilding and drawing updates, which happen inside the CAD system whichever kind of program asks for them. If crossing between processes adds, say, half a millisecond per call, that is about **2,000 × 0.0005 = 1 second** per variant, about 2.5% of the 40 seconds. Regenerating all 828 variants would take about **828 × 41 ÷ 3,600 ≈ 9.4 hours** from outside, of which the crossing accounts for about **0.23 hours**. The rebuild time dominates. Regenerating only the 120 stocked variants overnight takes about **1.4 hours** either way.

In-process speed matters for tools that make very many small calls, such as analysis routines that walk every face of a large model, or checks that run on every selection. For a configurator, rebuild time and the number of variants regenerated matter far more.

## Five years, not five months

Chapter 1 compared the macro and the configurator on payback. Over a longer horizon, the comparison changes shape. This is an illustration using Chapter 1's figures and upkeep at 15% of build cost a year for each.

- **Macro:** build A$6,600 plus five years of upkeep at A$990, a total of **A$11,550**, against five years of savings of about **A$266,760**. Net about **A$255,210**.
- **Configurator:** build A$35,200 plus five years of upkeep at A$5,280, a total of **A$61,600**, against about **A$420,660** of savings. Net about **A$359,060**.

The configurator is worth about **A$103,850** more over five years, if its estimated time per variant proves true and the volume holds. The macro is the safer first step. The configurator is the larger prize. That is why the office built the macro, measured it and then built the configurator with evidence rather than hope.

## The trestle configurator's architecture

This is an illustration. The office's requirements, drawn from the measurement in Chapter 1 and the brief in Chapter 5, were:

- a panel inside the CAD window where the designer enters belt width, height, foot style and bracing, with immediate warnings for invalid combinations;
- generation of the model, the drawing set and the cut list from those inputs;
- a warning if anyone edits a generated trestle model by hand and saves it, because a hand-edited variant would no longer match its rules;
- an overnight batch mode to regenerate every stocked variant after a rule change or CAD upgrade, without anyone at the keyboard.

The panel and the save warning need an add-in. The batch mode is better as a stand-alone program that can run unattended. The rules change most often, whenever the product changes. The office chose a hybrid:

1. a **rules library**, separate from both, holding the engineering rules and validation as a single tested component (Chapter 3);
2. a small **add-in** for the panel, menu and save warning, which calls the rules library and the generator;
3. a **generator** that builds models, drawings and cut lists through the CAD system's programming interface, used by both the add-in and the batch program;
4. a **stand-alone batch program** for overnight regeneration and regression testing (Chapter 7).

The design keeps the rules in one place. The add-in and the batch program cannot disagree about whether a 1,050 mm wide trestle at 950 mm height needs a brace, because neither of them decides. The rules library does.

```figure
type: decision
title: Which level for a repeated design task?
question: Does the task follow rules that can be written down and that change less often than the task occurs?
caption: This is an illustration of the office's own decision rule. The levels can be climbed one at a time, with measurement at each step.
- No | Better templates and checklists | judgement work does not automate well; make the starting point and the checking better
- *Yes, a few dimensions change | Driven master model or edited macro | cheap to build; measure for three months before going further
- Yes, models, drawings and outputs all follow rules | Configurator, usually a hybrid of add-in and program | worth it only when frequency and payback justify the upkeep
```

## Skills and ownership at each level

Each rung needs different skills. Templates and driven models need a capable CAD user. Edited macros need someone comfortable reading and changing code. Add-ins and configurators need software development skills: version control, structured code, testing and an installer. Many offices have one person with those skills, which is a risk Chapter 10 deals with.

The office in the running case had one designer who had written macros for years and was learning structured programming. They engaged a contract developer for 120 of the 320 hours, mainly for the add-in's interface and the installer, with the designer owning the rules library and the generator. The contract required the code, the build instructions and the test set to be delivered into the office's own version control, so that the tool would not depend on the contractor. The question of who owns code written by a contractor is covered in the companion book on selling engineering software, and it matters even for a tool that is never sold.

## A failure case: the macro that remembered clicks

This is an illustration. The office's first step, as Chapter 1 recommended, was an edited macro. The first draft was recorded: the designer recorded themselves changing a master trestle model, then edited the recording to read the dimensions from an input form.

On the third week of use, the independent check found two variants with the foot-plate holes in the wrong place: on the 1,050 mm belt width, the holes were drawn on the inner flange of the foot instead of the outer one. The macro had placed them correctly on every narrower width.

The recording had selected the face for the hole pattern by its position in the model's internal list of faces, the order in which the CAD system happened to number them when the macro was recorded. On wider trestles, a stiffener added by the master model's own rules changed that internal order, and the macro picked a different face. It did exactly what it had been told, which was not what had been meant.

The detection came from the independent check, which is why that check stays in every option in Chapter 1. The correction had two parts. The macro was rewritten to select faces and features by name, using names given to them in the master model. And the master model was rebuilt with named references for every face, edge and plane the automation would use, which is the subject of Chapter 4. A recorded macro is a useful sketch of what a tool must do, but it is rarely the tool itself.

## How this applies to a small Australian business

Small offices are often tempted straight to the top of the ladder, because configurators look impressive. The cheaper path is usually to climb one rung at a time, measuring each. Good templates and a well-built master model pay back for every later level. If you engage an outside developer, keep the rules, the code and the test set in your own systems, and make sure someone in the office understands the rules library even if they did not write the interface. Australian CAD resellers often offer automation services. Ask them the same questions about architecture, ownership and testing that you would ask an in-house developer. And ask what happens to the tool when the CAD vendor releases a new version each year: who retests it, how long that takes and who pays. The answer belongs in the business case from Chapter 1, because it decides the real upkeep cost.

## Exercise: three tasks, three levels

For each task below, say which level of automation you would start with and why, using the two questions from this chapter (events, and frequency of change).

1. Exporting every released drawing to PDF and a neutral 3D format each night, with no user involved.
2. Setting the material, finish and supplier properties on every new part from a pick-list, inside the CAD window, as the designer creates it.
3. A family of 30 hydraulic cylinder clevis brackets, differing only in four dimensions, drawn about twice a month.

**Worked answer.** (1) A **stand-alone program**, run by a scheduler overnight. It needs no events or panels, runs unattended and is easy to update without closing anyone's CAD session. (2) An **add-in**, because the pick-list must appear inside the CAD window and respond as the designer works, which needs integration and usually events. Keep the pick-list values in a separate file so they can change without rebuilding the add-in. (3) A **driven master model** with a 30-row table. At about two a month, a macro or configurator would take years to pay back, while a well-built master model with named dimensions is quick to make and easy to check.
