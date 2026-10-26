---
book: heat-exchangers-by-the-numbers
chapterSlug: multi-pass-exchangers-and-the-f-correction
order: 3
title: "Multi-pass exchangers and the F correction"
description: "Correct the log mean for multi-pass shell-and-tube exchangers: P, R and F, the limit near a temperature cross, shells in series, and catch an F of 0.9 assumed where 0.64 applied."
draft: false
---

Pure counterflow is the ideal arrangement, but most shell-and-tube exchangers do not achieve it. To keep tubes short and velocities high, the tube-side fluid usually makes two, four or more passes through the shell, turning round in the end channels, while the shell-side fluid crosses the bundle once from one end to the other. Half the tube passes then run against the shell flow and half with it. The exchanger behaves partly like counterflow and partly like parallel flow, and its effective mean temperature difference is less than the counterflow log mean. The reduction is expressed by a correction factor, F, which for most coolers is close to one and for close-approach duties can collapse.

This chapter defines the two temperature ratios that set F, works out F for OC-35, explains why F falls steeply as a duty approaches a temperature cross, and shows how shells in series or a different exchanger type restore it. The running case finds that the heat-recovery exchanger proposed in Chapter 2 was quoted as a single-shell, two-tube-pass design with an assumed F of 0.9, when the duty's actual F in that arrangement was about 0.64, so the quoted exchanger had about 70% of the area it needed.

## Two temperature ratios

The correction factor depends on two dimensionless ratios of the four terminal temperatures. Using t for the tube-side fluid and T for the shell-side fluid:

```figure
type: formula
title: P, R and the correction factor for one shell pass and an even number of tube passes
formula: P = (t_out − t_in) ÷ (T_in − t_in);   R = (T_in − T_out) ÷ (t_out − t_in);   ΔT_m = F × ΔT_lm,counterflow
caption: This is an illustration for OC-35, with the water in the tubes and the oil in the shell. F for a 1-shell, 2-or-more-tube-pass exchanger is calculated from the standard published formula in P and R, or read from a chart.
- P | Temperature effectiveness of the tube-side stream
- R | Ratio of the shell-side temperature change to the tube-side one, equal to C_tube ÷ C_shell
- F | Correction factor, at most 1
step: P = (34 − 29) ÷ (55 − 29) ≈ 0.192; R = (55 − 45) ÷ (34 − 29) = 2.0
step: F ≈ 0.975 for one shell pass with two or four tube passes
step: ΔT_m ≈ 0.975 × 18.39 ≈ 17.9 K
```

P measures how far the tube-side fluid is heated towards the shell fluid's inlet temperature: 0 means not at all, 1 would mean all the way. R is the ratio of the two streams' temperature changes, which is also the ratio of their heat capacity rates. For OC-35, P is small and F is close to one: the tube-side water is heated only a fifth of the way towards the oil's inlet temperature, so it hardly matters which way the passes run.

## Why F falls near a temperature cross

In a 1-shell, 2-pass exchanger, the second tube pass runs in parallel with the shell flow. Near the exchanger's outlet end, the tube fluid in that pass meets shell fluid that is already near its outlet temperature. If the duty asks the tube fluid to leave hotter than the shell fluid leaves, a temperature cross, part of the second pass can end up cooler than the shell fluid around it or, past a point, the shell fluid can even take heat back from the tube fluid. The effective driving force falls, F drops, and beyond a limiting value of P no amount of area can reach the duty in that arrangement.

The limit depends on R. For each R, there is a maximum P that a single 1-2 shell can approach with infinite area, and F falls very steeply as P approaches it. Designers commonly avoid F values below about 0.75 to 0.8, not only because the area grows, but because in that region F is so sensitive that a small change in flow, temperature or fouling sends the exchanger's performance off a cliff.

## The running case: the heat-recovery exchanger

This is an illustration. Chapter 2's heat-recovery proposal would heat parts-washer water from 20 °C to 48 °C with oil cooling from 55 °C to 45 °C. Taking the washer water in the tubes and the oil in the shell, P = (48 − 20) ÷ (55 − 20) = **0.80** and R = (55 − 45) ÷ (48 − 20) ≈ **0.357**. For that R, the largest P a single 1-2 shell can approach, with infinite area, is about **0.827**, a washer-water outlet of about 48.9 °C. The duty asks for 0.80, just short of the limit.

