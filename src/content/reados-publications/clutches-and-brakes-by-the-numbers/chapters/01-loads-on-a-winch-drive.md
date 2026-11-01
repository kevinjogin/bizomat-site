---
book: clutches-and-brakes-by-the-numbers
chapterSlug: loads-on-a-winch-drive
order: 1
title: "Loads on a winch drive"
description: "How to turn a winch's duty into the forces, torques, speeds, inertias and energies that its clutch and brakes must handle, on the shaft where each one sits."
draft: false
---

Every clutch and brake calculation starts with the same four numbers: the torque the device must carry, the speed of the shaft it sits on, the inertia it must accelerate or stop, and the energy it must turn into heat. Get those right and the rest of this book is arithmetic. Get one wrong, usually by taking it from the wrong shaft or the wrong direction of travel, and a well-made brake can be too weak by a factor of two.

This chapter sets out those numbers for the SW-25 slipway winch. It works out the rope pull hauling up and letting down, carries it through the gear train to the drum, the clutch shaft and the motor, finds the inertia the drive sees, and estimates the energy of a haul and a lowering. It uses two WORKOS tools: the torque to accelerate a rotating load and the reflected inertia tool. Its mistake is one that appears in many brake calculations: counting a resistance that may not be there.

## The slipway and its forces

The cradle runs on rails up a slope of 1 in 12: 1 m of rise for every 12 m of horizontal run. The angle is arctan(1 ÷ 12) = 4.764°, with sin 0.08305 and cos 0.99655. A 25 t boat and cradle weighs 25,000 × 9.81 = 245,250 N.

Two forces act along the slope. Gravity pulls the load down the slope with 245,250 × 0.08305 = 20,367 N. Rolling resistance opposes whichever way the cradle moves, with 0.02 of the force pressing it onto the rails: 0.02 × 245,250 × 0.99655 = 4,888 N. Hauling up, the rope must overcome both; letting down, the rolling resistance helps hold the load back.

```figure
type: formula
title: Rope pull on a wheeled cradle on a slope
formula: F up = m g (sin θ + Crr cos θ)
formula: F down = m g (sin θ − Crr cos θ)
caption: θ is the slope angle and Crr the rolling resistance coefficient. On the SW-25, F up is the rope pull while hauling and F down the pull the rope must resist while lowering. For holding and stopping, the brake chapters take Crr as zero, for the reason given later in this chapter.
- m g | weight of boat and cradle, N
- m g sin θ | component of weight along the slope
- Crr m g cos θ | rolling resistance, always opposing motion
```

| Case | Formula | Rope pull |
|---|---|---|
| Hauling up | 245,250 × (0.08305 + 0.01993) | 25,255 N |
| Lowering, with rolling resistance | 245,250 × (0.08305 − 0.01993) | 15,479 N |
| Holding or stopping, rolling resistance ignored | 245,250 × 0.08305 | 20,367 N |

This is an illustration. The rope runs in a single part from the drum to the cradle, so the rope pull is the load on the drum.

## From the rope to each shaft

The drum is 600 mm in diameter to the rope centre, a radius of 0.3 m. Its torque is the rope pull times 0.3 m: 7,576.5 N·m hauling and 6,110.1 N·m holding with no rolling resistance. Ignoring the change in diameter as rope layers build up is acceptable here because the SW-25 spools a single layer for its 60 m slipway.

The drive train has three shafts that matter. The motor runs at 1,450 rpm. A 20:1 helical gearbox with an efficiency of 94% brings that to 72.5 rpm at its output, which is the shaft carrying the friction clutch. An open spur pinion and gear of 22.5:1 and 95% efficiency drive the drum at 3.222 rpm. The overall ratio is 450:1, and the overall efficiency is 0.94 × 0.95 = 0.893.

