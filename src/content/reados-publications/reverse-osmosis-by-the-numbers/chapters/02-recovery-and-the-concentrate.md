---
book: reverse-osmosis-by-the-numbers
chapterSlug: recovery-and-the-concentrate
order: 2
title: "Recovery and the concentrate"
description: "Water and salt mass balances for a reverse osmosis stage: recovery, salt passage, concentrate strength, the log-mean concentration factor and how recovery sets the feed pressure."
draft: false
---

A reverse osmosis unit splits one stream into two. Permeate leaves through the membrane, nearly salt-free; concentrate leaves at the far end of the pressure vessels, carrying almost all of the salt that came in with the feed. The share of the feed that becomes permeate is the recovery, and it is the single most important operating choice on the plant. It decides how much bore water must be pumped, how much salty water must be disposed of, how strong the concentrate becomes, and therefore how much pressure the last membranes need to keep making water.

This chapter sets out the two mass balances that govern a stage, applies them to BW-12 with the WORKOS osmotic-pressure tool, and shows why recovery and feed pressure cannot be chosen separately. It also derives the log-mean concentration factor that Chapter 3 needs, shows how to measure recovery on a running plant, and ends with an operator who turned the concentrate valve to save bore water and stopped the second stage making water.

## Two balances

Nothing accumulates in a reverse osmosis stage running steadily, so whatever water and salt go in must come out. Writing that down for water and for salt gives two equations, and they are all that is needed to find the concentrate.

```figure
type: formula
title: Water and salt balances for a reverse osmosis stage
formula: Q_f = Q_p + Q_c, and recovery r = Q_p ÷ Q_f
formula: Q_f c_f = Q_p c_p + Q_c c_c, so c_c = (c_f − r c_p) ÷ (1 − r)
caption: This is an illustration: BW-12 at 75% recovery with 1.5% salt passage (98.5% rejection), the permeate strength taken as a share of the feed strength.
- Flows | 16.0 m³/h feed, 12.0 m³/h permeate, 4.0 m³/h concentrate
- Permeate strength | c_p = 0.015 × 2.400 = 0.036 g/L, or 36 mg/L
step: c_c = (2.400 − 0.75 × 0.036) ÷ 0.25 = 9.492 g/L
step: Concentration factor c_c ÷ c_f = 3.955, close to 1 ÷ (1 − r) = 4
step: Salt in the permeate: 12.0 × 36 = 432 g/h of the 16.0 × 2,400 = 38,400 g/h fed, or 1.1%
```

Two habits avoid most mistakes. The first is to keep the definitions straight: recovery is permeate divided by feed, never permeate divided by concentrate. A plant making 12 m³/h of permeate and 4 m³/h of concentrate is at 75% recovery, not "three to one" or "300%". The second is to remember that salt passage is a ratio of concentrations, while what reaches the permeate tank is a mass flow. A 1.5% salt passage with 75% recovery sends 1.1% of the incoming salt into the permeate; the rest leaves with the concentrate.

The concentration factor tells the operator how salty the concentrate is compared with the feed. With negligible salt passage it is simply 1 ÷ (1 − r): 2.5 at 60%, 4 at 75%, 6.7 at 85%. Every dissolved substance in the feed is multiplied by about that factor, and Chapter 6 shows that the substances that matter most are the sparingly soluble ones, which reach their solubility limit long before the osmotic pressure becomes a problem.

## Concentrate strength sets the concentrate-end pressure

The concentrate osmotic pressure follows from its strength, with the same van 't Hoff relation as Chapter 1. At 75% recovery BW-12's concentrate has an osmotic pressure of 6.355 bar, four times the feed's. That is the number the feed pressure must beat at the far end of the train, after the 3.0 bar lost to friction along twelve elements in series and the 0.5 bar held on the permeate.

