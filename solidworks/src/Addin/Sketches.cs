using System;
using System.Collections.Generic;
using System.Linq;
using OpenSketch.Sw.Core;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;

namespace OpenSketch.Sw
{
    /// <summary>
    /// Drawing an OpenSketch sketch in SOLIDWORKS: every curve drawn at its exact
    /// (already solved) place straight into the sketch (no snapping or automatic relations), shared end points merged,
    /// then the sketch's own relations and dimensions. If adding them moved anything, that is reported.
    /// </summary>
    public sealed partial class Commands
    {
        /// <summary>A sketch made in this call: what later features of the call need from it.</summary>
        sealed class SketchMade
        {
            public string Name;                       // SOLIDWORKS feature name
            public IFeature Feature;
            public SketchPlan Plan;
            public SketchFrame Os;                    // OpenSketch plane (model mm)
            public Vec3 SwNormal;                     // the SOLIDWORKS sketch's normal in model coordinates
            public object PlaneEntity;                // what it was sketched on (for a hole or a later sketch on the same plane)
            public Dictionary<string, object> PlaneSpec; // the plane as asked, to find a face again after the body changed
            public readonly Dictionary<string, ISketchSegment> Segs = new Dictionary<string, ISketchSegment>();
            public Func<double, double, Vec3> ToModel; // OpenSketch sketch (u, v) mm -> model mm
        }

        /// <summary>Where a sketch goes: a plane feature or a face to select, and the OpenSketch frame on it.</summary>
        sealed class PlaneTarget
        {
            public object Entity;
            public SketchFrame Os;
            public string Note;
        }

        sealed class Mapper
        {
            public IMathTransform ModelToSketch, SketchToModel;
            public IMathUtility Math;
            public SketchFrame Os;
            public bool Flip;                         // OpenSketch counter-clockwise is SOLIDWORKS clockwise

            public double[] Sk(double u, double v)
            {
                var p = Os.ToModel(u, v) * Units.M;
                var mp = (IMathPoint)Math.CreatePoint(p.Arr());
                return (double[])((IMathPoint)mp.MultiplyTransform(ModelToSketch)).ArrayData;
            }

            public Vec3 Model(double sx, double sy)
            {
                var mp = (IMathPoint)Math.CreatePoint(new[] { sx, sy, 0.0 });
                return Vec3.From((double[])((IMathPoint)mp.MultiplyTransform(SketchToModel)).ArrayData) * 1000;
            }
        }

        SketchMade DrawSketch(Ctx c, Dictionary<string, object> f, Dictionary<string, object> row)
        {
            var m = c.Doc;
            var plan = SketchPlan.From(f);
            var target = ResolvePlane(c, J.Obj(f, "plane") ?? J.O("ref", "Front Plane"), J.Obj(J.Obj(f, "expect"), "plane"));
            var sm = m.SketchManager;
            m.ClearSelection2(true);
            if (!SelectEntity(m, target.Entity, false, 0)) throw new UserError("Could not select the sketch plane.");
            sm.InsertSketch(true);
            var sk = sm.ActiveSketch as ISketch;
            if (sk == null) throw new UserError("SOLIDWORKS did not open a sketch on that plane.");
            var skFeat = sk as IFeature;
            try
            {
                return DrawInto(c, f, row, plan, target, sk);
            }
            catch (Exception)
            {
                // leave nothing half made: close the sketch and take it out again
                ExitSketchIfOpen(m);
                if (skFeat != null)
                {
                    try
                    {
                        DeleteFeature(m, skFeat.Name, false);
                    }
                    catch (Exception)
                    {
                    }
                }
                throw;
            }
        }

