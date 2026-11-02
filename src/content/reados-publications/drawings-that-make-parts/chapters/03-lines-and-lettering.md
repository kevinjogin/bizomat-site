---
book: drawings-that-make-parts
chapterSlug: lines-and-lettering
order: 3
title: "Lines and lettering that survive the printer"
description: "Use the line types and line groups of AS ISO 128.24 and AS 1100.101, choose widths and character heights that survive reduction, and resolve coincident lines correctly."
draft: false
---

A drawing is made of lines and characters, and each kind of line carries a meaning. A wide continuous line is an edge you can see; a narrow dashed line is one you cannot; a long-dashed dotted line is a centre line. When those meanings are clear, a reader takes in a view at a glance. When they blur, because two widths look the same on a faint print, or because a hidden line has been drawn over a centre line, the reader has to work it out, and sometimes works it out wrong.

This chapter sets out the line types for mechanical drawings, the line groups that fix their widths, the minimum sizes for lines and characters after reproduction, and the order of priority when lines coincide. The running case shows why a line group that looks fine on screen can fail on a reduced print.

## Line types and their meanings

AS ISO 128.24, which adopts ISO 128-24:1999, lists the line types used on mechanical engineering drawings, each with a number and a set of applications. AS 1100.101 uses its own letter designations, Types A to K, with similar applications. The ISO numbering is the one most CAD systems and overseas customers now use, so this book uses it, with the AS 1100.101 letter where it helps.

