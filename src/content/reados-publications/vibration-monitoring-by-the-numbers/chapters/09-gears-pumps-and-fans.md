---
book: vibration-monitoring-by-the-numbers
chapterSlug: gears-pumps-and-fans
order: 9
title: "Gears, pumps and fans"
description: "Gear mesh frequency and sidebands, shaft speeds through a reducer, wear against a cracked tooth, synchronous averaging, blade and vane pass, cavitation, and sidebands traced to the wrong shaft."
draft: false
---

Gearboxes, pumps and fans each add their own frequencies to a machine's spectrum, set by their teeth, vanes and blades. A gearbox's mesh frequency is the number of teeth multiplied by the shaft speed; a fan's blade pass is the number of blades multiplied by its speed; a pump's vane pass likewise. These are present in every healthy machine, and their size and the pattern of peaks around them change as the machine wears or develops a fault. Diagnosing them needs the speed of every shaft and the count of every tooth, vane and blade, and the discipline to tie each sideband to the right shaft.

This chapter works out the shaft speeds and mesh frequencies of the mill's conveyor gearbox with the gear train tool, explains sidebands and what they say about which gear is at fault, distinguishes wear from a cracked tooth, introduces synchronous averaging, covers blade pass, vane pass and cavitation, and finishes with a set of sidebands that sent a fitter to inspect the wrong gear.

## Shaft speeds through a reducer

G-3 is a two-stage helical reducer. Its input pinion has 19 teeth and meshes with a 61-tooth gear on the intermediate shaft; a 17-tooth pinion on that shaft meshes with a 53-tooth output gear. The input turns at 1,480 r/min, 24.67 Hz.

The [gear train output check](/tools/gear-train-output-check/) works out the overall ratio and output speed of a compound train from its teeth. Entered with 1,480 r/min and meshes of 19 to 61 and 17 to 53, it gives an overall ratio of 10.009 to 1 and an output speed of 147.86 r/min, 2.464 Hz. The intermediate shaft turns at 24.67 × 19 ÷ 61 = 7.683 Hz. The tool's torque and shaft stress outputs belong to design and are not used here.

```figure
type: compare
title: G-3's shafts and meshes at 1,480 r/min input
cols: Speed | Mesh frequency | Mesh teeth
rowhead: Shaft or mesh
- Input shaft | 24.67 Hz | — | —
- First mesh, 19 to 61 | — | 19 × 24.67 = 468.7 Hz | 19 and 61
- Intermediate shaft | 7.683 Hz | — | —
- Second mesh, 17 to 53 | — | 17 × 7.683 = 130.6 Hz | 17 and 53
- Output shaft | 2.464 Hz | — | —
caption: This is an illustration. Speeds from the gear train output check; mesh frequency = teeth × shaft speed, the same whichever gear of the pair is used.
```

## The mesh and its sidebands

Every gear mesh produces vibration at its mesh frequency, because each tooth pair's stiffness varies as it rolls through contact and the transmitted load is shared unevenly between teeth. Harmonics at 2 and 3 times the mesh frequency are normal. What changes with condition is their size and the pattern of sidebands around them.

A sideband is a peak at a fixed spacing either side of a larger peak. It means the larger peak is being modulated: its amplitude rises and falls once per revolution of some shaft. If a gear is eccentric, or has a damaged or worn tooth, the mesh is disturbed once each time that gear turns, and sidebands appear at spacings equal to that gear's shaft speed. The spacing therefore identifies the shaft carrying the faulty gear. Around G-3's first mesh at 468.7 Hz, sidebands spaced at 24.67 Hz point to the input pinion; sidebands spaced at 7.683 Hz point to the intermediate gear.

```figure
type: compare
title: What G-3's first-mesh sidebands would indicate
cols: Sideband spacing | Shaft | Likely gear
rowhead: Pattern around 468.7 Hz
- At 24.67 Hz | input | 19-tooth pinion: eccentricity, a damaged tooth, a bent input shaft
- At 7.683 Hz | intermediate | 61-tooth gear: the same faults on the larger gear
- Both families | both | wear on both or misalignment of the mesh
- Mesh harmonics rising, few sidebands | — | even wear of the tooth profiles, or a change in load
caption: This is an illustration of the reasoning. Resolution must be fine enough to separate sidebands 7.68 Hz apart: about 2 Hz or finer.
```

### Wear and a cracked tooth

