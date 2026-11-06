---
book: electronics-packaging-by-the-numbers
chapterSlug: follow-the-heat-out
order: 4
title: "Follow the heat out"
description: "Build a simple thermal-resistance network for a sealed enclosure on a hot machine in the sun, find the internal temperature and choose a mounting that balances heat against vibration."
draft: false
---

A sealed enclosure has no fan and no airflow through it. Every watt that enters it must leave through its walls, and the internal temperature rises until the heat leaving equals the heat arriving. For most electronics in an office, the only heat source is the electronics themselves and the problem is mild. A sensor node bolted to a hot gearbox in the Australian sun has three sources: its own dissipation, the machine it is mounted on and the sun. Its own electronics turn out to be the smallest of the three.

This chapter builds a thermal-resistance network for the gearbox monitor, solves it by hand and uses it to compare mounting and finish options. It also shows why a thermal fix and a vibration fix can pull in opposite directions, and how one detail resolved both.

## Heat flows like current

For steady conditions, heat flow through a conducting or convecting path can be written in the same form as Ohm's law. A temperature difference drives a heat flow through a thermal resistance:

**Q = ΔT ÷ R**, with Q in watts, ΔT in kelvin and R in kelvin per watt.

Paths in series add their resistances. Parallel paths add their conductances, the reciprocals of resistance. A textbook such as Incropera and colleagues' *Fundamentals of Heat and Mass Transfer* develops this method fully. Here it is used at its simplest: the enclosure is treated as a single node at one temperature, connected to the gearbox through one resistance and to the surrounding air through another, with heat sources added at the node.

The single-node model ignores temperature differences inside the enclosure, which are dealt with separately below. It is crude, but it is quick, and it shows which path dominates. It is the right first tool.

## The gearbox monitor's network

This is an illustration. The network has three temperatures and two resistances.

- **The gearbox housing** at **75 °C**, the brief's maximum.
- **The shade air** at **40 °C**.
- **The enclosure node**, whose temperature is unknown.

**R₁, enclosure to gearbox.** The base's machined face sits on the gearbox pad with coupling grease, clamped by the M8 stud. The team estimated **R₁ ≈ 2.0 K/W** for this joint from a contact-conductance assumption and planned to measure it in Chapter 9. It is a low resistance, because the joint was designed to be stiff and in full contact for vibration.

**R₂, enclosure to air.** The enclosure's outside area is **2 × (0.11 × 0.07 + 0.11 × 0.045 + 0.07 × 0.045) ≈ 0.0316 m²**. Removing the base face that sits against the gearbox leaves **0.0316 − 0.0077 ≈ 0.0239 m²** exposed to air. Free convection from small surfaces in still air is of the order of a few to a few tens of watts per square metre per kelvin, and radiation from a warm surface adds several more. A combined coefficient of **10 W/m²·K** is assumed, so **R₂ = 1 ÷ (10 × 0.0239) ≈ 4.18 K/W**.

**Heat sources at the node.** The electronics dissipate **0.6 W** on average. In sun, the lid also absorbs solar radiation. With an assumed irradiance of 1,000 W/m² on the 0.0077 m² top face, a dark grey lid with an assumed absorptance of 0.6 absorbs about **4.6 W**, and a white lid at an assumed 0.25 absorbs about **1.9 W**.

```figure
type: formula
title: Solving the single-node network
formula: T = (G₁ × T_gearbox + G₂ × T_air + P) ÷ (G₁ + G₂)        G = 1 ÷ R
caption: This is an illustration. Conductances are 0.50 W/K to the gearbox and 0.239 W/K to the air. All coefficients and absorptances are stated assumptions.
- G₁ | 1 ÷ 2.0 = 0.50 W/K, enclosure to gearbox
- G₂ | 1 ÷ 4.18 ≈ 0.239 W/K, enclosure to air
- P | 0.6 W of electronics, plus absorbed sun
step: shade: T = (0.50 × 75 + 0.239 × 40 + 0.6) ÷ 0.739 ≈ 64.5 °C
step: white lid in sun: T = (37.5 + 9.57 + 0.6 + 1.9) ÷ 0.739 ≈ 67.1 °C
step: dark lid in sun: T = (37.5 + 9.57 + 0.6 + 4.6) ÷ 0.739 ≈ 70.7 °C
```

The result is clear. Even in shade the enclosure sits at about 64.5 °C, and the electronics' own 0.6 W adds less than 1 K of it: removing the 0.6 W term entirely lowers the answer by **0.6 ÷ 0.739 ≈ 0.8 K**. The gearbox is the dominant heat source, the sun is second and the electronics are a distant third.

## What the parts can stand

