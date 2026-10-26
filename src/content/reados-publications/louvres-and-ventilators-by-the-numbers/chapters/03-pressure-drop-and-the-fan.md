---
book: louvres-and-ventilators-by-the-numbers
chapterSlug: pressure-drop-and-the-fan
order: 3
title: "Pressure drop and the fan"
description: "Estimate the pressure lost through PR-30's intake louvre, mesh and exhaust louvre, scale catalogue data correctly, and find where the wall fans actually operate, with the right louvre and a small one."
draft: false
---

Air does not pass through a louvre for free. It speeds up to squeeze between the blades, turns, slows down again and loses some of its energy in eddies on the way. The loss appears as a **pressure drop**: the room behind an intake louvre sits a little below outdoor pressure, and the fans that move the air must make up the difference. Louvres are small items in a ventilation system, but in a plant room with no ductwork they are often most of the resistance the fans see, and an undersized louvre quietly steals airflow from fans that were selected correctly.

This chapter estimates the pressure lost through PR-30's intake louvre, its bird mesh and its exhaust louvre, shows how to scale a catalogue's pressure data to a different velocity, finds where the two wall fans actually operate, and repeats the exercise with a louvre that is too small. The failure case is that small louvre, and the hot afternoons that followed.

## Velocity pressure and loss coefficients

The kinetic energy of moving air, expressed as a pressure, is its **velocity pressure**: half the air's density times the square of its velocity. Most fittings, louvres included, lose a roughly constant multiple of the velocity pressure, called the **loss coefficient** K, so their pressure drop rises with the square of the velocity. *Ductwork by the Numbers* develops the same idea for duct fittings in [Fittings and velocity pressure](/reados/publications/ductwork-by-the-numbers/fittings-and-velocity-pressure/).

```figure
type: formula
title: Pressure drop across PR-30's intake louvre
formula: velocity pressure = ½ρv²        pressure drop = K × velocity pressure
caption: This is an illustration. K is referred to the free-area velocity and is a teaching value for a drainable single-bank louvre. Real louvres are selected from the maker's tested pressure-drop data, which already includes their K.
- Free-area velocity, v | 3.89 ÷ 1.638 ≈ 2.37 m/s
- Air density at 35 °C, ρ | about 1.15 kg/m³
- Velocity pressure | ½ × 1.15 × 2.37² ≈ 3.24 Pa
- Loss coefficient, teaching value | K = 4.0
- Pressure drop | 4.0 × 3.24 ≈ 13.0 Pa
step: The room sits about 13 Pa below outdoor pressure from the louvre alone
```

### Scaling catalogue data

Louvre makers publish pressure drop against free-area velocity, usually as a curve or a table. Because pressure drop varies with the square of velocity, a single catalogue point can be scaled to another velocity: **Δp₂ = Δp₁ × (v₂ ÷ v₁)²**. If a catalogue showed a louvre losing 20 Pa at 3.0 m/s, at PR-30's 2.37 m/s it would lose about **20 × (2.37 ÷ 3.0)² ≈ 12.5 Pa**. The scaling is only valid within the range the maker tested and only if the velocity used is the same kind, free-area velocity, as the catalogue's. Mixing a face velocity with a free-area chart is the pressure-drop version of Chapter 1's failure.

## The pressure budget

The air entering PR-30 passes through the intake louvre, then through bird mesh fixed behind it, across the room, and out through the fans and the exhaust louvre. The room itself, a large open space, loses next to nothing. The fans must overcome the sum of the losses at the flow they deliver.

```figure
type: bars
title: PR-30's pressure budget at the design flow of 3.89 m³/s
unit: Pa
max: 16
caption: This is an illustration with teaching loss coefficients: 4.0 for the intake louvre, about 0.62 for the bird mesh behind it, both on the intake's free-area velocity of 2.37 m/s, and 2.0 for the exhaust louvre on its own free-area velocity of 2.78 m/s. Chapter 5 works out the mesh more carefully.
- *Intake louvre | 13.0
- Bird mesh | 2.0
- Room | 0
- Exhaust louvre | 8.9
```