```figure
type: svg
title: The SW-25 drive train, from motor to rope
alt: A row of boxes joined by shafts. From the left: a motor labelled 5.5 kilowatts at 1450 rpm with a brake drawn on its end, a gearbox labelled 20 to 1, then a shaft at 72.5 rpm carrying a clutch drawn as two plates, then a small pinion meshing with a large gear labelled 22.5 to 1, which is fixed to a rope drum at 3.22 rpm. The drum carries a band brake on a rim and a disc brake on its flange. A rope leaves the drum to the right towards a cradle on a slope. A separate engine with a centrifugal clutch is drawn below the motor, connected to the gearbox input by a belt.
caption: Each device sits on a different shaft, at a different speed and torque. The motor brake sees the lowest torque and the highest speed; the drum brakes see the highest torque and the lowest speed. This is an illustration.
viewbox: 0 0 720 300
body:
<rect class="bx" x="20" y="90" width="110" height="70"/>
<rect class="fa" x="8" y="100" width="12" height="50"/>
<text class="tx txs" x="30" y="120">Motor 5.5 kW</text>
<text class="tx txs" x="30" y="140">1,450 rpm</text>
<path class="ln" d="M130 125H170"/>
<rect class="bx" x="170" y="95" width="90" height="60"/>
<text class="tx txs" x="182" y="122">Gearbox</text>
<text class="tx txs" x="190" y="142">20:1</text>
<path class="ln" d="M260 125H400"/>
<rect class="fa" x="300" y="100" width="8" height="50"/>
<rect class="fa" x="314" y="100" width="8" height="50"/>
<text class="tx txs" x="282" y="90">Clutch, 72.5 rpm</text>
<circle class="bx" cx="410" cy="125" r="14"/>
<circle class="bx" cx="470" cy="125" r="48"/>
<text class="tx txs" x="440" y="190">22.5:1</text>
<rect class="bx" x="530" y="85" width="90" height="80"/>
<text class="tx txs" x="540" y="118">Drum 600</text>
<text class="tx txs" x="540" y="138">3.22 rpm</text>
<path class="dsh" d="M528 80H624M528 170H624"/>
<text class="tx txs" x="540" y="70">band + disc brakes</text>
<path class="la" d="M620 100L700 60"/>
<text class="tx txs" x="640" y="50">rope to cradle</text>
<rect class="bx" x="20" y="210" width="110" height="60"/>
<text class="tx txs" x="30" y="236">Engine with</text>
<text class="tx txs" x="30" y="254">centrifugal clutch</text>
<path class="dsh" d="M130 240H215V155"/>
<text class="tx txs" x="150" y="230">belt</text>
```

The torque on any shaft follows from the drum torque, the ratio between that shaft and the drum, and the efficiency of the gears in between. The efficiency works in opposite directions in the two cases. Hauling, the motor drives the load and the gears lose power on the way, so the motor needs more torque than the ratio alone suggests: 7,576.5 ÷ (450 × 0.893) = 18.85 N·m. Lowering or holding, the load drives backwards through the gears and the losses help the brake, so the load torque at the motor is less than the ratio suggests: 6,110.1 ÷ 450 × 0.893 = 12.13 N·m.

```figure
type: compare
title: SW-25 torque and speed on each shaft
cols: Speed | Torque hauling | Torque holding, no rolling resistance
rowhead: Shaft
- Motor | 1,450 rpm | 18.85 N·m | 12.13 N·m
- * Clutch shaft (gearbox output) | 72.5 rpm | 354.5 N·m | 258.0 N·m
- Drum | 3.222 rpm | 7,576.5 N·m | 6,110.1 N·m
caption: This is an illustration. Hauling torques include the gear losses against the motor; holding torques include the losses helping the brake. At the clutch shaft only the open gear's 95% efficiency applies: 7,576.5 ÷ (22.5 × 0.95) and 6,110.1 ÷ 22.5 × 0.95.
```

The rope speed while hauling is π × 0.6 × 3.222 ÷ 60 = 0.1012 m/s, or 6.07 m/min, so a full 60 m haul takes just under ten minutes. The power in the rope is 25,255 × 0.1012 = 2.56 kW, and the power at the motor is 18.85 × 151.84 = 2.86 kW, where 151.84 rad/s is 1,450 rpm. The 5.5 kW motor has a rated torque of 5,500 ÷ 151.84 = 36.2 N·m, so it hauls at about half load, which leaves room for starting.

## Inertia, and where it lives

A brake that only had to hold a load would need only torque. Stopping a moving load also needs inertia, because the brake must take away the kinetic energy as well as resist the load. For a winch the inertia has two parts: the rotating parts themselves, and the boat and cradle moving along the slope.

