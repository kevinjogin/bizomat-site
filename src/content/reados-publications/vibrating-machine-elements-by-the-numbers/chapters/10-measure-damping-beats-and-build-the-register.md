---
book: vibrating-machine-elements-by-the-numbers
chapterSlug: measure-damping-beats-and-build-the-register
order: 10
title: "Measure damping and beats, then build the register"
description: "Read damping from a tap-test decay, explain beats between two fans, set a spectrum's resolution correctly, and gather every RF-3 finding into one resonance register."
draft: false
---

Calculation finds where the resonances should be. Measurement shows where they are and how sharp they are. This chapter covers the three measurements that come up most often on plant like RF-3: the decay of a tap test, which gives damping; the slow throb when two machines run at nearly the same speed, which is a beat; and the frequency spectrum, which is only as useful as the resolution chosen for it.

It then gathers every finding from the book into a resonance register for RF-3. The register is the deliverable: a short, maintained record of each natural frequency, the excitation it meets, the speed at which they cross, and what was decided. It is what lets the next engineer change a belt, a motor or a fan without rediscovering every problem in this book.

## Damping from a tap test

When a panel, a rope or a spring is tapped and left to ring, its vibration dies away. The rate at which it dies away measures its damping. For a lightly damped part, successive peaks fall by a constant ratio, and the **logarithmic decrement** δ describes it:

```figure
type: formula
title: Damping ratio from a decaying tap test
formula: δ = (1 ÷ N) × ln(A₀ ÷ A_N)
formula: ζ = δ ÷ √(4π² + δ²)
- A₀ | amplitude of a chosen peak
- A_N | amplitude N cycles later
- δ | logarithmic decrement
- ζ | damping ratio; Q ≈ 1 ÷ (2ζ) is the magnification at resonance
step: A₀ = 1.00, A₁₀ = 0.30, N = 10
step: δ = ln(1 ÷ 0.30) ÷ 10 = 0.1204
step: ζ = 0.1204 ÷ √(39.48 + 0.0145) = 0.0192
step: Q ≈ 1 ÷ (2 × 0.0192) ≈ 26
caption: This is an illustration from a tap test on RF-3's unstiffened side panel. Measure over several cycles rather than one, and ignore the first cycle, which often contains other modes.
```

This is an illustration. A tap on RF-3's unstiffened side panel gives a decay in which the amplitude falls from 1.00 to 0.30 over 10 cycles. The damping ratio is about 0.019 and the magnification at resonance about 26. At its 15.4 Hz first mode, the half-power bandwidth, the range of forcing frequencies over which the response stays above about 70 per cent of its peak, is roughly 2ζf = 2 × 0.0192 × 15.4, about **0.59 Hz**.

The bandwidth says how precisely a fan must sit on a resonance to excite it strongly. Within about 0.3 Hz either side of 15.4 Hz, the panel responds close to its peak. A 15 per cent margin, about 2.3 Hz at this frequency, is several bandwidths away.

Measured damping is also a check on the treatments in Chapter 9. If a constrained-layer treatment is applied and a repeat tap test shows the decay hardly faster, the treatment is not bonded properly or does not suit the panel's temperature.

## Beats between two fans

This is an illustration. RF-3 shares the roof with a second exhaust fan, RF-4, of the same type. With both at full speed, RF-3 turns at 928 rpm and RF-4, with slightly different pulleys, at 935 rpm. Their 1× frequencies are 15.467 Hz and 15.583 Hz.

Two vibrations at nearly the same frequency add together. When their crests line up, the combined vibration is large; half a cycle of the difference later, they cancel. The combined level rises and falls at the **beat frequency**, the difference between the two:

**f_beat = 15.583 − 15.467 = 0.117 Hz**, a period of about **8.6 seconds**.

People on the floor below describe it as a slow throb, a swelling and fading hum every eight or nine seconds, even though neither fan alone is unusual. The blade-pass tones beat as well, at eight times the difference, about 0.93 Hz, so there is also a faster flutter about once a second.

Beats are diagnostic. A level that swells and fades at a steady rate almost always means two sources at nearly the same frequency, and the beat period gives their difference directly. If the two fans are set further apart in speed, the beat becomes faster and less noticeable as a throb. If they are run at exactly the same speed, the beat disappears, but the combined level then depends on the phase between the fans, which drifts. Changing one fan's pulley or drive setting is a simple, reversible test that confirms the cause.

### Beats during a run-up

Beats also appear in a single machine. During the run-up test described in Chapter 9, as the fan speed approaches a panel's natural frequency, the forced vibration at the fan speed and the panel's free ringing at its own frequency add, and the level beats at their difference. The beat slows as the fan approaches the resonance. Watching a beat slow down is a reliable sign that a resonance is close.

## Overall level or spectrum

Most handheld vibration meters report an overall level, a single number summarising all the vibration in a frequency range. It is quick, repeatable and good for trending: a fan bearing whose overall level doubles between monthly rounds needs attention, whatever the cause. Acceptance criteria in machine vibration standards are usually framed in overall levels for this reason.

