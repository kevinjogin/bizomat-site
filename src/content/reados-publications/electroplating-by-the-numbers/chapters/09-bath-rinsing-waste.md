---
book: electroplating-by-the-numbers
chapterSlug: bath-balance-rinsing-and-waste
order: 9
title: "Bath balance, rinsing and waste"
description: "Track how anode and cathode efficiencies shift a bath's metal content, calculate the rinse water a line needs, and understand the waste and health controls behind a plating price."
draft: false
---

A plating bath is not a fixed solution. Every rack that passes through it removes metal at the cathode, adds metal at the anodes, carries solution out on its surfaces and brings rinse water and soils in. The 1917 treatise observed that mixing a fresh solution was the easy part of a plater's knowledge, and keeping it working was the harder and more important part: if the anodes did not dissolve at exactly the rate metal was plated out, the bath would drift, and its acidity or alkalinity had to be held too.

This chapter puts numbers on that drift for the bracket order, calculates how much rinse water different rinsing arrangements need, and sets out the waste and health controls that sit behind every plating price. A purchaser does not run any of this, but understanding it explains what good platers spend their money on and what to ask a new one.

## Metal balance between anodes and cathodes

Chapter 3 introduced anode efficiency: the metal dissolved from the anodes as a fraction of Faraday's prediction. Zinc anodes in many baths dissolve with high efficiency, close to all of the current, while the cathode deposits only about 80% in the bracket bath. The difference accumulates in the solution.

This is an illustration. Assume the anodes dissolve at 100% and the cathode deposits at 80%. Each ampere-hour then puts 1.2197 g of zinc into the solution at the anodes and takes out 0.976 g at the work, a gain of about **0.244 g per ampere-hour**. Each bracket rack passes 93.66 A·h, so the bath gains about 22.8 g of zinc per rack, and about **2.28 kg** over the 100 racks of the order.

Drag-out removes some of it. If each rack carries about 0.4 L of solution out of the tank at a zinc concentration of 25 g/L, it removes 10 g per rack, about 1.0 kg over the order. The net gain is about 1.28 kg. In a 2,000 L tank, the zinc concentration rises by about 0.64 g/L during the order.

```figure
type: stats
title: Zinc balance in the bracket tank over the order
caption: This is an illustration, assuming 100% anode and 80% cathode efficiency, 0.4 L of drag-out per rack at 25 g/L and a 2,000 L tank.
- 2.28 kg | Excess zinc dissolved | 0.244 g per A·h × 9,366 A·h
- 1.0 kg | Carried out as drag-out | 10 g per rack
- *1.28 kg | Net gain in the bath
- 0.64 g/L | Rise in zinc concentration
```

A rise of 0.64 g/L over one order may be acceptable; over months of similar work it would carry the bath out of its range, with effects on deposit quality and efficiency. Platers control it by adjusting anode area, by replacing some soluble anodes with insoluble ones, by dilution and by regular analysis. The opposite problem, a bath losing metal, arises when anodes are neglected or insoluble anodes are used, which the treatise noted makes the composition change progressively and complicates operation. Chapter 3's efficiency failure began with exactly that.

## Analysis and additions

Bath control rests on regular measurement. A zinc bath is typically analysed for its zinc content, its main supporting chemicals, its pH or alkalinity, and its additives, and the results are compared with the chemical supplier's ranges. Additions are calculated from the analysis and recorded. Many platers also track the ampere-hours passed through each bath, because additive consumption is often proportional to charge, and dose brighteners by ampere-hour meter rather than by habit. The bracket bath's brightener was over-dosed in Chapter 3 precisely because it was added by habit at a rate set for a different workload.

## Rinsing: why it takes so much water

Every rack leaving a process tank carries a film of solution on its surfaces and in its recesses. That **drag-out** must be rinsed off before the next tank, or it contaminates the next solution and, after the last stage, stains the parts. Rinsing works by dilution, and the arithmetic of dilution explains why rinsing is designed rather than improvised.

