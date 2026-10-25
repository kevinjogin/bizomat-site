---
book: brazing-and-soldering-by-the-numbers
chapterSlug: inspection-hazards-and-cost
order: 10
title: "Inspection, hazards and cost"
description: "Check capillary joints by eye, leak test and section, control the fume, burn and fire hazards of brazing and soldering, and build the full cost of a joint from labour, filler, rework and failures."
draft: false
---

The earlier chapters followed a capillary joint from its gap to its heat. This last chapter asks three questions about the finished joint. How do we know it is sound, when what matters is hidden inside the gap? How do we keep the people making it safe from fume, burns and fire? And what does it really cost, once labour, filler, rework and field failures are counted? The answers bring the manufacturer's review to an end.

## Inspecting what cannot be seen

A capillary joint's quality lies inside it: how much of the gap is filled, whether the filled area forms a continuous seal, whether flux or voids are trapped. Visual inspection sees only the outside, so it is necessary but not enough. Inspection of brazed and soldered joints combines several methods, each answering a different question.

```figure
type: compare
title: Ways of inspecting brazed and soldered joints
cols: What it shows | Limits
caption: General characteristics. Product standards, customer specifications and the joint's service set the methods and acceptance criteria.
- Visual | fillet shape and continuity, wetting at the edges, residue, overheating | says little about the inside of the gap
- Leak test | whether a pressure joint seals | finds leaks, not weak joints that happen to seal
- Proof test | whether the joint carries a load or pressure above service | tests each part; may not find slow defects
- Ultrasonic | unfilled areas in laps and sockets | needs calibration and skilled interpretation
- Radiography | voids and unfilled areas | costly; orientation matters
- *Sectioning and peel tests | the actual fill, on a sample | destroys the part; a sample, not every joint
```

Visual inspection checks that the filler appears all round the joint, ideally on both sides where it was fed from one, that the fillet is small, smooth and concave, that the parts are not overheated or eroded, and that flux residue has been removed. Leak testing, by pressure decay, bubble testing or tracer gas, finds the continuous paths that Chapter 4 showed are how pressure joints fail. Sectioning a sample joint, cutting it lengthwise and examining the fill, is the only way to see directly how much of the gap was filled, and is the basis for setting and checking a procedure.

## Sampling

Destructive tests can only be done on samples. The manufacturer sections one 15 mm outlet joint from each day's induction production and one hand-brazed joint from each brazer each week, and records the percentage of the socket length filled. A sample cannot prove that every joint is sound, but a trend in the sample, such as fill falling from about 95% to 80% over a fortnight, warns of a change in clearance, flux, heating or filler before it causes leaks. READOS explains the logic of sampling, and what a sample can and cannot prove, in Testing Welded Joints by the Numbers, in its chapter on [non-destructive testing and sampling](/reados/publications/testing-welded-joints-by-the-numbers/non-destructive-testing-and-sampling/).

## The pressure test

Every manifold leaves the factory after a pressure test, which is the main defence against leaks reaching the field. This is an illustration. The manufacturer tests each manifold with air at a pressure set by its product specification, underwater or with a leak detection solution, and holds the pressure for a set time while watching for bubbles. A leak found at the factory costs a rebraze, about A$6 including retest; a leak found in a customer's plant room costs a site visit, replacement and the customer's goodwill, which the manager estimated at about A$1,500 a time. The test does not make joints good, but it decides where the bad ones are found. The test pressure, the hold time and the acceptance criterion are written into the procedure, and the test record is kept with the batch, so that a manifold returned from the field can be traced back to the test it passed.

## Procedures and records

A sound joint made once proves little; a sound joint made the same way every time is a process. The manufacturer's review ended with a written brazing procedure for each joint type, recording the parts and their materials, the bore and tube sizes with their tolerances and the hot clearance they give, the filler and its form, the flux, the heating method with its torch, tip and gas or coil and settings, the heating sequence, the cooling rule, the cleaning of residues, and the inspection and test. Each procedure was proved by sectioning sample joints before it was issued. For pressure equipment, gas and some other regulated products, brazing procedures and brazers must be qualified to the applicable standard, and the procedure is then part of the product's compliance, not just good practice.

The batch records tie each product to the procedure it was made by: the date, the brazer or cell, the filler lot, the gauge checks, the daily section result and the pressure test. When a joint fails in the field, those records are what let the manager find whether it was one joint, one day or one batch of tube, and what else might be affected.

