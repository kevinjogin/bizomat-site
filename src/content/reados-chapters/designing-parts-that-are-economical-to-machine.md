---
title: "Designing parts that are economical to machine: set-ups, features, tolerances and cutting economics"
description: "Machining cost is set by set-ups, cutting time, tooling and tolerances, most of which the designer controls. Practical design rules and the cutting economics behind a fair price."
publishDate: 2026-10-09
category: "Manufacturing"
tags:
  - manufacturing
  - design
  - process-improvement
author: "KEVOS®"
featured: false
draft: false
---

Machined parts are everywhere in machinery: shafts, housings, brackets, manifolds, spacers, mounting plates and fittings. CNC machining needs no part-specific tooling, starts quickly and can hold tight tolerances, which makes it the default route for many low- and medium-volume parts. It can also be expensive. Two parts that look similar on screen can differ in price by a factor of three, because one needs four set-ups, a small cutter for deep sharp corners and tight tolerances everywhere, while the other can be made in two set-ups with standard tools.

Most of that difference is designed in. The designer decides how many directions the part must be approached from, which corner radii the cutter must leave, how deep the pockets are, which holes are standard sizes and which tolerances are tight. The machinist and programmer then work within those choices. Understanding what drives machining cost lets designers make parts that do the same job for less and lets buyers judge quotes more fairly.

This article explains how machining cost is built up, the cutting economics behind speeds, tool life and machine time, practical design rules for milled and turned parts, how to treat tolerances and finishes, and how to bring it together in a design review. It is general information for designers, engineers and buyers. Capabilities and rates vary between machine shops, so confirm details with the people who will make the parts.

## What a machined part costs

The cost of a machined part is built from several pieces:

- **Programming**: preparing the CNC program in computer-aided manufacturing (CAM) software, usually a one-off cost per part number and revision.
- **Set-up**: fitting fixtures and tools, loading the program and proving the first part. Set-up time is shared across the batch, so small batches carry a large share.
- **Cycle time**: the time the machine spends cutting and moving, charged at the machine hourly rate.
- **Handling**: loading, unloading, turning the part over for each new set-up, deburring and cleaning.
- **Tooling**: cutting tool wear and breakage, plus any special cutters.
- **Material**: the stock, sized to the part plus allowances, and its machinability.
- **Inspection**: first-article inspection, in-process checks and final measurement, which rise steeply with tight tolerances.

A simple model of cost per part is the machine rate multiplied by the cycle time, plus set-up and programming divided by the batch size, plus material, tooling and inspection. The model shows two levers immediately: reduce cycle time, and reduce or share set-ups. The [should-cost modelling](/reados/collections/procurement-and-tendering/should-cost-modelling-for-bought-parts/) article explains how to use this kind of model to judge supplier quotes.

## Cutting speed, feed and machine time

**Cutting speed** is the speed of the cutting edge relative to the work, usually in metres per minute. For turning and milling, spindle speed in revolutions per minute is 1,000 times the cutting speed divided by π times the diameter in millimetres. A cutting speed of 200 m/min on a 50 mm diameter gives about 1,270 rev/min.

**Feed** is how far the tool advances per revolution or per tooth. Machining time for a pass is the length of cut divided by the feed rate. Turning 100 mm of length at a feed of 0.2 mm per revolution and 300 rev/min gives a feed rate of 60 mm/min and a pass time of about 1.7 minutes. Multiply by the passes, add tool changes, rapid moves and handling, and the cycle time follows.

**Power** is the metal removal rate multiplied by the material's specific cutting energy, the energy needed to remove one cubic millimetre. For steels it is roughly 2 to 3 joules per cubic millimetre; aluminium needs about a third of that. Removing 955 cubic millimetres a second from steel at 2.5 J/mm³ needs about 2.4 kW at the cutter, or about 3.2 kW at the motor allowing for drive losses. At low spindle speeds, torque rather than power often limits heavy cuts.

## Tool life and cutting economics

Cutting edges wear. Wear is usually measured as the width of a worn band on the flank of the tool, and tools are changed at a chosen limit, often around 0.3 mm for roughing and less for finishing, well before the edge fails.

**Taylor's tool life equation** describes how tool life falls as cutting speed rises: cutting speed multiplied by tool life raised to a power n equals a constant. The exponent depends on the tool and work materials. With n = 0.25, doubling tool life requires reducing speed only to about 84% of its original value, a cut of about 16%. Conversely, a modest increase in speed roughly halves tool life.

