---
book: resistance-welding-by-the-numbers
chapterSlug: coated-steels-aluminium-and-difficult-materials
order: 9
title: "Coated steels, aluminium and difficult materials"
description: "Re-set a spot schedule for galvanised steel, see why aluminium needs nearly three times the current in a fraction of the time, and plan for faster electrode wear."
draft: false
---

Everything so far has been about clean, uncoated low carbon steel, the easiest material to resistance weld. It has moderate electrical resistivity, so it heats well; moderate thermal conductivity, so the heat stays where it is made; and a surface that conducts reasonably. Change any of those and the schedule changes with it. A zinc coating changes the surface. Aluminium changes everything: its resistivity, conductivity and oxide film. Copper is close to impossible by conventional spot welding.

This chapter re-sets the cabinet's spot schedule for a galvanised version, compares it with what aluminium would need, and shows how much faster the electrodes wear when the material is less forgiving.

## Zinc-coated steel

The cabinet's customer asks for an outdoor version in hot-dip galvanised 1.2 mm sheet. The zinc coating protects the steel, but it changes the welding in three ways.

First, zinc is a better conductor than steel and melts at a much lower temperature, about 420 °C. At the start of the weld the soft, conductive zinc at the faying surface spreads the current over a large area and lowers the interface resistance, so the heat concentrates less. TWI's guidance is that substantially higher currents are needed than for uncoated steel to compensate for the low interface resistance, with the actual increase depending on the coating and thickness.

Second, the zinc must be pushed out of the way before steel can weld to steel. TWI recommends longer weld times, allowing two to three cycles for the coating to be displaced before the weld starts to grow, and increasing the electrode force by about 10 to 20% compared with the uncoated setting, otherwise the welding range tends to be narrower.

Third, the zinc alloys with the copper of the electrodes. The alloy layer has lower conductivity and is weaker than the electrode material, so the faces pit, pick up and grow much faster. TWI notes that electrode wear is a greater problem with coated steel, and recommends good water cooling, an electrode body at least 2.5 to 3 times the tip diameter, truncated-cone faces, regular dressing or replacement and, where useful, current stepping.

## Re-setting the cabinet schedule for galvanised sheet

This is an illustration. Following that guidance, the shop increased the force from 3.0 to 3.5 kN, an increase of 17%, and the weld time from 10 to 13 cycles, adding three cycles for coating displacement. A new weld-lobe trial on galvanised coupons, again with a neighbouring spot at 30 mm pitch, found:

- minimum current for a 4.38 mm nugget, about **9.6 kA**;
- expulsion, at about **11.4 kA**;
- window width, **1.8 kA**, narrower than the 2.3 kA on uncoated sheet.

The shop set **10.4 kA**, again a little below the midpoint of 10.5 kA, to leave room for faster electrode wear.

```figure
type: compare
title: The cabinet spot schedule, uncoated and galvanised
cols: Uncoated 1.2 mm | Galvanised 1.2 mm
caption: This is an illustration. The direction of every change follows TWI's guidance for zinc-coated steel; the values come from the shop's own lobe trials, not from any standard.
- Electrode force | 3.0 kN | 3.5 kN
- Weld time at 50 Hz | 10 cycles (0.20 s) | 13 cycles (0.26 s)
- Welding window | 8.2 to 10.5 kA | 9.6 to 11.4 kA
- Set current | 9.0 kA | 10.4 kA
- Dressing interval | 500 welds | 150 welds
```

The heat per weld rises with the current squared and with the time. Compared with the uncoated schedule, (10.4 ÷ 9.0)² × (13 ÷ 10) ≈ **1.74** times the I²t, much of it spent melting and expelling zinc and heating a surface layer that conducts well, before the steel nugget forms.

## The cost of faster wear

The shop's tip-life trial on galvanised sheet showed the 6 mm faces growing to the 6.6 mm dressing point in about 150 welds instead of 500. At 2,560 spots a day, that means 2,560 ÷ 150 ≈ **17 dressings a day** instead of about five.

