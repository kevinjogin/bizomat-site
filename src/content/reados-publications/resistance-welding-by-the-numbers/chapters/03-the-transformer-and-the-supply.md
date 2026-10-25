---
book: resistance-welding-by-the-numbers
chapterSlug: the-transformer-and-the-supply
order: 3
title: "The transformer and the supply"
description: "Work out the secondary voltage, kVA, primary current and duty cycle of a spot welder, and what it asks of the workshop's electrical supply."
draft: false
---

A spot welder needs thousands of amperes at a few volts. The workshop supply offers a few hundred amperes at most, at 240 or 415 volts. The welding transformer bridges the two: it trades voltage for current, so that a moderate primary current at mains voltage becomes a very large secondary current at a voltage low enough to be safe across the electrodes. Understanding the transformer explains most of what a resistance welder asks of the building's electrical installation, and why the machine can carry a load that would burn out an ordinary transformer of the same size.

This chapter sizes the cabinet spot welder's transformer and supply, compares it with the giant machines of 1918, and shows how duty cycle sets the thermal load.

## Trading voltage for current

An ideal transformer keeps the product of voltage and current the same on both sides, apart from losses:

**V₁ × I₁ ≈ V₂ × I₂**

The ratio of primary turns to secondary turns sets the voltage ratio. A welding transformer typically has one or a few turns of heavy copper on the secondary, often a single water-cooled loop, and many turns on the primary. Hamilton and Oberg recorded in 1918 that welding transformer secondaries gave from one to seven volts, with three to five volts usual, adjusted by tapping the primary winding or by a choke regulator in the primary circuit.

The secondary voltage needed is set by the impedance of the whole secondary loop: the transformer secondary, the arms or horns, the electrode holders, the electrodes and the work. Because the loop encloses an area through which the alternating current's magnetic field passes, it has inductive reactance as well as resistance, and on a machine with a deep throat the reactance often dominates. That is why the depth and width of the throat matter so much: a bigger loop has more reactance and needs more voltage for the same current.

```figure
type: formula
title: Secondary voltage, kVA and primary current for the cabinet welder
formula: V₂ = I₂ × Z;  kVA = V₂ × I₂ ÷ 1,000;  I₁ = kVA × 1,000 ÷ V₁
caption: This is an illustration. Z is the impedance of the whole secondary loop with the work in place; the machine is connected across two lines of the 415 V supply.
- I₂ | welding current, 9,000 A
- Z | secondary loop impedance, 0.50 mΩ
- V₁ | supply voltage across the primary, 415 V
step: V₂ = 9,000 × 0.000 50 = 4.5 V
step: kVA = 4.5 × 9,000 ÷ 1,000 = 40.5 kVA
step: I₁ = 40,500 ÷ 415 ≈ 97.6 A during the weld
```

## The cabinet welder

This is an illustration. The shop's pedestal spot welder for the cabinet body has a 600 mm throat and is connected across two lines of the three-phase 415 V supply, which is typical for single-phase welders in Australian workshops. With the work in place, the secondary loop impedance is about 0.50 mΩ. To drive 9,000 A, the transformer must deliver 4.5 V on its secondary, which is 40.5 kVA during each weld.

The turns ratio needed is 415 ÷ 4.5 ≈ 92 to 1, and the primary current during the weld is about 97.6 A. That current flows for only 0.20 s per weld, but it flows as a sudden step every time the welder fires.

The power factor of a resistance welder is usually poor, because of the secondary loop's reactance. Suppose the real power drawn during the weld is about 28 kW. Then the power factor is 28 ÷ 40.5 ≈ 0.69, and the supply must carry the full 97.6 A even though only 28 kW of real power is being used. Some of the 28 kW becomes heat in the weld; the rest is lost in the transformer and in the copper of the secondary loop.

## Short-time ratings: the 1918 shipyard machines

Hornor described the heavy spot welders built in 1918 and 1919 to speed American shipbuilding, where spot welding was proposed to replace some riveting of steel plate. The transformer for the smaller semi-portable machine, with a 12-inch throat, was rated at 265 kVA at 440 volts and 60 cycles; the 27-inch machine's transformer at 350 kVA. A large stationary duplex machine with a six-foot throat had two transformers of 450 kVA each at 500 volts, yet each measured only about 11 by 16 by 18 inches.

