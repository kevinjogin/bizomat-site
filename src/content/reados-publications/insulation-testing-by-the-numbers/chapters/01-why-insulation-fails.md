---
book: insulation-testing-by-the-numbers
chapterSlug: why-insulation-fails
order: 1
title: "Why insulation fails"
description: "What winding insulation does, the thermal, electrical, ambient and mechanical stresses that age it, what tests can see, what a failure costs, and a pooled failure rate that hid a problem room."
draft: false
---

A motor winding is copper wrapped in insulation and packed into slots in a steel core. The copper carries the current; the steel carries the magnetic flux; the insulation keeps the two apart, and keeps each turn of copper apart from its neighbours. It is the least robust part of the machine. Copper and steel last indefinitely in normal service, while insulation is made of organic resins, films, papers and tapes that soften, oxidise, absorb water and crack. Most motor failures that are not bearing failures are insulation failures, and an insulation failure usually ends with a short circuit, a burnt winding and a machine that has to be rewound or replaced.

This chapter sets out what insulation does in a motor, the four kinds of stress that age it, how a failure develops and what tests can see along the way. It introduces the cold store's motors and what their failures cost, uses the site's failure record to estimate a failure rate, and finishes with a pooled failure rate that hid a problem in two rooms.

## What the insulation does

A motor's winding insulation has three jobs, and each is done by a different layer.

The **turn insulation** separates each turn of a coil from the next. In a small random-wound motor, such as the cold store's 2.2 kW evaporator fan motors, it is the enamel film on the magnet wire, a few hundredths of a millimetre thick. The voltage between adjacent turns is normally small, a few volts, but it can rise sharply during a fast voltage surge, as Chapter 8 shows.

The **groundwall insulation** separates the whole coil from the earthed steel core. It must withstand the full voltage between the winding and earth: in a 415 V motor about 240 V RMS in normal service, and in the 3.3 kV compressor motors about 1,905 V RMS. In a random-wound motor it is a slot liner of polyester film or a laminate, a few tenths of a millimetre thick. In a form-wound machine such as C-1 it is several layers of mica tape bonded with epoxy, about two millimetres thick.

The **phase insulation** separates coils of different phases where they cross in the end windings and share slots, where the voltage between them can reach the full line voltage.

```figure
type: compare
title: Random-wound and form-wound stator insulation
cols: Random-wound, EF fan motors | Form-wound, C-1 and C-2
rowhead: Feature
- Rated voltage | 415 V | 3.3 kV
- Turn insulation | enamel film on round wire | film or mica tape on rectangular strands
- Groundwall | slot liner of film or laminate, about 0.3 mm | mica tape and epoxy, about 2.2 mm
- Coil construction | wire dropped into slots in random positions | preformed coils with turns in fixed positions
- Impregnation | varnish dip or trickle | vacuum pressure impregnation with epoxy
- Typical repair | rewind or replace the motor | rewind, or repair of individual coils
caption: This is an illustration. Dimensions are typical values for the cold store's machines, chosen for the calculations in later chapters.
```

In a random-wound winding, the first and last turns of a coil can lie next to each other, so the full coil voltage can appear across two layers of enamel. In a form-wound coil the turns are in a fixed order, so the voltage between adjacent turns is known and limited. This difference matters most when voltage surges reach the winding.

## The four stresses

Insulation ages under four kinds of stress, a grouping set out in standard texts on machine insulation such as Stone and colleagues' book listed in the references.

**Thermal stress** is the slow chemical breakdown of the insulation's organic materials by heat. Oxidation and further curing make resins brittle, shrink them and break their bond to the copper, so that layers separate and voids form. The rate roughly doubles for each 8 to 10 degrees of temperature, which is why a motor that runs hot because of overload, blocked cooling or a high ambient ages much faster than one that runs cool. Chapter 9 puts numbers on this.

**Electrical stress** is the effect of the voltage itself. In a sound insulation system at its rated voltage, the electric field is well below the level that damages the solid materials. But in a void or gap filled with air, the field is higher and the air breaks down at a much lower field than the solid, producing partial discharges that erode the surrounding insulation. Fast voltage surges, such as those from variable speed drives and switching, add stress beyond the steady voltage.

**Ambient stress** is the effect of the environment: moisture, oil, dust, chemicals and radiation. Water absorbed into insulation, or condensed on its surface, provides a path for leakage current. Dirt mixed with moisture forms a conducting film across the end windings that can track and eventually flash over. Cold stores are a hard environment: motors in freezer rooms are very cold, and warm, moist air reaching them during defrosts and door openings condenses on them.

**Mechanical stress** comes from vibration, the magnetic forces on the coils at twice the supply frequency, the large forces during starting, and the expansion and contraction of copper and insulation at different rates as the winding heats and cools. It loosens coils in their slots, abrades insulation and cracks brittle, aged materials.

