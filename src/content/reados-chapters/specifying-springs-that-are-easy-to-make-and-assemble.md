---
title: "Specifying springs that work, last and are easy to make and assemble"
description: "Springs look simple, yet poorly specified ones sag, break, jam in bores and slow assembly. How to calculate rate and stress, choose materials and ends, and specify springs makers can build."
publishDate: 2026-10-09
category: "Engineering"
tags:
  - design
  - manufacturing
  - product-development
author: "KEVOS®"
featured: false
draft: false
---

Springs are in almost every mechanical product: valves, latches, switches, actuators, seats, brakes, clutches, tools and machine guards. They are cheap, so they rarely get much design attention. A spring is often chosen from a catalogue because it looks about right, or drawn with every dimension fixed and tightly toleranced, leaving the spring maker no room to make it work.

The results show up in production and in service. Springs rub or jam in their bores because the outside diameter grows when compressed. They bottom out at full stroke and take a permanent set. They tangle in bins and slow assembly. They break in fatigue because the stress was too high for the number of cycles. Operators twist, force and improvise to fit them, and the problem is blamed on training when it was designed in.

This article explains how helical springs work, how to calculate rate, stress and coil numbers, how to choose materials and end types, how to design springs for fatigue and for assembly, and how to specify springs so makers can build them consistently. It is general information for designers, engineers and buyers. Spring makers and their published design data are valuable sources of advice for specific applications.

## Types of springs

- **Compression springs** resist being pushed together. They are the most common type.
- **Extension springs** resist being pulled apart, usually with hooks or loops at each end and an initial tension that holds the coils together.
- **Torsion springs** resist twisting, with legs that apply torque.
- **Disc springs**, also called Belleville washers, are conical washers that give high force in small deflections and can be stacked.
- **Wave springs**, **flat springs**, **constant force springs** and **gas springs** suit particular needs.

Buying a standard stock spring is usually cheaper and faster than designing one, and replacements are easier to find. Custom design is justified when no standard spring meets the requirement, but the calculation methods are still useful for checking that a stock spring is being used within its limits.

## Rate, preload and deflection

A spring deflects in proportion to the force applied, within its elastic range. The **spring rate**, or stiffness, is the force divided by the deflection, usually in newtons per millimetre.

Most springs are fitted with a **preload**, a force already present when the mechanism is at rest. Consider a valve spring that must push with 200 N when the valve is closed and 250 N when it is open, with 8 mm of movement between the two. The change in force is 50 N over 8 mm, so the rate is 6.25 N/mm. To give 200 N when closed, the spring must already be compressed 32 mm, and at full opening it is compressed 40 mm.

## Spring index and stress

The **spring index** is the mean coil diameter divided by the wire diameter. Most engineering springs have an index between about 4 and 12 or so. Low indices are hard to coil and highly stressed on the inside of the coil; high indices are flimsy, tangle easily and vary more in manufacture.

A compression spring's wire is stressed mainly in torsion, with an additional effect from coil curvature. The maximum stress is 8 times a correction factor times the load times the mean diameter, divided by π times the wire diameter cubed. The **Wahl correction factor**, which depends on the spring index, accounts for curvature and direct shear and is always greater than one.

For a 300 N load on a spring of 4 mm wire and 40 mm mean diameter, the index is 10, the Wahl factor about 1.145 and the stress about 547 MPa. Two points matter: the calculation uses the actual load, not the change in load; and stress does not depend on the number of coils. Coil count sets the rate, not the stress.

The number of **active coils** needed for a given rate is the wire's shear modulus times the wire diameter, divided by 8 times the index cubed times the rate. With spring steel at about 79 GPa, 4 mm wire, an index of 10 and a rate of 6.25 N/mm, about 6.3 active coils are needed, which would be rounded to 6.5. Compression springs with squared and ground ends usually have one inactive coil at each end, so total coils are active coils plus two.

## Allowable stress, fatigue and service duty

The allowable stress depends on the wire material, the wire diameter, with thinner wire being stronger, and the number of cycles the spring must survive. Spring design data commonly group springs into service classes:

