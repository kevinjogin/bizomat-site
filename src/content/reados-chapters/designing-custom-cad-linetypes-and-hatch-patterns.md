---
title: "Designing custom CAD linetypes and hatch patterns"
description: "Create a small, understandable library of CAD linetypes and hatch patterns, with clear meanings, controlled definitions and checks at the intended output size."
publishDate: 2026-10-05
category: "Technology"
tags:
  - design
  - systems
  - process-improvement
author: "KEVOS®"
featured: false
draft: false
---

A custom pattern is useful when it communicates a distinction that the existing drawing vocabulary does not express clearly. It becomes a problem when people cannot identify its meaning, reproduce its appearance or find the files it depends on. A line that looks distinctive on one screen may become an ordinary continuous line in the final output.

George Omura's *Mastering AutoCAD 2011 and AutoCAD LT 2011* explains how linetype and hatch definitions are constructed from simple text instructions. For computer-aided design, or **CAD**, the useful objective is a small, maintainable visual vocabulary. Define what each pattern means, understand how its geometry repeats and test the result in the conditions where readers will use it.

## Begin with a communication need

A **linetype** specifies a repeating appearance along a path, such as dashes, gaps, dots or embedded symbols. A **hatch pattern** repeats line families across a bounded area. Both add visual information, but they communicate through different arrangements.

Use a custom linetype when the path itself needs a recognisable role. Use a hatch when a region needs to be distinguished. If the proposed pattern is only decorative, consider whether it adds enough value to justify the extra definition and maintenance work.

Write the meaning before drawing the pattern. An internal concept drawing might need to distinguish a proposed study boundary from an existing reference boundary. That meaning should also appear in a legend or note; readers should not have to infer it from an unfamiliar dash sequence.

Check whether a suitable convention already applies to the project. A custom pattern should not casually replace a required symbol or imply a recognised technical meaning it does not have. In a small business, a simple project convention can be useful without being presented as an industry standard.

## Understand the two-line structure of a simple linetype

A **LIN file** is a text file containing linetype definitions. A simple definition has a heading identifying the name and description, followed by a line specifying the repeating pattern. Keeping these roles separate makes the file easier to inspect.

The pattern descriptors use positive values for drawn dash lengths, negative values for gaps and zero for a dot. The initial alignment code identifies the supported alignment behaviour. The book demonstrates how a short sequence produces a repeated visible pattern along a line.

For example, an original trial definition could be written as follows. It is a syntax illustration for a test drawing, not a recommendation for a particular technical convention.

```text
*TRIAL_DASH,Trial dash pattern
A,8,-4
```

The nominal repeating sequence consists of an 8-unit dash and a 4-unit gap. Its nominal repeat length is therefore 12 units before other scale effects. Actual endpoint treatment can adjust the visible beginning and end, so do not use a linetype as a substitute for locating repeated physical features.

Autodesk's [simple custom linetype reference](https://help.autodesk.com/cloudhelp/2023/ENU/AutoCAD-Customization/files/GUID-EF1DF0A9-2088-487C-8085-16FEE6425405.htm) documents the definition structure. Use the reference for syntax details and product limits, then inspect the loaded result rather than relying only on the text looking plausible.

## Keep pattern dimensions separate from final appearance

The numbers in a definition are inputs to the display and plotting process. Their apparent size can also depend on drawing, object and viewport settings. A pattern definition should therefore be tested in the actual unit and output arrangement where it will be used.

**Linetype scale** changes the size of the repeating pattern. It does not change the physical length of the object carrying the pattern. This distinction allows a line to retain its geometric extent while its dashes become more or less widely spaced.

Check short objects as well as long ones. A long test line can display several recognisable repeats, while a short segment may show only a dash. If the pattern's meaning disappears on the small features common to the project, the design of the pattern needs review.

Also check connected polylines and curved paths. Pattern progression through vertices can affect the visible result. Do not approve a library entry based only on one horizontal line at a convenient zoom level.

## Add text or symbols only when they help reading

A **complex linetype** includes text or shape elements within its repeat. These can make a route or boundary more recognisable, but they introduce additional settings and dependencies. A short label may be useful where a dash pattern alone is ambiguous.

