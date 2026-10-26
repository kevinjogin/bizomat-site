---
book: steam-systems-by-the-numbers
chapterSlug: pipes-drainage-and-water-hammer
order: 5
title: "Pipes, drainage and water hammer"
description: "Size steam pipes by velocity from the steam's specific volume, lay mains to fall and drain, allow for the warm-up condensate load, and prevent the water hammer that slugs of condensate cause."
draft: false
---

Steam pipework has two jobs that pull in different directions. It must carry the steam at a velocity high enough to keep pipes reasonably small, but not so high that the steam is noisy, loses too much pressure and erodes fittings. And it must get rid of the water that inevitably forms inside it, from heat lost through the insulation and above all from warming up a cold main, before that water collects into slugs that the steam then fires along the pipe like a battering ram. Pipe sizing is a matter of velocity and specific volume; drainage is a matter of falls, pockets and traps; and water hammer is what happens when the second is neglected.

This chapter sizes SV-8's pipework by velocity, at both pressures, explains why the low-pressure pipes are larger, lays out the main's falls and drain points, calculates the condensate formed during warm-up, and explains water hammer, its causes and its prevention. The failure case is a kettle branch that began to bang at start-up after a pipe support was removed.

## Sizing by velocity

The volume of steam flowing each second is its mass flow times its specific volume, from the steam table. Dividing by the pipe's bore area gives the velocity. Designers keep steam velocities within limits that balance pipe cost against noise, pressure drop and erosion; this book uses **25 m/s** as a teaching limit for saturated steam, a value within commonly used ranges. A real design uses the designer's or the pipe maker's guidance and checks the pressure drop as well.

```figure
type: formula
title: Steam velocity in SV-8's main at full boiler output
formula: velocity = mass flow × specific volume ÷ bore area
caption: This is an illustration at 1,000 kg/h of steam at 800 kPa absolute, where the published specific volume is 0.240 m³/kg. Bores are illustrative for medium-weight steel pipe.
- Volume flow | 1,000 ÷ 3,600 × 0.240 ≈ 0.0667 m³/s
- DN50, bore about 52.5 mm | area about 0.00216 m²
- DN65, bore about 68.9 mm | area about 0.00373 m²
step: DN50: velocity ≈ 0.0667 ÷ 0.00216 ≈ 30.8 m/s, too fast
step: DN65: velocity ≈ 0.0667 ÷ 0.00373 ≈ 17.9 m/s, chosen
```

SV-8's 60 m main is **DN65**, 76.1 mm outside diameter, carrying the boiler's full output at about **18 m/s**, within the teaching limit with room for growth.

## Low-pressure pipes are larger

After the reducing station, the steam's specific volume nearly doubles, to **0.462 m³/kg** at 400 kPa absolute. The same mass flow needs nearly twice the area for the same velocity.

```figure
type: compare
title: Velocities in SV-8's pipework by size
cols: Flow and pressure | Pipe | Velocity
caption: This is an illustration with published specific volumes and illustrative bores. The low-pressure header carries less steam than the main but needs a larger pipe.
- Main | 1,000 kg/h at 800 kPa | DN65 | about 17.9 m/s
- Low-pressure header, option | 675 kg/h at 400 kPa | DN65 | about 23.2 m/s, close to the limit
- *Low-pressure header, chosen | 675 kg/h at 400 kPa | DN80 | about 16.9 m/s
- Kettle branch, option | 169 kg/h at 400 kPa | DN25 | about 37.3 m/s, too fast
- *Kettle branch, chosen | 169 kg/h at 400 kPa | DN32 | about 22.4 m/s
```

The low-pressure header to the four kettles carries only about **675 kg/h**, two thirds of the main's capacity, yet it is a size larger, **DN80**, because the steam is at half the pressure. Each kettle branch is **DN32**. A pipe that is too small on the low-pressure side shows itself as a supply pressure that sags at the far kettles when all four are heating, which defeats the purpose of reducing the pressure carefully at the station.

## Pressure drop and velocity

