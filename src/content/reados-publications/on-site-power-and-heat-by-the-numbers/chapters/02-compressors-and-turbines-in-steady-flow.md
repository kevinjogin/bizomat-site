---
book: on-site-power-and-heat-by-the-numbers
chapterSlug: compressors-and-turbines-in-steady-flow
order: 2
title: "Compressors and turbines in steady flow"
description: "The steady-flow energy equation for compressors, turbines, nozzles and throttles, isentropic efficiency from measured temperatures, and a turbocharger test that checks its own power balance."
draft: false
---

Most of the machines in a power plant are open systems: gas or steam flows in, something happens to it, and it flows out. A compressor, a turbine, a nozzle, a valve and a heat exchanger each change the state of a flowing fluid, and each is analysed with the same equation, the steady-flow form of the first law. With that equation and a thermometer at each end, an engineer can find how much power a machine absorbs or delivers and how close it comes to the ideal.

This chapter applies the equation to the four devices that appear throughout the book, then tests the gas engine's turbocharger from site measurements. The turbocharger is a useful case because its compressor and turbine share a shaft: the power one absorbs must equal the power the other delivers, less a little friction, so the test checks itself. It ends with a thermometer that read too low and produced an efficiency of 112%.

## The steady-flow energy equation

For a fluid flowing steadily through a control volume, with mass flow ṁ, heat added Q̇ and shaft work done by the fluid Ẇ, the first law says:

Q̇ − Ẇ = ṁ [(h₂ − h₁) + (V₂² − V₁²) ÷ 2 + g (z₂ − z₁)]

where h is the specific enthalpy, V the velocity and z the height. Enthalpy is the quantity to use for a flowing fluid because it includes the work done pushing the fluid in and out of the machine. For an ideal gas with constant specific heat, h₂ − h₁ = c_p (T₂ − T₁), which is why a thermometer is the main instrument for testing gas machines.

Most terms vanish for most machines. The height term is tiny: a 10 m rise is 0.1 kJ/kg. The velocity term matters only in nozzles and diffusers, whose purpose is to change velocity.

This is an illustration. The gas engine's exhaust, 0.64 kg/s at 470 °C and near atmospheric pressure, has a density of 101.325 ÷ (0.287 × 743.15) = 0.475 kg/m³. In a 150 mm pipe it moves at 0.64 ÷ (0.475 × 0.01767) = 76 m/s, and its kinetic energy is 76² ÷ 2 = 2.9 kJ/kg. Against the 270 K of cooling, about 290 kJ/kg, that the exhaust steam generator in Chapter 9 takes from it, the velocity term is about 1% and can be left out of an energy balance at the level of accuracy of the measurements.

## Four devices, one equation

```figure
type: compare
title: The steady-flow energy equation reduced for each device
rowhead: Device
cols: Heat | Work | Velocity change | What remains
caption: Each simplification is an assumption to state and, where it matters, to check. A compressor with a water jacket or oil injection is not adiabatic, and its outlet temperature cannot be used to find its work.
- Compressor or blower | none (adiabatic) | absorbed | small | Ẇ = ṁ c_p (T₂ − T₁)
- Turbine or expander | none (adiabatic) | delivered | small | Ẇ = ṁ c_p (T₁ − T₂)
- Nozzle | none | none | large | V₂ = √(2 (h₁ − h₂)), V₁ small
- Throttle or valve | none | none | small | h₂ = h₁
- Heat exchanger | the duty | none | small | Q̇ = ṁ (h₂ − h₁) for each stream
```

### Compressors and turbines

An uncooled compressor or turbine runs too fast for much heat to leave the gas, so it is treated as adiabatic. The work then equals the change in enthalpy, and for an ideal gas the change in temperature times c_p. The benchmark for such a machine is the reversible adiabatic, or **isentropic**, process between the same pressures. For an ideal gas with ratio of specific heats k = c_p ÷ c_v:

T₂s = T₁ × (p₂ ÷ p₁)^((k − 1) ÷ k)

The **isentropic efficiency** compares the ideal temperature change with the real one. For a compressor, the real machine needs more work than the ideal, so η = (T₂s − T₁) ÷ (T₂ − T₁). For a turbine, the real machine delivers less, so η = (T₁ − T₂) ÷ (T₁ − T₂s). Both lie between 0 and 100%. A figure outside that range does not describe a poor machine; it describes a wrong measurement or a machine that is not adiabatic.

### Nozzles

