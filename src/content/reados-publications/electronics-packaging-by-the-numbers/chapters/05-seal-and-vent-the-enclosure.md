---
book: electronics-packaging-by-the-numbers
chapterSlug: seal-and-vent-the-enclosure
order: 5
title: "Seal and vent the enclosure"
description: "Read the IP code, size a lid gasket and its screw spacing, account for the vacuum a cooling enclosure pulls, and use a membrane vent so the seal is not fighting the weather."
draft: false
---

A sealed enclosure has to keep water and dust out in conditions that try hard to get them in. The obvious threats are rain, hose jets and immersion. A quieter one comes from the enclosure itself. A box that heats up in the sun and is then cooled suddenly by rain or a hose pulls a partial vacuum, and that vacuum draws moist air and water through any weakness in the seal. Many enclosures that pass a laboratory immersion test fail in the field for this reason.

This chapter reads the IP code properly, designs the gearbox monitor's lid seal and screw spacing with numbers, calculates the pressure difference a cooling enclosure creates and shows why a membrane vent is usually part of a good seal design, not a compromise of it.

## What the IP code says, and what it does not

IEC 60529 defines the IP code, published in Australia as AS 60529. The code has two characteristic digits after the letters IP. The first describes protection against solid objects and dust, and the second against water. Optional letters can follow for specific additions. In headline terms:

- A first digit of **5** means dust-protected: some dust may enter, but not enough to interfere with operation. A first digit of **6** means dust-tight.
- A second digit of **5** covers water jets and **6** covers powerful water jets. **7** covers temporary immersion and **8** continuous immersion, under conditions stated by the manufacturer that are more severe than for 7.

The standard defines the test for each digit. Those conditions are not quoted here, and a real design is tested to the current edition by a laboratory.

Two points about the code matter most for design. First, as Chapter 1 showed, the immersion digits do not automatically cover jets, so a product that must survive both is dual coded, for example IP66/IP67, and tested for both. Second, the IP code describes a test on a new product at the test laboratory. It says nothing about ultraviolet ageing, compression set after years of heat, thermal cycling or the vacuum effect described below. A product can hold a valid IP rating and still leak in its second summer. The design must address those mechanisms directly, and Chapter 9's test plan adds tests for them.

## The gearbox monitor's seal

This is an illustration. The polycarbonate lid closes onto a groove in the rim of the aluminium base. The seal is a solid silicone cord, chosen for its wide temperature range and resistance to compression set, laid in the groove and joined at a scarf joint.

- Cord diameter **2.5 mm**.
- Groove width **3.2 mm** and depth **1.9 mm**, machined in the casting's rim.
- Nominal compression **2.5 − 1.9 = 0.6 mm**, which is **0.6 ÷ 2.5 = 24%** of the cord diameter.
- Groove fill: the cord's cross-section is **π ÷ 4 × 2.5² ≈ 4.91 mm²** and the groove's is **3.2 × 1.9 = 6.08 mm²**, a fill of about **81%**. The space left allows the cord to deform without being forced out of the groove and leaves room for thermal expansion.

The squeeze and fill targets were taken from the seal supplier's gland design table for this cord section and material. Different suppliers and materials give different ranges, and this book does not quote one. What matters for the mechanical designer is that the squeeze must stay within the supplier's range everywhere around the seal, including midway between the lid screws, at the joint and at both temperature extremes.

## The lid must stay flat between screws

A gasket pushes back on the lid. Midway between two screws the lid is unsupported, so it bows upwards under the gasket's reaction, and the compression there is less than at the screws. If the bow approaches the 0.6 mm of nominal compression, the seal at midspan barely touches.

A conservative check treats the lid's flange between two screws as a beam fixed at both screws and loaded by the gasket's reaction along its length. This is an illustration. The seal supplier's compression-load data for this cord at 24% squeeze gives a line load of about **2 N/mm** (an assumed figure here). The lid flange is a strip 10 mm wide. Polycarbonate's modulus is taken as **2,400 MPa**.

For a beam fixed at both ends under uniform load, the midspan deflection is **δ = w × L⁴ ÷ (384 × E × I)**, with **I = b × t³ ÷ 12**.

```figure
type: bars
title: Lid flange bow between screws, gasket at 24% squeeze
unit: mm
max: 1.4
caption: This is an illustration using an assumed 2 N/mm gasket load and a fixed-ended beam model. The team's limit was 0.15 mm, a quarter of the 0.6 mm compression. The first design with corner screws only bowed about 6.3 mm on its long side and is off this scale.
- 3 mm flange, 50 mm span | 0.603
- 4 mm flange, 50 mm span | 0.254
- 4 mm flange, 45 mm span | 0.167
- *5 mm flange, 50 mm span | 0.130
- *5 mm flange, 45 mm span | 0.085
```

