---
book: induction-hardening-by-the-numbers
chapterSlug: the-steel-and-its-transformation
order: 5
title: "The steel and its transformation"
description: "What happens inside the steel: austenite, martensite and carbon, why fast heating needs a higher temperature, starting structure, prior austenite grain size, and a bar supplied annealed."
draft: false
---

Induction is only a way of heating. The hardening itself is metallurgy: the steel's structure changes when it is heated above a critical temperature and changes again, into a hard structure, when it is cooled fast enough. Whether that happens fully in the few seconds an induction heat allows depends on the steel's carbon content, its starting structure and the temperature reached. A perfectly set machine will not harden a steel that cannot respond in the time it is given.

This chapter explains the transformation in plain terms, shows why induction hardening needs higher temperatures than furnace hardening, explains why the bar's starting condition matters, checks incoming bar with a KEVOS® Brinell tool and the grain size of the hardened case with another, and works through a batch of bar that arrived in the wrong condition.

## From ferrite and pearlite to austenite to martensite

At room temperature, a plain medium-carbon steel such as the IH-40's is a mixture of two constituents: ferrite, nearly pure iron, soft and ductile; and pearlite, fine alternating plates of ferrite and iron carbide. When the steel is heated above its upper critical temperature, both transform into austenite, a different crystal arrangement of iron that can dissolve all of the steel's carbon. The carbon, previously locked in the carbide plates, spreads through the austenite by diffusion.

If the austenite is then cooled slowly, it transforms back to ferrite and pearlite. If it is cooled fast enough, the carbon has no time to come out of solution and form carbide, and the austenite transforms instead into martensite: a strained, distorted crystal structure, supersaturated with carbon, which is very hard. The hardness of fully martensitic steel rises with its carbon content, which is why induction hardening uses steels with enough carbon, typically 0.35% to 0.55%, and why low-carbon steels cannot be induction hardened to a useful hardness.

```figure
type: steps
title: What happens to the IH-40 case during hardening
caption: The austenite must be formed, and its carbon spread evenly, in the few seconds of heating. Everything that slows that, coarse carbides, a low temperature or too short a time, leaves the case incompletely hardened.
- Starting structure | ferrite and fine pearlite in normalised bar, about 180 to 230 HB
- Heated above the upper critical temperature | ferrite and pearlite transform to austenite
- Carbon spreads through the austenite | from the dissolving carbide plates, by diffusion
- * Quenched fast enough | austenite transforms to hard martensite
- Below the case | partly transformed layer grading into the unchanged core
```

### Why induction needs a higher temperature

The transformation to austenite takes time, because carbon must diffuse out of the carbide plates and spread through the new austenite. In a furnace, a part is held at temperature for many minutes and the transformation has plenty of time to complete just above the critical temperature. In induction hardening, the surface is above the critical temperature for only a second or two. To make the transformation complete in that time, the steel must be heated well above its equilibrium critical temperature, where diffusion is much faster. That is why the IH-40's induction recipe aims at about 900 °C, while a furnace hardening of the same steel would typically use a lower temperature. The faster the heat, the higher the temperature needed; the higher the temperature, the greater the risk of overheating the surface and coarsening its grains.

### Martensite, retained austenite and the end of the quench

Martensite forms as the austenite cools through a range of temperatures that begins at the martensite start temperature and ends at the martensite finish temperature, both well below the austenite range and both lower in steels with more carbon. Martensite forms almost instantly as each temperature in that range is reached, which is why quenching must continue until the case is well below the start temperature, not just until it stops glowing. In medium-carbon steels such as the IH-40's, nearly all the austenite transforms by room temperature. In higher-carbon or more alloyed steels, some austenite can remain untransformed at room temperature, called retained austenite; it is soft and can transform later in service, changing the part's size slightly. For the IH-40 it is not a practical concern, but it is one reason the case's carbon content and the quench's final temperature appear in specifications for more demanding parts.

The transformation also changes the case's volume. Martensite occupies slightly more volume than the ferrite and pearlite it replaced, so the hardened case tries to expand while the core beneath it does not. That mismatch is the origin of the compressive residual stress in an induction-hardened surface, which is good for fatigue, and of the distortion and cracking risks that Chapter 9 deals with.

## Why the starting structure matters