The intake louvre is the largest single item, which is typical of a plant room without ductwork, and it is also the item most often changed by a builder looking for savings. The exhaust louvre loses less because its loss coefficient is lower: its blades are motorised flat blades that open to near horizontal, presenting less obstruction than the intake's fixed drainable blades, even though its free-area velocity is higher. In a system with ducts, filters and attenuators, the louvres would be a smaller share of a larger total, but they would still be worth calculating, because an undersized louvre at the end of a well-designed duct system can undo it.

The total is about **23.9 Pa**. Each component's loss scales with the square of the flow through it, so the whole system has a **system curve**: pressure equals a constant times the flow squared. For PR-30 the constant is about 23.9 ÷ 3.89², or **1.58 Pa per (m³/s)²**.

## Where the fans operate

A fan does not deliver a fixed flow. It delivers more air against a low pressure and less against a high one, along its **fan curve**, published by its maker. PR-30's two wall fans are propeller fans, which are cheap and move a lot of air at low pressure but lose flow quickly as the pressure rises. Their teaching curve, for each fan, is about **2.2 m³/s** at 0 Pa, **1.95 m³/s** at 25 Pa, **1.6 m³/s** at 50 Pa and **1.1 m³/s** at 75 Pa.

With two identical fans side by side, discharging into the same room, the pair delivers twice one fan's flow at any pressure. The system operates where the pair's curve meets the system curve. *Ductwork by the Numbers* explains system and fan curves in [Fans, system curves and the fan laws](/reados/publications/ductwork-by-the-numbers/fans-system-curves-and-the-fan-laws/).

```figure
type: compare
title: PR-30's operating point with the right louvre and a small one
cols: Intake free area | System pressure | Flow from both fans | Room temperature rise | Room suction on the door
caption: This is an illustration, solved numerically from the teaching fan curve and loss coefficients. The door load is the intake-side suction times a 0.9 × 2.1 m door.
- *Intake louvre as designed | 1.638 m² | about 24 Pa | about 3.92 m³/s | about 7.95 K | about 29 N
- Intake louvre too small | 1.0 m² | about 40 Pa | about 3.49 m³/s | about 8.9 K | about 61 N
```

With the louvre as designed, the fans settle at about **3.92 m³/s** against about **24 Pa**, slightly more than the 3.89 m³/s needed, and the room runs about **7.95 K** above outdoor temperature. The design works because the louvre losses were included when the fans were selected.

With an intake louvre of only 1.0 m² free area, the free-area velocity rises, the intake's loss rises with its square, and the system curve steepens. The fans slide back along their curve to about **3.49 m³/s** at about **40 Pa**. The temperature rise needed to carry 36 kW in that smaller flow is about **8.9 K**: the room runs nearly a degree hotter than designed, on exactly the days when there is no margin to spare.

## The room's pressure and its door

An intake louvre's pressure drop is also the suction in the room, because the room lies between the intake and the fans. With PR-30's louvre as designed, the intake louvre and mesh together lose about 15 Pa, so the room sits about 15 Pa below outdoor pressure, and a 0.9 × 2.1 m external door opening outwards carries about **29 N** of extra load holding it shut. That is noticeable but manageable.

With the small louvre, the suction doubles to about 32 Pa and the door load to about **61 N**. The door becomes hard to open, slams when released, and its seals whistle. Staff then prop it open for air, which wrecks the designed airflow path and the security of the plant room. A door that is hard to open is often the first visible sign of an undersized intake.

## Wind on the walls

The pressure budget above assumes still air outside. Wind changes it. Wind blowing onto a wall raises the pressure at its face above the free-stream static pressure; on the sheltered, leeward side of the building the pressure falls below it. The rise or fall is a **pressure coefficient**, Cp, times the wind's velocity pressure. For a moderate 5 m/s breeze, the velocity pressure is about **½ × 1.15 × 5² ≈ 14.4 Pa**. With teaching coefficients of +0.7 on a windward wall and −0.3 on a leeward wall, the windward wall face sits about **10.1 Pa** above still-air pressure and the leeward face about **4.3 Pa** below it.

Those numbers are the same size as the louvre losses. If PR-30's south intake faces into a southerly breeze and the east exhaust is sheltered, the wind pushes air through the room with about 14 Pa of help, and the fans deliver more than the design flow. If the wind swings round to blow onto the east exhaust wall while the south wall is sheltered, it opposes the fans by a similar amount, and on a hot day with a strong easterly the room may run warmer than designed. Fans selected with no margin are at the mercy of the wind; a propeller fan's steep curve makes it particularly sensitive. Real pressure coefficients depend on the building's shape and the wind direction, and AS/NZS 1170.2 and wind engineering texts give them for design. For a plant room, the practical rules are to put intake and exhaust on walls that are rarely in opposite wind conditions where that is possible, to discharge exhaust upwards where wind can do least harm, and to keep some margin in the fan selection.

