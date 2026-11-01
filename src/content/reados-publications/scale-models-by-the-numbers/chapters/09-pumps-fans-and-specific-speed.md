---
book: scale-models-by-the-numbers
chapterSlug: pumps-fans-and-specific-speed
order: 9
title: "Pumps, fans and similarity: affinity laws and specific speed"
description: "Derive the affinity laws from dimensionless groups, apply them to a variable-speed pump and a ventilation fan, classify machines by specific speed, and see why model pump efficiency is stepped up."
draft: false
---

Pumps and fans are the most widely used application of similarity in engineering, and most people who use the affinity laws never think of them as scaling laws. They are. Flow proportional to speed, head to its square and power to its cube are exactly what Chapter 2's pump groups predict when a machine of fixed geometry runs at a different speed, and the same groups predict what happens when the whole machine is made bigger or smaller. A specific speed number on a pump data sheet is a dimensionless group with the impeller size removed.

This chapter derives the affinity laws from those groups, applies them to the PS-3 pumps on variable-speed drives and to the station's ventilation fan, shows how specific speed classifies a machine, and explains why a pump maker's model test does not give the full-size efficiency directly. It ends with an affinity-law prediction that was mistaken for an operating point.

## The pump groups again

Chapter 2 reduced the variables of a centrifugal pump (flow Q, energy per unit mass g H, shaft power P, rotational speed n, impeller diameter D, density ρ and viscosity μ) to four groups:

- flow coefficient φ = Q ÷ (n D³);
- head coefficient ψ = g H ÷ (n² D²);
- power coefficient Π = P ÷ (ρ n³ D⁵);
- Reynolds number Re = ρ n D² ÷ μ.

The efficiency is a fifth group but not an independent one, since η = ρ g Q H ÷ P = φ ψ ÷ Π. For a family of geometrically similar pumps, each operating point is fixed by its flow coefficient. If the Reynolds number has little effect, the head coefficient, power coefficient and efficiency at that flow coefficient are the same for every member of the family, at every size and speed. That single statement contains all the affinity laws.

## The affinity laws

For one pump at two speeds, D is fixed. Equal flow coefficients mean Q ∝ n. Equal head coefficients then mean H ∝ n², and equal power coefficients mean P ∝ n³. The two operating points are called similar points, and they lie on a parabola through the origin of the head–flow plot, H ∝ Q².

For two geometrically similar pumps at the same speed, n is fixed and D changes. Equal coefficients then give Q ∝ D³, H ∝ D² and P ∝ D⁵. A pump half the size of another, of the same design and at the same speed, delivers an eighth of the flow at a quarter of the head for a thirty-second of the power.

```figure
type: formula
title: The affinity laws from the pump groups
formula: Q₂ ÷ Q₁ = (n₂ ÷ n₁) × (D₂ ÷ D₁)³
formula: H₂ ÷ H₁ = (n₂ ÷ n₁)² × (D₂ ÷ D₁)²
formula: P₂ ÷ P₁ = (n₂ ÷ n₁)³ × (D₂ ÷ D₁)⁵
caption: Exact for geometrically similar machines at equal flow coefficient when Reynolds-number effects are negligible. Impeller trimming changes only the diameter, not the whole geometry, so trimming estimates are approximate.
- n | rotational speed
- D | impeller diameter, for geometrically similar machines
step: PS-3 duty pump from 1,450 to 1,300 rpm: speed ratio 0.8966
step: Flow 1,620 × 0.8966 = 1,452 m³/h; head 18 × 0.8038 = 14.47 m
step: Power 96.7 × 0.7207 = 69.7 kW at the similar point
```

Impeller trimming is often treated with the same laws, flow in proportion to diameter and head to its square. But trimming changes the diameter without changing the eye, the blade angles or the casing, so a trimmed impeller is not geometrically similar to the original. The trimming laws are a useful approximation for modest trims and become unreliable for large ones, which is why maker's trimmed-impeller curves should be used when they exist.

## PS-3's pumps on variable-speed drives

This is an illustration. The station designer is considering variable-speed drives so that the duty pumps can match smaller storms without frequent starts. The [pump affinity tool](/tools/pump-affinity/) applies the laws above to a present flow, head and shaft power at a present speed and impeller diameter, and gives the new flow, head and power at a new speed or diameter, with the power saving and a reminder that static head moves the real operating point. For one duty pump at 1,620 m³/h, 18 m and 96.7 kW at 1,450 rpm, slowed to 1,300 rpm, it gives:

- new flow **1,452.4 m³/h**;
- new head **14.47 m**;
- new power **69.69 kW**, a saving of 27.0 kW, or 27.9%.

