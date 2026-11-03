---
book: vibration-monitoring-by-the-numbers
chapterSlug: misalignment-looseness-and-resonance
order: 7
title: "Misalignment, looseness and resonance"
description: "The signatures of misalignment, soft foot and looseness, how resonance magnifies an ordinary force, bump tests, the isolator selection tool, and a pump skid that could not be balanced."
draft: false
---

Unbalance is only one cause of a high 1× vibration and rarely the only fault a machine has. Misaligned shafts force their bearings to carry loads the coupling should have absorbed, and show at 2× and in the axial direction. Loose bolts, worn fits and cracked bases let parts rattle against each other, producing a picket fence of harmonics. And resonance, a natural frequency of the machine or its support close to a forcing frequency, magnifies an ordinary, acceptable force into a severe vibration, which no amount of balancing or aligning will cure. Telling these apart, from each other and from unbalance, is the core of vibration diagnosis.

This chapter describes the signatures of misalignment, soft foot and looseness, explains resonance and how much it magnifies, shows how to find natural frequencies with a bump test, uses the isolator selection tool to see why a pump skid's rubber pads put it in resonance, and finishes with the attempts to balance that skid's motor before anyone looked for a resonance.

## Misalignment

Two shafts joined by a coupling are aligned when their axes are collinear at running temperature. If they are offset, parallel but displaced, or angled, meeting at an angle, the coupling forces them to bend slightly as they turn, and the forces repeat twice per revolution for most couplings. The result is vibration at 1× and, characteristically, at 2×, often larger in the axial direction than unbalance would produce.

```figure
type: compare
title: Signatures of misalignment and how to tell it from unbalance
cols: Unbalance | Misalignment
rowhead: Feature
- Dominant frequency | 1× | 1× and 2×, sometimes 3×; 2× often larger than 1×
- Direction | radial | radial and strongly axial
- Axial phase across the coupling | not characteristic | about 180°: the two machines move in opposite directions
- Radial phase across the coupling | similar on both sides | often about 180°
- Response to temperature | little change | changes as the machines reach running temperature and grow
caption: Typical signatures; real machines often have both faults, and the phase comparisons are the most reliable discriminators.
```

The axial phase across the coupling is the most reliable test. With a once-per-revolution reference, the technician measures the axial 1× phase on the motor's coupling-end bearing and on the driven machine's coupling-end bearing. Misalignment pushes the two shafts in opposite directions along their axes at the same instant, so the phases differ by about 180°; unbalance gives no such relation. Correcting misalignment is an alignment job, worked through in Shaft Alignment by the Numbers; vibration's role is to detect it and to confirm the correction.

### Misalignment that keeps coming back

A machine that is aligned correctly and then drifts out of alignment within weeks has a cause that alignment alone does not fix. Pipe strain is a common one: a pump whose suction and discharge pipes are not supported independently, or were forced into place, is pushed and twisted by the pipework, and as the pipes warm and cool the pump moves on its base. The pump's coupling-end bearing then shows a growing 2× and axial vibration a few weeks after each alignment.

The test is to disconnect the pipes, or loosen their flange bolts, with a dial gauge on the pump's shaft or feet: if the pump moves more than a few hundredths of a millimetre when released, the pipes are straining it. The fix is pipe supports that carry the pipes' weight and thermal movement independently, with the flanges meeting without force. P-4's pump had exactly this problem when its rigid steel discharge pipe was first installed; changing to the flexible hoses needed for the spring isolators, described below, removed it as a side effect.

### Soft foot

A machine whose feet do not all sit flat on its base is distorted when its hold-down bolts are tightened, a condition called soft foot. The distortion bends the machine's frame, misaligns its own bearings and changes its natural frequencies. It shows as raised 1× and sometimes 2× vibration in one direction, which changes when individual hold-down bolts are loosened. The check is simple: with a dial gauge on each foot, loosen its bolt and watch the foot rise; a rise of more than a few hundredths of a millimetre needs shimming. Soft foot must be corrected before alignment, because a machine whose frame moves when bolted cannot hold an alignment.

## Mechanical looseness

When a part is loose, it is driven by the 1× force but moves in jerks, hitting its stops, and the waveform is clipped rather than smooth. A clipped waveform contains many harmonics, so looseness shows as a long series of peaks at 1×, 2×, 3× and onwards, sometimes with half-order components at ½×, 1½× and so on. Looseness can be structural, a loose base or cracked frame, or rotating, a bearing loose on its shaft or in its housing, or a loose impeller. The first is directional, worst in the direction of the looseness; the second is often more uniform. Looseness amplifies other faults, because it lets a small force produce a large motion, and it tends to get worse quickly once it starts, as fretting wears the loose joint.

