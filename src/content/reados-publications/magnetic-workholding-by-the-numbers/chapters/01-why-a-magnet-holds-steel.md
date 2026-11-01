---
book: magnetic-workholding-by-the-numbers
chapterSlug: why-a-magnet-holds-steel
order: 1
title: "Why a magnet holds steel"
description: "Flux, flux density and saturation in steel, the pull per unit area of a pole face, the magnetic circuit, and how to turn a chuck's pole layout into an honest holding estimate."
draft: false
---

A magnetic chuck has no moving parts that touch the work, and its holding force is invisible. That makes it easy to trust too much and hard to reason about. The way to reason about it is to follow the magnetic flux: where it comes from, the path it takes through the chuck and the part, and how densely it is packed where the part touches the pole faces. The pull on the part comes almost entirely from that last quantity, the flux density at the contact.

This chapter sets out the physics every later chapter uses. It explains why steel is attracted to a magnet at all, gives the formula for the pull per unit area of a pole face, introduces the magnetic circuit that decides how much flux reaches the contact, and applies both to the BP-600 base plate on the shop's electro-permanent chuck. The error in this chapter is a holding estimate that used the wrong area.

## Flux, flux density and field

A magnet drives magnetic flux, measured in webers (Wb), around a closed loop. The flux density B is the flux per unit area crossing a surface, measured in teslas (T); one tesla is one weber per square metre. The magnetic field strength H, measured in amperes per metre (A/m), is the driving quantity: it is what a coil's current or a permanent magnet's magnetisation produces, before the material it acts on has responded.

In empty space, and very nearly in air, B and H are tied by a constant, the permeability of free space, μ₀ = 4π × 10⁻⁷ henries per metre:

B = μ₀ × H

In steel the relation is very different. The same H produces a flux density hundreds or thousands of times larger, because the steel itself becomes magnetised and adds its own contribution. The ratio of B to μ₀H in a material is its relative permeability μr. For air μr is 1; for soft steel at moderate fields it is typically in the thousands. That is why flux prefers to travel through steel: a steel path is, magnetically, a much easier route than the same length of air.

### Why steel responds

The large response of iron and steel is ferromagnetism. Each iron atom carries a small magnetic moment from the spins of its electrons, and a quantum-mechanical interaction between neighbouring atoms, the exchange interaction, makes neighbouring moments line up with each other. Below a critical temperature, the Curie temperature, iron is therefore magnetised spontaneously, in regions called domains. In an unmagnetised piece of steel the domains point in different directions and cancel. An applied field grows the domains that point along it and rotates the others, until at high enough fields every domain points the same way and the steel is saturated.

Saturation sets a hard ceiling. Pure iron at room temperature saturates at a flux density of about 2.15 T, and low-carbon steels a little below that; above saturation, the steel adds almost nothing more, and extra field only adds the μ₀H of empty space. The theory of the condensed state explains why the saturation value itself falls as temperature rises: thermal energy excites waves of disturbed alignment, called spin waves or magnons, that travel through the lattice, and well below the Curie temperature the magnetisation falls in proportion to the absolute temperature raised to the power three-halves, a result first obtained by Felix Bloch in 1930. For iron, whose Curie temperature is about 770 °C, the fall at workshop temperatures is small. Chapter 9 returns to what happens when parts or magnets get hot.

## The pull of a pole face

When flux crosses from a magnet's pole face into a steel part, the field in the gap pulls the two surfaces together. Maxwell's analysis of the stress in a magnetic field gives the pull per unit area across a thin gap, when the flux crosses it at right angles:

```figure
type: formula
title: Magnetic pull per unit area of contact
formula: p = B² ÷ (2 × μ₀)
formula: Force on a pole face F = p × A = B² × A ÷ (2 × μ₀)
formula: μ₀ = 4π × 10⁻⁷ H/m, so p = 397.9 kPa at 1 T
caption: The pull rises with the square of the flux density. Doubling the flux density at the contact quadruples the force; losing 30% of it loses about half the force.
- B | flux density crossing the contact, T
- A | area of the pole face actually covered and crossed by the flux, m²
- p | pull per unit area, Pa
```

Two features of this formula drive everything that follows. First, the force depends on the square of B, so small losses of flux density cost a great deal of force: a part that receives 70% of the ideal flux density feels only 49% of the ideal pull. Second, the formula contains no property of the magnet at all. Any magnet, permanent or electric, holds a part exactly as hard as the flux density it manages to push across the contact. All the differences between magnets are differences in how much flux they can deliver, over what area and across what gaps.

