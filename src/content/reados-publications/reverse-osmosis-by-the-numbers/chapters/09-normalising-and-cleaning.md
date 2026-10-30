---
book: reverse-osmosis-by-the-numbers
chapterSlug: normalising-records-and-cleaning
order: 9
title: "Normalising the records and deciding when to clean"
description: "Normalised permeate flow, salt passage and pressure drop, the cleaning triggers makers give, acid and alkaline cleans, ageing membranes and a normaliser fed the wrong osmotic pressure."
draft: false
---

A reverse osmosis plant's raw readings change every day for reasons that have nothing to do with the membranes. The feed warms and cools, the bore water gets a little saltier or fresher, the recovery set point is adjusted, the permeate demand changes. Hidden inside those changes is the slow drift that does matter: fouling, scaling and ageing. Normalisation strips out the effects of operating conditions so that what remains is the membrane's own condition, and it is the only reliable basis for deciding when to clean and when to replace.

This chapter sets out how to normalise permeate flow, salt passage and pressure drop to reference conditions, using the same relations as Chapters 1 to 4. It works through a year of BW-12's records, applies the cleaning triggers that makers give, describes the clean itself, and looks at how the normalised numbers show a membrane ageing. It ends with a normalising spreadsheet that kept the design osmotic pressure after the feed changed, and hid a fouled membrane for two months.

## What normalisation does

The idea is simple: if the membranes have not changed, the permeate flow should change in proportion to the net driving pressure and the temperature correction factor. Dividing out those two effects from each day's flow gives the flow the plant would have made at the reference conditions. ASTM D4516 is the standard practice for standardising reverse osmosis performance data in this way; makers' manuals give the same method.

```figure
type: formula
title: Normalised permeate flow and salt passage
formula: Q_n = Q_m × (NDP_ref ÷ NDP_m) × (TCF_ref ÷ TCF_m)
formula: SP_n = SP_m × (J_m ÷ J_ref) × (TCF_ref ÷ TCF_m)
caption: Subscript m is the measured day, ref the reference (commissioning) day. NDP = feed pressure − half the pressure drop − permeate pressure − mean osmotic pressure; the mean osmotic pressure uses that day's feed strength, temperature and recovery. Salt passage is permeate strength divided by feed strength.
- Reference day, 25 °C | Q = 12.0 m³/h at 11.40 bar g, ΔP 3.0 bar, permeate 0.5 bar g, feed 2,400 mg/L, permeate 33 mg/L
- Reference NDP | 11.40 − 1.5 − 0.5 − 2.970 = 6.43 bar
- Normalised flow | equals 12.0 m³/h on the reference day by definition
- Normalised salt passage | SP changes because salt flux rises with the TCF and is diluted by water flux
```

Pressure drop is the third indicator, and the simplest: on a plant with flow control, the feed and concentrate flows are held steady, so the pressure drop from feed to concentrate can be compared directly from day to day. Where flows vary, makers' manuals give a correction for the change in flow.

The inputs must be good. Normalisation divides by small differences: the net driving pressure of 6.43 bar is what remains after subtracting 5.0 bar of other terms from 11.4. An error of 0.1 bar in a pressure transmitter, or 1 K in the temperature sensor, moves the normalised flow by 1.5 to 3%. Calibrated instruments, logged automatically at the same point in the plant's cycle each day, make the method work.

## A year of BW-12's records

```figure
type: compare
title: Three days from BW-12's log, normalised to the commissioning day
cols: Feed, °C | Feed pressure, bar g | ΔP, bar | Feed, mg/L | Permeate, mg/L | Normalised flow change | Normalised salt passage change | ΔP change
rowhead: Day
caption: This is an illustration. Permeate held at 12.0 m³/h by the pump's drive; recovery held at 75%. The winter day looks alarming in raw pressure but is normal. The summer day crosses all three triggers.
- Day 1, commissioning | 25 | 11.40 | 3.0 | 2,400 | 33 | 0 | 0 | 0
- Day 120, winter | 18 | 13.40 | 3.2 | 2,450 | 27 | −1.6% | +2.3% | +6.7%
- * Day 300, summer | 29 | 11.80 | 3.5 | 2,400 | 45 | −12.6% | +21.3% | +16.7%
```

On day 120 the feed pressure was 2.0 bar higher than at commissioning, which on its own looks like a badly fouled plant. Normalisation tells a different story. At 18 °C the mean osmotic pressure, with the slightly saltier feed, is 2.960 bar and the net driving pressure 13.40 − 1.6 − 0.5 − 2.960 = 8.34 bar. The TCF is 0.784. The normalised flow is 12.0 × (6.43 ÷ 8.34) × (1 ÷ 0.784) = 11.81 m³/h, only 1.6% below the reference. The plant is working harder because it is cold, not because it is dirty. The permeate is purer than at commissioning because cold membranes pass less salt; normalised, the salt passage is up only 2.3%.

