---
book: on-site-power-and-heat-by-the-numbers
chapterSlug: the-diesel-cycle-and-the-standby-generator
order: 4
title: "The Diesel cycle and the standby generator"
description: "The air-standard Diesel cycle with its cutoff ratio, how it compares with the Otto cycle at equal and at real compression ratios, peak pressure, and what the model says about a standby set."
draft: false
---

A diesel engine compresses air alone, so hard that the air becomes hot enough to ignite fuel sprayed into it. No spark is needed and there is no mixture to knock, which lets diesels use much higher compression ratios than spark-ignition engines. The fuel burns as it is injected, while the piston is already moving down, so combustion happens over part of the stroke rather than at a point. The air-standard model of this is the Diesel cycle, in which heat is added at constant pressure instead of constant volume.

This chapter works through the Diesel cycle for the laundry's standby generator, shows how the cutoff ratio governs its efficiency, and compares it with the Otto cycle of Chapter 3 in two ways that give opposite answers. It then asks what the model can and cannot say about a standby set, and ends with an engine that appeared to be overstressed because it had been modelled as the wrong kind of engine.

## The Diesel cycle

The air-standard Diesel cycle has four reversible processes on a closed mass of air with constant specific heats:

1. **1 to 2, isentropic compression** through the compression ratio r = V₁ ÷ V₂.
2. **2 to 3, heat addition at constant pressure.** Fuel burns while the piston moves away from the top, and the volume grows by the **cutoff ratio** r_c = V₃ ÷ V₂.
3. **3 to 4, isentropic expansion** to the bottom of the stroke.
4. **4 to 1, heat rejection at constant volume.**

```figure
type: svg
title: The air-standard Diesel cycle on a pressure–volume diagram
alt: A pressure–volume diagram. From state 1 at large volume and low pressure a curve rises steeply to state 2 at small volume and high pressure. A horizontal line runs at constant pressure from state 2 to state 3, marked heat in and cutoff ratio. A curve falls from state 3 to state 4 at large volume, and a vertical line drops from 4 to 1, marked heat out. The enclosed area is shaded as net work.
caption: Not to scale. Heat is added at constant pressure (2 to 3) while the volume grows by the cutoff ratio, and rejected at constant volume (4 to 1). For the standby set the pressures at states 1, 2 and 3 are 100, 5,720 and 5,720 kPa absolute.
viewbox: 0 0 520 320
body:
<path class="ln" d="M60 290V20M60 290H500"/>
<path class="fs" d="M90 60H160Q230 190 440 255L440 280Q200 250 90 60Z"/>
<path class="la draw" pathLength="1" d="M90 60H160"/>
<path class="li" d="M160 60Q230 190 440 255"/>
<path class="li" d="M440 255V280"/>
<path class="li" d="M440 280Q200 250 90 60"/>
<text class="txb" x="72" y="64">2</text>
<text class="txb" x="166" y="54">3</text>
<text class="txb" x="448" y="252">4</text>
<text class="txb" x="448" y="296">1</text>
<text class="txa" x="186" y="62">heat in at constant p</text>
<text class="txs" x="452" y="272">heat out</text>
<text class="txb" x="230" y="230">net work</text>
<path class="lf dsh" d="M90 60V290M160 60V290"/>
<text class="txs" x="82" y="312">V₂</text>
<text class="txs" x="146" y="312">V₃ = r_c V₂</text>
<text class="txs" x="66" y="16">pressure p</text>
<text class="txs" x="420" y="312">volume V</text>
```

The efficiency of the cycle on the cold-air standard is:

η = 1 − [1 ÷ r^(k − 1)] × [(r_c^k − 1) ÷ (k (r_c − 1))]

The first bracket is the Otto efficiency's loss term. The second bracket is always greater than 1 when r_c is greater than 1, so at the same compression ratio a Diesel cycle is always less efficient than an Otto cycle. The more fuel is injected, the longer the cutoff and the bigger the penalty, because heat added later in the stroke is expanded through a smaller volume ratio.

## The running case: the standby set

