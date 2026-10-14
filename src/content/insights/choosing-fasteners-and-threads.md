---
title: "Choosing fasteners and threads: thread systems, grades, screws for sheet and plastics, inserts and pins"
description: "Fasteners are cheap, numerous and easy to get wrong. How to identify thread systems, read grades, choose screws, inserts and pins, and cut fastener variety without cutting reliability."
publishDate: 2026-10-09
category: "Engineering"
tags:
  - design
  - manufacturing
  - quality
author: "KEVOS®"
featured: false
draft: false
---

Fasteners are often the most numerous parts in a product. A modest machine can contain hundreds of bolts, screws, nuts, washers, pins and inserts, drawn from dozens of different sizes and types. Each one is cheap, so they rarely get much design attention. Yet fasteners decide whether a product can be assembled quickly, whether it stays together in service, and whether it can be maintained without stripped threads, seized screws and mixed-up parts.

Fastener problems are familiar. A pipe fitting with a British thread is forced into an American one and leaks. A low-grade bolt is substituted for a high-strength one. Screws strip out of thin sheet or plastic bosses. Aluminium threads wear out after a few maintenance cycles. Three nearly identical screws differ only in length, so assemblers grab the wrong one. A business holds hundreds of fastener part numbers where a few dozen would do.

This article explains how threads are described and identified, the main thread systems, how to read fastener designations and grades, how to make strong threads in sheet, plastics and soft metals, where pins, studs and rivets fit, and how to reduce fastener variety. It complements the design of bolted joints for preload and fatigue, which needs its own calculations. It is general information for designers, engineers, buyers and maintenance teams. Fastener standards and suppliers' data should be used for specific applications.

## Thread basics

A screw thread is a helical ridge on a cylinder (external thread) or in a hole (internal thread). The key terms are:

- **Major diameter**: the largest diameter of the thread, the nominal size for most threads.
- **Minor diameter**: the smallest diameter, at the root of an external thread.
- **Pitch diameter**: an imaginary diameter where thread width and groove width are equal, which controls how threads fit.
- **Pitch**: the distance between adjacent threads.
- **Lead**: the distance the screw advances in one turn, equal to the pitch for single-start threads.
- **Thread angle**: the angle between thread flanks, 60 degrees for metric and unified threads, 55 degrees for Whitworth-based British threads.
- **Hand**: right-hand threads tighten clockwise; left-hand threads are used where rotation would loosen a right-hand thread.

**Coarse pitch** threads are standard, assemble quickly and tolerate damage and dirt. **Fine pitch** threads give finer adjustment and slightly higher strength in some cases, but strip more easily in soft materials and cross-thread more readily.

**Tolerance classes** define how closely threads fit. For metric threads, 6g for external and 6H for internal threads are the common medium classes.

## The main thread systems

| System | Designation example | Angle | Where you meet it |
|---|---|---|---|
| ISO metric | M10 × 1.5 | 60° | The standard for new designs in Australia and most of the world |
| Unified inch | 3/8-16 UNC, 3/8-24 UNF | 60° | North American equipment and imported machinery |
| British Standard Whitworth and Fine | 3/8 BSW, 3/8 BSF | 55° | Older Australian and British machinery |
| British Standard Pipe, parallel | G 1/2 | 55° | Fittings sealed by a washer or O-ring on a face |
| British Standard Pipe, taper | R 1/2, Rc 1/2, Rp 1/2 | 55° | Fittings sealed on the thread with sealant |
| American taper pipe | 1/2 NPT | 60° | North American fittings, sealed on the thread |
| Trapezoidal, Acme and buttress | Tr 20 × 4 | 30° or 29°, buttress asymmetric | Power screws, jacks and presses |

Three cautions matter:

- **Never mix 55-degree and 60-degree families.** Some sizes nearly fit, so a British fitting can be forced into an American one, giving a joint that leaks or strips.
- **Pipe thread names are not diameters.** A pipe thread is named after the nominal bore of the pipe it fits, not its measured diameter. A G 1/2 thread has a major diameter of about 20.96 mm, not 12.7 mm. Identify pipe threads with gauges and tables, not by measuring and guessing.
- **Taper and parallel threads seal differently.** Taper threads seal by wedging, with sealant, and have a taper of 1 in 16 on diameter. Parallel threads only clamp; the seal is made by a washer, O-ring or gasket on a face.

Identify unknown threads with a pitch gauge, calipers and published thread tables, and record the system on drawings and in maintenance documentation.

## Reading fastener designations and grades

A metric fastener designation states the product type, nominal diameter, pitch, length, property class, coating and standard, for example: hexagon head bolt, M10 × 1.5 × 50, property class 8.8, hot-dip galvanised, to the relevant standard.

