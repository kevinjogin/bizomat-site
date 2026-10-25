---
book: welding-health-and-safety-by-the-numbers
chapterSlug: electrical-safety
order: 7
title: "Electrical safety in welding"
description: "Calculate the current a welding circuit drives through a body, dry and wet, see why open-circuit voltage and confined spaces matter, how voltage-reduction devices help, and why stray current burns."
draft: false
---

A welding power source's voltage is low compared with the mains, and most welders have felt a tingle from an electrode holder without harm, which breeds a dangerous belief that welding circuits cannot kill. They can, in the conditions welders often work in: wet with sweat or rain, kneeling or lying on steel, inside a tank or a pipe, touching the work with one hand and the electrode with the other. The welding circuit's open-circuit voltage, the voltage between the electrode and the work when no arc is burning, is high enough in those conditions to drive a dangerous current through the body. The mains supply to the power source is more dangerous still. And welding current that strays from its intended path can start fires far from the arc.

This chapter calculates the current a welding circuit can drive through a body in dry and wet conditions, explains why open-circuit voltage and the workplace matter, describes voltage-reduction devices and other controls, covers the mains supply, and explains the hazard of stray welding current.

## Current, voltage and the body

The harm from an electric shock depends on the current that flows through the body, its path and how long it flows. The current is the voltage divided by the resistance of the path, and the body's resistance depends enormously on the skin: dry, thick skin resists strongly, while wet, sweaty or broken skin, or a large area of contact, lets current through easily. Inside the body, the resistance is low.

```figure
type: formula
title: Current through a body from a welding circuit's open-circuit voltage
formula: current = voltage ÷ resistance of the body path and contacts
caption: This is an illustration with an assumed open-circuit voltage of 70 V and commonly cited approximate body resistances for a hand-to-hand or hand-to-body path: about 100,000 Ω with dry skin and small contact, and about 1,000 Ω with wet or sweaty skin and good contact. Real resistances vary widely; the figures show the scale of the difference.
- Open-circuit voltage | 70 V
- Dry skin, small contact | about 100,000 Ω
- Wet or sweaty skin, good contact | about 1,000 Ω
step: dry: 70 ÷ 100,000 = 0.0007 A, about 0.7 mA, barely felt
step: wet: 70 ÷ 1,000 = 0.07 A, about 70 mA
step: tens of milliamps through the chest can stop the heart's normal rhythm
```

The same voltage that a welder barely feels with dry gloves and skin can drive a current a hundred times larger when the welder is soaked in sweat and lying on a steel plate. Commonly cited approximate thresholds for alternating current through the body are about 1 milliamp to be felt, about 10 milliamps at which a person may be unable to let go of what they are holding, and several tens of milliamps at which the heart may go into fibrillation, a chaotic rhythm that is fatal without prompt treatment. Seventy milliamps is well into the dangerous range.

```figure
type: bars
title: Illustrative current through a body at 70 V by condition
unit: milliamps
max: 80
caption: This is an illustration using assumed resistances for teaching: dry gloves and skin; damp skin; sweaty skin with good contact; wet skin lying on steel. Real values vary widely between people and situations.
- Dry, gloved, small contact | 0.7
- Damp skin | 7
- Sweaty, good contact | 35
- *Wet, lying on steel | 70
```

## Why welding conditions are dangerous

The conditions that turn a welding circuit into a lethal one are the ordinary conditions of much welding work. Welders sweat heavily under helmets and leathers, and sweat soaks gloves and clothing. Site work is done in rain and on wet ground. Confined spaces such as tanks, boilers and pipes surround the welder with conductive steel, so that much of the body is in contact with the work, and are often hot and humid. Welders kneel, sit and lie on steel to reach joints. And the electrode holder or torch is held in one hand while the other touches the work, putting the circuit across the chest. Most fatal welding shocks have occurred in exactly those situations.

## Open-circuit voltage

