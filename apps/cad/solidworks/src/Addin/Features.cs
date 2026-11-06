using System;
using System.Collections.Generic;
using System.Linq;
using OpenSketch.Sw.Core;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;

namespace OpenSketch.Sw
{
    /// <summary>
    /// OpenSketch features as native SOLIDWORKS features. Each one is made, then measured: the volume change and,
    /// for extrudes, where the new faces lie along the sketch normal, against what the server's own kernel made of
    /// the same feature on the same body (the "expect" the server sends). Where SOLIDWORKS read a direction flag the
    /// other way, the feature is deleted and made again flipped.
    /// </summary>
    public sealed partial class Commands
    {
        /// <summary>One add_features call (or one batch): the document, what was made so far, by OpenSketch id.</summary>
        sealed class Ctx
        {
            public IModelDoc2 Doc;
            public Journal Journal;
            public readonly Dictionary<string, string> Names = new Dictionary<string, string>();       // OpenSketch id -> SOLIDWORKS name
            public readonly Dictionary<string, SketchMade> Sketches = new Dictionary<string, SketchMade>();
            public readonly Dictionary<string, (IFeature f, SketchFrame os)> Planes = new Dictionary<string, (IFeature, SketchFrame)>();
            public readonly List<(string target, string expr)> Equations = new List<(string, string)>();
            public readonly Dictionary<string, IFeature> Axes = new Dictionary<string, IFeature>();
            public int Holes;
            public readonly Dictionary<string, List<string>> Multi = new Dictionary<string, List<string>>(); // id -> every feature it became (holes)
        }

        Dictionary<string, object> AddFeatures(Dictionary<string, object> a, Journal journal)
        {
            var m = PartDoc(a, out var owner);
            var c = new Ctx { Doc = m, Journal = journal };
            var feats = J.Arr(a, "features") ?? throw new UserError("features is missing.");
            var rows = new List<object>();
            var summary = J.Str(a, "summary");
            var stopped = (string)null;
            var cancelled = false;
            m.Extension.StartRecordingUndoObject();
            try
            {
                foreach (var o in feats)
                {
                    if (Bridge.CommandContext.Current?.CancelRequested == true)
                    {
                        cancelled = true;
                        break;
                    }
                    Bridge.CommandContext.Progress(rows.Count, feats.Count, J.Str(J.Obj(o), "id"));
                    var f = J.Obj(o) ?? throw new UserError("Each feature must be an object.");
                    var row = J.O("id", J.Str(f, "id"), "type", J.Str(f, "type"));
                    rows.Add(row);
                    try
                    {
                        BuildFeature(c, f, row);
                    }
                    catch (UserError ex)
                    {
                        row["state"] = "error";
                        row["reason"] = ex.Message;
                    }
                    catch (Exception ex)
                    {
                        row["state"] = "error";
                        row["reason"] = BridgeClient.Describe(ex);
                        Log.Write("feature " + J.Str(f, "id") + ": " + ex);
                    }
                    finally
                    {
                        ExitSketchIfOpen(m);
                        m.ClearSelection2(true);
                    }
                    if (J.Str(row, "state") == "error")
                    {
                        stopped = $"{J.Str(row, "id")} ({J.Str(row, "type")}): {J.Str(row, "reason")}";
                        break;
                    }
                }
                ApplyEquations(c, rows);
            }
            finally
            {
                m.Extension.FinishRecordingUndoObject2("BIZOMAT: " + (string.IsNullOrEmpty(summary) ? feats.Count + " features" : summary), false);
            }
            m.EditRebuild3();
            if (owner != null)
            {
                Activate(owner);
                owner.EditRebuild3();
            }
            var res = J.O("doc", Ref(m), "title", m.GetTitle(), "features", rows, "body", Body(m),
                          "made", rows.Count(r => J.Str((Dictionary<string, object>)r, "state") != "error"), "of", feats.Count);
            if (owner != null) res["note"] = $"Edited in its own window; the assembly {owner.GetTitle()} was rebuilt. Save the part with sw_save.";
            if (stopped != null)
            {
                res["stopped_at"] = stopped;
                throw new UserError("Stopped at " + stopped + ". The features before it were made and kept.", res);
            }
            if (cancelled)
                throw new UserError($"Cancelled at the AI app's request after {rows.Count} of {feats.Count} features; the ones made were kept.", "CANCELLED", res);
            return res;
        }

        static void ExitSketchIfOpen(IModelDoc2 m)
        {
            try
            {
                if (m.SketchManager.ActiveSketch != null) m.SketchManager.InsertSketch(true);
            }
            catch (Exception)
            {
            }
        }

        void BuildFeature(Ctx c, Dictionary<string, object> f, Dictionary<string, object> row)
        {
            var type = J.Str(f, "type");
            var id = J.Str(f, "id");
            if (J.Bool(f, "suppressed")) row["note"] = "suppressed features are made, then suppressed";
            var v0 = Volume(c.Doc, out _);
            switch (type)
            {
                case "sketch":
                    var sk = DrawSketch(c, f, row);
                    if (id != null) c.Sketches[id] = sk;
                    Done(c, id, sk.Name);
                    return;
                case "plane": Plane(c, f, row); break;
                case "extrude": Extrude(c, f, row); break;
                case "revolve": Revolve(c, f, row); break;
                case "fillet": Fillet(c, f, row); break;
                case "chamfer": Chamfer(c, f, row); break;
                case "shell": Shell(c, f, row); break;
                case "draft": Draft(c, f, row); break;
                case "mirror": Mirror(c, f, row); break;
                case "linear_pattern": LinearPattern(c, f, row); break;
                case "circular_pattern": CircularPattern(c, f, row); break;
                case "hole": Hole(c, f, row); break;
                case "sweep": Sweep(c, f, row); break;
                case "loft": Loft(c, f, row); break;
                case "import":
                case "standard":
                    throw new UserError($"{type} features come from files here: use sw_import or sw_standard_part.");
                default:
                    throw new UserError($"{type} is not a feature type the add-in can make.");
            }
            var name = J.Str(row, "name");
            if (name != null)
            {
                var feat = Feature(c.Doc, name);
                var want = J.Str(f, "name");
                if (feat != null && !string.IsNullOrEmpty(want) && want != name && type != "hole")
                {
                    try
                    {
                        feat.Name = want;
                        row["name"] = feat.Name;
                    }
                    catch (Exception)
                    {
                    }
                }
                if (feat != null && J.Bool(f, "suppressed"))
                {
                    c.Doc.ClearSelection2(true);
                    feat.Select2(false, 0);
                    c.Doc.EditSuppress2();
                }
                foreach (var kv in J.Obj(f, "eq") ?? new Dictionary<string, object>())
                    c.Equations.Add((J.Str(row, "name") + "." + kv.Key, kv.Value as string));
                Done(c, id, J.Str(row, "name"));
            }
            if (type != "plane")
            {
                var v1 = Volume(c.Doc, out var solids);
                row["volume_change_mm3"] = R(v1 - v0, 3);
                row["solids"] = solids;
                var bb = Box(Bodies(c.Doc));
                if (bb != null) row["bbox"] = bb;
                var ex = J.Obj(f, "expect");
                if (ex != null && J.Has(ex, "dv"))
                {
                    var want = J.Num(ex, "dv");
                    row["predicted_volume_change_mm3"] = R(want, 3);
                    if (!SameVolume(v1 - v0, want, v1, type))
                    {
                        row["state"] = J.Str(row, "state") == "error" ? "error" : "warning";
                        Note(row, $"volume change {v1 - v0:0.###} mm3, CAD Automation predicted {want:0.###} mm3: check it");
                    }
                }
            }
            if (!row.ContainsKey("state")) row["state"] = "ok";
        }