A mass moving in a straight line at the rope behaves, seen from the drum, like a rotating inertia of m r². For 25 t at 0.3 m that is 25,000 × 0.3² = 2,250 kg·m². The drum and its gear add an estimated 25 kg·m², for 2,275 kg·m² at the drum. Seen from another shaft, inertia scales with the square of the speed ratio: at the motor the whole load and drum look like 2,275 ÷ 450² = 0.0112 kg·m². The motor's rotor, brake disc and coupling add about 0.040 kg·m², and the gearbox and clutch parts about 0.0006 kg·m², for 0.0518 kg·m² in total at the motor shaft.

That result surprises people who first meet it. At 450:1, the 25 t boat contributes less inertia at the motor than the motor's own rotor does. The load's weight still matters enormously, through the torque it applies, but its mass hardly affects how quickly the motor speeds up or stops.

### Starting the haul

The [reflected inertia tool](/tools/reflected-inertia/) works this out for a drive. It takes the load inertia at the load shaft, the motor's inertia, the reduction ratio, the gearbox efficiency, the load speed to reach, the time to reach it and the load torque at the load shaft. It returns the load inertia reflected to the motor, the inertia ratio, the motor speed, the torque to accelerate the motor and the reflected load, the load torque at the motor, and their sum, the peak motor torque. It divides both the load inertia and the load torque by the efficiency as well as the ratio, which is the conservative choice for a motor driving its load. It assumes constant acceleration from rest.

```figure
type: steps
title: Starting the SW-25 haul in the reflected inertia tool
caption: This is an illustration. Load inertia 2,275 kg·m² at the drum, motor and brake 0.040 kg·m², ratio 450:1, efficiency 89.3%, drum speed 3.222 rpm reached in 1 s, load torque 7,576.5 N·m at the drum.
- Reflected load inertia | 0.0126 kg·m²
- Inertia ratio | 0.31 : 1
- Motor speed | 1,450 rpm
- Acceleration torque | 7.98 N·m
- Load torque at the motor | 18.85 N·m
- * Peak motor torque | 26.84 N·m
```

The peak of 26.8 N·m is well under the starting torque of a direct-on-line induction motor, which is typically around twice its rated torque. Two thirds of it is load torque; one third accelerates the motor and everything behind it. The inertia ratio of 0.31:1 tells the same story as before: the motor is accelerating mostly itself.

The same start can be seen from the drum with the [torque to accelerate a rotating load tool](/tools/angular-acceleration-torque/). It takes the inertia, the starting and final speeds, the time and a friction or load torque, and returns the angular acceleration, the accelerating torque, the total torque, the revolutions turned, the kinetic energy change and the peak power at the end of the change. With 2,275 kg·m², from rest to 3.222 rpm in 1 s and a load torque of 7,576.5 N·m, it gives an angular acceleration of 0.337 rad/s², an accelerating torque of 767.7 N·m, a total torque of 8,344 N·m and a kinetic energy of only 130 J. The drum turns 0.027 revolutions while it speeds up, which is 51 mm of rope.

The drum figure does not include the motor's own inertia, which is why the two tools do not agree exactly: the motor's 0.040 kg·m² at 1,450 rpm holds 0.5 × 0.040 × 151.84² = 461 J, more than three times the energy of the boat and drum together.

## Energy in a haul and a lowering

The energies that matter for heat are much larger than the kinetic energies. Hauling the full 60 m raises the load by 60 × 0.08305 = 4.98 m and stores 245,250 × 4.98 = 1,222 kJ as potential energy. The motor delivers more than that, because rolling resistance and gears also take their share: the work in the rope alone is 25,255 × 60 = 1,515 kJ.

Lowering, that potential energy must go somewhere. If the cradle is let down on the band brake with the clutch out, the brake absorbs all of it except what rolling resistance takes: 15,479 × 60 = 929 kJ in an ordinary lowering, and up to the full 1,222 kJ if the rails are slippery and rolling resistance is low. Chapter 8 returns to this: it is the band brake's main heat load, and it is thousands of times the 0.35 kJ of kinetic energy the boat and drum carry at a lowering speed of 10 m/min.

```figure
type: bars
title: Energies in one SW-25 cycle, 25 t on the 60 m slipway
x: Quantity
y: Energy, kJ
caption: This is an illustration. Kinetic energies are too small to show at this scale: 0.13 kJ for the boat and drum at hauling speed, 0.60 kJ for everything at the motor shaft. A brake that controls a descent deals with potential energy, not kinetic energy.
- Work in the rope, full haul | 1515
- * Potential energy gained | 1222
- Brake heat, lowering with rolling resistance | 929
- Kinetic energy at the motor shaft | 0.6
```

