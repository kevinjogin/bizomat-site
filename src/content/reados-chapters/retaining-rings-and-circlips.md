---
title: "Retaining rings and circlips: choosing types, designing grooves and installing them so they stay put"
description: "How internal and external circlips, E-clips, spiral rings and push-on rings locate parts on shafts and in bores, how grooves and abutting parts set their capacity, and how to avoid common failures."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - design
  - manufacturing
  - quality
author: "BIZOMAT"
featured: false
draft: false
---

Many machines depend on small, inexpensive parts that nobody notices until they fail. Retaining rings, often called circlips or snap rings, are a good example. A ring that costs a few cents holds a bearing in its housing, a gear on its shaft or a pin in its bore. When it is chosen and installed well, it does its job for the life of the machine. When it is not, it can pop out under load, allow a bearing to walk, let a gear slide into a casing or fall into a gearbox and cause far more damage than its cost would suggest.

Retaining rings replace shoulders, nuts, collars and other locating features with a spring-steel ring that sits in a groove. They save space, weight, machining and assembly time. But their capacity depends on more than the ring itself: the groove, the shaft or housing material, the shape of the part pressing against the ring, the speed of rotation and the care taken during installation all matter. Many retaining ring failures trace back to a chamfered part bearing against the ring, a groove machined with a radius instead of a sharp edge, or a ring over-expanded when it was fitted.

This article explains, in general terms, the main types of retaining rings, how to choose among them, how grooves and abutting parts determine load capacity, how speed and installation affect reliability and how to inspect and specify them. It is general information; designers should use manufacturers' data and the relevant standards for specific applications.

## What retaining rings do

A retaining ring provides an artificial shoulder. It locates a component axially, either preventing it from moving along a shaft or holding it inside a bore. Typical uses include:

- holding a bearing in its housing or on a shaft;
- locating gears, pulleys and sprockets;
- retaining pins in hinges and linkages;
- securing covers, plugs and seals in bores; and
- taking up end play in assemblies.

Compared with machined shoulders, threaded nuts or collars with set screws, retaining rings are compact, fast to assemble and cheap. Their main limitations are load capacity, sensitivity to the details of the groove and abutting part, and limits on rotational speed for some types.

## Types of retaining rings

### Tapered-section circlips

The most familiar rings are **tapered-section circlips** with lug holes at each end. Their cross-section narrows from the middle towards the free ends, so that the ring stays round when it is expanded or compressed for installation. **External** circlips fit grooves on shafts and are expanded with pliers to slide over the shaft. **Internal** circlips fit grooves in bores and are compressed for installation. Standard metric series are widely published, including the common German DIN series for external and internal rings and international equivalents.

### E-clips and other radially fitted rings

**E-clips** and similar radially installed rings are pushed sideways into a groove on a shaft rather than expanded over its end. They are quick to fit and remove and suit assemblies where there is no access to the shaft end, but they generally carry less axial load and have lower speed limits than full circlips.

### Spiral retaining rings

**Spiral rings** are wound from flat wire into two or more turns. They have a uniform cross-section and no lugs, so they provide full 360-degree contact and leave no gap or protruding ears. They suit applications where space is tight or where lugs would interfere with other parts, and they are removed with a screwdriver or tool rather than pliers.

### Constant-section and wire rings

Simple rings of round or rectangular wire, sometimes called snap rings, are cheap and low in profile. Because their section is constant, they do not stay perfectly round when deformed, which limits their load capacity and precision. Rolling bearings are often supplied with a **snap ring groove** on the outer ring so that a matching snap ring can locate the bearing in a housing without a shoulder.

### Self-locking push-on rings

**Push-on** or self-locking rings grip a plain shaft or bore with angled teeth and need no groove. They are inexpensive and quick to assemble in light-duty applications, such as retaining wheels on toy axles or parts in consumer products, but they carry small loads and are usually not reusable.

## Materials and finishes

Most retaining rings are made from hardened carbon spring steel. **Stainless steel** rings, often precipitation-hardening grades, are used where corrosion is a concern, and **beryllium copper** or other alloys are used for non-magnetic or specialised applications. Finishes include oil, phosphate, black oxide and zinc plating.

Hardened spring steel is susceptible to **hydrogen embrittlement** from electroplating and some cleaning processes: hydrogen absorbed during plating can make rings crack under stress some time after assembly. Reputable manufacturers bake plated rings to drive hydrogen out, but rings should not be plated after purchase without specialist advice. The [choosing metals for engineered parts](/reados/collections/machine-elements-and-mechanical-design/choosing-metals-for-engineered-parts/) article explains more about steel selection and hardening.

## Grooves: where capacity is won or lost

