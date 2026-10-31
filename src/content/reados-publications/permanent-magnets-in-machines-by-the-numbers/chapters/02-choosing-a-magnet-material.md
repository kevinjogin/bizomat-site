---
book: permanent-magnets-in-machines-by-the-numbers
chapterSlug: choosing-a-magnet-material
order: 2
title: "Choosing a magnet material"
description: "Ferrite, AlNiCo, samarium-cobalt and NdFeB compared: remanence, coercivity, energy product, temperature, corrosion, volume and cost, with a material chosen for each magnet in the case."
draft: false
---

Four families of permanent magnet material cover nearly every machine application: ferrite, aluminium-nickel-cobalt (AlNiCo), samarium-cobalt and neodymium-iron-boron. They differ by factors of ten in energy product and by hundreds of degrees in the temperatures they tolerate, and they differ just as much in properties that a datasheet's headline numbers do not show, such as how they corrode, how they break and what they cost. Choosing among them is a matter of matching those properties to the job: the flux needed, the space available, the temperature, the reverse fields the magnet will meet and the environment it lives in.

This chapter compares the families, explains how the comparison turns into magnet volume and cost, and chooses a material for each of the case's magnets. The error is a corroded magnet in a food-contact separator.

## The four families

**Ferrite** magnets, also called ceramic magnets, are iron oxides combined with barium or strontium. They are cheap, made from abundant materials, electrically insulating and resistant to corrosion, and they have moderate coercivity but low remanence and energy product. They are brittle and fairly weak mechanically. Their remanence falls quickly as they warm, and, unusually, their coercivity falls as they cool.

**AlNiCo** magnets are alloys of iron with aluminium, nickel and cobalt, cast or sintered. They have high remanence and the smallest temperature coefficient of any common family, and they work at high temperatures, but their coercivity is low, so they are easily demagnetised by their own field unless they are long in the direction of magnetisation, or by any external reverse field. Their low coercivity is put to use in electro-permanent devices, where a coil pulse deliberately reverses them.

**Samarium-cobalt** magnets have high coercivity and good remanence, keep their properties well at high temperatures, and resist corrosion. They are expensive, because of their cobalt and samarium content, and brittle.

**Neodymium-iron-boron** magnets have the highest remanence and energy product of the four, and high coercivity at room temperature. Their coercivity falls quickly as they warm, which limits standard grades to moderate temperatures; grades with higher coercivity, made with additions of heavier rare earths, work hotter at higher cost. Sintered NdFeB corrodes readily, because of its iron and its neodymium-rich grain boundaries, and is almost always supplied with a coating. It is brittle.

```figure
type: compare
title: Typical properties of the four magnet families at room temperature
cols: Br, T | HcJ, kA/m | (BH)max, kJ/m³ | Curie temperature, °C | Reversible Br coefficient, %/°C
rowhead: Family
- Ferrite | 0.2 to 0.45 | 200 to 400 | 10 to 40 | about 450 | about −0.20
- AlNiCo | 0.6 to 1.35 | 40 to 160 | 10 to 80 | about 800 to 900 | about −0.02
- Samarium-cobalt | 0.85 to 1.15 | 600 to over 2,000 | 120 to 260 | about 700 to 800 | about −0.03 to −0.045
- * Neodymium-iron-boron, sintered | 1.1 to 1.45 | 900 to over 2,500 | 200 to 420 | about 310 to 350 | about −0.11
caption: Approximate ranges across commercial grades, for orientation only; the Curie temperatures and coefficients agree with Arnold Magnetic Technologies' note TN 0303 for representative grades. Selection must use the datasheet of the specific grade at the working temperature.
```

## From energy product to magnet volume

Chapter 1 showed that a magnet working near its maximum energy product delivers a given flux into a given air gap with the least volume of magnet. To a first approximation, the magnet volume needed for a job is inversely proportional to the material's maximum energy product. A ferrite magnet with 28.6 kJ/m³ needs about 310 ÷ 28.6 = 11 times the volume of an NdFeB magnet with 310 kJ/m³ to do the same job, if both can be worked at their optimum.

That rule hides two things. A ferrite design cannot always be scaled up eleven times: the space may not exist, and a larger magnet needs a larger steel circuit around it. And a design is not always free to work its magnet at the optimum, because the circuit's geometry or the need for margin against demagnetisation may set the working point elsewhere. The rule is a guide to orders of magnitude, which is where material choices are usually decided.

### Cost per unit of energy product

This is an illustration. The plant's buyer obtained indicative prices per kilogram, excluding GST, for magnet blocks of each family in modest quantities. Combined with each material's density and energy product, they give the cost of the magnet material needed to provide one joule of maximum energy product, a fair basis for comparing materials for the same job.

