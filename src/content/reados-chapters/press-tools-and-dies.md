---
title: "Press tools and dies: how sheet metal parts are blanked, pierced and formed in volume"
description: "How press tools work, punch and die clearance, estimating press force, single, compound, progressive and transfer dies, strip layout, forming and springback, press safety and when tooling pays."
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

Look around almost any room and you will find parts made in a press: brackets, hinges, clips, washers, electrical terminals, appliance panels, latch components, hardware and countless pieces inside vehicles and machines. Press tools, also called dies, turn flat sheet or coil into finished parts in a fraction of a second each. For parts made in thousands or millions, nothing else comes close on cost per part.

Press tools are also a significant investment, often tens of thousands of dollars for a progressive die, and they take weeks or months to design, build and prove. Decisions made in the part design and the tool design determine how well the tool runs, how long it lasts, how much material it wastes, what quality of edge and form it produces and whether the part needs secondary operations. And because presses deliver very large forces at speed, they carry serious safety risks that require proper guarding and safe systems of work.

This article explains, in general terms, how blanking and piercing work, why punch and die clearance matters, how to estimate press force, the main types of dies, strip layout and material utilisation, forming and springback, press selection, die maintenance, press safety and how to judge when hard tooling pays compared with laser cutting and bending. It is general information. Tool designers, toolmakers and press manufacturers should be consulted for specific tools and equipment.

## Cutting operations: blanking and piercing

**Blanking** cuts the outside shape of a part from sheet; the piece that falls through the die is the part. **Piercing** cuts holes or internal shapes; the piece that falls through is scrap, called a slug. Related operations include **notching** (cutting from an edge), **lancing** (cutting without removing material, often before forming a tab), **trimming** and **parting**.

In all of these, a punch pushes the material into a die opening. The material first deforms, then a burnished, sheared band forms, then cracks from the punch and die edges meet and the remainder fractures. The cut edge therefore has a characteristic profile: a rounded **rollover** zone, a smooth **burnish** zone, a rougher **fracture** zone and a **burr**. The proportions depend on the material, thickness, clearance and tool condition.

### Punch and die clearance

The gap between the punch and the die is called the **clearance**, usually expressed as a percentage of material thickness on each side. It strongly affects:

- edge quality, with the size of the burnish, fracture and burr zones;
- the force required;
- tool wear and the tendency to chip; and
- dimensional accuracy of holes and blanks.

Too little clearance increases force and wear and can cause secondary shearing. Too much clearance increases burr height and rollover. Appropriate clearance depends on the material type, strength and thickness, and toolmakers use established guidelines and experience. Harder and stronger materials generally need larger clearance.

The size of a pierced hole is controlled by the **punch**, and the size of a blank is controlled by the **die**. Clearance is applied to the other component. The burr appears on one side of the part, and its direction should be specified on drawings where it matters for assembly or safety.

### Estimating cutting force

A useful first estimate of the force needed to blank or pierce is:

F = L × t × τ

where L is the length of the cut perimeter, t is the material thickness and τ is the shear strength of the material, often approximated as a proportion of its tensile strength. Additional force may be needed for stripping the material off the punch, for any forming in the same stroke and for a safety margin. Staggering punch lengths or adding shear angles to punches can reduce peak force.

## Types of dies

| Die type | How it works | Suits |
|---|---|---|
| Single-station die | One operation per stroke | Simple parts, low to medium volumes |
| Compound die | Blanks and pierces in one stroke at one station | Flat parts needing good concentricity between features |
| Progressive die | Strip advances through several stations, with a different operation at each; the part separates at the last station | High-volume parts with several features and forms |
| Transfer die | Parts are separated early and moved between stations by a transfer system | Larger parts and deeper forms in volume |
| Line dies | Separate dies in separate presses or positions, with parts moved between them | Large parts such as panels |
| Fine blanking | Special tooling and presses that produce fully sheared, smooth edges | Precision parts such as gears and latch components |

**Progressive dies** dominate high-volume small parts. The strip is fed a fixed distance each stroke, called the **pitch**. **Pilots** engage holes pierced at an early station to locate the strip accurately at each subsequent station. The part may remain attached to a **carrier** strip until it is cut off at the end.

### Key die components

Most dies share common components:

