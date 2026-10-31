---
book: magnetic-workholding-by-the-numbers
chapterSlug: air-gaps-and-contact
order: 3
title: "Air gaps and contact"
description: "Why a few hundredths of a millimetre of gap cost a large share of the holding force: a gap model fitted from two pull tests, surface finish, scale, paint, bowed plates and swarf."
draft: false
---

The flux density at a pole face is set by the magnetic circuit, and the weakest links in that circuit are the two short gaps where the flux leaves one pole and enters the part, and leaves the part and enters the next pole. A perfectly flat, ground part on a perfectly clean, flat chuck has gaps of a few micrometres. Real parts have rolling scale, machining marks, paint, burrs, bow and the occasional chip trapped underneath, and each of these widens the gap. Because the pull depends on the square of the flux density, the holding force falls quickly as the gap grows.

This chapter builds a simple model of that fall, fits it to the case's chuck with two pull tests, uses it to estimate the force on BP-600 in the contact conditions the shop actually meets, and shows why a deep-pole lifting magnet tolerates gaps that a fine-pole chuck cannot. The error is a chip under the plate on its second operation.

## A gap in the magnetic circuit

From Chapter 1, the flux in the loop is the magnetomotive force divided by the total reluctance. Before any gap is added, the loop has a reluctance made up of the steel paths and, in a permanent or electro-permanent chuck, the magnets themselves, which behave magnetically rather like air of their own length. Call that reluctance R₀, and the flux density it produces at a pole face B₀.

A gap of width g at each of the two contacts adds a reluctance of 2g ÷ (μ₀A), where A is the pole area. The flux density becomes:

```figure
type: formula
title: The gap model
formula: B(g) ÷ B₀ = 1 ÷ (1 + g ÷ g₀)
formula: F(g) ÷ F₀ = 1 ÷ (1 + g ÷ g₀)²
formula: Fitting g₀ from two pull tests: g₀ = g ÷ (1 ÷ √(F ÷ F₀) − 1)
caption: g₀ is the gap at each contact that would double the circuit's reluctance. It is a property of the magnet and the part together, and is best found by test. The model ignores leakage flux and the steel's saturation.
- g | non-magnetic gap at each contact, mm
- g₀ | the circuit's equivalent gap, mm
- F₀ | pull with the reference contact, ground faces
- F | pull with the gap g
```

The single number g₀ describes how sensitive a magnet is to gaps. It is the gap that, added at each contact, halves the flux density and so quarters the force. A magnet with long magnetic paths inside it and short, wide poles, or a strong coil, has a large g₀; a fine-pole chuck, whose flux runs through short paths close to the surface, has a small one.

### Fitting the model to the case's chuck

This is an illustration. The shop already had one pull test from Chapter 1: a 120 × 120 × 50 mm ground block on four poles pulled 5.5 kN. It repeated the test with a 0.25 mm brass shim, the size of the block, laid between the block and the chuck. Brass is non-magnetic, so the shim adds a 0.25 mm gap at every pole contact. The block pulled 1.4 kN.

```figure
type: steps
title: Fitting g₀ for the electro-permanent chuck
caption: This is an illustration. Two pulls are enough to fit the model; three or more, with different shims, show whether it fits well across the range.
- Reference pull, ground block, no shim | F₀ = 5.5 kN
- Pull with a 0.25 mm brass shim | F = 1.4 kN
- Force ratio | 1.4 ÷ 5.5 = 0.255
- Square root of the ratio | √0.255 = 0.505, the flux density ratio
- * Equivalent gap | g₀ = 0.25 ÷ (1 ÷ 0.505 − 1) = 0.25 mm
- Check with a 0.10 mm shim | model 5.5 × 0.510 = 2.8 kN; measured 2.9 kN
```

With g₀ = 0.25 mm, the chuck loses half its force at a gap of about 0.1 mm at each contact, and three-quarters at 0.25 mm. Those are the gaps that real parts present.

## What real contact conditions look like

Every contact condition can be represented as an equivalent non-magnetic gap. The values below are the case's working figures, chosen from experience with this chuck and checked by pull tests on representative parts. They are not general values: a different chuck, or a different shop's idea of a "milled" face, would need its own tests.

```figure
type: compare
title: BP-600 on the electro-permanent chuck by contact condition
cols: Equivalent gap at each contact, mm | Share of reference force | Normal force, kN | Sliding resistance at μ = 0.2, kN
rowhead: Contact condition
- Ground face, clean chuck | 0 | 100% | 77.3 | 15.5
- Fine-milled face | 0.02 | 85.7% | 66.3 | 13.3
- * Milled face, second operation | 0.05 | 69.4% | 53.7 | 10.7
- Painted face, about 0.1 mm of paint | 0.10 | 51.0% | 39.4 | 7.9
- * As-rolled plate with mill scale, first operation | 0.20 | 30.9% | 23.9 | 4.8
- Flame-cut plate with bow and dross | 0.30 | 20.7% | 16.0 | 3.2
- A 0.5 mm chip under the contact | 0.50 | 11.1% | 8.6 | 1.7
caption: This is an illustration. Reference force 77.3 kN for 54 fully covered poles on ground steel, from Chapter 1; g₀ = 0.25 mm. The equivalent gaps are the case's working figures. The plate's 462 N weight is left out of the sliding resistance.
```

