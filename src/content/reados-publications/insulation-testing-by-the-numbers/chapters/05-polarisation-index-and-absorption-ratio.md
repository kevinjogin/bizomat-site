---
book: insulation-testing-by-the-numbers
chapterSlug: polarisation-index-and-absorption-ratio
order: 5
title: "Polarisation index and absorption ratio"
description: "The polarisation index and absorption ratio, why they separate dry from wet and dirty windings, criteria for C-1, when the ratios mean little, and small motors sent for drying they did not need."
draft: false
---

A single insulation resistance reading must be corrected for temperature before it can be compared with another, and the correction is approximate. A ratio of two readings taken on the same winding, at the same temperature, minutes apart, needs no correction at all for most purposes, and it measures something different: how much of the current is the absorption current of a healthy dielectric, and how much is leakage. That ratio, the polarisation index, has been used for nearly a century to judge whether a winding is dry and clean enough to energise.

This chapter defines the polarisation index and the dielectric absorption ratio, shows with the working model why they separate dry windings from damp and dirty ones, sets out the site's criteria for C-1, explains when the ratios mean little, and finishes with six evaporator fan motors that were sent away for drying because their polarisation index was 1.0, although they were perfectly dry.

## The two ratios

The **polarisation index**, PI, is the ratio of the insulation resistance after ten minutes to that after one minute: PI = IR₁₀ ÷ IR₁. Because the voltage is the same for both readings, it is also the ratio of the total current at one minute to the total current at ten minutes.

The **dielectric absorption ratio**, DAR, is a shorter version: the ratio of the one-minute reading to the thirty-second reading, DAR = IR₁ ÷ IR₀.₅. Some practices use other pairs of times, so the times must always be stated. The DAR is useful when a ten-minute test is impractical, for example on a large number of small motors, but because the absorption current changes less between thirty seconds and one minute than between one and ten minutes, it is a less sensitive measure.

```figure
type: formula
title: The polarisation index and dielectric absorption ratio
formula: PI = IR₁₀ ÷ IR₁ = i(1 min) ÷ i(10 min)
formula: DAR = IR₁ ÷ IR₀.₅ = i(30 s) ÷ i(1 min)
caption: Both readings are taken in the same test, at the same voltage and temperature, so the temperature correction largely cancels. State the times used whenever a ratio is reported.
- IR₁₀, IR₁, IR₀.₅ | insulation resistance at 10 min, 1 min and 30 s, MΩ
- i(t) | total test current at time t, µA
```

## Why the ratio works

The total current is the sum of the absorption current, which decays, and the leakage current, which does not. If the leakage current is small compared with the absorption current, the total current falls substantially between one and ten minutes, and the resistance rises: the PI is large. If the leakage current is large, because the insulation is wet or its surfaces are dirty, the decay of the absorption current makes little difference to the total, and the resistance hardly rises: the PI is close to 1.

The working model of C-1 shows this directly. At 40 °C and 2,500 V, a clean, dry C-1 has an absorption current of 1.113 µA at one minute, falling as t⁻⁰·⁶, and a leakage current of 0.137 µA. The same model with a leakage current of 5 µA represents the winding with dirty, damp end windings, and with 50 µA a winding that has been wetted throughout. The absorption current is the same in all three, because the dielectric itself has not changed.

```figure
type: compare
title: C-1's working model in three conditions, 2,500 V DC at 40 °C
cols: Leakage current | IR at 30 s | IR₁ | IR₁₀ | PI | DAR
rowhead: Condition
- Clean and dry | 0.137 µA | 1,371 MΩ | 2,000 MΩ | 6,000 MΩ | 3.00 | 1.46
- Dirty, damp end windings | 5.0 µA | 374 MΩ | 409 MΩ | 474 MΩ | 1.16 | 1.09
- Wet throughout | 50 µA | 48 MΩ | 49 MΩ | 50 MΩ | 1.02 | 1.01
caption: This is an illustration. Absorption current 1.113 µA at one minute with n = 0.6 in every case. Absorption current is 89 % of the one-minute current when dry, 18 % when dirty and 2 % when wet.
```

```figure
type: line
title: C-1's insulation resistance during a ten-minute test, clean and dry
x: Time after the voltage is applied, minutes
y: Insulation resistance, MΩ
ymin: 0
ymax: 6500
caption: This is an illustration from the working model at 40 °C. The resistance triples between one and ten minutes as the absorption current decays. A wet winding's curve would be almost flat near 50 MΩ.
- 0.5 | 1371
- 1 | 2000
- 2 | 2869
- 5 | 4457
- 10 | 5999
```

The temperature correction cancels only approximately in the ratio, because the absorption and leakage currents do not change with temperature in exactly the same way. For the site's purposes, readings within the same test are compared without correction, but ratios from tests at very different temperatures are compared with care.

## The site's criteria for C-1

Standards for rotating machine insulation, such as IEEE Std 43, give recommended minimum values for insulation resistance and polarisation index by insulation type. Those values are not reproduced here. The cold store uses its own criteria for its 3.3 kV motors, set with its rewinder and labelled in its procedure as site criteria: before energising after a shutdown, the one-minute reading corrected to 40 °C must be at least 1,000 MΩ and the polarisation index at least 2.0. If either is not met, the winding is inspected, cleaned or dried as needed, and retested.

