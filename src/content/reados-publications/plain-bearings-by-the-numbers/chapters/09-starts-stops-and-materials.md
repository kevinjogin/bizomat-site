---
book: plain-bearings-by-the-numbers
chapterSlug: starts-stops-and-materials
order: 9
title: "Starts, stops and bearing materials"
description: "Estimate when a journal bearing's film forms and fails as it starts and stops, judge the regime with the film thickness ratio, and choose between white metal, bronze, aluminium and polymer linings."
draft: false
---

Everything in Chapters 3 to 8 described a bearing turning at full speed on a full film. For most of a fan's life that is true, and its bearing barely wears. The exceptions are the moments when it is not: the first revolutions after a start, when the journal is lifting off the bottom of its bore, and the last ones before it stops, when the film is collapsing. Almost all of a hydrodynamic bearing's wear happens in those moments, and the lining material is chosen largely for how well it survives them.

This chapter estimates how FB-75's film thickness grows with speed, using the short-bearing solution down to low speeds, judges the lubrication regime with the WORKOS film thickness ratio tool, and shows why a hot stop is harder on the bearing than a cold start. It then describes the main lining materials and what each offers, and ends with an energy-saving change that multiplied the bearing's starts.

## The film at low speed

At rest, FB-75's journal sits on the bottom of its bore, touching through the peaks of its surface roughness, with an eccentricity ratio of one. As it turns, its wedge starts to work, and because the film's capacity depends on speed through the Sommerfeld number, the journal lifts progressively as the speed rises. The short-bearing solution can be evaluated at low speeds to show how quickly.

```figure
type: compare
title: FB-75's thinnest film at low speed, cold start and hot stop
cols: Oil at 20 °C, cold start | Oil at 66 °C, hot stop
rowhead: Journal speed
- 5 rpm | 5.8 µm | 1.9 µm
- 10 rpm | 8.2 µm | 2.7 µm
- 20 rpm | 11.4 µm | 3.8 µm
- 50 rpm | 17.6 µm | 5.9 µm
- 100 rpm | 24.0 µm | 8.3 µm
- 500 rpm | 43.7 µm | 17.7 µm
- * 1,480 rpm | 53.6 µm | 28.6 µm
caption: This is an illustration. Short-bearing solution at the drive-end bearing's 6.0 kN with VG 68 oil at the temperatures shown. Above an eccentricity ratio of about 0.9 the estimates are only indicative; misalignment, distortion and the squeeze of oil from a settling journal all matter there.
```

The numbers carry an important lesson. A cold start, with the oil at 20 °C and about 188 mPa·s, builds a film quickly: by 10 rpm the estimate is already about 8 µm. A hot stop, with the oil at 66 °C and 19 mPa·s, has a film about a third as thick at the lowest speeds, because the viscosity is ten times lower. As the fan coasts down from full speed, its bearings lose their margin only in the last few tens of revolutions per minute, but they lose it with hot, thin oil.

At very low speeds the short-bearing estimates should be read as a guide to the trend rather than exact values. Real journals are not perfectly aligned, and a film of a few micrometres is comparable with the misalignment across a bearing's length; the oil also takes time to be squeezed out as a journal settles, which helps briefly at a stop. But the direction is clear, and it matches experience: plain bearings wear at stops more than at starts.

## The film thickness ratio

Chapter 1 compared the running film with the surface roughness. The same comparison at low speed shows the regime. The film thickness ratio, usually written λ, is the film thickness divided by the composite roughness of the two surfaces. Values above about three indicate a full film; between one and three, a mixed film with some contact; below one, mostly boundary lubrication.

The [film thickness ratio tool](/tools/film-thickness-ratio/) calculates λ from a film thickness and the roughness of the two surfaces, entered as root-mean-square or average roughness, and reports the regime. It was written for rolling bearings and gears, whose film thickness comes from elastohydrodynamic formulas the user supplies, but the ratio is the same for any film and any source of film thickness. Here the film thickness comes from the short-bearing solution.

This is an illustration. FB-75's journal has a root-mean-square roughness of about 0.5 µm and its white metal bore about 1.0 µm, as Chapter 1 estimated. Entering a film of 3.75 µm, the hot stop at 20 rpm, with roughnesses of 0.5 and 1.0 µm entered as RMS, the tool gives a composite roughness of 1.118 µm, a ratio of 3.36 and a full-film verdict. At 10 rpm, with 2.66 µm, it gives 2.38, mixed. At 5 rpm, with 1.89 µm, 1.69, mixed with significant contact.

