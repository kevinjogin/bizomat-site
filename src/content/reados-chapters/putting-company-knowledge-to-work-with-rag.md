---
title: "Putting company knowledge to work with retrieval-augmented generation: how it works and how to build it well"
description: "An AI assistant that answers from your own documents can save hours or confidently quote the wrong version. How retrieval-augmented generation works, where it fails and how to build it."
publishDate: 2026-10-09
category: "Technology"
tags:
  - ai
  - systems
  - operations
author: "KEVOS®"
featured: false
draft: false
---

Most businesses hold far more knowledge than their people can find quickly: procedures, specifications, contracts, product manuals, past project files, policies, standards summaries and years of emails and reports. Staff spend time searching, asking colleagues and sometimes working from outdated copies. Language models can write fluent answers, but on their own they know nothing about a particular business and may invent plausible details.

**Retrieval-augmented generation**, usually shortened to RAG, combines the two. When someone asks a question, the system first retrieves the most relevant passages from the business's own documents, then gives them to a language model with instructions to answer from those passages and cite them. Done well, RAG produces grounded answers with sources people can check. Done poorly, it confidently quotes superseded procedures, misses the one document that mattered, misreads tables or reveals information to people who should not see it.

This article explains why RAG exists, how its two halves, ingestion and retrieval, work, the design choices that decide its quality, how to protect access and authority, and how to evaluate and improve it. It is general information for managers, engineers and IT teams considering knowledge assistants. Specific products and platforms vary; the principles apply across them.

## Why retrieval rather than retraining

There are three broad ways to get a language model to use business knowledge:

- **Put the information in the prompt** directly. This works for small amounts of text but not for thousands of documents.
- **Fine-tune the model** on business material. Fine-tuning adjusts behaviour and style well but is a poor way to teach facts: it is costly to update, does not cite sources and can still produce errors.
- **Retrieve relevant passages at question time** and supply them to the model. This keeps knowledge in documents that can be updated, controlled and cited.

For most question-answering over company documents, retrieval is the right starting point. It keeps the knowledge base as the source of truth and makes answers traceable.

## How a RAG system works

A RAG system has two halves.

**Ingestion**, which happens in advance and whenever documents change:

1. **Collect** documents from approved sources, such as document management systems, shared drives and knowledge bases.
2. **Parse** them into clean text, preserving structure such as headings, lists and tables, and reading scanned documents with optical character recognition.
3. **Chunk** them into passages of manageable size.
4. **Enrich** each chunk with **metadata**: source, title, section, date, version, owner, status and access level.
5. **Embed** each chunk, turning it into a list of numbers that represents its meaning.
6. **Index** the chunks for searching, in a vector database for meaning and a text index for exact words.

**Retrieval and generation**, which happens for each question:

1. **Interpret the question**, sometimes rewriting it into clearer search queries.
2. **Search** for relevant chunks using meaning, exact terms or both.
3. **Filter** by metadata and the user's permissions.
4. **Rerank** the candidates to put the most relevant first.
5. **Assemble the context**, sometimes expanding a chunk to include its surrounding section.
6. **Generate** an answer with instructions to use only the supplied passages and cite them.
7. **Log** the question, retrieved sources and answer for monitoring.

```figure
type: steps
title: Answering a question with retrieval
caption: Documents are collected, parsed, chunked, enriched, embedded and indexed before any question is asked.
- Interpret the question
- Search by meaning and exact terms
- Filter by metadata and permissions
- Rerank the candidates
- Assemble the context
- Generate with citations
- *Log for monitoring
```

## Design choices that decide quality

### Parsing and structure

Many failures start with poor parsing. Tables flattened into jumbled text, headers and footers repeated in every chunk, scanned pages with recognition errors, and headings lost so chunks lose their context. Invest in parsing the document types that matter most, especially tables in specifications, procedures and price lists.

### Chunking

Chunks that are too large dilute relevance and waste context; chunks that are too small lose meaning. **Structure-aware chunking**, splitting at headings and sections, usually works better than fixed-size splitting. A small **overlap** between chunks helps preserve meaning across boundaries but adds duplication. **Parent-child** designs search small chunks for precision, then supply the larger section they belong to for context.

### Metadata

