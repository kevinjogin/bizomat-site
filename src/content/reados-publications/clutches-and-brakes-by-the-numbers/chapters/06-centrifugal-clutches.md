---
book: clutches-and-brakes-by-the-numbers
chapterSlug: centrifugal-clutches
order: 6
title: "Centrifugal clutches"
description: "How a centrifugal clutch engages by speed alone: shoe force, spring force, engagement speed, torque against speed, idle clearance, and the heat of slipping at part throttle."
draft: false
---

A centrifugal clutch needs no operator. Its shoes are held in by springs and thrown outward against a drum by their own spinning, so it stays disengaged while its engine idles and engages by itself as the engine speeds up. That makes it the natural partner for small engines, which must start and idle without load, and it is why chainsaws, mowers, go-karts and small engine-driven pumps and winches use one.

This chapter checks the centrifugal clutch on the SW-25's backup petrol engine with the KEVOS® centrifugal clutch check tool. It shows how torque grows with the square of speed above the engagement point, why that makes the clutch a crude but useful overload device, and why it overheats if the engine is held at part throttle. Its mistake is a spring chosen so soft that the clutch engaged at idle.

## The backup drive

When the power fails with a boat part-way up the slip, the SW-25's motor brake holds it. The yard can then finish the haul with a 7.5 kW petrol engine mounted on the winch frame, which drives the gearbox input shaft through a V-belt with a ratio of 3,000 ÷ 1,450 = 2.069. A centrifugal clutch on the engine's crankshaft lets the engine start and idle at 1,400 rpm without turning the winch, and engages as the throttle opens.

Chapter 1 gave the hauling torque at the gearbox input, 18.85 N·m. At the engine it is 18.85 ÷ 2.069 ÷ 0.95 = 9.59 N·m, allowing 5% for the belt; with the yard's service factor of 1.5, the clutch must carry 14.39 N·m at the engine's running speed of 3,000 rpm. Chapter 2's brake test showed the engine delivering 6.29 kW, comfortably more than the 2.86 kW the haul needs.

## How the shoes make torque

Each shoe is a curved block of lined metal, pivoted or guided so that it can move outward, with its centre of gravity at a radius r. Turning at ω, a shoe of mass m needs a centripetal force m ω² r to keep it on its circle; until it touches the drum, only its spring provides that force, and once ω² r m exceeds the spring force, the shoe moves out. Against the drum, the shoe presses with the difference between its centrifugal force and the spring force, and the friction on it acts at the drum's radius.

```figure
type: formula
title: Centrifugal clutch, shoes without self-energising
formula: Centrifugal force per shoe Fc = m ω² r
formula: Engagement speed ωe = √(Fs ÷ (m r))
formula: Torque T = N μ (Fc − Fs) Rd
caption: m is each shoe's mass, r the radius to its centre of gravity, Fs the spring force holding it in at contact, Rd the drum's inside radius and N the number of shoes. Above engagement the torque grows with ω² minus a constant, so doubling the margin above the engagement speed much more than doubles the torque.
- Fs | spring force on each shoe at the point of contact
- Rd | drum inside radius, where friction acts
- N | number of shoes
```

## The SW-25's clutch

The clutch has three shoes of 0.30 kg each, with their centres of gravity at 55 mm, running in a drum of 70 mm inside radius, with a lining friction coefficient of 0.30. The springs specified by the yard hold each shoe in with 420 N at contact.

The [centrifugal clutch check tool](/tools/centrifugal-clutch-check/) takes the number of shoes, each shoe's mass, the radius to its centre of gravity, the spring force at contact, the drum's inside radius and the friction coefficient; the running speed, the idle speed at which the clutch must stay disengaged, the torque needed at running speed and a service factor. It returns the centrifugal force per shoe at speed, the engagement speed, the net shoe force, the torque at running speed and the torque needed with the service factor, with checks that the clutch stays out at idle and carries the torque at speed. It ignores the self-energising effect that pivoted shoes can have, and notes that worn linings change the spring force.

```figure
type: steps
title: The backup engine's clutch in the centrifugal clutch check tool
caption: This is an illustration. Three shoes of 0.30 kg at 55 mm, springs 420 N, drum radius 70 mm, μ = 0.30; running 3,000 rpm, idle 1,400 rpm, torque needed 9.59 N·m with a service factor of 1.5.
- Centrifugal force per shoe at 3,000 rpm | 1,628.5 N
- * Engagement speed | 1,524 rpm: above idle
- Net shoe force | 1,208.5 N
- Torque at running speed | 76.1 N·m
- Torque needed with service factor | 14.4 N·m: CLUTCH ADEQUATE
```

The clutch engages 124 rpm above idle, and at full speed it can carry five times the torque the haul needs. That large margin is normal for a centrifugal clutch, and the next section shows why it does not mean the clutch is oversized.

