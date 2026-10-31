---
book: magnetic-workholding-by-the-numbers
chapterSlug: heat-and-hot-work
order: 9
title: "Heat, hot parts and magnet temperature"
description: "How temperature changes magnetic holding: steel's magnetisation and Curie point, reversible and irreversible losses in permanent magnets, hot plates on lifting magnets and chucks, and limits to set."
draft: false
---

Heat affects magnetic holding in two places. The workpiece's ability to carry flux falls as it gets hotter, slowly at first and then completely at its Curie temperature. And the magnet's own ability to produce flux falls as the magnet gets hotter: reversibly over the normal range, and permanently if it is pushed beyond its limit. A shop that only ever puts cold parts on cold magnets can ignore both. A shop that lifts plates straight off a cutting table, or puts welded assemblies on a chuck while they are still warm, cannot.

This chapter explains what physics says about each effect, with the numbers that matter, and applies them to the case's lifting magnets and chuck. The error is a lifting magnet that was used on hot plates until it lost part of its strength for good.

## The workpiece: magnetisation and temperature

Chapter 1 described a ferromagnet's spontaneous magnetisation: neighbouring atomic moments held in line by the exchange interaction. Heat disturbs that alignment. The theory of the condensed state describes the disturbance at low temperatures as spin waves, or magnons: travelling waves in which the moments precess slightly out of line. Each magnon excited by thermal energy reduces the magnetisation by a fixed small amount, and the number of magnons excited at a temperature T, well below the Curie temperature, grows as T to the power three-halves. The magnetisation therefore falls as T^(3/2), Bloch's law of 1930.

For engineering this has a clear consequence. Iron's Curie temperature is about 770 °C, more than 1,000 K. At workshop temperatures, around 300 K, the magnetisation has fallen only slightly from its value at absolute zero, and warming a part by a few tens of degrees changes it very little. The fall accelerates as the Curie temperature approaches: the magnetisation drops steeply over the last couple of hundred degrees and vanishes at the Curie point, above which iron is not ferromagnetic at all.

```figure
type: layers
title: Steel's magnetisation from the workshop to the Curie point
caption: A qualitative picture for low-carbon steel, whose Curie temperature is close to that of iron. Alloying changes the Curie temperature; nickel's, for comparison, is about 358 °C.
- Room temperature to about 200 °C | magnetisation a little below its low-temperature value and changing slowly | holding barely affected by the steel itself
- About 200 to 600 °C | magnetisation falling faster | thick parts still hold, with reduced saturation and so a larger minimum thickness
- * Approaching about 770 °C | magnetisation falling steeply | holding collapses
- Above the Curie temperature | not ferromagnetic | no holding at all
```

The UK Health and Safety Executive's guidance on lifting magnets makes the practical point: ferrous materials lose their magnetism at around 700 °C, and magnets should not be used for hot work unless they are specially designed for it. Forge and steelworks handling magnets are designed for hot loads; ordinary plate magnets are not.

For machining and plate handling, the steel's own temperature therefore matters only for genuinely hot work, and the larger effects of warm parts are thermal expansion and distortion, which Chapter 6 dealt with. The magnet's temperature is a different matter.

## The magnet: reversible losses

A permanent magnet's remanence, Br, the flux density it retains at zero applied field, falls as the magnet warms, and recovers when it cools, as long as the magnet stays within its working range. The rate is the reversible temperature coefficient of Br, and it differs greatly between magnet materials. The figures below are the typical averages over roughly 20 to 120 °C given by Arnold Magnetic Technologies in its technical note on temperature effects; a particular grade's datasheet governs a real design.

```figure
type: compare
title: Typical temperature behaviour of permanent magnet materials
cols: Reversible coefficient of Br, % per °C | Curie temperature, °C | Where a workshop meets it
rowhead: Material
- AlNiCo 5 | −0.02 | 900 | the switchable magnets in electro-permanent chucks
- Samarium-cobalt, Sm2Co17 | −0.03 | 800 | high-temperature holding magnets
- Samarium-cobalt, SmCo5 | −0.045 | 700 | high-temperature holding magnets
- * Neodymium-iron-boron, sintered | −0.11 | 310 | permanent lifting magnets, compact chucks, magnetic bases
- Ferrite | −0.20 | 450 | low-cost magnetic tools, separators
caption: Values from Arnold Magnetic Technologies, TECHNotes TN 0303, typical averages over about 20 to 120 °C. A negative coefficient means Br falls as temperature rises. Curie temperature is not a working limit: magnets must be kept well below it.
```