## Measuring at commissioning

Calculated pressures and flows are predictions. At commissioning they are measured. Room suction is measured with a digital manometer, one tube in the room and the other outside, through a gap at a closed door. Flow is best measured where it is concentrated and steady: across the exhaust fan's discharge or the exhaust louvre, with a vane anemometer moved over a grid of points and averaged, multiplied by the area on which the anemometer read, which is normally the face area just in front of the louvre, not its free area. The free-area velocity is then worked out from the measured flow. Measurements on a windy day are noted as such, and repeated in still conditions if they disagree with the design.

## Noise

Air rushing between blades makes noise, and the noise rises steeply with velocity. Louvre makers publish sound data for their products at given free-area velocities; for most plant rooms, intake velocities around PR-30's are quiet enough beside the compressors themselves, which are far louder. Where a plant room sits next to offices or a boundary with neighbours, the louvre may need to be an acoustic louvre, whose deep lined blades reduce the noise from the plant inside but have higher pressure drops and lower free areas, so the louvre must be larger again. Acoustic design is beyond this book; the point here is that noise is another reason to keep free-area velocities modest.

## Including the louvres in the fan selection

The general lesson is that the louvres are part of the fan system, not accessories added after it is designed:

- calculate each louvre's free-area velocity and pressure drop from the maker's data at the design flow;
- add the mesh, any filters, any dampers and any ductwork;
- select fans whose curve delivers the design flow against the total;
- check the room suction on doors, and on any gas appliance flue in the room, which a strongly depressurised room can draw back down;
- leave a margin for mesh that is partly blocked, which Chapter 5 quantifies.

## A failure case: the small louvre

This is an illustration. On an earlier compressor room with the same heat load, the builder substituted a cheaper louvre for the one specified, the same 2,400 × 1,500 mm size but with closely spaced blades and a free area of only about 1.0 m². Nobody recalculated anything; the louvre fitted the opening.

In the first hot spell, the compressors began tripping on high temperature in the late afternoon. The fan contractor was called and measured the fans' flow with a vane anemometer across the exhaust louvre: about 3.5 m³/s instead of 3.9. The fans were running as their curve said they would against about 40 Pa, so the fans were not faulty. The detection pointed back to the system: the room's suction, measured with a manometer through the door's keyhole gap, was over 30 Pa.

The correction was to replace the louvre with one of the specified free area. The shop's procedure now includes a free-area and pressure check on every louvre substitution, and the commissioning sheet records the room suction and the measured exhaust flow as well as the fan speeds.

## How this applies to a small Australian business

Calculate each louvre's pressure drop from its maker's data at its free-area velocity, and scale catalogue figures by the square of the velocity ratio, using the same kind of velocity the catalogue uses. Add up the whole path, louvres, mesh, filters, dampers and ducts, and select fans whose curve meets the system curve at the design flow. Check the room's suction on its doors and on any flued appliances. Treat a louvre substitution as a design change, and measure flow and room suction at commissioning.

## Exercise: one fan running

On a mild day only one of PR-30's wall fans runs. With the louvres as designed and the teaching fan curve, roughly what flow does one fan deliver, and what heat can it carry away at an 8 K rise? Use the system curve Δp = 1.58 Q² and the fan points at 0 and 25 Pa, assuming the fan curve is straight between them.

**Worked answer.** With one fan, the operating point lies on the fan curve between 2.2 m³/s at 0 Pa and 1.95 m³/s at 25 Pa. Try Q = 2.12 m³/s: the system needs **1.58 × 2.12² ≈ 7.1 Pa**, and the fan curve at 7.1 Pa gives **2.2 − 0.25 × 7.1 ÷ 25 ≈ 2.13 m³/s**, close enough. One fan delivers about **2.13 m³/s**. At an 8 K rise that carries **2.13 × 1.15 × 1.006 × 8 ≈ 19.7 kW**, a little over half the full heat load: enough for one compressor and the dryer at moderate load, which is why the second fan starts as the room warms.
