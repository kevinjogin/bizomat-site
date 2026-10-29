---
book: combustion-by-the-numbers
chapterSlug: burners-turndown-and-air-fuel-ratio-control
order: 6
title: "Burners, turndown and air–fuel ratio control"
description: "Burner types, turndown, and four ways of controlling a burner's input; why fixed air wastes fuel at low fire, sizing the combustion air fan, and a blocked impulse line found only at low fire."
draft: false
---

A furnace burner spends little of its life at full input. It fires hard to bring a cold load up to temperature, then spends hours holding that temperature against the furnace's losses, at a small fraction of its rating. How well it burns at those low rates, and how its air follows its gas as it turns down, decides much of a batch furnace's fuel use.

This chapter describes the main burner types, defines turndown, compares four ways of controlling a burner's input, shows with numbers why a burner that turns down its gas but not its air wastes fuel at low fire, sizes TF-120's combustion air fan, and describes a fault that showed up only at low fire, where no one had been looking.

## Burner types

Gas burners differ mainly in where and how the gas meets the air.

- **Atmospheric or aspirating burners** use the gas jet to draw in some of the air, with the rest arriving around the flame. They are simple and common on small appliances, but they offer little control of excess air.
- **Premix burners** mix gas and air fully before the burner head. They burn with short, intense flames and can run close to stoichiometric, but the mixture can flash back into the mixing pipe if its velocity falls too low, which limits their turndown.
- **Nozzle-mix burners** bring gas and air separately to the burner nozzle and mix them there. They cannot flash back, they can run over a wide range of air–fuel ratios, from fuel-rich to very high excess air, and they turn down well. TF-120's two burners are nozzle-mix, as most industrial furnace burners are.

## Turndown

A burner's **turndown ratio** is its maximum stable input divided by its minimum stable input. A burner rated 60 kW with a minimum of 6 kW has a turndown of 10:1. Below its minimum, a flame may lift off the nozzle, become unstable or go out, and the flame safeguard will shut the burner down.

Turndown matters because of what the furnace needs during a cycle. TF-120's burners fire at their full 120 kW during the heat-up, but during the soak they need only enough fuel to make up the 12 kW standing loss. Chapter 3 calculated that at about **19 kW of fuel**, a turndown of over 6:1, and only if the air turns down with the gas. As the next section shows, that last condition decides whether the burner can do the job efficiently at all.

## Four ways to control input

```figure
type: compare
title: Burner input control strategies
cols: How it controls | Excess air at low input | Suits
rowhead: Strategy
caption: General characteristics. Ratio control, by whatever means, is what keeps excess air near its design value across the range.
- On–off | fires at full input or not at all | as set at full input | small appliances; large temperature swings in a furnace
- High–low | switches between two fixed inputs | depends on how the air is switched | simple process heaters
- Modulating gas, fixed air | varies gas only | rises steeply as gas falls | low-temperature processes that need extra air anyway
- *Modulating with ratio control | varies gas and air together | close to the design value | furnaces and most process heating
```

### Ratio control

Three common ways of keeping gas and air in step are:

1. **Mechanical linkage.** One actuator moves both the air butterfly and the gas valve through a linkage with an adjustable cam. Simple and robust, but the ratio is set at a few points and drifts as the linkage wears.
2. **Pneumatic ratio regulator.** The air pressure at the burner is piped through a small **impulse line** to a regulator in the gas line, which sets the gas pressure to follow it. Only the air is modulated; the gas follows. TF-120 uses this arrangement.
3. **Electronic ratio control.** Separate actuators on air and gas, positioned by a controller from a set of commissioned points, often with oxygen trim. The most accurate and flexible, and the most expensive.

Even with ratio control, burners are usually set with a little more excess air at low fire than at high fire, because mixing is weaker at low velocities. TF-120 is commissioned at **3.0% oxygen (15% excess air) at high fire** and about **5.3% oxygen (30% excess air) at low fire**. Whatever the method, ratio control is commissioned at several points across the range, not just at the top and bottom, because the curves of an air butterfly and a gas valve are not straight and a ratio that is right at both ends can be wrong in the middle. The commissioned values belong on the appliance's records, where the next technician can compare against them, and a change to them is made by the gasfitter responsible for the appliance.

