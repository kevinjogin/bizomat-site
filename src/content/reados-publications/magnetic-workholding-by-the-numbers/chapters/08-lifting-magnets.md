---
book: magnetic-workholding-by-the-numbers
chapterSlug: lifting-magnets
order: 8
title: "Lifting magnets"
description: "Plan a lift with lifting magnets: rated loads and their conditions, derating for thickness, surface and material, plate mass and centre of gravity, lifting beams, plate flex and safe use."
draft: false
---

A lifting magnet is a magnetic chuck turned upside down and hung from a crane. The physics is the same: pull from flux density at the contact, reduced by gaps, thin material and poor materials. What changes is the consequence of getting it wrong. A part that slides on a chuck is scrapped; a plate that drops from a lifting magnet can kill someone. Lifting magnets are lifting equipment, and they come with ratings, derating tables, inspection requirements and rules of use that exist because the physics of the earlier chapters has caught people out.

This chapter plans the case's routine lift: a full 2,400 × 1,200 × 25 mm sheet moved from the rack to the cutting table with two permanent lifting magnets on a lifting beam. It uses the BIZOMAT plate lift plan for the sheet's mass and the load on each magnet, derates the magnets for the real sheet, checks the lifting beam with the BIZOMAT lifting beam tool, and looks at plate flex and power failure. The error is a rusty sheet.

## What a lifting magnet's rating means

A lifting magnet's working load limit (WLL) is the largest load it may lift in service, under the conditions its maker states. Those conditions are typically a minimum thickness of low-carbon steel, a flat, clean, unpainted contact, a load whose length and width do not exceed stated limits, and a temperature range. The WLL is set well below the force at which the magnet breaks away from such a load; the ratio between them is a design factor that the maker applies, and standards for lifting devices set requirements for it. In Australia, AS 4991 covers lifting devices that connect to a crane hook, including magnet lifters. This book does not quote values from that standard; the maker's rating and the standard govern any real lift.

Anything that departs from the rating conditions reduces the capacity. Makers publish derating tables for the departures that matter, and those tables are the starting point for every lift. The UK Health and Safety Executive's public guidance on magnetic lifting devices lists the same factors in plain terms: the load's material, weight, thickness, shape and contact area; its surface condition, because paint, rust, oil or ice increase the gap; its temperature; and its flexibility.

## The sheet and its centre of gravity

The BIZOMAT [plate lift plan](/tools/plate-lift-plan/) calculates a flat plate's area, perimeter and centroid from its corner coordinates, its mass from its thickness and density, and the load on each of two lift points from where the centre of gravity falls along the line between them, with the sideways offset that makes the plate hang tilted, checked against the working load limit of each lift point.

This is an illustration. The sheet is 2,400 × 1,200 × 25 mm grade 250 steel at 7,850 kg/m³. The two magnets are placed 600 mm in from each end, on the sheet's centreline.

```figure
type: stats
title: The case's sheet lift, from the plate lift plan
caption: This is an illustration. Rectangle with corners at (0, 0), (2,400, 0), (2,400, 1,200) and (0, 1,200) mm; lift points at (600, 600) and (1,800, 600) mm; working load limit of each point entered as the derated magnet capacity worked out below, 3.54 kN.
- 2.88 m² | sheet area
- 565.2 kg | sheet mass, 5.543 kN weight
- (1,200, 600) mm | centre of gravity
- 2.771 kN | load on each magnet
- 78% | each magnet's load as a share of its derated capacity
- 0 mm | centre of gravity offset from the lift line; the sheet hangs level
```

## Derating the magnets for the real sheet

This is an illustration. Each permanent lifting magnet has a WLL of 500 kg, or 4.90 kN, on low-carbon steel at least 30 mm thick with a flat, clean contact. The maker's derating table gives two factors that apply to the case's sheets: 85% for 25 mm thickness, because the sheet is a little thinner than the magnet's flux needs, and 85% for an as-rolled surface with tight mill scale.

```figure
type: steps
title: Derated capacity of each lifting magnet for the case's sheet
caption: This is an illustration. Factors are the case's invented maker's figures. Real derating tables are specific to each magnet model.
- Working load limit at rated conditions | 500 kg, 4.90 kN
- Thickness factor, 25 mm against 30 mm rated | × 0.85
- Surface factor, tight mill scale | × 0.85
- * Derated capacity | 500 × 0.85 × 0.85 = 361 kg, 3.54 kN
- Load on each magnet from the plate lift plan | 2.771 kN, 78% of the derated capacity
```

