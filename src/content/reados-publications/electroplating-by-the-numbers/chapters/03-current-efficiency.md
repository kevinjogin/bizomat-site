---
book: electroplating-by-the-numbers
chapterSlug: current-efficiency-and-where-the-current-goes
order: 3
title: "Current efficiency and where the current goes"
description: "Measure how much of the plating current actually deposits metal, see what consumes the rest, and keep a plating time correct as the bath's efficiency changes."
draft: false
---

Faraday's law is exact, but it describes all the charge that crosses the cathode surface, not only the charge that deposits metal. In most plating baths some of the current does other work: it releases hydrogen, reduces other substances in the solution or leaks away through paths nobody intended. The fraction that deposits metal is the **current efficiency**, and it is the one number in a plating calculation that cannot be looked up in a table of constants. It must be measured on the bath in question, and it changes as the bath ages.

The 1917 treatise met the problem in its description of a cyanide copper bath: run at the current densities it gave, the amount of copper deposited was much less than Faraday's law indicated. This chapter explains why, how efficiency is measured, and how a fall in efficiency in the bracket bath was found and corrected before it produced thin coatings.

## Where the rest of the current goes

At the cathode, metal ions are not the only things that can accept electrons. In water-based solutions, hydrogen ions and water itself can be reduced to hydrogen gas, and that reaction competes with metal deposition all the time. Which wins depends on the metal, the bath chemistry, the current density, the temperature and the condition of the surface. Zinc and nickel deposit readily from well-designed baths despite the competition; chromium from hexavalent solutions deposits with only a small fraction of the current, the rest going mostly to hydrogen.

Other side reactions take smaller shares. Dissolved metals in a higher oxidation state, such as iron contamination in its ferric form, can be reduced at the cathode without depositing anything. Organic additives can be consumed. Some current may flow through paths that bypass the work entirely, to a tank lining, a heating coil or a rack hook that is not insulated.

The hydrogen matters for more than efficiency. Bubbles that cling to the surface block deposition beneath them and leave pits, which is why the treatise's illustrations of poor deposits included gas pitting in a heavy nickel layer, and why modern baths contain wetting agents. Some of the hydrogen enters the steel itself, and Chapter 7 shows why that can be far more serious than a pit.

## Defining efficiency

The **cathode current efficiency** is the mass of metal actually deposited divided by the mass Faraday's law predicts for the charge passed.

```figure
type: formula
title: Cathode current efficiency from a weighed panel
formula: η = m_measured ÷ (Q × e)
caption: This is an illustration. A 1.0 dm² steel panel plated at 2.0 A for 20 minutes gained 0.650 g of zinc against a Faraday prediction of 0.8131 g.
- m_measured | mass gained by the panel, g
- Q | charge passed, A·h
- e | electrochemical equivalent, g/A·h (zinc 1.2197)
step: Q = 2.0 × 20 ÷ 60 ≈ 0.6667 A·h
step: Faraday mass = 0.6667 × 1.2197 ≈ 0.8131 g
step: η = 0.650 ÷ 0.8131 ≈ 79.9%
```

The anode has its own efficiency: the mass of metal dissolved from the anodes divided by the Faraday prediction. Anode and cathode efficiencies need not be equal, and when they differ the metal content of the bath drifts. Chapter 9 works out what that does to the bracket bath over the whole order.

## What changes efficiency

Efficiency is a property of a bath in a particular state, not of a metal. It typically depends on:

- **Bath type.** Different chemistries for the same metal, such as acid and alkaline zinc baths, run at different efficiencies and respond differently to current density.
- **Current density.** In many baths efficiency falls as current density rises, because hydrogen evolution takes a larger share at high current. That has a geometric consequence: edges and corners, which receive the highest current densities, may plate less efficiently than flat faces, which partly offsets the uneven current distribution of Chapter 5.
- **Metal concentration.** As the metal content falls, deposition becomes harder and hydrogen takes a larger share.
- **Temperature and agitation.** Both affect how quickly metal ions reach the surface.
- **Additives and contamination.** Brighteners and other additives are dosed within narrow ranges; too much or too little, or contamination by other metals or by oils carried in from poor cleaning, can lower efficiency.

The chemical supplier's data for a bath usually gives the expected efficiency range and the conditions for it. For a running line, the useful figure is the one measured on that bath recently.

