using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using OpenSketch.Sw.Core;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;

namespace OpenSketch.Sw
{
    /// <summary>Deleting, global variables and equations (SOLIDWORKS' own), and batches that are taken out again
    /// when a step fails.</summary>
    public sealed partial class Commands
    {
        Dictionary<string, object> Delete(Dictionary<string, object> a)
        {
            var m = Doc(a, true);
            var dry = J.Bool(a, "dry_run");
            var feats = J.Strs(a, "features");
            var comps = J.Strs(a, "components");
            var mates = J.Strs(a, "mates");
            if (feats.Count + comps.Count + mates.Count == 0) throw new UserError("Name features, components or mates to delete.");
            var plan = new List<object>();
            var missing = new List<string>();
            foreach (var n in feats.Concat(mates))
            {
                var f = Feature(m, n);
                if (f == null)
                {
                    missing.Add(n);
                    continue;
                }
                var children = (f.GetChildren() as object[] ?? new object[0]).OfType<IFeature>().Select(x => x.Name).ToList();
                var sub = f.GetFirstSubFeature() as IFeature;
                plan.Add(J.O("feature", f.Name, "type", f.GetTypeName2(), "absorbed", sub?.Name,
                             "depend_on_it", children.Count > 0 ? children : null));
            }
            foreach (var n in comps)
            {
                if (Kind(m) != "assembly")
                {
                    missing.Add(n);
                    continue;
                }
                plan.Add(J.O("component", Component(m, n).Name2));
            }
            if (missing.Count > 0) throw new UserError("Not found: " + string.Join(", ", missing) + ". Read the names with sw_get_document.");
            if (dry)
                return J.O("doc", Ref(m), "dry_run", true, "would_delete", plan,
                           "note", "Features that depend on a deleted one stay and show an error, as in SOLIDWORKS.");
            var gone = new List<object>();
            var left = new List<object>();
            foreach (var n in feats.Concat(mates))
                (DeleteFeature(m, n, true) ? gone : left).Add(n);
            foreach (var n in comps)
            {
                m.ClearSelection2(true);
                var c = Component(m, n);
                var ok = c.Select4(false, null, false) && m.Extension.DeleteSelection2(0);
                (ok ? gone : left).Add(n);
            }
            m.ClearSelection2(true);
            m.EditRebuild3();
            var problems = Tree(m).Select(f => FeatureRow(f, false)).Where(r => r.ContainsKey("reason")).Cast<object>().ToList();
            return J.O("doc", Ref(m), "deleted", gone, "not_deleted", left.Count > 0 ? left : null,
                       "problems_now", problems.Count > 0 ? problems : null);
        }

        // ------------------------------------------------------------------------- global variables and equations

        static string Lhs(string eq)
        {
            var mt = Regex.Match(eq ?? "", "^\\s*\"([^\"]+)\"\\s*=");
            return mt.Success ? mt.Groups[1].Value : null;
        }

        static int FindEquation(IEquationMgr em, string lhs)
        {
            for (var i = 0; i < em.GetCount(); i++)
                if (string.Equals(Lhs(em.get_Equation(i)), lhs, StringComparison.OrdinalIgnoreCase)) return i;
            return -1;
        }

        /// <summary>Appends an equation (index -1) in all configurations; Add2 for parts Add3 refuses (made before 2014).</summary>
        public static int AddEquation(IEquationMgr em, string text)
        {
            var r = em.Add3(-1, text, true, (int)swInConfigurationOpts_e.swAllConfiguration, null);
            if (r < 0) r = em.Add2(-1, text, true);
            return r;
        }

        static HashSet<string> Globals(IEquationMgr em)
        {
            var o = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            for (var i = 0; i < em.GetCount(); i++)
                if (em.get_GlobalVariable(i) && Lhs(em.get_Equation(i)) is string n) o.Add(n);
            return o;
        }

        static readonly HashSet<string> Functions = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "sin", "cos", "tan", "asin", "acos", "atan", "abs", "sqr", "sqrt", "int", "round", "sgn", "log", "exp", "pi",
            "min", "max", "if", "and", "or", "not", "mm", "cm", "m", "in", "ft", "deg", "rad", "iif"
        };