        void Done(Ctx c, string id, string name)
        {
            if (id != null && name != null) c.Names[id] = name;
            if (name != null) c.Journal?.Feature(c.Doc, name);
        }

        static void Note(Dictionary<string, object> row, string s)
        {
            if (!(row.TryGetValue("notes", out var o) && o is List<string> l)) row["notes"] = l = new List<string>();
            l.Add(s);
        }

        /// <summary>The same volume change, within what SOLIDWORKS and OpenCascade differ by (fillets and drafts
        /// a little more).</summary>
        static bool SameVolume(double got, double want, double total, string type)
        {
            var tol = 0.05 + 2e-5 * Math.Abs(total);
            if (type == "fillet" || type == "chamfer" || type == "draft" || type == "shell" || type == "loft" || type == "sweep")
                tol += 0.02 * Math.Abs(want);
            return Math.Abs(got - want) <= tol;
        }

        // ------------------------------------------------------------------------- references

        /// <summary>A feature an OpenSketch feature names: an id made earlier in this call, or a SOLIDWORKS name.</summary>
        IFeature Named(Ctx c, string idOrName, string what)
        {
            if (string.IsNullOrEmpty(idOrName)) throw new UserError($"{what} is missing.");
            var name = c.Names.TryGetValue(idOrName, out var n) ? n : idOrName;
            return Feature(c.Doc, name) ?? throw new UserError($"No {what} '{idOrName}' (made in this call or in the SOLIDWORKS tree).");
        }

        /// <summary>A sketch for an extrude, revolve, sweep or loft: one made in this call, or one in the tree.</summary>
        SketchMade SketchFor(Ctx c, string idOrName)
        {
            if (idOrName != null && c.Sketches.TryGetValue(idOrName, out var s)) return s;
            var f = Named(c, idOrName, "sketch");
            if (f.GetTypeName2() != "ProfileFeature" && f.GetTypeName2() != "3DProfileFeature")
                throw new UserError($"{f.Name} is not a sketch.");
            var sk = (ISketch)f.GetSpecificFeature2();
            var toModel = (IMathTransform)((IMathTransform)sk.ModelToSketchTransform).Inverse();
            Vec3 tm(double x, double y, double z) => Vec3.From((double[])((IMathPoint)((IMathPoint)math.CreatePoint(new[] { x, y, z })).MultiplyTransform(toModel)).ArrayData) * 1000;
            var o = tm(0, 0, 0);
            var frame = new SketchFrame(o, tm(1, 0, 0) - o, tm(0, 0, 1) - o);
            var made = new SketchMade { Name = f.Name, Feature = f, Os = frame, SwNormal = frame.N, ToModel = (u, v) => frame.ToModel(u, v) };
            // its curves by the ids sw_get_document gives (s1, s2, ... in SOLIDWORKS' order)
            var k = 0;
            foreach (var seg in sk.GetSketchSegments() as object[] ?? new object[0]) made.Segs["s" + (++k)] = (ISketchSegment)seg;
            return made;
        }

        PlaneTarget ResolvePlane(Ctx c, Dictionary<string, object> spec, Dictionary<string, object> predicted)
        {
            var r = J.Str(spec, "ref");
            if (r != null)
            {
                var std = SketchFrame.StdIndex(r);
                if (std > 0) return new PlaneTarget { Entity = StdPlane(c.Doc, std), Os = SketchFrame.Std(std) };
                if (c.Planes.TryGetValue(r, out var pl)) return new PlaneTarget { Entity = pl.f, Os = pl.os };
                if (c.Sketches.TryGetValue(r, out var sk))
                {
                    // a face may have been rebuilt since: find it again, but only in the same plane as the sketch
                    if (sk.PlaneEntity is IFace2 && CoplanarFace(c.Doc, sk.Os) is IFace2 again)
                        return new PlaneTarget { Entity = again, Os = sk.Os };
                    return new PlaneTarget { Entity = sk.PlaneEntity, Os = sk.Os };
                }
                var f = Named(c, r, "plane");
                if (f.GetTypeName2() == "RefPlane") return new PlaneTarget { Entity = f, Os = FrameOf(f) };
                if (f.GetTypeName2() == "ProfileFeature")
                {
                    var s2 = SketchFor(c, f.Name);
                    throw new UserError($"To sketch on the plane of {f.Name}, give that plane (or face) itself.");
                }
                throw new UserError($"{r} is not a plane.");
            }
            var origin = J.V3(spec, "origin") ?? throw new UserError("A face or fixed plane needs origin, normal and xdir.");
            var normal = (J.V3(spec, "normal") ?? throw new UserError("The plane needs a normal.")).Unit();
            var xdir = J.V3(spec, "xdir") ?? SketchFrame.Perp(normal);
            var mode = J.Str(spec, "type", "fixed");
            if (mode == "face")
            {
                // the planar face facing that way nearest the stored origin, as OpenSketch finds it again
                var bodies = Bodies(c.Doc);
                IFace2 best = null;
                var bd = double.MaxValue;
                foreach (var b in bodies)
                foreach (var o in b.GetFaces() as object[] ?? new object[0])
                {
                    var fc = (IFace2)o;
                    var fn = PlanarNormal(fc);
                    if (!fn.HasValue || fn.Value.Dot(normal) < 0.9999) continue;
                    var d = Dist(fc, origin, out _);
                    if (d < bd)
                    {
                        bd = d;
                        best = fc;
                    }
                }
                if (best == null) throw new UserError($"No planar face faces {normal}. Read the faces with sw_body_topology.");
                Dist(best, origin, out var on);
                var o2 = origin + normal * (on - origin).Dot(normal);
                var target = new PlaneTarget { Entity = best, Os = new SketchFrame(o2, xdir, normal) };
                if ((o2 - origin).Length > 1e-6) target.Note = $"the face is {(o2 - origin).Length:0.###} mm from the stored origin; the sketch follows the face";
                return target;
            }
            // fixed: an offset plane from Front, Top or Right
            for (var k = 1; k <= 3; k++)
            {
                var sf = SketchFrame.Std(k);
                var dot = sf.N.Dot(normal);
                if (Math.Abs(Math.Abs(dot) - 1) > 1e-9) continue;
                var dist = origin.Dot(sf.N);
                var basePlane = StdPlane(c.Doc, k);
                if (Math.Abs(dist) < 1e-9) return new PlaneTarget { Entity = basePlane, Os = new SketchFrame(origin, xdir, normal) };
                var pf = OffsetPlane(c, basePlane, sf, dist);
                return new PlaneTarget { Entity = pf, Os = new SketchFrame(origin, xdir, normal) };
            }
            throw new UserError("A fixed sketch plane must be parallel to Front, Top or Right here. For another angle, make a `plane` feature (offset from a face or plane) and sketch on its id.");
        }

