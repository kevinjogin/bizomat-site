---
title: "Engineering for the body: what the history of medical devices teaches product developers"
description: "From the ECG to the pacemaker, CT scanner and defibrillator, medical devices met unusually hard constraints. Their history holds lessons on safety, usability and regulation."
publishDate: 2026-10-09
category: "Products"
tags:
  - product-development
  - quality
  - design
author: "BIZOMAT"
featured: false
draft: false
---

Medical devices are some of the most demanding products engineers design. They must measure signals a thousand times smaller than the noise around them, move blood without damaging it, keep working for years inside a body that cannot be opened for servicing, and be used correctly by people under extreme stress. Their failures can harm people within seconds, and they are regulated more closely than almost any other manufactured product.

Over the twentieth century, engineers working with clinicians turned those constraints into devices that now save and extend millions of lives: the electrocardiograph, the defibrillator, the artificial kidney, the heart-lung machine, the implanted pacemaker, computed tomography and magnetic resonance imaging. Australia contributed notable devices of its own, including the multi-channel cochlear implant and a widely used treatment for sleep apnoea.

This article traces how these devices were engineered and what made each problem hard, then draws out lessons for any business that develops products, whether or not it works in health: designing safety in from the start, moving expertise into the product, designing for users under stress, understanding how measurements are produced and planning for regulation early. It is general information, not regulatory advice.

## Measuring a millivolt: the electrocardiograph

The heart produces electrical signals of about one millivolt at the skin's surface. In the early twentieth century, the Dutch physiologist Willem Einthoven built a **string galvanometer**, a fine quartz filament suspended in a strong magnetic field, which deflected when current passed through it. By 1903 Einthoven was recording the heart's electrical activity reliably, and the labels Einthoven gave the features of the waveform are still used. The work was recognised with the Nobel Prize in 1924. The early machine was enormous, needed several operators and required patients to place their limbs in buckets of salt water to make a good electrical connection.

The science was largely settled by then. What followed was a long sequence of engineering:

- **Differential amplifiers** that measure the small difference between two electrodes while rejecting the much larger interference common to both.
- **Gel electrodes** with stable chemistry, replacing the salt-water buckets.
- **Standardised filtering** that removes baseline drift, mains interference and muscle noise, applied consistently because every filter distorts the waveform.
- **Digitising and automated interpretation**, which made storage, transmission and machine analysis possible.

The key engineering insight is that a weak signal can be recovered from heavy interference by **measuring a difference**, rejecting what both measurements have in common.

### Patient safety is a circuit requirement

Any device electrically connected to a patient must limit leakage current, even when a single fault occurs, because the connection can bypass the skin's natural resistance. Isolation of patient circuits, spacing between conductors and the classification of parts that touch the patient are design requirements from the first schematic. International standards, notably the IEC 60601 series for medical electrical equipment, set out how this is done.

## Controlled energy: the defibrillator

In 1899, Jean-Louis Prévost and Frédéric Battelli in Geneva showed in animal experiments that a controlled electric shock could stop ventricular fibrillation, a chaotic heart rhythm in which the heart stops pumping effectively. The aim is to depolarise the whole heart at once, so its natural pacemaker can restore a normal rhythm. Clinical defibrillators followed in the mid-twentieth century, at first large machines used only in hospitals.

The most important development came later. Survival from cardiac arrest outside hospital falls rapidly with every minute without treatment, and no health system can place a trained clinician beside every collapse within minutes. The **automated external defibrillator** solved that by moving the expertise into the device. It reads the heart rhythm through adhesive pads, decides whether a shock is needed, charges a capacitor and delivers a controlled shock, while voice prompts guide an untrained bystander. Devices shrank from tens of kilograms to a few, and costs fell enough for them to be placed in shopping centres, sports clubs and workplaces.

The defibrillator's lesson is that **who can use a product** can matter more than how well it performs in expert hands.

## Machines that replace organs

Medical devices that take over the work of an organ face constraints unlike most engineering:

- **The load cannot be reduced.** A patient's need for oxygen or for waste removal is set by physiology and cannot be scaled down to suit the equipment.
- **The working fluid is fragile.** Blood is damaged by shear, clots on contact with foreign surfaces and can carry fatal air bubbles.
- **There is no safe shutdown.** A heart-lung machine that stops during surgery, or a pacemaker that stops in a dependent patient, causes harm within seconds.
- **Implanted devices cannot be serviced.** They sit in warm salt water for years, must not provoke the immune system, and replacing a battery means surgery.

### The artificial kidney

During the Second World War, in the occupied Netherlands, the physician Willem Kolff built an artificial kidney from cellophane sausage casing wrapped around a rotating drum. Blood flowing through the cellophane tubing exchanged waste with a bath of fluid by diffusion, because the membrane let small waste molecules through while holding back blood cells and proteins. Most of Kolff's early patients died, but in 1945 a patient survived, and Kolff later gave machines to other hospitals and shared the design freely, which helped the technology spread.

