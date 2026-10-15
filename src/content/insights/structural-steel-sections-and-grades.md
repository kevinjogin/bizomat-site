---
title: "Structural steel sections and grades in Australia: reading designations and choosing the right shape"
description: "How Australian structural steel sections and grades are designated, what section properties mean, why shape matters for bending, buckling and torsion, and what to check on compliance."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - design
  - quality
  - manufacturing
author: "KEVOS"
featured: false
draft: false
---

Steel frames, platforms, mezzanines, machine bases, conveyor structures, canopies and racks all start with a choice of structural steel sections. To someone outside the trade, the designations can look like code: 310UB40.4, 150PFC, 100 × 100 × 6 SHS, C350L0, grade 300. To a designer, fabricator or buyer, those few characters carry a great deal of information about shape, size, mass, strength and the standard the steel must meet.

Understanding that information helps in several ways. It helps owners and project managers read drawings and quotes. It helps fabricators avoid substituting sections that look equivalent but are not. It helps designers choose shapes that suit the loads, rather than defaulting to whatever was used last time. And it helps everyone recognise when a question needs a qualified structural engineer rather than a guess.

This article explains, in general terms, the common Australian structural steel sections and how they are designated, the main grades and standards, what section properties mean, why shape matters for bending, buckling and torsion, and the practical compliance, corrosion protection and fabrication issues that affect steelwork. It is general information only. Structural design, including member sizing and connection design, must be carried out by appropriately qualified engineers in accordance with the National Construction Code and applicable Australian Standards.

## The common section types

| Section | Designation example | Typical uses |
|---|---|---|
| Universal beam (UB) | 310UB40.4 | Beams in floors, mezzanines, frames |
| Universal column (UC) | 200UC52.2 | Columns, heavily loaded members |
| Welded beam and welded column (WB, WC) | Larger sizes beyond hot-rolled ranges | Heavy beams and columns |
| Parallel flange channel (PFC) | 150PFC | Purlins, trimmers, edge members, frames |
| Tapered flange beam (TFB) | 125TFB | Lighter beams and older designs |
| Equal and unequal angles (EA, UA) | 75 × 75 × 6EA | Bracing, frames, brackets, lintels |
| Square, rectangular and circular hollow sections (SHS, RHS, CHS) | 100 × 100 × 6 SHS | Columns, frames, trusses, machine frames, handrails |
| Cold-formed C and Z sections | C15024 (style varies by supplier) | Purlins and girts in light structures |
| Flats, bars and plate | 100 × 10 flat, 16 mm plate | Connections, base plates, brackets |

For universal beams and columns, the designation gives the **nominal depth** in millimetres, the section type and the **mass per metre** in kilograms. A 310UB40.4 is a universal beam about 310 mm deep weighing 40.4 kg per metre. Two beams with the same nominal depth can have different masses, flange widths and thicknesses, and therefore different strengths and stiffnesses, so the full designation matters.

Hollow sections are designated by outside dimensions and wall thickness, such as 100 × 100 × 6 SHS, with the grade stated separately.

## Grades and standards

Structural steel in Australia is supplied to Australian and New Zealand standards for each product form. In broad terms:

- **Hot-rolled sections** such as universal beams, columns, channels and angles are commonly supplied to AS/NZS 3679.1, typically in grade 300.
- **Welded sections** are supplied to AS/NZS 3679.2.
- **Plate** is supplied to AS/NZS 3678, in grades such as 250 and 350.
- **Cold-formed structural hollow sections** are supplied to AS/NZS 1163, commonly in grades such as C350L0 and C450L0.

The grade number broadly indicates the minimum yield strength in megapascals for the relevant thickness range. Letters and suffixes indicate further properties; for example, in a hollow section grade such as C350L0, "C" indicates cold-formed, 350 the nominal minimum yield strength and "L0" an impact toughness requirement at 0°C. Some applications, such as structures exposed to low temperatures or dynamic loads, may require grades with specified toughness.

Design of steel structures is commonly carried out to AS 4100, with cold-formed steel structures designed to AS/NZS 4600. The relevant standards are called up through the National Construction Code for building work. The [building regulation for project teams](/insights/building-regulation-for-project-teams/) article explains how the NCC and referenced standards apply.

## What section properties mean

Section property tables published by steel suppliers list properties that designers use to check members. The most important include:

