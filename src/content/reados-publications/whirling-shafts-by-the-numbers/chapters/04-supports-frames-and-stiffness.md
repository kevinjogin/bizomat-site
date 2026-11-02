---
book: whirling-shafts-by-the-numbers
chapterSlug: supports-frames-and-stiffness
order: 4
title: "Supports, frames and stiffness"
description: "How flexible bearings, pedestals, frames and mountings lower a shaft's critical speed: springs in series, a bump test that found a soft mezzanine, overhung parts and machines on isolators."
draft: false
---

Every critical speed so far has assumed rigid bearings: the shaft bends, and nothing else moves. Real bearings sit in housings, bolted to pedestals or a base frame, which stand on a floor, a plinth or a steel structure. Each of those bends a little under the rotating force, and each adds flexibility in series with the shaft. The effect is always to lower the critical speed, and on a machine mounted on a light structure it can lower it a long way.

This chapter shows how to include the supports in a critical speed estimate, applies it to the HM-30, and describes the installation in which a perfectly good production machine ran close to its critical speed because of what it was standing on.

## Springs in series

Think of the HM-30 rotor, as in Chapter 1, as a single mass at mid-span. When it moves sideways by a distance x, two things give way: the shaft bends, and each bearing support deflects. For a mass midway between two equal supports, each support carries half the force and so deflects by F ÷ (2k_b), and that movement appears at the mass undiminished. The shaft and supports act as two springs in series:

```figure
type: formula
title: Shaft and supports as springs in series
formula: 1 ÷ k_eff = 1 ÷ k_shaft + 1 ÷ (2 × k_b)
formula: Critical speed with flexible supports: n_c,flexible = n_c,rigid × √(k_eff ÷ k_shaft)
caption: For a mass at mid-span on two equal supports. The softer of the two springs dominates: a support much softer than the shaft controls the critical speed, however stiff the shaft is.
- k_shaft | shaft stiffness at mid-span, 48 E I ÷ L³ for simple supports, N/mm
- k_b | stiffness of each bearing support in the direction considered, N/mm
- k_eff | combined stiffness seen by the rotor, N/mm
```

The second formula is exact only for the single central mass, but the same factor applied to a better rigid-bearing estimate, such as Chapter 2's Dunkerley value, is a sound and simple approximation when the rotor is compact and near mid-span, as the HM-30's is.

### How stiff is a support?

A support's stiffness is that of everything between the shaft and the ground, in series: the bearing itself, its housing, the bolts holding the housing down, the pedestal or frame, the floor or structure and its own supports. Rolling bearings are very stiff, typically hundreds of kilonewtons per millimetre or more. Cast pillow-block housings on a heavy fabricated base grouted to a concrete plinth are stiff as well. The weak links are almost always lower down: a light fabricated base frame, pedestals with thin webs, shims that do not bear fully, and above all a steel floor or mezzanine.

This is an illustration. The HM-30's shaft, 90 mm in diameter on a 1,000 mm span, has a mid-span stiffness of 48 × 200,000 × 3,220,623 ÷ 1,000³ = 30.9 kN/mm.

```figure
type: compare
title: HM-30 first critical speed with flexible supports, 90 mm shaft
cols: Combined stiffness, kN/mm | Critical speed factor | Critical speed, rpm | Running 2,950 rpm as a share
rowhead: Stiffness of each support
- Rigid | 30.9 | 1.000 | 4,081 | 72.3%
- 200 kN/mm | 28.7 | 0.963 | 3,932 | 75.0%
- 100 kN/mm | 26.8 | 0.931 | 3,798 | 77.7%
- 50 kN/mm | 23.6 | 0.874 | 3,567 | 82.7%
- * 41 kN/mm (the mezzanine, below) | 22.5 | 0.852 | 3,478 | 84.8%
caption: This is an illustration. The factor √(k_eff ÷ k_shaft) is applied to Chapter 2's rigid-bearing Dunkerley estimate. Supports must be several times stiffer than the shaft before their effect becomes small.
```

