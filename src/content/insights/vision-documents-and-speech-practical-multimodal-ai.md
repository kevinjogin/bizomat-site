---
title: "Vision, documents and speech: practical multimodal AI in operations"
description: "AI that reads documents, understands photos and transcribes speech can remove hours of data entry and note taking. Where it works, how to measure accuracy and how to keep people in control."
publishDate: 2026-10-09
category: "Technology"
tags:
  - ai
  - operations
  - automation
author: "KEVOS®"
featured: false
draft: false
---

A great deal of operational information does not arrive as tidy data. It comes as scanned invoices and delivery dockets, photos of damaged goods and site conditions, marked-up drawings, handwritten checklists, voicemails, phone calls and meetings. Turning it into usable records has traditionally meant manual typing, listening and summarising, which is slow, tedious and error-prone.

**Multimodal AI**, systems that work with images, documents and audio as well as text, can now take on much of this work. It can read documents and extract fields, describe and answer questions about images, transcribe and summarise speech, and read text aloud. The technology is capable but not infallible: a misread digit on an invoice, a misheard quantity in a voice note or a confident description of something not in a photo can cause real problems. The value comes from applying it to the right tasks, measuring its accuracy honestly and designing checks around it.

This article explains the main types of multimodal AI, practical uses in Australian operations, how to measure accuracy, how to design workflows with validation and human review, privacy considerations and how to start. It is general information for operations managers and technical teams. Capabilities vary between products and improve quickly, so test any tool on your own material.

## The main capabilities

- **Optical character recognition (OCR)** converts images of text, such as scans, photos and PDFs, into machine-readable text.
- **Document extraction** goes further, identifying fields such as supplier, invoice number, date, line items and totals, and returning them in a structured form. Modern systems combine OCR with language models that understand layout and context.
- **Image understanding** describes images, classifies them, detects objects and answers questions about them, known as **visual question answering**: "Is there visible corrosion on this flange?" or "Which items in this photo are damaged?"
- **Speech recognition** converts spoken audio to text, for meeting notes, call records, voice-entered field reports and dictation.
- **Text-to-speech** converts text to natural-sounding speech, for phone systems, accessibility and hands-free instructions.
- **Multimodal embeddings** represent images and text in a shared form, so a photo can be used to search for similar photos or relevant documents.

These capabilities are often combined. A field inspection app might transcribe a technician's voice notes, analyse their photos, extract readings from an instrument display and assemble a draft report.

## Practical uses in operations

| Area | Example uses |
|---|---|
| Accounts and administration | Extracting data from invoices, receipts, delivery dockets and statements; matching to orders |
| Logistics | Reading consignment notes and labels; photo evidence of condition at delivery |
| Field service and maintenance | Voice-to-text job notes; photo-based fault descriptions; reading equipment nameplates |
| Construction and engineering | Extracting data from drawings and schedules; site photo records; searching drawing sets by content |
| Quality | Reading inspection forms and certificates; organising non-conformance photos |
| Customer service | Transcribing and summarising calls; classifying photos customers send with claims |
| Meetings and knowledge | Transcripts, summaries and action lists from meetings and toolbox talks |
| Accessibility | Reading documents aloud; describing images for people with low vision |

Visual inspection on production lines, where cameras check parts for defects, is a related application with its own requirements for lighting, training data and testing; it is covered in more depth in material on machine learning in manufacturing.

## Measuring accuracy

Accuracy must be measured on the business's own documents, images and audio, because performance varies widely with quality and type.

- **Field accuracy** for document extraction: the share of fields extracted correctly, reported separately for critical fields such as amounts, quantities, dates and account numbers.
- **Straight-through rate**: the share of documents processed without human correction.
- **Character and word error rates** for OCR and speech recognition: the number of substitutions, deletions and insertions divided by the number of characters or words in a correct reference. A 1,000-word transcript with 50 errors has a word error rate of 5%.
- **Classification accuracy** and **precision and recall** for image tasks, such as identifying damage.
- **Error severity**: a wrong quantity or dollar amount matters far more than a misspelt street name, and "fifteen" heard as "fifty" in a voice note is a critical error even if the overall error rate is low.

