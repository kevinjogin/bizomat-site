using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using OpenSketch.Sw.Core;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;
using Environment = System.Environment;

namespace OpenSketch.Sw
{
    /// <summary>
    /// Every command Claude can send (the sw_ tools on the server), run on SOLIDWORKS' own thread. Lengths in the
    /// commands are millimetres and degrees (OpenSketch's units); SOLIDWORKS' API takes metres and radians.
    /// </summary>
    public sealed partial class Commands
    {
        readonly ISldWorks app;
        readonly IMathUtility math;

        public Commands(ISldWorks app)
        {
            this.app = app;
            math = (IMathUtility)app.GetMathUtility();
        }

        static readonly HashSet<string> Writes = new HashSet<string>
        {
            "add_features", "batch", "insert_component", "add_mate", "delete", "set_parameter", "set_equation", "undo"
        };

        public Dictionary<string, object> Run(string op, Dictionary<string, object> a, ICommandIO io)
        {
            if (Writes.Contains(op)) NotWhileTheUserEdits();
            using (new Quiet(app))
            {
                switch (op)
                {
                    case "ping": return J.O("pong", true);
                    case "status": return Status();
                    case "create_document": return CreateDocument(a);
                    case "open_document": return OpenDocument(a);
                    case "save": return Save(a);
                    case "undo": return Undo(a);
                    case "read": return Read(a);
                    case "geometry": return Geometry(a, io);
                    case "export": return Export(a, io);
                    case "import": return Import(a, io);
                    case "screenshot": return Screenshot(a, io);
                    case "add_features": return AddFeatures(a, null);
                    case "batch": return Batch(a);
                    case "insert_component": return InsertComponent(a, null);
                    case "add_mate": return AddMate(a, null);
                    case "delete": return Delete(a);
                    case "set_parameter": return SetParameter(a, null);
                    case "set_equation": return SetEquation(a, null);
                    default:
                        throw new UserError($"This add-in does not know the command '{op}'. Update it: download it again from the OpenSketch SOLIDWORKS page.");
                }
            }
        }

        /// <summary>Changes wait while the user is part-way through something in SOLIDWORKS (a sketch open for editing),
        /// so Claude never builds into it.</summary>
        void NotWhileTheUserEdits()
        {
            IModelDoc2 ad;
            try
            {
                ad = app.ActiveDoc as IModelDoc2;
            }
            catch (Exception)
            {
                return;
            }
            if (ad == null) return;
            ISketch open = null;
            try
            {
                open = ad.SketchManager?.ActiveSketch as ISketch;
            }
            catch (Exception)
            {
            }
            if (open != null)
                throw new UserError($"A sketch is open for editing in {ad.GetTitle()}. Close it in SOLIDWORKS (exit the sketch), then ask again.");
        }

        /// <summary>No dialog boxes that wait for an answer while Claude works (put back afterwards), as the macro
        /// engine does: no Modify box on new dimensions, over-defining dimensions become driven, no rebuild error
        /// pop-ups.</summary>
        sealed class Quiet : IDisposable
        {
            readonly ISldWorks app;
            readonly Dictionary<swUserPreferenceToggle_e, bool> was = new Dictionary<swUserPreferenceToggle_e, bool>();

            public Quiet(ISldWorks app)
            {
                this.app = app;
                Set(swUserPreferenceToggle_e.swShowErrorsEveryRebuild, false);
                Set(swUserPreferenceToggle_e.swInputDimValOnCreate, false);
                Set(swUserPreferenceToggle_e.swSketchOverdefiningDimsPromptToSetState, false);
                Set(swUserPreferenceToggle_e.swSketchOverdefiningDimsSetDrivenByDefault, true);
            }

            void Set(swUserPreferenceToggle_e p, bool v)
            {
                try
                {
                    was[p] = app.GetUserPreferenceToggle((int)p);
                    app.SetUserPreferenceToggle((int)p, v);
                }
                catch (Exception)
                {
                }
            }

            public void Dispose()
            {
                foreach (var kv in was)
                {
                    try
                    {
                        app.SetUserPreferenceToggle((int)kv.Key, kv.Value);
                    }
                    catch (Exception)
                    {
                    }
                }
            }
        }

