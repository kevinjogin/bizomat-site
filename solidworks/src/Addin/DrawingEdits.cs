using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using OpenSketch.Sw.Core;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;

namespace OpenSketch.Sw
{
    /// <summary>Drawings step by step (sw_get_drawing, sw_edit_drawing): read a drawing's sheet, views and title block
    /// fields, and change it with a list of actions run in order (views from the model, projected, section and detail
    /// views, moving, scaling, display style, model dimensions, centre marks, notes, title block, sheet, parts list
    /// and balloons). Positions are sheet millimetres from the lower left corner; views go by their SOLIDWORKS
    /// names (Drawing View1...). Points on the model are model millimetres, turned into sheet positions through
    /// the view's own transform.</summary>
    public sealed partial class Commands
    {
        IModelDoc2 DrawingDoc(Dictionary<string, object> a)
        {
            var m = Doc(a, true);
            if (Kind(m) != "drawing") throw new UserError($"{m.GetTitle()} is a {Kind(m)}, not a drawing: make one with sw_create_drawing.");
            return m;
        }

        static List<IView> Views(IDrawingDoc drw)
        {
            var o = new List<IView>();
            var first = drw.GetFirstView() as IView;   // the sheet itself
            for (var v = first?.GetNextView() as IView; v != null; v = v.GetNextView() as IView) o.Add(v);
            return o;
        }

        static IView ViewNamed(IDrawingDoc drw, string name)
        {
            var all = Views(drw);
            if (string.IsNullOrWhiteSpace(name)) throw new UserError("Name the view. Views: " + string.Join(", ", all.Select(x => x.Name)) + ".");
            var v = all.FirstOrDefault(x => string.Equals(x.Name, name, StringComparison.OrdinalIgnoreCase));
            if (v == null) throw new UserError($"No view '{name}'. Views: " + string.Join(", ", all.Select(x => x.Name)) + ".");
            return v;
        }

        static readonly Dictionary<string, swDisplayMode_e> DisplayStyles = new Dictionary<string, swDisplayMode_e>
        {
            ["wireframe"] = swDisplayMode_e.swWIREFRAME, ["hidden_visible"] = swDisplayMode_e.swHIDDEN_GREYED,
            ["hidden_removed"] = swDisplayMode_e.swHIDDEN, ["shaded"] = swDisplayMode_e.swSHADED,
            ["shaded_edges"] = swDisplayMode_e.swSHADED_EDGES,
        };

        static string ViewType(IView v)
        {
            switch ((swDrawingViewTypes_e)v.Type)
            {
                case swDrawingViewTypes_e.swDrawingSectionView: return "section";
                case swDrawingViewTypes_e.swDrawingDetailView: return "detail";
                case swDrawingViewTypes_e.swDrawingProjectedView: return "projected";
                case swDrawingViewTypes_e.swDrawingAuxiliaryView: return "auxiliary";
                case swDrawingViewTypes_e.swDrawingStandardView:
                case swDrawingViewTypes_e.swDrawingNamedView:
                case swDrawingViewTypes_e.swDrawingRelativeView: return "model";
                default: return "other";
            }
        }

        static Dictionary<string, object> ViewInfo(IView v)
        {
            var b = Box(v);
            var dims = 0;
            try
            {
                for (var dd = v.GetFirstDisplayDimension5(); dd != null; dd = dd.GetNext5()) dims++;
            }
            catch (Exception)
            {
            }
            var ratio = v.ScaleRatio as double[];
            var mode = (swDisplayMode_e)v.GetDisplayMode2();
            return J.O("name", v.Name, "type", ViewType(v), "orientation", v.GetOrientationName(),
                       "scale", ratio != null && ratio.Length >= 2 ? Num(ratio[0]) + ":" + Num(ratio[1]) : null,
                       "uses_sheet_scale", v.UseSheetScale != 0,
                       "outline_mm", b == null ? null : J.L(Math.Round(b[0], 1), Math.Round(b[1], 1), Math.Round(b[2], 1), Math.Round(b[3], 1)),
                       "display", DisplayStyles.FirstOrDefault(kv => kv.Value == mode).Key ?? mode.ToString(),
                       "dimensions", dims, "model", v.GetReferencedModelName());
        }

