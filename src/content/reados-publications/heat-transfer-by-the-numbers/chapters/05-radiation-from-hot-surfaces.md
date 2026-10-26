---
book: heat-transfer-by-the-numbers
chapterSlug: radiation-from-hot-surfaces
order: 5
title: "Radiation from hot surfaces"
description: "Calculate radiant heat with the Stefan-Boltzmann law in kelvins, see how emissivity changes losses and surface temperatures, add radiation to convection and read thermal cameras correctly."
draft: false
---

Every surface warmer than absolute zero gives off infrared radiation, and absorbs some of the radiation falling on it from everything around. The net exchange carries heat from hotter surfaces to cooler ones, through air or a vacuum, without needing anything to move. At the temperatures of a hot water system, radiation is easy to overlook, because nothing glows. It is still as large as natural convection, and it depends strongly on something convection ignores: the finish of the surface. A polished stainless pipe and a painted one at the same temperature can lose very different amounts of heat, and a thermal camera pointed at them can give readings tens of degrees apart.

This chapter calculates radiation in HW-60. It states the Stefan-Boltzmann law, insists on absolute temperatures, explains emissivity and the published values for the case's surfaces, works out the bare pipe and tank losses with radiation and convection together, converts radiation into a coefficient to add to convection, shows how a jacket's finish affects its temperature, and explains why a thermal camera needs the right emissivity. The failure case is a thermal survey that missed hot valves because they were shiny.

## The Stefan-Boltzmann law

The net radiation from a small surface, of area A, emissivity ε and absolute temperature T_s, to large surroundings at absolute temperature T_sur, is:

**Q = ε × σ × A × (T_s⁴ − T_sur⁴)**

where **σ**, the Stefan-Boltzmann constant, is **5.670 374 419 × 10⁻⁸ W/m²·K⁴**, an exact value in the SI. Temperatures must be in **kelvins**, the Celsius value plus 273.15, because the law depends on the fourth power of the absolute temperature. Using Celsius gives nonsense: 85⁴ − 20⁴ is a very different number from 358.15⁴ − 293.15⁴.

"Small surface in large surroundings" describes a pipe or tank in a room well: the room's walls, floor and ceiling surround it and reflect little back. Two large surfaces facing each other closely, such as the inner and outer walls of a double-skinned vessel, need a more detailed formula with both emissivities and the geometry, found in heat transfer texts.

## Emissivity

Emissivity is a surface's effectiveness as a radiator compared with a perfect one, from 0 to 1. A surface that emits poorly also absorbs poorly and reflects most of what falls on it, which is why shiny metal feels cool in the sun and foil is used as a radiant barrier. Published values for the surfaces in HW-60 vary widely.

```figure
type: bars
title: Emissivity of surfaces in and around HW-60
unit: emissivity
max: 1
caption: Published guideline values at about room temperature: paint 0.96, old galvanised steel 0.88, weathered stainless steel 0.85, oxidised steel 0.79, new galvanised steel 0.23, polished stainless steel 0.075 and aluminium foil 0.04. Real surfaces vary with condition, so measured values beat table values.
- Paint | 0.96
- Galvanised steel, old | 0.88
- *Stainless steel, weathered | 0.85
- Steel, oxidised | 0.79
- Galvanised steel, new | 0.23
- Stainless steel, polished | 0.075
- Aluminium foil | 0.04
```

Emissivity depends on the surface far more than on the metal underneath. The same stainless steel is a poor radiator when polished and a good one when weathered, dull or dirty. Paint of almost any colour is a good radiator in the infrared, so a white painted pipe radiates about as well as a black one at these temperatures, despite looking very different.

A surface's real emissivity can be measured on site with a thermal camera and a contact thermometer. With the surface at a steady temperature, the contact reading gives the true temperature, and the camera's emissivity setting is adjusted until its reading agrees. The setting that matches is the surface's emissivity, near enough, and it can be recorded for future surveys and estimates of that equipment, with the date, because surfaces change as they weather, dull and collect dirt.

## Bare pipe and bare tank

For a bare HW-60 pipe at 85 °C in a room at 20 °C:

- **σ × (358.15⁴ − 293.15⁴) ≈ 514.2 W/m²**, the radiation from a perfect radiator;
- a weathered stainless surface, at ε = 0.85, radiates about **437 W/m²**;
- a polished one, at ε = 0.075, only about **38.6 W/m²**.