Velocity is a proxy for pressure drop, which is what actually matters to the process: steam loses pressure to friction as it flows, and the loss rises roughly with the square of the velocity. On SV-8's short runs, keeping velocities near or below the teaching limit keeps the pressure drop small. On long mains, the pressure drop is calculated, because a main that is fine on velocity can still lose enough pressure over a long run to starve its far end. The method for friction in pipes, using the fluid's density and velocity, is the same as for water, set out in the [Pipe flow, pressure drop and pumps](/reados/collections/fluids-hvac-and-building-services/pipe-flow-pressure-drop-and-pumps/) chapter.

## Laying mains to fall and drain

Condensate forms all along a steam main, from heat lost through its insulation: about **4.5 kg/h** in SV-8's insulated main at full temperature, as Chapter 4 calculated. Steam flowing at 18 m/s carries water droplets with it, but water on the bottom of the pipe must be collected and removed, or it accumulates.

The main is therefore laid with a steady **fall in the direction of steam flow**, so that condensate runs along the bottom with the steam towards collection points. At intervals along the main, at every low point, before every rise and at the end of the main, a **drain pocket** is formed: a short, full-bore tee pointing down from the bottom of the main, with a trap taken off its side above the bottom so that dirt settles in the pocket rather than reaching the trap. A small pipe tapped into the bottom of the main would not work; condensate travelling at steam velocity shoots straight past it. SV-8's main has drain pockets with traps at its start after the boiler, at its midpoint and at its end before the reducing station.

## Branches from the top

Steam for each branch is taken from the **top** of the main, never the bottom or the side. Condensate runs along the bottom of the main; a branch taken from the bottom would collect it and deliver wet steam, or slugs of water, to the equipment. A branch taken from the top draws the driest steam in the pipe. Each of SV-8's kettle branches leaves the low-pressure header from its top, rises a short distance and then falls towards the kettle, with a drain pocket and trap just before the kettle's control valve so that any condensate formed in the branch is removed before it reaches the valve.

## Air in steam pipes

A cold main is full of air. As steam enters, it pushes the air ahead of it towards the far end, where it must escape, or it collects and blankets the end of the main and the equipment beyond it, as it did in the kettle jacket in Chapter 3. Automatic air vents at the ends of mains, and at the high points of long branches, let air out during warm-up and close when steam reaches them. Trap types that also pass air, which Chapter 6 describes, help too. Air left in steam lines lowers the temperature at the same pressure and dissolves in condensate, where it contributes to corrosion of condensate pipes.

## Steam pipes grow

A steam main heats from room temperature to the steam's temperature every time the plant starts. SV-8's 60 m steel main, warming by about **150 °C**, grows by about **12 × 10⁻⁶ × 60,000 × 150 ≈ 108 mm**. That growth must be absorbed by bends, loops or expansion joints between anchors, exactly as *Thermal Expansion by the Numbers* describes for hot water pipes, and the drain pockets, branches and supports must all allow for the main sliding past them. A drain pocket's trap, piped rigidly to a fixed condensate line, can be torn off as the main grows; its connection needs flexibility too, usually a short loop or bend in the small trap piping.

## Redundant pipework

Factories change, and steam pipework is often left behind: a branch to equipment that has gone, a main extended to a building no longer used. Redundant pipework still at steam pressure loses heat, forms condensate, needs working traps and can harbour water hammer, all for no purpose. SV-8's survey when the kettles were installed found a 12 m branch, still live and partly uninsulated, to a cooker removed years earlier. It was isolated and cut back to the main, with a blank flange and its own drain, and its removal saved more each year than the survey cost. A walk along every steam line, asking what each branch now feeds, is worth doing whenever a plant changes.

## The warm-up load

The condensate formed while a main is hot and running is modest. The condensate formed while it warms up from cold is much larger, because the steel itself must be heated.

SV-8's main weighs about **6.4 kg** of steel per metre, about **386 kg** over 60 m. Heating it from 20 °C to 170.4 °C, with steel's specific heat taken as about **0.5 kJ/kg·K**, a typical value, takes about **386 × 0.5 × 150.4 ≈ 29,000 kJ**. That heat comes from condensing steam at 2,047 kJ/kg, about **14.2 kg** of condensate, on top of the heat lost through the insulation. If the main is brought up to temperature over **15 minutes**, condensate forms at about **57 kg/h** during warm-up, more than twelve times the running rate of 4.5 kg/h.