        Dictionary<string, object> ReadDrawing(Dictionary<string, object> a)
        {
            var m = DrawingDoc(a);
            var drw = (IDrawingDoc)m;
            var sheet = drw.GetCurrentSheet() as ISheet;
            var p = sheet?.GetProperties2() as double[];
            var props = new Dictionary<string, object>();
            try
            {
                var cpm = m.Extension.get_CustomPropertyManager("");
                if (cpm.GetNames() is object[] names)
                    foreach (var n in names.OfType<string>())
                    {
                        string val = null, resolved = null;
                        bool wasResolved = false, linked = false;
                        cpm.Get6(n, false, ref val, ref resolved, ref wasResolved, ref linked);
                        props[n] = resolved ?? val;
                    }
            }
            catch (Exception)
            {
            }
            return J.O("doc", Ref(m), "title", m.GetTitle(),
                       "sheet", p == null || p.Length < 7 ? null : J.O("name", sheet.GetName(), "width_mm", Math.Round(p[5] * 1000, 1), "height_mm", Math.Round(p[6] * 1000, 1),
                                                                      "scale", Num(p[2]) + ":" + Num(p[3]), "projection", p[4] != 0 ? "first angle" : "third angle"),
                       "sheets", drw.GetSheetCount(), "views", Views(drw).Select(v => (object)ViewInfo(v)).ToList(), "properties", props);
        }

        Dictionary<string, object> EditDrawing(Dictionary<string, object> a)
        {
            var m = DrawingDoc(a);
            var drw = (IDrawingDoc)m;
            var actions = J.Arr(a, "actions") ?? new List<object>();
            var results = new List<object>();
            for (var i = 0; i < actions.Count; i++)
            {
                var act = J.Obj(actions[i]) ?? new Dictionary<string, object>();
                var what = J.Str(act, "do", "");
                try
                {
                    var r = Act(m, drw, what, act);
                    r["do"] = what;
                    r["ok"] = true;
                    results.Add(r);
                }
                catch (Exception ex)
                {
                    var msg = ex is UserError ? ex.Message : ex.GetType().Name + ": " + ex.Message;
                    results.Add(J.O("do", what, "ok", false, "error", msg));
                    m.ClearSelection2(true);
                    drw.EditRebuild();
                    throw new UserError($"Action {i + 1} ({what}) failed: {msg} The actions before it were done.",
                                        J.O("results", results, "views", Views(drw).Select(v => (object)ViewInfo(v)).ToList()));
                }
            }
            m.ClearSelection2(true);
            drw.EditRebuild();
            return J.O("doc", Ref(m), "results", results, "views", Views(drw).Select(v => (object)ViewInfo(v)).ToList(),
                       "unsaved", "Changes are not saved yet: sw_save when the drawing is right.");
        }

