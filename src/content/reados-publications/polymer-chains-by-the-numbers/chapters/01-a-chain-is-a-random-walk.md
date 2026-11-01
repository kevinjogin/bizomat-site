---
book: polymer-chains-by-the-numbers
chapterSlug: a-chain-is-a-random-walk
order: 1
title: "A chain is a random walk"
description: "Count the units and bonds in a polymer chain, estimate its coil size from a random walk with a characteristic ratio, and see why chains are coils a twentieth of their stretched length."
draft: false
---

A single chain of the workshop's polystyrene, at a molar mass of 250,000 g/mol, contains about 2,400 styrene units joined end to end. Its backbone is about 4,800 carbon–carbon bonds long. Laid out straight, it would stretch about 604 nanometres, longer than the wavelength of green light. Yet in a melt, a solid or a solution that does not swell it, the chain occupies a loose coil only about 33 nm from end to end. The reason is that each bond can point in several directions relative to the last, so the chain's path is a random walk, and a random walk of n steps travels only about √n steps from where it started.

That one idea gives the size of a chain from its molar mass, explains why moulded parts shrink unevenly and why stretched rubber pulls back, and sets the length scale for everything later in this book: how far chains must mix across a cemented joint, how much a solvent swells them, and when they start to overlap in solution. This chapter builds it from the chain's chemistry, with one stiffness factor added to make a real chain from an ideal one, and ends with a joint calculation that used the stretched length instead of the coil size.

## Units, bonds and molar mass

A polystyrene chain is built from styrene units, C₈H₈, each with a molar mass of 104.15 g/mol. The number of units in a chain, its degree of polymerisation N, is its molar mass divided by the unit's: for 250,000 g/mol, N = 250,000 ÷ 104.15 = **2,400**. Each unit contributes two carbon–carbon bonds to the backbone, so the backbone has n = 2N = **4,801 bonds**, each 0.154 nm long. The side groups, the benzene rings that hang off every second carbon, do not lengthen the backbone, but they make it bulkier and stiffer, which matters below.

Real resins contain chains of many lengths, so "a chain of 250,000 g/mol" is a convenient representative, not a description of every chain. Chapter 2 deals with the spread. For now, take one chain of the resin's weight-average molar mass and ask how big it is.

## The freely jointed chain

The simplest model treats the backbone as n rigid links of length l joined by perfectly free hinges, so that each link points in a random direction, independent of the one before. The vector from one end to the other is the sum of n random vectors. Its average is zero, since it is equally likely to point in any direction, but its mean square is not: the cross terms between different links average to zero because the links are independent, leaving only the n squared lengths. So the mean square end-to-end distance is R² = n l², and the typical end-to-end distance is

R = √n × l.

```figure
type: svg
title: A random walk on a square grid
alt: A wandering line of 90 equal steps on a square grid, folding back and crossing over itself many times. A dashed arrow joins its start to its end, spanning only about three steps although the path itself is 90 steps long.
caption: Ninety random steps of equal length, each in line with or at right angles to the last. This walk ends about 3 steps from its start; averaged over many walks, the root-mean-square distance is √90 ≈ 9.5 steps, with large scatter from one walk to the next. This ideal walk crosses itself freely; Chapter 3 shows what changes when a real chain cannot.
viewbox: 0 0 320 260
body:
<path class="ln" d="M166 174L148 174L148 192L148 210L148 228L130 228L130 210L112 210L94 210L94 192L94 174L112 174L130 174L130 156L130 138L130 120L112 120L112 138L94 138L76 138L58 138L40 138L40 156L58 156L58 138L76 138L94 138L112 138L112 120L112 102L130 102L148 102L148 120L148 138L166 138L166 156L166 174L184 174L202 174L202 192L184 192L184 174L184 156L166 156L166 174L184 174L202 174L220 174L220 192L238 192L238 174L220 174L202 174L202 192L220 192L238 192L256 192L274 192L274 174L256 174L256 156L256 138L256 120L238 120L238 102L220 102L220 84L202 84L184 84L184 102L166 102L166 84L148 84L130 84L130 66L130 48L130 30L148 30L148 48L148 66L148 84L148 102L130 102L130 120L130 138L112 138L112 120L130 120L130 138L148 138L148 120"/>
<path class="la dsh" d="M166 174L148 120"/>
<circle class="fa" cx="166" cy="174" r="5"/>
<circle class="fa" cx="148" cy="120" r="5"/>
<text class="txs" x="174" y="170">start</text>
<text class="txs" x="156" y="116">end</text>
<text class="txs" x="40" y="252">90 steps; end-to-end about 3 steps</text>
```

