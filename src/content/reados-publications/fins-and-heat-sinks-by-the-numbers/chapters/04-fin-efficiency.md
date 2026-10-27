---
book: fins-and-heat-sinks-by-the-numbers
chapterSlug: fin-efficiency
order: 4
title: "Fin efficiency and the finned surface"
description: "Fin efficiency and overall surface efficiency turn the fin equation into a heat sink resistance. HS-150's surface is rated, and a profile chosen for its area alone falls a third short."
draft: false
---

The fin equation of Chapter 3 gives the heat a single fin carries, but a heat sink is many fins standing on a base, with exposed base between them. Engineers collapse all of that into two numbers. The **fin efficiency** is the heat a fin actually sheds divided by the heat it would shed if it were at its root temperature all over. The **overall surface efficiency** extends the same idea to the whole finned surface, fins and exposed base together. With those two numbers, a heat sink's convective resistance becomes one line of arithmetic: one over the coefficient times the area times the overall efficiency.

This chapter defines both efficiencies, applies them to HS-150 in natural and forced air, looks at a related number, the fin effectiveness, that says whether fins are worth adding at all, and shows how much material a fin needs for the most heat. Its failure case is a catalogue profile chosen for the 250 W version because it had two and a half times HS-150's area, which delivered about a third less than its area promised.

## Fin efficiency

For a straight fin of uniform thickness with the corrected height H_c of Chapter 3, the fin efficiency is:

η_f = tanh(m H_c) ÷ (m H_c)

It depends on the single number m H_c. When m H_c is small, a short fin or a weak coefficient, η_f is close to 1. When m H_c is about 1, η_f is about 0.76. When m H_c is 3, η_f is about 0.33, and two-thirds of the fin's surface is doing little. With the efficiency known, the heat from a fin of area A_f is simply q = η_f × h × A_f × θ_b, which is the same answer as Chapter 3's longer formula, written in a form that adds up easily over many fins.

```figure
type: line
title: Fin efficiency of a straight fin against m H_c
x: m H_c
y: Fin efficiency, η_f
legend: η_f = tanh(m H_c) ÷ (m H_c)
ymin: 0
ymax: 1
caption: The curve applies to any straight fin of uniform thickness with an adiabatic tip at its corrected height. HS-150's fins sit at about 0.20 in natural air and about 0.36 under a fan; the folded steel fins of Chapter 3 sat at about 1.21.
- 0.25 | 0.980
- 0.5 | 0.924
- 0.75 | 0.847
- 1 | 0.762
- 1.42 | 0.626
- 2 | 0.482
- 3 | 0.332
```

## Overall surface efficiency

A heat sink's total heat-shedding area A_t is its fins' area, N × A_f, plus the exposed base between them, A_b. The base is at the root temperature and so is 100 % efficient. The **overall surface efficiency** weights the two:

η_o = 1 − (N × A_f ÷ A_t) × (1 − η_f)

and the heat sink's convective resistance, from base to air, is:

R_conv = 1 ÷ (η_o × h × A_t)

This is an illustration. HS-150's 18 fins, each with a corrected height of 46.25 mm and a length of 250 mm, have a fin area of 18 × 2 × 0.046 25 × 0.25 ≈ 0.416 m². The 17 gaps between them, each about 9.1 mm wide, expose about 0.039 m² of base. The total is about 0.455 m², of which the fins make up 91 %.

```figure
type: formula
title: HS-150's convective resistance from its surface efficiency, natural convection
formula: R_conv = 1 ÷ (η_o × h × A_t),   η_o = 1 − (N A_f ÷ A_t)(1 − η_f)
caption: This is an illustration with the natural-convection coefficient from Chapter 6 at full load. Radiation, Chapter 7, is a separate parallel path that brings the total down to about 0.363 K/W.
- h | about 5.0 W/m²·K between the fins at full load
- η_f | tanh(0.202) ÷ 0.202 ≈ 0.987
- N A_f ÷ A_t | 0.416 ÷ 0.455 ≈ 0.91
- η_o | 1 − 0.91 × 0.013 ≈ 0.988
step: R_conv ≈ 1 ÷ (0.988 × 5.0 × 0.455) ≈ 0.445 K/W
```

