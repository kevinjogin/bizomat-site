---
book: plain-bearings-by-the-numbers
chapterSlug: plain-or-rolling-and-failure-diagnosis
order: 10
title: "Plain or rolling, and diagnosing failures"
description: "Compare plain and rolling bearings on friction with the KEVOS® rolling bearing friction tool and on life, damping and dirt, then diagnose wiping, fatigue, scoring, electrical damage and oil whirl."
draft: false
---

Every fan, pump and motor designer eventually faces the same choice: a plain bearing or a rolling bearing. Rolling bearings are compact, cheap, start under load with little friction and come from a catalogue with a calculated life. Plain bearings run quietly, damp vibration, tolerate dirt, can be split for assembly and, kept supplied with clean oil, last almost indefinitely. Neither is better in general, and the comparison is clearer with numbers.

This final chapter compares FB-75's sleeve bearings with rolling bearings of the same bore using the KEVOS® rolling bearing friction tool, sets out the other differences that usually decide the choice, and then turns to the failures plain bearings suffer and how each is recognised. It ends with a vibration on cold mornings that was treated as unbalance when it was the oil film itself.

## Friction: plain against rolling

A rolling bearing's friction is often estimated with a constant friction coefficient for the bearing type, applied to the load at the bore radius. The [rolling bearing friction tool](/tools/bearing-friction/) does this: from the bearing load, bore diameter, a friction coefficient for the type, speed and number of bearings, it gives the friction torque per bearing, the power loss and the heat per hour, and it reminds the user that seal and churning losses come on top and should be taken from the bearing maker's model.

This is an illustration. With 6,000 N, an 80 mm bore, an assumed friction coefficient of 0.0015, 1,480 rpm and two bearings, the tool gives a friction torque of 0.36 N·m per bearing and a power loss of 111.6 W for the pair. FB-75's sleeve bearings, by Chapters 3, 6 and 8, lose about 217 W at the drive end and 193 W at the non-drive end in their journals, plus 116 W in the thrust face: about 526 W.

```figure
type: compare
title: FB-75 on its sleeve bearings and on rolling bearings
cols: Friction loss | Notes
rowhead: Bearing arrangement
- * Oil-ring sleeve bearings with tapered-land thrust | about 526 W | Journal losses from the heat balance; thrust from Chapter 8
- Rolling bearings, 80 mm bore, two | about 112 W, plus seals and churning | Rolling bearing friction tool with an assumed coefficient of 0.0015; the locating bearing also carries the thrust
caption: This is an illustration. The rolling bearing coefficient is an assumed value for this comparison; bearing makers' friction models, which include load, speed, lubricant and seals, should be used for a real comparison.
```

The rolling bearings lose roughly 400 W less. Over 8,000 hours a year that is about 3,300 kWh, about A$830 a year at a fictional A$0.25 per kWh including GST. It is a real saving, but a small one beside a 75 kW fan's own energy, and it rarely decides the choice on its own. Rolling bearings also have their friction advantage most clearly at starts, where Chapter 9 showed a plain bearing passing through mixed lubrication.

## The differences that usually decide

```figure
type: compare
title: Plain and rolling bearings beyond friction
cols: Plain hydrodynamic bearing | Rolling bearing
rowhead: Feature
- Life | Indefinite with clean oil and a full film; wear concentrated at starts and stops | Finite, rated by fatigue life at a given reliability
- Damping and noise | High damping from the film; quiet | Little damping; noise from rolling elements and cages
- Tolerance of dirt | Good: soft linings embed particles | Poor: particles dent races and shorten life
- Shock and overload | Film spreads the load; lining can be overloaded at peaks | Brinelling of races under shock at rest
- Starting | Mixed lubrication for the first moments | Low friction from rest
- Size | Short axially, larger housing with sump | Compact
- Assembly | Split shells: no need to remove couplings or impellers | Usually pressed on; needs access over the shaft end
- Lubrication | Needs a reliable oil supply | Grease or oil; often sealed for life in small sizes
caption: Large fans, pumps, motors, compressors and turbines often use plain bearings for their life, damping and split construction; small and medium machines usually use rolling bearings for compactness and cost.
```

