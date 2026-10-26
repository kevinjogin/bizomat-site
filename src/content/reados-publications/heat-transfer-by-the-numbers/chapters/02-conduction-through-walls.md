---
book: heat-transfer-by-the-numbers
chapterSlug: conduction-through-walls
order: 2
title: "Conduction through walls and layers"
description: "Calculate conduction through flat walls with Fourier's law, add layer and surface resistances to get a U-value, find each layer's temperature and see why wet or bridged insulation fails."
draft: false
---

Conduction is heat passing through a material without the material moving. Hot molecules jostle cooler neighbours, free electrons in metals carry energy along, and heat seeps from the hot face of a wall to the cold one. How fast it goes depends on the material, on the wall's thickness and area, and on the temperature difference across it. That relationship, Fourier's law, is the simplest in heat transfer and the most useful, because insulation, tank walls, oven linings, cold-room panels and building walls are all, to a first approximation, flat layers that heat must cross.

This chapter calculates conduction through HW-60's insulated storage tank wall. It states Fourier's law, turns each layer and each surface into a thermal resistance, adds them to find the wall's U-value and the tank's heat loss, finds the temperature at each interface, and then looks at what defeats insulation in practice: thermal bridges, compression and water. The failure case is a tank whose insulation had been soaked by a leaking valve above it.

## Fourier's law

For a flat wall of thickness **L**, area **A** and **thermal conductivity k**, with temperatures **T₁** and **T₂** on its two faces, the steady heat flow is:

**Q = k × A × (T₁ − T₂) ÷ L**

Thermal conductivity, in watts per metre per kelvin, W/m·K, is the property that distinguishes a good conductor from an insulator. Its range is enormous.

```figure
type: compare
title: Thermal conductivity of materials in HW-60
cols: Thermal conductivity, W/m·K | Role in the system
caption: This is an illustration using published values: mineral wool and glass wool 0.04, polyurethane foam 0.03, still air about 0.026 at 25 °C, water about 0.6 and stainless steel about 17. Real products' data sheets give values at their mean temperature.
- Polyurethane foam | 0.03 | possible tank insulation
- Mineral wool | 0.04 | HW-60's tank and pipe insulation
- Still air | 0.026 | the reason insulation works: air trapped in fine fibres or cells
- Water | 0.6 | about 23 times more conductive than still air; why wet insulation fails
- *Stainless steel | 17 | the tank wall and pipe; a good conductor next to insulation
```

Insulation works by trapping still air in fine fibres or closed cells. Air that cannot move conducts heat poorly, and mineral wool's conductivity of 0.04 W/m·K is not far above still air's. Stainless steel conducts heat over 400 times better than mineral wool, which is why the steel wall of a tank contributes almost nothing to its insulation.

## Thermal resistance of a layer

Rearranged in Chapter 1's terms, Fourier's law says that a flat layer has a thermal resistance of **L ÷ (k × A)**. For one square metre of wall, the resistance is simply **L ÷ k**, in square metres kelvin per watt, m²·K/W, the unit used for insulation ratings. HW-60's tank has **50 mm** of mineral wool, so each square metre has a resistance of **0.05 ÷ 0.04 = 1.25 m²·K/W**. Its 2 mm stainless steel wall adds **0.002 ÷ 17 ≈ 0.00012 m²·K/W**, about ten thousand times less.

## R-values on insulation products

Building insulation sold in Australia is labelled with an **R-value**, which is exactly this resistance for one square metre, in m²·K/W. A batt labelled R2.5 offers 2.5 m²·K/W. HW-60's 50 mm of mineral wool, at 1.25 m²·K/W, would be described as about R1.25. The R-value is the useful number for comparing products, because it already includes the thickness: 50 mm of a material with a conductivity of 0.04 W/m·K and 37.5 mm of one at 0.03 W/m·K both give about R1.25. Thinner insulation of a lower conductivity can therefore match thicker insulation of a higher one, which matters where space around a tank or pipe is limited.

## Conductivity changes with temperature

A material's conductivity is not quite constant. For mineral wool and most insulation, it rises as the insulation gets hotter, because the air in it conducts and radiates heat more readily. Makers' data sheets therefore give conductivity at stated **mean temperatures**, the average of the hot and cold faces. HW-60's insulation runs from 85 °C at the steel to about 25 °C at the jacket, a mean of about 55 °C, so the designer reads the data sheet's value at or near 55 °C, not the value at room temperature. For hot equipment at a few hundred degrees, the difference is large; for a hot water tank it is modest, but using the right figure costs nothing.