On day 300 the feed pressure was only 0.4 bar above commissioning, which looks almost normal, but the feed was at 29 °C, when a clean plant would need well under 11 bar. The net driving pressure is 11.80 − 1.75 − 0.5 − 3.009 = 6.54 bar and the TCF 1.125, so the normalised flow is 12.0 × (6.43 ÷ 6.54) ÷ 1.125 = 10.49 m³/h, 12.6% below the reference. The normalised salt passage is up 21% and the pressure drop up 17%. A warm summer was hiding a fouled plant.

```figure
type: line
title: BW-12's normalised permeate flow through its first year
x: Day of operation
y: Normalised permeate flow, m³/h
ymin: 10
ymax: 12.5
caption: This is an illustration. Monthly normalised values from the log, with the reference at 12.0 m³/h. The 10% trigger is 10.8 m³/h. Raw permeate flow was held at 12.0 m³/h throughout by raising the pressure.
- 1 | 12.00
- 60 | 11.93
- 120 | 11.81
- 180 | 11.62
- 240 | 11.20
- 300 | 10.49
- 310 | 11.82
```

## What to log

Normalisation needs the same set of readings every day, taken at steady operation, and BW-12's control system logs them every fifteen minutes so that daily averages can be formed from settled values rather than a single reading taken during a start-up. The list is short.

- **Flows:** permeate and concentrate, and feed as a check on the two.
- **Pressures:** feed at the first-stage inlet, interstage, concentrate and permeate, so that each stage's pressure drop and the overall driving pressure can be found.
- **Temperature:** feed, at the first vessel, as Chapter 4 required.
- **Conductivity:** feed, permeate from each stage and combined permeate, and concentrate. The feed conductivity is converted to dissolved solids with a factor checked against each laboratory analysis, and the concentrate conductivity confirms the recovery.
- **Pretreatment:** ORP after the metabisulfite dose, cartridge filter pressure drop, antiscalant and metabisulfite tank levels, and the weekly SDI result.
- **Events:** cleans, cartridge changes, set point changes, bore changes and alarms, with dates, so that steps in the normalised data can be explained.

Conductivity meters drift, and a drifting permeate meter can make salt passage look worse or better than it is. BW-12 checks its meters against a calibrated handheld meter monthly and against the laboratory quarterly. When the membrane maker is asked for help with a problem, the first thing it will ask for is this log, normalised, from the commissioning day onwards.

## Cleaning triggers

Membrane makers give cleaning triggers in terms of normalised data, so that the decision does not depend on the weather. The values vary a little between makers; a Water Technology summary of makers' guidance gives the common set as a fall of about 10% in normalised permeate flow, a rise of 5 to 10% in normalised salt passage, or a rise of 10 to 15% in normalised pressure drop, from the clean baseline. The plant's own maker's figures should be used.

```figure
type: checklist
title: BW-12's cleaning triggers, from its membrane maker's guidance
caption: This is an illustration. BW-12's procedures use a 10% flow fall, a 10% salt passage rise and a 15% pressure drop rise, each normalised and confirmed over three days. Day 300 crossed all three.
- x Normalised permeate flow down 10% or more | day 300: −12.6%
- x Normalised salt passage up 10% or more | day 300: +21.3%
- x Normalised pressure drop up 15% or more | day 300: +16.7%
- ? Which stage changed most | first-stage ΔP up more than second: suggests particulate or biological fouling at the lead
```

Cleaning late is the common mistake. A membrane fouled to a 10% flow loss usually recovers almost fully with a clean; one left until it has lost 30% may not, because compacted deposits are harder to remove and some fouling becomes permanent. Cleaning too often costs production, chemicals and some membrane life. Normalised triggers put the decision in the right place.

## The clean itself

The stage readings point to the foulant. A pressure drop rising mainly in the first stage, with flow falling and salt passage rising, points to particles, colloids or biofilm at the lead elements. A rise concentrated in the second stage points to scale. BW-12's day-300 data showed the first-stage pressure drop up 22% and the second only 9%, with a summer of warm water in the feed tank: biological fouling was the likely cause.

Cleaning circulates a chemical solution through one stage at a time from a cleaning tank, at low pressure and a flow rate the maker specifies, with soaking periods between circulations. An alkaline clean at high pH removes organic and biological deposits and silt; an acid clean at low pH removes carbonate scale and iron. The maker's cleaning guide sets the chemicals, pH, temperature limits, flow rates and order, which commonly puts the alkaline step first for biological fouling and the acid step first for scale. pH and temperature limits matter: exceeding them can damage the membrane as surely as the foulant.

