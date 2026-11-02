---
book: cad-automation-that-pays
chapterSlug: units-values-and-precision
order: 4
title: "Units, values and precision"
description: "Handle the API's internal units, convert lengths, angles, areas and masses explicitly, compare floating-point values with a tolerance, format numbers for properties, and range-check every input."
draft: false
---

A drafter sees a plate 2 mm thick. The CAD program's programming interface, in most cases, sees a plate 0.002 thick, because it works internally in metres whatever units the document displays. A tool that reads the thickness gets 0.002, and a tool that sets it to 2 makes a plate two metres thick. Units are the single most common source of silent errors in CAD automation, because the code runs without complaint and the model either fails to rebuild or, worse, rebuilds into something absurd that nobody looks at until a supplier asks.

This chapter sets out how to handle units deliberately: know what the API uses, convert explicitly at the boundary between the tool and the person, never compare decimal values for exact equality, format numbers sensibly when they become text, and check every value against a plausible range before writing it. The running case adds a mass property to the release pack and finds a plate that an earlier tool made a thousand times too thick.

## What the API uses

The vendor's help for SOLIDWORKS states that its API works in metric system units: lengths in metres, angles in radians, and areas, volumes and masses in the corresponding SI units, regardless of the units a document is set to display. Other CAD programs have their own conventions, some following the document's units and some fixed. A tool's owner should find the statement in the help for their product and version, and confirm the unit of every value the help documents, mass in particular, rather than assume.

The convention is a good one. Internal values do not change when a user switches a document from millimetres to inches, and the arithmetic inside the CAD program is consistent. It simply means that every value crossing between the tool's user, who thinks in millimetres and degrees, and the API, which thinks in metres and radians, must be converted.

```figure
type: compare
title: Converting between display units and the API's system units
cols: Display unit | API unit | Multiply display value by
caption: For an API working in metres, radians and SI units, as SOLIDWORKS's help describes. Confirm your product's convention before relying on these.
- Length | mm | m | 0.001
- *Angle | degrees | radians | π ÷ 180 = 0.017453
- Area | mm² | m² | 0.000001
- Volume | mm³ | m³ | 0.000000001
- Mass | kg | kg | 1, if the API uses kilograms
```

## Convert at the boundary

The safest pattern is to convert in exactly two places: when a value comes in from the user or a file, and when it goes out to the user or a file. Inside the tool, everything is in the API's units. A dimension the user types as 2 mm becomes 0.002 the moment it is read, and stays 0.002 until it is shown again.

A small set of named conversion functions makes this hard to get wrong:

```
millimetres_to_metres(x)  returns x × 0.001
metres_to_millimetres(x)  returns x × 1000
degrees_to_radians(a)     returns a × π ÷ 180
radians_to_degrees(a)     returns a × 180 ÷ π
```

Calling a named function is clearer than multiplying by 0.001 in line, and a reviewer can see at once which values have been converted. A value with no conversion call between the user and the API is a value to question. The functions also give one place to fix if a conversion is ever wrong, rather than a factor scattered through the code in a dozen slightly different forms, some written as 0.001, some as 1 ÷ 1000 and one, inevitably, as 0.01.

## The error: a plate two metres thick

This is an illustration. Before the release pack, a drafter had written a small tool to change the thickness of a family of sheet metal brackets: it read a thickness typed by the user and set the sheet metal feature's thickness parameter. Tested on one bracket, with the user typing 0.002 because the drafter knew the API's convention, it worked.

A colleague used it on twelve brackets, typing **2**, as anyone would for a 2 mm plate. The tool set each bracket's thickness to 2 metres. Eleven brackets failed to rebuild with errors the colleague did not understand and closed without saving; the twelfth rebuilt into a block two metres thick, was saved, and sat in the vault until the next person opened its assembly and found it filling the screen.

