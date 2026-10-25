---
book: drawings-that-make-parts
chapterSlug: surface-texture
order: 8
title: "Surface texture symbols and what they ask for"
description: "Read and write AS 1100.201 surface texture symbols: the three basic symbols, preferred Ra values, process and cut-off notes, simplified notes, and the inspection setting that changed a result."
draft: false
---

A dimension says where a surface is. A surface texture symbol says what the surface is like: how rough, whether it must be machined, whether material may be removed at all, and sometimes how it must be produced or measured. On a part like the running case housing, surface texture matters on a few surfaces, the bearing bore, the spigot and the faces that seal or clamp, and hardly at all on the rest.

This chapter covers the surface texture conventions in AS 1100.201 Section 3: the symbols, the preferred roughness values, the additional indications, where symbols go and the simplified notes that keep a drawing clean. It also flags where later ISO practice differs, because drawings from overseas customers often follow it. Its error case is an inspection report that passed a bore by measuring it differently from the way the drawing intended.

## The three basic symbols

AS 1100.201 clause 3.2 defines a basic symbol made of two lines at 60° to the horizontal, and two modifications:

```figure
type: svg
title: Basic surface texture symbols, AS 1100.201 clause 3.2
alt: Basic surface texture symbols, AS 1100.201 clause 3.2. Basic symbol: Meaning the surface texture may be produced by any method. With a bar across the open side: Meaning removal of material by machining is required. With a circle in the open side: Meaning removal of material is not permitted; leave the surface as produced by the previous process
caption: Summarised from AS 1100.201-1992. Each symbol's size is proportioned to the character height used on the drawing.
viewbox: 0 0 640 250
- Basic symbol | Meaning: the surface texture may be produced by any method
- With a bar across the open side | Meaning: removal of material by machining is required
- With a circle in the open side | Meaning: removal of material is not permitted; leave the surface as produced by the previous process
body:
<g class="kf-a kd1">
<path class="li draw" pathLength="1" d="M76.4 116L110 150L179.3 82"/>
<text class="txb" x="110" y="196" text-anchor="middle">Basic symbol</text>
<text class="txs" x="110" y="214" text-anchor="middle">any production method</text>
<text class="txs" x="110" y="230" text-anchor="middle">
</text>
</g>
<g class="kf-a kd2">
<path class="li draw" pathLength="1" d="M286.4 116L320 150L389.3 82"/>
<path class="li" d="M286.4 116H344.7"/>
<text class="txa" x="320" y="196" text-anchor="middle">Bar across the open side</text>
<text class="txs" x="320" y="214" text-anchor="middle">machining required</text>
<text class="txs" x="320" y="230" text-anchor="middle">
</text>
</g>
<g class="kf-a kd3">
<path class="li draw" pathLength="1" d="M496.4 116L530 150L599.3 82"/>
<circle class="li" cx="530" cy="134" r="11"/>
<text class="txb" x="530" y="196" text-anchor="middle">Circle in the open side</text>
<text class="txs" x="530" y="214" text-anchor="middle">no material removal;</text>
<text class="txs" x="530" y="230" text-anchor="middle">leave as produced</text>
</g>
<g class="kf-a kd4">
<text class="txs" x="320" y="30" text-anchor="middle">Legs at 60° to the horizontal; the Ra value is written above the symbol</text>
</g>
```

Used alone, without a value, the bar symbol says only that the surface must be machined, and the circle symbol says only that it must be left as cast, forged or rolled. Both are useful on castings and forgings, where the reader needs to know which surfaces will be machined and which will not. They also help the estimator, who prices machined surfaces and must know how many there are.

## Roughness values

The principal roughness parameter in AS 1100.201 is the arithmetic mean deviation, Ra, formerly called the centre-line average. Clause 3.3 asks for Ra values to be chosen from a preferred series in Table 3.1, written in micrometres above the symbol:

**50, 25, 12.5, 6.3, 3.2, 1.6, 0.8, 0.4, 0.2, 0.1, 0.05 and 0.025 µm**

Each value is roughly half the one before it. The table also gives microinch equivalents for comparison; 1.6 µm, for example, corresponds to 63 µin. Choosing from the series matters because suppliers' processes and inspectors' comparison specimens are organised around these steps. A value such as 2.0 µm is not wrong in principle, but it falls between the steps and invites argument about which process is needed.

