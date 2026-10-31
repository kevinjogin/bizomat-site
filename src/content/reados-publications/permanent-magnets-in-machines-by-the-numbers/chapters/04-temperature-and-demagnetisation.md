---
book: permanent-magnets-in-machines-by-the-numbers
chapterSlug: temperature-and-demagnetisation
order: 4
title: "Temperature and demagnetisation"
description: "Why magnets weaken when hot: reversible and irreversible losses, coercivity falling with temperature, the knee and worst-case working point, and a coupling magnet checked at its hottest."
draft: false
---

Most permanent magnet failures in machines are caused by heat. A magnet that works perfectly at room temperature can lose part of its strength permanently on a hot day, after a process upset or during a fault, without any visible damage. The magnet is not broken; its working point has crossed its knee. Whether that can happen is predictable from three things: how the magnet's properties change with temperature, where its working point sits in its circuit, and what reverse fields it meets in the worst case.

This chapter explains why magnetisation falls with temperature, separates reversible from irreversible losses, and applies both to the coupling magnets in Line 4's clean-in-place pump at its normal temperature and at the temperatures a fault could reach. The error is a replacement rotor with a cheaper grade of magnet.

## Why magnets weaken as they warm

A permanent magnet's magnetisation comes from the spontaneous alignment of atomic moments described in Chapter 1. Thermal energy disturbs that alignment. The theory of the condensed state describes the disturbance at low temperatures as spin waves, collective precessions of the moments travelling through the crystal, whose number grows with temperature; each reduces the magnetisation slightly, and the result, Bloch's law, is a fall in magnetisation proportional to the absolute temperature raised to the power three-halves. Nearer the Curie temperature the fall steepens and the magnetisation vanishes at the Curie point itself.

For a designer, the useful consequence is that a material's rate of loss at working temperatures depends on how close those temperatures are to its Curie temperature. Sintered NdFeB, with a Curie temperature of about 310 °C, is much closer at 100 °C than samarium-cobalt at about 800 °C or AlNiCo at about 900 °C, and it loses remanence correspondingly faster: Arnold Magnetic Technologies' technical note gives typical reversible coefficients of about −0.11 %/°C for sintered NdFeB against about −0.03 %/°C for Sm2Co17 and −0.02 %/°C for AlNiCo 5.

Coercivity falls with temperature too, and for NdFeB it falls much faster than remanence. Arnold's note gives a typical reversible coefficient of intrinsic coercivity of about −0.60 %/°C for a sintered NdFeB grade. Coercivity in these materials comes from the crystal's anisotropy, which weakens as temperature rises, and from the microstructure's ability to stop reversed domains forming, which weakens with it.

```figure
type: formula
title: Linear temperature models for remanence and intrinsic coercivity
formula: Br(T) = Br(20 °C) × [1 + α × (T − 20)]
formula: HcJ(T) = HcJ(20 °C) × [1 + β × (T − 20)]
formula: Sintered NdFeB, typical: α ≈ −0.11 %/°C, β ≈ −0.60 %/°C
caption: Linear coefficients are averages over a range, typically about 20 to 120 °C in Arnold's note; real changes are not exactly linear. For design near the limits, use the maker's curves at the actual temperature.
- α | reversible temperature coefficient of remanence
- β | reversible temperature coefficient of intrinsic coercivity
```

## Reversible and irreversible losses

Arnold's note separates three kinds of loss, and the distinction decides what a designer must check.

A **reversible loss** is the fall of remanence and flux with temperature that disappears when the magnet cools. A coupling or motor designed for its working temperature must provide its torque with the magnet at that temperature, but it suffers no lasting harm from the reversible loss.

An **irreversible, recoverable loss** occurs when the working point, at some temperature and under some reverse field, crosses the knee of the intrinsic curve. Part of the magnet, usually the regions with the highest reverse field such as corners and edges, reverses its magnetisation. When the magnet cools and the field is removed, that part stays reversed, and the magnet's flux is permanently lower. Re-magnetising restores it.

An **irreversible, unrecoverable loss** is a change in the material, from corrosion or from exposure to temperatures high enough to alter the microstructure. Re-magnetising does not restore it.

The knee is the point to watch. Datasheets often give Hk, the reverse field at which the intrinsic polarisation has fallen to 90% of Br; Arnold's note marks it on the demagnetisation curve. As long as the magnet's worst-case field stays well short of Hk at its highest temperature, the losses stay reversible.

