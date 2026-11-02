---
book: thermoelectric-cooling-by-the-numbers
chapterSlug: choosing-the-operating-point
order: 4
title: "Choosing the operating point"
description: "How heat pumped, power and COP change with current, the current for best COP and for most cooling, how many modules to use, and why the cheapest choice on paper can let a cabinet overheat."
draft: false
---

A thermoelectric module has no single rated duty. The same module can pump 10 W efficiently or 40 W wastefully, depending on the current it is given and the temperature difference it must hold. Choosing the operating point means choosing the current and the number of modules together, and it is the central design decision for any thermoelectric cooler. It sets the capacity, the power drawn, the heat the hot side must reject, the supply voltage and, through the hot side's temperature, the module's life.

This chapter works out how a module's performance varies with current across fixed face temperatures, finds the currents for the best COP and for the most cooling, compares two, three, four and five modules for the cabinet cooler, and then shows what happens when the heat sinks are included. It finishes with a cooler set to its best COP that could not hold the cabinet below its limit.

## Performance against current

With the faces held at fixed temperatures, Chapter 3's model gives the heat pumped, the power and the COP at every current. For CC-1's design faces, 27.0 °C cold and 59.3 °C hot, a 32.3 K difference, one module behaves as the table shows.

```figure
type: compare
title: One module across CC-1's design faces, 27.0 °C cold and 59.3 °C hot
cols: Heat pumped | Voltage | Power | COP
rowhead: Current
- 1.0 A | −2.6 W | 3.64 V | 3.6 W | none: conduction exceeds the Peltier heat
- 2.0 A | 9.9 W | 5.63 V | 11.3 W | 0.876
- * 2.45 A, best COP | 14.8 W | 6.52 V | 16.0 W | 0.926
- 3.0 A | 20.3 W | 7.61 V | 22.8 W | 0.889
- 3.2 A, CC-1's design | 22.1 W | 8.01 V | 25.6 W | 0.864
- 4.0 A | 28.8 W | 9.60 V | 38.4 W | 0.749
- 5.0 A | 35.2 W | 11.58 V | 57.9 W | 0.608
- 6.0 A, the rating | 39.7 W | 13.57 V | 81.4 W | 0.488
caption: This is an illustration from the module constants of Chapter 3: S = 51.31 mV/K, R = 1.985 Ω, K = 0.5255 W/K. The thermoelectric cooler check gives the same values.
```

At 1 A the module cannot even overcome the conduction back through its legs across 32 K, and pumps heat the wrong way. The heat pumped rises with current, flattening as Joule heating grows, and would reach its peak of 42.8 W at 7.76 A, beyond the module's rating. The COP rises to a peak of 0.926 at 2.45 A and then falls steadily. Between the peak COP and the rated current, the heat pumped rises by a factor of 2.7 while the power rises by a factor of 5.1.

### Two currents that matter

The current for the best COP and the current for the most heat pumped both follow from the model.

```figure
type: formula
title: Currents for the best COP and for the most heat pumped
formula: Most heat pumped: I_Q = S T_c ÷ R
formula: Best COP: I_COP = S (T_h − T_c) ÷ [R (√(1 + Z T_m) − 1)]
caption: Temperatures in kelvin; Z = S² ÷ (R K) and T_m is the mean of the face temperatures. For CC-1's faces: I_Q = 0.05131 × 300.15 ÷ 1.985 = 7.76 A and I_COP = 0.05131 × 32.3 ÷ (1.985 × 0.3410) = 2.45 A.
- I_Q | current giving the most heat pumped at the given faces
- I_COP | current giving the best coefficient of performance
```

The formula gives the 2.45 A at which the table's COP peaks, and the COP is flat near its peak: anywhere between 2.0 A and 3.0 A it stays within 6% of its best. Notice that I_COP grows with the temperature difference: across a larger difference, the module needs more Peltier heat to overcome conduction before it pumps anything, and the best COP comes at a higher current. For the sample box's 44 K difference, Chapter 2 found I_COP = 3.53 A.

