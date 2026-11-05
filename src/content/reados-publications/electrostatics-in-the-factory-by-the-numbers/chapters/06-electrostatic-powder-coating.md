---
book: electrostatics-in-the-factory-by-the-numbers
chapterSlug: electrostatic-powder-coating
order: 6
title: "Electrostatic powder coating"
description: "How a corona gun charges powder, why charged powder wraps round an earthed part, what causes back-ionisation and thin inside corners, and how transfer efficiency drives powder cost."
draft: false
---

Powder coating is static electricity put to work. A corona gun fills the air in front of it with ions, the powder passing through picks up their charge, and the electric field between the gun and the earthed part pulls the charged powder onto the part, round its edges and onto surfaces the gun cannot see. The powder holds itself on the part by its own charge until the oven melts and cures it into a continuous film. Every part of that process is governed by the physics of the previous chapters, and most of the common faults on a powder line, poor wrap, thin inside corners, orange peel and pinholes, starry craters and wasted powder, are electrostatic faults.

This chapter explains how the gun charges powder and how much charge a particle can carry, why the electric force so outweighs gravity, how free ions both help and hurt, and why the film limits itself. It works the enclosure's powder use with the BIZOMAT coating coverage and coating job tools, judges the line's film thickness capability with the process capability tool, and ends with the inside corners that stayed thin however high the operators turned the voltage.

## How the gun charges powder

A corona gun has a sharp electrode at its nozzle held at a high voltage, on PL-2 up to −80 kV. The field at the tip, as Chapter 3 showed, is far above breakdown, so a negative corona forms and pours negative ions into the space in front of the gun. Powder blown out of the nozzle in a stream of air passes through this ion cloud. In the field, ions drift along the field lines and collide with the powder particles, which take up their charge until their own field repels further ions.

That limit, worked out by Pauthenier and Moreau-Hanot in 1932, depends on the particle's size, the field and the particle's permittivity. For a spherical particle of diameter d in a field E, with relative permittivity ε_r, the saturation charge is q = πε₀d²E × 3ε_r ÷ (ε_r + 2). Charge rises with the square of diameter while mass rises with its cube, so smaller particles carry more charge per kilogram.

```figure
type: formula
title: Field charging of a powder particle
formula: q_sat = π × ε₀ × d² × E × 3ε_r ÷ (ε_r + 2)
formula: q ÷ m = q_sat ÷ (ρ × π d³ ÷ 6)
caption: q_sat is the saturation charge (C), d the particle diameter (m), E the field in the charging zone (V/m), ε_r the powder's relative permittivity, ρ its density (kg/m³) and q ÷ m its charge-to-mass ratio. Real particles are not spheres, take time to charge and may not reach saturation, so measured charge-to-mass ratios are usually lower than this estimate.
- q_sat | saturation charge
- q ÷ m | charge per kilogram of powder
- E | field in the ion cloud
```

```figure
type: compare
title: Saturation charge of coating powder particles in a 300 kV/m field
cols: Saturation charge | Charge-to-mass ratio | Electric force ÷ weight at 300 kV/m
rowhead: Particle diameter
- 20 µm | 6.0 × 10⁻¹⁵ C | 0.96 mC/kg | about 29
- * 30 µm | 1.35 × 10⁻¹⁴ C | 0.64 mC/kg | about 20
- 50 µm | 3.8 × 10⁻¹⁴ C | 0.38 mC/kg | about 12
caption: This is an illustration. It uses ε_r = 3 and a powder density of 1,500 kg/m³. The ratio of electric force to weight is (q ÷ m) × E ÷ g. A Faraday pail measurement of the gun's actual powder gives the real charge-to-mass ratio.
```

A 30 µm particle of the factory's powder, charged to saturation, feels an electric force about twenty times its weight in a field of 300 kV/m. That is why charged powder follows the field lines rather than falling, curves round the edges of an enclosure and deposits on its back face: wrap. Without the charge, powder would simply blow past the part or fall to the booth floor.

## Free ions

Most of the gun's current does not end up on the powder. Only a fraction of the ions it makes are caught by particles; the rest, the free ions, travel to the part on their own, drifting at tens of metres per second (Chapter 3). On a fresh, earthed part they do no harm: they arrive and drain to earth. On a part already carrying a layer of powder, they arrive at the layer's surface and add to its charge, because the powder layer is an insulator and cannot pass the charge to the metal beneath.

