---
book: oxy-fuel-by-the-numbers
chapterSlug: backfire-flashback-and-the-safety-chain
order: 6
title: "Backfire, flashback and the safety chain"
description: "See how back pressure at a blocked tip shifts the gas mixture inside a torch, why that leads to backfire and flashback, and what each link in the modern safety chain is for."
draft: false
---

Of everything in the 1921 investigation, its explanation of flashback did the most to change how oxy-fuel equipment was understood. The manufacturers of the day had patented many designs claimed to be free of flashback, each built on a different theory. The Bureau tested them all under the same conditions and found that none was free of it. It then set out to explain why, and the explanation it reached, built on principles going back to Humphry Davy's work on the miner's safety lamp, still shows what the modern safety chain is protecting against.

This chapter is educational. It explains mechanisms, not emergency procedures. What to do in a flashback is set by the equipment maker's instructions, AS 4839, the regulator's guidance and the training each operator must have.

## Words first

The 1921 investigators found that the manufacturers' representatives did not agree on what a flashback was. Some used flashback and backfire as the same thing; others drew distinctions, and one used a third term, preignition. The report fixed two definitions for its own use.

- **Backfire**, or preignition: a momentary retreat of the flame into the tip, after which the flame either relights itself when the torch is drawn back or needs relighting, without any adjustment of the valves.
- **Flashback**, or sustained backfire: the flame retreats into the mixing chamber and keeps burning there, with a marked hissing or squealing and a small, sharp, smoky flame at the tip. The gas has to be turned off immediately, or the head overheats and may be ruined, and the torch usually has to cool before it will relight.

Modern usage keeps backfire and sustained backfire much as the report described them, and generally reserves **flashback** for a flame that travels back beyond the torch into the hoses and the equipment upstream. That is the event flashback arrestors are designed to stop. The sequence matters: a sustained backfire is a flame burning inside the torch, and the conditions that sustain it are also the conditions that can push a flammable mixture back into a hose.

## Why the flame stays on the tip

The 1921 report starts from principles it attributes to Davy and Bunsen. A mixture of fuel and oxygen burns only between a lower and an upper limit of composition. Within those limits, the speed at which flame travels through the mixture depends on the composition, and is greatest near the proportion that burns completely. And if a mixture leaves a tube faster than flame can travel back through it, it can be lit at the mouth and will burn there without striking back.

A welding or cutting torch relies on the last principle. The mixture leaves the tip faster than flame can travel back against it, so the flame sits on the tip.

```figure
type: formula
title: Mixture velocity at a welding tip
formula: v = Q ÷ (3,600 × A)
caption: This is an illustration. At 0.525 m³/h through a 1.2 mm bore, the mixture leaves at about 129 m/s, around 17 times TWI's flame speed figure of 7.4 m/s for acetylene.
- Q | mixture flow, m³/h (0.25 acetylene + 0.275 oxygen)
- A | bore area, m²
- v | mean exit velocity, m/s
step: A = π × 0.0012² ÷ 4 ≈ 1.131 × 10⁻⁶ m²
step: v = 0.525 ÷ (3,600 × 1.131 × 10⁻⁶)
step: v ≈ 128.9 m/s
```

The difficulty, as the report put it, is that partly blocking the tip ought to make backfire less likely, not more. Any obstruction that reduces the flow area raises the exit velocity, if the flow is unchanged. Halving the area of that 1.2 mm bore would double the velocity to about 258 m/s. Yet experience showed that holding the tip too close to the work, dipping it into the weld pool, catching spatter in the bore or overheating the tip were exactly the things that caused backfires. Velocity alone could not be the explanation.

## Back pressure changes the mixture

The investigators found the missing factor by watching pressure gauges. A partly blocked tip, or a tip held so close to the plate that the expanding flame gases are confined, builds a **back pressure** inside the tip and mixer. Their tests, with the obstruction controlled and the flows measured, showed that the back pressure throttled the gas supplied at the lower pressure much more than the gas at the higher pressure.

Consider what that does to the mixture. In many torches of the day, oxygen was supplied at a much higher pressure than acetylene, often through an injector that used the oxygen jet to draw acetylene in. A back pressure chokes the acetylene first. The mixture loses fuel and moves from its working proportion towards the proportion for complete combustion, where flame travels fastest.