```figure
type: bars
title: Pull per unit area against flux density at the contact
unit: kPa
max: 1700
caption: Calculated from p = B² ÷ 2μ₀. At 2 T, about the saturation of low-carbon steel, the pull is 1,592 kPa, which is 159 N/cm² or 16.2 kgf/cm². No magnet holding mild steel can do better than about this at the contact face.
- 0.5 T | 99.5
- 1.0 T | 397.9
- * 1.2 T, the case's chuck with ideal contact | 573.0
- 1.5 T | 895.2
- 2.0 T, near saturation of the steel | 1591.5
```

The bar for 2 T explains a number that appears in chuck catalogues: a maximum specific holding force in the region of 16 kilograms-force per square centimetre of pole face. That is the saturation ceiling of mild steel, not a property of any particular chuck, and it applies only to the pole face itself, with perfect contact, on thick steel. Every later chapter is about how far below that ceiling a real set-up sits.

## The magnetic circuit

Flux flows round a loop, and the loop has a source and resistances, very like an electrical circuit. The source is the magnetomotive force (MMF), in ampere-turns: the coil's current times its number of turns in an electromagnet, or an equivalent from the magnet's material and length in a permanent magnet. The resistance to flux is called reluctance:

Reluctance = path length ÷ (μ₀ × μr × area)

and the flux in the loop is the MMF divided by the total reluctance of every part of the loop in series.

```figure
type: layers
title: The flux loop through a chuck and a part
caption: Two short air gaps in series with long steel paths. Because steel's relative permeability is in the thousands, a gap of a few hundredths of a millimetre can have as much reluctance as the whole steel path.
- Source | coil or magnet inside the chuck | supplies the magnetomotive force
- Chuck steel | pole pieces and base | long path, low reluctance while below saturation
- * Gap into the part | contact under the north pole | high reluctance per millimetre; roughness, scale, paint and chips widen it
- Part | the workpiece between poles | low reluctance if thick enough; saturates if thin
- * Gap out of the part | contact over the south pole | the same gap again, in series
```

The circuit view explains why the contact gap matters so much. Suppose the steel path through the chuck and part is 200 mm long with a relative permeability of 2,000. That path has the same reluctance as 0.1 mm of air of the same area. Two contact gaps of 0.05 mm each add another 0.1 mm of air, doubling the total reluctance and halving the flux, and so cutting the pull to a quarter. Chapter 3 builds a working model of this effect for the case.

The circuit also explains saturation's effect on the part. The flux leaving a pole must pass sideways through the part to reach the neighbouring pole of opposite polarity. If the part is thin, its cross-section is small, its flux density reaches saturation, its permeability collapses and it behaves like a gap. Chapter 4 turns that into a minimum thickness.

## The case's chuck

This is an illustration. The shop's electro-permanent chuck is 800 × 500 mm, with square poles 50 × 50 mm on a 60 mm pitch, alternately north and south in a chequerboard. Brass and resin fill the spaces between the poles. The maker's data, measured with a thick, ground mild steel test block, give a flux density of 1.2 T at a pole face with full contact.

Placed against the chuck's stop bar, the 600 × 400 mm BP-600 plate covers 54 poles completely, in a block of 9 by 6, and parts of the poles around its edge. With ideal contact, each fully covered pole pulls with:

F = (1.2)² × 0.0025 ÷ (2 × 4π × 10⁻⁷) = 1,432 N

```figure
type: stats
title: BP-600 on the electro-permanent chuck, ideal contact
caption: This is an illustration. Pole data are the case's assumed maker's figures for a thick, ground test block; the plate figures follow from the pull formula. Partly covered edge poles are ignored, which errs on the safe side.
- 1.2 T | flux density at a fully covered pole face
- 573 kPa | pull per unit area at the pole face
- 2,500 mm² | area of one pole face
- 1,432 N | pull of one fully covered pole
- 54 | poles fully covered by the 600 × 400 mm plate
- 77.3 kN | ideal holding force, normal to the chuck
- 47.1 kg | mass of the plate, 462 N of weight
```

The ideal holding force is about 170 times the plate's weight. That margin looks enormous, and it is the source of most trouble with magnetic workholding, because it is the wrong comparison. The plate is not in danger of falling off the chuck. It is in danger of sliding sideways under the cutter, where the resistance is friction, perhaps a fifth of the normal force; and the normal force itself will be a fraction of the ideal once the real contact gap is counted. Chapter 5 makes the real comparison.

## The holding force is normal; the cutting force is not

