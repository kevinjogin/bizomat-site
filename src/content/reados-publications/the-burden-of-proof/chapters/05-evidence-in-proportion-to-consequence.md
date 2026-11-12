---
book: the-burden-of-proof
chapterSlug: evidence-in-proportion-to-consequence
order: 5
title: "Evidence in proportion to consequence: the same seal on a water pump and a chemical pump"
description: "Why the evidence demanded for a claim should rise with the consequence of relying on it wrongly, how to rate that consequence, and what evidence each level needs, using one seal in two services."
draft: false
---

The same claim can deserve different amounts of evidence in different places. A seal that is said to last three times as long might be trialled on a cooling-water pump with little more than the supplier's word, because if it fails early the factory loses a seal and a few hours. On a pump dosing a hazardous chemical, the same claim needs much more, because an early failure could injure someone. The claim has not changed. The consequence of relying on it wrongly has.

This chapter sets out that principle, from a Victorian essay that still provokes argument, rates the consequence of the seal claim in two services, and states what evidence each needs.

## The shipowner

In "The Ethics of Belief", published in 1877, the mathematician W. K. Clifford told the story of a shipowner about to send an old emigrant ship to sea. He had doubts about her seaworthiness. He put them aside, reasoning that she had made many voyages safely and that Providence would look after the passengers, and he came to believe sincerely that she was sound. The ship sank. Clifford argued that the shipowner was guilty of the deaths, because he had no right to his belief on the evidence he had. And he argued that the shipowner would have been equally wrong had the ship arrived safely, because the wrong lay in how the belief was formed, not in how things turned out.

Clifford put his conclusion in a sentence that is still quoted: "it is wrong always, everywhere, and for anyone, to believe anything upon insufficient evidence." Twenty years later William James replied, in "The Will to Believe", that some choices are forced and momentous and cannot wait for sufficient evidence, and that in such cases refusing to believe is itself a choice with consequences. The debate between them continues, including in the philosophy of religion that this book's source discusses. This book takes neither side on its religious application.

For engineering decisions, the two views combine into a working rule. Clifford is right that what counts as sufficient evidence depends on what is at stake for others: the shipowner's evidence might have done for a cargo of timber, and did not do for a ship full of people. James is right that decisions often cannot wait for complete evidence, a point Chapter 8 takes up. The working rule is that the evidence demanded should rise with the consequence of being wrong, and that a decision made on incomplete evidence should be made knowingly, with the consequence in view.

## One seal, two services

This is an illustration. The supplier's long-life seal fits the factory's cooling-water pumps. In a follow-up letter, the supplier proposes the same seal family, in a different material, for the two small pumps that dose sodium hypochlorite into the cooling water as a biocide. The dosing pumps' present seals also fail more often than the plant engineer would like, and the supplier offers the same claim: three times the life.

In the cooling-water service, a seal failure means a leak of warm water at the pump, noticed on the next round, a pump changed over to its standby, and a seal replaced within a shift. In the dosing service, a seal failure means a leak of a corrosive chemical that can harm skin and eyes, and that can release chlorine gas if it mixes with an acid. The dosing area has a bund, but a leak still exposes whoever finds it and cleans it up.

## Rating the consequence

The [risk rating tool](/tools/risk-score/) in BIZOMAT Tools rates a risk on the classic five-by-five matrix: a likelihood score from 1 to 5 multiplied by a consequence score from 1 to 5, with a response band of low (1 to 6, accept and monitor), medium (7 to 14, mitigate and assign an owner) or high (15 to 25, treat before proceeding and escalate). It flags any consequence rated 5 for controls even when likelihood is low, and its stated limitation is that the organisation's own descriptors for likelihood and consequence must be used, so that scores are comparable.

The plant engineer uses the factory's own risk descriptors. The likelihood that an unproven seal fails earlier than expected is the same in both services, because it is the same claim about the same design: she rates it 3, possible. The consequences differ.

