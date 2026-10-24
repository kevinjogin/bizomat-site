---
book: electroplating-by-the-numbers
chapterSlug: the-cell-and-faradays-laws
order: 2
title: "The cell and Faraday's laws"
description: "Understand the plating cell, use Faraday's laws to turn current and time into mass and thickness, and calculate the plating time and current for a rack of parts."
draft: false
---

Electroplating has one great advantage over most manufacturing processes: its central law is exact. The mass of metal deposited follows directly from the electric charge passed, so a plater who knows the current, the time and the area can predict the thickness before the parts go into the tank. When a coating comes out thinner than expected, the cause is almost always one of those three quantities, or the efficiency that Chapter 3 introduces.

The 1917 treatise called Faraday's laws the basis of all electrochemical calculations. This chapter restates them in modern form, turns them into thickness and plating time, and applies them to the bracket racks.

## The plating cell

The treatise defined the electrochemical cell as two metallic conductors, the electrodes, joined by a conducting liquid, the electrolyte, in a suitable container, with an external source of direct current. It insisted on careful names. The **anode** is the electrode at which current enters the electrolyte; the **cathode** is the electrode at which it leaves. It noted that people often said "positive pole" and "negative pole" instead, and recommended the proper terms to avoid confusion. That advice still stands, because the same words are used with opposite polarities in batteries, and confusion over which electrode is which has caused more than one reversed connection.

In a plating tank the work is the cathode. Metal ions in the solution move towards it and are deposited as metal. The anodes, usually bars or baskets of the coating metal, dissolve to replace the metal plated out. The treatise noted that a rheostat in series with each tank let the current be matched to the area of work, and that an ammeter in each tank, though "by no means common", was highly desirable. Modern rectifiers usually have both built in; what matters is that the current reaching each tank, and ideally each rack, is known.

## What can be deposited

Positively charged ions, or cations, travel with the current to the cathode. They are mostly metals, together with hydrogen. Negatively charged ions, or anions, travel the other way to the anode. Whether a metal can be plated depends on what happens to it at the cathode.

Many metals, including copper, nickel, zinc, tin, silver, gold, cadmium and iron, can be deposited from water-based solutions. Others cannot. The treatise explained that very reactive metals such as sodium, potassium and calcium react with water the instant they are released, forming hydrogen and a hydroxide instead of a metal coating, and noted that nobody had succeeded in depositing aluminium from such solutions. That remains true of ordinary water-based plating baths. It is also the reason hydrogen appears in almost every plating calculation: it is the competing cathode reaction, and Chapters 3 and 7 return to it.

## Faraday's laws

In modern words, Faraday's two laws of electrolysis say:

1. The mass of a substance produced at an electrode is proportional to the electric charge passed, which is the current multiplied by the time.
2. For the same charge, the masses of different substances produced are proportional to their equivalent weights: the molar mass divided by the number of electrons needed for each atom or molecule.

The treatise illustrated the first law plainly: two amperes for one minute deposit twice as much as one ampere for one minute, and one ampere for ten minutes deposits ten times as much as for one minute.

The constant that connects them is the **Faraday constant**, the charge carried by one mole of electrons. In the current SI it is exact: 96,485.332 12 coulombs per mole, as listed by NIST.

```figure
type: formula
title: Faraday's law for a plated metal
formula: m = I × t × M ÷ (n × F)
caption: For zinc, with M = 65.38 g/mol and n = 2, one ampere-hour deposits about 1.2197 g of zinc if all the current deposits metal.
- I | current, A
- t | time, s
- M | molar mass of the metal, g/mol
- n | electrons per ion deposited
- F | Faraday constant, 96,485.33 C/mol
step: m per A·h = 3,600 × 65.38 ÷ (2 × 96,485.33)
step: m per A·h = 235,368 ÷ 192,970.7
step: m per A·h ≈ 1.2197 g
```

The mass deposited by one ampere for one hour is the metal's **electrochemical equivalent**. The treatise tabulated these in grams per ampere-hour and gave an example: ten amperes for two hours deposit 10 × 2 × 1.1859 = 23.71 g of copper. With modern values the equivalent for copper is about 1.1855 g/A·h, and the answer is still 23.71 g. A century of refinement in atomic weights has not changed the result at the precision a plater needs.