Those figures describe the similar point: the point on the slowed pump's curve that corresponds to the original duty point. They are correct as a description of the pump. Whether the pump actually operates there depends on the system it is pumping into, and that is where the error at the end of this chapter begins.

## Fans follow the same laws

A fan is a pump for air, and the same groups apply with pressure in place of ρ g H. At fixed size, flow scales with speed, pressure with its square and power with its cube. These are the fan laws.

The PS-3 station has a ventilation fan for its dry well, delivering 1.5 m³/s against a fan total pressure of 300 Pa at 1,000 rpm with an efficiency of 60%. A new electrical room is to be ventilated from the same fan, raising the required flow to 1.8 m³/s. The [fan duty, fan laws and belt drive tool](/tools/fan-drive-sizing/) gives the air and shaft power at the present duty, the speed, pressure and shaft power for the new flow by the fan laws, the motor power with belt losses and a margin and the next standard motor rating, and the fan pulley for a given motor speed and pulley. With a 95% efficient belt drive, a 15% motor margin and a 1,450 rpm motor with a 150 mm pulley, it gives:

- present air power 0.45 kW and shaft power 0.75 kW;
- new speed **1,200 rpm**, new pressure **432 Pa** and new shaft power **1.30 kW**;
- motor power needed 1.57 kW, so a **2.2 kW** motor, with a fan pulley of **181 mm**.

The tool's own note matters as much as its numbers: the fan laws assume a system without static pressure, where the resistance rises as the square of the flow. A ventilation system of ducts and grilles is close to that. A system with a fixed back-pressure is not, for the same reason as the pump in the next section.

```figure
type: compare
title: PS-3's ventilation fan at its present and new duty
rowhead: Quantity
cols: Present | New | Fan law
caption: Calculated with the fan duty, fan laws and belt drive tool. The flow rises 20%, so speed rises 20%, pressure 44% and shaft power 73%; the motor and drive are rechecked for the higher speed.
- Flow | 1.5 m³/s | 1.8 m³/s | ratio 1.2
- Speed | 1,000 rpm | 1,200 rpm | 1.2
- Fan total pressure | 300 Pa | 432 Pa | 1.2² = 1.44
- * Shaft power | 0.75 kW | 1.30 kW | 1.2³ = 1.728
- Motor rating | — | 2.2 kW | with belt losses and 15% margin
```

## Specific speed

The flow and head coefficients both contain the impeller diameter. Combining them to eliminate D gives a group that depends only on the duty and the speed:

Ω_s = ω √Q ÷ (g H)^¾,

with ω in radians per second. It is the same for every member of a geometrically similar family at its best-efficiency point, so it characterises the shape of the machine rather than its size. Low values belong to narrow radial-flow impellers that make high head at low flow; high values belong to axial propellers that move large flows at low head; mixed-flow designs lie between.

For a PS-3 duty pump at its design point, ω = 1,450 × 2π ÷ 60 = 151.8 rad/s, and Ω_s = 151.8 × √0.45 ÷ (9.80665 × 18)^¾ = **2.10**. Pump makers more often quote a dimensional version, n_q = n √Q ÷ H^¾ with n in rpm, Q in m³/s and H in m, which for PS-3 is 1,450 × 0.6708 ÷ 8.739 = **111**. The two are related by n_q = 52.9 × Ω_s. Because the dimensional version depends on its units, a specific speed quoted without them, or from a data sheet using US customary units, can differ by a large factor; always check which is meant. PS-3's value sits in the range normally associated with mixed-flow pumps, consistent with the vertical mixed-flow pumps chosen for a high-flow, moderate-head stormwater duty.

## Model pump tests and efficiency step-up

Large pumps and turbines are often developed by testing a geometrically similar model. Flow, head and power transfer through the affinity laws, but efficiency does not transfer unchanged. A small machine has relatively larger running clearances, relatively rougher surfaces and a lower Reynolds number, all of which raise its losses. Its efficiency is therefore lower than that of the full-size machine at the similar point, and the difference must be added back, a process called step-up.

Empirical step-up formulas have been used for about a century. Moody's original form, (1 − η_p) ÷ (1 − η_m) = (D_m ÷ D_p)^¼, says that the losses fall as the quarter power of the size ratio; later variants use other exponents and add Reynolds-number terms. This is an illustration: a 1:4 model achieving 78% would, by the quarter-power form, imply 1 − 0.22 × 0.25^¼ = 84.4% at full size, or 83.3% with an exponent of 0.2. The spread between those two answers is the reason formal acceptance tests of hydraulic machines follow a standard method. IEC 60193, which governs model acceptance tests of hydraulic turbines and storage pumps, sets out how efficiency is scaled and how much of the step-up can be credited. Its values are not quoted here.