| Service | Approximate number of cycles | Examples |
|---|---|---|
| Light | Up to about 10,000 | Safety devices, seldom-used mechanisms |
| Average | About 10,000 to 1,000,000 | Most machine, switch and product springs |
| Severe | More than 1,000,000 | Valve springs, fast cycling mechanisms |

Severe service needs much lower stresses than light service. Fatigue cracks usually start at surface flaws, so **shot peening**, which puts the wire surface into compression, can raise allowable fatigue stresses substantially. **Presetting**, compressing a spring beyond its working length during manufacture, removes initial settling and raises its static load capacity. Use the spring maker's published allowable stresses for the chosen material, size and duty, with a margin.

## Materials

| Material | Characteristics | Typical uses |
|---|---|---|
| Patented cold-drawn carbon steel wire | Economical, good strength | General-purpose springs |
| Music wire | Very high strength in small sizes | Small, highly stressed springs |
| Oil-tempered carbon and alloy steel wire | Consistent properties, larger sizes | Machine springs |
| Chrome-silicon and chrome-vanadium steel | High fatigue strength, moderate temperatures | Valve springs, heavy-duty fatigue applications |
| Stainless steel | Corrosion resistance; lower strength than the best carbon steels | Food, marine and medical equipment |
| Phosphor bronze and beryllium copper | Electrical conductivity, non-magnetic, corrosion resistance | Electrical contacts, instruments |
| Nickel alloys | High temperature and corrosion resistance | Process and high-temperature equipment |

Large, heavy springs are often **hot coiled** from bars and then heat treated. Coatings and platings protect carbon steel springs, but electroplating high-strength spring steel can cause **hydrogen embrittlement**, so plated springs need baking or a coating method that does not introduce hydrogen.

## End types and buckling

Compression spring ends affect how the spring sits, feeds and loads:

- **Open ends** are cheapest but sit unevenly, snag and tilt.
- **Closed, or squared, ends** sit better and tangle less.
- **Closed and ground ends** sit flat and square, load evenly and feed reliably in automated assembly.

Long, slender compression springs can **buckle** sideways under load. As a rough guide, springs whose free length is more than about four times their mean diameter should be checked for buckling and may need guiding in a bore or over a rod.

## Extension and torsion springs

**Extension springs** are wound with initial tension, so a minimum force is needed before the coils separate. The hooks or loops are usually the weakest point, because of bending stresses where they are formed. Specify hook shapes that suit the duty and check hook stresses as well as coil stresses.

**Torsion springs** tighten as they are loaded: the coil diameter reduces and the body length increases. Allow clearance over any mandrel or rod, and support the legs so they do not bend.

## Designing springs for assembly

Many spring problems appear on the assembly line rather than in calculations. A practical checklist:

- **Define the assembly environment first**: is the spring in a bore, over a shaft or free standing? What are the bore or shaft sizes and tolerances? Will it be hand placed, fed automatically or pre-assembled?
- **Check outside diameter growth**: a compression spring's outside diameter increases slightly as it is compressed. Check clearance in the bore at maximum compression with worst-case tolerances, allowing a margin, commonly around 10% of the diameter.
- **Choose ends for the assembly method**: closed and squared as a minimum for manual assembly, closed and ground for automatic feeding or critical alignment.
- **Keep the spring index in a practical range**, avoiding very high indices that tangle and very low indices that are hard to make.
- **Keep clear of solid height**: at maximum working deflection, keep a margin above the solid height, commonly 10 to 15% of the deflection, including tolerances, so the spring never bottoms out.
- **Prevent tangling**: closed ends, sensible indices and suitable packaging reduce tangling in bins.
- **Prototype in the real assembly**: test with real operators or equipment, watching for hesitation, awkward hand positions and improvised workarounds.

If an operator must twist, force, hunt for orientation or compress a spring with an improvised tool, the problem is usually design, not training. Springs also store energy, so assembly methods must control the risk of springs releasing suddenly.

## Specifying springs

A spring specification should leave the spring maker room to adjust the details that control consistency. Spring makers generally adjust free length and coil count to achieve the required loads, because wire properties vary from batch to batch. Over-specifying every dimension with tight tolerances makes the spring hard or impossible to make consistently.

