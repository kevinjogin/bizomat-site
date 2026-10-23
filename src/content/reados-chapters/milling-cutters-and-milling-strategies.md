---
title: "Milling cutters and milling strategies: speeds, feeds, chip thickness and parts that are easy to mill"
description: "How milling works, the main cutter types, climb versus conventional milling, calculating speed and feed, chip thinning, adaptive toolpaths, chatter and design rules that make milled parts cheaper."
publishDate: 2026-10-16
category: "Manufacturing"
tags:
  - manufacturing
  - design
  - process-improvement
author: "KEVOS"
featured: false
draft: false
---

Milling is the process behind most machined parts that are not round: housings, brackets, plates, manifolds, moulds, fixtures and countless components with pockets, slots, faces and profiles. A rotating cutter with several teeth removes material as the workpiece or cutter moves along a programmed path. Modern CNC machining centres and CAM software have made milling faster and more capable than ever, but the fundamentals still decide whether a job runs smoothly or produces broken tools, poor finish and long cycle times.

Those fundamentals matter beyond the workshop. Designers who understand how parts are milled can avoid features that force small, slow tools or extra set-ups. Buyers who understand milling can read quotes more intelligently and ask better questions. Managers who understand it can see why investment in toolholding, workholding and programming often pays back faster than a new machine.

This article explains, in general terms, how milling works, the main cutter types, climb and conventional milling, how cutting speed and feed are calculated, why chip thickness matters, how modern adaptive toolpaths change the approach, what causes chatter and the design rules that make parts easier and cheaper to mill. It is general information. Tool manufacturers' data for a specific cutter and material should always guide actual cutting parameters.

## How milling removes material

In milling, each tooth of the cutter takes a small chip as it passes through the material. Two depths describe the engagement:

- **Axial depth of cut** (often written ap): how deep the cutter engages along its axis.
- **Radial depth of cut** (often written ae): how much of the cutter's diameter is engaged sideways, sometimes called stepover or width of cut.

**Face milling** uses the end of the cutter to machine a flat surface, typically with a large indexable cutter. **Peripheral** or **side milling** uses the cutter's flutes to machine walls and profiles. **Slotting** engages the full diameter, the most demanding condition for chip evacuation and heat.

## The main cutter types

| Cutter | Typical use | Notes |
|---|---|---|
| Square end mill | Pockets, slots, shoulders, profiles | The general-purpose tool; sharp or small-radius corners |
| Corner-radius (bull-nose) end mill | Pockets and shoulders needing strength at the corner | Stronger edges and longer life than sharp corners |
| Ball-nose end mill | 3D surfaces, moulds, fillets | Finish depends on stepover; scallops remain between passes |
| Face mill | Large flat surfaces | Usually indexable inserts; efficient and economical |
| Shoulder mill | Square shoulders and faces | Indexable or solid |
| Roughing end mill | Heavy material removal | Serrated edges break chips; rougher finish |
| High-feed mill | Fast roughing at shallow depth | Small lead angle directs force axially, allowing high feed |
| Chamfer, T-slot, dovetail and form cutters | Specific features | Often needed only because of design choices |

The number of **flutes** matters. Fewer flutes leave more room for chips, which suits soft, gummy materials such as aluminium. More flutes give more cutting edges and a stronger core, which suits steels and finishing passes. Cutter **material** and **coating** matter too: solid carbide dominates small-diameter CNC milling, high-speed steel remains useful for manual work and some special profiles, and indexable carbide inserts are common for larger cutters.

## Climb and conventional milling

The direction of the cut relative to rotation changes how each chip is formed.

- In **climb milling** (down milling), the tooth enters the material at maximum chip thickness and exits at minimum. Chips are thrown behind the cutter, cutting forces push the workpiece into the table and tool life and finish are usually better.
- In **conventional milling** (up milling), the tooth enters at zero thickness and exits at maximum, rubbing briefly before cutting.

On rigid CNC machines with backlash-free ball screws, climb milling is generally preferred. On older manual machines with backlash in the table screw, climb milling can pull the table into the cut, so conventional milling is safer. Conventional milling can also help when cutting through a hard scale or skin, where entering at zero chip thickness is less damaging to the edge.

## Calculating speed and feed

Two families of numbers set the cut: how fast the cutting edge moves through the material and how much material each tooth removes.

**Cutting speed** (Vc), in metres per minute, is the speed of the cutting edge at the cutter's diameter. It depends mainly on the workpiece material and the cutter material. The spindle speed follows from it:

n (rev/min) = (1000 × Vc) ÷ (π × D), where D is the cutter diameter in millimetres.

**Feed per tooth** (fz), in millimetres, is the thickness of material each tooth is intended to remove. The table feed rate follows from it:

vf (mm/min) = fz × z × n, where z is the number of flutes.

The **material removal rate** (Q), in cubic centimetres per minute, is ap × ae × vf ÷ 1000, with depths in millimetres.

Starting values for Vc and fz come from the tool manufacturer's data for the material, the cutter and the engagement. Experience and testing then refine them for the machine and set-up.

