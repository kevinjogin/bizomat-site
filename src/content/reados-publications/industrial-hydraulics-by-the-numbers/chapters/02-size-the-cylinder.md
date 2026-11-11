---
book: industrial-hydraulics-by-the-numbers
chapterSlug: size-the-cylinder-and-rod
order: 2
title: "Size the cylinder and rod"
description: "Choose a hydraulic cylinder's bore from the force and the pressure at the cylinder, then its rod for buckling, return force and area ratio, and see how an oversized rod raises flows and pressures."
draft: false
---

The cylinder is the part of a hydraulic press that everyone looks at, and it is usually chosen first. That is reasonable, because its bore fixes the pressure the whole system must work at, and its rod fixes the flows on the return side. It is also where a well-meant change, such as a thicker rod "for strength", can quietly upset the rest of the design. This chapter sizes the press cylinder from the job in Chapter 1, explains each decision the rod involves, and checks the result with a sizing tool.

The failure case is a cylinder ordered with a 90 mm rod instead of the 70 mm in the design. It would have been stronger, but it would have raised the return flow through the valve and filter by more than 40%, and doubled the pressure that a trapped rod end could reach.

## Start from the pressure at the cylinder

Chapter 1 set two pressure figures: 163 bar gives the rated 200 kN on a 125 mm bore, and the relief valve is to be set at 175 bar. The design question is the other way round: given the force and a pressure the system can reliably deliver at the cylinder, what bore is needed?

The pressure at the cylinder is always a little lower than the pressure at the pump, because oil loses pressure flowing through lines, fittings and valves. At the end of a press stroke the flow is small and those losses are small, so the cylinder sees nearly the full relief setting. This press is designed on **170 bar at the cylinder** for the rated force, leaving 5 bar between the design pressure and the relief setting for losses and for the relief valve's own behaviour, since a relief valve begins to open a little below its set point.

At 170 bar, the minimum bore for 200 kN is:

- area = 200,000 N ÷ 17 MPa = 11,765 mm²
- bore = √(4 × 11,765 ÷ π) = **122.4 mm**

Cylinders come in a series of standard bores. ISO 3320 lists the metric series of bores, rod diameters and area ratios, and makers build to it or close to it. The next standard bore above 122.4 mm is **125 mm**, which at 170 bar pushes 208.6 kN, comfortably above the rating.

### Why not a larger bore at a lower pressure?

A 140 mm or 160 mm bore would give 200 kN at a lower pressure, and lower pressure is gentler on seals, hoses and people. The cost is flow. Speed is flow divided by area, so a bigger bore needs more oil per second for the same approach speed: a 160 mm bore needs about 64% more than a 125 mm bore. That means a bigger pump, bigger valves and lines, more oil in the reservoir and more heat at the same pressure. For a press that spends most of its stroke approaching, the smaller bore at a moderate working pressure is the better balance, provided every component in the circuit is rated for that pressure with a margin. The workshop's supplier stocks valves, hoses and fittings rated above 175 bar as standard items, which settled the matter.

## What the rod has to do

The rod transmits the cylinder's force to the platen. It has four jobs, and each sets a different limit.

```figure
type: checklist
title: The rod's four jobs on the press
caption: This is an illustration. The open item is checked in Chapter 3, where the rod's buckling is assessed by a method that suits a short, stocky rod.
- x Carry the pressing force in compression without buckling | Euler check gives a minimum of about 36 mm
- x Leave enough annulus area for the return force | largest rod for a 30 kN pull is about 116 mm
- x Keep the area ratio, and so the return flows and trapped pressures, moderate | 70 mm gives a ratio of 1.457
- x Resist small side loads from off-centre pressing without bending or wearing the gland | 70 mm chosen from the maker's range
- ? Confirm the buckling margin by a method valid for this slenderness | Chapter 3
```

### Buckling

A long rod pushed from its end can bow sideways and collapse at a load well below the one that would crush it. Euler's formula gives the load at which an ideal straight column buckles: the critical load equals π² times the elastic modulus times the second moment of area, divided by the square of the effective length. For a solid round rod the second moment of area is π × d⁴ ÷ 64, so the critical load rises with the fourth power of the diameter.

The effective length depends on how the ends are held. A cylinder mounted by a rigid flange at the cap end, with its rod end free to move sideways, has an effective length of about twice its actual length, which is the worst case. Held firmly at one end and pinned at the other, it is about 0.7 times the actual length. On this press the cylinder is flange-mounted to the top crosshead and its rod end is fixed to a platen that slides on the four tie rods. The design treats the platen as pinned rather than fixed, a cautious choice, and uses an effective length factor of **0.7** over the **700 mm** from the mounting flange to the rod end at full extension.

