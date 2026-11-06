---
title: "Starting small with AutoLISP automation"
description: "Turn a repeated drafting task into a small AutoLISP routine with explicit inputs, predictable selections and checks for cancellation, units and drawing state."
publishDate: 2026-10-05
category: "Technology"
tags:
  - automation
  - design
  - systems
  - validation
author: "BIZOMAT"
featured: false
draft: false
---

A repeated drafting task is a useful candidate for automation when its decisions can be stated clearly. The difficulty is that a manual procedure often relies on context the drafter never writes down: the current units, the selected objects, the active layer or the meaning of a cancelled prompt. A program needs those assumptions made explicit.

George Omura's *Mastering AutoCAD 2011 and AutoCAD LT 2011* introduces AutoLISP through calculations, variables, points, selection and simple program flow. For a small business using computer-aided design, or **CAD**, the practical starting point is a narrow routine whose result can be checked independently. Automating a well-understood task is easier to maintain than trying to capture an entire drafting session at once.

## Choose a task with a clear result

**AutoLISP** is a programming language used to calculate values and interact with supported AutoCAD functions and drawing objects. It can combine user input, conditional decisions and repeated operations. That makes it useful when a fixed sequence of recorded actions is not sufficient.

Begin by describing the desired result without naming commands. A routine might place a defined set of markers from a few dimensions, inspect selected objects for a property, or produce a short report. The description should make it possible to decide whether the routine succeeded.

Keep design judgement outside the first version. A program can calculate positions from an agreed rule, but it should not silently decide whether the rule is appropriate for the product. Make any unresolved design input visible to the person running it.

Compare programming with simpler options. A block, template or palette tool may already handle the repeated need. [Standardising repeated CAD work with tool palettes](/reados/collections/cad-drafting-and-drawing-standards/standardising-repeated-cad-work-with-tool-palettes/) explains those alternatives. AutoLISP becomes useful when the task needs calculations, validation or decisions that those methods do not express clearly.

## Check product and platform support first

The book's statement that AutoLISP is unavailable in AutoCAD LT describes its historical context. It should not be carried into a current article without qualification. Autodesk introduced AutoLISP support in AutoCAD LT for Windows with the 2024 release, subject to product limitations.

Use Autodesk's [AutoLISP introduction for AutoCAD LT 2024](https://help.autodesk.com/cloudhelp/2024/ENU/AutoCAD-LT-WhatsNew/files/GUID-5FB57480-C9BE-4E3D-BEDF-D86035928FFA.htm) and the documentation for the actual installation to establish support. Do not infer that every function, object type or development tool available in another product or platform is also available in yours.

Record the supported product, release and operating system beside the routine. If a team uses several configurations, identify which have been tested. This is more useful than describing a routine as compatible with AutoCAD in general.

Keep the first routine within the capabilities you can verify. Avoid adding dependencies on external applications or specialist objects unless the task requires them. Each additional dependency introduces another condition that can differ between computers.

## Understand expressions before building a routine

An **expression** is a unit of code that is evaluated to produce a result or perform an action. In AutoLISP, an expression commonly places the function first, followed by its arguments within parentheses. For example, `(+ 12 8)` represents addition and evaluates to 20.

A **function** performs a defined operation. An **argument** supplies information to that function. Thinking in these terms helps separate what the program is being asked to do from the values it is being asked to use.

A **variable** stores a value under a name so it can be used later. Use names that explain the value's purpose, such as panel width or edge margin, rather than names that reveal only the order in which prompts were answered.

Practise small expressions independently before combining them. A calculation that works on known values is easier to diagnose than a large routine that simultaneously asks for input, selects objects and modifies a drawing. The first useful milestone can be a correct reported result with no drawing changes at all.

## Keep data types and units explicit

A **data type** describes the kind of value being handled. Whole numbers, decimal numbers, text and lists behave differently. A text label containing digits is not automatically a number suitable for arithmetic.

AutoLISP's division behaviour illustrates why this matters. An expression using integer operands can produce an integer result, while a real-number operand allows a decimal result. A calculation that needs a fractional distance should not depend accidentally on integer arithmetic.

For example, `(/ 5 2)` gives an integer result of 2, while `(/ 5.0 2)` gives 2.5. The difference is not display formatting. It changes the value available to subsequent calculations and can therefore change the geometry created by a routine.

