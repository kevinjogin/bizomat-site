---
book: arc-welding-by-the-numbers
chapterSlug: duty-cycle-supply-and-cables
order: 3
title: "Duty cycle, supply and cables"
description: "Check a welding machine's duty cycle against the work, estimate its supply current, and size welding cables by voltage drop, with the 1918 cable sizes converted."
draft: false
---

A welding machine that can deliver 200 A cannot necessarily deliver it all day. Its windings, rectifiers and switching devices heat up while it welds and cool down while it does not, and the duty cycle on its rating plate says how long it can weld in each period before it must rest. Behind the machine sits the electrical supply, which must carry its input current, and in front of it are the welding cables, which waste voltage and power in proportion to their length. Each of these can limit a job that looks easy on paper.

This chapter checks the conveyor shop's machine against its work, works out what it draws from the supply, and sizes its welding cables.

## Duty cycle

The duty cycle is the percentage of a standard period during which a machine can deliver a stated current without overheating. For arc welding power sources the period is ten minutes, under the conditions set out in IEC 60974-1 and its Australian adoption, AS 60974.1, which also cover how the rating is tested and marked. A rating of 200 A at 35% means the machine can weld at 200 A for 3.5 minutes in every 10 minutes, then must rest for 6.5 minutes, at the rated ambient temperature. Exceeding it trips a thermal cut-out on most modern machines, which stops the job until the machine cools.

This is an illustration. The shop's inverter has this rating plate information:

| Welding current | Duty cycle |
|---|---|
| 200 A | 35% |
| 160 A | 60% |
| 125 A | 100% |

The figures fall as the duty cycle rises because heating depends roughly on current squared. As a first approximation, a machine that can sustain current I₁ for duty cycle X₁ can sustain current I₂ for duty cycle X₂ given by:

**X₂ = X₁ × (I₁ ÷ I₂)²**

Checking that approximation against the plate, starting from 200 A at 35%: at 60% it predicts 200 × √(0.35 ÷ 0.60) ≈ 153 A, against the maker's 160 A, and at 100% it predicts 200 × √0.35 ≈ 118 A, against the maker's 125 A. The approximation is slightly conservative here, which is typical, because the machine's heating is not all proportional to current squared. The maker's chart governs; the approximation is useful for checking a setting the plate does not list.

```figure
type: formula
title: Approximate duty cycle at the conveyor-frame settings
formula: X₂ ≈ X₁ × (I₁ ÷ I₂)²
caption: This is an illustration, from the 200 A at 35% rating. The maker's chart governs; this estimate is a check.
- X₁, I₁ | rated duty cycle and current, 35% at 200 A
- I₂ | welding current used
step: 4.0 mm at 170 A: X₂ ≈ 35 × (200 ÷ 170)² ≈ 48%
step: 3.2 mm at 130 A: X₂ ≈ 35 × (200 ÷ 130)² ≈ 83%
```

## Is the machine big enough?

At 170 A the machine can weld for about 48% of each ten-minute period, which is about 4.8 minutes. Chapter 6 estimates that the conveyor welders achieve an operator factor of about 30% over a whole day, meaning the arc burns for about 30% of their paid time. On that average, the machine is comfortably inside its rating.

Averages hide peaks, though. On a long straight fillet weld along a side rail, a welder may burn one electrode after another with only short pauses to change electrodes and chip slag. If each 4.0 mm electrode burns for about a minute (Chapter 4) and the changeover takes 25 seconds, the arc burns for about 60 out of every 85 seconds, which is about 71% of the time. Over a ten-minute run that exceeds the 48% the machine can sustain at 170 A, so the thermal cut-out would trip after a few minutes of continuous rail welding.

The shop has three options: break the long rail welds with other work, such as fitting the next cross-member; use a second machine so that two welders alternate; or buy a machine rated for higher duty at 170 A. It chose to plan the work so that the long rail welds alternate with fitting, which also gives the welder a rest from a fatiguing position.

## What the supply sees

