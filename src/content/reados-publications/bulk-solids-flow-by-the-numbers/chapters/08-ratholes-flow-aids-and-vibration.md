---
book: bulk-solids-flow-by-the-numbers
chapterSlug: ratholes-flow-aids-and-vibration
order: 8
title: "Ratholes, flow aids and vibration"
description: "How a cohesive powder leaves a stable hole in a funnel-flow bin, what vibrators, air pads, air cannons and agitators can and cannot fix, and how a vibrator run at the wrong time makes a bin worse."
draft: false
---

When a cohesive powder discharges in funnel flow, the flow channel can empty and leave a vertical hole with walls of stagnant powder standing around it. That is a rathole. The bin appears to have stopped feeding although it is mostly full, and if the walls of the hole collapse later, they can fall as a mass of aerated powder that floods the feeder or shock-loads the hopper. Ratholes were B2's main problem, and the plant's first response, a vibrator, made them worse before it made anything better.

This chapter explains when a rathole stands, describes the common flow aids and what each one does to a powder, and sets out the rules that stop a flow aid from becoming a cause of blockages, cracked welds and damaged hoppers.

## When a rathole stands

A rathole is a vertical tube of powder with no support on its inside face. It stands if the powder around it is strong enough to carry the stresses that its own weight produces around the hole. Jenike's analysis of that stress state gives a **critical rathole diameter**:

D_f = G(φ′) × σ_c(σ₁) ÷ (ρ_b g)

where G is a factor depending on the powder's internal friction, read from Jenike's charts, and σ_c is the unconfined strength of the stagnant powder at the consolidation stress it is under. Above the critical diameter, a rathole cannot stand and its walls collapse into the flow channel. Below it, a rathole can stand.

Two features make ratholes worse than arches. First, the stagnant powder around a rathole is consolidated by the full depth of material above it, not by the small stresses near an outlet, so its strength is higher. Second, the stagnant powder sits still for as long as the bin is not emptied, so time consolidation acts fully. Critical rathole diameters are therefore usually much larger than critical arching widths, often by a factor of several.

The laboratory's report on B2's filler gave a critical rathole diameter of about **1.4 m** for the powder as consolidated in flow and about **2.1 m** after 24 hours at rest, at the stresses in the lower part of B2. This is an illustration. B2 is 1.6 m in diameter. When freshly filled and running, a rathole in B2 is marginal and tends to collapse; after a night's rest, a rathole is comfortably stable. That matched the plant's experience: B2 usually ran for a while after a fresh bag, then stopped, and was worst after a weekend.

```figure
type: compare
title: B2's filler: arches against ratholes
rowhead: Measure
cols: Flowing, instantaneous | After 24 hours at rest | B2 as built
caption: This is an illustration. Arching values from Chapter 7 for a cone; rathole values from the laboratory report. A bin in funnel flow must exceed the critical rathole diameter to avoid ratholes; a bin in mass flow avoids them by keeping all the powder moving.
- Critical arching width, cone | 0.242 m | 0.374 m | 150 mm outlet
- Critical arching width, wedge | 0.119 m | 0.181 m | not fitted
- * Critical rathole diameter | about 1.4 m | about 2.1 m | 1.6 m bin in funnel flow
```

The practical conclusion is that ratholing cannot be cured by a larger outlet in a funnel-flow bin unless the outlet, or the flow channel, is wider than the critical rathole diameter, which for many powders is larger than the bin. The reliable cure is mass flow, which keeps all the powder moving so that no stagnant wall forms. That is why B2's redesign in Chapter 7 is a mass-flow wedge hopper and not simply a bigger outlet.

## Flow aids

Flow aids are devices added to a bin to start or keep material moving. They are useful, sometimes essential, and often misused. Each works in a particular way, and each can make some problems worse.

```figure
type: compare
title: Common flow aids and what they do
rowhead: Flow aid
cols: How it works | Helps with | Can make worse
caption: General guidance only. Every flow aid must be sized, mounted and controlled according to its maker's instructions and the bin's structural design.
- Rotary or linear vibrator on the hopper wall | shakes the wall and the powder next to it | arches near the wall, wall build-up, mass flow on a marginal wall | compaction if run with the outlet closed; fatigue cracks
- Aeration pads or nozzles | inject air to lower friction and strength at the wall | fine powders that de-aerate and pack | flooding; coarse materials, which air passes straight through
- Air cannon | releases a burst of stored air into the material | build-up on walls and in chutes | ratholes in the body of the bin; noise; stored energy hazard
- Bin activator | a vibrating cone at the outlet that shears the powder above it | arching at the outlet, converting a flat bin's outlet region | compaction if run without discharge
- Mechanical agitator or sweep arm | stirs or sweeps material towards the outlet | stagnant material in flat-bottomed bins | high loads, wear, entrapment hazard
```