Build a test set covering good and poor examples: clean scans and phone photos, handwriting, faded thermal paper, noisy job sites, accents and technical vocabulary. The [is the AI good enough to rely on](/insights/is-the-ai-good-enough-to-rely-on/) article covers setting acceptance rules before testing.

## Designing the workflow

Multimodal AI works best inside a workflow that checks its outputs:

- **Validate against business data**: match extracted supplier numbers, order numbers, quantities and prices to existing records; check that totals add up; confirm dates are plausible.
- **Use confidence scores**: route low-confidence fields or documents to people, and let high-confidence, validated documents pass straight through.
- **Show the evidence**: when a person reviews an extracted value, show it next to the highlighted region of the original image.
- **Ask for confirmation of critical values**: in voice-entered reports, read back quantities and safety-critical information for confirmation.
- **Keep originals**: store source images and audio alongside extracted data, so values can be checked later.
- **Learn from corrections**: feed corrected examples into testing and, where the product allows, into improving the system.

## Image understanding: strengths and cautions

Vision-capable language models can describe scenes, read visible text and answer questions about images remarkably well. They also have characteristic weaknesses:

- They may **describe things that are not there**, or be overconfident about ambiguous details.
- **Measurements and counts** from photos are unreliable without reference objects or specialised tools.
- **Subtle defects** such as fine cracks may be missed, especially in poor lighting or at low resolution.
- **Context matters**: a photo of a weld cannot show whether it meets a standard without information about the required weld.

Use image understanding to organise, triage and describe, and to suggest likely issues for a person to confirm, rather than as the final judgement on safety, quality or claims.

## Speech: transcription and voice workflows

Speech recognition now handles most clear speech well, but accuracy drops with background noise, overlapping speakers, strong accents, poor microphones and technical vocabulary such as part numbers and product names. Practical steps include good microphones or headsets, custom vocabularies where the product supports them, and structured voice prompts for field data, such as asking for one reading at a time.

Meeting transcription and summarisation save time, but summaries can omit or distort decisions. Have the meeting owner check summaries and action lists before circulating them.

Voice interfaces, combining speech recognition, a language model and text-to-speech, can support hands-free work and phone services, but need careful design for errors, confirmations and hand-over to a person.

## Searching images and drawings

Multimodal embeddings allow searches such as "find photos similar to this damaged bearing" or "find drawings showing this type of connection". Combined with text extracted from drawings and documents, they can make large archives of photos and drawings searchable. As with any retrieval system, metadata such as project, date, asset and revision, and access controls matter as much as the AI.

## Drawings and technical documents

Engineering drawings, schematics and data sheets are harder than invoices. Information sits in title blocks, tables, callouts, symbols and dimensions spread across the sheet, and meaning depends on conventions such as projection, revision clouds and notes. Current tools extract title block data, parts lists and text annotations well, and can help search drawing sets, but reading dimensions and interpreting geometry from images is far less reliable. For critical information, extract from native CAD or structured sources where possible, and treat AI-extracted drawing data as a search and indexing aid that people confirm before use in design or manufacture.

## Choosing tools

Options range from specialised services to general models:

- **Specialised document extraction services** are trained for common document types such as invoices and receipts, often give field-level confidence scores and are economical at volume.
- **General vision-capable language models** handle unusual layouts and questions flexibly but may be slower, more expensive and less consistent.
- **Speech services** vary in accuracy for Australian accents, noisy environments and technical vocabulary, so test with real recordings.
- **Features built into existing software**, such as accounting or field service applications, may be the quickest route if they meet the accuracy needed.

Many workflows combine a specialised tool for routine documents with a general model for exceptions.

## Bringing staff with the change

People who have done data entry or note taking for years know the documents and their quirks better than anyone. Involve them in testing, ask them to identify the hardest cases and give them the reviewer role for uncertain items. Explain how their time will be used once routine typing is reduced. Systems designed with the people who know the work are more accurate and more readily accepted.

## Privacy and recording

