---
book: accelerated-life-testing-by-the-numbers
chapterSlug: electrolytic-capacitor-life
order: 3
title: "Electrolytic capacitor life: the part that sets the driver's life"
description: "How electrolytic capacitors wear out, the maker's doubling rule, core temperature and ripple heating, FL-60's capacitor choice, and the one capacitor nobody measured."
draft: false
---

In most power supplies, LED drivers and motor drives, the part most likely to wear out first is the aluminium electrolytic capacitor. It is cheap, compact and holds a great deal of charge for its size, and it does so with a liquid electrolyte that slowly escapes and degrades over the years. Its life is strongly temperature-dependent, its makers publish life ratings and rules for extrapolating them, and it is therefore the textbook case for temperature-accelerated testing.

This chapter explains how an electrolytic capacitor wears out and how its rated life is defined, applies the makers' doubling rule to FL-60's capacitors over their temperature profile, shows how ripple current adds heat of its own, compares the rule with the Arrhenius model of Chapter 2, and uses the results to choose between two capacitors. It ends with a capacitor that ran hotter than the one that was measured.

## How an electrolytic capacitor wears out

An aluminium electrolytic capacitor is a roll of aluminium foil with a very thin oxide layer as its dielectric, separated by paper soaked in a liquid electrolyte that makes contact with the oxide's rough surface. The can is sealed with a rubber bung. Over time, the electrolyte slowly escapes through the seal and is consumed by chemical reactions that maintain the oxide layer. As it is lost, the capacitance falls and the **equivalent series resistance (ESR)** rises.

The rise in ESR feeds back on itself. The capacitor carries a ripple current, and the power it dissipates is the ripple current squared times the ESR. As the ESR rises, so does the dissipation, which raises the core temperature, which speeds up the loss of electrolyte. Würth Elektronik's support note on capacitor lifetime describes this chain: ageing raises the leakage current and the ESR, and the extra loss raises the temperature. The end, if nothing intervenes, is a capacitor that no longer filters, a driver whose output flickers or fails, and sometimes a capacitor that vents.

Both the escape of electrolyte and the reactions that consume it are thermally activated, so the rate of wear rises steeply with the temperature at the capacitor's core, the hottest point inside the can.

## Rated life and the doubling rule

Capacitor makers rate each series for a **nominal life** at its maximum rated temperature, for example 2,000 hours at 105 °C, measured with rated voltage and ripple current applied. "Life" here means the time until the capacitor's parameters, typically capacitance, ESR and leakage current, move outside limits the maker defines for that series. It is not the time to catastrophic failure, and it is not a guarantee that every part will last that long; the series' data sheet says how life is defined and what proportion of parts it represents, and that wording matters.

To estimate life at lower temperatures, makers give a rule. For liquid aluminium electrolytic capacitors, the commonest is the one stated in Würth's note: life doubles for each 10 K fall in temperature.

```figure
type: formula
title: The makers' lifetime rule for liquid aluminium electrolytic capacitors
formula: Lx = Lnom × 2^((T0 − Tx) ÷ 10)
caption: From Würth Elektronik's support note SN008a. Tx is the temperature at the component. Makers cap the result: the same note gives a typical maximum expected lifetime of 13 to 15 years, whatever the formula says.
- Lx | expected life at temperature Tx, h
- Lnom | nominal life at the rated temperature, h
- T0 | rated maximum temperature, °C
- Tx | temperature at the component in use, °C
step: 2,000 h at 105 °C, used at 55 °C: 2,000 × 2^5 = 64,000 h
step: 2,000 h at 105 °C, used at 75 °C: 2,000 × 2^3 = 16,000 h
step: 10,000 h at 105 °C, used at 55 °C: 10,000 × 2^5 = 320,000 h, capped by the maker at about 13 to 15 years of calendar life
```

The cap in the last step is important. A formula that predicts 320,000 hours, more than 36 years of continuous running, is extrapolating far beyond anything the maker has tested, and other ageing processes, including the rubber seal's own ageing and the slow drying of the electrolyte even without load, set an upper limit. The 13 to 15 years quoted in the note is a typical figure set by makers; the data sheet for the specific series should be checked for its own.

## FL-60's capacitors over their profile

This is an illustration. FL-60's prototype driver used capacitors rated **2,000 hours at 105 °C**. Its core temperatures follow the profile of Chapter 1: 45 °C for 25% of operating hours, 55 °C for 50%, 65 °C for 20% and 75 °C for 5%.

