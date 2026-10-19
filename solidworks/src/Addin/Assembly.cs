using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using OpenSketch.Sw.Core;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;

namespace OpenSketch.Sw
{
    /// <summary>Components and mates. References are OpenSketch's: each in its component's PART coordinates
    /// (docs/DOCUMENT.md "Mate references"), found on the component's own faces.</summary>
    public sealed partial class Commands
    {
        IModelDoc2 Assembly(Dictionary<string, object> a)
        {
            var m = Doc(a, true);
            if (Kind(m) != "assembly") throw new UserError($"{m.GetTitle()} is a {Kind(m)}, not an assembly.");
            return m;
        }

        /// <summary>A transform SOLIDWORKS reads as p_asm = R p + t, checked with a probe point because the
        /// storage order of its 3x3 part is not something to guess.</summary>
        IMathTransform Transform(Pose pose)
        {
            IMathTransform make(bool transposed)
            {
                var r = pose.R;
                var a = new double[16];
                for (var i = 0; i < 3; i++)
                for (var k = 0; k < 3; k++)
                    a[i * 3 + k] = transposed ? r[k * 3 + i] : r[i * 3 + k];
                a[9] = pose.T.X * Units.M;
                a[10] = pose.T.Y * Units.M;
                a[11] = pose.T.Z * Units.M;
                a[12] = 1;
                return (IMathTransform)math.CreateTransform(a);
            }
            var probe = new Vec3(0.031, -0.017, 0.023);
            var want = pose.Apply(probe * 1000) * Units.M;
            double off(IMathTransform xf)
            {
                var q = Vec3.From((double[])((IMathPoint)((IMathPoint)math.CreatePoint(probe.Arr())).MultiplyTransform(xf)).ArrayData);
                return (q - want).Length;
            }
            var t1 = make(false);
            var t2 = make(true);
            return off(t2) < off(t1) ? t2 : t1;
        }

        Dictionary<string, object> InsertComponent(Dictionary<string, object> a, Journal journal)
        {
            var m = Assembly(a);
            var asm = (IAssemblyDoc)m;
            var part = J.Str(a, "part") ?? throw new UserError("part is missing.");
            var path = part;
            if (!File.Exists(path))
            {
                var open = app.GetOpenDocumentByName(part) as IModelDoc2
                           ?? OpenDocs().FirstOrDefault(d => string.Equals(d.GetTitle(), part, StringComparison.OrdinalIgnoreCase) || Stem(d.GetTitle()) == Stem(part));
                if (open == null) throw new UserError($"No file or open document '{part}'.");
                if (string.IsNullOrEmpty(open.GetPathName())) throw new UserError($"{open.GetTitle()} was never saved: sw_save it with a path first.");
                if (open.GetSaveFlag())
                {
                    int e = 0, w = 0;
                    open.Save3((int)swSaveAsOptions_e.swSaveAsOptions_Silent, ref e, ref w);
                }
                path = open.GetPathName();
            }
            var first = (asm.GetComponentCount(true) == 0);
            // SOLIDWORKS adds a part file as a component only while that part is open
            if (app.GetOpenDocumentByName(path) == null)
            {
                int e = 0, w = 0;
                app.OpenDoc6(path, path.ToLowerInvariant().EndsWith(".sldasm") ? (int)swDocumentTypes_e.swDocASSEMBLY : (int)swDocumentTypes_e.swDocPART,
                             (int)swOpenDocOptions_e.swOpenDocOptions_Silent, "", ref e, ref w);
                Activate(m);
            }
            var c = asm.AddComponent5(path, (int)swAddComponentConfigOptions_e.swAddComponentConfigOptions_CurrentSelectedConfig, "", false, "", 0, 0, 0) as IComponent2;
            if (c == null) throw new UserError($"SOLIDWORKS did not insert {path}.");
            journal?.Component(m, c.Name2);
            var pos = J.V3(a, "position") ?? Vec3.Zero;
            var rot = J.V3(a, "rotation") ?? Vec3.Zero;
            var pose = Pose.FromEuler(pos, rot);
            c.Transform2 = (MathTransform)Transform(pose);
            m.ClearSelection2(true);
            var fix = J.Has(a, "fixed") ? J.Bool(a, "fixed") : first;
            if (c.Select4(false, null, false))
            {
                if (fix) asm.FixComponent();
                else asm.UnfixComponent();
            }
            m.ClearSelection2(true);
            m.EditRebuild3();
            var now = PoseOf(c);
            return J.O("doc", Ref(m), "component", c.Name2, "file", path, "fixed", c.IsFixed(),
                       "position", J.Pt(now.T, 4), "matrix", now.ToList12(),
                       "placed_as_asked", (now.T - pose.T).Length < 1e-3 ? (object)true : J.O("asked", J.Pt(pose.T), "got", J.Pt(now.T)));
        }