## How many modules?

A designer can meet the same load with fewer modules at higher current or more modules at lower current. With the faces held at CC-1's design temperatures, meeting 62 W gives the following.

```figure
type: compare
title: Meeting 62 W across CC-1's design faces with different numbers of modules
cols: Current per module | Voltage per module | Total power | COP | Heat to reject
rowhead: Modules
- 2 | 4.32 A | 10.22 V | 88.2 W | 0.703 | 150.2 W
- 3 | 3.04 A | 7.69 V | 70.1 W | 0.884 | 132.1 W
- 4 | 2.52 A | 6.65 V | 67.0 W | 0.925 | 129.0 W
- 5 | 2.23 A | 6.08 V | 67.7 W | 0.916 | 129.7 W
caption: This is an illustration with the faces fixed at 27.0 °C and 59.3 °C. In a real cooler the faces move with the heat flows, which the next section adds.
```

Two modules must run hard and waste power; three are close to efficient; four reach the best COP, because 62 W at the best COP needs 62 ÷ 14.8 = 4.2 modules' worth; five are slightly worse again, each now running below its best current. The power saved going from three to four modules is only 3.1 W. Against that, a fourth module costs money, needs a larger cold plate and hot plate and changes the electrical arrangement: four modules in series need 26.6 V, more than the 24 V supply, so they would have to be wired as two parallel pairs at 13.3 V, which suits a 12 V supply rather than the cabinet's 24 V.

### What the extra modules cost

Module count also has a price beyond the modules themselves. Each module needs its share of cold and hot plate, its own clamping and its own seal, and every extra module adds a set of solder joints that can fail. The trust's three-module cooler fits on standard 120 mm extrusions; a four-module cooler would need wider plates and fins and a larger enclosure on the cabinet door. Over a cooler's life, the power saved by a fourth module at best COP is worth a few dollars a year, as this chapter's exercise shows. It is worth paying for only where the electricity is expensive, such as on a solar-and-battery supply at a remote site, or where the cooler runs near its design point for most of the year.

## The sample box: a different operating point

SC-1's module works across 44 K, not 32 K, and the same analysis gives a different answer. Its heat pumped and COP at 1 °C cold and 45 °C hot are shown in the figure.

```figure
type: compare
title: SC-1's module across 1 °C cold and 45 °C hot faces
cols: Heat pumped | Power | COP
rowhead: Current
- 2.0 A | 1.0 W | 12.5 W | 0.08
- * 3.0 A, SC-1's setting | 10.1 W | 24.6 W | 0.41
- 3.53 A, best COP | 14.2 W | 32.7 W | 0.43
- 4.0 A | 17.3 W | 40.8 W | 0.42
- 5.0 A | 22.4 W | 60.9 W | 0.37
- 6.0 A, the rating | 25.5 W | 85.0 W | 0.30
caption: This is an illustration from the module constants of Chapter 3 with the faces fixed at 274.15 K and 318.15 K.
```

At 2.0 A the module barely overcomes conduction and pumps 1.0 W; at 3.0 A it pumps 10.1 W at a COP of 0.41; the best COP, 0.433, comes at 3.53 A with 14.2 W pumped; beyond that the COP falls again, to 0.30 at the 6.0 A rating, where the module pumps 25.5 W for 85 W of power. Across a large difference, the best-COP current is a larger share of the rating, and the range of currents that pump anything useful is narrower. SC-1 runs at 3.0 A, slightly below its best-COP current, because its load is only 9 W and the lower current keeps its small hot-side sink cooler, which Chapter 5 shows is worth more than the last few hundredths of COP.

The general rule from the two cases is that a small temperature difference gives the designer a wide choice of currents, while a large one leaves little choice and little efficiency. Reducing the difference, by better heat sinks or by a less demanding cold-side temperature, is always the first thing to try.

## Constant voltage or constant current