As in Chapter 2, the profile must be averaged by rate, not by temperature. Under the doubling rule, the rates relative to 55 °C are 0.5, 1, 2 and 4, so the average rate is 0.25 × 0.5 + 0.5 × 1 + 0.2 × 2 + 0.05 × 4 = **1.225**. The life over the profile is therefore 64,000 ÷ 1.225 = **52,245 hours**, about **11.9 years** at 4,380 hours a year. By the doubling rule, the effective temperature is 55 + 10 × log₂(1.225) = **57.9 °C**, the same as the Arrhenius value in Chapter 2 to one decimal place.

```figure
type: bars
title: Expected life of FL-60's capacitors at constant core temperatures
unit: years
max: 16
caption: This is an illustration from the doubling rule, at 4,380 operating hours a year. The 2,000 h part is marginal over FL-60's profile; the 10,000 h part reaches the maker's calendar cap long before its formula life.
- 2,000 h part at 75 °C | 3.7
- 2,000 h part at 65 °C | 7.3
- 2,000 h part at 60 °C | 10.3
- * 2,000 h part over FL-60's profile | 11.9
- 2,000 h part at 55 °C | 14.6
- 10,000 h part over the profile, capped | 15
```

Against a 10-year design life, 11.9 years looks comfortable, but it is the life to the maker's end-of-life criterion for a typical part, not the life by which 90% of parts are still working. Chapter 6 will show that the spread of capacitor lives is substantial, so a typical life only 19% longer than the design life leaves a real fraction of drivers failing before ten years. The **10,000 hours at 105 °C** series in the same case size has a formula life over the profile of about 261,000 hours, which is to say it is limited by the maker's calendar cap of about 13 to 15 years rather than by temperature, and that comfortably exceeds the design life.

## Ripple current heats the core

The core temperature is not the air temperature around the capacitor. It is the air temperature plus the rise caused by the capacitor's own dissipation, ripple current squared times ESR, through the thermal resistance from core to surroundings.

This is an illustration. FL-60's bulk capacitor carries a ripple current of **0.8 A rms**, has an ESR of **0.15 Ω** when new, and has a thermal resistance from core to the air inside the driver of about **40 K/W**. Its dissipation is 0.8² × 0.15 = **0.096 W**, and its core sits about **3.8 K** above the surrounding air. By the doubling rule, that 3.8 K shortens life by a factor of 2^0.384 = **1.31**. Near the end of life, if the ESR has doubled, the rise is about **7.7 K** and the factor **1.70**, so the capacitor wears faster as it ages.

Two practical consequences follow. First, the core temperature must be measured or estimated from the capacitor's case temperature plus its ripple rise, not taken from the air in the enclosure. A thermocouple fixed to the top of the can, the hottest accessible point, with the maker's guidance on the core-to-case difference, gives a sound estimate; for characterising a design, makers and test laboratories sometimes fit a fine thermocouple inside a sample capacitor. Second, a capacitor with lower ESR or higher ripple rating runs cooler at the same ripple current, which is a second reason, besides the higher life rating, why long-life series often last longer in real circuits by more than their ratings suggest.

## Voltage, storage and other stresses

Temperature is the dominant stress on an electrolytic capacitor, but not the only one. Some makers give a voltage factor as well, crediting extra life when the working voltage is well below the rated voltage, and the factor differs between makers and series, so it should be taken from the specific data sheet and not borrowed. A conservative design simply leaves margin on voltage and takes no credit for it in the life calculation, which is what FL-60's designers did.

Storage matters too. A capacitor stored for a long time without voltage can lose some of its oxide layer, and makers give guidance on storage periods and on reforming capacitors that have been stored too long. For a product like FL-60, which may sit in a distributor's warehouse for a year before installation, the storage guidance belongs in the product's own shelf-life rules. And mechanical stresses, such as vibration on a board that is poorly supported, can break a capacitor's leads long before its electrolyte runs out, a mechanism that no temperature test will find.

### Reading the life section of a data sheet

A capacitor data sheet's life section repays careful reading, because its wording decides how the rated life can be used. The points to find are the rated temperature and the conditions of the life test, including whether rated ripple current was applied; the end-of-life criteria, as limits on capacitance change, ESR and leakage; any statement of the proportion of parts expected to meet the rated life; the life-extrapolation rule and the range over which the maker supports it; the maximum calendar life the maker will stand behind; and any voltage or ripple factors. A data sheet that says little about these points is itself information: the part's life is less well characterised, and the test must carry more of the burden of proof.