### Bent shafts, eccentric pulleys and belts

Some 1× vibration is not unbalance at all. A bent shaft vibrates at 1× like unbalance but also shows strong axial 1× with phases about 180° apart at its two ends, and balancing it gives only a temporary improvement at one speed. A pulley whose bore is off-centre makes the belt tension rise and fall once per revolution, giving 1× vibration mainly in the line between the two pulleys' centres, and balancing the pulley does not remove it because the force comes from the belt. Belts themselves produce vibration at their own pass frequency, the belt's speed divided by its length, and harmonics of it, which fall below the running speed and are easily mistaken for something else. Each of these has a distinctive direction or phase pattern, which is why the technician measures all three directions and takes phase whenever 1× is high.

## Resonance

Every structure has natural frequencies at which it vibrates freely if disturbed: a tuning fork's note, a guitar string's pitch, a machine frame's sway. If a force acts at or near one of those frequencies, the structure responds far more than the same force would produce at other frequencies. How much more depends on how close the frequencies are and how much damping the structure has.

```figure
type: formula
title: Dynamic magnification of a single-degree-of-freedom structure
formula: Magnification = 1 ÷ √[(1 − r²)² + (2 ζ r)²]        r = f ÷ f_n
caption: r is the ratio of the forcing frequency to the natural frequency and ζ the damping ratio, typically 0.02 to 0.1 for machine structures. At r = 1 the magnification is 1 ÷ 2ζ, 10 for ζ = 0.05.
- f | forcing frequency
- f_n | natural frequency
- ζ | damping ratio
```

```figure
type: bars
title: Magnification of a 1× force at 24.67 Hz against the structure's natural frequency, ζ = 0.05
max: 8
caption: This is an illustration. A natural frequency within about 20% of a forcing frequency magnifies it several times; one well above or below gives a modest response.
- Natural frequency 20 Hz, r = 1.23 | 1.87
- * Natural frequency 26 Hz, r = 0.95 | 7.26
- Natural frequency 35 Hz, r = 0.70 | 1.97
```

### Finding natural frequencies

Natural frequencies are found by a bump test: with the machine stopped, the structure is struck with a soft-faced hammer while an accelerometer records its response, and the spectrum shows peaks at the natural frequencies. Vibrating Machine Elements by the Numbers explains bump tests and damping measurements in detail. A machine that cannot be stopped can be tested while running by striking it repeatedly and averaging with the hammer as a trigger, which emphasises the struck response over the running vibration. The signature of resonance in running data is a component whose amplitude depends strongly on speed, peaking sharply at one speed, and whose phase shifts by about 90° through that speed.

## P-4's skid on rubber pads

P-4, the hydraulic power unit, is a 400 kg skid carrying its motor, pump and oil tank. During a noise reduction project it was set on four rubber pads, chosen from a catalogue for their load rating. Each pad's vertical stiffness was 2,669 N/mm.

The [vibration isolator selection tool](/tools/vibration-isolator-selection/) shows what that did. Entered with 400 kg on four mounts, a lowest running speed of 1,480 r/min, a target of 90% isolation, a damping ratio of 0.05 and the chosen stiffness of 2,669 N/mm per mount, it gives the skid's natural frequency on the pads as 26 Hz, against a forcing frequency of 24.67 Hz, and reports that the mounts amplify the force by 7.3 times. For 90% isolation it calls for a natural frequency of 7.26 Hz, a static deflection of 4.72 mm and a stiffness of 208 N/mm per mount.

```figure
type: compare
title: P-4's skid on three mounting options, from the isolator selection tool
cols: Stiffness per mount | Natural frequency | Effect on the 1× force
rowhead: Option
- Original rubber pads | 2,669 N/mm | 26 Hz | amplified 7.3 times
- Pads 1.8 times stiffer | 4,836 N/mm | 35 Hz | amplified 2.0 times
- * Spring isolators sized for 90% isolation | 208 N/mm | 7.26 Hz | 90% isolation, transmitting 10%
caption: This is an illustration. 400 kg skid, four mounts, 1,480 r/min, damping ratio 0.05. Soft isolators need flexible hydraulic hoses and electrical connections to allow the skid to move.
```

The pads had been chosen for load and noise without checking their frequency, and they put the skid's vertical mode just above its running speed. Stiffer pads would have helped only partly, still amplifying the force twice. The solution was spring isolators sized for 90% isolation, with the hydraulic lines changed to flexible hoses so the skid could move, and the motor's terminal box connected by a flexible conduit.

### Moving a natural frequency