```figure
type: svg
title: Common line types on mechanical drawings, AS ISO 128.24
alt: Common line types on mechanical drawings, AS ISO 128.24. 01.1: Line continuous narrow; Typical applications dimension, extension and leader lines, hatching, short centre lines, roots of threads. 01.2: Line continuous wide; Typical applications visible edges and outlines, crests of threads, limit of full-depth thread, section arrows. 02.1: Line dashed narrow; Typical applications hidden edges and hidden outlines. 04.1: Line long-dashed dotted narrow; Typical applications centre lines, lines of symmetry, pitch circles of gears and holes. 04.2: Line long-dashed dotted wide; Typical applications cutting plane positions, limited areas needing surface treatment. 05.1: Line long-dashed double-dotted narrow; Typical applications adjacent parts, extreme positions of moving parts, initial outlines before forming
caption: Selected from Table 1 of AS ISO 128.24-2005, identical to ISO 128-24:1999. The standard lists more applications for several types.
viewbox: 0 0 640 370
- 01.1 | Line: continuous narrow; Typical applications: dimension, extension and leader lines, hatching, short centre lines, roots of threads
- 01.2 | Line: continuous wide; Typical applications: visible edges and outlines, crests of threads, limit of full-depth thread, section arrows
- 02.1 | Line: dashed narrow; Typical applications: hidden edges and hidden outlines
- 04.1 | Line: long-dashed dotted narrow; Typical applications: centre lines, lines of symmetry, pitch circles of gears and holes
- 04.2 | Line: long-dashed dotted wide; Typical applications: cutting plane positions, limited areas needing surface treatment
- 05.1 | Line: long-dashed double-dotted narrow; Typical applications: adjacent parts, extreme positions of moving parts, initial outlines before forming
body:
<g class="kf-a kd1">
<path class="ln" d="M30 36H230"/>
<text class="txb" x="250" y="30" text-anchor="start">01.1 continuous narrow</text>
<text class="txs" x="250" y="47">dimension, extension and leader lines, hatching, short</text>
<text class="txs" x="250" y="63">centre lines, roots of threads</text>
</g>
<g class="kf-a kd2">
<rect class="bxa" x="20" y="66" width="600" height="54" rx="4"/>
<rect class="fi" x="30" y="90" width="200" height="4"/>
<text class="txb" x="250" y="86" text-anchor="start">01.2 continuous wide</text>
<text class="txs" x="250" y="103">visible edges and outlines, crests of threads, limit of</text>
<text class="txs" x="250" y="119">full-depth thread, section arrows</text>
</g>
<g class="kf-a kd3">
<path class="ln" d="M30 148H42"/>
<path class="ln" d="M47 148H59"/>
<path class="ln" d="M64 148H76"/>
<path class="ln" d="M81 148H93"/>
<path class="ln" d="M98 148H110"/>
<path class="ln" d="M115 148H127"/>
<path class="ln" d="M132 148H144"/>
<path class="ln" d="M149 148H161"/>
<path class="ln" d="M166 148H178"/>
<path class="ln" d="M183 148H195"/>
<path class="ln" d="M200 148H212"/>
<path class="ln" d="M217 148H229"/>
<text class="txb" x="250" y="142" text-anchor="start">02.1 dashed narrow</text>
<text class="txs" x="250" y="159">hidden edges and hidden outlines</text>
</g>
<g class="kf-a kd4">
<path class="ln" d="M30 204H58"/>
<path class="ln" d="M62 204H64"/>
<path class="ln" d="M68 204H96"/>
<path class="ln" d="M100 204H102"/>
<path class="ln" d="M106 204H134"/>
<path class="ln" d="M138 204H140"/>
<path class="ln" d="M144 204H172"/>
<path class="ln" d="M176 204H178"/>
<path class="ln" d="M182 204H210"/>
<path class="ln" d="M214 204H216"/>
<path class="ln" d="M220 204H230"/>
<text class="txb" x="250" y="198" text-anchor="start">04.1 long-dashed dotted narrow</text>
<text class="txs" x="250" y="215">centre lines, lines of symmetry, pitch circles of gears and</text>
<text class="txs" x="250" y="231">holes</text>
</g>
<g class="kf-a kd5">
<rect class="fi" x="30" y="258" width="28" height="4"/>
<rect class="fi" x="62" y="258" width="3" height="4"/>
<rect class="fi" x="69" y="258" width="28" height="4"/>
<rect class="fi" x="101" y="258" width="3" height="4"/>
<rect class="fi" x="108" y="258" width="28" height="4"/>
<rect class="fi" x="140" y="258" width="3" height="4"/>
<rect class="fi" x="147" y="258" width="28" height="4"/>
<rect class="fi" x="179" y="258" width="3" height="4"/>
<rect class="fi" x="186" y="258" width="28" height="4"/>
<rect class="fi" x="218" y="258" width="3" height="4"/>
<rect class="fi" x="225" y="258" width="5" height="4"/>
<text class="txb" x="250" y="254" text-anchor="start">04.2 long-dashed dotted wide</text>
<text class="txs" x="250" y="271">cutting plane positions, limited areas needing surface</text>
<text class="txs" x="250" y="287">treatment</text>
</g>
<g class="kf-a kd6">
<path class="ln" d="M30 316H56"/>
<path class="ln" d="M60 316H62"/>
<path class="ln" d="M66 316H68"/>
<path class="ln" d="M72 316H98"/>
<path class="ln" d="M102 316H104"/>
<path class="ln" d="M108 316H110"/>
<path class="ln" d="M114 316H140"/>
<path class="ln" d="M144 316H146"/>
<path class="ln" d="M150 316H152"/>
<path class="ln" d="M156 316H182"/>
<path class="ln" d="M186 316H188"/>
<path class="ln" d="M192 316H194"/>
<path class="ln" d="M198 316H224"/>
<path class="ln" d="M228 316H230"/>
<text class="txb" x="250" y="310" text-anchor="start">05.1 long-dashed double-dotted narrow</text>
<text class="txs" x="250" y="327">adjacent parts, extreme positions of moving parts, initial</text>
<text class="txs" x="250" y="343">outlines before forming</text>
</g>
```

Two applications are worth noticing because they cause errors. Thread crests are wide lines and thread roots are narrow lines, so that a reader can tell an external thread from an internal one in a single view (Chapter 9). And the outline of an adjacent part, drawn in a long-dashed double-dotted narrow line, shows context without suggesting that the adjacent part is to be made to this drawing.

AS 1100.101 adds guidance on how to use some of these lines well:

- Hidden lines should be confined to the views where they are needed. AS 1100.101 warns against their excessive use, and Chapter 4 shows that good view selection removes most of them.
- Centre lines should cross in their long dashes, not in the gaps, and should project a short distance beyond the feature. For short centre lines a narrow continuous line may be used where there is no room for a dash.
- A partial view of a symmetrical object is marked by two short parallel narrow lines at each end of the line of symmetry.

## Line widths and line groups

AS ISO 128.24 clause 5 says that mechanical drawings normally use two line widths, wide and narrow, in the proportion 1 to 2. The widths come in groups:

