---
book: cad-automation-by-the-numbers
chapterSlug: test-against-a-reference-set
order: 7
title: "Test against a reference set"
description: "Build layered tests for a CAD automation tool: fast rule tests, generated models against approved reference outputs, fault injection and a full run on every new CAD release before upgrading."
draft: false
---

A CAD automation tool is never finished. The rules change, the master model is improved, the CAD system is upgraded every year and the code is extended for new options. Every one of those changes can break something that used to work. Without tests, the only way to know is to wait for a wrong drawing to reach the workshop. With a good reference set, the office finds out within half an hour of the change, before anything is released.

This chapter builds the trestle configurator's test system in layers, from rule tests that run in seconds to a full regeneration that runs overnight. It defines reference outputs and how to compare against them, sets a time budget so the tests are actually run, and describes the test run on each new CAD release. It includes two failure cases: an upgrade that would have broken every variant, caught before rollout, and a careless approval that let a real fault through.

## Layers of tests

Tests differ in speed, cost and what they can find. The trestle configurator uses four layers, each catching problems the others would miss.

```figure
type: compare
title: The configurator's test layers
cols: What runs | What it catches | When it runs
caption: This is an illustration. The international ISO/IEC/IEEE 29119 series covers software testing in general; this layered set is the office's own practical arrangement.
- Rule tests | the rules library with every boundary and combination | wrong rules, boundaries, refusals | every change, in seconds
- Reference generation | the generator on 24 flex-test combinations, compared with approved outputs | model, drawing and cut-list faults | every change to the generator or master, about 20 minutes
- Fault injection | deliberate failures at each transaction step | partial files, stuck check-outs, poor messages | every release of the tool
- *Full regeneration | all 120 stocked variants in the batch program | rare combinations, memory, performance | weekly, and before every CAD upgrade
```

The layers form a pyramid. There are hundreds of fast rule tests, dozens of reference generations, a handful of fault-injection scenarios and one long full run. Most faults are caught by the cheap tests at the bottom, which is why they can run on every change.

## Reference outputs

A reference generation test needs something to compare against. For each of the 24 flex-test combinations from Chapter 4, the office keeps an approved set of **reference outputs**:

- the expected mass and bounding box, from the rules library and confirmed against hand calculations for four combinations;
- the approved cut-list file, which purchasing tested at acceptance;
- the list of every dimension and note on the drawings, extracted as text with its value, not as an image;
- the list of components and their sources, own files or library parts;
- the rule-table revision and generator version that produced them.

The test generates each combination afresh and compares. Cut lists must match exactly. Masses must agree within 1% and bounding boxes within 0.5 mm. Drawing dimensions must have the same values after normalising formatting, so that "1200" and "1,200.0" are treated as equal but "1,200" and "1,250" are not. Component sources must match exactly.

Comparing drawings as extracted text rather than as images is a deliberate choice. Image comparison flags trivial changes such as a line drawn one pixel differently after an upgrade, and it misses changes that matter, such as a dimension value that changed while its text stayed in the same place. Text comparison of values checks what the workshop actually reads.

## Make the tests fast enough to run

Tests that take too long are skipped, especially by a part-time maintainer under pressure. The office set a time budget for the tests that run on every change.

```figure
type: stack
title: Time for the tests run on every generator change
unit: minutes
caption: This is an illustration. About 22 minutes in total; the full regeneration of 120 variants runs separately, overnight or at the weekend.
- Reference generation, 24 combinations at about 41 s | 16.4
- Drawing and cut-list comparison | 5
- Component-source checks | 0.5
- Rule tests | 0.2
```

At about 22 minutes, the generator tests run on the build machine whenever a change is checked into version control, and the maintainer gets the results before lunch or before going home. Rule-table changes run only the rule tests, which take seconds, plus the reference generations for any rule whose outcome changed.

The 24 combinations are about 3% of the 828 possible variants. They are not a random sample. They are chosen to cover every rule boundary, every option and both ends of every range, which is where faults concentrate. The weekly full regeneration of all 120 stocked variants covers the combinations people actually order, and it catches the occasional fault that only appears in a combination nobody thought of.

## Fault injection

Chapter 6's all-or-nothing transaction only helps if it works. The fault-injection tests prove it by causing failures on purpose: the test harness makes the CAD system appear to crash, the vault appear to go offline or a file appear to be checked out by someone else, at each step of the transaction. After each injected fault, the test checks that the vault is unchanged, that no check-outs remain, that the workspace was cleaned up and that the message shown to the user matches the specification.

There are 12 fault-injection scenarios, two for each transaction step and two for the recovery journal. They take about 15 minutes and run before each release of the tool, not on every change.

## Test every new CAD release before upgrading

CAD vendors release new versions on a regular cycle, and programming interfaces change in small ways between them. The office runs its full test set on each new release, usually on a pre-release version, well before upgrading any designer's workstation.

```figure
type: checklist
title: Upgrade test for a new CAD release
caption: This is an illustration of the office's procedure. The upgrade waits until every line passes or has an approved workaround.
- Install the new release on the build machine only | designers stay on the current release
- Run rule tests, reference generations, fault injection and the full regeneration | compare with the current release's results
- Review every difference with the rule owner | genuine improvement, harmless change or fault
- Fix faults in the tool and rerun until clean | new tool version tagged for the new release
- Upgrade one designer for a week of real work before the rest | log reviewed daily
- x Upgrading every seat first and testing afterwards | the tool fails in front of everyone at once
```

## A failure case caught in time: the box that grew

