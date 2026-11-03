---
book: insulation-testing-by-the-numbers
chapterSlug: polarisation-and-the-dielectric
order: 3
title: "Polarisation and the dielectric"
description: "Insulation as a dielectric: permittivity and capacitance, the four ways a material polarises, relaxation and the absorption current, the charge a tested winding stores, and a recovered voltage."
draft: false
---

Insulation does more than block current. Placed between a conductor and an earthed core, it forms a capacitor, and when a voltage is applied, the material itself responds: its charges shift slightly, and the material becomes polarised. Some of that polarisation happens almost instantly; some builds up over seconds, minutes or hours. The slow part draws a current that decays with time, called the absorption current, and it is that current, and the way it decays, that the polarisation index of Chapter 5 measures. Polarisation also explains why a tested winding holds a dangerous charge, and why the charge can come back after the winding has been briefly earthed.

This chapter treats insulation as a dielectric. It calculates C-1's capacitance from its permittivity and dimensions, describes the four mechanisms of polarisation and their time scales, shows how a spread of relaxation times produces an absorption current that falls as a power of time, works out the charge and energy a tested winding stores, and finishes with a fitter who received a shock from a winding that had been earthed for only a minute after a ten-minute test.

## Permittivity and capacitance

When a voltage is applied across a slab of insulation between two electrodes, charge collects on the electrodes. With a vacuum between them, the charge per volt, the capacitance, is ε₀A ÷ d, where ε₀ is the permittivity of free space, 8.854 × 10⁻¹² F/m, A is the area and d the separation. With a material between them, the capacitance is larger by the material's relative permittivity, εᵣ, also called its dielectric constant. The increase happens because the material's own charges shift in the field and partly cancel it, so that more charge must flow onto the electrodes to reach the same voltage.

Relative permittivities of common insulating materials lie roughly between 2 and 7: non-polar polymers such as polyethylene near the bottom, epoxy resins, polyester films and mica higher. Water, a strongly polar liquid, has a relative permittivity of about 80, which is why absorbed water raises the capacitance of insulation.

```figure
type: formula
title: Capacitance of a slab of insulation
formula: C = ε₀ × εᵣ × A ÷ d
formula: Stored charge: Q = C × V        Stored energy: W = ½ × C × V²
caption: The parallel-plate formula is a good approximation for a groundwall that is thin compared with its other dimensions.
- ε₀ | permittivity of free space, 8.854 × 10⁻¹² F/m
- εᵣ | relative permittivity of the insulation
- A, d | area and thickness of the insulation, m² and m
- C, Q, W | capacitance in F, charge in C, energy in J
```

For C-1's groundwall, with the working model's area of 3.5 m² and thickness of 2.2 mm, and a relative permittivity of 4.5 taken as typical of mica-epoxy for illustration, the capacitance of the whole winding to earth is 8.854 × 10⁻¹² × 4.5 × 3.5 ÷ 0.0022 = 63.4 nF, or about 21.1 nF per phase. These are the values the site's model uses for C-1 throughout the book; measured capacitance on a real winding includes the end windings, the terminal leads and any cable connected, and is taken from the test set.

## The four ways a material polarises

A material polarises in several ways at once, and each mechanism has its own speed. Solid state physics texts such as Kittel's describe the first three in terms of the polarisability of atoms, ions and molecules and the local field acting on them; the fourth is a property of materials made of layers.

**Electronic polarisation** is the shift of each atom's electron cloud relative to its nucleus. It occurs in every material and follows the field up to optical frequencies, so in an electrical test it is instantaneous.

**Ionic polarisation** is the relative displacement of positive and negative ions in a crystal or a polar bond. It follows the field up to infrared frequencies, and is also instantaneous in an electrical test.

**Orientational, or dipolar, polarisation** is the partial alignment of molecules that carry a permanent dipole, such as water or the polar groups in many resins. Heat jostles the dipoles and opposes their alignment, so this polarisation depends on temperature, and it takes time: from nanoseconds in a liquid to seconds or longer in a stiff solid resin.

**Interfacial polarisation**, also called Maxwell–Wagner polarisation, occurs in materials made of layers or particles with different conductivities, such as mica flakes in epoxy, paper in oil, or a resin with water-filled pores. Charge carried by the slow leakage current piles up at the boundaries between the layers. Because the charges must travel through a nearly insulating material to get there, this polarisation builds over seconds, minutes or hours, and it contributes most of the absorption current in a high-voltage winding.

```figure
type: compare
title: Mechanisms of polarisation
cols: What moves | Typical time to respond | Effect in a DC test
rowhead: Mechanism
- Electronic | electron clouds relative to nuclei | about 10⁻¹⁵ s | part of the instant charging current
- Ionic | ions in crystals and polar bonds | about 10⁻¹³ s | part of the instant charging current
- Orientational | polar molecules rotate | 10⁻⁹ s to seconds in solids | part of the absorption current
- Interfacial | charges collect at boundaries between layers | seconds to hours | most of the absorption current in layered insulation
caption: Approximate time scales. Electronic and ionic polarisation charge the capacitance almost instantly; orientational and interfacial polarisation produce the slowly decaying absorption current.
```

