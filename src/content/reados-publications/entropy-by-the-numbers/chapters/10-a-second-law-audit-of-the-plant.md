---
book: entropy-by-the-numbers
chapterSlug: a-second-law-audit-of-the-plant
order: 10
title: "A second-law audit of the plant"
description: "Bring the book together: rank every loss by exergy destroyed, separate what can be avoided, price the options with stated tariffs, choose an order of work and verify the result after the change."
draft: false
---

The previous nine chapters each looked at one part of the plant: the boiler, the cool room, the heat exchanger, the regulators, the compressor. An audit puts them side by side, because the decision a plant faces is not whether a single item could be better but which improvements to make first with limited money and shutdown time. The second law's contribution is a ranking that the first law cannot give: by how much work potential each item destroys.

This chapter assembles that ranking for the running case, separates the losses that could be avoided from those that could not, prices the main options with illustrative tariffs, and sets an order of work. It shows how to verify the results once changes are made, and ends with an earlier audit that ranked the same plant by energy alone and recommended the wrong project.

## The method

A second-law audit follows the same steps whatever the plant.

```figure
type: steps
title: A second-law audit in seven steps
caption: Each step uses a chapter of this book. The audit is only as good as its measurements, so steps 2 and 7 deserve as much care as the calculations.
- State the dead state | temperature and pressure, with the reason; Chapter 7
- Measure the main flows | fuel, electricity, water, air and steam, with temperatures and pressures
- Calculate each item's exergy balance | in, products, wastes, destroyed; Chapters 4, 6, 7
- Rank by exergy destroyed and discarded | in kilowatts, not percentages
- Split avoidable from unavoidable | what better design or a different machine could remove
- Price the options | with stated tariffs, hours and GST treatment
- Verify after the change | measure the same balance again
```

## The ranking

This is an illustration. The engineer gathers the figures calculated through the book, all at a dead state of 20 °C, into one table. The leak and filter figures are estimates for an older system that have not yet been measured, and the leak and regulator flows overlap slightly, so the total is approximate.

```figure
type: compare
title: Exergy destroyed or discarded in the running case, dead state 20 °C
rowhead: Item
cols: Exergy destroyed or discarded | Share | Mostly avoidable? | Chapter
caption: This is an illustration. The boiler dominates: nearly four-fifths of all exergy lost in the plant is lost in heating 60 °C water from fuel. Percentages are of the total of about 110 kW.
- * Gas boiler, wash water | 87.7 kW | 79% | yes, by a different machine | 1, 6
- Air compressor | 11.6 kW | 10% | partly, by pressure, control and intake | 9
- Cool room refrigeration | 4.0 kW | 4% | partly, by coils and setpoints | 3
- Air regulators, 8 to 5 bar | 2.4 kW | 2% | largely, by a lower setpoint | 8
- Effluent to drain, discarded | 2.1 kW | 2% | largely, by heat recovery | 6, 7
- Kettle, steam to food | 1.2 kW | 1% | little | 6
- Air leaks, estimated | 0.9 kW | 1% | yes, by repair | 8
- Air filter, if clogged | 0.3 kW | under 1% | yes, by maintenance | 8
- Tempering valve | 0.25 kW | under 1% | partly | 8
```

The first-law picture of the same plant looks quite different. Its largest "losses" are the 52 kW of warm effluent going down the drain and the compressor's heat rejection, while the boiler's 9.3 kW flue loss seems modest. The second law shows that the boiler is where the plant's value is destroyed, because it degrades fuel, almost pure exergy, into heat at 60 °C. Nothing else in the plant comes close.

## From ranking to options

The ranking says where to look; the options say what to do. For the boiler, three alternatives were developed through the book.

1. **Heat pump only**, replacing the boiler for the whole 20 °C to 60 °C duty, at COP 3.2: 26.1 kW of electricity.
2. **Recovery and boiler**, keeping the boiler but adding the 3 K approach effluent exchanger of Chapter 6, which preheats the water to 42 °C and leaves 37.6 kW for the boiler: 41.8 kW of gas.
3. **Recovery and heat pump**, with the exchanger first and the heat pump covering the remaining 37.6 kW from 42 °C to 60 °C. At the same COP of 3.2 this takes 11.8 kW of electricity; the supplier must confirm the COP at a 42 °C inlet, since the heat pump's performance depends on it.

Option 3's exergy balance shows why it is strongest. The heat pump's duty from 42 °C to 60 °C needs 3.59 kW of exergy, and it destroys 11.76 − 3.59 = 8.2 kW doing so; the exchanger destroys 0.43 kW. Together, about 8.6 kW destroyed against the boiler's 87.7 kW.

### Pricing the options

