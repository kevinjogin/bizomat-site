---
book: engineering-tools-people-use
chapterSlug: make-it-accessible-and-consistent
order: 7
title: "Make it accessible and consistent"
description: "Make in-house engineering tools usable by everyone: readable contrast, meaning not carried by colour alone, keyboard and scaling support, and consistency with other tools."
draft: false
---

A tool used by fourteen designers will be used by people who see colour differently, who work at high display scaling because they have astigmatism or a large screen, who prefer the keyboard to the mouse, or who read small grey text with difficulty at the end of a long day. None of them are unusual. Designing for them costs little when it is done from the start and a great deal when a misread result has already caused a problem. Consistency is the companion idea: a tool that behaves like the CAD system it lives in, and like the office's other tools, is learned once and used without thinking.

This chapter applies accessibility and consistency to the stack-up tool. It checks text contrast against the published guideline, removes meaning carried by colour alone, supports the keyboard and display scaling, aligns the tool with the CAD system's conventions and writes a short style guide for all the office's in-house tools. The failure case is a pass-fail cell coloured red or green, read the wrong way by a designer with a common form of colour vision deficiency.

## Contrast that people can read

The Web Content Accessibility Guidelines (WCAG), published by the World Wide Web Consortium, were written for web content, but their visual principles apply to any screen. One of the best known is a minimum contrast ratio between text and its background of **4.5:1** for normal text, with a lower minimum for large text. The ratio compares the relative luminance of the two colours, a measure of how bright each appears.

```figure
type: formula
title: Contrast ratio between text and background
formula: contrast ratio = (L_lighter + 0.05) ÷ (L_darker + 0.05)
caption: Relative luminance L runs from 0 for black to 1 for white, calculated from each colour's red, green and blue values as WCAG defines. Values below were calculated for grey text on a white background, L = 1.
- Mid-grey #999999 | L ≈ 0.319
- Grey #767676 | L ≈ 0.181
- Dark grey #595959 | L ≈ 0.100
step: #999999 on white: (1 + 0.05) ÷ (0.319 + 0.05) ≈ 2.85, below 4.5
step: #767676 on white: ≈ 4.54, just meets 4.5
step: #595959 on white: ≈ 7.00, comfortably above
```

The old tool used mid-grey text, about **2.85:1**, for its labels and units, because it looked tidy. That is well below the guideline. The new tool uses dark grey, about 7:1, for all text, and checks every colour pair against the guideline in its style definitions. Free contrast checkers make this a few minutes' work, and the office now runs one on every new tool's colours before its first user test.

## Never carry meaning by colour alone

WCAG also states that colour should not be the only way information is conveyed. The old tool showed a stack's result in a cell coloured green for pass and red for fail, with the number inside. To a designer with the most common form of colour vision deficiency, which affects a significant minority of men, red and green can look very similar. A bright red and a mid green, for example, have almost the same luminance: about **1.15:1** between them.

The new result screen states the result in words and with a symbol, as well as colour: "✔ Passes by 0.06 mm" or "✖ Fails by 0.04 mm", with the failing range drawn with a hatched pattern on the range picture from Chapter 3. Anyone can read it in any colour, in greyscale or on a monochrome printout of the review record.

```figure
type: compare
title: The pass-fail display, before and after
cols: Old display | New display
caption: This is an illustration. The new display carries the result in three independent ways, so the loss of any one, colour, symbol or word, still leaves it readable.
- Result | number in a red or green cell | "Fails by 0.04 mm" in words
- Symbol | none | ✖ for fail, ✔ for pass, ! for marginal
- *Colour | the only signal | an extra signal, never the only one
- Range picture | solid bars | failing range hatched, requirement shaded
- Printed review record | colour lost on the office's monochrome printer | fully readable
```

## Keyboard and scaling

Some designers prefer the keyboard, especially when entering a long chain of dimensions. The new tool supports moving through every input with the Tab key in a sensible order, row by row, entering values without touching the mouse, and confirming warnings from the keyboard. Every button has a keyboard shortcut shown in its tooltip.

Display scaling was the other surprise. Three of the office's fourteen designers used their operating system's display scaling at 125% or 150%, two because of large high-resolution monitors and one for eyesight. At 150%, the old tool's fixed-size window clipped the right-hand column, which held the tolerance fields. Those designers had learned to drag the window wider every time. The new tool lays out its panels to fit the available space and was tested at 100%, 125%, 150% and 200% scaling during the user tests.

## Numbers that read cleanly

Engineering tools are mostly numbers, and how numbers are set on screen affects how accurately they are read. The office made four small changes. Columns of values use figures of equal width, so that decimal points line up and a 0.10 cannot be mistaken for a 0.01 at a glance. Negative values use a true minus sign with a space before it, never a hyphen squeezed against the digit. The typeface was chosen so that the digit 1, the lower-case l and the capital I are clearly different, as are 0 and O, because part numbers and dimension labels mix them. And values are never shown in scientific notation for ordinary millimetre dimensions, which one old screen had done for very small tolerances, turning 0.005 into 5E-03.

## Sound, motion and interruption

The old tool beeped with every message, including information messages, in an open-plan office. Designers had turned their computers' sound off, which meant they also missed the CAD system's own alerts. The new tool makes no sound. It also avoids animation for anything that matters, because movement draws the eye away from the number being checked, and it never moves focus away from the field a user is typing in to show a message. Messages appear beside the relevant input and wait.

## Ask about needs without singling anyone out

People rarely volunteer that they find a tool hard to use for reasons connected to their eyesight, hearing or hands. The office asked in a way that did not single anyone out: a short, voluntary note to all designers, listing the changes being made and inviting anyone to say privately if colours, text size, scaling, keyboard use or anything else made the tools harder for them. Three people responded, each with a specific, easily fixed issue. The design manager handled the responses personally and kept them confidential.

