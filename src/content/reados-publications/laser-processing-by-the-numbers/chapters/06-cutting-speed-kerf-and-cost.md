---
book: laser-processing-by-the-numbers
chapterSlug: cutting-speed-kerf-and-cost
order: 6
title: "Cutting speed, kerf and cost per part"
description: "An energy balance for laser cutting speed, why speeds scale with power and thickness only near a chart value, kerf compensation, piercing and loading time, nesting and cost per part."
draft: false
---

An estimator quoting laser-cut parts needs a cutting speed for every material and thickness, a time for every part and a material cost for every blank. The laser maker's cutting chart gives the speeds the machine can achieve, but only for the thicknesses tested, and estimators are constantly asked about the ones in between. An energy balance explains why speed falls with thickness, why the simple rule for scaling between chart values works near the chart and fails far from it, and how much of a part's cost is cutting at all.

This chapter sets out the energy balance for a laser cut, uses the KEVOS® laser cutting plan and sheet nesting yield tools to cost the cell's stainless steel doors, and follows a quote for 6 mm stainless steel that went wrong because a speed was scaled too far.

## An energy balance for the cut

In steady cutting, the laser must supply the energy to heat a slot of metal, the kerf, from room temperature to its melting point and then melt it, at the rate the slot advances. The kerf volume removed per second is the speed times the thickness times the kerf width. The energy per unit volume is the density times the heat to reach and pass the melting point.

```figure
type: formula
title: Energy balance for laser fusion cutting
formula: P_melt = v t w E_v,   E_v = ρ (c ΔT_m + L)
formula: η = P_melt ÷ P   (process efficiency)
formula: v = η P ÷ (t w E_v)
caption: The share η of the laser power at the work that ends up heating and melting the kerf volume is the process efficiency. It covers reflection, conduction into the sheet, superheating of the melt and radiation. Oxygen cutting adds heat from burning iron, treated in Chapter 7.
- v | cutting speed, mm/s
- t, w | thickness and kerf width, mm
- E_v | energy to heat and melt unit volume, J/mm³
- ρ, c | density and specific heat
- ΔT_m, L | rise to the melting point and latent heat of melting
```

For stainless steel 304, with a density of 7,900 kg/m³, a mean specific heat of 500 J/(kg·K), a rise of 1,430 K to the melting point and a latent heat of 270 kJ/kg, E_v = 7,900 × 10⁻⁹ × (500 × 1,430 + 270,000) = 7.78 J/mm³. For mild steel, with a density of 7,850 kg/m³, specific heat 460 J/(kg·K), a rise of 1,480 K and the same latent heat, E_v = 7.46 J/mm³. These are averaged property values, adequate for an estimate.

Applying the balance to the cell's chart speeds gives the process efficiency each cut achieves.

```figure
type: compare
title: Energy balance for the LC-4's chart speeds at 4 kW
cols: Chart speed | Kerf width | Kerf volume per second | Power to heat and melt it | Process efficiency
rowhead: Cut
- Stainless 1.5 mm, N₂ | 24 m/min | 0.20 mm | 120 mm³/s | 934 W | 23.3%
- Stainless 3 mm, N₂ | 10 m/min | 0.25 mm | 125 mm³/s | 973 W | 24.3%
- Stainless 6 mm, N₂ | 3.0 m/min | 0.30 mm | 90 mm³/s | 700 W | 17.5%
- Mild steel 6 mm, O₂ | 2.6 m/min | 0.45 mm | 117 mm³/s | 873 W from the laser alone | 21.8%
caption: This is an illustration. Chart speeds are the cell's assumed values, not a laser maker's data. Kerf widths measured on test cuts. The oxygen cut also gets 1.8 to 2.7 kW from burning iron (Chapter 7).
```

The efficiencies are low and fairly steady for the thin and medium stainless cuts, about 23 to 24%, and fall to 17.5% for the 6 mm cut. Chapter 1's energy chain gave 2.80 kW absorbed in the kerf for the 1.5 mm door; if all of it went into melting, the door could be cut at 0.7 × 4,000 ÷ (1.5 × 0.2 × 7.78) = 1,200 mm/s, or 72 m/min. The chart's 24 m/min is a third of that, because two-thirds of the absorbed power is lost to conduction and superheat. That share grows as the cut slows, because slower cuts give heat longer to conduct away.

## Scaling speed between chart values

The energy balance says that, at constant process efficiency and kerf width, speed is proportional to power and inversely proportional to thickness. That is the rule the [laser cutting plan tool](/tools/laser-cutting-plan/) uses: it scales a reference speed from the cutting chart by the ratio of powers and the inverse ratio of thicknesses. The tool's own check reminds the user to confirm the speed on the maker's chart for the thickness, because the rule is an estimate within the chart's range.

Within a small range, the rule works. From the 1.5 mm chart value of 24 m/min, it gives 12 m/min for 3 mm stainless, against a chart value of 10 m/min. The difference is mostly the kerf: the 3 mm cut runs a wider kerf, 0.25 mm against 0.20 mm, so it removes more metal per millimetre of advance. Correcting for kerf gives 24 × (1.5 ÷ 3) × (0.20 ÷ 0.25) = 9.6 m/min, within 4% of the chart.