For the workshop's chain, √4,801 × 0.154 = **10.7 nm**. That result has the most important feature of every random walk: the size grows only as the square root of the number of steps. A chain four times as long is only twice as big.

## Making the chain real: the characteristic ratio

Real backbones are not freely jointed. Each carbon–carbon bond makes a fixed angle of about 109.5° with the next, and rotation about each bond is hindered, especially when bulky side groups clash. Both effects make successive bonds tend to point in similar directions, so the chain wanders less and spreads further than the freely jointed model predicts. Because those correlations die away after a few bonds, the square-root law survives, only with a larger prefactor:

R² = C∞ × n × l².

The constant C∞, called the characteristic ratio, measures how much stiffer the real chain is than a freely jointed one. It is a property of the chemistry and is found by experiment. Flexible chains such as polyethylene have values around 7, and polystyrene's bulky rings give it a larger value. This book uses a teaching value of **9.5** for polystyrene, of the size reported for it in polymer physics texts; real work should use a measured value.

```figure
type: formula
title: The size of an ideal polymer coil
formula: R = √(C∞ × n) × l     Rg = R ÷ √6
caption: Valid for chains long enough to be random walks, in a melt, a solid or a solvent that neither swells nor shrinks them (Chapter 3). The characteristic ratio here is a teaching value for polystyrene.
- n | backbone bonds: 2 × molar mass ÷ 104.15 for polystyrene
- l | backbone bond length, 0.154 nm for carbon–carbon
- C∞ | characteristic ratio, 9.5 as a teaching value
- Rg | radius of gyration: root-mean-square distance of the chain's segments from its centre
step: n = 2 × 250,000 ÷ 104.15 = 4,801 bonds
step: R = √(9.5 × 4,801) × 0.154 = 213.6 × 0.154 = 32.9 nm
step: Rg = 32.9 ÷ √6 = 13.4 nm
```

For the workshop's chain, R = √(9.5 × 4,801) × 0.154 = **32.9 nm**, three times the freely jointed estimate. Its radius of gyration, the root-mean-square distance of the chain's segments from its centre of mass, is smaller by √6 for an ideal chain: **13.4 nm**. Radius of gyration is what light and neutron scattering measure, and it is the natural measure of a coil's size when comparing it with a concentration or a joint.

## The Kuhn segment

A useful way to picture a real chain is to replace it with a freely jointed chain that has the same end-to-end distance and the same fully stretched length. The links of that equivalent chain are called Kuhn segments.

The fully stretched length, or contour length, of a carbon backbone with tetrahedral bond angles is n × l × sin(109.5° ÷ 2) = 4,801 × 0.154 × 0.8165 = **604 nm**, because a fully extended chain is a zigzag, not a straight line. The Kuhn length b must satisfy both R² = N_K b² and N_K b = 604 nm, so b = R² ÷ 604 = 32.9² ÷ 604 = **1.79 nm**, and the chain has N_K = 604 ÷ 1.79 = **337** Kuhn segments. Each Kuhn segment is about seven styrene units, or 742 g/mol.

```figure
type: stats
title: One 250,000 g/mol polystyrene chain in numbers
caption: Teaching value C∞ = 9.5. The coil's end-to-end distance is about an eighteenth of its stretched length, which is why moulding flow can stretch chains so far and why they shrink back when they can.
- 2,400 | styrene units | 104.15 g/mol each
- 4,801 | backbone bonds | 0.154 nm each
- 604 nm | contour length | fully stretched zigzag
- * 32.9 nm | end-to-end distance | random-walk coil
- 13.4 nm | radius of gyration | R ÷ √6
- 1.79 nm | Kuhn length | 337 segments of about 742 g/mol
```

