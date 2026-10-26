---
book: sheet-metal-joints-by-the-numbers
chapterSlug: galvanic-pairs-and-sealing
order: 8
title: "Galvanic pairs and sealing"
description: "Judge a mixed-metal joint by galvanic order, wetness and area ratio, isolate and seal it, allow for thermal movement, and catch aluminium rivets corroding in a stainless hinge."
draft: false
---

A joint between two different metals is a battery when it is wet. The more active metal, the anode, corrodes faster than it would alone; the more noble one, the cathode, corrodes slower. Whether that matters depends on three things: how far apart the metals are in activity, whether water or another electrolyte bridges them, and how large the cathode is compared with the anode. A small anode on a large cathode corrodes quickly; a large anode with a small cathode barely notices. Sheet metal products put dissimilar metals together all the time, aluminium doors on steel frames, stainless fasteners in aluminium, galvanised steel beside copper, and each such joint needs a moment's thought.

This chapter sets out the galvanic series in practical terms, the area-ratio rule, the ways to break the circuit by isolation and sealing, and the thermal movement that mixed-metal joints must also accommodate. The running case examines EN-700's hinge, where aluminium rivets fix a stainless hinge leaf to an aluminium door, and finds the rivets themselves corroding after a season on a coastal site.

## The galvanic series

Metals can be ranked by how readily they corrode when coupled in a given electrolyte, such as seawater. The ranking, called a **galvanic series**, runs from the most active, or anodic, to the most noble, or cathodic. In broad terms, for the metals common in sheet metal work, the order runs:

- **most active**: magnesium, then zinc, including the zinc on galvanised steel;
- then **aluminium** and its alloys;
- then **carbon steel and cast iron**;
- then lead, tin, brass and copper;
- **most noble**: passive stainless steel, nickel alloys, titanium, then gold and platinum.

Published series give measured potentials for many alloys in a stated electrolyte, and design references give tables of compatible and incompatible pairs. The further apart two metals sit, the stronger the galvanic drive between them. The order is what matters most for design; the exact potentials depend on the alloy, its surface condition and the electrolyte, which is why published series state the conditions they were measured in.

```figure
type: layers
title: A simplified galvanic order for sheet metal joints
caption: This is a simplified order for common metals in a wet, salty environment. Published galvanic series give measured potentials for specific alloys and conditions.
- Most noble | Passive stainless steel, nickel alloys, titanium
- Noble | Copper, brass, tin, lead
- *Middle | Carbon steel, cast iron
- Active | Aluminium and its alloys
- Most active | Zinc, including galvanised coatings; magnesium
```

## Three conditions

Galvanic corrosion needs all three of:

- **two metals in electrical contact**, directly or through a conductive fastener;
- **an electrolyte bridging them**: rain, condensation, salt spray, a wet gasket;
- **a difference in activity** large enough to drive a current.

Remove any one and galvanic corrosion stops. A joint that is always dry, such as one inside a sealed, heated enclosure, can couple quite different metals safely. A joint that is often wet, especially with salt, cannot. Condensation counts as wet: an unheated outdoor enclosure that cools at night can collect water on its inside faces, so "inside" does not always mean dry, and EN-700's earth stud, inside the door, is checked for it too. The design question is which condition is easiest to remove for a particular joint.

## The area ratio

The corrosion rate of the anode depends heavily on the ratio of the cathode's wetted area to the anode's. The galvanic current is roughly limited by what the cathode can drive, and it is concentrated on whatever area of anode is available. A **large cathode on a small anode** concentrates the attack and corrodes the anode fast. A **small cathode on a large anode** spreads it thinly and does little harm.

This is the reason for an old rule: fasteners should be the same as, or more noble than, the parts they join, never less noble. A stainless screw in an aluminium panel is a small cathode on a large anode, usually acceptable; an aluminium rivet in a stainless panel is a small anode on a large cathode, and the rivet suffers.

## The running case: EN-700's hinge

This is an illustration. EN-700's door hinge is a 1.5 mm stainless steel leaf, about 600 mm long and 30 mm wide, riveted to the 2.0 mm aluminium door with twelve 4.0 mm aluminium blind rivets, as Chapter 3 specified. The rivets were chosen to match the door galvanically. The hinge leaf, though, is stainless, and the rivets' heads sit on it.