Two rows are the case's working conditions. On its first operation BP-600 is placed on the chuck with its as-rolled, mill-scaled face down: the normal force is about 24 kN, less than a third of the ideal. On its second operation the freshly milled face is down: about 54 kN. Chapter 5 compares both with the cutting force.

### Roughness and flatness

Roughness acts as a gap because the peaks of the two surfaces touch and the valleys between them are air. A ground surface has peaks and valleys of a few micrometres; a rough-milled surface of a few tens of micrometres. The equivalent gap is roughly the mean separation of the two surfaces, a fraction of the peak-to-valley height.

Flatness acts as a gap on a larger scale. A plate bowed by 0.4 mm over its length touches the chuck along a line or at its ends, and the poles under the rest of the plate see gaps up to 0.4 mm. Whether the magnet pulls the plate flat depends on the plate's stiffness. Treating BP-600 as a simply supported beam 600 mm long, 400 mm wide and 25 mm thick, the force needed at its centre to remove a 0.4 mm bow is:

F = 48 × E × I × δ ÷ L³ = 48 × 200,000 × 520,833 × 0.4 ÷ 600³ = 9.3 kN

The chuck's pull on a scaled plate, about 24 kN spread over the plate, is enough to flatten a 0.4 mm bow largely, but not instantly at the edges and not without the plate springing back when released. Chapter 6 explains why that matters for flatness after machining. A thinner plate is pulled flat far more easily, because the force to flatten it falls as the cube of its thickness.

### Paint, scale and coatings

Non-magnetic layers act as gaps equal to their thickness. Paint, primer, galvanising and thick oxide are all non-magnetic. Mill scale is a mixture of iron oxides, some of them weakly magnetic, and is better than paint of the same thickness, but it is rarely uniform, and it flakes, leaving loose particles that become chips under the part.

### Holes, pockets and partly covered poles

A part's contact face is rarely a complete rectangle. Holes, slots, pockets and chamfers over a pole remove contact area, and the flux that would have crossed there must either crowd into the remaining area, raising the flux density there towards saturation, or leak away. For estimating, the safe assumption is that a pole contributes force in proportion to the share of its face that the part covers with good contact, and that a pole less than about half covered contributes nothing useful. Edge poles that the part overhangs are treated the same way.

The case's estimates count only the 54 fully covered poles under BP-600. The partly covered poles round the edge do add some force, but counting them would mean relying on contact at the plate's edges, where burrs, flame-cut dross and edge bow make the gap least certain. Leaving them out is a small, deliberate margin.

## Where the gap model stops working

The model treats the gap as the only thing that changes. That is a good approximation for gaps up to a few times g₀, and it gets worse beyond that, for two reasons.

The first is leakage. When the gap is large, some of the flux leaving a pole takes a short cut through the air straight back to the neighbouring pole, never entering the part. The model assumes all the flux crosses the gap; real magnets deliver less than it predicts at large gaps. For workholding this rarely matters, because the force at those gaps is already too small to use.

The second is saturation, in the part or in the chuck's own pole pieces. At small gaps the flux density is highest, and if the part is thin or the poles are narrow, the steel saturates and the flux stops rising however small the gap becomes. The model then overestimates the benefit of improving the contact. Chapter 4 deals with this: for thin parts, the thickness, not the gap, sets the force.

The practical test of the model is the shop's own pull tests. If a pull test with a known shim agrees with the model's prediction within the scatter of the test, as the case's 0.10 mm check did, the model can be trusted over that range of gaps for that chuck. If it does not, the shop should use measured pulls directly and treat the model only as a way of explaining the trend.

## Pull testing real parts

A pull test on a test block shows what the chuck can do; a pull test on a real part shows what it does with that part's contact. For a new part family or a doubtful material, the case's shop pulls one production part from the chuck with a crane and a calibrated crane scale, lifting slowly and straight up from a central lifting point, and records the peak force before the part breaks away. For BP-600's first operation, mill scale down, the pull was 25 kN, close to the model's 23.9 kN. That single test turned an estimate into a measurement for the shop's set-up sheet.

A pull test has its own hazard: the part comes free suddenly when it breaks away, and the energy stored in the crane's rope and structure can swing or jerk it. The test should be done with a slow, controlled lift, with nobody near the part and nothing under it, and the crane and scale should be rated well above the expected force.