        // ------------------------------------------------------------------------- documents

        static string Kind(IModelDoc2 m)
        {
            switch ((swDocumentTypes_e)m.GetType())
            {
                case swDocumentTypes_e.swDocPART: return "part";
                case swDocumentTypes_e.swDocASSEMBLY: return "assembly";
                case swDocumentTypes_e.swDocDRAWING: return "drawing";
                default: return "other";
            }
        }

        static string Ref(IModelDoc2 m)
        {
            var p = m.GetPathName();
            return string.IsNullOrEmpty(p) ? m.GetTitle() : p;
        }

        List<IModelDoc2> OpenDocs()
        {
            var o = new List<IModelDoc2>();
            if (app.GetDocuments() is object[] docs)
                foreach (var d in docs)
                    if (d is IModelDoc2 m) o.Add(m);
            return o;
        }

        static string Stem(string s)
        {
            var n = Path.GetFileName(s ?? "");
            var dot = n.LastIndexOf('.');
            return (dot > 0 ? n.Substring(0, dot) : n).ToLowerInvariant();
        }

        /// <summary>The document a command names (a path, a window title, or nothing for the active one).</summary>
        IModelDoc2 Doc(Dictionary<string, object> a, bool activate = false)
        {
            var name = J.Str(a, "doc");
            IModelDoc2 m = null;
            if (string.IsNullOrWhiteSpace(name) || name == "active")
            {
                m = app.ActiveDoc as IModelDoc2;
                if (m == null) throw new UserError("No document is open in SOLIDWORKS. Open one, or make one with sw_create_document.");
            }
            else
            {
                m = app.GetOpenDocumentByName(name) as IModelDoc2;
                if (m == null)
                    m = OpenDocs().FirstOrDefault(d => string.Equals(d.GetPathName(), name, StringComparison.OrdinalIgnoreCase)
                                                    || string.Equals(d.GetTitle(), name, StringComparison.OrdinalIgnoreCase)
                                                    || Stem(d.GetTitle()) == Stem(name));
                if (m == null && File.Exists(name)) m = OpenFile(name);
                if (m == null)
                    throw new UserError($"No open document '{name}'. Open: " +
                                        string.Join(", ", OpenDocs().Where(d => d.Visible).Select(d => d.GetTitle())) + ".");
            }
            if (activate) Activate(m);
            return m;
        }

        void Activate(IModelDoc2 m)
        {
            if (ReferenceEquals(app.ActiveDoc, m)) return;
            var err = 0;
            app.ActivateDoc3(m.GetTitle(), false, (int)swRebuildOnActivation_e.swDontRebuildActiveDoc, ref err);
            if (!m.Visible) m.Visible = true;
        }

        IModelDoc2 OpenFile(string path)
        {
            var ext = Path.GetExtension(path).ToLowerInvariant();
            var type = ext == ".sldasm" ? swDocumentTypes_e.swDocASSEMBLY : ext == ".slddrw" ? swDocumentTypes_e.swDocDRAWING : swDocumentTypes_e.swDocPART;
            int err = 0, warn = 0;
            var m = app.OpenDoc6(path, (int)type, (int)swOpenDocOptions_e.swOpenDocOptions_Silent, "", ref err, ref warn);
            if (m == null) throw new UserError($"SOLIDWORKS could not open {path} ({Enum.GetName(typeof(swFileLoadError_e), err) ?? err.ToString()}).");
            return m;
        }

        /// <summary>The part a command works on: the document itself, or with "component" that component's part
        /// (opened in its own window, as editing a part from an assembly is in SOLIDWORKS).</summary>
        IModelDoc2 PartDoc(Dictionary<string, object> a, out IModelDoc2 owner)
        {
            owner = null;
            var m = Doc(a);
            var comp = J.Str(a, "component");
            if (!string.IsNullOrEmpty(comp))
            {
                if (Kind(m) != "assembly") throw new UserError("component is for assemblies; this document is a " + Kind(m) + ".");
                var c = Component(m, comp);
                var path = c.GetPathName();
                owner = m;
                var pm = app.GetOpenDocumentByName(path) as IModelDoc2 ?? OpenFile(path);
                if (!pm.Visible) pm = OpenFile(path);
                Activate(pm);
                return pm;
            }
            if (Kind(m) != "part") throw new UserError($"{m.GetTitle()} is a {Kind(m)}: give a part, or component=<name> for one part of an assembly.");
            Activate(m);
            return m;
        }