The surface factor can be checked against the gap model of Chapter 3. Lifting magnets are built with deep poles and long internal flux paths precisely so that they tolerate rough contact; the case's magnets have an equivalent gap of about 1.0 mm. Tight mill scale behaves like a gap of about 0.08 mm, which the model turns into a share of 1 ÷ (1 + 0.08 ÷ 1.0)² = 86%, consistent with the maker's 85%. The same model shows how fast capacity falls for worse surfaces: a heavily rusted sheet with a 0.5 mm equivalent gap keeps only 44% of its rated capacity, before the thickness factor.

### Placing the magnets

The plate lift plan shows what happens when the magnets are not where the plan says. With one magnet placed at (1,700, 650) mm instead of (1,800, 600), the centre of gravity lies 54% of the way from the first magnet to the second and 27 mm off the line between them. The second magnet's load rises to 3.017 kN, 85% of its derated capacity, and the sheet hangs slightly tilted. The shop marks the magnet positions on its rack-side drawing for each sheet size so that the operator places them by measurement, not by eye.

## The lifting beam

The two magnets hang from a lifting beam, which hangs from the crane hook. The BIZOMAT [lifting beam design tool](/tools/lifting-beam-design/) checks a below-the-hook beam: for a lifting beam with one top lug and the load hung from two points, the bending stress and deflection with a dynamic factor on the load; for a spreader beam, the compression from the sling angle and Euler buckling.

This is an illustration. The beam is a 150 × 100 × 6 mm rectangular hollow section with its load points 1,200 mm apart. Its elastic section modulus is about 118,000 mm³ and second moment of area about 8.85 × 10⁶ mm⁴, calculated from its outer and inner dimensions without corner radii. The load is the sheet plus two magnets of 35 kg each, 635.2 kg, with a dynamic factor of 1.25.

```figure
type: stats
title: The case's lifting beam, from the lifting beam design tool
caption: This is an illustration. Lifting beam type, central lug, 635.2 kg load, dynamic factor 1.25, 1,200 mm between load points, Z = 118,033 mm³, I = 8,852,472 mm⁴, E = 200 GPa, allowable stress 160 MPa entered by the designer.
- 7.79 kN | design load including the dynamic factor
- 3.89 kN | load at each lift point
- 2.34 kN·m | maximum bending moment
- 19.8 MPa | bending stress, against 160 MPa allowable
- 0.16 mm | deflection, span ÷ 7,579
```

The beam is lightly loaded in bending. Its real design checks are elsewhere: the lug and its pin, the welds, the attachments for the magnets, and the beam's certification. The tool says so itself in its certification check: a lifting beam must be designed, proof-tested and marked to the lifting equipment standard, and that is work for a competent designer.

## Plate flex and peeling

A magnet holds a plate where it touches; the rest of the plate hangs from it. A stiff plate hangs almost straight. A flexible one droops beyond and between the magnets, and the droop bends the plate where it leaves the magnet's face, pulling the edge of the contact open. Once the edge opens, the gap there grows, the force there falls, and the opening can run across the face until the plate peels off. Peeling is how thin plates are usually dropped.

For the case's 25 mm sheet, each 600 mm overhang beyond a magnet deflects at its tip by about 0.12 mm under its own weight, treating it as a cantilever 1,200 mm wide. That is negligible. A 6 mm sheet of the same size would deflect at its tip by about 2.1 mm, seventeen times as much, because stiffness falls as the cube of thickness while the weight falls only in proportion. Thin sheets need more magnets, spaced more closely, and their makers' tables give maximum overhang and spacing for each thickness.

## Bars, tubes and bundles

Flat poles on a round bar touch along a line. The contact area is tiny, the gap either side of the line grows quickly, and a flat-faced magnet that lifts its rating on plate may lift a small fraction of it on round bar. Lifting magnets for round stock have vee-shaped pole faces that touch the bar along two lines and keep the gap small over a wider area, and their derating tables give separate figures for round material by diameter. Tubes add a thickness problem: the flux must travel round a thin wall, which saturates as a thin plate does.

Bundles are worse. A magnet holds the top piece of a bundle through its contact and the pieces below it only through the gaps between pieces, as Chapter 4 described for stacks. The HSE guidance advises that bundles be lifted only with banding rated for lifting and marked with a safe working load, so that the banding, not the magnet's reach through the stack, carries the lower pieces.

