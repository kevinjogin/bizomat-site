---
book: production-leak-testing-by-the-numbers
chapterSlug: tracer-gas-methods
order: 6
title: "Tracer gas methods"
description: "Why a tracer gas beats temperature, helium and hydrogen as tracers, filling the part, sniffing, accumulation and vacuum chamber techniques, background, and a vent that put helium into the test cell."
draft: false
---

Pressure methods measure the loss of the test gas by its effect on the gas that remains, and anything that changes that gas, above all its temperature, competes with the leak. Tracer gas methods turn the problem round. They fill the part with a gas that is almost absent from the surroundings and use a detector that responds to that gas alone. A leak is then seen directly, as tracer arriving where there should be none, and the part's temperature no longer matters. The limit becomes the background of tracer already present and the detector's sensitivity, both of which are many orders of magnitude below what any pressure method can reach.

This chapter explains the choice of tracer, how to fill the part so that the tracer's concentration is known, the three main ways of collecting the tracer that leaks out, the arithmetic of each, and why background matters. It finishes with a vent pipe that raised the helium in the test cell twelvefold.

## Choosing a tracer

A good tracer is scarce in air, so that its background is low; safe, so that it can be used in production; inert, so that it does not react with the part; small and light, so that it passes through leaks readily; and detectable specifically, so that no other gas is mistaken for it. Two gases meet those needs in production.

```figure
type: compare
title: Production tracer gases
cols: Concentration in air | Detector | Practical lower limit | Notes
rowhead: Tracer
- Helium | about 5.2 ppm | mass spectrometer tuned to mass 4 | about 10⁻⁹ mbar·L/s in vacuum; about 10⁻⁷ by sniffing | inert, safe; a finite resource with a volatile price; recovery systems pay back on large volumes
- Hydrogen, 5% in nitrogen | about 0.5 ppm | solid-state hydrogen sensor | about 10⁻⁶ to 10⁻⁷ mbar·L/s by sniffing | cheap; the mixture is generally treated as non-flammable, but confirm with the supplier's safety data sheet
caption: Figures are typical orders of magnitude; real limits depend on the detector, the technique and the background on the day.
```

The OC-40 line uses helium for its specification test because its vacuum chamber method needs a mass spectrometer, which Chapter 7 explains, and keeps a hydrogen sniffer beside the chamber for locating leaks in rejected coolers, where its lower cost and freedom from helium background are useful.

## Filling the part

The detector measures the tracer's leak rate, not the total gas leak rate. If the part is filled with a mixture, only the tracer's share of the leaking gas is seen, so the reading must be divided by the tracer's fraction to give the total. Knowing that fraction is therefore essential.

The simplest way to fill a part with helium is to connect it to a helium supply at the test pressure. But the part starts full of air at atmospheric pressure, and unless that air is removed, it remains mixed into the helium. Filling an OC-40 from 1.013 bar absolute of air to 11.013 bar absolute with helium leaves the air's 1.013 bar as a partial pressure in the mixture: the helium fraction is 10.0 ÷ 11.013 = 90.8%.

The [gas mixture properties tool](/tools/gas-mixture-properties/) works out the properties of such a mixture by Dalton's law. Entering helium at 90.8% and air at 9.2% by mole, at 1,101.3 kPa absolute and 20 °C, gives a helium partial pressure of 1,000 kPa, a mixture molar mass of 6.3 kg/kmol and a speed of sound of 794 m/s. The partial pressure is the number that matters: the detector reads a leak of helium driven by 10.0 bar of helium partial pressure, not 11.013 bar.

```figure
type: compare
title: Helium fraction in the OC-40 for different filling methods
cols: Helium fraction | Error if the reading is taken as pure helium
rowhead: Filling method
- Filled with helium to 10 bar gauge without evacuating | 90.8% | readings 9% low
- Evacuated to 10 mbar, then filled to 10 bar gauge | 99.9% | negligible
- Filled with 10% helium in air to 10 bar gauge, without evacuating | 9.1% | readings eleven times low
- * Evacuated to 10 mbar, filled with pure helium: the OC-40 line | 99.9% | negligible
caption: This is an illustration. Helium fraction = helium partial pressure ÷ total absolute pressure, with 1.013 bar of air in the part before filling unless it is evacuated.
```

The OC-40 line evacuates each cooler to about 10 mbar before filling it with pure helium, which leaves 99.9% helium in the part. Evacuating takes about 4 seconds and also lets the station detect gross leaks: a cooler that will not pump down has a leak far above the specification, and the station rejects it before any helium is used.

### Diluted tracers