        /// <summary>An OpenSketch expression in SOLIDWORKS' form: global variables in quotes, ^ kept, sqrt as sqr.</summary>
        static string SwExpression(string expr, HashSet<string> globals)
        {
            if (expr == null) return null;
            var sb = new StringBuilder();
            var i = 0;
            while (i < expr.Length)
            {
                var ch = expr[i];
                if (ch == '"')
                {
                    var j = expr.IndexOf('"', i + 1);
                    if (j < 0) j = expr.Length - 1;
                    sb.Append(expr, i, j - i + 1);
                    i = j + 1;
                    continue;
                }
                if (char.IsLetter(ch) || ch == '_')
                {
                    var j = i;
                    while (j < expr.Length && (char.IsLetterOrDigit(expr[j]) || expr[j] == '_' || expr[j] == '@' || expr[j] == '-' && j + 1 < expr.Length && char.IsLetter(expr[j + 1]) && expr.Substring(i, j - i).Contains("@"))) j++;
                    var word = expr.Substring(i, j - i);
                    if (globals.Contains(word) || word.Contains("@")) sb.Append('"').Append(word).Append('"');
                    else if (word.Equals("sqrt", StringComparison.OrdinalIgnoreCase)) sb.Append("sqr");
                    else sb.Append(word);
                    i = j;
                    continue;
                }
                sb.Append(ch);
                i++;
            }
            return sb.ToString();
        }

        Dictionary<string, object> SetParameter(Dictionary<string, object> a, Journal journal)
        {
            var m = Doc(a);
            var name = J.Str(a, "name");
            if (string.IsNullOrWhiteSpace(name) || !Regex.IsMatch(name, "^[A-Za-z_][A-Za-z0-9_]*$"))
                throw new UserError("A variable name is a letter or _, then letters, digits or _.");
            var em = (IEquationMgr)m.GetEquationMgr();
            journal?.Equations(m);
            var i = FindEquation(em, name);
            if (J.Bool(a, "remove"))
            {
                if (i < 0) throw new UserError($"No global variable {name}.");
                em.Delete(i);
                m.ForceRebuild3(false);
                return J.O("doc", Ref(m), "removed", name, "equations", Equations(m));
            }
            var expr = J.Str(a, "expression");
            if (string.IsNullOrWhiteSpace(expr)) throw new UserError("Give an expression (a number or an equation of other variables).");
            var text = $"\"{name}\" = {SwExpression(expr, Globals(em))}";
            var comment = J.Str(a, "comment");
            if (!string.IsNullOrEmpty(comment)) text += " '" + comment.Replace("'", "");
            int r;
            if (i >= 0)
            {
                em.set_Equation(i, text);
                r = i;
            }
            else r = AddEquation(em, text);
            m.ForceRebuild3(false);
            var idx = FindEquation(em, name);
            if (r < 0 || idx < 0) throw new UserError($"SOLIDWORKS did not take {text}. Check the expression (SOLIDWORKS equation syntax).");
            return J.O("doc", Ref(m), "variable", name, "equation", em.get_Equation(idx), "value", R(em.get_Value(idx), 6),
                       "status", em.Status == 0 ? "ok" : "error " + em.Status, "equations", Equations(m));
        }

        Dictionary<string, object> SetEquation(Dictionary<string, object> a, Journal journal)
        {
            var m = Doc(a);
            var target = J.Str(a, "target") ?? throw new UserError("target is missing.");
            var dim = DimensionName(m, target);
            var em = (IEquationMgr)m.GetEquationMgr();
            journal?.Equations(m);
            var i = FindEquation(em, dim);
            var expr = J.Str(a, "expression");
            if (string.IsNullOrWhiteSpace(expr))
            {
                if (i >= 0) em.Delete(i);
                m.ForceRebuild3(false);
                return J.O("doc", Ref(m), "removed", dim, "equations", Equations(m));
            }
            var text = $"\"{dim}\" = {SwExpression(expr, Globals(em))}";
            if (i >= 0) em.set_Equation(i, text);
            else AddEquation(em, text);
            m.ForceRebuild3(false);
            var idx = FindEquation(em, dim);
            if (idx < 0) throw new UserError($"SOLIDWORKS did not take {text}.");
            return J.O("doc", Ref(m), "equation", em.get_Equation(idx), "value", R(em.get_Value(idx), 6),
                       "status", em.Status == 0 ? "ok" : "error " + em.Status, "equations", Equations(m));
        }