```figure
type: svg
title: Line groups for mechanical drawings, AS ISO 128.24 Table 2
alt: Line groups for mechanical drawings, AS ISO 128.24 Table 2. Group 0.25: Wide lines, mm 0.25; Narrow lines, mm 0.13. Group 0.35: Wide lines, mm 0.35; Narrow lines, mm 0.18. Group 0.5 (preferred): Wide lines, mm 0.5; Narrow lines, mm 0.25. Group 0.7 (preferred): Wide lines, mm 0.7; Narrow lines, mm 0.35. Group 1: Wide lines, mm 1; Narrow lines, mm 0.5. Group 1.4: Wide lines, mm 1.4; Narrow lines, mm 0.7. Group 2: Wide lines, mm 2; Narrow lines, mm 1
caption: From AS ISO 128.24-2005. The 0.5 and 0.7 groups are the preferred groups. Choose the group to suit the kind of drawing, its size and scale, and how it will be copied or printed.
viewbox: 0 0 640 330
- Group 0.25 | Wide lines, mm: 0.25; Narrow lines, mm: 0.13
- Group 0.35 | Wide lines, mm: 0.35; Narrow lines, mm: 0.18
- Group 0.5 (preferred) | Wide lines, mm: 0.5; Narrow lines, mm: 0.25
- Group 0.7 (preferred) | Wide lines, mm: 0.7; Narrow lines, mm: 0.35
- Group 1 | Wide lines, mm: 1; Narrow lines, mm: 0.5
- Group 1.4 | Wide lines, mm: 1.4; Narrow lines, mm: 0.7
- Group 2 | Wide lines, mm: 2; Narrow lines, mm: 1
body:
<g class="kf-a kd1">
<text class="txb" x="30" y="22" text-anchor="start">Group</text>
<text class="txb" x="150" y="22" text-anchor="start">Wide line</text>
<text class="txb" x="400" y="22" text-anchor="start">Narrow line</text>
<text class="txs" x="30" y="320" text-anchor="start">Widths drawn 8 × actual size; wide to narrow is always 2 : 1.</text>
</g>
<g class="kf-a kd2">
<text class="txb" x="30" y="55" text-anchor="start">0.25</text>
<rect class="fi kf-growx" x="150" y="49" width="160" height="2"/>
<text class="txs" x="320" y="54" text-anchor="start">0.25 mm</text>
<rect class="fi kf-growx" x="400" y="49.5" width="160" height="1"/>
<text class="txs" x="570" y="54" text-anchor="start">0.13 mm</text>
</g>
<g class="kf-a kd3">
<text class="txb" x="30" y="93" text-anchor="start">0.35</text>
<rect class="fi kf-growx" x="150" y="86.6" width="160" height="2.8"/>
<text class="txs" x="320" y="92" text-anchor="start">0.35 mm</text>
<rect class="fi kf-growx" x="400" y="87.3" width="160" height="1.4"/>
<text class="txs" x="570" y="92" text-anchor="start">0.18 mm</text>
</g>
<g class="kf-a kd4">
<rect class="bxa" x="20" y="110" width="600" height="32" rx="4"/>
<text class="txa" x="30" y="131" text-anchor="start">0.5 preferred</text>
<rect class="fi kf-growx" x="150" y="124" width="160" height="4"/>
<text class="txs" x="320" y="130" text-anchor="start">0.5 mm</text>
<rect class="fi kf-growx" x="400" y="125" width="160" height="2"/>
<text class="txs" x="570" y="130" text-anchor="start">0.25 mm</text>
</g>
<g class="kf-a kd5">
<rect class="bxa" x="20" y="148" width="600" height="32" rx="4"/>
<text class="txa" x="30" y="169" text-anchor="start">0.7 preferred</text>
<rect class="fi kf-growx" x="150" y="161.2" width="160" height="5.6"/>
<text class="txs" x="320" y="168" text-anchor="start">0.7 mm</text>
<rect class="fi kf-growx" x="400" y="162.6" width="160" height="2.8"/>
<text class="txs" x="570" y="168" text-anchor="start">0.35 mm</text>
</g>
<g class="kf-a kd6">
<text class="txb" x="30" y="207" text-anchor="start">1</text>
<rect class="fi kf-growx" x="150" y="198" width="160" height="8"/>
<text class="txs" x="320" y="206" text-anchor="start">1 mm</text>
<rect class="fi kf-growx" x="400" y="200" width="160" height="4"/>
<text class="txs" x="570" y="206" text-anchor="start">0.5 mm</text>
</g>
<g class="kf-a kd7">
<text class="txb" x="30" y="245" text-anchor="start">1.4</text>
<rect class="fi kf-growx" x="150" y="234.4" width="160" height="11.2"/>
<text class="txs" x="320" y="244" text-anchor="start">1.4 mm</text>
<rect class="fi kf-growx" x="400" y="237.2" width="160" height="5.6"/>
<text class="txs" x="570" y="244" text-anchor="start">0.7 mm</text>
</g>
<g class="kf-a kd8">
<text class="txb" x="30" y="283" text-anchor="start">2</text>
<rect class="fi kf-growx" x="150" y="270" width="160" height="16"/>
<text class="txs" x="320" y="282" text-anchor="start">2 mm</text>
<rect class="fi kf-growx" x="400" y="274" width="160" height="8"/>
<text class="txs" x="570" y="282" text-anchor="start">1 mm</text>
</g>
```