This is an illustration. The laundry has a 500 kVA diesel standby generator, rated at about 400 kW at a power factor of 0.8, which starts automatically if the grid supply fails and is test-run monthly. For the model, the engineer takes a compression ratio of 18, a cutoff ratio of 2 at full load, and air at 100 kPa absolute and 40 °C at the start of compression, as if the engine were not turbocharged. Air has k = 1.4 and R = 0.287 kJ/kg·K, so c_p = 1.0045 and c_v = 0.7175 kJ/kg·K.

```figure
type: formula
title: Air-standard Diesel cycle for the standby set, r = 18, r_c = 2
formula: T₂ = T₁ × r^(k − 1);   p₂ = p₁ × r^k
formula: T₃ = T₂ × r_c;   q_in = c_p (T₃ − T₂)
formula: T₄ = T₃ × (r_c ÷ r)^(k − 1);   q_out = c_v (T₄ − T₁)
caption: This is an illustration on the cold-air standard, matching the Air-Standard Otto and Diesel Cycle Check in Diesel mode. In this mode the heat added follows from the cutoff ratio, so the tool's heat-added input is not used.
- T₁, p₁ | 313.15 K, 100 kPa absolute
- r, r_c | 18 and 2
step: State 2: T₂ = 313.15 × 18^0.4 = 995.1 K (721.9 °C); p₂ = 100 × 18^1.4 = 5,720 kPa
step: State 3: T₃ = 995.1 × 2 = 1,990.2 K (1,717 °C); p₃ = 5,720 kPa
step: q_in = 1.0045 × (1,990.2 − 995.1) = 999.6 kJ/kg; T₄ = 1,990.2 × (2 ÷ 18)^0.4 = 826.4 K
step: q_out = 0.7175 × (826.4 − 313.15) = 368.3 kJ/kg; w_net = 631.3 kJ/kg
step: η = 631.3 ÷ 999.6 = 63.16%; MEP = 744 kPa
```

The [Air-Standard Otto and Diesel Cycle Check](/tools/otto-diesel-cycle-check/), set to the Diesel cycle, gives the same results: an efficiency of 63.16%, net work 631.3 kJ/kg, a mean effective pressure of 744 kPa, a peak pressure of 5,720 kPa and a peak temperature of 1,717 °C, and a Carnot efficiency of 84.27% between 40 °C and the peak temperature. It also checks the peak pressure against an allowable value. If the cutoff ratio entered is not smaller than the compression ratio, the tool refuses to calculate, because the gas cannot expand beyond the cylinder.

Notice that in a Diesel cycle the peak pressure is simply the end-of-compression pressure, p₂. Adding more fuel lengthens the cutoff and raises the peak temperature, but does not raise the peak pressure in the model. Real diesels do show a pressure rise during combustion, because some fuel burns very quickly as it ignites, which is why real engines are often modelled with a dual cycle, part constant volume and part constant pressure.

### The dual cycle

The dual cycle splits the heat: part is added at constant volume at the top of the stroke, raising the pressure, and the rest at constant pressure as the piston moves away. The BIZOMAT cycle check models only the pure Otto and Diesel cases, but the dual cycle is simple to work by hand and sits between them.

This is an illustration. Suppose the standby set's combustion raises the pressure from 5,720 kPa to a limit of 8,000 kPa at constant volume, and the rest of the same 999.6 kJ/kg is added at constant pressure. The constant-volume part takes the temperature from 995.1 K to 995.1 × 8,000 ÷ 5,720 = 1,391.8 K and adds 0.7175 × 396.7 = 284.6 kJ/kg. The remaining 715.0 kJ/kg at constant pressure takes it to 1,391.8 + 715.0 ÷ 1.0045 = 2,103.5 K, a cutoff ratio of 2,103.5 ÷ 1,391.8 = 1.51. Expansion to the bottom of the stroke ends at 2,103.5 × (1.51 ÷ 18)^0.4 = 780.9 K, so 0.7175 × (780.9 − 313.15) = 335.6 kJ/kg is rejected and the net work is 664.0 kJ/kg, an efficiency of **66.43%**.

That lies between the Diesel's 63.16% and the Otto's 68.53% for the same heat and compression ratio, as it must. The engineering trade-off is visible in one line: the more heat added at constant volume, the higher the efficiency and the higher the peak pressure. Engine designers choose injection timing and rate to sit at the point where the peak pressure stays inside the engine's structural limit.

