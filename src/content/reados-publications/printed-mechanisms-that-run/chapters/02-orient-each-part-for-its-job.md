---
book: printed-mechanisms-that-run
chapterSlug: orient-each-part-for-its-job
order: 2
title: "Orient each part for its job"
description: "Choose each part's print orientation from its loads and critical features, design out supports, and confirm the weak direction with simple coupon tests."
draft: false
---

A printed part is not one material. It is a stack of thin layers, each made of extruded lines, bonded to the layer below while it was still warm. Within a layer, the lines are continuous and strong. Between layers, the bond is only as good as the temperature and pressure at the moment of printing allowed. The result is a part whose strength, accuracy and surface finish all depend on which way it was facing on the build plate.

Orientation is therefore a design decision, not a slicer setting to choose at the last minute. This chapter shows how to decide it for each part of the indexing table, from the loads it carries and the features that must be accurate, and how to test the assumptions with a few cheap coupons.

## Know the weak direction

The build direction, usually called Z, runs upwards through the layers. The other two directions, X and Y, lie in the plane of each layer. For material extrusion, the general pattern is well established: parts are strongest when loads run along the extruded lines in the XY plane and weakest when loads try to pull layers apart in Z. The size of the difference depends on material, temperature, cooling, layer height, line width and the printer, which is why this book measures it rather than quoting a number.

```figure
type: svg
title: The same bracket printed two ways
alt: Two L-shaped brackets with a load pulling on the tip of the arm. On the left the bracket lies flat, so the layer lines run along the arm and the load bends the lines. On the right the bracket stands upright, so the layer lines run across the arm and the load pulls the layers apart at the inside corner, marked as the crack site.
caption: Orientation decides whether a bending load is carried along the extruded lines or across the bonds between layers.
viewbox: 0 0 640 280
body:
<text class="txb" x="40" y="30">Printed flat: load along the lines</text>
<path class="bx" d="M60 230H280V200H100V80H60Z"/>
<path class="lf" d="M64 222H276 M64 214H276 M64 206H276 M64 190H96 M64 170H96 M64 150H96 M64 130H96 M64 110H96 M64 90H96"/>
<path class="la" d="M280 215V260"/>
<path class="ah" d="M274 252L280 264L286 252Z"/>
<text class="tx txs" x="60" y="262">stronger</text>
<text class="txb" x="360" y="30">Printed upright: load across the bonds</text>
<path class="bx" d="M380 230H600V200H420V80H380Z"/>
<path class="lf" d="M384 222H596 M384 214H596 M384 206H596 M384 192H416 M384 176H416 M384 160H416 M384 144H416 M384 128H416 M384 112H416 M384 96H416"/>
<path class="la" d="M398 80V40"/>
<path class="ah" d="M392 48L398 36L404 48Z"/>
<circle class="fa pulse" cx="420" cy="200" r="7"/>
<text class="txa" x="432" y="190">crack site</text>
<text class="tx txs" x="380" y="262">weaker: layers peel apart</text>
```

Two consequences follow. First, a part should be oriented so that its main loads run in the XY plane wherever possible. Second, where a load must cross layers, the design should give it more material, a larger radius at the corner, or a different load path.

## Know which features print accurately

Orientation also decides accuracy. Each direction has its own typical errors.

```figure
type: compare
title: How feature accuracy depends on orientation
cols: Printed this way | Typical behaviour
caption: Typical behaviour on a calibrated desktop printer. Measure your own; Chapter 3 shows how.
- Round holes | Axis vertical, in XY | Round, usually slightly undersize
- Round holes | Axis horizontal | Top of the hole sags; often oval unless shaped
- Heights | Along Z | Quantised to whole layers: 0.2 mm steps at a 0.2 mm layer height
- Bottom face | On the plate | First layers squashed outwards; edges flare slightly
- *Flat faces | In XY, on the plate | Flattest surface the printer can make
```

Heights are a frequent surprise. At a 0.2 mm layer height, a feature designed 7.1 mm tall must print as 35 layers, 7.0 mm, or 36 layers, 7.2 mm, because 7.1 divided by 0.2 is 35.5. The slicer chooses one, and it may not choose the one the designer expected. Design critical heights as whole multiples of the layer height, or make sure the design works at either rounding.

Horizontal holes sag because the top of the hole is printed over thin air. Each layer near the top overhangs the one below more steeply, until the last few layers bridge across. A teardrop-shaped hole, with a pointed top at 45°, or a flattened top that bridges cleanly, prints much better than a true circle. If the hole must be round, as for a shaft, orient the part so the hole's axis is vertical.

## Decide orientation part by part

This is an illustration. The table's main printed parts were oriented by asking three questions for each: where are the loads, which features must be accurate, and which faces must be smooth or flat?