Images and audio often contain personal information: faces, voices, vehicle registrations, names on documents and conversations. Australian privacy obligations apply to personal information collected this way, and laws on recording conversations and workplace surveillance differ between states and territories. Tell people when calls or meetings are recorded and transcribed, obtain consent where required, limit retention, control access and check where external services process and store data. The [data readiness is a business habit](/insights/data-readiness-is-a-business-habit/) article covers controlling access and origin as part of everyday data practice.

## Costs

Multimodal processing is usually priced per page, per image or per minute of audio, or by tokens for vision-capable language models, where a single image can count as hundreds or thousands of tokens. Costs fall with resizing images to the resolution actually needed, processing only relevant pages, and routing simple documents to cheaper specialised tools while reserving general models for difficult cases.

## Keeping it working

Accuracy can drift after launch. Suppliers change their invoice layouts, new document types appear, phones and cameras change, sites get noisier and providers update their models. Track straight-through rates, correction rates and error types by source each month, investigate sudden changes, and rerun the test set after any change to the service or workflow. Add new difficult examples to the test set as they appear, so it keeps reflecting real work.

## A worked example

This is an illustrative example. A civil contractor receives about 3,000 supplier delivery dockets a month for concrete, quarry materials and hire equipment, many as phone photos taken on site. Office staff type quantities, docket numbers, dates and supplier details into the accounting system, taking about two minutes per docket, or about 100 hours a month, with occasional keying errors that cause payment disputes.

**Pilot.** The contractor tests a document extraction service on 300 past dockets, including faded, crumpled and handwritten ones. Field accuracy is high for supplier and date, but quantities on poor photos are sometimes misread.

**Workflow.**

- Site staff photograph dockets in an app that checks image sharpness before accepting the photo.
- The system extracts fields and matches each docket to an open purchase order and delivery schedule.
- Dockets with high confidence that match the order within tolerance pass straight through; others go to a reviewer, who sees each extracted value beside the highlighted part of the image.
- Monthly sampling checks a set of straight-through dockets against the originals.

**Result.** About 80% of dockets pass straight through. Reviewing the remaining 600 takes about a minute each, around 10 hours a month, plus a few hours of sampling and exception handling, saving about 85 hours a month. Disputes from keying errors fall, and the photo record helps resolve the remaining ones quickly.

## Applying this in an Australian business

- **Start with high-volume, repetitive** document, image or audio tasks.
- **Test on your own material**, including poor-quality examples.
- **Measure field accuracy, error rates and straight-through rates.**
- **Validate against business data** and route low-confidence items to people.
- **Show evidence** beside extracted values for reviewers.
- **Use image understanding to triage**, not to make final safety or quality calls.
- **Manage privacy and recording obligations.**
- **Control costs** by resizing, selecting and routing.

## Where multimodal projects go wrong

- **Testing only on clean samples.**
- **Trusting extracted numbers** without validation.
- **Treating photo descriptions as inspection results.**
- **Noisy audio** and no confirmation of critical values.
- **Recording people** without notice or consent.
- **Discarding originals** after extraction.
- **No sampling** of straight-through items.

## Questions to ask about a multimodal AI use

- Which documents, images or audio would it process, and how variable are they?
- Which fields or judgements are critical, and how are they checked?
- What is the measured accuracy on our own difficult examples?
- What happens to low-confidence items?
- What personal information is captured, and who is told?
- How will we know if accuracy declines?

## Bringing it together

Multimodal AI can read documents, understand images and transcribe speech well enough to remove a large share of manual data entry, note taking and searching. Its value depends on choosing suitable high-volume tasks, measuring accuracy on real and difficult material, validating outputs against business data, routing uncertain items to people with the evidence in front of them, and managing privacy. Used this way, it frees people for the judgement work that machines cannot do, while keeping the records the business relies on accurate.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® AI academy lessons on multimodal systems, OCR and document extraction, image understanding, visual question answering, speech recognition, text-to-speech, audio workflows, multimodal embeddings and retrieval, engineering and manufacturing use cases and computer vision deployment, together with established AI practice. The worked example is illustrative. This article is general information.*