The Kuhn picture is useful because it separates two scales. Below about 2 nm the chain is a stiff, locally ordered object governed by its chemistry. Above that it is a random walk of 337 independent steps, and its large-scale behaviour no longer depends on the chemistry at all, except through b. Physicists call this universality: every long flexible chain, whatever it is made of, has the same large-scale shape, and its size grows as the square root of its length. Only the prefactor changes from polymer to polymer.

## Size against molar mass

The square-root law makes chain size easy to estimate across a resin's whole range of molar masses. Doubling the molar mass multiplies the coil size by √2 = 1.414.

```figure
type: compare
title: Ideal coil size of polystyrene chains by molar mass
rowhead: Molar mass
cols: Backbone bonds | End-to-end R | Radius of gyration Rg | Contour length
caption: R = √(9.5 n) × 0.154 nm with the teaching characteristic ratio. Both sizes grow as the square root of molar mass; the contour length grows in direct proportion.
- 20,000 g/mol | 384 | 9.3 nm | 3.8 nm | 48 nm
- 100,000 g/mol | 1,920 | 20.8 nm | 8.5 nm | 241 nm
- 215,000 g/mol (regrind) | 4,129 | 30.5 nm | 12.4 nm | 519 nm
- * 250,000 g/mol (virgin) | 4,801 | 32.9 nm | 13.4 nm | 604 nm
- 1,000,000 g/mol | 19,200 | 65.8 nm | 26.9 nm | 2,415 nm
```

## Coils share their space

A random-walk coil is mostly empty of its own segments. Treat the workshop's chain as filling a sphere of radius equal to its radius of gyration, 13.4 nm. That sphere's volume is 4 ÷ 3 × π × (13.4 × 10⁻⁹)³ = 1.01 × 10⁻²³ m³. The chain itself has a mass of 250 ÷ (6.022 × 10²³) = 4.15 × 10⁻²² kg, so its own segments fill the sphere at a density of only about 41 kg/m³. Solid or molten polystyrene has a density of about 1,050 kg/m³, so the rest of the sphere, about 96% of it, must be filled by segments of other chains. Roughly 26 different chains pass through the volume of any one coil.

This interpenetration is the most important structural fact about a polymer melt or glass. Because the number of chains sharing a coil's volume grows as the square root of chain length, about 51 for a 1,000,000 g/mol chain, long chains are thoroughly tangled with their neighbours, and that tangling is what gives polymers their toughness, their high melt viscosity and their rubbery behaviour above the glass transition. Chapter 6 shows how the tangling makes melt viscosity rise with the 3.4 power of chain length once chains are long enough to entangle. It also explains why chains in a melt behave as ideal random walks: each segment is surrounded mostly by other chains' segments, so it has no particular reason to avoid its own.

## Coils as springs

A random-walk coil resists being stretched, not because its bonds strain but because there are far more crumpled arrangements of the chain than stretched ones. Pulling the ends apart reduces the number of available arrangements, and so the chain's entropy, and the chain pulls back. For an ideal chain held at an end-to-end extension x, the restoring force is approximately

f = 3 k T x ÷ R²,

where k is the Boltzmann constant and T the absolute temperature. At 25 °C, k T = 4.12 × 10⁻²¹ J. Holding one 250,000 g/mol polystyrene chain 10 nm further apart than its relaxed size takes 3 × 4.12 × 10⁻²¹ × 10 × 10⁻⁹ ÷ (32.9 × 10⁻⁹)² = **0.11 pN**, a tiny force. But a cubic millimetre of polymer contains about 2.5 × 10¹⁵ such chains, and their combined pull is what makes a stretched rubber band snap back and what drives a moulded part to shrink unevenly when it is reheated. The force is proportional to temperature, a signature of entropy rather than bond energy, which is why rubber stiffens slightly as it warms. Rubber Parts by the Numbers takes that idea into real seals and sleeves.