        // ------------------------------------------------------------------------- mate references

        sealed class MateRef
        {
            public object Entity;       // face, edge, vertex, plane feature or component
            public string What;
            public IComponent2 Comp;
        }

        static Dictionary<string, object> Ent(Dictionary<string, object> r, out string kind)
        {
            foreach (var k in new[] { "plane", "axis", "face", "edge" })
            {
                var o = J.Obj(r, k);
                if (o != null)
                {
                    kind = k;
                    return o;
                }
            }
            kind = J.Has(r, "point") ? "point" : J.Has(r, "ref") ? "ref" : null;
            return r;
        }

        List<IBody2> CompBodies(IComponent2 c)
        {
            var o = new List<IBody2>();
            object info;
            if (c.GetBodies3((int)swBodyType_e.swSolidBody, out info) is object[] bs)
                foreach (var b in bs)
                    if (b is IBody2 body) o.Add(body);
            return o;
        }

        /// <summary>A mate reference, found on its component (its faces as they sit in the assembly).</summary>
        MateRef Resolve(IModelDoc2 asmDoc, Dictionary<string, object> r)
        {
            var cname = J.Str(r, "component");
            var e = Ent(r, out var kind);
            if (cname == null)
            {
                var std = SketchFrame.StdIndex(J.Str(r, "ref"));
                if (std == 0) throw new UserError("A reference without component must be the assembly's Front, Top or Right Plane.");
                return new MateRef { Entity = StdPlane(asmDoc, std), What = "assembly " + J.Str(r, "ref") };
            }
            var c = Component(asmDoc, cname);
            if (kind == "ref")
            {
                var std = SketchFrame.StdIndex(J.Str(r, "ref"));
                var pm = c.GetModelDoc2() as IModelDoc2 ?? throw new UserError($"{cname} is lightweight: resolve it first.");
                if (std == 0) throw new UserError($"Named references are Front Plane, Top Plane or Right Plane; got {J.Str(r, "ref")}.");
                var pf = StdPlane(pm, std);
                var inAsm = c.FeatureByName(pf.Name) as IFeature;
                return new MateRef { Entity = inAsm ?? (object)pf, What = $"{cname} {pf.Name}", Comp = c };
            }
            var bodies = CompBodies(c);
            if (bodies.Count == 0) throw new UserError($"{cname} has no solid body.");
            var pose = PoseOf(c);
            // component bodies may report their geometry in part or in assembly coordinates: try part first
            foreach (var place in new Pose?[] { null, pose })
            {
                try
                {
                    switch (kind)
                    {
                        case "plane":
                            var pt = J.V3(e, "point") ?? J.V3(e, "center");
                            var fc = FindFace(bodies, J.O("center", pt.HasValue ? J.Pt(pt.Value, 9) : null, "normal", J.Arr(e, "normal")), null, place);
                            return new MateRef { Entity = fc, What = $"{cname} plane", Comp = c };
                        case "face":
                            return new MateRef { Entity = FindFace(bodies, e, null, place), What = $"{cname} face", Comp = c };
                        case "axis":
                            return new MateRef { Entity = FindRound(bodies, e, place), What = $"{cname} axis", Comp = c };
                        case "edge":
                            return new MateRef { Entity = FindEdge(bodies, e, null, place), What = $"{cname} edge", Comp = c };
                        case "point":
                            var p = J.V3(r, "point").Value;
                            if (place.HasValue) p = place.Value.Apply(p);
                            return new MateRef { Entity = FindVertex(bodies, p), What = $"{cname} point", Comp = c };
                    }
                }
                catch (UserError) when (place == null)
                {
                }
            }
            throw new UserError($"Could not find {kind} {Json.Write(e)} on {cname}. Read its faces with sw_body_topology component={cname}.");
        }

