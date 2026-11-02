---
book: flow-measurement-by-the-numbers
chapterSlug: coriolis-mass-flowmeters
order: 5
title: "Coriolis mass flowmeters"
description: "How vibrating tubes measure mass flow by the Coriolis effect and density by their frequency, zero stability, pressure loss, checks in place, and gas bubbles that made the wort look weak."
draft: false
---

Most flowmeters measure velocity and infer volume, and anything that needs mass must then multiply by a density that someone has to know. The Coriolis meter measures mass flow directly. It vibrates a tube through which the fluid flows and senses a tiny twist in the vibration that is proportional to the mass passing per second. The same vibrating tube, by its natural frequency, measures the fluid's density, and a temperature sensor on the tube gives the temperature. From one instrument a brewer gets mass flow, density, gravity and temperature, independent of the velocity profile and almost independent of the fluid's viscosity.

This chapter explains the Coriolis effect in a vibrating tube, works out how the tube's frequency measures the wort's density, considers zero stability, pressure loss and the effects of temperature and pressure, and finishes with an oxygenation point moved upstream of the meter, which made a strong wort read like a weak one.

## The Coriolis effect in a vibrating tube

A body moving across a rotating frame feels a sideways force, the Coriolis force, proportional to its mass, its velocity and the rate of rotation. Walk outwards across a turning roundabout and you feel pushed sideways. A Coriolis meter makes a tube rotate, a little, by vibrating it at its natural frequency like a tuning fork, so that each half of the tube swings back and forth about its mounting. Fluid flowing through the tube moves across that swinging motion and feels the Coriolis force: on the inlet half it resists the swing, on the outlet half it assists it. The tube twists slightly, the inlet half lagging the outlet half in its vibration.

Sensors near the inlet and outlet measure the vibration's phase at each end. With no flow, they move in step. With flow, the outlet leads the inlet by a time difference that is proportional to the mass flow and independent of the fluid's density, viscosity or velocity profile.

```figure
type: formula
title: Coriolis force and the meter's two measurements
formula: Coriolis force on a moving mass: F = 2 m (ω × v)
formula: Mass flow: ṁ = K_c × Δt        Density from the tube's frequency: f = (1 ÷ 2π) √[k ÷ (m_tube + ρ V_i)]
caption: ω is the angular velocity of the tube's swinging motion and v the fluid's velocity along it. Δt is the time difference between the inlet and outlet sensors, K_c a calibration constant, k the tube's stiffness, m_tube its mass and V_i its internal volume.
- Δt | time difference between inlet and outlet vibration, µs
- f | natural frequency of the filled tube, Hz
- ρ | fluid density
```

## Density from the tube's frequency

A vibrating tube is a mass on a spring. Its natural frequency depends on its stiffness and on the total mass that vibrates: the tube itself plus the fluid inside it. A denser fluid adds more mass and lowers the frequency. Calibrated with two fluids of known density, usually air and water, the meter can work out the density of any other fluid from its frequency.

For illustration, take FT-201's measuring tube as holding 0.5 L and vibrating at 190.0 Hz when full of air and 160.0 Hz when full of water at 998.2 kg/m³. Those two points fix the tube's effective mass at 1.215 kg and its stiffness at 1.732 × 10⁶ N/m. Full of wort at 1,048 kg/m³, the tube then vibrates at 158.85 Hz.

```figure
type: compare
title: FT-201's tube frequency with different contents
cols: Density | Tube frequency
rowhead: Contents
- Air | 1.2 kg/m³ | 190.00 Hz, calibration point
- Water at 20 °C | 998.2 kg/m³ | 160.00 Hz, calibration point
- * Wort, about 12 °P | 1,048 kg/m³ | 158.85 Hz
- Wort with 2.7% gas bubbles by volume | about 1,020 kg/m³ apparent | 159.49 Hz
caption: This is an illustration. Near the wort's density the frequency falls by 0.0228 Hz for each kg/m³, so a frequency resolution of 0.001 Hz resolves about 0.04 kg/m³.
```

Near the wort's density, the frequency changes by 0.0228 Hz for each kg/m³. Measuring the frequency to 0.001 Hz, routine for the meter's electronics, resolves the density to about 0.04 kg/m³, equivalent to about 0.01 °P. That is why breweries use Coriolis meters to monitor gravity at the brewhouse: the meter is an in-line density meter as well as a flowmeter.

### Temperature and pressure

The tube's stiffness falls slightly as it warms, which would lower its frequency and look like a denser fluid. The meter measures the tube's temperature and corrects for it. High pressure stiffens and slightly expands the tube, which affects both the density and the mass flow readings by small amounts that the maker states and that larger meters correct with a pressure input. For FT-201, at a few bar and about 18 °C, neither effect is significant beyond the meter's own compensation.

