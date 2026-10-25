---
book: cutting-and-gouging-by-the-numbers
chapterSlug: air-carbon-arc-gouging
order: 3
title: "Air carbon arc gouging"
description: "Gouge with a carbon arc and an air jet: how electrode size, current, angle, speed and air shape the groove, how fast metal is removed, what a metre costs, carbon pickup and clean grooves."
draft: false
---

Add a jet of compressed air to the carbon arc of Chapter 2 and it becomes a quite different tool. The arc melts a thin layer of metal and the air blows it away at once, before it can spread heat into the surrounding plate or refreeze in the groove. The result is a clean, smooth, U-shaped groove, made fast, with equipment that is little more than a welding power source, a special torch and a compressed air line. Air carbon arc gouging, often called arc-air, is the workhorse of heavy repair and fabrication: back-gouging double-sided welds, removing cracked and defective welds, cutting out worn hardfacing, washing off old welds and bolts, and preparing grooves for welding.

This chapter explains how the groove is formed and how each variable shapes it, calculates the metal removal rate and the cost of a metre of groove, explains carbon pickup and why it matters, and sets out the practices that leave a groove ready to weld.

## The equipment

The torch holds a copper-coated carbon electrode in a jaw with air holes around it, so that a jet of air runs along the electrode and strikes the molten metal just behind the arc. The power source is usually a constant-current direct-current welding machine run with the electrode positive, capable of the high currents the larger electrodes need. Compressed air at a few bar, in a volume that depends on the electrode size, is supplied through the torch's lead. Larger electrodes and higher currents remove metal faster, but need bigger power sources and more air.

## Power and air supply

Arc-air gouging makes heavy demands on its supplies. A large electrode at its rated current may need more current than an ordinary welding machine can deliver for long, so gouging power sources are chosen for their current at a high duty cycle, as Arc Welding by the Numbers explains for welding sets; a machine run beyond its duty cycle overheats and cuts out in the middle of a groove. The air must be clean, dry and plentiful, at the pressure and flow the torch maker specifies, because a weak or wet air supply leaves molten metal and carbon in the groove. A single gouging torch can use a large share of a small workshop compressor's output, so the compressor, its receiver and the size of the air line are checked before gouging is planned. In the field, an engine-driven welder and a separate compressor are needed, and their fuel and noise become part of the job. The service centre ran a dedicated air line to its repair bay, with a water separator at the gouging station, after finding that moisture in the shop's general air supply was spoiling grooves on humid days.

## Shaping the groove

```figure
type: compare
title: What each variable does to an air carbon arc groove
cols: Increase it and the groove | Notes
caption: General description for teaching. The electrode maker's data give the current range, air pressure and flow for each electrode size.
- Electrode diameter | widens; can be deeper; removal rate rises | groove width is roughly the electrode diameter plus a few millimetres
- Current | deepens and removal rate rises, within the electrode's range | too low gives a sputtering arc and carbon deposits
- *Electrode angle to the work | steeper gives a deeper, narrower groove; shallower a wider, shallower one | the main control of depth for a given electrode
- Travel speed | faster gives a shallower groove | too slow gives a deep, irregular groove and carbon pickup
- Air pressure and flow | clears the groove and controls its smoothness | too little leaves slag and carbon; too much cools the arc
- Electrode extension | longer overheats the electrode and wastes it | kept short, advanced as it burns
```

The gouger controls the depth mainly with the electrode's angle and the travel speed, and the width with the choice of electrode. A steady hand holds the angle and speed constant and gives a smooth, even groove; an unsteady one gives a wavy, ridged groove that must be ground or that the welder will struggle to fill evenly. Gouging is done with the air jet behind the arc, so that the air blows the molten metal ahead and away from the gouger.

## Removal rate

The rate of metal removal is the groove's cross-section multiplied by the travel speed.

```figure
type: formula
title: Metal removal rate of an air carbon arc gouge
formula: removal rate = groove cross-section × travel speed × density
caption: This is an illustration for an 8 mm electrode at about 400 A making a groove about 11 mm wide and 6 mm deep at 400 mm/min, taking the U-shaped groove's area as about 0.8 of its width times its depth. Real rates come from the electrode maker's data and trials.
- Groove | about 11 mm wide, 6 mm deep
- Cross-section | about 0.8 × 11 × 6 ≈ 53 mm²
- Travel speed | 400 mm/min
step: volume removed ≈ 53 × 400 ≈ 21,000 mm³/min
step: mass removed ≈ 21,000 × 7.85 × 10⁻³ ≈ 166 g/min
step: about 10 kg an hour of arc time
```

