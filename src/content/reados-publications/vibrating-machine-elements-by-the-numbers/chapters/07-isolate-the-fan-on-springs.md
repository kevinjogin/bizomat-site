---
book: vibrating-machine-elements-by-the-numbers
chapterSlug: isolate-the-fan-on-springs
order: 7
title: "Isolate the fan on springs"
description: "Choose isolator deflection from the lowest running speed, check transmissibility across the drive range, and catch the mount swap, uneven loads and soft roofs that undo it."
draft: false
---

A fan bolted straight to a roof shakes the roof at every frequency it produces. Put it on springs soft enough, and the springs stretch and compress with each shake while passing only a small part of the force into the structure. That is vibration isolation, and it works only above a particular frequency. Below it, springs pass the force through unchanged, and near it they magnify it.

This chapter selects the isolators for RF-3. It starts from the transmissibility curve, sets the isolators' natural frequency from the lowest speed the fan will run, and checks the isolation across the drive range. It then works through three ways isolation is lost in practice: a mount swap, uneven loads and a soft roof. Chapter 8 then looks inside the chosen spring, where a wave problem of its own is waiting.

## Transmissibility

Treat the fan unit as a rigid mass on springs. When a force at frequency f acts on the mass, the fraction passed to the supporting structure is the **transmissibility**:

**T = √[(1 + (2ζr)²) ÷ ((1 − r²)² + (2ζr)²)]**

where r is the frequency ratio f ÷ fₙ, fₙ is the natural frequency of the mass on its springs, and ζ is the damping ratio.

The curve has three regions that matter:

- **Below r ≈ 0.5,** T is close to 1: the springs pass the force straight through.
- **Near r = 1,** T is large. With ζ = 0.05 it reaches about 10; with the lighter damping typical of steel springs it can be several times that.
- **Above r = √2, about 1.41,** T falls below 1 and keeps falling. This is the isolation region.

```figure
type: line
title: Transmissibility against frequency ratio
x: Frequency ratio, excitation ÷ natural frequency
y: Transmissibility
legend: Damping ratio 0.05 | Damping ratio 0.2
ymin: 0
ymax: 11
mark: 1.414 | T = 1 at √2
caption: Isolation begins at a ratio of √2 and improves as the ratio rises. More damping lowers the resonance peak but raises transmissibility in the isolation region.
- 0.5 | 1.332 | 1.314
- 0.8 | 2.72 | 2.18
- 1 | 10.05 | 2.693
- 1.2 | 2.208 | 1.703
- 1.414 | 1.001 | 1.0
- 2 | 0.339 | 0.412
- 3 | 0.13 | 0.193
- 4 | 0.072 | 0.125
- 5 | 0.047 | 0.093
```

Damping cuts both ways. It limits motion at resonance, which matters when the fan starts and stops. In the isolation region it lets more force through: at r = 3, T is 0.130 with ζ = 0.05 but 0.193 with ζ = 0.2. Steel springs have very little damping, which is good for isolation and poor at resonance.

## Natural frequency from static deflection

For a mass on linear springs, the natural frequency follows from how far the springs compress under the mass's weight:

**fₙ = (1 ÷ 2π) × √(g ÷ δ)**

where δ is the static deflection. This is convenient, because isolator makers sell mounts by rated load and deflection. A 25 mm static deflection gives about 3.15 Hz; a 6 mm deflection about 6.4 Hz. Softer means lower.

## Selecting RF-3's isolators

This is an illustration. RF-3 and its base frame weigh 420 kg, with the centre of gravity central between four mounts, so each mount carries 105 kg.

The lowest disturbing frequency the isolators must handle is the fan's 1× frequency at the drive's 30 Hz minimum, 9.28 Hz. The case's design aim is a frequency ratio of at least 3 at that speed, which keeps transmissibility near 0.13 with light damping. That needs fₙ ≤ 9.28 ÷ 3 = 3.09 Hz, which needs a static deflection of at least g ÷ (2π × 3.09)², about **26 mm**.

The isolators chosen use a steel spring of rate 41.77 N/mm, sized in Chapter 8. Under 105 kg, each deflects 105 × 9.81 ÷ 41.77 = **24.7 mm**, giving fₙ = (1 ÷ 2π) × √(9.81 ÷ 0.0247), about **3.17 Hz**. That is slightly stiffer than the aim; the ratio at minimum speed is 9.28 ÷ 3.17 = 2.92 rather than 3, which the case accepts.