The wetted stainless leaf has an area of about 600 × 30 = **18,000 mm²**. The twelve rivet heads, each about 8 mm across, have about 50 mm² each, about **603 mm²** in all. Where the rivets contact the stainless leaf, they are a small anode on a cathode about **30 times** their area.

```figure
type: bars
title: Cathode-to-anode area ratio at EN-700's hinge, by rivet material
unit: ratio
max: 32
caption: This is an illustration. With aluminium rivets, the stainless leaf is a cathode about 30 times the rivets' area; with stainless rivets, the rivets and leaf together are a cathode about one-twentieth of the door's 350,000 mm².
- *Aluminium rivets in the stainless leaf | 29.8
- Stainless rivets and leaf on the aluminium door | 0.05
```

## The error: rivets corroding in the hinge

This is an illustration. After a season on a coastal site, where salt spray reached the enclosure, the doors of the first EN-700s showed white corrosion product around every hinge rivet, and some rivet heads had lost visible metal. The aluminium door itself, away from the hinge, was in good condition.

The pattern fitted the area rule exactly. The aluminium rivets were small anodes on the large stainless leaf, wet with salt spray; they corroded preferentially, with the stainless leaf protected at their expense. The fabricator's fix had three parts:

- **Isolate the leaf from the door and the rivets.** A thin, non-conductive isolating tape under the leaf and sealant-coated rivets break the electrical path through the joint and keep water out of it.
- **Seal the heads.** A bead of compatible sealant over each rivet head keeps the electrolyte off the junction of rivet and leaf.
- **Reconsider the materials.** For coastal sites, the design was changed to an aluminium hinge leaf with aluminium rivets, a single metal with no galvanic drive, accepting a slightly less robust hinge.

The general lesson is that matching the fastener to one part of a joint is not enough when the joint involves three metals, or two metals and a fastener. The fastener must be considered against **every** metal it touches, and the area ratio judged for each contact.

## Isolation

Galvanic corrosion is stopped by breaking the electrical contact between the metals, while keeping them mechanically joined. Common means include:

- **isolating tapes, gaskets and pads** between the sheets;
- **isolating washers and sleeves** around fasteners, so that a bolt does not connect the two parts;
- **coatings** on one or both metals, preferably on the cathode, because a scratch in a coating on the anode concentrates attack at the scratch;
- **sealants** that keep water out of the joint and cover the fastener's head.

Isolation must not defeat other requirements. EN-700's door must be electrically earthed, which needs metal contact between the earth stud and its lug; that contact is made inside the enclosure, dry, with a lug and stud of compatible materials, rather than across the wet hinge.

## Galvanised steel with other metals

Galvanised steel's zinc is near the active end of the series, which is why it protects the steel beneath it: zinc corrodes sacrificially instead of steel. The same activity means the zinc is attacked quickly when coupled with more noble metals in the wet. Copper and brass, in particular, should not be coupled with galvanised steel outdoors, and water running off copper onto galvanised steel, such as from a copper earth strap or a brass fitting above, carries copper ions that attack the zinc where they land. Aluminium and galvanised steel are relatively close in the series and are often joined, but in salty conditions an isolating layer between them is still good practice.

## Thermal movement

Mixed-metal joints also move. Chapter 1 estimated that EN-700's 500 mm aluminium door grows about 0.22 mm more than an equal length of steel for a 40 K rise. At the hinge, the stainless leaf expands at about 17 × 10⁻⁶ per kelvin and the aluminium door at about 23 × 10⁻⁶, typical coefficients in this illustration. Over the leaf's 600 mm and the same 40 K, the difference is about **0.14 mm**, shared among the rivets at roughly 50 mm pitch: about **0.012 mm** of relative movement between each pair of rivets. That is small enough for the rivets and the sheet's elasticity to absorb without loosening. A longer joint, a larger temperature swing or a stiffer pair of materials, such as a long aluminium cladding panel fixed to a steel frame, needs slotted holes, flexible fixings or expansion gaps, because the movement there can be millimetres.

## How harsh is the site?

