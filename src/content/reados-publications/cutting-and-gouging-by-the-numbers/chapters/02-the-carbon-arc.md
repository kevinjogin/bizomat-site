---
book: cutting-and-gouging-by-the-numbers
chapterSlug: the-carbon-arc
order: 2
title: "Melting metal away: the carbon arc"
description: "See how the carbon arc cut steel by melting it and letting it run, calculate how little of its energy did useful work, compare its speed with oxygen cutting, and trace its heirs in modern gouging."
draft: false
---

The simplest way to cut metal with electricity is to melt it. Strike an arc between a carbon rod and the work, hold it until the metal under it melts and runs away, move on, and repeat. That was the carbon arc cutting of the early twentieth century, and it was crude, slow and messy, but it needed nothing more than an arc welding set and a carbon electrode, and it would cut anything that conducts, including cast iron and metals that defeated the oxygen torch. Hamilton and Oberg's book of 1918 described it as the first and most important use of the carbon arc.

This chapter explains how the carbon arc cut, calculates how much of its energy did useful work, compares its speed with oxygen cutting, describes its limitations, and follows its descendants: air carbon arc gouging, the subject of the next chapter, and the special electrodes used for cutting and gouging with ordinary welding sets.

## How it cut

A carbon or graphite electrode, often 10 to 25 mm in diameter, was connected to a direct-current welding supply, and an arc was drawn between it and the work. Hamilton and Oberg gave the currents as ranging from about 200 to 1,000 amps for carbon arc work, with arc voltages of about 35 to 50 volts, far more power than a metallic electrode arc of the time, which seldom exceeded about 200 amps. The arc's intense heat melted the metal beneath it, and gravity carried the molten metal away; the operator held the arc at one point until the metal ran, advanced it a little, and so worked a path through the plate. They noted that cutting was done downward, so that the molten metal could flow away from the work.

The cut was slightly wider than the electrode, and wider in thick sections than in thin, because the arc had to be held down at the floor of the cut to melt through it. The edges were rough, because the molten metal did not run away evenly and the arc tended to jump from point to point. Hamilton and Oberg advised that where smooth edges were needed and much cutting was to be done, the oxy-acetylene torch was better, and that some makers of welding equipment did not recommend the carbon arc for cutting structural steel at all.

## Where it was used

```figure
type: compare
title: Uses of carbon arc cutting described in 1918, and modern equivalents
cols: Why the carbon arc suited it | Modern method
caption: Historical uses from Hamilton and Oberg's account, for teaching. The modern methods are the usual choices today.
- Cutting scrap to handling sizes | crude cuts were acceptable; no gas needed | oxy-fuel, plasma, shears, thermic lance for heavy scrap
- Cutting risers and fins from castings | cast iron and alloy castings resisted oxygen cutting | air carbon arc, plasma, abrasive wheels
- *Preparing broken parts for repair | an arc welding set was already on hand | air carbon arc gouging, plasma gouging, grinding
- Cutting where only a welding set was available | no oxygen supply needed | plasma with a compressor; gouging electrodes
```

Its great advantages were that it needed only electricity, which a welding shop already had, and that it would cut cast iron, alloy steels and non-ferrous metals that the oxygen torch could not, because it melted the metal rather than burning it. That made it the natural tool for the foundry, where castings needed their risers removed and their defects cut out, and for the repair shop preparing a broken casting for welding.

## How much of the energy did useful work

Melting steel takes a definite amount of heat: to raise it from room temperature to its melting point and then to melt it, roughly 1.3 MJ per kilogram, which for steel at 7.85 g/cm³ is about 10 joules for every cubic millimetre.

```figure
type: formula
title: Metal a carbon arc could melt away
formula: metal removed per second = (arc power × share doing useful work) ÷ heat to melt each mm³
caption: This is an illustration for a carbon arc at 500 A and 45 V, with the heat to melt steel taken as about 10.2 J/mm³. The share of the arc's power that melts metal which then runs away is assumed; much of the heat goes into the electrode, the surrounding plate, radiation and molten metal that does not leave the cut.
- Arc power | 500 × 45 = 22,500 W
- Heat to melt steel | about 10.2 J/mm³
- Assumed useful share | 10%
step: metal melted and removed ≈ 22,500 × 0.10 ÷ 10.2 ≈ 220 mm³/s
step: about 1.7 g/s, or about 6 kg/h
step: in 12 mm plate with a kerf about 12 mm wide, that is about 220 ÷ 144 ≈ 1.5 mm/s, about 90 mm/min
```

