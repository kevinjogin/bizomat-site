---
book: cutting-and-gouging-by-the-numbers
chapterSlug: fume-noise-safety-and-the-record
order: 10
title: "Fume, noise, safety and the cutting record"
description: "Compare the fume, noise, radiation and fire of each cutting and gouging method, add up a day's noise dose, capture fume on tables and in the bay, and keep a cutting record that improves choices."
draft: false
---

Every method in this book removes metal by force, heat or both, and every one has a price beyond its cost per metre. Air carbon arc gouging is among the loudest and smokiest operations in metalworking; plasma cutting produces intense ultraviolet light, fume and noise; lasers can blind; waterjets can inject water and abrasive deep into flesh; lances burn at temperatures that set clothing alight in oxygen-rich air; abrasive wheels shatter. The hazards differ by method, but the approach is the same: know the hazard, measure it where it can be measured, control it at its source first, and protect people from what remains.

This chapter compares the hazards of the methods, works out a gouger's daily noise dose from several sources, describes fume capture on cutting tables and in the repair bay, and closes with the cutting record and a summary of the book.

## Hazards by method

```figure
type: compare
title: Main hazards of cutting and gouging methods
cols: Fume | Noise | Other main hazards
caption: General comparison for teaching. Actual exposures depend on the equipment, settings, material, coatings and controls, and must be assessed for each workplace.
- *Air carbon arc gouging | very heavy; metal, carbon and coating fume | extreme, often well above 100 dB(A) | arc radiation; molten spray thrown far; fire; electrical
- Plasma cutting and gouging | heavy; metal fume and nitrogen oxides | high in air; lower on water tables | ultraviolet radiation; electrical; fire
- Oxy-fuel cutting | moderate; metal fume and gases | moderate | fire; gas leaks; flashback; burns
- Fibre laser | fine fume, especially from coatings | low inside the enclosure | invisible beam that blinds; enclosed in machines
- Abrasive waterjet | little fume | high at the jet and tank | high-pressure jet injection injuries
- Lances | extremely heavy | high | extreme heat; oxygen enrichment; molten slag
- Abrasive wheels | dust | high | wheel bursts; sparks; kickback
```

## Noise and the daily dose

Noise exposure is judged against an exposure standard for an eight-hour working day, an average of 85 dB(A), with a peak limit that must not be exceeded. Every 3 dB above 85 halves the time that makes up a full day's dose, as Forge Welding by the Numbers showed for hammering. A day's dose from several noisy tasks is the sum of each task's time divided by its allowed time.

```figure
type: formula
title: A repair bay gouger's daily noise dose
formula: dose = Σ (time at each level ÷ time allowed at that level); allowed time = 8 hours ÷ 2^((level − 85) ÷ 3)
caption: This is an illustration for a gouger doing 45 minutes of arc-air gouging at about 112 dB(A) at the ear and 2 hours of grinding at about 100 dB(A), with no protection. Real levels must be measured; arc-air gouging levels vary widely with current and air pressure.
- Gouging | 45 minutes at about 112 dB(A); allowed about 0.94 minutes
- Grinding | 2 hours at about 100 dB(A); allowed about 15 minutes
step: gouging dose ≈ 45 ÷ 0.94 ≈ 48 days' worth
step: grinding dose ≈ 120 ÷ 15 = 8 days' worth
step: total ≈ 56 times the daily exposure standard, before any other noise
```

Arc-air gouging is so loud that less than a minute of it, unprotected, uses up a full day's allowance. The control is partly at the source, choosing plasma gouging or grinding where they will do, lowering the current and air pressure to what the groove needs, and gouging in an enclosed bay with sound-absorbing walls, and partly hearing protection rated for the levels, often earplugs and earmuffs together for heavy gouging. Everyone near the gouging needs protection too, because the noise does not stop at the gouger, and a fitter working ten metres away may still be exposed far above the standard. The service centre measured levels in its repair bay, moved gouging into a booth with absorptive panels, required double protection for arc-air, and used plasma gouging for lighter work.

## Fume on the cutting table

A CNC plasma table produces fume continuously while it cuts, mostly beneath the plate, where the jet blows the molten metal out. Two methods capture it. A water table holds water up to or just above the plate's underside, so that the jet and its fume are quenched in the water; some tables raise the water over the plate for cutting under water, which also cuts noise and arc light greatly. A downdraft table draws air down through the grate under the plate, in zones that follow the torch, and passes it through filters.

