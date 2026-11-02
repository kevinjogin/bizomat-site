---
book: reverse-osmosis-by-the-numbers
chapterSlug: flux-permeability-and-net-driving-pressure
order: 3
title: "Flux, permeability and the net driving pressure"
description: "The solution-diffusion equations for water and salt, membrane permeability from an element data sheet, element count from a design flux, permeate flow and the feed pressure needed."
draft: false
---

Chapters 1 and 2 found the pressure a membrane must overcome. This chapter finds what the pressure above that buys. Water crosses a reverse osmosis membrane at a rate proportional to the net driving pressure, the applied pressure difference minus the osmotic pressure difference, and the constant of proportionality is the membrane's water permeability. Salt crosses at a rate proportional to the concentration difference and almost independent of pressure. Those two statements, with an area and a temperature, are enough to size a plant and to explain most of what an operator sees.

The chapter sets out both equations, shows how to get the permeability constants from an element data sheet, chooses the number of elements for BW-12 from a design flux, and calculates its permeate flow and feed pressure with the KEVOS® reverse osmosis pressure tool. It ends with a design that treated the data sheet's flow as a rating and specified fewer than half the elements the plant needed.

## Two fluxes

Modern reverse osmosis membranes are dense polymer films with no pores in the ordinary sense. Water dissolves into the film on the feed side, diffuses across it and leaves on the permeate side; salt does the same, much more slowly. This is the solution-diffusion model, whose standard account is Wijmans and Baker's 1995 review. Its practical result is a pair of linear equations.

```figure
type: formula
title: Water and salt flux through a reverse osmosis membrane
formula: J_w = A × (ΔP − Δπ)
formula: J_s = B × (c_m − c_p)
caption: J_w is water flux in L/(m²·h); A is water permeability in L/(m²·h·bar); ΔP and Δπ are the applied and osmotic pressure differences across the membrane; J_s is salt flux; B is salt permeability; c_m and c_p are salt concentrations at the membrane surface on the feed side and in the permeate.
- Water flux | proportional to net driving pressure; zero when ΔP = Δπ
- Salt flux | proportional to concentration difference; nearly independent of pressure
- Permeate strength | c_p = J_s ÷ J_w, so more water flux dilutes the same salt flux
```

The first equation is the one that sets pressures and flows. The second explains permeate quality, and it holds a counter-intuitive result: raising the feed pressure does not push more salt through. It pushes more water through, and the same salt flux is diluted in more water, so the permeate gets purer. Conversely, a plant run at low flux makes saltier permeate, which matters in winter and at turndown.

The same physics has a more general form. Irreversible thermodynamics, developed by Onsager and applied to membranes by Kedem and Katchalsky in 1958, writes the volume flow and the solute flow as linear combinations of the pressure and concentration differences, with cross terms that couple them. For a membrane that rejects salt perfectly, the reflection coefficient σ is one and the volume flow is L_p(ΔP − Δπ), the water equation above. For a membrane that lets some salt through, σ is less than one and only part of the osmotic pressure difference counts against the flow. Brackish-water reverse osmosis membranes have σ very close to one for sodium chloride, so the simple form is used throughout this book; nanofiltration membranes, which pass more monovalent salt, need the general form.

## Permeability from the data sheet

Element makers publish a nominal permeate flow and salt rejection measured under standard test conditions. The test is a single element run at low recovery on a sodium chloride solution of known strength, at a stated pressure and temperature. Those are enough to recover A and B.

This is an illustration, with a fictional element of a kind makers publish. The data sheet gives 40 m³/d of permeate and 99.7% stabilised rejection with 37 m² of active area, tested at 15.5 bar gauge, 2,000 mg/L sodium chloride, 25 °C and 15% recovery.

```figure
type: steps
title: Water and salt permeability from the fictional element's data sheet
caption: This is an illustration. The test water's osmotic coefficient, 0.95, lies between Hamer and Wu's values at 0.02 and 0.05 mol/kg. Half of an assumed 0.2 bar element pressure drop is taken off the feed pressure.
- Flux | 40 m³/d ÷ 24 ÷ 37 m² = 45.05 L/(m²·h)
- Feed osmotic pressure | 0.95 × (2 × 2,000 ÷ 58.44) × 8.314 × 298.15 = 1.612 bar
- Average along the element | × ln(1 ÷ 0.85) ÷ 0.15 = × 1.0835, giving 1.746 bar
- Net driving pressure | 15.5 − 0.1 − 1.746 + 0.005 (permeate) = 13.66 bar
- * Water permeability | A = 45.05 ÷ 13.66 = 3.30 L/(m²·h·bar)
- Salt permeability | permeate 6 mg/L, average feed side 2,167 mg/L: B = 45.05 × 6 ÷ 2,161 = 0.125 L/(m²·h)
```

