---
book: production-leak-testing-by-the-numbers
chapterSlug: leak-rates-and-units
order: 1
title: "Leak rates, units and specifications"
description: "What a leak rate measures, the pressure–volume, volume and mass units it is stated in and how to convert them, how big real leaks are, and how to turn a product's function into a leak specification."
draft: false
---

A leak specification is a number with units, and both halves cause trouble. The number must come from what the product has to do: keep oil in, keep refrigerant in, keep water out, hold a vacuum. The units must say exactly what is being counted: a volume of gas per second at some pressure, a mass per year, or a pressure change per minute in a particular test. The same leak can be written as 1 × 10⁻³ mbar·L/s, 0.059 sccm, 0.1 mPa·m³/s or about 0.1 g of air a day, and a factor of sixty hides easily between two of those.

This chapter explains what a leak rate counts, sets out the common units and how to convert them, gives a feel for how big real leaks are, and shows how the oil cooler's specification was derived. It finishes with a test station bought on a sensitivity quoted in the wrong unit.

## What a leak rate counts

A leak is a path, usually much finer than a hair, through which gas passes from the higher-pressure side of a wall to the lower. What matters is how much gas passes per unit time. "How much gas" can be counted in three ways: as a mass, as a number of molecules, or, most commonly in leak testing, as a pressure multiplied by a volume.

The pressure–volume unit needs a word of explanation. A quantity of gas at a known temperature is fixed by the product of its pressure and its volume: one litre at 1,000 mbar contains the same number of molecules as two litres at 500 mbar. So pV, at a stated temperature, is a measure of the amount of gas, and pV per second is a measure of gas flow. Leak testing adopted it because pressure-change tests measure pressure and volume directly, and vacuum equipment, where helium leak detection began, is specified the same way.

```figure
type: formula
title: Leak rate as a pressure–volume flow, and its equivalents
formula: Q = d(pV)/dt        units: mbar·L/s, Pa·m³/s
formula: 1 mbar·L/s = 0.1 Pa·m³/s = 0.987 atm·cm³/s ≈ 59.2 sccm
formula: Mass flow: ṁ = Q ÷ (R_specific × T)
caption: sccm is standard cubic centimetres per minute, counted at 1,013.25 mbar and 0 °C in the conversion shown; some makers use 20 °C or 25 °C as standard, which changes the figure by up to 9%. Always state the standard conditions with a volume-based unit.
- Q | leak rate, as gas throughput
- R_specific | specific gas constant, 287 J/(kg·K) for air
- T | gas temperature, K
```

The [pressure and stress converter](/tools/pressure-converter/) handles the pressure part of every conversion, between pascals, millibar, bar, atmospheres, torr and pounds per square inch. A leak rate in Pa·m³/s converts to mbar·L/s by multiplying the pressure part by 0.01 to go from pascals to millibar and the volume part by 1,000 to go from cubic metres to litres: a factor of 10 in all.

## The oil cooler's specification

The customer's drawing for the OC-40 states that the oil side shall leak no more than 1 × 10⁻³ mbar·L/s of air at 10 bar gauge. Each part of that sentence matters.

**The gas is air.** Different gases leak at different rates through the same path, as Chapter 2 shows, so a figure measured with helium must be converted before it is compared.

**The pressure is 10 bar gauge**, the cooler's maximum working pressure. A leak path passes more gas at higher pressure, roughly in proportion to the difference in the squares of the pressures in the viscous flow typical of real leaks at these sizes, so a test at a lower pressure must be judged against a correspondingly lower limit.

**The figure is a throughput.** In the units of this chapter, 1 × 10⁻³ mbar·L/s is 1 × 10⁻⁴ Pa·m³/s, 0.059 sccm, or, as a mass of air at 20 °C, 1 × 10⁻⁴ ÷ (287 × 293.15) = 1.19 × 10⁻⁹ kg/s, about 0.10 g a day. Expanded to atmospheric pressure, it is about 85 cm³ of air a day.

### Why this figure

The customer chose the limit from experience with hydraulic components. Oil is thousands of times more viscous than air, and a path that passes 85 cm³ of air a day is so fine that oil entering it from the inside fills it and stops, or passes so slowly that it evaporates or collects as an invisible film. Paths a few hundred times larger pass oil fast enough to weep. Industrial practice for oil-tight components commonly sets air limits around 10⁻³ to 10⁻⁴ mbar·L/s, but that is a guide, not a rule: the specification belongs to the customer and the product, and it should be confirmed by testing parts with known leaks in service-like conditions.

The manufacturer confirmed it that way during the cooler's development. Coolers with laser-drilled and crimped capillary leaks of known air rates, from 1 × 10⁻⁴ to 1 × 10⁻¹ mbar·L/s, were filled with hydraulic oil at 10 bar and 80 °C and stood on blotting paper for four weeks. None at or below 1 × 10⁻³ mbar·L/s marked the paper; those at 1 × 10⁻² and above did, the largest within a day. The customer's figure therefore had a margin of about ten in leak rate between the limit and the first leak that wept, a useful cushion against the uncertainty of the test and the differences between a capillary and a real braze defect.