## Why fixed air wastes fuel at low fire

When a burner turns its gas down but keeps its air at the high-fire setting, the excess air rises in proportion. Air set for 15% excess at full input becomes 130% excess at half input, 245% at a third, and 360% at a quarter. All that extra air is heated to flue temperature and carried away.

```figure
type: compare
title: TF-120 with its air fixed at the high-fire setting, flue at 620 °C
cols: Gas input | Excess air | Available heat
rowhead: Turndown
caption: This is an illustration, calculated for methane. At 4:1 with fixed air, heating the excess air to flue temperature takes more energy than the fuel releases, so the furnace cannot even hold its temperature.
- 1:1 | 120 kW | 15% | 64.0%
- 2:1 | 60 kW | 130% | 41.5%
- 3:1 | 40 kW | 245% | 19.1%
- 4:1 | 30 kW | 360% | negative
```

The last row is striking but real. Air at 360% excess, heated from 25 °C to 620 °C, absorbs more energy than the gas releases, so a furnace at 600 °C would cool down with the burner firing. With fixed air, the controller can only hold temperature by firing harder: solving for the input at which the fuel times its available heat equals the 12 kW loss gives about **45 kW**, at about 206% excess air and an available heat of only 26.6%.

```figure
type: stats
title: Holding TF-120 at 600 °C through a 2-hour soak
caption: This is an illustration. Ratio control holds 15% excess air; fixed air settles at about 206%. The difference is about a quarter of the fuel for a whole load.
- 18.8 kW | fuel with ratio control, available heat 64.0%
- 45.1 kW | fuel with air fixed at the high-fire setting
- 52.6 kWh | extra fuel per load with fixed air
- 25% | of the 206.9 kWh a load needs with ratio control
```

Over 500 loads a year, fixed air would cost about 26 MWh, nearly 95 GJ of gas, more than the recuperator of Chapter 4 could ever save, for want of a regulator that makes the air follow the gas.

There is one place where high excess air at low fire is deliberate. In low-temperature ovens and dryers, burners are often run with large excess air to give a big volume of moderately hot gas that heats the work evenly, and in ovens drying solvent-based coatings, extra air keeps the solvent vapour well below its flammable range. In those cases the excess air has a purpose. In a 600 °C tempering furnace it does not.

### Flame stability at low fire

A burner's minimum stable input is set by its flame, not its valves. At low fire the gas and air leave the nozzle slowly, mixing is weaker, and the flame is held less firmly; turn the burner down too far and the flame lifts away from the nozzle, flickers, or goes out. Nozzle-mix burners hold their flames over wide ranges partly because of a stabilising zone at the nozzle where some of the hot products recirculate and keep relighting the incoming mixture. The burner maker states the stable range for a given air–fuel ratio and chamber condition, and commissioning confirms it on the furnace, because a flame that is stable in the maker's test rig may not be in a cold furnace with a strong draught.

That is also why excess air is usually raised a little at low fire. More air at low input keeps the air velocity, and therefore the mixing and flame stability, closer to what the burner was designed for, at a modest cost in available heat. TF-120's 30% at low fire is an example: at 620 °C, it lowers the available heat from 64.0% to 61.1%, and the soak fuel from 18.8 kW to 19.7 kW, about 2 kWh a load, in exchange for a flame that stays put.

## How the temperature controller uses the burner

The furnace's temperature controller decides the burner input moment by moment, and the control strategy decides what it can ask for. With modulating ratio control, the controller can settle the burners at the 19 or 20 kW the soak needs and hold the chamber within a few kelvin of its set point. With on–off control, the burners must cycle between full input and off, so that their average equals the loss: about 16% of the time at full fire during TF-120's soak. The chamber temperature then swings around the set point, and each restart costs fuel.

The cost comes from purging. Before any restart, the chamber is swept with air to clear any unburned gas, as Chapter 8 explains, and that air enters cold and leaves hot. A 2-minute purge with TF-120's fan at its full 130 m³/h passes about 4.2 standard m³ of air, which takes about 3.1 MJ, or **0.87 kWh**, to heat from 25 °C to 600 °C, and about 1.35 kWh of fuel to replace at the available heat. A burner cycling six times an hour through a 2-hour soak would add about 16 kWh of fuel a load just in purges, before counting the wear on ignition parts and valves. Modulation avoids both.