## Training brazers

Most of the failures in this book were made by capable people who had not been told why the rules existed: heating the tube because the filler was fed there, quenching carbide to save time, turning up the flame to go faster, skipping the soak tank. The manufacturer's training now explains the reasons, with the numbers, alongside the method: why the body needs nine-tenths of the heat, why a 0.01 mm hot gap will not fill, why carbide cracks, why flux residue corrodes. Brazers who understand the reasons can recognise a new problem as well as avoid the old ones, and they are less likely to take a shortcut that looks harmless.

## Fume

Brazing and soldering produce fume from three sources: the filler, the flux and any coating or contamination on the parts. The hazards depend on what is present:

- **zinc** from brass fillers and galvanised parts forms zinc oxide fume, which causes metal fume fever (Chapter 6);
- **cadmium** in some older silver fillers forms highly toxic fume; the NIOSH Pocket Guide lists cadmium as a potential occupational carcinogen affecting the lungs and kidneys (Chapter 6);
- **lead** in tin-lead solders and some coatings is toxic, mostly by ingestion from contaminated hands, food and surfaces rather than by fume at soldering temperatures (Chapter 7);
- **fluorides** in brazing fluxes give off irritating, toxic fume when heated (Chapter 5);
- **rosin** fume from soldering fluxes can sensitise the airways and cause asthma (Chapter 5).

Safe Work Australia's model code of practice for welding processes, as adopted in each jurisdiction, sets out the duties and controls for fume from welding and allied processes. The safety data sheets for each filler and flux identify their hazardous components and the controls they need.

```figure
type: steps
title: Fume controls at the manufacturer's brazing and soldering benches
caption: This is an illustration of the business's controls following the hierarchy of control. Each lower level supplements, not replaces, the levels above.
- Eliminate | cadmium-bearing filler removed from stock; lead-free solder adopted
- Substitute | low-fuming fillers; fluxes with lower fluoride content where suitable
- *Capture at source | extraction hoods at each brazing bench; fume extractors at soldering stations
- Administrative | no eating or drinking at the benches; hand washing; air monitoring
- Personal protection | respiratory protection where the risk assessment requires it
```

## Lead hygiene

Where tin-lead solder or lead-coated parts are still handled, the main route of lead into the body is the mouth, not the lungs: lead on hands, gloves, cups and cigarettes is swallowed. The controls are simple and must be habits. No eating, drinking or smoking at soldering benches; hands washed thoroughly before eating and at the end of each shift; benches wiped down rather than brushed or blown clean; work clothing kept at work; and solder offcuts and dross collected for recycling, not left on the bench. Workers who handle lead regularly may need health monitoring under the work health and safety regulations, which set out when it is required. Changing to lead-free solder, as the manufacturer did for its control boxes, removes the hazard at its source.

## Burns

Brazed parts stay hot long after they stop glowing, and a copper tube or brass body at 300 °C looks the same as one at room temperature. Burns from picking up a just-brazed part, or from touching a part on the bench beside the brazer, are among the commonest injuries in brazing. Controls include defined cooling areas, tongs and fixtures for handling hot parts, heat-resistant gloves, and a rule that parts are not set down where others will pick them up. Molten flux and filler can spatter, especially if borax swells or a damp part is heated, so eye protection and covering clothing are needed. Torch flames bring the radiation and flashback hazards described in Oxy-Fuel by the Numbers.

## Fire

Brazing is hot work, and it starts fires. Sparks are rarer than in cutting, but the torch flame, the hot parts and the heat conducted along a tube can ignite nearby combustible materials, sometimes out of sight: insulation on pipework, dust, timber behind a wall or packing material on the bench. Fires from hot work often start after the work has finished, as smouldering material catches. The usual controls are a hot work permit for brazing outside the workshop's designated benches, removal or shielding of combustibles, a fire extinguisher at hand, and a fire watch during the work and for a period after it.

## A failure: the smouldering lagging

This is an illustration. A service technician sent to replace a leaking outlet on a manifold in a customer's plant room brazed the new outlet in place with the manifold still connected to the system. The copper tube ran through foam insulation lagging about 150 mm from the joint. The technician finished, checked the joint, packed up and left. About forty minutes later, the plant room's smoke detector alarmed: the lagging had been heated by conduction along the tube and had begun to smoulder.