- **Die set** or shoes, with **guide pillars and bushes** to align the upper and lower halves.
- **Punches**, held in a punch plate, and **die blocks** or inserts with the cutting openings.
- **Stripper plates**, fixed or spring-loaded, that strip the material off the punches on the return stroke and often hold the strip flat.
- **Pilots**, **stock guides** and **lifters** to locate and move the strip.
- **Springs** or **gas springs** providing stripping and pad forces.
- **Forming punches and dies** for bends and draws.

Punch and die materials are selected for wear resistance and toughness to suit the material being cut and the volumes expected.

## Strip layout and material utilisation

In high-volume pressing, material is usually the largest share of part cost. The **strip layout** decides how parts are nested in the strip, the width of the strip, the pitch and the **bridges** or **webs** of material left between parts and at the edges. Good layouts:

- maximise the number of parts per unit of material, often by nesting parts alternately or at angles;
- leave enough web to keep the strip strong and accurately fed;
- orient parts relative to the rolling direction where bends or strength depend on it; and
- plan where scrap falls and how it is removed.

Small changes to the part design, such as adjusting an outline so parts nest more closely, can noticeably reduce material cost over high volumes.

## Forming operations

Press tools often form as well as cut:

- **Bending** in dies produces flanges, tabs and angles. Bend radii must suit the material and thickness, and the bend line's orientation relative to the rolling direction affects cracking.
- **Springback** occurs because the material partly recovers elastically after forming. Dies compensate by overbending, bottoming or coining the bend.
- **Drawing** forms cups and shells by pulling sheet into a die cavity under a blank holder. The depth achievable in one draw is limited, and deeper parts need several draws.
- **Embossing, coining and flanging** create ribs, local features and stiffening.

The [designing sheet metal parts for economical manufacture](/reados/collections/manufacturing-operations-and-design-for-manufacture/designing-sheet-metal-parts-for-manufacture/) article explains bend radii, hole positions and other sheet metal design rules that apply equally to pressed parts.

## Choosing a press

Press selection considers:

- **Tonnage**: the force capacity, with margin above the calculated requirement and attention to where in the stroke the force is needed, since mechanical presses deliver rated force only near the bottom of the stroke.
- **Shut height and bed size**: the die must physically fit.
- **Stroke and speed**: suitable for the forming depth and production rate.
- **Press type**: mechanical presses suit fast cutting and shallow forming; hydraulic presses offer full force through the stroke and suit deep forming; servo presses offer programmable motion profiles.
- **Feeding and automation**: coil feeds, straighteners and part handling for progressive work.

## Die maintenance

Press tools wear. Cutting edges dull, increasing burrs and force; springs fatigue; guides wear; slugs pull back and damage dies. Good maintenance includes:

- recording hits, so sharpening and maintenance can be scheduled before quality deteriorates;
- monitoring burr height and part dimensions as indicators of wear;
- sharpening punches and dies correctly, maintaining clearance and adjusting shut height for material removed;
- inspecting springs, pilots, guides and fasteners; and
- storing dies clean, protected and identified.

## Press safety

Power presses and press brakes are among the most hazardous machines in manufacturing because they apply very large forces at speed between tool surfaces where hands may be placed. Controls include fixed and interlocked guards, presence-sensing devices such as light curtains, two-hand controls where appropriate, safe tool and die-setting procedures, blocks or locking devices during die setting and maintenance, and regular inspection of safety systems.

These controls sit within an employer's duties under work health and safety legislation. Machinery safety in Australia is commonly supported by the AS/NZS 4024 series of standards, and regulators publish guidance on presses. Competent advice should be obtained when installing, modifying or guarding presses.

## When press tooling pays

Hard tooling has a high fixed cost and a low cost per part. Laser or turret punching followed by press brake bending has little fixed cost but a higher cost per part. As an illustration, suppose a bracket costs $4.50 each made by laser cutting and bending, or could be made in a progressive die costing $38,000 at $0.60 each. The total costs are equal when $38,000 + $0.60n = $4.50n, so 3.90n = 38,000, or at about 9,700 parts. If annual demand is 20,000 parts and the design is stable, the die pays back in about half a year. If demand is 2,000 parts a year, or the design is likely to change, laser cutting and bending is the better choice.