Some lines deliberately fill with a diluted tracer, 10% helium in air or 5% hydrogen in nitrogen, to save gas or for safety. That is sound provided the dilution is known and the reading is corrected: a reading of 1 × 10⁻⁴ mbar·L/s of helium from a part filled with 10% helium represents a total leak of 1 × 10⁻³ mbar·L/s. The danger is a dilution that varies from part to part because the parts are not evacuated or the mixing is incomplete.

## Three ways to collect the tracer

ISO 20485 groups tracer gas techniques by the direction of flow: tracer flowing into an evacuated part from outside, or tracer flowing out of a filled part into a collection space or a detector probe. Production testing of parts like the OC-40 uses the second group, with three main techniques.

### Sniffing

A sniffer probe draws a small, steady flow of air from close to the part's surface into the detector. A leak releases tracer into the air at the probe's tip, and the detector sees its concentration rise. Sniffing locates leaks, which makes it the technique for finding and repairing them, but it measures each location separately, depends on the probe's distance from the leak and its speed of movement, and sees only part of the tracer, since some escapes past the probe.

If the probe draws 60 sccm and sits directly over a leak of 1 × 10⁻⁵ mbar·L/s, which is 5.9 × 10⁻⁴ sccm, the tracer's concentration in the drawn air rises by 5.9 × 10⁻⁴ ÷ 60 = 9.9 ppm, about twice helium's background in air. A leak ten times smaller would raise it by about 1 ppm, a fifth of the background, which is why sniffing struggles below about 10⁻⁶ mbar·L/s for helium.

### Accumulation

The part is enclosed in a cover or bag of known free volume, and the tracer that leaks out accumulates over a set time. A detector samples the enclosure's air before and after. The concentration rises in proportion to the leak rate and the time and inversely to the enclosure's volume.

```figure
type: formula
title: Concentration rise in an accumulation test
formula: ΔC = Q × t ÷ (p × V_a)
caption: Q is the tracer's leak rate in mbar·L/s, t the accumulation time in seconds, p the enclosure's pressure in mbar and V_a its free volume in litres. ΔC is a volume fraction; multiply by 10⁶ for ppm.
- ΔC | rise in tracer concentration
- V_a | free volume of the enclosure around the part, L
```

For an OC-40 in a 20 L enclosure at 1,013 mbar, a helium leak at the specification, 1 × 10⁻³ mbar·L/s, raises the concentration in 30 seconds by 1 × 10⁻³ × 30 ÷ (1,013 × 20) = 1.48 ppm. That is detectable against helium's 5.2 ppm background if the background is steady, but a leak ten times smaller gives only 0.15 ppm in the same time, lost in the background's fluctuations. Accumulation suits limits around 10⁻³ to 10⁻⁵ mbar·L/s, with small enclosures and long times, and avoids the cost of a vacuum chamber. Two practical details decide whether it works. The enclosure's free volume must be small and known, which means filling the space around the part with blocks where the part's shape allows, since every litre of air dilutes the signal. And the air inside must be mixed by a small fan, because helium released at one joint takes minutes to spread through still air, and a detector sampling from the far side of the enclosure would see too little too late. A reference leak placed inside the enclosure on a known-good part, as ISO 20485's informative annex describes, checks both at once.

### Vacuum chamber

The part is placed in a chamber, the chamber is evacuated, and the part is filled with tracer. Tracer leaking from the part is pumped from the chamber through the detector, which measures it directly as a leak rate. There is no dilution in air and almost no background, since the chamber's air has been pumped away, and the whole part is tested at once. The vacuum chamber is the most sensitive and the fastest method for a total leak rate, and the most expensive to buy.

The OC-40 station's cycle is: load the cooler into the chamber and connect its ports; evacuate the chamber and the cooler; fill the cooler with helium at 10 bar gauge; measure the helium arriving at the detector for 6 seconds; recover the helium from the cooler; vent the chamber; unload. Chapter 7 explains what the detector does with the helium it receives, and Chapter 10 returns to the cycle's time and cost.

```figure
type: decision
title: Choosing a tracer gas technique
caption: This is an illustration of the reasoning on the OC-40 line.
- Total leak rate of the whole part against a tight limit, high volume | Vacuum chamber with helium | The OC-40 specification test
- Total leak rate against a moderate limit, lower volume or budget | Accumulation with helium or hydrogen | Considered for the OC-60 during its ramp-up
- Locating a leak for repair or analysis | Sniffing with hydrogen or helium | Used on every OC-40 the chamber rejects
- Very large parts that cannot fit a chamber | Accumulation in a bag, or sniffing every joint | Not needed on this line
```

## Background

A tracer method's real limit is not the detector's sensitivity but the background: tracer that reaches the detector from anywhere other than the leak being measured. In a sniffer or accumulation test, background is the tracer already in the room's air. In a vacuum chamber, background is helium released from the chamber's walls and seals, from earlier parts, and from the room's air leaking in when the chamber is open.

