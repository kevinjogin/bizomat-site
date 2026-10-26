---
book: cad-automation-by-the-numbers
chapterSlug: build-it-to-fail-safely
order: 6
title: "Build it to fail safely"
description: "Structure a CAD automation tool so rules can be tested without CAD, generate in all-or-nothing transactions, check results rather than trust them, and survive crashes in batch runs."
draft: false
---

Every CAD automation tool will fail sometimes. The CAD system will crash, a file will be checked out by someone else, a rebuild will produce an error nobody anticipated, a network drive will disappear in the middle of a run. A tool cannot prevent all of that. What it can control is what it leaves behind. A tool that fails cleanly, leaving the vault exactly as it found it with a clear message about what went wrong, is a minor inconvenience. A tool that fails halfway, leaving half-built files checked out and a drawing that refers to a model that was never finished, costs a morning to untangle and erodes trust in every later result.

This chapter describes how the trestle configurator was built to fail safely. It is not a programming tutorial, and it does not depend on any particular CAD system or language. It covers the structure that makes the rules testable without CAD, the all-or-nothing transaction for each generation, self-checks on the result, safe event handling in the add-in and the logging that makes failures diagnosable. The failure case is an overnight batch run that ran out of memory after 73 trestles.

## Separate the parts that change for different reasons

Chapter 2 chose a hybrid architecture. The point of separating it into parts is not tidiness. Each part changes for a different reason and is tested in a different way.

```figure
type: layers
title: The trestle configurator's internal structure
caption: This is an illustration. Only the generator talks to the CAD system. The rules library can be tested in seconds on any computer, without a CAD licence.
- Panel and batch program | gather inputs, show results and messages; no rules and no CAD calls of their own
- Rules library | reads the rule table, validates inputs, decides sections, bracing and the cut list; pure calculation
- *Generator | the only part that calls the CAD system: builds models, drawings and cut-list files from the rules library's decisions
- Vault access | check-out, check-in and searches, through the vault's own interface
- Log | one structured line per step, written by every part
```

The most valuable separation is between the **rules library** and the **generator**. The rules library takes inputs and returns decisions: which cross-member, whether to brace, every piece in the cut list with its length. It does not touch the CAD system. That means its several hundred tests run in a few seconds on any computer, which is what made the boundary tests of Chapter 3 practical. It also means the panel can show a cut-list preview instantly, as the mock-up session in Chapter 5 asked, without building anything.

The generator takes the rules library's decisions and turns them into files. It contains no engineering decisions of its own. If a test of a generated trestle fails, the cause is either in the generator's handling of the CAD system or in the master model, not in the rules, because the rules have their own tests.

## Validate at the edge

Inputs reach the tool from people, from the order system and from the batch program's list. Each is checked once, at the point of entry, against the rule table's validated ranges and allowed values. Nothing downstream re-checks them, and nothing downstream trusts an unchecked value.

The order system deserves particular suspicion. A belt width entered as "1200 mm" in one order and "1.2 m" in another, or a height entered in the wrong field, should be refused with a clear message, not interpreted. The specification in Chapter 5 defined the formats the tool accepts. The validation code enforces them, and every refusal is logged so that recurring bad inputs can be fixed at their source.

## All or nothing

A trestle generation creates several files: the frame, perhaps a cross-member and a brace, the assembly and the drawing set, and then a cut-list file and a log line. If the process stops after creating three of them, the vault holds a partial trestle that may look complete to the next person who finds it.

The generator therefore treats each generation as a transaction, a sequence that either completes entirely or leaves no trace.

```figure
type: steps
title: One generation as an all-or-nothing transaction
caption: This is an illustration. Nothing enters the vault until every file has been built and checked; a failure at any earlier step deletes the temporary workspace and logs the cause.
- Reserve | check the vault: names free or reusable, master files available, nothing needed is checked out by others
- Build in a workspace | create every file in a temporary local folder, never in the vault
- Self-check | rebuild errors, mass, bounding box and references compared with the rules library's expectations
- *Commit | check all files into the vault together, then write the cut list and the log line
- Clean up | delete the workspace; on any failure before Commit, delete it and log why
```

Building in a temporary workspace and committing only at the end means that every failure before the commit step leaves the vault untouched. The commit itself can still fail, if the vault becomes unavailable halfway through checking files in, so the generator keeps a small recovery journal: a note, written before the commit starts, of the files it is about to check in. On its next start, the tool reads the journal. If a commit was interrupted, it removes the partially committed files or completes the commit, and logs which.

## Check the result, not just the absence of errors

A rebuild that produces no error messages is not necessarily correct. A sketch can solve to an unintended shape, a hole pattern can land on the wrong face, a component can be the wrong size and still rebuild cleanly. The generator therefore checks what it built against what the rules library predicted.

This is an illustration. The rules library calculates the expected mass of each trestle from its cut list and the section masses per metre, and the expected bounding box from the belt width, height and foot style. After building, the generator reads the model's mass and bounding box and compares:

- mass within **1%** of the expected value;
- bounding box within **0.5 mm** of the expected dimensions;
- no rebuild errors or warnings in any file;
- every component referenced from its own generated file or the standard-part library, never from the master folder, which is the check added after Chapter 4's shared cross-member.

If any check fails, the transaction aborts before the commit. In the first month of use, the self-checks stopped two generations that had rebuilt without error: a foot-plate hole pattern that had flipped to the inner face after a master-model edit, and a brace mated to the wrong leg plane. Both were caught before any drawing reached the independent check.

## Handle events without risking the CAD session

The add-in listens for one event: a user saving a generated trestle file. If the file carries the generator's properties and its geometry no longer matches its recorded inputs, the add-in warns that a generated variant has been edited by hand and should be regenerated or recorded as a one-off.