A magnet pulls the part straight down onto the chuck. It does not grip sideways. Resistance to sliding comes from friction between the part and the chuck face, equal to the coefficient of friction times the normal force; for dry steel on a steel and brass chuck face the coefficient is often taken as 0.15 to 0.2, and less with coolant and fine swarf. A part held down by 10 kN therefore resists perhaps 2 kN of sideways force before it slides, unless something else, a stop or a fence, takes the sideways load. Most chuck makers supply stop bars for exactly this reason.

## Measuring what a magnet delivers

The flux density at a contact cannot be measured directly while the part is on the chuck, because there is no room for a probe in a gap of a few hundredths of a millimetre. What a shop can measure is one of three things, and each needs care in interpretation.

The first is the flux density on a bare pole face, with a gaussmeter and a thin Hall-effect probe laid flat on the pole. This reading is much lower than the flux density in contact with a part, because with no steel to close the loop the flux leaks out of the pole face in all directions instead of crossing into a part. A bare-pole reading is useful for comparing poles with each other and for spotting a weak pole or a failed coil, and for comparing a chuck with its own reading when new. It is not the B to put in the pull formula.

The second is a pull test: a steel test block of known thickness and finish is placed on the chuck, the chuck is switched on, and the block is pulled off with a calibrated force gauge or crane scale, straight up, slowly, and the peak force is recorded. A pull test measures the quantity that matters, under conditions the shop controls. Its result can be turned back into an effective flux density with the pull formula, B = √(2μ₀F ÷ A), which is a useful way of comparing tests made with blocks of different size.

The third is a sliding test, the same block pushed sideways with a force gauge. It measures the product of normal force and friction directly, which is what resists the cutter. It is the most relevant test for workholding and the one most rarely done.

For the case, the shop pulled a 120 × 120 × 50 mm ground block centred on a square of four poles, covering them fully, and measured 5.5 kN. The four poles' pole area is 0.01 m², so the effective flux density was √(2 × 4π × 10⁻⁷ × 5,500 ÷ 0.01) = 1.18 T, agreeing with the maker's 1.2 T to within the scatter of a hand-pulled test. That agreement is what entitles the shop to use the maker's figure for thick, ground parts; it says nothing yet about rough, thin or small ones.

## The error: the wrong area

This is an illustration. When the shop bought the chuck, the planner estimated the holding force on BP-600 from the catalogue's specific holding force, assumed to be 1.2 T at the poles, multiplied by the area of the plate:

Wrong estimate = 573 kPa × 0.6 m × 0.4 m = 137.5 kN

The figure was quoted to the machinist as a reason not to fit stop bars. It was 78% higher than the pole-area estimate of 77.3 kN, because it counted the brass and resin between the poles and the partly covered poles at the edge as if they carried the full flux density. The flux crosses the contact only through pole faces; between poles it runs sideways inside the part, and it pulls nothing down there.

The error was caught when the machinist checked the catalogue's footnote, which defined the specific holding force per unit of pole area on a ground test block. The planner reworked the estimate on the pole area, and the stop bars were fitted. The lesson was written into the shop's set-up notes: a catalogue's force per unit area applies to the area of the poles the part fully covers, with the contact the catalogue's test block had, and the real contact is always worse.

```figure
type: checklist
title: Before quoting a holding force for a magnetic set-up
caption: The open item is the one that went wrong in this chapter's error.
- x Flux density or specific force taken from the maker's data | and the test conditions noted: thickness, finish, material
- ? Area counted as the pole faces fully covered by the part | not the part's outline
- x Contact condition compared with the maker's test block | scale, paint, roughness, flatness
- x Part thickness compared with the pole size | thin parts saturate, Chapter 4
- x Normal force converted to sliding resistance | coefficient of friction, Chapter 5
- x Stops considered for every sideways load | magnets do not grip sideways
```

## Exercise: a lifting magnet's ceiling

This is an illustration. A lifting magnet has two pole faces, each 150 × 60 mm. With full contact on thick, clean plate it produces 1.0 T at both faces.

1. What is its ideal pull?
2. What mass does that pull support?
3. If scale on the plate reduces the flux density to 0.8 T, what is the pull, and what share of the ideal is it?

**Worked answer.**

1. Pole area = 2 × 0.150 × 0.060 = 0.018 m². Pull = 1.0² × 0.018 ÷ (2 × 4π × 10⁻⁷) = **7.16 kN**.
2. 7,162 N ÷ 9.81 m/s² = **730 kg**. This is a breakaway force, not a working load limit; lifting magnets are rated well below their breakaway force, and Chapter 8 shows how.
3. Pull = 0.8² × 0.018 ÷ (2 × 4π × 10⁻⁷) = **4.58 kN**, which is 0.8² = **64%** of the ideal. A 20% loss of flux density costs 36% of the pull.