An overall level cannot say which frequency is responsible. A rise could come from unbalance at 1×, a loose fixing at many harmonics, a belt problem at belt pass or a bearing defect at high frequency. Diagnosis needs the spectrum. A practical routine is to trend overall levels on every round and to take a spectrum whenever a level changes, or at a set interval, so that there is a healthy spectrum on file to compare against when something does change.

## Reading a spectrum: resolution first

A vibration analyser records a block of signal, then splits it into frequencies with a fast Fourier transform. Three settings decide what the spectrum can show:

```figure
type: stats
title: The settings that decide a spectrum's resolution
caption: This is an illustration of typical settings. Resolution is set by the record length, not by the sampling rate.
- 2,560 Hz | sampling rate | samples per second
- 1,280 Hz | highest frequency shown | half the sampling rate; filters must remove anything above it
- 4,096 | samples per block | the record length is 4,096 ÷ 2,560 = 1.6 s
- * 0.625 Hz | resolution | 1 ÷ record length
```

With 0.625 Hz resolution, RF-3 at 15.467 Hz and RF-4 at 15.583 Hz fall into the same line. The spectrum shows one peak whose height changes between captures, which is the beat appearing as an unstable amplitude. To show them as two lines, the resolution must be finer than their 0.117 Hz difference, which needs a record of at least 1 ÷ 0.117, about 8.6 s, and in practice longer, because the windowing applied to each block widens every peak. A record of 20 s or more, at a lower sampling rate if only low frequencies matter, would separate them.

The opposite mistake is too low a sampling rate. A spring surge at 177 Hz or a VSD effect at 180 Hz to 300 Hz is invisible in a spectrum that stops at 100 Hz. Choose the frequency range from the excitation table first, then the resolution from the closest pair of frequencies that must be separated.

ISO 20816-1 sets out the general framework for measuring and evaluating machine vibration, including where to measure and which quantities to use; fan specifications may call up ISO 14694 for fan-specific acceptance. Those documents govern acceptance. The spectrum's role here is diagnosis: finding which frequency is high and why.

## Phase: the other half of the reading

A spectrum gives the size of each frequency component. Many analysers can also give its phase, measured against a once-per-revolution reference such as a reflective tape on the shaft and an optical tachometer. Phase answers questions that level alone cannot.

The most useful is whether a peak is a resonance. As forcing frequency rises through a natural frequency, the response does not only peak; its phase relative to the force swings through about 180 degrees, passing 90 degrees at the resonance itself. During a run-up, a 1× peak accompanied by a large phase swing is a resonance. A 1× level that rises with speed while its phase stays steady is forcing, typically unbalance, with no resonance nearby. In the failure case below, a phase reading during the run-up would have shown the swing near 49.8 Hz supply at once.

Phase also separates causes that share a frequency. Unbalance in an overhung impeller and misalignment of a belt drive both appear at 1×, but they produce different phase relationships between the two bearings and between radial and axial directions. Interpreting those patterns is a skill learned with practice and with reference texts; the point here is that a diagnosis made from level alone is weaker than it needs to be.

## Measure well and safely

Good measurements on plant like RF-3 follow a few habits. Mount the sensor firmly: a stud or a flat magnet on a clean, flat spot gives a usable reading to high frequencies, while a handheld probe is fine only for low frequencies and quick surveys. Measure in three directions at each bearing, horizontal, vertical and axial, because each mode and each fault shows most strongly in some directions and not others. Mark the measurement points with paint or fixed targets so that later readings are taken in the same place, since moving a sensor a few centimetres on a housing can change the reading markedly.

Record the operating condition with every reading: drive frequency, fan duty, and whether neighbouring plant such as RF-4 was running. A reading without its speed cannot be compared with the register.

Measurements on running plant are taken with guards in place, through inspection openings or from fixed points outside the guards. Tap tests and the fitting of sensors near belts and shafts are done with the drive stopped and isolated, following the site's procedures. On a roof, fall prevention comes first, before any instrument is unpacked.

## A failure case: balancing a resonance

This is an illustration. Before the panel work in Chapter 9, a contractor measures RF-3 at full speed and finds a high 1× level on the housing. The spectrum has a single dominant peak at the fan speed. The report concludes "unbalance" and the impeller is balanced in place. The 1× level at the fan bearings falls, but the housing panel still drums.

The diagnosis missed the amplifier. Unbalance force rises with the square of speed, so a pure unbalance problem shows a 1× level that rises smoothly as the fan speeds up. A run-up test on RF-3 would have shown the panel's level rising sharply between about 48 Hz and 50 Hz supply and peaking near 49.8 Hz, as the fan speed met the panel's 15.4 Hz mode. A tap test would have found the 15.4 Hz mode directly.

The balancing was not wasted, since it reduced the forcing, but it did not fix the problem. The correction was to treat the resonance, by stiffening the panel, and to change the contractor brief: any high 1× reading on variable-speed plant is followed by a run-up test and a tap test before the cause is reported.