## Mass flow and the zero

The time difference between the sensors at full flow is small, some tens of microseconds for a meter of this size, and at no flow it should be zero. In practice there is a small residual, the zero offset, from the tubes' slight asymmetries and their mountings. Makers state a zero stability, a flow in kilograms per hour within which the meter's zero can be relied on, and it is the meter's dominant uncertainty at low flows.

For FT-201, a zero stability of ±0.6 kg/h is 0.005% of its normal 12,576 kg/h, negligible, but 0.12% at 500 kg/h. The zero should be set with the meter full of the process fluid, at its operating temperature and pressure, with flow positively stopped by valves either side: zeroing with flow still trickling, or with the meter partly empty, builds an error into every later reading.

## Pressure loss

The fluid must pass through the vibrating tubes, which are usually narrower than the line and often bent, so a Coriolis meter has more pressure loss than a magnetic meter of the same line size, typically a few tenths of a bar at full flow for a liquid like wort. The maker's sizing program gives the loss at the actual flow, density and viscosity. It matters for viscous products and for lines where the pressure available is limited; in the wort line, pumped from the brewhouse, it is easily accommodated.

## The mistake: bubbles from the oxygenation stone

Before fermentation, wort is oxygenated so that the yeast can grow. The brewery injects oxygen through a sintered stone in the wort line, and the stone was originally downstream of FT-201. During a re-piping to shorten the line, the stone was moved upstream of the meter, to a position 2 m before it. On the next brew, the brewhouse screen showed the wort's gravity dropping from about 12 °P to about 5 °P during the transfer, and the mass flow reading became noisy.

```figure
type: steps
title: Tracing a weak-looking wort to bubbles in the meter
caption: This is an illustration. Gas bubbles lower the apparent density and disturb the tube's vibration; the wort itself was unchanged.
- Symptom | gravity reading fell from about 12 °P to about 5 °P during transfer; mass flow noisy
- Brewer's hydrometer on a sample | 12.0 °P: the wort was not weak
- Meter's density | about 1,020 kg/m³ against 1,048 expected
- Cause | oxygenation stone moved 2 m upstream; undissolved gas carried through the tubes
- * Implied gas fraction | 1 − 1,020 ÷ 1,048 = 2.7% by volume
- Fix | stone moved back downstream of the meter; drive gain alarm enabled to flag gas in the tubes
```

A hydrometer on a sample showed the wort at 12.0 °P, as planned. The meter's density had fallen to about 1,020 kg/m³, and the mixture of wort and gas that density implied contained 1 − 1,020 ÷ 1,048 = 2.7% gas by volume, oxygen not yet dissolved, carried straight from the stone into the meter's tubes. Bubbles do two things to a Coriolis meter. They lower the density of what is in the tubes, which the meter reports faithfully as a lower density, and so as a lower gravity. And they move relative to the liquid as the tubes vibrate, which disturbs the vibration, makes the time difference noisy and can make the mass flow read low by more than the gas's share. The stone was moved back downstream of the meter, which gives the oxygen time and distance to dissolve before anything else measures the wort, and the meter's drive gain alarm, which rises when gas makes the tubes harder to drive, was enabled to flag any future gas.

## What else Coriolis meters do well and badly

```figure
type: compare
title: The Coriolis meter's strengths and limits for the brewery
cols: Strength or limit | Consequence at the brewery
rowhead: Feature
- Measures mass directly | strength | wort yield and extract in kilograms without a density assumption
- Measures density | strength | in-line gravity at the brewhouse
- Insensitive to profile and viscosity | strength | short straight runs; works with syrups
- Sensitive to gas bubbles | limit | oxygenation downstream; no metering of fermenting beer with gas coming out
- Pressure loss | limit | larger than a magnetic meter's; acceptable on a pumped line
- Price | limit | several times a magnetic meter of the same size
- Vibration sensitivity | limit | mounted clear of pumps, supported on both sides
caption: This is an illustration of the brewery's assessment.
```

## Checking a Coriolis meter in place

A Coriolis meter can be checked without removing it in three ways, and the brewery uses all three.

**Density with water.** Filled with clean water at a measured temperature, the meter should read water's density at that temperature, 998.2 kg/m³ at 20 °C, within its stated density accuracy. Because the density reading depends on the same tubes as the mass flow, a density that has drifted points to a change in the tubes, such as coating, corrosion or erosion, which may affect the flow reading too.

**Zero.** With the meter full and the flow positively stopped, the indicated flow should be within the stated zero stability. A zero outside it, after the fluid has settled, is re-set under the conditions described earlier, and the event is logged, because a zero that keeps moving is a symptom.