The cleaning chemicals are hazardous. Concentrated acids and caustic solutions burn skin and eyes, cleaning solutions are often warmed, and incompatible chemicals mixed by mistake can react violently. Safe Work Australia's model code of practice for hazardous chemicals sets out the duties: safety data sheets at hand, labelled and bunded storage, protective equipment, eyewash and shower facilities, and procedures that keep acid and alkaline steps apart. Spent cleaning solution is a trade waste, and its disposal needs the same approval as the concentrate.

After the clean, BW-12's normalised flow returned to 11.82 m³/h, 1.5% below its commissioning value, its pressure drop to within 2% of the baseline and its salt passage to 5% above the baseline. That residual is normal. The new post-clean values became the baseline against which the next cycle's triggers were counted, while the commissioning values were kept to track the long-term loss.

## How membranes age

Over years, even well-run membranes change. Their normalised flow drifts down a little after each clean, their salt passage drifts up, and the plant's permeate gets saltier at the same flux. A record of post-clean normalised values tells the owner how fast that is happening and when the permeate will reach its specification.

This is an illustration. If BW-12's normalised salt passage rises by about 7% a year after allowing for cleaning, the summer permeate at constant flux, 38.4 mg/L at 30 °C with new membranes, would reach about 54 mg/L after five years, close to the 60 mg/L rinse specification. The owner would plan the replacement for the year in which the summer permeate approaches the specification, and might replace the lead elements of each vessel first, since they foul most. Rates of ageing differ widely between plants and waters; the plant's own records are the only reliable guide, which is another reason to normalise from the first day.

The replacement decision is also a chance to revisit the design. Membrane products improve, and a newer element with higher permeability or lower salt passage may let the plant run at lower pressure, or at a higher recovery if the scaling limits of Chapter 6 allow. The arithmetic of this book is the way to test such a proposal before buying: recalculate the feed pressure with the new permeability and the TCF at the coldest feed, the concentrate-end driving pressure, the lead element flux in summer and the permeate quality at the warmest feed. A proposal that improves one of those at the expense of another should be projected with the maker's software, using the plant's own water analysis and its own normalised history, before any order is placed.

## The error: a normaliser stuck on the design water

This is an illustration. In its third year, BW-12 began drawing a blend of its original bore and the fresher second bore of Chapter 1's exercise, and the feed fell to about 2,000 mg/L. The normalising spreadsheet, however, took the mean osmotic pressure from a cell holding the design value, 2.970 bar, rather than calculating it from the day's feed conductivity.

With the fresher feed, a clean membrane would have needed less pressure. Two months after the change, the plant ran at 11.65 bar at 25 °C with a pressure drop of 3.2 bar. The spreadsheet calculated the driving pressure as 11.65 − 1.6 − 0.5 − 2.970 = 6.58 bar and a normalised flow 2.3% below the reference: no action needed. The true mean osmotic pressure of the 2,000 mg/L blend was 2.475 bar, so the true driving pressure was 7.08 bar and the true normalised flow 10.91 m³/h, 9.1% down and approaching the trigger. Salt passage told the same story: the permeate held at about 30 mg/L, but against a feed of 2,000 mg/L instead of 2,400 that was a 9% rise in normalised passage.

The engineer noticed because the permeate conductivity was not falling as the feed got fresher, which it should have, and traced the discrepancy to the fixed cell. The spreadsheet was corrected to calculate the osmotic pressure each day from feed conductivity, converted with a factor checked against each quarterly laboratory analysis, and the plant was cleaned two weeks later than it should have been. The lesson is that every term in the normalised driving pressure must come from that day's measurements, because the method subtracts large numbers to find a small one.

## Exercise: normalise a spring day

On day 400, BW-12 runs at 22 °C with a feed pressure of 12.2 bar gauge, a pressure drop of 3.3 bar, a permeate pressure of 0.5 bar gauge, feed at 2,400 mg/L, permeate 31 mg/L and 12.0 m³/h at 75% recovery. The reference is the commissioning day. Normalise the flow and salt passage, and judge the pressure drop against BW-12's triggers.

**Worked answer.** This is an illustration. The mean osmotic pressure at 22 °C is 2.970 × 295.15 ÷ 298.15 = **2.940 bar**, so the driving pressure is 12.2 − 1.65 − 0.5 − 2.940 = **7.11 bar**. The TCF below 25 °C is exp[3020 × (1 ÷ 298 − 1 ÷ 295)] = **0.902**. The normalised flow is 12.0 × (6.43 ÷ 7.11) ÷ 0.902 = **12.03 m³/h**, effectively unchanged. Salt passage is 31 ÷ 2,400 against 33 ÷ 2,400 on the reference day; at the same flux, the normalised change is (31 ÷ 33) ÷ 0.902 − 1 = **+4.1%**, below the 10% trigger. The pressure drop is up (3.3 − 3.0) ÷ 3.0 = **10%**, below the 15% trigger but worth watching: a rising pressure drop with steady flow is often the first sign of fouling in the feed channel, before it shows in the flow.
