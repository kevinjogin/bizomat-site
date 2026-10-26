---
book: rubber-parts-by-the-numbers
chapterSlug: what-rubber-does-differently
order: 1
title: "What rubber does that metal does not"
description: "See why rubber stretches so far, keeps its volume and gets stiffer as it warms, set out the test plug's requirements, and catch a linear calculation that called a dangerous inflation safe."
draft: false
---

A steel part is designed for strains of a fraction of a per cent. Beyond that it yields, and the design has failed. A rubber part routinely works at strains of tens or hundreds of per cent and springs back when released. That one difference changes almost every calculation a designer makes. Hooke's law, with its fixed modulus and straight-line stress–strain curve, is a fair description of steel and a poor one of rubber beyond about 20% strain. Volume, which steel changes slightly under load, rubber keeps almost exactly. And the source of stiffness itself is different: steel resists deformation because stretching its atomic bonds stores energy, while rubber resists mainly because stretching its long molecules makes them less disordered, an effect of entropy.

This chapter sets out those differences in numbers, introduces the running case, a rubber test plug, and lists what the plug must do. It ends with a calculation, done the steel way, that would have certified a dangerous use of the plug as safe.

## Long molecules, loosely tied

Rubber is a network of very long, flexible polymer chains, tied together at intervals by cross-links formed when the compound is cured. In the unstretched state, each chain between cross-links is a random coil. Stretching the rubber straightens the coils. Straighter chains have fewer possible shapes, which means lower entropy, and the material resists in the same way that a gas resists compression: thermal motion keeps pushing the chains back towards their more probable, coiled state.

Three engineering consequences follow from that picture.

1. **Large reversible stretch.** A chain can be straightened a long way before its bonds themselves are loaded, so rubber reaches several times its original length before breaking. Typical natural rubber compounds stretch to between five and eight times their length at break, depending on the recipe.
2. **Stiffness that rises with temperature.** If stiffness comes from thermal motion, more thermal motion means more stiffness. For an ideal rubber, the shear modulus is proportional to absolute temperature. Chapter 7 puts numbers on it and on the related thermoelastic effect, the warming of rubber when it is stretched quickly.
3. **Strain stiffening.** As chains approach full extension, the network stiffens sharply. That upturn in the stress–stretch curve, which Chapter 3 models, is what eventually stops an inflated rubber part from growing without limit, often only just before it bursts.

## Volume does not change

Rubber is very hard to compress and very easy to shear. Its bulk modulus, the resistance to change of volume, is of the order of 2,000 MPa, close to that of water. Its shear modulus is around 1 MPa. The ratio is more than a thousand, which means that in almost every practical deformation the rubber changes shape at practically constant volume. Engineers express this by saying rubber is incompressible, or that its Poisson's ratio is very close to 0.5.

Constant volume is a powerful design tool, because it ties every dimension to every other. A rubber strip stretched to twice its length must shrink in cross-section to half its area. A sheet stretched equally in two directions by a factor of 1.25 must thin to 1 / 1.25² = 0.64 of its thickness. TP-100's sleeve, which inflates from a mean radius of 42 mm to about 48 mm, must thin from 4 mm to about 3.5 mm. Chapter 4 works these out properly.

```figure
type: compare
title: Steel and rubber compared as engineering materials
cols: Structural steel | Natural rubber compound
caption: This is an illustration using round, typical values. A specific compound's data sheet and tests take precedence. The contrast, not the exact numbers, is the point.
- Young's modulus | about 200,000 MPa | about 1 to 6 MPa, from hardness
- Strain in normal service | well under 0.2% | 10% to over 100%
- Strain at break | 20% to 30%, after yielding | 400% to 700%
- Poisson's ratio | about 0.3 | about 0.5, volume nearly constant
- Stiffness as temperature rises | falls slowly | rises in proportion to absolute temperature, until the compound degrades
- Stress–strain curve | linear to yield | curved from the start, stiffening at large stretch
```

## The running case: TP-100

This is an illustration. TP-100 is an inflatable test plug for a pipe with a 100 mm bore. Its working part is a plain rubber sleeve, 88 mm outside diameter and 4 mm thick, so its mean radius is 42 mm. The sleeve is clamped at each end to a metal end plate; the plates are held 120 mm apart by a central tube that also carries the inflation air. Inflated to 150 kPa gauge, the sleeve expands until it meets the pipe wall, and the remaining pressure becomes contact pressure, which seals the pipe and grips it by friction.