## Printed and exported records

The review record from Chapter 3 is often printed, emailed as a PDF or read on a tablet on the workshop floor. It follows the same rules as the screen: dark text, results in words and symbols, patterns rather than colour for ranges, and a layout that prints legibly on the office's monochrome printer. The PDF carries real text rather than an image of the screen, so it can be searched, copied into a report and read by screen-reading software if anyone needs it.

## Consistent with the CAD system

The tool runs inside the CAD system, and users move between them constantly. Wherever a convention exists in the CAD system, the tool follows it: the same units and number formats as the user's CAD settings, the same placement of OK and Cancel, the same selection behaviour, the same term for the same thing. When the CAD system calls something a "mate", the tool does not call it a "constraint". Each departure from the host's conventions is a small extra thing to learn, and small things add up to a tool that feels foreign.

## Consistent with the office's other tools

The office had a dozen in-house tools, written by different people over many years, each with its own conventions: one entered tolerances as total bands, another as plus-or-minus, a third as upper and lower deviations. A designer moving between them had to remember which was which, the very problem Chapter 2 set out to remove. The office wrote a short style guide for all in-house tools.

```figure
type: checklist
title: The office's style guide for in-house engineering tools
caption: This is an illustration. Two pages, maintained by the design manager; every new tool and every substantial revision is checked against it.
- Tolerances entered as upper and lower deviations, as drawn | the same everywhere
- Units shown beside every value; the CAD system's unit settings respected | never unstated
- Results stated in words, with symbol and colour as extra signals | never colour alone
- Text contrast at least 4.5:1; labels never pale grey | checked against WCAG
- Messages follow the what, why and what-to-do pattern, using the glossary terms | Chapter 4
- Layout works at 100% to 200% display scaling; full keyboard use | tested, not assumed
- x A new convention for something an existing tool already handles | reuse the existing one
```

The guide is two pages long. Writing it took a day, most of it spent agreeing the conventions with the people who maintain the other tools. It changed how new tools were designed, and the older tools were brought into line as they were revised.

## A failure case: red and green

This is an illustration. During the second round of user testing in Chapter 6, a participant was asked to say whether a stack passed. They read the result cell, coloured red, as a pass. Asked afterwards, they explained that they had a red-green colour vision deficiency, that red and green cells looked much the same brownish colour to them, and that they had always relied on the number inside and their own calculation of the requirement. In this task they had glanced at the cell and assumed.

The participant had used the old tool for four years without mentioning it, because they had their own workaround and did not want to make a fuss. Their workaround had worked most of the time, which is exactly why nobody had noticed the risk. The office had no way of knowing how many past results they, or anyone else, had read by colour.

The detection came from realistic testing with a varied group of users, and from a debrief question that invited the participant to explain their reasoning. The correction was the three-signal display above, adopted for every result and status in the tool, and then for every in-house tool through the style guide. The office then made the general, voluntary invitation described earlier in this chapter, which is how it learned about the other needs it went on to fix.

## Consistent over time

Consistency also means not changing what people have learned without a good reason. Once designers know that Ctrl and the arrow keys move between rows, or that the margin appears in the top line of the results, moving those things in the next version costs every user a little relearning and invites mistakes during the changeover. The office treats established conventions in its tools as an interface agreement with their users: changed only when the benefit is clear, announced in the "What has changed" note from Chapter 4, and applied to all the office's tools at once rather than drifting one tool at a time.

## Test in the real conditions

Accessibility checks done on the author's large, well-calibrated monitor in a quiet room miss what designers face: laptop screens on site visits, glare from a window in the afternoon, a projector in the design review room that washes out pale colours. The office ran its final checks of the new tool on an ordinary laptop, on the review-room projector and on a monochrome printout. The projector check alone led to two further colour changes, because the shaded requirement band almost disappeared when projected.

## Accessibility is ordinary good design

None of the changes in this chapter served only a few people. Higher-contrast text was easier for everyone to read late in the day. Words beside colours helped everyone when the review record was printed. Keyboard entry was faster for experienced users. A layout that worked at 150% scaling also worked on the small laptop screens used during site visits. Designing for the edges improved the tool for the middle. The office also found that the changes were cheapest when made as part of the redesign. Retrofitting contrast, keyboard support and scalable layout to a finished tool would have meant reworking most of its screens, while building them in from the start added perhaps a tenth to the interface work. The style guide now makes them the default for every new tool, so nobody has to remember to ask.

## How this applies to a small Australian business

Small offices rarely think about accessibility in internal tools, because the users are colleagues and nobody complains. The colleagues are often quietly working around problems, as the participant here had done for four years. Check contrast with a free tool, never let colour carry meaning alone, test at the display scaling people actually use, and follow the host CAD system's conventions. Write a two-page style guide for your in-house tools so that each one is learned once. Australian workplaces are expected to consider the needs of employees with disability, and these measures cost almost nothing when built in from the start.

## Exercise: choosing a warning colour

A developer proposes orange text, with red 230, green 140 and blue 0, on a white background for marginal results. Its relative luminance is about **0.36**. Calculate its contrast ratio with white, decide whether it meets the 4.5:1 guideline for normal text, and say what else the marginal result needs besides its colour.

**Worked answer.** The contrast ratio is **(1 + 0.05) ÷ (0.36 + 0.05) ≈ 2.56:1**, or about 2.59:1 with the unrounded luminance, well below 4.5:1, so the orange is too light for normal text. A darker orange, or dark text on a pale orange background, would be needed. Whatever colour is chosen, a marginal result also needs a word and a symbol, for example "! Marginal: passes by 0.004 mm, within rounding of the requirement", so that it is readable in greyscale and by people who see orange differently.
