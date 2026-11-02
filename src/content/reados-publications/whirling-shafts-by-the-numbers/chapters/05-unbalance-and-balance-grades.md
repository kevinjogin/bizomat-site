---
book: whirling-shafts-by-the-numbers
chapterSlug: unbalance-and-balance-grades
order: 5
title: "Unbalance and balance grades"
description: "What unbalance is, the rotating force it makes, how balance quality grades turn a rotor's mass and speed into a permissible residual unbalance, and what one lost hammer does to a hammer mill."
draft: false
---

Chapters 1 to 4 kept the rotor away from its critical speed so that its unbalance would not be amplified. This chapter turns to the unbalance itself: what it is, how big a rotating force it makes, and how much of it a rotor may be allowed to keep. The answer to the last question is a balance quality grade, a single number that lets a designer, a balancing shop and a maintenance technician agree on what "balanced" means for a particular rotor at a particular speed.

The chapter applies a KEVOS® tool to the HM-30's rotor, shows why the export variant needs a tighter tolerance in grams even at the same grade, and describes the day an HM-30 lost a hammer.

## Unbalance

A rotor is unbalanced when its mass is not evenly distributed about its axis of rotation. The simplest description is a single small mass m at a radius r: the unbalance is U = m × r, usually stated in gram-millimetres (g·mm). The same unbalance can also be expressed as the whole rotor's centre of mass sitting a small distance e from the axis: U = M × e, where M is the rotor's mass and e is the specific unbalance or eccentricity, in micrometres (because g·mm per kg is µm).

When the rotor turns at angular speed ω, the unbalance produces a rotating force:

F = U × ω², with U in kg·m and ω in rad/s

The force grows with the square of the speed. A rotor that runs smoothly at half speed can shake at full speed with nothing changed but the speed.

### Static, couple and dynamic unbalance

Unbalance has a position along the rotor as well as a size and an angle, and that leads to three kinds:

```figure
type: compare
title: Three kinds of unbalance
cols: What it looks like | How it shows | How it is corrected
rowhead: Kind
- Static | the centre of mass is off the axis, but the rotor's principal axis is parallel to it | the rotor rolls to a heavy-side-down position on knife edges; bearings move in phase | one correction mass in one plane, opposite the heavy side
- Couple | the centre of mass is on the axis, but the principal axis is tilted | does not show on knife edges at all; bearings move in opposite phase when spinning | two equal and opposite corrections in two planes
- * Dynamic | any combination of the two, the usual case | bearings move with different sizes and phases | corrections in two planes, each with its own size and angle (Chapter 7)
caption: A narrow rotor, whose length is small compared with its diameter, can usually be treated as having static unbalance only and balanced in one plane (Chapter 6). A long rotor like the HM-30's needs two planes.
```

## Balance quality grades

How much unbalance is acceptable? A heavier rotor can tolerate more unbalance in gram-millimetres, because the same unbalance moves its centre of mass less. A faster rotor can tolerate less, because the force rises with the square of the speed. The balance quality grade combines both in one number:

```figure
type: formula
title: Balance quality grade and permissible residual unbalance
formula: G = e × ω, with e in mm and ω in rad/s, so G is in mm/s
formula: Permissible specific unbalance: e_per = G ÷ ω
formula: Permissible residual unbalance: U_per = e_per × M
caption: The grade G is the speed at which the rotor's centre of mass travels round its tiny orbit. Grades run in steps of about 2.5: G 0.4, G 1, G 2.5, G 6.3, G 16, G 40 and so on; a smaller number is a finer balance. For two correction planes with the centre of mass midway, the permissible unbalance is shared equally.
- G | balance quality grade, mm/s
- e_per | permissible eccentricity of the centre of mass, µm when U is in g·mm and M in kg
- M | rotor mass, kg
- ω | maximum service speed, rad/s
```

The grades and the method of allocating the permissible unbalance between correction planes are set out in the international standard ISO 21940-11, which also gives example grades for many kinds of machine. A designer chooses the grade for a rotor from the machine's duty, the maker's experience and any customer specification; the standard's examples are a starting point, not a requirement. The HM-30's maker specifies G 6.3 for the complete rotor with its hammers, a choice made for this case from the maker's own test experience.

The grade has a useful property. Because the permissible eccentricity falls in proportion to speed, the permissible unbalance force rises only in proportion to speed, not with its square: F_per = M × e_per × ω² = M × G × ω. A grade therefore means roughly the same smoothness at any speed.

## The HM-30 rotor's tolerance

The KEVOS® [Permissible residual unbalance (balance grade)](/tools/balance-grade/) tool calculates the permissible residual unbalance and specific unbalance of a rigid rotor from its mass, maximum service speed and balance quality grade, for one correction plane or two with an equal share. It also gives the correction mass that the permissible unbalance per plane represents at a radius of 100 mm, and it compares a measured residual unbalance with the tolerance if you enter one. Its guide notes that it applies to rigid rotors only, and that the equal share between two planes applies only when the centre of mass is midway between them.

