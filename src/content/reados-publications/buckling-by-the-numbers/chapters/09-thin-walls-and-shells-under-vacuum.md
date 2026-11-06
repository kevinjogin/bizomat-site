---
book: buckling-by-the-numbers
chapterSlug: thin-walls-and-shells-under-vacuum
order: 9
title: "Thin walls and shells under vacuum"
description: "How thin walls buckle locally and how tanks and tubes collapse under external pressure: long and short shells, why a tank can be sucked in by a small vacuum, and how a blocked vent nearly did it."
draft: false
---

Up to now the members in this book have buckled as a whole, bowing sideways along their length. Thin walls can buckle in a different way: locally, in short waves or dents, while the member as a whole stays straight. The same thinness that makes a tank or a duct economical makes it vulnerable, and the load that buckles it need not be large. A tank built to hold several tonnes of water can be crushed by the atmosphere if the air inside is drawn out faster than it can be replaced.

This chapter covers local buckling of thin walls briefly, then concentrates on cylindrical shells under external pressure, using HT-8's own tank. Its error is the closest call in the book: a vent covered during maintenance work while the tank was being drained.

## Local buckling of thin walls

A tube or plate in compression can buckle as a whole, as earlier chapters described, or its wall can buckle locally: a flat plate between its edges ripples, and a round tube's wall forms a ring of dimples or a diamond pattern. Local buckling depends on the wall's slenderness, its width or diameter divided by its thickness, not on the member's length.

For a perfect, thin round tube in axial compression, the classical elastic theory gives a local buckling stress of about 0.6 × E × t ÷ R, where R is the mean radius. For HT-8's legs, with a 3.6 mm wall on a 36.25 mm mean radius, that is about 12,000 MPa, more than thirty times the yield stress; local buckling cannot happen, and the leg will yield or buckle as a whole long before. For very thin tubes and shells the classical value is far too optimistic. Real shells are sensitive to tiny imperfections, and tests on thin cylinders in axial compression have long shown collapse at a fraction of the classical value. Design rules for shells therefore apply large reduction factors, and they are the place to go for any thin shell in compression.

Flat plates, in panels, webs and flanges, are covered in [Buckling, oil-canning and a few degrees of heat](/reados/publications/stiffening-sheet-metal-by-the-numbers/buckling-oil-canning-and-heat/), which gives the critical stress of a plate from its width-to-thickness ratio and edge support.

```figure
type: compare
title: Where local buckling matters
cols: Wall slenderness | Usual governing failure | What to check
rowhead: Member
- HT-8 leg, CHS 76.1 × 3.6 | D ÷ t = 21 | yield or overall buckling | overall buckling (Chapters 1 to 5)
- Thin structural tube, D ÷ t over about 80 to 100 | high | local and overall interacting | code rules for slender sections
- Sheet metal panel | b ÷ t of hundreds | local plate buckling | plate formulas; stiffening
- * HT-8 tank shell, 3 mm on 2,206 mm | D ÷ t = 735 | collapse under external pressure | shell buckling under vacuum
caption: This is an illustration. The wall slenderness decides which kind of buckling to look for. The limits for "slender" sections depend on the steel grade and the code; the values here are only indicative.
```

## Shells under external pressure

A round tube or shell under external pressure, or under vacuum inside, is in hoop compression. If its wall is thick, it fails by yielding in compression. If its wall is thin, it buckles first: the circular section flattens into an oval, or into a pattern of several lobes around the circumference, at a pressure set by the wall's bending stiffness.

### Long tubes

For a long tube, far from any end or stiffening ring that would hold it round, the elastic collapse pressure is:

```figure
type: formula
title: Elastic collapse of a long tube under external pressure
formula: p_cr = 2E ÷ (1 − ν²) × (t ÷ D_m)³
formula: Yield-limited pressure: p_y = 2 × S_y × t ÷ D_m
formula: The lower of the two governs.
caption: The cube of the thickness ratio makes thin tubes extremely sensitive: halving the wall divides the collapse pressure by eight. The long-tube formula ignores the support of ends and rings, so it is conservative for short shells.
- E | elastic modulus, MPa
- ν | Poisson's ratio, about 0.3 for steel
- t | wall thickness, mm
- D_m | mean diameter, mm
- S_y | yield or proof stress, MPa
```

The BIZOMAT [Tube or shell under external pressure](/tools/vacuum-tube-design/) tool applies these two formulas to a long, unstiffened tube. From the outside diameter, wall thickness, corrosion allowance, modulus, Poisson's ratio, yield strength, net external pressure, required factor and density, it gives the elastic collapse pressure and the yield-limited pressure for the wall left after the corrosion allowance, the governing mode, the factor of safety, the least wall that gives your factor, the diameter-to-thickness ratio and the mass per metre. Its guide says plainly that it covers long tubes without stiffening rings, that short shells between stiffeners are stronger, and that out-of-roundness lowers the collapse pressure sharply.

