---
book: real-gases-by-the-numbers
chapterSlug: specifying-and-checking-a-gas-supply
order: 8
title: "Specifying and checking a gas supply"
description: "LN-1's demand in kilograms, packs against microbulk on real-gas numbers, the specification sheet, a monthly reconciliation of gas bought and used, and a changeover set too low."
draft: false
---

The earlier chapters each dealt with one way a real gas departs from the ideal law: contents, temperature, throttling, liquefaction, flow. A gas supply has to get all of them right at once, and the people who specify, buy and run it are usually not the same people. The production planner sets the demand, the gas supplier sets the contents and delivery, the maintenance team sets the regulator and the changeover, and the operators read the gauges. Each needs the same few numbers, stated the same way.

This chapter pulls the book together for LN-1. It turns the laser's use into a demand in kilograms, compares the cylinder packs and the microbulk tank on real-gas numbers, sets out a specification sheet that carries those numbers to everyone who needs them, adds a monthly check that compares gas bought with gas used, and ends with a changeover pressure that had been set too low.

## Demand in kilograms

Everything starts from the mass flow, because mass has no reference conditions and no compressibility factor. This is an illustration.

- Nozzle flow while cutting: **36.0 kg an hour** (Chapter 7).
- Beam-on hours: about **6 a day**, so **216 kg a day**.
- Working days: about **240 a year**, so **51,840 kg a year**.
- Peak: the laser's flow at the highest cutting pressure it is set to use, which sets the regulator's capacity and the line's size, not the contents.

Two quantities are deliberately missing from that list. One is gas used while the beam is off, for piercing, purging and idle flow, which a meter on the line measures better than an estimate. The other is leakage, which Chapter 7 showed can run to several packs a year and which the reconciliation below is designed to find.

## Option A: cylinder packs

From Chapter 1, each LN-1 pack holds 231.79 kg at 30.1 MPa and 15 °C, and its usable contents above the 2.5 MPa changeover are **209.74 kg**.

- Packs a year: 51,840 ÷ 209.74 = **247**, about one a working day.
- Gas returned unused in the residual: 247 × 22.05 = about **5,450 kg a year**, 9.5% of each pack's contents. The supplier charges for the pack, not the gas left in it, so this is paid for and not used.
- Autonomy: 5.83 hours of cutting per pack. With two packs on an automatic changeover manifold, the cell can run a full day on one while the other is replaced.
- Temperature and contents: the goods-in chart from Chapter 4 checks each delivered pack.

## Option B: microbulk

From Chapter 6, the 1,000 litre microbulk tank at 2.5 MPa holds **484.4 kg** when filled to 90%.

- Fills a year: 51,840 ÷ 484.4 = **107**, a delivery about every two working days, with telemetry to call deliveries when the level falls rather than by the calendar.
- No residual returned: the tank is topped up in place.
- Boil-off: whatever the tank's stated evaporation rate is, it is lost over weekends and holidays when nothing is drawn; Chapter 6's illustration of a 20 watt heat leak gave about 47 kg over a long weekend.
- Cold gas: liquid drawn off at −153 °C must be fully vaporised and warmed before the regulator, which the tank's ambient vaporiser does; its capacity must cover the laser's peak flow, or the gas reaches the line cold, the same problem as in Chapter 5 but larger.

Neither option is right for every shop. The comparison that matters is made in kilograms, on the same demand, with the residual, the boil-off and the deliveries counted, and then priced with the supplier's actual quotation. Prices are not given here: they depend on the supplier, the contract and the volume, and must come from quotations, with GST shown separately.

```figure
type: compare
title: LN-1's supply options on a demand of 51,840 kg a year
rowhead: Measure
cols: Cylinder packs | Microbulk tank, 1,000 L at 2.5 MPa
best: 0
caption: This is an illustration from the real-gas figures in Chapters 1 and 6. Prices come from the supplier's quotation, compared on the same basis.
- Usable gas per delivery | 209.74 kg per pack | 484.4 kg per fill at 90%
- Deliveries a year | 247 packs | 107 fills
- Gas paid for and not used | about 5,450 kg returned in residuals | boil-off when idle, from the tank's stated rate
- Autonomy at 36 kg/h | 5.83 h per pack | 13.5 h per fill
- Main real-gas risks | contents overstated by the ideal law; cold regulator outlet | liquid density at working pressure; vaporiser capacity
```

## The specification sheet

The errors in this book came from people using different numbers for the same thing. The cure is one sheet, kept with the supply and given to everyone who works on it. For LN-1 it reads, in substance:

1. **Gas and quality:** nitrogen, at the purity the laser maker specifies for the material and edge finish.
2. **Demand:** 36.0 kg/h while cutting, about 216 kg a day; peak flow as set by the highest cutting pressure.
3. **Pressures, each marked absolute or gauge:** pack filled to 30.0 MPa gauge at 15 °C; changeover at 2.5 MPa absolute; line 1.8 MPa gauge; nozzle 1.6 MPa absolute.
4. **Contents, in kilograms at stated conditions:** 231.79 kg per pack at 15 °C; 209.74 kg usable.
5. **Volumes, if used at all:** at 15 °C and 101.325 kPa, labelled as such.
6. **Temperatures:** regulator outlet as low as −20 °C on a full pack; gas at the machine above 0 °C; materials rated accordingly.
7. **Goods-in check:** full-pack readings by temperature, from Chapter 4.
8. **Siting and safety:** pack enclosure ventilated and out of the sun; storage and handling under AS 4332 and the supplier's instructions; oxygen-depletion risk assessed for any enclosed space.
9. **Records:** packs received, residual returned, beam-on hours, monthly reconciliation.

```figure
type: steps
title: Building a gas supply specification
caption: Each step uses one chapter of this book. Every pressure is marked absolute or gauge, and every quantity is in kilograms or at stated reference conditions.
- Demand in kilograms | nozzle flow × beam-on hours, plus measured idle use
- Contents in kilograms | real-gas density at the fill pressure and temperature
- Usable contents | less the residual at the changeover pressure
- Temperatures | regulator outlet from enthalpy; gas temperature at the machine
- Liquefied gases | liquid density at the working pressure; contents by weight
- * Reconciliation | gas bought less residual against gas the cell should have used
```

## Who uses which number

The sheet works because each person who touches the supply takes their figure from it rather than from memory or a general table.

- The **production planner** uses the demand and the usable contents, in kilograms, to schedule changeovers and deliveries.
- The **gas supplier** confirms the contents, the filling conditions and the reference conditions of any volume it quotes, and supplies the tank's stated evaporation rate for microbulk.
- The **maintenance team** sets the regulator and the changeover pressure, checks the materials' temperature ratings against the regulator's outlet temperature, and leak-tests fittings after any work.
- The **goods-in officer** checks each delivery against the temperature chart.
- The **operators** read the line pressure, not the pack gauge, when cutting quality changes, and report frost, hissing or a sagging line.
- The **quality or production engineer** runs the monthly reconciliation and owns the sheet.

## The oxygen in the enclosure

One safety number belongs on the sheet because it follows directly from the contents. Nitrogen released into an enclosed space displaces the air, and with it the oxygen. For a space that is well mixed and closed, the oxygen fraction after a volume of gas V_gas has been released into a room of volume V_room falls roughly as:

oxygen fraction = 20.95% × e^(−V_gas ÷ V_room)

This is an illustration for a 15 m³ store room, if the pack were moved indoors. One 50 litre cylinder holds 15.45 kg, which is **13.0 m³** of gas at 15 °C and atmospheric pressure. Released into the closed room, it would bring the oxygen down to about **8.8%**, a level at which a person can collapse without warning. Even 5 m³ from a leaking fitting would take it to about 15%. LN-1's whole pack holds fifteen times as much.

The calculation is crude, because real rooms are neither perfectly mixed nor perfectly closed, but it shows why inert gas supplies are sited outdoors or in ventilated enclosures, why indoor installations need a risk assessment and often a fixed oxygen monitor, and why the real-gas contents, not the ideal-gas figure, should go into the assessment. Work health and safety law and the supplier's requirements govern the actual measures; Safe Work Australia's guidance on confined spaces and hazardous atmospheres is the starting point for the assessment.

## The monthly reconciliation

A gas supply leaks money in ways no one sees: small leaks, gas left in returned packs, unmetered purges, a regulator set higher than needed. The cheapest way to find them is to compare, each month, the gas the shop paid for with the gas the cell should have used.

This is an illustration for one month of 21 working days.

- **Bought:** 22 packs at 231.79 kg = 5,099.4 kg.
- **Returned in residuals:** 22 × 22.05 = 485.1 kg.
- **Consumed from the packs:** 4,614.3 kg.
- **Expected:** 21 days × 6 beam-on hours × 36.0 kg/h = **4,536 kg**, from the laser's logged beam-on time.
- **Unexplained:** 4,614.3 − 4,536 = **78.3 kg**, **1.7%**.

