---
book: random-error-and-drift-by-the-numbers
chapterSlug: thermal-noise-floor
order: 6
title: "The thermal noise floor"
description: "Calculate the Johnson–Nyquist noise of CW-5's strain-gauge bridge and the thermal motion of its load cell, compare them with amplifier and mechanical noise, and see why more excitation backfired."
draft: false
---

Below every other source of noise there is one that cannot be removed: the thermal agitation of matter itself. The electrons in a resistor jiggle with thermal energy, producing a tiny random voltage across it; the structure of a load cell jiggles too, producing a tiny random force. These are the electrical and mechanical twins of Brownian motion, driven by the same thermal energy kT that moves pollen grains in water, and they set a floor beneath which no measurement made at room temperature can go.

This chapter calculates the thermal noise of CW-5's strain-gauge bridge and the thermal motion of its load cell, converts both into grams, compares them with the amplifier's noise and the mechanical noise found in earlier chapters, and draws the practical conclusion about where improvement can and cannot come from. The failure case is an attempt to raise the signal by doubling the bridge excitation.

## Johnson–Nyquist noise

In 1928, John B. Johnson measured a random voltage across resistors that grew with their resistance and their temperature, and Harry Nyquist explained it the same year from the thermodynamics of the electrons. The mean square noise voltage across a resistance R at absolute temperature T, measured over a bandwidth B, is **v² = 4 k T R B**, where k is Boltzmann's constant. The noise is white: it has the same power in every hertz of bandwidth, so its **noise density**, √(4kTR), is quoted per square root of hertz.

Nyquist's derivation rests on the same principle Einstein used for Brownian motion: in thermal equilibrium, every mode of motion carries an average energy of ½kT, and the fluctuations that deliver that energy are tied to the dissipation, the friction or resistance, that removes it. That link, the **fluctuation–dissipation** relation, is why the resistance appears in the formula: a resistor dissipates electrical energy, so it also fluctuates.

```figure
type: formula
title: Thermal noise of CW-5's 350 Ω strain-gauge bridge
formula: v_rms = √(4 k T R B)
caption: This is an illustration at 20 °C, treating the bridge as a 350 Ω source. CW-5's load cell gives 2 mV/V at 5 V excitation, 10 mV for 1,000 g, or 10 µV per gram.
- Noise density | √(4 × 1.380649 × 10⁻²³ × 293.15 × 350) ≈ 2.38 nV/√Hz
- Over a 500 Hz bandwidth, one sample | 2.38 × √500 ≈ 53 nV, about 0.0053 g
- Over a 200 ms average, about 2.5 Hz | 2.38 × √2.5 ≈ 3.8 nV, about 0.0004 g
step: The bridge's own thermal noise is about a hundredth of the 0.5 g broadband noise per sample
```

## The amplifier and converter

The signal from the bridge is a few millivolts, and it must be amplified and converted before it is a number. The amplifier adds noise of its own, specified by its maker as an input voltage noise density, typically larger than the bridge's thermal noise. Taking a teaching value of **10 nV/√Hz** for a precision instrumentation amplifier, over a 500 Hz bandwidth it adds about **224 nV**, about **0.022 g**, four times the bridge's thermal noise. Amplifiers also have low-frequency **flicker noise**, which rises at low frequencies and contributes to slow wander; Chapter 5's Allan chart is where it would show as a flat region. The converter adds quantisation and its own noise, usually small with a modern high-resolution converter.

Combined, the electronic noise of CW-5 is about **0.023 g** per sample.

## The load cell's own Brownian motion

The load cell is a spring. Like any spring in thermal equilibrium, its deflection fluctuates, with an energy of ½kT on average in each mode. For a spring of stiffness s, the root-mean-square thermal displacement is **√(kT ÷ s)**.

A 1 kg load cell that deflects about 0.2 mm at its full-scale load of 9.81 N has a stiffness of about **49,000 N/m**. Its thermal displacement is about **√(4.05 × 10⁻²¹ ÷ 49,050) ≈ 2.9 × 10⁻¹³ m**, smaller than an atomic nucleus is wide, equivalent to a force of about **1.4 × 10⁻⁸ N**, or about **1.4 micrograms**. That is the true thermal floor of the mechanical part of CW-5, and it is about a millionth of a gram: irrelevant for a checkweigher, though it matters for the most sensitive balances and for atomic force microscopes, which are limited by exactly this effect.