CC-1's three modules are wired in series across the 24 V supply, so each sees 8.0 V, and the current is whatever the modules draw at that voltage. Since each module's voltage is S ΔT + I R, the current depends on the temperature difference: a smaller difference leaves more of the 8.0 V to drive current through the resistance. On a 30 °C day, with the cabinet at 35 °C, the modules' faces move closer together, the current rises from 3.20 A to 3.45 A and the cooler pumps 87 W at a COP of 1.05. A constant-voltage supply therefore gives a little more current, and more cooling, when the difference is small, and a little less when it is large, which is the opposite of what a cabinet needs on a hot day but is harmless here because the design point is the hottest condition.

A constant-current supply holds the current fixed whatever the difference. It protects the modules from over-current when they are first switched on, when the faces are at the same temperature and the Seebeck voltage is zero, and the module draws its highest current, 8.0 ÷ 1.985 = 4.0 A at 8.0 V, until the difference builds up. Chapter 8 deals with that switch-on surge and with the choice between linear and switched supplies.

## Part load: run slower, not on and off

A cooler sized for the hottest afternoon is oversized for every other hour. On a mild evening the cabinet might need only 40 W of cooling. There are two ways to deliver it. A thermostat can switch the cooler fully on and off, running at 3.20 A for 60% of the time. Or a proportional controller can reduce the current so that the modules pump 40 W continuously, at about 2.31 A. With the faces held at the design temperatures for comparison, the on–off cooler averages 46.3 W of power and the proportional cooler 43.4 W, 6% less, because the lower current runs close to the best COP. In reality the proportional cooler's advantage is larger: at lower current its hot face runs cooler, the difference across the modules shrinks and the COP rises further. Proportional control also avoids the temperature cycling of each switch-on, which Chapter 9 shows is the main cause of module wear.

## Adding the heat sinks

Holding the faces fixed hides the most important interaction. The hot face sits above the outside air by the hot-side sink's thermal resistance multiplied by the heat it rejects; the cold face sits below the cabinet air by the cold-side exchanger's resistance multiplied by the heat it pumps. More current means more heat rejected, a hotter hot face, a larger difference across the modules and so less benefit from the extra current. Chapter 5 develops this balance in detail; here it is enough to see its effect on the choice of current.

The cabinet itself completes the loop. Its heat load is the electronics' 48 W plus heat leaking in through the insulated walls, 1.129 W per kelvin of difference between outside and inside air, as Chapter 6 calculates. With CC-1's sinks, a hot-side resistance of 0.10 K/W and a cold-side resistance of 0.12 K/W, and the outside air at 45 °C, the cabinet settles where the heat pumped equals the load.

```figure
type: compare
title: Where TC-1 settles with three modules at different currents, 45 °C outside
cols: Cabinet air | Hot face | Cold face | Heat pumped | Power | COP
rowhead: Current per module
- 2.45 A, best COP at design faces | 37.0 °C | 55.2 °C | 30.2 °C | 57.0 W | 45.2 W | 1.26
- * 3.20 A, CC-1's design | 32.3 °C | 59.0 °C | 24.8 °C | 62.3 W | 77.8 W | 0.80
- 4.00 A | 29.0 °C | 63.8 °C | 21.0 °C | 66.1 W | 121.6 W | 0.54
- 5.00 A | 27.0 °C | 70.7 °C | 18.8 °C | 68.3 W | 188.9 W | 0.36
caption: This is an illustration. Heat load 48 W + 1.129 W/K × (45 − cabinet air). Sinks 0.10 K/W hot and 0.12 K/W cold. The COP at 2.45 A is higher than at fixed faces because the lighter duty lets the faces move closer together.
```

The table carries the chapter's main lessons. Raising the current from 3.20 A to 5.00 A cools the cabinet by only 5.3 K more but multiplies the power by 2.4, and pushes the hot face to 70.7 °C, close to the modules' soldering limits. And the cheapest setting in power, 2.45 A, cannot hold the cabinet at its 35 °C limit.