The groove is as important as the ring. A ring's published load capacity usually assumes a groove of specified dimensions, machined with sharp corners, in a shaft or housing of a specified minimum hardness or strength.

### Groove dimensions

Standards and manufacturers specify groove diameter, width and the tolerances for each. A groove that is too shallow reduces the ring's seating and capacity. A groove that is too wide lets the ring tilt. Groove diameter tolerances should be shown on the drawing, along with the distance from the groove to the end of the shaft or bore.

### Edge margin

The material between the groove and the end of the shaft or bore, sometimes called the **edge margin**, must be wide enough to resist being sheared or pushed out by the axial load. Placing a groove too close to the end is a common way to reduce capacity unexpectedly.

### Corners

The load-bearing wall of the groove should be square, with a small corner radius at the groove bottom and a sharp edge at the groove wall. A large radius or a chamfer at the groove edge allows the ring to roll or tilt under load and slip out. Grooves are often machined with standard form tools that leave appropriate corners; finishing processes that round edges should be controlled.

### Groove material

In many applications, the limiting factor is not the ring but the groove wall, which can yield and deform under load, especially in softer materials such as aluminium or mild steel. Manufacturers usually publish two capacities: one limited by the ring shearing and one by the groove yielding. The lower value governs.

## The abutting part

Rings are usually tested with a flat, square-cornered part pressing against them. In real assemblies, the part bearing against the ring often has a **chamfer or radius** at its corner, such as the chamfered edge of a bearing ring or gear bore. A chamfer moves the load outwards on the ring, creating a lever that tilts the ring out of its groove at a much lower load than its rating. Manufacturers' data shows how capacity falls as the chamfer or radius increases.

Where the abutting part must have a chamfer, designers commonly add a **flat thrust washer** with square corners between the part and the ring, or choose a heavier ring series. This single detail is behind many retaining ring failures.

## Speed limits

External rings on rotating shafts experience centrifugal force, which tends to expand the ring and lift it from the groove. Each ring size has a maximum safe speed, which is lower for larger rings and for radially installed types such as E-clips. In high-speed machines, designers check ring speed limits and may choose rings with heavier sections, spiral rings or alternative locating methods.

## Installation and removal

Correct installation matters:

- **Use the right pliers or tools**, with tips that fit the lug holes and limit expansion.
- **Do not over-expand or over-compress** rings. Excessive deformation gives them a permanent set, so they no longer grip the groove properly.
- **Make sure the ring is fully seated** in the groove around its whole circumference.
- **Orient tapered rings sensibly**, for example with lugs away from areas where they could foul other parts.
- **Avoid reusing rings** that have been distorted during removal.

In volume production, applicators and automated tools improve consistency. Some rings are supplied in stacks or dispensers for automated assembly.

## Designing for service

Retaining rings make assemblies easy to take apart, but only if the designer leaves room to do it. Technicians need access for pliers or removal tools, clearance for the ring to expand or contract, and a way to support the parts so that removal does not damage them. Service manuals should name the ring by its standard designation and state that it must be replaced on reassembly. Where rings are hidden inside assemblies, a note on the drawing or a visible marking helps the next person understand how the assembly comes apart. Thinking about service early avoids later damage from screwdrivers and improvised tools, and reduces the risk of rings being reused or replaced with the wrong size.

## Inspection and quality checks

Retaining ring problems are often visible if someone looks: a ring not fully seated, a gap at one end, a ring twisted in the groove or a groove with rounded edges. Drawings should specify the ring by standard designation and material, the groove dimensions and tolerances, and any thrust washer. Incoming inspection can check ring dimensions and hardness, and assembly checks can confirm seating. The [specifying tolerances, fits and surface finish](/reados/collections/engineering-design-practice/specifying-tolerances-fits-and-surface-finish/) article explains how to express groove requirements on drawings.

## Alternatives to retaining rings

Where loads, speeds or reliability requirements exceed what retaining rings can provide, designers use other locating methods: machined shoulders, locknuts and lock washers, collars with set screws or clamping screws, pins, interference fits and adhesives. Each has its own costs and failure modes. Retaining rings are best where loads are moderate, space is tight and assembly speed matters.

## A worked example

This is an illustrative example. The product and figures are hypothetical.

A small manufacturer of conveyor drives receives warranty returns from customers whose output gears have moved along their shafts, damaging the gearbox casing. The gear is located by an external circlip on the shaft, and the circlip's catalogue rating comfortably exceeds the calculated thrust load from the helical gear.

Investigation finds two problems. The gear bore has a 1.5 mm chamfer where it bears against the circlip, which the circlip manufacturer's data shows reduces the ring's effective capacity to less than half its rating. The groove is also machined with a generous corner radius because the shop had changed form tools. Under repeated thrust load, the ring has tilted and walked out of its groove.

