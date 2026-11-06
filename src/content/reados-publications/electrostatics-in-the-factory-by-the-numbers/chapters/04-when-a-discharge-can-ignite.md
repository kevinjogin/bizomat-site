---
book: electrostatics-in-the-factory-by-the-numbers
chapterSlug: when-a-discharge-can-ignite
order: 4
title: "When a discharge can ignite"
description: "What an electrostatic discharge needs to ignite a vapour or dust: a flammable mixture, enough energy compared with the minimum ignition energy, and the discharge in the right place."
draft: false
---

Most electrostatic discharges ignite nothing, because most happen where there is nothing to ignite. An ignition needs three things at once: a flammable atmosphere, a discharge with enough energy, and the discharge occurring inside the flammable atmosphere at the moment it is flammable. Remove any one and there is no fire, however much static there is. Electrostatic hazard control is the job of making sure the three never coincide, and the numbers that guide it are concentrations, flammable limits and minimum ignition energies.

This chapter explains each of the three conditions, compares the discharges of Chapters 1 and 3 with the ignition energies of the materials the case factory handles, and checks the local exhaust at the factory's alcohol cleaning benches with the BIZOMAT extraction duct tool. It ends with a technician's fingertip spark at an alcohol dispenser, a near miss that changed how the assembly area handles solvent.

## The flammable atmosphere

A vapour or dust burns only between a lower and an upper concentration in air. Below the lower flammable limit, often called the lower explosive limit (LEL) for gases and vapours, a flame cannot spread because there is too little fuel. For dusts the equivalent is the minimum explosible concentration (MEC). Isopropyl alcohol's lower flammable limit is about 2% by volume and its flash point, the lowest liquid temperature at which it gives off enough vapour to form a flammable mixture just above the surface, about 12 °C, according to the supplier's safety data sheet. At any normal room temperature, the air immediately above an open container or a freshly wiped board can be flammable.

Those are local conditions. A general room concentration far below the limit can coexist with a flammable pocket a few centimetres across around a wet surface, and electrostatic ignition, being a small, local event, needs only that pocket. The Library's [Solvent Vapours by the Numbers](/reados/publications/solvent-vapours-by-the-numbers/) explains how such pockets form and how fast they disperse.

## Temperature changes the picture

Whether a liquid forms a flammable atmosphere depends on its temperature relative to its flash point. Isopropyl alcohol, with a flash point around 12 °C, gives a flammable layer above its surface at any comfortable room temperature, summer or winter. A solvent with a flash point of, say, 40 °C does not, at room temperature, unless it is sprayed into a mist, heated, or spread thinly on a warm surface. That is why moving a cleaning or degreasing step next to a curing oven, or using a solvent on parts still warm from welding, can turn a non-flammable situation into a flammable one without anyone changing the material.

Two other temperatures are easily confused with the flash point. The autoignition temperature is the temperature at which a mixture ignites with no spark at all, from contact with a hot surface; it is typically several hundred degrees and matters around ovens, heaters and hot machinery rather than for static. And the temperature of a spark itself is irrelevant: what matters for electrostatic ignition is the energy it releases in a small volume in a short time, which is why MIE, not temperature, is the number that is compared.

## Minimum ignition energy

The minimum ignition energy (MIE) of a flammable material is the smallest energy of a capacitor spark that ignites its most easily ignited mixture with air under standard test conditions. It is measured in a laboratory and reported in test reports and safety data. Published values for many common solvent vapours, isopropyl alcohol among them, are below 1 mJ; hydrogen's is a few hundredths of a millijoule. Dusts range much more widely, from about a millijoule for some fine, dry organic powders to more than a joule for coarse or moist ones, and a dust's MIE depends strongly on its particle size and moisture, so the value for the actual material is needed.

The factory's powder coating supplier provided a test report for the polyester powders used on PL-2. For this illustration, it gives an MIE between 10 and 30 mJ and a minimum explosible concentration of 45 g/m³.