## The RF-3 resonance register

The register brings together one line per natural frequency found in the book. It records the frequency, the excitation it meets, where they cross in the drive range, and the decision taken. It belongs with the plant's maintenance records, not in a design report that is filed and forgotten.

```figure
type: compare
title: RF-3 resonance register
rowhead: Element and mode
cols: Natural frequency | Excitation and crossing | Decision
caption: This is an illustration summarising Chapters 2 to 9. Frequencies are running estimates or design values; each is to be confirmed by tap test or run-up.
- Belt slack span | 43.2 Hz at full speed, rising to 48.4 Hz at minimum | motor 2× at 46.0 Hz supply; fan 3× at 47.4 Hz | align pulleys; observe at 46 Hz after any drive change
- Belt tight span | 56.4 Hz at full speed | fan 4× at 44.8 Hz supply | record only
- Guy ropes, first mode | 15.4 Hz retensioned to 20.0 Hz | motor 1× at 41.4 Hz supply; second mode against fan 3× at 43.1 Hz | retension all four to 20 Hz; balance impeller
- Drive torsion, low mode | 31.7 Hz | motor 2× at 32.8 Hz supply; weak forcing | record only
- * Drive torsion, high mode | 121.6 Hz | blade pass at 49.1 Hz supply; 1.7 per cent at full speed | specify 45 mm shaft for the next fan; inspect keys at each service
- Isolators, bounce | 3.17 Hz | belt pass at minimum speed, ratio 1.24 | controlled ramps; snubbers set
- Isolator spring surge | 176.6 Hz | twice blade pass at 35.7 Hz supply | elastomer pads fitted; bolts isolated
- Side panel, first mode | 15.4 Hz, stiffened to about 53 Hz | fan 4× at 43.1 Hz supply | two stiffeners and damping layer; 2.0 mm with one stiffener for future housings
- Inlet connector | about 98 Hz, tension-dependent | inside blade-pass band | fit with maker's slack; inspect folds
- Roof bay under the unit | about 9 Hz, rough flag | fan 1× band | structural engineer to confirm
```

Three columns make the register usable. The crossing speed tells an operator where to look. The decision tells the next engineer what was chosen and why. The note to confirm by measurement keeps every number honest: each is an estimate until a tap test or run-up has checked it.

## Keeping the register alive

A register is only useful if it changes when the machine does. The triggers for a review are simple:

```figure
type: checklist
title: When to review the RF-3 resonance register
caption: Each trigger changes a frequency or an excitation in the register. A run-up test after the change is the quickest check.
- Belts or pulleys changed | span frequencies, belt pass and the speed ratio
- Motor or impeller replaced | inertias, 1× forcing and torsional modes
- Drive minimum or maximum changed | every excitation band
- Isolators, pads or base frame altered | bounce and surge
- Panels, stiffeners or connectors modified | panel and membrane modes
- ? New plant added nearby on the same roof | beats and roof response
- x Do not delete a row because a problem went away | record what fixed it instead
```

## From register to specification

The register's last job is to make the next purchase better. Several of RF-3's problems were fixed in the field at more cost than they would have taken to avoid on paper. Each row that ended in a design decision becomes a line in the specification for the next fan of this type:

- the impeller balanced to the grade the fan specification calls up, with the balance record supplied;
- a stated minimum torsional frequency for the fan shaft and impeller, above the blade-pass band with the chosen margin, which the 45 mm shaft met in the case;
- housing panels whose first mode, confirmed by a tap test at the factory, lies outside the fan and motor 1× bands across the drive range;
- isolators specified by load and minimum static deflection at each mount, with elastomer pads and isolated hold-down bolts;
- a drive label carrying the belt span length, target span frequency and belt mass per metre;
- a requirement for a run-up test at commissioning, with the results handed over as the first version of the register.

None of these lines needs a vibration specialist to check. Each is a number with a test attached. That is the advantage of working from waves and frequencies: the requirements are measurable, and the measurements are cheap.

## Exercise: damping from a rope tap test

After retensioning, one of RF-3's guy ropes is tapped and its decay recorded. The amplitude halves over 8 cycles. Find the logarithmic decrement, the damping ratio and the approximate magnification at resonance. Then find the half-power bandwidth at the rope's 20 Hz first mode.

**Answer.** δ = ln(1 ÷ 0.5) ÷ 8 = 0.6931 ÷ 8 ≈ **0.0866**. ζ = 0.0866 ÷ √(39.48 + 0.0075) ≈ **0.0138**. The magnification at resonance is about 1 ÷ (2 × 0.0138) ≈ **36**.

The half-power bandwidth is about 2 × 0.0138 × 20 ≈ **0.55 Hz**. The rope is less damped than the panel. It responds strongly only within about a quarter of a hertz of its natural frequency, but there it magnifies the lug motion about 36 times, which is why the margin from the fan's 1× band in Chapter 4 matters.
