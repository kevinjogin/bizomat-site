using System;
using System.Collections.Generic;
using System.Globalization;

namespace OpenSketch.Sw.Core
{
    /// <summary>
    /// The BIZOMAT names and logo for what people see in SOLIDWORKS and in the Companion. The logo is drawn from these
    /// paths (no image files to ship): the brand's own (shared/brand/glyphs.mjs, the same as opensketch/bizomat_brand.py),
    /// straight lines only, filled even-odd. Navy word, teal connector bar (the middle bar of the B). Only plain numbers
    /// here, so the Linux tests compile it; the add-in and the Companion draw it with GDI+.
    /// </summary>
    public static class BrandArt
    {
        public const string Platform = "BIZOMAT";
        public const string Product = "BIZOMAT CAD Automation";
        public const string ShortProduct = "CAD Automation";
        public const string Companion = "BIZOMAT Companion";
        public const string Package = "BIZOMAT CAD Automation for SOLIDWORKS";
        public const string PlatformUrl = "https://bizomat.ai/";

        /// <summary>The CommandManager tab is named after the platform. Tabs of earlier versions stay in SOLIDWORKS'
        /// settings until removed: "KEVOS" (0.11 and earlier) and "CADOS" (0.12.0 to 0.12.2).</summary>
        public const string TabName = Platform;
        public static readonly string[] OldTabNames = { "KEVOS", "CADOS" };

        /// <summary>The tabs to remove before the tab is made again: the earlier names, then this one.</summary>
        public static string[] TabsToReplace()
        {
            var all = new string[OldTabNames.Length + 1];
            OldTabNames.CopyTo(all, 0);
            all[OldTabNames.Length] = TabName;
            return all;
        }

        public const float WordmarkWidth = 2329f, Height = 241f, BWidth = 332f;
        public const string WordmarkPath = "M33 4L256 4L310 58L310 110L332 132L332 237L54 237L0 183L0 48L50 48L50 96L261 96L261 49L104 49L76 40L63 33L48 21ZM50 141L283 141L283 192L50 192ZM382 4L432 4L432 237L382 237ZM482 4L814 4L814 49L574 192L814 192L814 237L482 237L482 192L722 49L482 49ZM897 4L1142 4L1196 58L1196 237L918 237L864 183L864 48L914 48L914 192L1147 192L1147 49L968 49L940 40L927 33L912 21ZM1246 4L1302 4L1456 150L1610 4L1666 4L1666 237L1616 237L1616 63L1456 215L1296 63L1296 237L1246 237ZM1678 237L1734 237L1864 4L1808 4ZM1876 4L1932 4L2062 237L2006 237ZM1770 142L1970 142L1970 186L1770 186ZM1997 4L2329 4L2329 49L2188 49L2188 237L2138 237L2138 49L1997 49Z";
        public const string BPath = "M33 4L256 4L310 58L310 110L332 132L332 237L54 237L0 183L0 48L50 48L50 96L261 96L261 49L104 49L76 40L63 33L48 21ZM50 141L283 141L283 192L50 192Z";
        public const string BarPath = "M50 96L272 96L272 141L50 141Z";

        // RGB
        public static readonly int[] Navy = { 10, 31, 51 };        // #0a1f33, the wordmark
        public static readonly int[] Teal = { 15, 118, 110 };      // #0f766e, buttons, links, the bar on white
        public static readonly int[] TealHover = { 17, 94, 89 };   // #115e59
        public static readonly int[] TealMark = { 20, 184, 166 };  // #14b8a6, the bar on the navy mark
        public static readonly int[] Ink = { 14, 23, 38 };         // #0e1726
        public static readonly int[] Ink2 = { 51, 65, 85 };        // #334155
        public static readonly int[] Muted = { 86, 101, 122 };     // #56657a
        public static readonly int[] Paper = { 247, 249, 251 };    // #f7f9fb
        public static readonly int[] Line = { 226, 232, 240 };
        public static readonly int[] Amber = { 245, 158, 11 };     // #f59e0b, the signal colour (never text)

        /// <summary>The closed polygons of a path of M, L and Z commands, each as x0, y0, x1, y1, ...</summary>
        public static List<float[]> Polygons(string d)
        {
            var polys = new List<float[]>();
            var cur = new List<float>();
            var i = 0;

            float Number()
            {
                while (i < d.Length && (d[i] == ' ' || d[i] == ',')) i++;
                var start = i;
                while (i < d.Length && (char.IsDigit(d[i]) || d[i] == '.' || d[i] == '-')) i++;
                if (start == i) throw new FormatException("a number was expected at " + start);
                return float.Parse(d.Substring(start, i - start), NumberStyles.Float, CultureInfo.InvariantCulture);
            }

            void Close()
            {
                if (cur.Count >= 6) polys.Add(cur.ToArray());
                cur.Clear();
            }

            while (i < d.Length)
            {
                var c = d[i];
                if (c == 'M')
                {
                    Close();
                    i++;
                    cur.Add(Number());
                    cur.Add(Number());
                }
                else if (c == 'L')
                {
                    i++;
                    cur.Add(Number());
                    cur.Add(Number());
                }
                else if (c == 'Z' || c == 'z')
                {
                    i++;
                    Close();
                }
                else if (char.IsWhiteSpace(c) || c == ',')
                {
                    i++;
                }
                else
                {
                    throw new FormatException("only M, L and Z are drawn (" + c + " at " + i + ")");
                }
            }
            Close();
            return polys;
        }
    }
}
