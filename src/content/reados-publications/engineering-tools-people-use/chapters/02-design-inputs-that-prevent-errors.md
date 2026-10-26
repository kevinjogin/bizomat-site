---
book: engineering-tools-people-use
chapterSlug: design-inputs-that-prevent-errors
order: 2
title: "Design inputs that prevent errors"
description: "Replace ambiguous fields with explicit ones, show units and limits as people type, check plausibility, import values instead of retyping them and convert old files safely."
draft: false
---

Most errors in engineering tools happen at the inputs. A value is typed in the wrong unit, a tolerance is entered in the wrong convention, a sign is reversed, a decimal point slips. The calculation then does exactly what it was told, perfectly, and produces a confident wrong answer. Checking the calculation will never find these errors, because the calculation is right. The only defence is inputs designed so that the wrong entry is hard to make and easy to see.

This chapter redesigns the stack-up tool's inputs after the observation in Chapter 1. It replaces the ambiguous tolerance field with explicit upper and lower deviations, shows units and resulting limits as the designer types, shows the direction of each dimension in a picture, checks plausibility, imports dimensions from the CAD model instead of retyping them and converts old stack files without carrying their errors into the new tool. The failure case is the first version of that converter, which faithfully preserved every old mistake.

## Ask for what the drawing shows

The old tool asked for "Tol.", which half its users read as the total band and half as plus-or-minus. The root problem was that the field asked for something the drawing does not show. Engineering drawings show a dimension with its upper and lower deviations, such as 45.50 ± 0.10 or 12.00 +0 / −0.12. Neither convention matches the field.

The new tool asks for exactly what the drawing shows: the **nominal**, the **upper deviation** and the **lower deviation**, each in its own field, in millimetres. A symmetric tolerance is entered as +0.10 and −0.10. The tool never asks the user to halve or double anything. The calculation converts the deviations into a mean and a half-band internally, where nobody has to think about it.

That change also fixed a problem the observation had not noticed. Asymmetric tolerances, common on bearings and on fits from ISO 286, could not be entered in the old tool at all without the user working out the mean and half-band by hand. A bearing 12.00 +0 / −0.12 wide has a mean width of 11.94 mm and a half-band of 0.06 mm. Two of the old stack files had entered it as 12.00 with a total band of 0.12, which shifts the whole stack by 0.06 mm. With the new fields, the designer types the drawing's values and the tool does the arithmetic.

```figure
type: compare
title: The tolerance inputs before and after
cols: Old tool | New tool
caption: This is an illustration. The new fields match the way tolerances are written on drawings, so there is nothing to convert in the designer's head.
- Fields | nominal and "Tol." | nominal, upper deviation and lower deviation
- Meaning of the tolerance | total band, unstated | each deviation, stated, with its sign
- Asymmetric tolerances | converted by hand | entered as drawn
- Units | unstated | "mm" beside every field
- *Feedback while typing | none | resulting limits shown at once, for example 45.40 to 45.60
- Direction in the chain | a + or − field | an arrow on a sketch of the chain
```

## Show the result of every input immediately

The single most effective change was to show, beside each row, the limits that the entered values produce: "45.40 to 45.60". A designer who intended ±0.10 and sees "45.40 to 45.60" knows the entry is right. One who sees "45.45 to 45.55" knows immediately that something is wrong, before any stack is calculated.

The same principle applies to every derived value. If an input is converted, rounded or interpreted, show the interpretation. Engineers are good at spotting a wrong number when they can see it. They cannot spot an interpretation the tool keeps to itself.

## Show direction in a picture

Two of the six observed designers were unsure whether a dimension added to or subtracted from the gap. A field labelled "+/−" does not help, because the user has to hold the whole chain in their head to answer it. The new tool draws the chain.