The duplex machine could produce 50,000 amperes on its secondaries while drawing 1,800 amperes on the primaries. Those figures show the same trading of voltage for current as the cabinet welder, on a much larger scale:

- current ratio, 50,000 ÷ 1,800 ≈ **27.8**;
- secondary voltage, 450 kVA ÷ 50,000 A = **9 V** for each transformer;
- primary demand, 1,800 A × 500 V = **900 kVA** for the pair.

Hornor explained the apparent paradox of such small transformers carrying such large loads: each weld lasted only seconds, too briefly for the overload to damage the windings, and water cooling removed the heat. Resistance welding transformers are rated for intermittent duty for exactly this reason.

```figure
type: compare
title: The cabinet welder and a 1918 shipyard spot welder
cols: Cabinet welder | 1918 duplex machine
caption: This is an illustration for the cabinet welder. The 1918 figures are as reported by Hornor, for each of the two transformers at 500 V; the secondary voltage is derived from them.
- Supply voltage | 415 V | 500 V
- Secondary current | 9,000 A | 50,000 A
- Secondary voltage | 4.5 V | 9 V
- Rating during the weld | 40.5 kVA | 450 kVA each
- Weld time per spot | 0.20 s | 10 s in the thick-plate lug tests
```

## The secondary loop and the work inside it

Because the secondary loop is a single turn carrying a very large alternating current, its geometry has a large effect on the current delivered. Two effects catch shops out.

The first is throat size. A deeper or wider throat encloses more area, so the loop has more inductive reactance. This is an illustration. If the shop moved the cabinet work to a second machine with a 900 mm throat whose loop impedance is 0.70 mΩ, the same 9,000 A would need 9,000 × 0.000 70 = 6.3 V on the secondary and 6.3 × 9,000 ÷ 1,000 = 56.7 kVA, about 40% more than the 600 mm machine. If that machine's transformer were set on the same tap as the first, it would deliver only about 0.50 ÷ 0.70 × 9,000 ≈ 6,400 A, far below the window.

The second is steel inside the throat. When a large steel part, such as a cabinet side panel, is pushed into the throat, it sits inside the loop's magnetic field and increases the loop's reactance. The current at the electrodes falls as more steel enters the throat, so welds made deep inside a cabinet can be weaker than those made near the edge, with exactly the same settings. Constant-current controls compensate for this automatically; older controls do not, and setters learn to raise the heat for welds deep in the throat, which is a source of error if it is not written into the schedule.

For both reasons, a schedule belongs to a particular machine with a particular throat and the work in its normal position. Moving a job to another machine means checking the current with a meter and repeating at least a short lobe trial.

## Duty cycle and thermal current

Heating of the transformer windings depends on I² averaged over time. A machine that welds for 0.20 s and then waits is heated far less than one that conducts continuously. The duty cycle is the fraction of time the current flows.

The cabinet line makes about 20 welds a minute when running steadily, each 0.20 s, so the welder conducts for 4 s in every 60 s: a duty cycle of 4 ÷ 60 = **6.7%**. The equivalent continuous current, the steady current that would produce the same average heating, is the welding current times the square root of the duty cycle:

9,000 × √0.0667 ≈ **2,320 A** continuous equivalent.

Machine makers rate resistance welders at a stated duty cycle and provide data or charts for other duty cycles. ISO 669 sets out the mechanical and electrical requirements for resistance welding equipment, including what the specification and rating plate must state and how characteristics are tested; IEC 62135-1 covers safety requirements. The comparison of the shop's duty with the maker's rating must use the maker's data. As a first approximation based on I² heating, a rating at one duty cycle converts to another by the square-root rule: a transformer rated 50 kVA at 50% duty would, by that rule, permit about 50 × √(0.50 ÷ 0.0667) ≈ 137 kVA at 6.7% duty. The welding demand of 40.5 kVA is well inside that, but the approximation ignores the maker's limits on peak current, short-time ratings and cooling, so it is a check on reasonableness, not a rating.

## What the supply sees

The supply sees a load that jumps from nothing to about 98 A, at low power factor, twenty times a minute. Three effects matter.