        // ------------------------------------------------------------------------- planes

        /// <summary>A reference plane at a signed distance along a base plane's normal; made, then checked where
        /// SOLIDWORKS put it, and made again flipped if it went to the other side.</summary>
        IFeature OffsetPlane(Ctx c, object basePlane, SketchFrame baseFrame, double distMm)
        {
            var m = c.Doc;
            var want = baseFrame.O + baseFrame.N * distMm;
            for (var t = 0; t < 2; t++)
            {
                m.ClearSelection2(true);
                if (!SelectEntity(m, basePlane, false, 0)) throw new UserError("Could not select the base plane.");
                var cons = (int)swRefPlaneReferenceConstraints_e.swRefPlaneReferenceConstraint_Distance;
                if (t == 1 ^ distMm < 0) cons |= (int)swRefPlaneReferenceConstraints_e.swRefPlaneReferenceConstraint_OptionFlip;
                var pf = m.FeatureManager.InsertRefPlane(cons, Math.Abs(distMm) * Units.M, 0, 0, 0, 0) as IFeature;
                m.ClearSelection2(true);
                if (pf == null) continue;
                var fr = FrameOf(pf);
                if (Math.Abs((fr.O - want).Dot(baseFrame.N)) < 1e-4)
                {
                    c.Journal?.Feature(m, pf.Name);
                    return pf;
                }
                DeleteFeature(m, pf.Name, false);
            }
            throw new UserError($"SOLIDWORKS did not make a plane {distMm} mm from the base plane.");
        }

        void Plane(Ctx c, Dictionary<string, object> f, Dictionary<string, object> row)
        {
            var baseSpec = J.Obj(f, "base") ?? J.O("ref", "Front Plane");
            var target = ResolvePlane(c, baseSpec, null);
            var off = J.Num(f, "offset") * (J.Bool(f, "flip") ? -1 : 1);
            IFeature pf;
            SketchFrame os;
            if (Math.Abs(off) < 1e-9)
            {
                // a plane on the base itself: SOLIDWORKS needs some offset or a coincident plane
                c.Doc.ClearSelection2(true);
                if (!SelectEntity(c.Doc, target.Entity, false, 0)) throw new UserError("Could not select the base plane.");
                pf = c.Doc.FeatureManager.InsertRefPlane((int)swRefPlaneReferenceConstraints_e.swRefPlaneReferenceConstraint_Coincident, 0, 0, 0, 0, 0) as IFeature
                     ?? throw new UserError("SOLIDWORKS did not make the plane.");
                c.Journal?.Feature(c.Doc, pf.Name);
                os = target.Os;
            }
            else
            {
                pf = OffsetPlane(c, target.Entity, target.Os, off);
                os = new SketchFrame(target.Os.O + target.Os.N * off, target.Os.X, J.Bool(f, "flip") ? -target.Os.N : target.Os.N);
            }
            if (J.Str(f, "id") != null) c.Planes[J.Str(f, "id")] = (pf, os);
            row["name"] = pf.Name;
            row["origin"] = J.Pt(os.O, 4);
            row["normal"] = J.Pt(os.N, 6);
        }

        // ------------------------------------------------------------------------- extrudes

        static int EndCond(string end)
        {
            switch (end ?? "blind")
            {
                case "blind": return (int)swEndConditions_e.swEndCondBlind;
                case "through_all": return (int)swEndConditions_e.swEndCondThroughAll;
                case "up_to_next": return (int)swEndConditions_e.swEndCondUpToNext;
                case "midplane": return (int)swEndConditions_e.swEndCondMidPlane;
                default: throw new UserError($"Unknown end condition {end}; use blind, through_all, up_to_next or midplane.");
            }
        }

        /// <summary>Where the faces a feature made lie along a direction, measured from a point (mm): (min, max).</summary>
        static (double lo, double hi)? Span(IFeature feat, Vec3 from, Vec3 dir)
        {
            double lo = double.MaxValue, hi = double.MinValue;
            foreach (var o in feat.GetFaces() as object[] ?? new object[0])
            {
                if (!(o is IFace2 fc) || !(fc.GetBox() is double[] b) || b.Length < 6) continue;
                for (var i = 0; i < 8; i++)
                {
                    var p = new Vec3(b[(i & 1) == 0 ? 0 : 3], b[(i & 2) == 0 ? 1 : 4], b[(i & 4) == 0 ? 2 : 5]) * 1000;
                    var t = (p - from).Dot(dir);
                    lo = Math.Min(lo, t);
                    hi = Math.Max(hi, t);
                }
            }
            if (lo > hi) return null;
            return (lo, hi);
        }

        void Extrude(Ctx c, Dictionary<string, object> f, Dictionary<string, object> row)
        {
            var m = c.Doc;
            var sk = SketchFor(c, J.Str(f, "sketch"));
            var cut = J.Str(f, "op", "boss") == "cut";
            var end = J.Str(f, "end", "blind");
            var depth = J.Num(f, "depth", 10);
            var e = sk.Os.N * (J.Bool(f, "reverse") ? -1 : 1);     // OpenSketch: depth runs along this
            var d2 = J.Obj(f, "dir2");
            var mid = end == "midplane";
            var two = d2 != null && !mid;
            var draft = J.Num(f, "draft");
            var draftIn = !J.Bool(f, "draft_outward");
            var merge = J.Bool(f, "merge", true);
            var flipSide = cut && J.Bool(f, "flip_side");
            if (end != "through_all" && end != "up_to_next" && depth <= 0) throw new UserError("depth must be greater than 0.");
            // SOLIDWORKS makes a boss along its sketch normal and a cut against it unless Dir is set
            var along = e.Dot(sk.SwNormal) > 0;
            var dirFirst = cut ? along : !along;
            var t1 = EndCond(end);
            var t2 = two ? EndCond(J.Str(d2, "end", "blind")) : (int)swEndConditions_e.swEndCondBlind;
            var dd1 = depth * Units.M;
            var dd2 = two ? J.Num(d2, "depth", 10) * Units.M : 0.01;
            var ang = Units.Rad(draft);
            var depth2 = two ? J.Num(d2, "depth", 10) : 0;
            IFeature make(int t)
            {
                var dir = dirFirst ^ (t == 1);
                m.ClearSelection2(true);
                if (!SelectEntity(m, sk.Feature, false, 0)) throw new UserError($"Could not select {sk.Name}.");
                IFeature feat;
                if (cut)
                    feat = m.FeatureManager.FeatureCut4(!two, flipSide, dir, t1, t2, dd1, dd2, draft > 0, false, draftIn, false, ang, 0,
                                                        false, false, false, false, false, true, true, true, true, false,
                                                        (int)swStartConditions_e.swStartSketchPlane, 0, false, false) as IFeature;
                else
                    feat = m.FeatureManager.FeatureExtrusion3(!two, false, dir, t1, t2, dd1, dd2, draft > 0, false, draftIn, false, ang, 0,
                                                              false, false, false, false, merge, true, true,
                                                              (int)swStartConditions_e.swStartSketchPlane, 0, false) as IFeature;
                m.ClearSelection2(true);
                if (feat != null) row["sw"] = J.O("Dir", dir);
                return feat;
            }
            string looks(IFeature feat)
            {
                // without a prediction: the faces it made must reach out along e from the sketch plane
                if (mid || flipSide) return null;
                var span = Span(feat, sk.Os.O, e);
                if (!span.HasValue) return cut ? "cut nothing" : "made no faces";
                var (lo, hi) = span.Value;
                var tol = Math.Max(0.02, 0.002 * Math.Max(depth, 1));
                if (two && Math.Abs(depth - depth2) > 2 * tol)
                    return Math.Abs(hi - depth) <= Math.Abs(hi - depth2) ? null : "the two directions came out swapped";
                if (hi <= tol && lo < -tol) return $"went the other way (its faces lie {lo:0.##} to {hi:0.##} mm along the direction)";
                return null;
            }
            Variants(c, f, row, cut ? "cut" : "boss", mid ? 1 : 2, make, looks, cut ? -1 : merge ? 1 : 0);
        }