A nozzle turns enthalpy into velocity. Gas that drops 60 kJ/kg of enthalpy in a well-shaped nozzle, starting from rest, leaves at √(2 × 60,000) = 346 m/s. Turbines are built from nozzles and moving blades: the nozzles make the jet, and the blades turn its momentum into torque. The velocity term in the equation is the whole point of a nozzle, so it can never be dropped there.

### Throttles

A valve, orifice or regulator that drops pressure without doing work leaves the enthalpy unchanged. That is all the equation says, but its consequences are large.

This is an illustration. The laundry's steam calorifier is fed through a pressure-reducing valve from 10 bar gauge to 2 bar gauge. Saturated steam at 1,101.3 kPa absolute has h = 2,780.7 kJ/kg (IAPWS-IF97). After the valve, at 301.3 kPa absolute, the same enthalpy corresponds to slightly superheated steam at 159.2 °C, about 25.5 K above saturation at that pressure. No energy has been lost, but the steam can now do less work: the pressure drop that a turbine could have used has been spent in turbulence. Chapter 8 asks whether a small back-pressure turbine could replace the valve. The second-law view of throttling is set out in [Throttling, mixing and friction](/reados/publications/entropy-by-the-numbers/throttling-mixing-and-friction/) in *Entropy by the Numbers*.

### Heat exchangers

A heat exchanger does no work and, if well insulated, loses little heat to its surroundings, so the equation applied to the whole exchanger says that the enthalpy one stream loses the other gains. Applied to one stream, it gives the duty. This is the balance behind every heat-recovery figure in Chapters 9 and 10.

This is an illustration. The exhaust steam generator in Chapter 9 cools 0.64 kg/s of exhaust from 470 °C to 200 °C. Its duty is 0.64 × 1.07 × 270 = 184.9 kW. On the water side, feedwater enters at 80 °C (h = 335.87 kJ/kg) and leaves as saturated steam at 10 bar gauge (h = 2,780.7 kJ/kg), a rise of 2,444.8 kJ/kg, so the exchanger raises 184.9 ÷ 2,444.8 = 0.0756 kg/s, or 272 kg/h, of steam. Measuring both sides and comparing them is the standard check on a heat-recovery test: if the gas side says 185 kW and the water side 150 kW, either a flow meter is wrong, the exhaust is bypassing the tubes or the casing is losing heat.

## The turbocharger

A turbocharger uses the energy left in an engine's exhaust to compress the air going in. The exhaust drives a small turbine; the turbine drives a compressor on the same shaft; the compressor pushes more air into the cylinders than the pistons could draw in alone, so more fuel can be burned in the same engine. A charge-air cooler between the compressor and the engine removes the heat of compression, because cooler air is denser.

```figure
type: svg
title: The gas engine's turbocharger and its measuring points
alt: A schematic of a turbocharger. On the left, outside air enters a compressor at point 1, 99 kPa absolute and 30 degrees, and leaves at point 2, 250 kPa and 151 degrees, flowing to a charge-air cooler and then the engine. A shaft joins the compressor to a turbine on the right. Exhaust from the engine enters the turbine at point 3, 230 kPa and 575 degrees, and leaves at point 4, 103 kPa and 470 degrees, towards the exhaust steam generator.
caption: This is an illustration. Air flow 0.62 kg/s; exhaust flow 0.64 kg/s, the extra 0.02 kg/s being the fuel. Pressures are absolute. Each measuring point needs a thermometer in the gas stream and a pressure tapping close to the machine.
viewbox: 0 0 640 320
body:
<path class="bx" d="M120 100L220 130V230L120 260Z"/>
<path class="bxa" d="M520 100L420 130V230L520 260Z"/>
<path class="li" d="M220 180H420"/>
<text class="txb" x="135" y="186">compressor</text>
<text class="txb" x="440" y="186">turbine</text>
<text class="txs" x="285" y="172">shared shaft</text>
<path class="ln" d="M30 230H120"/>
<path class="ah" d="M110 224L122 230L110 236Z"/>
<text class="txs" x="20" y="252">1: 99 kPa, 30 °C</text>
<path class="ln" d="M170 100V50H300"/>
<path class="ah" d="M290 44L302 50L290 56Z"/>
<text class="txs" x="120" y="40">2: 250 kPa, 151 °C</text>
<rect class="bxi" x="302" y="30" width="80" height="40" rx="4"/>
<text class="txs" x="312" y="55">air cooler</text>
<path class="ln" d="M382 50H420"/>
<rect class="bx" x="420" y="20" width="80" height="60" rx="4"/>
<text class="txb" x="437" y="56">engine</text>
<path class="la flow" d="M500 50H590V140H520"/>
<path class="ah" d="M530 134L518 140L530 146Z"/>
<text class="txa" x="540" y="166">3: 230 kPa</text>
<text class="txa" x="540" y="184">575 °C</text>
<path class="la" d="M520 230H610"/>
<path class="ah" d="M600 224L612 230L600 236Z"/>
<text class="txs" x="380" y="290">4: 103 kPa, 470 °C, to steam generator</text>
```