A single value above the symbol is the **maximum** permitted roughness. If both a maximum and a minimum are needed, for example on a surface that must hold oil, the maximum is written above the minimum. Whether the symbol is basic, barred or circled still tells the reader how the surface may be produced.

### What an Ra number does and does not tell you

Ra is an average: broadly, the mean of the absolute heights of the surface profile above and below its mean line, over the length measured. That makes it stable and easy to compare, which is why it became the principal parameter. It also means that very different surfaces can share one Ra value. A surface with occasional deep scratches and one with a fine, even pattern can read the same, yet one may tear a seal lip and the other may not.

For most machined parts, Ra is enough. Where a surface's function depends on peaks, valleys or the pattern of the marks, such as a seal running surface or a surface that must retain oil, the designer may need to add the direction of lay, a minimum value or other requirements, and should consult the maker of the mating component. The drawing should say exactly what is required, because an inspector can only check what is written.

## Additional indications

AS 1100.201 clause 3.4 allows more information to be added to an extended symbol, where function needs it:

- **Production method.** If the final texture must be produced by a particular method, such as grinding, it is written in plain words above the extension line. If a surface is plated or chemically treated, the Ra value applies after treatment unless stated otherwise.
- **Cut-off (sampling length).** If the cut-off for measurement is to be other than **0.8 mm**, the value is written below the extension, chosen from the series **0.08, 0.25, 0.8, 2.5 and 8 mm**.
- **Lay.** If the direction of the tool marks matters, a lay symbol is added.
- **Machining allowance.** If needed, it is written to the left of the symbol.
- **Waviness.** Maximum waviness height, and spacing where needed, can be written above the extension.

The default cut-off of 0.8 mm deserves attention. It tells the inspector how to set the measuring instrument. A drawing that says nothing about cut-off is asking for 0.8 mm. An inspector who uses a different setting, for convenience or out of habit from the last job, is measuring something other than what the drawing specifies, and the result cannot be compared with the limit.

## Where the symbols go

Clause 3.5 sets out placement:

- Symbols and their values are oriented to be read from the bottom edge or the right-hand edge of the sheet.
- The symbol, or a leader ending in an arrow, points from outside the material to the line representing the surface or to a projection line from it.
- Each surface gets its symbol once, preferably on the view that carries the dimension locating or sizing that surface.

That last rule links surface texture to dimensioning. The bore's texture symbol goes on section A-A, where the bore is dimensioned, not on the end view where it appears as a circle.

### Simplified notes

When most surfaces share one texture, clause 3.5.2 allows simplified procedures. A single symbol near the title block can state the texture for all surfaces, or for all surfaces except those marked otherwise. Where several textures each apply to many surfaces, substitute symbols, such as the basic symbol with a letter, can be placed on the surfaces and defined in a note. This keeps the views clear and puts the common requirement in one place, where a reader looking for it will find it.

## Texture, process and cost

Each step down the preferred series asks more of the process. A surface that a single turning or milling pass can produce at one value may need a finishing pass, a slower feed, a different tool or a separate operation such as grinding or honing to reach the next. AS 1100.201 Appendices C and D give guidance on the appearance of various Ra values and the processes that generally achieve them; this book does not reproduce them, but the principle is general: finer texture costs time, and often a further operation.

That makes surface texture a design decision with a price, not a quality aspiration. The useful question for each surface is the same as for tolerances: what does this surface do, and what texture does that function need? A bearing seat, a seal running surface, a sliding guide or a gasket face has a functional reason for its texture. An outside diameter that nobody touches does not. Putting a fine value on every surface "to be safe" raises the price of every part and dilutes the attention that the critical surfaces deserve.

Inspection also has a cost. Rough surfaces can often be accepted by visual and tactile comparison with reference specimens. Fine surfaces need an instrument, a defined cut-off and a record. Specifying fine textures only where function needs them keeps the instrument work to the surfaces that matter.

## Castings, coatings and allowances

Surface texture on castings and coated parts needs two extra thoughts. First, a casting drawing should make clear which surfaces will be machined and which will stay as cast. The barred and circled symbols do exactly that, and AS 1100.201 allows a machining allowance to be written to the left of the symbol where it must be specified. Second, where a surface is plated, anodised or otherwise treated, the Ra value applies after the treatment unless the drawing says otherwise. If the texture before treatment also matters, for example because the coating will reproduce the substrate's texture, AS 1100.201 shows how to indicate both, using two symbols or a note.