## Where CW-5's noise actually comes from

Putting the numbers side by side shows where the noise is.

```figure
type: bars
title: Noise per sample in CW-5, by source, in grams
unit: g
max: 0.55
caption: This is an illustration on a linear scale. The load cell's thermal motion, about 1.4 micrograms, is far too small to show. Electronic noise, including the bridge's thermal noise, is about 0.023 g; nearly all of the 0.5 g broadband noise is mechanical and environmental.
- Load cell thermal motion | 0.0000014
- Bridge thermal noise, 500 Hz | 0.0053
- Amplifier noise, 500 Hz | 0.022
- *Total broadband noise per sample | 0.5
```

The electronics contribute about 0.023 g of the 0.5 g broadband noise per sample, and since independent noises add as squares, removing them entirely would leave **√(0.5² − 0.023²) ≈ 0.4995 g**: no measurable improvement. The noise is mechanical: vibration of the frame, air currents over the conveyor, the conveyor belt itself flexing and rubbing. The thermal floor is real and fundamental, but CW-5 is nowhere near it.

The same comparison can be made directly on the line. With the conveyor stopped, the doors closed and the platform empty, CW-5's per-sample noise drops sharply; with the conveyor running and the air handling on, it returns to about 0.5 g. That simple on-and-off test, a few minutes with the controller's sample log, confirms that the noise is mechanical and environmental, without any calculation at all.

That conclusion is the practical value of the calculation. Before buying a lower-noise amplifier, a higher-resolution converter or a premium load cell, an engineer can calculate the thermal and electronic floor and compare it with the measured noise. If the measured noise is far above the floor, as it is here, the electronics are not the problem, and money is better spent on mounts, guards and air control.

```figure
type: compare
title: What each proposed improvement would buy CW-5
cols: What it changes | Effect on a 200 ms weighing
caption: This is an illustration using this book's noise model, starting from 0.092 g. Only changes that reach the mechanical noise make a visible difference; the electronic options are invisible beside it.
- Lower-noise amplifier, half the noise | electronic part from 0.023 g to about 0.012 g per sample | no measurable change
- Doubled excitation | electronic part in grams halved; more self-heating | no measurable change; more drift
- Faster converter, four times the samples | broadband part averages further | 0.092 g to about 0.087 g
- *Isolation mounts halving correlated noise | correlated part from 0.085 g to about 0.042 g | 0.092 g to about 0.055 g
```

## Hum, shielding and wiring

Not all electrical noise is thermal. A load cell cable runs past motors, drives and power cables, and picks up interference, most of it at the mains frequency of **50 Hz** and its harmonics. Unlike thermal noise, this is periodic and can be large if the wiring is poor. Three habits keep it small: running the signal pair as a twisted pair inside a shield, earthing the shield at one end only so that it does not carry circulating currents, and keeping signal cables away from drive and motor cables. Whatever hum remains is cancelled by an averaging window that contains a whole number of 20 ms mains cycles, which CW-5's 200 ms window does: it contains exactly ten.

Wiring can also cause drift. The excitation voltage reaching the bridge is the supply voltage less the drop in the cable, and the cable's copper resistance changes with temperature. A long cable whose temperature changes through the day changes the excitation, and therefore the span, by a small amount. Load cells for precise work are often connected with **six wires**: two carry excitation, two carry the signal, and two **sense** wires measure the excitation actually arriving at the bridge, so that the electronics can correct for the cable's drop. CW-5's cable is short and six-wire; the effect is negligible, but on a long run it is not, and it appears in an Allan chart as a slow, temperature-linked hump.

## Excitation, signal and self-heating

The signal from a strain-gauge bridge is proportional to its excitation voltage, so raising the excitation raises the signal in proportion, while the bridge's thermal noise and the amplifier's input noise stay the same. In grams, the electronic noise falls in inverse proportion to the excitation. That is a real benefit when electronic noise matters.

It has a cost. The bridge dissipates power V² ÷ R: about **71 mW** at 5 V in a 350 Ω bridge, and about **286 mW**, four times as much, at 10 V. The power heats the gauges, and if the heating is uneven, or if the gauges' temperature differs from the structure's, it shows up as zero and span drift, the very wander that Chapters 4, 5 and 8 work so hard to control. Load cell makers specify a recommended and a maximum excitation for that reason.

## When the thermal floor does matter