```figure
type: bars
title: Mass deposited per ampere-hour at 100% efficiency
unit: g per A·h
max: 4.5
caption: Silver, with one electron per ion and a high molar mass, deposits most per ampere-hour. Chromium from a hexavalent bath needs six electrons per atom and deposits least.
- Silver (n = 1) | 4.0247
- *Zinc (n = 2) | 1.2197
- Copper (n = 2) | 1.1855
- Nickel (n = 2) | 1.095
- Chromium from Cr(VI) (n = 6) | 0.3233
```

The number of electrons matters as much as the molar mass. Chromium plated from a hexavalent solution needs six electrons per atom, so each ampere-hour deposits only about 0.323 g, a quarter of what it deposits as zinc. That is one reason hard chromium plating takes hours where zinc takes minutes.

## From mass to thickness

A plating specification gives thickness, not mass. The conversion uses the area plated and the density of the deposit. One micrometre of coating on one square decimetre is a volume of 0.01 cm³; for zinc, with a density of about 7.14 g/cm³, that weighs about 0.0714 g. Dividing the electrochemical equivalent by this figure gives the thickness that one ampere-hour per square decimetre deposits.

- **Zinc:** 1.2197 ÷ 0.0714 ≈ **17.08 µm** per A·h/dm²
- **Copper:** about **13.23 µm** per A·h/dm²
- **Nickel:** about **12.29 µm** per A·h/dm²
- **Chromium from Cr(VI):** about **4.50 µm** per A·h/dm²

The rate of thickness growth then follows from the current density, j, in amperes per square decimetre, and the current efficiency, η, the fraction of the current that actually deposits metal.

```figure
type: formula
title: Rate of zinc thickness growth
formula: rate (µm/min) = 17.08 × j × η ÷ 60
caption: This is an illustration at 2.0 A/dm² and 80% efficiency. At 100% efficiency the same current density would give about 0.569 µm/min.
- j | current density, A/dm²
- η | current efficiency, as a fraction
- 17.08 | µm of zinc per A·h/dm²
step: rate = 17.08 × 2.0 × 0.80 ÷ 60
step: rate = 27.33 ÷ 60
step: rate ≈ 0.4555 µm/min
```

## Plating time and current for the brackets

This is an illustration. The plater proposes to run the bracket racks at an average current density of 2.0 A/dm², and its measurements of this bath show a current efficiency of about 80%, a figure Chapter 3 examines. At that rate, an average thickness of 8 µm takes about 8 ÷ 0.4555 ≈ **17.6 minutes**. If all the current deposited zinc, it would take about 14.0 minutes.

But the specification asks for a **minimum** of 8 µm on significant surfaces, not an average, and Chapter 5 shows that the bracket's channel recess receives only about half the average current density. To give 8 µm in the recess, the average must be about 16 µm, which takes about 16 ÷ 0.4555 ≈ **35.1 minutes**.

Each rack carries 40 brackets of 2.0 dm² each, or 80 dm². At 2.0 A/dm² that needs **160 A** per rack. Over 35.1 minutes, each rack passes about 160 × 35.1 ÷ 60 ≈ **93.66 A·h**.

The mass deposited can be checked two ways, which is the habit Chapter 1 of *Oxy-Fuel by the Numbers* recommends for any measurement. From Faraday's law: 93.66 × 1.2197 × 0.80 ≈ **91.4 g** per rack. From the coating: 80 dm² × 16 µm × 0.0714 g per µm·dm² ≈ **91.4 g**. The two agree, and over the 100 racks of the order the brackets carry about **9.14 kg** of zinc, about 2.29 g each.

```figure
type: stats
title: One rack of brackets at 2.0 A/dm²
caption: This is an illustration. The average thickness is double the specified minimum because of the recess, Chapter 5.
- *160 A | Rack current | 80 dm² at 2.0 A/dm²
- 35.1 min | Plating time | 16 µm average at 80% efficiency
- 93.66 A·h | Charge per rack
- 91.4 g | Zinc deposited per rack
```

## Measuring charge rather than time

Faraday's law depends on charge, the product of current and time, and real plating currents are not always steady. The 1917 treatise describes starting a nickel batch at a higher voltage for a few minutes before reducing it, and many modern lines ramp the current up at the start of a cycle to avoid burning the first deposit. When the current varies, the charge is the sum of each current multiplied by the time it ran.