```figure
type: bars
title: Magnet material cost to provide one joule of maximum energy product
unit: A$
max: 12
caption: This is an illustration. Indicative prices excluding GST: ferrite A$6/kg, AlNiCo A$60/kg, SmCo A$160/kg, NdFeB A$90/kg. Densities 4.9, 7.3, 8.4 and 7.5 g/cm³; energy products 28.6, 40, 200 and 310 kJ/m³. Real prices vary widely with grade, size, quantity and rare-earth markets.
- Ferrite | 1.03
- * Sintered NdFeB | 2.18
- Samarium-cobalt | 6.72
- AlNiCo | 10.95
```

The material is rarely the largest cost of a magnetic part. Grinding to tolerance, coating, magnetising, inspecting and, above all, the steel and housing around the magnet usually cost more, and a smaller magnet allows a smaller housing. A comparison of materials for a real design should therefore compare complete designs, not kilograms of magnet. The per-joule figure is still useful early, to rule out materials that cannot compete.

On this basis ferrite is the cheapest source of magnetic energy, if there is room for eleven times the volume; NdFeB is about twice ferrite's cost per joule and a tenth of its volume; samarium-cobalt and AlNiCo cost several times more and are chosen for what NdFeB cannot do, which is mostly to work hot or, for AlNiCo, to be switched.

## Temperature and coercivity

The most common reason to move away from the cheapest suitable material is temperature. A material's usable maximum temperature is set not by its Curie temperature but by the temperature at which its intrinsic curve's knee reaches the working point, beyond which losses become irreversible. For NdFeB that happens at moderate temperatures in standard grades, because their coercivity falls quickly as they warm; Arnold's note gives a reversible coefficient of coercivity of about −0.60 %/°C for a sintered grade. Grades with higher room-temperature coercivity reach the same knee position at a higher temperature. Samarium-cobalt's coercivity falls much more slowly, so it is the usual choice above the range of NdFeB grades a design can afford. Chapter 4 does the calculation.

## Corrosion and coatings

Sintered NdFeB must be protected. In humid air an uncoated magnet develops surface corrosion; in water, and especially in hot or chemically aggressive conditions, the corrosion runs along the grain boundaries, the magnet swells and crumbles, and it loses its magnetisation as it does. Common coatings are nickel-copper-nickel plating, epoxy and aluminium. A coating is only as good as its weakest point, and a chip at an edge from handling is enough to start corrosion.

In equipment that sees water or chemicals, NdFeB magnets are therefore usually encapsulated: sealed in a welded stainless steel tube or can, or overmoulded in a polymer. The encapsulation, not the coating, is then the barrier that matters, and its integrity becomes a maintenance item. Ferrite and samarium-cobalt are far more tolerant of moisture, and AlNiCo is a corrosion-resistant alloy.

Encapsulation also has a magnetic cost. A stainless tube wall or a polymer overmould sits between the magnet and whatever it acts on, so it adds to the gap in the magnet's circuit. For a grate magnet, a 1 mm tube wall moves the magnet a millimetre further from the product, where the field and its gradient, which Chapter 8 shows to be what catches metal, are both lower. Thin walls help the magnetics and hurt the durability; the choice is a trade, and it should be made deliberately.

## Strength and handling

All four families are brittle. Rare-earth magnets chip and crack easily, and two strong magnets allowed to snap together can shatter, throwing sharp fragments. Magnets should never be used as structural parts, and designs should hold them with pockets, sleeves or adhesive in ways that do not load them in tension or bending. Chapter 10 covers handling.

## Specifying a magnet on a drawing

A magnet is a part like any other, and its drawing or specification must say everything that matters, because two magnets of the same size and grade name can still differ in ways that only appear in service. The plant's engineering standard requires these items for every magnet it buys:

- **Material and grade**, with the maker's datasheet attached or referenced, and the minimum Br and HcJ at 20 °C in SI units.
- **The highest working temperature** and the property values required at that temperature, or a statement that the supplier has checked the grade against the application.
- **Dimensions and tolerances**, including any chamfers that protect edges from chipping.
- **Direction and pattern of magnetisation**, and whether the magnet is supplied magnetised or unmagnetised.
- **Coating** and its thickness, or the encapsulation and how its integrity is tested.
- **Acceptance test**: what the supplier measures on each batch and what the plant measures on receipt, described in Chapter 10.
- **Marking and packing**, including identification of north and south poles where it matters.

Writing these down takes an hour once. It turns a magnet from a catalogue item that anyone can substitute into a specified part that only a matching part can replace.

## Supply and substitution

Rare-earth magnet supply is concentrated and prices move with the rare-earth markets, sometimes sharply. That creates pressure to substitute: another supplier's grade with the same name, a cheaper grade with the same remanence, or another family altogether. Each substitution changes something.

The same grade name from two makers is not a guarantee of the same curves, because grade names are makers' conventions, not a single standard; the datasheet values at the working temperature are what must match. A cheaper grade with the same remanence usually has a lower intrinsic coercivity, which matters only when the magnet is hot or meets reverse fields, which is exactly when it fails. A different family changes the volume, the temperature behaviour and the corrosion behaviour together.