## The worst-case working point

The working point from the load line, found in Chapter 3, is the resting state. It is not the worst case. In a motor, current in the windings adds a reverse field at peak load. In a magnetic coupling, the worst case is a slip: if the load torque exceeds the coupling's capacity, the two rotors slip past each other, and for part of each slip cycle each magnet faces a magnet of the same polarity across the gap, which drives a strong reverse field into it.

This is an illustration. The coupling designer's model of Line 4's pump coupling, with like poles aligned during a slip, gives a worst reverse field of about 620 kA/m in the corners of the inner rotor's magnets, against a resting working field of about 212 kA/m at 20 °C.

```figure
type: compare
title: The coupling magnets against temperature, chosen grade, HcJ 1,200 kA/m at 20 °C
cols: Br, T | HcJ, kA/m | Hk ≈ 0.9 × HcJ, kA/m | Resting field, kA/m | Margin of Hk over the 620 kA/m slip field
rowhead: Magnet temperature
- 20 °C | 1.280 | 1,200 | 1,080 | 212 | 460
- * 75 °C, normal running | 1.203 | 804 | 724 | 199 | 104
- 100 °C, a fault | 1.167 | 624 | 562 | 194 | −58
- 120 °C | 1.139 | 480 | 432 | 189 | −188
caption: This is an illustration. Linear models with α = −0.11 %/°C and β = −0.60 %/°C; Hk taken as 0.9 × HcJ, an assumption that the real grade's curves must confirm; resting field from the load line with Pc = 3.75; slip field from the designer's model. A negative margin means a slip at that temperature would demagnetise the magnets' corners.
```

At its normal running temperature of 75 °C, the coupling's magnets have a margin of about 104 kA/m against a slip. That is adequate but not generous, and it disappears if the magnets reach about 100 °C. The resting working point, by contrast, is far from the knee at every temperature in the table: the magnets are safe while the coupling turns normally, and at risk only if it slips while hot. Chapter 5 shows how a pump fault can do exactly that.

### What temperature does to the torque

Even when losses are reversible, the coupling transmits less torque when it is hot. Its torque is roughly proportional to the square of the gap flux density, which follows Br.

```figure
type: bars
title: The coupling's torque capacity relative to 20 °C, by magnet temperature
unit: %
max: 100
caption: This is an illustration. Torque taken as proportional to Br² with α = −0.11 %/°C. A coupling sized at 20 °C has 12% less capacity at its normal 75 °C.
- 20 °C | 100.0
- * 75 °C | 88.3
- 100 °C | 83.2
- 120 °C | 79.2
```

Coupling makers rate their couplings at a stated temperature and give derating for higher ones. A coupling selected from a 20 °C rating for a 75 °C duty, without derating, has 12% less capacity than the selection assumed.

## Designing for temperature

Four measures keep magnets out of trouble with heat:

- **Know the magnet's real temperature.** It is not the ambient and not the process fluid's temperature alone. In a sealless pump, the inner magnets sit in the pumped liquid, which is heated further by losses in the containment shell. In a motor, the rotor magnets are heated by the windings and by eddy losses in the magnets themselves.
- **Choose the grade for the highest temperature, not the normal one.** The margin against the worst reverse field must hold at the highest temperature a credible fault can reach.
- **Keep the working point high.** A higher permeance coefficient, from thicker magnets or smaller gaps, moves the resting point away from the knee and reduces the effect of reverse fields.
- **Limit the reverse fields.** In a coupling, avoid slips: size it with margin and protect it with monitoring. In a motor, limit peak current in the drive.

The order of these measures matters. Knowing the real temperature comes first because every other check depends on it, and it is the one most often guessed. In the case's pump, the designer's first estimate of the inner magnets' temperature was the 75 °C of the solution; Chapter 5 shows that losses in the containment shell add to that, and a dead-headed pump adds much more. A margin that looked comfortable at the solution's temperature can be small at the magnets' real temperature.

The second measure is where the cost lies. A grade with higher intrinsic coercivity costs more per kilogram, and in NdFeB it usually also has slightly lower remanence, so the coupling needs a little more magnet for the same torque. Against that, a coupling whose magnets survive a hot slip avoids a pump failure, a rotor replacement and a production stop. The plant's experience in this chapter's error is a fair illustration of the trade.

Magnets can also be thermally stabilised by the maker: held for a time at a temperature above their working temperature, so that the regions that would suffer irreversible loss do so before the magnet is installed and the rest is stable in service. Stabilisation costs a few per cent of flux and buys predictability.