## The cutoff ratio and load

```figure
type: bars
title: Air-standard Diesel efficiency against cutoff ratio, r = 18
unit: %
max: 80
caption: Each bar uses the formula above with k = 1.4. A short cutoff, as at light load, approaches the Otto cycle's 68.53% at the same compression ratio; a long cutoff, as at heavy load, costs efficiency.
- Otto cycle at r = 18, for reference | 68.53
- r_c = 1.2 | 67.32
- r_c = 1.5 | 65.65
- * r_c = 2, the standby set at full load | 63.16
- r_c = 2.5 | 60.94
- r_c = 3 | 58.91
```

In the model, a diesel at light load, injecting little fuel and so having a short cutoff, is more efficient than at full load. At a cutoff ratio of 1.3, the tool gives 66.74%, but only 200.1 kJ/kg of net work and an MEP of 236 kPa. Real diesel generators behave the opposite way: their fuel per kilowatt-hour is lowest near full load and rises steeply at light load. The model misses the reason. Friction, pumping and the engine's own auxiliaries take roughly the same power whatever the load, so at light load they consume a large share of a small output. The air-standard cycle has no friction, so it cannot show this. It is a reminder that an ideal cycle explains the shape of a trend only where the ideal includes the effect causing it.

## Otto against Diesel: two comparisons, two answers

Comparing the cycles at the same compression ratio favours the Otto cycle. Comparing them at the compression ratios each kind of engine can actually use favours the Diesel.

```figure
type: compare
title: Otto and Diesel cycles compared, air at 100 kPa and 40 °C at the start of compression
rowhead: Case
cols: Heat added | Efficiency | Net work | Peak pressure | Peak temperature
caption: This is an illustration from the Air-Standard Otto and Diesel Cycle Check, cold-air standard. At equal compression ratio and equal heat, the Otto cycle wins on efficiency but its peak pressure is 2.4 times the Diesel's. At their practical ratios, a Diesel at 18 matches a spark-ignition engine at 12 on efficiency with a far lower peak pressure.
- Otto, r = 18 | 999.6 kJ/kg | 68.53% | 685 kJ/kg | 13,728 kPa | 2,115.1 °C
- * Diesel, r = 18, r_c = 2 | 999.6 kJ/kg | 63.16% | 631.3 kJ/kg | 5,720 kPa | 1,717 °C
- Otto, r = 12 | 999.6 kJ/kg | 62.99% | 629.6 kJ/kg | 8,581 kPa | 1,966.1 °C
- Diesel, r = 12, r_c = 2 | 849.9 kJ/kg | 56.67% | 481.7 kJ/kg | 3,242 kPa | 1,419.1 °C
```

The first comparison is the textbook one, and it is true but not useful: no spark-ignition engine runs at 18, because the mixture would knock (Chapter 3). The useful comparison is the second. A spark-ignition engine limited to about 12 by knock and a diesel running at 18 come out almost level in the model, 62.99% against 63.16%. In real engines, diesels have usually had an efficiency advantage over spark-ignition engines of similar size, helped by running without a throttle, while large lean-burn gas engines have closed much of the gap by using strong ignition and high boost. For a cogeneration plant the fuel available and its price usually decide the choice before the cycle does.

### Turbocharged diesels and peak pressure

Boosting the intake raises all pressures in proportion. This is an illustration. With the intake at 250 kPa and 50 °C, the same r = 18 and r_c = 2 give a peak pressure of 14,300 kPa, still within the 15,000 kPa allowable the engineer entered for the check, while the efficiency stays at 63.16%. Real engines limit boost and injection timing to keep the actual peak cylinder pressure within what the engine was designed for, and the maker's figure, not the tool's default, is the one to check against.

## What the model says about a standby set

A standby set is built for a different life from a cogeneration engine. Generator sets are rated for their application: international standard ISO 8528-1 sets out how reciprocating-engine generating sets are rated for standby, prime and continuous duty, and a set rated for standby is meant for limited hours when the normal supply has failed. Running it for thousands of hours a year as a cogeneration unit would exceed that rating, and it would also burn diesel, usually a more expensive fuel per unit of energy than natural gas.

