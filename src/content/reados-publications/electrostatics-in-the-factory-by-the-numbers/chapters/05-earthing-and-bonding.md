---
book: electrostatics-in-the-factory-by-the-numbers
chapterSlug: earthing-and-bonding
order: 5
title: "Earthing and bonding"
description: "Why earthing conductors and people is the most effective static control, why a megohm still drains static, how to earth parts, containers and people, and how to check the earth is there."
draft: false
---

Every conductor that can be earthed should be. An earthed conductor cannot hold a charge, so it cannot spark, and it cannot be charged by induction either. Earthing is cheap, simple, quick to check and effective, which is why it is the first control in every static hazard guide. It is also, unfortunately, the control most often lost without anyone noticing at all: a clip left off, a hanger caked with cured powder, a conveyor bearing whose grease has broken the circuit, a person who took off their heel strap to walk to the store.

This chapter explains why static earthing needs far less than people assume: the currents involved are microamperes, so even a resistance of a megohm drains them harmlessly. It sets out how to earth and bond parts, containers, moving equipment and people, and how to check that each earth is present. It ends with the powder line's hangers, whose build-up of cured powder slowly turned earthed enclosures into isolated ones.

## Charging currents are tiny

Static charge is generated at a rate, a current, and an earthed conductor reaches a steady voltage where the current flowing to earth through its connection equals the charging current: V = I × R. Charging currents are small. A person walking generates well under a microampere on average; a liquid flowing through a pipe, from nanoamperes to a microampere; powder in pneumatic conveying, up to tens of microamperes; and the corona guns on PL-2, which charge the powder deliberately, deliver around 20 µA of ion and powder current to the parts being coated.

```figure
type: compare
title: Steady voltage of a conductor receiving 20 µA through different resistances to earth
cols: Steady voltage, V = I × R | Time constant with 50 pF | Verdict
rowhead: Resistance to earth
- 10 Ω, a sound metal bond | 0.0002 V | 0.5 ns | Earthed
- * 1 MΩ, a dissipative path | 20 V | 50 µs | Earthed for static purposes
- 100 MΩ | 2,000 V | 5 ms | Marginal: high enough to spark near sensitive materials
- 10,000 MΩ | 200 kV, in practice limited by sparks and corona | 0.5 s | Not earthed
caption: This is an illustration. The figures are for an enclosure on PL-2, receiving about 20 µA from the guns, with a capacitance of about 50 pF. The time constant R × C shows how quickly a charge drains once charging stops.
```

The table shows why static earthing is not electrical earthing. A protective earth for a mains fault must carry tens or hundreds of amperes, and its resistance is measured in fractions of an ohm. A static earth must carry microamperes, and even a megohm keeps the voltage of a heavily charged part to tens of volts. The guidance documents for electrostatic hazards give the limits; in practice, a metallic bond measured at a few ohms shows a sound metal-to-metal connection, and a resistance to earth of up to about a megohm is generally enough to drain static from conductors and people.

The catch is that a static earth is easily lost. Paint, powder, rust, grease, plastic washers, rubber mounts and anti-vibration pads all insulate, and a part that is "obviously" connected to a machine may sit on a film of oil or a layer of paint. Earthing must be designed and checked, never assumed, and every check recorded so that a slow deterioration shows up before a failure.

## Bonding and earthing

Bonding connects conductors to each other so that they stay at the same voltage and cannot spark between themselves; earthing connects them to earth. In practice, items are bonded to a structure that is itself earthed. A filling hose's metal end is bonded to the drum being filled, and the drum to the earthed dispensing station, before the valve opens; a portable hopper is clamped to an earthed point before powder is poured into it.

Clamps for static bonding have hardened teeth or points that bite through paint, rust and powder to bare metal, and are connected by flexible braided or covered cable that resists breaking under repeated use. Where a connection must be made every time, as with drums, an interlock that prevents filling until the clamp shows a low resistance removes the dependence on memory. Such systems monitor the bond continuously and stop the transfer if the clamp is knocked off part-way through. Permanent bonds, such as across flexible duct joints and sight glasses on a powder line's recovery ducting, are made with straps and checked at intervals.

## Moving equipment