AS 1100.101 adds two constraints that link line width to reproduction. Clause 3.2.1 says the thickness of any line after reproduction must be not less than **0.18 mm**. Clause 3.3 says parallel lines must have a clear space between them of at least twice the thickness of the thicker line, with a minimum of **1 mm**, and that where groups of parallel lines cross, the space in each group should be at least 2 mm. It also recommends restricting a drawing to two line thicknesses and using only one thickness of dashed line.

## The running case: choosing the line group

This is an illustration. The housing drawing is on A3. The designer's CAD template, inherited from an older office, used the 0.5 group: 0.5 mm wide lines and 0.25 mm narrow lines. On screen and on an A3 print, it looked clean.

Chapter 2 showed that A3 drawings are often printed reduced to A4, a factor of 0.707. Applying that factor to the narrow lines:

**0.25 × 0.707 = 0.177 mm**

That is below the 0.18 mm minimum after reproduction in AS 1100.101. The narrow lines, which carry dimensions, hatching, thread roots and leaders, become the faintest marks on the page exactly when the print is smallest.

With the 0.7 group, the narrow lines reduce to **0.35 × 0.707 = 0.247 mm** and the wide lines to **0.7 × 0.707 = 0.495 mm**. Both stay above the minimum, and the 1 to 2 contrast between wide and narrow survives. The minimum clear space between parallel lines becomes **2 × 0.7 = 1.4 mm** on the full-size sheet, which the designer set as a snap spacing in the template.

```figure
type: svg
title: Narrow line width after reducing A3 to A4
alt: Narrow line width after reducing A3 to A4. 0.5 group narrow line, reduced: 0.177 mm. Minimum after reproduction: 0.18 mm. 0.7 group narrow line, reduced: 0.247 mm
caption: This is an illustration. AS 1100.101 clause 3.2.1 requires every line to be at least 0.18 mm thick after reproduction. The 0.5 group's narrow lines fall just short when an A3 drawing is reduced to A4.
viewbox: 0 0 640 163
body:
<g class="kf-a kd1">
<text class="txb" x="20" y="26">0.5 group narrow line, reduced</text>
<rect class="fp" x="20" y="33" width="470" height="18" rx="3"/>
<rect class="fi kf-growx" x="20" y="33" width="277.3" height="18" rx="3"/>
<text class="txb" x="500" y="47">0.177 mm</text>
</g>
<g class="kf-a kd2">
<text class="txb" x="20" y="75">Minimum after reproduction</text>
<rect class="fp" x="20" y="82" width="470" height="18" rx="3"/>
<rect class="fi kf-growx" x="20" y="82" width="282" height="18" rx="3"/>
<text class="txb" x="500" y="96">0.18 mm</text>
</g>
<g class="kf-a kd3">
<text class="txb" x="20" y="124">0.7 group narrow line, reduced</text>
<rect class="fp" x="20" y="131" width="470" height="18" rx="3"/>
<rect class="fa kf-growx" x="20" y="131" width="387" height="18" rx="3"/>
<text class="txa" x="500" y="145">0.247 mm</text>
</g>
```

## Lettering

AS 1100.101 Section 4 sets character heights from a preferred series: **2.5, 3.5, 5, 7, 10, 14 and 20 mm**. Its Table 4.1 recommends minimum heights by sheet size. For A1 to A4 sheets, the minimums are 5 mm for titles and drawing numbers, 3.5 mm for subtitles, headings and view or section designations, and 2.5 mm for general notes, parts lists and dimensions. For A0 sheets they are one step larger: 7, 5 and 3.5 mm. These minimums are for upper-case lettering; where upper and lower case are combined, the standard recommends one size larger.

