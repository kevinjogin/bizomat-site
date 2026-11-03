using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using OpenSketch.Sw.Core;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;

namespace OpenSketch.Sw
{
    /// <summary>Files in and out: STEP of the current geometry for the server's topology, measuring and previews
    /// (only when SOLIDWORKS' update stamp changed), exports, imports and a picture of the window.</summary>
    public sealed partial class Commands
    {
        static string Temp(string name)
        {
            var d = Path.Combine(Path.GetTempPath(), "OpenSketch-SW");
            Directory.CreateDirectory(d);
            return Path.Combine(d, Guid.NewGuid().ToString("N").Substring(0, 8) + "_" + name);
        }

        /// <summary>Save As a copy in another format (STEP, STL, Parasolid, IGES, image, PDF): the document keeps its
        /// own file and name.</summary>
        byte[] SaveCopy(IModelDoc2 m, string ext)
        {
            var path = Temp(SafeName(Stem(m.GetTitle())) + ext);
            int err = 0, warn = 0;
            // SOLIDWORKS exports the ACTIVE document, and only the selection if something is selected (2022 help)
            var before = app.ActiveDoc as IModelDoc2;
            var opened = false;
            if (!ReferenceEquals(before, m))
            {
                if (!m.Visible && !string.IsNullOrEmpty(m.GetPathName()))
                {
                    OpenFile(m.GetPathName());
                    opened = true;
                }
                Activate(m);
            }
            m.ClearSelection2(true);
            var ok = m.Extension.SaveAs(path, (int)swSaveAsVersion_e.swSaveAsCurrentVersion,
                                        (int)(swSaveAsOptions_e.swSaveAsOptions_Silent | swSaveAsOptions_e.swSaveAsOptions_Copy), null, ref err, ref warn);
            if (before != null && !ReferenceEquals(before, m))
            {
                if (opened) app.CloseDoc(m.GetTitle());   // a part of an assembly: back to being loaded in the background
                Activate(before);
            }
            try
            {
                if (!ok || !File.Exists(path))
                    throw new UserError($"SOLIDWORKS could not save {m.GetTitle()} as {ext} ({Enum.GetName(typeof(swFileSaveError_e), err) ?? err.ToString()}).");
                return File.ReadAllBytes(path);
            }
            finally
            {
                try
                {
                    if (File.Exists(path)) File.Delete(path);
                }
                catch (Exception)
                {
                }
            }
        }

        /// <summary>The server's copy of the geometry: a part's body as STEP, or for an assembly every component with
        /// its placement and each part's STEP. Parts whose update stamp the server already has are not sent again.</summary>
        Dictionary<string, object> Geometry(Dictionary<string, object> a, ICommandIO io)
        {
            var m = Doc(a);
            var have = J.Obj(a, "have") ?? new Dictionary<string, object>();
            var parts = new Dictionary<string, object>();
            var n = 0;

            void part(IModelDoc2 pm, string key)
            {
                if (parts.ContainsKey(key)) return;
                var stamp = pm.GetUpdateStamp();
                var row = J.O("stamp", (double)stamp, "title", Stem(pm.GetTitle()));
                if (!(have.TryGetValue(key, out var h) && h is double hv && (int)hv == stamp))
                {
                    if (Bodies(pm).Count == 0)
                    {
                        row["empty"] = true;
                    }
                    else
                    {
                        var name = "p" + (++n) + ".step";
                        io.Upload(name, SaveCopy(pm, ".step"));
                        row["file"] = name;
                    }
                }
                parts[key] = row;
            }

            var comp = J.Str(a, "component");
            if (Kind(m) == "part" || !string.IsNullOrEmpty(comp))
            {
                var pm = m;
                if (!string.IsNullOrEmpty(comp))
                {
                    if (Kind(m) != "assembly") throw new UserError("component is for assemblies.");
                    pm = Component(m, comp).GetModelDoc2() as IModelDoc2 ?? throw new UserError($"{comp} is lightweight or suppressed; resolve it first.");
                }
                if (Bodies(pm).Count == 0) throw new UserError($"{pm.GetTitle()} has no solid body yet.");
                var key = Ref(pm);
                part(pm, key);
                return J.O("kind", "part", "title", Stem(pm.GetTitle()), "key", key, "parts", parts);
            }
            if (Kind(m) != "assembly") throw new UserError("Geometry is for parts and assemblies.");
            var asm = (IAssemblyDoc)m;
            var comps = new List<object>();
            var resolved = new List<object>();
            foreach (var o in asm.GetComponents(false) as object[] ?? new object[0])
            {
                var c = (IComponent2)o;
                if (c.IsSuppressed()) continue;
                var cm = c.GetModelDoc2() as IModelDoc2;
                if (cm == null)
                {
                    // lightweight: resolve it, so its body can be read
                    c.SetSuppression2((int)swComponentSuppressionState_e.swComponentFullyResolved);
                    cm = c.GetModelDoc2() as IModelDoc2;
                    resolved.Add(c.Name2);
                }
                if (cm == null || Kind(cm) != "part") continue;   // sub-assemblies: their parts are listed themselves
                var key = Ref(cm);
                part(cm, key);
                if (((Dictionary<string, object>)parts[key]).ContainsKey("empty")) continue;
                comps.Add(J.O("name", c.Name2, "key", key, "matrix", PoseOf(c).ToList12(), "hidden", c.IsHidden(false) ? (object)true : null));
            }
            var outp = J.O("kind", "assembly", "title", Stem(m.GetTitle()), "components", comps, "parts", parts);
            if (resolved.Count > 0) outp["resolved"] = resolved;
            return outp;
        }