        /// <summary>The cylindrical or conical face whose axis is the given one (point on it, direction).</summary>
        IFace2 FindRound(List<IBody2> bodies, Dictionary<string, object> axis, Pose? place)
        {
            var p = J.V3(axis, "point") ?? throw new UserError("An axis needs point and dir.");
            var d = (J.V3(axis, "dir") ?? throw new UserError("An axis needs point and dir.")).Unit();
            if (place.HasValue)
            {
                p = place.Value.Apply(p);
                d = place.Value.Rotate(d);
            }
            IFace2 best = null;
            var bd = double.MaxValue;
            foreach (var b in bodies)
            foreach (var o in b.GetFaces() as object[] ?? new object[0])
            {
                var f = (IFace2)o;
                var s = f.GetSurface() as ISurface;
                double[] prm = null;
                if (s == null) continue;
                if (s.IsCylinder()) prm = s.CylinderParams as double[];
                else if (s.IsCone()) prm = s.ConeParams as double[];
                if (prm == null || prm.Length < 6) continue;
                var o3 = Vec3.From(prm) * 1000;
                var ax = Vec3.From(prm, 3).Unit();
                if (Math.Abs(Math.Abs(ax.Dot(d)) - 1) > 1e-6) continue;
                var off = (p - o3).Cross(ax).Length;     // distance of the given point from this face's axis
                if (off < bd)
                {
                    bd = off;
                    best = f;
                }
            }
            if (best == null || bd > 0.02) throw new UserError($"No round face with the axis through {p} along {d}.");
            return best;
        }

        // ------------------------------------------------------------------------- mates

        static int MateAlign(string a)
        {
            switch (a)
            {
                case "aligned": return (int)swMateAlign_e.swMateAlignALIGNED;
                case "anti": return (int)swMateAlign_e.swMateAlignANTI_ALIGNED;
                default: return (int)swMateAlign_e.swMateAlignCLOSEST;
            }
        }

        Dictionary<string, object> AddMate(Dictionary<string, object> a, Journal journal)
        {
            var m = Assembly(a);
            var asm = (IAssemblyDoc)m;
            var mate = J.Obj(a, "mate") ?? a;
            var type = J.Str(mate, "type") ?? throw new UserError("type is missing.");
            var refs = (J.Arr(mate, "refs") ?? new List<object>()).Select(o => J.Obj(o)).ToList();
            var align = J.Str(mate, "align", "auto");
            var flip = J.Bool(mate, "flip");
            if (type == "hinge") return Hinge(m, mate, journal);
            if (refs.Count != 2 || refs.Any(x => x == null)) throw new UserError("A mate takes two refs.");
            var r0 = Resolve(m, refs[0]);
            var r1 = Resolve(m, refs[1]);
            int swType;
            double dist = 0, distHi = 0, distLo = 0, ang = 0, angHi = 0, angLo = 0;
            switch (type)
            {
                case "coincident": swType = (int)swMateType_e.swMateCOINCIDENT; break;
                case "concentric": swType = (int)swMateType_e.swMateCONCENTRIC; break;
                case "parallel": swType = (int)swMateType_e.swMatePARALLEL; break;
                case "perpendicular": swType = (int)swMateType_e.swMatePERPENDICULAR; break;
                case "lock": swType = (int)swMateType_e.swMateLOCK; break;
                case "distance":
                    swType = (int)swMateType_e.swMateDISTANCE;
                    dist = J.Num(mate, "value") * Units.M;
                    distHi = distLo = dist;
                    break;
                case "angle":
                    swType = (int)swMateType_e.swMateANGLE;
                    ang = Units.Rad(J.Num(mate, "value"));
                    angHi = angLo = ang;
                    break;
                case "limit_distance":
                    swType = (int)swMateType_e.swMateDISTANCE;
                    distLo = J.Num(mate, "min") * Units.M;
                    distHi = J.Num(mate, "max") * Units.M;
                    dist = (distLo + distHi) / 2;
                    break;
                case "limit_angle":
                    swType = (int)swMateType_e.swMateANGLE;
                    angLo = Units.Rad(J.Num(mate, "min"));
                    angHi = Units.Rad(J.Num(mate, "max"));
                    ang = (angLo + angHi) / 2;
                    break;
                default:
                    throw new UserError($"{type} mates are not made in SOLIDWORKS by this add-in (coupler and contact are OpenSketch-only).");
            }
            var aligns = new List<string> { align };
            foreach (var x in new[] { "anti", "aligned", "auto" })
                if (!aligns.Contains(x)) aligns.Add(x);
            if (type == "concentric" || type == "lock") aligns = new List<string> { align };
            var tried = "";
            foreach (var al in aligns)
            {
                m.ClearSelection2(true);
                if (!SelectEntity(m, r0.Entity, false, 1) || !SelectEntity(m, r1.Entity, true, 1))
                    throw new UserError($"Could not select {r0.What} and {r1.What}.");
                var err = 0;
                var mt = asm.AddMate5(swType, MateAlign(al), flip, dist, distHi, distLo, 1, 1, ang, angHi, angLo, false, false, 0, out err) as IMate2;
                m.ClearSelection2(true);
                if (mt == null || err != (int)swAddMateError_e.swAddMateError_NoError)
                {
                    tried += $" {al}: {Enum.GetName(typeof(swAddMateError_e), err) ?? err.ToString()};";
                    var last = m.Extension.GetLastFeatureAdded() as IFeature;
                    if (mt != null && last != null && last.GetSpecificFeature2() is IMate2) DeleteFeature(m, last.Name, false);
                    continue;
                }
                m.EditRebuild3();
                var mf = (IFeature)mt;
                var code = mf.GetErrorCode2(out var warn);
                if (code != 0 && !warn)
                {
                    tried += $" {al}: {ErrorText(code)};";
                    DeleteFeature(m, mf.Name, false);
                    m.EditRebuild3();
                    continue;
                }
                var name = J.Str(mate, "name");
                if (!string.IsNullOrEmpty(name))
                {
                    try
                    {
                        mf.Name = name;
                    }
                    catch (Exception)
                    {
                    }
                }
                journal?.Feature(m, mf.Name);
                return J.O("doc", Ref(m), "mate", mf.Name, "type", type, "align", al, "state", code != 0 ? "warning" : "ok",
                           "reason", code != 0 ? ErrorText(code) : null, "between", J.L(r0.What, r1.What),
                           "tried", tried.Length > 0 ? tried.Trim() : null,
                           "components", MatedPlaces(m, r0.Comp, r1.Comp));
            }
            throw new UserError($"SOLIDWORKS would not make the {type} mate between {r0.What} and {r1.What}:{tried}");
        }

