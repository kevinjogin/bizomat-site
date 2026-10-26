---
book: compressed-air-plant-by-the-numbers
chapterSlug: the-work-of-compression
order: 2
title: "The work of compression and specific power"
description: "Calculate the isothermal and isentropic work to compress CA-1's air, compare its 41 kW against them, price a cubic metre of air, and compare compressors on a fair basis."
draft: false
---

A compressor's electricity bill depends on how much work it takes to squeeze air from the room to the plant's pressure, and on how far the real machine falls short of the ideal. Thermodynamics gives the ideal. The compressor maker's test data gives the real figure. The ratio between them shows how good the machine is, and the real figure, divided by the air it delivers, gives the single most useful number in a compressor room: specific power.

This chapter calculates the ideal work for CA-1 in two ways, isothermal and isentropic, compares the compressor's 41 kW with both, follows the energy through the package, prices a cubic metre of compressed air and shows why air is an expensive way to deliver power. It ends with the comparison mistake that leads plants to buy a compressor that only looked more efficient.

## Why compression takes work

When a piston or a pair of screw rotors squeezes air into a smaller space, the molecules are pushed closer together and strike the walls more often and harder. That is the rise in pressure. The work done by the moving parts goes into the air as energy, and with nowhere else to go it shows up first as a rise in the air's temperature. If the heat is carried away as it forms, the air stays cool and is easier to compress further, because cool air pushes back less. If it stays in the air, every further squeeze is against hotter, stiffer air. That one observation explains why cooling during compression saves work, why multi-stage compressors with coolers between stages exist, and why nearly all of a compressor's electricity ends up as heat that must be removed somewhere.

## Two ideals

Compressing a gas takes work, and the amount depends on what happens to the heat that compression produces. The supplied DOE handbook describes the processes that frame the problem: isothermal, at constant temperature; isentropic, with no heat exchange and no friction; and polytropic, somewhere between.

- **Isothermal compression** removes heat as fast as it is made, so the air stays at intake temperature. It needs the least work of any compression from the same start to the same finish. It is an ideal that real compressors approach only with intensive cooling.
- **Isentropic compression** removes no heat at all and loses nothing to friction. The air gets hot, as Chapter 3 shows, and the work is greater, because hot air is harder to compress.

For a flow of free air V̇ at intake pressure p₁ compressed to p₂ with pressure ratio r = p₂ ÷ p₁, and air's ratio of specific heats k = 1.4:

**isothermal power = p₁ V̇ ln r**

**isentropic power = p₁ V̇ × k ÷ (k − 1) × (r^((k−1)/k) − 1)**

## CA-1's ideal power

This is an illustration. CA-1 delivers 6.0 m³/min, 0.1 m³/s, of free air at 101.325 kPa, compressed to 851.3 kPa absolute, a ratio of 8.40.

```figure
type: formula
title: Ideal power to compress CA-1's air
formula: P_iso = p₁ V̇ ln r
formula: P_s = p₁ V̇ × 3.5 × (r^0.2857 − 1)
- p₁ V̇ | 101,325 Pa × 0.1 m³/s = 10,132.5 W
- r | 851.3 ÷ 101.3 = 8.402
step: P_iso = 10,132.5 × ln 8.402 = 10,132.5 × 2.128 ≈ 21.57 kW
step: P_s = 10,132.5 × 3.5 × (1.8366 − 1) ≈ 29.68 kW
step: CA-1 draws about 41 kW: isothermal efficiency 21.57 ÷ 41 ≈ 52.6 per cent; isentropic 29.68 ÷ 41 ≈ 72.4 per cent
caption: Ideal gas, k = 1.4. This is an illustration; the 41 kW package input is a teaching value for a compressor of this size, not a maker's figure.
```

Neither ideal is reachable. An oil-injected screw compressor cools its air partly during compression by injecting oil, so it does somewhat better than pure isentropic compression would suggest, but it also loses energy to internal leakage, friction, the oil system, the motor and the cooling fan. The two efficiencies are useful mainly for comparison: between compressors, against a maker's claims, and against the same machine's performance as it wears.

## Polytropic compression

Real compression lies between the two ideals. Engineers describe it with a polytropic exponent n, writing the process as p Vⁿ constant, with n = 1 for isothermal and n = k = 1.4 for isentropic. A cooled reciprocating compressor might behave as if n were about 1.3; an oil-injected screw, whose oil absorbs much of the heat during compression, lower still. The polytropic exponent is a convenient way to describe a machine, but it is an outcome of the design, not something a buyer can specify. The [gas compression process tool](/tools/gas-compression-process/) calculates work and final temperature for any exponent.