### The mistake: a 6 mm quote

An estimator quoting a one-off run of 6 mm stainless steel base plates found no 6 mm entry in an old copy of the cutting chart and used the laser cutting plan tool with the 1.5 mm reference. The tool returned 6 m/min. The quote was accepted. On the machine, the first plate lost the cut within a few centimetres: the melt stopped clearing from the bottom of the kerf, sparks blew back up out of the top, and the plate had to be cut again at the speed the current chart gave, 3.0 m/min. The job took twice the machine time quoted.

```figure
type: compare
title: Three estimates of the 6 mm stainless cutting speed against the chart
cols: Estimate, m/min | Ratio to chart
rowhead: Method
- Proportional rule from 1.5 mm, as quoted | 6.0 | 2.0
- Proportional rule with kerf correction, 0.20 to 0.30 mm | 4.0 | 1.33
- * Cutting chart at 6 mm | 3.0 | 1.00
- Proportional rule from a 5 mm chart value of 3.7 m/min | 3.1 | 1.03
caption: This is an illustration. Scaling from a nearby chart value gives a usable estimate; scaling across a fourfold change in thickness does not.
```

The kerf correction explains part of the error. The rest is the fall in process efficiency from 23% to 17.5%: in thick sections the gas jet must push the melt through a long, narrow slot, the melt film on the front thickens, and more heat conducts away during the longer interaction time. None of that is in a proportional rule. Scaled from a nearby reference, such as a 5 mm chart value, the same rule is close.

The cell's estimating rule now states that a speed may be scaled from a chart value only if the reference thickness is within 25% of the job's thickness, and that the reference must come from the current chart for the same gas and lens. Anything else is either taken from the chart or proved on an offcut before quoting.

## The speed window and cut quality

Every cut has a window of speeds. Too fast, and the melt cannot be produced and cleared through the whole thickness: dross clings to the bottom edge, the drag lines lean back steeply and, at the limit, the beam loses the cut. Too slow, and the cut takes more heat than it needs: the kerf widens, the edge roughens, small features and sharp corners burn, and on steel the hardened band of Chapter 5 grows. The chart speed sits towards the fast end of the window, where the edge is clean and the heat input lowest.

Cut quality has a standard language. ISO 9013 classifies thermal cuts and sets tolerances for perpendicularity or angularity and for the mean height of the profile, a measure of the striations on the cut face. A drawing that calls up a quality range from that standard tells the cutter how much edge angle and roughness is acceptable, and the cutter chooses gas, focus and speed to meet it. The cell's cabinet doors call up a range for which its chart speeds are proved; a customer asking for a finer edge class would get a slower, dearer cut.

## Small features, corners and common lines

The chart speed is reached only on long straight cuts. A machine cannot change direction instantly, so it slows into corners and around small radii, and to keep the energy per millimetre roughly constant the control lowers the power or pulses the beam as it slows. Even so, the metal at a sharp corner is heated from two sides and can burn. Small holes are the extreme case: on mild steel cut with oxygen, the cell's rule is that a hole smaller than the sheet thickness will not have a clean, round edge, and holes below that size are drilled or punched.

The time a part takes therefore depends on its shape as well as its length. The laser cutting plan tool divides the cut length by the chart speed, which is right for long straight cuts and optimistic for parts with many small features. For the doors, a timing run on the machine gave 9.2 s of cutting against the tool's 8.5 s, 8% more, which the estimator now adds to parts with many small slots.

Where parts with straight edges sit side by side, they can share a cut. Common-line cutting cuts one line that forms the edge of two parts, saving the cut length and pierce of one edge and the web of scrap between them. It suits rectangular blanks like the doors; it needs care, because the second part's edge is cut by the same pass, so any kerf or squareness error appears on both.

## Kerf width and compensation

The kerf is the slot the beam leaves, and the part's edge is half a kerf width from the beam's centreline. The machine's control offsets the beam path outwards for external contours and inwards for holes by half the kerf, the kerf compensation, so that the parts come out at drawing size. For the 1.5 mm doors, the kerf is 0.20 mm and the compensation 0.10 mm.

The kerf is not exactly the focused spot diameter. It is usually a little wider than the spot at the top for nitrogen cuts with a low focus, wider at the bottom for oxygen cuts, and it grows with power, thickness and gas pressure. The cell measures kerf width on a test cut at the start of each new material, thickness or gas, by cutting a 20 mm square and measuring the square and the hole it leaves. Half the difference between the hole and the square is the kerf. A wrong compensation of 0.05 mm is invisible to the eye but moves every edge of every part by that amount, and on the doors, which carry ± 0.1 mm on their hinge holes, it uses half the tolerance.

## Time per part: cutting, piercing and handling

Cutting time is the total cut length divided by the speed. Piercing adds a fixed time for every start, and on thin sheet it is a large share of the total.

