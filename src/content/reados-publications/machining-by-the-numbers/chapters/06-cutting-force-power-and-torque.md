---
book: machining-by-the-numbers
chapterSlug: cutting-force-power-and-torque
order: 6
title: "Cutting force, power and torque"
description: "Estimate specific cutting force from chip thickness, calculate cutting force, power and spindle torque, and check planned cuts against a machine's power and torque curve."
draft: false
---

Every cut needs energy. The edge must shear the material, bend the chip and overcome friction on the tool faces. That energy arrives through the spindle as power and torque, and it leaves mostly as heat in the chip, the tool and the work. If the planned cut needs more power or torque than the machine can deliver, the spindle slows, stalls or trips an overload, and the insert may break.

This chapter shows how to estimate the force and power for a cut from the specific cutting force of the material, and how to compare the result with a machine's power and torque curve. It uses the heaviest turning pass on the Harbourline flange as the main example.

## Specific cutting force

The **specific cutting force**, kc, is the tangential cutting force per square millimetre of chip cross-section, in N/mm². It is also the energy needed to remove one cubic millimetre of material, because 1 N/mm² equals 1 N·mm per mm³, or 1 millijoule per cubic millimetre. A kc of 2,400 N/mm² means 2.4 joules for every cubic millimetre removed.

Specific cutting force is not a fixed property of a material. It rises as the chip gets thinner, because a larger share of the energy goes into the rounded cutting edge and friction rather than clean shearing. This size effect is commonly modelled with a relationship developed by Otto Kienzle in the 1950s:

**kc = kc1 × h^(−mc)**

where h is the chip thickness in mm, kc1 is the specific cutting force at a chip thickness of 1 mm and mc is an exponent describing how quickly kc rises as chips thin. Tool suppliers publish equivalent data, sometimes referenced to a chip thickness of 0.4 mm rather than 1 mm; the idea is the same. Values depend on material grade, hardness and condition, and also on the tool's rake angle.

For turning, the chip thickness is the feed multiplied by the sine of the entering angle κr:

**h = fn × sin κr**

## Estimating kc for the flange

Harbourline uses illustrative values of kc1 = 1,700 N/mm² and mc = 0.25 for its medium-carbon steel in the normalised condition. These are representative of published data for similar steels but should be replaced with the tool supplier's values for the actual material.

For the roughing passes at fn = 0.25 mm/rev with a 95° entering angle:

- h = 0.25 × sin 95° = 0.249 mm
- kc = 1700 × 0.249^(−0.25) = **2,406 N/mm²**

For a finishing pass at 0.12 mm/rev, h = 0.1195 mm and kc rises to about 2,891 N/mm². The thinner chip costs about 20% more energy per cubic millimetre, although the total power is small because so little material is removed.

```figure
type: line
title: Specific cutting force rises as the chip thins
x: Chip thickness h (mm)
y: kc (N/mm²)
ymin: 1500
ymax: 3800
mark: 0.249 | flange roughing
caption: kc = 1,700 × h^−0.25, illustrative values for a medium-carbon steel. Thin chips cost more energy per cubic millimetre.
- 0.05 | 3595
- 0.10 | 3023
- 0.15 | 2732
- 0.20 | 2542
- 0.25 | 2404
- 0.30 | 2297
- 0.40 | 2138
```

## Cutting force and power

The main, tangential cutting force is the chip area times the specific cutting force:

**Fc = kc × ap × fn**

and the net cutting power is that force times the cutting speed:

**Pc = vc × ap × fn × kc ÷ 60,000**

with vc in m/min, ap and fn in mm, kc in N/mm² and Pc in kW. The constant 60,000 converts metres per minute to metres per second and watts to kilowatts.

This is an illustration. The heaviest turning passes on the flange are the spigot roughing passes on operation 20, at vc = 220 m/min, ap = 2.475 mm and fn = 0.25 mm/rev.

- Fc = 2406 × 2.475 × 0.25 = **1,489 N**
- Pc = 220 × 2.475 × 0.25 × 2406 ÷ 60,000 = **5.46 kW**

Two further allowances turn net cutting power into the power the motor must supply:

- **Machine efficiency.** Power is lost in belts, gears and bearings. With an assumed efficiency of 80%, the motor must supply 5.46 ÷ 0.8 = 6.82 kW.
- **Tool wear.** A worn edge increases cutting force. Machinery's Handbook, for example, applies tool wear factors mostly between about 1.1 and 1.3 for common operations, and higher for extra-heavy cuts. Planning around a fresh edge leaves no margin for the end of the tool's life.

