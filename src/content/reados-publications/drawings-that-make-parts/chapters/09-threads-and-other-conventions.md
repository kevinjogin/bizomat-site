---
book: drawings-that-make-parts
chapterSlug: threads-and-other-conventions
order: 9
title: "Threads, centre holes, seals and other conventions"
description: "Represent screw threads, repeated features, centre holes, springs, gears, bearings, seals and knurling by AS 1100 conventions, and specify them by standard rather than by drawing."
draft: false
---

Some features would take hours to draw exactly and would be no clearer for it. A screw thread is a helix; a gear has dozens of involute teeth; a spring has coils whose projection is a series of curves; a knurl is a mesh of fine ridges. Drawing them faithfully adds lines without adding information, because the feature is fully defined by a designation or a data table. The AS 1100 standards replace these features with conventions: simplified drawings or symbols that tell the reader what the feature is, while the specification says exactly what it must be.

This chapter covers the conventions most often met on mechanical drawings, using the running case housing and its assembly. Its error case is a tapped hole drawn with its lines the wrong way round.

## Simplified drawings and symbols

AS 1100.101 clause 9.2 distinguishes two kinds of conventional representation. A **simplified drawing** is drawn to scale, and dimensions or other details may be added to it directly or through a table. A **symbol** has no relationship between its size and the size of the feature; a cross representing a rivet is an example. The reader must know which is which, and a note or the standard's convention tells them.

Clause 9.3.1 adds the convention for **repeated features**: where identical features such as holes or slots repeat in a regular pattern, one or more can be drawn in full and the remainder shown by their centre lines alone. Similar parts in an assembly may be treated the same way. The housing's four flange holes are drawn once in full and three times as centre-line crosses, with "4 ×" in front of the size telling the reader how many there are.

## Screw threads

AS 1100.101 clause 9.3.2 says screw threads are specified by the relevant standard and represented by convention. The convention relies on the two line widths from Chapter 3, so that crests and roots can be told apart:

```figure
type: svg
title: Representing screw threads, AS 1100.101 clause 9.3.2
alt: Representing screw threads, AS 1100.101 clause 9.3.2. End view: Crests full circle, Type A; Roots arc of a circle, Type B, with a gap of about 30° to 45°; Other lines none. Side view, external thread: Crests straight lines, Type A; Roots straight lines, Type B, for the full thread length; Other lines runout, if shown, Type B at 30° to the axis. Side view, internal thread in section: Crests straight lines, Type A; Roots straight lines, Type B, for the full thread length; Other lines runout, if shown, at 30° to the axis. Side view, internal thread not sectioned: Crests hidden lines; Roots hidden lines; Other lines runout, if shown, as hidden lines at 30°
caption: Summarised from AS 1100.101-1992. Type A is a wide continuous line, Type B narrow continuous, and the hidden-line types are dashed. The same conventions apply to all thread forms; a thread other than a V-form also needs a section or detail showing its form.
viewbox: 0 0 640 290
- End view | Crests: full circle, Type A; Roots: arc of a circle, Type B, with a gap of about 30° to 45°; Other lines: none
- Side view, external thread | Crests: straight lines, Type A; Roots: straight lines, Type B, for the full thread length; Other lines: runout, if shown, Type B at 30° to the axis
- Side view, internal thread in section | Crests: straight lines, Type A; Roots: straight lines, Type B, for the full thread length; Other lines: runout, if shown, at 30° to the axis
- Side view, internal thread not sectioned | Crests: hidden lines; Roots: hidden lines; Other lines: runout, if shown, as hidden lines at 30°
body:
<g class="kf-a kd1">
<circle class="li" cx="100" cy="120" r="50"/>
<path class="ln draw" pathLength="1" d="M113.7 82.4A40 40 0 1 1 86.3 82.4"/>
<path class="cl" d="M30 120H170M100 50V190"/>
<text class="txb" x="100" y="215" text-anchor="middle">End view</text>
<text class="txs" x="100" y="232" text-anchor="middle">crest: full wide circle;</text>
<text class="txs" x="100" y="248" text-anchor="middle">root: narrow arc with a 30°</text>
<text class="txs" x="100" y="264" text-anchor="middle">to 45° gap</text>
</g>
<g class="kf-a kd2">
<rect class="li" x="210" y="80" width="170" height="80"/>
<path class="ln" d="M210 92H340M210 148H340"/>
<path class="li" d="M340 80V160"/>
<path class="ln" d="M340 92l14 -10M340 148l14 10"/>
<path class="cl" d="M196 120H394"/>
<text class="txb" x="295" y="215" text-anchor="middle">External thread, side view</text>
<text class="txs" x="295" y="232" text-anchor="middle">crests wide outside, roots</text>
<text class="txs" x="295" y="248" text-anchor="middle">narrow inside; wide line at the</text>
<text class="txs" x="295" y="264" text-anchor="middle">limit of full thread; runout at</text>
<text class="txs" x="295" y="280" text-anchor="middle">30°</text>
</g>
<g class="kf-a kd3">
<clipPath id="{id}-c1">
<path d="M430 80H600V160H430V136H560V104H430Z"/>
</clipPath>
<g clip-path="url(#{id}-c1)">
<path class="ln" d="M350 160L430 80"/>
<path class="ln" d="M362 160L442 80"/>
<path class="ln" d="M374 160L454 80"/>
<path class="ln" d="M386 160L466 80"/>
<path class="ln" d="M398 160L478 80"/>
<path class="ln" d="M410 160L490 80"/>
<path class="ln" d="M422 160L502 80"/>
<path class="ln" d="M434 160L514 80"/>
<path class="ln" d="M446 160L526 80"/>
<path class="ln" d="M458 160L538 80"/>
<path class="ln" d="M470 160L550 80"/>
<path class="ln" d="M482 160L562 80"/>
<path class="ln" d="M494 160L574 80"/>
<path class="ln" d="M506 160L586 80"/>
<path class="ln" d="M518 160L598 80"/>
<path class="ln" d="M530 160L610 80"/>
<path class="ln" d="M542 160L622 80"/>
<path class="ln" d="M554 160L634 80"/>
<path class="ln" d="M566 160L646 80"/>
<path class="ln" d="M578 160L658 80"/>
<path class="ln" d="M590 160L670 80"/>
<path class="ln" d="M602 160L682 80"/>
<path class="ln" d="M614 160L694 80"/>
<path class="ln" d="M626 160L706 80"/>
</g>
<rect class="bxa" x="430" y="80" width="170" height="80"/>
<path class="li" d="M430 104H560M430 136H560"/>
<path class="ln" d="M430 96H560M430 144H560"/>
<path class="li" d="M560 96V144"/>
<path class="cl" d="M416 120H614"/>
<text class="txa" x="515" y="215" text-anchor="middle">Internal thread in section</text>
<text class="txs" x="515" y="232" text-anchor="middle">crests (minor diameter) wide,</text>
<text class="txs" x="515" y="248" text-anchor="middle">roots narrow; if not sectioned,</text>
<text class="txs" x="515" y="264" text-anchor="middle">both are hidden lines</text>
</g>
```

The limit of useful thread length is shown by a wide line across the major diameter if it is visible, or a hidden line if it is hidden. The key idea is that the crest line is always wide and the root line always narrow. On an external thread, the crest is the outside diameter, so the wide line is outside. On an internal thread, the crest is the inside, at the minor diameter, so in a section the wide line is inside and the narrow line outside. A reader can tell an external thread from an internal one at a glance, provided the drawing follows the convention.

### Specifying the thread

The drawing shows that a feature is threaded; the designation says which thread. The housing's tapped holes are designated by the metric thread size, M6, with the thread depth and the drill depth given separately, so that the machinist knows how deep to drill and how deep to tap. The lubrication hole is M8 × 1, where the "× 1" states the fine pitch; a designation without a pitch normally means the coarse pitch for that size. AS 1100.101 tells the reader to take fastener dimensions, such as hexagon sizes, from the relevant fastener standard rather than from the drawing.

This is an illustration. The housing's tapped holes are specified as four M6 holes, thread depth 12 mm, drill depth 15 mm, on a Ø78 pitch circle. The 3 mm difference between drill depth and thread depth leaves room for the drill point and the tap's lead, so that the full thread length is achieved without the tap bottoming. The rear wall behind the holes is thick enough that the drill point does not break into the bearing bore, which was the lesson of Chapter 3's error.

### Modelled threads and drawn threads

CAD systems can model a thread as a true helix, and some designers do, especially for parts that will be 3D printed or rendered. For a machined part, a modelled thread usually adds nothing and costs something: the model becomes heavier, the drawing views generated from it show a tangle of helical edges instead of the clean convention, and a measurement taken from the model may land on a crest or a root by chance. Most CAD systems offer a cosmetic thread, which stores the designation and depth as data and draws the convention on the sheet. That is usually the right choice: the drawing shows the convention the standard asks for, and the thread data travels with the model for anyone programming the part.