This is an illustration. For the HM-30's 180 kg rotor at 2,950 rpm, 308.9 rad/s, balanced in two planes:

```figure
type: compare
title: HM-30 rotor tolerances at three balance grades, 2,950 rpm, 180 kg, two planes
cols: Permissible eccentricity, µm | Permissible unbalance, g·mm | Per plane, g·mm | Per plane as a mass at 100 mm, g | Rotating force at the tolerance, N
rowhead: Grade
- G 2.5 | 8.09 | 1,457 | 728 | 7.3 | 139
- * G 6.3 | 20.39 | 3,671 | 1,835 | 18.4 | 350
- G 16 | 51.79 | 9,323 | 4,661 | 46.6 | 890
caption: This is an illustration. The rotating force is the force the whole permissible unbalance would produce at 2,950 rpm on a rigid shaft; the rotor's weight is 1,765 N for comparison.
```

At G 6.3, the rotor may keep 3,671 g·mm of unbalance, 1,835 g·mm in each plane. On the HM-30's correction radius of 250 mm (Chapter 7), that is 7.3 g per plane: less than the weight of a single washer, on a rotor of 180 kg. The rotating force it produces is 350 N, a fifth of the rotor's weight, before any amplification from the critical speed.

### The export variant

This is an illustration. The 60 Hz export variant runs at 3,550 rpm, 371.8 rad/s. At the same grade, G 6.3, its permissible eccentricity is 6.3 ÷ 371.8 = 16.95 µm, and its permissible unbalance is 3,050 g·mm, 17% less than the 50 Hz rotor's. If an export rotor were balanced only to the 50 Hz tolerance of 3,671 g·mm, it would produce 507 N at 3,550 rpm, 20% more than the 422 N its grade allows. The balancing shop's work instruction therefore states the tolerance for each variant in gram-millimetres, and the rotor's nameplate states its maximum service speed.

```figure
type: bars
title: Permissible unbalance per HM-30 rotor at G 6.3
unit: g·mm
caption: This is an illustration. Same grade, same rotor mass; the faster rotor's tolerance is smaller in proportion to its speed.
- 50 Hz, 2,950 rpm | 3671
- * 60 Hz export, 3,550 rpm | 3050
```

### Balance and critical speed work together

The 350 N in the table is the force on a perfectly rigid shaft. The HM-30's shaft is not rigid: running at 72.3% of its critical speed, it whirls with a radius about 1.1 times the eccentricity (Chapter 1), so the force the bearings feel is about 2.1 times the rigid-shaft value, roughly 730 N. That is the reason Chapters 1 to 4 matter to balancing as well. The same rotor, balanced to the same grade, would put about 1,840 N on its bearings if it ran at 90% of critical, like the prototype, and about 1,250 N on the mezzanine of Chapter 4. A balance grade and a critical speed margin are two halves of one requirement, and neither is enough without the other.

### Keys, fits and temperature

A rotor balanced on a machine is not quite the rotor that runs in service, and three details commonly undo good balancing work.

- **Keys.** A shaft with a keyway, balanced without a key, and then fitted with a coupling hub and a full-length key, carries the key's mass on one side. The usual convention is to balance shaft and hub each with a half-key in its keyway, so that the full key fitted at assembly restores the balance. The convention is set out in ISO 21940-32; whatever convention is used, the balancing shop and the assembler must use the same one.
- **Fits.** A disc or hub that is loose on its shaft can shift off centre in service, changing the balance with every start. The HM-30's disc pack is clamped axially and keyed, so it cannot shift.
- **Temperature and material.** Grain dust packed into the rotor, moisture swelling a build-up, or a rotor that heats unevenly all change the balance after the balancing machine has done its work. Cleaning and inspection are part of keeping a rotor balanced.

## Where a hammer mill's unbalance comes from

A hammer mill is an unusual rotor, because part of its mass, the hammers, is meant to move. Each hammer swings freely on its pin and, at speed, stands straight out radially under centrifugal force. Its contribution to the balance depends on its mass and where it hangs. The main sources of unbalance in the HM-30 are:

- **The disc pack and pins:** machining and assembly errors, balanced out on a balancing machine before the hammers are fitted;
- **Hammer mass differences:** hammers are cast or cut in batches and differ by a few grams, so the maker supplies them in weighed, matched sets (Chapter 7);
- **Wear:** hammers wear at their tips, and if they wear unevenly, or are turned or replaced unevenly, the balance changes;
- **Material build-up:** damp grain or molasses packed into one side of the rotor;
- **Damage:** a broken or lost hammer.