When a resonance is found, there are three ways out. The natural frequency can be raised by stiffening the structure, adding braces, gussets or a heavier base, which works if the frequency can be pushed comfortably above every forcing frequency of concern. It can be lowered by softening the support, as P-4's springs did, which works if the frequency can be pushed well below the running speed and the machine can tolerate moving on its mounts. Or the forcing frequency can be moved, by changing the speed on a variable-speed drive, which is cheap where the process allows it. Adding mass alone lowers the natural frequency, which helps only if the starting point is above the forcing frequency. Adding damping does not move the frequency but reduces the peak, useful where the machine must pass through a resonance during start-up. Each option should be checked against every forcing frequency, not just 1×, because moving a natural frequency away from one can bring it close to another, as the exercise below shows.

### Looseness on G-3's base

The gearbox G-3 once showed a spectrum full of harmonics, 1× through 10× of its input speed, with half-order peaks between them, all much stronger horizontally than vertically. A fitter found two of its four base bolts loose and one cracked foot weld, the result of a conveyor jam that had shock-loaded the base. Re-welded and torqued, the harmonics disappeared. Looseness of this kind does not fix itself and fretting soon wears the joint, so the mill treats a picket fence of harmonics as urgent.

## The mistake: balancing a resonance

Before the cause was understood, P-4's motor showed 1× vibration of 7.5 mm/s vertically, well above its alert, and the motor was booked for balancing in place. The first trial weight changed the vibration in a way that suggested a correction; the correction fitted reduced the vibration only from 7.5 to 6.8 mm/s; a second balance run gave a different sensitivity from the first.

```figure
type: steps
title: From failed balancing to a resonance
caption: This is an illustration. Balancing a structure in resonance gives inconsistent sensitivities because tiny changes in speed and load move the response along a steep resonance curve.
- Symptom | 1× vertical 7.5 mm/s; horizontal only 1.9 mm/s
- Balancing | two runs, inconsistent sensitivities; residual 6.8 mm/s
- Clue | vertical four times horizontal; motor's own balance grade checked on a stand later was good
- Bump test, skid stopped | strong vertical natural frequency at 26 Hz, close to 1× at 24.67 Hz
- * Cause | rubber pads put the skid's vertical mode within 6% of running speed
- Fix | spring isolators at 7.3 Hz with flexible hoses; 1× vertical fell to 0.9 mm/s
```

The pattern pointed away from unbalance: the vertical 1× was four times the horizontal, where unbalance on a symmetrical motor would give similar readings, and balancing produced inconsistent sensitivities, because near a resonance a tiny change in speed or load moves the response along a steep curve. A bump test on the stopped skid found a strong vertical natural frequency at 26 Hz, 6% above the running speed. With the spring isolators fitted, the vertical 1× fell to 0.9 mm/s, and the balance weights added during the failed attempts were removed, since the motor's balance had never been the problem. The mill's rule now is to bump-test any machine whose 1× is much larger in one radial direction than the other, before anyone fits a balance weight. A bump test takes a quarter of an hour; the two failed balance runs had taken most of two shutdowns.

## Exercise: will the stiffer pads do?

A supplier proposes, instead of springs, rubber pads with a stiffness of 6,000 N/mm each under P-4's 400 kg skid. Calculate the natural frequency on four such pads, the frequency ratio at 1,480 r/min, and the magnification with a damping ratio of 0.05. Then say whether the proposal is acceptable, and what other forcing frequency it should be checked against.

### Answer

**Given:** k = 6,000 N/mm = 6.0 × 10⁶ N/m per mount; four mounts; 400 kg; 24.67 Hz; ζ = 0.05.

**Assumptions:** the skid moves as a rigid mass vertically; the pads act in parallel.

**Method:** f_n = (1 ÷ 2π) √(4k ÷ m); r = f ÷ f_n; magnification = 1 ÷ √[(1 − r²)² + (2ζr)²].

**Natural frequency:** √(2.4 × 10⁷ ÷ 400) = √60,000 = 244.9 rad/s; f_n = 244.9 ÷ 2π = 39.0 Hz.

**Frequency ratio:** 24.67 ÷ 39.0 = 0.633.

**Magnification:** 1 ÷ √[(1 − 0.400)² + (0.063)²] = 1 ÷ √(0.360 + 0.004) = 1 ÷ 0.603 = 1.66.

**Acceptable?** The pads still amplify the 1× force by two-thirds, and they put the natural frequency at 39 Hz, within 21% of the motor's 2× at 49.33 Hz, where misalignment forces act. At r = 49.33 ÷ 39.0 = 1.265, the magnification is 1 ÷ √[(1 − 1.600)² + (0.127)²] = 1.63. The proposal is worse than the springs on both counts.

**Verification:** the isolator selection tool, entered with 400 kg, four mounts, 1,480 r/min, ζ = 0.05 and 6,000 N/mm, gives a natural frequency of 38.98 Hz and an amplification of 1.66, matching.