Because the time is so short, the size of the carbide particles in the starting structure matters. Normalised bar, cooled in air from above its critical temperature at the mill, has fine pearlite with thin, closely spaced carbide plates, which dissolve quickly. Bar that has been annealed, cooled very slowly, has coarser pearlite and larger patches of ferrite, which take longer to transform and longer for carbon to spread into. Bar that has been quenched and tempered beforehand has a fine, uniform dispersion of carbide and responds fastest of all, which is why some critical parts are quenched and tempered before induction hardening.

The IH-40 specification therefore calls up the bar's condition, normalised, and its hardness range, 180 to 230 HB, as part of the material order. The hardness range is a convenient, quick proxy for the condition: annealed bar of this grade is usually softer than normalised bar, and quenched and tempered bar harder, so a Brinell test on a sample from each delivery catches most mix-ups in a minute, long before a microsection could be prepared.

### Checking incoming bar

The KEVOS® [Brinell hardness test check](/tools/brinell-test-check/) tool evaluates a Brinell test from two indentation diameters. With the force and ball diameter it gives the mean diameter, hardness, indentation ratio, depth and the difference between the diameters, checks the indentation ratio, thickness, edge distance and spacing against the rules you enter, and compares the hardness with the specification. For steels it also gives an approximate tensile strength, from a rule of thumb of about 3.45 MPa per Brinell number.

This is an illustration. The manufacturer tests a sample from each delivery of 40 mm bar on a flat ground on its side, with a 10 mm ball and 3,000 kgf.

```figure
type: steps
title: An incoming IH-40 bar in the Brinell test check tool
caption: This is an illustration. 3,000 kgf, 10 mm ball, diameters 4.14 and 4.16 mm; rules of ratio 0.24 to 0.6, thickness 8 × depth, edge 2.5 × d, spacing 3 × d; specification 180 to 230 HBW.
- Mean diameter | 4.15 mm
- * Hardness | 212 HBW 10/3000, within 180 to 230
- Indentation ratio | 0.415, within 0.24 to 0.6
- Depth | 0.451 mm, needing 3.6 mm of thickness; the 40 mm bar is ample
- Edge distance needed | 10.4 mm from the flat's edge
- Approximate tensile strength, steel rule of thumb | about 730 MPa
```

## Grain size of the case

When steel is heated into the austenite range, its austenite grains start small and grow with temperature and time. The grain size of the austenite at the moment of quenching, called the prior austenite grain size, carries through into the martensite: coarse austenite grains give coarse, more brittle martensite, more prone to quench cracking. Induction's short heating times normally keep the grains fine. Overheating, from too much power, too long a heat or a coil that concentrates the field, coarsens them.

Prior austenite grain size is measured on a polished section etched to reveal the old grain boundaries, by counting grains or measuring intercept lengths, and expressed as a grain size number, G, where a higher number is finer. The KEVOS® [Grain size acceptance](/tools/grain-size-acceptance/) tool averages up to five field readings, converts them to G, and checks the average and the spread between fields against a specification. Its guide notes that it assumes equiaxed grains and gives only a rough average from five fields.

This is an illustration. The IH-40 specification asks for a prior austenite grain size of G 7 or finer in the case. The manufacturer measures the mean lineal intercept on five fields of a sectioned check shaft.

```figure
type: compare
title: Prior austenite grain size in two IH-40 cases
cols: Field intercepts, µm | Average intercept, µm | Average G | Result against G 7 or finer
rowhead: Shaft
- * Proven setting, 4 s heat | 14, 16, 15, 17, 15 | 15.4 | 8.75 | accept
- Overheated, 6 s heat at the same power (Chapter 3) | 45, 60, 52, 70, 48 | 55.0 | 5.08 | reject: too coarse
caption: This is an illustration. From the grain size acceptance tool, intercept mode. The overheated case's grains are about 3.6 times larger across, a direct record of the extra energy the operator's change put into the surface.
```

## The decarburised skin

Hot-rolled steel bar comes from the mill with a thin surface layer that has lost some of its carbon to the furnace atmosphere during rolling: a decarburised skin, typically a few tenths of a millimetre deep on bar of this size. Low-carbon steel cannot harden fully, so if the skin is left on, the induction-hardened surface is softer than the case beneath it, and the hardness traverse (Chapter 8) shows a characteristic dip at the surface.