The HM-30's margin was not generous to begin with: 72.3% against a limit of 75%. Supports of 200 kN/mm each, six times the shaft's own stiffness, are enough to use it all up. The maker's specification for installation therefore requires the mill to stand on a concrete plinth or an equivalent stiff base, and states the minimum support stiffness its design assumes.

```figure
type: line
title: HM-30 critical speed against support stiffness
x: Stiffness of each support, kN/mm
y: First critical speed, rpm
ymin: 3000
ymax: 4200
mark: 200 | running speed reaches 75% of critical
caption: This is an illustration. Rigid-bearing Dunkerley estimate 4,081 rpm, shaft stiffness 30.9 kN/mm. The curve approaches the rigid value slowly; at 1,000 kN/mm per support the critical speed is still about 0.8% below it.
- 25 | 3208
- 41 | 3478
- 50 | 3567
- 100 | 3798
- 200 | 3932
- 400 | 4004
- 1000 | 4050
```

### The bearings themselves

The HM-30 runs in spherical roller bearings, whose stiffness is high and nearly independent of speed, so for this machine the housings and what lies beneath them matter far more than the bearings. Machines with fluid-film (plain) bearings are different. The oil film is a spring and a damper whose stiffness depends on the speed, the load, the oil's viscosity and the clearance, and is often comparable with the shaft's own stiffness. Its critical speeds therefore move with the operating conditions, and a calculation with rigid bearings can be a long way out. Fluid-film bearings also bring their own instability, oil whirl, in which the film drives the shaft round at a little under half the running speed; it is described, with its symptoms and cures, in [Plain or rolling, and diagnosing failures](/reados/publications/plain-bearings-by-the-numbers/plain-or-rolling-and-failure-diagnosis/).

### Supports also add damping

Supports do one useful thing as well as lowering the critical speed: they add damping. Grout, concrete, bolted joints and oil films all dissipate a little energy each cycle, and that damping limits the peak response at a critical speed, as Chapter 1 showed. A machine on a stiff but well-damped foundation tolerates a passing resonance far better than one on a lively steel frame. For machines that run below their first critical speed, like the HM-30, stiffness is the priority; for machines that must pass through a critical speed on every start, damping matters as much.

### Different stiffness in different directions

A support is rarely equally stiff in every direction. A pedestal bolted to a plinth is usually much stiffer vertically, where it bears on the concrete, than horizontally, where it relies on its webs and bolts in bending. A rotor on such supports has two first critical speeds, one for vertical and one for horizontal motion, and its orbit near either is an ellipse rather than a circle. The lower one, almost always horizontal, governs, and a vibration survey that measures only vertically can miss it. The HM-30's maker measures both directions on every test and installation.

## The error: a mill on a mezzanine

This is an illustration. A customer installed an HM-30 on the steel mezzanine floor of an existing feed shed, bolted through a light base frame to two universal beams that also carried a conveyor. Nothing about the mill had changed from the factory-tested production model, which had run smoothly on its test plinth.

On site, the mill ran roughly. The customer's electrician measured the vibration on the bearing housings at 9.8 mm/s, horizontally, almost all at running speed, against about 2 mm/s on the maker's test plinth. The customer asked for the rotor to be rebalanced. The maker's service technician did something else first: with the mill stopped and isolated, a bump test on each bearing housing.

```figure
type: steps
title: What the bump test showed
caption: This is an illustration. The support stiffness is back-calculated from the measured frequency using the series-spring formula and the rigid-bearing estimate of 4,081 rpm.
- Bump test, horizontal, on the stopped mill | ringing at 58 Hz, or 3,480 cpm
- Running speed as a share of that frequency | 2,950 ÷ 3,480 = 84.8%: well inside the near-critical band
- Back-calculate the effective stiffness | k_eff = 30.9 × (3,480 ÷ 4,081)² = 22.5 kN/mm
- * Back-calculate each support's stiffness | 1 ÷ (2k_b) = 1 ÷ 22.5 − 1 ÷ 30.9, so k_b = 41 kN/mm
- Same test on the maker's plinth, from the test records | ringing at 66 Hz, 3,960 cpm, support stiffness about 249 kN/mm
```

