---
book: plain-bearings-by-the-numbers
chapterSlug: choosing-the-clearance
order: 5
title: "Choosing the clearance"
description: "See how radial clearance moves a journal bearing's temperature, film, side flow and peak pressure, turn drawing tolerances into a running clearance band, and set rebuild limits."
draft: false
---

Clearance is the one dimension of a journal bearing that the designer chooses almost freely and the workshop controls directly. It is also the one that most changes how the bearing behaves. Make it tighter and the wedge is sharper, so the journal runs nearer centre, but the oil is sheared harder and the bearing runs hotter. Make it looser and the bearing runs cooler, but the journal sits further off centre, more oil leaks from its ends, the peak pressure rises and the film loses the stiffness that keeps the shaft steady.

This chapter follows FB-75's bearing through a wide range of clearances with the short-bearing solution and its heat balance, turns the drawing's bore and journal tolerances into a band of running clearance, allows for the shrinkage of clearance as the journal runs hotter than its housing, and sets the limits at which a worn bearing should be rebuilt. It ends with a journal ground undersize to remove scoring and refitted with a standard shell.

## What clearance changes

Chapter 3 showed that friction falls as clearance rises, in proportion to 1 ÷ c for a centred journal. Chapter 4 showed that the Sommerfeld number contains the clearance squared, so a looser bearing has a lower S and runs further off centre. These two effects pull the film in opposite directions: less friction means a cooler, more viscous film, which thickens it; a larger clearance at a higher eccentricity ratio thins it relative to the clearance. Which wins depends on how the bearing sheds its heat, so the comparison has to include the heat balance that Chapter 6 develops. For FB-75's oil-ring bearing, whose housing sheds 6.0 W per kelvin to air at 30 °C, the results are as follows.

```figure
type: compare
title: FB-75's drive-end bearing at different running clearances, 30 °C air
cols: Oil temperature | Eccentricity ratio | Thinnest film | Friction loss | Side flow needed | Peak pressure
rowhead: Radial clearance
- 0.035 mm | 73.6 °C | 0.350 | 22.7 µm | 262 W | 0.27 L/min | 2.94 MPa
- 0.050 mm | 68.5 °C | 0.466 | 26.7 µm | 231 W | 0.52 L/min | 3.34 MPa
- * 0.060 mm, design | 66.1 °C | 0.523 | 28.6 µm | 217 W | 0.70 L/min | 3.59 MPa
- 0.100 mm | 60.5 °C | 0.666 | 33.4 µm | 183 W | 1.49 L/min | 4.44 MPa
- 0.150 mm | 56.7 °C | 0.754 | 36.9 µm | 160 W | 2.52 L/min | 5.28 MPa
- 0.200 mm | 54.4 °C | 0.804 | 39.2 µm | 146 W | 3.59 L/min | 5.97 MPa
caption: This is an illustration. Short-bearing solution with the friction ratio of Chapter 3 and the housing heat balance of Chapter 6, solved together. Side flow is the oil leaving the ends of the loaded film, from NACA Report 1157.
```

For this bearing, opening the clearance always lowers the temperature and, through the more viscous oil, thickens the film a little. That is not the whole story, and the other columns explain why the design clearance is 0.06 mm rather than 0.2 mm.

## The costs of a large clearance

The side flow, the oil that escapes from the ends of the loaded part of the film, rises steeply with clearance: from 0.70 L/min at 0.06 mm to 3.59 L/min at 0.2 mm. All of it must be replaced by the oil supply, or the film starves from its inlet side. An oil ring lifts a limited flow from the sump, which Chapter 7 estimates at about 1.2 L/min for FB-75. Above a running clearance of roughly 0.085 mm the bearing would need more oil than its ring can deliver, and the flooded-film calculation behind the table would no longer describe it.

The eccentricity ratio rises towards the region where the short-bearing estimates become uncertain and where small departures from ideal geometry matter most. The peak film pressure rises from 3.59 MPa to nearly 6 MPa, loading the white metal harder. And a larger clearance makes the film less stiff, so a loose bearing lets the shaft move further under unbalance and shock, which affects seals, couplings and the impeller's running clearance in its casing.

The costs of a small clearance are just as clear: a hotter bearing, a thinner film despite the sharper wedge, a smaller allowance for the shrinkage described below, and greater sensitivity to misalignment, dirt and out-of-roundness. The design clearance sits between the two, where the bearing runs at a temperature its oil and lining tolerate comfortably, with side flow its ring can supply and a film several times the plant's 10 µm minimum.