Because the pull goes as the square of the flux density, the force falls about twice as fast as Br.

```figure
type: bars
title: Holding force retained at 80 °C, relative to 20 °C, by magnet material
unit: %
max: 100
caption: Calculated as (1 + coefficient × 60 °C)² from the coefficients above, assuming the flux density at the contact follows Br. Reversible losses only: the force returns when the magnet cools, provided it stayed within its rated maximum temperature.
- AlNiCo 5 | 97.6
- Sm2Co17 | 96.4
- SmCo5 | 94.7
- * Sintered NdFeB | 87.2
- Ferrite | 77.4
```

A sintered NdFeB lifting magnet at 80 °C has lost about 13% of its pull, reversibly, before anything else is counted. Makers rate their magnets for a temperature range, and within it their working load limits allow for this loss. Outside it they do not.

## The magnet: irreversible losses

Arnold's note distinguishes three kinds of loss in a magnet's output. A reversible loss disappears when the magnet returns to room temperature. An irreversible but recoverable loss occurs when temperature and the magnet's working conditions push part of the magnet past the point where it begins to demagnetise; when it cools, that part stays demagnetised, but re-magnetising the magnet restores it. An irreversible, unrecoverable loss is a change in the material itself, from corrosion or from exposure to temperatures high enough to alter its structure, and re-magnetising does not restore it.

```figure
type: steps
title: Three kinds of loss as a magnet heats
caption: The categories follow Arnold Magnetic Technologies' technical note. Where each begins depends on the material grade and the magnet's working point in its circuit, which only the maker knows for a particular product.
- Within the rated range | reversible loss | force returns on cooling
- * Above the maximum working temperature | irreversible, recoverable loss | force stays low on cooling; re-magnetising by the maker restores it
- Well above it, or with corrosion | irreversible, unrecoverable loss | the material has changed; the magnet must be replaced
- At the Curie temperature | magnetisation lost entirely | the magnet must be re-magnetised, if its material survived
```

Sintered NdFeB, with a Curie temperature of about 310 °C and coercivity that falls quickly with temperature, is the material most at risk in a workshop. NdFeB grades are sold with maximum working temperatures from around 80 °C for standard grades upwards for grades with higher coercivity, and the real limit in a product also depends on the magnet's working point in its circuit, which only the product's maker can state. A plate that has just been flame cut, or a weldment taken straight from the welding bay, can easily exceed that at its surface.

### Ferrite in the cold

Ferrite magnets behave unusually: their remanence rises as they cool, but their coercivity falls, because its temperature coefficient is positive. In a hard frost a ferrite magnet's resistance to demagnetisation is lower than at room temperature. Arnold's note illustrates the knee that develops in a ferrite magnet's demagnetisation curve as it cools. This rarely matters for workholding indoors, but it means a ferrite magnet is easier to demagnetise partly when it is very cold than at room temperature.

## Electro-permanent chucks and heat

An electro-permanent chuck combines AlNiCo, with its small temperature coefficient, and NdFeB, with its large one. It adds no heat of its own while holding, but it can be heated by what is put on it and by the machine. The case's chuck maker rates it for 60 °C at the chuck face. At 40 °C, the NdFeB's reversible loss of Br is about 2.2%, costing about 4% of the force; within the rating, and covered by the margins of Chapter 5, but a reason not to place hot parts on the chuck.

The chuck also receives heat from the cut. In heavy dry milling, a large share of the cutting power leaves in the chips, and hot chips fall onto the chuck face around the part. With BP-600's 9.16 kW cut, most of that heat goes with the chips, and over a long run the chuck face beside the plate warms noticeably unless the chips are cleared. Flood coolant, where the process allows it, carries the heat away; in dry milling, regular clearing of chips from the chuck face and an air blast keep it down. Neither is needed for the magnets' sake within the chuck's rating, but both help the chuck's accuracy, for the reasons Chapter 7 gave for electromagnetic chucks' coil heat: a chuck that changes temperature changes size.

## Hot plates and lifting magnets in the case

This is an illustration. The case's permanent lifting magnets use sintered NdFeB and are rated by their maker for loads and magnet faces up to 80 °C. Within that range their working load limit stands, because the maker's rating allows for the reversible loss. Plates are often lifted from the cutting table shortly after cutting, with the cut edges hot and the plate body warm.

The shop's rule is that a magnet may be placed only where the plate's surface reads no more than 60 °C on a contact thermometer or an infrared thermometer set for the surface, which leaves a margin to the 80 °C rating for heat flowing into the magnet's face during a slow lift. Magnets are placed away from cut edges, and a plate fresh from cutting waits on the table or is moved with slings.