### Reading the data plate

A generator's rating in kilovolt-amperes (kVA) describes the current its alternator can carry; the power its engine must supply is in kilowatts. The two are linked by the power factor of the load. At the power factor of 0.8 that ratings commonly assume, a 500 kVA set delivers 500 × 0.8 = 400 kW of electrical power, and its engine must provide that plus the alternator's losses. A load with a lower power factor, such as large motors starting, can reach the alternator's current limit before the engine reaches its power limit. The laundry's standby set happens to have the same electrical output, 400 kW, as the gas engine offered for cogeneration, which makes the two easy to confuse in conversation and easy to tell apart on their rating plates.

The cycle model adds two practical points for the laundry:

- **Monthly test runs at light load.** The model's high efficiency at short cutoff hides the real engine's poor part-load performance. Diesel engines run for long periods at light load can also collect unburnt fuel and carbon in the exhaust system, a problem often called wet stacking. Many makers recommend testing under a substantial load, either the site's own load or a temporary load bank, for at least part of each test.
- **The cogeneration engine is not a standby supply.** A gas engine running in parallel with the grid will normally shut down when the grid fails, by design. Making it support the site during an outage needs protection, controls and approval from the network service provider for islanded operation. The laundry keeps its diesel set for that duty.

## The error: an engine that seemed overstressed

This is an illustration. Preparing the site's equipment register, an engineer modelled the standby set with the cycle tool to record a peak cylinder pressure. Working quickly, they left the tool in its default Otto mode, entered a compression ratio of 18 and typed in 999.6 kJ/kg as the heat added, which they had worked out from the fuel consumption. The tool returned an efficiency of 68.53%, a peak pressure of **13,728 kPa** and the verdict **peak pressure over limit** against the default 12,000 kPa. The engineer flagged the engine as possibly overstressed.

The reviewer saw two problems. A compression-ignition engine burns its fuel during injection, not at the top of the stroke, so it must be modelled as a Diesel (or dual) cycle; the Otto model, adding all the heat at constant volume, inflated the peak pressure by a factor of 13,728 ÷ 5,720 = 2.4. And the allowable pressure had been left at the tool's default, which is a placeholder for the user to replace, not a property of any engine. Re-run in Diesel mode with a cutoff ratio of 2, the same engine gave 5,720 kPa. The register now records the maker's published maximum cylinder pressure, where available, and notes that the air-standard figure is a model result.

## How this applies to a small Australian business

Many sites own a diesel standby set and know little about it beyond its kVA rating. The Diesel cycle explains why it uses a high compression ratio and why it is efficient at full load and poor at light load. Three practical steps follow:

1. Know its rating class and do not use a standby-rated set for prime or continuous running.
2. Test it under real load, as its maker recommends, and log fuel used and hours, so that its condition is known before it is needed.
3. Keep it separate in any cogeneration plan. A gas engine in parallel with the grid is an energy-saving device; the standby set is a resilience device, and connecting either to the site's switchboard involves licensed electrical work and the network service provider's requirements.

Fuel storage for diesel is subject to dangerous goods and environmental rules in each state, which the site's fuel supplier and the relevant regulator can explain.

## Exercise: a smaller cutoff

At half load the standby set injects about half the fuel. Taking the heat added as half of 999.6 kJ/kg, find the cutoff ratio, the air-standard efficiency and the net work, with r = 18 and the same starting state.

**Worked answer.** T₂ is unchanged at 995.1 K. Half the heat is 499.8 kJ/kg, so T₃ = 995.1 + 499.8 ÷ 1.0045 = 1,492.6 K and the cutoff ratio is 1,492.6 ÷ 995.1 = **1.50**. The efficiency formula gives 1 − 18^−0.4 × (1.5^1.4 − 1) ÷ (1.4 × 0.5) = **65.65%**, matching the bar in the figure above, and the net work is 0.6565 × 499.8 = **328.1 kJ/kg**.

The model therefore predicts a slightly better efficiency at half load than at full load. The real set will do worse at half load, because friction and its own auxiliaries take a larger share of half the output, and the maker's fuel consumption table at 50% load is the figure to use for any running-cost estimate.