## Kinds of compressor

Factory air compressors fall into two families. **Positive displacement** machines trap a volume of air and reduce it: reciprocating piston compressors, rotary screws, scrolls and vanes. **Dynamic** machines, mainly centrifugal compressors, accelerate air with an impeller and convert its speed into pressure. Positive displacement machines dominate small and medium plants like CA-1's; centrifugal machines suit large, steady demands, typically far above CA-1's 6 m³/min.

Within the screw family, **oil-injected** machines flood the compression space with oil, which seals, lubricates and cools, and then separate the oil from the air before it leaves. They are efficient, compact and common. **Oil-free** machines keep oil out of the compression space altogether, needing two stages and more elaborate cooling to reach similar pressures, and are chosen where oil in the air cannot be tolerated even after filtration, such as some food, pharmaceutical and electronics uses. The choice changes the package's specific power and its heat recovery, as Chapter 4 shows, but not the thermodynamic ideal it is measured against.

## The intake matters

The work of compression starts at the intake. A dirty intake filter adds pressure drop: if it lowers the pressure at the element's inlet by 2 kPa, to about 99.3 kPa, a screw compressor with a fixed swept volume draws about 2 per cent less air by mass, while the ideal power falls by less than 1 per cent, so the energy per kilogram delivered rises by about 1.3 per cent. Hot intake air works the same way, through density, as Chapter 1 showed. Clean filters and a cool intake, ducted from outside where the room is hot, are among the cheapest efficiency measures in any compressor room.

## Where the 41 kW goes

This is an illustration. A package's input power is split between the motor, the compressor element and the fan that blows air through its coolers.

```figure
type: stack
title: CA-1's 41 kW package input, by destination
unit: kW
caption: This is an illustration with a teaching motor efficiency of 94 per cent and a 1.5 kW cooling fan. The ideal isentropic work is 29.68 kW; everything else is loss inside the element and the package.
- * Ideal isentropic compression | 29.68
- Element losses: leakage, friction, oil shear | 7.45
- Motor losses | 2.37
- Cooling fan | 1.5
```

With 1.5 kW for the fan and a motor efficiency of 94 per cent, about 37.1 kW reaches the compressor element's shaft. Against the 29.68 kW ideal, the element's isentropic efficiency is about 80 per cent. Those internal losses, and almost all of the 41 kW, end up as heat, which is the subject of Chapter 4.

## How the work grows with pressure

Both ideal powers rise with the logarithm-like curve of the pressure ratio. The first few hundred kilopascals cost the most per kilopascal; later ones cost less each, but they still cost.

```figure
type: line
title: Ideal power per m³/min of free air against delivery pressure
x: Delivery pressure, kPa gauge
y: Ideal power, kW per m³/min
legend: Isentropic | Isothermal
ymin: 0
ymax: 6
mark: 750 | CA-1
caption: Ideal gas, intake at 101.325 kPa. CA-1's real specific power of about 6.83 kW per m³/min sits above both ideals at 750 kPa gauge.
- 100 | 1.281 | 1.159
- 200 | 2.159 | 1.840
- 300 | 2.848 | 2.324
- 400 | 3.423 | 2.700
- 500 | 3.920 | 3.007
- 600 | 4.362 | 3.267
- 700 | 4.761 | 3.492
- 800 | 5.126 | 3.691
- 900 | 5.462 | 3.868
```

Between 700 and 800 kPa gauge, the isentropic ideal rises from about 4.76 to 5.13 kW per m³/min, about 8 per cent per 100 kPa. That slope is the basis of the advice in Chapter 7 to run at the lowest pressure the plant can use.

## Specific power

Dividing a compressor's package input power by its free air delivery, at a stated pressure, gives its **specific power**: about 41 ÷ 6.0, or **6.83 kW per m³/min**, for CA-1 at 750 kPa gauge. Specific power is the compressed air equivalent of fuel per tonne of steam. Makers publish it for their machines at full load, measured to ISO 1217; independent data sheets in some markets present it in a standard format. A plant can measure it for its own compressor, as Chapter 10 does, and track it over time.

Specific power at full load is not the whole story. At part load, a compressor's specific power usually rises, sometimes sharply, depending on its control method. CA-1 averages 70 per cent load, and Chapter 8 shows that its average specific power is about 7.57 kW per m³/min, not 6.83.