        /// <summary>
        /// Makes a feature one way, then the other: the first one that SOLIDWORKS makes without error and that matches
        /// the prediction (volume change and body box) is kept. Without a prediction, `looks` judges (null = right).
        /// If no way matches the prediction, the closest one is made again and kept with a warning.
        /// sign: +1 must add material, -1 must remove some, 0 either.
        /// </summary>
        void Variants(Ctx c, Dictionary<string, object> f, Dictionary<string, object> row, string what, int count,
                      Func<int, IFeature> make, Func<IFeature, string> looks, int sign)
        {
            var m = c.Doc;
            var v0 = Volume(m, out _);
            var ex = J.Obj(f, "expect");
            var predicted = ex != null && (J.Has(ex, "dv") || J.Has(ex, "bbox"));
            var scores = new double[count];
            var tried = "";
            for (var t = 0; t < count; t++)
            {
                scores[t] = double.MaxValue;
                IFeature feat;
                try
                {
                    feat = make(t);
                }
                catch (UserError)
                {
                    throw;
                }
                catch (Exception exn)
                {
                    tried += $" way {t + 1}: {exn.Message};";
                    continue;
                }
                if (feat == null)
                {
                    tried += $" way {t + 1}: SOLIDWORKS made nothing;";
                    continue;
                }
                var code = feat.GetErrorCode2(out var warn);
                string why = null;
                if (code != 0 && !warn) why = ErrorText(code);
                var v1 = Volume(m, out _);
                if (why == null && sign != 0 && (v1 - v0) * sign <= 1e-6 && !(predicted && J.Has(ex, "dv") && Math.Abs(J.Num(ex, "dv")) < 1e-6))
                    why = sign > 0 ? "added no material" : "removed no material";
                if (why == null && predicted)
                {
                    scores[t] = Mismatch(m, ex, v1 - v0, v1);
                    if (scores[t] > 1) why = $"does not match the prediction (volume change {v1 - v0:0.###} mm3, predicted {J.Num(ex, "dv"):0.###})";
                }
                else if (why == null) why = looks?.Invoke(feat);
                if (why == null)
                {
                    row["name"] = feat.Name;
                    if (t > 0) Note(row, $"made the other way round after:{tried}");
                    WarnIfAny(feat, row);
                    return;
                }
                tried += $" way {t + 1}: {why};";
                DeleteFeature(m, feat.Name, false);
            }
            var best = Array.IndexOf(scores, scores.Min());
            if (predicted && scores[best] < double.MaxValue)
            {
                IFeature feat = null;
                try
                {
                    feat = make(best);
                }
                catch (Exception exn) when (!(exn is UserError))
                {
                    tried += $" remaking way {best + 1}: {exn.Message};";
                }
                if (feat != null)
                {
                    row["name"] = feat.Name;
                    row["state"] = "warning";
                    Note(row, $"no way matched the CAD Automation prediction; kept the closest:{tried}");
                    WarnIfAny(feat, row);
                    return;
                }
            }
            throw new UserError($"SOLIDWORKS could not make the {what} as meant:{tried}");
        }

        /// <summary>How far a result is from the prediction: 0 = the same, above 1 = different.</summary>
        double Mismatch(IModelDoc2 m, Dictionary<string, object> ex, double dv, double total)
        {
            var score = 0.0;
            if (J.Has(ex, "dv"))
            {
                var want = J.Num(ex, "dv");
                var tol = 0.05 + 2e-5 * Math.Abs(total) + 0.02 * Math.Abs(want);
                score = Math.Max(score, Math.Abs(dv - want) / tol);
            }
            var bb = J.Arr(ex, "bbox");
            if (bb != null && bb.Count == 2 && J.V3(bb[0]) is Vec3 lo && J.V3(bb[1]) is Vec3 hi)
            {
                var got = Box(Bodies(m));
                if (got != null)
                {
                    var glo = J.V3((List<object>)got["min"]).Value;
                    var ghi = J.V3((List<object>)got["max"]).Value;
                    var tol = 0.02 + 1e-4 * (hi - lo).Length;
                    var d = Math.Max((glo - lo).Length, (ghi - hi).Length);
                    score = Math.Max(score, d / tol);
                }
            }
            return score;
        }

        static void WarnIfAny(IFeature feat, Dictionary<string, object> row)
        {
            var code = feat.GetErrorCode2(out var warn);
            if (code != 0)
            {
                row["state"] = warn ? "warning" : "error";
                row["reason"] = ErrorText(code);
            }
        }

        // ------------------------------------------------------------------------- revolve

        void Revolve(Ctx c, Dictionary<string, object> f, Dictionary<string, object> row)
        {
            var m = c.Doc;
            var sk = SketchFor(c, J.Str(f, "sketch"));
            var axisId = J.Str(f, "axis");
            ISketchSegment axis = null;
            if (axisId != null && sk.Segs.TryGetValue(axisId, out var a1)) axis = a1;
            if (axis == null)
            {
                // the only centerline of the sketch, as SOLIDWORKS picks it
                var lines = sk.Segs.Values.Where(s => s.ConstructionGeometry && s.GetType() == (int)swSketchSegments_e.swSketchLINE).ToList();
                if (lines.Count == 1) axis = lines[0];
                else throw new UserError($"No axis line '{axisId}' in {sk.Name}: give the id of a line in that sketch (sw_get_document sketches=true lists them).");
            }
            var cut = J.Str(f, "op", "boss") == "cut";
            var ang = J.Num(f, "angle", 360);
            if (!(ang > 0 && ang <= 360)) throw new UserError("angle must be more than 0 and at most 360 degrees.");
            var mid = J.Str(f, "end") == "midplane";
            var ex = J.Obj(f, "expect");
            var reverse = J.Bool(f, "reverse");
            IFeature make(int t)
            {
                var rev = reverse ^ (t == 1);
                m.ClearSelection2(true);
                if (!SelectEntity(m, sk.Feature, false, 0)) throw new UserError($"Could not select {sk.Name}.");
                if (!SelectEntity(m, axis, true, AxisMark)) throw new UserError($"Could not select the axis line in {sk.Name}.");
                // Mid Plane is a Direction 1 end condition: one direction (SingleDir true), as for extrudes
                var feat = m.FeatureManager.FeatureRevolve2(true, true, false, cut, rev, false,
                                                            (int)(mid ? swEndConditions_e.swEndCondMidPlane : swEndConditions_e.swEndCondBlind),
                                                            (int)swEndConditions_e.swEndCondBlind, Units.Rad(ang), 0, false, false, 0, 0, 0, 0, 0,
                                                            J.Bool(f, "merge", true), true, true) as IFeature;
                m.ClearSelection2(true);
                if (feat != null) row["sw"] = J.O("ReverseDir", rev);
                return feat;
            }
            string looks(IFeature feat)
            {
                var bb = J.Arr(ex, "tool_bbox");
                if (bb == null || bb.Count != 2 || !(J.V3(bb[0]) is Vec3 lo) || !(J.V3(bb[1]) is Vec3 hi)) return null;
                return FacesInside(feat, lo, hi, 0.05 + 0.01 * (hi - lo).Length) ? null : "swept the other way round";
            }
            Variants(c, f, row, "revolve", ang < 360 && !mid ? 2 : 1, make, looks, cut ? -1 : J.Bool(f, "merge", true) ? 1 : 0);
        }

