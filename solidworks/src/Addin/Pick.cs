using System;
using System.Collections.Generic;
using System.Linq;
using OpenSketch.Sw.Core;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;

namespace OpenSketch.Sw
{
    /// <summary>Finding faces, edges and planes the way OpenSketch names them (a point on them, mm) and selecting
    /// them with a selection mark. A face or edge is the one the point lies on (IFace2/IEdge.GetClosestPointOn).</summary>
    public sealed partial class Commands
    {
        const double FindTolMm = 0.05;

        static double Size(List<IBody2> bodies)
        {
            var bb = Box(bodies);
            if (bb == null) return 100;
            var s = (List<object>)bb["size"];
            return Math.Max(1, Math.Sqrt(s.Cast<double>().Sum(v => v * v)));
        }

        static double Dist(object entity, Vec3 pMm, out Vec3 at)
        {
            at = pMm;
            double[] cp = null;
            var pm = pMm * Units.M;
            if (entity is IFace2 f) cp = f.GetClosestPointOn(pm.X, pm.Y, pm.Z) as double[];
            else if (entity is IEdge e) cp = e.GetClosestPointOn(pm.X, pm.Y, pm.Z) as double[];
            else if (entity is IVertex v) cp = v.GetPoint() as double[];
            if (cp == null || cp.Length < 3) return double.MaxValue;
            at = Vec3.From(cp) * 1000;
            return (at - pMm).Length;
        }

        static Vec3? PlanarNormal(IFace2 f)
        {
            var s = f.GetSurface() as ISurface;
            if (s == null || !s.IsPlane()) return null;
            if (f.Normal is double[] n && n.Length == 3)
            {
                var v = Vec3.From(n);
                if (v.Length > 0.5) return v.Unit();
            }
            return null;
        }

        /// <summary>The face a reference names: {"center"|"point": [x,y,z], "normal"?: [x,y,z]}, in the part's
        /// coordinates. With a normal, only planar faces facing that way count.</summary>
        IFace2 FindFace(List<IBody2> bodies, Dictionary<string, object> r, List<string> notes, Pose? place = null)
        {
            var p = J.V3(r, "point") ?? J.V3(r, "center") ?? throw new UserError("A face reference needs center (or point): " + Json.Write(r));
            var n = J.V3(r, "normal");
            if (place.HasValue)
            {
                p = place.Value.Apply(p);
                if (n.HasValue) n = place.Value.Rotate(n.Value);
            }
            IFace2 best = null;
            var bd = double.MaxValue;
            foreach (var b in bodies)
            foreach (var o in b.GetFaces() as object[] ?? new object[0])
            {
                var f = (IFace2)o;
                if (n.HasValue)
                {
                    var fn = PlanarNormal(f);
                    if (!fn.HasValue || fn.Value.Dot(n.Value.Unit()) < 0.999) continue;
                }
                var d = Dist(f, p, out _);
                if (d < bd)
                {
                    bd = d;
                    best = f;
                }
            }
            var tol = Math.Max(FindTolMm, 0.02 * Size(bodies));
            if (best == null || bd > tol)
                throw new UserError($"No face at {p}{(n.HasValue ? " facing " + n.Value : "")} (nearest {(best == null ? "none" : bd.ToString("0.###") + " mm away")}). " +
                                    "Read the faces with sw_body_topology and pass a ref from it.");
            if (bd > FindTolMm) notes?.Add($"face at {p}: the nearest matching face is {bd:0.###} mm away; used it");
            return best;
        }

        /// <summary>The planar face lying in a sketch's plane (facing its normal) nearest the sketch origin, or null.</summary>
        static IFace2 CoplanarFace(IModelDoc2 m, SketchFrame os)
        {
            IFace2 best = null;
            var bd = double.MaxValue;
            foreach (var b in Bodies(m))
            foreach (var o in b.GetFaces() as object[] ?? new object[0])
            {
                var f = (IFace2)o;
                var fn = PlanarNormal(f);
                if (!fn.HasValue || fn.Value.Dot(os.N) < 0.9999) continue;
                var d = Dist(f, os.O, out var at);
                if (Math.Abs((at - os.O).Dot(os.N)) > 1e-4) continue;
                if (d < bd)
                {
                    bd = d;
                    best = f;
                }
            }
            return best;
        }

