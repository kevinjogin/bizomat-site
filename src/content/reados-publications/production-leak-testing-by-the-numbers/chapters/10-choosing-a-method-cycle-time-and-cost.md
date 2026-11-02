---
book: production-leak-testing-by-the-numbers
chapterSlug: choosing-a-method-cycle-time-and-cost
order: 10
title: "Choosing a method, cycle time and cost"
description: "Matching leak test methods to limits and line rates, cycle time against takt, helium use and cost, appraising a recovery system, and a gas budget that counted the part instead of its fill."
draft: false
---

A leak test method has to do three things at once: reach the specification with a reliable decision, keep up with the line, and cost less than the problems it prevents. The earlier chapters dealt with the first. This chapter deals with the other two. It compares the methods for the OC-40 on what each can resolve and how long it takes, builds the helium station's cycle against the line's takt, works out how much helium each cooler consumes and what it costs, appraises a recovery system with the KEVOS investment appraisal tool, and finishes with a gas budget that understated the helium bill elevenfold.

## Matching the method to the limit

Every method has a range of leak rates it can decide on reliably in a production cycle, set by its physics and by the background or temperature noise it lives with. The first question is whether the specification lies inside that range.

```figure
type: compare
title: Methods against the OC-40's needs
cols: Practical range in production | Time per cooler | Locates the leak | Verdict for the OC-40
rowhead: Method
- Bubble test in water | about 10⁻¹ mbar·L/s and above, operator-dependent | 1 to 2 min | yes | gross leaks only; wets the part
- Direct pressure decay, 0.9 L | about 10⁻² mbar·L/s and above, limited by temperature | 23 s | no | the gross leak screen
- Mass flow | similar, independent of volume | 25 to 30 s | no | the OC-60 screen
- Hydrogen sniffing | about 10⁻⁶ mbar·L/s per location | about 2 min to cover every joint | yes | locating leaks in rejected coolers
- Helium accumulation, 20 to 30 L hood | about 10⁻⁴ to 10⁻⁵ mbar·L/s | 1 to 2 min | no | considered during the OC-60 ramp-up
- * Helium vacuum chamber | about 10⁻⁷ mbar·L/s and above at this background | 26 s | no | the specification test
caption: This is an illustration. Ranges are typical for this part size and background; Chapters 3 to 7 give the reasoning for each.
```

Only the vacuum chamber reaches the specification of 9.3 × 10⁻⁴ mbar·L/s of helium with a large margin over its background in a time the line can afford. The other methods have their places on the line, but not as the specification test.

## Cycle time against takt

The line makes 600 coolers in an 8-hour shift, a takt of 48 seconds. Each test station must complete its cycle, including loading and unloading, within that.

```figure
type: steps
title: The helium station's cycle for one OC-40
caption: This is an illustration. 26 s in all, against a 48 s takt, leaving time for a retest or an operator's delay without stopping the line.
- Load and connect, 5 s | cooler placed in the chamber; port connectors clamp
- Evacuate, 4 s | chamber and cooler pumped down; gross leaks detected if the cooler will not pump down
- Fill, 2 s | helium to 10 bar gauge into the cooler
- * Measure, 6 s | helium arriving at the detector; threshold 8.2 × 10⁻⁴ mbar·L/s
- Recover, 4 s | helium drawn back from the cooler to the recovery system
- Vent, 2 s | chamber returned to atmosphere
- Unload, 3 s | cooler out; result recorded against its serial number
```

At 26 seconds against 48, the station has room for the one retest Chapter 8 allows and for the occasional delay. Shortening the cycle further, as the engineer in Chapter 7 tried, is not needed for the line rate and costs measurement quality. The pressure decay screen, at 23 seconds, also fits. If the line rate rose by half, to 900 coolers a shift and a takt of 32 seconds, both stations would still fit, but a retest would then push the helium station beyond its takt, and a second chamber would be the safer investment.

### Utilisation and downtime

The cycle uses 26 of every 48 seconds, a utilisation of 54%. The rest is not waste: it absorbs retests, the occasional cooler that needs re-seating on its connectors, and the minute or two the station loses each time a gross leaker floods the chamber. The station also stops for its shift reference leak check, about three minutes, and for its detector's automatic hourly calibration, about a minute. Allowing for those, it is available for testing about 95% of the shift, and at 54% utilisation it can recover from a short stop by running at its full rate for a few minutes while the buffer conveyor ahead of it drains. A station loaded to 90% of its takt has no such reserve, and every stop costs line output.

## Where in the process to test

A leak found at final test is the most expensive leak to find, because the whole cooler has been made and every step after the defect has been wasted. The manufacturer considered testing earlier. The brazed core, before its cast tanks are welded on, could be tested for core leaks on a simple fixture that seals its headers; the tanks could be tested for porosity as castings. Core leaks are 55% of all leaks, as Chapter 9's map showed, and catching them before the tanks are fitted saves the tanks and the welding on every rejected core.

