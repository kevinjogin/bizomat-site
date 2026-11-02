---
book: inertia-and-flywheels-by-the-numbers
chapterSlug: built-up-rotors-and-datasheet-units
order: 2
title: "Built-up rotors and datasheet units"
description: "How to add the parts of a built-up rotor into one inertia with its stored energy, and how to convert the inertias on motor and servo datasheets, including WR² and GD², without a factor-of-four error."
draft: false
---

Real rotors are assemblies: a shell with lagging and end plates, a disc with a hub and knives, a pulley on a shaft. Their inertia is the sum of the parts, each about the rotor's axis, and Chapter 1 showed how to find each part. This chapter puts them together, with the energy the assembly stores at speed, and then turns to the other source of inertia figures in any drive calculation: the makers' datasheets, which quote them in half a dozen units and two quite different conventions.

The chapter builds the DL-3's infeed roller with the KEVOS® composite rotor inertia tool and converts the chipper motor's and the pusher servo's datasheet inertias with the moment of inertia converter. Its mistake is a European motor datasheet's GD², taken as the moment of inertia and four times too large.

## The infeed roller as an assembly

Each of the DL-3's eight infeed rollers is a steel tube of 168.3 × 7.1 mm, 1,200 mm long, covered with 6 kg of rubber lagging to an outside diameter of 180 mm, with a chain sprocket of 200 mm pitch diameter on one end. Two steel end discs, 154 mm in diameter and 4 kg each, close the tube and carry the stub shafts.

The [composite rotor inertia tool](/tools/composite-rotor-inertia/) takes up to three bodies, each chosen from a solid cone, a cone about its base diameter, a hollow sphere, a thin spherical shell, a torus, an ellipsoid, a thin ring about a diameter and a thin-walled cylinder about its axis, with its mass, dimensions and the offset of its own axis from the rotation axis. It moves each body's inertia to the rotation axis, adds them, and returns the total mass and inertia, the radius of gyration, the kinetic energy at a stated speed, the energy released for an allowed speed drop, and the inertia needed to supply a stated energy per cycle. Its shapes are those of the more mass moments of inertia tool; it does not include a solid disc, so a solid part is added from the mass moment of inertia tool.

The roller's tube, its lagging and its sprocket rim are all thin rings about the axis, which the composite tool calls a thin-walled cylinder. The tube is entered at its mean diameter of 161.2 mm, the lagging at its mean diameter of 174.15 mm and the sprocket's rim at its pitch diameter of 200 mm. The rollers turn at 159 rpm, the speed that gives 1.5 m/s at the lagging's 180 mm diameter. No energy per cycle is required of a roller, so that input is left at zero and the energy result is read only as information.

```figure
type: steps
title: The infeed roller in the composite rotor inertia tool
caption: This is an illustration. Tube 33.871 kg at 161.2 mm, lagging 6 kg at 174.15 mm, sprocket rim 3 kg at 200 mm, all thin-walled cylinders about the axis; 159 rpm, 10% speed drop, no energy required.
- Total mass | 42.87 kg
- * Total inertia | 0.2955 kg·m²
- Radius of gyration | 83.0 mm
- Stored energy at speed | 41 J
- Energy released for a 10% drop | 7.8 J
```

The two end discs, as solid discs from the mass moment of inertia tool, add 2 × 4 × 0.154² ÷ 8 = 0.0237 kg·m², for 0.3192 kg·m² per roller. Eight rollers, all turning at the same speed and driven by one chain, have 2.554 kg·m² at the roller speed.

```figure
type: bars
title: Where an infeed roller's inertia comes from
x: Part
y: Moment of inertia, kg·m²
caption: This is an illustration. Total 0.3192 kg·m² per roller. The lagging is a seventh of the roller's mass and adds 14% of its inertia, because it sits at the largest radius.
- * Steel tube, 33.9 kg | 0.2200
- Rubber lagging, 6 kg | 0.0455
- Sprocket rim, 3 kg | 0.0300
- Two end discs, 8 kg | 0.0237
```

The chart shows Chapter 1's lesson again. The lagging, 6 kg of rubber, adds more inertia than the two 4 kg end discs together, because it is at 87 mm from the axis and they are spread between the axis and 77 mm. Relagging a roller with a thicker cover changes its inertia noticeably; changing its end plates hardly at all.

## Stored energy and the composite tool's duty check

The composite tool's last three results are for a rotor whose job is to store energy: its kinetic energy at speed, the energy it gives up if allowed to slow by a stated percentage, and the inertia it would need to give up a stated energy each cycle. For a roller, the numbers are small: 41 J at full speed, and 7.8 J released in slowing by 10%. Chapter 8 uses the same idea for the chipper, whose energies are ten thousand times larger, and introduces the coefficient of speed fluctuation that the tool's percentage drop stands for.