Modern dialysis runs blood and cleansing fluid in **opposite directions** on either side of a membrane. Counter-current flow keeps a concentration difference along the whole membrane, while flow in the same direction lets the two streams approach equilibrium part way along, wasting much of the membrane. The same principle gives counter-flow heat exchangers their advantage and appears in many process industries.

### The heart-lung machine

Operating inside the heart requires it to be still and empty while the rest of the body continues to receive oxygenated blood. The American surgeon John Gibbon worked for about two decades on a machine to do this, and in 1953 used it to support a patient through successful open-heart surgery. The machine had to pump without crushing blood cells, which led to roller pumps that squeeze tubing from outside, and to oxygenate blood without damaging it, which eventually led to membrane oxygenators that mimic the lungs.

### The implanted pacemaker

In 1958, in Sweden, the engineer Rune Elmqvist and the surgeon Åke Senning implanted the first fully implanted pacemaker. The first unit failed within a short time and was replaced, and the patient went on to receive many devices over a long life. Pacemakers depend on extreme energy efficiency, because the battery sets the life of the implant, and on reliability engineering that leaves essentially no tolerance for uncontained failure.

Australia has its own place in this history. In the 1920s at Sydney's Crown Street Women's Hospital, the anaesthetist Mark Lidwill and the physicist Edgar Booth developed a device that delivered electrical impulses to the heart and was reported to have revived a newborn baby, an early forerunner of artificial pacing.

## Seeing inside: CT and MRI

A conventional X-ray is a shadow, with everything along each ray superimposed. In 1971, the first clinical scan with Godfrey Hounsfield's **computed tomography** scanner showed what changes when the image is calculated instead. The scanner measured how much X-ray energy was absorbed along many paths through the body at many angles, and a computer then solved for the internal structure that would produce those measurements. The mathematics had existed for decades; what was new was affordable computing to perform the reconstruction. Hounsfield shared the Nobel Prize in 1979 with Allan Cormack, who had developed related theory.

**Magnetic resonance imaging** followed, with the first human images in 1977. It uses strong magnetic fields and radio waves, and varies the field across the body so that the frequency of the returning signal indicates position. Paul Lauterbur and Peter Mansfield shared the 2003 Nobel Prize for developing the imaging methods. MRI avoids ionising radiation, and its images depend on extraordinarily uniform magnetic fields, because any unintended variation distorts the image.

In both technologies, **the instrument measures something other than the result**. The image is computed from indirect measurements, and artefacts such as streaks around metal implants come from how the image is produced rather than from faulty equipment. Interpreting the result requires understanding the method.

## Australian devices for global markets

Two Australian developments became global products. At the University of Melbourne, Graeme Clark led the development of the **multi-channel cochlear implant**, first implanted in 1978, which stimulates the hearing nerve directly to give profoundly deaf people a sense of sound; the company Cochlear was established to commercialise it. At the University of Sydney, Colin Sullivan developed **nasal continuous positive airway pressure** treatment for obstructive sleep apnoea, reported in 1981, which became the basis of a major Australian medical device business.

```figure
type: timeline
title: Engineering for the body, 1903 to 1978
caption: Each device turned a physical principle into a product that had to be safe on, or inside, a person.
- 1903 | Electrocardiograph | Einthoven records the heart reliably
- 1945 | Artificial kidney | a patient survives on Kolff's machine
- 1953 | Heart-lung machine | Gibbon supports open-heart surgery
- 1958 | Implanted pacemaker | Elmqvist and Senning, Sweden
- 1971 | Computed tomography | the image is calculated
- 1977 | MRI | first human images
- *1978 | Multi-channel cochlear implant | Melbourne, first implanted
```

Both followed a path common in medical engineering: clinical insight, close collaboration between clinicians and engineers, long development and testing, and commercialisation through companies built around the technology.

## Regulation as part of the design

Medical devices are regulated because their failures can harm people and because users usually cannot judge their safety themselves. In Australia, the Therapeutic Goods Administration regulates medical devices, which generally must be included in the Australian Register of Therapeutic Goods before they are supplied. Devices are classified by risk, and manufacturers must show that they meet essential principles for safety and performance.

Internationally recognised standards shape the work:

| Standard | Covers |
|---|---|
| ISO 13485 | Quality management systems for medical device organisations |
| ISO 14971 | Risk management for medical devices |
| IEC 60601 series | Safety and performance of medical electrical equipment |
| IEC 62366-1 | Usability engineering for medical devices |

Whether a product is regulated as a medical device depends largely on its **intended purpose**, as shown by its labelling, instructions and advertising. A product making diagnostic or therapeutic claims can fall under medical device regulation even if its hardware is similar to an unregulated consumer product. Requirements change, so businesses should check current TGA guidance and seek regulatory advice early.

