# The engine: why it works the way it does

For whoever reads a SOLIDWORKS log, or changes `engine/`. The agent does not change the engine; it reports faults.

## How the macro makes sure of itself

- The API help does not settle which way some flags act (`Dir`, `Ddir1`, `FlipStartOffset` of a boss / cut; a
  draft's `FlipDir`). So each feature is made, measured, and if it is not the one wanted, deleted and made again
  with one flag after another reversed. What worked is remembered for the next feature and the next part.
- Measured: change in volume AND change in volume x Z of the centre of mass. Volume alone cannot tell a feature
  in the wrong place. The generator works out every wrong reading in OpenCascade beforehand and refuses to emit
  if one would pass.
- Faces and edges (for drafts, chamfers, radii, and edges a sketch refers to) are found by a point on them
  (`GetClosestPointOn`), never by name.
- Sketches are drawn exact with `AddToDB` on, then relations (`SketchAddConstraints`) and dimensions are added with
  the value box and over-defining prompts switched off (and put back). If the sketch is not fully defined: Fully
  Define Sketch from the origin. If a relation moved anything: redraw with Fully Define Sketch only, then plain.
- Tolerances grow with the part; the first body calibrates how closely SOLIDWORKS and the design agree.
- Anything that cannot be made is named in the log with what to add by hand. A run-time error is caught and logged
  with what the macro was doing.

## More API facts (SOLIDWORKS 2022 help)

- `AddDimension2` on two lines that are not parallel gives an angle; which of the two angles depends on where the
  text goes. The macro accepts either when reading it back.
- `InsertMultiFaceDraft`: neutral plane selected with mark 1, faces with mark 2.
- help.solidworks.com API pages: fetch with curl and a browser User-Agent; the text sits in an escaped string.
- An error in an `If` condition under `On Error Resume Next` runs the `Then` branch. The read-back of sketch points
  goes through `PtXY` for that reason.

## When changing engine.bas or the stand-in

- LibreOffice Basic is not VBA: `Option VBASupport 1` in class modules; raise with `Err.Raise`; a function that
  exits without setting its result returns the previous call's; `And` does not short-circuit; `Shared` is a
  keyword (a parameter named `shared` stops the module compiling, silently); a module that does not compile makes
  calls return nothing, silently; keep procedures under 400 lines.
- VBA names are not case-sensitive: a parameter `door` hides a constant `DOOR` (this once made a switch do
  nothing, and the stand-in passed because it expected every part). `sldmacro names` scans for it: run it after
  every change.
- The stand-in only tests what it is told to expect. When the macro gains a switch, give the stand-in a run for
  each setting and make it check what must NOT happen as well. Read new engine code yourself too: that bug was
  found by reading, not by a test.
- An expectation of the stand-in must hold for any part, not only for the parts it was written against: the first
  agent session found one that assumed every sketch has a relation.
- Then: the 19-part regression and the worked example (the repository's CLAUDE.md says how), and only then push.