The **rinse ratio** is the factor by which the concentration on the parts must be reduced, from the process tank's concentration to the concentration acceptable in the final rinse. If a rack drags out solution at a rate D, in litres per hour, a single rinse tank fed with fresh water at a rate Q settles at a concentration of about D ÷ Q times the process concentration. To achieve a rinse ratio R in one tank, Q must be about D × R. In a **counterflow** rinse, water enters the last tank, overflows into the one before it and leaves from the first, while the parts move the other way. With n tanks in counterflow, the water needed falls to about D × R^(1/n).

```figure
type: formula
title: Water for a counterflow rinse
formula: Q ≈ D × R^(1/n)
caption: This is an illustration for the bracket line: 0.4 L of drag-out per rack at 1.5 racks an hour, D = 0.6 L/h, and a rinse ratio of 1,000.
- D | drag-out rate, L/h
- R | required rinse ratio
- n | number of counterflow rinse tanks
- Q | fresh water needed, L/h
step: one tank: Q ≈ 0.6 × 1,000 = 600 L/h
step: two tanks: Q ≈ 0.6 × √1,000 ≈ 19 L/h
step: three tanks: Q ≈ 0.6 × ∛1,000 = 6 L/h
```

The difference is dramatic. Over an eight-hour shift, a single rinse after the zinc tank would use about 4,800 litres of water to do what two counterflow tanks do with about 152 litres and three with about 48.

```figure
type: bars
title: Rinse water per eight-hour shift after the zinc tank
unit: litres
max: 5000
caption: This is an illustration for a drag-out of 0.6 L/h and a rinse ratio of 1,000. Each added counterflow tank cuts water use, and the volume of waste to treat, sharply.
- Single rinse | 4800
- *Two-tank counterflow | 152
- Three-tank counterflow | 48
```

Reducing drag-out works on the same numbers from the other end. Racking parts so they drain, holding each rack above the tank for a few seconds before moving it, and avoiding cup-shaped orientations all reduce D, and every litre of drag-out avoided saves both bath chemicals and rinse water. A **drag-out tank**, a still rinse immediately after the process tank whose contents are returned to the bath as it loses water by evaporation, recovers much of the chemical that would otherwise go to waste.

## Water balance and the drag-out tank

A drag-out tank only works if the bath has room to take its contents back. Heated plating baths lose water by evaporation, and the plater tops them up. If the top-up comes from the drag-out tank instead of from fresh water, the chemicals carried out on the parts return to the bath.

This is an illustration. Suppose the bracket tank evaporates about 30 L a day at its working temperature, and the racks carry about 0.6 L an hour, 4.8 L over an eight-hour shift, into the drag-out tank. All of that can be returned with room to spare, and much of the 10 g of zinc each rack drags out is recovered rather than sent to the rinses. If the bath ran cool and evaporated less than the drag-out tank collected, the drag-out tank would overflow or have to be discharged, and the recovery would be lost. Platers therefore size drag-out recovery against evaporation, and some fit evaporators to make room for more return.

The same balance applies to the metal gain calculated earlier. Returning drag-out to the bath keeps zinc in the bath that would otherwise have left on the parts, so it adds to the excess from the anodes. Good bath control accounts for both together.

## Questions for a new plater

A purchaser does not need to understand every tank on a plating line to judge whether it is well run. A short set of questions, asked before the first order, says a good deal.

- How are bath composition and additives analysed, how often, and against what limits?
- How are anode area and metal balance managed?
- How many rinse stages follow each process tank, and how is rinse quality checked?
- What wastewater treatment is installed, under what trade-waste approval, and who removes regulated wastes?
- Which processes on the site use hexavalent chromium or cyanide, and how are they controlled?
- What records will accompany our parts?

A plater that answers these readily, with records to show, is almost always the one whose coatings are also consistent.

## Waste

Rinse water and spent solutions carry metals and process chemicals that cannot simply go to the sewer. Platers treat their wastewater, typically by adjusting pH to precipitate metals as hydroxides, separating the solids and checking the treated water before discharge under a trade-waste agreement with the local water utility, within limits set by the utility and the state or territory environmental regulator. Spent baths and treatment sludges are usually regulated wastes that must be transported and disposed of by licensed operators. Counterflow rinsing and drag-out recovery reduce all of this at the source, which is why they are standard on well-run lines.