```figure
type: formula
title: Power for the spigot roughing passes
formula: Pc = vc × ap × fn × kc ÷ 60,000
caption: With 80% machine efficiency the motor must supply 6.82 kW, before any allowance for tool wear.
- vc | 220 m/min
- ap, fn | 2.475 mm, 0.25 mm/rev
- kc | 2,406 N/mm² at h = 0.249 mm
step: Fc = 2,406 × 2.475 × 0.25 = 1,489 N
step: Pc = 220 × 2.475 × 0.25 × 2,406 ÷ 60,000 = 5.46 kW
step: Motor power = 5.46 ÷ 0.8 = 6.82 kW
```

## A quick check from removal rate

Because kc is energy per unit volume, power can also be found directly from the removal rate:

**Pc = Q × kc ÷ 60,000**

with Q in cm³/min, kc in N/mm² and Pc in kW. For the spigot roughing passes, Q = 220 × 2.475 × 0.25 = 136.1 cm³/min, so Pc = 136.1 × 2,406 ÷ 60,000 = 5.46 kW, the same as before.

This form is handy for a quick sense check. A rule of thumb for a given material, so many cubic centimetres per minute per kilowatt, follows directly: at a kc of about 2,400 N/mm², each kilowatt at the edge removes about 25 cm³/min. If a program claims a removal rate that would need more power than the machine has, the error shows up immediately.

## Allow for the worn edge and the losses together

The motor must deliver the net cutting power plus the machine's losses, and the cutting power itself rises as the tool wears. Applying both allowances to the spigot roughing passes, with a tool wear factor of 1.2 and a machine efficiency of 80%:

**5.46 × 1.2 ÷ 0.8 ≈ 8.19 kW**

That is half as much again as the net figure. A lathe with a 7.5 kW continuous rating would manage the cut with a fresh insert but could struggle near the end of the edge's life, which is exactly when an operator is least likely to be watching closely. Planning to the worn-tool figure, and checking it against the spindle's power at the actual speed from its power curve, avoids a cut that works at the start of a batch and stalls later.

## Spindle torque

Torque is power divided by angular speed:

**M = Pc × 9549 ÷ n**

with Pc in kW, n in rev/min and M in N·m. The constant 9,549 is 60,000 ÷ 2π.

At the start of the spigot roughing, the diameter is 110 mm and the spindle runs at 637 rev/min, so:

M = 5.46 × 9549 ÷ 637 = **81.9 N·m**

Torque is greatest at large diameters, where the spindle runs slowly for the same cutting speed. That is where machines most often run out of capacity.

## Reading a power and torque curve

A CNC lathe spindle motor typically delivers constant torque from zero up to a **base speed**, then constant power above it. Below base speed, the available power falls in proportion to speed.

Harbourline's lathe is assumed, for this example, to have an 11 kW spindle with 140 N·m of torque up to a base speed of 750 rev/min. The available power at any speed below base speed is 140 × n ÷ 9549 kW.

| Spindle speed | Available power | Comment |
|---|---|---|
| 300 rev/min | 4.40 kW | Torque-limited |
| 637 rev/min | 9.34 kW | Torque-limited, but enough for the 6.82 kW needed |
| 750 rev/min | 11.0 kW | Base speed |
| 1,000 rev/min | 11.0 kW | Constant power region |

The flange's roughing passes need 6.82 kW at 637 rev/min and the machine can supply 9.34 kW there, so the cut is within capacity with some margin for tool wear.

```figure
type: line
title: Available spindle power against the power the cut needs
x: Spindle speed (rev/min)
y: Power (kW)
legend: Available: 11 kW, 140 N·m to 750 rev/min | Needed for the roughing cut
ymin: 0
ymax: 12
mark: 637 | Ø110 at 220 m/min
mark: 350 | Ø200
caption: Below base speed the machine is torque-limited. The flange cut fits at 637 rev/min; the same cut on Ø200 at 350 rev/min would not.
- 0 | 0 | 6.82
- 300 | 4.40 | 6.82
- 350 | 5.13 | 6.82
- 637 | 9.34 | 6.82
- 750 | 11 | 6.82
- 1000 | 11 | 6.82
- 1500 | 11 | 6.82
```

Now consider roughing a Ø200 part on the same machine with identical cutting data. The spindle speed would be 1000 × 220 ÷ (π × 200) = 350 rev/min, where the machine can deliver only about 5.13 kW. The same cut, needing 6.82 kW at the motor, would exceed the available power.

Torque shows why slowing down does not help. The cutting force of 1,489 N acting at a radius of 0.1 m needs about 149 N·m at the spindle, or about 186 N·m from the motor at 80% efficiency. That exceeds the 140 N·m available at any speed below base speed. Reducing the cutting speed lowers the power required and the power available in the same proportion. The only remedy is a smaller chip area: less depth of cut or less feed. The power and torque curve, not the motor's headline rating, decides what a machine can do on large diameters.

## When power is short, choose what to give up

