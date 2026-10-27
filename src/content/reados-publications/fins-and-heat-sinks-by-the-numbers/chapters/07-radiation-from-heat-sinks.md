---
book: fins-and-heat-sinks-by-the-numbers
chapterSlug: radiation-from-heat-sinks
order: 7
title: "Radiation from heat sinks"
description: "A natural-convection sink sheds a fifth of its heat by radiation, but only through its outer envelope. HS-150's finish is costed, and an estimate that counted every fin face is corrected."
draft: false
---

In still air, radiation is not a small correction. A natural-convection heat sink at 50 to 100 °C sheds roughly as much heat per square metre of its outer surface by radiation as by convection, and a dull, high-emissivity finish can be worth several kelvin at the junction. But radiation has a property that convection does not: it travels in straight lines, and a fin can only radiate usefully to surroundings it can see. Most of a finned sink's area faces other fins at almost the same temperature, and radiation between them achieves nothing. Getting the area right is the whole art of estimating a sink's radiation.

This chapter sets out how a heat sink radiates, the **envelope** method for estimating it, the effect of HS-150's anodised finish, and the effects of sun, nearby surfaces and colour. Its failure case is an estimate that applied radiation to every fin face, as if each could see the room, and predicted that radiation alone would carry more than the drive's entire 150 W.

## How much a surface radiates

A surface at absolute temperature T_s exchanging radiation with large surroundings at T_a, with an emissivity ε, sheds q = ε × σ × A × (T_s⁴ − T_a⁴), where σ = 5.670 × 10⁻⁸ W/m²·K⁴. For comparison with convection, it is convenient to write that as a coefficient, h_rad = ε σ (T_s⁴ − T_a⁴) ÷ (T_s − T_a). For HS-150's base at 94.5 °C in surroundings at 40 °C, with the anodised finish's emissivity of 0.77, h_rad ≈ **6.9 W/m²·K**, a little more than the natural-convection coefficient of 5.0 W/m²·K that Chapter 5 found for the same surface.

The emissivity is the property a designer controls. Published values put anodised aluminium at about 0.77 and commercial aluminium sheet at about 0.09: the bare metal is a poor emitter, while the thin oxide layer that anodising grows on it is a good one. Painted surfaces are typically high as well; [Radiation from hot surfaces](/reados/publications/heat-transfer-by-the-numbers/radiation-from-hot-surfaces/) tabulates more finishes. The infrared emissivity of a finish depends mostly on its material and thickness, not on its visible colour, so a clear anodised sink and a black one radiate similarly to their surroundings at these temperatures; colour matters in sunlight, as discussed below.

## Fins see each other

Consider HS-150's 18 fins with 9.1 mm gaps between them. Each fin face looks across a narrow gap at its neighbour, which is at almost the same temperature, and only a small fraction of its view escapes through the gap's open front to the room. Net radiation between two surfaces at the same temperature is zero. So the inner fin faces radiate almost nothing to the surroundings, however large their area.

The practical model is to treat the sink as a solid block with the shape of its outer envelope: the plane across the fin tips, the two outer faces of the end fins, and the small top and bottom openings. Radiation leaves through that envelope. For HS-150, mounted against the cabinet, the envelope is the 200 mm × 250 mm front across the fin tips plus the two 45 mm × 250 mm outer fin faces, about **0.0725 m²**, against a total fin and base area of about 0.455 m².

```figure
type: formula
title: HS-150's radiation through its envelope at full load
formula: q_rad ≈ ε σ A_env (T_b⁴ − T_a⁴),   A_env = front across fin tips + outer fin faces
caption: This is an illustration with the base at 94.5 °C, surroundings at 40 °C and an anodised emissivity of 0.77. The fin tips run slightly cooler than the base, and the channels behave as small cavities that emit a little better than a flat surface; the two effects partly cancel.
- A_env | 0.20 × 0.25 + 2 × 0.045 × 0.25 ≈ 0.0725 m²
- T_b⁴ − T_a⁴ | 367.65⁴ − 313.15⁴ ≈ 8.65 × 10⁹ K⁴
step: q_rad ≈ 0.77 × 5.670 × 10⁻⁸ × 0.0725 × 8.65 × 10⁹ ≈ 27.4 W
step: About 18 % of the 150 W; convection carries the other 122.6 W
```

