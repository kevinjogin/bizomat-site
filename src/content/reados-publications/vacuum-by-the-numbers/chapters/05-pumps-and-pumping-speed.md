---
book: vacuum-by-the-numbers
chapterSlug: pumps-and-pumping-speed
order: 5
title: "Pumps and pumping speed"
description: "What a vacuum pump does, speed curves and ultimate pressure, the main pump types, why a water-ring pump cannot reach 200 Pa at 20 °C, condensing vapour and gas ballast, and oil turned to emulsion."
draft: false
---

A vacuum pump is a compressor working backwards from the usual direction: it takes in gas at the chamber's low pressure and pushes it out at atmospheric pressure. VC-200's pump, working at 200 Pa, compresses its gas by a factor of about five hundred. Every pump has a speed, the volume it takes in each second, that varies with the inlet pressure, and an ultimate pressure below which it cannot go. What a pump can do with vapours, water and solvents, is as important as either, and in a degassing or drying process it is often what decides the choice.

This chapter describes what a pump's speed and ultimate pressure mean, models VC-200's speed curve, surveys the main kinds of pump and what limits each, uses NIST's vapour pressure data to show why a water-ring pump cannot reach VC-200's working pressure, explains how vapour condenses inside a pump and how gas ballast prevents it, and ends with a pump whose oil turned into an emulsion.

## Speed, throughput and ultimate pressure

A pump's **speed**, S, is the volume of gas it takes in per second, measured at its inlet pressure. Its throughput is Q = S × p. A pump's speed is usually nearly constant over its main working range and falls as the inlet pressure approaches the pump's **ultimate pressure**, the lowest pressure it can reach with its inlet blanked off. At the ultimate pressure, the gas the pump moves forward is balanced by gas leaking back from its exhaust side, through clearances and through gas dissolved in its oil, and the net speed is zero.

A simple model of that behaviour, good enough for estimates, is:

S(p) = S₀ × (1 − p_ult ÷ p)

where S₀ is the pump's nominal speed and p_ult its ultimate pressure. Makers publish measured speed curves, which should be used in place of the model when they are available.

This is an illustration. VC-200's two-stage rotary vane pump is rated at **16 m³/h**, 4.44 L/s, with an ultimate pressure of about **0.5 Pa** on its data sheet. The model gives:

- from atmospheric pressure down to about 1 kPa: **4.44 L/s**;
- at 200 Pa: **4.43 L/s**;
- at 10 Pa: **4.22 L/s**;
- at 2 Pa: **3.33 L/s**;
- at 1 Pa: **2.22 L/s**, half the nominal speed.

At its working pressure, 400 times its ultimate, VC-200's pump runs at its full speed. The ultimate matters for VC-200 only in what it says about the pump's condition: a pump whose ultimate has risen has worn, contaminated or wet oil, or a leak of its own, and Chapter 8's leak checks start by blanking the pump and reading its ultimate.

```figure
type: line
title: VC-200's pump speed against inlet pressure
x: Inlet pressure, absolute, evenly spaced
y: Speed, L/s
ymin: 0
ymax: 5
caption: This is an illustration from the model S = S₀ × (1 − p_ult ÷ p) with S₀ = 4.44 L/s and p_ult = 0.5 Pa. The points are spaced evenly for reading, not on a pressure scale; the working pressure is 200 Pa.
- 1 Pa abs | 2.22
- 2 Pa abs | 3.33
- 5 Pa abs | 4.00
- 10 Pa abs | 4.22
- 50 Pa abs | 4.40
- 200 Pa abs | 4.43
- 1000 Pa abs | 4.44
```

## Kinds of pump

Industrial vacuum uses a handful of pump types, each with its own limit.

- **Oil-sealed rotary vane pumps** trap gas between vanes sliding in a rotor and an eccentric housing, with oil sealing the clearances. Two-stage versions reach low ultimate pressures. They are robust and inexpensive, but their oil can be contaminated by vapours and process materials, and their exhaust carries oil mist.
- **Diaphragm pumps** compress gas with a flexing diaphragm and are completely dry. Their ultimate pressures are higher, typically in the hundreds of pascals for small multi-stage units, which suits filtration and laboratory work but is marginal for degassing at 200 Pa.
- **Scroll and screw pumps** are dry pumps with interleaved spirals or rotors and no oil in the gas path. They reach low pressures and handle vapours well, at a higher price.
- **Roots blowers** are boosters: two lobed rotors moving large volumes at low compression. Mounted above a backing pump, they multiply its speed at low pressure; they cannot exhaust to atmosphere on their own.
- **Liquid-ring pumps** use a ring of liquid, usually water, spun by an impeller, to trap and compress gas. They tolerate vapours, liquids and dirty gases well. Their ultimate pressure is limited by the vapour pressure of the ring liquid.
- **Turbomolecular pumps** knock molecules towards the exhaust with fast-moving bladed rotors. They work only in molecular flow (Chapter 3), and need a backing pump below them.
- **Ejectors** use a jet of steam, air or water to entrain gas; they have no moving parts and suit large flows of dirty or corrosive gas.