```figure
type: compare
title: How big leaks are, from a bubble stream to the oil cooler's limit
cols: Rough equivalent | Equivalent hole, choked air at 10 bar gauge | Typical method
rowhead: Leak rate, air
- 10 mbar·L/s | a stream of large bubbles; audible hiss | about 95 µm | soap solution, ear
- 0.045 mbar·L/s | the pressure decay screen's limit, at 6 bar gauge | about 8 µm | pressure decay
- 1 × 10⁻³ mbar·L/s | about two 1 mm bubbles a second under water | about 1 µm | helium, or very careful pressure methods
- 1 × 10⁻⁵ mbar·L/s | a 1 mm bubble every minute | far below a micrometre | helium only
- 1 × 10⁻⁸ mbar·L/s | sealed refrigeration and vacuum work | molecular paths | helium in vacuum
caption: This is an illustration. Equivalent holes are from choked orifice flow with a discharge coefficient of 0.65 at 20 °C; real leaks are long, irregular channels whose flow does not follow an orifice law, so these sizes are only a feel for scale. A 1 mm bubble holds 5.3 × 10⁻⁴ mbar·L of air.
```

The scale runs over more than ten orders of magnitude, and no single method covers it. That is why the OC-40 line uses two stations: a pressure decay test that catches the gross leaks quickly and protects the helium station from contamination, and a helium test that measures down to the specification.

## Scaling a limit to the test pressure

The specification is stated at 10 bar gauge, but the pressure decay screen fills the cooler with air at only 6 bar gauge, to keep the fill time short and the test safe. A leak that just meets the limit at 10 bar passes less gas at 6 bar, and the test's limit must be scaled before it can be compared.

How it scales depends on how the gas flows through the leak, which Chapter 2 explains. For the viscous flow that dominates in leaks of this size at these pressures, the throughput is proportional to the difference of the squares of the absolute pressures on the two sides. With 1.013 bar outside, the ratio between 6 and 10 bar gauge is (7.013² − 1.013²) ÷ (11.013² − 1.013²) = 48.16 ÷ 120.26 = 0.400. A leak at the limit of 1 × 10⁻³ mbar·L/s at 10 bar would pass 4.0 × 10⁻⁴ mbar·L/s at 6 bar. If the flow were molecular, as in the very finest leaks, the throughput would scale with the pressure difference alone, a ratio of 6 ÷ 10 = 0.6. Using the viscous ratio is the cautious choice, because it gives the lower, tighter limit at the test pressure.

That calculation already shows why the pressure decay screen cannot test the specification. At 6 bar, a leak at the limit passes 4.0 × 10⁻⁴ mbar·L/s; Chapter 3 shows that the screen's practical limit is about a hundred times larger.

## Where leaks come from in a brazed cooler

Knowing where leaks form helps decide how to test for them and what a failed part means. In a vacuum-brazed aluminium cooler they have four main sources. Braze joints can be incompletely filled, leaving a channel along the joint, most often at the corners of the bar-and-plate core where fit-up is hardest. Cast end tanks can contain shrinkage porosity, which connects into a leak path only occasionally but then tends to give a slow, steady leak. Cracks can form during cooling after brazing or in handling, giving leaks that may open and close with pressure. And the fittings and their threads, if they are part of the tested volume, can leak at a seal.

The first two produce leaks spread across the scale of this chapter's table; cracks can produce sudden large leaks or tiny ones that grow in service. A method that only catches gross leaks will pass most porosity; a method that measures the total cannot say where the leak is, which matters for deciding whether a part can be repaired. The OC-40 line's two stations, and the sniffer kept beside the helium chamber for locating leaks in rejected parts, answer each of those needs.

## Units that cause confusion

Several units in common use look alike and are not.

**mbar·L/s and atm·cm³/s** differ by only 1.3%, and they are often treated as equal. That is usually harmless.

**sccm and mbar·L/s** differ by a factor of about 59. Mixing them up is the commonest serious error in leak specifications.

**Pa·m³/s and mbar·L/s** differ by a factor of 10.

**Pressure change per unit time**, such as pascals per second or millibar in ten seconds, is not a leak rate at all until it is multiplied by the volume under test. The same leak gives a pressure drop ten times larger in a volume ten times smaller, which is why a pressure-decay reject limit set on one part cannot be transferred to another without recalculation.

**Mass per year**, such as grams of refrigerant per year, is the natural unit for refrigeration and air-conditioning components. It depends on the gas's molar mass: the same pV throughput is a larger mass of a heavy refrigerant than of helium.

```figure
type: stats
title: The OC-40 limit, 1 × 10⁻³ mbar·L/s of air at 10 bar gauge, in other units
caption: This is an illustration. sccm at 1,013.25 mbar and 0 °C; mass and daily volume at 20 °C.
- 1 × 10⁻⁴ Pa·m³/s | SI throughput
- 9.87 × 10⁻⁴ atm·cm³/s | the older pressure–volume unit
- 0.059 sccm | standard volume flow
- 1.19 × 10⁻⁹ kg/s | about 0.10 g of air a day
- about 85 cm³ a day | as free air at atmospheric pressure
```