## Inspection and records

The case's shop keeps a register entry for each lifting magnet and the beam, with the maker's documents, the derating table, and a record of each inspection. Before each use the operator makes the visual checks in the list below. At set intervals a competent person examines the magnets and beam more thoroughly, and after any repair, or any event such as a drop or an overload, the equipment is withdrawn until it has been examined.

The HSE guidance also describes a simple functional check: placing a non-metallic test piece of known thickness between the magnet and a test load, and confirming that the load still lifts. The shim reproduces a known gap, so the test shows that the magnet still has its margin, not just that it can lift a clean load. The case's shop uses a 1 mm sheet of plastic and a 25 mm test plate of known mass for this check every month, and records the result. Under the gap model, a 1 mm gap leaves these magnets a quarter of their force, so the test plate is chosen with a mass a little below a quarter of the magnet's breakaway force.

## Power failure and the rules of use

A permanent lifting magnet, like a permanent chuck, holds without power. Battery and mains electromagnets do not, and they are fitted with warnings and backup supplies for that reason. The HSE guidance describes, for battery-fed devices with a safe working load over 20 kg, an automatic warning at least 10 minutes before the load would be released, and for devices with an external supply, a warning on supply failure and a standby battery able to hold the load for at least 10 minutes. It also describes releasing the load by two separate control actions so that it cannot be dropped by one accidental movement.

```figure
type: checklist
title: Before every lift with lifting magnets
caption: The open item is the one this chapter's error turned on. The list supplements, and does not replace, the maker's instructions and the site's lifting procedures.
- x Magnet and beam inspected before use | face, handle or switch, cables, lug, markings
- x Load's mass and centre of gravity known | plate lift plan or drawing
- ? Load's surface and thickness compared with the derating table | paint, rust, scale, ice, thickness
- x Magnets placed at the marked positions | flat, clean contact, fully on the plate
- x Trial lift a short distance and hold | watch for movement or peeling before lifting higher
- x Nobody under or beside the load | exclusion zone; tag line for control
- x Load lowered and supported before release | two control actions to release
```

Under the model WHS laws, lifting equipment is plant, and the people who use it must be trained and competent in its use. People with pacemakers or other active implants should not work close to powerful lifting magnets without medical advice; the HSE guidance notes that the magnetic fields can affect such devices.

## The error: a rusty sheet

This is an illustration. A sheet that had been stored outside for several months was brought in for an urgent job. Its surface was covered with loose rust and flaking scale. The operator placed the magnets, switched them on and began the trial lift. As the sheet came clear of the stack by about 50 mm, one end started to peel from its magnet and the operator lowered it at once.

The supervisor's check found the cause in the derating. Heavy loose rust behaves as a gap of about 0.5 mm, which for these magnets leaves 44% of the rated force, not the 85% of the tight-scale factor. With the thickness factor, each magnet's capacity was 500 × 0.85 × 0.44 = 189 kg, or 1.85 kN, against a load of 2.77 kN on each: 150% of capacity. The magnets were well below their breakaway force at rated conditions and would have held the sheet on a clean surface; on that surface, the trial lift was the only thing between the sheet and the floor.

The sheet was cleaned with a needle scaler and wire brush where the magnets would sit, and lifted normally. The shop added a surface check to its lifting checklist, and a note that any sheet whose surface does not match a row of the derating table is lifted with slings, not magnets.

## Exercise: a thin sheet

This is an illustration. A 2,400 × 1,200 × 6 mm sheet is to be lifted with the same magnets. The derating table gives 20% for 6 mm thickness and 85% for tight mill scale.

1. What does the sheet weigh, and what load does each of two magnets carry?
2. What is each magnet's derated capacity?
3. Why should the shop still not lift it with two magnets?

**Worked answer.**

1. Mass = 2.4 × 1.2 × 0.006 × 7,850 = **135.6 kg**, so each of two magnets carries 665 N.
2. 500 × 0.20 × 0.85 = **85 kg**, or 834 N. The load is 80% of capacity.
3. **Flex and peeling.** The 6 mm sheet's 600 mm overhangs droop about 2.1 mm at their tips, and the span between magnets sags too, opening the edge of each magnet's contact. A thin sheet needs more magnets at closer spacing, as the maker's table specifies for that thickness, even though two magnets pass on load alone.
