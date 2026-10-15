---
title: "Choosing tool steels for dies, punches, moulds and fixtures"
description: "How tool steel families differ, the trade-off between wear resistance and toughness, matching grades to dies, moulds and fixtures, and the heat treatment decisions that make or break tooling."
publishDate: 2026-10-16
category: "Manufacturing"
tags:
  - manufacturing
  - design
  - quality
author: "KEVOS"
featured: false
draft: false
---

Every press tool, injection mould, die-casting die, forming tool and precision fixture starts with a material decision. Tool steels are the usual answer: steels with enough carbon and alloying elements to be hardened to high levels and to keep their shape, edge and surface under repeated loading. Choosing among them can seem like a specialist's art, with grades identified by cryptic letters and numbers and datasheets full of comparative bar charts.

The decision matters more than the material cost suggests. The steel in a die or mould is usually a small part of its total cost, which is dominated by design, machining, heat treatment and fitting. But the wrong grade can turn that investment into a tool that chips in its first week, wears out in a fraction of the expected life, distorts in heat treatment or cracks when the press is pushed. The right grade, with the right heat treatment, can multiply tool life and cut downtime.

This article explains, in general terms, the main tool steel families, the trade-offs between their properties, how to match grades to common applications, the heat treatment and surface treatment decisions that matter and how to diagnose failures. It is general information. Steel suppliers' datasheets and heat treaters' advice should guide the choice for a specific tool, and typical hardness values given here are indicative only.

## What makes a tool steel

Tool steels are designed to be **hardened** by heat treatment and then **tempered** to a useful balance of hardness and toughness. Their carbon content and alloying elements, such as chromium, molybdenum, vanadium, tungsten and nickel, form hard carbides that resist wear and help the steel retain hardness at temperature. Different combinations produce different balances of properties:

- **Wear resistance**: resistance to abrasion and adhesion, largely driven by hard carbides.
- **Toughness**: resistance to chipping and cracking under impact.
- **Hardness**: resistance to indentation and deformation.
- **Hot hardness**: retention of hardness at elevated temperatures.
- **Dimensional stability**: how little the steel moves during heat treatment.
- **Machinability and grindability** before and after hardening.
- **Polishability and corrosion resistance**, important for moulds.

The central trade-off is between **wear resistance and toughness**. Grades with large amounts of hard carbides wear slowly but chip more easily; tougher grades resist chipping but wear faster. Most tool steel selection is about finding the right point on that trade-off for the job.

## The main tool steel families

Tool steels are commonly identified using the American AISI letter system, with European material numbers widely used as equivalents. Common families include:

| Family | Example grades (European equivalent) | Character | Typical uses |
|---|---|---|---|
| Oil-hardening cold work | O1 (1.2510) | Easy to machine and harden; moderate wear resistance | Short-run dies, gauges, fixtures, knives |
| Air-hardening cold work | A2 (1.2363) | Good balance of wear resistance and toughness; low distortion | General blanking and forming dies, punches |
| High-carbon high-chromium | D2 (1.2379) | High wear resistance; lower toughness | Long-run blanking dies, shear blades, wear parts |
| Shock-resisting | S7 | High toughness; moderate wear resistance | Punches and chisels under impact, heavy blanking |
| Hot work | H13 (1.2344) | Good toughness and hot hardness; resists heat checking | Die-casting dies, forging dies, extrusion tooling, demanding moulds |
| High-speed steel | M2 | High hot hardness and wear resistance | Cutting tools, some punches |
| Plastic mould steels | P20 type (1.2311, 1.2738) | Supplied pre-hardened; machinable; polishable | Injection mould cavities and inserts for moderate volumes |
| Stainless mould steels | 420 type | Corrosion resistance and polishability | Moulds for corrosive plastics, medical and optical parts |

**Powder metallurgy (PM)** tool steels deserve mention. Made from atomised powder, they have very fine, evenly distributed carbides, giving combinations of wear resistance and toughness that conventional steels cannot achieve. They cost more but can be economical for long runs, abrasive materials or high-strength sheet.

### Indicative working hardness

Working hardness depends on the heat treatment chosen for the application, but broad indicative ranges help when reading drawings and datasheets. Cold-work steels such as O1, A2 and D2 are commonly used in roughly the high 50s to low 60s on the Rockwell C scale. Shock-resisting steels are often used a little lower to preserve toughness. Hot-work steels such as H13 are commonly used in the 40s to around 50 HRC, balancing hot hardness with resistance to cracking. High-speed steels run higher, in the low to mid 60s. Pre-hardened P20 mould steels are typically supplied around 30 HRC, so they can be machined without further hardening.