Metadata makes retrieval controllable. At minimum, record the source document, section, date, version, status such as current or superseded, owner, document type and access level. Metadata lets the system prefer current approved versions, filter by product or site, and show useful citations.

### Search methods

- **Lexical search** matches exact words and is excellent for part numbers, codes, names and specific terms.
- **Semantic search** uses embeddings to find passages with similar meaning, even when words differ, such as "lockout" and "isolation".
- **Hybrid search** combines both and usually outperforms either alone on business documents, which mix technical identifiers with natural language.
- **Reranking** uses a more precise model to reorder the top candidates, improving the passages the language model actually sees.
- **Query rewriting** turns vague or conversational questions into better searches, for example expanding abbreviations or splitting compound questions.

### Embedding models and vector databases

**Embedding models** differ in quality, language coverage and cost. Choose one suited to the business's language and domain and keep it consistent; changing it means re-embedding the corpus. **Vector databases** store embeddings and find similar ones quickly. Many search platforms and databases now combine vector and text search, which suits hybrid retrieval.

## Access control and authority

A RAG system must never become a way around document permissions. Apply **access control at retrieval**, filtering chunks by the user's permissions before anything reaches the model, not by asking the model to withhold information afterwards. Keep permissions synchronised with source systems, so removed access takes effect promptly.

**Authority** matters as much as relevance. A superseded procedure can be highly relevant and still wrong. Prefer current, approved documents through metadata, exclude drafts and obsolete versions from general use, and show document status and dates in citations so users can judge them.

**Citations and provenance** let users check answers. Each answer should identify the documents and sections it relied on, ideally with links, and the system should say when the retrieved material does not answer the question rather than filling the gap.

## Designing the answers

How answers are presented affects whether people use them safely. Useful conventions include:

- **A short direct answer first**, followed by supporting detail.
- **Sources shown with every answer**, including document title, section, version and date.
- **Clear statements of uncertainty**, such as when sources conflict or only partly answer the question.
- **Scope limits**: for safety-critical, legal or contractual questions, the assistant points to the controlled document and the responsible person rather than paraphrasing alone.
- **A route to a person**, so users can escalate when the answer does not help.
- **Feedback buttons**, so users can flag wrong or unhelpful answers for review.

These conventions make the assistant a guide to the right documents and people, rather than a replacement for controlled procedures.

## The knowledge base is the product

The quality of a RAG system is limited by the documents behind it. Duplicated, outdated, contradictory and ownerless documents produce poor answers no matter how good the technology. Treat the knowledge base as a managed asset: give content owners, set review dates, retire obsolete material and fix contradictions at the source. The [data readiness is a business habit](/reados/collections/ai-in-business-practice/data-readiness-is-a-business-habit/) article explains how to build these habits.

## Evaluating and improving a RAG system

Evaluate retrieval and generation separately, because they fail differently:

- **Retrieval quality**: for a set of test questions with known correct sources, how often do the right passages appear in the top results?
- **Faithfulness**: does the answer stay within what the sources say?
- **Citation accuracy**: do the cited passages actually support the statements?
- **Answer usefulness**: does the answer help the person do their job?

Build a **test set** of real questions, including difficult ones, each with the expected source documents and key facts, and rerun it whenever documents, settings, models or prompts change. The [is the AI good enough to rely on](/reados/collections/ai-in-business-practice/is-the-ai-good-enough-to-rely-on/) article covers setting acceptance criteria before deployment.

Classify failures to find their cause:

| Failure | Likely cause | Typical fix |
|---|---|---|
| The answer is not in the documents | Content gap | Add or update content; have the system say it does not know |
| The right document exists but was not retrieved | Search, chunking or metadata | Hybrid search, better chunking, query rewriting |
| The right passage was retrieved but ignored or misread | Context assembly or prompt | Reranking, fewer but better passages, clearer instructions |
| An outdated version was used | Authority metadata | Status filtering and document retirement |
| A table was misread | Parsing | Table-aware parsing |
| Information appeared for the wrong user | Access control | Permission filtering at retrieval |

Monitor in operation too: track questions with no good answer, low user ratings and frequently cited documents, and review samples regularly.

## Privacy, security and records

