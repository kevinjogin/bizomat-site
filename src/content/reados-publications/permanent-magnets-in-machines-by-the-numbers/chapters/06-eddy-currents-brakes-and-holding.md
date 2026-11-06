---
book: permanent-magnets-in-machines-by-the-numbers
chapterSlug: eddy-currents-brakes-and-holding
order: 6
title: "Eddy currents, brakes and holding"
description: "How moving magnets induce eddy currents and drag, eddy-current speed control on a gravity conveyor, permanent-magnet holding brakes on a vertical servo axis, and stopping energy limits."
draft: false
---

Wherever a magnetic field moves relative to a conductor, it induces currents in the conductor. Those eddy currents dissipate energy and push back against the motion that causes them. In a magnetic coupling's metal shell, as Chapter 5 showed, they are a loss. In an eddy-current brake they are the point: a magnet moving past a copper or aluminium plate is slowed smoothly, with no contact and no wear. And in a permanent-magnet holding brake, a magnet does a different job altogether, holding a servo axis still when the power is off.

This chapter explains eddy-current drag and where it is used, works an eddy-current speed controller on a gravity conveyor, and then checks the permanent-magnet holding brake on the bagger's film-reel lift with the BIZOMAT holding brake sizing tool. The error is a brake used for every stop.

## Eddy currents and drag

A conductor moving at speed v through a magnetic field B has an electric field v × B induced in it. If the conductor offers closed paths, current flows, with a density of about σvB in a material of conductivity σ, and the power dissipated per unit volume is about σv²B². That power has to come from somewhere: it comes from the motion, as a drag force that opposes it.

At low speeds the drag is proportional to speed, because the current and so the opposing force are both proportional to speed. That makes eddy-current drag behave like viscous damping, which is ideal for speed control: the faster something tries to go, the harder it is held back. At higher speeds the eddy currents' own magnetic field starts to oppose the applied field and push it out of the conductor, the skin effect of Chapter 10 in *Magnetic Workholding by the Numbers*, and the drag rises more slowly, reaches a maximum and then falls. Eddy-current brakes are designed to work below that maximum.

Two features distinguish eddy-current drag from friction. It vanishes at zero speed, so an eddy-current brake slows but cannot hold: something else must hold a stopped load. And it needs no contact, so it does not wear, though it does produce heat, all of the energy it removes, which must be carried away.

### Eddy currents as losses

The same physics makes eddy currents a loss wherever they are not wanted. Electrical steel in motors and transformers is made in thin, insulated laminations so that eddy currents cannot circulate across the stack. The rare-earth magnets in high-speed motors are sometimes segmented for the same reason, because changing fields from the stator's slots and the drive's switching induce eddy currents in the magnets themselves, heating them, which Chapter 4 showed to be the one thing a magnet least tolerates.

## An eddy-current speed controller

This is an illustration. After the bagger, Line 4's sealed cartons run down a gravity roller conveyor at a 3° slope to the palletiser. On an unbraked gravity conveyor, cartons accelerate until they collide with the queue, at speeds that damage cartons and product. Two of the rollers in each section are speed-controller rollers: each contains permanent magnets that turn with the roller inside a fixed copper sleeve, or the reverse, so that the roller's rotation drives eddy currents and is resisted in proportion to its speed.

A carton of 12 kg on the 3° slope is driven down by the component of its weight along the slope, 12 × 9.81 × sin 3° = 6.2 N, and held back by rolling resistance, taken as 2% of its weight, about 2.4 N, leaving a net 3.8 N. The speed-controller rollers' maker gives a drag of 6 N·s/m per roller at the carton's surface over the working range. With three controller rollers under a carton at once, it settles at the speed where the drag balances the net driving force.

```figure
type: steps
title: Steady speed of a carton on the braked gravity conveyor
caption: This is an illustration. Drag coefficient of the speed-controller rollers from the case's invented maker's data; rolling resistance assumed at 2% of weight.
- Weight component along the 3° slope | 12 × 9.81 × sin 3° = 6.16 N
- Rolling resistance, 2% of weight | about 2.35 N
- Net driving force | 3.81 N
- Drag from three controller rollers | 3 × 6 N·s/m × v
- * Steady speed | v = 3.81 ÷ 18 = 0.21 m/s
```