        IEdge FindEdge(List<IBody2> bodies, Dictionary<string, object> r, List<string> notes, Pose? place = null)
        {
            var p = J.V3(r, "mid") ?? J.V3(r, "point") ?? throw new UserError("An edge reference needs mid: " + Json.Write(r));
            if (place.HasValue) p = place.Value.Apply(p);
            IEdge best = null;
            var bd = double.MaxValue;
            foreach (var b in bodies)
            foreach (var o in b.GetEdges() as object[] ?? new object[0])
            {
                var e = (IEdge)o;
                var d = Dist(e, p, out _);
                if (d < bd)
                {
                    bd = d;
                    best = e;
                }
            }
            var tol = Math.Max(FindTolMm, 0.02 * Size(bodies));
            if (best == null || bd > tol)
                throw new UserError($"No edge at {p} (nearest {(best == null ? "none" : bd.ToString("0.###") + " mm away")}). Read the edges with sw_body_topology and pass a ref from it.");
            if (bd > FindTolMm) notes?.Add($"edge at {p}: the nearest edge is {bd:0.###} mm away; used it");
            return best;
        }

        bool SelectEntity(IModelDoc2 m, object entity, bool append, int mark)
        {
            var sm = (ISelectionMgr)m.SelectionManager;
            var sd = sm.CreateSelectData() as ISelectData;
            if (sd != null) sd.Mark = mark;
            // sketch items have their own Select4 (they are not IEntity); faces, edges and vertices go through IEntity
            if (entity is ISketchSegment sg) return sg.Select4(append, (SelectData)sd);
            if (entity is ISketchPoint sp) return sp.Select4(append, (SelectData)sd);
            if (entity is IEntity e) return e.Select4(append, (SelectData)sd);
            if (entity is IFeature f) return f.Select2(append, mark);
            if (entity is IComponent2 c) return c.Select4(append, (SelectData)sd, false);
            return false;
        }

        int SelectedCount(IModelDoc2 m) => ((ISelectionMgr)m.SelectionManager).GetSelectedObjectCount2(-1);

        /// <summary>The nth standard plane (1 Front, 2 Top, 3 Right), by position in the tree so the language of
        /// the template does not matter.</summary>
        static IFeature StdPlane(IModelDoc2 m, int which)
        {
            var n = 0;
            var f = m.FirstFeature() as IFeature;
            var guard = 0;
            while (f != null && guard++ < 100000)
            {
                if (f.GetTypeName2() == "RefPlane" && ++n == which) return f;
                f = f.GetNextFeature() as IFeature;
            }
            return null;
        }

        static IFeature OriginFeature(IModelDoc2 m)
        {
            var f = m.FirstFeature() as IFeature;
            var guard = 0;
            while (f != null && guard++ < 100000)
            {
                if (f.GetTypeName2() == "OriginProfileFeature") return f;
                f = f.GetNextFeature() as IFeature;
            }
            return null;
        }

        static IFeature Feature(IModelDoc2 m, string name)
        {
            if (string.IsNullOrEmpty(name)) return null;
            var f = (m is IPartDoc pd ? pd.FeatureByName(name) : m is IAssemblyDoc ad ? ad.FeatureByName(name) : null) as IFeature;
            if (f != null) return f;
            foreach (var x in Tree(m))
            {
                if (string.Equals(x.Name, name, StringComparison.OrdinalIgnoreCase)) return x;
                var s = x.GetFirstSubFeature() as IFeature;
                while (s != null)
                {
                    if (string.Equals(s.Name, name, StringComparison.OrdinalIgnoreCase)) return s;
                    s = s.GetNextSubFeature() as IFeature;
                }
            }
            return null;
        }

        /// <summary>A plane's frame (origin, normal, x) in model mm, from a reference plane feature or a planar face.</summary>
        SketchFrame FrameOf(object planeOrFace)
        {
            if (planeOrFace is IFeature f && f.GetSpecificFeature2() is IRefPlane rp)
            {
                // the corner points are in model coordinates (m): they say where the plane really is, so they decide
                // whether Transform maps plane to model or the other way (the help is not clear on it)
                Vec3? c0 = null, cn = null;
                if (rp.CornerPoints is double[] cp && cp.Length >= 9)
                {
                    var p0 = Vec3.From(cp, 0);
                    var nn = (Vec3.From(cp, 3) - p0).Cross(Vec3.From(cp, 6) - p0);
                    if (nn.Length > 1e-12)
                    {
                        c0 = p0;
                        cn = nn.Unit();
                    }
                }
                var xf = rp.Transform as IMathTransform;
                if (xf != null)
                {
                    foreach (var t in new[] { xf, xf.Inverse() as IMathTransform })
                    {
                        if (t == null) continue;
                        Vec3 apply(Vec3 p) => Vec3.From((double[])((IMathPoint)((IMathPoint)math.CreatePoint(p.Arr())).MultiplyTransform(t)).ArrayData);
                        var o = apply(Vec3.Zero);
                        var x = apply(Vec3.XAxis) - o;
                        var z = apply(Vec3.ZAxis) - o;
                        if (c0.HasValue && (Math.Abs((o - c0.Value).Dot(cn.Value)) > 1e-7 || Math.Abs(z.Unit().Dot(cn.Value)) < 0.9999)) continue;
                        return new SketchFrame(o * 1000, x, z);
                    }
                }
                if (c0.HasValue)
                {
                    Log.Write("plane " + f.Name + ": Transform did not match its corner points; using the corners");
                    return new SketchFrame(c0.Value * 1000, SketchFrame.Perp(cn.Value), cn.Value);
                }
            }
            if (planeOrFace is IFace2 face)
            {
                var n = PlanarNormal(face) ?? throw new UserError("That face is not planar.");
                var s = face.GetSurface() as ISurface;
                var pp = s?.PlaneParams as double[];   // normal (3), root point (3)
                var root = pp != null && pp.Length >= 6 ? Vec3.From(pp, 3) * 1000 : Vec3.Zero;
                return new SketchFrame(root, SketchFrame.Perp(n), n);
            }
            throw new UserError("Not a plane or a planar face.");
        }
    }
}
