---
book: pipe-flow-by-the-numbers
chapterSlug: measuring-flow-and-sizing-the-line
order: 10
title: "Measuring flow and sizing the line"
description: "Flow meters from orifice plates to clamp-on ultrasonics, trustworthy gauges, sizing CW-2's header on whole-of-life cost in A$, and an orifice read with a venturi's coefficient."
draft: false
---

Every number in this book so far has been calculated. A system's real behaviour is measured, and the measurements are what tell an engineer whether the calculations were right, whether the system has changed, and what to do about it. And a system's pipes, once installed, stay for decades, so the choice of their size is one of the few decisions in pipe work whose consequences, good or bad, are paid for every hour the pump runs.

This chapter deals with both ends of a pipe system's life. It sets out how flow meters work, from the orifice plate that follows directly from Bernoulli's equation to the clamp-on ultrasonic meter, how to choose and read pressure gauges, and how to size a line on its whole cost, pipe and energy together. It ends with an orifice plate read with a venturi's coefficient.

## Meters that use Bernoulli

The oldest flow meters make the flow speed up through a restriction and measure the pressure it loses in doing so. By Bernoulli's equation, the rise in velocity head through the restriction equals the fall in pressure head, so the pressure difference measures the velocity, and with the area, the flow.

The ideal equation needs a correction, the **discharge coefficient**, Cd, which accounts for the losses and for the jet's contraction beyond the restriction. For a **venturi**, a smooth contraction and long, gentle expansion, Cd is close to 1, typically about 0.98. For a sharp-edged **orifice plate**, a thin plate with a round hole, the jet contracts well beyond the hole and Cd is about 0.6. The exact coefficient for a particular meter, its tappings and its installation comes from the relevant standard or the meter's calibration.

```figure
type: formula
title: Flow through an orifice plate or venturi
formula: Q = Cd × A₂ × √(2 × Δp ÷ (ρ × (1 − β⁴)))
caption: This is an illustration for an orifice plate in CW-2's supply header, with a discharge coefficient typical of sharp-edged orifices. Solved here for the pressure difference at the design flow.
- A₂ | Area of the hole, for a 48.5 mm hole in the 80.9 mm header
- β | Ratio of the hole to the bore, 0.6
- Cd | Discharge coefficient, about 0.61 for an orifice plate, 0.98 for a venturi
- Δp | Pressure difference between the tappings
step: At 9.0 L/s, Δp = (Q ÷ (Cd × A₂))² × ρ × (1 − β⁴) ÷ 2 = 27.6 kPa
```

The orifice plate is cheap and simple, but much of its pressure difference is lost for good: the jet's energy is dissipated in turbulence downstream, and the pump must supply it every hour the plate is in the line. A venturi recovers most of its pressure difference in its long outlet cone, and costs more and takes more length. On CW-2, where every metre of head reduces the flow to the machines, the plant chose not to fit an orifice plate permanently. At 27.6 kPa, nearly three metres of head, a permanent orifice would have cost the machines several per cent of their water, as Chapter 6's curves show.

## Other meters

Most plant flow meters now work on other principles.

- **Electromagnetic meters** measure the voltage induced in a conducting liquid as it flows through a magnetic field. Water is conductive enough, and the meter has a full bore with no restriction and no pressure loss. It needs the pipe to be full.
- **Ultrasonic meters** time sound pulses sent with and against the flow. **Clamp-on** versions work from outside the pipe, with no cutting, which makes them the standard tool for commissioning and fault-finding. They need the pipe's outside diameter and wall thickness entered correctly, a clean wall, and a length of straight pipe either side.
- **Turbine and vane meters** count the turns of a rotor in the flow. They are cheap and accurate in clean water, but they wear and they obstruct the flow.

Every meter that measures velocity assumes a developed velocity profile, as Chapter 3 described. Elbows, tees and valves upstream distort the profile, and meter makers specify a straight length upstream and downstream, typically some multiple of the bore. On a compact plant loop, finding that length is often the hardest part of fitting a meter.

## A heat balance as a flow meter

