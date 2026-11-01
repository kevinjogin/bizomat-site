---
book: variable-speed-drives-by-the-numbers
chapterSlug: drive-life-capacitors-fans-and-power-cycling
order: 5
title: "Drive life: capacitors, fans and power cycling"
description: "How temperature sets the life of a drive's DC link capacitors and cooling fans, how power cycling wears out power modules, and how to combine the parts into a drive reliability and a maintenance plan."
draft: false
---

A drive does not wear out evenly. Its semiconductors, if kept cool and within their ratings, can outlast the machine. Its electrolytic capacitors dry out slowly, faster when hot. Its cooling fans have bearings that wear. Its power modules fatigue a little every time they heat and cool. And its control electronics fail at random, at a low but steady rate. Knowing which part limits life, and how temperature changes it, turns a drive from a black box that fails one day into equipment that can be maintained.

This chapter estimates the life of DP-4's DC link capacitors from their endurance rating with the Arrhenius relation, the life of the drive's fans with a Weibull model, and the drive's overall reliability with all its parts in series. It explains power cycling, and ends with a spare drive that had sat on a shelf too long.

## DC link capacitors

The DC link of each DP-4 drive uses aluminium electrolytic capacitors: a very thin layer of aluminium oxide on etched foil, the dielectric, with a liquid electrolyte as the other plate. They give a large capacitance in a small volume at low cost, but the electrolyte slowly escapes through the seal and is consumed, more quickly when the capacitor is hot. As it goes, the capacitance falls and the equivalent series resistance rises, so the capacitor heats more from the ripple current it carries, which speeds the process further. End of life is usually defined as a set fall in capacitance or rise in resistance, not as a sudden failure, though a capacitor driven far past it can vent.

The maker gives an endurance rating: a number of hours at the rated maximum temperature and rated ripple current over which the capacitor stays within its end-of-life limits. DP-4's capacitors are rated at 5,000 hours at 105 °C. Few drives run their capacitors at 105 °C, and life at lower temperatures is longer, roughly following the Arrhenius relation for a temperature-driven chemical process. Makers often quote the simplified rule that life doubles for every 10 K fall in temperature, which near 100 °C corresponds to an activation energy of about 0.83 eV.

```figure
type: formula
title: Temperature acceleration of capacitor life
formula: Acceleration factor AF = exp[(E_a ÷ k) × (1 ÷ T_use − 1 ÷ T_test)]
formula: Life at T_use ≈ rated endurance × AF
formula: Rule of thumb: L = L_rated × 2^((T_rated − T_core) ÷ 10)
formula: E_a matching the 10 K rule near T: E_a = k ln 2 ÷ (1 ÷ T − 1 ÷ (T + 10))
caption: Temperatures in kelvin; k = 8.617 × 10⁻⁵ eV/K. T_use is the capacitor's core temperature in service: the air around it plus its rise from ripple current. The 10 K rule corresponds to E_a ≈ 0.83 eV between 95 °C and 105 °C but only about 0.66 eV between 55 °C and 65 °C, so the two methods diverge at low temperatures.
- E_a | activation energy, eV
- T_use, T_test | service and rated temperatures, K
- L_rated | endurance at the rated temperature, h
```

The capacitors' core temperature in service is the cabinet air plus their own rise. With the cabinet at up to 45 °C and a ripple-current rise of about 10 to 15 K, the plant took a yearly average core temperature of 55 °C and a summer worst of 65 °C. The [Arrhenius acceleration check tool](/tools/arrhenius-acceleration-check/) treats the maker's 5,000-hour endurance test at 105 °C as the test and works out how many service hours it represents.

```figure
type: compare
title: DP-4 DC link capacitor life from the 105 °C endurance rating, from the Arrhenius acceleration check tool
cols: Acceleration factor | Equivalent service life | 10 K rule | Against 90,000 h
rowhead: Core temperature
- * 55 °C, yearly average | 48.47 | 242,353 h | 160,000 h | COVERS TARGET LIFE
- 65 °C, summer worst | 20.35 | 101,737 h | 80,000 h | COVERS TARGET LIFE by the tool; not by the 10 K rule
caption: This is an illustration. E_a = 0.83 eV; endurance 5,000 h at 105 °C; target 90,000 h, fifteen years at the plant's 6,000 running hours a year. The tool's sensitivity table shows the factor at 55 °C ranging from 19.0 at 0.63 eV to 123.5 at 1.03 eV: the activation energy dominates the answer.
```

The two methods give different answers at these temperatures, and the gap is a warning, not a contradiction. A single activation energy fitted near 100 °C extrapolates to a longer life at 55 °C than the 10 K rule does. The plant used the more cautious rule for planning: at a 55 °C core, about 160,000 hours; at 65 °C, 80,000 hours. Capacitor makers also cap the life they will stand behind, often at about 15 years, because seals age with time as well as temperature. For DP-4, the capacitors are not the first thing to fail at the average temperature, but a hotter cabinet halves their life for every 10 K, which is one more reason the clogged filters of Chapter 4 mattered.