A leak equivalent to a 0.1 mm hole in a line pressurised round the clock would account for about 54 kg a month (Chapter 7), and idle and purge flow for some of the rest. At 1.7% the reconciliation is telling the shop that nothing large is wrong. If it rose to 5% or 10%, the first places to look would be fittings disturbed since the last month, the line left pressurised over a weekend, and a change in cutting pressure that the expected figure had not caught. The reconciliation only works if every figure in it is in kilograms and every pack's contents are real-gas contents; done with the ideal law, Chapter 1's 13.9% error would swamp every leak in the shop.

## When to review the sheet

A specification that was right on the day the supply was installed drifts out of date as the work changes. The sheet should be reviewed, and its numbers recalculated, when any of these happens:

- a new machine, nozzle size or cutting pressure, which changes the demand and the peak flow;
- a change of gas, such as a switch to a different assist gas for another material, which changes every compressibility factor, Joule–Thomson coefficient and vapour pressure in the calculations;
- a change of supplier or cylinder size, which changes the stated contents and their reference conditions;
- a move of the pack or tank, which changes its temperatures through the year, its ventilation and the length of the line;
- a reconciliation that moves outside its usual range for two months running.

Each of those is a short calculation with the methods in this book, and each is cheaper than the failure it prevents.

## The error: a changeover set too low

This is an illustration. When the shop fitted the automatic changeover manifold, the installer set it to switch to the full bank when the empty bank fell to 1.5 MPa gauge, 1.6 MPa absolute, on the reasoning that this would use as much of each pack as possible. The residual at 1.6 MPa and 15 °C is 0.75 × 18.78 = 14.09 kg, against 22.05 kg at 2.5 MPa, so each pack would give 7.96 kg more gas, about 13 minutes of cutting.

Within a few weeks, the operators noticed that the last parts cut before each changeover had heavier dross on their bottom edges, and two batches of stainless brackets were reworked. The quality engineer logged the line pressure and found it sagging from 1.8 MPa gauge to as low as 1.45 in the last quarter of an hour before each switch. A regulator cannot deliver more than its inlet pressure, and needs some margin above its outlet to hold it steady at full flow. Below about 2.5 MPa at its inlet, LN-1's regulator could not hold 1.8 MPa gauge, and the laser's valve, set to 1.6 MPa absolute behind the nozzle, was being fed with less than it needed.

The changeover was reset to 2.5 MPa absolute, 2.4 MPa gauge, as the specification sheet had said. The 7.96 kg a pack was not a saving: it was gas delivered at a pressure the process could not use, bought at the price of reworked parts. The specification sheet now gives the changeover pressure with the reason beside it.

```figure
type: checklist
title: Monthly checks on LN-1's gas supply
caption: The reconciliation catches leaks and drift; the pressure log catches regulator and changeover faults. The last line is this chapter's error.
- Gas bought less residual returned, in kilograms | 4,614.3 kg in the illustrated month
- Gas the cell should have used, from beam-on hours | 4,536 kg
- Unexplained share | 1.7%; investigate above about 5%
- Line pressure logged through each changeover | holds 1.8 MPa gauge throughout
- Goods-in readings checked against the temperature chart | each pack within 0.5 MPa
- x Changeover below the regulator's working inlet pressure | line sagged to 1.45 MPa gauge; dross on edges
```

## Exercise: the second laser

The shop plans a second laser drawing the same 36.0 kg an hour for 4 beam-on hours a day, alongside LN-1's 6 hours. On 240 working days a year, how many packs a year would the two need, how much gas would go back in residuals, and how often would a 1,000 litre microbulk tank at 2.5 MPa need filling? What else in the supply must be checked?

**Worked answer.**

- Demand: (6 + 4) × 36.0 = 360 kg a day; 360 × 240 = **86,400 kg a year**.
- Packs: 86,400 ÷ 209.74 = **412 a year**, about 1.7 a working day.
- Residuals: 412 × 22.05 = **9,080 kg a year** returned unused.
- Microbulk fills: 86,400 ÷ 484.4 = **178 a year**, a fill about every 1.3 working days, so a larger tank would be worth quoting.

Beyond the quantities, the peak flow rises if both lasers cut at once, to 72 kg an hour: the regulator's capacity, the line's pressure drop (Chapter 7, now with twice the flow and four times the drop), the cold at the regulator outlet (Chapter 5, now 760 W of heat to put back) and, for microbulk, the vaporiser's capacity must all be checked at the combined flow, not at one laser's.
