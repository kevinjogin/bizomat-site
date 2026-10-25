---
book: printed-mechanisms-that-run
chapterSlug: carry-shafts-in-real-bearings
order: 4
title: "Carry shafts in real bearings"
description: "Support rotating parts on bought shafts and ball bearings, space and align the bearings correctly, transmit torque into printed hubs and locate everything axially."
draft: false
---

Rotation is where printed mechanisms most often disappoint. A printed axle in a printed hole works for a few minutes, then wears, loosens and starts to squeak. A printed shaft bends under load and creeps when left loaded. The usual cure is simple and cheap: let printed parts do what they are good at, holding things in place, and let bought steel shafts and ball bearings do the turning.

This chapter covers how to do that well. It sizes the bearing loads on the indexing table's Geneva driver shaft, shows why bearing spacing matters more than bearing size here, explains how to get torque from a steel shaft into a printed hub, and deals with the axial location that keeps every part where it belongs.

## Prefer bought rotation

A printed plastic hole running on a shaft is a plain bearing. Plain bearings can work very well, but they depend on the right material pair, a good surface finish, lubrication and a load and speed within the material's limits. Printed layers give a rough, ridged bore, common filaments are not formulated as bearing materials, and the heat of sliding friction can soften PLA. The result is often wear and growing play.

A ball bearing removes most of those problems. The rolling elements carry the load with very low friction, the precision is built into the bearing, and the printed part only has to hold the outer ring still. The 608 used throughout the table is one of the most common bearing sizes in the world, made in very large numbers, with an 8 mm bore, a 22 mm outside diameter and a 7 mm width. Shielded or sealed versions keep dust out and grease in, which suits a teaching model that lives in a classroom.

```figure
type: compare
title: Printed pin in a printed hole, and a steel shaft in ball bearings
cols: Printed pin in printed hole | Steel shaft in 608 bearings
caption: For anything that turns continuously, the bought option costs a few dollars and removes the main sources of wear, play and creep.
- Friction | Moderate, rises with wear and heat | Very low and steady
- Wear | Ridged bore wears into an oval | Negligible at these loads
- Stiffness of the shaft | Low, and creeps under sustained load | High
- Precision | Depends on the print | Built into the bearing and shaft
- *Typical use | Occasional pivots at light load | Anything that turns continuously
```

Printed pivots still have a place. A lever that moves a few times a minute through a small angle, such as a station clamp, runs happily on a steel pin in a printed hole with the running fit from Chapter 3. The rule is about continuous rotation and sustained load.

## Know the loads on each bearing

The bearings in this mechanism are very lightly loaded compared with their ratings, but working out the loads still matters, because it shows how the printed housings around them are stressed.

This is an illustration. The Geneva driver shaft is supported by two 608 bearings, one in each frame side plate, 30 mm apart. The crank with its steel drive pin is overhung 12 mm beyond the nearer bearing. Chapter 1 estimated the pin force as 22.5 N at rated torque and 67.5 N at stall.

```figure
type: svg
title: The Geneva driver shaft with an overhung crank
alt: A horizontal shaft supported by two bearings 30 millimetres apart. A pin force of 67.5 newtons acts downwards on the crank 12 millimetres beyond the near bearing. The near bearing reacts 94.5 newtons upwards and the far bearing 27 newtons downwards.
caption: This is an illustration of the stall case. An overhung load makes the near bearing carry more than the load itself, and the far bearing push the same way as the load.
viewbox: 0 0 640 260
body:
<path class="cl" d="M40 130H600"/>
<rect class="bx" x="90" y="118" width="460" height="24" rx="4"/>
<rect class="bxi" x="140" y="96" width="34" height="68" rx="3"/>
<rect class="bxi" x="420" y="96" width="34" height="68" rx="3"/>
<rect class="bxa" x="500" y="104" width="22" height="52" rx="3"/>
<path class="la" d="M511 40V96"/>
<path class="ah" d="M504 88L511 102L518 88Z"/>
<text class="txa" x="470" y="32">pin force 67.5 N</text>
<path class="la" d="M437 220V168"/>
<path class="ah" d="M430 176L437 162L444 176Z"/>
<text class="txb" x="380" y="240">near bearing 94.5 N</text>
<path class="la" d="M157 40V92"/>
<path class="ah" d="M150 84L157 98L164 84Z"/>
<text class="txb" x="100" y="32">far bearing 27 N</text>
<path class="lf" d="M157 190H437 M157 184V196 M437 184V196 M437 205H511 M511 199V211"/>
<text class="tx txs" x="270" y="186">30 mm</text>
<text class="tx txs" x="455" y="202">12 mm</text>
```