The building's staff put the fire out with an extinguisher, and the damage was limited to the lagging and some scorching. The manufacturer introduced a hot work procedure for site work: a permit from the site, removal or protection of combustible materials near the joint, heat-sink paste or wet cloths on the tube to limit conducted heat, an extinguisher at the work, and a fire watch for at least an hour after brazing, or longer if the site's rules require it.

## The full cost of a joint

The cost of a brazed joint is far more than its filler. Building it up from every element shows where the money goes and what each improvement is worth.

```figure
type: compare
title: The cost of a 15 mm outlet joint, torch and induction
cols: Hand torch | Induction cell
caption: This is an illustration, excluding GST. Labour at A$70 an hour; filler at A$1.80 a gram; field failures spread over about 60,000 joints a year in all; the induction cell's A$45,000 spread over five years and 40,000 joints a year.
- Labour | 2.5 min, A$2.92 | 1.9 min, A$2.22
- Filler, 0.65 g | A$1.17 | A$1.17
- Flux, gas or electricity | A$0.15 | A$0.08
- Inspection and testing share | A$0.20 | A$0.20
- Rework, rebrazed at the factory | A$0.06 | A$0.01
- Field failures | A$0.08 | A$0.03
- Equipment | none | A$0.23
- *Total per joint | about A$4.57 | about A$3.93
```

Labour is the largest element, then filler. The cost of failures looks small per joint, but it is the element that grows fastest when the process goes wrong: a fortnight of poor fill, if it reached the field, could add several thousand dollars of returns and damage a customer relationship worth far more. The induction cell saves about A$0.64 a joint, about A$25,600 a year on 40,000 joints after its own capital cost, and also reduces variation, which is worth more than the arithmetic shows.

## What the review achieved

This is an illustration. Over the year, the manufacturer's production manager had worked through the three problems that started the review, and several more the review uncovered.

```figure
type: stats
title: The manufacturer's brazing and soldering review in its first year
caption: This is an illustration. Savings are estimates from earlier chapters; the safety changes have no price.
- *0 | Field leak returns in the second half-year | from three in the previous year
- A$9,000 | Filler saved | about 5 kg a year (Chapter 6)
- A$25,600 | Induction saving after capital | 15 mm outlets (Chapter 8)
- 0 | Cracked carbide tips after the procedure change | Chapter 9
```

Behind the numbers were the changes: hot clearances calculated and bores reamed to suit (Chapter 3), heating practice changed to heat the body first (Chapter 8), flux residues removed reliably (Chapter 5), lead-free solder in the control boxes with new inspection criteria (Chapter 7), a carbide procedure that cannot be shortcut (Chapter 9), and fume, burn and fire controls that the whole team understands.

## Bringing it together

Every chapter of this book has turned on the same few relationships. Capillary pressure rises as the gap narrows, so the gap must be small; flow and flux need room, so it must not be too small. Parts grow by α × ΔT, so the gap that matters is the one at brazing temperature. The filler is weaker than the parts, so the joint makes up the difference with area, and pressure joints fail by leak paths, not by shear. Flux works only near the filler's melting range, so heating must be quick and even. And heat must go where the mass is, because filler flows towards heat. A brazer or designer who keeps those relationships in mind can diagnose most failures from first principles, as the early manuals' authors did in their own way.

## Exercise: the value of fill

The manufacturer's daily section of an induction-brazed joint shows the socket fill falling from about 95% to about 75% over two weeks, while the pressure test still passes every manifold. Using the arithmetic in this book, explain whether this matters, what might be causing it, and what to do.

It matters even though every manifold passes, for two reasons. First, the joint's sealing depends on a complete ring of filled gap; as fill falls, the chance that the unfilled area forms a continuous path rises, and a leak that has not yet appeared may appear after thermal cycling in service. Second, a falling trend means something in the process has changed. Likely causes, from earlier chapters, are a change in hot clearance from a new batch of tube or a worn reamer (Chapter 3), a change in heating from a moved or damaged coil (Chapter 8), exhausted or wrongly applied flux (Chapter 5), or a filler ring of the wrong size or composition (Chapter 6). The response is to check each against its record, starting with the cheapest to check, the gauges on the bores and the tube, and the coil position, and to hold the affected production for extra leak testing until the cause is found.