The figures for speeds and ultimate pressures vary widely between makers and models; the comparison below is only a guide to what limits each type.

```figure
type: compare
title: Industrial vacuum pumps and what limits them
rowhead: Pump
cols: Works from atmosphere | What sets its lowest pressure | Vapours | Notes
caption: General characteristics for orientation; each maker's data govern a real choice.
- * Oil-sealed rotary vane | yes | back-leakage through oil seals | needs gas ballast | VC-200's pump
- Diaphragm | yes | clearance volume and valves | tolerant, but slows | dry; higher ultimate
- Scroll or screw | yes | internal leakage | tolerant | dry; dearer
- Roots booster | no, needs a backing pump | backing pump and compression ratio | depends on backing pump | multiplies speed at low pressure
- Liquid ring | yes | vapour pressure of the ring liquid | very tolerant | water ring limited near 2 kPa at 20 °C
- Turbomolecular | no, needs a backing pump | molecular flow only | limited | high vacuum
```

## Why a water ring cannot reach 200 Pa

A liquid-ring pump's chamber contains its ring liquid, and the liquid evaporates into the gas being pumped until the gas holds as much vapour as the liquid's vapour pressure allows. The pump can never bring its inlet below that vapour pressure, because it is constantly generating its own vapour.

NIST gives the saturation pressure of water as:

- **0.873 kPa** at 5 °C;
- **1.228 kPa** at 10 °C;
- **1.706 kPa** at 15 °C;
- **2.339 kPa** at 20 °C;
- **3.170 kPa** at 25 °C.

A water-ring pump with its ring at 15 °C cannot pull below about 1.7 kPa, and in practice stops well above it. That is nearly ten times VC-200's 200 Pa working pressure. A water-ring pump would have been an attractive choice for its vapour tolerance, and it cannot do the job; no amount of pump size changes that, because the limit is a property of water. Ring liquids with lower vapour pressures, or a booster mounted above a liquid-ring pump, are the usual ways round it in larger installations.

```figure
type: bars
title: Saturation pressure of water, the floor for a water-ring pump
unit: kPa
max: 3.5
caption: NIST data. A water-ring pump cannot pull below the vapour pressure of its ring water; VC-200 needs 0.2 kPa.
- 5 °C | 0.873
- 10 °C | 1.228
- 15 °C | 1.706
- 20 °C | 2.339
- 25 °C | 3.170
- * VC-200's working pressure | 0.2
```

## Vapour inside an oil-sealed pump

An oil-sealed pump compresses its gas by a factor of hundreds, and a vapour compressed with it can condense inside the pump. If the gas at VC-200's inlet were pure water vapour at 200 Pa and the pump compressed it to atmospheric pressure, the vapour's partial pressure at the exhaust would be far above water's saturation pressure at the pump's running temperature. NIST gives that saturation pressure as **31.2 kPa** at 70 °C, a typical temperature for a working oil-sealed pump's oil. Any water vapour compressed beyond 31.2 kPa in the pump condenses into the oil.

Condensed water mixes with the oil and forms an emulsion. The pump's ultimate pressure rises, because the water re-evaporates on the low-pressure side, its lubrication suffers, and its internals can corrode. Solvent vapours behave the same way, with their own saturation pressures.

**Gas ballast** is the standard remedy. A small valve admits a controlled amount of air into the compression stage just before the exhaust opens, so that the exhaust opens at a lower compression of the vapour. The vapour leaves with the ballast air before its partial pressure reaches its saturation pressure, and does not condense. Gas ballast raises the pump's ultimate pressure somewhat and increases oil mist; makers state how much water vapour a pump can handle with its ballast open, its **water vapour tolerance**, as a partial pressure at the inlet. Running the pump warm, by letting it reach temperature before the process starts, helps too, because the oil's temperature sets the saturation pressure the vapour must stay below.

## How fast a pump must be

Two requirements set the speed a pump needs, and the larger one wins.

- **Pump-down time.** Chapter 6 shows that a chamber of volume V pumped at a constant speed S falls from p₀ to p in a time t = (V ÷ S) × ln(p₀ ÷ p). Turned around, the speed needed is S = (V ÷ t) × ln(p₀ ÷ p). For VC-200 to reach 200 Pa from atmospheric pressure in 6 minutes with no gas load, S = (0.2 ÷ 360) × ln(101,325 ÷ 200) = **3.46 L/s** at the chamber.
- **Gas load.** In steady state, the pressure is the gas load divided by the effective speed, p = Q ÷ S_eff. For the chamber to hold a pressure p against a gas load Q, S_eff must be at least Q ÷ p. Chapter 7 estimates VC-200's gas load during degassing.