The running case housing is painted on its cast outside surfaces only. The machined surfaces are left bare and protected with a rust preventive, so their textures apply as machined, and the drawing says so in the finish note to avoid any doubt about whether paint is allowed on the bore.

## The running case: texture on the housing

This is an illustration. The designer assigned textures by function:

```figure
type: svg
title: Surface texture on the housing
alt: Surface texture on the housing. Ra 1.6, machined, Bearing bore Ø62 (supports the outer ring evenly). Ra 3.2, machined, Spigot Ø100 and spigot face (locates and seats on the pump). Ra 3.2, machined, Rear face (carries the end cap gasket). Ra 6.3, machined, All other machined surfaces (general note near the title block). Circle symbol, Unmachined cast surfaces (leave as cast)
caption: This is an illustration. Values are the designer's choices for this part, informed by the bearing maker's guidance and the pump's sealing face; they are not requirements of AS 1100.
viewbox: 0 0 640 300
body:
<g class="kf-a kd1">
<rect class="bxa" x="20" y="10" width="192" height="133" rx="8"/>
<circle class="fa pulse" cx="198" cy="24" r="5"/>
<text class="txa" x="32" y="36">Ra 1.6, machined</text>
<text class="txb" x="32" y="61">Bearing bore Ø62</text>
<text class="tx" x="32" y="82">supports the outer ring</text>
<text class="tx" x="32" y="100">evenly</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="224" y="10" width="192" height="133" rx="8"/>
<text class="txa" x="236" y="36">Ra 3.2, machined</text>
<text class="txb" x="236" y="61">Spigot Ø100 and</text>
<text class="txb" x="236" y="80">spigot face</text>
<text class="tx" x="236" y="101">locates and seats on the</text>
<text class="tx" x="236" y="119">pump</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="428" y="10" width="192" height="133" rx="8"/>
<text class="txa" x="440" y="36">Ra 3.2, machined</text>
<text class="txb" x="440" y="61">Rear face</text>
<text class="tx" x="440" y="82">carries the end cap</text>
<text class="tx" x="440" y="100">gasket</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="20" y="155" width="192" height="133" rx="8"/>
<text class="txa" x="32" y="181">Ra 6.3, machined</text>
<text class="txb" x="32" y="206">All other machined</text>
<text class="txb" x="32" y="225">surfaces</text>
<text class="tx" x="32" y="246">general note near the</text>
<text class="tx" x="32" y="264">title block</text>
</g>
<g class="kf-a kd5">
<rect class="bx" x="224" y="155" width="192" height="133" rx="8"/>
<text class="txa" x="236" y="181">Circle symbol</text>
<text class="txb" x="236" y="206">Unmachined cast</text>
<text class="txb" x="236" y="225">surfaces</text>
<text class="tx" x="236" y="246">leave as cast</text>
</g>
```

The general note near the title block uses the simplified procedure: a barred symbol with 6.3 above it, followed by a note that it applies to all machined surfaces except where otherwise marked. The bore, spigot and rear face carry their own symbols on section A-A. The cast surfaces are covered by a circle symbol in the same note, so the machine shop knows not to skim them.

## The error: the cut-off that changed the answer

The machine shop's first-article report listed the bore's roughness as 1.3 µm Ra, inside the 1.6 µm maximum. When the first housings went into test cartridges, one bearing's outer ring showed fretting marks after a short run. The business measured the bore itself and got 2.1 µm Ra.

Both measurements were made properly. The difference was the cut-off. The shop's profilometer had been left at 0.25 mm from a previous job on fine-ground pins. A shorter cut-off filters out longer wavelengths of the surface profile, and on a bored surface with a pronounced feed pattern it gave a lower reading. The drawing specified no cut-off, which means the default of 0.8 mm. At 0.8 mm, the bore exceeded its limit.

The discrepancy was detected because the business recorded the instrument settings with its own measurement and compared them with the shop's report, which listed its cut-off in small print. The corrections were: the shop re-measured the batch at 0.8 mm and reworked the bores that failed; the business's purchase order now requires roughness results to state the cut-off and instrument; and the first-article report template includes the cut-off as a mandatory field. The fretting itself had a second cause, the bore size, already corrected in Chapter 7, but the roughness discrepancy would have hidden a real non-conformance on later batches.

