"""Persistent names of faces and edges, so picks survive upstream edits (SOLIDWORKS keeps a fillet on its
edge when the part gets longer; a stored midpoint does not).

Every face of a rebuilt body is named after how it was made, feature by feature:
- a face that lies on a face of the body before the feature keeps that face's name;
- a face from the feature's own tool is named by its role: `e1:side:s1L1` (made by sketch curve s1L1),
  `e1:start` (on the sketch plane), `e1:end`, `e1:end2` (second direction);
- a pattern or mirror copy is named after its seed's face: `e2:side:s2c@lp#3` (copy 3 of pattern lp);
- faces new to a fillet, chamfer, shell or draft: `f1:blend:<edge name>`, `c1:bevel:<edge name>`,
  `sh:inner:<face name>`, `d1:drafted:<face name>`;
- anything else: `<feature>:new:<k>` (marked not exact: it can change when the model changes).
Pieces of a split face are told apart by the faces around them (`e1:end#[e2:side:s2c]`), or by `~k`.
Edges are named by the two faces they separate, sorted: `<face A>|<face B>`; a seam is `<face>|seam`.

Names are worked out on request (body_topology, measure, a ref that carries a name), from what each
feature recorded during the rebuild; a rebuild that nobody asks names of costs nothing extra.

Idea from SolidCraft (bherbruck/solidcraft): crates/doc/src/naming.rs.
"""

from __future__ import annotations

import math

TOL = 1e-4


def _type(s) -> str:
    return str(s.geom_type).split(".")[-1].lower()


def _point(f):
    from .inspection import _face_point
    return _face_point(f)


class _Info:
    """Cached geometry of one face for matching."""
    __slots__ = ("face", "type", "bb", "normal", "point")

    def __init__(self, face):
        self.face = face
        self.type = _type(face)
        b = face.bounding_box()
        self.bb = (b.min.X - TOL, b.min.Y - TOL, b.min.Z - TOL, b.max.X + TOL, b.max.Y + TOL, b.max.Z + TOL)
        self.point = None
        self.normal = None
        if self.type == "plane":
            try:
                self.normal = face.normal_at(face.center())
            except Exception:
                pass

    def contains(self, p, normal=None, ftype=None) -> bool:
        b = self.bb
        if not (b[0] <= p.X <= b[3] and b[1] <= p.Y <= b[4] and b[2] <= p.Z <= b[5]):
            return False
        if ftype and ftype != self.type:
            return False
        if self.type == "plane" and self.normal is not None:
            if normal is not None and abs(self.normal.dot(normal)) < 0.9999:
                return False
            if abs((p - self.face.center()).dot(self.normal)) > TOL * 10:
                return False
        try:
            return self.face.distance_to(p) < TOL * 10
        except Exception:
            return False


def _on(infos, p, normal, ftype):
    for i, info in enumerate(infos):
        if info.contains(p, normal, ftype):
            return i
    return None


class Step:
    __slots__ = ("feat", "before", "after", "tool", "instances", "sketch_edges", "plane")

    def __init__(self, feat, before, after, tool, instances, sketch_edges, plane):
        self.feat, self.before, self.after = feat, before, after
        self.tool, self.instances, self.sketch_edges, self.plane = tool, instances, sketch_edges, plane


