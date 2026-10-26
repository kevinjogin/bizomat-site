---
book: ductwork-by-the-numbers
chapterSlug: fans-system-curves-and-the-fan-laws
order: 8
title: "Fans, system curves and the fan laws"
description: "Find where a fan meets its system, see what clean and dirty filters do, apply the fan laws, compare a drive with a damper, and catch a speed increase that overloaded a motor."
draft: false
---

Chapter 6 found the duty that EX-1's fan must meet: a flow and a pressure. A fan does not deliver a duty, though; it delivers a curve, a range of flows at a range of pressures, and it settles wherever its curve meets the curve of the system it is connected to. Understanding that meeting point explains why a fan delivers more air than intended when the filters are clean, less when they are dirty, and why a small change in speed has a large effect on power.

This chapter sets out the system curve, the fan curve and their operating point, the effect of the collector's changing loss, the fan laws for changes of speed, and the comparison between controlling flow with a variable-speed drive and with a damper. The running case uses an illustrative fan curve for EX-1 and finds that an attempt to strengthen B1 by speeding the fan up 10% overloaded its motor.

## The system curve

A duct system's pressure loss rises with the square of its flow, as Chapters 4 and 5 found for friction and fittings, so the system as a whole can be described by **Δp = k × Q²**, where k is a constant for that system in that condition. The curve passes through zero: no flow, no loss.

This is an illustration. With clean filters, EX-1 loses 2,344 Pa at 0.927 m³/s, so k = 2,344 ÷ 0.927² = about **2,728** Pa per (m³/s)². With filters at their cleaning point it loses 3,044 Pa, so k = about **3,542**. Treating the collector's loss as rising with the square of the flow is itself an approximation; the collector maker's data shows how its loss really varies, and should be used where it matters.

## The fan curve

A fan's curve, from its maker, shows the pressure it develops at each flow at a given speed, along with its power and efficiency. Typically the pressure is highest at low flow and falls as the flow rises. This book does not reproduce any maker's curve. For EX-1, an **illustrative** curve is used: at its full speed of 2,900 rpm, the fan develops 3,800 Pa at zero flow, falling as **3,800 − 880 × Q²** pascals, a shape chosen so that it passes through the dirty-filter duty of 0.927 m³/s at 3,044 Pa.

```figure
type: line
title: EX-1's illustrative fan curve and its dirty-filter system curve
x: Flow, m³/s
y: Pressure, Pa
ymin: 0
ymax: 4500
legend: Fan at 2,900 rpm | System, dirty filters
caption: This is an illustration. The fan curve is invented for this book to pass through the design duty; a real fan's curve comes from its maker. The fan operates where its curve crosses the system curve, here at the design duty; the clean-filter system curve lies lower, about 23% below this one at every flow, and crosses the fan curve further right.
- 0 | 3800 | 0
- 0.4 | 3659 | 567
- 0.6 | 3483 | 1275
- 0.8 | 3237 | 2267
- 0.927 | 3044 | 3044
- 1.0 | 2920 | 3542
- 1.1 | 2735 | 4286
```

## Static or total pressure

A fan maker's curve states which pressure it shows. Some curves show the fan's **total** pressure rise, the rise in the air's total pressure from inlet to outlet; others show its **static** pressure, which leaves out the velocity pressure at the fan's outlet. The two differ by the outlet velocity pressure. EX-1's duty in this book is a total pressure rise, because Chapter 6 added total-pressure losses from the hood to the stack exit, including the exit's velocity pressure. Comparing that duty with a curve of static pressure, or the reverse, mixes two bases and puts the operating point in the wrong place by the outlet velocity pressure.

This is an illustration. EX-1's fan outlet, 300 × 200 mm, carries 0.927 m³/s at about 15.5 m/s, a velocity pressure of about 143 Pa. A duty of 3,044 Pa total, read against a static-pressure curve as if it were static, would select a fan with about 143 Pa more capability than needed; a static duty read against a total curve would select one about 143 Pa short. The duty sheet of Chapter 6 should state the basis, and the fan selection should use the same one.

## The operating point

The fan settles where its curve and the system curve cross, because only there does the pressure it develops equal the pressure the system loses at the same flow.