## Chip thickness and chip thinning

Tools wear best when each tooth takes a chip of the right thickness. Too thin, and the edge rubs instead of cutting, generating heat and wear. Too thick, and the edge may chip or the tool may break.

When the radial engagement is less than half the cutter diameter, the actual maximum chip thickness is smaller than the programmed feed per tooth, because each tooth only engages a short arc of its rotation. This effect is called **radial chip thinning**. To maintain the intended chip thickness, the feed per tooth must be increased. For a straight-fluted geometry, the maximum chip thickness is approximately:

h = fz × √(1 − (1 − 2 × ae ÷ D)²)

At 10% radial engagement, the expression under the square root is 1 − 0.8² = 0.36, and its square root is 0.6, so the actual chip is only 60% of the programmed feed per tooth. Running light radial passes without compensating for chip thinning is a common reason tools rub, overheat and wear quickly.

```figure
type: svg
title: Chip thinning at light radial engagement
alt: A cutter tooth entering the work at 10 percent radial engagement takes a chip only 60 percent as thick as the programmed feed per tooth, because it meets the material at a shallow angle.
caption: At 10% engagement the chip is 60% of the programmed feed, so the feed per tooth can rise to keep the chip load.
viewbox: 0 0 600 220
body:
<circle class="bx" cx="200" cy="120" r="80"/>
<path class="lf spin" d="M130 120H270M200 50V190"/>
<rect class="fp" x="264" y="30" width="300" height="180"/>
<path class="la" d="M264 30V210"/>
<path class="fa" d="M266 70Q275 120 266 170L270 170Q283 120 270 70Z"/>
<text class="tx txs" x="290" y="60">ae = 10% of D</text>
<text class="txb" x="420" y="120" text-anchor="middle">chip 0.6 × fz</text>
<text class="tx txs" x="200" y="124" text-anchor="middle">cutter</text>
```

## Adaptive and high-efficiency toolpaths

Traditional pocketing toolpaths alternate between light cuts and heavy engagement in corners, where the cutter suddenly wraps around more material. Those spikes in load cause heat, deflection and tool breakage, so programmers reduce feeds for the whole job to survive the worst moments.

Modern CAM systems offer **adaptive**, **trochoidal** or **high-efficiency milling** toolpaths that keep radial engagement roughly constant throughout the cut. They typically use a light radial engagement with a deep axial depth, often using much of the flute length, and compensate the feed for chip thinning. Benefits include:

- more consistent tool load, reducing breakage;
- heat spread along the whole flute length rather than concentrated at the tip;
- longer tool life and often shorter cycle times; and
- the ability to cut slots and pockets with tools smaller than the feature, avoiding full-width engagement.

These strategies work best on rigid machines with good acceleration, secure workholding and suitable toolholders.

## Rigidity, deflection and chatter

Many milling problems come down to rigidity. **Chatter**, a self-excited vibration that leaves a characteristic pattern on the surface and damages tools, results from the interaction between the cutting forces and the flexibility of the cutter, holder, spindle, workpiece and fixture.

Common remedies include:

- **Shorter tool stick-out.** Deflection rises steeply with overhang; even a small reduction helps.
- **Better toolholders.** Shrink-fit and hydraulic holders typically offer better concentricity and grip than basic collet or side-lock holders for many applications.
- **Stiffer workholding.** Thin walls and poorly supported parts vibrate. The [designing jigs and fixtures that pay for themselves](/reados/collections/manufacturing-operations-and-design-for-manufacture/designing-jigs-and-fixtures-that-pay/) article explains locating and clamping principles.
- **Variable helix or pitch cutters**, which disrupt the regular tooth-passing frequency that sustains chatter.
- **Changing spindle speed.** Moving away from a resonant combination of speed and structure can stabilise the cut.
- **Lighter radial engagement with appropriate feed.** Adaptive strategies often reduce chatter.

Deflection also affects accuracy. A long, slender cutter finishing a deep wall may leave the wall tapered or oversize. Finishing with a shorter, stiffer tool or a light spring pass improves accuracy.

## Design rules that make parts easier to mill

Many milling costs are set by the design. Practical rules include:

- **Internal corner radii.** A rotating cutter cannot make a sharp internal vertical corner. Specify internal corner radii slightly larger than a standard cutter radius, so the cutter can move smoothly around the corner rather than stopping and plunging. Matching the radius to the cutter exactly forces full engagement in the corner.
- **Pocket depth.** Deep, narrow pockets require long, slender tools that must cut slowly. As a broad guide, pockets deeper than about three to four times the cutter diameter become noticeably more expensive.
- **Floor corner radii.** Use a radius that matches a standard corner-radius cutter, or a sharp corner if a square end mill is acceptable.
- **Thin walls.** Thin walls vibrate and deflect. Make them as thick as function allows, and avoid tall unsupported walls.
- **Standard sizes.** Slot widths and radii that match standard cutters avoid special tools and extra passes.
- **Access.** Features that can be reached from one or two orientations avoid extra set-ups. Undercuts need special cutters.
- **Tolerances and finishes.** Tight tolerances and fine finishes require finishing passes, which add time. Apply them only where function needs them.