The arithmetic is simple. With about 0.6% × 55% = 0.33% of cores leaking at their corner joints, about 500 cores a year would be rejected before tank welding rather than after, saving the tanks, welding and final assembly on each. Whether that pays for a third station depends on those costs, which the manufacturer's finance team set at about A$60 a cooler, about A$30,000 a year. Against the cost of a core test fixture and its operator time, the case was marginal, and the brazing improvements prompted by Chapter 9's map, which reduced core leaks at source, made it weaker still. The manufacturer chose to fix the cause rather than add a test, which is usually the better order. A test station finds defects after they have been made; a process change stops them being made, and its savings appear at every station downstream, not just at the one that would have caught them. The question to ask before buying any new leak test is therefore not only "can we find these defects earlier?" but "can we stop making them?", and the leak location records are what answer it.

## How much helium a cooler uses

Each cooler is filled with helium at 10 bar gauge, 11.013 bar absolute. The amount of helium is not the cooler's 0.85 L but that volume compressed: as free gas at atmospheric pressure, 0.85 × 11.013 ÷ 1.013 = 9.24 L. The [gas volume at pressure and temperature tool](/tools/gas-law/) gives the same conversion, as it did for the screen's air in Chapter 3. Over a year of 250 shifts, about 150,000 coolers, that is 1,386 m³ of helium.

Helium is a finite resource extracted with natural gas, and its price has been volatile. At an illustrative bulk price of A$45 per cubic metre, excluding GST, filling every cooler and venting its helium would cost about A$62,400 a year, about A$0.42 a cooler.

### Recovery

A recovery system draws the helium back out of each cooler after the measurement, compresses it into a storage vessel, cleans it of air and moisture, and returns it to the fill supply. Commercial systems recover a large share of the helium, and for illustration the station's quoted system recovers 90%. The net use falls to 0.92 L a cooler, 139 m³ a year, about A$6,240 a year or about A$0.04 a cooler.

```figure
type: compare
title: The helium station's gas use and cost per year, 150,000 coolers
cols: Helium used | Cost at A$45 per m³
rowhead: Option
- Vent every fill | 1,386 m³ | about A$62,400
- * Recover 90% | 139 m³ | about A$6,240
- Saving from recovery | 1,247 m³ | about A$56,100
caption: This is an illustration. 9.24 L of free helium per cooler at 10 bar gauge; recovery share and price are illustrative assumptions, not supplier figures.
```

## Is recovery worth it?

The recovery system was quoted at A$85,000 installed, with running costs, mostly maintenance and power, of about A$4,000 a year, an expected life of eight years and a salvage value of A$5,000. The [equipment investment appraisal tool](/tools/investment-appraisal/) evaluates such a purchase from its cost, yearly savings and running cost, salvage, life and the business's hurdle rate.

Entering A$85,000, savings of A$56,100 a year, running costs of A$4,000, salvage of A$5,000, eight years and an 8% hurdle rate gives a net yearly flow of A$52,100, a net present value of A$217,100, an internal rate of return of 60%, a simple payback of 1.6 years and a discounted payback of 1.8 years. On any reasonable measure the recovery system pays for itself quickly.

### Testing the case

A good appraisal tests the assumption most likely to be wrong, and here that is the helium price. If the price halved, the saving would fall to about A$28,050 a year. The tool then gives a net yearly flow of A$24,050, an NPV of A$55,900, an IRR of 23% and a simple payback of 3.5 years, which fails the manufacturer's three-year payback rule though the NPV remains positive. The decision to buy is robust to large falls in the price, and the payback rule, the business's preferred test, is the stricter one. The manufacturer bought the system.

```figure
type: compare
title: The recovery system's appraisal at two helium prices
cols: Saving per year | NPV at 8%, 8 years | IRR | Simple payback
rowhead: Helium price
- * A$45 per m³ | A$56,100 | A$217,100 | 60% | 1.6 years
- A$22.50 per m³ | A$28,050 | A$55,900 | 23% | 3.5 years
caption: This is an illustration from the equipment investment appraisal tool, with A$85,000 installed, A$4,000 a year running cost and A$5,000 salvage. Figures exclude GST and tax effects.
```

## The mistake: a gas budget that counted the part

The first business case for the helium station estimated its gas use from the cooler's internal volume: 0.85 L a cooler, about 128 m³ a year, A$5,700 at A$45 per cubic metre. On that basis recovery was not worth buying, and the station was specified without it.

