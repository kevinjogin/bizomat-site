---
name: sldmacro
description: Turns a checked part (STEP or build123d) into one VBA macro that rebuilds it in SOLIDWORKS as native, editable, fully defined features in YZ's modelling style, and checks the macro four ways. Use when YZ asks for a SOLIDWORKS macro, SOLIDWORKS features, or to rebuild a part in SOLIDWORKS.
---
# sldmacro: a part as a native SOLIDWORKS feature macro

Everything this method needs is in this skill folder; no other skill or repo is needed. It is a heavy toolchain (build123d 0.13 in its own environment, a sketch solver, LibreOffice, Java): set it up only when YZ asks for the macro. Run it on parts that have already been through `dfm-checklist-loop` (and `asmcheck` for assemblies), so the macro rebuilds a checked design.

YZ is an industrial designer on SOLIDWORKS 2022 Standard. He wants parts that exist only as STEP, or that were
designed in code, rebuilt in SOLIDWORKS as real features he can edit. The deliverable is one VBA macro (`.bas`).
He opens Tools > Macro > New, replaces the editor's text with it and presses F5. Each part is built in a new part
document from his default template and left open, unsaved. A log goes to his TEMP folder.

SOLIDWORKS cannot be run here. The whole method exists to make the macro right the first time anyway, and to make
it say so itself when it is not. You write a short **recipe** per part (the feature list, as data). The engine in
this skill does the rest: it replays the recipe in OpenCascade and compares it with the source solid, plans every
sketch's relations and dimensions, writes the macro, and checks the macro four ways.

**Do not write VBA by hand and do not edit the engine.** If the engine cannot make something, say so in the report.

`SKILL` below means the base directory of this skill (shown when it loads). Treat it as read-only: work
somewhere else (`~/work/<job>`).

## YZ's modelling rules (his words)

- "center it to be fully defined by the center planes for the first extrude ... and then the following are based
  on the relative feature"
- "use equal, offset, distance between holes, or distance from top edge or any critical dimension in related to
  each other"
- "dont rename the features. just like the default 'extrudeboss01 etc is fine"
- "make draft after standard features like extrude etc. then chamfer after all drafts are done (if there are any).
  finally the radii. separate the radii into multiple features so easier to control. if any signs or symbols. they
  are the last. make all sketches fully defined."

So, per part:

1. Extrudes and cuts first. The first sketch is centred on the origin (a part with an axis: the origin on the
   axis). Every sketch is on the Front plane, which is a main flat face of the part; a feature higher or lower
   starts at an offset from it.
2. Draft features (neutral plane), one per feature drafted.
3. Chamfers.
4. Radii, split into several Fillet features by what they belong to (corners of the outline, the root of a boss,
   the edges of a pocket: one feature each), so each can be changed on its own.
5. Signs and symbols last.
6. Default feature names. The feature table in the macro's header and the log say what each feature is.
7. Every sketch fully defined by relations and dimensions a designer would put on: from the wall next to it, from
   the axis it belongs to, between holes, an angle to a straight edge, its own sizes. Never a dimension of 0, never
   a dimension from an unrelated edge.

