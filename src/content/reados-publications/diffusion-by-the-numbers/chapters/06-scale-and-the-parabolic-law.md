---
book: diffusion-by-the-numbers
chapterSlug: scale-and-the-parabolic-law
order: 6
title: "Scale and the parabolic law"
description: "See why oxide scale on hot steel thickens with the square root of time, estimate scale on DS-40's forged blank, set machining allowances, and see what a press breakdown did to it."
draft: false
---

Steel heated in air grows a skin of oxide, **scale**, and the hotter and longer it is heated, the thicker the scale. Scale wastes metal, roughens surfaces, wears forging dies and hides decarburisation beneath it. Its growth, like carburising and decarburisation, is controlled by diffusion, this time diffusion of iron and oxygen through the scale itself, and it follows the same square-root law: thickness grows with the square root of time. The law is called **parabolic** because thickness squared grows in proportion to time.

This chapter explains why scale growth is parabolic, uses teaching rate constants to estimate the scale on DS-40's forged blank at forging and normalising temperatures, combines scale and decarburisation into a machining allowance, and shows how temperature and time multiply the loss. The failure case is a press breakdown that left blanks soaking in the forge furnace.

## Why scale grows parabolically

When iron oxidises in air, a layer of oxide forms on the surface and separates the metal from the oxygen. For the scale to keep growing, iron must diffuse outwards through it, or oxygen inwards, and the thicker the layer, the longer the diffusion path. The flux through a layer of thickness x is, by Fick's first law, proportional to 1 ÷ x, so the growth rate is too: **dx/dt = k ÷ (2x)**. Integrating gives **x² = k_p t**, where k_p is the **parabolic rate constant**, with units of square metres per second, like a diffusion coefficient.

The parabolic law is self-limiting in rate, not in thickness: scale keeps growing, but ever more slowly. Doubling the time multiplies the thickness by √2, exactly as for a diffusion depth. Because k_p comes from diffusion through the oxide, it also rises with temperature according to an Arrhenius law.

Real scales do not always obey it. Thin films at low temperatures grow more slowly than parabolic; scales that crack or spall expose fresh metal and grow faster, approaching a linear rate; scales on alloyed steels may form protective layers that slow growth greatly. Parabolic growth describes the common case of a compact, adherent scale on carbon and low-alloy steel at forging and heat-treating temperatures.

### What diffuses through the scale

On iron and carbon steel above about 570 °C, the scale is mostly a layer of the iron oxide called wüstite next to the metal, with thinner layers of richer oxides on the outside. Growth is dominated by iron ions diffusing outwards through the wüstite, which is full of vacant iron sites that make that diffusion fast, and reacting with oxygen at the outer surface. That is why scale grows outward from the original surface and why it can be dense and adherent next to the metal: the new oxide forms on the outside, not at the metal interface. The details matter to corrosion scientists; for a forge or heat treater, the useful consequence is that the parabolic law and an Arrhenius rate constant describe the growth well enough to set allowances, provided the scale stays intact.

### Scale that will not stay put

Thick scale cracks as a blank cools, because the oxide and the steel shrink by different amounts, and it flakes off. On a part still in the furnace, cracked or spalled scale lets oxygen reach the metal directly and growth accelerates, which is why repeated heating of the same blank, each time cracking the scale on cooling and regrowing it on reheating, loses far more metal than one long heat. DS-40's forge heats each blank once for forging; a blank that must be reheated is recorded, and its allowance is checked.

## Teaching rate constants

Published rate constants for steels vary with composition, atmosphere and temperature, and the values used here are **teaching values**, chosen to be of a realistic order: **k_p ≈ 7 × 10⁻¹³ m²/s at 900 °C** and **3 × 10⁻¹¹ m²/s at 1,200 °C**, which together imply an Arrhenius activation energy of about 180 kJ/mol. A heat treater or forge with real data for its steels and furnaces would use those instead.

```figure
type: compare
title: Scale thickness from x² = k_p t, teaching rate constants
cols: Rate constant | 20 minutes | 1 hour | 2 hours
caption: This is an illustration with teaching values. Scale at 1,200 °C grows about six times faster in thickness than at 900 °C for the same time, because k_p rises about forty-fold.
- 900 °C | 7.0 × 10⁻¹³ m²/s | 0.029 mm | 0.050 mm | 0.071 mm
- 1,000 °C | 3.0 × 10⁻¹² m²/s | 0.060 mm | 0.104 mm | 0.147 mm
- 1,100 °C | 1.0 × 10⁻¹¹ m²/s | 0.111 mm | 0.192 mm | 0.272 mm
- *1,200 °C | 3.0 × 10⁻¹¹ m²/s | 0.190 mm | 0.329 mm | 0.465 mm
```

