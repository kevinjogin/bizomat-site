---
book: industrial-electric-heating-by-the-numbers
chapterSlug: how-conductors-heat-and-cool
order: 3
title: "How conductors heat and cool"
description: "Balance the heat a conductor makes against the heat it loses by convection and radiation, find its steady temperature and time constant, and see why a heating element needs its surroundings."
draft: false
---

A conductor carrying current gets warmer until the heat it loses to its surroundings equals the heat the current produces in it. That simple balance, heat in equals heat out, decides the temperature of everything electrical: a cable in a tray, a busbar in a switchboard, an element in an oven. Make more heat or lose less, and the temperature rises until the balance is restored. Houston and Kennelly devoted two chapters of their 1895 book to the heating of bare and covered conductors, and the principles they described are the ones used to rate cables and design heaters today.

This chapter sets up the heat balance of a conductor, calculates the temperature of a busbar and of an oven element, introduces the time constant that governs how fast they heat up, and shows what happens to an element when the oven's fan stops.

## The heat balance

At a steady temperature, the heat generated in a conductor by Joule heating equals the heat it loses:

**I² × R = heat lost by convection + heat lost by radiation (+ conduction)**

Heat is lost from the surface. Houston and Kennelly emphasised this: the heat a bare wire loses increases directly with its surface, and for a wire in still air, both convection and radiation increase with the wire's temperature above the surrounding air. A thin wire has a large surface for its cross-section and keeps cool; a thick bar has a smaller surface for its cross-section and runs warmer for the same current density.

## Convection

Convection carries heat away in the air or liquid flowing past the surface. For a surface at temperature T in surroundings at T₀, the convective loss is approximately:

**q_conv = h × A × (T − T₀)**

where A is the surface area and h is the heat transfer coefficient. In still air, natural convection gives h of the order of 5 to 10 W/m²·°C for ordinary surfaces; a fan blowing air past the surface raises it several times; a liquid raises it far more. Houston and Kennelly observed that a wire covered with varnish and immersed in water ran much cooler than the same wire in air, because the water carried the heat away so much better.

## Radiation

Every surface also radiates heat, at a rate given by the Stefan–Boltzmann law:

**q_rad = ε × σ × A × (T⁴ − T₀⁴)**

with temperatures in kelvin, σ = 5.67 × 10⁻⁸ W/m²·K⁴ and ε the surface's emissivity, from near 0 for polished metal to near 1 for dull black surfaces. Because radiation rises with the fourth power of absolute temperature, it is modest near room temperature and dominant in ovens and furnaces (Chapter 7).

Houston and Kennelly noted that radiation from a bright wire was small. A bright copper surface has a low emissivity, so it radiates little; a painted or oxidised surface radiates much more. That is why busbars are often painted, and why a dull, dark surface runs cooler than a bright one carrying the same current.

## A busbar in still air

This is an illustration. The coating business's switchboard has a copper busbar 50 × 6 mm carrying 600 A. Its cross-section is 300 mm², so its resistance per metre at 20 °C is 1.72 × 10⁻⁸ ÷ (300 × 10⁻⁶) ≈ 57.3 µΩ, and it generates 600² × 57.3 × 10⁻⁶ ≈ **20.6 W per metre**. Its perimeter is 2 × (50 + 6) = 112 mm, so each metre has 0.112 m² of surface.

```figure
type: formula
title: Temperature rise of a 50 × 6 mm copper busbar at 600 A
formula: ΔT = P ÷ ((h_conv + h_rad) × A)
caption: This is an illustration for one metre of bar in still air at about 30 °C. The radiation coefficient is linearised as h_rad ≈ 4εσT³; the rise in resistance with temperature is neglected for this first estimate.
- P | heat generated, 20.6 W per metre
- A | surface area, 0.112 m² per metre
- h_conv | natural convection, about 10 W/m²·°C
- h_rad | about 4 × 0.9 × 5.67 × 10⁻⁸ × 303³ ≈ 5.7 W/m²·°C for a painted bar (ε ≈ 0.9)
step: convection only: ΔT ≈ 20.6 ÷ (10 × 0.112) ≈ 18.4 °C
step: painted, with radiation: ΔT ≈ 20.6 ÷ (15.7 × 0.112) ≈ 11.7 °C
```