Two fixes went in. The tool now asks for the thickness in millimetres and converts. And it checks the converted value against a plausible range before setting anything: for this family of brackets, between 0.0005 and 0.010 m, half a millimetre to ten. A value outside the range stops the tool with a message giving the value in millimetres and the range allowed.

## Range checks

A range check is the cheapest protection against unit errors and typing errors alike, and it belongs before every write. The range does not need to be tight; it needs to exclude the impossible. For a plate thickness, anything over a few tens of millimetres is impossible for a sheet metal part; for an angle in a bend, anything over 180°; for a mass written to a property, anything negative or greater than the heaviest product the office has ever made.

```figure
type: checklist
title: Checks before writing a numeric value to a model or property
caption: This is an illustration of the release pack's rules. Ranges are generous; their purpose is to catch units and typing errors, not to enforce design limits.
- Converted from display units at the boundary | Named conversion function, not an inline factor
- Within a plausible range for this value | Sheet thickness 0.0005 to 0.010 m; bend angle 0 to π
- Not negative unless negative is meaningful | Mass, thickness, length
- Compared with a tolerance, not for exact equality | Floating-point values rarely match exactly
- Formatted for its reader with stated units | "1.38 kg", not "1.3800000000001"
- x Written without converting because "the user knows" | The two-metre plate
- ? Value read from a file in unknown units | Confirm the file's units before converting
```

## Angles

Angles carry the same trap in a different form. A tool that sets a bend angle to 90 when the API expects radians sets it to 90 radians, which is about 5,157°, or 116.6° once whole turns are removed. The result looks almost plausible on screen, which makes it more dangerous than the two-metre plate. The fix is the same: convert degrees to radians at the boundary, and range-check, here between 0 and π for a bend.

## Units in names

A conversion is easier to check when the variable's name says its unit. A variable called "thickness" could hold millimetres or metres; one called "thickness_m" or "thicknessMm" cannot be mistaken. The release pack's code suffixes every numeric variable that crosses the API boundary with its unit, so that a line which multiplies a value ending in "_mm" by 0.001 and stores it in one ending in "_m" reads correctly, and a line that passes a "_mm" value straight to the API looks wrong at a glance. It is a small discipline that has caught two conversions in code review that tests had not yet reached.

## Never compare decimals for exact equality

Computers store most decimal values approximately, in binary floating point. The value 0.025, a 25 mm length in metres, is stored as something like 0.025000000000000001; 0.1 + 0.2 comes out as 0.30000000000000004. Comparing two lengths with an exact equality test will often say they differ when, for any engineering purpose, they are the same.

The rule is to compare with a tolerance: two lengths are equal if they differ by less than, say, a nanometre, 1 × 10⁻⁹ m, which is far below any manufacturing significance and far above floating-point noise. A tool that checks whether a hole is 9.0 mm, or whether two parts are the same length, should use the tolerance. The release pack uses it when it compares a drawing's sheet size with the office's standard sizes, which the API reports in metres.

## Numbers that become text

Custom properties, file names and reports are text, and a number turned into text needs a format. Without one, a mass of 1.38 kg may be written as "1.3800000000000001", and a length of 0.0254 m converted to millimetres as "25.400000000000002".

Three habits keep text values clean:

- **Round to a stated precision** for the reader: two decimal places for mass in kilograms, one or none for lengths in millimetres, as the office's standard requires.
- **Write the units** in the property's value or name: "1.38 kg", or a property named "Mass (kg)" with the value "1.38".
- **Fix the decimal separator**, not leave it to the computer's regional settings. A seat configured for a region that uses a comma as the decimal separator will write "1,38", which another seat may read as 138 or as two numbers. The release pack formats numbers with a point, explicitly, whatever the seat's settings.

## The running case: a mass property

This is an illustration. The office wanted each released drawing's title block to show the part's mass, filled from the model. The release pack reads the model's mass from the API, which reports it in kilograms for this product, as the help confirms. For the 2 mm steel bracket of an earlier Library case, with 87,873.5 mm² of blank after holes, the API reports a volume of 87,873.5 × 2 = 175,747 mm³, which it gives as 0.000175747 m³, and with the material's density of 7,850 kg/m³, a mass of **1.380 kg**.