```figure
type: compare
title: Discharge energies in the factory against ignition energies
cols: Energy | Against IPA vapour, MIE below 1 mJ | Against the coating powder, MIE 10–30 mJ
rowhead: Discharge source
- Charged technician at 2 kV | 0.3 mJ | Possible | No
- * Charged technician at 10 kV | 7.5 mJ | Yes | Below the range, small margin
- Isolated sieve at 15 kV, Chapter 3 | 3.4 mJ | Yes | No
- Isolated enclosure at 30 kV, Chapter 1 | 22.5 mJ | Yes | Within the range
- Brush discharge from charged film | up to a few mJ | Possible | Generally not
caption: This is an illustration. Discharge energies from Chapters 1 and 3; the powder's MIE is the supplier's test result for this case, and the IPA comparison uses the general statement that published values are below 1 mJ. A spark's energy is an upper bound; not all of it goes into the gas, but assessments compare stored energy with MIE as a safe simplification.
```

The comparison shows two different pictures. For alcohol vapour, almost any spark from a charged conductor or person is enough, so the only reliable control is to prevent people and conductors near the vapour from charging at all. For the coating powder, a charged person is close to, and an isolated enclosure within, the ignition range, so earthing the parts and hangers is essential, and the margins are too small to rely on for anything else.

## Where the discharge happens

The third condition is often the one that saves the day, and the one people forget when they change something. A spark at a door handle in an office ignites nothing. The same spark at the rim of the powder hopper during filling, or between a technician's finger and an alcohol dispenser, is in the right place. Hazardous area classification, set out in AS/NZS 60079.10.1 for gases and vapours and AS/NZS 60079.10.2 for combustible dusts, maps where flammable atmospheres can be present and how often, as zones. Inside those zones, ignition sources, including electrostatic ones, must be controlled to a standard that suits the zone. IEC TS 60079-32-1 gives detailed guidance on electrostatic hazards. Safe Work Australia's model Code of Practice on managing risks of hazardous chemicals in the workplace sets out the duty to control ignition sources.

## The case: the powder booth and the cleaning benches

In PL-2's booth, the two automatic guns spray about 250 g of powder a minute each, and about 35% does not deposit on the first pass. The booth's extraction draws 3.0 m³/s through the booth to the cartridge filters. The overspray's average concentration in the extracted air is 2 × 250 × 0.35 ÷ (3.0 × 60) = 0.97 g/m³, about 2% of the powder's 45 g/m³ MEC. Close to the gun nozzles the concentration is far higher, and the booth's design, its extraction rate, the earthing of everything in it and the rating of its electrical equipment follow the standards that apply to the booth, the hazardous area classification for it and the gun and booth makers' instructions.

At the assembly area's cleaning benches, technicians wipe each finished board with isopropyl alcohol. Each bench has a slot hood drawing 400 m³/h into a common 200 mm duct to a roof fan. The [extraction duct check tool](/tools/extraction-duct-check/) works out the total airflow from the hoods, the duct velocity against a transport velocity, the duct's friction and fittings loss and the fan pressure needed against what the fan provides.

```figure
type: steps
title: The cleaning bench extraction
caption: This is an illustration. Results from the extraction duct check tool with 4 hoods at 400 m³/h, a 200 mm duct 18 m long, roughness 0.15 mm, fittings coefficient 2.5, hood entry loss 120 Pa and a fan giving 900 Pa at this flow. The alcohol figures assume 5 mL per board and 60 boards an hour across the benches.
- Total airflow | 1,600 m³/h
- Duct velocity | 14.1 m/s
- Fan pressure needed | 637 Pa, against 900 Pa available
- Alcohol evaporated | about 0.24 kg/h, about 0.094 m³/h of vapour
- * Average concentration in the extracted air | about 59 ppm, about 0.3% of the lower flammable limit
```

The average is reassuringly low, and it is the wrong number to rely on for static. Within a few centimetres of a freshly wiped board, and above an open dispensing container, the vapour is far richer, and that is where a technician's hand moves. Extraction keeps the room safe and the technicians' exposure low; it does not make the space around the wet board non-flammable, and no realistic airflow could.

## The order of controls

Because ignition needs all three conditions, there are three places to break the chain, and they are not equally reliable. The factory's assessment works through them in order.

1. **Remove or reduce the flammable atmosphere.** Use a less volatile or non-flammable fluid where it will do the job; keep containers closed; capture vapour and dust at source; keep quantities small. This is the most reliable control, because without fuel nothing else matters at all.
2. **Reduce charge generation.** Lower flow speeds in hoses and pipes, avoid plastic chutes and funnels for powders, choose materials that charge less, and avoid operations that separate insulating surfaces quickly near flammable atmospheres.
3. **Prevent charge from accumulating.** Earth and bond every conductor, earth people through footwear and floors or wrist straps, use dissipative rather than insulating materials, humidify where it helps, and use ionisers on insulating surfaces that cannot be avoided. Chapter 5 deals with earthing and Chapter 7 with ionisers.
4. **Limit the energy of any discharge that remains.** Keep insulating surfaces small, thin layers off conductors in powder handling, and conductors small where they cannot be earthed. This is the least reliable control and is used only alongside the others.