The same joint can be safe in one place and fail in another, because the electrolyte's strength and how long it stays on the joint vary enormously between sites. An enclosure inside a dry building rarely sees an electrolyte at all; one in an inland town sees rain that dries quickly; one near a surf beach or in an industrial area sees salt or acidic deposits that stay damp. Australia's atmospheric corrosivity varies widely across the continent and is classified for design purposes in AS 4312, Atmospheric corrosivity zones in Australia, which this book names only for its scope. EN-700's fabricator now asks for the installation site's corrosivity category on every order, and specifies the coastal hinge for the harsher categories.

## Coat the cathode, not just the anode

When only one metal in a galvanic pair can be coated, the usual advice is to coat the **cathode**, or both, rather than only the anode. A coating on the anode will have scratches and pores, and each one becomes a tiny anode exposed to the whole uncoated cathode: the worst possible area ratio, concentrated at a pinhole. A coating on the cathode reduces the cathode's effective area, which reduces the galvanic current everywhere. For EN-700's original hinge, a coating on the stainless leaf would have helped the aluminium rivets far more than a coating on the rivets alone.

```figure
type: checklist
title: Reviewing a mixed-metal sheet joint
caption: This is an illustration of a design review routine. A published galvanic series and the site's corrosivity category inform each answer.
- Which metals touch | Every metal, including fasteners, washers and inserts
- Is the joint wet | Indoors and dry, outdoors, coastal or industrial
- How far apart in the series | Close pairs tolerate more; distant pairs need care
- Area ratio for each contact | Small anode on a large cathode is the danger
- Isolation and sealing | Tape, washers, sleeves, sealant, without breaking a needed earth
- x Fastener matched to only one of the parts | The hinge error
- ? Coastal or industrial site | Get the corrosivity category before choosing materials
```

## Crevices and drainage

Joints between sheets are crevices, and crevices hold water. A lapped joint that collects rain, a fold that faces upwards, a gasket that stays wet: each keeps an electrolyte in place long after the surrounding surfaces have dried, and each can corrode even between identical metals, by a different mechanism called crevice corrosion. Designing joints to shed water, sealing them where they cannot, and providing drainage holes at low points of enclosed sections reduce how long any joint stays wet, which reduces every kind of corrosion at once.

## Inspecting mixed-metal joints

Galvanic corrosion announces itself early to anyone who looks: white powdery deposits around aluminium fasteners or at aluminium edges in contact with steel, red rust staining from steel in contact with stainless, the zinc of galvanised steel turning dull white and then disappearing around a copper or stainless fitting. It is worth a scheduled look. EN-700's fabricator now inspects a returned or field-visited enclosure's hinge, cable plate and earth stud whenever one is available, and keeps a short record by site category. After a few years that record says more about which joints suit which sites than any table, because it is the fabricator's own products in its customers' own conditions. The record also guards against an over-correction: a change of material for coastal sites that was not needed inland, and which made every enclosure more expensive.

## Exercise: stainless screws in the cable plate

EN-700's cable plate, a 2.0 mm aluminium plate about 200 × 120 mm, is fixed with six stainless steel M6 screws into stainless self-clinching nuts in the galvanised steel bottom panel, over a rubber gasket. Assess the galvanic risks at the plate, and say what the joint schedule should require.

**Worked answer.** There are three metals: aluminium plate, stainless screws and nuts, and galvanised steel panel. The gasket separates the aluminium plate from the galvanised panel, so that pair is isolated, provided the gasket covers the whole contact area. The stainless screws touch the aluminium plate under their heads: a small cathode, six heads of perhaps 100 mm² each, about 600 mm², on an aluminium plate of about 24,000 mm², a favourable ratio of about 1 to 40. The stainless nuts sit in the galvanised panel: again a small cathode on a much larger anode, the zinc around them, and usually acceptable, though the zinc immediately around each nut will be consumed faster in the wet.

The joint schedule should require the gasket to extend under every screw head's bearing area, or isolating washers under the heads, so that the screws do not bear directly on the aluminium; a sealant or a compatible coating on the nuts' surroundings on the outside of the panel; and periodic inspection on coastal sites. The plate's removal for service means the isolation must survive repeated assembly, which favours washers over a sealant that would be broken each time.
