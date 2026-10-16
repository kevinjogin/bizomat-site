---
title: "Nearest-neighbour search and meaningful similarity"
description: "Design similarity searches by choosing useful features, distance rules and filters, then assessing exactness, recall and the meaning of returned neighbours."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - design
  - validation
author: "KEVOS®"
featured: false
draft: false
---

Finding the nearest record sounds straightforward until “near” needs a definition. The nearest depot by straight-line distance may be inconvenient to reach. The most similar component by dimensions may use an unsuitable material. A search can return mathematically correct neighbours that do not meet the user's practical need.

**Nearest-neighbour search** finds records closest to a query under a chosen distance or similarity rule. It can operate on physical coordinates, measured attributes or numerical representations of more complex objects. The representation, distance rule and eligible population together define the question being answered.

Indexing can make the search faster, but it cannot decide whether that question is useful. A dependable design begins with the decision the result will support, separates mandatory requirements from similarity preferences and evaluates both retrieval performance and practical relevance.

## Define the task before selecting features

A similarity search usually supports a specific action: locating candidate parts, retrieving related documents, comparing observations or finding nearby resources. Describe that action in terms of what makes a result acceptable.

This is an illustrative example. A planner wants alternative storage containers with a similar footprint and capacity. Food-contact suitability is mandatory, while a small difference in height is negotiable. Mixing all three concerns into an unexplained numerical score can rank an unsuitable container highly.

Separate **eligibility constraints** from ranking preferences. Mandatory properties should determine which records are candidates. Similarity then ranks eligible candidates according to the agreed trade-offs.

Identify whether the user needs the single nearest result, several candidates or every result within a meaningful limit. These are different query forms and can produce different operational behaviour.

Also define what should happen when nothing is sufficiently similar. A nearest-neighbour query can return something even when every available candidate is poor. The user interface needs a way to distinguish “closest available” from “suitable”.

## Build a representation that preserves useful differences

A **feature vector** represents an object using an ordered set of numerical values. A component might be represented by length, width, mass and capacity. A more complex representation may be generated from text, images or other data.

Each feature should have an understood relationship to the task. Including a value merely because it is available can introduce noise or distort the ranking. Excluding an important property can make very different objects appear close.

Missing values require an explicit treatment. Replacing an unknown measurement with zero can create a fictitious point close to genuinely small objects. Other approaches, such as imputation or a missingness indicator, also introduce assumptions that need evaluation.

Record the source and transformation of each feature. If a dimension changes from millimetres to centimetres or a text representation is regenerated with a different model, the new vectors may not be directly comparable with old ones.

Version the representation and avoid silently mixing incompatible generations. A distance between vectors is meaningful only when their coordinates have compatible definitions and preparation.

## Make scale and weighting deliberate

Raw numerical scales can dominate distance. A feature ranging in thousands can overwhelm a feature ranging between zero and one even when the latter matters more to the decision.

This is an illustrative example. Two containers differ by 100 millimetres in length and ten litres in capacity. A raw Euclidean calculation treats the numerical difference of 100 as much larger than ten, without knowing whether a ten-litre shortfall is operationally more significant.

**Scaling** transforms feature ranges into a comparable numerical basis. **Weighting** expresses the relative importance of differences under the chosen model. They are related decisions but serve different purposes.

One practical basis is an agreed tolerance for each attribute. A difference can be expressed relative to the tolerance that matters to the task. This makes the scale easier to explain, although combining tolerances into one score still involves a trade-off.

Test the effect of outliers and changing populations. Scaling based on a historical range can behave poorly when new records fall far outside it. A statistical transformation should be fitted and applied consistently, with its reference population documented.

## Choose a distance rule that matches the representation

Euclidean distance measures straight-line separation in the chosen numerical space. Other rules can measure summed absolute differences, angular similarity or task-specific separation. Their suitability depends on what the vector coordinates mean.

For geographical data, coordinate systems and the intended notion of distance matter. Straight-line separation does not account for roads, access restrictions or travel time. A nearest location query may therefore be a candidate-generation step before a more relevant routing calculation.