The definition needs to identify the text style or shape resource and specify its scale, rotation and offsets. Those details control where the symbol sits relative to the path. A correct resource name does not guarantee that the resulting label remains readable on a tight curve or short segment.

Test both directions of the path and several orientations. Text that reads acceptably from left to right may behave differently when the object is reversed. Rotation rules should support the drawing's intended reading convention rather than being selected merely because they match one example.

Keep embedded text brief and retain a legend. Long labels can collide with corners and nearby annotations. If the meaning needs a sentence, a separate note or callout may communicate it more reliably than repeating that sentence along a line.

## Treat supporting files as part of the pattern

A text-based linetype may depend on a text style and its font. A shape-based linetype may depend on a separate shape resource. If the recipient lacks those resources, the drawing may not reproduce as intended even when the linetype name is present.

Record dependencies beside the definition. Use controlled file locations and test the pattern in a separate working environment where possible. The goal is to find missing assumptions before the pattern becomes embedded across many project files.

Retain the source definition even after the linetype has been loaded into a drawing. The source is needed for deliberate maintenance and consistent reuse. A definition inside one old drawing should not become the only surviving version of a shared library item.

Avoid editing the supplied application libraries as the only record of your customisation. A separate custom library makes ownership and changes clearer. It also reduces confusion when software installation or library maintenance introduces a different copy of a standard file.

## Build hatch patterns from line families

A **PAT file** stores hatch definitions. Each definition begins with a name and description, followed by one or more lines describing repeating families of parallel lines. Multiple families can combine into a more complex visual pattern.

A descriptor includes an angle, an origin and offsets between members of the family. It can also include a dash-and-gap sequence. The origin and offsets describe the pattern's construction, rather than a physical object that exists independently at every repeated location.

An original trial for parallel diagonal lines could use this simple definition:

```text
*TRIAL_DIAGONAL,Trial diagonal lines
45,0,0,0,4

```

The family is oriented at 45 degrees, with a perpendicular spacing of 4 pattern units. There is no dash sequence in this example, so each member is continuous within the regions where the hatch is displayed. Its final appearance still depends on the applied hatch scale and drawing context.

Autodesk's [hatch-pattern definition guidance](https://help.autodesk.com/cloudhelp/2024/ENU/AutoCAD-Customization/files/GUID-A6F2E6FF-1717-44B6-A476-0CA817ADD77E.htm) explains the descriptor structure and the need for a final blank line in a PAT file. Check the applicable custom-file naming and loading requirements when preparing a separate file for use.

## Understand offsets in the line family's coordinates

Hatch offsets are easy to misread as ordinary horizontal and vertical drawing distances. They are defined relative to the line family's orientation. The perpendicular spacing therefore remains perpendicular to the lines even when the family is angled.

The offset along the line direction matters particularly when the family contains dashes. It can stagger the dash arrangement between neighbouring lines. Combining that shift with perpendicular spacing allows a repeated pattern to form arrangements more complex than simple stripes.

Build a new pattern one family at a time. Test its angle, spacing and any dash sequence before adding another family. If the combined pattern looks wrong, this makes it easier to identify whether the cause is an offset, an origin or the sequence itself.

Keep the definition small enough to explain. A pattern that depends on many nearly identical families can be difficult to maintain. If the visual requirement needs actual repeated components with precise locations, model those components explicitly rather than making a hatch carry that responsibility.

## Check density and boundary behaviour

**Pattern density** describes how closely the visible elements are packed. A dense hatch can obscure edges and annotations, while a sparse hatch may fail to communicate that two regions share the same treatment. The right balance depends on the final reading size.

Test large and small boundaries. A large area may make an otherwise reasonable pattern visually dominant. A small area may contain too little of the repeat to identify it. Include narrow regions and internal openings where those occur in the actual drawings.

Inspect the hatch origin and alignment between related regions. A shifted origin can make identical patterns appear inconsistent across adjacent areas. Decide whether continuous visual alignment is required or whether the regions are intentionally independent.

Check the boundary itself when a hatch fails. A gap, an unintended island or an incorrect selection is a different problem from a bad pattern definition. Troubleshoot the definition and the boundary separately so changes to one do not conceal errors in the other.

## Work through a small pattern library

