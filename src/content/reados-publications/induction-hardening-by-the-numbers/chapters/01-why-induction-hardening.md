---
book: induction-hardening-by-the-numbers
chapterSlug: why-induction-hardening
order: 1
title: "Why induction hardening"
description: "What induction hardening does and why it is used: a hard, wear-resistant case on a tough core, heat made inside the part by eddy currents, the steps of the process and the numbers that control it."
draft: false
---

Many steel parts need two incompatible properties at once. A shaft journal running in a bearing or a seal needs a hard surface that resists wear and pitting. The same shaft needs a tough core that will bend slightly rather than crack under shock and fatigue. Hardening the whole shaft would make it hard and brittle; leaving it soft would let its journal wear out. Surface hardening gives each region what it needs: a thin, hard case over a softer, tougher core.

Induction hardening is one of the fastest and most controllable ways to do it. It heats only the surface layer, in seconds, by generating heat inside the steel itself, then quenches it before the heat has time to spread. This chapter explains how it works, introduces the running case, sets out the steps and the numbers that control each one, and describes a part that was hardened all over when only its journal needed it.

## The running case

This is an illustration. A drive-line manufacturer in Dandenong, Victoria, makes the IH-40 drive shaft for agricultural machinery. Its bearing journal is induction hardened.

- **Shaft:** 400 mm long, 40 mm in diameter at the journal, 3.95 kg, in a medium-carbon steel of about 0.45% carbon, of the type widely sold as 1045, bought as normalised bar with a hardness of 180 to 230 HB.
- **Hardened zone:** the 100 mm long bearing journal.
- **Specification:** surface hardness 600 to 720 HV1; effective case depth 2.0 to 3.0 mm, defined on the drawing as the depth at which hardness falls to 500 HV1; no hardening in the keyway or the shoulder fillet.
- **Equipment:** a 30 kHz solid-state generator rated at 80 kW, a single-shot coil that surrounds the whole 100 mm journal, with an integral spray quench, a 2,000 L polymer quench tank with a 10 kW chiller, and a 30 kW air-circulation tempering oven.
- **Production:** 120 shafts an hour on one machine.

Each chapter takes up one part of the process: choosing the frequency, sizing the power and time, coils and scanning, the steel's transformation, quenching, tempering, measuring the case, distortion and cracking, and control.

## Heat made inside the part

An alternating current in a copper coil produces an alternating magnetic field around it. Place a steel bar inside the coil and the changing field induces currents in the bar, circulating around its circumference, called eddy currents. The bar's electrical resistance turns those currents into heat, exactly where they flow. Nothing touches the part; no flame or furnace atmosphere heats its surface from outside. The heat is generated in the metal.

The induced currents are not spread evenly through the bar. They crowd towards its surface, and their strength falls off roughly exponentially with depth. The depth over which most of them flow, called the reference or penetration depth, depends on the frequency of the current and on the steel's electrical resistivity and magnetic permeability. Higher frequency confines the current, and so the heat, to a thinner layer. That single relationship is what makes induction hardening a surface process, and Chapter 2 is devoted to it.

```figure
type: svg
title: Induced current in a bar inside a coil
alt: A cross-section of a round bar is shown inside a single-turn coil drawn as a ring around it. The outer band of the bar, one reference depth thick, is shaded as the region carrying most of the induced current. Arrows around the band show the current circulating opposite to the coil current. The core of the bar is unshaded. A label marks the reference depth, and another notes that the current falls off exponentially from the surface.
caption: The induced current, and so the heat, is concentrated in a surface band about one reference depth thick. The core is heated mainly by conduction from that band, which is why time matters as much as frequency.
viewbox: 0 0 640 320
body:
<circle class="bx" cx="320" cy="160" r="140"/>
<circle class="bxa" cx="320" cy="160" r="115"/>
<circle class="bxi" cx="320" cy="160" r="85"/>
<path class="la draw" pathLength="1" d="M320 52A108 108 0 1 1 319 52"/>
<path class="ah" d="M430 150L428 164L440 158Z"/>
<path class="ln" d="M435 160H520"/>
<path class="ln" d="M405 160H435"/>
<text class="txb" x="525" y="150">reference depth</text>
<text class="tx txs" x="525" y="170">most of the current</text>
<text class="tx txs" x="270" y="165">core: heated by conduction</text>
<text class="tx txs" x="40" y="40">coil current</text>
<text class="tx txs" x="40" y="300">induced current flows opposite</text>
```

## The steps of the process

Induction hardening is a short sequence, and each step has a controlling number.