## The error: an F of 0.9 assumed

A supplier's first quotation offered a single-shell exchanger with two tube passes, sized with "a typical F of 0.9". At P = 0.80 and R = 0.357, the formula gives F ≈ **0.64**. The exchanger needed 0.9 ÷ 0.64 ≈ **1.42** times the area quoted: the quoted exchanger had about 70% of what the duty required. Worse, at P = 0.80 the duty sat close to the single shell's limit, where F changes rapidly, so even with the extra area the exchanger would have been unable to hold 48 °C once its tubes began to foul or the oil arrived a little cooler.

```figure
type: compare
title: Correction factor for the heat-recovery duty, by arrangement
cols: Correction factor F | Area relative to the quote at F = 0.9
caption: This is an illustration at P = 0.80 and R ≈ 0.357, with the same overall coefficient throughout. Splitting the duty over shells in series, or using a counterflow plate exchanger, brings F back towards one.
- One shell, two tube passes, as quoted | 0.64 | 1.42
- *Two shells in series | 0.94 | 0.96
- Three shells in series | 0.97 | 0.92
- Four shells in series | 0.985 | 0.91
- Plate exchanger, counterflow | About 1.0 | About 0.90
```

The check that caught it was simply calculating F from P and R rather than assuming it. The fix offered two choices: two smaller shells in series, which brings F to about 0.94 and puts each shell's duty well away from its limit, or a gasketed plate exchanger, whose flow is close to true counterflow and which suits clean washer water and filtered oil. The plant chose the plate exchanger, for its smaller size and its close approach, as Chapter 8 discusses. The general lesson is that F is a calculation, not a typical value, and that a duty near a temperature cross needs an arrangement chosen for it, not a standard shell with a hopeful factor.

## The cliff in numbers

The steepness of F near the limit is easiest to see by fixing R and stepping P. This is an illustration, for the heat-recovery duty's R of about 0.357 in a single 1-2 shell.

```figure
type: line
title: Correction factor F against P for one shell, two tube passes, R ≈ 0.357
x: Tube-side temperature effectiveness P
y: Correction factor F
legend: One 1-2 shell | A common minimum for design
ymin: 0.4
ymax: 1
caption: This is an illustration from the standard 1-2 formula. F is nearly one up to P of about 0.5, falls through about 0.79 at 0.75, and collapses towards the limiting P of about 0.827.
- 0.2 | 0.997 | 0.8
- 0.4 | 0.981 | 0.8
- 0.5 | 0.963 | 0.8
- 0.6 | 0.929 | 0.8
- 0.7 | 0.857 | 0.8
- 0.75 | 0.786 | 0.8
- 0.8 | 0.636 | 0.8
- 0.82 | 0.484 | 0.8
```

Between P of 0.75 and 0.80, a change of five hundredths in the duty's temperatures, F falls from about 0.79 to about 0.64; between 0.80 and 0.82, it falls to about 0.48. An exchanger designed at P = 0.80 that loses a little performance to fouling must raise its P to recover, which is exactly the direction in which F collapses. The curve is the reason designers keep single shells well to the left of the cliff, and it is worth drawing for any duty whose P is above about 0.6.

## Checking a quotation

A supplier's thermal rating of a shell-and-tube exchanger should show the four terminal temperatures, the number of shells and passes, the corrected mean temperature difference, the overall coefficient, clean and fouled, and the area, so that each can be checked. Two quick checks catch most problems. First, compute P and R from the terminal temperatures, and from them F for the arrangement offered; compare it with the quotation's. Second, multiply the quotation's U, area and corrected mean difference and compare the product with the duty. A quotation that does not show its F, or that uses a round number for it, has not been rated for the duty, only sized by rule of thumb. For OC-35, the checks take a minute: P ≈ 0.192, R = 2.0, F ≈ 0.975, and 349 × 5.6 × 17.9 ≈ 35.0 kW.

## Shells in series

Putting several 1-2 shells in series, with both fluids passing through them in turn, approaches counterflow as the number of shells grows. Each shell does part of the duty with a small P, where F is high and stable. Large heat-recovery duties are often built this way, sometimes as several shells stacked one above another. The number of shells needed is chosen so that each shell's F is comfortably above the commonly used minimum; the overall F then follows from the published formula for shells in series, or from the effectiveness–NTU method of Chapter 7, which handles any number of shells naturally.