        /// <summary>The selection mark of a revolve's axis line (the 2022 help: 4 or 16; its examples use 16).</summary>
        const int AxisMark = 16;

        static bool FacesInside(IFeature feat, Vec3 lo, Vec3 hi, double tol)
        {
            foreach (var o in feat.GetFaces() as object[] ?? new object[0])
            {
                if (!(o is IFace2 fc) || !(fc.GetBox() is double[] b) || b.Length < 6) continue;
                if (b[0] * 1000 < lo.X - tol || b[1] * 1000 < lo.Y - tol || b[2] * 1000 < lo.Z - tol ||
                    b[3] * 1000 > hi.X + tol || b[4] * 1000 > hi.Y + tol || b[5] * 1000 > hi.Z + tol) return false;
            }
            return true;
        }

        // ------------------------------------------------------------------------- fillet, chamfer, shell, draft

        List<object> Refs(Dictionary<string, object> f, string key)
        {
            var l = J.Arr(f, key);
            if (l == null || l.Count == 0) throw new UserError($"{key} is empty: pass refs from sw_body_topology.");
            return l;
        }

        /// <summary>The edges or faces a feature names, found on the body as it is now.</summary>
        List<object> Picks(Ctx c, Dictionary<string, object> f, bool faces, List<string> notes)
        {
            var bodies = Bodies(c.Doc);
            if (bodies.Count == 0) throw new UserError("There is no body to work on yet.");
            return Refs(f, faces ? "faces" : "edges").Select(o => faces
                ? (object)FindFace(bodies, J.Obj(o) ?? throw new UserError("A face ref must be an object."), notes)
                : FindEdge(bodies, J.Obj(o) ?? throw new UserError("An edge ref must be an object."), notes)).ToList();
        }

        /// <summary>Selects the picks with a mark (and anything `before` selects first); false if not all were taken.</summary>
        bool SelectPicks(IModelDoc2 m, List<object> items, int mark, Action before = null)
        {
            m.ClearSelection2(true);
            before?.Invoke();
            var n = 0;
            foreach (var it in items)
                if (SelectEntity(m, it, true, mark)) n++;
            return n == items.Count;
        }

        void Fillet(Ctx c, Dictionary<string, object> f, Dictionary<string, object> row)
        {
            var r = J.Num(f, "radius", 1);
            if (r <= 0) throw new UserError("radius must be greater than 0.");
            var notes = new List<string>();
            var items = Picks(c, f, false, notes);
            var calls = 0;
            var none = new double[] { 0 };
            var marks = new[] { 1, 0 };
            IFeature make(int t)
            {
                // edges found again after a try was made and deleted: old edge objects need not survive a rebuild
                if (calls++ > 0) items = Picks(c, f, false, null);
                if (!SelectPicks(c.Doc, items, t < 2 ? marks[t] : 1)) throw new InvalidOperationException("not every edge could be selected");
                IFeature feat;
                if (t < 2)
                    // FeatureFillet3: propagate, uniform radius, attach edges, keep features
                    feat = c.Doc.FeatureManager.FeatureFillet3(195, r * Units.M, 0, 0, (int)swFeatureFilletType_e.swFeatureFilletType_Simple,
                                                              0, 0, none, none, none, none, none, none, none) as IFeature;
                else
                {
                    // the 2020+ way: a constant-radius fillet definition on the selected edges
                    var data = c.Doc.FeatureManager.CreateDefinition((int)swFeatureNameID_e.swFmFillet) as ISimpleFilletFeatureData2;
                    if (data == null) return null;
                    data.Initialize((int)swSimpleFilletType_e.swConstRadiusFillet);
                    data.DefaultRadius = r * Units.M;
                    data.Edges = items.ToArray();
                    feat = c.Doc.FeatureManager.CreateFeature(data) as IFeature;
                }
                c.Doc.ClearSelection2(true);
                return feat;
            }
            Variants(c, f, row, "fillet", 3, make, null, 0);
            foreach (var n in notes) Note(row, n);
        }

        void Chamfer(Ctx c, Dictionary<string, object> f, Dictionary<string, object> row)
        {
            var d1 = J.Num(f, "distance", 1);
            if (d1 <= 0) throw new UserError("distance must be greater than 0.");
            var dd = J.Str(f, "mode", "angle_distance") == "distance_distance";
            var ang = J.Num(f, "angle", 45);
            var d2 = J.Num(f, "distance2", d1);
            var notes = new List<string>();
            var items = Picks(c, f, false, notes);
            var calls = 0;
            var opts = (int)swFeatureChamferOption_e.swFeatureChamferTangentPropagation;
            var type = (int)(dd ? swChamferType_e.swChamferDistanceDistance : swChamferType_e.swChamferAngleDistance);
            // an unequal chamfer can come out with its two sides swapped: the flip option is the second way to try
            var ways = new List<(int mark, bool flip)> { (0, false), (1, false) };
            if (dd ? Math.Abs(d1 - d2) > 1e-9 : Math.Abs(ang - 45) > 1e-9) ways.AddRange(new[] { (0, true), (1, true) });
            IFeature make(int t)
            {
                if (calls++ > 0) items = Picks(c, f, false, null);
                if (!SelectPicks(c.Doc, items, ways[t].mark)) throw new InvalidOperationException("not every edge could be selected");
                var o = opts | (ways[t].flip ? (int)swFeatureChamferOption_e.swFeatureChamferFlipDirection : 0);
                // distance-distance: the help names OtherDist and VertexChamDist1/2; both get the numbers
                var feat = c.Doc.FeatureManager.InsertFeatureChamfer(o, type, d1 * Units.M, Units.Rad(ang), dd ? d2 * Units.M : 0,
                                                                     dd ? d1 * Units.M : 0, dd ? d2 * Units.M : 0, 0) as IFeature;
                c.Doc.ClearSelection2(true);
                return feat;
            }
            // either sign: a chamfer on a concave edge adds material (the prediction checks the amount)
            Variants(c, f, row, "chamfer", ways.Count, make, null, 0);
            foreach (var n in notes) Note(row, n);
        }

