---
book: combustion-by-the-numbers
chapterSlug: carbon-monoxide-purging-and-approvals
order: 8
title: "Carbon monoxide, purging and approvals"
description: "The hazards of gas-fired plant in numbers: flammable limits, how fast a chamber can fill, purging, the safety chain, carbon monoxide in a room, and why changes need the regulator's acceptance."
draft: false
---

Gas-fired equipment is safe when it works as designed and dangerous when it does not, and the difference can arise in seconds. Unburned gas can fill a furnace chamber and explode on the next ignition attempt. A rich flame or a blocked flue can fill a room with carbon monoxide, which cannot be seen or smelled. These hazards are the reason gas appliances carry layers of automatic protection and are regulated more tightly than almost any other plant in a factory.

This chapter does not tell anyone how to set up a burner management system or commission an appliance; that is work for licensed gasfitters under the standards and the appliance's approval. It explains, with numbers, why the protections exist: how little gas makes a flammable mixture, how quickly a chamber can reach it, what purging achieves, how carbon monoxide builds up in a room, and why a change to an approved appliance is not just a mechanical job. It ends with the heat exchanger from Chapter 7, which turned out to be exactly such a change.

## Flammable mixtures

Methane burns in air only within a range of concentrations. NOAA's CAMEO Chemicals datasheet gives its lower explosive limit as **5%** and its upper limit as **15%** by volume. Below 5% there is too little fuel to sustain a flame; above 15% there is too little oxygen. Natural gas, with its small share of heavier hydrocarbons, has a slightly lower limit, and suppliers' safety data sheets give the values for their gas.

Five per cent sounds safe until it is turned into volumes. TF-120's chamber and the flue up to its damper hold about **4.5 m³** for this illustration. A uniform 5% mixture in that space contains only **0.225 m³** of gas.

```figure
type: stats
title: How fast TF-120's chamber could reach its lower explosive limit
caption: This is an illustration assuming the gas mixes evenly through 4.5 m³. Real releases are uneven, so pockets reach a flammable mixture sooner than the average suggests.
- 0.225 m³ | gas for a 5% mixture in 4.5 m³
- 72 s | to release it at both burners' full flow, 11.2 m³/h
- 12 min | at one burner's low-fire flow, about 1.1 m³/h
- 22.9 m³/h | oxygen the burners consume at high fire
```

At full gas flow with no flame, the chamber would reach its lower explosive limit on average in about a minute and a quarter, and parts of it much sooner. That is why a flame safeguard must shut the gas off within a few seconds if a flame is not proved after ignition, or if an established flame is lost, and why the safety time it allows is set by the standards and the appliance's approval, not by the operator's patience.

## Purging before ignition

Before any attempt to light a burner, the chamber and flue are swept with air to remove any gas that may have leaked in since the last firing. The purge must move enough air to dilute any plausible accumulation to well below the lower explosive limit.

A simple mixing model shows why purges take several minutes. If the purge air mixes completely with the chamber's contents, the concentration of any gas in the chamber falls by a factor of e, about 2.72, for every volume change of air. TF-120's fan delivers about 130 m³/h, so one change of the 4.5 m³ chamber and flue takes about **2.1 minutes**.

```figure
type: formula
title: Purge dilution with perfect mixing
formula: C = C₀ × exp(−n), so n = ln(C₀ ÷ C)
caption: A teaching model. Real chambers do not mix perfectly; dead zones keep gas longer, which is one reason the purges required by standards and approvals are longer than this model suggests.
- C₀ | starting gas concentration
- C | target concentration
- n | number of volume changes of purge air
step: from 15% gas to 1.25% (a quarter of the lower limit): n = ln(15 ÷ 1.25) = 2.48 volume changes, about 5.1 minutes
step: from 5% to 1.25%: n = ln 4 = 1.39 volume changes, about 2.9 minutes
```

The purge requirements for an appliance like TF-120 come from AS 3814 and the appliance's acceptance, and they include proving that the purge air actually flowed, through an air pressure or flow switch, before ignition is allowed. A purge that is shortened, bypassed or run with the fan's damper partly closed does not do what the numbers assume.

## The safety chain

A modern burner management system enforces a fixed sequence, in which each step must be proved before the next is allowed. The details belong to the standards and the appliance's design; the logic is the same everywhere.