- **Dirty filters**: the curves cross at **0.927 m³/s and 3,044 Pa**, the design duty, as the fan was selected to do.
- **Clean filters**, at full speed: the system is easier, so the crossing moves to a higher flow. Solving 3,800 − 880Q² = 2,728Q² gives **Q = 1.026 m³/s** at about 2,873 Pa: 11% more air than design.

More air sounds harmless, but it has costs. The fan's power rises with the flow, to about 2,949 W of air power, 4.91 kW at the shaft at an illustrative 60% efficiency. The hoods draw more than they need, which wastes heated or cooled workshop air. And the collector's filters load faster, because they see more air. As the filters load, the operating point slides back along the fan curve towards the design duty, and the flow falls through the cleaning cycle.

## Controlling the flow

Two ways of holding the flow at 0.927 m³/s throughout the filters' cycle are common.

**A damper** adds resistance to make up the difference between the clean and dirty systems. With clean filters it must absorb 3,044 − 2,344 = **700 Pa**, so the fan always works at the dirty-filter duty, 0.927 m³/s at 3,044 Pa, about **4.70 kW** at the shaft in this illustration. The damper's 700 Pa is energy spent on nothing.

**A variable-speed drive** slows the fan until its curve crosses the clean system curve at the design flow. The fan laws, below, give the speed: about **2,619 rpm**, 90.3% of full speed. The fan then develops only the 2,344 Pa the clean system needs, about **3.62 kW** at the shaft at the same illustrative efficiency, and the drive raises the speed as the filters load.

```figure
type: compare
title: Holding 0.927 m³/s with clean filters
cols: Fan speed | Fan pressure | Shaft power
caption: This is an illustration at an assumed 60% fan efficiency. The drive saves about 1.08 kW while the filters are clean, compared with throttling by damper.
- No control, full speed | 2,900 rpm | 2,873 Pa at 1.026 m³/s | 4.91 kW
- Damper at full speed | 2,900 rpm | 3,044 Pa at 0.927 m³/s | 4.70 kW
- *Variable-speed drive | 2,619 rpm | 2,344 Pa at 0.927 m³/s | 3.62 kW
```

## The fan laws

For one fan running at different speeds in the same system, with the same air density, the **fan laws** relate the changes:

- flow is proportional to speed: **Q₂ ÷ Q₁ = N₂ ÷ N₁**;
- pressure is proportional to speed squared: **p₂ ÷ p₁ = (N₂ ÷ N₁)²**;
- power is proportional to speed cubed: **P₂ ÷ P₁ = (N₂ ÷ N₁)³**.

Because a system curve is also a parabola through zero, changing a fan's speed moves its operating point along the system curve, and the fan laws predict the new point directly. With clean filters at full speed, EX-1 runs at 1.026 m³/s; to bring it to 0.927 m³/s the speed must fall in the ratio 0.927 ÷ 1.026 = **0.903**, which is the 2,619 rpm found above.

## The error: a 10% speed increase

This is an illustration. Some months after commissioning, B1's booth seemed weak, and a maintenance contractor, without measuring anything, raised the variable-speed drive's maximum speed by 10% to "give B1 more air". By the fan laws, a 10% speed increase in the same system gives 10% more flow, 21% more pressure and **33% more power**, 1.1³ = 1.331.

At the dirty-filter end of the cycle, the shaft power rose from 4.70 kW towards 4.70 × 1.331 = **6.26 kW**. The motor, rated in this illustration at 5.5 kW, tripped on overload the next time the filters approached their cleaning point, and the system stopped in the middle of a shift.

The investigation found the real cause of B1's weakness: dust built up in the 200 mm section, as in Chapter 4's exercise, which had raised B1's path's resistance more than the other paths'. Speeding the fan up pushed more air through every hood, not just B1, and loaded the motor beyond its rating; cleaning the duct restored B1 without any change of speed. The fix was to restore the speed limit, clean the main, and add a rule that no fan setting is changed without measuring the hoods first, as Chapter 10 describes.