```figure
type: steps
title: Correcting the helium budget
caption: This is an illustration. Gas at 10 bar gauge occupies its volume at that pressure; the bill is for the free gas.
- First budget | 0.85 L per cooler × 150,000 = 128 m³ a year, A$5,700
- Supplier's first month of invoices | about 115 m³ in a month, ten times the budget's monthly share
- Correction | free gas = 0.85 L × 11.013 ÷ 1.013 = 9.24 L per cooler, 10.9 times the part's volume
- * Corrected budget | 1,386 m³ a year, about A$62,400 without recovery
- Decision | recovery system bought; payback 1.6 years
```

When the first month's helium invoices arrived, they were ten times the budget's monthly share. The budget had counted the cooler's internal volume, but at 10 bar gauge each cooler holds 11.013 ÷ 1.013 = 10.9 times that volume of free gas. Corrected, the annual use was 1,386 m³ and the cost about A$62,400, and the recovery system that had been left out of the station's specification paid for itself in less than two years. It was retrofitted three months later, at a little more cost than if it had been included from the start.

## Safety in the cycle

Every cooler on the helium station is a small pressure vessel at 10 bar gauge for a few seconds, and every cooler on the screen at 6 bar. A cooler with a cracked tank can fail under that pressure. The stations are designed so that it cannot hurt anyone when it does: the helium chamber's door is interlocked, so the cooler is pressurised only when the door is closed and locked, and the screen's fixture sits inside a guard with a light curtain that stops the fill if a hand enters. The stored energy at these pressures and volumes is small, but a flying fragment of cast aluminium is not, and the interlocks are tested at the start of each shift alongside the reference leak. Helium itself is inert, but the recovery system's storage vessel is a pressure vessel in its own right, registered and inspected as the state's work health and safety regulations require for its size and pressure.

## The whole cost of a leak test

The helium is only one cost. The cost per cooler of the specification test includes the station's capital, spread over its life, the operator's time, the helium, power and maintenance, the reference leak's annual calibration, and the repairs of the rejected coolers. Against those sit the costs avoided: warranty returns, field leaks and the customer's confidence. For the OC-40, a single field failure, a weeping cooler that has to be replaced on a farm, costs more than a thousand coolers' worth of helium, and the line's earlier experience of a batch of leaking coolers reaching the customer, before the helium station existed, had cost far more than the station.

### Writing the business case

The station's business case, rewritten after the helium budget was corrected, now sets out each cost line with its basis: the station's price and life, the helium at 9.24 L of free gas per cooler with and without recovery, power, maintenance and the reference leak's calibration, operator time at the station's 26-second cycle, and the repair cost of rejected coolers. Against them it lists the costs avoided, with the field failure rate before the station existed as the evidence. Each assumption that could be wrong by a factor of two, the helium price above all, has its own line in a sensitivity table. A case written that way is easy to check and quick to update when a price changes.

## Learn, apply, improve

Leak testing turns a functional requirement into a number, and every step of the book has been about keeping that number honest: units stated fully, flow regimes respected when converting gases and pressures, temperature controlled before pressure is trusted, tracer concentration known, the detector calibrated in the cycle it is used in, guard bands built from a measured uncertainty, defects counted rather than inferred from a capability index, and gas budgets that count the gas actually used. The mistakes in each chapter were caught by someone asking a short question about what a number meant. Asking those questions routinely is the best leak test procedure of all.

## Exercise: a second shift

The manufacturer plans to run a second shift, doubling output to 300,000 coolers a year. Using the figures of this chapter, calculate the helium used and its cost with 90% recovery, and the yearly saving from recovery at A$45 per cubic metre. Then say whether the helium station's cycle still fits the takt and whether the reference leak checks should change.

### Answer

**Given:** 300,000 coolers a year; 9.24 L of free helium per cooler; recovery 90%; price A$45 per m³; cycle 26 s; takt 48 s per shift.

**Assumptions:** the same cycle and recovery performance on both shifts; price unchanged.

**Method:** annual use = coolers × 9.24 L; net with recovery = 10% of that; costs at A$45 per m³.

**Without recovery:** 300,000 × 9.24 = 2,772 m³, about A$124,700.

**With 90% recovery:** 277 m³, about A$12,500.

**Saving:** 2,495 m³, about A$112,300 a year, twice the single-shift saving, so the recovery system's payback falls to well under a year of the second shift's operation.

**Cycle and takt:** the second shift runs at the same 600 coolers per shift, so the takt stays 48 s and the 26 s cycle still fits. The station's utilisation doubles, so its maintenance, the detector's filament and the chamber's seals, falls due twice as often.

**Reference leak checks:** they are run at the start of every shift, so they double too, which is right: each shift's readings rest on that shift's check. The Type 1 study of Chapter 8 should be repeated after the second shift starts, to confirm that the station's repeatability has not changed with heavier use.

**Verification:** the single-shift figures scale exactly by two: 1,386 × 2 = 2,772 m³ and A$62,400 × 2 ≈ A$124,700.