```figure
type: formula
title: Radiation from a bare weathered HW-60 pipe
formula: q = ε × σ × (T_s⁴ − T_sur⁴)        temperatures in kelvins
caption: This is an illustration for a weathered stainless surface at 85 °C in a 20 °C room. The fourth powers make radiation grow quickly with temperature: the same surface at 150 °C would radiate about 2.7 times as much.
- Surface temperature | 85 °C = 358.15 K
- Surroundings | 20 °C = 293.15 K
- σ | 5.670 374 419 × 10⁻⁸ W/m²·K⁴
step: σ × (358.15⁴ − 293.15⁴) ≈ 5.6704 × 10⁻⁸ × (1.6454 × 10¹⁰ − 7.385 × 10⁹) ≈ 514.2 W/m²
step: with ε = 0.85, q ≈ 437 W/m², about 83 W per metre of 60.3 mm pipe
```

Natural convection, at 5 W/m²·K over a 65 K difference, adds **325 W/m²** to either. So a weathered bare pipe loses about **762 W/m²** in total, more than half of it by radiation, and a polished one about **364 W/m²**, almost all by convection. Per metre of 60.3 mm pipe, that is about **144 W/m** weathered and about **69 W/m** polished. The tank, if bare, would lose about **9.2 kW** weathered and about **4.4 kW** polished.

```figure
type: compare
title: Losses from bare HW-60 surfaces at 85 °C by finish
cols: Radiation, W/m² | Convection, W/m² | Pipe, W/m | Tank, kW
caption: This is an illustration in a 20 °C room with still air at 5 W/m²·K. A weathered surface loses about twice as much as a polished one; insulation, Chapter 3, reduces either to about 18 W/m.
- *Weathered stainless, ε 0.85 | 437 | 325 | about 144 | about 9.2
- Painted, ε 0.96 | 494 | 325 | about 155 | about 9.8
- New galvanised, ε 0.23 | 118 | 325 | about 84 | about 5.3
- Polished stainless, ε 0.075 | 39 | 325 | about 69 | about 4.4
```

Polishing is not a substitute for insulation: a polished bare pipe still loses nearly four times as much as an insulated one. But surface finish explains why bare surfaces that look alike can lose very different amounts of heat, and why estimates of bare equipment need a realistic emissivity for its actual condition, not its condition when new.

## A radiation coefficient to add to convection

Radiation can be written in the same form as convection, Q = h_r × A × ΔT, by defining a **radiation coefficient**:

**h_r = ε × σ × (T_s² + T_sur²) × (T_s + T_sur)**, temperatures in kelvins.

For a weathered stainless surface at 85 °C in a 20 °C room, h_r is about **6.7 W/m²·K**. For a painted jacket at about 24 °C, it is about **5.6 W/m²·K**. These are the values added to convection in Chapter 4 to give the combined outside coefficients, about 11.7 W/m²·K for the bare pipe and about 9.6 for the jacket. Because h_r depends on the surface temperature, a careful calculation finds the surface temperature and h_r together, by trial, as the next section does.

## The jacket's finish and its temperature

On an insulated surface, the jacket's finish barely changes the heat loss, because the insulation controls it, but it does change the jacket's temperature. HW-60's tank was calculated both ways, solving for the surface temperature at which the heat conducted through 50 mm of mineral wool equals the heat leaving by convection at 4 W/m²·K plus radiation.

- With a **painted** jacket, ε = 0.96, the surface settles at about **25.0 °C**, and the tank loses about **577 W**.
- With a bright **aluminium foil** facing, ε = 0.04, the surface cannot radiate its heat away, so it settles hotter, at about **30.3 °C**, and the tank loses slightly less, about **526 W**.

The foil saves about 9% of the heat, because its hotter surface reduces the temperature difference across the insulation, but it runs over 5 K warmer. On a hot surface where people may touch the jacket, a shiny finish raises the touch temperature; on a cold surface, where condensation is the concern, it lowers the jacket temperature further below the room and can increase condensation. The designer chooses the finish for the job: HW-60's jackets are painted, both because they are hosed in the wash-down area and because a cooler touch temperature was preferred.

The painted result, 577 W, is slightly above Chapter 2's 573 W, which used a rounded combined coefficient of 9 W/m²·K. The difference is within the uncertainty of the coefficients; both are good enough to make decisions with.

## Thermal cameras and emissivity