The IH-40's journal is turned from 42 mm bar to 40.4 mm before hardening and ground to its 40 mm finish afterwards, so about 0.8 mm per side is removed before hardening, more than the decarburised depth, and a further 0.2 mm per side after. Parts made from bar left close to its rolled size, or from forgings with scale and decarburisation on their surfaces, need the same thought: either machine the skin away before hardening, or allow for the softer surface in the grinding allowance. A heat that is too long or too hot can also decarburise the surface slightly in air, though induction's short times usually keep that small.

## Hardenability, alloy and section

A steel's hardenability is its ability to form martensite to a given depth when quenched: how slowly it can be cooled and still harden. Plain carbon steels have low hardenability and must be cooled very fast. For induction hardening, where only a thin surface layer is quenched by an intense spray, plain carbon steel is usually enough: the surface cools fast regardless. Hardenability matters more for deeper cases, for larger sections whose surfaces are cooled less intensely, and where a stronger core is wanted. Steels with chromium and molybdenum, of the type widely sold as 4140, are induction hardened for heavily loaded shafts, often from the quenched and tempered condition, for exactly those reasons. Higher hardenability brings a higher risk of quench cracking, because the martensite forms more readily in awkward places such as fillets and hole edges (Chapter 9).

### What to ask the steel supplier for

The certificate should state the grade and its chemical analysis, the bar's size and its delivery condition, normalised in the IH-40's case, and, where the specification requires it, the hardness. Incoming inspection then checks what matters to the process: the Brinell hardness as a proxy for the condition, the size, and on new suppliers a microsection showing the structure and the decarburised depth.

## The error: bar supplied annealed

This is an illustration. One delivery of bar came from a different mill, through a stockist who had run short of the usual supply. The certificate showed the right steel grade and composition, and the bar looked identical. Shafts machined from it were hardened on the proven recipe.

The routine case check found surface hardness of 560 to 610 HV1, the low end at or below the 600 minimum, and a case with scattered soft patches when the section was etched: islands of ferrite that had not fully transformed. The incoming Brinell test, which the goods-in inspector had skipped because the certificate looked right, was done afterwards on an offcut.

```figure
type: compare
title: Two deliveries of IH-40 bar
cols: Mean Brinell diameter, mm | Hardness, HBW 10/3000 | Within 180 to 230? | Structure | Response to the 4 s heat
rowhead: Delivery
- * Usual supply, normalised | 4.15 | 212 | yes | ferrite and fine pearlite | full martensite in the case
- Substitute supply, annealed | 4.60 | 170 | no | coarse pearlite and large ferrite patches | soft patches; surface 560 to 610 HV1
caption: This is an illustration. The substitute bar's composition met the grade; its heat treatment condition did not match the order, and the certificate did not state it.
```

At 170 HBW, the substitute bar was below the 180 minimum, and a microsection confirmed a coarse annealed structure. Its ferrite patches had not finished transforming to austenite in the seconds of heating at the IH-40's settings, and they quenched to soft ferrite instead of martensite. Raising the temperature might have hardened it, at the cost of coarser grains and more distortion, but the right answer was to reject the bar. The lesson was not that the stockist or the mill had done anything dishonest: annealed bar of that grade is a legitimate product, and the certificate described it correctly as far as it went. The lesson was that the induction recipe had been proved on one starting condition and silently depended on it, and that nothing in the incoming checks had been set up to notice a different one. The manufacturer quarantined the batch, returned the bar, made the incoming Brinell test a hold point that releases bar to machining, and required its stockists to state the heat treatment condition on every certificate.

## Exercise: a quenched and tempered bar

This is an illustration. For a higher-duty variant, the manufacturer considers buying the same steel quenched and tempered at the mill, with a specified hardness of 250 to 300 HBW.

1. A Brinell test with 3,000 kgf and a 10 mm ball gives diameters of 3.65 and 3.67 mm. What is the hardness, and is it within specification?
2. What does the tool's steel rule of thumb give for its tensile strength?
3. How might the induction recipe change for this bar, and how would you prove it?

**Worked answer.**

1. Mean 3.66 mm. HBW = 2 × 3,000 ÷ [π × 10 × (10 − √(100 − 3.66²))] = **275 HBW**, within 250 to 300. The ratio 0.366 is within 0.24 to 0.6.
2. 3.45 × 275 = about **950 MPa**.
3. A quenched and tempered structure has fine, evenly spread carbides and responds faster, so the same case may be reached with a slightly lower temperature or shorter heat, with finer grains and less distortion. The core is also stronger, which suits a higher-duty shaft. The new recipe must be proved by sectioned parts, case depth, surface hardness and grain size, before production.