CW-5 is far above its thermal floor, but some measurements are not. Precision laboratory balances, which resolve micrograms, are built with such care in isolation, temperature control and draught shielding that their electronics and the thermal motion of their mechanisms become significant. Sensors with very small signals, such as thermocouples, which produce tens of microvolts per degree, or strain gauges on stiff structures, which may see only a few microstrain, work much closer to the electronic floor, and the choice of amplifier and bandwidth matters. Sensitive detectors of light, sound and vibration are routinely limited by thermal noise. The calculation in this chapter is quick, and it tells immediately which kind of measurement is in hand: one limited by its surroundings, where installation is everything, or one limited by physics, where electronics and bandwidth are everything.

### Temperature and the floor

Thermal noise grows with the square root of absolute temperature. Between a cold morning at 0 °C, 273 K, and a hot afternoon at 40 °C, 313 K, the thermal noise density of CW-5's bridge rises by only **√(313 ÷ 273) ≈ 1.07**, about 7%. Cooling is a serious way to reduce thermal noise only for detectors cooled by hundreds of degrees; for factory instruments, temperature matters through drift, not through the noise floor.

### kT, the common thread

The same quantity, kT, about 4 × 10⁻²¹ J at room temperature, appears in this chapter's resistor, in the thermal motion of the load cell, in the Brownian motion of the fume particles described in *Fine Particles by the Numbers* and in the diffusion coefficient Einstein derived in 1905. It is the energy that thermal agitation gives every independent mode of motion. A resistor's electrons, a load cell's spring and a fume particle in air each receive it, and each responds according to its own resistance, stiffness or friction. That shared origin is why a book about weighing begins with pollen grains in water.

## Bandwidth is a setting

The thermal noise formula contains the bandwidth, and so does every white noise. Narrowing the bandwidth, by filtering or by averaging, reduces white noise in proportion to the square root of the bandwidth. CW-5's 200 ms average narrows the effective bandwidth from about 500 Hz to about 2.5 Hz, a factor of 200, which reduces any white electronic noise by about **√200 ≈ 14**. That is the same square-root rule as Chapter 2, seen from the frequency side. It works only on white noise; the correlated mechanical noise of Chapter 3, concentrated at low frequencies, passes through the narrow bandwidth almost untouched.

## A failure case: doubling the excitation

This is an illustration. Seeking a quieter scale, a technician doubled CW-5's bridge excitation from 5 V to 10 V, within the electronics' range but above the load cell maker's recommended value, reasoning that twice the signal would halve the noise. The dynamic check-weight test showed no improvement, because, as the bars above show, the electronic noise that excitation could reduce was about 0.023 g out of 0.5 g.

Worse, over the following days the zero and span began to wander more than before. The detection came from the Allan chart, repeated as part of a routine review, which showed the random-walk slope higher and the span hump larger than in the commissioning record. The four-fold increase in power dissipated in the gauges, from about 71 mW to about 286 mW, was heating them unevenly and changing their resistance with every draught across the platform.

The correction was to restore the 5 V excitation, let the scale settle for a shift, and repeat the Allan record to confirm that the random-walk slope and span hump had returned to their commissioning values, which they had. The shop's rule now is to calculate the noise budget, thermal, electronic and measured, before changing any electrical setting, and to stay within the load cell maker's recommended excitation.

## How this applies to a small Australian business

Calculate the thermal noise of a sensor's resistances with √(4kTRB), add the amplifier's specified noise, and convert both into the units of the measurement. Compare that floor with the measured noise before buying better electronics; if the measured noise is far above it, the cause is mechanical, environmental or in the installation. Remember that bandwidth reduction helps only white noise, and that more excitation buys signal at the cost of self-heating and drift. Stay within the sensor maker's recommended operating conditions.

## Exercise: a 1,000 Ω bridge

A different load cell has a 1,000 Ω bridge, the same 10 µV per gram sensitivity and the same 500 Hz measurement bandwidth. What is its thermal noise density and its thermal noise per sample in grams? Does the change matter for CW-5?

**Worked answer.** The noise density is **√(4 × 1.380649 × 10⁻²³ × 293.15 × 1,000) ≈ 4.02 nV/√Hz**, larger by √(1,000 ÷ 350) ≈ 1.69. Over 500 Hz it is about **4.02 × √500 ≈ 90 nV**, about **0.009 g** per sample. That is still far below both the amplifier's 0.022 g and the 0.5 g mechanical noise, so for CW-5 the change in bridge resistance makes no practical difference.