```figure
type: svg
title: Reviewing surface texture indications before release
alt: Reviewing surface texture indications before release. Done: Every functional surface has its own symbol on the view where it is dimensioned. Done: Values are from the preferred Ra series. Done: Barred and circled symbols distinguish machined from unmachined surfaces. Done: A general note covers all remaining surfaces. Done: Cut-off stated wherever it is not the default 0.8 mm. Open: Standard the symbols follow is stated on the drawing
caption: This is an illustration of the business's review questions, based on AS 1100.201 Section 3.
viewbox: 0 0 640 336
body:
<g class="kf-a kd1">
<rect class="bx" x="20" y="12" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="29" r="11"/>
<path class="la draw" pathLength="1" d="M34 29l4 4 8-8"/>
<text class="txb" x="64" y="32">Every functional surface has its own symbol on the view where it</text>
<text class="txb" x="64" y="51">is dimensioned</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="20" y="78" width="600" height="39" rx="6"/>
<circle class="bxa" cx="40" cy="95" r="11"/>
<path class="la draw" pathLength="1" d="M34 95l4 4 8-8"/>
<text class="txb" x="64" y="98">Values are from the preferred Ra series</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="20" y="125" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="142" r="11"/>
<path class="la draw" pathLength="1" d="M34 142l4 4 8-8"/>
<text class="txb" x="64" y="145">Barred and circled symbols distinguish machined from unmachined</text>
<text class="txb" x="64" y="164">surfaces</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="20" y="191" width="600" height="39" rx="6"/>
<circle class="bxa" cx="40" cy="208" r="11"/>
<path class="la draw" pathLength="1" d="M34 208l4 4 8-8"/>
<text class="txb" x="64" y="211">A general note covers all remaining surfaces</text>
</g>
<g class="kf-a kd5">
<rect class="bx" x="20" y="238" width="600" height="39" rx="6"/>
<circle class="bxa" cx="40" cy="255" r="11"/>
<path class="la draw" pathLength="1" d="M34 255l4 4 8-8"/>
<text class="txb" x="64" y="258">Cut-off stated wherever it is not the default 0.8 mm</text>
</g>
<g class="kf-a kd6">
<rect class="bxi" x="20" y="285" width="600" height="39" rx="6"/>
<circle class="bxi" cx="40" cy="302" r="11"/>
<text class="txa" x="40" y="307" text-anchor="middle">?</text>
<text class="txb" x="64" y="305">Standard the symbols follow is stated on the drawing</text>
</g>
```

## When the drawing follows later ISO practice

AS 1100.201 dates from 1992 and reflects the surface texture practice of that time. Later ISO standards, first ISO 1302:2002 and then ISO 21920-1, changed how surface texture is indicated: the parameter name is written with its value, so a drawing shows "Ra 1.6" rather than "1.6", and the rules about defaults and how limits are interpreted differ. This book has not read those standards and does not quote them.

The practical consequence is simple. If a drawing states that it is prepared to AS 1100.201, read its surface texture symbols by AS 1100.201's rules. If it cites an ISO standard, or shows a parameter name inside the symbol, read it by that standard's rules and check them before quoting or inspecting. If a drawing does not say which standard it follows, ask, because a roughness value, a cut-off default or the meaning of a single limit can differ between conventions.

## Exercise: texture for the end cap

The end cap from Chapter 7 has a register diameter that fits in the housing bore, a seal bore that holds a lip seal, a clamping face against the bearing, an outside diameter and four screw holes. The cap is turned from steel bar. Assign surface texture indications using AS 1100.201 conventions and a simplified general note, and explain each choice.

**Worked answer.** One reasonable scheme:

- A **general note** near the title block: a barred symbol with **6.3** above it, applying to all surfaces except where otherwise marked. The whole cap is machined from bar, so the barred symbol is appropriate everywhere.
- The **seal bore** needs the texture the seal maker specifies for the housing bore of the seal; assume **1.6** for illustration, with a barred symbol on the section where the seal bore is dimensioned.
- The **register diameter**, which locates the cap in the housing bore, gets **3.2**.
- The **clamping face** against the bearing gets **3.2**, so the clamp load is spread evenly.
- The **outside diameter** and **screw holes** stay under the general note.

No cut-off is written, so the default of 0.8 mm applies, and the purchase order requires inspection reports to state it. If the seal maker specified a lay or a maximum and minimum roughness for the seal bore, those would be added to that symbol only.