Taking moments about the near bearing, the far bearing must react **67.5 × 12 ÷ 30 = 27 N**, acting in the same direction as the pin force and opposite to the near bearing. Vertical balance then gives the near bearing **67.5 + 27 = 94.5 N**. At rated torque, the same calculation gives 9 N and 31.5 N.

The overhang makes the near bearing carry 40% more than the pin force itself. Moving the crank closer to the near bearing, or spacing the bearings further apart, reduces both reactions. Both are design choices worth making early.

Bearing makers publish static and dynamic load ratings in their catalogues. For the 608 size, static ratings are above a kilonewton, so even the 94.5 N stall reaction is a small fraction of what the bearing can carry. The bearing is not the weak point. The printed housing that holds it, and the press fit from Chapter 3, are.

## Space the bearings for stiffness

Two bearings on a shaft do more than carry load. Together they set the shaft's direction. Every real bearing has a little internal clearance, and every printed housing gives a little under load. Together these let each end of the shaft move sideways by a small amount. How much the shaft tilts as a result depends on how far apart the bearings are.

This is an illustration. The first design of the dial shaft had both bearings stacked in a single printed hub, only 8 mm apart. Assume the combined sideways movement at each bearing, from internal clearance and housing compliance, is about 0.05 mm. The shaft could then tilt by about (0.05 + 0.05) ÷ 8 = 0.0125 radians. At the dial's rim, 70 mm from the axis, that tilt shows up as an axial wobble of about **0.0125 × 70 ≈ 0.88 mm**.

```figure
type: bars
title: Dial rim wobble against bearing spacing
unit: mm
max: 1
caption: This is an illustration, assuming 0.05 mm of sideways movement at each bearing. Spacing the same bearings further apart cut the wobble by a factor of nearly four.
- Bearings 8 mm apart | 0.88
- *Bearings 30 mm apart | 0.23
```

Moving the second bearing down into the base plate, 30 mm from the first, cut the predicted wobble to about **0.1 ÷ 30 × 70 ≈ 0.23 mm**. The measured wobble on the rebuilt table, using a dial indicator against the rim, was close to that. Wobble at the rim affects the station position requirement from Chapter 1 and makes the table look poorly made, so this was a worthwhile change that cost nothing but a longer shaft.

The general rule is **spread the bearings as far apart as the layout allows**, and keep overhung loads short.

## Use steel shafts and see why

The table's shafts are 8 mm precision ground steel rod, cut to length. It is worth seeing why a printed shaft would not do, even at these loads.

This is an illustration. Treat the overhung 12 mm of the driver shaft as a short cantilever carrying the 67.5 N stall force. Its deflection is F × a³ ÷ (3 × E × I), where I for an 8 mm round section is π × 8⁴ ÷ 64 ≈ 201 mm⁴.

```figure
type: compare
title: Deflection of a 12 mm overhang under 67.5 N
cols: Elastic modulus, assumed | Tip deflection
caption: This is an illustration using simple beam theory. The printed shaft would also creep under sustained load and is weakest across its layers, neither of which the calculation includes.
- *Steel, 8 mm | about 200,000 MPa | about 0.001 mm
- Printed PLA, 8 mm | about 3,000 MPa | about 0.065 mm
```

The steel shaft deflects about 0.001 mm; a printed PLA shaft of the same size, assuming a modulus of about 3,000 MPa, roughly typical of supplier data sheets, would deflect about 0.065 mm, some 67 times more. That calculation flatters the printed shaft, because it ignores creep under sustained load, the weakness between layers if the shaft is printed upright, and the poor roundness of a shaft printed lying down. A steel shaft costs a few dollars and removes all of those issues.

## Transmit torque into printed hubs

Torque has to get from the steel shaft into printed parts: the carrier output into the Geneva crank, and the Geneva wheel into the dial. The shaft is round, so something must stop the printed hub from simply spinning on it.

Common methods, roughly in order of strength:

1. **A flat on the shaft and a D-shaped bore.** A short flat ground or filed on the shaft engages a matching flat in the printed bore. Simple and positive, and easy to print because the bore is vertical in XY.
2. **A grub screw onto the flat.** An M3 grub screw, threaded into a heat-set insert in the hub, presses on the shaft's flat. It adds axial location as well as torque capacity.
3. **A cross pin.** A small steel pin through a hole drilled across the shaft and hub. Very positive, but drilling a hardened rod accurately is difficult without the right tools.
4. **Adhesive.** Suitable only for parts that never need to come apart again, which rules it out for a model that students reassemble.