### HT-8's tank as a long tube

This is an illustration. HT-8's tank is 316 stainless, 2,206 mm outside diameter with a 3 mm shell. With E = 193 GPa, ν = 0.3, a proof stress of 205 MPa and no corrosion allowance, the tool reports an elastic collapse pressure of 1.07 kPa and a yield-limited pressure of 558 kPa. Elastic buckling governs by a factor of more than five hundred.

A collapse pressure of 1.07 kPa is a vacuum of about one-hundredth of an atmosphere, the pressure difference across a fairly brisk draught. If the tank really were a long tube, gently sucking on a hose connected to it would crush it. It is not, and the difference is the subject of the next section.

### Short shells and the support of the ends

HT-8's shell is 2,100 mm tall between its flat bottom and its conical roof. The bottom and the roof hold the ends of the shell round, so the shell cannot simply flatten into an oval; it must buckle into several lobes around its circumference, which takes far more pressure. For a cylinder held round at its ends, the classic approximate formula of Windenburg and Trilling, published in 1934 and still widely quoted, gives:

p_cr ≈ 2.42 × E × (t ÷ D)^2.5 ÷ [(1 − ν²)^0.75 × (L ÷ D − 0.45 × √(t ÷ D))]

```figure
type: compare
title: Collapse pressure of HT-8's shell by three estimates
cols: Collapse pressure, kPa | Vacuum as a share of one atmosphere
rowhead: Model
- Long tube, no end support (BIZOMAT tool) | 1.07 | 1.1%
- * Short shell held round at both ends, Windenburg–Trilling approximation | 36.6 | 36%
- Short shell, a second published approximation | 33.9 | 33%
caption: This is an illustration. D = 2,206 mm, t = 3 mm, L = 2,100 mm, E = 193 GPa, ν = 0.3. The short-shell figures are for a perfect shell; real shells with dents, weld distortion and out-of-roundness collapse at lower pressures, and design rules for vacuum vessels apply reduction factors and require a margin.
```

The ends raise the collapse estimate by a factor of about 34, from 1.07 to about 35 kPa. That is why thin tanks survive at all: their bottoms, roofs and any stiffening rings hold them round. It is also why the long-tube tool, used on a short shell, gives a very conservative answer. For a long pipe or duct with no rings, the long-tube figure is the right one. For a vessel, the end support must be accounted for, and a vessel designed to operate under vacuum should be designed to a pressure vessel standard by someone competent to do so.

Even 35 kPa is not much. A centrifugal pump drawing from a sealed tank, a tank cooled quickly after a steam clean with its vent closed, or a tank drained with its vent blocked can all produce that much vacuum within a minute or two.

## The error: a covered vent

This is an illustration. A year after HT-8 was commissioned, contractors were abrasive-blasting the steelwork of a nearby building. To keep grit out of the tank, one of them taped a plastic bag over HT-8's roof vent. The next morning, a maintenance fitter drained the tank to replace a level switch, using the transfer pump at about 5 L/s.

With the vent sealed, the air above the water could not be replaced as the water level fell. The headspace in the full tank was about 0.5 m³. As water was pumped out, that air expanded and its pressure fell.

```figure
type: steps
title: Vacuum in HT-8's headspace as water is pumped out with the vent sealed
caption: This is an illustration. Isothermal expansion of 0.5 m³ of air starting at 101.3 kPa; vacuum = 101.3 × (1 − 0.5 ÷ (0.5 + V)), where V is the volume of water removed. At 5 L/s, 100 L takes 20 s.
- 10 L removed, 2 s | vacuum 2.0 kPa, already above the long-tube estimate
- 50 L removed, 10 s | vacuum 9.2 kPa
- 100 L removed, 20 s | vacuum 16.9 kPa
- 200 L removed, 40 s | vacuum 28.9 kPa
- * About 282 L removed, 56 s | vacuum 36.6 kPa, the perfect-shell estimate for collapse
```

The fitter heard the tank shell "oil-can" with a loud bang about forty seconds into the drain, and stopped the pump. A shallow inward dent about 400 mm across had formed in the shell near mid-height. With the pump stopped, nothing more happened; the fitter found the bag, removed it, and the shell partly sprang back as air rushed in, leaving a permanent dent about 15 mm deep.

The bang at about 40 seconds, at a vacuum of roughly 29 kPa, is consistent with the warning in the comparison figure: a real shell, with its welds and slight out-of-roundness, buckles below the perfect-shell estimate. Had the pump run on, the dent would have spread, and the shell could have collapsed over a large area.

The plant engaged an engineer to assess the dent before the tank went back into service. The investigation produced three changes:

```figure
type: checklist
title: Protecting thin tanks from vacuum
caption: The open item is the one that failed: nobody owned the vent while other trades were working nearby.
- Vent sized for the largest outflow and the fastest cooling | air in at least as fast as liquid out, plus allowance for steam condensing
- Vent mesh inspected and kept clear | insect screens and grit block vents slowly
- ? Vent included in permits and isolations for nearby work | no covering of vents without the tank owner's permit
- Vacuum relief valve on tanks that can be cooled or drained fast | a second line of defence
- Draining procedure checks the vent is open before starting the pump | one line on the work instruction
```