        Dictionary<string, object> Act(IModelDoc2 m, IDrawingDoc drw, string what, Dictionary<string, object> act)
        {
            m.ClearSelection2(true);
            switch (what)
            {
                case "view": return ActView(drw, act);
                case "projected": return ActProjected(m, drw, act);
                case "section": return ActSection(m, drw, act);
                case "detail": return ActDetail(m, drw, act);
                case "move":
                {
                    var v = ViewNamed(drw, J.Str(act, "view"));
                    var to = Pt(act, "to");
                    var b = Box(v) ?? throw new UserError("That view has no outline to move by.");
                    MoveBy(v, to[0] - (b[0] + b[2]) / 2, to[1] - (b[1] + b[3]) / 2);
                    return ViewInfo(v);
                }
                case "scale":
                {
                    var v = ViewNamed(drw, J.Str(act, "view"));
                    var s = J.Arr(act, "scale");
                    if (s == null || s.Count != 2)
                    {
                        v.UseSheetScale = 1;
                    }
                    else
                    {
                        v.UseSheetScale = 0;
                        v.ScaleRatio = new[] { Convert.ToDouble(s[0], CultureInfo.InvariantCulture), Convert.ToDouble(s[1], CultureInfo.InvariantCulture) };
                    }
                    drw.EditRebuild();
                    return ViewInfo(v);
                }
                case "display":
                {
                    var v = ViewNamed(drw, J.Str(act, "view"));
                    var style = J.Str(act, "style", "hidden_removed");
                    if (!DisplayStyles.TryGetValue(style, out var mode)) throw new UserError("Styles: " + string.Join(", ", DisplayStyles.Keys) + ".");
                    v.SetDisplayMode3(false, (int)mode, false, mode == swDisplayMode_e.swSHADED_EDGES);
                    return ViewInfo(v);
                }
                case "delete":
                {
                    var name = ViewNamed(drw, J.Str(act, "view")).Name;
                    if (!m.Extension.SelectByID2(name, "DRAWINGVIEW", 0, 0, 0, false, 0, null, 0)) throw new UserError($"Could not select {name}.");
                    if (!m.Extension.DeleteSelection2((int)swDeleteSelectionOptions_e.swDelete_Absorbed)) throw new UserError($"SOLIDWORKS did not delete {name}.");
                    return J.O("deleted", name);
                }
                case "rename":
                {
                    var v = ViewNamed(drw, J.Str(act, "view"));
                    if (!v.SetName2(J.Str(act, "name"))) throw new UserError("SOLIDWORKS did not take that name (it may be in use).");
                    return ViewInfo(v);
                }
                case "dimensions":
                {
                    var name = J.Str(act, "view");
                    var all = string.IsNullOrEmpty(name);
                    if (!all && !m.Extension.SelectByID2(ViewNamed(drw, name).Name, "DRAWINGVIEW", 0, 0, 0, false, 0, null, 0))
                        throw new UserError($"Could not select {name}.");
                    var r = drw.InsertModelAnnotations3((int)swImportModelItemsSource_e.swImportModelItemsFromEntireModel,
                                                        (int)swInsertAnnotation_e.swInsertDimensionsMarkedForDrawing, all, false, false, true);
                    var n = (r as object[])?.Length ?? 0;
                    ArrangeDimensions(m, drw);
                    return J.O("dimensions_added", n, "note", n == 0 ? "None came in: the model's dimensions are not marked for drawing, are already shown, or belong to faces this view does not show." : null);
                }
                case "arrange_dimensions":
                    ArrangeDimensions(m, drw);
                    return J.O();
                case "centre_marks":
                {
                    var targets = string.IsNullOrEmpty(J.Str(act, "view")) ? Views(drw) : new List<IView> { ViewNamed(drw, J.Str(act, "view")) };
                    var done = 0;
                    foreach (var v in targets)
                        if (v.AutoInsertCenterMarks2((int)(swAutoInsertCenterMarkTypes_e.swAutoInsertCenterMarkType_Hole | swAutoInsertCenterMarkTypes_e.swAutoInsertCenterMarkType_Slots),
                                                     (int)swCenterMarkConnectionLine_e.swCenterMark_ShowNoConnectLines, true, true, true, 0, 0, true, true, 0))
                            done++;
                    return J.O("views", done);
                }
                case "note":
                {
                    var at = Pt(act, "at");
                    var h = J.Num(act, "height", 3.5);
                    if (drw.CreateText2(J.Str(act, "text", ""), at[0] / 1000, at[1] / 1000, 0, h / 1000, 0) == null)
                        throw new UserError("SOLIDWORKS did not place the note.");
                    return J.O("at", J.L(at[0], at[1]));
                }
                case "properties":
                {
                    var cpm = m.Extension.get_CustomPropertyManager("");
                    var set = new List<object>();
                    foreach (var kv in J.Obj(act, "set") ?? new Dictionary<string, object>())
                        if (cpm.Add3(kv.Key, (int)swCustomInfoType_e.swCustomInfoText, Convert.ToString(kv.Value, CultureInfo.InvariantCulture) ?? "",
                                     (int)swCustomPropertyAddOption_e.swCustomPropertyReplaceValue) == (int)swCustomInfoAddResult_e.swCustomInfoAddResult_AddedOrChanged)
                            set.Add(kv.Key);
                    return J.O("set", set);
                }
                case "sheet":
                {
                    var sheet = drw.GetCurrentSheet() as ISheet ?? throw new UserError("No sheet.");
                    var p = sheet.GetProperties2() as double[] ?? throw new UserError("Could not read the sheet.");
                    var s = J.Arr(act, "scale");
                    double n1 = p[2], n2 = p[3];
                    if (s != null && s.Count == 2)
                    {
                        n1 = Convert.ToDouble(s[0], CultureInfo.InvariantCulture);
                        n2 = Convert.ToDouble(s[1], CultureInfo.InvariantCulture);
                    }
                    var proj = J.Str(act, "projection");
                    var first = proj == null ? p[4] != 0 : proj == "first";
                    sheet.SetProperties2((int)p[0], (int)p[1], n1, n2, first, p[5], p[6], p.Length > 7 && p[7] != 0);
                    drw.EditRebuild();
                    return J.O("scale", Num(n1) + ":" + Num(n2), "projection", first ? "first angle" : "third angle");
                }
                case "bom": return ActBom(m, drw, act);
                default:
                    throw new UserError("Unknown action. Actions: view, projected, section, detail, move, scale, display, delete, rename, dimensions, arrange_dimensions, centre_marks, note, properties, sheet, bom.");
            }
        }

        static double[] Pt(Dictionary<string, object> act, string key)
        {
            var p = J.Arr(act, key);
            if (p == null || p.Count < 2) throw new UserError($"{key} is [x, y] in sheet millimetres from the lower left corner.");
            return new[] { Convert.ToDouble(p[0], CultureInfo.InvariantCulture), Convert.ToDouble(p[1], CultureInfo.InvariantCulture) };
        }