The speed-drop result follows from the energy formula. Slowing from ω1 to ω2 releases half J (ω1² − ω2²). A 10% drop in speed releases 1 − 0.9² = 19% of the stored energy: much more than 10%, because energy goes with the square of speed.

## Datasheet inertias and their units

Motor and servo makers quote rotor inertias in whatever units their market uses. The SI unit is the kilogram square metre. Servo makers often use kilogram square centimetres, 10,000 to the kilogram square metre, or gram square centimetres; American catalogues use pound square feet, pound square inches, ounce square inches, or the slug square foot of the gravitational system. Two older conventions survive on motor datasheets: WR², the weight times the radius of gyration squared, usually in pound square feet, which is numerically the same as the mass moment of inertia in pound square feet; and GD², the weight times the diameter of gyration squared, usually in kilogram-force square metres, which is four times the moment of inertia in kilogram square metres, because the diameter is twice the radius.

The [moment of inertia converter](/tools/inertia-converter/) converts a mass moment of inertia between kilogram square metres, gram square centimetres, kilogram square millimetres, pound square feet, pound square inches, ounce square inches, slug square feet and pound-force inch second squared, and also converts second moments of area, section moduli and momentum, each within its own kind. It uses factors exact by definition. It notes that mass moment of inertia and second moment of area are different quantities that must not be interchanged, and that a GD² in kilogram-force square metres is four times the kilogram square metre value.

```figure
type: compare
title: The DL-3's two motor inertias, as quoted and in SI
cols: As quoted | Converted | In kg·m²
rowhead: Motor
- Chipper motor, 75 kW, American datasheet | WR² 28.5 lb·ft² | × 0.04214 | 1.201
- Chipper motor, same frame, European datasheet | GD² 4.8 kgf·m² | ÷ 4 | 1.200
- * Pusher servo | 29 kg·cm² | = 2,900 kg·mm² | 0.0029
caption: This is an illustration. One pound square foot is 0.45359237 × 0.3048² = 0.042140 kg·m². A kg·cm² is 100 kg·mm², which the converter accepts. GD² is not in the converter's list; divide it by four.
```

The chipper motor's two datasheets, from two suppliers of the same frame, agree once the conventions are understood: 28.5 lb·ft² is 1.201 kg·m², and 4.8 kgf·m² of GD² is 1.200 kg·m². The servo's 29 kg·cm² is 0.0029 kg·m², which the converter handles by way of kilogram square millimetres.

### Second moment of area is not inertia

The converter's other kinds of quantity are a reminder that "moment of inertia" means two different things in engineering. The mass moment of inertia, in kilogram square metres, resists angular acceleration. The second moment of area, in millimetres to the fourth power, resists bending, and structural tables often call it the moment of inertia of a section. A beam table's "I" in mm⁴ entered as a rotor's J, or the other way round, gives nonsense, and the units are the check: a mass moment of inertia always contains a mass.

## Parts that move in a straight line

Some of what a rotor drives does not rotate at all. The infeed rollers carry boards, and the chain that drives them runs in a loop round sprockets. A mass m moving at the speed of a rotor's surface, at radius r, behaves like an extra moment of inertia m r² on that rotor's shaft, because its kinetic energy, half m v², is half m r² ω² when v = r ω.

A 4.8 m board weighing 24 kg, carried at the lagging's surface speed, adds 24 × 0.09² = 0.194 kg·m² at the roller shaft, more than half of one roller. The drive chain, about 10 kg of it moving at the sprocket's pitch radius of 100 mm, adds 10 × 0.1² = 0.100 kg·m². With a board on the infeed, the rollers' drive sees 2.554 + 0.194 + 0.100 = 2.848 kg·m², of which 10% is the board and chain.

The composite tool does not include straight-line masses, so they are added by hand, as here, or with the reflected inertia method of Chapter 4, which handles a linear mass driven through a pulley or a screw and gearing to a motor. The principle is the same in both: equal kinetic energy at the same shaft speed.

## When the CAD model does the sum

For a complex rotor, a CAD model's mass properties are usually the best source of its inertia, and many design offices take them directly. The figures are only as good as the model's materials. A cast-iron hub left at the template's default density, an aluminium cover modelled as steel, or a welded assembly whose welds were never modelled will all give an inertia that looks precise and is wrong.

Two checks catch most of these errors. The model's total mass should match the weight of the real part on a scale, or the sum of the drawing's parts list, within a few per cent. And the model's radius of gyration should be plausible for its shape: for a rotor that is mostly rim, close to the rim's mean radius; for a solid disc, about 0.71 of the outer radius. The DL-3's chipper disc, modelled by the machine builder, reported 228 kg·m² with its knives and hub, close to the 226.6 kg·m² that Chapter 1's disc, knives and hub add up to.