If the planned cut needs more power than the machine can supply, something must be reduced. Removal rate, and therefore power, is proportional to cutting speed, depth and feed, so reducing any one by a fifth reduces removal and power by roughly a fifth. They do not all cost the same.

```figure
type: compare
title: Two ways to cut the spigot roughing power by about a fifth
cols: Feed reduced to 0.20 mm/rev | Speed reduced to 176 m/min
caption: Both give the same 108.9 cm³/min. A thinner chip raises kc, so reducing feed saves less power for the same loss of removal.
- Removal rate | 108.9 cm³/min | 108.9 cm³/min
- Specific cutting force | About 2,545 N/mm² | About 2,406 N/mm²
- *Net cutting power | About 4.62 kW | About 4.37 kW
```

Reducing the feed thins the chip, which raises kc by about 6%, so the power falls less than the removal rate does. Reducing the cutting speed keeps the chip thickness and kc the same, so power falls in step with removal, and it also lengthens tool life, as Chapter 8 shows. Reducing the depth of cut, and taking an extra pass, likewise keeps kc unchanged but adds the non-cutting time of the extra pass. For a short cut like the flange's spigot, a lower speed is often the least costly choice; for a long cut, an extra pass may be cheaper than running the whole length slowly.

## Read the spindle load meter with care

Most CNC machines display spindle load as a percentage. It is a useful check on a power estimate, but only once its meaning is understood. The percentage is usually relative to the motor's rated output at the current speed, may include the losses in the drive, and on some machines refers to a short-term rating rather than the continuous one.

A practical way to calibrate it is to take a cut whose power has been calculated, such as a roughing pass with known depth, feed and speed, note the displayed load, and compare. Once the relationship is known, the meter becomes a quick tool for confirming that a new program loads the spindle as planned, and for noticing when a familiar job starts drawing more power than usual, a common early sign of a worn tool or a change in the material.

## Milling power

For milling, the same principle applies with the milling removal rate:

**Pc = ap × ae × vf × kc ÷ (60 × 10⁶)**

with ap and ae in mm, vf in mm/min and kc in N/mm². The specific cutting force should be evaluated at the **mean** chip thickness, which for light radial engagement is approximately fz × √(ae ÷ D) for a cutter with a 90° entering angle. Suppliers give a more exact formula.

For the end-milling example in Chapter 4, at fz = 0.121 mm, ae = 2 mm, D = 16 mm, ap = 20 mm and vf = 1,733 mm/min:

- Mean chip thickness ≈ 0.121 × √(2 ÷ 16) = 0.043 mm
- kc ≈ 1700 × 0.043^(−0.25) ≈ 3,738 N/mm²
- Pc ≈ 20 × 2 × 1733 × 3738 ÷ 60,000,000 ≈ **4.32 kW**

The thin chips of light radial engagement raise kc substantially. This is part of the trade-off in high-efficiency milling strategies: the removal rate per kilowatt is lower than in heavy slotting, but the cutter, spindle and part see lighter, steadier loads.

## Comparing materials

Specific cutting force varies widely between materials. Aluminium alloys need much less energy per unit volume than steels, which is one reason they are machined at high removal rates on relatively light machines. Stainless steels and heat-resistant alloys need more, and they also concentrate heat at the edge. Hardened steels need more again. Always use material-specific data from the tool supplier; a power estimate is only as good as its kc.

## Forces beyond the tangential force

The tangential force does most of the work, but two other components matter:

- The **feed force** acts along the feed direction and loads the slides and ball screws.
- The **passive** or radial force pushes the tool away from the work. It does little work but causes most of the deflection, as the next chapter shows. It grows with nose radius and with entering angles below 90°.

For a typical turning cut, the feed and radial forces are often in the range of a third to a half of the tangential force each, varying with tool geometry. They are the reason slender parts and long boring bars are difficult.

## Common mistakes

- **Using one kc for every feed.** Thin chips need more energy per volume.
- **Checking power against the motor rating** instead of the power available at the actual spindle speed.
- **Forgetting efficiency and tool wear.**
- **Ignoring torque on large diameters.**
- **Treating milling at light engagement like slotting** when estimating power.

## Questions to ask

- What is the chip thickness for this cut, and what kc does that give for this material?
- What power and torque does the machine actually deliver at the planned spindle speed?
- Is there margin for a worn tool at the end of its life?
- Which cuts in the job need the most torque, and on which diameters?

## Exercise: check your heaviest cut

Find the heaviest roughing cut in a program you run. Calculate the chip thickness, kc, cutting force, net power, motor power with an assumed efficiency and spindle torque. Compare them with your machine's power and torque curve from its manual. Note how much margin remains for tool wear.

Power is only one limit. The next chapter looks at another that often bites first: deflection of the tool and workpiece, and the vibration known as chatter.