class Namer:
    """Records each feature during a rebuild; names the current body on request."""

    def __init__(self):
        self.notes: list[str] = []  # names a ref asked for that were not found (become rebuild warnings)
        self.steps: list[Step] = []
        self._done = 0
        self._faces: list = []       # current body faces
        self._names: list[str] = []  # their names
        self._exact: list[bool] = []
        self._shape = None

    def record(self, feat: dict, before, st) -> None:
        if st.part is before:
            return  # sketches, planes, failed features: the body did not change
        fid = feat["id"]
        tool = st.tools.get(fid)
        sk = feat.get("sketch")
        self.steps.append(Step(feat, before, st.part, tool[0] if tool else None, st.instances.get(fid, []),
                               st.sketch_edges.get(sk, {}) if sk else {}, st.planes.get(sk) if sk else None))

    # -- naming
    def _tool_names(self, step: Step) -> list[tuple[_Info, str]]:
        """Role names of the faces of a feature's tool (extrude / revolve): side:<curve>, start, end, end2."""
        if step.tool is None:
            return []
        faces = step.tool.faces()
        infos = [_Info(f) for f in faces]
        names: list[str | None] = [None] * len(faces)
        edges = {k: e for k, e in step.sketch_edges.items()}
        mids = {k: e.position_at(0.5) for k, e in edges.items()}
        pl = step.plane
        n = pl.z_dir if pl is not None else None
        caps = []
        for i, info in enumerate(infos):
            if info.type == "plane" and n is not None and info.normal is not None and abs(info.normal.dot(n)) > 0.9999:
                caps.append(i)
                continue
            for k, m in mids.items():
                if info.contains(m):
                    names[i] = f"side:{k}"
                    break
        if pl is not None:
            reverse = -1 if step.feat.get("reverse") else 1
            for i in caps:
                s = (faces[i].center() - pl.origin).dot(n)
                if abs(s) < TOL * 10:
                    names[i] = "start"
                else:
                    names[i] = "end" if s * reverse > 0 else "end2"
        for i, info in enumerate(infos):  # revolve caps and anything else: in order, marked by position
            if names[i] is None:
                names[i] = f"face:{i}"
        return list(zip(infos, names))

    def _name_step(self, step: Step, prev_faces, prev_names) -> tuple[list, list[str], list[bool]]:
        fid = step.feat["id"]
        t = step.feat.get("type")
        prev = [_Info(f) for f in prev_faces]
        tool = self._tool_names(step)
        copies = []
        seed_names = {}
        for copy, _op, sid, label in step.instances:
            if sid not in seed_names:
                seed_step = next((s for s in self.steps if s.feat["id"] == sid), None)
                seed_names[sid] = self._tool_names(seed_step) if seed_step else []
            cinfo = [_Info(f) for f in copy.faces()]
            base = [n for _, n in seed_names[sid]]
            copies.append((cinfo, [f"{sid}:{n}@{fid}#{label}" for n in base] if len(base) == len(cinfo)
                           else [f"{sid}:face:{k}@{fid}#{label}" for k in range(len(cinfo))]))
        faces = step.after.faces()
        names, exact = [], []
        unknown = []
        for j, f in enumerate(faces):
            p = _point(f)
            ftype = _type(f)
            try:
                nrm = f.normal_at(p) if ftype == "plane" else None
            except Exception:
                nrm = None
            i = _on(prev, p, nrm, ftype)
            if i is not None:
                names.append(prev_names[i]); exact.append(True); continue
            hit = None
            for info, nm in tool:
                if info.contains(p, nrm, ftype):
                    hit = f"{fid}:{nm}"
                    break
            if hit is None:
                for cinfo, cnames in copies:
                    k = _on(cinfo, p, nrm, ftype)
                    if k is not None:
                        hit = cnames[k]
                        break
            if hit is not None:
                names.append(hit); exact.append(True); continue
            names.append(None); exact.append(True)
            unknown.append((j, f, p))
        if unknown:
            self._name_new(step, prev_faces, prev_names, unknown, names, exact)
        return faces, names, exact

    def _name_new(self, step, prev_faces, prev_names, unknown, names, exact):
        """Faces that are on neither the old body nor a tool: fillet blends, chamfer bevels, shell walls..."""
        fid = step.feat["id"]
        t = step.feat.get("type")
        if t in ("fillet", "chamfer") and step.before is not None:
            from .geometry import find_edges
            notes = list(self.notes)
            edges, _ = find_edges(step.before, step.feat.get("edges", []), namer=self)
            self.notes[:] = notes  # the rebuild already reported missing names
            enames = edge_names(step.before, prev_faces, self._names if self._shape is step.before else prev_names)
            index = {hash(e): k for k, e in enumerate(step.before.edges())}
            role = "blend" if t == "fillet" else "bevel"
            for j, f, p in unknown:
                best, bestd = None, None
                for e in edges:
                    d = e.distance_to(p)
                    if bestd is None or d < bestd:
                        best, bestd = e, d
                k = index.get(hash(best)) if best is not None else None
                names[j] = f"{fid}:{role}:{enames[k]}" if k is not None else f"{fid}:{role}"
            return
        if t in ("shell", "draft") and prev_faces:
            role = "inner" if t == "shell" else "drafted"
            th = float(step.feat.get("thickness", 0)) if t == "shell" else 0.0
            for j, f, p in unknown:
                best, bestd = None, None
                try:
                    n = f.normal_at(p)
                except Exception:
                    n = None
                for k, q in enumerate(prev_faces):
                    try:
                        d = abs(q.distance_to(p) - th)
                        if n is not None and _type(q) == "plane":
                            qn = q.normal_at(q.center())
                            if abs(qn.dot(n)) < (0.999 if t == "shell" else 0.9):
                                continue
                    except Exception:
                        continue
                    if bestd is None or d < bestd:
                        best, bestd = k, d
                names[j] = f"{fid}:{role}:{prev_names[best]}" if best is not None else f"{fid}:{role}"
                exact[j] = best is not None
            return
        order = sorted(unknown, key=lambda u: (round(u[2].X, 3), round(u[2].Y, 3), round(u[2].Z, 3)))
        for k, (j, _f, _p) in enumerate(order):
            names[j] = f"{fid}:new:{k + 1}"
            exact[j] = False

    def _split(self, faces, names: list[str]) -> list[str]:
        """Pieces with the same name are told apart by the names of the faces around them, else by ~k."""
        groups: dict[str, list[int]] = {}
        for i, n in enumerate(names):
            groups.setdefault(n, []).append(i)
        if all(len(v) == 1 for v in groups.values()):
            return names
        edge_faces: dict[int, list[int]] = {}
        for i, f in enumerate(faces):
            for e in f.edges():
                edge_faces.setdefault(hash(e), []).append(i)
        nbrs = [set() for _ in faces]
        for fs in edge_faces.values():
            for a in fs:
                for b in fs:
                    if a != b:
                        nbrs[a].add(names[b])
        out = list(names)
        for n, idx in groups.items():
            if len(idx) == 1:
                continue
            keys = {i: sorted(x for x in nbrs[i] if x != n) for i in idx}
            unique = {}
            for i in idx:
                own = [x for x in keys[i] if not any(x in keys[o] for o in idx if o != i)]
                unique[i] = own
            if all(unique[i] for i in idx):
                for i in idx:
                    out[i] = f"{n}#[{','.join(unique[i])}]"
            else:
                order = sorted(idx, key=lambda i: tuple(round(v, 3) for v in faces[i].center()))
                for k, i in enumerate(order):
                    out[i] = f"{n}~{k + 1}"
        return out

    def current(self, part) -> tuple[list, list[str], list[bool]]:
        """(faces, names, exact) of `part`, which must be the body after the last recorded step (or before the
        first)."""
        if part is None:
            return [], [], []
        if self._shape is part:
            return self._faces, self._names, self._exact
        faces, names, exact = self._faces, self._names, self._exact
        base_names = getattr(self, "_base", None) or names
        for step in self.steps[self._done:]:
            faces, raw, exact = self._name_step(step, faces, base_names)
            base_names = raw
            names = self._split(faces, raw)
            self._done += 1
            self._shape = step.after
            self._base = raw
            self._faces, self._names, self._exact = faces, names, exact
        if self._shape is not part:  # a body that no step produced (e.g. a trial copy): name it fresh
            return list(part.faces()), [f"face:{i}" for i in range(len(part.faces()))], [False] * len(part.faces())
        self._faces, self._names, self._exact = faces, names, exact
        return faces, names, exact

    def resolve_faces(self, part, name: str) -> list:
        faces, names, _ = self.current(part)
        hit = [f for f, n in zip(faces, names) if n == name]
        if not hit:  # a piece name without its neighbours: every piece of that face
            hit = [f for f, n in zip(faces, names) if n.split("#[")[0].split("~")[0] == name]
        return hit

    def resolve_edges(self, part, name: str) -> list:
        faces, names, _ = self.current(part)
        en = edge_names(part, faces, names)
        edges = part.edges()
        hit = [edges[i] for i, n in enumerate(en) if n == name]
        if not hit and "~" not in name:
            hit = [edges[i] for i, n in enumerate(en) if n.split("~")[0] == name]
        return hit


