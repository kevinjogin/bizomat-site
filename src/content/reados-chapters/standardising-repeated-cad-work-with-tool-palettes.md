---
title: "Standardising repeated CAD work with tool palettes"
description: "Use tool palettes and small recorded actions to make repeated CAD work consistent, with clear defaults, dependable source files and practical checks."
publishDate: 2026-10-05
category: "Technology"
tags:
  - design
  - automation
  - systems
  - process-improvement
author: "KEVOS®"
featured: false
draft: false
---

Repeated drafting involves more than drawing the same shape again. Each insertion may require the correct layer, units, scale, description and source file. When these choices are made from memory, a team can produce drawings that look similar while behaving differently when edited or printed.

Donnie Gladfelter's *AutoCAD 2011 and AutoCAD LT 2011: No Experience Required* introduces tool palettes for reusable drawing content and the Action Recorder for repeated sequences. These features suggest a practical way to improve computer-aided design, or **CAD**, work: package a small task with clear assumptions, then test the resulting objects rather than judging success by the number of clicks saved.

## Choose the right kind of reuse

A **tool palette** is a collection of named tools that create or insert drawing content with specified behaviour and properties. The book demonstrates palettes for blocks, hatch patterns and drawing commands. A palette therefore offers more than a visual catalogue: each tool can carry decisions that would otherwise be repeated manually.

A **block** stores reusable drawing content which can be inserted as instances. A block tool makes that content convenient to access, but the tool and block definition have different jobs. The definition describes the content; the tool helps determine how it is introduced into a target drawing.

An **action macro** is a recorded sequence of commands and inputs that can be played back. It is useful when the repeated work is a sequence, such as creating named layers and making one current. A macro requires attention to the conditions in which the sequence runs.

| Repeated need | Possible method | Main review question |
| --- | --- | --- |
| Place a familiar symbol | Block tool on a palette | Is the source definition appropriate and current? |
| Apply a recurring hatch | Hatch tool on a palette | Are pattern, scale and layer suitable here? |
| Draw an object with agreed properties | Object or command tool | Does the result carry the intended properties? |
| Repeat a short setup sequence | Recorded action, where supported | Does the starting drawing satisfy the assumptions? |

```figure
type: decision
title: Which kind of reuse fits?
question: What is being repeated?
caption: Build each tool from a checked source object and test it in the target drawing.
- Placing a symbol | A block tool
- Applying a hatch | A hatch tool
- Drawing with set properties | An object or command tool
- *A short setup sequence | A recorded action, where supported
```

Start with the simplest method that handles the task. A palette tool may remove several repeated choices without needing a longer recorded sequence. Adding automation is worthwhile only when its behaviour remains understandable to the person using it.

## Define the result before creating the tool

Write one sentence describing the intended output. For example, a boundary tool might create lines on a named reference layer using layer-controlled properties. That statement gives you something concrete to test and helps reveal decisions that the tool should leave to the drafter.

Separate fixed choices from variable ones. The layer may be fixed, while the endpoints must be selected for the current task. A marker's source block may be fixed, while its identifier and rotation vary. Hiding variable decisions inside a preset makes a tool convenient only for the narrow example from which it was created.

Describe the limits as well. A hatch tool can apply a particular visual treatment; it cannot determine whether the enclosed object is actually made from the material suggested by that pattern. A symbol tool can insert geometry without establishing that the represented component is suitable for the design.

Treat the description as part of the tool. Someone encountering it months later should understand its purpose without opening the original demonstration drawing. If the description requires a long explanation of exceptions, the tool may need a narrower purpose or a different name.

## Create tools from checked source objects

The book creates a hatch tool by dragging an existing hatch onto a palette. The tool retains relevant properties from that example, which is convenient when the example is correct. It can also preserve an accidental angle, unsuitable scale or unintended layer.

Prepare a small source drawing containing only deliberate examples. Inspect the object's properties before using it to create a tool. Confirm its layer, colour behaviour and any pattern settings, then create the tool and review the resulting tool properties independently.

Test the tool in another drawing. Using it only in the source drawing can hide missing dependencies or assumptions already satisfied there. A new target drawing exposes whether the tool actually supplies what its description promises.

For blocks, check the insertion point and the geometry's intended unit interpretation. A well-designed palette cannot compensate for an inconsistent source block. [Building reusable CAD blocks that stay consistent](/reados/collections/cad-drafting-and-drawing-standards/building-reusable-cad-blocks-that-stay-consistent/) explains those underlying decisions in more detail.