Code that runs inside the CAD process during an event has a special responsibility. An unhandled error inside an event handler can destabilise or close the CAD session, taking the user's unsaved work with it. The add-in's event handlers are therefore short: they read a few properties, compare them, show a message if needed and return. Any error inside them is caught, logged and ignored, so that the worst outcome of a fault in the add-in is a missing warning, not a crashed session. Anything that takes longer than a moment is handed to the generator to do outside the event.

## Messages people can act on

A failure that is handled safely still needs a message, and the message decides whether the user can fix the problem or has to call for help. "Error 0x80004005" helps nobody. "Generation stopped: the master frame file is checked out by J. Smith since 9:14 am. Nothing was changed. Ask them to check it in, then try again." lets the designer solve it in a minute.

The trestle configurator's messages follow a pattern agreed in the specification. Each says what happened, whether anything was changed (almost always "nothing was changed", thanks to the transaction), and what the user can do next. Refusals name the rule and its range. Unexpected failures give a short reference that matches a log line, so that whoever supports the tool can find the detail without asking the user to remember it.

The messages were tested along with everything else. During acceptance, the developer triggered each failure deliberately, and a designer who had not seen the code read each message and said what they would do. Three messages were rewritten because the designer's answer was "I don't know".

## Log so that failures can be diagnosed

When a user reports that "it didn't work", the log is the first and often the only evidence. Each part of the tool writes structured lines: the time, the user, the order, the step, the outcome and the time the step took. Errors include the CAD system's own error codes and messages.

The log answers three kinds of question. For support, it shows what happened in a particular failed run. For maintenance, timing data across hundreds of runs shows which steps are slow and whether a CAD upgrade has made them slower. And for traceability, the generation lines record which rule-table revision and generator version produced each variant, which Chapter 3's failure case depended on.

## A failure case: 73 trestles and then nothing

This is an illustration. After a change to rule R1 for a new idler supplier, the office ran the batch program overnight to regenerate all 120 stocked variants. In the morning, the log showed 73 variants regenerated and then nothing. The CAD system had closed during the 74th. Two designers could not check out the master frame, because the batch program's account still held it, and the vault showed a partly committed 74th trestle.

The log's timing and memory lines told the story. The CAD process's memory use had started at about **1.2 GB** and grown by about **45 MB** with each variant, because each generated assembly and drawing was left loaded after it was saved. At about **4.5 GB**, after **73** variants, the process failed.

```figure
type: line
title: Memory used by the CAD process during the failed batch run
x: Variants generated
y: Memory, GB
ymin: 0
ymax: 5
mark: 73 | Failure
caption: This is an illustration reconstructed from the batch log. Growth of about 45 MB per variant from documents left open; the fix closes each document after commit and restarts the CAD process every 25 variants.
- 0 | 1.2
- 10 | 1.65
- 20 | 2.1
- 30 | 2.55
- 40 | 3.0
- 50 | 3.45
- 60 | 3.9
- 70 | 4.35
- 73 | 4.48
```

Three things had gone wrong. The generator did not close the documents it had finished with, so memory grew steadily. The batch program did not watch the CAD process's health. And the 74th generation's commit had been interrupted, but the recovery journal described above did not yet exist, so nothing cleaned it up.

The corrections followed directly:

1. The generator closes every document it opens once the commit is complete, and the regression tests now check that the number of open documents returns to zero after each generation.
2. The batch program restarts the CAD process every **25** variants, regardless of memory, so that growth from any source stays bounded. With 120 variants, that is five restarts and a few minutes of extra run time.
3. The recovery journal was added, and the batch program runs its recovery step at start-up.
4. The batch program releases every check-out it holds at the end of a run, even a failed one, and the log records any it could not release.

The next overnight run regenerated all 120 variants. Memory peaked at about **2.3 GB**, the level after 25 variants, before each restart.

## Working practices that help

The structure above does most of the work, but a few practices make it hold up over years:

- **Version control** for the code, the rule table, the master models' source files and the tests, so that any released version of the tool can be rebuilt exactly.
- **Review** of every change by a second person, even briefly. In a small office this may be the rule owner reading the change description and the test results rather than the code.
- **No engineering values in the code.** Section sizes, clearances and limits come from the rule table. A number typed into the generator is a rule hiding from its owner.
- **Small, named steps** in the generator, each logged, so that a failure points to a step rather than to "the generator".

## How this applies to a small Australian business

Small offices rarely have a full-time developer, so the tool will often be maintained by a designer who learned programming along the way. The structure in this chapter helps them most. Rules they can test without CAD, a generator that is the only part touching the CAD system, and a log that says what happened let a part-time maintainer find and fix problems in hours rather than days. If an outside developer builds the tool, ask to see a deliberate failure during acceptance: pull the network cable or close the CAD system mid-generation and check that the vault is unchanged afterwards.

## Exercise: sizing the restart interval

A larger customer order requires regenerating 300 variants overnight. Each variant takes about 41 s, memory grows by about 45 MB per variant from sources the team has not yet eliminated, the process starts at 1.2 GB and the team wants peak memory below 3.0 GB. Restarting the CAD process takes about 90 s. What restart interval keeps memory below the limit, and how long will the run take in total?

**Worked answer.** The allowed growth is **3.0 − 1.2 = 1.8 GB**, which is **1,800 ÷ 45 = 40** variants. Restarting every 40 variants would reach exactly the limit, so choose a smaller interval, say every **35** variants, with a peak of about **1.2 + 35 × 0.045 ≈ 2.8 GB**. The run needs **⌈300 ÷ 35⌉ − 1 = 8** restarts. Total time is about **300 × 41 + 8 × 90 = 12,300 + 720 = 13,020 s**, about **3.6 hours**, comfortably inside an overnight window.