This is an illustration. A small Australian business wants two internal concept-drawing conventions: a dashed study boundary and a diagonal fill for an area being investigated. The meanings are written in a legend and are not presented as recognised construction symbols.

The team starts with the trial dash definition containing an 8-unit dash and a 4-unit gap. With the relevant scale factors set to one in a controlled test, its nominal repeat is 12 drawing units. A 120-unit line provides room for roughly ten repeats, although endpoint alignment means the visible dash arrangement must still be inspected.

The team then tests a short 15-unit segment and a curved boundary. The long line is clear, but the short segment gives little evidence of the repeating pattern. The team decides to retain a separate label where the study boundary is too short to communicate through linetype alone.

For the hatch trial, the definition's perpendicular spacing is 4 units. At hatch scale 2, the nominal spacing becomes 8 units. The team measures the spacing in the test arrangement and checks the final output rather than assuming that a pleasant on-screen density will remain readable on the sheet.

| Test object | What it reveals | Review decision |
| --- | --- | --- |
| Long straight boundary | Basic dash and gap rhythm | Confirm the intended repeat |
| Short boundary | Whether the pattern remains recognisable | Add a label where necessary |
| Curved boundary | Progression and local crowding | Adjust or reject the pattern if unclear |
| Large hatched region | Visual dominance and density | Review at final output size |
| Narrow hatched region | Whether enough pattern remains visible | Use another treatment if meaning is lost |

The team prepares a sample sheet containing those cases beside ordinary text, dimensions and outlines. It checks a monochrome PDF and a paper output where paper is part of the intended workflow. These comparisons reveal whether the new patterns support the drawing hierarchy or compete with more important information.

The definitions are then loaded into a fresh drawing using the intended library arrangement. This catches a missing source file or an accidental dependency satisfied only by the author's test drawing. The accepted sample sheet is retained as a visual reference for future library changes.

## Diagnose problems in a useful order

If a pattern is unavailable, inspect the file name, definition name, format and loading arrangement first. A syntax or discovery problem will not be resolved by changing the drawing's scale. Use plain text and check for unintended characters introduced by copying from formatted documents.

If the pattern loads but looks continuous, inspect the object length and relevant scale settings. Confirm that the actual custom linetype is assigned and that a different property source is not controlling the appearance. Compare with a long test object under known settings.

If embedded text or shapes are missing, inspect their dependencies before rewriting the whole pattern. If a hatch appears too dense, inspect its scale, units and line spacing. Increasing display limits is not the first answer to a definition that creates far more detail than the drawing needs.

When the screen looks right but output differs, review the page setup and plotting arrangement. [Controlling CAD output with plot style tables](/reados/collections/cad-drafting-and-drawing-standards/controlling-cad-output-with-plot-style-tables/) explains another part of that path. Pattern approval should include the intended output, not end at successful loading.

## Maintain a modest shared vocabulary

Give each accepted definition a clear name, meaning and revision record. Keep experimental patterns separate from the normal library so a trial does not become an accidental standard. Retain enough history to explain which definition was used for an earlier issue.

Reuse accepted definitions through templates or tools only after the underlying pattern has been checked. [Standardising repeated CAD work with tool palettes](/reados/collections/cad-drafting-and-drawing-standards/standardising-repeated-cad-work-with-tool-palettes/) describes how to make recurring choices convenient. Convenience should follow a stable definition and a clear visual meaning.

## Questions to ask

- What distinction does the custom pattern communicate?
- Can its repeating geometry and scale behaviour be explained?
- Does it remain readable on short paths, narrow regions and the final sheet?
- Are fonts, shapes and definition files available to the intended users?
- Can another person reproduce the accepted sample and identify its revision?

## Bringing it together

Custom linetypes and hatches are small pieces of a drawing system. Give them clear meanings, simple definitions and realistic test cases. A compact library that reproduces reliably is more useful than many distinctive patterns whose behaviour or purpose is uncertain.

---

*Source: George Omura, Mastering AutoCAD 2011 and AutoCAD LT 2011 (2010), Chapter 28; Autodesk documentation linked above. Pattern definitions and dimensions are illustrative and have not been executed in AutoCAD. Verify syntax, scale, dependencies and output in the intended installation.*