def edge_names(part, faces, names) -> list[str]:
    """Name of every edge of `part` (in edges() order) from the names of the faces it separates."""
    idx = {hash(e): k for k, e in enumerate(part.edges())}
    adj: dict[int, list[str]] = {}
    for f, n in zip(faces, names):
        for e in f.edges():
            k = idx.get(hash(e))
            if k is not None and n not in adj.setdefault(k, []):
                adj[k].append(n)
    raw = []
    for k in range(len(idx)):
        fs = sorted(adj.get(k, []))
        raw.append(f"{fs[0]}|seam" if len(fs) == 1 else "|".join(fs[:2]) if fs else f"edge:{k}")
    count: dict[str, list[int]] = {}
    for k, n in enumerate(raw):
        count.setdefault(n, []).append(k)
    edges = part.edges()
    for n, ks in count.items():
        if len(ks) > 1:
            order = sorted(ks, key=lambda k: tuple(round(v, 3) for v in edges[k].position_at(0.5)))
            for i, k in enumerate(order):
                raw[k] = f"{n}~{i + 1}"
    return raw


def annotate(part_before: dict, feat: dict) -> dict:
    """The feature with the persistent name added to each face and edge ref it picks, worked out on the part
    as it stands before the feature (the browser stores picks as points; this makes them survive edits)."""
    import copy

    from . import geometry
    st, _ = geometry.regen(part_before)
    if st.part is None:
        return feat
    faces, names, _ = st.namer.current(st.part)
    enames = edge_names(st.part, faces, names)
    edges = st.part.edges()
    out = copy.deepcopy(feat)

    def edge_ref(r):
        if not isinstance(r, dict) or "mid" not in r or r.get("name"):
            return
        found, _ = geometry.find_edges(st.part, [r])
        if len(found) == 1:
            k = next((i for i, e in enumerate(edges) if e.is_same(found[0])), None)
            if k is not None:
                r["name"] = enames[k]

    def face_ref(r):
        if not isinstance(r, dict) or "center" not in r or r.get("name"):
            return
        found, _ = geometry.find_faces(st.part, [r])
        if len(found) == 1:
            k = next((i for i, f in enumerate(faces) if f.is_same(found[0])), None)
            if k is not None:
                r["name"] = names[k]

    for r in out.get("edges") or []:
        edge_ref(r)
    for r in out.get("faces") or []:
        face_ref(r)
    for key in ("direction", "direction2"):
        if isinstance(out.get(key), dict) and isinstance(out[key].get("edge"), dict):
            edge_ref(out[key]["edge"])
    return out