The calculation shows why the carbon arc was slow. Of the arc's 22 kilowatts, only a small share ended up melting metal that left the cut; the rest heated the electrode, which glowed and burned away, the plate around the cut, which got very hot, and the air and surroundings by radiation. And the molten metal had to run away by gravity alone, so much of it stayed in the cut, refroze, and had to be melted again.

```figure
type: bars
title: Illustrative carbon arc cutting speed in 12 mm plate by useful share of arc power
unit: mm per minute, at 22.5 kW and a 12 mm wide kerf
max: 600
caption: This is an illustration from the formula above, compared with a typical oxy-fuel speed on the same plate. The oxygen torch's speed comes from the iron burning in the jet, which supplies much of the heat, and the jet blowing the molten oxide out.
- Carbon arc, 5% useful | 46
- *Carbon arc, 10% useful | 92
- Carbon arc, 20% useful | 184
- Oxy-fuel, for comparison | 550
```

Even at an optimistic share of useful power, the carbon arc cut far more slowly than the oxygen torch, which explains Hamilton and Oberg's advice. The torch had two advantages the arc lacked: the iron burning in the oxygen jet released its own heat, so most of the energy came from the cut itself, and the jet blew the molten oxide out of the kerf mechanically, rather than waiting for gravity. Oxy-Fuel by the Numbers explains oxygen cutting in detail.

## Kerf and waste

The carbon arc's wide kerf meant much more metal was melted than the cut needed. A 12 mm wide kerf in 12 mm plate melts 144 mm³ of steel for every millimetre of cut, four times as much as a 3 mm plasma kerf and six times as much as a 2 mm oxy-fuel kerf. Every extra cubic millimetre melted is energy and time spent for nothing. That waste, together with the reliance on gravity, made the plain carbon arc a tool for rough work only.

## Polarity and carbon

Hamilton and Oberg explained that for carbon arc welding the work was made positive and the carbon negative, so that more of the arc's heat went into the work and particles of carbon were not carried into the weld. In cutting, carbon from the eroding electrode could enter the molten metal left on the cut faces, raising their carbon content, and on steel that layer could harden. The same effect, carbon pickup, is important in air carbon arc gouging, as Chapter 3 explains.

## Electrodes for cutting with a welding set

The carbon arc's practical heir for shops with only a welding set is the special cutting and gouging electrode: covered electrodes, used in an ordinary electrode holder on a standard welding power source, whose thick coatings produce a forceful arc and a gas stream that blows the molten metal out of the cut. They cut and gouge steel, stainless steel, cast iron and non-ferrous metals without any compressed air or gas supply, and are used for small amounts of gouging and piercing in the field, for cutting out defects before repair, and where nothing else is available. They are slower and rougher than air carbon arc or plasma, and produce heavy fume, but they keep the carbon arc's great virtue: they need nothing but a welding set.

## The air jet

The carbon arc's weakness, relying on gravity to remove the metal, was overcome by adding a jet of compressed air along the electrode, which blew the molten metal out of the groove as fast as the arc melted it. That was air carbon arc cutting and gouging, developed in the mid-twentieth century and still one of the most widely used metal removal methods in heavy fabrication and repair. With the molten metal blown away at once, the arc melts only a thin layer at a time, much less metal is wasted, and far more of the arc's energy does useful work. Chapter 3 is devoted to it.

## Cast iron and the carbon arc

Cast iron cannot be cut by oxygen, because its carbon and silicon interfere with the burning of the iron and its oxide does not flow. The carbon arc, which simply melted it, was for a long time one of the few ways to cut cast iron apart, other than sawing or breaking it. Today cast iron is cut by plasma, by air carbon arc, by abrasive wheels and waterjets, or by the oxygen lance for very heavy scrap. Hamilton and Oberg noted that the carbon arc was also used to repair cast iron, with a filler rod, and that castings with blowholes and cracks could be cut out and filled at small cost.

## Safety of the carbon arc