The sizes involved are worth a moment's arithmetic. This is an illustration. A lump of 200 g of damp meal packed against one side of the rotor at a radius of 200 mm is an unbalance of 40,000 g·mm, eleven times the whole rotor's tolerance at G 6.3. A set of twelve hammers on one pin that weighs 20 g more than the set opposite, at 230 mm, adds 4,600 g·mm, more than the whole tolerance on its own. By comparison, the residual left by the balancing machine on the bare disc pack is a few hundred gram-millimetres. In a hammer mill, keeping the balance is mostly a matter of maintenance discipline, not of machining accuracy.

## The error: a lost hammer

This is an illustration. An HM-30 on a farm had run for two years with its hammers turned once and never replaced. One morning a hammer, worn thin near its pin hole, broke at the hole and was thrown through the screen. The mill kept running. The operator heard a change in its note and felt the frame shaking, but finished the batch before stopping it. A week later the drive-end bearing failed.

A single 0.75 kg hammer, hanging with its centre of mass about 230 mm from the axis, is an unbalance of 750 × 230 = 172,500 g·mm when it is lost. That is 47 times the whole rotor's permissible unbalance at G 6.3. At 2,950 rpm it produces a rotating force of 0.1725 kg·m × 308.9² = 16.5 kN, more than nine times the rotor's own weight, spinning round 49 times a second.

```figure
type: compare
title: The HM-30 rotor before and after losing one hammer
cols: Unbalance, g·mm | Multiple of the G 6.3 tolerance | Rotating force at 2,950 rpm, N
rowhead: Condition
- Balanced to G 6.3, at the tolerance | 3,671 | 1 | 350
- * One 0.75 kg hammer lost at 230 mm | 172,500 | 47 | 16,462
caption: This is an illustration. The rotating force is calculated on a rigid shaft; the real bearing force is larger still, because the shaft deflects and amplifies it (Chapter 1). Nine times the rotor's weight, reversing direction 49 times a second, wrecked a bearing within a week.
```

The investigation produced three changes. The maker added a vibration switch to the HM-30's standard specification, wired to stop the motor at a set level, because a lost hammer can never be acceptable running. The operating manual now tells operators to stop the mill immediately if its sound or vibration changes. And the maintenance instructions require hammers to be replaced as complete weighed sets, and turned or replaced on opposite pins together, so that the balance of the rotor is preserved; Chapter 7 shows how much difference a mismatched set makes.

## Balancing is a measurement as well as a correction

A balance grade is only meaningful if the residual unbalance is measured. A balancing machine spins the rotor on flexible or force-measuring supports at a speed well below its critical speed and reads the size and angle of the unbalance in each correction plane. The HM-30's maker balances the bare disc pack and pins on such a machine to well inside G 6.3, fits weighed hammer sets, checks the complete rotor again, and records the residual unbalance in each plane on the rotor's test record. The record is the evidence that the rotor met its grade; without it, "balanced" is an opinion.

Balancing machines come in two broad kinds. A soft-bearing machine supports the rotor on springs so flexible that the rotor and supports have their own natural frequency well below the balancing speed; the machine reads the displacement of the supports, which then depends mainly on the unbalance and the rotor's mass. A hard-bearing machine holds the rotor in stiff supports, far above the balancing speed, and reads the force on them, which depends only on the unbalance and the speed, so it can be calibrated once for any rotor. Either way the machine needs to know the geometry: the positions of the two bearings and the two correction planes along the rotor, and the correction radius, so that it can resolve its readings into the unbalance in each correction plane.

The balance-grade tool's measured-residual input exists for exactly that check: enter the balancing machine's reading per plane, and it reports whether the rotor is within tolerance.

## Exercise: a G 2.5 export rotor

This is an illustration. A customer with a sensitive installation asks for an export rotor balanced to G 2.5 at 3,550 rpm.

1. What are the permissible eccentricity and the permissible unbalance per plane, with two equal planes?
2. What correction mass does that represent at the HM-30's 250 mm correction radius?
3. The balancing machine reads 640 g·mm in plane A and 590 g·mm in plane B. Does the rotor pass?
4. What will happen to that balance once the rotor's hammers start to wear?

**Worked answer.**

1. e_per = 2.5 ÷ 371.8 = **6.72 µm**; U_per = 6.72 × 180 = 1,210 g·mm, so **605 g·mm per plane**.
2. 605 ÷ 250 = **2.4 g** per plane.
3. Plane A, 640 g·mm, is **over** the 605 g·mm tolerance; plane B, 590 g·mm, is within it. The rotor **does not pass** until plane A is corrected.
4. Uneven hammer wear and material build-up will take the rotor out of a G 2.5 tolerance quickly. A grade that fine is only worth specifying if the customer will also rebalance after each hammer change, which should be agreed and priced before the order is accepted.
