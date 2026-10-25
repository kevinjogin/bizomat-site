---
book: forge-welding-by-the-numbers
chapterSlug: laminated-and-clad-metal
order: 9
title: "Laminated and clad metal"
description: "Count the layers in a restacked billet, see why very thin layers blur as carbon moves, estimate how much of a billet survives the forge, and follow forge welding into roll and explosion cladding."
draft: false
---

Forge welding can join more than two pieces at a time. Stack a dozen thin plates of two different steels, bring the stack to welding heat, and hammer it, and the stack becomes a single bar with a dozen layers inside. Draw that bar out, cut it, stack the pieces and weld them again, and the layers multiply. Etched, the finished steel shows the layers as a pattern of light and dark lines that can be twisted, cut and folded into almost any design. This pattern-welded steel, often loosely called Damascus steel, has been made for more than a thousand years, for blades whose beauty was part of their value. The same principle, forge welding layers of different metals into one, underlies the clad and laminated metals of modern industry.

This chapter explains how layers multiply, calculates layer thicknesses and the point at which they start to blur, estimates how much of a billet survives the welding and forging, describes how pattern welders keep oxygen out of a stack, and follows the principle into nickel cladding, roll bonding and explosion cladding.

## Making a billet

A pattern-welded billet starts as a stack of alternating plates, typically a high-carbon steel and a steel with nickel or manganese that etches differently. The plates are ground clean, stacked, held together, often by welding the corners or the edges with an electric welder, fluxed or sealed, and brought slowly to welding heat so that the whole stack is hot right through. The first weld is made with light, even blows or a press, starting at one end and working along, so that the flux and any air are squeezed out sideways rather than trapped. Once the stack has welded, it is drawn out to a long bar, cut into pieces, the cut faces cleaned, the pieces stacked and welded again, and so on until the layer count is reached.

## How layers multiply

Each restack multiplies the number of layers by the number of pieces stacked. A billet of 15 layers, drawn out, cut into four and restacked, has 60; repeated, 240; again, 960.

```figure
type: formula
title: Layers in a restacked billet
formula: layers = starting layers × (pieces per restack)^(number of restacks)
caption: This is an illustration for a billet that starts as 15 plates and is cut into four and restacked several times, finishing as a blade about 4 mm thick at its spine. Real billets lose a little at each restack where faces are ground and ends cropped.
- Starting stack | 15 plates
- Each restack | cut into 4 pieces
- Finished thickness | about 4 mm
step: after 1 restack: 15 × 4 = 60 layers, each about 4 ÷ 60 ≈ 0.067 mm in the blade
step: after 2 restacks: 240 layers, about 0.017 mm each
step: after 3 restacks: 960 layers, about 0.004 mm each
```

The numbers grow quickly. A few restacks take the layer count into the hundreds or thousands, and the layers in the finished blade become thinner than a hair. Folding, in which the bar is bent back on itself rather than cut and stacked, doubles the layers each time, so ten folds give 1,024 times the starting count.

```figure
type: bars
title: Layer thickness in a 4 mm blade by number of restacks
unit: micrometres per layer, starting from 15 layers and restacking by four
max: 280
caption: This is an illustration calculated from the formula above. A human hair is roughly 50 to 100 micrometres thick.
- No restack, 15 layers | 267
- 1 restack, 60 layers | 67
- *2 restacks, 240 layers | 17
- 3 restacks, 960 layers | 4
- 4 restacks, 3,840 layers | 1
```

## Why very thin layers blur

At welding heat, atoms move through steel. Carbon, a small atom, moves fastest, and in the time a billet spends at heat across several welding and forging cycles, carbon travels a distance that can be compared with the layer thickness. The distance an atom typically spreads grows with the square root of the diffusion coefficient times the time.

As an illustration, taking a diffusion coefficient for carbon in hot steel of about 10⁻¹⁰ m² per second, a rough value near welding heat, and ten minutes in total at that heat, carbon spreads over about √(10⁻¹⁰ × 600) ≈ 0.00024 m, about a quarter of a millimetre. Layers much thinner than that end up with almost the same carbon content as their neighbours, so the hard and soft layers of a high-carbon and low-carbon stack merge. Nickel and manganese move far more slowly, which is why pattern welders use a steel with nickel as one of their layers: the nickel stays put long after the carbon has evened out, and the etched pattern survives.