Using the base temperature on the envelope is a simplification: the fin tips, which form most of the front, are slightly cooler than the base, as Chapter 3 showed, by about 2 % of the excess in natural convection. On the other hand, each channel's opening acts like a small cavity, which emits more effectively than a flat plate of the same material. For first estimates of anodised aluminium sinks, the two effects are small and of opposite sign, and the envelope at the base temperature is a sound approximation.

## What the finish is worth

The envelope method makes the value of the finish easy to calculate. This is an illustration. With HS-150's 18 fins at 150 W in 40 °C air:

```figure
type: bars
title: HS-150's sink resistance and junction temperature by finish, 150 W in 40 °C air
unit: K/W
max: 0.45
caption: This is an illustration from the natural-convection sweep of Chapter 6 with the envelope radiation model. The junction figures include the interface and spreading allowances: 122 °C anodised, about 130 °C bare, about 131 °C with no radiation at all.
- *Anodised, ε 0.77 | 0.363
- Bare extruded aluminium, ε about 0.09 | 0.415
- No radiation, for comparison | 0.424
```

The anodised finish lowers the resistance by about 12.5 % against bare aluminium, which at 150 W is about 7.8 K at the base and the junction. Bare aluminium radiates so little that it is almost the same as no radiation at all. For a natural-convection sink near its limit, the finish is the cheapest few kelvin available; for a fan-cooled sink, where convection is several times stronger, it matters much less.

## The failure case: radiation from every fin face

This is an illustration. An early estimate of HS-150's performance treated radiation like convection, applying it to the sink's whole surface: 0.455 m² of fins and base, all at the base temperature, all radiating to the room. At a base temperature of 94.5 °C, that gave a radiated power of 0.77 × σ × 0.455 × 8.65 × 10⁹ ≈ **172 W**, more than the 150 W the drive dissipates, before any convection. Solved together with convection, the estimate predicted a base of about 72 °C and a sink resistance of about 0.213 K/W, which would have made HS-150 look comfortably capable of the 250 W version without a fan.

```figure
type: compare
title: Two ways of counting HS-150's radiating area
cols: Radiating area | Radiation at a 94.5 °C base | Predicted sink resistance
caption: This is an illustration at 150 W in 40 °C air with ε = 0.77. Applying radiation to every fin face counts fin-to-fin exchange, which carries no net heat, as if it went to the room.
- Every fin face and the base | 0.455 m² | 172 W | 0.213 K/W
- *Outer envelope | 0.0725 m² | 27.4 W | 0.363 K/W
```

The error was detected by a sanity check that any calculation can apply: one heat-transfer path should not, on its own, carry more than the total heat. A radiation figure larger than the total power means the area is wrong. The correction was the envelope method. The general lesson is that radiation's area is the area that can see the surroundings. For finned surfaces, closely spaced tubes, stacked plates and any surface inside a cavity, the visible envelope, not the wetted area, is the radiating area.

### How much of a fin's view escapes

The geometry can be quantified with a view factor, the fraction of the radiation leaving one surface that reaches another. For two long parallel plates of width w facing each other at a distance d, the standard result is F = √(1 + (d ÷ w)²) − d ÷ w. For HS-150's fins, w is the 45 mm fin height and d the 9.1 mm gap, so d ÷ w ≈ 0.203 and F ≈ 0.818. About 82 % of the radiation leaving one fin face lands on the facing fin, at almost the same temperature. The remaining 18 % is split between the base, also at the same temperature, and the channel's open front, through which a fin face sees the room. Only a few per cent of each inner fin face's radiation escapes, which is why the envelope, not the fin area, is the right radiating area.

The same result shows why widely spaced or short fins radiate better per square metre: as d ÷ w grows, F falls and more of each face sees out. A natural-convection sink with a few widely spaced fins gets a larger share of its heat out by radiation than a dense one. In Chapter 6's comparison, the 28-fin design's radiation rose only because its base ran hotter, not because its extra fins radiated anything useful: they added area that sees only other fins.

## Paint and coatings

A coating adds a thin layer to the conduction path, and its cost can be checked with Chapter 2's arithmetic. This is an illustration. A 50 µm paint layer with an assumed conductivity of 0.2 W/m·K over HS-150's whole 0.455 m² surface has a resistance of about 5 × 10⁻⁵ ÷ (0.2 × 0.455) ≈ 0.000 55 K/W, worth less than 0.1 K at 150 W. A thin, high-emissivity coating therefore costs nothing measurable in conduction and can be worth several kelvin in radiation on a bare sink. Thick coatings, powder coats of a few hundred micrometres, are still small on a large sink but should be checked on small, high-power ones. Anodising grows its layer from the metal itself, a few micrometres to a few tens of micrometres thick, and is the usual choice for extrusions.

