---
book: industrial-electric-heating-by-the-numbers
chapterSlug: induction-and-infrared
order: 8
title: "Induction and infrared heating"
description: "Heat steel inside itself with induction, choose a frequency from the depth of penetration, size the power to heat a bar end, and use infrared emitters to heat surfaces by radiation."
draft: false
---

Resistance heaters make heat in a wire and then have to move it into the work, by convection, radiation or conduction. Two other electric methods skip part of that journey. Induction heating makes the heat inside the work itself, by inducing electric currents in it with an alternating magnetic field. Infrared heating makes heat in an emitter and beams it straight onto the work's surface as radiation, without heating the air between. Each is fast, controllable and efficient for the right job, and poor for the wrong one.

This chapter explains how induction heating works and why frequency controls where the heat goes, sizes an induction heater for heating bar ends, looks at infrared emitters and the wavelengths they produce, and works through a failure of each.

## Induction: heat made inside the work

An induction heater passes a high-frequency alternating current through a copper coil, usually water-cooled, wrapped around or placed near the work. The coil's alternating magnetic field induces eddy currents in any electrically conductive material inside it, and those currents, flowing through the material's resistance, produce Joule heat inside the material itself. In magnetic steels below about 770 °C, hysteresis losses add a little more heat. Nothing touches the work, and the heat appears where the currents flow.

Houston and Kennelly's 1895 book predates practical induction heating, but the principle, heat produced by currents in a resistance, is exactly the one they described for wires. Induction simply produces the current by magnetic induction instead of through wires and contacts.

## Where the heat goes: depth of penetration

Induced currents do not flow evenly through the work. They crowd towards its surface, an effect called the skin effect, and fall away with depth. The depth at which the current density has fallen to about 37% of its surface value, roughly where most of the heat is produced, is the reference depth or depth of penetration:

**δ ≈ 503 × √(ρ ÷ (μ_r × f))**

with δ in metres, ρ the resistivity in ohm-metres, μ_r the relative magnetic permeability and f the frequency in hertz. The 503 comes from the magnetic constant: it is 1 ÷ √(π × μ₀). The higher the frequency, the shallower the heating.

```figure
type: formula
title: Depth of penetration in steel above its magnetic transition
formula: δ ≈ 503 × √(ρ ÷ (μ_r × f))
caption: This is an illustration for hot steel, which above about 770 °C is non-magnetic (μ_r = 1) and has a resistivity of roughly 1.2 µΩ·m. Below that temperature, magnetic steel's high permeability makes the depth far smaller.
- ρ | resistivity of hot steel, about 1.2 × 10⁻⁶ Ω·m
- μ_r | 1 above the magnetic transition
- f | frequency, Hz
step: at 10 kHz: δ ≈ 503 × √(1.2 × 10⁻⁶ ÷ 10,000) ≈ 5.5 mm
step: at 100 kHz: δ ≈ 1.7 mm
```

Two consequences follow. First, frequency selects the depth: low frequencies heat deep, for through-heating bars and billets before forging; high frequencies heat a thin surface layer, for surface hardening of shafts and gears, where only the outer millimetre or two should be heated and quenched. Second, steel's behaviour changes as it heats. Below its magnetic transition, its relative permeability can be in the hundreds, so the depth of penetration is a fraction of a millimetre and the surface heats very quickly. As the surface passes about 770 °C, it becomes non-magnetic, its permeability falls to 1, its resistivity is several times higher than cold, and the depth of penetration grows several-fold.

```figure
type: compare
title: Depth of penetration in different materials and frequencies
cols: Depth of penetration
caption: Calculated from δ ≈ 503 × √(ρ ÷ (μ_r × f)) with typical illustrative values. Cold steel's permeability varies widely with the steel and the field strength; 100 is used only to show the order of magnitude.
- Hot steel (non-magnetic, ρ ≈ 1.2 µΩ·m), 3 kHz | about 10 mm
- Hot steel, 10 kHz | about 5.5 mm
- Hot steel, 100 kHz | about 1.7 mm
- Cold magnetic steel (μ_r ≈ 100, ρ ≈ 0.2 µΩ·m), 10 kHz | about 0.2 mm
- Copper (ρ ≈ 0.0172 µΩ·m), 50 Hz | about 9.3 mm
```