The practical lesson is that beyond a few hundred layers in a finished blade, the layers are largely visual. A blade of thousands of layers is not stronger or harder because of them; its properties are those of the averaged steel, and its pattern comes from the elements that have not moved.

## What survives the forge

Every welding and forging heat loses metal to scale, as Chapter 3 calculated, and every restack loses more to grinding the faces clean and cropping the ragged ends. A billet loses a significant share of its starting weight before it becomes a blade.

```figure
type: formula
title: Yield of a pattern-welded billet
formula: final mass ≈ starting mass × (1 − loss per cycle)^(number of cycles)
caption: This is an illustration with an assumed loss of about 6% per welding cycle, covering scale, face grinding and end cropping, over five cycles: the first weld and four restacks. Real losses vary with the smith, the fire and how much is ground away.
- Starting stack | about 1.5 kg
- Cycles | 5
- Loss per cycle | about 6%
step: fraction remaining ≈ 0.94⁵ ≈ 0.73
step: final billet ≈ 1.5 × 0.73 ≈ 1.1 kg
step: grinding and finishing the blade itself remove more again
```

A quarter of the steel is gone before the blade is shaped, and finishing removes more. Smiths making pattern-welded steel plan for that loss by starting with a larger stack than the finished piece needs, and price their work accordingly.

## Keeping oxygen out

A stack of plates has many interfaces, and each must be clean when it welds. Flux helps, but flux that fails to get out of the middle of a stack leaves a sheet of slag inside the billet, and an interface that scales before it closes leaves an unwelded layer that shows as a crack or delamination when the blade is ground. Pattern welders reduce the risk in several ways: grinding the plates bright and degreasing them before stacking; welding round the edges of the stack so that air cannot get between the plates once it is in the fire; and, in a modern technique, sealing the whole stack in a thin steel can, welded shut, so that the plates weld inside it without ever meeting the fire's atmosphere. Some smiths add a few drops of oil or kerosene inside the sealed stack, which burns off the trapped oxygen as the stack heats. Chapter 6 noted that stainless and other chromium steels, whose oxides borax barely touches, can be laminated only in such sealed or protected conditions.

## Hammer, press and roll

The first weld of a large stack needs pressure over its whole area at once, or at least along it steadily, so that the interfaces close before the stack cools. A hand hammer struggles; a power hammer or a hydraulic press is the usual tool, and many pattern welders have built their craft around a small press. The press squeezes the stack evenly, with less risk of shearing the layers sideways than a hammer's blows, and the slow squeeze pushes flux and air out to the edges. Rolling, passing a hot stack between powered rolls, does the same in industry.

## Three-layer blades

Not every laminated blade is a pattern. One of the oldest and most practical forms has just three layers: a hard, high-carbon steel core sandwiched between two jackets of softer iron or low-carbon steel. The core forms the cutting edge when the blade is ground; the jackets support it, absorb shocks that would crack a solid hard blade, and make the blade easier to sharpen and straighten. Traditional Japanese kitchen knives and Scandinavian woodworking tools are often made that way, and so are many modern factory blades, rolled from clad strip rather than forge welded by hand. The weld between core and jacket must be sound along its whole length, because a gap there becomes a crack at the edge when the blade is hardened.

## Making the pattern

The pattern in a pattern-welded blade comes from what is done to the layers after they are welded. A bar with straight layers, ground at a shallow angle, shows them as fine parallel lines. Twisting the hot bar, square in section, turns the layers into a spiral, which grinding reveals as a series of stars or ladders; cutting grooves across the bar and forging it flat bends the layers into rungs; stacking twisted bars side by side and welding them gives the complex patterns of old sword blades. Each operation is another heat, another loss of metal, and another chance of a failed weld, so complex patterns cost more steel and time as well as skill.

## Hardening laminated steel

A laminated blade is hardened and tempered like a solid one, but the layers can behave differently in the quench. Steels with different carbon contents and alloys contract by different amounts, and a blade with a hard core and soft jackets may bend as it cools; smiths straighten it while it is still warm, before tempering. A weak interface that has survived the forging may open in the quench, which is a final test of the billet's welds. Etching after hardening and polishing brings out the pattern, because the different steels react with the acid at different rates.

## Pattern-welded steel and crucible steel