## Cold

Low temperatures are less often a problem, but not never. Most magnet materials gain remanence as they cool, which is harmless. Ferrite's intrinsic coercivity falls as it cools, because its temperature coefficient of coercivity is positive, so a ferrite magnet in a cold store or outdoors in winter is easier to demagnetise than at room temperature; its circuit and any reverse fields should be checked at the lowest temperature as well as the highest. NdFeB has a different low-temperature quirk: at cryogenic temperatures, far below anything in a food plant, its easy axis of magnetisation changes direction, which matters only for magnets in cryogenic equipment, where samarium-cobalt is often preferred.

## Ageing at a steady temperature

A magnet held at a steady temperature within its rating loses flux only very slowly. Most of whatever change occurs happens soon after the magnet first reaches that temperature, as the least stable regions settle, and the rate falls away with time. That is why makers offer thermal stabilisation for precision applications: it uses up that early change before installation. For couplings, motors and separators in ordinary service, ageing at a steady temperature is negligible beside the effects of excursions above the rated temperature, corrosion and mechanical damage.

## Detecting losses in service

Irreversible losses give few direct signs. A magnet that has lost part of its flux looks the same as before. The evidence comes from what the magnet does:

- **Couplings.** Lower torque capacity, shown as slips at starts or at high flow that did not happen before, or as lower flow at the same motor speed if the coupling slips intermittently.
- **Motors.** Higher current for the same torque, because the torque constant has fallen; the drive's records of current and torque show it.
- **Separators and holding magnets.** Lower surface field at fixed measurement points, or lower pull, in the routine checks of Chapters 8 and 10.
- **Sensors.** Switching at a shorter distance than before.

Each needs a baseline: a measurement made when the part was new, under stated conditions, against which later measurements are compared. The plant records a baseline for every magnetic part it commissions, and the same check later, so that a loss shows as a change, not as a judgement.

Temperature itself is worth logging where magnets run near their limits. For the pump, the plant logs the clean-in-place solution's temperature and the pump's motor current, and has added a temperature label to the outside of the containment shell's housing, which shows if the housing has ever exceeded 90 °C.

## The error: a cheaper grade in the replacement rotor

This is an illustration. After several years' service, Line 4's pump inner rotor was replaced because its encapsulation had worn. The replacement came from a different supplier, whose quote was lower, with NdFeB magnets of the same remanence but an intrinsic coercivity of 955 kA/m at 20 °C. The purchase order said only "NdFeB, Br 1.28 T", which both rotors met.

At 75 °C the replacement magnets' intrinsic coercivity was about 640 kA/m and their Hk about 576 kA/m, below the 620 kA/m that a slip drives into them. Three weeks after installation, a blocked strainer caused the pump to slip briefly during a clean-in-place start. After that event the pump delivered noticeably less flow at the same motor current, and further brief slips followed during later starts. When the rotor was examined, the magnets' surface field at their corners was well below that of the old rotor.

The specification was rewritten with the minimum intrinsic coercivity and Hk at 100 °C, the highest credible magnet temperature, and the rotor was replaced with one that met it. The plant's purchasing template for magnetic parts now has fields for remanence and coercivity at the working temperature, not only at 20 °C.

## Exercise: a hotter process

This is an illustration. A new product needs the clean-in-place solution at 85 °C, and the designer expects the coupling magnets to run at about 90 °C.

1. Using the linear models and the chosen grade's 20 °C values, what are Br, HcJ and Hk at 90 °C?
2. What is the margin of Hk over the 620 kA/m slip field?
3. What should the plant do?

**Worked answer.**

1. Br = 1.28 × (1 − 0.0011 × 70) = **1.181 T**; HcJ = 1,200 × (1 − 0.006 × 70) = **696 kA/m**; Hk ≈ 0.9 × 696 = **626 kA/m**.
2. 626 − 620 = **6 kA/m**, effectively no margin.
3. **Change the grade or the design.** A grade with higher intrinsic coercivity, or samarium-cobalt magnets, would restore the margin; so would a coupling design with a higher permeance coefficient and a smaller slip field. The coupling's torque at 90 °C, about (1.181 ÷ 1.28)² = 85% of its 20 °C value, must also be checked against the pump's needs. Neither check can be left to the supplier's standard rotor: the plant should state the new highest magnet temperature in its enquiry and ask for the grade's curves at that temperature.