### Two burners, one flue

TF-120 has two burners but one flue, and the flue gas analysis sees their average. If one burner runs at 1% oxygen and the other at 5%, the flue shows about 3%, which is the setting, while one burner makes carbon monoxide and the other wastes heat. Each burner therefore needs its own check, either at a sampling point in its own exhaust path or by firing one burner at a time, before the combined reading means anything. Ratio regulators, linkages and impulse lines on the two burners can drift independently, which is one more reason to check both across the range.

## The combustion air fan

The combustion air fan has to supply the high-fire air at the pressure the burners need. TF-120 at high fire needs 125.9 standard m³/h of air, as Chapter 1 calculated, which at the 25 °C air entering the fan is 125.9 × 298.15 ÷ 288.15 = **130.3 m³/h**, or about **0.036 m³/s**. The burner maker's data, for this illustration, call for about **2.5 kPa** of air pressure at the burners at high fire, including the losses in the air pipework and control butterfly.

The [fan duty, fan laws and belt drive tool](/tools/fan-drive-sizing/) calculates the air power and shaft power from the flow, the fan total pressure and the fan efficiency, and applies the fan laws for a change in flow. With 0.0362 m³/s, 2.5 kPa and a fan efficiency of 55%, the air power is about **91 W** and the shaft power about **165 W**. The fan is small compared with the 120 kW it serves, which is typical. Its importance is not its energy but its reliability: the burners cannot fire without it, and the flame safeguard checks for air pressure before it allows ignition, as Chapter 8 describes.

## The error: a fault that lived at low fire

This is an illustration. TF-120's annual service had always checked the flue gas at high fire, where the burners were set at 3.0% oxygen. One year, after a service that found nothing wrong, the furnace's fixed analyser began to show odd readings during soaks: the oxygen fell to about 1% and the carbon monoxide rose to several hundred ppm, while during heat-ups, at high fire, everything looked normal.

The technician who was called back checked at low fire, which the previous service had not done, and confirmed the readings. The ratio regulator should have reduced the gas pressure as the air butterfly closed, but it was not following. The cause was the regulator's impulse line, the small tube that carries the air pressure to the regulator: it had partly filled with dust and condensate at a low point and was responding only slowly, so that when the air was turned down the gas pressure stayed high. At high fire the line's pressure had time to settle, and the ratio was correct; at low fire, with the air changing, the gas ran rich.

The line was cleaned, rerouted to fall continuously back towards the burner with no low point, and the burners rechecked at high, middle and low fire. The service sheet now requires oxygen and carbon monoxide at three firing rates, and records them so that a change from one year to the next stands out.

```figure
type: checklist
title: TF-120's burner check across the range
caption: The open item is this chapter's error. A burner checked only at high fire is checked at the condition where it spends the least time.
- x High fire | 3.0% O₂, CO below 50 ppm, 120 kW clocked at the meter
- x Air pressure switch and flame safeguard tested | by the gasfitter, to the appliance's procedure
- x Impulse lines inspected | clean, no low points, no cracks
- ? Middle and low fire | oxygen and CO not checked: the rich low-fire fault went unseen
```

## Exercise: the soak with fixed air

The shop considers a cheaper replacement burner control that modulates the gas but keeps the air fixed at the high-fire setting. For the 2-hour soak, how much fuel would TF-120 burn, and what would the extra cost a year be over 500 loads at A$0.108/kWh?

**Worked answer.** From the chapter, holding the 12 kW loss with fixed air needs about **45.1 kW** of fuel, against **18.8 kW** with ratio control. Over 2 hours that is 90.1 kWh against 37.5 kWh, an extra **52.6 kWh** per load. Over 500 loads, the extra is about 26,300 kWh, which at A$0.108/kWh is about **A$2,840 a year**. Any saving in the price of the control would be spent within a year or two, and the furnace would also need its burners to work stably at 206% excess air, which many burners cannot do. The cheaper control is false economy for a high-temperature furnace.