Knowledge assistants often touch sensitive material: personnel records, customer details, commercial terms, health and safety incidents and client documents covered by confidentiality agreements. Before indexing, decide which sources are in scope, remove or exclude personal and confidential information that the assistant does not need, and confirm that the hosting arrangement and any external model service meet the business's privacy, security and contractual obligations. Questions and answers are themselves records that may contain sensitive information, so set retention periods for logs and restrict who can review them.

## Costs and operations

RAG systems have ongoing costs beyond the initial build:

- **Ingestion and re-indexing** whenever documents change, including embedding costs.
- **Search infrastructure**, such as vector and text indexes.
- **Model usage** for each answer, which rises with the amount of retrieved text supplied.
- **Evaluation and monitoring**, including rerunning the test set after changes.
- **Content management**, the work of keeping documents current and owned.

Supplying fewer, better passages after reranking usually improves both quality and cost. Caching answers to frequent questions and using smaller models for simple tasks can also help.

## Starting small

A sensible pilot focuses on one user group and one well-defined body of documents, such as maintenance procedures for a site or the quality manual and work instructions for a product line. Agree the questions the assistant should answer and build the test set before building the system. Run the pilot with a small group who check answers and report problems, measure time saved and errors found, and fix content as well as technology. Expand to other groups and document sets only when the pilot meets its acceptance criteria.

## A worked example

This is an illustrative example. An engineering services business builds an internal assistant over about 12,000 documents, including procedures, technical notes, standard details and lessons from past projects. The first version splits documents into fixed-size chunks without metadata and uses semantic search only.

**Problems.** Testers find that the assistant sometimes quotes a superseded welding procedure, misses questions about specific part numbers, garbles values from tables and occasionally summarises a document from a restricted client folder.

**Changes.**

- Documents are re-parsed with structure-aware chunking and table handling.
- Metadata records status, version, owner, client and access level; superseded and draft documents are excluded from general answers.
- Hybrid search combines exact-term and semantic retrieval, followed by reranking.
- Permissions are applied at retrieval from the document system's access lists.
- Answers must cite documents and sections and state when the sources do not answer the question.
- A test set of 150 questions with expected sources is created with engineers and rerun after every change.

**Result.** On the test set, the share of questions where the correct source appears in the top results rises from about 62% to about 91%, superseded documents no longer appear in answers, and access leaks stop. Engineers report finding procedures and past lessons much faster. Content owners begin retiring obsolete documents because the assistant makes their presence visible.

```figure
type: bars
title: Questions where the right source is in the top results
unit: %
max: 100
caption: About 12,000 documents; superseded documents and access leaks also disappeared from answers.
- First version: fixed chunks, no metadata | 62
- *After redesign | 91
```

## Applying this in an Australian business

- **Start with a defined user group** and a body of documents that matters to them.
- **Clean up and own the content**, retiring obsolete material.
- **Parse structure and tables carefully.**
- **Chunk by structure** and add rich metadata.
- **Use hybrid search and reranking** for business documents.
- **Enforce permissions at retrieval.**
- **Require citations** and allow "I don't know".
- **Evaluate with a test set** and monitor in use.

## Where RAG projects go wrong

- **Indexing everything** without cleaning or ownership.
- **Losing tables and structure** in parsing.
- **Semantic search only**, missing codes and part numbers.
- **No status or version metadata**, so old documents win.
- **Relying on the model** to enforce permissions.
- **No test set**, so changes are judged by impressions.
- **Answers without citations.**

## Questions to ask about a knowledge assistant

- Which documents are included, and who owns them?
- How are superseded and draft documents handled?
- How are permissions enforced?
- How does the system search for exact terms as well as meaning?
- Can users see and check the sources behind each answer?
- How was it tested, and how is it monitored?

## Bringing it together

Retrieval-augmented generation lets language models answer from a business's own knowledge with sources people can check. Its quality depends on careful ingestion, including parsing, chunking and metadata, on retrieval that combines exact and semantic search with reranking, on access control applied before anything reaches the model, and on preferring current, authoritative documents. Above all, it depends on a well-managed knowledge base. Evaluate retrieval and answers separately with a realistic test set and keep monitoring in use. The result is an assistant that saves time and earns trust because its answers can be traced to the right documents.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® AI academy lessons on retrieval-augmented generation, including ingestion, parsing, chunking, metadata, embeddings, lexical, semantic and hybrid search, reranking, access control, citations and evaluation, together with established AI practice. The worked example is illustrative. This article is general information.*