A thermal camera measures infrared radiation and converts it into a temperature using an emissivity the user sets. A shiny surface emits little of its own radiation and reflects the radiation of its surroundings, so with the camera set for a high emissivity, it reads close to the temperature of whatever it reflects, not its own temperature. A polished stainless valve at 85 °C, viewed with the camera set to 0.95 in a 20 °C room, appears to be only about **27 °C**. A weathered one, at 0.85, reads about **80 °C**, close to the truth.

The practical fixes are simple. Set the camera's emissivity for the surface being measured, if it is known. Better, put a small patch of high-emissivity tape or matt paint on shiny surfaces before the survey, and read the patch. And check any surprising reading with a contact thermometer.

## Radiation shields

Because a low-emissivity surface both emits and absorbs poorly, a thin sheet of shiny metal placed between a hot surface and something to be protected cuts the radiation between them sharply. Such a **radiation shield** gets warm itself, but because its shiny faces emit little, it passes on only a fraction of the radiation it intercepts. Shields of polished stainless or aluminium are used around furnace openings, in front of hot process equipment near operators, and behind heaters near walls. They do nothing about convection, so they work best where radiation dominates, at high surface temperatures. At HW-60's 85 °C, insulation is the better answer; around an oven or furnace, as described in [Industrial Electric Heating by the Numbers](/reados/publications/industrial-electric-heating-by-the-numbers/), shields can be very effective.

## Radiant heat and people

People exchange radiation with surrounding surfaces too, which is why a room with hot surfaces feels warmer than its air temperature suggests, and why standing beside a bare hot tank feels uncomfortable even in a cool room. The plant room's bare water heater casing and, before they were jacketed, its bare valves made the area near them noticeably warm. Insulating hot surfaces improves comfort for the people who work near them, as well as saving heat. In hot climates, radiant heat from roofs and sunlit walls is a large part of summer discomfort in factories, for the same reason.

## Outdoors: the sky

Indoors, a pipe radiates to surroundings at about room temperature. Outdoors, much of what it sees is the sky, which on a clear night radiates as if it were well below the air temperature. A bare pipe or roof under a clear sky can therefore lose far more heat by radiation at night than the air temperature suggests, and can cool below the air temperature, which is why dew and frost form on roofs and cars on clear nights. For outdoor equipment, the radiation estimate uses an effective sky temperature for the site and season rather than the air temperature, together with the wind coefficient from Chapter 4.

## A failure case: the cool valves

This is an illustration. HW-60's first annual thermal survey, mentioned in Chapter 2, was carried out by a contractor with the camera set to 0.95 throughout. The report showed the jacketed pipe and tank at 24 to 26 °C, as expected, and the eight valves, which at that time were bare, at between 26 and 35 °C. The report concluded that the valves were "not significant heat sources".

The maintenance engineer, who had calculated losses of over 100 W per valve, was not convinced, and checked one valve with a contact thermometer: 84 °C. The valves were polished stainless steel, and the camera had been reading the reflected room, not the valves.

The detection came from a contact thermometer reading checked against a calculation. The correction was to repeat the survey with emissivity tape on every shiny surface, which showed the valves at about 84 °C, and to fit the removable jackets described in Chapter 3. The survey procedure now requires tape or paint patches on shiny surfaces and a contact check on any reading that disagrees with a calculation.

## How this applies to a small Australian business

Use the Stefan-Boltzmann law with absolute temperatures and a realistic emissivity for the surface's actual condition. Expect radiation to be as large as natural convection on hot bare surfaces, and include it. Convert it to a coefficient to add to convection when combining resistances. Choose jacket finishes knowing that shiny finishes run hotter on hot equipment and colder on cold equipment. And never trust a thermal camera on a shiny surface without an emissivity patch or a contact check.

## Exercise: a new galvanised pipe

A bare new galvanised steel pipe, 60.3 mm in diameter, carries 85 °C water through a 20 °C room. Using ε = 0.23 and still-air convection at 5 W/m²·K, what does it lose per metre? After some years, its emissivity rises to that of old galvanised steel, 0.88. What does it lose then?

**Worked answer.** New, the radiation is **0.23 × 514.2 ≈ 118 W/m²**, the convection **325 W/m²**, a total of about **443 W/m²**. Per metre, with a surface of π × 0.0603 ≈ 0.189 m², the loss is about **84 W/m**. Weathered to ε = 0.88, the radiation becomes about **452 W/m²**, the total about **777 W/m²**, and the loss about **147 W/m**, about 75% more. The same pipe, unchanged except for the state of its surface, loses much more as it ages, which is one more reason to insulate rather than rely on a bright finish.