This is an illustration. The plant runs its wash water for 4,000 hours a year. The engineer uses illustrative tariffs of A$0.09 per kWh for gas and A$0.25 per kWh for electricity, both excluding GST, which the business can usually claim back as an input tax credit. The figures are for comparing options under stated assumptions, not a forecast of any real bill.

```figure
type: bars
title: Annual energy cost of the wash-water options
unit: A$
max: 36000
caption: This is an illustration at 4,000 hours a year, A$0.09/kWh for gas and A$0.25/kWh for electricity, excluding GST. Capital costs, maintenance and any demand charges are not included and must come from quotations and the plant's own tariff.
- Existing gas boiler | 33444
- Heat pump only | 26130
- Recovery and boiler | 15053
- * Recovery and heat pump | 11760
```

Two points stand out. Heat recovery is the largest single saving in either combination, because it displaces 46 kW of bought heat at almost no exergy cost: the effluent's heat was going to the drain anyway. And the heat pump alone saves less than recovery alone at these tariffs, because electricity costs more per kilowatt-hour than gas, which offsets much of its second-law advantage. The second law ranks the opportunity; the prices decide the order of spending.

### How sensitive is the choice?

The ranking of exergy destruction does not depend on prices, but the choice between options 2 and 3 does, and an audit should show how much. Holding everything else fixed:

- If the heat pump reaches a COP of only 2.6 at the 42 °C inlet, option 3 costs about A$14,470 a year, still below option 2's A$15,050.
- If electricity costs A$0.30 per kWh instead of A$0.25, option 3 costs about A$14,110, still slightly below option 2.
- If both happen together, option 3 rises to about A$17,370 and option 2 becomes the cheaper to run.
- If gas falls to A$0.07 per kWh, option 2 costs about A$11,710, level with option 3 at the base assumptions.

Recovery is right in every case. Whether the heat pump follows it depends on the heat pump's real COP at the plant's conditions and on the tariffs over the equipment's life, which is why the audit asks for the supplier's figures at 42 °C inlet and at winter and summer outdoor temperatures before recommending option 3 outright. The second law has done its job by showing that the boiler is the dominant loss and that recovery is the first fix; it cannot set the price of electricity.

Emissions are a separate consideration that many businesses now weigh alongside cost. The Australian Government publishes emission factors for electricity and gas each year in its National Greenhouse Accounts Factors, and they differ between states because of their electricity supply. An audit that includes emissions should state the factors and year it used, in the same way it states its dead state and tariffs.

## The rest of the plant

The other items are smaller, but several are cheap.

```figure
type: checklist
title: The audit's recommendations, in order
caption: This is an illustration. Savings use the illustrative electricity tariff and 4,000 hours a year, excluding GST. Items marked open need measurement or quotations before a decision.
- Lower the compressor setpoint from 8 to 7 bar | about 1.4 kW, about A$1,400 a year, no capital cost; Chapter 8
- Find and repair air leaks | about 1.8 kW of compressor input if the estimate holds, about A$1,800 a year
- Replace the air filter element on pressure drop, not on a calendar | small, but it protects the setpoint reduction
- Install the effluent heat exchanger, counterflow, 3 K approach | 46 kW of heat displaced; Chapter 6
- ? Heat pump for 42 °C to 60 °C | needs supplier COP at the plant's inlet and outdoor temperatures; Chapter 3
- ? Compressor heat recovery | needs the manufacturer's recoverable heat and temperature; Chapter 9
- Clean the cool room's condenser and check setpoints | a COP of 2.8 instead of 2.5 would save about 0.5 kW, about A$500 a year; Chapter 3
- x Heat-to-power from effluent | rejected: the second-law limit is 2.1 kW before any real losses; Chapter 2
```

## Verifying the result

An audit's calculations are predictions. The only proof is the same measurement repeated after the change, at comparable conditions, with the same dead state.

1. **Before**: log the gas meter, the electricity sub-meters for the compressor and cool room, the wash-water flow and temperatures and the compressed-air flow and pressure, for at least two representative weeks.
2. **After**: repeat the same logging once each change has settled, at the same production rate where possible.
3. **Normalise**: divide energy by production, or by heat delivered, so that a busier or quieter week does not hide or invent a saving.
4. **Recalculate the exergy balance** for each changed item and compare it with the prediction. A shortfall points to a specific cause: a heat pump COP below its quoted figure, an exchanger approach wider than designed, a setpoint that drifted back.

A second-law balance is particularly good at diagnosis after a change, because each item's destruction is calculated separately. A first-law total can hide an underperforming machine behind a lucky week; an exergy balance item by item cannot.

## Common mistakes in a second-law audit

