---
book: induction-hardening-by-the-numbers
chapterSlug: power-energy-and-heating-time
order: 3
title: "Power, energy and heating time"
description: "How much energy the heated layer needs, how heating time sets the power and surface power density, how conduction deepens the heated zone with time, and a longer heat that overheated the case."
draft: false
---

Frequency decides where the heat is generated; power and time decide how much heat goes in and how far it spreads. The two are tied together by the energy the heated layer needs. Heat it quickly with high power, and the heat stays near the surface where it was generated, giving a shallow, sharp case. Heat it slowly with less power, and conduction carries the heat inwards during the heating, giving a deeper, more gradual case and a hotter core. For a given frequency, time is the main control of case depth.

This chapter calculates the energy and power for the IH-40 journal with the KEVOS® tool introduced in Chapter 2, shows how heating time trades against power and power density, estimates how far heat conducts in the seconds of heating, explains single-shot and scanning power, and works through an operator's longer heat that overheated the surface.

## The energy the layer needs

To harden, the layer that will become the case, plus a transition zone beneath it, must be heated above its hardening temperature. The energy is the layer's mass times its mean specific heat times its temperature rise. Everything beyond that, heat conducted deeper into the core, radiated and convected from the surface, and lost in the coil and its leads, is extra.

The KEVOS® [Induction hardening plan](/tools/induction-hardening-plan/) tool estimates the energy to heat the layer and the power that implies. From the bar diameter, the heated length, the case depth and the heated depth as a multiple of it, the hardening and starting temperatures, the mean specific heat, the steel's density, the heating time and the generator-to-work efficiency, it gives the heated layer's mass, the energy to heat it, the power at the work, the power from the generator, and the surface power density over the heated area. It treats the heat as going into the layer only.

```figure
type: steps
title: Energy and power for the IH-40 journal in the induction hardening plan tool
caption: This is an illustration. 40 mm bar, 100 mm heated length, 2.0 mm case, heated depth 1.5 times the case (3.0 mm), 20 to 900 °C, mean specific heat 0.6 kJ/(kg·K), 7,850 kg/m³, 4 s heating, 70% generator-to-work efficiency.
- Heated layer | an annulus 3.0 mm deep: π ÷ 4 × (40² − 34²) × 100 mm³ = 34,872 mm³
- Mass of the layer | 0.274 kg
- * Energy to heat it | 0.274 × 0.6 × 880 = 144.5 kJ
- Power at the work over 4 s | 144.5 ÷ 4 = 36.1 kW
- Power from the generator at 70% | 51.6 kW, within the 80 kW rating
- Surface power density | 36.1 kW over 125.7 cm² = 0.29 kW/cm²
```

The heated depth multiple, 1.5, matters. The case is defined at 2.0 mm, but the steel below the case must also be heated, into the transformation range, so that the hardness falls away gradually to the core rather than in a sharp step that would concentrate stress. Heating 3.0 mm for a 2.0 mm case is the manufacturer's working allowance, settled by trial sections.

## Time against power

For a fixed energy, a shorter heat needs more power. The tool shows the trade directly.

```figure
type: compare
title: IH-40 journal heated in different times, 144.5 kJ into the layer
cols: Power at the work, kW | Power from the generator, kW | Surface power density, kW/cm² | Within the 80 kW generator?
rowhead: Heating time
- 2 s | 72.3 | 103.2 | 0.58 | no
- 3 s | 48.2 | 68.8 | 0.38 | yes
- * 4 s | 36.1 | 51.6 | 0.29 | yes
- 6 s | 24.1 | 34.4 | 0.19 | yes
caption: This is an illustration. From the induction hardening plan tool, same layer and efficiency. The shortest time the 80 kW generator allows is 144.5 ÷ (0.7 × 80) = 2.6 s, before allowing for conduction losses.
```

But the energy is not really fixed. The tool's figure is the energy to heat the 3 mm layer and nothing else. During heating, conduction moves heat from the hot layer into the cooler steel beneath, and the longer the heat, the more energy goes deeper. A short heat delivers most of its energy where it is wanted; a long heat delivers the same energy into the layer plus a growing amount into the core.

### How far heat conducts in a few seconds

A useful measure of how far heat spreads by conduction in a time t is the thermal diffusion length, √(α × t), where α is the steel's thermal diffusivity. For hot steel, α is roughly 5 × 10⁻⁶ m²/s.