        void Shell(Ctx c, Dictionary<string, object> f, Dictionary<string, object> row)
        {
            var th = J.Num(f, "thickness", 1);
            if (th <= 0) throw new UserError("thickness must be greater than 0.");
            var outward = J.Bool(f, "outward");
            var notes = new List<string>();
            var items = Picks(c, f, true, notes);
            var calls = 0;
            var marks = new[] { 1, 0 };
            IFeature make(int t)
            {
                if (calls++ > 0) items = Picks(c, f, true, null);
                if (!SelectPicks(c.Doc, items, marks[t])) throw new InvalidOperationException("not every face could be selected");
                var before = (c.Doc.Extension.GetLastFeatureAdded() as IFeature)?.Name;
                c.Doc.InsertFeatureShell(th * Units.M, outward);
                c.Doc.ClearSelection2(true);
                var last = c.Doc.Extension.GetLastFeatureAdded() as IFeature;
                return last != null && last.Name != before ? last : null;
            }
            Variants(c, f, row, "shell", 2, make, null, outward ? 1 : -1);
            foreach (var n in notes) Note(row, n);
        }

        void Draft(Ctx c, Dictionary<string, object> f, Dictionary<string, object> row)
        {
            var ang = J.Num(f, "angle", 1);
            if (!(ang > 0 && ang < 90)) throw new UserError("angle must be between 0 and 90 degrees.");
            var np = J.Obj(f, "neutral_plane") ?? throw new UserError("neutral_plane is missing.");
            object findNeutral() => J.Has(np, "ref") || J.Has(np, "origin") ? ResolvePlane(c, np, null).Entity : FindFace(Bodies(c.Doc), np, null);
            var neutral = findNeutral();
            var notes = new List<string>();
            var items = Picks(c, f, true, notes);
            var calls = 0;
            var flip0 = J.Bool(f, "reverse");
            IFeature make(int t)
            {
                if (calls++ > 0)
                {
                    items = Picks(c, f, true, null);
                    if (neutral is IFace2) neutral = findNeutral();   // a plane stays (finding it again could make another)
                }
                if (!SelectPicks(c.Doc, items, 2, () => SelectEntity(c.Doc, neutral, true, 1)))
                    throw new InvalidOperationException("not every face could be selected");
                var feat = c.Doc.FeatureManager.InsertMultiFaceDraft(Units.Rad(ang), flip0 ^ (t == 1), false, 0, false, false) as IFeature;
                c.Doc.ClearSelection2(true);
                if (feat != null) row["sw"] = J.O("FlipDir", flip0 ^ (t == 1));
                return feat;
            }
            // which way FlipDir leans the faces depends on the neutral plane's own direction: only the prediction can tell
            Variants(c, f, row, "draft", J.Has(J.Obj(f, "expect"), "dv") ? 2 : 1, make, null, 0);
            foreach (var n in notes) Note(row, n);
        }

        // ------------------------------------------------------------------------- mirror and patterns

        /// <summary>The features to mirror or pattern; a hole stands for all its cuts (Hole1, Hole1-2, ...).</summary>
        List<IFeature> Seeds(Ctx c, Dictionary<string, object> f)
        {
            var o = new List<IFeature>();
            foreach (var i in J.Strs(f, "features"))
            {
                if (c.Multi.TryGetValue(i, out var all))
                {
                    o.AddRange(all.Select(n => Named(c, n, "feature")));
                    continue;
                }
                var first = Named(c, i, "feature");
                o.Add(first);
                if (System.Text.RegularExpressions.Regex.IsMatch(first.Name, "^Hole\\d+$"))
                    for (var k = 2; k < 10 && Feature(c.Doc, first.Name + "-" + k) is IFeature more; k++) o.Add(more);
            }
            return o;
        }

        void Mirror(Ctx c, Dictionary<string, object> f, Dictionary<string, object> row)
        {
            var m = c.Doc;
            var target = ResolvePlane(c, J.Obj(f, "plane") ?? J.O("ref", "Right Plane"), null);
            var seeds = Seeds(c, f);
            var body = seeds.Count == 0;
            IFeature make(int t)
            {
                m.ClearSelection2(true);
                if (!SelectEntity(m, target.Entity, false, 2)) throw new UserError("Could not select the mirror plane.");
                if (body)
                    foreach (var b in Bodies(m)) b.Select2(true, (SelectData)CreateSel(m, 256));
                else
                    foreach (var s in seeds) s.Select2(true, 1);
                var feat = m.FeatureManager.InsertMirrorFeature2(body, false, true, false, 0) as IFeature;
                m.ClearSelection2(true);
                return feat;
            }
            Variants(c, f, row, "mirror", 1, make, null, 0);
        }

        ISelectData CreateSel(IModelDoc2 m, int mark)
        {
            var sd = (ISelectData)((ISelectionMgr)m.SelectionManager).CreateSelectData();
            sd.Mark = mark;
            return sd;
        }

        /// <summary>A reference axis along X, Y or Z (where two standard planes meet), made once per call.</summary>
        IFeature Axis(Ctx c, string xyz)
        {
            xyz = xyz.ToUpperInvariant();
            if (c.Axes.TryGetValue(xyz, out var have)) return have;
            var m = c.Doc;
            // X: Front and Top meet along X; Y: Front and Right; Z: Top and Right
            var (pa, pb) = xyz == "X" ? (1, 2) : xyz == "Y" ? (1, 3) : xyz == "Z" ? (2, 3) : throw new UserError("Axis is X, Y or Z.");
            m.ClearSelection2(true);
            StdPlane(m, pa).Select2(false, 0);
            StdPlane(m, pb).Select2(true, 0);
            if (!m.InsertAxis2(true)) throw new UserError($"SOLIDWORKS did not make a reference axis along {xyz}.");
            var ax = m.Extension.GetLastFeatureAdded() as IFeature ?? throw new UserError("No axis made.");
            m.ClearSelection2(true);
            try
            {
                ax.Name = "Axis " + xyz;
            }
            catch (Exception)
            {
            }
            c.Axes[xyz] = ax;
            c.Journal?.Feature(m, ax.Name);
            return ax;
        }

        object Direction(Ctx c, object spec, out Vec3 dir)
        {
            if (spec is string s)
            {
                var k = s.ToUpperInvariant();
                dir = k == "X" ? Vec3.XAxis : k == "Y" ? Vec3.YAxis : k == "Z" ? Vec3.ZAxis : throw new UserError("direction is X, Y, Z or {\"edge\": ref}.");
                return Axis(c, k);
            }
            var d = J.Obj(spec) ?? throw new UserError("direction is X, Y, Z or {\"edge\": ref}.");
            var e = J.Obj(d, "edge");
            if (e != null)
            {
                var edge = FindEdge(Bodies(c.Doc), e, null);
                dir = Vec3.XAxis;
                if (edge.GetCurve() is ICurve cv && cv.IsLine() && cv.LineParams is double[] lp) dir = new Vec3(lp[3], lp[4], lp[5]).Unit();
                return edge;
            }
            var v = J.V3(d, "vector");
            if (v.HasValue)
            {
                var u = v.Value.Unit();
                foreach (var (k, ax) in new[] { ("X", Vec3.XAxis), ("Y", Vec3.YAxis), ("Z", Vec3.ZAxis) })
                    if (Math.Abs(Math.Abs(u.Dot(ax)) - 1) < 1e-9)
                    {
                        dir = u.Dot(ax) < 0 ? -ax : ax;
                        return Axis(c, k);
                    }
            }
            throw new UserError("Pattern directions here are X, Y, Z, an axis-aligned vector or a straight edge.");
        }

