---
book: industrial-hydraulics-by-the-numbers
chapterSlug: pressure-flow-and-power-for-the-job
order: 1
title: "Pressure, flow and power for the job"
description: "Turn a pressing job into numbers: force from pressure and area, speed from flow, hydraulic power from pressure times flow, a duty cycle, and a quick check that catches unit and area errors."
draft: false
---

Every hydraulic design starts with three relations. Force is pressure times area. Speed is flow divided by area. Power is pressure times flow. A designer who keeps those three in view can size most of a simple system on one page and can tell, before anything is bought, whether a proposed pump, cylinder or motor is roughly right. A designer who skips them tends to buy components first and discover later that the press is slow, hot or not strong enough.

This chapter writes down the workshop's pressing job, converts it into pressure, flow and power, builds a duty cycle, and shows why hydraulics suits the job better than the alternatives. The failure case is a single missing "÷ 4" in an area calculation, which would have produced a press with less than a third of its intended pressure capacity. A thirty-second check catches it.

## The job in numbers

The workshop repairs centrifugal pumps. Much of the work involves pressing bronze bushes, ball bearings and wear rings into housings and impellers, and pressing worn ones out. Until now it has used a borrowed 20-tonne bottle-jack press, which is slow and gives no control over force. The owner wants a press that is quicker, repeatable and safe to use for a full shift on a contract job.

This is an illustration. The largest job in the order book is pressing out a seized wear ring that needed about 150 kN on the borrowed press, read from its gauge. The owner wants a margin above that and settles on a rated force of 200 kN.

```figure
type: stats
title: The press's job, written as numbers
caption: This is an illustration. These figures come from the workshop's jobs and the owner's wishes. Every later chapter is measured against them.
- 200 kN | rated pressing force at the end of the stroke
- 300 mm | stroke, of which about 270 mm is approach and 30 mm is pressing
- about 54 mm/s | approach speed, fast enough not to waste time
- about 11 mm/s | pressing speed, slow enough to watch and stop
- about 79 mm/s | return speed
- 30 s | loading and unloading time per part, with the press idle
```

Two things are already visible. First, the force is needed only over the last 30 mm or so; the approach and return need speed, not force. Second, most of the cycle is spent loading and unloading, with the press doing nothing. Both observations shape the pump choice in Chapter 4 and the heat estimate in Chapter 6.

### Where the 200 kN comes from

The rated force deserves more thought than it usually gets, because it sets the size of everything else. Pressing a bush into a bore is resisted by friction on the contact area, and that friction depends on the interference between the parts, the length of engagement, the surface finish, the lubricant and the stiffness of the housing. Each of those varies from job to job and part to part. A calculated pressing force for an interference fit is an estimate with a wide band, not a fixed number.

The workshop's 150 kN figure is a measurement, but not a precise one. It was read from the gauge on a borrowed bottle-jack press whose gauge had never been checked, and a seized wear ring takes more force to start than to keep moving. The owner treated it as "about 150 kN, possibly more". A rated force of 200 kN gives about a third more than that reading. A larger margin would grow the cylinder, frame and pump for jobs the workshop does not yet have; a smaller one would leave the largest current job close to the limit, where a slightly tighter part would stall the press.

Writing the reasoning down matters as much as the number. When a customer later asks whether the press can remove a 230 kN bearing, the answer is already on file: no, and the relief valve setting described below is the reason.

## Pressure, area and force

Pressure is force per unit area. Hydraulic work in Australia mixes three units for it, and errors start here.

- **Pascal (Pa)**: one newton per square metre. Too small to be practical on its own.
- **Megapascal (MPa)**: one newton per square millimetre. The most convenient unit for calculations, because areas in mm² multiplied by pressure in MPa give force in newtons directly.
- **Bar**: 0.1 MPa. Gauges, valve settings and catalogues mostly use bar.

So 160 bar is 16 MPa, which is 16 N on every square millimetre of piston.

Gauge pressure, the reading on a gauge, is pressure above atmosphere. Nearly all hydraulic calculations use gauge pressure because atmospheric pressure acts on both sides of everything. The exception is gas, such as the nitrogen in an accumulator, where the gas laws need absolute pressure. Chapter 7 returns to that.

```figure
type: formula
title: Force from pressure on the full bore of the cylinder
formula: F = p × A, with A = π × D² ÷ 4
caption: This is an illustration. Working in MPa and mm² gives newtons with no conversion factor. The figure of about 1.23 kN per bar is worth remembering for this bore.
- Bore, D | 125 mm
- Full-bore area, A | π × 125² ÷ 4 = 12,271.8 mm²
- Force per bar | 12,271.8 mm² × 0.1 MPa = 1,227 N, about 1.23 kN per bar
step: pressure for 200 kN = 200,000 N ÷ 12,271.8 mm² = 16.3 MPa = 163 bar
step: force at a 175 bar relief setting = 17.5 × 12,271.8 = 214,757 N, about 214.8 kN
```