The tool rounds to two decimal places, formats with a point, and writes "1.38" to a property named "Mass (kg)". It range-checks first: any mass below 0.001 kg or above 5,000 kg is reported rather than written, which catches a part with no material assigned, whose mass the API reports as zero or as based on a default density.

```figure
type: steps
title: The release pack's mass property step
caption: This is an illustration. Each step converts or checks once; nothing is written until every check passes.
- Read mass from the model | API reports kilograms in this product: 1.380
- Check a material is assigned | Otherwise mass reflects a default or zero
- Range-check | 0.001 to 5,000 kg; 1.380 passes
- Round and format | Two decimals, point separator: "1.38"
- *Write to property "Mass (kg)" | Log the old and new values
```

## The document's own units

The API's internal units are fixed, but each document still has display units that its users see, and some tools need them. A report that lists hole sizes should show them in the units the drawing uses; a tool that writes a dimension's value into a note should match the drawing's display. Most APIs let the tool ask a document for its length unit and its display precision.

This is an illustration. The office's own documents are all in millimetres, but it receives some supplier models in inches. When the release pack writes a model's overall size into a property for the parts list, it converts the API's metres into the office's millimetres, not into the model's inches, because the parts list is the office's document. When it writes a size into a note on a supplier's inch drawing, it would use inches. The rule is that the reader of the output decides its units, and the tool must know who the reader is.

## Displayed precision is not stored precision

A document's display precision, two or three decimal places for millimetre drawings, rounds what the user sees, not what the API stores. A tool that reads a dimension gets the full stored value, 0.0254000000 m for a 25.4 mm length, not "25.40". That is what a tool should work with internally. It should round only when producing text for a person, as above, and never round a value and then write it back to the model, which would quietly move geometry by up to half a display step every time the tool ran.

## Testing for unit errors

Unit errors hide best behind test values that are plausible in more than one unit. A test that sets a hole to 1 mm cannot tell whether the tool wrote 1 mm or 1 m converted twice, because both may produce something that rebuilds. A test that sets it to 37 mm can: the result is either 37 mm, which is right, 37 m, which fails or fills the screen, or 0.037 mm, which is a speck. The office's test set for any tool that writes dimensions uses distinctive values such as 37, 4.6 and 123 mm, and its test checks the resulting value through the API and in the drawing's dimension display, so that a conversion missed in either direction shows up as a factor of a thousand.

## Values from files

Tools that read values from spreadsheets, text files or other systems add one more boundary. A spreadsheet of plate thicknesses may be in millimetres, inches or metres, and may not say. The tool should require the units to be stated, in a column heading or a setting, and refuse a file that does not state them. It should also apply the same range checks to values from files as to values typed by a person, because a spreadsheet with one row in the wrong units looks exactly like one with all rows right.

## Exercise: a hole-sizing tool

A tool reads a list of hole diameters in millimetres from a spreadsheet and sets each matching hole feature's diameter in a part. One row reads "0.375", with no units column, for a hole the drawing shows as Ø9.5. What has probably happened, what value would the tool set without checks, and what checks would have caught it?

**Worked answer.** 0.375 inch is 0.375 × 25.4 = **9.525 mm**, close to the drawing's Ø9.5, so the row was probably entered in inches by someone working from an imperial catalogue.

Without checks, the tool would treat 0.375 as millimetres, convert it to 0.000375 m and set the hole to **0.375 mm** diameter, a pinhole. The part would rebuild without error.

Three checks would have caught it: requiring a units column, so the file would have been refused; a range check, say 1 to 100 mm for holes on this family of parts, which 0.375 fails; and a comparison with the current value, 9.5 mm, flagging any change of more than, say, 20%, which a 96% reduction fails. The tool should report the row, the value, the reason and the current diameter, and change nothing until the file is corrected.