As the layer's charge builds, the field across it rises. When it exceeds the breakdown strength of the air in the gaps between particles, small discharges fire from within the layer back towards the gun, a process called back-ionisation. They throw out positive ions that neutralise the arriving powder's charge, they leave tiny craters and star-shaped marks in the film, and they make the surface rough after curing, often seen as orange peel. Back-ionisation is the reason a powder film limits its own thickness at a given gun setting: beyond a certain thickness, more spraying adds defects rather than film.

Corona guns therefore offer current limiting: the gun's controller holds the corona current to a set value, so that fewer free ions are made as the gun approaches a part, and voltage settings lower than the maximum for second coats and touch-up. Tribo guns, which charge powder by friction in the gun barrel instead of by corona, make no free ions at all, and are used where back-ionisation and Faraday cage effects are severe, at the cost of being more sensitive to the powder's chemistry.

## The Faraday cage effect

An inside corner, a deep recess or the inside of a box is shielded from the gun's field by the walls around it. The field lines from the gun end on the nearest edges, not in the corner, so the charged powder is carried to the edges and the corner receives little. The effect is named after Faraday's demonstration that a conducting enclosure shields its inside from external fields.

Turning up the voltage makes it worse, not better, which surprises almost everyone the first time. A stronger field and more free ions build charge faster on the edges and outer faces, which reach back-ionisation sooner, while the field inside the corner stays weak. The cures are the opposite: lower voltage and current so that the field is weaker everywhere and the powder's own momentum carries it in, aiming the gun into the corner from close range, and coating inside corners first, before the outer faces have built up charge.

## Gun settings and distance

The gun's voltage, its current limit, its distance from the part and the powder and air flows all interact. Closer guns give stronger fields and more free ions at the part; further guns give softer, more even coverage and less back-ionisation but lose more powder to the booth airflow. The factory's automatic guns run at −70 kV with current limiting at about 20 µA and about 250 mm from the parts, settings found by trial for the enclosure range and recorded on the line's set-up sheet with the powder flow and the conveyor speed. When a new part shape arrives, the settings are tried on a sample first and the film is measured at the shape's hardest positions before the settings are released.

## Measuring transfer efficiency

Transfer efficiency is easy to talk about and harder to measure. The factory measures it by weighing: a box of powder before and after coating a counted batch of enclosures, with the reclaim system's return closed so that only virgin powder is used, and a sample of enclosures weighed before and after coating, before curing. The powder used divided into the powder on the parts gives the first-pass efficiency. The measurement takes an hour, needs scales good to a few grams, and is repeated whenever gun settings, powder or part shapes change significantly. It turned what had been an argument about whether the guns were "working" into a number, 55% falling to 70% as the earths and corners were fixed.

## Powder hazards in the booth

The booth is where Chapter 4's hazards meet the process. Powder concentrations near the guns are high and the guns are deliberately high-voltage, so the booth's design relies on several controls together: guns built to limit the energy of any discharge from the electrode, extraction that keeps the average concentration well below the minimum explosible concentration, every conductive item in and around the booth earthed, operators earthed through the gun and floor, and the guns' high voltage interlocked with the booth extraction so that the guns cannot be energised unless the extraction is running. A fire detection system in the booth and the recovery ducting shuts off the powder and high voltage if flame is detected. Cleaning is done with earthed, suitably rated vacuum equipment, not compressed air blown freely into the room.

The factory's assessment treats the hanger earth check, the booth extraction interlock and the gun earthing as safety-critical, with their own test records, rather than as quality checks that can slip in a busy week, which is exactly what had happened with the hangers.

## The case: powder use per enclosure

PL-2 coats an enclosure with 3.2 m² of surface to a dry film thickness of 70 µm, with a polyester powder of density 1.5 g/cm³ costing A$14 per kilogram, excluding GST. First-pass transfer efficiency, the share of sprayed powder that ends up on the part, was measured at 55% before the hanger and corner problems were fixed and 70% after.

The [coating coverage tool](/tools/coating-coverage/) works out the theoretical and practical coverage, the quantity needed and the material cost for liquid paint or powder at a dry film thickness and transfer efficiency. The [coating job estimate tool](/tools/coating-job-estimate/) adds coats, labour at an application rate and the total cost per square metre.

```figure
type: compare
title: Powder per enclosure at two transfer efficiencies
cols: Practical coverage | Powder per enclosure | Powder cost | Total with labour, per m²
rowhead: First-pass transfer efficiency
- 55% | 5.24 m²/kg | 0.61 kg | A$8.55 | A$4.30
- * 70% | 6.67 m²/kg | 0.48 kg | A$6.72 | A$3.73
caption: This is an illustration. Coverage and cost from the coating coverage tool with 3.2 m², 70 µm, 1.5 g/cm³ and A$14/kg; totals per m² from the coating job estimate tool with an application rate of 40 m²/h and labour at A$65/h. Theoretical coverage is 9.52 m²/kg in both cases.
```