```figure
type: compare
title: The same division, two data types
cols: Result | Consequence
caption: The difference is a value, not formatting, and it flows into later geometry.
- (/ 5 2) | 2 | Integer division truncates
- *(/ 5.0 2) | 2.5 | A real number keeps the fraction
```

Units require the same care. A variable containing 100 does not explain whether it represents millimetres, metres or an identifier. State the unit convention in prompts and documentation, and convert deliberately where the task requires conversion.

## Treat points as coordinates in a known system

A **point** contains coordinate values describing a position. The book introduces storing points as lists and extracting individual components for later calculations. This allows a routine to derive additional locations from a small number of inputs.

The coordinate system is part of that meaning. A point entered relative to a rotated working coordinate system should not be mixed casually with a point interpreted in global coordinates. Establish which system the routine accepts and uses for its calculations.

Also decide how the routine handles elevation. A nominally two-dimensional task can receive points at different heights if the drawing contains three-dimensional information. Either support that condition deliberately or detect it and ask for suitable input before creating geometry.

Test a simple translated example as well as one at the origin. A routine that works only because the starting point is zero may contain an unnoticed assumption. A rotated working plane provides another useful test where the intended workflow supports it.

## Validate inputs before changing the drawing

**Input validation** checks whether supplied values satisfy the routine's requirements. A width may need to be positive, a count may need to be a whole number, and a margin may need to leave a usable space between two sides.

Write those conditions before implementing the drawing operations. Explain rejected input clearly enough that the user can correct it. A message identifying the inconsistent dimensions is more useful than a generic failure after some geometry has already been created.

Treat cancellation as a normal outcome. Pressing Escape or declining a selection should not be interpreted as a zero value or a request to use an unrelated default. Decide what the routine leaves behind when the user stops at each prompt.

Where practical, gather and validate all required information first. Then calculate the intended result and create the geometry. This ordering reduces the number of partial drawing states that the routine must handle.

## Make selection scope a visible decision

A **selection set** is a collection of drawing objects chosen for an operation. AutoLISP can work with selections supplied by a user or identified through criteria. The challenge is to ensure that the set represents the intended population.

Define whether the task applies to explicitly selected objects, a layer, a region or a broader drawing scope. A routine intended for a few chosen labels should not silently operate on every matching label in the file. Model space, layouts and nested content may require separate consideration.

Check object types and required properties before processing the set. A selected line and an attributed block do not offer the same information. Decide whether unsuitable objects are rejected, skipped with a report or handled through a separate path.

Report enough about the selection to support review. A count of eligible objects and a clear summary of skipped items can reveal an unintended scope before changes are accepted. Successful program completion does not establish that the correct objects were selected.

## Use conditions and repetition to express the rule

A **condition** lets a program choose behaviour based on a test. A routine might proceed only when a selection contains eligible objects, or use one calculation when a specified option is selected. Keep these choices tied to the written task definition.

A **loop** repeats an operation over a count or collection. Before writing one, identify what changes on each repetition and what ends the process. A marker routine might advance through calculated positions while preserving the same symbol definition and layer.

Separate calculation from drawing changes where possible. A list of intended points can be inspected or reported before objects are created. This makes arithmetic easier to test and provides a useful explanation of what the routine is about to do.

Avoid adding many optional behaviours to the first version. Each option multiplies the combinations that need checking. A small routine with a clear contract is easier to improve than a broad routine whose exceptions are understood only by its author.

## Leave the drawing in a predictable state

A routine may temporarily change a layer, object-snap setting or another part of the drawing environment. Record the settings it changes and define the state that should remain after success, cancellation or failure. Leaving an unexpected setting active can affect the next manual operation.

Use local variables for temporary working values where appropriate, so separate routines do not accidentally share or overwrite them. Choose a distinctive command name that does not replace a familiar command unintentionally. Both decisions make the routine easier to use alongside other customisations.

Plan recovery from a partial operation. A coherent undo arrangement or clearly identified output can help the user reverse a trial. The implementation needs to be tested in AutoCAD; merely describing recovery in a comment does not establish that it works.

Keep the first routine away from automatic saving, deleting unrelated content or processing many files without review. Those actions expand its consequences and make errors harder to isolate. Add them only when the underlying task and failure behaviour are understood well enough to justify the larger scope.

## Work through a small geometry routine

This is an illustration. A small Australian product business wants a drafting aid that places four circular reference markers inside a rectangular panel outline. The user supplies the lower-left point, width, height, equal edge margin and marker diameter. The routine implements a layout rule; it does not decide whether that rule suits a physical component.