## DS-40's forged blank

DS-40's blank is cut from bar and its flange is formed by hot upset forging, with the bar end heated to about **1,200 °C** in a gas-fired furnace in air for about **20 minutes**. The blank is later normalised, heated to about 900 °C in air and cooled, to refine the forged structure before machining.

From the teaching constants, the forging heat grows about **0.19 mm** of scale on the heated end, and the normalising heat about **0.03 mm** more over 20 minutes at 900 °C, much less because both temperature and time are lower and because scale already present slows further growth. The scale is not the only loss. Scale forms partly from the metal it replaces, so the steel surface recedes by a fraction of the scale's thickness; the oxide occupies more volume than the iron it consumed, which is why scale is thicker than the metal lost.

### Decarburisation under the scale

Beneath the scale, the steel's surface loses carbon, because the scale–metal interface has almost no carbon potential. At 1,200 °C, carbon in austenite has a diffusion coefficient of about **1.3 × 10⁻¹⁰ m²/s** by the Arrhenius law of Chapter 3. Treating the surface as fully decarburised, the error function of Chapter 5 puts the depth at which carbon is below 90% of the 0.20% core value at about **0.9 mm** after 20 minutes. That is an upper-bound estimate: scale growth consumes part of the decarburised layer as it forms, and the real depth is somewhat less. It is still far deeper than the scale itself, which is why forging allowances are set by decarburisation as much as by scale.

## Setting the machining allowance

DS-40's flange is machined all over after normalising. The allowance on each forged surface must remove the scale, the metal lost to it, the decarburised layer, the forging's dimensional tolerance and the surface roughness, with a margin. Using this chapter's estimates for the 20-minute forging heat:

```figure
type: stats
title: Machining allowance per side on DS-40's forged flange
caption: This is an illustration with teaching values; the forge and machinist set real allowances from experience and measurement. The decarburisation estimate is an upper bound, which errs towards a safe allowance.
- 0.19 mm | Scale from the forging heat | x² = k_p t at 1,200 °C for 20 minutes
- 0.03 mm | Further scale from normalising | 20 minutes at 900 °C
- up to 0.9 mm | Decarburised layer below 90% of core carbon | error function, 20 minutes at 1,200 °C
- 0.5 mm | Forging dimensional tolerance and roughness | teaching value
- *about 1.6 mm | Allowance adopted per side | sum with a small margin
```

The flange is not carburised in service areas, so a little decarburisation left after machining would not matter for hardness; but DS-40's flange face is a locating surface, and a soft, scaly remnant under a machined face can show up as a dark patch after machining, a "black spot", which the inspection rejects. The allowance is set to clear it.

## Temperature and time multiply

Because k_p and D both rise steeply with temperature and both act through √t, scale and decarburisation are most sensitive to the hottest, longest part of any process. A blank held at 1,200 °C for 2 hours instead of 20 minutes grows about **0.47 mm** of scale, √6 ≈ 2.45 times as much, and its decarburisation estimate rises to about **2.2 mm**. Dropping the forging temperature to 1,100 °C for the same 20 minutes would cut the scale to about **0.11 mm**, if the steel can be forged at that temperature without cracking or overloading the press. The forge's choice of temperature is a balance between formability and loss, and the numbers make the loss visible. They also make delays visible: every minute a blank waits in the furnace after it is ready adds scale and decarburisation that nobody intended.

```figure
type: bars
title: Scale grown in 20 minutes, by furnace temperature
unit: mm
max: 0.2
caption: This is an illustration from the teaching rate constants. Each 100 °C step roughly doubles the scale grown in the same time, a little less at the hot end, because k_p rises three- to fourfold per step and thickness goes with its square root.
- 900 °C | 0.029
- 1,000 °C | 0.060
- 1,100 °C | 0.111
- *1,200 °C | 0.190
```

## Oxides that protect