## Layers of different insulation

Some walls use two insulation materials: a heat-resistant layer against a hot surface, with a cheaper or more efficient layer outside it, where the temperature has fallen. The resistances simply add, and the temperature at the joint between them follows from the heat flux, as shown below for the tank. The temperature at each interface must stay within the outer material's maximum service temperature, which its maker states. A foam that performs well at 40 °C can soften or degrade at 120 °C, so a two-layer design is checked interface by interface, not only for its total loss.

## Surface resistances

Heat does not jump from the hot water straight into the steel or from the insulation's outer face straight into the room. At each surface, a thin layer of fluid resists the flow, and the heat crosses it by convection and, outside, by radiation. Each surface therefore has a **surface resistance**, the reciprocal of its **heat transfer coefficient h**, in W/m²·K: R = 1 ÷ h for one square metre.

Chapters 4 and 5 work out those coefficients properly. For now, this chapter uses two values. Inside the tank, slowly moving hot water against steel is given a coefficient of **500 W/m²·K**, a teaching value well within the published range for water, so its resistance is about **0.002 m²·K/W**. Outside, the insulation's painted jacket loses heat to the still air and the room's surfaces at a combined coefficient of about **9 W/m²·K**, so its resistance is about **0.111 m²·K/W**. Chapter 5 shows where the 9 comes from.

## Add the resistances: the U-value

The heat crosses four resistances in series: the water film, the steel, the insulation and the outside surface. In series, resistances add, and the reciprocal of their sum is the wall's **overall heat transfer coefficient**, or **U-value**, in W/m²·K.

```figure
type: formula
title: U-value and heat loss of HW-60's insulated tank
formula: U = 1 ÷ (R_inside + R_steel + R_insulation + R_outside)        Q = U × A × ΔT
caption: This is an illustration. The tank's surface is its side, π × 1.5 × 1.8 ≈ 8.48 m², plus top and bottom, each π × 0.75² ≈ 1.77 m², about 12.02 m² in total. The tank is treated as flat-walled, which is close enough at 1.5 m diameter.
- Water film, 1 ÷ 500 | 0.002 m²·K/W
- Stainless steel, 0.002 ÷ 17 | 0.00012 m²·K/W
- Mineral wool, 0.05 ÷ 0.04 | 1.25 m²·K/W
- Outside surface, 1 ÷ 9 | 0.111 m²·K/W
step: total R ≈ 1.363 m²·K/W, so U ≈ 0.734 W/m²·K
step: Q ≈ 0.734 × 12.02 × (85 − 20) ≈ 573 W
```

The insulated tank loses about **573 W**, about 3,440 kWh a year over 6,000 hours, costing about **A$320** a year. The insulation provides about 92% of the total resistance, so it controls the result. Without it, the resistance falls to about 0.113 m²·K/W and the same calculation gives a loss of around **6.9 kW**, twelve times as much; Chapter 5 refines that figure, because a bare steel surface at 85 °C loses heat faster than the insulation's cool jacket does.

## The temperature at each layer

In steady flow, the same heat crosses every layer, so the temperature drop across each layer is the heat flux multiplied by that layer's resistance. The heat flux is **573 ÷ 12.02 ≈ 47.7 W/m²**.

```figure
type: stack
title: Where the 65 K temperature difference is used up across the tank wall
unit: K
caption: This is an illustration at a heat flux of 47.7 W/m². Almost the whole difference falls across the insulation; the jacket's surface ends up about 5 K above the room.
- Water film | 0.1
- Stainless steel | 0.01
- *Mineral wool insulation | 59.6
- Outside surface to room | 5.3
```

The steel is at practically the water's temperature, 85 °C, all the way through. The insulation's outer face, under its jacket, is at about **20 + 5.3 = 25.3 °C**. That surface temperature matters for two reasons: it decides how much heat the outside surface loses, which Chapters 4 and 5 calculate more carefully, and it tells anyone touching the tank whether it is safe, which is one of the reasons for insulating hot equipment at all.

## Thermal bridges

The calculation assumes the insulation is continuous. Real tanks are not. Legs, lifting lugs, manway covers, flanged nozzles and valve bodies pass through or interrupt the insulation, and each is a path of steel straight from the hot water to the room, called a **thermal bridge**. Steel's high conductivity means a single uninsulated nozzle or leg can lose as much heat as several square metres of insulated wall.