## Matching grades to applications

### Blanking and piercing

Blanking dies and punches face abrasive wear at the cutting edges and, in thicker or stronger materials, significant shock. For thin, mild sheet and long runs, high-wear grades such as D2 or PM steels perform well. For thicker or higher-strength material, punches may chip in D2; tougher grades such as A2, S7 or tough PM grades often perform better. Die clearance, alignment and press condition matter as much as the steel: a well-chosen grade will still chip in a misaligned tool.

### Forming and bending

Forming tools face sliding wear and **galling**, where sheet material adheres to the tool surface. Wear-resistant grades with good surface finish, often combined with surface treatments or coatings, help. Lubrication and tool finish are as important as the base steel.

### Plastic injection moulds

Mould steels must machine and polish well, resist wear from the plastic, especially glass-filled grades, resist corrosion from some polymers and the cooling water, and survive the volume required. Pre-hardened P20-type steels suit many moulds for moderate volumes. Through-hardened grades such as H13 suit higher volumes and abrasive materials. Stainless grades suit corrosive polymers and high polish requirements. The [designing plastic parts for injection moulding](/insights/designing-plastic-parts-for-injection-moulding/) article explains how part design affects tooling.

### Die casting and hot work

Die-casting dies face repeated heating and cooling, causing **heat checking**, a network of fine surface cracks. Hot-work steels such as H13 and premium variants are designed for this duty. Preheating dies, controlling cooling and stress relieving at intervals extend die life.

### Fixtures, gauges and wear parts

Fixtures and gauges need stability, wear resistance at locating surfaces and good machinability. O1 and A2 are common for hardened locators and gauges; for many fixtures, case-hardened low-carbon steel or hardened inserts in a mild steel body are more economical than making the whole fixture from tool steel.

## Heat treatment decisions

Heat treatment determines whether a tool steel delivers its potential. Key points include:

- **Follow the steel's datasheet.** Each grade has recommended hardening temperatures, quench methods and tempering cycles.
- **Use competent heat treaters.** Vacuum hardening reduces surface decarburisation and scaling; controlled atmospheres and accurate temperature control matter.
- **Temper properly.** Many grades need tempering soon after hardening, and some benefit from multiple tempers. Untempered or under-tempered tools are brittle.
- **Consider sub-zero treatment** where dimensional stability is critical, following specialist advice.
- **Allow for distortion.** Leave grinding or EDM allowance after hardening, and finish critical features after heat treatment where possible.
- **Avoid decarburised surfaces.** A soft skin on a cutting edge wears quickly; allow for its removal.

The [heat treatment and surface hardening explained](/insights/heat-treatment-and-surface-hardening-explained/) article covers hardening, tempering and distortion in more depth.

## Surface treatments

Surface treatments can add wear, galling or corrosion resistance without changing the base steel:

- **Nitriding** diffuses nitrogen into the surface, creating a hard, wear-resistant layer with little distortion.
- **PVD coatings** such as titanium nitride or chromium nitride reduce wear and galling on punches and forming tools.
- **Hard chrome and other platings** have been used for wear and release, though alternatives are increasingly common.

The base steel must support the treatment; a hard thin coating on a soft substrate will fail. The [protecting metals from corrosion and wear](/insights/protecting-metals-from-corrosion-and-wear/) article describes coatings and surface rebuilding more broadly.

## Buying and specifying tool steel

How tool steel is bought and specified affects both cost and reliability:

- **Specify the grade clearly**, using the supplier's designation and a recognised equivalent, and state the required working hardness range on the drawing.
- **Ask for mill certificates** showing chemical composition and, where relevant, heat number, so material can be traced if a problem arises.
- **Choose the supply condition.** Most cold-work steels are bought annealed for machining and then hardened; mould steels are often bought pre-hardened; precision flat-ground stock saves machining on small parts and fixtures.
- **Allow for cleaning up the surface.** Bar and plate may carry a decarburised skin from rolling, which should be removed from working surfaces.
- **Consider block quality for large tools.** For large moulds and dies, ask about cleanliness and internal soundness, and whether the supplier tests blocks for internal defects.
- **Record what was used.** Note the grade, supplier, heat treatment and hardness achieved for each significant tool. When a tool performs unusually well or badly, those records explain why.