## Measuring efficiency in practice

The weighed panel above is the simplest method, and it can be done by any plater with a balance. A clean, weighed steel panel of known area is plated at a known current for a known time, rinsed, dried and weighed again. Two refinements make it reliable: the panel is plated in the same tank, at the same current density and temperature as production, and the current is measured with an ammeter in the panel's own circuit rather than read from the tank rectifier.

Platers also use a **Hull cell**, a small trapezoidal test cell in which a single panel experiences a range of current densities along its length. It shows at a glance where the deposit is bright, dull or burned, and how a bath's behaviour is changing, although it is a qualitative tool rather than a measure of efficiency.

Efficiency can also be inferred on production parts by comparing measured average thickness with the thickness Faraday's law predicts for the charge passed. That needs a reliable average thickness, which is harder to obtain than a panel mass, but it uses real parts in real racks and catches problems a panel might miss, such as current leaking through a damaged rack.

## Faster is not always better

Because efficiency often falls as current density rises, pushing the current up does not raise the plating rate in proportion, and the extra current mostly makes hydrogen. This is an illustration. If the bracket bath gave 80% efficiency at 2.0 A/dm² and 65% at 3.0 A/dm², the rates of thickness growth would be about 17.08 × 2.0 × 0.80 ÷ 60 ≈ 0.456 µm/min and 17.08 × 3.0 × 0.65 ÷ 60 ≈ 0.555 µm/min. Fifty per cent more current would give only about 22% more speed. Meanwhile the current going to hydrogen would rise from 0.4 A/dm² to about 1.05 A/dm², more than two and a half times as much, with more gas pitting, more risk of burning at the edges and, on hardened steel, more hydrogen available to enter the metal.

The 1917 cyanide copper bath illustrates the same trade-off. The treatise gave its working range as 20 to 30 amperes per square foot, about 2.2 to 3.2 A/dm², and noted that at those densities the copper deposited fell well short of Faraday's prediction. It also called potassium cyanide deadly poisonous, which is why such baths are now subject to strict controls, or replaced where alternatives exist. The plating rate a line can sustain is therefore set by quality, efficiency and safety together, not by the rectifier's capacity.

## Leaks in the circuit

Some lost current never reaches a cathode surface at all. A rack whose insulating coating has cracked can carry current to the hook rather than the parts; a heating coil or a metal tank lining can provide a parallel path; a rack touching an anode can short part of the circuit. These losses look exactly like a fall in efficiency on a weighed panel run in production conditions, but bath analysis will show nothing wrong.

A clamp-on DC ammeter separates the two. If the rectifier delivers 480 A to three racks, each rack's lead should carry about 160 A. A rack that draws far less, or a tank whose rack currents add up to much less than the rectifier output, has a leak. Checking rack currents is quick, and it belongs in the plater's routine whenever thickness falls without an explanation in the chemistry.

## Efficiency in the bracket calculation

This is an illustration. Chapter 2 planned each bracket rack at 2.0 A/dm² for 35.1 minutes, assuming 80% efficiency, to give an average of 16 µm and a recess minimum of 8 µm. The efficiency enters directly: the thickness obtained for a given charge is proportional to it.

```figure
type: bars
title: Average zinc thickness after 93.66 A·h per rack, by efficiency
unit: µm
max: 18
caption: This is an illustration. The planned 16 µm average assumes 80%. At 68.9% the same charge gives 13.8 µm average and about 6.9 µm in the recess, below the 8 µm minimum.
- *80% (planned) | 16.0
- 75% | 15.0
- 70% | 14.0
- 68.9% (measured in week 7) | 13.8
```

Energy efficiency is a separate measure, and it tells a different story. At 4.5 V and 93.66 A·h per rack, the line uses about 4.5 × 93.66 ≈ 421 W·h to deposit 91.4 g of zinc, about **4.61 W·h per gram**. Most of that energy goes into heating the solution through its resistance, not into the deposit. It costs little, as Chapter 10 shows, but it is one reason plating tanks often need cooling as well as heating.

## A failure: the efficiency that drifted

This is an illustration. The plater ran a weighed panel in the zinc tank at the start of each week. Over seven weeks of the bracket order the results were as follows.