```figure
type: compare
title: The four stresses, their mechanisms and the tests that see them
cols: Typical mechanism | Tests that can detect it
rowhead: Stress
- Thermal | resins oxidise, become brittle and delaminate | dielectric loss tip-up, partial discharge, visual inspection
- Electrical | partial discharge in voids, surge breakdown between turns | partial discharge, surge comparison
- Ambient | absorbed moisture, conducting surface film | insulation resistance, polarisation index, dielectric loss
- Mechanical | loose coils, abrasion, cracking | visual inspection, partial discharge, wedge tightness checks
caption: A summary of the tests covered in Chapters 4 to 8. No single test detects every mechanism, which is why programs combine several.
```

The stresses rarely act alone. Heat makes insulation brittle, so vibration cracks it; cracks let in moisture; moisture lowers the voltage at which surfaces flash over. The failure that finally occurs is usually the last of a chain of causes.

## How a failure develops

Insulation does not wear out like a brake pad, getting steadily thinner until it is gone. It weakens, and a weakened insulation system keeps working until an event stresses it beyond what it can now withstand. That event is often a start, with its high current, forces and voltage transients; a switching surge; a condensation event; or a lightning surge on the supply. A winding that has run for years with brittle, cracked and contaminated insulation can fail at the first start after a long shutdown, because moisture condensed on it while it was idle.

This has two consequences for testing. First, most tests measure a symptom of the weakening, such as leakage current, dielectric loss or discharge activity, rather than the strength that remains, so their results must be interpreted against the machine's own history and against what is typical for similar machines. Second, the moments of greatest risk, such as restarting after a shutdown or after a flood, are also the moments when a quick test is most valuable.

```figure
type: steps
title: A typical chain from a stress to a failure
caption: This is an illustration of a common sequence in an evaporator fan motor; the times are typical, not measured.
- Years of operation | resin slowly ages; varnish on the end windings becomes brittle
- Thermal cycling with defrosts | fine cracks open in the varnish and slot liner
- Door openings and defrosts | warm, moist air condenses on the cold motor; water enters the cracks
- Dirt from the room | mixes with water to form a conducting film across the end windings
- * Start after defrost | leakage current tracks across the film and burns through to earth
- Protection trips | the winding is damaged and the motor must be rewound or replaced
```

## What tests can see

Insulation tests fall into two groups. Off-line tests are done with the machine stopped and isolated, and apply a voltage from a test set. They include the DC insulation resistance and polarisation index tests of Chapters 4 to 6, the capacitance and dissipation factor tests of Chapter 7, and the partial discharge and surge tests of Chapter 8. On-line tests are done with the machine running, by measuring partial discharge with permanently installed sensors or by monitoring leakage current, and they have the advantage of measuring the insulation under its real voltage, temperature and vibration.

The DC insulation resistance test is the most widely used because it is quick, cheap and safe when done properly, and because it detects the two most common problems: moisture and contamination. It is much less sensitive to thermal ageing, voids and partial discharge, which a winding can have while showing a high insulation resistance. That is why the cold store adds the AC and partial discharge tests of Chapters 7 and 8 for its most important machines.

## The cold store's motors and what a failure costs

The site has three groups of motors whose insulation it tests. Its two 3.3 kV screw compressor motors, C-1 and C-2, drive the refrigeration plant. C-1 runs most of the year and C-2 shares the load in summer. If C-1's winding failed in summer, the plant would lose about half its refrigeration capacity until it was repaired. A form-wound rewind of a 315 kW machine takes weeks, and during that time the site would have to hire a temporary chiller, transfer stock to another store, or accept a rise in room temperature that risks the product. The site estimates that a summer failure of C-1 would cost about A$180,000 in hire, transfer and lost product beyond the rewind itself.

The 24 evaporator fan motors cost about A$1,100 each to replace and much less to rewind, but a failed fan stops air moving across one evaporator coil, and in a blast freezer that slows the freezing of incoming product. The six condenser fan motors on the roof reject the plant's heat; a failure in a heatwave reduces capacity just when it is most needed.

## Reading the failure record

The site has kept a record of evaporator fan motor winding failures for six years. Over that time, 9 of the 24 motors had winding failures that needed a rewind or a replacement. The motors run continuously, so the total operating time is 24 × 6 × 8,760 = 1,261,440 motor-hours.

If failures happen at a constant rate, the mean time between failures (MTBF) is the total time divided by the number of failures: 1,261,440 ÷ 9 = 140,160 hours, about 16 years. With only nine failures, that estimate is uncertain. The [MTBF confidence bounds tool](/tools/mtbf-confidence-bounds/) calculates the uncertainty from the chi-square distribution: for 1,261,440 hours and 9 failures, the one-sided 90 % lower bound on the MTBF is 88,796 hours, just over ten years. The site's target for these motors is an MTBF of at least ten years, 87,600 hours, so the record appears to meet it.