Two adjustments turn a test value into a design value. The first is temperature: the test is at 25 °C, and Chapter 4 corrects A for other temperatures. The second is fouling. Every membrane in service loses some permeability to deposits and compaction, and the makers' design equations include a fouling factor that multiplies A. BW-12's designer used 0.85, so the design permeability is 0.85 × 3.30 = **2.80 L/(m²·h·bar)**. The choice of fouling allowance depends on the feed water and the maker's guidance; a clean bore water justifies a smaller allowance than a surface water.

## How many elements

The number of elements follows from the design flux: the average permeate flow per square metre of membrane. Membrane makers publish recommended ranges of average flux by type of feed water, lower for surface waters and wastewater that foul easily, higher for clean well water. Running above the range makes the membranes foul faster; running well below it wastes membrane.

This is an illustration. BW-12's designer chose an average flux of 18 L/(m²·h), within the range the maker recommends for a well water of BW-12's quality. The area needed is 12,000 L/h ÷ 18 = 666.7 m², which is 18.0 elements of 37 m². The plant has 18, 666 m² in all, giving 18.02 L/(m²·h). Arranged in vessels of six, that is three vessels: two in parallel in the first stage and one in the second, a two-to-one array. Chapter 5 explains why it is staged that way.

## Permeate flow and feed pressure

With the permeability, the area and the osmotic pressures, the average net driving pressure along the train gives the permeate flow. The average applied pressure is the feed pressure less half the pressure drop along the train, and the average osmotic pressure is the log-mean value from Chapter 2.

The [reverse osmosis pressure check](/tools/ro-pressure-check/) does exactly this. From the dissolved solids, the salt's molar mass and the dissociation factor, it calculates the feed osmotic pressure by van 't Hoff's law, multiplies it by the log-mean concentration factor at the recovery entered to get the feed-side mean, and subtracts that, half the feed-to-concentrate pressure drop and the permeate pressure from the feed pressure to get the average net driving pressure. It multiplies that by the water permeability and the membrane area to give the permeate flow, and also reports the osmotic pressure and driving pressure at the concentrate end and the feed pressure needed for the permeate flow the user wants. Its model is the average driving pressure along the train, with a dilute-solution osmotic pressure and no polarisation; it ignores the permeate's own small osmotic pressure.

The tool has no separate osmotic coefficient, but it accepts a dissociation factor, which multiplies the particle count. For BW-12's mixed water, entering the mean molar mass per particle, 34.44 g/mol, with a factor of 0.93 gives exactly φ × Σcᵢ.

```figure
type: stats
title: BW-12 at 25 °C from the reverse osmosis pressure check
caption: This is an illustration. Inputs: 2,400 mg/L, 34.44 g/mol, factor 0.93, 25 °C, 75% recovery, 11.5 bar gauge feed, 3.0 bar pressure drop, 0.5 bar gauge permeate, A = 2.8 L/(m²·h·bar), 666 m², 12.0 m³/h wanted. The tool's concentrate figures ignore salt passage, so they differ slightly from Chapter 2's.
- 2.970 bar | Mean osmotic pressure on the feed side | 1.607 bar × 1.8484
- * 6.53 bar | Average net driving pressure | 11.5 − 1.5 − 2.970 − 0.5
- 12.18 m³/h | Permeate flow | 2.8 × 6.53 × 666 ÷ 1,000
- 11.40 bar g | Feed pressure for exactly 12.0 m³/h | the design point
- 1.57 bar | Net driving pressure at the concentrate end | concentrate π 6.43 bar
```

At 11.5 bar the plant makes 12.18 m³/h, a little more than it needs; 11.40 bar would give exactly 12.0 m³/h. The feed pressure divides into four parts: 6.4 bar drives water, 3.0 bar beats the average osmotic pressure, 1.5 bar is the average friction loss and 0.5 bar holds the permeate pressure. Only the first part makes water. Chapter 8 returns to that division when it asks how much of the pump's energy does useful work.

## Permeate quality from the salt flux

The salt equation gives the permeate strength. For the whole train, with the average feed-side concentration 2,400 × 1.848 = 4,436 mg/L and B = 0.125 L/(m²·h), the permeate strength is B × 4,436 ÷ 18.02 = 30.8 mg/L before allowing for polarisation, and about 33.2 mg/L with Chapter 5's average polarisation factor of 1.079. That is a system rejection of about 98.6% against the element's 99.7%, because the system's membranes see an average feed twice as salty as the feed itself.

The design figure of 36 mg/L used in Chapters 1 and 2 (98.5% rejection) leaves a margin for the rise in salt passage that comes with age. The hand estimate also treats the whole water as if it behaved like sodium chloride; divalent ions such as calcium, magnesium and sulfate are rejected better, so the real permeate of a mixed water is usually a little better than this estimate, and a maker's projection with the full analysis will show it.