The one exception: a chamfer that follows a rounded edge comes after that radius (say so in the part's notes).

## Start of every session

```bash
bash SKILL/scripts/setup_env.sh        # about 2 min the first time; prints OK or MISSING per piece
source ~/.sldmacro/env.sh              # gives the `sldmacro` command; repeat in every new shell
```

Each separate shell command starts a new shell, so load it in the same command: `source ~/.sldmacro/env.sh && sldmacro verify`.

If anything is MISSING, try to fix it (the script says what it needs). If a check still cannot run, carry on with
the rest and say plainly in the report which check did not run: never present an unchecked macro as checked.

Then prove the tools on the worked example, once (about 1 min):

```bash
cp -r SKILL/examples/bracket ~/work/example && cd ~/work/example && sldmacro emit && sldmacro verify
```

It must end with `VERIFY: ALL PASS`. Read `recipes/bracket.py` there: it is the pattern to follow, and its header
says how it was written.

## The job

Inputs are the STEP files of the checked parts (for example the project's `model/` folder, or the build123d script) and the request in the brief. Typical inputs: one or more `.step` files; sometimes build123d code; a note about which parts, which
face is the front, anything to leave out.

```bash
sldmacro new ~/work/<job> --name <Name> --title "<Title>"    # Name: letters, digits, _ and -; it names the .bas and its log
cp <path of the STEP files>/*.step ~/work/<job>/src/
cd ~/work/<job>
```

For more than one part: do ONE part completely first (through `verify`), then the rest. Put every part in the same
job (`PARTS` in `job.py`, in a sensible build order) so that one macro builds them all, each in its own document.
The stand-in test has room for 24 parts of up to 80 features each per macro; split a bigger job into two macros.

## Method, per part

1. **Look at the solid.**
   `sldmacro look src/part.step` says what is in the file and which direction the features run. Then
   `sldmacro look src/part.step --z a,b,c --x d,e,f --origin x,y,z` until the listing reads in the frame the part
   should be modelled in: features along Z, a main flat face on Z = 0 (the Front plane), the origin at the centre
   of the base outline or on the part's axis, X along the part's long side or its main direction. `--origin` is
   read from the listing made with `--z` and `--x`. The listing has a block "for the recipe's frame" that prints
   those values exactly: copy every digit. A direction rounded to 3 decimals turns round walls into ellipses and
   no outline can be read; a rounded origin leaves slivers of a few thousandths everywhere. Add `--edges` for
   the sharp and rounded edges and `--png look.png` for a picture (open it with the read tool). The same three
   values go into the recipe's `oriented(step(...), z=..., x=..., origin=...)`.
   The listing gives the levels (flat faces by height), the round walls (holes and bosses by axis and radius), the
   sloped faces (drafts, countersinks, chamfers), the rounded faces (radii), and the exact outline at any height
   (`--at z1,z2`), each loop with the outline it looks like (`rrect(...)`, `circle(...)`, `obround(...)`).
   For build123d code instead of STEP: run the code, export the solid to `src/<part>.step`, and read the code for
   the designer's own numbers and names (they make better notes and dimensions than measured values).

2. **Write the recipe**, `recipes/<key>.py`: see `SKILL/reference/recipes.md` for every outline, feature and
   selector. Write the extrudes and cuts only, first. Use the named outlines (`rrect`, `circle`, `obround`,
   `tongue`, `strip`, `dee`, `sector`) wherever the shape is one: the planner gives those a designer's dimensions;
   a `free` outline gets a correct but plainer plan. Use round numbers where the source clearly means them
   (59.9998 is 60). Every feature must leave ONE body: order the extrudes so nothing floats.
   Add the key to `PARTS` in `job.py`.

3. **Check against the source**: `sldmacro check <key>`. With extrudes only, the volume "only in the features" and
   "only in the source" should be down to the drafts, chamfers and radii. Then add those (drafts, then chamfers,
   then radii in several features), checking after each. Aim for 0.000 / 0.000. What cannot be made equal is
   either a real limit of the engine or a choice: write each one as a note in the recipe (`notes=[...]`), it goes
   into the macro's header. `sldmacro where <key>` shows where the two differ: each piece of material that is only
   in one of them, with its volume and box (`--upto N` compares after the first N features, to find the feature
   that is off). The line "sharp inside corners" counts them in the features and in the source: more in the
   features than in the source means the source rounds some that the recipe does not yet.

4. **Read the sketch plans**: `sldmacro plan <key>`, as a designer would. Every sketch must end with
   `degrees of freedom left: 0`. Fix what reads badly: a dimension from an unrelated edge (give the feature
   `refs=("the feature it belongs to",)`), an angle of 87 deg where 3 deg is meant, an outline that would be
   simpler as two features. `SKILL/reference/recipes.md` says how the planner chooses.

5. **Generate**: `sldmacro emit` writes `out/<Name>.bas` and `out/expected.json`. It works out every way
   SOLIDWORKS could misread each boss or cut and refuses to write a macro in which a wrong reading would pass.

6. **Check the macro**: `sldmacro verify`. All four, every time, after the last change to any recipe:
   - sketch solver (SolveSpace reads the macro text): every sketch 0 degrees of freedom, and it comes back when
     pushed 0.2 mm off;
   - stand-in for SOLIDWORKS (the macro runs in LibreOffice Basic against mock SOLIDWORKS objects, about 50
     scenarios of how SOLIDWORKS might behave), then what the macro drew is rebuilt and must equal the recipe;
   - VBA grammar (ANTLR): the file parses;
   - the file itself: CR LF, ASCII, sizes, no name that hides another.
   It must end `VERIFY: ALL PASS`. A failure is information: read it (`sldmacro standin "<scenario name>"` prints
   one scenario in full; `out/standin.log` has the last run). Fix the recipe, not the checks. If a failure looks
   like a fault of the engine or of the stand-in rather than of your recipe, do not work around it silently:
   report it, with the scenario and the output, as an engine problem.

`SKILL/reference/traps.md` lists what goes wrong and what to do. Read it before the first part and again when
something fails. `SKILL/reference/engine.md` says how the macro checks itself in SOLIDWORKS: read it when a
SOLIDWORKS log comes back.

`sldmacro` is a shell function that `env.sh` defines, so a command run in the background has to load it itself:

```bash
nohup bash -c 'source ~/.sldmacro/env.sh; cd ~/work/<job>; sldmacro verify > /tmp/verify.txt 2>&1' >/dev/null 2>&1 &
```

## What the engine can and cannot make

Can: prismatic parts whose features all run along one direction. Bosses and cuts between two heights with outlines
of lines and arcs; a wall angle of its own on a boss or cut (countersinks, lead-in cones: a 45 deg tapered cut);
neutral-plane drafts; chamfers (size x 45 deg); constant radii; shallow signs and symbols; traced outlines (a cam
profile) fixed rather than dimensioned.

Cannot: holes or bosses across the main direction, revolves, sweeps, lofts, shells, ribs as rib features, threads,
patterns and mirrors as features (repeat the outline instead), splines, chamfers that are not 45 deg, variable
radii, more than one body, sheet metal, surfaces. `sldmacro look` says which faces do not fit.

When part of a part cannot be made: build everything that can be, leave that feature out, and say exactly what is
missing and what YZ should add by hand (kind of feature, where, what size) in the part's notes and in the report.
Do not approximate a feature the engine cannot make with one it can without saying so. If most of a part does not
fit (a turned part with cross holes, a swept handle), say so early and do not force it.

## Deliverables

Write to `macro_out/` in the project folder (flat, no subfolders):

| File | What |
|---|---|
| `<Name>.bas` | the macro (copy `out/<Name>.bas` byte for byte: CR LF line endings) |
| `REPORT.md` | see below |
| `verify.json`, `expected.json`, `standin.log` | the evidence, from `out/` |
| `job.zip` | the job folder (`job.py`, `recipes/`, `src/`, `out/`) without `_cache` and `_work`, so the work can be picked up again |
| `look_<key>.png` | one picture per part, from `sldmacro look ... --png` |

`REPORT.md`, in plain language, no emojis, short sentences, most important first:

1. **What the macro builds and how to run it**: paste into a new macro, F5; the `ONLY` constant builds one part;
   the `MAKE_...` switches; where the log goes (`%TEMP%\<Name>_log.txt`).
2. **Per part, a table**: key, title, features, sketches, volume from the features against the source, volume only
   in the features / only in the source, how it was compared (boolean, slices or sample points).
3. **Differences from the source, on purpose**: every note, per part. And **left out**: what YZ must add by hand.
4. **What was checked**: the four results from `verify.json` with their numbers, and what was not checked.
   Say plainly: "This macro has not been run in SOLIDWORKS."
5. **Unconfirmed in SOLIDWORKS**: copy the list from `SKILL/reference/traps.md` ("Unconfirmed API calls").
6. **What to send back**: the log file if anything is flagged, or if all is well, so the engine can learn which
   flag readings SOLIDWORKS really needed.
7. **Cost of this run** if you can tell (time, number of parts), and anything you were unsure about, as questions.

End your last message with the same summary in a few lines: the files written, PASS or FAIL per check, what was
left out. If the request is unclear in a way that changes the result (which face is the front, which of several
solids), choose the most reasonable reading, say which you chose at the top of the report, and carry on: do not wait for an answer.

## Records

If the project has a `CLAUDE.md`, update it with the macro's state (files written, verify result, what was left out) before committing, as YZ's rule requires. Nothing leaves the machine without YZ's go-ahead.

Provenance: engine copied from `yuanzhengyang98/cad-review-loop` `skills/sldmacro` @ e6ea59adb688b1757d28bebcbdb83508aa294427, via dfm-engineer-tiered (2026-10-13). No macro from this engine has been confirmed in SOLIDWORKS yet: when YZ runs one, ask for the log it writes.