The [reverse osmosis pressure check (van 't Hoff osmotic pressure, concentrate end, net driving pressure)](/tools/ro-osmotic-pressure-check/) does this calculation for a stage. From the feed dissolved solids, the solute molar mass, the van 't Hoff factor, an osmotic coefficient and the temperature, it calculates the osmotic pressure of the feed, the concentrate and the permeate. It finds the concentrate strength from a solute mass balance at the recovery and salt passage entered, then the net driving pressure at the feed end and at the concentrate end, and the least feed pressure that keeps the required net driving pressure at the concentrate end. It flags a starved concentrate end and reminds the user to check scaling, since the concentrate is several times stronger than the feed. Like the tool in Chapter 1, it uses one osmotic coefficient and ignores concentration polarisation.

```figure
type: compare
title: BW-12's recovery choices at 11.5 bar gauge feed pressure and 25 °C
cols: Feed, m³/h | Concentrate, m³/h | Concentration factor | Concentrate π, bar | NDP at concentrate end, bar | Least feed pressure, bar g
rowhead: Recovery
caption: This is an illustration. Results of the osmotic-pressure check for 12.0 m³/h of permeate, 1.5% salt passage, 3.0 bar element pressure drop, 0.5 bar gauge permeate and 1.0 bar required at the concentrate end. Above about 80% the concentrate end stops making water at this feed pressure.
- 60% | 20.00 | 8.00 | 2.5 | 3.98 | 4.04 | 8.46
- 70% | 17.14 | 5.14 | 3.3 | 5.30 | 2.72 | 9.78
- * 75% | 16.00 | 4.00 | 4.0 | 6.35 | 1.67 | 10.83
- 80% | 15.00 | 3.00 | 5.0 | 7.94 | 0.09 | 12.41
- 85% | 14.12 | 2.12 | 6.7 | 10.58 | −2.55 | 15.05
```

The table makes the trade-off visible. Going from 60% to 75% recovery saves 4 m³/h of bore water and halves the concentrate, for 2.4 bar more feed pressure. Going from 75% to 85% saves another 1.9 m³/h of bore water but needs 4.2 bar more, and the concentrate becomes so strong that every extra point of recovery costs more pressure than the last. The pressure curve steepens because the concentrate osmotic pressure is proportional to 1 ÷ (1 − r), which grows without limit as recovery approaches 100%.

```figure
type: line
title: Least feed pressure for BW-12 against recovery
x: Recovery, %
y: Least feed pressure, bar gauge
ymin: 8
ymax: 16
caption: This is an illustration. From the osmotic-pressure check at 25 °C with 1.0 bar kept at the concentrate end. Scaling, not pressure, usually sets the practical limit first; Chapter 6 finds BW-12's.
- 60 | 8.46
- 70 | 9.78
- 75 | 10.83
- 80 | 12.41
- 85 | 15.05
```

## The average concentration along the train

The concentrate-end figure sets the minimum feed pressure, but the flow the membranes produce depends on the average driving pressure along the whole train, and that depends on the average concentration the membrane sees. The concentration does not rise in a straight line from feed to concentrate. Water is removed progressively, so the salt in the feed channel is concentrated slowly at first and quickly near the end.

If y is the fraction of the feed already removed as permeate at some point along the train, and almost no salt passes, the local concentration is c_f ÷ (1 − y). Averaging that over the permeate produced, from y = 0 to y = r, gives the log-mean concentration factor, ln[1 ÷ (1 − r)] ÷ r. The FilmTec system design equations use the same expression as their approximate log-mean ratio of feed-concentrate average to feed concentration.

```figure
type: bars
title: Concentration factors at BW-12's 75% recovery
caption: This is an illustration. The membrane surface sees a little more than these bulk figures; Chapter 5 adds concentration polarisation.
max: 4.5
- Feed | 1.000
- * Log-mean average along the train | 1.848
- Arithmetic mean of feed and concentrate | 2.500
- Concentrate | 4.000
```

For BW-12 the log-mean factor is ln(4) ÷ 0.75 = 1.848, so the average osmotic pressure the membranes work against is 1.848 × 1.607 = 2.970 bar. The arithmetic mean of feed and concentrate, 2.5 times the feed, would overstate it by a third. The simple average is a fair approximation for a single element at 10 or 15% recovery, which is why the makers' element-by-element calculations use it, but not for a whole train at 75%.

## Rejection, salt passage and recovery together

Rejection is quoted in two ways, and they differ more than people expect. Observed rejection compares the permeate with the feed: for BW-12, 1 − 36 ÷ 2,400 = 98.5%. The membrane itself, though, never sees the feed strength except at the very first element; on average it sees the log-mean concentration of the feed side, 2,400 × 1.848 = 4,436 mg/L, and compared with that the same permeate represents a rejection of 1 − 36 ÷ 4,436 = 99.19%. Element data sheets quote rejection at low recovery, where the two definitions nearly coincide; plant performance is usually quoted against the feed. Comparing one with the other makes a healthy plant look as if its membranes were failing.

The same reasoning shows that recovery changes permeate quality even when the membranes do not change. The salt that passes is proportional to the concentration the membrane sees, so at the same water flux the permeate strength scales with the log-mean concentration factor. Holding BW-12's membranes and flux constant, the permeate would be about 36 × 1.527 ÷ 1.848 = 29.7 mg/L at 60% recovery and about 36 × 2.232 ÷ 1.848 = 43.5 mg/L at 85%. A plant that needs better permeate can sometimes get it by lowering recovery, and a plant that raises its recovery should expect its permeate to get worse before any scaling sets in.

Those relations also explain why the permeate of a multi-stage plant is not uniform. The first stage sees the weakest water and makes the purest permeate; the second sees water twice as strong and makes permeate roughly twice as salty. The combined permeate is a flow-weighted blend. Sampling each stage's permeate separately, as the operator does in the error below, is the quickest way to tell which stage a quality problem comes from.

## Measuring recovery on a running plant

Recovery is set by the concentrate valve, or by a flow controller acting on it, and is read from flow meters. Two meters are enough, permeate and concentrate, because feed is their sum. A third meter on the feed gives a check: if feed does not equal permeate plus concentrate within the meters' accuracy, one of them is wrong.

Conductivity gives an independent estimate. Conductivity is roughly proportional to dissolved solids for one water, so the ratio of concentrate to feed conductivity is close to the concentration factor, and recovery is about 1 − (feed conductivity ÷ concentrate conductivity). For BW-12 at its design point that gives 1 − 1 ÷ 3.955 = 74.7%, within a third of a point of the 75% read from the meters, the difference being the salt that passes into the permeate. If the two estimates disagree by several points, look for a fouled meter, a sample point that is not representative, or a concentrate recirculation line returning some concentrate to the feed.

## What recovery costs and saves

Recovery is a business decision as much as a technical one. This is an illustration. At 75%, BW-12 running 16 hours a day for 250 days a year draws 64,000 m³ of bore water and sends 16,000 m³ of concentrate to disposal. At 60% it would draw 80,000 m³ and dispose of 32,000 m³; at 85%, about 56,500 m³ and 8,500 m³.

```figure
type: decision
title: Choosing a recovery for a brackish plant
question: What limits recovery for this water and this site?
caption: The answer is usually the first limit reached, not a target picked in advance. For BW-12 the scaling check in Chapter 6 sets it.
- Scaling of sparingly soluble salts | calcium sulfate, calcium carbonate, silica, barium sulfate | projection software and antiscalant supplier's limits; Chapter 6
- Pressure at the concentrate end | concentrate osmotic pressure plus losses | pump and membrane pressure ratings; this chapter
- *Concentrate disposal | volume and strength accepted by the utility or regulator | trade waste agreement or licence conditions
- Bore water supply | pumping rate the licence and the aquifer allow | water licence; drawdown records
```

Concentrate disposal is often the deciding cost. Saline concentrate sent to sewer needs the local water utility's trade waste approval, which may limit volume, salinity and timing and set charges for both. Evaporation ponds, reinjection and discharge to the environment need the environmental regulator's approval. Each of those can make a higher recovery worth more pressure and more antiscalant, or rule it out. The arithmetic of this chapter tells the plant owner what each option means in pressure, flow and salt; the approvals tell them which options exist.

The same mathematics appears in cooling towers, where water evaporates instead of passing through a membrane and the concentration of the circulating water rises in the same way; the chapter on [evaporation, drift, blowdown and cycles](/reados/publications/cooling-towers-by-the-numbers/evaporation-blowdown-and-cycles/) in Cooling Towers by the Numbers treats it from that side.

## The error: a valve turned to save water

This is an illustration. During a dry summer the plant was asked to cut its bore pumping. An operator partly closed BW-12's concentrate valve until the concentrate meter read 2.1 m³/h, keeping the permeate near 12 m³/h by raising the high-pressure pump's speed slightly. Recovery was now 85%. The feed pressure at the membrane inlet barely moved, because the pump's speed controller was holding permeate flow with the first-stage membranes doing most of the work.

Within a week, permeate conductivity had risen by about a third. The plant's engineer took samples from each stage's permeate port and found the second-stage permeate far saltier than the first. The osmotic-pressure check explained it: at 85% recovery and 11.5 bar the concentrate osmotic pressure is 10.58 bar and the net driving pressure at the concentrate end is −2.55 bar. The last elements were not just making little water; their feed side was at or below the osmotic pressure needed to make any, so salt continued to diffuse through them while almost no water did, and their small permeate flow was very salty.

The fix was to return to 75% recovery and to put the question of bore water to the right test: whether a higher recovery could be reached safely at all, which needs a higher feed pressure (15.05 bar for 1.0 bar at the concentrate end) and, more importantly, a scaling check at a concentration factor of 6.7. Chapter 6 shows that check fails for BW-12's water without changes to pretreatment. A permanent recovery change is a design change and should be projected and approved as one.

## Exercise: 70% recovery with older membranes

Some years from now, BW-12's membranes have aged and pass 2.0% of the feed salt. The plant considers running at 70% recovery at the same 11.5 bar feed pressure to ease the load on them. Find the permeate and concentrate strengths, the concentrate osmotic pressure, the net driving pressure at the concentrate end and the least feed pressure that keeps 1.0 bar there, at 25 °C with φ = 0.93.

**Worked answer.** This is an illustration. The permeate strength is 0.020 × 2.400 = **0.048 g/L**. The concentrate strength is (2.400 − 0.70 × 0.048) ÷ 0.30 = **7.888 g/L**, a concentration factor of 3.29. The particle concentration is 7.888 ÷ 34.44 × 1,000 = 229.0 mol/m³, so the concentrate osmotic pressure is 0.93 × 229.0 × 8.314 × 298.15 ÷ 100,000 = **5.281 bar**; the permeate's is 0.032 bar. At the concentrate end the net driving pressure is 11.5 − 3.0 − 0.5 − (5.281 − 0.032) = **2.75 bar**, and the least feed pressure for 1.0 bar there is 1.0 + 3.0 + 0.5 + 5.249 = **9.75 bar gauge**. The lower recovery gives the last elements a comfortable margin, at the cost of 1.1 m³/h more bore water and concentrate than at 75%.
