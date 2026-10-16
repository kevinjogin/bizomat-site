# Code and workflow review — 2026-10-16

Reviewed `main` at `9c81a9fd880bf530e7704e881bd4a7bb2f7502c5`. This change fixes reproduced
failures and implements five previously unavailable commands: Swept Boss/Base, Swept Cut,
Lofted Boss/Base, Lofted Cut and a dimensioned Hole Wizard.

This is a code and workflow review. Cloud Browser could not open the local application
(`ERR_BLOCKED_BY_CLIENT` for both local preview addresses); no screenshot-based visual verdict,
responsive-layout claim or end-to-end browser pass is asserted here.

## Findings fixed

Priorities: P1 = incorrect output, unsafe rendering or unintended model changes; P2 = broken
workflow or state. Links identify the original implementation at the reviewed commit.

| Priority | Finding and reproduction | Change |
|---|---|---|
| P1 | [Exports silently omit failed features](https://github.com/yuanzhengyang98/opensketch/blob/9c81a9fd880bf530e7704e881bd4a7bb2f7502c5/opensketch/geometry.py#L625). A 10 mm cube followed by a failing radius-99 fillet still exports a valid STEP containing only the cube. Assembly and macro STEP fallback have the same risk. | Reject active rebuild errors before exporting. The response identifies the failed feature. Intentional suppression and rollback still work. |
| P1 | [Imported names become HTML](https://github.com/yuanzhengyang98/opensketch/blob/9c81a9fd880bf530e7704e881bd4a7bb2f7502c5/opensketch/static/js/ui/tree.js#L45). A feature/document name containing an image with an event handler is inserted into the DOM. [Bought-part links](https://github.com/yuanzhengyang98/opensketch/blob/9c81a9fd880bf530e7704e881bd4a7bb2f7502c5/opensketch/static/js/ui/taskpane.js#L153) also accept script schemes and unescaped attribute quotes. | Render names as text or escape them at HTML boundaries; restrict supplier links to HTTP(S). Cover tree, PropertyManager, dimension captions, context headings, errors, breadcrumbs and dialogs. |
| P1 | [Feature confirmation commits after preview failure or cancellation](https://github.com/yuanzhengyang98/opensketch/blob/9c81a9fd880bf530e7704e881bd4a7bb2f7502c5/opensketch/static/js/app.js#L791). A rejected request returns without setting `lastError`, so OK saves anyway. Two OK clicks can append duplicates; closing the command or changing parameters during the request can commit stale work. | Require a successful current preview. Guard repeated confirmation, cancellation, command identity and parameter revision. Preserve the editor on failure. |
| P2 | [AI limit/hinge arguments are discarded](https://github.com/yuanzhengyang98/opensketch/blob/9c81a9fd880bf530e7704e881bd4a7bb2f7502c5/opensketch/ai.py#L635). `add_mate` accepts supported mate types but copies only value/alignment/flip. Requested limits and hinge support planes disappear, changing allowed motion. | Extend tool schema and stored fields; validate finite ordered bounds before mutation. Component deletion checks hinge support and angular references in both UI and AI. |
| P2 | [Discard does not restore sketch history](https://github.com/yuanzhengyang98/opensketch/blob/9c81a9fd880bf530e7704e881bd4a7bb2f7502c5/opensketch/static/js/app.js#L905). Editing several entities, discarding, then undoing can resurrect discarded geometry. | Snapshot and restore undo/redo with the document. Cancelling a newly created or empty sketch also restores its previous rollback position. |
| P2 | [Delete only handles direct children](https://github.com/yuanzhengyang98/opensketch/blob/9c81a9fd880bf530e7704e881bd4a7bb2f7502c5/opensketch/static/js/app.js#L648). Sketch → extrusion → pattern leaves the pattern after deleting the sketch with children selected. Removing several items before rollback only moves the bar by one. | Traverse explicit feature dependencies transitively and count every removed feature before rollback. Include sweep paths and loft sections. |
| P2 | [Assembly measurement uses part-local coordinates](https://github.com/yuanzhengyang98/opensketch/blob/9c81a9fd880bf530e7704e881bd4a7bb2f7502c5/opensketch/static/js/app.js#L1122). Identical faces on translated components can report zero separation; rotated normals yield the wrong angle. | Transform measurement centers/midpoints and normals through the solved component matrix. Keep mate-reference data in part coordinates. |
| P2 | [Damaged uploads and invalid Toolbox selections report incorrectly](https://github.com/yuanzhengyang98/opensketch/blob/9c81a9fd880bf530e7704e881bd4a7bb2f7502c5/opensketch/server.py#L81). Truncated gzip and invalid base64 produce HTTP 500; an invalid stock size returns HTTP 200 with a document that cannot build. | Return readable HTTP 400 errors, validate positive finite screw lengths, and inspect rebuild status/body before returning a Toolbox part. |

Also fixed: AI-authored extrusion draft disappeared on manual confirmation when `draftOn` was
absent; first-body Up To Next silently behaved as Blind; mouse-wheel dimension edits ignored
bounds; regular export temporary files were retained after download/failure. Expired completed
macro ZIPs are now removed when old jobs are evicted. Running macro jobs are retained.

## Added functions and how to use them

All new features use the shared [.osk document contract](DOCUMENT.md), participate in rebuilds,
previews, edit, suppression, rollback, undo, deletion and feature patterns, and are described in
the AI's feature instructions. Their parts export to STEP/STL. SOLIDWORKS macro export falls back
to STEP for these features; it does not claim a native SOLIDWORKS sweep/loft/Hole Wizard history.

| Command | Workflow | Current limits |
|---|---|---|
| Swept Boss/Base / Swept Cut | Draw a closed profile and a separate path sketch. Start the command, select the profile and then the path in the tree, inspect the preview and confirm. | One profile region and one connected non-construction sketch path; no guide curves, twist controls or 3D sketch editor. |
| Lofted Boss/Base / Lofted Cut | Create sketches on separate planes, start the command and select sections in order. Remove and reselect to reorder. Optionally choose ruled surfaces. | At least two distinct sections, one closed contour each; no inner contours or guide curves. |
| Hole Wizard | Start on an existing solid, choose a plane or planar face, then set type, diameter, Blind/Through All, X/Y and direction. Face picks initially point the cut inward. Pattern or mirror the feature for repeated holes. | Simple, counterbore and countersink shapes with explicit dimensions and flat bottoms. One position per feature; no threads, drill points, standards database or multiple-position sketch. |

Invalid dimensions, missing profiles, disconnected paths, unsupported loft contours and holes
that miss the body produce preview/rebuild errors instead of silently completing the command.

## UX changes included

- PropertyManager OK/Cancel are native labelled buttons with keyboard focus styling. Missing
  required selections disable OK; the application also guards confirmation through other routes.
- Names containing angle brackets now remain readable. Errors are displayed as text.
- Numeric fields have accessible names, accept uppercase inch units, and respect bounds on wheel
  changes. New feature forms explain their required selections and current limits.
- Unsupported commands have an explicit availability note in tooltips and search results. They
  cannot replace the last working command used by Repeat.

## Recommended next UX work

These are recommendations from code/workflow inspection, not findings from observed screenshots.

| Priority | Improvement | Concrete acceptance check |
|---|---|---|
| High | Add a persistent rebuild summary with a link to the first failed feature and recovery choices: edit, suppress, rollback. Export failures now identify the error, but locating and fixing it still takes several steps. | A failed fillet can be reached and repaired directly from the summary; export becomes available after a successful rebuild. |
| High | Show explicit preview states: computing, valid, failed, and disconnected. Keep the current input and allow retry. | Under a deliberately slow or failed connection, users can tell why OK has not completed, cancel reliably, and retry without re-entering selections. |
| High | Add a first-part guide and small editable examples for sweep, loft and holes. Show the next required selection beside the viewport. | A new user can build a block with a counterbore and understand profile/path selection without consulting source code. |
| Medium | Add click-to-position hole placement, a visible coordinate origin and a multi-position sketch. Add a reorder control for loft sections. | Hole position is visible before confirmation; three loft sections can be reordered without removing them. |
| Medium | Complete keyboard semantics across ribbon, tree, context menus and Modify dialogs; manage and restore modal focus. Current changes cover the main confirmation buttons, not full accessibility. | Create/edit/cancel a feature and recover focus using only the keyboard; verify labels with a screen reader. |
| Medium | Make remaining placeholders explain an available alternative. For example, standalone Draft can point to extrusion draft. Keep a concise capability list next to examples. | Search tells users what exists before they enter a workflow, with no unexplained dead ends. |

## Validation and remaining limits

Environment: Python 3.12.14, build123d 0.13, Node 24.19.0.

- Baseline: 50 Python tests passed, two macro-toolchain cases skipped; seven Node solver tests passed.
- After changes: **79 Python tests passed, two skipped**; **22 Node tests passed**.
- New geometry checks compare analytical volumes for sweep/loft bosses and cuts, blind/through
  holes, counterbores, countersinks, reverse direction, edits and hole patterns. They also check
  solid validity, previews, STEP output and rejection of unsupported native macro translation.
- Regression checks exercise damaged uploads, Toolbox errors, export rejection/cleanup, AI mate
  bounds, hinge deletion, unsafe DOM inputs, preview races, history and measurement transforms.
- Existing fake-client AI streaming, demos and the 16-scenario Python/JS mate-solver parity test pass.
- DOM tests use linkedom. They do not validate WebGL, layout, visual polish or browser interaction.
  A real browser walkthrough remains required before release. Cloud Browser could not access the
  local server in this review; no network/access restrictions were changed to work around it.
- No live Anthropic request or real SOLIDWORKS execution was performed. The two skipped Python
  tests require the optional macro toolchain.

Suggested browser release check: create/edit/undo each new feature; cancel a slow preview; discard
new and existing sketches; measure two moved/rotated components; open a damaged file; try exporting
a failed feature; complete both recorded AI demos and save/reopen the resulting document.

Remaining features include guide curves, advanced hole options, standalone draft, rib, boundary,
wrap/intersect, spline/ellipse/text tools, configurations and drawings. This change does not claim
to implement every SOLIDWORKS command. Geometric references still use nearest-face/edge matching;
stable topological naming remains a separate correctness project. Mass/interference calculations
still use available rebuilt geometry and do not yet present a dedicated incomplete-model warning.