## Cooling fans

Each drive has a fan on its heatsink, and the cabinet has its own filter fans. A fan's life is limited by its bearings and their grease, which degrade with temperature and running hours. Fan makers quote an L10 life, the running time by which 10% of a population will have failed, at a stated temperature. DP-4's drive fans are quoted at an L10 of 40,000 hours at 40 °C.

Fan failures are wear-out failures: the longer a fan runs, the more likely it is to fail in the next hour. A Weibull distribution with a shape parameter greater than 1 describes that. Taking a shape parameter of 3, the characteristic life is η = 40,000 ÷ (−ln 0.9)^(1/3) = 84,690 hours. The [Weibull reliability tool](/tools/weibull-reliability/) gives the reliability at any running time.

```figure
type: compare
title: A DP-4 drive heatsink fan, from the Weibull reliability tool
cols: Reliability | Probability of failure | Hazard rate
rowhead: Running time
- * 30,000 h, five years | 95.65% | 4.35% | 4.4 × 10⁻⁶ per hour
- 60,000 h, ten years | 70.08% | 29.92% | 17.8 × 10⁻⁶ per hour
caption: This is an illustration. β = 3, η = 84,690 h, giving the quoted B10 life of 40,000 h and a mean time to failure of 75,626 h. The hazard rate quadruples between five and ten years: wear-out.
```

Because the hazard rate rises with age, replacing fans on a schedule reduces failures; the tool's own check says so for any shape parameter above 1. A drive whose heatsink fan stops will usually protect itself by derating or tripping on heatsink temperature, but a trip on a hot afternoon stops the process. Replacing each fan at 30,000 hours costs a small part and an hour's work in a planned shutdown.

## The drive as a system

A drive works only if all its main parts work, so for reliability its parts are in series. The [system reliability tool](/tools/system-reliability/) combines up to four blocks, each with its own Weibull model. For a DP-4 drive the plant used three blocks:

- **DC link capacitors:** wear-out, β = 4, characteristic life 240,000 hours, consistent with the capacitor estimate at the average temperature.
- **Heatsink fan:** β = 3, η = 84,690 hours, as above.
- **Power module, gate drivers and control boards:** random failures, β = 1, characteristic life 400,000 hours, an assumed figure of the order of field failure rates for industrial electronics.

```figure
type: compare
title: DP-4 drive reliability from its parts, from the system reliability tool
cols: Capacitors | Fan | Electronics | Drive | Weakest block
rowhead: Mission time
- * 30,000 h, five years | 99.98% | 95.65% | 92.77% | 88.72% | Electronics
- 60,000 h, ten years | 99.61% | 70.08% | 86.07% | 60.08% | Fan
- 60,000 h with the fan replaced at 30,000 h | 99.61% | 91.49% | 86.07% | 78.44% | Electronics
caption: This is an illustration. The tool's system mean time to failure is 67,820 h without replacement. The third row is worked by hand: with a new fan at 30,000 h, the fan block's reliability over 60,000 h is 0.9565² = 0.9149, and the drive's 0.9961 × 0.9149 × 0.8607 = 0.7844. The tool does not model replacement.
```

Over five years, the drive's reliability is 88.7%, short of the plant's 90% target, and the weakest block is the electronics, whose failures are random. No preventive replacement improves a random failure rate; the remedies are better conditions, such as cooler and cleaner air, or a spare to shorten the outage, which Chapter 10 plans. Over ten years, the fan becomes the weakest block, and replacing it at five years raises the drive's ten-year reliability from 60.1% to 78.4%.

## Power cycling

Power modules have their own wear-out mechanism. Each time the load rises, the chips heat; each time it falls, they cool. The materials in a module expand by different amounts: silicon by about 3 × 10⁻⁶ per kelvin, the aluminium bond wires on top of the chips by about 23 × 10⁻⁶, copper by about 17 × 10⁻⁶. Every swing in junction temperature strains the joints between them. Over many cycles, cracks grow in the solder under the chips and at the feet of the bond wires, until a wire lifts off or the solder's thermal resistance rises enough to overheat the chip.

The number of cycles a module survives falls steeply with the size of the temperature swing, ΔT_j, and with the mean temperature: module makers publish power cycling curves from accelerated tests, and as a rough guide halving the swing increases the number of cycles to failure many times over. For DP-4's fan drive, the swings are small and slow: from about 70 °C at the usual 40 Hz duty to about 103 °C at full load, a few times a day, and from cold to warm once a day. That adds up to a few thousand cycles a year, far below what a module rated for industrial service survives. Power cycling matters most in drives whose load cycles often and deeply: cranes, hoists, presses, servo axes and lift drives, which may see hundreds of thousands of cycles a year at low output frequency, where Chapter 4 showed the junction temperature ripple is largest. For those applications, a larger module or a lower switching frequency, which reduces ΔT_j, can multiply the module's life. READOS's [Accelerated Life Testing by the Numbers](/reados/publications/accelerated-life-testing-by-the-numbers/) explains how such curves are measured.