## Lessons for product developers

### Design safety in from the first sketch

Patient isolation, fail-safe behaviour and risk controls cannot be added at the end. In any product, safety requirements should shape the architecture from the start. The [what engineering failures teach a business](/reados/collections/engineering-design-practice/what-engineering-failures-teach-a-business/) article explains why designing for safe failure matters.

### Move expertise into the product

The automated defibrillator let untrained bystanders deliver expert treatment. Products that embed expertise, through automation, guidance and sensible defaults, can reach users and markets that expert-only products cannot.

### Design for users under stress

People using a product in an emergency, in a hurry or for the first time behave differently from those in a demonstration. Test with realistic users in realistic conditions.

### Measure differences to reject noise

The ECG amplifier rejects interference by measuring a difference. In business measurement, comparing against a control group, a baseline period or a matched site often reveals effects that raw totals hide.

### Understand how results are produced

CT images are computed, and their artefacts come from the method. Dashboards, models and test results are also produced by methods with characteristic errors. Know the method before trusting the result.

### Trace requirements to tests

Regulated products must show that every requirement has been verified. The [requirements that can be traced and tested](/reados/collections/project-planning-and-control/requirements-that-can-be-traced-and-tested/) article describes how to do this in any product development.

### Look for portable principles

Counter-current exchange works in kidneys, heat exchangers and chemical plants. Principles that work in one field often solve problems in another.

### Sharing can speed adoption

Kolff's decision to share the design helped dialysis spread. Deciding what to protect and what to share is a strategic choice, not a default.

## A worked example

This is an illustrative example. An Australian electronics company makes wireless sensors for industrial equipment. A physiotherapy group asks it to adapt a motion sensor so that clinicians can monitor patients' joint movement at home and adjust their treatment.

**Initial plan.** The engineering team estimates nine months and $250,000 to repackage the sensor, write an app and run a small trial.

**Regulatory review.** A regulatory consultant points out that software intended to inform clinicians' treatment decisions may be regulated as a medical device, depending on its intended purpose and claims. The company would need a quality management system aligned with ISO 13485, risk management to ISO 14971, usability engineering for patients using the sensor at home, electrical safety and wireless testing, clinical evidence and inclusion in the Australian Register of Therapeutic Goods before supply.

**Revised plan.** The company estimates about 24 months and $900,000 for a regulated product. It considers two options: proceed with a regulated device in partnership with the physiotherapy group, or limit the first product to general activity tracking without clinical claims, which may change its regulatory status, subject to confirmation against current TGA guidance.

```figure
type: compare
title: Adapting an industrial sensor for clinical use
cols: Initial plan | Regulated product
caption: Software that informs treatment decisions may be regulated as a medical device, depending on its intended purpose and claims.
- Time | About nine months | About 24 months
- Cost | About $250,000 | About $900,000
- *Scope | Repackage, app, small trial | Quality system, risk, usability, testing, clinical evidence
```

**Decision.** The company chooses the regulated path in stages, beginning with its quality system and risk management, because the clinical value is in the claims. Usability testing with older patients at home leads to larger buttons, simpler pairing and clear prompts, and those changes later improve its industrial products too.

**Result.** The project takes longer and costs more than first estimated, but the company avoids building a product it could not legally supply, and it develops capabilities that open a new market.

## Applying these lessons in an Australian business

- **Make safety requirements architectural**, not late additions.
- **Embed expertise** so that more people can use the product correctly.
- **Test with realistic users** under realistic conditions.
- **Use comparisons and controls** to separate signals from noise.
- **Understand the methods** behind measurements and reports.
- **Check whether claims change regulation**, and get advice early.
- **Trace requirements** through to verification.

## Questions worth considering

- Which safety functions in our products depend on everything working normally?
- Could our product embed expertise so that less-skilled users get expert results?
- Have we tested our product with users who are stressed, rushed or new?
- Do our marketing claims change how our product is regulated?
- Which principles from other industries could solve a problem we face?

## Bringing it together

Medical devices were engineered under constraints that few other products face: tiny signals, fragile fluids, no safe shutdown, inaccessible implants and close regulation. The electrocardiograph, defibrillator, artificial kidney, heart-lung machine, pacemaker and imaging scanners each met those constraints through careful engineering, often over decades, and Australian researchers added the cochlear implant and sleep apnoea treatment. For product developers in any field, the lessons are to design safety in from the start, embed expertise, design for users under stress, understand how measurements are made and plan for regulation as part of the design.

---

*Source: BIZOMAT editorial notes, drawing on an earlier BIZOMAT engineering history series on biomedical engineering, life-sustaining machines and medical imaging, together with established histories of medicine and technology. Regulatory information is general and summarised for orientation; check current Therapeutic Goods Administration guidance and seek regulatory advice for specific products. The worked example is illustrative. This article is general information.*