A welding machine draws power from the supply while it welds. This is an illustration. With the 85% efficiency assumed in Chapter 2, the 4.42 kW arc of the 4.0 mm electrode needs about 5.2 kW of input. On a 415 V three-phase supply, with a power factor of about 0.95, the line current is:

5,200 ÷ (√3 × 415 × 0.95) ≈ **7.6 A** per phase.

The same input on a single-phase 240 V supply would be 5,200 ÷ (240 × 0.95) ≈ **22.8 A**, more than a standard 10 A or 15 A socket outlet is meant to supply. That is why the shop's 4.0 mm work is done on a three-phase machine.

For site repairs, the shop uses a smaller single-phase inverter at 130 A with 3.2 mm electrodes. Its 3.12 kW arc needs about 3.12 ÷ 0.85 ≈ 3.67 kW of input, which is about 16.1 A at 240 V while the arc burns. Because welding is intermittent, makers state both a maximum input current and an effective input current that accounts for the duty cycle, and the effective figure is what the supply circuit and its protection are designed around. The shop's electrician selects the socket outlet, circuit and protection from the maker's stated input currents, not from the welding current setting.

```figure
type: stats
title: Supply demand of the conveyor shop's two machines while welding
caption: This is an illustration, using an assumed efficiency of 85% and power factor of 0.95. The maker's stated maximum and effective input currents govern the circuit design.
- *7.6 A per phase | Workshop inverter, 415 V three-phase | 4.0 mm at 170 A, 5.2 kW input
- 16.1 A | Site inverter, 240 V single-phase | 3.2 mm at 130 A, 3.67 kW input
- 22.8 A | Workshop work on 240 V, if attempted | why it is done on three-phase
```

When the site machine runs from an engine-driven generator, the generator must supply its maximum input current with margin, because an inverter with a weak supply may cut out or weld poorly. The generator maker's guidance on welding loads should be followed.

## Welding cables

The welding current flows out through one cable to the electrode holder and back through the work and the return cable. Both cables have resistance, so they lose voltage and generate heat. The loss matters because the machine must supply the cable drop on top of the arc voltage, and a long or undersized cable can steal several volts from a 26 V arc.

The resistance of a copper cable is

**R = ρ × L ÷ A**

where ρ is the resistivity of copper, about 1.72 × 10⁻⁸ Ω·m at 20 °C, L is the total length of both cables in metres, and A is the conductor area in square metres. Cables in use run warmer than 20 °C, which raises the resistance a little.

This is an illustration. For a repair at the far end of the workshop, the shop needs 25 m of cable to the holder and 25 m of return cable, 50 m in total, at 170 A.

```figure
type: compare
title: Voltage drop and power lost in 50 m of welding cable at 170 A
cols: Resistance | Voltage drop | Power lost
caption: This is an illustration at 20 °C. A 9 V drop on 16 mm² cable would leave the machine supplying 35 V to deliver 26 V at the arc, and would heat the cable by 1.5 kW.
- *35 mm² | 0.0246 Ω | 4.2 V | 710 W
- 25 mm² | 0.0344 Ω | 5.8 V | 994 W
- 16 mm² | 0.0538 Ω | 9.1 V | 1,553 W
```

The shop's rule, based on these numbers, is to keep the total cable drop under about 4 to 5 V for manual metal arc welding, which at 170 A and 50 m means 35 mm² cable. Cable makers publish current ratings for welding cable by duty cycle; the cable must meet both its current rating, which limits heating, and the voltage drop the shop is willing to accept.

## The 1918 cable sizes

Hamilton and Oberg gave cable sizes found suitable in 1918, in circular mils, the American unit of conductor area: 90,000 circular mils for currents up to 200 A, 150,000 for 200 to 500 A, and 260,000 for 500 to 1,000 A. One circular mil is about 0.000 507 mm², so these convert to about **45.6 mm²**, **76.0 mm²** and **131.7 mm²**.

The 1918 cable for 200 A was larger than the 35 mm² the shop uses at 170 A. Part of the reason is that welding sets of the time often supplied several welders from one generator, with long runs of cable around large railway and ship shops. Hamilton and Oberg recorded that, where several operators worked from one machine, about 125 to 150 A per operator should be provided under average conditions.