This is an illustration. The table uses a D-flat bore with a grub screw in a heat-set insert for both the crank and the dial hub. The hub is 12 mm long, so the flat bears over a useful length. After ten stall tests, the hubs were inspected for any sign that the flat had begun to round out the printed bore. None was visible, and the grub screws had not loosened. A threadlocker suitable for use with plastics would be a sensible addition if they had; some threadlockers attack certain plastics, so check compatibility before using one.

## Locate everything axially

Shafts and the parts on them must stay where they belong along the axis. Each shaft needs to be located once, in both directions, and every part on it must be located relative to the shaft.

- **Shaft collars** with grub screws are the simplest bought solution. A collar either side of a bearing's inner ring holds the shaft in place.
- **Shoulders in the printed housing** stop each bearing's outer ring from moving inwards, so the press fit does not have to carry axial load.
- **Covers or caps** screwed over the bearing seat stop the outer ring moving outwards.
- **Spacers**, printed tubes slipped over the shaft between parts, set the distance between a hub and a bearing so a single collar can clamp a stack.

Printed retaining clips, such as C-shaped clips that snap into a groove, are tempting but tricky. They must flex to fit, and the print orientation that lets them flex is usually the one that makes them weak. Where axial force is real, prefer a steel collar or a steel retaining ring in a groove; where the axial force is trivial, a printed clip can locate a part that something else holds.

This is an illustration. The driver shaft carries the near bearing, the far bearing, a printed spacer between them, the crank on the overhung end and a collar on the far end. The bearings' outer rings sit against shoulders in their side plates. With the collar and the crank's grub screw tightened, the inner rings and spacer are clamped together, and the shaft cannot move either way. The axial play, checked with a feeler gauge between the collar and the far bearing before tightening, was set to zero by sliding the collar firmly against the bearing.

## Keep dirt out and grease in

Bearings in a printed mechanism live among plastic swarf, sanding dust, strings of filament and whatever else a classroom offers. Small particles inside a ball bearing quickly make it rough and noisy. The choice of bearing closure and the design of the housing both help.

Bearings are commonly sold open, shielded or sealed. Shielded bearings, often marked ZZ, have metal shields that leave a tiny gap at the inner ring; they keep out larger particles with almost no added friction. Sealed bearings, often marked 2RS, have rubber seals that touch the inner ring; they keep out fine dust and hold grease better, at the cost of slightly more friction. For a slow teaching mechanism in a dusty room, sealed bearings are the better choice, because the extra friction is negligible compared with the gears and the Geneva.

Do not add oil or grease to sealed bearings from outside, and do not let solvents, such as those used to clean printed parts, reach them; solvents can wash out the factory grease or attack the seals. Install bearings after any sanding, drilling or cleaning of the printed part, not before. A printed cover over each bearing seat, which the design needs anyway for axial location, also shields the bearing from falling debris.

## Align the two bearing housings

Two bearings in two separate printed plates must be coaxial, or the shaft binds as it turns. Printed holes in separate plates are rarely perfectly aligned after assembly.

The cure is to let the shaft align the plates. Insert the shaft through both bearings before tightening the screws that hold the side plates to the base, turn the shaft by hand to let the plates settle, then tighten the screws in a diagonal pattern while turning. Slightly oversize clearance holes for the side-plate screws give the plates room to move into line.

This is an illustration. A simple check measures the effort to turn the shaft. A 100 mm lever clamped to the shaft and pulled with a small spring scale gives the torque. A well-aligned driver shaft turned with about 0.02 N·m before the crank was fitted. A shaft whose plates had been tightened before inserting it took about 0.10 N·m and felt notchy. Loosening the plate screws, turning the shaft and retightening brought it back to 0.02 N·m.

## Exercise: move the crank

The crank's overhang beyond the near bearing could be reduced from 12 mm to 6 mm by moving the side plate outwards. What are the new bearing reactions in the stall case, with the bearings still 30 mm apart?

**Worked answer.** The far bearing reaction becomes **67.5 × 6 ÷ 30 = 13.5 N**, and the near bearing reaction becomes **67.5 + 13.5 = 81 N**. Halving the overhang cuts the far bearing's load in half and reduces the near bearing's load from 94.5 N to 81 N, about 14% less.

The shaft deflection at the pin, which varies with the cube of the overhang, falls to an eighth of its previous value, although for a steel shaft it was already negligible. The real benefit is in the printed side plate, whose housing now carries less load and less bending from the overhung moment.