For text-derived vectors, an angular comparison may be useful under the representation's design. That does not make it appropriate for every set of physical measurements. The scoring rule should follow the representation rather than a fashionable default.

Some indexing methods rely on mathematical properties of a distance rule, such as the triangle inequality. A custom score that violates those assumptions may require another search method or a carefully justified bound.

Document the score in language that users can interpret. A distance of 0.2 is not automatically a 20% mismatch, and a high similarity score is not automatically a probability that two records describe the same thing.

## Understand exact search and approximation

An **exact search** returns the nearest eligible records under the defined representation and distance rule, subject to the system's numerical and tie-handling conventions. It does not guarantee that the representation captures business relevance.

An **approximate search** trades some retrieval completeness or ranking exactness for lower search cost. It may miss a true nearest neighbour while still returning useful candidates quickly.

Keep these two kinds of quality separate. Representation quality concerns whether distance expresses the intended similarity. Retrieval quality concerns whether the search method finds the best results according to that distance.

The pgvector project documents exact search and approximate index options, including HNSW and IVFFlat, with different performance and recall trade-offs. These are implementation choices to evaluate on the actual dataset and workload. [pgvector documentation](https://github.com/pgvector/pgvector).

Do not justify approximation solely by dataset size. An exact baseline may already be fast enough for the required query rate, or it may be valuable as a reference even when the deployed system uses approximation. Measure before accepting a quality trade-off.

## Use a candidate-and-refinement approach carefully

Many searches first identify promising candidates using a cheaper representation, then evaluate those candidates more precisely. Spatial indexes, for example, can use bounding shapes before examining detailed geometry.

A **bounding representation** encloses or summarises a more complex object. It can help exclude objects that cannot satisfy a condition, but an overlapping bound does not necessarily prove that the detailed objects satisfy that condition.

This is an illustrative example. Two irregular service areas have overlapping bounding rectangles while their actual boundaries do not intersect. Treating the rectangle comparison as the final answer produces a false match.

The refinement step applies the relevant detailed test. The first stage should retain every candidate required by an exact design, or its possibility of omission should be included in an approximation assessment.

This pattern also supports business search: use inexpensive dimensions to narrow alternatives, then check detailed specifications. Be clear that the shortlist is an intermediate result. A fast candidate search does not replace the final suitability assessment.

## Apply filters without losing the required neighbours

Filtering and nearest-neighbour retrieval interact. Searching globally for a small number of neighbours and then removing ineligible records may leave too few results, even when many suitable candidates exist slightly further away.

This is an illustrative example. The ten nearest vectors include only two records from the user's authorised product range. Filtering those ten produces two results, but it does not establish that they are the ten nearest authorised records.

Possible designs filter before searching, integrate the filter into retrieval or retrieve additional candidates until a defined stopping condition is met. The available options and their costs depend on the indexing system.

Highly selective filters can change performance and recall substantially. Test common and unusual filter combinations, including small tenants, rare categories and recently added records.

Access control is a hard boundary throughout the process. Results, explanations and diagnostic output must not reveal records outside the user's permitted population. A post-processing display filter alone may be insufficient if earlier stages expose identifying details.

## Measure retrieval recall against a reference

For approximate top-k retrieval, a common check compares the returned identifiers with an exact top-k result under the same data, filters and distance rule. **Recall at k** measures the fraction of reference neighbours recovered.

This is an illustrative example. An exact top-ten result contains ten identifiers. An approximate result includes eight of them, giving recall at ten of 0.8 for that query. This says nothing by itself about whether the two omitted results were materially more useful than the substitutes.

Use many representative queries and examine the distribution of recall, not only its average. Rare categories or unusual regions of the feature space can perform much worse than common cases.

Define how ties are handled. Several records at the same boundary distance can make identifier-based overlap look poor even when the returned distances are equally valid. The reference comparison should account for the intended tie convention.

Record search parameters, index version, data snapshot and query preparation with the evaluation. Without that context, a recall result is difficult to reproduce or compare after changes.

## Evaluate practical relevance separately

An exact nearest-neighbour baseline assesses the search mechanism against its mathematical objective. It does not establish whether users receive useful alternatives.

Build a representative set of tasks with relevance judgements from people who understand the domain. Record why a candidate is acceptable, marginal or unsuitable. Those explanations often reveal missing eligibility rules or poorly scaled features.

This is an illustrative example. A search repeatedly retrieves components with similar dimensions but incompatible mounting arrangements. Improving the approximate index will not fix that pattern if the representation omits mounting information.

Evaluate the cost of different mistakes. Missing a useful optional recommendation may be tolerable, while presenting an incompatible component as interchangeable can be consequential. The required review and presentation should reflect the application.

Avoid implying automatic approval from similarity. For engineering selection, retrieved neighbours can support investigation, but suitability still depends on the complete requirements and appropriate technical assessment.

## Expect high-dimensional data to behave differently

Adding more features can make some traditional spatial pruning methods less effective. Regions overlap more, candidate sets can expand and the distinction between near and far points may become less useful under an unsuitable representation.

There is no universal dimension count at which every method fails. Data distribution, intrinsic structure, distance rule and workload all affect performance. Treat high dimensionality as a reason for measurement rather than a fixed prohibition.

Removing redundant or irrelevant features can help both interpretation and retrieval. Dimensionality reduction can also be useful, but it may discard information that matters to particular queries.

Evaluate transformations against the task, especially for rare but important cases. A method that preserves typical variation can still lose a small feature that determines whether a candidate is acceptable.

Keep the original information available for refinement and explanation where appropriate. A compact search representation should not become the only surviving description of an object that needs detailed assessment.

## Include updates and operating costs in the design

The number of returned candidates and any acceptance threshold should be evaluated separately. Asking for five neighbours controls the size of the shortlist, but it does not guarantee that five suitable alternatives exist. A distance threshold can exclude weak candidates if the threshold has been calibrated against the intended task.

This is an illustrative example. A query near a dense group of familiar components may have five close matches, while an unusual component has none within the accepted tolerance. Returning five in both cases creates a misleading appearance of equal confidence. Showing fewer candidates, or clearly indicating that no close match was found, better reflects the available evidence.

Consider diversity when the user is exploring alternatives. Five nearly identical records from one product family may provide less useful choice than a broader shortlist. If a diversification rule changes the ranking, describe the result accordingly: it is a selected set of useful candidates, not necessarily the five smallest distances. Keep the original similarity and the additional selection rule distinguishable in evaluation.

Finally, decide how much explanation a result needs. Displaying the important attribute differences can help a user reject an inappropriate match quickly. An unexplained score alone places too much interpretive burden on a number whose scale may have no familiar business meaning.

An index needs to accommodate insertions, deletions and representation changes. A static benchmark on a freshly built index does not describe all production behaviour.

Test recently added records, heavily updated groups and removal of records that must no longer appear. Measure build time, memory, storage and the effect of maintenance on query latency.

A representation change may require rebuilding vectors and their index. During transition, queries must use a compatible generation. Mixing new query vectors with an old document representation can produce uninterpretable distances even if every operation succeeds technically.

Plan capacity for rebuilding without assuming unlimited duplicate storage. Decide how a validated replacement becomes active and how the system returns to the previous version if evaluation reveals a regression.

Monitor the workload after release. Changes in source data, user queries or eligibility rules can alter both relevance and retrieval performance. Reassess when those changes undermine the assumptions behind the chosen configuration.

Nearest-neighbour search works best as an explicit model of a practical question. Useful features, meaningful distance, correct eligibility and separate evaluation of relevance and retrieval make the results understandable enough to support real decisions.

*Source basis: spatial query processing, bounding representations and high-dimensional search in Nearest Neighbor Search: A Database Perspective (2005), supplied in the collection. The business examples and evaluation procedure are original synthesis. Current pgvector capabilities were checked against its project documentation.*