Even wear of the tooth profiles raises the mesh frequency's harmonics, especially 2 and 3 times the mesh, as the profiles depart from their ideal involute shape, with modest sidebands. It develops over months to years, with a long P-F interval, as Chapter 1's exercise assumed. A cracked or broken tooth is different: it produces a single disturbance once per revolution of its gear, which in the spectrum spreads into many sidebands of small size, and in the time waveform appears as one distinct event per revolution. Cracked teeth can progress to breakage in weeks. The distinction decides the urgency: rising mesh harmonics with steady sidebands can be watched for months and the repair planned around the mill's production; a new one-per-revolution event in a synchronous average calls for an inspection at the next stop, because the tooth may not last until the one after.

### The hunting tooth

When the tooth counts of two meshing gears share no common factor, as 19 and 61 do not, every tooth of the pinion eventually meets every tooth of the gear, and a given pair of teeth meets again only after the pinion has turned 61 times and the gear 19 times. That repeat, the hunting tooth frequency, is the mesh frequency divided by the product of the tooth counts: 468.7 ÷ (19 × 61) = 0.404 Hz, once every 2.5 seconds. A defect on one tooth of each gear produces a disturbance only when those two teeth meet, at the hunting tooth frequency, which shows as a low-frequency beat in the waveform and a very low-frequency component in the spectrum. Gear designers choose coprime tooth counts deliberately so that wear is spread evenly over all the teeth; the consequence for monitoring is that a slow beat at exactly 0.404 Hz on G-3 points to damage on both gears of the first stage, often from a manufacturing or assembly defect.

## Trending a gearbox

A gearbox's mesh vibration depends strongly on its load, because the teeth deflect more under more torque. A trend of G-3's mesh amplitude is meaningful only if each reading is taken at a similar load, which on the log-deck conveyor means with logs on the deck. The route records the conveyor's motor current with each reading as a load indicator, and readings taken at unusual loads are flagged rather than trended. Gear oil analysis complements vibration well: iron and other wear metals in the oil, and the size and shape of wear particles, show wear that is spread over many teeth before it raises the mesh harmonics, while vibration shows localised damage, such as a chipped tooth, that adds very little debris. The mill samples G-3's oil every six months.

## Synchronous averaging

The time waveform of a gearbox contains the vibration of every gear and bearing in it at once, and a single tooth's disturbance is hard to see. Synchronous time averaging, introduced in Chapter 5, isolates one shaft: with a once-per-revolution trigger from that shaft, the instrument averages many revolutions, so that everything synchronous with that shaft reinforces and everything else averages away. The averaged waveform shows that shaft's gear meshing tooth by tooth, and a cracked or chipped tooth appears as a disturbance at one point in the revolution.

On G-3, the mill uses a reflective tape and an optical sensor on the input shaft for synchronous averages of the input pinion; for the intermediate gear, whose shaft is enclosed, it uses the input trigger with the gear ratio to compute the intermediate shaft's revolutions, a feature of its data collector.

## Fans and blade pass

A fan's blades pass the casing's cut-off, or the struts of an inlet, once each per revolution, producing a pressure pulse and a vibration at blade-pass frequency: blades times speed. F-2's 8 blades at 24.67 Hz give 197.3 Hz. Blade pass is normal; it rises when the gap between the blades and the cut-off is too small, when the fan runs well away from its design flow and the flow separates, or when an inlet damper or bend upsets the flow into the eye. A fan whose blade pass rises after a change to its ductwork or dampers has a flow problem, not a mechanical one. F-2's blade pass, at 197.3 Hz, is trended with its damper position recorded, for exactly that reason.

## Pumps, vane pass and cavitation

Centrifugal pumps produce vibration at vane-pass frequency, vanes times speed, for the same reason. Positive displacement pumps pulse at the number of pistons, vanes or gear teeth multiplied by the speed: P-4's axial piston pump, with 9 pistons at 24.67 Hz, pulses at 222.0 Hz, and its pressure ripple can be seen in the hydraulic lines as well as the pump's housing.

Cavitation, the formation and collapse of vapour bubbles where the pressure at a pump's inlet falls below the liquid's vapour pressure, produces random high-frequency noise, not a discrete frequency, along with a crackling sound and, eventually, erosion of the impeller. It shows as raised broadband acceleration that rises and falls with the pump's inlet conditions. Cavitation is cured by raising the inlet pressure or lowering the flow, which Centrifugal Pumps by the Numbers works through with the net positive suction head; the vibration's role is to show that it is happening and when.

## Machines whose speed changes