### How big a vent?

The air entering through the vent must keep up with the water leaving. At 5 L/s of water out, 5 L/s of air must come in. Treating the vent as an orifice with a discharge coefficient of 0.6 and allowing a pressure drop of only 0.2 kPa, air enters at √(2 × 200 ÷ 1.2) = 18.3 m/s through the effective opening, which needs an area of 0.005 ÷ (0.6 × 18.3) = 456 mm², a circle of about 24 mm diameter. HT-8's open DN50 vent, with roughly 2,000 mm² of bore, is ample when clear; with a fine mesh screen, which can halve the open area, and a little blasting grit, it is not. And a bag taped over it reduces the area to nothing.

## Other ways a vacuum forms

Draining with a blocked vent is only one route to a vacuum. Two others catch food and process plants regularly.

**Cooling a closed tank.** Air sealed in a tank at one temperature and then cooled loses pressure in proportion to its absolute temperature. A headspace closed at 100 °C (373 K) and cooled to 20 °C (293 K) falls to 293 ÷ 373 of its pressure: a vacuum of 21.7 kPa from the air alone, a large share of HT-8's collapse estimate.

**Condensing steam.** Steam cleaning is far more dangerous. A tank steamed out is full of steam, not air, and when it cools the steam condenses to a few cupfuls of water. What remains in the headspace is only the vapour pressure of water at the new temperature, about 2.3 kPa at 20 °C. If the vent is shut, or too small to admit air as fast as the steam condenses, the vacuum approaches a full atmosphere, about 99 kPa, far beyond what any thin tank can resist. A cold-water rinse sprayed into a hot, steam-filled tank condenses the steam in seconds. Tanks that are steamed must have vents sized for the rate of condensation, which is much higher than the rate of draining, and usually a vacuum relief valve as well.

Both routes have the same defence as draining: the vent must be open and large enough, and the procedure must say so. For HT-8, which is now heated with a steam coil (Chapter 8) but not steamed out, the plant's procedure for any internal cleaning requires the manway to be open before any steam or hot water is introduced.

## Making shells stronger

Where a shell must resist external pressure, three things help, in order of usual cost-effectiveness:

- **Stiffening rings.** Rings welded around the shell divide it into short lengths, each held round by the rings. Halving the length between supports roughly doubles the short-shell collapse pressure, because the pressure in the Windenburg–Trilling formula varies roughly inversely with L ÷ D.
  This is an illustration. A single ring at mid-height of HT-8's shell would divide it into two 1,050 mm lengths; the Windenburg–Trilling estimate for each rises from 36.6 to about 74.4 kPa. The ring itself must be stiff enough to stay round, which is a calculation of its own.
- **Thicker walls.** Collapse pressure rises with the 2.5 power of thickness for short shells and the cube for long ones. For HT-8, a 4 mm shell would raise the perfect-shell estimate from 36.6 to 75.2 kPa.
- **Roundness.** Out-of-roundness reduces the collapse pressure sharply. Shells meant for vacuum service are built and inspected to roundness tolerances for that reason.

The cheapest protection, by far, is not to let the vacuum form.

## Exercise: a thicker shell and a long duct

This is an illustration.

1. If HT-8's shell were 4 mm instead of 3 mm, what would the Windenburg–Trilling estimate give, and by what factor does it change?
2. What does the BIZOMAT long-tube tool give for the 4 mm shell, and why is it so much lower?
3. A 600 mm diameter, 1.6 mm wall stainless extraction duct, 12 m long with no stiffening rings, is connected to a fan that can pull 3 kPa if its inlet damper shuts. Using E = 193 GPa and ν = 0.3, is the duct at risk?

**Worked answer.**

1. With t = 4 mm, D = 2,206 mm and L = 2,100 mm, the formula gives about **75.2 kPa**, a factor of 75.2 ÷ 36.6 = **2.06**: roughly (4 ÷ 3)^2.5 = 2.05, as the formula's thickness power suggests.
2. The long-tube tool gives an elastic collapse pressure of **2.54 kPa**, because it ignores the support of the bottom and roof. For a short tank shell it is very conservative; for a long, unstiffened pipe it is the right formula.
3. Long-tube collapse: D_m = 598.4 mm, t ÷ D_m = 0.002674, so p_cr = 2 × 193,000 ÷ 0.91 × 0.002674³ = 0.00811 MPa = **8.1 kPa**. Against 3 kPa that is a factor of only 2.7 for a perfect duct; with out-of-roundness from handling and welding it could be much less. A 12 m duct with no rings is effectively long, so the formula applies. The duct is **at risk**: add stiffening rings, or protect it with a vacuum relief on the fan inlet.