```figure
type: steps
title: The sequence a burner management system enforces
caption: General logic only. The specific checks, times and devices for an appliance are set by AS 3814, the appliance's acceptance by the technical regulator and its maker.
- Pre-start checks | air pressure switch open with fan off; safety shutoff valves proved closed; gas pressure within limits
- Pre-purge | fan running, air flow proved, chamber swept for the required time
- Ignition | igniter energised, pilot or low-fire gas admitted for a limited safety time
- Flame proved | flame detector confirms a flame, or gas is shut off and the system locks out
- * Run | burner released to modulate; flame, air pressure, gas pressure and over-temperature monitored throughout
- Shutdown | gas valves close; post-purge clears the chamber
```

Each protective device answers one of the hazards in this chapter. Two safety shutoff valves in series, with a check that they have closed tightly, keep gas out of the chamber when the burner is off. The air pressure switch stops gas being admitted without air. Gas pressure switches stop the burner firing when the supply pressure is too high or too low for a stable flame. The flame detector stops gas flowing without a flame. And an independent over-temperature limit, with its own sensor, stops the furnace overheating if the temperature control fails; *Contact Temperature Sensors by the Numbers* explains why that sensor and its wiring deserve their own checks.

## Carbon monoxide

Carbon monoxide forms when fuel burns without enough oxygen, or when a flame is chilled by a cold surface before its reactions are complete. Chapter 6's blocked impulse line produced several hundred ppm of it at low fire. In the flue, carbon monoxide is a sign of poor combustion; in a room, it is a poison. It binds to the haemoglobin in blood far more strongly than oxygen does, and it gives no warning by smell or irritation.

SafeWork NSW's fact sheet gives the workplace exposure standard for carbon monoxide as **30 ppm averaged over 8 hours**, with tighter limits on short peaks. The standard applies to the air people breathe, not to flue gas, and a flue gas reading of a few hundred ppm is harmless if the flue carries it away. The danger comes when combustion products spill into an occupied space, through a blocked or downdraughting flue, a leaking flue joint under positive pressure, or a furnace whose chamber pressure pushes gas out through its door.

How much the concentration in a room rises depends on how much carbon monoxide enters it and how much air dilutes it. At steady state with good mixing, the room concentration is the carbon monoxide entering per hour divided by the ventilation flow.

```figure
type: compare
title: Steady carbon monoxide from 10 m³/h of spilled flue gas at 1,000 ppm
cols: Ventilation | Steady CO in the room
rowhead: Space
caption: This is an illustration with perfect mixing. The same fault is trivial in a large, well-ventilated workshop and dangerous in a small, closed plant room.
- Workshop, 2,000 m³ at 1 air change an hour | 2,000 m³/h | 5 ppm
- Small enclosed room, 100 m³ at 2 air changes an hour | 200 m³/h | 50 ppm
- *Small closed room, 100 m³ at 0.5 air change an hour | 50 m³/h | 200 ppm
```

Two practical consequences follow. Fixed carbon monoxide detectors belong near gas-fired plant in enclosed spaces, as well as in the flue gas analyser's toolkit. And the ventilation of a room containing gas appliances has to supply their combustion air as well as dilute any leak: TF-120 alone draws 130 m³/h of air and consumes about 23 m³/h of oxygen at high fire. The openings needed are set by AS/NZS 5601.1 for the installation, and closing them up to keep a room warm or quiet is a common cause of spillage.

The flue gas reading is also an early warning for the room. A burner's air-free carbon monoxide, recorded at each service at the same firing rates, should stay roughly constant from year to year. TF-120's burners read about 29 ppm air-free at high fire when they were commissioned; a later reading of 150 ppm at the same oxygen would mean something has changed, a damaged nozzle, a partly blocked air passage or a drifting ratio, long before the burner makes enough carbon monoxide to threaten anyone. Trending the figure costs nothing but a column in the service record, and it is the cheapest safety check in this book.

### Oxygen in a closed room

Combustion consumes oxygen, and an appliance in a room without adequate openings draws the room's oxygen down while filling it with combustion products. The arithmetic is quick. This is an illustration. Suppose TF-120 stood in a closed 300 m³ room with every opening shut, firing at its full 120 kW and consuming about 22.9 m³ of oxygen an hour. The room holds about 300 × 0.2095 ≈ 63 m³ of oxygen. Safe Work Australia's model code of practice for confined spaces treats 19.5% oxygen as the bottom of the safe band, as *Industrial Gases by the Numbers* sets out. Taking the room from 20.95% to 19.5% removes about 0.0145 × 300 ≈ 4.4 m³ of oxygen, which the furnace would burn in about **11 minutes**, even before counting the carbon dioxide and water vapour it adds and the carbon monoxide that a starved flame begins to make. Real rooms leak, so the real figure is longer, but the order of magnitude is the point: a furnace in a closed room changes its air quickly, which is why the openings required for an installation are not optional.