## Brakes, encoders and what a datasheet includes

A servo or motor datasheet's rotor inertia may or may not include a fitted brake, an encoder or a fan. Servo makers often list two figures, with and without the brake, and the difference can be a quarter of the rotor's inertia for a small servo. The DL-3's pusher servo has no brake, and its 29 kg·cm² is the figure for the motor as supplied. A motor ordered with a different option, or a brake added later, changes the inertia that every calculation in Chapters 4 to 6 depends on.

The same caution applies to gearboxes. A gearbox maker's datasheet quotes its inertia referred to the input shaft, usually in kg·cm², and that figure is added to the motor's rotor, not to the load. A gearbox inertia mistakenly treated as the load side's would be divided by the ratio squared a second time and all but vanish.

## Assembling the whole inertia list

The DL-3's inertia list, which every later chapter draws on, records each item with its shaft, its speed and its source.

```figure
type: compare
title: The DL-3 inertia list
cols: Shaft speed | Moment of inertia | Source
rowhead: Item
- Docking saw, blade to rotor | 1,480 rpm | 2.172 kg·m² | Chapter 1, datasheet rotor
- Eight infeed rollers | 159 rpm | 2.554 kg·m² | This chapter
- Chipper disc and hub | 600 rpm | 222.72 kg·m² | Chapter 1, hub 0.675 kg·m²
- Chipper motor rotor | 1,480 rpm | 1.201 kg·m² | Datasheet, converted
- * Pusher servo rotor | up to 3,000 rpm | 0.0029 kg·m² | Datasheet, converted
caption: This is an illustration. Each inertia is about its own shaft, at that shaft's speed. They cannot be added across shafts until they are reflected to a common one, which Chapter 4 explains.
```

## The mistake: GD² taken as J

The first chipper start calculation used 4.8 kg·m² for the motor's rotor, read straight from the European datasheet's GD² column. Reflected to the chipper's shaft through the belt ratio, as Chapter 7 will do, 4.8 kg·m² becomes 29.2 kg·m² instead of 7.3 kg·m², adding 22 kg·m² that does not exist to a rotor of about 230 kg·m², nearly 10% too much inertia.

The error came to light when a second engineer used the American datasheet for the same motor and got a different answer. Two sources that disagree by exactly a factor of four point straight at a radius-and-diameter convention, as in Chapter 1's mistake. The mill's rule since then is to record every datasheet inertia with its symbol and unit exactly as printed, J, WR² or GD², and to convert it in a separate, labelled step.

```figure
type: checklist
title: Before using a datasheet inertia
caption: The DL-3 review's checks. This is an illustration.
- x Symbol recorded as printed: J, WR² or GD²
- x Unit recorded as printed, including kgf where it appears
- x GD² divided by four, WR² in lb·ft² multiplied by 0.042140
- x Rotor inertia confirmed to include or exclude the brake and encoder, as the datasheet states
- x Converted value compared with a second source where one exists
- x Mass moment of inertia, not second moment of area
```

## Exercise: a conveyor head drum

**Problem.** A conveyor's head drum has a steel shell of 85 kg at a mean diameter of 390 mm, 9 kg of lagging at a mean diameter of 412 mm, and a sprocket rim of 6 kg at a pitch diameter of 300 mm. It turns at 120 rpm. Find (a) the drum's inertia and radius of gyration, (b) its stored energy and the energy released in slowing by 10%, and (c) its inertia in pound square feet for an American gearbox supplier.

**Answer.** (a) Shell: 85 × 0.195² = 3.2321 kg·m². Lagging: 9 × 0.206² = 0.3819 kg·m². Sprocket rim: 6 × 0.15² = 0.1350 kg·m². Total 3.7490 kg·m². Mass 100 kg; k = √(3.749 ÷ 100) = 193.6 mm.

(b) ω = 12.566 rad/s. Stored energy = 0.5 × 3.749 × 12.566² = 296.0 J. Released for a 10% drop = 296.0 × 0.19 = 56.2 J.

(c) 3.749 ÷ 0.042140 = 88.97 lb·ft².

**The check.** The radius of gyration, 193.6 mm, is less than the lagging's outer radius and close to the shell's mean radius, as it should be for a rotor that is mostly shell.

If the supplier's form asked for WR² instead, the same 88.97 would be entered, because WR² in pound square feet is numerically the moment of inertia in pound square feet. If it asked for GD² in kilogram-force square metres, the figure would be 4 × 3.749 = 15.00. Each convention gives a different number for the same drum, which is why the unit and symbol must always travel with the value.

A final check uses the energy result: 56.2 J released for a 10% slowdown is 19% of the 296.0 J stored, the same share as for the roller, because the share depends only on the speed ratio.