The carbon arc, at hundreds of amps, produced intense light and ultraviolet radiation, which Hamilton and Oberg warned required careful protection of the operator's hands, face and eyes. It also threw molten metal, produced heavy fume and gases, and heated the work and the electrode to temperatures that could start fires. Every one of those hazards is present, and usually greater, in air carbon arc gouging, which Chapter 10 discusses together with the hazards of the other methods.

## Heat in the surrounding plate

Because the carbon arc spent so long melting each part of the cut, and spread its heat widely, the plate around the cut became very hot, which brought its own problems. A wide heat-affected zone formed along the cut edges, hardening them on hardenable steels and coarsening the grain on others. Thin plate distorted. Castings with uneven sections could crack from the local heating, which is why foundries cutting risers from alloy castings sometimes preheated them. Faster methods put less heat into the surrounding metal for each millimetre of cut, simply because they are there for less time, and the air jet that turned the carbon arc into arc-air gouging reduced the heat in the work considerably.

## Electrode consumption

The carbon electrode burned away as it worked, in the arc and by oxidation of its hot length in the air. A large carbon could lose several millimetres of length a minute, and had to be advanced in its holder and replaced. Graphite electrodes, which conduct better and oxidise more slowly, lasted longer than plain carbon. Modern air carbon arc electrodes are copper-coated, which carries the current to near the tip and protects the electrode's length from oxidation, so that they burn away mainly at the tip and last much longer than the bare carbons of the early manuals.

## What the carbon arc teaches

The carbon arc is rarely used for cutting today, but it is a clear lesson in how cutting processes work. Any thermal cut must supply the heat to melt or burn the metal in the kerf, remove the melted metal from the kerf, and do both before the heat spreads into the surrounding plate. The carbon arc did the first wastefully, the second only by gravity, and the third poorly. The oxygen torch supplies much of its own heat from the burning iron and blows the slag out; the plasma arc concentrates its energy and blows the metal out at high velocity; the laser concentrates its energy into a spot a fraction of a millimetre across and uses a gas jet to clear the kerf. Every improvement on the carbon arc is an improvement in one or more of those three things.

## The running case: cutting electrodes on site

This is an illustration. The service centre's repair crews carry a box of gouging electrodes in each site welding kit, for the jobs where carrying a compressor is impractical: cutting out a short cracked weld on a dragline bucket at the top of a ladder, or piercing a hole to drain a cavity before welding. The crew lead's records show that such electrodes remove metal at well under half the rate of the bay's air carbon arc gouging, and leave a rougher groove that must be ground, but for a job of a few minutes they save bringing a compressor and hoses up a mine's haul road.

## A failure: the rough repair cut

This is an illustration. A fitter elsewhere, without a gouging set, cut a cracked casting apart for repair with a large carbon electrode on a welding set, as the old manuals described. The cut was slow, ragged and wide, and the cut faces were left rough, with refrozen metal and a hard, carbon-rich layer. The welder who prepared them for welding spent longer grinding the faces clean than the cut had taken, and the first weld passes cracked where the hard layer had not been fully removed.

Air carbon arc gouging, or plasma, would have made a narrow, clean groove in a fraction of the time, though the carbon-rich layer would still have needed grinding, as Chapter 3 explains. The fitter's shop bought a gouging torch the following week.

## Exercise: the energy of a cut

A carbon arc at 400 A and 40 V cuts 10 mm plate with a kerf about 11 mm wide. Taking the heat to melt steel as about 10.2 J/mm³ and a useful share of 8% of the arc's power, estimate the cutting speed. How does that compare with a plasma cut at about 3,000 mm/min with a 2.5 mm kerf in the same plate, and what does it suggest about where each method's energy goes?

The arc's power is 400 × 40 = 16,000 W, and 8% is about 1,280 W, which melts about 1,280 ÷ 10.2 ≈ **125 mm³/s**. Each millimetre of cut needs 11 × 10 = 110 mm³, so the speed is about 125 ÷ 110 ≈ 1.1 mm/s, about **68 mm/min**.

The plasma cut, at 3,000 mm/min with a 2.5 mm kerf, removes about 3,000 ÷ 60 × 2.5 × 10 ≈ **1,250 mm³/s**, ten times the carbon arc's rate, through a kerf less than a quarter as wide. The plasma's constricted, high-velocity arc puts its energy into a narrow column and blows the molten metal out at once, while the carbon arc spreads its heat widely and waits for gravity, as Chapter 5 explains.