The plug is used to close a pipe while a length of drainage is filled with water and held under a test head. The water pushes on the plug's end plate, and the plug must not slide. It is also handled roughly on site, inflated and deflated hundreds of times, left in pipes overnight, and used in summer heat and winter cold.

```figure
type: checklist
title: What TP-100 must do
caption: This is an illustration. The manufacturer's own targets for its fictional plug. Real products carry their makers' tested ratings, and plumbing tests follow the applicable standard and authority.
- ? Seal a 100 mm bore at 150 kPa inflation | with contact pressure all round
- ? Hold against the test head | grip at least three times the end thrust, with friction uncertain
- ? Work from 5 °C to 40 °C | in pipes and in sun
- ? Survive 500 inflations | without cracks, set or loss of grip
- ? Fail safe if misused | never inflated outside a pipe; warning and design both address it
- ? Be checked before use | hardness, visible condition, and an inflation test
```

## Not a linear spring

The habit most likely to mislead a designer new to rubber is treating it as a linear spring with a Young's modulus, because that is how every other structural material is first taught. For small strains, under 10% or so, the linear picture is adequate. TP-100 works at about 15% hoop stretch in the pipe and, if misused, at several hundred per cent in free air. At those strains the linear picture is not just inaccurate; it can get the character of the behaviour wrong.

The next chapters replace the single modulus with a strain energy function, a formula for the energy stored per unit volume as a function of stretch. The simplest, the neo-Hookean model, has one constant, the shear modulus G, which for TP-100's 50 Shore A compound is about 0.82 MPa. It predicts the curved stress–stretch response of rubber reasonably well up to moderate stretches and captures the most important effect for inflated parts: the existence of a pressure limit. Better models, used in Chapters 3 and 5, add the strain stiffening of real rubber at large stretch.

Rubber is also not perfectly elastic. Load it and unload it, and the unloading curve lies below the loading curve; the area between them is energy turned into heat, called hysteresis. Filled compounds show more of it than unfilled ones, and most compounds are noticeably stiffer and more lossy in their first few cycles than afterwards, an effect that rubber testers allow for by cycling a specimen a few times before measuring. For TP-100, which is inflated slowly and held, hysteresis matters mainly in testing; for parts that flex rapidly, such as tyres and vibration mounts, it governs heat build-up.

## The error: a linear calculation that called misuse safe

This is an illustration. During TP-100's design review, a reviewer asked what would happen if a user inflated the plug in open air, outside a pipe, as people do when checking for leaks. The design engineer, used to steel pressure vessels, answered with a thin-cylinder calculation using Hooke's law. With Young's modulus E = 2.46 MPa for the 50 Shore A compound and a Poisson's ratio of 0.5, the hoop stiffness of a long cylinder with its ends held is E / (1 − ν²) = 3.27 MPa. Hoop strain under a pressure p is then p × r / (3.27 × t).

At 150 kPa, that gives a hoop strain of 0.150 × 42 / (3.27 × 4) = 0.48, a stretch of 1.48. The calculation said the sleeve would grow from 84 mm to about 124 mm mean diameter and stop there, larger than any pipe it fits, but finite. The engineer reported that free inflation was "not ideal but contained".

A colleague with rubber experience redid the calculation with the neo-Hookean model, as Chapter 5 sets out. For a sleeve whose ends are held, the pressure the sleeve can resist rises with stretch but never exceeds a limit of G × t / r = 0.819 × 4 / 42 = 0.078 MPa, or 78 kPa. At 150 kPa, almost twice that limit, there is no stretch at which the sleeve can balance the pressure. It does not stop at 124 mm. It keeps growing, thinning as it goes, until either the rubber's strain stiffening catches it at an enormous size or, far more likely, it bursts.

The linear model was not slightly wrong; it was wrong in kind. A linear spring always finds an equilibrium under a steady load, because its resistance keeps rising. Inflated rubber does not, because as it grows its wall thins and its radius increases, both of which reduce the pressure it can resist, faster than its stiffness rises. The review recorded the finding as the most important number in the project: **TP-100 must never be inflated to 150 kPa unless it is inside a pipe**. Chapter 5 follows the consequences for the design, the instructions and the test procedure.