The same entropic spring explains frozen-in orientation in moulded parts. Melt flowing into a thin wall is sheared and stretched, the coils elongate, and if the wall freezes before they relax, the stretched shape is locked in. Clear polystyrene shows this as birefringence under polarised light, and the locked-in stretch shows as extra shrinkage along the flow direction when the part is heated near its softening point. Both are consequences of the gap between a coil's 33 nm size and its 604 nm contour.

## The error: the stretched length taken as the chain size

This is an illustration. A process engineer at the workshop was writing a note on why some solvent-cemented joints were weak. Their argument was that a joint becomes as strong as the parent material only when chains from each side have mixed across the interface over a distance comparable to the chain size. Taking "the chain size" as the contour length, they concluded that chains would need to diffuse about 600 nm across the joint, and recommended doubling the clamping time.

A colleague checked the size with a simple observation. Coils 600 nm across would be larger than the wavelength of visible light and would scatter it strongly, making polystyrene milky. General-purpose polystyrene is glass-clear. The coils must therefore be much smaller than the wavelength, and the random-walk estimate puts them at 33 nm end to end and 13 nm in radius of gyration. The relevant interdiffusion distance is of the order of the radius of gyration, about 45 times smaller than the note had assumed. Since diffusion distance grows as the square root of time, as Diffusion by the Numbers explains, the error overstated the time needed by a factor of the order of 45², about 2,000.

```figure
type: compare
title: Two lengths for the same chain
rowhead: Length
cols: Value | What it describes | Use it for
caption: The contour length is the length of the chain's path; the coil size is how far it actually spreads. Joint healing, overlap in solution and light scattering all depend on the coil size.
- Contour length | 604 nm | the chain pulled fully straight | limits of stretching, fibre strength
- End-to-end distance R | 32.9 nm | the coil's typical span | elastic behaviour of the chain
- * Radius of gyration Rg | 13.4 nm | the coil's spread about its centre | interdiffusion, overlap, scattering
```

The note was corrected. The weak joints were later traced to a cement thinned with a poor solvent, the subject of Chapter 7, and not to clamping time.

## Where the random walk breaks down

The ideal random walk describes chains in a melt and in a solid glass well, because each chain is surrounded by other chains that cancel out its tendency to avoid itself. It also describes chains in a special solvent, called a theta solvent, at a special temperature. It does not describe chains in a good solvent, where a chain's segments repel each other and the coil swells beyond the random-walk size, nor short chains, where the stiffness correlations have not yet died away. Chapter 3 deals with the first, and the second matters only for oligomers and waxes far below the workshop's resin.

## How this applies to a small Australian business

Knowing the size of a chain turns several workshop puzzles into arithmetic. Why do clear parts show stress patterns under polarised light? The coils were stretched and frozen. Why does regrind behave differently? Its chains are shorter, though only by the square root of the change in their coil size. How long must two cemented surfaces stay soft for the joint to heal? Long enough for chains to cross a distance of about their radius of gyration. A moulder does not need to measure any of this, but the numbers in this chapter give the scale for judging what a supplier, a data sheet or a process note claims.

## Exercise: the regrind's chains

The workshop's regrind has a weight-average molar mass of 215,000 g/mol. Using the teaching characteristic ratio of 9.5, find the number of backbone bonds, the ideal end-to-end distance and the radius of gyration of a chain of that molar mass, and compare them with the virgin resin's.

**Worked answer.** n = 2 × 215,000 ÷ 104.15 = **4,129 bonds**. R = √(9.5 × 4,129) × 0.154 = √39,226 × 0.154 = 198.1 × 0.154 = **30.5 nm**, and Rg = 30.5 ÷ √6 = **12.4 nm**. The molar mass has fallen 14%, but the coil has shrunk only 7%, since √(215,000 ÷ 250,000) = √0.86 = 0.927. Chapter 6 shows that the melt viscosity falls far more steeply than the coil size.