```figure
type: bars
title: BW-12's estimated permeate strength against average flux, 25 °C
unit: mg/L
max: 70
caption: This is an illustration. Salt flux stays nearly constant while water flux changes, so halving the flux roughly doubles the permeate strength. Calculated with B = 0.125 L/(m²·h), a feed-side average of 4,436 mg/L and a polarisation factor of 1.079 held constant.
- 9 L/(m²·h), half output | 66.5
- 12 L/(m²·h) | 49.9
- * 18 L/(m²·h), design | 33.2
- 22 L/(m²·h) | 27.2
```

The figure explains a habit that surprises new operators: a reverse osmosis plant makes its best water at full output. Throttling it back to half flow, or letting the pressure fall in winter without raising it, roughly doubles the permeate's dissolved solids. If a plant must run at reduced output, it is better to run some of its trains at full flux than all of them at half.

## Units, gauges and where pressure is read

Membrane literature mixes units, and conversions cause many of the errors that reach site. Flux is quoted in litres per square metre per hour (L/(m²·h), often written LMH) or in US gallons per square foot per day (gfd); one gfd is 1.698 L/(m²·h), so BW-12's 18.0 L/(m²·h) is 10.6 gfd. Permeability then comes in L/(m²·h·bar) or gfd/psi, pressures in bar, kPa or psi, and element areas in m² or square feet (37 m² is 400 ft²). Convert everything to one set of units before calculating, and write the units against every number in a design note.

Gauge and absolute pressure must not be mixed either. Osmotic pressure is a pressure difference, and so is the net driving pressure, so a calculation in gauge pressure works as long as the permeate pressure is also gauge. Problems arise when a transmitter reads absolute pressure on one side and gauge on the other, or when a vacuum on the permeate side, from a permeate line falling to a tank below the plant, is ignored.

The position of the gauge matters most of all. The pressure that drives the membranes is the pressure at the inlet of the first pressure vessel. Between the high-pressure pump's discharge and that point there are a check valve, an isolating valve, often a flow meter and some pipework; between the bore pump and the high-pressure pump there is the cartridge filter of Chapter 7. A plant whose only pressure gauge sits on the pump discharge will overstate its membrane pressure by the losses in between, perhaps half a bar or more, and a calculation built on that reading will understate the permeability. BW-12 has transmitters at the first-stage inlet, the interstage header, the concentrate outlet and the permeate header, so the pressure drop of each stage and the driving pressure can be read directly.

## The error: a test flow read as a rating

This is an illustration. An early quotation for BW-12 proposed eight elements. Its author had divided the plant's 288 m³/d (12 m³/h over 24 hours) by the data sheet's 40 m³/d per element, got 7.2, and rounded up. The elements would have run at an average flux of 12,000 ÷ (8 × 37) = 40.5 L/(m²·h), more than twice the design flux and well above the maker's recommended range for any water.

The plant's engineer caught it by the first check in any membrane design: calculate the average flux. A flux of 40.5 L/(m²·h) is close to the data sheet's test flux, and the test is a single, clean element at 15% recovery on a weak salt solution, not a plant at 75% recovery on bore water. The pressure tool confirmed the consequence. Eight elements in two vessels would need an average net driving pressure of 40.5 ÷ 2.8 = 14.5 bar and, with about 2.0 bar of pressure drop, a feed pressure near 18.9 bar to make 12 m³/h, before any winter allowance. The membranes would also have fouled quickly at that flux, because the rate at which water carries foulants to the membrane surface is proportional to flux.

The nominal flow on a data sheet is a quality-control figure: it lets a buyer check that an element performs like others of its type. It is not a rating. The number of elements comes from the design flux, and the pressure from the flux and the permeability.

## Exercise: what 12 bar would make

The operator raises BW-12's feed pressure to 12.0 bar gauge at 25 °C, with recovery held at 75% and the same pressure drop and permeate pressure. Using A = 2.8 L/(m²·h·bar) and 666 m², find the average net driving pressure, the permeate flow and flux, and the estimated permeate strength with B = 0.125 L/(m²·h) and a polarisation factor of 1.079.

**Worked answer.** This is an illustration. The average net driving pressure is 12.0 − 1.5 − 2.970 − 0.5 = **7.03 bar**, so the permeate flow is 2.8 × 7.03 × 666 ÷ 1,000 = **13.11 m³/h** and the flux 13,110 ÷ 666 = **19.7 L/(m²·h)**. The permeate strength is 0.125 × 4,436 × 1.079 ÷ 19.7 = **30.4 mg/L**, slightly better than at 11.5 bar. Holding 75% recovery means the feed must rise to 13.11 ÷ 0.75 = 17.5 m³/h, which the bore pump and the concentrate disposal must accept. The pressure tool gives the same figures, and also shows the concentrate end improving to 2.07 bar of driving pressure.