        List<object> MatedPlaces(IModelDoc2 m, params IComponent2[] cs)
        {
            var o = new List<object>();
            foreach (var c in cs)
                if (c != null)
                {
                    var p = PoseOf(c);
                    o.Add(J.O("component", c.Name2, "position", J.Pt(p.T, 4), "matrix", p.ToList12()));
                }
            return o;
        }

        /// <summary>SOLIDWORKS' Hinge mechanical mate: two axes (concentric), optionally two faces that stay
        /// together (coincident) and an angle limit between two planes.</summary>
        Dictionary<string, object> Hinge(IModelDoc2 m, Dictionary<string, object> mate, Journal journal)
        {
            var refs = (J.Arr(mate, "refs") ?? new List<object>()).Select(o => J.Obj(o)).ToList();
            if (refs.Count != 2) throw new UserError("A hinge takes two axes in refs.");
            var made = new List<object>();
            var sub = J.O("type", "concentric", "refs", J.Arr(mate, "refs"), "align", J.Str(mate, "align", "auto"));
            made.Add(AddMate(J.O("doc", Ref(m), "mate", sub), journal));
            var planes = J.Arr(mate, "planes");
            if (planes != null && planes.Count == 2)
                made.Add(AddMate(J.O("doc", Ref(m), "mate", J.O("type", "coincident", "refs", planes, "align", "anti")), journal));
            var ar = J.Arr(mate, "angle_refs");
            if (ar != null && ar.Count == 2 && J.Has(mate, "angle_min") && J.Has(mate, "angle_max"))
                made.Add(AddMate(J.O("doc", Ref(m), "mate", J.O("type", "limit_angle", "refs", ar, "min", J.Num(mate, "angle_min"), "max", J.Num(mate, "angle_max"))), journal));
            return J.O("doc", Ref(m), "type", "hinge", "made_as", made,
                       "note", "Made as its standard mates (concentric, coincident, angle limit), which hold the same motion as a Hinge mate.");
        }
    }
}