## Relaxation and the absorption current

Suppose a step of voltage is applied to a dielectric with a single slow polarisation mechanism. The polarisation builds towards its final value along an exponential curve with a characteristic relaxation time, τ, and the current that feeds it decays in the same way: i(t) ∝ exp(−t ÷ τ). This is the Debye model of relaxation.

Real insulation contains many polarising sites with a wide spread of relaxation times. Their exponential currents add up to a current that decays much more slowly than any single exponential, and that is often well described by a power of time: i(t) = A × t⁻ⁿ, with n typically between about 0.5 and 1. This empirical form is often called the Curie–von Schweidler law. It is the form the site uses for its working model of C-1.

```figure
type: formula
title: Currents in a DC insulation test
formula: Single relaxation (Debye): i(t) = I₀ × exp(−t ÷ τ)
formula: Spread of relaxations: i_a(t) = A × t⁻ⁿ        Total: i(t) = i_c(t) + i_a(t) + I_L
caption: i_c is the capacitive charging current, which falls to nothing within a fraction of a second; i_a the absorption current; I_L the steady leakage current through and across the insulation.
- A | absorption current at unit time, µA at t = 1 min
- n | power-law exponent, typically about 0.5 to 1
- I_L | leakage current, µA
```

The site's working model of C-1 at 40 °C and 2,500 V uses A = 1.113 µA at one minute, n = 0.6 and I_L = 0.137 µA. These values were chosen so that the model reproduces C-1's corrected readings in later chapters. The absorption current falls from 2.56 µA at 15 seconds to 1.11 µA at one minute and 0.28 µA at ten minutes, while the leakage current stays constant. At ten minutes, the leakage current is still only about a third of the total.

```figure
type: line
title: C-1's absorption current at 2,500 V DC, working model at 40 °C
x: Time after the voltage is applied, minutes
y: Absorption current, µA
ymin: 0
ymax: 3
caption: This is an illustration. Power law with A = 1.113 µA at one minute and n = 0.6. The constant leakage current of 0.137 µA, not shown, adds to every point.
- 0.25 | 2.556
- 0.5 | 1.687
- 1 | 1.113
- 2 | 0.734
- 3 | 0.576
- 5 | 0.424
- 7 | 0.346
- 10 | 0.280
```

The absorption current is a property of a healthy, dry, clean insulation system. It is what makes the insulation resistance, calculated as the test voltage divided by the total current, rise during a test. If the leakage current is large, because the insulation is wet or dirty, it swamps the absorption current, and the resistance barely rises. That contrast is the basis of the polarisation index in Chapter 5.

## The charge a tested winding stores

At the end of a test, a winding holds charge in two forms. The first is the charge on its geometric capacitance, Q = CV. For C-1 at 2,500 V this is 63.4 nF × 2,500 V = 158.5 µC, with a stored energy of ½ × 63.4 × 10⁻⁹ × 2,500² = 0.198 J. That energy, discharged through a person, is well above the level that causes a severe shock, and it is released almost instantly if the winding is earthed.

The second is the charge absorbed by the slow polarisation. Integrating the absorption current over a ten-minute test gives A × t^(1−n) ÷ (1 − n) = 1.113 × 10^0.4 ÷ 0.4 = 6.99 µA·min, which is 419 µC, about two and a half times the geometric charge. This charge does not leave the winding when it is earthed briefly. Like the polarisation that took minutes to build, it takes minutes to release. If the earth is removed too soon, the polarisation that is still relaxing drives charge back onto the electrodes, and the voltage on the winding rises again. This is called the recovery voltage, or dielectric absorption voltage.

The instrument charges the geometric capacitance quickly: a test set limited to 2 mA charges 63.4 nF to 2,500 V in about 158.5 µC ÷ 2 mA = 0.08 s. Discharging the absorbed charge is what takes time.

```figure
type: stats
title: Charge and energy in C-1 at the end of a ten-minute test
caption: This is an illustration from the working model at 2,500 V DC. The absorbed charge is released over minutes, not instantly.
- 63.4 nF | winding capacitance to earth
- 158.5 µC | charge on the geometric capacitance
- 0.198 J | energy on the geometric capacitance
- 419 µC | charge absorbed by slow polarisation during ten minutes
- 0.08 s | time to charge the capacitance at a 2 mA current limit
```

## The mistake: a recovered voltage

After C-1's annual ten-minute polarisation index test, the technician switched the test set to discharge, waited about a minute until its display read near zero, and removed the earth lead so that a fitter could reconnect the motor cables. As the fitter took hold of the first cable lug, they received a sharp shock from the winding. They were not injured, but the incident was reported and investigated.

