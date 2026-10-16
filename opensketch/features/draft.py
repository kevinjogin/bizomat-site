"""Draft (Neutral Plane), as in SOLIDWORKS: tapers faces by an angle about the line where they meet a
neutral plane. The pull direction is the neutral plane's normal (Reverse Direction flips it); a positive
angle narrows the part along the pull direction so it releases from the mould."""

from . import FeatureType, Param, register


def build(feat: dict, st, diagnostics: dict):
    from build123d import Plane

    from ..geometry import FeatureError, find_faces, resolve_plane, solid_of

    if st.part is None:
        raise FeatureError("No body to draft")
    faces, missing = find_faces(st.part, feat.get("faces") or [])
    if not faces:
        raise FeatureError("Select faces to draft")
    pl = resolve_plane(feat.get("neutral_plane"), st, diagnostics)
    if feat.get("reverse"):
        pl = Plane(origin=pl.origin, x_dir=pl.x_dir, z_dir=-pl.z_dir)
    angle = float(feat.get("angle", 1))
    solids = st.part.solids()
    out = []
    for s in solids:
        own = [f for f in faces if any(f.is_same(g) for g in s.faces())]
        if not own:
            out.append(s)
            continue
        for f in own:
            n = f.normal_at(f.center())
            if abs(n.dot(pl.z_dir)) > 0.999:
                raise FeatureError("A face parallel to the neutral plane cannot be drafted")
        try:
            out.append(s.draft(own, pl, angle))
        except Exception as exc:
            raise FeatureError(f"Failed to draft the faces (angle {angle} too large, or a face does not meet the neutral plane's pull direction)") from exc
    from build123d import Compound
    st.part = solid_of(out[0] if len(out) == 1 else Compound(children=out))
    return f"{missing} face reference(s) missing" if missing else None


register(FeatureType(
    "draft", "Draft", "Draft", "draft",
    "Tapers faces by an angle about a neutral plane, for parts that come out of a mould.",
    build=build, label="Draft",
    message="Select a neutral plane and the faces to draft.",
    notes=("The pull direction is the neutral plane's normal; a positive angle narrows the part along it. Pick side "
           "faces (not faces parallel to the neutral plane), usually the bottom face or the parting plane as neutral plane."),
    params=[
        Param("angle", "angle", "Draft angle", default=1, min=0.01, max=45, icon="angle_i", section="Draft Angle"),
        Param("neutral_plane", "plane", "Neutral plane: the faces keep their size where they meet it", required=True,
              label="Neutral Plane", section="Neutral Plane"),
        Param("reverse", "bool", "Reverse the pull direction", default=False, icon="reverse", label="Reverse Direction",
              section="Neutral Plane", widget="toggle"),
        Param("faces", "faces", "Faces to draft", required=True, label="Faces to Draft", section="Faces to Draft"),
    ]))