A good specification states:

- **Material and wire diameter.**
- **The controlling diameter**: outside diameter for springs in bores, inside diameter for springs over shafts, with tolerance.
- **Loads at specified lengths**, usually two working points, with tolerances. These are the functional requirements.
- **Free length as a reference** if loads are specified.
- **End type**, **total coils as a reference** and **direction of winding** if it matters.
- **Maximum solid height.**
- **Treatments**: stress relieving, presetting, shot peening and finish.
- **Cycle life and testing**, where fatigue matters.

The [notes on prototyping](/reados/collections/product-development-and-launch/notes-on-prototyping/) article covers testing early designs in realistic conditions, which applies well to springs and their assembly.

## A worked example

This is an illustrative example. A business assembles about 20,000 valve actuators a year. Each contains a compression spring fitted by hand into a bore. Operators report that springs sometimes stick, tilt or tangle, and assembly takes about 40 seconds per actuator. A share of actuators fail final testing because the spring rubs in the bore, and some springs take a set after a few months in service.

**Review.** The engineer and a spring maker examine the design. The spring's outside diameter grows enough under full compression to rub in the bore at worst-case tolerances. At full stroke, the spring is within a few per cent of solid height. The ends are open. The drawing specifies free length, rate, coil count and both diameters, all tightly toleranced.

**Changes.**

- The coil diameter is reduced slightly, keeping the index around 9, to give clearance in the bore at maximum compression.
- Wire diameter and coils are adjusted to keep stress within the average service allowance and to leave about 15% margin above solid height at full stroke.
- Ends are changed to closed and ground.
- The spring is shot peened and preset.
- The drawing now specifies loads at the installed and fully compressed lengths, the outside diameter with tolerance and maximum solid height, with free length and total coils as reference values.

**Result.** Assembly time falls to about 25 seconds, saving about 15 seconds on each of 20,000 actuators, or roughly 83 hours a year. Test failures from rubbing stop, and springs no longer take a set in service. The spring costs slightly more, but far less than the time and rework saved. As the [cost you commit before you spend](/reados/collections/specifications-product-quality-and-sustainability/the-cost-you-commit-before-you-spend/) article explains, such costs are cheapest to remove at the design stage.

## Applying this in an Australian business

- **Use stock springs** where they meet the need, and check them with the same calculations.
- **Calculate rate, stress and coils**, using the actual loads.
- **Choose allowable stresses** for the material, wire size and service duty.
- **Check diameter growth, solid height and buckling.**
- **Choose ends** for the assembly method.
- **Specify loads at lengths** and the controlling diameter, leaving makers room to adjust.
- **Consider shot peening and presetting** for demanding duty.
- **Test springs in the real assembly.**

## Where spring design goes wrong

- **Every dimension tightly toleranced**, leaving no room to adjust.
- **Springs that bottom out** at full stroke.
- **No allowance for diameter growth** in bores.
- **Open ends** in hand or automated assembly.
- **Stresses suited to light duty** in high-cycle applications.
- **Plating high-strength springs** without embrittlement control.
- **Blaming operators** for spring assembly problems.

## Questions to ask about a spring

- What loads are needed at which lengths, and how many cycles must it survive?
- Is the stress within the allowable stress for this material, size and duty?
- What clearance remains in the bore at full compression, and above solid height?
- Which end type suits the assembly method?
- Does the specification leave the maker room to hold the loads?
- Have we tried it in the real assembly?

## Bringing it together

Springs reward a little engineering. Calculate rate from the required loads, stress from the actual load and the index, and coils from the rate. Choose materials and allowable stresses for the duty, and use shot peening and presetting for demanding applications. Check diameter growth, solid height and buckling, choose ends for the assembly method and test in the real assembly. Specify functional loads at lengths and controlling diameters, leaving the spring maker room to hold them. The result is springs that work, last and go together without a fight.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® engineering handbooks on helical spring design, spring materials, design stresses and fatigue, disc springs, and spring design for assembly, together with established spring engineering practice. The worked example is illustrative. This article is general information; use spring makers' design data for specific applications.*