```figure
type: bars
title: Fan shaft power at the dirty-filter point, by speed
unit: kW
max: 7
caption: This is an illustration. Power rises with the cube of speed; a 10% increase takes the fan past a 5.5 kW motor's rating.
- *Design speed | 4.70
- 10% faster | 6.26
```

## Sizing the motor

The motor must deliver the highest shaft power the fan will need anywhere in its operating range, with a margin. This is an illustration. EX-1's highest power in normal running is at the dirty-filter end of the cycle, about 4.70 kW, and its motor is rated at 5.5 kW, a margin of about 17%. Without a speed limit, the fan could also run at full speed with clean filters and the damper open, at about 4.91 kW, still within the rating. The motor rating and the drive's maximum speed together set the limit that the error above exceeded, and both should be recorded on the duty sheet so that a later change can be checked against them.

## When booths are shut

EX-1's booths have blast gates for shutting off when not in use, as Chapter 5 noted. Shutting a booth removes its path from the system, which makes the system harder: the remaining paths must pass all the fan's flow, so the system curve becomes steeper. Without control, the fan's operating point moves to a lower total flow and a higher pressure, and each open hood draws more than its design flow, because the fan's pressure is shared among fewer paths. With a variable-speed drive controlled to hold a set suction in the main, the drive slows the fan to suit the reduced demand, saving power and keeping the open hoods near their design flows. Which control strategy suits a system depends on how it will be used, and the strategy belongs in the design, not in a later adjustment.

## Density and temperature

The fan laws above hold at constant air density. A fan's pressure and power at a given speed are proportional to the density of the air it moves. EX-1's air at 1.2 kg/m³ is typical of a workshop; a fan handling air at 80 °C, about 0.996 kg/m³, develops about 17% less pressure and needs about 17% less power at the same speed and volume flow. Fan curves are drawn for a stated density, and a selection for hot or high-altitude air must correct for it. A fan selected for hot running and started cold draws more power than it will in service, which is a reason motors are often sized for the cold-start condition.

## Where on the curve

A fan has a region of its curve where it runs efficiently and stably, and regions where it does not. At very low flows some fans surge or stall, with pulsing flow and noise; at very high flows efficiency falls. The fan maker's data marks the recommended operating range. An operating point near the middle of that range, at the design duty, leaves room for the system to vary, with filters loading and booths opening and closing, without leaving it. A fan selected so that its design point sits at the edge of its range will spend part of every cleaning cycle outside it.

EX-1's illustrative curve shows why the clean-filter condition needs care. At full speed with clean filters the fan would run at 1.026 m³/s, 11% beyond its design flow, further along its curve towards the high-flow end where efficiency falls. With the variable-speed drive holding 0.927 m³/s at 2,619 rpm, the fan is at the point that the fan laws make similar to 1.026 m³/s at full speed, so its efficiency is the efficiency of that clean, full-speed point, not of the design duty. The drive saves power by reducing speed, not by moving the fan to a better part of its curve, and the power estimate for the clean condition should use the efficiency the maker's curve gives at that similar point rather than the design-point figure. In this book's illustration both are taken as 60% for simplicity; a real selection would show the difference.

## Exercise: the fourth booth and this fan

Chapter 6's exercise found that adding the fourth booth would need about 1.339 m³/s at 3,400 Pa. Using EX-1's illustrative fan curve, 3,800 − 880Q² at 2,900 rpm, what pressure does the fan develop at 1.339 m³/s at full speed? What speed would it need to meet the new duty, by the fan laws and the curve, and what would that mean?

**Worked answer.** At full speed and 1.339 m³/s, the fan develops 3,800 − 880 × 1.339² = about **2,223 Pa**, far short of 3,400 Pa. To meet the duty, its curve at a speed ratio r must pass through (1.339, 3,400): 3,800 r² − 880 × 1.339² = 3,400, so r² = 1.310 and r = **1.145**, about **3,319 rpm**, 14.5% above its full speed.

That speed would raise the fan's power by about 1.145³ = 1.50 times at a similar point, take the motor well beyond its rating, and very likely exceed the fan's maximum permitted speed, which its maker sets for mechanical reasons. The fourth booth needs a different fan, or a second system, not a faster drive. The fan laws make that clear in a few lines, before anyone orders duct.