- **No stated dead state**, or different ones for different items, as in Chapter 7's two reports.
- **Temperatures in degrees Celsius** in a ratio or logarithm, as in Chapters 2 and 4.
- **Percentages instead of kilowatts.** A device with a low second-law efficiency and a small throughput may matter less than a good device with a large one. Rank by kilowatts destroyed.
- **Forgetting the surroundings** in an entropy balance, which produces apparent violations, as in Chapter 5's cool room.
- **Treating exergy as price.** Exergy shows where improvement is possible; tariffs, capital and emissions decide what is worth doing.
- **Datasheet figures at the wrong conditions**, such as a heat pump's COP at a mild rating point or a compressor's efficiency against an unstated benchmark, as in Chapters 3 and 9.
- **No verification.** Predictions that are never checked teach nothing and cannot be defended.

## Repeating the audit

A plant changes. Production grows, products change, equipment ages and tariffs move. An audit done once and filed becomes a historical document within a few years. The cheapest way to keep it alive is to repeat the measurements, not the whole study: the same sub-meters, flows and temperatures, logged for the same representative weeks each year, fed into the same exergy balances. A change in any item's destruction from one year to the next is a signal worth investigating. A heat exchanger whose approach has widened is fouling; a compressor whose isothermal efficiency has fallen may have a failing valve, a leak inside the package or a control fault; a cool room whose COP has dropped may need its condenser cleaned.

The second law also gives a natural trigger for a full review: whenever a large item is due for replacement. That is when a different kind of machine can be chosen at little extra cost, and when the dominant loss in the ranking, in this plant the boiler, can be removed rather than renewed.

## Writing it up

The audit report for a small plant need not be long, but it should let a reader check every number. A good structure is a one-page summary with the ranking and the recommendations; a page of assumptions, giving the dead state, operating hours, tariffs, GST treatment and property sources; one page per major item, showing its measurements and exergy balance; and an appendix of raw data. Each recommendation should name the measurement that will prove it worked. A report built that way can be handed to a supplier, a financier or the next engineer without any of them needing to redo the work.

## The error: the audit that ranked by energy

This is an illustration. Before this review, an earlier audit of the plant had ranked its "energy losses" by kilowatts of energy rejected. The warm effluent, 52 kW of heat to the drain, came first, and the audit's headline recommendation was the heat-to-power unit that Chapter 2 showed to be impossible as specified. The boiler's flue loss, 9.3 kW, came well down the list, and replacing the boiler was not considered at all.

The audit had measured correctly and added correctly. It failed because energy rejected is not the same as value lost. The effluent's 52 kW of heat carried only 2.1 kW of exergy, so it could never produce much work; its value lies in displacing heat that is bought, which a heat exchanger achieves and a power cycle cannot. The boiler, meanwhile, rejected little energy but destroyed 87.7 kW of exergy, nearly four-fifths of the plant's total.

Ranked by exergy, the same plant gave a different headline: change how the wash water is heated, using recovered heat first and a heat pump for the rest. The plant's management accepted the revised audit with one change of its own: verification measurements, written into the project's scope before any equipment was ordered. The earlier audit's measurements were reused in full, which is a fair summary of the difference between the two methods: the data were the same, and only the question asked of them had changed.

## How this applies to a small Australian business

A second-law audit sounds specialised, but for a small plant it fits on a few pages: a dead state, a dozen measured flows, an exergy balance for the five or six largest energy users, a ranking and a priced list of options. It does not replace an energy audit, a tariff review or a supplier's design. It makes sure that those efforts are aimed where physics leaves room to gain, and that impossible proposals are rejected before they cost anything.

Australian businesses considering projects of this kind may be able to draw on government energy-efficiency information and, at times, grants or finance schemes, which change frequently and should be checked at the time. Any change to gas appliances, pressure equipment, refrigeration circuits or electrical installations must be designed and carried out by appropriately licensed people.

## Exercise: the recommended package's second-law efficiency

For option 3, recovery and heat pump, the heat pump takes 11.76 kW of electricity and the effluent supplies its exergy through the exchanger, leaving with 0.032 kW of the 2.11 kW it carried in. The wash water gains 5.24 kW of exergy in all. Find the package's second-law efficiency and compare it with the gas boiler's 5.6%.

**Worked answer.** The exergy supplied is the heat pump's electricity plus the exergy given up by the effluent: 11.76 + (2.11 − 0.032) = 11.76 + 2.08 = **13.84 kW**. The product exergy is the wash water's gain, 5.24 kW, which checks against its two parts: 1.64 kW from the exchanger, from Chapter 7, plus 3.59 kW from the heat pump.

The second-law efficiency is 5.24 ÷ 13.84 = **37.9%**, nearly seven times the boiler's 5.6%. Most of the remaining loss is inside the heat pump, 8.2 kW, which sets the agenda for the next improvement: a machine designed for the 42 °C to 60 °C glide, or a hot water duty that needs less than 60 °C.