A heat exchanger is a flow meter of a kind, if its heat load and temperatures are known. The heat carried by water is its mass flow times its specific heat times its temperature rise, so the flow is the heat divided by the specific heat and the rise. On CW-2, the cooler that serves the tank has its own meter for the heat it removes; with the supply at 25.0 °C and the return at 32.0 °C, and the cooler reporting 262 kW, the loop's flow is 262 ÷ (4.18 × 7.0) = 8.95 kg/s, about 8.98 L/s at 25 °C.

The method's weakness is the temperature difference. Two thermometers each accurate to 0.2 K can make a 7 K difference wrong by up to 0.4 K, nearly 6%, which is worse than a clamp-on meter. Its strength is that it measures something entirely independent of the pipe's hydraulics, so it is an excellent cross-check on a hydraulic meter, and it is free wherever temperatures and heat loads are already measured.

## Gauges that can be trusted

A pressure gauge's accuracy is usually stated as a percentage of its full scale, so a gauge reads most accurately, relative to the reading, near the top of its range. The plant's practice, an illustration of common advice, is to choose a gauge whose normal reading falls in the middle third of its scale: for CW-2's pump discharge at about 106 kPa, a 0 to 250 kPa gauge, not a 0 to 1,000 kPa one.

Three habits make gauge readings useful:

1. **Record the height** of every gauge, so that readings can be compared as heads, as Chapter 2 showed.
2. **Fit test points**, self-sealing tappings into which a calibrated test gauge can be pushed, at the places that matter: either side of the pump, the strainer and each machine's coolers.
3. **Read differences with one gauge**, or a differential gauge, rather than subtracting the readings of two gauges whose errors may not cancel.

## Sizing the line on its whole cost

A larger pipe costs more to buy and install but less to pump through, because its friction is lower. A smaller pipe costs less now and more every year. The best size balances the two over the system's life.

This is an illustration. For CW-2's 128 m of header, the plant compared three bores, recalculating the index path's head with each, and pricing the pumping energy with a wire-to-water efficiency of 55%, 6,000 running hours a year, electricity at A$0.30 per kWh including GST, and a 15-year life. The installed header prices, including GST, are the plant's estimates.

```figure
type: compare
title: CW-2's header bore on its whole cost
rowhead: Header bore
cols: Index head, m | Pump input, kW | Energy, A$ a year | Header installed, A$ | Total over 15 years, A$
caption: This is an illustration at 9.0 L/s. Prices include GST. Energy is not discounted, and the pump's own cost and the effect of electricity price changes are left out for simplicity.
- 62.7 mm | 20.36 | 3.26 | 5,863 | 14,080 | 102,021
- 80.9 mm, as built | 10.84 | 1.73 | 3,121 | 17,920 | 64,735
- * 102.3 mm | 8.15 | 1.30 | 2,347 | 23,680 | 58,878
```

The smallest bore would save A$3,840 on the header and cost A$2,742 a year more in energy: its saving on pipe is used up by extra energy in about 17 months. The largest bore costs A$5,760 more than the built header and saves A$774 a year, repaying the difference in about seven and a half years, and comes out about A$5,900 cheaper over 15 years. The built size is a reasonable choice; one size larger would have been a better one, for this plant's running hours and electricity price.

The result is sensitive to its inputs. With half the running hours, the larger bore's advantage almost disappears; with a higher electricity price, it grows. A discounted calculation, which values future savings less than present costs, narrows it too. The method is the point: price the energy each size costs, over the years it will run, alongside what the pipe costs to put in.

```figure
type: bars
title: CW-2's 15-year cost by header bore
unit: A$
max: 110000
caption: This is an illustration, with the assumptions in the table above. Most of the whole-of-life cost of a pumped pipe is energy.
- 62.7 mm | 102021
- 80.9 mm, as built | 64735
- * 102.3 mm | 58878
```

## Limits other than cost

Whole-of-life cost is not the only limit on a pipe's size. Velocity sets others.