```figure
type: bars
title: Film thickness ratio as FB-75 coasts to a stop with hot oil
unit: λ
max: 12
caption: This is an illustration. Film from the short-bearing solution at 66 °C; composite RMS roughness 1.118 µm. The ratio falls below 3, the usual boundary of full-film lubrication, at about 16 rpm.
- 500 rpm | 15.9
- 100 rpm | 7.4
- 50 rpm | 5.3
- * 20 rpm | 3.4
- 10 rpm | 2.4
- 5 rpm | 1.7
```

Solving for λ = 3 puts the hot stop's boundary of full film at about 16 rpm, and the cold start's at under 2 rpm. FB-75's bearings therefore spend a few seconds in mixed lubrication at each stop, as the fan's last revolutions pass, and almost none at a start.

## Why the lining survives

In those few seconds the white metal lining is in contact with the journal through the surface peaks, under the unit load of 1.25 MPa, at a sliding speed of well under 0.1 m/s. The PV of Chapter 2 is then tiny: at 20 rpm it is 1.25 × 0.084 = 0.10 MPa·m/s. The danger is not heat but scuffing and wear of the surfaces, and white metal's properties are designed for exactly that moment.

```figure
type: compare
title: What a hydrodynamic bearing's lining must do, and why
cols: Why it matters | Where it counts
rowhead: Property
- Compatibility | Resists welding or scuffing against steel when the film fails | Starts, stops, upsets
- Conformability | Deforms to accommodate misalignment and small geometric errors | Running in; misaligned shafts
- Embeddability | Swallows hard particles into its surface instead of letting them score the journal | Dirty oil; wear debris
- Fatigue strength | Resists cracking under the film's cyclic peak pressure | Heavy or dynamic loads; high temperature
- Strength at temperature | Keeps its strength as the bearing heats | Hot running; thrust pads
- Corrosion resistance | Withstands acids from aged oil and water | Long oil intervals; wet duties
caption: No lining is best at all of these; each material is a compromise.
```

White metal, a tin- or lead-based alloy with hard particles in a soft matrix, is outstanding for compatibility, conformability and embeddability, which is why it is the standard lining for fans, pumps, motors and turbines. Its weakness is fatigue strength, which falls steeply as it gets hotter, so it is used in thin layers on a steel backing and kept below its makers' temperature limits. Bronzes are much stronger and carry higher peak pressures, but are harder, less forgiving of misalignment and dirt, and need harder journals. Aluminium–tin alloys sit between the two and are common in engines. Polymer linings, filled PTFE and PEEK compounds for example, have very low friction against steel when the film fails and tolerate many starts and stops, at the cost of lower thermal conductivity and different clearance needs.

```figure
type: matrix
title: Choosing a lining by duty
x: Peak film pressure, low to high
y: Starts and stops, few to many
hot: 1
caption: A qualitative guide; bearing makers give the limits of each material for their designs.
- White metal on steel | FB-75's case: few starts, moderate peak pressure; best tolerance of dirt and misalignment
- Bronze or aluminium–tin | Higher peak pressures with few starts; needs clean oil and good alignment
- Polymer lining | Many starts and stops at moderate loads; check clearance and heat
- Polymer lining or hydrostatic lift | Many starts with heavy loads; large rotors use jacking oil
```

Large, heavy rotors, such as those of big turbines and generators, add a further measure: hydrostatic jacking oil, pumped under the journal at start-up and slow turning to lift it before it rotates. The cold-start and hot-stop films of a small fan do not need it.

Whatever the lining, its thickness matters as much as its alloy. A thin white metal layer, a fraction of a millimetre on a steel shell, is much stronger in fatigue than a thick one, because the steel carries the load and the soft layer only has to conform. Thick linings, poured into old-style housings and bored out, tolerate more wear before the steel is exposed but crack sooner under heavy or fluctuating loads. When a bearing is rebuilt, the lining thickness and the quality of its bond to the backing are as important to specify and inspect as its bore; a lining that has lifted from its backing in one patch will fail there however good its alloy.

## Hot running and the white metal

The lining's limits also apply in steady running, and they are why Chapter 6's alarm settings matter. White metal softens as it approaches its melting range, and well before that its fatigue strength falls, so that a peak film pressure it carries easily at 70 °C can crack it at much higher temperatures. The film pressure peaks near the thinnest film, which is also where the lining runs hottest. For FB-75, with a peak of 3.59 MPa at 66 °C, the margin is generous. For the 9 kN impeller of Chapter 6, with a peak of 6.04 MPa, the plant asked the bearing maker to confirm the lining's fatigue rating at the expected metal temperature, which is a few kelvin above the oil's.

## Running in a new bearing

A new or rebuilt bearing's surfaces are at their roughest. The fine-bored white metal and the ground journal both carry peaks that the film has not yet smoothed, and the bore may have small errors of shape that the lining's conformability has not yet taken up. For the first hours, the bearing runs slightly hotter than it will later, and its film thickness ratio at low speeds is lower than the figures above. That is why bearing makers recommend a running-in procedure: a few starts and stops at light load, a period at reduced speed or load if the machine allows it, and close attention to temperature until it has settled.