Ten kilograms an hour is far faster than grinding, which on a large defect might remove a fraction of a kilogram an hour, and much faster than machining a groove with a portable mill. That speed is why arc-air gouging dominates heavy repair. Compare it with the carbon arc of Chapter 2, which on the same arc power removed perhaps 6 kg an hour while melting a wide, ragged kerf: the air jet doubles the useful work and halves the metal melted for nothing.

## Electrode consumption

The electrode burns away as it gouges, mostly at its tip, and the copper coating slows the loss along its length. At high current, an electrode of typical length may last only a minute or two of arcing, so a long gouge uses many electrodes, and stopping to change them interrupts the groove. Jointed electrodes, which screw or socket together end to end, let a gouger feed a continuous electrode for long grooves, avoiding the stub loss and the restarts.

## A metre of groove

The cost of gouging is mainly labour, as with most manual metal work.

```figure
type: bars
title: Illustrative cost of a metre of 11 by 6 mm groove by item
unit: A$ per metre, excluding GST
max: 9
caption: This is an illustration: 2.5 minutes of arc time per metre at 400 mm/min, an operator factor of 50% and a labour rate of A$95 an hour; about 1.7 electrodes per metre at A$1.50 each; about 0.75 kWh of arc energy at A$0.25 per kWh; and compressed air at about A$0.15 per metre. Grinding the groove clean afterwards is not included.
- *Labour, 5 paid minutes | 7.90
- Electrodes | 2.55
- Electrical energy | 0.19
- Compressed air | 0.15
```

At about A$10.80 a metre, labour is nearly three-quarters of the cost, and the cost of the electrodes most of the rest. Anything that raises the gouger's speed or operator factor, a steadier technique, jointed electrodes on long grooves, a positioner that puts the work at a comfortable height, or a mechanised gouging carriage on long straight grooves, cuts the cost much more than cheaper electrodes would. The grinding needed afterwards, to clean the groove for welding, is a separate cost that a smooth gouge keeps small.

## Carbon pickup

The groove's surface is left covered in a thin layer of metal that was melted and not quite all blown away, and that layer has been in contact with the hot carbon electrode. If the technique is poor, with too little air, too low a current, too slow a travel or the electrode touching the work, carbon from the electrode dissolves in the molten layer, and the groove's surface is left with a carbon-rich skin. On carbon steel, a thin, hard skin may cause cracking or porosity in the weld laid on it if it is not removed; on stainless steel, carbon pickup ruins the corrosion resistance of the surface, because the carbon combines with chromium. On hardenable steels, the rapid cooling of the gouged surface can also leave a hard layer even without carbon pickup.

The practical rule is that a gouged surface is cleaned by grinding to bright metal before welding, removing the thin layer the gouge leaves, and that on stainless steel and other sensitive materials, either the groove is ground back thoroughly or a different method, such as plasma gouging or grinding alone, is used. Weld procedures for repairs often state how much grinding is required after arc-air gouging.

## Good practice

```figure
type: checklist
title: The repair bay's practice for air carbon arc gouging
caption: This is an illustration of the service centre's practice, written from the electrode and torch makers' guidance and its repair procedures.
- x Set-up | power source electrode positive; current within the electrode's range; air on before striking
- x Electrode | short extension, advanced as it burns; jointed electrodes for long grooves
- x Technique | steady angle and speed; air jet behind the arc; groove depth checked often
- x Clean groove | smooth U-shape; no ridges, slag or carbon deposits; ground to bright metal before welding
- x Inspection | groove checked by dye penetrant or magnetic particle where a crack was removed
- x Protection | hearing protection, welding helmet, fire-resistant clothing; fume extraction
- *? Surroundings | molten metal blown well clear; flammables removed; screens for others nearby
```

## Where the metal goes

The air jet throws molten metal and slag a long way, several metres from the gouge, in a shower of sparks and droplets. Everything in that direction must be protected or removed: flammable materials, cables and hoses, painted surfaces, glass, and other workers. The repair bay directs gouging towards a steel wall or a spark curtain, and gouges in a dedicated area away from the plasma table and the stores. Chapter 10 deals with the fire, fume and noise of gouging, which are among the most severe in any metalworking process.

## Gouging and the part

Arc-air gouging puts heat into the part, less than the plain carbon arc but still a great deal on a long, deep gouge. Thin sections can distort, and on hardenable and crack-sensitive materials, such as high-carbon steel castings, alloy steels and some cast irons, the procedure may require preheat before gouging, just as it does before welding, so that the gouged surface does not harden or crack. The repair procedures of Weld Repairs That Hold cover preheat for gouging and welding together.

