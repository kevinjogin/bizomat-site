using System;
using System.Collections.Generic;
using System.Linq;
using OpenSketch.Sw.Core;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;

namespace OpenSketch.Sw
{
    /// <summary>What a batch has made, so it can be taken out again if a later step fails: features (and the
    /// sketches they absorbed), components, mates, and the equations and global variables it changed.</summary>
    public sealed class Journal
    {
        public readonly List<(IModelDoc2 doc, string feature)> Features = new List<(IModelDoc2, string)>();
        public readonly List<(IModelDoc2 asm, string component)> Components = new List<(IModelDoc2, string)>();
        public readonly List<(IModelDoc2 doc, List<string> equations)> EquationsBefore = new List<(IModelDoc2, List<string>)>();

        public void Feature(IModelDoc2 doc, string name) => Features.Add((doc, name));
        public void Component(IModelDoc2 asm, string name) => Components.Add((asm, name));

        public void Equations(IModelDoc2 doc)
        {
            if (EquationsBefore.Any(e => ReferenceEquals(e.doc, doc))) return;
            var em = doc.GetEquationMgr() as IEquationMgr;
            var l = new List<string>();
            if (em != null)
                for (var i = 0; i < em.GetCount(); i++) l.Add(em.get_Equation(i));
            EquationsBefore.Add((doc, l));
        }

        /// <summary>Removes everything in reverse order. Returns what could not be removed.</summary>
        public List<string> Rollback()
        {
            var left = new List<string>();
            for (var i = Features.Count - 1; i >= 0; i--)
            {
                var (doc, name) = Features[i];
                if (!Commands.DeleteFeature(doc, name, true)) left.Add(name);
            }
            for (var i = Components.Count - 1; i >= 0; i--)
            {
                var (asm, name) = Components[i];
                try
                {
                    var c = ((IAssemblyDoc)asm).GetComponentByName(name) as IComponent2;
                    asm.ClearSelection2(true);
                    if (c == null || !c.Select4(false, null, false) || !asm.Extension.DeleteSelection2(0)) left.Add(name);
                }
                catch (Exception)
                {
                    left.Add(name);
                }
            }
            foreach (var (doc, eqs) in EquationsBefore)
            {
                try
                {
                    var em = (IEquationMgr)doc.GetEquationMgr();
                    for (var k = em.GetCount() - 1; k >= 0; k--) em.Delete(k);
                    foreach (var e in eqs) Commands.AddEquation(em, e);
                    doc.ForceRebuild3(false);
                }
                catch (Exception ex)
                {
                    left.Add("equations: " + ex.Message);
                }
            }
            foreach (var d in Features.Select(f => f.doc).Concat(Components.Select(c => c.asm)).Distinct())
            {
                try
                {
                    d.ForceRebuild3(false);
                }
                catch (Exception)
                {
                }
            }
            return left;
        }
    }

    public sealed partial class Commands
    {
        /// <summary>Deletes one feature (and with absorbed=true the sketch it used). True if it is gone.</summary>
        public static bool DeleteFeature(IModelDoc2 m, string name, bool absorbed)
        {
            try
            {
                var f = Feature(m, name);
                if (f == null) return true;
                m.ClearSelection2(true);
                if (!f.Select2(false, 0)) return false;
                var opts = absorbed ? (int)swDeleteSelectionOptions_e.swDelete_Absorbed : 0;
                if (!m.Extension.DeleteSelection2(opts))
                {
                    m.ClearSelection2(true);
                    f.Select2(false, 0);
                    m.EditDelete();
                }
                m.ClearSelection2(true);
                return Feature(m, name) == null;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
