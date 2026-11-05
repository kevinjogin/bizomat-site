using System;
using System.Collections.Generic;
using System.Linq;

namespace OpenSketch.Sw.Core
{
    /// <summary>
    /// What to draw in SOLIDWORKS for one OpenSketch sketch (docs/DOCUMENT.md "Sketch"): the curves, which of
    /// their end points are one point (merged), the relations and the dimensions, all in OpenSketch sketch
    /// coordinates (mm). The SOLIDWORKS layer maps these to its own sketch coordinates and makes the calls; this
    /// part has no SOLIDWORKS in it, so it is tested on its own.
    /// </summary>
    public sealed class SketchPlan
    {
        public sealed class Seg
        {
            public string Id;
            public string Kind;        // line, centerline, arc, circle, point
            public string P1, P2;      // line ends (OpenSketch point ids)
            public string C, S, E;     // arc centre, start, end (counter-clockwise from S to E); circle centre
            public double R;           // circle radius
            public string P;           // a lone sketch point
        }

        /// <summary>An item a relation or dimension refers to.</summary>
        public sealed class Ref
        {
            public string Kind;        // seg, pt, origin, edge (a model edge, by a point on it, model mm)
            public string Id;          // seg or point id
            public Vec3 At;            // edge: model point
            public override string ToString() => Kind == "origin" ? "origin" : Kind + ":" + Id;
        }

        public sealed class Rel
        {
            public string Sg;          // sgHORIZONTAL2D ...
            public List<Ref> Refs = new List<Ref>();
            public string Source;      // the OpenSketch constraint id
            public string What;        // plain name, for the report
        }

        public sealed class Dim
        {
            public string How;         // aligned, horizontal, vertical, diameter, radius, angle
            public List<Ref> Refs = new List<Ref>();
            public double Value;       // mm or degrees
            public string Name;
            public string Source;
            public double LabelU, LabelV;
            public bool Driven;
            public string Eq;
        }

        public readonly Dictionary<string, (double u, double v)> Pts = new Dictionary<string, (double u, double v)>();
        public readonly List<Seg> Segs = new List<Seg>();
        public readonly List<Rel> Rels = new List<Rel>();
        public readonly List<Dim> Dims = new List<Dim>();
        public readonly List<string> Notes = new List<string>();
        /// <summary>For each point id, the curves that use it: (seg index, role "s"/"e"/"c"/"p").</summary>
        public readonly Dictionary<string, List<(int seg, string role)>> Uses = new Dictionary<string, List<(int, string)>>();
        /// <summary>Ref entities (hidden copies of model edges) by id: their two end point ids.</summary>
        public readonly Dictionary<string, (string a, string b)> EdgeRefs = new Dictionary<string, (string, string)>();
        public readonly HashSet<string> RefPoints = new HashSet<string>();

        public static readonly string[] DimTypes = { "distance", "diameter", "radius", "angle" };