## Torque against speed

Because the torque depends on ω² minus a constant, it rises steeply once the shoes touch. It is zero at 1,524 rpm, 6.5 N·m at 1,700 rpm, 14.7 N·m at 1,900 rpm and 76.1 N·m at 3,000 rpm.

```figure
type: line
title: Torque of the backup engine's clutch against engine speed
x: Engine speed, rpm
y: Clutch torque, N·m
ymin: 0
ymax: 80
mark: 1893 | 1.5 × haul torque
caption: This is an illustration. Three 0.30 kg shoes at 55 mm, 420 N springs, 70 mm drum, μ = 0.30. The haul needs 9.59 N·m at the engine, reached at 1,778 rpm; with the service factor, 14.39 N·m is reached at 1,893 rpm. The engine's rated torque of 23.9 N·m is reached at 2,101 rpm.
- 1524 | 0
- 1700 | 6.48
- 1800 | 10.47
- 1900 | 14.69
- 2000 | 19.14
- 2200 | 28.71
- 2500 | 44.79
- 3000 | 76.13
```

The curve explains how a centrifugal clutch behaves in use. At full throttle the clutch is far stronger than the engine, so the engine, not the clutch, limits the torque: the clutch is locked up and passes whatever the engine delivers. If the load becomes too heavy, the engine slows. Below about 2,100 rpm the clutch can no longer carry even the engine's rated torque, and it begins to slip, letting the engine keep running instead of stalling. The clutch protects the engine from stalling under an overload, not the winch from overload. On the SW-25 that is the right way round, because the winch's own structure is designed for the electric motor's much higher starting torque.

## Slipping at part throttle

The same curve shows the centrifugal clutch's weakness. Between engagement and the speed at which it can carry the load, the clutch slips continuously with the load stalled, and every watt the engine produces goes into heat in the shoes and drum.

At 1,750 rpm the SW-25's clutch carries 8.45 N·m, less than the 9.59 N·m needed to move the boat. The boat stays still, the clutch slips at the full engine speed, and the heat is 8.45 × 183.3 = 1,549 W. A small clutch drum absorbing 1.5 kW reaches the temperature at which its linings glaze or burn in well under a minute. The yard's instruction for the backup engine therefore says: start and idle with the winch held by the brake, then open the throttle fully and smartly; never hold the engine at part throttle against the load.

```figure
type: decision
title: Operating a centrifugal-clutch drive under load
question: The engine is running and the load has not started to move. What next?
- Engine at idle | normal: the clutch is out
- * Engine at full throttle and the load moving | normal: the clutch is locked up
- Engine at part throttle, clutch slipping, load still | stop: open the throttle fully, or close it and find out why the load will not move
- Engine at full throttle, load still, engine slowing | overload: close the throttle and check the load and the brakes
caption: The heat in a slipping centrifugal clutch is the clutch torque times the engine speed. At part throttle that is most of the engine's output. This is an illustration based on the SW-25's backup instruction.
```

## Picking up the load

When the throttle opens, the clutch engages and must bring the winch drive up to speed. Seen from the engine's crankshaft, the drive's inertia is Chapter 1's 0.0518 kg·m² at the gearbox input divided by the belt ratio squared: 0.0518 ÷ 2.069² = 0.0121 kg·m². At 3,000 rpm, 314.2 rad/s, that is 597 J of kinetic energy, the same energy as at the gearbox input, because kinetic energy does not depend on the shaft it is measured on.

If the engine held 3,000 rpm and the clutch slipped at its full 76.1 N·m against the 9.59 N·m hauling load, the drive would reach speed in 0.0121 × 314.2 ÷ (76.1 − 9.59) = 0.057 s, and the clutch would absorb 76.1 × 314.2 × 0.057 ÷ 2 = 684 J. Spread through a clutch drum of about 1.5 kg of steel, that would raise its temperature by about 1 K.

In practice the engine cannot hold its speed while the clutch takes 76 N·m, three times its own torque. The engine slows as the clutch grabs, its flywheel's energy goes into the load, and the clutch's torque falls as the engine slows, until engine and load settle at a common speed and the engine accelerates both. The engagement is therefore softer and a little longer than the simple calculation suggests, and the heat is of the same order. For a single start on the SW-25 neither matters. What would matter is many starts in a row, or the part-throttle slip described above, each of which multiplies the heat.

## Why a centrifugal clutch here

The yard considered two alternatives for the backup drive: a dog clutch engaged by hand with the engine stopped, and a belt-tensioning idler that engages the drive by tightening a slack belt. The dog clutch would need the engine to be started in gear, with the winch and boat on the end of it, which a small engine cannot do. The belt tensioner works, and is common on garden machinery, but it depends on the operator to engage it smoothly and leaves the belt slipping, and wearing, if it is engaged half-way.

