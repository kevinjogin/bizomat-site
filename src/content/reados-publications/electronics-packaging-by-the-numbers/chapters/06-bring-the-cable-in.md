---
book: electronics-packaging-by-the-numbers
chapterSlug: bring-the-cable-in
order: 6
title: "Bring the cable in"
description: "Choose between a cable gland and a panel connector, check voltage drop on the supply run, route the cable and internal leads, and keep water from following the cable inside."
draft: false
---

Every cable that enters an enclosure is a hole in the seal, a path for water to follow, a lever that someone will pull and a conductor that carries noise in and out. It is also how the product gets its power and, often, its data. The cable entry deserves as much design attention as the lid seal, and it usually gets less.

This chapter brings the gearbox monitor's 24 V supply into the enclosure. It compares a cable gland with a panel-mounted connector, checks the voltage drop over the 25 m run, routes the cable outside and the leads inside, and works through a failure in which water reached the connector by following the cable.

## Gland or connector

There are two common ways to bring a cable into a sealed enclosure.

A **cable gland** clamps and seals around the cable where it passes through a hole in the wall. The cable is then terminated inside, on a terminal block or a board connector. A gland is cheap and robust, and the unit leaves the factory with a length of cable attached, or the installer threads the cable through and terminates it on site.

A **panel-mounted circular connector** is sealed into the enclosure wall. The site cable carries a mating plug. Circular M12 connectors, standardised in the IEC 61076-2-101 family, are common on industrial sensors and are widely available with moulded cables in standard lengths.

```figure
type: compare
title: Cable gland or M12 panel connector for the gearbox monitor
cols: Cable gland with terminated cable | M12 panel connector and moulded cable
caption: This is an illustration of the team's comparison. Either can be sealed to the enclosure's rating if it is chosen and fitted correctly.
- Seal | clamping insert on the cable sheath, depends on cable diameter | O-ring under the coupling nut, depends on correct tightening
- Installation | open the lid on site to terminate, or ship with a fixed cable | plug in without opening the enclosure
- Replacement after damage | open the enclosure | swap the cable
- Factory test | test with the cable attached | test through the panel connector
- *Field risk | lid opened on site, seal disturbed | coupling nut left loose
- Cost per unit | lower part cost | higher part cost, less installation time
```

The gearbox monitor uses a 4-pin M12 panel connector. The deciding factor was that the lid never has to be opened on site. Every time a lid is opened in dust and rain, the seal is at risk, and the factory's leak test no longer applies. The connector's own seal then becomes critical, so its tightening is treated as an installation requirement, not a detail.

## Size the conductors for the run

The supply comes from a 24 V d.c. power supply in the conveyor's control cabinet, 25 m away. Moulded M12 sensor cables commonly have conductors around 0.34 mm². The question is whether the resistance of the run drops too much voltage at the monitor's peak current.

```figure
type: formula
title: Voltage drop on the 25 m supply run
formula: R_loop = 2 × ρ × L ÷ A        V_drop = I × R_loop
caption: This is an illustration. Copper resistivity is the IEC 60028 annealed-copper value at 20 °C. Conductor resistance rises about 0.4% per kelvin, so a cable lying on hot steelwork drops a little more.
- ρ | 0.017 241 Ω·mm²/m, annealed copper at 20 °C
- L | 25 m one way, so 50 m of conductor in the loop
- A | 0.34 mm² per conductor
- I | peak 2 W ÷ 0.85 ÷ 24 V ≈ 0.098 A
step: R_loop = 2 × 0.017241 × 25 ÷ 0.34 ≈ 2.54 Ω
step: V_drop = 0.098 × 2.54 ≈ 0.25 V, about 1.0% of 24 V
```

A drop of 0.25 V at peak is negligible. The average current, about **0.6 ÷ 0.85 ÷ 24 ≈ 0.029 A**, drops less than 0.1 V. Even at three times the length, the drop at peak would be about 0.75 V, comfortably inside the input range of the monitor's switching regulator.

The calculation still matters, for two reasons. First, the monitor's input stage has a minimum operating voltage, and a cabinet supply that sags when solenoids on the same supply switch can take the monitor below it if the cable drop is large. Second, a switching regulator draws roughly constant power, so its input current rises as its input voltage falls. On a long, thin cable that feedback can make the voltage at the monitor collapse during a transmit pulse. The brief therefore states the minimum supply voltage at the cabinet and the maximum cable length, and the installation instructions repeat both.

## Seal the connector into the wall