This creates a trade-off. Faster cutting reduces machine time but consumes more tools and more tool changes. Slower cutting saves tools but costs machine time. The total cost per part forms a U-shaped curve with a minimum. Two useful reference points can be calculated:

- **Minimum-cost tool life** equals (1 − n) divided by n, multiplied by the tool change time plus the tool cost per edge divided by the machine cost per minute.
- **Maximum-production tool life** equals (1 − n) divided by n, multiplied by the tool change time alone.

For example, with n = 0.25, a tool change time of 2 minutes, an edge cost of $6 and a machine rate of $2 per minute, the minimum-cost tool life is 3 × (2 + 3), or 15 minutes, and the maximum-production tool life is 3 × 2, or 6 minutes. Running at speeds that give tool lives between 6 and 15 minutes is a reasonable range: towards 15 minutes when the machine has spare capacity, towards 6 minutes when it is a bottleneck. The curve is usually shallow near its minimum, so being roughly right matters more than being exact. Tool makers' recommended speeds and feeds are a good starting point.

## Design rules for milled parts

### Minimise set-ups

Every time a part is turned over or moved to another machine, it needs another set-up, another fixture, more handling and another chance for misalignment. Design so that as many features as possible can be machined from one or two directions. Group holes and pockets on as few faces as possible. Where the part needs many faces machined, five-axis machines can reduce set-ups, but at higher machine rates.

### Leave corner radii the cutter can make

End mills are round, so internal corners of milled pockets always have a radius at least equal to the cutter radius. Sharp internal corners need electrical discharge machining or other special processes. Specify internal corner radii slightly larger than a standard cutter radius, so the cutter can move around the corner rather than stopping in it. Larger radii allow larger, stiffer cutters that remove metal faster.

### Limit pocket depth

Deep, narrow pockets need long, slender cutters that deflect, chatter and must cut slowly. A common guide is to keep pocket depth within about three to four times the cutter diameter. Where a deep cavity is needed, consider opening it up, making it from two parts or using a different process.

### Use standard hole sizes and sensible depths

- **Use standard drill and reamer sizes**, and standard thread sizes.
- **Allow for drill points**: drilled blind holes have a conical bottom. Flat-bottomed holes need extra operations.
- **Limit thread depth**: thread engagement of about 1.5 times the diameter in steel and about 2 times in aluminium is usually enough. Deeper threads add time and tap breakage risk.
- **Allow extra drilled depth** below tapped threads in blind holes.
- **Avoid very deep, small holes**, which need special drills and slow peck cycles.

### Avoid thin walls and unsupported features

Thin walls and tall, slender ribs vibrate and deflect under cutting forces, needing slow, light cuts. Keep walls thick enough to be machined steadily for the material, and support tall features where possible.

### Avoid features that need special tools

Undercuts, internal grooves, T-slots, dovetails and features at odd angles need special cutters or extra set-ups. Use them only where function requires.

### Provide for workholding

Parts need to be held securely. Parallel faces, flat clamping areas and tooling holes help. Thin plates and odd shapes may need custom fixtures, which add cost for small batches.

## Design rules for turned parts

- **Keep features concentric** with the main axis where possible so they can be turned in one set-up.
- **Use standard groove widths** and standard thread forms.
- **Provide thread reliefs** where threads end at a shoulder.
- **Avoid deep internal features** that need long, slender boring bars.
- **Consider mill-turn machines** for parts with both turned and milled features, which can complete the part in one set-up.
- **Use standard bar sizes** to reduce material removal.

## Tolerances, finishes and edges

Tight tolerances and fine surface finishes are among the biggest machining cost drivers. They require slower finishing passes, more stable machines, more careful set-ups, more inspection and sometimes grinding. Apply them only where function needs them, such as bearing bores, locating dowels and sealing faces. Use a sensible general tolerance in the title block for everything else.

Specify surface finish by function. A general machined finish is fine for most faces; fine finishes belong on sliding, sealing or bearing surfaces.

State how sharp edges are to be treated, such as "break all sharp edges", so deburring is consistent without specifying chamfers on every edge.

## Materials and machinability

Material choice affects machining time as much as geometry:

- **Free-machining steels** and **aluminium alloys** such as 6061 cut quickly with good finish.
- **Stainless steels** work harden, so tools must keep cutting rather than rubbing, and speeds are lower.
- **Titanium and nickel alloys** cut slowly and wear tools quickly.
- **Hardened steels** may need grinding or hard turning after heat treatment.
- **Plastics** cut easily but move with heat and may need special tools to avoid melting or burring.

Choose stock sizes close to the finished part and consider near-net blanks, such as cut profiles, castings or forgings, for parts where most of the stock would otherwise become chips.

## CAM programming and repeatability

CNC programs are usually prepared in CAM software from the 3D model. Programming time is a one-off cost per part revision, significant for small batches. Using consistent features, standard cutters and a library of proven machining templates reduces programming time and risk. Keeping fixtures and programs for repeat parts makes reorders quicker and more consistent. First-off inspection after each set-up confirms that the program, tools and set-up are correct before the batch runs.

Machine utilisation matters too. A machine that waits for programs, fixtures or material earns nothing. The [measuring productivity and equipment effectiveness](/reados/collections/lean-and-continuous-improvement/measuring-productivity-and-equipment-effectiveness/) article covers measuring and improving equipment use.

## A worked example

This is an illustrative example. A business machines an aluminium sensor mount in batches of 50, about 600 a year. The part needs four set-ups, has sharp-cornered pockets that need a 3 mm cutter, a pocket 35 mm deep, tolerances of ±0.02 mm on most dimensions, tapped holes three diameters deep and a fine surface finish on every face. Cycle time is about 48 minutes, and each set-up takes about 30 minutes.

**Design review.** The designer and the machine shop review the part:

- Features are rearranged so the part can be machined in two set-ups.
- Internal corner radii are increased to 6 mm, allowing a 10 mm cutter for most of the pocket.
- The deep pocket is reduced to 20 mm, which still meets the function.
- Tight tolerances are kept only on the sensor bore and two dowel holes; everything else follows the general tolerance.
- Thread depth is reduced to two diameters.
- A fine finish is specified only on the sensor seating face.

**Result.** Cycle time falls to about 26 minutes and set-up time per batch from 120 to 60 minutes. At a machine rate of $120 an hour, or $2 a minute, the cost of machine time and set-up falls from about (48 + 2.4) × $2, or $100.80, to about (26 + 1.2) × $2, or $54.40, per part. That saves about $46 per part, or about $28,000 a year at current volumes, before counting reduced inspection.

## Applying this in an Australian business

- **Ask for machining advice** before releasing drawings.
- **Design for one or two set-ups** where possible.
- **Specify internal radii** that suit standard cutters, and limit pocket depth.
- **Use standard holes and threads**, with sensible depths.
- **Reserve tight tolerances and fine finishes** for functional features.
- **Choose machinable materials** and near-net stock where possible.
- **Keep programs and fixtures** for repeat parts.
- **Compare quotes** using a simple cost model.

## Where machined part designs go wrong

- **Sharp internal corners** that a round cutter cannot make.
- **Features on every face**, requiring many set-ups.
- **Deep, narrow pockets** and tall thin walls.
- **Tight tolerances everywhere** from a default template.
- **Non-standard holes and threads** without need.
- **Fine finishes on every face.**
- **Large blocks machined away** when a near-net blank would do.

## Questions to ask before releasing a machined part

- How many set-ups does this part need, and can we reduce them?
- Can standard cutters make every internal corner and pocket?
- Which tolerances and finishes truly matter to function?
- Are holes and threads standard sizes with sensible depths?
- Is the material easy to machine, and is the stock close to final size?
- What will each batch cost, including set-up and programming?

## Bringing it together

Machining cost is largely set at the design stage. Fewer set-ups, internal radii that suit standard cutters, sensible pocket depths, standard holes and threads, and tight tolerances only where they matter can halve the time a part spends on the machine. Understanding cutting economics, including speeds, feeds, tool life and the trade-off between machine time and tool cost, helps businesses run their own machines well and judge suppliers' prices fairly. Review designs with the people who will machine them, keep programs and fixtures for repeat work, and match materials and stock to the part. The result is parts that do the same job and cost much less to make.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® engineering handbooks on machining economics, estimating speeds and machining power, tool wear, cutting tools, CNC programming and machining materials, together with established machining practice. The worked example is illustrative. This article is general information; confirm capabilities and rates with your machine shop.*