This is an illustration. On the pre-release of the next CAD version, every one of the 24 reference generations failed its self-check from Chapter 6. The generator refused to commit any of them. The masses were correct, but every bounding box was larger than expected, by amounts that varied from 40 mm to over 300 mm.

The difference came from a change in how the new release calculated a model's bounding box through the programming interface. It now included reference geometry, such as planes and sketches, as well as the solid bodies, so the named reference planes in the master model inflated the box. The vendor's release notes mentioned the change in one line.

The detection came weeks before any designer upgraded, because the office tested the pre-release on the build machine. The fix was small: the generator now asks for the bounding box of the solid bodies only, using an option the interface provided. A new tool version was tagged for the new release, and both versions passed the full test set on their respective releases. Had the office upgraded first, every generation on the first morning would have been refused. That is a safe failure, thanks to the self-check, but a disruptive one.

## A failure case let through: approve all

This is an illustration. A few months later, a change to the master drawing moved the foot-plate detail view. The reference generations reported 24 drawing differences, because every detail view's dimensions now had slightly different positions and one dimension had a different value. The maintainer, expecting position changes, used the test tool's option to accept all new outputs as the new references.

The one changed value was real: the foot-plate hole spacing on the detail view now showed **110 mm** instead of **100 mm**, because the moved view had picked up a different sketch dimension. It passed the tests, because it was now the reference. It reached the independent check, where a checker comparing the drawing with rule R5 caught it on the second trestle that week.

The correction was a process rule, not code. Reference outputs are changed only through a reviewed step: the test tool lists every difference, the maintainer explains each one, and the rule owner approves the new references. Position-only changes can be accepted together, but any change in a value needs individual approval. The test tool was also changed to report value changes separately from position and formatting changes, so they cannot be lost among dozens of trivial differences.

A reference set is only as trustworthy as the process for changing it. Accepting changes without reading them turns a test into a recording of whatever the tool currently does.

## Every fault becomes a test

The most useful tests in the set were not designed in advance. They were written after something went wrong, so that the same fault could never return unnoticed. The office's rule is simple: before a fault is fixed, a test is written that fails because of it. The fix is finished when that test passes.

This is an illustration. By the end of the configurator's first year, the set included a test for each fault described in this book:

- the face picked by its internal number (Chapter 2): a reference generation at the 1,050 mm belt width that checks the foot-plate hole positions;
- the brace boundary typed as 950 mm (Chapter 3): rule tests at 900 and 950 mm;
- the shared cross-member (Chapter 4): a test that two different variants reference only their own files;
- the cut-list format (Chapter 5): an exact comparison with purchasing's approved file;
- the memory growth in the batch run (Chapter 6): a check that no documents remain open after each generation;
- the bounding box that grew with the upgrade: a check that the box comes from solid bodies only.

Each of these tests took less than an hour to write. Each protects against a fault that once cost several hours or more. Over time, the test set becomes a record of everything the office has learned about how the tool can fail, in a form that checks itself.

## What testing cannot tell you

Tests compare the tool's output with what people decided was right. They cannot tell whether those decisions were right. If the rule table says the cross-member deflection limit is 1.0 mm and the real need is 0.5 mm, every test passes and every trestle is wrong in the same way. The engineering validity of the rules comes from the review and calculation described in Chapter 3, and from feedback from the workshop and the field.

Tests also cannot see what nobody thought to compare. The office's reference outputs did not originally include the drawing's material note, so a change that dropped the note from one view went unnoticed until a checker spotted it. The note was added to the extracted list, which now includes every note and table on the drawing, not just dimensions. A useful habit is to ask, after each fault the independent check or the workshop finds, why the tests did not find it first, and to widen the comparison if needed.

## Keep the test set as part of the tool

The test set, its reference outputs and the procedure for changing them are part of the tool, kept in the same version control and released with it. When the tool moves to a new maintainer, the test set is how they learn what the tool is supposed to do and how they find out quickly when their changes break it. The general approach to checking drawings against a standard, and to measuring how effective checking is, is set out in [Measuring the checking process](/reados/publications/checking-drawings-by-the-numbers/measuring-the-checking-process/). Automated tests do not replace that human check. They make sure it is checking good work.

## How this applies to a small Australian business

Testing can seem like an extravagance for a tool used by four people. The numbers say otherwise: about 50 hours to build, a few minutes of attention per change, and protection against faults that each cost several hours to put right in the workshop, or more on site. Small offices also tend to upgrade CAD less carefully, often all seats on one day. Testing the new release on one machine first, with the tool's full test set, turns the annual upgrade from a gamble into a routine. Australian CAD resellers often provide early access to new releases for exactly this purpose. Ask for it. And keep a copy of the previous release's installer and licence arrangements until the new release has run for a month, so that a seat can be rolled back if a problem the tests missed appears in real work.

## Exercise: what the reference set covers

The office adds a fourth foot style, a customer-specific plate, which applies only to that customer's orders and to belt widths of 600 mm and 750 mm. How many reference generations would you add, and which? If each takes about 41 s plus about 12 s for comparisons, how much does the time for the tests on every generator change increase?

**Worked answer.** The new foot style touches rule R5 and the foot-component swap, and it is limited to two belt widths. Add combinations at both belt widths, at both ends of the height range and at the brace boundary: **600 and 750 mm × 400, 900, 950 and 1,500 mm = 8** combinations. Fewer would do if the foot is independent of height, but the brace connection near the foot changes with height, so testing both sides of the 900 mm boundary is prudent. The time increases by about **8 × (41 + 12) = 424 s**, about **7 minutes**, taking the run from about 22 to about 29 minutes. That is still short enough to run on every change.