Rolling bearing life is calculated, not assumed, and this comparison is incomplete without the bearing maker's life calculation for the actual duty. The chapter in Machine Elements and Mechanical Design, [selecting bearings and lubrication for reliable machines](/reados/collections/machine-elements-and-mechanical-design/selecting-bearings-and-lubrication-for-reliable-machines/), introduces rolling bearing selection. For FB-75, a large fan in dusty air with a heavy impeller between its bearings, the plant keeps its sleeve bearings for their dirt tolerance, damping and split housings, which let a bearing be rebuilt without lifting the impeller.

## How plain bearings fail

A plain bearing rarely fails without warning. Each failure mode leaves a characteristic mark on the lining and, usually, a trace in the temperature, vibration or oil long before.

```figure
type: compare
title: Plain bearing failure modes and how they are recognised
cols: What the lining shows | Usual cause | Early warning
rowhead: Failure
- Wiping | White metal smeared and flowed in the direction of rotation | Loss of oil, overload or overheating; film collapsed | Temperature rising; oil ring stalled; low level
- Fatigue cracking | Network of cracks, pieces lost, usually in the loaded zone | Peak film pressure too high for the lining at its temperature; dynamic load | Tin or lead in the oil analysis; rising vibration
- Scoring and embedding | Circumferential scratches; particles in the lining | Dirt in the oil; wear debris | Particle count; silicon from dust; scored journal
- Corrosion | Dark, etched or pitted lining | Acids from oxidised oil; water | Oil acid number and water content
- Electrical erosion | Frosted or finely pitted bands; dark spots | Stray shaft currents, often from variable-speed drives | Shaft voltage measurement; frosted bands at inspection
- Cavitation erosion | Pitted areas downstream of grooves or in the unloaded zone | Vapour bubbles collapsing in a fluctuating film | Noise; pits at inspection
- Edge loading | Wear or wiping at one end only | Misalignment or shaft bending | Uneven temperature across the bearing; contact marks
caption: Inspection marks are the final evidence; trends in temperature, vibration and oil analysis usually show the fault first.
```

Two of these deserve a word for FB-75. Electrical erosion became a risk when the variable-speed drive of Chapter 9 was installed, because some drive and motor combinations induce voltages in the shaft that discharge through the thinnest point of the oil film, pitting the lining and the journal. The usual defences are an insulated bearing at one end, a shaft grounding brush, and the drive maker's cabling and earthing guidance; the plant fitted an insulated non-drive-end shell when the drive went in. Fatigue cracking is the limit for the heavier impeller of Chapter 6, whose peak film pressure would rise to about 6 MPa.

## Reading a bearing's history before opening it

The best time to diagnose a plain bearing is before it is opened. Once a housing is stripped, the oil is drained, the shell is lifted and the journal wiped, much of the evidence is gone. The plant's practice when a bearing gives trouble is to gather its history first: the temperature trend above the air for the past months, with any steps or drifts marked against events such as oil changes, rebuilds or process changes; the vibration spectra over the same period; the last few oil reports, especially wear metals, silicon, water and acidity; and the maintenance records, including clearances and end float at the last rebuild and any top-ups or seal work since.

Laid side by side, these often point to the failure before the bearing is seen. A temperature that stepped up after a rebuild suggests something in the rebuild: clearance, groove positions, alignment or the shell itself, as Chapters 5, 7 and 8 found. A slow rise in temperature with rising silicon points to dust in the oil and scoring. Rising tin with fluctuating vibration points to fatigue. A sudden temperature rise with no oil report change points to the supply: a stalled ring or a low level. The history also decides what to look for when the bearing is opened, and what samples to keep.

## Inspecting a removed shell