```figure
type: compare
title: Pressure to hold TP-100's sleeve at a given stretch, two models
cols: Linear, Hooke's law | Neo-Hookean
caption: This is an illustration for a 4 mm sleeve of 42 mm mean radius with its ends held, E = 2.46 MPa and G = 0.82 MPa. The linear model's pressure keeps rising; the rubber model's levels off below 78 kPa, so 150 kPa has no equilibrium in free air.
- Stretch 1.15, in the pipe | 46.5 kPa | 33.2 kPa
- Stretch 1.5 | 155.9 kPa | 62.6 kPa
- Stretch 2 | 311.9 kPa | 73.1 kPa
- *Stretch 3 | 623.8 kPa | 77.0 kPa
```

The linear model was also wrong in the normal case. For the in-pipe stretch of about 1.15, it predicts that the sleeve needs 46 kPa to reach the pipe wall, against the neo-Hookean model's 33 kPa. The 40% overestimate was conservative for sealing, which is why the error had not been noticed earlier, but it shows the linear model's error growing even at modest stretch.

## How rubber parts fail

Rubber parts rarely fail the way metal parts do, by yielding or by a crack growing from a sharp corner under a calculated stress. Their failures are usually one of five kinds, and each has a chapter in this book:

- **Instability.** An inflated part reaches a pressure it cannot resist and grows until it bursts. This is the most dangerous failure and the least intuitive, and Chapter 5 is devoted to it.
- **Loss of force over time.** Rubber held stretched or compressed slowly relaxes, so a seal or grip that was tight on day one is looser on day one hundred. Chapter 8 deals with relaxation and set.
- **Temperature.** Stiffness changes with temperature, trapped air changes pressure with temperature, and at low temperatures many compounds stiffen sharply as they approach their glass transition. Chapter 7 covers all three.
- **Surface cracking.** Ozone in the air attacks stretched rubber, especially natural rubber, producing fine cracks at right angles to the stretch. A part left stretched in storage can crack without ever being used.
- **Tearing and wear.** A cut or nick in stretched rubber grows quickly, which is why stretched rubber parts must be handled away from sharp edges and inspected for damage before use.

Very few of these failures are caught by a stress calculation alone. They are caught by understanding the material, setting limits on how it is used, and testing. For TP-100, the requirements checklist above is really a list of these failure modes turned into targets.

### Rubber is a family, not a material

"Rubber" covers many compounds: natural rubber, styrene-butadiene, nitrile, neoprene, EPDM, silicone and fluoroelastomers, each mixed with fillers, oils, cure systems and protective additives. Their stiffness at a given hardness is broadly similar, which is why hardness is a useful first number, but their resistance to oil, ozone, heat and cold differs enormously. TP-100 uses natural rubber for its high stretch and tear resistance; a plug for oily pipelines would need a nitrile compound, and one for hot water a compound rated for the temperature. The supplier's data sheet for the specific compound is the source for every property this book estimates.

## What the rest of the book does

With the differences in mind, the chapters follow the plug's design in order:

- Chapter 2 estimates the compound's stiffness from its hardness, the number a rubber supplier actually quotes.
- Chapters 3 and 4 calculate stress and thickness at large stretch in one and two directions.
- Chapter 5 finds the pressure limit and designs around it.
- Chapter 6 turns the inflation pressure into contact pressure, friction and holding force.
- Chapters 7 and 8 deal with temperature, relaxation, set, ageing and ozone, which change the numbers over a day and over a life.
- Chapter 9 tests the plug before it is trusted.

Each chapter follows TP-100 with real numbers and checks them, because rubber's behaviour is counter-intuitive enough that intuition alone is a poor guide.

## Exercise: constant volume

A strip of TP-100's rubber, 10 mm wide, 4 mm thick and 100 mm long, is stretched to 250 mm long. Assuming constant volume and that width and thickness shrink equally:

1. What are its new width and thickness?
2. If it carried a force of 30 N at that length, what would its true stress be, and its nominal stress based on the original area?

**Worked answer.**

1. The stretch is 250 / 100 = 2.5. At constant volume, the cross-section's area falls by the same factor: 40 / 2.5 = 16 mm². Width and thickness each shrink by √2.5 = 1.581, to **6.32 mm** and **2.53 mm**.
2. True stress is force over current area: 30 / 16 = **1.88 MPa**. Nominal stress is force over original area: 30 / 40 = **0.75 MPa**. The two differ by the stretch itself, 2.5 times. In rubber, where stretches are large, it always matters which stress a data sheet, a model or a test report is quoting; Chapter 3 returns to this.