```figure
type: svg
title: Why a circlip walked out of its groove
alt: A gear on a shaft is held by a circlip. A large chamfer on the gear bore leaves the circlip supported only at its tip, and a generous groove corner radius lets it tilt. A hardened square-cornered thrust washer between gear and circlip supports the ring fully.
caption: A 1.5 mm chamfer cut the ring's capacity to under half its rating; a square-cornered thrust washer restored support.
viewbox: 0 0 600 220
body:
<rect class="fp" x="20" y="150" width="560" height="40"/>
<text class="tx txs" x="40" y="176">shaft</text>
<rect class="bx" x="80" y="60" width="140" height="90" rx="2"/>
<path class="ln" d="M220 150L200 130"/>
<text class="tx txs" x="150" y="108" text-anchor="middle">gear, chamfered bore</text>
<rect class="bxa pulse" x="232" y="118" width="12" height="40" rx="2"/>
<text class="tx txs" x="238" y="106" text-anchor="middle">circlip</text>
<rect class="bx" x="360" y="60" width="140" height="90" rx="2"/>
<rect class="bxi" x="500" y="100" width="14" height="50"/>
<rect class="bxa" x="516" y="118" width="12" height="40" rx="2"/>
<text class="tx txs" x="430" y="108" text-anchor="middle">gear</text>
<text class="tx txs" x="510" y="92" text-anchor="middle">washer</text>
<text class="txb" x="150" y="40" text-anchor="middle">before: tilts</text>
<text class="txb" x="440" y="40" text-anchor="middle">after: fully supported</text>
```

The manufacturer adds a hardened, square-cornered thrust washer between the gear and the circlip, specifies the groove corner condition on the drawing and adds a groove form check to its first-article inspection. The washer and inspection add about $1.20 per drive, compared with an average warranty claim of more than $800. Returns for this fault stop.

```figure
type: bars
title: The cost of the fix against one warranty claim
unit: $
max: 850
caption: Adding the washer, a groove corner callout and a groove form check stopped returns for this fault.
- *Washer and inspection, per drive | 1.2
- Average warranty claim | 800 | more than $800
```

## How this applies to a small Australian business

- **Specify rings by standard and series**, along with groove dimensions and tolerances.
- **Check the corner of every part that bears against a ring**, and add thrust washers where needed.
- **Use manufacturers' capacity data**, including groove yield and chamfer reductions.
- **Check speed limits** for rings on rotating shafts.
- **Train assemblers** to use correct tools and avoid over-expansion.
- **Inspect grooves and seating** at first article and during production.

## Common mistakes

- **Relying on the ring's rating** without considering groove material and abutting chamfers.
- **Grooves with rounded edges** that let rings roll out.
- **Grooves too close to the shaft end.**
- **Over-expanded rings** that no longer grip.
- **Plating hardened rings** without controlling hydrogen embrittlement.
- **Using E-clips where full circlips or heavier rings are needed.**

## Frequently asked questions

**Can retaining rings be reused?** It is generally not recommended. Removal often deforms the ring, and a ring that has taken a set will not grip the groove reliably. Replacement rings are cheap compared with the cost of failure.

**Which is stronger, an internal or an external ring?** It depends on size, series and groove material rather than on internal or external type. Manufacturers' data should be compared for the specific size and application.

**Why use a spiral ring instead of a circlip?** Spiral rings have no lugs, provide full circumferential contact and suit tight spaces, but they may need different removal methods.

## Questions to ask

- Which of our assemblies rely on retaining rings to carry significant thrust loads?
- Do the parts bearing against our rings have chamfers or radii that reduce capacity?
- Are our groove dimensions and corner conditions specified and checked?
- Do any of our rings run near their speed limits?
- Are assemblers using the right tools, and do they replace rings after removal?
- Have any warranty returns been traced to parts moving along shafts?

## Bringing it together

Retaining rings are small, cheap and effective when chosen and installed with care. Tapered circlips, E-clips, spiral rings, snap rings and push-on rings each suit different jobs. Capacity depends on the groove's dimensions, edge margin, corners and material, on the shape of the part bearing against the ring and on rotational speed. Correct tools, avoiding over-expansion and inspecting seating complete a reliable design. The [shafts, keys, couplings and alignment](/reados/collections/machine-elements-and-mechanical-design/shafts-couplings-and-alignment/) article covers the other ways rotating parts are located and connected.

---

*Source: BIZOMAT editorial notes. Examples and figures in this article are illustrations. This article is general information; use manufacturers' data and relevant standards for design.*