These criteria are deliberately conservative for a machine whose failure costs A$180,000 or more in summer. A winding just below them is not necessarily about to fail, but it is not in the condition the site expects of it, and the cause should be found.

```figure
type: decision
title: The site's decisions on a C-1 test result
caption: This is an illustration. Criteria are the site's own, not values from a standard.
- IR₁ at 40 °C at least 1,000 MΩ and PI at least 2.0 | Energise; trend the results | Normal condition
- IR₁ at least 1,000 MΩ but PI below 2.0 | Inspect end windings and terminal box; clean and retest | Leakage rising relative to absorption
- IR₁ below 1,000 MΩ, PI at least 2.0 | Check what was in the circuit; test phases separately | Possibly a cable or a local path
- IR₁ below 1,000 MΩ and PI below 2.0 | Do not energise; inspect, clean and dry; retest | Moisture or contamination likely
```

## When the ratios mean little

The polarisation index depends on there being an absorption current large enough to measure against the leakage. Two situations break that assumption.

The first is a small, random-wound winding. A 2.2 kW motor's insulation is thin, made of enamel and polyester film rather than layered mica and epoxy, and its absorption current is small and decays in seconds rather than minutes. By one minute it has gone, and the current is almost all leakage, so the resistance at ten minutes is the same as at one minute and the polarisation index is close to 1.0, even if the winding is perfectly dry.

A simple model shows this. Suppose an evaporator fan motor at 500 V has a leakage resistance of 50,000 MΩ, giving a leakage current of 0.01 µA, and an absorption current that starts at 0.05 µA and decays exponentially with a time constant of 5 seconds. At thirty seconds the absorption current has fallen to about 0.0001 µA and at one minute to almost nothing. The resistance is 49,390 MΩ at thirty seconds, 49,998 MΩ at one minute and 50,000 MΩ at ten minutes: a DAR of 1.01 and a PI of 1.00 from a winding with a resistance of fifty thousand megohms.

```figure
type: bars
title: Polarisation index from the models, by condition
unit: PI
max: 3.2
caption: This is an illustration. The small motor is dry and clean, yet its PI is the same as C-1's when wet, because its absorption current is gone within seconds. For small random-wound motors the corrected IR value and its trend are the useful results.
- C-1, clean and dry | 3.00
- C-1, dirty, damp end windings | 1.16
- C-1, wet throughout | 1.02
- * Fan motor, dry, 50,000 MΩ | 1.00
```

The second situation is a very high insulation resistance. When the one-minute reading is many thousands of megohms, the total current is a few nanoamperes, close to the resolution and stability of many instruments and comparable with leakage across the test leads themselves. The ratio of two such readings can wander for reasons that have nothing to do with the winding. Standards note this limitation; the site's procedure says that when IR₁ is very high, the PI is recorded but the decision rests on the IR value and its trend.

## The mistake: drying motors that were dry

After the problems in the blast freezers described in Chapter 1, the site extended ten-minute polarisation index tests to all 24 evaporator fan motors at their annual service. Six of the storage-room motors, tested in the workshop at about 22 °C, had one-minute readings between 18,000 and 30,000 MΩ and polarisation indices between 1.0 and 1.1. The technician applied the C-1 criterion of a PI of at least 2.0, failed all six, and sent them to the rewinder for oven drying at about A$350 each.

The rewinder rang back after drying the first two: their readings were unchanged, and so was their polarisation index. The electrical supervisor reviewed the results with the rewinder. The motors' corrected readings were between 5,200 and 8,600 MΩ, far above those of the blast freezer motors, and the readings were steady from one minute to ten minutes because there was almost no absorption current to decay. The PI criterion had been written for a form-wound, mica-epoxy machine and meant nothing for these motors.

```figure
type: steps
title: How the drying was stopped
caption: This is an illustration. Six motors, 500 V DC at about 22 °C in the workshop.
- Results | IR₁ 18,000 to 30,000 MΩ; PI 1.0 to 1.1
- Criterion applied | C-1's PI of at least 2.0, written for form-wound mica-epoxy windings
- Action | six motors sent for drying at about A$350 each
- Rewinder's report | no change in IR or PI after drying
- * Diagnosis | almost no absorption current in small random-wound windings; PI near 1.0 is normal for them
- Fix | remaining four collected undried; criteria for small motors rewritten around corrected IR and its trend
```

The procedure now has separate criteria for the random-wound fan motors: the one-minute reading corrected to 40 °C, compared with the motor's own history and with its sister motors, with a DAR recorded for information. The site paid for two unnecessary dryings and collected the other four motors undried.

## Splitting the current

The working model can be turned round. Given a measured one-minute reading and a polarisation index, and assuming an exponent for the absorption current, the total current can be split into its absorption and leakage parts. The current at one minute is i₁ = V ÷ IR₁ and at ten minutes i₁₀ = i₁ ÷ PI. The absorption current falls by the factor 10⁻ⁿ between the two times while the leakage stays constant, so the absorption current at one minute is A = (i₁ − i₁₀) ÷ (1 − 10⁻ⁿ), and the leakage current is I_L = i₁ − A.