The rod must carry the load with a margin, because real rods are never perfectly straight and loads are never perfectly central. This chapter uses a safety factor of 3.5 on the Euler load, which is also the tool's default; the right figure for a real machine comes from the cylinder maker and the designer's assessment.

### Return force and the annulus

On the return stroke, oil pushes on the annulus. The rod takes area away from it, so the thicker the rod, the less return force at a given pressure. The press needs very little return force. The platen and tooling weigh about 180 kg, which is 1.77 kN, and the owner allowed **30 kN** so that the press can pull a part off a tight mandrel. With a 70 mm rod, the annulus of 8,423.4 mm² at 175 bar pulls about 147 kN, far more than needed. The return force sets an upper limit on the rod, not a lower one.

### Area ratio

The area ratio is the full-bore area divided by the annulus area. It matters more than its name suggests, because it multiplies two things.

- **Flow.** While retracting, the cap end empties at the ratio times the flow going into the rod end. Chapter 1 found 58.3 L/min leaving the cap end while 40 L/min goes in. Every component in that path must pass the larger flow.
- **Pressure.** If oil is trapped in the rod end while the cap end is pressurised, the rod-end pressure rises to the cap pressure times the ratio. With a ratio of 1.457 and 175 bar at the cap, that is about 255 bar. Chapter 4 shows how that happens in practice.

The 70 mm rod gives 1.457. A thicker rod raises the ratio quickly, because the annulus shrinks with the square of the rod diameter, as the failure case below shows.

## Check it with the sizing tool

The [Hydraulic Cylinder Sizing tool](/tools/hydraulic-cylinder-sizing/) works from the duty. It takes the push and pull forces, the pressure at the cylinder, the extend and retract speeds and the stroke, an optional chosen bore, the buckling length, the mounting's effective length factor and a buckling safety factor, the rod's modulus, the pump's overall efficiency and the velocity limits for the pressure and return lines. It returns the minimum bore for the push force, the minimum rod for Euler buckling, the largest rod that still gives the pull force, the extend and retract flows, the pump input power, and line bores for the chosen velocities.

```figure
type: compare
title: Hydraulic Cylinder Sizing results for the press
cols: Tool result | What it means for the press
caption: This is an illustration. Inputs: push 200 kN, pull 30 kN, 170 bar at the cylinder, extend 54 mm/s, retract 79 mm/s, stroke 300 mm, bore 125 mm, buckling length 700 mm, factor 0.7, safety factor 3.5, modulus 206 GPa, pump efficiency 85%, line velocities 5 and 3 m/s.
- Minimum bore for push | 122.4 mm | the 125 mm standard bore is enough
- Minimum rod for buckling | 36 mm | a floor; the chosen 70 mm is well above it
- Largest rod for the pull force | 115.7 mm | a ceiling; 70 mm is well below it
- Extend / retract flow | 39.8 / 53.3 L/min | the retract figure assumes the 36 mm minimum rod
- Pump input power | 17.78 kW | one pump giving the largest flow at full pressure
- Pressure / return line bore | 15 / 20.3 mm | a starting point for Chapter 5
- *Largest return flow (area ratio) | 58.2 L/min | the flow leaving the cap end on the return stroke
```

Three of these results need reading with care.

**The retract flow.** The tool calculates retract flow on the annulus left by the minimum rod for buckling, 36 mm, because it does not know which rod you will choose. With the chosen 70 mm rod the annulus is smaller and the flow for 79 mm/s is 8,423.4 mm² × 79 mm/s, about **39.9 L/min**. That is why the press returns at 79 mm/s on the same 40 L/min that drives the approach. Recalculating by hand for the chosen rod is a two-line job.

**The pump input power.** The tool's 17.78 kW is the power one pump would need to deliver the largest flow at the full cylinder pressure, at 85% overall efficiency. It is an honest upper bound for a single fixed pump, and it is the clearest argument for the two-pump arrangement in Chapter 4, which brings the motor down to 4 kW.

**The largest return flow.** The 58.2 L/min is the cap-end outflow at the retract speed, the flow multiplied by the area ratio. It does not depend on the rod choice, because it is simply the full-bore area times the return speed. It is the figure the return line and filter are sized for in Chapters 5 and 8.

The tool's checks report that a rod between 36 mm and 115.7 mm works, and remind the user to round bore and rod to the maker's standard sizes and check again. Its model is Euler buckling with pressure at the cylinder, so for a short, stocky rod such as this one it says nothing about yielding before buckling. Chapter 3 covers that.

## Choosing the 70 mm rod

Within the band from 36 mm to 115.7 mm, the rod was chosen for reasons the tool does not model.