VC-200's effective speed at 200 Pa, 4.19 L/s with its hose, or 3.92 L/s with its valve as well, meets the first requirement with a modest margin. Chapter 6 shows that the gas the walls and resin give off makes the real pump-down slower than the empty-chamber formula suggests, and that margin matters.

## Where the pump's power goes

Compressing gas takes work, and for a slow, isothermal compression from inlet pressure p to atmospheric pressure p₀, the power is the throughput times the natural logarithm of the compression ratio: P = Q × ln(p₀ ÷ p). Two cases for VC-200 show how little of a vacuum pump's motor power the gas itself needs.

- At **200 Pa**, the throughput is 200 × 4.44 × 10⁻³ = 0.89 Pa·m³/s and the compression ratio 507: P = 0.89 × ln 507 = **5.5 W**.
- The largest compression power for a constant-speed pump occurs at an inlet pressure of p₀ ÷ e, about **37 kPa**, early in a pump-down: P = S × p₀ ÷ e = **166 W**.

A pump of VC-200's size typically has a motor of several hundred watts, as an illustration, and almost all of its power goes into friction, shearing the oil, and the heat that keeps the oil at its running temperature. That is why a vacuum pump runs hot even at a low pressure where it is moving almost no gas, and why its oil temperature, not its gas load, sets the condensation limits described above.

## The exhaust

Everything the pump removes comes out of its exhaust: the chamber's air, the water and solvent vapours from the resin, and, from an oil-sealed pump, a mist of fine oil droplets. VC-200's pump is fitted with an oil mist filter, and its exhaust is piped outside the building, away from air intakes. The resin's safety data sheet lists the vapours it can release, and the exhaust's discharge point is chosen with them in mind (Chapter 10).

## The error: oil turned to emulsion

This is an illustration. VC-200's pump was supplied with its gas ballast valve closed, the condition for the best ultimate pressure, and nobody opened it. Each degassing cycle drew water vapour and a little solvent from the resin and from the chamber's walls through the pump.

After about two weeks, the pump took noticeably longer to reach 200 Pa, and one morning its blanked-off ultimate, checked by the maintenance technician, was **30 Pa** against the data sheet's 0.5 Pa. The oil in the sight glass was milky. The water vapour had been condensing into the oil on every cycle, and the emulsion was now re-evaporating on the inlet side, adding its own vapour to every pump-down.

The oil was drained and replaced, and the pump run with fresh oil and its ballast open until its ultimate recovered. The process sheet now opens the gas ballast for every degassing cycle, after the pump has warmed up for ten minutes with the chamber isolated, and the pump's ultimate is checked and recorded weekly, with oil changes when it rises above a set value or the oil loses its clarity.

```figure
type: checklist
title: Pump checks for a vapour-laden process
caption: The pump's speed rating says nothing about vapours; these checks cover what it leaves out. The last line is this chapter's error.
- Speed at the working pressure from the maker's curve | 4.43 L/s at 200 Pa
- Ultimate pressure well below the working pressure | 0.5 Pa against 200 Pa
- Pump type able to reach the pressure at all | water ring limited near 1.7 kPa at 15 °C
- Gas ballast open for vapours; pump warmed first | water vapour tolerance from the data sheet
- Ultimate checked and oil inspected on a schedule | weekly, with the chamber isolated
- x Gas ballast closed on a wet process | oil emulsified; ultimate 30 Pa in two weeks
```

## Exercise: a booster for the silicone process

For a future process at **2 Pa**, the shop considers a Roots booster with a nominal speed of 30 L/s above VC-200's pump. Using the model S = S₀ × (1 − p_ult ÷ p), find the rotary vane pump's own speed at 2 Pa. Then, assuming the booster delivers 25 L/s at 2 Pa at its inlet, find the ratio of the combination's speed to the pump's alone. What else limits the speed the chamber sees?

**Worked answer.**

- The rotary vane pump alone at 2 Pa: 4.44 × (1 − 0.5 ÷ 2) = **3.33 L/s**.
- With the booster: **25 L/s**, about **7.5 times** the pump's own speed.

The chamber sees less than either figure, because its hose, valve and ports are in series. At 2 Pa, the 25 mm hose is in transitional flow (Kn = 6.49 × 10⁻³ ÷ 2 ÷ 0.025 = 0.13), and its molecular conductance of 1.28 L/s is the cautious lower bound: in series with a 25 L/s booster it would leave as little as 1.2 L/s at the chamber. A booster for a 2 Pa process would need a much larger line and port, mounted close to the chamber, before its speed was worth having.
