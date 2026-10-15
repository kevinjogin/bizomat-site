---
title: "CNC programming and CAM: from CAD model to proven program without crashes or scrap"
description: "How CNC programs work, the coordinate systems and offsets behind them, the CAM workflow from model to post-processor, safe prove-out and the controls that keep programs, tools and drawings in step."
publishDate: 2026-10-16
category: "Manufacturing"
tags:
  - manufacturing
  - automation
  - quality
author: "KEVOS"
featured: false
draft: false
---

A modern machining centre can hold tolerances of a few hundredths of a millimetre for hours without attention. It will also, without hesitation, drive a cutter into a vice at full rapid speed if the program, the offsets or the tool data tell it to. The quality of CNC machining depends less on the machine than on the information that drives it: the program, the coordinate systems, the tool data and the way programs are verified and controlled.

For many small manufacturers, programming has grown informally. One experienced person writes most programs, some by hand at the control, some in CAM software. Programs live on the machine or a USB stick. Each new job's prove-out takes an hour of careful single-block running. Occasionally a program is edited at the machine and the change never makes it back to the master copy. It works until it does not: a crash, a scrapped batch from an old program revision or a key person on leave.

This article explains, in general terms, how CNC programs are structured, the coordinate systems and offsets that position the tool, the CAM workflow from model to machine-specific code, how to prove out a program safely and how to manage programs, tools and set-up information so that results are repeatable. It is general information. Program syntax and machine behaviour vary between controls, so always follow the machine and control manufacturer's documentation.

## What a CNC program is

Most CNC machine tools are programmed in a language commonly called **G-code**, standardised in its basic form internationally but implemented in different **dialects** by different control manufacturers. A program is a sequence of **blocks** (lines), each containing words such as:

- **G codes**, preparatory commands that set modes and motions, such as rapid positioning, linear and circular interpolation, plane selection, units, absolute or incremental positioning and canned cycles;
- **M codes**, miscellaneous functions such as spindle start and stop, coolant and tool changes;
- **Coordinates** (X, Y, Z and rotary axes) for positions;
- **F** for feed rate, **S** for spindle speed and **T** for tool selection; and
- **Offset numbers** that call stored tool length, radius and work coordinate data.

Many G and M codes are **modal**: once set, they remain in force until changed. That is efficient but dangerous, because a mode left active from a previous operation can affect the next. Good programs begin each operation with a **safe start** block that resets key modes.

The short program below is an illustrative, Fanuc-style example only. Dialects differ, and it should not be run on any machine.

```
O1001 (BRACKET OP10 - ILLUSTRATIVE ONLY)
G21 G17 G40 G49 G80 G90   (metric, XY plane, cancel compensation and cycles, absolute)
T1 M06                    (tool 1: spot drill)
G00 G54 X20.0 Y15.0       (work offset, rapid to first hole)
S2500 M03                 (spindle on clockwise)
G43 H01 Z50.0 M08         (tool length offset, coolant on)
G81 G98 X20.0 Y15.0 Z-2.5 R2.0 F200   (spot drill cycle)
X60.0                     (second hole, same cycle)
G80 G00 Z50.0             (cancel cycle, retract)
M09                       (coolant off)
G28 G91 Z0                (return Z to reference)
M30                       (end of program)
```

## Coordinate systems and offsets

Understanding where the machine thinks the tool is matters more than any single code.

- **Machine coordinates** are fixed by the machine's reference position.
- **Work coordinate systems**, selected with codes such as G54 to G59, define the part's zero relative to the machine. Setting a work offset tells the machine where the part datum is on the table.
- **Tool length offsets** record how far each tool's tip extends, so the machine can position the tip correctly in Z regardless of tool length.
- **Cutter radius compensation** allows the program to describe the part profile while the control offsets the tool path by the tool's radius, using a stored radius or wear value.

Most crashes and many scrapped parts trace back to these values: the wrong work offset selected, a tool length offset belonging to a different tool, a probe error, a tool loaded in the wrong pocket or a wear offset entered with the wrong sign. Workpiece probes and tool setters reduce manual errors by measuring and recording offsets automatically, but they still depend on correct procedures.

## Lathe programming differences

Turning centres share the same basic language but introduce some important differences:

- **Constant surface speed.** Lathes commonly use a mode in which the spindle speed changes automatically as the diameter changes, keeping the cutting speed constant. Because spindle speed rises as the tool approaches the centre, programs also set a **maximum spindle speed**, which protects chucks, workholding and the operator. Omitting or mis-setting this limit is a well-known hazard.
- **Diameter programming.** Many lathe controls program the X axis as a diameter rather than a radius, which matters when reading or editing code.
- **Tool nose radius compensation.** A turning insert has a small nose radius, and without compensation, tapers and arcs are cut slightly out of shape. Controls provide compensation based on the insert radius and orientation.
- **Chuck and bar limits.** Clamping force falls at high speed as jaws are flung outwards, so maximum speeds depend on the chuck and workholding as well as the part.

Multi-tasking machines that combine turning and milling, and multi-axis milling machines, add further complexity in coordinate systems and collision risk, which makes accurate machine simulation even more valuable.

## Ways to create programs

There are three broad ways to produce a program:

- **Manual programming**, written by hand at a computer or the control. It suits simple parts and drilling patterns, and every machinist benefits from understanding it, but it becomes slow and error-prone for complex geometry.
- **Conversational programming**, using menus and prompts at the control to build operations. It is fast for simple prismatic and turned parts on machines that support it.
- **CAM programming**, where software generates toolpaths from a 3D CAD model. It is essential for complex geometry, 3D surfaces, multi-axis work and efficient modern roughing strategies.

## The CAM workflow

A disciplined CAM workflow typically follows these steps:

1. **Import and check the model.** Confirm the CAD model is the current revision, is a clean solid and matches the drawing. For tight tolerances, consider whether the model should be adjusted to the middle of the tolerance band, because CAM machines to the model's nominal geometry.
2. **Define stock, datums and set-ups.** Set the stock size, the work coordinate system for each set-up and the fixture or vice geometry so that collisions can be checked.
3. **Select tools from a library.** A controlled tool library with accurate geometry, holders and proven cutting data makes programs more consistent and simulation more trustworthy.
4. **Create operations.** Facing, roughing, rest machining, finishing, drilling, tapping and chamfering, in a sensible order that maintains rigidity.
5. **Simulate.** Check for gouges, collisions with holders and fixtures, excess material and unrealistic cycle times.
6. **Post-process.** A **post-processor** converts the CAM software's internal toolpaths into G-code for a specific machine and control. The post must match the machine's configuration and dialect, and errors in the post can produce dangerous code.
7. **Verify the code.** Ideally, simulate the posted G-code against a model of the actual machine, not only the CAM toolpaths.
8. **Document the set-up.** Produce a set-up sheet showing the stock, fixture, datum, work offset, tools, pockets, stick-out and any special instructions.
9. **Release under control.** Transfer the program to the machine through a controlled method and record which revision was released.

The roughing and finishing strategies chosen in CAM, such as constant-engagement roughing and sensible stepovers, have a large effect on cycle time and tool life. The [designing parts that are economical to machine](/insights/designing-parts-that-are-economical-to-machine/) article explains how those choices feed into part cost.

## Proving out a program safely

**Prove-out** is the process of running a new or changed program for the first time and confirming that it produces a good part. A safe prove-out typically includes:

- confirming the set-up against the set-up sheet: fixture, datum, work offset, tools, pockets and stick-out;
- running the first moves with **reduced rapid and feed overrides**, using **single block** mode where appropriate and watching the distance-to-go display;
- running above the part, or with an offset raised, for the first pass of a new program where risk is high;
- watching each tool's first approach and each tool change;
- measuring the **first article** fully before continuing; and
- recording any changes made at the machine so they are fed back to the master program.

Prove-out takes time, but it is far cheaper than a crash. Good CAM practice, verified posts, simulation and accurate set-up sheets shorten it substantially.

## Managing programs, tools and set-ups

Repeatability depends on information control as much as on machining skill. Practical controls include:

- **A single master location** for programs, backed up, with machines receiving programs from it rather than holding the only copy.
- **Naming and revision rules** that link each program to the part number, operation and drawing revision.
- **A rule for edits at the machine**: changes are recorded, reviewed and returned to the master, or the master is updated and re-released.
- **Set-up sheets** stored with the program and updated when the set-up changes.
- **A controlled tool library** in CAM, matching the physical tools, holders and stick-outs used on the shop floor.
- **Standard fixtures and datums** for repeat parts, so set-ups are reproducible.
- **Retention of prove-out records** and first-article results.

