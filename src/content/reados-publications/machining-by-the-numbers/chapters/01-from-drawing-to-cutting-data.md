---
book: machining-by-the-numbers
chapterSlug: from-drawing-to-cutting-data
order: 1
title: "From drawing to cutting data"
description: "The handful of quantities that govern every machining operation, where trustworthy cutting data comes from, and the pump flange used as a continuous example."
draft: false
---

Every machining operation can be described by a small set of numbers. How fast the cutting edge passes the material. How far the tool advances each revolution or each tooth. How deep and how wide it cuts. From those few values follow the spindle speed, the feed rate, the metal removal rate, the power, the time and, eventually, the cost.

People who machine every day often know good values by feel. That knowledge is valuable, but it is hard to transfer, hard to check and easy to stretch beyond the conditions where it was learned. Calculation gives a common language between the machinist, the programmer, the estimator and the customer. It also catches the expensive mistakes: the feed entered per minute instead of per revolution, the spindle that cannot reach the speed the program assumes, or the quote that forgets the time spent between cuts.

This chapter introduces the basic quantities, the sources of cutting data and the fictional part that runs through the book.

## The basic quantities

The table lists the quantities used throughout the book, with the symbols commonly used by tool suppliers.

| Quantity | Symbol | Unit | Meaning |
|---|---|---|---|
| Cutting speed | vc | m/min | Speed of the cutting edge relative to the work surface |
| Spindle speed | n | rev/min | Rotational speed of the work (turning) or tool (milling, drilling) |
| Feed per revolution | fn | mm/rev | Tool advance per revolution in turning and drilling |
| Feed per tooth | fz | mm/tooth | Advance per cutting edge in milling |
| Feed rate | vf | mm/min | Linear speed of the tool along its path |
| Depth of cut | ap | mm | Engagement measured along the tool axis in milling, or radially in turning |
| Width of cut | ae | mm | Radial engagement of a milling cutter |
| Metal removal rate | Q | cm³/min | Volume of material removed per minute |
| Net cutting power | Pc | kW | Power consumed at the cutting edge |
| Cutting time | tc | min | Time the tool is actually cutting |

Most of the arithmetic in machining links these quantities with simple geometry. Cutting speed relates to spindle speed through the circumference of the work or tool. Feed rate is feed per revolution, or per tooth, times the number of teeth and revolutions per minute. Removal rate is cross-sectional area of the cut times feed rate. Power is removal rate times the energy needed to remove each unit of volume. Each relationship is derived in a later chapter.

```figure
type: steps
title: From three cutting choices to time and cost
caption: Each arrow is one of the simple relationships derived in Chapters 2 to 9.
- Cutting data | cutting speed vc, feed f, depth ap
- Machine settings | spindle speed n and feed rate vf
- Removal rate | Q, volume removed per minute
- Power and torque | Pc from Q and specific cutting force
- Time | cutting time from length and feed rate
- *Cost | time × machine rate, plus tools
```

## Where cutting data comes from

No formula tells you the right cutting speed for a material. Cutting speed and feed are empirical: they come from testing. There are three common sources:

- **Tool supplier data.** Catalogues, online tools and application engineers give starting values for each tool, grade and material group, usually for a stated tool life and reasonably stable conditions. They are the best starting point for modern tooling.
- **Handbooks.** General reference works give speed and feed tables for broad material and tool groups. They are useful for older or generic tools and for sense-checking, but cannot reflect every modern grade and geometry.
- **Your own records.** Values proven on your machines, with your fixtures, coolant and materials, are the most relevant data of all, provided they are recorded with the conditions under which they were achieved.

A starting value is not a final value. Real machines differ in rigidity, power and spindle condition. Workholding may allow vibration. Material from one supplier may machine differently from another. The calculations in this book show what a set of cutting data implies for time, power and deflection, so that adjustments can be made deliberately.

```figure
type: compare
title: Three sources of cutting data
cols: Strength | Limitation
caption: Start from the supplier, sense-check with handbooks and record what your own machines prove.
- Tool supplier data | Specific to the tool, grade, geometry and material group | Assumes stable conditions and a stated tool life
- Handbooks | Broad coverage; useful for generic tools and checks | Cannot reflect every modern grade or geometry
- *Your own records | Proven on your machines, fixtures and coolant | Only valid with the conditions recorded beside them
```

## Units and conversions

Most mistakes in cutting data are unit mistakes. Three precautions prevent most of them:

1. **Keep feed per revolution and feed rate separate.** Lathes are usually programmed in millimetres per revolution and machining centres in millimetres per minute. A turning feed of 0.25 mm/rev entered as 0.25 mm/min would barely move the tool; the reverse would crash it.
2. **Use diameter, not radius, in speed formulas.** Turning programs often work in diameter on the X axis. Cutting speed depends on circumference, πD.
3. **Convert imperial data carefully.** Older handbooks and some suppliers use surface feet per minute and inches per revolution. Multiply surface feet per minute by 0.3048 for metres per minute, and inches by 25.4 for millimetres.

Writing the units next to every number in a calculation, and checking that they cancel properly, is the simplest and most effective error check. The READOS chapter on [SI units and calculation checking](/reados/collections/engineering-design-practice/si-units-and-calculation-checking/) covers the habit in more detail.

