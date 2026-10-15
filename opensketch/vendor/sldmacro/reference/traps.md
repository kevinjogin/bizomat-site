# What goes wrong, and what to do

## In the replay (OpenCascade)

- Booleans between near-identical solids fail quietly, and a fillet can return a valid-looking solid that sections
  and booleans cannot use. `sldmacro check` compares by boolean, then slices, then sample points, and only trusts a
  method that accounts for the difference in volume. "compared by sample points" is coarse: it tells a real
  difference from a failed check, not 0.01 mm3.
- A wrong-way taper can crash OpenCascade: the generator computes such readings in a process of their own. A
  reading that could not be built is estimated from its twin.
- A chamfer on the mouth of a hole whose wall is a tapered extrude fails: make the lead-in a 45 deg tapered cut.
- Two radii that meet need room for both (0.8 mm for two R0.4), or one goes in a smaller feature of its own.
- Round the upright corners before the run along them (boss to wall before roof to walls).
- A radius the replay cannot make on some edge is usually one the source left sharp too: it is left out, and logged.
  Check with `sldmacro look --edges` what the source really rounds.
- A radius after which the solid cannot be sectioned should be the last feature of the part.
- Every feature must leave one body. If a boss floats until a later feature joins it, reorder.
- Slow: a plate with 40 features takes minutes per `check` and longer per `emit` (the readings are cached in
  `_cache`; a recipe change recomputes its own). Run long commands in the background and poll; never start a second
  run in the same job folder while one is going.

## In the plans

- A dimension from an unrelated edge: give the feature `refs`.
- 87 deg where 3 deg is meant: the planner measures from a level or upright line; turn the part's frame (`x=` in
  `oriented`) so that its main direction is X, or use `strip(polar=True)`.
- Degrees of freedom left on a `free` outline: split it, or use the named outline it really is.
- Numbers like 14.999999: round the recipe's values to what the designer meant; the check will tell you if that
  moved the part.

## What the planner does not do yet (say so in the notes; do not fight it)

- No polar placement: holes on a pitch circle are dimensioned across and up from the origin (11.314 and 11.314 for
  a 32 PCD at 45 deg), kept level and in line with each other. The geometry is exact; tell YZ that to edit the PCD
  he replaces those dimensions with a construction circle and an angle.
- The open end of a `tongue` is dimensioned from the nearest straight edge, even on a round part and with `refs`
  given. If that edge has nothing to do with the slot (a bore's flat), cut the slot before the feature that edge
  belongs to, and say so in the notes.

## In the stand-in (LibreOffice Basic is not VBA)

- The stand-in only tests what it is told to expect. It shows the macro is valid Basic, passes the number of
  arguments the 2022 API help gives, ends with every feature right whichever way SOLIDWORKS reads the flags, puts
  the planned relations and dimensions on every sketch, falls back as intended, and deletes what it got wrong. It
  does NOT show that SOLIDWORKS behaves the way the mocks do.
- It holds every face and edge of a part as one point. Two features may have the same sketch (a recess and its
  countersink): they are taken in order.
- A module that does not compile makes every call return nothing, silently: a run in which no part is built at all
  is a compile problem, not a geometry problem.
- Never run two stand-in runs at once (they share a port), and do not kill LibreOffice by a name that the killing
  command itself contains: kill by PID.

## In VBA

- Names are not case-sensitive: a parameter `door` hides a constant `DOOR`. `sldmacro verify` scans for this.
- A module takes 65,534 lines and a procedure 64 K of code: generated procedures are cut at 250 statements.
- 1023 characters per line. ASCII only: write titles, names and notes without accents or symbols.
- The file must keep CR LF line endings (the generator writes them; copy the file, do not rewrite it).

## Unconfirmed API calls (read in the SOLIDWORKS 2022 API help, not yet tried in SOLIDWORKS)

Copy this list into every report until a log from SOLIDWORKS confirms an item:

- `SketchAddConstraints` on sketch points and model edges (concentric and midpoint between a sketch point and an
  edge included); dimensions and angles to model edges off the sketch plane.
- `AddDimension2` on one line giving its length; on two lines that are not parallel giving their angle.
- `FullyDefineSketch` with the origin as datum.
- `InsertMultiFaceDraft` (neutral plane selected with mark 1, faces with mark 2), also on the wall of a blind hole.
- A cut with a 45 deg draft (countersinks and lead-in cones).
- `GetClosestPointOn` on faces and edges, by which drafts, chamfers and radii find what they act on.
- `CreateCenterLine` / `CreatePoint` with `AddToDB` on.
- Which way the flags of a boss or cut act (`Dir`, `Ddir1`, `FlipStartOffset`) and a draft's `FlipDir`: the macro
  tries, measures, and retries the other way, so either reading ends right.
- Radii: the replay only shows that OpenCascade can make them. SOLIDWORKS may refuse one (the macro then says which
  to add by hand) or accept one OpenCascade cannot.

What the macro does about all of this: after each feature it measures the change in volume and in volume x height
of the centre of mass, deletes a feature that came out wrong and makes it again another way, and names in its log
anything it could not make, with what to add by hand.

## API facts already looked up (SOLIDWORKS 2022 help)

- `FeatureExtrusion3` takes 23 arguments, `FeatureCut4` 27. Start condition 3 = offset from the sketch plane.
- `InsertFeatureChamfer(4, 1, width, pi/4, 0, 0, 0, 0)`; `FeatureFillet3(195, r, ...)`.
- Relation names: sgHORIZONTAL2D, sgVERTICAL2D, sgTANGENT, sgSAMELENGTH, sgCONCENTRIC, sgCOINCIDENT, sgCOLINEAR,
  sgATMIDDLE, sgHORIZONTALPOINTS2D, sgVERTPOINTS2D, sgPARALLEL, sgPERPENDICULAR, sgMERGEPOINTS, sgFIXED.
- `GetPartBox` and `IFace2.GetBox` are approximate: the engine uses `IBody2.GetExtremePoint` and `ISurface.PlaneParams`.
