---
book: distribution-transformers-by-the-numbers
chapterSlug: specifying-testing-and-maintaining-a-transformer
order: 10
title: "Specifying, testing and maintaining a transformer"
description: "How to turn the numbers into a transformer specification, read factory tests and apply loss penalties, commission on site, and maintain with oil tests, thermography and records."
draft: false
---

Everything in the earlier chapters ends up in three documents: the specification that tells suppliers what the plant needs, the factory test report that shows what was built, and the maintenance record that shows how it is being kept. A transformer bought on a one-line request for "2,000 kVA, 11 kV to 433 V" will work, but it may have the wrong impedance for the switchboard, losses nobody guaranteed, a noise level nobody checked and protection settings nobody revised. A transformer bought on a good specification, tested against it and maintained on a plan can run for forty years without surprises.

This chapter turns the plant's decisions into a specification, reads the replacement's factory test results and works out the loss penalty they trigger, sets out the commissioning sequence, and builds a maintenance plan around the measurements earlier chapters relied on. It ends with a hot joint found two weeks after commissioning, exactly where the plan said to look.

## The specification

The plant's specification for TX-1's replacement collected the decisions made in this book. Each line has a reason the plant can explain to a supplier and to its own auditors.

```figure
type: compare
title: Key lines of the replacement transformer specification
cols: Requirement | Where it came from
rowhead: Item
- Rating and cooling | 2,000 kVA, ONAN, for indoor installation in the existing room | Chapters 4, 6 and 8
- Voltages and taps | 11,000 V to 433 V at no load, off-circuit taps ±2 × 2.5% | Chapter 2
- Vector group | Dyn11, to match the existing installation for paralleling | Chapter 2
- * Impedance | 6.0% at rated current and principal tap, with the tolerance stated | Chapter 5
- Losses | Guaranteed no-load and load losses, evaluated at A$18,480 and A$5,305 per kW, with the same rates as penalties for excess | Chapter 8
- Energy performance | Registered as meeting the minimum energy performance requirement | Chapter 8
- Noise | Sound pressure level not above 62 dBA at 1 m | Chapter 9
- Harmonics | Designed for the measured current spectrum, total distortion 12% | Chapter 9
- Insulating fluid | Natural ester, with thermally upgraded paper | Chapter 7
- Protection devices | Oil and winding temperature indicators with alarm and trip contacts, pressure relief device with trip contact | Chapter 5
- Tests | Routine tests to the IEC 60076 series, plus a sound level test, witnessed | This chapter
caption: This is an illustration of the plant's specification. A real specification also covers dimensions, access, terminations, earthing, drawings, delivery, documentation, warranty and the applicable Australian standards and network requirements, and is prepared or reviewed by a qualified electrical engineer.
```

Two lines deserve a comment. The impedance needs a tolerance, because a transformer built at the bottom of a wide tolerance could again put too much fault current on the switchboard; the plant asked for 6.0% with a narrow band and the right to reject a unit outside it. And the losses are specified as guarantees with penalties, so that the tender evaluation in Chapter 8 means something: a supplier quoting low losses must stand behind them.

## Evaluating the offers

Four suppliers responded. The evaluation followed Chapter 8: each offer's price was added to its guaranteed no-load and load losses at A$18,480 and A$5,305 per kilowatt, giving a total cost of ownership on the same basis. Two offers matched options B and C of Chapter 8. The third offer, the 1.60 kW and 16.5 kW unit of Chapter 8's exercise, had the lowest total cost of ownership, A$7,402 below option C's. The fourth was priced well above the others and was set aside.

The third offer did not survive the rest of the evaluation. Its supplier would guarantee the losses only with the wide tolerances a standard allows when the purchaser specifies nothing tighter, and would not accept the specification's penalty clause; without the penalty, its evaluated advantage was a promise rather than a guarantee. Its delivery time was also nine months later than the others, which would have kept TX-1, with its ageing paper, in service through another summer of the tunnel's peak. The plant chose option C: guaranteed losses with penalties, a delivery time that suited the project, a supplier with a service presence in the state, and a total cost of ownership within a few thousand dollars of the cheapest offer.

Total cost of ownership is the right way to compare the money; it is not the whole decision. Delivery, guarantees, service and the risk of each offer belong in the evaluation too, written down with their reasons so that the choice can be explained later.

## Factory tests

Every transformer is put through routine tests in the factory before delivery. The IEC 60076 series sets them out for power transformers; for a distribution transformer they typically include:

1. **Winding resistance** of each winding on each tap, with the temperature recorded so the values can be corrected to the reference temperature.
2. **Voltage ratio and vector group** on every tap, confirming the turns and connections of Chapter 2.
3. **Short-circuit impedance and load loss**, with the LV shorted and rated current flowing (Chapter 4).
4. **No-load loss and current** at rated voltage and frequency (Chapter 3).
5. **Dielectric tests**: an applied voltage test of each winding's insulation to earth and an induced voltage test of the insulation between turns, at voltages well above working levels.