```figure
type: line
title: Weekly panel efficiency in the zinc tank
x: Week
y: Cathode efficiency (%)
ymin: 60
ymax: 85
caption: This is an illustration. Efficiency fell steadily from week 4. After the bath was corrected in week 7, the week 8 panel returned to 79.6%.
legend: Weighed panel
- 1 | 80.1
- 2 | 79.9
- 3 | 79.5
- 4 | 78.0
- 5 | 75.2
- 6 | 72.0
- 7 | 68.9
- 8 | 79.6
```

The trend was visible from week 5, but the work sheet still said 35.1 minutes per rack, and nobody connected the panel results to the brackets until the plater's quality check in week 7 measured recess thicknesses of about 7 µm on several racks. At 68.9% efficiency, the planned charge gives an average of about 16 × 0.689 ÷ 0.80 ≈ 13.8 µm and a recess of about 6.9 µm.

The diagnosis followed the list of causes above. Bath analysis showed the zinc metal concentration had fallen below the chemical supplier's range, because the anodes had not been topped up during a busy period, and the brightener had been dosed by habit at the old rate, leaving it high. Both lower efficiency. The correction had three parts.

1. **Contain.** Racks plated since the efficiency fell below 75% were measured in the recess; those under 8 µm were replated.
2. **Correct.** Anodes were replenished and the brightener allowed to come back into range under the supplier's guidance. The week 8 panel returned to 79.6%.
3. **Prevent.** The work sheet was changed so the charge per rack is set from the latest panel efficiency. At 68.9%, for example, the charge needed is 93.66 × 0.80 ÷ 0.689 ≈ 108.7 A·h, about 40.8 minutes at 160 A. A panel below an agreed limit now stops the line until the bath is analysed.

The failure is a familiar one in process control: the measurement existed, but it was not connected to the decision it should have changed. Making the efficiency an input to the plating time closed that gap.

## Efficiency and the specification

A purchaser does not set the plater's efficiency, but can ask sensible questions. How is efficiency, or its effect on thickness, monitored? How often? What happens to the plating time when it changes? What is the limit at which production stops? A plater with good answers is controlling the one variable Faraday's law cannot supply. A plater who has never measured it is relying on the bath behaving as it did when the line was set up.

For parts that matter, the purchaser can also ask that the efficiency record be kept with the job. A plating record that shows, for each rack or batch, the charge passed, the latest panel efficiency and the thickness readings lets anyone check later that the three agree. If a coating fails in service, that record is often the only way to tell whether the plating was thin from the start or wore away, and it turns an argument between supplier and customer into a question with an answer. Chapter 10 sets out the full record.

## Reading efficiency from production thickness

A thickness check on production parts does more than accept or reject them. Combined with the charge recorded for the rack, it gives a running estimate of efficiency that does not depend on a separate panel. This is an illustration. If a bracket rack passed its planned 93.66 A·h and the average of several flat-face readings, corrected for the known pattern of distribution, came to 14.5 µm instead of the 16 µm planned, the implied efficiency is about 0.80 × 14.5 ÷ 16 ≈ 72.5%. That is a warning, worth a panel and a bath analysis, before the recess readings fall below the minimum.

This is only as good as the thickness measurements and the knowledge of how thickness varies across the part, which Chapter 5 develops. But it uses information the plater already collects, and it closes the loop between the measurement that the purchaser cares about, thickness, and the variable that the plater must control, efficiency.

## Exercise: a new panel result

A weighed 1.0 dm² panel plated in the bracket tank at 2.5 A for 15 minutes gains 0.640 g of zinc. Calculate the current efficiency, then the plating time needed at 2.0 A/dm² for a 16 µm average on the brackets.

The charge is 2.5 × 15 ÷ 60 = **0.625 A·h**. Faraday's law predicts 0.625 × 1.2197 ≈ 0.7623 g, so the efficiency is 0.640 ÷ 0.7623 ≈ **84.0%**. The rate of thickness growth at 2.0 A/dm² is 17.08 × 2.0 × 0.840 ÷ 60 ≈ 0.478 µm/min, so a 16 µm average takes about **33.5 minutes**, a little less than the 35.1 minutes planned at 80%. Before shortening the cycle, the plater should confirm the result with a second panel at the production current density of 2.0 A/dm², since this panel ran at 2.5 A/dm² and efficiency can change with current density.