        public static SketchPlan From(Dictionary<string, object> sketch)
        {
            var plan = new SketchPlan();
            var ents = J.Arr(sketch, "entities") ?? new List<object>();
            var byId = new Dictionary<string, Dictionary<string, object>>();
            foreach (var o in ents)
            {
                var e = J.Obj(o);
                if (e == null) continue;
                var id = J.Str(e, "id");
                if (id == null) throw new ArgumentException("A sketch entity has no id.");
                byId[id] = e;
                if (J.Str(e, "type") == "point")
                    plan.Pts[id] = (J.Num(e, "x"), J.Num(e, "y"));
            }
            // hidden model-edge references (OpenSketch "ref": "edge"): not drawn; relations to them go to the model edge
            foreach (var e in byId.Values)
            {
                if (J.Str(e, "ref") == null) continue;
                if (J.Str(e, "type") == "line")
                {
                    plan.EdgeRefs[J.Str(e, "id")] = (J.Str(e, "p1"), J.Str(e, "p2"));
                    plan.RefPoints.Add(J.Str(e, "p1"));
                    plan.RefPoints.Add(J.Str(e, "p2"));
                }
                else if (J.Str(e, "type") == "point") plan.RefPoints.Add(J.Str(e, "id"));
            }
            foreach (var e in byId.Values)
            {
                var t = J.Str(e, "type");
                var id = J.Str(e, "id");
                if (J.Str(e, "ref") != null || t == "point") continue;
                var cons = J.Bool(e, "construction");
                Seg s;
                switch (t)
                {
                    case "line":
                        s = new Seg { Id = id, Kind = cons ? "centerline" : "line", P1 = J.Str(e, "p1"), P2 = J.Str(e, "p2") };
                        plan.Need(s.P1, id);
                        plan.Need(s.P2, id);
                        var (ax, ay) = plan.Pts[s.P1];
                        var (bx, by) = plan.Pts[s.P2];
                        if (Math.Abs(ax - bx) + Math.Abs(ay - by) < 1e-9)
                        {
                            plan.Notes.Add($"{id}: a line of zero length is left out.");
                            continue;
                        }
                        break;
                    case "circle":
                        s = new Seg { Id = id, Kind = "circle", C = J.Str(e, "center"), R = J.Num(e, "r") };
                        plan.Need(s.C, id);
                        if (s.R <= 1e-9) throw new ArgumentException($"{id}: the circle needs a radius.");
                        break;
                    case "arc":
                        s = new Seg { Id = id, Kind = "arc", C = J.Str(e, "center"), S = J.Str(e, "start"), E = J.Str(e, "end") };
                        plan.Need(s.C, id);
                        plan.Need(s.S, id);
                        plan.Need(s.E, id);
                        break;
                    default:
                        throw new ArgumentException($"{id}: {t} sketch entities cannot be made in SOLIDWORKS yet (use lines, arcs and circles).");
                }
                if (cons && t != "line") plan.Notes.Add($"{id}: construction {t}s are drawn as ordinary curves; make them construction by hand if needed.");
                plan.Add(s);
            }
            // lone points: not an end or centre of anything drawn, and not part of a hidden reference
            foreach (var kv in plan.Pts.ToList())
                if (kv.Key != "origin" && !plan.Uses.ContainsKey(kv.Key) && !plan.RefPoints.Contains(kv.Key))
                    plan.Add(new Seg { Id = kv.Key, Kind = "point", P = kv.Key });
            if (plan.Uses.ContainsKey("origin"))
                plan.Rels.Add(new Rel { Sg = "sgCOINCIDENT", Refs = new List<Ref> { new Ref { Kind = "pt", Id = "origin" }, new Ref { Kind = "origin", Id = "origin" } },
                                        Source = "origin", What = "on the origin" });

            foreach (var o in J.Arr(sketch, "constraints") ?? new List<object>())
            {
                var c = J.Obj(o);
                if (c == null) continue;
                try
                {
                    plan.Constraint(c);
                }
                catch (ArgumentException ex)
                {
                    plan.Notes.Add(ex.Message);
                }
            }
            return plan;
        }

        void Need(string pid, string by)
        {
            if (pid == "origin")
            {
                Pts["origin"] = (0, 0);  // a curve that starts at the sketch origin: drawn there, then made coincident with it
                return;
            }
            if (pid == null || !Pts.ContainsKey(pid)) throw new ArgumentException($"{by}: point {pid ?? "(none)"} is missing from the sketch.");
        }

        void Add(Seg s)
        {
            var i = Segs.Count;
            Segs.Add(s);
            void use(string p, string role)
            {
                if (p == null) return;
                if (!Uses.TryGetValue(p, out var l)) Uses[p] = l = new List<(int, string)>();
                l.Add((i, role));
            }
            switch (s.Kind)
            {
                case "line":
                case "centerline":
                    use(s.P1, "s");
                    use(s.P2, "e");
                    break;
                case "arc":
                    use(s.C, "c");
                    use(s.S, "s");
                    use(s.E, "e");
                    break;
                case "circle":
                    use(s.C, "c");
                    break;
                case "point":
                    use(s.P, "p");
                    break;
            }
        }

        /// <summary>Point ids used by more than one curve: SOLIDWORKS draws them as separate points, merged after.</summary>
        public IEnumerable<string> SharedPoints() => Uses.Where(kv => kv.Value.Count > 1).Select(kv => kv.Key);