The open-circuit voltage is the voltage the power source produces when it is switched on but no arc is burning, which is the condition when the welder changes an electrode, touches the electrode to their skin or the work by accident, or rests the holder against their body. It is higher than the voltage during welding, because it must be high enough to strike the arc. Standards for welding power sources set limits on open-circuit voltage, with lower limits for alternating current than for direct current and for machines used in hazardous situations; this book does not quote them. Direct current is generally considered less dangerous than alternating current at the same voltage, which is one reason direct-current machines are preferred for work in confined and wet places.

## Voltage-reduction devices

A voltage-reduction device lowers the power source's open-circuit voltage to a low, safer level whenever the arc is not burning, and restores the full voltage only when the electrode touches the work to strike an arc. With a voltage-reduction device working, the voltage available to drive current through a welder changing an electrode or touching the electrode is much lower, so the current in the wet case above would be a fraction of what it is at full open-circuit voltage. Safe Work Australia's model code for welding processes discusses voltage-reduction devices for manual metal arc welding in hazardous environments. They must be tested regularly, because a failed device gives no sign until someone is shocked.

## Other controls

The electrode holder and torch must be fully insulated and in good condition, with no exposed metal; cables must be undamaged, with sound insulation and connections. Welders keep gloves, clothing and themselves as dry as they can, change wet gloves, and do not change electrodes with bare or wet hands. In wet or conductive locations, they stand or lie on dry insulating mats or boards, and the work is planned so that they are not in prolonged contact with the steel. The power source is placed outside confined spaces, so that only the leads go in, and the welder has a means of switching it off quickly or a standby person who can. Welders do not wrap cables round their bodies or rest the holder on their laps.

```figure
type: checklist
title: Electrical checks for arc welding equipment and work
caption: This is an illustration of the running case's checks, set from Safe Work Australia's model code, the equipment makers' instructions and the electrical safety laws.
- x Power source | casing sound; supply lead and plug undamaged; tested and tagged as required
- x Welding leads | insulation intact; connections tight; no joins with exposed metal
- x Electrode holder or torch | fully insulated; no cracks; jaws and cable entry sound
- x Work return | clamped to the work close to the weld, on clean metal; not through structure or chains
- x Voltage-reduction device | fitted where the risk assessment requires; tested
- x Conditions | dry gloves and clothing; insulating mat in wet or conductive places
- *? Confined or wet work | direct-current source outside the space; standby person; rescue planned
```

## Leaving the machine

A welding machine left switched on with its holder lying on the bench or the floor is a hazard to anyone who picks up the holder or brushes against it, and to the holder itself, which can arc against the work or the bench. Welders switch the machine off, or at least remove the electrode and hang the holder on an insulated hook, whenever they leave the station, even briefly.

## The mains supply

The power source itself is connected to the mains, at 240 or 415 volts, and the mains side is the more lethal. Damaged supply leads, plugs and extension leads, power sources with damaged casings, and machines opened by unqualified people expose the mains. Supply circuits are protected by residual current devices where the electrical safety laws require; equipment is inspected and tested, and tagged, at the intervals the laws and AS/NZS 3760 set for the environment; and only licensed electricians work inside power sources or on their supply. The coordinator's inspection of the shop found several welding machine supply leads with damaged outer sheaths, held together with tape, which were replaced the same day.

## Stray welding current

Welding current flows from the power source to the electrode, across the arc, through the work and back through the return lead to the power source. If the return lead is not clamped close to the weld, or is clamped to something other than the work, the current finds other paths back: through the steel structure of the building, a crane hook and its chain, a bench's frame, the earth conductors of electrical equipment, or pipework. Those paths are not built to carry hundreds of amps, and they can overheat, arc at their joints and start fires, damage crane chains, bearings and wire ropes, and, through earth conductors, damage electrical equipment. A return lead clamped directly to the work, on clean metal, as close to the weld as practicable, keeps the current where it belongs. Arc Welding by the Numbers covers the return path's effect on the arc itself.

## Falls and secondary injuries