The first concept had a screw at each corner only. On the long side that left a span of about 90 mm, and the model gave **δ = 2 × 90⁴ ÷ (384 × 2,400 × 22.5) ≈ 6.3 mm** for a 3 mm flange. That is ten times the compression, which means the seal would only be squeezed near the corners. The beam model exaggerates once the lid lifts off the gasket, because the gasket then stops pushing, but the conclusion is not in doubt.

The team set a limit of **0.15 mm** of bow, a quarter of the nominal compression. The final design has **six screws**, adding one at the middle of each long side, so the spans are about 45 mm on the long sides and 50 mm on the short sides. The flange is thickened locally to **5 mm**, giving bows of about **0.085 mm** and **0.130 mm**. The rest of the lid stays 3 mm thick. A stiffening rib along the inside of the flange would do the same job with less material, and it is shown on the drawing as an option for the toolmaker.

## Heat, cold and the vacuum in the box

Now consider what happens on a hot afternoon. Chapter 4 found the enclosure at around 60 °C to 70 °C in sun. Suppose a summer storm or the weekly hose-down cools it quickly to about 20 °C. If the enclosure were perfectly rigid and sealed, the air inside would cool at constant volume, and its pressure would fall in proportion to its absolute temperature.

```figure
type: formula
title: Pressure inside a sealed enclosure cooled from 70 °C to 20 °C
formula: p₂ = p₁ × T₂ ÷ T₁        F = Δp × A
caption: This is an illustration. It assumes a rigid, perfectly sealed box sealed at 101.3 kPa when hot. A real lid flexes slightly, which reduces the pressure difference but adds a load cycle on the seal.
- p₁ | 101.3 kPa absolute when hot
- T₁, T₂ | 343.15 K and 293.15 K
- A | lid area, 0.110 × 0.070 = 0.0077 m²
step: p₂ = 101.3 × 293.15 ÷ 343.15 ≈ 86.6 kPa
step: Δp ≈ 101.3 − 86.6 ≈ 14.8 kPa below the outside
step: F ≈ 14,800 × 0.0077 ≈ 114 N pressing the lid inwards
```

A pressure difference of about 15 kPa is the same as the pressure at the bottom of about 1.5 m of water. A seal that only has to resist a hose jet's momentary splash is now asked to resist a sustained suction, with water standing on the seal line from the very rain that caused the cooling. Any gap at the scarf joint, any midspan bow and any scratch on the sealing face will draw water in.

The cycle then repeats every day. The enclosure heats, the slightly raised internal pressure pushes some air out through the same small leak paths, and the cool-down pulls moist air and water back in. Engineers call this breathing or pumping. Each cycle is small, but it runs every day for years.

## Let it breathe through a membrane

The usual answer is a **pressure-equalising membrane vent**: a small plug or adhesive patch carrying a microporous membrane, often expanded PTFE, that lets air pass but blocks liquid water and dust. With a vent in place, the internal pressure follows the outside within seconds to minutes, so the seal never sees a sustained suction. Vent makers publish airflow, water-entry pressure and IP ratings for their products, and the vent's own rating must at least match the enclosure's.

For the gearbox monitor, a screw-in vent with a protective cap is fitted to a vertical face of the base, on the side away from the usual hose direction and above the M12 connector. Its position is chosen so that water runs off it rather than pooling, and the cap shields the membrane from a direct jet. The vent's thread and O-ring are designed into the base like any other sealed penetration.

A vent also helps with condensation. Air carries water vapour, and if the box cools below the air's dew point, the vapour condenses on the coldest surfaces, often the lid or the board. Air at **30 °C** and **80%** relative humidity, typical of a humid summer afternoon, has a dew point of about **26 °C**. A box sealed with that air inside and cooled to 20 °C will condense. The quantity is small, about **24 g/m³ × 150 cm³ ≈ 3.6 mg** of vapour in the free air volume, but without a vent, each day's pumping can add more and none can leave. With a vent, the internal humidity follows the outside, and moisture that condenses overnight can evaporate the next day. Products for persistently humid sites sometimes add a desiccant, which then needs a replacement interval.

## Every penetration is a seal

The lid is the largest seal, but it is not the only one. Every hole in the enclosure needs its own sealing design, and each is listed on the drawing with its seal type:

- **The M12 connector**, sealed with an O-ring under its flange, covered in Chapter 6.
- **The membrane vent**, sealed with its own O-ring on a spot-faced boss.
- **The lid screws.** On the gearbox monitor they pass through the lid outside the gasket line, so they are not seal paths. If a screw had to pass inside the gasket, it would need a sealing washer or a blind threaded insert.
- **Labels and windows.** An adhesive label carries no sealing duty. The polycarbonate lid is one moulding with its window, so there is no separate window seal.

Blind holes in the casting, such as the tapped holes for the board standoffs, must not break through the casting wall or the floor, because a porous or thin floor under a tapped hole is a hidden leak path. The base drawing specifies a minimum wall under each blind hole, and porosity is checked on first-article castings.

## Plastic lid, metal base

The lid and base expand at different rates. Polycarbonate's coefficient of linear expansion is roughly three times aluminium's, taken here as **65 × 10⁻⁶ /K** and **23 × 10⁻⁶ /K**, both typical values. Over the 110 mm length and a temperature change of 60 K, from a cold morning to a hot afternoon, the difference in growth is **110 × 60 × (65 − 23) × 10⁻⁶ ≈ 0.28 mm**.

The screw holes in the lid must allow that movement without forcing the lid to buckle, and the gasket must tolerate the lid sliding slightly across it. The gearbox monitor's lid holes are 0.5 mm larger in diameter than the screws, and the screws are shouldered so that their torque clamps against a metal shoulder rather than crushing the polycarbonate. The KEVOS® [Thermal Stress and Movement in Plastic–Metal Assemblies](/tools/plastic-thermal-mismatch/) calculator checks the same effect for other materials and lengths.

## A failure case: the box that passed and then leaked

This is an illustration. The first prototypes had the six-screw lid but no vent. They passed an in-house immersion trial and a hose trial when cool. The team then ran a sequence that mimicked a summer day: two hours on a hot plate with a lamp over the lid, then a two-minute hose-down, then rest, repeated over five days.

After the third cycle, droplets appeared on the inside of the lid, and after the fifth there was standing water in one corner of the base. Opening the unit showed a damp path at the scarf joint of the silicone cord, where the two ends had been cut slightly short and the groove was not filled.

The hot-to-cold cycle had pulled water through a gap that a cool immersion test, with no pressure difference, did not stress. The corrections were to change the seal to a cord moulded as a closed ring, eliminating the joint, and to add the membrane vent. The repeated sequence on new units showed no water after twenty cycles. The cycle is now part of the Chapter 9 test plan, because the IP tests alone would not have found the fault.

```figure
type: checklist
title: Seal design review for the gearbox monitor
caption: This is an illustration. Each line is checked on the drawing and again on the first production parts.
- Squeeze and groove fill within the seal supplier's range at both temperature extremes | 24% and 81% at nominal
- Lid bow between screws below the team's limit | six screws, 5 mm flange
- Seal formed as a closed ring, no cut joint | changed after the failure case
- Membrane vent with cap on a vertical face, rating at least that of the enclosure | above the M12 connector
- Sealing faces free of draft lines, porosity and paint | casting face machined
- ? Silicone compatibility with any cleaning chemicals used on site | site to confirm products
- x Relying on the IP test alone to prove the seal | add the thermal-cycle and hose sequence
```

## How this applies to a small Australian business

Australian outdoor sites combine hot days with sudden storms, which makes the cooling vacuum common, not rare. A simple in-house hot-plate and hose sequence costs very little and finds breathing leaks long before an accredited IP test. Buy the vent and the seal from suppliers who publish their data, keep their data sheets with the design record and ask them to review the groove design. Seal suppliers generally do this willingly, because it prevents warranty claims they would otherwise share.

## Exercise: a bigger box

A larger version of the monitor is planned, with a lid 180 mm by 100 mm. The same cord, groove, flange width and gasket load are proposed, with a 5 mm flange and screws at no more than 50 mm spacing. How many screws are needed if one is placed at each corner, and what lid force would a cool-down from 70 °C to 20 °C produce without a vent?

**Worked answer.** On each 180 mm side, spacing of no more than 50 mm between corner screws needs at least **180 ÷ 50 = 3.6**, rounded up to **4** spans, so 3 screws between the corners. (Using the screw centres rather than the outer edge would change this slightly; the drawing uses centres.) Each 100 mm side needs **100 ÷ 50 = 2** spans, so 1 screw between the corners. The total is **4 + 2 × 3 + 2 × 1 = 12 screws**. The lid area is **0.18 × 0.10 = 0.018 m²**, so the same 14.8 kPa pressure difference produces about **14,800 × 0.018 ≈ 266 N**. That is more than twice the smaller box's 114 N and a strong reason to fit a vent.