### The compressor test

This is an illustration. During commissioning of a similar engine at another site, the supplier's engineer logged the following at full load: air at 99 kPa absolute and 30 °C entering the compressor, 250 kPa absolute and 151 °C leaving, and an air flow of 0.62 kg/s, worked out from the fuel flow and the measured exhaust oxygen in the way Chapter 5 shows.

```figure
type: formula
title: Isentropic efficiency of the turbocharger compressor from measured temperatures
formula: T₂s = T₁ × (p₂ ÷ p₁)^((k − 1) ÷ k)
formula: η_c = (T₂s − T₁) ÷ (T₂ − T₁)
caption: This is an illustration for air with c_p = 1.005 kJ/kg·K and k = 1.4, matching the Compressor or Turbine Isentropic Efficiency Check.
- T₁, p₁ | 303.15 K, 99 kPa absolute
- T₂, p₂ | 424.15 K, 250 kPa absolute
step: Pressure ratio 250 ÷ 99 = 2.525
step: T₂s = 303.15 × 2.525^0.2857 = 395.0 K, or 121.85 °C
step: η_c = (121.85 − 30) ÷ (151 − 30) = 91.85 ÷ 121 = 75.91%
step: Power absorbed = 0.62 × 1.005 × 121 = 75.40 kW; isentropic power 57.23 kW
```

The [Compressor or Turbine Isentropic Efficiency Check](/tools/compressor-turbine-efficiency-check/) does exactly this from the measured inlet and outlet pressures and temperatures, the gas's c_p and k and the mass flow. It returns the isentropic outlet temperature, the isentropic efficiency, the gas power absorbed (or delivered, for a turbine), the isentropic power, the pressure ratio, and the specific entropy change and entropy generation rate, and it checks the efficiency against a minimum you set and against the physical limit of 100%. For the compressor it gives 75.91%, 75.395 kW absorbed against 57.234 kW ideal, and an entropy rise of 0.07155 kJ/kg·K, or 0.04436 kW/K for the flow.

The 18.16 kW difference between real and ideal work is extra heat in the compressed air. It does no good: the charge-air cooler removes it, part into the jacket water and part into a low-temperature circuit, before the air reaches the cylinders. Multiplying the entropy generation by the surroundings' absolute temperature gives the work destroyed by the compressor's irreversibility: 298.15 × 0.04436 = 13.2 kW.

### The turbine test

The exhaust entering the turbine is not air. It is hot, contains water vapour and carbon dioxide, and has a higher c_p and lower k. This is an illustration. Using c_p = 1.15 kJ/kg·K and k = 1.33 for the exhaust, inlet conditions of 230 kPa absolute and 575 °C and outlet conditions of 103 kPa and 470 °C, with 0.64 kg/s of exhaust, the same tool in turbine mode gives:

- isentropic outlet temperature 421.72 °C, against the measured 470 °C;
- isentropic efficiency (575 − 470) ÷ (575 − 421.72) = **68.5%**;
- power delivered 0.64 × 1.15 × 105 = **77.28 kW**, against 112.811 kW for an isentropic turbine;
- entropy generation 0.04944 kW/K, or 14.7 kW of work destroyed.

With the tool's default minimum of 75% the turbine shows as below minimum. Small turbocharger turbines are less efficient than large ones, and the engineer set 65% as the minimum for this check, which the measured 68.5% passes. The minimum is the user's choice and should come from the turbocharger maker's data, not from the tool's default.

### The power balance

The compressor and turbine share a shaft. In steady running the turbine's power must equal the compressor's power plus the bearing and windage losses, which in a turbocharger are small.

```figure
type: bars
title: Turbocharger power balance at full load
unit: kW
max: 120
caption: This is an illustration. The turbine delivers 1.89 kW more than the compressor absorbs, 2.4% of its output, which is a plausible bearing and windage loss. A large mismatch would point to a wrong temperature, flow or c_p.
- Isentropic turbine power available | 112.81
- * Turbine power delivered | 77.28
- Compressor power absorbed | 75.40
- Isentropic compressor power | 57.23
```