```figure
type: compare
title: Orientation decisions for the indexing table
cols: Orientation | Reason
caption: This is an illustration. Where load and accuracy pointed different ways, the part was split or the feature redesigned.
- Planetary gears | Flat, teeth in XY | Teeth bend in the layer plane; bores vertical and round
- Ring gear | Flat | Internal teeth in XY; mounting face on the plate is flat
- Geneva wheel | Flat | Slots in XY, so pin loads act along the lines
- Geneva crank | Flat, pin bore vertical | Stall load on the pin boss acts in XY
- Dial | Flat, top face up | Station pockets crisp; underside flat on the plate
- *Frame side plates | Flat, bearing bores vertical | Bores round for the press fit; plate loads in XY
- Motor mount | On its back, motor bore vertical | Motor face square to the bore
```

Most parts of a mechanism like this are naturally flat, and printing them flat satisfies all three questions at once. The interesting cases are the parts where the questions conflict.

## Resolve conflicts by splitting or redesigning

This is an illustration. The first design of the frame had a single U-shaped part holding both bearings of the Geneva driver shaft, one in each upright arm. Printed flat on its base, the bearing bores would have been horizontal and therefore oval. Printed on its side to make the bores vertical, the arms would have been loaded across their layers when the bearings pushed outwards.

The solution was to split the U into three parts: a base plate and two side plates, each printed flat with its bearing bore vertical. The side plates fasten to the base with two M3 screws each and are located by printed dowel bosses that fit into matching holes. Splitting added four screws but gave round bores, strong arms and simpler prints, and it meant that a damaged side plate could be reprinted on its own.

Splitting is a powerful tool, but each joint adds parts, assembly time and a tolerance. Split when orientation genuinely conflicts, and design each joint with a positive location, such as a dowel, a tongue or a stepped face, rather than relying on screws alone to align the pieces.

## Design out supports

Supports are temporary structures that hold up overhangs while they print. They cost material and time, leave marks on the surface they touch, and must be removed, sometimes with difficulty from inside a mechanism. A part designed so it needs no supports is cheaper, cleaner and more repeatable.

```figure
type: decision
title: Dealing with an overhang
question: Can the overhang be avoided or made self-supporting?
caption: Supports are the last resort, not the default. Each option above them removes a removal step and a surface blemish.
- Reorient the part | the overhang becomes a vertical wall or rests on the plate | no support needed
- Change the angle | overhang raised to about 45° or steeper, or a fillet replaced by a chamfer | usually self-supporting
- Bridge it | a short, flat span between two supports, with a flat-topped hole | usually prints cleanly
- *Split the part | each piece prints flat; joined with screws and dowels | no support needed
- Accept supports | where nothing else works | plan access for removal; keep them off critical faces
```

A few rules of thumb help. Overhangs steeper than about 45° from horizontal usually print without support on a well-tuned machine; shallower ones droop. Bottom edges are better chamfered than filleted, because a fillet's lower part is a near-horizontal overhang. Short bridges, a few millimetres, print well; long ones sag. Each printer and material differs, so treat these as starting points and confirm them with a test print.

## Use walls, not infill, for strength

Slicers build each part from walls, also called perimeters, around the outside, solid layers at the top and bottom, and a sparse infill pattern inside. For small mechanical parts, most of the strength comes from the walls. Increasing the number of walls usually adds more strength than increasing the infill percentage.

This is an illustration. The table's parts use three walls of 0.45 mm line width, giving a solid skin of **3 × 0.45 = 1.35 mm**, with 25% infill elsewhere. The gear teeth are a special case. At module 1, the tooth thickness at the pitch circle is about **π × 1 ÷ 2 ≈ 1.57 mm**, a little more than the three-wall skin, so the teeth print as nearly solid walls. Chapter 5 shows why that matters for tooth strength.

Holes for screws and inserts need walls too. A heat-set insert needs solid material around it to melt into; a boss with only one wall around the hole may split. Setting four or five walls on parts with many inserts, or locally increasing walls with a modifier in the slicer, is often enough.

## Allow for the first layer

The first layer is printed pressed hard against the build plate, so it adheres. That pressure squashes the extruded lines outwards, and the bottom few layers of a part often end up slightly wider than the layers above. The effect, often called elephant's foot, is small, typically a few tenths of a millimetre, but it matters in a mechanism. A bearing bore that starts on the plate is tighter at its bottom edge, a gear's bottom face can carry a lip that rubs its neighbour, and a part that must slide into a slot jams on its flared base.

Two design habits deal with it. A small chamfer on every bottom edge that matters, about 0.4 mm by 45° in this case, gives the squashed material somewhere to go without enlarging the part's footprint. And bores that start on the plate get a matching chamfer at their entry, which also helps bearings and shafts start straight. The chamfers cost nothing to model and make the parts insensitive to small changes in first-layer settings between printers.