```figure
type: balance
title: Choosing a running clearance
left: Tighter clearance
right: Looser clearance
caption: The design clearance balances the two sides; for FB-75 it is 0.06 mm radial, a clearance ratio of 0.0015.
- Higher temperature and friction | Lower temperature and friction
- Journal nearer centre | Journal nearer the bore
- Less side flow to supply | More side flow, may outrun an oil ring
- Lower peak film pressure | Higher peak pressure on the lining
- Less room for thermal shrinkage and dirt | Less film stiffness; shaft moves more under unbalance
```

A common starting point for a clearance ratio in industrial journal bearings is around one to two thousandths of the journal radius, refined by calculation and by the bearing maker's experience with the type of machine. FB-75's 0.0015 is in the middle of that range.

## From tolerances to a clearance band

A clearance is not a single number on a real bearing. The bore and the journal are each made within a tolerance, and the clearance is the difference between two toleranced sizes. Fits That Work covers this kind of calculation in detail; for a bearing it is simple enough to do by hand.

This is an illustration. FB-75's drawings specify the white metal bore at 80.110 to 80.140 mm and the journal at 79.980 to 80.000 mm, both at 20 °C.

```figure
type: steps
title: FB-75's clearance band from its drawing tolerances
caption: This is an illustration. Cold means at 20 °C, as measured; running means with the journal 50 K and the shell 35 K above 20 °C, as explained below.
- Smallest diametral clearance, cold | 80.110 − 80.000 = 0.110 mm
- Largest diametral clearance, cold | 80.140 − 79.980 = 0.160 mm
- Radial clearance band, cold | 0.055 to 0.080 mm
- Shrinkage in running | 0.0069 mm radial
- * Radial clearance band, running | 0.048 to 0.073 mm, mean 0.061 mm
```

The worst cases at each end of the running band can be checked like the table above. At the tight end, 0.048 mm, the bearing settles at 69.0 °C with a film of 26.3 µm; at the loose end, 0.073 mm, at 63.8 °C with a film of 30.5 µm and a side flow of 0.95 L/min. Both are acceptable, and the loose end stays within the oil ring's supply. The tolerances are therefore consistent with the design, which is the purpose of the check.

## Clearance in running is not clearance at rest

Clearances are measured cold, with the machine stopped. In running, the journal is heated by the film and by conduction from the hot side of the machine, while the shell and housing are cooled by the air. The journal grows more than the bore, and the clearance shrinks.

This is an illustration. With the steel journal at 70 °C and the steel-backed shell and housing bore at 55 °C, both assembled at 20 °C, and a linear expansion coefficient of 11.5 × 10⁻⁶ per kelvin for both, the journal's diameter grows by 80 × 11.5 × 10⁻⁶ × 50 = 0.046 mm and the bore's by 80 × 11.5 × 10⁻⁶ × 35 = 0.032 mm. The diametral clearance shrinks by 0.014 mm and the radial clearance by 0.0069 mm, about an eighth of FB-75's design clearance. Thermal Expansion by the Numbers explains why [designing machines for movement](/reados/publications/thermal-expansion-by-the-numbers/designing-machines-for-movement/) means calculating with the temperatures parts actually reach, which differ from one part to the next.

The shrinkage matters most in small, tight, fast bearings, where it can be a large share of the clearance, and during start-up from cold, when a journal heated quickly by its film can grow faster than a massive housing. Bearings that have seized only on fast cold starts usually had too little clearance for this transient.

## Wear and rebuild limits

A white metal bearing wears slowly, mainly during starts and stops when it runs in mixed lubrication, and from particles that pass through the film. Its clearance grows over years. The table at the start of the chapter shows how FB-75's bearing responds: cooler and with more side flow and peak pressure as the clearance opens.

The plant set two limits on the measured cold radial clearance, informed by the side flow and the eccentricity in that table. At 0.090 mm cold, which is about 0.083 mm running, a bearing is flagged for rebuild at the next planned shutdown, because its side flow approaches the ring's supply. At 0.100 mm cold, where the side flow would exceed it, the bearing is rebuilt before further running. These limits are the plant's own, chosen for this bearing; they are an illustration of the reasoning and not values for any other machine. Measuring clearance at each major inspection, with a lead wire or plastic gauge across the bore or with a dial indicator lifting the journal, and recording it beside the bearing's temperature and vibration, shows the wear trend long before either limit.

## Measuring clearance

Every one of these judgements depends on a measured clearance, and the measurement is easy to get wrong. Three methods are common, and each has a trap.

The most direct is to measure the bore and the journal with micrometers and bore gauges and subtract. It gives the clearance as the drawing defines it, but only if both parts are at the same temperature, preferably near 20 °C, and only if the bore is measured with the shell clamped in its housing at its working bolt torque. Split shells are made slightly larger than their housing so that bolting them up crushes them into firm contact, and that crush also closes the bore slightly. A shell measured loose on a bench can read several hundredths of a millimetre larger than it will be in service.