The copper figure explains why induction coils are made of copper tube and water-cooled: even at mains frequency, current crowds into the outer 9 mm of a copper conductor, and at induction frequencies into a far thinner layer, so the coil's resistance and heating are concentrated at its surface.

## Choosing a frequency

For through-heating a bar, the frequency is chosen so that the depth of penetration is a modest fraction of the bar's diameter. If it is too large, the induced currents from opposite sides of the bar overlap and partly cancel, and the coil couples poorly with the work. If it is too small, the heat is made only in a thin skin and must conduct inwards, which takes time and overheats the surface. A commonly used guide is a bar diameter of roughly four or more times the depth of penetration in hot steel; for a 25 mm bar, that suggests a depth of about 6 mm or less, so a frequency of several kilohertz, in this illustration. Induction equipment suppliers choose the frequency, coil and power from their experience and calculations for each job.

## Heating a bar end

This is an illustration. A customer asks the coating business to hot-bend the ends of 25 mm diameter steel bars, heating 100 mm of each end to about 900 °C in about 20 seconds. The heated length weighs π ÷ 4 × 0.025² × 0.1 × 7,850 ≈ **0.385 kg**. Using an average specific heat to 900 °C of about 0.65 kJ/kg·°C, which includes the extra heat absorbed around steel's magnetic transition, it needs about 0.385 × 0.65 × 880 ≈ **220 kJ**.

To deliver 220 kJ in 20 s, the bar must absorb about 11 kW. Not all the power drawn reaches the bar: some is lost in the coil's own resistance, in the power supply and as heat radiated from the hot bar. If about 65% of the supply power ends up in the bar, an illustrative figure for heating steel with a well-matched coil, the induction heater must draw about 11 ÷ 0.65 ≈ **17 kW**.

```figure
type: stats
title: Induction heating of a 25 mm bar end
caption: This is an illustration. The coupling efficiency of about 65% is an assumed value; the induction supplier's figure for the coil and frequency governs.
- 0.385 kg | Steel to heat, 100 mm of 25 mm bar
- *220 kJ | Heat to reach about 900 °C
- about 11 kW | Power into the bar for a 20 s heat
- about 17 kW | Supply power at about 65% efficiency
```

The comparison with a furnace is striking. A furnace large enough to heat bar ends would heat its whole chamber, walls and air, and lose heat continuously; the induction coil heats only the 100 mm of steel that needs it, in seconds, and draws power only while a bar is in the coil.

## Induction's limits

Induction works only on electrically conductive materials, and best on magnetic steels and on parts of simple, consistent shape that the coil can surround closely. The coil must be designed for each shape; a coil that suits a 25 mm bar will heat a 20 mm bar poorly, because the gap between coil and work weakens the coupling. Corners and edges concentrate induced currents and overheat, and holes and slots disturb the current paths. Induction power supplies and coils are a significant investment, justified by high production or by processes, like surface hardening, that only induction does well.

## Infrared: heat by radiation

Infrared heaters are emitters designed to radiate. A hot filament or element in a quartz tube, a heated ceramic panel or a metal foil emitter produces radiation that travels straight to the work, heating its surface without heating the air. The wavelength of the radiation depends on the emitter's temperature: by Wien's displacement law, the peak wavelength is about 2,898 ÷ T micrometres, with T in kelvin.

This is an illustration. A short-wave quartz emitter with its filament at about 2,200 °C (2,473 K) peaks at about **1.2 µm**; a medium-wave emitter at about 900 °C (1,173 K) at about **2.5 µm**; and the 200 °C walls of the curing oven at about **6.1 µm**. Different materials absorb different wavelengths, so the emitter is chosen to suit the coating or material: suppliers match emitters to coatings, such as powder, paint or water-based finishes, from absorption data.

## Infrared for gelling powder

The coating business uses a bank of infrared emitters at the oven entrance to gel the powder quickly on light parts before they enter the convection oven, so that the powder melts and sticks before the oven's moving air can disturb it. Infrared suits this because it heats the coated surface directly and quickly, and because a thin sheet-metal part reaches gelling temperature in seconds under intense radiation.