## Radiation under a fan

In a fan-cooled sink, radiation's share is small. This is an illustration. The 250 W version of Chapter 8, with its base at roughly 82 °C in 40 °C air, would radiate about 20 W through the same 0.0725 m² envelope, about 8 % of its load, and a shroud over the fin tips, which a fan-cooled sink usually needs, blocks most of that envelope's view of the room. For fan-cooled designs the finish matters little thermally and can be chosen for corrosion resistance, appearance or cost.

## Surroundings that are not cold

The radiation formula assumes surroundings at the air temperature that fill the sink's whole view. Real installations depart from that. A sink facing a nearby hot surface, another drive's heat sink, a furnace wall, a sunlit roof, exchanges radiation with it, and if that surface is hotter than the sink, the sink gains heat. A sink in a corner sees two walls that may be warmer than the air. A sink facing open sky outdoors at night radiates to a sky that can be much colder than the air, which helps. In each case the budget should use the mean radiant temperature of what the envelope sees, not the air temperature. For HS-150 on the back of a cabinet facing a factory wall a metre away, the wall's temperature was assumed equal to the 40 °C air, which is reasonable unless the wall is sunlit outside or warmed by plant.

## Sun

Outdoors, a sink in sunshine absorbs solar radiation over the area that faces the sun. Here, unlike the infrared case, colour matters: solar absorptance depends on the visible and near-infrared colour of the finish, so a black anodised sink absorbs much more sunlight than a clear or white one, while both radiate similarly in the infrared. For outdoor equipment, a sunshade that keeps direct sun off the fins while leaving them free to radiate and convect is usually worth more than any choice of finish. A sunlit enclosure's internal air can also rise well above the outdoor air, which belongs in the budget of Chapter 1.

## Radiation and measurement

Emissivity affects measurement as well as cooling. An infrared thermometer or camera reads the radiation a surface emits and converts it to a temperature using an emissivity setting. On anodised aluminium, with an emissivity near 0.8, a correctly set instrument reads well. On bare aluminium, with an emissivity near 0.1, the surface emits so little that the instrument mostly reads reflections of the surroundings, and its reading can be tens of kelvin wrong. A small patch of high-emissivity tape or paint on the spot to be measured, whose emissivity is known, solves the problem. Chapter 10 builds this into HS-150's test method.

## How this applies to a small Australian business

For natural-convection sinks, a high-emissivity finish such as anodising or paint is worth specifying, and its value can be calculated in minutes with the envelope method: for HS-150 it is about 8 K. The common mistake is to count radiation over the whole finned area, which can overstate it severalfold; the sanity check is that radiation alone must never carry more than the total power. Outdoor equipment needs shading more than a choice of colour, and any measurement with an infrared instrument on bare metal needs a patch of known emissivity.

## Exercise: radiation at 50 W

At 50 W, HS-150's base runs at about 64.3 °C in 40 °C air. Find the radiation through the 0.0725 m² envelope with ε = 0.77, its share of the 50 W, and the radiation coefficient. Compare with full load.

**Worked answer.** T_b⁴ − T_a⁴ = 337.45⁴ − 313.15⁴ ≈ 1.297 × 10¹⁰ − 0.962 × 10¹⁰ ≈ 3.35 × 10⁹ K⁴. Then q_rad ≈ 0.77 × 5.670 × 10⁻⁸ × 0.0725 × 3.35 × 10⁹ ≈ **10.6 W**, about **21 %** of the 50 W. The coefficient is ε σ (T_b⁴ − T_a⁴) ÷ ΔT ≈ 0.77 × 5.670 × 10⁻⁸ × 3.35 × 10⁹ ÷ 24.3 ≈ **6.0 W/m²·K**.

At full load the share was about 18 % and the coefficient 6.9 W/m²·K, so the coefficient falls by only about an eighth while the convection coefficient, Chapter 5's exercise found, falls by about a sixth. Radiation's share rises slightly at light load because natural convection weakens faster than radiation as the sink cools, so the finish matters at every load, not only at full power.