Whichever method is used, the drawing must show the convention correctly and the designation completely. A drawing view generated automatically should be checked against the convention, not trusted because the software produced it. The tapped-hole error below came from a manually inserted block, but automatically generated views can be just as wrong if the thread feature was defined as the wrong type.

## Centre holes

Turned parts such as the pump shaft are often held between centres, which needs centre holes in the shaft ends. AS 1100.201 Section 5 provides symbols and a designation. The symbols tell the machinist whether centre holes are required on the finished part, permitted to remain or not permitted; where a centre hole may remain, no symbol is needed. The designation consists of a reference to AS 1913, a letter giving the centre drill type, A, B or R, the pilot diameter and the outside countersink diameter, with the two diameters separated by a slash. The sizes come from AS 1913, not from the drawing, so the designation is all the machinist needs.

On the shaft drawing, the designer required centre holes at both ends, designated to AS 1913, because the shaft will be ground between centres and later reground if it wears. A part that must not carry centre holes, such as a shaft end that seats against a face, gets the "not permitted" symbol, which warns the machinist to hold it another way.

## Springs, gears, bearings, seals and knurling

AS 1100.201 gives conventions for several more feature types:

```figure
type: svg
title: Further conventions in AS 1100.201
alt: Further conventions in AS 1100.201. Springs, Section 7. Drawn in conventional representation: with the essential data in a table on the drawing or on a separate data sheet. Leaf springs: number of leaves, leaf dimensions, load and deflection, material, tests, process, accuracy, finish, identification. Gears, Section 8. Teeth not normally drawn: tooth data on the drawing or a data sheet, with terms to AS 2075. Rolling element bearings, Section 10. Two methods: depending on how much detail is needed. Seals, Section 11. General representation: a square with a freestanding diagonal cross centred in it, not touching the outline. Knurling, Section 12. A few narrow lines on the cylindrical feature: with the knurl specified in a note
caption: Summarised from AS 1100.201-1992 Sections 7, 8 and 10 to 12. In each case the convention shows the feature; data on the drawing or a data sheet specifies it.
viewbox: 0 0 640 615
body:
<path class="ln draw" pathLength="1" d="M34 47V82H54"/>
<path class="ln draw" pathLength="1" d="M34 47V152H54"/>
<path class="ln draw" pathLength="1" d="M34 230V264H54"/>
<path class="ln draw" pathLength="1" d="M34 352V377.5H54"/>
<path class="ln draw" pathLength="1" d="M34 438V472H54"/>
<path class="ln draw" pathLength="1" d="M34 541V576H54"/>
<g class="kf-a kd1">
<rect class="bxi" x="20" y="12" width="600" height="35" rx="6"/>
<text class="txb" x="32" y="33">Springs, Section 7</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="54" y="55" width="566" height="54" rx="6"/>
<text class="txb" x="66" y="76">Drawn in conventional</text>
<text class="txb" x="66" y="95">representation</text>
<text class="tx" x="304" y="76">with the essential data in a table on the</text>
<text class="tx" x="304" y="94">drawing or on a separate data sheet</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="54" y="117" width="566" height="70" rx="6"/>
<text class="txb" x="66" y="138">Leaf springs</text>
<text class="tx" x="304" y="138">number of leaves, leaf dimensions, load and</text>
<text class="tx" x="304" y="156">deflection, material, tests, process,</text>
<text class="tx" x="304" y="174">accuracy, finish, identification</text>
</g>
<g class="kf-a kd4">
<rect class="bxi" x="20" y="195" width="600" height="35" rx="6"/>
<text class="txb" x="32" y="216">Gears, Section 8</text>
</g>
<g class="kf-a kd5">
<rect class="bx" x="54" y="238" width="566" height="52" rx="6"/>
<text class="txb" x="66" y="259">Teeth not normally drawn</text>
<text class="tx" x="304" y="259">tooth data on the drawing or a data sheet,</text>
<text class="tx" x="304" y="277">with terms to AS 2075</text>
</g>
<g class="kf-a kd6">
<rect class="bxi" x="20" y="298" width="600" height="54" rx="6"/>
<text class="txb" x="32" y="319">Rolling element bearings,</text>
<text class="txb" x="32" y="338">Section 10</text>
</g>
<g class="kf-a kd7">
<rect class="bx" x="54" y="360" width="566" height="35" rx="6"/>
<text class="txb" x="66" y="381">Two methods</text>
<text class="tx" x="304" y="381">depending on how much detail is needed</text>
</g>
<g class="kf-a kd8">
<rect class="bxi" x="20" y="403" width="600" height="35" rx="6"/>
<text class="txb" x="32" y="424">Seals, Section 11</text>
</g>
<g class="kf-a kd9">
<rect class="bxa" x="54" y="446" width="566" height="52" rx="6"/>
<text class="txb" x="66" y="467">General representation</text>
<text class="tx" x="304" y="467">a square with a freestanding diagonal cross</text>
<text class="tx" x="304" y="485">centred in it, not touching the outline</text>
</g>
<g class="kf-a kd10">
<rect class="bxi" x="20" y="506" width="600" height="35" rx="6"/>
<text class="txb" x="32" y="527">Knurling, Section 12</text>
</g>
<g class="kf-a kd11">
<rect class="bx" x="54" y="549" width="566" height="54" rx="6"/>
<text class="txb" x="66" y="570">A few narrow lines on the</text>
<text class="txb" x="66" y="589">cylindrical feature</text>
<text class="tx" x="304" y="570">with the knurl specified in a note</text>
</g>
```