## Make property behaviour visible

**Layer-controlled properties** allow objects to obtain properties such as colour or lineweight from their assigned layer. They support consistent changes when used deliberately. Direct object overrides instead store a particular property on the object, which may be appropriate but should not happen accidentally.

A tool can introduce content whose appearance depends on both its own settings and the target drawing. A layer with a familiar name may already exist with different properties. Consequently, the same named tool should be tested in drawings that contain relevant layers as well as drawings that do not.

Inspect the created object rather than relying on its screen colour. Check its assigned layer and whether properties are controlled by the layer or explicitly set. Then inspect how that combination behaves in the intended output arrangement, especially when lineweights or hatch density matter.

Decide what the tool is responsible for when an existing drawing differs from the preferred setup. It may insert the object while preserving the project's existing layer definition, or require a separate standards review first. Write down the chosen behaviour instead of treating any visible result as success.

## Test units and scale in the target drawing

A block's **insertion units** describe how its size should relate to the target drawing's units. A palette insertion can apply unit conversion, and unitless settings introduce further assumptions. A symbol that looks reasonable after zooming may still have an incorrect measured size.

Autodesk's [guidance on creating and using tools](https://help.autodesk.com/cloudhelp/2022/ENU/AutoCAD-LT/files/GUID-6D1EE849-DF42-472D-BE3F-53B1F8B19C86.htm) describes scaling according to source and target units. This makes measurement an essential part of the tool test. Check a known length after insertion, including any additional scale settings used by the tool.

Distinguish physical content from annotation. A component outline may need to retain a particular real-world size, while a drawing marker may need a particular appearance on the printed sheet. One scaling rule should not be assumed to serve both purposes.

If your projects use different unit conventions, test those conventions explicitly. Otherwise, state the supported convention and make it visible in the tool description. [Setting up CAD drawings with consistent units](/reados/collections/cad-drafting-and-drawing-standards/setting-up-cad-drawings-with-consistent-units/) provides the wider setup context for this check.

## Keep source locations dependable

A block tool can refer back to content in a source drawing. The book explains that moving or deleting that source can break the tool. The palette icon is therefore not sufficient evidence that the content needed for insertion is still available.

Choose a source location that the intended users can access through the same supported arrangement. Avoid building shared tools around an individual's temporary exercise folder. Record which drawing and which block definition supply each tool so a missing source can be diagnosed directly.

Test from another user's environment where sharing is intended. A tool that works on its creator's computer may depend on a private folder, a different drive mapping or locally installed support content. Check the real access path before treating the palette as ready for the team.

Also distinguish a palette source from an external reference attached to a drawing. Updating the source library does not automatically update previously inserted block definitions in every project. Autodesk's tool guidance explicitly distinguishes source changes from deliberate redefinition in the target drawing. Existing work needs a considered update decision.

## Organise palettes around recognisable tasks

Use palette names that reflect how people look for content. A small set for reference geometry, common markers and presentation hatches may be easier to use than one large collection containing every object ever reused. The arrangement should help someone choose the right tool without inspecting many near-duplicates.

Name each tool by its purpose. A generic name such as Line says little about why it belongs on a shared palette. A name indicating a reference boundary or a particular annotation role explains the decision being packaged and distinguishes it from the ordinary drawing command.

Descriptions should state intended use, key assumptions and any input still required. Include a unit or scale convention where it materially changes the result. Avoid putting maintenance history into an unreadable tool name; keep a separate brief record of source revisions and checks.

Keep experimental tools separate from tools ready for routine use. When an experiment becomes useful, test and describe it before adding it to the shared set. Remove redundant choices from the normal selection process through a controlled library review, rather than letting every trial become a permanent option.

## Keep recorded actions small and inspectable

The book's Action Recorder example creates named layers and makes one current. Its value comes from a bounded sequence with an observable result. A long macro that mixes setup, geometry creation, editing and output is harder to diagnose when one step encounters an unexpected condition.

Define **preconditions**, the circumstances that must be true before the sequence runs. These might include the expected drawing units, an idle command prompt and a known selection state. Define **postconditions**, the results that should be true afterwards, such as named layers being present and the intended current layer being selected.

Record a small sequence, inspect it and replay it in a disposable test drawing. Where an input should vary, make that variation explicit through the supported recording controls or leave the decision outside the macro. Do not assume that a value entered during recording will become an intelligent choice during playback.