Vibration deserves particular care because its effect on a powder depends on whether the powder can move. Vibration lowers friction and strength in a powder that is flowing, which is why it can help a marginal hopper wall or break an arch. Applied to a powder that cannot flow out, it does the opposite. Chapter 2 showed how tapping compacts a powder, and the experiments of Knight and colleagues on vibrated granular columns showed compaction continuing for thousands of taps. A vibrator running on a full bin with its outlet shut is a very effective tapping machine.

## The forces involved

A rotary electric vibrator spins an eccentric mass. Its peak force is F = m e ω², where m e is the eccentric moment and ω the angular speed. A vibrator with an eccentric moment of 0.02 kg·m (20 kg·mm) running at 3,000 rpm, ω = 314.2 rad/s, produces a peak force of 0.02 × 314.2² = **1,974 N**, about 2 kN, twice per revolution in each direction. At 1,500 rpm the same eccentric moment gives a quarter as much, 493 N.

For comparison, the filler in B2's cone weighs about 0.931 m³ × 820 kg/m³ = 763 kg, a weight of 7.49 kN. A 2 kN vibrator applies a reversing force about a quarter of that weight to the cone wall 50 times a second. The bin shell itself, 274 kg of stainless plate, would be accelerated at roughly 0.7 g if it took the whole force, which is why vibrators are mounted on stiffened pads and why their mounts crack if the pad, welds or bolts are not designed for fatigue. Makers publish sizing guidance for their vibrators based on the material in the hopper section and the wall thickness, and that guidance, not a general rule, should be used.

## The error: a vibrator that ran all the time

This is an illustration. Before the redesign, the plant tried to cure B2 by fitting a 2 kN rotary vibrator to the cone, wired to a switch on the bin's local panel. The operators were told to switch it on when the feeder stalled. Within a week, many had found it easier to leave it on.

The results took a month to become clear.

1. **Blockages became more frequent, not less.** The vibrator ran during the screw feeder's off periods, when the extruder's refill hopper was full and the screw was stopped, which was about 60% of the time. With nowhere to go, the filler in the cone compacted. The bin's new load cells showed it: the volume from the level sensor fell more slowly than the mass from the load cells, meaning the density was rising, from about 760 to about 880 kg/m³ on average over a shift.
2. **The screw feeder's motor current rose.** Compacted, de-aerated powder is harder to shear. The screw drew about 20% more current after an hour of vibration with the screw stopped than after a fresh fill.
3. **A crack appeared.** At the monthly inspection the fitter found a crack about 40 mm long in the fillet weld at one corner of the vibrator's mounting pad, starting at the toe of the weld on the cone. The pad had been welded straight onto the 3 mm cone wall without a stiffening ring.

```figure
type: decision
title: When should B2's vibrator run?
question: Is the screw feeder running and drawing material?
caption: This is an illustration. The interlock the plant fitted: vibration only while material can leave, in short pulses, and never on a full bin with the outlet closed.
- Feeder running, flow normal | no vibration needed | vibrator off
- *Feeder running, flow falling or stopped | the load cells show mass not falling at the expected rate | vibrator pulsed 5 s on, 25 s off, up to 2 minutes, then alarm
- Feeder stopped | material cannot leave | vibrator locked out
- Bin being filled from a bag | material arriving, none leaving | vibrator locked out
```

The fixes were straightforward. The vibrator was rewired through the control system so that it can only run while the screw is running, and then only in short pulses triggered when the load cells show the mass not falling as it should. The cracked pad was cut out, the cone repaired, and a new pad fitted on a stiffening ring with full-penetration welds, designed for fatigue. The operators' switch was removed. Blockages fell to about one a shift, and the mallet marks stopped multiplying, until the new wedge hopper made the vibrator unnecessary.

## Air cannons store energy

An air cannon is a small pressure vessel with a fast-opening valve, and the energy it releases is what makes it work and what makes it hazardous during maintenance. The [compressed gas stored energy tool](/tools/compressed-gas-stored-energy/) calculates the energy in an ideal gas compressed in a rigid vessel: the isothermal expansion work, the useful work after pushing back the atmosphere, the isentropic expansion energy and the Brode burst energy used as an upper bound in hazard assessments, together with the pressure × volume product. For a typical 50 L cannon charged to 6 bar gauge, it gives an isentropic expansion energy of **37.2 kJ**, a Brode upper bound of 75 kJ and a pressure × volume of 30 MPa·L. This is an illustration. That is roughly the kinetic energy of a one-tonne vehicle at 31 km/h (37.2 kJ = ½ × 1,000 × 8.6²), released in a fraction of a second. Cannons must be isolated, vented and locked out before anyone works on them or on the bin wall they discharge into, and as pressure vessels they fall under the plant's pressure equipment obligations.