When the shell does come out, a few minutes of disciplined inspection save a great deal of guessing. Before cleaning anything, the fitter takes a sample of the oil from the sump and photographs the shell and journal as found. The contact pattern on the white metal, the polished area where the journal has touched, shows where the load has been carried: a band centred on the loaded zone is normal, a band at one end means misalignment, and a band in an unexpected place means the load direction or the groove positions are not what the drawing assumed. The grooves and the oil ring slot are checked for debris, the ring for wear and roundness, and the journal for scoring, pitting and taper.

Measurements follow: the bore and journal at several positions along and around them, the lining thickness where wear is visible, and the clearance by the same method as at the last rebuild. Every mark is then matched against the failure table above. The findings, with photographs and measurements, go into the bearing's history, where they become the baseline for the next inspection. A bearing that has failed once and been rebuilt without understanding why will usually fail the same way again.

## Oil whirl

A hydrodynamic film can do more than carry a load; it can drive the shaft into vibration. The oil in the clearance travels round at roughly half the journal's surface speed, and if the journal is displaced, the film's forces can push it round its bore in the same direction at about that rate. The result is oil whirl: a vibration at a frequency a little under half the running speed, which is self-excited, meaning that it needs no unbalance or external force to sustain it.

Whirl is most likely in lightly loaded bearings running near the centre of their clearance, that is, at a high Sommerfeld number and a low eccentricity ratio, where the film's restoring forces are weakest. Heavily loaded bearings, running well off centre, are generally stable. A whirl that grows until its frequency meets a natural frequency of the rotor can lock onto it as oil whip, a much more violent vibration that does not change frequency with speed and can destroy a bearing quickly. Bearings designed for light loads at high speed therefore use non-circular bores, such as lobed, pressure-dam or tilting-pad designs, which are much more resistant to whirl than a plain circular bore. The diagnostic signature is a vibration peak at a little under half running speed that moves with the speed; a vibration analyst looks for it in every subsynchronous complaint.

The remedies follow from the cause. Anything that moves the journal further off centre makes the film stiffer against whirl: more unit load, which a shorter bearing gives; less viscosity, which warmer or lighter oil gives; or less speed. Anything that breaks the symmetry of the circular film helps too, which is why the lobed and tilting-pad designs work. A plant faced with whirl usually tries the cheapest of these first, and the next section shows that the cheapest can also be the right one.

```figure
type: decision
title: A vibration peak below running speed in a plain bearing machine
question: Does the peak sit a little under half running speed and move with speed?
- Yes | Oil whirl likely | Check the Sommerfeld number and eccentricity; look at oil temperature, clearance and load
- * Yes, and worse when the oil is cold | Whirl from a high Sommerfeld number | Warm the oil or reduce speed until warm; consider a lighter grade or a whirl-resistant bearing
- No, it stays at one frequency | Possible oil whip or a structural resonance | Stop and investigate; whip is severe
- No, it is at exactly half speed or other fractions | Rub, looseness or other causes | Inspect clearances, fits and seals
```

## The error: a vibration that rebalancing could not fix

This is an illustration. On cold winter mornings, after the variable-speed drive had been fitted, FB-75's vibration rose briefly at start-up to two or three times its usual level and then settled over about an hour. A contractor was asked to rebalance the impeller, which they did, reducing the vibration at running speed slightly. The cold-morning vibration was unchanged.

The plant's vibration analyst looked at the spectrum rather than the overall level. The cold-start peak was not at the running speed of 24.7 Hz but at about 11 Hz, a little under half, and it moved with speed during the drive's ramp. Rebalancing could not touch it, because unbalance acts at running speed. The reliability engineer calculated the drive-end bearing's condition at a cold start: with the oil at 20 °C and 188 mPa·s at full speed, the Sommerfeld number was 1.65 and the eccentricity ratio only 0.11, the journal almost centred in its bore. Under the old starter, the fan had taken a long time to reach full speed and the oil had warmed on the way; the new drive ramped it up in seconds and held it at full speed with the oil still cold. As the bearings warmed towards 66 °C, the Sommerfeld number fell towards 0.17, the journal moved off centre to ε = 0.52, and the whirl died away.