        IComponent2 Component(IModelDoc2 asmDoc, string name)
        {
            var asm = (IAssemblyDoc)asmDoc;
            var c = asm.GetComponentByName(name) as IComponent2;
            if (c != null) return c;
            var all = asm.GetComponents(false) as object[] ?? new object[0];
            foreach (IComponent2 x in all)
                if (string.Equals(x.Name2, name, StringComparison.OrdinalIgnoreCase) || string.Equals(Leaf(x.Name2), name, StringComparison.OrdinalIgnoreCase))
                    return x;
            throw new UserError($"No component '{name}' in {asmDoc.GetTitle()}. Components: " + string.Join(", ", all.Cast<IComponent2>().Select(x => x.Name2).Take(40)) + ".");
        }

        static string Leaf(string n)
        {
            var i = n.LastIndexOf('/');
            return i >= 0 ? n.Substring(i + 1) : n;
        }

        Dictionary<string, object> Status()
        {
            var active = app.ActiveDoc as IModelDoc2;
            var docs = new List<object>();
            var hidden = 0;
            foreach (var m in OpenDocs())
            {
                if (!m.Visible)
                {
                    hidden++;
                    continue;
                }
                docs.Add(J.O("doc", Ref(m), "title", m.GetTitle(), "kind", Kind(m), "active", ReferenceEquals(m, active),
                             "unsaved", m.GetSaveFlag(), "saved_as", string.IsNullOrEmpty(m.GetPathName()) ? null : m.GetPathName()));
            }
            return J.O("sw_version", Host.SafeRevision(app), "addin_version", Host.Version, "docs", docs,
                       "active", active == null ? null : Ref(active),
                       "loaded_in_background", hidden > 0 ? (object)hidden : null,
                       "units", "mm and degrees (the add-in converts to SOLIDWORKS' metres and radians)");
        }

        static string Folder(Dictionary<string, object> a, string sub = null)
        {
            var f = J.Str(a, "folder");
            if (string.IsNullOrWhiteSpace(f))
            {
                f = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "OpenSketch");
                var s = sub ?? J.Str(a, "subfolder");
                if (!string.IsNullOrEmpty(s)) f = Path.Combine(f, s);
            }
            Directory.CreateDirectory(f);
            return f;
        }

        static string SafeName(string s)
        {
            var bad = Path.GetInvalidFileNameChars();
            var o = new string((s ?? "").Select(c => bad.Contains(c) ? '_' : c).ToArray()).Trim();
            return string.IsNullOrEmpty(o) ? "Part" : o;
        }

        static string FreePath(string folder, string stem, string ext)
        {
            var p = Path.Combine(folder, stem + ext);
            for (var k = 2; File.Exists(p) && k < 1000; k++) p = Path.Combine(folder, stem + "_" + k + ext);
            return p;
        }

        Dictionary<string, object> CreateDocument(Dictionary<string, object> a)
        {
            var asm = J.Str(a, "kind", "part") == "assembly";
            var pref = asm ? swUserPreferenceStringValue_e.swDefaultTemplateAssembly : swUserPreferenceStringValue_e.swDefaultTemplatePart;
            var tmpl = app.GetUserPreferenceStringValue((int)pref);
            if (string.IsNullOrEmpty(tmpl) || !File.Exists(tmpl))
                throw new UserError("SOLIDWORKS has no default " + (asm ? "assembly" : "part") + " template (Tools > Options > System Options > Default Templates).");
            var m = app.NewDocument(tmpl, 0, 0, 0) as IModelDoc2;
            if (m == null) throw new UserError("SOLIDWORKS did not make a new document from " + tmpl + ".");
            var units = J.Str(a, "units", "mm");
            m.Extension.SetUserPreferenceInteger((int)swUserPreferenceIntegerValue_e.swUnitSystem, 0,
                                                 (int)(units == "inch" ? swUnitSystem_e.swUnitSystem_IPS : swUnitSystem_e.swUnitSystem_MMGS));
            var path = FreePath(Folder(a), SafeName(J.Str(a, "name")), asm ? ".SLDASM" : ".SLDPRT");
            int err = 0, warn = 0;
            if (!m.Extension.SaveAs(path, (int)swSaveAsVersion_e.swSaveAsCurrentVersion, (int)swSaveAsOptions_e.swSaveAsOptions_Silent, null, ref err, ref warn))
                throw new UserError($"SOLIDWORKS made the document but could not save it as {path} (error {err}).");
            Log.Write("new " + (asm ? "assembly " : "part ") + path);
            return J.O("doc", path, "title", m.GetTitle(), "kind", asm ? "assembly" : "part", "template", tmpl,
                       "units", units == "inch" ? "IPS" : "MMGS");
        }