Background is steady when the room is well ventilated and helium is kept out of it. It rises, sometimes sharply, when tracer is released nearby: a vented part, a leaking helium hose, a gross leaker that floods the chamber. A detector reading a part near its limit cannot tell the part's helium from the background's, so the station measures its background before each part, with the chamber evacuated and no cooler connected, and subtracts it. When the background itself rises towards the reject limit, the readings become unreliable however carefully it is subtracted. The OC-40 station logs every background reading, and a background trend climbing through a shift is the earliest warning that helium is getting somewhere it should not, as the next section shows.

## The mistake: a vent into the cell

The helium station originally vented each cooler's helium, after recovery had taken most of it, through a short pipe that discharged behind the station inside its enclosure. For months nothing seemed wrong. Then the line rate was raised by a fifth, and the station's chamber background began to climb through each shift, and the hydrogen sniffer's operators started reporting faint "leaks" on coolers that the chamber had passed.

```figure
type: steps
title: Tracing a rising background to the vent
caption: This is an illustration. Helium vented inside the cell raised the air's helium twelvefold; once vented outdoors, the background stayed at its usual level all shift.
- Symptom | chamber background rising through each shift; operators reporting faint leaks by sniffer near the station
- Cell air tested with the sniffer away from any part | about 60 ppm of helium against about 5 ppm outside the cell
- Source | vent pipe discharging residual helium from each cooler inside the cell's enclosure
- Chamber effect | room helium entering the chamber each time it opened and permeating its door seal
- * Vent piped outdoors, cell ventilation checked | cell air back to about 5 ppm; chamber background stable through the shift
- Procedure changed | cell helium monitored by a fixed detector; alarm at 20 ppm
```

The test engineer used the hydrogen sniffer's helium-sensitive sister instrument to sample the cell air away from any part and found about 60 ppm of helium, against about 5 ppm outside the cell. The vent pipe was releasing the small residue of every cooler's helium inside the enclosure, and at the higher line rate the ventilation could no longer clear it. The helium-rich air entered the chamber every time its door opened and permeated its door seal while it was closed, raising the background through the shift; outside the chamber, it confused the sniffers. The vent was piped outdoors, the cell's ventilation was checked, and a fixed helium monitor now alarms if the cell's air passes 20 ppm.

## Safety with tracer gases

Helium is inert and non-toxic, but it displaces oxygen in an enclosed space, and a large release in a small room can create an asphyxiation hazard. Hydrogen mixtures above about 5% are flammable, and even the 5% mixture should be kept away from ignition sources and stored as the safety data sheet requires. The parts themselves are pressure vessels during the test, and fixtures must be designed so that a part that fails under pressure cannot injure the operator. The OC-40 chamber's door is interlocked and the cooler is never pressurised while the door is open.

## Exercise: an accumulation test for the OC-60

During the OC-60's ramp-up, before its own chamber was installed, the engineer considered an accumulation test: each OC-60 in a 30 L hood, filled with pure helium to 10 bar gauge, with a reject limit of 9 × 10⁻⁴ mbar·L/s of helium. The detector resolves 0.1 ppm, and the background in the hood fluctuates by about ±0.3 ppm. Calculate the concentration rise at the limit in 30 and 120 seconds, and decide on an accumulation time. Then say what would be needed for the method to work at a limit ten times tighter.

### Answer

**Given:** Q = 9 × 10⁻⁴ mbar·L/s; V_a = 30 L; p = 1,013 mbar; times 30 s and 120 s; detector resolution 0.1 ppm; background ±0.3 ppm.

**Assumptions:** the helium mixes evenly through the hood; the hood is sealed; the background is steady over the test apart from its fluctuation.

**Method:** ΔC = Q t ÷ (p V_a).

**At 30 s:** 9 × 10⁻⁴ × 30 ÷ (1,013 × 30) = 8.9 × 10⁻⁷, or 0.89 ppm.

**At 120 s:** 3.6 ppm.

**Accumulation time:** at 30 seconds, the rise at the limit is only three times the background's fluctuation, which would give frequent false decisions near the limit. At 120 seconds it is twelve times the fluctuation, a reliable decision, at the cost of a two-minute test that the line can absorb only with several hoods working in parallel.

**Ten times tighter:** at 9 × 10⁻⁵ mbar·L/s the rise in 120 seconds would be 0.36 ppm, about the same as the background's fluctuation. The method would need a much smaller hood, a much longer time or a lower and steadier background, and at that level a vacuum chamber is the practical choice.

**Verification:** the rise scales with time, 3.6 ÷ 0.89 = 4.0 for four times the time, and inversely with volume: the same leak in the OC-40's 20 L enclosure gives 1.33 ppm in 30 seconds, 1.5 times as much.