The second is to lay a soft lead wire or a plastic gauging strip across the journal, close the cap to its working torque, open it again and measure how flat the wire or strip was squeezed. It measures the clearance in the assembled bearing, which is its strength, but at only one place, usually the top, and a wire that is too thick or too hard springs the cap and reads high. The third is to lift the journal with a jack or a bar while a dial indicator on the shaft records the movement from the bottom of the bore to the top. It measures the clearance in place without opening the bearing, but the indicator must be close to the bearing, and any lift of the housing itself must be measured and subtracted.

The plant's procedure uses the second method on rebuild and the third at inspections, records the method with the result, and compares like with like. A clearance trend built from mixed methods can show wear that is really a change of method.

## The error: an undersize journal in a standard shell

This is an illustration. During a rebuild, FB-75's drive-end journal was found scored. The workshop ground it 0.15 mm undersize on diameter to clean it up, from 79.990 to 79.840 mm, and the fitter began to refit a new standard shell, whose bore measured 80.125 mm. The new shell had been ordered against the drawing before the journal's condition was known.

The fitter's routine lead wire check across the bore gave a diametral clearance of 0.285 mm, against the drawing's maximum of 0.160 mm. The fitter stopped and called the reliability engineer, who calculated what the bearing would have done. The cold radial clearance was 0.1425 mm, and running about 0.136 mm. With that clearance, the bearing would settle at about 57.6 °C, cooler than before, with a thinnest film of 36.1 µm: on its own, an apparently comfortable result. But its Sommerfeld number would be 0.045, below the plant's design limit of 0.05; its eccentricity ratio 0.734; its peak film pressure 5.05 MPa, 41% above the design value; and its side flow 2.22 L/min, nearly twice what the oil ring can supply.

```figure
type: compare
title: FB-75's drive-end bearing with a standard and an undersize journal
cols: Running radial clearance | Sommerfeld number | Side flow needed | Peak pressure | Oil ring supply about
rowhead: Journal
- * Standard, mid tolerance | 0.061 mm | 0.165 | 0.71 L/min | 3.60 MPa | 1.2 L/min
- Ground 0.15 mm undersize, standard shell | 0.136 mm | 0.045 | 2.22 L/min | 5.05 MPa | 1.2 L/min
caption: This is an illustration. The flooded short-bearing calculation looks comfortable on film thickness alone; the side flow shows the film would have starved, and the Sommerfeld number falls below the plant's design limit.
```

The flooded calculation's film thickness would have been fiction, because the ring could not keep the film flooded. A starved film runs thinner and hotter than the calculation, and a Sommerfeld number below the plant's limit of 0.05 meant a more eccentric journal, a higher peak pressure on the lining and a less stiff film than the design intended. The shell was returned and a new one bored 0.15 mm undersize to suit the reground journal, restoring the design clearance. The plant's rebuild procedure now requires the shell's bore to be machined to suit the journal's measured diameter whenever a journal is reground, and the clearance to be measured and recorded before any housing cap is closed.

## Bringing it together

Clearance trades temperature and friction against eccentricity, side flow, peak pressure and stability. For FB-75's oil-ring bearing, opening the clearance lowers the temperature and slightly thickens the film, but raises the side flow beyond what the ring can supply above about 0.09 mm, raises the peak pressure and reduces stiffness. The drawing's tolerances give a running clearance band of 0.048 to 0.073 mm, both ends of which the calculation accepts, after allowing 0.0069 mm for the journal running hotter than its shell. Rebuild limits follow from the same table. The next chapter develops the heat balance that sets every temperature in it.

## Exercise: a tighter tolerance

To reduce the spread of running temperatures, an engineer proposes tightening the bore tolerance to 80.115 to 80.130 mm, keeping the journal at 79.980 to 80.000 mm. Find the new cold and running radial clearance bands, and estimate the temperature range they give using the table at the start of the chapter.

**Worked answer.** This is an illustration. The diametral clearance runs from 80.115 − 80.000 = 0.115 mm to 80.130 − 79.980 = 0.150 mm, so the cold radial band is **0.0575 to 0.075 mm**. Subtracting the running shrinkage of 0.0069 mm gives **0.0506 to 0.0681 mm** running. From the table, these lie between the rows for 0.050 and 0.100 mm, closer to the design row; the heat balance gives about 68.3 °C at the tight end and about 64.6 °C at the loose end, a spread of about 3.7 K instead of the 5.2 K of the original tolerance. The tighter bore costs more to machine; whether it is worth it depends on how close the hottest bearing runs to its alarm limit, which Chapter 6 discusses.