Not every oxide is a nuisance. On stainless and heat-resisting steels, chromium in the alloy forms a thin, dense chromium-rich oxide through which diffusion is extremely slow, so its parabolic rate constant is many orders of magnitude smaller than that of iron oxide, and the scale stays thin for thousands of hours at temperatures where plain steel would scale away. Aluminium-bearing alloys form alumina layers that are slower still. These alloys are chosen for furnace parts, baskets and fixtures precisely because their scales are protective; DS-40's carburising baskets are made from a heat-resisting alloy for that reason. The same parabolic law describes them; only the rate constant changes, and it changes by enough to turn a consumable into a structural material.

## Measuring scale and decarburisation

The teaching constants in this chapter should be replaced by measurements as soon as they exist. For a forge, the simplest measurement is to weigh or measure a blank before heating and again after descaling, which gives the metal lost per heat; a micrometer across a descaled diameter does the same for round blanks. A metallographic section through a forged blank, polished and etched, shows the depth of decarburisation as a lighter band of lower-carbon structure beneath the surface, and a microhardness traverse quantifies it. Repeating those measurements for a few heats at the forge's real temperatures and times gives rate constants for its own steels and furnaces, and allowances based on them can then be trimmed with confidence rather than padded with guesses.

## Controls

The forge controls scale and decarburisation in four ways:

- **time at temperature**: heating each blank just long enough to reach forging temperature through its section, and not leaving blanks waiting in the furnace;
- **temperature**: the lowest temperature that forges reliably;
- **atmosphere**: running the gas furnace slightly reducing, which slows oxidation, where the burners allow it;
- **descaling**: removing scale before forging, by a blast of water or a light blow, so that scale is not hammered into the surface, where it causes pits.

DS-40's forge logs the time each blank enters and leaves the furnace, so that any blank held too long can be identified.

## A failure case: the press breakdown

This is an illustration. During a run of DS-40 blanks, the forging press stopped for a hydraulic fault, and the blanks already in the furnace stayed there at about 1,200 °C for about **2 hours** while it was repaired. When forging resumed, the blanks were forged and normalised as usual.

At machining, several flanges showed black spots on the machined face that would not clean up within the allowance. The detection came at machining inspection; the cause came from the forge's furnace log, which showed the long hold for the batch. The arithmetic fitted: 2 hours at 1,200 °C gives about **0.47 mm** of scale and an upper-bound decarburised depth of about **2.2 mm**, against the allowance of about 1.6 mm per side set for a 20-minute heat.

Not every blank from the batch was affected equally. Blanks that had entered the furnace just before the breakdown had spent the longest at temperature and showed the worst spots; those loaded later were marginal; those still waiting outside the furnace were unaffected. The furnace log, read alongside the square-root law, sorted the blanks into those certainly scrap, those to be checked by a trial cut and those safe, which saved most of the batch.

The correction was to scrap the affected blanks rather than machine deeper and leave the flange undersize, and to change the forge's procedure: blanks held beyond a set time are withdrawn from the furnace, cooled and set aside for a separate decision rather than forged. The furnace log is now checked against the batch record before blanks are released to machining.

## How this applies to a small Australian business

Expect oxide scale on hot steel to grow with the square root of time and to rise steeply with temperature, and estimate it with x² = k_p t using real rate constants where you have them. Remember that decarburisation beneath scale usually reaches deeper than the scale itself. Set machining allowances on forged and heat-treated surfaces from scale, metal loss, decarburisation and dimensional tolerance together. Keep heating times short and temperatures as low as the process allows, log time at temperature, and treat blanks held too long as a separate decision.

## Exercise: a shorter, cooler heat

If DS-40's forge could heat the bar ends to **1,150 °C** for **15 minutes**, what scale would grow, using a rate constant interpolated by the 180 kJ/mol activation energy? How does it compare with the 0.19 mm of the standard heat?

**Worked answer.** From the 1,200 °C value, k_p at 1,150 °C (1,423.15 K) is about **3 × 10⁻¹¹ × exp(−(180,000 ÷ 8.314) × (1 ÷ 1,423.15 − 1 ÷ 1,473.15)) ≈ 1.8 × 10⁻¹¹ m²/s**. In 15 minutes, **x = √(1.8 × 10⁻¹¹ × 900) ≈ 0.13 mm**, about two-thirds of the standard heat's 0.19 mm. The saving comes from both factors: about a 40% lower rate constant and a quarter less time.