        void LinearPattern(Ctx c, Dictionary<string, object> f, Dictionary<string, object> row)
        {
            var m = c.Doc;
            var seeds = Seeds(c, f);
            if (seeds.Count == 0) throw new UserError("features is empty: name the features to pattern.");
            var d1 = Direction(c, f.TryGetValue("direction", out var ds) && ds != null ? ds : "X", out var v1);
            var n1 = J.Int(f, "count", 2);
            var s1 = J.Num(f, "spacing", 10);
            if (n1 < 1 || s1 <= 0) throw new UserError("count must be at least 1 and spacing more than 0.");
            object d2 = null;
            var n2 = 1;
            var s2 = 0.0;
            if (f.TryGetValue("direction2", out var ds2) && ds2 != null)
            {
                d2 = Direction(c, ds2, out _);
                n2 = J.Int(f, "count2", 1);
                s2 = J.Num(f, "spacing2", 10);
            }
            var want = v1 * (J.Bool(f, "reverse") ? -1 : 1);
            var center = CenterOf(seeds);
            IFeature make(int t)
            {
                var flip = t == 1;
                m.ClearSelection2(true);
                if (!SelectEntity(m, d1, false, 1)) throw new UserError("Could not select the pattern direction.");
                if (d2 != null && !SelectEntity(m, d2, true, 2)) throw new UserError("Could not select the second pattern direction.");
                foreach (var s in seeds) s.Select2(true, 4);
                var feat = m.FeatureManager.FeatureLinearPattern5(n1, s1 * Units.M, n2, s2 * Units.M, flip, false, "NULL", "NULL",
                                                                  false, false, false, false, false, false, true, true, false, false, 0, 0, false, false) as IFeature;
                m.ClearSelection2(true);
                if (feat != null) row["sw"] = J.O("FlipDir1", flip);
                return feat;
            }
            string looks(IFeature feat)
            {
                // the copies must lie along the wanted direction from the seeds
                var span = Span(feat, center, want);
                return span.HasValue && n1 > 1 && span.Value.hi < s1 * (n1 - 1) * 0.5 ? "copied the other way" : null;
            }
            Variants(c, f, row, "linear pattern", 2, make, looks, 0);
        }

        static Vec3 CenterOf(List<IFeature> feats)
        {
            Vec3 lo = new Vec3(double.MaxValue, double.MaxValue, double.MaxValue), hi = new Vec3(double.MinValue, double.MinValue, double.MinValue);
            foreach (var f in feats)
            foreach (var o in f.GetFaces() as object[] ?? new object[0])
            {
                if (!(o is IFace2 fc) || !(fc.GetBox() is double[] b) || b.Length < 6) continue;
                lo = new Vec3(Math.Min(lo.X, b[0]), Math.Min(lo.Y, b[1]), Math.Min(lo.Z, b[2]));
                hi = new Vec3(Math.Max(hi.X, b[3]), Math.Max(hi.Y, b[4]), Math.Max(hi.Z, b[5]));
            }
            return lo.X > hi.X ? Vec3.Zero : (lo + hi) * 0.5 * 1000;
        }

        void CircularPattern(Ctx c, Dictionary<string, object> f, Dictionary<string, object> row)
        {
            var m = c.Doc;
            var seeds = Seeds(c, f);
            if (seeds.Count == 0) throw new UserError("features is empty: name the features to pattern.");
            object axis;
            if (f.TryGetValue("axis", out var a) && a is string s) axis = Axis(c, s);
            else
            {
                var ad = J.Obj(f, "axis");
                var o = J.V3(ad, "origin") ?? Vec3.Zero;
                var d = J.V3(ad, "dir") ?? throw new UserError("axis is X, Y, Z or {origin, dir}.");
                if (o.Cross(d.Unit()).Length > 1e-6)
                    throw new UserError("A pattern axis off the origin is not supported here yet: pattern about X, Y or Z.");
                axis = Direction(c, J.O("vector", J.Pt(d, 9)), out _);
            }
            var n = J.Int(f, "count", 4);
            var total = J.Num(f, "angle", 360);
            var equal = J.Bool(f, "equal_spacing", true);
            if (n < 2) throw new UserError("count must be at least 2.");
            var step = equal ? (Math.Abs(total - 360) < 1e-9 ? total / n : total / Math.Max(n - 1, 1)) : J.Num(f, "step", 90);
            IFeature make(int t)
            {
                m.ClearSelection2(true);
                if (!SelectEntity(m, axis, false, 1)) throw new UserError("Could not select the pattern axis.");
                foreach (var sd in seeds) sd.Select2(true, 4);
                // equal spacing off: Spacing is the angle between neighbouring copies
                var feat = m.FeatureManager.FeatureCircularPattern5(n, Units.Rad(step), t == 1, "NULL", false, false, false, false,
                                                                    false, false, 1, 0, "NULL", false) as IFeature;
                m.ClearSelection2(true);
                if (feat != null) row["sw"] = J.O("FlipDirection", t == 1);
                return feat;
            }
            var full = Math.Abs(step * n - 360) < 1e-6;
            Variants(c, f, row, "circular pattern", full ? 1 : 2, make, null, 0);
        }

        // ------------------------------------------------------------------------- hole, sweep, loft

