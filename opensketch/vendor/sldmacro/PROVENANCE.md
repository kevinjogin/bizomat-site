# sldmacro engine (vendored)

OpenSketch's SOLIDWORKS macro export (`opensketch/sldexport.py`) drives this engine to rebuild parts as
native SOLIDWORKS features. It is a copy, kept unchanged, so that results match the engine's own checks.

- Source: the `cad-toolkit` plugin, skill `sldmacro`, itself copied from
  `yuanzhengyang98/cad-review-loop` `skills/sldmacro` @ e6ea59adb688b1757d28bebcbdb83508aa294427.
- Copied: 2026-10-16. `SKILL.md` is kept here as `METHOD.md`.
- Do not edit files in this folder. OpenSketch adds its own VBA module (STEP-imported parts, saving, the
  assembly and its mates) to the macro the engine writes; that code lives in `opensketch/sldexport_vba.py`.
- Toolchain: `bash opensketch/vendor/sldmacro/scripts/setup_env.sh` (build123d 0.13 in its own venv, a
  sketch solver, LibreOffice with python3-uno, Java). Without it the export still works, but every part is
  sent as a STEP import and the macro's checks that need the toolchain are reported as not run.
- No macro from this engine has been confirmed in SOLIDWORKS yet.