The board uses parts rated for the industrial temperature range, which for most parts in this product tops out at **85 °C** ambient. The question is how much hotter than the enclosure node the hottest component runs.

Inside a small sealed box, air circulates weakly and components run warmer than the average. The radio module dissipates most of the electronics' power. This is an illustration. A bench measurement on an early board in a closed box showed the module's case about **8 K** above the internal air during continuous operation. Adding 8 K to the enclosure node gives:

- shade, **64.5 + 8 ≈ 72.5 °C**;
- white lid in sun, **67.1 + 8 ≈ 75.1 °C**;
- dark lid in sun, **70.7 + 8 ≈ 78.7 °C**.

All three are below 85 °C, but the margin in the worst case, about 6 K, is narrower than the uncertainty in the assumed coefficients. A 30% error in R₂ alone would move the enclosure temperature by several kelvin. The design needed more margin.

## Break the heat path without breaking the vibration path

The obvious fix is to raise R₁ and insulate the monitor from the gearbox. A rubber or plastic pad would do that, but Chapter 3 needs a stiff mounting so the monitor measures the gearbox's vibration up to 1 kHz. A soft pad is a vibration isolator, which is exactly what a monitor must not have.

The solution was to change the material in the path, not its stiffness. A short **stainless steel spacer** was placed between the base and the gearbox pad: a tube 16 mm outside diameter, 8.5 mm inside diameter and 10 mm long, with the M8 stud passing through it. Austenitic stainless steel conducts heat roughly an order of magnitude less well than aluminium, with handbook values around 16 W/m·K, but it is far stiffer than aluminium.

The spacer's conduction resistance is **R = L ÷ (k × A)**. Its cross-section is **π ÷ 4 × (16² − 8.5²) ≈ 144 mm²**, so **R ≈ 0.010 ÷ (16 × 144 × 10⁻⁶) ≈ 4.33 K/W**. Added in series to the 2.0 K/W contact, R₁ becomes about **6.33 K/W**.

```figure
type: bars
title: Enclosure temperature by mounting and lid finish
unit: °C
max: 80
caption: This is an illustration from the single-node model with the stated assumptions. Add about 8 K for the radio module's case. The parts are rated to 85 °C.
- Direct mount, shade | 64.5
- Direct mount, white lid in sun | 67.1
- Direct mount, dark lid in sun | 70.7
- Stainless spacer, shade | 55.4
- *Stainless spacer, white lid in sun | 60.3
- Stainless spacer, dark lid in sun | 67.1
```

With the spacer and a white lid in full sun, the enclosure sits at about **60.3 °C** and the module case at about **68 °C**, a margin of about 17 K below the 85 °C rating. That margin is large enough to absorb reasonable errors in the coefficients, and Chapter 9's heated-plate test will measure the real figure.

```figure
type: compare
title: Ways to slow the heat coming from the gearbox
cols: Effect on R₁ | Effect on vibration coupling | Verdict
caption: This is an illustration of the options the team weighed. Only a stiff, low-conductivity part in the load path served both the thermal and the measurement requirement.
- Rubber or plastic pad | large increase | acts as an isolator and loses the high frequencies | rejected
- Air gap with a thin bracket | large increase | bracket resonates inside the band | rejected
- Remote mounting with a cable to a sensor | removes the path | sensor still needs a stiff mount; adds a cable and connector | kept as a fallback
- *Short stainless steel spacer | about 4.3 K/W added | stiff; rocking mode stays above 1 kHz | adopted
```

The spacer's effect on vibration was checked again with the modal study. This is an illustration. With the spacer's machined faces in full contact, the enclosure's first rocking mode fell from about 2.1 kHz to about **1.7 kHz**, still above the 1 kHz measurement band. The spacer also changed the temperature measurement: the monitor's internal sensor now reads lower than the housing and lags behind it. The reliability engineer accepted this because the requirement was to trend the housing temperature, not to measure it exactly. Chapter 9 records the offset.

## The sun and the lid

Solar gain is the term most often left out of enclosure calculations, and for a small box it can be several times the electronics' own heat. Three choices reduce it:

- **A light lid colour.** Changing the absorptance from 0.6 to 0.25 cut the absorbed sun from 4.6 W to 1.9 W in the case above. Light colours can yellow under ultraviolet light, so the lid material needs an outdoor-stabilised grade, a Chapter 9 test item.
- **A sun shield.** A separate shade plate with an air gap above the lid intercepts most of the direct sun. It adds a part and a fixing, and it must not trap water or dust.
- **Orientation.** The installer can sometimes mount the unit on the shaded side of the gearbox. The installation instructions recommend it but do not rely on it.