On HW-60's tank, the designer counted the bridges: three support legs, a manway on the top, an inlet, an outlet, a drain and two instrument nozzles. The legs were fitted with insulating pads between the tank and the floor. The manway, inlet and outlet were covered by removable insulated boxes or jackets, so they could be opened for maintenance and closed again. The small instrument nozzles were insulated with the tank. Without those measures, a rough estimate put the bridges' combined loss at several hundred watts, comparable to the whole of the insulated wall.

## Insulation that does not insulate

Insulation's conductivity depends on keeping its air still and dry. Three things undo it.

**Compression.** Mineral wool squeezed under straps, at supports or under a jacket fitted too tightly loses thickness, and the resistance falls in proportion: half the thickness, half the resistance, twice the heat flow through that area. Straps and bands should be snug, never tight, and supports should use rigid insulating blocks.

**Gaps.** Joints between insulation sections that open up, or insulation that slumps on a vertical surface, leave strips of bare or thin wall. A few millimetres of gap along a joint behaves as a thermal bridge along its whole length, and on a thermal camera it shows as a bright line.

**Water.** Water conducts heat about **23 times** better than still air. Insulation that becomes wet, from a leak, rain through a damaged jacket or condensation, can lose much of its resistance, and wet insulation against hot steel also corrodes it. If wet mineral wool's effective conductivity rose to even 0.1 W/m·K, the tank wall's U-value would more than double, to about **1.63 W/m²·K**. Wet insulation is often worse than that, and stays wet for a long time.

## Cold surfaces work the same way

Everything in this chapter applies in reverse to cold equipment, such as chilled water pipes or a cold room's walls, with heat flowing inwards. There is one extra hazard. If the outside surface of the insulation, or any bridge through it, is colder than the dew point of the surrounding air, water condenses on it. The surface temperature calculation shown above tells the designer whether that will happen, and the [Psychrometrics for HVAC](/reados/collections/fluids-hvac-and-building-services/psychrometrics-for-hvac/) chapter explains how to find the dew point. Cold insulation also needs a continuous vapour barrier on its warm side, because moist air drawn into the insulation condenses inside it and soaks it from within.

## A failure case: the wet patch

This is an illustration. Two years after HW-60's tank was insulated, the maintenance team ran a routine thermal camera survey of the plant room. The insulated tank showed a uniform jacket temperature of about 25 °C, except for a band on one side, below the outlet valve, where the jacket read over 40 °C.

The jacket was opened at that point. The mineral wool beneath was saturated: the outlet valve's gland had been weeping a few drops an hour for months, running down behind the jacket. The wet insulation was conducting heat almost as if it were not there, and the stainless steel behind it showed early staining.

The detection came from the thermal survey, which made a hidden problem visible as a hot patch. The correction was to repack the valve gland, remove and replace the wet insulation, check the steel for chloride staining and clean it, and refit the jacket with a sealed joint above the valve. The valve's position above the jacket was noted on the maintenance plan, with a drip tray added to carry any future weeping clear of the insulation.

## How this applies to a small Australian business

Treat every wall as a stack of thermal resistances: each surface as 1 ÷ h, each layer as thickness ÷ conductivity. Add them, take the reciprocal for the U-value, and multiply by area and temperature difference for the loss. Expect the insulation to dominate; if it does not, look again. Use the same resistances to find surface temperatures. Then look for what the calculation leaves out: bridges at supports, nozzles and valves; compressed or slumped insulation; and above all water, which can turn insulation into a conductor. A thermal camera survey, once a year, finds most of these problems quickly.

## Exercise: a thicker roof

HW-60's tank top, about 1.77 m², faces the plant room ceiling. The maintenance engineer asks whether doubling its insulation from **50 mm** to **100 mm** is worthwhile. With the same surface resistances, what is the top's U-value at each thickness, its heat loss and the annual saving at 6,000 hours and A$0.093 per kWh?

**Worked answer.** At 50 mm, the U-value is about **0.734 W/m²·K**, as above, and the top loses about **0.734 × 1.77 × 65 ≈ 84 W**. At 100 mm, the insulation's resistance becomes **0.1 ÷ 0.04 = 2.5 m²·K/W**, the total about 2.613 m²·K/W, and U about **0.383 W/m²·K**, so the top loses about **44 W**. The saving is about **40 W**, or **240 kWh** a year, worth about **A$22** a year. Whether that justifies the cost depends on the price of the extra insulation; Chapter 6 shows how to decide.
