---
title: "Workholding and toolholding: vices, chucks, zero-point systems, tapers and holders"
description: "How standard workholding and toolholding choices affect accuracy, tool life, set-up time and safety, from vices and chucks to zero-point pallets, spindle tapers, collets and shrink-fit holders."
publishDate: 2026-10-16
category: "Manufacturing"
tags:
  - manufacturing
  - process-improvement
  - design
author: "KEVOS"
featured: false
draft: false
---

A machine tool can only be as accurate and productive as the way it holds the workpiece and the cutting tool. A rigid, precise spindle is wasted if the part lifts in the vice, the tool runs out in a worn collet or every set-up takes an hour of indicating and adjusting. Many workshops chasing faster cycle times look first at cutting data or new machines, when the bigger gains sit in workholding and toolholding: set-ups that repeat in minutes, tools that run true, parts that stay put and cut without vibration.

Workholding and toolholding also carry real safety consequences. Parts thrown from chucks, tools pulled from holders and workpieces released mid-cut can cause serious injury and damage. Gripping force, speed limits, pull studs and clamping practice are not details to leave to habit.

This article explains, in general terms, the principles of good workholding, the main standard workholding equipment for milling and turning, modern quick-change and zero-point systems, the main spindle interfaces and toolholders, why runout and balance matter, and how design choices make parts easier to hold. It complements the article on designing custom jigs and fixtures, and is general information; machine, chuck and holder manufacturers' instructions should always be followed.

## What workholding must do

Good workholding performs five jobs:

- **Locate** the part in a known, repeatable position relative to the machine's coordinate system.
- **Clamp** it securely enough to resist cutting forces.
- **Support** it so that it does not deflect or vibrate under the cut.
- **Avoid distortion**, so that the part does not spring out of shape when released.
- **Allow access** for the tools and allow loading and unloading quickly and safely.

Location and clamping are separate functions. Locating features define position; clamps hold the part against them. The classic 3-2-1 principle, which uses six contact points to constrain a part in a predictable way, applies to standard workholding as well as custom fixtures. The [designing jigs and fixtures that pay for themselves](/insights/designing-jigs-and-fixtures-that-pay/) article explains these principles in detail.

## Workholding for milling

### Machine vices

The precision machine vice is the most common milling workholding. Key practices include:

- **Seat the part properly**, on parallels or a step, and check that it has not lifted after clamping.
- **Use soft jaws** machined to the part shape for irregular parts or second operations. They locate and grip better than standard jaws and can be remachined for new parts.
- **Avoid crushing thin parts.** Excessive force distorts parts, which then spring back after release.
- **Consider self-centring vices** for parts where the centre of the stock is the natural datum, and **multiple vices** to machine several parts per cycle.

### Fixture plates, grid plates and modular systems

**Fixture plates** with grids of tapped and dowel holes allow fixtures and stops to be mounted in known positions quickly. **Modular fixturing** systems provide standard locators, supports and clamps that can be assembled into a fixture for a particular part, documented and rebuilt later. They suit small-batch, high-mix workshops where dedicated fixtures are uneconomical.

### Zero-point and quick-change systems

**Zero-point clamping** systems use precision receivers mounted on the machine table and studs fitted to pallets, fixtures or vices. A pallet locks into the same position, typically to within a few micrometres, every time it is loaded. Fixtures can be loaded and set up away from the machine, then swapped in quickly, so the machine keeps cutting while the next job is prepared. For small-batch work, this can transform machine utilisation.

### Other workholding

- **Magnetic chucks** hold ferrous plates without clamps, giving access to the full top surface, and are common in grinding and some milling.
- **Vacuum fixtures** hold thin, flat parts, especially non-ferrous sheet and plastics, without distortion from clamps.
- **Tombstones** on horizontal machining centres hold many parts or fixtures on several faces, increasing parts per load.
- **Five-axis workholding** often raises the part above the table using dovetail fixtures or raised vices, giving tool access to more faces in one set-up.

### Strap clamps and T-slots

Traditional strap clamps on a T-slot table remain useful for large or irregular parts. One rule matters: place the clamping bolt **closer to the workpiece than to the heel block**, so that more of the clamping force goes to the part rather than the heel, and keep the heel slightly higher than the clamping surface so the strap presses down on the part rather than its edge.