```figure
type: compare
title: The same seal claim rated in two services
cols: Likelihood | Consequence | Score | Band
caption: This is an illustration. From the risk rating tool, using the factory's descriptors. The likelihood is the same because the claim is the same. The consequence, and therefore the evidence needed, is not.
- Cooling-water pump | 3, possible | 2, minor: water leak, seal change in a shift | 6 | Low: accept and monitor
- Hypochlorite dosing pump | 3, possible | 4, major: chemical release, possible injury | 12 | Medium: mitigate and assign an owner
- * Dosing pump, if the bund or detection were inadequate | 3, possible | 5, severe: serious injury possible | 15 | High: treat before proceeding
```

The score does not decide anything by itself. It sorts the two uses into different bands, and the bands set how much evidence the claim must carry before the factory relies on it.

The likelihood score deserves a comment. For an unproven claim, the likelihood that it is wrong is exactly what the factory does not know, and a rating of 3 is a judgement standing in for missing evidence. That is why the plant engineer holds the likelihood the same in both services and lets the consequence do the work. If she tried to argue the likelihood down for the dosing pump, to bring it into the low band, she would be using the claim she is meant to be testing as evidence for itself.

## The evidence each band needs

The plant engineer sets a ladder of evidence, rising with the band. It is not a statistical standard; it is a statement, made in advance, of what the factory will want to see before relying on a claim at each level of consequence.

```figure
type: layers
title: Evidence needed before relying on the seal claim
caption: Each level includes those below it. The ladder is set before the evidence arrives, so that it cannot be adjusted to fit what the supplier happens to provide.
- High | Do not trial an unproven seal. Documented performance in the same chemical and concentration, independent where possible; consider eliminating the seal altogether
- Medium | Chemical compatibility data for the seal materials at the actual concentration and temperature; references from the same service; a controlled trial with added leak detection and inspection
- Low | The supplier's test or field data in a similar duty; a site trial with the factory's normal monitoring and a written failure criterion
```

For the cooling-water pumps, the claim needs only the low level: the supplier's data in a similar duty and a properly designed trial, which Chapter 6 builds. For the dosing pumps, it needs the medium level at least: data showing that the seal's face and elastomer materials resist sodium hypochlorite at the concentration and temperature used, references from users in the same service, and a trial only with extra controls, such as a leak sensor in the bund and a daily inspection.

### Work health and safety governs the dosing pump

The dosing pump decision is also a work health and safety decision, and the law of the factory's jurisdiction governs it. Safe Work Australia's model code on how to manage work health and safety risks describes identifying hazards, assessing risks and choosing controls, starting with eliminating the hazard where reasonably practicable. For a leaking seal, elimination might mean a pump with no shaft seal at all, such as a magnetically coupled or diaphragm design, which removes the hazard the seal claim is about. That option should be considered before any choice between seals. A supplier's life claim is relevant to the choice of control, not a substitute for the risk assessment.

## Asymmetric errors

The ladder reflects a further point: the two ways of being wrong do not cost the same. Accepting a false claim on the cooling pump costs a seal and a shift; rejecting a true one costs the extra seal life the factory could have had. Both costs are modest and of similar size, so modest evidence is a fair balance.

On the dosing pump, accepting a false claim could cost an injury. Rejecting a true one costs some seal changes on a small pump. The costs are now wildly unequal, and the evidence demanded should be correspondingly high: the factory should be willing to forgo a real improvement rather than risk the release. That is Clifford's shipowner in modern form. The question is not only whether the claim is probably true, but what happens to other people if it is not.

```figure
type: balance
title: The two errors on the dosing pump
left: Rejecting a true claim
right: Accepting a false claim
tilt: right
caption: This is an illustration. The errors are not of the same size, so the evidence threshold should not be set as if they were. The heavier side sets the standard.
- More frequent seal changes on a small pump | A release of a corrosive chemical in the dosing area
- Fitter time for the extra changes | Possible injury to whoever finds or cleans the leak
- The extra life the factory could have had | Possible chlorine release if the leak meets an acid
```