        string ModelOf(IDrawingDoc drw, Dictionary<string, object> act)
        {
            var given = J.Str(act, "model");
            if (!string.IsNullOrEmpty(given)) return given;
            var shown = Views(drw).Select(v => v.GetReferencedModelName()).FirstOrDefault(s => !string.IsNullOrEmpty(s));
            return shown ?? throw new UserError("The drawing shows no model yet: give model (the part or assembly path).");
        }

        Dictionary<string, object> ActView(IDrawingDoc drw, Dictionary<string, object> act)
        {
            var orient = J.Str(act, "orientation", "front");
            if (!ModelViews.TryGetValue(orient, out var named)) throw new UserError("Orientations: " + string.Join(", ", ModelViews.Keys) + ".");
            var at = Pt(act, "at");
            var v = drw.CreateDrawViewFromModelView3(ModelOf(drw, act), named, at[0] / 1000, at[1] / 1000, 0) as IView
                    ?? throw new UserError("SOLIDWORKS did not place the view.");
            return ViewInfo(v);
        }

        Dictionary<string, object> ActProjected(IModelDoc2 m, IDrawingDoc drw, Dictionary<string, object> act)
        {
            var parent = ViewNamed(drw, J.Str(act, "from"));
            var at = Pt(act, "at");
            if (!m.Extension.SelectByID2(parent.Name, "DRAWINGVIEW", 0, 0, 0, false, 0, null, 0)) throw new UserError($"Could not select {parent.Name}.");
            var v = drw.CreateUnfoldedViewAt3(at[0] / 1000, at[1] / 1000, 0, false) ?? throw new UserError("SOLIDWORKS did not make the projected view.");
            return ViewInfo(v);
        }

        /// <summary>A point on the sheet (mm) for a point in the model (mm), through the view's model-to-sheet transform.</summary>
        double[] SheetPoint(IView v, List<object> model)
        {
            var xf = v.ModelToViewTransform;
            var mp = math.CreatePoint(new[] { Convert.ToDouble(model[0], CultureInfo.InvariantCulture) / 1000,
                                             Convert.ToDouble(model[1], CultureInfo.InvariantCulture) / 1000,
                                             Convert.ToDouble(model[2], CultureInfo.InvariantCulture) / 1000 }) as MathPoint;
            var sp = mp?.MultiplyTransform(xf) as MathPoint;
            var d = sp?.ArrayData as double[] ?? throw new UserError("Could not place that model point on the sheet.");
            return new[] { d[0] * 1000, d[1] * 1000 };
        }

        /// <summary>Where on the sheet a cut or a detail goes: a model point ("through", mm), a sheet point ("sheet_point"),
        /// or a fraction of the view's outline ("fraction": [fx, fy], 0.5 = the middle).</summary>
        double[] Locate(IView v, Dictionary<string, object> act)
        {
            var b = Box(v) ?? throw new UserError("That view has no outline.");
            var through = J.Arr(act, "through");
            if (through != null && through.Count == 3) return SheetPoint(v, through);
            var sheetPt = J.Arr(act, "sheet_point");
            if (sheetPt != null && sheetPt.Count >= 2) return Pt(act, "sheet_point");
            var f = J.Arr(act, "fraction");
            double fx = 0.5, fy = 0.5;
            if (f != null && f.Count >= 2)
            {
                fx = Convert.ToDouble(f[0], CultureInfo.InvariantCulture);
                fy = Convert.ToDouble(f[1], CultureInfo.InvariantCulture);
            }
            return new[] { b[0] + (b[2] - b[0]) * fx, b[1] + (b[3] - b[1]) * fy };
        }

        Dictionary<string, object> ActSection(IModelDoc2 m, IDrawingDoc drw, Dictionary<string, object> act)
        {
            var parent = ViewNamed(drw, J.Str(act, "view"));
            var b = Box(parent) ?? throw new UserError("That view has no outline.");
            var c = Locate(parent, act);
            var vertical = J.Str(act, "direction", "horizontal") == "vertical";
            const double over = 6;   // the cutting line runs a little past the outline, as drawn by hand
            if (!drw.ActivateView(parent.Name)) throw new UserError($"Could not activate {parent.Name}.");
            var seg = vertical
                ? m.SketchManager.CreateLine(c[0] / 1000, (b[1] - over) / 1000, 0, c[0] / 1000, (b[3] + over) / 1000, 0)
                : m.SketchManager.CreateLine((b[0] - over) / 1000, c[1] / 1000, 0, (b[2] + over) / 1000, c[1] / 1000, 0);
            if (seg == null) throw new UserError("Could not draw the cutting line.");
            m.ClearSelection2(true);
            seg.Select4(false, null);
            var at = Pt(act, "place");
            var opts = J.Bool(act, "flip") ? (int)swCreateSectionViewAtOptions_e.swCreateSectionView_ChangeDirection : 0;
            var v = drw.CreateSectionViewAt5(at[0] / 1000, at[1] / 1000, 0, J.Str(act, "label", "A"), opts, null, 0);
            if (v == null) throw new UserError("SOLIDWORKS did not make the section view (is the cutting line across the part?).");
            return ViewInfo(v);
        }