```figure
type: bars
title: Thermal diffusion length in hot steel for different heating times
unit: mm
caption: This is an illustration. √(α × t) with α = 5 × 10⁻⁶ m²/s. A rough guide to how far heat conducts during the heating; even 2 s spreads heat about as far as the 3 mm heated layer.
- 2 s | 3.16
- * 4 s | 4.47
- 6 s | 5.48
- 10 s | 7.07
```

At 4 seconds, heat conducts about 4.5 mm, more than the 3 mm layer the tool heats. That is why the real energy per part, measured by the machine's energy monitor (Chapter 10), is higher than the tool's estimate, and why the heated zone, and so the case, grows with time even at a fixed frequency. It is also why the reference depth and the heating time together, not either alone, set the case: a frequency giving a reference depth near the case depth, used with a short heat, gives a sharp, controlled case; a lower frequency or a longer heat gives a deeper, more diffuse one.

The difference between the tool's estimate and the real energy is not an error in the tool; it is the part of the process the tool deliberately leaves out. The tool answers the question "what is the least energy this layer could need?", which is the right first question when choosing a generator, because a generator that cannot supply even that energy in the time available is plainly too small. The machine's energy monitor answers the second question, "what does it actually take on this machine with this coil?", and the gap between the two, typically tens of per cent, is the conduction and coupling loss of the real process.

The manufacturer's settings for IH-40, 4 seconds at about 40 kW at the work, were found by trial: a starting point from the tool, then sectioned parts at slightly different times and powers until the case sat in the middle of its 2.0 to 3.0 mm band. The tool told them where to start; the sections told them where to stop. That division of labour, calculation for the starting point and measurement for the final setting, runs through the whole of induction hardening.

## Where the generator's power goes

The tool's 70% efficiency from generator to work gathers several losses. The generator itself loses a few per cent converting mains power to high-frequency power. The transformer and the leads that carry the current to the coil have resistance and lose more. The coil, carrying hundreds or thousands of amps, heats up and must be water cooled. And not all of the coil's field couples into the part: some flux passes through the air gap between coil and part without inducing current in the steel. The coupling loss grows quickly with the gap, which is why the coil's spacing from the journal is set and checked (Chapter 4).

This is an illustration. Of the 51.6 kW drawn for the IH-40 heat, about 36 kW reaches the journal. Most of the other 15 kW leaves in the cooling water of the generator, transformer and coil. The water system is therefore part of the heating system: a blocked coil passage or a warm water supply reduces the coil's capacity and, in the worst case, melts it. The manufacturer's machine monitors the cooling water's flow and temperature and stops the heat if either goes out of range.

## Measuring the surface temperature

The temperature the surface reaches is the result that matters, but it is reached in seconds and only for a moment. A thermocouple cannot follow it. Infrared pyrometers aimed at the surface, or at a gap in the coil, can, and many induction machines carry one. Their readings depend on the surface's emissivity, which changes as the steel heats and scales, and on a clear line of sight through the steam and quench spray, so they are better at showing whether a heat is the same as the last than at giving an absolute temperature. The general problems of measuring hot surfaces this way are covered in [Infrared Temperature Measurement by the Numbers](/reados/publications/infrared-temperature-measurement-by-the-numbers/). The manufacturer uses a pyrometer as a check, trending the peak reading part to part, and relies on sectioned parts for the truth.

### Preheating and multi-step heats

Some parts are heated in more than one step: a lower-power preheat that warms a deeper layer, followed by a short, intense final heat that brings the surface to hardening temperature. A preheat gives a deeper, more gradual transition to the core, which reduces cracking risk on parts with sharp section changes, and helps where the frequency available is higher than the case ideally wants. It costs cycle time. The IH-40's journal needs none, but the shop's long-shaft scanning setup uses a slow first pass to preheat before a faster hardening pass.

## Single-shot and scanning power

The IH-40's coil surrounds the whole 100 mm journal and heats it all at once, then the integral spray quenches it all at once: single-shot hardening. The power must heat the whole zone in the heating time, hence the 51.6 kW from the generator.

An alternative is scanning: a short coil, say 20 mm tall, moves along the part, with a quench ring just behind it, so each point is heated as the coil passes and quenched as soon as it has passed. The power then only has to heat the band under the coil. This is an illustration. If each point needs about 4 seconds under a 20 mm coil, the coil moves at 5 mm/s, and the energy per millimetre of journal, 144.5 ÷ 100 = 1.45 kJ/mm, is delivered at 1.45 × 5 = 7.2 kW at the work, about 10 kW from the generator. Scanning the 100 mm journal takes about 24 seconds instead of 4.