The centrifugal clutch needs no operator action at all: it engages when the engine is fast enough to pull the load and disengages when the engine slows. Its one demand on the operator, to use full throttle and not part throttle, is easier to train and to put on a sign beside the engine than any of the alternatives.

## Wear, springs and the engagement speed

The engagement speed depends on the spring force at the moment the shoes touch the drum. As the linings wear, the shoes must travel further outward before they touch, the springs stretch further, and their force at contact rises. That raises the engagement speed and lowers the torque at running speed a little. A clutch that has been relined, or fitted with new shoes, may engage at a different speed from a worn one for the same reason.

Spring force also changes if a spring is replaced with one of a different rate or length. A useful field check, recorded at each service, is to note the engine speed at which the winch first begins to turn with no load: it is the engagement speed, read directly, and a change between services points to springs or linings.

The yard's service record for the backup clutch therefore holds four numbers each year: the no-load engagement speed read from the engine's tachometer, the lining thickness on each shoe, the drum's inside diameter, and the spring force of each spring measured on a spring balance at its fitted length. Together they show whether the clutch still engages above idle and still carries the haul with its service factor.

### Self-energising shoes

The tool's model treats each shoe as pressing straight out. Real shoes are often pivoted at one end, and like the drum brake shoes of Chapter 7, a pivoted shoe can be self-energising in one direction of rotation: friction drags its free end harder into the drum and the torque rises. In the other direction it is de-energising. A clutch designed with pivoted shoes can therefore carry more torque one way than the simple model predicts, and less the other way. The SW-25's engine turns one way only, and its clutch uses guided, unpivoted shoes for which the simple model is close.

## The mistake: a clutch that engaged at idle

The backup clutch was first built with the engine maker's standard springs, giving 300 N at contact. Run through the check tool, they give an engagement speed of 1,288 rpm, below the 1,400 rpm idle. The tool flags this as ENGAGES AT IDLE. The error had not been run through the tool; it was found on the first trial, when the winch drum crept round with the engine idling and the boat's rope slowly tightened.

At 1,400 rpm the 300 N springs leave a net shoe force of 54.6 N and a torque of 3.4 N·m: not enough to haul, but enough to turn the drum with a slack rope and to wear the linings continuously while idling. With the stiffer 420 N springs the engagement rises to 1,524 rpm. The yard had chosen 420 N by working backwards from a target: to engage at 1,600 rpm would need 0.30 × 0.055 × 167.6² = 463 N, and 420 N was the nearest stock spring that kept engagement comfortably above idle while the torque at 1,893 rpm still met the service factor.

```figure
type: compare
title: Two spring choices for the backup clutch
cols: Engagement speed | Torque at idle, 1,400 rpm | Torque at 3,000 rpm
rowhead: Spring force at contact
- Engine maker's standard, 300 N | 1,288 rpm | 3.4 N·m: creeps | 83.7 N·m
- * Yard's choice, 420 N | 1,524 rpm | 0: stays out | 76.1 N·m
caption: This is an illustration. Three 0.30 kg shoes at 55 mm, 70 mm drum, μ = 0.30. The stiffer springs cost 9% of the torque at full speed and remove the creep at idle.
```

## Exercise: a four-shoe clutch for a small pump

**Problem.** A four-shoe centrifugal clutch has shoes of 0.20 kg at 50 mm, springs of 200 N at contact, a drum radius of 65 mm and μ = 0.35. The engine idles at 1,500 rpm and runs at 3,600 rpm. The load needs 10 N·m with a service factor of 1.5. Find (a) the engagement speed and whether it clears idle, (b) the torque at 3,600 rpm, and (c) the spring force that would raise engagement to 1,700 rpm, with the torque at 3,600 rpm that results.

**Answer.** (a) ωe = √(200 ÷ (0.20 × 0.050)) = 141.4 rad/s, or 1,350 rpm. That is below the 1,500 rpm idle: the clutch would engage at idle.

(b) At 3,600 rpm, ω = 377.0 rad/s and Fc = 0.20 × 377.0² × 0.050 = 1,421.2 N. Torque = 4 × 0.35 × (1,421.2 − 200) × 0.065 = 111.1 N·m, against 15 N·m needed.

(c) At 1,700 rpm, ω = 178.0 rad/s, so Fs = 0.20 × 0.050 × 178.0² = 316.9 N. Torque at 3,600 rpm = 4 × 0.35 × (1,421.2 − 316.9) × 0.065 = 100.5 N·m, still 6.7 times the requirement.

**The check.** Raising the springs cost a tenth of the full-speed torque and bought 200 rpm of clearance above idle: the usual trade in a centrifugal clutch, and nearly always worth making.

A final check is the engagement margin itself: 1,700 rpm is 200 rpm above idle, about 13%, which allows for an idle speed set a little high and for the rise in engagement speed as the linings wear.