The controller rollers' drag also depends on temperature, because both the magnets' field and the copper's conductivity change as they warm: the field falls slightly and the copper's resistance rises, so a warm roller drags a little less. In a packing hall the change is small, but a conveyor in a cold store or in direct sun can run noticeably faster or slower than at commissioning, which is worth checking at the season's extremes.

The steady speed is proportional to the net force, so a heavier carton runs faster: a 20 kg carton, with a net force of 6.35 N, settles at 0.35 m/s. The plant's spacing of controller rollers was chosen so that the heaviest carton still runs within the palletiser's acceptable infeed speed. Because the drag vanishes at zero speed, cartons stop against the queue under their own weight, held by the queue, not the brake.

## Permanent-magnet holding brakes

Servo motors that drive vertical axes, or any axis that must not move when the power is off, are fitted with holding brakes. Two designs are common. A spring-applied brake uses springs to press a friction disc against a plate, and a coil, when energised, pulls the plate away against the springs to release. A permanent-magnet brake uses a magnet to pull an armature plate against a friction face, and a coil, when energised, produces a field that cancels the magnet's at the armature, so a light spring lifts it clear. Both apply when power is lost, which is what makes them fail-safe. Permanent-magnet brakes are compact, have no backlash and are common on servo motors.

Holding brakes are designed to hold a stopped axis and to stop it occasionally in an emergency, not to stop it on every cycle. Their friction surfaces and their ability to absorb heat are sized for that.

```figure
type: compare
title: Three magnetic and friction brakes in machines
cols: How it makes torque | Holds at standstill? | Wears? | Typical job
rowhead: Brake
- Eddy-current brake | drag from currents induced by motion | no | no; produces heat | speed control, retarding, damping
- * Permanent-magnet holding brake | magnet pulls armature onto friction face; coil releases | yes, with power off | yes, slowly, and rapidly if misused | holding servo axes; occasional emergency stops
- Spring-applied holding brake | springs press friction disc; coil releases | yes, with power off | yes, with adjustable air gap | holding motors and hoists; emergency stops
caption: General characteristics. A particular brake's rating, energy limits and inspection requirements come from its maker.
```

### Where the energy goes

Every brake turns kinetic or potential energy into heat. For the gravity conveyor the amounts are small. This is an illustration. A section 6 m long at 3° drops each carton by 6 × sin 3° = 0.31 m, releasing 12 × 9.81 × 0.31 = 37 J, part of it lost to rolling resistance and the rest to the controller rollers. At 20 cartons a minute that is about 12 W spread over the section's rollers, which warm imperceptibly. An eddy-current retarder on a vehicle or a large hoist handles many kilowatts and needs designed cooling; the physics is the same.

For holding brakes, energy is the limit that matters most, because their friction faces are small and they are not designed to dissipate heat continuously. The maker's per-stop and per-hour limits are not conservative suggestions: they are where the friction material begins to glaze or fade.

## The film-reel lift

This is an illustration. The bagger's film reel, up to 70 kg, sits on a 15 kg carriage raised by a ball screw with a 10 mm lead, driven by a servo motor with a permanent-magnet holding brake. The load's weight, 833.6 N, produces a torque at the motor of 833.6 × 0.010 ÷ 2π = 1.33 N·m, reduced to about 1.2 N·m by the ball screw's efficiency when the load drives it backwards. The motor runs at up to 3,000 rpm; the inertia at the motor shaft, including the screw, carriage and reel, is 0.0008 kg·m². The brake is rated at 4.5 N·m, engages 0.03 s after power is removed, and its maker allows 0.2 kJ per emergency stop and 5 kJ an hour.

The BIZOMAT [holding brake sizing tool](/tools/holding-brake-sizing/) checks a spring-applied holding brake: the kinetic energy at the motor shaft, the net decelerating torque with the load overhauling or assisting, the slip time and total stop time with the engagement delay, the stopping angle, the friction energy per stop and per hour against the brake's permissible values, the brake torque needed for a required stop time, and the holding factor on the static load torque. Its calculation is the same for a permanent-magnet brake, which also applies a torque and absorbs the energy in friction.