These controls mirror the wider discipline of controlled documents. The [controlled document management systems](/insights/controlled-document-management-systems/) article explains the principles of release, revision and access that apply equally to CNC programs.

## Designing parts for CAM

Designers can make programming faster and more reliable:

- **Provide clean, current models** that match the drawing exactly.
- **Use clear datums** that the workshop can also use for set-up and inspection.
- **Avoid tiny features and unnecessary detail**, such as cosmetic fillets on non-functional edges, which add toolpaths and time.
- **Choose standard radii and hole sizes** that match standard tools.
- **Flag critical features** so programmers know where to focus finishing passes and inspection.

## A worked example

This is an illustrative example. The business, figures and events are hypothetical.

A small job shop runs three machining centres and makes about 40 new part numbers a month, many in small batches. Programs are written by two programmers, partly by hand and partly in CAM. Prove-out of a new program typically takes about 90 minutes of machine time, and the shop has had two minor crashes in a year, each costing about a week of repairs and lost production.

An investigation finds that most prove-out time is spent checking offsets and tool lengths by hand, that the CAM tool library does not match the tools in the machines, and that set-up information is passed verbally. Both crashes involved a tool loaded in the wrong pocket.

The shop makes several changes. It builds a CAM tool library that matches its physical tools and holders, adds tool setters and workpiece probes, introduces a standard set-up sheet generated from CAM, creates a single server location for programs with revision naming, and adopts a prove-out checklist. Over the following six months, average prove-out time falls to about 35 minutes. At 40 new programs a month, that recovers about 37 hours of machine time a month (40 × 55 minutes = 2,200 minutes). There are no further crashes caused by tool pocket errors, because the set-up sheet and tool setter confirm each tool before the program runs.

## How this applies to a small Australian business

- **Treat programs as controlled documents.** One master copy, clear revisions and a rule for machine edits.
- **Match CAM to reality.** The tool library, holders and fixture models should reflect what is actually in the machine.
- **Verify posts and simulate.** Especially for new machines, new posts and multi-axis work.
- **Use set-up sheets.** They make set-ups repeatable and reduce dependence on memory.
- **Invest in probing.** Tool setters and probes reduce offset errors and speed up set-ups.
- **Build a prove-out routine.** Reduced overrides, single block where needed and full first-article inspection.
- **Spread the knowledge.** Avoid having only one person who can program or prove out jobs.

## Common mistakes

- **Wrong work offset or tool length offset**, the most common cause of crashes.
- **Untested or modified post-processors** producing unexpected code.
- **Edits at the machine that never reach the master**, so old errors return on the next batch.
- **CAM tool libraries that do not match the shop floor**, making simulation misleading.
- **No set-up sheet**, leaving set-ups to memory.
- **Skipping first-article inspection** to save time.
- **Modal codes left active** from a previous operation.

## Frequently asked questions

**Do we still need people who understand G-code if we use CAM?** Yes. Machinists and programmers need to read code to prove out programs, diagnose problems and make safe edits.

**Is simulation enough to prevent crashes?** It greatly reduces risk, but only if the models of tools, holders, fixtures and the machine are accurate and the posted code is simulated. Offsets and set-ups must still be correct on the day.

**How should we handle small edits at the machine?** Allow them where necessary, but record them, review them and update the master program, so the next run uses the corrected version.

## Questions to ask

- Where do our master programs live, and could we recover them if a machine failed?
- How are program revisions linked to drawing revisions?
- Does our CAM tool library match the tools and holders in our machines?
- Are our post-processors verified for each machine?
- Do operators receive a set-up sheet for every job?
- How long does prove-out take, and what consumes the time?
- What caused our last crash or scrapped batch, and has the cause been removed?

## Bringing it together

CNC machining is only as reliable as the information behind it. Programs, coordinate systems, offsets, tool data, post-processors and set-up information all have to be correct and consistent. A disciplined CAM workflow, verified posts, simulation against realistic models, a safe prove-out routine and controlled management of programs and set-ups reduce crashes and scrap, shorten prove-out and make results independent of any one person's memory.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. Program syntax varies between controls; always follow the machine and control manufacturer's documentation.*