At about 12,000 enclosures a year, the difference of A$1.83 per enclosure is about A$22,000 a year of powder. A reclaim system recovers much of the overspray for reuse, so the real saving is smaller on long runs of one colour, but on short runs and frequent colour changes, where reclaimed powder is not reused, first-pass efficiency is what the factory pays for.

## Film thickness capability

The customer's drawing calls for 60 to 90 µm of dry film. The line checks five positions on one enclosure in every fifty with a magnetic film thickness gauge: front face, side, back face, top and an inside corner. The gauge is checked each shift against calibration foils on a bare steel panel, and the readings are taken after curing, since uncured powder compresses under the probe. Each enclosure's five readings form one subgroup, so the range within a subgroup measures how evenly the line coats different surfaces of one part. The [process capability tool](/tools/process-capability-check/) works out the process standard deviation from the average range of the subgroups, the control limits and the capability indices against the specification.

## When it goes wrong: the inside corners

After the hanger earths were restored (Chapter 5), film build on the outer faces recovered, but inspection kept finding enclosures with thin film in the inside corners of the door rebate, some below 60 µm. The subgroups of five readings gave an average of 74 µm with an average range of 9 µm; the capability tool gave a Cp of 1.29 and a Cpk of 1.21, short of the factory's 1.33, with the thin corners making most of the range.

The operators' response was to raise the touch-up gun to its full −80 kV and spray the corners longer, the instinctive reaction when powder seems not to be reaching a surface. The corners improved a little and the outer faces near them developed orange peel and small craters: back-ionisation from the extra free ions on faces that were already coated.

```figure
type: decision
title: Getting powder into the door rebate corners
caption: This is an illustration. The changes were made by the coating supervisor with the gun maker's applications engineer.
- Raise voltage and spray longer | Worsens back-ionisation on outer faces; corners barely improve | Not adopted
- Add a second coat | Doubles cost and film on outer faces | Not adopted
- * Touch-up corners first at about −40 kV with current limiting, gun close and aimed into the corner, then the automatic guns | Corners reach film before outer faces charge up | Adopted
- Consider a tribo gun for the touch-up station | No free ions; trial planned | Under trial
```

With the corners coated first at lower voltage, the next fifty subgroups averaged 75 µm with an average range of 7 µm. The capability tool now gives a Cp and Cpk of 1.66, the thin corners have gone, and the outer faces no longer show back-ionisation marks. The new sequence is written on the touch-up station's work instruction with a photograph of the gun angle.

```figure
type: compare
title: Film thickness capability before and after the corner change
cols: Average | Average range | Process σ | Cp / Cpk | Verdict
rowhead: Period
- Before, corners last at full voltage | 74 µm | 9 µm | 3.87 µm | 1.29 / 1.21 | Not capable
- * After, corners first at −40 kV | 75 µm | 7 µm | 3.01 µm | 1.66 / 1.66 | Capable
caption: This is an illustration. Results from the process capability tool with subgroups of five and limits of 60 and 90 µm.
```

## Exercise: a finer powder

The powder supplier proposes a grade with a median particle size of 20 µm instead of 30 µm, claiming better wrap.

1. Using the saturation charge figures above, how do the charge-to-mass ratio and the ratio of electric force to weight compare with the 30 µm powder?
2. Why might the finer powder still give poorer results?
3. How would you test the claim?

**Answer.**

1. At 300 kV/m, the 20 µm particle's charge-to-mass ratio is about 0.96 mC/kg against 0.64 mC/kg, and its electric force is about 29 times its weight against 20. It follows the field more closely, which supports the wrap claim.
2. Fine particles are harder to fluidise and convey, more easily carried away by the booth's airflow, more prone to back-ionisation because they pack densely and charge highly, and more likely to escape to the filters, lowering transfer efficiency. They also present more of a dust hazard, since finer powder usually has a lower minimum ignition energy (Chapter 4), so the supplier's test data for the new grade must be checked.
3. Run a trial on enclosures with the same gun settings, measuring first-pass transfer efficiency by weighing powder used and parts before and after coating, film thickness at the five positions including the corners, and appearance after curing, and compare the results and their capability with the current powder.