Feature availability must be checked separately from the book's title. Autodesk's [Options documentation](https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-LT/files/GUID-F95EE827-7567-44EA-9D69-E9D0D37EE13F.htm) identifies Action Recorder settings as unavailable in AutoCAD LT. A palette or a short written procedure may be the appropriate option where recording is unsupported.

## Test repetition and interruption deliberately

A routine that works once in an empty drawing may behave differently on its second run. Layers may already exist, a block definition may already be present, or a command may leave a different current setting. Include repeated use in the test instead of assuming repetition is harmless.

Check whether the routine should preserve existing information or replace it. Creating a missing layer is a different operation from changing an existing layer's properties. Make that distinction part of the procedure, particularly for received drawings where the existing setup may be intentional.

Test cancellation at a point where the user is asked for input. Inspect what remains in the drawing and which settings remain active. If stopping the sequence leaves partial content, the user needs a clear way to recognise and resolve that state before continuing.

Use saved copies for these trials. Record the expected result and the actual result in a short test note. The aim is not to accumulate elaborate documentation, but to make failures reproducible enough that a corrected tool can be checked against the same conditions.

## Work through a small drafting kit

This is an illustration. A small Australian product team wants a consistent kit for early layout drawings. It chooses three palette tools: a reference boundary line, a numbered location marker and a hatch used to distinguish a proposed working area. A separate recorded action, available on its chosen AutoCAD installation, prepares two named layers.

The boundary tool should create layer-controlled lines on REF-BOUNDARY. The marker tool should insert a checked block from a shared library and allow an identifier to be entered. The hatch tool should use an agreed pattern, angle and scale while leaving boundary selection to the drafter.

The team prepares three test drawings. The first is an empty drawing using millimetres. The second already contains the relevant layer names and an older marker definition. The third uses metres. These cases test missing content, existing content and unit conversion without requiring a large test project.

The marker contains a reference feature measuring 100 mm in its source. In the millimetre drawing, that feature should measure 100 drawing units. In the metre drawing, it should measure 0.1 drawing units. Measuring those results is more useful than deciding that both markers look about the same size on screen.

```figure
type: compare
title: One 100 mm feature in two target drawings
cols: Expected measure | Why
caption: Measuring the inserted reference proves the tool scaled correctly.
- *Millimetre drawing | 100 units | One unit is one millimetre
- Metre drawing | 0.1 units | One unit is one metre
```

The older marker in the second drawing exposes a separate question. The team cannot assume that changing the library updates the project's existing definition. It reviews whether the project should adopt the new definition, tests the chosen redefinition procedure on a copy, and checks the already placed markers afterwards.

For the recorded action, the team confirms that both named layers exist after playback and that the intended one is current. It then runs the action again. If the second run fails or changes existing properties unexpectedly, the action needs revision or a narrower documented starting condition.

Finally, the team changes the source library location in a test copy and confirms how the missing-source problem appears. It restores the intended arrangement and retests from another user's computer. The resulting kit is accepted because its output and dependencies have been checked, not because its icons are neatly arranged.

## Maintain the kit without disrupting projects

Give someone responsibility for the shared source content and descriptions. In a very small business this can be a modest part of one person's work. The important point is that a reported problem has a clear owner and a reproducible example.

When a tool changes, repeat the tests affected by that change. A new hatch scale needs an output check. A relocated block library needs an access check. A changed source block needs a review of insertion and any proposed redefinition in existing drawings.

Keep a brief record of what changed and which drawings were used for validation. Preserve enough information to identify the previous working arrangement if a new issue appears. Historical projects should not be silently treated as though they used today's library content.

Review whether each tool is still useful. A small, dependable collection is easier to teach and maintain than a broad catalogue of uncertain presets. Add tools when a repeated task has become clear enough to specify, and keep judgement with the drafter where the context still varies.

## Questions to ask

- What result does this tool or action promise to create?
- Which properties are fixed, and which choices must remain with the user?
- Are source files accessible and units handled as intended?
- What happens with existing content, repeated use or cancellation?
- Who checks and communicates changes to the shared kit?

## Bringing it together

Tool palettes and recorded actions make repeated drafting more consistent when they package understood decisions. Define the intended result, check the source content and test realistic target drawings. A useful drafting kit remains small enough to explain and dependable enough to reuse.

---

*Source: Donnie Gladfelter, AutoCAD 2011 and AutoCAD LT 2011: No Experience Required (2010), principally Chapters 6 and 11; Autodesk documentation linked above. The example is hypothetical. Software features vary by product, platform and release; test tools and recorded actions in working copies before routine use.*