The pattern is the same in each case. The convention keeps the drawing readable; the specification, in a note, a table or a data sheet, carries the information the maker needs. A gear drawn without its tooth data, or a spring drawn without its load and deflection requirements, is a picture, not a specification.

The data sheet approach suits parts made by specialist suppliers. A spring maker or gear cutter works from a standard set of data: wire size, coil count, free length and load at a given length for a spring; module, number of teeth, pressure angle, helix angle, profile shift and accuracy grade for a gear. Putting that data in a consistent table on the drawing, or on an attached data sheet referenced from it, lets the supplier check it quickly and quote with confidence. AS 1100.201 lists the particulars that may be needed for each spring type and points to AS 2075 for gear terms, which helps make sure the table uses words the supplier recognises.

### The cartridge assembly

This is an illustration. On the bearing cartridge assembly drawing, the bearing is shown in a simplified form, since its internal detail is the bearing maker's business. The lip seal in the end cap is shown by the general seal convention: a square with a diagonal cross centred in it, not touching the outline. The cap screws are drawn in simplified form in the section, unhatched as Chapter 5 requires, and listed in the parts list with their full designation. A reader can see what each item is and where it sits; the parts list and the referenced standards say exactly what to buy.

## The error: a tapped hole drawn as a stud

On the first issue of the housing drawing, the drafter drew the tapped holes in section A-A by copying a thread block from the business's library. The block had been made for external threads. In the section, it showed a wide line at the outer diameter and a narrow line at the inner diameter: the external thread convention.

For an internal thread shown in section, AS 1100.101 puts the wide line at the crest, which for a tapped hole is the minor diameter, the size of the drilled hole, and the narrow line at the root, the major diameter. The copied block put the wide line at 6 mm and the narrow line inside it. Read by the convention, it said the drilled hole was 6 mm and the thread roots lay inside the hole, which is impossible.

The programmer noticed that the picture contradicted the "M6" designation and queried it before cutting metal. The query cost a day. A less careful reader who trusted the picture might have drilled 6 mm holes, which cannot then be tapped M6 because there is no material left for the thread.

The correction was to replace the library block with one following AS 1100.101 for internal threads in section, with the wide line at the minor diameter and the narrow line at the major, and to separate the library into clearly named internal and external thread blocks. The drawing check in Chapter 10 now includes a specific line: "threads drawn by the internal or external convention to match the designation".

## Welds and pipework

Two more families of convention appear on mechanical drawings, and both are covered by standards outside this book's supplied sources. AS 1100.201 refers readers to AS 1101.3 for welding symbols and how to apply them, which was not read for this book; a fabricated part should carry weld symbols to that standard, or to the standard the contract names, rather than notes such as "weld all round" that leave the size and type of weld to the welder. AS 1100.201 Section 6 gives a simplified representation of pipelines in orthogonal and isometric projection, in which pipes are drawn as single lines and fittings and valves as symbols. Both conventions follow the same principle as threads and gears: show the feature simply and specify it exactly.