The second line under the formula is a habit to keep. A press is not limited by its "rating"; it is limited by the highest pressure its relief valve allows. With the relief at 175 bar, this cylinder can push 214.8 kN, and Chapter 3 checks the frame and cylinder at that force, not at 200 kN.

The 150 kN job, by the same arithmetic, needs about 122 bar. It sits comfortably inside the press's range.

## Why hydraulics for this job

The owner looked at three ways to make 200 kN over 300 mm.

```figure
type: compare
title: Three ways to make 200 kN at the end of a 300 mm stroke
cols: Pneumatic cylinder | Electric screw press | Hydraulic cylinder
caption: This is an illustration. The pneumatic bore assumes 6 bar at the cylinder. The electric option is feasible but costs more for this force and gives less overload protection unless a force sensor and controls are added.
- Bore or size for 200 kN | about 651 mm bore at 6 bar | ball or roller screw and gearbox sized for 200 kN | 125 mm bore at 163 bar
- Force control | poor, air is compressible | by motor current or a load cell | by pressure, read on a gauge
- Overload protection | relief on air supply | software and mechanical limits | relief valve limits force directly
- Holding force without power | lost when air is released | screw self-locking or brake | held by valves; drifts slowly with leakage
- Fit for a small workshop | impractical size | possible, higher cost | yes, common and repairable
```

A pneumatic cylinder for 200 kN at 6 bar would need a bore of about 651 mm, which is absurd for a bench press. An electric screw press would work, and is quieter and cleaner, but at this force it needs a large screw and gearbox and careful overload protection. A hydraulic cylinder makes the force with a cylinder smaller than a dinner plate, and its force is limited directly by a relief valve and read on a gauge. That direct link between pressure and force is the main reason hydraulics dominates presses.

The cost of that choice is oil: leaks, heat, contamination and the stored energy of fluid under pressure. Later chapters deal with each.

## Flow and speed

Speed is the volume of oil delivered per second divided by the area it pushes on. In workshop units, flow in litres per minute converts to mm³/s by multiplying by 1,000,000 and dividing by 60.

The workshop wants the approach at about 54 mm/s on the full bore:

- flow = 12,271.8 mm² × 54.3 mm/s = 666,000 mm³/s, which is **40 L/min**.

The pressing stroke at about 11 mm/s needs only a fifth of that, about **8 L/min**. The return stroke pushes on the annulus, the ring-shaped area on the rod side of the piston. With a 70 mm rod, the rod's area is 3,848.5 mm² and the annulus is 12,271.8 − 3,848.5 = **8,423.4 mm²**. Delivering 40 L/min to the annulus returns the piston at 666,700 ÷ 8,423.4 = **79.1 mm/s**.

There is a catch in that return stroke that causes trouble in Chapters 5 and 8. While 40 L/min goes into the annulus, oil leaves the cap end at the full-bore area times the return speed, 12,271.8 × 79.1 mm/s, which is about **58.3 L/min**. The ratio between the two areas, 12,271.8 ÷ 8,423.4 = **1.457**, multiplies the flow leaving the cap end. Lines, valves and filters on that side must pass the larger figure.

## Power

Hydraulic power is pressure times flow. In workshop units, power in kilowatts is pressure in bar times flow in L/min, divided by 600.

```figure
type: bars
title: Hydraulic power at three points in the press cycle
unit: kW
max: 12
caption: This is an illustration. Approach pressure is assumed at about 8 bar. The third bar is what one pump would need to deliver the approach flow at full pressing pressure, which is why Chapter 4 does not use one pump.
- Approach, 40 L/min at about 8 bar | 0.53
- Pressing, 8 L/min at 163 bar | 2.17
- *One pump, 40 L/min at 163 bar | 10.87
```

The press needs a high flow at low pressure during the approach and a low flow at high pressure while pressing. It never needs both at once. A single fixed pump big enough for the approach would push 40 L/min against 163 bar while pressing, drawing almost 11 kW of hydraulic power and turning most of it into heat. Chapter 4 uses this mismatch to choose a two-pump arrangement and a 4 kW motor.

### From hydraulic power to the motor

Hydraulic power is what the oil carries. The pump needs more than that at its shaft, because it leaks a little oil internally and loses some torque to friction. Two efficiencies describe this. Volumetric efficiency is the share of the pump's swept volume that actually leaves the outlet; mechanical efficiency is the share of shaft torque that becomes pressure. This book uses 92% and 90% as illustrative values for a gear pump in good condition, giving an overall efficiency of 0.92 × 0.90 = **0.828**. A pump maker's data sheet gives the real figures, which change with pressure, speed and viscosity.

So pressing at 8 L/min and 163 bar needs 2.17 ÷ 0.828, about **2.62 kW** at the pump shaft. The electric motor then loses a little more in its own windings and bearings before the power reaches the switchboard. Each step in the chain loses a few per cent, and almost all of those losses end up as heat, much of it in the oil.