As an illustration, a downdraft zone 1.5 m by 1 m under the torch, drawing air down at about 0.75 m/s through the open area of the grate, extracts about 1.5 × 1 × 0.75 ≈ 1.1 m³/s. Both approaches work when maintained: water tables need their water level kept, sludge removed and the water treated to prevent rust and smell; downdraft tables need their zone dampers working, the grate kept clear of slag, and their filters changed, with spark arrestors protecting the filters from fire.

## Fume in the repair bay

Hand gouging and cutting in the repair bay are harder to control than a table, because the work moves and the fume is released at the operator's face height. The service centre's bay uses local exhaust: a flexible extraction arm or a hood positioned close to the gouging, capturing the fume before it rises past the operator's face, with general ventilation to clear what escapes. Where local extraction cannot be placed close enough, as on large castings, the gouger wears respiratory protection suited to the fume, often a powered air-purifying respirator built into the welding helmet. Coatings on the work, paint, galvanising, oil and plating, add their own fume and are removed from the gouging area first where possible. Safe Work Australia's model code for welding processes covers fume control in arc cutting and gouging as well as welding.

## Radiation and the arc

Plasma and arc-air arcs radiate intense ultraviolet and visible light, which burns unprotected eyes and skin within seconds, at distances well beyond the operator. Operators wear welding helmets with the shade the maker or standard recommends for the current, and fire-resistant clothing that covers the skin; screens shield others. Plasma tables are screened or enclosed, and water tables that cut under water reduce the arc light greatly. Lasers, whose beams can blind instantly, are used only in enclosed machines, as Chapter 7 described.

## Fire

Cutting and gouging throw hot metal and sparks much further than welding. Arc-air gouging's molten spray can travel several metres and set fire to anything combustible; plasma and oxy-fuel cutting drop slag that stays hot long after it lands; lances produce molten slag in quantity. Hot work controls apply: combustibles removed or covered, a fire watch during and after the work where the risk warrants, extinguishers at hand, and hot work permits for work outside the dedicated cutting areas. Extraction filters and dust collectors are a fire risk in themselves, because sparks drawn into them can ignite the collected dust, which is why they are protected by spark arrestors and cleaned on schedule.

## Electrical hazards

Plasma and arc-air equipment uses high open-circuit voltages, particularly plasma, whose open-circuit voltage is several times a welding set's, so damaged leads, torches and wet conditions are a serious shock risk. Equipment is inspected, kept dry and repaired only by competent people; torches are never disassembled with the power on; and work in wet, cramped or conductive locations follows the extra precautions those conditions need.

## Vibration from hand tools

Grinding the grooves left by gouging, and cutting with hand-held abrasive wheels, expose the hands and arms to vibration, which over years can damage blood vessels, nerves and joints, causing the condition known as hand-arm vibration syndrome, with numb, white fingers and loss of grip. Exposure depends on the tool's vibration level and how long it is used each day. The service centre reduced it by making smoother gouges that needed less grinding, choosing low-vibration grinders, maintaining their balance and replacing worn discs, and rotating grinding among the bay's workers, so that no one spent most of a day with a grinder in hand.

## Dust and sludge

Cutting and gouging leave waste that carries its own hazards. Grinding produces fine metal and abrasive dust, which is extracted at the tool where possible and cleaned up by vacuum rather than by sweeping or compressed air, which would put it back into the air. Plasma water tables and waterjet catcher tanks accumulate sludge of fine metal particles, oxides and abrasive, which is removed periodically, handled with gloves and eye protection, and disposed of as the local environmental rules require; sludge from cutting coated, stainless or alloy materials may contain metals that need special handling. Slag and dross from tables and lances are allowed to cool before handling.

## Health monitoring

Where exposures cannot be reduced below the levels that harm health, or where the regulations require it for particular hazards, workers' health is monitored. For cutting and gouging, that commonly means regular hearing tests for everyone exposed to noise above the standard, and, where fume exposures are significant, the health monitoring the regulations require for the substances involved, such as some metals in the fume. Health monitoring does not control the hazard; it shows whether the controls are working, and catches harm early enough to act. The service centre's hearing tests, started after the losses described below, became the measure of whether its noise controls were good enough.

## Training and the hazard register

