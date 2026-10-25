---
book: drawings-that-make-parts
chapterSlug: sections
order: 5
title: "Sections that show the inside clearly"
description: "Place cutting planes, hatch cut surfaces and choose full, half, part, revolved and removed sections, following AS 1100.101, so the inside of a part reads without hidden lines."
draft: false
---

Most of the important features of a machined part are inside it: bores, shoulders, grooves, tapped holes, internal passages. In an ordinary view they appear as hidden lines, which are hard to read and easy to misinterpret. A section cuts the part open on paper and shows those features as visible outlines, with the cut surfaces hatched so that the reader can see what is solid and what is space.

This chapter applies AS 1100.101 Section 7 to the running case housing and its assembly. It covers cutting planes, hatching, the kinds of section, and the conventions for parts that are not hatched. Its error case is a hatching pattern that made a solid housing look like two parts.

## Cutting planes

A section starts with a cutting plane, shown on an adjacent view. AS 1100.101 clause 7.2 sets out how:

- Place the plane so that it cuts through the part's main features, preferably shown on an outside view rather than on another section.
- Draw it with a Type H line (in ISO numbering, a long-dashed dotted line, wide where it marks the plane's ends and changes of direction) across the whole part.
- Show the viewing direction with arrowheads, and place the identifying letters at the tails of the arrows.

The standard allows simplifications where clarity is not lost. If the plane lies on a main plane of symmetry, the centre line alone may serve as its indication. Where only one cutting plane appears on a drawing, its letters may be omitted. Where the sections are symmetrical or drawn in correct projection, the arrowheads may be omitted. Each section is titled below the view, for example "SECTION A-A", using the same letters as the cutting plane.

## Hatching

Hatching marks the surfaces the cutting plane passes through. Clause 7.3 sets the rules for mechanical drawings:

```figure
type: svg
title: Hatching rules from AS 1100.101 clause 7.3
alt: Hatching rules from AS 1100.101 clause 7.3. Done: Equally spaced narrow continuous lines at about 45° to the sheet edges, another angle if 45° would run parallel to an outline. Done: Spacing suited to the area; wide spacing preferred where clarity allows. Done: Every cut area of the same part hatched at the same angle and spacing. Done: Adjacent parts hatched at different angles, normally at right angles to each other. Done: More than two adjacent parts distinguished by spacing or by other angles. Done: Thin cut areas, such as gaskets and sheet metal, filled solid, with at least 1 mm between adjacent solid areas. Done: Hatching interrupted around dimensions and lettering, and continuous across offset or curved cutting planes
caption: Summarised from AS 1100.101-1992. Material-specific hatching for architectural and structural drawings is in AS 1100.301 and AS 1100.501, not in mechanical practice.
viewbox: 0 0 640 498
body:
<g class="kf-a kd1">
<rect class="bx" x="20" y="12" width="600" height="78" rx="6"/>
<circle class="bxa" cx="40" cy="29" r="11"/>
<path class="la draw" pathLength="1" d="M34 29l4 4 8-8"/>
<text class="txb" x="64" y="32">Equally spaced narrow continuous lines at about 45° to the sheet</text>
<text class="txb" x="64" y="51">edges</text>
<text class="tx" x="64" y="72">another angle if 45° would run parallel to an outline</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="20" y="98" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="115" r="11"/>
<path class="la draw" pathLength="1" d="M34 115l4 4 8-8"/>
<text class="txb" x="64" y="118">Spacing suited to the area; wide spacing preferred where clarity</text>
<text class="txb" x="64" y="137">allows</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="20" y="164" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="181" r="11"/>
<path class="la draw" pathLength="1" d="M34 181l4 4 8-8"/>
<text class="txb" x="64" y="184">Every cut area of the same part hatched at the same angle and</text>
<text class="txb" x="64" y="203">spacing</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="20" y="230" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="247" r="11"/>
<path class="la draw" pathLength="1" d="M34 247l4 4 8-8"/>
<text class="txb" x="64" y="250">Adjacent parts hatched at different angles, normally at right</text>
<text class="txb" x="64" y="269">angles to each other</text>
</g>
<g class="kf-a kd5">
<rect class="bx" x="20" y="296" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="313" r="11"/>
<path class="la draw" pathLength="1" d="M34 313l4 4 8-8"/>
<text class="txb" x="64" y="316">More than two adjacent parts distinguished by spacing or by other</text>
<text class="txb" x="64" y="335">angles</text>
</g>
<g class="kf-a kd6">
<rect class="bx" x="20" y="362" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="379" r="11"/>
<path class="la draw" pathLength="1" d="M34 379l4 4 8-8"/>
<text class="txb" x="64" y="382">Thin cut areas, such as gaskets and sheet metal, filled solid,</text>
<text class="txb" x="64" y="401">with at least 1 mm between adjacent solid areas</text>
</g>
<g class="kf-a kd7">
<rect class="bx" x="20" y="428" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="445" r="11"/>
<path class="la draw" pathLength="1" d="M34 445l4 4 8-8"/>
<text class="txb" x="64" y="448">Hatching interrupted around dimensions and lettering, and</text>
<text class="txb" x="64" y="467">continuous across offset or curved cutting planes</text>
</g>
```

Two rules do most of the work. Same part, same hatching: a reader sees one hatching pattern and knows it is one piece of material, however many separate regions the section cuts. Adjacent parts, different hatching: a change of angle at a boundary tells the reader the material changes there. When the hatching breaks either rule, the reader draws the wrong conclusion about what is one part and what is two.

## Parts that are not hatched

Some elements are shown in full outline even when the cutting plane passes through them. AS 1100.101 clause 7.4.9 lists two groups.

**Fastening and solid elements.** Where the cutting plane runs along the centre line of bolts, pins, rivets, keys, washers, nuts and screws, or of shafts, rods and ball and roller bearings, these are not sectioned but drawn in full outline. Cutting a bolt lengthwise adds hatching and tells the reader nothing new; showing it whole makes it instantly recognisable. The same logic applies to bearings: their rolling elements and rings are bought complete, so the assembly drawing needs to show where they sit, not what is inside them.

**Relatively thin elements.** Where the cutting plane passes along a web, rib, lug or spoke, its outline may be drawn without hatching to avoid a false impression of solidity. Alternatively, the hatching across the thin element may be double-spaced, with the boundary between thin and thick shown as a hidden outline. Where a section does not cut a spoke or rib that lies at an angle, the oblique spoke should be drawn as though it were on the cutting plane.

Clause 7.4.9.3 adds a related convention: holes in circular parts may be shown in a section even if they are not on the cutting plane, at their true radius from the centre instead of their foreshortened position. This lets a single section show a hole pattern's depth and diameter without an extra view. The end view still shows the true angular positions of the holes.

## Kinds of section

```figure
type: svg
title: Kinds of section and when to use them
alt: Kinds of section and when to use them. Full section: What it shows the whole part cut by one plane; Typical use turned parts, housings, castings with internal features. Half section: What it shows one half in section, the other in outside view; Typical use symmetrical parts where the outside also matters. Part (broken-out) section: What it shows a local area cut away, bounded by a freehand or zigzag line; Typical use one internal feature in an otherwise external view. Revolved section: What it shows the cross-section turned into the view, outlined in narrow lines; Typical use the shape of an arm, rib or bar. Removed section: What it shows the cross-section drawn away from the view and labelled; Typical use long parts with changing cross-sections. Offset or aligned section: What it shows a cutting plane that steps or turns to pass through several features; Typical use holes and features not on one plane
caption: Based on AS 1100.101 Section 7 and common practice. The running case uses a full section for the housing and a full section with unhatched elements for the assembly.
viewbox: 0 0 640 409
body:
<g class="kf-a kd1">
<rect class="fs" x="20" y="10" width="600" height="33" rx="4"/>
<text class="txb" x="185.5" y="31">What it shows</text>
<text class="txb" x="416.1" y="31">Typical use</text>
</g>
<g class="kf-a kd2">
<rect class="bxa" x="20" y="43" width="600" height="68" rx="4"/>
<path class="lf" d="M20 111H620"/>
<text class="txb" x="28" y="64">Full section</text>
<text class="tx" x="185.5" y="64">the whole part cut by one</text>
<text class="tx" x="185.5" y="82">plane</text>
<text class="tx" x="416.1" y="64">turned parts, housings,</text>
<text class="tx" x="416.1" y="82">castings with internal</text>
<text class="tx" x="416.1" y="100">features</text>
</g>
<g class="kf-a kd3">
<path class="lf" d="M20 161H620"/>
<text class="txb" x="28" y="132">Half section</text>
<text class="tx" x="185.5" y="132">one half in section, the other</text>
<text class="tx" x="185.5" y="150">in outside view</text>
<text class="tx" x="416.1" y="132">symmetrical parts where the</text>
<text class="tx" x="416.1" y="150">outside also matters</text>
</g>
<g class="kf-a kd4">
<path class="lf" d="M20 213H620"/>
<text class="txb" x="28" y="182">Part (broken-out)</text>
<text class="txb" x="28" y="201">section</text>
<text class="tx" x="185.5" y="182">a local area cut away, bounded</text>
<text class="tx" x="185.5" y="200">by a freehand or zigzag line</text>
<text class="tx" x="416.1" y="182">one internal feature in an</text>
<text class="tx" x="416.1" y="200">otherwise external view</text>
</g>
<g class="kf-a kd5">
<path class="lf" d="M20 281H620"/>
<text class="txb" x="28" y="234">Revolved section</text>
<text class="tx" x="185.5" y="234">the cross-section turned into</text>
<text class="tx" x="185.5" y="252">the view, outlined in narrow</text>
<text class="tx" x="185.5" y="270">lines</text>
<text class="tx" x="416.1" y="234">the shape of an arm, rib or</text>
<text class="tx" x="416.1" y="252">bar</text>
</g>
<g class="kf-a kd6">
<path class="lf" d="M20 331H620"/>
<text class="txb" x="28" y="302">Removed section</text>
<text class="tx" x="185.5" y="302">the cross-section drawn away</text>
<text class="tx" x="185.5" y="320">from the view and labelled</text>
<text class="tx" x="416.1" y="302">long parts with changing</text>
<text class="tx" x="416.1" y="320">cross-sections</text>
</g>
<g class="kf-a kd7">
<path class="lf" d="M20 399H620"/>
<text class="txb" x="28" y="352">Offset or aligned</text>
<text class="txb" x="28" y="371">section</text>
<text class="tx" x="185.5" y="352">a cutting plane that steps or</text>
<text class="tx" x="185.5" y="370">turns to pass through several</text>
<text class="tx" x="185.5" y="388">features</text>
<text class="tx" x="416.1" y="352">holes and features not on</text>
<text class="tx" x="416.1" y="370">one plane</text>
</g>
<rect class="lf" x="20" y="10" width="600" height="389" rx="4" fill="none"/>
<path class="lf" d="M177.5 10V399"/>
<path class="lf" d="M408.1 10V399"/>
```

Removed sections are useful when space is short. AS 1100.101 allows successive sections along a part to be drawn as removed sections if they cannot be arranged in normal projection. Each must still be labelled with its cutting plane letters.

## The running case: section A-A of the housing

This is an illustration. Chapter 4 replaced the housing's side view with a full section A-A through the axis. The designer placed the cutting plane on the front view of the flange end, passing vertically through the centre.

That plane cuts the flange through the top and bottom flange holes, which are at 12 and 6 o'clock. It does not pass through the rear tapped holes, which are at 45°. Rather than add an offset cutting plane, the designer used the convention in clause 7.4.9.3: one tapped hole is shown in the section at its true pitch radius of 39 mm (half of the 78 mm pitch circle), rotated into the plane. The section then shows, in visible lines:

- the bore and its shoulder;
- the spigot and its face;
- a flange hole through the 12 mm flange;
- a tapped hole with its thread length and drilled depth.

Because the section is symmetrical about the axis and drawn in correct projection, the arrowheads could have been omitted. The designer kept them, with the letters A at each end, because the drawing also carries an enlarged detail and a partial view, and explicit labelling avoided any doubt about which view was which.

## The assembly section

On the bearing cartridge's assembly drawing, a full section through the axis cuts the housing, the end cap, the bearing, the shaft, the lip seal and two cap screws. Following clause 7.4.9.1, the shaft, the bearing and the screws are drawn in full outline, not hatched. The housing is hatched at 45° one way and the end cap at 45° the other way, so their boundary is obvious. The paper gasket between them, too thin to hatch at full size, is filled solid. The lip seal is drawn in a simplified way, as Chapter 9 describes.

```figure
type: svg
title: What is hatched in the cartridge assembly section
alt: What is hatched in the cartridge assembly section. Housing, hatched at 45° (one pattern for every cut area of the part). End cap, hatched at 45° the other way (at right angles to the housing). Gasket, filled solid (too thin to hatch; at least 1 mm gap to any other solid area). Shaft, bearing, cap screws, full outline, not hatched (solid elements on the cutting plane)
caption: This is an illustration, following AS 1100.101 clauses 7.3 and 7.4.9.
viewbox: 0 0 640 345
- Housing | hatched at 45°; one pattern for every cut area of the part
- End cap | hatched at 45° the other way; at right angles to the housing
- Gasket | filled solid; too thin to hatch; at least 1 mm gap to any other solid area
- Shaft, bearing, cap screws | full outline, not hatched; solid elements on the cutting plane
body:
<g class="kf-a kd1">
<clipPath id="{id}-h">
<path d="M120 40H300V100H120ZM120 180H300V240H120Z"/>
</clipPath>
<g clip-path="url(#{id}-h)">
<path class="ln" d="M-300 260L-60 20"/>
<path class="ln" d="M-290 260L-50 20"/>
<path class="ln" d="M-280 260L-40 20"/>
<path class="ln" d="M-270 260L-30 20"/>
<path class="ln" d="M-260 260L-20 20"/>
<path class="ln" d="M-250 260L-10 20"/>
<path class="ln" d="M-240 260L0 20"/>
<path class="ln" d="M-230 260L10 20"/>
<path class="ln" d="M-220 260L20 20"/>
<path class="ln" d="M-210 260L30 20"/>
<path class="ln" d="M-200 260L40 20"/>
<path class="ln" d="M-190 260L50 20"/>
<path class="ln" d="M-180 260L60 20"/>
<path class="ln" d="M-170 260L70 20"/>
<path class="ln" d="M-160 260L80 20"/>
<path class="ln" d="M-150 260L90 20"/>
<path class="ln" d="M-140 260L100 20"/>
<path class="ln" d="M-130 260L110 20"/>
<path class="ln" d="M-120 260L120 20"/>
<path class="ln" d="M-110 260L130 20"/>
<path class="ln" d="M-100 260L140 20"/>
<path class="ln" d="M-90 260L150 20"/>
<path class="ln" d="M-80 260L160 20"/>
<path class="ln" d="M-70 260L170 20"/>
<path class="ln" d="M-60 260L180 20"/>
<path class="ln" d="M-50 260L190 20"/>
<path class="ln" d="M-40 260L200 20"/>
<path class="ln" d="M-30 260L210 20"/>
<path class="ln" d="M-20 260L220 20"/>
<path class="ln" d="M-10 260L230 20"/>
<path class="ln" d="M0 260L240 20"/>
<path class="ln" d="M10 260L250 20"/>
<path class="ln" d="M20 260L260 20"/>
<path class="ln" d="M30 260L270 20"/>
<path class="ln" d="M40 260L280 20"/>
<path class="ln" d="M50 260L290 20"/>
<path class="ln" d="M60 260L300 20"/>
<path class="ln" d="M70 260L310 20"/>
<path class="ln" d="M80 260L320 20"/>
<path class="ln" d="M90 260L330 20"/>
<path class="ln" d="M100 260L340 20"/>
<path class="ln" d="M110 260L350 20"/>
<path class="ln" d="M120 260L360 20"/>
<path class="ln" d="M130 260L370 20"/>
<path class="ln" d="M140 260L380 20"/>
<path class="ln" d="M150 260L390 20"/>
<path class="ln" d="M160 260L400 20"/>
<path class="ln" d="M170 260L410 20"/>
<path class="ln" d="M180 260L420 20"/>
<path class="ln" d="M190 260L430 20"/>
<path class="ln" d="M200 260L440 20"/>
<path class="ln" d="M210 260L450 20"/>
<path class="ln" d="M220 260L460 20"/>
<path class="ln" d="M230 260L470 20"/>
<path class="ln" d="M240 260L480 20"/>
<path class="ln" d="M250 260L490 20"/>
<path class="ln" d="M260 260L500 20"/>
<path class="ln" d="M270 260L510 20"/>
<path class="ln" d="M280 260L520 20"/>
<path class="ln" d="M290 260L530 20"/>
<path class="ln" d="M300 260L540 20"/>
<path class="ln" d="M310 260L550 20"/>
<path class="ln" d="M320 260L560 20"/>
<path class="ln" d="M330 260L570 20"/>
<path class="ln" d="M340 260L580 20"/>
<path class="ln" d="M350 260L590 20"/>
<path class="ln" d="M360 260L600 20"/>
<path class="ln" d="M370 260L610 20"/>
<path class="ln" d="M380 260L620 20"/>
<path class="ln" d="M390 260L630 20"/>
<path class="ln" d="M400 260L640 20"/>
<path class="ln" d="M410 260L650 20"/>
<path class="ln" d="M420 260L660 20"/>
<path class="ln" d="M430 260L670 20"/>
<path class="ln" d="M440 260L680 20"/>
<path class="ln" d="M450 260L690 20"/>
<path class="ln" d="M460 260L700 20"/>
<path class="ln" d="M470 260L710 20"/>
<path class="ln" d="M480 260L720 20"/>
<path class="ln" d="M490 260L730 20"/>
<path class="ln" d="M500 260L740 20"/>
<path class="ln" d="M510 260L750 20"/>
<path class="ln" d="M520 260L760 20"/>
<path class="ln" d="M530 260L770 20"/>
<path class="ln" d="M540 260L780 20"/>
<path class="ln" d="M550 260L790 20"/>
<path class="ln" d="M560 260L800 20"/>
<path class="ln" d="M570 260L810 20"/>
<path class="ln" d="M580 260L820 20"/>
<path class="ln" d="M590 260L830 20"/>
<path class="ln" d="M600 260L840 20"/>
<path class="ln" d="M610 260L850 20"/>
<path class="ln" d="M620 260L860 20"/>
<path class="ln" d="M630 260L870 20"/>
<path class="ln" d="M640 260L880 20"/>
<path class="ln" d="M650 260L890 20"/>
<path class="ln" d="M660 260L900 20"/>
<path class="ln" d="M670 260L910 20"/>
<path class="ln" d="M680 260L920 20"/>
<path class="ln" d="M690 260L930 20"/>
</g>
<path class="li" d="M120 40H300V100H120ZM120 180H300V240H120Z"/>
<text class="txb" x="210" y="30" text-anchor="middle">Housing: 45° one way</text>
</g>
<g class="kf-a kd2">
<clipPath id="{id}-c">
<path d="M306 40H360V100H306ZM306 180H360V240H306Z"/>
</clipPath>
<g clip-path="url(#{id}-c)">
<path class="ln" d="M-300 20L-60 260"/>
<path class="ln" d="M-290 20L-50 260"/>
<path class="ln" d="M-280 20L-40 260"/>
<path class="ln" d="M-270 20L-30 260"/>
<path class="ln" d="M-260 20L-20 260"/>
<path class="ln" d="M-250 20L-10 260"/>
<path class="ln" d="M-240 20L0 260"/>
<path class="ln" d="M-230 20L10 260"/>
<path class="ln" d="M-220 20L20 260"/>
<path class="ln" d="M-210 20L30 260"/>
<path class="ln" d="M-200 20L40 260"/>
<path class="ln" d="M-190 20L50 260"/>
<path class="ln" d="M-180 20L60 260"/>
<path class="ln" d="M-170 20L70 260"/>
<path class="ln" d="M-160 20L80 260"/>
<path class="ln" d="M-150 20L90 260"/>
<path class="ln" d="M-140 20L100 260"/>
<path class="ln" d="M-130 20L110 260"/>
<path class="ln" d="M-120 20L120 260"/>
<path class="ln" d="M-110 20L130 260"/>
<path class="ln" d="M-100 20L140 260"/>
<path class="ln" d="M-90 20L150 260"/>
<path class="ln" d="M-80 20L160 260"/>
<path class="ln" d="M-70 20L170 260"/>
<path class="ln" d="M-60 20L180 260"/>
<path class="ln" d="M-50 20L190 260"/>
<path class="ln" d="M-40 20L200 260"/>
<path class="ln" d="M-30 20L210 260"/>
<path class="ln" d="M-20 20L220 260"/>
<path class="ln" d="M-10 20L230 260"/>
<path class="ln" d="M0 20L240 260"/>
<path class="ln" d="M10 20L250 260"/>
<path class="ln" d="M20 20L260 260"/>
<path class="ln" d="M30 20L270 260"/>
<path class="ln" d="M40 20L280 260"/>
<path class="ln" d="M50 20L290 260"/>
<path class="ln" d="M60 20L300 260"/>
<path class="ln" d="M70 20L310 260"/>
<path class="ln" d="M80 20L320 260"/>
<path class="ln" d="M90 20L330 260"/>
<path class="ln" d="M100 20L340 260"/>
<path class="ln" d="M110 20L350 260"/>
<path class="ln" d="M120 20L360 260"/>
<path class="ln" d="M130 20L370 260"/>
<path class="ln" d="M140 20L380 260"/>
<path class="ln" d="M150 20L390 260"/>
<path class="ln" d="M160 20L400 260"/>
<path class="ln" d="M170 20L410 260"/>
<path class="ln" d="M180 20L420 260"/>
<path class="ln" d="M190 20L430 260"/>
<path class="ln" d="M200 20L440 260"/>
<path class="ln" d="M210 20L450 260"/>
<path class="ln" d="M220 20L460 260"/>
<path class="ln" d="M230 20L470 260"/>
<path class="ln" d="M240 20L480 260"/>
<path class="ln" d="M250 20L490 260"/>
<path class="ln" d="M260 20L500 260"/>
<path class="ln" d="M270 20L510 260"/>
<path class="ln" d="M280 20L520 260"/>
<path class="ln" d="M290 20L530 260"/>
<path class="ln" d="M300 20L540 260"/>
<path class="ln" d="M310 20L550 260"/>
<path class="ln" d="M320 20L560 260"/>
<path class="ln" d="M330 20L570 260"/>
<path class="ln" d="M340 20L580 260"/>
<path class="ln" d="M350 20L590 260"/>
<path class="ln" d="M360 20L600 260"/>
<path class="ln" d="M370 20L610 260"/>
<path class="ln" d="M380 20L620 260"/>
<path class="ln" d="M390 20L630 260"/>
<path class="ln" d="M400 20L640 260"/>
<path class="ln" d="M410 20L650 260"/>
<path class="ln" d="M420 20L660 260"/>
<path class="ln" d="M430 20L670 260"/>
<path class="ln" d="M440 20L680 260"/>
<path class="ln" d="M450 20L690 260"/>
<path class="ln" d="M460 20L700 260"/>
<path class="ln" d="M470 20L710 260"/>
<path class="ln" d="M480 20L720 260"/>
<path class="ln" d="M490 20L730 260"/>
<path class="ln" d="M500 20L740 260"/>
<path class="ln" d="M510 20L750 260"/>
<path class="ln" d="M520 20L760 260"/>
<path class="ln" d="M530 20L770 260"/>
<path class="ln" d="M540 20L780 260"/>
<path class="ln" d="M550 20L790 260"/>
<path class="ln" d="M560 20L800 260"/>
<path class="ln" d="M570 20L810 260"/>
<path class="ln" d="M580 20L820 260"/>
<path class="ln" d="M590 20L830 260"/>
<path class="ln" d="M600 20L840 260"/>
<path class="ln" d="M610 20L850 260"/>
<path class="ln" d="M620 20L860 260"/>
<path class="ln" d="M630 20L870 260"/>
<path class="ln" d="M640 20L880 260"/>
<path class="ln" d="M650 20L890 260"/>
<path class="ln" d="M660 20L900 260"/>
<path class="ln" d="M670 20L910 260"/>
<path class="ln" d="M680 20L920 260"/>
<path class="ln" d="M690 20L930 260"/>
</g>
<path class="li" d="M306 40H360V100H306ZM306 180H360V240H306Z"/>
<text class="txb" x="333" y="30" text-anchor="middle">End cap</text>
</g>
<g class="kf-a kd3">
<rect class="fi" x="301" y="40" width="4" height="60"/>
<rect class="fi" x="301" y="180" width="4" height="60"/>
</g>
<g class="kf-a kd4">
<rect class="bxi" x="60" y="128" width="380" height="24"/>
<rect class="bx" x="230" y="100" width="40" height="28"/>
<rect class="bx" x="230" y="152" width="40" height="28"/>
<path class="ln" d="M230 100l40 28M270 100l-40 28M230 152l40 28M270 152l-40 28"/>
<path class="cl" d="M40 140H460"/>
</g>
<g class="kf-a kd5">
<text class="txs" x="40" y="278" text-anchor="start">Housing hatched 45° one way; end cap hatched 45° the other way.</text>
<text class="txs" x="40" y="296" text-anchor="start">Gasket filled solid, at least 1 mm gap to other solids.</text>
<text class="txs" x="40" y="314" text-anchor="start">Shaft, bearing and cap screws drawn in full outline, not hatched.</text>
<text class="txs" x="40" y="332" text-anchor="start">Cartridge assembly section through the axis (simplified; not to scale).</text>
</g>
```

## The error: one part that looked like two

The first issue of the housing drawing had a section in which the material above the bore and the material below it were hatched at opposite angles. The CAD system had created two separate hatch regions, one on each side of the bore, and the drafter had accepted its default of alternating the angle for adjacent regions.

The machine shop's estimator read the section the way the standard intends it to be read: two hatching angles meeting at the bore meant two parts. He concluded that the bore was a separate liner pressed into the housing, and he quoted for making a liner and pressing it in. The quote was almost double the expected price. The buyer asked why, and the estimator pointed to the hatching.

The correction was to hatch both regions as one pattern at one angle and spacing, as clause 7.3.1 requires for every cut area of the same part. The business also changed its CAD template so that hatch regions created in one operation share a pattern, and added "same part, same hatching" to the drawing checklist. The error was harmless in the end, because a careful estimator asked before quoting. A less careful one might have quoted the simple part and been surprised at delivery, or made the liner.

The episode shows something about how drawings are read. Readers trust conventions more than they trust their own sense of what is likely. The estimator knew that bearing housings are usually solid castings, but the hatching told him otherwise, and the hatching won. That is the right instinct, because conventions exist precisely so that readers do not have to guess. It also means that a convention used carelessly is more dangerous than no convention at all: it carries authority it has not earned. The safest drawings are the ones whose conventions are applied as consistently as their dimensions.

## Common faults in sections

A review of sectioned views usually finds the same handful of faults. Checking for them takes a few minutes and saves queries later.

1. **Missing edges beyond the plane.** AS 1100.101 defines a section as the view at the cutting plane, typically including detail beyond it. A section that shows only the cut surface, without the visible edges behind it, such as the far side of a bore shoulder or the outline of a flange seen beyond the cut, leaves the reader to guess the depth of features.
2. **Hidden lines left in a section.** The point of a section is to remove hidden lines. Hidden lines behind the cutting plane are normally omitted unless they are needed to define a feature that is shown nowhere else.
3. **Hatching parallel to an outline.** A 45° pattern that runs parallel to a chamfered or sloping edge makes the edge hard to see. The standard allows another angle in that case.
4. **Letters that do not match.** A cutting plane marked B-B on the end view and a section titled A-A, or a letter used both for a section and for a detail, breaks the rule that each letter is used once and makes the reader hunt.
5. **A section out of projection without a label.** A section moved elsewhere on the sheet for space must be titled and its cutting plane shown with arrows, or the reader cannot tell which way it looks.
6. **Fasteners and shafts hatched in assemblies.** Hatching a bolt lengthwise does not make it clearer; it makes it look like a turned spacer.

## Choosing the cutting plane for the people downstream

The cutting plane is usually chosen to show the most features. It is worth also asking who will use the section. An inspector will measure features shown in the section, so a section through the features they must check, at the positions where they will check them, helps them plan. A machinist will set up the part to machine the bore and shoulder in one operation, so a section that shows the shoulder, bore and spigot together reflects the relationships they must hold.

In the running case, the vertical plane through the axis serves both: it shows the bore, shoulder and spigot as one connected profile, which is exactly the set of features that must be concentric and is machined in one set-up. Chapter 7 relies on this when it applies a runout tolerance across those features.

## Sections and dimensions

Sections are usually the best place for dimensions of internal features, because those features appear there as visible edges. The housing's bore diameter, shoulder diameter, bore depth, spigot length and tapped hole depth are all dimensioned on section A-A. The pitch circle diameters and the angular positions of the holes are dimensioned on the end views, where the circles are true shape. Chapter 6 covers how those dimensions are laid out.

One caution: hatching must be interrupted around dimension text and lettering placed within a hatched area, so that the numbers are not obscured. On a dense section, it is usually better to move the dimension outside the hatched area altogether. Where that is not possible, a short leader from a clear space to the feature is better than a number sitting on top of hatching that a reduced print will turn grey.

## Exercise: a section through a pulley

A cast iron V-belt pulley has a hub, a rim and four spokes at 90° intervals, with one spoke at 45° to the vertical. A full section is to be drawn on a vertical cutting plane through the axis. How should the spokes and the hub keyway be shown?

**Worked answer.** The vertical cutting plane does not pass through any spoke, because they are at 45°, 135°, 225° and 315°. Following AS 1100.101 clause 7.4.9.2, the oblique spokes should be drawn as though they were on the cutting plane, so that the section shows the spoke connecting hub and rim. The spoke is a relatively thin element cut lengthwise, so it is drawn in outline without hatching, or with double-spaced hatching and a hidden outline at its boundary with the hub and rim. Leaving it unhatched avoids the false impression that the pulley is a solid disc.

The hub and rim are hatched as one part, at one angle and spacing, since they are one casting. The keyway in the hub is shown in the section where the cutting plane passes through it; if it is not on the plane, it can be shown in a partial end view of the hub. A shaft and key, if shown in an assembly section, would be drawn in full outline, unhatched.