        /// <summary>"D1@Sketch1" as is; "Boss-Extrude1.depth" -> that feature's dimension for the field.</summary>
        string DimensionName(IModelDoc2 m, string target)
        {
            if (target.Contains("@")) return target;
            var dot = target.LastIndexOf('.');
            if (dot <= 0) throw new UserError("target is a dimension (\"D1@Sketch1\") or <feature name>.<field> (\"Boss-Extrude1.depth\").");
            var feat = Feature(m, target.Substring(0, dot)) ?? throw new UserError($"No feature {target.Substring(0, dot)}.");
            var field = target.Substring(dot + 1).ToLowerInvariant();
            var lin = new List<IDimension>();
            var ang = new List<IDimension>();
            var ints = new List<IDimension>();
            var dd = feat.GetFirstDisplayDimension() as IDisplayDimension;
            var guard = 0;
            while (dd != null && guard++ < 100)
            {
                if (dd.GetDimension2(0) is IDimension d)
                {
                    var t = d.GetType();
                    if (t == (int)swDimensionParamType_e.swDimensionParamTypeDoubleAngular) ang.Add(d);
                    else if (t == (int)swDimensionParamType_e.swDimensionParamTypeInteger) ints.Add(d);
                    else lin.Add(d);
                }
                dd = feat.GetNextDisplayDimension(dd) as IDisplayDimension;
            }
            IDimension pick = null;
            switch (field)
            {
                case "depth":
                case "radius":
                case "distance":
                case "thickness":
                case "offset":
                case "spacing":
                case "diameter":
                    pick = lin.FirstOrDefault();
                    break;
                case "dir2.depth":
                case "distance2":
                case "spacing2":
                    pick = lin.Skip(1).FirstOrDefault();
                    break;
                case "angle":
                case "draft":
                case "step":
                    pick = ang.FirstOrDefault();
                    break;
                case "count":
                    pick = ints.FirstOrDefault();
                    break;
                case "count2":
                    pick = ints.Skip(1).FirstOrDefault();
                    break;
            }
            if (pick == null)
            {
                var all = lin.Concat(ang).Concat(ints).Select(d => $"{d.FullName} = {(d.GetType() == (int)swDimensionParamType_e.swDimensionParamTypeDoubleAngular ? Units.Deg(d.SystemValue) : d.SystemValue * 1000):0.###}");
                throw new UserError($"No {field} dimension on {feat.Name}. Its dimensions: {string.Join(", ", all)}. Give one of them as target.");
            }
            return pick.FullName;
        }

        // ------------------------------------------------------------------------- batch

        Dictionary<string, object> Batch(Dictionary<string, object> a)
        {
            var steps = J.Arr(a, "steps") ?? throw new UserError("steps is missing.");
            var stopOnWarn = J.Bool(a, "stop_on_warnings");
            var j = new Journal();
            var results = new List<object>();
            for (var i = 0; i < steps.Count; i++)
            {
                var st = J.Obj(steps[i]) ?? throw new UserError("Each step must be an object.");
                var op = J.Str(st, "op");
                var args = J.Obj(st, "args") ?? new Dictionary<string, object>();
                if (!args.ContainsKey("doc") && a.ContainsKey("doc")) args["doc"] = a["doc"];
                Dictionary<string, object> res = null;
                string why = null;
                try
                {
                    using (new Quiet(app))
                    {
                        switch (op)
                        {
                            case "add_features": res = AddFeatures(args, j); break;
                            case "insert_component": res = InsertComponent(args, j); break;
                            case "add_mate": res = AddMate(args, j); break;
                            case "set_parameter": res = SetParameter(args, j); break;
                            case "set_equation": res = SetEquation(args, j); break;
                            default: throw new UserError($"{op} cannot be part of a batch.");
                        }
                    }
                    if (stopOnWarn && HasWarning(res)) why = "warnings (stop_on_warnings): " + Json.Write(Warnings(res));
                }
                catch (UserError ex)
                {
                    why = ex.Message;
                    res = ex.Detail ?? res;
                }
                catch (Exception ex)
                {
                    why = BridgeClient.Describe(ex);
                    Log.Write("batch step " + i + ": " + ex);
                }
                if (why != null)
                {
                    var left = j.Rollback();
                    var fail = J.O("ok", false, "completed", i, "failed", J.O("index", i, "op", op, "error", why, "report", res),
                                   "rolled_back", left.Count == 0, "results", results);
                    if (left.Count > 0) fail["not_removed"] = left;
                    else fail["note"] = "Everything the batch made was removed again. Fix that step and send the whole batch again.";
                    throw new UserError("Step " + i + " (" + op + ") failed: " + why, fail);
                }
                results.Add(J.O("index", i, "op", op, "result", res));
            }
            return J.O("ok", true, "completed", steps.Count, "results", results);
        }

        static bool HasWarning(object o) => Warnings(o).Count > 0;

        static List<object> Warnings(object o)
        {
            var l = new List<object>();
            void walk(object x)
            {
                if (x is Dictionary<string, object> d)
                {
                    if (J.Str(d, "state") == "warning") l.Add(J.O("name", J.Str(d, "name") ?? J.Str(d, "id"), "reason", J.Str(d, "reason"), "notes", d.TryGetValue("notes", out var n) ? n : null));
                    foreach (var v in d.Values) walk(v);
                }
                else if (x is List<object> a)
                    foreach (var v in a) walk(v);
            }
            walk(o);
            return l;
        }
    }
}