        Dictionary<string, object> Export(Dictionary<string, object> a, ICommandIO io)
        {
            var m = Doc(a);
            var comp = J.Str(a, "component");
            if (!string.IsNullOrEmpty(comp)) m = Component(m, comp).GetModelDoc2() as IModelDoc2 ?? throw new UserError($"{comp} is lightweight; resolve it first.");
            var fmt = J.Str(a, "format", "step").ToLowerInvariant();
            byte[] raw;
            string ext;
            switch (fmt)
            {
                case "step": ext = ".step"; break;
                case "stl": ext = ".stl"; break;
                case "x_t": ext = ".x_t"; break;
                case "igs": ext = ".igs"; break;
                case "pdf": ext = ".pdf"; break;
                case "dwg":
                case "dxf":
                    if (Kind(m) != "drawing") throw new UserError("DWG and DXF are made from a drawing: make one with sw_create_drawing, then export that.");
                    ext = "." + fmt;
                    break;
                case "sldprt":
                case "sldasm":
                case "slddrw":
                    ext = Kind(m) == "assembly" ? ".sldasm" : Kind(m) == "drawing" ? ".slddrw" : ".sldprt";
                    fmt = ext.Substring(1);   // what the file is, whatever was asked for
                    break;
                default: throw new UserError("Formats: step, stl, x_t, igs, sldprt, sldasm, slddrw, pdf, dwg, dxf.");
            }
            if (Kind(m) == "drawing" && ext != ".pdf" && ext != ".dwg" && ext != ".dxf" && ext != ".slddrw")
                throw new UserError("A drawing exports as pdf, dwg, dxf or slddrw. For STEP or STL, export the part or assembly it shows.");
            if (ext == ".sldprt" || ext == ".sldasm" || ext == ".slddrw")
            {
                var p = m.GetPathName();
                if (!string.IsNullOrEmpty(p) && File.Exists(p) && !m.GetSaveFlag()) raw = File.ReadAllBytes(p);
                else raw = SaveCopy(m, ext);
            }
            else raw = SaveCopy(m, ext);
            var name = SafeName(Stem(m.GetTitle())) + ext;
            io.Upload(name, raw);
            return J.O("file", name, "title", Stem(m.GetTitle()), "format", fmt, "bytes", raw.Length,
                       "note", ext == ".sldasm" ? "An assembly file holds only references: send its parts too (export them one by one), or use Pack and Go in SOLIDWORKS." : null);
        }

        Dictionary<string, object> Import(Dictionary<string, object> a, ICommandIO io)
        {
            var filename = SafeName(Path.GetFileName(J.Str(a, "filename", "model.step")));
            var raw = io.Download("file");
            var folder = Folder(a);
            var src = Path.Combine(folder, filename);
            if (File.Exists(src)) src = FreePath(folder, Path.GetFileNameWithoutExtension(filename), Path.GetExtension(filename));
            File.WriteAllBytes(src, raw);
            var err = 0;
            IModelDoc2 m = null;
            try
            {
                var data = app.GetImportFileData(src);
                m = app.LoadFile4(src, "r", data, ref err) as IModelDoc2;
            }
            catch (Exception ex)
            {
                Log.Write("import with options failed: " + ex.Message);
            }
            if (m == null) m = app.LoadFile4(src, "", null, ref err) as IModelDoc2;
            if (m == null) throw new UserError($"SOLIDWORKS could not import {filename} (error {err}).");
            var stem = SafeName(J.Str(a, "name") ?? Path.GetFileNameWithoutExtension(filename));
            var target = FreePath(folder, stem, Kind(m) == "assembly" ? ".SLDASM" : ".SLDPRT");
            int e2 = 0, w2 = 0;
            var saved = m.Extension.SaveAs(target, (int)swSaveAsVersion_e.swSaveAsCurrentVersion, (int)swSaveAsOptions_e.swSaveAsOptions_Silent, null, ref e2, ref w2);
            Activate(m);
            m.ShowNamedView2("", (int)swStandardViews_e.swIsometricView);
            m.ViewZoomtofit2();
            return J.O("doc", saved ? target : Ref(m), "title", m.GetTitle(), "kind", Kind(m), "source", src,
                       "saved", saved, "note", saved ? null : $"Imported but not saved as {target} (error {e2}); call sw_save with a path.",
                       "body", Kind(m) == "part" ? Body(m) : null);
        }

        Dictionary<string, object> Screenshot(Dictionary<string, object> a, ICommandIO io)
        {
            var m = Doc(a, true);
            var views = new Dictionary<string, swStandardViews_e>
            {
                ["isometric"] = swStandardViews_e.swIsometricView, ["top"] = swStandardViews_e.swTopView,
                ["front"] = swStandardViews_e.swFrontView, ["right"] = swStandardViews_e.swRightView
            };
            var v = J.Str(a, "view");
            if (Kind(m) == "drawing") v = null;   // a drawing is shown as it is: the whole sheet
            if (v != null && views.TryGetValue(v, out var id))
            {
                m.ShowNamedView2("", (int)id);
                m.ViewZoomtofit2();
            }
            if (Kind(m) == "drawing") m.ViewZoomtofit2();
            m.GraphicsRedraw2();
            var raw = SaveCopy(m, ".png");
            io.Upload("view.png", raw);
            return J.O("file", "view.png", "title", Stem(m.GetTitle()), "view", v);
        }
    }
}
