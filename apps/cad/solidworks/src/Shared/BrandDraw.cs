using System.Drawing;
using System.Drawing.Drawing2D;

namespace OpenSketch.Sw.Core
{
    /// <summary>
    /// The BIZOMAT wordmark and mark (Core/BrandArt.cs) drawn with GDI+: the add-in's icons and task pane, and the
    /// Companion's tray icon. Compiled into those two Windows programs only (the Linux tests compile Core, which has no
    /// drawing in it). Callers draw inside their own try/catch: nothing here may close SOLIDWORKS.
    /// </summary>
    static class BrandDraw
    {
        public static Color C(int[] rgb) => Color.FromArgb(rgb[0], rgb[1], rgb[2]);

        static GraphicsPath PathOf(string d, float scale, float dx, float dy)
        {
            var p = new GraphicsPath(FillMode.Alternate);   // even-odd, as the SVG
            foreach (var poly in BrandArt.Polygons(d))
            {
                var pts = new PointF[poly.Length / 2];
                for (var k = 0; k < pts.Length; k++) pts[k] = new PointF(dx + poly[2 * k] * scale, dy + poly[2 * k + 1] * scale);
                p.AddPolygon(pts);
            }
            return p;
        }

        public static GraphicsPath Rounded(RectangleF r, float rad)
        {
            var p = new GraphicsPath();
            var d = rad * 2;
            p.AddArc(r.X, r.Y, d, d, 180, 90);
            p.AddArc(r.Right - d, r.Y, d, d, 270, 90);
            p.AddArc(r.Right - d, r.Bottom - d, d, d, 0, 90);
            p.AddArc(r.X, r.Bottom - d, d, d, 90, 90);
            p.CloseFigure();
            return p;
        }

        /// <summary>The wordmark, `height` pixels tall, at (x, y): navy word, teal connector bar. Returns its width.</summary>
        public static float Wordmark(Graphics g, float x, float y, float height)
        {
            var s = height / BrandArt.Height;
            using (var word = PathOf(BrandArt.WordmarkPath, s, x, y))
            using (var bar = PathOf(BrandArt.BarPath, s, x, y))
            using (var navy = new SolidBrush(C(BrandArt.Navy)))
            using (var teal = new SolidBrush(C(BrandArt.Teal)))
            {
                g.FillPath(navy, word);
                g.FillPath(teal, bar);
            }
            return BrandArt.WordmarkWidth * s;
        }

        /// <summary>The B with its teal bar, centred in `r` at 58.6 % of its width (as in shared/brand/build.mjs).</summary>
        public static void B(Graphics g, RectangleF r, Color letter)
        {
            var s = r.Width * 0.586f / BrandArt.BWidth;
            var dx = r.X + r.Width / 2 - BrandArt.BWidth / 2 * s;
            var dy = r.Y + r.Height / 2 - BrandArt.Height / 2 * s;
            using (var b = PathOf(BrandArt.BPath, s, dx, dy))
            using (var bar = PathOf(BrandArt.BarPath, s, dx, dy))
            using (var fill = new SolidBrush(letter))
            using (var teal = new SolidBrush(C(BrandArt.TealMark)))
            {
                g.FillPath(fill, b);
                g.FillPath(teal, bar);
            }
        }

        /// <summary>The mark: the white B with its teal bar on a navy rounded tile (as the favicon).</summary>
        public static void Mark(Graphics g, RectangleF r)
        {
            using (var tile = Rounded(r, r.Width * 0.22f))
            using (var navy = new SolidBrush(C(BrandArt.Navy)))
                g.FillPath(navy, tile);
            B(g, r, Color.White);
        }
    }
}
