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
    /// <summary>Drawings (sw_create_drawing): a native .SLDDRW of a saved part or assembly from the user's default
    /// drawing template. One sheet: the standard views in third or first angle projection plus an isometric (or the
    /// views asked for), a sheet scale that fits, the model's dimensions marked for drawing, and title block fields as
    /// the drawing's custom properties. Sheet coordinates in the API are metres; results are in millimetres.</summary>
    public sealed partial class Commands
    {
        sealed class SheetSize
        {
            public swDwgPaperSizes_e Paper;
            public double W, H;   // mm, landscape
        }

        static readonly Dictionary<string, SheetSize> Sheets = new Dictionary<string, SheetSize>(StringComparer.OrdinalIgnoreCase)
        {
            ["A4"] = new SheetSize { Paper = swDwgPaperSizes_e.swDwgPaperA4size, W = 297, H = 210 },
            ["A3"] = new SheetSize { Paper = swDwgPaperSizes_e.swDwgPaperA3size, W = 420, H = 297 },
            ["A2"] = new SheetSize { Paper = swDwgPaperSizes_e.swDwgPaperA2size, W = 594, H = 420 },
            ["A1"] = new SheetSize { Paper = swDwgPaperSizes_e.swDwgPaperA1size, W = 841, H = 594 },
            ["A0"] = new SheetSize { Paper = swDwgPaperSizes_e.swDwgPaperA0size, W = 1189, H = 841 },
        };

        static readonly Dictionary<string, string> ModelViews = new Dictionary<string, string>
        {
            ["front"] = "*Front", ["top"] = "*Top", ["right"] = "*Right", ["left"] = "*Left",
            ["bottom"] = "*Bottom", ["back"] = "*Back", ["isometric"] = "*Isometric",
        };

        /// <summary>Preferred drawing scales, largest first (AS 1100 / ISO 5455).</summary>
        static readonly double[][] StandardScales =
        {
            new[] { 10.0, 1 }, new[] { 5.0, 1 }, new[] { 2.0, 1 }, new[] { 1.0, 1 }, new[] { 1.0, 2 }, new[] { 1.0, 5 },
            new[] { 1.0, 10 }, new[] { 1.0, 20 }, new[] { 1.0, 50 }, new[] { 1.0, 100 }, new[] { 1.0, 200 },
        };

        static string Num(double v) => v.ToString("0.###", CultureInfo.InvariantCulture);

        Dictionary<string, object> CreateDrawing(Dictionary<string, object> a)
        {
            var model = Doc(a);
            var kind = Kind(model);
            if (kind != "part" && kind != "assembly")
                throw new UserError($"{model.GetTitle()} is a {kind}: a drawing is made of a part or an assembly.");
            var modelPath = model.GetPathName();
            if (string.IsNullOrEmpty(modelPath) || !File.Exists(modelPath))
                throw new UserError($"{model.GetTitle()} has not been saved yet: save it (sw_save), then make the drawing.");

            var sheetName = J.Str(a, "sheet", "A3");
            if (!Sheets.TryGetValue(sheetName, out var size)) throw new UserError("Sheets: A4, A3, A2, A1, A0.");
            var third = J.Str(a, "projection", "third") != "first";
            var wanted = J.Strs(a, "views");
            var standard = wanted == null || wanted.Count == 0;
            if (!standard)
                foreach (var v in wanted)
                    if (!ModelViews.ContainsKey(v)) throw new UserError("Views: " + string.Join(", ", ModelViews.Keys) + ".");

            var tmpl = app.GetUserPreferenceStringValue((int)swUserPreferenceStringValue_e.swDefaultTemplateDrawing);
            if (string.IsNullOrEmpty(tmpl) || !File.Exists(tmpl))
                throw new UserError("SOLIDWORKS has no default drawing template (Tools > Options > System Options > Default Templates).");

            var notes = new List<object>();
            var ext = Extents(model);   // dx, dy, dz in mm

            // SOLIDWORKS' own automatic scaling of new views would override the scale chosen here
            var autoScale = app.GetUserPreferenceToggle((int)swUserPreferenceToggle_e.swAutomaticScaling3ViewDrawings);
            app.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swAutomaticScaling3ViewDrawings, false);
            IModelDoc2 m = null;
            var done = false;
            try
            {
                m = app.NewDocument(tmpl, (int)size.Paper, size.W / 1000, size.H / 1000) as IModelDoc2;
                if (m == null) throw new UserError("SOLIDWORKS did not make a new drawing from " + tmpl + ".");
                var drw = (IDrawingDoc)m;
                var sheet = drw.GetCurrentSheet() as ISheet;
                var props = sheet?.GetProperties2() as double[];
                // the template may bring its own sheet size: lay out on the sheet there really is
                double sw = size.W, sh = size.H;
                if (props != null && props.Length >= 7 && props[5] > 0 && props[6] > 0)
                {
                    sw = props[5] * 1000;
                    sh = props[6] * 1000;
                    if (Math.Abs(sw - size.W) > 2 || Math.Abs(sh - size.H) > 2)
                        notes.Add($"The drawing template's sheet is {Num(sw)} x {Num(sh)} mm, not {sheetName}; the views are laid out on it. Choose another default drawing template for {sheetName}.");
                }

                double num, den;
                var asked = J.Arr(a, "scale");
                if (asked != null && asked.Count == 2)
                {
                    num = Convert.ToDouble(asked[0], CultureInfo.InvariantCulture);
                    den = Convert.ToDouble(asked[1], CultureInfo.InvariantCulture);
                }
                else
                {
                    var fit = FitScale(ext, sw, sh, standard ? null : wanted);
                    num = fit[0];
                    den = fit[1];
                }
                if (sheet != null && props != null && props.Length >= 7)
                    sheet.SetProperties2((int)props[0], (int)props[1], num, den, !third, props[5], props[6], props.Length > 7 && props[7] != 0);
                else
                    notes.Add("Could not read the sheet's properties: the scale and projection are the template's.");

                // centre marks on holes and slots, centre lines on cylinders: SOLIDWORKS adds them as each view is made
                if (J.Bool(a, "centre_marks", true))
                    foreach (var t in new[]
                             {
                                 swUserPreferenceToggle_e.swDetailingAutoInsertCenterMarksForHoles, swUserPreferenceToggle_e.swDetailingAutoInsertCenterMarksForSlots,
                                 swUserPreferenceToggle_e.swDetailingAutoInsertCenterMarksForHolesAsm, swUserPreferenceToggle_e.swDetailingAutoInsertCenterMarksForSlotsAsm,
                                 swUserPreferenceToggle_e.swDetailingAutoInsertCenterLines,
                             })
                    {
                        try
                        {
                            m.Extension.SetUserPreferenceToggle((int)t, (int)swUserPreferenceOption_e.swDetailingNoOptionSpecified, true);
                        }
                        catch (Exception)
                        {
                        }
                    }

                // views
                if (standard)
                {
                    var made = third ? drw.Create3rdAngleViews2(modelPath) : drw.Create1stAngleViews2(modelPath);
                    if (!made) throw new UserError("SOLIDWORKS could not place the standard views of " + model.GetTitle() + ".");
                    var iso = drw.CreateDrawViewFromModelView3(modelPath, "*Isometric", sw * 0.83 / 1000, sh * 0.70 / 1000, 0) as IView;
                    if (iso == null) notes.Add("The isometric view could not be placed.");
                    ArrangeStandard(drw, iso, sw, sh, notes);
                }
                else
                {
                    var cols = Math.Min(3, wanted.Count);
                    var rows = (wanted.Count + cols - 1) / cols;
                    for (var i = 0; i < wanted.Count; i++)
                    {
                        var x = 20 + (sw - 40) * (i % cols + 0.5) / cols;
                        var y = sh - 20 - (sh - 80) * (i / cols + 0.5) / rows;   // from the top, above the title block
                        if (drw.CreateDrawViewFromModelView3(modelPath, ModelViews[wanted[i]], x / 1000, y / 1000, 0) == null)
                            notes.Add($"The {wanted[i]} view could not be placed.");
                    }
                }

                // dimensions from the model (sketch and feature dimensions marked for drawing, as SOLIDWORKS does by default)
                var dims = 0;
                if (J.Bool(a, "dimensions", true))
                {
                    try
                    {
                        var r = drw.InsertModelAnnotations3((int)swImportModelItemsSource_e.swImportModelItemsFromEntireModel,
                                                            (int)swInsertAnnotation_e.swInsertDimensionsMarkedForDrawing, true, false, false, true);
                        dims = (r as object[])?.Length ?? 0;
                        if (dims == 0)
                            notes.Add("No model dimensions came in: none are marked for drawing, or the views do not show the faces they belong to.");
                        else
                            ArrangeDimensions(m, drw);
                    }
                    catch (Exception ex)
                    {
                        notes.Add("Inserting the model's dimensions failed: " + ex.Message);
                    }
                }

                // title block fields: custom properties of the drawing ($PRP in the sheet format)
                var set = new List<object>();
                var fields = J.Obj(a, "properties");
                if (fields != null && fields.Count > 0)
                {
                    var cpm = m.Extension.get_CustomPropertyManager("");
                    foreach (var kv in fields)
                    {
                        var value = Convert.ToString(kv.Value, CultureInfo.InvariantCulture) ?? "";
                        var res = cpm.Add3(kv.Key, (int)swCustomInfoType_e.swCustomInfoText, value, (int)swCustomPropertyAddOption_e.swCustomPropertyReplaceValue);
                        if (res == (int)swCustomInfoAddResult_e.swCustomInfoAddResult_AddedOrChanged) set.Add(kv.Key);
                        else notes.Add($"Title block property {kv.Key} was not set (SOLIDWORKS returned {res}).");
                    }
                }

                var noteLines = J.Strs(a, "notes");
                if (noteLines.Count > 0)
                {
                    var y = Math.Min(60.0, 15 + 5.5 * noteLines.Count);   // the lowest band, left of a title block
                    foreach (var line in noteLines)
                    {
                        if (drw.CreateText2(line, 17 / 1000.0, y / 1000, 0, 0.0035, 0) == null) notes.Add("A general note could not be placed: " + line);
                        y -= 5.5;
                    }
                }

                drw.EditRebuild();
                m.ViewZoomtofit2();

                var views = new List<object>();
                var outside = new List<string>();
                var first = drw.GetFirstView() as IView;           // the sheet itself
                for (var v = first?.GetNextView() as IView; v != null; v = v.GetNextView() as IView)
                {
                    var o = v.GetOutline() as double[];
                    var name = v.Name;
                    var view = J.O("name", name, "orientation", v.GetOrientationName(), "scale_decimal", v.ScaleDecimal);
                    if (o != null && o.Length >= 4)
                    {
                        view["outline_mm"] = J.L(Math.Round(o[0] * 1000, 1), Math.Round(o[1] * 1000, 1), Math.Round(o[2] * 1000, 1), Math.Round(o[3] * 1000, 1));
                        if (o[0] < 0 || o[1] < 0 || o[2] * 1000 > sw || o[3] * 1000 > sh) outside.Add(name);
                    }
                    views.Add(view);
                }
                if (outside.Count > 0)
                    notes.Add("Off the sheet: " + string.Join(", ", outside) + ". Use a larger sheet or a smaller scale.");

                var folder = string.IsNullOrWhiteSpace(J.Str(a, "folder")) ? Path.GetDirectoryName(modelPath) : Folder(a);
                var stem = SafeName(J.Str(a, "name") ?? Path.GetFileNameWithoutExtension(modelPath));
                string path;
                if (J.Bool(a, "overwrite"))
                {
                    path = Path.Combine(folder, stem + ".SLDDRW");
                    if (app.GetOpenDocumentByName(path) is IModelDoc2 open && !ReferenceEquals(open, m))
                        app.CloseDoc(open.GetTitle());   // the earlier drawing is replaced, as asked
                }
                else path = FreePath(folder, stem, ".SLDDRW");
                int err = 0, warn = 0;
                if (!m.Extension.SaveAs(path, (int)swSaveAsVersion_e.swSaveAsCurrentVersion, (int)swSaveAsOptions_e.swSaveAsOptions_Silent, null, ref err, ref warn))
                    throw new UserError($"SOLIDWORKS made the drawing but could not save it as {path} (error {err}).");
                if (model.GetSaveFlag())
                    notes.Add($"{model.GetTitle()} has unsaved changes: save it (sw_save) so the drawing matches the file.");
                Log.Write("new drawing " + path);
                done = true;

                return J.O("doc", path, "title", m.GetTitle(), "kind", "drawing", "model", modelPath, "template", tmpl,
                           "sheet", J.O("size", sheetName, "width_mm", Math.Round(sw, 1), "height_mm", Math.Round(sh, 1),
                                        "scale", Num(num) + ":" + Num(den), "projection", third ? "third angle" : "first angle"),
                           "model_size_mm", J.L(Math.Round(ext[0], 1), Math.Round(ext[1], 1), Math.Round(ext[2], 1)),
                           "views", views, "dimensions", dims, "properties", set.Count > 0 ? set : null,
                           "active", "The drawing is now the active document.",
                           "notes", notes.Count > 0 ? notes : null);
            }
            finally
            {
                app.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swAutomaticScaling3ViewDrawings, autoScale);
                if (!done && m != null)
                {
                    try
                    {
                        app.CloseDoc(m.GetTitle());   // a half-made drawing is not left open, unsaved
                    }
                    catch (Exception)
                    {
                    }
                }
            }
        }

        const double Margin = 15, TitleBand = 65, Gap = 25;   // mm: border, the band a title block and notes take, room between views

        /// <summary>Where the standard views go [x0, y0, x1, y1] in mm: the left two thirds above the title block band.</summary>
        static double[] GroupArea(double sw, double sh) => new[] { Margin, TitleBand, sw * 0.66, sh - Margin };
        static double[] IsoArea(double sw, double sh) => new[] { sw * 0.66, TitleBand, sw - Margin, sh - Margin };

        static double[] Box(IView v)
        {
            var o = v?.GetOutline() as double[];
            return o == null || o.Length < 4 ? null : new[] { o[0] * 1000, o[1] * 1000, o[2] * 1000, o[3] * 1000 };
        }

        static void MoveBy(IView v, double dx, double dy)
        {
            if (Math.Abs(dx) < 0.01 && Math.Abs(dy) < 0.01) return;
            if (v.Position is double[] p && p.Length >= 2) v.Position = new[] { p[0] + dx / 1000, p[1] + dy / 1000 };
        }

        /// <summary>Moves the front view by (dx, dy), and any projected view that did not follow it by the same amount.</summary>
        static void MoveGroup(IView front, List<IView> children, double dx, double dy)
        {
            var before = children.Select(Box).ToList();
            MoveBy(front, dx, dy);
            for (var i = 0; i < children.Count; i++)
            {
                var now = Box(children[i]);
                if (before[i] == null || now == null) continue;
                MoveBy(children[i], dx - (now[0] - before[i][0]), dy - (now[1] - before[i][1]));
            }
        }

        /// <summary>The standard views as a drafter sets them out: the projected views a fixed gap from the front view
        /// (room for dimensions between them), the group centred in the drawing area above the title block band, and the
        /// isometric centred in its own area to the right. Notes say when they do not fit.</summary>
        void ArrangeStandard(IDrawingDoc drw, IView iso, double sw, double sh, List<object> notes)
        {
            var views = new List<IView>();
            var first = drw.GetFirstView() as IView;   // the sheet
            for (var v = first?.GetNextView() as IView; v != null; v = v.GetNextView() as IView)
                if (!ReferenceEquals(v, iso) && v.Name != iso?.Name) views.Add(v);
            if (views.Count == 0) return;
            var front = views[0];
            var children = views.Skip(1).ToList();
            try
            {
                // 1. a fixed gap between the front view and each projected view
                foreach (var c in children)
                {
                    var f = Box(front);
                    var b = Box(c);
                    if (f == null || b == null) continue;
                    double fx = (f[0] + f[2]) / 2, fy = (f[1] + f[3]) / 2, cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2;
                    if (Math.Abs(cy - fy) > Math.Abs(cx - fx))
                        MoveBy(c, 0, cy > fy ? f[3] + Gap - b[1] : f[1] - Gap - b[3]);   // above or below the front view
                    else
                        MoveBy(c, cx > fx ? f[2] + Gap - b[0] : f[0] - Gap - b[2], 0);   // right or left of it
                }
                // 2. the group centred in its area
                var all = views.Select(Box).Where(x => x != null).ToList();
                if (all.Count > 0)
                {
                    double gx0 = all.Min(x => x[0]), gy0 = all.Min(x => x[1]), gx1 = all.Max(x => x[2]), gy1 = all.Max(x => x[3]);
                    var area = GroupArea(sw, sh);
                    MoveGroup(front, children, (area[0] + area[2]) / 2 - (gx0 + gx1) / 2, (area[1] + area[3]) / 2 - (gy0 + gy1) / 2);
                    if (gx1 - gx0 > area[2] - area[0] || gy1 - gy0 > area[3] - area[1])
                        notes.Add($"The views need {Num(gx1 - gx0)} x {Num(gy1 - gy0)} mm at this scale; the drawing area is {Num(area[2] - area[0])} x {Num(area[3] - area[1])} mm. Use a smaller scale or a larger sheet.");
                }
                // 3. the isometric in its own area
                var ib = Box(iso);
                if (ib != null)
                {
                    var ia = IsoArea(sw, sh);
                    MoveBy(iso, (ia[0] + ia[2]) / 2 - (ib[0] + ib[2]) / 2, (ia[1] + ia[3]) / 2 - (ib[1] + ib[3]) / 2);
                    if (ib[2] - ib[0] > ia[2] - ia[0] || ib[3] - ib[1] > ia[3] - ia[1])
                        notes.Add("The isometric is larger than the space beside the views: leave it out (views without isometric) or use a larger sheet.");
                }
            }
            catch (Exception ex)
            {
                notes.Add("Arranging the views failed part-way: " + ex.Message);
            }
        }

        /// <summary>SOLIDWORKS' Auto Arrange on each view's dimensions: spaced off the outline, smaller inside larger.</summary>
        static void ArrangeDimensions(IModelDoc2 m, IDrawingDoc drw)
        {
            var first = drw.GetFirstView() as IView;
            for (var v = first?.GetNextView() as IView; v != null; v = v.GetNextView() as IView)
            {
                try
                {
                    m.ClearSelection2(true);
                    var n = 0;
                    for (var dd = v.GetFirstDisplayDimension5(); dd != null; dd = dd.GetNext5())
                        if (dd.GetAnnotation() is IAnnotation an && an.Select3(true, null)) n++;
                    if (n > 0) m.Extension.AlignDimensions((int)swAlignDimensionType_e.swAlignDimensionType_AutoArrange, 0.006);
                }
                catch (Exception)
                {
                }
            }
            m.ClearSelection2(true);
        }

        /// <summary>The model's size in mm along X, Y and Z (front view: X across, Y up; top view: X and Z).</summary>
        static double[] Extents(IModelDoc2 model)
        {
            double[] b = null;
            try
            {
                if (model is IPartDoc part) b = part.GetPartBox(true) as double[];
                else if (model is IAssemblyDoc asm) b = asm.GetBox(0) as double[];
            }
            catch (Exception)
            {
            }
            if (b == null || b.Length < 6) return new[] { 100.0, 100.0, 100.0 };
            return new[] { Math.Abs(b[3] - b[0]) * 1000, Math.Abs(b[4] - b[1]) * 1000, Math.Abs(b[5] - b[2]) * 1000 };
        }

        /// <summary>The largest preferred scale at which the views fit the sheet with room between them, clear of the
        /// margins, the title block and (for the standard set) the isometric in the upper right.</summary>
        static double[] FitScale(double[] ext, double sheetW, double sheetH, List<string> custom)
        {
            double needW, needH, roomW, roomH;
            if (custom == null)
            {
                var area = GroupArea(sheetW, sheetH);
                needW = ext[0] + ext[2];   // front + side view side by side
                needH = ext[1] + ext[2];   // front + top one above the other
                roomW = area[2] - area[0] - Gap;
                roomH = area[3] - area[1] - Gap;
            }
            else
            {
                var cols = Math.Min(3, custom.Count);
                var rows = (custom.Count + cols - 1) / cols;
                var big = Math.Max(ext[0], Math.Max(ext[1], ext[2])) * 1.25;
                needW = big * cols;
                needH = big * rows;
                roomW = sheetW - 40;
                roomH = sheetH - 80;
            }
            foreach (var s in StandardScales)
                if (needW * s[0] / s[1] <= roomW && needH * s[0] / s[1] <= roomH) return s;
            return StandardScales[StandardScales.Length - 1];
        }
    }
}