```figure
type: bars
title: Electrode dressings needed per day at 2,560 spots
unit: dressings per day
max: 20
caption: This is an illustration. Galvanised sheet wore the faces to the dressing point in 150 welds instead of 500, so the welder stops for dressing more than three times as often.
- Uncoated sheet, dress every 500 welds | 5.1
- *Galvanised sheet, dress every 150 welds | 17.1
```

Each dressing stops production briefly, removes copper, and must be followed by a stepper reset. Each pair of caps therefore lasts fewer working days. The shop also tightened its stepper, adding 3% every 30 welds on galvanised sheet, a schedule set from its own trials as TWI advises. Chapter 10 shows how this raises the cost per weld.

The shop considered two alternatives. Dispersion-strengthened copper caps, which TWI notes can reduce sticking and improve life on coated steel, cost more per cap but might halve the number of dressings. And an automatic tip dresser mounted beside the welder would dress the faces in a few seconds without the setter. Both were trialled; the results feed the cost comparison in Chapter 10.

## A note from 1918

Hamilton and Oberg's advice for zinc-, lead- or aluminium-coated sheet was to decrease the pressure and time compared with pickled sheet, giving an example of 100 to 150 pounds of pressure (about 450 to 670 N), 10 kW and a shorter time than for pickled sheet. Modern guidance is the opposite: more force, more time and more current. The book does not explain its reasoning, and its coatings, machines and much longer weld times were very different, so it is not possible to say with confidence why their practice differed. The point for a modern reader is simply that the 1918 settings must not be used: the modern guidance, confirmed by weld trials, governs.

## Aluminium

Aluminium is a different problem. Its electrical resistivity is a fraction of steel's and its thermal conductivity several times higher, so it produces less heat for a given current and conducts that heat away faster. Its surface is covered with a thin, hard oxide that has very high electrical resistance. TWI summarises the consequences: much higher welding currents; short weld times to generate the heat quickly before it is conducted away; a strong effect of surface condition on the heat generated, the settings needed and the weldability; and rapid electrode wear because copper readily alloys with aluminium.

TWI gives typical settings for commercial-quality welds on 1.2 mm mill-finished aluminium sheet of about 3 to 5 kN force, 2 to 5 cycles (40 to 100 ms) weld time and 22 to 28 kA current, and refers to BS EN ISO 18595 for guidance on spot welding aluminium. Compared with the cabinet's uncoated steel schedule:

| | Cabinet, uncoated steel | Aluminium, 1.2 mm (TWI typical range) |
|---|---|---|
| Current | 9.0 kA | 22 to 28 kA |
| Weld time | 10 cycles (200 ms) | 2 to 5 cycles (40 to 100 ms) |
| Force | 3.0 kN | 3 to 5 kN |

Taking mid-range values of 25 kA and four cycles, the current is (25 ÷ 9) ≈ 2.8 times the steel current, for 0.4 of the time. The machine must deliver almost three times the current. From Chapter 3, with the same 0.50 mΩ secondary loop, 25,000 A needs 12.5 V and 312.5 kVA during the weld, far beyond the cabinet welder. Aluminium is welded on machines built for it.

The surface condition matters as much as the settings. TWI distinguishes mill-finished sheet, which is generally weldable but can be inconsistent; chemically deoxidised or abraded sheet, which has a consistent but very low surface resistance and so needs even higher current; specially treated sheet designed for welding; and anodised, heavily chromated, passivated or dry-lubricated sheet, which is usually unweldable because the surface is insulating. A designer specifying an aluminium cabinet must specify the surface condition along with the alloy.

Electrodes for aluminium sheet of 1 to 3 mm typically have a dome face of 50 to 100 mm radius, according to TWI, with high-conductivity Class 1 materials preferred. Wear is rapid: attention to the electrodes is usually needed after a few hundred welds, and very frequent light buffing to prevent a visible alloy layer has been shown to give good reproducibility and electrode life.

## Unequal thicknesses and three-sheet stacks

Real products rarely weld two identical sheets. When a thin sheet is welded to a thick one, the nugget tends to form nearer the middle of the total stack, which lies inside the thicker sheet, so the thin sheet can end up with too little penetration. The same applies to three-sheet stacks, where the outer thin sheet is the one at risk. Several remedies shift the heat towards the thin sheet:

- a smaller electrode face, or a higher-conductivity electrode material, on the thick side, to cool it more and concentrate current less there;
- a larger or lower-conductivity electrode on the thin side, or a face material that runs hotter;
- with inverter direct-current welders, use of the polarity effect.

TWI notes, for aluminium, that with DC supplies nugget growth is offset slightly towards the positive electrode, and that this can be used to advantage when welding dissimilar thicknesses by placing the thinner sheet on the positive side, while the positive electrode wears faster than the negative one.

The minimum nugget size for an unequal stack is normally based on the thinner sheet, as in Chapter 2, but the nugget must penetrate adequately into the thin sheet as well as reaching the required diameter. Peel tests on unequal stacks are read on the thin side, and sections are used to check penetration. For the cabinet, the hinge reinforcement plate of 2.0 mm welded to the 1.2 mm body is such a stack, and its schedule was set by a separate lobe trial with the minimum based on 1.2 mm and penetration checked on sections.

## Other materials

**Stainless steels** have higher electrical resistivity and lower thermal conductivity than low carbon steel, so they generally need less current, but their strength at high temperature means more force is needed to forge the nugget and contain it.

**High-strength steels** used in vehicles are resistance welded routinely, but their higher strength and hardenability mean higher forces and, for some grades, pulsed or tempering schedules of the kind mentioned in Chapter 2. Their behaviour is linked to the carbon equivalent ideas in [Weldability by the Numbers](/reados/publications/weldability-by-the-numbers/carbon-cooling-rate-and-hardness/).

**Copper and its high-conductivity alloys** produce so little heat for a given current that conventional spot welding is impractical. TWI lists lower efficiency for highly conductive materials as a limitation of resistance welding, and Hamilton and Oberg noted in 1918 that copper was among the materials difficult to seam-weld. Copper is usually joined by brazing, soldering, ultrasonic welding or special resistance methods with refractory-faced electrodes that generate heat in the electrode itself.

## Fumes from coated material

Welding zinc-coated steel produces zinc oxide fume. Safe Work Australia's model code of practice on welding processes lists zinc oxides from galvanised and painted metal as a cause of metal fume fever. Resistance welding produces far less fume than arc welding, but expulsion from galvanised sheet still releases zinc fume close to the operator's face. The outdoor cabinet line was given local exhaust extraction at the welder, and the shop's risk assessment was updated for coated materials.

## A failure: the morning after a dressing

This is an illustration. During the first week on galvanised sheet, peel tests at mid-morning repeatedly showed undersized nuggets, even though the start-of-shift tests had passed. The welder had been dressed at the start of the shift, as it had been on uncoated sheet.

The tip-life records explained it. The setter was still dressing at the uncoated interval of 500 welds. On galvanised sheet the faces passed the 6.6 mm dressing point after about 150 welds, so by mid-morning, around 400 welds after dressing, they had grown well past it. The stepper, also still on the uncoated settings, was adding only 2% every 100 welds, far too little to keep up. The faces were also visibly pitted with a brassy alloy layer.

The dressing interval was changed to 150 welds, enforced by a weld counter that stops the welder until the tips are dressed, the stepper was changed to the galvanised schedule, and peel tests were added after each dressing during the first month. The shop then trialled an automatic tip dresser, described in Chapter 10.

## Exercise: aluminium on the cabinet welder

The customer asks whether the cabinet welder could make aluminium cabinets in 1.2 mm sheet at 24 kA for four cycles. Using the 0.50 mΩ secondary loop from Chapter 3, calculate the secondary voltage, the kVA during the weld and the primary current at 415 V. Compare the kVA with the 40.5 kVA used for the steel cabinet.

The secondary voltage is 24,000 × 0.000 50 = **12.0 V**. The demand during the weld is 12.0 × 24,000 ÷ 1,000 = **288 kVA**, and the primary current is 288,000 ÷ 415 ≈ **694 A**. That is about 7.1 times the 40.5 kVA used for the steel cabinet.

The cabinet welder cannot deliver anything like this, and the supply circuit could not carry it. Aluminium cabinets would need a welder designed for aluminium, usually an inverter DC machine, which TWI notes gives greater control of the short welding pulse, along with a suitable supply, electrodes and dressing routine.