```figure
type: formula
title: Splitting the test current from IR₁ and PI
formula: i₁ = V ÷ IR₁        i₁₀ = i₁ ÷ PI
formula: A = (i₁ − i₁₀) ÷ (1 − 10⁻ⁿ)        I_L = i₁ − A
caption: Assumes the absorption current follows A × t⁻ⁿ with a known exponent, and the leakage current is steady. With no leakage, PI = 10ⁿ, about 4 for n = 0.6.
- A | absorption current at one minute, µA
- I_L | leakage current, µA
- n | exponent of the absorption current
```

Applied to the dirty case in the table above, a reading of 409 MΩ at 2,500 V gives i₁ = 6.11 µA; a PI of 1.16 gives i₁₀ = 5.27 µA; with n = 0.6, A = 0.843 ÷ 0.749 = 1.13 µA and I_L = 4.99 µA, recovering the model's values. The split is useful because it shows which part has changed. If a winding's absorption current is unchanged from its commissioning value but its leakage has risen tenfold, the dielectric is sound and something is conducting alongside it: a damp surface, a dirty terminal board or a connected cable. If the absorption current itself has changed markedly, the dielectric has changed, by absorbing water, by ageing or by damage.

## Reading a PI trend

A single polarisation index is a snapshot; its trend over years is more informative. C-1's polarisation index at its annual tests was 3.0, 2.9, 3.1, 2.9 and 3.0 over its first five years, a steady pattern that the site regards as normal. Had it fallen year by year towards 2, with the one-minute reading steady, the split above would have shown the leakage rising relative to the absorption current, most likely from a slowly building surface film on the end windings, and a clean at the next shutdown would have been planned before the criterion was reached.

The opposite pattern, a polarisation index rising well above its usual value, is also worth noticing. It can mean that the winding has dried out further than before, or that the leakage has fallen after cleaning, both good news. On old windings with brittle, highly cured resin it can accompany a high and rising resistance that hides cracking, so a very high PI on an old machine is a reason to look at the other tests, not to stop looking. A PI close to the upper limit of about 4 set by the exponent shows almost no leakage at all.

## Ratios on other equipment

The same ratios are used on other insulated equipment, with the same caution about what the absorption current depends on. Long power cables have a large capacitance and, in paper or layered insulation, a substantial absorption current, so their polarisation index can be informative; extruded polymer cables such as XLPE have little absorption current, and their ratios, like those of the small fan motors, sit near 1.0 when the cable is sound. Oil-filled transformers have layered paper and oil insulation with strong interfacial polarisation, and their ratios depend heavily on the oil's condition and temperature. For every kind of equipment, the useful question is the same: compared with this item's own history and with similar items, has the balance between absorption and leakage changed?

The cold store records the ratios for every item it tests, but applies a numerical criterion only to C-1 and C-2, where years of results and the rewinder's experience with similar windings support it. For everything else, the ratios are context for the corrected one-minute reading.

## Exercise: C-2's annual test

At C-2's annual test, the readings at 2,500 V DC were 1,250 MΩ at thirty seconds, 1,820 MΩ at one minute and 4,900 MΩ at ten minutes, at a winding temperature of 30 °C. Calculate the DAR and PI and the one-minute reading corrected to 40 °C, and say whether C-2 meets the site's criteria.

### Answer

**Given:** IR₀.₅ = 1,250 MΩ, IR₁ = 1,820 MΩ, IR₁₀ = 4,900 MΩ at 30 °C.

**Assumptions:** the site's halving rule for temperature correction; the site's criteria of at least 1,000 MΩ at 40 °C and a PI of at least 2.0.

**Method:** DAR = IR₁ ÷ IR₀.₅; PI = IR₁₀ ÷ IR₁; IR₄₀ = 0.5^((40 − T) ÷ 10) × IR₁.

**DAR:** 1,820 ÷ 1,250 = 1.46.

**PI:** 4,900 ÷ 1,820 = 2.69.

**Corrected IR₁:** 0.5^1.0 × 1,820 = 910 MΩ.

**Conclusion:** C-2's polarisation index of 2.69 shows a winding in which absorption current dominates, so it is not wet or heavily contaminated. Its corrected one-minute reading of 910 MΩ is just below the site's 1,000 MΩ criterion. Following the decision table, the next step is to check what was in the circuit and test the phases separately before deciding on cleaning or drying.

**Current split:** at 30 °C, i₁ = 2,500 ÷ 1,820 = 1.374 µA and i₁₀ = 1.374 ÷ 2.69 = 0.511 µA, so with n = 0.6 the absorption current is A = 1.15 µA and the leakage current I_L = 0.22 µA. Absorption is about 84 % of the one-minute current, consistent with a dry winding whose low corrected value should be investigated through its circuit and its phases.

**Verification:** the PI and DAR use readings from one test at one temperature, so they need no correction; only the absolute value is corrected.