## Heat, dust and the real duty cycle

A duty cycle is rated at a stated ambient temperature, and the rating plate or manual gives it. An Australian workshop in summer, or a machine standing in the sun on a quarry site, can be well above that temperature, and the machine then reaches its thermal limit sooner. Some makers publish derating figures for higher temperatures; where they do not, the shop should expect a shorter usable duty cycle on hot days and plan site work accordingly.

Dust is the other enemy. Inverters are cooled by fans that draw air through the machine, and in a fabrication shop that air carries grinding dust and metal particles. Dust that builds up on heat sinks insulates them, so the machine trips earlier, and conductive dust can cause electrical faults. The shop blows out its machines with dry air at a set interval, keeps them off the floor and away from grinding stations, and treats an increase in thermal trips as a maintenance signal rather than an inconvenience.

## Looking after cables

Cable resistance assumes sound copper and sound connections. Damaged insulation is an electric shock hazard as well as a fault path, and Safe Work Australia's code calls for welding cables that are fully insulated for their entire length, for terminals and connections to be kept clean and tight, and for equipment to be inspected before use. Broken strands inside a cable that has been run over or kinked raise its resistance and make it heat at the damaged spot. Bolted or poorly crimped joins between lengths of cable add resistance and heat, as the failure below shows.

Long welding cables left coiled on a reel or in loops while welding also add inductance, which can affect arc behaviour, particularly with pulsed processes, and coiled cable cannot shed heat as well as cable laid out straight. The shop lays its cables out flat, keeps them out of walkways and away from hot work, and repairs or replaces damaged lengths rather than taping them.

## The return path

The return cable and its clamp are half of the welding circuit, though they often get less attention than the electrode lead. A return clamp on rusty or painted steel, or connected far from the joint through a chain of bolted parts, adds resistance and generates heat at the contact. This is an illustration. A poor clamp contact of only 0.01 Ω at 170 A drops 170 × 0.01 = 1.7 V and dissipates 170² × 0.01 = **289 W** in a contact area of a few square centimetres, enough to burn the paint, overheat the clamp spring and pit the surface.

The return clamp also decides where the welding current flows through the work. Chapter 7 shows why that matters for arc blow, and for bearings, chains and other parts that welding current must never pass through.

## A failure: the arc that faded at the far end

This is an illustration. Welders repairing a conveyor frame at the far end of the bay complained that the arc was weak and hard to control, though the machine was set to the usual 170 A. A clamp meter on the lead read only about 150 A, and the voltage at the arc was low.

The cables explained it. To reach the repair, a welder had joined two lengths of lighter 16 mm² cable from a store cupboard to the usual leads with a bolted connector, giving about 70 m of mixed cable. The return clamp was on a painted leg some 8 m from the joint. The combined resistance of the long light cable, the connector and the painted clamp contact was enough that the machine, close to the limit of its output voltage, could not maintain 170 A.

The cables were replaced with a single run of 35 mm² for both lead and return, the joint was removed, and the return clamp was placed on bare steel close to the weld. The current returned to 170 A. The shop added a cable-length and cable-size check to its site-work checklist and removed the light cable from the store.

## Exercise: a longer run

A site repair needs 40 m of electrode lead and 40 m of return, using 25 mm² copper cable, with a 3.2 mm electrode at 130 A. Calculate the cable resistance at 20 °C, the voltage drop and the power lost. Then estimate the duty cycle the shop's workshop inverter could sustain at 130 A by the approximation, starting from 200 A at 35%.

The total length is 80 m, so R = 1.72 × 10⁻⁸ × 80 ÷ (25 × 10⁻⁶) ≈ **0.0550 Ω**. The voltage drop is 130 × 0.0550 ≈ **7.2 V**, and the power lost is 130² × 0.0550 ≈ **930 W**. That drop exceeds the shop's 4 to 5 V guide, so 35 mm² cable, which would drop about 5.1 V, or a shorter run with the machine moved closer, would be better.

At 130 A, the approximate duty cycle is 35 × (200 ÷ 130)² ≈ **83%**, so the machine itself is not the limit on this job; the cable is.