In natural convection, HS-150's surface is almost perfectly efficient. Its convective resistance is set by the small coefficient and the area, not by any shortfall in the fins. That is typical of aluminium in still air, and it is why the natural-convection design problem, Chapter 6, is about how many fins and how far apart, not how thick.

## Fin effectiveness

A different question is whether a fin is worth having at all. The **fin effectiveness** compares the heat a fin sheds with the heat the patch of base it stands on would shed without it:

ε_f = q_fin ÷ (h × A_root × θ_b)

where A_root is the fin's root area, t × L. For a straight fin, ε_f = √(k P ÷ (h A_c)) × tanh(m H_c). For HS-150's fins it is about 37 in natural air and about 36 under a fan: each fin sheds more than thirty times the heat of the strip of base it covers. A common rule is that fins are worth adding only where their effectiveness is well above about 2. Fins fail that test where the coefficient is already high, in boiling or with a fast liquid, or where the fin material conducts poorly, such as plastic. Fins belong on the side of a wall where the coefficient is lowest, which for an air-cooled device is always the air side.

## How much material a fin needs

When fin material costs weight or money, the useful question is how to shape a given amount of it, a given profile area t × H, to carry the most heat. The answer for a straight rectangular fin, found by varying t at a fixed t × H and maximising the fin equation's heat, is a fin with m H ≈ 1.42, where η_f ≈ 0.63. Thinner, taller fins than that lose too much to their cold tips; thicker, shorter ones carry heat well but have too little surface.

The optimum matters for weight-sensitive products and for liquid-cooled or high-coefficient designs. For natural-convection aluminium sinks it rarely governs, because the efficient fins it suggests would be very tall and very thin, and the real limits are the extruder's tongue ratio and the air flow between the fins. HS-150's fins, at m H_c ≈ 0.20 in natural air, are far from the material optimum and much nearer the efficiency ceiling, which is the right place for a natural-convection sink whose performance is set by spacing.

## The failure case: buying area

This is an illustration. For the fan-cooled 250 W version, a buyer compared catalogue extrusions of the same 200 mm × 250 mm footprint by their surface area. One dense profile, with 30 fins 1.2 mm thick and 70 mm tall, had about 1.10 m² of surface, about 2.42 times HS-150's 0.455 m². Since the fan would push the same air through either, the buyer reasoned, the resistance should fall in proportion to the area. That looked like enough margin to run the fan slowly for quietness: at a quarter of full flow, 0.005 m³/s, HS-150's profile has a resistance of about 0.269 K/W (Chapter 8), so the dense profile should manage about 0.269 ÷ 2.42 ≈ **0.111 K/W**, well inside the 250 W version's budget of 0.20 K/W from Chapter 1.

The fin equation and the channel model of Chapter 8 give a different answer. The dense profile's fins are thin and tall, so at its own coefficient m H_c is about 0.73 and its fins are about 86 % efficient, against HS-150's 96 %. Its narrow 5.7 mm channels, with the air moving more slowly through its larger open area, also give a lower coefficient. Combining both, its resistance at 0.005 m³/s is about **0.197 K/W**, almost twice the buyer's figure and right at the budget's edge, with nothing left for the spreading resistance in the base that Chapter 9 adds. At full flow, 0.02 m³/s, the same profile reaches about 0.080 K/W, a real improvement on HS-150's 0.146, but still about a third worse than its area promised.

```figure
type: compare
title: The dense profile against HS-150's profile, by area and by calculation
cols: At 0.005 m³/s | At 0.02 m³/s
caption: This is an illustration using the forced-convection model of Chapter 8; resistances are from fin base to inlet air. The dense profile has 2.42 times HS-150's area, but its resistance falls only by a factor of about 1.4 at low flow and 1.8 at full flow.
- HS-150 profile, 18 fins 2.5 × 45 mm | 0.269 K/W | 0.146 K/W
- Dense profile, expected from area | 0.111 K/W | 0.061 K/W
- *Dense profile, calculated | 0.197 K/W | 0.080 K/W
```

The shortfall was found when the first prototype, run at the quiet fan speed, came in at the junction limit before spreading had even been accounted for, many kelvin above the buyer's estimate. The correction was to evaluate each candidate extrusion with the full calculation, a coefficient for its own channel width and velocity, a fin efficiency for its own thickness and height and an overall efficiency for its own area split, and to choose the fan speed from the result, together with the pressure drop the fan must overcome. The general lesson is that area is a necessary condition for a good heat sink, not a sufficient one: area multiplied by efficiency, and by a coefficient that itself depends on the geometry and the flow, is what counts.