```figure
type: svg
title: The gear hub stack as the tool now draws it
alt: A horizontal sketch of a dimension chain. A long arrow labelled A, housing depth 45.50, points right from the housing face. Below it, three arrows pointing left are labelled B bearing 12.00, C spacer 8.00 and D hub 25.00, placed end to end. The small space left between the end of D and the end of A is labelled Gap, 0.50 nominal.
caption: This is an illustration of the redesigned input screen's sketch. Each dimension the designer adds appears as an arrow; reversing its direction flips the arrow, so the sign is chosen by looking, not by remembering a convention.
viewbox: 0 0 640 220
body:
<path class="ln" d="M40 30V200"/>
<text class="tx txs" x="46" y="24">Housing face</text>
<path class="la draw" pathLength="1" d="M40 70H590"/>
<path class="ah" d="M590 70l-10 -5v10z"/>
<text class="txa" x="250" y="60">A housing depth 45.50, adds</text>
<path class="ln" d="M590 30V200"/>
<path class="ln" d="M590 120H446"/>
<path class="ah" d="M446 120l10 -5v10z"/>
<text class="tx txs" x="470" y="112">B bearing 12.00</text>
<path class="ln" d="M446 150H350"/>
<path class="ah" d="M350 150l10 -5v10z"/>
<text class="tx txs" x="360" y="142">C spacer 8.00</text>
<path class="ln" d="M350 180H50"/>
<path class="ah" d="M50 180l10 -5v10z"/>
<text class="tx txs" x="150" y="172">D hub 25.00, subtracts</text>
<rect class="bxa pulse" x="40" y="185" width="10" height="15"/>
<text class="txa" x="58" y="212">Gap 0.50 nominal</text>
```

The sketch is schematic, not to scale, with the gap exaggerated so it can be seen. Its purpose is to make the logic visible. A dimension with the wrong direction shows as an arrow pointing the wrong way, which designers spot at a glance in a way they never spotted a wrong sign in a column of numbers.

## Check plausibility, gently

Some entries are almost certainly wrong. The tool checks a few simple conditions and warns, without blocking:

- a deviation larger than the dimension's own size, or larger than 1 mm on a machined dimension under 100 mm;
- a deviation of zero on both sides, which usually means a basic dimension entered by mistake;
- an upper deviation smaller than the lower one;
- a nominal gap that is negative, which usually means a reversed direction;
- a value with more than three decimal places, often a pasted value with stray digits.

Each warning says what looks wrong and why, and the designer can confirm it if it is intended. The tool records confirmed warnings in the stack file, so a reviewer can see that the designer saw and accepted them. Warnings that block the user for legitimate entries teach people to ignore warnings. These were tuned during the testing in Chapter 6 until almost every one pointed at a real mistake.

## Import instead of retyping

Most of the 18 minutes the observed designers spent went on finding dimensions in the model and drawing and typing them in. Every typed value is a chance for an error. The new tool lets the designer pick a dimension in the CAD model or drawing, and imports its nominal and deviations directly, with a link back to the dimension. If the drawing changes later, the stack file shows which inputs no longer match.

Importing is not always possible. Some dimensions come from supplier catalogues, and some stacks are done before the model exists. The tool therefore supports both, and marks each input as imported or typed. Imported inputs are less error-prone, and reviewers can focus their attention on the typed ones, which are where nearly all the remaining mistakes are found.

## Values from suppliers in other units

Bearings, seals and bought-in components often arrive with data in inches or with tolerances stated in microns. A designer copying "0.0005 in" or "−120 μm" into a millimetre field produces a wildly wrong value that a plausibility check may or may not catch. The new tool lets a typed value carry its unit, such as "0.0005 in" or "−120 um", converts it to millimetres and shows the converted value beside the original: "−0.120 mm (from −120 μm)". The original text is kept in the stack file, so a reviewer can trace the value to the supplier's data sheet without reconverting it.

## Pasted values and stray characters

Designers often paste values from drawings, spreadsheets and supplier PDFs. Pasted text brings surprises: a non-breaking space, a Unicode minus sign that looks like a hyphen but is not, a trailing "mm", a comma used as a thousands separator in one source and as a decimal separator in another. The old tool rejected some of these with an unhelpful error and silently misread others. A pasted "1,200" became 1.2 in one test, because the field read the comma as a decimal mark.

The new tool cleans pasted values in a defined way: it strips spaces and unit text, treats the Unicode minus as a minus, and refuses an ambiguous comma with a message asking which was meant. It then shows the value it understood beside the field, which is the general rule from earlier in this chapter applied to pasting.

## Save incomplete work

Real stacks are often built over several sittings: some dimensions are known, others await a supplier's drawing. The old tool could not save a stack with empty fields, so designers filled the gaps with guesses to save their work and sometimes forgot which values were guesses. The new tool saves incomplete stacks, marks every missing or provisional value as such in the sketch and the results, and refuses to show a pass or fail until every input is confirmed. A provisional value is entered with a flag, and the result screen lists the provisional inputs above the answer, so nobody mistakes an unfinished stack for a finished one.

## Defaults and the general tolerance