The plant's procedure for FB-75 after a rebuild is to start the fan with its damper closed, which lowers the thrust and the power, run it for half an hour while watching both bearing temperatures and the oil rings, stop it, check the oil for white metal flakes or discolouration, and then run it at normal duty for the long commissioning run Chapter 6 requires. A temperature that rises steadily without levelling off during the first run is a reason to stop and investigate, not to wait.

## Windmilling and slow reverse rotation

A stopped fan is not always stationary. Where several fans share ductwork, as in a dust extraction system with more than one fan, the draught from the running fans can turn a stopped one slowly, sometimes backwards. Its bearings then run for hours at a few revolutions per minute in boundary or mixed lubrication, with the oil rings barely turning, and a tapered-land thrust face running backwards has diverging tapers that cannot form a film at all. A fan found turning slowly when it should be still needs a backdraught damper or a shaft lock, and its bearings deserve an inspection if it has been turning that way for long.

## The error: an energy-saving start and stop routine

This is an illustration. To save energy, the plant changed FB-75's control so that the fan stopped whenever the sawmill line paused for more than ten minutes and restarted when it resumed. The fan had previously run continuously through each shift and started twice a day. Under the new routine it started and stopped about twenty times a day, and because the pauses were short, every stop was a hot stop, with the oil near its running temperature.

Within six months, the plant's clearance measurements, made by the journal-lift method of Chapter 5, showed the drive-end bearing's clearance opening at about four times its previous rate, and the bearing's temperature above the air had fallen slightly, as a looser bearing's does. At the next inspection, the white metal showed a polished, slightly worn band at the bottom of the bore, the mark of repeated contact at stops.

The reliability engineer explained it with this chapter's numbers. Each hot stop passed through mixed lubrication below about 16 rpm, and the fan's large impeller, coasting down against little air load in its final revolutions, took several seconds to do so. Ten times as many hot stops meant roughly ten times the wear. The energy saved was real, but so was the cost of rebuilding the bearings years early.

```figure
type: compare
title: FB-75's bearing duty before and after the start–stop routine
cols: Starts and stops a day | Kind of stop | Clearance growth rate
rowhead: Routine
- Continuous running through shifts | 2 | Mostly after a long run | Previous rate
- * Stop on every pause over 10 minutes | about 20 | Hot, short pauses | About four times previous
caption: This is an illustration. Wear concentrated in the few seconds of mixed lubrication at each stop.
```

The plant kept the energy saving but changed how it was achieved. The fan's variable-speed drive now ramps it down to a low idle speed of about 300 rpm during short pauses instead of stopping it; at 300 rpm and 66 °C the film is about 14 µm, comfortably full, and the fan uses a small fraction of its full-speed power. It stops fully only for pauses longer than an hour, and the drive brakes it quickly through the low-speed range when it does. The bearings' wear rate returned to its previous level.

## Bringing it together

A journal bearing's film grows with speed and viscosity, so a cold start builds it within a few revolutions per minute while a hot stop loses it at a higher speed, about 16 rpm for FB-75. The film thickness ratio, the film divided by the composite roughness, shows the regime: above three, full film; below, mixed. The lining material is chosen to survive those moments and to carry the film's peak pressure when hot: white metal for compatibility and embeddability, bronze and aluminium alloys for strength, polymers for frequent starts. Stopping a fan often is a duty in its own right, and the bearings must be part of the decision. The last chapter compares plain bearings with rolling bearings and diagnoses their failures.

## Exercise: idle speed

The plant considers idling FB-75 at 150 rpm instead of 300 rpm during pauses, to save a little more energy. Using the short-bearing solution's trend, estimate the film at 150 rpm with the oil at 66 °C by interpolating between the table's values at 100 and 500 rpm on a straight line in log film against log speed, and find its film thickness ratio with the film thickness ratio tool. Is 150 rpm a safe idle speed?

**Worked answer.** This is an illustration. Between 100 rpm (8.25 µm) and 500 rpm (17.73 µm), the film rises as speed to the power log(17.73 ÷ 8.25) ÷ log(5) = 0.475. At 150 rpm the film is about 8.25 × 1.5^0.475 = **10.0 µm**; the short-bearing solution itself gives 10.04 µm. The film thickness ratio tool, with 10.0 µm and roughnesses of 0.5 and 1.0 µm RMS, gives **λ = 8.9**, a full film. At 150 rpm the bearings are safe, with a film still well above the region where mixed lubrication begins; the choice between 150 and 300 rpm can be made on energy, noise and how quickly the fan must recover full flow.