For a test at the origin, use a width of 240 mm, height of 160 mm, margin of 20 mm and diameter of 6 mm. The four marker centres should be at (20, 20), (220, 20), (220, 140) and (20, 140) mm. The corresponding radius is 3 mm.

The horizontal centre separation is 240 minus twice 20, which equals 200 mm. The vertical centre separation is 160 minus twice 20, which equals 120 mm. These independently calculated values become acceptance checks for the routine's output.

| Input case | Intended handling | Evidence to check |
| --- | --- | --- |
| Valid dimensions | Create four markers at calculated centres | Count, diameter and centre coordinates |
| Zero or negative width | Reject before creating objects | Clear message and no partial output |
| Margin of 90 mm with 160 mm height | Reject the crossing centre arrangement | Twice the margin exceeds the height |
| Cancelled point prompt | Stop cleanly | No unintended geometry or setting changes |
| Different insertion point | Translate the same arrangement | Relative separations remain 200 and 120 mm |

```figure
type: svg
title: Four markers from four inputs
alt: A 240 by 160 millimetre rectangle with four 6 millimetre markers placed 20 millimetres in from each edge, at 20,20; 220,20; 220,140; and 20,140. The centres are 200 millimetres apart horizontally and 120 vertically.
caption: Width 240, height 160, margin 20, diameter 6; the expected separations become acceptance checks.
viewbox: 0 0 560 300
body:
<rect class="bx" x="40" y="30" width="480" height="240" rx="2"/>
<circle class="fa pulse" cx="80" cy="240" r="6"/>
<circle class="fa" cx="480" cy="240" r="6"/>
<circle class="fa" cx="480" cy="60" r="6"/>
<circle class="fa" cx="80" cy="60" r="6"/>
<path class="lf dsh" d="M80 150H480M280 60V240"/>
<text class="tx txs" x="280" y="144" text-anchor="middle">200</text>
<text class="tx txs" x="288" y="200">120</text>
<text class="tx txs" x="92" y="262">20, 20</text>
<text class="tx txs" x="430" y="262">220, 20</text>
<text class="tx txs" x="424" y="52">220, 140</text>
<text class="tx txs" x="92" y="52">20, 140</text>
<text class="tx txs" x="280" y="292" text-anchor="middle">240 × 160 mm</text>
```

The margin rule in this example checks the centre arrangement. It is not a substitute for checking edge clearance using the marker radius, nor does it establish a suitable fastener spacing. If physical hole placement becomes the real task, the routine's requirements must be expanded accordingly.

The first trial reports the calculated points without drawing. After those results are checked, the drawing step is added and tested in a disposable file. The reviewer measures the output independently rather than using the routine's own printed values as the only evidence.

The team then tests cancellation, unsuitable values and a nonzero insertion point. If the intended workflow supports rotated working axes, that case is tested too. The routine is ready for a limited trial only when both its normal result and its unsuccessful paths behave as described.

## Store and maintain the routine as a small asset

Save source code in an identifiable file with a short description of its purpose, supported environment and inputs. Keep a simple change record and retain a known working version. A drawing that benefited from a routine should not be the only evidence that the routine exists.

Use controlled locations for code loading. Autodesk's [SECURELOAD documentation](https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-LT/files/GUID-541566C6-2738-49DD-87C3-C1490E924A02.htm) explains trusted-location controls. Resolve loading arrangements through the supported configuration rather than disabling controls to make an unfamiliar file run.

For a small team, nominate someone to maintain the routine and its test cases. Repeat relevant checks after changing calculations, prompts or supported software versions. Useful automation remains explainable when its original author is unavailable.

## Questions to ask

- Can the task's inputs, outputs and limits be stated plainly?
- Does the installed product support the functions and objects required?
- Are data types, units, coordinates and selection scope explicit?
- What happens on invalid input, cancellation or partial failure?
- Can the result be checked independently and the previous working version recovered?

## Bringing it together

Start AutoLISP work with a narrow, testable drafting rule. Separate inputs, calculations and drawing changes, then check unsuccessful paths as carefully as the normal result. A small routine earns trust through predictable behaviour and clear maintenance, not through the amount of work it attempts at once.

---

*Source: George Omura, Mastering AutoCAD 2011 and AutoCAD LT 2011 (2010), Chapters 26–27; Autodesk documentation linked above. The example is hypothetical and is not a tested production program or a component specification. Verify routines in the intended software environment before routine use.*