        public int SegIndex(string id) => Segs.FindIndex(s => s.Id == id);

        Ref R(string id)
        {
            if (id == "origin") return new Ref { Kind = "origin", Id = "origin" };
            if (EdgeRefs.TryGetValue(id, out var _)) return new Ref { Kind = "edge", Id = id };
            if (RefPoints.Contains(id)) return new Ref { Kind = "refpoint", Id = id };
            if (Pts.ContainsKey(id))
            {
                if (!Uses.ContainsKey(id)) throw new ArgumentException($"point {id} is not drawn");
                return new Ref { Kind = "pt", Id = id };
            }
            if (SegIndex(id) >= 0) return new Ref { Kind = "seg", Id = id };
            throw new ArgumentException($"unknown sketch item {id}");
        }

        bool IsPt(Ref r) => r.Kind == "pt" || r.Kind == "origin" || r.Kind == "refpoint";
        string SegKind(Ref r) => r.Kind == "seg" ? Segs[SegIndex(r.Id)].Kind : r.Kind == "edge" ? "line" : null;
        bool IsLine(Ref r) => SegKind(r) == "line" || SegKind(r) == "centerline";
        bool IsRound(Ref r) => SegKind(r) == "arc" || SegKind(r) == "circle";

        void Constraint(Dictionary<string, object> c)
        {
            var type = J.Str(c, "type");
            var cid = J.Str(c, "id") ?? type;
            var ids = J.Strs(c, "refs");
            if (ids.Count == 0) throw new ArgumentException($"{cid}: a {type} needs refs.");
            List<Ref> refs;
            try
            {
                refs = ids.Select(R).ToList();
            }
            catch (ArgumentException ex)
            {
                throw new ArgumentException($"{cid} ({type}) left out: {ex.Message}.");
            }
            if (Array.IndexOf(DimTypes, type) >= 0)
            {
                Dimension(c, cid, type, refs);
                return;
            }
            // a relation that only ties hidden references together means nothing in SOLIDWORKS (model edges are fixed)
            if (refs.All(r => r.Kind == "edge" || r.Kind == "refpoint" || r.Kind == "origin")) return;
            string sg;
            switch (type)
            {
                case "coincident":
                    if (refs.Count != 2) throw new ArgumentException($"{cid}: coincident takes two items.");
                    if (IsPt(refs[0]) && IsPt(refs[1]))
                        sg = refs[0].Kind == "pt" && refs[1].Kind == "pt" ? "sgMERGEPOINTS" : "sgCOINCIDENT";
                    else sg = "sgCOINCIDENT";
                    if (!IsPt(refs[0]) && IsPt(refs[1])) refs.Reverse();
                    break;
                case "horizontal":
                    sg = refs.Count == 1 ? "sgHORIZONTAL2D" : "sgHORIZONTALPOINTS2D";
                    break;
                case "vertical":
                    sg = refs.Count == 1 ? "sgVERTICAL2D" : "sgVERTPOINTS2D";
                    break;
                case "parallel": sg = "sgPARALLEL"; break;
                case "perpendicular": sg = "sgPERPENDICULAR"; break;
                case "collinear": sg = "sgCOLINEAR"; break;
                case "equal": sg = "sgSAMELENGTH"; break;
                case "tangent": sg = "sgTANGENT"; break;
                case "concentric": sg = "sgCONCENTRIC"; break;
                case "midpoint":
                    sg = "sgATMIDDLE";
                    if (refs.Count == 2 && !IsPt(refs[0])) refs.Reverse();
                    break;
                case "symmetric":
                    sg = "sgSYMMETRIC";
                    if (refs.Count != 3) throw new ArgumentException($"{cid}: symmetric takes two items and a centerline.");
                    break;
                case "fix":
                    sg = "sgFIXED";
                    refs = refs.Where(r => r.Kind == "pt" || r.Kind == "seg").ToList();
                    if (refs.Count == 0) return;
                    break;
                default:
                    throw new ArgumentException($"{cid}: the {type} relation has no SOLIDWORKS equivalent here; left out.");
            }
            Rels.Add(new Rel { Sg = sg, Refs = refs, Source = cid, What = type });
        }