## The mistake: a cooler set for its best COP

During commissioning, the electrical contractor read a note in the cooler supplier's application guide that thermoelectric coolers are most efficient at about 40% of I_max, and set CC-1's controller to limit the module current to 2.45 A to save power. The cooler ran quietly and the power meter showed 45 W instead of the expected 78 W.

```figure
type: steps
title: Recovering the cabinet's limit
caption: This is an illustration. Best COP is the right target only when the cooler still carries the load at that current.
- Current limited to 2.45 A per module | cooler power 45 W instead of 78 W
- First hot day, 44 °C outside | cabinet air reached 36.4 °C; router logged a high-temperature warning
- Check with the model at 45 °C outside | 3 modules at 2.45 A settle at 37.0 °C, above the 35 °C limit
- * Current limit restored to 3.2 A, the 24 V supply's full output | cabinet settles at 32.3 °C at 45 °C outside
- Control changed | thermostat proportional control between 30 °C and 34 °C, so the cooler runs at best COP on mild days and at full current on hot ones (Chapter 8)
```

On the first day above 40 °C, the cabinet passed 35 °C and the router logged a temperature warning. The reliability engineer checked the setting against the model: at 2.45 A, three modules settle the cabinet at 37.0 °C on a 45 °C day. The current limit was restored to the full 3.2 A that the 24 V supply drives through the three series modules, and the cabinet held 32.3 °C at 45 °C outside. The supplier's note was right about efficiency and wrong about this cooler's duty: best COP is the target for the hours when the load allows it, not a fixed setting. Chapter 8's proportional control does exactly that.

## Exercise: four modules at best COP

The trust's engineer asks whether a four-module cooler, running at 2.45 A per module, would be better. Using the second table's method, it settles the cabinet at 33.5 °C at 45 °C outside, with the hot face at 57.4 °C, the cold face at 26.2 °C, 61.0 W pumped and 63.4 W drawn. Compare it with the three-module cooler at 3.20 A on cabinet temperature, power, COP and the energy used over a summer of 1,200 hours at these conditions. Then say which you would choose and why.

### Answer

**Given:** three modules at 3.20 A: 32.3 °C, 62.3 W pumped, 77.8 W drawn. Four modules at 2.45 A: 33.5 °C, 61.0 W pumped, 63.4 W drawn. 1,200 hours.

**Assumptions:** both coolers use the same sinks, 0.10 K/W hot and 0.12 K/W cold; the conditions hold for all 1,200 hours, which overstates the energy because most summer hours are milder.

**Method:** compare the figures directly; COP = heat pumped ÷ power; energy = power × hours.

**Cabinet temperature:** 32.3 °C against 33.5 °C. Both hold the 35 °C limit; the three-module cooler has 2.7 K of margin and the four-module cooler 1.5 K.

**COP:** 62.3 ÷ 77.8 = 0.80 against 61.0 ÷ 63.4 = 0.96.

**Energy:** 77.8 × 1,200 = 93.4 kWh against 63.4 × 1,200 = 76.1 kWh, a saving of 17.3 kWh. At A$0.40 per kWh including GST, that is A$6.90 a summer.

**Choice:** the three-module cooler. The four-module cooler saves a few dollars a year in electricity but holds less margin below the limit, needs a fourth module, larger plates and a 12 V arrangement or a different supply, and runs closer to its capacity on the hottest days. If the cabinet's load grew, the three-module cooler could be given a supply allowing more current; the four-module cooler at best COP has no margin left at that current either. The comparison would tip the other way only if the electricity were several times dearer, as on a remote solar supply, or if the cooler ran near its design point for most of the year rather than for a few hot weeks.

**Verification:** the four-module case's power is consistent with its modules: 4 × 2.45 A × 6.47 V = 63.4 W, and its heat to reject, 61.0 + 63.4 = 124.4 W, is less than the three-module cooler's 140.2 W, which is why its hot face runs 1.6 K cooler.