```figure
type: stats
title: Emergency stop of the film-reel lift while lowering, from the holding brake sizing tool
caption: This is an illustration. Overhauling load of 1.2 N·m, brake 4.5 N·m, 3,000 rpm, 0.0008 kg·m², engagement delay 0.03 s, required stop within 0.15 s, holding factor of at least 2, four emergency stops an hour.
- 0.039 kJ | kinetic energy at the motor shaft
- 3.3 N·m | net decelerating torque, brake minus overhauling load
- 0.076 s and 0.106 s | slip time and total stop time, within 0.15 s
- 3.4 revolutions | stopping angle, about 34 mm of carriage travel
- 0.054 kJ | friction energy per stop, within 0.2 kJ
- 3.75 | holding factor on the 1.2 N·m load
```

The energy per stop, 54 J, is more than the 39 J of kinetic energy, because while the load is lowering, gravity keeps doing work through the slip. The 34 mm of carriage travel during the stop matters for the guarding around the lift: anyone reaching into the reel area after a stop is initiated must not be able to reach the carriage within that travel and the time it takes.

### The brake when hot

The brake's magnet loses strength as it warms, like any magnet, and its torque follows. The brake is mounted on the motor, whose flange runs at about 80 °C in service. If the brake's torque falls with the square of its magnet's remanence, at the NdFeB coefficient of −0.11 %/°C, it would be 4.5 × (1 − 0.0011 × 60)² = 3.9 N·m at 80 °C, a holding factor of 3.3 rather than 3.75. Brake makers rate their brakes at a stated temperature; the plant checked that the rating applied at the motor's flange temperature, and it did.

## Testing a holding brake in service

A holding brake's torque can be checked without removing it. Many servo drives offer a brake test function: with the brake applied, the drive applies a set torque through the motor, typically somewhat above the load's holding torque, and checks that the shaft does not turn. Where the drive has no such function, a torque wrench on the motor shaft, with the drive disabled and the axis made safe, gives the same answer. The plant tests the reel-lift brake each month at 2.4 N·m, twice the load torque, and records the result.

A creep test, as in the error below, checks the brake under the real load: the axis is powered off with a full reel on the carriage, and the carriage's position is measured before and after a set time. Creep shows a brake that is slipping slowly, which a quick static test might miss. Both tests must be done with the area made safe, because the purpose of each is to find out whether the brake will hold.

## The error: a brake used for every stop

This is an illustration. A programmer changing the bagger's sequence to speed up reel changes made the lift's controller drop the brake at the end of every lowering move, instead of letting the servo bring the axis to rest and then applying the brake to hold it. The lift lowers about 20 times an hour in normal running, but during a reel change sequence it jogs repeatedly, and on the first day of the new program it logged about 1,200 brake applications in an hour while the operators set up a difficult reel.

Re-running the holding brake sizing tool with 1,200 stops an hour gives an energy of 64.6 kJ an hour, against the brake's permitted 5 kJ. The brake's friction faces overheated and glazed, and within a week its holding torque had fallen so far that the carriage crept down slowly when the axis was powered off. The crew noticed the creep and locked the carriage out before anything fell.

The program was corrected so that the servo stops the axis and the brake only holds it, the brake was replaced, and a creep check was added to the bagger's weekly inspection: with the axis powered off and a full reel on the carriage, the carriage must not move measurably in five minutes. The brake's energy limits are now on the drawing beside the program, where a programmer will see them.

## Exercise: a heavier reel

This is an illustration. A new film needs reels of up to 100 kg on the same 15 kg carriage.

1. What is the load torque at the motor when lowering, with the same 0.9 factor for back-driving efficiency?
2. What holding factor does the 4.5 N·m brake give at 20 °C, and at 80 °C?
3. Is the brake still adequate for holding?

**Worked answer.**

1. Weight = 115 × 9.81 = 1,128 N; torque = 1,128 × 0.010 ÷ 2π × 0.9 = **1.62 N·m**.
2. At 20 °C, 4.5 ÷ 1.62 = **2.78**; at 80 °C, 3.93 ÷ 1.62 = **2.43**.
3. **Yes, for holding**, with factors above 2. The emergency-stop energy and stopping distance must be re-run in the tool with the heavier load and larger inertia, because both grow, and the guarding checked against the new stopping travel. A heavier reel also lowers faster under gravity if the brake slips, so the creep check matters more, not less, after the change.