The rotor was not badly balanced. The mezzanine's beams, spanning several metres between columns, were acting as soft springs under the mill's pedestals, lowering the critical speed into the running range. Rebalancing would have reduced the force the rotor produced, but the response to every newton of it would still have been amplified several times.

The fix was structural. The customer's structural engineer added two short columns from the ground floor slab to the beams directly under the mill's pedestals, and a stiff cross-beam between them. A repeat bump test gave 67 Hz, slightly better than the factory plinth, putting the running speed at 73.4% of the measured natural frequency, and the running vibration fell to 2.4 mm/s with no change to the rotor's balance. The maker added a line to its installation manual: "Mount on a concrete plinth or a structure with each bearing support at least 200 kN/mm stiff; on any suspended floor, have a structural engineer confirm the stiffness or carry out a bump test before commissioning."

### Why the test plinth hid the problem

The factory test was not wrong. It proved that the rotor, shaft and bearings were sound on a stiff foundation, which is all a factory test can do. What it could not prove was how the mill would behave on a foundation nobody had seen. The lesson the maker took was to make its test conditions part of the product's documentation: the test record now states the plinth, the support stiffness it represents and the bump-test frequency measured on it, so that a site whose frequency is lower can be recognised at once.

## Measuring and improving support stiffness

A support's stiffness can be measured as well as estimated. The simplest way is a static push: with the machine stopped and isolated, push the bearing housing sideways with a calibrated jack braced against something solid, and read the movement with a dial gauge on a separate stand. This is an illustration. On the customer's mezzanine, a horizontal push of 5.0 kN on the drive-end housing moved it 0.12 mm, a stiffness of 5.0 ÷ 0.12 = 42 kN/mm, which agreed well with the 41 kN/mm back-calculated from the bump test. The push test has the advantage of showing where the movement happens: a second dial gauge on the beam flange showed that almost all of it was the beam, not the base frame.

When a support is too soft, the fixes follow from the series-spring formula. The softest element controls, so stiffening anything else achieves little. Typical fixes, roughly in order of how often they are the answer:

- **Seat the machine properly.** A pedestal that rocks on its base, a "soft foot", is held only by the bending of its bolts. Shim it until all feet bear evenly before tightening, and torque the bolts to the specified value.
- **Grout the base.** A fabricated base frame bolted to a slab with gaps under it is far softer than one fully grouted.
- **Add a plinth.** A concrete block cast on the slab, with the machine grouted to it, is stiff and adds mass that reduces the movement transmitted to the building. A long-standing rule of thumb makes the block several times the mass of the machine it carries.
- **Prop or stiffen the structure.** On a suspended floor, posts or bracing directly under the supports, as on the mezzanine, are usually more effective than heavier beams.

```figure
type: checklist
title: Installing a rotating machine on a new foundation
caption: The open item is the one the customer skipped: nobody asked how stiff the mezzanine was until the mill was running.
- Foundation type and stiffness checked against the maker's minimum | before the machine arrives
- ? Bump test or push test on the installed machine before full-speed running | compared with the factory test
- Feet shimmed so that none rocks; bolts torqued | no soft foot
- Base grouted or plinth cast as specified | no voids under the frame
- Vibration measured vertically and horizontally at first run | the softer direction governs
```

## Overhung components