Local tool steel suppliers in Australia often stock European-designated grades and can advise on equivalents, availability and lead times, which can matter when a tool breaks and must be replaced quickly.

## Diagnosing tooling failures

The failure mode points to the response:

| Failure | Likely cause | Typical response |
|---|---|---|
| Rapid edge wear | Grade not wear resistant enough; abrasive material | More wear-resistant or PM grade; coating |
| Chipping | Grade too brittle; misalignment; excessive clearance or impact | Tougher grade; check alignment and clearance |
| Cracking | Stress raisers, poor heat treatment, overload | Larger radii; check tempering; review design and loads |
| Galling | Adhesion between tool and sheet | Surface finish, coatings, lubrication, different grade |
| Plastic deformation | Hardness too low for the load | Higher hardness or stronger grade |
| Heat checking | Thermal cycling | Hot-work grade, preheating, controlled cooling |

## A worked example

This is an illustrative example. The figures are hypothetical.

A small press shop blanks brackets from 3 mm high-strength steel sheet. Its punches, made from D2, chip after about 15,000 hits, causing burrs and requiring the press to stop for regrinding. Each punch change and regrind costs about $350 in labour, downtime and grinding.

The toolmaker reviews the failure. The chipping occurs at the punch corners, and the die clearance has been set for mild steel. For the stronger material, a tougher punch grade and slightly larger clearance are likely to help. The shop trials a tough PM tool steel for the punch, costing more per punch, and adjusts the clearance according to the steel supplier's guidance.

The new punches run about 80,000 hits before needing regrinding, mainly because of gradual wear rather than chipping. For an annual volume of 240,000 brackets, the number of punch interventions falls from 16 to 3. At $350 each, intervention costs fall from about $5,600 to about $1,050 a year, a saving that far exceeds the additional material cost, before counting the improved bracket quality.

## How this applies to a small Australian business

- **Choose by duty, not habit.** Match the grade to wear, impact, heat and volume.
- **Remember the trade-off.** If tools chip, increase toughness; if they wear, increase wear resistance.
- **Invest in heat treatment.** A good heat treater is as important as the steel.
- **Consider PM steels for demanding jobs.** Higher material cost can be repaid by much longer life.
- **Use surface treatments where they fit.** Nitriding and coatings can solve galling and wear problems.
- **Record tool life.** Without records, it is hard to judge whether changes help.
- **Check equivalents.** Local suppliers may stock European-numbered equivalents of common grades.

## Common mistakes

- **Using a high-wear grade where impact causes chipping.**
- **Choosing the cheapest steel** for a tool whose failure stops production.
- **Poor or uncontrolled heat treatment.**
- **No allowance for distortion** after hardening.
- **Coatings on unsuitable substrates.**
- **Blaming the steel for alignment, clearance or press problems.**

## Frequently asked questions

**Should every die be made from the most wear-resistant steel available?** No. If the dominant failure is chipping or cracking, a more wear-resistant grade may fail sooner. Match the grade to the failure mode and duty.

**Are pre-hardened steels as good as through-hardened ones?** They are more convenient and avoid heat treatment distortion, but they are softer. They suit moulds and tools where their hardness is enough for the volume and material.

**Can a broken tool be repaired by welding?** Often, using filler metals matched to the tool steel and careful preheating and post-weld heat treatment. Specialist tool welders can extend the life of valuable dies and moulds, but poorly controlled repairs can crack.

## Questions to ask

- What is the main duty of this tool: wear, impact, heat, galling or corrosion?
- How many parts must it produce, and from what material?
- How do our current tools fail, and what does that suggest?
- Who heat treats our tooling, and how is the process controlled?
- Would a PM grade or surface treatment reduce our total cost?
- Do we record tool life and failure modes?

## Bringing it together

Tool steels trade wear resistance against toughness, with hot hardness, stability, machinability, polishability and corrosion resistance as further factors. Cold-work, shock-resisting, hot-work, high-speed, mould and powder metallurgy grades each suit particular duties. Choosing the right grade starts with the tool's dominant failure risk, and succeeds only with correct heat treatment, sensible allowances for distortion and, where helpful, surface treatments. Recording tool life and failure modes turns tooling from a recurring problem into a steadily improving system.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. Hardness values are indicative; always follow steel suppliers' datasheets and heat treaters' advice.*