Some shell designs achieve two shell passes in one shell by fitting a longitudinal baffle down its length, so the shell fluid goes down one half and back along the other. They behave like two shells in series, but the longitudinal baffle must seal well against the shell, or shell fluid leaks past it and the exchanger loses the counterflow it was built for.

## Which fluid goes where

The choice of which fluid flows in the tubes and which in the shell is made for practical reasons before F is calculated, and F is then checked for the result. Common rules place the dirtier or more corrosive fluid in the tubes, which are easier to clean and cheaper to make in expensive alloys; the higher-pressure fluid in the tubes, which resist pressure better than a large shell; and the more viscous fluid in the shell, where baffles create crossflow that raises its heat transfer coefficient. OC-35 follows all three: open tower water, which fouls, in the tubes; hydraulic oil, viscous and clean, in the shell.

## Baffles and leakage

On the shell side, **baffles**, plates across the bundle with a segment cut away, force the shell fluid to zigzag across the tubes, which raises its heat transfer coefficient and supports the tubes against vibration. They also mean that the shell fluid does not all take the path the simple model assumes. Some leaks through the clearances between the tubes and the baffle holes, some through the gap between the baffles and the shell, and some bypasses the bundle altogether in the space between the outer tubes and the shell wall. Those **leakage and bypass streams** carry fluid that does little heat transfer, and they lower both the shell-side coefficient and, by mixing fluid at different temperatures, the effective temperature difference. Rating methods used by exchanger makers account for each stream from the exchanger's actual clearances, which is why two exchangers with the same tube count, length and passes can perform differently.

For OC-35, whose oil-side coefficient controls its performance, as Chapter 4 shows, the shell-side construction matters more than anything on the tube side. Sealing strips that block the bypass lane and baffle clearances held to the construction standard's limits are details worth confirming on the drawings before an exchanger is ordered.

## F in other arrangements

Correction factors exist for other arrangements: crossflow with either or both fluids mixed, as in air-cooled exchangers; multiple shell passes; and combinations. Each is a formula or a chart in P and R. For plate exchangers with many plates in a simple counterflow arrangement, F is close to one, though their makers' rating methods account for the end plates and multi-pass plate arrangements. For any arrangement, the effectiveness–NTU method of Chapter 7 gives the same answer from a different starting point, and is easier when the outlet temperatures are what the designer wants to find.

## OC-35's corrected mean

This is an illustration. For OC-35 itself, with F ≈ 0.975, the corrected mean temperature difference is about 17.9 K, and with an overall coefficient of about 349 W/(m²·K), the area needed is 35,000 ÷ (349 × 17.9) ≈ **5.6 m²**. The correction cost only about 2.5% of area, because OC-35 is a cooler with a wide approach. On a summer day, with water arriving at 32 °C and leaving at 37 °C, P rises to about 0.22 and F falls only to about 0.96. In the half-water case of Chapter 1's exercise, where R falls to 1.0 and P rises to about 0.38, F is about 0.93. OC-35 stays comfortably in the flat part of the F curve in every case its data sheet lists, which is what a cooler with a wide approach should do, and why its single shell with four tube passes is the economical choice.

## Exercise: a hotter washer target in two shells

If the heat-recovery duty were asked to deliver washer water at 50 °C, from 20 °C, with the oil still cooling from 55 °C to 45 °C, what are P and R? Could a single 1-2 shell do it at all? Roughly what would two shells in series give?

**Worked answer.** P = (50 − 20) ÷ (55 − 20) ≈ **0.857** and R = 10 ÷ 30 ≈ **0.333**. For R ≈ 0.333, the single 1-2 shell's limiting P is about 2 ÷ (1 + R + √(1 + R²)) ≈ 2 ÷ (1.333 + 1.054) ≈ **0.838**, below the 0.857 the duty needs: no single 1-2 shell can do it, however large.

Two shells in series give an F of about 0.91 at these conditions by the series formula, workable but with less margin than the 48 °C case, and three shells about 0.96. A counterflow plate exchanger, with F close to one, is again the natural choice. The calculation shows that a 2 K increase in the target turned a difficult single-shell duty into an impossible one.