```figure
type: compare
title: RF-3 spring isolators across the drive range
rowhead: Excitation
cols: Frequency | Ratio r | Transmissibility, ζ = 0.05
caption: This is an illustration: 105 kg per mount, 41.77 N/mm springs, natural frequency 3.17 Hz. Everything the fan produces is well above √2 times the natural frequency.
- Fan 1× at 30 Hz supply | 9.28 Hz | 2.92 | 0.138
- Fan 1× at 50 Hz supply | 15.47 Hz | 4.87 | 0.049
- Motor 1× at 50 Hz supply | 24.17 Hz | 7.61 | 0.022
- Blade pass at 30 Hz supply | 74.2 Hz | 23.4 | 0.005
- * Belt pass at 30 Hz supply | 3.95 Hz | 1.24 | about 1.8
```

The table shows one row that is not isolated. The belt-pass frequency at minimum speed is only 1.24 times the isolators' natural frequency, inside the amplifying region. Belt-pass forces are small on a drive with a good belt, so this is recorded rather than redesigned around, but a damaged belt or a lumpy joint would show up as a slow heave of the whole unit at low speed. The [vibration isolator selection tool](/tools/vibration-isolator-selection/) works through the same calculation for other loads and speeds.

## Passing through resonance

Every time RF-3 starts or stops, its speed passes through 3.17 Hz, where the springs magnify rather than isolate. With little damping, motion can grow large if the fan lingers near that speed.

On a VSD this is easy to manage. The drive ramps from rest to its 30 Hz minimum in a set time, crossing the resonance quickly, and it never runs continuously below 30 Hz. The risk is the coast-down when power is lost or the drive is set to coast to a stop: the fan then slows gradually and may sit near 3 Hz for some seconds. A controlled ramp-down where possible, travel limiters or snubbers on the isolators, and flexible connections with enough slack for the transient motion are the usual responses.

## A failure case: the cheaper mounts

This is an illustration. During a maintenance contract change, RF-3's spring isolators are replaced with rubber mounts of the same load rating, described as "anti-vibration mounts", which deflect about 6 mm under the unit. Some weeks later, staff in the top-floor office complain of a hum and a faint shaking in the evenings, when the fan runs at its minimum speed.

The calculation explains it. With 6 mm deflection, fₙ is (1 ÷ 2π) × √(9.81 ÷ 0.006), about 6.44 Hz. At the 9.28 Hz minimum fan speed, r is 1.44, barely above √2. Transmissibility with ζ = 0.05 is about 0.93: the mounts pass 93 per cent of the force into the roof. At full speed, r is 2.40 and T is about 0.22, so the daytime problem was smaller and went unnoticed.

```figure
type: compare
title: Spring isolators against the replacement rubber mounts
rowhead: Condition
cols: Springs, 24.7 mm | Rubber, 6 mm
caption: This is an illustration with a damping ratio of 0.05 for both. The rubber mounts isolate poorly at full speed and hardly at all at the minimum speed.
- Natural frequency | 3.17 Hz | 6.44 Hz
- Ratio at 9.28 Hz, minimum speed | 2.92 | 1.44
- * Transmissibility at minimum speed | 0.138 | about 0.93
- Transmissibility at full speed | 0.049 | about 0.22
```

The error was detected when a technician compared the new mounts' rated deflection with the original isolator schedule. The correction was to reinstate spring isolators of the specified deflection and to add the required static deflection, not just the load rating, to the maintenance specification. "Anti-vibration mount" says nothing about the frequency at which a mount begins to work.

## Uneven loads and a leaning unit

The calculation above assumed the centre of gravity sits centrally. On a real fan unit the motor hangs on one side and the impeller housing on the other. If the centre of gravity is off centre, identical springs carry different loads, deflect by different amounts and tilt the unit.

This is an illustration. Suppose RF-3's centre of gravity is off centre so that two mounts carry 120 kg each and the other two 90 kg. With identical 41.77 N/mm springs, the heavy side deflects 28.2 mm and the light side 21.1 mm. The unit leans by 7 mm across the mount spacing, the belts and duct connection see a skewed set-up, and the four mounts have slightly different natural frequencies, which couples bouncing with rocking.

The remedy is to select each mount for its own load so that all four deflect the same amount. To give 24.7 mm at both loads, the heavy-side springs need about 47.7 N/mm and the light-side about 35.8 N/mm. Isolator makers provide springs in steps of rating and colour-code them for this reason. The installer then levels the unit with the mounts' adjusting bolts, and the installed deflections are recorded.

## What the isolator specification should say

The failure case and the uneven-load case share a cause: the specification stated a load rating and left the rest to whoever bought the mounts. A specification that protects the isolation states, for each mount position, the load it carries, the minimum static deflection under that load, the spring rate or colour code chosen, the installed working height, any lateral stiffness requirement, and the restraint or snubber arrangement with its running clearance. It also states the lowest disturbing frequency the selection was based on, 9.28 Hz for RF-3, so that a later change of drive minimum or fan speed can be checked against it.