**A batch against a weigh tank.** The most direct check is to pass a batch through the meter into a vessel on load cells and compare the two masses. The brewery does this once a year with water into a fermenter whose load cells are themselves checked against test weights, and the difference has stayed within the meter's stated 0.15% of reading.

Many meters can also verify their own tube stiffness electronically against its value at manufacture, which detects changes in the tubes without any process interruption. Like the magnetic meter's verification, it checks the meter, not its installation or its zero.

## Tube shapes and hygiene

Coriolis meters come with bent tubes, U-shaped, omega-shaped or looped, and with straight tubes. Bent tubes are more flexible, which gives a larger signal and better low-flow performance, but they are harder to drain and to clean. Straight tubes drain completely and are easy to inspect, which suits hygienic and abrasive service, at some cost in sensitivity. FT-201 has a single straight tube in a hygienic design, mounted with a slight fall so that it drains between brews, and is cleaned in place with the rest of the wort line.

## Coriolis meters on gases

Coriolis meters measure gases too, and their direct mass reading avoids the pressure and temperature corrections that Chapter 7 shows a velocity meter needs. The difficulty is the signal. A gas is a thousand times less dense than a liquid, so at the same velocity it carries a thousandth of the mass, and the meter's time difference is correspondingly small; to get a usable signal the gas must move fast, which brings a large pressure loss. Coriolis meters are therefore used for gases mainly where the mass is what matters and the pressure is available to spend, such as dosing natural gas to a burner or filling gas cylinders by mass. The brewery's carbon dioxide recovery plant considered one for metering recovered CO₂ to storage, and chose a thermal mass meter instead because the gas was at low pressure.

## Batching with a Coriolis meter

Because it measures mass, a Coriolis meter is the natural choice for batching by weight, such as dosing syrup, adjuncts or hop extract. The batch is stopped when the meter's mass total reaches the target, less an allowance for the material still flowing while the valve closes. The overrun is the flow multiplied by the valve's closing time, roughly halved if the valve closes linearly: at 12,576 kg/h, a valve that takes 2 seconds to close lets through about 12,576 ÷ 3,600 × 2 ÷ 2 = 3.5 kg after the stop signal. The batching controller learns the overrun from previous batches and stops early by that amount. The meter's response time matters as much as the valve's: a meter that averages its signal over a second to steady its reading reports the flow a second late, adding another 3.5 kg of overrun at full flow. Batching meters are therefore set with the shortest damping that keeps the reading stable, and batches are slowed to a lower flow for their last few per cent, so that the overrun is small whatever its exact value.

## Exercise: density and gravity from the tube's frequency

Using the illustrative tube constants of this chapter, an effective tube mass of 1.215 kg, an internal volume of 0.5 L and a stiffness of 1.732 × 10⁶ N/m, calculate the density of a liquid that gives a frequency of 158.40 Hz, and its approximate gravity in degrees Plato using °P ≈ 259 − 259 ÷ SG with water at 998.2 kg/m³ as the reference. Then say what a fall in frequency of 0.05 Hz would mean during a transfer.

### Answer

**Given:** m_tube = 1.215 kg; V_i = 5.0 × 10⁻⁴ m³; k = 1.732 × 10⁶ N/m; f = 158.40 Hz.

**Assumptions:** temperature compensation already applied; no gas in the tubes; the frequency formula of this chapter.

**Method:** rearrange f = (1 ÷ 2π) √[k ÷ (m_tube + ρ V_i)] for ρ.

**Density:** m_tube + ρ V_i = k ÷ (2π f)² = 1.732 × 10⁶ ÷ (995.26)² = 1.732 × 10⁶ ÷ 990,550 = 1.7486 kg. ρ = (1.7486 − 1.215) ÷ 5.0 × 10⁻⁴ = 1,067 kg/m³.

**Gravity:** SG = 1,067 ÷ 998.2 = 1.069; °P ≈ 259 − 259 ÷ 1.069 = 16.7 °P, a strong wort.

**A fall of 0.05 Hz:** at a slope of about −0.023 Hz per kg/m³, a fall of 0.05 Hz means the density rose by about 2.2 kg/m³, about 0.5 °P. During a transfer, a gradual rise like that is normal at the start, as the first, weaker runnings clear the line; a sudden rise of the frequency instead, with a noisy mass flow, points to gas.

**Verification:** putting ρ = 1,067 kg/m³ back into the frequency formula gives √(1.732 × 10⁶ ÷ 1.7485) ÷ 2π = 158.40 Hz, and the density lies above wort at 12 °P, consistent with a frequency below that wort's 158.85 Hz.