This is an illustration. A torch running at the base-plate case's ratio of 1.1 delivers a mixture that is 47.6% acetylene. If a back pressure reduces the acetylene flow by 40% while the oxygen flow holds, the ratio becomes 1.1 ÷ 0.6 ≈ 1.83 and the mixture falls to about 35.3% acetylene, well on the way to the 28.6% at which the mixture burns completely.

```figure
type: bars
title: Acetylene in the mixture as back pressure throttles the acetylene
unit: % acetylene by volume
max: 55
caption: This is an illustration. As the acetylene supply is choked, the mixture moves towards the proportion for complete combustion, where flame travels fastest.
- Working mixture, ratio 1.1 | 47.6
- *Acetylene cut by 40%, ratio 1.83 | 35.3
- Complete combustion, ratio 2.5 | 28.6
```

The flame speed rises as the mixture moves that way. If it rises faster than the exit velocity, the flame strikes back. In one controlled test the report describes, the flame snapped back of its own accord into a true flashback once the oxygen content had risen far enough. Having retreated to the mixing chamber, the flame destroys the back pressure, the flows return to normal, and the flame burns inside the torch in a mixture without enough oxygen to burn completely. That, the report noted, is why a flashback leaves the heavy carbon deposit familiar to anyone who has cleaned a torch after one.

The report also explained an old trick: an operator could sometimes clear a flashback in a high-pressure-oxygen torch by suddenly raising the oxygen pressure or by kinking the acetylene hose. Both changes push the mixture past the fastest-burning proportion or cut off the fuel. It is mentioned here only because it supports the mechanism. It is not a procedure, and modern emergency actions are those in the maker's instructions.

## Why no design was free of it

Torches supplying acetylene at the higher pressure should, on this reasoning, have been safer: a back pressure would choke the oxygen and make the mixture richer, slowing the flame. The investigators found that such torches could still be made to flash back, and traced the reason to the internal design of the tips.

- **Port angles.** An acetylene passage meeting the oxygen passage at right angles, with the oxygen entering downstream of it, had its flow cut off very quickly by a back pressure, which pushes most directly back along the tube.
- **Aspiration.** Where a fast oxygen jet passed acetylene ports set at an angle, it drew the acetylene in like an injector, creating a partial vacuum in the acetylene passage. A sudden obstruction collapsed that vacuum and let oxygen into the acetylene passage, producing a lean mixture instantly.
- **Throats.** Nearly every design contracted the acetylene passage to raise its velocity. By the continuity and energy relationships the report sets out, a faster stream in a contraction has a lower pressure, so the acetylene was already the more easily choked gas, whatever the supply pressures.

Even the so-called equal-pressure torches tested proved not to be truly equal in operation. The report concluded that every torch tested could flash back from an obstruction, that those running oxygen at much higher pressure than acetylene were the most susceptible, and that a torch that kept equal volumes of each gas at identical pressures, even with the tip completely blocked, would be both free from this kind of flashback and safe. None on the market did.

## Gas pushed back into the hoses

The same back pressure that changes the mixture can drive one gas back into the other's passage, and then into its hose. That forms a flammable mixture behind the mixing chamber, where no flame should ever be. The report warned that the danger grows with the difference in supply pressures, because a larger difference pushes the mixture back faster and further, and that leaks in the hoses make it worse. It also noted the low lower flammable limit of acetylene: its figures, from earlier work, were about 3.35% to 52.3% acetylene in air. Modern reference data, such as the NIOSH Pocket Guide, give a range of 2.5% to 100%, the upper figure reflecting the fact that acetylene can decompose without any oxygen at all. A small amount of returned gas is enough to make a dangerous mixture, and the 1921 hope that a very rich mixture would simply stop burning is not one modern practice relies on.

Some makers of the day fitted check valves to stop the return flow. The report doubted their value: a weak spring, a speck of dirt or scale, or a corroded seat could stop a check valve working, with no sign until it was needed. That criticism is the reason modern safety devices are tested at intervals rather than trusted.

## Heat: the other cause