The investigation estimated the recovery voltage. If only one tenth of the 419 µC absorbed during the test returned to the electrodes over the following minutes, the winding's 63.4 nF capacitance would charge to about 41.9 µC ÷ 63.4 nF = 661 V. In practice a substantial fraction of the absorbed charge can return, depending on the insulation and how long it was earthed, so a recovery voltage of several hundred volts is entirely plausible after a short discharge.

```figure
type: steps
title: How the recovered voltage arose and was prevented
caption: This is an illustration. The estimate of 661 V assumes one tenth of the absorbed charge returned; the real value depends on the winding and the discharge time.
- Ten-minute test at 2,500 V | about 419 µC absorbed by slow polarisation
- Discharge for one minute | geometric charge removed; most absorbed charge still held
- Earth lead removed | polarisation continues to relax with the winding isolated
- * Recovery voltage | charge returns to the conductors; several hundred volts in minutes
- Fix | winding earthed for at least four times the test duration and kept earthed until the cables are reconnected
```

The site changed its procedure. After any DC insulation test, the winding is discharged through the test set and then connected to earth with a dedicated earthing lead for at least four times the duration of the test: forty minutes after a ten-minute test. The earthing lead stays connected until the motor cables are reconnected, and the cables themselves are treated as live until earthed. This discharge time is the site's own rule, chosen to be conservative; the guidance in the relevant standard must be read for real work.

## Water and permittivity

Because water has a relative permittivity of about 80, compared with about 4.5 for the mica-epoxy in the model, a small amount of absorbed water raises the capacitance of a winding measurably. It also adds orientational and interfacial polarisation, and the ions it carries raise the leakage current. All three effects are used by the tests in later chapters: the capacitance measurement of Chapter 7 can show moisture entering a winding, and the insulation resistance and polarisation index tests of Chapters 4 and 5 show the increased leakage. A winding that has been dried shows the opposite: capacitance falls, leakage falls, and the absorption current again dominates the early part of a DC test.

## Polarisation and frequency

Under alternating voltage, the slow mechanisms cannot keep up. At 50 Hz the field reverses a hundred times a second, far faster than interfacial polarisation can build, so that mechanism contributes little to the capacitance measured at power frequency, while it dominates a DC test lasting minutes. The relative permittivity of a layered insulation is therefore somewhat lower at 50 Hz than its effective value over a long DC test, and lower still at the very high frequencies of a fast voltage surge.

Between these extremes, a mechanism whose relaxation time is comparable with the period of the alternating field neither follows it fully nor ignores it. It lags behind the field, and the lag means that energy is absorbed in each cycle and turned into heat. This dielectric loss, and the dissipation factor that measures it, are the subject of Chapter 7. The same physics, seen in the time domain, gives the absorption current of a DC test and, seen in the frequency domain, the dielectric loss of an AC test.

## Why the exponent matters

The exponent n in the power law sets how fast the absorption current falls, and so how much the insulation resistance can rise during a test. If the leakage current were zero, the ratio of the currents at one and ten minutes would be 10ⁿ: for n = 0.6, that is 10^0.6 = 3.98. Any leakage current lowers the ratio, so for a winding with this exponent the ratio of the ten-minute to the one-minute resistance cannot exceed about 4. Chapter 5 uses this ratio, the polarisation index, and the upper limit set by the exponent is a useful check on a reading that seems too good.

## Exercise: an evaporator fan motor

An evaporator fan motor's slot liner has an area of 0.115 m² and a thickness of 0.3 mm, with a relative permittivity of 3.0. Calculate the winding's capacitance to earth, the charge it stores at the site's 500 V DC test voltage and the energy on that capacitance, and compare them with C-1's.

### Answer

**Given:** A = 0.115 m², d = 0.0003 m, εᵣ = 3.0, V = 500 V.

**Assumptions:** the parallel-plate formula; end windings and leads neglected; the values are illustrative.

**Method:** C = ε₀ εᵣ A ÷ d; Q = CV; W = ½ C V².

**Capacitance:** 8.854 × 10⁻¹² × 3.0 × 0.115 ÷ 0.0003 = 10.18 nF.

**Charge:** 10.18 × 10⁻⁹ × 500 = 5.09 µC.

**Energy:** ½ × 10.18 × 10⁻⁹ × 500² = 1.27 mJ.

**Comparison:** C-1 stores about 31 times as much charge and about 156 times as much energy at its higher test voltage. The small motor's charge is still enough to give a noticeable shock and it also absorbs charge during a test, so the same earthing discipline applies.

**Verification:** the energy can be checked as ½ × Q × V = ½ × 5.09 × 10⁻⁶ × 500 = 1.27 mJ, which agrees.