## Workholding for turning

| Device | Strengths | Typical uses |
|---|---|---|
| Three-jaw self-centring chuck | Fast, versatile | General turning of round and hexagonal stock |
| Soft jaws | Accurate, repeatable, protect finished surfaces | Second operations, thin-walled parts, precision work |
| Four-jaw independent chuck | Holds irregular or eccentric parts | One-offs, offset features |
| Collet chuck | Excellent accuracy and grip on bar | Bar work, small parts, high speed |
| Between centres | Accurate concentricity along the length | Shafts and long parts |
| Face drivers | Full access to the outside diameter | Shafts needing full-length turning |
| Expanding mandrels | Locate from a bore | Parts where the bore is the datum |
| Steady rests and tailstocks | Support long, slender parts | Shafts with a high length-to-diameter ratio |

### Gripping force and speed

At high spindle speeds, centrifugal force pulls chuck jaws outwards and reduces gripping force. Chuck manufacturers publish maximum speeds and guidance on how gripping force falls with speed and jaw configuration. Exceeding those limits, using oversized or heavy custom jaws without checking, or neglecting chuck lubrication can allow a part to be released. Lathe programs should set a maximum spindle speed appropriate to the chuck and part, and chucks should be maintained according to the manufacturer's instructions.

## Toolholding: spindle interfaces

The interface between the spindle and the toolholder determines how accurately and rigidly the tool is held. Common interfaces include:

- **Morse tapers**, self-holding tapers used for drills, drill chucks and lathe tailstocks.
- **Steep tapers** with a 7:24 taper, used on many machining centres in families such as SK, BT and CAT. They locate on the taper and are retained by a **pull stud**, or retention knob, gripped by the spindle drawbar. **Dual-contact** variants also contact the spindle face, improving rigidity and axial accuracy.
- **HSK** (hollow taper shank) interfaces, which contact both the short taper and the face, offer high rigidity and accuracy at high speeds.
- **Polygon and modular quick-change interfaces**, often used on turning and multi-tasking machines, allow rapid tool changes with good repeatability.

**Pull studs** deserve special attention. They must be the correct type for the spindle, tightened to the specified torque and inspected regularly. A pull stud failure can release a holder from the spindle.

## Toolholders and runout

Within the holder, the cutting tool is gripped by one of several methods:

- **ER collet chucks**: versatile and widely used, accepting a range of shank sizes. Accuracy depends on collet quality, cleanliness and correct tightening.
- **Side-lock (Weldon) holders**: a screw bears on a flat on the tool shank, resisting pull-out in heavy roughing but typically with more runout.
- **Milling chucks**: high-grip holders for heavy milling.
- **Shrink-fit holders**: the holder is heated, the tool inserted and the holder cools to grip the shank, giving excellent concentricity and rigidity with a slim profile.
- **Hydraulic holders**: a pressurised fluid chamber grips the shank evenly, giving good accuracy and vibration damping.
- **Tapping holders**: rigid or tension-compression designs to suit the machine's tapping capability.

**Runout**, the amount by which the cutting edges do not rotate on a true circle, matters because it makes some teeth take larger chips than others. The overloaded teeth wear and chip faster, shortening tool life and degrading finish. For small solid carbide tools, even a small amount of runout can be a significant fraction of the chip thickness. Clean tapers and collets, quality holders and checking runout on critical tools pay back quickly.

At high spindle speeds, **balance** also matters. Unbalanced holders cause vibration, poor finish and spindle wear. Balanced holders and assemblies are recommended for high-speed work.

### Presetting

Measuring tool length and diameter on an **offline presetter** or an in-machine tool setter, rather than by touching off manually, reduces set-up time and offset errors. Presetting also allows tools to be prepared while the machine is cutting.

## Documenting set-ups so they repeat

Even the best workholding loses its value if each set-up depends on one person's memory. A simple set-up record for each repeat job makes results consistent regardless of who sets the machine. A useful record shows:

- the workholding used, such as the vice, jaws, fixture or pallet, with an identifier;
- how the part is located and which faces sit against which stops;
- clamping points and, where it matters, clamping force or torque;
- the work offset and the probing routine used to confirm it;
- the tools, their pockets, holders and stick-out; and
- photographs of the completed set-up and the first part.