## Other parts that age

Capacitors and fans are the best-known wear parts, but not the only ones.

- **Film capacitors.** Some drives, particularly newer and smaller ones, use polypropylene film capacitors in the DC link instead of electrolytics. They hold less energy for their size but have no electrolyte to lose, tolerate higher ripple current and age far more slowly; their main enemy is humidity, which can corrode their thin metal electrodes.
- **Pre-charge circuits.** When a drive is switched on, its discharged DC link capacitors would draw a huge inrush current from the supply. A pre-charge resistor limits it, and a relay or contactor then bypasses the resistor. That relay switches once every time the drive is powered up. On a drive switched off and on several times a day, as some machines are at every stop, the relay's contacts wear far sooner than the rest of the drive. Where a machine must stop often, the drive should be stopped and started with its run command, not by switching its supply.
- **Connections and fuses.** Power terminals loosen with thermal cycling, and a loose terminal heats, oxidises and loosens further. Fuses age with the currents they carry. Both are found by thermal imaging and by checking terminal torque at planned shutdowns.
- **Firmware and parameters.** Not physical wear, but a drive whose firmware is many versions old, or whose parameters have been changed without record, is a drive whose behaviour after a replacement is uncertain (Chapter 10).

## From life estimates to a maintenance plan

The estimates in this chapter turn directly into a plan. For DP-4's drives, at 6,000 running hours a year, the plant set:

1. **Monthly:** change the cabinet filter mats and check the cabinet temperature log (Chapter 4).
2. **Yearly:** clean the heatsink fins and fans with dry air in a planned shutdown; thermal-image terminals, chokes and capacitors under load; check terminal torque; power up the spare drive.
3. **Every five years, at about 30,000 hours:** replace each drive's heatsink fan and the cabinet fans, whether or not they have failed.
4. **At about ten years:** measure the DC link capacitance and ripple, if the drive reports them, or plan for capacitor replacement or drive replacement; by then, a new drive of current design is often the better choice.

The plan costs a few hours of labour and a few hundred dollars of parts a year across the panel. Against it stands the cost of an unplanned stop of the wash line, which the plant puts at several thousand dollars an hour in lost production and overtime.

## The error: the spare drive on the shelf

When the pump drive failed in its fourth year, the plant's stores held a spare drive of the same model, bought with the panel and never used. It was fitted the same morning. When the supply was switched on, the DC link pre-charge circuit tripped, and when the supply was switched on again, one of the DC link capacitors vented with a bang and a smell of electrolyte.

The drive's manual, which had not been consulted, said that drives stored for more than about one year must have their DC link capacitors reformed before use: brought up slowly to rated voltage over an hour or more from a current-limited supply. In storage, an aluminium electrolytic capacitor's oxide dielectric slowly degrades without a voltage to maintain it, and its leakage current at full voltage rises. Applied suddenly, the full DC link voltage drives a large leakage current through the weakened oxide, which heats the capacitor and can rupture it. Reforming rebuilds the oxide gently.

```figure
type: checklist
title: Managing spare drives
caption: This is an illustration. The plant's procedure since the failure.
- x Every spare drive labelled with its date of manufacture and date into store
- x Spares stored dry and cool, in their packaging
- x Capacitors reformed to the maker's procedure if stored longer than the manual allows, before first use
- x Spares powered up once a year, which keeps the oxide formed, and the date recorded
- ? Rotate a spare into service and the service drive into store, where the process allows
```

The vented drive was returned for repair, and the pump ran direct-on-line through its old starter bypass for two days until a new drive arrived. The plant now powers each spare drive once a year.

## Exercise: a hotter cabinet

Suppose the cabinet's filters were never changed, so that the cabinet air averaged 49 °C instead of 45 °C, raising the capacitor core temperature by 4 K throughout.

1. Using the 10 K rule, what is the capacitors' life at a core temperature of 59 °C instead of 55 °C?
2. If the drive's fan runs at 49 °C, the fan maker's derating says its L10 life falls to 28,000 hours. With β = 3, what is its characteristic life and its reliability at 30,000 hours?
3. Why does the cabinet temperature matter more than it might appear?

### Worked answer

1. L = 5,000 × 2^((105 − 59) ÷ 10) = 5,000 × 2^4.6 = 5,000 × 24.25 = 121,300 hours, against 160,000 hours at 55 °C: 24% less.
2. η = 28,000 ÷ (−ln 0.9)^(1/3) = 28,000 ÷ 0.4723 = 59,283 hours. R(30,000) = exp[−(30,000 ÷ 59,283)³] = exp(−0.1296) = 87.8%, against 95.7% at 40 °C: the chance of a fan failure in five years almost triples, from 4.3% to 12.2%.
3. A few degrees of cabinet temperature cut the life of every temperature-sensitive part at once: capacitors, fans and, through the junction temperature, the power modules. The cost of changing a filter monthly is trivial against shortening the drive's life by a quarter.