Type tests, such as the temperature rise test and the short-circuit withstand test, are done on a representative design rather than every unit, and the buyer can ask for their reports. The plant also asked for a sound level test on its unit and sent an engineer to witness the routine tests.

## The case: reading the test report

The replacement's factory test report gave the following results against the guarantees.

```figure
type: compare
title: Factory test results of the replacement against its guarantees
cols: Guaranteed | Measured | Difference | Consequence
rowhead: Quantity
- Impedance | 6.0% | 6.08% | +0.08 points | Within the specified band
- * No-load loss | 0.85 kW | 0.91 kW | +0.06 kW | Penalty: 0.06 × A$18,480 = A$1,109
- Load loss at 75 °C | 19.0 kW | 18.7 kW | −0.3 kW | No credit under the contract
- Sound pressure level at 1 m | 62 dBA | 60.8 dBA | −1.2 dB | Meets
- Ratio, all taps | Calculated | Within a small fraction of a per cent | | Meets
caption: This is an illustration. The penalty uses the evaluation rate for no-load loss from Chapter 8; the contract gave no credit for losses below the guarantee, a common arrangement that the plant could have negotiated differently.
```

The no-load loss came in 7% above its guarantee, which the supplier attributed to the core's building factor. Under the contract the plant deducted A$1,109 from the price, which is the present value of 0.06 kW running for thirty years at the plant's electricity price. Without the penalty clause, the plant would have paid for those 60 watts every hour for thirty years and had no remedy. With it, the plant is no worse off than if the guarantee had been met.

## Commissioning

The replacement was delivered with its test report, oil sample results from the factory and the maker's installation instructions. The commissioning sequence followed the lessons of Chapters 2, 5 and 9.

```figure
type: steps
title: Commissioning the replacement
caption: This is an illustration of the plant's sequence; site high-voltage procedures and the maker's instructions govern the real work, carried out by authorised people.
- Inspect for transport damage; check the impact recorder fitted for shipping | No impacts above the limit
- Insulation resistance of each winding to earth and between windings | Recorded as the baseline
- Ratio on every tap and vector group | Matched the factory report
- Oil sample for gases, water and breakdown voltage | Baseline for future trends
- Protection: new HV fuses fitted, LV breaker settings revised, trip contacts tested end to end | All tripped the HV supply
- Phasing check against the existing supply before any parallel connection | Correct
- * Energise with no load, then load in steps over a day | Voltages and currents as expected
- Thermal image after one week at full production | See below
- Noise test at night | Met the limit (Chapter 9)
```

## When it goes wrong: the hot joint

The thermal image after a week of production showed the new transformer's LV terminal connection on one phase at 98 °C, against 52 °C on the other two, with the transformer carrying about 1,450 kVA. The connection was a bolted joint between the transformer's LV terminal and the flexible busbar link to the switchboard.

A bolted joint has a small contact resistance, and at LV currents even a small one matters. At the 1,930 A the joint was carrying, a sound joint of 5 µΩ dissipates 1,930² × 5 × 10⁻⁶ = 19 W, which its copper conducts away easily. A joint whose contact resistance has risen to 50 µΩ, because its bolts are loose or its surfaces poorly prepared, dissipates about 190 W in a few square centimetres, and gets hot. Heat oxidises the contact surfaces, which raises the resistance further, and a poor joint left alone can run away until it fails.

At the next weekend shutdown, with the transformer isolated, the joint's bolts were found finger-tight: the installation crew had fitted them and moved on to the protection tests without the final torque. The conical spring washers specified to keep the joint's clamping force as the copper expands and contracts were missing too. The joint was taken apart, the contact surfaces cleaned and treated as the busbar maker specifies, reassembled with the spring washers and tightened to the specified torque, and marked with a line of paint across each nut so that any later movement would be visible. The next thermal image showed all three phases at about 50 °C.

```figure
type: checklist
title: What the hot joint taught the plant
caption: This is an illustration. The thermal image after one week at load was in the commissioning plan precisely to catch faults like this.
- x Every bolted joint torqued, marked and signed off on a joint register before energising
- x Spring washers fitted where the busbar maker specifies them
- x Thermal image after a week at load, and annually after that
- x Joint resistance measured with a micro-ohmmeter at the next outage, as a baseline
- ? Review the installation contractor's inspection and test plan before the next project
```

The Library's [Industrial Electric Heating by the Numbers](/reados/publications/industrial-electric-heating-by-the-numbers/) works through how conductors heat and cool, which is the same physics as a bolted joint carrying load current.

## Maintenance

A sealed distribution transformer needs little maintenance, but what it needs is important, and most of it is measurement, recorded and compared year by year.