## How hot the magnet's face gets

A magnet placed on a hot plate warms through its face by conduction. How hot its face becomes depends on the plate's temperature where the magnet sits, how long it stays, and how much heat the magnet's mass can absorb before it nears the plate's temperature. A lifting magnet of 35 kg is a substantial lump of steel and magnet material, and over a single lift of a minute or two its face warms only part of the way towards the plate's temperature. Over repeated lifts from hot plates, with little time between them, it keeps warming, and its face can approach the plates' surface temperature.

That is why the case's rule is set on the plate's surface temperature, with a margin, rather than on the magnet's: the plate can be measured before every lift, and a magnet that is never placed on a surface above 60 °C cannot exceed its 80 °C rating however many lifts it makes. A rule set on the magnet's temperature would need a thermometer reading after every lift, which would not happen in practice.

## Measuring a plate's surface temperature

The two practical instruments are a contact thermometer, with a surface probe, and an infrared thermometer. A contact probe reads reliably on any surface once it has had a few seconds to settle, but it must be held in good contact. An infrared thermometer reads instantly from a distance, but it reads correctly only if its emissivity setting matches the surface. Mill scale and oxidised steel have fairly high emissivity and read well with a typical setting; bright, freshly cut or ground steel has a low emissivity and reads much too cold, which on a hot plate is the dangerous direction.

The case's shop uses an infrared thermometer for speed on scaled surfaces and a contact probe on any bright or ground surface. *Infrared Temperature Measurement by the Numbers* explains the emissivity problem in its chapter on [emissivity](/reados/publications/infrared-temperature-measurement-by-the-numbers/emissivity/), with methods for setting an instrument for a particular surface.

## Welding near magnets

Magnetic holders are widely used to position parts for welding: magnetic squares, switchable magnetic bases and earth clamps. They bring heat from the weld close to a magnet, and they bring the magnet's field close to the arc. The heat matters for the magnet as in this chapter: a magnetic square placed beside a weld run can be heated well beyond its rating, so it should be placed away from the weld and removed before heavy multi-pass welding. The field matters for the weld: a magnetised part, or a magnet near the joint, deflects the arc, an effect known as arc blow, which *Arc Welding by the Numbers* explains in its chapter on [polarity, arc blow and the return path](/reados/publications/arc-welding-by-the-numbers/polarity-arc-blow-and-the-return-path/). Chapter 10 deals with the residual magnetism that parts can carry away from a chuck into the welding bay.

## The error: a magnet used on hot plates

This is an illustration. During a rush job, an operator lifted a series of flame-cut plates from the cutting table with one of the permanent lifting magnets within minutes of cutting, placing the magnet near a cut edge to reach a part. Over about an hour the magnet's face became too hot to touch.

The magnet passed its pre-use visual check the next morning, but failed the shop's monthly functional check two weeks later: with the 1 mm plastic test piece between it and the 25 mm test plate, it would not lift the plate it had always lifted. The other magnet, used only on cold plates, passed. The maker's service centre measured the magnet's output at about 80% of its value when new, consistent with an irreversible loss after the magnet's face had exceeded its maximum working temperature, and re-magnetised it. On re-test it passed.

The magnet had been carrying its working loads for two weeks with a fifth less force than its rating assumed. The shop's investigation found no record of the face temperature on the day, and no rule had stopped the operator. The 60 °C surface rule and the requirement to keep magnets away from fresh cut edges were added to the lifting procedure, and a surface thermometer was hung beside the magnets.

## Exercise: magnets in a warm bay

This is an illustration. A sintered NdFeB magnetic base for a dial indicator, and a ferrite magnetic sweeper, both work in a bay that reaches 50 °C in summer.

1. Using the coefficients in this chapter, what share of its 20 °C holding force does each keep at 50 °C?
2. Which is more affected, and why does it matter more for the magnetic base?

**Worked answer.**

1. NdFeB: (1 − 0.0011 × 30)² = 0.967² = **93.5%**. Ferrite: (1 − 0.0020 × 30)² = 0.940² = **88.4%**.
2. **Ferrite loses more, but the base matters more.** The sweeper only loses some pick-up range. A magnetic base that holds an indicator on a machine loses about 6.5% of its pull, which reduces its stiffness against knocks and vibration; if its rated temperature is exceeded it can lose force permanently, and a base that shifts invalidates every reading taken from it.