The [designing parts that are economical to machine](/reados/collections/machining-and-metal-parts/designing-parts-that-are-economical-to-machine/) article develops these principles across both milled and turned parts.

## A worked example

This is an illustrative example. The cutting values below are assumed starting points chosen only to show the calculation; real values must come from the tool manufacturer's data for the specific cutter and material.

A workshop is roughing a pocket in 6061 aluminium with a 12 mm, three-flute carbide end mill. It assumes a cutting speed of 300 m/min and a target chip thickness of 0.06 mm.

**Spindle speed:** n = (1000 × 300) ÷ (π × 12) = 300,000 ÷ 37.7 ≈ 7,960 rev/min.

**Conventional slotting approach:** the programmer runs a full-width slot (ae = 12 mm) at an axial depth of 6 mm with fz = 0.06 mm. The feed rate is 0.06 × 3 × 7,960 ≈ 1,430 mm/min. In the pocket corners the engagement spikes, and the cutter occasionally chatters.

**Adaptive approach:** the programmer switches to a constant-engagement toolpath with ae = 1.2 mm (10% of the diameter) and an axial depth of 18 mm (1.5 times the diameter). Because of chip thinning at 10% engagement, the actual chip is only 60% of the programmed feed per tooth, so to keep a 0.06 mm chip, the programmed fz becomes 0.06 ÷ 0.6 = 0.10 mm. The feed rate is 0.10 × 3 × 7,960 ≈ 2,390 mm/min.

The adaptive path engages more of the flute length, keeps the load steady and avoids the corner spikes. In this case the workshop finds tool life improves and chatter disappears, and the cycle time for the pocket falls modestly. The exact gains depend on the machine, holder and part, which is why the programmer trials the change on one part before adopting it.

```figure
type: compare
title: Roughing a pocket two ways
cols: Full-width slotting | Adaptive toolpath
best: 2
caption: A 12 mm three-flute cutter at about 7,960 rev/min in 6061, both aiming for a 0.06 mm chip.
- Radial engagement | 12 mm, full width | 1.2 mm, 10%
- Axial depth | 6 mm | 18 mm
- Feed per tooth | 0.06 mm | 0.10 mm, allowing for thinning
- *Feed rate | About 1,430 mm/min, chatter in corners | About 2,390 mm/min, steady load
```

## How this applies to a small Australian business

- **Use tool data, then refine.** Start from manufacturers' recommendations and record what works on your machines.
- **Compensate for chip thinning.** Light radial passes need higher feed per tooth.
- **Invest in holding.** Better toolholders and fixtures often improve results more than a new machine.
- **Keep tools short.** Minimise stick-out on every job.
- **Use modern toolpaths** where your machine and CAM software support them.
- **Feed design lessons back.** Share corner radii, pocket depth and wall-thickness rules with designers and customers.
- **Standardise tools.** A standard tool library simplifies programming, setting and purchasing.

## Common mistakes

- **Copying speeds and feeds between materials or tools** without checking data.
- **Running light radial passes at slotting feeds**, causing rubbing and premature wear.
- **Excessive tool stick-out**, leading to chatter and poor accuracy.
- **Climb milling on machines with backlash**, which can damage the part or machine.
- **Designing sharp internal corners or very deep narrow pockets** without considering tool access.
- **Specifying tight tolerances everywhere**, forcing unnecessary finishing passes.
- **Blaming the machine for chatter** without checking holder, stick-out and workholding.

## Frequently asked questions

**Should we always use climb milling?** On rigid CNC machines it is usually the better default, but conventional milling remains appropriate on machines with backlash and for some hard-skinned or scaled surfaces.

**Do adaptive toolpaths suit every machine?** They work best on machines with good acceleration, rigid spindles and secure workholding. On lighter machines, the same principle of steady engagement still helps, but feeds may need to be more conservative.

**How do we reduce the number of cutters we stock?** Standardise internal corner radii, slot widths and hole sizes in your designs, and build a preferred tool library that programmers and designers both use.

## Questions to ask

- Are our cutting parameters based on tool data and refined by testing, or copied from habit?
- Do our programs compensate for chip thinning in light radial cuts?
- Where do we lose most time or tools in milling, and why?
- Could better toolholders or workholding improve finish and tool life?
- Are our designs specifying corner radii, pocket depths and wall thicknesses that suit standard tools?
- Do our CAM strategies make use of constant-engagement toolpaths where suitable?

## Bringing it together

Milling performance rests on a few fundamentals: the right cutter for the material and feature, the right cutting speed and chip thickness, the right direction of cut, sufficient rigidity in tool, holder, machine and workholding, and toolpaths that keep the load steady. Chip thinning, adaptive toolpaths and chatter control turn those fundamentals into shorter cycle times and longer tool life. Designers can help just as much as programmers, by specifying corner radii, pocket depths, wall thicknesses and tolerances that suit standard tools and simple set-ups.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. Always follow tool manufacturers' recommendations for a specific tool and material.*