The cleaning bench changes after the near miss follow this order: less alcohol in the open and closed dispensers first, then bonded dispensers and earthed people. The powder line's earthed metal funnel removes both a charge generator and an isolated conductor.

## Hybrid mixtures

A dust cloud that also contains a flammable vapour, even well below the vapour's own lower limit, can be much easier to ignite than the dust alone. Such hybrid mixtures occur when powders are wetted with solvents, when solvent-cleaned equipment is used for powder before it has dried, or when a powder is handled in a room where solvent is evaporating. The MIE of the mixture can approach that of the vapour. In the factory, the rule that hoppers and guns are cleaned with dry methods, compressed air under extraction and vacuum cleaners rated for the dust, and never wiped with solvent and refilled while damp, comes from this.

## What the assessment records

The factory's electrostatic assessment is a written record for each area where flammable atmospheres can occur: the flammable materials with their flash points, flammable limits and MIEs and the source of each value; the operations that generate charge; the conductors and people that could become charged and how each is earthed; the insulating materials present; the zones from the hazardous area classification; the controls in place and how each is checked; and the residual risk. Values come from the supplier's safety data sheets and test reports, kept on file with the assessment, not from general tables, because a powder's MIE depends on its particle size and moisture and a solvent blend's flash point on its composition. The assessment is reviewed whenever a material, a process or a piece of equipment changes, and after any near miss.

## When it goes wrong: a spark at the dispenser

A technician reaching to refill a wipe from a pump-top alcohol dispenser on the cleaning bench felt a shock and saw a small spark jump from their fingertip to the dispenser's metal pump. Nothing ignited. The technician reported it as a near miss the same afternoon, and the supervisor stopped alcohol cleaning on that bench until the cause was understood.

The investigation found three things lined up. The technician had removed their heel grounder earlier to walk to the store and had not refitted it, and had then crossed the vinyl corridor floor outside the protected area in rubber-soled shoes. The dispenser's metal pump top sat on a plastic bottle and was not connected to anything. And the bottle's lid had been left open between uses, so the space above it held vapour. A charged person, an isolated conductor and a flammable atmosphere were all present; only the timing, the spark landing a little away from the richest vapour, had prevented ignition.

```figure
type: checklist
title: Changes at the cleaning benches after the near miss
caption: This is an illustration. It shows the factory's actions.
- x Footwear tester at the assembly area entrance, used every time anyone enters
- x Self-closing safety dispensers with metal bodies bonded to the earthed bench
- x Only the alcohol needed for the shift kept at the benches, in closed containers
- x Wiping done inside the hood's capture zone
- x Near miss shared at the next toolbox meeting
- ? Review whether a less volatile cleaning fluid would do the job
```

The near miss was valuable because it was reported, and because the person who reported it was thanked rather than blamed. The factory now treats every reported static shock in a solvent or powder area as a near miss to be investigated, since each one shows that charge is building up where it should not.

## Exercise: a drum of solvent

A 200 L steel drum of a solvent with a published MIE of 0.2 mJ stands on a plastic pallet while it is filled from a hose. The drum has a capacitance of 100 pF.

1. To what voltage must the drum charge before a spark from it could exceed the solvent's MIE?
2. Pouring charges the drum by 2 µC. What voltage and energy result?
3. What is the right control?

**Answer.**

1. W = ½CV², so V = √(2W ÷ C) = √(2 × 0.0002 ÷ 100 × 10⁻¹²) = 2,000 V. Any charge above 2 kV gives a spark energetic enough.
2. V = 2 × 10⁻⁶ ÷ 100 × 10⁻¹² = 20,000 V and W = ½ × 100 × 10⁻¹² × 20,000² = 20 mJ, a hundred times the MIE.
3. Bond the drum to the dispensing system and earth it before filling starts, with a clamp that bites through paint, and check the connection, so that it never charges. Chapter 5 explains how low the resistance must be, and why it is far easier to meet than people expect.