All torches, the report found, could be made to flash back by overheating the tip and head, whatever their design. Its severe test lowered a lit torch over a hole about 51 mm in diameter and 51 mm deep in a heavy cast-iron block. The flame turned back on itself and wrapped around the head, heating the tip to redness and threatening the brazed joints between the gas tubes and the head. The report noted that the same thing happens to a lesser degree in welding into corners.

Heat-induced flashback, the investigators suggested, is not a gradual retreat of the flame but the sudden ignition of a large volume of hot mixture in a hot tip, closer to a detonation, which explains its violence and the damage to tip ends. Anything that keeps the mixture cool helps: tips and heads of high-conductivity metal such as copper, water cooling on heavy equipment, and working practices that do not bury a tip in a confined pocket.

## The modern safety chain

Modern practice answers each 1921 mechanism with a layer of protection. WorkSafe ACT's guidance describes a flashback arrestor as a device designed to contain a flashback and stop it reaching upstream equipment such as hoses, regulators and cylinders, and notes that most contain a non-return valve, a flame arrestor and a thermal cut-off valve that closes if the arrestor overheats. It reports that AS 4839 says arrestors should be fitted at both the regulator and the torch on both the oxygen and the fuel gas lines for the best protection, that arrestors should be inspected and tested by a competent person every 12 months, and that after any flashback a competent person should remove and inspect the arrestors, hoses and fittings, and the cause should be found and fixed before the equipment is relit. Arrestors themselves are made to standards such as AS 4603 and ISO 5175-1.

```figure
type: compare
title: The 1921 mechanisms and the modern answers
cols: What it does | Modern layer
caption: No single device covers every mechanism. The arrestor is the last line, not the first.
- Back pressure shifts the mixture | flame retreats into the torch | correct pressures; clean, sound tips; correct stand-off
- Gas pushed into the other hose | flammable mixture upstream | non-return valves, tested; leak-free hoses
- *Flame travels up the hose | fire or explosion at regulator | flame arrestor at torch and regulator, both gases
- Overheated arrestor | sustained burning in the device | thermal cut-off valve
- Overheated tip | sudden ignition in the head | sound tip seats; cooling; avoid burying the tip
- Undetected device failure | protection absent when needed | 12-monthly inspection and test; check after any event
```

Arrestors are one part of a safe system of work. They do not replace correct assembly and purging, leak testing, trained operators, supervision, the right equipment for the gas and the job, and a clear procedure for what to do when something goes wrong.

## A failure: the torch-end arrestors that were not there

This is an illustration. While trimming base plates by hand, an operator worked the tip into the corner of a notch. The torch backfired twice, then went into a sustained backfire with the characteristic squeal. The operator shut the torch valves as trained, the flame went out, and nobody was hurt.

The investigation found three things. The nozzle was loose in the torch head, and its seat was damaged, so it leaked when hot, which the 1921 severe tests had recorded as a common fault. The hand torch had arrestors only at the regulators; the torch-end arrestors had been removed months earlier because they made the torch heavier. And the regulator-end arrestors were two months past their test date. None of these had caused an injury, but together they meant that a flame in the hose would have met no barrier until the regulator, and that the barrier there had not been proved.

The corrective actions followed the chain. The nozzle and head were replaced, arrestors were fitted at the torch end on both gases and sized for the flow, all arrestors, hoses and fittings were inspected and tested by a competent person, and the test dates went onto the station record of Chapter 10. The operator's training was refreshed on stand-off and on recognising the warning signs that the earlier backfires had given.

## Exercise: velocity is not enough

The welding tip in the formula above carries 0.525 m³/h of mixture through a 1.2 mm bore. A blob of spatter halves the open area while, for a moment, the flow is unchanged. At the same time the resulting back pressure cuts the acetylene flow by 40%. Calculate the new exit velocity and the new acetylene fraction, and explain which change matters more.

Halving the area doubles the velocity to about **258 m/s**, far above the 7.4 m/s flame speed. But the mixture has moved from 47.6% to about **35.3% acetylene**, towards the fastest-burning proportion, and the flows have stopped being steady. The velocity figure is the mean speed of the gas across the bore, while the flame can travel back along the slower layers near the wall, through a mixture whose flame speed is rising. The change of mixture, not the change of velocity, is what the 1921 investigators identified as the cause of backfire becoming flashback.