Rotating and moving parts are a common gap. A metal roller running on bearings is often effectively insulated from its frame, because the grease film in a running bearing can have a high resistance; a roller that touches charged film or belt can then charge up and spark. Conductive brushes or spring contacts on the shaft provide a path. The same applies to conveyor trolleys and hangers, connected to the earthed track only through a hook, a wheel or a pin, each of which can become coated.

## Earthing people

People are conductors on insulating soles. They are earthed in three ways, used alone or together.

1. **Dissipative footwear on a dissipative floor.** Charge drains through the soles and floor at every step, so it never accumulates. Both must be dissipative; dissipative shoes on a sealed epoxy floor do nothing.
2. **Heel or toe grounders.** Straps worn over ordinary shoes, with a conductive tab under the heel and a contact against the skin, for people who visit a protected area.
3. **Wrist straps.** A conductive band at the wrist connected by a coiled cord to an earthed point at a workbench, used in electronics assembly (Chapter 8). The cord includes a resistor of about a megohm so that, if the wearer touches a live conductor, the current through them is limited.

For manual powder coating, the operator must be earthed through the gun itself: the gun handle is earthed, and the operator holds it with a bare hand or a glove with the palm cut away, standing on an earthed grating or a dissipative floor in dissipative footwear. An operator in insulating gloves and rubber boots becomes an isolated conductor next to a corona gun.

## Insulators cannot be earthed

Earthing works only on conductors, never on insulators. A plastic bucket, a plastic funnel, a polyethylene liner or a fibreglass panel cannot be earthed by clipping a wire to it, because the charge on its surface cannot flow to the clip. For insulating items near flammable atmospheres, the choices are to replace them with conductive or dissipative versions that can be earthed, to keep them small so that the charge they can hold is limited, or to neutralise their charge with ionisers. The powder line's plastic funnel in Chapter 3 was replaced with metal for this reason.

Bulk powder is often delivered in flexible intermediate bulk containers, the large woven bags lifted by forklift. They are made in several types for different hazards: some are plain insulating fabric, suitable only where no flammable atmosphere exists; others have conductive threads woven in that must be earthed during filling and emptying; others are made to dissipate charge safely without an earth connection. The type must suit the material and the area, and an earthable type that is not earthed is worse than useless, because its conductive threads form an isolated conductor.

## Designing earths in

Earthing is easiest when it is designed into equipment rather than added afterwards. The factory's specification for new equipment in the powder line and the assembly area requires electrical continuity between every conductive part that can be charged and the equipment's earth point, without relying on painted or powder-coated joints, hinges or bearings. Bonding points are left unpainted or fitted with toothed washers, flexible connections in ducts are bridged with straps, and a labelled test point is provided so that the bond can be measured without dismantling anything. The drawings mark every bonding strap, and acceptance includes a continuity test of each.

The same thinking applies to modifications. Replacing a metal duct section with a flexible plastic one, mounting a sensor on a rubber pad, or powder coating a hopper that used to be bare steel can each break an earth path that nobody knew was there. The factory's change procedure asks, for any change in the powder line or the assembly area, whether an earth path is affected, and requires a continuity check afterwards.

## Connecting to the installation earth

Static earth points do not need their own separate earth electrodes. They are connected to the building's electrical earthing system, which is connected to earth through the installation's main earth, so that static earths, equipment protective earths and the building's structure are all at the same potential. Making those connections, and confirming that the bonding does not interfere with the protective earthing of electrical equipment, is electrical work and is done by a licensed electrician; the factory's maintenance team checks the static continuity of the equipment side.

## Checking earths

An earth that is not checked will eventually fail unnoticed. The factory checks each kind of earth at an interval set by how easily it is lost in normal use.

```figure
type: compare
title: The factory's earth checks
cols: Method | Interval | Pass criterion
rowhead: Item
- PL-2 hangers, part to conveyor track | Megohmmeter, part contact to track | Daily, a sample of hangers; every hanger after stripping | Below 1 MΩ
- Booth, guns, hoppers, recovery ducts | Low-resistance ohmmeter across bonds | Monthly | A few ohms or less
- Drum and container bonding clamps | Clamp tester or ohmmeter | Before each use, and monthly | A few ohms or less
- * People entering the assembly area | Footwear and wrist strap tester at the door | Every entry | Within the tester's band
- Assembly area floor and benches | Resistance to earth meter | Quarterly and after cleaning changes | Within the specified range
caption: This is an illustration. It shows the factory's programme; the limits for real work come from the guidance documents and standards that apply to each area.
```