A power balance is the best single check on a turbocharger test. If the turbine appeared to deliver 60 kW while the compressor absorbed 75 kW, the shaft would be slowing down, which it is not in steady running, so one of the temperatures, flows or specific heats would be wrong. The check costs nothing and catches most measurement errors before they reach a report.

## The error: a compressor that was 112% efficient

This is an illustration. In the first set of readings at that site, the compressor outlet temperature was logged as **112 °C**. The tool returned an isentropic efficiency of 112.02%, a power of only 51.09 kW and a fall in entropy of 0.02539 kJ/kg·K, with the verdict **check the measurements**.

An adiabatic compressor cannot reduce the entropy of the gas passing through it, and it cannot need less work than the isentropic ideal. Either heat had left the air during compression, which does not happen in an uncooled turbocharger compressor, or the thermometer was not reading the compressor outlet temperature.

The power balance pointed the same way: 51.09 kW absorbed against 77.28 kW delivered would have meant the shaft was gaining 26 kW with nowhere to put it. On inspection, the thermocouple had been fitted in a pocket at the inlet flange of the charge-air cooler, where the gas had already given up heat to the cooler's casing and the pocket sat partly out of the main flow. Moved to a tapping in the compressor outlet pipe, two diameters from the housing, it read 151 °C, and the efficiency and power balance above followed.

The opposite error is just as easy. A thermocouple touching the turbine housing, heated by the exhaust, might read 162 °C at the compressor outlet. The tool would then give 69.59% and 82.25 kW, a plausible-looking but wrong result that only the power balance would catch, since 82 kW absorbed would exceed the 77 kW the turbine delivers.

### Getting the measurements right

1. Fit thermometers so the sensing tip sits in the main gas stream, away from walls, flanges and other hot or cold metal.
2. Measure close to the machine, before any cooler, heater or long uninsulated pipe can change the temperature.
3. Use absolute pressures in the formula. Add the local barometric pressure to gauge readings.
4. Take c_p and k for the actual gas at its temperature. Air at 30 °C and the engine exhaust here differ in c_p by about 14% (1.005 against 1.15 kJ/kg·K).
5. Check that the machine is adiabatic. Oil-injected and water-jacketed compressors, and any machine with a hot casing exposed to a draught, cannot be tested by temperature rise alone.
6. Close the loop with a balance: shaft power, an energy balance or a second instrument.

## How this applies to a small Australian business

The steady-flow equation turns a few thermometers and pressure gauges into a performance test. A plant with an air blower, a gas engine, a steam turbine or a compressor can track the machine's isentropic efficiency over time from its own instruments: a falling efficiency points to fouling, wear or internal leakage long before a breakdown. The test works only when the machine is adiabatic, the instruments are in the right places and the gas properties are right, so it should be set up once with care and then repeated in the same way.

Service contractors and suppliers will usually test engines and turbochargers against the maker's data, and their reports are worth reading with this chapter in hand: check that the efficiencies are between 0 and 100%, that the power balances, and that pressures are absolute. Work on pressurised and hot equipment needs the permits and isolation procedures that the site's safety system requires.

## Exercise: a blower test

A rotary blower supplying aeration air takes air at 100 kPa absolute and 25 °C and delivers 0.30 kg/s at 160 kPa absolute and 78 °C. Using c_p = 1.005 kJ/kg·K and k = 1.4 for air, find the isentropic outlet temperature, the isentropic efficiency and the power absorbed by the air.

**Worked answer.** The pressure ratio is 1.6, so T₂s = 298.15 × 1.6^0.2857 = 341.0 K, or 67.85 °C. The ideal temperature rise is 67.85 − 25 = 42.85 K and the real rise 78 − 25 = 53 K, so the isentropic efficiency is 42.85 ÷ 53 = **80.85%**. The power absorbed by the air is 0.30 × 1.005 × 53 = **15.98 kW**; the isentropic power is 0.30 × 1.005 × 42.85 = 12.92 kW. The Compressor or Turbine Isentropic Efficiency Check gives the same figures.

The motor's electrical input will be higher again, by the drive and motor losses, which the temperature test does not see. If the blower's motor draws 18.5 kW, for example, the drive train and motor lose about 2.5 kW, and the overall efficiency from electricity to ideal air power is 12.92 ÷ 18.5 = 69.8%. Tracking both figures separates a blower that is wearing from a belt that is slipping or a motor that is running hot.