```figure
type: steps
title: The cabinet door in the laser cutting plan tool
caption: This is an illustration. Same inputs as Chapter 4: 1.5 mm stainless steel, 24 m/min chart speed at 4 kW, cut length 3,400 mm, 12 pierces of 0.3 s, machine rate A$180 an hour excluding GST.
- Estimated cutting speed | 24 m/min
- Cutting time | 3,400 mm ÷ 400 mm/s = 8.5 s
- Piercing time | 12 × 0.3 s = 3.6 s, 30% of the part's beam time
- * Time per part | 12.1 s
- Cost per part | 12.1 ÷ 3,600 × A$180 = A$0.61
```

Piercing is 30% of each door's beam time. The door's twelve pierces are four for its external contour and cut-outs that start inside the part, and eight for small ventilation slots. Re-programming the slots as one chain cut, in which the beam moves from slot to slot with the gas on and the beam pulsed off, cuts the pierces to eight and the time to 10.9 s, A$0.54 a door.

The tool's figures are beam time only. Loading a 2,400 × 1,200 sheet and unloading the parts takes the LC-4's operator about two minutes; with six doors on a sheet, that is 20 s a door, more than the cutting. This is why laser cutting machines are increasingly sold with automatic loading and sorting, and why an estimate that counts only beam time understates the time on the machine.

## Material: the larger cost

The door's flat blank is 760 × 560 mm. The cell buys 1.5 mm 304 sheet in two sizes, 2,400 × 1,200 mm at A$310 a sheet and 3,000 × 1,500 mm at A$480, both excluding GST. The [sheet nesting yield tool](/tools/sheet-nesting-yield/) finds the best rectangular layout of identical blanks in each, allowing 10 mm between blanks and a 10 mm edge margin.

```figure
type: compare
title: Nesting 120 door blanks of 760 × 560 mm in the sheet nesting yield tool
cols: Blanks per sheet | Layout | Utilisation | Sheets for 120 | Material per blank
rowhead: Sheet
- * 2,400 × 1,200 mm, A$310 | 6 | Straight grid, lengthways | 88.7% | 20 | A$51.67
- 3,000 × 1,500 mm, A$480 | 8 | Two-block layout | 75.7% | 15 | A$60.00
caption: This is an illustration. Gap between blanks 10 mm, edge margin 10 mm, prices excluding GST. The smaller sheet fits the blank better and costs less per door although it costs more per square metre.
```

The smaller sheet wins: 88.7% utilisation against 75.7%, and A$51.67 of steel per door against A$60.00. Its price per square metre, A$310 ÷ 2.88 m² = A$108, is higher than the large sheet's A$480 ÷ 4.5 m² = A$107, but the blank fits it far better. The comparison also puts the cutting cost in proportion: the door's steel costs about 85 times its beam time. A small improvement in nesting is worth more than a large improvement in cutting speed.

The tool's layouts are rectangular grids of one part; real nesting software fits different parts together and uses the offcuts for small parts. The tool's figure is a quick, conservative estimate that can be made at the quoting stage, and its utilisation check warns when a blank fits a sheet badly.

## What an estimate should contain

The cell's laser estimate sheet now carries every item in this chapter, so that nothing is left to memory.

```figure
type: checklist
title: The cell's laser cutting estimate
caption: This is an illustration. The order matters: material first, because it is the largest cost.
- x Material: sheet size, price excluding GST, blanks per sheet from a nesting check, cost per part
- x Cutting speed from the current chart for the material, thickness, gas and lens, or scaled only from a reference within 25% of the thickness
- x Cut length and pierces from the part program, with chain cuts where possible
- x Beam time per part from the laser cutting plan tool
- x Loading and unloading time per sheet, shared over the parts on it
- x Gas use from Chapter 7 when it is not in the machine rate
- x Secondary operations: deburring, drilling of tapped holes in hardenable steel (Chapter 5)
```

## Exercise: the aluminium panels

The 3 mm aluminium panels have a cut length of 2,800 mm and eight pierces of 0.4 s each. The chart gives 12 m/min at 4 kW for 3 mm aluminium with nitrogen. Use the laser cutting plan tool to find the beam time and cost per panel at A$180 an hour. During a fault the source is limited to 3 kW. What do the tool's proportional rule and the cell's scaling rule say about the speed and cost at 3 kW?

### Answer

At 4 kW the speed is the chart's 12 m/min, 200 mm/s. Cutting takes 2,800 ÷ 200 = 14.0 s and piercing 8 × 0.4 = 3.2 s, a total of 17.2 s. At A$180 an hour, the cost is 17.2 ÷ 3,600 × 180 = A$0.86 a panel.

At 3 kW, the proportional rule gives 12 × 3,000 ÷ 4,000 = 9 m/min, so cutting takes 2,800 ÷ 150 = 18.7 s and the part 21.9 s, A$1.09. The cell's rule allows the scaling only from a reference close to the job, and here the thickness is unchanged and the power differs by a quarter, so the estimate is reasonable for planning. It should still be proved on an offcut before production, because piercing aluminium at reduced power may take longer than 0.4 s, and the pierce time is not scaled by the tool.