A panel connector has two seals, and both must be designed. The first is between the plug and the receptacle, made by the O-ring that the coupling nut compresses. The second is between the receptacle and the enclosure wall, and that one is the mechanical designer's.

This is an illustration. The gearbox monitor's receptacle is a front-mounted type: its body passes through a hole in the base wall from outside, with a flat O-ring under its flange on the outside face, and a nut tightened from inside. The design details that make the seal work are:

- **A flat, smooth sealing face.** The casting's outer wall is spot-faced around the hole, so that the O-ring seats on a machined surface, not on an as-cast surface with draft and texture.
- **Enough wall thickness for the thread engagement.** The connector maker specifies a range of panel thickness for the nut. The base wall is thickened locally to fall inside it.
- **A stated nut torque.** The maker gives a tightening torque for the panel nut. It goes on the assembly drawing and the production torque tool is set to it.
- **Anti-rotation.** A flat on the receptacle thread and a matching flat in the hole stop the connector turning when the installer tightens the plug, which would twist the internal leads.

The receptacle is supplied with its flying leads already attached and its rear potted by the connector maker. That puts a factory-made seal between the pins and the inside of the enclosure, so even a damaged plug cannot let water past the pins into the box.

## Choose the cable for the place

The cable is part of the product's reliability even if it is bought separately. Three properties matter most outdoors on a conveyor.

**Sheath material.** Cable sheaths differ in their resistance to sunlight, oil, abrasion and temperature. Polyurethane sheaths are commonly chosen for oily, abrasive industrial settings and PVC for general use. The right choice depends on the actual exposure, which is why the brief recorded the site's dust and any chemicals used. The installation instructions name the cable type, not just its connector.

**Temperature rating.** The cable may lie against the gearbox housing at 75 °C or on steelwork in full sun. Its rated temperature must cover the hottest surface it can touch, or the routing must keep it off that surface. The installation drawing keeps the cable at least 50 mm from the housing.

**Wicking.** Water can travel along the inside of a cable, between the conductors and under the sheath, from a damaged end or an open junction box. A cable that enters a pit or a low junction box can deliver water to a connector many metres away, even if the connector itself is perfectly sealed. Moulded cables, which are sealed at both ends, and junction boxes mounted above the equipment they feed reduce the risk.

## Route the cable outside

A cable hanging from an enclosure is a channel for water and a handle for anyone passing. Three rules guide its route.

**Point the connector down or sideways.** Water running down a cable runs into whatever is at its lower end. If the connector faces upwards, the cable delivers rainwater directly to the coupling nut. The gearbox monitor's connector exits horizontally from the side of the base, and the installation instructions require the cable to turn downwards immediately in a **drip loop**: a short dip below the connector, so water drips off at the bottom of the loop rather than following the cable into the connector.

**Respect the bend radius.** A cable bent too tightly can crack its sheath or damage its conductors, especially when cold. This is an illustration. The chosen cable's data sheet gives a minimum bend radius for fixed installation of ten times its outside diameter of 5 mm, so the drip loop must not bend tighter than **50 mm** radius. The CAD model of the installation includes the cable at that radius, which showed that a straight connector would leave the cable pressed against the gearbox guard. A right-angle plug, pointing down, solved it.

**Clamp the cable near the unit.** The cable is clamped to the structure within 300 mm of the connector, so that a pull on the cable is taken by the clamp, not by the connector. Conveyors have moving parts, belt cleaners and maintenance crews with long tools, and a cable that is free for a metre will eventually be caught.

## Where a pull ends up

A cable caught by a passing tool or a falling rock gets pulled. The question is which part takes the load. Without a clamp, the pull goes through the plug into the receptacle and then into the base wall. The connector's retention rating and the wall's strength decide what breaks, and either way the seal is lost.

This is an illustration. A person pulling a snagged cable can easily apply a few hundred newtons, and a belt cleaner or conveyor idler that catches a loop can apply far more. The connector's maker rates its cable retention, but that rating is meant to keep the cable in the plug, not to let the cable carry a load on the enclosure. The clamp within 300 mm of the connector, fixed to the conveyor structure rather than to the monitor, takes the pull directly into the steelwork. The short length between clamp and connector is left slightly slack, as part of the drip loop, so that any movement of the clamped cable does not tension the plug.

## Route the leads inside

Inside the enclosure, the panel connector's four pins connect to the board through short flying leads. The internal route is simple but has its own rules.