- **Noise and erosion.** Water moving fast through small pipes can be noisy, and it erodes softer pipe materials and fittings where it turns or accelerates. The pipe or fitting maker's velocity limits for its product govern here.
- **Water hammer.** The surge from a sudden stop is proportional to the velocity that is stopped, as READOS's Water Hammer by the Numbers explains; a faster line must close its valves more slowly or be protected.
- **Air and sediment.** At very low velocities, below a few tenths of a metre per second, air bubbles are not swept along and sediment settles. CW-2's far header, at 0.29 m/s, is already in that range.

A size chosen on cost must also pass these tests. The 102.3 mm header that the cost comparison favours runs at 1.10 m/s at the design flow, comfortably inside every limit, and its far end would run at 0.18 m/s, slow enough to need the twice-yearly flush that the far end of the existing header already gets.

## The commissioning record

The measurements made at commissioning are the baseline for every later check, and they are worth recording carefully. CW-2's commissioning record, an illustration, holds:

1. the flow at the pump and in each branch, with the meter used and its position;
2. every gauge's reading, its height above the tank's water and its identity;
3. the pump's head, worked out from its suction and discharge readings, and the point it gives on the system curve;
4. each balancing valve's position, Kv and measured flow;
5. supply and return temperatures, and the cooler's heat load;
6. the measured friction gradient on the header's test length.

With that record, every later question about CW-2 starts from a known point. Without it, every question starts from scratch.

## The method, summarised

Every chapter of this book has applied the same few ideas to one loop, and they serve any liquid system:

1. **Count the flow** in consistent units, and find each pipe's velocity from its true bore.
2. **Write the energy equation** between any two points, with heights, velocities, pump head and losses.
3. **Find the Reynolds number** first, and with it the regime and the friction law.
4. **Add the losses**: straight pipe by Darcy–Weisbach, fittings by K, equipment from its data at the right flow.
5. **Build the system curve**, and read every question about a change of flow off it.
6. **Solve the branches** together, and balance them from the far end.
7. **Look for the high points** where the pressure falls below atmospheric, and keep the gas out.
8. **Measure**, cross-check, record the baseline, and price each metre of head.

## The error: an orifice read with a venturi's coefficient

This is an illustration. During a trial before CW-2's balancing, a temporary orifice plate with a 48.5 mm hole was fitted in the header to measure the pump's flow, and an engineer converted its 27.6 kPa reading into a flow using a discharge coefficient of 0.98, copied from a venturi's data sheet that was in the same file. The result was **14.46 L/s**, which would have meant the pump was running far out on its curve, delivering 60% more than designed.

The reading did not make sense against the pump's curve, which offered only about 1.9 m of head at 14.5 L/s, nor against a clamp-on meter's reading of about 9 L/s. The engineer checked the meter's type and found the error: with the orifice's coefficient of about 0.61, the flow was 14.46 × 0.61 ÷ 0.98 = **9.0 L/s**. The flow was overstated by 61%, the ratio of the two coefficients.

The cross-check is what caught it, and it took less than ten minutes. Had the 14.46 L/s been believed, the balancing would have started from a false total, and every valve setting would have been wrong. A flow reading should always be compared with at least one other estimate: a second meter, the pump's curve at its measured head, or a heat balance on the coolers. Readings that agree are probably right; a reading that disagrees with everything else is probably the meter, or the way it was read.

## Exercise: the energy cost of a metre of head

Using the illustration's assumptions, 9.0 L/s, a wire-to-water efficiency of 55%, 6,000 hours a year and A$0.30 per kWh including GST, what does one metre of head in CW-2 cost a year? What would removing the 0.199 m that long-radius elbows save, from Chapter 5?

**Worked answer.**

- The power to lift 9.0 L/s by 1 m is ρ × g × Q × H = 997.05 × 9.807 × 0.009 × 1 = 88.0 W of hydraulic power, or 88.0 ÷ 0.55 = **160 W** at the meter.
- Over 6,000 hours, that is 960 kWh, which at A$0.30 costs **A$288 a year** for each metre of head.
- The long-radius elbows' 0.199 m would save about 0.199 × 288 = **A$57 a year** on one machine's path.

A metre of head is worth nearly A$300 a year on this loop, which gives every design choice a price: a strainer, a cooler, a valve or a pipe size can each be judged by the head it costs and what that head costs to supply, year after year.