## People in the safety chain

The automatic protections are designed so that no single failure, and no single wrong action, leads to an explosion or a poisoning. People can still defeat them, and the commonest way is impatience. A burner that locks out after a failed ignition is telling its operator something; pressing the reset button repeatedly asks the system to try again without anyone finding out why. Each failed trial admits a little gas: at one burner's low-fire flow of about 1.1 m³/h, a trial of 5 seconds, an illustrative figure, admits about 1.6 litres. Ten resets in quick succession add about 16 litres, about 7% of the 225 litres that would make the whole chamber flammable, but concentrated where the burner is, not spread evenly. The burner management system's lockout, and a rule that repeated lockouts are reported rather than reset, protect against that.

Training matters for the same reason. Operators who know what the alarms mean, what a lockout indicates, why the purge cannot be shortened and who to call, keep the safety chain intact. The licensed gasfitter commissions and maintains it; the operators are the ones who see it every day.

## Approvals

In every Australian state and territory, gas appliances must be approved or accepted before they are used. Mass-produced appliances are certified as **Type A** appliances. Industrial and commercial appliances outside that scheme, such as TF-120, are **Type B** appliances, designed and built to AS 3814 and accepted by the state or territory technical regulator, often through an inspector or authorised person who reviews a technical submission and the appliance as installed. Energy Safe Victoria's Gas Information Sheet 54, for example, lists the information it requires for a Type B acceptance, including a valve train schematic with component certification numbers, pressures and device settings, and the electrical logic of the burner management system.

The acceptance covers the appliance as designed and commissioned: its burners, valve train, controls, flue, settings and safety logic. A change to any of them, such as new burners, a recuperator, a heat exchanger in the flue or new control software, may need the change to be assessed and the acceptance updated before the appliance is used again. Requirements and terms differ between jurisdictions, so the responsible gasfitter and the local technical regulator are the people to ask.

## The error: a change that was not "just plumbing"

This is an illustration. The heat exchanger of Chapter 7 was fitted into TF-120's flue during a shutdown by a mechanical contractor, who treated it as a plumbing job on the water side. Nobody asked the gasfitter responsible for the furnace, because no gas component had been touched.

On the first heat-up after the shutdown, the operator's carbon monoxide detector beside the furnace door began to alarm intermittently at high fire. The chamber pressure gauge, which normally read slightly positive, was reading several times higher than usual, and hot gas was puffing from the door seal. The exchanger's coil had added resistance to the flue, so at high fire the furnace could no longer discharge its flue gas through the existing damper setting without the chamber pressure rising. Combustion products were leaking into the workshop at the door.

The furnace was shut down. The gasfitter assessed the change, reset the flue damper and confirmed the chamber pressure, combustion and safety sequence at high and low fire, and the shop notified the technical regulator and had the change recorded against the appliance's acceptance. The lesson the shop wrote into its maintenance procedure was that **anything in the flue, the air supply or the burner management system is part of the gas appliance**, whatever trade fits it, and that the responsible gasfitter is consulted before, not after.

```figure
type: checklist
title: Before any change to TF-120
caption: The open item is this chapter's error. Every item here is for the responsible licensed gasfitter and the technical regulator to decide; the shop's job is to ask.
- x Burners, valve train and burner management system | gasfitter, and the acceptance updated where required
- x Combustion air supply and room ventilation | checked against the installation's design
- x Chamber pressure and flue draught confirmed after the change | at high and low fire
- x Carbon monoxide detection near the appliance | tested and recorded
- ? Changes to the flue and anything installed in it | the heat exchanger was fitted without asking
```

## Exercise: a shortened purge

A proposal to save time suggests shortening TF-120's pre-purge to one minute. Using the perfect-mixing model, with the fan at 130 m³/h and 4.5 m³ to purge, by what factor would a one-minute purge dilute any gas present, and what starting concentration would it bring down to a quarter of the lower explosive limit?

**Worked answer.** One minute of purge moves 130 ÷ 60 ≈ 2.17 m³ of air, which is 2.17 ÷ 4.5 = **0.48** volume changes. The dilution factor is exp(0.48) ≈ **1.62**. A quarter of the lower explosive limit is 1.25%, so the purge could only clear a starting concentration of about 1.25 × 1.62 ≈ **2.0%**, well below the lower limit itself. Any accumulation large enough to matter would still be there at ignition. And this is the optimistic perfect-mixing model; a real chamber does worse. Purge times are set by the standards and the appliance's acceptance and are not a production variable: the proposal should go no further.