Radiation takes away more than a third of the heat from the painted bar. A bright, polished bar, with an emissivity of perhaps 0.1, radiates very little and runs at about 17 °C above the air, against about 12 °C for the painted bar. In reality the bar's resistance rises a few per cent as it warms (Chapter 2), and the air inside an enclosed switchboard is warmer than the room, so the real temperature is somewhat higher. Switchboard makers rate their busbars from tests and from standards that account for all of this.

```figure
type: bars
title: Temperature rise of the busbar at 600 A by how it loses heat
unit: °C above surrounding air
max: 20
caption: This is an illustration for one metre in still air. Surface finish matters because a bright copper surface radiates little.
- Convection only | 18.4
- Bright surface, ε ≈ 0.1 | 17.3
- *Painted surface, ε ≈ 0.9 | 11.7
```

## Current squared, again

Because the heat generated rises with the square of the current, so does the temperature rise, roughly. At 800 A instead of 600 A, the painted busbar generates 800² × 57.3 × 10⁻⁶ ≈ 36.7 W per metre, 1.78 times as much, and its temperature rise is about 20.9 °C instead of 11.7 °C. A third more current gives nearly twice the temperature rise. Conductors that are adequate at their rated current can overheat quickly when overloaded, which is the problem fuses and circuit breakers exist to solve (Chapter 4).

## How fast a conductor heats: the time constant

A conductor does not reach its steady temperature instantly. Houston and Kennelly described the process: when current is first switched on, the temperature rises fastest at the start and the rate of rise steadily diminishes as the temperature approaches its final value. The heat generated goes partly into warming the conductor's mass and partly into losses, and as the temperature rises, more goes into losses and less into warming.

For a conductor with mass m, specific heat c, surface A and heat transfer coefficient h, the temperature rise follows:

**ΔT(t) = ΔT_final × (1 − e^(−t/τ)),  with τ = m × c ÷ (h × A)**

The time constant τ is the time to reach about 63% of the final rise; after three time constants, the rise is about 95% complete. The same exponential appears in many engineering processes, as the Library chapter on [growth, decay and logarithms](/reados/collections/practical-mathematics-for-engineering/growth-decay-and-logarithms/) explains.

This is an illustration. One metre of the busbar weighs about 8,960 kg/m³ × 300 × 10⁻⁶ m² ≈ 2.69 kg. With copper's specific heat of about 385 J/kg·°C and convection alone at 10 W/m²·°C on 0.112 m², the time constant is about 2.69 × 385 ÷ (10 × 0.112) ≈ **924 s**, about 15 minutes. The bar takes about three-quarters of an hour to reach steady temperature after the load is applied, which is why short overloads that would overheat it if sustained may do no harm, and why cable and busbar ratings distinguish between continuous, cyclic and short-time currents.

## Covered conductors

Houston and Kennelly's chapter on covered conductors dealt with a question that still surprises people: does insulation make a wire run hotter or cooler? The covering resists the flow of heat from the copper outwards, which tends to make the wire hotter. But it also enlarges the outer surface from which heat is lost to the air, which tends to make it cooler. For a thin wire, the second effect can win.

The balance point is called the critical radius of insulation, which for a cylinder is approximately the insulation's thermal conductivity divided by the outer heat transfer coefficient, r_c ≈ k ÷ h. This is an illustration. For a plastic insulation with a thermal conductivity of about 0.19 W/m·°C in still air with h about 10 W/m²·°C, the critical radius is about 0.19 ÷ 10 ≈ 0.019 m, 19 mm. A small cable whose insulated radius is well below that loses heat better with its insulation than it would bare; only for large cables does thicker insulation reduce heat loss. The insulation's real limit is its temperature rating, which is why cable ratings are set by the maximum temperature the insulation can withstand, not by how much it insulates.

## Conduction along the conductor

Heat also flows along a conductor towards cooler parts, such as terminals, connections and the cold ends of a heating element where it passes through the oven wall. A heating element is usually made with low-resistance cold ends, of thicker wire or a different material, so that little heat is generated where it passes through the insulation and into the terminal box, and the terminals stay at a temperature their insulation and connections can bear. A terminal that runs hot is a sign that either heat is flowing along the element towards it or the connection itself is generating heat (Chapter 2), and both need attention.