The name Damascus is used for two quite different things. Pattern-welded steel is made by forge welding layers, as this chapter describes. The steel of the historical Damascus blades admired in medieval accounts was, according to most modern studies, a crucible steel, melted in small closed pots and forged with great care so that bands of carbides formed within it, giving a pattern without any layers being welded at all. Smiths and buyers who know the difference avoid a common confusion.

## Nickel on iron

Hart's book of 1910 recorded an industrial version of laminating: the making of nickel-clad iron. Sheets of nickel and iron, polished and fluxed, were brought to welding heat in hydrogen and welded between rolls without ever meeting air, so that neither metal could oxidise; the result could be rolled further without damage to the nickel surface, unlike nickel plate, which tended to peel. Hart also described Edison's continuous process, in which iron strip passed through chambers of hot hydrogen to clean and heat it, then through a nickel bath, and through a further hydrogen chamber at welding heat, before cooling in the same gas. Both processes used the forge welder's principle, clean surfaces brought together hot under pressure, with the cleanliness assured by a protective gas instead of a flux.

## Roll bonding and explosion cladding

Modern clad plate, a thick, cheap backing steel with a thin layer of stainless steel, nickel alloy, titanium or copper on one face, is made by the same principle on a large scale. In roll bonding, the two metals are cleaned, stacked, sealed round their edges, heated and rolled together, the heavy reduction in thickness welding them across their whole interface. In explosion cladding, the cladding plate is laid above the backing plate with a small gap and covered with an explosive, which, when detonated, drives the cladding onto the backing at such speed that the surface layers of both are jetted away, leaving clean metal that welds instantly under the enormous pressure. Clad plate is used for pressure vessels, heat exchanger tube plates and chemical equipment, where a thin, costly corrosion-resistant layer on a strong, cheap backing saves a great deal over solid alloy.

```figure
type: compare
title: Ways of bonding layers of metal in the solid state
cols: How cleanliness is assured | How pressure is applied | Typical use
caption: General comparison for teaching. Industrial cladding is made under procedures and tests set by the relevant product standards.
- Hand forge welding | flux and quick work | hammer or press | pattern-welded blades; tools with steel edges
- Sealed-can billet | stack sealed from the fire's atmosphere | press or power hammer | stainless and alloy laminates
- Hydrogen roll welding | protective gas, as Hart described | rolls | early nickel-clad iron
- *Roll bonding | cleaned, edge-sealed stack | heavy rolling reduction | clad plate and strip
- Explosion cladding | surfaces jetted away by the impact | explosive impact | thick clad plate; dissimilar metals
```

## The running case: a laminated knife class

This is an illustration. The shop runs a two-day class in pattern-welded knives. Students start with a 15-layer stack of a high-carbon steel and a nickel-bearing steel, its edges welded with a small electric welder, fluxed with anhydrous borax, and welded under the shop's small press. They restack by four twice, to 240 layers, and the owner explains with the arithmetic above why going further would add little but time. Each student's billet is weighed at the start and end; the shop's records show yields of about 65 to 75%, in line with the loss calculation, and the class fee is set to cover the steel lost.

## A failure: the hidden layer

This is an illustration. A student's billet looked perfect after its first restack, but when the finished blade was ground, a thin, dark line appeared along part of its length and, when the blade was flexed, it began to split along that line. One interface in the restack had not welded, probably because scale had formed on a cut face that had been left too long before stacking.

The blade could not be saved. The owner now has students grind and stack restacked pieces immediately after cutting, weld the stack's edges before it goes back in the fire, and inspect each billet's edges for open lines before drawing it out, so that a failed interface is found while it can still be cut away.

## Exercise: layers and their thickness

A smith starts with a 9-layer stack, folds it, doubling the layers each time, and finishes with a blade 5 mm thick. How many folds are needed to exceed 500 layers, and how thick is each layer in the blade? Taking a carbon spreading distance of about 0.25 mm, will the carbon contents of the layers still differ markedly?

After each fold, the layers double: 9, 18, 36, 72, 144, 288, 576. **Six folds** give **576 layers**, the first count above 500.

Each layer in a 5 mm blade is about 5 ÷ 576 ≈ 0.0087 mm, about **9 micrometres**. That is far thinner than the quarter-millimetre over which carbon spreads during the welding heats, so the carbon will have **largely evened out** between layers; the layers will show when etched only if one of the steels carries a slow-moving element such as nickel or manganese, and the blade's hardness will be that of the averaged steel.
