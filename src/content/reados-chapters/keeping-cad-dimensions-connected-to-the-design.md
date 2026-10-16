---
title: "Keeping CAD dimensions connected to the design"
description: "Choose dimensions that communicate the intended geometry, preserve their links to the model and check styles, overrides and revisions before issuing a drawing."
publishDate: 2026-10-04
category: "Technology"
tags:
  - design
  - validation
  - manufacturing
author: "KEVOS®"
featured: false
draft: false
---

A dimension can look authoritative even when it refers to the wrong points or displays a number typed over the measurement. That makes dimensioning a communication task as well as a software task. The drawing must show which relationship matters and keep that explanation consistent with the geometry.

David Byrnes's *AutoCAD 2011 For Dummies* explains dimension objects, styles and associativity, with particular caution about replacing measured values with fixed text. These principles provide a useful basis for dependable drawing review. The goal is to make dimensional information clear, maintainable and traceable to the design requirements.

## Decide which relationship needs a dimension

A **dimension** communicates a length, distance, angle or related geometric quantity using a structured annotation. It identifies both a value and the features to which that value applies. A number without a clear reference does not fully describe a requirement.

Start from the drawing's purpose. Identify which sizes and locations the recipient needs to understand, then choose dimensions that express those relationships. Do not simply dimension every visible edge because the software makes it easy.

Excessive dimensions can introduce conflicts or obscure the important information. Too few can force the reader to calculate, measure or guess what the design intended. The appropriate dimension scheme should follow the relevant project and discipline requirements.

Software proficiency does not establish a complete manufacturing specification. Decisions about datums, tolerances and inspection requirements need the appropriate design knowledge. Use the CAD tools to communicate those decisions accurately rather than allowing convenient commands to determine them.

## Understand the parts of a dimension

A dimension object combines several elements. **Extension lines** identify the measured references, a **dimension line** indicates the measured span or angle, and the text displays the value and any authorised additional information. Arrowheads or other terminators help identify the limits.

Inspect these parts together. A correct numeric value can still be ambiguous if an extension line appears to originate from the wrong feature. Moving text to improve readability should not make its relationship to the measurement unclear.

Use a coherent dimension object rather than constructing an ordinary dimension from unrelated lines and text. Keeping the elements together supports consistent editing and, when properly associated, updates connected to the geometry.

The object structure is not a guarantee of correctness. A dimension can be a single well-formed object and still measure the wrong endpoints. Check its references and meaning as well as its appearance.

## Choose the right measurement type

A **linear dimension** can report a distance in a specified direction, such as horizontal or vertical. An **aligned dimension** reports the distance along the line between the selected reference points. These values differ when the points are not aligned with the chosen horizontal or vertical direction.

A **radius dimension** describes the distance from a circle's centre to its circumference, while a **diameter dimension** describes the full distance across it through the centre. An **angular dimension** communicates an angle between relevant directions or features.

Select the type that expresses the actual requirement. A sloping edge's length is not the same as its horizontal projection. A hole diameter should not be left to the reader to infer from an unlabelled radius value if the drawing requires a diameter callout.

Check the symbol and references after placement. Familiar-looking graphics can encourage a quick acceptance, particularly when many dimensions are being added. Pause at changes of dimension type and confirm that the value means what the design requires.

## Use associativity as a maintained relationship

**Dimension associativity** is the connection between a dimension and the geometry it measures. An associative dimension can update its location and measured value when the associated geometry changes. A non-associative dimension lacks that automatic connection.