## Sometimes the best evidence is not needing the claim

A high burden of evidence can be expensive to meet. Documented performance in the same chemical, from independent sources, may not exist for a new seal. The supplier may be unable to provide it however willing it is. In that position, the factory has a choice it often overlooks: remove the need to rely on the claim at all.

For the dosing pumps, that means the elimination option from the risk assessment. A pump with no dynamic shaft seal has no seal to fail, so the question of whether one seal lasts longer than another disappears. The plant engineer asks two pump suppliers for prices on sealless dosing pumps of the right size. If the price difference is small against the cost of the evidence the seal claim would need, and the cost of a release if it proved wrong, the sealless pump wins without any trial.

The same move applies more widely. A claim that a controller will not fail matters less if the drives revert safely to fixed speed when it does, as Chapter 2 found. A claim about a heat pump's COP matters less if the contract pays on measured performance. Each of these designs the decision so that being wrong about the claim costs little, which is often cheaper than proving the claim. It does not replace the burden of evidence. It reduces the consequence that sets the burden's size.

## The failure case: evidence carried to a new service

## The failure case: evidence carried to a new service

This is an illustration. Some years earlier the factory changed the gaskets on its process water lines to a new material that had performed well in a two-year trial. The success led maintenance to use the same material when replacing gaskets on a small solvent line serving a parts cleaner. Nobody thought of it as a new decision; it was the gasket that worked. The material swelled in the solvent, and the joint wept within a month. A fitter was splashed while investigating.

The evidence had been good for water. It said nothing about solvent. And the consequence of a leak had changed from a wet floor to a chemical exposure, so even good evidence for the material in solvent would have needed a higher standard.

### How it is detected and corrected

The failure is detected by a rule: any change in the service of a component, its fluid, temperature, pressure or the people near it, is a new decision that needs its own risk rating and its own evidence, however well the component has performed elsewhere. The correction at the factory was to add a line to the maintenance change procedure: "Same part, new service? Re-rate the risk and check compatibility before fitting." The material change on the solvent line was reversed the same week.

## The burden scales, not just the evidence

Chapter 1 placed the burden of evidence on the party making the claim. This chapter adds that the size of the burden is set by the consequence of relying on the claim, and that the party who bears the consequence, or puts others at risk, must decide how large it is. The supplier cannot set it, because the supplier does not bear the consequence of a leak in the factory's dosing area.

That has a practical effect on the conversation. When the supplier asks why the factory wants more evidence for the dosing pump than for the cooling pump, the plant engineer can answer plainly: the claim is the same; the consequence of its being wrong is not; and the factory decides how much evidence a consequence requires. Most suppliers accept that, because it is the same reasoning they would want applied to their own plant.

## Exercise: three proposed uses

The supplier proposes the long-life seal for three more pumps. Rate each with the risk rating tool, using a likelihood of 3, state the band, and say what evidence you would want before relying on the claim.

1. A pump circulating water through a mould temperature controller, in a guarded area, with a standby pump.
2. A pump transferring hydraulic oil from a drum to a reservoir, used weekly, with a drip tray.
3. A pump circulating hot water at 85 °C through a jacketed vessel in an area where people work alongside it.

**Worked answer.**

1. Consequence 2, minor: a water leak inside a guarded area, with standby. Score 6, low. The supplier's data in a similar duty and a site trial with a failure criterion are enough.
2. Consequence 2 or 3, depending on the factory's descriptors for a contained oil leak and the slip and environmental hazard: score 6 or 9, low or medium. Want the supplier's compatibility data for the oil, and confirm the drip tray's capacity and inspection before trialling.
3. Consequence 4, major: a hot-water leak at 85 °C where people work could cause scalds. Score 12, medium. Want data in the same temperature range, references from similar services and a trial only with added controls, such as a splash guard and inspection, after considering whether the hazard can be removed by guarding or relocating the pump. As with the dosing pump, the work health and safety assessment comes first and governs.