## Washing and cutting

Arc-air gouging can also wash off unwanted metal flush with a surface, such as old welds, lugs, bolt heads, rivet heads and hardfacing, by holding the electrode at a low angle so that it removes a broad, shallow layer. And with a steep angle and high current, it can cut through plate, though more roughly than plasma or oxy-fuel. Washing off a worn hardfacing deposit before rebuilding is one of the repair bay's commonest jobs, and Hardfacing and Surfacing by the Numbers explains why the old deposit must come off before a new one is laid when it has reached its layer limit or cracked.

## Mechanised gouging

Long, straight grooves, such as the back-gouging of the seams of heavy plate girders, tanks and pressure vessels, can be gouged by a torch mounted on a travelling carriage, at a constant speed and angle, with the electrode fed automatically as it burns. Mechanised gouging gives a groove of very even depth and width, which the welder can fill with a consistent procedure, removes the gouger from the worst of the noise and fume, and runs at a high operator factor. Some systems monitor the arc voltage to hold the groove depth constant as the plate's surface varies. For the service centre's occasional long seams in heavy plate, a mechanised gouging carriage on the same track as its welding carriage was worth hiring for each job.

## Plasma gouging as the alternative

Plasma gouging, with a gouging nozzle on a plasma torch, removes metal with a jet of plasma rather than a carbon arc and air. It removes metal more slowly than heavy arc-air gouging but is markedly quieter, produces less fume, leaves a smoother groove with little or no carbon pickup, and uses the same plasma set that cuts plate. It suits stainless steel, aluminium and work where the groove must be clean, and lighter gouging generally. The repair bay moved its stainless and aluminium gouging to plasma, and its lighter carbon steel gouging as well, keeping arc-air for heavy removal.

## Measuring the groove

Gouging to a defect means knowing when the defect is gone. A crack is followed by gouging along it and then checked with dye penetrant or magnetic particle testing on the cleaned groove, gouging deeper where the crack still shows, until the check is clear. The groove's depth and width are then measured, because they set the weld metal needed to fill it, and its ends are tapered so that the weld can start and finish cleanly. A record of the groove's size and the checks made goes into the repair record.

## The running case: the repair bay's gouging

This is an illustration. The service centre's repair bay gouged about 1.5 tonnes of metal a year with arc-air, roughly 3.6 km of groove of the size above, at the costs in this chapter about A$39,000 a year in labour, electrodes, power and air for the gouging itself, and a large share of that again in grinding the grooves clean. The manager timed the bay's gougers on a sample of jobs and found operator factors from about 35% to 60%, the lowest where the work was on the floor and the gouger had to crouch. Moving the work onto stands at a comfortable height and supplying jointed electrodes for long grooves lifted the average operator factor to about 55%, and the smoother grooves cut the grinding time noticeably.

## A failure: the stainless back-gouge

This is an illustration. A fabricator back-gouged the roots of welds in a stainless steel tank with arc-air and welded the second side without grinding the gouged grooves. The tank passed its tests. Within a year, the welds on the inside of the tank showed lines of pitting along the back-gouged roots.

The gouging had left a carbon-enriched skin along each groove, which the second-side weld had partly melted into its root. The fabricator repaired the welds, and its stainless procedures now specify plasma gouging or grinding for back-gouging, with arc-air permitted only where the groove is ground back to sound, uncontaminated metal and checked.

## Exercise: gouging out a cracked weld

A cracked fillet weld 1.8 m long must be gouged out to a groove about 14 mm wide and 8 mm deep with a 10 mm electrode at a travel speed of about 350 mm/min. Taking the groove's area as 0.8 of width times depth, estimate the metal removed and the arc time. At an operator factor of 50% and A$95 an hour, what does the gouging labour cost?

The groove's area is about 0.8 × 14 × 8 ≈ **90 mm²**, so the 1.8 m groove removes about 90 × 1,800 ≈ 162,000 mm³, about **1.27 kg** of metal.

At 350 mm/min, the arc time is 1,800 ÷ 350 ≈ **5.1 minutes**, and at a 50% operator factor about 10.3 minutes of paid time, costing about 10.3 ÷ 60 × 95 ≈ **A$16** in labour, before electrodes, grinding the groove clean, checking it with dye penetrant or magnetic particle for any remaining crack, and the weld that fills it.