```figure
type: formula
title: Constant failure rate estimates
formula: MTBF = T ÷ r        λ = r ÷ T
formula: Lower bound at confidence C: MTBF_L = 2T ÷ χ²(C, 2r + 2)
caption: T is the total operating time and r the number of failures in a record that ends at a fixed time. χ²(C, ν) is the chi-square value with ν degrees of freedom below which a fraction C of the distribution lies.
- MTBF | mean time between failures, h
- λ | failure rate, failures per hour
- MTBF_L | one-sided lower confidence bound, h
```

## The mistake: a pooled failure rate

The maintenance planner reported that the fan motor fleet met its ten-year target and recommended no change to the test program. The electrical supervisor, reading the list of failures, noticed that the same motor numbers kept appearing. Seven of the nine failures were in the four motors serving the two blast freezers, BF-1 and BF-2. Only two were among the twenty motors in the six storage rooms.

The pooled estimate assumes every motor has the same failure rate. When the record is split by room, the picture changes. The twenty storage-room motors ran 20 × 6 × 8,760 = 1,051,200 hours with two failures: an MTBF of 525,600 hours, with a 90 % lower bound of 197,508 hours. The four blast freezer motors ran 4 × 6 × 8,760 = 210,240 hours with seven failures: an MTBF of 30,034 hours, about three and a half years, with a 90 % lower bound of 17,861 hours, about two years. The tool reports that the blast freezer motors do not meet the target, and would need more than 820,000 further failure-free hours to demonstrate it.

```figure
type: bars
title: Estimated MTBF of the evaporator fan motors by group
unit: thousand hours
max: 550
caption: This is an illustration. Point estimates from the MTBF confidence bounds tool; the ten-year target is 87.6 thousand hours. The pooled figure meets the target only because the many storage-room motors hide the few blast freezer motors.
- Storage rooms, 20 motors, 2 failures | 525.6
- All 24 motors pooled, 9 failures | 140.2
- * Blast freezers, 4 motors, 7 failures | 30.0
```

The blast freezers run many more defrost cycles than the storage rooms, and their doors open many times a day as product arrives. Their motors see far more condensation than the others. The investigation that followed is the subject of Chapter 6. The lesson for reading failure records is that a pooled rate is meaningful only for items that share the same stresses. Before pooling, the supervisor now sorts failures by location, duty and age, and the tool's warning about the constant failure rate assumption is checked against that sort, not only against the dates of the failures.

## Choosing what to test

A test program should spend its effort where failure is both likely and costly. C-1 and C-2 are few, expensive and critical, so they justify the full set of off-line tests in Chapters 4 to 8 at each annual shutdown and quick insulation resistance checks between. The evaporator fan motors are many and cheap individually, but the blast freezer motors fail often enough that a quick insulation resistance and polarisation check at each planned stop, and always before restarting after a long standstill, pays for itself. The condenser fan motors are exposed to the weather and to surges from their drives, which Chapter 8 shows need a different approach. Chapter 10 puts the program together and costs it.

```figure
type: matrix
title: Where the cold store's test effort goes
x: Consequence of failure: low → high
y: Likelihood of insulation failure: low → high
hot: 4
caption: This is an illustration of the site's ranking. The highlighted cell, high likelihood and high consequence, gets the most attention.
- Run and replace on failure, test before restart | storage-room fan motors
- Full annual tests, quick checks between | C-1 and C-2
- Frequent quick tests, root cause fixed | blast freezer fan motors
- Surge-aware tests and drive filters | condenser fan motors in summer
```

## Exercise: the condenser fan motors

The six condenser fan motors have run continuously for five years, and three have had winding failures. Calculate the total operating time, the MTBF estimate and the one-sided 90 % lower bound, and say whether the record demonstrates a ten-year MTBF. The chi-square value for 90 % and eight degrees of freedom is 13.362.

### Answer

**Given:** 6 motors, 5 years of continuous running, 3 failures; target 87,600 hours.

**Assumptions:** a constant failure rate; the record ends at a fixed time, not at a failure; the motors share the same duty.

**Method:** T = number × years × 8,760; MTBF = T ÷ r; MTBF_L = 2T ÷ χ²(0.90, 2r + 2).

**Total time:** 6 × 5 × 8,760 = 262,800 hours.

**MTBF estimate:** 262,800 ÷ 3 = 87,600 hours, exactly the target.

**Lower bound:** 2 × 262,800 ÷ 13.362 = 39,336 hours, about four and a half years.

**Conclusion:** the point estimate equals the target, but with only three failures the lower bound is less than half of it. The record does not demonstrate a ten-year MTBF, and the failures should be investigated for a common cause, which Chapter 8 finds in the motors' drives.

**Verification:** the MTBF confidence bounds tool, given 262,800 hours, 3 failures, 90 % confidence and a requirement of 87,600 hours, gives an MTBF of 87,600 hours, a lower bound of 39,336.7 hours and the result that the requirement is not demonstrated.