## The mistake: counting a resistance that may not be there

The yard's first brake calculations used the lowering pull of 15,479 N, which includes the help of rolling resistance. They were checked by a second engineer, who asked a question every brake calculation should answer: which resistances can be relied on at the moment the brake is needed?

Rolling resistance on a slipway varies widely. Wheels with seized bearings drag; greased rails and new bearings run freely; a cradle on wet, weed-covered rails late in a tide may have very little resistance left. A brake that relies on rolling resistance to hold its load is relying on the condition of a part nobody inspects as a brake component. The yard's rule became: brakes are sized to hold and stop the load with rolling resistance taken as zero. The holding pull rises from 15,479 N to 20,367 N, and the drum torque from 4,643.7 N·m to 6,110.1 N·m: 31.6% more.

The same reasoning applies to any brake calculation. Friction in bearings and seals, wind resistance and the drag of a process helps in normal running, but a brake is a safety device, and the cases it exists for are often those in which the help is missing. Chapters 7 to 10 use the zero-rolling-resistance figures for holding and stopping, and use the lowering figure only to estimate heat in normal use.

```figure
type: checklist
title: Before using a load in a clutch or brake calculation
caption: The checks the SW-25's engineers applied. This is an illustration.
- x Each force identified with its direction for each motion: hauling, lowering, holding
- x Resistances that cannot be relied on removed from brake cases
- x Torque taken to the shaft where the device sits, with efficiency in the right direction
- x Inertia of linear masses converted to the shaft by m r² and the ratio squared
- x Potential energy of a lowering estimated, as well as kinetic energy
- ? Rope stretch and shock from snatch loads (taken up with the clutch in Chapter 4)
```

## What the numbers mean for the devices

Seen together, the numbers show why the SW-25 has such different devices on its different shafts. The motor brake works at 1,450 rpm and about 12 N·m, so it can be small, but it sees every stop of the drive at full motor speed. The clutch works at 72.5 rpm and a few hundred newton metres. The drum brakes work at a few revolutions a minute and several thousand newton metres, so they are large, but their speeds are so low that a stop releases little kinetic energy; their heat comes from controlled lowering.

Two further points apply to every later chapter. First, a device placed on a slow shaft needs more torque but slips through a smaller angle in a given time; a device on a fast shaft needs less torque but slips through more angle, and the heat it generates is the same for the same energy absorbed. Second, the regulatory frame matters: winches are plant under the model WHS laws, and their design is covered in Australia by AS 1418.2 for serial hoists and winches. This book uses the yard's working figures for brake factors and tests, labelled as illustrations, not values from that standard.

## Exercise: a lighter boat on a steeper slip

**Problem.** A second slipway at the same yard has a slope of 1 in 10. Its winch has the same 600 mm drum and the same 450:1 drive at 89.3% efficiency. The largest boat and cradle weigh 15 t together, and the rolling resistance is 0.02. Find (a) the hauling rope pull and the hauling torque at the motor, (b) the holding torque at the drum and at the motor with rolling resistance ignored, and (c) the load inertia at the motor from the boat and cradle alone.

**Answer.** The slope angle is arctan(0.1) = 5.711°, with sin 0.09950 and cos 0.99504. The weight is 15,000 × 9.81 = 147,150 N.

(a) Hauling pull = 147,150 × (0.09950 + 0.02 × 0.99504) = 147,150 × 0.11940 = 17,570 N. Drum torque = 17,570 × 0.3 = 5,271 N·m. Motor torque = 5,271 ÷ (450 × 0.893) = 13.12 N·m.

(b) Holding pull = 147,150 × 0.09950 = 14,642 N. Drum torque = 14,642 × 0.3 = 4,393 N·m. Motor torque = 4,393 ÷ 450 × 0.893 = 8.72 N·m.

(c) Inertia at the drum = 15,000 × 0.3² = 1,350 kg·m²; at the motor = 1,350 ÷ 450² = 0.00667 kg·m².

**The error to avoid.** Using the hauling efficiency the wrong way round for holding gives 4,393 ÷ (450 × 0.893) = 10.93 N·m at the motor, 25% more than the true load torque. That error is on the safe side for the brake, but the same slip in a calculation of the motor's lowering duty, or of how much the gear losses help, would not be.