        /// <summary>OpenSketch's dimensioned hole as cut extrudes from a sketch on its plane: one for a plain hole,
        /// two for a counterbore, a tapered cut and the hole for a countersink.</summary>
        void Hole(Ctx c, Dictionary<string, object> f, Dictionary<string, object> row)
        {
            var plane = J.Obj(f, "plane") ?? throw new UserError("plane is missing.");
            var x = J.Num(f, "x");
            var y = J.Num(f, "y");
            var d = J.Num(f, "diameter");
            if (d <= 0) throw new UserError("diameter must be greater than 0.");
            var through = J.Str(f, "end", "blind") == "through_all";
            var depth = J.Num(f, "depth", 10);
            var reverse = J.Bool(f, "reverse");
            var style = J.Str(f, "style", "simple");
            var n = ++c.Holes;
            var parts = new List<string>();
            Dictionary<string, object> circle(string sid, double dia, Dictionary<string, object> on) => J.O(
                "id", sid, "type", "sketch", "plane", on,
                "entities", J.L(J.O("id", "c", "type", "point", "x", x, "y", y), J.O("id", "h", "type", "circle", "center", "c", "r", dia / 2)),
                "constraints", J.L(J.O("id", "dd", "type", "diameter", "refs", J.L("h"), "value", dia),
                                   J.O("id", "dx", "type", "distance", "refs", J.L("c", "origin"), "orient", "horizontal", "value", Math.Abs(x)),
                                   J.O("id", "dy", "type", "distance", "refs", J.L("c", "origin"), "orient", "vertical", "value", Math.Abs(y))));
            // every sketch of the hole is drawn on the start plane before anything is cut, so a later sketch cannot land
            // on the floor of an earlier cut
            string firstSketch = null;
            void sketchFor(string sid, double dia)
            {
                var skRow = new Dictionary<string, object>();
                // the second sketch goes on the first one's plane (a fixed plane is not made twice)
                var circ = circle(sid, dia, firstSketch == null ? plane : J.O("ref", firstSketch));
                if (firstSketch == null) firstSketch = sid;
                if (Math.Abs(x) < 1e-9) ((List<object>)circ["constraints"]).RemoveAll(k => J.Str((Dictionary<string, object>)k, "id") == "dx");
                if (Math.Abs(y) < 1e-9) ((List<object>)circ["constraints"]).RemoveAll(k => J.Str((Dictionary<string, object>)k, "id") == "dy");
                var sk = DrawSketch(c, circ, skRow);
                c.Sketches[sid] = sk;
                c.Journal?.Feature(c.Doc, sk.Name);
                if (skRow.TryGetValue("notes", out var sn) && sn is List<string> snl)
                    foreach (var t in snl) Note(row, t);
            }
            void cutFrom(string sid, double dia, string end, double dep, double draft)
            {
                var exRow = new Dictionary<string, object>();
                Extrude(c, J.O("sketch", sid, "op", "cut", "end", end, "depth", dep, "reverse", reverse, "draft", draft), exRow);
                var feat = Feature(c.Doc, J.Str(exRow, "name"));
                try
                {
                    feat.Name = $"Hole{n}" + (parts.Count == 0 ? "" : "-" + (parts.Count + 1));
                }
                catch (Exception)
                {
                }
                parts.Add(feat.Name);
                c.Journal?.Feature(c.Doc, feat.Name);
            }
            switch (style)
            {
                case "simple":
                    sketchFor($"__hole{n}a", d);
                    cutFrom($"__hole{n}a", d, through ? "through_all" : "blind", depth, 0);
                    break;
                case "counterbore":
                    var bd = J.Num(f, "bore_diameter");
                    var bdep = J.Num(f, "bore_depth");
                    if (bd <= d || bdep <= 0) throw new UserError("The counterbore needs bore_diameter > diameter and bore_depth > 0.");
                    sketchFor($"__hole{n}a", bd);
                    sketchFor($"__hole{n}b", d);
                    cutFrom($"__hole{n}a", bd, "blind", bdep, 0);
                    cutFrom($"__hole{n}b", d, through ? "through_all" : "blind", depth, 0);
                    break;
                case "countersink":
                    var sd = J.Num(f, "sink_diameter");
                    var sa = J.Num(f, "sink_angle", 90);
                    if (sd <= d || !(sa > 0 && sa < 180)) throw new UserError("The countersink needs sink_diameter > diameter and 0 < sink_angle < 180.");
                    var recess = (sd - d) / 2 / Math.Tan(Units.Rad(sa / 2));
                    sketchFor($"__hole{n}a", sd);
                    sketchFor($"__hole{n}b", d);
                    cutFrom($"__hole{n}a", sd, "blind", recess, sa / 2);
                    cutFrom($"__hole{n}b", d, through ? "through_all" : "blind", depth, 0);
                    break;
                default:
                    throw new UserError("style is simple, counterbore or countersink.");
            }
            row["name"] = parts[0];
            row["made_as"] = parts;
            if (J.Str(f, "id") != null)
            {
                c.Names[J.Str(f, "id")] = parts[0];
                c.Multi[J.Str(f, "id")] = parts;
            }
        }

        void Sweep(Ctx c, Dictionary<string, object> f, Dictionary<string, object> row)
        {
            var m = c.Doc;
            var prof = SketchFor(c, J.Str(f, "sketch"));
            var path = SketchFor(c, J.Str(f, "path"));
            var cut = J.Str(f, "op", "boss") == "cut";
            m.ClearSelection2(true);
            if (!SelectEntity(m, prof.Feature, false, 1) || !SelectEntity(m, path.Feature, true, 4))
                throw new UserError($"Could not select {prof.Name} (profile) and {path.Name} (path).");
            IFeature feat;
            if (cut)
                feat = m.FeatureManager.InsertCutSwept5(false, true, 0, false, false, 0, 0, false, 0, 0, 0, 0, true, true, 0, true, true, true, false, false, 0, 0) as IFeature;
            else
                feat = m.FeatureManager.InsertProtrusionSwept4(false, true, 0, false, false, 0, 0, false, 0, 0, 0, 0, J.Bool(f, "merge", true), true, true, 0, true, false, 0, 0) as IFeature;
            m.ClearSelection2(true);
            if (feat == null) throw new UserError($"SOLIDWORKS did not make the sweep of {prof.Name} along {path.Name}.");
            row["name"] = feat.Name;
            WarnIfAny(feat, row);
        }

        void Loft(Ctx c, Dictionary<string, object> f, Dictionary<string, object> row)
        {
            var m = c.Doc;
            var ids = J.Strs(f, "profiles");
            if (ids.Count < 2) throw new UserError("profiles needs at least two sketches, in order.");
            var sks = ids.Select(i => SketchFor(c, i)).ToList();
            var cut = J.Str(f, "op", "boss") == "cut";
            m.ClearSelection2(true);
            var first = true;
            foreach (var s in sks)
            {
                if (!SelectEntity(m, s.Feature, !first, 1)) throw new UserError($"Could not select the profile {s.Name}.");
                first = false;
            }
            IFeature feat;
            if (cut)
                feat = m.FeatureManager.InsertCutBlend(false, true, false, 1, 0, 0, false, 0, 0, 0, true, true) as IFeature;
            else
                feat = m.FeatureManager.InsertProtrusionBlend2(false, true, false, 1, 0, 0, 1, 1, true, true, false, 0, 0, 0,
                                                               J.Bool(f, "merge", true), true, true, 0) as IFeature;
            m.ClearSelection2(true);
            if (feat == null) throw new UserError("SOLIDWORKS did not make the loft (check that the profiles are single closed contours in order).");
            row["name"] = feat.Name;
            if (J.Bool(f, "ruled")) Note(row, "ruled sections are not set through the API here; edit the loft in SOLIDWORKS if they matter");
            WarnIfAny(feat, row);
        }

        // ------------------------------------------------------------------------- equations written on features

        void ApplyEquations(Ctx c, List<object> rows)
        {
            if (c.Equations.Count == 0) return;
            foreach (var (target, expr) in c.Equations)
            {
                try
                {
                    SetEquation(J.O("doc", Ref(c.Doc), "target", target, "expression", expr), c.Journal);
                }
                catch (UserError ex)
                {
                    rows.Add(J.O("equation", target + " = " + expr, "state", "warning", "reason", ex.Message));
                }
            }
        }
    }
}