Many dimensions on a drawing carry no individual tolerance and fall under the general tolerance note in the title block. The old tool had no way to express that, so designers looked up the general tolerance and typed it. The new tool, when a dimension is imported without an individual tolerance, reads the drawing's general tolerance and applies it, showing "general tolerance" beside the deviations. If the drawing has no general tolerance note, the tool says so and asks, which itself catches incomplete drawings.

```figure
type: checklist
title: Input design rules adopted for the office's tools
caption: This is an illustration of the rules the office now applies to every in-house engineering tool, not just the stack-up tool.
- Ask for values in the form the source document shows them | deviations as drawn, not converted
- Show the unit beside every numeric field, in words or symbols | "mm", never unstated
- Show the interpreted result of every input as it is entered | limits, converted values, rounding
- Make direction, orientation and sign visible in a picture | not a sign field to remember
- Warn on implausible values, explain why, allow confirmation and record it | never block legitimate input
- Import from the model or drawing where possible; mark typed values | typed values get review attention
- x Fields whose meaning depends on a convention the user must remember | the commonest source of silent errors
```

## Measure the change

The office timed six designers again on real stacks after the new inputs went into use, with the same method as Chapter 1. This is an illustration. Setting up a five-dimension stack fell from about 18 minutes to about **9**, almost all of the saving coming from importing dimensions instead of finding and typing them. In the following year's audit of 20 saved stack files, none had tolerances that disagreed with their drawings. The plausibility warnings fired on about one stack in seven, and the designers confirmed about a third of those as intended. The rest were real mistakes, caught as they were typed.

## A failure case: the converter that preserved the errors

This is an illustration. The office had about 140 saved stack files in the old format, and designers would need to reopen them when assemblies were revised. The tool's author wrote a converter that read each old file and created a new one. It treated each old "Tol." value as a total band, as the old tool had, and split it into equal upper and lower deviations of half the value.

That was a faithful conversion of what the old tool had calculated. It was also a faithful conversion of every error. The files in which designers had entered plus-or-minus values, about 8% from the audit in Chapter 1, were converted into new files with tolerances half the size of the drawings', now in fields that looked explicit and trustworthy. The new format made the old mistakes look more reliable than before.

The detection came from the designer who had run the audit. Comparing a converted file with its drawing, they found the halved deviations neatly displayed as "+0.05 / −0.05" for a dimension drawn at ±0.10. The correction was a second converter that did not guess. For each old value, it showed both interpretations, the total band and the plus-or-minus, beside the drawing's actual tolerance where the dimension could be found in the vault, and asked the designer reopening the file to confirm which was right. Files were converted only when reopened for real work, so the confirmation was done by someone who knew the assembly. The lesson recorded was that migrating data from an ambiguous format must resolve the ambiguity, not inherit it. A converter that cannot know what a value meant should ask someone who does, at the moment they need the file.

## How this applies to a small Australian business

Small offices often inherit spreadsheets and tools whose inputs carry a convention only the author knew. Look at every input field in your important tools and ask: does it ask for a value in the form the source document shows? Does it say its unit? Does it show what it did with the value? Fixing those three things removes most silent errors, and none of them needs sophisticated software. A spreadsheet tool can do all three with a units column, a calculated column showing the limits and a little conditional formatting, and the person who maintains it can make the changes in an afternoon. Australian drawings follow ISO conventions for tolerances in most industries, so a tool that matches those conventions also matches what designers see every day.

## Exercise: an asymmetric dimension

A stack has housing depth A = 45.50 ± 0.10 adding to the gap, and B = 12.00 +0 / −0.12, C = 8.00 ± 0.05 and D = 25.00 ± 0.08 subtracting. Calculate the mean gap and the worst-case limits. Then calculate what the old tool showed if the designer entered B as nominal 12.00 with a total band of 0.12.

**Worked answer.** B's mean is **12.00 − 0.06 = 11.94** with half-band **0.06**. The mean gap is **45.50 − 11.94 − 8.00 − 25.00 = 0.56 mm**, and the half-bands sum to **0.10 + 0.06 + 0.05 + 0.08 = 0.29**, so the worst-case limits are **0.27 to 0.85 mm**. The old tool, treating B as 12.00 with a half-band of 0.06, gives a mean gap of **0.50** and limits of **0.21 to 0.79 mm**. Here the error is pessimistic by 0.06 mm. It would be optimistic for a dimension with a +0.12 / −0 tolerance, which the old tool could not represent either.