## Buried and enclosed conductors

Houston and Kennelly also described wires buried in earth, where the heat has to travel slowly outwards through the surrounding soil. The soil near the wire warms first and the heat spreads gradually, so a buried cable both heats more slowly and reaches a higher final temperature for the same current, because the soil carries heat away less readily than moving air. The same is true of cables in conduit, cables grouped closely together, and cables covered by thermal insulation in a ceiling: each reduces the heat a cable can lose, so each reduces the current it can safely carry. Cable rating standards apply derating factors for these installation conditions, which is one reason cable selection is a job for an electrician working to AS/NZS 3008.1.1, not a simple lookup of conductor size.

## A heating element's temperature

A heating element obeys the same balance, but it is designed to run hot. Its temperature is whatever it must reach to shed its power into its surroundings. This is an illustration. One of the curing oven's 3 kW elements, made from 19.9 m of 1.2 mm wire (Chapter 5), has a surface area of π × 0.0012 × 19.9 ≈ 0.075 m² and a surface loading of about 3,000 ÷ 0.075 ≈ 40,000 W/m², which is about 4 W/cm².

Suppose the element sits in still air inside the oven, losing heat mainly by radiation to oven walls and work at about 200 °C. To radiate 40,000 W/m² with an emissivity of about 0.9 to surroundings at 473 K, its temperature must satisfy 0.9 × 5.67 × 10⁻⁸ × (T⁴ − 473⁴) = 40,000, which gives T ≈ 956 K, about **680 °C**. With the oven's circulating fan blowing air past the elements, adding convection with a coefficient of perhaps 40 W/m²·°C, the same power is shed at a lower element temperature, about **580 °C**. The fan does not just spread heat evenly around the oven and its load; it keeps the elements a hundred degrees cooler, well inside the alloy's limit and with a longer life.

```figure
type: compare
title: Element temperature for 4 W/cm² in a 200 °C oven
cols: Still air, mostly radiation | With circulating fan
caption: This is an illustration with an emissivity of about 0.9 and an assumed convection coefficient of 40 W/m²·°C with the fan running. The same power is shed at a lower element temperature when the air moves.
- Surface loading | about 4 W/cm² | about 4 W/cm²
- Heat transfer | radiation, little convection | radiation plus forced convection
- Element temperature | about 680 °C | about 580 °C
```

## A failure: the fan that stopped

This is an illustration. One afternoon, the oven's circulating fan motor tripped on overload, but the heaters kept running under the temperature controller, which saw the oven's air temperature fall in places and called for more heat. Within a few minutes several elements near the fan outlet glowed bright orange, and one burnt out. Parts in that batch were under-cured on the side away from the heaters and scorched on the side facing them.

The calculation above shows why. Without the fan, the elements lost their forced convection and had to shed their full power by radiation and natural convection alone, so their temperature rose by a hundred degrees or more, and the elements nearest the dead fan, where the air had been fastest, rose most. The oven's air no longer mixed, so the controller's sensor did not represent the elements or the work.

The oven maker's design included an airflow switch that should have cut the heaters when the fan stopped, but it had been bypassed during an earlier repair and never reconnected. It was restored and tested, and the oven's maintenance checklist now includes a functional test of the airflow interlock: with the oven warm, the fan is stopped and the heaters must drop out.

## Exercise: an overloaded busbar

For the painted 50 × 6 mm busbar, calculate the heat generated per metre and the temperature rise at 800 A, using the same combined heat transfer coefficient of 15.7 W/m²·°C. Then calculate the rise if the bar were bright, with a combined coefficient of about 10.6 W/m²·°C.

At 800 A, the heat generated is 800² × 57.3 × 10⁻⁶ ≈ **36.7 W per metre**. The painted bar's rise is about 36.7 ÷ (15.7 × 0.112) ≈ **20.9 °C**. A bright bar, with about 10.6 W/m²·°C, would rise about 36.7 ÷ (10.6 × 0.112) ≈ **30.9 °C**.

At this current, the bar's resistance would also be noticeably higher than at 20 °C, raising the heat and temperature a little further, and an enclosure would add more. The combination of the square law and surface finish explains why the same bar can be comfortable at its rated current and too hot when overloaded or when its surface is bright and enclosed.