The gearbox monitor uses a white, UV-stabilised polycarbonate lid and the instruction to prefer the shaded side. A sun shield was kept as an option for sites further north.

## A failure case: the regulator that shut down

This is an illustration. The first prototype board, laid out before the brief was finished, powered its 3.3 V electronics from the 24 V supply with a **linear regulator**. A linear regulator drops the excess voltage across itself and turns it into heat. The electronics drew an average of about **0.51 W** at 3.3 V, which is **0.51 ÷ 3.3 ≈ 0.155 A**.

A linear regulator draws the same current from its input as it delivers to its output, so the input power was **24 × 0.155 ≈ 3.71 W** and the regulator dissipated **(24 − 3.3) × 0.155 ≈ 3.2 W**. In a small surface-mount package with a thermal resistance from junction to air of perhaps 50 K/W on this board (an assumed figure), the junction would try to rise about **3.2 × 50 = 160 K** above its surroundings.

The symptom on the bench was not heat but resets. The monitor restarted every few minutes, always during a radio transmission. A thermal camera showed the regulator at the edge of its rating, and the regulator's data sheet described a thermal shutdown feature that turns the output off when the junction overheats and on again when it cools. Each transmission added load, tipped the regulator into shutdown and reset the processor.

The correction was a **switching (buck) regulator** at about 85% efficiency. It draws **0.51 ÷ 0.85 ≈ 0.6 W** from the 24 V supply, the figure used in the network above, and dissipates only about **0.09 W** itself. The lesson for the mechanical designer is that the heat budget depends on the electronics' architecture, so the brief must state power dissipation as drawn from the supply, not as used by the circuit.

## Look inside the box as well

The single-node model gives one temperature for the whole enclosure, but the inside is not uniform. Three local checks complete the picture.

**The module near the window.** Chapter 2 moved the radio module 25 mm towards the antenna end to clear a lid rib. That put the hottest component closer to the polycarbonate window and further from the aluminium base, which is the main heat path out. The electronics designer added a copper area under the module, connected through several plated holes to a copper pour on the bottom layer, and the mechanical designer placed a soft thermal pad between that area and a raised boss on the base. The pad gives the module a short conduction path to the base, and the bench measurement of 8 K was repeated with it in place.

**The board near the base.** The aluminium base runs close to the enclosure node temperature, but the area directly above the stud boss is warmer, because heat arrives there first from the gearbox. The accelerometer sits over that boss, as Chapter 3 required, so its own temperature rating and any temperature drift in its output were checked against the warmest local figure, not the average.

**The cold end.** On a winter morning at −5 °C, a freshly started unit sits near ambient temperature. Cold matters less for most electronics than heat, but it sets the lowest temperature the gasket and the polycarbonate must tolerate, and it creates the conditions for condensation that Chapter 5 deals with.

## Short peaks and thermal mass

The radio draws about 2 W for a few seconds while it transmits. Over five seconds that is about **2 × 5 = 10 J**. The die-cast base and the board have thermal mass, so a pulse of that size raises their temperature by a small fraction of a kelvin. Short peaks therefore matter for the local temperature of the module and the regulator, which the electronics designer checks with the component data, but not for the enclosure. The single-node model correctly uses average power.

## How this applies to a small Australian business

Australian sites combine high shade temperatures, strong sun and hot machinery, and northern sites add humidity. Overseas reference designs are often rated against milder conditions. A one-page thermal network with each assumption written down is enough to show whether a design is close to its limits, and it tells the test laboratory which conditions to reproduce. The BIZOMAT [Gearbox or Hydraulic Unit Heat Balance and Cooling](/tools/gearbox-heat-balance/) calculator is a useful companion when the question is how hot the machine itself will run.

## Exercise: a hotter gearbox

The site later reports that one gearbox, with a worn bearing, runs its housing at **90 °C**. Using the stainless spacer (R₁ ≈ 6.33 K/W), R₂ ≈ 4.18 K/W, 40 °C shade air, 0.6 W of electronics and a white lid in full sun, estimate the enclosure and module case temperatures. Is the product still within its parts' rating?

**Worked answer.** G₁ = 1 ÷ 6.33 ≈ 0.158 W/K and G₂ ≈ 0.239 W/K. The heat input at the node is 0.6 + 1.9 = 2.5 W. **T = (0.158 × 90 + 0.239 × 40 + 2.5) ÷ (0.158 + 0.239) ≈ (14.2 + 9.57 + 2.5) ÷ 0.397 ≈ 66.3 °C**. Adding about 8 K for the module gives about **74 °C**, still below 85 °C. A housing that hot is itself a maintenance signal: the monitor exists to report it, and the reading should trigger an inspection before the bearing fails.