## Mallets, dents and ledges

The mallet deserves its own warning. Striking a hopper does break arches, briefly, by sending a shock through the powder. It also dents the wall, and every dent is a small ledge on which powder stops, consolidates and helps the next arch or rathole form. B2's cone had dozens of dents by the time it was replaced. On a structural hopper, repeated impact can also crack welds and, on thin shells, start a buckle. Many plants fit a striking plate, a thick pad welded or bolted to the hopper, so that if someone does strike it, they strike the pad. A better answer is a hopper that does not need striking.

## Air and flooding

Fine powders bring one more risk when a rathole or arch collapses. The falling powder entrains air and arrives at the outlet aerated, at a bulk density far below its settled value, behaving almost like a liquid. It can rush through a screw feeder, a rotary valve's clearances or a partly closed gate. This is flooding, and it can overfill a downstream hopper, spill powder over a conveyor or, with a combustible dust, create a dust cloud. A rotary valve or screw feeder at the outlet of a fine-powder bin acts as a seal against flooding as well as a feeder, which is one reason B2 has one.

Aeration pads use the same effect deliberately, admitting a controlled flow of air to keep a fine powder near the wall partly fluidised so that it slides. They can help a mass-flow hopper that is marginal on wall friction, but they must be set with care: too much air and the powder floods, too little and it packs around the pad.

## Clearing a ratholed bin

A bin with a standing rathole is dangerous to clear. The walls of the hole can collapse without warning, and the stagnant powder above an outlet or around a hole can give way under anyone or anything placed on it. People have died after entering bins to free hung-up material and being engulfed when it collapsed. A ratholed bin is cleared from outside: by running it with flow aids under control, by air lances or cleaning equipment inserted through ports, or by specialist bin-cleaning contractors with remotely operated equipment. Entry into a bin is a confined space entry with an engulfment hazard and is covered in Chapter 11.

## Counting the cost of a bin that hangs up

Plant C's record of B2's stoppages before the redesign makes the case for fixing the bin rather than adding flow aids. This is an illustration.

```figure
type: stats
title: B2's stoppages in the month before the vibrator interlock
caption: This is an illustration. Logged by the operators; the minutes count from the feeder's low-rate alarm to the return of normal feed. The new wedge hopper was justified on the lost extrusion time alone.
- 4.2 | average stoppages per shift
- 9 min | average time to restore flow
- about 38 min | extrusion time lost per shift, at reduced rate or stopped
- 21 | dents in the cone recorded at the next inspection
- 1 | fatigue crack at the vibrator mounting pad
```

At about 38 minutes a shift, over two shifts a day, the plant was losing more than an hour of extrusion every working day, most of it at reduced filler content and therefore off-specification. The vibrator interlock cut that by about three-quarters; the wedge hopper removed the cause.

## How this applies to a small Australian business

Before buying a flow aid, find out why the bin does not flow: an arch at the outlet, a rathole in funnel flow, build-up on a rough wall, or a powder that has caked in storage. Each needs a different answer, and the wrong one can make things worse. If a flow aid is fitted, interlock it so that it cannot run when material cannot leave, mount it on a properly designed pad, and inspect the mounting regularly. If a bin is being struck, fit a striking plate and treat the striking as a sign that the bin needs fixing.

## Exercise: vibrator force and speed

A plant has a rotary vibrator with an eccentric moment of 12 kg·mm and can run it at 1,500 or 3,000 rpm. (a) What is the peak force at each speed? (b) Which speed applies more force, and why might the lower-force option still be the better choice for a thin-walled hopper?

**Worked answer.** (a) At 3,000 rpm, ω = 2π × 3,000 ÷ 60 = 314.2 rad/s, so F = 0.012 × 314.2² = **1,184 N**. At 1,500 rpm, ω = 157.1 rad/s, so F = 0.012 × 157.1² = **296 N**, a quarter as much. (b) The higher speed applies four times the force, because force rises with the square of speed. The lower force may be enough to break an arch at the outlet while putting far less fatigue load on the hopper wall and the vibrator's mounting. The choice belongs to the vibrator maker's sizing guidance, but force alone is not the measure of a better vibrator.