## The rule against the Arrhenius model

The doubling rule and the Arrhenius model with 0.7 eV give similar but not identical answers over FL-60's range, and the difference matters when choosing a test length.

```figure
type: compare
title: Acceleration from FL-60's 57.9 °C effective core temperature to a 105 °C test
cols: Acceleration factor | Test hours for 43,800 h of service
caption: Calculated from the doubling rule and from the Arrhenius model at 0.7 eV. The rule implies a steeper rise over this range, about 0.8 eV, so it gives the shorter test.
- Makers' doubling rule | 26.2 | 1,673
- * Arrhenius, Ea = 0.7 eV | 21.2 | 2,061
- Arrhenius, Ea = 0.5 eV | 8.9 | about 4,900
```

The business plans with the longer of the two test lengths, about 2,061 hours, because the shorter one rests on extrapolating the maker's rule to its very top, where Chapter 2 showed that the rule's implied activation energy is highest. Where the maker's data and a general model disagree, the more conservative answer is the safer one to plan with, and the maker's application engineers are the right people to ask which one their part follows.

## The error: the capacitor nobody measured

This is an illustration. The prototype driver has four electrolytic capacitors: the bulk capacitor after the rectifier, two in the output filter, and a small one in the control supply. When the team built the temperature profile, it fitted a thermocouple to the bulk capacitor, the largest and most obvious, and applied that profile to all four.

During the first driver life test, the earliest failures were not in the bulk capacitor. They were in one of the output filter capacitors, which sat beside the rectifier diodes' heat sink. A thermal survey with thermocouples on all four cans found that this capacitor ran about **12 K hotter** than the bulk capacitor at every operating point. Over FL-60's profile, shifted up by 12 K, the 2,000-hour part's life by the doubling rule falls from 52,245 hours to about **22,700 hours**, about **5.2 years**, inside the warranty period.

The redesign did three things. Every capacitor in the driver was changed to a 10,000-hour series. The output filter capacitor was moved away from the heat sink on the next board revision, removing most of the 12 K. And the driver's thermal survey now puts a thermocouple on every electrolytic capacitor and on every other part with a temperature-dependent life, and the life calculation uses the hottest.

```figure
type: checklist
title: Capacitor life checks for FL-60's driver
caption: The open item is this chapter's error. The life-limiting capacitor is the hottest one, which is not always the biggest.
- x Series life rating and its definition read from the data sheet | end-of-life criteria and the share of parts they describe
- x Core temperature from case temperature plus ripple rise | thermocouple on the can top
- x Profile averaged by rate | 57.9 °C effective
- x Maker's calendar cap applied | 13 to 15 years typical
- ? Every electrolytic capacitor measured | output filter capacitor 12 K hotter: 5.2 years
```

## How this applies to a small Australian business

Products sold into Australian outdoor and industrial settings run hot: sheds, plant rooms, roof spaces and enclosures in summer sun all push electronics well above the 25 °C at which they are often designed. For any product with a power supply, the electrolytic capacitors deserve a life calculation, and it is short: read the series rating, measure the hottest capacitor's case temperature in a realistic worst-case installation, estimate the profile of temperatures across a year, apply the maker's rule, and compare with the design life and the warranty. A longer-life capacitor series in the same footprint often costs little more and can change a marginal design into a comfortable one. Where the product is bought in, such as a driver or power supply, ask its supplier for the same calculation and the temperature it assumed.

## Exercise: the moved capacitor

After the board revision, the output filter capacitor runs about **3 K** hotter than the bulk capacitor instead of 12 K. Using the 10,000-hour part and FL-60's profile shifted up by 3 K, what does the doubling rule predict, and what limits the capacitor's life in practice?

**Worked answer.** Shifting every temperature in the profile up by 3 K divides the life by 2^0.3 = 1.23. The 10,000-hour part's profile life of 261,224 hours becomes about 261,224 ÷ 1.231 = **212,200 hours**, about **48 years** at 4,380 hours a year. That figure is meaningless as a prediction, because it is far beyond the maker's typical calendar cap of 13 to 15 years, and because other ageing processes take over long before. What limits the capacitor in practice is the calendar cap and the series' own data, both comfortably beyond FL-60's 10-year design life. The test in Chapter 7 is therefore designed to confirm that nothing else in the driver fails first, not to measure the capacitor's formula life.