With that information, a replacement mount can be checked in a minute against the schedule. Without it, the only information on a mount is its brand and load, and the frequency at which it begins to isolate is anyone's guess.

## Rocking modes

A mass on four springs has six rigid-body modes, not one: bouncing, two sideways sways, two rocking modes and a twisting mode. Bouncing is the one the static deflection formula gives. Rocking modes depend on the spring spacing and the unit's mass moments of inertia, and on a tall unit with a high centre of gravity they can be lower than the bouncing mode.

A practical rule of good isolator layout is to place the mounts as wide apart as the base allows and as close as possible to the height of the centre of gravity, often by using a heavy base frame or outrigger brackets. Where the unit is tall or the forces large, the isolator maker or a vibration engineer should check all six modes against the excitation bands, not just the bouncing mode.

## A soft roof

The transmissibility formula assumes the springs sit on a rigid base. A lightweight roof is not rigid. If the roof deflects noticeably under the unit, it forms a second spring with its own natural frequency, and the simple isolation figures no longer hold.

This is an illustration. Suppose the roof steel deflects 3 mm under RF-3's weight at the mount positions. Treating that crudely in the same way as the springs, the roof-and-unit system would have a natural frequency near (1 ÷ 2π) × √(9.81 ÷ 0.003), about 9.1 Hz. That is right at the fan's minimum running speed. The estimate ignores the roof's own mass and is only a flag, but it is a strong one: a roof bay with a natural frequency inside the fan's 1× band will respond to whatever force the isolators let through, however small.

The springs and roof in series also soften the overall support slightly: 24.7 mm plus 3 mm of deflection gives about 3.0 Hz rather than 3.17 Hz for the bouncing mode. That small change is not the concern. The roof's own response is. A structural engineer should confirm the stiffness and natural frequency of the roof bay that carries vibrating plant, and the isolator selection should state the support stiffness it assumed.

## Restraints and connections

Springs that let a fan move freely for isolation also let it move under wind and earthquake. Rooftop units on springs normally need restraints or snubbers that leave a small clearance in normal running and stop the unit under extreme loads. The Australian Standards for structural design actions, AS/NZS 1170.2 for wind and AS 1170.4 for earthquake, govern those loads, and the design belongs to a structural engineer.

Every rigid connection across the isolators is a short circuit for vibration. A hard-piped drain, a rigid conduit or a tight duct joint can carry more force into the building than the springs do. Flexible connectors, slack cable loops and flexible conduit are part of the isolation system. Chapter 9 looks at the duct connector as a vibrating membrane in its own right.

## Check the installed isolators

Isolators are often installed correctly on paper and wrongly on the roof. A short inspection after installation, and at each major service, catches most problems:

```figure
type: checklist
title: Spring isolator inspection for RF-3
caption: The fan is stopped and isolated for the inspection; the deflection check needs only a rule and the isolator schedule.
- Remove transit and installation locks | many spring mounts are supplied with a locking bolt or plate that must be released after levelling
- Measure each mount's working height | compare with the schedule; 24.7 mm deflection for RF-3
- Check the unit is level | a lean means uneven loads or mixed spring ratings
- Check every spring has clearance | no coil touching another coil, the housing or the snubber
- x Do not accept a mount bottomed out | a solid spring isolates nothing
- Inspect every connection across the springs | duct connector, conduit, drain, refrigerant or water pipes
- ? Has anything been added to the unit since installation | added mass lowers the natural frequency and changes the loads
```

The transit lock is the classic failure. A locked spring mount is a steel block. The fan then behaves as if bolted to the roof, and the isolation calculation describes equipment that is not there. The give-away is a measured deflection of zero, or a spring that does not move at all when the unit is rocked by hand with the fan stopped.

Recording the measured working heights also gives a baseline. Springs relax slightly over years, and a unit that has settled unevenly, or had equipment added to it, shows up as a change in those heights long before anyone feels a difference in the office below.

## Exercise: setting the drive minimum for the rubber mounts

Suppose the rubber mounts from the failure case could not be replaced for a few months. To what supply frequency would the drive minimum need to be raised to keep the frequency ratio at the fan's 1× speed at least 3 with those mounts? What would that do to the fan's turndown?

**Answer.** With fₙ = 6.44 Hz, a ratio of 3 needs a fan 1× frequency of at least 3 × 6.44 = 19.3 Hz. The fan's full speed is only 15.47 Hz, so no setting within the drive's range achieves it. Even at full speed, r is only 2.40.

The rubber mounts cannot provide the intended isolation at any speed the fan can run. Raising the drive minimum would only remove the worst low-speed operation, and would remove the fan's turndown with it. The correct action is to restore the specified spring isolators; until then, the evening minimum speed could be raised as a temporary measure if the ventilation requirement allows, with the reason recorded.