The plant's rule is that a substitute magnet is approved by engineering against the specification above, with the substitute's datasheet, before it is ordered. Purchasing can then compare prices freely among approved sources without having to judge magnetic properties.

## Bonded magnets and assemblies

Bonded NdFeB and bonded ferrite, made with a polymer binder, are common in small motors, sensors and moulded assemblies. Their lower remanence is offset by freedom of shape, close tolerances without grinding, and integral features such as mounting holes or overmoulded hubs. Their temperature limits are set by the binder as well as the magnet powder, and their datasheets should be read for both.

Many machine magnets are bought as assemblies rather than as bare magnets: a coupling rotor, a sensor actuator, a grate. The assembly's maker then holds the magnet specification, and the plant's specification is of the assembly's performance: torque, field at a stated distance, capture, temperature and washdown resistance. The checks in Chapter 10 apply to assemblies in the same way.

## Choosing materials for Line 4

This is an illustration. The plant's engineers chose materials for Line 4's magnets by working down the same questions for each: the flux or force needed, the space, the highest temperature, the reverse fields, the environment, and cost.

```figure
type: matrix
title: Choosing a magnet family by temperature and the flux needed per unit volume
x: Highest working temperature: moderate → high
y: Flux needed per unit of magnet volume: modest → high
hot: 2
caption: The usual first choice in each corner. Coercivity, corrosion, switching and cost refine the choice within a corner. Grades of NdFeB with high coercivity extend the top-left corner towards the right.
- Moderate temperature, high flux per volume | sintered NdFeB, coated or encapsulated
- High temperature, high flux per volume | samarium-cobalt, or a high-coercivity NdFeB grade
- Moderate temperature, modest flux per volume | ferrite, where space allows
- High temperature, modest flux, stability needed | AlNiCo, if long in the magnetised direction and free of reverse fields
```

```figure
type: compare
title: Materials chosen for Line 4's magnets
cols: Highest temperature | Environment | Material chosen | Reason
rowhead: Application
- Clean-in-place pump coupling | 75 °C liquid, plus losses | caustic solution, inner rotor encapsulated | NdFeB, high-coercivity grade | compact coupling; grade chosen for the hot knee, Chapter 4
- Grate magnet in the seasoning hopper | 45 °C | food contact, washdown | NdFeB in welded stainless tubes | strongest field at the rod surface
- Plate magnet over the conveyor | 35 °C | dry, above the product | ferrite | large area, low cost, reach set by size
- Cross-seal servo motor rotor | about 100 °C | inside the motor | NdFeB, maker's grade | motor maker's choice, checked in Chapter 7
- Hopper lid catch and sensor magnets | 40 °C | washdown | NdFeB, encapsulated | small size
caption: This is an illustration. Temperatures are the case's estimates of the highest magnet temperature in service, not the ambient.
```

## The error: a corroded grate magnet

This is an illustration. The seasoning hopper's grate magnet is a set of 25 mm stainless steel tubes, each sealed by welding at both ends, containing stacked NdFeB discs. The grate is pulled and cleaned every shift and washed down with hot detergent at the end of each day.

At a monthly check, a technician noticed that one tube had a slight bulge near one end and that its surface field, measured with a gaussmeter, was well below the others. The tube was cut open in the workshop. The end weld had a fine crack; washdown water and detergent had entered over some weeks; the NdFeB discs near that end had corroded, swollen and partly crumbled; and their magnetisation had largely gone. The swelling had pushed the tube outwards. Had the tube split, corroded magnet fragments could have entered the product.

The investigation led to three changes. The grate was replaced with one whose tubes have a design with no weld exposed at the end faces. The monthly check gained two steps: a visual check of every tube for bulges, cracks and discoloration, and a field reading at fixed points along every tube, compared with the readings when new, so that any loss shows up as a trend. And the plant's food safety team added the grate magnet to its list of equipment whose failure could introduce a foreign body, with the check results reviewed alongside the separator's capture records in Chapter 8.

## Exercise: a ferrite alternative

This is an illustration. The grate magnet's NdFeB discs have a maximum energy product of 310 kJ/m³. A supplier offers a ferrite grate of the same tube size, at a lower price, for washdown durability.

1. Roughly how much more magnet volume would ferrite with 28.6 kJ/m³ need to do the same job?
2. Can a ferrite grate of the same tube size match the NdFeB grate's capture?
3. What would the plant gain and lose by switching?

**Worked answer.**

1. 310 ÷ 28.6 ≈ **11 times** the volume.
2. **No.** With the same tube size, there is no room for eleven times the magnet. The ferrite grate's surface field and gradient would be much lower, and Chapter 8 shows that capture depends strongly on both.
3. **Gain:** corrosion resistance and lower cost. **Lose:** most of the capture of small and weakly magnetic fragments. For a food-contact separator the capture matters most, so the plant kept NdFeB and improved the encapsulation and the checks instead.