Autodesk distinguishes associative, partially associative and non-associative dimensions in its [dimension associativity guide](https://help.autodesk.com/cloudhelp/2016/ENU/AutoCAD-Core/files/GUID-8B7E8C96-C30D-409E-881E-7942871E80DA.htm). A partially associated dimension can retain one reference while losing another, for example after relevant geometry is deleted.

Create dimensions using precise feature references and inspect association when revising the drawing. Replacing a line with another line in the same position is not necessarily equivalent to modifying the original object. The new geometry may look identical while the earlier relationship has been lost.

Treat automatic updates as assistance that still requires checking. A dimension associated with the wrong feature can update consistently and remain wrong. The essential question is whether it follows the intended design relationship.

## Keep dimension styles understandable

A **dimension style** is a named collection of settings controlling the presentation of dimensions. It can govern text, arrows, lines, unit formatting and related behaviour. Shared styles help a drawing remain consistent and reduce repeated local adjustments.

Use a reviewed style suitable for the project rather than modifying an unfamiliar one immediately. A style change can affect many existing dimensions. Before making it, identify where the style is used and what the change is intended to improve.

Give styles names that distinguish their purpose. Several almost-identical styles with unexplained suffixes make it difficult to know which one should be used. A small, documented set is easier to maintain than a collection grown through repeated copying.

Test a proposed style with representative dimension types and crowded areas. A setting that looks good on a long linear dimension may work poorly on a small radius callout. Review the final sheet, including text and arrow size, before treating the style as approved.

## Separate dimension appearance from measured value

Dimension graphics need to be readable at the intended output size. Depending on the workflow, that may involve annotative styles, paper-space dimensions or deliberately scaled non-annotative dimensions. Choose a consistent method and test it through the actual view arrangement.

Changing text or arrow size should not be confused with changing the represented design. A large arrow does not indicate a larger feature, and a reduced view should still communicate the actual model measurement through the appropriate dimensioning arrangement.

Check any measurement scaling or unit conversion settings separately from graphic scaling. An unfamiliar style may contain a factor intended for a different workflow. Applying it blindly can produce plausible-looking numbers that do not match the model's unit convention.

For the underlying distinction between model size and sheet presentation, see [Setting up CAD drawings with consistent units](/reados/collections/cad-drafting-and-drawing-standards/setting-up-cad-drawings-with-consistent-units/). Establishing that convention first makes dimension settings easier to interpret.

## Treat numeric overrides as a review signal

A **text override** replaces or supplements the text that a dimension would normally display. Adding an authorised prefix or suffix can be useful. Replacing the measured value with a fixed number can hide a mismatch and prevent the displayed number from following a later change.

If a dimension appears wrong, inspect the geometry, selected references, unit convention and style before changing the text. The unexpected value may be revealing a real drafting problem. Typing the expected number over it removes that evidence without repairing the cause.

Where a particular drawing convention requires an exception, make it deliberate and reviewable. The software permits many forms of annotation; it does not decide which are appropriate for the project. Avoid silent exceptions that another person would reasonably interpret as live measurements.

During review, examine suspiciously neat or inconsistent values and any dimension that fails to change as expected. A fixed override may be visually indistinguishable from an ordinary measurement. Its behaviour and properties provide more useful evidence than its appearance alone.

## Keep precision and tolerance distinct

**Precision of displayed text** concerns the format and rounding of a dimension value. **Tolerance** defines an allowable variation in a requirement. The two may interact through a drawing convention, but they are not interchangeable settings.

Do not infer a tolerance solely from the number of visible decimal places unless the governing specification explicitly defines that relationship. Likewise, displaying many digits does not prove that the design or measurement supports that level of certainty.

Use the required unit and rounding convention consistently. Mixed units or unexpected suppression of zeros can create confusion, especially when a file moves between teams. A reviewer should be able to understand the values without guessing which convention applies to each note.

When tolerance information is required, obtain it from the responsible design process. This article does not prescribe a tolerance scheme. A correctly configured dimension style can display an unsuitable tolerance just as neatly as a suitable one.

## Choose reference arrangements deliberately

Dimensions may be arranged in a chain from one feature to the next or from a common reference. A **chain** describes successive intervals. A **baseline arrangement** relates several positions to the same reference. They communicate different aspects of the geometry.

Choose the arrangement that supports the intended design and interpretation. If feature locations are defined from a common reference, repeatedly dimensioning local gaps may obscure that intent. If the local gap is what matters, a distant overall reference may be insufficient.

Avoid redundant requirements that can disagree when the drawing changes. An overall length and every segment in a chain need careful treatment under the project's dimensioning convention. More numbers do not automatically make the requirement clearer.

Keep reference or informational dimensions distinguishable where the applicable convention requires it. The recipient should not have to decide which of several conflicting values controls the design. Resolve the scheme before issue.

## A worked example of a sloping feature

This is an illustration. A drawing contains a straight feature between points (0, 0) and (80, 60), in millimetres. Its horizontal separation is 80 millimetres and its vertical separation is 60 millimetres. The distance along the sloping feature is 100 millimetres, because the square root of 80 squared plus 60 squared is 100.

A horizontal linear dimension therefore reports 80, while an aligned dimension along the feature reports 100. Neither number is inherently wrong. The correct choice depends on whether the requirement concerns the horizontal position or the actual sloping length.

The designer then changes the endpoint to (100, 75), retaining the same direction. The horizontal separation becomes 100 millimetres, the vertical separation becomes 75 millimetres and the aligned length becomes 125 millimetres. The three values have increased by a factor of 1.25.

| Quantity | Original geometry | Revised geometry |
| --- | ---: | ---: |
| Horizontal separation | 80 mm | 100 mm |
| Vertical separation | 60 mm | 75 mm |
| Aligned length | 100 mm | 125 mm |

An associative aligned dimension connected to the intended endpoints should reflect the revised length when the relationship remains valid. If its text had been replaced with a fixed 100, it could continue to display 100 despite the geometry now measuring 125. The drawing would contain a disagreement that a visual glance might miss.

The reviewer checks the endpoint coordinates, the type of dimension, its association and whether an override exists. The correction addresses the actual cause. Simply typing 125 into the text would repeat the same maintenance problem at the next revision.

## Review dimensions after changing geometry

Make dimensional review part of each relevant revision, not merely the final issue checklist. Check dimensions directly attached to changed geometry and those describing related positions. A moved feature can affect edge distances and clearances beyond the locally edited area.

Inspect the references when geometry is deleted, replaced, split or joined. These operations may alter the objects to which dimensions were connected. Reassociating a dimension requires selecting the correct new references, not just clearing a warning.

Review placement as well as values. Updated text may become longer, arrows may no longer fit and extension lines may cross newly added information. Automatic measurement updates do not guarantee an equally clear sheet layout.

Check tables and notes that repeat dimensional information. A live dimension can be correct while a manually entered schedule remains out of date. Reduce unnecessary duplication and identify who maintains any repeated values that are required.

## Inspect dimensions in the delivered output

Open the exported sheet and read the dimensions at the intended size. Confirm that symbols, decimals, units and tolerance information are visible and unambiguous. A missing font or an overly light line can change the practical meaning of otherwise correct annotation.

Do not assume that a recipient should measure a printed sheet to recover missing requirements. Printing can introduce scaling, and a sheet may be reproduced at another size. Agree on the controlling deliverable and interpretation through the project's established process.

If both editable geometry and a PDF are supplied, ensure they represent the same revision. A correct dimension in one file does not resolve a conflicting value in another. The handover should make status and version clear.

Keep unresolved dimensional questions visible before issue. A drawing should not look complete merely because every space has been filled with a number. Missing design decisions require clarification, not decorative certainty.

For a small team, a useful final check is a deliberate exchange of roles. One person explains the requirement using the drawing, while another identifies the exact features and values they would use. Any difference between their interpretations deserves attention. This checks communication as well as the arithmetic and can reveal ambiguities that a routine software check does not address.

## Questions to ask

- Does each dimension express the relationship the recipient needs?
- Are its references precise and connected to the intended geometry?
- Is the chosen type reporting a projection, aligned length, radius, diameter or angle correctly?
- Are styles, unit conversions and display precision understood?
- Do any fixed text overrides conceal a geometry mismatch?
- Have revised dimensions and the delivered output been checked together?

## Bringing it together

Dependable dimensioning combines clear design intent with maintained links to geometry. Choose the right measurement type, use understandable styles and investigate unexpected values before overriding them.

Then review dimensions whenever the design changes and inspect the actual output. A dimension earns the reader's trust when its value, references and presentation all describe the same current requirement.

---
*Source: David Byrnes, AutoCAD 2011 For Dummies (2010), primarily chapter 14; Autodesk documentation linked above. Figures are original illustrations, not manufacturing requirements. Dimensioning and tolerances must follow the applicable project specification and software behaviour.*