**Property classes** for metric steel bolts and screws, such as 4.6, 8.8, 10.9 and 12.9, describe strength:

- The first number times 100 is the nominal tensile strength in megapascals.
- The second number times 10 is the ratio of yield strength to tensile strength, as a percentage.

So class 8.8 has a nominal tensile strength of 800 MPa and a yield strength of about 640 MPa. Nuts have matching classes, such as 8 and 10, and should be at least as strong as the bolt class requires. Bolt heads are marked with their class, and markings should be checked on receipt.

**Stainless steel fasteners** are designated by steel group and strength, such as A2-70 or A4-80, where A2 is broadly equivalent to 304 stainless steel, A4 to 316, and the number indicates tensile strength in tens of megapascals. Stainless fasteners are generally not as strong as high-grade carbon steel fasteners and can gall when stainless nuts are tightened on stainless bolts, so anti-seize compounds may be needed.

**Inch fasteners** are graded under SAE and ASTM standards and identified by head markings, such as three radial lines for SAE grade 5 and six for grade 8.

**Australian Standards** cover commercial metric bolts, screws and nuts and high-strength structural bolting, among others. For structural connections, use bolts, nuts and washers supplied as matched assemblies to the relevant structural standard.

Non-conforming and mismarked fasteners do occur in supply chains. For critical joints, buy from reputable suppliers, require test certificates and check markings. The [inspection and test plans for supplier work](/insights/inspection-and-test-plans-for-supplier-work/) article covers building these checks into supply arrangements.

## Heads, drives and washers

Choose heads and drives for access, appearance and tightening method:

- **Hexagon heads** take the highest tightening torques with spanners and sockets.
- **Socket head cap screws** fit into counterbores and confined spaces and have high strength.
- **Button and low heads** suit covers and guards.
- **Countersunk heads** sit flush but locate the parts and need accurate countersinks.
- **Hexalobular, hexagon socket and cross-recess drives** suit power tools; hexalobular and hexagon socket drives transmit higher torques with less cam-out than cross recesses.

**Plain washers** spread load on soft materials and over slotted or oversized holes. **Hardened washers** are used with high-strength bolts. Split spring washers do little to prevent loosening; adequate preload and, where needed, prevailing-torque nuts, adhesives or wedge-locking washers are more effective.

## Making strong threads in soft and thin materials

### Tapped holes in metal

For tapped holes, thread engagement of about 1 to 1.5 times the diameter in steel is usually enough for the bolt to break before the thread strips. Softer materials such as aluminium and cast iron need more, often around 2 times the diameter. Allow extra drilled depth below threads in blind holes.

### Thread inserts

Inserts give strong, durable threads in soft or thin materials:

- **Helical coil wire inserts** create strong, wear-resistant threads in aluminium and other soft metals, and repair stripped threads.
- **Key-locking and solid inserts** suit heavy-duty and high-vibration applications.
- **Heat-set and ultrasonic inserts** install threaded brass inserts in thermoplastic parts.
- **Rivet nuts** install from one side in sheet and tube.
- **Self-clinching nuts and studs** are pressed into sheet metal to give strong threads without welding.

Use inserts wherever threads will be assembled and removed often in soft materials.

### Self-threading screws

Self-threading screws make their own thread in a plain hole, removing the tapping operation:

| Type | How it makes the thread | Best suited to |
|---|---|---|
| Thread-forming | Displaces material, no chips | Thin, ductile sheet and light alloys |
| Thread-cutting | Cuts material with flutes, producing chips | Thicker sections, castings and brittle materials |
| Self-drilling | Drills its own hole, then forms the thread | Steel sheet and light sections, such as roofing and framing |
| Screws for plastics | Forms threads with a narrow flank angle and wide spacing | Thermoplastic bosses |

The **pilot hole size** is critical and should follow the screw maker's recommendations for the material and thickness. Set the driving tool's torque between the torque needed to drive the screw and the torque that strips the thread, a window that is narrow in thin sheet and plastics. Self-threading screws can usually be reinstalled only a limited number of times.

## Pins, studs and rivets

- **Dowel pins** locate parts accurately. Hardened and ground dowels in reamed holes give repeatable location; bolts provide the clamping.
- **Spring or roll pins** retain parts with an interference fit in drilled holes.
- **Clevis pins with split pins** form removable pivots.
- **Taper pins** give tight, removable location.
- **Studs** stay in place in a tapped hole while nuts are removed, protecting soft threads during repeated maintenance.
- **Rivets** form permanent joints. In riveted joints, place rivets at least about 1.5 times the rivet diameter from plate edges to prevent tear-out. Blind rivets install from one side.

