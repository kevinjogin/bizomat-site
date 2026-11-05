using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using OpenSketch.Sw.Core;

namespace OpenSketch.Sw.Bridge
{
    /// <summary>Which commands destroy or replace something, in plain words for the confirmation the person sees in
    /// SOLIDWORKS (Safety.Ask in the add-in). The gateway marks the same ones risk "high" (devicebridge.risk_of).</summary>
    public static class Destructive
    {
        /// <summary>What the command would destroy or replace, in plain words; null when it needs no confirmation.</summary>
        public static string Describe(string op, Dictionary<string, object> a)
        {
            switch (op)
            {
                case "delete":
                    if (J.Bool(a, "dry_run")) return null;
                    var parts = new List<string>();
                    void Add(string key, string what)
                    {
                        var names = J.Strs(a, key);
                        if (names != null && names.Count > 0)
                            parts.Add(what + (names.Count > 1 ? "s" : "") + " " + string.Join(", ", names.Take(12)) + (names.Count > 12 ? $" and {names.Count - 12} more" : ""));
                    }
                    Add("features", "feature");
                    Add("components", "component");
                    Add("mates", "mate");
                    return parts.Count == 0 ? null : "Delete " + string.Join("; ", parts) + " (and what depends on them).";
                case "undo":
                    var n = Math.Max(1, J.Int(a, "steps", 1));
                    return n == 1 ? "Undo the last change." : $"Undo the last {n} changes.";
                case "save":
                    var path = J.Str(a, "path");
                    if (string.IsNullOrEmpty(path)) return null;
                    return File.Exists(path) ? $"Save As {path}, replacing the file that is there." : $"Save As {path}.";
                case "create_drawing":
                    return J.Bool(a, "overwrite") ? "Make the drawing again, replacing an existing drawing of the same name (if it is open, it is closed without saving)." : null;
                case "set_parameter":
                    return J.Bool(a, "remove") ? $"Remove the global variable {J.Str(a, "name")} (equations that use it break)." : null;
                case "edit_drawing":
                    var views = (J.Arr(a, "actions") ?? new List<object>()).Select(J.Obj).Where(x => J.Str(x, "do") == "delete").Select(x => J.Str(x, "view")).ToList();
                    return views.Count == 0 ? null : "Delete the drawing view" + (views.Count > 1 ? "s " : " ") + string.Join(", ", views) + ".";
                default:
                    return null;
            }
        }

    }
}