All of these frequencies move with speed, which is a nuisance on machines that change speed during a measurement and an opportunity on machines that can be run at several speeds. On a conveyor or fan driven by a variable-speed drive, a spectrum taken while the speed drifts smears every peak, and the faster the drift and the higher the frequency, the worse the smear: a 1% change in speed during a 4-second measurement moves G-3's first mesh by 4.7 Hz, enough to blur its sidebands completely. Order tracking solves it by sampling the signal at a rate locked to the shaft's rotation rather than to time, so that the spectrum is computed in orders and every speed-related component stays sharp. Where a machine's speed can be varied deliberately, a run-up or coast-down with order tracking also separates components that follow speed, faults and meshes, from those fixed in frequency, which are resonances, and shows each resonance as a peak through which every order passes in turn.

## Couplings and belts

The drive between a motor and its machine adds its own frequencies. A gear coupling or a worn grid coupling produces 2× and mesh-like components; a coupling with a damaged elastomer element rattles with harmonics like looseness. A belt drive produces vibration at the belt's pass frequency and its harmonics, below the running speed, and a worn or mismatched set of belts beats as their slightly different speeds go in and out of phase. Each is recognised by the same method as gears: work out the frequency from the geometry and speed, then look for it.

## The mistake: sidebands traced to the wrong shaft

A route spectrum of G-3, at 1,000 Hz and 1,600 lines, 0.625 Hz resolution, showed the first mesh at 468.7 Hz with a set of sidebands either side. The technician read their spacing as about 25 Hz, attributed them to the input shaft, and the planner booked a fitter to inspect the input pinion at the next stop.

```figure
type: steps
title: Measuring the sideband spacing properly
caption: This is an illustration. Two families of sidebands overlapped; reading the spacing between the outermost peaks gave the wrong shaft.
- First reading | sidebands "about 25 Hz" apart; input pinion blamed
- Zoomed spectrum, 0.125 Hz resolution, 448 to 490 Hz | sidebands at 7.68 Hz spacing, strongest, and a weaker family at 24.67 Hz
- Synchronous average, intermediate shaft | one disturbance per revolution of the 61-tooth gear
- Synchronous average, input shaft | smooth, no disturbance
- * Finding | chipped tooth on the intermediate gear; input pinion sound
- Action | intermediate gear replaced at a planned stop; procedure: sideband spacing measured on a zoomed spectrum and confirmed by synchronous averaging
```

A zoomed spectrum of 448 to 490 Hz at 0.125 Hz resolution showed that the strongest sidebands were spaced at 7.68 Hz, the intermediate shaft's speed, with a weaker family at 24.67 Hz from ordinary input-shaft modulation. The coarser spectrum had shown three or four peaks on each side, and the technician had measured the spacing between the outermost ones of overlapping families. Synchronous averages settled it: the intermediate shaft's average showed one disturbance per revolution, while the input shaft's was smooth. At the stop, the 61-tooth gear had a chipped tooth; the input pinion, which would have been dismantled first, was sound. The mill's procedure now requires sideband spacings to be measured on a zoomed spectrum and confirmed by synchronous averaging before any gear is blamed.

## Exercise: the second mesh

Using G-3's shaft speeds, calculate the second mesh frequency, its second and third harmonics, and the sideband frequencies either side of it that would indicate a fault on the 53-tooth output gear and on the 17-tooth intermediate pinion. Then calculate the resolution needed to separate the output gear's sidebands from the mesh with at least four lines between them, and choose a zoom span.

### Answer

**Given:** intermediate shaft 7.683 Hz; output shaft 2.464 Hz; 17 and 53 teeth.

**Assumptions:** steady speed; Hanning window, needing about four lines between peaks.

**Method:** mesh = 17 × 7.683; sidebands = mesh ± shaft speed; resolution = spacing ÷ 4.

**Second mesh:** 17 × 7.683 = 130.6 Hz; harmonics 261.2 Hz and 391.8 Hz.

**Sidebands for the output gear:** 130.6 ± 2.464 = 128.1 and 133.1 Hz.

**Sidebands for the intermediate pinion:** 130.6 ± 7.683 = 122.9 and 138.3 Hz.

**Resolution:** 2.464 ÷ 4 = 0.62 Hz or finer for the output gear's sidebands; 0.625 Hz just meets it, and a zoom of 120 to 145 Hz at 800 lines, 0.031 Hz resolution, separates them comfortably.

**Interpretation:** the output gear's sidebands are close to the mesh, so a coarse route spectrum would merge them into the mesh peak; a zoom is needed whenever the second mesh rises.

**Verification:** the second mesh can also be computed from the output gear, 53 × 2.464 = 130.6 Hz, the same, as it must be.