```figure
type: compare
title: Single-shot and scanning for two journal lengths
cols: Generator power needed, kW | Heating time per part, s | Suits
rowhead: Method and journal
- * Single-shot, 100 mm journal | 51.6 | 4 | high volumes of short zones; the IH-40
- Scanning, 100 mm journal, 5 mm/s | about 10 | about 24 | small generators; varied lengths
- Single-shot, 300 mm journal | about 155 | 4 | beyond the 80 kW generator
- * Scanning, 300 mm journal, 5 mm/s | about 10 | about 64 | long shafts on a modest generator
caption: This is an illustration. Single-shot power scales with the zone's length; scanning power does not, but scanning time does. Times exclude loading and quench.
```

Single-shot hardening is fast and gives very uniform results along a short zone, but needs a coil made for each zone and a generator big enough for the whole zone. Scanning needs less power and one coil can treat many lengths, but each part takes longer and the start and end of the scan need care. The manufacturer uses single-shot for the IH-40 and keeps a scanning setup for the occasional long shaft.

### Dwell between heat and quench

Between the end of heating and the start of quenching there is always a short dwell: in single-shot hardening, the moment while the power switches off and the spray starts; in scanning, the distance between the coil and the quench ring. During the dwell, heat continues to conduct inwards from the hot surface, so the surface cools slightly and the layer beneath warms. A short, consistent dwell is part of the recipe. Too long, and the surface may cool below the temperature from which it can be hardened fully before the quench reaches it, or the heat spreads deeper than intended; too short is rarely possible. The IH-40 machine's dwell is fixed by its controller at a fraction of a second, and it is recorded with every part.

## The error: a longer heat to make sure

This is an illustration. After a batch of shafts came out with case depths near the 2.0 mm minimum, a night-shift operator, without telling anyone, extended the heating time from 4 to 6 seconds at the same power setting "to make sure the case was deep enough".

The next morning's sectioned shafts showed cases of about 3.4 mm, over the 3.0 mm maximum, and a coarse, overheated structure at the surface. The machine's energy monitor showed why: each part had received about 1.5 times its usual energy. At a fixed power, energy grows in proportion to time. The extra energy had gone partly deeper, by conduction, deepening the case, and partly into a hotter surface, which coarsened the grains (Chapter 5) and would make the case more brittle.

```figure
type: compare
title: The operator's change, by the numbers
cols: Heating time, s | Energy into the part, relative | Diffusion length, mm | Section result
rowhead: Setting
- * Proven setting, about 40 kW at the work | 4 | 1.0 | 4.5 | case 2.3 to 2.5 mm, fine structure
- Operator's change, same power | 6 | 1.5 | 5.5 | case about 3.4 mm, coarse surface
caption: This is an illustration. The cases near the minimum that prompted the change were later traced to a worn coil spacing (Chapter 4), not to the heating time.
```

The shallow cases that started it were caused by something else: the coil had been knocked and its gap to the journal had grown, reducing the coupling and the power reaching the part (Chapter 4). Lengthening the heat had masked one fault with another. The manufacturer locked the heating parameters behind a supervisor's password, set the energy monitor's limits to stop the machine on any part outside the proven energy band, and added a check of the coil gap to the start-of-shift routine.

## Exercise: a heavier case on the same journal

This is an illustration. A customer asks for an IH-40 variant with a 3.0 mm case, heating 1.5 times the case, on the same 40 mm, 100 mm journal.

1. What are the heated layer's mass and the energy to heat it to 900 °C?
2. What power from the generator does a 4 s heat need at 70% efficiency, and can the 80 kW generator supply it?
3. What would you expect to change in the process apart from the power?

**Worked answer.**

1. Heated depth 4.5 mm, so the annulus is from 31 to 40 mm diameter: π ÷ 4 × (40² − 31²) × 100 = 50,186 mm³, a mass of **0.394 kg**; energy 0.394 × 0.6 × 880 = **208.0 kJ**.
2. 208.0 ÷ 4 = 52.0 kW at the work; ÷ 0.7 = **74.3 kW** from the generator, **within** the 80 kW rating, but with little margin.
3. At 30 kHz the reference depth, 3.05 mm, is now only about equal to the 3.0 mm case (ratio 1.02), at the bottom of the shop's range, so more of the depth must come from conduction. A slightly longer heat at lower power is likely to give a better profile than 4 seconds at full power, and the setting must be proved by sections. Distortion and quench cracking risk also rise with a deeper case (Chapter 9).