```figure
type: steps
title: Induction hardening a journal, step by step
caption: The whole sequence for one IH-40 journal takes under half a minute. Each step's number is set and checked in a later chapter.
- Heat the surface layer above its hardening temperature | frequency sets the depth of heating (Chapter 2); power and time set the energy and temperature (Chapter 3)
- Move the coil along the journal, or heat the whole length at once | scan speed or single-shot time (Chapter 4)
- The heated layer turns to austenite | depends on the steel's carbon and its starting structure (Chapter 5)
- * Quench immediately | the austenite turns to hard martensite if cooled fast enough (Chapter 6)
- Temper at a low temperature | relieves stress and some brittleness (Chapter 7)
- Measure surface hardness and case depth | on sectioned parts (Chapter 8)
- Check distortion and cracks | Chapter 9
```

### Heating only what needs heating

Heating a surface layer instead of a whole part also saves energy. This is an illustration. The 3 mm layer of the IH-40's 100 mm journal that must reach hardening temperature weighs about 0.27 kg (Chapter 3). Heating it from 20 to 900 °C with a mean specific heat of 0.6 kJ/(kg·K) takes about 145 kJ. Heating the whole 3.95 kg shaft to the same temperature in a furnace would take 3.95 × 0.6 × 880 = 2,086 kJ, more than fourteen times as much, before counting the furnace's own losses. The energy per part is one reason induction hardening is economical at high volumes, and its consistency from part to part is the basis of the process monitoring in Chapter 10.

### Why so fast?

Induction heats a 3 mm surface layer of the IH-40 journal to about 900 °C in roughly 4 seconds. A furnace would take many minutes to bring the whole shaft to the same temperature, and would harden it through, not just at the surface. The speed has three benefits. Only the surface is heated, so the core keeps its toughness and the part distorts less. The short time at temperature leaves little opportunity for grain growth or surface scaling and decarburisation. And the process fits into a production line, one part every 30 seconds, with every part treated identically.

The speed also brings the process's main difficulty. With the heat applied in seconds, small changes in time, power, coupling or position make large differences in temperature and depth, and nothing can be checked by eye while it happens. Control comes from fixing every variable, monitoring the energy delivered to each part, and sectioning parts regularly to see the result (Chapter 10).

## Induction compared with other surface hardening

Induction hardening is one of several ways to harden a surface, and each suits different parts.

```figure
type: compare
title: Common surface hardening methods
cols: How the case is made | Typical case depth | Suits
rowhead: Method
- * Induction hardening | heat the surface of a medium-carbon steel and quench it | about 0.5 to 6 mm | shafts, axles, gears, journals; high volumes; local zones
- Flame hardening | as induction, heated by a gas flame | similar, less uniform | large or one-off parts, repairs
- Carburising and hardening | add carbon to a low-carbon steel's surface by diffusion, then harden | about 0.5 to 2 mm | gears and parts needing very hard, deep cases with tough cores
- Nitriding | diffuse nitrogen into an alloy steel at a lower temperature, no quench | thin, a fraction of a millimetre | precision parts that must not distort
caption: Typical ranges are indicative only. The choice depends on the steel, the part's size and shape, the volume, the distortion allowed and the property needed.
```

Carburising, covered in [Carburising the shaft](/reados/publications/diffusion-by-the-numbers/carburising-the-shaft/), builds a high-carbon case on a low-carbon steel, so it can produce a harder case on a tougher core, but it takes hours in a furnace and treats the whole part unless areas are masked. Induction works only on steels that already contain enough carbon to harden, typically 0.35% to 0.55%, but treats exactly the zone needed in seconds.

## Hardness, the measure of the result

Every induction hardening specification is written in hardness, so it is worth being clear about the scales. Hardness tests press an indenter into the surface and measure the result. Brinell uses a ball and suits soft and coarse materials, such as the IH-40's normalised bar. Rockwell measures the depth of indentation under two loads and is quick for production checks of hard surfaces. Vickers presses a square-based diamond pyramid and measures the two diagonals of the square indentation; because its indentations can be made very small, it is the scale used for hardness traverses through a case (Chapter 8). The IH-40's drawing specifies the case in Vickers, HV1, meaning a test force of 1 kilogram-force.

The WORKOS [Vickers and Knoop hardness from indentation](/tools/vickers-knoop-hardness/) tool turns an indentation into a hardness. From the test force and the measured diagonal, or the long diagonal for a Knoop indenter, it gives the hardness, the indentation's depth, and the least thickness of specimen or layer that the indentation needs. For Vickers, the depth is about one-seventh of the diagonal and the least thickness about 1.5 diagonals.