- **Length.** The leads are long enough to plug in the board header with the board already screwed down, as Chapter 2's assembly check required, but no longer, so that spare wire does not loop over the antenna zone.
- **Termination.** The leads are crimped into the board connector's housing with the crimp tool the connector maker specifies. Hand-soldered leads stiffen the wire next to the joint, which concentrates bending there under vibration.
- **Anchoring.** As Chapter 3 required, the leads are tied to an anchor on the base within 15 mm of the header.
- **Separation.** The leads run along the base wall, away from the antenna end and away from the accelerometer, so that supply noise and wire movement do not reach either.

The internal leads are modelled in the CAD assembly as a simple harness, with their actual diameters and minimum bend radii. That model is what showed the original header orientation was impossible to reach, and it is also the source of the lead lengths on the harness drawing.

## Bring the shield through properly

The M12 cable has an overall braided screen. Whether and where to connect it is an electromagnetic compatibility decision, covered in Chapter 8. The mechanical part of the decision is to make a good connection possible. A screen connected through a long pigtail of wire behaves poorly at high frequencies. One connected all the way round, through the connector's metal body to the metal base, behaves well. The gearbox monitor uses a connector with a metal body and a screen contact in the plug. The base's mounting face for the connector is left unpainted, and the connector is fixed with a serrated washer or a conductive gasket, so the shield's path to the base is short and continuous.

## A failure case: water that came down the cable

This is an illustration. During the site trial of the first ten units, one unit reported intermittent supply dropouts after every hose-down. It was removed and opened. The enclosure was dry, but the M12 connector's pins and the inside of the plug's coupling nut showed corrosion and water marks.

Two installation details had combined. The unit had been mounted with its connector pointing up, because that was the side nearest the cable tray. And the plug's coupling nut had been finger-tightened only. The plug's O-ring seals only when the coupling nut is tightened to the maker's stated torque. Water ran down the cable onto the coupling nut, past the uncompressed O-ring and into the pin area.

The enclosure's IP rating had not been breached, but the product had still failed, because the connection was part of the product. The corrections were:

1. The installation instructions now show the permitted orientations, with the connector horizontal or pointing down, and forbid pointing up.
2. The tightening torque for the coupling nut is stated in the instructions, and the installer's kit includes a small torque tool sized for M12 couplings.
3. A drip loop and a cable clamp within 300 mm are required and shown on a drawing.
4. The commissioning checklist includes a photo of each installed unit showing the connector orientation and drip loop.

```figure
type: steps
title: Installing the gearbox monitor's cable
caption: This is an illustration of the installation sequence adopted after the site trial. Each step is checked on the commissioning record.
- Mount the unit | connector horizontal or pointing down, on the shaded side if possible
- Plug in | right-angle plug pointing down, coupling nut tightened to the stated torque
- *Form the drip loop | lowest point below the connector, bend radius at least 50 mm
- Clamp | cable clamped to the structure within 300 mm of the connector
- Record | photograph the connector, loop and clamp for the commissioning record
```

## How this applies to a small Australian business

Most field failures of cable entries are installation failures, and installation is often done by a contractor who has never seen the product's design rationale. A one-page installation drawing with permitted orientations, a torque value and a drip loop sketch costs little and prevents most of them. If the product is sold to sites in remote areas, include the torque tool in the kit: a return trip to fix a loose connector can cost more than the product.

## Exercise: a longer, thinner run

A second site wants to reuse an existing 2-core cable of 0.25 mm² conductors, 120 m long, from a cabinet whose 24 V supply sags to 21.6 V when nearby solenoids switch. The monitor needs at least 18 V at its terminals. Using the peak power of 2 W at 85% efficiency, estimate the voltage at the monitor during a transmit pulse at the sagged supply voltage. Is the run acceptable?

**Worked answer.** The loop resistance is **R = 2 × 0.017241 × 120 ÷ 0.25 ≈ 16.6 Ω**. At 21.6 V, a first estimate of the current is **2 ÷ 0.85 ÷ 21.6 ≈ 0.109 A**, giving a drop of **0.109 × 16.6 ≈ 1.8 V** and about **19.8 V** at the monitor. Because the regulator draws constant power, recalculate the current at 19.8 V: **2 ÷ 0.85 ÷ 19.8 ≈ 0.119 A**, a drop of about **2.0 V** and about **19.6 V** at the monitor. A further iteration changes it only slightly, so the voltage settles near **19.6 V**. That is above 18 V, but the margin is only about 1.6 V, and resistance rises when the cable is hot. The run is marginal. The recommendation is a new cable with larger conductors, or a local 24 V supply, rather than reuse.