Some rotors carry parts outside their bearings: a pulley, a fan impeller, a coupling half. An overhung mass has its own critical speed, set by the stiffness of the overhang, which acts as a cantilever from the nearer bearing. The KEVOS® [Shaft critical (whirling) speed](/tools/critical-speed/) tool covers this case with its fixed–free support option: it treats the overhang as a cantilever fixed at the bearing, with an optional disc at its free end, and combines the shaft's own critical speed with the disc's by Dunkerley's method.

This is an illustration. A belt-driven version of the HM-30 was considered, with a 30 kg pulley overhung on the shaft.

```figure
type: compare
title: Overhung 30 kg pulley as a fixed–free cantilever
cols: Shaft alone, rpm | Pulley on a massless shaft, rpm | Combined, rpm
rowhead: Stub diameter and overhang
- 70 mm, pulley centre 250 mm from the bearing | 47,452 | 11,729 | 11,386
- 60 mm, pulley centre 300 mm from the bearing | 28,245 | 6,555 | 6,386
caption: This is an illustration. Fixed–free support option, E = 200 GPa. A fixed end is generous: the bearing and the shaft inside it allow some rotation, so the real values are lower. A longer, thinner overhang loses its margin quickly, because the cantilever's stiffness falls with the cube of its length.
```

The short, stiff stub is far from trouble. The longer, thinner one has lost almost half its critical speed, and with a flexible bearing it would be lower still. Overhung critical speeds can also interact with the main rotor's, because the overhang tilts the shaft at the bearing. Short overhangs and stiff stubs avoid both problems; a pulley should sit as close to its bearing as the belt and guard allow.

Belt tension adds a large steady sideways pull on an overhung pulley, often more than the pulley's weight. A steady load bends the shaft by a fixed amount but does not change its stiffness, so it hardly moves the critical speed. What it does change is the load on the nearer bearing and the bending stress in the stub, which reverses every revolution like the rotor's weight. Those are strength and bearing-life checks, separate from the whirling check, and both must be made for a belt-driven variant.

## Machines on isolators

Rotating machines are often mounted on rubber or spring isolators to stop their vibration reaching a building. The isolators are deliberately soft, so the whole machine has its own rigid-body natural frequencies on them, bouncing and rocking, quite separate from the shaft's whirling. Isolation works only if those rigid-body frequencies are well below the running speed, as [Isolate the fan on springs](/reados/publications/vibrating-machine-elements-by-the-numbers/isolate-the-fan-on-springs/) explains. The machine must then be stiff in itself, usually on a heavy inertia base, so that its bearings are still rigidly held relative to each other. Mounting the HM-30's pedestals on individual isolators, with nothing stiff joining them, would be the worst of both worlds: soft supports for the shaft, and an uncontrolled machine on its springs. The maker's isolated option puts the whole mill and motor on one rigid, concrete-filled base, and the base on isolators.

## Exercise: a stiffer base frame

This is an illustration. Another customer proposes mounting the HM-30 on a fabricated steel base frame, bolted to a concrete slab, that a local engineer estimates gives each bearing support a horizontal stiffness of 120 kN/mm.

1. What combined stiffness does the rotor see?
2. What is the estimated critical speed, and what share of it is the running speed?
3. Does this meet the maker's 25% margin?
4. What would you ask for before commissioning?

**Worked answer.**

1. 1 ÷ k_eff = 1 ÷ 30.9 + 1 ÷ 240 = 0.0324 + 0.0042 = 0.0365, so **k_eff = 27.4 kN/mm**.
2. Factor √(27.4 ÷ 30.9) = 0.941; critical speed 4,081 × 0.941 = **3,841 rpm**; 2,950 ÷ 3,841 = **76.8%**.
3. **No**, just: 76.8% is above the 75% limit. The base is better than the mezzanine but not stiff enough by the maker's rule.
4. Either a stiffer base (the maker's 200 kN/mm minimum), or a bump test on the installed mill showing a horizontal natural frequency of at least 2,950 ÷ 0.75 = 3,933 cpm, or about 65.6 Hz, before the mill is run at full speed.