```figure
type: compare
title: The plant's maintenance plan for the new transformer
cols: Interval | Purpose | Chapter
rowhead: Task
- Read and reset the oil temperature drag pointer | Each morning round | Loading trend | 6
- Check room temperature log, fan and filters | Monthly; filters quarterly | Cooling | 6
- * Oil sample: dissolved gases, water, acidity, breakdown voltage | Yearly | Faults and insulation condition | 3, 7
- Furan analysis | Every two to three years | Paper ageing | 7
- Thermal image of transformer, radiators, terminals and switchboard | Yearly, at full load | Hot joints and blocked radiators | 6, 10
- Noise at four marked points | Yearly, same conditions | Clamping and over-voltage | 9
- Protection trip test, end to end | At each major outage | Protection works | 5
- Clean radiators and check for leaks and gaskets | Yearly | Cooling and moisture ingress | 6, 7
caption: This is an illustration. Intervals are the plant's own choices, informed by the maker's recommendations and the transformer's condition; they should be shortened if results change.
```

The value of the plan lies in the trends. A single oil test result means little; three years of rising gases or water mean a great deal, as TX-1 showed in Chapter 7. The plant keeps all results in one register for the transformer, with the load and oil temperature at each sampling, so that every new result is read against its own history.

## Reading an oil test report

The yearly oil report is the most informative single document in the maintenance plan, and it repays a few minutes of reading beyond the laboratory's summary.

**Dielectric breakdown voltage** measures the oil's ability to withstand voltage in a standard test cell. It falls with water and particles, so a low value is a prompt to look at the water result and at the sample's cleanliness.

**Water content** is read with the oil temperature at sampling, because water moves between paper and oil with temperature (Chapter 7). A rising trend at similar sampling temperatures means the insulation is getting wetter.

**Acidity** rises as the oil oxidises. Acids attack the paper and form sludge that blocks cooling ducts, so a rising acidity is a reason to consider regeneration before it becomes a cooling problem.

**Dissolved gases** are the fault detector. Different faults break down oil and paper into different mixtures of gases. Hydrogen on its own points to partial discharges; methane, ethane and ethylene to overheated oil, as with TX-1's second core earth in Chapter 3; acetylene to arcing, which always needs prompt attention; carbon monoxide and carbon dioxide to heated paper. Laboratories interpret the mixture with established methods, of which IEC 60599 is one, but the most useful information is the trend: the rate at which each gas is rising since the last sample.

**Furans**, every two or three years, show the paper's ageing.

A report that is filed without being compared with the previous ones wastes most of what it cost. The plant's register plots each result against time, and any result that changes markedly triggers a repeat sample within three months, before any conclusion is drawn.

## Records to keep

A transformer outlives most of the people who bought it, so its records must outlive them too. The plant keeps, in one place and in its asset system:

1. The specification, the chosen offer and the contract, including the loss guarantees and penalties.
2. The factory test report and any type test reports, with the witnessing engineer's notes.
3. The nameplate details and a photograph of the nameplate.
4. The commissioning results: insulation resistance, ratios, the baseline oil analysis, protection test records and the first thermal images.
5. Every later oil analysis, thermal image, noise reading and maintenance record, with the load and temperatures at the time.
6. The tap position history and the reasons for each change.
7. The protection settings and the fault level study they are based on.

When TX-1's replacement study began, its own records were incomplete: the 1996 test report was found in a filing cabinet, but nobody knew when its tap had last been changed or why, and its first oil sample dated from 2005. The new transformer's records start complete.

## The old transformer's end

When TX-1 is finally retired, its oil and its steel must be disposed of properly. Its mineral oil is collected by a licensed waste contractor, and before that it is tested for polychlorinated biphenyls, PCBs, which were used in some electrical equipment until the 1970s and can contaminate oil in later equipment through shared handling; a 1996 transformer is unlikely to contain them, but the test is the only way to know, and the disposal route depends on the result. Australia manages PCBs under a national management plan, and the state environmental regulator, here the EPA in Tasmania, sets the requirements for handling and disposing of contaminated oil and equipment. The copper, steel and aluminium are recycled. The paper, soaked in oil, goes with the oily waste.

## Contingency

The plant has one transformer. If it fails, the site stops until a replacement arrives, and a new 2,000 kVA unit can take months to build. The plant therefore kept TX-1, its oil dried and gaskets renewed, in a weatherproof enclosure in the substation yard for two years as an emergency spare able to carry the essential refrigeration load, and arranged a connection point for a hired generator at the main switchboard. Both decisions were judged against the cost of losing several days of frozen product, which for this plant far outweighed their cost.

## Exercise: a second test report

Suppose the factory test had measured a no-load loss of 0.83 kW and a load loss of 19.6 kW.

1. What penalty applies under the plant's contract?
2. What would the penalty have been with a contract that also credited losses below the guarantee at the same rates?
3. A bolted joint at 2,667 A, the new transformer's full rated current, has a contact resistance of 50 µΩ. What does it dissipate?

**Answer.**

1. Only the excess load loss is penalised: 0.6 kW × A$5,305 = A$3,183. The 0.02 kW below the no-load guarantee earns nothing.
2. A$3,183 − 0.02 × A$18,480 = A$3,183 − A$370 = A$2,813.
3. 2,667² × 50 × 10⁻⁶ = 356 W, concentrated in a few square centimetres: enough to make the joint run very hot and deteriorate, which is why joints are checked at full load, not light load, where the same joint would dissipate a fraction of that and look normal.