- **Second moment of area (symbol I)**: a measure of how the cross-section's area is distributed about an axis, governing **stiffness** in bending. Deflection depends on it directly.
- **Section modulus (symbols Z for elastic and S for plastic)**: governs **bending strength**, relating the bending moment to the stress at the extreme fibre or the full plastic capacity.
- **Radius of gyration (symbol r)**: relates to resistance to **buckling** of compression members.
- **Torsion constant (symbol J)** and **warping constant**: govern resistance to **twisting**.
- **Area (symbol A)**: governs axial capacity and mass.

Every section has a **major axis** and a **minor axis**. A universal beam is very strong and stiff about its major axis, bending in the plane of its web, and much weaker about its minor axis. Turning a beam on its side can reduce its stiffness dramatically.

## Why shape matters

### Bending and deflection

For beams, depth is the most efficient way to gain stiffness and strength. Doubling the depth of a beam, for the same flange and web proportions, increases its stiffness far more than doubling its mass would by other means. That is why I-shaped sections concentrate material in flanges far from the neutral axis.

### Buckling

Slender members in compression can **buckle** at loads well below their material strength. Columns buckle more readily about their weaker axis and when their effective length is long. Beams can buckle sideways and twist, called **lateral-torsional buckling**, if their compression flange is not restrained. Thin plate elements of a section can also buckle locally. These effects are why bracing, restraints and the classification of sections matter as much as nominal strength.

### Torsion

**Open sections** such as channels, beams and angles are weak in torsion. **Closed sections**, such as square and rectangular hollow sections, are far more resistant to twisting for the same mass. Machine frames, trailers, outrigger arms and members subject to offset loads often benefit from hollow sections for this reason. Channels have an additional complication: their **shear centre** lies outside the web, so loads applied through the web tend to twist them unless the loading or connections account for it.

## Hot-rolled or cold-formed

Structural sections reach the market in two broad ways. **Hot-rolled** sections, such as universal beams, columns and channels, are rolled from hot steel into their final shape. **Cold-formed** sections, including structural hollow sections and light-gauge C and Z purlins, are formed from strip or sheet at room temperature.

Cold-forming work-hardens the steel, which raises yield strength in the corners and allows high-strength grades, but it also reduces ductility in the formed regions. Light-gauge cold-formed sections are thin, so local buckling, connection design and corrosion protection need particular attention, and they are designed to their own standard. Hollow sections combine good strength-to-weight with excellent torsional resistance, which is why they are so widely used in frames and handrails.

## Other design considerations

Several further considerations often influence section choice:

- **Fire.** Steel loses strength at high temperatures. Building regulations may require fire resistance, achieved through protective coatings, encasement or section sizing, depending on the building's classification and use.
- **Deflection and vibration.** Floors and mezzanines may be strong enough but still feel lively under foot traffic or machinery. Stiffness and vibration criteria can govern section size.
- **Connections and erection.** Sections that are easy to connect, transport and erect often save more than marginal savings in steel mass.
- **Availability.** Some sizes are stocked widely; others have long lead times. Checking availability early avoids redesign.

## Fabrication, galvanising and connections

The choice of section affects fabrication and protection:

- **Hollow sections** need sealing or venting. If a hollow section is to be **hot-dip galvanised**, it must have vent and drain holes so molten zinc can flow in and out and trapped air or moisture does not cause dangerous pressure build-up in the bath. Galvanisers publish guidance on hole size and position.
- **Welding** hollow sections and thick sections requires suitable procedures and qualified welders. The [welded joints for fabricators](/insights/welded-joints-for-fabricators/) article covers weld procedures, qualification and inspection.
- **Connections** often govern the design and cost of steelwork. Standard connection details reduce cost and risk.
- **Corrosion protection** should be specified from the start: galvanising, paint systems or a combination, selected for the environment. Australian standards provide guidance for both galvanised coatings and protective paint systems. The [protecting metal parts from corrosion and wear](/insights/protecting-metals-from-corrosion-and-wear/) article explains the options.

## Compliance and traceability

Steel that does not meet its claimed standard can compromise safety. Practical safeguards include:

- **Specifying the standard and grade**, not just the section size.
- **Obtaining mill test certificates** that show the standard, grade, chemical composition and mechanical properties, and that can be matched to the delivered steel.
- **Checking markings** on sections and plates against the certificates.
- **Considering third-party certification**. Independent certification schemes exist for structural and reinforcing steels supplied in Australia, and some project specifications require certified steel.
- **Keeping records.** Retain certificates and delivery records with the project file, because they may be needed for building certification, future modifications or investigations.
- **Treating substitutions as engineering decisions.** An imported section with similar dimensions but a different standard, grade or toughness is not automatically equivalent. Substitutions should be approved by the responsible engineer.

## A worked example

This is an illustrative example. The project and events are hypothetical, and no member sizes here should be used for design.

A small fabricator is building a storage mezzanine for a client. The engineer's drawings specify 310UB40.4 beams in grade 300 to AS/NZS 3679.1 and 100 × 100 × 6 SHS columns in C350L0 to AS/NZS 1163, hot-dip galvanised.

The fabricator's supplier offers imported beams described as "equivalent to 310UB40" at a lower price, with dimensions close to the Australian section and a certificate referring to an overseas standard. The fabricator also plans to seal the column ends with welded cap plates before galvanising, to keep moisture out.

On review, the engineer notes that the offered beams are slightly lighter, with thinner flanges, and are certified to a different standard whose grade designation does not directly correspond to the specified grade. Without a proper equivalence assessment, the beams cannot be accepted. The engineer also points out that sealed hollow columns must not be galvanised without vent and drain holes, because trapped air or moisture can expand violently in the zinc bath and the internal surfaces would remain unprotected. The fabricator orders the specified compliant beams, adds vent and drain holes to the columns according to the galvaniser's guidance and fits the cap plates after galvanising using a detail approved by the engineer.

The extra steel cost is modest. The avoided risks, a non-compliant structure, a dangerous galvanising incident and internal corrosion of the columns, are substantial.

## How this applies to a small Australian business

- **Read designations fully**: section type, size, mass, grade and standard.
- **Do not substitute on appearance.** Similar dimensions do not guarantee equivalent properties or compliance.
- **Ask for certificates** and check them against the steel delivered.
- **Choose shapes for the load**: deep I-sections for bending, hollow sections for torsion and compact columns.
- **Plan galvanising details early**, especially for hollow sections.
- **Engage a qualified structural engineer** for any structural design or change, including mezzanines, platforms, frames and lifting points.

## Common mistakes

- **Ordering by nominal depth only**, without the mass and grade.
- **Turning beams onto their weak axis** without checking.
- **Using open sections where torsion dominates.**
- **Galvanising sealed hollow sections** without vent and drain holes.
- **Accepting uncertified or non-equivalent imported steel.**
- **Treating structural changes as fabrication decisions** rather than engineering ones.
- **Leaving corrosion protection until the end** of the design.

## Frequently asked questions

**Can we use a heavier section if the specified one is unavailable?** Possibly, but heavier is not always equivalent: depth, flange width, grade and connection geometry also matter. Any substitution should be approved by the responsible engineer.

**What does the number after UB mean?** It is the mass per metre in kilograms. A 310UB40.4 weighs 40.4 kg per metre.

**Do we need an engineer for a small platform or mezzanine?** Structures that people stand on, or that support significant loads, generally require structural design and certification by a qualified engineer, and building approval may be required. The consequences of failure are too serious for guesswork, even on small structures.

**Why are hollow sections common in machine frames?** Because they resist twisting far better than open sections of similar mass and present clean, easily sealed surfaces.

## Questions to ask

- Do our drawings and orders state the section, grade and standard for every member?
- How do we verify that delivered steel matches the specification?
- Are substitutions reviewed by a qualified engineer?
- Have galvanising and corrosion protection details been considered for every member?
- Are we using section shapes that suit bending, compression and torsion in each application?

## Bringing it together

Structural steel designations encode the section type, size, mass, grade and standard, and each element matters. Australian structural steel is supplied to standards for hot-rolled sections, welded sections, plate and hollow sections, and designed to standards called up through the National Construction Code. Section properties describe stiffness, strength, buckling resistance and torsional resistance, and shape determines which of those a section provides efficiently. Specifying fully, verifying compliance, treating substitutions as engineering decisions and planning galvanising and connections early keep steelwork safe and economical.

---

*Source: KEVOS editorial notes. Examples in this article are illustrations. Structural design must be carried out by appropriately qualified engineers in accordance with the National Construction Code and applicable standards.*