Instruments matter. A low-voltage ohmmeter suits metal bonds. Higher resistances need a megohmmeter, and its test voltage matters: hangers and booth structures can be tested at 500 V, but ESD-sensitive assemblies and dissipative materials in the assembly area need the lower voltages of resistance meters made for that purpose (Chapter 2).

## When it goes wrong: the hangers that stopped earthing

PL-2's enclosures hang on steel hooks that ride on the earthed conveyor. Every pass through the booth adds powder to the hooks, and every pass through the oven cures it into a hard, insulating coat. The hooks are meant to be stripped of their build-up regularly, but during a busy quarter the stripping was skipped.

The first symptom was a quality complaint: enclosures with thin coating in their inside corners and on their back faces, and patchy edges. The coating operators raised the gun voltage to compensate, which made it worse. Then a booth operator saw a spark between a hanging enclosure and the booth's earthed wall. A megohmmeter check of a sample of hangers, from the part contact point to the conveyor track, gave resistances from about 10⁸ to over 10¹⁰ Ω, against the factory's limit of 1 MΩ.

With 20 µA arriving from the guns, an enclosure on a hanger of 3 × 10⁹ Ω would rise towards 60 kV if nothing limited it; in practice corona from its edges and sparks to nearby earthed surfaces limited it, and it was those sparks the operator saw. The charged enclosure also repelled the arriving charged powder, which is why the film build fell, and Chapter 6 shows how much powder that wasted.

Why did the operators' first response, raising the gun voltage, make things worse? Because the problem was not too little charge on the powder but too much charge left on the part. Higher voltage put more ions and more charged powder onto enclosures that could not get rid of them, so they charged faster, repelled more powder and sparked sooner. It is a common reaction on powder lines, and it is a useful rule of thumb that a sudden fall in film build on parts that used to coat well points first to the earth path, not to the guns. The factory's line troubleshooting card now starts with the hanger resistance check for exactly this reason.

```figure
type: decision
title: Restoring the hanger earths
caption: This is an illustration. It shows the factory's actions after the incident.
- Raise gun voltage further to force powder onto the parts | Worsens back-ionisation and sparking | Not adopted
- Clip an earth lead to each enclosure | Works, but slows the line and depends on memory | Not adopted
- * Strip all hangers, set a stripping schedule by passes, and check a sample daily with a megohmmeter | Restores earths and keeps them | Adopted
- Redesign hooks with a sharp contact point and a shielded contact area | Slows build-up at the contact | Adopted for new hangers
```

The stripping schedule is now set by the number of passes each hanger has made, tracked by the conveyor control system, not by the calendar, and the daily resistance check is recorded on the line's start-up sheet. Film build and transfer efficiency returned to normal within a day of stripping, and the gun voltage went back to its original setting.

## Exercise: a portable hopper

A portable steel powder hopper with a capacitance of 80 pF stands on rubber wheels and is filled by pouring, which charges it at about 1 µA.

1. If its resistance to earth through the wheels is 10¹² Ω, what voltage would it approach, and what limits it in practice?
2. With a bonding clamp giving 10 Ω, what is its voltage?
3. If the clamp is removed after filling stops, with 1 µC on the hopper, how much energy could a spark release, and what should the procedure require?

**Answer.**

1. V = I × R = 10⁻⁶ × 10¹² = 1,000,000 V in theory. In practice corona from edges and sparks to earthed objects limit it at some tens of kilovolts, which is exactly the hazard.
2. V = 10⁻⁶ × 10 = 0.00001 V: effectively zero.
3. With a clamp attached until filling ends, the hopper has no charge to keep; the question shows what happens if it is removed early. A charge of 1 µC on 80 pF gives 12,500 V and ½ × 80 × 10⁻¹² × 12,500² = 6.25 mJ, within the range that can ignite some powders. The procedure should require the clamp to be attached before filling starts and removed only after filling has stopped and the hopper is closed, with an interlock or a check that shows the bond is made.