        Dictionary<string, object> OpenDocument(Dictionary<string, object> a)
        {
            var path = J.Str(a, "path");
            if (string.IsNullOrEmpty(path)) throw new UserError("Give the file's path.");
            var m = app.GetOpenDocumentByName(path) as IModelDoc2;
            if (m == null || !m.Visible)
            {
                if (!File.Exists(path)) throw new UserError("No such file: " + path);
                m = OpenFile(path);
            }
            Activate(m);
            return J.O("doc", Ref(m), "title", m.GetTitle(), "kind", Kind(m));
        }

        Dictionary<string, object> Save(Dictionary<string, object> a)
        {
            var m = Doc(a);
            int err = 0, warn = 0;
            var path = J.Str(a, "path");
            bool ok;
            if (!string.IsNullOrEmpty(path))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(path));
                ok = m.Extension.SaveAs(path, (int)swSaveAsVersion_e.swSaveAsCurrentVersion, (int)swSaveAsOptions_e.swSaveAsOptions_Silent, null, ref err, ref warn);
            }
            else if (string.IsNullOrEmpty(m.GetPathName()))
                throw new UserError("This document was never saved: give path.");
            else ok = m.Save3((int)swSaveAsOptions_e.swSaveAsOptions_Silent, ref err, ref warn);
            if (!ok) throw new UserError($"SOLIDWORKS could not save {m.GetTitle()} ({Enum.GetName(typeof(swFileSaveError_e), err) ?? err.ToString()}).");
            return J.O("doc", Ref(m), "saved", true, "warnings", warn != 0 ? (object)warn : null);
        }

        Dictionary<string, object> Undo(Dictionary<string, object> a)
        {
            var m = Doc(a, true);
            var n = Math.Max(1, Math.Min(20, J.Int(a, "steps", 1)));
            var before = Tree(m).Count;
            m.EditUndo2(n);
            m.ForceRebuild3(false);
            return J.O("doc", Ref(m), "undone", n, "features_before", before, "features_now", Tree(m).Count);
        }

        // ------------------------------------------------------------------------- reading

        static readonly HashSet<string> Hidden = new HashSet<string>
        {
            "OriginProfileFeature", "MaterialFolder", "SensorFolder", "DocsFolder", "DetailCabinet", "HistoryFolder", "SelectionSetFolder",
            "EqnFolder", "InkMarkupFolder", "FavoriteFolder", "CommentsFolder", "SurfaceBodyFolder", "SolidBodyFolder",
            "EnvFolder", "MateReferenceGroupFeature", "LiveSectionFolder", "MarkupCommentFolder", "BlockFolder",
            "ProfileFeature_Ghost"
        };

        /// <summary>The feature tree in order (top level), without SOLIDWORKS' own folders.</summary>
        static List<IFeature> Tree(IModelDoc2 m)
        {
            var o = new List<IFeature>();
            var f = m.FirstFeature() as IFeature;
            var guard = 0;
            while (f != null && guard++ < 100000)
            {
                if (!Hidden.Contains(f.GetTypeName2())) o.Add(f);
                f = f.GetNextFeature() as IFeature;
            }
            return o;
        }

        static Dictionary<string, object> FeatureRow(IFeature f, bool deep)
        {
            var warn = false;
            var code = f.GetErrorCode2(out warn);
            var row = J.O("name", f.Name, "type", f.GetTypeName2());
            if (f.IsSuppressed()) row["suppressed"] = true;
            if (code != 0)
            {
                row["state"] = warn ? "warning" : "error";
                row["reason"] = ErrorText(code);
            }
            if (deep)
            {
                var subs = new List<object>();
                var s = f.GetFirstSubFeature() as IFeature;
                while (s != null)
                {
                    subs.Add(s.Name);
                    s = s.GetNextSubFeature() as IFeature;
                }
                if (subs.Count > 0) row["uses"] = subs;
            }
            return row;
        }

        public static string ErrorText(int code)
        {
            var n = Enum.GetName(typeof(swFeatureError_e), code);
            if (n == null) return "error " + code;
            n = n.Replace("swFeatureError", "").Replace("_", " ");
            return n + " (" + code + ")";
        }

        Dictionary<string, object> Read(Dictionary<string, object> a)
        {
            var m = Doc(a);
            var comp = J.Str(a, "component");
            if (!string.IsNullOrEmpty(comp))
            {
                if (Kind(m) != "assembly") throw new UserError("component is for assemblies.");
                var c = Component(m, comp);
                var pm = c.GetModelDoc2() as IModelDoc2;
                if (pm == null) throw new UserError($"{comp} is lightweight or suppressed; resolve it in SOLIDWORKS first.");
                var r = ReadPart(pm, J.Bool(a, "sketches"));
                r["component"] = c.Name2;
                return r;
            }
            if (Kind(m) == "assembly") return ReadAssembly(m);
            if (Kind(m) != "part") throw new UserError("Only parts and assemblies can be read.");
            return ReadPart(m, J.Bool(a, "sketches"));
        }

        Dictionary<string, object> ReadPart(IModelDoc2 m, bool sketches)
        {
            var tree = new List<object>();
            var skState = new Dictionary<string, object>();
            var errors = new List<object>();
            foreach (var f in Tree(m))
            {
                var row = FeatureRow(f, true);
                tree.Add(row);
                if (row.ContainsKey("reason")) errors.Add(J.O("feature", f.Name, "state", row["state"], "reason", row["reason"]));
                AddSketches(f, skState, sketches);
                var s = f.GetFirstSubFeature() as IFeature;
                while (s != null)
                {
                    AddSketches(s, skState, sketches);
                    s = s.GetNextSubFeature() as IFeature;
                }
            }
            var o = J.O("doc", Ref(m), "title", m.GetTitle(), "kind", "part", "features", tree, "sketches", skState,
                        "body", Body(m), "update_stamp", m.GetUpdateStamp());
            if (errors.Count > 0) o["problems"] = errors;
            var eq = Equations(m);
            if (eq.Count > 0) o["equations"] = eq;
            var dims = Dimensions(m);
            if (dims.Count > 0) o["dimensions"] = dims;
            return o;
        }

        void AddSketches(IFeature f, Dictionary<string, object> into, bool full)
        {
            var t = f.GetTypeName2();
            if (t != "ProfileFeature" && t != "3DProfileFeature") return;
            if (into.ContainsKey(f.Name)) return;
            var sk = f.GetSpecificFeature2() as ISketch;
            if (sk == null) return;
            var row = J.O("state", SketchState(sk.GetConstrainedStatus()));
            if (full) row = J.O("state", row["state"], "content", ReadSketch(sk));
            into[f.Name] = row;
        }

        public static string SketchState(int s)
        {
            switch ((swConstrainedStatus_e)s)
            {
                case swConstrainedStatus_e.swFullyConstrained: return "fully defined";
                case swConstrainedStatus_e.swUnderConstrained: return "under defined";
                case swConstrainedStatus_e.swOverConstrained: return "over defined";
                case swConstrainedStatus_e.swNoSolution: return "no solution";
                case swConstrainedStatus_e.swInvalidSolution: return "invalid solution";
                default: return "unknown (" + s + ")";
            }
        }

        /// <summary>A sketch's curves in its own coordinates (mm), with ids built from SOLIDWORKS' entity ids, its
        /// relations and its dimensions.</summary>
        static Dictionary<string, object> ReadSketch(ISketch sk)
        {
            var ents = new List<object>();
            var ids = new Dictionary<string, string>();
            string Pid(ISketchPoint p)
            {
                if (p == null) return null;
                var k = Key((object)p.GetID());
                if (!ids.TryGetValue(k, out string id))
                {
                    id = "p" + (ids.Count + 1);
                    ids[k] = id;
                    ents.Add(J.O("id", id, "type", "point", "x", R(p.X * 1000), "y", R(p.Y * 1000)));
                }
                return id;
            }
            var segIds = new Dictionary<string, string>();
            var n = 0;
            foreach (var o in sk.GetSketchSegments() as object[] ?? new object[0])
            {
                var s = (ISketchSegment)o;
                var sid = "s" + (++n);
                segIds[Key((object)s.GetID())] = sid;
                var cons = s.ConstructionGeometry;
                switch ((swSketchSegments_e)s.GetType())
                {
                    case swSketchSegments_e.swSketchLINE:
                        var l = (ISketchLine)s;
                        ents.Add(J.O("id", sid, "type", "line", "p1", Pid(l.GetStartPoint2() as ISketchPoint), "p2", Pid(l.GetEndPoint2() as ISketchPoint),
                                     "construction", cons ? (object)true : null));
                        break;
                    case swSketchSegments_e.swSketchARC:
                        var arc = (ISketchArc)s;
                        var c = Pid(arc.GetCenterPoint2() as ISketchPoint);
                        if (arc.IsCircle() == 1)
                            ents.Add(J.O("id", sid, "type", "circle", "center", c, "r", R(arc.GetRadius() * 1000), "construction", cons ? (object)true : null));
                        else
                        {
                            // OpenSketch arcs run counter-clockwise from start to end
                            var ccw = arc.GetRotationDir() == 1;
                            var p1 = Pid(arc.GetStartPoint2() as ISketchPoint);
                            var p2 = Pid(arc.GetEndPoint2() as ISketchPoint);
                            ents.Add(J.O("id", sid, "type", "arc", "center", c, "start", ccw ? p1 : p2, "end", ccw ? p2 : p1,
                                         "construction", cons ? (object)true : null));
                        }
                        break;
                    default:
                        ents.Add(J.O("id", sid, "type", Enum.GetName(typeof(swSketchSegments_e), s.GetType())?.Replace("swSketch", "").ToLowerInvariant() ?? "other"));
                        break;
                }
            }
            foreach (var o in sk.GetSketchPoints2() as object[] ?? new object[0]) Pid((ISketchPoint)o);
            var rels = new List<object>();
            try
            {
                var rm = sk.RelationManager;
                foreach (var o in rm.GetRelations((int)swSketchRelationFilterType_e.swAll) as object[] ?? new object[0])
                {
                    var r = (ISketchRelation)o;
                    var on = new List<object>();
                    foreach (var e in r.GetEntities() as object[] ?? new object[0])
                    {
                        if (e is ISketchSegment ss && segIds.TryGetValue(Key((object)ss.GetID()), out string x)) on.Add(x);
                        else if (e is ISketchPoint sp && ids.TryGetValue(Key((object)sp.GetID()), out string y)) on.Add(y);
                        else on.Add("external");
                    }
                    rels.Add(J.O("type", Enum.GetName(typeof(swConstraintType_e), r.GetRelationType())?.Replace("sw", "").Replace("CONSTRAINT_", "").ToLowerInvariant(), "refs", on));
                }
            }
            catch (Exception ex)
            {
                rels.Add(J.O("note", "relations could not be read: " + ex.Message));
            }
            return J.O("entities", ents, "relations", rels);
        }

        static string Key(object id)
        {
            if (id is int[] ia) return string.Join(",", ia);
            if (id is object[] oa) return string.Join(",", oa);
            return Convert.ToString(id);
        }

        static double R(double v, int d = 4) => Math.Round(v, d);

        List<object> Dimensions(IModelDoc2 m)
        {
            var o = new List<object>();
            foreach (var f in Tree(m))
            {
                AddDims(f, o);
                var s = f.GetFirstSubFeature() as IFeature;
                while (s != null)
                {
                    AddDims(s, o);
                    s = s.GetNextSubFeature() as IFeature;
                }
                if (o.Count > 300) break;
            }
            return o;
        }

        static void AddDims(IFeature f, List<object> into)
        {
            var dd = f.GetFirstDisplayDimension() as IDisplayDimension;
            var guard = 0;
            while (dd != null && guard++ < 500)
            {
                var d = dd.GetDimension2(0) as IDimension;
                if (d != null)
                {
                    var angle = d.GetType() == (int)swDimensionParamType_e.swDimensionParamTypeDoubleAngular;
                    var v = d.GetSystemValue3((int)swInConfigurationOpts_e.swThisConfiguration, null) is double[] vals && vals.Length > 0 ? vals[0] : d.SystemValue;
                    into.Add(J.O("name", d.FullName, "value", R(angle ? Units.Deg(v) : v * 1000), "unit", angle ? "deg" : "mm",
                                 "driven", d.DrivenState == (int)swDimensionDrivenState_e.swDimensionDriven ? (object)true : null));
                }
                dd = f.GetNextDisplayDimension(dd) as IDisplayDimension;
            }
        }

        List<object> Equations(IModelDoc2 m)
        {
            var o = new List<object>();
            var em = m.GetEquationMgr() as IEquationMgr;
            if (em == null) return o;
            for (var i = 0; i < em.GetCount(); i++)
            {
                o.Add(J.O("equation", em.get_Equation(i), "value", R(em.get_Value(i), 6), "global", em.get_GlobalVariable(i) ? (object)true : null,
                          "error", em.Status != 0 ? (object)em.Status : null));
            }
            return o;
        }

        /// <summary>The solid bodies' numbers in mm: volume, area, centre of mass, mass, bounding box (exact, from
        /// extreme points, not the rough part box).</summary>
        Dictionary<string, object> Body(IModelDoc2 m)
        {
            var bodies = Bodies(m);
            if (bodies.Count == 0) return J.O("solids", 0);
            var mp = m.Extension.CreateMassProperty() as IMassProperty;
            var o = J.O("solids", bodies.Count);
            if (mp != null)
            {
                o["volume_mm3"] = R(mp.Volume * 1e9, 3);
                o["area_mm2"] = R(mp.SurfaceArea * 1e6, 3);
                if (mp.CenterOfMass is double[] com) o["center_of_mass"] = J.Pt(Vec3.From(com) * 1000, 3);
                o["mass_g"] = R(mp.Mass * 1000, 3);
            }
            var bb = Box(bodies);
            if (bb != null) o["bbox"] = bb;
            var faces = 0;
            var edges = 0;
            foreach (var b in bodies)
            {
                faces += b.GetFaceCount();
                edges += b.GetEdgeCount();
            }
            o["faces"] = faces;
            o["edges"] = edges;
            try
            {
                var mat = ((IPartDoc)m).GetMaterialPropertyName2("", out var db);
                if (!string.IsNullOrEmpty(mat)) o["material"] = mat;
            }
            catch (Exception)
            {
            }
            return o;
        }

        static List<IBody2> Bodies(IModelDoc2 m)
        {
            var o = new List<IBody2>();
            if (m is IPartDoc p && p.GetBodies2((int)swBodyType_e.swSolidBody, true) is object[] bs)
                foreach (var b in bs)
                    if (b is IBody2 body) o.Add(body);
            return o;
        }

        static Dictionary<string, object> Box(List<IBody2> bodies)
        {
            if (bodies.Count == 0) return null;
            double[] lo = { double.MaxValue, double.MaxValue, double.MaxValue }, hi = { double.MinValue, double.MinValue, double.MinValue };
            var dirs = new[] { Vec3.XAxis, Vec3.YAxis, Vec3.ZAxis };
            foreach (var b in bodies)
            {
                for (var k = 0; k < 3; k++)
                {
                    foreach (var sgn in new[] { 1.0, -1.0 })
                    {
                        var d = dirs[k] * sgn;
                        if (b.GetExtremePoint(d.X, d.Y, d.Z, out var x, out var y, out var z))
                        {
                            var v = new[] { x, y, z }[k] * 1000;
                            lo[k] = Math.Min(lo[k], v);
                            hi[k] = Math.Max(hi[k], v);
                        }
                    }
                }
            }
            if (lo[0] > hi[0]) return null;
            return J.O("min", J.L(R(lo[0]), R(lo[1]), R(lo[2])), "max", J.L(R(hi[0]), R(hi[1]), R(hi[2])),
                       "size", J.L(R(hi[0] - lo[0]), R(hi[1] - lo[1]), R(hi[2] - lo[2])));
        }

        double Volume(IModelDoc2 m, out int solids)
        {
            var bodies = Bodies(m);
            solids = bodies.Count;
            double v = 0;
            foreach (var b in bodies)
                if (b.GetMassProperties(1.0) is double[] mp && mp.Length > 3) v += mp[3];
            return v * 1e9;
        }

        Dictionary<string, object> ReadAssembly(IModelDoc2 m)
        {
            var asm = (IAssemblyDoc)m;
            var comps = new List<object>();
            var under = new List<object>();
            foreach (var o in asm.GetComponents(true) as object[] ?? new object[0])
            {
                var c = (IComponent2)o;
                var pose = PoseOf(c);
                var st = c.GetConstrainedStatus();
                var row = J.O("name", c.Name2, "file", c.GetPathName(), "fixed", c.IsFixed() ? (object)true : null,
                              "suppressed", c.IsSuppressed() ? (object)true : null, "hidden", c.IsHidden(false) ? (object)true : null,
                              "position", J.Pt(pose.T, 4), "matrix", pose.ToList12(),
                              "state", c.IsFixed() ? "fixed" : SketchState(st).Replace("constrained", "defined"));
                comps.Add(row);
                if (!c.IsFixed() && st == (int)swConstrainedStatus_e.swUnderConstrained) under.Add(c.Name2);
            }
            var mates = new List<object>();
            foreach (var f in Tree(m))
            {
                if (f.GetTypeName2() != "MateGroup") continue;
                var s = f.GetFirstSubFeature() as IFeature;
                while (s != null)
                {
                    var row = FeatureRow(s, false);
                    if (s.GetSpecificFeature2() is IMate2 mate)
                    {
                        row["mate_type"] = Enum.GetName(typeof(swMateType_e), mate.Type)?.Replace("sw", "").Replace("MATE", "").ToLowerInvariant();
                        var on = new List<object>();
                        for (var i = 0; i < mate.GetMateEntityCount(); i++)
                            if (mate.MateEntity(i) is IMateEntity2 me && me.ReferenceComponent is IComponent2 rc) on.Add(rc.Name2);
                        row["components"] = on;
                    }
                    mates.Add(row);
                    s = s.GetNextSubFeature() as IFeature;
                }
            }
            var o2 = J.O("doc", Ref(m), "title", m.GetTitle(), "kind", "assembly", "components", comps, "mates", mates,
                         "under_defined", under, "update_stamp", m.GetUpdateStamp());
            var eq = Equations(m);
            if (eq.Count > 0) o2["equations"] = eq;
            return o2;
        }

        /// <summary>Where a component sits: p_assembly = R p_part + t (mm), read by multiplying SOLIDWORKS' own
        /// transform (so its storage order does not matter).</summary>
        Pose PoseOf(IComponent2 c)
        {
            var xf = c.Transform2 as IMathTransform;
            if (xf == null) return Pose.Identity;
            Vec3 Apply(Vec3 p)
            {
                var mp = (IMathPoint)math.CreatePoint(p.Arr());
                var q = (IMathPoint)mp.MultiplyTransform(xf);
                return Vec3.From((double[])q.ArrayData);
            }
            var o = Apply(Vec3.Zero);
            var ex = Apply(Vec3.XAxis) - o;
            var ey = Apply(Vec3.YAxis) - o;
            var ez = Apply(Vec3.ZAxis) - o;
            return new Pose { R = new[] { ex.X, ey.X, ez.X, ex.Y, ey.Y, ez.Y, ex.Z, ey.Z, ez.Z }, T = o * 1000 };
        }
    }
}