## The mistake: a sensitivity quoted in sccm

Before the helium station was bought, the test engineer looked for a cheaper way to reach the specification. A supplier of flow-type leak testers quoted a resolution of 0.5 sccm for its fastest model. The engineer's comparison sheet put that beside the specification as "0.5 against 1 × 10⁻³" and, reading the units as similar, concluded that the tester was hundreds of times too coarse and dismissed it. A colleague reviewing the sheet read it the other way, as a tester able to resolve 0.5 against a limit of 1, and recommended buying it. Both had treated sccm and mbar·L/s as the same unit.

```figure
type: steps
title: Putting the tester's resolution in the specification's units
caption: This is an illustration. The conversion, not either reading of the comparison sheet, decides whether the method can reach the specification.
- Supplier's resolution | 0.5 sccm
- Converted | 0.5 ÷ 59.2 = 8.4 × 10⁻³ mbar·L/s
- Specification | 1 × 10⁻³ mbar·L/s of air at 10 bar gauge
- * Comparison | the tester's resolution is 8.4 times coarser than the specification it would have to judge
- Decision | flow tester suitable as a gross leak screen only; helium needed for the specification
```

Converted, the tester's resolution was 8.4 × 10⁻³ mbar·L/s, 8.4 times coarser than the limit it would have had to judge. A tester must resolve a small fraction of the limit, typically a tenth or less, to make reliable decisions near it, as Chapter 8 explains. The flow tester was a candidate for the gross leak screen and nothing more. The comparison sheet now has a column that converts every figure to mbar·L/s of air at the specification's pressure before any two are compared, with the standard conditions stated for every volume unit.

## Writing a good leak specification

The oil cooler's drawing is a good specification because it states the gas, the pressure, the rate and its units. Many are not. A specification that says "leak-tight" or "no bubbles" or "no pressure drop in 30 seconds" cannot be tested consistently, because it depends on the method, the operator, the gauge's resolution or the part's volume.

```figure
type: checklist
title: What a leak specification must state
caption: The open item is this chapter's mistake: units must be explicit, with standard conditions for any volume unit.
- x The rate, with explicit units | 1 × 10⁻³ mbar·L/s, not "leak-tight"
- x The gas | air, helium, refrigerant, water vapour
- x The pressures on each side | 10 bar gauge inside, atmosphere outside
- x The temperature | at which the rate applies, if it matters
- ? Standard conditions for any volume unit | 0 °C, 20 °C or 25 °C changes sccm by up to 9%
- x Which part of the product | oil side only; the air side is open
- x Total or per location | a whole-part limit or a limit per joint
```

The last point is easy to miss. A total limit allows one leak at the limit or many small ones that add up to it. A tracer gas method that locates leaks, such as sniffing, measures each location separately and must be judged against a per-location limit. A vacuum chamber method measures the total. The OC-40's specification is a total for the oil side, which suits the chamber test.

## Exercise: converting a refrigeration limit

A customer asks whether the OC-40 line could also test an evaporator whose specification is 3 g a year of refrigerant R-134a, molar mass 102.03 g/mol, at 20 °C. Convert that limit to mbar·L/s of R-134a, to sccm, and compare it with the OC-40 limit. Use a universal gas constant of 8.314 J/(mol·K) and 3.156 × 10⁷ seconds in a year.

### Answer

**Given:** 3 g a year of R-134a; M = 0.10203 kg/mol; T = 293.15 K; R = 8.314 J/(mol·K).

**Assumptions:** the leak rate is constant over the year; the gas behaves as ideal at the low partial pressures outside the part.

**Method:** mass rate, then moles per second, then pV throughput Q = ṅRT.

**Mass rate:** 3 × 10⁻³ kg ÷ 3.156 × 10⁷ s = 9.51 × 10⁻¹¹ kg/s.

**Molar rate:** 9.51 × 10⁻¹¹ ÷ 0.10203 = 9.32 × 10⁻¹⁰ mol/s.

**Throughput:** Q = 9.32 × 10⁻¹⁰ × 8.314 × 293.15 = 2.27 × 10⁻⁶ Pa·m³/s = 2.27 × 10⁻⁵ mbar·L/s.

**In sccm:** 2.27 × 10⁻⁵ × 59.2 = 1.34 × 10⁻³ sccm.

**Comparison:** the evaporator's limit is 1 × 10⁻³ ÷ 2.27 × 10⁻⁵ = 44 times tighter than the OC-40's, and it is stated for a different gas. The helium station would need a lower reject limit and a check of its background and sensitivity at that level, which Chapters 7 and 8 explain how to make.

**Verification:** working backwards, 2.27 × 10⁻⁶ Pa·m³/s ÷ (8.314 × 293.15) × 0.10203 × 3.156 × 10⁷ = 3.0 × 10⁻³ kg, or 3 g a year.