For the purchaser, waste management matters in two ways. It is a real part of the cost of plating, so a quote far below others may reflect a plater who is not doing it properly. And a plater whose waste practices fail can be shut down by a regulator, taking the purchaser's parts and schedule with it.

## Health and safety

Safe Work Australia's guide to controlling the risks associated with electroplating covers the main hazards: storing and handling hazardous chemicals, electrical risks from high-current DC supplies, plant, noise and manual handling. Two chemical families need particular mention.

**Hexavalent chromium**, used in hard and decorative chromium plating and in some older passivates, is the more serious. SafeWork NSW's technical fact sheet notes that chrome electroplating is a high-risk activity for exposure, through mist, dust or fume and through skin contact with solutions. Its effects include allergic dermatitis, chrome ulcers on the hands and forearms, airway irritation and asthma, eye damage and, with inhalation, lung cancer. Inorganic chromium is listed in the schedule of hazardous chemicals that triggers health monitoring duties under the WHS Regulations, and the fact sheet sets out controls from elimination and substitution through local exhaust ventilation, mist suppression, enclosures and protective equipment to eye wash stations and safety showers. The exposure standard and monitoring requirements that apply should be checked against Safe Work Australia's current workplace exposure standards.

**Cyanide**, which the 1917 treatise called deadly poisonous while describing its use in copper plating, is still used in some baths. Cyanide solutions must never contact acids, because the reaction releases highly toxic hydrogen cyanide gas, so cyanide and acid processes are segregated in storage, on the line and in waste treatment.

The bracket line uses neither chemical in its zinc tank or its trivalent passivate, which is one of the reasons such processes have replaced older ones. But the same plater may run chromium or cyanide processes on other lines, and its controls affect everyone who works there or visits.

## A failure: the stained passivate

This is an illustration. Partway through the bracket order, the passivated brackets began to come out with patchy colour and streaks, and a salt spray check on samples showed white corrosion products well before the plater's usual result. The zinc thickness and adhesion were normal.

Analysis of the passivate solution found it contaminated with zinc plating solution well above the supplier's limit. The line had a single rinse between the zinc tank and the passivate, and during a busy period racks had been moved quickly with little drain time, raising the drag-out. A single rinse with a modest water flow could not remove enough plating solution, and the excess had been carried straight into the passivate, shortening its life and spoiling its performance.

The corrections followed the rinsing arithmetic. The passivate was replaced. The single rinse was converted to a two-tank counterflow rinse, which on the figures above achieves a rinse ratio of 1,000 with about one-thirtieth of the water a single tank needs. A minimum drain time over each tank was set and written into the hoist programme. And passivate analysis was added to the plater's weekly checks, so that contamination would be caught by measurement rather than by stained parts.

For the workshop, the episode had a practical lesson about its own parts. The formed channel that had complicated thickness distribution in Chapter 5 also held solution when the brackets were racked channel-up, increasing drag-out. Racking channel-down, which the plater adopted, drained the channel between tanks and cut the drag-out per rack, a small change that helped every rinse and every bath downstream.

## Exercise: rinsing a larger line

A larger line drags out about 0.9 L/h of zinc solution and needs a rinse ratio of 2,000 before the passivate. Calculate the fresh water needed per hour and per eight-hour shift for one, two and three counterflow rinse tanks.

For one tank, Q ≈ 0.9 × 2,000 = **1,800 L/h**, or 14,400 L per shift. For two tanks, Q ≈ 0.9 × √2,000 ≈ 0.9 × 44.7 ≈ **40 L/h**, about 322 L per shift. For three tanks, Q ≈ 0.9 × ∛2,000 ≈ 0.9 × 12.6 ≈ **11 L/h**, about 91 L per shift. The second tank does most of the work; the third saves a further 30 L/h or so, which may or may not justify its floor space. Reducing drag-out to 0.6 L/h by better draining would cut each figure by a third. Since the water saved is also wastewater that does not have to be treated, the benefit is counted twice: once in the water bill and once in the treatment plant's chemicals, sludge and running time.