```figure
type: bars
title: Condensate formed in SV-8's 60 m main
unit: kg/h
max: 65
caption: This is an illustration. During a 15-minute warm-up, heating the steel produces condensate many times faster than the insulated main's running loss. Drain traps must be sized for the warm-up, not just for running.
- Running, insulated | 4.5
- *Warm-up over 15 minutes | 57
```

The traps on the main's drain pockets are therefore sized for the warm-up load, with a margin, and the boiler's operating procedure brings steam into a cold main slowly, opening the main's steam valve a little at first so the steel warms gradually and the traps can keep up.

## Water hammer

When condensate collects in a steam pipe, two things can happen, both called water hammer.

**Slugs driven by steam.** Water lying in a sag, an undrained low point or a pipe laid against its fall builds up until the flowing steam picks it up as a solid slug and drives it along the pipe at close to steam velocity. When the slug meets a bend, a valve or a closed end, its momentum is stopped almost instantly, with a bang that can be heard across a factory and a force that can crack fittings, burst valve bodies and break pipe supports.

**Collapsing steam pockets.** Where steam meets cold condensate, such as in a flooded line or a pipe being warmed too fast, a pocket of steam can condense suddenly, and the surrounding water rushes in to fill the space and meets itself with a violent shock.

Both are prevented by the same practices: mains laid to a steady fall and supported so they cannot sag; drain pockets and traps at every low point and at sufficient intervals; traps that work and are sized for warm-up loads; and slow warm-up of cold pipework. Water hammer is not just noise, and it should never be accepted as normal. It is a sign that a steam system is being damaged, and a hazard to anyone near the pipework when a fitting finally fails.

## A failure case: the banging branch

This is an illustration. After a contractor altered the cable tray above the kettles, one kettle's DN32 branch began to bang loudly every morning when the kettles were started. The noise came from the branch's isolating valve, close to the kettle, and the valve's flange began to weep after a few weeks.

The maintenance engineer walked the branch with a level and found a sag of about 20 mm between two supports, where the contractor had removed a pipe support to fit the cable tray and not replaced it. Overnight, condensate from the cooling branch collected in the sag. At start-up, the first rush of steam picked up the pool and drove it into the closed control valve at the kettle.

The detection came from the noise, located by walking the line, and the sag was confirmed with a level. The correction was to replace the missing support, restoring the branch's fall towards a drain point, add a drain pocket and trap just before the kettle's control valve, and replace the weeping valve's gasket and check the valve body. The site's change procedure now requires any work near steam pipework to be checked by the maintenance engineer before supports are touched.

## How this applies to a small Australian business

Size steam pipes by velocity, from the mass flow and the steam table's specific volume, within the limits your designer or supplier uses, and check pressure drop on long runs. Expect low-pressure pipes to be larger than the high-pressure main. Lay mains to fall in the direction of flow, with full-bore drain pockets and traps at low points, before rises and at the ends. Size drain traps for the warm-up load and warm cold mains slowly. Treat water hammer as damage in progress, find the undrained water causing it, and never remove a support from steam pipework without checking what it held.

## Exercise: a fifth kettle

The business adds a fifth 100 kW kettle on the low-pressure header. What is the header's new steam flow? What velocity does that give in the DN80 header, and does it stay within the 25 m/s teaching limit?

**Worked answer.** Five kettles need about **5 × 169 ≈ 844 kg/h**. The volume flow at 400 kPa is **844 ÷ 3,600 × 0.462 ≈ 0.108 m³/s**. In the DN80 header, with a bore area of about **π ÷ 4 × 0.0809² ≈ 0.00514 m²**, the velocity is about **0.108 ÷ 0.00514 ≈ 21.1 m/s**, still within 25 m/s. The main carrying it at 800 kPa, now about 844 kg/h plus losses, remains well within its limit too, though the boiler's margin over the kettles' combined peak shrinks, which is a question for Chapter 2's sizing.