Storing soft jaws and custom fixtures with clear labels, and keeping their records with the program, means a repeat job can be set up quickly months later. Over time, these records also reveal which workholding solutions work best and which jobs could share common fixtures.

## Designing parts that are easy to hold

Designers can make workholding simpler:

- **Provide clamping surfaces**: parallel faces, flats or bosses where a part can be gripped without distortion.
- **Use functional datums** that can also serve as locating features.
- **Allow sacrificial stock**: extra material or tabs that hold the part during machining and are removed at the end.
- **Avoid thin, unsupported walls** in areas that must be clamped.
- **Add fixturing holes** where acceptable, so the part can be bolted to a fixture plate.
- **Minimise set-ups**, so that most features can be machined from one or two orientations.

The [designing parts that are economical to machine](/insights/designing-parts-that-are-economical-to-machine/) article covers how set-ups drive cost.

## A worked example

This is an illustrative example. The figures are hypothetical.

A job shop runs a vertical machining centre on small batches of aluminium and steel parts, averaging six set-ups a day. Each set-up involves mounting a vice or fixture on the T-slot table, indicating it square, finding the work offset and loading tools, taking about 45 minutes. The machine stands idle during set-ups.

The shop installs a zero-point system on the table, fits pallets to its two vices and three most-used fixtures, and buys a tool presetter. Vices and fixtures are now loaded and checked on a bench while the machine runs. Changing a pallet takes a few minutes, and work offsets for each pallet are stored and confirmed with a probe. Average set-up time on the machine falls to about 8 minutes.

The time saved is about 37 minutes per set-up. At six set-ups a day, that is 222 minutes, or about 3.7 hours of additional machine time each day. Even allowing for the time spent preparing pallets off the machine, the shop gains substantial capacity without buying another machining centre.

## How this applies to a small Australian business

- **Measure set-up time.** It is often the largest hidden loss in small-batch machining.
- **Standardise workholding.** Common vices, fixture plates and pallets make set-ups repeatable.
- **Prepare off the machine.** Zero-point systems and presetters let set-up happen while the machine cuts.
- **Invest in good holders.** Better runout and rigidity extend tool life and improve finish.
- **Respect speed and grip limits.** Follow chuck, holder and pull stud guidance.
- **Feed lessons back to design.** Clamping surfaces and fewer set-ups make every future part cheaper.

## Common mistakes

- **Clamping on unsupported thin sections**, causing distortion or vibration.
- **Not checking that parts are seated** after clamping.
- **Worn or dirty collets and tapers**, causing runout and poor tool life.
- **Wrong or overtightened pull studs.**
- **Running chucks beyond their rated speed** or with unsuitable jaws.
- **Indicating every set-up from scratch** when a repeatable system would remove the need.
- **Strap clamps with the bolt nearer the heel** than the workpiece.

## Frequently asked questions

**Is a zero-point system worth it for a small shop?** It depends on how many set-ups are done and how often jobs repeat. Shops with frequent changeovers and repeat work often recover the cost quickly through machine time saved.

**Do shrink-fit holders replace collets?** Not entirely. Shrink-fit holders offer excellent accuracy and rigidity for particular tool diameters, while collets remain versatile for a wider range of shanks. Many shops use both.

**How often should runout be checked?** For critical finishing tools and small solid carbide tools, checking when tools are set or changed is good practice; for others, periodic checks of holders and collets catch wear.

## Questions to ask

- How much machine time do we lose to set-ups each week?
- Which fixtures and vices could be palletised for quick change?
- Do we know the runout of our critical tools and holders?
- Are pull studs, chucks and holders inspected and maintained to the manufacturer's guidance?
- Do our part designs provide good clamping surfaces and datums?

## Bringing it together

Workholding and toolholding decide whether a machine's accuracy and power reach the part. Good workholding locates, clamps and supports parts repeatably without distortion; standard vices, chucks, collets, fixture plates and modular systems cover most needs, and zero-point systems move set-up work off the machine. The spindle interface and toolholder determine rigidity, runout and balance, which strongly affect tool life and finish. Respecting grip, speed and pull stud limits keeps people safe. Combined with designs that are easy to hold, these choices often deliver more productivity than a new machine.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. Always follow machine, chuck and toolholder manufacturers' instructions.*