**Voltage dip.** Every weld draws a heavy current through the supply cables and transformer, so the voltage at the welder, and at other machines on the same circuit, dips for the duration of the weld. If the supply impedance is high, the dip can reduce the welding current noticeably, and it can cause lights to flicker and sensitive equipment to misbehave. A dip of 5% at the welder becomes about a 10% fall in heat, because heat follows current squared and current follows voltage.

**Protection.** Circuit protection must carry the repeated heavy current without nuisance tripping while still protecting the cables. The maker states the supply cable size and protection for each machine; an electrician must design the circuit.

**Energy.** With 28 kW for 0.20 s, each weld draws 28,000 × 0.20 = 5,600 J from the supply, about three and a half times the 1,620 J generated in the weld zone in Chapter 1. Each cabinet's 64 welds take 64 × 5.6 = 358 kJ, which is 0.0996 kWh, about 3 cents at an illustrative 30 cents per kilowatt-hour. Energy is a trivial part of the cost of a spot weld; Chapter 10 shows where the real cost lies.

## Single-phase, three-phase and inverter machines

A single-phase welder connected across two lines of a three-phase supply loads those two lines heavily and the third not at all, which unbalances the supply. For a few small welders this is acceptable, and electricians spread them across different line pairs. For large welders, three-phase machines spread the load evenly.

Hamilton and Oberg noted in 1918 that direct current was not used for resistance welding because there was no simple way to reduce its voltage without wasting power. Modern inverter welders solve that problem electronically. They draw a balanced three-phase supply, convert it to direct current, chop it at a medium frequency of the order of a thousand hertz, feed it through a small transformer and rectify the secondary to give direct welding current. ISO 669 covers both single-phase alternating-current equipment and three-phase inverter equipment. The inverter's advantages are a balanced supply, a smaller and lighter transformer, better power factor and very fast, precise current control. The cabinet shop's pedestal welder is a conventional single-phase machine; its robot cell, if it ever has one, will almost certainly be an inverter.

## A failure: the morning weld weakness

This is an illustration. For several weeks the first hour of each day produced a higher rate of undersized welds than the rest of the shift. The schedule had not changed, the electrodes had been dressed the previous afternoon, and the weld current meter's readings, taken on a few welds by the setter, showed nothing unusual.

The shop installed a weld current monitor that recorded every weld. The record showed that the current dipped to about 8,400 A for some welds between 7 and 8 a.m., always at the same moments that a large air compressor started and when a powder-coating oven's heaters switched on at the start of the day. All three loads were on the same supply board. The welder's control, an older phase-shift type without current compensation, simply delivered less current when the voltage dipped.

From Chapter 1, a fall from 9,000 to 8,400 A reduces heat by 1 − (8,400 ÷ 9,000)² ≈ 13%, enough to push welds near the bottom of the window below the minimum. The fix had two parts: an electrician moved the welder to a separate circuit fed directly from the main switchboard, which halved the dip, and the welder's control was upgraded to one with constant-current regulation, which corrects the firing angle to hold the set current against supply variation. The monitor stayed, because it turned an invisible problem into a visible one.

## Exercise: a heavier spot

The heavier 2.0 mm cabinet in Chapter 2 needs about 11,400 A. On the same machine, with the same 0.50 mΩ secondary loop, calculate the secondary voltage, kVA during the weld and primary current at 415 V. Then calculate the duty cycle and equivalent continuous current if the weld time rises to 14 cycles at 50 Hz and the machine still makes 20 welds a minute.

Secondary voltage, V₂ = 11,400 × 0.000 50 = **5.7 V**. During the weld, kVA = 5.7 × 11,400 ÷ 1,000 = **65.0 kVA**, so the primary current is 64,980 ÷ 415 ≈ **156.6 A**.

Fourteen cycles at 50 Hz is 0.28 s, so at 20 welds a minute the duty cycle is 20 × 0.28 ÷ 60 = **9.3%**. The equivalent continuous current is 11,400 × √0.0933 ≈ **3,480 A**. The demand during the weld has risen by about 60%, and the equivalent continuous current by about 50%, which means roughly 2.2 times the average winding heating, so the maker's rating chart and the supply circuit would both need to be checked before the heavier cabinet goes into production on this machine.