## Efficiency and the fan

Under a fan, a sink's coefficient rises with the air speed, and its fins' efficiency falls, because m grows with √h. The overall effect of more air is still better cooling, but with diminishing returns: doubling the flow does not halve the resistance. Chapter 8 shows that for HS-150, doubling the flow from 0.02 to 0.04 m³/s lowers the resistance from about 0.146 to about 0.110 K/W, a fall of a quarter, while the pressure drop the fan must supply rises about three and a half times. The surface efficiency is part of that story, and the larger part is the air's own behaviour in the channels.

## Real extrusions: tapers and fillets

Real extruded fins are rarely of uniform thickness. Most taper from a thicker root to a thinner tip, often with a fillet where the fin meets the base, because tapers and fillets help the aluminium flow through the die and strengthen the die's tongues. A taper suits heat flow too: the root carries all of the fin's heat and the tip almost none, so putting material at the root is efficient. For the small tapers of a typical extrusion, using the average thickness in the uniform-fin formulas gives an efficiency within a percent or two of the exact tapered result, which is well inside the uncertainty of the coefficient. Root fillets add a little area and a little conduction at the root, and are usually ignored in estimates.

What should not be ignored is a fin that is much thinner at its tip than the average suggests, such as a knife-edge profile, under a strong fan. Its outer part has a much larger local m than the average, and its tip may be nearly idle. For such profiles, splitting the fin into a few segments, each with its own thickness, and applying the fin equation segment by segment, or simply reading the extruder's own performance data for the profile, gives a better answer than an average.

## Fins on both sides

Some products have heat flowing through a wall with fins possible on either side, such as a liquid-cooled plate inside an air-cooled enclosure, or a sealed electronics box with an internal fan and external fins. The effectiveness rule says where fins help most: on the side with the lower coefficient. The overall resistance is the sum of the two sides' resistances plus the wall's, each side's being 1 ÷ (η_o h A_t), so a designer can see directly which side limits the total and add fins there. Adding fins to the high-coefficient side, where the resistance is already small, changes little.

## How this applies to a small Australian business

When comparing heat sinks, the useful number is the resistance at the actual conditions, which needs three inputs: the coefficient for that sink's geometry and air flow, its fin efficiency and its area. Catalogue data usually give one resistance for one set of conditions, and buying by area alone, or by fin count, is the commonest way to be disappointed. A spreadsheet that takes a profile's dimensions and returns its overall efficiency and resistance, using the fin equation and the convection correlations in the next chapters, lets a small manufacturer compare extruders' standard profiles on equal terms before ordering samples.

## Exercise: thinner fins

To save weight, HS-150's fins could be extruded 1.8 mm thick instead of 2.5 mm, keeping 18 fins 45 mm tall. In natural convection, with h ≈ 5.0 W/m²·K, find the new fin efficiency. Assuming the coefficient is unchanged, what happens to the overall efficiency and the convective resistance? What does the change in fin thickness do to the gaps, and why might the coefficient not stay the same?

**Worked answer.** With t = 1.8 mm, m = √(2 × 5.0 ÷ (209 × 0.0018)) ≈ 5.16 per metre, H_c = 0.045 + 0.0009 = 0.0459 m, so m H_c ≈ 0.237 and η_f = tanh(0.237) ÷ 0.237 ≈ **0.982**, against 0.987. The fin area is almost unchanged, 18 × 2 × 0.0459 × 0.25 ≈ 0.413 m². The gaps widen from about 9.1 mm to about (200 − 18 × 1.8) ÷ 17 ≈ 9.9 mm, so the exposed base grows to about 17 × 0.0099 × 0.25 ≈ 0.042 m², a total of about 0.455 m². The overall efficiency is about 0.984, and the convective resistance, at the same h, stays about **0.447 K/W**, essentially unchanged.

So in natural convection the thinner fins cost almost nothing in efficiency and save about 28 % of the fin material. The wider gaps change the air flow between the fins, which changes h; Chapter 6 shows that HS-150's spacing is close to the optimum, so the change in h would be small. The extruder's minimum thickness for a 45 mm fin would decide whether 1.8 mm is possible.