## Choose layer height and line width deliberately

Layer height and line width affect strength, accuracy and print time together. Thinner layers give finer steps on curved and sloping surfaces and slightly better accuracy in Z, at the cost of more layers and a longer print. Wider lines, relative to the nozzle, generally bond better side by side and print faster, but blur fine details such as small gear teeth.

This is an illustration. The table uses a 0.4 mm nozzle with 0.45 mm lines throughout. Most parts print at 0.2 mm layers. The gears print at 0.12 mm layers: their teeth are in the XY plane, so layer height does not change the tooth shape, but thinner layers give a smoother face width and better bonding at the small tooth roots. That choice adds about 40% to the gears' print time, which the scope's 30-hour budget can absorb because the gears are small.

Whatever settings are chosen, they belong with the part, in the same record as its orientation. A gear reprinted at 0.3 mm layers with a different line width may be a different gear in every way that matters, even though its file has not changed.

## Pack plates without changing orientation

Fitting several parts on one build plate saves time, and it is tempting to stand a part on end to make room. The Geneva crank failure later in this chapter came from exactly that. Pack plates by grouping parts that share an orientation and material, and split the job across more plates if they do not fit. A longer print queue is cheaper than a failed part and a repeated test.

## Test the weak direction with coupons

Rules of thumb are useful, but the actual strength difference between orientations on your printer, with your material and settings, is worth measuring. A coupon test takes an afternoon and gives numbers that guide every later decision.

This is an illustration. The designer printed ten small rectangular bars, 60 mm by 10 mm by 4 mm, in PETG with the gear settings: five lying flat and five standing upright. Each was loaded at its centre over a 40 mm span with a simple lever rig and a luggage scale until it broke.

```figure
type: bars
title: Coupon break loads by orientation, PETG, three-point bend
unit: N
max: 200
caption: This is an illustration. Averages of five bars each. The upright bars broke cleanly between layers; the flat bars bent before breaking.
- *Printed flat, load across the lines | 182
- Printed upright, load pulling layers apart | 74
```

The flat bars averaged 182 N and the upright bars 74 N, a ratio of about **182 ÷ 74 ≈ 2.5**. The way they broke was as informative as the numbers. The upright bars snapped cleanly along a layer line with almost no bending; the flat bars bent visibly first. A part that must survive a jam or a drop is much better off failing by bending than by snapping.

These coupons are not a material test to any standard, and the rig is crude. Their value is comparative: same material, same printer, same settings, two orientations. Keep the results with the design files and repeat the test when the material or printer changes.

## Detect an orientation failure

This is an illustration. The first Geneva crank was printed upright, standing on its hub, because that was quicker to fit on a crowded plate. The steel drive pin's boss then had its layers stacked along the pin axis. During the first stall test, at about 67.5 N on the pin, the boss cracked cleanly between two layers and the pin tilted in the crank.

The fracture surface, flat and glossy along one layer, identified the cause at once. The crank was reprinted flat, with the pin bore vertical and the stall load acting in the layer plane. It survived ten repeated stall tests without visible damage. The plate-packing convenience had cost a part and a test day; the orientation table above now lists the crank explicitly so the mistake cannot recur.

## Record orientation with the part

Orientation is as much part of the design as the geometry. Record it with each part, in the file name, in a note in the CAD model, or in the print project file, so that anyone reprinting the part uses the orientation it was designed for. A part reprinted the wrong way up looks identical on the shelf and fails differently in use.

The most reliable record is the one that travels with the file. Many slicers save a project file that holds each part's orientation, material and settings together; sharing that project rather than bare model files removes most of the guesswork for the next person. Where only model files can be shared, export each part already oriented as it should print, with its intended bottom face at the origin, and state the layer height and wall count in the file name or an accompanying table. Chapter 9 gathers these records into the build guide's print schedule.

## Exercise: orient a new part

The table gains a small lever that lifts a station clamp. It is an L shape, 50 mm by 30 mm, 6 mm thick, with an 8 mm pivot hole at the corner and a 4 mm pin hole at the end of the long arm. A spring pulls on the pin hole, bending the long arm about the pivot. How should it be printed, and why?

**Worked answer.** Print it **flat**, with the 6 mm thickness in Z. The spring's force bends the long arm in the plane of the L, which is then the XY plane, so the bending stresses run along the extruded lines, the strong direction. Both holes have vertical axes, so they print round, which matters for the pivot.

Printing it on its edge would put the bending stress across the layers, at the inside corner of the L, which is exactly where the coupon tests show the part is weakest. If the inside corner still looks highly stressed, add a fillet there in the flat orientation: in XY, a fillet prints perfectly and spreads the stress.