Even a shock too small to harm the heart can cause a serious injury if the welder is at height or in an awkward position: an involuntary jerk away from the shock can throw the welder off a ladder, a scaffold or the work. Work at height is always planned with fall protection, and welding at height adds the shock risk to the many other reasons for it, because a harness that stops a fall also stops the injury a shock would otherwise turn into.

## Two welders on one job

When two welders work on the same piece of steel with separate power sources, the voltage between their two electrodes can be the sum of both machines' open-circuit voltages, if the machines' outputs happen to add, which is a particular hazard with alternating-current machines. A person touching both electrode holders, or an electrode and a holder from the other machine, could receive that combined voltage. Welders working close together on the same work keep their holders apart, never hand an energised holder to each other, and switch off when leaving the holder. In confined spaces, only one welding circuit is used where possible.

## Magnetic fields and medical implants

Welding currents of hundreds of amps produce strong magnetic fields around the leads and the arc, particularly with resistance welding and high-current arc processes. The fields can interfere with heart pacemakers, implanted defibrillators and some other medical devices. Workers with such implants seek advice from their doctor and the device maker before welding or working close to welding equipment, and keep leads away from their bodies. The shop's induction asks new workers, confidentially, whether they have an implanted medical device, so that their work can be planned.

## First aid for electric shock

A person who has received a serious shock may be unconscious, may have stopped breathing, and may have burns where the current entered and left the body. The first step is to make sure the supply is off before touching them, by switching off the machine or the supply, because a rescuer who grabs a person still in contact with a live circuit can be shocked too. Then the rescuer calls for emergency help and, if the person is not breathing normally, starts cardiopulmonary resuscitation and uses an automated external defibrillator if one is available. Anyone who has had a significant shock should be checked by a doctor, even if they seem well, because heart rhythm problems can appear later. The shop installed a defibrillator at its first-aid station and trained first-aiders on each shift to use it.

## Training and awareness

Many welders, having felt harmless tingles all their working lives, underestimate the welding circuit. The coordinator's electrical safety training used the arithmetic of this chapter, showing how the same machine drives a hundred times the current through a wet body as through a dry one, and the welders' own experiences of shocks, to change that belief. Apprentices learned the habits early: dry gloves, a switched-off machine before changing anything, holders hung on insulated hooks, never on the work.

## The running case: the confined space welding

This is an illustration. The shop occasionally repaired the inside of steel hoppers and tanks for customers. The coordinator's review found that these jobs were done with whatever machine was free, often an alternating-current machine without a voltage-reduction device, with the welder kneeling on the steel inside. The shop bought a direct-current inverter with a tested voltage-reduction device for confined and wet work, supplied insulating mats, and made the confined space procedure of Chapter 8, with a standby person able to switch off the machine, compulsory for every such job.

## A failure: the wet glove

This is an illustration. At a site elsewhere, a welder working in the rain on a steel structure changed an electrode with a soaked glove while kneeling on the wet steel, and received a shock that threw them backwards. They were not seriously hurt, because the machine was direct-current and the contact was brief, but the shock was severe enough to stop work.

The investigation found that the welder's gloves had been wet for hours, that no dry spares were available, and that the machine's voltage-reduction device had been disabled because it occasionally made arc starting difficult. The site now supplies spare dry gloves, forbids disabling voltage-reduction devices, and tests them at each job.

## Exercise: wet and dry

A welder touches an electrode at an open-circuit voltage of 80 V. Using assumed resistances of about 50,000 Ω for dry gloved hands and about 800 Ω for wet hands with good contact, what current flows in each case? If a voltage-reduction device lowers the open-circuit voltage to about 20 V, what flows in the wet case?

Dry: 80 ÷ 50,000 = 0.0016 A, about **1.6 mA**, a noticeable tingle. Wet: 80 ÷ 800 = 0.1 A, about **100 mA**, a potentially fatal current.

With the voltage-reduction device, the wet case gives 20 ÷ 800 = 0.025 A, about **25 mA**, still enough to make it hard to let go, but far less dangerous than 100 mA. The device greatly reduces the risk but does not remove it; keeping dry, insulating the welder from the work and the other controls are still needed.