        SketchMade DrawInto(Ctx c, Dictionary<string, object> f, Dictionary<string, object> row, SketchPlan plan, PlaneTarget target, ISketch sk)
        {
            var m = c.Doc;
            var sm = m.SketchManager;
            var made = new SketchMade { Plan = plan, Os = target.Os, PlaneEntity = target.Entity, PlaneSpec = J.Obj(f, "plane") };
            var notes = new List<string>(plan.Notes);
            if (target.Note != null) notes.Add(target.Note);
            var map = new Mapper
            {
                ModelToSketch = (IMathTransform)sk.ModelToSketchTransform, Math = math, Os = target.Os
            };
            map.SketchToModel = (IMathTransform)map.ModelToSketch.Inverse();
            var o0 = map.Sk(0, 0);
            var ou = map.Sk(1, 0);
            var ov = map.Sk(0, 1);
            var det = (ou[0] - o0[0]) * (ov[1] - o0[1]) - (ou[1] - o0[1]) * (ov[0] - o0[0]);
            map.Flip = det < 0;
            // horizontal / vertical are SOLIDWORKS' sketch x / y: OpenSketch's u may lie along y (a face where
            // SOLIDWORKS chose another x) or at an angle; then they swap, or cannot be said and are left out
            var uAng = Math.Atan2(ou[1] - o0[1], ou[0] - o0[0]) * 180 / Math.PI;
            var quarter = Math.Abs(uAng - 90 * Math.Round(uAng / 90)) < 1e-4 ? ((int)Math.Round(uAng / 90) % 2 + 2) % 2 : -1;
            string hv(string how)
            {
                if (quarter == 0) return how;
                var swap = new Dictionary<string, string>
                {
                    ["horizontal"] = "vertical", ["vertical"] = "horizontal",
                    ["sgHORIZONTAL2D"] = "sgVERTICAL2D", ["sgVERTICAL2D"] = "sgHORIZONTAL2D",
                    ["sgHORIZONTALPOINTS2D"] = "sgVERTPOINTS2D", ["sgVERTPOINTS2D"] = "sgHORIZONTALPOINTS2D"
                };
                if (!swap.ContainsKey(how)) return how;
                return quarter == 1 ? swap[how] : null;
            }
            made.ToModel = (u, v) => target.Os.ToModel(u, v);
            var skN = map.Model(0, 0);
            var skZ = (Vec3.From((double[])((IMathPoint)((IMathPoint)math.CreatePoint(new[] { 0.0, 0.0, 1.0 })).MultiplyTransform(map.SketchToModel)).ArrayData) * 1000 - skN);
            made.SwNormal = skZ.Unit();

            var segs = new object[plan.Segs.Count];
            // each OpenSketch point as the curve ends that should become it: read from the curve every time it is
            // needed, because merging points deletes one of the two point objects (as the engine's PtOf does)
            var pts = new Dictionary<string, List<Func<ISketchPoint>>>();
            void keep(string pid, Func<ISketchPoint> p)
            {
                if (pid == null || p == null) return;
                if (!pts.TryGetValue(pid, out var l)) pts[pid] = l = new List<Func<ISketchPoint>>();
                l.Add(p);
            }
            ISketchPoint live(string pid, int k)
            {
                try
                {
                    var p = pts[pid][k]();
                    if (p != null) return p;
                }
                catch (Exception)
                {
                }
                // the curve is gone or would not say: the sketch point nearest where this point was drawn
                var w = map.Sk(plan.Pts[pid].u, plan.Pts[pid].v);
                ISketchPoint best = null;
                var bd = double.MaxValue;
                foreach (var o in sk.GetSketchPoints2() as object[] ?? new object[0])
                {
                    var q = (ISketchPoint)o;
                    var d = (q.X - w[0]) * (q.X - w[0]) + (q.Y - w[1]) * (q.Y - w[1]);
                    if (d < bd)
                    {
                        bd = d;
                        best = q;
                    }
                }
                return best;
            }
            ISketchPoint nearer(ISketchPoint a, ISketchPoint b, string pid)
            {
                var w = map.Sk(plan.Pts[pid].u, plan.Pts[pid].v);
                double da = (a.X - w[0]) * (a.X - w[0]) + (a.Y - w[1]) * (a.Y - w[1]);
                double db = (b.X - w[0]) * (b.X - w[0]) + (b.Y - w[1]) * (b.Y - w[1]);
                return da <= db ? a : b;
            }
            var drawnPts = new Dictionary<string, double[]>();   // where each point was drawn (sketch m)
            var failed = new List<string>();
            sm.AddToDB = true;
            sm.DisplayWhenAdded = false;
            try
            {
                for (var i = 0; i < plan.Segs.Count; i++)
                {
                    var s = plan.Segs[i];
                    object made1 = null;
                    switch (s.Kind)
                    {
                        case "line":
                        case "centerline":
                            var a = map.Sk(plan.Pts[s.P1].u, plan.Pts[s.P1].v);
                            var b = map.Sk(plan.Pts[s.P2].u, plan.Pts[s.P2].v);
                            made1 = s.Kind == "line" ? sm.CreateLine(a[0], a[1], 0, b[0], b[1], 0) : sm.CreateCenterLine(a[0], a[1], 0, b[0], b[1], 0);
                            if (made1 is ISketchLine ln)
                            {
                                var ps = (ISketchPoint)ln.GetStartPoint2();
                                var pe = (ISketchPoint)ln.GetEndPoint2();
                                var p1Start = ReferenceEquals(nearer(ps, pe, s.P1), ps);
                                keep(s.P1, () => (ISketchPoint)(p1Start ? ln.GetStartPoint2() : ln.GetEndPoint2()));
                                keep(s.P2, () => (ISketchPoint)(p1Start ? ln.GetEndPoint2() : ln.GetStartPoint2()));
                            }
                            break;
                        case "circle":
                            var cc = map.Sk(plan.Pts[s.C].u, plan.Pts[s.C].v);
                            made1 = sm.CreateCircleByRadius(cc[0], cc[1], 0, s.R * Units.M);
                            if (made1 is ISketchArc ci) keep(s.C, () => (ISketchPoint)ci.GetCenterPoint2());
                            break;
                        case "arc":
                            var ac = map.Sk(plan.Pts[s.C].u, plan.Pts[s.C].v);
                            var a0 = map.Sk(plan.Pts[s.S].u, plan.Pts[s.S].v);
                            var a1 = map.Sk(plan.Pts[s.E].u, plan.Pts[s.E].v);
                            // OpenSketch arcs run counter-clockwise from start to end; SOLIDWORKS: +1 counter-clockwise
                            short dir = (short)(map.Flip ? -1 : 1);
                            made1 = sm.CreateArc(ac[0], ac[1], 0, a0[0], a0[1], 0, a1[0], a1[1], 0, dir);
                            if (made1 is ISketchArc arc)
                            {
                                keep(s.C, () => (ISketchPoint)arc.GetCenterPoint2());
                                var ps = (ISketchPoint)arc.GetStartPoint2();
                                var pe = (ISketchPoint)arc.GetEndPoint2();
                                var sStart = ReferenceEquals(nearer(ps, pe, s.S), ps);
                                keep(s.S, () => (ISketchPoint)(sStart ? arc.GetStartPoint2() : arc.GetEndPoint2()));
                                keep(s.E, () => (ISketchPoint)(sStart ? arc.GetEndPoint2() : arc.GetStartPoint2()));
                            }
                            break;
                        case "point":
                            var pp = map.Sk(plan.Pts[s.P].u, plan.Pts[s.P].v);
                            made1 = sm.CreatePoint(pp[0], pp[1], 0);
                            var lone = made1 as ISketchPoint;
                            if (lone != null) keep(s.P, () => lone);
                            break;
                    }
                    if (made1 == null) failed.Add(s.Id);
                    segs[i] = made1;
                    if (made1 is ISketchSegment seg) made.Segs[s.Id] = seg;
                }
                foreach (var kv in plan.Pts)
                    drawnPts[kv.Key] = map.Sk(kv.Value.u, kv.Value.v);
            }
            finally
            {
                sm.AddToDB = false;
                sm.DisplayWhenAdded = true;
            }

            // one point where curves meet: SOLIDWORKS drew each end separately, so merge them
            var relWant = 0;
            var relOk = 0;
            var relFailed = new List<string>();
            var rm = sk.RelationManager;
            int relCount() => rm.GetRelationsCount((int)swSketchRelationFilterType_e.swAll);
            foreach (var pid in pts.Keys.ToList())
            {
                var l = pts[pid];
                for (var k = 1; k < l.Count; k++)
                {
                    relWant++;
                    m.ClearSelection2(true);
                    var a = live(pid, 0);
                    var b = live(pid, k);
                    if (a != null && b != null && ReferenceEquals(a, b))
                    {
                        relOk++;   // already one point
                        continue;
                    }
                    if (a != null && b != null && SelectEntity(m, a, false, 0) && SelectEntity(m, b, true, 0) && SelectedCount(m) == 2)
                    {
                        m.SketchAddConstraints("sgMERGEPOINTS");
                        relOk++;
                    }
                    else relFailed.Add("join at " + pid);
                }
            }

            object pick(SketchPlan.Ref r)
            {
                switch (r.Kind)
                {
                    case "seg": return made.Segs.TryGetValue(r.Id, out var sg) ? sg : null;
                    case "pt": return pts.ContainsKey(r.Id) ? live(r.Id, 0) : null;
                    case "origin": return "origin";
                    case "edge":
                        var (ea, eb) = plan.EdgeRefs[r.Id];
                        var mid = (made.ToModel(plan.Pts[ea].u, plan.Pts[ea].v) + made.ToModel(plan.Pts[eb].u, plan.Pts[eb].v)) * 0.5;
                        return FindEdge(Bodies(m), J.O("mid", J.Pt(mid, 6)), notes);
                    case "refpoint":
                        return FindVertex(Bodies(m), made.ToModel(plan.Pts[r.Id].u, plan.Pts[r.Id].v));
                }
                return null;
            }
            bool selectAll(List<SketchPlan.Ref> refs)
            {
                m.ClearSelection2(true);
                var first = true;
                foreach (var r in refs)
                {
                    var o = pick(r);
                    bool ok;
                    if (o == null) return false;
                    if (o is string) ok = SelectOrigin(m, !first);
                    else ok = SelectEntity(m, o, !first, 0);
                    if (!ok) return false;
                    first = false;
                }
                return true;
            }
            foreach (var rel in plan.Rels)
            {
                relWant++;
                var n0 = relCount();
                try
                {
                    var sg = hv(rel.Sg);
                    if (sg == null)
                    {
                        relFailed.Add($"{rel.What} ({rel.Source}): the sketch's x axis is at {uAng:0.##} deg to SOLIDWORKS' here, so horizontal/vertical cannot be added");
                        continue;
                    }
                    if (!selectAll(rel.Refs))
                    {
                        relFailed.Add($"{rel.What} ({rel.Source}): could not select {string.Join(", ", rel.Refs)}");
                        continue;
                    }
                    m.SketchAddConstraints(sg);
                    if (relCount() > n0 || sg == "sgMERGEPOINTS") relOk++;
                    else relFailed.Add($"{rel.What} ({rel.Source}): SOLIDWORKS added no relation (already implied, or it would over-define)");
                }
                catch (Exception ex)
                {
                    relFailed.Add($"{rel.What} ({rel.Source}): {(ex is UserError ? ex.Message : BridgeClient.Describe(ex))}");
                }
            }

            var dimOk = 0;
            var dimFailed = new List<string>();
            var dimsMade = new List<(IDimension dim, SketchPlan.Dim d, double got)>();
            foreach (var d in plan.Dims)
            {
                try
                {
                    var how = hv(d.How);
                    if (how == null)
                    {
                        dimFailed.Add($"{d.Source}: the sketch's x axis is at {uAng:0.##} deg to SOLIDWORKS' here, so a horizontal/vertical dimension cannot be added");
                        continue;
                    }
                    if (!selectAll(d.Refs))
                    {
                        dimFailed.Add($"{d.Source}: could not select {string.Join(", ", d.Refs)}");
                        continue;
                    }
                    var pos = DimPos(map, d.LabelU, d.LabelV);
                    object dd;
                    switch (how)
                    {
                        case "horizontal": dd = m.AddHorizontalDimension2(pos[0], pos[1], pos[2]); break;
                        case "vertical": dd = m.AddVerticalDimension2(pos[0], pos[1], pos[2]); break;
                        case "diameter": dd = m.AddDiameterDimension2(pos[0], pos[1], pos[2]); break;
                        case "radius": dd = m.AddRadialDimension2(pos[0], pos[1], pos[2]); break;
                        default: dd = m.AddDimension2(pos[0], pos[1], pos[2]); break;
                    }
                    var disp = dd as IDisplayDimension;
                    if (disp == null)
                    {
                        dimFailed.Add($"{d.Source}: SOLIDWORKS made no dimension");
                        continue;
                    }
                    dimOk++;
                    var dim = (IDimension)disp.GetDimension2(0);
                    var angle = d.How == "angle";
                    var got = angle ? Units.Deg(dim.SystemValue) : dim.SystemValue * 1000;
                    var want = d.Value;
                    if (!string.IsNullOrEmpty(d.Name))
                    {
                        try
                        {
                            dim.Name = d.Name;
                        }
                        catch (Exception)
                        {
                        }
                    }
                    if (d.Driven) dim.DrivenState = (int)swDimensionDrivenState_e.swDimensionDriven;
                    else if (Math.Abs(got - want) < 1e-6 * Math.Max(1, Math.Abs(want)))
                        dim.SetSystemValue3(angle ? Units.Rad(want) : want * Units.M, (int)swSetValueInConfiguration_e.swSetValue_InThisConfiguration, null);
                    else if (angle && Math.Abs(180 - got - want) < 1e-4)
                        notes.Add($"{d.Source}: SOLIDWORKS measures the other angle ({got:0.###} deg, the geometry is as meant)");
                    else if (Math.Abs(got - want) > 1e-4)
                        notes.Add($"{d.Source}: SOLIDWORKS reads {got:0.####} where the sketch says {want:0.####}; the geometry was left as drawn");
                    dimsMade.Add((dim, d, got));
                    if (dim.DrivenState == (int)swDimensionDrivenState_e.swDimensionDriven && !d.Driven)
                        notes.Add($"{d.Source}: SOLIDWORKS made it a driven (reference) dimension: it over-defines the sketch");
                }
                catch (Exception ex)
                {
                    dimFailed.Add($"{d.Source}: {(ex is UserError ? ex.Message : BridgeClient.Describe(ex))}");
                }
            }
            m.ClearSelection2(true);

            // did relations or dimensions move anything?
            var moved = new List<string>();
            foreach (var kv in pts)
            {
                if (!drawnPts.TryGetValue(kv.Key, out var w)) continue;
                try
                {
                    var p = live(kv.Key, 0);
                    if (p != null && (Math.Abs(p.X - w[0]) > 1e-7 || Math.Abs(p.Y - w[1]) > 1e-7)) moved.Add(kv.Key);
                }
                catch (Exception)
                {
                }
            }
            var state = sk.GetConstrainedStatus();
            var feat = sk as IFeature;   // a sketch is also a feature
            sm.InsertSketch(true); // leave the sketch
            if (feat == null) feat = m.Extension.GetLastFeatureAdded() as IFeature;
            if (feat == null) throw new UserError("SOLIDWORKS made the sketch but did not hand it back.");
            var name = J.Str(f, "name");
            if (!string.IsNullOrEmpty(name) && name != feat.Name)
            {
                try
                {
                    feat.Name = name;
                }
                catch (Exception)
                {
                    notes.Add($"could not rename it to {name} (name taken?)");
                }
            }
            made.Feature = feat;
            made.Name = feat.Name;
            row["name"] = feat.Name;
            // dimension names after the rename, so equations name what is in the tree ("D1@<sketch name>")
            var dimNames = new List<object>();
            foreach (var (dim, d, got) in dimsMade)
            {
                string full;
                try
                {
                    full = dim.Name + "@" + feat.Name;
                }
                catch (Exception)
                {
                    notes.Add($"{d.Source}: SOLIDWORKS would not give the dimension's name" + (string.IsNullOrEmpty(d.Eq) ? "" : $"; its equation ({d.Eq}) was not added"));
                    continue;
                }
                dimNames.Add(J.O("dimension", full, "from", d.Source, "value", Math.Round(got, 6)));
                if (!string.IsNullOrEmpty(d.Eq)) c.Equations.Add((full, d.Eq));
            }
            row["sketch"] = SketchState(state);
            row["relations"] = $"{relOk} of {relWant}";
            row["dimensions"] = $"{dimOk} of {plan.Dims.Count}";
            if (dimNames.Count > 0) row["dimension_names"] = dimNames;
            if (failed.Count > 0) notes.Add("not drawn: " + string.Join(", ", failed));
            if (relFailed.Count > 0) row["relations_not_added"] = relFailed;
            if (dimFailed.Count > 0) row["dimensions_not_added"] = dimFailed;
            if (moved.Count > 0) notes.Add("adding relations and dimensions moved points " + string.Join(", ", moved.Take(12)) + ": check the sketch");
            if (notes.Count > 0) row["notes"] = notes;
            row["state"] = failed.Count > 0 ? "error"
                : moved.Count > 0 || relFailed.Count > 0 || dimFailed.Count > 0 || state == (int)swConstrainedStatus_e.swOverConstrained ? "warning" : "ok";
            if (state == (int)swConstrainedStatus_e.swOverConstrained) row["reason"] = "over defined";
            return made;
        }

        /// <summary>Where a dimension's text goes, in the coordinates AddDimension2 takes.</summary>
        static double[] DimPos(Mapper map, double u, double v)
        {
            // AddDimension2 and its relatives place the text at a point in MODEL space (metres)
            var p = map.Os.ToModel(u, v) * Units.M;
            return p.Arr();
        }

        bool SelectOrigin(IModelDoc2 m, bool append)
        {
            var of = OriginFeature(m);
            var name = "Point1@" + (of?.Name ?? "Origin");
            return m.Extension.SelectByID2(name, "EXTSKETCHPOINT", 0, 0, 0, append, 0, null, 0);
        }

        static IVertex FindVertex(List<IBody2> bodies, Vec3 pMm)
        {
            IVertex best = null;
            var bd = double.MaxValue;
            foreach (var b in bodies)
            foreach (var o in b.GetVertices() as object[] ?? new object[0])
            {
                var v = (IVertex)o;
                var d = Dist(v, pMm, out _);
                if (d < bd)
                {
                    bd = d;
                    best = v;
                }
            }
            if (best == null || bd > FindTolMm) throw new UserError($"No model vertex at {pMm}.");
            return best;
        }
    }
}