Three further rules matter in practice:

- **Reduced height.** If a drawing will be reproduced at a reduced size, choose character heights that are still at least **1.7 mm** after reduction.
- **Stroke thickness.** The lines forming characters should be no thicker than **0.1h**, where h is the character height, and upper- and lower-case letters use the same stroke.
- **Tolerances.** Tolerance values are written at the same height as the dimension they apply to, not smaller.

AS 1100.101 also recommends simple characters without serifs, such as ISO 3098 Type B, and spacing between characters of about twice the stroke thickness. Numerals deserve the most care because, unlike words, they are read one by one and do not fall into recognisable patterns. A 3 that closes up into an 8, or a 1 that looks like a 7, changes a part, and no context will correct it. That is also why AS 1100.101 asks for a zero before a decimal point in values below one, such as 0.25, and for spaces rather than commas between groups of three digits: a misplaced or invisible decimal point is the most expensive character on a drawing.

### The housing's lettering

This is an illustration. On the A3 housing drawing, a 2.5 mm dimension height would reduce to **2.5 × 0.707 = 1.77 mm** on an A4 print. That just meets the 1.7 mm minimum, with almost no margin. The designer chose **3.5 mm** for dimensions and notes, which reduces to **2.47 mm**, and **5 mm** for view and section labels. The stroke thickness for 3.5 mm characters must not exceed 0.1 × 3.5 = 0.35 mm, which matches the narrow line of the 0.7 group, so the same pen width serves both.

Chapter 6 shows that character height also sets dimension line spacing: at 3.5 mm, the first dimension line sits at least 10.5 mm from the outline and later lines at least 7 mm apart. Larger text costs space, which is one reason the housing went on A3.

## Dashes, gaps and junctions

Dashed and chain lines carry meaning in their pattern as well as their width. AS 1100.101 clause 3.2.2 asks for dashes and gaps of consistent length and spacing, though they may be scaled to suit the length of the line and the size of the drawing. A hidden line whose dashes change length halfway across a view looks like two different lines.

The junctions matter as much as the pattern. AS 1100.101 asks for every hidden line to start and finish with a dash that touches the outline it meets, so that a reader can see exactly where the hidden edge starts. Centre lines should cross at the middle of their long dashes, so the centre point is a clear intersection rather than a gap. These details are small, but they are what lets a reader find the exact point a dimension refers to.

## Lines in CAD: meaning first, width second

In CAD, line types and widths are usually controlled by layers and plot styles. The common failure is to organise layers by the type of object, such as "holes" or "bracket", rather than by the meaning of the line. Then a hidden edge and a visible edge on the same object share a layer and a width, and the drawing loses the distinction the standard relies on.

A more robust approach is to create one layer per line meaning, matching the line types in this chapter, and to set the width through the plot style for each sheet size. The running case business keeps a single table that maps each line meaning to its ISO 128-24 number, its AS 1100.101 letter, its layer name and its width for the A3, A2 and A1 templates. When a new drafter joins, that table is the first thing they learn. The Library chapter on [controlling CAD output with plot style tables](/reados/collections/cad-drafting-and-drawing-standards/controlling-cad-output-with-plot-style-tables/) covers the software side.

The test of a line setup is a reduced print, not a screen. Before a template is adopted, print a sample drawing at the most common reduction, check that every line type is distinguishable at arm's length, and measure a narrow line with a magnifier if in doubt.

## When lines coincide

Lines often fall on top of each other: a centre line along a hidden edge, a cutting plane along a centre line, a visible edge along a projection line. AS 1100.101 clause 3.7 gives an order of priority so that the most important line is the one drawn:

```figure
type: svg
title: Order of priority for coincident lines, AS 1100.101 clause 3.7
alt: Order of priority for coincident lines, AS 1100.101 clause 3.7. 1. Visible outlines and edges. 2. Hidden outlines and edges. 3. Cutting planes. 4. Centre lines. 5. Centroidal lines. 6. Projection lines
caption: When two or more lines of different types coincide, draw the one highest in this list.
viewbox: 0 0 640 324
body:
<path class="la draw" pathLength="1" d="M34 48.5V71.5"/>
<path class="la draw" pathLength="1" d="M34 99.5V122.5"/>
<path class="la draw" pathLength="1" d="M34 150.5V173.5"/>
<path class="la draw" pathLength="1" d="M34 201.5V224.5"/>
<path class="la draw" pathLength="1" d="M34 252.5V275.5"/>
<g class="kf-a kd1">
<rect class="bxa" x="58" y="14" width="562" height="41" rx="6"/>
<circle class="fa" cx="34" cy="34.5" r="14"/>
<text class="txb" x="34" y="39.5" text-anchor="middle">1</text>
<text class="txb" x="74" y="36">Visible outlines and edges</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="58" y="65" width="562" height="41" rx="6"/>
<circle class="bxi" cx="34" cy="85.5" r="14"/>
<text class="txb" x="34" y="90.5" text-anchor="middle">2</text>
<text class="txb" x="74" y="87">Hidden outlines and edges</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="58" y="116" width="562" height="41" rx="6"/>
<circle class="bxi" cx="34" cy="136.5" r="14"/>
<text class="txb" x="34" y="141.5" text-anchor="middle">3</text>
<text class="txb" x="74" y="138">Cutting planes</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="58" y="167" width="562" height="41" rx="6"/>
<circle class="bxi" cx="34" cy="187.5" r="14"/>
<text class="txb" x="34" y="192.5" text-anchor="middle">4</text>
<text class="txb" x="74" y="189">Centre lines</text>
</g>
<g class="kf-a kd5">
<rect class="bx" x="58" y="218" width="562" height="41" rx="6"/>
<circle class="bxi" cx="34" cy="238.5" r="14"/>
<text class="txb" x="34" y="243.5" text-anchor="middle">5</text>
<text class="txb" x="74" y="240">Centroidal lines</text>
</g>
<g class="kf-a kd6">
<rect class="bx" x="58" y="269" width="562" height="41" rx="6"/>
<circle class="bxi" cx="34" cy="289.5" r="14"/>
<text class="txb" x="34" y="294.5" text-anchor="middle">6</text>
<text class="txb" x="74" y="291">Projection lines</text>
</g>
```

CAD systems do not apply this rule automatically. They draw every line on its layer, and the one plotted last often appears on top. A dashed hidden line plotted over a continuous visible edge can make the edge look broken. The fix is to check coincident lines deliberately during drawing review, particularly where a hole's centre line runs along an edge or where a section line follows a centre line, and to trim the lower-priority line where they overlap.

## The error: the hole that looked like a through hole

The first prints of the housing went to the machine shop at the 0.5 group, reduced to A4 by the shop's printer. The four M6 tapped holes in the rear face are blind: drilled and tapped to a set depth, leaving material behind them. In the side view, their depth was shown by narrow dashed lines, and the thread note gave the depth.

On the faint reduced print, the dashed lines were barely visible, and the programmer, working quickly from the end view, read the holes as through holes and programmed them that way. The drill broke through into the bearing bore. The first part was scrap.

The cause was a combination: hidden lines too faint to see on a reduced print, and a programmer who did not cross-check the note. The business found the cause by laying a fresh A3 print beside the shop's reduced print. Three corrections followed: the template moved to the 0.7 group; the section through the housing was rearranged so that a tapped hole is cut by the section and shown in visible lines rather than hidden ones (Chapter 5); and the thread note was made explicit about depth. Each correction alone might have been enough; together they made the error very hard to repeat.

## Exercise: an A1 assembly reduced to A3

An assembly drawing is prepared on A1 and will usually be printed on A3, a reduction of 297 ÷ 594 = 0.5. Choose a line group and character heights that meet AS 1100.101's minimums after reduction.

**Worked answer.** The reduction factor is **0.5**. For lines to stay at or above **0.18 mm** after reduction, the narrow line on the A1 original must be at least **0.18 ÷ 0.5 = 0.36 mm**. In AS ISO 128.24's groups, the 0.7 group's narrow line is 0.35 mm, which reduces to 0.175 mm, just short. The **1 group**, with 1 mm wide and 0.5 mm narrow lines, reduces to 0.5 mm and 0.25 mm, which meets the minimum.

For characters to stay at or above **1.7 mm** after reduction, the original height must be at least **1.7 ÷ 0.5 = 3.4 mm**, so the smallest usable preferred height is **3.5 mm**, reducing to 1.75 mm. For more margin, 5 mm dimensions reduce to 2.5 mm. Titles at 10 mm reduce to 5 mm. Table 4.1's minimums for A1 (5, 3.5 and 2.5 mm) are met by these choices on the original. The lesson is the same as for the housing: choose line group and lettering for the print people will actually read, not for the sheet the drawing was made on.