- **Side load.** A press rarely pushes perfectly on its centreline. An off-centre bush, a tilted part or a worn platen guide puts a bending moment into the rod. A stiffer rod bends less and wears its gland less. The platen guides on the tie rods take most side load, but the rod still sees some.
- **Gland length and bearing.** Makers pair each bore with a few rod sizes and design the gland bearing to suit. A 70 mm rod is one of the pairings offered for a 125 mm bore in the chosen maker's range.
- **Area ratio.** As above, 1.457 keeps the return flow and any trapped pressure moderate.
- **Regeneration.** Chapter 7 considers a regenerative approach, where speed depends on the rod area. A 70 mm rod gives a useful speed gain without an extreme one.

A rod end with a spherical or floating coupling between the rod and the platen keeps small misalignments from bending the rod. The platen, not the rod, is guided.

## Seals, speed and the end of stroke

A cylinder's seals have speed and pressure limits set by their maker, and the press's speeds, up to 79 mm/s, are modest. Seal friction matters more at low speed: below a few millimetres per second some seal types stick and slip, which shows as a juddering press. The pressing speed of about 11 mm/s avoids that region.

The return stroke ends when the piston reaches the cap end. The moving parts, about 180 kg at 79 mm/s, carry 0.5 × 180 × 0.079², about **0.56 J** of kinetic energy. That is small, and the cylinder's standard cap-end cushion deals with it. Extension ends on the work, not on the cylinder, so no rod-end cushion is needed. A cylinder that strikes its end caps at speed, by contrast, would need its cushion checked against the maker's energy rating.

## A failure case: the stronger rod

This is an illustration. When the cylinder was ordered, the supplier offered the same 125 mm bore with a **90 mm** rod at a similar price, described as "heavier duty". The owner nearly accepted. The designer recalculated the flows first.

```figure
type: compare
title: The ordered 70 mm rod against the offered 90 mm rod
cols: 70 mm rod | 90 mm rod
caption: This is an illustration. Both with a 125 mm bore, 40 L/min into the rod end on return and 175 bar at the cap end. The trapped rod-end pressure assumes oil cannot leave the rod end while the cap end is pressurised.
- Annulus area | 8,423.4 mm² | 5,910.1 mm²
- Area ratio | 1.457 | 2.076
- Return speed at 40 L/min | 79.1 mm/s | 112.8 mm/s
- Flow leaving the cap end on return | 58.3 L/min | 83.1 L/min
- *Trapped rod-end pressure | about 257 bar | about 366 bar
```

The 90 mm rod would have made the return faster, which sounds good, but every other consequence was bad. The cap end would empty at 83.1 L/min through a valve, lines and return filter sized for less. The return filter would run beyond its rating and its bypass would open, sending unfiltered oil to the tank. And if oil were ever trapped in the rod end, a fault Chapter 4 shows is easy to create, the pressure there could reach about 366 bar, well beyond the ratings of the rod-end seals and line.

The detection was nothing more than recalculating the area ratio and the flows for the offered part. The correction was to keep the 70 mm rod. The general rule is that any change to a cylinder's rod is a change to the whole system's flows and pressures, and must be checked as one.

## How this applies to a small Australian business

Size the bore from the force and the pressure that will actually reach the cylinder, then round up to a standard bore. Check the rod against buckling, against the return force and, most often forgotten, against the area ratio, because the ratio multiplies return flow and trapped pressure. Read a sizing tool's results for what they assume: a tool that does not know your rod cannot give you your retract flow. And treat a supplier's "heavier duty" substitute as a design change, not a free upgrade.

## Exercise: a horizontal pulling ram

The workshop also wants a horizontal ram for pushing shafts out of large impellers. It needs **120 kN** at **160 bar** at the cylinder, a **400 mm** stroke, **15 kN** of pull, an approach of **60 mm/s** and a return of **90 mm/s**. The cylinder is mounted by a flange at its cap end and its rod end is free to move sideways, so the effective length factor is **2**, over a buckling length of **900 mm**. Use a safety factor of 3.5 and a modulus of 206 GPa. What are the minimum bore and minimum rod? If you choose a 100 mm bore with a 63 mm rod, what is the area ratio?

**Worked answer.** The minimum bore is √(4 × 120,000 ÷ (π × 16)) = **97.7 mm**, so the next standard bore, **100 mm**, is used. The Euler minimum rod is the fourth root of 64 × 3.5 × 120,000 × (2 × 900)² ÷ (π³ × 206,000), which is **60.8 mm**; the [Hydraulic Cylinder Sizing tool](/tools/hydraulic-cylinder-sizing/) gives the same figure, and a largest rod for the 15 kN pull of 91.4 mm. A **63 mm** rod sits inside that band. The full-bore area is 7,854 mm², the rod area 3,117.2 mm² and the annulus 4,736.7 mm², so the area ratio is **1.658**. The free rod end makes buckling the governing limit: the same ram with a guided rod end would need a much thinner rod.