## The Harbourline pump flange

Harbourline Precision is a fictional small job shop with two CNC lathes, a vertical machining centre, a bandsaw and a small inspection room. A customer has asked for a quote on 120 pump flanges, with possible repeat orders, and wants to know how the price would change for 30 or 500.

The flange, part PF-100, is made from medium-carbon steel bar, similar to AISI 1045, 110 mm in diameter. Its main features are:

| Feature | Size |
|---|---|
| Flange outside diameter | Ø100, 20 mm thick |
| Spigot | Ø60, 10 mm long, on the back of the flange |
| Overall length | 30 mm |
| Bore | Ø40 H7, through |
| Bolt holes | 6 × Ø11 through the flange on an 80 mm pitch circle |
| Tapped holes | 2 × M8 × 1.25, 14 mm thread depth, in the spigot face |
| Flat | 30 mm wide across the outside diameter, for orientation |

Harbourline's estimator plans the work in three machining operations after sawing blanks 34 mm long:

- **Operation 10, lathe, first side:** face, drill and bore Ø40, rough and finish turn the Ø100 outside diameter.
- **Operation 20, lathe, second side:** face to length, rough and finish the Ø60 spigot and the back face of the flange.
- **Operation 30, machining centre:** drill the six bolt holes, drill and tap the two M8 holes, face mill the flat.

Later chapters calculate speeds, feeds, power and tool life for each operation. Chapter 10 builds the full cycle time and Chapter 11 the quotation.

```figure
type: svg
title: Harbourline's PF-100 pump flange and its three operations
alt: Half section of a flange: a 100 millimetre diameter flange 20 millimetres thick with a 60 millimetre spigot 10 millimetres long on the back, a 40 millimetre bore through, a bolt hole and a tapped hole. Labels show which operation machines each feature.
caption: Blanks are sawn 34 mm long from Ø110 bar; the operations below follow sawing.
viewbox: 0 0 640 330
body:
<path class="cl" d="M40 250H600"/>
<path class="bx" d="M120 250V50H220V150H300V250Z"/>
<path class="fp" d="M120 250V210H300V250Z"/>
<rect class="bxi" x="160" y="70" width="22" height="100"/>
<path class="lf dsh" d="M171 60V180"/>
<rect class="bxi" x="232" y="168" width="68" height="16"/>
<path class="la draw" pathLength="1" d="M120 50H220M120 50V250"/>
<path class="la draw" pathLength="1" d="M220 150H300V250"/>
<path class="li" d="M120 210H300"/>
<text class="txb" x="330" y="60">Op 10, lathe</text>
<text class="tx" x="330" y="80">face, drill and bore Ø40, turn Ø100</text>
<text class="txb" x="330" y="140">Op 20, lathe</text>
<text class="tx" x="330" y="160">face to 30 long, turn Ø60 spigot</text>
<text class="txb" x="330" y="220">Op 30, machining centre</text>
<text class="tx" x="330" y="240">drill 6 × Ø11, tap 2 × M8, mill flat</text>
<text class="tx" x="88" y="150" text-anchor="end">Ø100</text>
<text class="tx" x="306" y="196">Ø60</text>
<text class="tx" x="210" y="275" text-anchor="middle">Ø40 bore (axis)</text>
<text class="tx" x="150" y="40">Ø11 hole</text>
<text class="tx" x="240" y="205">M8</text>
```

## What the numbers cannot tell you

Calculation is a guide, not a guarantee. It cannot see a worn spindle bearing, a blunt edge on a fresh insert, an inconsistent bar from a new mill or a clamp that lets the part chatter. Machine tools also have limits that formulas do not respect on their own: maximum spindle speed, available torque at low speed, axis feed limits, the maximum swing and the safe operating envelope of chucks and fixtures. Chuck manufacturers, for example, specify maximum speeds and gripping forces that must not be exceeded regardless of what a cutting speed calculation suggests.

Safe work comes first. Guarding, interlocks, correct workholding, chip control and safe procedures for loading, measuring and changing tools are not optional and are not affected by any calculation in this book. Safe Work Australia's code of practice on managing the risks of plant, listed in the references, is a good starting point for the wider obligations.

## Common mistakes

- **Treating catalogue data as exact.** It is a starting point for stated conditions.
- **Mixing feed per revolution and feed per minute.**
- **Calculating with radius instead of diameter.**
- **Ignoring machine limits** on speed, power and torque.
- **Estimating only cutting time.** Chapter 10 shows that non-cutting time is often larger.

## Questions to ask

- Where did this cutting data come from, and for what tool, grade, material and tool life?
- Which machine will run the job, and what are its speed, power and torque limits?
- Are all feeds and speeds in consistent units?
- What has been proven on our own machines for similar work?

## Exercise: build a data sheet

Choose one tool you use often. Record the supplier's starting values for cutting speed and feed for your most common material, the conditions they assume and the values you actually run. Note any difference and the reason for it. A small library of such sheets is one of the most useful assets a workshop can build.

The next chapter turns cutting speed into spindle speed and shows what happens on a lathe as the tool approaches the centre of a face.