This is an illustration. A surface check of a hardened IH-40 journal with a 10 kgf Vickers test gives a mean diagonal of 0.165 mm. The tool reports about 680 HV10, inside the 600 to 720 specification, with an indentation 23.6 µm deep, needing a layer at least 0.25 mm thick. The case is about ten times thicker than that, so the surface test measures the case and not the softer steel beneath it. A Knoop indenter, whose long, narrow indentation is only about one-thirtieth as deep as it is long, is used where even shallower layers must be tested.

Hardness conversions between scales, Vickers to Rockwell C for example, are made with published tables for particular classes of steel. They are approximate, and a specification written in one scale should be tested in that scale wherever possible.

## The error: a shaft hardened all over

This is an illustration. Before the induction machine was bought, the manufacturer had its first IH-40 shafts hardened by a heat treater using a furnace and a water quench. The whole shaft was heated, quenched and tempered to a hardness that met the journal's specification.

In service, two shafts broke within a few months, both at the keyway at the drive end, far from the journal. The fracture faces showed fatigue cracks that had started at the corners of the keyway and grown across a section that was hard all the way through. A fully hardened medium-carbon steel is strong but notch-sensitive: a sharp keyway corner in hard martensite starts a fatigue crack far more readily than the same corner in the tougher normalised steel. The keyway and shoulder had been hardened along with the journal, though nothing on the drawing asked for it.

The heat treater had done exactly what was asked: the order said "harden to 600–720 HV" with no zone marked, and a furnace treatment hardens everything. The manufacturer's engineer changed the specification to say what the shaft actually needed, and in doing so made the case for induction: hard journal only; keyway, shoulder fillet and core as supplied. Induction could do exactly that. The journal would get its hard case, and the keyway and the shoulder would keep the toughness of the normalised bar. Chapter 9 returns to the shoulder fillet, the place where a hardened case ends and a new risk begins.

## Where induction hardening is used

Induction hardening suits parts with simple, round or regular surfaces that need a local hard zone: shafts and axles, journals and bearing seats, gear teeth (hardened tooth by tooth or all round), crankshaft pins, track pins and rollers, splines, cam lobes and machine slideways. It suits high volumes, because each part takes seconds and the setup, once proved, repeats exactly; and it suits large parts that would be difficult to fit in a furnace, because only the zone being hardened is heated. It suits less well complex shapes with sharp edges, holes and thin sections, which overheat and crack, and very small production runs where the coil and setup cost cannot be spread.

## Working safely at an induction machine

Induction machines bring hazards that a furnace shop does not have. The generator and coil carry high currents at high frequency and, inside the generator, high voltages; the machine's interlocks and guards keep people away from them, and only competent people work inside the cabinets. The coil's magnetic field heats any metal near it, including rings, watches, tools and anything metallic in a person's body, and can affect active medical implants; people with implants should get medical advice before working near the coil. The part comes out of the coil at 900 °C, the quench produces steam and spray, and the quench polymer is a slip hazard on the floor. The manufacturer's machine is enclosed and interlocked, and its risk assessment covers each of these under its duties under the model WHS laws.

## The numbers that matter

Induction hardening is quick to describe and full of interacting variables. The chapters that follow take them one at a time:

- the reference depth, from frequency, resistivity and permeability, and how it changes when steel passes its Curie point (Chapter 2);
- the energy into the heated layer, the power and the heating time (Chapter 3);
- the coil, its coupling to the part and the scan speed (Chapter 4);
- the steel's carbon, its starting structure and its grain size (Chapter 5);
- the quench and its tank (Chapter 6);
- the tempering load (Chapter 7);
- the hardness traverse and the effective case depth (Chapter 8);
- distortion, quench cracks and residual stress (Chapter 9);
- monitoring and control in production (Chapter 10).

## Exercise: what to harden

This is an illustration. A second shaft, IH-55, has two bearing journals, a splined end and a cross-drilled oil hole through one journal.

1. Which zones need induction hardening, and which should be left as supplied?
2. What hazard does the cross-drilled hole create in a hardened journal?
3. What would you ask the designer before quoting?

**Worked answer.**

1. The **two bearing journals** need a hard case for wear. The **splines** may need hardening too, depending on their duty, and need a separate assessment. Shoulders, undercuts, keyways and the core should generally be left as supplied unless their duty requires otherwise.
2. The edge of a hole concentrates induced current, so it **overheats** during heating and is also a stress concentration during quenching; hardened hole edges are a common site of **quench cracks** (Chapter 9).
3. Whether the hole can be drilled after hardening or chamfered generously, what case depth and surface hardness each zone really needs, and where each hardened zone may end. The answers decide the coil design, the scan pattern and the inspection plan.