Infrared has the limitations of radiation (Chapter 7): it heats only what it can see. Recessed areas, the insides of tubes and the far side of complex parts are shaded and heat slowly, by conduction through the part. Thick parts absorb the heat at their surface and must wait for it to conduct inwards. That is why the business uses infrared for gelling and the convection oven for the full cure, which needs the whole part at temperature for a set time (Chapter 6).

## Induction melting and stirring

The same principle melts metal. In a coreless induction furnace, a water-cooled copper coil surrounds a refractory crucible holding the charge; the coil's field induces currents in the metal, which heats and melts. The induced currents also push the molten metal, stirring it, which evens out its temperature and composition. Induction furnaces are widely used in foundries for melting iron, steel, copper alloys and aluminium, because they are clean, controllable and need no combustion. They are the modern successors, in purpose if not in method, of the electric furnaces Houston and Kennelly described for producing aluminium alloys.

## Safety with induction and infrared

Both methods bring hazards of their own, alongside the electrical and burn hazards of any heater.

- **Magnetic fields.** Induction coils produce strong alternating magnetic fields near the coil. They can disturb pacemakers and other implanted medical devices, so people with such devices must be kept away, as Safe Work Australia's welding code also advises for the strong fields around welding equipment. Any conductive object in the field heats: a ring, a watch, a tool left near the coil or a steel bench close to it can become dangerously hot. Work areas are marked and kept clear, and operators remove jewellery.
- **Water cooling.** Induction coils and power supplies are water-cooled, and loss of cooling destroys a coil in seconds. Flow switches interlock the power, in the same way as the oven's airflow switch in Chapter 3.
- **Infrared radiation.** Short-wave emitters are intensely bright and can damage the eyes and burn skin with prolonged exposure. Infrared stations are guarded, emitters are switched off when the line stops so that a stationary part is not overheated, and people working near them use eye protection as the supplier and the risk assessment require.

## Comparing the three methods

For the jobs in this chapter, the three electric heating methods compare roughly as follows. A resistance oven heats everything in it, product, racks, air and walls, which makes it versatile and forgiving of awkward shapes but slow and wasteful for heating small parts of large objects. Induction heats only the conductive material inside its coil, quickly and precisely, but needs a coil designed for each shape and suits only conductive, preferably magnetic, materials. Infrared heats surfaces it can see, quickly and without heating the air, but cannot reach into recesses or heat thick sections through. The coating business uses all three: the oven for curing whole batches, infrared for fast gelling, and induction for the bar-bending job.

## Two failures

This is an illustration. During trials of the induction bar heater, the corners of some square-section bars, used on one order instead of round, overheated and showed signs of melting while the centres of the flats were still below bending temperature. Induced currents concentrate at corners, and the round-bar coil left larger gaps at the flats of the square bars. The supplier provided a coil shaped for the square section and a lower-power, longer heating cycle that let heat conduct from the corners into the rest of the section.

In the infrared gelling station, a batch of brackets with deep return flanges came out of the oven with powder that had slid and sagged inside the flanges. The infrared emitters had gelled the outer faces in seconds, but the insides of the flanges, shaded from the emitters, had stayed cold until the oven's moving air disturbed the loose powder. The business reduced the line speed for that part, angled the emitters to see further into the flanges, and noted in its procedure that deeply recessed parts are gelled with the emitters set accordingly or sent straight to the convection oven.

## Exercise: frequencies for hardening

For surface hardening, the depth of penetration in hot steel should be about the depth to be hardened. Using ρ = 1.2 µΩ·m and μ_r = 1, calculate the depth of penetration at 30 kHz and at 400 kHz, and say which would suit hardening a layer about 1 mm deep.

At 30 kHz, δ ≈ 503 × √(1.2 × 10⁻⁶ ÷ 30,000) ≈ **3.2 mm**. At 400 kHz, δ ≈ 503 × √(1.2 × 10⁻⁶ ÷ 400,000) ≈ **0.87 mm**.

The 400 kHz supply concentrates its heat in about the outer millimetre, which suits a hardened layer about 1 mm deep, heated fast enough that the core stays cool before quenching. The 30 kHz supply would heat a layer about three times as deep, suitable for deeper case depths or for through-heating thinner sections. The choice in practice also depends on the part's size, the power available and the heating time, which the supplier works out with the customer.