The same reasoning explains two effects that catch out users of small pumps. First, the affinity laws hold less well for small pumps over a wide speed range, because their Reynolds numbers are lower and their efficiency falls as speed falls, so the power at low speed is a little higher than the cube law predicts. Second, pumping a liquid much more viscous than water lowers the pump Reynolds number by a large factor, and head, flow and efficiency all fall. Corrections for viscous liquids are published by pump industry bodies and makers, and should be used whenever the liquid's kinematic viscosity is well above water's. Neither effect is visible in the affinity laws themselves, because both live in the fourth group, the Reynolds number, that the laws assume can be ignored.

## The error: the similar point taken as the operating point

This is an illustration. The first energy study for the variable-speed option took the pump affinity tool's result at 1,300 rpm, 1,452 m³/h at 14.47 m and 69.7 kW, as the pump's new operating point, and concluded that each duty pump could still handle 90% of its design flow at 72% of its design power. The study's energy savings and its assessment of storm capacity both rested on that assumption.

The station designer pointed out that PS-3 does not pump into a pure friction system. About 12 m of its 18 m design head is static lift from the wet well to the outfall, which the pump must overcome at any flow. With the system's 6 m of friction rising as the square of the flow, the system curve is H = 12 + 29.6 Q². Using an illustrative pump curve that passes through the design point with a shut-off head of 24 m, H = 24 × (n ÷ 1,450)² − 29.6 Q², the slowed pump meets the system at **0.351 m³/s (1,263 m³/h) and 15.6 m**, not at the similar point.

```figure
type: compare
title: PS-3 duty pump at 1,300 rpm: similar point against operating point
rowhead: Quantity
cols: Similar point (affinity laws) | Operating point (with 12 m static lift) | Difference
caption: Illustrative pump curve H = 24 (n ÷ 1,450)² − 29.6 Q² and system curve H = 12 + 29.6 Q². The affinity laws move along a parabola through the origin; with static lift, the system curve does not pass through the origin, so the real flow falls further.
- Flow | 1,452 m³/h | 1,263 m³/h | similar point 15% high
- Head | 14.47 m | 15.6 m | operating head higher
- Share of design flow | 90% | 78% | storm capacity overstated
```

The affinity tool had done exactly what it says: it gave the similar point, and its static-head check warned that a system with static head needs the curves plotted. The study had skipped that step. Rerun with the curves, the variable-speed option still saved energy at part flows, but each pump at 1,300 rpm delivered only 78% of its design flow, and the minimum useful speed was found where the pump's shut-off head at reduced speed approaches the 12 m static lift. [Centrifugal Pumps by the Numbers](/reados/publications/centrifugal-pumps-by-the-numbers/affinity-laws-and-speed-control/) works through speed control against static head in detail.

## How this applies to a small Australian business

The affinity and fan laws are among the most useful scaling laws in plant engineering, and among the most misused. They are reliable for the machine itself: what the pump or fan will do at a new speed at the similar point. They are not a substitute for the system curve. Any business considering a variable-speed drive, a bigger pulley or a faster fan should plot the machine's curve at the new speed against the system's curve, including any static lift or fixed back-pressure, before relying on a flow or a saving. And when a supplier quotes a specific speed, ask for its units.

## Exercise: a smaller pump of the same design

The pump maker offers a pump of the same hydraulic design as PS-3's, with every dimension halved, for a small auxiliary sump. At the same speed of 1,450 rpm, what flow, head and shaft power would it give at its similar point, ignoring Reynolds-number effects? What is its specific speed, and what would a step-up formula say about its efficiency compared with the full-size pump's?

**Worked answer.** With D halved at the same speed, Q scales as D³, H as D² and P as D⁵. The flow is 0.45 ÷ 8 = **0.0563 m³/s**, the head 18 ÷ 4 = **4.5 m** and the power 96.7 ÷ 32 = **3.02 kW**. The specific speed is unchanged at **Ω_s = 2.10**, since geometric similarity is exactly what keeps it constant; check: 151.8 × √0.0563 ÷ (9.80665 × 4.5)^¾ = 2.10. The smaller pump will be less efficient than 82%, because its losses are relatively larger, so its real power at that duty will be somewhat above 3.02 kW; by the quarter-power step-up formula applied in reverse, 1 − 0.18 × 2^¼ = 78.6%, about 3.4 percentage points lower.