### Who sees which pressure

A hydraulic system is only as strong as its weakest rated part, so it helps to list early which parts see which pressure.

- **The pump outlet, pressure line and directional valve** see up to the relief setting, 175 bar on this press.
- **The cap end of the cylinder** sees the same, because it is connected to the pump while pressing.
- **The rod end of the cylinder and its line** normally see low pressure, but can see much more than the relief setting if oil is trapped there while the cap end is pressurised. That effect, intensification, is the subject of a failure case in Chapter 4.
- **The return line, return filter and reservoir** see low pressure, but must pass the largest flow in the system.
- **The suction line** sees slightly less than atmospheric pressure and must be generous, because a starved pump cavitates.

Every component bought for the press is checked against the pressure it can actually see, not against the nominal system pressure. That list becomes the specification sheet for Chapters 3 to 6.

## The duty cycle

A press is used in cycles, and the cycle sets the heat load and the motor's duty.

```figure
type: timeline
title: One cycle of the press on the contract job
caption: This is an illustration. Times come from the stroke lengths and speeds above, with a 2 s dwell at full force while the bush settles. The cycle is about 43.5 s.
- 0 to 4.97 s | Approach | 270 mm at 54.3 mm/s, low pressure
- 4.97 to 7.73 s | Press | 30 mm at 10.86 mm/s, pressure rising to about 163 bar
- 7.73 to 9.73 s | Dwell | 2 s held at the relief setting
- 9.73 to 13.52 s | Return | 300 mm at 79.1 mm/s
- *13.52 to 43.5 s | Load and unload | about 30 s with the pumps unloaded to tank
```

Two-thirds of each cycle is idle. Whether the pumps are unloaded during that time, or keep pushing oil over a relief valve, makes a large difference to heat. The dwell is short but expensive, because it runs at the highest pressure. Both points reappear in Chapter 6.

## A failure case: the missing quarter

This is an illustration. The owner's first sketch of the press was done in a hurry. The area of the 125 mm bore was written as π × 125², which is 49,087 mm². Dividing 200 kN by that gives 4.07 MPa, about **41 bar**. On that basis the owner priced a low-cost power unit with valves rated at 70 bar.

The error is the missing division by four. The true area is a quarter of the sketch's figure, 12,271.8 mm², and the true pressure is four times higher, 163 bar. Valves rated at 70 bar would have been overloaded more than twice over at the rated force. If the relief valve had been set to protect the valves, the press would have made only about 86 kN at 70 bar.

The detection was a rough check the workshop now uses on every hydraulic calculation: **a 125 mm bore at 100 bar should push about 123 kN**. That is 10 MPa on about 12,000 mm². Anyone who has used a press knows a 125 mm cylinder at a modest pressure is far stronger than a 41-bar sketch implies. When the sketch's figure failed that check, the arithmetic was redone and the quotation for the 70-bar unit was withdrawn before an order was placed.

The general lesson is to carry a few remembered reference points, such as force per bar for common bores, and to compare every calculated answer with them before acting on it. Three are worth writing inside the cover of a workshop notebook: a 100 mm bore pushes about 0.79 kN per bar, a 125 mm bore about 1.23 kN per bar and a 160 mm bore about 2.01 kN per bar. Doubling the bore multiplies the force by four, which is exactly the factor the sketch got wrong.

## How this applies to a small Australian business

Write the job down as numbers before talking to suppliers: force, stroke, speeds, cycle and duty. Use MPa and mm² for calculations and convert to bar only for gauges and settings. Remember that the relief setting, not the nameplate, decides how hard a press can push, and check the machine at that force. Look for jobs that need speed and force at different times, because they suit two pumps or a variable pump far better than one large pump. AS 2671:2021, the Australian adoption of ISO 4413, sets general rules and safety requirements for hydraulic systems on machinery; the people designing and building a real press should work to it.

## Exercise: a second press

The workshop considers a smaller press with a **100 mm bore** for a job that needs **160 kN**, approaching at **50 mm/s**. What pressure does it need? What flow gives that approach speed? What hydraulic power would one pump need to deliver that flow at that pressure? Is the 100 mm bore sensible if the system's relief is limited to 175 bar?

**Worked answer.** The area is π × 100² ÷ 4 = **7,854 mm²**. The pressure for 160 kN is 160,000 ÷ 7,854 = 20.37 MPa, about **204 bar**. The approach flow is 7,854 × 50 = 392,700 mm³/s, about **23.6 L/min**. One pump delivering 23.6 L/min at 204 bar needs 204 × 23.6 ÷ 600, about **8.0 kW** of hydraulic power. The bore is not sensible with a 175 bar relief, because 204 bar is above it and the press could make only 7.854 × 17.5, about 137 kN. The existing 125 mm cylinder would make 160 kN at about **130 bar**, which is a better choice.