```figure
type: line
title: Laser and bend against a progressive die
x: Parts made
y: Total cost ($'000)
ymin: 0
ymax: 100
caption: Break-even at about 9,700 parts; at 20,000 a year with a stable design, the $38,000 die pays back in about half a year.
legend: Laser and bend at $4.50 | Die $38,000 + $0.60
- 0 | 0 | 38
- 5000 | 22.5 | 41
- 9700 | 43.7 | 43.8
- 15000 | 67.5 | 47
- 20000 | 90 | 50
```

The [choosing a cutting process for plate and sheet](/reados/collections/machining-and-metal-parts/choosing-a-cutting-process-for-plate-and-sheet/) article compares profile-cutting options for lower volumes.

## A worked example

This is an illustrative example. The figures are hypothetical, and force estimates are simplified.

A manufacturer plans a progressive die for a mild steel bracket 3 mm thick. The total cut perimeter per part, including the outline and four holes, is about 300 mm. Taking a shear strength of about 350 MPa for the material, the estimated cutting force is:

F = 300 mm × 3 mm × 350 N/mm² = 315,000 N, or 315 kN.

That is roughly the weight of 32 tonnes. Adding allowances for stripping force, a bending station and a safety margin, the toolmaker recommends a press of at least 60 tonnes capacity with suitable bed size and shut height, and staggers the punch lengths so that the holes and outline are not cut at the same instant, reducing peak force.

```figure
type: steps
title: Estimating the press for a progressive die
caption: Stripping force, a bending station and a safety margin come on top of the cutting force.
- Cut perimeter | about 300 mm
- Thickness × shear strength | 3 mm × 350 N/mm²
- Cutting force | 315 kN, roughly 32 tonnes
- *Press recommended | at least 60 tonnes
```

During tryout, burr height on the blank edge exceeds the drawing limit. The toolmaker checks clearance, finds the die opening has been ground slightly oversize on one side, corrects it and re-runs the samples. The first-off parts are measured against the drawing and the die is approved for production, with a sharpening interval set at a conservative number of hits until wear data is collected.

## How this applies to a small Australian business

- **Choose the process by volume and stability.** Hard tooling pays at volume for stable designs.
- **Design parts for the tool.** Simple outlines, sensible hole positions and bend radii and good nesting reduce tool cost and material use.
- **Specify burr direction and edge requirements** where they matter.
- **Plan press capacity** with margin, including forming and stripping forces.
- **Maintain tools on hit counts**, not just when parts go wrong.
- **Own and record your tooling**, including where it is and its condition.
- **Treat press safety as a priority**, with competent advice on guarding and procedures.

## Common mistakes

- **Tooling up before the design is stable.**
- **Ignoring material utilisation** in high-volume parts.
- **Holes too close to edges or bends**, causing distortion or tool breakage.
- **Wrong clearance for the material**, causing burrs, wear or chipping.
- **Underestimating press force**, especially with combined operations.
- **Running tools until they fail** instead of maintaining them.
- **Inadequate guarding** or unsafe die-setting practices.

## Frequently asked questions

**Who should own a press tool?** Usually the customer who paid for it, but ownership, storage, insurance and maintenance responsibilities should be agreed in writing.

**Can a die be modified when the part design changes?** Often, if the change is small and was anticipated in the tool design, for example by using replaceable inserts. Significant changes may require new stations or a new tool, which is why tooling should follow a stable design.

**How long does a progressive die last?** It depends on material, thickness, tool steel, maintenance and part complexity. With good maintenance and sharpening, dies can produce very large numbers of parts.

## Questions to ask

- What volume and design stability justify press tooling for this part?
- Has the part been designed for efficient strip layout and robust tooling?
- What press force, shut height and bed size does the tool need?
- How will we record hits and schedule maintenance?
- Are our presses guarded and our die-setting procedures safe?

## Bringing it together

Press tools cut and form sheet metal at high speed and low cost per part once the tool exists. Blanking and piercing quality depends on punch and die clearance and tool condition; force can be estimated from perimeter, thickness and shear strength; and die types range from simple single-station tools to progressive and transfer dies. Strip layout drives material cost, forming requires springback compensation, and presses must be chosen for force, size and motion. Disciplined maintenance and rigorous press safety keep tools productive and people protected. For stable, high-volume parts, a well-designed press tool is one of the most economical manufacturing investments available.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. Always consult tool designers, toolmakers and press manufacturers for specific tools and equipment.*