        void Dimension(Dictionary<string, object> c, string cid, string type, List<Ref> refs)
        {
            var d = new Dim
            {
                Refs = refs, Value = J.Num(c, "value"), Name = J.Str(c, "name"), Source = cid,
                Driven = J.Bool(c, "driven"), Eq = J.Str(c, "eq")
            };
            switch (type)
            {
                case "distance":
                    var orient = J.Str(c, "orient", "aligned");
                    d.How = orient == "horizontal" || orient == "vertical" ? orient : "aligned";
                    if (refs.Count == 1 && !IsLine(refs[0])) throw new ArgumentException($"{cid}: a distance on one item needs a line.");
                    break;
                case "diameter":
                case "radius":
                    if (refs.Count != 1 || !IsRound(refs[0])) throw new ArgumentException($"{cid}: a {type} needs one arc or circle.");
                    d.How = type;
                    break;
                case "angle":
                    if (refs.Count != 2 || !IsLine(refs[0]) || !IsLine(refs[1])) throw new ArgumentException($"{cid}: an angle needs two lines.");
                    d.How = "angle";
                    break;
            }
            var lab = J.Arr(c, "label");
            if (lab != null && lab.Count == 2 && lab[0] is double lu && lab[1] is double lv)
            {
                d.LabelU = lu;
                d.LabelV = lv;
            }
            else
            {
                (d.LabelU, d.LabelV) = DefaultLabel(d);
            }
            Dims.Add(d);
        }

        /// <summary>Where SOLIDWORKS puts the dimension text when the sketch gives no label: beside the item, and
        /// for an angle inside the angle between the two lines (the side decides which angle is measured).</summary>
        public (double, double) DefaultLabel(Dim d)
        {
            var pts = new List<(double u, double v)>();
            foreach (var r in d.Refs)
            {
                if (r.Kind == "origin") pts.Add((0, 0));
                else if (r.Kind == "pt" || r.Kind == "refpoint") pts.Add(Pts[r.Id]);
                else if (r.Kind == "edge")
                {
                    var (a, b) = EdgeRefs[r.Id];
                    pts.Add(Mid(Pts[a], Pts[b]));
                }
                else
                {
                    var s = Segs[SegIndex(r.Id)];
                    if (s.Kind == "circle")
                    {
                        var c = Pts[s.C];
                        var k = s.R * 0.8;
                        pts.Add((c.u + k, c.v + k));
                    }
                    else if (s.Kind == "arc") pts.Add(ArcMid(s));
                    else pts.Add(Mid(Pts[s.P1], Pts[s.P2]));
                }
            }
            if (d.How == "angle" && d.Refs.Count == 2 && d.Refs[0].Kind == "seg" && d.Refs[1].Kind == "seg")
            {
                var a = Segs[SegIndex(d.Refs[0].Id)];
                var b = Segs[SegIndex(d.Refs[1].Id)];
                var x = Intersect(Pts[a.P1], Pts[a.P2], Pts[b.P1], Pts[b.P2]);
                if (x.HasValue)
                {
                    var ma = Mid(Pts[a.P1], Pts[a.P2]);
                    var mb = Mid(Pts[b.P1], Pts[b.P2]);
                    var (cx, cy) = x.Value;
                    double dax = ma.u - cx, day = ma.v - cy, dbx = mb.u - cx, dby = mb.v - cy;
                    double la = Math.Sqrt(dax * dax + day * day), lb = Math.Sqrt(dbx * dbx + dby * dby);
                    if (la > 1e-9 && lb > 1e-9)
                    {
                        var r = 0.5 * Math.Min(la, lb);
                        var bx = dax / la + dbx / lb;
                        var by = day / la + dby / lb;
                        var bl = Math.Sqrt(bx * bx + by * by);
                        if (bl > 1e-9) return (cx + bx / bl * r, cy + by / bl * r);
                    }
                }
            }
            if (pts.Count == 1)
            {
                var s = d.Refs[0].Kind == "seg" ? Segs[SegIndex(d.Refs[0].Id)] : null;
                if (s != null && (s.Kind == "line" || s.Kind == "centerline"))
                {
                    var a = Pts[s.P1];
                    var b = Pts[s.P2];
                    double dx = b.u - a.u, dy = b.v - a.v, l = Math.Sqrt(dx * dx + dy * dy);
                    var off = Math.Max(2.0, 0.15 * l);
                    var m = Mid(a, b);
                    if (d.How == "horizontal") return (m.u, Math.Max(a.v, b.v) + off);
                    if (d.How == "vertical") return (Math.Max(a.u, b.u) + off, m.v);
                    return (m.u - dy / l * off, m.v + dx / l * off);
                }
                return pts[0];
            }
            var p = pts[0];
            var q = pts[pts.Count - 1];
            var mid = Mid(p, q);
            double ex = q.u - p.u, ey = q.v - p.v, el = Math.Sqrt(ex * ex + ey * ey);
            var o = Math.Max(2.0, 0.2 * el);
            if (d.How == "horizontal") return (mid.u, Math.Max(p.v, q.v) + o);
            if (d.How == "vertical") return (Math.Max(p.u, q.u) + o, mid.v);
            if (el < 1e-9) return (mid.u + o, mid.v + o);
            return (mid.u - ey / el * o, mid.v + ex / el * o);
        }