This is an illustration. Suppose the plater ramps each bracket rack at 100 A for the first 5 minutes, then runs at 160 A for the remaining 30.1 minutes of the planned 35.1. The charge is 100 × 5 ÷ 60 + 160 × 30.1 ÷ 60 ≈ 8.33 + 80.27 ≈ **88.6 A·h**, about 94.6% of the 93.66 A·h the plan assumed. The average coating reaches about 15.1 µm instead of 16, and the recess about 7.6 µm instead of 8, below the specified minimum. Running for about 1.9 minutes more at 160 A restores the full charge.

That is why many rectifiers carry an **ampere-hour meter**. Ending each cycle at a set charge, rather than at a set time, makes the deposit independent of how the current varied on the way. For the brackets, the work sheet can specify 93.66 A·h per rack at the planned efficiency, and the line stops each rack when the meter reaches it.

## What the voltage does and does not tell you

The deposit depends on the current, not the voltage. The voltage is whatever is needed to drive that current through the solution and across the two electrode surfaces, and it rises with the distance between anodes and work, with lower solution conductivity, with lower temperature and with poor electrical contacts. The 1917 treatise gave working voltages of one to two volts for an acid copper bath, three to five volts for a cyanide copper bath and three to six volts for plating generators generally. A modern zinc tank typically runs at a few volts as well.

The voltage still matters in two ways. First, it sets the energy used, which is voltage times current times time. This is an illustration. At 4.5 V and 160 A for 35.1 minutes, each bracket rack uses about 4.5 × 160 × 35.1 ÷ 60 ÷ 1,000 ≈ **0.421 kWh**, and the whole order about 42 kWh, a small cost that Chapter 10 puts in context. Second, a change in voltage at a set current is a symptom. A voltage that creeps up over a shift points to a falling solution temperature, depleting anodes or a contact going bad; one that drops can point to a short circuit between a rack and an anode. Recording voltage alongside current turns the rectifier display into a diagnostic instrument.

## Charge as a planning number

Once the charge per rack is known, it becomes a useful planning figure. This is an illustration. Each bracket takes about 93.66 ÷ 40 ≈ 2.34 A·h, and the order of 4,000 about 9,366 A·h. A rectifier that can deliver 500 A continuously can plate at most 500 A·h each hour, so the order needs at least about 18.7 hours of rectifier time even if the tank were always full and never stopped, before any time for loading, cleaning, rinsing and passivating. Chapter 4 shows how many racks the tank can hold at once, and Chapter 10 turns line time into cost. The point here is that a thickness specification is also a capacity commitment: doubling the average thickness to protect a recess doubles the charge, and with it the line time the order consumes.

## A failure: the rack that was half the size

This is an illustration. On the first production rack, the plater's operator set the current from a work sheet that gave the bracket's area as 1.0 dm². The figure was the area of one face of the flat blank, taken from a quoting drawing; it ignored the second face and the edges. The rectifier was set to 80 A instead of 160 A, so the true current density was 1.0 A/dm², and in 35.1 minutes the average coating reached only about 8 µm instead of 16. In the recess, where the coating is about half the average, it reached about 4 µm.

The plater's own check found it. A magnetic gauge reading on the first rack showed flat faces at about 8 µm, where the work sheet predicted about 16, and the recess at about 4. Faraday's law made the diagnosis immediate: half the thickness at the same time and efficiency means half the current density, which means either half the current or double the area. The current was as set, so the area was wrong. The corrected area, taken from the CAD model of the formed bracket including both faces and edges, was entered on the work sheet, the rectifier reset to 160 A, and the affected rack replated. The plater added a step to its job set-up: the area per part is taken from the purchaser's model or measured, not from a quoting sketch, and the first rack is always measured before the rest are run.

## Exercise: plating time for nickel

A small brass part with 0.5 dm² of surface is to receive 10 µm of nickel at an average current density of 1.0 A/dm², in a bath with a current efficiency of about 95%. Calculate the current, the plating time and the mass of nickel deposited.

The current is 0.5 × 1.0 = **0.5 A**. The rate of thickness growth is 12.29 × 1.0 × 0.95 ÷ 60 ≈ 0.1946 µm/min, so 10 µm takes about 10 ÷ 0.1946 ≈ **51.4 minutes**, or 0.8565 h. The mass deposited is 10 µm × 0.5 dm² × 0.08908 g per µm·dm² ≈ **0.445 g**. As a check by Faraday's law: 0.5 A × 0.8565 h × 1.095 g/A·h × 0.95 ≈ 0.445 g. Compare this with zinc: the same thickness at the same current density would take about 37 minutes at 95% efficiency, because each ampere-hour deposits more volume of zinc than of nickel.