## Fine-pole chucks and deep-pole magnets

The value of g₀ depends on the design of the magnet. The case's chuck has its flux close to the surface, with 50 mm poles on a 60 mm pitch: good for holding thinner parts, as Chapter 4 shows, but sensitive to gaps. A lifting magnet designed for rough plate has deep poles and long internal paths, and a much larger g₀.

```figure
type: line
title: Share of holding force against gap, for two magnet designs
x: Gap at each contact, mm
y: Share of the force with ground contact, %
ymin: 0
ymax: 100
legend: Chuck, g₀ = 0.25 mm | Deep-pole lifting magnet, g₀ = 1.0 mm
caption: This is an illustration. Both curves follow the gap model. The deep-pole magnet keeps 69% of its force at a 0.2 mm gap; the chuck keeps 31%. The deep-pole magnet pays for this with poles too coarse to hold thin or small parts.
- 0 | 100.0 | 100.0
- 0.1 | 51.0 | 82.6
- 0.2 | 30.9 | 69.4
- 0.3 | 20.7 | 59.2
- 0.5 | 11.1 | 44.4
- 1.0 | 4.0 | 25.0
- 2.0 | 1.2 | 11.1
```

There is no design that has both a large g₀ and fine poles. A shop that holds both rough plate and thin, small parts needs either two kinds of magnet or a way of improving the contact, for example by milling a first face with clamps before transferring the part to the chuck.

## Keeping the contact clean

Most of the gap a shop can control is dirt: swarf, chips, coolant residue, scale flakes and burrs. A chip of 0.5 mm under one corner of a plate does more harm than the same chip spread as fine dust, because it props the plate up and creates a wedge-shaped gap over a large area, not just under the chip.

```figure
type: checklist
title: Preparing a magnetic chuck and a part for contact
caption: The open item is the one this chapter's error turned on. Each step takes seconds; the error took an afternoon to recover.
- x Chuck face wiped with a clean cloth | then felt by hand for chips and burrs
- x Chuck face stoned lightly if nicked | a fine oilstone, flat, with light oil
- ? Part's contact face wiped and its edges deburred | after every operation, before it goes back on the chuck
- x Scale flakes knocked off as-rolled plate | wire brush outside the machine
- x Part seated and rocked | a part that rocks has something under it
- x Stops placed against the cutting direction | Chapter 5
```

## The error: a chip under the second side

This is an illustration. After milling BP-600's first face, the machinist turned the plate over to mill the second face. The chuck had been wiped, but the burr along the edge of the first face had not been removed, and a curl of swarf about 0.5 mm high had stuck to the burr. The plate went down on the chip at one end.

The machine milled the second face flat and parallel to the chuck, which meant not parallel to the first face. At inspection the plate was 0.42 mm thicker at one end than the other, against a parallelism tolerance of 0.05 mm, and it had to be skimmed again on both faces, using up most of the shop's machining allowance. The holding force had also been reduced: the chip propped up one end of the plate, so the poles at that end saw gaps of several tenths of a millimetre. The shop estimated an average equivalent gap of about 0.15 mm across the plate, against 0.05 mm when properly seated, a normal force of about 30 kN instead of 54 kN, and a sliding resistance of 6.0 kN instead of 10.7 kN. The plate had not slid, but its margin had been cut almost in half without anyone knowing.

The cause was found by measuring the scrapped plate and finding the burr with the chip still attached. The shop added deburring the first face's edges to the operation sheet before the plate is turned, and the "rock test" to the set-up checklist: a plate that rocks on the chuck before it is switched on has something under it.

## Exercise: a painted plate

This is an illustration. A customer sends a batch of plates, the same size as BP-600, already primed on both faces with about 0.08 mm of paint, to be milled on one face only.

1. What share of the reference force will the chuck give, using g₀ = 0.25 mm?
2. What normal force and sliding resistance does that give, with μ = 0.2?
3. The shop sands the paint off the whole contact face, leaving a patchy residue equivalent to a 0.02 mm gap. What normal force does that give?

**Worked answer.**

1. 1 ÷ (1 + 0.08 ÷ 0.25)² = 1 ÷ 1.32² = **57.4%**.
2. 77.3 × 0.574 = **44.4 kN** normal; 0.2 × 44.4 = **8.9 kN** sliding resistance.
3. 1 ÷ (1 + 0.02 ÷ 0.25)² = 1 ÷ 1.08² = 85.7%, so 77.3 × 0.857 = **66.3 kN**, the same as a fine-milled face. Sanding the contact face therefore gains about 22 kN of normal force, or about 4.4 kN of sliding resistance, for a few minutes' work per plate. The shop quotes that time on painted work rather than relying on stops alone.