```figure
type: svg
title: Convention check on the housing and cartridge drawings
alt: Convention check on the housing and cartridge drawings. Done: Threads drawn by the internal or external convention to match the designation. Done: Thread depth and drill depth both given for blind tapped holes. Done: Repeated features shown once in full, the rest by centre lines, with the count stated. Done: Centre hole symbols on turned parts: required, permitted or not permitted. Done: Bearings, seals and screws in the assembly shown conventionally and fully specified in the parts list. Open: Weld symbols to the named standard on any fabricated part
caption: This is an illustration of the lines added to the business's drawing checklist after the tapped-hole error.
viewbox: 0 0 640 374
body:
<g class="kf-a kd1">
<rect class="bx" x="20" y="12" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="29" r="11"/>
<path class="la draw" pathLength="1" d="M34 29l4 4 8-8"/>
<text class="txb" x="64" y="32">Threads drawn by the internal or external convention to match the</text>
<text class="txb" x="64" y="51">designation</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="20" y="78" width="600" height="39" rx="6"/>
<circle class="bxa" cx="40" cy="95" r="11"/>
<path class="la draw" pathLength="1" d="M34 95l4 4 8-8"/>
<text class="txb" x="64" y="98">Thread depth and drill depth both given for blind tapped holes</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="20" y="125" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="142" r="11"/>
<path class="la draw" pathLength="1" d="M34 142l4 4 8-8"/>
<text class="txb" x="64" y="145">Repeated features shown once in full, the rest by centre lines,</text>
<text class="txb" x="64" y="164">with the count stated</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="20" y="191" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="208" r="11"/>
<path class="la draw" pathLength="1" d="M34 208l4 4 8-8"/>
<text class="txb" x="64" y="211">Centre hole symbols on turned parts: required, permitted or not</text>
<text class="txb" x="64" y="230">permitted</text>
</g>
<g class="kf-a kd5">
<rect class="bx" x="20" y="257" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="274" r="11"/>
<path class="la draw" pathLength="1" d="M34 274l4 4 8-8"/>
<text class="txb" x="64" y="277">Bearings, seals and screws in the assembly shown conventionally</text>
<text class="txb" x="64" y="296">and fully specified in the parts list</text>
</g>
<g class="kf-a kd6">
<rect class="bxi" x="20" y="323" width="600" height="39" rx="6"/>
<circle class="bxi" cx="40" cy="340" r="11"/>
<text class="txa" x="40" y="345" text-anchor="middle">?</text>
<text class="txb" x="64" y="343">Weld symbols to the named standard on any fabricated part</text>
</g>
```

## Conventions and the parts list

Conventional representation shifts information from the views to text: designations, notes, tables and parts lists. That makes the text as important as the lines. On an assembly drawing, the parts list in AS 1100.101 clause 2.5.11 is where bought-out items are fully specified: item number, description, quantity, material or specification, the drawing number of each detailed part and any stores reference. A bearing, seal or screw that is drawn conventionally but listed only as "bearing" or "seal" leaves the buyer to guess.

## Reading conventions on unfamiliar drawings

Drawings from other countries, older drawings and drawings from other disciplines sometimes use conventions that differ in detail: a different gap in the thread root arc, a different seal symbol, or a pipe symbol from another standard. The safe approach is the one used throughout this book: identify the standard the drawing states, read it by that standard's conventions, and ask when the standard is not stated or the convention is unfamiliar. A convention misread is a specification misread, however carefully the rest of the drawing was prepared.

## Exercise: represent the shaft end

The pump shaft has an external thread M16 × 1.5 on one end for a locknut, 25 mm of full thread, a thread runout, a keyway nearby and centre holes at both ends. Describe how each feature should be represented and specified on the shaft drawing.

**Worked answer.**
- **The thread** is drawn in the side view with wide crest lines at the 16 mm outside diameter and narrow root lines inside them for the 25 mm of full thread, a wide line across the major diameter at the limit of useful thread, and, if wanted, narrow runout lines at 30° to the axis. In an end view, the crest is a full wide circle and the root a narrow arc with a gap of about 30° to 45°. It is designated **M16 × 1.5**, with the full thread length dimensioned.
- **The keyway** is dimensioned by one of the methods AS 1100.201 clause 2.1.4 points to, with its width, depth and length, and a section through it if the depth is not otherwise clear.
- **The centre holes** carry the AS 1100.201 symbol for "required" at both ends, with a designation referring to AS 1913, the drill type and the pilot and countersink diameters from that standard.

Each feature is shown conventionally and specified by designation, so the drawing stays readable and the maker takes exact values from the standards the designations name.