## Making and inspecting threads

Internal threads are usually made by **cutting taps** or **forming taps**, which displace rather than cut metal and suit ductile materials. **Thread milling** on CNC machines makes threads of different sizes with one tool and reduces the risk of broken taps in expensive parts. External threads made by **thread rolling** are cold worked and stronger in fatigue than cut threads. **Thread grinding** gives precision threads.

Threads are checked with **go and no-go gauges**: plug gauges for internal threads and ring gauges for external threads. Precise measurement of pitch diameter uses methods such as the three-wire method.

## Reducing fastener variety

Fastener variety has real costs: more part numbers to buy, store and count; more tools on the line; more chance of fitting the wrong part; and slower assembly. A **preferred fastener list** helps:

- Choose a limited set of thread sizes, lengths, grades, head types, drives and finishes for new designs.
- Standardise on metric threads for new designs, keeping legacy threads only where existing equipment requires them.
- Avoid near-identical lengths that are easily confused.
- Use one drive type where possible, reducing tool changes.
- Review existing products for consolidation opportunities when designs are revised.

The [controlling costs without cutting quality](/insights/controlling-costs-without-cutting-quality/) article covers reducing cost through simplification without compromising function.

## A worked example

This is an illustrative example. A machinery maker reviews the fasteners across its product range and finds about 310 different fastener part numbers, including metric, unified and legacy Whitworth threads. Assemblers sometimes fit the wrong length or grade, aluminium housings that are opened for maintenance often have stripped threads, and some customers report that imported spare fittings do not seal.

**Review.** The design and production teams analyse usage. Many part numbers differ only slightly in length or head type, and several are used only once. The aluminium housings use screws directly in tapped holes that are opened at every service. The leaking fittings combine British parallel pipe threads with American taper threads of the same nominal size.

**Changes.**

- A preferred fastener list of about 85 items is created for new designs, all metric, with one drive type for most screws.
- Existing products are moved to the preferred list as drawings are revised.
- Helical coil inserts are specified in aluminium housings at holes opened during maintenance.
- Pipe thread types are stated on every drawing and spare parts list, and fittings are standardised on one system per product.
- Incoming inspection checks head markings and certificates for high-strength fasteners.

**Result.** Wrong-part errors on the line fall sharply, stripped threads in housings stop, and the business holds fewer fastener part numbers, simplifying purchasing and stock control. Customers receive spare fittings that match.

## Applying this in an Australian business

- **Use ISO metric threads** for new designs and identify legacy threads carefully.
- **State thread systems fully** on drawings, especially for pipe threads.
- **Specify fasteners completely**: size, pitch, length, property class, finish and standard.
- **Check markings and certificates** for high-strength and critical fasteners.
- **Use inserts** for frequently removed threads in soft materials.
- **Follow pilot hole and torque guidance** for self-threading screws.
- **Locate with dowels**, clamp with bolts.
- **Maintain a preferred fastener list.**

## Where fastener choices go wrong

- **Mixing 55-degree and 60-degree threads**, especially in pipe fittings.
- **Guessing pipe thread sizes** from measured diameters.
- **Incomplete specifications** such as "M10 bolt".
- **Substituted lower-grade fasteners.**
- **Screws directly in soft threads** that are removed often.
- **Wrong pilot holes** for self-threading screws.
- **Hundreds of near-identical part numbers.**

## Questions to ask about fasteners

- Which thread system is this, and how do we know?
- Is every fastener fully specified, including grade, finish and standard?
- Are high-strength fasteners checked on receipt?
- Where are threads in soft materials removed often, and do they need inserts?
- Are self-threading screws matched to pilot holes and driving torque?
- How many fastener part numbers do we hold, and how many do we need?

## Bringing it together

Good fastener choices make products easier to build, more reliable and easier to maintain. Understand thread basics and the main thread systems, never mix 55-degree and 60-degree threads, and identify pipe threads properly. Specify fasteners completely, check grades and certificates, and choose heads, drives and washers for the job. Use tapped holes with enough engagement, inserts for soft and frequently removed threads, and self-threading screws matched to pilot holes and driving torque. Locate with pins, clamp with bolts and reduce variety with a preferred list. The result is quicker assembly, fewer failures and simpler supply.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® engineering handbooks on screw thread fundamentals, metric, unified, British and pipe thread systems, mechanical joint and fastener selection, self-threading screws and thread inserts, studs, pins and rivets, and thread manufacture and gauging, together with established fastening practice. The worked example is illustrative. This article is general information; use fastener standards and suppliers' data for specific applications.*