Every method in this book has its own procedures, and people who use them need training in the equipment, its hazards and its controls before they use it, and refreshers when equipment or procedures change. The service centre keeps a hazard register for its cutting and gouging work, listing each method, its hazards, the controls in place, the measurements made and the training required, and reviews it whenever a new method or machine arrives, as when it began subcontracting laser work and planned for a laser of its own. The register is a short document, but it is the link between the risk assessment and what happens on the floor.

## The cutting record

Every chapter of this book has used numbers that came, in the running case, from the service centre's own records: speeds, consumable lives, costs per metre, removal rates, operator factors and the time spent finishing parts. The record is what turns those numbers from estimates into facts the business can rely on.

```figure
type: checklist
title: What the service centre records for its cutting and gouging work
caption: This is an illustration of the service centre's records, kept by job in its production system.
- x Job and parts | customer, material, grade, thickness, number of parts, nest utilisation
- x Method and settings | process, current or power, gas, consumables, speed
- x Time | cutting time, pierces, moves, set-up, loading and unloading
- x Consumables | starts and arc time on each set; nozzles, electrodes, lenses, abrasive used
- x Quality | dross, bevel, hole accuracy, rejects, customer feedback
- x Finishing | grinding, drilling, edge cleaning time downstream where known
- *? Gouging jobs | groove sizes, metal removed, electrodes used, checks, time
```

From the record, the manager updates the hourly rates and cost per metre every few months, checks that quotes are covering costs, sees which settings and consumables give the best results, and finds the jobs where a different method would have been cheaper. It was the record that showed the value of oxygen plasma on mild steel, the true size of the thin sheet work, the operator factors of the gougers, and the case for subcontracting laser work.

## Bringing it together

This book began with the range of methods and the questions that decide among them: material, thickness, edge, heat, quantity, place and cost. It went back to the carbon arc to see how inefficiently plain melting removes metal, and followed the air jet that turned the carbon arc into arc-air gouging, the workhorse of repair, and its use in back-gouging and defect removal. It went on to plasma, which concentrates the arc and puts about half its power into the kerf, and found where plasma and oxy-fuel each win by the metre; to lasers, which win on thin sheet and lose on thick plate, and pay only when their hours are filled; to waterjets, saws and shears, which cut cold at a price; and to lances, which cut what nothing else can at great hazard.

The numbers throughout point to a few principles. A method's speed matters more than its consumables, because the hour of machine and operator dominates the cost. The cost that decides is the cost per finished part, including pierces, finishing and quality, not the cost per metre. Capital pays only when it is used. And every method's hazards are part of its cost, to be controlled at the source before protection is relied on.

## A failure: the unmeasured bay

This is an illustration. Before the service centre's changes, its repair bay had no noise or fume measurements, and gougers wore earplugs of their own choosing, when they wore any. A hearing test programme, started when a long-serving gouger noticed their hearing failing, found noise-induced hearing loss in three of the bay's five workers.

The losses could not be reversed, and the workers affected will live with them for the rest of their lives. The measurements that followed showed exposures many times the standard. The centre moved gouging into a booth, introduced plasma gouging, supplied and enforced double hearing protection for arc-air, and began regular hearing tests for everyone in the bay. The manager's view afterwards was that the noise had been measurable all along; no one had thought to measure it.

## Exercise: protection for gouging

A gouger does 30 minutes of arc-air gouging at about 115 dB(A) and 90 minutes of grinding at about 98 dB(A) in a day. What is the unprotected daily dose? If double protection reduces the gouging level at the ear to about 85 dB(A) and earmuffs reduce the grinding to about 78 dB(A), what is the protected dose?

At 115 dB(A), the allowed time is 8 hours ÷ 2¹⁰ ≈ 0.47 minutes, so 30 minutes is about **64 days' worth**. At 98 dB(A), the allowed time is 8 hours ÷ 2^4.33 ≈ 24 minutes, so 90 minutes is about **3.8 days' worth**. The unprotected dose is about **68 times** the standard.

With protection, the gouging at 85 dB(A) is allowed 8 hours, so 30 minutes is about 0.06 of a day's dose, and the grinding at 78 dB(A), below 85, adds a small amount more. The protected dose is well **within the standard**, provided the protection is worn throughout, fits well and is rated for the levels, and the gouger's hearing is checked regularly.