        static (double u, double v) Mid((double u, double v) a, (double u, double v) b) => ((a.u + b.u) / 2, (a.v + b.v) / 2);

        (double u, double v) ArcMid(Seg s)
        {
            var c = Pts[s.C];
            var a = Pts[s.S];
            var b = Pts[s.E];
            var r = Math.Sqrt((a.u - c.u) * (a.u - c.u) + (a.v - c.v) * (a.v - c.v));
            var a0 = Math.Atan2(a.v - c.v, a.u - c.u);
            var a1 = Math.Atan2(b.v - c.v, b.u - c.u);
            if (a1 <= a0 + 1e-12) a1 += 2 * Math.PI;
            var am = (a0 + a1) / 2;
            return (c.u + r * Math.Cos(am), c.v + r * Math.Sin(am));
        }

        static (double, double)? Intersect((double u, double v) a1, (double u, double v) a2, (double u, double v) b1, (double u, double v) b2)
        {
            double d1x = a2.u - a1.u, d1y = a2.v - a1.v, d2x = b2.u - b1.u, d2y = b2.v - b1.v;
            var den = d1x * d2y - d1y * d2x;
            if (Math.Abs(den) < 1e-12) return null;
            var t = ((b1.u - a1.u) * d2y - (b1.v - a1.v) * d2x) / den;
            return (a1.u + t * d1x, a1.v + t * d1y);
        }

        /// <summary>Points along every profile curve (not construction), for bounding a revolve or a sweep.</summary>
        public List<(double u, double v)> ProfileSamples(int perArc = 16)
        {
            var o = new List<(double, double)>();
            foreach (var s in Segs)
            {
                switch (s.Kind)
                {
                    case "line":
                        o.Add(Pts[s.P1]);
                        o.Add(Pts[s.P2]);
                        break;
                    case "circle":
                        var c = Pts[s.C];
                        for (var i = 0; i < perArc; i++)
                        {
                            var a = 2 * Math.PI * i / perArc;
                            o.Add((c.u + s.R * Math.Cos(a), c.v + s.R * Math.Sin(a)));
                        }
                        break;
                    case "arc":
                        var cc = Pts[s.C];
                        var p = Pts[s.S];
                        var q = Pts[s.E];
                        var r = Math.Sqrt((p.u - cc.u) * (p.u - cc.u) + (p.v - cc.v) * (p.v - cc.v));
                        var a0 = Math.Atan2(p.v - cc.v, p.u - cc.u);
                        var a1 = Math.Atan2(q.v - cc.v, q.u - cc.u);
                        if (a1 <= a0 + 1e-12) a1 += 2 * Math.PI;
                        for (var i = 0; i <= perArc; i++)
                        {
                            var a = a0 + (a1 - a0) * i / perArc;
                            o.Add((cc.u + r * Math.Cos(a), cc.v + r * Math.Sin(a)));
                        }
                        break;
                }
            }
            return o;
        }
    }
}