## Track specific power over time

A compressor's specific power drifts as it ages. Worn rotor tips and bearings let more air leak back inside the element, so it delivers less air for the same power. Blocked oil coolers and fouled aftercoolers raise temperatures and the power needed. A slipping drive belt on belt-driven machines wastes energy before any air is compressed. None of these is obvious from outside: the compressor still runs and the plant still gets air, just at a higher cost.

Measuring specific power once a year, or continuously where a flow meter and power meter are installed, turns that drift into a number. A rise of a few per cent from the commissioning value is a prompt for maintenance; a rise of ten per cent or more suggests the element itself needs attention. CA-1's assessment in Chapter 10 uses this measurement as its starting point.

## Motors and drives

The motor is the first conversion in the chain, and on a machine that runs 6,000 hours a year its efficiency matters. Premium efficiency motors lose less as heat, a few per cent of input, which on CA-1's annual 190,650 kWh is worth checking when a motor is replaced. Australia's minimum energy performance standards set efficiency requirements for many three-phase motors, so a replacement should at least meet them; the motor's maker and supplier can confirm which class a motor meets.

Variable speed drives change the motor's speed to match demand. They add a small loss of their own at full load, but can save far more at part load, as Chapter 8 shows. Whether a compressor should have one depends on how its demand varies, which is why part-load behaviour, not full-load efficiency, often decides a compressor purchase.

## What a cubic metre of air costs

This is an illustration. At CA-1's average specific power of about 7.57 kW per m³/min, a cubic metre of free air takes about 0.126 kWh of electricity. At a teaching A$0.25 per kWh, excluding GST, that is about **3.2 cents per cubic metre**, about A$31.50 per thousand cubic metres. Over the year, CA-1 uses about 190,650 kWh, costing about **A$47,700** in electricity.

Three cents a cubic metre sounds small until it is set against the work the air does. A pneumatic tool or air motor that delivers 0.5 kW of shaft power while using 0.5 m³/min of free air needs about 0.5 × 6.83, roughly 3.4 kW, of compressor input at full-load specific power. Only about 15 per cent of the electricity reaches the tool's shaft. An electric tool doing the same job typically turns most of its input into shaft power. That ratio, not the price of air, is why compressed air should be used where its particular advantages matter, such as simple, robust, spark-free or compact actuation, and not as a general power source where an electric drive would do.

## A failure case: comparing at different pressures

This is an illustration. When CA-1's compressor came up for replacement, the site compared two quotations. Compressor A: 6.0 m³/min at 750 kPa gauge, 41 kW, 6.83 kW per m³/min. Compressor B: 6.6 m³/min at 700 kPa gauge, 43.5 kW, about 6.59 kW per m³/min. B looked about 3.5 per cent more efficient and delivered more air, and the site chose it.

The two figures were stated at different pressures. Running B at the plant's 750 kPa gauge would raise its power, roughly in proportion to the ideal work, by about 4 per cent, from the slope above, and lower its free air delivery slightly as internal leakage rises with pressure. Corrected to the same pressure, B's specific power is about 6.85 kW per m³/min, no better than A's, and its true capacity at 750 kPa gauge is less than the quoted 6.6 m³/min.

The error was detected when the new compressor's measured specific power, at the plant's pressure, matched A's quotation rather than B's. The correction was a rule for future purchases: compare compressors at the plant's own delivery pressure, on full-load and part-load specific power from data measured to ISO 1217, and ask each supplier for performance at that pressure rather than at their standard rating point.

## Exercise: CA-1 at 650 kPa gauge

If CA-1 could deliver its air at 650 kPa gauge instead of 750 kPa gauge, by how much would the ideal isentropic power fall, in percentage terms? Use the isentropic formula.

**Answer.** At 750 kPa gauge, r^0.2857 − 1 is 8.402^0.2857 − 1 ≈ 0.8366. At 650 kPa gauge, r = 751.3 ÷ 101.3 ≈ 7.415, and r^0.2857 − 1 ≈ 0.7726. The ideal power falls in proportion, by about 1 − 0.7726 ÷ 0.8366, roughly **7.7 per cent**.

A real compressor saves a broadly similar fraction, which on CA-1's annual A$47,700 of electricity would be worth about A$3,700 a year, before counting the reduction in leakage that lower pressure also brings, as Chapter 7 shows.