        Dictionary<string, object> ActDetail(IModelDoc2 m, IDrawingDoc drw, Dictionary<string, object> act)
        {
            var parent = ViewNamed(drw, J.Str(act, "view"));
            var c = Locate(parent, act);
            var r = J.Num(act, "radius", 10);
            if (!drw.ActivateView(parent.Name)) throw new UserError($"Could not activate {parent.Name}.");
            var seg = m.SketchManager.CreateCircleByRadius(c[0] / 1000, c[1] / 1000, 0, r / 1000) ?? throw new UserError("Could not draw the detail circle.");
            m.ClearSelection2(true);
            seg.Select4(false, null);
            var at = Pt(act, "place");
            var s = J.Arr(act, "scale");
            double s1 = 2, s2 = 1;
            if (s != null && s.Count == 2)
            {
                s1 = Convert.ToDouble(s[0], CultureInfo.InvariantCulture);
                s2 = Convert.ToDouble(s[1], CultureInfo.InvariantCulture);
            }
            var v = drw.CreateDetailViewAt4(at[0] / 1000, at[1] / 1000, 0, (int)swDetViewStyle_e.swDetViewSTANDARD, s1, s2, J.Str(act, "label", "B"),
                                            (int)swDetCircleShowType_e.swDetCircleCIRCLE, true, false, false, 0) as IView;
            if (v == null) throw new UserError("SOLIDWORKS did not make the detail view.");
            return ViewInfo(v);
        }

        Dictionary<string, object> ActBom(IModelDoc2 m, IDrawingDoc drw, Dictionary<string, object> act)
        {
            var v = ViewNamed(drw, J.Str(act, "view"));
            var at = Pt(act, "at");
            var type = J.Str(act, "type", "top") == "parts" ? swBomType_e.swBomType_PartsOnly
                     : J.Str(act, "type", "top") == "indented" ? swBomType_e.swBomType_Indented : swBomType_e.swBomType_TopLevelOnly;
            var template = BomTemplate();
            var bom = v.InsertBomTable4(true, at[0] / 1000, at[1] / 1000, (int)swBOMConfigurationAnchorType_e.swBOMConfigurationAnchor_TopRight,
                                        (int)type, "", template ?? "", false,
                                        (int)(type == swBomType_e.swBomType_Indented ? swNumberingType_e.swNumberingType_Detailed : swNumberingType_e.swNumberingType_None), false);
            if (bom == null) throw new UserError("SOLIDWORKS did not insert the parts list" + (template == null ? " (no BOM template found in its file locations)." : "."));
            var balloons = 0;
            if (J.Bool(act, "balloons", true))
            {
                m.ClearSelection2(true);
                if (m.Extension.SelectByID2(v.Name, "DRAWINGVIEW", 0, 0, 0, false, 0, null, 0))
                {
                    var o = drw.CreateAutoBalloonOptions();
                    o.Layout = (int)swBalloonLayoutType_e.swDetailingBalloonLayout_Square;
                    o.IgnoreMultiple = true;
                    balloons = (drw.AutoBalloon5(o) as object[])?.Length ?? 0;
                }
            }
            return J.O("parts_list", true, "template", template, "balloons", balloons);
        }

        /// <summary>The BOM table template from SOLIDWORKS' own file locations (bom-standard first), or null.</summary>
        string BomTemplate()
        {
            var dirs = (app.GetUserPreferenceStringValue((int)swUserPreferenceStringValue_e.swFileLocationsBOMTemplates) ?? "")
                       .Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var d in dirs)
            {
                try
                {
                    if (!Directory.Exists(d)) continue;
                    var files = Directory.GetFiles(d, "*.sldbomtbt");
                    var pick = files.FirstOrDefault(f => Path.GetFileName(f).StartsWith("bom-standard", StringComparison.OrdinalIgnoreCase)) ?? files.FirstOrDefault();
                    if (pick != null) return pick;
                }
                catch (Exception)
                {
                }
            }
            return null;
        }
    }
}