```figure
type: compare
title: FB-75's drive-end bearing at a cold start and in normal running
cols: Oil viscosity | Sommerfeld number | Eccentricity ratio | Whirl seen?
rowhead: Condition
- Full speed with oil at 20 °C | 188 mPa·s | 1.65 | 0.11 | Yes, about 11 Hz
- * Full speed with oil at 66 °C | 19.1 mPa·s | 0.168 | 0.52 | No
caption: This is an illustration. Short-bearing solution at 6.0 kN and 1,480 rpm. A lightly loaded, nearly centred journal is prone to whirl; a loaded, eccentric one is not.
```

The fix cost nothing: the drive's start-up programme was changed to hold the fan at about 600 rpm until the bearing temperature passed 40 °C, then ramp to full speed. The whirl did not recur. A sump heater, a lighter grade in winter or a whirl-resistant bearing design were all considered and found unnecessary. The plant's vibration procedure now requires a spectrum, not only an overall level, before any corrective work, and lists oil whirl among the causes to check whenever a plain bearing machine vibrates below its running speed.

## A plain bearing health routine

```figure
type: checklist
title: Watching a plain bearing's health
caption: Each item tracks one of the failure modes above; together they give months of warning.
- Temperature above the air | Trend it at constant speed and load (Chapter 6)
- Vibration spectrum | Including subsynchronous peaks; overall levels hide whirl
- Oil condition and wear metals | Tin and lead from white metal; silicon from dust; water; acidity
- Oil level and ring | Weekly, running
- Clearance and end float | At every major inspection, same method each time (Chapter 5)
- Shaft voltage | Where a variable-speed drive is fitted
- x Rebalance before reading the spectrum | Unbalance is at running speed; whirl is not
```

## Bringing the book together

This book began with Tower's oil hole and Reynolds' wedge and has followed one fan's bearings through every calculation a plain bearing needs. A converging film carries load when it has motion, viscosity and a wedge. Bushes that never float are rated by P, V and PV. A full film's friction follows Petroff's equation, corrected for eccentricity, and its thickness follows from the Sommerfeld number through the short-bearing solution. Clearance trades heat against side flow, stiffness and peak pressure. The running temperature comes from a heat balance, the oil supply must exceed the film's side flow and enter where the pressure is low, and thrust faces need tapers or tilting pads. Starts and stops decide the wear and the lining material, and the failures leave clear signs, including the self-excited whirl of a lightly loaded film.

For FB-75 the practical results were specific: a heavier oil declined, a sintered bush declined, a clearance error caught with a lead wire, a groove in the loaded zone removed, a flat thrust ring replaced, a start–stop routine changed to an idle, and a cold-start whirl cured by a slower ramp. The companion book, Viscosity by the Numbers, explains the property on which every one of these calculations depends.

## Exercise: rolling bearings and their seals

A bearing maker's model for a pair of rolling bearings suitable for FB-75 gives 140 W of rolling friction and 60 W of seal friction at the duty, against the rolling bearing friction tool's 112 W estimate. Find the total loss, the saving against the sleeve bearings' 526 W, and the annual energy and cost saving at 8,000 hours and a fictional A$0.25 per kWh including GST. Would this saving alone justify the change?

**Worked answer.** This is an illustration. The rolling bearings' total loss is 140 + 60 = **200 W**, nearly twice the tool's simple estimate, which did not include seals or the maker's load and speed terms. The saving is 526 − 200 = **326 W**, which over 8,000 hours is 2,608 kWh and about **A$652 a year**. That is unlikely to justify replacing bearings that are working well, especially since the change would also cost FB-75 its plain bearings' dirt tolerance, damping and split construction. The comparison is worth making when a machine is being designed or its bearings are failing anyway; for a healthy machine, it mostly confirms that friction is not the deciding factor.
